package com.zqw.bss.service.fms;

import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.Owner;

/**
 * <p>
 * AccountPeriodService
 * </p>
 * 账期服务接口
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, 2016-6-4
 */
public interface AccountPeriodService {
	
	/**
	 * 开始会计期
	 * 
	 * @param Long ownerId
	 * @param Owner owner
	 * @return AccountPeriod 当前会计期
	 */
	public AccountPeriod startAccountPeriod(String startMonth,Owner owner);
	
	/**
	 * 获取当前会计期
	 * 
	 * @return AccountPeriod 当前会计期
	 */
	public AccountPeriod getCurrentAccountPeriod();
	
	/**
	 * 获取最近关闭会计期字符串
	 * 
	 * @return AccountPeriod 最近关闭会计期
	 */
	public AccountPeriod getLastClosedAccountPeriod();
	
	public Boolean checkInitialAccountPeriod(Long ownerId);
}
