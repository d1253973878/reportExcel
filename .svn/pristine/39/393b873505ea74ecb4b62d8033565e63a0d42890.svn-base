
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
import com.newtec.report.service.connection.impl.ConnectionServiceImpl;
import com.newtec.rpc.db.DBexecute;

/**
 * @Author 朱才富
 * @Description: MYSQL 数据库元数据管理工具
 */
public class MySQLDBMetaManager extends DBMetaManager {

	/**
	 * 查询数据库中所有的表，从 MYSQL 的元数据视图 INFORMATION_SCHEMA.TABLES 查询表信息
	 * 
	 * @param datasource 数据库连接
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<DBTableMeta> getTables(MyqdpDatasource datasource) throws CustomException {
		String dbName = datasource.getDbName();
		String sql = "SELECT table_name, table_comment FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='" + dbName
				+ "'";
		List<Object[]> tables = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		List<DBTableMeta> tableMetas = new ArrayList<DBTableMeta>();
		for (Object[] table : tables) {
			if (table != null && table.length > 1) {
				tableMetas.add(new DBTableMeta(table[0].toString(), table[1] == null ? null : table[1].toString()));
			}

		}
		Collections.sort(tableMetas, new Comparator<DBTableMeta>() {
			@Override
			public int compare(DBTableMeta o1, DBTableMeta o2) {
				return o1.getName().compareTo(o2.getName());
			}
		});
		return tableMetas;
	}

	/**
	 * 方法说明：获得表的所有字段（先查询 DBFieldMeta 中保存的元数据信息，然后再查询INFORMATION_SCHEMA.COLUMNS
	 * 获取的其他元数据信息与前面查询出来的字段信息合并）
	 * 
	 * @param datasource 数据库连接
	 * @param tableName  表名称
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	@Override
	public List<DBFieldMeta> getFieldsByTableName(MyqdpDatasource datasource, String tableName) throws CustomException {
		String dbName = datasource.getDbName();
		// 从 DBFieldMeta 查询此数据库表的信息
		List<DBFieldMeta> result = ReportDBManager.get()
				.createQuery("FROM DBFieldMeta WHERE TABLE_NAME=?", DBFieldMeta.class)
				.setParameter(1, getFullTableName(datasource.getId(), tableName)).getResultList();
		if (result == null || result.size() < 1) {
			List<DBFieldMeta> fields = getFieldsByTableNameFromMetaTable(datasource, tableName);
			ReportDBManager.execute(new DBexecute<String>() {
				@Override
				public String execute(EntityManager em) throws CustomException {
					for (DBFieldMeta dbFieldMeta : fields) {
						em.persist(dbFieldMeta);
					}
					return null;
				}
			});
			result = fields;
		} else {
			Map<String, DBFieldMeta> fieldMap = new HashMap<String, DBFieldMeta>();
			for (DBFieldMeta dbFieldMeta : result) {
				fieldMap.put(dbFieldMeta.getName(), dbFieldMeta);
			}
			String where = "WHERE table_schema = '" + dbName + "' AND table_name = '" + tableName + "' ";
			String sql = "SELECT COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH, COLUMN_DEFAULT,IS_NULLABLE,ORDINAL_POSITION  FROM INFORMATION_SCHEMA.COLUMNS "
					+ where;
			List<String> primaryKeys = getConstraintColumnNames(datasource, tableName, "PRIMARY KEY");
			List<String> uniqueColumns = getConstraintColumnNames(datasource, tableName, "UNIQUE");
			List<Object[]> tResults = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
			for (Object[] tResult : tResults) {
				if (tResult == null || tResult.length < 6)
					continue;
				String name = (String) tResult[0];
				DBFieldMeta field = fieldMap.get(name);
				if (field == null)
					continue;
				if (primaryKeys.contains(name)) {
					field.setIsPk(DBFieldMeta.YES);
				}
				if (uniqueColumns.contains(name)) {
					field.setIsUnique(DBFieldMeta.YES);
				}
				field.setType((String) tResult[1]);
				field.setLength(tResult[2] == null ? null : Integer.parseInt(String.valueOf(tResult[2].toString())));
				field.setDefaultValue((String) tResult[3]);
				field.setNullable(tResult[4] == null ? DBFieldMeta.YES
						: "YES".equals(tResult[4].toString()) ? DBFieldMeta.YES : DBFieldMeta.NO);
				field.setColumnId(StringUtils.toInt(tResult[5], 0));
			}
		}
		// 根据字段的COLUMN_ID对字段进行排序
		Collections.sort(result, new Comparator<DBFieldMeta>() {
			@Override
			public int compare(DBFieldMeta o1, DBFieldMeta o2) {
				return o1.getColumnId() - o2.getColumnId();
			}
		});
		return result;
	}

	/**
	 * 获取数据库表约束字段名
	 * 
	 * @param datasource 数据库连接
	 * @param tableName  表名
	 * @param type       约束类型：PRIMARY KEY-主键，UNIQUE-唯一约束，FOREIGN KEY-外键
	 * @return
	 * @throws CustomException
	 */
	protected List<String> getConstraintColumnNames(MyqdpDatasource datasource, String tableName, String type)
			throws CustomException {
		return getConstraintColumnNames(datasource, tableName, type, datasource.getDbName().toUpperCase());
	}

