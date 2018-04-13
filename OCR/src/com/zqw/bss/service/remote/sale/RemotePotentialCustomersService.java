package com.zqw.bss.service.remote.sale;



import java.text.ParseException;
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
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;
import com.zqw.bss.vo.sale.PotentialCustomersRegisterVo;
@Path("/potentialCustomers")
public interface RemotePotentialCustomersService {

	/**
     * 分页获取潜在客户
     * @param query
     * @return BaseModelList<PotentialCustomers>
     */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PotentialCustomers> getPagePotentialCustomers(@PathParam("query") String query);
	
	/**
     * id获取潜在客户
     * @param id
     * @return AgentRevenue
     */
	@GET
	@Path("/{id}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public PotentialCustomers getPotentialCustomersById(@PathParam("id")Long id);
	
	/**
     * id修改潜在客户状态
     * @param id
     * @return AgentRevenue
     */
	@PUT
	@Path("/status/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public PotentialCustomers updatePotentialCustomersStatusById(PotentialCustomers potentialCustomers);
	
	/**
	 * 添加潜在客户记录
	 * @param sales  销售
	 * @param trackList	潜在客户跟踪详细记录集、
	 * @param potentialCustomers 潜在客户
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean savePotentialCustomers(PotentialCustomers potentialCustomers);
	
	/**
	 * 修改商机信息记录
	 * @param salesAgent 销售代理
	 * @param trackList	商机跟踪详细记录集
	 * @param potentialCustomers 商机信息
	 * @return
	 */
	@PUT
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updatePotentialCustomers(PotentialCustomers potentialCustomers);
	
	/**
	 * 根据潜在用户获取短信列表
	 * 
	 * @param id
	 * @return 用户列表信息
	 * @throws ParseException
	 */
	@GET
	@Path("/shortMessages/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<ShortMessage> getAllListShortMessage(@PathParam("id") Long id
							) throws ParseException;
	
	/**
     * 分页潜在用户获取短信列表
     * @param pl.id
     * @return BaseModelList<PotentialCustomers>
     */
	@GET
	@Path("/shortMessagesPage/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<ShortMessage> getPageShortMessage(@PathParam("query") String query);
	
	/**
	 * 用户匹配
	 * @param query
	 * @return
	 */
	@GET
	@Path("/matching/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PotentialCustomersRegisterVo> putMatching(@PathParam("query") String query);
	
	/**
	 * 查询注册用户数
	 * @param query
	 * @return
	 */
	@GET
	@Path("/registered/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<PotentialCustomersRegisterVo> registered(@PathParam("query") String query);
	
	
	/**
	 * 发送短信给个人 
	 * @param shortMessage 短信内容
	 */
	@POST
	@Path("/sendmessageToPerson")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean sendmessageToPerson(ShortMessage shortMessage);
	
	/**
	 *根据id修改潜在用户姓名和手机号
	 * @param potentialCustomers 潜在客户
	 * @return
	 */
	@PUT
	@Path("/updateNameAndPhone")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updateNameAndPhone(PotentialCustomers potentialCustomers);
}
