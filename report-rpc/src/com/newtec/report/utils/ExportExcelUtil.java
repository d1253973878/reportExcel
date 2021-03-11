package com.newtec.report.utils;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.RegionUtil;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFClientAnchor;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFDrawing;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.report.common.common.ReportDBManager;
import com.newtec.report.common.dto.ReportDataset;
import com.newtec.report.common.entity.api.APIDataset;
import com.newtec.report.common.entity.api.APIDatasetParam;
import com.newtec.report.common.entity.report.Report;
import com.newtec.report.common.entity.sql.SQLDataset;
import com.newtec.report.common.entity.sql.SQLDatasetParam;
import cn.hutool.core.codec.Base64Decoder;
import cn.hutool.http.HttpUtil;
import cn.hutool.http.Method;

/**
 * ecxel导出工具类
 * 
 * @author Administrator
 *
 */
public class ExportExcelUtil {
	/**
	 * 根据报表内容信息导出excel工具
	 * 
	 * @param reportConfig  报表json格式字符串
	 * @param reportDataset sql与api数据集对象集合
	 * @param page          分页
	 * @param pageSize      显示条数
	 * @param params        执行sql或者api参数
	 * @param report        报表
	 * @param echartBase64  base64编码
	 * @return
	 * @throws CustomException
	 */
	public static XSSFWorkbook exportExcel(JSONObject reportConfig, ReportDataset reportDataset, String page,
			String pageSize, Map<String, String[]> params, Report report, List<Map<String, Object>> echartBase64)
			throws CustomException {
		// 获取行信息
		JSONObject rows = reportConfig.getJSONObject("rows");
		// 获取列信息
		JSONObject cols = reportConfig.getJSONObject("cols");

		// 图片
		JSONArray imgList = null;
		// 图表
		JSONArray chartList = null;
		// 如果json格式字符串中存在imgList
		if (reportConfig.containsKey("imgList")) {
			imgList = reportConfig.getJSONArray("imgList");
		}
		// 如果json格式字符串中存在chartList
		if (reportConfig.containsKey("chartList")) {
			chartList = reportConfig.getJSONArray("chartList");
		}
		// 数据信息
		List<Map<String, Object>> dynamicDatas;
		// 图表
		if (chartList != null && chartList.size() > 0 && echartBase64.size() > 0) {
			for (int i = 0; i < chartList.size(); ++i) {
				// 获取一条图标信息
				JSONObject chart = chartList.getJSONObject(i);
				// 获取图表id
				String layerId = (String) chart.get("layer_id");
				// 将base64位码赋值给dynamicDatas
				dynamicDatas = echartBase64;
				String base64 = "";

				for (int j = 0; j < dynamicDatas.size(); ++j) {
					// 获取到一条数据
					Map<String, Object> echartBaseMap = dynamicDatas.get(j);
					// 进行id比对校验
					if (echartBaseMap.get("id").equals(layerId)) {
						// 获取到一条base64信息
						base64 = (String) echartBaseMap.get("base64");
					}
				}
				// 获取到以“base64,”分割以后的url
				String[] url = base64.split("base64,");

				// 将base64位编码存入chart中
				chart.put("url", url[1]);
			}
		}

		// 图片
		if (imgList != null && imgList.size() > 0 && echartBase64.size() > 0) {
			for (int i = 0; i < imgList.size(); ++i) {
				// 获取一条图片信息
				JSONObject img = imgList.getJSONObject(i);
				// 获取图片id
				String layerId = (String) img.get("layer_id");
				System.out.println(layerId);
				// 将base64位码赋值给dynamicDatas
				dynamicDatas = echartBase64;
				System.out.println(dynamicDatas);
				String base64 = "";

				for (int j = 0; j < dynamicDatas.size(); ++j) {
					// 获取到一条数据
					Map<String, Object> imgBaseMap = dynamicDatas.get(j);
					System.out.println(dynamicDatas.get(j));
					System.out.println("id:" + imgBaseMap.get("id"));
					// 进行id比对校验
					if (imgBaseMap.get("id").equals(layerId)) {
						// 获取到一条base64信息
						base64 = (String) imgBaseMap.get("base64");
					}
				}
				// 获取到以“base64,”分割以后的url
				String[] src = base64.split("base64,");
				// 将base64位编码存入image中
				img.put("src", src[1]);
			}
		}

		if (rows.containsKey("len")) {
			rows.remove("len");
			cols.remove("len");
		}

		if (rows.containsKey("-1")) {
			rows.remove("-1");
		}
		// 获取样式值
		Object styles = reportConfig.get("styles");
		//
		Map<String, Object> styleMap = new HashMap<String, Object>();
		// 如果值是一个object对象
		if (styles instanceof JSONObject) {
			// 根据styles获取对应的jsonObject对象
			JSONObject jsonStyle = reportConfig.getJSONObject("styles");
			// 获取内层数据结构
			styleMap = jsonStyle.getInnerMap();
			// 如果值是一个jsonObject数组
		} else if (styles instanceof JSONArray) {
			// 根据styles获取对应的jsonObject数组
			JSONArray arrayStyle = reportConfig.getJSONArray("styles");

			for (int i = 0; i < arrayStyle.size(); ++i) {
				// 获取数组数据
				styleMap.put(String.valueOf(i), arrayStyle.get(i));
			}
		}
		// workbook
		XSSFWorkbook workbook = new XSSFWorkbook();
		List<Map<String, Object>> dataSetList = new ArrayList<Map<String, Object>>();
		// sql数据集信息
		Iterator<SQLDataset> reportDbIterator = reportDataset.getSqlDatasets().iterator();
		// 参数值
		String paramValue;
		// 参数
		String paramName;
		// 执行语句
		String sqlOrApi;
		while (reportDbIterator.hasNext()) {
			// 得到一条sql数据集信息
			SQLDataset reportDb = reportDbIterator.next();
			// 处理 SQL 数据集
			dynamicDatas = SqlDatasetUtil.findSqlData(reportDb, null);
			if (dynamicDatas.size() == 1) {
				rows = ExportExcelUtil.exportExcel(rows, reportDb, dynamicDatas);
			} else {
				dataSetList.addAll(dynamicDatas);
			}
		}

		// api数据集信息
		Iterator<APIDataset> tReportDsApiInfoIterator = reportDataset.getApiDatasets().iterator();
		while (tReportDsApiInfoIterator.hasNext()) {
			// 得到一条api数据集信息
			APIDataset tReportDsApiInfo = tReportDsApiInfoIterator.next();
			// 处理 API 数据集
			if (StringUtils.isNotEmpty(tReportDsApiInfo.getUrl())) {
				sqlOrApi = tReportDsApiInfo.getUrl();
				JSONObject param = new JSONObject();
				Iterator paramIterator;
				if (sqlOrApi.contains("?")) {
					// 查询对应的params数据
					List<APIDatasetParam> apiParamList = ReportDBManager.get()
							.createQuery(" FROM TReportDsApiParam WHERE api_info_id=?", APIDatasetParam.class)
							.setParameter(1, tReportDsApiInfo.getId()).getResultList();
					if (apiParamList != null && apiParamList.size() != 0) {
						paramIterator = apiParamList.iterator();

						while (paramIterator.hasNext()) {
							APIDatasetParam reportParam = (APIDatasetParam) paramIterator.next();
							param.put(reportParam.getName(), reportParam.getDefaultValue());
						}
					}
				}

				JSONObject dbParam = new JSONObject();
				dbParam.putAll(param);

				for (paramIterator = dbParam.keySet().iterator(); paramIterator.hasNext(); sqlOrApi = sqlOrApi
						.replace(paramName + "='${" + paramName + "}'", paramName + "=" + paramValue)) {
					paramName = (String) paramIterator.next();
					paramValue = dbParam.getString(paramName);
					if (StringUtils.isEmpty(paramValue)) {
						paramValue = "";
					}
				}

				if (sqlOrApi.contains("?")) {
					sqlOrApi = sqlOrApi + "&printAll=true";
				} else {
					sqlOrApi = sqlOrApi + "?printAll=true";
				}

				tReportDsApiInfo.setUrl(sqlOrApi);
				Map<String, Object> map = ExportExcelUtil.exportExcel(tReportDsApiInfo);
				List<Map<String, Object>> dataList = (List) map.get("dataList");
				if (dataList.size() == 1) {
					rows = ExportExcelUtil.exportExcel(rows, tReportDsApiInfo, dataList);
				} else {
					dataSetList.addAll(dataList);
				}
			}

		}
		if (dataSetList.size() == 0) {
			ExportExcelUtil.exportExcel(workbook, rows, report, styleMap, cols, imgList, chartList);
		} else {
			Map<String, Object> dynamicDatasByPage = new HashMap<String, Object>();
			Iterator<SQLDataset> reportDbIteratorDatas = reportDataset.getSqlDatasets().iterator();
			while (reportDbIteratorDatas.hasNext()) {
				SQLDataset reportDb = reportDbIteratorDatas.next();
				paramValue = "";
				List<Map<String, Object>> list = SqlDatasetUtil.findSqlData(reportDb, null);
				paramValue = reportDb.getCode();
				if (list.size() != 1) {
					dynamicDatasByPage.put(paramValue, list);
				}
			}
			// API 数据集信息
			Iterator<APIDataset> tReportDsApiInfoIteratorDatas = reportDataset.getApiDatasets().iterator();
			while (tReportDsApiInfoIteratorDatas.hasNext()) {
				// 得到一条 API 数据集信息
				APIDataset tReportDsApiInfo = tReportDsApiInfoIteratorDatas.next();
				if (StringUtils.isNotEmpty(tReportDsApiInfo.getUrl())) {
					Map<String, Object> apiData = ExportExcelUtil.exportExcel(tReportDsApiInfo);
					List<Map<String, Object>> dataList = (List) apiData.get("dataList");
					paramValue = tReportDsApiInfo.getCode();
					if (dataList.size() != 1) {
						dynamicDatasByPage.put(paramValue, dataList);
					}
				}
			}
			ExportExcelUtil.exportExcel(reportConfig, dynamicDatasByPage, workbook, reportDataset, rows, styleMap, cols,
					imgList, chartList);
		}

		return workbook;
	}

