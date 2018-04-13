package com.zqw.bss.service.remote.crm.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.crm.Address;
import com.zqw.bss.service.crm.AddressService;
import com.zqw.bss.service.remote.crm.RemoteAddressService;
public class RemoteAddressServiceImpl implements RemoteAddressService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected DAO dao;

	protected AddressService addressService;

	@Autowired
	public void setAddressService(AddressService addressService) {
		this.addressService = addressService;
	}

	@Override
	public Long createAddress(Long id, Address address) {
		logger.info("begin createAddress");
		return addressService.createAddress(id, address);
	}

	@Override
	public Boolean updateAddress(Address address) {
		logger.info("begin updateAddress");
		return addressService.updateAddress(address);
	}

	@Override
	public Boolean delAddress(Long id) {
		logger.info("begin delAddress");
		return addressService.delAddress(id);
	}
	

}
