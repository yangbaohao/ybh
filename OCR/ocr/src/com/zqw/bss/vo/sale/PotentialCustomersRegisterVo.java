package com.zqw.bss.vo.sale;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;

public class PotentialCustomersRegisterVo extends BaseObject {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * id
	 */
	private Long id;
	/**
	 * 潜在用户名
	 */
	private String potentialName;
	/**
	 * 注册日期
	 */
	private Date createDate;
	/**
	 * 电话或手机
	 */
	private String phone;
	/**
	 * 公司名
	 */
	private String contact;
	/**
	 * 短信内容
	 */
	//private List<String> messageContent = new ArrayList<>();
	private String [] messageContent;


//	public PotentialCustomersRegisterVo(Object[] o, List<ShortMessage> shortMessageList) {
//		this.id =Long.valueOf(o[0]+"");
//		this.createDate = (Date) o[1];
//		this.potentialName = (String) o[2];
//		this.phone = (String) o[3];
//		this.contact = (String) o[4];
//		for (ShortMessage shortMessage : shortMessageList) {
//			messageContent.add(shortMessage.getMessageContent());
//		}
//	}

	public PotentialCustomersRegisterVo(Object obj) {
		Object[]o=(Object[]) obj;
		this.id =Long.valueOf(o[0]+"");
		this.createDate = (Date) o[1];
		this.potentialName = (String) o[2];
		this.phone = (String) o[3];
		this.contact = (String) o[4];
		 String[] split = ((String)o[5]).split("---------");
		 this.messageContent=split;
		
	}



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

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}



	public String[] getMessageContent() {
		return messageContent;
	}

	public void setMessageContent(String[] messageContent) {
		this.messageContent = messageContent;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}



	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((contact == null) ? 0 : contact.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + Arrays.hashCode(messageContent);
		result = prime * result + ((phone == null) ? 0 : phone.hashCode());
		result = prime * result + ((potentialName == null) ? 0 : potentialName.hashCode());
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
		PotentialCustomersRegisterVo other = (PotentialCustomersRegisterVo) obj;
		if (contact == null) {
			if (other.contact != null)
				return false;
		} else if (!contact.equals(other.contact))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (!Arrays.equals(messageContent, other.messageContent))
			return false;
		if (phone == null) {
			if (other.phone != null)
				return false;
		} else if (!phone.equals(other.phone))
			return false;
		if (potentialName == null) {
			if (other.potentialName != null)
				return false;
		} else if (!potentialName.equals(other.potentialName))
			return false;
		return true;
	}
	
	

}
