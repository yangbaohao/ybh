package com.zqw.bss.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.PhaseInterceptorChain;
import org.apache.cxf.transport.http.AbstractHTTPDestination;
import org.apache.http.HttpEntity;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpDelete;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.junit.Assert;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.util.security.shiro.SessionUtil;

import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;
public class HttpRestUtil{
	private static final Logger log = LoggerFactory.getLogger(HttpRestUtil.class);
	public static final String baseURL =SystemConfig.getSysProperty("tosys.baseurl");
	public static final String remoteUsername =SystemConfig.getSysProperty("tosys.username");
	public static final String remotePassword = SystemConfig.getSysProperty("tosys.password");
	public static final String RESTURL = baseURL + "CXF/rs/";
	public static final String authcBasic_name = "Authorization";
	public final static String utf8 = "UTF-8";
	public static final Set<Integer> returnCoseSet = new HashSet<Integer>();
	public static final JsonConfig jsonConfig = new JsonConfig();
	public static final String authcBasic_value = "Basic "
			+ Encodes.encodeBase64((remoteUsername + ":" + remotePassword).getBytes());
	static GeneralHttpClient httpClient = new GeneralHttpClient().setMaxConnections(100).init();
	
	@SuppressWarnings({ "unchecked", "serial", "rawtypes" })
	static Map<String, String> AUTH_HEADER = new HashMap(){{put(authcBasic_name, authcBasic_value);}};
	private static RestTemplate restTemplate = new RestTemplate(); //可能是版本问题 无法从spring中获取
	static {
		returnCoseSet.add(200);
		returnCoseSet.add(204);

		jsonConfig.registerJsonValueProcessor(Date.class,
				new JsonDateValueProcessor());

		jsonConfig.setJsonPropertyFilter(new IgnoreFieldProcessorImpl(false,
				new String[] { "productTypeByVO", "unitResourceByVO" }));
	}
	/**
	 * 远程获取tooken
	 * @return tooken
	 */
	@SuppressWarnings("unchecked")
	public static String getPostRetrunStrToken() throws ClientProtocolException, IOException {
		if(SessionUtil.get("ocrToken")!=null&&SessionUtil.get("ocrTokenDate")!=null){
			Date ocrTokenDate = (Date)SessionUtil.get("ocrTokenDate");
			Date now = new Date();
			long time = now.getTime()-ocrTokenDate.getTime();
			SessionUtil.put("ocrTokenDate", new Date());
			if(time<100000){//如果是100秒以内
				return SessionUtil.get("ocrToken").toString();
			}
		}
		@SuppressWarnings("rawtypes")
		Map map = new HashMap();
		map.put("username", remoteUsername);
		map.put("password", remotePassword);
		String result =restTemplate.postForObject(RESTURL + "common/ocrToken", map, String.class);
		SessionUtil.put("ocrToken", result);
		SessionUtil.put("ocrTokenDate", new Date());
		return result;
	}
	/**
	 * 远程调用的get接口
	 * @return get接口返回值
	 */
	public static String getGetRetrunStr(String URL) throws ClientProtocolException, IOException {
		String str=getPostRetrunStrToken();
		if(str==null || str.trim().isEmpty()) return null;
		String st=str.substring(1,str.length()-1).replaceAll("\"","").replaceAll(":","=");
		String weburl = RESTURL + URL +"?"+st;
		String result = restTemplate.getForObject(weburl, String.class, AUTH_HEADER);
		return result;
	}
	
