package com.zqw.bss.service.remote.toxs.impl;

import java.io.IOException;

import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.jfree.util.Log;

import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.service.remote.toxs.RemoteXsService;
import com.zqw.bss.util.HttpRestUtil;

import net.sf.json.JSONObject;

public class RemoteXsServiceImpl implements RemoteXsService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Override
	public String invokeGetMethod(String urlcode) {

		try {
			String url = HsqlUtil.DecodeRequest(urlcode);
			logger.info("url =" + url);
			String resultStr = HttpRestUtil.getGetRetrunStr(url);
			logger.info("resultStr =" + resultStr);
			return resultStr;
		} catch (IOException e) {
			e.printStackTrace();
			Log.error(e.getStackTrace().toString());
			throw new OperationException("系统异常，请稍后再试！");
		}
	}

	@Override
	public String invokePostMethod(String urlcode, String postData) {
		try {
			String url = HsqlUtil.DecodeRequest(urlcode);
			logger.info("url =" + url);
			String resultStr = HttpRestUtil.getPostRetrunStr(url, postData);
			logger.info("resultStr =" + resultStr);
			return resultStr;
		} catch (IOException e) {
			e.printStackTrace();
			Log.error(e.getStackTrace().toString());
			throw new OperationException("系统异常，请稍后再试！");
		}
	}
	
	@Override
	public String uploadFileByForm2(String urlcode,Attachment file) {
		try {
			String url = HsqlUtil.DecodeRequest(urlcode);
			logger.info("url =" + url);
			String resultStr = HttpRestUtil.getPostRetrunStr2(url, file);
			JSONObject json_test = JSONObject.fromObject(resultStr); 
			return resultStr;
			
		} catch (IOException e) {
			e.printStackTrace();
			Log.error(e.getStackTrace().toString());
			throw new OperationException("系统异常，请稍后再试！");
		}
	}
	@Override
	public String invokePutMethod(String urlcode, String putData) {
		try {
			String url = HsqlUtil.DecodeRequest(urlcode);
			logger.info("url =" + url);
			String resultStr = HttpRestUtil.getPutRetrunStr(url, putData);
			logger.info("resultStr =" + resultStr);
			return resultStr;
		} catch (IOException e) {
			e.printStackTrace();
			Log.error(e.getStackTrace().toString());
			throw new OperationException("系统异常，请稍后再试！");
		}
	}		
	
	@Override
	public String invokeDelMethod(String urlcode) {

		try {
			String url = HsqlUtil.DecodeRequest(urlcode);
			logger.info("url =" + url);
			String resultStr = HttpRestUtil.getDelRetrunStr(url);
			logger.info("resultStr =" + resultStr);
			return resultStr;
		} catch (IOException e) {
			e.printStackTrace();
			Log.error(e.getStackTrace().toString());
			throw new OperationException("系统异常，请稍后再试！");
		}

	}

	@Override
	public Response downFile(String urlcode) {
		try {
			String url = HsqlUtil.DecodeRequest(urlcode);
			logger.info("url =" + url);
			return HttpRestUtil.getXsFile(url);
		} catch (Exception e) {
			e.printStackTrace();
			Log.error(e.getStackTrace().toString());
			throw new OperationException("系统异常，请稍后再试！");
		}
	}
	
}






