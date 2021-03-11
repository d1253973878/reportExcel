package com.newtec.report.common.dto;

import java.util.List;

import com.newtec.report.common.entity.api.APIDataset;
import com.newtec.report.common.entity.sql.SQLDataset;

/**
 * sql数据集和api数据集
 * @author hhy
 * @Description TODO
 * @date 2020年12月28日
 */
public class ReportDataset {
	
     /**
     * sql数据集 信息对象
     */
    List<SQLDataset> sqlDatasets;
    
    
    /**
     * api数据集信息对象
     */
    List<APIDataset> apiDatasets;


	public List<SQLDataset> getSqlDatasets() {
		return sqlDatasets;
	}


	public void setSqlDatasets(List<SQLDataset> sqlDatasets) {
		this.sqlDatasets = sqlDatasets;
	}


	public List<APIDataset> getApiDatasets() {
		return apiDatasets;
	}


	public void setApiDatasets(List<APIDataset> apiDatasets) {
		this.apiDatasets = apiDatasets;
	}
	
}
