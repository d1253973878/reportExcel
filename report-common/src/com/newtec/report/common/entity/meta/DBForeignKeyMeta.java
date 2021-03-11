package com.newtec.report.common.entity.meta;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.newtec.myqdp.server.utils.StringUtils;

/**
 * 表外键对象
 * @Author 朱才富
 * @Description: (这里用一句话描述这个类的作用)
 */
@Entity
@Table(name = "t_foreign_key_meta")
public class DBForeignKeyMeta {
	
	@Id
	private String id;
	
	@Column(name = "COLUMN_NAME")
	private String columnName;
	
	@Column(name = "TABLE_NAME")
	private String tableName;

	@Column(name = "CONSTRAINT_NAME")
	private String constraintName;
	
	@Column(name = "R_COLUMN_NAME")
	private String rColumnName;
	
	@Column(name = "R_TABLE_NAME")
	private String rTableName;
	
	@Column(name = "R_CONSTRAINT_NAME")
	private String rConstraintName;
	
	private String schema;
	
	@Column(name = "R_SCHEMA")
	private String rSchema;
	
	@Column(name = "DELETE_RULE")
	private String deleteRule;
	
	private String status;
	
	@Column(name = "CREATE_TIME")
	private String createTime;
	
	@Column(name = "UPDATE_TIME")
	private String updateTime;

	public DBForeignKeyMeta() {
		this.id = StringUtils.generatoryId32();
	}
	
	public DBForeignKeyMeta(String tableName, String columnName, String constraintName, String rTableName,
			String rColumnName, String rConstraintName, String deleteRule, String status) {
		super();
		this.id = StringUtils.generatoryId32();
		this.columnName = columnName;
		this.tableName = tableName;
		this.constraintName = constraintName;
		this.rColumnName = rColumnName;
		this.rTableName = rTableName;
		this.rConstraintName = rConstraintName;
		this.deleteRule = deleteRule;
		this.status = status;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getConstraintName() {
		return constraintName;
	}

	public void setConstraintName(String constraintName) {
		this.constraintName = constraintName;
	}

	public String getrColumnName() {
		return rColumnName;
	}

	public void setrColumnName(String rColumnName) {
		this.rColumnName = rColumnName;
	}

	public String getrTableName() {
		return rTableName;
	}

	public void setrTableName(String rTableName) {
		this.rTableName = rTableName;
	}

	public String getrConstraintName() {
		return rConstraintName;
	}

	public void setrConstraintName(String rConstraintName) {
		this.rConstraintName = rConstraintName;
	}

	public String getSchema() {
		return schema;
	}

	public void setSchema(String schema) {
		this.schema = schema;
	}

	public String getrSchema() {
		return rSchema;
	}

	public void setrSchema(String rSchema) {
		this.rSchema = rSchema;
	}

	public String getDeleteRule() {
		return deleteRule;
	}

	public void setDeleteRule(String deleteRule) {
		this.deleteRule = deleteRule;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
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

}