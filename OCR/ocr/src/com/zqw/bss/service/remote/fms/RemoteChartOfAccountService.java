package com.zqw.bss.service.remote.fms;

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
import com.zqw.bss.model.fms.ChartOfAccount;
import com.zqw.bss.vo.fms.ChartOfAccountForListVO;
import com.zqw.bss.vo.fms.ChartOfAccountIdVo;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:会计科目服务接口
 * </p>
 * <p>
 * Copyright: Copyright (c) 2016
 * </p>
 * <p>
 * Company:zqw
 * </p>
 * 
 * @author Dhuan
 * @date 2016年4月20日 下午1:20:07
 * @version 1.0
 */

@Path("/chartOfAccount")
public interface RemoteChartOfAccountService {

	/**
	 * 创建科目
	 * @param chartOfAccount
	 * @return
	 */
/*	@POST
	@Path("/account")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean createChartOfAccount(ChartOfAccount chartOfAccount);*/

	/**
	 * 创建科目
	 * @param chartOfAccount对象
	 * @return 科目信息
	 */
	@POST
	@Path("/{ownerId}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public ChartOfAccount createCOA(ChartOfAccount chartOfAccount,@PathParam("ownerId")Long ownerId);

//	/**
//	 * 创建科目
//	 * @param chartOfAccount对象
//	 * @return Boolean
//	 */
//	@POST
//	@Path("/coas/{ownerId}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Boolean saveCOA(List<ChartOfAccount> chartOfAccount,@PathParam("ownerId")Long ownerId);

	/**
	 * 删除科目
	 * @param id
	 * @return
	 */
	@DELETE
	@Path("/{id}/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delChartOfAccount(@PathParam("id") Long id,@PathParam("ownerId")Long ownerId);

	/**
	 * 修改科目
	 * @param chartOfAccount对象
	 * @return Boolean
	 */
	@PUT
	@Path("/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateChartOfAccount(ChartOfAccount chartOfAccount,@PathParam("ownerId")Long ownerId);

	/**
	 * 获取科目信息 by id
	 * @param id
	 * @return 
	 */
	/*@GET
	@Path("/id/{id}")
	@Produces(MediaTypes.JSON_UTF_8)*/
//	public ChartOfAccount getChartOfAccountById(@PathParam("id") Long id);
	
	/**
	 * 获取所有科目
	 * @return 所有科目信息
	 */
	@GET
	@Path("/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ChartOfAccount> getChartOfAccounts(@PathParam("ownerId")Long ownerId);

	/**
	 * 根据类型获取科目
	 * @param classid
	 * @return 科目列表
	 */
	@GET
	@Path("/class/{classid}/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ChartOfAccount> getChartOfAccounts(
			@PathParam("classid") Integer classid,@PathParam("ownerId")Long ownerId);
	
	/**
	 * 条件查询
	 * @param chartOfAccount
	 * @return
	 */
	/*@POST
	@Path("/search")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ChartOfAccount> searchChartOfAccount(ChartOfAccount
			chartOfAccount);*/

	/**
	 * 分页
	 * @param query
	 * @return
	 */
	 /*@GET
	 @Path("/search/{query}")
	 @Consumes(MediaTypes.JSON_UTF_8)
	 @Produces(MediaTypes.JSON_UTF_8)
	 public BaseModelList<ChartOfAccount>
	 	searchChartOfAccounts(@PathParam("query") String query);*/

	/**
	 * 获取结转凭证的科目
	 * @param classid
	 * @return 科目列表
	 */
	@GET
	@Path("chartOfAccount/asset/{classid}/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ChartOfAccount> getChartOfAccountByRef(
			@PathParam("classid") Integer classid,@PathParam("ownerId")Long ownerId);

	/**
	 * 获取科目信息 by parentid
	 * @param parentid
	 * @return  科目信息 
	 */
	@GET
	@Path("/parentid/{parentid}/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ChartOfAccount> getChartOfAccountByParentid(
			@PathParam("parentid") Long parentid,@PathParam("ownerId")Long ownerId);

//	/**
//	 * 结转凭证
//	 * @param name结转凭证的名称
//	 * @param ctime日期
//	 * @return  List
//	 */
//	@GET
//	@Path("/search/chartOfAccount/{name}/{ctime}")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public List getChartOfAccountTemp(
//			@PathParam("name") ComputeCarryoverClass name,
//			@PathParam("ctime") String ctime);

	/**
	 * 获取全部ChartOfAccountVO信息
	 * @return List<ChartOfAccountVO>
	 */
	@GET
	@Path("/chartOfAccounts/{ownerId}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ChartOfAccountForListVO> getAllChartOfAccountForListVO(@PathParam("ownerId")Long ownerId);

	/**
	 * 根据id查询ChartOfAccountVO信息
	 * 
	 * @return ChartOfAccountVO
	 */
	@GET
	@Path("/chartOfAccount/{ownerId}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public ChartOfAccountForListVO getChartOfAccountById(@PathParam("ownerId")Long ownerId,
			@PathParam("query") String query);

//	/**
//	 * 获取资金分布
//	 * @return 资金分布列表
//	 */
//	@GET
//	@Path("/bankcapital")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public List<ChartOfAccountBankListVo> getBankCapital();

	/**
	 * @param hardCode
	 * @return
	 */
	@GET
	@Path("/negative/{hardCode}/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public ChartOfAccount getByCodeWithNegativeOwnerId(
			@PathParam("hardCode") String hardCode,@PathParam("ownerId")Long ownerId);

	/**
	 * 获取所有科目 
	 * @return ChartOfAccountIdVo
	 */
	@GET
	@Path("/getid/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ChartOfAccountIdVo> getIdFromChartOfAccount(@PathParam("ownerId")Long ownerId);
	
	/**
	 * 查询账户列表
	 */
	@GET
	@Path("/getAccount/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ChartOfAccount> getAccountChartOfAccount(@PathParam("ownerId")Long ownerId);

}
