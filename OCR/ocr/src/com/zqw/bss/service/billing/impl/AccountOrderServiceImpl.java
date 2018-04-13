package com.zqw.bss.service.billing.impl;

import java.math.BigDecimal;
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
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.sale.AgentRevenue;
import com.zqw.bss.service.billing.AccountOrderService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.PayStatus;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.billing.AccountOrderHistoryVo;
import com.zqw.bss.vo.billing.AccountOrderVo;

@Service
@SuppressWarnings({ "unchecked", "rawtypes" })
public class AccountOrderServiceImpl implements AccountOrderService {

	Logger log = Logger.getLogger(getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public AccountOrder saveAccountOrder(AccountOrder accountOrder) {
		// TODO Auto-generated method stub
		log.debug("begin saveAccountOrder.");
		AccountOrder ao = (AccountOrder) dao.save(accountOrder);
		return ao;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delAccountOrderById(Long accountOrderId) {
		// TODO Auto-generated method stub
		Boolean flag = false;
		try {
			dao.removeObject(AccountOrder.class, accountOrderId);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
			log.debug("del fail = " + e.getMessage());
		}
		return flag;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAccountOrder(BigDecimal amt, Long agentId, AccountOrder accountOrder) {
		// TODO Auto-generated method stub
		log.debug("begin updateAccount.");
		// Long accountOrderPayId = null;
		// AccountOrder aoT = (AccountOrder)dao.getObject(AccountOrder.class,
		// accountOrder.getId());
		// aoT.setPayStatus(accountOrder.getPayStatus());
		// AccountOrder ao = (AccountOrder) dao.update(aoT);
		//
		// Object obj[] = new Object[]{accountOrder.getId()};
		// List<AccountOrderPay> accountOrderPayList =
		// (List<AccountOrderPay>)dao.find("from AccountOrderPay ap where
		// ap.accountOrder.id = ?", obj);
		// if(accountOrderPayList.size() > 0){
		// if(!"".equals(accountOrderPayList.get(0)) && null !=
		// accountOrderPayList)
		// accountOrderPayId = accountOrderPayList.get(0).getId();
		// }
		//
		// Object obj1[] = new Object[]{PayStatus.paid.toString(), amt,
		// accountOrderPayId, agentId};
		// dao.executeSql("INSERT INTO t_bss_agent_revenue(payStatus,
		// revenueAmt, accountOrderPay_id, salesAgent_id, agentRequestPay_id) "
		// + "VALUES(?, ?, ?, ?, NULL)", obj1);
		//
		// log.debug("end updateAccountOrder.Quotation : [ id =" + ao.getId() +
		// WebUtil.getLogBasicString() + "]");
		// if(null != ao && !"".equals(ao) )
		// return Boolean.TRUE;
		// else
		// return Boolean.FALSE;
		AgentRevenue revenue = (AgentRevenue) dao.getObject(AgentRevenue.class, accountOrder.getId());
		revenue.setPayStatus(PayStatus.paid);
		revenue.setRevenueAmt(amt);

		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AccountOrder getAccountOrderById(Long accountOrderId) {
		// TODO Auto-generated method stub
		AccountOrder ao = (AccountOrder) dao.getObject(AccountOrder.class, accountOrderId);
		return ao;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<AccountOrder> getAllAccountOrder() {
		// TODO Auto-generated method stub
		log.debug("begin getAllAccountOrder.");
		String ownerId = String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID));
		List<AccountOrder> list = dao
				.find("from AccountOrder where ownerId = " + ownerId + " order by lastUpdateDate desc");
		log.debug("end getAllAccountOrder:[ id =" + WebUtil.getLogBasicString() + "]");
		if (list != null && list.size() > 0) {
			return list;
		}
		return null;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AccountOrderVo> findAccountOrder(Long flag, BasePagerObject condition) {
		// TODO Auto-generated method stub
		// log.debug("begin findAccount.");
		// String conStr = HsqlUtil.getConditionHqlStr(condition, new
		// StringBuilder());
		//
		// String sql = "SELECT bo.id, bo.orderCreateDate, ba.id agentId,
		// ba.agentCode, ba.agentName, o.loginId, GROUP_CONCAT(ap.productName)
		// productName, ap.priceAmt "
		// + " FROM t_bss_order bo , t_bss_account_product ap, t_crm_owner o ,
		// t_bss_agent ba"
		// + " WHERE bo.id = ap.order_id AND bo.ownerId = o.id AND ba.agentCode
		// = o.agentCode AND bo.payStatus = 'notpaid' " + conStr + "GROUP BY
		// bo.id";
		// List list = dao.getLst4PagingWithSQL(sql,
		// new int[] { condition.getPagenum(), condition.getPagesize() });
		//
		// String countSql = "select count(DISTINCT(bo.id))"
		// + " FROM t_bss_order bo , t_bss_account_product ap, t_crm_owner o ,
		// t_bss_agent ba"
		// + " WHERE bo.id = ap.order_id AND bo.ownerId = o.id AND ba.agentCode
		// = o.agentCode AND bo.payStatus = 'notpaid' " + conStr;
		// Long count = dao.getCount4PagingWithSQL(countSql);
		//
		// List<AccountOrderVo> accountOrderVoList = new
		// ArrayList<AccountOrderVo>();
		// for (Object array : list) {
		// AccountOrderVo vo = null;
		// if(0 == flag)
		// vo = new AccountOrderVo((Object[]) array);
		// else
		// vo = new AccountOrderVo((Object[]) array, null);
		// accountOrderVoList.add(vo);
		// }
		String sqlr="";
		List<Condition> conList = condition.getCondition();
		for (Condition con : conList) {
			if (con.getKey().equals("ow.sales_id")) {
//					sqlr+="(SELECT re.* from t_bss_agent_revenue re LEFT JOIN t_bss_agent ag on ag.id=re.salesAgent_id LEFT JOIN t_crm_owner ow on ow.agentCode=ag.agentCode WHERE "+con.getKey()+"="+con.getValue()[0]+" GROUP BY re.id )";
					sqlr+="(select re.* from t_bss_agent_revenue re LEFT JOIN t_bss_agent ow on ow.id=re.salesAgent_id where "+con.getKey()+"="+con.getValue()[0]+")";
			}
		}
		if (sqlr.length()==0) {
			sqlr+="t_bss_agent_revenue";
		}
		
		String sql = "select r.payStatus,a.agentCode,a.agentName,o.loginId,p.lastUpdateDate,b.totalAmt,group_concat(tp.productName) AS productName,r.id,a.id as agentId,r.revenueAmt from "+sqlr+" r "
				+ "LEFT JOIN t_bss_agent a on r.salesAgent_id=a.id "
				+ "LEFT JOIN t_bss_order_pay p on r.accountOrderPay_id=p.id "
				+ "LEFT JOIN t_crm_owner o on p.ownerId=o.id " + "LEFT JOIN t_bss_order b on p.accountOrder_id=b.id "
				+ "LEFT JOIN t_bss_order_product_info bi on b.id=bi.order_id "
				+ "LEFT JOIN t_bss_account_product tp ON tp.id=bi.product_id where r.payStatus='apply'"
				+ "group by r.id";
		List list = dao.getLst4PagingWithSQL(sql, new int[] { condition.getPagenum(), condition.getPagesize() });
		Long count = dao
				.getCount4PagingWithSQL("select count(r.id) from "+sqlr+" r where r.payStatus='apply'");
		List<AccountOrderVo> accountOrderVoList = new ArrayList<>();
		for (Object object : list) {
			Object[] o = (Object[]) object;
//			AccountOrderVo vo = new AccountOrderVo();
//			vo.setFee(o[0].toString());
//			vo.setAgentCode(o[1].toString());
//			vo.setAgentName(o[2].toString());
//			vo.setName(o[3].toString());
//			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
//			try {
//				vo.setOrderCreateDate(sdf.parse(o[4].toString()));
//			} catch (ParseException e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			vo.setPriceAmt(new BigDecimal(o[5].toString()));
//			vo.setProductName(o[6].toString());
//			vo.setId(Long.valueOf(o[7].toString()));
//			vo.setAgentId(Long.valueOf(o[8].toString()));
//			vo.setRevenueAmt(new BigDecimal(o[9].toString()));
		
				accountOrderVoList.add(new AccountOrderVo(Long.valueOf(o[7].toString()), o[4].toString(), Long.valueOf(o[8].toString()), o[1].toString(), o[2].toString(), o[3].toString(), o[6].toString(), new BigDecimal(o[5].toString()), null, null, new BigDecimal(o[9].toString())));
		
		}

		BaseModelList<AccountOrderVo> lists = new BaseModelList<AccountOrderVo>(count,
				WebUtil.getEntryListFromProxyList(accountOrderVoList, dao));
		log.debug("end findAccount:[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AccountOrderHistoryVo> getAllAccountOrderByPage(BasePagerObject bso) {
		log.debug("begin getAllAccountOrderByPage. ");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql= "select ex.* from(select ord.id,ord.orderCode,o.loginId,cui.name,\n" +
				"group_concat(DISTINCT c.productName) AS productName,ord.totalAmt,ord.orderCreateDate,ord.orderEndDate,ord.payStatus\n" +
				" from t_bss_order ord \n" +
				"LEFT JOIN t_bss_order_pay op on ord.id=op.accountOrder_id\n" +
				"LEFT JOIN t_crm_owner o ON ord.ownerId=o.id\n" +
				"LEFT JOIN t_crm_user_info cui ON o.enterpriseInfo_id = cui.id\n" +
				"LEFT JOIN t_bss_order_product_info a ON ord.id = a.order_id\n" +
				"LEFT JOIN t_bss_account_product c ON c.id = a.product_id\n" +
				"where ord.payStatus<>'notpaid' GROUP BY ord.orderCode order by ord.orderCreateDate desc) ex WHERE 1=1 "+conStr;
		List list = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		List<AccountOrderHistoryVo> voList=new ArrayList<>();
		for (Object object : list) {
			Object[] o= (Object[])object;
			AccountOrderHistoryVo vo=new AccountOrderHistoryVo(o);
			voList.add(vo);
		}
		String sqls= "select count(ex.id) from(select ord.id,ord.orderCode,o.loginId,cui.name,\n" +
				"group_concat(DISTINCT c.productName) AS productName,ord.totalAmt,ord.orderCreateDate,ord.orderEndDate,ord.payStatus\n" +
				" from t_bss_order ord\n" +
				"LEFT JOIN t_bss_order_pay op on ord.id=op.accountOrder_id\n" +
				"LEFT JOIN t_crm_owner o ON ord.ownerId=o.id\n" +
				"LEFT JOIN t_crm_user_info cui ON o.enterpriseInfo_id = cui.id\n" +
				"LEFT JOIN t_bss_order_product_info a ON ord.id = a.order_id\n" +
				"LEFT JOIN t_bss_account_product c ON c.id = a.product_id\n" +
				"where ord.payStatus<>'notpaid' GROUP BY ord.orderCode) ex WHERE 1=1 "+conStr;
		Long count = dao.getCount4PagingWithSQL(sqls);
		log.debug("end  getAllAccountOrderByPage.");
		return new BaseModelList<AccountOrderHistoryVo>(count, WebUtil.getEntryListFromProxyList(voList, dao));
	}

}
