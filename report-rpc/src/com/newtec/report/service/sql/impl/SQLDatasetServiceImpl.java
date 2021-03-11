package com.newtec.report.service.sql.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
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
import com.newtec.report.common.dto.SQLDatasetDTO;
import com.newtec.report.common.entity.sql.SQLDataset;
import com.newtec.report.common.entity.sql.SQLDatasetField;
import com.newtec.report.common.entity.sql.SQLDatasetParam;
import com.newtec.report.service.dataset.impl.DatasetServiceImpl;
import com.newtec.report.service.sql.SQLDatasetService;
import com.newtec.report.utils.SqlDatasetUtil;
import com.newtec.rpc.db.DBexecuteVoid;

import cn.hutool.core.util.StrUtil;

/**
 * SQL 数据集实现类
 * 
 * @date 2020年12月28日
 */
@RpcClass("sqlDatasetService")
public class SQLDatasetServiceImpl implements SQLDatasetService {

	/**
	 * 添加保存或者更新 SQL 数据集信息
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void saveDataset(@RpcParam(loginPersonParam = true) WebRequest<SQLDatasetDTO> request)
			throws CustomException {
		// 获取参数
		SQLDatasetDTO datasetDTO = request.getData();
		SQLDataset dataset = datasetDTO.getDataset();
		Person person = request.getLoginPerson();

		if (dataset.getReportId() == null)
			throw new CustomException("", "报表ID不能为空");
		if (StrUtil.isEmpty(dataset.getConnectionId()))
			throw new CustomException("", "数据源ID不能为空");
		if (StrUtil.isEmpty(dataset.getCode()))
			throw new CustomException("", "数据集编码不能为空");
		if (StrUtil.isEmpty(dataset.getName()))
			throw new CustomException("", "数据集名称不能为空");
		String sql = dataset.getDbSql();
		if (StrUtil.isEmpty(sql))
			throw new CustomException("", "数据集SQL语句不能为空");
		sql = sql.trim();
		if (!sql.startsWith("select"))
			throw new CustomException("", "SQL查询语句不合法（须以`select`开头）");

		dataset.setPersonId(person.getId());

		// 数据集字段信息
		List<SQLDatasetField> sqlFileds = datasetDTO.getFields();
		// 数据集动态参数信息
		List<SQLDatasetParam> sqlParams = datasetDTO.getParams();
		// 如果前端未上传字段信息，则执行 SQL 解析字段信息
		if (sqlFileds == null || sqlFileds.size() < 1) {
			sqlFileds = SqlDatasetUtil.analysisSqlDatasetField(dataset, sqlParams, null);
			if (sqlFileds == null || sqlFileds.size() < 1) {
				throw new CustomException("", "未解析到数据集字段信息");
			}
		}
		final List<SQLDatasetField> tFileds = sqlFileds;
		final List<SQLDatasetParam> tParams = sqlParams;
		if (dataset.getId() == null) { // 新增
			// 判断编码唯一性
			if (DatasetServiceImpl.isDatasetCodeExist(dataset.getCode())) {
				throw new CustomException("", "数据集编码【" + dataset.getCode() + "】已存在");
			}
			dataset.setPersonId(person.getId());
			dataset.setUpdatePersonId(person.getId());
			dataset.setCreateTime(new Date());
			dataset.setUpdateTime(dataset.getCreateTime());
			try {
				ReportDBManager.execute(new DBexecuteVoid() {
					@Override
					public void execute(EntityManager em) throws CustomException {
						// 保存数据集信息
						em.persist(dataset);
						// 保存字段信息
						for (SQLDatasetField field : tFileds) {
							field.setDatasetId(dataset.getId());
							em.persist(field);
						}
						// 保存动态参数信息
						if (tParams != null && tParams.size() != 0) {
							for (SQLDatasetParam param : tParams) {
								param.setDatasetId(dataset.getId());
								em.persist(param);
							}
						}
					}
				});
			} catch (Exception e) {
				e.printStackTrace();
				throw new CustomException("", "系统异常，保存失败");
			}
		} else { // 更新
			SQLDataset oldDataset = getOneDataset(dataset.getId());
			dataset.setUpdateTime(new Date());
			dataset.setUpdatePersonId(request.getLoginPerson().getId());
			dataset.setCreateTime(oldDataset.getCreateTime());
			dataset.setPersonId(oldDataset.getPersonId());
			try {
				ReportDBManager.execute(new DBexecuteVoid() {
					@Override
					public void execute(EntityManager em) throws CustomException {
						// 删除旧的字段和动态参数信息
						em.createNativeQuery("delete from t_sql_dataset_field where dataset_id=" + dataset.getId())
								.executeUpdate();
						em.createNativeQuery("delete from t_sql_dataset_param where dataset_id=" + dataset.getId())
								.executeUpdate();
						// 保存新的字段和动态参数信息
						for (SQLDatasetField field : tFileds) {
							field.setDatasetId(dataset.getId());
							field.setId(null);
							em.persist(field);
						}
						if (tParams != null && tParams.size() != 0) {
							for (SQLDatasetParam param : tParams) {
								param.setDatasetId(dataset.getId());
								param.setId(null);
								em.persist(param);
							}
						}
						// 保存数据集信息
						em.merge(dataset);
					}
				});
			} catch (Exception e) {
				e.printStackTrace();
				throw new CustomException("", "系统异常，更新失败");
			}
		}
	}

	/**
	 * 解析 SQL 数据集返回结果中的字段信息
	 * 
	 * @param request
	 * @throws CustomException
	 */
	@Override
	public List<SQLDatasetField> analysisDatasetFields(WebRequest<SQLDatasetDTO> request) throws CustomException {

		SQLDatasetDTO datasetDTO = request.getData();
		SQLDataset dataset = datasetDTO.getDataset();
		String sql = dataset.getDbSql();
		
		System.out.println(JsonUtil.objecte2JsonString(dataset));

		if (StrUtil.isEmpty(sql))
			throw new CustomException("", "SQL查询语句不能为空");
		sql = sql.trim();
		if (!sql.startsWith("select"))
			throw new CustomException("", "SQL查询语句不合法（须以`select`开头）");
		return SqlDatasetUtil.analysisSqlDatasetField(dataset, datasetDTO.getParams(), null);
	}

