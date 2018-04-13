package com.zqw.bss.service.remote.sys;

import java.util.List;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.CodeVo;

/**
 * @author chxiaoqi
 *
 */
@Path("/code")
public interface RemoteCodeService {

	/**
	 * 通过code分类获取
	 * @param category
	 * @return code分类
	 */
	@GET
	@Path("/{category}")
	@Produces(MediaTypes.JSON_UTF_8)
	public List<CodeVo> getCodeByCategory(@PathParam("category") String category);

	/**
	 * 获取枚举类型定义的中文
	 * @return Map
	 */
	@GET
	@Path("/dict")
	@Produces(MediaTypes.JSON_UTF_8)
	public Map<String,String> getdictionary();
	
	/**
	 * 获取随机编码
	 * @return
	 */
	@GET
	@Path("/random/{prefix}/{length}")
	@Produces(MediaTypes.TEXT_PLAIN)
	public String getRandomCode(@PathParam("prefix") String prefix,@PathParam("length") int length);
	
}
