package com.zqw.bss.util;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.net.URLEncoder;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.log4j.Logger;
import org.jfree.util.Log;

import com.zqw.bss.framework.exception.OperationException;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2016 www.accountyun.com
 * </p>
 * <p>
 * Company:zqw
 * </p>
 * 
 * @author lzy
 * @date 2016年5月17日 下午9:23:35
 * @version 1.0
 */

public class HttpSender {
	
	private static final Logger logger = Logger.getLogger(HttpSender.class.getName());

	public static final String URL = "http://222.73.117.156/msg/";
	public static final String ACCOUNT = "vip-fwwh_account"; // vip-fwwh_fenglin
	public static final String PAWD = "account@2016"; // fenglin@sfjd2016

	/**
	 * 
	 * @param url
	 *            应用地址，类似于http://ip:port/msg/
	 * @param account
	 *            账号
	 * @param pswd
	 *            密码
	 * @param mobile
	 *            手机号码，多个号码使用","分割
	 * @param msg
	 *            短信内容
	 * 
	 * @param needstatus
	 *            是否需要状态报告，需要true，不需要false
	 * @return 返回值定义参见HTTP协议文档
	 * @throws Exception
	 */
	public static String send(String url, String account, String pswd, String mobile, String msg, boolean needstatus,
			String product, String extno) throws Exception {
		HttpClient client = new HttpClient();
		GetMethod method = new GetMethod();
		try {
			URI base = new URI(url, false);
			method.setURI(new URI(base, "HttpSendSM", false));
			method.setQueryString(new NameValuePair[] { new NameValuePair("account", account),
					new NameValuePair("pswd", pswd), new NameValuePair("mobile", mobile),
					new NameValuePair("needstatus", String.valueOf(needstatus)), new NameValuePair("msg", msg),
					new NameValuePair("product", product), new NameValuePair("extno", extno), });
			int result = client.executeMethod(method);
			if (result == HttpStatus.SC_OK) {
				InputStream in = method.getResponseBodyAsStream();
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				byte[] buffer = new byte[1024];
				int len = 0;
				while ((len = in.read(buffer)) != -1) {
					baos.write(buffer, 0, len);
				}
				return URLDecoder.decode(baos.toString(), "UTF-8");
			} else {
				throw new Exception("HTTP ERROR Status: " + method.getStatusCode() + ":" + method.getStatusText());
			}
		} finally {
			method.releaseConnection();
		}

	}

	/**
	 * 
	 * @param url
	 *            应用地址，类似于http://ip:port/msg/
	 * @param account
	 *            账号
	 * @param pswd
	 *            密码
	 * @param mobile
	 *            手机号码，多个号码使用","分割
	 * @param msg
	 *            短信内容
	 * @param needstatus
	 *            是否需要状态报告，需要true，不需要false
	 * @return 返回值定义参见HTTP协议文档
	 * @throws Exception
	 */
	public static String batchSend(String url, String account, String pswd, String mobile, String msg,
			boolean needstatus, String product, String extno) throws Exception {
		HttpClient client = new HttpClient();
		GetMethod method = new GetMethod();
		try {
			URI base = new URI(url, false);
			method.setURI(new URI(base, "HttpBatchSendSM", false));
			method.setQueryString(new NameValuePair[] { new NameValuePair("account", account),
					new NameValuePair("pswd", pswd), new NameValuePair("mobile", mobile),
					new NameValuePair("needstatus", String.valueOf(needstatus)), new NameValuePair("msg", msg),
					new NameValuePair("product", product), new NameValuePair("extno", extno), });
			int result = client.executeMethod(method);
			if (result == HttpStatus.SC_OK) {
				InputStream in = method.getResponseBodyAsStream();
				ByteArrayOutputStream baos = new ByteArrayOutputStream();
				byte[] buffer = new byte[1024];
				int len = 0;
				while ((len = in.read(buffer)) != -1) {
					baos.write(buffer, 0, len);
				}
				return URLDecoder.decode(baos.toString(), "UTF-8");
			} else {
				throw new Exception("HTTP ERROR Status: " + method.getStatusCode() + ":" + method.getStatusText());
			}
		} finally {
			method.releaseConnection();
		}

	}

	public static String phoneMsg(String phone) throws Exception {
		int mathNum = (int) ((Math.random() * 9 + 1) * 1000);
		batchSend(HttpSender.URL, HttpSender.ACCOUNT, HttpSender.PAWD, phone, "您的验证码是" + mathNum, true, null, null);
		return String.valueOf(mathNum);
	}

