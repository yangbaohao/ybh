//==============================================================================
// Created on 2009-7-7
// $Id$
//==============================================================================
package com.zqw.bss.service.remote.sys;

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
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.model.sys.Role;
import com.zqw.bss.vo.sys.RoleListForSearchVo;
import com.zqw.bss.vo.sys.SearchRoleListVo;

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
@Path("/role")
public interface RemoteRoleService {

	/**
	 * 获取所有角色
	 * @param 
	 * @return 角色列表
	 */
	@GET
	@Path("/")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<Role> getAllRole();
	
	/**
	 * 获取角色 By Id
	 * @param  Id
	 * @return 角色信息
	 */
	@GET
	@Path("/roleid/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Role getRoleById(@PathParam("id") Long id);

	/**
	 * 创建角色
	 * @param role对象
	 * @return  角色信息
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Role createRole(Role role);

	/**
	 * 修改角色信息
	 * @param role
	 * @return Boolean
	 */
	@PUT
	@Path("/")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateRole(Role role);
	
	/**
	 * 修改角色的权限
	 * @param role对象
	 * @return Boolean
	 */
	@PUT
	@Path("/resource")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateRoleForRes(Role role);

	/**
	 * 删除角色
	 * @param  id
	 * @return Boolean
	 */
	@DELETE
	@Path("/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delRoleById(@PathParam("id") Long id);
	
//	@POST
//	@Path("/search")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public List<Role> searchRoles(Role role);
	
	/**
	 * 获取角色的列表
	 * @param 角色的列表查询条件(分页查询条件json固定格式)
	 * @return 角色的列表
	 */
	@GET
	@Path("/search/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SearchRoleListVo> searchRoles(@PathParam("query") String query);

	/**
	 * 获取所有角色
	 * @param 
	 * @return 角色列表
	 */
	@GET
	@Path("/for/search")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<RoleListForSearchVo> getAllRolesForSearch();
}
