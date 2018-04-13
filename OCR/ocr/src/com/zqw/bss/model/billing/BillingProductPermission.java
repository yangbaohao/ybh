package com.zqw.bss.model.billing;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.mkt.AccountProduct;

/**
 * <p>
 * 付费产品使用权限
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.hp.com
 * </p>
 * 
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0
 */

@Entity
@Table(name = "t_bss_billing_product_permission")
public class BillingProductPermission extends BaseObject {

	private static final long serialVersionUID = -7493377076216847261L;

	/**
	 * 主键id
	 */
	private Long id;
	
	private Long ownerId;

	private AccountProduct accountProduct;
	
	private AccountOrder accountOrder;
	/**
	 * 功能权限
	 */
	private String permission;

	private Date startDate;

	private Date endDate;

	private Date createDate;
	
	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	
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

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@ManyToOne(cascade = CascadeType.ALL, targetEntity = AccountProduct.class, fetch = FetchType.EAGER)
	public AccountProduct getAccountProduct() {
		return accountProduct;
	}

	public void setAccountProduct(AccountProduct accountProduct) {
		this.accountProduct = accountProduct;
	}

	public String getPermission() {
		return permission;
	}
	
	@ManyToOne(cascade ={ CascadeType.PERSIST, CascadeType.REMOVE }, targetEntity = AccountOrder.class)
	@JoinColumn(name = "accountOrder_id")
	public AccountOrder getAccountOrder() {
		return accountOrder;
	}

	public void setAccountOrder(AccountOrder accountOrder) {
		this.accountOrder = accountOrder;
	}

	public void setPermission(String permission) {
		this.permission = permission;
	}
	
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((endDate == null) ? 0 : endDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((permission == null) ? 0 : permission.hashCode());
		result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
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
		BillingProductPermission other = (BillingProductPermission) obj;
		if (endDate == null) {
			if (other.endDate != null)
				return false;
		} else if (!endDate.equals(other.endDate))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (permission == null) {
			if (other.permission != null)
				return false;
		} else if (!permission.equals(other.permission))
			return false;
		if (startDate == null) {
			if (other.startDate != null)
				return false;
		} else if (!startDate.equals(other.startDate))
			return false;
		return true;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

}
