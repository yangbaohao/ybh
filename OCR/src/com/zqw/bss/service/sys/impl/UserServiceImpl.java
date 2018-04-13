package com.zqw.bss.service.sys.impl;

import java.math.BigDecimal;
import java.sql.Time;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.hibernate.LockMode;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.billing.BillingRecord;
import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.Address;
import com.zqw.bss.model.crm.EnterpriseInfo;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PersonInfo;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sys.AcUser;
import com.zqw.bss.model.sys.Resource;
import com.zqw.bss.model.sys.Role;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.service.crm.UserInfoService;
import com.zqw.bss.service.sale.SalesAgentService;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.PasswordHelper;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.common.AccessVo;
import com.zqw.bss.vo.common.TaxReportListVo;
import com.zqw.bss.vo.crm.SalesVo;
import com.zqw.bss.vo.sys.PartnerOwnerForListVo;
import com.zqw.bss.vo.sys.SearchOwnerListvo;
import com.zqw.bss.vo.sys.SearchUserAccessVo;
import com.zqw.bss.vo.sys.SearchUserAgentTaxVo;
import com.zqw.bss.vo.sys.SearchUserBuyListVo;
import com.zqw.bss.vo.sys.SearchUserByTaxListVo;
import com.zqw.bss.vo.sys.SearchUserListVo;
import com.zqw.bss.vo.sys.SearchUserTaxVo;
import com.zqw.bss.vo.sys.UserManageListForAll;

