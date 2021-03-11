package com.newtec.report.service.chart.impl;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcClass;
import com.newtec.reflect.annotation.RpcParam;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.service.chart.ChartConfigService;

@RpcClass("chartConfigService")
public class ChartConfigServiceImpl implements ChartConfigService {

	@Override
	public String getEchartDefaultConfig(@RpcParam(loginPersonParam = true) WebRequest<String> req) throws CustomException {
		String type = req.getData();
		String config = (String) ReportDBManager.get()
				.createNativeQuery("SELECT config FROM t_default_chart_config WHERE id='" + type + "'").getSingleResult();
		return config;
	}
}