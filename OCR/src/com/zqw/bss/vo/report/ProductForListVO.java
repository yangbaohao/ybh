package com.zqw.bss.vo.report;

import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.ProductserviceType;

/**
 * <p>Title:</p>
 * <p>Description: 产品列表信息</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author zhangzhe
 * @date  2016年5月17日 下午7:56:49
 * @version 1.0
 */
/**
 * <p>Title:</p>
 * <p>Description:</p>
 * <p>Copyright: Copyright (c) 2016 </p>
 * <p>Company:zqw</p>
 * @author Dhuan
 * @date 2016年6月24日 下午4:17:35
 * @version 1.0
 */
/**
 * <p>Title:</p>
 * <p>Description:</p>
 * <p>Copyright: Copyright (c) 2016 </p>
 * <p>Company:zqw</p>
 * @author Dhuan
 * @date 2016年6月24日 下午4:17:37
 * @version 1.0
 */
public class ProductForListVO extends BaseObject {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5058004319117148522L;

	/**
	 *id
	 */
	private Long id;

	/**
	 *产品名称
	 */
	private String name;
	
	/**
	 * sku编码
	 */
	private String sku;

	/**
	 * 销售价格
	 */
	private BigDecimal salePrice= new BigDecimal(0);
	
	/**
	 * 销售价格
	 */
	private BigDecimal priceContainVat= new BigDecimal(0);
	
	/**
	 * 采购价格
	 */
	private BigDecimal costPrice= new BigDecimal(0);
	
	/**
	 * 是否计入库存
	 */
	private Boolean inventoryFlag;
	
	/**
	 * 是否允许折扣
	 *//*
	private Boolean discountFlag;*/
	
	/**
	 * 最低折扣
	 *//*
	private Long discount;*/
	
	/**
	 *最低销售价格
	 */
	private BigDecimal minimumSalePrice = BigDecimal.ZERO;
	
	/**
	 * 销售信息
	 */
	private String salesInfo;
	
	/**
	 * 采购信息
	 */
	private String buyInfo;
	
	/**
	 * 产品规格型号
	 */
	private String spec;
	/**
	 * 产品计量单位
	 */
	private String unit;
	/**
	 *产品类型
	 */
	private String type;
	
	/**
	 *销售增值税率 %，自动带到销售单
	 */
	private Long saleVAT;

	/**
	 *采购增值税率 %，自动带到销售单
	 */
	private Long buyVAT;
	
	/**
	 * 日期
	 * @return
	 */
	private Date createDate;
	
	/**
	 * 最低库存报警
	 */
	private Long warnMinimum;
	
	private ProductserviceType productserviceType;

	public BigDecimal getPriceContainVat() {
		return priceContainVat;
	}

	public void setPriceContainVat(BigDecimal priceContainVat) {
		this.priceContainVat = priceContainVat;
	}

	public Long getWarnMinimum() {
		return warnMinimum;
	}

	public void setWarnMinimum(Long warnMinimum) {
		this.warnMinimum = warnMinimum;
	}

	public ProductserviceType getProductserviceType() {
		return productserviceType;
	}

	public void setProductserviceType(ProductserviceType productserviceType) {
		this.productserviceType = productserviceType;
	}

	public Long getSaleVAT() {
		return saleVAT;
	}

	public void setSaleVAT(Long saleVAT) {
		this.saleVAT = saleVAT;
	}

	public Long getBuyVAT() {
		return buyVAT;
	}

	public void setBuyVAT(Long buyVAT) {
		this.buyVAT = buyVAT;
	}

	/*public Long getDiscount() {
		return discount;
	}

	public void setDiscount(Long discount) {
		this.discount = discount;
	}*/

	public BigDecimal getCostPrice() {
		return costPrice;
	}

	public void setCostPrice(BigDecimal costPrice) {
		this.costPrice = costPrice;
	}

	/*public Boolean getDiscountFlag() {
		return discountFlag;
	}

	public void setDiscountFlag(Boolean discountFlag) {
		this.discountFlag = discountFlag;
	}*/

	public Boolean getInventoryFlag() {
		return inventoryFlag;
	}

