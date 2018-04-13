package com.zqw.bss.vo.crm;

import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2016
 * </p>
 * <p>
 * Company:zqw
 * </p>
 * 
 * @author Dhuan
 * @date 2016年5月16日 下午5:50:53
 * @version 1.0
 */
public class ClientInfoListVo extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6382124683176070795L;

	/**
	 * id
	 */
	private Long clientInfoid;

	/**
	 * id
	 */
	private Long userInfoid;

	/**
	 * id
	 */
	private Long clientAccountid;

	/**
	 * 客户（供应商）名称
	 */
	private String name;

	/**
	 * 最后更新时间
	 */
	private Date lastUpdateDate;

	/**
	 * 报价总额
	 */
	private BigDecimal quotationAmt = BigDecimal.valueOf(0);

	/**
	 * 预收总额
	 */
	private BigDecimal salesPrePaidAmt = BigDecimal.valueOf(0);

	/**
	 * 未送货总额
	 */
	private BigDecimal salesNotDoneAmt = BigDecimal.valueOf(0);

	/**
	 * 应收总额
	 */
	private BigDecimal salesPayableAmt = BigDecimal.valueOf(0);

	/**
	 * 逾期应收总额
	 */
	private BigDecimal salesDuePayableAmt = BigDecimal.valueOf(0);

	/**
	 * 已收款总额
	 */
	private BigDecimal salesOrderPaidAmt = BigDecimal.valueOf(0);
	/**
	 * 采购总额
	 */
	private BigDecimal purchaseOrderAmt = BigDecimal.valueOf(0);

	/**
	 * 预付总额
	 */
	private BigDecimal purchasePrePaidAmt = BigDecimal.valueOf(0);

	/**
	 * 应付总额
	 */
	private BigDecimal purchasePayableAmt = BigDecimal.valueOf(0);
	/**
	 * 逾期应付总额
	 */
	private BigDecimal purchaseDuePayableAmt = BigDecimal.valueOf(0);
	/**
	 * 已付总额
	 */
	private BigDecimal purchaseOrderPaidAmt = BigDecimal.valueOf(0);

	/**
	 * 未收货总额
	 */
	private BigDecimal purchaseNotDoneAmt = BigDecimal.valueOf(0);

	private BigDecimal receiveableUpLimit = BigDecimal.valueOf(0);

	private String privilege = "";

	/**
	 * 是否客户
	 */
	private Boolean customerFlag = Boolean.FALSE;

	/**
	 * 是否供应商
	 */
	private Boolean vendorType = Boolean.FALSE;

	public Boolean getCustomerFlag() {
		return customerFlag;
	}

	public void setCustomerFlag(Boolean customerFlag) {
		this.customerFlag = customerFlag;
	}

	public Boolean getVendorType() {
		return vendorType;
	}

	public void setVendorType(Boolean vendorType) {
		this.vendorType = vendorType;
	}

	public String getPrivilege() {
		return privilege;
	}

	public void setPrivilege(String privilege) {
		this.privilege = privilege;
	}

	public BigDecimal getReceiveableUpLimit() {
		return receiveableUpLimit;
	}

	public void setReceiveableUpLimit(BigDecimal receiveableUpLimit) {
		this.receiveableUpLimit = receiveableUpLimit;
	}

	public BigDecimal getPurchaseNotDoneAmt() {
		return purchaseNotDoneAmt;
	}

	public void setPurchaseNotDoneAmt(BigDecimal purchaseNotDoneAmt) {
		this.purchaseNotDoneAmt = purchaseNotDoneAmt;
	}

	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	public BigDecimal getSalesOrderPaidAmt() {
		return salesOrderPaidAmt;
	}

	public void setSalesOrderPaidAmt(BigDecimal salesOrderPaidAmt) {
		this.salesOrderPaidAmt = salesOrderPaidAmt;
	}

	public BigDecimal getPurchaseOrderAmt() {
		return purchaseOrderAmt;
	}

	public void setPurchaseOrderAmt(BigDecimal purchaseOrderAmt) {
		this.purchaseOrderAmt = purchaseOrderAmt;
	}

	public BigDecimal getPurchasePrePaidAmt() {
		return purchasePrePaidAmt;
	}

	public void setPurchasePrePaidAmt(BigDecimal purchasePrePaidAmt) {
		this.purchasePrePaidAmt = purchasePrePaidAmt;
	}

	public BigDecimal getPurchasePayableAmt() {
		return purchasePayableAmt;
	}

	public void setPurchasePayableAmt(BigDecimal purchasePayableAmt) {
		this.purchasePayableAmt = purchasePayableAmt;
	}

	public BigDecimal getPurchaseDuePayableAmt() {
		return purchaseDuePayableAmt;
	}

	public void setPurchaseDuePayableAmt(BigDecimal purchaseDuePayableAmt) {
		this.purchaseDuePayableAmt = purchaseDuePayableAmt;
	}

	public BigDecimal getPurchaseOrderPaidAmt() {
		return purchaseOrderPaidAmt;
	}

	public void setPurchaseOrderPaidAmt(BigDecimal purchaseOrderPaidAmt) {
		this.purchaseOrderPaidAmt = purchaseOrderPaidAmt;
	}

	public Long getClientAccountid() {
		return clientAccountid;
	}

	public void setClientAccountid(Long clientAccountid) {
		this.clientAccountid = clientAccountid;
	}

	public Long getClientInfoid() {
		return clientInfoid;
	}

	public void setClientInfoid(Long clientInfoid) {
		this.clientInfoid = clientInfoid;
	}

	public Long getUserInfoid() {
		return userInfoid;
	}

	public void setUserInfoid(Long userInfoid) {
		this.userInfoid = userInfoid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getQuotationAmt() {
		return quotationAmt;
	}

	public void setQuotationAmt(BigDecimal quotationAmt) {
		this.quotationAmt = quotationAmt;
	}

	public BigDecimal getSalesPrePaidAmt() {
		return salesPrePaidAmt;
	}

	public void setSalesPrePaidAmt(BigDecimal salesPrePaidAmt) {
		this.salesPrePaidAmt = salesPrePaidAmt;
	}

	public BigDecimal getSalesNotDoneAmt() {
		return salesNotDoneAmt;
	}

	public void setSalesNotDoneAmt(BigDecimal salesNotDoneAmt) {
		this.salesNotDoneAmt = salesNotDoneAmt;
	}

	public BigDecimal getSalesPayableAmt() {
		return salesPayableAmt;
	}

	public void setSalesPayableAmt(BigDecimal salesPayableAmt) {
		this.salesPayableAmt = salesPayableAmt;
	}

	public BigDecimal getSalesDuePayableAmt() {
		return salesDuePayableAmt;
	}

	public void setSalesDuePayableAmt(BigDecimal salesDuePayableAmt) {
		this.salesDuePayableAmt = salesDuePayableAmt;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((purchaseOrderAmt == null) ? 0 : purchaseOrderAmt.hashCode());
		result = prime * result + ((purchasePrePaidAmt == null) ? 0 : purchasePrePaidAmt.hashCode());
		result = prime * result + ((purchasePayableAmt == null) ? 0 : purchasePayableAmt.hashCode());
		result = prime * result + ((purchaseDuePayableAmt == null) ? 0 : purchaseDuePayableAmt.hashCode());
		result = prime * result + ((purchaseOrderPaidAmt == null) ? 0 : purchaseOrderPaidAmt.hashCode());
		result = prime * result + ((clientAccountid == null) ? 0 : clientAccountid.hashCode());
		result = prime * result + ((quotationAmt == null) ? 0 : quotationAmt.hashCode());
		result = prime * result + ((salesPrePaidAmt == null) ? 0 : salesPrePaidAmt.hashCode());
		result = prime * result + ((salesNotDoneAmt == null) ? 0 : salesNotDoneAmt.hashCode());
		result = prime * result + ((salesPayableAmt == null) ? 0 : salesPayableAmt.hashCode());
		result = prime * result + ((salesDuePayableAmt == null) ? 0 : salesDuePayableAmt.hashCode());
		result = prime * result + ((clientInfoid == null) ? 0 : clientInfoid.hashCode());
		result = prime * result + ((userInfoid == null) ? 0 : userInfoid.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((purchaseNotDoneAmt == null) ? 0 : purchaseNotDoneAmt.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;

		if (getClass() != obj.getClass())
			return false;
		ClientInfoListVo other = (ClientInfoListVo) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (purchaseOrderAmt == null) {
			if (other.purchaseOrderAmt != null)
				return false;
		} else if (!purchaseOrderAmt.equals(other.purchaseOrderAmt))
			return false;
		if (purchasePrePaidAmt == null) {
			if (other.purchasePrePaidAmt != null)
				return false;
		} else if (!purchasePrePaidAmt.equals(other.purchasePrePaidAmt))
			return false;
		if (purchasePayableAmt == null) {
			if (other.purchasePayableAmt != null)
				return false;
		} else if (!purchasePayableAmt.equals(other.purchasePayableAmt))
			return false;
		if (purchaseDuePayableAmt == null) {
			if (other.purchaseDuePayableAmt != null)
				return false;
		} else if (!purchaseDuePayableAmt.equals(other.purchaseDuePayableAmt))
			return false;
		if (purchaseOrderPaidAmt == null) {
			if (other.purchaseOrderPaidAmt != null)
				return false;
		} else if (!purchaseOrderPaidAmt.equals(other.purchaseOrderPaidAmt))
			return false;
		if (userInfoid == null) {
			if (other.userInfoid != null)
				return false;
		} else if (!userInfoid.equals(other.userInfoid))
			return false;
		if (clientInfoid == null) {
			if (other.clientInfoid != null)
				return false;
		} else if (!clientInfoid.equals(other.clientInfoid))
			return false;
		if (quotationAmt == null) {
			if (other.quotationAmt != null)
				return false;
		} else if (!quotationAmt.equals(other.quotationAmt))
			return false;
		if (salesPrePaidAmt == null) {
			if (other.salesPrePaidAmt != null)
				return false;
		} else if (!salesPrePaidAmt.equals(other.salesPrePaidAmt))
			return false;
		if (salesNotDoneAmt == null) {
			if (other.salesNotDoneAmt != null)
				return false;
		} else if (!salesNotDoneAmt.equals(other.salesNotDoneAmt))
			return false;
		if (salesPayableAmt == null) {
			if (other.salesPayableAmt != null)
				return false;
		} else if (!salesPayableAmt.equals(other.salesPayableAmt))
			return false;
		if (salesDuePayableAmt == null) {
			if (other.salesDuePayableAmt != null)
				return false;
		} else if (!salesDuePayableAmt.equals(other.salesDuePayableAmt))
			return false;
		if (clientAccountid == null) {
			if (other.clientAccountid != null)
				return false;
		} else if (!clientAccountid.equals(other.clientAccountid))
			return false;
		if (lastUpdateDate == null) {
			if (other.lastUpdateDate != null)
				return false;
		} else if (!lastUpdateDate.equals(other.lastUpdateDate))
			return false;
		if (purchaseNotDoneAmt == null) {
			if (other.purchaseNotDoneAmt != null)
				return false;
		} else if (!purchaseNotDoneAmt.equals(other.purchaseNotDoneAmt))
			return false;
		return true;
	}

	/**
	 * 客户供应商列表使用，
	 */
	public ClientInfoListVo(Long clientInfoid, Long userInfoid, Long clientAccountid, String name,
			BigDecimal quotationAmt, BigDecimal salesPrePaidAmt, BigDecimal salesNotDoneAmt, BigDecimal salesPayableAmt,
			BigDecimal salesDuePayableAmt, BigDecimal salesOrderPaidAmt, Date lastUpdateDate, Boolean customerFlag,
			Boolean vendorType) {
		super();
		this.clientInfoid = clientInfoid;
		this.userInfoid = userInfoid;
		this.clientAccountid = clientAccountid;
		this.name = name;
		this.quotationAmt = quotationAmt;
		this.salesPrePaidAmt = salesPrePaidAmt;
		this.salesNotDoneAmt = salesNotDoneAmt;
		this.salesPayableAmt = salesPayableAmt;
		this.salesDuePayableAmt = salesDuePayableAmt;
		this.salesOrderPaidAmt = salesOrderPaidAmt;
		this.lastUpdateDate = lastUpdateDate;
		this.customerFlag = customerFlag;
		this.vendorType = vendorType;
	}

	public ClientInfoListVo(Long clientInfoid, Long userInfoid, Long clientAccountid, String name,
			BigDecimal quotationAmt, BigDecimal salesPrePaidAmt, BigDecimal salesNotDoneAmt, BigDecimal salesPayableAmt,
			BigDecimal salesDuePayableAmt, BigDecimal salesOrderPaidAmt, Date lastUpdateDate) {
		super();
		this.clientInfoid = clientInfoid;
		this.userInfoid = userInfoid;
		this.clientAccountid = clientAccountid;
		this.name = name;
		this.quotationAmt = quotationAmt;
		this.salesPrePaidAmt = salesPrePaidAmt;
		this.salesNotDoneAmt = salesNotDoneAmt;
		this.salesPayableAmt = salesPayableAmt;
		this.salesDuePayableAmt = salesDuePayableAmt;
		this.salesOrderPaidAmt = salesOrderPaidAmt;
		this.lastUpdateDate = lastUpdateDate;
	}

	/**
	 * 在供应商列表已被下面替换
	 */
	public ClientInfoListVo(Long clientInfoid, Long clientAccountid, String name, BigDecimal purchaseOrderAmt,
			Long userInfoid, BigDecimal purchasePrePaidAmt, BigDecimal purchasePayableAmt,
			BigDecimal purchaseDuePayableAmt, BigDecimal purchaseOrderPaidAmt, Date lastUpdateDate,
			BigDecimal purchaseNotDoneAmt, Boolean customerFlag, Boolean vendorType) {
		super();
		this.clientInfoid = clientInfoid;
		this.userInfoid = userInfoid;
		this.clientAccountid = clientAccountid;
		this.name = name;
		this.purchaseOrderAmt = purchaseOrderAmt;
		this.purchasePrePaidAmt = purchasePrePaidAmt;
		this.purchasePayableAmt = purchasePayableAmt;
		this.purchaseDuePayableAmt = purchaseDuePayableAmt;
		this.purchaseOrderPaidAmt = purchaseOrderPaidAmt;
		this.lastUpdateDate = lastUpdateDate;
		this.purchaseNotDoneAmt = purchaseNotDoneAmt;
		this.customerFlag = customerFlag;
		this.vendorType = vendorType;
	}

	public ClientInfoListVo(Long clientInfoid, Long clientAccountid, String name, BigDecimal purchaseOrderAmt,
			Long userInfoid, BigDecimal purchasePrePaidAmt, BigDecimal purchasePayableAmt,
			BigDecimal purchaseDuePayableAmt, BigDecimal purchaseOrderPaidAmt, Date lastUpdateDate,
			BigDecimal purchaseNotDoneAmt) {
		super();
		this.clientInfoid = clientInfoid;
		this.userInfoid = userInfoid;
		this.clientAccountid = clientAccountid;
		this.name = name;
		this.purchaseOrderAmt = purchaseOrderAmt;
		this.purchasePrePaidAmt = purchasePrePaidAmt;
		this.purchasePayableAmt = purchasePayableAmt;
		this.purchaseDuePayableAmt = purchaseDuePayableAmt;
		this.purchaseOrderPaidAmt = purchaseOrderPaidAmt;
		this.lastUpdateDate = lastUpdateDate;
		this.purchaseNotDoneAmt = purchaseNotDoneAmt;
	}

	public ClientInfoListVo(Long clientInfoid, BigDecimal salesPayableAmt, BigDecimal receiveableUpLimit) {
		this.clientInfoid = clientInfoid;
		this.salesPayableAmt = salesPayableAmt;
		this.receiveableUpLimit = receiveableUpLimit;
	}

	public ClientInfoListVo(String name) {
		super();
		this.name = name;
	}

	public ClientInfoListVo() {
		super();
	}

}
