package com.zqw.bss.service.biz;

import java.util.List;

import com.zqw.bss.model.biz.OcrSaleOrder;
import com.zqw.bss.vo.biz.KFReject;
import com.zqw.bss.vo.biz.OrderSalesLogs;

/**
 *	审批状态的接口 
 */
public interface ApprovalStatusService {
	/**
	 *	审批 
	 */
	Boolean orderSuccessorderSalesLogs(OrderSalesLogs orderSalesLogs);
	
	/**
	 * 审批详情
	 */
	List<OrderSalesLogs>  orderSalesLogsList(Long salesId);
	
	/**
	 * 抢单
	 */
	Long orderSuccess(Long id);
	/**
	 * 保存销售单
	 */
	OcrSaleOrder save(OcrSaleOrder ocrSaleOrder);
	/**
	 * 编辑销售单 
	 */
	OcrSaleOrder updateOrder(OcrSaleOrder ocrSaleOrder);
	/**
	 * 增加日志
	 */
	Boolean insertLog(String handleType ,String checkRemark,String submitRemark,Long salesOrderId,String rejectRemark,Long orderId);
	/**
	 *	更改日志汇总 
	 */
	Boolean updateLogSum(Long id);
	
	Boolean updateOrder(String handleType,Long id);

	/**
	 * 客服驳回 
	 */
	Boolean kfReject(KFReject kfReject);
	/**
	 * uuid-->销售单id
	 */
	public Long getOrderId(Long uuid);
}






















