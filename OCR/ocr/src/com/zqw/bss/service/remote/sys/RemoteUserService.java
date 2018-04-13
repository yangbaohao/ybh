//==============================================================================
// Created on 2009-7-7
// $Id$
//==============================================================================
package com.zqw.bss.service.remote.sys;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

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
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.sys.Resource;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.vo.crm.SalesVo;
import com.zqw.bss.vo.sys.OcrSearchUserBuyListVo;
import com.zqw.bss.vo.sys.PartnerOwnerForListVo;
import com.zqw.bss.vo.sys.SearchUserAccessVo;
import com.zqw.bss.vo.sys.SearchUserAgentTaxVo;
import com.zqw.bss.vo.sys.SearchUserByTaxListVo;
import com.zqw.bss.vo.sys.SearchUserListVo;
import com.zqw.bss.vo.sys.SearchUserTaxVo;
import com.zqw.bss.vo.sys.UserManageListForAll;

/**
 * <p>
 * Remote Place Service
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2007-2010 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@Path("/user")
@SuppressWarnings({ "rawtypes" })
public interface RemoteUserService {

	/**
	 * Get Place By Id
	 * 
	 * @param Long
	 *            Id
	 * @return Place
	 */
	@GET
	@Path("/userid/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public User getUserById(@PathParam("id") Long id);

	/**
	 * 获取用户信息
	 * 
	 * @param 用户名
	 * @return 用户信息
	 */
	@GET
	@Path("/username/{username}")
	@Produces(MediaTypes.JSON_UTF_8)
	public User getUserByUsername(@PathParam("username") String username);

	/**
	 * 创建用户信息
	 * 
	 * @param user对象
	 * @return 用户信息
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public User createUser(User user);

	/**
	 * 更新用户信息
	 * 
	 * @param user对象
	 * @return Boolean
	 */
	@PUT
	@Path("/")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateUser(User user);

	/**
	 * 更新用户的状态（是否可用）
	 * 
	 * @param id、flag状态
	 * @return Boolean
	 */
	@PUT
	@Path("/lock/{id}/{flag}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateUser(@PathParam("id") Long id, @PathParam("flag") Boolean flag);

	/**
	 * 修改用户信息(不包括密码)
	 * 
	 * @param user对象
	 * @return Boolean
	 */
	@PUT
	@Path("/part/user")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updatePartUser(User user);

	/**
	 * 修改用户的角色
	 * 
	 * @param user对象
	 * @return Boolean
	 */
	@PUT
	@Path("/byrole")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateUserByRole(User user);

	/**
	 * 删除用户
	 * 
	 * @param id
	 * @return Boolean
	 */
	@DELETE
	@Path("/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delUserById(@PathParam("id") Long id);

	/**
	 * 修改密码
	 * 
	 * @param map
	 * @return Boolean
	 */
	@PUT
	@Path("/password/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean changePassword(Map<String, String> map);

	/**
	 * 获取所有用户
	 * 
	 * @return List
	 */
	/*
	 * @GET
	 * 
	 * @Path("/")
	 * 
	 * @Produces(MediaTypes.JSON_UTF_8) public List<User> getUsers();
	 */

	/**
	 * search User List
	 * 
	 * @return
	 */
	/*
	 * @POST
	 * 
	 * @Path("/search1")
	 * 
	 * @Consumes(MediaTypes.JSON_UTF_8)
	 * 
	 * @Produces(MediaTypes.JSON_UTF_8) public List<User> searchUsers(User
	 * user);
	 */

	/**
	 * 获取角色信息by userId
	 * 
	 * @param userId
	 * @return 角色信息列表
	 */
	@GET
	@Path("/rolebyid/{userId}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List getRolesByUserId(@PathParam("userId") Long userId);

	/**
	 * 获取销售信息
	 */
	@GET
	@Path("/saleinfo/{flag}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> getSaleUsers(@PathParam("flag") Long flag);

	/**
	 * 获取销售信息
	 */
	@GET
	@Path("/managesaleinfo/{code}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> getManageSaleUsers(@PathParam("code") String code);

	/**
	 * 获取用户列表
	 * 
	 * @param 用户列表查询条件(分页查询条件json固定格式)
	 * @return 用户列表
	 */
	@GET
	@Path("/search/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SearchUserListVo> searchUsers(@PathParam("query") String query);

	/**
	 * 获取用户列表(代理报税登录)
	 * 
	 * @param 用户列表查询条件(分页查询条件json固定格式)
	 * @return 用户列表
	 */
	@GET
	@Path("/searchusertax/{fenpei}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SearchUserTaxVo> searchTaxUsers(@PathParam("fenpei") String fenpei,
			@PathParam("query") String query);

	/**
	 * 获取用户的权限
	 * 
	 * @return map
	 */
	@GET
	@Path("/permissioin")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String, List<Resource>> getUserPermission();

	/**
	 * 管理员修改用户密码
	 * 
	 * @param map
	 * @return Boolean
	 */
	@PUT
	@Path("/password/admin")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean changePasswordByAdmin(Map<String, String> map);

	/**
	 * @return 用户信息
	 */
	@GET
	@Path("/current")
	@Produces(MediaTypes.JSON_UTF_8)
	public User getCurrentUser();

	/**
	 * 根据时间段获取对应的用户
	 * 
	 * @param startDate、endDate
	 * @return 用户列表信息
	 * @throws ParseException
	 */
	@GET
	@Path("/date/{startDate}/{endDate}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> getUsersByRegisterDate(@PathParam("startDate") String startDate,
			@PathParam("endDate") String endDate) throws ParseException;

	/**
	 * 获取用户购买列表
	 * 
	 * @param 用户购买列表查询条件(分页查询条件json固定格式)
	 * @return 用户购买列表
	 */
	@GET
	@Path("/search/userbuy/{startAmt}/{endAmt}/{roleName}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<OcrSearchUserBuyListVo> getSearchUserBuyListVo(@PathParam("startAmt") BigDecimal startAmt,
			@PathParam("endAmt") BigDecimal endAmt, @PathParam("roleName") String roleName,
			@PathParam("query") String query);

	/**
	 * 获取用户访问记录
	 * 
	 * @param 用户访问记录(分页查询条件json固定格式)
	 * @return 用户购买列表
	 */
	@GET
	@Path("/search/userAccess/{ownerId}/{type}/{roleName}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SearchUserAccessVo> getSearchUserAccess(@PathParam("ownerId") Long ownerId,
			@PathParam("type") Long type, @PathParam("roleName") String roleName, @PathParam("query") String query);

	/**
	 * 分配销售负责人和客户
	 * 
	 * @param owner
	 * @return
	 */
	@PUT
	@Path("/owner/{customerid}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean distributionSalerByAdmin(@PathParam("customerid") Long customerid, Owner owner);

	/**
	 * 销售/客服管理列表
	 * 
	 * @param query
	 * @param num 0 代表销售 1代表客服
	 * @return
	 */
	@GET
	@Path("/sales/{num}/{beginDate}/{endDate}/{query}")
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SalesVo> getSalesByPage(@PathParam("num") String num,@PathParam("beginDate")String beginDate,@PathParam("endDate")String endDate,@PathParam("query") String query);

	@GET
	@Path("/information/{roleName}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SearchUserListVo> getAllUserInformation(@PathParam("roleName") String roleName);

	@GET
	@Path("/userTax/{startOwnerNum}/{endOwnerNum}/{query}")
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SearchUserByTaxListVo> getUserTax(@PathParam("startOwnerNum") BigDecimal startOwnerNum,
			@PathParam("endOwnerNum") BigDecimal endOwnerNum, @PathParam("query") String query);

	/**
	 * 报税人员管理
	 * 
	 * @param startOwnerNum
	 * @param endOwnerNum
	 * @param query
	 *            参数 user.username
	 * @return
	 */
	@GET
	@Path("/userAgentTax/{query}")
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SearchUserAgentTaxVo> getUserAgentTax(@PathParam("query") String query);

	/**
	 * 报税人管理添加员工(默认是报税人 ) 如果是报税管理员登录自己绑定到报税管理员
	 * 
	 * @param user
	 * @return
	 */
	@POST
	@Path("/savetax")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public User saveTax(User user);

	/**
	 * 判断用户名是否重复
	 */
	@GET
	@Path("/repeat/{username}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean repeat(@PathParam("username") String username);

	/**
	 * 报税管里获取报税人
	 */
	@GET
	@Path("/taxManage")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> getTaxManage();

	/**
	 * 报税人管理-报税人-客户管理 taxCode 为员工编号
	 */
	@GET
	@Path("/searchertax/{taxCode}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SearchUserTaxVo> searcherTaxUsers(@PathParam("taxCode") String taxCode,
			@PathParam("query") String query);

	/**
	 * 分配主管
	 * 
	 * @param user
	 * @return
	 */
	@PUT
	@Path("/gaveup/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateParentCode(List<User> user, @PathParam("id") Long id);

	
	/**
	 * 合作商分页查询
	 * @param query
	 * @return
	 * 张沂飞
	 */
	@GET
	@Path("/partner/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<User> partnerUsers(@PathParam("query") String query);
	
	/**新增合作商
	 * @param user
	 * @return
	 * 张沂飞
	 */
	@POST
	@Path("/savepartner/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean savePartner(User user);
	
	/**
	 * 对接人
	 * 张沂飞
	 */
	@GET
	@Path("/docking")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> dockingUsers();
	
	
	/**
	 * 查询所有合作商下的用户
	 * 
	 * @param
	 * @return
	 */
	@GET
	@Path("/search/partnerCode/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PartnerOwnerForListVo> getPartnerInformation(@PathParam("query") String query);
	
	
	/**
	 * 查询合作商下的成功用户
	 * 
	 * @param
	 * @return
	 * 张沂飞
	 */
	@GET
	@Path("/search/partnersuccess/{employeeCode}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PartnerOwnerForListVo> getpartnersuccess(@PathParam("employeeCode") String employeeCode,@PathParam("query") String query);
	
	/**
	 * 分配商机负责人
	 * 张沂飞
	 */
	@GET
	@Path("/customerSales/{flag}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> getCustomerSales(@PathParam("flag") Long flag);
	
	/**
	 * 注册时强制分配
	 * @param users
	 * @return
	 * 张沂飞
	 */
	@POST
	@Path("/savepartner/{type}/{distributionEmployeeCode}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean saveDistribution(List<User> users,@PathParam("type") String type,@PathParam("distributionEmployeeCode") String distributionEmployeeCode);
	
	
	@PUT
	@Path("/detailed")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateUserDetailed (User user);

	@GET
	@Path("/manage/forall/{id}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<UserManageListForAll> getUserManageListForAll(@PathParam("id")Long id,@PathParam("query")String query);
	
	@PUT
	@Path("/userParentCode/byId")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateUserDetailedParentCode (User user);
	
	@GET
	@Path("/taxmanage/forall")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SearchUserListVo> getSearchUserListVoAllName();
	
	/**
	 * 所有客服或销售负责人 张沂飞
	 * @param flag  customer 客服 sales 销售
	 * @return
	 */
	@GET
	@Path("/customerOrSales/{type}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> getCustomerOrSales(@PathParam("type") String type);
	//所有客服和销售
	@GET
	@Path("/distributionEmployeeCode")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> getDistributionEmployeeCode();
}
