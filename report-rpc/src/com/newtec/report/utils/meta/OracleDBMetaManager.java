/**
 * @Title: OracelDBMetaManager.java
 * @Package com.newtec.lottery.utils.meta
 * @Description: (用一句话描述该文件做什么)
 * @Author 朱才富
 * @Version V1.0
 */
package com.newtec.report.utils.meta;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.common.dto.DBTableMeta;
import com.newtec.report.common.entity.MyqdpDatasource;
import com.newtec.report.common.entity.meta.DBFieldMeta;
import com.newtec.report.common.entity.meta.DBForeignKeyMeta;
import com.newtec.report.common.entity.meta.DBIndexMeta;
import com.newtec.rpc.db.DBManager;
import com.newtec.rpc.db.DBexecute;

/**
 * @Author 朱才富
 * @Description: Oracle 数据库元数据管理工具
 */
public class OracleDBMetaManager extends DBMetaManager {
	
	/**
	 * 查询数据库中所有的表，从 Oracle 的元数据视图 USER_TAB_COMMENTS 查询表信息
	 * @param datasource 数据库连接
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<DBTableMeta> getTables(MyqdpDatasource datasource) throws CustomException{
		String sql = "SELECT * FROM USER_TAB_COMMENTS";
		List<Object[]> results = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		List<String> excludeTableNames = getRecycleMetaName(datasource, "TABLE"); // 排除掉Oracle 的 recyclebin 中被删除的表
		List<DBTableMeta> tables = new ArrayList<DBTableMeta>();
		for(Object[] result : results) {
			if(result == null || result.length < 3 || excludeTableNames.contains(result[0])) continue;
			tables.add(new DBTableMeta(result[0]+"", result[2] == null ? result[0]+"" : (String) result[2]));
		}
		Collections.sort(tables, new Comparator<DBTableMeta>(){
            @Override
            public int compare(DBTableMeta o1, DBTableMeta o2) {
            	return o1.getName().compareTo(o2.getName());
            }
        });
		return tables;
	}

	/**
	 * 方法说明：获得表的所有字段（先查询 DBFieldMeta 中保存的元数据信息，然后再查询 USER_TAB_COLUMNS 获取的其他元数据信息与前面查询出来的字段信息合并）
	 * @param datasource 数据库连接
	 * @param tableName 表名称
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<DBFieldMeta> getFieldsByTableName(MyqdpDatasource datasource, String tableName) throws CustomException{
		// 从 DBFieldMeta 查询此数据库表的信息
		List<DBFieldMeta> result = ReportDBManager.get()
				.createQuery("FROM DBFieldMeta WHERE TABLE_NAME=?", DBFieldMeta.class)
				.setParameter(1, getFullTableName(datasource.getId(), tableName))
				.getResultList();
		if(result == null || result.size() < 1) { // 如果 DBFieldMeta 中不存在此表的字段信息，则直接查询元数据库表 USER_TAB_COLUMNS
			List<DBFieldMeta> fields = getFieldsByTableNameFromMetaTable(datasource, tableName);
			ReportDBManager.execute(new DBexecute<String>() {
				@Override
				public String execute(EntityManager em) throws CustomException {
					for(DBFieldMeta field : fields) {
						em.persist(field);
					}
					return null;
				}
			});
			result = fields;
		} else { // 如果存在，查询 USER_TAB_COLUMNS 将信息与上面查询出来的 result 字段信息
			Map<String, DBFieldMeta> metaMap = new HashMap<String, DBFieldMeta>();
			for(DBFieldMeta meta : result) {
				metaMap.put(meta.getName(), meta);
			}
			// 从 USER_TAB_COLUMNS 查字段信息
			String where = " WHERE c1.TABLE_NAME='" + tableName + "'";
			String sql = "SELECT c1.COLUMN_NAME, c1.DATA_TYPE, c1.DATA_LENGTH, c1.DATA_DEFAULT, c1.NULLABLE, c1.COLUMN_ID FROM USER_TAB_COLUMNS c1 " + where;
			
			// 从 DBA_TAB_COLUMNS 查字段信息
			// String where = " WHERE c1.OWNER = '" + datasource.getUserName().toUpperCase() + "'" + " AND c1.TABLE_NAME='" + tableName + "'";
			// String sql = "SELECT c1.COLUMN_NAME, c1.DATA_TYPE, c1.DATA_LENGTH, c1.DATA_DEFAULT, c1.NULLABLE, c1.COLUMN_ID FROM DBA_TAB_COLUMNS c1 " + where;
			
			List<String> primaryKeys = getConstraintColumnNames(datasource, tableName, "P");
			List<String> uniqueColumns = getConstraintColumnNames(datasource, tableName, "U");
			List<Object[]> tResults = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
			for(Object[] tResult : tResults) {
				if(tResult == null || tResult.length < 6) continue;
				String name = (String) tResult[0];
				DBFieldMeta field = metaMap.get(name);
				if(field == null) continue;
				if(primaryKeys.contains(name)) {
					field.setIsPk(DBFieldMeta.YES);
				}
				if(uniqueColumns.contains(name)) {
					field.setIsUnique(DBFieldMeta.YES);
				}
				field.setType((String) tResult[1]);
				field.setLength(tResult[2] == null ? null : Integer.parseInt(String.valueOf(tResult[2].toString())));
				field.setDefaultValue((String) tResult[3]);
				field.setNullable(tResult[4] == null ? DBFieldMeta.YES : "Y".equals(tResult[4].toString()) ? DBFieldMeta.YES : DBFieldMeta.NO);
				field.setColumnId(StringUtils.toInt(tResult[5], 0));
			}
		}
		// 根据字段的COLUMN_ID对字段进行排序
		Collections.sort(result, new Comparator<DBFieldMeta>(){
            @Override
            public int compare(DBFieldMeta o1, DBFieldMeta o2) {
            	return o1.getColumnId() - o2.getColumnId();
            }
        });
		return result;
	}
	
	/**
	 * 获取数据库表的所有外键
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<DBForeignKeyMeta> getForeignKeys(MyqdpDatasource datasource, String tableName) throws CustomException {
        return getForeignKeysByTableNameFromMetaTable(datasource, tableName);
    }

	/**
	 * 添加外键
	 * @param datasource 数据库连接
	 * @param constraintName 约束名称
	 * @param tableName 表名
	 * @param fieldName 字段名
	 * @param rTableName 关联表名
	 * @param rColumnName 关联字段名
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void addForeignKey(MyqdpDatasource datasource, String constraintName, String tableName, String schema, String fieldName, String rTableName, String rSchema, String rColumnName) throws CustomException {
		addForeignKey(datasource, constraintName, tableName, schema, fieldName, rTableName, rSchema, rColumnName, null);
	}
	
	/**
	 * 添加外键（执行 Alter 语句在对应数据库上添加真实外键）
	 * @param datasource 数据库连接
	 * @param constraintName 约束名称
	 * @param tableName 表名
	 * @param fieldName 字段名
	 * @param rTableName 关联表名
	 * @param rColumnName 关联字段名
	 * @param deleteRule 删除规则
	 * @param status 状态
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void addForeignKey(MyqdpDatasource datasource, String constraintName, String tableName, String schema, String fieldName,
			String rTableName, String rSchema, String rColumnName, String deleteRule) throws CustomException {
		String sql = "ALTER TABLE " + getPrefixSchema(schema) + tableName + " ADD CONSTRAINT " + constraintName + " FOREIGN KEY(" + fieldName + ") REFERENCES " + getPrefixSchema(rSchema) + rTableName + "(" + rColumnName + ")";
		if(!StringUtils.isStrNull(deleteRule)) {
			sql += "ON DELETE " + deleteRule;
		}
		final String oSql = sql;
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery(oSql).executeUpdate();
				return null;
			}
		}, datasource.getId());
	}
	
	/**
	 * 删除外键
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param fieldName 字段名
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void removeForeignKey(MyqdpDatasource datasource, String tableName, String constraintName, String schema) throws CustomException {
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery("ALTER TABLE " + getPrefixSchema(schema) + tableName + " DROP CONSTRAINT "+constraintName).executeUpdate();
				return null;
			}
		}, datasource.getId());
	}
	
	/**
	 * 判断数据库表外键是否存在
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param constraintName 外键约束名
	 * @return
	 * @throws CustomException
	 */
	@Override
	public boolean isForeignKeyExit(MyqdpDatasource datasource, String tableName, String constraintName) throws CustomException {
		Object num = ReportDBManager.get(datasource.getId())
				.createNativeQuery("SELECT COUNT(CONSTRAINT_NAME) FROM USER_CONSTRAINTS WHERE TABLE_NAME='" + tableName + "' AND CONSTRAINT_NAME='" + constraintName + "'")
				.getSingleResult();
		return StringUtils.toInt(num, 0) > 0 ? true : false;
	}
	
