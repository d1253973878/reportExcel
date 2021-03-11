package com.newtec.report.service.excel;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import com.newtec.myqdp.server.utils.exception.CustomException;

/**
 * excel导入导出接口
 * @author hhy
 *
 */
public interface ExcelExportAndImportService {
    
	/**
	 * 导出excel
	 * @param excelConfigId 报表id
	 * @param mapReq        执行语句sql或者api参数
	 * @param echartBase64  base64位编码
	 * @return
	 * @throws CustomException
	 */
	public Map<String, Object> exportAllExcel(Long excelConfigId, Map<String, String[]> mapReq,
			List<Map<String, Object>> echartBase64) throws CustomException;
	
	
	
	/**
	 * 导入excel
	 * 
	 * @param file 需要导入的文件
	 * @return
	 * @throws IOException
	 */
	public Map<String, Object> importExcel(File file) throws IOException;
}
