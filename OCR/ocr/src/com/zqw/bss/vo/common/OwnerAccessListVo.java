package com.zqw.bss.vo.common;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>Title:</p>
 * <p>Description:用户行为信息--集合</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author wx
 * @date 2016年9月13日 11:52:26
 * @version 1.0
 */

public class OwnerAccessListVo extends BaseObject{


	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 用户id
	 */
	private Long ownerId;
	/**
	 * 用户名
	 */
	private String username;
	/**
	 * 公司名
	 */
	private String name;
	/**
	 * 联系电话
	 */
	private String telephone;
	/**
	 * 注册日期
	 */
	private Date createDate;
	/**
	 * 最早登录时间
	 */
	private Date minCreateDate;
	/**
	 * 最后离开时间
	 */
	private Date maxCreateDate;

	/**
	 * 日志集合
	 */
	private List<AccessVo> accessList;
	
	/**
	 * 使用测试帐号总访问次数
	 */
	private Long loginNum;
	
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public List<AccessVo> getAccessList() {
		return accessList;
	}

	public void setAccessList(List<AccessVo> accessList) {
		this.accessList = accessList;
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

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getMinCreateDate() {
		return minCreateDate;
	}

	public void setMinCreateDate(Date minCreateDate) {
		this.minCreateDate = minCreateDate;
	}

	public Date getMaxCreateDate() {
		return maxCreateDate;
	}

	public void setMaxCreateDate(Date maxCreateDate) {
		this.maxCreateDate = maxCreateDate;
	}

	public Long getLoginNum() {
		return loginNum;
	}

	public void setLoginNum(Long loginNum) {
		this.loginNum = loginNum;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accessList == null) ? 0 : accessList.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((loginNum == null) ? 0 : loginNum.hashCode());
		result = prime * result + ((maxCreateDate == null) ? 0 : maxCreateDate.hashCode());
		result = prime * result + ((minCreateDate == null) ? 0 : minCreateDate.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
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
		OwnerAccessListVo other = (OwnerAccessListVo) obj;
		if (accessList == null) {
			if (other.accessList != null)
				return false;
		} else if (!accessList.equals(other.accessList))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (loginNum == null) {
			if (other.loginNum != null)
				return false;
		} else if (!loginNum.equals(other.loginNum))
			return false;
		if (maxCreateDate == null) {
			if (other.maxCreateDate != null)
				return false;
		} else if (!maxCreateDate.equals(other.maxCreateDate))
			return false;
		if (minCreateDate == null) {
			if (other.minCreateDate != null)
				return false;
		} else if (!minCreateDate.equals(other.minCreateDate))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
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

	public OwnerAccessListVo(Long ownerId, List<AccessVo> accessList) {
		super();
		this.ownerId = ownerId;
		this.accessList = accessList;
	}
	
	public OwnerAccessListVo(Long ownerId, List<AccessVo> accessList, String username, String name, String telephone, Date createDate) {
		super();
		this.ownerId = ownerId;
		this.accessList = accessList;
		this.username = username;
		this.name = name;
		this.telephone = telephone;
		this.createDate = createDate;
	}

	public OwnerAccessListVo(Object[] rs) {
		this.ownerId = Long.valueOf(rs[0].toString());
		this.username = rs[1] == null ? "" : rs[1].toString();
		this.name = rs[2] == null ? "" : rs[2].toString();
		this.telephone = rs[3] == null ? "" : rs[3].toString();
		this.createDate = (Date) rs[4];
		this.minCreateDate = (Date) rs[5];
		this.maxCreateDate = (Date) rs[6];
	}
	
	//添加测试帐号登录信息
	public OwnerAccessListVo(Object[] rs , List<AccessVo> accessList) {
		this.ownerId = rs[0] == null ? null : Long.valueOf(rs[0].toString());
		this.username = rs[1] == null ? "" : rs[1].toString();
		this.telephone = rs[2] == null ? "" : rs[2].toString();
		this.minCreateDate = (Date) rs[3];
		this.maxCreateDate = (Date) rs[4];
		this.loginNum = Long.valueOf(rs[5] == null ? "0" : rs[5].toString());
		this.accessList = accessList;
	}
	
}
