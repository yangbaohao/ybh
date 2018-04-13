package com.zqw.bss.service.remote.msg;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;

import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.StreamInbound;
import org.apache.catalina.websocket.WebSocketServlet;
import org.apache.catalina.websocket.WsOutbound;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.zqw.bss.util.RedisHelper;
import com.zqw.bss.util.RedisHelper.MessageConsumer;

/**
 * this servlet only works on tomcat 7, need to refactor using spring web socket
 * 
 * @author wm 2017/8/17
 *
 */
//TODO using spring websocket or JSR-356(javax.websocket.server.ServerEndpoint) to refactor it
@SuppressWarnings("deprecation")
public class PushOCRRequestWebSocketServlet extends WebSocketServlet {
	
	private static final Logger logger = LoggerFactory.getLogger(PushOCRRequestWebSocketServlet.class);
	
	private static final long serialVersionUID = 1L;
	
	private static final UserPool userPool = new UserPool();
	
	private static final String channelName = "q:sh:ocr:request";
	
	private void onOcrRequestMsg(String message){
		//TODO retrieve data from message sent from SimpleAC
		// then format the text block to be sent to browser
		// finally send the text block to browser using	userPool.sendMsg(message)
		
		Map<String, Object> msg = new HashMap<String, Object>();
		msg.put("type", "newOcrReq");
		msg.put("data", message);
		userPool.sendMsg(JSON.toJSONString(msg));
	}
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		subscribe();
	}
	
	private void subscribe(){
		Thread t = new Thread(){
			@Override
			public void run() {
				while(true){
					try{
						RedisHelper.subscribe(new MessageConsumer(){
							@Override
							public void consume(String channel, String message) {
								onOcrRequestMsg(message);
							}}, channelName);
					}catch(Throwable e){
						logger.warn("failed when subscribing ocr requesting queue, sleep awhile and subscribe again", e);
						try {
							Thread.sleep(3*1000L);
						} catch (InterruptedException ignore) {
							//ignore and continue;
						}
					}
				}
			}
		};
		t.setName("subscribe to redis for ocr requests on "+this);
		t.start();
		
		userPool.startHeartbeat();
	}
	
	public static List<OnlineUser> getOnlineUsers(){
		return userPool.getOnlineUsers();
	}
	
	@SuppressWarnings("serial")
	private static final String msgNotifyLogin = JSON.toJSONString(new HashMap<String, Object>(){{
		put("type", "error");
		put("data", new HashMap<String, String>(){{
					put("errorCode", "401");
					put("errorMsg", "请重新登录");}});
	}});
	
	@Override
	protected StreamInbound createWebSocketInbound(String subProtocol, HttpServletRequest req) {
		return new MsgInBound(subProtocol, req);
	}

	private static class MsgInBound extends MessageInbound{
		@SuppressWarnings("unused")
		private String subProtocol;
		private String usernameSessionId;
		
		MsgInBound(String subProtocol, HttpServletRequest req){
			this.subProtocol = subProtocol;
			Subject subject = SecurityUtils.getSubject();
			if (subject.isAuthenticated()){
				this.usernameSessionId = (String)subject.getPrincipal()+"-"+subject.getSession().getId();
			}
		}

		@Override
		protected void onBinaryMessage(ByteBuffer message) throws IOException {
			throw new UnsupportedOperationException("binary message not supported");
		}

		@Override
		protected void onTextMessage(CharBuffer message) throws IOException {
			//this.getWsOutbound().writeTextMessage(message);
		}

		@Override
		protected void onClose(int status) {
			super.onClose(status);
			userPool.remove(usernameSessionId, this);
			logger.info("OCR user [{}] dis-connected", usernameSessionId);
		}

		@Override
		protected void onOpen(WsOutbound outbound) {
			if (usernameSessionId==null){
				try {
					WsOutbound o = this.getWsOutbound();
					if (o!=null){
						o.writeTextMessage(CharBuffer.wrap(msgNotifyLogin));
						o.flush();
					}
				} catch (IOException e) {
					logger.warn("failed to send re-login msg", e);
				}
			} else {
				userPool.add(usernameSessionId, this);
				logger.info("OCR user [{}] connected", usernameSessionId);
			}
		}
		
	}
	
	public static class OnlineUser {
		private String username;
		private String sessionId;
		private String boundId;
		private Date onlineTime;
		private Date lastMsgTime;

		public String getUsername() {
			return username;
		}

		public void setUsername(String username) {
			this.username = username;
		}

		public String getSessionId() {
			return sessionId;
		}

		public void setSessionId(String sessionId) {
			this.sessionId = sessionId;
		}

		public String getBoundId() {
			return boundId;
		}

		public void setBoundId(String boundId) {
			this.boundId = boundId;
		}

		public Date getOnlineTime() {
			return onlineTime;
		}

		public void setOnlineTime(Date onlineTime) {
			this.onlineTime = onlineTime;
		}

		public Date getLastMsgTime() {
			return lastMsgTime;
		}

		public void setLastMsgTime(Date lastMsgTime) {
			this.lastMsgTime = lastMsgTime;
		}
	}
	
	private static class UserPool{
		private ConcurrentHashMap<String, MsgInBound> users = new ConcurrentHashMap<String, MsgInBound>();
		private ConcurrentHashMap<String, Long> userOnlineTime = new ConcurrentHashMap<String, Long>();
		private ConcurrentHashMap<String, Long> userLastMsgTime = new ConcurrentHashMap<String, Long>();
		
		public UserPool(){
		}
		
		public void add(String username, MsgInBound msgInbound){
			if (username==null || msgInbound==null) return;
			
			users.put(username+"@"+msgInbound.hashCode(), msgInbound);
			userOnlineTime.put(username+"@"+msgInbound.hashCode(), System.currentTimeMillis());
		}
		
		public void remove(String username, MsgInBound msgInbound){
			if (username==null || msgInbound==null) return;
			
			users.remove(username+"@"+msgInbound.hashCode());
			userOnlineTime.remove(username+"@"+msgInbound.hashCode());
			userLastMsgTime.remove(username+"@"+msgInbound.hashCode());
		}
		
		public List<OnlineUser> getOnlineUsers(){
			Set<String> us = users.keySet();
			List<OnlineUser> nus = new ArrayList<OnlineUser>();
			for(String u: us){
				//nus.add(u.substring(0, u.lastIndexOf('@')));
				OnlineUser ou = new OnlineUser();
				ou.setUsername(u.substring(0, u.indexOf('-')));
				ou.setSessionId(u.substring(u.indexOf('-')+1, u.lastIndexOf('@')));
				ou.setBoundId(u.substring(u.lastIndexOf("@")+1));
				ou.setOnlineTime(toDate(userOnlineTime.get(u)));
				ou.setLastMsgTime(toDate(userLastMsgTime.get(u)));
				
				nus.add(ou);
			}
			return nus;
		}
		
		private Date toDate(Long ts){
			return ts==null?null:new Date(ts);
		}
		
		@SuppressWarnings("unused")
		public void sendMsgToUser(String username, String message) throws IOException{
			Set<Entry<String, MsgInBound>> es = users.entrySet();
			for(Entry<String, MsgInBound> e: es){
				String un0 = e.getKey();
				String un = un0.substring(0,  un0.lastIndexOf('@'));
				if (un.equals(username)){
					MsgInBound mib = e.getValue();
					if (mib!=null){
						mib.getWsOutbound().writeTextMessage(CharBuffer.wrap(message));
						userLastMsgTime.put(un0, System.currentTimeMillis());
					}
				}
			}
		}
		
		public void sendMsg(final String message){
			for(final Map.Entry<String, MsgInBound> e: users.entrySet()){
				final String un = e.getKey();
				final MsgInBound mib = e.getValue();
				if (mib!=null){
					esSendMsg.execute(new Runnable(){@Override public void run(){
						try {
							if (mib!=null) {
								mib.getWsOutbound().writeTextMessage(CharBuffer.wrap(message));
								userLastMsgTime.put(un, System.currentTimeMillis());
							}
						} catch (Throwable ex) {
							logger.warn("failed to send message to user [{}], ignored and continue next user", e.getKey(), ex);
						}
					}});
				}
			}
		}
		
		private static final ExecutorService esSendMsg = new ThreadPoolExecutor(20, 100, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(), new ThreadFactory(){
			private final AtomicInteger threadIdx = new AtomicInteger(0);
			@Override
			public Thread newThread(Runnable r) {
				Thread t = new Thread(r, "send msg via websocket: "+threadIdx.incrementAndGet());
				return t;
			}
		});
		
		public void startHeartbeat(){
			ScheduledExecutorService esWSHeartbeat= Executors.newSingleThreadScheduledExecutor(new ThreadFactory(){
				@Override
				public Thread newThread(Runnable r) {
					Thread t = new Thread(r, "heartbeating websocket that notifying ocr request");
					return t;
				}});
			esWSHeartbeat.scheduleAtFixedRate(new Runnable(){
				@Override
				public void run() {
					try{
						if (logger.isDebugEnabled()) logger.debug("OCR Websocket user number: {}", users.size());
						if (logger.isTraceEnabled() && users.size()>0) logger.trace("OCR Websocket users: {}", users.keySet());
						for(Map.Entry<String, MsgInBound> e: users.entrySet()){
							try {
								MsgInBound mib = e.getValue();
								if (mib!=null)  mib.getWsOutbound().writeTextMessage(CharBuffer.wrap("{}"));
							} catch (Throwable ex) {
								logger.warn("failed to heartbeating user [{}], ignored and continue next user", e.getKey(), ex);
							}
						}
					}catch(Throwable t){
						logger.warn("failed to heartbeating, ignored and wait for next retry", t);
					}
				}}, 38, 49, TimeUnit.SECONDS);
		}
	}
}
