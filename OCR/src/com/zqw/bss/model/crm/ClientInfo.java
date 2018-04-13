/**
 * 
 */
package com.zqw.bss.model.crm;

import java.math.BigDecimal;
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
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.AutoValueIgnore;

/**
 * <p>
 * 客户端信息，包括客户及供应商
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * <p>
 * 客户端信息
 * </p>
 * 
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@Entity
@Table(name = "t_crm_client_info")
public class ClientInfo extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8806245140803445255L;

	private Long id;

	/**
	 * ownerId
	 */
	private Long ownerId;

	/**
	 * 是否客户
	 */
	private Boolean customerFlag = Boolean.FALSE;

	/**
	 * 是否供应商
	 */
	private Boolean vendorType = Boolean.FALSE;

	/**
	 * 客户账期时间数
	 */
	private Long customerTermValue;

	/**
	 * 供应商账期时间数
	 */
	private Long vendorTermValue;
	
	/**
	 * 应收款上限
	 */
	private BigDecimal receivableUpLimit = BigDecimal.ZERO;

	/**
	 * 用户基本信息
	 */
	private UserInfo userInfo;

	/**
	 * 客户银行信息
	 */
	private List<ClientBank> clientBanks = new ArrayList<ClientBank>();
	
	/**
	 * 客户备注
	 */
	private String remark;
	
	/**
	 * 客户编号
	 */
	private String number;
	
	/**
	 * 第三方客户id,同第三方的平台的id
	 */
	private String proxyNumber;
	/**
	 * 客户启用状态
	 */
	private Boolean available = Boolean.TRUE;
	
	/**
	 * 供应商启用状态
	 */
	private Boolean vendorAvailable = Boolean.TRUE;
	/**
	 * 是否拥有单子,false没有单子,true有单子,在创建或者删除时会修改此字段
	 */
	private Boolean orderFlag=Boolean.FALSE; 
	
	/**
	 * 是不是报税产生
	 */
	private Boolean isBsscreate=Boolean.FALSE; 
	
	/**
	 * 权限
	 */
	private String privilege = "";
	
	/**
	 * 期初应收
	 */
	private BigDecimal salesPayableAmt = new BigDecimal(0);
	
	/**
	 * 期初预收
	 */
	private BigDecimal salesPrePaidAmt = new BigDecimal(0);
	
	/**
	 * 期初应付
	 */
	private BigDecimal purchasePayableAmt = new BigDecimal(0);
	
	/**
	 * 期初预付
	 */
	private BigDecimal purchasePrePaidAmt = new BigDecimal(0);

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	
	public String getPrivilege() {
		return privilege;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getIsBsscreate() {
		return isBsscreate;
	}

	public void setIsBsscreate(Boolean isBsscreate) {
		this.isBsscreate = isBsscreate;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public void setPrivilege(String privilege) {
		this.privilege = privilege;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getOrderFlag() {
		return orderFlag;
	}

	public void setOrderFlag(Boolean orderFlag) {
		this.orderFlag = orderFlag;
	}

	@Column(scale = 2)
	public BigDecimal getReceivableUpLimit() {
		return receivableUpLimit;
	}

	public void setReceivableUpLimit(BigDecimal receivableUpLimit) {
		this.receivableUpLimit = receivableUpLimit;
	}
	
	@Column(scale=2)
	public BigDecimal getSalesPayableAmt() {
		return salesPayableAmt;
	}

	public void setSalesPayableAmt(BigDecimal salesPayableAmt) {
		this.salesPayableAmt = salesPayableAmt == null ? BigDecimal.ZERO : salesPayableAmt;
	}
	@Column(scale=2)
	public BigDecimal getSalesPrePaidAmt() {
		return salesPrePaidAmt;
	}

	public void setSalesPrePaidAmt(BigDecimal salesPrePaidAmt) {
		this.salesPrePaidAmt = salesPrePaidAmt == null ? BigDecimal.ZERO : salesPrePaidAmt;
	}
	@Column(scale=2)
	public BigDecimal getPurchasePayableAmt() {
		return purchasePayableAmt;
	}

	public void setPurchasePayableAmt(BigDecimal purchasePayableAmt) {
		this.purchasePayableAmt = purchasePayableAmt == null ? BigDecimal.ZERO : purchasePayableAmt;
	}
	@Column(scale=2)
	public BigDecimal getPurchasePrePaidAmt() {
		return purchasePrePaidAmt;
	}

	public void setPurchasePrePaidAmt(BigDecimal purchasePrePaidAmt) {
		this.purchasePrePaidAmt = purchasePrePaidAmt == null ? BigDecimal.ZERO : purchasePrePaidAmt;
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
	
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}
	
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getVendorAvailable() {
		return vendorAvailable;
	}

	public void setVendorAvailable(Boolean vendorAvailable) {
		this.vendorAvailable = vendorAvailable;
	}

	
	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public Long getCustomerTermValue() {
		return customerTermValue;
	}

	public void setCustomerTermValue(Long customerTermValue) {
		this.customerTermValue = customerTermValue;
	}

	public Long getVendorTermValue() {
		return vendorTermValue;
	}

	public void setVendorTermValue(Long vendorTermValue) {
		this.vendorTermValue = vendorTermValue;
	}

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE,
			CascadeType.REMOVE }, fetch = FetchType.EAGER)
	@JoinColumn(name = "clientInfo_id")
	@BatchSize(size=50)
	public List<ClientBank> getClientBanks() {
		return clientBanks;
	}

	public void setClientBanks(List<ClientBank> clientBanks) {
		this.clientBanks = clientBanks;
	}
	@AutoValueIgnore
	@ManyToOne(targetEntity = UserInfo.class, fetch = FetchType.EAGER)
	public UserInfo getUserInfo() {
		return userInfo;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getCustomerFlag() {
		return customerFlag;
	}

	public void setCustomerFlag(Boolean customerFlag) {
		this.customerFlag = customerFlag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getVendorType() {
		return vendorType;
	}

	public void setVendorType(Boolean vendorType) {
		this.vendorType = vendorType;
	}

	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
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

	public String getProxyNumber() {
		return proxyNumber;
	}

	public void setProxyNumber(String proxyNumber) {
		this.proxyNumber = proxyNumber;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((available == null) ? 0 : available.hashCode());
		result = prime * result + ((clientBanks == null) ? 0 : clientBanks.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((customerFlag == null) ? 0 : customerFlag.hashCode());
		result = prime * result + ((customerTermValue == null) ? 0 : customerTermValue.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((number == null) ? 0 : number.hashCode());
		result = prime * result + ((orderFlag == null) ? 0 : orderFlag.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((privilege == null) ? 0 : privilege.hashCode());
		result = prime * result + ((purchasePayableAmt == null) ? 0 : purchasePayableAmt.hashCode());
		result = prime * result + ((purchasePrePaidAmt == null) ? 0 : purchasePrePaidAmt.hashCode());
		result = prime * result + ((receivableUpLimit == null) ? 0 : receivableUpLimit.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((salesPayableAmt == null) ? 0 : salesPayableAmt.hashCode());
		result = prime * result + ((salesPrePaidAmt == null) ? 0 : salesPrePaidAmt.hashCode());
		result = prime * result + ((userInfo == null) ? 0 : userInfo.hashCode());
		result = prime * result + ((vendorAvailable == null) ? 0 : vendorAvailable.hashCode());
		result = prime * result + ((vendorTermValue == null) ? 0 : vendorTermValue.hashCode());
		result = prime * result + ((proxyNumber == null) ? 0 : proxyNumber.hashCode());
		result = prime * result + ((vendorType == null) ? 0 : vendorType.hashCode());
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
		ClientInfo other = (ClientInfo) obj;
		if (available == null) {
			if (other.available != null)
				return false;
		} else if (!available.equals(other.available))
			return false;
		if (clientBanks == null) {
			if (other.clientBanks != null)
				return false;
		} else if (!clientBanks.equals(other.clientBanks))
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
		if (customerFlag == null) {
			if (other.customerFlag != null)
				return false;
		} else if (!customerFlag.equals(other.customerFlag))
			return false;
		if (customerTermValue == null) {
			if (other.customerTermValue != null)
				return false;
		} else if (!customerTermValue.equals(other.customerTermValue))
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
		if (number == null) {
			if (other.number != null)
				return false;
		} else if (!number.equals(other.number))
			return false;
		if (orderFlag == null) {
			if (other.orderFlag != null)
				return false;
		} else if (!orderFlag.equals(other.orderFlag))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (privilege == null) {
			if (other.privilege != null)
				return false;
		} else if (!privilege.equals(other.privilege))
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
		if (receivableUpLimit == null) {
			if (other.receivableUpLimit != null)
				return false;
		} else if (!receivableUpLimit.equals(other.receivableUpLimit))
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
			if (proxyNumber == null) {
				if (other.proxyNumber != null)
					return false;
			} else if (!proxyNumber.equals(other.proxyNumber))
				return false;
		if (salesPayableAmt == null) {
			if (other.salesPayableAmt != null)
				return false;
		} else if (!salesPayableAmt.equals(other.salesPayableAmt))
			return false;
		if (salesPrePaidAmt == null) {
			if (other.salesPrePaidAmt != null)
				return false;
		} else if (!salesPrePaidAmt.equals(other.salesPrePaidAmt))
			return false;
		if (userInfo == null) {
			if (other.userInfo != null)
				return false;
		} else if (!userInfo.equals(other.userInfo))
			return false;
		if (vendorAvailable == null) {
			if (other.vendorAvailable != null)
				return false;
		} else if (!vendorAvailable.equals(other.vendorAvailable))
			return false;
		if (vendorTermValue == null) {
			if (other.vendorTermValue != null)
				return false;
		} else if (!vendorTermValue.equals(other.vendorTermValue))
			return false;
		if (vendorType == null) {
			if (other.vendorType != null)
				return false;
		} else if (!vendorType.equals(other.vendorType))
			return false;
		return true;
	}

	public ClientInfo() {
		super();
	}

	public ClientInfo(Boolean customerFlag, Boolean vendorType, Long customerTermValue,
			Long vendorTermValue, BigDecimal receivableUpLimit, 
			String remark, String number, 
			BigDecimal salesPayableAmt, BigDecimal salesPrePaidAmt,
			BigDecimal purchasePayableAmt, BigDecimal purchasePrePaidAmt) {
		super();
		this.customerFlag = customerFlag;
		this.vendorType = vendorType;
		this.customerTermValue = customerTermValue;
		this.vendorTermValue = vendorTermValue;
		this.receivableUpLimit = receivableUpLimit;
		this.remark = remark;
		this.number = number;
		this.salesPayableAmt = salesPayableAmt;
		this.salesPrePaidAmt = salesPrePaidAmt;
		this.purchasePayableAmt = purchasePayableAmt;
		this.purchasePrePaidAmt = purchasePrePaidAmt;
	}
	

	
}
