package com.zqw.bss.vo.sys;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class SearchUserListVo extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2894382572555307076L;

	private Long id;
	
	private Long userid;

	private Long useInfoid;

	/**
	 * 用户名
	 */
	private String username;

	/**
	 * 公司名称
	 */
	private String name;

	/**
	 * 电话
	 */
	private String telephone;

	/**
	 * e-mail
	 */
	private String email;

	/**
	 * 角色名
	 */
	private String roleName;
	
	/**
	 * 角色中文名
	 */
	private String roleNameCN;

	/**
	 * 用户状态
	 */
	private Boolean locked;

	/**
	 * 创建者
	 */
	private String createBy;

	/**
	 * 创建时间
	 */
	private Date createDate;

	/**
	 * 员工编号
	 */
	private String userNumber;
	
	private String salutation;
	
	private String customerCode;

	public SearchUserListVo(Long userid, Long useInfoid, String username,
			String name, String telephone, String email, String roleName,
			Boolean locked, String createBy, Date createDate, String userNumber) {
		super();
		this.userid = userid;
		this.useInfoid = useInfoid;
		this.username = username;
		this.name = name;
		this.telephone = telephone;
		this.email = email;
		this.roleName = roleName;
		this.locked = locked;
		this.createBy = createBy;
		this.createDate = createDate;
		this.userNumber = userNumber;
	}

	public SearchUserListVo(Long userid, Long useInfoid, String username,
			String name, String telephone, String email, Boolean locked,
			String createBy, Date createDate, String userNumber,String salutation) {
		super();
		this.userid = userid;
		this.useInfoid = useInfoid;
		this.username = username;
		this.name = name;
		this.telephone = telephone;
		this.email = email;
		this.locked = locked;
		this.createBy = createBy;
		this.createDate = createDate;
		this.userNumber = userNumber;
		this.salutation = salutation;
	}

	public SearchUserListVo() {

	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCustomerCode() {
		return customerCode;
	}

	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}

	public SearchUserListVo(String username,String name,Long id) {
		this.name = name;
		this.username = username;
		this.id = id;
	}
	
	public SearchUserListVo(Long userid, Long useInfoid, String name) {
		super();
		this.userid = userid;
		this.useInfoid = useInfoid;
		this.name = name;
	}
	
	public SearchUserListVo(Long userid, String username) {
		super();
		this.userid = userid;
		this.username = username;
	}

	public SearchUserListVo(Long userid, String roleName, String roleNameCN) {
		super();
		this.userid = userid;
		this.roleName = roleName;
		this.roleNameCN = roleNameCN;
	}

	public String getRoleNameCN() {
		return roleNameCN;
	}

	public void setRoleNameCN(String roleNameCN) {
		this.roleNameCN = roleNameCN;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getUserNumber() {
		return userNumber;
	}

	public String getSalutation() {
		return salutation;
	}

	public void setSalutation(String salutation) {
		this.salutation = salutation;
	}

	public void setUserNumber(String userNumber) {
		this.userNumber = userNumber;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getUserid() {
		return userid;
	}

	public void setUserid(Long userid) {
		this.userid = userid;
	}

	public Long getUseInfoid() {
		return useInfoid;
	}

	public void setUseInfoid(Long useInforid) {
		this.useInfoid = useInforid;
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

	public Boolean getLocked() {
		return locked;
	}

	public void setLocked(Boolean locked) {
		this.locked = locked;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public SearchUserListVo(Object[] rs) {
		this.userid=Long.valueOf(rs[0].toString());
		this.useInfoid=Long.valueOf(rs[1].toString());
		if(rs[2]!=null)
		this.username=(String)rs[2];
		if(rs[3]!=null)
		this.name=(String)rs[3];
		if(rs[4]!=null)
		this.telephone=(String)rs[4];
		if(rs[5]!=null)
		this.email=(String)rs[5];
		if( rs[6].toString().equals("Y"))
			this.locked=true;
		else
			this.locked=false;
		this.createBy=(String)rs[7];
		this.createDate=(Date)rs[8];
		if(rs[9]!=null)
		this.userNumber=(String)rs[9];
		if(rs[10]!=null)
		this.salutation=(String)rs[10];
		if(rs[11]!=null)
			this.roleName=rs[11].toString();
		if(rs[12]!=null)
			this.roleNameCN=rs[12].toString();
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((email == null) ? 0 : email.hashCode());
		result = prime * result + ((locked == null) ? 0 : locked.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((roleName == null) ? 0 : roleName.hashCode());
		result = prime * result + ((roleNameCN == null) ? 0 : roleNameCN.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((useInfoid == null) ? 0 : useInfoid.hashCode());
		result = prime * result + ((userNumber == null) ? 0 : userNumber.hashCode());
		result = prime * result + ((userid == null) ? 0 : userid.hashCode());
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
		SearchUserListVo other = (SearchUserListVo) obj;
		if (createBy == null) {
			if (other.createBy != null)
				return false;
		} else if (!createBy.equals(other.createBy))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (email == null) {
			if (other.email != null)
				return false;
		} else if (!email.equals(other.email))
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
		if (telephone == null) {
			if (other.telephone != null)
				return false;
		} else if (!telephone.equals(other.telephone))
			return false;
		if (useInfoid == null) {
			if (other.useInfoid != null)
				return false;
		} else if (!useInfoid.equals(other.useInfoid))
			return false;
		if (userNumber == null) {
			if (other.userNumber != null)
				return false;
		} else if (!userNumber.equals(other.userNumber))
			return false;
		if (userid == null) {
			if (other.userid != null)
				return false;
		} else if (!userid.equals(other.userid))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

	public SearchUserListVo(String username,Long id, String name) {
		super();
		this.id = id;
		this.username = username;
		this.name = name;
	}
	
}
