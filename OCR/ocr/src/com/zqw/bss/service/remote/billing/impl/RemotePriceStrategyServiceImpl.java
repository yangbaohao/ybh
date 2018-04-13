package com.zqw.bss.service.remote.billing.impl;


import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.PriceStrategy;
import com.zqw.bss.service.remote.billing.RemotePriceStrategyService;
import com.zqw.bss.service.sale.PriceStrategyService;

public class RemotePriceStrategyServiceImpl implements RemotePriceStrategyService {

	@Autowired
	protected PriceStrategyService priceStrategyService;
	@Override
	public BaseModelList<PriceStrategy> getPagePriceStrategy(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return priceStrategyService.getPagePriceStrategy(bso);
	}

	@Override
	public PriceStrategy getPriceStrategyById(Long id) {
		return priceStrategyService.getPriceStrategyById(id);
	}

	@Override
	public Boolean savePriceStrategy(PriceStrategy priceStrategy) {
		return priceStrategyService.savePriceStrategy(priceStrategy);
	}

	@Override
	public Boolean updatePriceStrategy(PriceStrategy priceStrategy) {
		return priceStrategyService.updatePriceStrategy(priceStrategy);
	}

	@Override
	public Boolean deletePriceStrategy(Long id) {
		return priceStrategyService.deletePriceStrategy(id);
	}

}