	/*
	 * public static void main(String[] args) throws Exception {
	 * HttpSender.batchSend(HttpSender.URL, HttpSender.ACCOUNT, HttpSender.PAWD,
	 * "15216743826", "您的验证码是1234", true, null, null); }
	 */
	public static String getMsg(String phone, Long count) {
		// 发送内容
		int mathNum = (int) ((Math.random() * 9 + 1) * 1000);
		String content = "短信验证码为" + mathNum + "请勿将验证码提供给他人。";
		String sign = "秒账";

		StringBuffer sb = new StringBuffer("http://web.cr6868.com/asmx/smsservice.aspx?");
		sb.append("name=18296235115");
		sb.append("&pwd=67379679DA9F7218A05877DB2E09");
		sb.append("&mobile=" + phone);
		try {
			sb.append("&content=" + URLEncoder.encode(content, "UTF-8"));
			sb.append("&stime=");
			sb.append("&sign=" + URLEncoder.encode(sign, "UTF-8"));
			sb.append("&type=pt&extno=");
			System.out.println("sb:" + sb.toString());
			URL url = new URL(sb.toString());
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setRequestMethod("POST");
			InputStream is = url.openStream();
			String returnStr = convertStreamToString(is);
			System.out.println(returnStr);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return String.valueOf(mathNum);
	}

	// public static String getMsges(String phone,String content) {
	// //发送内容
	// int mathNum = (int)((Math.random()*9+1)*1000);
	// String sign="秒账";
	//
	// StringBuffer sb = new
	// StringBuffer("http://web.cr6868.com/asmx/smsservice.aspx?");
	// sb.append("name=18296235115");
	// sb.append("&pwd=67379679DA9F7218A05877DB2E09");
	// sb.append("&mobile="+phone);
	// try {
	// sb.append("&content="+URLEncoder.encode(content,"UTF-8"));
	// sb.append("&stime=");
	// sb.append("&sign="+URLEncoder.encode(sign,"UTF-8"));
	// sb.append("&type=pt&extno=");
	// System.out.println("sb:"+sb.toString());
	// URL url = new URL(sb.toString());
	// HttpURLConnection connection = (HttpURLConnection) url.openConnection();
	// connection.setRequestMethod("POST");
	// InputStream is =url.openStream();
	// String returnStr = convertStreamToString(is);
	// System.out.println(returnStr);
	// } catch (Exception e) {
	// // TODO Auto-generated catch block
	// e.printStackTrace();
	// }
	// return String.valueOf(mathNum);
	// }
	//
	
//	public static void main(String[] args) {
//		getMsges("18912610589","nihao");
//	}

	public static String getMsges(String phone, String content) {
		// 发送内容
		int mathNum = (int) ((Math.random() * 9 + 1) * 1000);
		String sign = "秒账";
		logger.info("msgcontent =" + content);
		try {
			String msgReturnStr= doPost("18296235115", "67379679DA9F7218A05877DB2E09", new StringBuffer(phone), new StringBuffer(content),
					sign);
			
			if(!msgReturnStr.startsWith("0")){
				logger.error("error msg =" + msgReturnStr);
				throw new OperationException("短信接口发送错误！");
				
			}
				
				
			
			
			System.out.println("=============================================msgReturnStr =" + msgReturnStr);
			logger.info("msgReturnStr =" + msgReturnStr);

		} catch (Exception e) {
			Log.error(e.getMessage());
			throw new OperationException("短信接口发送错误！");
		}
		return String.valueOf(mathNum);
	}

	/**
	 * 发送短信
	 * 
	 * @param name
	 *            用户名
	 * @param pwd
	 *            密码
	 * @param mobileString
	 *            电话号码字符串，中间用英文逗号间隔
	 * @param contextString
	 *            内容字符串
	 * @param sign
	 *            签名
	 * @param stime
	 *            追加发送时间，可为空，为空为及时发送
	 * @param extno
	 *            扩展码，必须为数字 可为空
	 * @return
	 * @throws Exception
	 */
	public static String doPost(String name, String pwd, StringBuffer mobileString, StringBuffer contextString,
			String sign) throws Exception {
		StringBuffer param = new StringBuffer();
		param.append("name=" + name);
		param.append("&pwd=" + pwd);
		param.append("&mobile=").append(mobileString);
		param.append("&content=").append(URLEncoder.encode(contextString.toString(), "UTF-8"));
		//param.append("&stime=" + stime);
		param.append("&sign=").append(URLEncoder.encode(sign, "UTF-8"));
		param.append("&type=pt");
		//param.append("&extno=").append(extno);

		URL localURL = new URL("http://web.cr6868.com/asmx/smsservice.aspx?");
		URLConnection connection = localURL.openConnection();
		HttpURLConnection httpURLConnection = (HttpURLConnection) connection;

		httpURLConnection.setDoOutput(true);
		httpURLConnection.setRequestMethod("POST");
		httpURLConnection.setRequestProperty("Accept-Charset", "utf-8");
		httpURLConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
		httpURLConnection.setRequestProperty("Content-Length", String.valueOf(param.length()));

		OutputStream outputStream = null;
		OutputStreamWriter outputStreamWriter = null;
		InputStream inputStream = null;
		InputStreamReader inputStreamReader = null;
		BufferedReader reader = null;
		String resultBuffer = "";

		try {
			outputStream = httpURLConnection.getOutputStream();
			outputStreamWriter = new OutputStreamWriter(outputStream);

			outputStreamWriter.write(param.toString());
			outputStreamWriter.flush();

			if (httpURLConnection.getResponseCode() >= 300) {
				throw new Exception(
						"HTTP Request is not success, Response code is " + httpURLConnection.getResponseCode());
			}

			inputStream = httpURLConnection.getInputStream();
			resultBuffer = convertStreamToString(inputStream);

		} finally {

			if (outputStreamWriter != null) {
				outputStreamWriter.close();
			}

			if (outputStream != null) {
				outputStream.close();
			}

			if (reader != null) {
				reader.close();
			}

			if (inputStreamReader != null) {
				inputStreamReader.close();
			}

			if (inputStream != null) {
				inputStream.close();
			}

		}

		return resultBuffer;
	}

	/**
	 * 转换返回值类型为UTF-8格式.
	 * 
	 * @param is
	 * @return
	 */
	public static String convertStreamToString(InputStream is) {
		StringBuilder sb1 = new StringBuilder();
		byte[] bytes = new byte[4096];
		int size = 0;

		try {
			while ((size = is.read(bytes)) > 0) {
				String str = new String(bytes, 0, size, "UTF-8");
				sb1.append(str);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				is.close();
			} catch (IOException e) {
				e.printStackTrace();
				Log.error(e.getMessage());
				throw new OperationException("短信接口编码错误！");
			}
		}
		return sb1.toString();
	}

}
