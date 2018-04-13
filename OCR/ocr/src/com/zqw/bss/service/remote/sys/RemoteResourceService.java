package com.zqw.bss.service.remote.sys;

import java.util.List;
import java.util.Set;

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
import com.zqw.bss.model.sys.Resource;

/**
 * <p>
 * Resource Service
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@Path("/resource")
public interface RemoteResourceService {

	/**
	 * 创建 资源权限
	 * @param resource对象
	 * @return 资源权限
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Resource saveResource(Resource resource);

	/**
	 * 修改资源权限
	 * @param resource
	 * @return Boolean
	 */
	@PUT
	@Path("/")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateResource(Resource resource);

	/**
	 * 删除资源权限
	 * @param id
	 * @return Boolean
	 */
	@DELETE
	@Path("/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delResourceById(@PathParam("id") Long id);

//	/**
//	 * get Permissions By Resource Id
//	 * 
//	 * @param resourceIds
//	 * @return Set<String>
//	 */
//	@GET
//	@Path("/resourceid/{id}")
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Resource getResourceById(@PathParam("id") Long id);

	/**
	 * 获取所有资源权限
	 * @return 所有资源权限列表
	 */
	@GET
	@Path("/resources")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<Resource> getResources();

	/**
	 * 获取资源权限列表
	 * @return 资源权限列表
	 */
	@GET
	@Path("/search/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<Resource> searchResources(
			@PathParam("query") String query);

	/**
	 * 根据资源类型获取资源信息
	 * @String type资源类型
	 * @return Set<String>
	 */
	@GET
	@Path("/permission/type/{type}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Set<String> getResourcesByPermissionsAndType(
			@PathParam("type") String type);

	/**
	 * 通过等级和父id获取资源权限
	 * @param level
	 * @param parentId
	 * @return 资源权限列表
	 */
	@GET
	@Path("/permission/{level}/{parentId}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<Resource> searchResourcePermissions(
			@PathParam("level") Integer level,
			@PathParam("parentId") Long parentId);
}
