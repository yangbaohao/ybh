package com.zqw.bss.util.security.shiro;

import org.apache.log4j.Logger;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.util.ByteSource;

import com.zqw.bss.model.sys.AcUser;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.util.SystemConfig;

/**
 * <p>
 * Password Helper
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */

public class PasswordHelper {

	private final static Logger logger = Logger.getLogger(PasswordHelper.class
			.getName());

	public static String algorithmName;

	public static String credentialsSalt;

	public static int hashIterations;

	static {

		algorithmName = SystemConfig.getProperty("shiro.algorithmName");
		credentialsSalt = SystemConfig.getProperty("shiro.credentialsSalt");
		hashIterations = Integer.valueOf(SystemConfig
				.getProperty("shiro.hashIterations"));
	}

	public static void encryptPassword(User user) {
		logger.debug("begin encryptPassword . userName =[" + user.getUsername()
				+ "]");

		String newPassword = new SimpleHash(algorithmName, user.getPassword(),
				ByteSource.Util.bytes(credentialsSalt), hashIterations).toHex();

		user.setPassword(newPassword);
		logger.debug("end encryptPassword");
	}
	//给acuser加密使用
	public static void encryptPassword(AcUser user) {
		logger.debug("begin encryptPassword . userName =[" + user.getUsername()
				+ "]");

		String newPassword = new SimpleHash(algorithmName, user.getPassword(),
				ByteSource.Util.bytes(credentialsSalt), hashIterations).toHex();

		user.setPassword(newPassword);
		logger.debug("end encryptPassword");
	}

	public static boolean inputPasswordIsEquealOldPassword(
			String inputPasswordSource, User user) {

		String inputPassword = new SimpleHash(algorithmName,
				inputPasswordSource, ByteSource.Util.bytes(credentialsSalt),
				hashIterations).toHex();

		return inputPassword.equals(user.getPassword());
	}

}
