package com.newtec.report.service.meta.impl;

import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.entity.orga.Person;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.reflect.annotation.RpcParam;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.common.dto.DBTableMeta;
import com.newtec.report.common.entity.MyqdpDatasource;
import com.newtec.report.common.entity.meta.DBFieldMeta;
import com.newtec.report.common.entity.meta.DBForeignKeyMeta;
import com.newtec.report.common.entity.meta.DBIndexMeta;
import com.newtec.report.service.connection.impl.ConnectionServiceImpl;
import com.newtec.report.service.meta.MetaService;
import com.newtec.report.utils.meta.DBMetaManager;
import com.newtec.report.utils.meta.DBMetaUtils;
import com.newtec.rpc.db.DBexecute;

@RpcClass("metaService")
public class MetaServiceImpl implements MetaService {
	
	/**
	 * 获取数据库所有的表信息
	 * @Author: 朱才富
	 * @param request 包含连接id
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<DBTableMeta> getTables(@RpcParam(loginPersonParam = true) WebRequest<String> request) throws CustomException {
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(request.getData(), person);
		System.out.println(datasource.getDbType());
		System.out.println(DBMetaUtils.getDbMetaManager(datasource.getDbType()));
		return DBMetaUtils.getDbMetaManager(datasource.getDbType()).getTables(datasource);
	}
	
	/**
	 * 获取数据库表所有的字段信息
	 * @Author: 朱才富
	 * @param request
	 *              tableName 表名
	 *              connectionId 数据库连接ID
	 * @throws CustomException
	 */
	@Override
	public List<DBFieldMeta> getTableFields(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String tableName = data.get("tableName");
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		List<DBFieldMeta> result = DBMetaUtils.getDbMetaManager(datasource.getDbType()).getFieldsByTableName(datasource, tableName);
		return result;
	}
	
