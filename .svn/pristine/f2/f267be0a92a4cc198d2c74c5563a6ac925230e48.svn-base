package com.newtec.report.common.entity.sql;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @author 郝鸿运
 * @Description SQL数据集实体
 * @date 2020年12月23日
 */
@Entity
@Table(name = "t_sql_dataset")
public class SQLDataset implements Serializable {
	
	private static final long serialVersionUID = 1L;

	/**
	 * 主键
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * 编码
	 */
	@Column(name = "code")
	private String code;
	
	/**
	 * 名称
	 */
	@Column(name = "name")
	private String name;
	
	/**
	 * 是否分页(1-分页，0-不分页)
	 */
	@Column(name = "pageable")
	private Integer pageable;
	
	/**
	 * 数据源名称
	 */
	@Column(name = "connection_id")
	private String connectionId;
	
	/**
	 * 报表SQL
	 */
	@Column(name = "db_sql")
	private String dbSql;

	/**
	 * 创建时间
	 */

	@Column(name = "create_time")

	private Date createTime;
	
	/**
	 * 更新时间
	 */
	@Column(name = "update_time")
	private Date updateTime;
	
	/**
	 * 对应报表ID
	 */
	@Column(name = "report_id")
	private Long reportId;
	
	/**
	 * 创建人ID
	 */
	@Column(name = "person_id")
	private String personId;
	
	/**
	 * 更新用户ID
	 */
	@Column(name = "update_person_id")
	private String updatePersonId;

	public SQLDataset() {
		super();

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getPageable() {
		return pageable;
	}

	public void setPageable(Integer pageable) {
		this.pageable = pageable;
	}

	public String getConnectionId() {
		return connectionId;
	}

	public void setConnectionId(String connectionId) {
		this.connectionId = connectionId;
	}

	public String getDbSql() {
		return dbSql;
	}

	public void setDbSql(String dbSql) {
		this.dbSql = dbSql;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Long getReportId() {
		return reportId;
	}

	public void setReportId(Long reportId) {
		this.reportId = reportId;
	}

	public String getPersonId() {
		return personId;
	}

	public void setPersonId(String personId) {
		this.personId = personId;
	}

	public String getUpdatePersonId() {
		return updatePersonId;
	}

	public void setUpdatePersonId(String updatePersonId) {
		this.updatePersonId = updatePersonId;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

}
