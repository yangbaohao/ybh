package com.zqw.bss.service.billing;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AccountOrderPay;

public interface AccountOrderPayService {

	/**
	 * Save AccountOrderPay
	 * @param AccountOrderPay
	 *            accountOrderPay
	 * @return AccountOrderPay
	 */
	public AccountOrderPay saveAccountOrderPay(AccountOrderPay accountOrderPay);
	/**
	 * Del AccountOrderPay
	 * @param Long
	 *            AccountOrderPayId
	 * 
	 * @return Boolean
	 */
	public Boolean delAccountOrderPayById(Long accountOrderPayId);
	/**
	 * update AccountOrderPay
	 * @param AccountOrderPay
	 *            accountOrderPay
	 * 
	 * @return Boolean
	 */
	public Boolean updateAccountOrderPay(AccountOrderPay accountOrderPay);
	/**
	 * get AccountOrderPay By Id
	 * @param Long
	 *            accountOrderPayId
	 * 
	 * @return AccountOrderPay
	 */
	public AccountOrderPay getAccountOrderPayById(Long accountOrderPayId);
	/**
	 * get All AccountOrderPay List
	 * 
	 * @return List<AccountOrderPay>
	 */
	public List<AccountOrderPay> getAllAccountOrderPay();
	/**
	 * find AccountOrderPay
	 * @param BasePagerObject condition
	 * 
	 * @return BaseModelList<AccountOrderPay>
	 */
	public BaseModelList<AccountOrderPay> findAccountOrderPay(BasePagerObject condition);
	
	
	public List<AccountOrderPay> getAccountOrderPay(Long id);
	BaseModelList<AccountOrderPay> getAllAccountOrderPayByPage(BasePagerObject bso);
	
}
