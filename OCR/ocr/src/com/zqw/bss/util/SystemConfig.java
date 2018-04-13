package com.zqw.bss.util;

import java.io.IOException;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

public class SystemConfig {
	
	private static final Logger logger = LoggerFactory.getLogger(SystemConfig.class);

	private static Properties shiroConfig = null;
	private static Properties sysConfig = null;
	private static Properties coaConfig = null;
	private static Properties payConfig = null;
	
	private static String shiroConfigPath = "/conf/conf_shiro.properties";
	private static String sysConfigPath = "/conf/conf_sys.properties";
	private static String coaConfigPath = "/conf/conf_coa.properties";
	private static String payConfigPath = "/conf/conf_pay.properties";
	

	static {
		Resource shiroResource = null;
		Resource sysResource = null;
		Resource coaResource = null;
		Resource payResource = null;
		
		//根据系统变量来确定配置文件信息。开发环境下默认是/conf/*.properties
		if(System.getProperty(SystemConstant.CONFIG_PATH) != null) {
			shiroConfigPath = System.getProperty(SystemConstant.CONFIG_PATH) + shiroConfigPath;
			sysConfigPath = System.getProperty(SystemConstant.CONFIG_PATH) + sysConfigPath;
			coaConfigPath = System.getProperty(SystemConstant.CONFIG_PATH) + coaConfigPath;
			payConfigPath = System.getProperty(SystemConstant.CONFIG_PATH) + payConfigPath;
			
			shiroResource = new FileSystemResource(shiroConfigPath);
			sysResource = new FileSystemResource(sysConfigPath);
			coaResource = new FileSystemResource(coaConfigPath);
			payResource = new FileSystemResource(payConfigPath);
		} else {
			shiroResource = new ClassPathResource(shiroConfigPath);
			sysResource = new ClassPathResource(sysConfigPath);
			coaResource = new ClassPathResource(coaConfigPath);
			payResource = new ClassPathResource(payConfigPath);
		}

		try {
			shiroConfig = PropertiesLoaderUtils.loadProperties(shiroResource);
			sysConfig = PropertiesLoaderUtils.loadProperties(sysResource);
			coaConfig = PropertiesLoaderUtils.loadProperties(coaResource);
			payConfig = PropertiesLoaderUtils.loadProperties(payResource);
		} catch (IOException e) {
			logger.error("", e);
		}
	}

	public static String getProperty(String key) {
		return shiroConfig.getProperty(key)==null?null:shiroConfig.getProperty(key).replace(" ", "");
	}
	
	
	public static String getSysProperty(String key) {
		return sysConfig.getProperty(key)==null?null:sysConfig.getProperty(key).replace(" ", "");
	}
	
	
	public static String getCoaProperty(String key) {
		return coaConfig.getProperty(key)==null?null:coaConfig.getProperty(key).replace(" ", "");
	}
	
	public static String getPayProperty(String key) {
		return payConfig.getProperty(key)==null?null:payConfig.getProperty(key);
	}
	
}
