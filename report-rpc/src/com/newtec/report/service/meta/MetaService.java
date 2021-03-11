package com.newtec.report.service.meta;

import java.util.List;
import java.util.Map;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.report.common.dto.DBTableMeta;
import com.newtec.report.common.entity.meta.DBFieldMeta;
import com.newtec.report.common.entity.meta.DBForeignKeyMeta;
import com.newtec.report.common.entity.meta.DBIndexMeta;

public interface MetaService {

	/**
	 * 获取数据库所有的表信息
	 * @Author: 朱才富
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	List<DBTableMeta> getTables(WebRequest<String> request) throws CustomException;

	/**
	 * 获取数据库表所有的字段信息
	 * @Author: 朱才富
	 * @param request
	 *              tableName 表名
	 *              connectionId 数据库连接ID
	 * @throws CustomException
	 */
	List<DBFieldMeta> getTableFields(WebRequest<Map<String, String>> request) throws CustomException;

	/**
	 * 获取数据库表外键的信息
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *              tableName 表名
	 *              connectionId 数据库连接ID
	 * @throws CustomException
	 */
	List<DBForeignKeyMeta> getForeignKeys(WebRequest<Map<String, String>> request) throws CustomException;

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
	void updateForeignKey(WebRequest<Map<String, String>> request) throws CustomException;

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
	void addForeignKey(WebRequest<Map<String, String>> request) throws CustomException;

	/**
	 * 启用外键
	 * @param request
	 *               connectionId 数据库连接ID
	 *               tableName 表名
	 *               constraintName 外键约束名
	 * @throws CustomException
	 */
	void enableForeignKey(WebRequest<Map<String, String>> request) throws CustomException;

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
	void disableForeignKey(WebRequest<Map<String, String>> request) throws CustomException;

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
	void removeForeignKey(WebRequest<Map<String, String>> request) throws CustomException;

	/**
	 * 获取数据库表外键的信息
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               tableName 表名
	 * @throws CustomException
	 */
	List<DBIndexMeta> getIndexs(WebRequest<Map<String, String>> request) throws CustomException;

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
	void updateIndex(WebRequest<Map<String, String>> request) throws CustomException;

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
	void addIndex(WebRequest<Map<String, Object>> request) throws CustomException;

	/**
	 * 删除索引
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *               connectionId 数据库连接ID
	 *               indexName 索引名
	 * @throws CustomException
	 */
	void removeIndex(WebRequest<Map<String, String>> request) throws CustomException;

	/**
	 * @Description: 更新数据库字段描述信息
	 * @param request
	 *              connectionId 数据库连接ID
	 *              包含 DBFieldMeta 中的没有加@Transient注解字段信息
	 * @throws CustomException  
	 */
	void updateTableField(WebRequest<Map<String, Object>> request) throws CustomException;

	/**
	 * 执行SQL获取数据
	 * @Author: 朱才富
	 * @param request
	 *              connectionId 数据库连接ID
	 *              sql 待执行的SQL
	 * @return
	 * @throws CustomException
	 */
	String excuteSQL(WebRequest<Map<String, String>> request) throws CustomException;

}