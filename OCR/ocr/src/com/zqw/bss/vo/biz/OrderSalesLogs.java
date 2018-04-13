package com.zqw.bss.vo.biz;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class OrderSalesLogs extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long id ;
	
	private String orderApprovalStatus;
	private String handleType;
	private String remark;

	private String createBy;
	
	private String submitRemark;
	
	private Date handleDate;
	
	private String checkRemark;
	
	private String refusedRemark;
	
	private String backRemark;
	
	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOrderApprovalStatus() {
		return orderApprovalStatus;
	}

	public void setOrderApprovalStatus(String orderApprovalStatus) {
		this.orderApprovalStatus = orderApprovalStatus;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}


	
	
	public OrderSalesLogs(){
		
	}
	public OrderSalesLogs(Object[] obj) {
		super();
		if(obj[0]!=null){
			this.id = Long.valueOf(obj[0].toString());
		}
		if(obj[1]!=null){
			this.handleType = obj[1].toString();
		}
		if(obj[2]!=null){
			this.checkRemark = obj[2].toString();
		}
		if(obj[3]!=null){
			this.submitRemark = obj[3].toString();
		}
		if(obj[4]!=null){
			this.createBy = obj[4].toString();
		}
		if(obj[5]!=null){//
			this.handleDate = (Date)obj[5];
		}
		if(obj[6]!=null){
			this.refusedRemark = obj[6].toString();
		}
		if(obj[7]!=null){
			this.backRemark = obj[7].toString();
		}
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public String getSubmitRemark() {
		return submitRemark;
	}

	public void setSubmitRemark(String submitRemark) {
		this.submitRemark = submitRemark;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((orderApprovalStatus == null) ? 0 : orderApprovalStatus.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((submitRemark == null) ? 0 : submitRemark.hashCode());
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
		OrderSalesLogs other = (OrderSalesLogs) obj;
		if (createBy == null) {
			if (other.createBy != null)
				return false;
		} else if (!createBy.equals(other.createBy))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (orderApprovalStatus == null) {
			if (other.orderApprovalStatus != null)
				return false;
		} else if (!orderApprovalStatus.equals(other.orderApprovalStatus))
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		if (submitRemark == null) {
			if (other.submitRemark != null)
				return false;
		} else if (!submitRemark.equals(other.submitRemark))
			return false;
		return true;
	}

	public String getHandleType() {
		return handleType;
	}

	public void setHandleType(String handleType) {
		this.handleType = handleType;
	}

	public Date getHandleDate() {
		return handleDate;
	}

	public void setHandleDate(Date handleDate) {
		this.handleDate = handleDate;
	}

	public String getCheckRemark() {
		return checkRemark;
	}

	public void setCheckRemark(String checkRemark) {
		this.checkRemark = checkRemark;
	}

	public String getRefusedRemark() {
		return refusedRemark;
	}

	public void setRefusedRemark(String refusedRemark) {
		this.refusedRemark = refusedRemark;
	}

	public String getBackRemark() {
		return backRemark;
	}

	public void setBackRemark(String backRemark) {
		this.backRemark = backRemark;
	}
	
}
