package com.zqw.bss.model.biz;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zqw.bss.framework.model.BaseObject;

@Entity
@Table(name = "t_ocr_loginIp")
public  class LoginIp extends BaseObject {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String ipContent;
	private String ipUser;
	private String remark;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getIpContent() {
		return ipContent;
	}
	public void setIpContent(String ipContent) {
		this.ipContent = ipContent;
	}
	public String getIpUser() {
		return ipUser;
	}
	public void setIpUser(String ipUser) {
		this.ipUser = ipUser;
	}
	
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((ipContent == null) ? 0 : ipContent.hashCode());
		result = prime * result + ((ipUser == null) ? 0 : ipUser.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
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
		LoginIp other = (LoginIp) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (ipContent == null) {
			if (other.ipContent != null)
				return false;
		} else if (!ipContent.equals(other.ipContent))
			return false;
		if (ipUser == null) {
			if (other.ipUser != null)
				return false;
		} else if (!ipUser.equals(other.ipUser))
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		return true;
	}
	
	
	
}
