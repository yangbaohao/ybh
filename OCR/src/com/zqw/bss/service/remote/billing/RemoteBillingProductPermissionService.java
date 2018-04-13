package com.zqw.bss.service.remote.billing;

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
import com.zqw.bss.model.billing.BillingProductPermission;

/**
 * <p>Title:</p>
 * <p>Description: 推广付费产品使用权限服务</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author lzy
 * @date 2016年4月15日 上午10:21:24
 * @version 1.0
 */

@Path("/billingProductPermission")
public interface RemoteBillingProductPermissionService {
	
	
	@POST
	@Path("/create/{ids}/{channel}/{amt}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean saveBillingProductPermission(@PathParam("channel") String channel,@PathParam("ids") String ids,@PathParam("amt") String amt,BillingProductPermission billingProductPermission);
	
	@DELETE
	@Path("/del/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delBillingProductPermissionById(@PathParam("id") Long billingProductPermissionId);
	
	@PUT
	@Path("/update")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateBillingProductPermission(BillingProductPermission billingProductPermission);
	
	@GET
	@Path("/get/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public BillingProductPermission getBillingProductPermissionById(@PathParam("id") Long billingProductPermissionId);

	/**
	 * 分页查询账户展示信息
	 * @param 账户展示查询条件(分页查询条件json固定格式)
	 * @return 账户展示信息
	 */
	@GET
	@Path("/search/page/{query}")
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<BillingProductPermission> findBillingProductPermission(@PathParam("query") String query);
	
}