	/**
	 * 远程上传文件
	 * POST请求
	 */
	@SuppressWarnings({ "unused", "deprecation" })
	public static String getPostRetrunStr2(String URL, Attachment obj) throws ClientProtocolException, IOException {
		String shortName = "";
		if (obj.getDataHandler().getName() == null) {
			String fileName = obj.getHeader("Content-Disposition");
			shortName = fileName.substring(fileName.indexOf("filename=") + 10, fileName.length() - 1);
		} else {
			shortName = obj.getDataHandler().getName();
		}
		String tmpFileName = System.getProperty("java.io.tmpdir")+File.separatorChar + convertStringEncoding(shortName, "iso-8859-1", "utf-8");
		File tmpFile = new File(tmpFileName);
		InputStream ins= obj.getDataHandler().getInputStream();
		OutputStream out = new FileOutputStream(tmpFile);  
		try {
			byte[] bytes = new byte[2048];
			int len;
			while(-1!=(len=ins.read(bytes, 0, bytes.length))){
				out.write(bytes, 0, len);
			}
			String str=getPostRetrunStrToken();
			if(str==null&&str==""){
				return null;
			}
			String st=str.substring(1,str.length()-1);
			String st1=st.replaceAll("\"","");
			String st2=st1.replaceAll(":","=");
			String weburl = RESTURL + URL+"?"+st2;
			FileSystemResource resource = new FileSystemResource(new File(tmpFileName));//obj.getDataHandler().getInputStream();
	        MultiValueMap<String, Object> param = new LinkedMultiValueMap<>();
	        param.add("file", resource);
	        org.springframework.http.HttpEntity<MultiValueMap<String, Object>> httpEntity = new org.springframework.http.HttpEntity<MultiValueMap<String, Object>>(param);
			ResponseEntity<String> responseEntity = restTemplate.exchange(weburl, HttpMethod.POST, httpEntity, String.class);
			return responseEntity.getBody();
		} finally {
			tmpFile.delete();
			out.close();
		}
		
	}
	/**
	 * 远程下载文件
	 */
	public static Response getXsFile(String URL) throws Exception {
		String str=getPostRetrunStrToken();
		if(str!=null&&str!=""){
			String st=str.substring(1,str.length()-1);
			String st1=st.replaceAll("\"","");
			String st2=st1.replaceAll(":","=");
			String weburl = RESTURL + URL +"?"+st2;
			HttpHeaders headers = new HttpHeaders();
			try {
				List<MediaType> list = new ArrayList<>();
			    list.add(MediaType.valueOf("text/plain"));
			    headers.setAccept(list);
			    ResponseEntity<byte[]> response = restTemplate.exchange(weburl,  HttpMethod.GET,new  org.springframework.http.HttpEntity<byte[]>(headers),  byte[].class);
				String name ="";
				if(response.getHeaders().get("Content-Disposition")!=null){
					 name = response.getHeaders().get("Content-Disposition").toString();
				}
				name = name.substring(name.indexOf("=")+1, name.length());
				byte[] result = response.getBody();
				InputStream content =  new ByteArrayInputStream(result);
				Message messageContext = PhaseInterceptorChain.getCurrentMessage();
				HttpServletResponse httpServletResponse = (HttpServletResponse) messageContext
						.get(AbstractHTTPDestination.HTTP_RESPONSE);
				httpServletResponse.reset();
				httpServletResponse.setHeader("Content-Disposition",
						"attachment;filename=" + new String((name).getBytes(), "iso-8859-1"));
				ServletOutputStream out = httpServletResponse.getOutputStream();
				BufferedInputStream bis = null;
				BufferedOutputStream bos = null;
				try {
					bis = new BufferedInputStream(content);
					bos = new BufferedOutputStream(out);
					byte[] buff = new byte[2048];					
					int len;
					while (-1 != (len = bis.read(buff, 0, buff.length))) {
						bos.write(buff, 0, len);
					}
				} catch (final IOException e) {
					throw e;
				} finally {
					if (bis != null)
						bis.close();
					if (bos != null)
						bos.close();
				}
			} finally {
				//httpclient.close();
			}
		}
		return null;
	}
	
	
	public static String getPostRetrunStr(String URL, Object obj) throws ClientProtocolException, IOException {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		try {
			StringEntity se = null;
			if (obj instanceof JSONObject) {
				se = new StringEntity(obj.toString(), utf8);
				System.out.println("JSON string is :" + obj.toString());
			}
			if (obj instanceof String) {
				se = new StringEntity((String) obj, utf8);
			}
			System.out.println("Post String is :" + se.toString());
			se.setContentEncoding(utf8);
			se.setContentType("application/json");
			String str=getPostRetrunStrToken();
			if(str==null&&str==""){
				httpclient.close();
				return null;
			}
			String st=str.substring(1,str.length()-1);
			String st1=st.replaceAll("\"","");
			String st2=st1.replaceAll(":","=");
			String weburl = RESTURL + URL+"?"+st2;
			HttpPost httppost = new HttpPost(weburl);
			httppost.setEntity(se);
			httppost.addHeader(authcBasic_name, authcBasic_value);
			CloseableHttpResponse response = httpclient.execute(httppost);
			int returncode = response.getStatusLine().getStatusCode();
			Assert.assertTrue("HTTP POST方法状态错误! returncode =" + returncode, returnCoseSet.contains(returncode));
			HttpEntity entity = response.getEntity();
			return EntityUtils.toString(entity, utf8);
		} finally {
			httpclient.close();
		}

	}
	public static String getPutRetrunStr(String URL, Object obj) throws ClientProtocolException, IOException {

		CloseableHttpClient httpclient = HttpClients.createDefault();
		//login(httpclient);
		try {
			StringEntity se = null;

			if (obj instanceof JSONObject) {
				se = new StringEntity(obj.toString(), utf8);
				System.out.println("JSON string is :" + obj.toString());
			}
			if (obj instanceof String) {
				se = new StringEntity((String) obj, utf8);
			}
			se.setContentEncoding(utf8);
			se.setContentType("application/json");

			String str=getPostRetrunStrToken();
			if(str==null&&str==""){
				httpclient.close();
				return null;
			}
			String st=str.substring(1,str.length()-1);
			String st1=st.replaceAll("\"","");
			String st2=st1.replaceAll(":","=");
			String weburl = RESTURL + URL+"?"+st2;
			HttpPut httpput = new HttpPut(weburl);
			httpput.setEntity(se);
			httpput.addHeader(authcBasic_name, authcBasic_value);
			CloseableHttpResponse response = httpclient.execute(httpput);
			int returncode = response.getStatusLine().getStatusCode();
			Assert.assertTrue("HTTP PUT方法状态错误! returncode =" + returncode, returnCoseSet.contains(returncode));

			HttpEntity entity = response.getEntity();

			return EntityUtils.toString(entity, utf8);
		} finally {
			httpclient.close();
		}
	}

