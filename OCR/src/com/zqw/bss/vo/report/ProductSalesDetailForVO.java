package com.zqw.bss.vo.report;

import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

/**
 * 
 * @author Lambert
 * @company  2016年9月2日 上午11:20:30
 */

public class ProductSalesDetailForVO extends BaseObject{
	/**
	 * 
	 */
	private static final long serialVersionUID = 8526806995314741529L;
	/**
	 * 产品Id
	 */
	private Long productId;
	
	/**
	 * 产品编码
	 */
	private String productName;
	/**
	 * 产品名称
	 */
	private String productNo;
	
	/**
	 * 出\入库日期
	 */
	private Date time;
	
	/**
	 * 收\发货单号
	 */
	private String orderNumber;
	/**
	 * 供应商\客户id
	 */
	private Long clientId;
	/**
	 * 采购\销售数量
	 */
	private Long qty;
	
	/**
	 * 退货数量
	 */
	private Long returnQty;
	
	/**
	 * 税率
	 */
	private Long vat;
	/**
	 * 均价
	 */
	private BigDecimal averagePrice;
	
	/**
	 * 总额
	 */
	private BigDecimal sumAmt;

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public String getProductNo() {
		return productNo;
	}

	public void setProductNo(String productNo) {
		this.productNo = productNo;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public String getOrderNumber() {
		return orderNumber;
	}

	public void setOrderNumber(String orderNumber) {
		this.orderNumber = orderNumber;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getQty() {
		return qty;
	}

	public void setQty(Long qty) {
		this.qty = qty;
	}

	public Long getReturnQty() {
		return returnQty;
	}

	public void setReturnQty(Long returnQty) {
		this.returnQty = returnQty;
	}

	public Long getVat() {
		return vat;
	}

	public void setVat(Long vat) {
		this.vat = vat;
	}

	public BigDecimal getAveragePrice() {
		return averagePrice;
	}

	public void setAveragePrice(BigDecimal averagePrice) {
		this.averagePrice = averagePrice;
	}

	public BigDecimal getSumAmt() {
		return sumAmt;
	}

	public void setSumAmt(BigDecimal sumAmt) {
		this.sumAmt = sumAmt;
	}

	
	
	public ProductSalesDetailForVO(Long productId, Date time, String orderNumber, Long clientId, Long qty,
			Long returnQty, Long vat, BigDecimal averagePrice, BigDecimal sumAmt) {
		super();
		this.productId = productId;
		this.time = time;
		this.orderNumber = orderNumber;
		this.clientId = clientId;
		this.qty = qty;
		this.returnQty = returnQty;
		this.vat = vat;
		this.averagePrice = averagePrice;
		this.sumAmt = sumAmt;
	}

	

	public ProductSalesDetailForVO(Long productId, BigDecimal sumAmt) {
		super();
		this.productId = productId;
		this.sumAmt = sumAmt;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((averagePrice == null) ? 0 : averagePrice.hashCode());
		result = prime * result + ((clientId == null) ? 0 : clientId.hashCode());
		result = prime * result + ((orderNumber == null) ? 0 : orderNumber.hashCode());
		result = prime * result + ((productId == null) ? 0 : productId.hashCode());
		result = prime * result + ((productName == null) ? 0 : productName.hashCode());
		result = prime * result + ((productNo == null) ? 0 : productNo.hashCode());
		result = prime * result + ((qty == null) ? 0 : qty.hashCode());
		result = prime * result + ((returnQty == null) ? 0 : returnQty.hashCode());
		result = prime * result + ((sumAmt == null) ? 0 : sumAmt.hashCode());
		result = prime * result + ((time == null) ? 0 : time.hashCode());
		result = prime * result + ((vat == null) ? 0 : vat.hashCode());
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
		ProductSalesDetailForVO other = (ProductSalesDetailForVO) obj;
		if (averagePrice == null) {
			if (other.averagePrice != null)
				return false;
		} else if (!averagePrice.equals(other.averagePrice))
			return false;
		if (clientId == null) {
			if (other.clientId != null)
				return false;
		} else if (!clientId.equals(other.clientId))
			return false;
		if (orderNumber == null) {
			if (other.orderNumber != null)
				return false;
		} else if (!orderNumber.equals(other.orderNumber))
			return false;
		if (productId == null) {
			if (other.productId != null)
				return false;
		} else if (!productId.equals(other.productId))
			return false;
		if (productName == null) {
			if (other.productName != null)
				return false;
		} else if (!productName.equals(other.productName))
			return false;
		if (productNo == null) {
			if (other.productNo != null)
				return false;
		} else if (!productNo.equals(other.productNo))
			return false;
		if (qty == null) {
			if (other.qty != null)
				return false;
		} else if (!qty.equals(other.qty))
			return false;
		if (returnQty == null) {
			if (other.returnQty != null)
				return false;
		} else if (!returnQty.equals(other.returnQty))
			return false;
		if (sumAmt == null) {
			if (other.sumAmt != null)
				return false;
		} else if (!sumAmt.equals(other.sumAmt))
			return false;
		if (time == null) {
			if (other.time != null)
				return false;
		} else if (!time.equals(other.time))
			return false;
		if (vat == null) {
			if (other.vat != null)
				return false;
		} else if (!vat.equals(other.vat))
			return false;
		return true;
	}

}
