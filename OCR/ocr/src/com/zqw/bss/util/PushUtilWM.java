package com.zqw.bss.util;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.http.entity.ContentType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zqw.bss.util.GeneralHttpClient.Result;

import cn.jpush.api.common.ClientConfig;
import cn.jpush.api.push.model.Options;
import cn.jpush.api.push.model.Platform;
import cn.jpush.api.push.model.PushPayload;
import cn.jpush.api.push.model.audience.Audience;
import cn.jpush.api.push.model.notification.Notification;

/**
 * 极光推送工具类
 * 
 * @version 1.0
 */
public class PushUtilWM {

	private static final Logger logger = LoggerFactory.getLogger(PushUtilWM.class);

	public static final String APPKEY = "2f3fce39bd8a146b74b0abac";
	public static final String APPSECRET = "2bd7fb44d2aa5f13a04fd6cf";

	// JPushCLient对象，负责进行消息推送
	// private static JPushClient pushClient = new JPushClient(APPSECRET,
	// APPKEY);
	private static PushClient pushClient = new PushClient(APPSECRET, APPKEY);

	private static PushPayload.Builder getPayloadBuilder(Platform platform, Audience audience) {
		return PushPayload.newBuilder()
				// 限制推送平台
				.setPlatform(platform)
				// 限制推送对象为所有设备
				.setAudience(audience);
	}

	// 推送给拥有Alias别名用户消息
	public static boolean sendPush4All(String title, String content) {
		return sendPush4All(title, content, new HashMap<String, String>());
	}

	// 推送广播消息
	public static boolean sendPush4All(String title, String content, Map<String, String> extras) {
		PushPayload payload = null;
		Result result = null;

		PushPayload.Builder payloadBuilder = null;

		try {
			payloadBuilder = getPayloadBuilder(Platform.ios(), Audience.all());
			Options options = Options.sendno();
			Boolean flag = Boolean.FALSE;
			if (SystemConfig.getSysProperty("sys.jpush.status").equals("Y")) {
				flag = true;
			}
			options.setApnsProduction(flag);// true代表ios是生产环节，false是开发环境，具体根据ios配置的证书设置
			payloadBuilder.setOptions(options);
			payload = payloadBuilder.setNotification(Notification.ios(content, extras)).build();
			result = pushClient.sendPush(payload);
			logger.error("{}", result.getResultString());
		} catch (Exception e) {
			logger.error("ios推送消息失败! result: {}, payload: {}", result, payload, e);
		}

		try {
			payloadBuilder = getPayloadBuilder(Platform.android(), Audience.all());
			payload = payloadBuilder.setNotification(Notification.android(content, title, extras)).build();
			result = pushClient.sendPush(payload);
			logger.error("{}", result.getResultString());

			return true;
		} catch (Exception e) {
			logger.error("android推送消息失败! result: {}, payload: {}", result, payload, e);
			return false;
		}

	}

	public static void main(String[] args) {
		// 推送所有————有链接
		/*
		 * PushUtil pu = new PushUtil(); Map<String,String> extras = new
		 * HashMap<String,String>(); extras.put("type","1");//推送类型 0=账单 1=公告
		 * extras.put("url","");//url链接 boolean send =
		 * pu.sendPush4All("秒账","买房可享中央空调主机0元购套餐，3免3送，详情戳这儿！",extras);
		 * System.out.println(send);
		 */

		// 推送所有————无链接
		// PushUtil pu = new PushUtil();
		// boolean send = pu.sendPush4All("秒账", "十面\"霾\"伏，请做好健康防护，注意行车安全");
		// System.out.println(send);

		// 推送个人————有链接
		/*
		 * String[] arr = new String[1]; arr[0] = "18765915082"; PushUtil pu =
		 * new PushUtil(); Map<String,String> extras = new
		 * HashMap<String,String>(); extras.put("type","1");//推送类型 0=账单 1=公告
		 * extras.put("url","");//url链接 boolean send =
		 * pu.sendPushByAlias("秒账","买房可享中央空调主机0元购套餐，3免3送，详情戳这儿！",arr,extras);
		 * System.out.println(send);
		 */

		// 推送个人————无链接
//		for(int i=0;i<10;i++){
//		 String[] arr = new String[1];
//		 arr[0] = "191e35f7e07f883f68f";
//		 arr[1] = "121c83f7601185e137e";
//		 boolean send = PushUtilWM.sendPushByAlias("秒账","十面\"霾\"伏，请做好健康防护，注意行车安全", arr, new HashMap<String, String>());
//		 System.out.println(i+"\t"+send);
//		}
		
		// 推送个人————无链接RegistrationIds
//		 List<String> arr = new ArrayList<String>();
//		 arr.add("191e35f7e07f883f68f");
//		 arr.add("121c83f7601185e137e");
//		 boolean send = PushUtilWM.sendPushByRegistrationIds("秒账","十面\"霾\"伏，请做好健康防护，注意行车安全", arr, new HashMap<String, String>());
//		 System.out.println(send);
	}

	// 推送给拥有Alias别名用户消息
	public static boolean sendPushByAlias(String title, String content, String[] alias) {
		return sendPushByAlias(title, content, alias, new HashMap<String, String>());
	}

