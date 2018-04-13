package com.zqw.bss.service.remote.biz.impl;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;

import org.apache.cxf.message.Message;
import org.apache.cxf.phase.PhaseInterceptorChain;
import org.apache.cxf.transport.http.AbstractHTTPDestination;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.biz.OcrEnclosureOrder;
import com.zqw.bss.model.biz.OcrSaleOrder;
import com.zqw.bss.service.biz.ApprovalStatusService;
import com.zqw.bss.service.biz.OverviewService;
import com.zqw.bss.service.io.ExportService;
import com.zqw.bss.service.remote.biz.RemoteOverviewService;
import com.zqw.bss.vo.biz.KFReject;
import com.zqw.bss.vo.biz.OrderSalesLogs;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.biz.SalesOrderLogVo;
import com.zqw.bss.vo.biz.WaitOrderListVo;

public class RemoteOverviewServiceImpl implements RemoteOverviewService{
	@Autowired
	private OverviewService overviewService;
	@Autowired
	private ApprovalStatusService approvalStatusService;
	@Autowired
	protected ExportService exportService;
	@Override
	public BaseModelList<SalesOrderListVo> getSimpleSalesOrderVo(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return overviewService.getSimpleSalesOrderVo(bso,"search");
	}

	@Override
	public Map<String, String> getUserName() {
		return overviewService.getUserName();
	}

	@Override
	public BaseModelList<SalesOrderLogVo> searchLogInfo(String query) {
		// TODO Auto-generated method stub
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return overviewService.searchLogInfo(bso);
	}

	@Override
	public Map<String,List> searchLogFileInfo(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return overviewService.searchLogFileInfo(bso);
	}

	@Override
	public List<WaitOrderListVo> waitOrder() {
		// TODO Auto-generated method stub
		return overviewService.waitOrder();
	}

	@Override
	public Long orderSuccess(Long id) {
		// TODO Auto-generated method stub
		return approvalStatusService.orderSuccess(id);
	}

	@Override
	public OcrSaleOrder saveOrder(OcrSaleOrder ocrSaleOrder) {
		
		return approvalStatusService.save(ocrSaleOrder);
	}

	@Override
	public OcrSaleOrder getOrder(Long id) {
		// TODO Auto-generated method stub
		return overviewService.getOrder(id);
	}

	@Override
	public BaseModelList<SalesOrderListVo> getSimpleSalesOrderVoList(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return overviewService.getSimpleSalesOrderVoList(bso);
	}

	@Override
	public Boolean orderSuccessorderSalesLogs(OrderSalesLogs orderSalesLogs) {
		// TODO Auto-generated method stub
		return approvalStatusService.orderSuccessorderSalesLogs(orderSalesLogs);
	}

	@Override
	public List<OrderSalesLogs>  orderSalesLogsList(Long salesId) {
		// TODO Auto-generated method stub
		return overviewService.orderSalesLogsList(salesId);
	}

	@Override
	public OcrSaleOrder updateOrder(OcrSaleOrder ocrSaleOrder) {
		// TODO Auto-generated method stub
		return approvalStatusService.updateOrder(ocrSaleOrder);
	}

	@Override
	public List<String> getEmployee() {
		// TODO Auto-generated method stub
		return overviewService.getEmployee();
	}

	@Override
	public Boolean kfReject(KFReject kfReject) {
		// TODO Auto-generated method stub
		return approvalStatusService.kfReject(kfReject);
	}

	@Override
	public OcrEnclosureOrder kfRejectOrder(Long uuid) {
		// TODO Auto-generated method stub
		return overviewService.kfRejectOrder(uuid);
	}

	@Override
	public Response exportSalesOrderVo(String query) {
		Message messageContext = PhaseInterceptorChain.getCurrentMessage();
		HttpServletRequest request = (HttpServletRequest) messageContext.get(AbstractHTTPDestination.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) messageContext.get(AbstractHTTPDestination.HTTP_RESPONSE);
		String query2 = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(query2);
		return exportService.exportSalesOrderVo(request, response, bso);
	}

	@Override
	public List<WaitOrderListVo> waitCheck() {
		// TODO Auto-generated method stub
		return overviewService.waitCheck();
	}
	
}
