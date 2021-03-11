/**
 * @Title: DsQueryParamsDTO.java
 * @Package com.newtec.report.common.dto
 * @Description: (用一句话描述该文件做什么)
 * @Author 朱才富
 * @Version V1.0
 */
package com.newtec.report.common.dto;


/**
 * @Author 朱才富
 * @Description: 数据集带参查询条件结构
 */
public class DsQueryParamsDTO {
	
	/**
	 * 字段名称
	 */
	private String name;
	
	/**
	 * 查询模式 0-单条件查询，1-范围查询，3-多选查询
	 */
	private Integer mode;
	
	/**
	 * 字段类型 0-数值类型，1-字符类型，2-日期类型，3-时间类型
	 */
	private Integer type;
	
	/**
	 * 字段值
	 */
	private Object value;
	
	/**
	 * 最大值
	 */
	private Object min;
	
	/**
	 * 最小值
	 */
	private Object max;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getMode() {
		return mode;
	}

	public void setMode(Integer mode) {
		this.mode = mode;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public Object getMin() {
		return min;
	}

	public void setMin(Object min) {
		this.min = min;
	}

	public Object getMax() {
		return max;
	}

	public void setMax(Object max) {
		this.max = max;
	}
	
}
