package com.zqw.bss.service.remote.msg.impl;

import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import com.zqw.bss.service.remote.msg.PushOCRRequestWebSocketServlet;
import com.zqw.bss.service.remote.msg.PushOCRRequestWebSocketServlet.OnlineUser;
import com.zqw.bss.service.remote.msg.RemoteOCRMsgService;

public class RemoteOCRMsgServiceImpl implements RemoteOCRMsgService {

	@Override
	public Object getOnlineUsers() {
		List<OnlineUser> ous = PushOCRRequestWebSocketServlet.getOnlineUsers();
		Collections.sort(ous, new Comparator<OnlineUser>(){
			@Override
			public int compare(OnlineUser o1, OnlineUser o2) {
				return toStrOnlineUser(o1).compareTo(toStrOnlineUser(o2));
			}});
		StringBuffer sb = new StringBuffer();
		sb.append("NO\tusername\tsessionId\tboundId\tonlineTime\tlastMsgTime\n");
		int i=0;
		for(OnlineUser ou: ous){
			sb.append(++i).append("\t").append(ou.getUsername()).append("\t")
				.append(ou.getSessionId()).append("\t").append(ou.getBoundId()).append("\t")
				.append(ou.getOnlineTime()).append("\t"+ou.getLastMsgTime()+"\n");
		}
		return sb.toString();
	}
	
	private String toStrOnlineUser(OnlineUser ou){
		return ou.getUsername()+"-"+ou.getSessionId()+"@"+ou.getBoundId()+"-"+toTS(ou.getLastMsgTime())+"-"+toTS(ou.getOnlineTime());
	}

	private long toTS(Date d){
		return d==null?0:d.getTime();
	}
}
