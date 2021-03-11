package com.newtec.report.common.entity.report;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;


/**
 * @author 朱才富
 * @Description 报表配置实体类
 * @date 2020年12月19日 19:01
 */
@Entity
@Table(name = "t_report_config")
public class ReportConfig implements Serializable {

	/**
     * 主键
     */
    @Id
    private Long id;

    /**
     * 配置
     */
    private String config;
    
    public ReportConfig() {
		super();
	}
    
    public ReportConfig(Long id, String config) {
		super();
		this.id = id;
		this.config = config;
	}

	public void setId(Long id){
        this.id = id;
    }

    public Long getId(){
        return this.id;
    }

	public String getConfig() {
		return config;
	}

	public void setConfig(String config) {
		this.config = config;
	}

}