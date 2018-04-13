package com.zqw.bss.service.remote.biz;

import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.model.biz.OcrEnclosureOrder;
import com.zqw.bss.model.biz.OcrSaleOrder;
import com.zqw.bss.vo.biz.KFReject;
import com.zqw.bss.vo.biz.OrderSalesLogs;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.biz.SalesOrderLogVo;
import com.zqw.bss.vo.biz.WaitOrderListVo;

@Path("/overview")
public interface RemoteOverviewService {

	/**
	 * OCR销售单的列表
	 */
	@GET
	@Path("/search/salesorder/byvo/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SalesOrderListVo> getSimpleSalesOrderVo(@PathParam("query") String query);
	
	/**
	 * 导出OCR销售单的列表
	 */
	@GET
	@Path("/search/salesorder/export/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Response exportSalesOrderVo(@PathParam("query") String query);
	
	/**
	 * 拉出所有用户名 用户的姓名 和商户名
	 */
	@GET
	@Path("/searchUserName")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String,String> getUserName();
	
	/**
	 * 拉出所有日志
	 */
	@GET
	@Path("/searchLogInfo/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SalesOrderLogVo> searchLogInfo(@PathParam("query") String query);
	
	/**
	 * 拉出所有附件的日志
	 */
	@GET
	@Path("/searchLogFileInfo/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String,List> searchLogFileInfo(@PathParam("query") String query);
	
	/**
	 * 待抢单列表
	 */
	@GET
	@Path("/waitOrder")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<WaitOrderListVo> waitOrder();
	
	/**
	 * 点击抢单时候的操作
	 */
	@PUT
	@Path("/orderSuccess/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Long orderSuccess(@PathParam("id") Long id);
	
	/**
	 * 客服保存销售单的操作
	 */
	@POST
	@Path("/saveOrder")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public OcrSaleOrder saveOrder(OcrSaleOrder ocrSaleOrder);
	
	/**
	 * 客服查询已经提交的单子
	 * 如果是审批人查看 记录审批开始的时间
	 */
	@GET
	@Path("/getOrder/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public OcrSaleOrder getOrder(@PathParam("id") Long id);
	
	/**
	 * OCR销售单的列表
	 */
	@GET
	@Path("/search/orderlist/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SalesOrderListVo> getSimpleSalesOrderVoList(@PathParam("query") String query);
	
	
	/**
	 * 审批
	 */
	@POST
	@Path("/orderSalesLogs")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean orderSuccessorderSalesLogs(OrderSalesLogs orderSalesLogs);
	
	/**
	 * 审批详细
	 */
	@GET
	@Path("/orderSalesLogs/getlist/{salesId}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<OrderSalesLogs>  orderSalesLogsList(@PathParam("salesId")Long salesId);
	
	/**
	 * 客服编辑销售单的操作
	 */
	@PUT
	@Path("/updateOrder")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public OcrSaleOrder updateOrder(OcrSaleOrder ocrSaleOrder);
	
	/**
	 * 拉出所有负责人 用户名和姓名
	 */
	
	@GET
	@Path("/getEmployee")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<String> getEmployee();
	
	/**
	 * 客服驳回
	 * uuid   总揽页面的uuid 
	 * remark 驳回理由kfRejectFont，kfRejectInfo
	 */
	@POST
	@Path("/kfReject")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean  kfReject(KFReject kfReject);
	
	/**
	 * 查询:客服驳回状态下的销售单
	 * uuid   总揽页面的uuid 
	 */
	@GET
	@Path("/kfRejectOrder/{uuid}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public OcrEnclosureOrder  kfRejectOrder(@PathParam("uuid")Long uuid);
	
	/**
	 * 查询待审批接口
	 */
	@GET
	@Path("/waitCheck")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<WaitOrderListVo> waitCheck();

}





















