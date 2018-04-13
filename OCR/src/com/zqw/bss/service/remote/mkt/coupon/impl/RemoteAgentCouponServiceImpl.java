package com.zqw.bss.service.remote.mkt.coupon.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.mkt.AgentCoupon;
import com.zqw.bss.service.mkt.coupon.AgentCouponService;
import com.zqw.bss.service.remote.mkt.coupon.RemoteAgentCouponService;
import com.zqw.bss.util.WebUtil;

public class RemoteAgentCouponServiceImpl implements RemoteAgentCouponService{

	@Autowired
	private AgentCouponService agentCouponService;
	
	@Override
	public Boolean saveAgentCoupon(AgentCoupon coupon) {
		return agentCouponService.saveAgentCoupon(coupon);
	}

	@Override
	public Boolean updateAgentCoupon(AgentCoupon coupon) {
		return agentCouponService.updateAgentCoupon(coupon);
	}

	@Override
	public AgentCoupon getCouponById(Long id) {
		 return (AgentCoupon)
				 WebUtil.getEntryFromProxyObj(agentCouponService.getCouponById(id));
	}

	@Override
	public Boolean deleteAgentCoupon(Long id) {
		return agentCouponService.deleteAgentCoupon(id);
	}

	@Override
	public BaseModelList<AgentCoupon> getAllAgentCouponByPage(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		 BasePagerObject bso = HsqlUtil.toPager(request);
		 return agentCouponService.getAllCouponByPage(bso);
	}

	
}
