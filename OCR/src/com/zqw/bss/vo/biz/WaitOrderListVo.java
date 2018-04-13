package com.zqw.bss.vo.biz;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class WaitOrderListVo extends BaseObject{
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 服务类型
	 */
	private String serviceType;
	
	/**
	 * 开始时间
	 */
	private Date endDate;
	/**
	 * 结束时间
	 */
	private Date begingDate;
	
	/**
	 * 单数
	 */
	private Long orderQty;

	/**
	 * 单据状态
	 */
	private String orderApprovalStatus;
	
	public WaitOrderListVo(Object[] array) {
			super();
			if(array[0]!=null){
				this.orderQty =Long.valueOf(array[0].toString());
			}
			if(array[1]!=null){
				this.begingDate =(Date) array[1];
			}
			if(array[2]!=null){
				this.endDate =(Date) array[2];
			}
			if(array[3]!=null){
				this.serviceType =array[3].toString();
			}
	}

	
	
	public String getServiceType() {
		return serviceType;
	}

	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Date getBegingDate() {
		return begingDate;
	}

	public void setBegingDate(Date begingDate) {
		this.begingDate = begingDate;
	}

	public Long getOrderQty() {
		return orderQty;
	}

	public void setOrderQty(Long orderQty) {
		this.orderQty = orderQty;
	}

	
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((begingDate == null) ? 0 : begingDate.hashCode());
		result = prime * result + ((endDate == null) ? 0 : endDate.hashCode());
		result = prime * result + ((orderQty == null) ? 0 : orderQty.hashCode());
		result = prime * result + ((serviceType == null) ? 0 : serviceType.hashCode());
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
		WaitOrderListVo other = (WaitOrderListVo) obj;
		if (begingDate == null) {
			if (other.begingDate != null)
				return false;
		} else if (!begingDate.equals(other.begingDate))
			return false;
		if (endDate == null) {
			if (other.endDate != null)
				return false;
		} else if (!endDate.equals(other.endDate))
			return false;
		if (orderQty == null) {
			if (other.orderQty != null)
				return false;
		} else if (!orderQty.equals(other.orderQty))
			return false;
		if (serviceType == null) {
			if (other.serviceType != null)
				return false;
		} else if (!serviceType.equals(other.serviceType))
			return false;
		return true;
	}

	public String getOrderApprovalStatus() {
		return orderApprovalStatus;
	}

	public void setOrderApprovalStatus(String orderApprovalStatus) {
		this.orderApprovalStatus = orderApprovalStatus;
	}


}
