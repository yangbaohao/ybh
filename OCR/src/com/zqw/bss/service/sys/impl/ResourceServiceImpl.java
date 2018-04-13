package com.zqw.bss.service.sys.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.apache.shiro.authz.permission.WildcardPermission;
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
import com.zqw.bss.service.sys.ResourceService;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.SystemConstant.ResourceType;
import com.zqw.bss.util.security.shiro.SessionUtil;

/**
 * <p>
 * Resource Service Impl
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
@Qualifier("resourceService")
@SuppressWarnings("unchecked")
public class ResourceServiceImpl implements ResourceService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected DAO dao;

	protected UserService userService;

	@Autowired
	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Resource saveResource(Resource resource) {
		logger.info("begin saveResource.");

		Resource res = (Resource) dao.save(resource);
		logger.info("end  saveResource.resource : [ id ="
				+ res.getId() + WebUtil.getLogBasicString() + "]");
		return res;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateResource(Resource resource) {

		logger.info("begin updateResource.  id = [" + resource.getId() + "]");
		resource.setLastUpdateDate(new Date());
		dao.update(resource);
		logger.info("end updateResource:[ id ="+ WebUtil.getLogBasicString() + "]");
		return true;

	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delResourceById(Long resourceId) {
		logger.info("begin delResourceById.  id = [" + resourceId + "]");
		dao.getHibSession().createSQLQuery(
				"delete from t_sys_roleresource_info  where resourceid= ? ")
				.setParameter(0, resourceId).executeUpdate();

		dao.removeObject(Resource.class, resourceId);

		logger.info("end delResourceById:[ id ="+ WebUtil.getLogBasicString() + "]");
		return true;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Resource getResourceById(Long resourceId) {
		logger.info("begin getResourceById.  id = [" + resourceId + "]");
		Resource res = (Resource) dao.getObject(Resource.class, resourceId);
		logger.info("end getResourceById:[ id ="+ WebUtil.getLogBasicString() + "]");
		return res;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Resource> getResources() {
		logger.info("begin getResources.");
		List<Resource> resources = dao.getObjects(Resource.class);
		logger.info("end getResources:[ id ="+ WebUtil.getLogBasicString() + "]");
		return resources;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Resource> findResources(Resource resource) {
		logger.info("begin findResources. id = [" + resource.getId() + "]");
		List<Criterion> criterionList = new ArrayList<Criterion>();
		if (!StringUtils.isEmpty(resource.getName())) {
			criterionList.add(Restrictions.like("name", "%"
					+ resource.getName() + "%"));
		}
		if (!StringUtils.isEmpty(resource.getType())) {
			criterionList.add(Restrictions.eq("type", resource.getType()));
		}
		if (!StringUtils.isEmpty(resource.getPermission())) {
			criterionList.add(Restrictions.eq("permission", resource
					.getPermission()));
		}
		if (!"*".equals(resource.getAvailable())) {
			criterionList.add(Restrictions.eq("available", resource
					.getAvailable()));
		}
		Criterion[] criterions = criterionList
				.toArray(new Criterion[criterionList.size()]);

		List<Resource> resources = dao.getList(Resource.class, criterions);
		logger.info("end findResources:[ id ="+ WebUtil.getLogBasicString() + "] ");
		return resources;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Set<String> getPermissionsByResourceId(Set<Long> resourceIds) {
		logger.info("begin getPermissionsByResourceId.");
		Set<String> permissions = new HashSet<String>();
		for (Long resourceId : resourceIds) {
			Resource resource = getResourceById(resourceId);
			if (resource != null
					&& !StringUtils.isEmpty(resource.getPermission())) {
				permissions.add(resource.getPermission());
			}
		}
		logger.info("end getPermissionsByResourceId:[ id ="+ WebUtil.getLogBasicString() + "] ");
		return permissions;
	}

	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Set<String> getResourcesByPermissionsAndType(String type) {
		SimpleDateFormat timeFmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss:SSS");
		logger.error("权限接口开始时间"+timeFmt.format(new Date()));
		String hql = "from Resource rs where rs.available='Y'";
		List<Resource> allResources = null;
		if (type != null){
			allResources = dao.find(hql + " and rs.type = ? ", ResourceType.valueOf(type));
		}
		else{
			allResources = dao.find(hql);
		}
		Set<String> permissions = (Set<String>) SessionUtil
				.get(SystemConstant.SESSION_KEY_USER_PERMISSIONS);

		Set<String> resources = new HashSet<String>();
		logger.error("遍历数据库中所有全选开始时间"+timeFmt.format(new Date()));
		for (Resource resource : allResources) {
			if (resource.isRootNode()) {
				continue;
			}
			if (!(resource.getType().equals(ResourceType.menu) || resource.getType().equals(ResourceType.function) 
					|| resource.getType().equals(ResourceType.button) )) {
				continue;
			}
			if (!hasPermission(permissions, resource)) {
				continue;
			}
			resources.add(resource.getPermission());
		}
		logger.error("权限接口结束时间"+timeFmt.format(new Date()));
		return resources;
	}
	
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	private boolean hasPermission(Set<String> permissions, Resource resource) {

		logger.info("begin hasPermission.");

		if (StringUtils.isEmpty(resource.getPermission())) {
			logger.info("end hasPermission:[ id ="+ WebUtil.getLogBasicString() + "] ");
			return true;
		}
		for (String permission : permissions) {
			WildcardPermission p1 = new WildcardPermission(permission);
			WildcardPermission p2 = new WildcardPermission(resource
					.getPermission());
			if (p1.implies(p2) && p2.implies(p1)) {
				logger.info("end hasPermission:[ id ="+ WebUtil.getLogBasicString() + "] ");
				return true;
			}
		}
		logger.info("end hasPermission:[ id ="+ WebUtil.getLogBasicString() + "] ");
		return false;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Resource> findResourcePermissions(Integer level, Long parentId) {

		logger.info("begin findResourcePermissions.");
		List<Criterion> criterionList = new ArrayList<Criterion>();
		if (!level.equals(1) ) {
			criterionList.add(Restrictions.eq("parentId", parentId));
		}
		criterionList.add(Restrictions.eq("level", level));
		Criterion[] criterions = criterionList
				.toArray(new Criterion[criterionList.size()]);

		List<Resource> resources = dao.getList(Resource.class, criterions);
		logger.info("end findResourcePermissions.[ id ="+ WebUtil.getLogBasicString() + "] ");
		return resources;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Resource> findResourceFilters(BasePagerObject bso) {
		String[] arr = new String[] { "" };
		for (int i = 0; i < bso.getCondition().size(); i++) {
			if ((bso.getCondition().get(i).getValue()[0]).equals(arr[0])) {
				bso.getCondition().remove(i);
				i--;
			}
		}
		logger.info("begin findResourceFilters.");
		List<Resource> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso,
				Resource.class, null), new int[] { bso.getPagenum(),
				bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso,
				Resource.class));
		// ProxyObjectUtil.getPorxyList
		logger.info("end findResourceFilters.[ id ="+ WebUtil.getLogBasicString() + "] ");
		return new BaseModelList<Resource>(count, WebUtil.getEntryListFromProxyList(urls, dao));
	}

}
