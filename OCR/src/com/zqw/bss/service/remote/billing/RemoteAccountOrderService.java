package com.zqw.bss.service.remote.billing;

import java.math.BigDecimal;
import java.util.List;

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
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.vo.billing.AccountOrderHistoryVo;
import com.zqw.bss.vo.billing.AccountOrderVo;

/**
 * <p>Title:</p>
 * <p>Description: 推广账户服务</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author lzy
 * @date 2016年4月15日 上午10:21:24
 * @version 1.0
 */

@Path("/accountorder")
public interface RemoteAccountOrderService {
	
	
	@POST
	@Path("/create")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public AccountOrder saveAccountOrder(AccountOrder accountOrder);
	
	@DELETE
	@Path("/del/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delAccountOrderById(@PathParam("id") Long accountOrderId);
	/**
	 * @param amt(提取佣金)
	 * @param accountOrder
	 * @return
	 */
	@PUT
	@Path("/update/{amt}/{agentId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateAccountOrder(@PathParam("amt") BigDecimal amt,@PathParam("agentId") Long agentId, AccountOrder accountOrder);
	
	@GET
	@Path("/get/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public AccountOrder getAccountOrderById(@PathParam("id") Long accountOrderId);

	@GET
	@Path("/get/accountorder")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<AccountOrder> getAllAccountOrder();
	
	/**
	 * 佣金申请下的
	 * 分页查询账户展示信息
	 * @param 账户展示查询条件(分页查询条件json固定格式)
	 * @return 账户展示信息
	 */
	@GET
	@Path("/search/page/{flag}/{query}")
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<AccountOrderVo> findAccountOrder(@PathParam("flag") Long flag, @PathParam("query") String query);
	
	 /**
     * 分页获取订单信息
     * @param query
     * @return BaseModelList<AccountOrder>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<AccountOrderHistoryVo> getAllAccountOrder(@PathParam("query") String query);
	
}
