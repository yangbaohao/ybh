package com.zqw.bss.model.crm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.AccountPeriodStatus;

/**
 * <p>
 * 账期
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
@Table(name = "t_fms_account_period")
public class AccountPeriod extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 5206222485542134729L;

	/**
	 *id
	 */
	private Long id;

	/**
	 *注册用户
	 */
	private Long ownerId;

	/**
	 *账期状态 ： 打开，关闭，反结账
	 */
	private AccountPeriodStatus accountPeriodStatus;

	/**
	 *账期月份 7位 格式为yyyy-MM
	 */
	private String accountPeriodMonth;

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;

	public AccountPeriod() {

	}

	public AccountPeriod(String accountPeriodMonth,
			AccountPeriodStatus accountPeriodStatus) {
		this.accountPeriodMonth=accountPeriodMonth;
		this.accountPeriodStatus=accountPeriodStatus;

	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@JsonIgnore
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	@Enumerated(EnumType.STRING)
	public AccountPeriodStatus getAccountPeriodStatus() {
		return accountPeriodStatus;
	}

	public void setAccountPeriodStatus(AccountPeriodStatus accountPeriodStatus) {
		this.accountPeriodStatus = accountPeriodStatus;
	}

	public String getAccountPeriodMonth() {
		return accountPeriodMonth;
	}

	public void setAccountPeriodMonth(String accountPeriodMonth) {
		this.accountPeriodMonth = accountPeriodMonth;
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
		result = prime
				* result
				+ ((accountPeriodMonth == null) ? 0 : accountPeriodMonth
						.hashCode());
		result = prime
				* result
				+ ((accountPeriodStatus == null) ? 0 : accountPeriodStatus
						.hashCode());
		result = prime * result
				+ ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result
				+ ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result
				+ ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result
				+ ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;

		if (getClass() != obj.getClass())
			return false;
		AccountPeriod other = (AccountPeriod) obj;
		if (accountPeriodMonth == null) {
			if (other.accountPeriodMonth != null)
				return false;
		} else if (!accountPeriodMonth.equals(other.accountPeriodMonth))
			return false;
		if (accountPeriodStatus == null) {
			if (other.accountPeriodStatus != null)
				return false;
		} else if (!accountPeriodStatus.equals(other.accountPeriodStatus))
			return false;
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
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (lastUpdateBy == null) {
			if (other.lastUpdateBy != null)
				return false;
		} else if (!lastUpdateBy.equals(other.lastUpdateBy))
			return false;
		if (lastUpdateDate == null) {
			if (other.lastUpdateDate != null)
				return false;
		} else if (!lastUpdateDate.equals(other.lastUpdateDate))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		return true;
	}

}
