package com.zqw.bss.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.shiro.SecurityUtils;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.DateUtil;
import com.zqw.bss.framework.util.StringUtil;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.util.security.shiro.SessionUtil;

/**
 * <p>
 * 付费权限工具类
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
public class BillingProductUtil {

	public final static boolean billingcheckFlag = true;
	
	/**
	 * 检查当前操作是否的付费权限
	 * 
	 * @param String...
	 * 
	 */
	public static void checkBillingPermissions(DAO dao,String functionMsg, String... permissions) {

		if (billingcheckFlag) {
			try {
				// TODO 判断用户是否试用超过3个月
				Owner owner  = (Owner) dao.getObject(Owner.class, (Long)SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID));
				if(new Date().compareTo(DateUtil.getDateByMonths(owner.getCreateDate(), 3))>0){
					SecurityUtils.getSubject().checkPermissions(permissions);
				}
//				SecurityUtils.getSubject().checkPermissions(permissions);
			} catch (Exception e) {
				//e.printStackTrace();
				if (StringUtil.isEmpty(functionMsg))
					functionMsg = "该功能";
				throw new OperationException(functionMsg + "需要购买才能使用哦！<span data-permissions='"+permissions[0]+"' class='java_buy'>立即购买！</span>");
			}
		}

	}
}
