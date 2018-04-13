package com.zqw.bss.service.sys;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sys.Organization;

/**
 * <p>
 * Organization Service
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
public interface OrganizationService {

	/**
	 * Save Organization
	 * 
	 * @param Organization
	 *            organization
	 * @return Organization
	 */
	public Organization saveOrganization(Organization organization);

	/**
	 * update Organization
	 * 
	 * @param Organization
	 *            organization
	 * 
	 * @return Boolean
	 */
	public Boolean updateOrganization(Organization organization);

	/**
	 * Del Organization
	 * 
	 * @param Long
	 *            organizationId
	 * 
	 * @return Boolean
	 */
	public Boolean delOrganizationById(Long organizationId);

	/**
	 * get Organization By Id
	 * 
	 * @param Long
	 *            organizationId
	 * 
	 * @return Organization
	 */
	public Organization getOrganizationById(Long organizationId);

	/**
	 * get All Organization List
	 * 
	 * 
	 * @return List<Organization>
	 */
	public List<Organization> getAllOrganizationList();
	
	/**
	 * find Organizations
	 * 
	 * @param Long
	 * 
	 * @return List<Organization>
	 */
	public BaseModelList<Organization> findOrganizations(BasePagerObject organization);

}
