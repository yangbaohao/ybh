package com.zqw.bss.service.billing;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.BillingProductPermission;

public interface BillingProductPermissionService {
	
	/**
	 * Save BillingProductPermission
	 * @param ids 
	 * @param ids2 
	 * @param amt 
	 * @param BillingProductPermission
	 *            billingProductPermission
	 * @return BillingProductPermission
	 */
	public Boolean saveBillingProductPermission(String channel, String ids2, String amt, BillingProductPermission billingProductPermission);
	/**
	 * Del BillingProductPermission
	 * @param Long
	 *            billingProductPermissionId
	 * 
	 * @return Boolean
	 */
	public Boolean delBillingProductPermissionById(Long billingProductPermissionId);
	/**
	 * update BillingProductPermission
	 * @param BillingProductPermission
	 *            billingProductPermission
	 * 
	 * @return Boolean
	 */
	public Boolean updateBillingProductPermission(BillingProductPermission billingProductPermission);
	/**
	 * get BillingProductPermission By Id
	 * @param Long
	 *            billingProductPermission
	 * 
	 * @return BillingProductPermission
	 */
	public BillingProductPermission getBillingProductPermissionById(Long BillingProductPermissionId);
	/**
	 * find BillingProductPermission
	 * @param BasePagerObject condition
	 * 
	 * @return BaseModelList<BillingProductPermission>
	 */
	public BaseModelList<BillingProductPermission> findBillingProductPermission(BasePagerObject condition);
	
}
