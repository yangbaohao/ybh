package com.zqw.bss.service.sale.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.criteria.CriteriaBuilder.In;

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
import com.zqw.bss.model.crm.Address;
import com.zqw.bss.model.crm.EnterpriseInfo;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PersonInfo;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.sale.SalesAgentService;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.SystemConfig;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.PasswordHelper;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.billing.SalesAgentVo;
import com.zqw.bss.vo.sale.SalesAgentFollowVo;
import com.zqw.bss.vo.sys.OwnerDetailsVo;

@Service
@Qualifier("salesAgentService")
@SuppressWarnings({ "rawtypes", "unchecked" })
public class SalesAgentServiceImpl implements SalesAgentService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Autowired
	private UserService userService;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public SalesAgent saveSalesAgent(SalesAgent salesAgent) {
		logger.info("begin saveSalesAgent.");
		List<Address> address = new ArrayList<Address>();
		if (salesAgent.getUserInfo().getAddress().size() > 0) {
			for (Address add : salesAgent.getUserInfo().getAddress()) {
				address.add((Address) dao.save(add));
			}
		}
		if(salesAgent.getRate()==0){
			salesAgent.setRate(0.2);
		}
		if(salesAgent.getParentRate()==0){
			salesAgent.setParentRate(0.1);
		}
		// 如果有父代理，销售负责人和父级代理一样
		Long salesId = null;
		Long customerId = null;
		if (salesAgent.getParentAgentCode() != null && salesAgent.getParentAgentCode() != "") {
			Object[] param = new Object[1];
			param[0] = salesAgent.getParentAgentCode();
			List<SalesAgent> list = (List<SalesAgent>) dao.find("from SalesAgent where agentCode=?", param);
			if (list.size() != 0) {
				if (!list.get(0).getSenior()) {
					salesAgent.setParentAgentCode(null);
				}else{
					if(list.get(0).getSales()!=null){
						salesId=list.get(0).getSales().getId();
					}
				}
			} else {
				salesAgent.setParentAgentCode(null);
			}
		}
		salesAgent.getUserInfo().setAddress(address);
		// 区分代理商类型，个人与企业用户
		if ("enterprise".equals(salesAgent.getType())) {
			salesAgent.getUserInfo().setName(" ");
			EnterpriseInfo userInfo = (EnterpriseInfo) dao.save(salesAgent.getUserInfo());
			salesAgent.setUserInfo(userInfo);
			salesAgent.getUser().setUserInfo(userInfo);
		} else if ("person".equals(salesAgent.getType())) {
			PersonInfo userInfo = (PersonInfo) dao.save(salesAgent.getUserInfo());
			salesAgent.setUserInfo(userInfo);
			salesAgent.getUser().setUserInfo(userInfo);
		}
		// 获取销售代理id
		if (salesAgent.getSales() == null || salesAgent.getSales().getId() == null) {
			salesAgent.setSales(null);
		} else {
			salesId = salesAgent.getSales().getId();
			salesAgent.setSales(null);
		}
		// 获取客服id
		if (salesAgent.getCustomer() == null || salesAgent.getCustomer().getId() == null) {
			salesAgent.setCustomer(null);
		} else {
			customerId = salesAgent.getCustomer().getId();
			salesAgent.setCustomer(null);
		}
		userService.saveUser(salesAgent.getUser());
		SalesAgent SalAgent = (SalesAgent) dao.save(salesAgent);
		if (salesId != null) {
			Object[] par = new Object[2];
			par[0] = salesId;
			par[1] = SalAgent.getId();
			dao.executeHql("update SalesAgent a SET a.sales.id=? where a.id=?", par);
		}else{
			String[] usersaler = SystemConfig.getCoaProperty("user.saler.distribution").split(",");
			int random = (int) ( Math.random () * usersaler.length );
			List listsalerid=dao.executeQuerySql("SELECT id from t_bss_sys_user WHERE username='"+usersaler[random]+"'",null);
			if(listsalerid.size()>0){
				dao.executeHql("update SalesAgent a SET a.sales.id="+listsalerid.get(0).toString()+" where a.id="+ SalAgent.getId(),null);
			}
		}
		if (customerId != null) {
			Object[] pars = new Object[2];
			pars[0] = customerId;
			pars[1] = SalAgent.getId();
			dao.executeHql("update SalesAgent a SET a.customer.id=? where a.id=?", pars);
		}
		logger.info("end saveSalesAgent[ id =" + WebUtil.getLogBasicString() + "]");
		return SalAgent;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateSalesAgent(String state,SalesAgent salesAgent) {
		logger.info("begin updateSalesAgent.");
		if (salesAgent.getSales() == null || salesAgent.getSales().getId() == null) {
			salesAgent.setSales(null);
		}
		if (salesAgent.getCustomer() == null || salesAgent.getCustomer().getId() == null) {
			salesAgent.setCustomer(null);
		}
		User user= (User) dao.find("FROM User u where u.id='"+salesAgent.getUser().getId()+"'").get(0);
		user.setPassword(salesAgent.getUser().getPassword());
		if (state.equals("1")) {
			PasswordHelper.encryptPassword(user);
		}
		salesAgent.setUser(user);
		dao.update(salesAgent);
		/*
		 * Object[] param=new Object[7]; param[0]=salesAgent.getAgentCode();
		 * param[1]=salesAgent.getSales().getId();
		 * param[2]=salesAgent.getUserInfo().getId();
		 * param[3]=salesAgent.getAgentName();
		 * param[4]=salesAgent.getBankAccount();
		 * param[5]=salesAgent.getOpenBank(); param[6]=salesAgent.getId();
		 * dao.executeHql(
		 * "update SalesAgent sa set sa.agentCode=? , sa.sales.id=?, sa.userInfo.id=?,sa.agentName=?,sa.bankAccount=?,sa.openBank=? where sa.id=?"
		 * , param);
		 */ logger.info("end updateSalesAgent[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteSalesAgent(Long id) {
		logger.info("begin deleteSalesAgent.");
		Object[] param = new Object[1];
		param[0] = id;
		dao.executeHql("delete from SalesAgent ar where ar.id=?", param);
		logger.info("end deleteSalesAgent[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SalesAgent> getPageSalesAgent(BasePagerObject bso) {
		/*
		 * String bosStr=HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		 * String hql=
		 * "SELECT a.id,a.agentCode,a.agentName,a.userInfo,a.personInfo,count(a.userInfo) as client,sum(ar.revenueAmt) as fee ,"
		 * +
		 * " sum(case when ar.payStatus='notpaid' then ar.revenueAmt else 0 end ) as unFee ,count(DISTINCT case when o.payStatus='paid' then o.id else null end ) "
		 * +
		 * " from SalesAgent a left join  AgentRevenue ar with a.id = ar.salesAgent.id left join AccountOrder o with a.userInfo.ownerId=o.ownerId where 1=1 "
		 * + bosStr +" group by a.id";
		 * 
		 * List<SalesAgent> ur =dao.getLst4Paging(hql, new
		 * int[]{bso.getPagenum(),bso.getPagesize()}); String hqlCount=
		 * "SELECT count(a.id)" +
		 * " from SalesAgent a left join  AgentRevenue ar with a.id = ar.salesAgent.id left join AccountOrder o with a.userInfo.ownerId=o.ownerId where 1=1 "
		 * + bosStr +" group by a.id"; Long count =
		 * dao.getCount4Paging(hqlCount);
		 */

		// String bosStr=HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		/*
		 * String hql=
		 * "SELECT a.id,a.agentCode,a.agentName,a.userInfo,a.personInfo,count(a.userInfo) as client,sum(ar.revenueAmt) as fee ,"
		 * +
		 * " sum(case when ar.payStatus='notpaid' then ar.revenueAmt else 0 end ) as unFee ,count(DISTINCT case when o.payStatus='paid' then o.id else null end ) "
		 * +
		 * " from SalesAgent a ,AgentRevenue ar, AccountOrder o,Owner w where w.agentCode=a.agentCode and a.id = ar.salesAgent.id and o.ownerId=w.id "
		 * + bosStr +" group by a.id";
		 */
		/*
		 * String hql=
		 * "SELECT a.id,a.agentCode,a.agentName,a.userInfo,a.personInfo" +
		 * " from SalesAgent a   where 1=1 " + bosStr +" group by a.id";
		 * List<SalesAgent> ur =dao.getLst4Paging(hql, new
		 * int[]{bso.getPagenum(),bso.getPagesize()});
		 * 
		 * 
		 * String hqlCount="SELECT count(a.id)" +
		 * " from SalesAgent a   where 1=1 " + bosStr +" group by a.id"; Long
		 * count = dao.getCount4Paging(hqlCount);
		 */
		List<Condition> ct=bso.getCondition();
		Condition cc=null;
		Condition cf=null;
		Condition fc=null;
		Condition sr=null;
		List<Condition> c1=new ArrayList<Condition>();
		for(int n=0;n<ct.size();n++){
			
			if(ct.get(n).getKey().equals("o.client")){
				cc=ct.get(n);
				continue;
			}
			if(ct.get(n).getKey().equals("r.fee")){
				cf=ct.get(n);
				continue;
			}
			if(ct.get(n).getKey().equals("feeClient")){
				fc=ct.get(n);
				continue;
			}
			if(ct.get(n).getKey().equals("senior")){
				sr=ct.get(n);
				continue;
			}
			
			c1.add(ct.get(n));
		}
		
		bso.setCondition(c1);
		/*List<SalesAgent> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, SalesAgent.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });*/
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String username=(String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		String str="";
		if (roles.contains("Sys_Admin")) {
			
		}else if(roles.contains("salesManage")){
			//销售主管编码
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			//获取二级销售主管的编号
			List<String> secondLevelEmployeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode ='"+employeeCode.get(0)+"'", null);
			if(secondLevelEmployeeCode.size()>0){
				String[] arr = (String[])secondLevelEmployeeCode.toArray(new String[secondLevelEmployeeCode.size()]);
				for(int i=0;i<arr.length;i++){
					String temp=arr[i];
					arr[i]="'"+temp+"'";
				}
				String se=Arrays.toString(arr);
				String newStr = se.replaceAll("\\[","(");
				String newStr2 = newStr.replaceAll("]",")");
				//获取二级销售主管下，销售的编号
				List empCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode in "+newStr2+"", null);
				if(empCode.size()>0){
					String[] ar = (String[])empCode.toArray(new String[empCode.size()]);
					for(int i=0;i<ar.length;i++){
						String temp=ar[i];
						ar[i]="'"+temp+"'";
					}
					String see=Arrays.toString(ar);
					String newSt = see.replaceAll("\\[","(");
					String newSt2 = newSt.replaceAll("]",")");
					str+="AND (s.sales.username ='"+username+"' OR s.sales.parentEmployeeCode='"+employeeCode.get(0)+"' OR s.sales.employeeCode in "+newSt2+") ";
				}else{
					str+="AND (s.sales.username ='"+username+"' OR s.sales.parentEmployeeCode='"+employeeCode.get(0)+"')";	
				}
			}else{
				str+="AND (s.sales.username ='"+username+"') ";
			}	
		}else if(roles.contains("secondLevelSalesManage")){
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			str+="AND (s.sales.username ='"+username+"' OR s.sales.parentEmployeeCode='"+employeeCode.get(0)+"') ";
		}else if(roles.contains("salesStaff")){
			str+="AND s.sales.username ='"+username+"' ";
		}else if(roles.contains("customerManage")){
			//客服主管编码
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			//获取二级客服主管的编号
			List<String> secondLevelEmployeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode ='"+employeeCode.get(0)+"'", null);
			if(secondLevelEmployeeCode.size()>0){
				String[] arr = (String[])secondLevelEmployeeCode.toArray(new String[secondLevelEmployeeCode.size()]);
				for(int i=0;i<arr.length;i++){
					String temp=arr[i];
					arr[i]="'"+temp+"'";
				}
				String se=Arrays.toString(arr);
				String newStr = se.replaceAll("\\[","(");
				String newStr2 = newStr.replaceAll("]",")");
				//获取二级客服主管下，客服的编号
				List empCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode in "+newStr2, null);
				if(empCode.size()>0){
					String[] ar = (String[])empCode.toArray(new String[empCode.size()]);
					for(int i=0;i<ar.length;i++){
						String temp=ar[i];
						ar[i]="'"+temp+"'";
					}
					String see=Arrays.toString(ar);
					String newSt = see.replaceAll("\\[","(");
					String newSt2 = newSt.replaceAll("]",")");
					str+="AND (s.customer.username ='"+username+"' OR s.customer.parentEmployeeCode='"+employeeCode.get(0)+"' OR s.customer.employeeCode in "+newSt2+") ";
				}else{
					str+="AND (s.customer.username ='"+username+"' OR s.customer.parentEmployeeCode='"+employeeCode.get(0)+"' )";	
				}
			}else{
				str+="AND (s.customer.username ='"+username+"') ";
			}	
		}else if(roles.contains("secondLevelCustomerManage")){
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			str+="AND (s.customer.username ='"+username+"' OR s.customer.parentEmployeeCode='"+employeeCode.get(0)+"') ";
		}else if(roles.contains("customerService")){
			str+="AND s.customer.username ='"+username+"' ";
		}
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		List owner = dao.executeQuerySql("select agentCode from t_crm_owner",null);
		List codesf = dao.executeQuerySql("select agentCode from  t_bss_agent where agentName='"+username+"'",null);
		String codeStr="";
		String cdStr="";
		if(codesf.size()>0){
			List code = dao.executeQuerySql("select agentCode from  t_bss_agent where senior = 'Y' and parentAgentCode = '"+codesf.get(0).toString()+"'",null);
			codeStr = " and parentAgentCode in ('"+codesf.get(0).toString()+"',";
			cdStr = " and s.agentCode in (";
			for(int i = 0 ; i < code.size() ; i++){
				codeStr=codeStr+"'"+code.get(i).toString()+"',";
				cdStr=cdStr+"'"+code.get(i).toString()+"',";
			}
			codeStr = codeStr.substring(0,codeStr.length()-1)+")";
			List codes= dao.executeQuerySql("select agentCode from  t_bss_agent where 1 = 1 "+codeStr,null);
			for(int i = 0 ; i < codes.size() ; i++){
				cdStr=cdStr+"'"+codes.get(i).toString()+"',";
			}
			cdStr = cdStr.substring(0,cdStr.length()-1)+")";
			if(code.size()==0&&codes.size()==0){
				cdStr="  and s.agentCode in ('"+codesf.get(0).toString()+"')";
			}
		}
		
		List<SalesAgent> urls=dao.find("from SalesAgent s where 1=1 "+str+conStr+cdStr+"  ORDER BY userInfo.lastUpdateDate  DESC");
		if(urls.size()>0){
			List<User>  user = dao.find("from com.zqw.bss.model.sys.User");
			List   payUser = dao.executeQuerySql("SELECT DISTINCT c.id,c.agentCode FROM t_bss_order o LEFT JOIN t_crm_owner c ON c.id=o.ownerId WHERE o.payStatus='paid' ", null);
			List listn = dao.executeQuerySql("select agentCode,agentName from t_bss_agent", null);
			List listVo = dao.executeQuerySql("SELECT r.salesAgent_id,r.revenueAmt,r.payStatus  from t_bss_agent_revenue r ", null);
			for (int n=0;n<urls.size();n++){
//				Object[] param = new Object[1];
//				param[0] = urls.get(n).getAgentCode();
//				List list = dao.executeQuerySql("select distinct w.id from t_crm_owner w where w.agentCode=?", param);
//				Object[] para = new Object[1];
//				para[0] = urls.get(n).getUserInfo().getId();
//				List<User> lis = (List<User>) dao.find("from com.zqw.bss.model.sys.User u where u.userInfo.id=?", para);
				int sizes = 0;
				for(int i = 0;i<owner.size();i++){
					if(owner.get(i)!=null&&urls.get(n).getAgentCode().equals(owner.get(i).toString())){
						sizes++;
					}
				}
				User us = null;
				for(User u:user){
					if(urls.get(n).getUserInfo().getId().equals(u.getUserInfo().getId())){
						us=u;
					}
				}
				urls.get(n).setUser(us);
				urls.get(n).setClient(sizes);
				// 获取付费用户数量
//				Long count = dao.getCount4PagingWithSQL(
//						"SELECT count(DISTINCT o.ownerId) as client from t_bss_order o LEFT JOIN t_crm_owner c on c.id=o.ownerId WHERE o.payStatus='paid' and c.agentCode="
//								+ urls.get(n).getAgentCode() + "");
				int count = 0;
				for(int i = 0;i<payUser.size();i++){
					Object[] obj = (Object[]) payUser.get(i);
					if(obj[1]!=null&&urls.get(n).getAgentCode().equals(obj[1].toString())){
						count++;
					}
				}
				urls.get(n).setFeeClient(count);
				
//				Object[] pam = new Object[1];
//				pam[0] = urls.get(n).getId();
				// 获取佣金累计
//				List listVo = dao.executeQuerySql(
//						"SELECT SUM(r.revenueAmt) as fee from t_bss_agent_revenue r where r.salesAgent_id=? ", pam);
				// BigDecimal pt=(BigDecimal)
				// (list.size()>0?listVo.get(0):BigDecimal.ZERO);
				BigDecimal pt= BigDecimal.ZERO;
				BigDecimal p= BigDecimal.ZERO;
				for(int i=0;i<listVo.size();i++){
					Object[] obj = (Object[]) listVo.get(i);
					if(urls.get(n).getId().equals(Long.valueOf(obj[0].toString()))){
						pt=pt.add(new BigDecimal(obj[1].toString()));
					}
					if(urls.get(n).getId().equals(Long.valueOf(obj[0].toString()))&&obj[2].toString().equals("notpaid")){
						p=p.add(new BigDecimal(obj[1].toString()));
					}
				}
//				BigDecimal pt = (BigDecimal) (listVo.get(0) != null ? listVo.get(0) : BigDecimal.ZERO);
				urls.get(n).setFee(pt);
				
				// 获取未提佣金
//				List listUn = dao.executeQuerySql(
//						"SELECT SUM(r.revenueAmt) from t_bss_agent_revenue r where r.payStatus='notpaid' and r.salesAgent_id=?",
//						pam);
				// BigDecimal p=(BigDecimal)
				// (listUn.size()>0?listUn.get(0):BigDecimal.ZERO);
//				BigDecimal p = (BigDecimal) (listUn.get(0) != null ? listUn.get(0) : BigDecimal.ZERO);
				urls.get(n).setUnFee(p);
				// 设置父代理名
				if (urls.get(n).getParentAgentCode() != null && urls.get(n).getParentAgentCode() != "") {
//					Object[] par = new Object[1];
//					par[0] = urls.get(n).getParentAgentCode();
//					List<SalesAgent> listn = (List<SalesAgent>) dao.find("from SalesAgent where agentCode=?", par);
					String name = null;
					for(int i=0;i<listn.size();i++){
						Object[] objs  = (Object[]) listn.get(i);
						if(urls.get(n).getParentAgentCode().equals(objs[0].toString())){
							name=objs[1].toString();
						}
					}
					if (us != null) {
						urls.get(n).setParentAgentName(name);
					}
				}

			}
		
				//排除在筛选客户数量范围外的
				if(cc!=null){
					List<SalesAgent> u1=new ArrayList<SalesAgent>();
					Integer cs=Integer.parseInt(cc.getValue()[0]);
					Integer ce=Integer.parseInt(cc.getValue()[1]);
					for(int n=0;n<urls.size();n++){
						if(cs<=urls.get(n).getClient()&&ce>=urls.get(n).getClient()){
							u1.add(urls.get(n));
						}
					}
					urls=u1;
				}
				//排除在筛选累计佣金范围外的
				if(cf!=null){
					List<SalesAgent> u2=new ArrayList<SalesAgent>();
					BigDecimal fs=new BigDecimal(cf.getValue()[0]);
					BigDecimal fe=new BigDecimal(cf.getValue()[1]);
					for(int n=0;n<urls.size();n++){
						if(fs.compareTo(urls.get(n).getFee())<1&&fe.compareTo(urls.get(n).getFee())>-1){
							u2.add(urls.get(n));
						}
					}
					urls=u2;
				}
				//排除在筛选付费客户范围外的
				if(fc!=null){
					List<SalesAgent> u3=new ArrayList<SalesAgent>();
					Integer cs=Integer.parseInt(fc.getValue()[0]);
					Integer ce=Integer.parseInt(fc.getValue()[1]);
					for(int n=0;n<urls.size();n++){
						if(cs<=urls.get(n).getFeeClient()&&ce>=urls.get(n).getFeeClient()){
							u3.add(urls.get(n));
						}
					}
					urls=u3;
				}
				//判断是高级代理还是普通代理
				if (sr!=null) {
					List<SalesAgent> u4=new ArrayList<SalesAgent>();
					String st=	sr.getValue()[0];
					for(int n=0;n<urls.size();n++){
						Boolean senior = urls.get(n).getSenior();
						if (st.equals("Y")&&urls.get(n).getSenior()!=null&&urls.get(n).getSenior()==true) {
							u4.add(urls.get(n));
						}else if(st.equals("N")) {
							if (urls.get(n).getSenior()==null) {
								u4.add(urls.get(n));
							}else if(urls.get(n).getSenior()==false){
								u4.add(urls.get(n));
							}
						}
						
					}
					urls=u4;
				}
			
			
		}
		
		
		Long count = (long)urls.size();
		BaseModelList<SalesAgent> lists = new BaseModelList<SalesAgent>(count,
				WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public SalesAgent getSalesAgentById(Long id) {
		logger.info("begin getSalesAgentById. id = [" + id + "]");
		SalesAgent pro = (SalesAgent) dao.getObject(SalesAgent.class, id);
		Object[] para = new Object[1];
		para[0] = pro.getUserInfo().getId();
		List<User> lis = (List<User>) dao.find("from com.zqw.bss.model.sys.User u where u.userInfo.id=?", para);
		User user = lis.size() > 0 ? lis.get(0) : null;
		// user.setRoles(null);
		pro.setUser(user);
		logger.info("end getSalesAgentById:[ id =" + WebUtil.getLogBasicString() + "]");
		return pro;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<SalesAgent> getListSalesAgent() {
		// List<SalesAgent> list=(List<SalesAgent>)dao.find("from SalesAgent");
		String sql = "select a.id,a.agentCode,a.sales_id,a.agentName,a.type,a.openBank,a.bankAccount,ui.`name` from t_bss_agent a "
				+ " left join t_bss_sys_user u on u.userInfo_id=a.userInfo_id "
				+" LEFT JOIN t_bss_sys_user bsu ON bsu.username=a.agentName " +
				" LEFT JOIN t_crm_user_info ui ON ui.id=bsu.userInfo_id "
				+ " where u.locked='N'";

		List listVo = dao.executeQuerySql(sql, null);
		List<SalesAgent> salesAgentList = new ArrayList<SalesAgent>();
		for (Object object : listVo) {
			Object[] o = (Object[]) object;
			if (o[2] != null) {
				String userSql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u where u.id=" + o[2];
				List listUserVo = dao.executeQuerySql(userSql, null);
				o[2] = new User((Object[]) listUserVo.get(0));
			}
			SalesAgent salesAgentInfo = new SalesAgent(o,(String)o[7] );
			salesAgentList.add(salesAgentInfo);
		}
		return salesAgentList;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SalesAgentVo> getPageSalesAgentVo(BasePagerObject condition, String[] customernum,
			String[] fees) {
		// //取得赢的佣金和成功客户
		// List<Condition> bsoList = condition.getCondition();
		// List<Condition> bsoRemove =new ArrayList<>();
		// String[] customernum = new String[]{};
		// String[] fees = new String[]{};
		// int temp = 0;
		// for (Condition bso : bsoList) {
		// if (bso.getKey().equals("customernum")) {
		// bsoRemove.add(bso);
		// customernum = bso.getValue();
		// } else if(bso.getKey().equals("fee")) {
		// bsoRemove.add(bso);
		// fees = bso.getValue();
		// }else{
		//
		// }
		// }
		// if (bsoRemove.size()!=0) {
		// bsoList.removeAll(bsoRemove);
		// condition.setCondition(bsoList);
		// }
		
		
		// List<SalesAgent> urls =
		// dao.getLst4Paging(HsqlUtil.genSearchSql(condition, SalesAgent.class,
		// null),
		// new int[] { condition.getPagenum(), condition.getPagesize() });
//		List url = dao
//				.getLst4PagingWithSQL(
//						"SELECT ow.* from t_bss_agent ow where 1=1 "+ conStr,
//						new int[] { condition.getPagenum(), condition.getPagesize() });
		
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		String or ="";
		if (roles.contains("salesManage")) {
			List sales = dao.executeQuerySql("select u.id from t_bss_sys_user u where u.username ='"+username+"'", null);
			String sales_id = sales.get(0).toString();
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			List employeeCodesecond = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u"
					+ " left join t_bss_userrole_info ur on ur.userid = u.id left join  t_bss_sys_role_info r on r.id = ur.roleid "
					+ " where r.roleName = 'secondLevelSalesManage' and  u.parentEmployeeCode ='"+employeeCode.get(0)+"'", null);
			String code  = "'"+employeeCode.get(0).toString()+"',";
			for(int i = 0; i<employeeCodesecond.size();i++){
				code=code+"'"+employeeCodesecond.get(i).toString()+"',";
			}
			code = code.substring(0,code.length()-1);
			or+=" AND ( ow.sales_id = '"+sales_id+"' OR (ow.sales_id IN (select u.id from t_bss_sys_user u where u.parentEmployeeCode in ("+code+")))) ";
		}
		if (roles.contains("customerManage")) {
			List sales = dao.executeQuerySql("select u.id from t_bss_sys_user u where u.username ='"+username+"'", null);
			String sales_id = sales.get(0).toString();
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			List employeeCodesecond = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u"
					+ " left join t_bss_userrole_info ur on ur.userid = u.id left join  t_bss_sys_role_info r on r.id = ur.roleid "
					+ " where r.roleName = 'secondLevelCustomerManage' and  u.parentEmployeeCode ='"+employeeCode.get(0)+"'", null);
			String code  = "'"+employeeCode.get(0).toString()+"',";
			for(int i = 0; i<employeeCodesecond.size();i++){
				code=code+"'"+employeeCodesecond.get(i).toString()+"',";
			}
			code = code.substring(0,code.length()-1);
			or+=" AND ( ow.sales_id = '"+sales_id+"' OR (ow.sales_id IN (select u.id from t_bss_sys_user u where u.parentEmployeeCode in ("+code+")))) ";
		}
		if (roles.contains("secondLevelSalesManage")||roles.contains("secondLevelCustomerManage")) {
//			List<Condition> condition2 = condition.getCondition();
//			List<Condition> cond=new ArrayList<>();
//			String sales_id="";
//			for (Condition con : condition2) {
//				if (con.getKey().equals("ow.sales_id")) {
//					sales_id+=con.getValue()[0];
//				}else{
//					cond.add(con);
//				}
//			}
//			condition.setCondition(cond);
			List sales = dao.executeQuerySql("select u.id from t_bss_sys_user u where u.username ='"+username+"'", null);
			String sales_id = sales.get(0).toString();
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			or+=" AND ( ow.sales_id = '"+sales_id+"' OR (ow.sales_id IN (select u.id from t_bss_sys_user u where u.parentEmployeeCode="+employeeCode.get(0)+"))) ";
		}
		if(roles.contains("salesStaff")||roles.contains("customerService")){
			List sales = dao.executeQuerySql("select u.id from t_bss_sys_user u where u.username ='"+username+"'", null);
			String sales_id = sales.get(0).toString();
			or+=" AND  ow.sales_id = '"+sales_id+"' ";
		}
		String conStr = HsqlUtil.getConditionHqlStr(condition, new StringBuilder());
		List url = dao.executeQuerySql("SELECT ow.* from t_bss_agent ow where 1=1 "+ conStr+or , null);
		List<SalesAgent> urls = new ArrayList<>();
		for (Object object : url) {
			Object o[] = (Object[]) object;
			SalesAgent temp = new SalesAgent(o, 1);
			urls.add(temp);
		}
		List<SalesAgentVo> salesAgentVoList = new ArrayList<SalesAgentVo>();
		int countReduce = 0;
		for (SalesAgent s : urls) {
			// SalesAgentVo vo = new SalesAgentVo();
			// vo.setAgentCode(s.getAgentCode());
			// vo.setAgentName(s.getAgentName());
			// Object[] param=new Object[1];
			// param[0]=s.getAgentCode();
			// List list=dao.find("select distinct w.id from Owner w where
			// w.agentCode=?",param);
			// vo.setCustomernum(new Long(list.size()));
//			Long countCustomernum = dao.getCount4PagingWithSQL(
//					"select COUNT(t.id) from t_bss_agent_revenue t LEFT JOIN t_bss_agent a on t.salesAgent_id=a.id where a.agentCode ="
//							+ s.getAgentCode());
			// 获取付费用户数量
//			Long countCustomernum = dao.getCount4PagingWithSQL(
//					"SELECT count(DISTINCT o.ownerId) as client from t_bss_order o LEFT JOIN t_crm_owner c on c.id=o.ownerId WHERE (o.payStatus='paid' or o.payStatus='offline') and c.agentCode="
//							+ s.getAgentCode() + "");
			Long countCustomernum = dao.getCount4PagingWithSQL("SELECT count(DISTINCT biz.ownerId) FROM 	t_biz_billingrecord biz\n" +
			"LEFT JOIN t_bss_order_pay op ON biz.accountOrderPay_id = op.id\n" +
			"LEFT JOIN t_bss_order ord ON ord.id = op.accountOrder_id\n" +
			"LEFT JOIN t_crm_owner o ON ord.ownerId = o.id\n" +
			"where o.agentCode ='"+s.getAgentCode()+"' AND (biz.status='paid' OR biz.status='offline')");
			
			// vo.setCustomernum(countCustomernum);
			// 累计购买金额

			// List amtList = dao.executeQuerySql(
			// "SELECT SUM(b.totalAmt)FROM t_bss_agent_revenue r "
			// + "LEFT JOIN t_bss_agent a ON r.salesAgent_id = a.id "
			// + "LEFT JOIN t_bss_order_pay p ON r.accountOrderPay_id = p.id "
			// + "LEFT JOIN t_bss_order b ON p.accountOrder_id = b.id where
			// a.agentCode=" + s.getId(),
			List amtList = dao.executeQuerySql("SELECT SUM(pay.amt) FROM t_bss_agent_revenue t "
					+ "LEFT JOIN t_bss_agent a ON t.salesAgent_id = a.id "
					+ "LEFT JOIN t_bss_order_pay pay ON pay.id=t.accountOrderPay_id " + "WHERE  a.agentCode ="
					+ s.getAgentCode(), null);

			Object amt = amtList.get(0);
			// if (amt == null) {
			// vo.setAmt(new BigDecimal(0));
			// } else {
			// vo.setAmt(new BigDecimal(amt.toString()));
			// }
			// 应提佣金
			List feeList = dao.executeQuerySql(
					"SELECT SUM(t.revenueAmt) FROM t_bss_agent_revenue t where t.salesAgent_id =" + s.getId(), null);
			Object fee = feeList.get(0);
			// if (fee == null) {
			// vo.setFee(new BigDecimal(0));
			// } else {
			// vo.setFee(new BigDecimal(fee.toString()));
			// }
			// 已提佣金
			List paidlist = dao
					.executeQuerySql("SELECT SUM(t.revenueAmt) FROM t_bss_agent_revenue t where t.salesAgent_id ="
							+ s.getId() + " and t.payStatus='paid'", null);
			Object paid = paidlist.get(0);
			// if (paid == null) {
			// vo.setRevenueAmt(new BigDecimal(0));
			// } else {
			// vo.setRevenueAmt(new BigDecimal(paid.toString()));
			// }
			// 未提佣金
			BigDecimal notpaid=new BigDecimal(fee == null ? "0" : fee.toString()).subtract(new BigDecimal(paid == null ? "0" : paid.toString()));
		
			// if (notpaid == null) {
			// vo.setNotRevenueAmt(new BigDecimal(0));
			// } else {
			// vo.setNotRevenueAmt(new BigDecimal(notpaid.toString()));
			// }
			SalesAgentVo vo = new SalesAgentVo(s.getAgentCode(), s.getAgentName(), countCustomernum,
					new BigDecimal(amt == null ? "0" : amt.toString()),
					new BigDecimal(fee == null ? "0" : fee.toString()),
					new BigDecimal(paid == null ? "0" : paid.toString()),
					notpaid,s.getId());
			// 判断应得佣金和成功客户
			if (customernum.length != 0) {
				if (!(countCustomernum > Long.valueOf(customernum[0]))
						|| !(countCustomernum < Long.valueOf(customernum[1]))) {
					countReduce++;
					continue;
				}

			}
			if (fees.length != 0) {
				if (!((vo.getFee().compareTo(new BigDecimal(fees[0].toString()))) > 0)
						|| !((vo.getFee().compareTo(new BigDecimal(fees[1].toString()))) < 0)) {
					countReduce++;
					continue;
				}
			}
			salesAgentVoList.add(vo);

		}

		// Long count = dao.getCount4Paging(HsqlUtil.genCountSql(condition,
		// SalesAgent.class));
//		Long count = dao.getCount4PagingWithSQL(
//				"select count(r.id) FROM (SELECT ag.id from t_bss_agent ag LEFT JOIN t_crm_owner ow on ow.agentCode=ag.agentCode where 1=1 "
//						+ conStr + " GROUP BY ag.id) r");
		Long count=dao.getCount4PagingWithSQL("SELECT count(ow.id) from t_bss_agent ow where 1=1 "+ conStr+or);
		if (countReduce != 0) {
			count -= countReduce;
		}
		// BaseModelList<SalesAgent> lists2 = new
		// BaseModelList<SalesAgent>(count,
		// WebUtil.getEntryListFromProxyList(urls, dao));
		//
		//
		// String conStr = HsqlUtil.getConditionHqlStr(condition, new
		// StringBuilder());
		// String sql = "SELECT tba.agentCode, tba.agentName,"
		// + "(SELECT COUNT(bo.id) FROM t_bss_order bo, t_bss_account_product
		// ap, t_crm_owner o WHERE bo.id = ap.order_id AND bo.ownerId = o.id AND
		// tba.agentCode = o.agentCode AND bo.payStatus = 'notpaid' )
		// customernum,"
		// + "(SELECT SUM(bo.totalAmt) FROM t_bss_order bo,
		// t_bss_account_product ap, t_crm_owner o WHERE bo.id = ap.order_id AND
		// bo.ownerId = o.id AND tba.agentCode = o.agentCode AND bo.payStatus =
		// 'notpaid') amt,"
		// + " SUM(bar.revenueAmt) revenueAmt FROM t_bss_agent tba ,
		// t_bss_agent_revenue bar"
		// + " WHERE tba.id = bar.salesAgent_id AND bar.payStatus = 'paid' " +
		// conStr + " GROUP BY bar.salesAgent_id";
		//
		// List list = dao.getLst4PagingWithSQL(sql,
		// new int[] { condition.getPagenum(), condition.getPagesize() });
		//
		// String countSql = "SELECT COUNT(1) id FROM (select
		// count(DISTINCT(tba.id))"
		// + " FROM t_bss_agent tba , t_bss_agent_revenue bar"
		// + " WHERE tba.id = bar.salesAgent_id " + conStr + " GROUP BY
		// bar.salesAgent_id) T";
		// Long count1 = dao.getCount4PagingWithSQL(countSql);

		// List<SalesAgentVo> salesAgentVoList = new ArrayList<SalesAgentVo>();
		// for (Object array : list) {
		// SalesAgentVo vo = new SalesAgentVo((Object[]) array);
		// salesAgentVoList.add(vo);
		// }

		BaseModelList<SalesAgentVo> lists = new BaseModelList<SalesAgentVo>(count,
				WebUtil.getEntryListFromProxyList(salesAgentVoList, dao));
		logger.info("end findAccount:[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SalesAgentFollowVo> follow(BasePagerObject bso) {
		logger.info("begin follow");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		String str="";
		if (roles.contains("Sys_Admin")) {
			
		}else if(roles.contains("salesManage")){
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			str+="AND (s.sales.username ='"+username+"' OR s.sales.parentEmployeeCode='"+employeeCode.get(0)+"') ";
		}else if(roles.contains("salesStaff")){
			str+="AND s.sales.username ='"+username+"' ";
		}else if(roles.contains("customerManage")){
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			str+="AND (s.customer.username ='"+username+"' OR s.customer.parentEmployeeCode='"+employeeCode.get(0)+"') ";
		}else if(roles.contains("customerService")){
			str+="AND s.customer.username ='"+username+"' ";
		}else if(roles.contains("secondLevelSalesManage")){
			List executeQuerySql = dao.executeQuerySql("SELECT	u.username FROM	t_bss_sys_user u\n" +
					"LEFT JOIN t_crm_user_info userInfo ON u.userInfo_id = userInfo.id\n" +
					"LEFT JOIN t_bss_sys_user us ON u.parentEmployeeCode=us.employeeCode\n" +
					"WHERE\n" +
					"	u.parentEmployeeCode != NULL\n" +
					"OR us.username = '"+username+"'", null);
			if (executeQuerySql.size()==0) {
				str+="AND s.sales.username ='"+username+"' ";
			}else{
				String s=" (";
				for (Object object : executeQuerySql) {
					s+="'"+object+"'"+",";
				}
				s=s.substring(0, s.length()-1);
				s+=") ";
				str+="AND (s.sales.username ='"+username+"' or s.sales.username in "+s+" )";
			}
		}
		
		
		
		List<SalesAgent> list = dao.getLst4Paging("FROM SalesAgent s WHERE 1=1 "+str+conStr+" ORDER BY s.userInfo.createDate DESC", new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging("SELECT COUNT(s.id) FROM SalesAgent s WHERE 1=1 "+str+conStr);
		//		String sql=" FROM (select a.id id,i.createDate createDate,a.agentName agentName,i.telephone telephone,u.username username,us.username name,o.lebal lebal from t_bss_agent a\n" +
//				"LEFT JOIN t_bss_sys_user u ON u.id=a.sales_id\n" +
//				"LEFT JOIN t_crm_user_info i ON i.id=a.userInfo_id\n" +
//				"LEFT JOIN t_crm_owner o ON a.agentCode=o.agentCode\n" +
//				"LEFT JOIN t_bss_sys_user us ON us.employeeCode=o.customerCode\n" +
//				"GROUP BY a.id) vo ";
//		List list = dao.getLst4PagingWithSQL("select vo.*,group_concat(concat(pt.createDate,' ',pt.comment) SEPARATOR '----')"+sql+"LEFT JOIN t_bss_potential p ON p.salesAgent_id=vo.id\n" +
//				"LEFT JOIN t_bss_potentialtrack pt ON pt.potential_id=p.id\n" +
//				" WHERE 1=1 "+conStr+
//				" GROUP BY vo.id", new int[] { bso.getPagenum(), bso.getPagesize() });
//		List<SalesAgentFollowVo> listVo=new ArrayList();
//		for (Object object : list) {
//			SalesAgentFollowVo vo=new SalesAgentFollowVo(object);
//			listVo.add(vo);
//		}
//		Long count = dao.getCount4PagingWithSQL("select COUNT(vo.id)"+sql+" WHERE 1=1 "+conStr);
		BaseModelList<SalesAgentFollowVo> lists = new BaseModelList<SalesAgentFollowVo>(count,WebUtil.getEntryListFromProxyList(list, dao));
		logger.info("end follow");
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public PotentialTrack savePotentialTrack(PotentialTrack potentialTrack) {
		logger.info("begin savePotentialTrack");
		PotentialTrack potTrack=(PotentialTrack)dao.save(potentialTrack);
		Object[] param=new Object[2];
		param[0]=potentialTrack.getSalesAgent().getId();
		param[1]=potTrack.getId();
		dao.executeSql("update t_bss_potentialtrack ar SET ar.salesAgent_id =? where ar.id=?", param);
		logger.info("end savePotentialTrack");
		return potTrack;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<SalesAgent> getSenior(String senior) {
		logger.info("begin getSenior");
		List<SalesAgent> list=new ArrayList<SalesAgent>();
		if (senior.equals("true")) {
			list = dao.find("select new com.zqw.bss.model.sale.SalesAgent(t.id,t.agentName,t.userInfo,t.agentCode) FROM SalesAgent t WHERE t.senior = 'Y'");
		}else if(senior.equals("false")){
			list = dao.find("select new com.zqw.bss.model.sale.SalesAgent(t.id,t.agentName,t.userInfo,t.agentCode) FROM SalesAgent t WHERE t.senior = 'N' OR t.senior IS NULL");
		}else if(senior.equals("all")){
			list = dao.find("select new com.zqw.bss.model.sale.SalesAgent(t.id,t.agentName,t.userInfo,t.agentCode) FROM SalesAgent t ");
		}
		logger.info("end getSenior");
		return list;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<OwnerDetailsVo> getOwnerDetails(String type, String agentCode, BasePagerObject bso) {
		logger.info("begin getOwnerDetails");
//		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
//		String sql="FROM\n" +
//				"	t_crm_owner o\n" +
//				"LEFT JOIN t_crm_enterprise_info enterprise1  ON o.enterpriseInfo_id=enterprise1.id  \n" +
//				"LEFT JOIN t_crm_user_info ui ON ui.id=enterprise1.id \n"+
//				"LEFT JOIN t_bss_sys_user xs ON xs.employeeCode=o.employeeCode\n" +
//				"LEFT JOIN t_bss_sys_user kf ON kf.employeeCode=o.customerCode\n" +
//				"LEFT  JOIN t_biz_billingrecord billingrec ON  (billingrec.status = 'paid' or billingrec.status = 'offline'  )  AND billingrec.ownerId=o.id "+
//				"LEFT JOIN t_bss_remark re ON  re.owner_id=o.id "+
//				"WHERE o.agentCode='"+agentCode+"' ";
//		String select="select o.id,o.createDate,o.loginId,o.regTelephone,ui.name,SUM(billingrec.amount) totalAmt,xs.username xs,kf.username kf,o.lebal,group_concat(concat(re.createDate,'$$$',re.remark)  SEPARATOR '--------') remark ";
//		String group ="";
//		if (type.equals("success")) {
//			group+=" GROUP BY o.id ORDER BY o.createDate DESC";
//		}
//		if (type.equals("paid")) {
//			group+=" GROUP BY\n" +
//					" o.id\n" +
//					"    HAVING\n" +
//					"        (\n" +
//					"            SUM(billingrec.amount) IS NOT NULL\n" +
//					"        ) \n" +
//					" ORDER BY\n" +
//					" o.createDate DESC";
//		}
//		List withSQL = dao.getLst4PagingWithSQL(select+sql+conStr+group, new int[] { bso.getPagenum(), bso.getPagesize() });
//		List<OwnerDetailsVo> list=new ArrayList<>();
//		for (Object object : withSQL) {
//			Object[]o= (Object[]) object;
//			OwnerDetailsVo vo=new OwnerDetailsVo(o);
//			list.add(vo);
//		}
//		String selectCount="";
//		if (type.equals("success")) {
//			selectCount="select COUNT(DISTINCT o.id) "+sql+conStr;
//		}
//		if (type.equals("paid")) {
//			selectCount="select COUNT(DISTINCT t.id) from (select o.id id,SUM(billingrec.amount) totalAmt "+sql+conStr+group+" ) t";
//		}
//		Long count = dao.getCount4PagingWithSQL(selectCount);
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String select="select o.id,o.createDate,o.loginId,o.regTelephone,ui.name,SUM(billingrec.amount) totalAmt,xs.username xs,kf.username kf,o.lebal ";
		String sql="FROM\n" +
				"	t_crm_owner o\n" +
				"LEFT JOIN t_crm_enterprise_info enterprise1 ON o.enterpriseInfo_id = enterprise1.id\n" +
				"LEFT JOIN t_crm_user_info ui ON ui.id = enterprise1.id\n" +
				"LEFT JOIN t_bss_sys_user xs ON xs.employeeCode = o.employeeCode\n" +
				"LEFT JOIN t_bss_sys_user kf ON kf.employeeCode = o.customerCode\n" +
				"LEFT JOIN t_biz_billingrecord billingrec ON (\n" +
				"	billingrec. STATUS = 'paid'\n" +
				"	OR billingrec. STATUS = 'offline'\n" +
				")\n" +
				"AND billingrec.ownerId = o.id\n" +
				"LEFT JOIN t_bss_remark re ON re.owner_id = o.id\n" +
				"WHERE\n" +
				"	o.agentCode = '"+agentCode+"' ";
		String group=" GROUP BY o.id ORDER BY o.createDate DESC";
		List withSQL=new ArrayList<>();
		long count = 0;
		if (type.equals("success")) {
			withSQL = dao.getLst4PagingWithSQL(select+sql+conStr+group,  new int[] { bso.getPagenum(), bso.getPagesize() });
			count = dao.getCount4PagingWithSQL("SELECT COUNT(DISTINCT o.id) "+sql+conStr);
		}
		if (type.equals("paid")) {
			withSQL = dao.getLst4PagingWithSQL("select t.*,cli.client FROM ("+select+sql+conStr+group+"	) t LEFT JOIN ( SELECT o.ownerId AS client FROM t_bss_order o\n" +
					"	LEFT JOIN t_crm_owner c ON c.id = o.ownerId\n" +
					"	WHERE o.payStatus = 'paid' AND c.agentCode = "+agentCode+"\n" +
					"	GROUP BY o.ownerId) cli ON cli.client = t.id WHERE cli.client IS NOT NULL ORDER BY t.createDate DESC",  new int[] { bso.getPagenum(), bso.getPagesize() });
			count = dao.getCount4PagingWithSQL("select count(t.id) FROM ("+select+sql+conStr+group+"	) t LEFT JOIN ( SELECT o.ownerId AS client FROM t_bss_order o\n" +
					"	LEFT JOIN t_crm_owner c ON c.id = o.ownerId\n" +
					"	WHERE o.payStatus = 'paid' AND c.agentCode = "+agentCode+"\n" +
					"	GROUP BY o.ownerId) cli ON cli.client = t.id WHERE cli.client IS NOT NULL");
		}
		List<OwnerDetailsVo> list=new ArrayList<>();
		for (Object object : withSQL) {
			Object[]o= (Object[]) object;
			List<Remark> remark=dao.find("SELECT o.remark FROM Owner o WHERE o.id="+o[0]);
			OwnerDetailsVo vo=new OwnerDetailsVo(o,remark);
			list.add(vo);
		}
		BaseModelList<OwnerDetailsVo> lists=new BaseModelList<OwnerDetailsVo>(count,WebUtil.getEntryListFromProxyList(list, dao));
		logger.info("end getOwnerDetails");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SalesAgent> getHaveSalesAgent(String num,String id, BasePagerObject bso) {
		logger.info("begin getHaveSalesAgent");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		List<SalesAgent> list=new ArrayList<>();
		Long count =0L;
		if(num.equals("0")){
			list = dao.getLst4Paging("from SalesAgent sa where sa.sales.id="+id+" "+conStr+ " ORDER BY userInfo.lastUpdateDate  DESC", new int[] { bso.getPagenum(), bso.getPagesize() });
			 count = dao.getCount4Paging("SELECT count(sa.id) from SalesAgent sa where sa.sales.id="+id+" "+conStr);
		}else if(num.equals("1")){
			list = dao.getLst4Paging("from SalesAgent sa where sa.customer.id="+id+" "+conStr+ " ORDER BY userInfo.lastUpdateDate  DESC", new int[] { bso.getPagenum(), bso.getPagesize() });
			 count = dao.getCount4Paging("SELECT count(sa.id) from SalesAgent sa where sa.customer.id="+id+" "+conStr);
		}
		
		for (int n=0;n<list.size();n++){
			
			Object[] para = new Object[1];
			para[0] = list.get(n).getUserInfo().getId();
			List<User> lis = (List<User>) dao.find("from com.zqw.bss.model.sys.User u where u.userInfo.id=?", para);
			
			// 设置父代理名
			if (list.get(n).getParentAgentCode() != null && list.get(n).getParentAgentCode() != "") {
				Object[] par = new Object[1];
				par[0] = list.get(n).getParentAgentCode();
				List<SalesAgent> listn = (List<SalesAgent>) dao.find("from SalesAgent where agentCode=?", par);
				if (lis.size() != 0) {
					list.get(n).setParentAgentName(listn.get(0).getAgentName());
				}
			}
		}
		BaseModelList<SalesAgent> lists=new BaseModelList<SalesAgent>(count,WebUtil.getEntryListFromProxyList(list, dao));
		logger.info("end getHaveSalesAgent");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Map<String, Long> followUp(BasePagerObject bso) {
		logger.info("begin followUp");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		String str="";
		if (roles.contains("Sys_Admin")) {
			
		}else if(roles.contains("salesManage")){
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			str+="AND (s.sales.username ='"+username+"' OR s.sales.parentEmployeeCode='"+employeeCode.get(0)+"') ";
		}else if(roles.contains("salesStaff")){
			str+="AND s.sales.username ='"+username+"' ";
		}else if(roles.contains("customerManage")){
			List employeeCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.username ='"+username+"'", null);
			str+="AND (s.customer.username ='"+username+"' OR s.customer.parentEmployeeCode='"+employeeCode.get(0)+"') ";
		}else if(roles.contains("customerService")){
			str+="AND s.customer.username ='"+username+"' ";
		}else if(roles.contains("secondLevelSalesManage")){
			List executeQuerySql = dao.executeQuerySql("SELECT	u.username FROM	t_bss_sys_user u\n" +
					"LEFT JOIN t_crm_user_info userInfo ON u.userInfo_id = userInfo.id\n" +
					"LEFT JOIN t_bss_sys_user us ON u.parentEmployeeCode=us.employeeCode\n" +
					"WHERE\n" +
					"	u.parentEmployeeCode != NULL\n" +
					"OR us.username = '"+username+"'", null);
			if (executeQuerySql.size()==0) {
				str+="AND s.sales.username ='"+username+"' ";
			}else{
				String s=" (";
				for (Object object : executeQuerySql) {
					s+="'"+object+"'"+",";
				}
				s=s.substring(0, s.length()-1);
				s+=") ";
				str+="AND (s.sales.username ='"+username+"' or s.sales.username in "+s+" )";
			}
		}
		
		
		
		List<SalesAgent> list = dao.getLst4Paging("FROM SalesAgent s WHERE 1=1 and s.lebal is null "+str+conStr+" ORDER BY s.userInfo.createDate DESC", new int[] { 0,99999999 });
		Long count = dao.getCount4Paging("SELECT COUNT(s.id) FROM SalesAgent s WHERE 1=1 "+str+conStr);
		Long noFollowUp =0L;
		for (SalesAgent salesAgent : list) {
			if (salesAgent.getTrackList().size()==0) {
				noFollowUp++;
			}
		}
		Long isFollowUp=count-noFollowUp; 
		Map<String, Long> map=new HashMap<String, Long>();
		map.put("noFollowUp", noFollowUp);
		map.put("isFollowUp", isFollowUp);
		logger.info("end followUp");
		return map;
	}


	
}
