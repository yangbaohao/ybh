package com.zqw.bss.vo.sys;

import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class OcrSearchUserBuyListVo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Long ownerId;
	/**
	 * 用户名
	 */
	private String username;
	
	/**
	 * 公司名称
	 */
	private String name;
	
	/**
	 * 公司电话
	 */
	private String telephone;
	
	/**
	 * 账户余额
	 */
	private BigDecimal balanceAmt = BigDecimal.ZERO;
	
	/**
	 * 首冲时间
	 */
	private Date firstDate;

	/**
	 * 服务单数
	 */
	private Long totalNum = 0L ;
	
	/**
	 * 一般单数
	 */
	private Long ordinaryNum = 0L;
	
	/**
	 * 加急单数
	 */
	private Long urgentNum = 0L;

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public BigDecimal getBalanceAmt() {
		return balanceAmt;
	}

	public void setBalanceAmt(BigDecimal balanceAmt) {
		this.balanceAmt = balanceAmt;
	}

	public Date getFirstDate() {
		return firstDate;
	}

	public void setFirstDate(Date firstDate) {
		this.firstDate = firstDate;
	}

	public Long getTotalNum() {
		return totalNum;
	}

	public void setTotalNum(Long totalNum) {
		this.totalNum = totalNum;
	}

	public Long getOrdinaryNum() {
		return ordinaryNum;
	}

	public void setOrdinaryNum(Long ordinaryNum) {
		this.ordinaryNum = ordinaryNum;
	}

	public Long getUrgentNum() {
		return urgentNum;
	}

	public void setUrgentNum(Long urgentNum) {
		this.urgentNum = urgentNum;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((balanceAmt == null) ? 0 : balanceAmt.hashCode());
		result = prime * result + ((firstDate == null) ? 0 : firstDate.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((ordinaryNum == null) ? 0 : ordinaryNum.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((totalNum == null) ? 0 : totalNum.hashCode());
		result = prime * result + ((urgentNum == null) ? 0 : urgentNum.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
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
		OcrSearchUserBuyListVo other = (OcrSearchUserBuyListVo) obj;
		if (balanceAmt == null) {
			if (other.balanceAmt != null)
				return false;
		} else if (!balanceAmt.equals(other.balanceAmt))
			return false;
		if (firstDate == null) {
			if (other.firstDate != null)
				return false;
		} else if (!firstDate.equals(other.firstDate))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (ordinaryNum == null) {
			if (other.ordinaryNum != null)
				return false;
		} else if (!ordinaryNum.equals(other.ordinaryNum))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (telephone == null) {
			if (other.telephone != null)
				return false;
		} else if (!telephone.equals(other.telephone))
			return false;
		if (totalNum == null) {
			if (other.totalNum != null)
				return false;
		} else if (!totalNum.equals(other.totalNum))
			return false;
		if (urgentNum == null) {
			if (other.urgentNum != null)
				return false;
		} else if (!urgentNum.equals(other.urgentNum))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}
	
	public OcrSearchUserBuyListVo(Object[] rsArray) {
		this.ownerId = Long.valueOf(rsArray[0].toString());
		this.firstDate = (Date)rsArray[1];
		this.username = rsArray[2].toString();
		this.name = rsArray[3].toString();
		if(rsArray[4]!=null)
			this.telephone = rsArray[4].toString();
	}

}
