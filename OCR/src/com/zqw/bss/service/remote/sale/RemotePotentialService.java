package com.zqw.bss.service.remote.sale;



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
import com.zqw.bss.model.sale.Potential;
@Path("/potential")
public interface RemotePotentialService {

	/**
     * 分页获取商机信息
     * @param query
     * @return BaseModelList<Potential>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<Potential> getPagePotential(@PathParam("query") String query);
	
	/**
     * id获取商机信息
     * @param id
     * @return AgentRevenue
     */
	@GET
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Potential getPotentialById(@PathParam("id")Long id);
	
	/**
     * id修改商机信息状态
     * @param id
     * @return AgentRevenue
     */
	@PUT
	@Path("/status/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Potential updatePotentialStatusById(Potential potential);
	
	/**
	 * 添加商机信息记录
	 * @param salesAgent  销售代理
	 * @param trackList	商机跟踪详细记录集、
	 * @param potential 商机信息
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean savePotential(Potential potential);
	
	/**
	 * 修改商机信息记录
	 * @param salesAgent 销售代理
	 * @param trackList	商机跟踪详细记录集
	 * @param potential 商机信息
	 * @return
	 */
	@PUT
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updatePotential(Potential potential);
	
	/**
	 * 删除商机信息记录
	 * @param id 主键id
	 * @return
	 */
	@DELETE
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deletePotential(@PathParam("id")Long id);
	

	/**
     * 商机已被和未被跟踪客户
     * @param query
     * @return BaseModelList<Potential>
     * isFollowUp 已被跟踪客户
     * noFollowUp 未被跟踪客户
     */
	@GET
	@Path("/followup/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String,Long> followup(@PathParam("query") String query);
}
