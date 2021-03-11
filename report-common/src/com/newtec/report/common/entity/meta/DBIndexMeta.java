package com.newtec.report.common.entity.meta;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.newtec.myqdp.server.utils.StringUtils;

/**
 * 表索引对象
 * @Author 朱才富
 * @Description: (这里用一句话描述这个类的作用)
 */
@Entity
@Table(name = "t_index_meta")
public class DBIndexMeta {
	
	@Id
	private String id;
	
	private String name;
	
	private String fields;

	private String type;
	
	@Column(name = "TABLE_NAME")
	private String tableName;
	
	@Column(name = "CREATE_TIME")
	private String createTime;
	
	@Column(name = "UPDATE_TIME")
	private String updateTime;

	public DBIndexMeta() {
		this.id = StringUtils.generatoryId32();
	}

	public DBIndexMeta(String name, String fields, String type) {
		super();
		this.id = StringUtils.generatoryId32();
		this.name = name;
		this.fields = fields;
		this.type = type;
	}

	@Override
	public String toString() {
		return "DBIndexMeta [id=" + id + ", name=" + name + ", fields=" + fields + ", type=" + type + ", tableName="
				+ tableName + "]";
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getFields() {
		return fields;
	}

	public void setFields(String fields) {
		this.fields = fields;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	public String getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}
	
}