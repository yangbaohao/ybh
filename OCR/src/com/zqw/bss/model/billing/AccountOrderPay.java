package com.zqw.bss.model.billing;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.util.SystemConstant.PayStatus;
import com.zqw.bss.util.SystemConstant.PayWay;
import com.zqw.bss.util.SystemConstant.StandardMoney;

/**
 * <p>
 * 订单支付信息
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0
 */
@Entity
@Table(name = "t_bss_order_pay",indexes = {
		@Index(name = "ownerId_index", columnList = "ownerId")
})
public class AccountOrderPay extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = -362249317162204972L;

	/**
	 * 主键id
	 */
	private Long id;

	/**
	 * 订单对象信息
	 */
	private AccountOrder accountOrder;

	/**
	 * 付款数目
	 */
	private BigDecimal amt = new BigDecimal(0);

	/**
	 * 使用账户数目
	 */
	private BigDecimal accountAmt = new BigDecimal(0);

	/**
	 * 现金券数目
	 */
	private BigDecimal vouchertAmt = new BigDecimal(0);

	/**
	 * 付款总数
	 */
	private BigDecimal totalAmt = new BigDecimal(0);

	/**
	 * 币种
	 */
	private StandardMoney currency = StandardMoney.RMB;

	/**
	 * 付款记录
	 */
	private BillingRecord billingRecord;

	/**
	 * 付款日期时间
	 */
	private Date payDate;

	/**
	 * 付款方式(cash:现金、alipay:支付宝、wechatpay微信支付、bankpay银行转账)
	 */
	private PayWay payWay = PayWay.cash;

	private PayStatus payStatus;
	
	/**
	 * 隶属的用户信息
	 */
	private Long ownerId;

	private String remark;

	/**
	 * 该订单使用的现金券列表
	 */
	private List<Voucher> vouchers = new ArrayList<Voucher>();

	/**
	 * 付费权限
	 */
	private List<BillingProductPermission> billingProductPermissions = new ArrayList<BillingProductPermission>();

	
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

	@Enumerated(EnumType.STRING)
	public PayStatus getPayStatus() {
		return payStatus;
	}

	public void setPayStatus(PayStatus payStatus) {
		this.payStatus = payStatus;
	}

	@Column(scale = 2)
	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Column(scale = 2)
	public BigDecimal getAmt() {
		return amt;
	}

	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}

	@Enumerated(EnumType.STRING)
	public StandardMoney getCurrency() {
		return currency;
	}

	public void setCurrency(StandardMoney currency) {
		this.currency = currency;
	}

	public Date getPayDate() {
		return payDate;
	}

	public void setPayDate(Date payDate) {
		this.payDate = payDate;
	}

	@Enumerated(EnumType.STRING)
	public PayWay getPayWay() {
		return payWay;
	}

	public void setPayWay(PayWay payWay) {
		this.payWay = payWay;
	}

	@ManyToOne(cascade ={ CascadeType.PERSIST, CascadeType.REMOVE }, targetEntity = AccountOrder.class)
	@JoinColumn(name = "accountOrder_id")
	public AccountOrder getAccountOrder() {
		return accountOrder;
	}

	public void setAccountOrder(AccountOrder accountOrder) {
		this.accountOrder = accountOrder;
	}

	public BigDecimal getAccountAmt() {
		return accountAmt;
	}

	public void setAccountAmt(BigDecimal accountAmt) {
		this.accountAmt = accountAmt;
	}

	public BigDecimal getVouchertAmt() {
		return vouchertAmt;
	}

	public void setVouchertAmt(BigDecimal vouchertAmt) {
		this.vouchertAmt = vouchertAmt;
	}

	@ManyToOne(cascade = CascadeType.ALL, targetEntity = BillingRecord.class, fetch = FetchType.EAGER)
	public BillingRecord getBillingRecord() {
		return billingRecord;
	}

	public void setBillingRecord(BillingRecord billingRecord) {
		this.billingRecord = billingRecord;
	}


	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.REMOVE }, fetch = FetchType.EAGER)
	@JoinColumn(name = "orderPay_id")
	@BatchSize(size = 100)
	public List<Voucher> getVouchers() {
		return vouchers;
	}

	public void setVouchers(List<Voucher> vouchers) {
		this.vouchers = vouchers;
	}

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.REMOVE }, fetch = FetchType.EAGER)
	@JoinColumn(name = "AccountOrderPay_id")
	@BatchSize(size = 100)
	public List<BillingProductPermission> getBillingProductPermissions() {
		return billingProductPermissions;
	}

	public void setBillingProductPermissions(List<BillingProductPermission> billingProductPermissions) {
		this.billingProductPermissions = billingProductPermissions;
	}

	

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accountAmt == null) ? 0 : accountAmt.hashCode());
		result = prime * result + ((accountOrder == null) ? 0 : accountOrder.hashCode());
		result = prime * result + ((amt == null) ? 0 : amt.hashCode());
		result = prime * result + ((billingProductPermissions == null) ? 0 : billingProductPermissions.hashCode());
		result = prime * result + ((billingRecord == null) ? 0 : billingRecord.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((currency == null) ? 0 : currency.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((payDate == null) ? 0 : payDate.hashCode());
		result = prime * result + ((payWay == null) ? 0 : payWay.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((totalAmt == null) ? 0 : totalAmt.hashCode());
		result = prime * result + ((vouchers == null) ? 0 : vouchers.hashCode());
		result = prime * result + ((vouchertAmt == null) ? 0 : vouchertAmt.hashCode());
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
		AccountOrderPay other = (AccountOrderPay) obj;
		if (accountAmt == null) {
			if (other.accountAmt != null)
				return false;
		} else if (!accountAmt.equals(other.accountAmt))
			return false;
		if (accountOrder == null) {
			if (other.accountOrder != null)
				return false;
		} else if (!accountOrder.equals(other.accountOrder))
			return false;
		if (amt == null) {
			if (other.amt != null)
				return false;
		} else if (!amt.equals(other.amt))
			return false;
		if (billingProductPermissions == null) {
			if (other.billingProductPermissions != null)
				return false;
		} else if (!billingProductPermissions.equals(other.billingProductPermissions))
			return false;
		if (billingRecord == null) {
			if (other.billingRecord != null)
				return false;
		} else if (!billingRecord.equals(other.billingRecord))
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
		if (currency != other.currency)
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
		if (payDate == null) {
			if (other.payDate != null)
				return false;
		} else if (!payDate.equals(other.payDate))
			return false;
		if (payWay != other.payWay)
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		if (totalAmt == null) {
			if (other.totalAmt != null)
				return false;
		} else if (!totalAmt.equals(other.totalAmt))
			return false;
		if (vouchers == null) {
			if (other.vouchers != null)
				return false;
		} else if (!vouchers.equals(other.vouchers))
			return false;
		if (vouchertAmt == null) {
			if (other.vouchertAmt != null)
				return false;
		} else if (!vouchertAmt.equals(other.vouchertAmt))
			return false;
		return true;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

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

}
