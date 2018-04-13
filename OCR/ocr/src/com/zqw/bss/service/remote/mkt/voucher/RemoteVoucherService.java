package com.zqw.bss.service.remote.mkt.voucher;

import java.math.BigDecimal;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.vo.mkt.VoucherNameVo;
import com.zqw.bss.vo.mkt.VoucherVo;

@Path("/voucher")
public interface RemoteVoucherService {
	// /**
	// * 创建产品
	// */
	//
	// @POST
	// @Path("/")
	// @Consumes(MediaTypes.JSON_UTF_8)
	// @Produces(MediaTypes.JSON_UTF_8)
	// public Boolean saveVoucher(Voucher voucher);
	//
	// /**
	// * 修改
	// */
	//
	// @PUT
	// @Path("/")
	// @Produces(MediaTypes.JSON_UTF_8)
	// public Boolean updateVoucher(Voucher voucher);
	//
	// /**
	// * 根据id查一个
	// */
	// @GET
	// @Path("/{id}")
	// @Produces(MediaTypes.JSON_UTF_8)
	// public Voucher getVoucherById(@PathParam("id")Long id);
	//
	//
	// /**
	// * 删除
	// */
	// @DELETE
	// @Path("/{id}")
	// @Consumes(MediaTypes.JSON_UTF_8)
	// @Produces(MediaTypes.JSON_UTF_8)
	// public Boolean deleteVoucher(@PathParam("id")Long id);
	//
	// /**
	// * 分页查询
	// */
	// @GET
	// @Path("/page/{query}")
	// @Consumes(MediaTypes.JSON_UTF_8)
	// @Produces(MediaTypes.JSON_UTF_8)
	// public BaseModelList<Voucher>getAllVoucherByPage(@PathParam("query")
	// String query);
	//
	// /**
	// * 根据是否使用查询
	// */
	// @GET
	// @Path("/available/{query}/{use}")
	// @Consumes(MediaTypes.JSON_UTF_8)
	// @Produces(MediaTypes.JSON_UTF_8)
	// public BaseModelList<Voucher>
	// getAllVoucherByAvailablePage(@PathParam("query")String
	// query,@PathParam("use")int use);
	//
	// /**
	// * 根据String类型参数分页查询
	// */
	// @GET
	// @Path("/PageString/{query}")
	// @Consumes(MediaTypes.JSON_UTF_8)
	// @Produces(MediaTypes.JSON_UTF_8)
	// public BaseModelList<Voucher>
	// getAllVoucherPageString(@PathParam("query")String query);
	// /**
	// * 根据数字类型类型参数分页查询
	// */
	// @GET
	// @Path("/PageNumber/{query}")
	// @Consumes(MediaTypes.JSON_UTF_8)
	// @Produces(MediaTypes.JSON_UTF_8)
	// public BaseModelList<Voucher>
	// getAllVoucherPageNumber(@PathParam("query")String query);
	//

	/**
	 * 发送优惠卷
	 * @param dispatchType 推送类型  
	 * 		SYSPUSH 系统推送
	 * 		LINE 线下验码
	 * @param name 带金卷的名字
	 * @param startDate 开始时间
	 * @param endDate 结束时间
	 * @param amount 代金卷的金额
	 * @param userId 接受代金卷的用户ID数组
	 * 		LINE 线下验码为-1
	 * @param num 发送代金券的数量
	 * 		SYSPUSH 状态下为-1
	 * @return
	 */
	@GET
	@Path("/putvoucher/{dispatchType}/{name}/{startDate}/{endDate}/{amount}/{userId}/{voucherType}/{num}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean putVoucher(@PathParam("dispatchType")String dispatchType,@PathParam("name")String name,@PathParam("startDate") String startDate,@PathParam("endDate") String endDate,@PathParam("amount") BigDecimal amount,@PathParam("userId") String userId,@PathParam("voucherType") String voucherType,@PathParam("num") Long num);

	/**
	 * 条件查询 可用于发送代金卷的客户
	 * use使用 noUse未使用  过期overdue
	 * // 付费金额1 2 状态 1 2 /注册事件1 2/ 用户名
	 * activitNumber 活动码
	 */
	@GET
	@Path("/search/page/{amountmin}/{amountmax}/{state}/{statemin}/{statemax}/{datemin}/{datemax}/{user}/{activitNumber}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String, Object> getUserPage(@PathParam("amountmin") BigDecimal amountmin,
			@PathParam("amountmax") BigDecimal amountmax, @PathParam("state") String state,
			@PathParam("statemin") BigDecimal statemin, @PathParam("statemax") BigDecimal statemax,
			@PathParam("datemin") String datemin, @PathParam("datemax") String datemax,
			@PathParam("user") String user,@PathParam("activitNumber") String activitNumber);

	/**
	 * 查询所有代金卷
	 */
	@GET
	@Path("/vouchersupervise/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<VoucherVo> getVoucherSupervise(@PathParam("query") String query);

	/**
	 * 查询所有代金卷详细信息
	 */
	@GET
	@Path("/vouchername/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<VoucherNameVo> getVouchreName(@PathParam("query") String query);

	/**
	 * 查询优惠卷名字是否存在
	 */
	@GET
	@Path("/check/{name}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean voucherCheck(@PathParam("name") String name);
	
	
}
