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
import com.zqw.bss.model.sale.PromotionalCopy;

@Path("/promotionalcopy")
public interface RemotePromotionalCopyService {

	/**保存推广
	 * @param promotionalCopy
	 * @return
	 */
	@POST
	@Path("/")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean savePromotionalCopy(PromotionalCopy promotionalCopy);
	
	/**修改推广
	 * @param promotionalCopy
	 * @return
	 */
	@PUT
	@Path("/")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean updatePromotionalCopy(PromotionalCopy promotionalCopy);
	
	/**查询所有推广
	 * @return
	 */
	@GET
	@Path("/search/all")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public List<PromotionalCopy> getAllPromotionalCopy();
	
	/**删除
	 * @param id
	 * @return
	 */
	@DELETE
	@Path("/delete/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean delPromotionalCopy(@PathParam("id") Long id);
	
	/**查询单个
	 * @param id
	 * @return
	 */
	@GET
	@Path("/findbyid/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public PromotionalCopy  getPromotionalCopyById(@PathParam("id")Long id);
}
