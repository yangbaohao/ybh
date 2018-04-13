package com.zqw.bss.service.sale.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.service.sale.PotentialTrackService;
import com.zqw.bss.util.WebUtil;
@Service
@Qualifier("potentialTrackService")
public class PotentialTrackServiceImpl implements PotentialTrackService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public PotentialTrack savePotentialTrack(PotentialTrack potentialTrack) {
		logger.info("begin savePotentialTrack.");
		PotentialTrack potTrack=(PotentialTrack)dao.save(potentialTrack);
		Object[] param=new Object[2];
		param[0]=potentialTrack.getPotential().getId();
		param[1]=potTrack.getId();
		dao.executeSql("update t_bss_potentialtrack ar SET ar.potential_id =? where ar.id=?", param);
		logger.info("end savePotentialTrack[ id =" + WebUtil.getLogBasicString() + "]");
		return potTrack;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updatePotentialTrack(PotentialTrack potentialTrack) {
		logger.info("begin updatePotentialTrack.");
		Object[] param=new Object[7];
		param[0]=potentialTrack.getComment();
		param[1]=potentialTrack.getPlanDate();
		param[2]=potentialTrack.getCreateDate();
		param[3]=potentialTrack.getCreateBy();
		param[4]=potentialTrack.getLastUpdateDate();
		param[5]=potentialTrack.getLastUpdateBy();
		param[6]=potentialTrack.getId();
		dao.executeHql("update PotentialTrack pt set pt.comment=? , pt.planDate=? , pt.createDate=? , pt.createBy=? , pt.lastUpdateDate=? , pt.lastUpdateBy=? where pt.id=?", param);
		logger.info("end updatePotentialTrack[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deletePotentialTrack(Long id) {
		logger.info("begin deletePotentialTrack.");
		Object[] param=new Object[1];
		param[0]=id;
		dao.executeHql("delete from PotentialTrack ar where ar.id=?", param);
		logger.info("end deletePotentialTrack[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<PotentialTrack> getPagePotentialTrack(BasePagerObject bso) {
		List<PotentialTrack> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, PotentialTrack.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, PotentialTrack.class));
		BaseModelList<PotentialTrack> lists = new BaseModelList<PotentialTrack>(count, WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public PotentialTrack getPotentialTrackById(Long id) {
		logger.info("begin getPotentialTrackById. id = [" + id + "]");
		PotentialTrack pro = (PotentialTrack) dao.getObject(PotentialTrack.class, id);
		logger.info("end getPotentialTrackById:[ id =" + WebUtil.getLogBasicString() + "]");
		return pro;
	}

	
}
