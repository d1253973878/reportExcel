package com.newtec.report.common.dto;

/*
 * 数据库表字段元数据类
 * @Author 朱才富
 * @Description: (这里用一句话描述这个类的作用)
 */
public class DBFieldMeta {
	
	private String name;
	
	private String type;
	
	private int length;
	
	private int accuracy;
	
	private boolean isPk;
	
	private boolean ableNull;
	
	private String remark;
	
	private String defaultValue;

	public String toString() {
		return this.name + ";" + this.type + ";" + this.length + ";" + this.accuracy + ";" + this.isPk + ";"
				+ this.ableNull + ";" + this.defaultValue + ";" + this.remark;
	}

	public DBFieldMeta() {
		this.isPk = false;
		this.ableNull = true;
	}

	public DBFieldMeta(String name, int length) {
		this.isPk = false;
		this.ableNull = true;
		this.name = name;
		this.length = length;
		this.type = "VARCHAR";
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getLength() {
		return this.length;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public int getAccuracy() {
		return this.accuracy;
	}

	public void setAccuracy(int accuracy) {
		this.accuracy = accuracy;
	}

	public boolean isAbleNull() {
		return this.ableNull;
	}

	public void setAbleNull(boolean ableNull) {
		this.ableNull = ableNull;
	}

	public boolean isPk() {
		return this.isPk;
	}

	public void setPk(boolean isPk) {
		this.isPk = isPk;
	}

	public String getRemark() {
		return this.remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getDefaultValue() {
		return this.defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
	}
}