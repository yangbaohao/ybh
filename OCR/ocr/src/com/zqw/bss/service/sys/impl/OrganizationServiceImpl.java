package com.zqw.bss.service.sys.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sys.Organization;
import com.zqw.bss.service.sys.OrganizationService;
import com.zqw.bss.util.WebUtil;

/**
 * <p>
 * Organization Service Impl
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
@Qualifier("organizationService")
@SuppressWarnings({ "unchecked" })
public class OrganizationServiceImpl implements OrganizationService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected DAO dao;

	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Organization saveOrganization(Organization organization) {
		logger.info("begin saveOrganization.");
		// WebUtil.prepareInsertParams(organization);
		Organization org = (Organization) dao.save(organization);
		logger.info("end saveOrganization. id = [" + org.getId() + "]");
		return org;

	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateOrganization(Organization organization) {
		logger.info("begin updateOrganization.  id = [" + organization.getId() + "]");
		// WebUtil.prepareUpdateParams(organization);
		dao.update(organization);
		logger.info("end updateOrganization:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delOrganizationById(Long organizationId) {
		logger.info("begin delOrganizationById.  id = [" + organizationId + "]");
		dao.removeObject(Organization.class, organizationId);
		logger.info("end delOrganizationById:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Organization getOrganizationById(Long organizationId) {
		logger.info("begin getOrganizationById.  id = [" + organizationId + "]");
		Organization org = (Organization) dao.getObject(Organization.class, organizationId);
		logger.info(
				"end  getOrganizationById.organization : [ id =" + org.getId() + WebUtil.getLogBasicString() + "]");
		return org;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<Organization> getAllOrganizationList() {
		logger.info("begin getAllOrganizationList.");
		List<Organization> orgs = dao.find("from Organization  order by lastUpdateDate desc");
		logger.info("end getAllOrganizationList:[ id =" + WebUtil.getLogBasicString() + "]");
		return orgs;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Organization> findOrganizations(BasePagerObject bso) {
		logger.info("begin findOrganizations.");
		List<Organization> organizations = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, Organization.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });

		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, Organization.class));
		BaseModelList<Organization> lists = new BaseModelList<Organization>(count,
				WebUtil.getEntryListFromProxyList(organizations, dao));
		logger.info("end findOrganizations:[ id =" + WebUtil.getLogBasicString() + "]");
		return lists;
	}

}
