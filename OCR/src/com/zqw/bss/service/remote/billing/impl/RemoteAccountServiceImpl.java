package com.zqw.bss.service.remote.billing.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.Account;
import com.zqw.bss.service.billing.AccountService;
import com.zqw.bss.service.remote.billing.RemoteAccountService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

public class RemoteAccountServiceImpl implements RemoteAccountService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Autowired
	private AccountService accountService;

	@Override
	public Account saveAccount(Account account) {
		// TODO Auto-generated method stub
		logger.info("begin saveAccount. id  = [" + account.getId() + "]");
		return accountService.saveAccount(account);
	}

	@Override
	public Boolean delAccountById(Long accountId) {
		// TODO Auto-generated method stub
		logger.info("begin delAccountById. id = ["+accountId+"]");
		return accountService.delAccountById(accountId);
	}

	@Override
	public Boolean updateAccount(Account account) {
		// TODO Auto-generated method stub
		logger.info("begin updateAccount. id =["+account.getId()+"]");
		return accountService.updateAccount(account);
	}

	@Override
	public Account getAccountById(Long accountId) {
		// TODO Auto-generated method stub
		logger.info("begin getAccountById. id =["+accountId+"]");
		return accountService.getAccountById(accountId);
	}

	@Override
	public List<Account> getAllAccount() {
		logger.info("begin getAllAccount");
		// TODO Auto-generated method stub
		return accountService.getAllAccount();
	}

	@Override
	public BaseModelList<Account> findAccount(String query) {
		// TODO Auto-generated method stub
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		bso.setSortdatafield("lastUpdateDate");
		bso.setSortorder("desc");
		Condition con = new Condition();
		con.setAction("eq");
		con.setKey("ownerId");
		String[] str = new String[] { String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID)) };
		con.setValue(str);
		bso.condition.add(con);
		logger.info(bso);
		BaseModelList<Account> account = accountService.findAccount(bso);
		logger.info("end  findAccount:[ id =" + WebUtil.getLogBasicString() + "]");
		return account;
	}	

}
