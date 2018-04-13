package com.zqw.bss.util.security.shiro.redis;

import java.util.HashSet;
import java.util.Set;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.ScanParams;
import redis.clients.jedis.ScanResult;

public class RedisManager {

	private String host = "192.168.1.105";

	private int port = 6379;

	// 0 - never expire
	private int expire = 0;

	// timeout for jedis try to connect to redis server, not expire time! In
	// milliseconds
	private int timeout = 0;
	private int maxIdle = 200;
	private int maxTotal = 2000;
	private boolean testOnBorrow = false;
	private boolean testOnReturn = false;
	private int maxWaitMillis = 1000;
	private boolean blockWhenExhausted = false;

	private String password = "123456";

	private volatile JedisPool jedisPool = null;

	public RedisManager() {

	}

	/**
	 * 初始化方法
	 */
	public void init(String purpose) {
		if (jedisPool == null) {
			synchronized(this){
				if (jedisPool==null){
					JedisPoolConfig config = new JedisPoolConfig();
					config.setMaxIdle(maxIdle);
					// 最大连接数, 应用自己评估，不要超过ApsaraDB for Redis每个实例最大的连接数
					config.setMaxTotal(maxTotal);
					config.setTestOnBorrow(testOnBorrow);
					config.setTestOnReturn(testOnReturn);
					config.setMaxWaitMillis(maxWaitMillis);
					config.setBlockWhenExhausted(blockWhenExhausted);
					
					config.setJmxNamePrefix("jedisPoolFor"+purpose);
		
					if (password != null && !"".equals(password)) {
						jedisPool = new JedisPool(config, host, port, timeout, password);
					} else if (timeout != 0) {
						jedisPool = new JedisPool(config, host, port, timeout);
					} else {
						jedisPool = new JedisPool(config, host, port);
					}
				}
			}
		}
	}
	
	/**
	 * the returned jedis shall be close when finish using!!!
	 * 
	 * @return
	 */
	public Jedis getJedis(){
		return jedisPool.getResource();
	}

	/**
	 * get value from redis
	 * 
	 * @param key
	 * @return
	 */
	public byte[] get(byte[] key) {
		byte[] value = null;
		Jedis jedis = jedisPool.getResource();
		try {
			value = jedis.get(key);
			if (this.expire != 0) {
				jedis.expire(key, this.expire);
			}
		} finally {
			jedis.close();
		}
		return value;
	}

	/**
	 * set
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public byte[] set(byte[] key, byte[] value) {
		Jedis jedis = jedisPool.getResource();
		try {
			jedis.set(key, value);
			if (this.expire != 0) {
				jedis.expire(key, this.expire);
			}
		} finally {
			jedis.close();
		}
		return value;
	}

	/**
	 * set
	 * 
	 * @param key
	 * @param value
	 * @param expire
	 * @return
	 */
	public byte[] set(byte[] key, byte[] value, int expire) {
		Jedis jedis = jedisPool.getResource();
		try {
			jedis.set(key, value);
			if (expire != 0) {
				jedis.expire(key, expire);
			}
		} finally {
			jedis.close();
		}
		return value;
	}

	/**
	 * del
	 * 
	 * @param key
	 */
	public void del(byte[] key) {
		Jedis jedis = jedisPool.getResource();
		try {
			jedis.del(key);
		} finally {
			jedis.close();
		}
	}

	/**
	 * flush
	 */
	public void flushDB() {
		Jedis jedis = jedisPool.getResource();
		try {
			jedis.flushDB();
		} finally {
			jedis.close();
		}
	}

	/**
	 * size
	 */
	public Long dbSize() {
		Long dbSize = 0L;
		Jedis jedis = jedisPool.getResource();
		try {
			dbSize = jedis.dbSize();
		} finally {
			jedis.close();
		}
		return dbSize;
	}

	/**
	 * keys
	 * 
	 * @param regex
	 * @return
	 */
	public Set<byte[]> keys(String pattern) {
		Set<byte[]> keys = null;
		Jedis jedis = jedisPool.getResource();
		try {
			keys = jedis.keys(pattern.getBytes());
		} finally {
			jedis.close();
		}
		return keys;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked", "deprecation" })
	public Set<byte[]> scans(String pattern){
		Jedis jedis = jedisPool.getResource();
		Set<byte[]> result = new HashSet();
		try {
			//scans = jedis.scan(pattern.getBytes());
			ScanParams sp = new ScanParams().match(pattern.getBytes()).count(64);
			byte[] cursor = ScanParams.SCAN_POINTER_START_BINARY;
			while (true) {
				ScanResult<byte[]> sr = jedis.scan(cursor, sp);
				result.addAll(sr.getResult());
				cursor = sr.getCursorAsBytes();
				if (cursor.length!=ScanParams.SCAN_POINTER_START_BINARY.length) continue;
				boolean same = true;
				for(int i=0;i<cursor.length;i++){
					if (cursor[i]!=ScanParams.SCAN_POINTER_START_BINARY[i]){
						same = false;
						break;
					}
				}
				if (same) {
					break;
				}
			}
		} finally {
			jedisPool.returnResource(jedis);
		}

		return result;
	}

	public String getHost() {
		return host;
	}

	public void setHost(String host) {
		this.host = host;
	}

	public int getPort() {
		return port;
	}

	public void setPort(int port) {
		this.port = port;
	}

	public int getExpire() {
		return expire;
	}

	public void setExpire(int expire) {
		this.expire = expire;
	}

	public int getTimeout() {
		return timeout;
	}

	public void setTimeout(int timeout) {
		this.timeout = timeout;
	}

	public int getMaxIdle() {
		return maxIdle;
	}

	public void setMaxIdle(int maxIdle) {
		this.maxIdle = maxIdle;
	}

	public int getMaxTotal() {
		return maxTotal;
	}

	public void setMaxTotal(int maxTotal) {
		this.maxTotal = maxTotal;
	}

	public int getMaxWaitMillis() {
		return maxWaitMillis;
	}

	public void setMaxWaitMillis(int maxWaitMillis) {
		this.maxWaitMillis = maxWaitMillis;
	}

	public boolean isTestOnBorrow() {
		return testOnBorrow;
	}

	public void setTestOnBorrow(boolean testOnBorrow) {
		this.testOnBorrow = testOnBorrow;
	}

	public boolean isTestOnReturn() {
		return testOnReturn;
	}

	public void setTestOnReturn(boolean testOnReturn) {
		this.testOnReturn = testOnReturn;
	}

	public boolean isBlockWhenExhausted() {
		return blockWhenExhausted;
	}

	public void setBlockWhenExhausted(boolean blockWhenExhausted) {
		this.blockWhenExhausted = blockWhenExhausted;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
