package com.newtec.report.common.entity.api;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Date;

/**
 * @author 黄腾
 * @Description API数据集 实体类
 * @date 2020年12月23日 下午6:18:38
 */
@Entity
@Table(name = "t_api_dataset")
public class APIDataset implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	/**
	 * api数据集英文编码
	 */
	@Column(name = "code")
	private String code;

	/**
	 * api数据集中文名称
	 */
	@Column(name = "name")
	private String name;

	/**
	 * 数据集更新时间
	 */
	@Column(name = "create_time")
	private Date createTime;

	/**
	 * 是否分页 0 否 1是 默认为0
	 */
	@Column(name = "pageable")
	private Integer pageable;

	/**
	 * 创建人ID
	 */
	@Column(name = "person_id")
	private String personId;

	/**
	 * 对应的报表id
	 */
	@Column(name = "report_id")
	private Long reportId;

	/**
	 * 请求方式 0 get 1 post 默认post
	 */
	@Column(name = "request_type")
	private Integer requestType;

	/**
	 * API 请求地址及参数
	 */
	@Column(name = "url")
	private String url;

	/**
	 * 更新数据集的用户ID
	 */
	@Column(name = "update_person_id")
	private String updatePersonId;

	/**
	 * 数据集更新时间
	 */
	@Column(name = "update_time")
	private Date updateTime;

	public APIDataset() {
	}

	public Long getId() {
		return this.id;
	}

	public void setId(String id) {
		this.id = Long.parseLong(id);
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

	public void setId(Long id) {
		this.id = id;
	}

	public Date getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Integer getPageable() {
		return pageable;
	}

	public void setPageable(Integer pageable) {
		this.pageable = pageable;
	}

	public String getPersonId() {
		return this.personId;
	}

	public void setPersonId(String personId) {
		this.personId = personId;
	}

	public Long getReportId() {
		return this.reportId;
	}

	public void setReportId(Long reportId) {
		this.reportId = reportId;
	}

	public Integer getRequestType() {
		return this.requestType;
	}

	public void setRequestType(Integer requestType) {
		this.requestType = requestType;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getUpdatePersonId() {
		return this.updatePersonId;
	}

	public void setUpdatePersonId(String updatePersonId) {
		this.updatePersonId = updatePersonId;
	}

	public Date getUpdateTime() {
		return this.updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

}