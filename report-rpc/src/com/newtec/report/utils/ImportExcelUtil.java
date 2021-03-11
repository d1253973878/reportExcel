package com.newtec.report.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.util.HashMap;
import java.util.IdentityHashMap;
import java.util.Iterator;
import java.util.Map;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.newtec.report.common.entity.MergedResult;

/**
 * excel导出工具类
 * 
 * @author Administrator
 *
 */
public class ImportExcelUtil {

	/**
	 * 用于读取文件的工具类
	 * 
	 * @param inputStream 输入流
	 * @return
	 * @throws IOException
	 */
	public static Map<String, Object> importExcel(InputStream inputStream) throws IOException {
		System.out.println("==============" + 952);
		// 创建建workbook
		XSSFWorkbook workbook = new XSSFWorkbook(inputStream);
		// 获取工作表
		Sheet sheet = workbook.getSheetAt(0);
		// 行信息
		IdentityHashMap<String, Object> rowMap = new IdentityHashMap<String, Object>();
		// 样式
		IdentityHashMap<Integer, Map<String, Object>> styles = new IdentityHashMap<Integer, Map<String, Object>>();
		// 行数与行内容
		IdentityHashMap<Integer, IdentityHashMap<String, Serializable>> rows = new IdentityHashMap<Integer, IdentityHashMap<String, Serializable>>();

		int cellStyle = 0;
		Iterator iterator = sheet.iterator();

		while (iterator.hasNext()) {
			// 行
			Row row = (Row) iterator.next();
			// 行数
			int rowNum = row.getRowNum();
			// 行内容
			IdentityHashMap<String, Serializable> rowData = new IdentityHashMap<String, Serializable>();
			// 行内容中包含信息
			IdentityHashMap<Integer, IdentityHashMap<String, Object>> cells = new IdentityHashMap<Integer, IdentityHashMap<String, Object>>();

			for (Iterator<?> rowIterator = row.iterator(); rowIterator.hasNext(); rowMap.put("style", styles)) {
				Cell cell = (Cell) rowIterator.next();
				// 单元格内容
				IdentityHashMap<String, Object> cellData = new IdentityHashMap<String, Object>();
				// 列数
				int columnIndex;
				// 合并单元格信息
				MergedResult mergedResult;
				int[] cellNum;
				Map<String, Object> styleMap;
				if (cell.getCellType() != 3) {
					switch (cell.getCellType()) {
					case 0:
						if (DateUtil.isCellDateFormatted(cell)) {
							cellData.put("text", cell.getRichStringCellValue());
						} else {
							cellData.put("text", cell.getNumericCellValue());
						}
						break;
					case 1:
						cellData.put("text", cell.getRichStringCellValue().getString());
					case 2:
					case 3:
					default:
						break;
					case 4:
						cellData.put("text", cell.getRichStringCellValue());
					}
					// 列数
					columnIndex = cell.getColumnIndex();
					mergedResult = ImportExcelUtil.importExcel(sheet, rowNum, columnIndex);
					if (mergedResult.isMerged()) {
						cellNum = new int[0];
						// 得到合并单元格数
						cellNum = new int[] { mergedResult.getEndRow() - mergedResult.getStartRow(),
								mergedResult.getEndCol() - mergedResult.getStartCol() };
						cellData.put("merge", cellNum);
					}
					// 得到cell内容样式
					styleMap = ImportExcelUtil.importExcel(cell, mergedResult.isMerged());
					++cellStyle;
					styles.put(cellStyle, styleMap);
					cellData.put("style", cellStyle);
					cells.put(columnIndex, cellData);
				} else {
					columnIndex = cell.getColumnIndex();
					mergedResult = ImportExcelUtil.importExcel(sheet, rowNum, columnIndex);
					if (mergedResult.isMerged()) {
						cellNum = new int[0];
						cellNum = new int[] { mergedResult.getEndRow() - mergedResult.getStartRow(),
								mergedResult.getEndCol() - mergedResult.getStartCol() };
						cellData.put("merge", cellNum);
					}

					if (!mergedResult.isMerged()) {
						styleMap = ImportExcelUtil.importExcel(cell, mergedResult.isMerged());
						++cellStyle;
						styles.put(cellStyle, styleMap);
						cellData.put("style", cellStyle);
						cells.put(columnIndex, cellData);
					}
				}
			}

			rowData.put("cells", cells);
			rowData.put("height", row.getHeightInPoints());
			rows.put(rowNum, rowData);
			rowMap.put("rows", rows);
		}

		return rowMap;
	}

