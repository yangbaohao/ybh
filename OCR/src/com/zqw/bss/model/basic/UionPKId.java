package com.zqw.bss.model.basic;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>
 * 联合主键类，包含id,ownId
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@Embeddable
public class UionPKId extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 *id
	 */
	private Long id;

	/**
	 *注册用户ID
	 */
	private Long ownerId;

	/**
	 * 构建联合组建，自动设置OwnerId为当前项目的OwnerId
	 * 
	 */
	public UionPKId() {
//		this.setOwnerId((Long) SessionUtil
//				.get(SystemConstant.SESSION_KEY_OWNER_ID));

	}
	
	

	/**
	 * 构建联合组建，自动设置OwnerId为当前项目的OwnerId
	 * 
	 * @param Long
	 *            id
	 * 
	 */
	public UionPKId(Long id) {
		this();
		this.setId(id);
	}

	/**
	 * 构建联合组建
	 * 
	 * @param Long
	 *            id
	 * @param Long
	 *            ownerId
	 * 
	 */
	public UionPKId(Long id, Long ownerId) {
		this.setId(id);
		this.setOwnerId(ownerId);
	}

	@Column(insertable=false)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Column
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;

		if (getClass() != obj.getClass())
			return false;
		UionPKId other = (UionPKId) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		return result;
	}

}
