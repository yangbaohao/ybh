package com.zqw.bss.service.sys;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Set;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.sys.AcUser;
import com.zqw.bss.model.sys.Resource;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.vo.crm.SalesVo;
import com.zqw.bss.vo.sys.PartnerOwnerForListVo;
import com.zqw.bss.vo.sys.SearchUserAccessVo;
import com.zqw.bss.vo.sys.SearchUserAgentTaxVo;
import com.zqw.bss.vo.sys.SearchUserBuyListVo;
import com.zqw.bss.vo.sys.SearchUserByTaxListVo;
import com.zqw.bss.vo.sys.SearchUserListVo;
import com.zqw.bss.vo.sys.SearchUserTaxVo;
import com.zqw.bss.vo.sys.UserManageListForAll;

/**
 * <p>
 * User Service
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */

@SuppressWarnings({ "rawtypes" })
public interface UserService {

	/**
	 * 创建用户
	 * 
	 * @param User
	 * @return User
	 */
	public User saveUser(User user);
	public User saveTax(User user);
	/**
	 * 修改用户信息
	 * 
	 * @param User
	 * @return Boolean
	 */
	public Boolean updateUser(User user);

	/**
	 * 修改用户状态
	 * 
	 * @param id
	 * @param flag
	 * @return
	 */
	public Boolean updateLockedUser(Long id, Boolean flag);

	/**
	 * 更新部分用户信息
	 * 
	 * @param user
	 * @return
	 */
	public Boolean updatePartUser(User user);

	/**
	 * 修改用户角色
	 * 
	 * @param user
	 * @return
	 */
	public Boolean updateUserByRole(User user);

	/**
	 * 删除用户
	 * 
	 * @param userId
	 * @return Boolean
	 */
	public Boolean delUserById(Long userId);

	/**
	 * 修改密码 通过旧密码
	 * 
	 * @param oldPassword
	 * @param newPassword
	 * @return String
	 */
	public Boolean changePassword(String oldPassword, String newPassword);

	/**
	 * 通过用户名和旧密码修改密码
	 * 
	 * @param name
	 * @param oldPassword
	 * @param newPassword
	 * @return
	 */
	public Boolean changePasswordByName(String name, String oldPassword, String newPassword);

	/**
	 * 通过用户名修改密码
	 * 
	 * @param name
	 * @param newPassword
	 * @return
	 */
	public Boolean changePasswordByName(String name, String newPassword);

	/**
	 * 获取用户信息 by id
	 * 
	 * @param userId
	 * @return User
	 */
	public User getUserById(Long userId);

	/**
	 * 获取用户信息 by id
	 * 
	 * @param username
	 * @return User
	 */
	public User getUserByUsername(String username);
	
	/**
	 * 获取秒账用户信息 by id
	 * 
	 * @param username
	 * @return User
	 */
	public AcUser getAcUserByUsername(String username);

	/**
	 * 
	 * @param username
	 * @return User
	 */
	public User getSimpleUserByUsername(String username);

	/**
	 * 获取用户的所有角色
	 * 
	 * @param username
	 * @return Set<String>
	 */
	public Set<String> getRoleNamesByUsername(String username);

	/**
	 * get Permissions By User name
	 * 
	 * @param username
	 * @return Set<String>
	 */
	public Set<String> getPermissionsByUsername(String username);

	/**
	 * 获取所有用户
	 * 
	 * @return List<User>
	 */
	public List<User> getUsers();

	/**
	 * 获取用户信息
	 * 
	 * @param user对象
	 * 
	 * @return List<User>
	 */
	public List<User> findUsers(User user);

	/**
	 * 通过UserId获取role
	 */
	public List getRolesByUserId(Long userId);
	
	/**
	 * 获取销售信息
	 * @param flag
	 * @return
	 */
	public List<User> getSaleUsers(Long flag);
	
	/**
	 * 获取销售信息
	 * @param flag
	 * @return
	 */
	public List<User> getManageSaleUsers(String code);
	
	/**
	 * 获取用户信息列表 Vo
	 * 
	 * @param userCondition
	 * @return
	 */
	public BaseModelList<SearchUserListVo> findUsers(BasePagerObject userCondition);

