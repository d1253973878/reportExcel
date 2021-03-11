package com.newtec.report.service.connection;

import java.util.List;
import java.util.Map;

import com.newtec.myqdp.server.utils.QueryResult;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcParam;
import com.newtec.report.common.dto.DBFieldMeta;
import com.newtec.report.common.entity.MyqdpDatasource;
import com.newtec.router.request.FetchWebRequest;

public interface ConnectionService {
	
	/**
	 * 查询数据库连接
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param req
	 *           createTime 创建时间
	 *           name 数据库连接名称
	 *           searchValue 查询关键词
	 *           
	 * @return
	 * @throws CustomException
	 */
	public QueryResult<MyqdpDatasource> queryConnections(@RpcParam(loginPersonParam = true) FetchWebRequest<Map<String, String>> req) throws CustomException;

	/**
	 * 新增数据库连接
	 * @Author: 朱才富
	 * @param request
	 * @throws CustomException
	 */
	public MyqdpDatasource addConnection(@RpcParam(loginPersonParam = true) WebRequest<MyqdpDatasource> request) throws CustomException;

	/**
	 * 更新数据库连接
	 * @Author: 朱才富
	 * @param request MyqdpDatasource 数据库连接信息
	 * @throws CustomException
	 */
	public void updateConnection(@RpcParam(loginPersonParam = true) WebRequest<MyqdpDatasource> request) throws CustomException;

	/**
	 * 删除数据库连接
	 * @Author: 朱才富
	 * @param reques 数据库连接id
	 * @throws CustomException
	 */
	public void  deleteConnection(@RpcParam(loginPersonParam = true) WebRequest<String>request) throws CustomException;
	
	/**
	 * 根据数据库连接ID获取数据库表
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request 数据库连接id
	 * @return
	 * @throws CustomException
	 */
	public List<String> getTables(@RpcParam(loginPersonParam = true) WebRequest<String> request) throws CustomException;
	
	/**
	 * 根据数据库连接名称获取数据库表
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request 数据库连接名称
	 * @return
	 * @throws CustomException
	 */
	public List<String> getTablesByConnectionName(@RpcParam(loginPersonParam = true) WebRequest<String> request) throws CustomException;

	/**
	 * 获取数据库表字段
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 *             id 数据库连接ID
	 *             tableName 数据库表名
	 * @return
	 * @throws CustomException
	 */
	public List<DBFieldMeta> getFieldsFromTable(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException;
	
	/**
	 * 获取数据库表字段
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public List<Object[]> tableExampleDatas(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException;
	
	/**
	 * 测试数据库连接
	 * @param request 数据库连接ID
	 * @return
	 * @throws CustomException
	 */
	public Integer testConnectionById(@RpcParam(loginPersonParam = true) WebRequest<String> request) throws CustomException;
	
	/**
	 * 测试数据库连接
	 * @param request 数据库连接全部信息
	 * @return
	 * @throws CustomException
	 */
	public Integer testConnection(@RpcParam(loginPersonParam = true) WebRequest<MyqdpDatasource> request) throws CustomException;
	
	public List<MyqdpDatasource> getAllConnection(@RpcParam(loginPersonParam = true) WebRequest<String>request) throws CustomException;

	/**
	  * 读取数据库中所有的Lizard类型数据库连接
	 * @Author: 朱才富
	 * @return
	 * @throws CustomException
	 */
	public List<MyqdpDatasource> getAllUserConnection() throws CustomException;

	/**
	 * 查询所有数据源的ID和名称
	 * @return
	 * @throws CustomException
	 */
	List<Map<String, String>> getAllConnectionIDAndName(WebRequest<String> request) throws CustomException;
	
}
