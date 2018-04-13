package com.zqw.bss.service.biz.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.biz.OcrEnclosureOrder;
import com.zqw.bss.model.biz.OcrSaleOrder;
import com.zqw.bss.model.biz.OcrSaleOrderDetail;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.biz.ApprovalStatusService;
import com.zqw.bss.service.biz.OverviewService;
import com.zqw.bss.util.SymbolUtil;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.biz.OrderSalesLogs;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.biz.SalesOrderLogVo;
import com.zqw.bss.vo.biz.WaitOrderListVo;

@Service
@Qualifier("overviewService")
public class OverviewServiceImpl implements OverviewService {
	private final Logger logger = Logger.getLogger(OverviewServiceImpl.class);
	 
	@Autowired
	protected DAO dao;
	@Autowired
	protected ApprovalStatusService approvalStatusService;

	/**
	 * search 是查询
	 * export 是导出
	 */ 
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public BaseModelList<SalesOrderListVo> getSimpleSalesOrderVo(BasePagerObject bso,String type) {
		logger.info("begin  getSimpleSalesOrderVo:[ id ="+WebUtil.getLogBasicString()+"]");
		System.out.println("begin  getSimpleSalesOrderVo:[ id =" + WebUtil.getLogBasicString() + "]");
		bso = SymbolUtil.disposeBasePagerObject(bso);
		// 排序
		String orderBy = " GROUP BY UUID ,logsum.orderNumber ,serviceType ,orderType ,responsibleName ,telephone ,userName ,ownerName,id ,soOwnerId ,"
				+ " ocrCount ,submitDate ,orderSuccessDate ,orderSubmitDate,checkSuccessDate,completeDate,checkName,checkAgainSuccessDate,checkAgainSuccessDate ";
		String conStr = "";
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		System.out.println(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES));
		Map<String, Object> paramMaps = new HashMap<String, Object>();
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_createBy]")){
			conStr +=" AND ( bsssysuser.username = :username  or logsum.orderApprovalStatus ='stayOrder' )";
			paramMaps.put("username", username);
		}
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_auditor]")){
			conStr +=" AND logsum.orderApprovalStatus NOT IN ('KHSubmitAgain', 'orderSuccess','stayOrder') AND logsum.orderApprovalStatus NOT IN ('complete', 'KHBackout')  ";
			conStr +=" AND  CASE WHEN bsssysuser3.username IS NULL THEN 1=1 ELSE  bsssysuser3.username = :checkname END ";
			paramMaps.put("checkname", username);
		}
		List<com.zqw.bss.framework.vo.Condition> condition = bso.getCondition();
		List<com.zqw.bss.framework.vo.Condition> condition2 = new ArrayList<>();
		for (com.zqw.bss.framework.vo.Condition con : condition) {
			if (con.getValue().length != 0 && !con.getKey().equals("undefined")) {
				if (con.getKey().equals("logsum.orderApprovalStatus")) {
					conStr += " AND logsum.orderApprovalStatus = '" + con.getValue()[0] + "'";
				}
				if (con.getKey().equals("orderNumber")) {
					conStr += " AND logsum.orderNumber LIKE '%" + con.getValue()[0] + "%'";
				}
				if (con.getKey().equals("serviceType")) {
					conStr += " AND serviceType = '" + con.getValue()[0] + "'";
				}
				if (con.getKey().equals("orderType")) {
					conStr += " AND orderType LIKE '%" + con.getValue()[0] + "%'";
				}
				if (con.getKey().equals(" CONCAT(userinfo2.name,'(', bsssysuser.username,')') ")) {
					conStr += " AND  CONCAT(userinfo2.name,'(', bsssysuser.username,')') LIKE '%" + con.getValue()[0]
							+ "%'";
				}
				if (con.getKey().equals("userinfo.telephone")) {
					conStr += " AND userinfo.telephone LIKE '%" + con.getValue()[0] + "%'";
				}
				if (con.getKey().equals("sysuser.userName")) {
					conStr += " AND sysuser.userName LIKE '%" + con.getValue()[0] + "%'";
				}
				if (con.getKey().equals("userinfoe.name")) {
					conStr += " AND userinfoe.name LIKE '%" + con.getValue()[0] + "%'";
				}
				condition2.add(con);
			}
		}
		// 搜索条件
		if (bso.getSortdatafield() != null && bso.getSortorder() != null) {
			orderBy += " order by " + bso.getSortdatafield() + " " + bso.getSortorder();
		}else {
			orderBy +=	"  order by orderType DESC , serviceType  ,submitDate ASC ";
			if(condition!=null&&condition.size()==0){
				conStr += " and logsum.orderApprovalStatus not in ( 'complete','KHBackout') ";
			}
		}
		bso.setCondition(condition2);
		conStr += HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = " SELECT " + " logsum.orderNumber AS orderNumber," + " logsum.serviceType AS serviceType ,"
				+ " logsum.orderApprovalStatus AS orderType ," + " logsum.createDate AS submitDate ,"
				+ " logsum.orderSuccessDate AS orderSuccessDate, " + " logsum.orderSubmitDate AS orderSubmitDate "
				+ " , CASE  WHEN logsum.checkAgainSuccessDate  IS NULL THEN logsum.checkSuccessDate  ELSE logsum.checkAgainSuccessDate END AS checkSuccessDate " 
				+ " , " + " logsum.completeDate AS completeDate "
				+ " , CONCAT(userinfo2.name,'(', bsssysuser.username,')')  AS responsibleName , "
				+ " userinfo.telephone AS telephone, " + " sysuser.username AS userName , " 
				+ " userinfoe.name AS ownerName , " + " logsum.salesOrder_id AS id , " + " logsum.ownerId AS soOwnerId  , logsum.id  as uuid "
				+ " , COUNT(ocrdetail.id) AS detailQty"
				+ " , logsum.ocrCount , logsum.checkBeginDate " 
				+ " , CONCAT(userinfo3.name, '(', bsssysuser3.username, ')') AS checkName "
				+ " , logsum.checkAgainBeginDate "
				+ " ,logsum.checkAgainSuccessDate AS checkAgainSuccessDate "
				+ " FROM " + " t_simple_sales_order_log_sum logsum "
				+ " LEFT JOIN t_ocr_saleorder ocrorder ON (ocrorder.uuid = logsum.id) "
				+ " LEFT JOIN t_ocr_saleorderdetail ocrdetail ON (ocrdetail.sales_id = ocrorder.id) " 
				+ " LEFT JOIN t_sys_user sysuser ON (sysuser.id = logsum.user_id) "
				+ " LEFT JOIN t_crm_user_info userinfo ON (userinfo.id = sysuser.userInfo_id) "
				+ " LEFT JOIN t_bss_sys_user bsssysuser ON (bsssysuser.id = logsum.customerServiceId) "
				+ " LEFT JOIN t_crm_user_info userinfo2 ON (userinfo2.id = bsssysuser.userInfo_id) "
				+ " LEFT JOIN t_bss_sys_user bsssysuser3 ON ( bsssysuser3.id = logsum.customerCheckId) "
				+ " LEFT JOIN t_crm_user_info userinfo3  ON (userinfo3.id = bsssysuser3.userInfo_id) "
				+ " LEFT JOIN t_crm_owner towner ON (towner.id = logsum.ownerId) "
				+ " LEFT JOIN t_crm_user_info userinfoe ON (userinfoe.id = towner.enterpriseInfo_id) where 1=1  ";
		String sqlAccout = "select count(*) from (" + sql + conStr + orderBy + " ) t ";
		Query queryCount = dao.getHibSession().createSQLQuery(sqlAccout);
		dao.bindParamToQueryByName(queryCount, paramMaps);
		Long count =Long.valueOf(queryCount.list().get(0).toString());
		int i = bso.getPagesize();
		if("export".equals(type)){//如果是到处就取所有的
			i = Integer.parseInt(count.toString());
		}else{
			i = bso.getPagesize();
		}
		int startNum = bso.getPagesize() * (bso.getPagenum());
		int pageSize = bso.getPagesize();
		String limitString = " limit " + startNum + "," + pageSize;
		Query queryCountList= dao.getHibSession().createSQLQuery(sql + conStr + orderBy+limitString);
		dao.bindParamToQueryByName(queryCountList, paramMaps);
		List<SalesOrderListVo> listvo = queryCountList.list();
		List<SalesOrderListVo> list = new ArrayList<SalesOrderListVo>();
		for (Object array : listvo) {
			SalesOrderListVo vo = new SalesOrderListVo((Object[]) array);
			list.add(vo);
		}
		BaseModelList<SalesOrderListVo> lists = new BaseModelList<SalesOrderListVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		System.out.println("end  getSimpleSalesOrderVo:[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;
	}
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Map<String, String> getUserName() {
		String sql = " SELECT " + " DISTINCT " + " sysuser.username AS userName , " + " userinfoe.name AS ownerName "
				+ "  FROM " + " t_simple_sales_order_log_sum logsum "
				+ " LEFT JOIN t_simple_sales_order so ON (so.id = logsum.salesOrder_id) "
				+ " LEFT JOIN t_sys_user sysuser ON (sysuser.id = logsum.user_id) LEFT JOIN t_crm_user_info userinfo ON (userinfo.id = sysuser.userInfo_id) "
				+ " LEFT JOIN t_bss_sys_user bsssysuser ON (bsssysuser.id = logsum.customerServiceId)LEFT JOIN t_crm_user_info userinfo2 ON (userinfo2.id = bsssysuser.userInfo_id) "
				+ " LEFT JOIN t_crm_owner towner ON (towner.id = so.ownerId)  JOIN t_crm_user_info userinfoe ON (userinfoe.id = towner.enterpriseInfo_id) ";
		Map<String, String> maps = new HashMap<String, String>();
		List list = dao.executeQuerySql(sql, null);
		for (Object o : list) {
			Object[] c = (Object[]) o;
			maps.put(c[0].toString(), c[1].toString());
		}
		return maps;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SalesOrderLogVo> searchLogInfo(BasePagerObject bso) {
		SimpleDateFormat formatter = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss:SSS");
		System.out.println("业务日志接口开始时间"+formatter.format(new Date()));
		bso = SymbolUtil.disposeBasePagerObject(bso);
		// 排序
		String orderBy = " order by handleDate desc ";
		String conStr = "";
		// 搜索条件
		List<com.zqw.bss.framework.vo.Condition> condition = bso.getCondition();
		List<com.zqw.bss.framework.vo.Condition> condition2 = new ArrayList<>();
		for (com.zqw.bss.framework.vo.Condition con : condition) {
			if (con.getValue().length != 0 && !con.getKey().equals("undefined")) {
				if (con.getKey().equals("logd.createBy")) {
					conStr += " AND logd.createBy LIKE '%" + con.getValue()[0] + "%'";
				}
				if (con.getKey().equals("handletype")) {
					conStr += " AND handletype LIKE '%" + con.getValue()[0] + "%'";
				}
				if (con.getKey().equals("orderNumber")) {
					conStr += " AND orderNumber LIKE '%" + con.getValue()[0] + "%'";
				}

				// 时间
				if (con.getKey().equals("beginHandleDate")) {
					conStr += " AND handleDate >= " + con.getValue()[0] + "";
				}
				if (con.getKey().equals("endHandleDate")) {
					conStr += " AND handleDate <= " + con.getValue()[0] + "";
				}

				condition2.add(con);
			}
		}
		bso.setCondition(condition2);
		conStr += HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = " SELECT "
				+ " logd.createBy,logd.handleDate,logd.handletype, logsum.orderNumber  as orderNumber , IFNULL (logsum.salesOrder_id,-1) as id ,logd.link "
				+ " FROM  t_simple_sales_order_log logd LEFT JOIN t_simple_sales_order_log_sum logsum ON ( logsum.id = logd.uuid )  "
				+ " WHERE logd.link  IS NULL ";
		List<SalesOrderLogVo> listvo = dao.getLst4PagingWithSQL(sql + conStr + orderBy,
				new int[] { bso.getPagenum(), bso.getPagesize() });
		List<SalesOrderLogVo> list = new ArrayList<SalesOrderLogVo>();
		for (Object array : listvo) {
			SalesOrderLogVo vo = new SalesOrderLogVo((Object[]) array);
			list.add(vo);
		}
		String sqlAccout = "select count(*) from (" + sql + conStr + " ) t ";
		Long count = dao.getCount4PagingWithSQL(sqlAccout);
		BaseModelList<SalesOrderLogVo> lists = new BaseModelList<SalesOrderLogVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Map<String,List> searchLogFileInfo(BasePagerObject bso) {

		bso = SymbolUtil.disposeBasePagerObject(bso);
		// 排序
		String orderBy = " order by handleDate desc ";
		String conStr = "";
		// 搜索条件
		List<com.zqw.bss.framework.vo.Condition> condition = bso.getCondition();
		List<com.zqw.bss.framework.vo.Condition> condition2 = new ArrayList<>();
		for (com.zqw.bss.framework.vo.Condition con : condition) {
			if (con.getValue().length != 0 && !con.getKey().equals("undefined")) {
				if (con.getKey().equals(" CONCAT(logd.createBy,'(', userinfo.name,')') ")) {
					conStr += " AND  CONCAT(userinfo.name,'(', logd.createBy,')') LIKE '%" + con.getValue()[0] + "%'";
					conStr += " and handletype ='upload' ";
				}
				if (con.getKey().equals("logd.fileName")) {
					conStr += " AND logd.fileName LIKE '%" + con.getValue()[0] + "%'";
				}
				// 时间
				if (con.getKey().equals("beginHandleDate")) {
					conStr += " AND handleDate >= " + con.getValue()[0] + "";
				}
				if (con.getKey().equals("endHandleDate")) {
					conStr += " AND handleDate <= " + con.getValue()[0] + "";
				}
				condition2.add(con);
			}
		}
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_createBy]")||SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_auditor]")){
			conStr +=" AND ( logd.createBy = '" +username+ "')";
		}
		bso.setCondition(condition2);
		conStr += HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = " SELECT "
				+ "  CONCAT(userinfo.name,'(', logd.createBy,')') as createBy , "//
				+ " logd.handleDate,logd.handletype , logd.fileName ,logd.fileId  "
				+ " ,WEEK(logd.handleDate) as num , DATE_FORMAT(logd.handleDate, '%Y') as year  "
				+ " FROM  t_simple_sales_order_log logd "
				+ " JOIN t_bss_sys_user bssuser ON (bssuser.username = logd.createBy) JOIN t_crm_user_info userinfo ON (userinfo.id = bssuser.userInfo_id) "
				+ " where handletype in ('upload','download')";
		List<SalesOrderLogVo> listvo = dao.getLst4PagingWithSQL(sql + conStr + orderBy,
				new int[] { bso.getPagenum(), bso.getPagesize() });
		List<SalesOrderLogVo> list = new ArrayList<SalesOrderLogVo>();
		for (Object array : listvo) {
			SalesOrderLogVo vo = new SalesOrderLogVo((Object[]) array,null);
			list.add(vo);
		}
		String sqlAccout = "select count(*) from (" + sql + conStr + " ) t ";
		Long count = dao.getCount4PagingWithSQL(sqlAccout);
		BaseModelList<SalesOrderLogVo> lists = new BaseModelList<SalesOrderLogVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		List<SalesOrderLogVo> endList  = new ArrayList<>();
		for (SalesOrderLogVo salesOrderLogVo : list) {
			if(salesOrderLogVo.getHandletype().equals("upload")){
				endList.add(salesOrderLogVo);
			}
		}
		for (SalesOrderLogVo salesOrderLogVo : endList) {
			List<SalesOrderLogVo> temp = new ArrayList<>();
			for (SalesOrderLogVo salesOrderLogVo2 : list){
				if(salesOrderLogVo.getFileId().equals(salesOrderLogVo2.getFileId())&&salesOrderLogVo2.getHandletype().equals("download")){
					temp.add(salesOrderLogVo2);
				}
			}
			salesOrderLogVo.setData(temp);
		}
		Map<String,List> maps = new LinkedHashMap<>();
		//先把最外层的放到maps里面
		for (SalesOrderLogVo salesOrderLogVo : endList) {
			String dateStr = salesOrderLogVo.getYear().toString()+"-"+salesOrderLogVo.getNum().toString();
			maps.put(dateStr, null);
		}
		List<SalesOrderLogVo> 	mapList  = new ArrayList<>();
			//区分key
