package com.zqw.bss.service.remote.mkt.coupon;

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
import com.zqw.bss.model.mkt.AgentCoupon;

@Path("/agentcoupon")
public interface RemoteAgentCouponService {

	/**
	 * 创建产品
	 */
	
	 @POST
	 @Path("/")
	 @Consumes(MediaTypes.JSON_UTF_8)
	 @Produces(MediaTypes.JSON_UTF_8)
	 public Boolean saveAgentCoupon(AgentCoupon coupon);
	
	 /**
	 * 修改
	 */
	
	 @PUT
	 @Path("/")
	 @Produces(MediaTypes.JSON_UTF_8)
	 public Boolean updateAgentCoupon(AgentCoupon coupon);
	
	 /**
	 * 根据id查一个
	 */
	 @GET
	 @Path("/{id}")
	 @Produces(MediaTypes.JSON_UTF_8)
	 public AgentCoupon getCouponById(@PathParam("id")Long id);
	
	
	 /**
	 * 删除
	 */
	 @DELETE
	 @Path("/{id}")
	 @Consumes(MediaTypes.JSON_UTF_8)
	 @Produces(MediaTypes.JSON_UTF_8)
	 public Boolean deleteAgentCoupon(@PathParam("id")Long id);
	
	 /**
	 * 分页查询
	 */
	 @GET
	 @Path("/page/{query}")
	 @Consumes(MediaTypes.JSON_UTF_8)
	 @Produces(MediaTypes.JSON_UTF_8)
	 public BaseModelList<AgentCoupon>getAllAgentCouponByPage(@PathParam("query")
	 String query);
}
