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
import com.zqw.bss.model.sale.PotentialCustomersTrack;
import com.zqw.bss.service.sale.PotentialCustomersTrackService;
import com.zqw.bss.util.WebUtil;
@Service
@Qualifier("potentialCustomersTrackService")
public class PotentialCustomersTrackServiceImpl implements PotentialCustomersTrackService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public PotentialCustomersTrack savePotentialCustomersTrack(PotentialCustomersTrack potentialCustomersTrack) {
		logger.info("begin savePotentialCustomersTrack.");
		PotentialCustomersTrack potTrack=(PotentialCustomersTrack)dao.save(potentialCustomersTrack);
		/*Object[] param=new Object[2];
		param[0]=potentialCustomersTrack.getPotentialCustomers().getId();
		param[1]=potTrack.getId();
		dao.executeSql("update t_bss_potential_customers_track ar SET ar.potential_customers_id =? where ar.id=?", param);*/
		logger.info("end savePotentialCustomersTrack[ id =" + WebUtil.getLogBasicString() + "]");
		return potTrack;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updatePotentialCustomersTrack(PotentialCustomersTrack potentialCustomersTrack) {
		logger.info("begin updatePotentialCustomersTrack.");
		Object[] param=new Object[7];
		param[0]=potentialCustomersTrack.getComment();
		param[1]=potentialCustomersTrack.getCreateDate();
		param[2]=potentialCustomersTrack.getCreateBy();
		param[3]=potentialCustomersTrack.getLastUpdateDate();
		param[4]=potentialCustomersTrack.getLastUpdateBy();
		param[5]=potentialCustomersTrack.getId();
		dao.executeHql("update PotentialCustomersTrack pt set pt.comment=? , pt.createDate=? , pt.createBy=? , pt.lastUpdateDate=? , pt.lastUpdateBy=? where pt.id=?", param);
		logger.info("end updatePotentialCustomersTrack[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deletePotentialCustomersTrack(Long id) {
		logger.info("begin deletePotentialCustomersTrack.");
		Object[] param=new Object[1];
		param[0]=id;
		dao.executeHql("delete from PotentialCustomersTrack ar where ar.id=?", param);
		logger.info("end deletePotentialCustomersTrack[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<PotentialCustomersTrack> getPagePotentialCustomersTrack(BasePagerObject bso) {
		List<PotentialCustomersTrack> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, PotentialCustomersTrack.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, PotentialCustomersTrack.class));
		BaseModelList<PotentialCustomersTrack> lists = new BaseModelList<PotentialCustomersTrack>(count, WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public PotentialCustomersTrack getPotentialCustomersTrackById(Long id) {
		logger.info("begin getPotentialCustomersTrackById. id = [" + id + "]");
		PotentialCustomersTrack pro = (PotentialCustomersTrack) dao.getObject(PotentialCustomersTrack.class, id);
		logger.info("end getPotentialCustomersTrackById:[ id =" + WebUtil.getLogBasicString() + "]");
		return pro;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<PotentialCustomersTrack> getTrackByPotentialCustomersId(String potentialCustomersId) {
		Object[] param=new Object[1];
		param[0]=potentialCustomersId;
		List<PotentialCustomersTrack>  tracks= dao.find("from PotentialCustomersTrack pct where potential_customers_id = ?", param);
		return tracks;
	}

	
}
