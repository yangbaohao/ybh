package com.zqw.bss.service.remote.crm;

import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.model.crm.UserInfo;

/**
 * <p>Title:</p>
 * <p>Description: 用户注册服务接口</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author lzy
 * @date 2016年4月15日 上午10:21:24
 * @version 1.0
 */

@Path("/userInfo")
public interface RemoteUserInfoService {
	
	/**
	 * 
	 * @param Sring
	 * 根据用户名判断注册用户是否存在
	 * @return boolean
	 */
	@GET
	@Path("/{name}")
	@Produces(MediaTypes.JSON_UTF_8)
	public UserInfo getUserInfoById(@PathParam("name") String name);
	
	
}
