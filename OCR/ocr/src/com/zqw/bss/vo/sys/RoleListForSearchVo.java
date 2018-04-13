package com.zqw.bss.vo.sys;

import com.zqw.bss.framework.model.BaseObject;

public class RoleListForSearchVo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id;
	
	private String roleName;
	
	private String roleNameCN;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getRoleNameCN() {
		return roleNameCN;
	}

	public void setRoleNameCN(String roleNameCN) {
		this.roleNameCN = roleNameCN;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((roleName == null) ? 0 : roleName.hashCode());
		result = prime * result + ((roleNameCN == null) ? 0 : roleNameCN.hashCode());
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
		RoleListForSearchVo other = (RoleListForSearchVo) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (roleName == null) {
			if (other.roleName != null)
				return false;
		} else if (!roleName.equals(other.roleName))
			return false;
		if (roleNameCN == null) {
			if (other.roleNameCN != null)
				return false;
		} else if (!roleNameCN.equals(other.roleNameCN))
			return false;
		return true;
	}

	public RoleListForSearchVo(Long id, String roleName, String roleNameCN) {
		super();
		this.id = id;
		this.roleName = roleName;
		this.roleNameCN = roleNameCN;
	}
	
}
