package com.zqw.bss.util;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.util.Map;

import javax.net.ssl.SSLContext;
import javax.ws.rs.HttpMethod;

import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.NoHttpResponseException;
import org.apache.http.client.HttpRequestRetryHandler;
import org.apache.http.client.fluent.Executor;
import org.apache.http.client.fluent.Request;
import org.apache.http.client.fluent.Response;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.LayeredConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLInitializationException;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.apache.http.protocol.HttpContext;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * 
 * @author wm
 *
 */
public class GeneralHttpClient {
	private static final Logger log = LoggerFactory.getLogger(GeneralHttpClient.class);
	
	protected int maxRetryTimes = 3;
	
	protected Integer maxConnectionsPerRoute = null; //default to 2
	protected Integer maxConnections = null; //default to 20
	
	protected boolean useProxy = false;
	protected String proxyHost = null;
	protected int proxyPort = 0;
	
	protected int connectTimeout = 2000;
	protected int readTimeout = 2000;
	
	private PoolingHttpClientConnectionManager connMgr = null;
	private CloseableHttpClient httpClient = null;
	private Executor executor = null;

	public Result call(String method, String url, Map<String, String> headers, Object body, ContentType contentType) throws IOException{
		int statusCode = -1;
		String result = null;
		HttpResponse rawResp = null;
		String exMsg = null;
		Exception ex = null;
		Request req = null;
		
		try{
			if (method==null || (method=method.trim().toUpperCase()).isEmpty()) method="GET";
			if (HttpMethod.GET.equals(method))			{ req = Request.Get(url); }
			else if (HttpMethod.POST.equals(method))	{ req = Request.Post(url); }
			else if (HttpMethod.PUT.equals(method))		{ req = Request.Put(url); }
			else if (HttpMethod.DELETE.equals(method))	{ req = Request.Delete(url); }
			else if (HttpMethod.HEAD.equals(method))	{ req = Request.Head(url); }
			else if (HttpMethod.OPTIONS.equals(method))	{ req = Request.Options(url); }
			else throw new IllegalArgumentException("un-supported method ["+method+"]");
			
			if (useProxy){
				req = req.viaProxy(new HttpHost(proxyHost, proxyPort));
			}
	
			if (headers!=null && headers.size()>0){
				for(Map.Entry<String, String> e: headers.entrySet()){
					req.addHeader(e.getKey(), e.getValue());
				}
			}
	
			if (body != null) {
				setBody(req, contentType, body);
			}
			
			req.connectTimeout(connectTimeout);
			req.socketTimeout(readTimeout);
	
			if (executor==null) throw new RuntimeException("http client not init yet");
			Response resp = executor.execute(req);
			
			rawResp = resp.returnResponse();
			
			if (rawResp!=null && rawResp.getStatusLine()!=null){
				statusCode = rawResp.getStatusLine().getStatusCode();
			}
			
			HttpEntity entity = rawResp.getEntity();
			if (entity != null) {
				byte[] bytes = EntityUtils.toByteArray(entity);
	
				Charset charset = ContentType.getOrDefault(entity).getCharset();
				if (charset == null) {
					charset = Consts.ISO_8859_1;
				}
	
				try {
					result = new String(bytes, charset.name());
				} catch (final UnsupportedEncodingException e) {
					result = new String(bytes);
				}
			}
		}catch(Exception e){
			ex = e;
        	exMsg = e.getMessage();
        	if (exMsg==null||exMsg.trim().isEmpty()) exMsg = e.getClass().getCanonicalName();
			log.warn("failed to call remote service, {}", exMsg, e);
		} finally {
			if (log.isTraceEnabled()){
				log.trace("called remote service: [{}], [{}], header [{}], body [{}], [{}}, result is [{}, {}]" + (ex==null?"":", exception [{}]"),
							method, url, headers, contentType, body, result, rawResp, exMsg, ex);
			}
			if (req!=null){
				try{
					req.abort();
				}catch(Exception e){
					log.warn("failed abort request to remote service ["+url+"], ignored", e);
				}
			}
		}
		
		return new Result(statusCode, result, rawResp);
	}

	private static void setBody(Request req, ContentType contentType, Object body) {
		if (body==null) return;
		
		if (body instanceof String) {
			req.bodyString((String) body, contentType);
		} else if (body instanceof HttpEntity) {
			req.body((HttpEntity) body);
		} else if (body instanceof InputStream) {
			if (contentType == null) {
				req.bodyStream((InputStream) body);
			} else {
				req.bodyStream((InputStream) body, contentType);
			}
		} else if (body instanceof File) {
			req.bodyFile((File) body, contentType);
		} else if (body instanceof byte[]) {
			req.bodyByteArray((byte[]) body);
		} else if (body instanceof NameValuePair) {
			req.bodyForm((NameValuePair) body);
		} else if (body instanceof NameValuePair[]) {
			req.bodyForm((NameValuePair[]) body);
		} else if (body instanceof Iterable) {
			@SuppressWarnings("unchecked")
			Iterable<? extends NameValuePair> ps = (Iterable<? extends NameValuePair>) body;
			req.bodyForm(ps);
		} else {
			throw new IllegalArgumentException("un-supported body type: [" + body.getClass() + "]");
		}
	}
	
	public static class Result {
		private int statusCode;
		private String resultString;
		private HttpResponse rawResp;

		public Result() {
		}

		public Result(int statusCode, String resultString, HttpResponse rawResp) {
			this.statusCode = statusCode;
			this.resultString = resultString;
			this.rawResp = rawResp;
		}
		
