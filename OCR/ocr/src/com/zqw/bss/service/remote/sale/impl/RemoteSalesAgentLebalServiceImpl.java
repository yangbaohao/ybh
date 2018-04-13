package com.zqw.bss.service.remote.sale.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.sale.SalesAgentLebal;
import com.zqw.bss.service.remote.sale.RemoteSalesAgentLebalService;
import com.zqw.bss.service.sale.SalesAgentLebalService;
import com.zqw.bss.util.WebUtil;
@SuppressWarnings("unchecked")
public class RemoteSalesAgentLebalServiceImpl implements RemoteSalesAgentLebalService {

	@Autowired
	protected DAO dao;
	
	@Autowired
	private SalesAgentLebalService salesAgentLebalService;
	
	@Override
	public Boolean createSalesAgentLebal(List<SalesAgentLebal> salesAgentLebal) {
		// TODO Auto-generated method stub
		return salesAgentLebalService.createSalesAgentLebal(salesAgentLebal);
	}

	@Override
	public Boolean updateSalesAgentLebal(SalesAgentLebal salesAgentLebal, Long ownerId) {
		// TODO Auto-generated method stub
		return salesAgentLebalService.updateSalesAgentLebal(salesAgentLebal,ownerId);
	}

	@Override
	public List<SalesAgentLebal> getAllSalesAgentLebal() {
		// TODO Auto-generated method stub
		return salesAgentLebalService.getAllSalesAgentLebal();
	}

}
