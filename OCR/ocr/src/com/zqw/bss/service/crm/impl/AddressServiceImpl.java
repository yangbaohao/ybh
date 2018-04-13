package com.zqw.bss.service.crm.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.crm.Address;
import com.zqw.bss.model.crm.UserInfo;
import com.zqw.bss.service.crm.AddressService;
import com.zqw.bss.util.WebUtil;

@SuppressWarnings("unchecked")
@Service
@Qualifier("addressService")
public class AddressServiceImpl implements AddressService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected DAO dao;

	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Long createAddress(Long id, Address address) {
		logger.info("begin createAddress.");
		List<UserInfo> userInfolist = dao.find("from UserInfo where id = ?", id);
		UserInfo userInfo = userInfolist.get(0);
		if (userInfo.getAddress() != null) {
			userInfo.getAddress().add(address);
		} else {
			List<Address> list = new ArrayList<Address>();
			list.add(address);
			userInfo.setAddress(list);
		}
		Address add = (Address) dao.save(address);
		UserInfo user = (UserInfo) dao.update(userInfo);

		logger.info("end  createAddress:[ id =" + WebUtil.getLogBasicString() + "]");
		if (user != null) {
			return add.getId();
		}
		return null;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAddress(Address address) {
		logger.info("begin updAddress.");
		Address add = (Address) dao.update(address);
		logger.info("end updAddress.[ id =" + WebUtil.getLogBasicString() + "]");
		if (add != null) {
			return true;
		}
		return false;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delAddress(Long id) {
		// TODO Auto-generated method stub
		logger.info("begin delAddress.");
		Boolean flag = false;
		try {
			dao.removeObject(Address.class, id);
			flag = true;
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("end delAddress.[ id =" + WebUtil.getLogBasicString() + "]");
		return flag;
	}

}
