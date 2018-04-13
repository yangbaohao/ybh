package com.zqw.bss.service.remote.billing.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.service.billing.AccountOrderPayService;
import com.zqw.bss.service.remote.billing.RemoteAccountOrderPayService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

public class RemoteAccountOrderPayServiceImpl implements RemoteAccountOrderPayService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Autowired
	private AccountOrderPayService accountOrderPayService;

	@Override
	public AccountOrderPay saveAccountOrderPay(AccountOrderPay accountOrderPay) {
		// TODO Auto-generated method stub
		logger.info("begin saveAccountOrderPay. id  = [" + accountOrderPay.getId() + "]");
		return (AccountOrderPay)WebUtil.getEntryFromProxyObj(accountOrderPayService.saveAccountOrderPay(accountOrderPay), dao);
	}

	@Override
	public Boolean delAccountOrderPayById(Long accountOrderPayId) {
		// TODO Auto-generated method stub
		logger.info("begin delAccountOrderPayById. id= ["+accountOrderPayId+"]");
		return accountOrderPayService.delAccountOrderPayById(accountOrderPayId);
	}

	@Override
	public Boolean updateAccountOrderPay(AccountOrderPay accountOrderPay) {
		// TODO Auto-generated method stub
		logger.info("begin updateAccountOrderPay. id=["+accountOrderPay.getId()+"]");
		return accountOrderPayService.updateAccountOrderPay(accountOrderPay);
	}

	@Override
	public AccountOrderPay getAccountOrderPayById(Long accountOrderPayId) {
		// TODO Auto-generated method stub
		logger.info("begin getAccountOrderPayById. id=["+accountOrderPayId+"]");
		return accountOrderPayService.getAccountOrderPayById(accountOrderPayId);
	}

	@Override
	public List<AccountOrderPay> getAllAccountOrderPay() {
		// TODO Auto-generated method stub
		logger.info("begin getAllAccountOrderPay.");
		return accountOrderPayService.getAllAccountOrderPay();
	}

	@Override
	public BaseModelList<AccountOrderPay> findAccountOrderPay(String query) {
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
		BaseModelList<AccountOrderPay> bccountOrderPay = accountOrderPayService.findAccountOrderPay(bso);
		logger.info("end  findAccountOrderPay:[ id =" + WebUtil.getLogBasicString() + "]");
		return bccountOrderPay;
	}

	@Override
	public List<AccountOrderPay> getAccountOrderPay(Long id) {
		// TODO Auto-generated method stub
		logger.info("begin getAccountOrderPay. id=["+id+"]");
		return accountOrderPayService.getAccountOrderPay(id);
	}	
	@Override
	public BaseModelList<AccountOrderPay> getAllOrderPay(String query) {
		logger.info("begin getAllAccountProduct.");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		bso.setSortdatafield("lastUpdateDate");
		bso.setSortorder("desc");
		BaseModelList<AccountOrderPay> list =accountOrderPayService.getAllAccountOrderPayByPage(bso);
		logger.info("end getAllAccountProduct.");
		return list;
	}
}
