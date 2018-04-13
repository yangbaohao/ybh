package com.zqw.bss.model.sale;

import java.math.BigDecimal;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.util.SystemConstant.PayStatus;

/**
 * <p>
 * 代理收益
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
@Table(name = "t_bss_agent_revenue")
public class AgentRevenue extends BaseObject {

	private static final long serialVersionUID = -5350846349186688L;

	private Long id;
	/**
	 * 订单付款信息
	 */
	private AccountOrderPay accountOrderPay;
	/**
	 * 收益数额
	 */
	private BigDecimal revenueAmt = new BigDecimal(0);
	/**
	 * 收益付款状态
	 */
	private PayStatus payStatus;
	/**
	 *销售代理 
	 */
	private SalesAgent salesAgent;
	
	/**
	 * 审批意见
	 * @return
	 */
	private String remark;
	
	@Transient
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, targetEntity = SalesAgent.class, fetch = FetchType.EAGER)
	public SalesAgent getSalesAgent() {
		return salesAgent;
	}
	public void setSalesAgent(SalesAgent salesAgent) {
		this.salesAgent = salesAgent;
	}
	
	@ManyToOne(targetEntity = AccountOrderPay.class, fetch = FetchType.EAGER)
	public AccountOrderPay getAccountOrderPay() {
		return accountOrderPay;
	}
	public void setAccountOrderPay(AccountOrderPay accountOrderPay) {
		this.accountOrderPay = accountOrderPay;
	}
	
	public BigDecimal getRevenueAmt() {
		return revenueAmt;
	}
	public void setRevenueAmt(BigDecimal revenueAmt) {
		this.revenueAmt = revenueAmt;
	}
	
	@Enumerated(EnumType.STRING)
	public PayStatus getPayStatus() {
		return payStatus;
	}
	public void setPayStatus(PayStatus payStatus) {
		this.payStatus = payStatus;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((accountOrderPay == null) ? 0 : accountOrderPay.hashCode());
		result = prime * result + ((payStatus == null) ? 0 : payStatus.hashCode());
		result = prime * result + ((revenueAmt == null) ? 0 : revenueAmt.hashCode());
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
		AgentRevenue other = (AgentRevenue) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (accountOrderPay == null) {
			if (other.accountOrderPay != null)
				return false;
		} else if (!accountOrderPay.equals(other.accountOrderPay))
			return false;
		if (payStatus != other.payStatus)
			return false;
		if (revenueAmt == null) {
			if (other.revenueAmt != null)
				return false;
		} else if (!revenueAmt.equals(other.revenueAmt))
			return false;
		return true;
	}
	public AgentRevenue(Long id) {
		super();
		this.id = id;
	}
	public AgentRevenue() {
		super();
		// TODO Auto-generated constructor stub
	}
	public AgentRevenue(Long id, String remark) {
		super();
		this.id = id;
		this.remark = remark;
	}

	

}
