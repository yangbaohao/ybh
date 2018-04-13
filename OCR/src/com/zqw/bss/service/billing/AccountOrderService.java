package com.zqw.bss.service.billing;

import java.math.BigDecimal;
import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.vo.billing.AccountOrderHistoryVo;
import com.zqw.bss.vo.billing.AccountOrderVo;

public interface AccountOrderService {

	/**
	 * Save AccountOrder
	 * @param AccountOrder
	 *            accountOrder
	 * @return AccountOrder
	 */
	public AccountOrder saveAccountOrder(AccountOrder accountOrder);
	/**
	 * Del AccountOrder
	 * @param Long
	 *            accountOrderId
	 * 
	 * @return Boolean
	 */
	public Boolean delAccountOrderById(Long accountOrderId);
	/**
	 * update AccountOrder
	 * @param AccountOrder
	 *            accountOrder
	 * 
	 * @return Boolean
	 */
	public Boolean updateAccountOrder(BigDecimal amt, Long agentId, AccountOrder accountOrder);
	/**
	 * get AccountOrder By Id
	 * @param Long
	 *            accountOrderId
	 * 
	 * @return AccountOrder
	 */
	public AccountOrder getAccountOrderById(Long accountOrderId);
	/**
	 * get All AccountOrder List
	 * 
	 * @return List<AccountOrder>
	 */
	public List<AccountOrder> getAllAccountOrder();
	/**
	 * find AccountOrder
	 * @param BasePagerObject condition
	 * 
	 * @return BaseModelList<AccountOrder>
	 */
	public BaseModelList<AccountOrderVo> findAccountOrder(Long flag, BasePagerObject condition);
	public BaseModelList<AccountOrderHistoryVo> getAllAccountOrderByPage(BasePagerObject bso);
	
}
