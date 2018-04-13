package com.zqw.bss.model.biz;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.zqw.bss.framework.model.BaseObject;

/**
 * 存放ocr销售单详情的信息
 */
@Entity
@Table(name = "t_ocr_saleOrderDetail")
public  class OcrSaleOrderDetail extends BaseObject {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 主键
	 */
	private Long id;
	/**
	 * 客服的ownerId
	 */
	private Long ownerId;
	/**
	 * 最后更新时间
	 */
	private Date lastUpdateDate;
	/**
	 * 最后更新人
	 */
	private String lastUpdateBy;
	/**
	 * 创建时间
	 */
	private Date createDate;
	/**
	 * 创建人
	 */
	private String createBy;
	/**
	 * 重量
	 */
	private BigDecimal weight = BigDecimal.ZERO;
	/**
	 * 长 厘米
	 */
	private BigDecimal extent;
	/**
	 * 宽 厘米
	 */
	private BigDecimal breadth;
	/**
	 * 高 厘米
	 */
	private BigDecimal altitude;
	
	/**
	 * 体积 立方米
	 */
	private BigDecimal volume;
	/**
	 * 总箱数
	 */
	private BigDecimal totalCartons=BigDecimal.ZERO;
	/**
	 * 每箱数量
	 */
	private BigDecimal eachCartons;
	/**
	 * 显示字段设置
	 */
	private String settings;
	/**
	 * 打印品名内容
	 */
	private String printOfGoods;

	/**
	 *折扣前单价
	 */
	private BigDecimal priceBefore;

	/**
	 *数量
	 */
	private BigDecimal qty;
	
	/**
	 * 本次送货
	 */
	private BigDecimal deliveryQtyNow=BigDecimal.ZERO;
	
	/**
	 * 产品名称
	 */
	private String productName;
	/**
	 * 产品名称id
	 */
	private Long productNameId;
	/**
	 * 规格型号
	 */
	private String spec;
	/**
	 * 规格型号id
	 */
	private Long prodSpecId;
	/**
	 *	颜色 
	 */
	private String color;
	/**
	 *	颜色 id
	 */
	private Long prodColourId;
	
	/**
	 * 图片
	 */
	private Long photoId;
	
	/**
	 *	图片id  如果是新增 
	 */
	private Long photoAddId;
	
	
	private String sequence;
	
	private String remark;
	/**
	 * 细码多个用逗号隔开
	 */
	private String yards;
	
	/**
	 * 单位和主单位的比率原来的单位是副单位
	 */
	private BigDecimal unitRate = BigDecimal.ONE;
	
	/**
	 * 主单位
	 */
	private String basicUnit="";
	
	/**
	 * 副单位对应的总数量（报表使用）
	 */
	private BigDecimal reportQty;
	
	/**
	 * 副单位记录到销售单
	 */
	private String unit="";
	
	private Boolean unitsFlag=false;
	
	/**
	 * 库存数量公式
	 */
	private String inventoryQtyFormula = "qty";
	/**
	 * 金额公式
	 */
	private String amountFormula = "price * qty";
	
//	@ApiModelProperty(value = "折扣率")
	private BigDecimal discount;
	
///	@ApiModelProperty(value = "原价--开了折扣后的单价")
	private BigDecimal originalPrice;

	
	
	public BigDecimal getVolume() {
		return volume;
	}

