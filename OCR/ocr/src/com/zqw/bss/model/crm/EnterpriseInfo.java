package com.zqw.bss.model.crm;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.util.AutoValueIgnore;

/**
 * <p>
 * 企业信息
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * 
 * 
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0
 */
@Entity
@Table(name = "t_crm_enterprise_info")
@PrimaryKeyJoinColumn(name = "id")
public class EnterpriseInfo extends UserInfo {

	private static final long serialVersionUID = 8463188804870965439L;

	/**
	 * 法人姓名
	 */
	private String legalPerson;
	/**
	 * 税号
	 */
	private String taxCode;
	/**
	 * 营业执照
	 */
	private String businessCode;
	/**
	 * 简称
	 */
	private String shortName;

	/**
	 * 传真
	 */
	private String fax;

	/**
	 * 单位属性
	 */
	private String enterpriseType;

	/**
	 * 经营范围
	 */
	private String enterpriseBiz;

	/**
	 * 邮政编码
	 */
	private String zipCode;
	/**
	 * 服务信息
	 */
	private String serviceInfo;
	/**
	 * 注册时间
	 */
	private Date registerTime;
	/**
	 * 企业联系人
	 */
	private List<PersonInfo> personInfos = new ArrayList<PersonInfo>();

	public String getLegalPerson() {
		return legalPerson;
	}

	public void setLegalPerson(String legalPerson) {
		this.legalPerson = legalPerson;
	}

	public String getBusinessCode() {
		return businessCode;
	}

	public void setBusinessCode(String businessCode) {
		this.businessCode = businessCode;
	}

	public String getZipCode() {
		return zipCode;
	}

	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}

	public String getServiceInfo() {
		return serviceInfo;
	}

	public void setServiceInfo(String serviceInfo) {
		this.serviceInfo = serviceInfo;
	}

	public Date getRegisterTime() {
		return registerTime;
	}

	public void setRegisterTime(Date registerTime) {
		this.registerTime = registerTime;
	}

	@AutoValueIgnore
	@OneToMany(cascade = { CascadeType.PERSIST }, fetch = FetchType.EAGER)
	@JoinColumn(name = "enterpriseInfo_id")
	@BatchSize(size = 50)
	public List<PersonInfo> getPersonInfos() {
		return personInfos;
	}

	public void setPersonInfos(List<PersonInfo> personInfos) {
		this.personInfos = personInfos;
	}

	public String getTaxCode() {
		return taxCode;
	}

	public void setTaxCode(String taxCode) {
		this.taxCode = taxCode;
	}

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getEnterpriseType() {
		return enterpriseType;
	}

	public void setEnterpriseType(String enterpriseType) {
		this.enterpriseType = enterpriseType;
	}

	public String getEnterpriseBiz() {
		return enterpriseBiz;
	}

	public void setEnterpriseBiz(String enterpriseBiz) {
		this.enterpriseBiz = enterpriseBiz;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		EnterpriseInfo other = (EnterpriseInfo) obj;
		if (enterpriseBiz == null) {
			if (other.enterpriseBiz != null)
				return false;
		} else if (!enterpriseBiz.equals(other.enterpriseBiz))
			return false;
		if (enterpriseType == null) {
			if (other.enterpriseType != null)
				return false;
		} else if (!enterpriseType.equals(other.enterpriseType))
			return false;
		if (registerTime == null) {
			if (other.registerTime != null)
				return false;
		} else if (!registerTime.equals(other.registerTime))
			return false;
		if (serviceInfo == null) {
			if (other.serviceInfo != null)
				return false;
		} else if (!serviceInfo.equals(other.serviceInfo))
			return false;
		if (zipCode == null) {
			if (other.zipCode != null)
				return false;
		} else if (!zipCode.equals(other.zipCode))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + ((enterpriseBiz == null) ? 0 : enterpriseBiz.hashCode());
		result = prime * result + ((enterpriseType == null) ? 0 : enterpriseType.hashCode());
		result = prime * result + ((registerTime == null) ? 0 : registerTime.hashCode());
		result = prime * result + ((serviceInfo == null) ? 0 : serviceInfo.hashCode());
		result = prime * result + ((zipCode == null) ? 0 : zipCode.hashCode());
		return result;
	}
}
