package com.zqw.bss.service.fms.impl;

import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.DateUtil;
import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.service.fms.AccountPeriodService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.AccountPeriodStatus;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

@Service
@Qualifier("accountPeriodService")
@SuppressWarnings( { "unchecked" })
public class AccountPeriodServiceImpl implements AccountPeriodService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public AccountPeriod startAccountPeriod(String startMonth, Owner owner) {
		logger.info("begin startAccountPeriod.");
		if (DateUtil.parse(startMonth, "yyyy-MM") == null)
			throw new OperationException("日期格式错误！");

		String todayStr = DateUtil.format(new Date(), "yyyy-MM");

		if (DateUtil.compareMonth(startMonth, todayStr) > 0)
			throw new OperationException("开始使用月份不能大于当前月！");

		AccountPeriod startPeriod = this.getCurrentAccountPeriod();

		if (startPeriod != null) {

			// 大于之前的日期
			if (DateUtil.compareMonth(startMonth, startPeriod
					.getAccountPeriodMonth()) > 0)

				throw new OperationException("账期起始月不能大于之前的设置日期！");

			// 小于之前的设置的日期
			if (DateUtil.compareMonth(startMonth, startPeriod
					.getAccountPeriodMonth()) < 0) {
				String lastClosedPreiod = null;
				if (this.getLastClosedAccountPeriod() != null) {
					lastClosedPreiod = this.getLastClosedAccountPeriod()
							.getAccountPeriodMonth();
				}
				if (lastClosedPreiod != null)
					throw new OperationException(startMonth + "--"
							+ lastClosedPreiod + "已结账，不能修改开始使用日期！");
			}

			if (DateUtil.compareMonth(startMonth, startPeriod
					.getAccountPeriodMonth()) == 0)
				return startPeriod;

		}

		AccountPeriod accountPeriod = new AccountPeriod(startMonth,
				AccountPeriodStatus.opened);
		if (owner != null) {
			WebUtil.setDefaultValueInModel(accountPeriod, owner.getCreateBy(),
					owner.getId());
			dao.saveNoSetDefaultValue(accountPeriod);
		} else {

			dao.save(accountPeriod);
		}
		logger.info("end  startAccountPeriod.AccountPeriod : [ id ="
				+ accountPeriod.getId() + WebUtil.getLogBasicString() + "]");
		return accountPeriod;
	}
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public AccountPeriod getCurrentAccountPeriod() {
		logger.info("begin getCurrentAccountPeriod.");
		Long ownerId = (Long) SessionUtil
				.get(SystemConstant.SESSION_KEY_OWNER_ID);

		List<AccountPeriod> apList = dao.find(
				"from AccountPeriod where ownerId =" + ownerId
						+ " and accountPeriodStatus in ('"
						+ AccountPeriodStatus.opened + "','"
						+ AccountPeriodStatus.reopened
						+ "') order by accountPeriodMonth asc ", 0, 1);
		logger.info("end  getCurrentAccountPeriod:[ id ="
				+ WebUtil.getLogBasicString() + "]");
		return apList.size() == 0 ? null : apList.get(0);
	}
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AccountPeriod getLastClosedAccountPeriod() {
		logger.info("begin getLastClosedAccountPeriod.");
		Long ownerId = (Long) SessionUtil
				.get(SystemConstant.SESSION_KEY_OWNER_ID);

		List<AccountPeriod> apList = dao.find(
				"from AccountPeriod where ownerId =" + ownerId
						+ " and accountPeriodStatus = '"
						+ AccountPeriodStatus.closed
						+ "' order by accountPeriodMonth desc ", 0, 1);

		return apList.size() == 0 ? null : apList.get(0);
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Boolean checkInitialAccountPeriod(Long ownerId) {
		// TODO Auto-generated method stub
		Long count = dao.getCount4Paging("select count(id) from AccountPeriod where ownerId = " + ownerId
						+ " and accountPeriodStatus = '"+AccountPeriodStatus.closed+"'");
		if(count>0){
			return false;
		}
		return true;
	}
}