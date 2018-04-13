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
@DiscriminatorValue("purchase")
public class PurchaseReceipt extends Receipt {

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
//	private List<ReceiptPurchaseDeliveryOrderRelation> receiptPurchaseDeliveryOrderRelations = new ArrayList<ReceiptPurchaseDeliveryOrderRelation>();
//
//	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE }, fetch = FetchType.EAGER)
//	@BatchSize(size = 50)
//	@JoinColumn(name = "purchaseReceipt_id")
//	public List<ReceiptPurchaseDeliveryOrderRelation> getReceiptPurchaseDeliveryOrderRelations() {
//		return receiptPurchaseDeliveryOrderRelations;
//	}
//
//	public void setReceiptPurchaseDeliveryOrderRelations(
//			List<ReceiptPurchaseDeliveryOrderRelation> receiptPurchaseDeliveryOrderRelations) {
//		this.receiptPurchaseDeliveryOrderRelations = receiptPurchaseDeliveryOrderRelations;
//	}
//
//	@Override
//	public int hashCode() {
//		final int prime = 31;
//		int result = 1;
//		result = prime * result + ((receiptPurchaseDeliveryOrderRelations == null) ? 0
//				: receiptPurchaseDeliveryOrderRelations.hashCode());
//		return result;
//	}
//
//	@Override
//	public boolean equals(Object obj) {
//		if (this == obj)
//			return true;
//		if (obj == null)
//			return false;
//		if (getClass() != obj.getClass())
//			return false;
//		PurchaseReceipt other = (PurchaseReceipt) obj;
//		if (receiptPurchaseDeliveryOrderRelations == null) {
//			if (other.receiptPurchaseDeliveryOrderRelations != null)
//				return false;
//		} else if (!receiptPurchaseDeliveryOrderRelations.equals(other.receiptPurchaseDeliveryOrderRelations))
//			return false;
//		return true;
//	}
//	
//	
//	
//
}