	public static String getDelRetrunStr(String URL) throws ClientProtocolException, IOException {

		CloseableHttpClient httpclient = HttpClients.createDefault();
		//login(httpclient);
		try {
			String str=getPostRetrunStrToken();
			if(str==null&&str==""){
				httpclient.close();
				return null;
			}
			String st=str.substring(1,str.length()-1);
			String st1=st.replaceAll("\"","");
			String st2=st1.replaceAll(":","=");
			
			String weburl = RESTURL + URL+"?"+st2;
			//String weburl = RESTURL + URL;
			HttpDelete httpdel = new HttpDelete(weburl);

			httpdel.setHeader(authcBasic_name, authcBasic_value);

			CloseableHttpResponse response = httpclient.execute(httpdel);

			int returncode = response.getStatusLine().getStatusCode();
			Assert.assertTrue("HTTP DEL方法状态错误! returncode =" + returncode, returnCoseSet.contains(returncode));
			HttpEntity entity = response.getEntity();

			return EntityUtils.toString(entity, utf8);
		} finally {
			httpclient.close();
		}

	}


	public static Map<String, String> URLRequest(String URL) {
		Map<String, String> mapRequest = new HashMap<String, String>();
		String strUrlParam = TruncateUrlPage(URL);
		if (strUrlParam == null) {
			return mapRequest;
		}
		String[] arrSplit = strUrlParam.split("[&]");
		for (String strSplit : arrSplit) {
			String[] arrSplitEqual = null;
			arrSplitEqual = strSplit.split("[=]");
			// 解析出键值
			if (arrSplitEqual.length > 1) {
				// 正确解析
				mapRequest.put(arrSplitEqual[0], arrSplitEqual[1]);
			} else {
				if (arrSplitEqual[0] != "") {
					// 只有参数没有值，不加入
					mapRequest.put(arrSplitEqual[0], "");
				}
			}
		}
		return mapRequest;
	}

