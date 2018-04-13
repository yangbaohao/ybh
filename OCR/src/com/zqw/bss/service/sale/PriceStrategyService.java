package com.zqw.bss.service.sale;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.PriceStrategy;

public interface PriceStrategyService {

	BaseModelList<PriceStrategy> getPagePriceStrategy(BasePagerObject bso);

	PriceStrategy getPriceStrategyById(Long id);

	Boolean savePriceStrategy(PriceStrategy priceStrategy);

	Boolean updatePriceStrategy(PriceStrategy priceStrategy);

	Boolean deletePriceStrategy(Long id);

}
