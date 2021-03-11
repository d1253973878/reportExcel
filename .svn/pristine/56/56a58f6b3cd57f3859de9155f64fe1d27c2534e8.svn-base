package com.newtec.report.service.api.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;

import com.newtec.myqdp.entity.orga.Person;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.reflect.annotation.RpcParam;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.common.dto.APIDatasetDTO;
import com.newtec.report.common.entity.api.APIDatasetField;
import com.newtec.report.common.entity.api.APIDataset;
import com.newtec.report.common.entity.api.APIDatasetParam;
import com.newtec.report.service.api.APIDatasetService;
import com.newtec.report.service.dataset.impl.DatasetServiceImpl;
import com.newtec.report.utils.ApiDatasetUtil;
import com.newtec.rpc.db.DBexecuteVoid;

import cn.hutool.core.util.StrUtil;

/**
 * API 数据集信息service实现类
 * 
 * @author 黄腾
 * @date 2020年12月24日 上午10:05:34
 */
@RpcClass("apiDatasetService")
public class APIDatasetServiceImpl implements APIDatasetService {

	/**
	 * 保存或者更新 API 数据集信息
	 * @author 黄腾
	 * @param request
	 * @throws CustomException
	 */
	@Override
	public void saveDataset(@RpcParam(loginPersonParam = true) WebRequest<APIDatasetDTO> request)
			throws CustomException {

		APIDatasetDTO datasetDTO = request.getData();
		APIDataset dataset = datasetDTO.getDataset();
		Person person = request.getLoginPerson();

		// 对相关必填字段进行校验
		if (dataset.getReportId() == null)
			throw new CustomException("-2", "报表ID不能为空");
		if (StrUtil.isEmpty(dataset.getCode()))
			throw new CustomException("-4", "数据集编码不能为空");
		if (StrUtil.isEmpty(dataset.getName()))
			throw new CustomException("-5", "数据集名称不能为空");
		if (StrUtil.isEmpty(dataset.getUrl()))
			throw new CustomException("-6", "数据集请求地址不能为空");

		// 解析数据集的字段信息和动态参数信息
		List<APIDatasetField> apiFields = datasetDTO.getFields(); // 字段信息
		List<APIDatasetParam> apiParams = datasetDTO.getParams(); // 参数信息
		
		// 如果前端未上传字段信息，则单独请求API解析字段信息
		if (apiFields == null || apiFields.size() < 1) {
			apiFields = ApiDatasetUtil.analysisApiDatasetField(dataset, apiParams, null);
			if (apiFields == null || apiFields.size() < 1) {
				throw new CustomException("", "未解析到数据集字段信息");
			}
		}
		final List<APIDatasetField> tFields = apiFields;
		final List<APIDatasetParam> tParams = apiParams;
		if (dataset.getId() == null) { // 新增
			// 由于编码需要保持唯一性 所以对编码进行验证
			if (DatasetServiceImpl.isDatasetCodeExist(dataset.getCode())) {
				throw new CustomException("-77", "数据集编码【" + dataset.getCode() + "】已存在");
			}
			dataset.setPersonId(person.getId());
			dataset.setUpdatePersonId(person.getId());
			ReportDBManager.execute(new DBexecuteVoid() {
				@Override
				public void execute(EntityManager em) throws CustomException {
					em.persist(dataset);
					for (APIDatasetField apiField : tFields) {
						apiField.setDatasetId(dataset.getId());
						em.persist(apiField);
					}
					if (tParams != null && tParams.size() > 0) {
						for (APIDatasetParam param : tParams) {
							param.setDatasetId(dataset.getId());
							em.persist(param);
						}
					}
				}
			});
		} else { // 更新
			// 先查询出id对应的信息
			List<APIDataset> datasets = ReportDBManager.get()
					.createQuery(" FROM APIDataset WHERE id=?", APIDataset.class)
					.setParameter(1, dataset.getId()).getResultList();
			if (datasets == null || datasets.size() == 0) {
				throw new CustomException("", "数据集【" + dataset.getName() + "（" + dataset.getCode() + "）】不存在");
			}
			// 设置更新时间
			dataset.setUpdateTime(new Date());
			// 设置更新人id
			dataset.setUpdatePersonId(person.getId());
			// 设置必填项
			dataset.setPersonId(datasets.get(0).getPersonId());
			dataset.setCreateTime(datasets.get(0).getCreateTime());
			ReportDBManager.execute(new DBexecuteVoid() {
				@Override
				public void execute(EntityManager em) throws CustomException {
					em.merge(dataset);
					// 然后删除对应的 fields 和 params
					em.createNativeQuery(" DELETE FROM t_api_dataset_field WHERE dataset_id=" + dataset.getId())
							.executeUpdate();
					em.createNativeQuery(" DELETE FROM t_api_dataset_param WHERE dataset_id=" + dataset.getId())
							.executeUpdate();
					for (APIDatasetField apiField : tFields) {
						apiField.setDatasetId(dataset.getId());
						apiField.setId(null);
						em.persist(apiField);
					}
					if (tParams != null && tParams.size() > 0) {
						for (APIDatasetParam param : tParams) {
							param.setDatasetId(dataset.getId());
							param.setId(null);
							em.persist(param);
						}
					}
				}
			});
		}

	}

