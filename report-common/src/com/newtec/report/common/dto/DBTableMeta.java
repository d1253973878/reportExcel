package com.newtec.report.common.dto;

public class DBTableMeta {
	
	private String name;
	
	private String remark;

	public String toString() {
		return this.name + ";" + this.remark;
	}

	public DBTableMeta() {}

	public DBTableMeta(String name, String remark) {
		this.name = name;
		this.remark = remark;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}