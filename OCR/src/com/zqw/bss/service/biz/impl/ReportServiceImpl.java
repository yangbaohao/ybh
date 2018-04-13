package com.zqw.bss.service.biz.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.hibernate.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.service.biz.ApprovalStatusService;
import com.zqw.bss.service.biz.OverviewService;
import com.zqw.bss.service.biz.ReportService;
import com.zqw.bss.util.SymbolUtil;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.report.PerformanceVO;

@Service
@Qualifier("reportService")
public class ReportServiceImpl implements ReportService {
	
	private final Logger logger = Logger.getLogger(ReportServiceImpl.class);
	@Autowired
	protected ApprovalStatusService approvalStatusService;
	@Autowired
	protected DAO dao;
	@Autowired
	private OverviewService overviewService;
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public BaseModelList<PerformanceVO> searchCreaterReport(BasePagerObject bso) {
		List<Condition> conditions = bso.getCondition();
		String conStr = "";
		Map<String, Object> paramMaps = new HashMap<String, Object>();
		for(int i=0;i<conditions.size();i++){
			String condition = conditions.get(i).getKey();
			String value = conditions.get(i).getValue()[0];
			String bigValue = null;
			if(conditions.get(i).getValue().length>1){
				bigValue = conditions.get(i).getValue()[1];
			}
			String action = conditions.get(i).getAction();
			switch (condition){
				case "username": conStr += "and a.username like :username" ; 
								 paramMaps.put("username", '%' + value + '%'  );
								 break;
				case "avgTime":  
								paramMaps.put("smallTime", value  );
								paramMaps.put("bigTime", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.avgTime >= :smallTime ";
									conStr +=" and a.avgTime <= :bigTime ";
								}
								if(action.equals("le")){
									conStr +=" and a.avgTime <= :bigTime ";
									paramMaps.remove("smallTime");
								}
								if(action.equals("ge")){
									conStr +=" and a.avgTime >= :smallTime ";
									paramMaps.remove("bigTime");
								}
						
								break;
				case "createDate":  
								paramMaps.put("smallDate", value  );
								paramMaps.put("bigDate", bigValue  );
								if(action.equals("between")){
									conStr +=" and b.orderSuccessDate >= :smallDate ";
									conStr +=" and b.orderSuccessDate <= :bigDate ";
								}
								if(action.equals("le")){
									conStr +=" and b.orderSuccessDate <= :bigDate ";
									paramMaps.remove("smallDate");
								}
								if(action.equals("ge")){
									conStr +=" and b.orderSuccessDate >= :smallDate ";
									paramMaps.remove("bigDate");
								}
								break;
				case "kfreject":  
								paramMaps.put("smallKfreject", value  );
								paramMaps.put("bigkfreject", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.kfreject >= :smallKfreject ";
									conStr +=" and a.kfreject <= :bigkfreject ";
								}
								if(action.equals("le")){
									conStr +=" and a.kfreject <= :bigkfreject ";
									paramMaps.remove("smallKfreject");
								}
								if(action.equals("ge")){
									conStr +=" and a.kfreject >= :smallKfreject ";
									paramMaps.remove("bigkfreject");
								}
								break;
				case "checkRefused":  
								paramMaps.put("smallCheckRefused", value  );
								paramMaps.put("bigCheckRefused", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.checkRefused >= :smallCheckRefused ";
									conStr +=" and a.checkRefused <= :bigCheckRefused ";
								}
								if(action.equals("le")){
									conStr +=" and a.checkRefused <= :bigCheckRefused ";
									paramMaps.remove("smallCheckRefused");
								}
								if(action.equals("ge")){
									conStr +=" and a.checkRefused >= :smallCheckRefused ";
									paramMaps.remove("bigCheckRefused");
								}
								break;
				case "checkFailed":  
								paramMaps.put("smallCheckFailed", value  );
								paramMaps.put("bigCheckFailed", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.checkFailed >= :smallCheckFailed ";
									conStr +=" and a.checkFailed <= :bigCheckFailed ";
								}
								if(action.equals("le")){
									conStr +=" and a.checkFailed <= :bigCheckFailed ";
									paramMaps.remove("smallCheckFailed");
								}
								if(action.equals("ge")){
									conStr +=" and a.checkFailed >= :smallCheckFailed ";
									paramMaps.remove("bigCheckFailed");
								}
								break;
				case "checkAgainFailed":  
								paramMaps.put("smallCheckAgainFailed", value  );
								paramMaps.put("bigCheckAgainFailed", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.checkAgainFailed >= :smallCheckAgainFailed ";
									conStr +=" and a.checkAgainFailed <= :bigCheckAgainFailed ";
								}
								if(action.equals("le")){
									conStr +=" and a.checkAgainFailed <= :bigCheckAgainFailed ";
									paramMaps.remove("smallCheckAgainFailed");
								}
								if(action.equals("ge")){
									conStr +=" and a.checkAgainFailed >= :smallCheckAgainFailed ";
									paramMaps.remove("bigCheckAgainFailed");
								}
								break;
				case "khbackout":  
								paramMaps.put("smallKhbackout", value  );
								paramMaps.put("bigKhbackout", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.khbackout >= :smallKhbackout ";
									conStr +=" and a.khbackout <= :bigKhbackout ";
								}
								if(action.equals("le")){
									conStr +=" and a.khbackout <= :bigKhbackout ";
									paramMaps.remove("smallKhbackout");
								}
								if(action.equals("ge")){
									conStr +=" and a.khbackout >= :smallKhbackout ";
									paramMaps.remove("bigKhbackout");
								}
								break;
				case "orderSuccess":  
								paramMaps.put("smallOrderSuccess", value  );
								paramMaps.put("bigOrderSuccess", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.orderSuccess >= :smallOrderSuccess ";
									conStr +=" and a.orderSuccess <= :bigOrderSuccess ";
								}
								if(action.equals("le")){
									conStr +=" and a.orderSuccess <= :bigOrderSuccess ";
									paramMaps.remove("smallOrderSuccess");
								}
								if(action.equals("ge")){
									conStr +=" and a.orderSuccess >= :smallOrderSuccess ";
									paramMaps.remove("bigOrderSuccess");
								}
								break;
				case "orderSubmit":  
								paramMaps.put("smallOrderSubmit", value  );
								paramMaps.put("bigOrderSubmit", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.orderSubmit >= :smallOrderSubmit ";
									conStr +=" and a.orderSubmit <= :bigOrderSubmit ";
								}
								if(action.equals("le")){
									conStr +=" and a.orderSubmit <= :bigOrderSubmit ";
									paramMaps.remove("smallOrderSubmit");
								}
								if(action.equals("ge")){
									conStr +=" and a.orderSubmit >= :smallOrderSubmit ";
									paramMaps.remove("bigOrderSubmit");
								}
								break;
				case "detailQty":  
								paramMaps.put("smallDetailQty", value  );
								paramMaps.put("bigDetailQty", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.detailQty >= :smallDetailQty ";
									conStr +=" and a.detailQty <= :bigDetailQty ";
								}
								if(action.equals("le")){
									conStr +=" and a.detailQty <= :bigDetailQty ";
									paramMaps.remove("smallDetailQty");
								}
								if(action.equals("ge")){
									conStr +=" and a.detailQty >= :smallDetailQty ";
									paramMaps.remove("bigDetailQty");
								}
								break;
			}
		}
		String sql =  " SELECT "+
			   " a.*, b.detailQty FROM "+
			   " (SELECT  CONCAT(userinfo.name,'(', bssuser.username, ')') AS username, "+
			   " COUNT(DISTINCT logsum.id) AS total,"+
			   " COUNT(IF(logdetail.handletype = 'KFReject',TRUE,NULL)) AS kfreject, "+
			   " COUNT(IF(logdetail.handletype = 'checkRefused',TRUE, NULL)) AS checkRefused, "+
			   " COUNT(IF( logdetail.handletype = 'checkFailed',TRUE,NULL)) AS checkFailed, "+
			   " COUNT(IF(logdetail.handletype = 'checkAgainFailed', TRUE,NULL)) AS checkAgainFailed, "+
			   " COUNT(IF(logdetail.handletype = 'KHBackout',TRUE,NULL )) AS khbackout, "+
			   " COUNT( IF(logdetail.handletype = 'orderSuccess', TRUE,NULL )) AS orderSuccess, "+
			   " COUNT(IF( logdetail.handletype = 'orderSubmit',TRUE, NULL )) AS orderSubmit, "+
			   " AVG(TIMESTAMPDIFF( MINUTE,logsum.orderSuccessDate,logsum.orderSubmitDate)) AS avgTime "+
			   " FROM "+
			   " t_simple_sales_order_log_sum logsum "+
			   " JOIN t_bss_sys_user bssuser ON (bssuser.id = logsum.customerServiceId) "+
			   " LEFT JOIN t_simple_sales_order_log logdetail ON (logdetail.uuid = logsum.id) "+
			   " LEFT JOIN t_crm_user_info userinfo ON (  userinfo.id = bssuser.userInfo_id ) "+
			   " WHERE 1 = 1 "+
			   " GROUP BY bssuser.username "+
			   " HAVING 1 = 1) a "+
			   " JOIN "+
			   " (SELECT  CONCAT( userinfo.name,'(', bssuser.username,')') AS username,"+
			   " (COUNT(DISTINCT ocrdetail.id) / COUNT(DISTINCT ocrorder.id) ) AS detailQty , logsum.orderSuccessDate"+
			   " FROM "+
			   " t_simple_sales_order_log_sum logsum "+
			   " LEFT JOIN t_ocr_saleorder ocrorder ON (ocrorder.uuid = logsum.id) "+
			   " LEFT JOIN t_ocr_saleorderdetail ocrdetail  ON (ocrdetail.sales_id = ocrorder.id) "+
			   " JOIN t_bss_sys_user bssuser ON (bssuser.id = logsum.customerServiceId) "+
			   " LEFT JOIN t_crm_user_info userinfo ON (userinfo.id = bssuser.userInfo_id) "+
			   " WHERE 1 = 1 "+
			   " GROUP BY bssuser.username "+
			   " HAVING 1 = 1) b "+
			   " ON a.username = b.username "+
			   " where 1= 1 ";
		String sqlAccout = "select count(*) from (" + sql + conStr+ " ) t ";
		Query queryCount = dao.getHibSession().createSQLQuery(sqlAccout);
		dao.bindParamToQueryByName(queryCount, paramMaps);
		Long count =Long.valueOf(queryCount.list().get(0).toString());
		int startNum = bso.getPagesize() * (bso.getPagenum());
		int pageSize = bso.getPagesize();
		String limitString = " limit " + startNum + "," + pageSize;
		Query queryCountList= dao.getHibSession().createSQLQuery(sql + conStr+ limitString);//加limit
		dao.bindParamToQueryByName(queryCountList, paramMaps);
		List<PerformanceVO> listvo = queryCountList.list();
		List<PerformanceVO> endLists=new ArrayList<>();
		for (Object array : listvo) {
			PerformanceVO vo = new PerformanceVO((Object[]) array);
			endLists.add(vo);
		}
		BaseModelList<PerformanceVO> end = new BaseModelList<PerformanceVO>(count,
				WebUtil.getEntryListFromProxyList(endLists, dao));
		return end;
				
	}
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public BaseModelList<PerformanceVO> searchCheckerReport(BasePagerObject bso) {
		
		List<Condition> conditions = bso.getCondition();
		String conStr = "";
		Map<String, Object> paramMaps = new HashMap<String, Object>();
		for(int i=0;i<conditions.size();i++){
			String condition = conditions.get(i).getKey();
			String value = conditions.get(i).getValue()[0];
			String bigValue = null;
			if(conditions.get(i).getValue().length>1){
				bigValue = conditions.get(i).getValue()[1];
			}
			String action = conditions.get(i).getAction();
			switch (condition){
				case "username": conStr += "and a.username like :username" ; 
								 paramMaps.put("username", '%' + value + '%'  );
								 break;
				case "checkDate":  
								paramMaps.put("smallDate", value  );
								paramMaps.put("bigDate", bigValue  );
								if(action.equals("between")){
									conStr +=" and b.checkBeginDate >= :smallDate ";
									conStr +=" and b.checkBeginDate <= :bigDate ";
								}
								if(action.equals("le")){
									conStr +=" and b.checkBeginDate <= :bigDate ";
									paramMaps.remove("smallDate");
								}
								if(action.equals("ge")){
									conStr +=" and b.checkBeginDate >= :smallDate ";
									paramMaps.remove("bigDate");
								}
								break;
				case "checkNumber":  
								paramMaps.put("smallCheckNumber", value  );
								paramMaps.put("bigCheckNumber", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.checkNumber >= :smallCheckNumber ";
									conStr +=" and a.checkNumber <= :bigCheckNumber ";
								}
								if(action.equals("le")){
									conStr +=" and a.checkNumber <= :bigCheckNumber ";
									paramMaps.remove("smallCheckNumber");
								}
								if(action.equals("ge")){
									conStr +=" and a.checkNumber >= :smallCheckNumber ";
									paramMaps.remove("bigCheckNumber");
								}
								break;
				case "khrefusedNumber":  
								paramMaps.put("smallKhrefusedNumber", value  );
								paramMaps.put("bigKhrefusedNumber", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.khrefusedNumber >= :smallKhrefusedNumber ";
									conStr +=" and a.khrefusedNumber <= :bigKhrefusedNumber ";
								}
								if(action.equals("le")){
									conStr +=" and a.khrefusedNumber <= :bigKhrefusedNumber ";
									paramMaps.remove("smallKhrefusedNumber");
								}
								if(action.equals("ge")){
									conStr +=" and a.khrefusedNumber >= :smallKhrefusedNumber ";
									paramMaps.remove("bigKhrefusedNumber");
								}
								break;
				case "checkRefusedNumber":  
								paramMaps.put("smallCheckRefused", value  );
								paramMaps.put("bigCheckRefused", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.checkRefusedNumber >= :smallCheckRefused ";
									conStr +=" and a.checkRefusedNumber <= :bigCheckRefused ";
								}
								if(action.equals("le")){
									conStr +=" and a.checkRefusedNumber <= :bigCheckRefused ";
									paramMaps.remove("smallCheckRefused");
								}
								if(action.equals("ge")){
									conStr +=" and a.checkRefusedNumber >= :smallCheckRefused ";
									paramMaps.remove("bigCheckRefused");
								}
								break;
				case "checkAgainRefusedNumber":  
								paramMaps.put("smallCheckAgainFailed", value  );
								paramMaps.put("bigCheckAgainFailed", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.checkAgainRefusedNumber >= :smallCheckAgainFailed ";
									conStr +=" and a.checkAgainRefusedNumber <= :bigCheckAgainFailed ";
								}
								if(action.equals("le")){
									conStr +=" and a.checkAgainRefusedNumber <= :bigCheckAgainFailed ";
									paramMaps.remove("smallCheckAgainFailed");
								}
								if(action.equals("ge")){
									conStr +=" and a.checkAgainRefusedNumber >= :smallCheckAgainFailed ";
									paramMaps.remove("bigCheckAgainFailed");
								}
								break;
				case "khbackOutNumber":  
								paramMaps.put("smallKhbackout", value  );
								paramMaps.put("bigKhbackout", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.khbackOutNumber >= :smallKhbackout ";
									conStr +=" and a.khbackOutNumber <= :bigKhbackout ";
								}
								if(action.equals("le")){
									conStr +=" and a.khbackOutNumber <= :bigKhbackout ";
									paramMaps.remove("smallKhbackout");
								}
								if(action.equals("ge")){
									conStr +=" and a.khbackOutNumber >= :smallKhbackout ";
									paramMaps.remove("bigKhbackout");
								}
								break;
				case "checkTimeNumber":  
								paramMaps.put("smallCheckTimeNumber", value  );
								paramMaps.put("bigCheckTimeNumber", bigValue  );
								if(action.equals("between")){
									conStr +=" and a.checkTimeNumber >= :smallCheckTimeNumber ";
									conStr +=" and a.checkTimeNumber <= :bigCheckTimeNumber ";
								}
								if(action.equals("le")){
									conStr +=" and a.checkTimeNumber <= :bigCheckTimeNumber ";
									paramMaps.remove("smallCheckTimeNumber");
								}
								if(action.equals("ge")){
									conStr +=" and a.checkTimeNumber >= :smallCheckTimeNumber ";
									paramMaps.remove("bigCheckTimeNumber");
								}
								break;
				case "checkDetailQtyNumber":  
								paramMaps.put("smallCheckDetailQtyNumber", value  );
								paramMaps.put("bigCheckDetailQtyNumber", bigValue  );
								if(action.equals("between")){
									conStr +=" and b.checkDetailQtyNumber >= :smallCheckDetailQtyNumber ";
									conStr +=" and b.checkDetailQtyNumber <= :bigCheckDetailQtyNumber ";
								}
								if(action.equals("le")){
									conStr +=" and b.checkDetailQtyNumber <= :bigCheckDetailQtyNumber ";
									paramMaps.remove("smallCheckDetailQtyNumber");
								}
								if(action.equals("ge")){
									conStr +=" and b.checkDetailQtyNumber >= :smallCheckDetailQtyNumber ";
									paramMaps.remove("bigCheckDetailQtyNumber");
								}
								break;
	
			}
		}
		String sql =  " SELECT "+
			   " a.*, b.checkDetailQtyNumber FROM "+
			   " (SELECT CONCAT(userinfo.name,'(', bssuser.username,')')  AS username , "+
			   " COUNT(DISTINCT logsum.id) AS checkNumber,"+
			   " COUNT(IF(logdetail.handletype='checkRefused',TRUE,NULL)) AS khrefusedNumber, "+
			   " COUNT(IF(logdetail.handletype='checkFailed',TRUE,NULL)) AS checkRefusedNumber, "+
			   " COUNT(IF(logdetail.handletype='checkAgainFailed',TRUE,NULL)) AS checkAgainRefusedNumber, "+
			   " COUNT(IF(logdetail.handletype='KHBackout',TRUE,NULL)) AS khbackOutNumber, "+
			   " AVG(TIMESTAMPDIFF(minute,logsum.checkBeginDate,logsum.checkSuccessDate)) as checkTimeNumber "+//审核完成时间减去审核开始时间
			   " FROM "+
			   " t_simple_sales_order_log_sum logsum "+
			   " JOIN t_bss_sys_user bssuser ON (bssuser.id = logsum.customerServiceId) "+
			   " LEFT JOIN t_simple_sales_order_log logdetail ON (logdetail.uuid = logsum.id) "+
			   " LEFT JOIN t_crm_user_info userinfo ON (  userinfo.id = bssuser.userInfo_id ) "+
			   " WHERE 1 = 1 "+
			   " GROUP BY bssuser.username "+
			   " HAVING 1 = 1) a "+
			   " JOIN "+
			   " (SELECT CONCAT(userinfo.name,'(', bssuser.username,')')  AS username , "+
			   " (COUNT(DISTINCT ocrdetail.id)/ COUNT(DISTINCT ocrorder.id)) AS checkDetailQtyNumber , logsum.checkBeginDate "+
			   " FROM "+
			   " t_simple_sales_order_log_sum logsum "+
			   " LEFT JOIN t_ocr_saleorder ocrorder ON (ocrorder.uuid = logsum.id) "+
			   " LEFT JOIN t_ocr_saleorderdetail ocrdetail  ON (ocrdetail.sales_id = ocrorder.id) "+
			   " JOIN t_bss_sys_user bssuser ON (bssuser.id = logsum.customerServiceId) "+
			   " LEFT JOIN t_crm_user_info userinfo ON (userinfo.id = bssuser.userInfo_id) "+
			   " WHERE 1 = 1 "+
			   " GROUP BY bssuser.username "+
			   " HAVING 1 = 1) b "+
			   " ON a.username = b.username "+
			   " where 1= 1 ";
		String sqlAccout = "select count(*) from (" + sql + conStr+ " ) t ";
		Query queryCount = dao.getHibSession().createSQLQuery(sqlAccout);
		dao.bindParamToQueryByName(queryCount, paramMaps);
		Long count =Long.valueOf(queryCount.list().get(0).toString());
		int startNum = bso.getPagesize() * (bso.getPagenum());
		int pageSize = bso.getPagesize();
		String limitString = " limit " + startNum + "," + pageSize;
		Query queryCountList= dao.getHibSession().createSQLQuery(sql + conStr+ limitString);//加limit
		dao.bindParamToQueryByName(queryCountList, paramMaps);
		List<PerformanceVO> listvo = queryCountList.list();
		List<PerformanceVO> endLists=new ArrayList<>();
		for (Object array : listvo) {
			PerformanceVO vo = new PerformanceVO((Object[]) array,null);
			endLists.add(vo);
		}
		BaseModelList<PerformanceVO> end = new BaseModelList<PerformanceVO>(count,
				WebUtil.getEntryListFromProxyList(endLists, dao));
		return end;
		
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public SalesOrderListVo enterGrap() {
		//查询所有待抢单的id
		String idSql=" select logsum.id from t_simple_sales_order_log_sum logsum  where logsum.orderApprovalStatus = 'stayOrder'  "
				+ " order by orderApprovalStatus DESC , serviceType  ,createDate ASC limit 20 " ;
		List listIds = dao.executeQuerySql(idSql, null); 
		Long successId = null ;
		for(int i=0;i<listIds.size();i++){
			try {
				successId = approvalStatusService.orderSuccess(Long.valueOf(listIds.get(i).toString()));
			} catch (Exception e) {
				if("抱歉，您有单子等待制单，请制单完成后在进行抢单哦。".equals(e.getMessage())){
					throw new OperationException(e.getMessage());
				}else{
					e.printStackTrace();
				}
			}
			if(successId!=null){
				break;
			}
		}
		if(successId==null){
			throw new OperationException("该页面所有单据都已被抢，请刷新页面重新抢单");
		}
		String sql = " SELECT " + " logsum.orderNumber AS orderNumber," + " logsum.serviceType AS serviceType ,"
				+ " logsum.orderApprovalStatus AS orderType ," 
				+ " logsum.createDate AS submitDate ,"
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
				+ " LEFT JOIN t_crm_user_info userinfoe ON (userinfoe.id = towner.enterpriseInfo_id) where 1=1 and logsum.id=:successId ";
		Map<String, Object> paramMaps = new HashMap<String, Object>();
		paramMaps.put("successId", successId);
		Query queryCountList= dao.getHibSession().createSQLQuery(sql);
		dao.bindParamToQueryByName(queryCountList, paramMaps);
		List<SalesOrderListVo> listvo = queryCountList.list();
		List<SalesOrderListVo> list = new ArrayList<SalesOrderListVo>();
		for (Object array : listvo) {
			SalesOrderListVo vo = new SalesOrderListVo((Object[]) array);
			list.add(vo);
		}
		return list.get(0);
	}

	
	void removelist(List<PerformanceVO> endLists1,List<PerformanceVO> endLists2){
		/**
		 * 先出去两个list中非公共的部分
		 * 只保留公共用户名的部分
		 */
		Set<String> set = new HashSet<>();
		for(PerformanceVO vo :endLists1){
			for(PerformanceVO vo2 :endLists2){
				if(vo.getUsername().equals(vo2.getUsername())){
					set.add(vo2.getUsername());
				}
			}
		}
		Iterator<PerformanceVO> it1 = endLists1.iterator();
		while(it1.hasNext()){
			PerformanceVO performanceVO = it1.next();
			if(!set.contains(performanceVO.getUsername())){
				it1.remove();
			}
		}
		Iterator<PerformanceVO> it2 = endLists2.iterator();
		while(it2.hasNext()){
			PerformanceVO performanceVO = it2.next();
			if(!set.contains(performanceVO.getUsername())){
				it2.remove();
			}
		}
	}
	
}












