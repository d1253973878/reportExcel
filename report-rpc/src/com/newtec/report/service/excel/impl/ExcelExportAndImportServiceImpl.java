package com.newtec.report.service.excel.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.common.dto.ReportDataset;
import com.newtec.report.common.entity.api.APIDataset;
import com.newtec.report.common.entity.report.Report;
import com.newtec.report.common.entity.report.ReportConfig;
import com.newtec.report.common.entity.sql.SQLDataset;
import com.newtec.report.service.excel.ExcelExportAndImportService;
import com.newtec.report.utils.ExportExcelUtil;
import com.newtec.report.utils.ImportExcelUtil;

public class ExcelExportAndImportServiceImpl implements ExcelExportAndImportService {

	@Override
	public Map<String, Object> exportAllExcel(Long excelConfigId, Map<String, String[]> mapReq,
			List<Map<String, Object>> echartBase64) throws CustomException {
		Report report = ReportDBManager.get().createQuery(" from Report where id=? ", Report.class)
				.setParameter(1, excelConfigId).getSingleResult();
		ReportConfig reportConfig = ReportDBManager.get()
				.createQuery(" from ReportConfig where id=? ", ReportConfig.class).setParameter(1, excelConfigId)
				.getSingleResult();
		JSONObject reConfig = JSON.parseObject(reportConfig.getConfig());
		// 根据id 查询出 api数据集info表的信息
		List<APIDataset> tReportDsApiInfoList = ReportDBManager.get()
				.createQuery(" FROM TReportDsApiInfo WHERE report_id=?", APIDataset.class)
				.setParameter(1, excelConfigId).getResultList();
		// 根据id查询reportDb信息
		List<SQLDataset> reportDbs = ReportDBManager.get()
				.createQuery("from ReportDb where report_id = ?", SQLDataset.class).setParameter(1, excelConfigId)
				.getResultList();
		ReportDataset reportDataset = new ReportDataset();
		reportDataset.setApiDatasets(tReportDsApiInfoList);
		reportDataset.setSqlDatasets(reportDbs);
		XSSFWorkbook workbook = ExportExcelUtil.exportExcel(reConfig, reportDataset, null, null, mapReq, report,
				echartBase64);
		// excel 名称
		String excelName = report.getName() + (new SimpleDateFormat("yyyyMMddHHmmss")).format(new Date());
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("name", excelName + ".xlsx");
		result.put("workbook", workbook);
		return result;
	}

	@Override
	public Map<String, Object> importExcel(File file) throws IOException {
		FileInputStream inputStream = new FileInputStream(file);
		Map<String, Object> importExcel = ImportExcelUtil.importExcel(inputStream);
		return importExcel;
	}

}