	/**
	 * 获取数据库表外键的信息
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *              tableName 表名
	 *              connectionId 数据库连接ID
	 * @throws CustomException
	 */
	@Override
	public List<DBForeignKeyMeta> getForeignKeys(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String tableName = data.get("tableName");
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(tableName)) throw new CustomException("", "数据库表名不能为空");
		return DBMetaUtils.getDbMetaManager().getForeignKeys(datasource, tableName);
	}
	
	/**
	 * 更新外键
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               oTableName 源表名
	 *               oConstraintName 源外键约束名
	 *               columnName 外键字段名
	 *               rTableName关联表名
	 *               constraintName 关联外键约束名
	 *               rColumnName 关联字段名
	 *               deleteRule 删除规则
	 * @throws CustomException
	 */
	@Override
	public void updateForeignKey(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		
		String oTableName = data.get("oTableName");
		String oConstraintName = data.get("oConstraintName");
		String columnName = data.get("columnName");
		String tableName = data.get("tableName");
		String constraintName = data.get("constraintName");
		String rColumnName = data.get("rColumnName");
		String rTableName = data.get("rTableName");
		String deleteRule = data.get("deleteRule");

		if(StringUtils.isStrNull(oTableName)) throw new CustomException("", "旧表名不能为空");
		if(StringUtils.isStrNull(oConstraintName)) throw new CustomException("", "旧外键名称不能为空");
		if(StringUtils.isStrNull(columnName)) throw new CustomException("", "字段名称不能为空");
		if(StringUtils.isStrNull(tableName)) throw new CustomException("", "表名不能为空");
		if(StringUtils.isStrNull(constraintName)) throw new CustomException("", "外键名称不能为空");
		if(StringUtils.isStrNull(rColumnName)) throw new CustomException("", "关联字段名称不能为空");
		if(StringUtils.isStrNull(rTableName)) throw new CustomException("", "关联表名不能为空");
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();		
		String schema = datasource.getUserName().toUpperCase();
		
		if((!oTableName.equals(tableName) || !oConstraintName.equals(constraintName))
				&& metaManager.isForeignKeyExit(datasource, tableName, constraintName)) {
			throw new CustomException("", "外键信息已存在");
		}
		DBForeignKeyMeta oldFk = metaManager.getForeignKey(datasource, oTableName, oConstraintName);
		metaManager.removeForeignKey(datasource, oTableName, oConstraintName, schema);
		try {
			metaManager.addForeignKey(datasource, constraintName, tableName, schema, columnName,
					rTableName, schema, rColumnName, deleteRule);
		} catch (Exception e) {
			// 回滚
			metaManager.addForeignKey(datasource, oldFk.getConstraintName(), oldFk.getTableName(), schema, oldFk.getColumnName(),
					oldFk.getrTableName(), schema, oldFk.getrColumnName());
			throw new CustomException("", e.getMessage());
		}
		
	}
		
	/**
	 * 添加外键
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               tableName 源表名
	 *               columnName 字段名
	 *               constraintName 外键约束名
	 *               rTableName 关联表名
	 *               rColumnName 关联字段名
	 * @throws CustomException
	 */
	@Override
	public void addForeignKey(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		DBForeignKeyMeta foreign = JsonUtil.fromJson(JsonUtil.objecte2JsonString(data), DBForeignKeyMeta.class);
		
		if(StringUtils.isStrNull(foreign.getColumnName())) throw new CustomException("", "字段名称不能为空");
		if(StringUtils.isStrNull(foreign.getTableName())) throw new CustomException("", "表名不能为空");
		if(StringUtils.isStrNull(foreign.getConstraintName())) throw new CustomException("", "外键名称不能为空");
		if(StringUtils.isStrNull(foreign.getrColumnName())) throw new CustomException("", "关联字段名称不能为空");
		if(StringUtils.isStrNull(foreign.getrTableName())) throw new CustomException("", "关联表名不能为空");
		foreign.setCreateTime(StringUtils.getCurrentTime());
		foreign.setUpdateTime(foreign.getUpdateTime());
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();		
		
		if(metaManager.isForeignKeyExit(datasource, foreign.getTableName(), foreign.getConstraintName())) throw new CustomException("", "外键信息已存在");
		
		String schema = datasource.getUserName().toUpperCase();
		metaManager.addForeignKey(datasource, foreign.getConstraintName(), foreign.getTableName(), schema, foreign.getColumnName(),
				foreign.getrTableName(), schema, foreign.getrColumnName(),
				foreign.getDeleteRule());
	}
	
	/**
	 * 启用外键
	 * @param request
	 *               connectionId 数据库连接ID
	 *               tableName 表名
	 *               constraintName 外键约束名
	 * @throws CustomException
	 */
	@Override
	public void enableForeignKey(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String tableName = data.get("tableName");
		String constraintName = data.get("constraintName");
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(tableName)) throw new CustomException("", "表名称不能为空");
		if(StringUtils.isStrNull(constraintName)) throw new CustomException("", "外键名称不能为空");
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();
		if(!metaManager.isForeignKeyExit(datasource, tableName, constraintName)) throw new CustomException("", "外键名称不存在");
		DBMetaUtils.getDbMetaManager().enableForeignKey(datasource, tableName, constraintName, datasource.getUserName().toUpperCase());
	}
		
	/**
	 * 禁用外键
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               tableName 表名
	 *               constraintName 外键约束名
	 * @throws CustomException
	 */
	@Override
	public void disableForeignKey(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String tableName = data.get("tableName");
		String constraintName = data.get("constraintName");
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(tableName)) throw new CustomException("", "表名称不能为空");
		if(StringUtils.isStrNull(constraintName)) throw new CustomException("", "外键名称不能为空");
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();
		if(!metaManager.isForeignKeyExit(datasource, tableName, constraintName)) throw new CustomException("", "外键名称不存在");
		DBMetaUtils.getDbMetaManager().disableForeignKey(datasource, tableName, constraintName, datasource.getUserName().toUpperCase());
	}
	
	
	/**
	 * 删除外键
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               tableName 表名
	 *               constraintName 外键约束名
	 * @throws CustomException
	 */
	@Override
	public void removeForeignKey(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String tableName = data.get("tableName");
		String constraintName = data.get("constraintName");
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(tableName)) throw new CustomException("", "表名称不能为空");
		if(StringUtils.isStrNull(constraintName)) throw new CustomException("", "外键名称不能为空");
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();
		if(!metaManager.isForeignKeyExit(datasource, tableName, constraintName)) throw new CustomException("", "外键名称不存在");
		metaManager.removeForeignKey(datasource, tableName, constraintName, datasource.getUserName().toUpperCase());
	}
	
	/**
	 * 获取数据库表外键的信息
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               tableName 表名
	 * @throws CustomException
	 */
	@Override
	public List<DBIndexMeta> getIndexs(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String tableName = data.get("tableName");
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(tableName)) throw new CustomException("", "数据库表名不能为空");
		return DBMetaUtils.getDbMetaManager().getIndexs(datasource, tableName);
	}
	
	/**
	 * 更新索引
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               oldName 旧索引名
	 *               name 新索引名
	 *               fields 索引字段
	 *               tableName 表名
	 *               type 索引类型
	 * @throws CustomException
	 */
	@Override
	public void updateIndex(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String oldName = data.get("oldName");
		String name = data.get("name");
		String fields = data.get("fields");
		String tableName = data.get("tableName");
		String type = data.get("type");
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction(data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(oldName)) throw new CustomException("", "索引旧名称不能为空");
		if(StringUtils.isStrNull(name)) throw new CustomException("", "索引新名称不能为空");
		if(StringUtils.isStrNull(fields)) throw new CustomException("", "索引字段不能为空");
		if(StringUtils.isStrNull(tableName)) throw new CustomException("", "表名称不能为空");
		if(StringUtils.isStrNull(type)) throw new CustomException("", "索引类型不能为空");
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();
		
		DBIndexMeta index = metaManager.getIndex(datasource, oldName);
		if(index == null) throw new CustomException("", "索引【" + oldName + "】不存在");
		
		String schema = datasource.getUserName().toUpperCase();
		
		if(!oldName.equals(name) && (index.getFields().equals(fields) && type.equals(index.getType()))) {
			metaManager.renameIndex(datasource, oldName, name);
		}else {
			metaManager.removeIndex(datasource, oldName);
			try {
				metaManager.addIndex(datasource, name, tableName, fields, type, schema);
			} catch (Exception e) {
				// 回滚，NONUNIQUE其实就是BITMAP，但是创建索引的时候只能使用BITMAP
				metaManager.addIndex(datasource, oldName, tableName, index.getFields(), index.getType().equals("NONUNIQUE") ? "BITMAP" : index.getType(), schema);
				throw new CustomException("", e.getMessage());
			}
			
		}
	}
	
	/**
	 * 添加索引
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               name 新索引名
	 *               fields 索引字段
	 *               tableName 表名
	 *               type 索引类型
	 * @throws CustomException
	 */
	@Override
	public void addIndex(@RpcParam(loginPersonParam = true) WebRequest<Map<String, Object>> request) throws CustomException {
		Map<String, Object> data = request.getData();
		DBIndexMeta index = JsonUtil.fromJson(JsonUtil.objecte2JsonString(data), DBIndexMeta.class);
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction((String) data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(index.getName())) throw new CustomException("", "索引名称不能为空");
		if(StringUtils.isStrNull(index.getTableName())) throw new CustomException("", "表名不能为空");
		if(StringUtils.isStrNull(index.getFields())) throw new CustomException("", "索引字段不能为空");
		if(StringUtils.isStrNull(index.getType())) throw new CustomException("", "索引类型不能为空");
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();
		if(metaManager.isIndexExit(datasource, index.getName())) throw new CustomException("", "索引名称已存在");
		metaManager.addIndex(datasource, index.getName(), index.getTableName(), index.getFields(), index.getType(), datasource.getUserName().toUpperCase());
	}
	
	/**
	 * 删除索引
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               indexName 索引名
	 * @throws CustomException
	 */
	@Override
	public void removeIndex(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String indexName = data.get("indexName");
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction((String) data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(indexName)) throw new CustomException("", "索引名称不能为空");
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();
		if(!metaManager.isIndexExit(datasource, indexName)) throw new CustomException("", "索引名称不存在");
		metaManager.removeIndex(datasource, indexName);
	}

	/**
	 * @Description: 更新数据库字段描述信息
	 * @param request
	 *              connectionId 数据库连接ID
	 *              包含 DBFieldMeta 中的没有加@Transient注解字段信息
	 * @throws CustomException  
	 */
	@Override
	public void updateTableField(@RpcParam(loginPersonParam = true) WebRequest<Map<String, Object>> request) throws CustomException {
		Map<String, Object> data = request.getData();
		DBFieldMeta fieldMeta = JsonUtil.fromJson(JsonUtil.objecte2JsonString(data), DBFieldMeta.class);
		
		Person person = request.getLoginPerson();
		MyqdpDatasource datasource = ConnectionServiceImpl.getOneConnction((String) data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(fieldMeta.getId())) throw new CustomException("", "ID不能为空");
		
		List<DBFieldMeta> list = ReportDBManager.get()
				.createQuery("FROM DBFieldMeta WHERE id=?", DBFieldMeta.class)
				.setParameter(1, fieldMeta.getId())
				.getResultList();
		
		if(list.size() < 1) throw new CustomException("", "字段信息不存在");
		DBFieldMeta tmp = list.get(0);
		DBMetaManager metaManager = DBMetaUtils.getDbMetaManager();
		DBFieldMeta oldMeta = metaManager.getFieldFromMetaTable(datasource, tmp.getTableName(), tmp.getName());
		
		ReportDBManager.execute(new DBexecute<String>() {
			@Override
			public String execute(EntityManager em) throws CustomException {
				em.merge(fieldMeta);
				if(oldMeta.getIsPk() != fieldMeta.getIsPk()) {
					String tableName = fieldMeta.getTableName();
					String fieldName = fieldMeta.getName();
//					if(fieldMeta.getIsPk() == DBFieldMeta.YES) {
//						DBMetaUtils.getDbMetaManager().removePrimaryKey(tableName, fieldName, DBMetaUtils.SCHEMA);
//					} else {
//						DBMetaUtils.getDbMetaManager().addPrimaryKey(tableName, fieldName, DBMetaUtils.SCHEMA);
//					}
				}
				return null;
			}
		});
		
	}
	
	/**
	 * 执行SQL获取数据
	 * @Author: 朱才富
	 * @param request
	 *              connectionId 数据库连接ID
	 *              sql 待执行的SQL
	 * @return
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	@Override
	public String excuteSQL(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String connectionId = data.get("connectionId");
		String sql = data.get("sql");
		
		Person person = request.getLoginPerson();
		ConnectionServiceImpl.getOneConnction((String) data.get("connectionId"), person);
		
		if(StringUtils.isStrNull(sql)) throw new CustomException("", "SQL不能为空");
		List<Object> result = ReportDBManager.get(connectionId).createNativeQuery(sql).getResultList();
		return JsonUtil.objecte2JsonString(result);
	}

}
