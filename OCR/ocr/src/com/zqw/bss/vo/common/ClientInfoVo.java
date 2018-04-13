package com.zqw.bss.vo.common;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>Title:</p>
 * <p>Description:</p>
 * <p>Copyright: Copyright (c) 2016 </p>
 * <p>Company:zqw</p>
 * @author Dhuan
 * @date 2016年5月14日 上午10:40:55
 * @version 1.0
 */
public class ClientInfoVo  extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -3779970198223655890L;
	
	/**
	 * id
	 */
	private Long clientId;
	
	/**
	 * id
	 */
	private Long userInfoid;
	
	/**
	 * 客户（供应商）名称
	 */
	private String  name;
	
	/**
	 * 客户编码
	 */
	private String clientNumber;
	
	/**
	 * 是不是客户
	 */
	private Boolean customerFlag = Boolean.FALSE;

	/**
	 * 是不是供应商
	 */
	private Boolean vendorType = Boolean.FALSE;
	
	/**
	 * 客户账期
	 * @param customerFlag
	 */
	private Long customerTermValue;
	
	/**
	 * 供应商账期时间数
	 */
	private Long vendorTermValue;
	
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

	public Boolean getCustomerFlag() {
		return customerFlag;
	}

	public Boolean getVendorType() {
		return vendorType;
	}

	public void setCustomerFlag(Boolean customerFlag) {
		this.customerFlag = customerFlag;
	}

	public void setVendorType(Boolean vendorType) {
		this.vendorType = vendorType;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getUserInfoid() {
		return userInfoid;
	}

	public void setUserInfoid(Long userInfoid) {
		this.userInfoid = userInfoid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getClientNumber() {
		return clientNumber;
	}

	public void setClientNumber(String clientNumber) {
		this.clientNumber = clientNumber;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((customerFlag == null) ? 0 : customerFlag.hashCode());
		result = prime * result + ((vendorType == null) ? 0 : vendorType.hashCode());
		result = prime * result + ((clientId == null) ? 0 : clientId.hashCode());
		result = prime * result + ((userInfoid == null) ? 0 : userInfoid.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;

		if (getClass() != obj.getClass())
			return false;
		ClientInfoVo other = (ClientInfoVo) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (userInfoid == null) {
			if (other.userInfoid != null)
				return false;
		} else if (!userInfoid.equals(other.userInfoid))
			return false;
		if (clientId == null) {
			if (other.clientId != null)
				return false;
		} else if (!clientId.equals(other.clientId))
			return false;
		if (customerFlag == null) {
			if (other.customerFlag != null)
				return false;
		} else if (!customerFlag.equals(other.customerFlag))
			return false;
		if (vendorType == null) {
			if (other.vendorType != null)
				return false;
		} else if (!vendorType.equals(other.vendorType))
			return false;
		return true;
	}

	public ClientInfoVo(Long clientId, Long userInfoid, String name,String clientNumber,Boolean customerFlag, Boolean vendorType) {
		super();
		this.clientId = clientId;
		this.userInfoid = userInfoid;
		this.name = name;
		this.customerFlag = customerFlag;
		this.vendorType = vendorType;
		this.clientNumber = clientNumber;
	}
	
	public ClientInfoVo(Long clientId, Long userInfoid, String name,String clientNumber,
			Boolean customerFlag, Boolean vendorType,Long customerTermValue , Long vendorTermValue) {
		super();
		this.clientId = clientId;
		this.userInfoid = userInfoid;
		this.name = name;
		this.customerFlag = customerFlag;
		this.vendorType = vendorType;
		this.clientNumber = clientNumber;
		this.customerTermValue = customerTermValue;
		this.vendorTermValue = vendorTermValue;
	}
	public ClientInfoVo(Long clientId, Long userInfoid, String name,Boolean customerFlag, Boolean vendorType) {
		super();
		this.clientId = clientId;
		this.userInfoid = userInfoid;
		this.name = name;
		this.customerFlag = customerFlag;
		this.vendorType = vendorType;
	}
	
	public ClientInfoVo(Long clientId, Long userInfoid, String name,Boolean customerFlag, Boolean vendorType
			,Long customerTermValue , Long vendorTermValue) {
		super();
		this.clientId = clientId;
		this.userInfoid = userInfoid;
		this.name = name;
		this.customerFlag = customerFlag;
		this.vendorType = vendorType;
		this.customerTermValue = customerTermValue;
		this.vendorTermValue = vendorTermValue;
	}
}
