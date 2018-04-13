package com.zqw.bss.util;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.zqw.bss.util.security.shiro.redis.RedisManager;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPubSub;

/**
 * 
 * @author wm 2017/8/7
 *
 */
public class RedisHelper {
	
	private static final Logger logger = LoggerFactory.getLogger(RedisHelper.class);
	
	private static final String DEFAULT_REDIS_MGR_NAME = "redisManager";
	
	/**
	 * the caller shall make sure the returned Jedis instance will be closed finally, and as soon as possible
	 * 
	 * @return
	 */
	public static Jedis getJedis(){
		RedisManager rm = SpringContextHolder.getBean(DEFAULT_REDIS_MGR_NAME);
		
		Jedis jedis = rm.getJedis();
		
		return jedis;
	}
	
	public static interface RedisJob<T> {
		T exec(Jedis jedis);
	}
	
	/**
	 * execute the job synchronously, will throw any expcetion from the job<br>
	 * 
	 * the jedis object will be closed by this method, so the job no need to close it
	 * 
	 * @param redisJob
	 */
	public static <T> T start(RedisJob<T> redisJob){
		if (redisJob==null) return null;

		RedisManager rm = SpringContextHolder.getBean(DEFAULT_REDIS_MGR_NAME);
		
		Jedis jedis = null;
		try {
			jedis = rm.getJedis();

			return redisJob.exec(jedis);

		} finally {
			if (jedis != null) {
				try {
					jedis.close();
				} catch (Exception e) {
					logger.warn("faield to close jedis for job {}, ignored", redisJob, e);
				}
			}
		}
	}
	
	public static Jedis getMQJedis(){
		RedisManager rm = SpringContextHolder.getBean("redisManagerForMQ");
		
		rm.init("OCR MQ");
		
		Jedis jedis = rm.getJedis();
		
		return jedis;
	}
	
	public static void publish(String channel, String message){
		if (channel==null||(channel=channel.trim()).isEmpty()||message==null) return;
		
		Jedis jedis = getMQJedis();
		try{
			jedis.publish(channel, message);
		}finally{
			if (jedis != null) {
				try {
					jedis.close();
				} catch (Exception e) {
					logger.warn("faield to close jedis for publish message [{}] to channel [{}], ignored", message, channel, e);
				}
			}
		}
	}
	
	public static interface MessageConsumer{
		void consume(String channel, String message);
	}
	
	public static void subscribe(final MessageConsumer mc, String... channels){
		if (mc==null) return;
		if (channels==null || channels.length==0) return;
		
		Jedis jedis = getMQJedis();
		try{
			jedis.subscribe(new JedisPubSub(){
				@Override
				public void onMessage(String channel, String message) {
					mc.consume(channel, message);
				}}, channels);
		}finally{
			if (jedis != null) {
				try {
					jedis.close();
				} catch (Exception e) {
					logger.warn("faield to close jedis for subscribe {}, ignored", Arrays.asList(channels), e);
				}
			}
		}
	}
}




