	/**
	 * 根据SQL数据集信息的 ID（包括字段和动态参数信息）
	 * 
	 * @param request
	 * @return{formData:解析表单数据, filedsData:动态配置明细table数据, paramsData:报表参数数据}
	 * @throws CustomException
	 */
	@Override
	public Map<String, Object> queryDatasetInfo(WebRequest<Long> request) throws CustomException {
		Map<String, Object> map = new HashMap<String, Object>();
		Long id = request.getData();
		if (id == null)
			throw new CustomException("", "数据集 ID 不能为空");
		map.put("dataset", getOneDataset(id));
		map.put("fields", getDatasetFields(id, true));
		map.put("params", getDatasetParams(id, false));
		return map;
	}

	/**
	 * 根据id查询出相关数据集列表 以及每个sql数据集的filed属性数组
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<Map<String, Object>> findDatasetList(WebRequest<Map<String, String>> request) throws CustomException {
		Map<String, String> params = request.getData();
		String withParams = params.get("withParams");
		boolean needParams = "1".equals(withParams); // 是否需要查询数据集参数
		Long reportId = StringUtils.toLong(params.get("reportId"), -1);
		if (reportId == -1) {
			throw new CustomException("", "报表ID为空或不合法");
		}
		List<SQLDataset> datasets = ReportDBManager.get()
				.createQuery("FROM SQLDataset WHERE reportId=?", SQLDataset.class).setParameter(1, reportId)
				.getResultList();
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		if (datasets == null || datasets.size() < 1)
			return result;

		Map<Long, List<SQLDatasetField>> filedListMap = new HashMap<Long, List<SQLDatasetField>>();
		Map<Long, List<SQLDatasetParam>> paramListMap = new HashMap<Long, List<SQLDatasetParam>>();
		String[] infoIds = new String[datasets.size()];
		int i = 0;
		for (SQLDataset dataset : datasets) {
			Map<String, Object> item = new HashMap<String, Object>();
			infoIds[i] = dataset.getId().toString();
			item.put("id", dataset.getId());
			item.put("code", dataset.getCode());
			item.put("name", dataset.getName());
			item.put("dsType", 1); // 数据集类型 1 SQL 2 API
			// 数据集 fields
			List<SQLDatasetField> fields = new ArrayList<SQLDatasetField>();
			item.put("fields", fields);
			filedListMap.put(dataset.getId(), fields);

			// 数据集动态参数
			if (needParams) {
				List<SQLDatasetParam> apiParams = new ArrayList<SQLDatasetParam>();
				item.put("params", apiParams);
				paramListMap.put(dataset.getId(), apiParams);
			}
			result.add(item);
		}

		// 查询数据集字段信息
		List<SQLDatasetField> allFileds = ReportDBManager.get()
				.createQuery("FROM SQLDatasetField" + StringUtils.Array2String(infoIds, "datasetId"), SQLDatasetField.class)
				.getResultList();
		if (allFileds != null && allFileds.size() > 0) {
			for (SQLDatasetField field : allFileds) {
				filedListMap.get(field.getDatasetId()).add(field);
			}
		}

		// 查询数据集动态参数
		if (needParams) {
			List<SQLDatasetParam> allParam = ReportDBManager.get()
					.createQuery("FROM SQLDatasetParam" + StringUtils.Array2String(infoIds, "datasetId"), SQLDatasetParam.class)
					.getResultList();
			if (allParam != null && allParam.size() > 0) {
				for (SQLDatasetParam param : allParam) {
					paramListMap.get(param.getDatasetId()).add(param);
				}
			}
		}
		return result;
	}

	/**
	 * 根据 ID 删除数据集
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void deleteDataset(WebRequest<Long> request) throws CustomException {
		Long id = request.getData();
		if (id == null)
			throw new CustomException("", "报表ID不能为空");
		try {
			ReportDBManager.execute(new DBexecuteVoid() {
				@Override
				public void execute(EntityManager em) throws CustomException {
					// 删除数据集字段
					em.createNativeQuery("DELETE FROM t_sql_dataset_field WHERE dataset_id=" + id).executeUpdate();
					// 删除数据集动态参数
					em.createNativeQuery("DELETE FROM t_sql_dataset_param WHERE dataset_id=" + id).executeUpdate();
					// 删除数据集信息
					em.createNativeQuery("DELETE FROM t_sql_dataset WHERE id=" + id).executeUpdate();
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("", "系统异常，删除失败");
		}

	}

	/**
	 * 根据报表 ID 查出所有的数据集的 id、name
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<Map<String, Object>> getDatasetIdAndName(WebRequest<Long> request) throws CustomException {

		Long reportId = request.getData();
		if (reportId == null)
			throw new CustomException("", "报表ID不能为空");

		List<SQLDataset> list = ReportDBManager.get().createQuery("FROM SQLDataset WHERE reportId=?", SQLDataset.class)
				.setParameter(1, reportId).getResultList();
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		if (list != null && list.size() > 0) {
			for (int i = 0; i < list.size(); i++) {
				SQLDataset dataset = list.get(i);
				Map<String, Object> item = new HashMap<String, Object>();
				item.put("id", dataset.getId());
				item.put("name", dataset.getName());
				result.add(item);
			}
		}
		return result;
	}

	/**
	 * 根据数据集ID查询数据集数据
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<Map<String, Object>> queryDatasetData(WebRequest<Long> request) throws CustomException {
		Long id = request.getData();
		if (id == null)
			throw new CustomException("", "数据集ID不能为空");
		return SqlDatasetUtil.findSqlData(getOneDataset(id), null);
	}

	/**
	 * 根据 ID 删除数据集
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	public static void deleteDatasetByReportId(Long reportId) throws CustomException {
		List<Object> ids = ReportDBManager.get().createNativeQuery("SELECT id FROM t_sql_dataset WHERE report_id=?")
				.setParameter(1, reportId).getResultList();
		List<String> idStrs = new ArrayList<String>();
		for(Object id : ids) {
			idStrs.add(id.toString());
		}
		if (ids != null && ids.size() > 0) {
			String where = StringUtils.List2String(idStrs, "dataset_id");
			try {
				ReportDBManager.execute(new DBexecuteVoid() {
					@Override
					public void execute(EntityManager em) throws CustomException {
						// 删除数据集字段
						em.createNativeQuery("DELETE FROM t_sql_dataset_field " + where).executeUpdate();
						// 删除数据集动态参数
						em.createNativeQuery("DELETE FROM t_sql_dataset_param " + where).executeUpdate();
						// 删除数据集信息
						em.createNativeQuery("DELETE FROM t_sql_dataset WHERE report_id=?").setParameter(1, reportId).executeUpdate();
					}
				});
			} catch (Exception e) {
				e.printStackTrace();
				throw new CustomException("", "系统异常，删除报表SQL数据集失败");
			}
		}
	}

	/**
	 * 根据报表ID和数据集code查询SQL数据集
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param reportId
	 * @param codes
	 * @return
	 * @throws CustomException
	 */
	public static List<SQLDataset> queryDatasets(Long reportId, String[] codes) throws CustomException {
		String where = StringUtils.Array2String(codes, "code") + " AND reportId=?";
		return ReportDBManager.get().createQuery("FROM SQLDataset " + where, SQLDataset.class).setParameter(1, reportId)
				.getResultList();
	}

