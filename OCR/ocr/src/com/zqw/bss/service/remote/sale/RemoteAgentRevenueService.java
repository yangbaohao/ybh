package com.zqw.bss.service.remote.sale;


import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.model.sale.AgentRevenue;
import com.zqw.bss.vo.billing.CommissionVO;
import com.zqw.bss.vo.sale.AgentRevenueDetailsVo;
@Path("/agentrevenue")
public interface RemoteAgentRevenueService {

	/**
     * 分页获取代理收益
     * @param query
     * @return BaseModelList<AgentRevenue>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<CommissionVO> getPageAgentRevenue(@PathParam("query") String query);
	
	/**
     * id获取代理收益
     * @param id
     * @return AgentRevenue
     */
	@GET
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public AgentRevenue getAgentRevenueById(@PathParam("id")Long id);
	
	/**
     * 获取代理收益详情
     * @param id
     * @return AgentRevenue
     */
	@GET
	@Path("/agentrevenuedetails/{code}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<AgentRevenueDetailsVo> getAgentRevenueDetails(@PathParam("code")String code,@PathParam("query")String query);
	
	/**
	 * 添加代理收益记录
	 * @param orderPay	订单支付信息
	 * @param agentRevenue	代理收益
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean saveAgentRevenue(AgentRevenue agentRevenue);
	
	/**
	 * 修改代理收益记录
	 * @param orderPay 订单支付信息
	 * @param agentRevenue 代理收益
	 * @return
	 */
	@PUT
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateAgentRevenue(AgentRevenue agentRevenue);
	
	/**
	 * 删除代理收益记录
	 * @param id 主键id
	 * @return
	 */
	@DELETE
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deleteAgentRevenue(@PathParam("id")Long id);
	
	/**
	 * 获得当前代理商的 应提 已提 未提 总和
	 * @return
	 */
	@GET
	@Path("/total")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public CommissionVO getAgentRevenueTotal();
	
	/**
	 * 不分页获得代理商手机记录
	 * @return
	 */
	@GET
	@Path("/agentrevenueall")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<CommissionVO> getAgentRevenueAll();
	/**
	 * 提交佣金申请
	 */
	@POST
	@Path("/updateagentrevenueapply")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateAgentRevenueApply(List<AgentRevenue> agentRevenue);
//	/**
//	 * 通过申请
//	 * @param agentRevenue
//	 * @return
//	 */
//	@POST
//	@Path("/examinePaid")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Boolean examinePaid(AgentRevenue agentRevenue);
//	/**
//	 * 审批拒绝
//	 */
//	@POST
//	@Path("/examineNotpaid")
//	@Consumes(MediaTypes.JSON_UTF_8)
//	@Produces(MediaTypes.JSON_UTF_8)
//	public Boolean examineNotpaid(AgentRevenue agentRevenue);
	/**
	 * 审批佣金
	 */
	@POST
	@Path("/examine")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean examine(AgentRevenue agentRevenue);
}
