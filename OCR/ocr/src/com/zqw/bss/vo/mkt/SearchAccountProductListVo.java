package com.zqw.bss.vo.mkt;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.billing.PriceStrategy;

public class SearchAccountProductListVo extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Long id;

	private Date createDate;
	/**
	 * 功能名称
	 */
	private String productName;

	/**
	 * 功能编号
	 */
	private String productCode;
	/**
	 * 功能描述
	 */
	private String description;

	/**
	 * 功能权限
	 */
	private String permission;
	
	/**
	 * 功能价格
	 */
	private BigDecimal priceAmt;

	/**
	 * 功能价格
	 */
	private BigDecimal mounthAmt;

	/**
	 * 功能价格
	 */
	private BigDecimal totalAmt;

	/**
	 * 是否禁用
	 */
	private Boolean status;
	
	/**
	 * 产品/服务图片
	 */
	private String productPhoto;
	
	private List<PriceStrategy> priceStrategy = new ArrayList<PriceStrategy>();

	public List<PriceStrategy> getPriceStrategy() {
		return priceStrategy;
	}

	public void setPriceStrategy(List<PriceStrategy> priceStrategy) {
		this.priceStrategy = priceStrategy;
	}

	public String getProductPhoto() {
		return productPhoto;
	}

	public void setProductPhoto(String productPhoto) {
		this.productPhoto = productPhoto;
	}

	public String getProductCode() {
		return productCode;
	}

	public Boolean getStatus() {
		return status;
	}

	public void setStatus(Boolean status) {
		this.status = status;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getPriceAmt() {
		return priceAmt;
	}

	public void setPriceAmt(BigDecimal priceAmt) {
		this.priceAmt = priceAmt;
	}

	public BigDecimal getMounthAmt() {
		return mounthAmt;
	}

	public void setMounthAmt(BigDecimal mounthAmt) {
		this.mounthAmt = mounthAmt;
	}

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public String getPermission() {
		return permission;
	}

	public void setPermission(String permission) {
		this.permission = permission;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((mounthAmt == null) ? 0 : mounthAmt.hashCode());
		result = prime * result + ((priceAmt == null) ? 0 : priceAmt.hashCode());
		result = prime * result + ((productCode == null) ? 0 : productCode.hashCode());
		result = prime * result + ((productName == null) ? 0 : productName.hashCode());
		result = prime * result + ((permission == null) ? 0 : permission.hashCode());
		result = prime * result + ((totalAmt == null) ? 0 : totalAmt.hashCode());
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
		SearchAccountProductListVo other = (SearchAccountProductListVo) obj;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (mounthAmt == null) {
			if (other.mounthAmt != null)
				return false;
		} else if (!mounthAmt.equals(other.mounthAmt))
			return false;
		if (priceAmt == null) {
			if (other.priceAmt != null)
				return false;
		} else if (!priceAmt.equals(other.priceAmt))
			return false;
		if (productCode == null) {
			if (other.productCode != null)
				return false;
		} else if (!productCode.equals(other.productCode))
			return false;
		if (productName == null) {
			if (other.productName != null)
				return false;
		} else if (!productName.equals(other.productName))
			return false;
		if (permission == null) {
			if (other.permission != null)
				return false;
		} else if (!permission.equals(other.permission))
			return false;
		if (totalAmt == null) {
			if (other.totalAmt != null)
				return false;
		} else if (!totalAmt.equals(other.totalAmt))
			return false;
		return true;
	}

	public SearchAccountProductListVo(Long id, String productName, String description, BigDecimal priceAmt,
			Date createDate, String productCode,Boolean status,String permission,String productPhoto) {
		super();
		this.id = id;
		this.productName = productName;
		this.description = description;
		this.priceAmt = priceAmt;
		this.createDate = createDate;
		this.productCode = productCode;
		this.status = status;
		this.permission = permission;
		this.productPhoto = productPhoto;
	}

	public SearchAccountProductListVo(Long id, BigDecimal totalAmt, Date createDate) {
		super();
		this.id = id;
		this.totalAmt = totalAmt;
		this.createDate = createDate;
	}
	
	public SearchAccountProductListVo(Long id,String productName) {
		super();
		this.id = id;
		this.productName = productName;
	}

}