		@Override
		public String toString(){
			return "response body: ["+resultString+"], response header: ["+rawResp+"]";
		}

		public String getResultString() {
			return resultString;
		}

		public void setResultString(String resultString) {
			this.resultString = resultString;
		}

		public HttpResponse getRawResp() {
			return rawResp;
		}

		public void setRawResp(HttpResponse rawResp) {
			this.rawResp = rawResp;
		}

		public int getStatusCode() {
			return statusCode;
		}

		public void setStatusCode(int statusCode) {
			this.statusCode = statusCode;
		}

	}
	
	protected GeneralHttpClient init(){
		shutdown();
		initExecutor();
		return this;
	}
	
	protected void shutdown(){
		try{
			if (connMgr!=null) {
				connMgr.shutdown();
				connMgr.close();
			}
		}catch(Exception e){
			log.warn("failed to shutdown general http client, ignored", e);
		}
		
		executor=null;
	}

	private Executor initExecutor() {
		ConnectionSocketFactory csf = getConnectionSocketFactory();
	    
	    final Registry<ConnectionSocketFactory> sfr = RegistryBuilder.<ConnectionSocketFactory>create()
	        .register("http", PlainConnectionSocketFactory.getSocketFactory())
	        .register("https", csf)
	        .build();
	
	    connMgr = new PoolingHttpClientConnectionManager(sfr);
	    if (maxConnections!=null && maxConnections>0) {
		    connMgr.setMaxTotal(maxConnections);
	    }
	    if (maxConnectionsPerRoute!=null && maxConnectionsPerRoute>0){
	    	connMgr.setDefaultMaxPerRoute(maxConnectionsPerRoute);
	    }
	    
	    HttpClientBuilder hcb = HttpClientBuilder.create().setConnectionManager(connMgr);
	    configHttpClientBuilder(hcb);
	    
	    httpClient = hcb.build();
	    
	    executor = Executor.newInstance(httpClient);
	    
		return executor;
	}

	protected ConnectionSocketFactory getConnectionSocketFactory() {
		LayeredConnectionSocketFactory ssl = null;
	    try {
	        ssl = SSLConnectionSocketFactory.getSystemSocketFactory();
	    } catch (final SSLInitializationException ex) {
	        final SSLContext sslcontext;
	        try {
	            sslcontext = SSLContext.getInstance(SSLConnectionSocketFactory.TLS);
	            sslcontext.init(null, null, null);
	            ssl = new SSLConnectionSocketFactory(sslcontext);
	        } catch (Exception e) {
	        	String msg = e.getMessage();
	        	if (msg==null||msg.trim().isEmpty()) msg = e.getClass().getCanonicalName();
	        	log.info("failed to init SSL for http client, ignored, {}", msg, e);
	        }
	    }
	    ConnectionSocketFactory csf = ssl != null ? ssl : SSLConnectionSocketFactory.getSocketFactory();
		return csf;
	}

	private void configHttpClientBuilder(HttpClientBuilder hcb) {
		hcb.disableCookieManagement();
		
		if (maxRetryTimes>0){
		    HttpRequestRetryHandler retryHandler = new HttpRequestRetryHandler() {
	        	@Override
	            public boolean retryRequest(IOException exception, int executionCount, HttpContext context) {
	                if(executionCount >= maxRetryTimes){
	                    return false;
	                }
	                
	                if (exception!=null && (exception instanceof NoHttpResponseException)){
	                    return true;
	                }
	                
	                try{
		                HttpClientContext clientContext = HttpClientContext.adapt(context);
		                if(clientContext!=null && !clientContext.isRequestSent()){
		                	return true;
		                }
	                }catch(Exception e){
	                	//ignore
	                }
	                
	                return false;
	            }
	        };
	        
	        hcb.setRetryHandler(retryHandler);
		}
	}

	public int getMaxRetryTimes() {
		return maxRetryTimes;
	}

	public GeneralHttpClient setMaxRetryTimes(int maxRetryTimes) {
		this.maxRetryTimes = maxRetryTimes;
		return this;
	}

	public Integer getMaxConnectionsPerRoute() {
		return maxConnectionsPerRoute;
	}

	public GeneralHttpClient setMaxConnectionsPerRoute(Integer maxConnectionsPerRoute) {
		this.maxConnectionsPerRoute = maxConnectionsPerRoute;
		return this;
	}

	public Integer getMaxConnections() {
		return maxConnections;
	}

	public GeneralHttpClient setMaxConnections(Integer maxConnections) {
		this.maxConnections = maxConnections;
		return this;
	}

	public boolean isUseProxy() {
		return useProxy;
	}

	public GeneralHttpClient setUseProxy(boolean useProxy) {
		this.useProxy = useProxy;
		return this;
	}

	public String getProxyHost() {
		return proxyHost;
	}

	public GeneralHttpClient setProxyHost(String proxyHost) {
		this.proxyHost = proxyHost;
		return this;
	}

	public int getProxyPort() {
		return proxyPort;
	}

	public GeneralHttpClient setProxyPort(int proxyPort) {
		this.proxyPort = proxyPort;
		return this;
	}

	public int getConnectTimeout() {
		return connectTimeout;
	}

	public GeneralHttpClient setConnectTimeout(int connectTimeout) {
		this.connectTimeout = connectTimeout;
		return this;
	}

	public int getReadTimeout() {
		return readTimeout;
	}

	public GeneralHttpClient setReadTimeout(int readTimeout) {
		this.readTimeout = readTimeout;
		return this;
	}

}
