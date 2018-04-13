package com.zqw.bss.service.crm;

import com.zqw.bss.model.crm.Address;

public interface AddressService {

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
