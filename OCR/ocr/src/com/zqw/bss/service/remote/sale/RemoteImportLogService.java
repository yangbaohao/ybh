package com.zqw.bss.service.remote.sale;

import java.text.ParseException;
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
@Path("/importLog")
public interface RemoteImportLogService {

	/**
     * 分页获取潜在客户跟踪
     * @param query
     * @return BaseModelList<ImportLog>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<ImportLog> getPageImportLog(@PathParam("query") String query);
	
	/**
     * id获取潜在客户跟踪
     * @param id
     * @return AgentRevenue
     */
	@GET
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public ImportLog getImportLogById(@PathParam("id")Long id);
	
	/**
	 * 添加潜在客户跟踪记录
	 * @param importLog	潜在客户跟踪
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public ImportLog saveImportLog(ImportLog importLog);
	
	/**
	 * 修改日志备注
	 * @param importLog	修改日志备注
	 * @return
	 */
	@PUT
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateImportLog(ImportLog importLog);
	
	/**
	 * 删除潜在客户跟踪记录
	 * @param id 主键id
	 * @return
	 */
	@DELETE
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deleteImportLog(@PathParam("id")Long id);
	
	/**
	 * 根据潜在用户获取备注列表
	 * 
	 * @param potentialCustomersId
	 * @return 用户列表信息
	 * @throws ParseException
	 */
	@GET
	@Path("/tracks/{potentialCustomersId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ImportLog> getImportLogBybatchNum(@PathParam("potentialCustomersId") String potentialCustomersId
							) throws ParseException;

}
