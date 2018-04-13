package com.zqw.bss.service.remote.sale;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.model.crm.OwnerLebal;
import com.zqw.bss.model.sale.SalesAgentLebal;

@Path("/salesagentlebal")
public interface RemoteSalesAgentLebalService {

	/**
	 * 保存标签
	 * @param ownerLebal
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean createSalesAgentLebal(List<SalesAgentLebal> salesAgentLebal);
	
	/**
	 * 查询标签list
	 * @return
	 */
	@GET
	@Path("/search")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SalesAgentLebal> getAllSalesAgentLebal();
	
	/**
	 * 修改用户标签 
	 * @param ownerLebal
	 * @param ownerId（选中用户的ownerId）
	 * @return
	 */
	@PUT
	@Path("/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateSalesAgentLebal(SalesAgentLebal salesAgentLebal,@PathParam("ownerId")Long ownerId);
}
