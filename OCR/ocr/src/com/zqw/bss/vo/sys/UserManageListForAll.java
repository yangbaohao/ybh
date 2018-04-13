package com.zqw.bss.vo.sys;

import com.zqw.bss.framework.model.BaseObject;

public class UserManageListForAll extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id;
	
	private String username;
	
	private String name;
	
	private String roleName;
	
	private String phone;
	
	private String employeeCode;
	
	private Long agentNum;
	
	private Long successNum;
	
	private Long payNum;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Long getAgentNum() {
		return agentNum;
	}

	public void setAgentNum(Long agentNum) {
		this.agentNum = agentNum;
	}

	public Long getSuccessNum() {
		return successNum;
	}

	public void setSuccessNum(Long successNum) {
		this.successNum = successNum;
	}

	public Long getPayNum() {
		return payNum;
	}

	public void setPayNum(Long payNum) {
		this.payNum = payNum;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((agentNum == null) ? 0 : agentNum.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((payNum == null) ? 0 : payNum.hashCode());
		result = prime * result + ((phone == null) ? 0 : phone.hashCode());
		result = prime * result + ((roleName == null) ? 0 : roleName.hashCode());
		result = prime * result + ((successNum == null) ? 0 : successNum.hashCode());
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
		UserManageListForAll other = (UserManageListForAll) obj;
		if (agentNum == null) {
			if (other.agentNum != null)
				return false;
		} else if (!agentNum.equals(other.agentNum))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (payNum == null) {
			if (other.payNum != null)
				return false;
		} else if (!payNum.equals(other.payNum))
			return false;
		if (phone == null) {
			if (other.phone != null)
				return false;
		} else if (!phone.equals(other.phone))
			return false;
		if (roleName == null) {
			if (other.roleName != null)
				return false;
		} else if (!roleName.equals(other.roleName))
			return false;
		if (successNum == null) {
			if (other.successNum != null)
				return false;
		} else if (!successNum.equals(other.successNum))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

	public UserManageListForAll(Long id, String username, String name,  String phone,String employeeCode) {
		super();
		this.id = id;
		this.username = username;
		this.name = name;
//		this.roleName = roleName;
		this.phone = phone;
		this.employeeCode=employeeCode;
	}
	
}
