package com.zqw.bss.vo.report;

import java.math.BigDecimal;

import com.zqw.bss.framework.model.BaseObject;

/**
 * 
 * @author zhangzhao
 * @company zqw 2016年6月22日 上午9:44:30
 */

public class ProductSalesSumForVO extends BaseObject {

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
	 * 数量
	 */
	private Long qty;
	
	/**
	 * 退货数量
	 */
	private Long returnQty;
	/**
	 * 总额
	 */
	private BigDecimal sumAmt;
	/**
	 * 均价
	 */
	private BigDecimal averagePrice;
	/**
	 * 占销售/采购率
	 */
	private BigDecimal ratioOfSales;

	public Long getReturnQty() {
		return returnQty;
	}

	public void setReturnQty(Long returnQty) {
		this.returnQty = returnQty;
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

	public BigDecimal getSumAmt() {
		return sumAmt;
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

	public void setSumAmt(BigDecimal sumAmt) {
		this.sumAmt = sumAmt;
	}

	public BigDecimal getAveragePrice() {
		return averagePrice;
	}

	public void setAveragePrice(BigDecimal averagePrice) {
		this.averagePrice = averagePrice;
	}

	public BigDecimal getRatioOfSales() {
		return ratioOfSales;
	}

	public void setRatioOfSales(BigDecimal ratioOfSales) {
		this.ratioOfSales = ratioOfSales;
	}

	public ProductSalesSumForVO(Long productId, Long qty, Long returnQty , BigDecimal totalSum) {
		super();
		this.productId = productId;
		this.qty = qty;
		this.sumAmt = totalSum;
		this.returnQty = returnQty;
		if (qty == 0L)
			this.averagePrice = BigDecimal.ZERO;
		else
			this.averagePrice = totalSum.divide(BigDecimal.valueOf( qty-returnQty), 2);
	}

	public ProductSalesSumForVO() {
		super();
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((averagePrice == null) ? 0 : averagePrice.hashCode());
		result = prime * result + ((productId == null) ? 0 : productId.hashCode());
		result = prime * result + ((qty == null) ? 0 : qty.hashCode());
		result = prime * result + ((ratioOfSales == null) ? 0 : ratioOfSales.hashCode());
		result = prime * result + ((sumAmt == null) ? 0 : sumAmt.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;

		if (getClass() != obj.getClass())
			return false;
		ProductSalesSumForVO other = (ProductSalesSumForVO) obj;
		if (averagePrice == null) {
			if (other.averagePrice != null)
				return false;
		} else if (!averagePrice.equals(other.averagePrice))
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
		if (ratioOfSales == null) {
			if (other.ratioOfSales != null)
				return false;
		} else if (!ratioOfSales.equals(other.ratioOfSales))
			return false;
		if (sumAmt == null) {
			if (other.sumAmt != null)
				return false;
		} else if (!sumAmt.equals(other.sumAmt))
			return false;
		return true;
	}

}
