package com.zqw.bss.service.remote.sale.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.sale.PromotionalCopy;
import com.zqw.bss.service.remote.sale.RemotePromotionalCopyService;
import com.zqw.bss.service.sale.PromotionalCopyService;

public class RemotePromotionalCopyServiceImpl implements RemotePromotionalCopyService{
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;
	
	@Autowired
	protected PromotionalCopyService promotionalCopyService;
	
	@Override
	public Boolean savePromotionalCopy(PromotionalCopy promotionalCopy) {
		logger.info("begin savePromotionalCopy. id = ["+promotionalCopy.getId()+"]");
		return promotionalCopyService.savePromotionalCopy(promotionalCopy);
	}

	@Override
	public Boolean updatePromotionalCopy(PromotionalCopy promotionalCopy) {
		logger.info("begin updatePromotionalCopy. id = ["+promotionalCopy.getId()+"]");
		return promotionalCopyService.updatePromotionalCopy(promotionalCopy);
	}

	@Override
	public List<PromotionalCopy> getAllPromotionalCopy() {
		logger.info("begin getAllPromotionalCopy");
		return promotionalCopyService.getAllPromotionalCopy();
	}

	@Override
	public Boolean delPromotionalCopy(Long id) {
		logger.info("begin delPromotionalCopy. id = ["+id+"]");
		return promotionalCopyService.delPromotionalCopy(id);
	}

	@Override
	public PromotionalCopy getPromotionalCopyById(Long id) {
		logger.info("begin getPromotionalCopyById. id = ["+id+"]");
		return promotionalCopyService.getPromotionalCopyById(id);
	}

}
