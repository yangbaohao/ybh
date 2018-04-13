package com.zqw.bss.vo.billing;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class AccountOrderVo extends BaseObject{
	
	private static final long serialVersionUID = 2174790970815554270L;
	/**
	 * 
	 */
	private Long id;
	/**
	 * 订单创建日期
	 */
	private Date orderCreateDate;
	/**
	 * 代理商ID
	 */
	private Long agentId;
	/**
	 * 代理商编号
	 */
	private String agentCode;
	/**
	 * 代理商名字 
	 */
	private String agentName;
	/**
	 * 客户名称
	 */
	private String name;
	/**
	 * 产品名称(购买模块)
	 */
	private String productName;
	/**
	 * 功能价格(购买金额)
	 */
	private BigDecimal priceAmt;
	/**
	 * 订单总价
	 */
	private BigDecimal totalAmt;
	
	/**
	 * 佣金状态
	 * @return
	 */
	private String fee;
	/**
	 * revenueAmt佣金
	 * @return
	 */
	private BigDecimal revenueAmt;
	
	
	public BigDecimal getRevenueAmt() {
		return revenueAmt;
	}
	public void setRevenueAmt(BigDecimal revenueAmt) {
		this.revenueAmt = revenueAmt;
	}
	public String getFee() {
		return fee;
	}
	public void setFee(String fee) {
		this.fee = fee;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Date getOrderCreateDate() {
		return orderCreateDate;
	}
	public void setOrderCreateDate(Date orderCreateDate) {
		this.orderCreateDate = orderCreateDate;
	}
	public Long getAgentId() {
		return agentId;
	}
	public void setAgentId(Long agentId) {
		this.agentId = agentId;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getProductName() {
		return productName;
	}
	public void setProductName(String productName) {
		this.productName = productName;
	}
	public BigDecimal getPriceAmt() {
		return priceAmt;
	}
	public void setPriceAmt(BigDecimal priceAmt) {
		this.priceAmt = priceAmt;
	}
	public BigDecimal getTotalAmt() {
		return totalAmt;
	}
	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public AccountOrderVo(){}
	public AccountOrderVo(Object obj[]) {
		this.orderCreateDate = (Date)obj[1];
		this.totalAmt = (BigDecimal)obj[8];
	}
	public AccountOrderVo(Object obj[], String flag) {
		this.id = ((BigInteger)obj[0]).longValue();
		this.orderCreateDate = (Date)obj[1];
		this.agentId = ((BigInteger)obj[2]).longValue();
		this.agentCode = (String)obj[3];
		this.agentName = (String)obj[4];
		this.name = (String)obj[5];
		this.productName = (String)obj[6];
		this.priceAmt = (BigDecimal)obj[7];
	}
	
	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return 0;
	}
	public AccountOrderVo(Long id, String orderCreateDate, Long agentId, String agentCode, String agentName, String name,
			String productName, BigDecimal priceAmt, BigDecimal totalAmt, String fee, BigDecimal revenueAmt) {
		super();
		this.id = id;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		try {
			this.orderCreateDate = sdf.parse(orderCreateDate);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		this.agentId = agentId;
		this.agentCode = agentCode;
		this.agentName = agentName;
		this.name = name;
		this.productName = productName;
		this.priceAmt = priceAmt;
		this.totalAmt = totalAmt;
		this.fee = fee;
		this.revenueAmt = revenueAmt;
	}
	
}
