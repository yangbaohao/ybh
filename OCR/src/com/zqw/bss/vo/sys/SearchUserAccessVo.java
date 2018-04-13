package com.zqw.bss.vo.sys;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.vo.common.AccessVo;

/**
 * <p>Title:</p>
 * <p>Description:用户行为信息</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author db
 * @date 2016年9月13日 11:52:26
 * @version 1.0
 */
public class SearchUserAccessVo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * 访问日期
	 */
	private Date createDate;
	
	private List<AccessVo> accessList;

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public List<AccessVo> getAccessList() {
		return accessList;
	}

	public void setAccessList(List<AccessVo> accessList) {
		this.accessList = accessList;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SearchUserAccessVo other = (SearchUserAccessVo) obj;
		if (accessList == null) {
			if (other.accessList != null)
				return false;
		} else if (!accessList.equals(other.accessList))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accessList == null) ? 0 : accessList.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		return result;
	}
	
	public SearchUserAccessVo(Date rs,List<AccessVo> listVo) {
		this.createDate =  rs;
		this.accessList=listVo;
	}

	
	
	
}
