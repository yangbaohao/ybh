package com.zqw.bss.vo.crm;

import java.math.BigDecimal;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.sys.User;

public class SalesVo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 *销售人员
	 */
	private User sales;
	/**
	 * 代理商数量 
	 */
	private int salesAgentNum;
	/**
	 * 用户数量 
	 */
	private int ownerNum;
	/**
	 * 付费用户数量 
	 */
	private Long feeNum;
	/**
	 * 直销数量 
	 */
	private BigDecimal salesNum;
	/**
	 * 商机销售数量 
	 */
	private BigDecimal potentialNum;
	/**
	 * 代理销售数量 
	 */
	private BigDecimal AgentSaleNum;
	
	public User getSales() {
		return sales;
	}

	public void setSales(User sales) {
		this.sales = sales;
	}

	public int getSalesAgentNum() {
		return salesAgentNum;
	}

	public void setSalesAgentNum(int salesAgentNum) {
		this.salesAgentNum = salesAgentNum;
	}

	public int getOwnerNum() {
		return ownerNum;
	}

	public void setOwnerNum(int ownerNum) {
		this.ownerNum = ownerNum;
	}

	public BigDecimal getSalesNum() {
		return salesNum;
	}

	public void setSalesNum(BigDecimal salesNum) {
		this.salesNum = salesNum;
	}

	public BigDecimal getAgentSaleNum() {
		return AgentSaleNum;
	}

	public void setAgentSaleNum(BigDecimal agentSaleNum) {
		AgentSaleNum = agentSaleNum;
	}

	public BigDecimal getPotentialNum() {
		return potentialNum;
	}

	public void setPotentialNum(BigDecimal potentialNum) {
		this.potentialNum = potentialNum;
	}

	public Long getFeeNum() {
		return feeNum;
	}

	public void setFeeNum(Long feeNum) {
		this.feeNum = feeNum;
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
	public SalesVo(User sales, int salesAgentNum, int ownerNum, BigDecimal salesNum, BigDecimal potentialNum,
			BigDecimal agentSaleNum,Long feeNum) {
		super();
		this.sales = sales;
		this.salesAgentNum = salesAgentNum;
		this.ownerNum = ownerNum;
		this.salesNum = salesNum;
		this.potentialNum = potentialNum;
		AgentSaleNum = agentSaleNum;
		this.feeNum=feeNum;
	}

	public SalesVo() {
		super();
		// TODO Auto-generated constructor stub
	}
	
}
