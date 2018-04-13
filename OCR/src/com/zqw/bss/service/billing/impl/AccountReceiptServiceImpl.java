package com.zqw.bss.service.billing.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.billing.AccountReceipt;
import com.zqw.bss.service.billing.AccountReceiptService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;


@Service
@SuppressWarnings({"unchecked" , "unused"})
public class AccountReceiptServiceImpl implements AccountReceiptService {

	Logger log = Logger.getLogger(getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public AccountReceipt saveAccountReceipt(AccountReceipt accountReceipt) {
		// TODO Auto-generated method stub
		log.debug("begin saveAccountReceipt.");
		AccountReceipt ar = (AccountReceipt)dao.save(accountReceipt);
		return ar;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delAccountReceiptById(Long accountReceiptId) {
		// TODO Auto-generated method stub
		Boolean flag = false;
		try {
			dao.removeObject(AccountReceipt.class, accountReceiptId);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
			log.debug("del fail = " + e.getMessage());
		}
		return flag;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAccountReceipt(AccountReceipt accountReceipt) {
		// TODO Auto-generated method stub
		log.debug("begin updateAccount.");
		AccountReceipt ar = (AccountReceipt) dao.update(accountReceipt);
		log.debug("end  updateAccountReceipt.Quotation : [ id =" + ar.getId() + WebUtil.getLogBasicString() + "]");
		if(null != ar && !"".equals(ar) )
			return Boolean.TRUE;
		else
			return Boolean.FALSE;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AccountReceipt getAccountReceiptById(Long accountReceiptId) {
		// TODO Auto-generated method stub
		AccountReceipt ar = (AccountReceipt)dao.getObject(AccountReceipt.class ,accountReceiptId);
		return ar;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<AccountReceipt> getAllAccountReceipt() {
		// TODO Auto-generated method stub
		log.debug("begin getAllAccountReceipt.");
		String ownerId = String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID));
		List<AccountReceipt> list = dao.find("from AccountReceipt where ownerId = " + ownerId + " order by lastUpdateDate desc");
		log.debug("end getAllAccountReceipt:[ id ="+ WebUtil.getLogBasicString() + "]");
		if(list != null && list.size() > 0){
			return list;
		}
		return null;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AccountReceipt> findAccountReceipt(BasePagerObject condition) {
		// TODO Auto-generated method stub
		log.debug("begin findAccount.");
		List<AccountOrder> list = dao.getLst4Paging(HsqlUtil.genSearchSql(
				condition, AccountOrder.class, null), new int[] {
				condition.getPagenum(),
				condition.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(
				condition, AccountOrder.class));
		BaseModelList<AccountOrder> lists = new BaseModelList<AccountOrder>(count, WebUtil.getEntryListFromProxyList(list, dao));
		log.debug("end findAccount:[ id ="+ WebUtil.getLogBasicString() + "]");
		return null;
	}
	
}