	// 推送给拥有Alias别名用户消息
	public static boolean sendPushByAlias(String title, String content, String[] alias, Map<String, String> extras) {
		PushPayload payload = null;
		Result result = null;
		try {
			PushPayload.Builder payloadBuilder = null;

			try {
//				if (SystemConfig.getSysProperty("sys.jpush.status").equals("N")) {
//					alias[0] = "cs"+alias[0];
//				}
				payloadBuilder = getPayloadBuilder(Platform.ios(), Audience.alias(alias));
				// payloadBuilder =
				// getPayloadBuilder(Platform.ios(),Audience.registrationId("191e35f7e07462f37b9"));
				Options options = Options.sendno();
				Boolean flag = Boolean.FALSE;
				if (SystemConfig.getSysProperty("sys.jpush.status").equals("Y")) {
					flag = true;
				}
				options.setApnsProduction(flag);// true代表ios是生产环节，false是开发环境，具体根据ios配置的证书设置
				payloadBuilder.setOptions(options);
				payload = payloadBuilder.setNotification(Notification.ios(content, extras)).build();
				result = pushClient.sendPush(payload);
				logger.error("{}", result.getResultString());
			} catch (Exception e) {
				logger.error("tag推送ios消息失败! result: {}, payload: {}", result, payload, e);
			}

			payloadBuilder = getPayloadBuilder(Platform.android(), Audience.alias(alias));
			payload = payloadBuilder.setNotification(Notification.android(content, title, extras)).build();
			result = pushClient.sendPush(payload);
			logger.error("{}", result.getResultString());
			return true;
		} catch (Exception e) {
			logger.error("tag推送android消息失败! result: {}, payload: {}", result, payload, e);
			return false;
		}
	}

	public static boolean sendPushByTags(String title, String content, String[] tags) {
		return sendPushByTags(title, content, tags, new HashMap<String, String>());
	}

	// 推送消息
	public static boolean sendPushByTags(String title, String content, String[] tags, Map<String, String> extras) {
		PushPayload payload = null;
		Result result = null;

		PushPayload.Builder payloadBuilder = null;

		try {
			// 创建发送给拥有Tag标签用户的PushPayload对象
			payloadBuilder = getPayloadBuilder(Platform.ios(), Audience.tag(tags));
			// 设置推送消息参数
			payload = payloadBuilder.setNotification(Notification.ios(content, extras)).build();
			result = pushClient.sendPush(payload);
			logger.error("{}", payload, result.getResultString());
			logger.error("ios 推送消息成功！");
		} catch (Exception e) {
			logger.error("ios tag推送消息失败! result: {}, payload: {}", result, payload, e);
		}

		try {
			payloadBuilder = getPayloadBuilder(Platform.android(), Audience.tag(tags));
			payload = payloadBuilder.setNotification(Notification.android(content, title, extras)).build();
			result = pushClient.sendPush(payload);
			logger.error("{}", payload, result.getResultString());

			return true;
		} catch (Exception e) {
			logger.error("android tag推送消息失败! result: {}, payload: {}", result, payload, e);
			return false;
		}
	}

	// 根据registrationId推送给用户消息
	public static boolean sendPushByRegistrationIds(String title, String content, List<String> registrationIds, Map<String, String> extras) {
		PushPayload payload = null;
		Result result = null;
		try {
			PushPayload.Builder payloadBuilder = null;

			try {
				payloadBuilder = getPayloadBuilder(Platform.ios(), Audience.registrationId(registrationIds));
				Options options = Options.sendno();
				options.setApnsProduction(true);// true代表ios是生产环节，false是开发环境，具体根据ios配置的证书设置
				payloadBuilder.setOptions(options);
				payload = payloadBuilder.setNotification(Notification.ios(content, extras)).build();
				result = pushClient.sendPush(payload);
				logger.error("tag推送ios消息成功", result.getResultString());
			} catch (Exception e) {
				logger.error("tag推送ios消息失败! result: {}, payload: {}", result, payload, e);
			}

			payloadBuilder = getPayloadBuilder(Platform.android(), Audience.registrationId(registrationIds));
			payload = payloadBuilder.setNotification(Notification.android(content, title, extras)).build();
			result = pushClient.sendPush(payload);
			logger.error("tag推送android消息成功", result.getResultString());
			return true;
		} catch (Exception e) {
			logger.error("tag推送android消息失败! result: {}, payload: {}", result, payload, e);
			return false;
		}
	}
	
	public static class PushClient extends GeneralHttpClient {

		private static final Logger log = LoggerFactory.getLogger(PushClient.class);

		private static final String JPUSH_PUSHSVC_URL = "https://api.jpush.cn/v3/push/";

		private final Map<String, String> DEFAULT_HEADERS = new HashMap<String, String>() {
			{
				put("Connection", "Keep-Alive");
				put("Content-Type", ContentType.APPLICATION_JSON.toString());
			}
		};

		PushClient(String APPSECRET, String APPKEY) {
			// TODO read from configuration
			DEFAULT_HEADERS.put("Authorization",
					"Basic " + Base64.encodeBase64String((APPKEY + ":" + APPSECRET).getBytes()));
			this.maxRetryTimes = ClientConfig.DEFULT_MAX_RETRY_TIMES;
			this.maxConnectionsPerRoute = 500;
			this.maxConnections = 500;
			this.connectTimeout = ClientConfig.DEFAULT_CONNECTION_TIMEOUT;
			this.readTimeout = ClientConfig.DEFAULT_READ_TIMEOUT;

			init();
		}

		public Result sendPush(PushPayload payload) throws IOException {
			Result r = call("POST", JPUSH_PUSHSVC_URL, DEFAULT_HEADERS, payload.toString(),
					ContentType.APPLICATION_JSON);
			if (r.getStatusCode() / 100 != 2) {// http://docs.jiguang.cn/jpush/server/push/http_status_code/
				log.error("failed to jpush: status code {}, response is {}, {}, payload is {}", r.getStatusCode(),
						r.getResultString(), r.getRawResp(), payload);
//				throw new OperationException("极光推送失败");
			}
			return r;
		}
	}
}
