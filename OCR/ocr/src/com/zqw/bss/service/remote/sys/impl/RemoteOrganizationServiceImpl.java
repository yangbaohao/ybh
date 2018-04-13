package com.zqw.bss.service.remote.sys.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.service.remote.sys.RemoteOrganizationService;
import com.zqw.bss.service.sys.OrganizationService;

public class RemoteOrganizationServiceImpl implements RemoteOrganizationService{
	
	
//	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected OrganizationService organizationService;

	@Autowired
	protected DAO dao;

//	@Override
//	public Organization getOrganizationById(Long id) {
//		logger.info("begin getOrganizationById. id = ["+id+"]");
//		Organization organization =(Organization)WebUtil.getEntryFromProxyObj(organizationService.getOrganizationById(id), dao);
//		logger.info("end  getOrganizationById.organization : [ id ="
//				+ organization.getId() + WebUtil.getLogBasicString() + "]");
//		return organization;
//	}

//	@Override
//	public Organization createOrganization(Organization organization) {
//		logger.info("begin createOrganization.");
//	    organization =(Organization)WebUtil.getEntryFromProxyObj(organizationService.saveOrganization(organization), dao);
//	    logger.info("end  createOrganization.organization : [ id ="
//				+ organization.getId() + WebUtil.getLogBasicString() + "]");
//		return organization;
//	}

//	@Override
//	public Boolean updateOrganization(Organization organization) {
//		logger.info("begin updateOrganization.");
//		Organization organizationSrc = getOrganizationById(organization.getId());
//		organization.setCreateBy(organizationSrc.getCreateBy());
//		organization.setCreateDate(organizationSrc.getCreateDate());
//		Boolean boo =  organizationService.updateOrganization(organization);
//		logger.info("end  updateOrganization:[ id ="+ WebUtil.getLogBasicString() + "]");
//		return boo;
//	}

//	@Override
//	public Boolean delOrganizationById(Long id) {
//		logger.info("begin delOrganizationById. id = ["+id+"");
//		Boolean boo = organizationService.delOrganizationById(id);
//		logger.info("end  delOrganizationById:[ id ="+ WebUtil.getLogBasicString() + "]");
//		return boo;
//	}

//	@Override
//	public List<Organization> getAllOrganization() {
//		logger.info("begin getAllOrganization.");
//		List<Organization> list = WebUtil.getEntryListFromProxyList(organizationService.getAllOrganizationList(), dao);
//		logger.info("end  getAllOrganization:[ id ="+ WebUtil.getLogBasicString() + "]");
//		return list;
//	}

//	public BaseModelList<Organization> searchOrganizations(String query) {
//		logger.info("begin searchOrganizations");
//		String request = HsqlUtil.DecodeRequest(query);
//		BasePagerObject bso = HsqlUtil.toPager(request);
//		bso.setSortdatafield("lastUpdateDate");
//		bso.setSortorder("desc");
//		Condition con = new Condition();
//		con.setAction("eq");
//		con.setKey("ownerId");
//		String[] str = new String[]{String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID))};
//		con.setValue(str);
//		bso.condition.add(con);
//		logger.info(bso);
//		BaseModelList<Organization> list = organizationService.findOrganizations(bso);
//		logger.info("end  searchOrganizations:[ id ="+ WebUtil.getLogBasicString() + "]");
//		return list;
//	}
	
}
