package com.zqw.bss.model.fms;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

import org.hibernate.annotations.BatchSize;

@Entity
@DiscriminatorValue("sales")
public class SalesReceipt extends Receipt {

	@Override
	public boolean equals(Object arg0) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return 0;
	}
//
//	/**
//	 * 送货单列表
//	 */
//	private List<ReceiptSalesDeliveryOrderRelation> receiptSalesDeliveryOrderRelations = new ArrayList<ReceiptSalesDeliveryOrderRelation>();
//
//	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE }, fetch = FetchType.EAGER)
//	@BatchSize(size = 50)
//	@JoinColumn(name = "salesReceipt_id")
//	public List<ReceiptSalesDeliveryOrderRelation> getReceiptSalesDeliveryOrderRelations() {
//		return receiptSalesDeliveryOrderRelations;
//	}
//
//	public void setReceiptSalesDeliveryOrderRelations(
//			List<ReceiptSalesDeliveryOrderRelation> receiptSalesDeliveryOrderRelations) {
//		this.receiptSalesDeliveryOrderRelations = receiptSalesDeliveryOrderRelations;
//	}
//
//	@Override
//	public boolean equals(Object object) {
//		// TODO Auto-generated method stub
//		return false;
//	}
//
//	@Override
//	public int hashCode() {
//		// TODO Auto-generated method stub
//		return 0;
//	}
	

}
