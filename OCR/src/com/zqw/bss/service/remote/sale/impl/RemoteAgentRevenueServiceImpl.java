package com.zqw.bss.service.remote.sale.impl;


import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.AgentRevenue;
import com.zqw.bss.service.remote.sale.RemoteAgentRevenueService;
import com.zqw.bss.service.sale.AgentRevenueService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.billing.CommissionVO;
import com.zqw.bss.vo.sale.AgentRevenueDetailsVo;

public class RemoteAgentRevenueServiceImpl implements RemoteAgentRevenueService{
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected AgentRevenueService agentRevenueService;
	
	@Override
	public Boolean saveAgentRevenue(AgentRevenue agentRevenue) {
		logger.info("begin saveAgentRevenue. id = ["+agentRevenue.getId()+"]");
		return agentRevenueService.saveAgentRevenue(agentRevenue);
	}

	@Override
	public Boolean updateAgentRevenue(AgentRevenue agentRevenue) {
		logger.info("begin updateAgentRevenue. id = ["+agentRevenue.getId()+"]");
		return agentRevenueService.updateAgentRevenue(agentRevenue);
	}

	@Override
	public Boolean deleteAgentRevenue(Long id) {
		logger.info("begin deleteAgentRevenue. id = ["+id+"]");
		return agentRevenueService.deleteAgentRevenue(id);
	}

	@Override
	public BaseModelList<CommissionVO> getPageAgentRevenue(String query) {
		logger.info("begin getPageAgentRevenue");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return agentRevenueService.getPageAgentRevenue(bso);
	}
	
	@Override
	public BaseModelList<AgentRevenueDetailsVo> getAgentRevenueDetails(String code,String query) {
		logger.info("begin getAgentRevenueDetails");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return agentRevenueService.getAgentRevenueDetails(code,bso);
	}

	@Override
	public AgentRevenue getAgentRevenueById(Long id) {
		logger.info("begin getAgentRevenueById. id = ["+id+"]");
		return agentRevenueService.getAgentRevenueById(id);
	}

	@Override
	public CommissionVO getAgentRevenueTotal() {
		// TODO Auto-generated method stub
		logger.info("begin getAgentRevenueTotal");
		Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		return agentRevenueService.getAgentRevenueTotal(id);
	}

	@Override
	public List<CommissionVO> getAgentRevenueAll() {
		// TODO Auto-generated method stub
		logger.info("begin getAgentRevenueAll");
		Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		return agentRevenueService.getAgentRevenueAll(id);
	}

	@Override
	public Boolean updateAgentRevenueApply(List<AgentRevenue> agentRevenue) {
		// TODO Auto-generated method stub
		logger.info("begin updateAgentRevenueApply");
		return agentRevenueService.updateAgentRevenueApply(agentRevenue);
	}

	@Override
	public Boolean examine(AgentRevenue agentRevenue) {
		// TODO Auto-generated method stub
		logger.info("begin examine");
		String name = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		return agentRevenueService.examine(agentRevenue,name);
	}

//	@Override
//	public Boolean examinePaid(AgentRevenue agentRevenue) {
//		// TODO Auto-generated method stub
//		return agentRevenueService.examinePaid(agentRevenue);
//	}
//
//	@Override
//	public Boolean examineNotpaid(AgentRevenue agentRevenue) {
//		// TODO Auto-generated method stub
//		return agentRevenueService.examineNotpaid(agentRevenue);
//	}

	
}