	/**
	 * 解析 API数据集返回结果中的字段信息
	 * 
	 * @author 黄腾
	 * @param request
	 * @throws CustomException
	 */
	@Override
	public List<APIDatasetField> analysisDatasetFields(WebRequest<APIDatasetDTO> request)
			throws CustomException {
		APIDatasetDTO datasetDTO = request.getData();
		APIDataset dataset = datasetDTO.getDataset();

		String requestUrl = dataset.getUrl();
		if (StrUtil.isEmpty(requestUrl))
			throw new CustomException("-1", "数据集请求地址不能为空");
		return ApiDatasetUtil.analysisApiDatasetField(dataset, datasetDTO.getParams(), null);
	}

	/**
	 * 根据 API 数据集信息的 ID 查询出相关的 fields 和 params 并返回
	 * 
	 * @author 黄腾
	 * @param request
	 * @return {formData:解析表单数据, filedsData:动态配置明细table数据, paramsData:报表参数数据}
	 * @throws CustomException
	 */
	@Override
	public Map<String, Object> queryDatasetInfo(WebRequest<Long> request) throws CustomException {
		Long id = request.getData();
		if (id == null) throw new CustomException("", "数据集 ID 不能为空");
		Map<String, Object> result = new HashMap<String, Object>();
		APIDataset dataset = getOneDataset(id);
		result.put("dataset", dataset);
		result.put("fields", getDatasetFields(id, true));
		result.put("params", getDatasetParams(id, false));
		return result;
	}

	/**
	 * 查询 API 数据集列表 及 每个 API 数据集的filed属性数组
	 * 
	 * @author 黄腾
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@Override
	public List<Map<String, Object>> findDatasetList(WebRequest<Map<String, String>> request) throws CustomException {

		Map<String, String> params = request.getData();
		String withParams = params.get("withParams");
		boolean needParams = "1".equals(withParams);
		Long reportId = StringUtils.toLong(params.get("reportId"), -1);
		if (reportId == -1) {
			throw new CustomException("", "报表ID为空或不合法");
		}
		List<APIDataset> datasets = ReportDBManager.get()
				.createQuery("FROM APIDataset WHERE reportId=?", APIDataset.class).setParameter(1, reportId)
				.getResultList();
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		if (datasets == null || datasets.size() < 1)
			return result;
		Map<Long, List<APIDatasetField>> filedListMap = new HashMap<Long, List<APIDatasetField>>();
		Map<Long, List<APIDatasetParam>> paramListMap = new HashMap<Long, List<APIDatasetParam>>();
		String[] datasetIds = new String[datasets.size()]; // 收集数据集ID，用于查询数据集字段和动态参数信息
		int i = 0;
		for (APIDataset dataset : datasets) {
			Map<String, Object> item = new HashMap<String, Object>();
			datasetIds[i] = dataset.getId().toString();
			item.put("id", dataset.getId());
			item.put("code", dataset.getCode());
			item.put("name", dataset.getName());
			item.put("dsType", 2); // 数据集类型 1 SQL 2 API
			// 数据集 fields
			List<APIDatasetField> fields = new ArrayList<APIDatasetField>();
			item.put("fields", fields);
			filedListMap.put(dataset.getId(), fields);
			// 数据集动态参数
			if (needParams) {
				List<APIDatasetParam> apiParams = new ArrayList<APIDatasetParam>();
				item.put("params", apiParams);
				paramListMap.put(dataset.getId(), apiParams);
			}
			result.add(item);
		}
		// 查询数据集字段信息
		List<APIDatasetField> allFileds = ReportDBManager.get()
				.createQuery("FROM APIDatasetField" + StringUtils.Array2String(datasetIds, "datasetId"),
						APIDatasetField.class)
				.getResultList();
		if (allFileds != null && allFileds.size() > 0) {
			for (APIDatasetField field : allFileds) {
				filedListMap.get(field.getDatasetId()).add(field);
			}
		}
		// 查询数据集动态参数
		if (needParams) {
			List<APIDatasetParam> allParam = ReportDBManager.get()
					.createQuery("FROM APIDatasetParam" + StringUtils.Array2String(datasetIds, "datasetId"),
							APIDatasetParam.class)
					.getResultList();
			if (allParam != null && allParam.size() > 0) {
				for (APIDatasetParam param : allParam) {
					paramListMap.get(param.getDatasetId()).add(param);
				}
			}
		}
		return result;
	}

	/**
	 * 根据 API 数据集 ID 删除 API 数据集
	 * @author 黄腾
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@Override
	public void deleteDataset(WebRequest<Long> request) throws CustomException {
		Long id = request.getData();
		if (id == null) throw new CustomException("", "数据集ID不能为空");
		try {
			ReportDBManager.execute(new DBexecuteVoid() {
				@Override
				public void execute(EntityManager em) throws CustomException {
					// 先删除数据集字段
					em.createNativeQuery("DELETE FROM t_api_dataset_field WHERE dataset_id=" + id)
							.executeUpdate();
					// 删除数据集动态参数
					em.createNativeQuery("DELETE FROM t_api_dataset_param WHERE dataset_id=" + id)
							.executeUpdate();
					// 删除数据集信息
					em.createNativeQuery("DELETE FROM t_api_dataset WHERE id=" + id).executeUpdate();
				}
			});
		} catch (Exception e) {
			e.printStackTrace();
			throw new CustomException("", "系统异常！删除失败！");
		}
	}

	/**
	 * 根据 API 数据集 ID 获取数据集数据
	 * 
	 * @author 黄腾
	 * @param request 包含数据集 ID
	 * @throws CustomException
	 */
	@Override
	public List<Map<String, Object>> queryDatasetData(WebRequest<Long> request) throws CustomException {
		Long id = request.getData();
		if (id == null) throw new CustomException("", "数据集ID不能为空");
		return ApiDatasetUtil.getApiDatasetData(getOneDataset(id), null);
	}

