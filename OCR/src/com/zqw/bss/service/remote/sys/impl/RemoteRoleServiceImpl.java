package com.zqw.bss.service.remote.sys.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sys.Role;
import com.zqw.bss.service.remote.sys.RemoteRoleService;
import com.zqw.bss.service.sys.RoleService;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.sys.RoleListForSearchVo;
import com.zqw.bss.vo.sys.SearchRoleListVo;

@SuppressWarnings("unchecked")
public class RemoteRoleServiceImpl implements RemoteRoleService{
	
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected RoleService roleService;
	
	@Autowired
	protected DAO dao;

	@Override
	public Role getRoleById(Long id) {
		logger.info("begin getRoleById. id = ["+id+"]");
		SecurityUtils.getSubject().checkPermissions("base:role:view");
		Role role = (Role)WebUtil.getEntryFromProxyObj(roleService.getRoleById(id), dao);
		logger.info("end  getRoleById.role: [ id ="
				+ role.getId() + WebUtil.getLogBasicString() + "]");
		return role;
	}

	
	@Override
	public Role createRole(Role role) {
		logger.info("begin createRole.");
		SecurityUtils.getSubject().checkPermissions("base:role:create");
	    role = (Role)WebUtil.getEntryFromProxyObj(roleService.saveRole(role), dao);
	    logger.info("end  createRole.role: [ id ="
				+ role.getId() + WebUtil.getLogBasicString() + "]");
		return role;
		
	}

	@Override
	public Boolean updateRole(Role role) {
		logger.info("begin updateRole.");
		SecurityUtils.getSubject().checkPermissions("base:role:update");
		Role roleSrc = getRoleById(role.getId());
		role.setCreateBy(roleSrc.getCreateBy());
		role.setCreateDate(roleSrc.getCreateDate());
		Boolean boo =  roleService.updateRole(role);
		logger.info("end  updateRole:[id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}
	
	@Override
	public Boolean updateRoleForRes(Role role) {
		logger.info("begin updateRoleForRes.");
		SecurityUtils.getSubject().checkPermissions("base:role:update");
		if(roleService.updateRoleForRes(role) != null){
			Boolean boo = true;
			logger.info("end  updateRoleForRes:[id ="+ WebUtil.getLogBasicString() + "]");
			return boo;
		}	
		else{
			Boolean boo = false;
			logger.info("end  updateRoleForRes:[id ="+ WebUtil.getLogBasicString() + "]");
			return boo;
		}
		
	}

	@Override
	public Boolean delRoleById(Long id) {
		logger.info("begin delRoleById. id  = [" +id+"]");
		SecurityUtils.getSubject().checkPermissions("base:role:delete");
		Boolean boo =  roleService.delRoleById(id);
		logger.info("end  updateRoleForRes:[id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}


	@Override
	public List<Role> getAllRole() {
		logger.info("begin getAllRole.");
		SecurityUtils.getSubject().checkPermissions("base:userrole:view");
		List<Role> list = WebUtil.getEntryListFromProxyList(roleService.getAllRoleList(), dao);
		logger.info("end  getAllRole:[id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}


//	@Override
//	public List<Role> searchRoles(Role role) {
//		logger.info(role);
//		logger.info(role.getRoleName());
//		List<Role> list = WebUtil.getEntryListFromProxyList(roleService.findRoles(role), dao);
//		logger.info("end  searchRoles:[id ="+ WebUtil.getLogBasicString() + "]");
//		return list;
//	}


	@Override
	public BaseModelList<SearchRoleListVo> searchRoles(String query) {
		logger.info("begin searchRoles.");
		SecurityUtils.getSubject().checkPermissions("base:role:view");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		logger.info(bso);
		BaseModelList<SearchRoleListVo> list = roleService.findRoles(bso);
		logger.info("end  searchRoles:[id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}


	@Override
	public List<RoleListForSearchVo> getAllRolesForSearch() {
		// TODO Auto-generated method stub
		return roleService.getAllRolesForSearch();
	}

}









