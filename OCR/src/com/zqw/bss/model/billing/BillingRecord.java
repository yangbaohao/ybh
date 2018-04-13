/**
 * 
 */
package com.zqw.bss.model.billing;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.Channel;
import com.zqw.bss.util.SystemConstant.PayStatus;



/**
 * @author chxiaoqi
 *
 */
@Entity
@Table(name = "t_biz_billingrecord")
public class BillingRecord extends BaseObject {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5361287530284140025L;

	/**
	 * 主键
	 */
	private Long id;
	
	/**
	 * ownerId
	 */
	private Long ownerId;
	
	/**
	 * 订单编号
	 */
	private String requestId;
	
	/**
	 * 支付状态
	 */
	private PayStatus status;
	
	/**
	 * 第三方交易流水号
	 */
	private String flowNo;
	
	/**
	 * 支付用户
	 */
	private String accountCode;


	private String customerName;
    
	private AccountOrderPay accountOrderPay;
    /**
     * 充值渠道
     */
    private Channel channel;
    
    /**
     * 充值金额，单位元，保留两位
     */
    private BigDecimal amount;
    
    /**
     * 记录创建时间
     */
    private Date createDate;

	private String createBy;

	/**
	 * 完成支付时间
	 */
	private Date lastUpdateDate;

	private String lastUpdateBy;

	/*@Column(nullable=false,updatable=false)
	public String getProvider() {
		return provider;
	}

	public void setProvider(String provider) {
		this.provider = provider;
	}
*/
	@Column(updatable=false)
	public String getRequestId() {
		return requestId;
	}

	public void setRequestId(String requestId) {
		this.requestId = requestId;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Enumerated(EnumType.STRING)
	@Column(nullable=false)
	public PayStatus getStatus() {
		return status;
	}

	public void setStatus(PayStatus status) {
		this.status = status;
	}

	@Column(nullable=true)
	public String getFlowNo() {
		return flowNo;
	}

	public void setFlowNo(String flowNo) {
		this.flowNo = flowNo;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	public AccountOrderPay getAccountOrderPay() {
		return accountOrderPay;
	}

	public void setAccountOrderPay(AccountOrderPay accountOrderPay) {
		this.accountOrderPay = accountOrderPay;
	}
	
	public String getAccountCode() {
		return accountCode;
	}

	public void setAccountCode(String accountCode) {
		this.accountCode = accountCode;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	@Enumerated(EnumType.STRING)
	@Column(nullable=false,updatable=false)
	public Channel getChannel() {
		return channel;
	}

	public void setChannel(Channel channel) {
		this.channel = channel;
	}

	@Column(nullable=false,updatable=false)
	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	@Column(nullable=false,updatable=false)
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@Column(nullable=false,updatable=false)
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

	/* (non-Javadoc)
	 * @see com.hp.ts.bss.framework.model.BaseObject#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		BillingRecord other = (BillingRecord)obj;
		if (createBy == null) {
			if (other.createBy != null)
				return false;
		} else if (!createBy.equals(other.createBy))
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
		else if (!customerName.equals(other.customerName))
			return false;
		if (amount != other.amount)
			return false;

		if (lastUpdateBy == null) {
			if (other.lastUpdateBy != null)
				return false;
		} else if (!lastUpdateBy.equals(other.lastUpdateBy))
			return false;
		if (lastUpdateDate == null) {
			if (other.lastUpdateDate != null)
				return false;
		} else if (!lastUpdateDate.equals(other.lastUpdateDate))
			return false;
		return false;
	}

	/* (non-Javadoc)
	 * @see com.hp.ts.bss.framework.model.BaseObject#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result
				+ ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result
				+ ((id == null) ? 0 : id.hashCode());
		result = prime * result
				+ ((customerName == null) ? 0 : customerName.hashCode());
		result = prime * result
				+ ((amount == null) ? 0 : amount.hashCode());
		result = prime * result
				+ ((flowNo == null) ? 0 : flowNo.hashCode());
		result = prime * result
				+ ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result
				+ ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		return result;
	}

	@Column(nullable=false)
	public Long getOwnerId() {
		return ownerId;
	}
	
	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

}