	/**
	 * 根据报表 ID 查询出其下的 API 数据集的 ID 和名称
	 * 
	 * @author 黄腾
	 * @param request 包含报表id
	 * @return 返回 API 数据集的 ID 和名称数组
	 * @throws CustomException
	 */
	@Override
	public List<Map<String, String>> getDatasetIdAndName(WebRequest<Long> request)
			throws CustomException {
		Long reportId = request.getData();
		if (reportId == null) throw new CustomException("", "报表ID不能为空");

		List<APIDataset> datasets = ReportDBManager.get()
				.createQuery("FROM APIDataset WHERE reportId=?", APIDataset.class)
				.setParameter(1, reportId).getResultList();
		List<Map<String, String>> result = new ArrayList<Map<String, String>>();

		if (datasets != null && datasets.size() > 0) {
			for (APIDataset dataset : datasets) {
				Map<String, String> item = new HashMap<String, String>();
				item.put("id", dataset.getId().toString());
				item.put("name", dataset.getName());
				result.add(item);
			}
		}
		return result;
	}
	
	/**
	 * 根据 ID 删除API数据集
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	public static void deleteDatasetByReportId(Long reportId) throws CustomException {
		List<Object> ids = ReportDBManager.get().createNativeQuery("SELECT id FROM t_api_dataset WHERE report_id=?")
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
						em.createNativeQuery("DELETE FROM t_api_dataset_field " + where).executeUpdate();
						// 删除数据集动态参数
						em.createNativeQuery("DELETE FROM t_api_dataset_param " + where).executeUpdate();
						// 删除数据集信息
						em.createNativeQuery("DELETE FROM t_api_dataset WHERE report_id=?").setParameter(1, reportId).executeUpdate();
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
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param reportId
	 * @param codes
	 * @return
	 * @throws CustomException
	 */
	public static List<APIDataset> queryDatasets(Long reportId, String[] codes) throws CustomException {
		String where = StringUtils.Array2String(codes, "code") + " AND reportId=?";
		return ReportDBManager.get()
				.createQuery("FROM APIDataset " + where, APIDataset.class)
				.setParameter(1, reportId).getResultList();
	}

	/**
	 * 根据 ID 查询数据集对象
	 * @param id 数据集ID
	 * @return
	 */
	public static APIDataset getOneDataset(Long id) throws CustomException {
		List<APIDataset> datasets = ReportDBManager.get()
				.createQuery(" FROM APIDataset WHERE id=?", APIDataset.class).setParameter(1, id)
				.getResultList();
		if (datasets == null || datasets.size() == 0) {
			throw new CustomException("", "API数据集ID【" + id + "】不存在");
		}
		return datasets.get(0);
	}

	/**
	 * 查询数据集字段信息
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param id 数据集ID
	 * @param checkNone 是否判空
	 * @return
	 * @throws CustomException
	 */
	public static List<APIDatasetField> getDatasetFields(Long id, boolean checkNone) throws CustomException {
		List<APIDatasetField> fileds = ReportDBManager.get()
				.createQuery(" FROM APIDatasetField WHERE datasetId=?", APIDatasetField.class).setParameter(1, id)
				.getResultList();
		if (checkNone && (fileds == null || fileds.size() == 0)) {
			throw new CustomException("", "未查询到数据集（" + id + "）字段信息");
		}
		return fileds;
	}
	
	/**
	 * 查询数据集动态参数信息
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param id 数据集ID
	 * @param checkNone 是否判空
	 * @return
	 * @throws CustomException
	 */
	public static List<APIDatasetParam> getDatasetParams(Long id, boolean checkNone) throws CustomException {
		List<APIDatasetParam> params = ReportDBManager.get()
				.createQuery(" FROM APIDatasetParam WHERE datasetId=?", APIDatasetParam.class).setParameter(1, id)
				.getResultList();
		if (checkNone && (params == null || params.size() == 0)) {
			throw new CustomException("", "未查询到数据集（" + id + "）动态参数信息");
		}
		return params;
	}

}
