package com.zqw.bss.service.crm.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.OwnerLebal;
import com.zqw.bss.service.crm.OwnerLebalService;

@Service
@Qualifier("ownerLebalService")
@SuppressWarnings("unchecked")
public class OwnerLebalServiceImpl implements OwnerLebalService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean createOwnerLebal(List<OwnerLebal> ownerLebal) {
		logger.info("begin createOwnerLebal.");
		for(OwnerLebal ol : ownerLebal){
			List<OwnerLebal> list =  dao.find(" from OwnerLebal");
			Boolean lebal = true;
			for(OwnerLebal oo:list){
				if(oo.getLebal().equals(ol.getLebal())){
					lebal = false;
				}
			}
			if(lebal.equals(true)){
				dao.save(ol);
			}
		}
		return true;
	}

	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<OwnerLebal> getAllOwnerLebalList() {
		logger.info("begin getAllOwnerLebalList.");
		List<OwnerLebal> list = dao.find("from OwnerLebal");
		return list;
	}


	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateOwnerLebal(OwnerLebal ownerLebal, Long ownerId) {
		logger.info("begin updateOwnerLebal.");
		Owner owner =  (Owner) dao.getObject(Owner.class, ownerId);
		owner.setLebal(ownerLebal.getLebal());
		dao.update(owner);
		return true;
	}

}
