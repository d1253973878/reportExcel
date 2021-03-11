package com.newtec.report.service.report;

import java.util.List;
import java.util.Map;

import com.newtec.myqdp.server.utils.QueryResult;
import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.reflect.annotation.RpcParam;
import com.newtec.report.common.dto.ReportDTO;
import com.newtec.report.common.entity.report.Report;
import com.newtec.router.request.FetchWebRequest;

import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;

/**
 * 报表接口
 * @Author 朱才富
 * @Description: (这里用一句话描述这个类的作用)
 */
public interface ReportService {
	
	/**
	 * 保存报表
	 * @Author: 朱才富
	 * @param params
	 * @throws CustomException
	 */
	public void saveReport(WebRequest<ReportDTO> request) throws CustomException;
	
	/**
	 * 查询所有报表（不分页）
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param req 执行SQl失败或参数不合法时抛出
	 * @return
	 * @throws CustomException
	 */
	public List<Report> queryAllReport(WebRequest<Map<String, Object>> request) throws CustomException;
	
	/**
	 * 查询报表（分页）
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param req 执行SQl失败或参数不合法时抛出
	 * @return
	 * @throws CustomException
	 */
	public QueryResult<Report> queryReportList(FetchWebRequest req) throws CustomException;

	/**
	 * 删除报表
	 * @Author: 朱才富
	 * @Description: (这里用一句话描述这个方法的作用)  
	 * @param req 报表ID
	 * @return
	 * @throws CustomException 执行SQl失败时抛出
	 */
	void deleteReport(WebRequest<Long> request) throws CustomException;

	/**
	 * 收藏/取消收藏报表
	 * @Author: 朱才富
	 * @param request 
	 *             id 报表ID
	 *             template 0-取消收藏，1-收藏
	 * @throws CustomException 执行SQL失败或参数不合法时
	 */
	void collectReport(WebRequest<Map<String, Object>> request) throws CustomException;

	/**
	 * 复制报表
	 * @Author: 朱才富
	 * @param request id 报表ID
	 * @throws CustomException
	 */
	void copyReport(WebRequest<Long> request) throws CustomException;

	/**
	 * 获取报表信息
	 * @Author: 朱才富
	 * @param request
	 *             id 报表ID
	 *             config 是否需要返回报表的JSON配置：0-否，1-是
	 * @return 
	 * @throws CustomException
	 */
	ReportDTO getReport(WebRequest<Map<String, Object>> request) throws CustomException;

	/**
	 * 创建报表
	 * @param request name 报表名称
	 * @return 
	 * @throws CustomException
	 */
	Report createReport(WebRequest<String> request) throws CustomException;

	/**
	 * 获取报表 JSON 配置信息
	 * @Author: 朱才富
	 * @param request id 报表ID
	 * @return 
	 * @throws CustomException
	 */
	String getReportConfig(WebRequest<Long> request) throws CustomException;

	/**
	 * 根据报表id 和 sheet表传过来的信息 查询出报表要展示的数据
	 * @author 黄腾
	 * @param request 包含报表id 和 sheet表内设置好的信息
	 * @param reportId 报表id
	 * @param sheetInfo sheet表内设置的信息
	 * @return 返回 设置有查询出的数据的sheetInfo对象
	 * @throws CustomException
	 */
	JSONObject findReportDatasById(WebRequest<Map<String, String>> request) throws CustomException;
}