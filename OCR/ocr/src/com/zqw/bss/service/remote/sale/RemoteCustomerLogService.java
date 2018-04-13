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
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.sale.CustomerLog;

@Path("/customerLog")
public interface RemoteCustomerLogService {

	/**
	 * 分页查询 张沂飞
	 */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<CustomerLog> getCustomerLogByPage(@PathParam("query") String query);

	/**
	 * 保存 张沂飞
	 * 
	 * @param CustomerLog
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean saveCustomerLog(CustomerLog customerLog);

	/**
	 * 删除 张沂飞
	 */
	@DELETE
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delectCustomerLog(@PathParam("id") Long id);

	/**
	 * 修改 张沂飞
	 */
	@PUT
	@Path("/")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateCustomerLog(CustomerLog customerLog);
	
	
	/**
	 * 添加一条 记录/备注	 张沂飞
	 * @param remark
	 * @param type remark 备注  content 聊天内容
	 * @return
	 */
	@POST
	@Path("/add/{type}/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean saveContentRemark(Remark remark,@PathParam("type") String type,@PathParam("id") Long id);

	/**
	 * 修改一条 聊天内容/备注 张沂飞
	 * @param remark
	 * @param type remark 备注  content 聊天内容
	 * @return
	 */
	@PUT
	@Path("/{type}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateContentRemark(Remark remark,@PathParam("type") String type);
}
