package com.zqw.bss.model.mkt;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.DispatchType;
import com.zqw.bss.util.SystemConstant.VoucherType;

/**
 * <p>
 * 代金券
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.hp.com
 * </p>
 * 
 * <code>Voucher</code>类用于描述代金券对象。
 * <p>
 * 用于订单付费上可以抵消部分费用
 * </p>
 * 
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0
 */
@Entity
@Table(name = "t_bss_voucher")
public class Voucher extends BaseObject {

	private static final long serialVersionUID = 8089920204793724263L;

	/**
	 * 主键id
	 */
	private Long id;
	/**
	 * 代金券编号
	 */
	private String voucherCode;
	/**
	 * 代金券名称
	 */
	private String name;

	/**
	 * 代金券金额
	 */
	private BigDecimal amount;

	/**
	 * 是否已使用
	 */
	private Boolean available=Boolean.TRUE;
	public Voucher(String name, String voucherCode, BigDecimal amount, DispatchType dispatchType, String startDate, String endDate, String voucherType) {

		this.voucherCode = voucherCode;

		this.amount = amount;

		this.name=name;
		this.dispatchType = dispatchType;

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			this.startTime = sdf.parse(startDate);
			this.endTime = sdf.parse(endDate);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (voucherType.equals("ordinary")) {
			this.type=VoucherType.ordinary;
		}else if(voucherType.equals("all")){
			this.type=VoucherType.all;
		}

		
	
	}

	/**
	 * 是否过期
	 */
	private Boolean overdue=Boolean.FALSE;
	/**
	 * 分发类型
	 */
	private DispatchType dispatchType;
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
	
	private Long ownerId;
	//优惠卷类型
	private VoucherType type;
	@Enumerated(EnumType.STRING)
	public VoucherType getType() {
		return type;
	}

	public void setType(VoucherType type) {
		this.type = type;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column(nullable = false, unique = true)
	public String getVoucherCode() {
		return voucherCode;
	}

	public void setVoucherCode(String voucherCode) {
		this.voucherCode = voucherCode;
	}

	@Column(nullable = false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(nullable = false)
	public BigDecimal getAmount() {
		return amount;
	}

	
	

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}
	public Voucher(String name,String voucherCode,BigDecimal amount,
			DispatchType dispatchType, String startTime, String endTime, Long ownerId,String voucherType) {
		super();
		this.voucherCode = voucherCode;

		this.amount = amount;

		this.name=name;
		this.dispatchType = dispatchType;
		this.ownerId = ownerId;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			this.startTime = sdf.parse(startTime);
			this.endTime = sdf.parse(endTime);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if (voucherType.equals("ordinary")) {
			this.type=VoucherType.ordinary;
		}else if(voucherType.equals("all")){
			this.type=VoucherType.all;
		}

		
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getOverdue() {
		return overdue;
	}

	public void setOverdue(Boolean overdue) {
		this.overdue = overdue;
	}
	@Column(nullable = false)
	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	@Column(nullable = false)
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	public DispatchType getDispatchType() {
		return dispatchType;
	}

	public void setDispatchType(DispatchType dispatchType) {
		this.dispatchType = dispatchType;
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

	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((amount == null) ? 0 : amount.hashCode());
		result = prime * result + ((available == null) ? 0 : available.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((dispatchType == null) ? 0 : dispatchType.hashCode());
		result = prime * result + ((endTime == null) ? 0 : endTime.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((overdue == null) ? 0 : overdue.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((startTime == null) ? 0 : startTime.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		result = prime * result + ((voucherCode == null) ? 0 : voucherCode.hashCode());
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
		Voucher other = (Voucher) obj;
		if (amount == null) {
			if (other.amount != null)
				return false;
		} else if (!amount.equals(other.amount))
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
		if (dispatchType != other.dispatchType)
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
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (overdue == null) {
			if (other.overdue != null)
				return false;
		} else if (!overdue.equals(other.overdue))
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
		if (type != other.type)
			return false;
		if (voucherCode == null) {
			if (other.voucherCode != null)
				return false;
		} else if (!voucherCode.equals(other.voucherCode))
			return false;
		return true;
	}

	public int use() {
		if (this.available = false) {
			return 1;
		} else {
			this.available = false;
			return 0;
		}

	}

	public Voucher() {
		super();
		// TODO Auto-generated constructor stub
	}

}