/**
 * <p>
 * User Service Impl
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@Service
@Qualifier("userService")
@SuppressWarnings({ "unchecked", "unused", "rawtypes" })
public class UserServiceImpl implements UserService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected UserInfoService userInfoService;
	
	@Autowired
	protected SalesAgentService salesAgentService;
	
	@Autowired
	protected CommonService commonService;
	
	@Autowired
	protected DAO dao;

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public User saveUser(User user) {

		logger.info("begin saveUser.");
		// 暂时设置默认密码
		// user.setPassword("111111");
		User user4mail = new User();
		BeanUtils.copyProperties(user, user4mail);

		PasswordHelper.encryptPassword(user);
		// Long ownerId = (Long)
		// SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
		user.setOwnerId(-2L);
		user.getUserInfo().setOwnerId(-2L);
		// WebUtil.prepareInsertParams(user);
		try {
			user = (User) dao.save(user);
		} catch (Exception e) {
			throw new OperationException("员工编号重复不能保存！");
		}

		logger.info("end  saveUser.user : [ id =" + user.getId() + WebUtil.getLogBasicString() + "]");
		// mailService.sendSignMail(user4mail);
		return user;

	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateUser(User user) {
		logger.info("begin updateUser.  id = [" + user.getId() + "]");
		PasswordHelper.encryptPassword(user);
		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
		user.setOwnerId(-2L);
		user.getUserInfo().setOwnerId(-2L);
		User ur = (User) dao.getObject(User.class, user.getId());
		List<Role> roles = ur.getRoles();
		user.setRoles(roles);
		if (ur.getEmployeeCode() != null)
			user.setEmployeeCode(ur.getEmployeeCode());
		dao.update(user);
		logger.info("end updateUser.[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updatePartUser(User user) {
		logger.info("begin updateUser.  id = [" + user.getId() + "]");
		User realUser = (User) dao.getObject(User.class, user.getId());
		realUser.getRoles().size();
		if (null != realUser) {
			user.setPassword(realUser.getPassword());

			dao.update(user);
			logger.info("end updateUser.[ id =" + WebUtil.getLogBasicString() + "]");
			return true;
		} else
			throw new OperationException("系统中不存在该用户");
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateUserByRole(User user) {

		logger.info("begin updateUser.  id = [" + user.getId() + "]");
		User user1 = getUserById(user.getId());
		user1.setRoles(user.getRoles());
		if(user.getRoles().get(0).getId().toString().equals("2")){
			List<SalesAgent> list = dao.find("from SalesAgent where agentName = '"+user1.getUsername()+"'");
			if(list.size()==0){
				SalesAgent salesAgent = new SalesAgent();
				salesAgent.setAgentCode(commonService.getSystemCode("AgentCode", 5, 0L));
				salesAgent.setAgentName(user1.getUsername());
				salesAgent.setType("");
				salesAgent.setUser(user1);
				salesAgent.setUserInfo(user1.getUserInfo());
				salesAgent=salesAgentService.saveSalesAgent(salesAgent);
				salesAgent.setType("person");
				dao.update(salesAgent);
			}
		}
		dao.update(user1);
		logger.info("end updateUser.[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delUserById(Long userId) {
		logger.info("begin delUserById.  id = [" + userId + "]");
		dao.removeObject(User.class, userId);
		logger.info("end delUserById.[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean changePassword(String oldPassword, String newPassword) {
		String retStr = "";
		User currentUser = getUserByUsername((String) SecurityUtils.getSubject().getPrincipal());
		currentUser.getRoles().size();
		logger.info("begin changePassword.  id = [" + currentUser.getId() + "]");
		if (currentUser != null && PasswordHelper.inputPasswordIsEquealOldPassword(oldPassword, currentUser)) {
			currentUser.setPassword(newPassword);
			this.updateUser(currentUser);
			logger.info("end changePassword.[ id =" + WebUtil.getLogBasicString() + "]");
			retStr = "success";
			return true;
		} else {
			retStr = "OldPassword is wrong!";
			return false;
		}

	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean changePasswordByName(String name, String oldPassword, String newPassword) {
		Boolean retStr = false;
		User currentUser = getUserByUsername(name);
		currentUser.getRoles().size();
		logger.info("begin changePassword.  id = [" + currentUser.getId() + "]");
		if (currentUser != null && PasswordHelper.inputPasswordIsEquealOldPassword(oldPassword, currentUser)) {
			currentUser.setPassword(newPassword);
			this.updateUser(currentUser);
			logger.info("end changePassword.[ id =" + WebUtil.getLogBasicString() + "]");
			retStr = true;
		} else {
			throw new OperationException("OldPassword is wrong!");
		}
		logger.info("end changePassword.[ id =" + WebUtil.getLogBasicString() + "]");
		return retStr;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public User getUserById(Long userId) {
		logger.info("begin getUserById.  id = [" + userId + "]");
		User user = (User) dao.getObject(User.class, userId);
		logger.info("end getUserById.[ id =" + WebUtil.getLogBasicString() + "]");
		return user;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public User getUserByUsername(String username) {

		logger.info("begin getUserByUsername.  username = [" + username + "]");
		List<User> list = dao
				.find("select distinct user from User user " + " left join user.userInfo  left join user.roles roles "
						+ " left join roles.resources  where user.username = ?", username);
		logger.info("end getUserByUsername. list size = [" + list.size() + "]");

		if (list.size() != 1)
			return null;
		User user = list.get(0);
		logger.info("end getUserByUsername.[ id =" + user.getId() + "]");
		return user;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public User getSimpleUserByUsername(String username) {

		logger.info("begin getSimpleUserByUsername.  username = [" + username + "]");
		List<User> list = dao.find("select distinct user from User user where user.username = ?", username);
		logger.info("end getSimpleUserByUsername. list size = [" + list.size() + "]");

		if (list.size() != 1)
			return null;
		User user = list.get(0);
		logger.info("end getSimpleUserByUsername.[ id =" + WebUtil.getLogBasicString() + "]");
		return user;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> getUsers() {
		logger.info("begin getUserByUsername.");
		List<User> userList = dao.getObjects(User.class);
		logger.info("end getUserByUsername.[ id =" + WebUtil.getLogBasicString() + "]");
		return userList;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Set<String> getRoleNamesByUsername(String username) {
		logger.info("begin getRoleNamesByUsername.  username = [" + username + "]");
		User user = getUserByUsername(username);
		if (user == null) {
			return Collections.EMPTY_SET;
		}

		Set<String> roleNames = new HashSet<String>();
		for (Role role : user.getRoles()) {

			roleNames.add(role.getRoleName());

		}
		logger.info("end getRoleNamesByUsername. roleNames = [" + roleNames.toString() + "]");
		logger.info("end getRoleNamesByUsername.[ id =" + WebUtil.getLogBasicString() + "]");
		return roleNames;

	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Set<String> getPermissionsByUsername(String username) {

		logger.info("begin getPermissionsByUsername.  username = [" + username + "]");
		User user = getUserByUsername(username);
		if (user == null) {
			return Collections.EMPTY_SET;
		}

		Set<String> permissions = new HashSet<String>();
		for (Role role : user.getRoles()) {

			for (Resource resource : role.getResources()) {
				permissions.add(resource.getPermission());
			}
		}
		logger.info("end getPermissionsByUsername. permissions = [" + permissions.toString() + "]");
		logger.info("end getPermissionsByUsername.[ id =" + WebUtil.getLogBasicString() + "]");
		return permissions;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List getRolesByUserId(Long userId) {
		logger.info("begin User. id = [" + userId + "]");
		Role rl = new Role();
		List list = new ArrayList();

		User user = (User) dao.getObject(User.class, userId);
		List<Role> listTmp = user.getRoles();

		for (Role role : listTmp) {
			rl.setId(role.getId());
			list.add(rl.getId());
		}
		logger.info("end getRolesByUserId.[ id =" + WebUtil.getLogBasicString() + "]");
		return list;

	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> getSaleUsers(Long flag) {
		if (flag == 0) {
			Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
			List<User> users = dao.find("from User where username = '"
					+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			User user = null;
			if (users.size() > 0) {
				user = users.get(0);
			}
			String sql = "";
			if (roles.contains("salesManage")) {
				// 获取二级销售主管编号
				List<String> empCode = dao.executeQuerySql(
						"select u.employeeCode from t_bss_sys_user u where u.locked='N' and u.parentEmployeeCode = '"
								+ user.getEmployeeCode() + "'",
						null);
				if (empCode.size() > 0) {
					String[] ar = (String[]) empCode.toArray(new String[empCode.size()]);
					for (int i = 0; i < ar.length; i++) {
						String temp = ar[i];
						ar[i] = "'" + temp + "'";
					}
					String se = Arrays.toString(ar);
					String newSt = se.replaceAll("\\[", "(");
					String newSt2 = newSt.replaceAll("]", ")");
					// 获取二级销售主管下，销售的编号
					List<String> empCod = dao.executeQuerySql(
							"select u.employeeCode from t_bss_sys_user u where u.locked='N' and u.parentEmployeeCode in "
									+ newSt2 + "",
							null);
					if (empCod.size() > 0) {
						String[] art = (String[]) empCod.toArray(new String[empCod.size()]);
						for (int i = 0; i < art.length; i++) {
							String temp = art[i];
							art[i] = "'" + temp + "'";
						}
						String see = Arrays.toString(art);
						String newStr = see.replaceAll("\\[", "(");
						String newStr2 = newStr.replaceAll("]", ")");
						// TODO ..
						sql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u  where u.locked='N' and  u.parentEmployeeCode != null and u.locked='N' or u.employeeCode = '"
								+ user.getEmployeeCode() + "' or u.parentEmployeeCode = '" + user.getEmployeeCode()
								+ "' or u.employeeCode in " + newStr2;

					} else {
						sql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u where u.locked='N' and  u.parentEmployeeCode != null and u.locked='N' or u.employeeCode = '"
								+ user.getEmployeeCode() + "' or u.parentEmployeeCode = '" + user.getEmployeeCode()
								+ "'";

					}
				} else {
					sql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u where u.locked='N' and  u.employeeCode='"
							+ user.getEmployeeCode() + "'";
				}

			} else if (roles.contains("secondLevelSalesManage")) {
				sql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u where u.locked='N' and  u.parentEmployeeCode='"
						+ user.getEmployeeCode() + "'";
			}

			List<User> list = (List<User>) dao.executeQuerySql(sql, null);

			List<User> personList = new ArrayList<User>();
			for (Object array : list) {
				User personInfo = new User((Object[]) array);
				personList.add(personInfo);
			}
			logger.info("end  getSaleUsers : [ id =" + WebUtil.getLogBasicString() + "]");
			return personList;
		}
		String sql = "SELECT u.id,u.username,u.employeeCode,ui.`name` FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur,	t_crm_user_info ui "
				+ "WHERE u.locked='N' and ur.userid = u.id AND ur.roleid = r.id  AND (r.id in (?,7,9)) AND ui.id=u.userInfo_id ";
		Object obj[] = new Object[] { flag };
		List<User> list = (List<User>) dao.executeQuerySql(sql, obj);

		List<User> personList = new ArrayList<User>();
		for (Object array : list) {
			Object[] o= (Object[]) array;
			User personInfo = new User((Object[]) array,(String)o[3]);
			personList.add(personInfo);
		}
		logger.info("end  getSaleUsers : [ id =" + WebUtil.getLogBasicString() + "]");
		return personList;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> getManageSaleUsers(String code) {
		List<User> personList = new ArrayList<User>();
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (roles.contains("salesManage") || roles.contains("customerManage")) {
			String name = "";
			if (roles.contains("salesManage"))
				name = "secondLevelSalesManage";
			else
				name = "secondLevelCustomerManage";
			List ecode = dao
					.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u LEFT JOIN t_bss_userrole_info rt ON  "
							+ " u.id = rt.userid LEFT JOIN t_bss_sys_role_info r ON r.id =rt.roleid WHERE u.locked='N' and r.roleName='"
							+ name + "' " + " and u.parentEmployeeCode = '" + code + "'", null);
			String twoLeve = "(";
			for (int i = 0; i < ecode.size(); i++) {
				String sql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u "
						+ " WHERE  u.locked='N' and  u.parentEmployeeCode = '" + ecode.get(i).toString() + "' ";
				List<User> list = (List<User>) dao.executeQuerySql(sql, null);
				for (Object array : list) {
					User personInfo = new User((Object[]) array);
					personList.add(personInfo);
				}
				twoLeve = twoLeve + ecode.size() + ",";
			}
			twoLeve = twoLeve.substring(0, twoLeve.length() - 1) + ")";
			String cdStr = "";
			if (!twoLeve.equals(")")) {
				cdStr = " and u.parentEmployeeCode not in " + twoLeve;
			}
			String sql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u "
					+ " WHERE  u.locked='N' and  u.parentEmployeeCode = '" + code + "' " + cdStr
					+ "  or u.employeeCode = '" + code + "'";
			List<User> list = (List<User>) dao.executeQuerySql(sql, null);
			for (Object array : list) {
				User personInfo = new User((Object[]) array);
				personList.add(personInfo);
			}
		} else if (roles.contains("secondLevelSalesManage") || roles.contains("secondLevelCustomerManage")) {
			String sql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u "
					+ " WHERE  u.locked='N' and  u.parentEmployeeCode = '" + code + "' or u.employeeCode = '" + code
					+ "'";
			List<User> list = (List<User>) dao.executeQuerySql(sql, null);
			for (Object array : list) {
				User personInfo = new User((Object[]) array);
				personList.add(personInfo);
			}
		} else if (roles.contains("Sys_Admin")) {
			String sql = "SELECT u.id,u.username,u.employeeCode FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur,t_crm_user_info ui "
					+ "WHERE ui.id=u.userInfo_id and ur.userid = u.id AND ur.roleid = r.id  AND (r.id in (6,8,10))";
			List<User> list = (List<User>) dao.executeQuerySql(sql, null);
			for (Object array : list) {
				User personInfo = new User((Object[]) array);
				personList.add(personInfo);
			}
		}
		logger.info("end  getSaleUsers : [ id =" + WebUtil.getLogBasicString() + "]");
		return personList;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> findUsers(User user) {
		logger.info("begin findUsers. id = [" + user.getId() + "]");
		List<Criterion> criterionList = new ArrayList<Criterion>();

		if (!StringUtils.isEmpty(user.getUsername())) {
			criterionList.add(Restrictions.like("username", "%" + user.getUsername() + "%"));
		}
		Criterion[] criterions = criterionList.toArray(new Criterion[criterionList.size()]);

		List<User> users = dao.getList(User.class, criterions);
		logger.info("end findUsers.[ id =" + WebUtil.getLogBasicString() + "]");
		return users;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserListVo> findUsers(BasePagerObject userCondition) {
		//
		logger.info("begin findUsers. ");
		String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
		//如果是组长 把组长和管理员过滤掉 只有审核人和制单人sunkun
		Set<String> roles =  (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if(roles.contains("Ocr_group")){
			conStr+=" and rl.roleid in (14,15) ";
		}
		String hql = "SELECT " + "users.id, " + " personinfo.id as uid, " + "users.username , " + "  userInfo.name,"
				+ "userInfo.telephone ," + " userInfo.email ," + " users.locked ," + " users.createBy ,"
				+ " users.createDate," + "   users.employeeCode," + "  personinfo.salutation,role.roleName,role.roleNameCN,"
				+ "   userInfo.lastUpdateDate  AS lastUpdateDate  " + " FROM " + "    t_bss_sys_user users CROSS "
				+ "   JOIN" + "      t_crm_person_info personinfo left join t_bss_userrole_info rl  on users.id = rl.userid "
						+ " left join t_bss_sys_role_info role on role.id = rl.roleid " + "    INNER JOIN" + "    t_crm_user_info userInfo "
				+ "            ON personinfo.id=userInfo.id " + "    WHERE" + "    users.ownerId = -2   and   users.userInfo_id=personinfo.id "
				+ conStr + "   UNION ALL" + "            SELECT" + "        users.id  ,"
				+ "        personinfo.id  as uid ," + "       users.username  ," + "      userInfo.name  ,"
				+ "       userInfo.telephone  ," + "        userInfo.email  ," + "       users.locked  ,"
				+ "        users.createBy  ," + "        users.createDate  ," + "        users.employeeCode  ,"
				+ "	        ''salutation ,role.roleName,role.roleNameCN," + "        userInfo.lastUpdateDate  AS lastUpdateDate" + "    FROM"
				+ "	        t_bss_sys_user users CROSS " + "    JOIN" + "	        t_crm_enterprise_info personinfo  left join t_bss_userrole_info rl  "
						+ "on users.id = rl.userid  left join t_bss_sys_role_info role on role.id = rl.roleid "
				+ "	    INNER JOIN" + "        t_crm_user_info userInfo " + "            ON personinfo.id=userInfo.id "
				+ "   WHERE" + "    users.ownerId = -2   and    users.userInfo_id=personinfo.id " + conStr;
		
		List<SearchUserListVo> listVO = dao.getLst4PagingWithSQL(hql + " ORDER BY lastUpdateDate DESC ",
				new int[] { userCondition.getPagenum(), userCondition.getPagesize() });
		List<SearchUserListVo> users = new ArrayList<SearchUserListVo>();
		for (Object rsArray : listVO) {
			SearchUserListVo vo = new SearchUserListVo((Object[]) rsArray);
			users.add(vo);
		}
		String hqlac = "select count(users.id)" + "  FROM " + "    t_bss_sys_user users CROSS "
				+ "   JOIN" + "      t_crm_person_info personinfo left join t_bss_userrole_info rl  on users.id = rl.userid "
						+ " left join t_bss_sys_role_info role on role.id = rl.roleid " + "    INNER JOIN" + "    t_crm_user_info userInfo "
				+ "            ON personinfo.id=userInfo.id " + "    WHERE" + "   users.ownerId = -2   and    users.userInfo_id=personinfo.id "
				+ conStr;
		String hqlacc = "select count(users.id)" + " FROM"
				+ "	        t_bss_sys_user users CROSS " + "    JOIN" + "	        t_crm_enterprise_info personinfo  left join t_bss_userrole_info rl  "
						+ "on users.id = rl.userid  left join t_bss_sys_role_info role on role.id = rl.roleid "
				+ "	    INNER JOIN" + "        t_crm_user_info userInfo " + "            ON personinfo.id=userInfo.id "
				+ "   WHERE" + "    users.ownerId = -2   and    users.userInfo_id=personinfo.id " + conStr;
		Long count = dao.getCount4PagingWithSQL(hqlac);
		Long count1 = dao.getCount4PagingWithSQL(hqlacc);
		count=count+count1;
		BaseModelList<SearchUserListVo> lists = new BaseModelList<SearchUserListVo>(count,
				WebUtil.getEntryListFromProxyList(users, dao));

//		if (count != 0) {
//			
//			String idStr = "   in ( ";
//			for (SearchUserListVo vo : lists.getRows()) {
//				idStr = idStr + vo.getUserid() + ",";
//			}
//			idStr = idStr.substring(0, idStr.length() - 1) + ") ";
//
//			String roleHql = "select new com.zqw.bss.vo.sys.SearchUserListVo(user.id, role.roleName ,role.roleNameCN) from  User user left join user.roles role"
//					+ " where   user.id  " + idStr;
//
//			List<SearchUserListVo> roleNameList = dao.find(roleHql);
//			Iterator<SearchUserListVo> iter = lists.getRows().iterator();
//			while (iter.hasNext()) {
//					SearchUserListVo	vo = iter.next();
//					vo.setRoleName("");
//					vo.setRoleNameCN("");
//					for (SearchUserListVo map : roleNameList) {
//						if (vo.getUserid().equals(map.getUserid()) && !StringUtils.isEmpty(map.getRoleName())) {
//							vo.setRoleName(vo.getRoleName() + map.getRoleName() + ",");
//							vo.setRoleNameCN(vo.getRoleNameCN() + map.getRoleNameCN() + ",");
//						}
//					}
//					if (!StringUtils.isEmpty(vo.getRoleName()) && !StringUtils.isEmpty(vo.getRoleNameCN())) {
//						vo.setRoleName(vo.getRoleName().substring(0, vo.getRoleName().length() - 1));
//						vo.setRoleNameCN(vo.getRoleNameCN().substring(0, vo.getRoleNameCN().length() - 1));
//					}
//					if(!isRole.equals("N")&&!isRole.equals(vo.getRoleNameCN())){
//						iter.remove();
//					}
//			}
//			List<SearchUserListVo> userList = lists.getRows();
//			if(!isRole.equals("N"))
//				lists = new BaseModelList<SearchUserListVo>(Long.valueOf(userList.size()),
//						WebUtil.getEntryListFromProxyList(userList, dao));
//		}
		logger.info("end findUsers:[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Resource> getUserResourceByUsername(String username) {
		logger.info("begin getUserResourceByUsername.  username = [" + username + "]");
		User user = getUserByUsername(username);
		if (user == null) {
			return null;
		}

		List<Resource> resources = new ArrayList<Resource>();

		for (Role role : user.getRoles()) {

			for (Resource resource : role.getResources()) {
				resources.add(resource);
			}
		}
		logger.info("end getUserResourceByUsername. permissions = [" + resources.toArray().toString() + "]");
		return resources;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean changePasswordByName(String name, String newPassword) {
		String retStr = "";
		User currentUser = getUserByUsername(name);
		currentUser.getRoles().size();
		if (null != currentUser) {
			logger.info("begin changePassword.  id = [" + currentUser.getId() + "]");
			currentUser.setPassword(newPassword);
			SessionUtil.put("ownerId", currentUser.getOwnerId());
			this.updateUser(currentUser);
			logger.info("end changePassword.[ id =" + WebUtil.getLogBasicString() + "]");
			retStr = "success";
			return true;
		} else {
			throw new OperationException("系统中不存在该用户");
		}
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public User getCurrentUserInfo() {
		logger.info("begin getCurrentUserInfo.");
		User currentUser = getUserByUsername((String) SecurityUtils.getSubject().getPrincipal());
		logger.info("end  getCurrentUserInfo.CurrentUserInfo : [ id =" + currentUser.getId()
				+ WebUtil.getLogBasicString() + "]");
		return currentUser;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<User> getUsersByRegisterDate(Date startDate, Date endDate) {
		logger.info("begin getUsersByRegisterDate.");
		List<User> users = dao.find("from User where createDate >? and createDate <?",
				new Date[] { startDate, endDate });
		logger.info("end getUsersByRegisterDate.[ id =" + WebUtil.getLogBasicString() + "]");
		for (User user : users) {
			user.getRoles().size();
			for (Role role : user.getRoles()) {
				role.getResources().size();
			}
		}
		return users;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateLockedUser(Long id, Boolean flag) {
		logger.info("begin updateLockedUser.");
		User user = (User) dao.getObject(User.class, id, LockMode.UPGRADE_NOWAIT);
		user.setLocked(flag);
		user = (User) dao.update(user);
		for (Role roles : user.getRoles()) {
			String rolename = "";
			if (roles.getRoleName().equals("taxStaffadmin")) {
				rolename = "taxStaffadmin";
			}
			if (roles.getRoleName().equals("salesManage")) {
				rolename = "salesManage";
			}
			if (roles.getRoleName().equals("customerManage")) {
				rolename = "customerManage";
			}
			List<SearchUserByTaxListVo> list = new ArrayList<SearchUserByTaxListVo>();
			if (!rolename.equals("")) {
				String sql = " select u.id,u.employeeCode,u.username from t_bss_sys_user u left join t_bss_userrole_info ui on u.id=ui.userid left join "
						+ " t_bss_sys_role_info r on r.id = ui.roleid where r.roleName='" + rolename
						+ "' order by u.createdate desc";
				list = dao.getLst4PagingWithSQL(sql, new int[] { 0, 99999999 });
			}
			List<SearchUserByTaxListVo> uslist = new ArrayList<SearchUserByTaxListVo>();
			for (Object rsArray : list) {
				SearchUserByTaxListVo vo = new SearchUserByTaxListVo((Object[]) rsArray, null);
				uslist.add(vo);
			}
			if ((roles.getRoleName().equals("taxStaff") || roles.getRoleName().equals("taxStaffadmin"))
					&& flag == true) {
				List<Owner> owner = dao.find("from Owner ow where ow.taxCode = '" + user.getEmployeeCode() + "'");
				
			}
			if ((roles.getRoleName().equals("secondLevelSalesManage")
					|| roles.getRoleName().equals("secondLevelCustomerManage")
					|| roles.getRoleName().equals("salesStaff") || roles.getRoleName().equals("customerService")
					|| roles.getRoleName().equals("salesManage") || roles.getRoleName().equals("customerManage"))
					&& flag == true) {
				List<Owner> owner = dao.find("from Owner ow where ow.employeeCode = '" + user.getEmployeeCode() + "'");
				for (Owner o : owner) {
					if (user.getParentEmployeeCode() != null) {
						o.setEmployeeCode(user.getParentEmployeeCode());
						dao.executeHql("update User set parentEmployeeCode =  '" + user.getParentEmployeeCode()
								+ "' where  parentEmployeeCode ='" + user.getEmployeeCode() + "'", null);
					} else {
						if (uslist.size() > 0 && !uslist.get(0).getId().equals(user.getId())) {
							o.setEmployeeCode(uslist.get(0).getemployeeCode());
						} else if (uslist.size() > 1) {
							o.setEmployeeCode(uslist.get(1).getemployeeCode());
						}
					}
					dao.update(o);
				}
			}
		}
		logger.info("end updateLockedUser.[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserBuyListVo> getSearchUserBuyVobusrListVo(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition) {
		logger.info("begin getSearchUserBuyListVo.");
		String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
		List<User> users = dao.find(
				"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		List<SalesAgent> salesAgent = dao
				.find("from SalesAgent sa  where sa.userInfo.id =" + users.get(0).getUserInfo().getId());

		String sql = "select new com.zqw.bss.vo.sys.SearchUserBuyListVo(owner0.id,owner0.createDate,owner0.loginId,enterprise.name,owner0.regTelephone,owner0.employeeCode,owner0.agentCode) from "
				+ " Owner owner0 left join owner0.enterpriseInfo enterprise where  owner0.agentCode ='"
				+ salesAgent.get(0).getAgentCode() + "' and owner0.id>1 " + conStr;
		List<SearchUserBuyListVo> list = dao.getLst4Paging(sql + " order by owner0.createDate desc ",
				new int[] { userCondition.getPagenum(), userCondition.getPagesize() });
		String hqlacc = "select count(distinct owner0.id) from "
				+ " Owner owner0 left join owner0.enterpriseInfo enterprise where  owner0.agentCode ='"
				+ salesAgent.get(0).getAgentCode() + "' and owner0.id>1 " + conStr;
		Long count = dao.getCount4Paging(hqlacc);
		String idStr = "   in ( ";
		Map<String, Date> mapdate = this.getdate();
		List<SearchUserBuyListVo> listagentistrator = new ArrayList<SearchUserBuyListVo>();
		List<SearchUserBuyListVo> listsalesStaff = new ArrayList<SearchUserBuyListVo>();
		String ident = "";
		for (SearchUserBuyListVo vo : list) {
			List<User> user = new ArrayList<>();
			if (vo.getEmployeeCode() != null)
				user = dao.find("from User where username = '" + vo.getEmployeeCode() + "'");
			PersonInfo pers = null;
			if (user.size() > 0) {
				EnterpriseInfo per = (EnterpriseInfo) dao.getObject(EnterpriseInfo.class,
						user.get(0).getUserInfo().getId());
				if (per == null)
					pers = (PersonInfo) dao.getObject(PersonInfo.class, user.get(0).getUserInfo().getId());
				if (per != null && per.getPersonInfos().size() > 0) {
					vo.setSaler(per.getPersonInfos().get(0).getName() + " ( " + user.get(0).getUsername() + " )");
				} else if (pers != null) {
					vo.setSaler(pers.getName() + " ( " + user.get(0).getUsername() + " )");
				} else {
					vo.setSaler(user.get(0).getUsername());
				}
			}
			vo.setVoucher(salesAgent.get(0).getAgentName());
			List<BillingRecord> accountOrderList = dao.find("from BillingRecord pay where pay.ownerId = "
					+ vo.getOwnerId() + " and (pay.status = 'paid' or pay.status = 'offline')");
			if (accountOrderList.size() > 0) {
				BigDecimal totalAmt = BigDecimal.ZERO;
				for (BillingRecord so : accountOrderList) {
					totalAmt = totalAmt.add(so.getAmount());
				}
				if (startAmt.compareTo(BigDecimal.ZERO) == 0 && endAmt.compareTo(BigDecimal.ZERO) == 0) {
					vo.setTotalAmt(totalAmt);
				} else {
					if (totalAmt.compareTo(startAmt) > 0 && totalAmt.compareTo(endAmt) < 0) {
						vo.setTotalAmt(totalAmt);
					} else {
						continue;
					}
				}
				vo.setTotalAmt(totalAmt);
			}
		}
		BaseModelList<SearchUserBuyListVo> lists = new BaseModelList<SearchUserBuyListVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean distributionSalerByAdmin(Long customerid, Owner owner) {
		logger.info("begin distributionSalerByAdmin.");
		Owner own = (Owner) dao.getObject(Owner.class, owner.getId());
		User cususer = null;
		if (!customerid.equals("0"))
			cususer = (User) dao.getObject(User.class, customerid);
		if (cususer != null)
			own.setCustomerCode(cususer.getEmployeeCode());
		SalesAgent sa = new SalesAgent();
		User user = null;
		if (owner.getSales() != null)
			user = (User) dao.getObject(User.class, owner.getSales().getId());
		if (owner.getAgent() != null) {
			sa = (SalesAgent) dao.getObject(SalesAgent.class, owner.getAgent().getId());
			own.setAgent(owner.getAgent());
		}
		own.setSalesType(owner.getSalesType());
		if (sa.getAgentCode() != null)
			own.setAgentCode(sa.getAgentCode());
		own.setSales(owner.getSales());
		if (user != null)
			own.setEmployeeCode(user.getEmployeeCode());
		dao.update(own);
		logger.info("end distributionSalerByAdmin.");
		return true;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Map<String, Date> getdate() {
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal_1 = Calendar.getInstance();
		cal_1.add(Calendar.MONTH, 0);
		cal_1.set(Calendar.DAY_OF_MONTH, 1);
		String firstDay = format.format(cal_1.getTime());
		Calendar cale = Calendar.getInstance();
		cale.set(Calendar.DAY_OF_MONTH, cale.getActualMaximum(Calendar.DAY_OF_MONTH));
		String lastDay = format.format(cale.getTime());
		Map<String, Date> map = new HashMap<String, Date>();
		try {
			map.put("firstDay", format.parse(firstDay));
			map.put("lastDay", format.parse(lastDay));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return map;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SalesVo> getSalesByPage(String num,String beginDate,String endDate,BasePagerObject bso) {
		logger.info("begin getSalesByPage");
		String conStr = "";
		List<Condition> list2 = bso.getCondition();
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		for (Condition condition : list2) {
			String key = condition.getKey();
			if (key.equals("locked")) {
				String string = condition.getValue()[0];
				if (string.equals("Y")) {
					conStr += " AND locked = 'Y'";
				} else if (string.equals("N")) {
					conStr += " AND locked = 'N'";
				}
			} else if (key.equals("username")) {
				String string = condition.getValue()[0];
				conStr += " AND username LIKE '%" + string + "%'";
			}
		}

		List<User> users = dao.find(
				"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		User user = null;
		if (users.size() > 0) {
			user = users.get(0);
		}
		String sql = "";
		String sqls = "";
		if (roles.contains("salesManage") || roles.contains("customerManage")) {
			// 获取二级销售主管编号
			List<String> empCode = dao
					.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode = '"
							+ user.getEmployeeCode() + "'", null);
			if (empCode.size() > 0) {
				String[] ar = (String[]) empCode.toArray(new String[empCode.size()]);
				for (int i = 0; i < ar.length; i++) {
					String temp = ar[i];
					ar[i] = "'" + temp + "'";
				}
				String se = Arrays.toString(ar);
				String newSt = se.replaceAll("\\[", "(");
				String newSt2 = newSt.replaceAll("]", ")");
				// 获取二级销售主管下，销售的编号
				List<String> empCod = dao.executeQuerySql(
						"select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode in " + newSt2 + "",
						null);
				empCod.add(user.getEmployeeCode());
				if (empCod.size() > 0) {
					String[] art = (String[]) empCod.toArray(new String[empCod.size()]);
					for (int i = 0; i < art.length; i++) {
						String temp = art[i];
						art[i] = "'" + temp + "'";
					}
					String see = Arrays.toString(art);
					String newStr = see.replaceAll("\\[", "(");
					String newStr2 = newStr.replaceAll("]", ")");
					sql = "SELECT u.id,u.username,userInfo.name,u.employeeCode,u.locked FROM t_bss_sys_user u left join t_crm_user_info userInfo on u.userInfo_id=userInfo.id where (u.parentEmployeeCode != null "
							 + "  or u.parentEmployeeCode = '" + user.getEmployeeCode()
							+ "' or u.employeeCode in " + newStr2+")"+ conStr;
					sqls = "SELECT count(u.id) FROM t_bss_sys_user u where (u.parentEmployeeCode != null " 
							+ " or u.parentEmployeeCode = '" + user.getEmployeeCode() + "' or u.employeeCode in "
							+ newStr2+")"+ conStr;

				} else {
					sql = "SELECT u.id,u.username,userInfo.name,u.employeeCode,u.locked FROM t_bss_sys_user u left join t_crm_user_info userInfo on u.userInfo_id=userInfo.id where (u.parentEmployeeCode != null "
							+  "  or u.parentEmployeeCode = '" + user.getEmployeeCode() + "')"+conStr ;
					sqls = "SELECT count(u.id) FROM t_bss_sys_user u where (u.parentEmployeeCode != null " 
							+  "  or u.parentEmployeeCode = '" + user.getEmployeeCode() + "')"+conStr;
				}

			}else{
				sql = "SELECT u.id,u.username,userInfo.name,u.employeeCode,u.locked FROM t_bss_sys_user u left join t_crm_user_info userInfo on u.userInfo_id=userInfo.id where (u.parentEmployeeCode != null "
						+  "  or u.employeeCode = '" + user.getEmployeeCode() + "')"+conStr ;
				sqls = "SELECT count(u.id) FROM t_bss_sys_user u where (u.parentEmployeeCode != null " 
						+  "  or u.employeeCode = '" + user.getEmployeeCode() + "')"+conStr;
			}
		} else if (roles.contains("secondLevelSalesManage") || roles.contains("secondLevelCustomerManage")) {
			sql = "SELECT u.id,u.username,userInfo.name,u.employeeCode,u.locked FROM t_bss_sys_user u left join t_crm_user_info userInfo on u.userInfo_id=userInfo.id where  (u.parentEmployeeCode != null"
					+ " or u.parentEmployeeCode = '" + user.getEmployeeCode() + "')"+ conStr ;
			sqls = "SELECT count(u.id) FROM t_bss_sys_user u where (u.parentEmployeeCode != null " 
					+ " or u.parentEmployeeCode = '" + user.getEmployeeCode() + "')"+ conStr;
		}
		if (num.equals("0")) {
			if (roles.contains("Sys_Admin")) {
				sql = "SELECT u.id,u.username,userInfo.name,u.employeeCode,u.locked FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur,t_crm_user_info userInfo "
						+ "WHERE ur.userid = u.id AND ur.roleid = r.id  AND r.id in (3,7,9) AND userInfo.id=u.userInfo_id "
						+ conStr + "";
				sqls = "SELECT count(u.id) FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur "
						+ "WHERE ur.userid = u.id AND ur.roleid = r.id  AND r.id in (3,7,9) " + conStr + "";
			}
		} else if (num.equals("1")) {
			if (roles.contains("Sys_Admin")) {
				sql = "SELECT u.id,u.username,userInfo.name,u.employeeCode,u.locked FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur,t_crm_user_info userInfo "
						+ "WHERE ur.userid = u.id AND ur.roleid = r.id  AND r.id in (6,8,10) AND userInfo.id=u.userInfo_id "
						+ conStr + "";
				sqls = "SELECT count(u.id) FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur "
						+ "WHERE ur.userid = u.id AND ur.roleid = r.id  AND r.id in (6,8,10) " + conStr + "";
			}
		}
		List listO=new ArrayList<>();
		Long count=0L;
		if (sql.length()!=0) {
			listO = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
			count = dao.getCount4PagingWithSQL(sqls);
		}


		List<User> personList = new ArrayList<User>();
		List<SalesVo> ls = new ArrayList<SalesVo>();
		//通过日期查询代理商数 客户数
		String list1 = "";
		String list3 = "";
		String list4 = "";
		String list5 = "";
		if(!beginDate.equals("0")&&!endDate.equals("0")&&!beginDate.equals(" ")&&!endDate.equals(" ")){
			list1=" and u.createDate >='"+beginDate+"' and  u.createDate <='"+endDate+"'";
			list3=" and o.createDate >='"+beginDate+"' and  o.createDate <='"+endDate+"'";
			list4=" and t.createDate >='"+beginDate+"' and  t.createDate <='"+endDate+"'";
			list5=" and ao.createDate >='"+beginDate+"' and  ao.createDate <='"+endDate+"'";
		}else if(beginDate.equals("0")&&!endDate.equals("0")){
			list1=" and u.createDate <='"+endDate+"'";
			list3=" and o.createDate <='"+endDate+"'";
			list4=" and  t.createDate <='"+endDate+"'";
			list5=" and  ao.createDate <='"+endDate+"'";
		}else if(!beginDate.equals("0")&&endDate.equals("0")){
			list1=" and u.createDate >='"+beginDate+"'";
			list3=" and o.createDate >='"+beginDate+"'";
			list4=" and t.createDate >='"+beginDate+"'";
			list5=" and ao.createDate >='"+beginDate+"'";
		}
		
		List list = dao.executeQuerySql("SELECT sa.sales_id,sa.customer_id FROM t_bss_agent sa LEFT JOIN t_crm_user_info u ON sa.userInfo_id = u.id WHERE 1=1 "+list1, null);
		List lis = dao.executeQuerySql("SELECT o.sales_id,o.customerCode FROM t_crm_owner o  where 1=1 "+list3, null);
		List lisf = dao.executeQuerySql("SELECT DISTINCT t.id,t.sales_id,t.customerCode from t_crm_owner t LEFT JOIN t_bss_order o on t.id=o.ownerId WHERE o.payStatus='paid' "+list4, null);
		for (Object array : listO) {
			User s = new User(((Object[]) array)[2], (Object[]) array);
			if (num.equals("0")) {
				// 设置拥有代理商数量
				Object[] param = new Object[1];
				param[0] = s.getId();
//				List<SalesAgent> list = (List<SalesAgent>) dao.find("from SalesAgent sa where sa.sales.id=?", param);
				int listsize = 0;
				for(int i = 0; i < list.size(); i++){
					Object[] obj = (Object[]) list.get(i);
					if(obj[0]!=null&&s.getId().equals(Long.valueOf(obj[0].toString()))){
						listsize++;
					}
				}
				// 设置客户数量
//				Object[] para = new Object[1];
//				para[0] = s.getId();
//				List<Owner> lis = (List<Owner>) dao.find("from Owner o where o.sales.id=?", para);
				int lissize = 0;
				for(int i = 0; i < lis.size(); i++){
					Object[] obj = (Object[]) lis.get(i);
					if(obj[0]!=null&&s.getId().equals(Long.valueOf(obj[0].toString()))){
						lissize++;
					}
				}
				// 付费用户
//				Long lisf = dao.getCount4PagingWithSQL(
//						"SELECT count( DISTINCT t.id) from t_crm_owner t LEFT JOIN t_bss_order o on t.id=o.ownerId WHERE o.payStatus='paid' and t.sales_id="
//								+ param[0]);
				Long size = 0L;
				for(int i=0;i<lisf.size();i++){
					Object[] obj = (Object[]) lisf.get(i);
					if(obj[1]!=null&&s.getId().equals(Long.valueOf(obj[1].toString()))){
						size++;
					}
				}
				String select = "select sum(ao.amount) from BillingRecord ao,Owner o where ao.ownerId=o.id and ao.status='paid' and o.salesType=";
				// 设置直销数额
				List<BigDecimal> n = (List<BigDecimal>) dao.find(select + "'salesDirect' and o.sales.id=?"+list5, param);
				// 设置商机转换销数额
				List<BigDecimal> nm = (List<BigDecimal>) dao.find(select + "'transformation' and o.sales.id=?"+list5, param);
				// 设置代理商销数额
				List<BigDecimal> sn = (List<BigDecimal>) dao.find(
						"select sum(ao.amount) from BillingRecord ao,Owner o,SalesAgent sa where ao.ownerId=o.id and ao.status='paid' and o.agentCode=sa.agentCode and o.salesType='agentDirect' and sa.sales.id=?"+list5,
						param);
				SalesVo sv = new SalesVo(s, listsize, lissize, n.size() > 0 ? n.get(0) : BigDecimal.ZERO,
						nm.size() > 0 ? nm.get(0) : BigDecimal.ZERO, sn.size() > 0 ? sn.get(0) : BigDecimal.ZERO, size);
				ls.add(sv);
			} else if (num.equals("1")) {

				// 设置拥有代理商数量
//				Object[] param = new Object[1];
//				param[0] = s.getId();
//				List<SalesAgent> list = (List<SalesAgent>) dao.find("from SalesAgent sa where sa.customer.id=?", param);
				int listsize = 0;
				for(int i = 0; i < list.size(); i++){
					Object[] obj = (Object[]) list.get(i);
					if(obj[1]!=null&&s.getId().equals(Long.valueOf(obj[1].toString()))){
						listsize++;
					}
				}
				// 设置客户数量
				Object[] para = new Object[1];
				para[0] = s.getEmployeeCode();
//				List<Owner> lis = (List<Owner>) dao.find("from Owner o where o.customerCode=?", para);
				int lissize = 0;
				for(int i = 0; i < lis.size(); i++){
					Object[] obj = (Object[]) lis.get(i);
					if(obj[1]!=null&&s.getEmployeeCode().equals(obj[1].toString())){
						lissize++;
					}
				}
				// 付费用户
//				Long lisf = dao.getCount4PagingWithSQL(
//						"SELECT count( DISTINCT t.id) from t_crm_owner t LEFT JOIN t_bss_order o on t.id=o.ownerId WHERE o.payStatus='paid' and t.customerCode="
//								+ "'" + para[0] + "'");
				Long size = 0L;
				for(int i=0;i<lisf.size();i++){
					Object[] obj = (Object[]) lisf.get(i);
					if(obj[2]!=null&&s.getEmployeeCode().equals(obj[2].toString())){
						size++;
					}
				}
				String select = "select sum(ao.amount) from BillingRecord ao,Owner o where ao.ownerId=o.id and ao.status='paid' and o.salesType=";
				// 设置直销数额
				List<BigDecimal> n = (List<BigDecimal>) dao.find(select + "'salesDirect' and o.customerCode=?"+list5, para);
				// 设置商机转换销数额
				List<BigDecimal> nm = (List<BigDecimal>) dao.find(select + "'transformation' and o.customerCode=?"+list5,
						para);
				// 设置代理商销数额
				List<BigDecimal> sn = (List<BigDecimal>) dao.find(
						"select sum(ao.amount) from BillingRecord ao,Owner o,SalesAgent sa where ao.ownerId=o.id and ao.status='paid' and o.agentCode=sa.agentCode and o.salesType='agentDirect' and sa.customer.employeeCode=?"+list5,
						para);
				SalesVo sv = new SalesVo(s, listsize, lissize, n.size() > 0 ? n.get(0) : BigDecimal.ZERO,
						nm.size() > 0 ? nm.get(0) : BigDecimal.ZERO, sn.size() > 0 ? sn.get(0) : BigDecimal.ZERO, size);
				ls.add(sv);
			}

		}
		// 按照付费用户数从大到小排
		for (int i = 0; i < ls.size() - 1; i++) {
			for (int j = 1; j < ls.size() - i; j++) {
				SalesVo a = new SalesVo();
				if ((ls.get(j).getFeeNum()).compareTo(ls.get(j - 1).getFeeNum()) > 0) { // 比较两个整数的大小

					a = ls.get(j - 1);
					ls.set((j - 1), ls.get(j));
					ls.set(j, a);
				}
			}  
		}
		BaseModelList<SalesVo> lists = new BaseModelList<SalesVo>(count, WebUtil.getEntryListFromProxyList(ls, dao));
		logger.info("end getSalesByPage");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<SearchUserListVo> getAllUserInformation(String roleName, String username) {

		String sqlsys = "select new com.zqw.bss.vo.sys.SearchUserListVo(user.loginId,enterpriseInfo.name,user.id) from "
				+ " Owner user,EnterpriseInfo enterpriseInfo where  user.enterpriseInfo.id = enterpriseInfo.id and user.id>1 ";

		// String sqlage = "select new
		// com.zqw.bss.vo.sys.SearchUserListVo(user.loginId,enterpriseInfo.name)
		// from "
		// + " Owner user,EnterpriseInfo enterpriseInfo where
		// user.enterpriseInfo.id = enterpriseInfo.id and user.id>1 ";
		//
		// String sqlsal = "select new
		// com.zqw.bss.vo.sys.SearchUserListVo(user.loginId,enterpriseInfo.name)
		// from "
		// + " Owner user,EnterpriseInfo enterpriseInfo where
		// user.enterpriseInfo.id = enterpriseInfo.id and user.id>1 ";
		List<SearchUserListVo> list = new ArrayList<SearchUserListVo>();
		String[] role = roleName.split(",");
		for (String r : role) {
			if (r.equals("Sys_Admin")) {
				list = dao.find(sqlsys);
			}
			if (r.equals("taxStaff") || r.equals("taxStaffadmin")) {
				List<User> user = dao.find(" from User where username = '"
						+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
				List<User> users = dao
						.find("from User  where parentEmployeeCode='" + user.get(0).getEmployeeCode() + "'");
				String codeStr = " in ('" + user.get(0).getEmployeeCode() + "',";
				if (users.size() > 0) {
					for (User use : users) {
						codeStr = codeStr + "'" + use.getEmployeeCode() + "',";
					}
				}
				codeStr = codeStr.substring(0, codeStr.length() - 1);
				codeStr = codeStr + ")";
				list = dao.find(sqlsys + " and user.taxCode " + codeStr);
			}
			if (r.equals("customerService") || r.equals("customerManage") || r.equals("secondLevelCustomerManage")) {
				List<User> users = dao.find("from User where username = '"
						+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
				List<User> user = dao
						.find("from User where parentEmployeeCode = '" + users.get(0).getEmployeeCode() + "'");
				String code = " in('" + users.get(0).getEmployeeCode() + "',";
				if (user.size() > 0) {
					for (User use : user) {
						code = code + "'" + use.getEmployeeCode() + "',";
					}
				}
				Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
				if (roles.contains("customerManage")) {
					List ecode = dao.executeQuerySql(
							"SELECT u.employeeCode FROM t_bss_sys_user u where u.parentEmployeeCode = '"
									+ users.get(0).getEmployeeCode() + "'",
							null);
					if (ecode.size() > 0) {
						for (int i = 0; i < ecode.size(); i++) {
							code = code + "'" + ecode.get(i).toString() + "',";
							List eccode = dao.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u WHERE "
									+ "  u.parentEmployeeCode = '" + ecode.get(i).toString() + "'", null);
							if (eccode.size() > 0 && eccode != null) {
								for (int j = 0; j < eccode.size(); j++) {
									code = code + "'" + eccode.get(j).toString() + "',";
								}
							}
						}
					}
				}
				code = code.substring(0, code.length() - 1) + ")";
				list = dao.find(sqlsys + " and user.employeeCode " + code);
			}

			if (r.equals("salesStaff") || r.equals("salesManage") || r.equals("secondLevelSalesManage")) {
				List<User> users = dao.find("from User where username = '"
						+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
				List<User> user = dao
						.find("from User where parentEmployeeCode = '" + users.get(0).getEmployeeCode() + "'");
				String code = " in('" + users.get(0).getEmployeeCode() + "',";
				if (user.size() > 0) {
					for (User use : user) {
						code = code + "'" + use.getEmployeeCode() + "',";
					}
				}
				Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
				if (roles.contains("salesManage")) {
					List ecode = dao.executeQuerySql(
							"SELECT u.employeeCode FROM t_bss_sys_user u where u.parentEmployeeCode = '"
									+ users.get(0).getEmployeeCode() + "'",
							null);
					if (ecode.size() > 0) {
						for (int i = 0; i < ecode.size(); i++) {
							code = code + "'" + ecode.get(i).toString() + "',";
							List eccode = dao.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u WHERE "
									+ "  u.parentEmployeeCode = '" + ecode.get(i).toString() + "'", null);
							if (eccode.size() > 0 && eccode != null) {
								for (int j = 0; j < eccode.size(); j++) {
									code = code + "'" + eccode.get(j).toString() + "',";
								}
							}
						}
					}
				}
				code = code.substring(0, code.length() - 1) + ")";
				list = dao.find(sqlsys + " and user.employeeCode " + code);
			}
			if (r.equals("agentistrator")) {
				// List<User> users = dao.find("from User where username = '"
				// + (String)
				// SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
				List<User> users = dao.find("from User where username = '" + username + "'");
				List<SalesAgent> salesAgent = dao
						.find("from SalesAgent sa  where sa.userInfo.id =" + users.get(0).getUserInfo().getId());
				if (salesAgent.size() == 0) {
					list = dao.find(sqlsys);
				} else {
					list = dao.find(sqlsys + " and user.agentCode = '" + salesAgent.get(0).getAgentCode() + "'");
				}
			}
		}

		return list;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserBuyListVo> getSearchUserBuyListVo(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition) {
		logger.info("begin getSearchUserBuyListVo.");
		String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
		String hqlacb = "select count(distinct owner0.id) from  Owner owner0  ,EnterpriseInfo enterprise where owner0.employeeCode is null "
				+ "  and owner0.agentCode is null  and owner0.enterpriseInfo.id = enterprise.id and owner0.id>1 "
				+ conStr;
		String hqlacc = "select count(distinct owner0.id) from  Owner owner0 , SalesAgent agent ,EnterpriseInfo enterprise where owner0.employeeCode is null "
				+ "  and agent.agentCode =owner0.agentCode and owner0.enterpriseInfo.id = enterprise.id and owner0.id>1 "
				+ conStr;
		String hqlac = "select count(distinct owner0.id) from Owner owner0 left join owner0.enterpriseInfo enterprise,SalesAgent agent,User user where owner0.agentCode=agent.agentCode"
				+ " and owner0.employeeCode = user.employeeCode   and  owner0.id>1 " + conStr;
		String hqlsales = "select count(distinct owner0.id)  from Owner owner0 left join owner0.enterpriseInfo enterprise,User user where user.employeeCode = owner0.employeeCode "
				+ "and owner0.agentCode is null and owner0.id>1" + conStr;
		String code = "N";
		String codea = "N";
		for (int i = 0; i < userCondition.condition.size(); i++) {
			if (userCondition.condition.get(i).getKey().equals("owner0.sales.username")) {
				code = "Y";
			} else if (userCondition.condition.get(i).getKey().equals("agent.agentName")) {
				codea = "Y";
			}
		}
		Long count = 0L;
		Long counts = 0L;
		String sql = "";
		if (code.equals("N") && codea.equals("N")) {
			sql = "SELECT owner0.id, owner0.createDate,owner0.loginId, enterprise.name, owner0.regTelephone,owner0.employeeCode, owner0.agentCode,  '' username,'' agentName,"
					+ " '' createBy,owner0.lastUpdateDate AS lastUpdateDate  FROM  t_crm_owner owner0 CROSS   JOIN   t_crm_enterprise_info enterprise2  INNER JOIN   t_crm_user_info enterprise"
					+ "  ON enterprise.id=enterprise2.id  WHERE   (owner0.employeeCode IS NULL)  AND (owner0.agentCode IS NULL) "
					+ "    AND owner0.enterpriseInfo_id=enterprise2.id   AND owner0.id>1 " + conStr;
			count = dao.getCount4Paging(hqlacb);

		}
		for (int i = 0; i < userCondition.condition.size(); i++) {
			if (userCondition.condition.get(i).getKey().equals("owner0.createDate")) {
				userCondition.condition.get(i).setKey("owner1.createDate");
			}
			if (userCondition.condition.get(i).getKey().equals("owner0.loginId")) {
				userCondition.condition.get(i).setKey("owner1.loginId");
			}
		}
		conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());

		if (code.equals("N")) {
			String sqlsale = " SELECT owner1.id, owner1.createDate,owner1.loginId, enterprise.name,owner1.regTelephone,owner1.employeeCode, owner1.agentCode,"
					+ "  '' username, agent.agentName,userinfo.createBy,owner1.lastUpdateDate AS lastUpdateDate FROM t_crm_owner owner1 CROSS JOIN  t_bss_agent agent, t_crm_user_info userinfo CROSS "
					+ "  JOIN t_crm_enterprise_info enterprise2 INNER JOIN t_crm_user_info enterprise ON enterprise2.id=enterprise.id "
					+ "  WHERE agent.userInfo_id=userinfo.id AND (  owner1.employeeCode IS NULL  ) AND agent.agentCode=owner1.agentCode "
					+ " AND owner1.enterpriseInfo_id=enterprise2.id  AND owner1.id>1 " + conStr;
			if (sql == "") {
				sql = sqlsale;
				counts = dao.getCount4Paging(hqlacc);
			} else {
				sql = sql + " UNION ALL " + sqlsale;
				counts = dao.getCount4Paging(hqlacc);
			}
		}

		for (int i = 0; i < userCondition.condition.size(); i++) {
			if (userCondition.condition.get(i).getKey().equals("owner0.sales.username")) {
				userCondition.condition.get(i).setKey("user1.username");
			}
			if (userCondition.condition.get(i).getKey().equals("owner1.createDate")) {
				userCondition.condition.get(i).setKey("owner2.createDate");
			}
			if (userCondition.condition.get(i).getKey().equals("owner1.loginId")) {
				userCondition.condition.get(i).setKey("owner2.loginId");
			}
		}
		conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
		String sqlall = "SELECT owner2.id,owner2.createDate,owner2.loginId,enterprise.name,owner2.regTelephone, owner2.employeeCode,owner2.agentCode,user1.username,agent.agentName,"
				+ " userinfo.createBy, owner2.lastUpdateDate AS lastUpdateDate FROM   t_crm_owner owner2 LEFT OUTER JOIN  t_crm_enterprise_info enterprise1 "
				+ "    ON owner2.enterpriseInfo_id=enterprise1.id LEFT OUTER JOIN   t_crm_user_info enterprise    ON enterprise1.id=enterprise.id CROSS  JOIN "
				+ " t_bss_agent agent, t_crm_user_info userinfo CROSS JOIN  t_bss_sys_user user1 WHERE agent.userInfo_id=userinfo.id "
				+ " AND owner2.agentCode=agent.agentCode  AND owner2.employeeCode=user1.employeeCode AND owner2.id>1 "
				+ conStr;
		if (sql == "") {
			sql = sqlall;
		} else {
			sql = sql + " UNION ALL " + sqlall;
		}
		for (int i = 0; i < userCondition.condition.size(); i++) {
			if (userCondition.condition.get(i).getKey().equals("owner2.createDate")) {
				userCondition.condition.get(i).setKey("owner4.createDate");
			}
			if (userCondition.condition.get(i).getKey().equals("owner2.loginId")) {
				userCondition.condition.get(i).setKey("owner4.loginId");
			}
		}
		Long countsales = 0L;
		if (codea.equals("N")) {
			conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
			sql = sql
					+ " UNION ALL  SELECT owner4.id,owner4.createDate,owner4.loginId,enterprise.name,owner4.regTelephone,owner4.employeeCode,owner4.agentCode,"
					+ " user1.username, '' agentName, '' createBy,owner4.lastUpdateDate AS lastUpdateDate FROM  t_crm_owner owner4  LEFT OUTER JOIN t_crm_enterprise_info enterprise1 ON owner4.enterpriseInfo_id=enterprise1.id "
					+ " LEFT OUTER JOIN  t_crm_user_info enterprise ON enterprise1.id=enterprise.id CROSS  JOIN t_bss_sys_user user1 WHERE user1.employeeCode=owner4.employeeCode "
					+ " AND owner4.agentCode IS NULL AND owner4.id>1 " + conStr;
			countsales = dao.getCount4Paging(hqlsales);
		}
		List<SearchUserBuyListVo> list = dao.getLst4PagingWithSQL(sql + " order by lastUpdateDate desc",
				new int[] { userCondition.getPagenum(), userCondition.getPagesize() });
		List<SearchUserBuyListVo> listVO = new ArrayList<SearchUserBuyListVo>();
		for (Object rsArray : list) {
			SearchUserBuyListVo vo = new SearchUserBuyListVo((Object[]) rsArray);
			listVO.add(vo);
		}
		Long countb = dao.getCount4Paging(hqlac);
		count = count + counts + countb + countsales;
		Map<String, Date> mapdate = this.getdate();
		for (SearchUserBuyListVo vo : listVO) {
			List<User> user = new ArrayList<User>();
			PersonInfo person = null;
			if (vo.getSaler() != null) {
				user = dao.find("from User per where per.username = '" + vo.getSaler() + "'");
				if (user.size() > 0) {
					person = (PersonInfo) dao.getObject(PersonInfo.class, user.get(0).getUserInfo().getId());
				}
			}
			if (person != null) {
				vo.setSaler(person.getName() + "( " + vo.getSaler() + " )");
			}
			if (!vo.getVoucher().equals("") && vo.getAgentCode() != null) {
				List<SalesAgent> agent = dao.find("from SalesAgent where agentCode = '" + vo.getAgentCode() + "'");
				if (agent.get(0).getUserInfo().getName() != null) {
					if (!agent.get(0).getUserInfo().getName().equals(""))
						vo.setVoucher(agent.get(0).getUserInfo().getName() + " ( " + vo.getVoucher() + " )");
				} else
					vo.setVoucher(vo.getVoucher());
			}
			List<AccountOrderPay> accountOrderList = dao
					.find("from AccountOrderPay pay where pay.accountOrder.ownerId = " + vo.getOwnerId()
							+ " and pay.payStatus = 'paid'");
			if (accountOrderList.size() > 0) {
				String idStr = " in ( ";
				for (AccountOrderPay ao : accountOrderList) {
					idStr = idStr + ao.getAccountOrder().getId() + ",";
				}
				idStr = idStr.substring(0, idStr.length() - 1) + ") ";
				String roleHql = "select new "
						+ " com.zqw.bss.vo.sys.SearchUserBuyListVo(ao.id, product.productName) from"
						+ " AccountOrder ao left join ao.accountProducts product" + " where ao.id " + idStr;
				List<SearchUserBuyListVo> productNameList = dao.find(roleHql);
				String ss = "";
				String name = "";
				BigDecimal mouthAmt = BigDecimal.ZERO;
				BigDecimal totalAmt = BigDecimal.ZERO;
				for (AccountOrderPay so : accountOrderList) {
					totalAmt = totalAmt.add(so.getAmt());
					if (mapdate.get("firstDay").compareTo(so.getCreateDate()) < 0
							&& mapdate.get("lastDay").compareTo(so.getCreateDate()) > 0) {
						mouthAmt = mouthAmt.add(so.getAmt());
					}

					for (SearchUserBuyListVo map : productNameList) {
						if (so.getAccountOrder().getId().equals(map.getAccountorderid())
								&& !StringUtils.isEmpty(map.getProductName())) {
							if (!ss.equals(map.getProductName())) {
								name = name + map.getProductName() + ",";
								ss = map.getProductName();
							}
						}
					}
				}
				if (name != "") {
					name = name.substring(0, name.length() - 1);
				}
				vo.setProductName(name);
				if (startAmt.compareTo(BigDecimal.ZERO) == 0 && endAmt.compareTo(BigDecimal.ZERO) == 0) {
					vo.setTotalAmt(totalAmt);
				} else {
					if (startAmt.compareTo(totalAmt) < 0 && endAmt.compareTo(totalAmt) > 0) {
						vo.setTotalAmt(totalAmt);
					} else {
						continue;
					}
				}
				vo.setMouthAmt(mouthAmt);
			}
		}
		BaseModelList<SearchUserBuyListVo> lists = new BaseModelList<SearchUserBuyListVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		return lists;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserBuyListVo> getSearchSalesUserBuyListVo(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition) {
		logger.info("begin getSearchUserBuyListVo.");
		List<User> users = dao.find(
				"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		List<User> user = dao.find("from User where parentEmployeeCode = '" + users.get(0).getEmployeeCode() + "'");
		String code = " in('" + users.get(0).getEmployeeCode() + "',";
		if (user.size() > 0) {
			for (User use : user) {
				code = code + "'" + use.getEmployeeCode() + "',";
			}
		}
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (roles.contains("salesManage")) {
			List ecode = dao
					.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u where u.parentEmployeeCode = '"
							+ users.get(0).getEmployeeCode() + "'", null);
			if (ecode.size() > 0) {
				for (int i = 0; i < ecode.size(); i++) {
					code = code + "'" + ecode.get(i).toString() + "',";
					List eccode = dao.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u WHERE "
							+ "  u.parentEmployeeCode = '" + ecode.get(i).toString() + "'", null);
					if (eccode.size() > 0 && eccode != null) {
						for (int j = 0; j < eccode.size(); j++) {
							code = code + "'" + eccode.get(j).toString() + "',";
						}
					}
				}
			}
		}
		code = code.substring(0, code.length() - 1) + ")";
		String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
		String startAmtsql = "";
		String endAmtsql = "";
		String sql = "   SELECT owner0.id,owner0.createDate,owner0.loginId,enterprise.name,owner0.regTelephone,owner0.employeeCode,owner0.agentCode,SUM(billingrec.amount) ,"
				+ " owner0.lastUpdateDate,owner0.lebal,owner0.customerCode,owner0.salesType ";
		String sqlStr = " FROM t_crm_owner owner0  LEFT OUTER JOIN t_crm_enterprise_info enterprise1 ON owner0.enterpriseInfo_id=enterprise1.id "
				+ " LEFT OUTER JOIN t_crm_user_info enterprise ON enterprise1.id=enterprise.id LEFT  JOIN t_biz_billingrecord billingrec ON "
				+ "   (billingrec.status = 'paid' or billingrec.status = 'offline') AND billingrec.ownerId=owner0.id WHERE owner0.employeeCode "
				+ code + " and owner0.id>1 " + conStr;

		String sqlcuont = "select count(distinct owner0.id) ";
		Long count = dao.getCount4PagingWithSQL(sqlcuont + sqlStr);
		if (startAmt.compareTo(BigDecimal.ZERO) == 0 && endAmt.compareTo(BigDecimal.ZERO) == 0) {
		} else {
			startAmtsql = " and  SUM(billingrec.amount) >= " + startAmt;
			endAmtsql = " and  SUM(billingrec.amount) <= " + endAmt;
			List<SearchOwnerListvo> list = dao.getLst4PagingWithSQL(sql + sqlStr + " GROUP BY owner0.id HAVING(1=1"
					+ startAmtsql + endAmtsql + ") ORDER BY owner0.createDate DESC ", new int[] { 0, 999999999 });
			count = (long) list.size();
		}
		List<SearchOwnerListvo> list = dao.getLst4PagingWithSQL(
				sql + sqlStr + " GROUP BY owner0.id HAVING(1=1" + startAmtsql + endAmtsql
						+ ") ORDER BY owner0.createDate DESC ",
				new int[] { userCondition.getPagenum(), userCondition.getPagesize() });
		List<SearchOwnerListvo> listVO = new ArrayList<SearchOwnerListvo>();
		for (Object rsArray : list) {
			SearchOwnerListvo vo = new SearchOwnerListvo((Object[]) rsArray);
			listVO.add(vo);
		}
		for (SearchOwnerListvo vvoo : listVO) {
			List<Owner> owners = dao.find("from Owner ow where id = " + vvoo.getOwnerId());
		}
		BaseModelList<SearchUserBuyListVo> lists = new BaseModelList<SearchUserBuyListVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		return lists;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserBuyListVo> getSearchSalesUserBuyList(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition) {
		logger.info("begin getSearchUserBuyListVo.");
		List<User> users = dao.find(
				"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		List<User> user = dao.find("from User where parentEmployeeCode = '" + users.get(0).getEmployeeCode() + "'");
		String code = " in('" + users.get(0).getEmployeeCode() + "',";
		if (user.size() > 0) {
			for (User use : user) {
				code = code + "'" + use.getEmployeeCode() + "',";
			}
		}
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (roles.contains("customerManage")) {
			List ecode = dao
					.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u where u.parentEmployeeCode = '"
							+ users.get(0).getEmployeeCode() + "'", null);
			if (ecode.size() > 0) {
				for (int i = 0; i < ecode.size(); i++) {
					code = code + "'" + ecode.get(i).toString() + "',";
					List eccode = dao.executeQuerySql("SELECT u.employeeCode FROM t_bss_sys_user u WHERE "
							+ "  u.parentEmployeeCode = '" + ecode.get(i).toString() + "'", null);
					if (eccode.size() > 0 && eccode != null) {
						for (int j = 0; j < eccode.size(); j++) {
							code = code + "'" + eccode.get(j).toString() + "',";
						}
					}
				}
			}
		}
		code = code.substring(0, code.length() - 1) + ")";
		String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
		String startAmtsql = "";
		String endAmtsql = "";
		String sql = "   SELECT owner0.id,owner0.createDate,owner0.loginId,enterprise.name,owner0.regTelephone,owner0.employeeCode,owner0.agentCode,SUM(billingrec.amount) ,"
				+ " owner0.lastUpdateDate,owner0.lebal,owner0.customerCode,owner0.salesType ";
		String sqlStr = " FROM t_crm_owner owner0  LEFT OUTER JOIN t_crm_enterprise_info enterprise1 ON owner0.enterpriseInfo_id=enterprise1.id "
				+ " LEFT OUTER JOIN t_crm_user_info enterprise ON enterprise1.id=enterprise.id LEFT  JOIN t_biz_billingrecord billingrec ON "
				+ "   (billingrec.status = 'paid' or billingrec.status = 'offline') AND billingrec.ownerId=owner0.id WHERE owner0.customerCode "
				+ code + " and owner0.id>1 " + conStr;

		String sqlcuont = "select count(distinct owner0.id) ";
		Long count = dao.getCount4PagingWithSQL(sqlcuont + sqlStr);
		if (startAmt.compareTo(BigDecimal.ZERO) == 0 && endAmt.compareTo(BigDecimal.ZERO) == 0) {
		} else {
			startAmtsql = " and  SUM(billingrec.amount) >= " + startAmt;
			endAmtsql = " and  SUM(billingrec.amount) <= " + endAmt;
			List<SearchOwnerListvo> list = dao.getLst4PagingWithSQL(sql + sqlStr + " GROUP BY owner0.id HAVING(1=1"
					+ startAmtsql + endAmtsql + ") ORDER BY owner0.createDate DESC ", new int[] { 0, 999999999 });
			count = (long) list.size();
		}
		List<SearchOwnerListvo> list = dao.getLst4PagingWithSQL(
				sql + sqlStr + " GROUP BY owner0.id HAVING(1=1" + startAmtsql + endAmtsql
						+ ") ORDER BY owner0.createDate DESC ",
				new int[] { userCondition.getPagenum(), userCondition.getPagesize() });
		List<SearchOwnerListvo> listVO = new ArrayList<SearchOwnerListvo>();
		for (Object rsArray : list) {
			SearchOwnerListvo vo = new SearchOwnerListvo((Object[]) rsArray);
			listVO.add(vo);
		}
		for (SearchOwnerListvo vvoo : listVO) {
			List<Owner> owners = dao.find("from Owner ow where id = " + vvoo.getOwnerId());
		}
		BaseModelList<SearchUserBuyListVo> lists = new BaseModelList<SearchUserBuyListVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserBuyListVo> getSearchTaxUserBuyListVo(BasePagerObject userCondition) {
		if (false) {
			String conStr = HsqlUtil.getConditionHqlStr(userCondition, new StringBuilder());
			List<User> user = dao.find("from User user where user.username = '"
					+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			List<TaxReportListVo> list = dao
					.find("select new com.zqw.bss.vo.common.TaxReportListVo(owner.id,owner.loginId,en.name,owner.vat,owner.taxType) "
							+ " from Owner owner left join owner.enterpriseInfo en " + " where owner.taxCode = '"
							+ user.get(0).getEmployeeCode() + "'" + conStr);
			for (TaxReportListVo vo : list) {
				List<AccountPeriod> accountPeriod = dao
						.find("from AccountPeriod where ownerId  = " + vo.getId() + " order by accountPeriodMonth");
				if (accountPeriod.size() > 0) {
					vo.setMouthDate(accountPeriod.get(0).getAccountPeriodMonth());
				}
				List<PersonInfo> per = dao
						.find("from PersonInfo where createBy = '" + vo.getLoginId() + "' order by createDate");
				if (per.size() > 0) {
					vo.setLoginId(per.get(0).getName() + " ( " + vo.getLoginId() + " )");
				}
				List<AccountOrderPay> accountOrderList = dao
						.find("from AccountOrderPay pay where pay.accountOrder.ownerId = " + vo.getId()
								+ " and pay.payStatus = 'paid'");
				if (accountOrderList.size() > 0) {
					String idStr = " in ( ";
					for (AccountOrderPay ao : accountOrderList) {
						idStr = idStr + ao.getAccountOrder().getId() + ",";
					}
					idStr = idStr.substring(0, idStr.length() - 1) + ") ";
					String roleHql = "select new "
							+ " com.zqw.bss.vo.sys.SearchUserBuyListVo(ao.id, product.productName,product.productCode) from"
							+ " AccountOrder ao left join ao.accountProducts product" + " where ao.id " + idStr;
					List<SearchUserBuyListVo> productNameList = dao.find(roleHql);
					String ss = "";
					String name = "";
					for (AccountOrderPay so : accountOrderList) {
						for (SearchUserBuyListVo map : productNameList) {
							if (so.getAccountOrder().getId().equals(map.getAccountorderid())
									&& !StringUtils.isEmpty(map.getProductName()) && !ss.equals(map.getProductName())) {
								if (map.getProductCode().equals("0005") || map.getProductCode().equals("0006")
										|| map.getProductCode().equals("0007") || map.getProductCode().equals("0008")) {
									name = name + map.getProductName() + ",";
									ss = map.getProductName();
								}
							}
						}
					}
					if (name != "") {
						name = name.substring(0, name.length() - 1);
						vo.setProductName(name);
					}
				}
			}
		}
		return null;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserByTaxListVo> getUserTaxByPage(BigDecimal startOwnerNum, BigDecimal endOwnerNum,
			BasePagerObject bso) {
		logger.info("begin getUserTaxByPage.");

		String havingStr = " HAVING 1 = 1 ";
		if (startOwnerNum.compareTo(BigDecimal.valueOf(-1)) != 0)
			havingStr += " AND  count(owner.taxCode) >= " + startOwnerNum;
		if (endOwnerNum.compareTo(BigDecimal.valueOf(-1)) != 0)
			havingStr += " AND  count(owner.taxCode) <= " + endOwnerNum;

		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String selectSql = "select user.createDate ,user.employeeCode,user.username,count(owner.taxCode) ,user.id,user.locked ";
		String fromSql = "from t_bss_sys_user user " + "LEFT JOIN  t_bss_userrole_info ur ON user.id = ur.userid "
				+ "LEFT JOIN  t_bss_sys_role_info r ON r.id = ur.roleid "
				+ "LEFT JOIN  t_crm_owner owner ON user.employeeCode = owner.taxCode "
				+ " where (r.roleName='taxStaff' or r.roleName='taxStaffadmin') " + conStr + " GROUP BY user.id "
				+ havingStr;
		String countSql = "SELECT COUNT(*)  FROM ( " + selectSql + fromSql + " ) t";
		List listRS = dao.getLst4PagingWithSQL(
				"select t.* FROM (" + selectSql + fromSql + " ) t ORDER BY t.createDate DESC",
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(countSql);

		List<SearchUserByTaxListVo> listVO = new ArrayList<SearchUserByTaxListVo>();
		for (Object rsArray : listRS) {
			SearchUserByTaxListVo vo = new SearchUserByTaxListVo((Object[]) rsArray);
			listVO.add(vo);
		}
		BaseModelList<SearchUserByTaxListVo> lists = new BaseModelList<SearchUserByTaxListVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		logger.info("end getUserTaxByPage.");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserTaxVo> searchTaxUsers(String fenpei, BasePagerObject bso) {

		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		// and t.taxCode is null
		/*
		 * String sql=
		 * "SELECT t.id,t.balance,t.validDatetime,t.loginId,t.regName,t.regTelephone,t.regEmail,t.locked,t.currency,"
		 * +
		 * "t.taxType,t.vat,t.accountingStandards,t.agentCode,t.salesType,t.employeeCode,"
		 * +
		 * "t.taxCode,group_concat(DISTINCT c.productName) as productName,MIN(l.accountPeriodMonth) as mouthDate,l.createBy as taxer,Max(td.taxStatus) as taxProgressType,i.name from t_crm_owner t "
		 * + "LEFT JOIN t_bss_order p on t.id=p.ownerId " +
		 * "LEFT JOIN t_bss_order_product_info a on p.id=a.order_id " +
		 * "LEFT JOIN t_bss_account_product c on c.id=a.product_id " +
		 * "LEFT JOIN t_fms_account_period l on t.id=l.ownerId " +
		 * "LEFT JOIN t_bss_tax_declare td ON  t.id=td.ownerId " +
		 * "LEFT JOIN t_crm_user_info i on t.enterpriseInfo_id=i.id " +
		 * "LEFT JOIN t_bss_sys_user u on t.taxCode=u.employeeCode " ; String
		 * sqlCon =
		 * "WHERE p.payStatus='paid' and (NOW() between p.orderBeginDate and p.orderEndDate) and (c.productCode in (0005,0006,0007,0008)) and l.accountPeriodStatus<>'closed' "
		 * +conStr; if(fenpei.equals("isnull")){ sqlCon =
		 * "WHERE p.payStatus='paid' and t.taxCode is null and (NOW() between p.orderBeginDate and p.orderEndDate) and (c.productCode in (0005,0006,0007,0008)) and l.accountPeriodStatus<>'closed' "
		 * +conStr; }
		 */
		List<User> user = dao.find(
				" from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		String sql = "SELECT t.id,t.balance,t.validDatetime,t.loginId,t.regName,t.regTelephone,t.regEmail,t.locked,t.currency,"
				+ "t.taxType,t.vat,t.accountingStandards,t.agentCode,t.salesType,t.employeeCode,"
				+ "t.taxCode,t.taxCode as productName,MIN(l.accountPeriodMonth) as mouthDate,l.createBy as taxer,Max(td.taxStatus) as taxProgressType,i.name,en.taxCode as code from t_crm_owner t "
				+ "LEFT JOIN t_fms_account_period l on t.id=l.ownerId "
				+ "LEFT JOIN t_bss_tax_declare td ON  t.id=td.ownerId "
				+ "LEFT JOIN t_crm_user_info i on t.enterpriseInfo_id=i.id "
				+ "LEFT JOIN t_crm_enterprise_info en on t.enterpriseInfo_id=en.id "
				+ "LEFT JOIN t_bss_sys_user u on t.taxCode=u.employeeCode ";
		String sqlCon = "WHERE  l.accountPeriodStatus<>'closed' " + conStr;
		if (fenpei.equals("fenpei")) {
			sqlCon = "WHERE t.taxCode='" + user.get(0).getEmployeeCode() + "' and l.accountPeriodStatus <> 'closed' "
					+ conStr;
		}
		List listVo = dao.getLst4PagingWithSQL(sql + sqlCon + " GROUP BY t.id ORDER BY t.createDate DESC",
				new int[] { bso.getPagenum(), bso.getPagesize() });
		List<SearchUserTaxVo> searchUserTaxVoList = new ArrayList<SearchUserTaxVo>();
		for (Object object : listVo) {
			Object[] o = (Object[]) object;
			SearchUserTaxVo searchUserTaxVo = new SearchUserTaxVo(o,null);
			searchUserTaxVoList.add(searchUserTaxVo);
		}
		/*
		 * String sqls="SELECT count(DISTINCT t.id) from t_crm_owner t " +
		 * "LEFT JOIN t_bss_order p on t.id=p.ownerId " +
		 * "LEFT JOIN t_bss_order_product_info a on p.id=a.order_id " +
		 * "LEFT JOIN t_bss_account_product c on c.id=a.product_id " +
		 * "LEFT JOIN t_fms_account_period l on t.id=l.ownerId " +
		 * "LEFT JOIN t_bss_tax_declare td ON  t.id=td.ownerId " +
		 * "LEFT JOIN t_crm_user_info i on t.enterpriseInfo_id=i.id " +
		 * "LEFT JOIN t_bss_sys_user u on t.taxCode=u.employeeCode ";
		 */
		String sqls = "SELECT count(DISTINCT t.id) from t_crm_owner t "
				+ "LEFT JOIN t_fms_account_period l on t.id=l.ownerId "
				+ "LEFT JOIN t_bss_tax_declare td ON  t.id=td.ownerId "
				+ "LEFT JOIN t_crm_user_info i on t.enterpriseInfo_id=i.id "
				+ "LEFT JOIN t_crm_enterprise_info en on t.enterpriseInfo_id=en.id "
				+ "LEFT JOIN t_bss_sys_user u on t.taxCode=u.employeeCode ";
		Long num = dao.getCount4PagingWithSQL(sqls + sqlCon);
		BaseModelList<SearchUserTaxVo> lists = new BaseModelList<SearchUserTaxVo>(num,
				WebUtil.getEntryListFromProxyList(searchUserTaxVoList, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserTaxVo> searchTaxUsersByTaxUser(BasePagerObject bso) {
		List<User> user = dao.find(
				" from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		List<User> users = dao.find("from User  where parentEmployeeCode='" + user.get(0).getEmployeeCode() + "'");
		String codeStr = " in ('" + user.get(0).getEmployeeCode() + "',";
		if (users.size() > 0) {
			for (User use : users) {
				codeStr = codeStr + "'" + use.getEmployeeCode() + "',";
			}
		}
		codeStr = codeStr.substring(0, codeStr.length() - 1);
		codeStr = codeStr + ")";
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String whereStr = "";
		if (roles.contains("Sys_Admin")) {
			whereStr = "WHERE   t.taxCode is not null and l.accountPeriodStatus <> 'closed' " + conStr;
		} else if (roles.contains("taxStaffadmin")) {
			whereStr = "WHERE   t.taxCode " + codeStr + " and l.accountPeriodStatus <> 'closed' " + conStr;
		} else if (roles.contains("taxStaff")) {
			whereStr = "WHERE   t.taxCode='" + user.get(0).getEmployeeCode()
					+ "'  and l.accountPeriodStatus <> 'closed' " + conStr;
		}

		String sql = "SELECT t.paidType, t.id,t.balance,t.validDatetime,t.loginId,t.regName,t.regTelephone,t.email,t.locked,t.currency,"
				+ "t.taxType,t.vat,t.accountingStandards,t.agentCode,t.salesType,t.employeeCode,"
				+ "t.taxCode,group_concat(DISTINCT c.productName) AS productName,MIN(l.accountPeriodMonth) as mouthDate,u.username as taxer,Max(td.taxStatus) as taxProgressType,i.name,en.taxCode as code"
				+ ",t.startDate,t.endDate,t.dateType,t.payAmt,t.category1,t.category2"
				+ " from t_crm_owner t "
				+ "LEFT JOIN t_fms_account_period l on t.id=l.ownerId "
				+ "LEFT JOIN t_bss_tax_declare td ON  t.id=td.ownerId "
				+ "LEFT JOIN t_crm_user_info i on t.enterpriseInfo_id=i.id "
				+ "LEFT JOIN t_crm_enterprise_info en on t.enterpriseInfo_id=en.id "
				+ "LEFT JOIN t_bss_sys_user u on t.taxCode=u.employeeCode "
				+ "LEFT JOIN t_bss_order p on t.id=p.ownerId "
				+ "LEFT JOIN t_bss_order_product_info a ON p.id = a.order_id "
				+ "LEFT JOIN t_bss_account_product c ON c.id = a.product_id " + whereStr
				+ " GROUP BY t.id ORDER BY t.lastUpdateDate DESC";

		List listVo = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		List<SearchUserTaxVo> searchUserTaxVoList = new ArrayList<SearchUserTaxVo>();
		for (Object object : listVo) {
			Object[] o = (Object[]) object;
			SearchUserTaxVo searchUserTaxVo = new SearchUserTaxVo(o);
			searchUserTaxVoList.add(searchUserTaxVo);
		}
		/*
		 * String sqls="SELECT count(DISTINCT t.id) from t_crm_owner t " +
		 * "LEFT JOIN t_bss_order p on t.id=p.ownerId " +
		 * "LEFT JOIN t_bss_order_product_info a on p.id=a.order_id " +
		 * "LEFT JOIN t_bss_account_product c on c.id=a.product_id " +
		 * "LEFT JOIN t_fms_account_period l on t.id=l.ownerId " +
		 * "LEFT JOIN t_bss_tax_declare td ON  t.id=td.ownerId " +
		 * "LEFT JOIN t_crm_user_info i on t.enterpriseInfo_id=i.id " +
		 * "LEFT JOIN t_bss_sys_user u on t.taxCode=u.employeeCode " +
		 * "WHERE p.payStatus='paid' and  t.taxCode='"
		 * +user.get(0).getEmployeeCode()+
		 * "' and (NOW() between p.orderBeginDate and p.orderEndDate) and (c.productCode in (0005,0006,0007,0008)) and l.accountPeriodStatus <> 'closed' "
		 * +conStr;
		 */ String sqls = "SELECT count(DISTINCT t.id) from t_crm_owner t "
				+ "LEFT JOIN t_fms_account_period l on t.id=l.ownerId "
				+ "LEFT JOIN t_bss_tax_declare td ON  t.id=td.ownerId "
				+ "LEFT JOIN t_crm_user_info i on t.enterpriseInfo_id=i.id "
				+ "LEFT JOIN t_crm_enterprise_info en on t.enterpriseInfo_id=en.id "
				+ "LEFT JOIN t_bss_sys_user u on t.taxCode=u.employeeCode " + whereStr;

		Long num = dao.getCount4PagingWithSQL(sqls);
		BaseModelList<SearchUserTaxVo> lists = new BaseModelList<SearchUserTaxVo>(num,
				WebUtil.getEntryListFromProxyList(searchUserTaxVoList, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserAgentTaxVo> getUserAgentTaxByPage(BasePagerObject bso) {
		logger.info("begin getUserTaxByPage.");

		// String havingStr = " HAVING 1 = 1 ";
		// if (startOwnerNum.compareTo(BigDecimal.valueOf(-1)) != 0)
		// havingStr += " AND count(owner.taxCode) >= "
		// + startOwnerNum;
		// if (endOwnerNum.compareTo(BigDecimal.valueOf(-1)) != 0)
		// havingStr += " AND count(owner.taxCode) <= "
		// + endOwnerNum;
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		String name = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		String employeeCode = "";
		if (!roles.contains("Sys_Admin")) {
			employeeCode += " and user.parentEmployeeCode =(select u.employeeCode FROM t_bss_sys_user u WHERE u.username ='"
					+ name + "')";
		}

		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String selectSql = "select user.id,user.employeeCode,user.username,ui.name,ui.telephone,pi.title,count(owner.taxCode) num,user.locked,user.parentEmployeeCode ";
		String fromSql = "from t_bss_sys_user user " + "LEFT JOIN  t_bss_userrole_info ur ON user.id = ur.userid "
				+ "LEFT JOIN  t_bss_sys_role_info r ON r.id = ur.roleid "
				+ "LEFT JOIN  t_crm_owner owner ON user.employeeCode = owner.taxCode "
				+ " LEFT JOIN t_crm_user_info  ui ON ui.id=user.userInfo_id LEFT JOIN t_crm_person_info pi ON pi.id=ui.id "
				+ " where r.roleName='taxStaff' " + conStr + employeeCode + " GROUP BY user.id ";
		// + " GROUP BY user.id "+ havingStr;
		String countSql = "SELECT COUNT(*)  FROM ( " + selectSql + fromSql + " ) t";
		List listRS = dao.getLst4PagingWithSQL(selectSql + fromSql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(countSql);

		List<SearchUserAgentTaxVo> listVO = new ArrayList<SearchUserAgentTaxVo>();
		for (Object rsArray : listRS) {
			SearchUserAgentTaxVo vo = new SearchUserAgentTaxVo((Object[]) rsArray);
			listVO.add(vo);
		}
		BaseModelList<SearchUserAgentTaxVo> lists = new BaseModelList<SearchUserAgentTaxVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		logger.info("end getUserTaxByPage.");
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public User saveTax(User user) {
		logger.info("begin saveUser.");
		User user4mail = new User();
		BeanUtils.copyProperties(user, user4mail);
		PasswordHelper.encryptPassword(user);
		// 设置为代理报税人
		List<Role> find = dao.find("from Role r WHERE r.roleName='taxStaff'");
		user.setRoles(find);
		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
		user.setOwnerId(ownerId);
		user.getUserInfo().setOwnerId(ownerId);
		// 判断登录的客户是否是管理员
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (!roles.contains("Sys_Admin")) {
			String name = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
			List<User> find2 = dao.find("FROM User u WHERE u.username ='" + name + "'");
			user.setParentEmployeeCode(find2.get(0).getEmployeeCode());
		}
		try {
			user = (User) dao.save(user);
		} catch (Exception e) {
			throw new OperationException("员工编号重复不能保存！");
		}
		logger.info("end saveUser.");
		return user;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Boolean repeat(String username) {
		logger.info("begin repeat.");
		Long count = dao
				.getCount4PagingWithSQL("select COUNT(u.id) FROM t_bss_sys_user u where u.username='" + username + "'");
		Boolean bl = Boolean.FALSE;
		if (count != 0L) {
			bl = Boolean.TRUE;
		}
		logger.info("end repeat.");
		return bl;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> getTaxManage() {
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		List<User> user = dao.find("from User where username = '" + username + "'");
		List<User> users = dao
				.find("from User where locked='N' and  parentEmployeeCode = '" + user.get(0).getEmployeeCode() + "'");
		for (Role role : user.get(0).getRoles()) {
			if (!role.getRoleName().equals("taxStaffadmin")) {
				users = null;
			}
		}
		List<User> list = new ArrayList<User>();
		list.add(user.get(0));
		if (users != null) {
			for (User use : users) {
				for (Role role : use.getRoles()) {
					if (role.getRoleName().equals("taxStaff")) {
						use.setRoles(null);
						use.setUserInfo(null);
						use.setPassword(null);
						list.add(use);
					}
				}
			}
		}
		return list;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserTaxVo> searcherTaxUsers(String taxCode, BasePagerObject bso) {
		logger.info("begin searcherTaxUsers");
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		
		String sql="SELECT\n" +
				"	amp.col_0_0_,\n" +
				"	amp.col_1_0_,\n" +
				"	amp.col_2_0_,\n" +
				"	amp.col_3_0_,\n" +
				"	amp.col_4_0_,\n" +
				"	min(fap.accountPeriodMonth)\n" +
				"FROM\n" +
				"	(\n" +
				"		SELECT\n" +
				"			owner0_.id AS col_0_0_,\n" +
				"			accountper1_.createBy AS col_1_0_,\n" +
				"			enterprise2_1_. NAME AS col_2_0_,\n" +
				"			owner0_.taxType AS col_3_0_,\n" +
				"			owner0_.vat AS col_4_0_\n" +
				"		FROM\n" +
				"			t_crm_owner owner0_,\n" +
				"			t_fms_account_period accountper1_,\n" +
				"			t_crm_enterprise_info enterprise2_\n" +
				"		INNER JOIN t_crm_user_info enterprise2_1_ ON enterprise2_.id = enterprise2_1_.id\n" +
				"		WHERE\n" +
				"			owner0_.startMonth_id = accountper1_.id\n" +
				"		AND owner0_.enterpriseInfo_id = enterprise2_.id\n" +
				"		AND owner0_.taxCode = '"+taxCode+"'\n" +
				"		AND (\n" +
				"			owner0_.taxCode IN (\n" +
				"				SELECT\n" +
				"					user5_.employeeCode\n" +
				"				FROM\n" +
				"					t_bss_sys_user user5_\n" +
				"				WHERE\n" +
				"					user5_.parentEmployeeCode = (\n" +
				"						SELECT\n" +
				"							user6_.employeeCode\n" +
				"						FROM\n" +
				"							t_bss_sys_user user6_\n" +
				"						WHERE\n" +
				"							user6_.username = '"+username+"'\n" +
				"					)\n" +
				"			)\n" +
				"		)\n" +
				"		GROUP BY\n" +
				"			owner0_.id\n" +
				"	) amp,\n" +
				"	t_fms_account_period fap\n" +
				"WHERE\n" +
				"	fap.ownerId = amp.col_0_0_\n" +
				"AND fap.accountPeriodStatus <> 'closed'\n" +
				"GROUP BY\n" +
				"	amp.col_0_0_";
		List list = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		List<SearchUserTaxVo>searchUserTaxVoList=new ArrayList<>(); 
		for (Object object : list) {
			Object[]o=(Object[]) object;
			SearchUserTaxVo vo=new SearchUserTaxVo(o[0], o[1], o[2],o[3],o[4], o[5]);
			searchUserTaxVoList.add(vo);
		}
		Long count = dao.getCount4PagingWithSQL("SELECT\n" +
				"	count(owner0_.id) AS col_0_0_\n" +
				"FROM\n" +
				"	t_crm_owner owner0_\n" +
				"WHERE\n" +
				"	owner0_.id IN (\n" +
				"		SELECT\n" +
				"			owner1_.id\n" +
				"		FROM\n" +
				"			t_crm_owner owner1_\n" +
				"		CROSS JOIN t_fms_account_period accountper2_\n" +
				"		WHERE\n" +
				"			owner1_.startMonth_id = accountper2_.id\n" +
				"		AND owner1_.taxCode = '"+taxCode+"'\n" +
				"		AND (\n" +
				"			owner1_.taxCode IN (\n" +
				"				SELECT\n" +
				"					user3_.employeeCode\n" +
				"				FROM\n" +
				"					t_bss_sys_user user3_\n" +
				"				WHERE\n" +
				"					user3_.parentEmployeeCode = (\n" +
				"						SELECT\n" +
				"							user4_.employeeCode\n" +
				"						FROM\n" +
				"							t_bss_sys_user user4_\n" +
				"						WHERE\n" +
				"							user4_.username = '"+username+"'\n" +
				"					)\n" +
				"			)\n" +
				"		)\n" +
				"		GROUP BY\n" +
				"			owner1_.id\n" +
				"	)");
		
		
/*		String hql = " FROM Owner o " + "WHERE o.startMonth.accountPeriodStatus <> 'closed' AND o.taxCode='" + taxCode
				+ "' AND o.taxCode IN (SELECT u.employeeCode FROM User u WHERE u.parentEmployeeCode = (SELECT u.employeeCode FROM User u WHERE u.username = '"
				+ username + "')) GROUP BY o.id";
		String select = "SELECT new com.zqw.bss.vo.sys.SearchUserTaxVo(o.id,o.startMonth.createBy,o.enterpriseInfo.name,o.taxType,o.vat,MIN(o.startMonth.accountPeriodMonth))";
		List<SearchUserTaxVo> searchUserTaxVoList = dao.getLst4Paging(select + hql,
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao
				.getCount4Paging("SELECT COUNT(ow.id) FROM Owner ow WHERE ow.id in (SELECT o.id AS id " + hql + ")");*/
		// String sql="SELECT t.id,l.createBy AS taxer,i.
		// NAME,t.taxType,t.vat,MIN(l.accountPeriodMonth) AS mouthDate \n" +
		// "FROM\n" +
		// " t_crm_owner t\n" +
		// "LEFT JOIN t_fms_account_period l ON t.id = l.ownerId\n" +
		// "LEFT JOIN t_crm_user_info i ON t.enterpriseInfo_id = i.id\n" +
		// "WHERE\n" +
		// " 1 = 1\n" +
		// "AND l.accountPeriodStatus <> 'closed' "+
		// "AND t.taxCode = '"+taxCode+"' "+
		// //校验 报税员 员工编号 是否是在登录的这个报税管理员下的
		// "AND t.taxCode IN (\n" +
		// " SELECT\n" +
		// " u.employeeCode\n" +
		// " FROM\n" +
		// " t_bss_sys_user u\n" +
		// " WHERE\n" +
		// " u.parentEmployeeCode = (\n" +
		// " SELECT\n" +
		// " u.employeeCode\n" +
		// " FROM\n" +
		// " t_bss_sys_user u\n" +
		// " WHERE\n" +
		// " u.username = '"+username+"'\n" +
		// " )\n" +
		// ")"+
		//
		// " GROUP BY\n" +
		// " t.id";
		// List listVo = dao.getLst4PagingWithSQL(sql,new int[] {
		// bso.getPagenum(), bso.getPagesize() } );
		// List<SearchUserTaxVo> searchUserTaxVoList = new
		// ArrayList<SearchUserTaxVo>();
		// for (Object object : listVo) {
		// Object[] o = (Object[]) object;
		// SearchUserTaxVo searchUserTaxVo=new SearchUserTaxVo(o[0], o[1], o[2],
		// o[3], o[4], o[5]);
		// searchUserTaxVoList.add(searchUserTaxVo);
		// }
		// Long count = dao.getCount4PagingWithSQL("SELECT COUNT(b.id) FROM
		// ("+sql+") b");
		BaseModelList<SearchUserTaxVo> lists = new BaseModelList<SearchUserTaxVo>(count,
				WebUtil.getEntryListFromProxyList(searchUserTaxVoList, dao));
		logger.info("end searcherTaxUsers");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchUserAccessVo> searchUserAcc(Long ownerId, Long type, String roleName,
			BasePagerObject bso) {
		// TODO Auto-generated method stub

		logger.info("begin searchUserAcc.");

		String sqlCreate = "SELECT DATE(createDate) FROM t_sys_access_log " + " WHERE ownerId='" + ownerId
				+ "' GROUP BY DATE(createDate) ORDER BY createDate DESC";

		String sql = "SELECT remark,COUNT(t.remark), SUM(t.second)/60 SECOND FROM t_sys_access_log t WHERE createDate "
				+ "LIKE '" + sqlCreate + "%' " + "AND ownerId='" + ownerId + "' GROUP BY remark ORDER BY createDate";
		List list = dao.getLst4PagingWithSQL(sqlCreate, new int[] { bso.getPagenum(), bso.getPagesize() });
		String hqlacc = "SELECT COUNT(c.createDate) FROM ( "
				+ "SELECT DATE(t.createDate) createDate FROM t_sys_access_log t " + "WHERE t.ownerId='" + ownerId
				+ "' GROUP BY DATE(t.createDate) ORDER BY t.createDate DESC) c";
		Long count = dao.getCount4PagingWithSQL(hqlacc);

		List<SearchUserAccessVo> seaListVos = new ArrayList<SearchUserAccessVo>();
		List<AccessVo> seaListVo = null;
		if (type == 0 && list.size() > 0) {
			for (int i = 0; i < 1; i++) {
				seaListVo = new ArrayList<AccessVo>();
				String sqlRs = "SELECT ownerId,remark,COUNT(t.remark), SUM(t.second)/60 SECOND FROM t_sys_access_log t WHERE createDate "
						+ "LIKE '" + list.get(i) + "%' " + "AND ownerId='" + ownerId
						+ "' GROUP BY remark ORDER BY createDate";
				List listR = dao.executeQuerySql(sqlRs, null);

				for (int j = 0; j < listR.size(); j++) {
					Object[] accArray = (Object[]) listR.get(j);
					AccessVo avo = new AccessVo((Object[]) accArray);
					seaListVo.add(avo);
				}

				SearchUserAccessVo sv = new SearchUserAccessVo((Date) list.get(i), seaListVo);
				seaListVos.add(sv);
			}
			count = (long) 1;
		}
		if (type == 1) {
			for (int i = 0; i < list.size(); i++) {
				seaListVo = new ArrayList<AccessVo>();
				String sqlRs = "SELECT ownerId,remark,COUNT(t.remark), SUM(t.second)/60 SECOND FROM t_sys_access_log t WHERE createDate "
						+ "LIKE '" + list.get(i) + "%' " + "AND ownerId='" + ownerId
						+ "' GROUP BY remark ORDER BY createDate";
				List listR = dao.executeQuerySql(sqlRs, null);

				for (int j = 0; j < listR.size(); j++) {
					Object[] accArray = (Object[]) listR.get(j);
					AccessVo avo = new AccessVo((Object[]) accArray);
					seaListVo.add(avo);
				}

				SearchUserAccessVo sv = new SearchUserAccessVo((Date) list.get(i), seaListVo);
				seaListVos.add(sv);
			}
		}

		BaseModelList<SearchUserAccessVo> lists = new BaseModelList<SearchUserAccessVo>(count,
				WebUtil.getEntryListFromProxyList(seaListVos, dao));

		logger.info("end searchUserAcc.");
		return lists;

	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateParentCode(List<User> user, Long id) {
		User usess = (User) dao.getObject(User.class, id);
		for (User u : user) {
			User use = (User) dao.getObject(User.class, u.getId());
			use.setParentEmployeeCode(usess.getEmployeeCode());
			dao.update(use);
		}
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AcUser getAcUserByUsername(String username) {
		// TODO Auto-generated method stub
		logger.info("begin getUserByUsername.  username = [" + username + "]");
		List<AcUser> list = dao
				.find("select distinct user from AcUser user " + " left join user.userInfo  left join user.roles roles "
						+ " left join roles.resources  where user.username = ?", username);
		logger.info("end getUserByUsername. list size = [" + list.size() + "]");

		if (list.size() != 1)
			return null;
		AcUser user = list.get(0);
		logger.info("end getUserByUsername.[ id =" + user.getId() + "]");
		return user;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<User> partnerUsers(BasePagerObject bso) {
		logger.info("begin partnerUsers");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		// List<User> list = dao
		// .getLst4Paging(
		// "SELECT new com.zqw.bss.model.sys.User(user,count(owner.id)) FROM
		// User user left join user.roles role,Owner owner where role.roleName
		// in ('partner') AND owner.partnerCode=user.employeeCode "
		// + conStr + " GROUP BY user.username ",
		// new int[] { bso.getPagenum(), bso.getPagesize() });
		List list = dao.getLst4PagingWithSQL("SELECT\n" + "	u.id AS id,\n" + "	u.createDate AS createDate,\n"
				+ "	u.employeeCode AS employeeCode,\n" + "	u.username AS username,\n" + "	ui.name name,\n"
				+ "	ui.telephone telephone,\n" + "	count(o.id) client,\n" + "	d.username docking\n" + "FROM\n"
				+ "	t_bss_sys_user u\n" + "LEFT OUTER JOIN t_bss_userrole_info roles1_ ON u.id = roles1_.userid\n"
				+ "LEFT OUTER JOIN t_bss_sys_role_info role2_ ON roles1_.roleid = role2_.id\n"
				+ "left join t_crm_owner o ON o.partnerCode = u.employeeCode\n"
				+ "LEFT JOIN t_crm_user_info ui ON ui.id=u.userInfo_id\n"
				+ "LEFT JOIN t_bss_sys_user d ON d.id=u.docking_id\n" + "WHERE\n" + "	(\n"
				+ "		role2_.roleName IN ('partner')\n" + "	) " + conStr + " GROUP BY u.username",
				new int[] { bso.getPagenum(), bso.getPagesize() });
		// Long count = dao.getCount4Paging(
		// "SELECT COUNT(user.id) FROM User user left join user.roles role where
		// role.roleName in ('partner') "
		// + conStr);
		Long count = dao.getCount4PagingWithSQL("SELECT COUNT(DISTINCT u.id) FROM	t_bss_sys_user u\n"
				+ "LEFT OUTER JOIN t_bss_userrole_info roles1_ ON u.id = roles1_.userid\n"
				+ "LEFT OUTER JOIN t_bss_sys_role_info role2_ ON roles1_.roleid = role2_.id\n"
				+ "left join t_crm_owner o ON o.partnerCode = u.employeeCode\n"
				+ "LEFT JOIN t_crm_user_info ui ON ui.id=u.userInfo_id\n"
				+ "LEFT JOIN t_bss_sys_user d ON d.id=u.docking_id\n" + "WHERE	(	role2_.roleName IN ('partner')) "
				+ conStr);
		List<User> userList = new ArrayList<>();
		for (Object object : list) {
			Object[] obj = (Object[]) object;
			User u = new User(obj[0], obj[1], obj[2], obj[3], obj[4], obj[5], obj[6], obj[7]);
			userList.add(u);
		}

		BaseModelList<User> lists = new BaseModelList<User>(count, WebUtil.getEntryListFromProxyList(userList, dao));
		logger.info("end partnerUsers");
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean savePartner(User user) {
		logger.info("begin savePartner");
		List<Address> address = new ArrayList<Address>();
		if (user.getUserInfo().getAddress().size() > 0) {
			for (Address add : user.getUserInfo().getAddress()) {
				address.add((Address) dao.save(add));
			}
		}
		List<Role> list = dao.find("FROM Role r WHERE r.roleName='partner'");
		User docking = (User) dao.getObject(User.class, user.getDocking().getId());
		user.getUserInfo().setAddress(address);
		user.setRoles(list);
		user.setDocking(docking);

		PasswordHelper.encryptPassword(user);
		EnterpriseInfo userInfo = (EnterpriseInfo) dao.save(user.getUserInfo());
		user.setUserInfo(userInfo);
		dao.save(user);
		logger.info("end savePartner");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> dockingUsers() {
		logger.info("begin savePartner");
		List list = dao.find(
				"SELECT new com.zqw.bss.model.sys.User(user.id,user.username,user.userInfo.name) FROM User user left join user.roles role where role.roleName not in ('partner','agentistrator') ");
		logger.info("end savePartner");
		return list;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<PartnerOwnerForListVo> getPartnerInformation(BasePagerObject bso) {
		logger.info("begin getPartnerInformation.");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String hql = "select new com.zqw.bss.vo.sys.PartnerOwnerForListVo(owe.id,enterpriseInfo.name,owe.loginId,owe.regTelephone,owe.createDate"
				+ ",owe.partnerCode,enter.name) from Owner owe,EnterpriseInfo enterpriseInfo,User user,Owner owner,EnterpriseInfo enter where enterpriseInfo.id=owe.enterpriseInfo.id "
				+ "and owe.partnerCode=user.employeeCode and enter.id=owner.enterpriseInfo.id  and user.username = owner.loginId "
				+ conStr;
		List<PartnerOwnerForListVo> list = dao.getLst4Paging(hql, new int[] { bso.getPagenum(), bso.getPagesize() });
		String hqlStr = "select count(owe.id) from Owner owe,EnterpriseInfo enterpriseInfo,User user,Owner owner,EnterpriseInfo enter  where enterpriseInfo.id=owe.enterpriseInfo.id"
				+ " and owe.partnerCode=user.employeeCode and enter.id=owner.enterpriseInfo.id  and  user.username = owner.loginId "
				+ conStr;
		Long count = dao.getCount4Paging(hqlStr);
		BaseModelList<PartnerOwnerForListVo> lists = new BaseModelList<PartnerOwnerForListVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		logger.info("end getPartnerInformation.");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<PartnerOwnerForListVo> getpartnersuccess(String employeeCode, BasePagerObject bso) {
		logger.info("begin getpartnersuccess.");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String hql = "SELECT new com.zqw.bss.vo.sys.PartnerOwnerForListVo(o.id,o.createDate,o.loginId,o.regTelephone,en.name) FROM Owner o,EnterpriseInfo en WHERE o.enterpriseInfo=en.id and o.partnerCode='"
				+ employeeCode + "' " + conStr;
		// String hql="SELECT o.id,o.createDate,o.loginId,o.regTelephone FROM
		// Owner o,EnterpriseInfo en WHERE o.enterpriseInfo=en.id and
		// o.partnerCode='"+employeeCode+"' "+ conStr;
		List list = dao.getLst4Paging(hql, new int[] { bso.getPagenum(), bso.getPagesize() });
		String hqlStr = "SELECT count(o.id) FROM Owner o,EnterpriseInfo en WHERE o.enterpriseInfo=en.id and o.partnerCode='"
				+ employeeCode + "' " + conStr;
		Long count = dao.getCount4Paging(hqlStr);
		BaseModelList<PartnerOwnerForListVo> lists = new BaseModelList<PartnerOwnerForListVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		logger.info("begin getpartnersuccess.");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> getCustomerSales(Long flag) {
		if (flag == 0) {
			Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
			List<User> users = dao.find("from User where username = '"
					+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			User user = null;
			if (users.size() > 0) {
				user = users.get(0);
			}
			String sql = "";
			if (roles.contains("salesManage")) {
				// 获取二级销售主管编号
				List<String> empCode = dao
						.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode = '"
								+ user.getEmployeeCode() + "'", null);
				if (empCode.size() > 0) {
					String[] ar = (String[]) empCode.toArray(new String[empCode.size()]);
					for (int i = 0; i < ar.length; i++) {
						String temp = ar[i];
						ar[i] = "'" + temp + "'";
					}
					String se = Arrays.toString(ar);
					String newSt = se.replaceAll("\\[", "(");
					String newSt2 = newSt.replaceAll("]", ")");
					// 获取二级销售主管下，销售的编号
					List<String> empCod = dao.executeQuerySql(
							"select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode in " + newSt2 + "",
							null);
					if (empCod.size() > 0) {
						String[] art = (String[]) empCod.toArray(new String[empCod.size()]);
						for (int i = 0; i < art.length; i++) {
							String temp = art[i];
							art[i] = "'" + temp + "'";
						}
						String see = Arrays.toString(art);
						String newStr = see.replaceAll("\\[", "(");
						String newStr2 = newStr.replaceAll("]", ")");
						// TODO ..
						sql = "SELECT u.id,u.username,u.employeeCode,ui.`name` FROM t_bss_sys_user u LEFT JOIN t_crm_user_info ui ON ui.id=u.userInfo_id where u.parentEmployeeCode != null and u.locked='N' or u.employeeCode = '"
								+ user.getEmployeeCode() + "' or u.parentEmployeeCode = '" + user.getEmployeeCode()
								+ "' or u.employeeCode in " + newStr2;

					} else {
						sql = "SELECT u.id,u.username,u.employeeCode,ui.`name` FROM t_bss_sys_user u LEFT JOIN t_crm_user_info ui ON ui.id=u.userInfo_id where u.parentEmployeeCode != null and u.locked='N' or u.employeeCode = '"
								+ user.getEmployeeCode() + "' or u.parentEmployeeCode = '" + user.getEmployeeCode()
								+ "'";

					}
				} else {
					sql = "SELECT u.id,u.username,u.employeeCode,ui.`name` FROM t_bss_sys_user u LEFT JOIN t_crm_user_info ui ON ui.id=u.userInfo_id where u.employeeCode='"
							+ user.getEmployeeCode() + "'";
				}

			} else if (roles.contains("secondLevelSalesManage")) {
				sql = "SELECT u.id,u.username,u.employeeCode,ui.`name` FROM t_bss_sys_user u LEFT JOIN t_crm_user_info ui ON ui.id=u.userInfo_id where u.parentEmployeeCode='"
						+ user.getEmployeeCode() + "'";
			}

			List<User> list = (List<User>) dao.executeQuerySql(sql, null);

			List<User> personList = new ArrayList<User>();
			for (Object array : list) {
				Object[]o= (Object[]) array;
				User personInfo = new User((Object[]) array,o[1],o[2],(String)o[3]);
				personList.add(personInfo);
			}
			logger.info("end  getSaleUsers : [ id =" + WebUtil.getLogBasicString() + "]");
			return personList;
		}
		String sql = "SELECT u.id,u.username,u.employeeCode,ui.telephone,u.distributionEmployeeCode,ui.name FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur,t_crm_user_info ui "
				+ "WHERE ui.id=u.userInfo_id and ur.userid = u.id AND ur.roleid = r.id  AND (r.id in (?,6,8,7,9,10))";
		Object obj[] = new Object[] { flag };
		List<User> list = (List<User>) dao.executeQuerySql(sql, obj);

		List<User> personList = new ArrayList<User>();
		for (Object array : list) {
			Object[] ar = (Object[]) array;
			User personInfo = new User(ar[0], (String) ar[1], (String) ar[2], ar[3], ar[4],ar[5]);
			personList.add(personInfo);
		}
		logger.info("end  getSaleUsers : [ id =" + WebUtil.getLogBasicString() + "]");
		return personList;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveDistribution(List<User> users,String type, String distributionEmployeeCode) {
		logger.info("begin saveDistribution.");
		if (type.equals("sales")) {
			dao.executeSql("UPDATE t_bss_sys_user SET distributionEmployeeCode=NULL WHERE distributionEmployeeCode='"
					+ distributionEmployeeCode + "'", null);
			if (users != null && users.size() != 0) {
				String str = " (";
				for (User user : users) {
					str += user.getId() + ",";
				}
				str = str.substring(0, str.length() - 1) + ")";
				dao.executeSql("UPDATE t_bss_sys_user SET distributionEmployeeCode='" + distributionEmployeeCode
						+ "' WHERE id in " + str, null);
			}
		}else{
			dao.executeSql("UPDATE t_bss_sys_user SET distributionCustomerEmployeeCode=NULL WHERE distributionCustomerEmployeeCode='"
					+ distributionEmployeeCode + "'", null);
			if (users != null && users.size() != 0) {
				String str = " (";
				for (User user : users) {
					str += user.getId() + ",";
				}
				str = str.substring(0, str.length() - 1) + ")";
				dao.executeSql("UPDATE t_bss_sys_user SET distributionCustomerEmployeeCode='" + distributionEmployeeCode
						+ "' WHERE id in " + str, null);
			}
		}
		
		logger.info("end saveDistribution.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateUserDetailed(User user) {
		logger.info("begin updateUserDetailed.");
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		List<User> list = dao.find("FROM User u where u.username='" + username + "'");
		User use = list.get(0);

		use.setPassword(user.getPassword());
		use.setOpenBank(user.getOpenBank());
		use.setBankAccount(user.getOpenBank());
		// user.getUserInfo().setOwnerId(use.getUserInfo().getOwnerId());
		// use.setUserInfo((EnterpriseInfo)user.getUserInfo());

		EnterpriseInfo userInfo = (EnterpriseInfo) use.getUserInfo();
		List<Address> address = new ArrayList<Address>();
		if (user.getUserInfo().getAddress().size() > 0) {
			for (Address add : user.getUserInfo().getAddress()) {
				address.add((Address) dao.save(add));
			}
		}
		userInfo.setAddress(address);
		userInfo.setTelephone(user.getUserInfo().getTelephone());
		userInfo.setEmail(user.getUserInfo().getEmail());
		userInfo.setQq(user.getUserInfo().getQq());
		userInfo.setWechat(user.getUserInfo().getWechat());
		userInfo.setTaxCode(((EnterpriseInfo) user.getUserInfo()).getTaxCode());
		userInfo.setBusinessCode(((EnterpriseInfo) user.getUserInfo()).getBusinessCode());
		userInfo.setName(user.getUserInfo().getName());
		userInfo.setRemark(user.getUserInfo().getRemark());
		use.setUserInfo(userInfo);
		PasswordHelper.encryptPassword(use);
		dao.update(use);
		logger.info("end updateUserDetailed.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public BaseModelList<UserManageListForAll> getUserManageListForAll(Long id, BasePagerObject bso) {
		User user = (User) dao.getObject(User.class, id);
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = "select new com.zqw.bss.vo.sys.UserManageListForAll(u.id,u.username,u.userInfo.name,u.userInfo.telephone,u.employeeCode) "
				+ " from User u where u.parentEmployeeCode='" + user.getEmployeeCode() + "' " + conStr
				+ " order by u.lastUpdateDate desc ";
		List<UserManageListForAll> list = dao.getLst4Paging(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		String sqlStr = " select count(distinct u.id)" + " from User u where u.parentEmployeeCode='"
				+ user.getEmployeeCode() + "' " + conStr + " order by u.lastUpdateDate desc ";
		Long count = dao.getCount4Paging(sqlStr);
		String ro = "N";
		for (UserManageListForAll vo : list) {
			User us = (User) dao.getObject(User.class, vo.getId());
			vo.setRoleName(us.getRoles().get(0).getRoleNameCN());
			for (Role role : us.getRoles()) {
				if (role.getRoleName().equals("salesStaff") || role.getRoleName().equals("secondLevelSalesManage")) {
					ro = "Y";
				}
			}
			if (ro.equals("Y")) {
				vo.setAgentNum(dao.getCount4Paging(
						"select count(distinct sa.id) from SalesAgent sa where sa.sales.id= " + vo.getId()));
				vo.setSuccessNum(
						dao.getCount4Paging("select count(distinct o.id)from Owner o where o.sales.id=" + vo.getId()));
				vo.setPayNum(dao.getCount4PagingWithSQL(
						"SELECT count( DISTINCT t.id) from t_crm_owner t LEFT JOIN t_bss_order o on t.id=o.ownerId WHERE o.payStatus='paid' and t.sales_id="
								+ vo.getId()));
			}
			if (ro.equals("N")) {
				vo.setAgentNum(dao.getCount4Paging(
						"select count(distinct sa.id) from SalesAgent sa where sa.customer.id= " + vo.getId()));
				vo.setSuccessNum(dao.getCount4Paging(
						"select count(distinct o.id)from Owner o where o.customerCode='" + vo.getEmployeeCode() + "'"));
				vo.setPayNum(dao.getCount4PagingWithSQL(
						"SELECT count( DISTINCT t.id) from t_crm_owner t LEFT JOIN t_bss_order o on t.id=o.ownerId WHERE o.payStatus='paid' and t.customerCode='"
								+ vo.getEmployeeCode() + "'"));
			}
		}
		BaseModelList<UserManageListForAll> lists = new BaseModelList<UserManageListForAll>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateUserDetailedParentCode(User user) {
		user=(User) dao.getObject(User.class, user.getId());
		user.setParentEmployeeCode(null);
		dao.update(user);
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<SearchUserListVo> getSearchUserListVoAllName() {
		String sql =	"SELECT us.username,u.name,us.id FROM t_bss_sys_user us "
				+" LEFT JOIN t_crm_user_info u ON u.id=us.userInfo_id "
				+" LEFT JOIN t_bss_userrole_info ur ON us.id=ur.userid "
				+" LEFT JOIN t_bss_sys_role_info ro ON ro.id=ur.roleid "
			    +" WHERE 	ro.roleName='taxStaff' OR ro.roleName='taxStaffadmin'";
		
		List list = dao.executeQuerySql(sql, null);
		List<SearchUserListVo> lists = new ArrayList<SearchUserListVo>();
		for(int i =0;i<list.size();i++){
			SearchUserListVo vo = new SearchUserListVo();
			Object[] obj = (Object[]) list.get(i);
			vo.setId(Long.valueOf(obj[2].toString()));
			vo.setUsername(obj[0].toString());
			vo.setName(obj[1].toString());
			lists.add(vo);
		}
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> getCustomerOrSales(String type) {
		logger.info("begin getCustomerOrSales");
		if (type.equals("customer")) {
			String sql = "SELECT u.id,u.username,u.employeeCode,ui.telephone,u.distributionEmployeeCode,ui.name FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur,t_crm_user_info ui "
					+ "WHERE ui.id=u.userInfo_id and ur.userid = u.id AND ur.roleid = r.id  AND (r.id in (6,8,10))";
			List<User> list = (List<User>) dao.executeQuerySql(sql, null);
			List<User> personList = new ArrayList<User>();
			for (Object array : list) {
				Object[] ar = (Object[]) array;
				User personInfo = new User(ar[0], (String) ar[1], (String) ar[2], ar[3], ar[4],ar[5]);
				personList.add(personInfo);
			}	
		logger.info("end getCustomerOrSales");
		return personList;	
		}else{
			String sql = "SELECT u.id,u.username,u.employeeCode,ui.telephone,u.distributionEmployeeCode,ui.name FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur,t_crm_user_info ui "
					+ "WHERE ui.id=u.userInfo_id and ur.userid = u.id AND ur.roleid = r.id  AND (r.id in (3,7,9))";
			List<User> list = (List<User>) dao.executeQuerySql(sql, null);

			List<User> personList = new ArrayList<User>();
			for (Object array : list) {
				Object[] ar = (Object[]) array;
				User personInfo = new User(ar[0], (String) ar[1], (String) ar[2], ar[3], ar[4],ar[5]);
				personList.add(personInfo);
			}
		logger.info("end getCustomerOrSales");
		return personList;
		}
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<User> getDistributionEmployeeCode() {
		logger.info("begin getDistributionEmployeeCode");
		String sql = "SELECT u.id,u.username,u.employeeCode,ui.telephone,u.distributionEmployeeCode,u.distributionCustomerEmployeeCode FROM t_bss_sys_user u,t_bss_sys_role_info r,t_bss_userrole_info ur,t_crm_user_info ui "
				+ "WHERE ui.id=u.userInfo_id and ur.userid = u.id AND ur.roleid = r.id  AND (r.id in (3,6,8,7,9,10))";
		
		List<User> list = (List<User>) dao.executeQuerySql(sql, null);

		List<User> personList = new ArrayList<User>();
		for (Object array : list) {
			Object[] ar = (Object[]) array;
			User personInfo = new User(ar[0], (String) ar[1], (String) ar[2], ar[3], ar[4],ar[5],"");
			personList.add(personInfo);
		}
		logger.info("end getDistributionEmployeeCode");
		return personList;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<String> getIps() {
		String sql =" select ipContent from t_ocr_loginIp ";
		List<String> strs = dao.executeQuerySql(sql, null);
		return strs;
	}


}
