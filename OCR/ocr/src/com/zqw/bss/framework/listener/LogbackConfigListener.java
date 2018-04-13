package com.zqw.bss.framework.listener;

import java.io.File;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;

import org.springframework.core.io.Resource;
import com.zqw.account.framework.util.StringUtil;
import com.zqw.bss.util.SystemConstant;

import ch.qos.logback.classic.LoggerContext;
import ch.qos.logback.classic.joran.JoranConfigurator;
import ch.qos.logback.core.joran.spi.JoranException;
 
/**
 * @description 修改logback.xml的路径
 * @path com.cxfmvcstu.comn.LogbackConfigListener
 * @author Chen Liang
 * @time 2017年11月13日
 */
public class LogbackConfigListener implements ServletContextListener {
    private static final Logger logger = LoggerFactory.getLogger(LogbackConfigListener.class);
 
    @Override
    public void contextInitialized(ServletContextEvent event) {
        //从系统变量中加载指定文件名的日志配置文件
    	String configPath = System.getProperty(SystemConstant.CONFIG_PATH);
    	String logbackPath = "logback.xml";
    	Resource logbackResource = null;
    	if(StringUtil.isNotEmpty(configPath)) {
    		logbackPath = configPath + File.separator + logbackPath;
    		logbackResource = new FileSystemResource(logbackPath);
    	} else {
    		logbackResource = new ClassPathResource(logbackPath);
    	}

        try {
            LoggerContext loggerContext = (LoggerContext) LoggerFactory.getILoggerFactory();
            loggerContext.reset();
            JoranConfigurator joranConfigurator = new JoranConfigurator();
            joranConfigurator.setContext(loggerContext);
            joranConfigurator.doConfigure(logbackResource.getFile());
            logger.debug("loaded slf4j configure file from {}", logbackPath);
        } catch (JoranException e) {
            logger.error("can loading slf4j configure file from " + configPath, e);
        }catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
 
    }
    
    @Override
    public void contextDestroyed(ServletContextEvent event) {
    }
}
