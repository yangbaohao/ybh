package com.zqw.bss.service.remote.sale.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.service.remote.sale.RemotePotentialTrackService;
import com.zqw.bss.service.sale.PotentialTrackService;

public class RemotePotentialTrackServiceImpl implements RemotePotentialTrackService{
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	public PotentialTrackService potentialTrackService;
	
	@Override
	public PotentialTrack savePotentialTrack(PotentialTrack potentialTrack) {
		logger.info("begin savePotentialTrack. id = ["+potentialTrack.getId()+"]");
		return potentialTrackService.savePotentialTrack(potentialTrack);
	}

	@Override
	public Boolean updatePotentialTrack(PotentialTrack potentialTrack) {
		logger.info("begin updatePotentialTrack. id = ["+potentialTrack.getId()+"]");
		return potentialTrackService.updatePotentialTrack(potentialTrack);
	}

	@Override
	public Boolean deletePotentialTrack(Long id) {
		logger.info("begin deletePotentialTrack. id = ["+id+"]");
		return potentialTrackService.deletePotentialTrack(id);
	}

	@Override
	public BaseModelList<PotentialTrack> getPagePotentialTrack(String query) {
		logger.info("begin getPagePotentialTrack");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return potentialTrackService.getPagePotentialTrack(bso);
	}

	@Override
	public PotentialTrack getPotentialTrackById(Long id) {
		logger.info("begin getPotentialTrackById. id = ["+id+"]");
		return potentialTrackService.getPotentialTrackById(id);
	}

	
}
