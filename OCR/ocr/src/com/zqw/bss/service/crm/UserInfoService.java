package com.zqw.bss.service.crm;

import java.util.List;

import com.zqw.bss.model.crm.UserInfo;
import com.zqw.bss.vo.crm.UserInfoForListVO;

/**
 * <p>
 * EnterpriseInfo Service
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
public interface UserInfoService {
	
	/**
	 * 获取UserInfo信息
	 * @param type
	 * @param id
	 * @return
	 */
	public UserInfo getUserInfoByCert(String type,
			String id);
	
	/**
	 * 通过id获取UserInfo
	 * @param id
	 * @return
	 */
	public UserInfo getUserInfoById(Long id);
	
	/**
	 * 通过用户名获取UserInfo信息
	 * @param name
	 * @return
	 */
	public UserInfo getUserInfoByName(String name);
	
	/**
	 * 修改UserInfo
	 * @param userInfo
	 * @return
	 */
	public UserInfo updateUserInfo(UserInfo userInfo);
	
	/**
	 * 获取UserInfoForListVO by id
	 * @param id
	 * @return
	 */
	public UserInfoForListVO getUserInfoVOById(String id);
	
	/**
	 * 获取UserInfo列表Vo
	 * @return
	 */
	public List<UserInfoForListVO> getAllListUserInfo();

}
