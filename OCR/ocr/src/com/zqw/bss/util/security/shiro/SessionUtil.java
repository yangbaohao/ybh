package com.zqw.bss.util.security.shiro;

import org.apache.shiro.SecurityUtils;

public class SessionUtil {

	static public void put(String key, Object value) {

		SecurityUtils.getSubject().getSession().setAttribute(key, value);

	}

	static public Object get(String key) {

		return SecurityUtils.getSubject().getSession().getAttribute(key);

	}

}