//			if(maps.containsKey(dateStr)){
			//对应的才add
			for(String key : maps.keySet()){ 
				for (SalesOrderLogVo salesOrderLogVo : endList){
					String dateStr = salesOrderLogVo.getYear().toString()+"-"+salesOrderLogVo.getNum().toString();
					if(key.equals(dateStr)){
						mapList.add(salesOrderLogVo);
						maps.put(dateStr, mapList);
					}
				}
				mapList  = new ArrayList<>();
			} 
//			}else{
//				mapList.removeAll(mapList);
//			}
		//处理map中的key
		 Calendar c = Calendar.getInstance();
		 int nowWeek = c.get(Calendar.WEEK_OF_YEAR);
		Map<String,List> endMap = new LinkedHashMap<>();
		Boolean nowFlag = true;
		for(String str:maps.keySet()){
			System.out.println("===="+str);
			
			int year = Integer.parseInt(str.substring(0,str.indexOf("-")));
			int weekNo = Integer.parseInt(str.substring(str.indexOf("-")+1,str.length()));
		 	Calendar cal = Calendar.getInstance();
	        cal.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);      
	        cal.set(Calendar.YEAR, year);
	        cal.set(Calendar.WEEK_OF_YEAR, weekNo);
	        String begin = cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-" +
		               cal.get(Calendar.DAY_OF_MONTH);  
	        cal.add(Calendar.DAY_OF_WEEK, 6);//
	        String end  = cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-" +
		               cal.get(Calendar.DAY_OF_MONTH);
	       if(nowFlag){
		        if(nowWeek==weekNo){
		        	nowFlag=false;
		        	begin = "本周   "+begin;
		        }else{
		    		Calendar cal2 = Calendar.getInstance();
					String begin2 = cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-" +
				    cal.get(Calendar.DAY_OF_MONTH); 
					cal.add(Calendar.DAY_OF_WEEK, 6);//
				    String end2 = cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-" +
					cal.get(Calendar.DAY_OF_MONTH);
		        	nowFlag=false;
		        	List temp =new ArrayList<>();
		   		    endMap.put("本周  " +begin2+"—"+end2,temp);
		        } 
	       }
	        if(nowWeek==weekNo+1){
	        	begin = "上周   "+begin;
	        }
	        endMap.put(begin+"—"+end, maps.get(str));
		}
