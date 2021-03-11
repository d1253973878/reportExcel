package com.newtec.report.common.dto;

import java.util.List;

import com.newtec.report.common.entity.sql.SQLDatasetField;
import com.newtec.report.common.entity.sql.SQLDatasetParam;
import com.newtec.report.common.entity.sql.SQLDataset;

/**
 * SQL数据集数据传输对象
 * 
 * @author 郝鸿运
 * @Description TODO
 * @date 2020年12月28日
 */
public class SQLDatasetDTO {

	/**
	 * SQL数据集 信息对象
	 */
	SQLDataset dataset;

	/**
	 * 动态参数
	 */
	List<SQLDatasetParam> params;
	
	/**
	 * 动态报表配置明细数组
	 */
	List<SQLDatasetField> fields;
	
	public SQLDataset getDataset() {
		return dataset;
	}

	public void setDataset(SQLDataset dataset) {
		this.dataset = dataset;
	}

	public List<SQLDatasetParam> getParams() {
		return params;
	}

	public void setParams(List<SQLDatasetParam> params) {
		this.params = params;
	}

	public List<SQLDatasetField> getFields() {
		return fields;
	}

	public void setFields(List<SQLDatasetField> fields) {
		this.fields = fields;
	}

}
