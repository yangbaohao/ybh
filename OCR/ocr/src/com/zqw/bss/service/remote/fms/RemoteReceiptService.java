package com.zqw.bss.service.remote.fms;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.model.fms.Receipt;
import com.zqw.bss.vo.fms.ReceiptListForVo;


/**
 * <p>Title:</p>
 * <p>Descript
import com.zqw.account.vo.biz.DeliveryOrderForListVO;ion: 发票业务接口</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author zhangzhe
 * @date  2016年7月5日 上午10:05:24
 * @version 1.0
 */
@Path("/receipt")
public interface RemoteReceiptService {

	/**
	 * 创建发票
	 * @param receipt 对象
	 * @return Boolean
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean createReceipt(Receipt receipt);
	
	/**
	 * 修改发票
	 * @param receipt对象
	 * @return Boolean
	 */
	@PUT
	@Path("/")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateReceipt(Receipt receipt);
	
//	@POST
//	@Path("/create/sales")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Boolean createSalesReceipt(SalesReceipt receipt);
//
//	@POST
//	@Path("/create/purchase")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Boolean createPurchaseReceipt(PurchaseReceipt receipt);
	
	/**
	 * 删除发票
	 * @param id
	 * @return Boolean
	 */
	@DELETE
	@Path("/del/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delReceipt(@PathParam("id") Long id);

	/**
	 * 通过id获取发票信息
	 * @param id
	 * @return 发票信息
	 */
	@GET
	@Path("/id/{id}/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Receipt getReceiptById(@PathParam("id") Long id,@PathParam("ownerId") Long ownerId);
	
	/**
	 * 查询可以开票的列表
	 * @param 可以开票的列表查询条件(分页查询条件json固定格式)
	 * @return 可以开票的对象列表
	 */
//	@GET
//	@Path("/get/sales/{query}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public BaseModelList<DeliveryOrderForListVO> getSalesReceipt(@PathParam("query") String query);
	
//	/**
//	 * 查询可以收票的列表
//	 * @param 可以收票的列表查询条件(分页查询条件json固定格式)
//	 * @return 可以收票的对象列表
//	 */
//	@GET
//	@Path("/find/purchase/{id}/{query}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public BaseModelList<DeliveryOrderForListVO> getPurchaseReceiptupdate(@PathParam("id")Long id,@PathParam("query") String query);
//	
//	/**
//	 * 查询可以开票的列表
//	 * @param 可以开票的列表查询条件(分页查询条件json固定格式)
//	 * @return 可以开票的对象列表
//	 */
//	@GET
//	@Path("/find/sales/{id}/{query}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public BaseModelList<DeliveryOrderForListVO> getSalesReceiptupdate(@PathParam("id")Long id,@PathParam("query") String query);
	
	/**
	 * 查询可以收票的列表
	 * @param 可以收票的列表查询条件(分页查询条件json固定格式)
	 * @return 可以收票的对象列表
	 */
//	@GET
//	@Path("/get/purchase/{query}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public BaseModelList<DeliveryOrderForListVO> getPurchaseReceipt(@PathParam("query") String query);
	
	
	/**
	 * 分页查询发票列表Vo
	 * @param 发票查询条件(分页查询条件json固定格式)
	 * @return  发票列表Vo
	 * http://127.0.0.1:8080/ACBss/CXF/rs/receipt/search/eyJjb25kaXRpb24iOltdLCJmaWx0ZXJzY291bnQiOjAsImdyb3Vwc2NvdW50IjowLCJzb3J0b3JkZXIiOiJkZXNjIiwicGFnZW51bSI6MCwicGFnZXNpemUiOjIwfQ
	 */
	@GET
	@Path("/search/{ownerId}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	BaseModelList<ReceiptListForVo> searchReceiptListForVo(@PathParam("query") String query,@PathParam("ownerId")Long ownerId);
	
//	@GET
//	@Path("/purchase/totalAmt/{clientId}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Map<String,BigDecimal> getPuechaseTotalAmtByClientName(@PathParam("clientId") Long clientId);
//	
//	@GET
//	@Path("/sales/totalAmt/{clientId}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Map<String,BigDecimal> getSalesTotalAmtByClientName(@PathParam("clientId") Long clientId);
}