	/**
	 * 根据外键约束名获取外键
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param constraintName 外键名
	 */
	@SuppressWarnings("unchecked")
	@Override
	public DBForeignKeyMeta getForeignKey(MyqdpDatasource datasource, String tableName, String constraintName) throws CustomException {
		DBForeignKeyMeta foreignKey = null;
		// 从 DBA_CONSTRAINTS、DBA_CONS_COLUMNS、DBA_CONS_COLUMNS 查询外键信息
		// String sql = "SELECT c.TABLE_NAME, u1.COLUMN_NAME, c.CONSTRAINT_NAME, u2.TABLE_NAME as R_TABLE_NAME, u2.COLUMN_NAME as R_COLUMN_NAME, c.R_CONSTRAINT_NAME, c.DELETE_RULE, c.STATUS FROM DBA_CONSTRAINTS c, DBA_CONS_COLUMNS u1, DBA_CONS_COLUMNS u2 WHERE c.constraint_name = u1.constraint_name AND c.r_constraint_name = u2.constraint_name AND c.constraint_name = '" + constraintName + "' AND c.table_name = '" + tableName + "'";
		
		// 从 USER_CONSTRAINTS、USER_CONS_COLUMNS、USER_CONS_COLUMNS 查询外键信息
		String sql = "SELECT c.TABLE_NAME, u1.COLUMN_NAME, c.CONSTRAINT_NAME, u2.TABLE_NAME as R_TABLE_NAME, u2.COLUMN_NAME as R_COLUMN_NAME, c.R_CONSTRAINT_NAME, c.DELETE_RULE, c.STATUS FROM USER_CONSTRAINTS c, USER_CONS_COLUMNS u1, USER_CONS_COLUMNS u2 WHERE c.constraint_name = u1.constraint_name AND c.r_constraint_name = u2.constraint_name AND c.constraint_name = '" + constraintName + "' AND c.table_name = '" + tableName + "'";
		List<Object[]> results = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		if(results.size() < 1) throw new CustomException("", "外键【" + constraintName + "】不存在");
		Object[] result = results.get(0);
		if(result != null && result.length > 7) {
			foreignKey = new DBForeignKeyMeta((String) result[0], (String) result[1],
					(String) result[2], (String) result[3], (String) result[4], (String) result[5], (String) result[6], (String) result[7]);
		}
		return foreignKey;
	}
	
