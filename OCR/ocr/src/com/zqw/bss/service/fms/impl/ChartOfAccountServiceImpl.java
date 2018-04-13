package com.zqw.bss.service.fms.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.LockMode;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.DateUtil;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.basic.CoaSequence;
import com.zqw.bss.model.basic.UionPKId;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.fms.ChartOfAccount;
import com.zqw.bss.service.fms.AccountPeriodService;
import com.zqw.bss.service.fms.ChartOfAccountService;
import com.zqw.bss.util.SystemConfig;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.ComputeCarryoverClass;
import com.zqw.bss.util.SystemConstant.DebitCredit;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.fms.ChartOfAccountBankListVo;
import com.zqw.bss.vo.fms.ChartOfAccountForListVO;
import com.zqw.bss.vo.fms.ChartOfAccountIdVo;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2016
 * </p>
 * <p>
 * Company:zqw
 * </p>
 * 
 * @author Dhuan
 * @date 2016年4月20日 下午1:20:33
 * @version 1.0
 */
@Service
@Qualifier("chartOfAccountService")
@SuppressWarnings({ "unchecked", "rawtypes","unused" })
public class ChartOfAccountServiceImpl implements ChartOfAccountService {
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Autowired
	protected AccountPeriodService accountPeriodService;

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public ChartOfAccount saveChartOfAccount(ChartOfAccount chartOfAccount,Long ownerId) {
		logger.info("begin saveChartOfAccount.");
		// 获取父科目
		String parentHardCode = chartOfAccount.getHardCode().substring(0, chartOfAccount.getHardCode().length() - 2);
		// 如果保存的不是一级科目，则必须设置相关父属性
		if (parentHardCode.length() >= 4) {

			// 检查科目是否允许被更改
			chartOfAccountUsedCheck(parentHardCode,ownerId);

			ChartOfAccount parentCoa = this.getChartOfAccountByCode(parentHardCode,ownerId);
			if (parentCoa == null)
				throw new OperationException("科目：" + chartOfAccount.getHardCode() + " 没有父科目,不能保存！");
			if (parentCoa.getId() == null)
				throw new OperationException("科目：" + chartOfAccount.getHardCode() + " 父科目id为空,不能保存！");
//			List<ChartOfAccount> parentid = dao.find("from ChartOfAccount where parentId = " + parentCoa.getId()
//					+ " and ownerId = " + (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID));
//			&& parentid.size() == 0
//			if (parentCoa.getCurrValue().compareTo(parentCoa.getIniValue()) != 0)
//				throw new OperationException(parentCoa.getDisplayValue() + " 发生金额不为0,不能新建子科目！");
			
			chartOfAccount.setParentId(parentCoa.getId());

			chartOfAccount.setCreditCashFlow(parentCoa.getCreditCashFlow());

			chartOfAccount.setDebitCashFlow(parentCoa.getDebitCashFlow());
		}
		if (chartOfAccount.getUuId() == null) {
			chartOfAccount.setUuId(new UionPKId());
		}
		if (chartOfAccount.getId() == null) {
			CoaSequence coaseq = new CoaSequence();
			dao.save(coaseq);
			chartOfAccount.setId(coaseq.getId());

		}

		chartOfAccount.setCurrValue(chartOfAccount.getIniValue());

		try {
			chartOfAccount = (ChartOfAccount) dao.save(chartOfAccount);
		} catch (Exception e) {
			// TODO: handle exception
			throw new OperationException("抱歉，"+chartOfAccount.getHardCode()+" "+chartOfAccount.getName()+"科目名称重复，请检查！");
		}
		if(chartOfAccount.getHardCode().endsWith("01")){
			dao.executeSql("update t_fms_journal_detail set chartOfAccount_id = "+chartOfAccount.getId()+" "
					+ "where chartOfAccount_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			dao.executeSql("update t_fms_asset set coaDepreciate_id = "+chartOfAccount.getId()+" "
					+ "where coaDepreciate_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			dao.executeSql("update t_fms_asset set coaExpense_id = "+chartOfAccount.getId()+" "
					+ "where coaExpense_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			
			dao.executeSql("update t_fms_expense_payment set coaFunds_id = "+chartOfAccount.getId()+" "
					+ "where coaFunds_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			dao.executeSql("update t_fms_expense_payment set coaReason_id = "+chartOfAccount.getId()+" "
					+ "where coaReason_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			
			dao.executeSql("update t_fms_fee_income set coaDeposit_id = "+chartOfAccount.getId()+" "
					+ "where coaDeposit_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			dao.executeSql("update t_fms_fee_income set coaReason_id = "+chartOfAccount.getId()+" "
					+ "where coaReason_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			
			dao.executeSql("update t_fms_reimreceipt set coaReason_id = "+chartOfAccount.getId()+" "
					+ "where coaReason_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			
			dao.executeSql("update t_prod_product set coaCost_id = "+chartOfAccount.getId()+" "
					+ "where coaCost_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			dao.executeSql("update t_prod_product set coaIncome_id = "+chartOfAccount.getId()+" "
					+ "where coaIncome_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			dao.executeSql("update t_prod_product set coaInventory_id = "+chartOfAccount.getId()+" "
					+ "where coaInventory_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			
			dao.executeSql("update t_purchase_order_pay set coaFunds_id = "+chartOfAccount.getId()+" "
					+ "where coaFunds_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			dao.executeSql("update t_sales_order_pay set coaFunds_id = "+chartOfAccount.getId()+" "
					+ "where coaFunds_id = "+chartOfAccount.getParentId() +" and ownerId = "+ownerId, null);
			
			
		}
		
		logger.info("end  saveChartOfAccount.chartOfAccount : [ id =" + chartOfAccount.getId()
				+ WebUtil.getLogBasicString() + "]");
		return chartOfAccount;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delChartOfAccount(Long id,Long ownerId) {

		logger.info("begin delChartOfAccount.");
		
		UionPKId upid = new UionPKId();
		upid.setId(id);
		upid.setOwnerId(ownerId);
		
		//检查该科目能否被删除
		ChartOfAccount chartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, upid);
		if(!ownerId.equals(chartOfAccount.getOwnerId())){
			throw new OperationException("访问对象不属于当前用户，请联系管理员！");
		}
		
		//因为可以删除的都是子集，所以，必然有parentId
		Long parentId = chartOfAccount.getParentId();
		if(!chartOfAccount.getAllowInput()){
			throw new OperationException("抱歉，"+chartOfAccount.getDisplayValue()+" 有子科目，不可删除！");
		}
		Long count = dao.getCount4PagingWithSQL("select count(id) from t_fms_journal_detail where ownerId = "+ownerId +" and chartOfAccount_id = "+id);
		count += dao.getCount4PagingWithSQL("select count(id) from t_prod_product "
				+ "where ownerId = "+ownerId +" and (coaCost_id = "+id+" or coaIncome_id = "+id+" or coaInventory_id = "+id+")");
		
		count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_asset "
				+ "where (coaDepreciate_id = "+id +" "
						+ "or coaExpense_id = "+id+") and ownerId = "+ownerId);
		
		count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_expense_payment "
				+ "where coaFunds_id = "+id +" and ownerId = "+ownerId);
		count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_expense_payment "
				+ "where coaReason_id = "+id +" and ownerId = "+ownerId);
		
		count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_fee_income "
				+ "where coaDeposit_id = "+id +" and ownerId = "+ownerId);
		count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_fee_income "
				+ "where coaReason_id = "+id +" and ownerId = "+ownerId);
		
		count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_reimreceipt "
				+ "where coaReason_id = "+id +" and ownerId = "+ownerId);
		
