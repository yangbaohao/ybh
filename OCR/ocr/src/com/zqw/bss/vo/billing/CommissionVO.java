package com.zqw.bss.vo.billing;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.billing.AccountOrderPay;

/**
 * 用尽管理VO
 * @author win7
 *
 */
public class CommissionVO  extends BaseObject{
	public CommissionVO(BigDecimal totalAmt, BigDecimal fee, Long id) {
		super();
		this.totalAmt = totalAmt;
		this.fee = fee;
		this.id = id;
	}
	public CommissionVO(BigDecimal fee, BigDecimal isFee, BigDecimal unFee) {
		super();
		this.fee = fee;
		this.isFee = isFee;
		this.unFee = unFee;
	}
	public CommissionVO() {
		super();
		// TODO Auto-generated constructor stub
	}

	//日期
	private Date orderCreateDate;
	//客户购买金额
	private BigDecimal totalAmt;
	/**
	 * 赢得佣金
	 */
	private BigDecimal fee;
	/**
	 * 已提佣金 
	 */
	private BigDecimal isFee;
	/**
	 * 未提佣金
	 * @return
	 */
	private BigDecimal unFee;
	/**
	 * 佣金提取状态
	 * @return
	 */
	private String payStatus;
	/**
	 * id
	 * @return
	 */
	private Long id;
	/**
	 * 审批
	 */
	private List<AccountOrderPay> list;
	
	
	public List<AccountOrderPay> getList() {
		return list;
	}
	public void setList(List<AccountOrderPay> list) {
		this.list = list;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getPayStatus() {
		return payStatus;
	}
	public void setPayStatus(String payStatus) {
		this.payStatus = payStatus;
	}
	public BigDecimal getUnFee() {
		return unFee;
	}
	public void setUnFee(BigDecimal unFee) {
		this.unFee = unFee;
	}
	public BigDecimal getFee() {
		return fee;
	}
	public void setFee(BigDecimal fee) {
		this.fee = fee;
	}
	public BigDecimal getIsFee() {
		return isFee;
	}
	public void setIsFee(BigDecimal isFee) {
		this.isFee = isFee;
	}
	public Date getOrderCreateDate() {
		return orderCreateDate;
	}
	public void setOrderCreateDate(Date orderCreateDate) {
		this.orderCreateDate = orderCreateDate;
	}
	public BigDecimal getTotalAmt() {
		return totalAmt;
	}
	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
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
	
	


}
