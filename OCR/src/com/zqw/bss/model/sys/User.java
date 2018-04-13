package com.zqw.bss.model.sys;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.crm.EnterpriseInfo;
import com.zqw.bss.model.crm.UserInfo;
import com.zqw.bss.util.AutoValueIgnore;

/**
 * <p>
 * 系统用户
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
@Table(name = "t_bss_sys_user", uniqueConstraints = { @UniqueConstraint(columnNames = { "ownerId", "employeeCode" }) })
public class User extends BaseObject {

	private static final long serialVersionUID = -74307389726940061L;

	/**
	 * id
	 */
	private Long id;

	/**
	 * ownerId
	 */
	private Long ownerId;

	/**
	 * 员工编号
	 */
	private Long userNumber;

	/**
	 * 用户基本信息
	 */
	private UserInfo userInfo;

	/**
	 * 用户名
	 */
	private String username;

	/**
	 * 密码
	 */
	private String password;
	private String oldPassword;

	private Organization organization;

	/**
	 * 角色列表
	 */
	private List<Role> roles = new ArrayList<Role>();

	/**
	 * 用户状态
	 */
	private Boolean locked = Boolean.FALSE;

	/**
	 * 员工号 5位
	 */
	private String employeeCode;

	/**
	 * 员工号 5位
	 */
	private String parentEmployeeCode;

	/**
	 * 对接客服的ID
	 */
	private String proxyId;
	
	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;

	private String valid;
	/**
	 * 对接人
	 */
	private User docking;
	/**
	 * 开户银行 
	 */
	private String openBank;
	/**
	 * 银行账号 
	 */
	private String bankAccount;
	
	/**
	 * 成功客户
	 */
	private Long client;
	
	/**
	 * 强制分配销售
	 */
	private String distributionEmployeeCode;
	
	/**
	 * 强制分配客服
	 */
	private String distributionCustomerEmployeeCode;
	

	
	
	public String getDistributionCustomerEmployeeCode() {
		return distributionCustomerEmployeeCode;
	}

	public void setDistributionCustomerEmployeeCode(String distributionCustomerEmployeeCode) {
		this.distributionCustomerEmployeeCode = distributionCustomerEmployeeCode;
	}

	public String getProxyId() {
		return proxyId;
	}

	public void setProxyId(String proxyId) {
		this.proxyId = proxyId;
	}

	@Transient
	public Long getClient() {
		return client;
	}

	public void setClient(Long client) {
		this.client = client;
	}

	public String getOpenBank() {
		return openBank;
	}

	public void setOpenBank(String openBank) {
		this.openBank = openBank;
	}

	public String getBankAccount() {
		return bankAccount;
	}

	public void setBankAccount(String bankAccount) {
		this.bankAccount = bankAccount;
	}
	@AutoValueIgnore
	@ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
	public User getDocking() {
		return docking;
	}

	public void setDocking(User docking) {
		this.docking = docking;
	}

	public User(Object id, Object createDate, Object employeeCode, Object username, Object name, Object telephone, Object client, Object docking) {
		this.id=Long.valueOf(id+"");
		this.createDate=(Date) createDate;
		this.employeeCode=(String) employeeCode;
		this.username=(String) username;
		EnterpriseInfo info =new EnterpriseInfo();
		info.setName((String) name);
		info.setTelephone((String) telephone);
		this.userInfo=info;
		User docking2 = new User();
		docking2.setUsername((String) docking);
		this.docking=docking2;
		this.client=Long.valueOf(client+"");
	};


	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
	public User(String username, String password, UserInfo userInfo) {
		this.username = username;
		this.password = password;
		this.createBy = username;
		this.createDate = new Date();
		this.lastUpdateBy = username;
		this.lastUpdateDate = new Date();
		this.userInfo = userInfo;
	}
	
	public User(long id,String username) {
		this.id=id;
		this.username=username;
	};
	public User(long id,String username,String name) {
		this.id=id;
		this.username=username;
		EnterpriseInfo info =new EnterpriseInfo();
		info.setName(name);;
		this.userInfo=info;
	};
