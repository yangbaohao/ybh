package com.zqw.bss.service.remote.msg;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

import com.zqw.bss.framework.util.MediaTypes;

@Path("/msg")
public interface RemoteOCRMsgService {

	@GET @Path("users/online")
	@Produces(MediaTypes.TEXT_PLAIN_UTF_8)
	Object getOnlineUsers();
	
}
