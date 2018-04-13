package com.zqw.bss.test;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.apache.http.HeaderElement;
import org.apache.http.HeaderElementIterator;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeaderElementIterator;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;

import com.zqw.bss.framework.util.Encodes;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;



public class ServiceTestCase {

//	public static String baseURL = "http://webservice.ydcfo.com/AccountingCloud/";   127.0.0.1
	public static String baseURL = "http://127.0.0.1:8080/ACBss/";

	public static String RESTURL = baseURL + "CXF/rs/";

	public static CloseableHttpClient httpclient = null;

	public static Set<Integer> returnCoseSet = new HashSet<Integer>();

	public static JsonConfig jsonConfig = new JsonConfig();

	// tosysy Authorization vars
	// httpget.setHeader("Authorization", "Basic YWRtaW46MTIzNDU2");
	public static String remoteUsername = "admin";
	public static String remotePassword = "yicui338";
	public static String authcBasic_name = "Authorization";
	public static String authcBasic_value = "Basic "
			+ Encodes.encodeBase64((remoteUsername + ":" + remotePassword)
					.getBytes());
	// httpget.setHeader(authcBasic_name, authcBasic_value);

	static {
		returnCoseSet.add(200);
		returnCoseSet.add(204);

		jsonConfig.registerJsonValueProcessor(Date.class,
				new JsonDateValueProcessor());

		jsonConfig.setJsonPropertyFilter(new IgnoreFieldProcessorImpl(false,
				new String[] { "productTypeByVO", "unitResourceByVO" }));

	}

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {

		httpclient = HttpClients.createDefault();

	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {

		httpclient.close();

	}

	/**
	 *
	 *
	 * */
	public void login(String username, String password)
			throws ClientProtocolException, IOException

	{
		String weburl = baseURL + "page/login/login.jsp";
		HttpPost httppost = new HttpPost(weburl);
		List<NameValuePair> nvps = new ArrayList<NameValuePair>();
		nvps.add(new BasicNameValuePair("username", username));
		nvps.add(new BasicNameValuePair("password", password));

		httppost.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));

		CloseableHttpResponse response = httpclient.execute(httppost);
		System.out.println();
		Assert.assertEquals("登录验证返回错误!", 302, response.getStatusLine()
				.getStatusCode());
		HeaderElementIterator it = new BasicHeaderElementIterator(response
				.headerIterator("Location"));