	/**
	 * 根据表名、外键约束名启用外键（Alter直接操作数据库表）
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param constraintName 外键名
	 * @param schema 模式
	 */
	@Override
	public void enableForeignKey(MyqdpDatasource datasource, String tableName, String constraintName, String schema) throws CustomException {
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery("ALTER TABLE " + getPrefixSchema(schema) + tableName + " ENABLE CONSTRAINT " + constraintName).executeUpdate();
				return null;
			}
		}, datasource.getId());
	}
	
	/**
	 * 根据表名、外键约束名禁用外键（Alter直接操作数据库表）
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param constraintName 外键名
	 * @param schema 模式
	 */
	@Override
	public void disableForeignKey(MyqdpDatasource datasource, String tableName, String constraintName, String schema) throws CustomException {
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery("ALTER TABLE " + getPrefixSchema(schema) + tableName + " DISABLE CONSTRAINT " + constraintName).executeUpdate();
				return null;
			}
		}, datasource.getId());
	}
	
	/**
	 * 获取数据库表所有索引
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<DBIndexMeta> getIndexs(MyqdpDatasource datasource, String tableName) throws CustomException {
        return getIndexsByTableNameFromMetaTable(datasource, tableName);
    }
	
	/**
	 * 添加索引（通过 CREATE INDEX 直接在数据库表上添加）
	 * @param datasource 数据库连接
	 * @param name 索引名称
	 * @param tableName 表名
	 * @param fieldName 字段名
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void addIndex(MyqdpDatasource datasource, String name, String tableName, String fields, String type, String schema) throws CustomException {
		if(StringUtils.isStrNull(type) || "NORMAL".equalsIgnoreCase(type)) {
			type = "";
		}
		String sql = "CREATE " + type + " INDEX " + name + " ON " + getPrefixSchema(schema) + tableName + "(" + fields + ")";
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery(sql).executeUpdate();
				return null;
			}
		}, datasource.getId());		
	}
	
	/**
	 * 通过索引名称获取数据库表的索引
	 * @param datasource 数据库连接
	 * @param indexName 索引名称
	 */
	@SuppressWarnings("unchecked")
	@Override
	public DBIndexMeta getIndex(MyqdpDatasource datasource, String indexName) throws CustomException {
		DBIndexMeta index = null;
		// 从 DBA_IND_COLUMNS，DBA_INDEXES 查询索引信息
		// String sql = "SELECT dc.INDEX_NAME, dc.COLUMN_NAME, di.UNIQUENESS FROM DBA_IND_COLUMNS dc, DBA_INDEXES di WHERE dc.INDEX_NAME = di.INDEX_NAME AND dc.INDEX_NAME='" + indexName + "'";
		
		// 从 USER_IND_COLUMNS， USER_INDEXES 查询索引信息
		 String sql = "SELECT dc.INDEX_NAME, dc.COLUMN_NAME, di.UNIQUENESS FROM USER_IND_COLUMNS dc, USER_INDEXES di WHERE dc.INDEX_NAME = di.INDEX_NAME AND dc.INDEX_NAME='" + indexName + "'";
		List<Object[]> results = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		if(results.size() < 1) throw new CustomException("", "索引【" + indexName + "】不存在");
		Object[] result = results.get(0);
		if(result != null && result.length > 2) {
			index = new DBIndexMeta((String) result[0], (String) result[1], (String) result[2]);
		}
		return index;
	}

	/**
	 * 重命名索引索引（通过 ALTER INDEX 直接直接修改数据库索引）
	 * @param datasource 数据库连接
	 * @param oldName 旧索引名称
	 * @param newName 新索引名称
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void renameIndex(MyqdpDatasource datasource, String oldName, String newName) throws CustomException {
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery("ALTER INDEX " + oldName + " RENAME TO " + newName).executeUpdate();
				return null;
			}
		}, datasource.getId());
	}
	
	/**
	 * 删除索引（直接使用 DROP INDEX 删除数据库索引）
	 * @param datasource 数据库连接
	 * @param name 索引名称
	 */
	@Override
	public void removeIndex(MyqdpDatasource datasource, String name) throws CustomException {
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery("DROP INDEX "+name).executeUpdate();
				return null;
			}
		}, datasource.getId());
	}
	
	/**
	 * 判断索引是否存在
	 * @param datasource 数据库连接
	 * @param indexName 索引名称
	 */
	@Override
	public boolean isIndexExit(MyqdpDatasource datasource, String indexName) throws CustomException {
		Object num = ReportDBManager.get(datasource.getId())
				.createNativeQuery("SELECT COUNT(INDEX_NAME) FROM USER_INDEXES WHERE INDEX_NAME='" + indexName + "'")
				.getSingleResult();
		if(StringUtils.toInt(num, 0) > 0) {
			return true;
		}
		return false;
	}
	
	/**
	 * 添加外键（通过 ALTER TABLE 直接在数据库表上添加外键）
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param fieldName 字段名
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void addPrimaryKey(MyqdpDatasource datasource, String tableName, String fieldName, String schema) throws CustomException {
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery("ALTER TABLE " + getPrefixSchema(schema) + tableName + " ADD CONSTRAINT PK_" + fieldName + " PRIMARY KEY(" + fieldName + ")").executeUpdate();
				return null;
			}
		}, datasource.getId());
	}
	
	/**
	 * 删除主键（直接使用 ALTER TABLE 删除）
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param fieldName 字段名
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void removePrimaryKey(MyqdpDatasource datasource, String tableName, String fieldName, String schema) throws CustomException {
		String constraintName = getConstraintName(datasource, tableName, fieldName);
		if(StringUtils.isNull(constraintName)) throw new CustomException("", "主键不存在");
		
		DBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.createNativeQuery("ALTER TABLE " + getPrefixSchema(schema) + tableName + " DROP CONSTRAINT " + constraintName).executeUpdate();
				return null;
			}
		}, datasource.getId());
	}
	
	/**
	 * 获取数据库表外键字段的约束名称
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用) 
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param fieldName 字段名
	 * @return
	 * @throws CustomException
	 */
	protected String getConstraintName(MyqdpDatasource datasource, String tableName, String fieldName) throws CustomException {
		return (String) ReportDBManager.get(datasource.getId())
				.createNativeQuery("SELECT cu.CONSTRAINT_NAME FROM user_cons_columns cu, user_constraints au WHERE cu.constraint_name = au.constraint_name AND au.constraint_type = 'P' AND au.table_name=? AND cu.COLUMN_NAME=?")
				.setParameter(1, tableName)
				.setParameter(2, fieldName)
				.getSingleResult();
	}
	
	/**
	 * 从数据库原生的元数据表获得表的所有字段
	 * @param datasource 数据库连接
	 * @param tableName 表名称
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	protected List<DBFieldMeta> getFieldsByTableNameFromMetaTable(MyqdpDatasource datasource, String tableName) throws CustomException{
		if(StringUtils.isNull(tableName)) throw new CustomException("","表名称不能为空！");
		List<DBFieldMeta> list = new ArrayList<DBFieldMeta>();
		List<String> primaryKeys = getConstraintColumnNames(datasource, tableName, "P");
		List<String> uniqueColumns = getConstraintColumnNames(datasource, tableName, "U");
		// 从 USER_COL_COMMENTS，USER_TAB_COLUMNS 查询字段信息
		String sql = "SELECT c1.COLUMN_NAME, c1.DATA_TYPE, c1.DATA_LENGTH, c2.COMMENTS, c1.DATA_DEFAULT, c1.NULLABLE, c1.COLUMN_ID FROM USER_TAB_COLUMNS c1, USER_COL_COMMENTS c2";
		String where = " WHERE c1.TABLE_NAME='" + tableName + "' AND c2.TABLE_NAME = c1.TABLE_NAME AND c2.COLUMN_NAME = c1.COLUMN_NAME";
		
		// 从 DBA_COL_COMMENTS，DBA_TAB_COLUMNS 查询字段信息
		// String sql = "SELECT c1.COLUMN_NAME, c1.DATA_TYPE, c1.DATA_LENGTH, c2.COMMENTS, c1.DATA_DEFAULT, c1.NULLABLE FROM DBA_TAB_COLUMNS c1, DBA_COL_COMMENTS c2";
		// String where = " WHERE c1.OWNER = '" + datasource.getUserName().toUpperCase() + "'";
		// where += " AND c1.TABLE_NAME='" + tableName + "' AND c2.TABLE_NAME = c1.TABLE_NAME AND c2.COLUMN_NAME = c1.COLUMN_NAME AND c2.OWNER = c1.OWNER ORDER BY c1.COLUMN_ID ASC";
		sql += where;
		
		List<Object[]> results = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		for(Object[] result : results) {
			if(result == null || result.length < 6) continue;
			DBFieldMeta field = new DBFieldMeta();
			field.setTableName(getFullTableName(datasource.getId(), tableName));
			String name = (String) result[0];
			field.setName(name);
			if(primaryKeys.contains(name)) {
				field.setIsPk(DBFieldMeta.YES);
			}
			if(uniqueColumns.contains(name)) {
				field.setIsUnique(DBFieldMeta.YES);
			}
			field.setType((String) result[1]);
			field.setLength(result[2] == null ? null : Integer.parseInt(String.valueOf(result[2].toString())));
			field.setRemark((String) result[3]);
			field.setDefaultValue(result[4] == null ? null : result[4].toString());
			field.setNullable(result[5] == null ? DBFieldMeta.YES : "Y".equals(result[5].toString()) ? DBFieldMeta.YES : DBFieldMeta.NO);
			field.setColumnId(StringUtils.toInt(result[6], 0));
			list.add(field);
		}
		return list;
	}

	/**
	 * 从数据库原生的元数据表获得表的单个字段
	 * @param datasource 数据库连接
	 * @param tableName 表名称
	 * @param fieldName 字段名称
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	@Override
	public DBFieldMeta getFieldFromMetaTable(MyqdpDatasource datasource, String tableName, String fieldName) throws CustomException{
		if(StringUtils.isNull(tableName)) throw new CustomException("","表名称不能为空！");
		List<String> primaryKeys = getConstraintColumnNames(datasource, tableName, "P");
		List<String> uniqueColumns = getConstraintColumnNames(datasource, tableName, "U");
		
		// 从 USER_COL_COMMENTS，USER_TAB_COLUMNS 查询字段信息
		String sql = "SELECT c1.COLUMN_NAME, c1.DATA_TYPE, c1.DATA_LENGTH, c2.COMMENTS, c1.DATA_DEFAULT, c1.NULLABLE FROM USER_TAB_COLUMNS c1, USER_COL_COMMENTS c2";
		String where = " WHERE c1.TABLE_NAME='" + tableName + "' AND c2.TABLE_NAME = c1.TABLE_NAME AND c2.COLUMN_NAME = c1.COLUMN_NAME AND c1.COLUMN_NAME='"+ fieldName + "'";
		
		// 从 DBA_COL_COMMENTS，DBA_TAB_COLUMNS 查询字段信息
		// String sql = "SELECT c1.COLUMN_NAME, c1.DATA_TYPE, c1.DATA_LENGTH, c2.COMMENTS, c1.DATA_DEFAULT, c1.NULLABLE FROM DBA_TAB_COLUMNS c1, DBA_COL_COMMENTS c2";
		// String where = " WHERE c1.OWNER = '" + datasource.getUserName().toUpperCase() + "'";
		// where += " AND c1.TABLE_NAME='" + tableName + "' AND c2.TABLE_NAME = c1.TABLE_NAME AND c2.COLUMN_NAME = c1.COLUMN_NAME AND c2.OWNER = c1.OWNER AND c1.COLUMN_NAME='"+ fieldName + "'";;
		
		sql += where;
				
		List<Object[]> results = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		if(results.size() < 1) throw new CustomException("", "表 " + tableName + " 的字段【" + fieldName + "】不存在");
		DBFieldMeta field = new DBFieldMeta();
		Object[] result = results.get(0);
		if(result == null || result.length < 6) return field;
		
		field.setTableName(tableName);
		String name = (String) result[0];
		field.setName(name);
		if(primaryKeys.contains(name)) {
			field.setIsPk(DBFieldMeta.YES);
		}
		if(uniqueColumns.contains(name)) {
			field.setIsUnique(DBFieldMeta.YES);
		}
		field.setType((String) result[1]);
		field.setLength(result[2] == null ? null : Integer.parseInt(String.valueOf(result[2].toString())));
		field.setRemark((String) result[3]);
		field.setDefaultValue(result[4] == null ? null : result[4].toString());
		field.setNullable(result[5] == null ? DBFieldMeta.YES : "Y".equals(result[5].toString()) ? DBFieldMeta.YES : DBFieldMeta.NO);
		field.setColumnId(StringUtils.toInt(result[6], 0));
		return field;
	}
	
	/**
	 * 从数据库元数据表中获取外键信息
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @return
	 * @throws CustomException
	 */
	protected List<DBForeignKeyMeta> getForeignKeysByTableNameFromMetaTable(MyqdpDatasource datasource, String tableName) throws CustomException{
		return getForeignKeysByTableNameFromMetaTable(datasource, tableName, datasource.getUserName().toUpperCase());
	}
	
	/**
	 * 从数据库原生的元数据表获得表的所有外键信息
	 * @param datasource 数据库连接
	 * @param tableName 表名称
	 * @param tableName 外键拥有者
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	protected List<DBForeignKeyMeta> getForeignKeysByTableNameFromMetaTable(MyqdpDatasource datasource, String tableName, String owner) throws CustomException{
		if(StringUtils.isNull(tableName)) throw new CustomException("","表名称不能为空！");
		
		// 法1 从视图 USER_CONSTRAINTS 和 USER_CONS_COLUMNS 中查找，只能查出当前用户的外键（LOTTERY_TEST）
		 String sql = "SELECT c.TABLE_NAME, u1.COLUMN_NAME, c.CONSTRAINT_NAME, u2.TABLE_NAME as R_TABLE_NAME, u2.COLUMN_NAME as R_COLUMN_NAME, c.R_CONSTRAINT_NAME, c.DELETE_RULE, c.STATUS FROM USER_CONSTRAINTS c, USER_CONS_COLUMNS u1, USER_CONS_COLUMNS u2 WHERE c.constraint_name = u1.constraint_name AND c.r_constraint_name = u2.constraint_name AND c.constraint_type = 'R' AND c.table_name = '" + tableName + "'";
		
		// 法2 从视图 DBA_CONSTRAINTS 和 DBA_CONS_COLUMNS 中查找，能查出所有表的所有外键
		// String sql = "SELECT c.TABLE_NAME, u1.COLUMN_NAME, c.CONSTRAINT_NAME, u2.TABLE_NAME as R_TABLE_NAME, u2.COLUMN_NAME as R_COLUMN_NAME, c.R_CONSTRAINT_NAME, c.DELETE_RULE, c.STATUS FROM DBA_CONSTRAINTS c, DBA_CONS_COLUMNS u1, DBA_CONS_COLUMNS u2";
		// String where = " WHERE c.OWNER='" + owner + "' AND c.constraint_name = u1.constraint_name AND c.r_constraint_name = u2.constraint_name AND c.constraint_type = 'R' AND c.table_name = '" + tableName + "'";
		// sql += where;
		
		List<Object[]> results = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		List<DBForeignKeyMeta> list = new ArrayList<DBForeignKeyMeta>();
		for(Object[] result : results) {
			if(result == null || result.length < 8) continue;
			DBForeignKeyMeta foreignKey = new DBForeignKeyMeta((String) result[0], (String) result[1],
					(String) result[2], (String) result[3], (String) result[4], (String) result[5], (String) result[6], (String) result[7]);
			foreignKey.setSchema(datasource.getUserName().toUpperCase());
			foreignKey.setrSchema(datasource.getUserName().toUpperCase());
			list.add(foreignKey);
		}
		return list;
	}
	
	/**
	 * 从数据库原生的元数据表获得表的所有索引信息
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param tableName 表名
	 * @return
	 * @throws CustomException
	 */
	protected List<DBIndexMeta> getIndexsByTableNameFromMetaTable(MyqdpDatasource datasource, String tableName) throws CustomException {
        return getIndexsByTableNameFromMetaTable(datasource, tableName, datasource.getUserName().toUpperCase());
    }
	
	/**
	 * 获取数据库表所有的索引
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param tableOwner 表拥有者
	 * @return
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	protected List<DBIndexMeta> getIndexsByTableNameFromMetaTable(MyqdpDatasource datasource, String tableName, String tableOwner) throws CustomException {
		 
		// 从 USER_IND_COLUMNS， USER_INDEXES 查询索引信息
		String sql = "SELECT dc.INDEX_NAME, dc.COLUMN_NAME, di.UNIQUENESS FROM USER_IND_COLUMNS dc, USER_INDEXES di  WHERE dc.INDEX_NAME = di.INDEX_NAME AND dc.TABLE_NAME='" + tableName + "'";
		
		// 从 DBA_IND_COLUMNS， DBA_INDEXES查询索引信息
		// String where = " WHERE dc.TABLE_OWNER='" + tableOwner + "'";
		// where += " AND dc.INDEX_NAME = di.INDEX_NAME AND dc.TABLE_NAME='" + tableName + "'";
		// String sql = "SELECT dc.INDEX_NAME, dc.COLUMN_NAME, di.UNIQUENESS FROM DBA_IND_COLUMNS dc, DBA_INDEXES di " + where;
		
		List<Object[]> results = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		List<DBIndexMeta> list = new ArrayList<DBIndexMeta>();
		List<String> excludeIndexNames = getRecycleMetaName(datasource, "INDEX"); // 排除掉Oracle 的 recyclebin 中被删除的表
		
		for(Object[] result : results) {
			if(result == null || result.length < 3 || excludeIndexNames.contains(result[0])) continue;
			DBIndexMeta index = new DBIndexMeta((String) result[0], (String) result[1], (String) result[2]);
			index.setTableName(tableName);
			list.add(index);
		}
        return list;
    }
	
	/**
	 * 获取数据库表约束字段名
	 * @Author: 朱才富
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param type 约束类型：P-主键，U-唯一约束
	 * @return
	 * @throws CustomException
	 */
	protected List<String> getConstraintColumnNames(MyqdpDatasource datasource, String tableName, String type) throws CustomException {
        return getConstraintColumnNames(datasource, tableName, type, datasource.getUserName().toUpperCase());
    }
	
	/**
	 * 获取数据库表约束字段名
	 * @Author: 朱才富
	 * @param datasource 数据库连接
	 * @param tableName 表名
	 * @param type 约束类型：P-主键，U-唯一约束，R-外键
	 * @param owner 拥有者
	 * @return
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	protected List<String> getConstraintColumnNames(MyqdpDatasource datasource, String tableName, String type, String owner) throws CustomException {
        String where = " WHERE con.OWNER='" + owner + "'";
        where += " AND con.OWNER = col.OWNER AND con.CONSTRAINT_NAME = col.CONSTRAINT_NAME AND con.CONSTRAINT_TYPE=? AND con.TABLE_NAME=?";
		return ReportDBManager.get(datasource.getId())
				.createNativeQuery("SELECT col.COLUMN_NAME FROM USER_CONSTRAINTS con, USER_CONS_COLUMNS col " + where)
				.setParameter(1, type)
				.setParameter(2, tableName)
				.getResultList();
    }
	
	/**
	 * 获取 Oracle 回收站中的元数据名称
	 * @param datasource
	 * @param type 元数据类型 TABLE|INDEX
	 * @return
	 * @throws CustomException 
	 */
	@SuppressWarnings("unchecked")
	private List<String> getRecycleMetaName(MyqdpDatasource datasource, String type) throws CustomException {
		return ReportDBManager.get(datasource.getId()).createNativeQuery("SELECT OBJECT_NAME FROM RECYCLEBIN WHERE TYPE='" + type + "'").getResultList();
	}
	
}
