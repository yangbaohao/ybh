package com.zqw.bss.service.billing;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AccountReceipt;



public interface AccountReceiptService {
	
	/**
	 * Save AccountReceipt
	 * @param AccountReceipt
	 *            accountReceipt
	 * @return AccountReceipt
	 */
	public AccountReceipt saveAccountReceipt(AccountReceipt accountReceipt);
	/**
	 * Del AccountReceipt
	 * @param Long
	 *            accountReceiptId
	 * 
	 * @return Boolean
	 */
	public Boolean delAccountReceiptById(Long accountReceiptId);
	/**
	 * update AccountReceipt
	 * @param AccountReceipt
	 *            accountReceipt
	 * 
	 * @return Boolean
	 */
	public Boolean updateAccountReceipt(AccountReceipt accountReceipt);
	/**
	 * get AccountReceipt By Id
	 * @param Long
	 *            accountReceiptId
	 * 
	 * @return AccountReceipt
	 */
	public AccountReceipt getAccountReceiptById(Long accountReceiptId);
	/**
	 * get All AccountReceipt List
	 * 
	 * @return List<Order>
	 */
	public List<AccountReceipt> getAllAccountReceipt();
	/**
	 * find AccountReceipt
	 * @param BasePagerObject condition
	 * 
	 * @return BaseModelList<AccountReceipt>
	 */
	public BaseModelList<AccountReceipt> findAccountReceipt(BasePagerObject condition);
	
}
