package com.zqw.bss.vo.common;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class OwnerListVo extends BaseObject{
		
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String username;
	
	private String name;
	
	private String telephone;
	
	/**
	 * 用户id
	 */
	private Long id;
	/**
	 * 注册日期
	 */
	private Date createDate;
	/**
	 * 销售人id
	 */
	private Long salesId;

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

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Long getSalesId() {
		return salesId;
	}

	public void setSalesId(Long salesId) {
		this.salesId = salesId;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((salesId == null) ? 0 : salesId.hashCode());
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
		OwnerListVo other = (OwnerListVo) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
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
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (salesId == null) {
			if (other.salesId != null)
				return false;
		} else if (!salesId.equals(other.salesId))
			return false;
		return true;
	}

	public OwnerListVo(String username, String name, String telephone) {
		super();
		this.username = username;
		this.name = name;
		this.telephone = telephone;
	}
	
	public OwnerListVo(Long id, String username, String name, String telephone, Date createDate, Long salesId ) {
		super();
		this.id = id;
		this.username = username;
		this.name = name;
		this.telephone = telephone;
		this.createDate = createDate;
		this.salesId = salesId;
	}
}
