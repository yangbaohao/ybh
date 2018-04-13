package com.zqw.bss.service.mkt.coupon.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.mkt.AgentCoupon;
import com.zqw.bss.service.mkt.coupon.AgentCouponService;
import com.zqw.bss.service.sale.SalesAgentService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

@Service
@Qualifier("agentCouponService")
public class AgentCouponServiceImpl implements AgentCouponService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;
	
	@Autowired
	private SalesAgentService salesAgentService;
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveAgentCoupon(AgentCoupon coupon) {
		coupon.setSalesAgent(salesAgentService.getSalesAgentById(coupon.getSalesAgent().getId()));
		Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		coupon.setOwnerId(id);
		dao.save(coupon);
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAgentCoupon(AgentCoupon coupon) {
		dao.update(coupon);
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AgentCoupon getCouponById(Long id) {
		AgentCoupon coupon = (AgentCoupon) dao.getObject(AgentCoupon.class, id);
		if (coupon != null) {
			return coupon;
		} else {
			throw new OperationException("No Coupon Found!");
		}
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteAgentCoupon(Long id) {
		Boolean flag = false;
		try {
			dao.removeObject(AgentCoupon.class, id);
			flag = true;
		} catch (Exception e) {
		}
		return flag;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AgentCoupon> getAllCouponByPage(BasePagerObject bso) {
		List<AgentCoupon> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, AgentCoupon.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, AgentCoupon.class));
		BaseModelList<AgentCoupon> lists = new BaseModelList<AgentCoupon>(count, WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	
}
