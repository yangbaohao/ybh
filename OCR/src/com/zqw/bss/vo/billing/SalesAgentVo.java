package com.zqw.bss.vo.billing;

import java.math.BigDecimal;
import java.math.BigInteger;

import com.zqw.bss.framework.model.BaseObject;

public class SalesAgentVo extends BaseObject{

	public SalesAgentVo(String agentCode, String agentName, Long customernum, BigDecimal amt, BigDecimal fee,
			BigDecimal revenueAmt, BigDecimal notRevenueAmt,Long agentId) {
		super();
		this.agentCode = agentCode;
		this.agentName = agentName;
		this.customernum = customernum;
		this.amt = amt;
		this.fee = fee;
		this.revenueAmt = revenueAmt;
		this.notRevenueAmt = notRevenueAmt;
		this.agentId=agentId;
	}

	private static final long serialVersionUID = -6952749042374375620L;
	/**
	 * 代理商编号
	 */
	private String agentCode;
	/**
	 * 代理商用户名
	 */
	private String agentName;
	/**
	 * 代理商Id
	 */
	private Long agentId;
	/**
	 * 成功客户数
	 */
	private Long customernum;
	/**
	 * 累计购买金额
	 */
	private BigDecimal amt;
	/**
	 * 累计佣金
	 */
	private BigDecimal fee;
	public BigDecimal getFee() {
		return fee;
	}
	public void setFee(BigDecimal fee) {
		this.fee = fee;
	}

	/**
	 * 已提佣金
	 */
	private BigDecimal revenueAmt;
	/**
	 * 未提佣金
	 * @return
	 */
	private BigDecimal notRevenueAmt;
	
	public BigDecimal getNotRevenueAmt() {
		return notRevenueAmt;
	}
	public void setNotRevenueAmt(BigDecimal notRevenueAmt) {
		this.notRevenueAmt = notRevenueAmt;
	}
	public String getAgentCode() {
		return agentCode;
	}
	public void setAgentCode(String agentCode) {
		this.agentCode = agentCode;
	}
	public String getAgentName() {
		return agentName;
	}
	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}
	public Long getCustomernum() {
		return customernum;
	}
	public void setCustomernum(Long customernum) {
		this.customernum = customernum;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}	
	public BigDecimal getRevenueAmt() {
		return revenueAmt;
	}
	public void setRevenueAmt(BigDecimal revenueAmt) {
		this.revenueAmt = revenueAmt;
	}
	
	public SalesAgentVo(){}
	public SalesAgentVo(Object obj[]){
		this.agentCode = (String)obj[0];
		this.agentName = (String)obj[1];
		this.customernum = ((BigInteger)obj[2]).longValue();
		this.amt = (BigDecimal)(obj[3] == null ? BigDecimal.ZERO:obj[3]);
		this.revenueAmt = (BigDecimal)obj[4];
	}
	
	@Override
	public boolean equals(Object arg0) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return 0;
	}
	public Long getAgentId() {
		return agentId;
	}
	public void setAgentId(Long agentId) {
		this.agentId = agentId;
	}
	
}