	private static String TruncateUrlPage(String strURL) {
		String strAllParam = null;
		String[] arrSplit = null;
		strURL = strURL.trim();
		arrSplit = strURL.split("[?]");
		if (strURL.length() > 1) {
			if (arrSplit.length > 1) {
				if (arrSplit[1] != null) {
					strAllParam = arrSplit[1];
				}
			}
		}
		return strAllParam;
	}
	
//	public static Response getXsFile2(String URL) throws Exception {
//		CloseableHttpClient httpclient = HttpClients.createDefault();
//		//login(httpclient);
//		String str=getPostRetrunStrToken();
//		if(str!=null&&str!=""){
//			String st=str.substring(1,str.length()-1);
//			String st1=st.replaceAll("\"","");
//			String st2=st1.replaceAll(":","=");
//			String weburl = RESTURL + URL +"?"+st2;
//			HttpGet httpget = new HttpGet(weburl);
//			File file = null;
//			try {
//				httpget.setHeader(authcBasic_name, authcBasic_value);
//				CloseableHttpResponse response = httpclient.execute(httpget);
////				response.removeHeaders("Content-Disposition");
////				response.addHeader("Content-Disposition","attachment;filename=" + java.net.URLEncoder.encode("xxx", "UTF-8"));
//				String name = response.getFirstHeader("Content-Disposition").toString();
//				System.out.println("ceshimingzi"+name);
//				int returncode = response.getStatusLine().getStatusCode();
//				Assert.assertTrue("HTTP GET方法状态错误! returncode =" + returncode, returnCoseSet.contains(returncode));
//				HttpEntity entity = response.getEntity();
//				if (entity == null)
//					return null;
//				InputStream in = entity.getContent();
//				String tempPath = "D://upload/"+File.separatorChar+UUID.randomUUID()+".doc";
//				file = new File(tempPath);//System.getProperty("java.io.tmpdir")
//				ResponseBuilder responseb;
//				try {
//					FileOutputStream out = new FileOutputStream(file);
//		            int read = 0;  
//		            byte[] bytes = new byte[1024];  
//		  
//		            while ((read = in.read(bytes)) != -1) {  
//		                out.write(bytes, 0, read);  
//		            }  
//		            out.flush();  
//		            out.close(); 
//					/*ByteArrayOutputStream bos = new ByteArrayOutputStream();
//					int bs = -1;
//					byte[] tmp = new byte[1024];
//					while ((bs = in.read(tmp)) != -1) {
//						bos.write(tmp, 0, bs);
//					}
//					bos.flush();
//					return bos.toByteArray();*/
//				} finally {
//					in.close();
//				}
//				responseb = Response.ok(file);
//				responseb.header("Content-Disposition",
//						"attachment;filename=" + java.net.URLEncoder.encode(file.getName(), "UTF-8"));
////
//				return responseb.build();
//
//			} finally {
//				httpclient.close();
////				try {
////					file.delete();
////				} catch (Exception e) {
////					e.printStackTrace();
////				}
//			}
//		}
//		return null;
//	}
	
	public static String convertStringEncoding(String source, String beforeEncoding, String afterEncoding) {
		try {
			return new String(source.getBytes(beforeEncoding),afterEncoding);
		} catch (UnsupportedEncodingException e) {
			log.error("不支持的编码格式 : " + beforeEncoding + "|" + afterEncoding);
			return source;
		}
	}

}












