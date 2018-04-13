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
import com.zqw.bss.model.mkt.Coupon;
import com.zqw.bss.vo.mkt.CouponVo;

@Path("/coupon")
public interface RemoteCouponService {
	
	 /**
	 * 创建产品
	 */
	
	 @POST
	 @Path("/")
	 @Consumes(MediaTypes.JSON_UTF_8)
	 @Produces(MediaTypes.JSON_UTF_8)
	 public Boolean saveCoupon(Coupon coupon);
	
	 /**
	 * 修改
	 */
	
	 @PUT
	 @Path("/")
	 @Produces(MediaTypes.JSON_UTF_8)
	 public Boolean updateCoupon(Coupon coupon);
	
	 /**
	 * 根据id查一个
	 */
	 @GET
	 @Path("/{id}")
	 @Produces(MediaTypes.JSON_UTF_8)
	 public Coupon getCouponById(@PathParam("id")Long id);
	
	
	 /**
	 * 删除
	 */
	 @DELETE
	 @Path("/{id}")
	 @Consumes(MediaTypes.JSON_UTF_8)
	 @Produces(MediaTypes.JSON_UTF_8)
	 public Boolean deleteCoupon(@PathParam("id")Long id);
	
	 /**
	 * 分页查询
	 */
	 @GET
	 @Path("/page/{query}")
	 @Consumes(MediaTypes.JSON_UTF_8)
	 @Produces(MediaTypes.JSON_UTF_8)
	 public BaseModelList<Coupon>getAllCouponByPage(@PathParam("query")
	 String query);
	
	/**
	 * 查询免费兑换券名字是否存在
	 */
	@GET
	@Path("/check/{name}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean couponCheck(@PathParam("name") String name);
	
	 /**
	 * 修改模块信息和有效月份
	 */
	@PUT
	 @Path("/updateCoupon")
	 @Produces(MediaTypes.JSON_UTF_8)
	 public Boolean updateProductAndFreeTime(CouponVo couponvo);
}
