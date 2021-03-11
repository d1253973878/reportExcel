package com.newtec.report.common.entity.api;

import java.io.Serializable;
import javax.persistence.*;

/**
 * @author 黄腾
 * @Description API 数据集 动态报表配置明细 实体类
 * @date 2020年12月23日 下午6:19:32
 */
@Entity
@Table(name = "t_api_dataset_field")
public class APIDatasetField implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String id;

	/**
	 * 字典
	 */
	@Column(name = "dictionary")
	private String dictionary;

	/**
	 * 字段名
	 */
	@Column(name = "name")
	private String name;

	/**
	 * 字段文本
	 */
	@Column(name = "remark")
	private String remark;

	/**
	 * 字段类型 0 数值类型 1 字符类型 2 日期类型 3 时间类型
	 */
	@Column(name = "type")
	private Integer type;

	/**
	 * 字段排序
	 */
	@Column(name = "order_num")
	private Integer orderNum;

	/**
	 * 是否查询 0 否 1 是 默认0
	 */
	@Column(name = "search_flag")
	private Integer searchFlag;

	/**
	 * 查询模式 0 单条件查询 1 范围查询 2 多选查询
	 */
	@Column(name = "search_mode")
	private Integer searchMode;

	@Column(name = "dataset_id")
	private Long datasetId;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDictionary() {
		return dictionary;
	}

	public void setDictionary(String dictionary) {
		this.dictionary = dictionary;
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

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
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

	public Long getDatasetId() {
		return datasetId;
	}

	public void setDatasetId(Long datasetId) {
		this.datasetId = datasetId;
	}

}