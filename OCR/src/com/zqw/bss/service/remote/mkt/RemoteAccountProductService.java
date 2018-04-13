package com.zqw.bss.service.remote.mkt;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.vo.mkt.GiveDetailVo;
import com.zqw.bss.vo.mkt.SearchAccountProductListVo;


@Path("/accountproduct")
public interface RemoteAccountProductService {

	/**
	 * 创建产品 
	 * @param accountProduct对象
	 * @return Boolean
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean savaAccountProduct(AccountProduct accountProduct);
	
	/**
	 * 修改产品
	 * @param accountProduct对象
	 * @return Boolean
	 */
		@PUT
		@Path("/")
		@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateAccountProduct(AccountProduct accountProduct);
		
	/**
	 * 修改产品状态
	 * @param accountProduct对象
	 * @return Boolean
	 */
		@PUT
		@Path("/status")
		@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateProductStatus(AccountProduct accountProduct);
	
	/**
	 * 通过id查询产品
	 * @param id
	 * @return AccountProduct 对象
	 */
		@GET
		@Path("/{id}")
		@Produces(MediaTypes.JSON_UTF_8)
	public AccountProduct getAccountProductById(@PathParam("id")Long id);
	
    /**
     * 分页获取产品
     * @param query
     * @return BaseModelList<AccountProduct>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<SearchAccountProductListVo> getAllAccountProduct(@PathParam("query") String query);

	@GET
	@Path("/productname")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SearchAccountProductListVo> getAllAccountProductName();
	
	@GET
	@Path("/givedetail/{id}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<GiveDetailVo> getAllGiveDetail(@PathParam("id") Long id,@PathParam("query") String query);
	
}
