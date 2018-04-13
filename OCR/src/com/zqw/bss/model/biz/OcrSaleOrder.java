package com.zqw.bss.model.biz;

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
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.CartonType;
import com.zqw.bss.util.SystemConstant.WeightUnit;
import com.zqw.bss.util.SystemConstant.WeightWay;

/**
 *  存放ocr销售单的信息
 */
@Entity
@Table(name = "t_ocr_saleOrder")
public  class OcrSaleOrder extends BaseObject {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;


	private Long id;
	/**
	 * 总揽页面的uuid
	 */
	private Long uuid;
	/**
	 * 销售单类型 同客户的销售单一样
	 */
	private String orderType;
	/**
	 * 这个是 客户销售单的id
	 */
	private Long simpleOrderId;
	
	/**
	 * 收款纪录
	 */
	private List<OcrSaleOrderBill> ocrSaleOrderBill;
	
	/**
	 * 销售单详情
	 */
	private List<OcrSaleOrderDetail> ocrSaleOrderDetail;
	
	/**
	 * 地址的详情
	 */
	private List<OcrSaleOrderAddress> ocrSaleOrderAddress;
	
	/**
	 * 客服的ownerId
	 */
	private Long ownerId;
	
	/**
	 * 是否打印品名 也就是客户货号
	 */
	private Boolean printOfGoodsFlag = Boolean.FALSE;
	
	/**
	 * 增值税率
	 */
	private Long vat = 0L;
	
	/**
	 * 税率金额
	 */
	private BigDecimal vatAmt=BigDecimal.ZERO;;
	
	/**
	 * 购入总价，包括增值税，消费税
	 */
	private BigDecimal totalAmt = BigDecimal.ZERO;
	
	/**
	 * 优惠，折扣，抹零金额
	 */
	private BigDecimal cheapAmt=BigDecimal.ZERO;

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
	 * 客户名称
	 */
	private String clientName;
	
	/**
	 * 客户id
	 */
	private Long clientId;
	
	/**
	 * 收款纪录id
	 */
	private Long payRecordId;
	
	/**
	 * 收货地址
	 */
	private String address;
	
	/**
	 * 收货地址的id
	 */
	private Long addressId;

	/**
	 * 订单日期 销售日期
	 */
	private Date orderDate;

	/**
	 * 送货日期
	 */
	private Date deliveryDate;

	/**
	 * 计划送货日期
	 */
	private Date planDeliveryDate;
	
	/**
	 * 备注（打印出现）;
	 */
	private String remarkPrint;
	/**
	 * 备注;
	 */
	private String submitRemark;
	
	/**
	 * 额外费用
	 */
	private BigDecimal otherAmt=BigDecimal.ZERO;

	/**
	 * 额外费用描述
	 */
	private String otherAmtdesc;

	
	/**
	 * 对应上传文件的id列表
	 */
	private String fileInfoIds="";
	
	/**
	 * 货品装箱 张沂飞
	 */
	private String goodsBinning = "N";

	/**
	 * 张沂飞 是否开启外箱尺寸
	 */
	private Boolean productMeasFlag = Boolean.FALSE;
	
	
	
	private String orderNumber;
	
	/**
	 * 已收款总额 For App
	 */
	private BigDecimal receivAmt;
	
	/**
	 * 已经送货收货金额四舍五入取两位小数
	 */
	private BigDecimal alreadyDeliverAmt;
	/**
	 * 未收款
	 */
	private BigDecimal nopaidAmt;
	/**
	 * 是否开启细码 
	 */
	private Boolean yardsFlag =Boolean.FALSE;
	
	/**
	 * 送货地址 解决地址多选的问题
	 */
	private String deliveryAddress;
	
	/**
	 * 是否启用单位
	 */
	private Boolean productunitFlag = Boolean.FALSE;
	/**
	 * 是否开启自定义公式
	 */
	private Boolean customFormulaFlag = Boolean.FALSE;
	/**
	 * 外箱尺寸类型
	 */
	private CartonType cartonType;
	/**
	 * shifou开启重量
	 */
	private Boolean productKgFlag = Boolean.FALSE;
	
	/**
	 * 是否开启折扣
	 */
	private Boolean discountFlag = Boolean.FALSE;
	
	//单据重量单位
	private WeightUnit weightUnit;
	//单据记重方式
	@Enumerated(EnumType.STRING)
	private WeightWay weightWay;
	
