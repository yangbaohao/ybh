package com.zqw.bss.service.sale.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sale.SalesAgentLebal;
import com.zqw.bss.service.sale.SalesAgentLebalService;

@Service
@Qualifier("salesAgentLebalService")
@SuppressWarnings("unchecked")
public class SalesAgentLebalServiceImpl implements SalesAgentLebalService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean createSalesAgentLebal(List<SalesAgentLebal> salesAgentLebal) {
		logger.info("begin createSalesAgentLebal.");
		for (SalesAgentLebal sa : salesAgentLebal) {
			List<SalesAgentLebal> list = dao.find(" FROM SalesAgentLebal");
			Boolean lebal=true;
			for (SalesAgentLebal ss : list) {
				if (ss.getLebal().equals(sa.getLebal())) {
					lebal=false;
				}
			}
			if (lebal.equals(true)) {
				dao.save(sa);
			}
		}
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateSalesAgentLebal(SalesAgentLebal salesAgentLebal, Long ownerId) {
		logger.info("begin updateSalesAgentLebal.");
		SalesAgent salesAgent = (SalesAgent) dao.getObject(SalesAgent.class,ownerId);
		salesAgent.setLebal(salesAgentLebal.getLebal());
		dao.update(salesAgent);
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<SalesAgentLebal> getAllSalesAgentLebal() {
		logger.info("begin getAllSalesAgentLebal.");
		List<SalesAgentLebal> list = dao.find(" FROM SalesAgentLebal");
		return list;
	}
	

}
