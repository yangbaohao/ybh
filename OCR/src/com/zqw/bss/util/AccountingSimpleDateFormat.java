package com.zqw.bss.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class AccountingSimpleDateFormat extends SimpleDateFormat {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6402644151300436960L;
	
	
	public AccountingSimpleDateFormat(){
		super();
	}

	public AccountingSimpleDateFormat(String pattern ){
		super(pattern);
	}
	
	private static SimpleDateFormat sam = new SimpleDateFormat("yyyy-MM-dd");

	public Date parse(String source) throws ParseException {
		try {
			return super.parse(source);
		} catch (Exception e) {
			return sam.parse(source);
		}

	}

}
