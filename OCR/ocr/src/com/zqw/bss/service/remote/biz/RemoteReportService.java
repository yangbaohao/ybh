package com.zqw.bss.service.remote.biz;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.report.PerformanceVO;

@Path("/report")
public interface RemoteReportService {
	/**
	 * 制单人报表
	 */
	@GET
	@Path("/search/creater/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PerformanceVO> searchCreaterReport(@PathParam("query") String query);
	/**
	 * 审核人报表
	 */
	@GET
	@Path("/search/checker/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PerformanceVO> searchCheckerReport(@PathParam("query") String query);
	
	/**
	 * enter抢单
	 * 多个id用英文逗号隔开
	 */
	@GET
	@Path("/enterGrap")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public SalesOrderListVo enterGrap();
}





















