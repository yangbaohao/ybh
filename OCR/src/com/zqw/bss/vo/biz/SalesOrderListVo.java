package com.zqw.bss.vo.biz;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class SalesOrderListVo extends BaseObject{
	
	private static final long serialVersionUID = 1L;
	/**
	 * 单号
	 */
	private String orderNumber;
	/**
	 * 服务类型
	 */
	private String serviceType;
	/**
	 * 单据状态
	 */
	private String orderType;
	/**
	 * 负责人
	 */
	private String responsibleName;
	/**
	 * 联系电话
	 */
	private String telephone;
	/**
	 * 用户名
	 */
	private String userName;
	/**
	 * 商户名称
	 */
	private String ownerName;
	/**
	 * 提交时间(客户那边的提交时间)
	 */
	private Date submitDate;
	/**
	 * 接单时间(也就是抢单成功时间)
	 */
	private Date orderSuccessDate;
	/**
	 * 完成时间(也就是客服第提交的时间)
	 */
	private Date orderSubmitDate;
	/**
	 * 审核时间
	 */
	private Date checkSuccessDate;
	/**
	 * 用户成功确认 时间
	 */
	private Date completeDate;
	
	private Long id;
	/**
	 * 销售单的ownerId 用来调用小商的接口用
	 */
	private Long soOwnerId;
	/**
	 * 总揽页面每一条记录的id
	 */
	private Long uuid;
	
	/**
	 * 每条总揽对应销售单详情的数量 
	 */
	private Long detailQty;
	
	/**
	 * 第几个单子 
	 */
	private Long ocrCount;
	
	/**
	 * 审批开始时间
	 */
	private Date checkBeginDate;
	
	/**
	 * 审核负责人
	 */
	private String checkName;
	
	/**
	 * 复核开始时间
	 */
	private Date checkAgainBeginDate;
	/**
	 * 复核结束时间
	 */
	private Date checkAgainSuccessDate;
	
	
	
	public SalesOrderListVo(Object[] array) {
		super();
		if(array[0]!=null){
			this.orderNumber =array[0].toString();
		}
		if(array[1]!=null){
			this.serviceType =array[1].toString();
		}
		if(array[2]!=null){
			this.orderType =array[2].toString();
		}
		if(array[3]!=null){
			this.submitDate =(Date) array[3];
		}
		if(array[4]!=null){
			this.orderSuccessDate =(Date) array[4];
		}
		if(array[5]!=null){
			this.orderSubmitDate =(Date) array[5];
		}
		if(array[6]!=null){
			this.checkSuccessDate =(Date) array[6];
		}
		if(array[7]!=null){
			this.completeDate =(Date) array[7];
		}
		if(array[8]!=null){
			this.responsibleName =array[8].toString();
		}
		if(array[9]!=null){
			this.telephone =array[9].toString();
		}
		if(array[10]!=null){
			this.userName =array[10].toString();
		}
		if(array[11]!=null){
			this.ownerName =array[11].toString();
		}
		if(array[12]!=null){
			this.id =Long.valueOf(array[12].toString());
		}
		if(array[13]!=null){
			this.soOwnerId =Long.valueOf(array[13].toString());
		}
		if(array[14]!=null){
			this.uuid =Long.valueOf(array[14].toString());
		}
		if(array[15]!=null){			
			this.detailQty =Long.valueOf(array[15].toString());
		}
		if(array[16]!=null){//
			this.ocrCount =Long.valueOf(array[16].toString());
		}
		if(array[17]!=null){//
			this.checkBeginDate =(Date)array[17];
		}
		if(array[18]!=null){//
			this.checkName =array[18].toString();
		}
		if(array[19]!=null){
			this.checkAgainBeginDate =(Date)array[19];
		}
		if(array[20]!=null){
			this.checkAgainSuccessDate =(Date)array[20];
		}
	}
	
	
	
	public SalesOrderListVo(Object[] array,Object o) {
		super();
		if(array[0]!=null){
			this.orderNumber =array[0].toString();
		}
		if(array[1]!=null){
			this.serviceType =array[1].toString();
		}
		if(array[2]!=null){
			this.orderType =array[2].toString();
		}
		if(array[3]!=null){
			this.submitDate =(Date) array[3];
		}
		if(array[4]!=null){
			this.orderSuccessDate =(Date) array[4];
		}
		if(array[5]!=null){
			this.orderSubmitDate =(Date) array[5];
		}
		if(array[6]!=null){
			this.checkSuccessDate =(Date) array[6];
		}
		if(array[7]!=null){
			this.completeDate =(Date) array[7];
		}
		if(array[8]!=null){
			this.responsibleName =array[8].toString();
		}
		if(array[9]!=null){
			this.telephone =array[9].toString();
		}
		if(array[10]!=null){
			this.userName =array[10].toString();
		}
		if(array[11]!=null){
			this.ownerName =array[11].toString();
		}
		if(array[12]!=null){
			this.id =Long.valueOf(array[12].toString());
		}
		if(array[13]!=null){
			this.soOwnerId =Long.valueOf(array[13].toString());
		}
	}
	
	
	
	public Long getSoOwnerId() {
		return soOwnerId;
	}

	public void setSoOwnerId(Long soOwnerId) {
		this.soOwnerId = soOwnerId;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getOrderNumber() {
		return orderNumber;
	}
	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}
	public String getServiceType() {
		return serviceType;
	}
	public void setServiceType(String serviceType) {
		this.serviceType = serviceType;
	}
	public String getOrderType() {
		return orderType;
	}
	public void setOrderType(String orderType) {
		this.orderType = orderType;
	}
	public String getResponsibleName() {
		return responsibleName;
	}
	public void setResponsibleName(String responsibleName) {
		this.responsibleName = responsibleName;
	}
	public String getTelephone() {
		return telephone;
	}
	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getOwnerName() {
		return ownerName;
	}
	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
	}
	public Date getSubmitDate() {
		return submitDate;
	}
	public void setSubmitDate(Date submitDate) {
		this.submitDate = submitDate;
	}
	public Date getOrderSuccessDate() {
		return orderSuccessDate;
	}
	public void setOrderSuccessDate(Date orderSuccessDate) {
		this.orderSuccessDate = orderSuccessDate;
	}
	public Date getOrderSubmitDate() {
		return orderSubmitDate;
	}
	public void setOrderSubmitDate(Date orderSubmitDate) {
		this.orderSubmitDate = orderSubmitDate;
	}
	public Date getCheckSuccessDate() {
		return checkSuccessDate;
	}
	public void setCheckSuccessDate(Date checkSuccessDate) {
		this.checkSuccessDate = checkSuccessDate;
	}
	public Date getCompleteDate() {
		return completeDate;
	}
	public void setCompleteDate(Date completeDate) {
		this.completeDate = completeDate;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((checkSuccessDate == null) ? 0 : checkSuccessDate.hashCode());
		result = prime * result + ((completeDate == null) ? 0 : completeDate.hashCode());
		result = prime * result + ((orderNumber == null) ? 0 : orderNumber.hashCode());
		result = prime * result + ((orderSubmitDate == null) ? 0 : orderSubmitDate.hashCode());
		result = prime * result + ((orderSuccessDate == null) ? 0 : orderSuccessDate.hashCode());
		result = prime * result + ((orderType == null) ? 0 : orderType.hashCode());
		result = prime * result + ((ownerName == null) ? 0 : ownerName.hashCode());
		result = prime * result + ((responsibleName == null) ? 0 : responsibleName.hashCode());
		result = prime * result + ((serviceType == null) ? 0 : serviceType.hashCode());
		result = prime * result + ((submitDate == null) ? 0 : submitDate.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((userName == null) ? 0 : userName.hashCode());
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
		SalesOrderListVo other = (SalesOrderListVo) obj;
		if (checkSuccessDate == null) {
			if (other.checkSuccessDate != null)
				return false;
		} else if (!checkSuccessDate.equals(other.checkSuccessDate))
			return false;
		if (completeDate == null) {
			if (other.completeDate != null)
				return false;
		} else if (!completeDate.equals(other.completeDate))
			return false;
		if (orderNumber == null) {
			if (other.orderNumber != null)
				return false;
		} else if (!orderNumber.equals(other.orderNumber))
			return false;
		if (orderSubmitDate == null) {
			if (other.orderSubmitDate != null)
				return false;
		} else if (!orderSubmitDate.equals(other.orderSubmitDate))
			return false;
		if (orderSuccessDate == null) {
			if (other.orderSuccessDate != null)
				return false;
		} else if (!orderSuccessDate.equals(other.orderSuccessDate))
			return false;
		if (orderType == null) {
			if (other.orderType != null)
				return false;
		} else if (!orderType.equals(other.orderType))
			return false;
		if (ownerName == null) {
			if (other.ownerName != null)
				return false;
		} else if (!ownerName.equals(other.ownerName))
			return false;
		if (responsibleName == null) {
			if (other.responsibleName != null)
				return false;
		} else if (!responsibleName.equals(other.responsibleName))
			return false;
		if (serviceType == null) {
			if (other.serviceType != null)
				return false;
		} else if (!serviceType.equals(other.serviceType))
			return false;
		if (submitDate == null) {
			if (other.submitDate != null)
				return false;
		} else if (!submitDate.equals(other.submitDate))
			return false;
		if (telephone == null) {
			if (other.telephone != null)
				return false;
		} else if (!telephone.equals(other.telephone))
			return false;
		if (userName == null) {
			if (other.userName != null)
				return false;
		} else if (!userName.equals(other.userName))
			return false;
		return true;
	}




	public Long getUuid() {
		return uuid;
	}




	public void setUuid(Long uuid) {
		this.uuid = uuid;
	}

	public Long getDetailQty() {
		return detailQty;
	}

	public void setDetailQty(Long detailQty) {
		this.detailQty = detailQty;
	}



	public Long getOcrCount() {
		return ocrCount;
	}



	public void setOcrCount(Long ocrCount) {
		this.ocrCount = ocrCount;
	}



	public Date getCheckBeginDate() {
		return checkBeginDate;
	}



	public void setCheckBeginDate(Date checkBeginDate) {
		this.checkBeginDate = checkBeginDate;
	}



	public String getCheckName() {
		return checkName;
	}



	public void setCheckName(String checkName) {
		this.checkName = checkName;
	}



	public Date getCheckAgainBeginDate() {
		return checkAgainBeginDate;
	}



	public void setCheckAgainBeginDate(Date checkAgainBeginDate) {
		this.checkAgainBeginDate = checkAgainBeginDate;
	}



	public Date getCheckAgainSuccessDate() {
		return checkAgainSuccessDate;
	}



	public void setCheckAgainSuccessDate(Date checkAgainSuccessDate) {
		this.checkAgainSuccessDate = checkAgainSuccessDate;
	}
	
	


}
