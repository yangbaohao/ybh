package com.zqw.bss.service.sys;

import java.util.List;
import java.util.Set;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
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
public interface ResourceService {

	/**
	 * 创建资源
	 * @param Resource
	 *            resource
	 * @return Resource
	 */
	public Resource saveResource(Resource resource);

	/**
	 * 修改资源
	 * @param Resource
	 *            resource
	 * @return Boolean
	 */
	public Boolean updateResource(Resource resource);

	/**
	 * 删除资源
	 * @param resourceIds
	 * @return Set<String>
	 */
	public Boolean delResourceById(Long resourceId);

	/**
	 * 获取权限 by id
	 * @param resourceIds
	 * @return Set<String>
	 */
	public Resource getResourceById(Long resourceId);

	/**
	 * 获取所有资源
	 * @return List<Resource>
	 */
	public List<Resource> getResources();

	/**
	 * search 资源 List
	 * 
	 * @return
	 */
	public List<Resource> findResources(Resource resource);

	/**
	 * get 多个权限 By Resource Id
	 * 
	 * @param resourceIds
	 * @return Set<String>
	 */
	public Set<String> getPermissionsByResourceId(Set<Long> resourceIds);



	/**
	 * Get Menus By Permissions and type 
	 * 
	 * @String type
	 * @return List<Resource>
	 */
	public Set<String> getResourcesByPermissionsAndType(String type);

	/**
	 * 获取权限 by level parentId
	 * @param level
	 * @param parentId
	 * @return
	 */
	public List<Resource> findResourcePermissions(Integer level, Long parentId);

	/**
	 * 获取资源列表分页
	 * @param bso
	 * @return
	 */
	public BaseModelList<Resource> findResourceFilters(BasePagerObject bso);
}
