package com.zqw.bss.service.remote.sale;

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
@Path("/potentialtrack")
public interface RemotePotentialTrackService {

	/**
     * 分页获取商机信息跟踪
     * @param query
     * @return BaseModelList<PotentialTrack>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PotentialTrack> getPagePotentialTrack(@PathParam("query") String query);
	
	/**
     * id获取商机信息跟踪
     * @param id
     * @return AgentRevenue
     */
	@GET
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public PotentialTrack getPotentialTrackById(@PathParam("id")Long id);
	
	/**
	 * 添加商机信息跟踪记录
	 * @param potentialTrack	商机信息跟踪
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public PotentialTrack savePotentialTrack(PotentialTrack potentialTrack);
	
	/**
	 * 修改商机信息跟踪记录
	 * @param potentialTrack	商机信息跟踪
	 * @return
	 */
	@PUT
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updatePotentialTrack(PotentialTrack potentialTrack);
	
	/**
	 * 删除商机信息跟踪记录
	 * @param id 主键id
	 * @return
	 */
	@DELETE
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deletePotentialTrack(@PathParam("id")Long id);
}
