package com.zqw.bss.service.remote.sale;

import java.util.List;
import java.util.Map;

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
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.vo.billing.SalesAgentVo;
import com.zqw.bss.vo.sale.SalesAgentFollowVo;
import com.zqw.bss.vo.sys.OwnerDetailsVo;
@Path("/salesagent")
public interface RemoteSalesAgentService {

	/**
     * 分页获取销售代理
     * @param query
     * @return BaseModelList<SalesAgent>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SalesAgent> getPageSalesAgent(@PathParam("query") String query);
	
	/**
     * 分页获取佣金历史
     * @param query
     * @return BaseModelList<SalesAgent>
     */
	@GET
	@Path("/search/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SalesAgentVo> getPageSalesAgentVo(@PathParam("query") String query);
	
	/**
     * 获取销售代理
     * @return List<SalesAgent>
     */
	@GET
	@Path("/list")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SalesAgent> getListSalesAgent();
	
	/**
     * id获取销售代理
     * @param id
     * @return AgentRevenue
     */
	@GET
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public SalesAgent getSalesAgentById(@PathParam("id")Long id);
	
	/**
	 * 添加销售代理记录
	 * @param personInfo	个人信息
	 * @param salesAgent	销售代理
	 * @return
	 */
	@POST
	@Path("/savephone/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public SalesAgent saveSalesAgentPhone(SalesAgent salesAgent);
	
	/**
	 * 添加销售代理记录
	 * @param personInfo	个人信息
	 * @param salesAgent	销售代理
	 * @return
	 */
	@POST
	@Path("/save/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public SalesAgent saveSalesAgent(SalesAgent salesAgent);
	
	/**
	 * 修改销售代理记录
	 * @param personInfo 个人信息
	 * @param salesAgent 销售代理3
	 * @param state 0不修改密码 1修改密码
	 * @return
	 */
	@PUT
	@Path("/{state}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateSalesAgent(@PathParam("state") String state,SalesAgent salesAgent);
	
	/**
	 * 删除销售代理记录
	 * @param id 主键id
	 * @return
	 */
	@DELETE
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deleteSalesAgent(@PathParam("id")Long id);
	
	/**
	 * 获取注册短信验证码
	 * @param 手机号码
	 * @return 验证码
	 */
	@GET
	@Path("/direct/valid/{phone}/{count}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean getVaildCodeByPhone(@PathParam("phone") String phone, @PathParam("count") Long count)throws Exception;
	
	/**
	 * 用户注册第一步，判断手机与验证码是否匹配
	 * 
	 * @param 验证码 手机号码 
	 * @return 验证码是否正确
	 */
	@GET
	@Path("/direct/valid/verify/{valid}/{phone}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean vaildMsgCodeFirst( @PathParam("valid") String valid,@PathParam("phone") String phone)
			throws Exception;
	
	
	/**
	 * 获取代理商编码
	 * @param 手机号码
	 * @return 验证码
	 */
	@GET
	@Path("/getcode/{type}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public String getSystemCode(@PathParam("type") String type)throws Exception;
	
	/**
	 * 代理商备注跟进分页查询
	 * @return 
	 */
	@GET
	@Path("/follow/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SalesAgentFollowVo> follow(@PathParam("query") String query);
	
	/**
	 * 代理商跟进
	 */
	@POST
	@Path("/comment")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public PotentialTrack savePotentialTrack(PotentialTrack potentialTrack);
	
	/**
	 * 高级代理
	 */
	@GET
	@Path("/senior/true")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SalesAgent> getSeniorTrue();
	
	/**
	 * 普通代理
	 */
	@GET
	@Path("/senior/false")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SalesAgent> getSeniorFalse();
	/**
	 * 所有代理
	 */
	@GET
	@Path("/senior/all")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SalesAgent> getSeniorAll();
	/**
	 * 成功和付费用户详情
	 * 成功 success
	 * 付费 paid
	 * 张沂飞
	 */
	@GET
	@Path("/ownerdetails/{type}/{agentCode}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<OwnerDetailsVo> getOwnerDetails(@PathParam("type") String type,@PathParam("agentCode") String agentCode,@PathParam("query")
	String query);
	
	/**
	 * 拥有代理商
	 * 张沂飞
	 * num 0 销售人员 1客服人员
	 * @param query
	 * @return
	 */
	@GET
	@Path("/have/{num}/{id}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SalesAgent> getHaveSalesAgent(@PathParam("num") String num,@PathParam("id") String id,@PathParam("query") String query);
	
	/**
	 *
	 * @return 
	 */
	@GET
	@Path("/followup/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String, Long> followUp(@PathParam("query") String query);
}
