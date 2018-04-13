package com.zqw.bss.service.biz.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.account.framework.util.StringUtil;
import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.biz.OcrSaleOrder;
import com.zqw.bss.model.biz.OcrSaleOrderBill;
import com.zqw.bss.model.biz.OcrSaleOrderDetail;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.sys.InformationLogs;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.biz.ApprovalStatusService;
import com.zqw.bss.service.biz.OverviewService;
import com.zqw.bss.util.CalUtil;
import com.zqw.bss.util.HibernateUtil;
import com.zqw.bss.util.PushUtilWM;
import com.zqw.bss.util.RedisHelper;
import com.zqw.bss.util.SymbolUtil;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.InformationType;
import com.zqw.bss.util.SystemConstant.KFRejectReason;
import com.zqw.bss.util.SystemConstant.OrderApprovalStatus;
import com.zqw.bss.util.SystemConstant.WeightUnit;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.biz.InformationSaveVo;
import com.zqw.bss.vo.biz.KFReject;
import com.zqw.bss.vo.biz.OrderSalesLogs;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.biz.SalesOrderLogVo;
import com.zqw.bss.vo.biz.WaitOrderListVo;

import mondrian.rolap.BitKey.Big;

@Service
@Qualifier("overviewService")
public class ApprovalStatusServiceImpl implements ApprovalStatusService  {
	private final Logger logger = Logger.getLogger(ApprovalStatusServiceImpl.class);
	 
