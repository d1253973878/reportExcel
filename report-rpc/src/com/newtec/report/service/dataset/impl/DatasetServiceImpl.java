package com.newtec.report.service.dataset.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.service.api.APIDatasetService;
import com.newtec.report.service.api.impl.APIDatasetServiceImpl;
import com.newtec.report.service.dataset.DatasetService;
import com.newtec.report.service.sql.SQLDatasetService;
import com.newtec.report.service.sql.impl.SQLDatasetServiceImpl;

@RpcClass("datasetService")
public class DatasetServiceImpl implements DatasetService{
	
	protected final APIDatasetService apiInfoService = new APIDatasetServiceImpl();
	
	protected final SQLDatasetService sqlInfoService = new SQLDatasetServiceImpl();
	
	/**
          * 查询出相关数据集列表
     * @param request
     * @return
     * @throws CustomException
     */
	@Override
	public List<Map<String, Object>> findDatasetList(WebRequest<Map<String, String>> request) throws CustomException {
		List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
		// api数据集
		result.addAll(apiInfoService.findDatasetList(request));
		// sql数据集
		result.addAll(sqlInfoService.findDatasetList(request));
		return result;
	}
	
	/**
	 * 判断数据集的 Code 是否已存在
	 * @Author: 朱才富
	 * @param code 数据集Code
	 * @return
	 * @throws CustomException
	 */
	@SuppressWarnings("unchecked")
	public static boolean isDatasetCodeExist(String code) throws CustomException {
		String uniSql = " SELECT code FROM t_sql_dataset where code='"
				+ code + "' " + " UNION "
				+ " SELECT code FROM t_api_dataset WHERE code='"
				+ code + "' ";
		List<String> result = ReportDBManager.get().createNativeQuery(uniSql).getResultList();
		if(result.size() > 0) {
			return true;
		}
		return false;
	}
	
}