		count += dao.getCount4PagingWithSQL("select count(id) from t_purchase_order_pay "
				+ "where coaFunds_id = "+id +" and ownerId = "+ownerId);
		count += dao.getCount4PagingWithSQL("select count(id) from t_sales_order_pay "
				+ "where coaFunds_id = "+id +" and ownerId = "+ownerId);
		
		if(count>0){
			throw new OperationException("抱歉，"+chartOfAccount.getDisplayValue()+" 已产生关联业务，不可删除！");
		}
		this.updateAllValueWithParentForDelete(upid, chartOfAccount.getCreditAmt(),chartOfAccount.getDebitAmt()
				,chartOfAccount.getIniValue(),chartOfAccount.getBalance());
		dao.removeObject(ChartOfAccount.class, upid);
		dao.flush();
		//查询科目子集数量
		Long cCount = dao.getCount4PagingWithSQL("select count(id) from t_fms_chart_of_account where ownerId = "+ownerId +" and parentId = "+parentId);
		if(cCount == 0){
			Long cou = dao.executeSql("update t_fms_chart_of_account set allowInput = 'Y' where ownerId = "+ownerId +" and id = "+parentId, null);
			if(cou!=1){
				throw new OperationException("对不起，父科目状态未正常更新，请联系初旭");
			}
		}
		logger.info("end delChartOfAccount.[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateChartOfAccount(ChartOfAccount chartOfAccount,Long ownerId) {

		logger.info("begin updateChartOfAccount");

		chartOfAccount.setOwnerId(ownerId);

		try {
			chartOfAccount = (ChartOfAccount) dao.update(chartOfAccount);
			dao.flush();
		} catch (Exception e) {
			// TODO: handle exception
			throw new OperationException("抱歉，"+chartOfAccount.getHardCode()+" "+chartOfAccount.getName()+"科目名称重复，请检查！");
		}

		logger.info("end updateChartOfAccount.[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public ChartOfAccount getChartOfAccountById(Long id,Long ownerId) {

		logger.info("begin getChartOfAccountById. id = [" + id + "]");

		UionPKId upid = new UionPKId(id, ownerId);

		ChartOfAccount chartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, upid);

		logger.info("end getChartOfAccountById.[ id =" + WebUtil.getLogBasicString() + "]");

		return chartOfAccount;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public ChartOfAccount getChartOfAccountByCode(String code,Long ownerId) {
		logger.info("begin getChartOfAccountByCode. code = [" + code + "]");

		Object[] obj = new Object[] { code };

		List<ChartOfAccount> list = dao.find("from ChartOfAccount where hardCode = ? and uuId.ownerId = "+ownerId, obj);

		ChartOfAccount coa = null;
		if (list != null && list.size() > 0) {
			coa = list.get(0);
		}

		logger.info("end getChartOfAccountByCode.[ id =" + WebUtil.getLogBasicString() + "]");

		return coa;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<ChartOfAccount> getChartOfAccounts(Long ownerId) {

		logger.info("begin findChartOfAccount.");

		Object[] obj = new Object[] { ownerId };

		List<ChartOfAccount> lists = dao
				.find("from ChartOfAccount where uuId.ownerId = ? order by ref asc", obj);

		logger.info("end findChartOfAccount.[ id =" + WebUtil.getLogBasicString() + "]");

		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<ChartOfAccount> findChartOfAccount(ChartOfAccount chartOfAccount) {

		logger.info("begin findChartOfAccount. id = [" + chartOfAccount.getId() + "]");

		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);

		List<Criterion> criterionList = new ArrayList<Criterion>();

		criterionList.add(Restrictions.eq("ownerId", ownerId));

		if (!StringUtils.isEmpty(chartOfAccount.getName())) {
			criterionList.add(Restrictions.like("name", "%" + chartOfAccount.getName() + "%"));
		}

		if (!StringUtils.isEmpty(chartOfAccount.getRef())) {
			criterionList.add(Restrictions.eq("ref", chartOfAccount.getRef()));
		}

		if (!StringUtils.isEmpty(chartOfAccount.getCoaClass())) {
			criterionList.add(Restrictions.eq("COAClass", chartOfAccount.getCoaClass()));
		}

		Criterion[] criterions = criterionList.toArray(new Criterion[criterionList.size()]);

		List<ChartOfAccount> chartOfAccounts = dao.getList(ChartOfAccount.class, criterions);

		logger.info("end findChartOfAccount.[ id =" + WebUtil.getLogBasicString() + "]");
		return chartOfAccounts;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<ChartOfAccount> getChartOfAccounts(Long[] is,Long ownerId) {

		logger.info("begin getChartOfAccounts.");


		List<Criterion> criterionList = new ArrayList<Criterion>();
		criterionList.add(Restrictions.in("coaClass", is));
		criterionList.add(Restrictions.eq("uuId.ownerId", ownerId));

		Criterion[] criterions = criterionList.toArray(new Criterion[criterionList.size()]);

		List<ChartOfAccount> chartOfAccounts = dao.getList(ChartOfAccount.class, criterions,
				new Order[] { Order.asc("ref") });

		logger.info("end getChartOfAccounts.[ id =" + WebUtil.getLogBasicString() + "]");
		return chartOfAccounts;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<ChartOfAccount> findChartOfAccounts(BasePagerObject chartOfAccountCondition) {

		logger.info("begin findChartOfAccounts.");
		List<ChartOfAccount> chartOfAccounts = dao.getLst4Paging(
				HsqlUtil.genSearchSql(chartOfAccountCondition, ChartOfAccount.class, null),
				new int[] { chartOfAccountCondition.getPagenum(), chartOfAccountCondition.getPagesize() });

		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(chartOfAccountCondition, ChartOfAccount.class));

		BaseModelList<ChartOfAccount> lists = new BaseModelList<ChartOfAccount>(count,
				WebUtil.getEntryListFromProxyList(chartOfAccounts, dao));
		logger.info("end findChartOfAccounts.[ id =" + WebUtil.getLogBasicString() + "]");

		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<ChartOfAccount> getChartOfAccountByParentid(Long parentid,Long ownerId) {

		logger.info("begin findChartOfAccount.");


		Object[] obj = new Object[] { parentid, ownerId, Boolean.TRUE };

		List<ChartOfAccount> lists = dao.find("from ChartOfAccount where level = 2 and parentId = ? "
				+ " and uuId.ownerId = ? and enabled = ? order by ref asc ", obj);
		logger.info("end findChartOfAccount:[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<ChartOfAccount> getChartOfAccountByRef(Integer classid,Long ownerId) {

		logger.info("begin findChartOfAccount.");

		Object[] obj = new Object[] { ownerId, Boolean.TRUE };

		if (classid.intValue() == 7) {
			List<ChartOfAccount> lists = dao.find(
					"from ChartOfAccount where level = 2  and uuId.ownerId = ? and enabled = ? order by ref asc", obj);
			logger.info("end findChartOfAccount:[ id =" + WebUtil.getLogBasicString() + "]");
			return lists;
		} else if (classid.intValue() == 6) {
			List<ChartOfAccount> lists = dao.find(
					"from ChartOfAccount where level = 1  and uuId.ownerId = ? and enabled = ? order by ref asc", obj);
			logger.info("end findChartOfAccount:[ id =" + WebUtil.getLogBasicString() + "]");
			return lists;
		} else if (classid.intValue() == 3) {
			List<ChartOfAccount> lists = dao.find(
					"from ChartOfAccount where (ref like '1403%' or ref like '1405%') and uuId.ownerId = ? and enabled = ? order by ref asc",
					obj);
			logger.info("end findChartOfAccount:[ id =" + WebUtil.getLogBasicString() + "]");
			return lists;
		} else if (classid.intValue() == 4) {
			List<ChartOfAccount> lists = dao.find(
					"from ChartOfAccount where (ref like '6001%' or ref like '6051%') and uuId.ownerId = ? and enabled = ? order by ref asc",
					obj);
			logger.info("end findChartOfAccount:[ id =" + WebUtil.getLogBasicString() + "]");
			return lists;
		} else if (classid.intValue() == 5) {
			List<ChartOfAccount> lists = dao.find("from ChartOfAccount where (ref like '6401%' or ref like '6402%' )"
					+ " and uuId.ownerId = ? and enabled = ? order by ref asc", obj);
			logger.info("end findChartOfAccount:[ id =" + WebUtil.getLogBasicString() + "]");
			return lists;
		} else if (classid.intValue() == 1) {
			List<ChartOfAccount> lists = dao.find(
					"from ChartOfAccount where (ref like '1602%' or ref like '1702%') and uuId.ownerId = ? and enabled = ? order by ref asc",
					obj);
			logger.info("end findChartOfAccount:[ id =" + WebUtil.getLogBasicString() + "]");
			return lists;
		} else if (classid.intValue() == 2) {
			List<ChartOfAccount> lists = dao.find(
					"from ChartOfAccount where (ref like '5101%' or ref like '660120%' or ref like '660225%') and uuId.ownerId = ? and enabled = ? order by ref asc",
					obj);
			logger.info("end findChartOfAccount:[ id =" + WebUtil.getLogBasicString() + "]");
			return lists;
		} else {
			throw new OperationException("没有匹配的值");
		}

	}

	/**
	 * 试算平衡
	 * 
	 * @return
	 */
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	private Boolean computeBalance(List<ChartOfAccount> chartOfAccounts) {
		logger.info("begin computeBalance.");
		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);

		// 查询出所有可用的科目，过滤掉被更新的科目
		List<Long> ids = new ArrayList<Long>();
		for (ChartOfAccount coa : chartOfAccounts) {
			if (coa.getId() != null) {
				ids.add(coa.getId());
			}
		}
		List<Criterion> criterionList = new ArrayList<Criterion>();
		if (ids.size() > 0) {
			criterionList.add(Restrictions.not(Restrictions.in("uuId.id", ids.toArray())));
		}
		criterionList.add(Restrictions.eq("uuId.ownerId", ownerId));
		criterionList.add(Restrictions.eq("enabled", Boolean.TRUE));

		Criterion[] criterions = criterionList.toArray(new Criterion[criterionList.size()]);

		List<ChartOfAccount> lists = dao.getList(ChartOfAccount.class, criterions, new Order[] { Order.asc("ref") });

		// 将更改的科目添加到lists中
		for (ChartOfAccount coa : chartOfAccounts) {
			if (coa.getEnabled()) {
				lists.add(coa);
			}
		}

		// 针对lists进行试算平衡
		BigDecimal debitValue = BigDecimal.ZERO;
		BigDecimal creditValue = BigDecimal.ZERO;
		BigDecimal debitBalanceValue = BigDecimal.ZERO;
		BigDecimal creditBalanceValue = BigDecimal.ZERO;

		for (ChartOfAccount coa : lists) {
			if (coa.getDebitCredit().equals(DebitCredit.debit) && coa.getAllowInput().equals(Boolean.TRUE)) {
				debitValue = debitValue.add(coa.getIniValue());
				debitBalanceValue = debitBalanceValue.add(coa.getBalance());
			}
			if (coa.getDebitCredit().equals(DebitCredit.credit) && coa.getAllowInput().equals(Boolean.TRUE)) {
				creditValue = creditValue.add(coa.getIniValue());
				creditBalanceValue = creditBalanceValue.add(coa.getBalance());
			}
		}
		logger.info("end computeBalance:[ id =" + WebUtil.getLogBasicString() + "]");
		return debitValue.equals(creditValue) && debitBalanceValue.equals(creditBalanceValue);
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveCOA(List<ChartOfAccount> chartOfAccounts,Long ownerId) {
		// TODO 试算平衡
		logger.info("begin saveCOA.");
		boolean isSuccess = false;
		boolean isInit = false;
		if (!computeBalance(chartOfAccounts)) {
			throw new OperationException("试算不平衡，不可保存！");
		}
		if(accountPeriodService.checkInitialAccountPeriod(ownerId)){
			isInit = true;
		}
		for (ChartOfAccount chartOfAccount : chartOfAccounts) {
			if (chartOfAccount.getId() == null) {

				chartOfAccount.setFrTemplate(Boolean.FALSE);
				chartOfAccount.setCurrValue(BigDecimal.ZERO);

				ChartOfAccount c = this.saveChartOfAccount(chartOfAccount,ownerId);
				this.modifyCoaMonthSumByCoaAmt(c.getIniValue(), c.getBalance(), c.getHardCode(),ownerId);

				ChartOfAccount newCoa = this.getChartOfAccountByCode(c.getHardCode(),ownerId);
				if (newCoa != null) {
					isSuccess = true;
				} else {
					isSuccess = false;
				}
			} else {
				ChartOfAccount coa = this.getChartOfAccountById(chartOfAccount.getId(),ownerId);
				if(!isInit){
					if(coa.getIniValue().compareTo(chartOfAccount.getIniValue())!=0){
						throw new OperationException("结账后不可修改期初值，请先去反结账");
					}
				}
				// 更新老科目 取差额
				this.modifyCoaMonthSumByCoaAmt(chartOfAccount.getIniValue().subtract(coa.getIniValue()),
						chartOfAccount.getBalance().subtract(coa.getBalance()), chartOfAccount.getHardCode(),ownerId);
				chartOfAccount
						.setCurrValue(coa.getCurrValue().add(chartOfAccount.getIniValue().subtract(coa.getIniValue())));
				chartOfAccount.setFrTemplate(coa.getFrTemplate());

				chartOfAccount.setCreditCashFlow(coa.getCreditCashFlow());
				chartOfAccount.setDebitCashFlow(coa.getDebitCashFlow());
				chartOfAccount.setParentId(coa.getParentId());

				isSuccess = this.updateChartOfAccount(chartOfAccount,ownerId);

			}
		}
		logger.info("end saveCOA:[ id =" + WebUtil.getLogBasicString() + "]");
		return isSuccess;
	}
	
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAllValueWithParentForDelete(UionPKId pk, BigDecimal credit,BigDecimal debit,BigDecimal iniValue,BigDecimal balance) {
		logger.info("begin updateCurrentValueWithParent.");
		ChartOfAccount chartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, pk,
				LockMode.UPGRADE_NOWAIT);

		if (!chartOfAccount.getAllowInput())
			throw new OperationException("科目：" + chartOfAccount.getDisplayValue() + "有子科目，不能参与计算！");

		chartOfAccount.setCreditAmt(chartOfAccount.getCreditAmt().subtract(credit));
		chartOfAccount.setDebitAmt(chartOfAccount.getDebitAmt().subtract(debit));
		chartOfAccount.setBalance(chartOfAccount.getBalance().subtract(balance));
		chartOfAccount.setIniValue(chartOfAccount.getIniValue().subtract(iniValue));

		Long pid = chartOfAccount.getParentId();

		int n = 0;
		while (pid != null) {
			UionPKId uPK = new UionPKId(pid, pk.getOwnerId());
			ChartOfAccount parentChartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, uPK,
					LockMode.UPGRADE_NOWAIT);
			
			parentChartOfAccount.setCreditAmt(parentChartOfAccount.getCreditAmt().subtract(credit));
			parentChartOfAccount.setDebitAmt(parentChartOfAccount.getDebitAmt().subtract(debit));
			parentChartOfAccount.setBalance(parentChartOfAccount.getBalance().subtract(balance));
			parentChartOfAccount.setIniValue(parentChartOfAccount.getIniValue().subtract(iniValue));
			dao.update(parentChartOfAccount);
			pid = parentChartOfAccount.getParentId();
			n++;
			if (parentChartOfAccount.getId().equals(pid) || n > 10)
				break;
		}

		dao.update(chartOfAccount);
		logger.info("end updateCurrentValueWithParent:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateCurrentValueWithParent(UionPKId pk, BigDecimal amt, String flag) {
		logger.info("begin updateCurrentValueWithParent.");
		ChartOfAccount chartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, pk,
				LockMode.UPGRADE_NOWAIT);

		if (!chartOfAccount.getAllowInput())
			throw new OperationException("科目：" + chartOfAccount.getDisplayValue() + "有子科目，不能参与计算！");

		if (flag.equals("save")) {
			chartOfAccount.setCurrValue(chartOfAccount.getCurrValue().add(amt));
		} else if (flag.equals("del")) {
			chartOfAccount.setCurrValue(chartOfAccount.getCurrValue().subtract(amt));
		}

		Long pid = chartOfAccount.getParentId();

		int n = 0;
		while (pid != null) {
			UionPKId uPK = new UionPKId(pid, pk.getOwnerId());
			ChartOfAccount parentChartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, uPK,
					LockMode.UPGRADE_NOWAIT);
			if (flag.equals("save")) {
				parentChartOfAccount.setCurrValue(parentChartOfAccount.getCurrValue().add(amt));
			} else if (flag.equals("del")) {
				parentChartOfAccount.setCurrValue(parentChartOfAccount.getCurrValue().subtract(amt));
			}
			dao.update(parentChartOfAccount);
			pid = parentChartOfAccount.getParentId();
			n++;
			if (parentChartOfAccount.getId().equals(pid) || n > 10)
				break;
		}

		dao.update(chartOfAccount);
		logger.info("end updateCurrentValueWithParent:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List getChartOfAccountList(ComputeCarryoverClass classId, String ctime,Long ownerId) {
		logger.info("begin getChartOfAccountByJournal.");

		Object[] obj = new Object[] { ownerId, Boolean.TRUE, Boolean.TRUE };

		if (classId.equals(ComputeCarryoverClass.wages)) {
			String[] hardCodes = SystemConfig.getCoaProperty("carryover.wages").split(",");
			String hql = getSqlWithHardCodeSet(hardCodes, "hardCode");
			List<ChartOfAccount> list = dao.find(hql, obj);
			logger.info("end getChartOfAccountByJournal:[ id =" + WebUtil.getLogBasicString() + "]");
			return list;
		}

		if (classId.equals(ComputeCarryoverClass.amortization)) {

			String[] hardCodes = SystemConfig.getCoaProperty("carryover.amortization").split(",");
			String hql = getSqlWithHardCodeSet(hardCodes, "hardCode");
			List<ChartOfAccount> list = dao.find(hql, obj);
			logger.info("end getChartOfAccountByJournal:[ id =" + WebUtil.getLogBasicString() + "]");
			return list;

		}

		if (classId.equals(ComputeCarryoverClass.gold)) {

			String[] hardCodes = SystemConfig.getCoaProperty("carryover.gold").split(",");
			String hql = getSqlWithHardCodeSet(hardCodes, "hardCode");
			List<ChartOfAccount> list = dao.find(hql, obj);
			logger.info("end getChartOfAccountByJournal:[ id =" + WebUtil.getLogBasicString() + "]");
			return list;

		}

		if (classId.equals(ComputeCarryoverClass.tax)) {

			String[] hardCodes = SystemConfig.getCoaProperty("carryover.tax").split(",");
			String hql = getSqlWithHardCodeSetXx(hardCodes, "hardCode");
			List<ChartOfAccount> list = dao.find(hql, obj);
			logger.info("end getChartOfAccountByJournal:[ id =" + WebUtil.getLogBasicString() + "]");
			return list;
		}

		if (classId.equals(ComputeCarryoverClass.depreciation)) {

			String[] hardCodes = SystemConfig.getCoaProperty("carryover.depreciation").split(",");
			String hql = getSqlWithHardCodeSet(hardCodes, "hardCode");
			List<ChartOfAccount> list = dao.find(hql, obj);
			logger.info("end getChartOfAccountByJournal:[ id =" + WebUtil.getLogBasicString() + "]");
			return list;
		}

		if (classId.equals(ComputeCarryoverClass.incometax)) {

			String[] hardCodes = SystemConfig.getCoaProperty("carryover.incometax").split(",");
			String hql = getSqlWithHardCodeSet(hardCodes, "hardCode");
			List<ChartOfAccount> list = dao.find(hql, obj);
			logger.info("end getChartOfAccountByJournal:[ id =" + WebUtil.getLogBasicString() + "]");
			return list;
		}

		if (classId.equals(ComputeCarryoverClass.carryover)) {
			String[] hardCodes = SystemConfig.getCoaProperty("carryover.carryovermoban").split(",");
			String hql = getSqlWithHardCodeSet(hardCodes, "hardCode");
			List<ChartOfAccount> list = dao.find(hql, obj);
			logger.info("end getChartOfAccountByJournal:[ id =" + WebUtil.getLogBasicString() + "]");
			return list;

		}
		logger.info("end getChartOfAccountByJournal:[ id =" + WebUtil.getLogBasicString() + "]");
		return null;
	}

	// 倒序
	private static String getSqlWithHardCodeSet(String[] codeSet, String colName) {
		// '6001%' or coa.ref like '6051%'
		String sqlString = " from ChartOfAccount where  (";
		for (String object : codeSet) {
			sqlString = sqlString + " " + colName + " like  '" + object + "%' or";
		}
		sqlString = sqlString.substring(0, sqlString.length() - 2);
		sqlString = sqlString + " ) and uuId.ownerId= ? and enabled = ? and allowInput = ? order by hardCode desc";
		return sqlString;

	}

	// 顺序
	private static String getSqlWithHardCodeSetXx(String[] codeSet, String colName) {
		// '6001%' or coa.ref like '6051%'
		String sqlString = " from ChartOfAccount where  (";
		for (String object : codeSet) {
			sqlString = sqlString + " " + colName + " like  '" + object + "%' or";
		}
		sqlString = sqlString.substring(0, sqlString.length() - 2);
		sqlString = sqlString + " ) and uuId.ownerId= ? and enabled = ? and allowInput = ? order by hardCode";
		return sqlString;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<ChartOfAccountForListVO> getAllChartOfAccountForListVO(Long ownerId) {
		logger.info("begin getAllChartOfAccountForListVO.");

		String hql = "select new com.zqw.account.vo.fms.ChartOfAccountForListVO("

				+ "chartOfAccount.uuId.id," + "concat(chartOfAccount.hardCode,chartOfAccount.name),"
				+ "chartOfAccount.name,chartOfAccount.ref,chartOfAccount.allowInput,"
				+ "chartOfAccount.hardCode,chartOfAccount.coaClass,chartOfAccount.debitCredit) "

				+ "from ChartOfAccount chartOfAccount " + "where chartOfAccount.uuId.ownerId = ?";

		List<ChartOfAccountForListVO> list = dao.find(hql, ownerId);
		logger.info("end getAllChartOfAccountForListVO:[ id =" + WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public ChartOfAccountForListVO getChartOfAccountForListVO(Long ownerId,String query) {
		logger.info("begin getChartOfAccountForListVO.");
		Long id = Long.valueOf(query);
		Object[] obj = { ownerId, id };
		String hql = "select new com.zqw.account.vo.fms.ChartOfAccountForListVO("

				+ "chartOfAccount.uuId.id," + "concat(chartOfAccount.hardCode,chartOfAccount.name),"
				+ "chartOfAccount.name,chartOfAccount.ref,chartOfAccount.allowInput,"
				+ "chartOfAccount.hardCode,chartOfAccount.coaClass,chartOfAccount.debitCredit) "

				+ "from ChartOfAccount chartOfAccount "
				+ "where chartOfAccount.uuId.ownerId = ? and chartOfAccount.uuId.id = ?";
		List<ChartOfAccountForListVO> list = dao.find(hql, obj);
		logger.info("end getChartOfAccountForListVO:[ id =" + WebUtil.getLogBasicString() + "]");
		return list.get(0);
	}

	private void chartOfAccountUsedCheck(String hardCode,Long ownerId) {
		logger.info("begin chartOfAccountUsedCheck.");
		Object[] obj = { ownerId, hardCode };

		String[] hardCodes = SystemConfig.getCoaProperty("coa.forbid.children").split(",");
		if (CollectionUtils.arrayToList(hardCodes).contains(hardCode))
			throw new OperationException("科目： " + hardCode + "属于往来科目，不能增加下级科目！");
		
		if (hardCode.startsWith("1403")){
			ChartOfAccount coa = this.getChartOfAccountByCode("1403",ownerId);
			Long count = dao.getCount4PagingWithSQL("select count(id) from t_prod_product "
					+ "where ownerId = "+ownerId +" and coaInventory_id = "+coa.getId());
			if(count>0){
				throw new OperationException("抱歉，产品的库存科目：1403一旦被关联，不可新增下级科目。");
			}
		}
		if (hardCode.startsWith("1405")){
			ChartOfAccount coa = this.getChartOfAccountByCode("1405",ownerId);
			Long count = dao.getCount4PagingWithSQL("select count(id) from t_prod_product "
					+ "where ownerId = "+ownerId +" and coaInventory_id = "+coa.getId());
			if(count>0){
				throw new OperationException("抱歉，产品的库存科目：1405一旦被关联，不可新增下级科目。");
			}
		}

//		String hqlAsset = "select distinct(coa.hardCode)  from ChartOfAccount coa,  Asset ast where "
//				+ "( coa= ast.coaDepreciate or coa=ast.coaExpense) " + " and coa.uuId.ownerId=? and coa.hardCode=? ";
//
//		List<String> assetHardCodelist = dao.find(hqlAsset, obj);
//		if (assetHardCodelist.size() > 0)
//			throw new OperationException("科目： " + hardCode + "已经被固定资产使用，不能增加下级科目！");
//
//		String prdHql = "select distinct(coa.hardCode)  from ChartOfAccount coa, Product prd  where "
//				+ "(coa=prd.coaInventory  or coa= prd.coaIncome  or coa= prd.coaIncome " + "or coa= prd.coaCost ) "
//				+ " and coa.uuId.ownerId=? and coa.hardCode=? ";
//
//		List<String> prdHardCodelist = dao.find(prdHql, obj);
//		if (prdHardCodelist.size() > 0)
//			throw new OperationException("科目： " + hardCode + "已经被产品使用，不能增加下级科目！");

		logger.info("end getChartOfAccountForListVO:[ id =" + WebUtil.getLogBasicString() + "]");

	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<ChartOfAccountBankListVo> getBankCapital() {
		logger.info("begin getBankCapital.");
//		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM");
//		String dateString = formatter.format(new Date());
//		String dateSql = DateUtil.getSqlDateWithSymbol("lastUpdateDate", dateString);
		String[] hardCodes = SystemConfig.getCoaProperty("coa.gold.value").split(",");
		String sql = " select new com.zqw.account.vo.fms.ChartOfAccountBankListVo(name,currValue) from ChartOfAccount"
				+ " where allowInput = 'Y' and enabled = 'Y' and currValue <> 0 and ownerId =?  and (";
		for (String object : hardCodes) {
			sql = sql + " " + "hardCode" + " like  '" + object + "%' or";
		}
		sql = sql.substring(0, sql.length() - 2);
		List<ChartOfAccountBankListVo> returnList = dao.find(sql + ") order by currValue desc",
				(Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID));
		if(returnList!=null && returnList.size()>20){
			returnList = returnList.subList(0, 20);
		}
		logger.info("end getBankCapital:[ id =" + WebUtil.getLogBasicString() + "]");
		return returnList;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public ChartOfAccount getByCodeWithNegativeOwnerId(String code) {
		logger.info("begin getChartOfAccountByCode. code = [" + code + "]");

		Long ownerId = -2L;

		List<ChartOfAccount> list = dao.find("from ChartOfAccount where hardCode = '" + code + "' and uuId.ownerId = ?",
				ownerId);
		ChartOfAccount coa = null;
		if (list != null && list.size() > 0) {
			coa = list.get(0);
		}

		logger.info("end getChartOfAccountByCode.[ id =" + WebUtil.getLogBasicString() + "]");

		return coa;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<ChartOfAccountIdVo> getIdFromChartOfAccount(Long ownerId) {
		String sql = "select new com.zqw.account.vo.fms.ChartOfAccountIdVo(uuId.id,hardCode) from ChartOfAccount where ownerId ="
				+ ownerId;
		List<ChartOfAccountIdVo> list = dao.find(sql);
		return list;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<ChartOfAccount> getAccountChartOfAccount(Long ownerId) {
		// TODO Auto-generated method stub
		List<ChartOfAccount> list1001 = dao.find("from ChartOfAccount where (hardCode like '1001%' or hardCode like '1002%') "
				+ " and allowInput = 'Y' and uuId.ownerId = "+ownerId+" and enabled = 'Y' order by hardCode asc ");
		return list1001;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public void modifyCoaMonthSumByCoaAmt(BigDecimal initAmt, BigDecimal balanceAmt, String hardCode,Long ownerId) {
		logger.info("begin modifyCoaMonthSumByCoaAmt.");

		// 依据 initAmt 更改科目的当前余额和年初额
		Object[] obj = { ownerId, hardCode };
		Long str = dao.executeSql(
				"update t_materialize_coa_month_sum  set currValue=currValue+" + initAmt + ", balance=balance+"
						+ initAmt + " " + " where ownerId = " + ownerId + " and  coaHardCode  =  '" + hardCode + "' ",
				null);
		logger.info("第一条" + str);
	
		logger.info("end  modifyCoaMonthSumByCoaAmt:[ id =" + WebUtil.getLogBasicString() + "]");
	}
}
