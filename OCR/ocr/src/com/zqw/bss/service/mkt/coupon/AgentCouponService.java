package com.zqw.bss.service.mkt.coupon;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.mkt.AgentCoupon;

public interface AgentCouponService {

	Boolean saveAgentCoupon(AgentCoupon coupon);

	Boolean updateAgentCoupon(AgentCoupon coupon);

	Object getCouponById(Long id);

	Boolean deleteAgentCoupon(Long id);

	BaseModelList<AgentCoupon> getAllCouponByPage(BasePagerObject bso);

}