//	public User(Long client) {
////		this.id=user.getId();
////		this.createDate=user.getCreateDate();
////		this.employeeCode=user.getEmployeeCode();
////		this.username=user.getUsername();
////		this.userInfo.setName(user.getUserInfo().getName());
////		this.userInfo.setTelephone(user.getUserInfo().getTelephone());
//		this.client=client;
////		this.docking.setUsername(user.getDocking().getUsername());
//	};
	public User(User user,Long client) {
		this.id=user.getId();
		this.createDate=user.getCreateDate();
		this.employeeCode=user.getEmployeeCode();
		this.username=user.getUsername();
		this.userInfo=user.getUserInfo();
		this.docking=user.getDocking();
		this.client=client;
	};



	public User(Object[] array) {
		this.setId(((BigInteger) array[0]).longValue());
		this.setUsername((String) array[1]);
		this.setEmployeeCode((String) array[2]);
		if (array.length == 4) {
			if (array[3].toString().equals("Y")) {
				this.setLocked(Boolean.TRUE);
			} else {
				this.setLocked(Boolean.FALSE);
			}
		}
	}
	public User(Object obj, Object[] array) {
		this.setId(((BigInteger) array[0]).longValue());
		this.setUsername(obj+"("+ array[1]+")");
		this.setEmployeeCode((String) array[3]);
		if (array.length == 5) {
			if (array[4].toString().equals("Y")) {
				this.setLocked(Boolean.TRUE);
			} else {
				this.setLocked(Boolean.FALSE);
			}
		}
	}
	public User(Object[] array,String obj) {
		this.setId(((BigInteger) array[0]).longValue());
		this.setUsername((String) array[1]);
		this.setEmployeeCode((String) array[2]);
		EnterpriseInfo info =new EnterpriseInfo();
		info.setName(obj);
		this.setUserInfo(info);
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserNumber() {
		return userNumber;
	}

	public void setUserNumber(Long userNumber) {
		this.userNumber = userNumber;
	}

	@Column(nullable = false, updatable = false)
	public Date getCreateDate() {
		return createDate;
	}

	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "t_bss_userrole_info", joinColumns = { @JoinColumn(name = "userid") }, inverseJoinColumns = {
			@JoinColumn(name = "roleid") })
	public List<Role> getRoles() {
		return roles;
	}

	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}

	@Column(nullable = false, unique = true)
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(nullable = false)
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@JsonIgnore
	@Transient
	public String getOldPassword() {
		return oldPassword;
	}

	public void setOldPassword(String oldPassword) {
		this.oldPassword = oldPassword;
	}

	@ManyToOne(targetEntity = Organization.class, fetch = FetchType.LAZY)
	public Organization getOrganization() {
		return organization;
	}

	public void setOrganization(Organization organization) {
		this.organization = organization;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getLocked() {
		return locked;
	}

	public void setLocked(Boolean locked) {
		this.locked = locked;
	}

	@ManyToOne(cascade = { CascadeType.PERSIST,
			CascadeType.MERGE }, targetEntity = UserInfo.class, fetch = FetchType.EAGER)
	public UserInfo getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
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

	public String getParentEmployeeCode() {
		return parentEmployeeCode;
	}

	public void setParentEmployeeCode(String parentEmployeeCode) {
		this.parentEmployeeCode = parentEmployeeCode;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	@Transient
	public String getValid() {
		return valid;
	}

	public void setValid(String valid) {
		this.valid = valid;
	}
	
	

	

	public String getDistributionEmployeeCode() {
		return distributionEmployeeCode;
	}

	public void setDistributionEmployeeCode(String distributionEmployeeCode) {
		this.distributionEmployeeCode = distributionEmployeeCode;
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", username=" + username + ", password=" + password + " , roles=" + roles
				+ ", locked=" + locked + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((locked == null) ? 0 : locked.hashCode());
		result = prime * result + ((password == null) ? 0 : password.hashCode());
		result = prime * result + ((roles == null) ? 0 : roles.hashCode());
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
		User other = (User) obj;
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
		if (password == null) {
			if (other.password != null)
				return false;
		} else if (!password.equals(other.password))
			return false;
		if (roles == null) {
			if (other.roles != null)
				return false;
		} else if (!roles.equals(other.roles))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

	public User(Object id, String username, String employeeCode, Object telephone,Object distributionEmployeeCode,Object name) {
		this.id = Long.valueOf(id+"");
		this.username = username;
		this.employeeCode = employeeCode;
		EnterpriseInfo info =new EnterpriseInfo();
		info.setTelephone((String) telephone);
		info.setName((String)name);
		this.userInfo=info;
		if (distributionEmployeeCode==null) {
			this.distributionEmployeeCode="";
		}else{
			this.distributionEmployeeCode=(String) distributionEmployeeCode;
		}
	}

	public User(Object[] array, Object username, Object employeeCode, String name) {
		this.setId(((BigInteger) array[0]).longValue());
		this.username=(String) username;
		this.employeeCode=(String) employeeCode;
		EnterpriseInfo info =new EnterpriseInfo();
		info.setName(name);
		this.userInfo=info;
	}

	public User(Object object, String string, String string2, Object object2, Object object3, Object object4,
			String string3) {
		this.id = Long.valueOf(object+"");
		this.username=string;
		this.employeeCode=string2;
		EnterpriseInfo info =new EnterpriseInfo();
		info.setTelephone((String) object2);
		this.userInfo=info;
		this.distributionEmployeeCode=(String) object3;
		this.distributionCustomerEmployeeCode=(String) object4;

	}
	
	

}
