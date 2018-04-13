package com.zqw.bss.service.billing;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AgentRequestPay;

public interface AgentRequestPayService {
	/**
	 * Save AgentRequestPay
	 * @param AgentRequestPay
	 *            agentRequestPay
	 * @return AgentRequestPay
	 */
	public AgentRequestPay saveAgentRequestPay(AgentRequestPay agentRequestPay);
	/**
	 * Del AgentRequestPay
	 * @param Long
	 *            agentRequestPayId
	 * 
	 * @return Boolean
	 */
	public Boolean delAgentRequestPayById(Long agentRequestPayId);
	/**
	 * update AgentRequestPay
	 * @param AgentRequestPay
	 *            agentRequestPay
	 * 
	 * @return Boolean
	 */
	public Boolean updateAgentRequestPay(AgentRequestPay agentRequestPay);
	/**
	 * get AgentRequestPay By Id
	 * @param Long
	 *            agentRequestPay
	 * 
	 * @return AgentRequestPay
	 */
	public AgentRequestPay getAgentRequestPayById(Long agentRequestPayId);
	/**
	 * find AgentRequestPay
	 * @param BasePagerObject condition
	 * 
	 * @return BaseModelList<AgentRequestPay>
	 */
	public BaseModelList<AgentRequestPay> findAgentRequestPay(BasePagerObject condition);
}
