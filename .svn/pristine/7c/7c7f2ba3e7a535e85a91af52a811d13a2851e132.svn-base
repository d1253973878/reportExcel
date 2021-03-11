package com.newtec.report.service.api;

import java.util.List;
import java.util.Map;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcParam;
import com.newtec.report.common.dto.APIDatasetDTO;
import com.newtec.report.common.entity.api.APIDatasetField;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;

/**
 * TReportDsApiInfo的服务类接口
 * 
 * @author 黄腾
 * @Description TReportDsApiInfo的服务类接口
 * @date 2020年12月24日 上午9:55:09
 */
public interface APIDatasetService {

	/**
	 * 保存或者更新 API 数据集信息
	 * @author 黄腾
	 * @param request
	 * @throws CustomException
	 */
	public void saveDataset(WebRequest<APIDatasetDTO> request) throws CustomException;

	/**
	 * 解析 API数据集返回结果中的字段信息
	 * 
	 * @author 黄腾
	 * @param request
	 * @throws CustomException
	 */
	public List<APIDatasetField> analysisDatasetFields(WebRequest<APIDatasetDTO> request)
			throws CustomException;

	/**
	 * 根据 API 数据集信息的 ID 查询出相关的 fields 和 params 并返回
	 * 
	 * @author 黄腾
	 * @param request
	 * @return {formData:解析表单数据, filedsData:动态配置明细table数据, paramsData:报表参数数据}
	 * @throws CustomException
	 */
	public Map<String, Object> queryDatasetInfo(WebRequest<Long> request) throws CustomException;

	/**
	 * 查询 API 数据集列表 及 每个 API 数据集的filed属性数组
	 * 
	 * @author 黄腾
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public List<Map<String, Object>> findDatasetList(WebRequest<Map<String, String>> request) throws CustomException;

	/**
	 * 根据 API 数据集 ID 删除 API 数据集
	 * @author 黄腾
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public void deleteDataset(WebRequest<Long> request) throws CustomException;

	/**
	 * 根据 API 数据集 ID 获取数据集数据
	 * 
	 * @author 黄腾
	 * @param request 包含数据集 ID
	 * @throws CustomException
	 */
	public List<Map<String, Object>> queryDatasetData(WebRequest<Long> request) throws CustomException;

	/**
	 * 根据报表 ID 查询出其下的 API 数据集的 ID 和名称
	 * 
	 * @author 黄腾
	 * @param request 包含报表id
	 * @return 返回 API 数据集的 ID 和名称数组
	 * @throws CustomException
	 */
	public List<Map<String, String>> getDatasetIdAndName(WebRequest<Long> request)
			throws CustomException;

}
