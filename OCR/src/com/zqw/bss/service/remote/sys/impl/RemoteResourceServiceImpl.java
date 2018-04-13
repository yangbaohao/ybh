package com.zqw.bss.service.remote.sys.impl;

import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.util.StringUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sys.Resource;
import com.zqw.bss.service.remote.sys.RemoteResourceService;
import com.zqw.bss.service.sys.ResourceService;
import com.zqw.bss.util.WebUtil;


@SuppressWarnings("unchecked")
public class RemoteResourceServiceImpl implements RemoteResourceService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	public ResourceService resourceService;
	
	protected DAO dao;

	@Autowired
	public void setResourceService(ResourceService resourceService) {
		this.resourceService = resourceService;
	}

	@Override
	public Resource saveResource(Resource resource) {
		logger.info("begin saveResource.");
		SecurityUtils.getSubject().checkPermissions("base:resource:create");
		resource =(Resource)WebUtil.getEntryFromProxyObj(resourceService.saveResource(resource), dao);
		logger.info("end  saveResource.resource: [ id ="
				+ resource.getId() + WebUtil.getLogBasicString() + "]");
		return resource;
	}

	@Override
	public Boolean updateResource(Resource resource) {
		logger.info("begin updateResource. id = [" + resource.getId() + "]");
		SecurityUtils.getSubject().checkPermissions("base:resource:update");
		Boolean boo = resourceService.updateResource(resource);
		logger.info("end  updateResource:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

	@Override
	public Boolean delResourceById(Long id) {
		logger.info("begin delResourceById. id = [" + id + "]");
		SecurityUtils.getSubject().checkPermissions("base:resource:delete");
		Boolean boo = resourceService.delResourceById(id);
		logger.info("end  delResourceById:[ id ="+ WebUtil.getLogBasicString() + "]");
		return boo;
	}

//	@Override
//	public Resource getResourceById(Long id) {
//		logger.info("begin getResourceById. id = [" + id + "]");
//		Resource resource = (Resource)WebUtil.getEntryFromProxyObj(resourceService.getResourceById(id), dao);
//		logger.info("end  getResourceById.resource: [ id ="
//				+ resource.getId() + WebUtil.getLogBasicString() + "]");
//		return resource;
//	}

	@Override
	public List<Resource> getResources() {
		logger.info("begin getResources.");
		SecurityUtils.getSubject().checkPermissions("base:resource:view");
		List<Resource> list = resourceService.getResources();
		logger.info("end  getResources:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	public BaseModelList<Resource> searchResources(String query) {
		logger.info("begin searchResources. ");
		SecurityUtils.getSubject().checkPermissions("base:resource:view");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		logger.info(bso);
		BaseModelList<Resource> list = resourceService.findResourceFilters(bso);
		logger.info("end  searchResources:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	public List<Resource> searchResourcePermissions(Integer level, Long parentId) {
		logger.info("begin searchResourcePermissions.");
		SecurityUtils.getSubject().checkPermissions("base:resource:view");
		List<Resource> list = WebUtil.getEntryListFromProxyList(resourceService.findResourcePermissions(level, parentId), dao);
		logger.info("end  searchResourcePermissions:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	public Set<String> getResourcesByPermissionsAndType(String type) {
		logger.info("begin getResourcesByPermissionsAndType.");
		if ("null".equals(type) || "all".equals(type)
				|| StringUtil.isEmpty(type))
			type = null;
		Set<String> set = resourceService.getResourcesByPermissionsAndType(type);
		logger.info("end  getResourcesByPermissionsAndType:[ id ="+ WebUtil.getLogBasicString() + "]");
		return set;
	}
}
