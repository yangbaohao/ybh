package com.zqw.bss.service.crm.impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.LockMode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.sun.mail.util.MailSSLSocketFactory;
import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.DateUtil;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.Account;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.billing.BillingProductPermission;
import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.EnterpriseInfo;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PayRemark;
import com.zqw.bss.model.crm.PersonInfo;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.crm.TaxDeclare;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.model.sale.UserSaler;
import com.zqw.bss.model.sys.AcUser;
import com.zqw.bss.model.sys.Role;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.service.crm.OwnerService;
import com.zqw.bss.service.fms.AccountPeriodService;
import com.zqw.bss.service.sys.RoleService;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.PayStatus;
import com.zqw.bss.util.SystemConstant.SalesType;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.PasswordHelper;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.billing.AccountOrderHistoryVo;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.crm.OwnerInfoVo;
import com.zqw.bss.vo.crm.UserInfoForListVO;
import com.zqw.bss.vo.sys.OcrSearchUserBuyListVo;
import com.zqw.bss.vo.sys.OwnerDetailsVo;
import com.zqw.bss.vo.sys.OwnerInformationVo;
import com.zqw.bss.vo.sys.SearchOwnerListvo;
import com.zqw.bss.vo.sys.SearchUserBuyListVo;

import groovy.transform.Synchronized;

/**
 * <p>
 * Title:系统用户注册服务
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2016 www.accountyun.com
 * </p>
 * <p>
 * Company:zqw
 * </p>
 * 
 * @author lzy
 * @date 2016年4月15日 上午9:14:32
 * @version 1.0
 */
@Service
@Qualifier("ownerService")
@SuppressWarnings({ "unused","unchecked","rawtypes"})
public class OwnerServiceImpl implements OwnerService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	 // 发件人的 邮箱 和 密码（替换为自己的邮箱和密码） 
//	public static String myEmailAccount = "2355725118@qq.com";
//	public static String myEmailPassword = "wxqfvozqfooheahh";
	
