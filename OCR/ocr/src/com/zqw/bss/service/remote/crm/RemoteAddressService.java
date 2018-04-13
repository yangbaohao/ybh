package com.zqw.bss.service.remote.crm;

import javax.ws.rs.Path;

import com.zqw.bss.model.crm.Address;

/**
 * <p>
 * 地址服务
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@Path("/address")
public interface RemoteAddressService {

	/**
	 * 创新地址
	 * 
	 * @param id
	 * @param address
	 * @return
	 */
	public Long createAddress(Long id, Address address);

	/**
	 * 修改地址
	 * 
	 * @param address
	 * @return
	 */
	public Boolean updateAddress(Address address);

	/**
	 * 删除地址
	 * 
	 * @param id
	 * @return
	 */
	public Boolean delAddress(Long id);
}
