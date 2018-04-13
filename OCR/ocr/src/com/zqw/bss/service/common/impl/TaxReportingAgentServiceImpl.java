package com.zqw.bss.service.common.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.DateUtil;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PersonInfo;
import com.zqw.bss.model.crm.TaxDeclare;
import com.zqw.bss.model.crm.TaxStatusLogs;
import com.zqw.bss.model.sys.Role;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.common.TaxReportingAgentService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.common.TaxDeclareListVo;
import com.zqw.bss.vo.common.TaxReportListVo;
import com.zqw.bss.vo.sys.SearchUserBuyListVo;
import com.zqw.bss.vo.sys.SearchUserTaxVo;


@Service
@Qualifier("taxReportingAgentService")
@SuppressWarnings({"unchecked","rawtypes"})
public class TaxReportingAgentServiceImpl implements TaxReportingAgentService{

	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<TaxReportListVo> getAllTaxReportUser() {
		List<TaxReportListVo> list = dao.find("select new com.zqw.bss.vo.common.TaxReportListVo(owner.id,owner.loginId,en.name) from Owner owner left join owner.enterpriseInfo en"
				+ " where owner.taxCode is null");
		List<TaxReportListVo> listby = new ArrayList<TaxReportListVo>();
		for(TaxReportListVo vo:list){
			List<AccountPeriod> accountPeriod = dao.find("from AccountPeriod where ownerId  = "+vo.getId()+" order by accountPeriodMonth");
			if(accountPeriod.size()>0){
				vo.setMouthDate(accountPeriod.get(0).getAccountPeriodMonth());
			}
			List<PersonInfo> per = dao.find("from PersonInfo where createBy = '"+vo.getLoginId()+"' order by createDate");
			if(per.size()>0){
				vo.setLoginId(per.get(0).getName()+" ( "+vo.getLoginId()+" )");
			}
			List<AccountOrderPay> accountOrderList = dao
					.find("from AccountOrderPay pay where pay.accountOrder.ownerId = " + vo.getId()
							+ " and pay.payStatus = 'paid'");
			if (accountOrderList.size() > 0) {
				String idStr = " in ( ";
				for (AccountOrderPay ao : accountOrderList) {
					idStr = idStr + ao.getAccountOrder().getId() + ",";
				}
				idStr = idStr.substring(0, idStr.length() - 1) + ") ";
				String roleHql = "select new "
						+ " com.zqw.bss.vo.sys.SearchUserBuyListVo(ao.id, product.productName,product.productCode) from"
						+ " AccountOrder ao left join ao.accountProducts product" + " where ao.id " + idStr;
				List<SearchUserBuyListVo> productNameList = dao.find(roleHql);
				String ss = "";
				String name = "";
				for (AccountOrderPay so : accountOrderList) {
					for (SearchUserBuyListVo map : productNameList) {
						if (so.getAccountOrder().getId().equals(map.getAccountorderid()) && !StringUtils.isEmpty(map.getProductName())&&!ss.equals(map.getProductName())) {
							if (map.getProductCode().equals("0005")||map.getProductCode().equals("0006")||map.getProductCode().equals("0007")||map.getProductCode().equals("0008")) {
								name = name + map.getProductName() + ",";
								ss = map.getProductName();
							}
						}
					}
				}
				if (name != "") {
					name = name.substring(0, name.length() - 1);
					vo.setProductName(name);
					listby.add(vo);
				}
			}
		}
		return listby;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateTaxReportingAgent(String username,List<TaxReportListVo> taxReportListVo) {
		List<User> user = dao.find("from User where username = '"+username+"'");
		for(TaxReportListVo vo : taxReportListVo){
			if(user.get(0).getEmployeeCode()==null){
				return false;
			}
			Long count = dao.executeHql("update Owner set taxCode = '"+user.get(0).getEmployeeCode()+"' where id = "+vo.getId(), null);
			if(count==0){
				return false;
			}
			TaxStatusLogs log = new TaxStatusLogs();
			log.setMouthDate(vo.getMouthDate());
			log.setName(vo.getName());
			log.setOwnerId(vo.getId());
			log.setUsername(vo.getLoginId());
			dao.save(log);
		}
		return true;
	}
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public TaxDeclare updateTaxReporting(TaxDeclare taxDeclare) {
		//查询验证的SQL语句不放于Remote* 类中,移到业务逻辑的类中处理 hyw 2017-9-30
		List bpp = dao.executeQuerySql("SELECT bpp.endDate FROM t_bss_billing_product_permission bpp LEFT JOIN t_bss_account_product ap  ON ap.id = bpp.accountProduct_id"
				+ " WHERE ownerId ="+taxDeclare.getOwnerId()
				+ " AND (ap.productCode ='0009' or ap.productCode ='00010') ORDER BY bpp.endDate DESC",null);
		if(bpp.size()==0)
			throw new OperationException("该用户还没购买产品，不能报税哦！");
		List<TaxDeclare> taxList = dao.find("from TaxDeclare where ownerId = '" + taxDeclare.getOwnerId()
				+ "' and mouthDate = '" +taxDeclare.getMouthDate()+"'");
		if(taxList.size()>0){
			throw new OperationException(taxList.get(0).getMouthDate()+"已报税！");
		}
		List<AccountPeriod> ac = dao.find("from AccountPeriod where ownerId = '" + taxDeclare.getOwnerId()
				+ "' and accountPeriodMonth = '" +taxDeclare.getMouthDate()+"'");
		if(ac.size()==0){
			throw new OperationException(taxDeclare.getMouthDate()+"还没有结账，请先去结账才可以报税哦！");
		}
		if (!ac.get(0).getAccountPeriodStatus().toString().equals("closed")) {
			throw new OperationException(ac.get(0).getAccountPeriodMonth()+"还没有结账，请先去结账才可以报税哦！");
		}
		
		taxDeclare.setTaxStatus(taxDeclare.getMouthDate()+" 已申报");
		taxDeclare.setTaxwithStatus(true);
		taxDeclare.setUsername((String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME));
		taxDeclare = (TaxDeclare) dao.save(taxDeclare);
		return taxDeclare;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<TaxDeclareListVo> getTaxReporting(Long ownerId,String uesername,BasePagerObject bso) {
		Owner  owner = (Owner) dao.getObject(Owner.class, ownerId);
		Long vat = owner.getVat();
		List bpp = dao.executeQuerySql("SELECT bpp.endDate FROM t_bss_billing_product_permission bpp LEFT JOIN t_bss_account_product ap  ON ap.id = bpp.accountProduct_id"
				+ " WHERE ownerId ="+ownerId
				+ " AND (ap.productCode ='0009' or ap.productCode ='00010')  ORDER BY bpp.endDate DESC",null);
		if(bpp.size()==0){
			throw new OperationException(" 该用户没购买产品不能报税！");
		}
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sqltax = "SELECT ap.accountPeriodMonth, td.username,td.vat,td.taxStatus ,td.taxwithStatus"
				+ " FROM t_fms_account_period ap LEFT JOIN t_bss_tax_declare td ON  ap.accountPeriodMonth=td.mouthDate AND ap.ownerId = td.ownerId "
				+ " WHERE ap.accountPeriodMonth<='"+ DateUtil.format((Date) bpp.get(0),"yyyy-MM") +"' and ap.ownerId = "+ownerId +" "+conStr ;
		List taxvo = dao.getLst4PagingWithSQL(sqltax+" order by ap.accountPeriodMonth desc",
				 new int[] {bso.getPagenum(),bso.getPagesize()});
		String countsql = "SELECT count(distinct ap.id)"
				+ " FROM t_fms_account_period ap LEFT JOIN t_bss_tax_declare td ON  ap.accountPeriodMonth=td.mouthDate "
				+ " WHERE ap.accountPeriodMonth<='"+ DateUtil.format((Date) bpp.get(0),"yyyy-MM") +"' and ap.ownerId = "+ownerId +" "+conStr ;
		 Long count = dao.getCount4PagingWithSQL(countsql);
		 List<TaxDeclareListVo> taxDeclares = new ArrayList<TaxDeclareListVo>();
		 for (Object object : taxvo) {
				TaxDeclareListVo taxDeclareListVo=new TaxDeclareListVo((Object[]) object);
				taxDeclares.add(taxDeclareListVo);
			}
		 for(TaxDeclareListVo vo : taxDeclares){
			 vo.setVat(vat);
			 vo.setOwnerId(ownerId);
		 }
		 BaseModelList<TaxDeclareListVo> lists = new BaseModelList<TaxDeclareListVo>(count,
					WebUtil.getEntryListFromProxyList(taxDeclares, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AccountPeriod getAccountPeriod(Long id) {
		List<AccountPeriod> ap = dao.find("from AccountPeriod where ownerId = "+ id +" and accountPeriodStatus<>'closed' order by accountPeriodMonth asc");
		AccountPeriod accountPeriod = new AccountPeriod();
		if(ap.size()>0){
			accountPeriod = ap.get(0);
		}
		return accountPeriod;
	}

}