	/**
	 * 获取报表cells数据
	 * 
	 * @param rows 行信息
	 * @return
	 */
	private static JSONObject exportExcel(JSONObject rows) {
		List<Integer> list = new ArrayList<Integer>();
		Iterator rowIterator = rows.keySet().iterator();
		// 拿到所有相关的行
		while (rowIterator.hasNext()) {
			String row = (String) rowIterator.next();
			list.add(Integer.parseInt(row));
		}

		Collections.sort(list);
		JSONArray jArray = new JSONArray();
		JSONObject jObjectCells = new JSONObject(true);
		Iterator row = list.iterator();
		// 通过遍历所有行，拿到行中的cells信息
		while (row.hasNext()) {
			// 行序列
			Integer rowNum = (Integer) row.next();
			JSONObject cells = rows.getJSONObject(String.valueOf(rowNum));
			jArray.add(cells);
			jObjectCells.put(String.valueOf(rowNum), cells);
		}

		return jObjectCells;
	}

	/**
	 * 获取行中数据
	 * 
	 * @param rows   行信息
	 * @param rowMap 行序列号集合
	 * @return
	 */
	private static JSONObject exportExcel(JSONObject rows, Map<String, String> rowMap) {
		JSONObject jObject = new JSONObject(true);
		System.out.println(rowMap);
		for (String key : rowMap.keySet()) {
			System.out.println("key= " + key + " and value= " + rowMap.get(key));
			jObject.put(rowMap.get(key), rows.get(key));
		}
		for (String key : rowMap.keySet()) {

			rows.remove(key);
		}
		Iterator cellIterator = jObject.keySet().iterator();

		while (cellIterator.hasNext()) {
			String rowNum = (String) cellIterator.next();
			rows.put(rowNum, jObject.get(rowNum));
		}

		return rows;
	}

	/**
	 * 获取工作表中所用的行信息
	 * 
	 * @param workbook
	 * @param rows      行信息
	 * @param report    报表信息
	 * @param styleMap  样式信息
	 * @param cols      列信息
	 * @param imgList   图片信息
	 * @param chartList 图表信息
	 * @return
	 */
	private static XSSFWorkbook exportExcel(XSSFWorkbook workbook, JSONObject rows, Report report,
			Map<String, Object> styleMap, JSONObject cols, JSONArray imgList, JSONArray chartList) {
		// 获取工作表name
		XSSFSheet sheet = workbook.createSheet(report.getName());
		// 获取工作表列信息
		ExportExcelUtil.exportExcel(sheet, cols);
		Iterator rowsIterator = rows.keySet().iterator();

		while (true) {
			// 行
			String row;
			// 行内容
			JSONObject cells;
			Iterator cellsIterator;
			do {
				do {
					if (!rowsIterator.hasNext()) {
						ExportExcelUtil.exportExcel(rows, sheet, workbook, styleMap);
						if (imgList != null) {
							ExportExcelUtil.exportExcelImg(sheet, workbook, imgList);
						}

						if (chartList != null) {
							ExportExcelUtil.exportExcelChart(sheet, workbook, chartList);
						}

						return workbook;
					}

					row = (String) rowsIterator.next();
				} while ("len".equals(row));

				cells = rows.getJSONObject(row).getJSONObject("cells");
				cellsIterator = cells.keySet().iterator();
			} while (Integer.parseInt(row) < 0);

			Row sheetRow = sheet.createRow(Integer.parseInt(row));
			if (rows.getJSONObject(row).containsKey("height")) {
				Integer height = rows.getJSONObject(row).getInteger("height");
				sheetRow.setHeightInPoints((float) height);
			}

			while (cellsIterator.hasNext()) {
				String cell = (String) cellsIterator.next();
				JSONObject cellJson = cells.getJSONObject(cell);
				Cell sheetCell = sheetRow.createCell(Integer.parseInt(cell));
				if (!cellJson.containsKey("text")) {
					ExportExcelUtil.exportExcel(cellJson, styleMap, workbook, sheetCell);
				} else {
					String text = cellJson.getString("text");
					sheetCell.setCellValue(text);
					ExportExcelUtil.exportExcel(cellJson, styleMap, workbook, sheetCell);
				}
			}
		}
	}

