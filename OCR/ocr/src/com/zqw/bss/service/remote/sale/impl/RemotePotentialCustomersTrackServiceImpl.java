package com.zqw.bss.service.remote.sale.impl;

import java.text.ParseException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.PotentialCustomersTrack;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.remote.sale.RemotePotentialCustomersTrackService;
import com.zqw.bss.service.sale.PotentialCustomersTrackService;
import com.zqw.bss.util.WebUtil;

public class RemotePotentialCustomersTrackServiceImpl implements RemotePotentialCustomersTrackService{
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected PotentialCustomersTrackService potentialCustomersTrackService;
	
	protected DAO dao;
	
	@Autowired
	public void setPotentialCustomersTrackService(PotentialCustomersTrackService potentialCustomersTrackService) {
		this.potentialCustomersTrackService = potentialCustomersTrackService;
	}
	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Override
	public PotentialCustomersTrack savePotentialCustomersTrack(PotentialCustomersTrack potentialCustomersTrack) {
		logger.info("begin savePotentialCustomersTrack. id = ["+potentialCustomersTrack.getId()+"]");
		return potentialCustomersTrackService.savePotentialCustomersTrack(potentialCustomersTrack);
	}

	@Override
	public Boolean updatePotentialCustomersTrack(PotentialCustomersTrack potentialCustomersTrack) {
		logger.info("begin updatePotentialCustomersTrack. id = ["+potentialCustomersTrack.getId()+"]");
		return potentialCustomersTrackService.updatePotentialCustomersTrack(potentialCustomersTrack);
	}

	@Override
	public Boolean deletePotentialCustomersTrack(Long id) {
		logger.info("begin deletePotentialCustomersTrack. id = ["+id+"]");
		return potentialCustomersTrackService.deletePotentialCustomersTrack(id);
	}

	@Override
	public BaseModelList<PotentialCustomersTrack> getPagePotentialCustomersTrack(String query) {
		logger.info("begin getPagePotentialCustomersTrack");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return potentialCustomersTrackService.getPagePotentialCustomersTrack(bso);
	}

	@Override
	public PotentialCustomersTrack getPotentialCustomersTrackById(Long id) {
		logger.info("begin getPotentialCustomersTrackById. id = ["+id+"]");
		return potentialCustomersTrackService.getPotentialCustomersTrackById(id);
	}

	@Override
	public List<PotentialCustomersTrack> getTrackByPotentialCustomersId(String potentialCustomersId) throws ParseException {
		logger.info("begin  getTrackByPotentialCustomersId.");
		List<PotentialCustomersTrack> list = WebUtil.getEntryListFromProxyList(potentialCustomersTrackService.getTrackByPotentialCustomersId(potentialCustomersId), dao);
		logger.info("begin  getTrackByPotentialCustomersId:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	
}