	@Autowired
	protected DAO dao;
	/**
	 * 审核不通过
	 * 复核不通过
	 * 已抢单
	 * 客户重新提交
	 * 客户拒绝
	 * 非审核人可编辑的状态
	 */
	String[] updateStatus = {"orderSuccess","checkFailed","checkAgainFailed","KHSubmitAgain","checkRefused"};
	/**
	 * 复核中
	 * 审核中
	 * 其他审核人不可查看的状态
	 * 也是审核人可以审批的状态
	 */
	String[] checkStatus = {"checkingAgain","checking"};
	/**
	 * 抢单操作
	 * 权限 被删除的单子不可以抢,已经被抢的不可以抢
	 * 传入的是uuid
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Long orderSuccess(Long uuid) {
		String transactionSql = " UPDATE t_simple_sales_order_log_sum logsum SET orderSuccessDate = now()  where id = ? ";
		dao.executeSql(transactionSql, new Long[]{uuid});//先执行一条update语句 保证这个条记录不会被另一个事物更改
		Long userInfoId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		// 判断此单据的状态是否已经被抢过
		String selectOrder = " select orderApprovalStatus from t_simple_sales_order_log_sum where id= ?  ";
		List orderApprovalStatus = dao.executeQuerySql(selectOrder, new Long[]{uuid});
		if(orderApprovalStatus.size()==0){
			throw new OperationException("该单据已经被客户撤销了 请继续抢其他的单子哦。");
		}
		if (orderApprovalStatus.size()>0&&!orderApprovalStatus.get(0).equals("stayOrder")) {
			throw new OperationException("抱歉，手慢了 已经被抢了哦。");
		}
		//判断客服有没有未完成的单子(已抢单)
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_createBy]")){
			String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
			String selectIdSql= " SELECT id FROM t_bss_sys_user WHERE username =? ";
			List ids =dao.executeQuerySql(selectIdSql, new String[]{username});
			String canFlagSql = " select id from t_simple_sales_order_log_sum where customerServiceId =? and orderApprovalStatus='orderSuccess' ";
			List lists = dao.executeQuerySql(canFlagSql, new Object[]{ids.get(0)});
			if(lists!=null&&lists.size()>0){
				throw new OperationException("抱歉，您有单子等待制单，请制单完成后在进行抢单哦。");
			}
		}
		updateOrder(OrderApprovalStatus.orderSuccess.toString(), uuid);
		insertLog(OrderApprovalStatus.orderSuccess.toString(),null,null,uuid,null,getOrderId(uuid));
		// 获取bss客服人员 系统表中的id
		String selectUser = " SELECT id , username FROM t_bss_sys_user bsssysuser WHERE userInfo_id = ? "; 
		Map<String, String> maps = new HashMap<String, String>();
		List list = dao.executeQuerySql(selectUser, new Long[]{userInfoId});
		for (Object o : list) {
			Object[] c = (Object[]) o;
			maps.put(c[0].toString(), c[1].toString());
		}
		Long customerServiceId = null;
		for (String key : maps.keySet()) {
			customerServiceId = Long.valueOf(key);
		}
		String updateSumLog = " UPDATE t_simple_sales_order_log_sum logsum SET  customerServiceId = ? where id = ? ";
		dao.executeSql(updateSumLog, new Long[]{customerServiceId,uuid});
		return uuid;
	}
	/**
	 * 保存销售单
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public OcrSaleOrder save(OcrSaleOrder ocrSaleOrder) {
		checkAmt(ocrSaleOrder);
		/**
		 * 添加日志详情 
		 */
		insertLog(OrderApprovalStatus.orderSubmit.toString(),null,null,ocrSaleOrder.getUuid(),null,getOrderId(ocrSaleOrder.getUuid()));// 增加日志记录v 提交
		ocrSaleOrder.setSubmitRemark("");
		String sql = " SELECT  orderNumber FROM t_simple_sales_order WHERE id =?";
		List<String>  lists = dao.executeQuerySql(sql, new Long[]{ocrSaleOrder.getSimpleOrderId()});
		ocrSaleOrder.setOrderNumber(lists.get(0));
		dao.save(ocrSaleOrder);
		/**
		 * 改变这个销售单的ocr状态(从抢单成功改成提交) 改成 想办法获取销售单的id
		 */
		updateOrder(OrderApprovalStatus.orderSubmit.toString(), ocrSaleOrder.getUuid());
		/**
		 * 改变日志汇总的信息 增加提交时间
		 */
		updateLogSum(ocrSaleOrder.getUuid());
		RedisHelper.publish("q:sh:ocr:request","ocr:checkOrder");
		return ocrSaleOrder;
	}

	/**
	 * 插入一条日志
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean insertLog(String handleType ,String checkRemark,String submitRemark ,Long uuid,String rejectRemark,Long orderId) {
		// TODO Auto-generated method stub
		Long userInfoId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		// 获取bss客服人员 系统表中的id
		String selectUser = " SELECT id , username FROM t_bss_sys_user bsssysuser WHERE userInfo_id =? ";
		Map<String, String> maps = new HashMap<String, String>();
		List list = dao.executeQuerySql(selectUser, new Long[]{userInfoId});
		for (Object o : list) {
			Object[] c = (Object[]) o;
			maps.put(c[0].toString(), c[1].toString());
		}
		String customerName = null;
		for (String value : maps.values()) {
			customerName = value;
		}
		// 插入一条日志
		String insertSql = " INSERT INTO t_simple_sales_order_log ( createBy, createDate,handleDate, handleType , checkRemark , submitRemark ,uuid ,rejectRemark ,salesOrder_id ) "
				+ " VALUES " + " ( ? , now() , now() , ? , ? , ? , ? , ? , ? ) ";
		Object[] params = {customerName,handleType,checkRemark,submitRemark,uuid,rejectRemark,orderId};
		dao.executeSql(insertSql, params);
		return true;
	}

	/**
	 * 改变销售单的审批状态 需要传入uuid
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateOrder(String handleType, Long id) {
		// 改变单子的状态
		String updateOrder = " UPDATE t_simple_sales_order_log_sum  SET orderApprovalStatus = ? where id= ? ";
		dao.executeSql(updateOrder, new Object[]{handleType,id});
		return true;
	}

	/**
	 * 更新日志汇总
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateLogSum(Long id) {
		// TODO Auto-generated method stub
		String updateLogSum = " UPDATE t_simple_sales_order_log_sum  SET orderSubmitDate = now() where id= ? ";
		dao.executeSql(updateLogSum, new Long[]{id});
		return true;
	}


	/**
	 * 审批接口
	 * 权限 只有提交和再次提交的状态下可以审核 并且审核不通过的理由不能为空
	 * uuid
	 */
	@Override
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean orderSuccessorderSalesLogs(OrderSalesLogs orderSalesLogs) {
		if(StringUtil.isEmpty(orderSalesLogs.getOrderApprovalStatus())){
			throw new OperationException("审批状态不能为空");
		}
		SimpleDateFormat timeFmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS");
		
		//审批前判断状态
		String checkSql = "SELECT orderApprovalStatus FROM t_simple_sales_order_log_sum WHERE id = ? ";
		List<String> lists2 = dao.executeQuerySql(checkSql, new Long[]{orderSalesLogs.getId()});
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_createBy]")){
			throw new OperationException("制单人没有审批权限");
		}
		if(!Arrays.asList(checkStatus).contains(lists2.get(0))){
			throw new OperationException(SystemConstant.getDict().get(lists2.get(0))+"此状态不可审核");
		}
		if((orderSalesLogs.getOrderApprovalStatus().equals("checkFailed")||orderSalesLogs.getOrderApprovalStatus().equals("checkAgainFailed"))&&(orderSalesLogs.getRemark()==null||orderSalesLogs.getRemark().equals(""))){
			throw new OperationException("审核不通过理由不能为空");
		}
		//处理审批开始时间
		if(orderSalesLogs.getOrderApprovalStatus().equals("checkFailed")||orderSalesLogs.getOrderApprovalStatus().equals("checkSuccess")){
//			String dateSql  = " select checkBeginDateSelf from  t_simple_sales_order_log_sum where id = "+orderSalesLogs.getId()+" ";
//			List<Date> dates =dao.executeQuerySql(dateSql, null);
//			if(dates!=null&&dates.size()>0){//把Self的时间更新到审批开始时间
//				Timestamp time = new Timestamp(dates.get(0).getTime());
				String updateSql = " UPDATE t_simple_sales_order_log_sum SET checkSuccessDate= now(),remark = ? ,orderApprovalStatus = ?  WHERE id= ? ";
				dao.executeSql(updateSql, new Object[]{ orderSalesLogs.getRemark(),orderSalesLogs.getOrderApprovalStatus(),orderSalesLogs.getId()});
	//		}//复核
		}else if(orderSalesLogs.getOrderApprovalStatus().equals("checkAgainFailed")||orderSalesLogs.getOrderApprovalStatus().equals("checkAgainSuccess")){
//			String dateSql  = " select checkAgainBeginDateSelf from  t_simple_sales_order_log_sum where id = "+orderSalesLogs.getId()+" ";
//			List<Date> dates =dao.executeQuerySql(dateSql, null);
//			if(dates!=null&&dates.size()>0){//把Self的时间更新到审批开始时间
//				Timestamp time = new Timestamp(dates.get(0).getTime());
				String updateSql = " UPDATE t_simple_sales_order_log_sum SET checkAgainSuccessDate = now(),remark = ? ,orderApprovalStatus = ? WHERE id= ? ";
				dao.executeSql(updateSql, new Object[]{ orderSalesLogs.getRemark(),orderSalesLogs.getOrderApprovalStatus(),orderSalesLogs.getId()});
		//	}
		}else{
			throw new OperationException("审批状态参数不合法"+orderSalesLogs.getOrderApprovalStatus());
		}
		insertLog(orderSalesLogs.getOrderApprovalStatus(),orderSalesLogs.getRemark(),null,orderSalesLogs.getId(),null,getOrderId(orderSalesLogs.getId()));//uuid
		if (!orderSalesLogs.getOrderApprovalStatus().toString().equals("checkSuccess")
				&& !orderSalesLogs.getOrderApprovalStatus().toString().equals("checkAgainSuccess")) {
			return false;
		}
		
		/**
		 * 审批/再次审批成功
		 * 改变销售单的类型 从ocring-->ocred  TODO
		 * save一条消息
		 * 获取销售单的id
		 */
		Long salesOrderId = getOrderId(orderSalesLogs.getId());
		updateOrderType(salesOrderId);
		String sql = " SELECT "+
					 " towner.loginId  AS creatBy, "+
					 " saleorder.ownerId, "+
					 " saleorder.orderNumber ,"+
					 " saleorder.id , sysuser.id AS sysuserid "+
					 " FROM "+
					 " t_simple_sales_order saleorder "+
					 " JOIN t_crm_owner towner "+
					 "  ON ( saleorder.ownerId = towner.id  ) "+
					 "  JOIN t_sys_user sysuser ON (sysuser.username=towner.loginId ) " +
					 "  WHERE saleorder.id = "+salesOrderId+" "+
					 "  UNION "+
					 " SELECT "+
					 " saleorder.createBy AS createBy, "+
					 " saleorder.ownerId, "+
					 " saleorder.orderNumber, "+
					 " saleorder.id , sysuser.id AS sysuserid  "+
					 " FROM "+
					 " t_simple_sales_order saleorder "+
					 " JOIN t_crm_owner towner "+
					 " ON ( saleorder.ownerId = towner.id ) "+
					 " JOIN t_sys_user sysuser ON (sysuser.username= saleorder.createBy ) " +
					 " WHERE saleorder.id = "+salesOrderId+" ";
		List<InformationSaveVo> vos =  dao.executeQuerySql(sql, null);
		final List<InformationSaveVo> lists = new ArrayList<>();
		for (Object array : vos) {
			InformationSaveVo vo = new InformationSaveVo((Object[]) array);
			lists.add(vo);
		}
		MyThread MyThread  = new MyThread(lists,true,"");
		Thread t = new Thread(MyThread);
		t.start();
		return true;
	}
	@Override
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<OrderSalesLogs> orderSalesLogsList(Long salesId) {
		List<OrderSalesLogs> listVo = dao.executeQuerySql(
				"select id,handletype,checkRemark ,submitRemark ,createBy ,handleDate  from t_simple_sales_order_log where handleDate IS NOT NULL and uuid = " + salesId,
				null);
		List<OrderSalesLogs> list = new ArrayList<OrderSalesLogs>();
		for (Object rsArray : listVo) {
			OrderSalesLogs vo = new OrderSalesLogs((Object[]) rsArray);
			list.add(vo);
		}
		return list;
	}

	/**
	 * 编辑销售单 区分是提交和再次提交
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public OcrSaleOrder updateOrder(OcrSaleOrder ocrSaleOrder) {
		if(ocrSaleOrder.getId()==null){
			throw new OperationException("编辑失败销售单id不能为空");
		}
		if(ocrSaleOrder.getOcrSaleOrderAddress()==null){
			throw new OperationException("地址不能为null");
		}
		checkAmt(ocrSaleOrder);
		/**
		 * 编辑前检查单据的状态
		 */
		String checkSql = "SELECT orderType FROM t_simple_sales_order WHERE id = "+ocrSaleOrder.getSimpleOrderId()+" ";
		List<String> lists = dao.executeQuerySql(checkSql, null);
		if(lists.get(0).equals("complete")){
			throw new OperationException("此单据已经客户通过, 不可编辑!");
		}
		if(lists.get(0).equals("normal")){
			throw new OperationException("此单据已经客户通过, 不可编辑!");
		}
		/**
		 * 解决单号的bug
		 */
		String sql2 = " SELECT  orderNumber FROM t_simple_sales_order WHERE id = "+ocrSaleOrder.getSimpleOrderId()+"";
		List<String>  lists2 = dao.executeQuerySql(sql2, null);
		ocrSaleOrder.setOrderNumber(lists2.get(0));
		dao.update(ocrSaleOrder);
		String sql = "SELECT orderApprovalStatus FROM t_simple_sales_order_log_sum WHERE salesOrder_id = " +ocrSaleOrder.getSimpleOrderId()+" ";
		List<String> flag = dao.executeQuerySql(sql, null);
		int i  = flag.size()-1;
		if(flag.get(i).equals("orderSuccess")){//这些状态下  下面是提交
			/**
			 * 添加日志详情
			 */
			insertLog(OrderApprovalStatus.orderSubmit.toString(),null,null,ocrSaleOrder.getUuid(),null,getOrderId(ocrSaleOrder.getUuid()));// 增加日志记录v 提交
			/**
			 * 改变这个销售单的ocr状态(从抢单成功改成提交) 改成 想办法获取销售单的id
			 */
			updateOrder(OrderApprovalStatus.orderSubmit.toString(), ocrSaleOrder.getUuid());
		}else{
			if(ocrSaleOrder.getSubmitRemark()==null||ocrSaleOrder.getSubmitRemark().trim().equals("")){
				throw new OperationException("再次提交理由不能为空");
			}
			/**
			 * 添加日志详情
			 */
			insertLog(OrderApprovalStatus.orderSubmitAgain.toString(),null,ocrSaleOrder.getSubmitRemark(),ocrSaleOrder.getUuid(),null,getOrderId(ocrSaleOrder.getUuid()));// 增加日志记录v 提交
			/**
			 * 改变这个销售单的ocr状态(再次提交) 改成 想办法获取销售单的id
			 */
			updateOrder(OrderApprovalStatus.orderSubmitAgain.toString(), ocrSaleOrder.getUuid());
		}
		/**
		 * 改变日志汇总的信息 增加提交时间
		 */
		updateLogSum(ocrSaleOrder.getUuid());
		RedisHelper.publish("q:sh:ocr:request","ocr:checkOrder");
		return ocrSaleOrder;
	}
	
	/**
	 * 改变销售单的类型 从ocring-->ocred
	 */
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public void updateOrderType(Long id){
		String updateOrder = " UPDATE t_simple_sales_order  SET orderType = 'ocred' where id= ? ";
		dao.executeSql(updateOrder, new Long[]{id});
	}
	
	/**
	 * 检查优惠金额和订单总额之间的关系
	 */
	private void checkAmt(OcrSaleOrder ocrSaleOrder){
		String sql = "SELECT orderApprovalStatus FROM t_simple_sales_order_log_sum WHERE salesOrder_id = ? ";
		List<String> exceptionFlag = dao.executeQuerySql(sql, new Long[]{ocrSaleOrder.getSimpleOrderId()});
		int k  = exceptionFlag.size()-1;
		if(!Arrays.asList(updateStatus).contains(exceptionFlag.get(k))){
			String exception = SystemConstant.getDict().get(exceptionFlag.get(k));
			throw new  OperationException(exception+"下不可编辑");
		}
		if(SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES).toString().equals("[Ocr_auditor]")){
			throw new  OperationException("审核人不可编辑");
		}
		if(ocrSaleOrder.getSimpleOrderId()==null){
			throw new  OperationException("销售单ID不能为空");
		}
		if(ocrSaleOrder.getUuid()==null){
			throw new  OperationException("UUID不能为空");
		}
		if(ocrSaleOrder.getOcrSaleOrderDetail().size()==0){
			throw new  OperationException("销售单详情不能为空");
		}
		if(ocrSaleOrder.getOrderDate()!=null&&ocrSaleOrder.getDeliveryDate()!=null){
			if(ocrSaleOrder.getOrderDate().after(ocrSaleOrder.getDeliveryDate())){
				throw new OperationException("送货日期不能小于销售日期");
			}
		}
		//布匹
		if(ocrSaleOrder.getYardsFlag()==null){
			ocrSaleOrder.setYardsFlag(false);
		}
		//折扣
		if(ocrSaleOrder.getDiscountFlag()==null){
			ocrSaleOrder.setDiscountFlag(false);
		}
		if(ocrSaleOrder.getYardsFlag()!=null&&ocrSaleOrder.getYardsFlag().equals(true)&&"Y".equals(ocrSaleOrder.getGoodsBinning())){
			ocrSaleOrder.setGoodsBinning("N");
		}
		if(ocrSaleOrder.getOcrSaleOrderAddress()!=null&&ocrSaleOrder.getOcrSaleOrderAddress().size()>0&&ocrSaleOrder.getDeliveryAddress()==null){
			throw new OperationException("deliveryAddress没有传过来");
		}
		if(ocrSaleOrder.getProductunitFlag()!=null&&ocrSaleOrder.getProductunitFlag().equals(true)){
			if("Y".equals(ocrSaleOrder.getGoodsBinning())){
				throw new OperationException("单位和装箱不能同时打开");
			}
		}
		BigDecimal cheapAmt = ocrSaleOrder.getCheapAmt();
		BigDecimal totalAmt = BigDecimal.ZERO;
		BigDecimal alreadyDeliverAmt = BigDecimal.ZERO;
		Boolean unitFlag = false;
		if(ocrSaleOrder.getProductKgFlag()==null){
			throw new OperationException("是否开启重量字段不能为空");
		}
		//校验重量
		if(Boolean.TRUE.equals(ocrSaleOrder.getProductKgFlag())){
			if(!WeightUnit.kg.equals(ocrSaleOrder.getWeightUnit())&&!WeightUnit.g.equals(ocrSaleOrder.getWeightUnit())){
				throw new OperationException("已经开启重量,重量单位字段非法");
			}
			if(ocrSaleOrder.getWeightWay()==null){
				throw new OperationException("已经开启重量,重量计算方式字段不能为空");
			}
		}
		for(OcrSaleOrderDetail detail: ocrSaleOrder.getOcrSaleOrderDetail()){
			/**
			 * 如果没开公式 设置默认值
			 */
			if("Y".equals(ocrSaleOrder.getGoodsBinning())){
				if(detail.getTotalCartons()==null){
					throw new OperationException("开启装箱总箱数不能为空");
				}
				if(detail.getEachCartons()==null){
					throw new OperationException("开启装箱每箱数量不能为空");
				}
			}
			if(Boolean.TRUE.equals(ocrSaleOrder.getProductMeasFlag())){
				if(ocrSaleOrder.getCartonType()==null){
					throw new OperationException("开启外箱尺寸外箱类型不能为空");
				}
			}
			if(ocrSaleOrder.getCustomFormulaFlag()==null){
				throw new  OperationException("CustomFormulaFlag不能为空");
			}else if(ocrSaleOrder.getCustomFormulaFlag().equals(true)){
				if(StringUtil.isEmpty(detail.getAmountFormula())||StringUtil.isEmpty(detail.getInventoryQtyFormula())){
					throw new  OperationException("已经开启公式,销售单详情公式不能为空");
				}
			}else{//没开公式
				if(!StringUtil.isEmpty(detail.getAmountFormula())||!StringUtil.isEmpty(detail.getInventoryQtyFormula())){//没开公式，公式不为空 校验
					if(!"price * qty".equals(detail.getAmountFormula())||!"qty".equals(detail.getInventoryQtyFormula())){
						throw new  OperationException("未开启公式,销售单详情公式有误");
					}
				}
				detail.setInventoryQtyFormula("qty");
				detail.setAmountFormula("price * qty");
			}
			//校验公式计算金额的值
			//外箱尺寸meas
			//单价price
			//重量weight
			//每箱数量eachCartons
			//总箱数totalCartons
			//总数量qty
			String amtFormula = detail.getAmountFormula();
			String inventoryQtyFormula=detail.getInventoryQtyFormula();
			Map<String, Object> paramsMap = new HashMap<String, Object>();
			BigDecimal volum =BigDecimal.ZERO;
			if(detail.getVolume()==null){//开启的是长宽高
				if(detail.getAltitude()!=null&&detail.getExtent()!=null&&detail.getBreadth()!=null){
					volum =  (detail.getAltitude()).multiply(detail.getExtent()).multiply(detail.getBreadth()).setScale(6,BigDecimal.ROUND_HALF_UP);
				}
			}else{
				volum=detail.getVolume();
			}
			 if(amtFormula.contains("meas")||inventoryQtyFormula.contains("meas")){
				 if(!Boolean.TRUE.equals(ocrSaleOrder.getProductMeasFlag())){
					 throw new  OperationException("公式中有外箱尺寸,销售单必须开启外箱尺寸");
				 }
				 paramsMap.put("meas", volum);
			 }
			if(amtFormula.contains("weight")||inventoryQtyFormula.contains("weight")){
				 if(detail.getWeight()==null){
					 throw new  OperationException("公式中有重量,销售单详情重量字段不能为空");
				 }
				 if(!Boolean.TRUE.equals(ocrSaleOrder.getProductKgFlag())){
					 throw new  OperationException("公式中有重量,销售单重量字段必须为true(如果列表中没有重量，请反馈客服！)");
				 }
				 paramsMap.put("weight", detail.getWeight());
			 }
			if(amtFormula.contains("eachCartons")||inventoryQtyFormula.contains("eachCartons")){
				if(detail.getEachCartons()==null){
					 throw new  OperationException("公式中有装箱,销售单详情每箱数量字段不能为空");
				 }
				 if(!"Y".equals(ocrSaleOrder.getGoodsBinning())){
					 throw new  OperationException("公式中有装箱，单据必须开启装箱");
				 }
				paramsMap.put("eachCartons", detail.getEachCartons());
			}
			if(amtFormula.contains("totalCartons")||inventoryQtyFormula.contains("totalCartons")){
				 if(detail.getTotalCartons()==null){
					 throw new  OperationException("公式中有装箱,销售单详情总箱数字段不能为空");
				 }
				 if(!"Y".equals(ocrSaleOrder.getGoodsBinning())){
					 throw new  OperationException("公式中有装箱，单据必须开启装箱");
				 }
				 paramsMap.put("totalCartons", detail.getTotalCartons());
			 }
			paramsMap.put("price", detail.getPriceBefore());
			paramsMap.put("qty", detail.getQty());
			BigDecimal amt =BigDecimal.ZERO;
			try {
				amt=CalUtil.execBigDecimal(amtFormula, paramsMap);
			
			} catch (Exception e) {
				throw new  OperationException("金额公式计算错误");
			}
			if(ocrSaleOrder.getProductunitFlag()==null){
				throw new  OperationException("ProductunitFlag不能为空");
			}else if(ocrSaleOrder.getProductunitFlag().equals(true)){
				if(detail.getUnitsFlag()==null){
					throw new  OperationException("unitsFlag不能为空");
				}
			}
			
			if(!StringUtil.isEmpty(detail.getUnit())){
				unitFlag = true;
			}
			if(detail.getProductName().equals("拍照产品")){
				throw new  OperationException("拍照产品被禁用");
			}
			if(detail.getQty()==null){
				throw new  OperationException("订单详情数量不能为空");
			}
			if(detail.getQty().compareTo(BigDecimal.ZERO)==-1){
				throw new  OperationException("订单详情数量不能为负数");
			}
			if(detail.getPriceBefore()==null){
				throw new  OperationException("订单详情单价不能为空");
			}
			if(detail.getProductName()==null||detail.getProductName().equals("")){
				throw new  OperationException("产品名称不能为空");
			}
			detail.setReportQty(detail.getQty());
			//这两行代码不能放到数量换算的下面
		//	totalAmt =  totalAmt.add(detail.getQty().multiply(detail.getPriceBefore()));
			totalAmt =  totalAmt.add(amt);//总金额公式
			paramsMap.put("qty", detail.getDeliveryQtyNow());
			BigDecimal deliverAmt = BigDecimal.ZERO;
			deliverAmt =CalUtil.execBigDecimal(amtFormula, paramsMap);//已送货公式
			alreadyDeliverAmt = alreadyDeliverAmt.add(deliverAmt);
			
			//校验折扣
			if(Boolean.FALSE.equals(ocrSaleOrder.getDiscountFlag())){
				if(detail.getDiscount()!=null){
					throw new OperationException("没开启折扣 折扣率不需要传");
				}
				if(detail.getOriginalPrice()!=null){
					throw new OperationException("没开启折扣 原价段不需要传");
				}
			}
			if(Boolean.TRUE.equals(ocrSaleOrder.getDiscountFlag())){
				if(detail.getDiscount()==null){
					throw new OperationException("折扣率字段不能为空");
				}
				if(detail.getOriginalPrice()==null){
					throw new OperationException("原价段不能为空");
				}
				//通过折扣计算出来的价格
				BigDecimal price=detail.getOriginalPrice().multiply(detail.getDiscount());
				if(price.compareTo(detail.getPriceBefore())!=0){
					throw new OperationException("折扣乘以折扣率不等于金额");
				}
			}
			//校验细码乘法
			if(!StringUtil.isEmpty(detail.getYards())){
				if(detail.getYards().contains("，")){
					throw new OperationException("细码中不能有中文逗号");
				}
				String yards[] = detail.getYards().split(",");
				BigDecimal totalQty=BigDecimal.ZERO;
				for(int i=0;i<yards.length;i++){
					try {
						totalQty =totalQty.add(CalUtil.execBigDecimal(yards[i],null));
					}catch (Exception e) {
						throw new OperationException("细码乘法错误");
					}
				}
				if(totalQty.compareTo(detail.getQty())!=0){
					throw new OperationException("细码乘法计算结果有误");
				}
			}
		}
		if(unitFlag){
			if(ocrSaleOrder.getProductunitFlag()==null||ocrSaleOrder.getProductunitFlag().equals(false)){
				throw new  OperationException("销售单详情中有单位，但是销售单没有开启单位");
			}
		}
		if(cheapAmt.compareTo(totalAmt)==1){
			throw new  OperationException("优惠金额不能大于订单总额");
		}
		BigDecimal vatamt = ocrSaleOrder.getVatAmt();
		if(vatamt==null){
			vatamt = BigDecimal.ZERO;
		}
		BigDecimal endAmt = totalAmt.add(vatamt).subtract(cheapAmt);
		endAmt =endAmt.setScale(2, BigDecimal.ROUND_HALF_UP);
		if(endAmt.compareTo(ocrSaleOrder.getTotalAmt())!=0){
			BigDecimal temp = endAmt.subtract(ocrSaleOrder.getTotalAmt()).abs().setScale(2, BigDecimal.ROUND_HALF_UP);
			if(temp.compareTo(BigDecimal.valueOf(0.01))!=0){
				throw new  OperationException("订单详情金额:"+endAmt+"与合同金额:"+ocrSaleOrder.getTotalAmt()+"不等");
			}
		}
		/**
		 * 判断部分送货还是全部送货
		 */
		String flag="quanbu";
		BigDecimal nopaidAmt = BigDecimal.ZERO;
		for(OcrSaleOrderDetail detail: ocrSaleOrder.getOcrSaleOrderDetail()){
			if(detail.getDeliveryQtyNow().compareTo(detail.getQty())==-1){//一旦送货数量 小于总数量 就是部分送货
				flag = "bufen";
				break;
			}
		}
		/**
		 * 计算已收款总额 forApp
		 */
		List<OcrSaleOrderBill> bill = ocrSaleOrder.getOcrSaleOrderBill();
		BigDecimal receiveAmt = BigDecimal.ZERO;
		if(bill!=null&&bill.size()>0){
			for(OcrSaleOrderBill bl:bill){
				receiveAmt =receiveAmt.add(bl.getAmount());
			}
		}
		ocrSaleOrder.setReceivAmt(receiveAmt.setScale(2, BigDecimal.ROUND_HALF_UP));
		ocrSaleOrder.setAlreadyDeliverAmt(alreadyDeliverAmt.setScale(2, BigDecimal.ROUND_HALF_UP));
		if(flag.equals("bufen")){//未收款=已送货金额-已收金额，
			nopaidAmt = alreadyDeliverAmt.subtract(receiveAmt).setScale(2, BigDecimal.ROUND_HALF_UP);
		}else{//未收款=已送货金额+税额-优惠金额-已收金额
			nopaidAmt = alreadyDeliverAmt.subtract(receiveAmt).subtract(ocrSaleOrder.getCheapAmt()).add(
					ocrSaleOrder.getVatAmt()==null?BigDecimal.ZERO:ocrSaleOrder.getVatAmt());
		}
		if(nopaidAmt.compareTo(BigDecimal.ZERO)==-1){
			nopaidAmt =BigDecimal.ZERO;
		}
		ocrSaleOrder.setNopaidAmt(nopaidAmt.setScale(2, BigDecimal.ROUND_HALF_UP));
		/**
		 * 计算体积
		 */
		List<OcrSaleOrderDetail> lists =  ocrSaleOrder.getOcrSaleOrderDetail();
        //计算体积
		BigDecimal volume = BigDecimal.ZERO;
		for(int i=0;i<lists.size();i++){
			if(lists.get(i).getVolume()==null){//开启的是长宽高
				if(lists.get(i).getAltitude()!=null&&lists.get(i).getExtent()!=null&&lists.get(i).getBreadth()!=null){
					volume =  (lists.get(i).getAltitude()).multiply(lists.get(i).getExtent()).multiply(lists.get(i).getBreadth())
							.divide(new BigDecimal(1000000)).setScale(6,BigDecimal.ROUND_HALF_UP);
				}
				ocrSaleOrder.getOcrSaleOrderDetail().get(i).setVolume(volume);
			}
		}
	}

	/**
	 * 客服驳回
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean kfReject(final KFReject kfReject) {
		/**
		 * 获取当前uuid对应销售单的状态
		 */
		String sql =" SELECT  orderApprovalStatus FROM t_simple_sales_order_log_sum WHERE id =? ";
		List<String> strs = dao.executeQuerySql(sql, new Long[]{kfReject.getUuid()});
		String[] rejectStatus = {"checkFailed","checkAgainFailed","orderSuccess","checkRefused","KHSubmitAgain"};
		if(!Arrays.asList(rejectStatus).contains(strs.get(0))){
			throw new  OperationException("只有已抢单，审核不通过，复核拒绝，客户拒绝，客户重新提交状态可以驳回--_--"+SystemConstant.getDict().get(strs.get(0))+"状态不可以驳回");
		}
		/**
		 * 改变这个总揽销售单的ocr状态(从抢单成功改成提交) 改成 想办法获取销售单的id
		 */
		updateOrder(OrderApprovalStatus.KFReject.toString(), kfReject.getUuid());
		//增加驳回日志
		String reason = SystemConstant.getDict().get(kfReject.getRemark());
		if(StringUtil.isEmpty(reason)){
			throw new  OperationException("驳回理由有误");
		}
		insertLog(OrderApprovalStatus.KFReject.toString(),null,null,kfReject.getUuid(),kfReject.getRemark(),getOrderId(kfReject.getUuid()));// 增加日志记录v 提交
		//把销售单转成一个半正常的快捷开单 可以编辑不可删除 可以撤销可以再次提交
		String updateOrder = " UPDATE t_simple_sales_order SET orderType = 'kfocr'  where id= ? ";
		dao.executeSql(updateOrder, new Long[]{getOrderId(kfReject.getUuid())});
		//消息提醒 提交的业务员和老板
		String infoSql = " SELECT "+
				 " towner.loginId  AS creatBy, "+
				 " saleorder.ownerId, "+
				 " saleorder.orderNumber ,"+
				 " saleorder.id , sysuser.id AS sysuserid "+
				 " FROM "+
				 " t_simple_sales_order saleorder "+
				 " JOIN t_crm_owner towner "+
				 "  ON ( saleorder.ownerId = towner.id  ) "+
				 "  JOIN t_sys_user sysuser ON (sysuser.username=towner.loginId ) " +
				 "  WHERE saleorder.id = "+getOrderId(kfReject.getUuid())+" "+
				 "  UNION "+
				 " SELECT "+
				 " saleorder.createBy AS createBy, "+
				 " saleorder.ownerId, "+
				 " saleorder.orderNumber, "+
				 " saleorder.id , sysuser.id AS sysuserid  "+
				 " FROM "+
				 " t_simple_sales_order saleorder "+
				 " JOIN t_crm_owner towner "+
				 " ON ( saleorder.ownerId = towner.id ) "+
				 " JOIN t_sys_user sysuser ON (sysuser.username= saleorder.createBy ) " +
				 " WHERE saleorder.id = "+getOrderId(kfReject.getUuid())+" ";
		List<InformationSaveVo> vos =  dao.executeQuerySql(infoSql, null);
		final List<InformationSaveVo> listInfos = new ArrayList<>();
		for (Object array : vos) {
			InformationSaveVo vo = new InformationSaveVo((Object[]) array);
			listInfos.add(vo);
		}
		MyThread MyThread  = new MyThread(listInfos,false,kfReject.getRemark());
		Thread t = new Thread(MyThread);
		t.start();
		return true;
	} 
	/**
	 * 通过总揽id获取销售单的id
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Long getOrderId(Long uuid){
		String sqlOrderId = " SELECT salesOrder_id FROM t_simple_sales_order_log_sum WHERE id =? ";
		List<BigInteger> strs = dao.executeQuerySql(sqlOrderId, new Long[]{uuid});
		Long salesOrderId = Long.valueOf(strs.get(0).toString());
		return salesOrderId;
	}
	

	/**
	 * 存进去一条消息
	 * ids sysuserid
	 * flag 是false的时候 是客服驳回
	 * true的时候 是审核通过
	 */
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveInformationLogs(List<InformationSaveVo> lists,Boolean flag,String reason) {
		for (InformationSaveVo informationSaveVo : lists) {//id是createby
			InformationLogs InformationLogs = new InformationLogs();
			InformationLogs.setNumber(informationSaveVo.getOrderNumber());
			InformationLogs.setPermission("biz:sales:create");
			if(flag){
				InformationLogs.setContent("快捷开单 "+informationSaveVo.getOrderNumber()+"智能转换为销售合同啦，快去查看！");
				InformationLogs.setBizType("ocred");
			}else{
				if(reason.equals("kfRejectInfo")){
					InformationLogs.setContent("很抱歉,快捷开单 "+informationSaveVo.getOrderNumber()+"智能转换过程中，小秒识别到信息不全，快去完善一下下吧！");
					InformationLogs.setBizType("kfocr");
				}else{
					InformationLogs.setContent("很抱歉,快捷开单 "+informationSaveVo.getOrderNumber()+"智能转换过程中，小秒识别不清您的笔记，快去完善一下下吧！");
					InformationLogs.setBizType("kfocr");
				}
				
			}
			InformationLogs.setOrderNumber(informationSaveVo.getOrderNumber());
			InformationLogs.setTheme("秒账提醒");
			InformationLogs.setCreateBy((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME));//
			InformationLogs.setName(InformationType.OCR);
			InformationLogs.setUsername(informationSaveVo.getCreatBy());//改成sysuser 的userName
			InformationLogs.setBizId(lists.get(0).getSaleOrderId());
			InformationLogs.setFlag(false);
			InformationLogs.setCreateDate(new Date());
			List<BigInteger> ownerIds = dao.executeQuerySql("select ownerId from t_simple_sales_order where id = ?", new Long[]{lists.get(0).getSaleOrderId()});
			InformationLogs.setOwnerId(Long.valueOf(ownerIds.get(0).toString()));
			dao.save(InformationLogs);
		} 
		String ids = "";
		Set<Object> sets = new HashSet<Object>();
		for(InformationSaveVo tempvo :lists){
			sets.add(tempvo.getSysuserid().toString());
		}
		for (Object ownerId : sets) {
			ids += ownerId + ",";
		}
		if(ids.contains(",")){
			ids = ids.substring(0,ids.length()-1);
		}
		String idss[] = ids.split(",");
		Map<String, String> extras = new HashMap<String, String>();
		extras.put("title", "系统提醒");
		extras.put("bizId",lists.get(0).getSaleOrderId().toString());
		try {
			if(flag){
				extras.put("type", "5");
				PushUtilWM.sendPushByAlias("OCR提醒", "快捷开单智能转换为销售合同啦，快去查看！", idss,extras);
			}else{
				if(reason.equals("kfRejectInfo")){
					extras.put("type", "6");
					PushUtilWM.sendPushByAlias("OCR提醒", "智能转换过程中，小秒识别到信息不全，快去完善一下下吧！", idss,extras);
				}else{
					extras.put("type", "6");
					PushUtilWM.sendPushByAlias("OCR提醒", "智能转换过程中，小秒识别不清您的笔记，快去完善一下下吧！", idss,extras);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		//新版本
		//查出所有id放到List中
		List<String> pushIds = new ArrayList<>();
		for (InformationSaveVo informationSaveVo : lists){
			Long[] paramIds = {informationSaveVo.getOwnerID(),informationSaveVo.getSysuserid()};
			String pushSql =" SELECT u.jpushRId FROM t_sys_user_registrationId u where  u.ownerId = ? and u.userId = ? ";
			List<String> registrationIds= dao.executeQuerySql(pushSql , paramIds);
			if(registrationIds!=null&&registrationIds.size()>0){
				for(int i=0;i<registrationIds.size();i++){
					pushIds.add(registrationIds.get(i));
				}
			}
		} 
		try {
			if(flag){
				extras.put("type", "5");
				PushUtilWM.sendPushByRegistrationIds("OCR提醒", "快捷开单智能转换为销售合同啦，快去查看！", pushIds,extras);
			}else{
				if(reason.equals("kfRejectInfo")){
					extras.put("type", "6");
					PushUtilWM.sendPushByRegistrationIds("OCR提醒", "智能转换过程中，小秒识别到信息不全，快去完善一下下吧！", pushIds,extras);
				}else{
					extras.put("type", "6");
					PushUtilWM.sendPushByRegistrationIds("OCR提醒", "智能转换过程中，小秒识别不清您的笔记，快去完善一下下吧！", pushIds,extras);
				}
				
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return true;
	}

	class  MyThread implements Runnable {
			List<InformationSaveVo> lists;
			Boolean flag;
			String reason;
			public  MyThread(List<InformationSaveVo> lists,Boolean flag,String reason) {
				this.flag = flag;
				this.lists=lists;
				this.reason=reason;
			}
			@Override
			public void run() {
				HibernateUtil.runInNewSession(false, new Runnable() {
					@Override
					public void run() {
						saveInformationLogs(lists,flag,reason);
					}
				});
			}
	}
	
}



















