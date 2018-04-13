package com.zqw.bss.service.remote.common;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.model.basic.BasicFileInfo;
import com.zqw.bss.model.basic.FileInfo;
import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.ClientInfo;
import com.zqw.bss.model.crm.TaxDeclare;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.vo.common.AccessVo;
import com.zqw.bss.vo.common.ClientInfoVo;
import com.zqw.bss.vo.common.OwnerAccessVo;
import com.zqw.bss.vo.common.OwnerListVo;
import com.zqw.bss.vo.common.OwnerNumVo;
import com.zqw.bss.vo.common.TaxDeclareListVo;
import com.zqw.bss.vo.common.TaxReportListVo;
import com.zqw.bss.vo.crm.ClientInfoForBssVo;
import com.zqw.bss.vo.sys.SearchUserByTaxListVo;
import com.zqw.bss.vo.sys.UerSessionListForVo;
@Path("/common")
public interface RemoteCommonService {

	@GET
	@Path("/nothing")
	public void getNothing();
	/**
	 * 获取注册企业名称、用户名以及会计期
	 * @return Map
	 */
	@GET
	@Path("/ownerinformation")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String,String> getUserInformation();
	
	/**
	 * 获取每日注册用户以及有效用户数量统计
	 * 
	 * @param 分页查询条件json固定格式
	 * @return 每日注册用户以及有效用户数量列列表
	 * @author wx   2016年9月13日 09:50:29
	 */
	@GET
	@Path("/owner/count/{role}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<OwnerNumVo> getOwnerNumVo(@PathParam("role")String role, @PathParam("query") String query);
	
	/**
	 * 获取某个时间段内用户行为
	 * 
	 * @param startDate、endDate
	 * @return  获取某个时间段内用户行为--集合
	 * @author wx   2016年9月13日 11:19:35
	 */
	@GET
	@Path("/owner/access/{startRemarkNum}/{endRemarkNum}/{startSecond}/{endSecond}/{date}/{role}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<OwnerAccessVo> getOwnerAccessVo(@PathParam("startRemarkNum") BigDecimal startRemarkNum, @PathParam("endRemarkNum") BigDecimal endRemarkNum, 
			@PathParam("startSecond") BigDecimal startSecond, @PathParam("endSecond") BigDecimal endSecond, 
			@PathParam("date")String date,@PathParam("role")String role, @PathParam("query") String query) ;
	
	/**
	 * 获取某个时间段内测试用户行为
	 * 
	 * @param date=时间（年月日），query分页查询条件
	 * @return  获取某个时间段内测试用户行为--集合
	 * @author wx   2016年11月2日 14:10:32
	 */
	@GET
	@Path("/testOwner/access/{date}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<OwnerAccessVo> getTestOwnerAccessVo(@PathParam("date")String date,
			@PathParam("query") String query) ;
	
	/**
	 * 获取某个时间段内模块的点击行为
	 * 
	 * @param date=时间（年月日），query分页查询条件
	 * @return  获取某个时间段内测试用户行为--集合
	 * @author wx   2016年11月3日 17:40:39
	 */
	@GET
	@Path("/remark/access/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<AccessVo> getRemarkAccess(@PathParam("query") String query) ;
	
	@GET
	@Path("/owner/company/{effective}/{date}/{role}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<OwnerListVo> getOwnerByDate(@PathParam("effective")String effective,@PathParam("date")String date,@PathParam("role")String role,@PathParam("query")String query);
	
	@GET
	@Path("/owner/tax")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<TaxReportListVo> getAllTaxReportUser();
	
	/**
	 * 通过代理报税人分配用户
	 * @param taxReportListVo
	 * @return
	 */
	@POST
	@Path("/owner/tax/update/{username}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateTaxReportingAgent(@PathParam("username")String username,List<TaxReportListVo> taxReportListVo);
	
	@GET
	@Path("/owner/information")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<OwnerListVo> getOwnerBySalesId();

	/**
	 * 申报记录
	 * @param taxDeclare
	 * @return
	 */
	@POST
	@Path("/tax/save")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public TaxDeclare saveTaxReporting(TaxDeclare taxDeclare);
	
	/**
	 * 查看申报记录
	 * @param query
	 * @return
	 */
	@GET
	@Path("/tax/search/{ownerId}/{uesername}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<TaxDeclareListVo> getTaxReporting(@PathParam("ownerId")Long ownerId,@PathParam("uesername")String uesername,@PathParam("query")String query);
	
	/**
	 * 获取分配用户的账期
	 * @param id
	 * @return
	 */
	@GET
	@Path("/owner/accountperiod/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public AccountPeriod getAccountPeriod(@PathParam("id")Long id);
	
	/**
	 * 导入客户
	 * @param file
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	@POST
	@Path("/import/{type}/{importLogId}")
	@Consumes("multipart/form-data")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean importEnterpriseInfo(@PathParam(value = "type") String type,
			@PathParam(value = "importLogId") Long importLogId,
			@Multipart(value = "file") Attachment file) throws UnsupportedEncodingException, FileNotFoundException, IOException;

	/**
	 * 导入免费兑换券
	 * @param product，freeTime，file
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws FileNotFoundException
	 * @throws IOException
	 */
	@POST
	@Path("/importCoupon/{products}/{freeTime}")
	@Consumes("multipart/form-data")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean importCouponInfo(@PathParam(value = "products") String products,
			@PathParam(value = "freeTime") Long freeTime,
			@Multipart(value = "file") Attachment file) throws UnsupportedEncodingException, FileNotFoundException, IOException;
	
	/**
	 * 获取所有客服
	 * @return
	 */
	@GET
	@Path("/customer")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<UerSessionListForVo> getCustomer();
	
	/**
	 * 导出
	 * @param query
	 * @throws IOException
	 */
	@GET
	@Path("/export/{type}/{startAmt}/{endAmt}/{roleName}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public void export(@PathParam(value="type")String type, @PathParam("startAmt") BigDecimal startAmt,
			@PathParam("endAmt") BigDecimal endAmt, @PathParam("roleName") String roleName,
			@PathParam(value="query")String query) throws IOException ;
	
	@GET
	@Path("/manage/{sales}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SearchUserByTaxListVo> getAllCustomerAndSales(@PathParam("sales")String sales);
	
	/**
	 * 代金券导出
	 * @param name 代金券的名字
	 * @param query
	 * @throws IOException
	 */
	@GET
	@Path("/export/voucher/{name}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public void exportVoucher(@PathParam(value="name")String name,@PathParam(value="query")String query) throws IOException ;
	
	@GET
	@Path("/account/{ownerId}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean checkInitialAccountPeriod(@PathParam(value="ownerId")Long ownerId);
	
	/**
	 * 通过xls导入凭证的信息
	 * 
	 * @throws IOException
	 * @throws ParseException 
	 */
	@POST
	@Path("/importjournal/{ownerId}/{createBy}")
	@Consumes("multipart/form-data")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean importXlsJournal(@Multipart(value = "file") Attachment file,@PathParam(value="ownerId")Long ownerId,@PathParam(value="createBy")String createBy) throws IOException, ParseException;

	/**
	 * 下载文件功能
	 * 
	 * @param 文件ID
	 * @return Response
	 */
	@GET
	@Path("/file/{id}")
	@Produces("text/plain")
	public Response downloadFile(@PathParam("id") Long id);
	
	/**
	 * 删除文件
	 * 
	 * @param 文件ID
	 * @return Boolean
	 */
	@DELETE
	@Path("/file/{id}")
	@Produces("text/plain")
	public Boolean removeFile(@PathParam("id") Long id);

	
	/**
	 * 表单提交，文件上传
	 * 
	 * @param file
	 * @return 文件信息 FileInfo
	 */
	@POST
	@Path("/file/{ownerId}")
	@Consumes("multipart/form-data")
	@Produces(MediaTypes.JSON_UTF_8)
	public BasicFileInfo uploadFileByForm(@PathParam(value="ownerId")Long ownerId,@Multipart(value = "file") Attachment file);
	
	
	//importXlsCOA
	/**
	 * 科目导入
	 */
	@POST
	@Path("/importxlscoa/{ownerId}")
	@Consumes("multipart/form-data")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean importEnterpriseInfo(
	@Multipart(value = "file") Attachment file,@PathParam(value="ownerId")Long ownerId) throws UnsupportedEncodingException, FileNotFoundException,
			IOException, ParseException, InterruptedException, Exception;

	@GET
	@Path("/client/{ownerId}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<ClientInfoForBssVo> getallClientInfoForBss(@PathParam("query") String query,@PathParam("ownerId") Long ownerId);
	
	@POST
	@Path("/importxlsclient/{ownerId}")
	@Consumes("multipart/form-data")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean importPersonAndEnterpriseInfo(@Multipart(value = "file")Attachment file,@PathParam("ownerId")Long ownerId) throws UnsupportedEncodingException, FileNotFoundException,
	IOException, ParseException, InterruptedException, Exception;
	
	@POST
	@Path("clientInfo/create/{ownerId}/{username}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean createClientInfoAndUserInfo(ClientInfo clientInfo,@PathParam("ownerId") Long ownerId,@PathParam("username") String username);
	
	@PUT
	@Path("clientInfo/update/{ownerId}/{username}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateClientInfoAndUserInfo(ClientInfo clientInfo,@PathParam("ownerId") Long ownerId,@PathParam("username") String username);
	
	@DELETE
	@Path("clientInfo/delete/{id}/{ownerId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deleteClientInfoAndUserInfo(@PathParam("id") Long id,@PathParam("ownerId") Long ownerId);
	
	@GET
	@Path("/export/{type}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public void exportJournal(@PathParam(value = "type") String type, @PathParam(value = "query") String query)
			throws IOException;
	
	/**
	 * 根据ids获取FileInfo的列表
	 * 
	 * @param ids(id1,id2)
	 * @return 文件列表信息
	 */
	@GET
	@Path("/fileinfos/{ids}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<BasicFileInfo> getFileInfoList(@PathParam("ids") String ids);
	
	
	/**
	 * 根据id获取附近
	 */
	@GET
	@Path("/fileinfos2/{ids2}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<FileInfo> getFileInfo(@PathParam("ids2") String ids2);
	
	@GET
	@Path("/getAllclient/{flag}/{ownerId}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ClientInfoVo> getAllClientInfoVO(@PathParam("flag")String flag,@PathParam("ownerId")Long ownerId);
	
	@POST
	@Path("/import/users")
	@Consumes("multipart/form-data")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<User> importUser(
	@Multipart(value = "file") Attachment file) throws UnsupportedEncodingException, FileNotFoundException,
			IOException, ParseException, InterruptedException, Exception;

}














