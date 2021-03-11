package com.newtec.report.service.connection.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.entity.orga.Person;
import com.newtec.myqdp.server.utils.QueryResult;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.reflect.annotation.RpcParam;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.common.dto.DBFieldMeta;
import com.newtec.report.common.entity.MyqdpDatasource;
import com.newtec.report.common.utils.ReportConstant.DBSystemType;
import com.newtec.report.db.ReportDBUtils;
import com.newtec.report.service.connection.ConnectionService;
import com.newtec.router.request.FetchWebRequest;
import com.newtec.rpc.db.DBManager;
import com.newtec.rpc.db.DBexecuteVoid;

import cn.hutool.json.JSONUtil;

@RpcClass("connectionService")
public class ConnectionServiceImpl implements ConnectionService {

	/**
	 * 查询数据库连接
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param req
	 *            createTime 创建时间
	 *            name 数据库连接名称 searchValue 查询关键词
	 * @return
	 * @throws CustomException
	 */
	@Override
	public QueryResult<MyqdpDatasource> queryConnections(
			@RpcParam(loginPersonParam = true) FetchWebRequest<Map<String, String>> req) throws CustomException {
		Map<String, String> params = req.getData();
		final String createTime = params.get("createTime");
		final String name = params.get("name");
		final String searchValue = params.get("searchValue");
		String where = "WHERE 1=1";
		if (!StringUtils.isStrNull(createTime)) {
			where += " AND create_time like '" + createTime + "%'";
		}
		if (!StringUtils.isStrNull(name) && !StringUtils.isStrNull(searchValue)) {
			where += " AND name like '%" + name + "%'" + " OR name like '%" + searchValue + "%'";
		} else if (!StringUtils.isStrNull(name)) {
			where += " AND name like '%" + name + "%'";
		} else if (!StringUtils.isStrNull(searchValue)) {
			where += " AND name like '%" + searchValue + "%'";
		}
		Person person = req.getLoginPerson();
		where += " AND person_id='" + person.getId() + "'";
		where += " AND system_type=" + DBSystemType.USER + " ORDER BY name ASC";
		int start = req.getStartRow();
		int end = req.getEndRow();
		int totalRow = req.getTotalRow();
		EntityManager database = DBManager.get();
		if (totalRow < 0) {
			Object obj = database.createNativeQuery("SELECT COUNT(id) FROM t_myqdp_datasource " + where)
					.getSingleResult();
			totalRow = StringUtils.toInt(obj, 0);
		}
		List<MyqdpDatasource> result = new ArrayList<MyqdpDatasource>();
		if (totalRow > 0) {
			result = database.createQuery("FROM MyqdpDatasource " + where, MyqdpDatasource.class).setFirstResult(start)
					.setMaxResults(end - start).getResultList();
		}
		return new QueryResult<MyqdpDatasource>(result, totalRow);
	}

	/**
	 * 新增数据库连接
	 * 
	 * @Author: 朱才富
	 * @param request
	 *            MyqdpDatasource 数据库连接信息
	 * @throws CustomException
	 */
	@Override
	public MyqdpDatasource addConnection(@RpcParam(loginPersonParam = true) WebRequest<MyqdpDatasource> request)
			throws CustomException {
		MyqdpDatasource myqdpDataSource = request.getData();
		if (myqdpDataSource == null)
			throw new CustomException("", "增加失败，数据库连接对象不能为空！");
		checkConnection(myqdpDataSource);
		Person person = request.getLoginPerson();
		if (isConnectionExist(myqdpDataSource.getName(), person.getId()))
			throw new CustomException("", "此连接名称已存在！");
		myqdpDataSource.reSetMyqdpDataSource();
		myqdpDataSource.setCreateTime(StringUtils.getCurrentTime());
		myqdpDataSource.setLastTime(StringUtils.getCurrentTime());
		myqdpDataSource.setSystemType(DBSystemType.USER);
		myqdpDataSource.setPersonId(person.getId());
		myqdpDataSource.setPersonName(person.getName());
		ReportDBManager.execute(new DBexecuteVoid() {
			@Override
			public void execute(EntityManager em) throws CustomException {
				em.persist(myqdpDataSource);
			}
		});
		return myqdpDataSource;
	}

