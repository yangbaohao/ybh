package com.zqw.bss.service.mkt.impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.PriceStrategy;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.service.mkt.AccountProductService;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.mkt.GiveDetailVo;
import com.zqw.bss.vo.mkt.SearchAccountProductListVo;

@Service
@Qualifier("accountProductService")
public class AccountProductServiceImpl implements AccountProductService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected DAO dao;

	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean savaAccountProduct(AccountProduct accountProduct) {
		logger.info("begin savaAccountProduct.");
		dao.save(accountProduct);
		logger.info("end savaAccountProduct.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAccountProduct(AccountProduct accountProduct) {
		logger.info("begin updateAccountProduct.");
		AccountProduct account = (AccountProduct) dao.getObject(AccountProduct.class, accountProduct.getId());
		accountProduct.setProductCode(account.getProductCode());
		accountProduct.setCreateDate(account.getCreateDate());
		accountProduct.setPermission(account.getPermission());
		accountProduct.setParentProductCode(account.getParentProductCode());
		dao.update(accountProduct);
		logger.info("end updateAccountProduct.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateProductStatus(AccountProduct accountProduct) {
		logger.info("begin updateProductStatus.");
		AccountProduct acProduct = (AccountProduct) dao.getObject(AccountProduct.class, accountProduct.getId());
		acProduct.setStatus(accountProduct.getStatus());
		dao.update(acProduct);
		logger.info("begin updateProductStatus.");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AccountProduct getAccountProductById(Long id) {
		logger.info("begin getAccountProductById.");
		AccountProduct accountProduct = (AccountProduct) dao.getObject(AccountProduct.class, id);
		logger.info("end getAccountProductById.");
		return accountProduct;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchAccountProductListVo> getAllAccountProductByPage(BasePagerObject bso) {
		logger.info("begin getAllAccountProductByPage.");
		String conStr = "";
		String pand = "Y";
		List<Condition> conditionList = bso.getCondition();
		for (Condition condition : conditionList) {
			String key = condition.getKey();
			if (key.equals("productName")) {
				String string = condition.getValue()[0];
				conStr += " AND productName LIKE '%" + string + "%'";
				pand="N";
			} else if (key.equals("priceAmt")) {
				String string1 = condition.getValue()[0];
				String string2 = condition.getValue()[1];
				conStr += " AND priceAmt >='"+string1+"' AND priceAmt<='"+string2+"'";
				pand="N";
			}
		}

		// String conStr = HsqlUtil.getConditionHqlStr(bso, new
		// StringBuilder());
		String sql = "select new com.zqw.bss.vo.mkt.SearchAccountProductListVo(ap.id,ap.productName,ap.description,ap.priceAmt,ap.createDate,ap.productCode,ap.status,ap.permission,ap.productPhoto) from"
				+ " AccountProduct ap where ap.status='N' " + conStr;
		List<SearchAccountProductListVo> list = dao.getLst4Paging(sql,
				new int[] { bso.getPagenum(), bso.getPagesize() });
		String hqlacc = "select count(distinct ap.id) from AccountProduct ap where ap.status='N' " + conStr;
		Long count = dao.getCount4Paging(hqlacc);

		String roleHql = "select new com.zqw.bss.vo.mkt.SearchAccountProductListVo(ap.id, pay.amt,ao.createDate)  from AccountOrderPay pay,"
				+ " AccountOrder ao left join ao.accountProducts ap where pay.accountOrder.id = ao.id and pay.payStatus='paid'";
		List<SearchAccountProductListVo> apList = dao.find(roleHql);
		Map<String, Date> map = this.getdate();
		for (SearchAccountProductListVo sav : list) {
			BigDecimal amt = BigDecimal.ZERO;
			BigDecimal mounthamt = BigDecimal.ZERO;
			for (SearchAccountProductListVo vo : apList) {
				if (vo.getId() != null) {
					if (vo.getId().equals(sav.getId())) {
						amt = amt.add(vo.getTotalAmt());
						if (map.get("firstDay").compareTo(vo.getCreateDate()) < 0
								&& map.get("lastDay").compareTo(vo.getCreateDate()) > 0) {
							mounthamt = mounthamt.add(vo.getTotalAmt());
						}
					}
				}
				sav.setTotalAmt(amt);
				sav.setMounthAmt(mounthamt);
			}
			List<PriceStrategy> listaa = dao.find("select new PriceStrategy(id,timeNum,totalAmt) from PriceStrategy where accountProduct.id = "+sav.getId());
			sav.setPriceStrategy(listaa);
		}
		BaseModelList<SearchAccountProductListVo> lists = new BaseModelList<SearchAccountProductListVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	private Map<String, Date> getdate() {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal_1 = Calendar.getInstance();
		cal_1.add(Calendar.MONTH, 0);
		cal_1.set(Calendar.DAY_OF_MONTH, 1);
		String firstDay = format.format(cal_1.getTime());
		Calendar cale = Calendar.getInstance();
		cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
		String lastDay = format.format(cale.getTime());
		Map<String, Date> map = new HashMap<String, Date>();
		try {
			map.put("firstDay", format.parse(firstDay));
			map.put("lastDay", format.parse(lastDay));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return map;
	}

	@Override
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<SearchAccountProductListVo> getAllAccountProductName() {
		List<SearchAccountProductListVo> list = dao
				.find("select new com.zqw.bss.vo.mkt.SearchAccountProductListVo(id,productName) from AccountProduct where status='N'  ");
		return list;
	}
	
	@Override
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<GiveDetailVo> getAllGiveDetail(Long id, BasePagerObject bso) {
		logger.info("begin getAllGiveDetail.");
		
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		
		String sql=" FROM t_bss_billing_product_permission p "
				+ "LEFT JOIN t_crm_owner t ON t.id=p.ownerId "
				+ "LEFT JOIN t_bss_order  o ON o.id=p.accountOrder_id "
				+ "LEFT JOIN t_fms_account_period l ON t.id = l.ownerId "
				+ "LEFT JOIN t_crm_user_info i ON t.enterpriseInfo_id = i.id "
				+ "LEFT JOIN t_bss_agent a ON a.id=t.agent_id "
				+ "LEFT JOIN t_bss_sys_user u ON u.id=t.sales_id "
				+ "LEFT JOIN t_bss_sys_user us ON us.employeeCode=t.customerCode "
				+ "LEFT JOIN t_bss_account_product tp ON tp.id=p.accountProduct_id "
				+ "WHERE p.orderPay_id IS  NULL AND tp.id="+id+" "+conStr
				+ " GROUP BY p.id ORDER BY p.createDate DESC ";
		
		String sqlCreate="SELECT tp.productName,t.id,DATE(p.createDate),t.loginId,"
				+ "t.regTelephone,i.name,a.agentName,u.username,us.username s,o.channel type "+sql;
		
		String hqlacc="SELECT COUNT(abc.id) FROM ( "
					+ "SELECT t.id id"+sql
					+") abc";
		Long count=dao.getCount4PagingWithSQL(hqlacc);
		
		@SuppressWarnings("rawtypes")
		List list=dao.getLst4PagingWithSQL(sqlCreate, new int[]{bso.getPagenum(),bso.getPagesize()});
		List<GiveDetailVo> gdvList=new ArrayList<GiveDetailVo>();
		for(Object object:list){
			Object[] obj=(Object[]) object;
			GiveDetailVo vo=new GiveDetailVo(obj);
			gdvList.add(vo);
		}
		
		BaseModelList<GiveDetailVo> bvo=new BaseModelList<>(count,WebUtil.getEntryListFromProxyList(gdvList,dao));
		logger.info("end getAllGiveDetail.");
		return bvo;
	}

}
