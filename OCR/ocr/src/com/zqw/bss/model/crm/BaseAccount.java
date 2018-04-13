package com.zqw.bss.model.crm;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>
 * 应付，应收统计物化基础类
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@MappedSuperclass
@Inheritance(strategy = InheritanceType.TABLE_PER_CLASS)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")
@JsonSubTypes( {
		@JsonSubTypes.Type(name = "client", value = ClientAccount.class) })
public abstract class BaseAccount extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8853988480355462030L;

	/**
	 *id
	 */
	private Long id;

	/**
	 *注册用户ID
	 */
	private Long ownerId;

	/**
	 *报价总额
	 */
	private BigDecimal quotationAmt = new BigDecimal(0);

	/**
	 *销售总额
	 */
	private BigDecimal salesOrderAmt = new BigDecimal(0);

	/**
	 *预收总额
	 */
	private BigDecimal salesPrePaidAmt = new BigDecimal(0);

	/**
	 *未送货总额
	 */
	private BigDecimal salesNotDoneAmt = new BigDecimal(0);

	/**
	 *应收总额
	 */
	private BigDecimal salesPayableAmt = new BigDecimal(0);

	/**
	 *逾期应收总额
	 */
	private BigDecimal salesDuePayableAmt = new BigDecimal(0);

	/**
	 *已收款总额
	 */
	private BigDecimal salesOrderPaidAmt = new BigDecimal(0);
	/**
	 *采购总额
	 */
	private BigDecimal purchaseOrderAmt = new BigDecimal(0);

	/**
	 *预付总额
	 */
	private BigDecimal purchasePrePaidAmt = new BigDecimal(0);

	/**
	 *收货总额
	 */
	private BigDecimal purchaseNotDoneAmt = new BigDecimal(0);

	/**
	 *应付总额
	 */
	private BigDecimal purchasePayableAmt = new BigDecimal(0);
	/**
	 *逾期应付总额
	 */
	private BigDecimal purchaseDuePayableAmt = new BigDecimal(0);
	/**
	 *已付总额
	 */
	private BigDecimal purchaseOrderPaidAmt = new BigDecimal(0);

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

	@JsonIgnore
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	@Column(scale=2)
	public BigDecimal getQuotationAmt() {
		return quotationAmt;
	}

	public void setQuotationAmt(BigDecimal quotationAmt) {
		this.quotationAmt = quotationAmt;
	}

	@Column(scale=2)
	public BigDecimal getSalesPrePaidAmt() {
		return salesPrePaidAmt;
	}

	public void setSalesPrePaidAmt(BigDecimal salesPrePaidAmt) {
		this.salesPrePaidAmt = salesPrePaidAmt;
	}

	@Column(scale=2)
	public BigDecimal getSalesPayableAmt() {
		return salesPayableAmt;
	}

	public void setSalesPayableAmt(BigDecimal salesPayableAmt) {
		this.salesPayableAmt = salesPayableAmt;
	}

	@Column(scale=2)
	public BigDecimal getSalesDuePayableAmt() {
		return salesDuePayableAmt;
	}

	public void setSalesDuePayableAmt(BigDecimal salesDuePayableAmt) {
		this.salesDuePayableAmt = salesDuePayableAmt;
	}

	@Column(scale=2)
	public BigDecimal getSalesNotDoneAmt() {
		return salesNotDoneAmt;
	}

	public void setSalesNotDoneAmt(BigDecimal salesNotDoneAmt) {
		this.salesNotDoneAmt = salesNotDoneAmt;
	}

	@Column(scale=2)
	public BigDecimal getSalesOrderPaidAmt() {
		return salesOrderPaidAmt;
	}

	public void setSalesOrderPaidAmt(BigDecimal salesOrderPaidAmt) {
		this.salesOrderPaidAmt = salesOrderPaidAmt;
	}

	@Column(scale=2)
	public BigDecimal getPurchaseOrderAmt() {
		return purchaseOrderAmt;
	}

	public void setPurchaseOrderAmt(BigDecimal purchaseOrderAmt) {
		this.purchaseOrderAmt = purchaseOrderAmt;
	}

	@Column(scale=2)
	public BigDecimal getPurchasePrePaidAmt() {
		return purchasePrePaidAmt;
	}

	public void setPurchasePrePaidAmt(BigDecimal purchasePrePaidAmt) {
		this.purchasePrePaidAmt = purchasePrePaidAmt;
	}

	@Column(scale=2)
	public BigDecimal getPurchasePayableAmt() {
		return purchasePayableAmt;
	}

	public void setPurchasePayableAmt(BigDecimal purchasePayableAmt) {
		this.purchasePayableAmt = purchasePayableAmt;
	}

	@Column(scale=2)
	public BigDecimal getPurchaseNotDoneAmt() {
		return purchaseNotDoneAmt;
	}

	public void setPurchaseNotDoneAmt(BigDecimal purchaseNotDoneAmt) {
		this.purchaseNotDoneAmt = purchaseNotDoneAmt;
	}

	@Column(scale=2)
	public BigDecimal getPurchaseDuePayableAmt() {
		return purchaseDuePayableAmt;
	}

	public void setPurchaseDuePayableAmt(BigDecimal purchaseDuePayableAmt) {
		this.purchaseDuePayableAmt = purchaseDuePayableAmt;
	}

	@Column(scale=2)
	public BigDecimal getSalesOrderAmt() {
		return salesOrderAmt;
	}

	public void setSalesOrderAmt(BigDecimal salesOrderAmt) {
		this.salesOrderAmt = salesOrderAmt;
	}

	@Column(scale=2)
	public BigDecimal getPurchaseOrderPaidAmt() {
		return purchaseOrderPaidAmt;
	}

	public void setPurchaseOrderPaidAmt(BigDecimal purchaseOrderPaidAmt) {
		this.purchaseOrderPaidAmt = purchaseOrderPaidAmt;
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
		result = prime * result
				+ ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result
				+ ((createDate == null) ? 0 : createDate.hashCode());

		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result
				+ ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result
				+ ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result
				+ ((salesNotDoneAmt == null) ? 0 : salesNotDoneAmt.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime
				* result
				+ ((purchasePayableAmt == null) ? 0 : purchasePayableAmt
						.hashCode());
		result = prime
				* result
				+ ((purchasePrePaidAmt == null) ? 0 : purchasePrePaidAmt
						.hashCode());

		result = prime
				* result
				+ ((purchaseOrderAmt == null) ? 0 : purchaseOrderAmt.hashCode());
		result = prime
				* result
				+ ((purchaseOrderPaidAmt == null) ? 0 : purchaseOrderPaidAmt
						.hashCode());
		result = prime * result
				+ ((quotationAmt == null) ? 0 : quotationAmt.hashCode());

		result = prime
				* result
				+ ((salesOrderPaidAmt == null) ? 0 : salesOrderPaidAmt
						.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;

		if (getClass() != obj.getClass())
			return false;
		BaseAccount other = (BaseAccount) obj;
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
		if (salesNotDoneAmt == null) {
			if (other.salesNotDoneAmt != null)
				return false;
		} else if (!salesNotDoneAmt.equals(other.salesNotDoneAmt))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (purchasePayableAmt == null) {
			if (other.purchasePayableAmt != null)
				return false;
		} else if (!purchasePayableAmt.equals(other.purchasePayableAmt))
			return false;
		if (purchasePrePaidAmt == null) {
			if (other.purchasePrePaidAmt != null)
				return false;
		} else if (!purchasePrePaidAmt.equals(other.purchasePrePaidAmt))
			return false;

		if (purchaseOrderAmt == null) {
			if (other.purchaseOrderAmt != null)
				return false;
		} else if (!purchaseOrderAmt.equals(other.purchaseOrderAmt))
			return false;
		if (purchaseOrderPaidAmt == null) {
			if (other.purchaseOrderPaidAmt != null)
				return false;
		} else if (!purchaseOrderPaidAmt.equals(other.purchaseOrderPaidAmt))
			return false;
		if (quotationAmt == null) {
			if (other.quotationAmt != null)
				return false;
		} else if (!quotationAmt.equals(other.quotationAmt))
			return false;

		if (salesOrderPaidAmt == null) {
			if (other.salesOrderPaidAmt != null)
				return false;
		} else if (!salesOrderPaidAmt.equals(other.salesOrderPaidAmt))
			return false;
		return true;
	}

}
