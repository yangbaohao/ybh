package com.zqw.bss.vo.common;

import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>Title:</p>
 * <p>Description:用户行为信息--行为信息</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author wx
 * @date 2016年9月13日 11:52:26
 * @version 1.0
 */

public class AccessVo extends BaseObject{


	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * 用户id
	 */
	private Long ownerId;
	/**
	 * 记录内容
	 */
	private String remark;
	/**
	 * 记录内容次数
	 */
	private Long remarkNum;
	/**
	 * 记录内容总秒数
	 */
	private BigDecimal remarkSecond;
	/**
	 * 有效访问次数
	 */
	private Long ownerLoginNum;
	
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getRemarkNum() {
		return remarkNum;
	}

	public void setRemarkNum(Long remarkNum) {
		this.remarkNum = remarkNum;
	}
	
	public BigDecimal getRemarkSecond() {
		return remarkSecond;
	}

	public void setRemarkSecond(BigDecimal remarkSecond) {
		this.remarkSecond = remarkSecond;
	}

	public Long getOwnerLoginNum() {
		return ownerLoginNum;
	}

	public void setOwnerLoginNum(Long ownerLoginNum) {
		this.ownerLoginNum = ownerLoginNum;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((ownerLoginNum == null) ? 0 : ownerLoginNum.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((remarkNum == null) ? 0 : remarkNum.hashCode());
		result = prime * result + ((remarkSecond == null) ? 0 : remarkSecond.hashCode());
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
		AccessVo other = (AccessVo) obj;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (ownerLoginNum == null) {
			if (other.ownerLoginNum != null)
				return false;
		} else if (!ownerLoginNum.equals(other.ownerLoginNum))
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		if (remarkNum == null) {
			if (other.remarkNum != null)
				return false;
		} else if (!remarkNum.equals(other.remarkNum))
			return false;
		if (remarkSecond == null) {
			if (other.remarkSecond != null)
				return false;
		} else if (!remarkSecond.equals(other.remarkSecond))
			return false;
		return true;
	}

	public AccessVo( Long ownerId, String remark , Long remarkNum , BigDecimal remarkSecond ) {
		super();
		this.ownerId = ownerId;
		this.remark = remark;
		this.remarkNum = remarkNum;
		this.remarkSecond = remarkSecond;
	}
	
	public AccessVo(Object[] rs) {
		this.ownerId = Long.valueOf(rs[0].toString());
		if(rs[1]!=null)
			this.remark = rs[1].toString();
		this.remarkNum = Long.valueOf(rs[2].toString());
		if(rs[3]==null){
			rs[3]=0;
		}
		this.remarkSecond = new BigDecimal(rs[3].toString()).setScale(2, BigDecimal.ROUND_HALF_UP);
	}
	
	public AccessVo(Object[] rs, String type) {
		if("ownerLoginNum".equals(type)){
			this.remark = rs[0].toString();
			this.remarkNum = Long.valueOf(rs[1].toString());
			this.ownerLoginNum = Long.valueOf(rs[2].toString());
			if(rs[3]==null){
				rs[3]=0;
			}
			this.remarkSecond = new BigDecimal(rs[3].toString()).setScale(2, BigDecimal.ROUND_HALF_UP);
		}
	}
}
