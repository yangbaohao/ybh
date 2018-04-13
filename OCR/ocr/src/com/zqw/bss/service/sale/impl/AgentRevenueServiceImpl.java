package com.zqw.bss.service.sale.impl;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

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
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.billing.AgentRequestPay;
import com.zqw.bss.model.billing.BillingRecord;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.sale.AgentRevenue;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.service.sale.AgentRevenueService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.PayStatus;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.billing.CommissionVO;
import com.zqw.bss.vo.sale.AgentRevenueDetailsVo;
import com.zqw.bss.vo.sys.SearchUserTaxVo;

@Service
@Qualifier("agentRevenueService")
public class AgentRevenueServiceImpl implements AgentRevenueService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveAgentRevenue(AgentRevenue agentRevenue) {
		logger.info("begin saveAgentRevenue.");
		dao.save(agentRevenue);
		logger.info("end saveAgentRevenue[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAgentRevenue(AgentRevenue agentRevenue) {
		logger.info("begin updateAgentRevenue.");
		Object[] param = new Object[4];
		param[0] = agentRevenue.getRevenueAmt();
		param[1] = agentRevenue.getPayStatus();
		param[2] = agentRevenue.getAccountOrderPay() != null ? agentRevenue.getAccountOrderPay().getId() : null;
		param[3] = agentRevenue.getId();
		dao.executeHql(
				"update AgentRevenue ar set ar.revenueAmt=? , ar.payStatus=? , ar.accountOrderPay.id=? where ar.id=?",
				param);
		logger.info("end updateAgentRevenue[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteAgentRevenue(Long id) {
		logger.info("begin deleteAgentRevenue.");
		Object[] param = new Object[1];
		param[0] = id;
		dao.executeHql("delete from AgentRevenue ar where ar.id=?", param);
		logger.info("end deleteAgentRevenue[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<CommissionVO> getPageAgentRevenue(BasePagerObject bso) {
		logger.info("begin getPageAgentRevenue.");
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		List<Condition> list = bso.getCondition();
		BaseModelList<CommissionVO> lists;
		if (roles.contains("Sys_Admin")) {
			Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
			List urls = dao.getLst4PagingWithSQL(
					"SELECT t.orderCreateDate,t.totalAmt from t_bss_order t LEFT JOIN t_crm_owner c on t.ownerId=c.id LEFT JOIN t_bss_agent a on a.agentCode=c.agentCode",
					new int[] { bso.getPagenum(), bso.getPagesize() });
			Long count = dao.getCount4PagingWithSQL(
					"SELECT count(t.orderCreateDate) from t_bss_order t LEFT JOIN t_crm_owner c on t.ownerId=c.id LEFT JOIN t_bss_agent a on a.agentCode=c.agentCode");
			List<CommissionVO> vos = new ArrayList<CommissionVO>();
			for (Object listvo : urls) {
				Object[] o = (Object[]) listvo;
				CommissionVO vo = new CommissionVO();
				DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
				try {
					vo.setOrderCreateDate(df.parse(o[0].toString()));
				} catch (ParseException e) {
				}
				vo.setTotalAmt(new BigDecimal(o[1].toString()));
				vos.add(vo);
			}
			lists = new BaseModelList<CommissionVO>(count, WebUtil.getEntryListFromProxyList(vos, dao));
		} else {
			Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);

			List urls = dao.getLst4PagingWithSQL(
					"SELECT p.createDate,p.totalAmt,t.revenueAmt,t.payStatus,t.id FROM t_bss_agent_revenue t LEFT JOIN t_bss_order_pay p ON t.accountOrderPay_id = p.id WHERE t.salesAgent_id = (SELECT e.id FROM t_bss_agent e WHERE e.userInfo_id = "
							+ id + ")",
					new int[] { bso.getPagenum(), bso.getPagesize() });
			Long count = dao.getCount4PagingWithSQL(
					"SELECT COUNT(t.id) FROM t_bss_agent_revenue t WHERE t.salesAgent_id = (SELECT e.id FROM t_bss_agent e 	WHERE e.userInfo_id = "
							+ id + ")");
			List<CommissionVO> vos = new ArrayList<CommissionVO>();
			for (Object listvo : urls) {
				Object[] o = (Object[]) listvo;
				CommissionVO vo = new CommissionVO();
				DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				try {
					vo.setOrderCreateDate(df.parse(o[0].toString()));
				} catch (ParseException e) {
				}
				vo.setTotalAmt(new BigDecimal(o[1].toString()));
				vo.setFee(new BigDecimal(o[2].toString()));
				if (o[3].equals("paid")) {
					vo.setIsFee(vo.getFee());
				} else {
					vo.setIsFee(new BigDecimal(0));
				}
				vo.setPayStatus(o[3].toString());
				//查看审批结果
				List sql = dao.executeQuerySql("select p.* from t_bss_agent_request_pay p where p.agentRevenue_id=" +o[4], null);
				List<AccountOrderPay>AccountOrderPayList=new ArrayList<AccountOrderPay>();
				for (Object object : sql) {
					Object[] o2 = (Object[]) object;
					AccountOrderPay accountOrderPay = new AccountOrderPay();
					accountOrderPay.setCreateBy(o2[1].toString());
					try {
						accountOrderPay.setCreateDate(df.parse(o2[2].toString()));
					} catch (ParseException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					if (o2[5].equals("notpaid")) {
						accountOrderPay.setPayStatus(PayStatus.notpaid);
					}
					if (o2[5].equals("paid")) {
						accountOrderPay.setPayStatus(PayStatus.paid);
					}
					accountOrderPay.setRemark(o2[6].toString());
					AccountOrderPayList.add(accountOrderPay);
				}
				vo.setList(AccountOrderPayList);
				vos.add(vo);
			}
			lists = new BaseModelList<CommissionVO>(count, WebUtil.getEntryListFromProxyList(vos, dao));
		}

		logger.info("end getPageAgentRevenue[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AgentRevenue getAgentRevenueById(Long id) {
		logger.info("begin getAgentRevenueById. id = [" + id + "]");
		AgentRevenue pro = (AgentRevenue) dao.getObject(AgentRevenue.class, id);
		logger.info("end getAgentRevenueById:[ id =" + WebUtil.getLogBasicString() + "]");
		return pro;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public CommissionVO getAgentRevenueTotal(Long id) {
		//Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		// 获得属于这个代理商的
		List sql = dao.executeQuerySql(
				"SELECT t.revenueAmt,t.payStatus FROM t_bss_agent_revenue t WHERE t.salesAgent_id = (SELECT e.id FROM t_bss_agent e WHERE e.userInfo_id = "
						+ id + ")",
				null);
	//	CommissionVO vo = new CommissionVO();
		BigDecimal fee = new BigDecimal(0);
		BigDecimal isFee = new BigDecimal(0);
		BigDecimal unFee = new BigDecimal(0);
		for (Object object : sql) {
			Object[] o = (Object[]) object;
			fee = fee.add(new BigDecimal(o[0].toString()));
			if (o[1].equals("paid")) {
				isFee = isFee.add(new BigDecimal(o[0].toString()));
			} else {
				unFee = unFee.add(new BigDecimal(o[0].toString()));
			}
		}
//		vo.setFee(fee);
//		vo.setIsFee(isfee);
//		vo.setUnFee(unfee);
		
		return new CommissionVO(fee, isFee, unFee);
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<CommissionVO> getAgentRevenueAll(Long id) {
		//Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		List sql = dao.executeQuerySql(
				"SELECT p.totalAmt,t.revenueAmt,t.payStatus,t.id FROM t_bss_agent_revenue t LEFT JOIN t_bss_order_pay p ON t.accountOrderPay_id = p.id WHERE t.payStatus='notpaid' AND t.salesAgent_id = (SELECT e.id FROM t_bss_agent e WHERE e.userInfo_id = "
						+ id + ")",
				null);
		List<CommissionVO> vos = new ArrayList<CommissionVO>();
		for (Object listvo : sql) {
			Object[] o = (Object[]) listvo;
//			CommissionVO vo = new CommissionVO();
//			vo.setTotalAmt(new BigDecimal(o[0].toString()));
//			vo.setFee(new BigDecimal(o[1].toString()));
//			vo.setId(Long.valueOf(o[3].toString()));
			CommissionVO vo = new CommissionVO(new BigDecimal(o[0].toString()), new BigDecimal(o[1].toString()), Long.valueOf(o[3].toString()));
			vos.add(vo);
		}
		return vos;

	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAgentRevenueApply(List<AgentRevenue> agentRevenue) {
		for (AgentRevenue revenue : agentRevenue) {
			AgentRevenue revenueTemp = (AgentRevenue) dao.getObject(AgentRevenue.class, revenue.getId());
			// 提交申请
			revenueTemp.setPayStatus(PayStatus.apply);
			// 修改日期
			revenueTemp.getAccountOrderPay().setLastUpdateDate(new Date());
			dao.save(revenueTemp);
		}
		return true;
	}

	// @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	// public Boolean examinePaid(AgentRevenue agentRevenue){
	// AgentRevenue revenue= (AgentRevenue)dao.getObject(AgentRevenue.class,
	// agentRevenue.getId());
	// revenue.getAccountOrderPay().setLastUpdateDate(new Date());
	// revenue.setPayStatus(PayStatus.paid);
	// AgentRequestPay agent=new AgentRequestPay();
	// String name=
	// (String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
	// agent.setCreateDate(new Date());
	// agent.setLastUpdateDate(new Date());
	// agent.setCreateBy(name);
	// agent.setLastUpdateBy(name);
	// agent.setRemark(agentRevenue.getRemark());
	// agent.setPayStatus(PayStatus.paid);
	// dao.save(agent);
	// dao.save(revenue);
	// dao.executeSql("UPDATE t_bss_agent_revenue t SET
	// t.agentRequestPay_id="+agent.getId()+" WHERE t.id="+agentRevenue.getId(),
	// null);
	// return true;
	// }
	//
	// @Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	// public Boolean examineNotpaid(AgentRevenue agentRevenue){
	// AgentRevenue revenue= (AgentRevenue)dao.getObject(AgentRevenue.class,
	// agentRevenue.getId());
	// revenue.getAccountOrderPay().setLastUpdateDate(new Date());
	// revenue.setPayStatus(PayStatus.notpaid);
	// AgentRequestPay agent=new AgentRequestPay();
	// String name=
	// (String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
	// agent.setCreateDate(new Date());
	// agent.setLastUpdateDate(new Date());
	// agent.setCreateBy(name);
	// agent.setLastUpdateBy(name);
	// agent.setRemark(agentRevenue.getRemark());
	// agent.setPayStatus(PayStatus.notpaid);
	// dao.save(agent);
	// dao.save(revenue);
	// dao.executeSql("UPDATE t_bss_agent_revenue t SET
	// t.agentRequestPay_id="+agent.getId()+" WHERE t.id="+agentRevenue.getId(),
	// null);
	// return true;
	// }
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean examine(AgentRevenue agentRevenue,String name) {
		AgentRevenue revenue = (AgentRevenue) dao.getObject(AgentRevenue.class, agentRevenue.getId());
		revenue.getAccountOrderPay().setLastUpdateDate(new Date());
		revenue.setPayStatus(agentRevenue.getPayStatus());
		AgentRequestPay agent = new AgentRequestPay();
//		String name = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
//		agent.setCreateDate(new Date());
//		agent.setLastUpdateDate(new Date());
//		agent.setCreateBy(name);
//		agent.setLastUpdateBy(name);
//		agent.setRemark(agentRevenue.getRemark());
//		agent.setPayStatus(agentRevenue.getPayStatus());
//		agent.setAgentRevenue(revenue);
		agent=new AgentRequestPay(agent.getId(), agentRevenue, agentRevenue.getPayStatus(), agentRevenue.getRemark(), new Date(), name, new Date(), name);
		dao.save(agent);
		dao.save(revenue);
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public void computeAgentRevenue(Owner owner, BigDecimal billingRecord, AccountOrderPay accountOrderPay) {
		//自动结算佣金，先查出该用户的代理商，然后新增代理商收益记录
				if(owner.getAgentCode()!=null&&owner.getAgentCode()!=""){
					//获取代理商佣金比例，没有填写就取默认比率20%
					Object[] parm=new Object[1];
					parm[0]=owner.getAgentCode();
					List listUn=dao.executeQuerySql("SELECT rate from t_bss_agent WHERE agentCode=?",parm);
					double te=0.2;
					if(listUn.size()>0){
						if(listUn.get(0)!=null){
							te=(double) listUn.get(0);
							if(te==0){
								te=0.2;
							}
						}
					}
					List<Long> listagentid=(List<Long>)dao.executeQuerySql("SELECT t_bss_agent.id from t_bss_agent WHERE t_bss_agent.agentCode="+owner.getAgentCode(),null);
					if(listagentid.size()>0){
						Object[] par=new Object[4];
						par[0]="notpaid";
						par[1]=billingRecord.multiply(new BigDecimal(te)).setScale(2, BigDecimal.ROUND_HALF_UP);
						par[2]=accountOrderPay.getId();
						par[3]=listagentid.get(0);
						dao.executeSql("INSERT INTO t_bss_agent_revenue(payStatus,revenueAmt,accountOrderPay_id,salesAgent_id) VALUES(?,?,?,?)", par);
						//判断有没有上级代理，如果有，上级代理按照父代理收益率获得佣金
						List listco=dao.executeQuerySql("SELECT b.parentRate from t_bss_agent t LEFT JOIN t_bss_agent b on b.agentCode=t.parentAgentCode WHERE t.agentCode=?",parm);
						List<Long> listid=(List<Long>)dao.executeQuerySql("SELECT b.id from t_bss_agent t LEFT JOIN t_bss_agent b on b.agentCode=t.parentAgentCode WHERE t.agentCode=?",parm);
						double ti=0.1;
						if(listco.size()>0&&listid.size()>0){
							if(listid.get(0)!=null){
								if(listco.get(0)!=null){
									ti=(double) listco.get(0);
									if(ti==0){
										ti=0.1;
									}
								}
								Object[] pare=new Object[4];
								pare[0]="notpaid";
								pare[1]=billingRecord.multiply(new BigDecimal(ti)).setScale(2, BigDecimal.ROUND_HALF_UP);
								pare[2]=accountOrderPay.getId();
								pare[3]=listid.get(0);
								dao.executeSql("INSERT INTO t_bss_agent_revenue(payStatus,revenueAmt,accountOrderPay_id,salesAgent_id) VALUES(?,?,?,?)", pare);
							}
						}
					}
					
					
				}
		
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AgentRevenueDetailsVo> getAgentRevenueDetails(String code,BasePagerObject bso) {
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
//		String selectSql="SELECT  t.id,w.loginId,w.regTelephone,b.amount,b.createDate,group_concat(DISTINCT s.productName) as productName,f.name," +
//				"CASE  WHEN STRCMP(t.payStatus, 'notpaid')=0 THEN t.revenueAmt ELSE 0 END as  unFee,t.revenueAmt as neFee,CASE  WHEN STRCMP(t.payStatus, 'notpaid')=0 THEN 0 ELSE t.revenueAmt END  as   edFee  from  t_bss_agent_revenue t" +		
//		        " LEFT JOIN t_bss_order_pay p on p.id=t.accountOrderPay_id" +
//				" LEFT JOIN t_biz_billingrecord b on b.accountOrderPay_id=p.id" +
//				" LEFT JOIN t_bss_order o on o.id=p.accountOrder_id " +
//				" LEFT JOIN t_bss_order_product_info i on i.order_id=o.id" +
//				" LEFT JOIN t_bss_account_product s on s.id=i.product_id " +
//				" LEFT JOIN t_crm_owner w on w.id=b.ownerId" +
//				" LEFT JOIN t_crm_user_info f on w.enterpriseInfo_id=f.id " +
//				" WHERE 1=1 " +conStr+
//				" GROUP BY t.id ORDER BY b.createDate DESC ";
		String selectSql="SELECT\n" +
				"	t.id,\n" +
				"	o.loginId,\n" +
				"	o.regTelephone,\n" +
				"	biz.amount,\n" +
				"	biz.createDate,\n" +
				"	group_concat(DISTINCT s.productName) AS productName,\n" +
				"	f.name,\n" +
				"	CASE\n" +
				"WHEN STRCMP(t.payStatus, 'notpaid') = 0 THEN\n" +
				"	t.revenueAmt\n" +
				"ELSE\n" +
				"	0\n" +
				"END AS unFee,\n" +
				" t.revenueAmt AS neFee,\n" +
				" CASE\n" +
				"WHEN STRCMP(t.payStatus, 'notpaid') = 0 THEN\n" +
				"	0\n" +
				"ELSE\n" +
				"	t.revenueAmt\n" +
				"END AS edFee\n" +
				"FROM\n" +
				"	t_biz_billingrecord biz\n" +
				"LEFT JOIN t_bss_order_pay op ON biz.accountOrderPay_id = op.id\n" +
				"LEFT JOIN t_bss_order ord ON ord.id = op.accountOrder_id\n" +
				"LEFT JOIN t_crm_owner o ON ord.ownerId = o.id\n" +
				"LEFT JOIN t_bss_agent_revenue t ON op.id = t.accountOrderPay_id\n" +
				"LEFT JOIN t_bss_order_product_info i ON i.order_id = ord.id\n" +
				"LEFT JOIN t_bss_account_product s ON s.id = i.product_id\n" +
				"LEFT JOIN t_crm_user_info f ON o.enterpriseInfo_id = f.id\n" +
				"WHERE\n" +
				"  o.agentCode='"+code+"' " +conStr+
				" AND (\n" +
				"	biz. STATUS = 'paid'\n" +
				"	OR biz. STATUS = 'offline'\n" +
				")\n" +
				"GROUP BY\n" +
				"	biz.id\n" +
				"ORDER BY\n" +
				"	biz.createDate DESC";
		List listVo = dao.getLst4PagingWithSQL(selectSql, new int[] {
				bso.getPagenum(),
				bso.getPagesize() });
//		String countSql="SELECT  count(DISTINCT t.id)  from  t_bss_agent_revenue t" +		
//		        " LEFT JOIN t_bss_order_pay p on p.id=t.accountOrderPay_id" +
//				" LEFT JOIN t_biz_billingrecord b on b.accountOrderPay_id=p.id" +
//				" LEFT JOIN t_bss_order o on o.id=p.accountOrder_id " +
//				" LEFT JOIN t_bss_order_product_info i on i.order_id=o.id" +
//				" LEFT JOIN t_bss_account_product s on s.id=i.product_id " +
//				" LEFT JOIN t_crm_owner w on w.id=b.ownerId" +
//				" LEFT JOIN t_crm_user_info f on w.enterpriseInfo_id=f.id " +
//				" WHERE 1=1 " +conStr;
		String countSql="SELECT\n" +
		"	COUNT(DISTINCT biz.id)\n" +
		"FROM\n" +
		"	t_biz_billingrecord biz\n" +
		"LEFT JOIN t_bss_order_pay op ON biz.accountOrderPay_id = op.id\n" +
		"LEFT JOIN t_bss_order ord ON ord.id = op.accountOrder_id\n" +
		"LEFT JOIN t_crm_owner o ON ord.ownerId = o.id\n" +
		"LEFT JOIN t_bss_agent_revenue t ON op.id = t.accountOrderPay_id\n" +
		"LEFT JOIN t_bss_order_product_info i ON i.order_id = ord.id\n" +
		"LEFT JOIN t_bss_account_product s ON s.id = i.product_id\n" +
		"LEFT JOIN t_crm_user_info f ON o.enterpriseInfo_id = f.id\n" +
		"WHERE\n" +
		"  o.agentCode='"+code+"' " +conStr+
		" AND (\n" +
		"	biz. STATUS = 'paid'\n" +
		"	OR biz. STATUS = 'offline'\n" +
		")";
		Long count = dao.getCount4PagingWithSQL(countSql);
		List<AgentRevenueDetailsVo> searchUserList = new ArrayList<AgentRevenueDetailsVo>();
		for (Object object : listVo) {
			Object[] o = (Object[]) object;
			AgentRevenueDetailsVo searchUser=new AgentRevenueDetailsVo(o);
			searchUserList.add(searchUser);
		}
		BaseModelList<AgentRevenueDetailsVo> lists = new BaseModelList<AgentRevenueDetailsVo>(count,
				WebUtil.getEntryListFromProxyList(searchUserList, dao));
		return lists;
	}
	
	
	
}