//		if(nowFlag){
//			Calendar cal = Calendar.getInstance();
//			String begin = cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-" +
//		    cal.get(Calendar.DAY_OF_MONTH); 
//			cal.add(Calendar.DAY_OF_WEEK, 6);//
//		    String end  = cal.get(Calendar.YEAR) + "-" + (cal.get(Calendar.MONTH) + 1) + "-" +
//			cal.get(Calendar.DAY_OF_MONTH);
//		}
		return endMap;
	}

	
	
//	public static void main(String[] args) {
//		Map<String,String> endMap = new TreeMap<>();
//		endMap.put("2", "2");   
//		endMap.put("1", "1");
//		endMap.put("3", "3");   
//		for(String str:endMap.keySet()){
//			System.out.println(str);
//		}
//	}

	/**
	 * 查看销售单
	 * 获取ocr销售单的信息
	 * uuid
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public OcrSaleOrder getOrder(Long id) {
		Long[] paramId = {id};
		String sql = " select orderApprovalStatus from t_simple_sales_order_log_sum where id =?";
		List<String> status = dao.executeQuerySql(sql, paramId);
		//如果不是制单人判断该单据是不是处于审核中
		if(!SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_createBy]")){
			if(status.get(0).equals("checking")||status.get(0).equals("checkingAgain")){
				String checkIdSql = " select sysuser.userInfo_id from t_simple_sales_order_log_sum logsum join t_bss_sys_user sysuser on "
						+ " (sysuser.id = logsum.customerCheckId) where logsum.id =? ";//t_bss_sys_user
				List checkIds = dao.executeQuerySql(checkIdSql, paramId);
				if(checkIds==null||checkIds.size()==0){
					throw new OperationException("单据没有查到审批负责人-"+checkIdSql);
				}
				String userinfoId = SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID).toString();
				if(!checkIds.get(0).toString().equals(userinfoId)){//checkIds.size()!=0处理一会错误数据
					throw new OperationException("该单据处于审核中,其他审核人不可审核");
				}
			}
		}
		//如果不是制单人 增加审核开始时间更改记录的状态为审核中/复核中
		//审核开始时间 复核开始时间一旦有值永远不变
		if(!SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_createBy]")){
			if(status.get(0).equals("orderSubmit")||status.get(0).equals("checking")){
				String sql1 = " UPDATE t_simple_sales_order_log_sum SET checkBeginDate = now() WHERE id= ? and checkBeginDate is null  ";
				String sql2 = " UPDATE t_simple_sales_order_log_sum SET orderApprovalStatus ='checking'  WHERE id= ?";
				dao.executeSql(sql1, paramId);
				dao.executeSql(sql2, paramId);
				approvalStatusService.insertLog("checkBegin", null, null, id, null, approvalStatusService.getOrderId(id));
			}else if(status.get(0).equals("orderSubmitAgain")||status.get(0).equals("checkingAgain")){
				String sql1 = " UPDATE t_simple_sales_order_log_sum SET checkAgainBeginDate = now() WHERE id= ? and checkAgainBeginDate is null ";
				String sql2 = " UPDATE t_simple_sales_order_log_sum SET orderApprovalStatus ='checkingAgain'  WHERE id= ?  ";
				dao.executeSql(sql1, paramId);
				dao.executeSql(sql2, paramId);
				approvalStatusService.insertLog("checkAgainBegin", null, null, id, null, approvalStatusService.getOrderId(id));
			}
			//把负责人加上去
			List<User> use = dao.find("from User  where username  = ? ", new Object[]{SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME)});
			String checkSql = " UPDATE t_simple_sales_order_log_sum SET customerCheckId =? where id = ? and customerCheckId is null ";
			dao.executeSql(checkSql, new Object[]{use.get(0).getId(),id});
		}
		String hql = " from OcrSaleOrder  ocrSaleOrder where ocrSaleOrder.uuid = ?";
		List<OcrSaleOrder> ocrSaleOrder = dao.find(hql,paramId);
		OcrSaleOrder ocrOrder = ocrSaleOrder.get(0);
//		String json =new Gson().toJson(ocrOrder, ocrOrder.getClass());
//		OcrSaleOrder order = new Gson().fromJson(json,  new TypeToken<OcrSaleOrder>(){}.getType());
//		if(order.getYardsFlag()==null){
//			order.setYardsFlag(false);
//		}
		return ocrOrder;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SalesOrderListVo> getSimpleSalesOrderVoList(BasePagerObject bso) {
		System.out.println("begin  getSimpleSalesOrderVo:[ id =" + WebUtil.getLogBasicString() + "]");
		bso = SymbolUtil.disposeBasePagerObject(bso);
		// 排序
		String orderBy = " ORDER BY orderType DESC , serviceType  ,submitDate DESC  ";
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = " SELECT " + " so.orderNumber AS orderNumber," + " so.serviceType AS serviceType ,"
				+ " so.orderApprovalStatus AS orderType ," + " logsum.createDate AS submitDate ,"
				+ " logsum.orderSuccessDate AS orderSuccessDate, " + " logsum.orderSubmitDate AS orderSubmitDate, "
				+ " logsum.checkSuccessDate AS checkSuccessDate, " + " logsum.completeDate AS completeDate, "
				+ "  CONCAT(userinfo2.name,'(', bsssysuser.username,')')  AS responsibleName , "
				+ " userinfo.telephone AS telephone, " + " sysuser.username AS userName , "
				+ " userinfoe.name AS ownerName , " + " so.id AS id ," + " so.ownerId AS soOwnerId " +
				// " userinfoe.name AS name "+
				" FROM " + " t_simple_sales_order_log_sum logsum "
				+ " LEFT JOIN t_simple_sales_order so ON (so.id = logsum.salesOrder_id) "
				+ " LEFT JOIN t_sys_user sysuser ON (sysuser.id = logsum.user_id) "
				+ " LEFT JOIN t_crm_user_info userinfo ON (userinfo.id = sysuser.userInfo_id) "
				+ " LEFT JOIN t_bss_sys_user bsssysuser ON (bsssysuser.id = logsum.customerServiceId) "
				+ " LEFT JOIN t_crm_user_info userinfo2 ON (userinfo2.id = bsssysuser.userInfo_id) "
				+ " LEFT JOIN t_crm_owner towner ON (towner.id = so.ownerId) "
				+ " LEFT JOIN t_crm_user_info userinfoe ON (userinfoe.id = towner.enterpriseInfo_id) where 1=1 ";

		List<SalesOrderListVo> listvo = dao.getLst4PagingWithSQL(sql + conStr + orderBy,
				new int[] { bso.getPagenum(), bso.getPagesize() });
		List<SalesOrderListVo> list = new ArrayList<SalesOrderListVo>();
		for (Object array : listvo) {
			SalesOrderListVo vo = new SalesOrderListVo((Object[]) array);
			list.add(vo);
		}
		String sqlAccout = "select count(*) from (" + sql + conStr + " ) t ";

		Long count = dao.getCount4PagingWithSQL(sqlAccout);
		BaseModelList<SalesOrderListVo> lists = new BaseModelList<SalesOrderListVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		System.out.println("end  getSimpleSalesOrderVo:[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;
	}

	@Override
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<OrderSalesLogs> orderSalesLogsList(Long salesId) {
		List<OrderSalesLogs> listVo = dao.executeQuerySql(
				"select id,handletype,checkRemark ,submitRemark ,createBy ,handleDate , refusedRemark ,backRemark from t_simple_sales_order_log where handleDate IS NOT NULL and uuid = " + salesId,
				null);
		List<OrderSalesLogs> list = new ArrayList<OrderSalesLogs>();
		for (Object rsArray : listVo) {
			OrderSalesLogs vo = new OrderSalesLogs((Object[]) rsArray);
			list.add(vo);
		}
		return list;
	}

	
	/**
	 * 改变销售单的类型 从ocring-->ocred
	 */
