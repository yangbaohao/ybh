package com.zqw.bss.vo.mkt;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;
/**
 * 代金券管理列表
 * @author win7
 *
 */
public class CouponVo extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/**
	 * 主键id
	 */
	private Long id;
	/**
	 * 兑换券编号
	 */
	private String couponCode;

	/**
	 * 免费模块
	 */
	private String accountProductName;
	
	/**
	 * 免费模块ids
	 */
	private Long[] products;
	
	/**
	 * 是否可使用
	 */
	private Boolean available;
	
	/**
	 * 免费有效期间(月)
	 */
	private Long freeTime; 
	
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
	private String ownerName;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCouponCode() {
		return couponCode;
	}

	public void setCouponCode(String couponCode) {
		this.couponCode = couponCode;
	}

	public String getAccountProductName() {
		return accountProductName;
	}

	public void setAccountProductName(String accountProductName) {
		this.accountProductName = accountProductName;
	}

	public Boolean getAvailable() {
		return available;
	}

	public void setAvailable(Boolean available) {
		this.available = available;
	}

	public Long getFreeTime() {
		return freeTime;
	}

	public void setFreeTime(Long freeTime) {
		this.freeTime = freeTime;
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

	public String getOwnerName() {
		return ownerName;
	}

	public void setOwnerName(String ownerName) {
		this.ownerName = ownerName;
	}

	public Long[] getProducts() {
		return products;
	}

	public void setProducts(Long[] products) {
		this.products = products;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accountProductName == null) ? 0 : accountProductName.hashCode());
		result = prime * result + ((available == null) ? 0 : available.hashCode());
		result = prime * result + ((couponCode == null) ? 0 : couponCode.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((endTime == null) ? 0 : endTime.hashCode());
		result = prime * result + ((freeTime == null) ? 0 : freeTime.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((ownerName == null) ? 0 : ownerName.hashCode());
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
		CouponVo other = (CouponVo) obj;
		if (accountProductName == null) {
			if (other.accountProductName != null)
				return false;
		} else if (!accountProductName.equals(other.accountProductName))
			return false;
		if (available == null) {
			if (other.available != null)
				return false;
		} else if (!available.equals(other.available))
			return false;
		if (couponCode == null) {
			if (other.couponCode != null)
				return false;
		} else if (!couponCode.equals(other.couponCode))
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
		if (freeTime == null) {
			if (other.freeTime != null)
				return false;
		} else if (!freeTime.equals(other.freeTime))
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
		if (ownerName == null) {
			if (other.ownerName != null)
				return false;
		} else if (!ownerName.equals(other.ownerName))
			return false;
		if (startTime == null) {
			if (other.startTime != null)
				return false;
		} else if (!startTime.equals(other.startTime))
			return false;
		return true;
	}

	public CouponVo() {
		super();
	}
	
	public CouponVo(Object[] object) {
		this.id = Long.valueOf(object[0].toString());
		this.couponCode=(String) object[1];
		this.accountProductName=(String) object[2];
		if('Y' == ((Character)object[3])){
			this.available = Boolean.TRUE;
		}else{
			this.available = Boolean.FALSE;
		}
		
		this.freeTime=Long.valueOf(object[4].toString());
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");                        
		try {
			if(object[5] != null)
			this.startTime=sdf.parse(object[5].toString());
			if(object[6] != null)
			this.endTime=sdf.parse(object[6].toString());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		this.ownerName=(String) object[7];
	}
	
}