	/**
	 * 更新数据库连接
	 * 
	 * @Author: 朱才富
	 * @param request
	 *            MyqdpDatasource 数据库连接信息
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	public void updateConnection(@RpcParam(loginPersonParam = true) WebRequest<MyqdpDatasource> request)
			throws CustomException {
		MyqdpDatasource myqdpDataSource = request.getData();
		if (myqdpDataSource == null)
			throw new CustomException("", "更新失败，数据库连接对象不能为空！");
		checkConnection(myqdpDataSource);
		String id = myqdpDataSource.getId();
		if (StringUtils.isNull(id))
			throw new CustomException("", "更新失败，数据库连接对象id不能为空！");
		myqdpDataSource.reSetMyqdpDataSource();
		myqdpDataSource.setLastTime(StringUtils.getCurrentTime());
		myqdpDataSource.setSystemType(DBSystemType.USER);

		Person person = request.getLoginPerson();
		// 获取原数据库连接信息
		List<MyqdpDatasource> datasources = ReportDBManager.get()
				.createQuery("FROM MyqdpDatasource WHERE id=? AND person_id=?").setParameter(1, id)
				.setParameter(2, person.getId()).getResultList();
		if (datasources.size() < 1)
			throw new CustomException("", "更新失败，数据库连接对象id不存在！");
		// 判断名称是否更新，如果名称更新了，需要检查新名称是否已存在
		String orignalName = datasources.get(0).getName();
		if (!orignalName.equals(myqdpDataSource.getName())
				&& isConnectionExist(myqdpDataSource.getName(), person.getId())) {
			throw new CustomException("", "此连接名称已存在！");
		}
		ReportDBManager.execute(new DBexecuteVoid() {
			@Override
			public void execute(EntityManager em) throws CustomException {
				em.merge(myqdpDataSource);
			}
		});
	}

	/**
	 * 判断数据库连接是否合法
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param datasource
	 *            数据库连接信息
	 * @throws CustomException
	 */
	protected void checkConnection(MyqdpDatasource datasource) throws CustomException {
		if (StringUtils.isStrNull(datasource.getName()))
			throw new CustomException("", "数据库连接名称不能为空");
		if (StringUtils.isStrNull(datasource.getServerName()))
			throw new CustomException("", "数据库连接IP不能为空");
		if (datasource.getPort() == null)
			throw new CustomException("", "数据库连接端口不能为空");
		if (StringUtils.isStrNull(datasource.getDbName()))
			throw new CustomException("", "数据库连接表名不能为空");
		if (StringUtils.isStrNull(datasource.getUserName()))
			throw new CustomException("", "数据库连接用户名不能为空");
		if (StringUtils.isStrNull(datasource.getPassword()))
			throw new CustomException("", "数据库连接密码不能为空");
	}

	/**
	 * 根据数据库连接是否存在
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param name
	 *            数据库连接名称
	 * @param personId
	 *            当前登录用户id
	 * @throws CustomException
	 */
	public static boolean isConnectionExist(String name, String personId) throws CustomException {
		Object connectionNum = ReportDBManager.get()
				.createNativeQuery(
						"SELECT COUNT(id) FROM t_myqdp_datasource WHERE name=? AND person_id=? AND system_type=?")
				.setParameter(1, name).setParameter(2, personId).setParameter(3, DBSystemType.USER).getSingleResult();
		if (StringUtils.toInt(connectionNum, 0) > 0)
			return true;
		return false;
	}

	/**
	 * 删除数据库连接
	 * 
	 * @Author: 朱才富
	 * @param request
	 *            数据库连接id
	 * @throws CustomException
	 */
	public void deleteConnection(@RpcParam(loginPersonParam = true) WebRequest<String> request)
			throws CustomException {
		String idStr = request.getData();
		if (StringUtils.isNull(idStr)) {
			throw new CustomException("", "更新失败，数据库连接对象id不能为空！");
		}
		String[] ids = idStr.split(",");
		String idWhere = StringUtils.Array2String(ids, "id");
		Person person = request.getLoginPerson();
		String where = idWhere + " AND person_id='" + person.getId() + "'";

		ReportDBManager.execute(new DBexecuteVoid() {
			@Override
			public void execute(EntityManager em) throws CustomException {
				em.createNativeQuery("DELETE FROM t_myqdp_datasource " + where).executeUpdate();
				for (String id : ids) {
					DBManager.removeConnect(id);
				}
			}
		});
	}

