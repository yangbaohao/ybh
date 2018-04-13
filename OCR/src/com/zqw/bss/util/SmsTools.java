package com.zqw.bss.util;
import org.apache.commons.codec.binary.Base64;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.BasicHttpEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import net.sf.json.JSONObject;
import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * 
 * 云之讯短信验证功能
 */

public class SmsTools {

	private static String UTF8 = "utf-8";

	private static String VERSION = "2014-06-30";// 版本

	private static String REST_SERVER = "https://api.ucpaas.com";// REST服务

	private static String ACCOUNTSID = "639607ada9c055a56e013fcd4ab104f8";//

	private static String AUTHTOKEN = "bd96dc3af4c244c8c73890514fb090cc";//

	private static String APPID = "a557bc61261341feafd02e33b0bc9af9";// 应用

	private static String TEMPLATEID = "28360";// 模版



	public static CloseableHttpClient getCloseableHttpClient() throws Exception {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		return httpclient;
	}

	public static  String templateSMS(String to) {

		String result = "";
		int mathNum = (int)((Math.random()*9+1)*1000);

		CloseableHttpClient httpclient = null;

		try {

			httpclient = getCloseableHttpClient();

			// 构造请求URL内容

			String timestamp = dateToStr(new Date(), "yyyyMMddHHmmss");// 时间戳

			String sig = ACCOUNTSID + AUTHTOKEN + timestamp;

			String signature = md5Digest(sig);

			String url = new StringBuffer(REST_SERVER).append("/").append(VERSION)

					.append("/Accounts/").append(ACCOUNTSID)

					.append("/Messages/templateSMS").append("?sig=")

					.append(signature).toString();

			Map<String, String> map = new HashMap<String, String>();

			map.put("accountSid", ACCOUNTSID);

			map.put("authToken", AUTHTOKEN);

			map.put("appId", APPID);

			map.put("templateId", TEMPLATEID);

			map.put("to", to);

			map.put("param", String.valueOf(mathNum));
			JSONObject jsonObject = JSONObject.fromObject(map);    
			String body = jsonObject.toString();

			body = "{\"templateSMS\":" + body + "}";

			HttpResponse response = get("application/json", ACCOUNTSID,

					AUTHTOKEN, timestamp, url, httpclient, body);

			// 获取响应实体信息

			HttpEntity entity = response.getEntity();

			if (entity != null) {

				result = EntityUtils.toString(entity, "UTF-8");
				System.out.println(result);
			}

			// 确保HTTP响应内容全部被读出或者内容流被关闭

			EntityUtils.consume(entity);
			// 关闭连接

			if (httpclient != null) {

				httpclient.close();

			}

		} catch (Exception e) {

			e.printStackTrace();

		}

		return String.valueOf(mathNum);

	}

	public static String templateSMS(String to, String param, String templateId) {

		String result = "";

		CloseableHttpClient httpclient = null;

		try {

			httpclient = getCloseableHttpClient();

			// 构造请求URL内容

			String timestamp = dateToStr(new Date(), "yyyyMMddHHmmss");// 时间戳

			String sig = ACCOUNTSID + AUTHTOKEN + timestamp;

			String signature = md5Digest(sig);

			String url = new StringBuffer(REST_SERVER).append("/").append(VERSION)

					.append("/Accounts/").append(ACCOUNTSID)

					.append("/Messages/templateSMS").append("?sig=")

					.append(signature).toString();

			Map<String, String> map = new HashMap<String, String>();

			map.put("accountSid", ACCOUNTSID);

			map.put("authToken", AUTHTOKEN);

			map.put("appId", APPID);

			map.put("templateId", templateId);

			map.put("to", to);

			map.put("param", param);

			JSONObject jsonObject = JSONObject.fromObject(map);    
			String body = jsonObject.toString();

			body = "{\"templateSMS\":" + body + "}";

			HttpResponse response = get("application/json", ACCOUNTSID,

					AUTHTOKEN, timestamp, url, httpclient, body);

			// 获取响应实体信息

			HttpEntity entity = response.getEntity();

			if (entity != null) {

				result = EntityUtils.toString(entity, "UTF-8");

			}

			// 确保HTTP响应内容全部被读出或者内容流被关闭

			EntityUtils.consume(entity);
			// 关闭连接

			if (httpclient != null) {

				httpclient.close();

			}

		} catch (Exception e) {

			e.printStackTrace();

		}

		return result;

	}

	private static HttpResponse get(String cType, String accountSid,

			String authToken, String timestamp, String url,

			CloseableHttpClient httpclient, String body) throws Exception {

		HttpPost httppost = new HttpPost(url);

		httppost.setHeader("Accept", cType);//

		httppost.setHeader("Content-Type", cType);

		String src = accountSid + ":" + timestamp;

		String auth = base64Encoder(src);

		httppost.setHeader("Authorization", auth);

		BasicHttpEntity requestBody = new BasicHttpEntity();

		requestBody.setContent(new ByteArrayInputStream(body.getBytes("UTF-8")));

		requestBody.setContentLength(body.getBytes("UTF-8").length);

		httppost.setEntity(requestBody);

		HttpResponse response = httpclient.execute(httppost);

		return response;

	}

	public static String dateToStr(Date date, String pattern) {

		if (date == null || date.equals(""))

			return null;

		SimpleDateFormat formatter = new SimpleDateFormat(pattern);

		return formatter.format(date);

	}

	public static String md5Digest(String src) throws Exception {

		MessageDigest md = MessageDigest.getInstance("MD5");

		byte[] b = md.digest(src.getBytes(UTF8));

		return byte2HexStr(b);

	}

	public static String base64Encoder(String src) throws Exception {

		try {
			src = new String(Base64.encodeBase64(src.getBytes()), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			src = new String(Base64.encodeBase64(src.getBytes()));
		}
		return src;
		

	}

	public static String base64Decoder(String dest) throws Exception {

		try {
			dest = new String(Base64.decodeBase64(dest), "UTF-8");
		} catch (UnsupportedEncodingException e) {
			dest = new String(Base64.decodeBase64(dest));
		}
		return dest;

	}

	public static String byte2HexStr(byte[] b) {

		StringBuilder sb = new StringBuilder();

		for (int i = 0; i < b.length; i++) {

			String s = Integer.toHexString(b[i] & 0xFF);

			if (s.length() == 1) {

				sb.append("0");

			}

			sb.append(s.toUpperCase());

		}

		return sb.toString();

	}

	public static void main(String[] args) {


	}

}