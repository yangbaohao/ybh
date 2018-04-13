package com.zqw.bss.service.remote.sale;


import java.util.List;


import javax.ws.rs.Consumes;

import javax.ws.rs.GET;
import javax.ws.rs.POST;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;


import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.model.sale.UserSaler;


@Path("/usersaler")
public interface RemoteUserSalerService {

	/**
	 * 查询  customer 客服 sales 销售
	 */
	@GET
	@Path("/{type}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<UserSaler> getAllUsersaler(@PathParam("type") String type);

	/**
	 * 创建  customer 客服 sales 销售
	 */

	@POST
	@Path("/{type}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean saveUserSaler(List<UserSaler> users,@PathParam("type") String type);

}
