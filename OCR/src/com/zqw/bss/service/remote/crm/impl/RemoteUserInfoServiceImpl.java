package com.zqw.bss.service.remote.crm.impl;

import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.model.crm.UserInfo;
import com.zqw.bss.service.crm.OwnerService;
import com.zqw.bss.service.crm.UserInfoService;
import com.zqw.bss.service.remote.crm.RemoteUserInfoService;

public class RemoteUserInfoServiceImpl implements RemoteUserInfoService {
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	private UserInfoService userInfoService;
	
	@Autowired
	private OwnerService ownerService;
	
	@Override
	public UserInfo getUserInfoById(String name) {
		logger.info("begin getUserInfoById");
		return userInfoService.getUserInfoByName(name);
	}

	

}