	/**
	 * 根据报表字段信息生成数据导出excel
	 * 
	 * @param reportConfig       报表json格式字符串
	 * @param dynamicDatasByPage sql与api数据集对象集合
	 * @param workbook           工作簿
	 * @param reportDataset      sql与api数据集集合
	 * @param rows               行信息
	 * @param styleMap           样式
	 * @param cols               列信息
	 * @param imgList            图片信息
	 * @param chartList          图表信息
	 * @return
	 */
	private static XSSFWorkbook exportExcel(JSONObject reportConfig, Map<String, Object> dynamicDatasByPage,
			XSSFWorkbook workbook, ReportDataset reportDataset, JSONObject rows, Map<String, Object> styleMap,
			JSONObject cols, JSONArray imgList, JSONArray chartList) {

		int v = 0;
		JSONObject rowData = new JSONObject(true);
		List<String> list = new ArrayList<String>();
		// 获取行信息
		rows = ExportExcelUtil.exportExcel(rows);
		Iterator rowIterator = rows.keySet().iterator();
		// 编码名称
		String codeName;
		// 行序列
		String rowNum;
		Map<String, String> rowMap = new HashMap<String, String>();
		if (dynamicDatasByPage.size() != 1) {
			if (dynamicDatasByPage.size() > 1) {
				int i = 0;

				JSONObject cells;
				while (rowIterator.hasNext()) {
					// 行序列
					String rowString = (String) rowIterator.next();
					cells = rows.getJSONObject(rowString).getJSONObject("cells");
					if (i != 0) {
						rowNum = String.valueOf(Integer.parseInt(rowString) + i);
						rowMap.put(rowString, rowNum);
					}

					if (cells.toJSONString().contains("\"text\":\"${")) {
						codeName = exportExcel(cells.toJSONString(), "${", ".");
						// 通过编码获取sql与api数据
						List<Map<String, Object>> dataSetList = (List) dynamicDatasByPage.get(codeName);
						if (dataSetList != null) {
							i = i + dataSetList.size() - 1;
						}
					}
				}
				// 获取到行信息
				rows = ExportExcelUtil.exportExcel(rows, rowMap);
				// 获取行信息
				rows = ExportExcelUtil.exportExcel(rows);
				int j;
				String srow;
				if (chartList != null) {
					for (j = 0; j < chartList.size(); ++j) {
						cells = chartList.getJSONObject(j);
						codeName = cells.getString("row");
						srow = (String) rowMap.get(codeName);
						if (StringUtils.isNotBlank(srow) && !srow.equals(codeName)) {
							cells.put("row", srow);
						}
					}
				}

				if (imgList != null) {
					for (j = 0; j < imgList.size(); ++j) {
						cells = imgList.getJSONObject(j);
						codeName = cells.getString("row");
						srow = (String) rowMap.get(codeName);
						if (StringUtils.isNotBlank(srow) && !srow.equals(codeName)) {
							cells.put("row", srow);
						}
					}
				}
			}
		} else {
			while (true) {
				if (!rowIterator.hasNext()) {
					if (v != 0) {
						Iterator sIterator = list.iterator();

						while (sIterator.hasNext()) {
							String len = (String) sIterator.next();
							rows.remove(len);
						}
					}
					break;
				}

				String rowl = (String) rowIterator.next();
				JSONObject cells = rows.getJSONObject(rowl).getJSONObject("cells");
				if (cells.toJSONString().contains("\"text\":\"${")) {
					v = Integer.parseInt(rowl) + 1;
				}

				if (Integer.parseInt(rowl) >= v && v != 0 && !rows.getJSONObject(rowl).isEmpty()) {
					rowData.put(rowl, rows.getJSONObject(rowl));
					list.add(rowl);
				}
			}
		}
		// 创建工作表名称
		XSSFSheet sheet = workbook.createSheet(reportConfig.getString("name"));
		ExportExcelUtil.exportExcel(sheet, cols);
		// api与sql各个字段信息
		Map<String, Object> rowTextMap = new HashMap<String, Object>();
		Integer height = 0;
		Iterator roIterator = rows.keySet().iterator();

		label116: while (true) {
			Iterator iterator;
			int rowin;
			JSONObject cells;
			do {
				if (!roIterator.hasNext()) {
					ExportExcelUtil.exportExcel(rows, sheet, workbook, styleMap);
					ExportExcelUtil.exportExcel(rowTextMap, dynamicDatasByPage, sheet, workbook, rowData, styleMap,
							height);
					if (imgList != null) {
						ExportExcelUtil.exportExcelImg(sheet, workbook, imgList);
					}

					if (chartList != null) {
						ExportExcelUtil.exportExcelChart(sheet, workbook, chartList);
					}

					return workbook;
				}

				rowNum = (String) roIterator.next();
				cells = rows.getJSONObject(rowNum).getJSONObject("cells");
				cells = ExportExcelUtil.exportExcel(cells);
				iterator = cells.keySet().iterator();
				rowin = Integer.parseInt(rowNum);
			} while (rowin < 0);

			Row ro = sheet.createRow(Integer.parseInt(rowNum));
			if (rows.getJSONObject(rowNum).containsKey("height")) {
				Integer heights = rows.getJSONObject(rowNum).getInteger("height");
				ro.setHeightInPoints((float) heights);
			}

			if (cells.toJSONString().contains("\"text\":\"${") && rows.getJSONObject(rowNum).containsKey("height")) {
				height = rows.getJSONObject(rowNum).getInteger("height");
			}

			HashMap<String, Object> cellText = new HashMap<String, Object>();
			String fields = "";
			String rowNums = "";
			String cellNums = "";
			String cellTextStyle = "";
			String mer = "";

			while (true) {
				while (true) {
					if (!iterator.hasNext()) {
						continue label116;
					}

					String cellsString = (String) iterator.next();
					JSONObject cellStyle = cells.getJSONObject(cellsString);
					Cell cell = ro.createCell(Integer.parseInt(cellsString));
					if (!cellStyle.containsKey("text")) {
						ExportExcelUtil.exportExcel(cellStyle, styleMap, workbook, cell);
					} else {
						String text = cellStyle.getString("text");
						String style = cellStyle.getString("style");
						if (!text.contains("$") && !"".equals(text)) {
							cell.setCellValue(text);
							ExportExcelUtil.exportExcel(cellStyle, styleMap, workbook, cell);
						} else if (text.contains("$")) {
							String[] beak = exportExcel(text, "{", "}").split("\\.");
							String leftBeak = beak[0];
							String rightBeak = beak[1];
							int rowi = Integer.parseInt(rowNum);
							int celli = Integer.parseInt(cellsString);
							fields = fields + "," + rightBeak;
							rowNums = rowNums + "," + rowi;
							cellNums = cellNums + "," + celli;
							cellTextStyle = cellTextStyle + "," + style;
							cellText.put("fields", fields.substring(1, fields.length()).split(","));
							cellText.put("rowNums", rowNums.substring(1, rowNums.length()).split(","));
							cellText.put("cellNums", cellNums.substring(1, cellNums.length()).split(","));
							cellText.put("cellTextStyle",
									cellTextStyle.substring(1, cellTextStyle.length()).split(","));
							if (cellStyle.containsKey("merge")) {
								mer = mer + "*" + rightBeak + "," + cellStyle.getString("merge");
								cellText.put("merges", mer.substring(1, mer.length()).split("\\*"));
							}

							rowTextMap.put(leftBeak, cellText);
						}
					}
				}
			}
		}
	}

