package com.zqw.bss.model.sys;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.AutoValueIgnore;

/**
 * <p>
 * 角色
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */

@Entity
@Table(name = "t_bss_sys_role_info")
public class Role extends BaseObject {

	private static final long serialVersionUID = 4022748892832828779L;

	/**
	 * id
	 */
	private Long id;

	/**
	 * 角色名称
	 */
	private String roleName;

	/**
	 * 角色名称中文
	 */
	private String roleNameCN;

	/**
	 * 角色描述
	 */
	private String description;

	/**
	 * 角色资源列表
	 */
	private List<Resource> resources = new ArrayList<Resource>();

	/**
	 * 角色状态
	 */
	private Boolean available = Boolean.FALSE;

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

	@Column(nullable = false)
	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getRoleNameCN() {
		return roleNameCN;
	}

	public void setRoleNameCN(String roleNameCN) {
		this.roleNameCN = roleNameCN;
	}

	@AutoValueIgnore
	@ManyToMany
	@JoinTable(name = "t_bss_roleresource_info", joinColumns = { @JoinColumn(name = "roleid") }, inverseJoinColumns = {
			@JoinColumn(name = "resourceid") })
	@OrderBy("level,indexNum")
	@BatchSize(size = 50)
	public List<Resource> getResources() {
		return resources;
	}

	public void setResources(List<Resource> resources) {
		this.resources = resources;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}

	@Column(nullable = false, updatable = false)
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@Column(nullable = false, updatable = false)
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
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((available == null) ? 0 : available.hashCode());
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((resources == null) ? 0 : resources.hashCode());
		result = prime * result + ((roleName == null) ? 0 : roleName.hashCode());
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
		Role other = (Role) obj;
		if (available == null) {
			if (other.available != null)
				return false;
		} else if (!available.equals(other.available))
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (resources == null) {
			if (other.resources != null)
				return false;
		} else if (!resources.equals(other.resources))
			return false;
		if (roleName == null) {
			if (other.roleName != null)
				return false;
		} else if (!roleName.equals(other.roleName))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Role [id=" + id + ", role=" + roleName + ", description=" + description + ", resources=" + resources
				+ ", available=" + available + "]";
	}

}
