package com.newtec.report.service.sql;

import java.util.List;
import java.util.Map;

import com.newtec.myqdp.server.utils.exception.CustomException;
import com.newtec.myqdp.servlet.meta.WebRequest;
import com.newtec.report.common.dto.SQLDatasetDTO;
import com.newtec.report.common.entity.sql.SQLDatasetField;

/**
 * sql数据集服务类接口
 * 
 * @author 郝鸿运
 * @Description TODO
 * @date 2020年12月28日
 */
public interface SQLDatasetService {
	
	/**
	 * 添加保存或者更新 SQL 数据集信息
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public void saveDataset(WebRequest<SQLDatasetDTO> request) throws CustomException;

	/**
	 * 解析 SQL 数据集返回结果中的字段信息
	 * @param request
	 * @throws CustomException
	 */
	public List<SQLDatasetField> analysisDatasetFields(WebRequest<SQLDatasetDTO> request) throws CustomException;

	/**
	 * 根据sql数据集信息的id查询出相关 的filed和params 并返回
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public Map<String, Object> queryDatasetInfo(WebRequest<Long> request) throws CustomException;

	/**
	 * 根据id查询出相关数据集列表
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public List<Map<String, Object>> findDatasetList(WebRequest<Map<String, String>> request) throws CustomException;

	/**
	 * 根据 ID 删除数据集列表
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public void deleteDataset(WebRequest<Long> request) throws CustomException;

	/**
	 * 根据报表 ID 查出所有的数据集的 id、name
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public List<Map<String, Object>> getDatasetIdAndName(WebRequest<Long> request) throws CustomException;

	/**
	 * 根据数据集ID查询数据集数据
	 * 
	 * @param request
	 * @return
	 * @throws CustomException
	 */
	public List<Map<String, Object>> queryDatasetData(WebRequest<Long> request) throws CustomException;
}