	/**
	 * @param rowMap             行信息map集合
	 * @param dynamicDatasByPage api与sql数据
	 * @param sheet              工作表
	 * @param workbook           工作表
	 * @param cells              cells信息
	 * @param styleMap           样式信息
	 * @param height             高度
	 */
	private static void exportExcel(Map<String, Object> rowMap, Map<String, Object> dynamicDatasByPage, Sheet sheet,
			XSSFWorkbook workbook, JSONObject cells, Map<String, Object> styleMap, Integer height) {
		Iterator rowText = rowMap.keySet().iterator();

		while (rowText.hasNext()) {
			String tableCode = (String) rowText.next();
			Map<String, Object> cellText = (Map) rowMap.get(tableCode);
			String[] rowNums = (String[]) cellText.get("rowNums");
			// 获取库中数据
			List<Map<String, Object>> dataObject = new ArrayList<Map<String, Object>>();
			if (dynamicDatasByPage.get(tableCode) != null) {
				dataObject = (List) dynamicDatasByPage.get(tableCode);
			}

			String[] cellNums = (String[]) cellText.get("cellNums");
			String[] cellTextStyle = (String[]) cellText.get("cellTextStyle");
			String[] fields = (String[]) cellText.get("fields");
			String[] merges = (String[]) cellText.get("merges");
			Map<String, String> mergeMap = new HashMap<String, String>();
			if (merges != null) {
				for (int i = 0; i < merges.length; ++i) {
					String merge = merges[i];
					String leftBeak = merge.substring(0, merge.indexOf(",["));
					mergeMap.put(leftBeak, merge.substring(leftBeak.length() + 1, merge.length()));
				}
			}

			boolean b = false;

			for (int j = 0; j < fields.length; ++j) {
				if (fields[j].indexOf("group") != -1 || fields[j].indexOf("groupRight") != -1) {
					b = true;
				}
			}

			List<Object> mapGropFe = new ArrayList<Object>();
			if (b) {
				Map<String, Object> m = ExportExcelUtil.exportExcel(fields, dataObject);
				dataObject = (List) m.get("listData");
				mapGropFe = (List) m.get("mapGropFe");
			}

			int a;
			int c;
			for (c = 0; c < (dataObject).size(); ++c) {
				Row row = sheet.getRow(Integer.parseInt(rowNums[0]) + c);
				boolean rowb = exportExcel(row);
				if (rowb) {
					row = sheet.createRow(Integer.parseInt(rowNums[0]) + c);
				}

				if (height != 0) {
					row.setHeightInPoints((float) height);
				}

				for (a = 0; a < cellNums.length; ++a) {
					Cell cell = row.createCell(Integer.parseInt(cellNums[a]));
					Map<String, Object> dynamicData = (dataObject).get(c);
					Map<String, Object> dcData = exportExcel(dynamicData);
					// 字段value
					String filedValue = "";
					// 字段名
					String filedName = "";
					if (fields[a].indexOf("group") != -1) {
						filedName = exportExcel(fields[a], "group(", ")");
					} else {
						filedName = fields[a];
					}

					if (dcData.get(filedName.toLowerCase()) != null) {
						filedValue = dcData.get(filedName.toLowerCase()).toString();
					} else {
						filedValue = "";
					}

					cell.setCellValue(filedValue);
					String style = "{style: " + cellTextStyle[a] + "}";
					JSONObject styleObject = JSONObject.parseObject(style);
					ExportExcelUtil.exportExcel(styleObject, styleMap, workbook, cell);
					String mergeData = (String) mergeMap.get(filedName);
					if (StringUtils.isNotEmpty(mergeData)) {
						String[] mergeStrings = exportExcel(mergeData, "[", "]").split(",");
						int codeNum = Integer.parseInt(mergeStrings[0]);
						int dataNum = Integer.parseInt(mergeStrings[1]);
						int filstRow = Integer.parseInt(rowNums[0]) + c;
						int lastRow = codeNum + filstRow;
						int filstCol = Integer.parseInt(cellNums[a]);
						int lastCol = dataNum + filstCol;
						if (c != 0) {
							CellRangeAddress cellAddress = new CellRangeAddress(filstRow, lastRow, filstCol, lastCol);
							sheet.addMergedRegion(cellAddress);
							if (styleObject.containsKey("style")) {
								String cellStyle = styleObject.getString("style");
								JSONObject styleObj = (JSONObject) styleMap.get(cellStyle);
								if (styleObj.containsKey("border")) {
									RegionUtil.setBorderBottom(1, cellAddress, sheet, workbook);
									RegionUtil.setBorderLeft(1, cellAddress, sheet, workbook);
									RegionUtil.setBorderRight(1, cellAddress, sheet, workbook);
									RegionUtil.setBorderTop(1, cellAddress, sheet, workbook);
								}
							}
						}
					}
				}
			}

			if (b) {
				String[] fileds = (String[]) cellText.get("fields");
				int cellNum = Integer.parseInt(cellNums[0]);
				a = 0;

				for (int i = 0; i < fileds.length; ++i) {
					int rowNum = Integer.parseInt(rowNums[0]);
					if (fileds[i].indexOf("group") != -1) {
						int dataSize = 0;
						int lastRowNum = 0;

						for (int j = a; j < (mapGropFe).size(); ++j) {
							dataSize += (Integer) (mapGropFe).get(j);
							if (lastRowNum == 0) {
								lastRowNum = rowNum + (Integer) (mapGropFe).get(j) - 1;
								if ((Integer) (mapGropFe).get(j) != 1) {
									ExportExcelUtil.exportExcel(sheet, rowNum, lastRowNum, cellNum);
								}
							} else {
								rowNum = lastRowNum + 1;
								lastRowNum += (Integer) (mapGropFe).get(j);
								if ((Integer) (mapGropFe).get(j) != 1) {
									ExportExcelUtil.exportExcel(sheet, rowNum, lastRowNum, cellNum);
								}
							}

							if (dataSize == (dataObject).size()) {
								a = j;
								break;
							}
						}

						++a;
					}

					++cellNum;
				}
			}

			if (dynamicDatasByPage.size() == 1) {
				int firstRow = Integer.parseInt(rowNums[0]) + c;
				ExportExcelUtil.exportExcel(sheet, cells, workbook, firstRow, styleMap);
			}
		}

	}

