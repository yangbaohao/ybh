package com.zqw.bss.util.security.shiro;

import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.DisabledAccountException;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.subject.PrincipalCollection;
import org.jfree.util.Log;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.zqw.account.framework.exception.OperationException;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.SystemConfig;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;

/**
 * <p>
 * Realm Util 实现认证及授权常用的工具类
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */

public class RealmUtil {

	/**
	 * 获取JDBC方式的授权信息
	 * 
	 * @param PrincipalCollection
	 *            principals
	 * @param UserService
	 *            userService
	 * @return AuthorizationInfo
	 */
	static public AuthorizationInfo getJdbcAuthorizationInfo(PrincipalCollection principals, UserService userService) {
		String username = (String) principals.getPrimaryPrincipal();

		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		authorizationInfo.setRoles(userService.getRoleNamesByUsername(username));
		authorizationInfo.setStringPermissions(userService.getPermissionsByUsername(username));

		SessionUtil.put(SystemConstant.SESSION_KEY_USER_PERMISSIONS, authorizationInfo.getStringPermissions());

		SessionUtil.put(SystemConstant.SESSION_KEY_USER_ROLES, authorizationInfo.getRoles());
	
		return authorizationInfo;
	}

	/**
	 * 获取JDBC方式的认证信息
	 * 
	 * @param PrincipalCollection
	 *            principals
	 * @param UserService
	 *            userService
	 * @return AuthorizationInfo
	 */
	static public AuthenticationInfo getJdbcAuthenticationInfo(AuthenticationToken token, UserService userService,
			String realmName) {
		String username = (String) token.getPrincipal();
		User user = userService.getUserByUsername(username);
		
		if (user == null) {
			throw new UnknownAccountException();// 没找到帐号
		}

		if(!user.getOwnerId().toString().equals("-2")){
			throw new DisabledAccountException();
		}
		
		if (Boolean.TRUE.equals(user.getLocked())) {
			throw new LockedAccountException(); // 帐号锁定
		}
		/*//限制ip登陆
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		List<String> lists = userService.getIps();
		String ip = WebUtil.getIpAddr(request);
		if(!lists.contains("内网")){
			if(!lists.contains(ip)){
				Log.error(""+ip+"被禁止登陆");
				throw new OperationException("此ip不允许登陆");
			}
		}*/
		
		// 交给AuthenticatingRealm使用CredentialsMatcher进行密码匹配，如果觉得人家的不好可以自定义实现
		SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(user.getUsername(), // 用户名
				user.getPassword(), // 密码
				new CustomSimpleByteSource(PasswordHelper.credentialsSalt.getBytes()), realmName

		);

		getJdbcAuthorizationInfo(authenticationInfo.getPrincipals(), userService);

		SessionUtil.put(SystemConstant.SESSION_KEY_USER_NAME, user.getUsername());
		SessionUtil.put(SystemConstant.SESSION_KEY_USERINFO_ID, user.getUserInfo().getId());
		SessionUtil.put(SystemConstant.SESSION_KEY_USERINFO_NAME, user.getUserInfo().getName());
		SessionUtil.put(SystemConstant.SESSION_KEY_OWNER_ID, user.getOwnerId());

		return authenticationInfo;
	}

}
