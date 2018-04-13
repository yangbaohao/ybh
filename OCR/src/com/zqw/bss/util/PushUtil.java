package com.zqw.bss.util;

import java.util.HashMap;
import java.util.Map;

import cn.jpush.api.JPushClient;
import cn.jpush.api.push.PushResult;
import cn.jpush.api.push.model.Options;
import cn.jpush.api.push.model.Platform;
import cn.jpush.api.push.model.PushPayload;
import cn.jpush.api.push.model.audience.Audience;
import cn.jpush.api.push.model.notification.Notification;

/**
 * 极光推送工具类
 * @version 1.0
 */
public class PushUtil {

	public static final String APPKEY = "2f3fce39bd8a146b74b0abac";
	public static final String APPSECRET = "2bd7fb44d2aa5f13a04fd6cf";

	// JPushCLient对象，负责进行消息推送
	private static JPushClient pushClient = new JPushClient(APPSECRET, APPKEY);

	public PushUtil() {
		pushClient = new JPushClient(APPSECRET, APPKEY);
	}

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
		try {
			// 创建发送给所有人的PushPayload对象
			PushPayload.Builder payloadBuilder;
			// 设置推送消息参数
			try {
				payloadBuilder = getPayloadBuilder(Platform.ios(), Audience.all());
				Options options = Options.sendno();
				options.setApnsProduction(false);// true代表ios是生产环节，false是开发环境，具体根据ios配置的证书设置
				payloadBuilder.setOptions(options);
				PushPayload payload = payloadBuilder.setNotification(Notification.ios(content, extras)).build();
				PushResult result = pushClient.sendPush(payload);
				System.out.println(result.getOriginalContent());
			} catch (Exception e) {
				System.out.println("ios推送消息失败!");
			}

			payloadBuilder = getPayloadBuilder(Platform.android(), Audience.all());
			PushPayload payload = payloadBuilder.setNotification(Notification.android(content, title, extras)).build();
			PushResult result = pushClient.sendPush(payload);
			System.out.println(result.getOriginalContent());
			return true;
		} catch (Exception e) {
			System.out.println("android推送消息失败!");
		}
		return false;
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
//		PushUtil pu = new PushUtil();
//		boolean send = pu.sendPush4All("秒账", "十面\"霾\"伏，请做好健康防护，注意行车安全");
//		System.out.println(send);

		// 推送个人————有链接
		/*
		 * String[] arr = new String[1]; arr[0] = "18765915082"; PushUtil pu =
		 * new PushUtil(); Map<String,String> extras = new
		 * HashMap<String,String>(); extras.put("type","1");//推送类型 0=账单 1=公告
		 * extras.put("url","");//url链接 boolean send =
		 * pu.sendPushByAlias("秒账","买房可享中央空调主机0元购套餐，3免3送，详情戳这儿！",arr,extras);
		 * System.out.println(send);
		 */

//		 推送个人————无链接
//		 String[] arr = new String[1];
//		 arr[0] = "18765915082";
//		 PushUtil pu = new PushUtil();
//		 boolean send =
//		 pu.sendPushByAlias("秒账","十面\"霾\"伏，请做好健康防护，注意行车安全",arr);
//		 System.out.println(send);
	}

	// 推送给拥有Alias别名用户消息
	public static boolean sendPushByAlias(String title, String content, String[] alias) {
		return sendPushByAlias(title, content, alias, new HashMap<String, String>());
	}

	// 推送给拥有Alias别名用户消息
	public static boolean sendPushByAlias(String title, String content, String[] alias, Map<String, String> extras) {

		try {
			// 创建发送给拥有Alias别名用户的PushPayload对象
			PushPayload.Builder payloadBuilder;
			PushPayload payload;
			try {
				payloadBuilder = getPayloadBuilder(Platform.ios(), Audience.alias(alias));
//				payloadBuilder = getPayloadBuilder(Platform.ios(),Audience.registrationId("191e35f7e07462f37b9"));
				// 设置推送消息参数
				Options options = Options.sendno();
				options.setApnsProduction(false);// true代表ios是生产环节，false是开发环境，具体根据ios配置的证书设置
				payloadBuilder.setOptions(options);
				payload = payloadBuilder.setNotification(Notification.ios(content, extras)).build();
				pushClient.sendPush(payload);
				System.out.println("ios推送"+alias[0]+"消息成功!");
			} catch (Exception e) {
				System.out.println("ios推送消息失败!");
			}
			
//			payloadBuilder = getPayloadBuilder(Platform.android(), Audience.alias(alias));
//			payload = payloadBuilder.setNotification(Notification.android(content, title, extras)).build();
//			pushClient.sendPush(payload);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("android推送消息失败!");
		}
		return false;
	}

	public static boolean sendPushByTags(String title, String content, String[] tags) {
		return sendPushByTags(title, content, tags, new HashMap<String, String>());
	}

	// 推送消息
	public static boolean sendPushByTags(String title, String content, String[] tags, Map<String, String> extras) {

		try {
			// 创建发送给拥有Tag标签用户的PushPayload对象
			PushPayload.Builder payloadBuilder = getPayloadBuilder(Platform.ios(), Audience.tag(tags));
			// 设置推送消息参数
			PushPayload payload = payloadBuilder.setNotification(Notification.ios(content, extras)).build();
			pushClient.sendPush(payload);

			payloadBuilder = getPayloadBuilder(Platform.android(), Audience.tag(tags));
			payload = payloadBuilder.setNotification(Notification.android(content, title, extras)).build();
			pushClient.sendPush(payload);
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println("推送消息失败!");
		}
		return false;
	}
}
