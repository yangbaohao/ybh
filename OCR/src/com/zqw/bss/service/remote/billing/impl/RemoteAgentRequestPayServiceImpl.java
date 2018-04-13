package com.zqw.bss.service.remote.billing.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.AgentRequestPay;
import com.zqw.bss.service.billing.AgentRequestPayService;
import com.zqw.bss.service.remote.billing.RemoteAgentRequestPayService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

public class RemoteAgentRequestPayServiceImpl implements RemoteAgentRequestPayService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Autowired
	private AgentRequestPayService agentRequestPayService;

	@Override
	public AgentRequestPay saveAgentRequestPay(AgentRequestPay agentRequestPay) {
		// TODO Auto-generated method stub
		logger.info("begin saveAgentRequestPay. id  = [" + agentRequestPay.getId() + "]");
		return agentRequestPayService.saveAgentRequestPay(agentRequestPay);
	}

	@Override
	public Boolean delAgentRequestPayById(Long agentRequestPayId) {
		// TODO Auto-generated method stub
		logger.info("begin delAgentRequestPayById. id =["+agentRequestPayId+"]");
		return agentRequestPayService.delAgentRequestPayById(agentRequestPayId);
	}

	@Override
	public Boolean updateAgentRequestPay(AgentRequestPay agentRequestPay) {
		// TODO Auto-generated method stub
		logger.info("begin updateAgentRequestPay. id =["+agentRequestPay+"]");
		return agentRequestPayService.updateAgentRequestPay(agentRequestPay);
	}

	@Override
	public AgentRequestPay getAgentRequestPayById(Long agentRequestPayId) {
		// TODO Auto-generated method stub
		logger.info("begin getAgentRequestPayById. id = ["+agentRequestPayId+"]");
		return agentRequestPayService.getAgentRequestPayById(agentRequestPayId);
	}

	@Override
	public BaseModelList<AgentRequestPay> findAgentRequestPay(String query) {
		// TODO Auto-generated method stub
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		bso.setSortdatafield("lastUpdateDate");
		bso.setSortorder("desc");
		Condition con = new Condition();
		con.setAction("eq");
		con.setKey("ownerId");
		String[] str = new String[] { String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID)) };
		con.setValue(str);
		bso.condition.add(con);
		logger.info(bso);
		BaseModelList<AgentRequestPay> agentRequestPay = agentRequestPayService.findAgentRequestPay(bso);
		logger.info("end  findAgentRequestPay:[ id =" + WebUtil.getLogBasicString() + "]");
		return agentRequestPay;
	}	

}