	/**
	 * 获取工作表的行列合并信息
	 * 
	 * @param sheet       工作表
	 * @param rowNum      行数
	 * @param columnIndex 列数
	 * @return
	 */
	private static MergedResult importExcel(Sheet sheet, int rowNum, int columnIndex) {
		System.out.println("==============" + 972);
		int numMergedRegions = sheet.getNumMergedRegions();

		for (int i = 0; i < numMergedRegions; ++i) {
			CellRangeAddress mergedRegion = sheet.getMergedRegion(i);
			// 返回符合给定筛选要求的显示序列的第一列
			int firstColumn = mergedRegion.getFirstColumn();// 合并单元格CELL起始列
			// 返回符合给定筛选要求的显示序列的最后一列
			int lastColumn = mergedRegion.getLastColumn(); // 合并单元格CELL结束列
			// 返回符合给定筛选要求的显示序列的第一行
			int firstRow = mergedRegion.getFirstRow(); // 合并单元格CELL起始行
			// 返回符合给定筛选要求的显示序列的最后一行
			int lastRow = mergedRegion.getLastRow(); // 合并单元格CELL结束行
			// 判断该单元格是否是在合并单元格中
			if (rowNum >= firstRow && rowNum <= lastRow && columnIndex >= firstColumn && columnIndex <= lastColumn) {
				return new MergedResult(true, firstRow, lastRow, firstColumn, lastColumn);
			}
		}

		return new MergedResult(false, 0, 0, 0, 0);
	}

	/**
	 * 获取cell内容样式
	 * 
	 * @param cell     cell内容
	 * @param isMerged 是否合并
	 * @return
	 */
	private static Map<String, Object> importExcel(Cell cell, boolean isMerged) {
		System.out.println("==============" + 953);
		// 单元格样式
		CellStyle cellStyle = cell.getCellStyle();
		// 字体样式
		HashMap<String, Object> typeFace = new HashMap<String, Object>();
		// 位置
		HashMap<String, String[]> position = new HashMap<String, String[]>();
		// 字体大小
		HashMap<String, Object> font = new HashMap<String, Object>();
		// 是否加粗
		if (((XSSFCell) cell).getCellStyle().getFont().getBold()) {
			font.put("bold", true);
		}
		// 字体大小
		font.put("size", ((XSSFCell) cell).getCellStyle().getFont().getFontHeightInPoints());
		// 边框
		String[] border = new String[] { "thin", "#000" };
		// 下边框
		if (cellStyle.getBorderBottom() == 1) {
			position.put("bottom", border);
		}
		// 左边框
		if (cellStyle.getBorderLeft() == 1) {
			position.put("left", border);
		}
		// 右边框
		if (cellStyle.getBorderRight() == 1) {
			position.put("right", border);
		}
		// 上边框
		if (cellStyle.getBorderTop() == 1) {
			position.put("top", border);
		}
		// 居中处理
		if (cellStyle.getAlignment() == 2) {
			typeFace.put("align", "center");
		}

		if (cellStyle.getBorderBottom() == 1 && cellStyle.getBorderLeft() == 1 && cellStyle.getBorderTop() == 1
				&& isMerged) {
			position.put("right", border);
		}

		if (cellStyle.getBorderRight() != 0 || cellStyle.getBorderBottom() != 0 || cellStyle.getBorderLeft() != 0
				|| cellStyle.getBorderTop() != 0) {
			typeFace.put("border", position);
		}

		XSSFFont xssfFont = ((XSSFCell) cell).getCellStyle().getFont();
		if (xssfFont.getXSSFColor() != null) {
			XSSFColor xssfColor = xssfFont.getXSSFColor();
			// 读取字体颜色
			String color = "#" + xssfColor.getARGBHex().substring(2);
			typeFace.put("color", color);
		}

		if (((XSSFCell) cell).getCellStyle().getFillPattern() >= 1) {
			// 读取单元格背景色
			XSSFColor color = ((XSSFCell) cell).getCellStyle().getFillForegroundColorColor();
			String bgColor = "#" + color.getARGBHex().substring(2);
			typeFace.put("bgcolor", bgColor);
		}

		typeFace.put("font", font);
		return typeFace;
	}

}
