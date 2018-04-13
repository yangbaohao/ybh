package com.zqw.bss.model.billing;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.util.SystemConstant.PayStatus;

/**
 * <p>
 * 订单
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.hp.com
 * </p>
 * 
 * <code>AccountOrder</code>类用于描述订单对象。
 * <p>
 * 订单是用户发起订购的初始行为和订购数据信息
 * <ul>
 * <li>订单可以用优惠券抵用部分价格</li>
 * </ul>
 * </p>
 * 
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0
 */
@Entity
@Table(name = "t_bss_order")
public class AccountOrder extends BaseObject {

	private static final long serialVersionUID = -1229915509309350048L;

	/**
	 * 主键id
	 */
	private Long id;
	// payment_amount, payment_type to do
	/**
	 * 渠道
	 */
	private String channel;

	/**
	 * 自定义产品id
	 */
	private List<AccountProduct> accountProducts;

	/**
	 * 订单编号
	 */
	private String orderCode;
	/**
	 *	按月计费记录多少个月，按年计费记录多少个月 
	 **/
	private Integer timeNum;
	/**
	 * 订单创建日期
	 */
	private Date orderCreateDate;

	/**
	 * 订单总价
	 */
	private BigDecimal totalAmt = new BigDecimal(0);

	private PayStatus payStatus;

	/**
	 * 订单开始日期
	 */
	private Date orderBeginDate;
	/**
	 * 订单结束日期
	 */
	private Date orderEndDate;
	
	public Date getOrderEndDate() {
		return orderEndDate;
	}

	public void setOrderEndDate(Date orderEndDate) {
		this.orderEndDate = orderEndDate;
	}

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;

	/**
	 * 发起订购用户对象信息
	 */
	private Long ownerId;
	
	@Column(nullable = false)
	public String getOrderCode() {
		return orderCode;
	}

	public void setOrderCode(String orderCode) {
		this.orderCode = orderCode;
	}

	@Column(nullable = false)
	public Date getOrderCreateDate() {
		return orderCreateDate;
	}

	public void setOrderCreateDate(Date orderCreateDate) {
		this.orderCreateDate = orderCreateDate;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column(nullable = false)
	public String getChannel() {
		return channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
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

	@Column(nullable = false)
	public Date getOrderBeginDate() {
		return orderBeginDate;
	}

	public void setOrderBeginDate(Date orderBeginDate) {
		this.orderBeginDate = orderBeginDate;
	}

	public Integer getTimeNum() {
		return timeNum;
	}

	public void setTimeNum(Integer timeNum) {
		this.timeNum = timeNum;
	}

	@ManyToMany( fetch = FetchType.EAGER)
	@JoinTable(name = "t_bss_order_product_info", joinColumns = { @JoinColumn(name = "order_id") }, inverseJoinColumns = {
			@JoinColumn(name = "product_id") })
	@BatchSize(size = 100)
	public List<AccountProduct> getAccountProducts() {
		return accountProducts;
	}

	public void setAccountProducts(List<AccountProduct> accountProducts) {
		this.accountProducts = accountProducts;
	}

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	@Enumerated(EnumType.STRING)
	public PayStatus getPayStatus() {
		return payStatus;
	}

	public void setPayStatus(PayStatus payStatus) {
		this.payStatus = payStatus;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}
	
	public AccountOrder() {}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((channel == null) ? 0 : channel.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((orderBeginDate == null) ? 0 : orderBeginDate.hashCode());
		result = prime * result + ((orderCode == null) ? 0 : orderCode.hashCode());
		result = prime * result + ((orderCreateDate == null) ? 0 : orderCreateDate.hashCode());

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
		AccountOrder other = (AccountOrder) obj;
		if (channel == null) {
			if (other.channel != null)
				return false;
		} else if (!channel.equals(other.channel))
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
		if (orderBeginDate == null) {
			if (other.orderBeginDate != null)
				return false;
		} else if (!orderBeginDate.equals(other.orderBeginDate))
			return false;
		if (orderCode == null) {
			if (other.orderCode != null)
				return false;
		} else if (!orderCode.equals(other.orderCode))
			return false;
		if (orderCreateDate == null) {
			if (other.orderCreateDate != null)
				return false;
		} else if (!orderCreateDate.equals(other.orderCreateDate))
			return false;
		return true;
	}

}