	/**
	 * 计算工作表的行列
	 * 
	 * @param sheet    工作表
	 * @param firstRow 起始行
	 * @param lastRow  结尾行
	 * @param col      起始列与结尾列
	 */
	private static void exportExcel(Sheet sheet, int firstRow, int lastRow, int col) {
		CellRangeAddress cellAddress = new CellRangeAddress(firstRow, lastRow, col, col);
		sheet.addMergedRegion(cellAddress);
	}

	/**
	 * 如果dynamicDatasByPage长度为1时执行此方法
	 * 
	 * @param sheet    工作表
	 * @param cells    cell信息
	 * @param workbook 工作表
	 * @param rowNum   行数
	 * @param styleMap 样式信息
	 */
	private static void exportExcel(Sheet sheet, JSONObject cells, XSSFWorkbook workbook, int rowNum,
			Map<String, Object> styleMap) {
		Iterator cellIterator = cells.keySet().iterator();

		for (int i = 0; cellIterator.hasNext(); ++i) {
			String codeName = (String) cellIterator.next();
			JSONObject cellObject = cells.getJSONObject(codeName).getJSONObject("cells");
			Row row = sheet.createRow(rowNum + i);
			if (cells.getJSONObject(codeName).containsKey("height")) {
				Integer height = cells.getJSONObject(codeName).getInteger("height");
				row.setHeightInPoints((float) height);
			}

			Cell cell;
			JSONObject cellJson;
			for (Iterator cellValue = cellObject.keySet().iterator(); cellValue.hasNext(); ExportExcelUtil
					.exportExcel(cellJson, styleMap, workbook, cell)) {
				String cellNum = (String) cellValue.next();
				cell = row.createCell(Integer.parseInt(cellNum));
				cellJson = cellObject.getJSONObject(cellNum);
				String cellData;
				if (!cellJson.containsKey("text")) {
					ExportExcelUtil.exportExcel(cellJson, styleMap, workbook, cell);
				} else {
					cellData = cellJson.getString("text");
					cell.setCellValue(cellData);
				}

				if (cellJson.containsKey("merge")) {
					cellData = cellJson.getString("merge");
					String[] cellStrings = exportExcel(cellData, "[", "]").split(",");
					int codeNum = Integer.parseInt(cellStrings[0]);
					int dataNum = Integer.parseInt(cellStrings[1]);
					if (cellData != null && !"".equals(cellData)) {
						int firstRow = rowNum + i;
						int lastRow = codeNum + firstRow;
						int firstCol = Integer.parseInt(cellNum);
						int lastCol = dataNum + firstCol;
						CellRangeAddress cellAddress = new CellRangeAddress(firstRow, lastRow, firstCol, lastCol);
						sheet.addMergedRegion(cellAddress);
						if (cellJson.containsKey("style")) {
							String style = cellJson.getString("style");
							JSONObject styleBorder = (JSONObject) styleMap.get(style);
							if (styleBorder.containsKey("border")) {
								RegionUtil.setBorderBottom(1, cellAddress, sheet, workbook);
								RegionUtil.setBorderLeft(1, cellAddress, sheet, workbook);
								RegionUtil.setBorderRight(1, cellAddress, sheet, workbook);
								RegionUtil.setBorderTop(1, cellAddress, sheet, workbook);
							}
						}
					}
				}
			}
		}

	}

	/**
	 * 判断是否存在行
	 * 
	 * @param row 行
	 * @return
	 */
	public static boolean exportExcel(Row row) {
		if (row == null) {
			return true;
		} else {
			for (int i = row.getFirstCellNum(); i < row.getLastCellNum(); ++i) {
				Cell cell = row.getCell(i);
				if (cell != null && cell.getCellType() != 3) {
					return false;
				}
			}

			return true;
		}
	}

	/**
	 * 返回字段数据的map集合
	 * 
	 * @param dataList 字段数据
	 * @param filed    字段
	 * @return
	 */
	private static Map<String, List<Map<String, Object>>> exportExcel(List<Map<String, Object>> dataList,
			String filed) {
		Map<String, List<Map<String, Object>>> filedMap = new HashMap<String, List<Map<String, Object>>>();

		for (int i = 0; i < dataList.size(); ++i) {
			List<Map<String, Object>> filedList = filedMap.get((dataList.get(i)).get(filed));
			if (filedList == null) {
				List<Map<String, Object>> filedValue = new ArrayList<Map<String, Object>>();
				filedValue.add(dataList.get(i));
				filedMap.put((String) (dataList.get(i)).get(filed), filedValue);
			} else {
				filedList.add(dataList.get(i));
			}
		}

		return filedMap;
	}

	/**
	 * 返回字段内容数量
	 * 
	 * @param filedMap  字段信息map集合
	 * @param mapGropFe 字段内容数量
	 * @return
	 */
	private static List<Integer> exportExcel(Map<String, List<Map<String, Object>>> filedMap, List<Integer> mapGropFe) {
		Iterator filedIterator = filedMap.keySet().iterator();

		while (filedIterator.hasNext()) {
			String filed = (String) filedIterator.next();
			int filedNum = (filedMap.get(filed)).size();
			mapGropFe.add(filedNum);
		}

		return mapGropFe;
	}

	/**
	 * 获取字段数据信息
	 * 
	 * @param fileds   字段信息
	 * @param dataList 字段数据内容
	 * @return
	 */
	private static Map<String, Object> exportExcel(String[] fileds, List<Map<String, Object>> dataList) {
		List<String> filedList = new ArrayList<String>();

		for (int i = 0; i < fileds.length; ++i) {
			if (fileds[i].indexOf("group") != -1) {
				String filedData = exportExcel(fileds[i], "group(", ")");
				filedList.add(filedData);
			}
		}

		Map<String, List<Map<String, Object>>> filedMap = new LinkedHashMap<String, List<Map<String, Object>>>();
		List<Integer> mapGropFe = new ArrayList<Integer>();
		boolean b = true;
		Iterator filedIterator = filedList.iterator();

		while (true) {
			while (filedIterator.hasNext()) {
				String filed = (String) filedIterator.next();
				if (b) {
					b = false;
					filedMap = ExportExcelUtil.exportExcel(dataList, filed);
					mapGropFe = ExportExcelUtil.exportExcel(filedMap, mapGropFe);
				} else {
					Map<String, List<Map<String, Object>>> filedValueMap = new LinkedHashMap<String, List<Map<String, Object>>>();
					Iterator filedValues = (filedMap).keySet().iterator();

					while (filedValues.hasNext()) {
						String filedValue = (String) filedValues.next();
						Map<String, List<Map<String, Object>>> fMap = ExportExcelUtil
								.exportExcel((filedMap).get(filedValue), filed);
						mapGropFe = ExportExcelUtil.exportExcel(fMap, mapGropFe);
						Iterator fIterator = fMap.keySet().iterator();

						while (fIterator.hasNext()) {
							String filedString = (String) fIterator.next();
							filedValueMap.put(filedString + filedValue,
									(List<Map<String, Object>>) fMap.get(filedString));
						}
					}

					filedMap = filedValueMap;
				}
			}

			LinkedList<Map<String, Object>> listData = new LinkedList<Map<String, Object>>();
			Iterator fIterator = (filedMap).keySet().iterator();

			while (fIterator.hasNext()) {
				String fString = (String) fIterator.next();
				listData.addAll((Collection<Map<String, Object>>) (filedMap).get(fString));
			}

			Map<String, Object> dataMap = new HashMap<String, Object>();
			dataMap.put("listData", listData);
			dataMap.put("mapGropFe", mapGropFe);
			return dataMap;
		}
	}