		while (it.hasNext()) {
			HeaderElement elem = it.nextElement();
			String locstr = elem.getName();

			Assert.assertTrue("登录重定向页面错误！", locstr.endsWith("/page/index.jsp"));
		}

	}

	public String getPostRetrunStr(String URL, Object obj)
			throws ClientProtocolException, IOException {

		StringEntity se = null;

		if (obj instanceof List) {

			JSONArray jsonlist = JSONArray.fromObject(obj, jsonConfig);
			se = new StringEntity(jsonlist.toString(), "UTF-8");
			System.out.println("JSON string is :" + jsonlist.toString());
		} else if (obj instanceof JSONObject) {

			se = new StringEntity(obj.toString(), "UTF-8");
			System.out.println("JSON string is :" + obj.toString());
		}

		else {
			JSONObject jsonObj = JSONObject.fromObject(obj, jsonConfig);
			// se = new StringEntity(jsonObj.toString());
			se = new StringEntity(jsonObj.toString(), "UTF-8");
			System.out.println("JSON string is :" + jsonObj.toString());
		}

		System.out.println("Post String is :" + se.toString());
		se.setContentEncoding("utf-8");
		se.setContentType("application/json");

		String weburl = RESTURL + URL;
		HttpPost httppost = new HttpPost(weburl);
		httppost.setEntity(se);
		httppost.addHeader(authcBasic_name, authcBasic_value);

		CloseableHttpResponse response = httpclient.execute(httppost);

		int returncode = response.getStatusLine().getStatusCode();
		Assert.assertTrue("HTTP POST方法状态错误! returncode =" + returncode,
				returnCoseSet.contains(returncode));

		HttpEntity entity = response.getEntity();
		if (entity == null)
			return "";
		return EntityUtils.toString(entity, "UTF-8");

	}
	
	 
	public String getPostFileRetrunStr(String URL, File file)
			throws ClientProtocolException, IOException {
		
		FileBody fileBody = new FileBody(file,ContentType.MULTIPART_FORM_DATA);
		MultipartEntityBuilder builder = MultipartEntityBuilder.create();
		builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
		builder.addPart("file", fileBody);
		HttpEntity entity = builder.build();
		
		String weburl = RESTURL + URL;
		HttpPost httppost = new HttpPost(weburl);
		httppost.setEntity(entity);
		
		CloseableHttpResponse response = httpclient.execute(httppost);

		int returncode = response.getStatusLine().getStatusCode();
		Assert.assertTrue("HTTP POST方法状态错误! returncode =" + returncode,
				returnCoseSet.contains(returncode));

		HttpEntity entity1 = response.getEntity();
		if (entity1 == null)
			return "";
		return EntityUtils.toString(entity1, "UTF-8");
	}

	public String getPutRetrunStr(String URL, Object obj)
			throws ClientProtocolException, IOException {

		String jsonstr = null;
		if (obj instanceof String) {
			jsonstr = (String) obj;

		} else if (obj instanceof JSONObject) {

			jsonstr = obj.toString();

		} else {
			JSONObject jsonObj = JSONObject.fromObject(obj, jsonConfig);
			jsonstr = jsonObj.toString();

		}

		System.out.println("Put String is :" + jsonstr);
		StringEntity se = new StringEntity(jsonstr, "UTF-8");
		se.setContentEncoding("UTF-8");
		se.setContentType("application/json");

		String weburl = RESTURL + URL;
		HttpPut httppost = new HttpPut(weburl);
		httppost.setEntity(se);
		httppost.addHeader(authcBasic_name, authcBasic_value);

		CloseableHttpResponse response = httpclient.execute(httppost);
		int returncode = response.getStatusLine().getStatusCode();
		Assert.assertTrue("HTTP PUT方法状态错误! returncode =" + returncode,
				returnCoseSet.contains(returncode));
		HttpEntity entity = response.getEntity();
		if (entity == null)
			return "";
		return EntityUtils.toString(entity, "UTF-8");

	}

	public String getPutRetrunStr(String URL) throws ClientProtocolException,
			IOException {
		String weburl = RESTURL + URL;
		HttpPut httppost = new HttpPut(weburl);
		CloseableHttpResponse response = httpclient.execute(httppost);
		int returncode = response.getStatusLine().getStatusCode();
		Assert.assertTrue("HTTP PUT方法状态错误! returncode =" + returncode,
				returnCoseSet.contains(returncode));
		HttpEntity entity = response.getEntity();
		if (entity == null)
			return "";
		return EntityUtils.toString(entity, "UTF-8");
	}

	public String getDelRetrunStr(String URL) throws ClientProtocolException,
			IOException {

		String weburl = RESTURL + URL;
		HttpDelete httpdel = new HttpDelete(weburl);
		httpdel.addHeader(authcBasic_name, authcBasic_value);

		CloseableHttpResponse response = httpclient.execute(httpdel);

		int returncode = response.getStatusLine().getStatusCode();
		Assert.assertTrue("HTTP DEL方法状态错误! returncode =" + returncode,
				returnCoseSet.contains(returncode));

		HttpEntity entity = response.getEntity();
		if (entity == null)
			return "";
		return EntityUtils.toString(entity, "UTF-8");

	}

	public String getGetRetrunStr(String URL) throws ClientProtocolException,
			IOException {

		String weburl = RESTURL + URL;
		HttpGet httpget = new HttpGet(weburl);

		httpget.setHeader(authcBasic_name, authcBasic_value);

		CloseableHttpResponse response = httpclient.execute(httpget);

		int returncode = response.getStatusLine().getStatusCode();
		Assert.assertTrue("HTTP GET方法状态错误! returncode =" + returncode,
				returnCoseSet.contains(returncode));
		HttpEntity entity = response.getEntity();
		if (entity == null)
			return "";
		return EntityUtils.toString(entity, "UTF-8");

	}

	public String getGetRetrunStr(String URL, Object param)
			throws ClientProtocolException, IOException {

		String jsonstr = "";

		if (param instanceof String) {
			jsonstr = jsonstr + (String) param;
		} else if (param instanceof Long) {
			jsonstr = jsonstr + (Long) param;
		} else if (param instanceof List) {
			JSONArray jsonArray = JSONArray.fromObject(param);
			jsonstr = jsonArray.toString();
		} else {
			JSONObject jsonObj = JSONObject.fromObject(param);
			jsonstr = jsonObj.toString();
		}
		StringEntity se = new StringEntity(jsonstr);
		se.setContentEncoding("UTF-8");
		se.setContentType("application/json");
		String weburl = RESTURL + URL;
		HttpGet httpget = new HttpGet(weburl);

		httpget.addHeader(authcBasic_name, authcBasic_value);

		CloseableHttpResponse response = httpclient.execute(httpget);

		int returncode = response.getStatusLine().getStatusCode();
		Assert.assertTrue("HTTP GET方法状态错误! returncode =" + returncode,
				returnCoseSet.contains(returncode));

		HttpEntity entity = response.getEntity();
		if (entity == null)
			return "";
		return EntityUtils.toString(entity, "UTF-8");
	}

}
