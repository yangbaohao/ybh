package com.zqw.bss.service.sys;

import java.util.List;
import java.util.Set;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sys.Role;
import com.zqw.bss.vo.sys.RoleListForSearchVo;
import com.zqw.bss.vo.sys.SearchRoleListVo;

/**
 * <p>
 * Role Service
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
public interface RoleService {

	/**
	 * 创建角色
	 * @param Role
	 *            role
	 * @return Role
	 */
	public Role saveRole(Role role);

	/**
	 *修改角色
	 * 
	 * @param Role
	 *            role
	 * @return Boolean
	 */
	public Boolean updateRole(Role role);

	/**
	 * 获取角色的权限
	 * @param role
	 * @return
	 */
	public Boolean updateRoleForRes(Role role);
	
	/**
	 * 删除角色
	 * @param Long
	 *            roleId
	 * @return Boolean
	 */
	public Boolean delRoleById(Long roleId);

	
	/**
	 * 获取所有角色
	 * @param
	 *           
	 * @return Role
	 */
	public List<Role> getAllRoleList();
	
	
	/**
	 * 通过id 获取角色
	 * @param Long
	 *            roleId
	 * @return Role
	 */
	public Role getRoleById(Long roleId);

	/**
	 * 获取多个角色
	 * @param roleIds
	 * @return Set<String>
	 */
	public Set<String> getRoleNamesByIds(List<Long> roleIds);

	/**
	 * get Permissions By Role Ids
	 * 
	 * @param roleIds
	 * @return Set<String>
	 */
	public Set<String> getPermissionsByRoleIds(List<Long> roleIds);
	
	
	/**
	 * 获取所有角色
	 * @param Long
	 * 
	 * @return List<Role>
	 */
	public List<Role> findRoles(Role role);
	
	/**
	 * 获取所有角色列表Vo
	 * @param roleCondition
	 * @return
	 */
	public BaseModelList<SearchRoleListVo> findRoles(BasePagerObject roleCondition);
	
	public List<RoleListForSearchVo> getAllRolesForSearch();
}
