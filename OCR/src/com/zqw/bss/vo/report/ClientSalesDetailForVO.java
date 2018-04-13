package com.zqw.bss.vo.report;

import java.math.BigDecimal;

import com.zqw.bss.framework.model.BaseObject;

public class ClientSalesDetailForVO extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8526806995314741529L;
	/**
	 * 客户编码
	 */
	private String clientNo;
	/**
	 * 客户名称
	 */
	private String clientName;

	/**
	 *客户或供应商对应的ID
	 */
	private Long clientId;

	/**
	 * 产品对应的ID
	 */
	private Long productId;
	
	private String product;

	/**
	 * 数量
	 */
	private Long qty;
	
	/**
	 * 退货数量
	 */
	private Long returnQty;

	/**
	 * 单价
	 */
	private BigDecimal price=BigDecimal.ZERO;

	/**
	 * 合计
	 */
	private BigDecimal sumAmt;

	
	public String getProduct() {
		return product;
	}


	public void setProduct(String product) {
		this.product = product;
	}


	public ClientSalesDetailForVO(Long clientId, BigDecimal sumAmt) {
		this.clientId = clientId;
		this.sumAmt = sumAmt;
	}
	
	
	public ClientSalesDetailForVO(Long clientId, Long productId, Long qty, Long returnQty,
			BigDecimal sumAmt) {
		this.clientId = clientId;
		this.productId = productId;
		this.qty = qty;
		this.returnQty = returnQty;
		this.sumAmt = sumAmt;
		if(this.price!=null){
			this.price = sumAmt.divide(BigDecimal.valueOf(qty-returnQty), 2);
		}
		

	}

	public ClientSalesDetailForVO() {

	}
	
	public Long getReturnQty() {
		return returnQty;
	}


	public void setReturnQty(Long returnQty) {
		this.returnQty = returnQty;
	}


	public String getClientNo() {
		return clientNo;
	}


	public void setClientNo(String clientNo) {
		this.clientNo = clientNo;
	}


	public String getClientName() {
		return clientName;
	}


	public void setClientName(String clientName) {
		this.clientName = clientName;
	}


	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}

	public Long getQty() {
		return qty;
	}

	public void setQty(Long qty) {
		this.qty = qty;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public BigDecimal getSumAmt() {
		return sumAmt;
	}

	public void setSumAmt(BigDecimal sumAmt) {
		this.sumAmt = sumAmt;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ClientSalesDetailForVO other = (ClientSalesDetailForVO) obj;
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
		if (clientNo == null) {
			if (other.clientNo != null)
				return false;
		} else if (!clientNo.equals(other.clientNo))
			return false;
		if (price == null) {
			if (other.price != null)
				return false;
		} else if (!price.equals(other.price))
			return false;
		if (product == null) {
			if (other.product != null)
				return false;
		} else if (!product.equals(other.product))
			return false;
		if (productId == null) {
			if (other.productId != null)
				return false;
		} else if (!productId.equals(other.productId))
			return false;
		if (qty == null) {
			if (other.qty != null)
				return false;
		} else if (!qty.equals(other.qty))
			return false;
		if (sumAmt == null) {
			if (other.sumAmt != null)
				return false;
		} else if (!sumAmt.equals(other.sumAmt))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((clientId == null) ? 0 : clientId.hashCode());
		result = prime * result + ((clientName == null) ? 0 : clientName.hashCode());
		result = prime * result + ((clientNo == null) ? 0 : clientNo.hashCode());
		result = prime * result + ((price == null) ? 0 : price.hashCode());
		result = prime * result + ((product == null) ? 0 : product.hashCode());
		result = prime * result + ((productId == null) ? 0 : productId.hashCode());
		result = prime * result + ((qty == null) ? 0 : qty.hashCode());
		result = prime * result + ((sumAmt == null) ? 0 : sumAmt.hashCode());
		return result;
	}
}
