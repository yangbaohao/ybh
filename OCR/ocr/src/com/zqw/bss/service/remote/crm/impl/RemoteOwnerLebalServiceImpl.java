package com.zqw.bss.service.remote.crm.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.crm.OwnerLebal;
import com.zqw.bss.service.crm.OwnerLebalService;
import com.zqw.bss.service.remote.crm.RemoteOwnerLebalService;
import com.zqw.bss.util.WebUtil;

@SuppressWarnings("unchecked")
public class RemoteOwnerLebalServiceImpl implements RemoteOwnerLebalService{

	@Autowired
	protected DAO dao;
	
	@Autowired
	private OwnerLebalService ownerLebalService;
	
	@Override
	public Boolean createOwnerLebal(List<OwnerLebal> ownerLebal) {
		return ownerLebalService.createOwnerLebal(ownerLebal);
	}

	@Override
	public List<OwnerLebal> getAllOwnerLebalList() {
		return WebUtil.getEntryListFromProxyList(ownerLebalService.getAllOwnerLebalList(), dao);
	}

	@Override
	public Boolean updateOwnerLebal(OwnerLebal ownerLebal, Long ownerId) {
		return ownerLebalService.updateOwnerLebal(ownerLebal, ownerId);
	}

}
