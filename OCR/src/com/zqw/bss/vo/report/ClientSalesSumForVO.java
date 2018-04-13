package com.zqw.bss.vo.report;

import java.math.BigDecimal;

import com.zqw.bss.framework.model.BaseObject;

public class ClientSalesSumForVO extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8526806995314741529L;
	/**
	 * 客户或供应商编码
	 */
	private String clientNo;

	/**
	 *客户或供应商对应的ID
	 */
	private Long clientId;
	
	/**
	 * 客户或供应商名称
	 */
	private String name;

	/**
	 * 收入总额
	 */
	private BigDecimal sumAmt;

	public ClientSalesSumForVO(Long clientId, BigDecimal sumAmt) {
		this.clientId = clientId;
		this.sumAmt = sumAmt;

	}

	public ClientSalesSumForVO() {

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
	
	public String getClientNo() {
		return clientNo;
	}

	public void setClientNo(String clientNo) {
		this.clientNo = clientNo;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getSumAmt() {
		return sumAmt;
	}

	public void setSumAmt(BigDecimal sumAmt) {
		this.sumAmt = sumAmt;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ClientSalesSumForVO other = (ClientSalesSumForVO) obj;
		if (clientId == null) {
			if (other.clientId != null)
				return false;
		} else if (!clientId.equals(other.clientId))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (sumAmt == null) {
			if (other.sumAmt != null)
				return false;
		} else if (!sumAmt.equals(other.sumAmt))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((clientId == null) ? 0 : clientId.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((sumAmt == null) ? 0 : sumAmt.hashCode());
		return result;
	}

}
