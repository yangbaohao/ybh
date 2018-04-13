package com.zqw.bss.service.remote.billing.impl;

import java.math.BigDecimal;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.service.billing.AccountOrderService;
import com.zqw.bss.service.remote.billing.RemoteAccountOrderService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.billing.AccountOrderHistoryVo;
import com.zqw.bss.vo.billing.AccountOrderVo;

public class RemoteAccountOrderServiceImpl implements RemoteAccountOrderService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Autowired
	private AccountOrderService accountOrderService;

	@Override
	public AccountOrder saveAccountOrder(AccountOrder accountOrder) {
		// TODO Auto-generated method stub
		logger.info("begin saveAccountOrder. id  = [" + accountOrder.getId() + "]");
		logger.info("##############" + SessionUtil.get("ownerId"));
		AccountOrder ar = (AccountOrder) WebUtil
				.getEntryFromProxyObj(accountOrderService.saveAccountOrder(accountOrder), dao);
		return ar;
	}

	@Override
	public Boolean delAccountOrderById(Long accountOrderId) {
		// TODO Auto-generated method stub
		logger.info("begin delAccountOrderById. id=[" + accountOrderId + "]");
		return accountOrderService.delAccountOrderById(accountOrderId);
	}

	@Override
	public Boolean updateAccountOrder(BigDecimal amt, Long agentId, AccountOrder accountOrder) {
		// TODO Auto-generated method stub
		logger.info("begin updateAccountOrder. id=[" + agentId + "]");
		return accountOrderService.updateAccountOrder(amt, agentId, accountOrder);
	}

	@Override
	public AccountOrder getAccountOrderById(Long accountOrderId) {
		// TODO Auto-generated method stub
		logger.info("begin getAccountOrderById. id=[" + accountOrderId + "]");
		return accountOrderService.getAccountOrderById(accountOrderId);
	}

	@Override
	public List<AccountOrder> getAllAccountOrder() {
		// TODO Auto-generated method stub
		logger.info("begin getAllAccountOrder");
		return accountOrderService.getAllAccountOrder();
	}

	@Override
	public BaseModelList<AccountOrderVo> findAccountOrder(Long flag, String query) {
		// TODO Auto-generated method stub
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		// bso.setSortdatafield("lastUpdateDate");
		// bso.setSortorder("desc");
		// Condition con = new Condition();
		// con.setAction("in");
		// con.setKey("bo.ownerId");
		// String[] str = new String[] {
		// String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID))
		// };
		// con.setValue(str);
		// bso.condition.add(con);
		logger.info(bso);
		BaseModelList<AccountOrderVo> accountOrder = accountOrderService.findAccountOrder(flag, bso);
		logger.info("end  findAccountOrder:[ id =" + WebUtil.getLogBasicString() + "]");
		return accountOrder;
	}

	@Override
	public BaseModelList<AccountOrderHistoryVo> getAllAccountOrder(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<AccountOrderHistoryVo> list =accountOrderService.getAllAccountOrderByPage(bso);
		return list;
	}

}
