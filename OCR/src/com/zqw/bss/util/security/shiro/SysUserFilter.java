package com.zqw.bss.util.security.shiro;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.web.filter.PathMatchingFilter;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.service.sys.UserService;

/**
 * <p>
 * SysUser Filter
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@SuppressWarnings("unused")
public class SysUserFilter extends PathMatchingFilter {

	@Autowired
	private UserService userService;

	@Override
	protected boolean onPreHandle(ServletRequest request,
			ServletResponse response, Object mappedValue) throws Exception {

		String username = (String) SecurityUtils.getSubject().getPrincipal();
		//request.setAttribute( "user", userService.getUserByUsername(username));
		return true;
	}
}
