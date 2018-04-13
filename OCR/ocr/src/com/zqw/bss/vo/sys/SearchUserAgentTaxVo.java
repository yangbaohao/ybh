package com.zqw.bss.vo.sys;

import com.zqw.bss.framework.model.BaseObject;

public class SearchUserAgentTaxVo extends BaseObject{
	/**
	 * Id
	 */
	private Long id;
	/**
	 * 员工编号
	 */
	private String employeeCode;
	/**
	 * 用户名
	 */
	private String username;
	/**
	 * 姓名
	 */
	private String name;
	
	/**
	 * 联系电话
	 */
	private String telephone;
	/**
	 * 职位
	 */
	private String title;
	
	/**
	 * 负责客人数量
	 */
	private int ownerNum;
	/**
	 * 用户状态
	 */
	private Boolean locked;
	
	/**
	 * 员工号 5位
	 */
	private String parentEmployeeCode;
	
	
	
	public String getParentEmployeeCode() {
		return parentEmployeeCode;
	}
	public void setParentEmployeeCode(String parentEmployeeCode) {
		this.parentEmployeeCode = parentEmployeeCode;
	}
	public SearchUserAgentTaxVo() {
		super();
		// TODO Auto-generated constructor stub
	}
	public SearchUserAgentTaxVo(Object[] ob) {
		this.id= Long.valueOf(ob[0].toString());
		this.employeeCode=(String) ob[1];
		this.username=(String) ob[2];
		this.name=(String) ob[3];
		this.telephone=(String) ob[4];
		this.title=(String) ob[5];
		this.ownerNum= ob[6] == null ? 0 : Integer.valueOf(ob[6].toString());
		if(ob[7].toString().equals("Y")){
			this.setLocked(Boolean.TRUE);
		}else{
			this.setLocked(Boolean.FALSE);
		}
		this.parentEmployeeCode=(String) ob[8];
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getEmployeeCode() {
		return employeeCode;
	}
	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
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
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((employeeCode == null) ? 0 : employeeCode.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((locked == null) ? 0 : locked.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ownerNum;
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((title == null) ? 0 : title.hashCode());
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
		SearchUserAgentTaxVo other = (SearchUserAgentTaxVo) obj;
		if (employeeCode == null) {
			if (other.employeeCode != null)
				return false;
		} else if (!employeeCode.equals(other.employeeCode))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (locked == null) {
			if (other.locked != null)
				return false;
		} else if (!locked.equals(other.locked))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (ownerNum != other.ownerNum)
			return false;
		if (telephone == null) {
			if (other.telephone != null)
				return false;
		} else if (!telephone.equals(other.telephone))
			return false;
		if (title == null) {
			if (other.title != null)
				return false;
		} else if (!title.equals(other.title))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public int getOwnerNum() {
		return ownerNum;
	}
	public void setOwnerNum(int ownerNum) {
		this.ownerNum = ownerNum;
	}
	public Boolean getLocked() {
		return locked;
	}
	public void setLocked(Boolean locked) {
		this.locked = locked;
	}
	
}
