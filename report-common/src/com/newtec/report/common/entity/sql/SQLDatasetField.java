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
 * @Description 报表配置数据明细实体类
 * @date 2020年12月23日
 */
@Entity
@Table(name = "t_sql_dataset_field")
public class SQLDatasetField implements Serializable {

	private static final long serialVersionUID = 1L;
	
	/**
	 * 主键
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	/**
	 * 排序
	 */
	@Column(name = "order_num")
	private Integer orderNum;
	
	/**
	 * 字段名称
	 */
	@Column(name = "name")
	private String name;
	
	/**
	 * 字段文本
	 */
	@Column(name = "remark")
	private String remark;
	
	/**
	 * 字段类型，数值-0，字符-1，日期-2，时间-3
	 */
	@Column(name = "type")
	private Integer type;
	
	/**
	 * 字典code
	 */
	@Column(name = "dictionary")
	private String dictionary;
	
	/**
	 * 是否查询 是-1，否-0
	 */
	@Column(name = "search_flag")
	private Integer searchFlag;
	
	/**
	 * 查询模式单条件查询-0，范围查询-1，多条件查询-2
	 */
	@Column(name = "search_mode")
	private Integer searchMode;
	
	/**
	 * 创建时间
	 */
	@Column(name = "create_time")
	private Date createTime;
	
	/**
	 * 数据集ID
	 */
	@Column(name = "dataset_id")
	private Long datasetId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getDictionary() {
		return dictionary;
	}

	public void setDictionary(String dictionary) {
		this.dictionary = dictionary;
	}

	public Integer getSearchFlag() {
		return searchFlag;
	}

	public void setSearchFlag(Integer searchFlag) {
		this.searchFlag = searchFlag;
	}

	public Integer getSearchMode() {
		return searchMode;
	}

	public void setSearchMode(Integer searchMode) {
		this.searchMode = searchMode;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Long getDatasetId() {
		return datasetId;
	}

	public void setDatasetId(Long datasetId) {
		this.datasetId = datasetId;
	}

}
