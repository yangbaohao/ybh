package com.zqw.bss.util.security.shiro;

import java.io.Serializable;

import org.apache.shiro.util.SimpleByteSource;

public class CustomSimpleByteSource extends SimpleByteSource implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2332157370119183252L;

	public CustomSimpleByteSource(byte[] bytes) {
		super(bytes);
	}

}