	/**
	 * 获取用户的权限
	 * 
	 * @param username
	 * @return
	 */
	public List<Resource> getUserResourceByUsername(String username);

	public User getCurrentUserInfo();

	/**
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	public List<User> getUsersByRegisterDate(Date startDate, Date endDate);
	
	/**
	 * 获取用户付款列表
	 * @param userCondition
	 * @return 
	 */
//	public BaseModelList<SearchUserBuyListVo> getSearchUserBuyListVo(String saler,String voucher,BigDecimal startAmt,BigDecimal endAmt,BasePagerObject userCondition);

	/**
	 * 分配销售负责人
	 * @param owner
	 * @return
	 */
	public Boolean distributionSalerByAdmin(Long customerid,Owner owner);

	/**
	 *	销售管理列表 
	 * @param num 
	 */
	public BaseModelList<SalesVo> getSalesByPage(String num,String beginDate,String endDate,BasePagerObject bso);
	
	public BaseModelList<SearchUserBuyListVo> getSearchUserBuyVobusrListVo(BigDecimal startAmt,BigDecimal endAmt,BasePagerObject userCondition); 
	
	public List<SearchUserListVo> getAllUserInformation(String roleName,String username);
	
	public BaseModelList<SearchUserBuyListVo> getSearchUserBuyListVo(BigDecimal startAmt,BigDecimal endAmt,BasePagerObject userCondition);
	public BaseModelList<SearchUserBuyListVo> getSearchSalesUserBuyListVo(BigDecimal startAmt,
			BigDecimal endAmt, BasePagerObject userCondition);
	
	public BaseModelList<SearchUserBuyListVo> getSearchSalesUserBuyList(BigDecimal startAmt,
			BigDecimal endAmt, BasePagerObject userCondition);
	
	public BaseModelList<SearchUserBuyListVo> getSearchTaxUserBuyListVo(BasePagerObject userCondition);

	
	/**
	 *	代理报税管理列表 
	 * @param endAmt 
	 * @param startAmt 
	 */
	public BaseModelList<SearchUserByTaxListVo> getUserTaxByPage(BigDecimal startOwnerNum, BigDecimal endOwnerNum, BasePagerObject bso);


	/**
	 * 获取所有允许登陆的ip
	 */
	public List<String> getIps();
	
	/**
	 * 获取用户列表(代理报税登录)
	 * 
	 * @param 用户列表查询条件(分页查询条件json固定格式)
	 * @return 用户列表
	 */
	public BaseModelList<SearchUserTaxVo> searchTaxUsers(String fenpei,BasePagerObject bso);
	
	public BaseModelList<SearchUserTaxVo> searchTaxUsersByTaxUser(BasePagerObject bso);

	public BaseModelList<SearchUserAgentTaxVo> getUserAgentTaxByPage(
			BasePagerObject bso);
	/**
	 * 判断用户名是否重复
	 * @param username
	 * @return
	 */
	public Boolean repeat(String username);
	public BaseModelList<SearchUserTaxVo> searcherTaxUsers(String taxCode,BasePagerObject bso);

	public List<User> getTaxManage();
	public BaseModelList<SearchUserAccessVo> searchUserAcc(Long ownerId,Long type,String roleName,BasePagerObject bso);
	
	public Boolean updateParentCode(List<User> user,Long id);
	public BaseModelList<User> partnerUsers(BasePagerObject bso);
	public Boolean savePartner(User user);
	public List<User> dockingUsers();
	
	public BaseModelList<PartnerOwnerForListVo> getPartnerInformation(BasePagerObject bso);
	public BaseModelList<PartnerOwnerForListVo> getpartnersuccess(String employeeCode, BasePagerObject bso);
	List<User> getCustomerSales(Long flag);
	public Boolean saveDistribution(List<User> users,String type,String distributionEmployeeCode);
	public Boolean updateUserDetailed(User user);
	
	public BaseModelList<UserManageListForAll> getUserManageListForAll(Long id,BasePagerObject bso);
	
	public Boolean updateUserDetailedParentCode(User user);
	
	public List<SearchUserListVo> getSearchUserListVoAllName();
	public List<User> getCustomerOrSales(String type);
	public List<User> getDistributionEmployeeCode();
	
	
}
















