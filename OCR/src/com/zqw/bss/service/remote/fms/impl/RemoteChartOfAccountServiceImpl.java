package com.zqw.bss.service.remote.fms.impl;

import java.math.BigDecimal;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.model.basic.UionPKId;
import com.zqw.bss.model.fms.ChartOfAccount;
import com.zqw.bss.service.fms.ChartOfAccountService;
import com.zqw.bss.service.remote.fms.RemoteChartOfAccountService;
import com.zqw.bss.util.SystemConstant.Display;
import com.zqw.bss.util.WebUtil;
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
 * @date 2016年4月20日 下午1:19:49
 * @version 1.0
 */

@SuppressWarnings({ "unchecked"})
public class RemoteChartOfAccountServiceImpl implements RemoteChartOfAccountService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected ChartOfAccountService chartOfAccountService;
	

	@Autowired
	protected DAO dao;

//	@Override
//	public Boolean createChartOfAccount(ChartOfAccount chartOfAccount) {
//		logger.info("begin createChartOfAccount");
//		if (chartOfAccountService.saveChartOfAccount(chartOfAccount) != null){
//			Boolean boo = SystemConstant.FLAG_SUCCESS;
//			logger.info("end  createChartOfAccount:[ id ="+ WebUtil.getLogBasicString() + "]");
//			return boo;
//		}
//		else{
//			Boolean boo =  SystemConstant.FLAG_FAIL;
//			logger.info("end  createChartOfAccount:[ id ="+ WebUtil.getLogBasicString() + "]");
//			return boo;
//		}
//			
//	}

	@Override
	public ChartOfAccount createCOA(ChartOfAccount chartOfAccount,Long ownerId) {

		logger.info("begin create ChartOfAccount.");
//		SecurityUtils.getSubject().checkPermission("base:coa:create");
		if (null == chartOfAccount) {
			logger.info("end  create ChartOfAccount.[ id ="+ WebUtil.getLogBasicString() + "]");
			return null;
		}
		if (chartOfAccount.getParentId() == null) {
			logger.info("end  create ChartOfAccount.[ id ="+ WebUtil.getLogBasicString() + "]");
			return null;
		}
		ChartOfAccount parentCOA = this.chartOfAccountService.getChartOfAccountById(chartOfAccount.getParentId(),ownerId);
		chartOfAccount.setLevel(parentCOA.getLevel() + 1);
		chartOfAccount.setHardCode(parentCOA.getHardCode());
		chartOfAccount.setCoaClass(parentCOA.getCoaClass());

		chartOfAccount.setAllowInput(Boolean.TRUE);
		chartOfAccount.setCurrValue(BigDecimal.valueOf(0));
		chartOfAccount.setIniValue(BigDecimal.valueOf(0));
		chartOfAccount.setDisplay(Display.unlimited);
		chartOfAccount.setFrTemplate(Boolean.FALSE);

		chartOfAccount.setOwnerId(ownerId);
		chartOfAccount = this.chartOfAccountService.saveChartOfAccount(chartOfAccount,ownerId);
		logger.info("end create ChartOfAccount. id=[" + chartOfAccount.getId() + "]");
		chartOfAccount = (ChartOfAccount) WebUtil.getEntryFromProxyObj(chartOfAccount, dao);
		logger.info("end  createCOA.ChartOfAccount: [ id ="
				+ chartOfAccount.getId() + WebUtil.getLogBasicString() + "]");
		return chartOfAccount;
	}

	@Override
	public Boolean delChartOfAccount(Long id,Long ownerId) {
		logger.info("begin delChartOfAccount. id = [" + id + "]");
		//在chartOfAccountService.delChartOfAccount获得ChartOfAccount并判断
		//ChartOfAccount coa = (ChartOfAccount) dao.getObject(ChartOfAccount.class, new UionPKId(id, ownerId));
		//if(!ownerId.equals(coa.getOwnerId())){
		//	throw new OperationException("访问对象不属于当前用户，请联系管理员！");
		//}
		Boolean boo = chartOfAccountService.delChartOfAccount(id,ownerId);
		logger.info("end  delChartOfAccount.[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

	@Override
	public Boolean updateChartOfAccount(ChartOfAccount chartOfAccount,Long ownerId) {

		logger.info("begin update ChartOfAccount.");
//		SecurityUtils.getSubject().checkPermission("base:coa:update");
		if (null == chartOfAccount) {
			logger.info("end  updateChartOfAccount.[ id ="+ WebUtil.getLogBasicString() + "]");
			return null;
		}
		if (chartOfAccount.getId() == null) {
			logger.info("end  updateChartOfAccount.[ id ="+ WebUtil.getLogBasicString() + "]");
			return false;
		}
		ChartOfAccount roleSrc = chartOfAccountService.getChartOfAccountById(chartOfAccount.getId(),ownerId);
		chartOfAccount.setCreateBy(roleSrc.getCreateBy());
		chartOfAccount.setCreateDate(roleSrc.getCreateDate());
		Boolean boo = chartOfAccountService.updateChartOfAccount(chartOfAccount,ownerId);
		logger.info("end  updateChartOfAccount.[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

//	@Override
//	public ChartOfAccount getChartOfAccountById(Long id) {
//		logger.info("begin getChartOfAccountById. id  = [" + id + "]");
//		SecurityUtils.getSubject().checkPermission("base:coa:view");
//		ChartOfAccount coa = (ChartOfAccount) WebUtil
//				.getEntryFromProxyObj(chartOfAccountService.getChartOfAccountById(id), dao);
//		if (WebUtil.isCurrentOwnerId(coa.getOwnerId())){
//			ChartOfAccount chartOfAccount =  (ChartOfAccount) WebUtil.getEntryFromProxyObj(coa, dao);
//			logger.info("end  getChartOfAccountById.ChartOfAccount: [ id ="
//					+ chartOfAccount.getId() + WebUtil.getLogBasicString() + "]");
//			return chartOfAccount;
//		}	
//		else {
//			logger.error(" ChartOfAccount object is not current user . id =" + id + " " + coa.getId());
//			throw new OperationException("访问对象不属于当前用户，请联系管理员！");
//		}
//	}

	@Override
	public List<ChartOfAccount> getChartOfAccounts(Long ownerId) {
		logger.info("begin getChartOfAccounts. ");
//		SecurityUtils.getSubject().checkPermissions("base:coa:view","biz:quotation:create","biz:sales:create","biz:purchase:create"
//				,"biz:reimburse:create","fms:expensepay:create","fms:feeincome:create");
		List<ChartOfAccount> list =  WebUtil.getEntryListFromProxyList(chartOfAccountService.getChartOfAccounts(ownerId), dao);
		logger.info("end  getChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}
//
//	@Override
//	public List<ChartOfAccount> searchChartOfAccount(ChartOfAccount chartOfAccount) {
//		logger.info("begin searchChartOfAccount.");
//		List<ChartOfAccount> list = WebUtil.getEntryListFromProxyList(chartOfAccountService.findChartOfAccount(chartOfAccount), dao);
//		logger.info("end  searchChartOfAccount.[ id ="+ WebUtil.getLogBasicString() + "]");
//		return list;
//	}

	@Override
	public List<ChartOfAccount> getChartOfAccounts(Integer classid,Long ownerId) {
		logger.info("begin getChartOfAccounts. id =  [" + classid + "");
//		SecurityUtils.getSubject().checkPermission("base:coa:view");
		if (classid == null) {
		logger.info("end  getChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
			return null;
		}
		/**
		 * 资产类： 流动资产 1， 非流动资产5，
		 * 
		 * 负债类： 流动负债11， 非流动负债15，
		 * 
		 * 所有者权益类： 所有者权益21，
		 * 
		 * 成本类： 主营成本71，
		 * 
		 * 损益类： 主营收入31， 主营支出51， 非主营收入41 非主营支出61， 利润 81
		 * 
		 */
		switch (classid) {
		case 1: {
			// 资产类
			List<ChartOfAccount> list = WebUtil.getEntryListFromProxyList(
					this.chartOfAccountService.getChartOfAccounts(new Long[] { 1L, 5L },ownerId), dao);
			logger.info("end  getChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
			return list;
		}
		case 2: {
			// 负债类
			List<ChartOfAccount> list = WebUtil.getEntryListFromProxyList(
					this.chartOfAccountService.getChartOfAccounts(new Long[] { 11L, 15L },ownerId), dao);
			logger.info("end  getChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
			return list;
		}
		case 3: {
			// 所有者权益类
			List<ChartOfAccount> list = WebUtil.getEntryListFromProxyList(this.chartOfAccountService.getChartOfAccounts(new Long[] { 21L },ownerId),
					dao);
			logger.info("end  getChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
			return list;
		}
		case 4: {
			// 成本类
			List<ChartOfAccount> list = WebUtil.getEntryListFromProxyList(this.chartOfAccountService.getChartOfAccounts(new Long[] { 71L },ownerId),
					dao);
			logger.info("end  getChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
			return list;
		}
		case 5: {
			// 损益类
			List<ChartOfAccount> list = WebUtil.getEntryListFromProxyList(
					this.chartOfAccountService.getChartOfAccounts(new Long[] { 31L, 51L, 41L, 61L, 81L },ownerId), dao);
			logger.info("end  getChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
			return list;
		}
		default:
			logger.info("end  getChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
			return null;
		}
	}

//	@Override
//	public BaseModelList<ChartOfAccount> searchChartOfAccounts(String query) {
//		logger.info("begin searchChartOfAccounts.");
//		String request = HsqlUtil.DecodeRequest(query);
//		BasePagerObject bso = HsqlUtil.toPager(request);
//		logger.info(bso);
//		BaseModelList<ChartOfAccount> list = chartOfAccountService.findChartOfAccounts(bso);
//		logger.info("end  searchChartOfAccounts.[ id ="+ WebUtil.getLogBasicString() + "]");
//		return list;
//	}

	@Override
	public List<ChartOfAccount> getChartOfAccountByRef(Integer classid,Long ownerId) {
//		SecurityUtils.getSubject().checkPermission("fms:carryover:journalview");
		logger.info("begin getChartOfAccountByRef .");
		List<ChartOfAccount> list =  WebUtil.getEntryListFromProxyList(chartOfAccountService.getChartOfAccountByRef(classid,ownerId), dao);
		logger.info("end  getChartOfAccountByRef.[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

//	@Override
//	public Boolean saveCOA(List<ChartOfAccount> chartOfAccounts,Long ownerId) {
//		
//		logger.info("begin saveCOA.");
//		SecurityUtils.getSubject().checkPermission("base:coa:create");
//		BillingProductUtil.checkBillingPermissions(dao, "基础模块", "billing:product:ordinary");
//		Boolean boo = this.chartOfAccountService.saveCOA(chartOfAccounts,ownerId);
//		logger.info("end  saveCOA.[ id ="+ WebUtil.getLogBasicString() + "]");
//		return boo;
//	}

	@Override
	public List<ChartOfAccount> getChartOfAccountByParentid(Long parentid,Long ownerId) {
		logger.info("begin getChartOfAccountByParentid.");
		 List<ChartOfAccount> list = WebUtil.getEntryListFromProxyList(chartOfAccountService.getChartOfAccountByParentid(parentid,ownerId), dao);
		 logger.info("end  getChartOfAccountByParentid.[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

//	@Override
//	public List getChartOfAccountTemp(ComputeCarryoverClass classId,String ctime) {
//		logger.info("begin getChartOfAccountByJournal.");
//		SecurityUtils.getSubject().checkPermission("fms:carryover:view");
//		Long ownerId = (Long)SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
//		if(classId.equals(ComputeCarryoverClass.carryover)){
//			Map<String, BigDecimal> map= carryoverService.getCarryover(ctime,ownerId);
//			List list = new  ArrayList();
//			list.add(map);
//		logger.info("end  getChartOfAccountTemp.[ id ="+ WebUtil.getLogBasicString() + "]");
//			return list;
//		}
//		List<JournalDetailListVo>  jdvList =  carryoverService.getJournalByCarryoverClass(classId, ctime,ownerId);
//		if (jdvList.size() > 0) {
//			List list = WebUtil
//					.getEntryListFromProxyList(jdvList,dao);
//		logger.info("end  getChartOfAccountTemp.[ id ="+ WebUtil.getLogBasicString() + "]");
//			return list; 
//		}
//	    List coaList=	chartOfAccountService.getChartOfAccountList(classId,ctime,ownerId);
//	    List list = WebUtil.getEntryListFromProxyList(coaList, dao);
//	    logger.info("end  getChartOfAccountTemp.[ id ="+ WebUtil.getLogBasicString() + "]");
//		return list;
//	}

	
	@Override
	public List<ChartOfAccountForListVO> getAllChartOfAccountForListVO(Long ownerId) {
		logger.info("begin getAllChartOfAccountForListVO.");
//		SecurityUtils.getSubject().checkPermission("base:coa:view");
		List<ChartOfAccountForListVO>  list = WebUtil.getEntryListFromProxyList(chartOfAccountService.getAllChartOfAccountForListVO(ownerId), dao);
		logger.info("end  getAllChartOfAccountForListVO.[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	public ChartOfAccountForListVO getChartOfAccountById(Long ownerId,String query) {
		logger.info("begin getChartOfAccountById.");
//		SecurityUtils.getSubject().checkPermission("base:coa:view");
		ChartOfAccountForListVO chartOfAccountForListVO =(ChartOfAccountForListVO) WebUtil
				.getEntryFromProxyObj(chartOfAccountService.getChartOfAccountForListVO(ownerId,query), dao);
		logger.info("end  getChartOfAccountById.[ id ="+ WebUtil.getLogBasicString() + "]");
		return chartOfAccountForListVO;
	}

//	@Override
//	public List<ChartOfAccountBankListVo> getBankCapital() {
//		// TODO Auto-generated method stub
//		return chartOfAccountService.getBankCapital();
//	}

	@Override
	public ChartOfAccount getByCodeWithNegativeOwnerId(String hardCode,Long ownerId) {
		// TODO Auto-generated method stub
		return (ChartOfAccount) WebUtil.getEntryFromProxyObj(chartOfAccountService.getByCodeWithNegativeOwnerId(hardCode));
	}

	@Override
	public List<ChartOfAccountIdVo> getIdFromChartOfAccount(Long ownerId) {
		List<ChartOfAccountIdVo> list =WebUtil.getEntryListFromProxyList(chartOfAccountService.getIdFromChartOfAccount(ownerId), dao);
		return list;
	}

	@Override
	public List<ChartOfAccount> getAccountChartOfAccount(Long ownerId) {
		// TODO Auto-generated method stub
		List<ChartOfAccount> list =WebUtil.getEntryListFromProxyList(chartOfAccountService.getAccountChartOfAccount(ownerId), dao);
		return list;
	}

}
