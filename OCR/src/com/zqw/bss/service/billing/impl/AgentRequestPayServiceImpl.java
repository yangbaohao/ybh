package com.zqw.bss.service.billing.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AgentRequestPay;
import com.zqw.bss.service.billing.AgentRequestPayService;
import com.zqw.bss.util.WebUtil;


@Service
@SuppressWarnings({"unchecked" , "unused"})
public class AgentRequestPayServiceImpl implements AgentRequestPayService {

	Logger log = Logger.getLogger(getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public AgentRequestPay saveAgentRequestPay(AgentRequestPay agentRequestPay) {
		// TODO Auto-generated method stub
		log.debug("begin saveAgentRequestPay.");
		AgentRequestPay arp = (AgentRequestPay)dao.save(agentRequestPay);
		return arp;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delAgentRequestPayById(Long agentRequestPayId) {
		// TODO Auto-generated method stub
		Boolean flag = false;
		try {
			dao.removeObject(AgentRequestPay.class, agentRequestPayId);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
			log.debug("del fail Info = " + e.getMessage());
		}
		return flag;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateAgentRequestPay(AgentRequestPay agentRequestPay) {
		// TODO Auto-generated method stub
		log.debug("begin updateAgentRequestPay.");
		AgentRequestPay arp = (AgentRequestPay) dao.update(agentRequestPay);
		log.debug("end  updateAccount.Quotation : [ id =" + arp.getId() + WebUtil.getLogBasicString() + "]");
		if(null != arp && !"".equals(arp) )
			return Boolean.TRUE;
		else
			return Boolean.FALSE;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public AgentRequestPay getAgentRequestPayById(Long agentRequestPayId) {
		// TODO Auto-generated method stub
		AgentRequestPay agentRequestPay = (AgentRequestPay)dao.getObject(AgentRequestPay.class ,agentRequestPayId);
		return agentRequestPay;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AgentRequestPay> findAgentRequestPay(BasePagerObject condition) {
		// TODO Auto-generated method stub
		log.debug("begin findAccount.");
		List<AgentRequestPay> list = dao.getLst4Paging(HsqlUtil.genSearchSql(
				condition, AgentRequestPay.class, null), new int[] {
				condition.getPagenum(),
				condition.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(
				condition, AgentRequestPay.class));
		BaseModelList<AgentRequestPay> lists =new BaseModelList<AgentRequestPay>(count, WebUtil.getEntryListFromProxyList(list, dao));
		log.debug("end findAccount:[ id ="+ WebUtil.getLogBasicString() + "]");
		return null;
	}
	
}
