package com.zqw.bss.service.sale.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.PriceStrategy;
import com.zqw.bss.model.sale.ShortMessage;
import com.zqw.bss.service.sale.PriceStrategyService;
import com.zqw.bss.util.WebUtil;
@Service
@Qualifier("priceStrategyService")
@SuppressWarnings("unchecked")
public class PriceStrategyServiceImpl implements PriceStrategyService {

	@Autowired
	protected DAO dao;
	
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<PriceStrategy> getPagePriceStrategy(BasePagerObject bso) {
		List<PriceStrategy> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, PriceStrategy.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, PriceStrategy.class));
		BaseModelList<PriceStrategy> lists = new BaseModelList<PriceStrategy>(count, WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public PriceStrategy getPriceStrategyById(Long id) {
		PriceStrategy pro = (PriceStrategy) dao.getObject(PriceStrategy.class, id);
		return pro;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean savePriceStrategy(PriceStrategy priceStrategy) {
		PriceStrategy poten=(PriceStrategy)dao.save(priceStrategy);
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updatePriceStrategy(PriceStrategy priceStrategy) {
		dao.update(priceStrategy);
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deletePriceStrategy(Long id) {
		Object[] param=new Object[1];
		param[0]=id;
		dao.executeHql("delete from PriceStrategy ar where ar.id=?", param);
		return true;
	}

}
