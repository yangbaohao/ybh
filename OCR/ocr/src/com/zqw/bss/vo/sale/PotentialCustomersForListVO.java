package com.zqw.bss.vo.sale;

import com.zqw.bss.framework.model.BaseObject;

public class PotentialCustomersForListVO extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = -335415535866026472L;
	
	/**
	 * id
	 */
	private Long id;
	
	/**
	 * 潜在用户名
	 */
	private String potentialName;
	
	/**
	 * 电话或手机
	 */
	private String phone;

	/**
	 * 批次
	 */
	private String batchNum;
	

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPotentialName() {
		return potentialName;
	}

	public void setPotentialName(String potentialName) {
		this.potentialName = potentialName;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getBatchNum() {
		return batchNum;
	}

	public void setBatchNum(String batchNum) {
		this.batchNum = batchNum;
	}

	@Override
	public boolean equals(Object arg0) {
		if (this == arg0)
			return true;
		if (getClass() != arg0.getClass())
			return false;
		PotentialCustomersForListVO other = (PotentialCustomersForListVO) arg0;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(id))
			return false;
		if (potentialName == null) {
			if (other.potentialName != null)
				return false;
		}  else if (!potentialName.equals(other.potentialName))
			return false;
		if (phone == null) {
			if (other.phone != null)
				return false;
		}  else if (!phone.equals(other.phone))
			return false;
		if (batchNum == null) {
			if (other.batchNum != null)
				return false;
		}  else if (!batchNum.equals(other.batchNum))
			return false;
		return true;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((potentialName == null) ? 0 : potentialName.hashCode());
		result = prime * result + ((phone == null) ? 0 : phone.hashCode());
		result = prime * result + ((batchNum == null) ? 0 : batchNum.hashCode());
		return result;
	}

	public PotentialCustomersForListVO(Long id, String potentialName, String phone, String batchNum) {
		super();
		this.id = id;
		this.potentialName = potentialName;
		this.phone = phone;
		this.batchNum = batchNum;
	}

	public PotentialCustomersForListVO() {
		super();
	}

}