	public void setVolume(BigDecimal volume) {
		this.volume = volume;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getSequence() {
		return sequence;
	}

	public void setSequence(String sequence) {
		this.sequence = sequence;
	}

	public BigDecimal getPriceBefore() {
		return priceBefore;
	}

	public void setPriceBefore(BigDecimal priceBefore) {
		this.priceBefore = priceBefore;
	}

	public Long getPhotoAddId() {
		return photoAddId;
	}

	public void setPhotoAddId(Long photoAddId) {
		this.photoAddId = photoAddId;
	}

	public BigDecimal getQty() {
		return qty;
	}

	public void setQty(BigDecimal qty) {
		this.qty = qty;
	}

	public BigDecimal getDeliveryQtyNow() {
		return deliveryQtyNow;
	}

	public void setDeliveryQtyNow(BigDecimal deliveryQtyNow) {
		this.deliveryQtyNow = deliveryQtyNow;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public Long getProductNameId() {
		return productNameId;
	}

	public void setProductNameId(Long productNameId) {
		this.productNameId = productNameId;
	}

	public String getSpec() {
		return spec;
	}

	public void setSpec(String spec) {
		this.spec = spec;
	}

	

	public Long getProdSpecId() {
		return prodSpecId;
	}

	public void setProdSpecId(Long prodSpecId) {
		this.prodSpecId = prodSpecId;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

	

	public Long getProdColourId() {
		return prodColourId;
	}

	public void setProdColourId(Long prodColourId) {
		this.prodColourId = prodColourId;
	}

	public Long getPhotoId() {
		return photoId;
	}

	public void setPhotoId(Long photoId) {
		this.photoId = photoId;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
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

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public BigDecimal getWeight() {
		return weight;
	}

	public void setWeight(BigDecimal weight) {
		this.weight = weight;
	}

	public BigDecimal getExtent() {
		return extent;
	}

	public void setExtent(BigDecimal extent) {
		this.extent = extent;
	}

	public BigDecimal getBreadth() {
		return breadth;
	}

	public void setBreadth(BigDecimal breadth) {
		this.breadth = breadth;
	}

	public BigDecimal getAltitude() {
		return altitude;
	}

	public void setAltitude(BigDecimal altitude) {
		this.altitude = altitude;
	}

	public BigDecimal getTotalCartons() {
		return totalCartons;
	}

	public void setTotalCartons(BigDecimal totalCartons) {
		this.totalCartons = totalCartons;
	}

	public BigDecimal getEachCartons() {
		return eachCartons;
	}

	public void setEachCartons(BigDecimal eachCartons) {
		this.eachCartons = eachCartons;
	}

	public String getSettings() {
		return settings;
	}

	public void setSettings(String settings) {
		this.settings = settings;
	}

	public String getPrintOfGoods() {
		return printOfGoods;
	}

	public void setPrintOfGoods(String printOfGoods) {
		this.printOfGoods = printOfGoods;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((altitude == null) ? 0 : altitude.hashCode());
		result = prime * result + ((breadth == null) ? 0 : breadth.hashCode());
		result = prime * result + ((color == null) ? 0 : color.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((deliveryQtyNow == null) ? 0 : deliveryQtyNow.hashCode());
		result = prime * result + ((eachCartons == null) ? 0 : eachCartons.hashCode());
		result = prime * result + ((extent == null) ? 0 : extent.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((photoAddId == null) ? 0 : photoAddId.hashCode());
		result = prime * result + ((photoId == null) ? 0 : photoId.hashCode());
		result = prime * result + ((priceBefore == null) ? 0 : priceBefore.hashCode());
		result = prime * result + ((printOfGoods == null) ? 0 : printOfGoods.hashCode());
		result = prime * result + ((prodColourId == null) ? 0 : prodColourId.hashCode());
		result = prime * result + ((prodSpecId == null) ? 0 : prodSpecId.hashCode());
		result = prime * result + ((productName == null) ? 0 : productName.hashCode());
		result = prime * result + ((productNameId == null) ? 0 : productNameId.hashCode());
		result = prime * result + ((qty == null) ? 0 : qty.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((sequence == null) ? 0 : sequence.hashCode());
		result = prime * result + ((settings == null) ? 0 : settings.hashCode());
		result = prime * result + ((spec == null) ? 0 : spec.hashCode());
		result = prime * result + ((totalCartons == null) ? 0 : totalCartons.hashCode());
		result = prime * result + ((unit == null) ? 0 : unit.hashCode());
		result = prime * result + ((weight == null) ? 0 : weight.hashCode());
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
		OcrSaleOrderDetail other = (OcrSaleOrderDetail) obj;
		if (altitude == null) {
			if (other.altitude != null)
				return false;
		} else if (!altitude.equals(other.altitude))
			return false;
		if (breadth == null) {
			if (other.breadth != null)
				return false;
		} else if (!breadth.equals(other.breadth))
			return false;
		if (color == null) {
			if (other.color != null)
				return false;
		} else if (!color.equals(other.color))
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
		if (deliveryQtyNow == null) {
			if (other.deliveryQtyNow != null)
				return false;
		} else if (!deliveryQtyNow.equals(other.deliveryQtyNow))
			return false;
		if (eachCartons == null) {
			if (other.eachCartons != null)
				return false;
		} else if (!eachCartons.equals(other.eachCartons))
			return false;
		if (extent == null) {
			if (other.extent != null)
				return false;
		} else if (!extent.equals(other.extent))
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
		if (photoAddId == null) {
			if (other.photoAddId != null)
				return false;
		} else if (!photoAddId.equals(other.photoAddId))
			return false;
		if (photoId == null) {
			if (other.photoId != null)
				return false;
		} else if (!photoId.equals(other.photoId))
			return false;
		if (priceBefore == null) {
			if (other.priceBefore != null)
				return false;
		} else if (!priceBefore.equals(other.priceBefore))
			return false;
		if (printOfGoods == null) {
			if (other.printOfGoods != null)
				return false;
		} else if (!printOfGoods.equals(other.printOfGoods))
			return false;
		if (prodColourId == null) {
			if (other.prodColourId != null)
				return false;
		} else if (!prodColourId.equals(other.prodColourId))
			return false;
		if (prodSpecId == null) {
			if (other.prodSpecId != null)
				return false;
		} else if (!prodSpecId.equals(other.prodSpecId))
			return false;
		if (productName == null) {
			if (other.productName != null)
				return false;
		} else if (!productName.equals(other.productName))
			return false;
		if (productNameId == null) {
			if (other.productNameId != null)
				return false;
		} else if (!productNameId.equals(other.productNameId))
			return false;
		if (qty == null) {
			if (other.qty != null)
				return false;
		} else if (!qty.equals(other.qty))
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		if (sequence == null) {
			if (other.sequence != null)
				return false;
		} else if (!sequence.equals(other.sequence))
			return false;
		if (settings == null) {
			if (other.settings != null)
				return false;
		} else if (!settings.equals(other.settings))
			return false;
		if (spec == null) {
			if (other.spec != null)
				return false;
		} else if (!spec.equals(other.spec))
			return false;
		if (totalCartons == null) {
			if (other.totalCartons != null)
				return false;
		} else if (!totalCartons.equals(other.totalCartons))
			return false;
		if (unit == null) {
			if (other.unit != null)
				return false;
		} else if (!unit.equals(other.unit))
			return false;
		if (weight == null) {
			if (other.weight != null)
				return false;
		} else if (!weight.equals(other.weight))
			return false;
		return true;
	}

	public String getYards() {
		return yards;
	}

	public void setYards(String yards) {
		this.yards = yards;
	}

	public BigDecimal getUnitRate() {
		return unitRate;
	}

	public void setUnitRate(BigDecimal unitRate) {
		this.unitRate = unitRate;
	}

	public String getBasicUnit() {
		return basicUnit;
	}

	public void setBasicUnit(String basicUnit) {
		this.basicUnit = basicUnit;
	}

	public BigDecimal getReportQty() {
		return reportQty;
	}

	public void setReportQty(BigDecimal reportQty) {
		this.reportQty = reportQty;
	}
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getUnitsFlag() {
		return unitsFlag;
	}

	public void setUnitsFlag(Boolean unitsFlag) {
		this.unitsFlag = unitsFlag;
	}

	public String getInventoryQtyFormula() {
		return inventoryQtyFormula;
	}

	public void setInventoryQtyFormula(String inventoryQtyFormula) {
		this.inventoryQtyFormula = inventoryQtyFormula;
	}

	public String getAmountFormula() {
		return amountFormula;
	}

	public void setAmountFormula(String amountFormula) {
		this.amountFormula = amountFormula;
	}

	public BigDecimal getDiscount() {
		return discount;
	}

	public void setDiscount(BigDecimal discount) {
		this.discount = discount;
	}

	public BigDecimal getOriginalPrice() {
		return originalPrice;
	}

	public void setOriginalPrice(BigDecimal originalPrice) {
		this.originalPrice = originalPrice;
	}

}
