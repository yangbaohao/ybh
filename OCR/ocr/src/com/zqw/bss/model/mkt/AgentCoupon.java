package com.zqw.bss.model.mkt;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.sale.SalesAgent;

/**
 * <p>
 * 代理商免费使用期限
 * </p>
 * 
 * <p>
 * </p>
 * 
 * <code>Coupon</code>类用于描述免费兑换券对象。
 * <p>
 * </p>
 * 
 * 
 * @version 1.0
 */
@Entity
@Table(name = "t_bss_agentCoupon")
public class AgentCoupon extends BaseObject {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * 主键id
	 */
	private Long id;

	/**
	 * 免费模块
	 */
	private List<AccountProduct> accountProductList = new ArrayList<AccountProduct>();
	
	/**
	 *代理商 
	 */
	private SalesAgent salesAgent;
	/**
	 * 是否可使用
	 */
	private Boolean available=Boolean.TRUE;
	
	private Long mouth;
	
	/**
	 * 有效期开始时间
	 */
	private Date startTime;
	/**
	 * 有效期结束时间
	 */
	private Date endTime;

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;

	/**
	 * 使用用户
	 */
	private Long ownerId;
	
	public AgentCoupon() {
		super();
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	@ManyToMany( fetch = FetchType.EAGER)
	@JoinTable(name = "t_bss_agentcoupon_product_info", joinColumns = { @JoinColumn(name = "agentCoupon_id") }, inverseJoinColumns = {
			@JoinColumn(name = "account_product_id") })
	@BatchSize(size = 100)
	public List<AccountProduct> getAccountProductList() {
		return accountProductList;
	}

	public void setAccountProductList(List<AccountProduct> accountProductList) {
		this.accountProductList = accountProductList;
	}

	public Long getMouth() {
		return mouth;
	}

	public void setMouth(Long mouth) {
		this.mouth = mouth;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}
	@ManyToOne(cascade ={ CascadeType.PERSIST, CascadeType.REMOVE }, targetEntity = SalesAgent.class)
	@JoinColumn(name = "salesAgent_id")
	public SalesAgent getSalesAgent() {
		return salesAgent;
	}

	public void setSalesAgent(SalesAgent salesAgent) {
		this.salesAgent = salesAgent;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	@Column(nullable = false, updatable = false)
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@Column(nullable = false, updatable = false)
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

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accountProductList == null) ? 0 : accountProductList.hashCode());
		result = prime * result + ((available == null) ? 0 : available.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((endTime == null) ? 0 : endTime.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((startTime == null) ? 0 : startTime.hashCode());
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
		AgentCoupon other = (AgentCoupon) obj;
		if (accountProductList == null) {
			if (other.accountProductList != null)
				return false;
		} else if (!accountProductList.equals(other.accountProductList))
			return false;
		if (available == null) {
			if (other.available != null)
				return false;
		} else if (!available.equals(other.available))
			return false;
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
		if (endTime == null) {
			if (other.endTime != null)
				return false;
		} else if (!endTime.equals(other.endTime))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
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
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (startTime == null) {
			if (other.startTime != null)
				return false;
		} else if (!startTime.equals(other.startTime))
			return false;
		return true;
	}

	

}
