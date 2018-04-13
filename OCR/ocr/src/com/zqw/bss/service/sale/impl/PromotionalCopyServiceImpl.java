package com.zqw.bss.service.sale.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.sale.PromotionalCopy;
import com.zqw.bss.service.sale.PromotionalCopyService;

@Service
@Qualifier("promotionalCopyService")
@SuppressWarnings("unchecked")
public class PromotionalCopyServiceImpl implements PromotionalCopyService{
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean savePromotionalCopy(PromotionalCopy promotionalCopy) {
		logger.info("begin savePromotionalCopy.");
		dao.save(promotionalCopy);
		logger.info("end savePromotionalCopy.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updatePromotionalCopy(PromotionalCopy promotionalCopy) {
		logger.info("begin updatePromotionalCopy.");
		dao.update(promotionalCopy);
		logger.info("end updatePromotionalCopy.");
		return null;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<PromotionalCopy> getAllPromotionalCopy() {
		logger.info("begin updatePromotionalCopy.");
		List<PromotionalCopy> list = dao.find("from PromotionalCopy");
		logger.info("end updatePromotionalCopy.");
		return list;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delPromotionalCopy(Long id) {
		logger.info("begin delPromotionalCopy.");
		dao.removeObject(PromotionalCopy.class, id);
		logger.info("end delPromotionalCopy.");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public PromotionalCopy getPromotionalCopyById(Long id) {
		logger.info("begin getPromotionalCopyById.");
		PromotionalCopy promotionalCopy =(PromotionalCopy)dao.getObject(PromotionalCopy.class, id);
		logger.info("end getPromotionalCopyById.");
		return promotionalCopy;
	}

}
