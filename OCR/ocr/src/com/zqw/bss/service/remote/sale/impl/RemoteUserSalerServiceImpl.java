package com.zqw.bss.service.remote.sale.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.ws.rs.PathParam;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;


import com.zqw.bss.model.sale.UserSaler;

import com.zqw.bss.service.remote.sale.RemoteUserSalerService;
import com.zqw.bss.service.sale.UserSalerService;


public class RemoteUserSalerServiceImpl implements RemoteUserSalerService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected UserSalerService userSalerService;

	@Override
	public List<UserSaler> getAllUsersaler(String type) {
		logger.info("begin getAllUsersaler");
		List<UserSaler> list=userSalerService.getAllUsersaler(type);
		logger.info("end getAllUsersaler");
		return list;
	}

	@Override
	public Boolean saveUserSaler(List<UserSaler> users,String type) {
		logger.info("begin saveVoucher");
		Boolean bo=userSalerService.saveUserSaler(users,type);
		logger.info("end saveVoucher");
		return bo;
	}

	
	





}
