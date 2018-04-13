package com.zqw.bss.vo.crm;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>Title:</p>
 * <p>Description:注册展示信息</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author lzy
 * @date 2016年7月14日 上午10:03:33
 * @version 1.0
 */

public class OwnerInfoVo extends BaseObject{

	private static final long serialVersionUID = 2174790970815554270L;
	
	/**
	 * 用户名
	 */
	private String username;
	/**
	 * 公司名称
	 */
	private String name;
	/**
	 * 邮箱
	 */
	private String email;
	/**
	 * 手机号码
	 */
	private String telephone;
	/**
	 * 时间(账目启用月)
	 */
	private String accountPeriodMonth;
	/**
	 * 注册日期
	 */
	private Date lastUpdateDate;
		
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getAccountPeriodMonth() {
		return accountPeriodMonth;
	}
	public void setAccountPeriodMonth(String accountPeriodMonth) {
		this.accountPeriodMonth = accountPeriodMonth;
	}
	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}
	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	
	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		OwnerInfoVo objVo = (OwnerInfoVo) obj;
		if (username == null) {
			if (objVo.username != null)
				return false;
		} else if (!username.equals(objVo.username))
			return false;
		if (name == null) {
			if (objVo.name != null)
				return false;
		} else if (!name.equals(objVo.name))
			return false;
		if (email == null) {
			if (objVo.email != null)
				return false;
		} else if (!email.equals(objVo.email))
			return false;
		if (telephone == null) {
			if (objVo.telephone != null)
				return false;
		} else if (!telephone.equals(objVo.telephone))
			return false;
		if (accountPeriodMonth == null) {
			if (objVo.accountPeriodMonth != null)
				return false;
		} else if (!accountPeriodMonth.equals(objVo.accountPeriodMonth))
			return false;
		if (lastUpdateDate == null) {
			if (objVo.lastUpdateDate != null)
				return false;
		} else if (!lastUpdateDate.equals(objVo.lastUpdateDate))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		final int prime = 31;
		int result = 1;
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((email == null) ? 0 : email.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((accountPeriodMonth == null) ? 0 : accountPeriodMonth.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		return result;
	}
	
	public OwnerInfoVo(String username, String name, String email, String telephone, String accountPeriodMonth, Date lastUpdateDate) {
		super();
		this.username = username;
		this.name = name;
		this.email = email;
		this.telephone = telephone;
		this.accountPeriodMonth = accountPeriodMonth;
		this.lastUpdateDate = lastUpdateDate;
	}
	
}