//	public static String myEmailAccount = "1015649052@qq.com";
//	public static String myEmailPassword = "bpyiofvuemqjbcfh";
	
	public static String myEmailAccount = "huan.du@ydcfo.com";
	public static String myEmailPassword = "e4fCi80pFHF71tt7";
	
	  // 网易163邮箱的 SMTP 服务器地址为: smtp.163.com
	 public static String myEmailSMTPHost = "smtp.exmail.qq.com";
	 // 收件人邮箱（替换为自己知道的有效邮箱）1015649052 2357950402
	 public static String receiveMailAccount = "1015649052@qq.com";

	@Autowired
	protected DAO dao;

	@Autowired
	protected RoleService roleService;

	@Autowired
	protected AccountPeriodService accountPeriodService;
	
	@Autowired
	protected UserService userService;
	
	@Autowired
	protected CommonService commonService;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Owner getOwner(Long ownerId) {
		logger.info("begin getOwner.");
		Owner o = (Owner) dao.getObject(Owner.class, ownerId);
		o.getEnterpriseInfo().getName();
		// o.getEnterpriseInfo().getAddress().size();
		logger.info("end getOwner.[ id =" + WebUtil.getLogBasicString() + "]");
		return o;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<OwnerInfoVo> getOwnerInfoVoAll(BasePagerObject condition) {
		// TODO Auto-generated method stub
		logger.info("begin getOwnerInfoVoAll. ");
		String conStr = HsqlUtil.getConditionHqlStr(condition, new StringBuilder());
		String hql = "select new com.zqw.bss.vo.crm.OwnerInfoVo(suser.username,enterprise.name,enterprise.email,enterprise.telephone,accountPeriod.accountPeriodMonth,"
				+ "owner.lastUpdateDate) "
				+ " from Owner owner, User suser ,EnterpriseInfo enterprise, AccountPeriod accountPeriod "
				+ " where owner.id = suser.ownerId " + " and owner.enterpriseInfo.id = enterprise.id "
				+ " and owner.startMonth.id = accountPeriod.id " + conStr + " order by owner.lastUpdateDate desc";

		// Long count = dao.getCount4PagingWithSQL(countSql);
		// BaseModelList<OwnerInfoVo> lists = new
		// BaseModelList<OwnerInfoVo>(count,
		// WebUtil.getEntryListFromProxyList(list,dao));
		logger.info("end getOwnerInfoVoAll.[ id =" + WebUtil.getLogBasicString() + "]");
		return null;
	}

	@Override
	@Synchronized
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateOwnerRemarkBySales(Owner owner) {
		Owner own = (Owner) dao.getObject(Owner.class, owner.getId());
		List<Remark> list = owner.getRemark();
		own.getRemark().add(list.get(0));
		dao.update(own);
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserBuyListVo> getSearchUserBuyVobusrListVo(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition) {
		logger.info("begin getSearchUserBuyVobusrListVo.");
		String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
		String startAmtsql = "";
		String endAmtsql = "";
		String sql = "   SELECT owner0.id,owner0.createDate,owner0.loginId,enterprise.name,owner0.regTelephone,owner0.employeeCode,owner0.agentCode,SUM(billingrec.amount) ,"
				+ " owner0.lastUpdateDate,owner0.lebal,owner0.customerCode,owner0.salesType ";
		String sqlStr = " FROM t_crm_owner owner0  LEFT OUTER JOIN t_crm_enterprise_info enterprise1 ON owner0.enterpriseInfo_id=enterprise1.id "
				+ " LEFT OUTER JOIN t_crm_user_info enterprise ON enterprise1.id=enterprise.id LEFT  JOIN t_biz_billingrecord billingrec ON "
				+ "  (billingrec.status = 'paid' or billingrec.status = 'offline') AND billingrec.ownerId=owner0.id WHERE owner0.id>1 " + conStr;
		
		String sqlcuont = "select count(distinct owner0.id) ";
		Long count = dao.getCount4PagingWithSQL(sqlcuont + sqlStr);
		if (startAmt.compareTo(BigDecimal.ZERO) == 0 && endAmt.compareTo(BigDecimal.ZERO) == 0) {
		} else {
			startAmtsql = " and  SUM(billingrec.amount) >= " +startAmt;
			endAmtsql = " and  SUM(billingrec.amount) <= " + endAmt;
			List<SearchOwnerListvo> list=dao.getLst4PagingWithSQL(sql + sqlStr + " GROUP BY owner0.id HAVING(1=1"+startAmtsql+endAmtsql+") ORDER BY owner0.createDate DESC ",new int[]{ 0,999999999});
			count = (long) list.size();
		}
		List<SearchOwnerListvo> list = dao.getLst4PagingWithSQL(
				sql + sqlStr + " GROUP BY owner0.id HAVING(1=1"+startAmtsql+endAmtsql+") ORDER BY owner0.createDate DESC ",
				new int[] { userCondition.getPagenum(), userCondition.getPagesize() });
		List<SearchOwnerListvo> listVO = new ArrayList<SearchOwnerListvo>();
		for (Object rsArray : list) {
			SearchOwnerListvo vo = new SearchOwnerListvo((Object[]) rsArray);
			listVO.add(vo);
		}
		List remarks = dao.executeQuerySql("SELECT r.owner_id, r.remark, r.createDate FROM t_bss_remark r", null);
		Map<Long,List<Remark>> remarksMap = new HashMap<Long,List<Remark>>();
		for(Object o: remarks){
			Object[] r = (Object[]) o;
			if(r[0] !=null && remarksMap.containsKey( Long.valueOf(r[0].toString()) )){
				Remark remark = new Remark();
				remark.setRemark(r[1].toString());
				remark.setCreateDate( (Date)r[2] );
				remarksMap.get( Long.valueOf(r[0].toString()) ).add(remark);
			}else if(r[0] !=null){
				List<Remark> rlist = new ArrayList<Remark>();
				Remark remark = new Remark();
				remark.setRemark(r[1].toString());
				remark.setCreateDate( (Date)r[2] );
				rlist.add(remark);
				remarksMap.put( Long.valueOf(r[0].toString()) , rlist);
			}
		}
		
		for(SearchOwnerListvo vvoo:listVO){
//			List<Owner> owners = dao.find("from Remark ow where id = "+vvoo.getOwnerId());
//			if(owners.get(0).getRemark().size()>0){
//				vvoo.setRemark(owners.get(0).getRemark());
//			}
			vvoo.setRemark(remarksMap.get(vvoo.getOwnerId()));
			if(vvoo.getCustomerCode()==null){
				vvoo.setCustomerCode("");
			}
			if(vvoo.getEmployeeCode()==null){
				vvoo.setEmployeeCode("");
			}
		}
		BaseModelList<SearchUserBuyListVo>	 lists = new BaseModelList<SearchUserBuyListVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly=true,propagation=Propagation.REQUIRED)
	public BaseModelList<OcrSearchUserBuyListVo> getOcrSearchUserBuyVobusrListVo(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition) {
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if(!roles.contains("Ocr_Admin")){
			return null;
		}
		List ownerIds = dao.executeQuerySql("select DISTINCT(ownerId) from t_simple_sales_order_log_sum ", null);
		String ids = " ";
		if(ownerIds.size()>0){
			 ids = " and owner0.id in ( ";
			for(int i = 0 ; i < ownerIds.size() ; i++){
				ids = ids+ownerIds.get(i).toString()+",";
			}
		}
		if(!ids.equals(" "))
			ids = ids.substring(0,ids.length()-1)+")";
		String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
		String sql = "   SELECT owner0.id,owner0.createDate,owner0.loginId,enterprise.name,owner0.regTelephone ";
		String sqlStr = " FROM t_crm_owner owner0  "
				+ " LEFT  JOIN t_crm_user_info enterprise ON enterprise.id=owner0.enterpriseInfo_id WHERE owner0.id>1 "+ids+ conStr;
		
		String sqlcuont = "select count(distinct owner0.id) ";
		Long count = dao.getCount4PagingWithSQL(sqlcuont + sqlStr);
		List<OcrSearchUserBuyListVo> list = dao.getLst4PagingWithSQL(
				sql + sqlStr + "  ORDER BY owner0.createDate DESC ",
				new int[] { userCondition.getPagenum(), userCondition.getPagesize() });
		List<OcrSearchUserBuyListVo> listVO = new ArrayList<OcrSearchUserBuyListVo>();
		for (Object rsArray : list) {
			OcrSearchUserBuyListVo vo = new OcrSearchUserBuyListVo((Object[]) rsArray);
			listVO.add(vo);
		}
		
		String ordersql = " SELECT "+
				 " so.orderNumber AS orderNumber," +
				 " so.serviceType AS serviceType ," +
				 " so.orderApprovalStatus AS orderType ," +
				 " logsum.createDate AS submitDate ," +
				 " logsum.orderSuccessDate AS orderSuccessDate, " +
				 " logsum.orderSubmitDate AS orderSubmitDate, "+
				 " logsum.checkSuccessDate AS checkSuccessDate, "+
				 " logsum.completeDate AS completeDate, "+
				 "  CONCAT(userinfo2.name,'(', bsssysuser.username,')')  AS responsibleName , "+
				 " userinfo.telephone AS telephone, "+
				 " sysuser.username AS userName , "+
				 " userinfoe.name AS ownerName , "+
				 " so.id AS id ," + 
				 " so.ownerId AS soOwnerId " +
				// " userinfoe.name AS name "+
				 " FROM "+
				 " t_simple_sales_order_log_sum logsum "+
				 " LEFT JOIN t_simple_sales_order so ON (so.id = logsum.salesOrder_id) "+
				 " LEFT JOIN t_sys_user sysuser ON (sysuser.id = logsum.user_id) "+
				 " LEFT JOIN t_crm_user_info userinfo ON (userinfo.id = sysuser.userInfo_id) "+
				 " LEFT JOIN t_bss_sys_user bsssysuser ON (bsssysuser.id = logsum.customerServiceId) "+
				 " LEFT JOIN t_crm_user_info userinfo2 ON (userinfo2.id = bsssysuser.userInfo_id) "+
				 " LEFT JOIN t_crm_owner towner ON (towner.id = so.ownerId) "+
				 " LEFT JOIN t_crm_user_info userinfoe ON (userinfoe.id = towner.enterpriseInfo_id) where 1=1 ";
		List<SalesOrderListVo> listvo = dao.getLst4PagingWithSQL(ordersql ,
				new int[] { 0, 999999999 });
		List<SalesOrderListVo> listoder = new ArrayList<SalesOrderListVo>();
		for (Object array : listvo) {
			SalesOrderListVo vo = new SalesOrderListVo((Object[]) array,null);
			listoder.add(vo);
		}
		for(OcrSearchUserBuyListVo vo : listVO){
			Long all = 0L;
			Long or = 0L;
			Long jia = 0L;
			for(SalesOrderListVo so : listoder){
				if(vo.getOwnerId().equals(so.getSoOwnerId())){
					all++;
					if(so.getServiceType().toString().equals("emergency")){
						jia++;
					}
				}
			}
			or = all - jia;
			vo.setTotalNum(all);
			vo.setOrdinaryNum(or);
			vo.setUrgentNum(jia);
		}
		BaseModelList<OcrSearchUserBuyListVo>	 lists = new BaseModelList<OcrSearchUserBuyListVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		return lists;
	}
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public OwnerInformationVo getDetailOwner(Long id) {
		OwnerInformationVo ov = new OwnerInformationVo();
		Owner owner = (Owner) dao.getObject(Owner.class, id);
		List<TaxDeclare> tds = dao.find("from TaxDeclare where ownerId = "+id+" ORDER BY taxStatus DESC");
		List bpp = dao.executeQuerySql("SELECT bpp.endDate FROM t_bss_billing_product_permission bpp LEFT JOIN t_bss_account_product ap  ON ap.id = bpp.accountProduct_id"
				+ " WHERE ownerId ="+id
				+ " AND ap.productCode = '0009' ORDER BY bpp.endDate DESC",null);
		if(tds.size()>0){
			if(bpp.size()>0){
				String date=DateUtil.format((Date) bpp.get(0),"yyyy-MM");
				ov.setTaxStatus(tds.get(0).getTaxStatus()+" ( "+date+"到期 )");
			}else{
				ov.setTaxStatus(tds.get(0).getTaxStatus());
				}
		}else{
			ov.setTaxStatus("无申报记录");
		}
		Map<String, Date> mapdate = this.getdate();
		String sql= "SELECT ex.* FROM(SELECT ord.id,ord.orderCode,o.loginId,cui.name,\n" +
				"GROUP_CONCAT(DISTINCT c.productName) AS productName,biz.amount,ord.orderCreateDate,ord.orderEndDate,biz.status\n" +
				" FROM t_biz_billingrecord biz,t_bss_order ord\n" +
				"LEFT JOIN t_bss_order_pay op on ord.id=op.accountOrder_id\n" +
				"LEFT JOIN t_crm_owner o ON ord.ownerId=o.id\n" +
				"LEFT JOIN t_crm_user_info cui ON o.enterpriseInfo_id = cui.id\n" +
				"LEFT JOIN t_bss_order_product_info a ON ord.id = a.order_id\n" +
				"LEFT JOIN t_bss_account_product c ON c.id = a.product_id\n" +
				"where ord.payStatus<>'notpaid' AND biz.accountOrderPay_id=op.id GROUP BY ord.orderCode order by ord.orderCreateDate desc) ex WHERE ex.loginId= '"+owner.getLoginId()+"'"
						+ " AND (STATUS = 'paid' OR STATUS = 'offline')";
		List list = dao.getLst4PagingWithSQL(sql, new int[] {0, 999999999 });
		List<AccountOrderHistoryVo> voList=new ArrayList<>();
		for (Object object : list) {
			Object[] o= (Object[])object;
			AccountOrderHistoryVo vo=new AccountOrderHistoryVo(o);
			voList.add(vo);
		}
		BigDecimal totalAmt = BigDecimal.ZERO;
		BigDecimal mouthAmt = BigDecimal.ZERO;
		String name="";
		String totalname="";
		String aname="";
		String btotalname="";
		for(AccountOrderHistoryVo vo : voList){
			String [] product = vo.getProductName().split(",");
			totalAmt = totalAmt.add(new BigDecimal(vo.getTotalAmt()));
			for(int i = 0 ; i < product.length; i++){
				if(!btotalname.equals(product[i]))
				totalname = totalname+product[i]+",";
				btotalname = product[i];
			}
			if(mapdate.get("firstDay").compareTo(vo.getOrderCreateDate())<0&&mapdate.get("lastDay").compareTo(vo.getOrderCreateDate())>0){
				mouthAmt = mouthAmt.add(new BigDecimal(vo.getTotalAmt()));
				for(int i = 0 ; i < product.length; i++){
					if(!aname.equals(product[i]))
					name = name+product[i]+",";
					aname=product[i];
				}
			}
		}
		if(!totalname.equals("")){
			totalname = totalname.substring(0,totalname.length()-1);
		}
		if(!name.equals("")){
			name = name.substring(0,name.length()-1);
		}
		ov.setMouthAmt(mouthAmt);
		ov.setMouthProductName(name);
		ov.setTotalAmt(totalAmt);
		ov.setTotalProductName(totalname);
		return ov;
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
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public boolean createImportRegInfoAll(Map map, Boolean checkName, Boolean checkStartMonth, List<User> user1, AccountProduct ap) {
		logger.info("begin createRegInfoAll.");
		
		AcUser user = new AcUser();
		//如果用户名称为空不允许添加
		if(user1==null)
		user1 = dao.find(" from User where username = '"+(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME)+"'");
		
		if(StringUtils.isBlank((String) map.get("username")))
			throw new OperationException("用户名不能为空！");
		if(checkName){
			//当前所有用户集合
			Object[] par=new Object[1];
			par[0]=(String) map.get("username");
			//当前所有用户集合
			List userList = dao.executeQuerySql("select ownerId from t_sys_user where username = ?",par);
//			List<AcUser> userList = dao.find("from AcUser where username = ?", par);
			if(userList.size()>0){
				Object[] par1=new Object[1];
				par1[0]=userList.get(0);
				List taxCodeList = dao.executeQuerySql("select taxCode from t_crm_owner where id = ?",par1);
				if(!taxCodeList.isEmpty()&&taxCodeList.get(0)!=null){
					List<String> employeeCodeList = dao.executeQuerySql("select employeeCode from t_bss_sys_user where parentEmployeeCode = '"+user1.get(0).getEmployeeCode()+"'", null);
					employeeCodeList.add(user1.get(0).getEmployeeCode());
					for(String employeeCode : employeeCodeList){
						if(taxCodeList.get(0).equals(employeeCode)){
							throw new OperationException(map.get("username")+ "用户已是您的客户，不需要再次新增！");
						}
					}
				}
				return false;
			}
		}
		Owner owner = new Owner();
		owner.setLoginId((String) map.get("username"));
		owner.setAgentCode((String) map.get("agentCode"));
		if((String) map.get("vat")!=null){
			owner.setVat(Long.valueOf((String) map.get("vat")));
		}
		owner.setCreateDate(new Date());
		owner.setCreateBy((String) map.get("username"));
		owner.setLastUpdateBy((String) map.get("username"));
		owner.setLastUpdateDate(new Date());
		
		
		
		//手机号取倒入人的手机号
//		if(StringUtils.isNotBlank(user1.get(0).getUserInfo().getTelephone())){
//			owner.setRegTelephone(user1.get(0).getUserInfo().getTelephone());
//			map.put("telephone", user1.get(0).getUserInfo().getTelephone());
//		}
		
		if (SalesType.agentDirect.toString().equals((String) map.get("salesType")))
			owner.setSalesType(SalesType.agentDirect);
		else if(SalesType.transformation.toString().equals((String) map.get("salesType")))
			owner.setSalesType(SalesType.transformation);
		else
			owner.setSalesType(SalesType.salesDirect);
		

		String todayStr = DateUtil.format(new Date(), "yyyy-MM");
		if(checkStartMonth){
			if (map.get("startMonth") != null && DateUtil.parse((String) map.get("startMonth"), "yyyy-MM") == null)
				throw new OperationException("日期格式错误！");
			
			if (map.get("startMonth") != null && DateUtil.compareMonth((String) map.get("startMonth"), todayStr) > 0)
				throw new OperationException("开始使用月份不能大于当前月！");
		}

		owner.setSalesType(SalesType.TaxSystem);
		
		
		//联系电话
		if(StringUtils.isNotBlank((String) map.get("regTelephone")))
			owner.setRegTelephone((String) map.get("regTelephone"));
		
		dao.saveNoSetDefaultValue(owner);
		

		logger.info("info saveUser.");
		PersonInfo personInfo = new PersonInfo();
		if(StringUtils.isNotBlank((String) map.get("username"))){
			personInfo.setName((String) map.get("username"));
		}else{
			personInfo.setName("暂未设置");
		}
		personInfo.setEmail((String) map.get("email"));
		personInfo.setTelephone((String) map.get("regTelephone"));
		user = new AcUser((String) map.get("username"), (String) map.get("password"), personInfo);

		PasswordHelper.encryptPassword(user);

		WebUtil.setDefaultValueInModel(user, user.getUsername(), owner.getId());
		
		List<Role> roles = new ArrayList<Role>();
		Role ro = new Role();
		ro.setId(2L);
		roles.add(ro); // 初始化注册用户的角色为管理员(不包括角色管理20、资源管理21)
		user.setRoles(roles);
		user = (AcUser) dao.save(user);

		EnterpriseInfo enterpriseInfo = new EnterpriseInfo();
		if(StringUtils.isNotBlank((String) map.get("enterpriseName"))){
			enterpriseInfo.setName((String) map.get("enterpriseName"));
		}else{
			enterpriseInfo.setName("暂未设置");
		}
		enterpriseInfo.setOwnerId(owner.getId());
		enterpriseInfo.setTelephone((String) map.get("regTelephone"));
		enterpriseInfo.setEmail((String) map.get("email"));
		enterpriseInfo.setRegisterTime(new Date());
		enterpriseInfo.setTaxCode((String) map.get("enterpriseTaxCode"));
		enterpriseInfo.setCreateDate(new Date());
		enterpriseInfo.setCreateBy((String) map.get("username"));
		enterpriseInfo.setLastUpdateBy((String) map.get("username"));
		enterpriseInfo.setLastUpdateDate(new Date());
		dao.saveNoSetDefaultValue(enterpriseInfo);

		owner.setEnterpriseInfo(enterpriseInfo);
		dao.updateNoSetDefaultValue(owner);
		//使用一个月
		AccountOrder ao=new AccountOrder();
		ao.setChannel("TRYOUT");
		ao.setCreateBy(owner.getLoginId());
		ao.setCreateDate(new Date());
		ao.setLastUpdateBy(owner.getLoginId());
		ao.setLastUpdateDate(new Date());
		ao.setOrderBeginDate(new Date());
		BillingProductPermission bpp=new BillingProductPermission();
		if(ap==null)
		ap=(AccountProduct)dao.getObject(AccountProduct.class, 10L);
		Calendar calendarStr=Calendar.getInstance();
		calendarStr.setTime(new Date());
		calendarStr.add(Calendar.MONTH,1);	//多加一个月
		bpp.setAccountProduct(ap);
		List<AccountProduct> accountProducts=new ArrayList<AccountProduct>();
		accountProducts.add(ap);
		ao.setAccountProducts(accountProducts);
		bpp.setEndDate(calendarStr.getTime());
		ao.setOrderCreateDate(new Date());
		ao.setOrderEndDate(calendarStr.getTime());
		ao.setOwnerId(owner.getId());
		ao.setTimeNum(1);
		ao.setPayStatus(PayStatus.tryout);
		ao.setTotalAmt(BigDecimal.ZERO);
		ao.setOrderCode(commonService.getSystemCode("BssTRYOUTMZ", 8));
		bpp.setStartDate(new Date());
		bpp.setOwnerId(owner.getId());
		bpp.setPermission(ap.getPermission());
		dao.saveNoSetDefaultValue(ao);
		dao.saveNoSetDefaultValue(bpp);
		//填写带过来的销售负责人
		String sId=(String) map.get("salesId");
		if(sId!=null&&sId!=""){
			Long salesId=Long.parseLong(sId);
			Object[] par=new Object[2];
			par[0]=salesId;
			par[1]=owner.getId();
			List role =dao.executeQuerySql("SELECT roleName FROM t_bss_sys_user u LEFT JOIN t_bss_userrole_info ut ON "
					+ "ut.userid=u.id LEFT JOIN  t_bss_sys_role_info t ON t.id=ut.roleid WHERE u.id="+salesId,null);
			List licode=dao.executeQuerySql("SELECT employeeCode FROM t_bss_sys_user WHERE id="+salesId, null);
			if(role.get(0).toString().equals("customerManage")||role.get(0).toString().equals("customerService")){
				dao.executeSql("update t_crm_owner a SET a.customerCode='"+licode.get(0).toString()+"' where a.id= "+ owner.getId(),null);
			}else{
				dao.executeHql("update Owner a SET a.employeeCode='"+licode.get(0).toString()+"' where a.id= "+ owner.getId(),null);
				dao.executeSql("update t_crm_owner a SET a.sales_id=? where a.id=?", par);
			}
		}else{
			if(owner.getAgentCode()!=null&&owner.getAgentCode()!=""){
				Object[] pa=new Object[1];
				pa[0]=owner.getAgentCode();
				List listUn=dao.executeQuerySql("SELECT sales_id from t_bss_agent WHERE agentCode=?",pa);
				if(listUn.size()>0&&listUn.get(0)!=null){
					Object[] parm=new Object[1];
					parm[0]=Long.valueOf(listUn.get(0).toString());
					List licode=dao.executeQuerySql("SELECT employeeCode FROM t_bss_sys_user WHERE ID=?", parm);
					if(licode.size()>0&&licode.get(0)!=null){
						Object[] par=new Object[2];
						String code = licode.get(0).toString();
						par[0]=Long.valueOf(listUn.get(0).toString());
						par[1]=owner.getId();
						dao.executeHql("update Owner a SET a.employeeCode='"+code+"' where a.id= "+ owner.getId(),null);
						dao.executeSql("update t_crm_owner a SET a.sales_id=? where a.id=?", par);
					}
				}
			}else{
//				String[] usersaler = SystemConfig.getCoaProperty("user.saler.distribution").split(",");
				//注册销售负责人
				List executeQuerySql = dao.executeQuerySql("select ucode.id,ucode.employeeCode from t_bss_sys_user u,t_crm_user_info ui,t_bss_sys_user ucode  where  u.userInfo_id=ui.id AND ui.telephone= "+owner.getRegTelephone()+" AND u.distributionEmployeeCode is NOT NULL AND ucode.employeeCode=u.distributionEmployeeCode", null);
				if (executeQuerySql.size()!=0) {
					//强制
					Object[] object =(Object[]) executeQuerySql.get(0);
					dao.executeHql("update Owner a SET a.employeeCode='"+object[1]+"' where a.id= "+ owner.getId(),null);
					dao.executeSql("update t_crm_owner a SET a.sales_id="+object[0]+" where a.id= "+ owner.getId(),null);
				}else{	
					//按照比例
					List<UserSaler> find = dao.find("FROM UserSaler WHERE type='sales'");
					if (find!=null && find.size()>0) {
						List list = dao.executeQuerySql("select  SUm(s.proportion) FROM t_bss_user_saler s where s.type='sales'  ", null);
						String [] usersaler=new String [Integer.valueOf(list.get(0)+"")];
						int emp=0;
						for (UserSaler saler : find) {
							for (int i = 0+emp; i < saler.getProportion()+emp; i++) {
								usersaler[i]=saler.getName();
							}
							emp+=saler.getProportion();
						}
						System.out.println(usersaler);
						int random = (int) ( Math.random () * usersaler.length );
						List<UserSaler> salers = dao.find("FROM UserSaler s WHERE s.name='"+usersaler[random]+"' and s.type='sales' ");
						dao.executeHql("update Owner a SET a.employeeCode='"+salers.get(0).getEmployeeCode()+"' where a.id= "+ owner.getId(),null);
						dao.executeSql("update t_crm_owner a SET a.sales_id="+salers.get(0).getUserId()+" where a.id= "+ owner.getId(),null);
					}
				}
				
				//注册分配客服
				List customerCodes =dao.executeQuerySql("select ucode.id,ucode.employeeCode from t_bss_sys_user u,t_crm_user_info ui,t_bss_sys_user ucode  where  u.userInfo_id=ui.id AND ui.telephone= "+owner.getRegTelephone()+" AND u.distributionCustomerEmployeeCode is NOT NULL AND ucode.employeeCode=u.distributionCustomerEmployeeCode",null);
				if (customerCodes.size()!=0) {
					//强制
					Object[] object =(Object[])customerCodes.get(0);
					dao.executeSql("update t_crm_owner a SET a.customerCode='"+object[1]+"' where a.id= "+ owner.getId(),null);
				}else{
					//按照比例
					List<UserSaler> find = dao.find("FROM UserSaler WHERE type='customer'");
					if (find!=null && find.size()>0) {
						List list = dao.executeQuerySql("select  SUm(s.proportion) FROM t_bss_user_saler s where s.type='customer'  ", null);
						String [] usersaler=new String [Integer.valueOf(list.get(0)+"")];
						int emp=0;
						for (UserSaler saler : find) {
							for (int i = 0+emp; i < saler.getProportion()+emp; i++) {
								usersaler[i]=saler.getName();
							}
							emp+=saler.getProportion();
						}
						System.out.println(usersaler);
						int random = (int) ( Math.random () * usersaler.length );
						List<UserSaler> salers = dao.find("FROM UserSaler s WHERE s.name='"+usersaler[random]+"' and s.type='customer' ");
						dao.executeSql("update t_crm_owner a SET a.customerCode='"+salers.get(0).getEmployeeCode()+"' where a.id= "+ owner.getId(),null);
					}
				}

				
			}
		}
		
		
		Object[] obj = { owner.getId() };
		
		dao.executeSql(
				"insert into t_fms_chart_of_account (id,ownerId,coaClass,allowInput,createBy,createDate,currValue,debitCredit,display,enabled,entryDateTime,frTemplate,hardCode,debitAmt,creditAmt,balance,iniValue,lastUpdateBy,lastUpdateDate,name,parentId,ref,creditCashFlow_id,debitCashFlow_id,level)"
						+ " select id,? ownerId,coaClass,allowInput,createBy,createDate,0 currValue,debitCredit,'unlimited' display,enabled,entryDateTime,frTemplate,hardCode,0 debitAmt,0 creditAmt,0 balance,0 iniValue,lastUpdateBy,lastUpdateDate,name,parentId,ref,creditCashFlow_id,debitCashFlow_id,level"
						+ " from t_fms_chart_of_account where ownerId = -1 ",
				obj);
		Account ac = new Account();
		ac.setAmount(BigDecimal.ZERO);
		ac.setOwnerId(owner.getId());
		ac.setAccountCode(owner.getLoginId());
		ac.setCreateBy(owner.getLoginId());
		ac.setCreateDate(owner.getCreateDate());
		ac.setLastUpdateBy(owner.getLastUpdateBy());
		ac.setLastUpdateDate(owner.getLastUpdateDate());
		dao.saveNoSetDefaultValue(ac);
		logger.info("end  createRegInfoAll. [ id =" + user.getId() + "]");
		return true;
	}
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateLoginById(Map<String, String> flagMap) {
		
		Long ownerId = Long.parseLong(flagMap.get("ownerId"));
		Owner owner = (Owner) dao.getObject(Owner.class, ownerId, LockMode.UPGRADE_NOWAIT);
		if (DateUtil.parse((String) flagMap.get("startMonth"), "yyyy-MM") == null)
			throw new OperationException("日期格式错误！");
		
		List<AccountPeriod> date = dao.find("from AccountPeriod where ownerId = "+ ownerId+" ORDER BY accountPeriodMonth ");
		
		if (DateUtil.compareMonth((String) flagMap.get("startMonth"),  date.get(0).getAccountPeriodMonth()) > 0)
			throw new OperationException("账期起始月不能大于之前设置的日期！");
		
		owner.getEnterpriseInfo().setName((String) flagMap.get("enterpriseName"));
		owner.getEnterpriseInfo().setTaxCode((String) flagMap.get("enterpriseTaxCode"));
		owner.setVat(Long.valueOf(flagMap.get("vat")));
		
		Owner o = (Owner) dao.update(owner);
		if(o==null){
			return false;
		}
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateTaxCodeByName(Map<String, String> flagMap) {
		Object[] par=new Object[2];
		par[0]=(String) flagMap.get("taxCode");
		par[1]=(String) flagMap.get("name");
		dao.executeSql("update t_crm_owner a SET a.taxCode = ? where a.loginId = ?",par);
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Remark> getRemark(String id) {
		logger.info("begin getRemark. ");
		List<Remark> remark  = dao.find("SELECT o.remark FROM Owner o WHERE o.id='"+id+"'");
		logger.info("end getRemark. ");
		return remark;
	}
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<OwnerDetailsVo> getOwnerDetails(String num,String type, String sales_id, BasePagerObject bso) {
		logger.info("begin getOwnerDetails");

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
				"LEFT JOIN t_bss_remark re ON re.owner_id = o.id\n";
			if(num.equals("0")){
				sql+="WHERE	o.sales_id = "+sales_id+" ";
			}else if(num.equals("1")){
				sql+="WHERE	o.customerCode = '"+sales_id+"' ";
			}
				
		String group=" GROUP BY o.id ORDER BY o.createDate DESC";
		List withSQL=new ArrayList<>();
		long count = 0;
		if (type.equals("success")) {
			withSQL = dao.getLst4PagingWithSQL(select+sql+conStr+group,  new int[] { bso.getPagenum(), bso.getPagesize() });
			count = dao.getCount4PagingWithSQL("SELECT COUNT(DISTINCT o.id) "+sql+conStr);
		}
		if (type.equals("paid")) {
			String sqe="select t.*,cli.client FROM ("+select+sql+conStr+group+"	) t LEFT JOIN ( SELECT o.ownerId AS client FROM t_bss_order o\n" +
					"	LEFT JOIN t_crm_owner c ON c.id = o.ownerId\n" +
					"	WHERE o.payStatus = 'paid'  ";
			if(num.equals("0")){
				sqe+="AND	c.sales_id = "+sales_id+" ";
			}else if(num.equals("1")){
				sqe+="AND	c.customerCode = '"+sales_id+"' ";
			}
			sqe+="	GROUP BY o.ownerId) cli ON cli.client = t.id WHERE cli.client IS NOT NULL ORDER BY t.createDate DESC";
			withSQL = dao.getLst4PagingWithSQL(sqe,  new int[] { bso.getPagenum(), bso.getPagesize() });
			String sqa="select count(t.id) FROM ("+select+sql+conStr+group+"	) t LEFT JOIN ( SELECT o.ownerId AS client FROM t_bss_order o\n" +
					"	LEFT JOIN t_crm_owner c ON c.id = o.ownerId\n" +
					"	WHERE o.payStatus = 'paid'  ";
			if(num.equals("0")){
				sqa+="AND	c.sales_id = "+sales_id+" ";
			}else if(num.equals("1")){
				sqa+="AND	c.customerCode = '"+sales_id+"' ";
			}
				sqa+="	GROUP BY o.ownerId) cli ON cli.client = t.id WHERE cli.client IS NOT NULL";
			count = dao.getCount4PagingWithSQL(sqa);
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
	public BaseModelList<Owner> getOwnerList(String num,BasePagerObject bso) {
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String uname=(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		List<User> user1 = dao.find(" from User where username = '"+uname+"'");
		String sqlsst="";
		if(roles.contains("salesManage")){
			sqlsst=" AND r.id = '7' and u.id='"+user1.get(0).getId()+"'";
		}else if(roles.contains("secondLevelSalesManage")){
			sqlsst=" AND r.id = '9' and u.id='"+user1.get(0).getId()+"'";
		}
		if(num.equals("0")){
			if(roles.contains("Sys_Admin")){
				sqlsst=" AND r.id in (3,7,9) ";
			}
		}else if(num.equals("1")){
			if(roles.contains("Sys_Admin")){
				sqlsst=" AND r.id in (6,8,10) ";
			}
		}
		
		
		if(roles.contains("customerManage")){
			sqlsst=" AND r.id = 8 and u.id="+user1.get(0).getId()+"";
		}else if(roles.contains("secondLevelCustomerManage")){
			sqlsst=" AND r.id = 10 and u.id="+user1.get(0).getId()+"";
		}
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = "SELECT u.employeeCode FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur "
				+ "WHERE ur.userid = u.id AND ur.roleid = r.id "+sqlsst;
		List<String> list = (List<String>) dao.executeQuerySql(sql, null);
		if(list.size()>0){
			String[] arr = (String[])list.toArray(new String[list.size()]);
			for(int i=0;i<arr.length;i++){
				String temp=arr[i];
				arr[i]="'"+temp+"'";
			}
			String se=Arrays.toString(arr);
			String newStr = se.replaceAll("\\[","(");
			String newStr2 = newStr.replaceAll("]",")");
			String hql="";
			if(roles.contains("salesManage")||roles.contains("secondLevelSalesManage")){
				hql="from Owner where sales.employeeCode in "+newStr2+conStr;
			}
			if(num.equals("0")){
				//admin登录拉出来所有张沂飞2017年5月31日 10:49:36
				if(roles.contains("Sys_Admin")){
					hql="from Owner where id>1 "+conStr;
				}
			}else if(num.equals("1")){
				//admin登录拉出来所有张沂飞2017年5月31日 10:49:36
				if(roles.contains("Sys_Admin")){
					hql="from Owner where id>1 "+conStr;
				}
			}
			if(roles.contains("customerManage")||roles.contains("secondLevelCustomerManage")){
				hql="from Owner where customerCode in "+newStr2+conStr;
			}
			List<Owner> li=dao.getLst4Paging(hql, new int[] { bso.getPagenum(), bso.getPagesize() });
			Long count = dao.getCount4Paging("SELECT COUNT(DISTINCT id) "+hql);
			BaseModelList<Owner> lists=new BaseModelList<Owner>(count,WebUtil.getEntryListFromProxyList(li, dao));
			return lists;
		}
		return null;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean writeownerlist(String ids,Long id,String employeeCode,String num) {
		if(num.equals("0")){
			if(ids!=null&&ids!=""){
				String[] st=ids.split(",");
				for(int s=0;s<st.length;s++){
					if(st[s]!=null&&st[s]!=""){
						dao.executeSql("update t_crm_owner o set o.sales_id="+id+",o.employeeCode='"+employeeCode+"'  WHERE o.id="+st[s]+" ",null);
				
					}
				}
			}
		}else if(num.equals("1")){
			if(ids!=null&&ids!=""){
				String[] st=ids.split(",");
				for(int s=0;s<st.length;s++){
					if(st[s]!=null&&st[s]!=""){
						dao.executeSql("update t_crm_owner o set o.customerCode='"+employeeCode+"'  WHERE o.id="+st[s]+" ",null);
				
					}
				}
			}
		}
		
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Map<String, String> getIsOrNoRemarkOwner(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition) {
		Map<String, String> map = new HashMap<String, String>();
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
//		int size = userCondition.getPagesize();
//		if(conStr.equals(""))
//			size=99999999;
		Long countremark = 0L;
		Long countlebal = 0L;
		Long countlebalall = 0L;
		Long countbalance = 0L;
		String startAmtsql = "";
		String endAmtsql = "";
		if(roles.contains("Sys_Admin")){
			String sql = "   SELECT owner0.id ";
			String sqlStr = " FROM t_crm_owner owner0  LEFT OUTER JOIN t_crm_enterprise_info enterprise1 ON owner0.enterpriseInfo_id=enterprise1.id "
					+ " LEFT OUTER JOIN t_crm_user_info enterprise ON enterprise1.id=enterprise.id LEFT  JOIN t_biz_billingrecord billingrec ON "
					+ "  (billingrec.status = 'paid' or billingrec.status = 'offline') AND billingrec.ownerId=owner0.id WHERE owner0.id>1 "+conStr ;
			
			String sqlcuont = "select count(distinct owner0.id) ";
			Long count = dao.getCount4PagingWithSQL(sqlcuont + sqlStr);
			int size = count.intValue();
			if (startAmt.compareTo(BigDecimal.ZERO) == 0 && endAmt.compareTo(BigDecimal.ZERO) == 0) {
			} else {
				startAmtsql = " and  SUM(billingrec.amount) >= " +startAmt;
				endAmtsql = " and  SUM(billingrec.amount) <= " + endAmt;
				List list=dao.getLst4PagingWithSQL(sql + sqlStr + " GROUP BY owner0.id HAVING(1=1"+startAmtsql+endAmtsql+") ORDER BY owner0.createDate DESC ",new int[]{ 0,999999999});
				count = (long) list.size();
			}
			List list = dao.getLst4PagingWithSQL(
					sql + sqlStr + " GROUP BY owner0.id HAVING(1=1"+startAmtsql+endAmtsql+") ORDER BY owner0.createDate DESC ",
					new int[] { userCondition.getPagenum(), size });
			String ids = "in (";
			for(int i=0;i<list.size();i++){
				ids=ids+list.get(i).toString()+",";
			}
			ids=ids.substring(0,ids.length()-1)+")";
			List listlebal = new ArrayList();
			if(list.size()>0){
				countremark=dao.getCount4PagingWithSQL("select count(distinct t.owner_id) from t_bss_remark t where t.owner_id "+ids);
				listlebal = dao.getLst4PagingWithSQL(" select DISTINCT t.owner_id from t_bss_remark t where t.owner_id is not null and t.owner_id "+ids, new int[]{ 0,999999999});
			}
			String ownerids = "in (";
			for(int i=0;i<listlebal.size();i++){
				ownerids=ownerids+listlebal.get(i).toString()+",";
			}
			ownerids=ownerids.substring(0,ownerids.length()-1)+")";
			if(listlebal.size()>0)
				countlebalall=dao.getCount4PagingWithSQL("select count(distinct owner0.id) from t_crm_owner owner0 where owner0.lebal is not null and owner0.id "+ownerids+" ");
			if(list.size()>0){
				countlebal=dao.getCount4PagingWithSQL("select count(distinct owner0.id) from t_crm_owner owner0 where owner0.lebal is not null and owner0.id "+ids+" ");
			}
			countremark=countremark+countlebal-countlebalall;
			countbalance=count-countremark;
		}
		if(roles.contains("salesStaff")||roles.contains("salesManage")||roles.contains("secondLevelSalesManage")){
			List<User> users = dao.find(
					"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			List<User> user = dao.find("from User where parentEmployeeCode = '" + users.get(0).getEmployeeCode() + "' and employeeCode is not null");
			String code = " in('" + users.get(0).getEmployeeCode() + "',";
			if (user.size() > 0) {
				for (User use : user) {
					code = code +"'"+ use.getEmployeeCode() + "',";
				}
			}
			if (roles.contains("salesManage")) {
				List ecode = dao
						.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u where u.parentEmployeeCode = '"
								+ users.get(0).getEmployeeCode() + "' and u.employeeCode is not null  ", null);
				if (ecode.size() > 0) {
					for (int i = 0; i < ecode.size(); i++) {
						code = code +"'"+ ecode.get(i).toString() + "',";
						List eccode = dao.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u WHERE "
								+ "  u.parentEmployeeCode = '" + ecode.get(i).toString() + "' and employeeCode is not null ", null);
						if (eccode.size() > 0 && eccode != null) {
							for (int j = 0; j < eccode.size(); j++) {
								code = code +"'"+ eccode.get(j).toString() + "',";
							}
						}
					}
				}
			}
			code = code.substring(0, code.length() - 1) + ")";
			String sql = "   SELECT owner0.id ";
			String sqlStr = " FROM t_crm_owner owner0  LEFT OUTER JOIN t_crm_enterprise_info enterprise1 ON owner0.enterpriseInfo_id=enterprise1.id "
					+ " LEFT OUTER JOIN t_crm_user_info enterprise ON enterprise1.id=enterprise.id LEFT  JOIN t_biz_billingrecord billingrec ON "
					+ "   (billingrec.status = 'paid' or billingrec.status = 'offline') AND billingrec.ownerId=owner0.id WHERE owner0.employeeCode "
					+ code + " and owner0.id>1 " +conStr ;

			String sqlcuont = "select count(distinct owner0.id) ";
			Long count = dao.getCount4PagingWithSQL(sqlcuont + sqlStr);
			int size = count.intValue();
			if (startAmt.compareTo(BigDecimal.ZERO) == 0 && endAmt.compareTo(BigDecimal.ZERO) == 0) {
			} else {
				startAmtsql = " and  SUM(billingrec.amount) >= " + startAmt;
				endAmtsql = " and  SUM(billingrec.amount) <= " + endAmt;
				List list = dao.getLst4PagingWithSQL(sql + sqlStr + " GROUP BY owner0.id HAVING(1=1"
						+ startAmtsql + endAmtsql + ") ORDER BY owner0.createDate DESC ", new int[] { 0, 999999999 });
				count = (long) list.size();
			}
			List  list = dao.getLst4PagingWithSQL(
					sql + sqlStr + " GROUP BY owner0.id HAVING(1=1" + startAmtsql + endAmtsql
							+ ") ORDER BY owner0.createDate DESC ",
					new int[] { userCondition.getPagenum(), size });
			String ids = "in (";
			for(int i=0;i<list.size();i++){
				ids=ids+list.get(i).toString()+",";
			}
			ids=ids.substring(0,ids.length()-1)+")";
			List listlebal = new ArrayList();
			if(list.size()>0){
				countremark=dao.getCount4PagingWithSQL("select count(distinct t.owner_id) from t_bss_remark t where t.owner_id "+ids);
				listlebal = dao.getLst4PagingWithSQL(" select DISTINCT t.owner_id from t_bss_remark t where t.owner_id is not null and t.owner_id "+ids, new int[]{ 0,999999999});
			}
			String ownerids = "in (";
			for(int i=0;i<listlebal.size();i++){
				ownerids=ownerids+listlebal.get(i).toString()+",";
			}
			ownerids=ownerids.substring(0,ownerids.length()-1)+")";
			if(listlebal.size()>0)
				countlebalall=dao.getCount4PagingWithSQL("select count(distinct owner0.id) from t_crm_owner owner0 where owner0.lebal is not null and owner0.id "+ownerids+" ");
			if(list.size()>0){
				countlebal=dao.getCount4PagingWithSQL("select count(distinct owner0.id) from t_crm_owner owner0 where owner0.lebal is not null and owner0.id "+ids+" ");
			}
			countremark=countremark+countlebal-countlebalall;
			countbalance=count-countremark;
		}
		if(roles.contains("customerService")||roles.contains("customerManage")||roles.contains("secondLevelCustomerManage")){
			List<User> users = dao.find(
					"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			List<User> user = dao.find("from User where parentEmployeeCode = '" + users.get(0).getEmployeeCode() + "' and employeeCode is not null");
			String code = " in('" + users.get(0).getEmployeeCode() + "',";
			if (user.size() > 0) {
				for (User use : user) {
					code = code +"'"+ use.getEmployeeCode() + "',";
				}
			}
			if (roles.contains("customerManage")) {
				List ecode = dao
						.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u where u.parentEmployeeCode = '"
								+ users.get(0).getEmployeeCode() + "' and u.employeeCode is not null ", null);
				if (ecode.size() > 0) {
					for (int i = 0; i < ecode.size(); i++) {
						code = code +"'"+ ecode.get(i).toString() + "',";
						List eccode = dao.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u WHERE "
								+ "  u.parentEmployeeCode = '" + ecode.get(i).toString() + "' and u.employeeCode is not null ", null);
						if (eccode.size() > 0 && eccode != null) {
							for (int j = 0; j < eccode.size(); j++) {
								code = code +"'"+ eccode.get(j).toString() + "',";
							}
						}
					}
				}
			}
			code = code.substring(0, code.length() - 1) + ")";
			String sql = "   SELECT owner0.id ";
			String sqlStr = " FROM t_crm_owner owner0  LEFT OUTER JOIN t_crm_enterprise_info enterprise1 ON owner0.enterpriseInfo_id=enterprise1.id "
					+ " LEFT OUTER JOIN t_crm_user_info enterprise ON enterprise1.id=enterprise.id LEFT  JOIN t_biz_billingrecord billingrec ON "
					+ "   (billingrec.status = 'paid' or billingrec.status = 'offline') AND billingrec.ownerId=owner0.id WHERE owner0.customerCode "
					+ code + " and owner0.id>1 " +conStr;

			String sqlcuont = "select count(distinct owner0.id) ";
			Long count = dao.getCount4PagingWithSQL(sqlcuont + sqlStr);
			int size = count.intValue();
			if (startAmt.compareTo(BigDecimal.ZERO) == 0 && endAmt.compareTo(BigDecimal.ZERO) == 0) {
			} else {
				startAmtsql = " and  SUM(billingrec.amount) >= " + startAmt;
				endAmtsql = " and  SUM(billingrec.amount) <= " + endAmt;
				List list = dao.getLst4PagingWithSQL(sql + sqlStr + " GROUP BY owner0.id HAVING(1=1"
						+ startAmtsql + endAmtsql + ") ORDER BY owner0.createDate DESC ", new int[] { 0, 999999999 });
				count = (long) list.size();
			}
			List  list = dao.getLst4PagingWithSQL(
					sql + sqlStr + " GROUP BY owner0.id HAVING(1=1" + startAmtsql + endAmtsql
							+ ") ORDER BY owner0.createDate DESC ",
					new int[] { userCondition.getPagenum(),size });
			String ids = "in (";
			for(int i=0;i<list.size();i++){
				ids=ids+list.get(i).toString()+",";
			}
			ids=ids.substring(0,ids.length()-1)+")";
			List listlebal = new ArrayList();
			if(list.size()>0){
				countremark=dao.getCount4PagingWithSQL("select count(distinct t.owner_id) from t_bss_remark t where t.owner_id "+ids);
				listlebal = dao.getLst4PagingWithSQL(" select DISTINCT t.owner_id from t_bss_remark t where t.owner_id is not null and t.owner_id "+ids, new int[]{ 0,999999999});
			}
			String ownerids = "in (";
			for(int i=0;i<listlebal.size();i++){
				ownerids=ownerids+listlebal.get(i).toString()+",";
			}
			ownerids=ownerids.substring(0,ownerids.length()-1)+")";
			if(listlebal.size()>0)
				countlebalall=dao.getCount4PagingWithSQL("select count(distinct owner0.id) from t_crm_owner owner0 where owner0.lebal is not null and owner0.id "+ownerids+" ");
			if(list.size()>0){
				countlebal=dao.getCount4PagingWithSQL("select count(distinct owner0.id) from t_crm_owner owner0 where owner0.lebal is not null and owner0.id "+ids+" ");
			}
			countremark=countremark+countlebal-countlebalall;
			countbalance=count-countremark;
		}
		map.put("isRemark", countremark.toString());
		map.put("noRemark", countbalance.toString());
		return map;
	}

	@Override
	@Transactional(readOnly=false,propagation=Propagation.REQUIRED)
	public PayRemark createPayRemark(PayRemark payRemark) {
		if(payRemark.getOwner()!=null&&payRemark.getOwner().getId()!=null){
			payRemark = (PayRemark) dao.save(payRemark);
		}else{
			throw new OperationException("没绑定客户！");
		}
		if(payRemark.getType().equals("pay")){
			dao.executeHql("update Owner set paidType='paytrue' where id= "+payRemark.getOwner().getId(), null);
		}else{
			Owner ow = (Owner) dao.getObject(Owner.class,payRemark.getOwner().getId());
			String  paidType = "paytruewait";
			dao.executeHql("update Owner set paidType='"+paidType+"' where id= "+payRemark.getOwner().getId(), null);
		}
		return payRemark;
	}
	
	@Override
	@Transactional(readOnly=false,propagation=Propagation.REQUIRED)
	public Boolean updatePayRemark(PayRemark payRemark) {
		PayRemark pr = (PayRemark) dao.getObject(PayRemark.class,payRemark.getId());
		payRemark.setOwner(pr.getOwner());
		payRemark = (PayRemark) dao.update(payRemark);
		return true;
	}
	
	@Override
	@Transactional(readOnly=false,propagation=Propagation.REQUIRED)
	public Boolean deletePayRemark(Long id) {
		dao.removeObject(PayRemark.class, id);
		return true;
	}
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<PayRemark> getAllPayRemark(Long ownerId,String type,BasePagerObject bso) {
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		List<PayRemark> list = dao.getLst4Paging("from PayRemark where owner.id = "+ownerId+" and type = '"+type+"' "+conStr+" ORDER BY lastUpdateDate DESC ", new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging("SELECT COUNT(id) from PayRemark where owner.id = "+ownerId+" and type = '"+type+"' "+conStr);
		BaseModelList<PayRemark> lists = new BaseModelList<PayRemark>(count, WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}
	
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Boolean sendEmail(String qq,Long ownerId, String startDate,String endDate,BigDecimal amt) throws Exception{
		 Owner ow = (Owner) dao.getObject(Owner.class, ownerId);
		 List<PayRemark> list  = dao.find(" from PayRemark where owner.id = "+ownerId+" order by createDate desc ");
		 Date date = new Date();
		 if(list.size()>0){
			 date =list.get(0).getEndDate();
		 }
		receiveMailAccount=qq;
		Properties props = new Properties();  
		MailSSLSocketFactory sf = new MailSSLSocketFactory();
		sf.setTrustAllHosts(true);
		props.put("mail.smtp.ssl.enable", "true");
		props.put("mail.smtp.ssl.socketFactory", sf);
		props.setProperty("mail.transport.protocol", "smtp");  
		props.setProperty("mail.smtp.host", myEmailSMTPHost); 
		props.setProperty("mail.smtp.auth", "true"); 
		Session session = Session.getDefaultInstance(props);
        session.setDebug(true);  
        MimeMessage message = createMimeMessage(session, myEmailAccount, receiveMailAccount,ow.getEnterpriseInfo().getName(),startDate,endDate,date,amt);
        Transport transport = session.getTransport();
        transport.connect(myEmailAccount, myEmailPassword);
        transport.sendMessage(message, message.getAllRecipients());
        transport.close();
		return true;
	}
	
	private MimeMessage createMimeMessage(Session session, String sendMail, String receiveMail, String name,
			String startDate, String endDate, Date date, BigDecimal amt) throws Exception {

		// 1. 创建一封邮件
		MimeMessage message = new MimeMessage(session);
		// 2. From: 发件人
		message.setFrom(new InternetAddress(sendMail, "代理报税", "UTF-8"));
		// 3. To: 收件人（可以增加多个收件人、抄送、密送）
		message.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(receiveMail, "用户", "UTF-8"));
		// 4. Subject: 邮件主题
		message.setSubject("关于收费", "UTF-8");
		// 5. Content: 邮件正文（可以使用html标签）
		message.setContent("尊敬的客户您好，贵司（" + name + "）代理记账服务费于" + DateUtil.format(date, "yyyy-MM-dd") + "已到期，烦请安排"
				+ startDate + "至" + endDate + " 代理记账费用" + amt + "Rmb，谢谢！", "text/html;charset=UTF-8");
		// 6. 设置发件时间
		message.setSentDate(new Date());
		// 7. 保存设置
		message.saveChanges();
		return message;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public UserInfoForListVO getOwnerInfomation(Long ownerId) {
		Owner ow = (Owner) dao.getObject(Owner.class, ownerId);
		UserInfoForListVO vo = new  UserInfoForListVO();
		vo.setCategory1(ow.getCategory1());
		vo.setCategory2(ow.getCategory2());
		vo.setId(ow.getId());
		return vo;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<SearchOwnerListvo> getUserInfomation() {
		
		String sql = "   SELECT owner0.id,owner0.loginId,enterprise.name";
		String sqlStr = " FROM t_crm_owner owner0  "
				+ " LEFT  JOIN t_crm_user_info enterprise ON enterprise.id=owner0.enterpriseInfo_id WHERE owner0.id>1 " ;
		List<OcrSearchUserBuyListVo> list = dao.getLst4PagingWithSQL(sql+sqlStr, new int[]{0,999999999});
		List<SearchOwnerListvo> listVO = new ArrayList<SearchOwnerListvo>();
		for (Object rsArray : list) {
			SearchOwnerListvo vo = new SearchOwnerListvo((Object[]) rsArray,null);
			listVO.add(vo);
		}
		return listVO;
	}

}













