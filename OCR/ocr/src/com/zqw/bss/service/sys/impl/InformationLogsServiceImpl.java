package com.zqw.bss.service.sys.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.sys.InformationLogs;
import com.zqw.bss.service.sys.InformationLogsService;
import com.zqw.bss.util.PushUtil;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.InformationType;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.sys.InformationLogsVo;

@Service
@Qualifier("informationLogsService")
@SuppressWarnings({ "unchecked", "rawtypes" })
public class InformationLogsServiceImpl implements InformationLogsService {

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveInformationLogs(InformationLogs informationLogs, String ids) {
		String[] idss = ids.split(",");
		List list = dao.executeQuerySql("select id,ownerId from t_sys_user", null);
		for (String id : idss) {
			InformationLogs InformationLogs = new InformationLogs();
			Owner ow = (Owner) dao.getObject(Owner.class, Long.valueOf(id));
			InformationLogs.setNumber(informationLogs.getNumber());
			InformationLogs.setContent(informationLogs.getContent());
			InformationLogs.setTheme(informationLogs.getTheme());
			InformationLogs.setCreateBy((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME));
			InformationLogs.setBizType("SystemRemind");
			InformationLogs.setName(InformationType.SystemRemind);
			InformationLogs.setOwnerId(Long.valueOf(id));
			InformationLogs.setUsername(ow.getLoginId());
			InformationLogs.setFlag(false);
			dao.save(InformationLogs);
			Map<String, String> extras = new HashMap<String, String>();
			extras.put("title", "系统提醒");
			extras.put("type", "0");
			String userid = "";
			for(int i = 0 ; i < list.size() ; i++){
				Object[] obj = (Object[]) list.get(i);
				if(id.toString().equals(obj[1].toString())){
					userid = userid+obj[0]+",";
				}
			}
			String[] useridStr = userid.split(",");
			PushUtil.sendPushByAlias("系统提醒", informationLogs.getContent(), useridStr,extras);
		}
		return true;
	}

