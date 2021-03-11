package com.newtec.report.common.entity.meta;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.newtec.myqdp.server.utils.StringUtils;

@Entity
@Table(name = "t_field_meta")
public class DBFieldMeta {
	
	@Id
	private String id;
	
	private String name;
	
	@Transient
	private String type;
	
	@Transient
	private Integer length;
	
	@Transient
	private Integer accuracy;
	
	@Transient
	// @Column(name = "IS_UNIQUE")
	private Integer isUnique;
	
	@Transient
	// @Column(name = "IS_PK")
	private Integer isPk;
	
	@Transient
	private Integer nullable;
	
	private Integer groupable;
	
	private Integer orderable;
	
	private String remark;
	
	private Integer enable;
	
	@Transient
	// @Column(name = "DEFAULT_VALUE")
	private String defaultValue;
	
	@Transient
	// @Column(name = "COLUMN_ID")
	private Integer columnId;
	
	@Column(name = "TABLE_NAME")
	private String tableName;
	
	public static final Integer YES = 1; 
	
	public static final Integer NO = 0; 

	@Override
	public String toString() {
		return "DBFieldMeta [id=" + id + ", name=" + name + ", type=" + type + ", length=" + length + ", accuracy="
				+ accuracy + ", unique=" + isUnique + ", isPk=" + isPk + ", nullable=" + nullable + ", groupable="
				+ groupable + ", orderable=" + orderable + ", remark=" + remark + ", enable="
				+ enable + ", defaultValue=" + defaultValue + ", tableName=" + tableName + "]";
	}

	public Integer getIsUnique() {
		return isUnique;
	}

	public void setIsUnique(Integer isUnique) {
		this.isUnique = isUnique;
	}

	public DBFieldMeta() {
		this.isPk = NO;
		this.nullable = YES;
		this.enable = YES;
		this.groupable = YES;
		this.orderable = YES;
		this.id = StringUtils.generatoryId32();
	}

	public DBFieldMeta(String name, int length) {
		this.isPk = NO;
		this.nullable = YES;
		this.enable = YES;
		this.groupable = YES;
		this.orderable = YES;
		this.name = name;
		this.length = length;
		this.type = "VARCHAR";
		this.id = StringUtils.generatoryId32();
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

	public Integer getLength() {
		return this.length;
	}

	public Integer isPk() {
		return this.isPk;
	}

	public void setPk(Integer isPk) {
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Integer getIsPk() {
		return isPk;
	}

	public void setIsPk(Integer isPk) {
		this.isPk = isPk;
	}

	public Integer getNullable() {
		return nullable;
	}

	public void setNullable(Integer nullable) {
		this.nullable = nullable;
	}

	public Integer getGroupable() {
		return groupable;
	}

	public void setGroupable(Integer groupable) {
		this.groupable = groupable;
	}

	public Integer getOrderable() {
		return orderable;
	}

	public void setOrderable(Integer orderable) {
		this.orderable = orderable;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public Integer getAccuracy() {
		return accuracy;
	}

	public void setAccuracy(Integer accuracy) {
		this.accuracy = accuracy;
	}

	public void setLength(Integer length) {
		this.length = length;
	}

	public Integer getEnable() {
		return enable;
	}

	public void setEnable(Integer enable) {
		this.enable = enable;
	}

	public Integer getColumnId() {
		return columnId;
	}

	public void setColumnId(Integer columnId) {
		this.columnId = columnId;
	}
	
}