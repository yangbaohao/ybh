package com.zqw.bss.service.sale;


import java.math.BigDecimal;
import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.billing.BillingRecord;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.sale.AgentRevenue;
import com.zqw.bss.vo.billing.CommissionVO;
import com.zqw.bss.vo.sale.AgentRevenueDetailsVo;

public interface AgentRevenueService {

	/**
	 * 添加代理收益记录
	 * @param orderPay	订单支付信息
	 * @param agentRevenue	代理收益
	 * @return
	 */
	public Boolean saveAgentRevenue(AgentRevenue agentRevenue);
	
	/**
	 * 修改代理收益记录
	 * @param orderPay 订单支付信息
	 * @param agentRevenue 代理收益
	 * @return
	 */
	public Boolean updateAgentRevenue(AgentRevenue agentRevenue);
	
	/**
	 * 删除代理收益记录
	 * @param id 主键id
	 * @return
	 */
	public Boolean deleteAgentRevenue(Long id);
	/**
	 * 分页代理收益记录
	 * @param bso
	 * @return
	 */
	public BaseModelList<CommissionVO> getPageAgentRevenue(BasePagerObject bso);
	
	/**
	 * id获取代理收益记录
	 * @param id
	 * @return
	 */
	public AgentRevenue getAgentRevenueById(Long id);
	
	/**
	 * 获得当前代理商的 应提 已提 未提 总和
	 */
	public CommissionVO getAgentRevenueTotal(Long id);
	/**
	 * 不分页获得代理收益记录
	 */
	public List<CommissionVO> getAgentRevenueAll(Long id);
	
	/**
	 * 提交佣金申请
	 */
	public Boolean updateAgentRevenueApply(List<AgentRevenue> agentRevenue);
	
//	/**
//	 * 申请通过
//	 */
//	public Boolean examinePaid(AgentRevenue agentRevenue);
//	/**
//	 * 审批拒绝
//	 * @param agentRevenue
//	 * @return
//	 */
//	public Boolean examineNotpaid(AgentRevenue agentRevenue);
	/**
	 * 审批
	 */
	public Boolean examine(AgentRevenue agentRevenue,String name);
	
	/**
	 *自动结算佣金 
	 *
	 */
	public void computeAgentRevenue(Owner owner,BigDecimal billingRecord,AccountOrderPay accountOrderPay);

	/**
	 *佣金详情 
	 */
	public BaseModelList<AgentRevenueDetailsVo> getAgentRevenueDetails(String code,BasePagerObject bso);
}