	/**
	 * 根据数据库连接ID获取数据库表
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param request
	 *            数据库连接id
	 * @return
	 * @throws CustomException
	 */
	public List<String> getTables(@RpcParam(loginPersonParam = true) WebRequest<String> request)
			throws CustomException {
		String id = request.getData();
		MyqdpDatasource datasource = getOneConnction(id, request.getLoginPerson());
		int valid = startTestConnection(datasource); // 测试数据库连接
		if (valid == 0)
			throw new CustomException("", "数据库连接失败！");
		String schemaPattern = null;
		if (datasource.isOracle()) {
			schemaPattern = datasource.getUserName();
		}
		return ReportDBUtils.getTables(ReportDBUtils.getConnection(datasource), schemaPattern, false);
	}

	/**
	 * 根据数据库连接名称获取数据库表
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param request
	 *            数据库连接名称
	 * @return
	 * @throws CustomException
	 */
	public List<String> getTablesByConnectionName(@RpcParam(loginPersonParam = true) WebRequest<String> request)
			throws CustomException {
		String name = request.getData();
		if (StringUtils.isNull(name))
			throw new CustomException("", "数据库连接名称不能为空！");
		Person person = request.getLoginPerson();
		List<MyqdpDatasource> datasources = ReportDBManager.get()
				.createQuery(" FROM MyqdpDatasource WHERE name=? AND person_id=?", MyqdpDatasource.class)
				.setParameter(1, name).setParameter(2, person.getId()).getResultList();
		if (datasources.size() < 1)
			throw new CustomException("", "数据库连接对象不存在！");
		MyqdpDatasource datasource = datasources.get(0);
		int valid = startTestConnection(datasource); // 测试数据库连接
		if (valid == 0)
			throw new CustomException("", "数据库连接失败！");
		String schemaPattern = null;
		if (datasource.isOracle()) {
			schemaPattern = datasource.getUserName();
		}
		return ReportDBUtils.getTables(ReportDBUtils.getConnection(datasource), schemaPattern, false);
	}

	/**
	 * 获取数据库表字段
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param request
	 *            id 数据库连接ID tableName 数据库表名
	 * @return
	 * @throws CustomException
	 */
	public List<DBFieldMeta> getFieldsFromTable(
			@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> data = request.getData();
		String id = data.get("id");
		String tableName = data.get("tableName");
		MyqdpDatasource datasource = getOneConnction(id, request.getLoginPerson());
		int valid = startTestConnection(datasource); // 测试数据库连接
		if (valid == 0)
			throw new CustomException("", "数据库连接失败！");
		String schemaPattern = null;
		if (datasource.isOracle()) {
			schemaPattern = datasource.getUserName();
		}
		return ReportDBUtils.getFieldsFromTable(ReportDBUtils.getConnection(datasource), schemaPattern, tableName,
				true);
	}

	/**
	 * 获取数据库样例数据（默认30条）
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param request
	 *            id 数据库连接ID tableName 数据库表名
	 * @return
	 * @throws CustomException
	 */
	public List<Object[]> tableExampleDatas(@RpcParam(loginPersonParam = true) WebRequest<Map<String, String>> request)
			throws CustomException {
		Map<String, String> data = request.getData();
		String id = data.get("id");
		MyqdpDatasource datasource = getOneConnction(id, request.getLoginPerson());
		int valid = startTestConnection(datasource); // 测试数据库连接
		if (valid == 0)
			throw new CustomException("", "数据库连接失败！");
		String tableName = data.get("tableName");
		String schemaPattern = null;
		if (datasource.isOracle()) {
			schemaPattern = datasource.getUserName();
		}
		return ReportDBUtils.getTableExampleDatas(datasource, schemaPattern, tableName, true);
	}

	/**
	 * 测试数据库连接
	 * 
	 * @param request
	 *            数据库连接ID
	 * @return
	 * @throws CustomException
	 */
	public Integer testConnectionById(@RpcParam(loginPersonParam = true) WebRequest<String> request)
			throws CustomException {
		return startTestConnection(getOneConnction(request.getData(), request.getLoginPerson()));
	}
	
	/**
	 * 测试数据库连接
	 * 
	 * @param request
	 *            数据库连接ID
	 * @return
	 * @throws CustomException
	 */
	public Integer testConnection(@RpcParam(loginPersonParam = true) WebRequest<MyqdpDatasource> request)
			throws CustomException {
		MyqdpDatasource datasource = request.getData();
		datasource.reSetMyqdpDataSource();
		return startTestConnection(request.getData());
	}

	/**
	 * 测试数据库连接
	 * 
	 * @param datasource
	 *            数据库连接
	 */
	public Integer startTestConnection(MyqdpDatasource datasource) throws CustomException {
		return datasource.validateConnect() ? 1 : 0;
	}

