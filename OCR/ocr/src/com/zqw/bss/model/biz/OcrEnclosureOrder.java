package com.zqw.bss.model.biz;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zqw.account.framework.model.BaseObject;

/**
 * 备份保存销售单提交到ocr快捷开单的信息
 */
@Entity
@Table(name = "t_ocr_enclosureOrder")
public class OcrEnclosureOrder  extends BaseObject{
	private static final long serialVersionUID = 1L;
	
	/**
	 * 主键
	 */
	private Long id;
	/**
	 * 单号
	 */
	private String orderNumber;
	/**
	 * 对应上传文件的id列表
	 */
	private String fileInfoIds="";
	/**
	 * 备注（打印出现）;
	 */
	private String remarkPrint;
	/**
	 * 与总揽页面唯一对应的uuid
	 */
	private Long uuid;
	
	private Long ownerId;
	
	protected Date createDate;
	
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
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
	public String getFileInfoIds() {
		return fileInfoIds;
	}
	public void setFileInfoIds(String fileInfoIds) {
		this.fileInfoIds = fileInfoIds;
	}
	public String getRemarkPrint() {
		return remarkPrint;
	}
	public void setRemarkPrint(String remarkPrint) {
		this.remarkPrint = remarkPrint;
	}
	public Long getUuid() {
		return uuid;
	}
	public void setUuid(Long uuid) {
		this.uuid = uuid;
	}
	
	public Long getOwnerId() {
		return ownerId;
	}
	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((fileInfoIds == null) ? 0 : fileInfoIds.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((orderNumber == null) ? 0 : orderNumber.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((remarkPrint == null) ? 0 : remarkPrint.hashCode());
		result = prime * result + ((uuid == null) ? 0 : uuid.hashCode());
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
		OcrEnclosureOrder other = (OcrEnclosureOrder) obj;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (fileInfoIds == null) {
			if (other.fileInfoIds != null)
				return false;
		} else if (!fileInfoIds.equals(other.fileInfoIds))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (orderNumber == null) {
			if (other.orderNumber != null)
				return false;
		} else if (!orderNumber.equals(other.orderNumber))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (remarkPrint == null) {
			if (other.remarkPrint != null)
				return false;
		} else if (!remarkPrint.equals(other.remarkPrint))
			return false;
		if (uuid == null) {
			if (other.uuid != null)
				return false;
		} else if (!uuid.equals(other.uuid))
			return false;
		return true;
	}
	
}









