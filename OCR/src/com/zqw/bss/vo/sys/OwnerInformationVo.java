package com.zqw.bss.vo.sys;

import java.math.BigDecimal;

import com.zqw.bss.framework.model.BaseObject;

public class OwnerInformationVo extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	private Long ownerId;
	
	/**
	 * 本月购买金额
	 */
	private BigDecimal mouthAmt = BigDecimal.ZERO;
	
	/**
	 * 累计购买金额
	 */
	private BigDecimal totalAmt = BigDecimal.ZERO;
	
	/**
	 * 本月购买模块
	 */
	private String mouthProductName;
	
	/**
	 * 累计购买模块
	 */
	private String totalProductName;
	
	/**
	 * 报税人
	 */
	private String taxUser;
	
	/**
	 * 报税状态
	 */
	private String taxStatus;

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public BigDecimal getMouthAmt() {
		return mouthAmt;
	}

	public void setMouthAmt(BigDecimal mouthAmt) {
		this.mouthAmt = mouthAmt;
	}

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public String getMouthProductName() {
		return mouthProductName;
	}

	public void setMouthProductName(String mouthProductName) {
		this.mouthProductName = mouthProductName;
	}

	public String getTotalProductName() {
		return totalProductName;
	}

	public void setTotalProductName(String totalProductName) {
		this.totalProductName = totalProductName;
	}

	public String getTaxUser() {
		return taxUser;
	}

	public void setTaxUser(String taxUser) {
		this.taxUser = taxUser;
	}

	public String getTaxStatus() {
		return taxStatus;
	}

	public void setTaxStatus(String taxStatus) {
		this.taxStatus = taxStatus;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((mouthAmt == null) ? 0 : mouthAmt.hashCode());
		result = prime * result + ((mouthProductName == null) ? 0 : mouthProductName.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((taxStatus == null) ? 0 : taxStatus.hashCode());
		result = prime * result + ((taxUser == null) ? 0 : taxUser.hashCode());
		result = prime * result + ((totalAmt == null) ? 0 : totalAmt.hashCode());
		result = prime * result + ((totalProductName == null) ? 0 : totalProductName.hashCode());
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
		OwnerInformationVo other = (OwnerInformationVo) obj;
		if (mouthAmt == null) {
			if (other.mouthAmt != null)
				return false;
		} else if (!mouthAmt.equals(other.mouthAmt))
			return false;
		if (mouthProductName == null) {
			if (other.mouthProductName != null)
				return false;
		} else if (!mouthProductName.equals(other.mouthProductName))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (taxStatus == null) {
			if (other.taxStatus != null)
				return false;
		} else if (!taxStatus.equals(other.taxStatus))
			return false;
		if (taxUser == null) {
			if (other.taxUser != null)
				return false;
		} else if (!taxUser.equals(other.taxUser))
			return false;
		if (totalAmt == null) {
			if (other.totalAmt != null)
				return false;
		} else if (!totalAmt.equals(other.totalAmt))
			return false;
		if (totalProductName == null) {
			if (other.totalProductName != null)
				return false;
		} else if (!totalProductName.equals(other.totalProductName))
			return false;
		return true;
	}

	public OwnerInformationVo() {
		
	}
}
