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
import com.zqw.bss.model.billing.Account;
import com.zqw.bss.service.billing.AccountService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

@Service
@SuppressWarnings({"unchecked" , "unused"})
public class AccountServiceImpl implements AccountService {

	Logger log = Logger.getLogger(getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Account saveAccount(Account account) {
		// TODO Auto-generated method stub
		log.debug("begin saveAccount.");
		Account act = (Account)dao.save(account);
		return act;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delAccountById(Long accountId) {
		// TODO Auto-generated method stub
		Boolean flag = false;
		try {
			dao.removeObject(Account.class, accountId);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return flag;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAccount(Account account) {
		// TODO Auto-generated method stub
		log.debug("begin updateAccount.");
		Account accot = (Account) dao.update(account);
		log.debug("end  updateAccount.Quotation : [ id =" + accot.getId() + WebUtil.getLogBasicString() + "]");
		if(null != accot && !"".equals(accot) )
			return Boolean.TRUE;
		else
			return Boolean.FALSE;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Account getAccountById(Long accountId) {
		// TODO Auto-generated method stub
		Account account = (Account)dao.getObject(Account.class ,accountId);
		return account;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Account> getAllAccount() {
		// TODO Auto-generated method stub
		log.debug("begin getAllAccount.");
		String ownerId = String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID));
		List<Account> list = dao.find("from Account  where owner.id = " + ownerId + " order by lastUpdateDate desc");
		log.debug("end getAllAccount:[ id ="+ WebUtil.getLogBasicString() + "]");
		if(list != null && list.size() > 0){
			return list;
		}
		return null;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Account> findAccount(BasePagerObject condition) {
		// TODO Auto-generated method stub
		log.debug("begin findAccount.");
		List<Account> list = dao.getLst4Paging(HsqlUtil.genSearchSql(
				condition, Account.class, null), new int[] {
				condition.getPagenum(),
				condition.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(
				condition, Account.class));
		BaseModelList<Account> lists =new BaseModelList<Account>(count, WebUtil.getEntryListFromProxyList(list, dao));
		log.debug("end findAccount:[ id ="+ WebUtil.getLogBasicString() + "]");
		return null;
	}
	
}