	@Override
	@Transactional(readOnly = true,propagation=Propagation.REQUIRED)
	public BaseModelList<InformationLogsVo> getInformationLogsVoList(BasePagerObject query) {

		String conStr = HsqlUtil.getConditionHqlStr(query, new StringBuilder());
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String username = "";
		String codes = " and parentEmployeeCode in (";
		if(!roles.contains("Sys_Admin")){
			if(roles.contains("agentistrator")){
				String codeStr="";
				username = " and il.createBy in ('"+(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME)+"',";
				List codesf = dao.executeQuerySql("select agentCode from t_bss_agent where agentName = '"+(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME)+"'", null);
				if(codesf.size()>0){
					List code = dao.executeQuerySql("select agentCode,agentName from  t_bss_agent where senior = 'Y' and parentAgentCode = '"+codesf.get(0).toString()+"'",null);
					codeStr = " and parentAgentCode in ('"+codesf.get(0).toString()+"',";
					for(int i = 0 ; i < code.size() ; i++){
						Object[] obj = (Object[]) code.get(i);
						codeStr=codeStr+"'"+obj[0].toString()+"',";
						username = username+"'"+obj[1].toString()+"',";
					}
					codeStr = codeStr.substring(0,codeStr.length()-1)+")";
					List codestr= dao.executeQuerySql("select agentCode from  t_bss_agent where 1 = 1 "+codeStr,null);
					for(int i = 0 ; i < codestr.size() ; i++){
						username = username+"'"+codestr.get(i).toString()+"',";
					}
					username = username.substring(0,username.length()-1)+")";
				}
			}else{
				username = " and il.createBy in ('"+(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME)+"',";
				List code = dao.executeQuerySql("select employeeCode from t_bss_sys_user where username = '"+(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME)+"'", null);
				List pcode  = dao.executeQuerySql("select employeeCode,username from t_bss_sys_user where parentEmployeeCode = '"+code.get(0).toString()+"'", null);
				for(int i =0 ; i < pcode.size() ; i++){
					Object[] obj = (Object[]) pcode.get(i);
					codes = codes+"'"+obj[0].toString()+"',";
					username = username+"'"+obj[1].toString()+"',";
				}
				if(pcode.size()>0){
					List usnames  = dao.executeQuerySql("select username from t_bss_sys_user where 1 =1 "+codes, null);
					for(int i =0 ; i < usnames.size() ; i++){
						username = username+"'"+usnames.get(i).toString()+"',";
					}
				}
				username = username.substring(0,username.length()-1)+")";
			}
		}
		String sql = "select new com.zqw.bss.vo.sys.InformationLogsVo(il.number,il.theme,il.createDate,sum(il.count),il.content,il.createBy)"
				+ " from InformationLogs il where il.name = 'SystemRemind' and il.number is not null  " + conStr+username
				+ "  group by il.number order by il.createDate desc ";
		List<InformationLogsVo> list = dao.getLst4Paging(sql, new int[] { query.getPagenum(), query.getPagesize() });
		String sqlCount = "select count(*) from (select * from t_sys_information_logs il where il.name = 'SystemRemind' and il.number is not null  "
				+ conStr+username + " group by il.number) as t";
		Long count = dao.getCount4PagingWithSQL(sqlCount);

		for (InformationLogsVo vo : list) {
			Long lookcount = dao.getCount4Paging(
					"select count(*) from InformationLogs il where il.name = 'SystemRemind' and il.flag='Y' and il.number='"
							+ vo.getNumber() + "' ");
			vo.setLookCount(lookcount);
			Long allcount = dao
					.getCount4Paging("select count(*) from InformationLogs il where il.name = 'SystemRemind' and il.number='"
							+ vo.getNumber() + "' ");
			vo.setCount(allcount);
		}
		BaseModelList<InformationLogsVo> lists = new BaseModelList<InformationLogsVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true,propagation=Propagation.REQUIRED)
	public BaseModelList<InformationLogsVo> getInformationLogsVoListDetail(BasePagerObject query, String code) {

		String conStr = HsqlUtil.getConditionHqlStr(query, new StringBuilder());
		String sql = "select new com.zqw.bss.vo.sys.InformationLogsVo(il.flag,il.createDate,enterpriseInfo.name,il.content,il.username)"
				+ " from InformationLogs il,Owner ow,EnterpriseInfo enterpriseInfo where enterpriseInfo.id=ow.enterpriseInfo.id "
				+ "and ow.loginId =il.username and  il.name = 'SystemRemind' and il.number='" + code + "'  " + conStr + " "
				+ "order by il.createDate desc ";
		List<InformationLogsVo> list = dao.getLst4Paging(sql, new int[] { query.getPagenum(), query.getPagesize() });
		String sqlCount = "select count(*) from InformationLogs il where il.name = 'SystemRemind' and il.number='" + code + "'  "
				+ conStr;
		Long count = dao.getCount4Paging(sqlCount);
		BaseModelList<InformationLogsVo> lists = new BaseModelList<InformationLogsVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true,propagation=Propagation.REQUIRED)
	public Map<String, Object> getUserPage(BigDecimal amountmin, BigDecimal amountmax, String state,
			BigDecimal statemin, BigDecimal statemax, String datemin, String datemax, String user, String activitNumber,
			String phoneNumber) {
		String in = "";
		String stateString = "";

		if (amountmin.compareTo(new BigDecimal(-1)) != 0) {
			List list = dao.executeQuerySql(
					"SELECT temp.id FROM (SELECT o.id id,o.loginId loginId,SUM(pay.totalAmt) sum FROM t_crm_owner o "
							+ "LEFT JOIN t_bss_order ord ON ord.ownerId=o.id "
							+ "LEFT JOIN t_bss_order_pay pay ON pay.accountOrder_id=ord.id "
							+ "where pay.payStatus='paid' GROUP BY o.id) temp where temp.sum>" + amountmin
							+ " AND temp.sum <" + amountmax,
					null);
			if (list.size() != 0) {
				in += " AND id in(";
				for (Object object : list) {
					in += object + ",";
				}
				in = in.substring(0, in.length() - 1);
				in += ")";
			}
		}

		List list = new ArrayList<>();
		String sql = "";
		if (!state.equals("-1")) {
			if (statemin.compareTo(new BigDecimal(-1)) == 0) {
				if (state.equals("use")) {
					sql = "available='N'";
				} else if (state.equals("noUse")) {
					sql = "available='Y'";
				} else if (state.equals("overdue")) {
					sql = "overdue='Y'";
				}
				list = dao.executeQuerySql("select ownerId FROM t_bss_voucher WHERE " + sql + " GROUP BY ownerId",
						null);

			} else {

				if (state.equals("use")) {
					sql = "available='N'";
				} else if (state.equals("noUse")) {
					sql = "available='Y'";
				} else if (state.equals("overdue")) {
					sql = "overdue='Y'";
				}
				list = dao.executeQuerySql("select ownerId FROM t_bss_voucher WHERE " + sql
						+ " GROUP BY ownerId having SUM(amount)>" + statemin + " AND SUM(amount)<" + statemax, null);

			}
			if (list.size() != 0) {
				// AND (v.id=2 OR v.id=1)
				stateString += " AND (";
				for (Object object : list) {
					stateString += " id =" + object + " OR";
				}
				stateString = stateString.substring(0, stateString.length() - 3);
				stateString += ")";
			}
		}

		String conStr = "";
		// 注册时间
		if (!datemin.equals("-1")) {
			conStr += " AND createDate > '" + datemin + "' AND createDate < '" + datemax + "'";
		}
		// 用户名
		if (!user.equals("-1")) {
			conStr += " AND loginId = '" + user + "'";
		}
		if (!phoneNumber.equals("-1")) {
			conStr += " AND regTelephone = '" + phoneNumber + "'";
		}
		// activitNumber 活动码
		if (!activitNumber.equals("-1")) {
			conStr += " AND activitNumber like '%" + activitNumber + "%'";
		}
//		String sql2 = "FROM Owner WHERE 1=1 " + conStr + stateString + in + " AND id>1";
//		List<Owner> find = dao.find(sql2);
//		List ids = new ArrayList<>();
//		for (Owner owner : find) {
//			ids.add(owner.getId());
//		}
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String username = "";
		String codes = " and parentEmployeeCode in (";
		if(!roles.contains("Sys_Admin")){
			List code = dao.executeQuerySql("select employeeCode from t_bss_sys_user where username = '"+(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME)+"'", null);
			username = " and employeeCode in ('"+code.get(0).toString()+"',";
			List pcode  = dao.executeQuerySql("select employeeCode from t_bss_sys_user where parentEmployeeCode = '"+code.get(0).toString()+"'", null);
			for(int i =0 ; i < pcode.size() ; i++){
				Object[] obj = (Object[]) pcode.get(i);
				codes = codes+"'"+obj[1].toString()+"',";
				username = username+"'"+obj[1].toString()+"',";
			}
			if(pcode.size()>0){
				List usnames  = dao.executeQuerySql("select employeeCode from t_bss_sys_user where 1 =1 "+codes, null);
				for(int i =0 ; i < usnames.size() ; i++){
					username = username+"'"+usnames.get(i).toString()+"',";
				}
			}
			username = username.substring(0,username.length()-1)+")";
		}
		List sqllist = dao.executeQuerySql("select id  from t_crm_owner WHERE 1=1 " + conStr + stateString + in + username + " AND id>1", null);
		List ids = new ArrayList<>();
		for (int i = 0 ; i < sqllist.size() ; i++) {
			ids.add(sqllist.get(i).toString());
		}
		Long count = dao
				.getCount4Paging("SELECT COUNT(*) FROM Owner WHERE 1=1 " + conStr + stateString + in + " AND id>1");
		Map base = new HashMap<>();
		base.put("ids", ids);
		base.put("count", count);
		return base;
	}

}