	/**
	 * 获取工作表中的图片信息
	 * 
	 * @param sheet    工作表
	 * @param workbook
	 * @param imgList  图片信息
	 */
	private static void exportExcelImg(Sheet sheet, XSSFWorkbook workbook, JSONArray imgList) {
		XSSFDrawing drawing = (XSSFDrawing) sheet.createDrawingPatriarch();
		try {
			for (int i = 0; i < imgList.size(); ++i) {
				String src = "";
				String width = "";
				String height = "";
				JSONObject jsonImg = imgList.getJSONObject(i);
				int col = Integer.valueOf(jsonImg.getString("col"));
				int row = Integer.valueOf(jsonImg.getString("row"));
				width = (String) jsonImg.get("width");
				height = (String) jsonImg.get("height");
				// 获取保存到image中base64位编码
				src = (String) jsonImg.get("src");
				if (width.contains("px") && height.contains("px")) {
					width = width.substring(0, width.lastIndexOf("px"));
					height = height.substring(0, height.lastIndexOf("px"));
				}
				Base64Decoder base64Decoder = new Base64Decoder();
				byte[] picture = base64Decoder.decode(src);
				float fHeight = Float.parseFloat(height);
				Integer iHight = ExportExcelUtil.rowHight(sheet, row, fHeight);
				Integer iWidth = ExportExcelUtil.colWidth(sheet, row, col, Float.parseFloat(width));
				if (iWidth != 0 && iHight != 0) {
					XSSFClientAnchor clientAnchor = new XSSFClientAnchor(0, 0, Integer.parseInt(width),
							Integer.parseInt(height), col, row, iWidth + 1, iHight);
					drawing.createPicture(clientAnchor, workbook.addPicture(picture, 5));
				} else {
					int lastRow = row + Integer.parseInt(String.format("%.0f", Float.parseFloat(height) / 25.0F));
					int lastCol = Integer.parseInt(String.format("%.0f", Float.parseFloat(width) / 100.0F));
					XSSFClientAnchor clientAnchor = new XSSFClientAnchor(0, 0, Integer.parseInt(width),
							Integer.parseInt(height), col, row, col + lastCol, i + lastRow);
					drawing.createPicture(clientAnchor, workbook.addPicture(picture, 5));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	/**
	 * 对图片宽进行处理
	 * 
	 * @param sheet 工作表
	 * @param row   行
	 * @param col   列
	 * @param width 宽
	 * @return
	 */
	public static Integer colWidth(Sheet sheet, Integer row, Integer col, float width) {
		float t = 0.0F;
		Row row1 = sheet.getRow(row);
		Iterator<?> rows = row1.iterator();

		while (rows.hasNext()) {
			Cell cell = (Cell) rows.next();
			if (cell.getColumnIndex() >= col) {
				float columnWidthInPixels = sheet.getColumnWidth(cell.getColumnIndex());
				t += columnWidthInPixels;
				if (t >= width) {
					return cell.getColumnIndex();
				}

				float ft = width - t;
				if (ft < 30.0F) {
					return cell.getColumnIndex();
				}
			}
		}

		return 0;
	}

	/**
	 * 对图片高度进行处理
	 * 
	 * @param sheet  工作表
	 * @param row    行
	 * @param height 高
	 * @return
	 */
	public static Integer rowHight(Sheet sheet, Integer row, float height) {
		int in = 0;
		Double d = 0.0D;

		for (Iterator<?> sheets = sheet.iterator(); sheets.hasNext(); ++in) {
			Row rows = (Row) sheets.next();
			if (row <= in) {
				d = d + (double) rows.getHeightInPoints();
			}

			if (d != 0.0D && (double) height - d <= 10.0D && in > 0) {
				return in;
			}

			if (d >= (double) height && in > 0) {
				return in;
			}
		}

		return 0;
	}

	/**
	 * 对图片进行处理
	 * 
	 * @param imgFile 需要处理的图片
	 * @return
	 */
	private static byte[] getImgStr(String imgFile) {
		// 将图片文件转化为字节数组字符串
		File file = new File(imgFile);
		InputStream in = null;
		byte[] data = null;
		// 读取图片字节数组
		try {
			in = new FileInputStream(file);
			data = new byte[in.available()];
			in.read(data);
			in.close();
			if (data != null && data.length > 0) {
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return data;
	}

	/**
	 * 获取工作表中的图表信息
	 * 
	 * @param sheet     工作表
	 * @param workbook
	 * @param chartList 图表信息
	 */
	private static void exportExcelChart(Sheet sheet, XSSFWorkbook workbook, JSONArray chartList) {
		XSSFDrawing drawing = (XSSFDrawing) sheet.createDrawingPatriarch();
		try {
			for (int i = 0; i < chartList.size(); ++i) {
				String url = "";
				String width = "";
				String height = "";
				JSONObject chartJson = chartList.getJSONObject(i);
				int col = Integer.valueOf(chartJson.getString("col"));
				int row = Integer.valueOf(chartJson.getString("row"));
				width = (String) chartJson.get("width");
				height = (String) chartJson.get("height");
				// 获取保存到chart中base64位编码
				url = (String) chartJson.get("url");
				Base64Decoder base64Decoder = new Base64Decoder();
				byte[] picture = base64Decoder.decode(url);
				int lastRow = Integer.parseInt(String.format("%.0f", Float.parseFloat(height) / 25.0F));
				int lastCol = Integer.parseInt(String.format("%.0f", Float.parseFloat(width) / 100.0F));
				XSSFClientAnchor clientAnchor = new XSSFClientAnchor(0, 0, Integer.parseInt(width),
						Integer.parseInt(height), col, row, col + lastCol, row + lastRow);
				drawing.createPicture(clientAnchor, workbook.addPicture(picture, 5)).resize(1.0D);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	/**
	 * 将图片写入磁盘
	 * 
	 * @param inputStream
	 * @return
	 * @throws Exception
	 */
	private static byte[] downloadImg(InputStream inputStream) throws Exception {
		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
		byte[] b = new byte[1024];
		int len;
		while ((len = inputStream.read(b)) != -1) {
			outputStream.write(b, 0, len);
		}

		inputStream.close();
		return outputStream.toByteArray();
	}

	/**
	 * 获取工作表的行列格式
	 * 
	 * @param rows     行信息
	 * @param sheet    工作表
	 * @param workbook
	 * @param styleMap 样式信息
	 */
	private static void exportExcel(JSONObject rows, Sheet sheet, XSSFWorkbook workbook, Map<String, Object> styleMap) {
		Iterator<?> rowsIterator = rows.keySet().iterator();

		label85: while (true) {
			// 行
			String row;
			do {
				if (!rowsIterator.hasNext()) {
					return;
				}

				row = (String) rowsIterator.next();
			} while ("len".equals(row));
			// 获取行中的jsonObject内容
			JSONObject cells = rows.getJSONObject(row).getJSONObject("cells");
			Iterator<?> cellsIterator = cells.keySet().iterator();

			sheet.getRow(Integer.parseInt(row));

			while (true) {
				CellRangeAddress cellRangeAddress;
				JSONObject jsonStyle;
				do {
					JSONObject jsonCell;
					do {
						String cell;
						String cellMerge;
						int lBracketCount;
						int rBracketCount;
						do {
							do {
								do {
									if (!cellsIterator.hasNext()) {
										continue label85;
									}

									cell = (String) cellsIterator.next();
									jsonCell = cells.getJSONObject(cell);
								} while (!jsonCell.containsKey("merge"));

								cellMerge = jsonCell.getString("merge");
								String[] brackets = exportExcel(cellMerge, "[", "]").split(",");
								lBracketCount = Integer.parseInt(brackets[0]);
								rBracketCount = Integer.parseInt(brackets[1]);
							} while (cellMerge == null);
						} while ("".equals(cellMerge));

						int firstRow = Integer.parseInt(row);
						int lastRow = lBracketCount + firstRow;
						int firstCol = Integer.parseInt(cell);
						int lastCol = rBracketCount + firstCol;
						cellRangeAddress = new CellRangeAddress(firstRow, lastRow, firstCol, lastCol);
						sheet.addMergedRegion(cellRangeAddress);
					} while (!jsonCell.containsKey("style"));

					String style = jsonCell.getString("style");
					jsonStyle = (JSONObject) styleMap.get(style);
				} while (!jsonStyle.containsKey("border"));

				JSONObject jsonBorder = jsonStyle.getJSONObject("border");
				Iterator<?> borderTterator = jsonBorder.keySet().iterator();

				while (borderTterator.hasNext()) {
					String border = (String) borderTterator.next();
					byte b = -1;
					switch (border.hashCode()) {
					case -1383228885:
						if (border.equals("bottom")) {
							b = 2;
						}
						break;
					case 115029:
						if (border.equals("top")) {
							b = 0;
						}
						break;
					case 3317767:
						if (border.equals("left")) {
							b = 1;
						}
						break;
					case 108511772:
						if (border.equals("right")) {
							b = 3;
						}
					}

					switch (b) {
					case 0:
						RegionUtil.setBorderTop(1, cellRangeAddress, sheet, workbook);
						break;
					case 1:
						RegionUtil.setBorderLeft(1, cellRangeAddress, sheet, workbook);
						break;
					case 2:
						RegionUtil.setBorderBottom(1, cellRangeAddress, sheet, workbook);
						break;
					case 3:
						RegionUtil.setBorderRight(1, cellRangeAddress, sheet, workbook);
					}
				}
			}
		}
	}

	/**
	 * 获取工作表内容格式
	 * 
	 * @param cellJson  工作表内容格式
	 * @param styleMap  样式信息
	 * @param workbook
	 * @param sheetCell 工作表内容格式
	 */
	private static void exportExcel(JSONObject cellJson, Map<String, Object> styleMap, XSSFWorkbook workbook,
			Cell sheetCell) {
		if (cellJson.containsKey("style")) {
			String style = cellJson.getString("style");
			if (style != null && !"null".equals(style)) {
				JSONObject styleJson = (JSONObject) styleMap.get(style);
				XSSFCellStyle cellStyle = workbook.createCellStyle();
				// 根据不同样式拿到不同结果
				// 表格样式
				String tableStyle;
				if (styleJson.containsKey("align")) {
					tableStyle = styleJson.getString("align").toUpperCase();
					cellStyle.setAlignment(HorizontalAlignment.valueOf(tableStyle));
					cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
				}

				if (styleJson.containsKey("valign")) {
					tableStyle = styleJson.getString("valign").toUpperCase();
					if ("MIDDLE".equals(tableStyle)) {
						tableStyle = "CENTER";
					}

					cellStyle.setVerticalAlignment(VerticalAlignment.valueOf(tableStyle));
				}

				if (styleJson.containsKey("bgcolor")) {
					tableStyle = styleJson.getString("bgcolor");
					XSSFColor color = new XSSFColor();
					if (tableStyle.indexOf("#") != -1) {
						byte[] styleByte = new byte[] { (byte) Integer.parseInt(tableStyle.substring(1, 3), 16),
								(byte) Integer.parseInt(tableStyle.substring(3, 5), 16),
								(byte) Integer.parseInt(tableStyle.substring(5, 7), 16) };
						color.setRgb(styleByte);
					}
					// setFillPattern(); setfillpattern是一种计算机函数，功能是选择用户定义的填充模式
					cellStyle.setFillForegroundColor(color);
					cellStyle.setFillBackgroundColor(color);
					cellStyle.setFillPattern((short) 9);
				}

				String faceStyle;
				XSSFFont font = workbook.createFont();
				if (styleJson.containsKey("font")) {

					JSONObject fontJson = (JSONObject) styleJson.get("font");
					if (fontJson.containsKey("size")) {
						font.setFontHeightInPoints(fontJson.getShort("size"));
					}

					if (fontJson.containsKey("bold")) {
						boolean bold = fontJson.getBoolean("bold");
						font.setBold(bold);
					}

				}
				if (styleJson.containsKey("color")) {
					faceStyle = styleJson.getString("color");
					XSSFColor color = new XSSFColor();
					if (faceStyle.indexOf("#") != -1) {
						byte[] colorStyle = new byte[] { (byte) Integer.parseInt(faceStyle.substring(1, 3), 16),
								(byte) Integer.parseInt(faceStyle.substring(3, 5), 16),
								(byte) Integer.parseInt(faceStyle.substring(5, 7), 16) };

						color.setRgb(colorStyle);
					}

					font.setColor(color);
				}

				cellStyle.setFont(font);

				if (styleJson.containsKey("border")) {
					JSONObject borderJson = styleJson.getJSONObject("border");
					Iterator<?> border = borderJson.keySet().iterator();

					while (border.hasNext()) {
						faceStyle = (String) border.next();
						byte b = -1;
						switch (faceStyle.hashCode()) {
						case -1383228885:
							if (faceStyle.equals("bottom")) {
								b = 2;
							}
							break;
						case 115029:
							if (faceStyle.equals("top")) {
								b = 0;
							}
							break;
						case 3317767:
							if (faceStyle.equals("left")) {
								b = 1;
							}
							break;
						case 108511772:
							if (faceStyle.equals("right")) {
								b = 3;
							}
						}

						switch (b) {
						case 0:
							cellStyle.setBorderTop(BorderStyle.THIN);
							break;
						case 1:
							cellStyle.setBorderLeft(BorderStyle.THIN);
							break;
						case 2:
							cellStyle.setBorderBottom(BorderStyle.THIN);
							break;
						case 3:
							cellStyle.setBorderRight(BorderStyle.THIN);
						}

					}
				}

				sheetCell.setCellStyle(cellStyle);
			}
		}

	}

	/**
	 * 获取bracket中的内容信息
	 * 
	 * @param cellMerge
	 * @param leftBracket
	 * @param rightBracket
	 * @return
	 */
	public static String exportExcel(String cellMerge, String leftBracket, String rightBracket) {
		int lBracket = cellMerge.indexOf(leftBracket);
		int rBracket = cellMerge.indexOf(rightBracket);
		if (lBracket < 0) {
			return "";
		} else if (rBracket < 0) {
			return "";
		} else {
			String bracket = cellMerge.substring(lBracket, rBracket).substring(leftBracket.length());
			return bracket;
		}
	}

	/**
	 * 通过apiget与post类型获取数据集信息
	 * 
	 * @param reportDb 数据集信息
	 * @return
	 */
	private static Map<String, Object> exportExcel(APIDataset tApiInfo) {
		String apiMethod = "";
		if ("0".equals(tApiInfo.getRequestType().toString())) {
			apiMethod = HttpUtil.createRequest(Method.GET, tApiInfo.getUrl()).execute().body();
		} else {
			apiMethod = HttpUtil.createRequest(Method.POST, tApiInfo.getUrl()).execute().body();
		}

		JSONObject apiMethodObject = JSONObject.parseObject(apiMethod);
		String data = "";
		String total = "";
		String count = "";
		if (apiMethodObject.containsKey("data")) {
			data = apiMethodObject.get("data").toString();
		}

		if (apiMethodObject.containsKey("total")) {
			if (apiMethodObject.get("total") != null) {
				total = apiMethodObject.get("total").toString();
			} else {
				total = "0";
			}
		}

		if (apiMethodObject.containsKey("count")) {
			if (apiMethodObject.get("total") != null) {
				count = apiMethodObject.get("count").toString();
			} else {
				count = "0";
			}
		}

		List<Map<String, Object>> dataList = JSONArray.parseObject(data, List.class);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("dataList", dataList);
		map.put("total", total);
		map.put("count", count);
		return map;
	}

	/**
	 * 返回带参数的sql
	 * 
	 * @param reportDb sql数据集信息
	 * @param params   数据集参数
	 * @return
	 * @throws CustomException
	 */
	private String exportExcel(SQLDataset reportDb, Map<String, String[]> params) throws CustomException {
		String dbSql = reportDb.getDbSql().replace("\n", " ");
		boolean paramFlag = dbSql.contains("$");
		if (paramFlag) {
			// 查询对应的param数据
			List<SQLDatasetParam> reportParams = ReportDBManager.get()
					.createQuery("from ReportParam where report_db_id = ?", SQLDatasetParam.class)
					.setParameter(1, reportDb.getId()).getResultList();
			List<String> paramList = new ArrayList<String>();
			Iterator param;
			SQLDatasetParam reportParam;
			String paramValue;
			String paramName;
			if (params.size() > 0 && !params.isEmpty()) {
				for (param = params.keySet().iterator(); param
						.hasNext(); dbSql = dbSql.replace("${" + paramName + "}", paramValue)) {
					paramName = (String) param.next();
					paramValue = StringUtils.join((Object[]) params.get(paramName));
				}
			} else {
				for (param = paramList.iterator(); param.hasNext(); dbSql = dbSql
						.replace("${" + reportParam.getName() + "}", reportParam.getDefaultValue())) {
					reportParam = (SQLDatasetParam) param.next();
				}
			}
		}

		return dbSql;
	}

	/**
	 * 返回每行的数据信息
	 * 
	 * @param dynamicData 数据信息
	 * @return
	 */
	public static Map<String, Object> exportExcel(Map<String, Object> dynamicData) {
		Map<String, Object> dynamicDataValue = new HashMap<String, Object>();
		if (dynamicData != null && !dynamicData.isEmpty()) {
			Set<String> dynamicDataSet = dynamicData.keySet();
			Iterator<String> dynamicDataSetIterator = dynamicDataSet.iterator();

			while (dynamicDataSetIterator.hasNext()) {
				String dData = (String) dynamicDataSetIterator.next();
				String data = dData.toLowerCase();
				dynamicDataValue.put(data, dynamicData.get(dData));
			}

			return dynamicDataValue;
		} else {
			return dynamicDataValue;
		}
	}

	/**
	 * 获取工作表的列宽
	 * 
	 * @param sheet 工作表
	 * @param cols  列信息
	 */
	private static void exportExcel(Sheet sheet, JSONObject cols) {
		Iterator colIterator = cols.keySet().iterator();

		while (colIterator.hasNext()) {
			String col = (String) colIterator.next();
			JSONObject colJson = (JSONObject) cols.get(col);
			sheet.setColumnWidth(Integer.parseInt(col), 35 * colJson.getInteger("width"));
		}

	}

	/**
	 * 返回带参数的sql数据集信息
	 * 
	 * @param rows         行信息
	 * @param reportDb     sql数据集信息
	 * @param dynamicDatas 数据信息
	 * @return
	 */
	private static JSONObject exportExcel(JSONObject rows, SQLDataset reportDb, List<Map<String, Object>> dynamicDatas) {
		String jsonRow = rows.toJSONString();
		// 数据集名字
		String dbChName = reportDb.getName();
		Map<String, Object> dynamicData = exportExcel(dynamicDatas.get(0));

		String paramName;
		String paramValue;
		for (Iterator<String> dynamicDataIterator = dynamicData.keySet().iterator(); dynamicDataIterator
				.hasNext(); jsonRow = jsonRow.replace(paramName, paramValue)) {
			String dData = (String) dynamicDataIterator.next();
			paramName = "#{" + dbChName + "." + dData + "}";
			paramValue = "";
			if (dynamicData.get(dData) != null) {
				paramValue = dynamicData.get(dData).toString();
			}
		}

		rows = JSONObject.parseObject(jsonRow);
		return rows;
	}

	/**
	 * 返回带参数api数据信息
	 * 
	 * @param rows             行信息
	 * @param tReportDsApiInfo api数据集信息
	 * @param dynamicDatas     数据信息
	 * @return
	 */
	private static JSONObject exportExcel(JSONObject rows, APIDataset tReportDsApiInfo,
			List<Map<String, Object>> dynamicDatas) {
		String jsonRow = rows.toJSONString();
		// 数据集名字
		String dbChName = tReportDsApiInfo.getName();
		Map<String, Object> dynamicData = exportExcel(dynamicDatas.get(0));

		String paramName;
		String paramValue;
		for (Iterator<String> dynamicDataIterator = dynamicData.keySet().iterator(); dynamicDataIterator
				.hasNext(); jsonRow = jsonRow.replace(paramName, paramValue)) {
			String dData = (String) dynamicDataIterator.next();
			paramName = "${" + dbChName + "." + dData + "}";
			paramValue = "";
			if (dynamicData.get(dData) != null) {
				paramValue = dynamicData.get(dData).toString();
			}
		}

		rows = JSONObject.parseObject(jsonRow);
		return rows;
	}
}
