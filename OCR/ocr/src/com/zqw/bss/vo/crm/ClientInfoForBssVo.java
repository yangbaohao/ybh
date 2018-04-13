package com.zqw.bss.vo.crm;

import com.zqw.bss.framework.model.BaseObject;

public class ClientInfoForBssVo extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id ;
	
	/**
	 * 客户编号
	 */
	private String number;
	
	/**
	 * 客户名称
	 */
	private String name;
	
	private String type;
	/**
	 * 客户简称
	 */
	private String shortName;
	
	/**
	 * 是否客户
	 */
	private Boolean customerFlag ;

	/**
	 * 是否供应商
	 */
	private Boolean vendorType;

	/**
	 * 客户账期时间数
	 */
	private Long customerTermValue;

	/**
	 * 供应商账期时间数
	 */
	private Long vendorTermValue;
	
	/**
	 * 是不是报税产生
	 */
	private Boolean isBsscreate;

	private Boolean orderFlag;
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Boolean getOrderFlag() {
		return orderFlag;
	}

	public void setOrderFlag(Boolean orderFlag) {
		this.orderFlag = orderFlag;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getShortName() {
		return shortName;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	public Boolean getCustomerFlag() {
		return customerFlag;
	}

	public void setCustomerFlag(Boolean customerFlag) {
		this.customerFlag = customerFlag;
	}

	public Boolean getVendorType() {
		return vendorType;
	}

	public void setVendorType(Boolean vendorType) {
		this.vendorType = vendorType;
	}

	public Long getCustomerTermValue() {
		return customerTermValue;
	}

	public void setCustomerTermValue(Long customerTermValue) {
		this.customerTermValue = customerTermValue;
	}

	public Long getVendorTermValue() {
		return vendorTermValue;
	}

	public void setVendorTermValue(Long vendorTermValue) {
		this.vendorTermValue = vendorTermValue;
	}

	public Boolean getIsBsscreate() {
		return isBsscreate;
	}

	public void setIsBsscreate(Boolean isBsscreate) {
		this.isBsscreate = isBsscreate;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((customerFlag == null) ? 0 : customerFlag.hashCode());
		result = prime * result + ((customerTermValue == null) ? 0 : customerTermValue.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((isBsscreate == null) ? 0 : isBsscreate.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((number == null) ? 0 : number.hashCode());
		result = prime * result + ((shortName == null) ? 0 : shortName.hashCode());
		result = prime * result + ((vendorTermValue == null) ? 0 : vendorTermValue.hashCode());
		result = prime * result + ((vendorType == null) ? 0 : vendorType.hashCode());
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
		ClientInfoForBssVo other = (ClientInfoForBssVo) obj;
		if (customerFlag == null) {
			if (other.customerFlag != null)
				return false;
		} else if (!customerFlag.equals(other.customerFlag))
			return false;
		if (customerTermValue == null) {
			if (other.customerTermValue != null)
				return false;
		} else if (!customerTermValue.equals(other.customerTermValue))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (isBsscreate == null) {
			if (other.isBsscreate != null)
				return false;
		} else if (!isBsscreate.equals(other.isBsscreate))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (number == null) {
			if (other.number != null)
				return false;
		} else if (!number.equals(other.number))
			return false;
		if (shortName == null) {
			if (other.shortName != null)
				return false;
		} else if (!shortName.equals(other.shortName))
			return false;
		if (vendorTermValue == null) {
			if (other.vendorTermValue != null)
				return false;
		} else if (!vendorTermValue.equals(other.vendorTermValue))
			return false;
		if (vendorType == null) {
			if (other.vendorType != null)
				return false;
		} else if (!vendorType.equals(other.vendorType))
			return false;
		return true;
	}

	public ClientInfoForBssVo(Object[] rsArray){
		this.id = Long.valueOf(rsArray[0].toString());
		if(rsArray[1]!=null)
		this.number = rsArray[1].toString();
		if(rsArray[2].toString().equals("Y"))
			this.customerFlag = true;
		else
			this.customerFlag = false;
		if(rsArray[3].toString().equals("Y"))
			this.vendorType = true;
		else
			this.vendorType = false;
		if(rsArray[4]!=null)
		this.customerTermValue = Long.valueOf(rsArray[4].toString());
		if(rsArray[5]!=null)
		this.vendorTermValue = Long.valueOf(rsArray[5].toString());
		
		if(rsArray[6]!=null&&rsArray[6].toString().equals("Y"))
			this.isBsscreate = true;
		else
			this.isBsscreate = false;
		if(rsArray[7]!=null)
		this.name =  rsArray[7].toString();
		if(rsArray[8]!=null)
		this.shortName =  rsArray[8].toString();
		if(rsArray[9]!=null&&rsArray[9].toString().equals("Y"))
			this.orderFlag = true;
		else
			this.orderFlag = false;
		this.type = rsArray[10].toString();
	}
}