	/**
	 * 获取一个数据库连接
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param id
	 * @param person
	 * @return
	 * @throws CustomException
	 */
	public static MyqdpDatasource getOneConnction(String id, Person person) throws CustomException {
		if (StringUtils.isNull(id))
			throw new CustomException("", "数据库连接对象id不能为空！");
		List<MyqdpDatasource> datasources = ReportDBManager.get()
				.createQuery(" FROM MyqdpDatasource WHERE id=? AND person_id=?", MyqdpDatasource.class)
				.setParameter(1, id).setParameter(2, person.getId()).getResultList();
		if (datasources.size() < 1)
			throw new CustomException("", "数据库连接对象不存在！");
		return datasources.get(0);
	}
	
	/**
	 * 获取一个数据库连接
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param id
	 * @param person
	 * @return
	 * @throws CustomException
	 */
	public static MyqdpDatasource getOneConnction(String id) throws CustomException {
		if (StringUtils.isNull(id))
			throw new CustomException("", "数据库连接对象id不能为空！");
		List<MyqdpDatasource> datasources = ReportDBManager.get()
				.createQuery(" FROM MyqdpDatasource WHERE id=?", MyqdpDatasource.class)
				.setParameter(1, id).getResultList();
		if (datasources.size() < 1)
			throw new CustomException("", "数据库连接对象不存在！");
		return datasources.get(0);
	}

	/**
	 * 获取一个数据库连接
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param name
	 *            数据库连接名称
	 * @param person
	 *            当前登录用户
	 * @return
	 * @throws CustomException
	 */
	public static MyqdpDatasource getOneConnctionByName(String name, Person person) throws CustomException {
		return getOneConnctionByName(name, person, false);
	}

	/**
	 * 通过数据库连接名称获取一个数据库连接
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param name
	 *            数据库连接名称
	 * @param person
	 *            当前登录用户
	 * @param check
	 *            是否检查数据库连接是否存在
	 * @return
	 * @throws CustomException
	 */
	public static MyqdpDatasource getOneConnctionByName(String name, Person person, boolean check)
			throws CustomException {
		if (StringUtils.isNull(name))
			throw new CustomException("", "数据库连接对象名称不能为空！");
		List<MyqdpDatasource> datasources = ReportDBManager.get()
				.createQuery(" FROM MyqdpDatasource WHERE name=? AND person_id=?", MyqdpDatasource.class)
				.setParameter(1, name).setParameter(2, person.getId()).getResultList();
		if (datasources.size() < 1) {
			if (check) {
				throw new CustomException("", "数据库连接对象不存在！");
			} else {
				return null;
			}
		}
		return datasources.get(0);
	}

	/**
	 * 获取所有数据库连接
	 */
	@Override
	public List<MyqdpDatasource> getAllConnection(@RpcParam(loginPersonParam = true) WebRequest<String> request)
			throws CustomException {
		Person person = request.getLoginPerson();
		return ReportDBManager.get()
				.createQuery("FROM MyqdpDatasource WHERE systemType=? AND person_id=?", MyqdpDatasource.class)
				.setParameter(1, DBSystemType.USER).setParameter(2, person.getId()).getResultList();
	}

	/**
	 * 查询所有数据源的ID和名称
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<Map<String, String>> getAllConnectionIDAndName(@RpcParam(loginPersonParam = true) WebRequest<String> request)
			throws CustomException {
		Person person = request.getLoginPerson();
		String sql = "SELECT id, name FROM t_myqdp_datasource WHERE system_type=? AND person_id=?";
		@SuppressWarnings("unchecked")
		List<Object[]> connections = ReportDBManager.get().createNativeQuery(sql).setParameter(1, DBSystemType.USER)
				.setParameter(2, person.getId()).getResultList();
		List<Map<String, String>> result = new ArrayList<Map<String,String>>();
		for(Object[] connection : connections) {
			Map<String, String> item = new HashMap<String, String>();
			item.put("id", connection[0].toString());
			item.put("name", connection[1].toString());
			result.add(item);
		}
		return result;
	}

	/**
	 * 读取数据库中所有的 System 类型数据库连接
	 * 
	 * @Author: 朱才富
	 * @return
	 * @throws CustomException
	 */
	public List<MyqdpDatasource> getAllUserConnection() throws CustomException {
		return ReportDBManager.get().createQuery("FROM MyqdpDatasource WHERE systemType=?", MyqdpDatasource.class)
				.setParameter(1, DBSystemType.USER).getResultList();
	}

}