//	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
//	public void updateOrderType(Long id){
//		String updateOrder = " UPDATE t_simple_sales_order  SET orderType = 'ocred' where id="
//				+ id + "";
//		dao.executeSql(updateOrder, null);
//	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<String> getEmployee() {
		
		String conStr = "";
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		System.out.println(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES));
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).equals("Ocr_createBy")){
			conStr +=" AND  users.username = '" +username+ "'  ";
		}
		String sql = " SELECT "+
					 " CONCAT(userInfo.name,'(', users.username,')') "+
					 " FROM "+
					 " t_bss_sys_user users "+
					 " CROSS JOIN t_crm_person_info personinfo "+
					 " LEFT JOIN t_bss_userrole_info rl "+
					 "   ON users.id = rl.userid "+
					 " LEFT JOIN t_bss_sys_role_info role "+
					 "   ON role.id = rl.roleid "+
					 " INNER JOIN t_crm_user_info userInfo "+
					 "  ON personinfo.id = userInfo.id "+
					 " WHERE users.ownerId = - 2 "+
					 " AND users.userInfo_id = personinfo.id  "+conStr+" "+
					 " UNION "+
					 " ALL "+
					 " SELECT "+
					 " CONCAT(userInfo.name,'(', users.username,')') "+
					 " FROM "+
					 " t_bss_sys_user users "+
					 " CROSS JOIN t_crm_enterprise_info personinfo "+
					 " LEFT JOIN t_bss_userrole_info rl "+
					 "  ON users.id = rl.userid "+
					 " LEFT JOIN t_bss_sys_role_info role "+
					 "  ON role.id = rl.roleid "+
					 " INNER JOIN t_crm_user_info userInfo "+
					 " ON personinfo.id = userInfo.id "+
					 " WHERE users.ownerId = - 2 "+
					 " AND users.userInfo_id = personinfo.id  "+conStr+" ";
		List<String> lists = dao.executeQuerySql(sql, null);
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public OcrEnclosureOrder kfRejectOrder(Long uuid) {
		String hql = " from OcrEnclosureOrder ocrEnclosureOrder where uuid= "+uuid+"";
		List<OcrEnclosureOrder> ocrEnclosureOrder = dao.find(hql);
		int i =ocrEnclosureOrder.size()-1;
		return ocrEnclosureOrder.get(i);
	}
	
	/**
	 * 待抢单列表
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<WaitOrderListVo> waitOrder() {
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_auditor]")){//审批人
			throw new OperationException("审批人没有权限");
		}
		/**
		 * 记录登陆日志
		 */
		if(SessionUtil.get("loginFlag")==null){
			approvalStatusService.insertLog("loginLog","","",null,null,null);
			SessionUtil.put("loginFlag", "loging");
		}
		String conStr = "";
		Long userInfoId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		String selectUser = " SELECT id  FROM t_bss_sys_user bsssysuser WHERE userInfo_id =? " ;
		List lists = dao.executeQuerySql(selectUser,new Long[]{userInfoId});
		String id = lists.get(0).toString();
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_createBy]")){
			conStr +=" where temp.customerServiceId = "+id+" ";
		}
		String sql2 = " SELECT "+
				  " COUNT(*) AS qty, "+
				  " MIN(temp.beginDate) AS beginDate, "+
				  " NOW() AS endDate, "+
				  " temp.serviceType AS serviceType "+
				" FROM "+
				  " (SELECT DISTINCT "+
				   " saleorder.createDate AS beginDate, "+
				   " NOW() AS endDate, "+
				    " saleorder.servicetype , "+
				   " saleorder.orderApprovalStatus "+
				  " FROM "+
				    " t_simple_sales_order_log logdetail "+
				    " JOIN t_simple_sales_order_log_sum saleorder "+
				    "  ON ( "+
				   "     saleorder.createBy  = logdetail.createBy  "+
				  "    ) "+
				 "  WHERE ( "+
				 "    saleorder.orderApprovalStatus = 'stayOrder') ) temp "+
				" GROUP BY serviceType "+
				" UNION "+
				" SELECT "+
				  " COUNT(*) AS qty, "+
				  " MIN(temp.beginDate) AS beginDate, "+
				 " NOW() AS endDate,"+
				 " temp.orderApprovalStatus AS servicetype "+
				" FROM "+
				 " (SELECT DISTINCT "+
				    " saleorder.createDate AS beginDate,"+
				    " NOW() AS endDate,"+
				    " saleorder.servicetype ,"+
				    " saleorder.orderApprovalStatus,"+
				   " saleorder.customerServiceId "+
				  " FROM"+
				    " t_simple_sales_order_log logdetail "+
				    " JOIN t_simple_sales_order_log_sum saleorder "+
				    "  ON ("+
				    "    saleorder.createBy = logdetail.createBy "+
				   "   ) "+
				  " WHERE ( "+
				  "   saleorder.orderApprovalStatus = 'checkRefused' or orderApprovalStatus = 'checkFailed' or orderApprovalStatus = 'checkAgainFailed'  ) ) temp "+
				" "+conStr+" "+
				" GROUP BY temp.orderApprovalStatus " ;
		List<WaitOrderListVo> listVo = dao.executeQuerySql(sql2, null);
		List<WaitOrderListVo> list = new ArrayList<>();
		for (Object array : listVo) {
			WaitOrderListVo vo = new WaitOrderListVo((Object[]) array);
			list.add(vo);
		}
		return list;
	}
	/**
	 * 待审核列表
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<WaitOrderListVo> waitCheck() {
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_createBy]")){//制单人
			throw new OperationException("制单人不应该请求待审核列表的接口");
		}
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		String selectIdSql= " SELECT id FROM t_bss_sys_user WHERE username =? ";
		List ids =dao.executeQuerySql(selectIdSql, new String[]{username});
		String conStr = "";
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_auditor]")){
			conStr +=" and saleorder.customerCheckId="+ids.get(0)+" ";
		}
		String sql = "  SELECT "+
					  " COUNT(*) AS qty, "+
					 "  MIN(temp.beginDate) AS beginDate, "+
					 "  NOW() AS endDate, "+
					 "  temp.orderApprovalStatus "+
					 "  FROM "+
					 "  (SELECT DISTINCT  "+
					 "   saleorder.createDate AS beginDate, "+
					  "  NOW() AS endDate, "+
					  "  saleorder.orderApprovalStatus  "+
					  "  FROM "+
					  "  t_simple_sales_order_log logdetail  "+
					  "  JOIN t_simple_sales_order_log_sum saleorder  "+
					  "    ON ( "+
					  "      saleorder.createBy  = logdetail.createBy  "+
					  "    )  "+
					  " WHERE ( "+
					  "     saleorder.orderApprovalStatus IN( 'orderSubmit' ) "+
					  "   )) temp  "+
					"GROUP BY temp.orderApprovalStatus";
		String sql2= " union SELECT "+
				  " COUNT(*) AS qty, "+
				 "  MIN(temp.beginDate) AS beginDate, "+
				 "  NOW() AS endDate, "+
				 "  temp.orderApprovalStatus "+
				 "  FROM "+
				 "  (SELECT DISTINCT  "+
				 "   saleorder.createDate AS beginDate, "+
				  "  NOW() AS endDate, "+
				  "  saleorder.orderApprovalStatus  "+
				  "  FROM "+
				  "  t_simple_sales_order_log logdetail  "+
				  "  JOIN t_simple_sales_order_log_sum saleorder  "+
				  "    ON ( "+
				  "      saleorder.createBy  = logdetail.createBy  "+
				  "    )  "+
				  " WHERE ( "+
				  "     saleorder.orderApprovalStatus IN( 'orderSubmitAgain' ) "+conStr+
				  "   )) temp  "+
				"GROUP BY temp.orderApprovalStatus";
		String sql3 = " union  SELECT "+
				  " COUNT(*) AS qty, "+
				 "  MIN(temp.beginDate) AS beginDate, "+
				 "  NOW() AS endDate, "+
				 "  temp.orderApprovalStatus "+
				 "  FROM "+
				 "  (SELECT DISTINCT  "+
				 "   saleorder.createDate AS beginDate, "+
				  "  NOW() AS endDate, "+
				  "  saleorder.orderApprovalStatus  "+
				  "  FROM "+
				  "  t_simple_sales_order_log logdetail  "+
				  "  JOIN t_simple_sales_order_log_sum saleorder  "+
				  "    ON ( "+
				  "      saleorder.createBy  = logdetail.createBy  "+
				  "    )  "+
				  " WHERE ( "+
				  "     saleorder.orderApprovalStatus IN( 'checking' ) "+conStr+
				  "   )) temp  "+
				"GROUP BY temp.orderApprovalStatus";
		List<WaitOrderListVo> listVo = dao.executeQuerySql(sql+sql2+sql3, null);
		List<WaitOrderListVo> list = new ArrayList<>();
		for (Object array : listVo) {
			WaitOrderListVo vo = new WaitOrderListVo((Object[]) array);
			list.add(vo);
		}
		return list;
	}
	
}




