	public void setInventoryFlag(Boolean inventoryFlag) {
		this.inventoryFlag = inventoryFlag;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public BigDecimal getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
	}

	
	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}

	public String getSalesInfo() {
		return salesInfo;
	}

	public void setSalesInfo(String salesInfo) {
		this.salesInfo = salesInfo;
	}

	public String getBuyInfo() {
		return buyInfo;
	}

	public void setBuyInfo(String buyInfo) {
		this.buyInfo = buyInfo;
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}	

	public void setName(String name) {
		this.name = name;
	}

	public String getSpec() {
		return spec;
	}

	public void setSpec(String spec) {
		this.spec = spec;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public BigDecimal getMinimumSalePrice() {
		return minimumSalePrice;
	}

	public void setMinimumSalePrice(BigDecimal minimumSalePrice) {
		this.minimumSalePrice = minimumSalePrice;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ProductForListVO other = (ProductForListVO) obj;
		if (buyInfo == null) {
			if (other.buyInfo != null)
				return false;
		} else if (!buyInfo.equals(other.buyInfo))
			return false;
		if (buyVAT == null) {
			if (other.buyVAT != null)
				return false;
		} else if (!buyVAT.equals(other.buyVAT))
			return false;
		if (costPrice == null) {
			if (other.costPrice != null)
				return false;
		} else if (!costPrice.equals(other.costPrice))
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
		if (inventoryFlag == null) {
			if (other.inventoryFlag != null)
				return false;
		} else if (!inventoryFlag.equals(other.inventoryFlag))
			return false;
		if (minimumSalePrice == null) {
			if (other.minimumSalePrice != null)
				return false;
		} else if (!minimumSalePrice.equals(other.minimumSalePrice))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (productserviceType != other.productserviceType)
			return false;
		if (salePrice == null) {
			if (other.salePrice != null)
				return false;
		} else if (!salePrice.equals(other.salePrice))
			return false;
		if (saleVAT == null) {
			if (other.saleVAT != null)
				return false;
		} else if (!saleVAT.equals(other.saleVAT))
			return false;
		if (salesInfo == null) {
			if (other.salesInfo != null)
				return false;
		} else if (!salesInfo.equals(other.salesInfo))
			return false;
		if (sku == null) {
			if (other.sku != null)
				return false;
		} else if (!sku.equals(other.sku))
			return false;
		if (spec == null) {
			if (other.spec != null)
				return false;
		} else if (!spec.equals(other.spec))
			return false;
		if (type == null) {
			if (other.type != null)
				return false;
		} else if (!type.equals(other.type))
			return false;
		if (unit == null) {
			if (other.unit != null)
				return false;
		} else if (!unit.equals(other.unit))
			return false;
		if (warnMinimum == null) {
			if (other.warnMinimum != null)
				return false;
		} else if (!warnMinimum.equals(other.warnMinimum))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((buyInfo == null) ? 0 : buyInfo.hashCode());
		result = prime * result + ((buyVAT == null) ? 0 : buyVAT.hashCode());
		result = prime * result + ((costPrice == null) ? 0 : costPrice.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((inventoryFlag == null) ? 0 : inventoryFlag.hashCode());
		result = prime * result + ((minimumSalePrice == null) ? 0 : minimumSalePrice.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((productserviceType == null) ? 0 : productserviceType.hashCode());
		result = prime * result + ((salePrice == null) ? 0 : salePrice.hashCode());
		result = prime * result + ((saleVAT == null) ? 0 : saleVAT.hashCode());
		result = prime * result + ((salesInfo == null) ? 0 : salesInfo.hashCode());
		result = prime * result + ((sku == null) ? 0 : sku.hashCode());
		result = prime * result + ((spec == null) ? 0 : spec.hashCode());
		result = prime * result + ((type == null) ? 0 : type.hashCode());
		result = prime * result + ((unit == null) ? 0 : unit.hashCode());
		result = prime * result + ((warnMinimum == null) ? 0 : warnMinimum.hashCode());
		return result;
	}

	public ProductForListVO(Long id, String name,String sku, String salesInfo , String buyInfo, 
			String type,String spec, Date createDate,String unit,BigDecimal salesPrice,BigDecimal priceContainVat,BigDecimal costPrice, 
			Boolean inventoryFlag,BigDecimal minimumSalePrice,Long saleVAT ,Long buyVAT ,ProductserviceType productserviceType, Long warnMinimum) {
		super();
		this.id = id;
		this.name = name;
		this.sku = sku;
		this.salesInfo = salesInfo;
		this.buyInfo = buyInfo;
		this.spec = spec;
		this.unit = unit;
		this.type = type;
		this.createDate =createDate;
		this.salePrice = salesPrice;
		this.priceContainVat = priceContainVat;
		this.costPrice = costPrice;
		this.inventoryFlag = inventoryFlag;
		//this.discountFlag = discountFlag;
		//this.discount = discount;
		this.minimumSalePrice = minimumSalePrice;
		this.saleVAT = saleVAT;
		this.buyVAT = buyVAT;
		this.productserviceType = productserviceType;
		this.warnMinimum =  warnMinimum;
	}

	public ProductForListVO() {
		super();
	}
	

}
