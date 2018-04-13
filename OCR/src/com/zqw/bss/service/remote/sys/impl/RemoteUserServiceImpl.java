//==============================================================================
// Created on 2009-7-7
// $Id$
//==============================================================================
package com.zqw.bss.service.remote.sys.impl;

import java.math.BigDecimal;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.sys.Resource;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.crm.OwnerService;
import com.zqw.bss.service.remote.sys.RemoteUserService;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
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
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2007-2010 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */

@SuppressWarnings({ "rawtypes", "unchecked" })
public class RemoteUserServiceImpl implements RemoteUserService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected UserService userService;
	
	protected OwnerService ownerService;
	
	protected DAO dao;

	@Autowired
	public void setOwnerService(OwnerService ownerService) {
		this.ownerService = ownerService;
	}
	@Autowired
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Override
	public User getUserById(Long id) {
		logger.info("begin getUserById. id = [" + id + "]");
		// Hibernate.initialize(user.getRoles());
		SecurityUtils.getSubject().checkPermissions("base:user:view");
		User ur = userService.getUserById(id);
			User user = (User) WebUtil.getEntryFromProxyObj(ur, dao);
			logger.info("end  getUserById.user : [ id ="
					+ user.getId() + WebUtil.getLogBasicString() + "]");	
			return user;
	}

	@Override
	public User createUser(User user) {
		logger.info("begin createUser.");
		SecurityUtils.getSubject().checkPermissions("base:user:create");
	    user = (User) WebUtil.getEntryFromProxyObj(userService.saveUser(user), dao);
	    logger.info("end  createUser.user : [ id ="
				+ user.getId() + WebUtil.getLogBasicString() + "]");
		return user;
	}

	@Override
	public User getUserByUsername(String username) {
		logger.info("begin getUserByUsername.");
		//SecurityUtils.getSubject().checkPermissions("base:user:view");
		User user = (User) WebUtil.getEntryFromProxyObj(userService.getUserByUsername(username), dao);
		 logger.info("end  getUserByUsername.user : [ id ="
					+  WebUtil.getLogBasicString() + "]");
		return user;
	}

	@Override
	public Boolean updateUser(User user) {
		logger.info("begin updateUser.");
	//	SecurityUtils.getSubject().checkPermissions("base:user:update");
		Boolean boo = false;
	try {
		 boo = userService.updateUser((User)WebUtil.getEntryFromProxyObj(user,dao));
		} catch (Exception e) {
			throw new OperationException("员工编号重复不能保存！");
		}
		
		logger.info("end  updateUser:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

	public Boolean updatePartUser(User user) {
		logger.info("begin updatePartUser.");
		SecurityUtils.getSubject().checkPermissions("base:user:update");
		Boolean boo = userService.updatePartUser((User) WebUtil.getEntryFromProxyObj(user, dao));
		logger.info("end  updatePartUser:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

	public Boolean updateUserByRole(User user) {
		logger.info("begin updateUserByRole.");
		SecurityUtils.getSubject().checkPermissions("base:user:update");
		Boolean boo = userService.updateUserByRole(user);
		logger.info("end  updateUserByRole:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

	@Override
	public Boolean delUserById(Long id) {
		logger.info("begin delUserById. id = [" + id + "]");
		SecurityUtils.getSubject().checkPermissions("base:user:delete");
		Boolean boo = userService.delUserById(id);
		logger.info("end  delUserById:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

	@Override
	public Boolean changePassword(Map<String, String> map) {
		logger.info("begin changePassword.");
		Boolean boo = userService.changePassword(map.get("oldPassword"), map.get("newPassword"));
		logger.info("end  changePassword:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

//	@Override
//	public List<User> getUsers() {
//		logger.info("begin getUsers.");
//		List<User> list = WebUtil.getEntryListFromProxyList(userService.getUsers(), dao);
//		logger.info("end  getUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
//		return list;
//	}

//	@Override
//	public List<User> searchUsers(User user) {
//		logger.info(user);
//		logger.info(user.getUsername());
//		List<User> list =  WebUtil.getEntryListFromProxyList(userService.findUsers(user), dao);
//		logger.info("end  searchUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
//		return list;
//	}

	public List getRolesByUserId(Long userId) {
		logger.info("begin getRolesByUserId.");
		SecurityUtils.getSubject().checkPermissions("base:userrole:view");
		List list = WebUtil.getEntryListFromProxyList(userService.getRolesByUserId(userId), dao);
		logger.info("end  getRolesByUserId:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	public List<User> getSaleUsers(Long flag){
		logger.info("begin getSaleUsers.");
		List list = WebUtil.getEntryListFromProxyList(userService.getSaleUsers(flag), dao);
		logger.info("end  getSaleUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}
	
	public List<User> getManageSaleUsers(String code){
		logger.info("begin getSaleUsers.");
		List list = WebUtil.getEntryListFromProxyList(userService.getManageSaleUsers(code), dao);
		logger.info("end  getSaleUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}
	
	@Override
	public BaseModelList<SearchUserListVo> searchUsers(String query) {
		logger.info("begin searchUsers.");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		logger.info(bso);
		BaseModelList<SearchUserListVo> list = userService.findUsers(bso);
		logger.info("end  searchUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	public UserService getUserService() {
		return userService;
	}

	@Override
	public Map<String, List<Resource>> getUserPermission() {

		logger.info("begin getUserPermission.");
		SecurityUtils.getSubject().checkPermissions("base:user:view");
		List<Resource> resources = userService
				.getUserResourceByUsername(SecurityUtils.getSubject().getPrincipal().toString());
		Map<String, List<Resource>> map = new HashMap();
		int maxlevel = 1;
		if (resources != null) {
			for (Resource resource : resources) {
				if (resource.getLevel() > maxlevel) {
					maxlevel = resource.getLevel();
				}
			}
		}

		for (int i = 1; i <= maxlevel; i++) {
			List<Resource> menus = new ArrayList();
			for (Resource resource : resources) {
				if (resource.getLevel() == i) {
					menus.add(resource);
				}
			}
			map.put(String.valueOf(i), menus);
		}
		logger.info("end  getUserPermission:[ id ="+ WebUtil.getLogBasicString() + "]");
		return map;

	}

	@Override
	public Boolean changePasswordByAdmin(Map<String, String> map) {
		logger.info("begin changePasswordByAdmin.");
		SecurityUtils.getSubject().checkPermissions("*");
		Boolean boo = userService.changePasswordByName(map.get("username"), map.get("newPassword"));
		logger.info("end  changePasswordByAdmin:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

	@Override
	public User getCurrentUser() {
		logger.info("begin getCurrentUser.");
		User user = (User) WebUtil.getEntryFromProxyObj(userService.getCurrentUserInfo(), dao);
		logger.info("end  getCurrentUser:[ id ="+ WebUtil.getLogBasicString() + "]");
		return user;
	}

	@Override
	public List<User> getUsersByRegisterDate(String startDate, String endDate) throws ParseException {
		logger.info("begin  getUsersByRegisterDate.");
		SecurityUtils.getSubject().checkPermissions("base:user:view");
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		Date startDate1 = df.parse(startDate);
		Date endDate1 = df.parse(endDate);
		List<User> list = WebUtil.getEntryListFromProxyList(userService.getUsersByRegisterDate(startDate1, endDate1), dao);
		logger.info("end  getUsersByRegisterDate:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	public Boolean updateUser(Long id, Boolean flag) {
		logger.info("begin updateUser");
	//	SecurityUtils.getSubject().checkPermissions("base:user:update");
		Boolean boo = userService.updateLockedUser(id, flag);
		logger.info("end  updateUser:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}
	@Override
	public BaseModelList<OcrSearchUserBuyListVo> getSearchUserBuyListVo(BigDecimal startAmt,
			BigDecimal endAmt,String roleName, String query)  {
		logger.info("begin getSearchUserBuyListVo");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		
//		String[] role = roleName.split(",");
//		for(String r : role){
//			if(r.equals("Ocr_Admin")){
//				return ownerService.getSearchUserBuyVobusrListVo(startAmt,endAmt,bso);
//			}
//			else if(r.equals("agentistrator")){
//				return userService.getSearchUserBuyVobusrListVo(startAmt,endAmt,bso);
//			}else if(r.equals("salesStaff")||r.equals("salesManage")||r.equals("secondLevelSalesManage")){
//				return userService.getSearchSalesUserBuyListVo(startAmt,endAmt,bso);
//			}else if(r.equals("customerService")||r.equals("customerManage")||r.equals("secondLevelCustomerManage")){
//				return userService.getSearchSalesUserBuyList(startAmt,endAmt,bso);
//			}else if(r.equals("taxStaff")||r.equals("taxStaffadmin")){
//				return userService.getSearchTaxUserBuyListVo(bso);
//			}
//		}	
		logger.info("end getSearchUserBuyListVo");
		return ownerService.getOcrSearchUserBuyVobusrListVo(startAmt,endAmt,bso);
	}
	@Override
	public Boolean distributionSalerByAdmin(Long customerid,Owner owner) {
		logger.info("begin distributionSalerByAdmin");
		return userService.distributionSalerByAdmin(customerid,owner);
	}
	@Override
	public BaseModelList<SalesVo> getSalesByPage(String num,String beginDate,String endDate,String query) {
		logger.info("begin getSalesByPage");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return userService.getSalesByPage(num,beginDate,endDate,bso);
	}
	@Override
	public List<SearchUserListVo> getAllUserInformation(String roleName) {
		logger.info("begin getAllUserInformation");
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME); 
		return WebUtil.getEntryListFromProxyList(userService.getAllUserInformation(roleName,username), dao);
	}
	@Override
	public BaseModelList<SearchUserByTaxListVo> getUserTax(BigDecimal startOwnerNum, BigDecimal endOwnerNum, String query) {
		logger.info("begin getUserTax");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<SearchUserByTaxListVo> list = userService.getUserTaxByPage(startOwnerNum,endOwnerNum,bso);
		logger.info("end  searchUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}
	@Override
	public BaseModelList<SearchUserTaxVo> searchTaxUsers(String fenpei,String query) {
		logger.info("begin getSalesByPage");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<SearchUserTaxVo> list = null;
		if(fenpei.equals("fenpei"))
			list = userService.searchTaxUsers(fenpei,bso);
		else
		list = userService.searchTaxUsersByTaxUser(bso);
			
		return list;
	}
	@Override
	public BaseModelList<SearchUserAgentTaxVo> getUserAgentTax(
			String query) {
		logger.info("begin getUserAgentTax");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<SearchUserAgentTaxVo> list = userService.getUserAgentTaxByPage(bso);
		logger.info("end  searchUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}
	@Override
	public User saveTax(User user) {
		logger.info("begin saveTax");
		user = (User) WebUtil.getEntryFromProxyObj(userService.saveTax(user), dao);
		logger.info("end saveTax");
		return user;
	}
	@Override
	public Boolean repeat(String username) {
		logger.info("begin repeat");
		Boolean bl=userService.repeat(username);
		logger.info("end repeat");
		return bl;
	}
	@Override
	public List<User> getTaxManage() {
		return WebUtil.getEntryListFromProxyList(userService.getTaxManage(), dao);
	}
	@Override
	public BaseModelList<SearchUserTaxVo> searcherTaxUsers(String taxCode,String query) {
		logger.info("begin searcherTaxUsers");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<SearchUserTaxVo> list = userService.searcherTaxUsers(taxCode,bso);
		logger.info("end searcherTaxUsers");
		return list;
	}
	@Override
	public BaseModelList<SearchUserAccessVo> getSearchUserAccess(Long ownerId,Long type, String roleName, String query) {
		logger.info("begin getSearchUserAccess");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<SearchUserAccessVo> list = userService.searchUserAcc(ownerId,type, roleName, bso);
		logger.info("end  searchUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}
	@Override
	public Boolean updateParentCode(List<User> user,Long id) {
		// TODO Auto-generated method stub
		return userService.updateParentCode(user,id);
	}
	
	@Override
	public BaseModelList<User> partnerUsers(String query) {
		logger.info("begin partnerUsers");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<User> list=userService.partnerUsers(bso);
		logger.info("end partnerUsers");
		return list;
	}
	@Override
	public Boolean savePartner(User user) {
		logger.info("begin savePartner");
		Boolean bo=userService.savePartner(user);
		logger.info("end savePartner");
		return bo;
	}
	@Override
	public List<User> dockingUsers() {
		logger.info("begin dockingUsers");
		List<User> user= userService.dockingUsers();
		logger.info("end dockingUsers");
		return user;
	}
	@Override
	public BaseModelList<PartnerOwnerForListVo> getPartnerInformation(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return userService.getPartnerInformation(bso);
	}
	@Override
	public BaseModelList<PartnerOwnerForListVo> getpartnersuccess(String employeeCode, String query) {
		logger.info("begin getpartnersuccess");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<PartnerOwnerForListVo> list=userService.getpartnersuccess(employeeCode,bso);
		logger.info("begin getpartnersuccess");
		return list;
	}
	@Override
	public List<User> getCustomerSales(Long flag) {
		logger.info("begin getSaleUsers.");
		List list = WebUtil.getEntryListFromProxyList(userService.getCustomerSales(flag), dao);
		logger.info("end  getSaleUsers:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}
	@Override
	public Boolean saveDistribution(List<User> users,String type,String distributionEmployeeCode) {
		logger.info("begin saveDistribution.");
		Boolean bo= userService.saveDistribution(users,type,distributionEmployeeCode);
		logger.info("end saveDistribution.");
		return bo;
	}
	@Override
	public Boolean updateUserDetailed(User user) {
		logger.info("begin updateUserDetailed.");
		Boolean bo=userService.updateUserDetailed(user);
		logger.info("end updateUserDetailed.");
		return null;
	}
	@Override
	public BaseModelList<UserManageListForAll> getUserManageListForAll(Long id, String query) {
		// TODO Auto-generated method stub
		String request =HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return userService.getUserManageListForAll(id, bso);
	}
	@Override
	public Boolean updateUserDetailedParentCode(User user) {
		// TODO Auto-generated method stub
		return userService.updateUserDetailedParentCode(user);
	}
	@Override
	public List<SearchUserListVo> getSearchUserListVoAllName() {
		// TODO Auto-generated method stub
		return userService.getSearchUserListVoAllName();
	}
	@Override
	public List<User> getCustomerOrSales(String type) {
		logger.info("begin getCustomerOrSales");
		List<User> users= userService.getCustomerOrSales(type);
		logger.info("end getCustomerOrSales");
		return users;
	}
	@Override
	public List<User> getDistributionEmployeeCode() {
		logger.info("begin getDistributionEmployeeCode");
		List<User> users=userService.getDistributionEmployeeCode();
		logger.info("end getDistributionEmployeeCode");
		return users;
	}

}
