/**
 * 
 */
package com.zqw.bss.util;

import java.io.IOException;
import java.util.Properties;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

/**
 * @author wanghual
 *
 */
public class ErrorMessageUtil {

	public static Properties errorProps = null;

	static {

		Resource resource = new ClassPathResource("/error_msg.properties");
		try {
			
			errorProps = PropertiesLoaderUtils.loadProperties(resource);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public static String getErrorMsg(String errorKey) {

		return errorProps.getProperty(errorKey);
	}

}
