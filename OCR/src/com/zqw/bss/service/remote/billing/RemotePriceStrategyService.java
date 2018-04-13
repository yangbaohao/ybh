package com.zqw.bss.service.remote.billing;

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
import com.zqw.bss.model.billing.PriceStrategy;

@Path("/pricestrategy")
public interface RemotePriceStrategyService {
	/**
     * 分页获取定价策略信息
     * @param query
     * @return BaseModelList<PriceStrategy>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PriceStrategy> getPagePriceStrategy(@PathParam("query") String query);
	
	/**
     * id获取定价策略信息
     * @param id
     * @return AgentRevenue
     */
	@GET
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public PriceStrategy getPriceStrategyById(@PathParam("id")Long id);
	
	/**
	 * 添加定价策略信息记录
	 * @param salesAgent  销售代理
	 * @param trackList	定价策略跟踪详细记录集、
	 * @param PriceStrategy 定价策略信息
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean savePriceStrategy(PriceStrategy priceStrategy);
	
	/**
	 * 修改定价策略信息记录
	 * @param salesAgent 销售代理
	 * @param trackList	定价策略跟踪详细记录集
	 * @param PriceStrategy 定价策略信息
	 * @return
	 */
	@PUT
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updatePriceStrategy(PriceStrategy priceStrategy);
	
	/**
	 * 删除定价策略信息记录
	 * @param id 主键id
	 * @return
	 */
	@DELETE
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deletePriceStrategy(@PathParam("id")Long id);
}
