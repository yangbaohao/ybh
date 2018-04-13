package com.zqw.bss.vo.common;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>Title:</p>
 * <p>Description:注册数量信息</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author wx
 * @date 2016年9月13日 09:54:54
 * @version 1.0
 */

public class OwnerNumVo extends BaseObject{

	private static final long serialVersionUID = 2174790970815554271L;
	
	/**
	 * 注册日期
	 */
	private Date createDate;
	/**
	 * 注册用户数
	 */
	private Long ownerNum;
	/**
	 * 有效注册用户数
	 */
	private Long realOwnerNum;
	/**
	 * 用户访问数
	 */
	private Long accessNum;
	/**
	 * 测试用户登录数
	 */
	private Long testNum;

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Long getOwnerNum() {
		return ownerNum;
	}

	public void setOwnerNum(Long ownerNum) {
		this.ownerNum = ownerNum;
	}

	public Long getRealOwnerNum() {
		return realOwnerNum;
	}

	public void setRealOwnerNum(Long realOwnerNum) {
		this.realOwnerNum = realOwnerNum;
	}

	public Long getAccessNum() {
		return accessNum;
	}

	public void setAccessNum(Long accessNum) {
		this.accessNum = accessNum;
	}

	public Long getTestNum() {
		return testNum;
	}

	public void setTestNum(Long testNum) {
		this.testNum = testNum;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accessNum == null) ? 0 : accessNum.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((ownerNum == null) ? 0 : ownerNum.hashCode());
		result = prime * result + ((realOwnerNum == null) ? 0 : realOwnerNum.hashCode());
		result = prime * result + ((testNum == null) ? 0 : testNum.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		OwnerNumVo other = (OwnerNumVo) obj;
		if (accessNum == null) {
			if (other.accessNum != null)
				return false;
		} else if (!accessNum.equals(other.accessNum))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (ownerNum == null) {
			if (other.ownerNum != null)
				return false;
		} else if (!ownerNum.equals(other.ownerNum))
			return false;
		if (realOwnerNum == null) {
			if (other.realOwnerNum != null)
				return false;
		} else if (!realOwnerNum.equals(other.realOwnerNum))
			return false;
		if (testNum == null) {
			if (other.testNum != null)
				return false;
		} else if (!testNum.equals(other.testNum))
			return false;
		return true;
	}

	public OwnerNumVo(Object[] rs) {
		this.createDate = (Date) rs[0];
		this.ownerNum = rs[1] == null ? 0L :Long.valueOf(rs[1].toString());
		this.realOwnerNum = rs[2] == null ? 0L :Long.valueOf(rs[2].toString());
		this.accessNum = rs[3] == null ? 0L :Long.valueOf(rs[3].toString());
		this.testNum = rs[4] == null ? 0L :Long.valueOf(rs[4].toString());
	}
	
	public OwnerNumVo(Date createDate , Long ownerNum , Long realOwnerNum , Long accessNum) {
		super();
		this.createDate = createDate;
		this.ownerNum = ownerNum;
		this.realOwnerNum = realOwnerNum;
		this.accessNum = accessNum;
	}
	
}