	/**
	 * 根据 ID 查询数据集对象
	 * 
	 * @param id 数据集ID
	 * @return
	 */
	public static SQLDataset getOneDataset(Long id) throws CustomException {
		List<SQLDataset> datasets = ReportDBManager.get().createQuery("FROM SQLDataset WHERE id=?", SQLDataset.class)
				.setParameter(1, id).getResultList();
		if (datasets == null || datasets.size() == 0) {
			throw new CustomException("", "数据集ID【" + id + "】不存在");
		}
		return datasets.get(0);
	}

	/**
	 * 查询数据集字段信息
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param id        数据集ID
	 * @param checkNone 是否判空
	 * @return
	 * @throws CustomException
	 */
	public static List<SQLDatasetField> getDatasetFields(Long id, boolean checkNone) throws CustomException {
		List<SQLDatasetField> fileds = ReportDBManager.get()
				.createQuery("FROM SQLDatasetField WHERE datasetId = ?", SQLDatasetField.class).setParameter(1, id)
				.getResultList();
		if (checkNone && (fileds == null || fileds.size() == 0)) {
			throw new CustomException("", "未查询到数据集（" + id + "）字段信息");
		}
		return fileds;
	}

	/**
	 * 查询数据集动态参数信息
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param id        数据集ID
	 * @param checkNone 是否判空
	 * @return
	 * @throws CustomException
	 */
	public static List<SQLDatasetParam> getDatasetParams(Long id, boolean checkNone) throws CustomException {
		List<SQLDatasetParam> params = ReportDBManager.get()
				.createQuery("FROM SQLDatasetParam WHERE datasetId = ?", SQLDatasetParam.class).setParameter(1, id)
				.getResultList();
		if (checkNone && (params == null || params.size() == 0)) {
			throw new CustomException("", "未查询到数据集（" + id + "）动态参数信息");
		}
		return params;
	}

}
