package com.zqw.bss.service.remote.sys;

import java.math.BigDecimal;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.model.sys.InformationLogs;
import com.zqw.bss.vo.sys.InformationLogsVo;

@Path("/informationLogs")
public interface RemoteInformationLogsService {

	@POST
	@Path("/{ids}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean saveInformationLogs(InformationLogs informationLogs,@PathParam("ids")String ids);
	
	@GET
	@Path("/search/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<InformationLogsVo> getInformationLogsVoList(@PathParam("query")String query);
	
	@GET
	@Path("/search/detail/{code}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<InformationLogsVo> getInformationLogsVoListDetail(@PathParam("query")String query,@PathParam("code")String code);
	
	@GET
	@Path("/search/page/{amountmin}/{amountmax}/{state}/{statemin}/{statemax}/{datemin}/{datemax}/{user}/{activitNumber}/{phoneNumber}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String, Object> getUserPage(@PathParam("amountmin") BigDecimal amountmin,
			@PathParam("amountmax") BigDecimal amountmax, @PathParam("state") String state,
			@PathParam("statemin") BigDecimal statemin, @PathParam("statemax") BigDecimal statemax,
			@PathParam("datemin") String datemin, @PathParam("datemax") String datemax,
			@PathParam("user") String user,@PathParam("activitNumber") String activitNumber,@PathParam("phoneNumber") String phoneNumber);
}
