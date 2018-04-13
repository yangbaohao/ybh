package com.zqw.bss.service.billing.impl;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.Account;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.service.billing.AccountOrderPayService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.PayStatus;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

@Service
@SuppressWarnings({ "unchecked", "unused" })
public class AccountOrderPayServiceImpl implements AccountOrderPayService {

	Logger log = Logger.getLogger(getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public AccountOrderPay saveAccountOrderPay(AccountOrderPay accountOrderPay) {
		// TODO Auto-generated method stub
		log.debug("begin saveAccountOrderPay.");
		AccountOrderPay aop = (AccountOrderPay) dao.save(accountOrderPay);
		return aop;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delAccountOrderPayById(Long accountOrderPayId) {
		// TODO Auto-generated method stub
		Boolean flag = false;
		try {
			dao.removeObject(AccountOrderPay.class, accountOrderPayId);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return flag;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAccountOrderPay(AccountOrderPay accountOrderPay) {
		// TODO Auto-generated method stub
		log.debug("begin updateAccount.");
		AccountOrderPay aop = (AccountOrderPay) dao.update(accountOrderPay);
		log.debug("end  updateAccount.Quotation : [ id =" + aop.getId() + WebUtil.getLogBasicString() + "]");
		if (null != aop && !"".equals(aop))
			return Boolean.TRUE;
		else
			return Boolean.FALSE;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AccountOrderPay getAccountOrderPayById(Long accountOrderPayId) {
		// TODO Auto-generated method stub
		AccountOrderPay aop = (AccountOrderPay) dao.getObject(AccountOrderPay.class, accountOrderPayId);
		return aop;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<AccountOrderPay> getAllAccountOrderPay() {
		// TODO Auto-generated method stub
		log.debug("begin getAllAccountOrderPay.");
		String ownerId = String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID));
		List<AccountOrderPay> list = dao
				.find("from AccountOrderPay where ownerId = " + ownerId + " order by lastUpdateDate desc");
		log.debug("end getAllAccount:[ id =" + WebUtil.getLogBasicString() + "]");
		if (list != null && list.size() > 0) {
			return list;
		}
		return null;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AccountOrderPay> findAccountOrderPay(BasePagerObject condition) {
		// TODO Auto-generated method stub
		log.debug("begin findAccount.");
		List<Account> list = dao.getLst4Paging(HsqlUtil.genSearchSql(condition, Account.class, null),
				new int[] { condition.getPagenum(), condition.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(condition, AccountOrderPay.class));
		BaseModelList<AccountOrderPay> lists = new BaseModelList<AccountOrderPay>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		log.debug("end findAccount:[ id =" + WebUtil.getLogBasicString() + "]");
		return null;
	}

	/**
	 * 查询审批处理
	 */
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<AccountOrderPay> getAccountOrderPay(Long id) {
		List sql = dao.executeQuerySql("select p.* from t_bss_agent_request_pay p where p.agentRevenue_id=" + id, null);
		List<AccountOrderPay>AccountOrderPayList=new ArrayList<AccountOrderPay>();
		for (Object object : sql) {
			Object[] o = (Object[]) object;
			AccountOrderPay accountOrderPay = new AccountOrderPay();
			accountOrderPay.setCreateBy(o[1].toString());
			DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
			try {
				accountOrderPay.setCreateDate(df.parse(o[2].toString()));
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if (o[5].equals("notpaid")) {
				accountOrderPay.setPayStatus(PayStatus.notpaid);
			}
			if (o[5].equals("paid")) {
				accountOrderPay.setPayStatus(PayStatus.paid);
			}
			accountOrderPay.setRemark(o[6].toString());
			AccountOrderPayList.add(accountOrderPay);
		}
		return AccountOrderPayList;
	}
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AccountOrderPay> getAllAccountOrderPayByPage(BasePagerObject bso) {
		log.debug("begin getAllOrderPayByPage. ");
		List<AccountOrderPay> list = dao.getLst4Paging(
				HsqlUtil.genSearchSql(bso, AccountOrderPay.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, AccountOrderPay.class));
		if (count==0L) {
			AccountOrderPay op=new AccountOrderPay();
			List<Condition> condition = bso.getCondition();
			String[] value = condition.get(0).getValue();
			AccountOrder ao= (AccountOrder) dao.getObject(AccountOrder.class, Long.valueOf(value[0]));
			op.setAccountOrder(ao);
			op.setTotalAmt(ao.getTotalAmt());
			list.add(op);
			count=1L;
		}
		log.debug("end  getAllOrderPayByPage.");
		return new BaseModelList<AccountOrderPay>(count, WebUtil.getEntryListFromProxyList(list, dao));
	}
}