	/**
	 * 获取数据库表约束字段名
	 * 
	 * @param datasource 数据库连接
	 * @param tableName  表名
	 * @param type       约束类型：PRIMARY KEY-主键，UNIQUE-唯一约束，FOREIGN KEY-外键
	 * @param schema     拥有者(数据源名称)
	 * @return
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	protected List<String> getConstraintColumnNames(MyqdpDatasource datasource, String tableName, String type,
			String schema) throws CustomException {
		String where = " WHERE con.CONSTRAINT_SCHEMA = col.CONSTRAINT_SCHEMA "
				+ " AND con.CONSTRAINT_NAME = col.CONSTRAINT_NAME AND con.TABLE_NAME = col.TABLE_NAME AND con.CONSTRAINT_TYPE= ? AND con.table_name= ?"
				+ " AND con.CONSTRAINT_SCHEMA= '" + schema + "'";
		return ReportDBManager.get(datasource.getId()).createNativeQuery(
				"SELECT col.COLUMN_NAME FROM information_schema.TABLE_CONSTRAINTS con ,information_schema.KEY_COLUMN_USAGE col "
						+ where)
				.setParameter(1, type).setParameter(2, tableName).getResultList();
	}

	/**
	 * 从数据库原生的元数据表获得表的所有字段
	 * 
	 * @param datasource 数据库连接
	 * @param tableName  表名称
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	protected List<DBFieldMeta> getFieldsByTableNameFromMetaTable(MyqdpDatasource datasource, String tableName)
			throws CustomException {
		String dbName = datasource.getDbName();
		if (StringUtils.isNull(tableName))
			throw new CustomException("", "表名称不能为空");
		List<String> primaryKeys = getConstraintColumnNames(datasource, tableName, "PRIMARY KEY");
		List<String> uniqueColumns = getConstraintColumnNames(datasource, tableName, "UNIQUE");
		List<DBFieldMeta> list = new ArrayList<DBFieldMeta>();
		String where = "WHERE table_schema = '" + dbName + "' AND  table_name = '" + tableName + "'";
		String sql = "SELECT COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH,COLUMN_COMMENT, COLUMN_DEFAULT,IS_NULLABLE,ORDINAL_POSITION FROM INFORMATION_SCHEMA.COLUMNS "
				+ where;

		List<Object[]> tResults = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		for (Object[] tResult : tResults) {
			if (tResult == null || tResult.length < 6)
				continue;
			DBFieldMeta field = new DBFieldMeta();
			field.setTableName(getFullTableName(datasource.getId(), tableName));
			String name = (String) tResult[0];
			field.setName(name);
			if (primaryKeys.contains(name)) {
				field.setIsPk(DBFieldMeta.YES);
			}
			if (uniqueColumns.contains(name)) {
				field.setIsUnique(DBFieldMeta.YES);
			}
			field.setType((String) tResult[1]);
			field.setLength(tResult[2] == null ? null : Integer.parseInt(String.valueOf(tResult[2].toString())));
			field.setRemark((String) tResult[3]);
			field.setDefaultValue(tResult[4] == null ? null : tResult[4].toString());
			field.setNullable(tResult[5] == null ? DBFieldMeta.YES
					: "YES".equals(tResult[5].toString()) ? DBFieldMeta.YES : DBFieldMeta.NO);
			field.setColumnId(StringUtils.toInt(tResult[6], 0));
			list.add(field);
		}
		return list;
	}

	public static void main(String[] args) throws CustomException {
		MyqdpDatasource database = ConnectionServiceImpl.getOneConnction("report");
		MySQLDBMetaManager manager = new MySQLDBMetaManager();
		System.out.println(manager.getFieldsByTableNameFromMetaTable(database, "t_api_dataset"));
		;
	}

	/**
	 * 从数据库原生的元数据表获得表的单个字段
	 * 
	 * @param datasource 数据库连接
	 * @param tableName  表名称
	 * @param fieldName  字段名称
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	@Override
	public DBFieldMeta getFieldFromMetaTable(MyqdpDatasource datasource, String tableName, String fieldName)
			throws CustomException {
		String dbName = datasource.getDbName();
		if (StringUtils.isNull(tableName))
			throw new CustomException("", "表名称不能为空");
		List<String> primaryKeys = getConstraintColumnNames(datasource, tableName, "PRIMARY KEY");
		List<String> uniqueColumns = getConstraintColumnNames(datasource, tableName, "UNIQUE");
		List<String> foreingKeys = getConstraintColumnNames(datasource, tableName, "FOREIGN KEY");
		String where = " WHERE table_schema = '" + dbName + "' AND  table_name = '" + tableName + "' AND column_name= '"
				+ fieldName + "'";
		String sql = "SELECT COLUMN_NAME,DATA_TYPE,CHARACTER_MAXIMUM_LENGTH,COLUMN_COMMENT, COLUMN_DEFAULT,IS_NULLABLE,ORDINAL_POSITION FROM INFORMATION_SCHEMA.COLUMNS "
				+ where;

		List<Object[]> tResults = ReportDBManager.get(datasource.getId()).createNativeQuery(sql).getResultList();
		if (tResults.size() < 1) {
			throw new CustomException("", "表 " + tableName + " 的字段【" + fieldName + "】不存在");
		}
		DBFieldMeta field = new DBFieldMeta();
		Object[] result = tResults.get(0);
		if (result == null || result.length < 6) {
			return field;
		}
		field.setTableName(getFullTableName(datasource.getId(), tableName));
		String name = (String) result[0];
		field.setName(name);
		if (primaryKeys.contains(name)) {
			field.setIsPk(DBFieldMeta.YES);
		}
		if (uniqueColumns.contains(name)) {
			field.setIsUnique(DBFieldMeta.YES);
		}
		field.setType((String) result[1]);
		field.setLength(result[2] == null ? null : Integer.parseInt(String.valueOf(result[2].toString())));
		field.setRemark((String) result[3]);
		field.setDefaultValue(result[4] == null ? null : result[4].toString());
		field.setNullable(result[5] == null ? DBFieldMeta.YES
				: "YES".equals(result[5].toString()) ? DBFieldMeta.YES : DBFieldMeta.NO);
		field.setColumnId(StringUtils.toInt(result[6], 0));
		return field;
	}
}
