package com.zqw.bss.service.remote.billing;

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
import com.zqw.bss.model.billing.AccountOrderPay;

/**
 * <p>Title:</p>
 * <p>Description: 推广订单支付服务</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author lzy
 * @date 2016年4月15日 上午10:21:24
 * @version 1.0
 */

@Path("/accountOrderPay")
public interface RemoteAccountOrderPayService {
		
	@POST
	@Path("/create")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public AccountOrderPay saveAccountOrderPay(AccountOrderPay accountOrderPay);
	
	@DELETE
	@Path("/del/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delAccountOrderPayById(@PathParam("id") Long accountOrderPayId);
	
	@PUT
	@Path("/update")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateAccountOrderPay(AccountOrderPay accountOrderPay);
	
	@GET
	@Path("/get/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public AccountOrderPay getAccountOrderPayById(@PathParam("id") Long accountOrderPayId);

	@GET
	@Path("/get/AccountOrderPay")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<AccountOrderPay> getAllAccountOrderPay();
	
	/**
	 * 分页查询账户展示信息
	 * @param 账户展示查询条件(分页查询条件json固定格式)
	 * @return 账户展示信息
	 */
	@GET
	@Path("/search/page/{query}")
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<AccountOrderPay> findAccountOrderPay(@PathParam("query") String query);
	/**
	 * 查询审批处理
	 * @param id
	 * @return
	 */
	@GET
	@Path("/getAccountOrderPay/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<AccountOrderPay> getAccountOrderPay(@PathParam("id")Long id);
	
	  /**
     * 分页获取支付信息
     * @param query
     * @return BaseModelList<AccountProduct>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<AccountOrderPay> getAllOrderPay(@PathParam("query") String query);
	
}
