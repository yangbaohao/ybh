package com.zqw.bss.service.remote.crm;

import java.math.BigDecimal;
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

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PayRemark;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.vo.crm.OwnerInfoVo;
import com.zqw.bss.vo.crm.UserInfoForListVO;
import com.zqw.bss.vo.sys.OwnerDetailsVo;
import com.zqw.bss.vo.sys.OwnerInformationVo;
import com.zqw.bss.vo.sys.SearchOwnerListvo;

/**
 * <p>Title:</p>
 * <p>Description: 用户注册服务接口</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author lzy
 * @date 2016年4月15日 上午10:21:24
 * @version 1.0
 */

@Path("/owner")
public interface RemoteOwnerService {
	
	/**
	 * Get Place By Id
	 * @param Sring
	 * 判断注册用户是否存在
	 * @return boolean
	 */
	@GET
	@Path("/direct/login/{loginId}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean getUserInfoById(@PathParam("loginId") String loginId);
	
	public Owner getOwner(Long ownerId);

	/**
	 * 获取注册展示信息
	 */
	public BaseModelList<OwnerInfoVo> getOwnerInfoVoAll(BasePagerObject condition);
	
	/**
	 * 根据用户名获取手机号码
	 * @param 用户名
	 * @return 手机号码(前3位，后3位)
	 */
	@GET
	@Path("/direct/phone/{username}")
	@Produces(MediaTypes.JSON_UTF_8)
	public String getPhoneByUsername(@PathParam("username") String username)throws Exception;
	
	/**
	 * 获取忘记密码的短信验证码(存入session)
	 * 
	 * @param 用户名
	 * @return 是否发送成功
	 */
	@GET
	@Path("/direct/valid/session/{uname}/{count}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean getVaildCode(@PathParam("uname") String uname, @PathParam("count") Long count) throws Exception;
	
	/**
	 * 忘记密码(更改密码,通过跟session中验证码比较)
	 * @param 验证码、用户信息
	 * @return Boolean
	 */
	@PUT
	@Path("/direct/upwd/{validCode}/{uname}/{pass}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateUserPwd(@PathParam("validCode") String valid , @PathParam("uname") String uname,@PathParam("pass") String pass)throws Exception;
	
	@PUT
	@Path("/remark")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateOwnerRemarkBySales(Owner owner);
	
	/**获取用户详情
	 * @param id
	 * @return
	 */
		@GET
		@Path("/ov/{id}")
		@Produces(MediaTypes.JSON_UTF_8)
	public OwnerInformationVo getDetailOwner(@PathParam("id")Long id);
		
	/**
	 * 用户注册
	 * 
	 * @param 记账日期、纳税人性质、用户信息
	 * @return boolean
	 */
	@POST
	@Path("/direct/reg")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean createRegInfoAll(Map map)throws Exception;
	
	/**
	 * 更新
	 * 
	 * @param map
	 * @return
	 */
	@PUT
	@Path("/updateLoginById")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateLoginById(Map<String, String> flagMap)throws Exception;
	
	/**
	 * 更新保税人
	 * 
	 * @param map
	 * @return
	 */
	@PUT
	@Path("/updateTaxCodeByName")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateTaxCodeByName(Map<String, String> flagMap)throws Exception;
	
	
	/**
	 * 更新报税人，已存在，发送验证码(存入session)
	 * 
	 * @param 用户名
	 * @return 是否发送成功
	 */
	@GET
	@Path("/direct/enrolledAgent/session/{uname}/{count}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean getEnrolledAgentVaildCode(@PathParam("uname") String uname, @PathParam("count") Long count) throws Exception;
	
	/**
	 * 根据秒账用户名获取手机号码
	 * @param 用户名
	 * @return 手机号码(前3位，后3位)
	 */
	@GET
	@Path("/direct/acPhone/{username}")
	@Produces(MediaTypes.JSON_UTF_8)
	public String getPhoneByAcUsername(@PathParam("username") String username)throws Exception;
	
	/**
	 * 判断手机与更新报税人已存在时发送的验证码是否匹配
	 * @param 验证码
	 * @return 验证码是否正确
	 */
	@GET
	@Path("/direct/valid/verify/{valid}/{username}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean vaildMsgCodeFirst(@PathParam("valid") String valid, @PathParam("username") String username)
			throws Exception;
	/**
	 * 获取备注信息
	 * zyf
	 */
	@GET
	@Path("/remark/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<Remark> getRemark(@PathParam("id") String id);
	
	/**
	 * 成功和付费用户详情
	 * 成功 success
	 * 付费 paid
	 * @param num  0代表销售  1代表客服
	 */
	@GET
	@Path("/ownerdetails/{num}/{type}/{sales_id}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<OwnerDetailsVo> getOwnerDetails(@PathParam("num") String num,@PathParam("type") String type,@PathParam("sales_id")String sales_id,@PathParam("query") String query);

	/**
	 * 获取待分配用户
	 *@param num  0代表销售  1代表客服 
	 */
	@GET
	@Path("/getownerlist/{num}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<Owner> getOwnerList(@PathParam("num") String num,@PathParam("query") String query);
	
	/**
	 * 分配用户
	 * 
	 * @param 记账日期、纳税人性质、用户信息
	 * @return boolean
	 */
	@POST
	@Path("/writeownerlist/{ids}/{id}/{employeeCode}/{num}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean writeownerlist(@PathParam("ids") String ids,@PathParam("id") Long id,@PathParam("employeeCode") String employeeCode,@PathParam("num") String num);
	
	@GET
	@Path("/isornotremark/{startAmt}/{endAmt}/{roleName}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String,String> getIsOrNoRemarkOwner(@PathParam("startAmt") BigDecimal startAmt,
			@PathParam("endAmt") BigDecimal endAmt, @PathParam("roleName") String roleName,
			@PathParam("query") String query);
	
	/**
	 * 保存收款记录
	 * @param payRemark
	 * @return
	 */
	@POST
	@Path("/payRemark")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public PayRemark createPayRemark(PayRemark payRemark);
	
	@PUT
	@Path("/payRemark/update")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updatePayRemark(PayRemark payRemark);
	
	@DELETE
	@Path("/payRemark/delete/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deletePayRemark(@PathParam("id") Long id);
	
	@GET
	@Path("/search/payRemark/{ownerId}/{type}/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PayRemark> getAllPayRemark(@PathParam("ownerId")Long ownerId,@PathParam("type") String type,@PathParam("query") String query);
	
	@GET
	@Path("/mail/{email}/{ownerId}/{startDate}/{endDate}/{amt}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean sendEmail(@PathParam("email")String emai,@PathParam("ownerId")Long ownerId,@PathParam("startDate") String startDate,@PathParam("endDate") String endDate,@PathParam("amt") BigDecimal amt) throws Exception;
	
	@GET
	@Path("/category/{ownerId}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public UserInfoForListVO getOwnerInfomation(@PathParam("ownerId")Long ownerId);
	
	@GET
	@Path("/userlist")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<SearchOwnerListvo> getUserInfomation();
}
