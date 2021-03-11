package com.newtec.report.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.newtec.json.utils.JsonUtil;
import com.newtec.myqdp.server.utils.StringUtils;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.dto.DsQueryParamsDTO;
import com.newtec.report.common.entity.api.APIDatasetField;
import com.newtec.report.common.entity.api.APIDataset;
import com.newtec.report.common.entity.api.APIDatasetParam;
import com.newtec.report.common.utils.ReportConstant.RequestType;
import com.newtec.report.service.api.impl.APIDatasetServiceImpl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;

/**
 * 用于组织 API 数据集中一些代码比较多的解析方法
 * 
 * @author 黄腾
 * @Description 用于组织 API 数据集中一些代码比较多的解析方法
 * @date 2020年12月24日 上午11:52:55
 */
public class ApiDatasetUtil {

	/**
	 * 根据id查询出 API 数据集对应的数据数组
	 * 
	 * @author 黄腾
	 * @param apiInfo       API 数据集
	 * @param queryParams   查询数据集时的字段过滤参数
	 * @param dynamicParams 查询数据集时的动态过滤参数，如name=${name}
	 * @return
	 */
	public static List<Map<String, Object>> getApiDatasetData(APIDataset dataset, List<DsQueryParamsDTO> queryParams,
			List<DsQueryParamsDTO> dynamicParams) throws CustomException {
		List<Map<String, Object>> datas = getApiDatasetData(dataset, dynamicParams);
		if (queryParams != null && queryParams.size() > 0) {
			return DatasetResultFilter.filterData(datas, queryParams);
		}
		return datas;
	}

	/**
	 * 根据 apiInfo 信息 查询并返回 API 数据集对应的数据数组
	 * 
	 * @author 黄腾
	 * @param apiInfo       API 数据集对象信息
	 * @param dynamicParams 查询数据集时的动态过滤参数，如name=${name}
	 * @return
	 * @throws CustomException
	 */
	public static List<Map<String, Object>> getApiDatasetData(APIDataset dataset, List<DsQueryParamsDTO> dynamicParams)
			throws CustomException {
		return queryApiDatasetData(dataset, APIDatasetServiceImpl.getDatasetParams(dataset.getId(), false),
				dynamicParams);
	}

	/**
	 * 根据 apiInfo 信息 查询并返回 API 数据集对应的数据数组
	 * 
	 * @author 黄腾
	 * @param apiInfo       API 数据集对象信息
	 * @param paramList     API 数据集动态参数列表
	 * @param dynamicParams 查询数据集时的动态过滤参数，如name=${name}
	 * @return
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	public static List<Map<String, Object>> queryApiDatasetData(APIDataset dataset, List<APIDatasetParam> paramList,
			List<DsQueryParamsDTO> dynamicParams) throws CustomException {
		String url = dataset.getUrl();
		int requestType = dataset.getRequestType();
		HttpResponse res = null;

		if (requestType == RequestType.GET) { // GET
			res = HttpRequest.get(buildRequestUrl(url, paramList, dynamicParams)).execute();
		} else { // POST
			res = HttpRequest.post(buildRequestUrl(url, paramList, dynamicParams)).execute();
		}
		checkApiDsResponse(res); // 校验API返回的结果
		return (List<Map<String, Object>>) JsonUtil.jsonString2Map(res.body()).get("data");
	}

	/**
	 * 分析API数据集返回结果中的字段信息
	 * 
	 * @Author: 朱才富
	 * @param apiInfo       API 数据集对象信息
	 * @param paramList     API 数据集动态参数列表
	 * @param dynamicParams 查询数据集时的动态过滤参数，如name=${name}
	 * @return
	 * @throws CustomException
	 */
	public static List<APIDatasetField> analysisApiDatasetField(APIDataset dataset, List<APIDatasetParam> paramList,
			List<DsQueryParamsDTO> dynamicParams) throws CustomException {
		List<Map<String, Object>> datas = queryApiDatasetData(dataset, paramList, dynamicParams);
		List<APIDatasetField> fields = new ArrayList<APIDatasetField>();
		if (datas == null || datas.size() < 1)
			throw new CustomException("-1", "数据集请求返回结果中 data 数组为空");
		Map<String, Object> data = datas.get(0); // 根据第一行数据解析字段信息
		Set<String> keys = data.keySet();

		int i = 0;
		for (String key : keys) {
			APIDatasetField filed = new APIDatasetField();
			// 设置字段名
			filed.setName(key);
			// 设置排序
			filed.setOrderNum(i++);
			// 设置字段文本
			filed.setRemark(key);
			// 设置查询 默认为0
			filed.setSearchFlag(0);
			filed.setDatasetId(dataset.getId());
			fields.add(filed);
		}
		return fields;
	}

	/**
	 * 根据 API数据集的参数拼装请求地址
	 * 
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)
	 * @param url
	 * @param paramList
	 * @param dynamicParams
	 * @throws CustomException
	 */
	public static String buildRequestUrl(String url, List<APIDatasetParam> paramList,
			List<DsQueryParamsDTO> dynamicParams) throws CustomException {
		Map<String, String> valueMap = new HashMap<String, String>();
		// 预览页面用户设置的动态参数值
		if (dynamicParams != null) {
			for (DsQueryParamsDTO param : dynamicParams) {
				Object value = param.getValue();
				valueMap.put(param.getName(), value == null ? "" : value.toString());
			}
		}

		// 动态参数列表
		if (paramList != null) {
			// 遍历参数列表拼装URL
			for (APIDatasetParam param : paramList) {
				String name = param.getName(); // 参数名
				String value = param.getDefaultValue(); // 参数默认值
				if (StrUtil.hasEmpty(value) && valueMap.containsKey(name)) {
					value = valueMap.get(name);
				}
				// ${paramName} 这种表达式替换成值
				url = url.replaceAll("\\$\\{" + name + "\\}", StrUtil.hasEmpty(value) ? "" : value);
			}
		}
		return url;
	}

	/**
	 * 校验 Response 的正确性
	 * 
	 * @author 黄腾
	 * @param res         Response返回对象
	 * @param isCheckBody 是否对 res.body 进行校验
	 * @return
	 * @throws CustomException
	 */
	public static void checkApiDsResponse(HttpResponse res) throws CustomException {
		// 判断返回的请求状态值是否为200 不为200 则返回错误信息
		if (res == null || res.getStatus() != 200) {
			throw new CustomException("", "API数据集请求失败：" + res.getStatus());
		}

		String body = res.body();

		if (StrUtil.isEmpty(body))
			throw new CustomException("", "API数据集返回内容为空！");
		JSONObject bodyObject = null;
		try {
			bodyObject = JSONUtil.parseObj(body);
		} catch (Exception e1) {
			e1.printStackTrace();
			throw new CustomException("", "API数据集返回内容JSON格式错误，解析失败！");
		}

		// 检查 body 是否包含 data 属性
		if (!bodyObject.containsKey("data"))
			throw new CustomException("", "API数据集返回内容不包含data属性！");
		if (bodyObject.containsKey("status") && StringUtils.toInt(bodyObject.get("status"), -1) != 0) {
			throw new CustomException("", "API数据集请求失败，请求返回 status 状态码：" + bodyObject.get("status"));
		}
		String data = bodyObject.getStr("data");

		if (data == null || !JSONUtil.isJsonArray(data)) {
			throw new CustomException("", "API请求返回内容格式错误，不包含 data 数组属性！");
		}
	}

	public static void main(String[] args) {
		String a = "1230";
		String b = "123";
		System.out.println("a > b: " + (a.compareTo(b) > 0));
	}

}
