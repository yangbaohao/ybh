package com.zqw.bss.vo.sys;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class PartnerOwnerForListVo extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id;
	
	/**
	 * 公司名称
	 */
	private String name;
	
	/**
	 * 用户名
	 */
	private String username;
	
	/**
	 * 电话
	 */
	private String telephone;
	
	/**
	 * 日期
	 */
	private Date enrtyDate;
	
	/**
	 * 合作商编码
	 */
	private String partnerCode;
	
	/**
	 * 合作商名称
	 */
	private String partnarName;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public Date getEnrtyDate() {
		return enrtyDate;
	}

	public void setEnrtyDate(Date enrtyDate) {
		this.enrtyDate = enrtyDate;
	}

	public String getPartnerCode() {
		return partnerCode;
	}

	public void setPartnerCode(String partnerCode) {
		this.partnerCode = partnerCode;
	}

	public String getPartnarName() {
		return partnarName;
	}

	public void setPartnarName(String partnarName) {
		this.partnarName = partnarName;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((enrtyDate == null) ? 0 : enrtyDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((partnarName == null) ? 0 : partnarName.hashCode());
		result = prime * result + ((partnerCode == null) ? 0 : partnerCode.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PartnerOwnerForListVo other = (PartnerOwnerForListVo) obj;
		if (enrtyDate == null) {
			if (other.enrtyDate != null)
				return false;
		} else if (!enrtyDate.equals(other.enrtyDate))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (partnarName == null) {
			if (other.partnarName != null)
				return false;
		} else if (!partnarName.equals(other.partnarName))
			return false;
		if (partnerCode == null) {
			if (other.partnerCode != null)
				return false;
		} else if (!partnerCode.equals(other.partnerCode))
			return false;
		if (telephone == null) {
			if (other.telephone != null)
				return false;
		} else if (!telephone.equals(other.telephone))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

	public PartnerOwnerForListVo(Long id,String name, String username, String telephone, Date enrtyDate, String partnerCode,
			String partnarName) {
		super();
		this.id = id;
		this.name = name;
		this.username = username;
		this.telephone = telephone;
		this.enrtyDate = enrtyDate;
		this.partnerCode = partnerCode;
		this.partnarName = partnarName;
	}

	public PartnerOwnerForListVo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public PartnerOwnerForListVo(Long id,Date enrtyDate,String username,String telephone,String name) {
		this.id=id;
		this.enrtyDate=enrtyDate;
		this.username=username;
		this.telephone=telephone;
		this.name=name;
	}
	
}
