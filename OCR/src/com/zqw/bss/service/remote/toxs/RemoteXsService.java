package com.zqw.bss.service.remote.toxs;

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

@Path("/SimpleAC")
public interface RemoteXsService {

	@GET
	@Path("/{urlcode}")
	@Produces(MediaTypes.JSON_UTF_8)
	public String invokeGetMethod(@PathParam("urlcode") String urlcode);

	@POST
	@Path("/{urlcode}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public String invokePostMethod(@PathParam("urlcode") String urlcode, String postData);
	
	@PUT
	@Path("/{urlcode}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public String invokePutMethod(@PathParam("urlcode") String urlcode, String putData);
	
	@DELETE
	@Path("/{urlcode}")
	@Produces(MediaTypes.JSON_UTF_8)
	public String invokeDelMethod(@PathParam("urlcode") String urlcode);
	
	
	/**
	 * 表单提交，文件上传	
	 * @param file
	 * @return 文件信息 FileInfo
	 */
	@POST
	@Path("/file/{urlcode}")
	@Consumes("multipart/form-data")
	@Produces(MediaTypes.JSON_UTF_8)
	public String uploadFileByForm2(@PathParam("urlcode") String urlcode,@Multipart(value = "file") Attachment file);
	
	/**
	 * 下载图片
	 */
	@GET
	@Path("down/{urlcode}")
//	@Produces("Content-Disposition/attachment")
	@Produces("text/plain")
	public Response downFile(@PathParam("urlcode") String urlcode);
	
}





