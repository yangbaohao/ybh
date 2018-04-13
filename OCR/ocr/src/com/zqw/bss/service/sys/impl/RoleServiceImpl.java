package com.zqw.bss.service.sys.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sys.Resource;
import com.zqw.bss.model.sys.Role;
import com.zqw.bss.service.sys.RoleService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.sys.RoleListForSearchVo;
import com.zqw.bss.vo.sys.SearchRoleListVo;

/**
 * <p>
 * Role Service Impl
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
@Qualifier("roleService")
@SuppressWarnings({ "unchecked" })
public class RoleServiceImpl implements RoleService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected DAO dao;

	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Role saveRole(Role role) {

		logger.info("begin saveRole.");
		// WebUtil.prepareInsertParams(role);
		role = (Role) dao.save(role);
		logger.info("end  saveRole.role : [ id =" + role.getId() + WebUtil.getLogBasicString() + "]");
		return role;

	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateRole(Role role) {

		logger.info("begin updateRole.  id = [" + role.getId() + "]");
		// WebUtil.prepareUpdateParams(role);
		dao.update(role);
		logger.info("end updateRole:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;

	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateRoleForRes(Role role) {

		logger.info("begin updateRole.  id = [" + role.getId() + "]");
		// WebUtil.prepareUpdateParams(role);
		Role roleSrc = getRoleById(role.getId());
		roleSrc.setResources(role.getResources());
		dao.update(roleSrc);
		logger.info("end updateRole:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;

	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delRoleById(Long roleId) {

		logger.info("begin delRoleById.  id = [" + roleId + "]");
		dao.getHibSession().createSQLQuery("delete from t_sys_userrole_info  where roleid= ? ").setParameter(0, roleId)
				.executeUpdate();

		dao.removeObject(Role.class, roleId);
		logger.info("end delRoleById:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Role getRoleById(Long roleId) {

		logger.info("begin getRoleById.  id = [" + roleId + "]");
		Role role = (Role) dao.getObject(Role.class, roleId);
		role.getResources().size();
		logger.info("end  getRoleById.role : [ id =" + role.getId() + WebUtil.getLogBasicString() + "]");
		return role;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Set<String> getRoleNamesByIds(List<Long> roleIds) {
		logger.info("begin getRoleNamesByIds.");
		Set<String> roles = new HashSet<String>();
		for (Long roleId : roleIds) {
			Role role = getRoleById(roleId);
			if (role != null) {
				roles.add(role.getRoleName());
			}
		}
		logger.info("end getRoleNamesByIds:[ id =" + WebUtil.getLogBasicString() + "]");
		return roles;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Set<String> getPermissionsByRoleIds(List<Long> roleIds) {

		logger.info("begin getPermissionsByRoleIds.");
		Set<String> permissions = new HashSet<String>();
		for (Long roleId : roleIds) {
			Role role = getRoleById(roleId);
			if (role != null) {
				for (Resource resource : role.getResources()) {
					permissions.add(resource.getPermission());
				}
			}
		}
		logger.info("end getPermissionsByRoleIds:[ id =" + WebUtil.getLogBasicString() + "]");
		return permissions;
	}

	/**
	 * 获取角色列表
	 */
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Role> getAllRoleList() {
		logger.info("begin getAllRoleList.");
		Set<String> roles =  (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		//如果是组长登陆返回
		List<Role> rolelist;
		if(roles.contains("Ocr_group")){
			rolelist = dao.find("from Role where roleName in ('Ocr_auditor','Ocr_createBy')   order by lastUpdateDate asc");
		}else{
			rolelist = dao.find("from Role where roleName like 'Ocr%'   order by lastUpdateDate asc");
		}
		logger.info("end getAllRoleList:[ id =" + WebUtil.getLogBasicString() + "]");
		return rolelist;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Role> findRoles(Role role) {
		logger.info("begin findRoles. id = [" + role.getId() + "]");
		List<Criterion> criterionList = new ArrayList<Criterion>();
		if (!StringUtils.isEmpty(role.getRoleName())) {
			criterionList.add(Restrictions.like("roleName", "%" + role.getRoleName() + "%"));
		}
		if (null != role.getAvailable()) {
			criterionList.add(Restrictions.eq("available", role.getAvailable()));
		}
		if (!StringUtils.isEmpty(role.getDescription())) {
			criterionList.add(Restrictions.eq("description", role.getDescription()));
		}
		Criterion[] criterions = criterionList.toArray(new Criterion[criterionList.size()]);

		List<Role> roles = dao.getList(Role.class, criterions);
		logger.info("end findRoles:[ id =" + WebUtil.getLogBasicString() + "]");
		return roles;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<SearchRoleListVo> findRoles(BasePagerObject roleCondition) {
		logger.info("begin findRoles by roleCondition");
		String conStr = HsqlUtil.getConditionHqlStr(roleCondition, new StringBuilder());

		String hql = "select new com.zqw.bss.vo.sys.SearchRoleListVo(id,roleNameCN,description,"
				+ "available,lastUpdateDate)" + "from Role " + "where 1=1 " + conStr;
		List<Role> roles = dao.getLst4Paging(hql,
				new int[] { roleCondition.getPagenum(), roleCondition.getPagesize() });
		String hqlacc = "select count(id) from Role  " + "where 1=1 " + conStr;
		Long count = dao.getCount4Paging(hqlacc);

		BaseModelList<SearchRoleListVo> lists = new BaseModelList<SearchRoleListVo>(count,
				WebUtil.getEntryListFromProxyList(roles, dao));
		logger.info("end findRoles by roleCondition:[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;
	}

	@Override
	@Transactional(readOnly = true,propagation=Propagation.REQUIRED)
	public List<RoleListForSearchVo> getAllRolesForSearch() {
		// TODO Auto-generated method stub
		 List<RoleListForSearchVo> list = dao.find("select new com.zqw.bss.vo.sys.RoleListForSearchVo(id,roleName,roleNameCN) "
		 		+ " from Role where available='Y' and roleName like 'Ocr%'");
		return list;
	}
}
