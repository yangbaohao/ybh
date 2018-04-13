package com.zqw.bss.service.crm.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.StringUtil;
import com.zqw.bss.model.crm.UserInfo;
import com.zqw.bss.service.crm.UserInfoService;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.crm.UserInfoForListVO;

/**
 * <p>
 * EnterpriseInfo Service Impl
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
@Qualifier("enterpriseInfoService")
@SuppressWarnings("unchecked")
public class UserInfoServiceImpl implements UserInfoService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected DAO dao;

	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public UserInfo getUserInfoByCert(String type, String id) {
		logger.info("begin getUserInfoByCert. id =[" + id + "]");
		String typeSql = " and certificateType=";
		if (StringUtil.isNotEmpty(type)) {
			typeSql = typeSql + "'" + type + "'";
		} else {
			typeSql = "";
		}
		List<UserInfo> userInfos = dao.find("from UserInfo u where u.certificateId=" + "'" + id + "'" + typeSql);
		logger.info("end getUserInfoByCert.[ id =" + WebUtil.getLogBasicString() + "]");

		if (userInfos != null && userInfos.size() > 0) {
			return userInfos.get(0);
		} else {
			throw new OperationException("No UserInfo Found!");
		}
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public UserInfo getUserInfoById(Long id) {
		logger.info("begin getUserInfoById id = [" + id + "]");
		UserInfo userInfo = (UserInfo) dao.getObject(UserInfo.class, id);
		logger.info("end getUserInfoById.[ id =" + WebUtil.getLogBasicString() + "]");
		if (userInfo != null) {
			return userInfo;
		} else {
			throw new OperationException("No UserInfo Found!");
		}
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public UserInfo getUserInfoByName(String name) {
		logger.info("begin getUserInfoByName. name= [" + name + "");
		List<UserInfo> userInfos = dao.find("from UserInfo u where u.name=" + "'" + name + "'");
		logger.info("end getUserInfoByName.[ id =" + WebUtil.getLogBasicString() + "]");
		if (userInfos.size() > 0) {
			return userInfos.get(0);
		} else {
			throw new OperationException("No UserInfo Found!");
		}
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public UserInfo updateUserInfo(UserInfo userInfo) {
		logger.info("begin updateuserInfo.  id = [" + userInfo.getId() + "]");
		// WebUtil.prepareUpdateParams(userInfo);
		userInfo = (UserInfo) dao.update(userInfo);
		logger.info("end updateUserInfo.[ id =" + WebUtil.getLogBasicString() + "]");
		return userInfo;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public UserInfoForListVO getUserInfoVOById(String id) {
		logger.info("begin getUserInfoVOById. id= [" + id + "");
		Long ownerId = -2L;
		String hql = "select new com.zqw.bss.vo.crm.UserInfoForListVO("
				+ " ui.id,ui.name,ui.telephone)  from UserInfo ui where ownerId=" + ownerId + " and id=" + id
				+ " order by ui.createDate desc ";
		List<UserInfoForListVO> ui = (List<UserInfoForListVO>) dao.find(hql);
		logger.info("end getUserInfoByName.[ id =" + WebUtil.getLogBasicString() + "]");
		return ui.get(0);
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<UserInfoForListVO> getAllListUserInfo() {
		Long ownerId = -2L;
		String hql = "select new com.zqw.bss.vo.crm.UserInfoForListVO("
				+ "ui.id,ui.name,ui.telephone)  from UserInfo ui where ownerId=" + ownerId
				+ " order by ui.createDate desc ";
		List<UserInfoForListVO> ui = (List<UserInfoForListVO>) dao.find(hql);
		logger.info("end getAllListUserInfo.[ id =" + WebUtil.getLogBasicString() + "]");
		return ui;
	}

}
