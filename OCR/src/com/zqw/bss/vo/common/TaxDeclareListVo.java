package com.zqw.bss.vo.common;

import com.zqw.bss.framework.model.BaseObject;

public class TaxDeclareListVo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long ownerId;
	
	private String mouthDate;
	
	private String username;
	
	private String productName;
	
	private Boolean taxwithStatus;
	
	private Long vat;
	
	private String taxStatus;

	public Boolean getTaxwithStatus() {
		return taxwithStatus;
	}

	public void setTaxwithStatus(Boolean taxwithStatus) {
		this.taxwithStatus = taxwithStatus;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public String getMouthDate() {
		return mouthDate;
	}

	public void setMouthDate(String mouthDate) {
		this.mouthDate = mouthDate;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public Long getVat() {
		return vat;
	}

	public void setVat(Long vat) {
		this.vat = vat;
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
		result = prime * result + ((mouthDate == null) ? 0 : mouthDate.hashCode());
		result = prime * result + ((productName == null) ? 0 : productName.hashCode());
		result = prime * result + ((taxStatus == null) ? 0 : taxStatus.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		result = prime * result + ((vat == null) ? 0 : vat.hashCode());
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
		TaxDeclareListVo other = (TaxDeclareListVo) obj;
		if (mouthDate == null) {
			if (other.mouthDate != null)
				return false;
		} else if (!mouthDate.equals(other.mouthDate))
			return false;
		if (productName == null) {
			if (other.productName != null)
				return false;
		} else if (!productName.equals(other.productName))
			return false;
		if (taxStatus == null) {
			if (other.taxStatus != null)
				return false;
		} else if (!taxStatus.equals(other.taxStatus))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		if (vat == null) {
			if (other.vat != null)
				return false;
		} else if (!vat.equals(other.vat))
			return false;
		return true;
	}
	public TaxDeclareListVo(Object[] rsArray) {
		this.mouthDate=(String)rsArray[0];
		if(rsArray[1]==null)
			this.username = "";
		else
		this.username=(String)rsArray[1];
		if(rsArray[2]!=null)
		this.vat=Long.valueOf(rsArray[2].toString());
		if(rsArray[3]==null){
			this.taxStatus = "本月未申报";
		}else
		this.taxStatus=(String)rsArray[3];
		if(rsArray[4]==null){
			this.taxwithStatus = false;
		}else if(rsArray[4].toString().equals("Y"))
		this.taxwithStatus=true;
	}
	
}
