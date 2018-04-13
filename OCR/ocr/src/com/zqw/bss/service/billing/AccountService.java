package com.zqw.bss.service.billing;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.Account;

/**
 * <p>Title:</p>
 * <p>Description:账户接口</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author lzy
 * @date 2016年8月6日 下午1:57:30
 * @version 1.0
 */

public interface AccountService {

	/**
	 * Save Account
	 * @param Account
	 *            account
	 * @return Account
	 */
	public Account saveAccount(Account account);
	/**
	 * Del Account
	 * @param Long
	 *            accountId
	 * 
	 * @return Boolean
	 */
	public Boolean delAccountById(Long accountId);
	/**
	 * update Account
	 * @param Account
	 *            account
	 * 
	 * @return Boolean
	 */
	public Boolean updateAccount(Account account);
	/**
	 * get Account By Id
	 * @param Long
	 *            accountId
	 * 
	 * @return Account
	 */
	public Account getAccountById(Long accountId);
	/**
	 * get All Account List
	 * 
	 * @return List<Account>
	 */
	public List<Account> getAllAccount();
	/**
	 * find Account
	 * @param BasePagerObject condition
	 * 
	 * @return BaseModelList<Account>
	 */
	public BaseModelList<Account> findAccount(BasePagerObject condition);
	
}
