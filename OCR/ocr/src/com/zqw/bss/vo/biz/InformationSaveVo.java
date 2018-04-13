package com.zqw.bss.vo.biz;

import com.zqw.bss.framework.model.BaseObject;

public class InformationSaveVo extends BaseObject{
	
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String orderNumber;
	
	private String creatBy;
	
	private Long ownerID;

	private Long saleOrderId;
	
	private Long sysuserid;
	
	
	
	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public String getCreatBy() {
		return creatBy;
	}

	public void setCreatBy(String creatBy) {
		this.creatBy = creatBy;
	}

	public Long getOwnerID() {
		return ownerID;
	}

	public void setOwnerID(Long ownerID) {
		this.ownerID = ownerID;
	}
	
	
	public InformationSaveVo(Object[] obj) {
		super();
		this.creatBy = obj[0].toString();
		this.ownerID = Long.valueOf(obj[1].toString());
		this.orderNumber = obj[2].toString();
		this.saleOrderId = Long.valueOf(obj[3].toString());
		this.sysuserid = Long.valueOf(obj[4].toString());
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((creatBy == null) ? 0 : creatBy.hashCode());
		result = prime * result + ((orderNumber == null) ? 0 : orderNumber.hashCode());
		result = prime * result + ((ownerID == null) ? 0 : ownerID.hashCode());
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
		InformationSaveVo other = (InformationSaveVo) obj;
		if (creatBy == null) {
			if (other.creatBy != null)
				return false;
		} else if (!creatBy.equals(other.creatBy))
			return false;
		if (orderNumber == null) {
			if (other.orderNumber != null)
				return false;
		} else if (!orderNumber.equals(other.orderNumber))
			return false;
		if (ownerID == null) {
			if (other.ownerID != null)
				return false;
		} else if (!ownerID.equals(other.ownerID))
			return false;
		return true;
	}

	public Long getSaleOrderId() {
		return saleOrderId;
	}

	public void setSaleOrderId(Long saleOrderId) {
		this.saleOrderId = saleOrderId;
	}

	public Long getSysuserid() {
		return sysuserid;
	}

	public void setSysuserid(Long sysuserid) {
		this.sysuserid = sysuserid;
	}


	
	
	
}
