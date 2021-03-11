package com.newtec.report.common.entity.api;

import java.io.Serializable;
import javax.persistence.*;


/**
 * @author 黄腾
 * @Description API数据集 报表参数 实体类
 * @date 2020年12月23日 下午6:18:58
 */
@Entity
@Table(name="t_api_dataset_param")
public class APIDatasetParam implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;

	/**
	 * 默认值
	 */
	@Column(name="default_value")
	private String defaultValue;

	/**
	 * 排序
	 */
	@Column(name="order_num")
	private Integer orderNum;

	/**
	 * 参数
	 */
	@Column(name="name")
	private String name;

	/**
	 * 参数文本
	 */
	@Column(name="remark")
	private String remark;

	@Column(name="dataset_id")
	private Long datasetId;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDefaultValue() {
		return defaultValue;
	}

	public void setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
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

	public Long getDatasetId() {
		return datasetId;
	}

	public void setDatasetId(Long datasetId) {
		this.datasetId = datasetId;
	}

}