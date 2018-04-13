package com.zqw.bss.model.crm;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.TaxProgressType;

@Entity
@Table(name = "t_bss_tax_log")
public class TaxStatusLogs extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id;

	/**
	 * 报税状态
	 */
	private TaxProgressType taxProgressType = TaxProgressType.nodo;

	private Long ownerId;

	/**
	 * 购买模块
	 */
	private String productName;

	/**
	 * 用户名
	 */
	private String username;

	/**
	 * 公司名称
	 */
	private String name;

	/**
	 * 账期
	 */
	private String mouthDate;

	/**
	 * 报税人
	 */
	private String taxer;

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Enumerated(EnumType.STRING)
	public TaxProgressType getTaxProgressType() {
		return taxProgressType;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public void setTaxProgressType(TaxProgressType taxProgressType) {
		this.taxProgressType = taxProgressType;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMouthDate() {
		return mouthDate;
	}

	public void setMouthDate(String mouthDate) {
		this.mouthDate = mouthDate;
	}

	public String getTaxer() {
		return taxer;
	}

	public void setTaxer(String taxer) {
		this.taxer = taxer;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	public String getLastUpdateBy() {
		return lastUpdateBy;
	}

	public void setLastUpdateBy(String lastUpdateBy) {
		this.lastUpdateBy = lastUpdateBy;
	}

	@Override
	public boolean equals(Object arg0) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return 0;
	}

}