	@Enumerated(EnumType.STRING)
	public WeightUnit getWeightUnit() {
		return weightUnit;
	}

	public void setWeightUnit(WeightUnit weightUnit) {
		this.weightUnit = weightUnit;
	}
	@Enumerated(EnumType.STRING)
	public WeightWay getWeightWay() {
		return weightWay;
	}
	
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductKgFlag() {
		return productKgFlag;
	}

	public void setProductKgFlag(Boolean productKgFlag) {
		this.productKgFlag = productKgFlag;
	}
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	public CartonType getCartonType() {
		return cartonType;
	}

	public void setCartonType(CartonType cartonType) {
		this.cartonType = cartonType;
	}
	public BigDecimal getVatAmt() {
		return vatAmt;
	}

	public void setVatAmt(BigDecimal vatAmt) {
		this.vatAmt = vatAmt;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public Long getAddressId() {
		return addressId;
	}

	public void setAddressId(Long addressId) {
		this.addressId = addressId;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getPrintOfGoodsFlag() {
		return printOfGoodsFlag;
	}

	public void setPrintOfGoodsFlag(Boolean printOfGoodsFlag) {
		this.printOfGoodsFlag = printOfGoodsFlag;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getPayRecordId() {
		return payRecordId;
	}

	public void setPayRecordId(Long payRecordId) {
		this.payRecordId = payRecordId;
	}
	
	public Long getSimpleOrderId() {
		return simpleOrderId;
	}

	public void setSimpleOrderId(Long simpleOrderId) {
		this.simpleOrderId = simpleOrderId;
	}




	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },targetEntity=OcrSaleOrderBill.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "sales_id")
	@BatchSize(size = 50)
	public List<OcrSaleOrderBill> getOcrSaleOrderBill() {
		return ocrSaleOrderBill;
	}

	public void setOcrSaleOrderBill(List<OcrSaleOrderBill> ocrSaleOrderBill) {
		this.ocrSaleOrderBill = ocrSaleOrderBill;
	}

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },targetEntity=OcrSaleOrderDetail.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "sales_id")
	@BatchSize(size = 50)
	public List<OcrSaleOrderDetail> getOcrSaleOrderDetail() {
		return ocrSaleOrderDetail;
	}//

	

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },targetEntity=OcrSaleOrderAddress.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "sales_id")
	@BatchSize(size = 50)
	public List<OcrSaleOrderAddress> getOcrSaleOrderAddress() {
		return ocrSaleOrderAddress;
	}

	public void setOcrSaleOrderAddress(List<OcrSaleOrderAddress> ocrSaleOrderAddress) {
		this.ocrSaleOrderAddress = ocrSaleOrderAddress;
	}

	public void setOcrSaleOrderDetail(List<OcrSaleOrderDetail> ocrSaleOrderDetail) {
		this.ocrSaleOrderDetail = ocrSaleOrderDetail;
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

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Date getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(Date orderDate) {
		this.orderDate = orderDate;
	}

	public Date getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(Date deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public Date getPlanDeliveryDate() {
		return planDeliveryDate;
	}

	public void setPlanDeliveryDate(Date planDeliveryDate) {
		this.planDeliveryDate = planDeliveryDate;
	}

	public String getRemarkPrint() {
		return remarkPrint;
	}

	public void setRemarkPrint(String remarkPrint) {
		this.remarkPrint = remarkPrint;
	}



	public BigDecimal getOtherAmt() {
		return otherAmt;
	}

	public void setOtherAmt(BigDecimal otherAmt) {
		this.otherAmt = otherAmt;
	}

	public String getOtherAmtdesc() {
		return otherAmtdesc;
	}

	public void setOtherAmtdesc(String otherAmtdesc) {
		this.otherAmtdesc = otherAmtdesc;
	}

	public String getFileInfoIds() {
		return fileInfoIds;
	}

	public void setFileInfoIds(String fileInfoIds) {
		this.fileInfoIds = fileInfoIds;
	}

	public String getGoodsBinning() {
		return goodsBinning;
	}

	public void setGoodsBinning(String goodsBinning) {
		this.goodsBinning = goodsBinning;
	}
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductMeasFlag() {
		return productMeasFlag;
	}

	public void setProductMeasFlag(Boolean productMeasFlag) {
		this.productMeasFlag = productMeasFlag;
	}

	
	
	public Long getVat() {
		return vat;
	}

	public void setVat(Long vat) {
		this.vat = vat;
	}

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public BigDecimal getCheapAmt() {
		return cheapAmt;
	}

	public void setCheapAmt(BigDecimal cheapAmt) {
		this.cheapAmt = cheapAmt;
	}
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((address == null) ? 0 : address.hashCode());
		result = prime * result + ((addressId == null) ? 0 : addressId.hashCode());
		result = prime * result + ((cheapAmt == null) ? 0 : cheapAmt.hashCode());
		result = prime * result + ((clientId == null) ? 0 : clientId.hashCode());
		result = prime * result + ((clientName == null) ? 0 : clientName.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((deliveryDate == null) ? 0 : deliveryDate.hashCode());
		result = prime * result + ((fileInfoIds == null) ? 0 : fileInfoIds.hashCode());
		result = prime * result + ((goodsBinning == null) ? 0 : goodsBinning.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((ocrSaleOrderAddress == null) ? 0 : ocrSaleOrderAddress.hashCode());
		result = prime * result + ((ocrSaleOrderBill == null) ? 0 : ocrSaleOrderBill.hashCode());
		result = prime * result + ((ocrSaleOrderDetail == null) ? 0 : ocrSaleOrderDetail.hashCode());
		result = prime * result + ((orderDate == null) ? 0 : orderDate.hashCode());
		result = prime * result + ((orderNumber == null) ? 0 : orderNumber.hashCode());
		result = prime * result + ((otherAmt == null) ? 0 : otherAmt.hashCode());
		result = prime * result + ((otherAmtdesc == null) ? 0 : otherAmtdesc.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((payRecordId == null) ? 0 : payRecordId.hashCode());
		result = prime * result + ((planDeliveryDate == null) ? 0 : planDeliveryDate.hashCode());
		result = prime * result + ((printOfGoodsFlag == null) ? 0 : printOfGoodsFlag.hashCode());
		result = prime * result + ((productMeasFlag == null) ? 0 : productMeasFlag.hashCode());
		result = prime * result + ((remarkPrint == null) ? 0 : remarkPrint.hashCode());
		result = prime * result + ((simpleOrderId == null) ? 0 : simpleOrderId.hashCode());
		result = prime * result + ((submitRemark == null) ? 0 : submitRemark.hashCode());
		result = prime * result + ((totalAmt == null) ? 0 : totalAmt.hashCode());
		result = prime * result + ((vat == null) ? 0 : vat.hashCode());
		result = prime * result + ((vatAmt == null) ? 0 : vatAmt.hashCode());
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
		OcrSaleOrder other = (OcrSaleOrder) obj;
		if (address == null) {
			if (other.address != null)
				return false;
		} else if (!address.equals(other.address))
			return false;
		if (addressId == null) {
			if (other.addressId != null)
				return false;
		} else if (!addressId.equals(other.addressId))
			return false;
		if (cheapAmt == null) {
			if (other.cheapAmt != null)
				return false;
		} else if (!cheapAmt.equals(other.cheapAmt))
			return false;
		if (clientId == null) {
			if (other.clientId != null)
				return false;
		} else if (!clientId.equals(other.clientId))
			return false;
		if (clientName == null) {
			if (other.clientName != null)
				return false;
		} else if (!clientName.equals(other.clientName))
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
		if (deliveryDate == null) {
			if (other.deliveryDate != null)
				return false;
		} else if (!deliveryDate.equals(other.deliveryDate))
			return false;
		if (fileInfoIds == null) {
			if (other.fileInfoIds != null)
				return false;
		} else if (!fileInfoIds.equals(other.fileInfoIds))
			return false;
		if (goodsBinning == null) {
			if (other.goodsBinning != null)
				return false;
		} else if (!goodsBinning.equals(other.goodsBinning))
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
		if (ocrSaleOrderAddress == null) {
			if (other.ocrSaleOrderAddress != null)
				return false;
		} else if (!ocrSaleOrderAddress.equals(other.ocrSaleOrderAddress))
			return false;
		if (ocrSaleOrderBill == null) {
			if (other.ocrSaleOrderBill != null)
				return false;
		} else if (!ocrSaleOrderBill.equals(other.ocrSaleOrderBill))
			return false;
		if (ocrSaleOrderDetail == null) {
			if (other.ocrSaleOrderDetail != null)
				return false;
		} else if (!ocrSaleOrderDetail.equals(other.ocrSaleOrderDetail))
			return false;
		if (orderDate == null) {
			if (other.orderDate != null)
				return false;
		} else if (!orderDate.equals(other.orderDate))
			return false;
		if (orderNumber == null) {
			if (other.orderNumber != null)
				return false;
		} else if (!orderNumber.equals(other.orderNumber))
			return false;
		if (otherAmt == null) {
			if (other.otherAmt != null)
				return false;
		} else if (!otherAmt.equals(other.otherAmt))
			return false;
		if (otherAmtdesc == null) {
			if (other.otherAmtdesc != null)
				return false;
		} else if (!otherAmtdesc.equals(other.otherAmtdesc))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (payRecordId == null) {
			if (other.payRecordId != null)
				return false;
		} else if (!payRecordId.equals(other.payRecordId))
			return false;
		if (planDeliveryDate == null) {
			if (other.planDeliveryDate != null)
				return false;
		} else if (!planDeliveryDate.equals(other.planDeliveryDate))
			return false;
		if (printOfGoodsFlag == null) {
			if (other.printOfGoodsFlag != null)
				return false;
		} else if (!printOfGoodsFlag.equals(other.printOfGoodsFlag))
			return false;
		if (productMeasFlag == null) {
			if (other.productMeasFlag != null)
				return false;
		} else if (!productMeasFlag.equals(other.productMeasFlag))
			return false;
		if (remarkPrint == null) {
			if (other.remarkPrint != null)
				return false;
		} else if (!remarkPrint.equals(other.remarkPrint))
			return false;
		if (simpleOrderId == null) {
			if (other.simpleOrderId != null)
				return false;
		} else if (!simpleOrderId.equals(other.simpleOrderId))
			return false;
		if (submitRemark == null) {
			if (other.submitRemark != null)
				return false;
		} else if (!submitRemark.equals(other.submitRemark))
			return false;
		if (totalAmt == null) {
			if (other.totalAmt != null)
				return false;
		} else if (!totalAmt.equals(other.totalAmt))
			return false;
		if (vat == null) {
			if (other.vat != null)
				return false;
		} else if (!vat.equals(other.vat))
			return false;
		if (vatAmt == null) {
			if (other.vatAmt != null)
				return false;
		} else if (!vatAmt.equals(other.vatAmt))
			return false;
		return true;
	}

	public String getSubmitRemark() {
		return submitRemark;
	}

	public void setSubmitRemark(String submitRemark) {
		this.submitRemark = submitRemark;
	}

	public String getOrderType() {
		return orderType;
	}

	public void setOrderType(String orderType) {
		this.orderType = orderType;
	}

	public BigDecimal getReceivAmt() {
		return receivAmt;
	}

	public void setReceivAmt(BigDecimal receivAmt) {
		this.receivAmt = receivAmt;
	}

	public BigDecimal getAlreadyDeliverAmt() {
		return alreadyDeliverAmt;
	}

	public void setAlreadyDeliverAmt(BigDecimal alreadyDeliverAmt) {
		this.alreadyDeliverAmt = alreadyDeliverAmt;
	}

	public BigDecimal getNopaidAmt() {
		return nopaidAmt;
	}

	public void setNopaidAmt(BigDecimal nopaidAmt) {
		this.nopaidAmt = nopaidAmt;
	}

	public Long getUuid() {
		return uuid;
	}

	public void setUuid(Long uuid) {
		this.uuid = uuid;
	}
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getYardsFlag() {
		return yardsFlag;
	}

	public void setYardsFlag(Boolean yardsFlag) {
		this.yardsFlag = yardsFlag;
	}

	public String getDeliveryAddress() {
		return deliveryAddress;
	}

	public void setDeliveryAddress(String deliveryAddress) {
		this.deliveryAddress = deliveryAddress;
	}
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductunitFlag() {
		return productunitFlag;
	}

	public void setProductunitFlag(Boolean productunitFlag) {
		this.productunitFlag = productunitFlag;
	}
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getCustomFormulaFlag() {
		return customFormulaFlag;
	}

	public void setCustomFormulaFlag(Boolean customFormulaFlag) {
		this.customFormulaFlag = customFormulaFlag;
	}
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getDiscountFlag() {
		return discountFlag;
	}

	public void setDiscountFlag(Boolean discountFlag) {
		this.discountFlag = discountFlag;
	}

	public void setWeightWay(WeightWay weightWay) {
		this.weightWay = weightWay;
	}
	
}
