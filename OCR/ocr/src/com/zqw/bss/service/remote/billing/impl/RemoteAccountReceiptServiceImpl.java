package com.zqw.bss.service.remote.billing.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.AccountReceipt;
import com.zqw.bss.service.billing.AccountReceiptService;
import com.zqw.bss.service.remote.billing.RemoteAccountReceiptService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

public class RemoteAccountReceiptServiceImpl implements RemoteAccountReceiptService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Autowired
	private AccountReceiptService accountReceiptService;

	@Override
	public AccountReceipt saveAccountReceipt(AccountReceipt accountReceipt) {
		// TODO Auto-generated method stub
		logger.info("begin saveAccountReceipt. id  = [" + accountReceipt.getId() + "]");
		return accountReceiptService.saveAccountReceipt(accountReceipt);
	}

	@Override
	public Boolean delAccountReceiptById(Long accountReceiptId) {
		// TODO Auto-generated method stub
		logger.info("begin delAccountReceiptById. id = [" + accountReceiptId + "]");
		return accountReceiptService.delAccountReceiptById(accountReceiptId);
	}

	@Override
	public Boolean updateAccountReceipt(AccountReceipt accountReceipt) {
		// TODO Auto-generated method stub
		logger.info("begin updateAccountReceipt. id = [" + accountReceipt.getId() + "]");
		return accountReceiptService.updateAccountReceipt(accountReceipt);
	}

	@Override
	public AccountReceipt getAccountReceiptById(Long accountReceiptId) {
		// TODO Auto-generated method stub
		logger.info("begin getAccountReceiptById. id = [" + accountReceiptId + "]");
		return accountReceiptService.getAccountReceiptById(accountReceiptId);
	}

	@Override
	public List<AccountReceipt> getAllAccountReceipt() {
		// TODO Auto-generated method stub
		logger.info("begin getAllAccountReceipt");
		return accountReceiptService.getAllAccountReceipt();
	}

	@Override
	public BaseModelList<AccountReceipt> findAccountReceipt(String query) {
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
		BaseModelList<AccountReceipt> accountReceipt = accountReceiptService.findAccountReceipt(bso);
		logger.info("end  findAccountReceipt:[ id =" + WebUtil.getLogBasicString() + "]");
		return accountReceipt;
	}

}
