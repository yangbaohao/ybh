package com.zqw.bss.vo.report;

import java.math.BigDecimal;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>
 * 账龄报表对应VO
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * 
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
public class AgingReportVO extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8526806995314741529L;
	/**
	 *客户或供应商对应的ID
	 */
	private Long clientId;
	
	private String name;
	/**
	 *未超期
	 */
	private BigDecimal normalAmt = BigDecimal.ZERO.setScale(2, BigDecimal.ROUND_HALF_UP);
	/**
	 *超期 1-30
	 */
	private BigDecimal dueAmt30 = BigDecimal.ZERO.setScale(2, BigDecimal.ROUND_HALF_UP);
	/**
	 *超期 31-60
	 */
	private BigDecimal dueAmt60 = BigDecimal.ZERO.setScale(2, BigDecimal.ROUND_HALF_UP);
	/**
	 *超期 61-90
	 */
	private BigDecimal dueAmt90 = BigDecimal.ZERO.setScale(2, BigDecimal.ROUND_HALF_UP);

	/**
	 *超期90以上
	 */
	private BigDecimal dueAmtMore90 = BigDecimal.ZERO.setScale(2, BigDecimal.ROUND_HALF_UP);

	/**
	 *所有超期额合计
	 */
	private BigDecimal dueAmtAll;

	public AgingReportVO(Long clientId, BigDecimal normalAmt,
			BigDecimal dueAmtAll) {
		this.clientId = clientId;
		this.normalAmt = normalAmt;
		this.dueAmtAll = dueAmtAll;
	}

	public AgingReportVO() {

	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getNormalAmt() {
		return normalAmt;
	}

	public void setNormalAmt(BigDecimal normalAmt) {
		this.normalAmt = normalAmt;
	}

	public BigDecimal getDueAmt30() {
		return dueAmt30;
	}

	public void setDueAmt30(BigDecimal dueAmt30) {
		this.dueAmt30 = dueAmt30;
	}

	public BigDecimal getDueAmt60() {
		return dueAmt60;
	}

	public void setDueAmt60(BigDecimal dueAmt60) {
		this.dueAmt60 = dueAmt60;
	}

	public BigDecimal getDueAmt90() {
		return dueAmt90;
	}

	public void setDueAmt90(BigDecimal dueAmt90) {
		this.dueAmt90 = dueAmt90;
	}

	public BigDecimal getDueAmtAll() {
		return dueAmtAll;
	}

	public void setDueAmtAll(BigDecimal dueAmtAll) {
		this.dueAmtAll = dueAmtAll;
	}

	public BigDecimal getDueAmtMore90() {
		return dueAmtMore90;
	}

	public void setDueAmtMore90(BigDecimal dueAmtMore90) {
		this.dueAmtMore90 = dueAmtMore90;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((clientId == null) ? 0 : clientId.hashCode());
		result = prime * result + ((dueAmt30 == null) ? 0 : dueAmt30.hashCode());
		result = prime * result + ((dueAmt60 == null) ? 0 : dueAmt60.hashCode());
		result = prime * result + ((dueAmt90 == null) ? 0 : dueAmt90.hashCode());
		result = prime * result + ((dueAmtAll == null) ? 0 : dueAmtAll.hashCode());
		result = prime * result + ((dueAmtMore90 == null) ? 0 : dueAmtMore90.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((normalAmt == null) ? 0 : normalAmt.hashCode());
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
		AgingReportVO other = (AgingReportVO) obj;
		if (clientId == null) {
			if (other.clientId != null)
				return false;
		} else if (!clientId.equals(other.clientId))
			return false;
		if (dueAmt30 == null) {
			if (other.dueAmt30 != null)
				return false;
		} else if (!dueAmt30.equals(other.dueAmt30))
			return false;
		if (dueAmt60 == null) {
			if (other.dueAmt60 != null)
				return false;
		} else if (!dueAmt60.equals(other.dueAmt60))
			return false;
		if (dueAmt90 == null) {
			if (other.dueAmt90 != null)
				return false;
		} else if (!dueAmt90.equals(other.dueAmt90))
			return false;
		if (dueAmtAll == null) {
			if (other.dueAmtAll != null)
				return false;
		} else if (!dueAmtAll.equals(other.dueAmtAll))
			return false;
		if (dueAmtMore90 == null) {
			if (other.dueAmtMore90 != null)
				return false;
		} else if (!dueAmtMore90.equals(other.dueAmtMore90))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (normalAmt == null) {
			if (other.normalAmt != null)
				return false;
		} else if (!normalAmt.equals(other.normalAmt))
			return false;
		return true;
	}

}
