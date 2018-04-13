package com.zqw.bss.service.billing;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.BillingRecord;

public interface BillingRecordService {
	
	/**
	 * Save BillingRecord
	 * @param BillingRecord
	 *            billingRecord
	 * @return BillingRecord
	 */
	public BillingRecord saveBillingRecord(BillingRecord billingRecord);
	/**
	 * Del BillingRecord
	 * @param Long
	 *            billingRecordId
	 * 
	 * @return Boolean
	 */
	public Boolean delBillingRecordById(Long billingRecordId);
	/**
	 * update BillingRecord
	 * @param BillingRecord
	 *            billingRecord
	 * 
	 * @return Boolean
	 */
	public Boolean updateBillingRecord(BillingRecord billingRecord);
	/**
	 * get BillingRecord By Id
	 * @param Long
	 *            billingRecordId
	 * 
	 * @return BillingRecord
	 */
	public BillingRecord getBillingRecordById(Long billingRecordId);
	/**
	 * find BillingRecord
	 * @param BasePagerObject condition
	 * 
	 * @return BaseModelList<BillingProductPermission>
	 */
	public BaseModelList<BillingRecord> findBillingRecord(BasePagerObject condition);
	
}
