package com.zqw.bss.model.sale;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.util.AutoValueIgnore;
/**
 * 批量发送短信 
 * 
 */
@Entity
@Table(name = "t_bss_short_message")
public class ShortMessage extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 主键id
	 */
	private Long id;

	/**
	 * 短信编号
	 */
	private String messageCode;

	/**
	 * 短信内容
	 */
	private String messageContent;

	/**
	 * 短信主题
	 */
	private String messageTitle;

	/**
	 * 发送人数
	 */
	private int messageNumber;

	/**
	 * 发送人（销售人员）
	 */
	private User sales;
	
	/**
	 *  发送人 (客服)
	 */
	private User customer;

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	
	private List<MessageLog> messageLogs=new ArrayList<MessageLog>();
	
	private Long potentialCustomersId;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getMessageCode() {
		return messageCode;
	}

	public void setMessageCode(String messageCode) {
		this.messageCode = messageCode;
	}

	public String getMessageContent() {
		return messageContent;
	}

	public void setMessageContent(String messageContent) {
		this.messageContent = messageContent;
	}

	public String getMessageTitle() {
		return messageTitle;
	}

	public void setMessageTitle(String messageTitle) {
		this.messageTitle = messageTitle;
	}

	public int getMessageNumber() {
		return messageNumber;
	}

	public void setMessageNumber(int messageNumber) {
		this.messageNumber = messageNumber;
	}

	@ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
	public User getSales() {
		return sales;
	}

	public void setSales(User sales) {
		this.sales = sales;
	}
	
	
	@ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	public String getLastUpdateBy() {
		return lastUpdateBy;
	}

	public void setLastUpdateBy(String lastUpdateBy) {
		this.lastUpdateBy = lastUpdateBy;
	}

	@AutoValueIgnore
	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE }, fetch = FetchType.EAGER)
	@JoinColumn(name = "shortmessage_id")
	@BatchSize(size = 50)
	public List<MessageLog> getMessageLogs() {
		return messageLogs;
	}

	public void setMessageLogs(List<MessageLog> messageLogs) {
		this.messageLogs = messageLogs;
	}
	
	@Transient
	public Long getPotentialCustomersId() {
		return potentialCustomersId;
	}

	public void setPotentialCustomersId(Long potentialCustomersId) {
		this.potentialCustomersId = potentialCustomersId;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ShortMessage other = (ShortMessage) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (messageCode == null) {
			if (other.messageCode != null)
				return false;
		} else if (!messageCode.equals(other.messageCode))
			return false;
		if (messageContent == null) {
			if (other.messageContent != null)
				return false;
		} else if (!messageContent.equals(other.messageContent))
			return false;
		if (messageTitle == null) {
			if (other.messageTitle != null)
				return false;
		} else if (!messageTitle.equals(other.messageTitle))
			return false;
		if (sales == null) {
			if (other.sales != null)
				return false;
		} else if (!sales.equals(other.sales))
			return false;
		return false;
	}



	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id== null) ? 0 : id.hashCode());
		result = prime * result + ((messageCode== null) ? 0 : messageCode.hashCode());
		result = prime * result + ((messageContent== null) ? 0 : messageContent.hashCode());
		result = prime * result + ((messageTitle== null) ? 0 : messageTitle.hashCode());
		result = prime * result + messageNumber;
		result = prime * result + ((sales== null) ? 0 : sales.hashCode());
		result = prime * result + ((createDate== null) ? 0 : createDate.hashCode());
		result = prime * result + ((createBy== null) ? 0 : createBy.hashCode());
		result = prime * result + ((lastUpdateDate== null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((lastUpdateBy== null) ? 0 : lastUpdateBy.hashCode());
		return 0;
	}

}
