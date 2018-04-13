package com.zqw.bss.vo.biz;

import java.util.Date;
import java.util.List;

import com.zqw.bss.framework.model.BaseObject;

public class SalesOrderLogVo extends BaseObject{
	
	private static final long serialVersionUID = 1L;
	
	/**
	 * 用户名
	 */
	private String createBy;
	/**
	 * 操作日期
	 */
	private Date handleDate;
	/**
	 * 操作详情 参考字典
	 */
	private String handletype;
	/**
	 * 单号
	 */
	private String orderNumber;
	/**
	 * 单号对应的id
	 */
	private Long id;
	/**
	 * 暂时没用到
	 */
	private String link;
	
	/**
	 * 上传下载的附件名字 
	 */
	private String fileName;
	/**
	 * 附件的id
	 */
	private Long fileId;
	
	/**
	 * 第几周
	 */
	private Long num;
	/**
	 * 年份
	 */
	private String year;
	
	private List<?> data;

	
	
	public List<?> getData() {
		return data;
	}

	public void setData(List<?> data) {
		this.data = data;
	}

	
	public String getCreateBy() {
		return createBy;
	}


	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}


	public Date getHandleDate() {
		return handleDate;
	}


	public void setHandleDate(Date handleDate) {
		this.handleDate = handleDate;
	}


	public String getHandletype() {
		return handletype;
	}


	public void setHandletype(String handletype) {
		this.handletype = handletype;
	}


	public String getOrderNumber() {
		return orderNumber;
	}


	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}



	public String getLink() {
		return link;
	}


	public void setLink(String link) {
		this.link = link;
	}

	public SalesOrderLogVo(){
		
	}
	public SalesOrderLogVo(Object[] array) {
		super();
		if(array[0]!=null){
			this.createBy =array[0].toString();
		}
		if(array[1]!=null){
			this.handleDate =(Date) array[1];
		}
		if(array[2]!=null){
			this.handletype =array[2].toString();
		}
		if(array[3]!=null){
			this.orderNumber = array[3].toString();
		}
		if(array[4]!=null){
			this.id =Long.valueOf(array[4].toString());
		}
		if(array[5]!=null){
			this.link = array[5].toString();
		}
		
	}


	public SalesOrderLogVo(Object[] array, Object obj) {
		if(array[0]!=null){
			this.createBy =array[0].toString();
		}
		if(array[1]!=null){
			this.handleDate =(Date) array[1];
		}
		if(array[2]!=null){
			this.handletype =array[2].toString();
		}
		if(array[3]!=null){
			this.fileName = array[3].toString();
		}
		if(array[4]!=null){
			this.fileId =Long.valueOf(array[4].toString());
		}
		if(array[5]!=null){
			this.num =Long.valueOf(array[5].toString());
		}
		if(array[6]!=null){
			this.year =array[6].toString();
		}
		
	}


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((handleDate == null) ? 0 : handleDate.hashCode());
		result = prime * result + ((handletype == null) ? 0 : handletype.hashCode());
		result = prime * result + (int) (id ^ (id >>> 32));
		result = prime * result + ((link == null) ? 0 : link.hashCode());
		result = prime * result + ((orderNumber == null) ? 0 : orderNumber.hashCode());
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
		SalesOrderLogVo other = (SalesOrderLogVo) obj;
		if (createBy == null) {
			if (other.createBy != null)
				return false;
		} else if (!createBy.equals(other.createBy))
			return false;
		if (handleDate == null) {
			if (other.handleDate != null)
				return false;
		} else if (!handleDate.equals(other.handleDate))
			return false;
		if (handletype == null) {
			if (other.handletype != null)
				return false;
		} else if (!handletype.equals(other.handletype))
			return false;
		if (id != other.id)
			return false;
		if (link == null) {
			if (other.link != null)
				return false;
		} else if (!link.equals(other.link))
			return false;
		if (orderNumber == null) {
			if (other.orderNumber != null)
				return false;
		} else if (!orderNumber.equals(other.orderNumber))
			return false;
		return true;
	}


	public String getFileName() {
		return fileName;
	}


	public void setFileName(String fileName) {
		this.fileName = fileName;
	}


	public Long getFileId() {
		return fileId;
	}


	public void setFileId(Long fileId) {
		this.fileId = fileId;
	}


	public void setId(Long id) {
		this.id = id;
	}

	public Long getNum() {
		return num;
	}

	public void setNum(Long num) {
		this.num = num;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}


	


}
