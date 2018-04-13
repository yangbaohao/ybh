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
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.model.sale.MessageLog;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;
@Path("/shortmessage")
public interface RemoteShortMessageService {

	/**
	 * 添加短信记录
	 * @param sales  销售
	 * @param ShortMessage 短信
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean saveShortMessage(ShortMessage ShortMessage);
	
	/**
	 * 修改短信记录
	 * @param sales 销售
	 * @param ShortMessage 短信
	 * @return
	 */
	@PUT
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateShortMessage(ShortMessage ShortMessage);
	
	/**
	 * 删除短信记录
	 * @param id 主键id
	 * @return
	 */
	@DELETE
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deleteShortMessage(Long id);

	/**
	 * 分页短信记录
	 * @param bso
	 * @return
	 */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<ShortMessage> getPageShortMessage(@PathParam("query") String query);
	
	/**
	 * id获取短信记录
	 * @param id
	 * @return
	 */
	@GET
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public ShortMessage getShortMessageById(@PathParam("id")Long id);
	
	/**
	 * id获取短信发送记录
	 * @param id
	 * @return
	 */
	@GET
	@Path("/send/{id}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<MessageLog> getShortMessageByIdGetPage(@PathParam("id")Long id,@PathParam("query") String query);
	
	/**
	 * id获取短信未发送批次
	 * @param id
	 * @return
	 */
	@GET
	@Path("/nosend/{id}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<ImportLog> getShortMessageByIdGetPageNoSend(@PathParam("id")Long id,@PathParam("query") String query);
	
	/**
	 * 获取批次
	 */
	@GET
	@Path("/batchnum/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<PotentialCustomers> getbatchNumById(@PathParam("id")Long id);

	/**
	 * 发送短信 
	 * @param id 短信id
	 * @param num 批次
	 */
	@GET
	@Path("/sendmessage/{id}/{num}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean senderMessage(@PathParam("id")Long id,@PathParam("num")String num);
}
