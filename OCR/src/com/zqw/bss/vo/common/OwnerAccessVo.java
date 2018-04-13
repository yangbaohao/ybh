package com.zqw.bss.vo.common;

import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>Title:</p>
 * <p>Description:用户行为信息</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author wx
 * @date 2016年9月13日 11:52:26
 * @version 1.0
 */

public class OwnerAccessVo extends BaseObject{


	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 用户名
	 */
	private String username;
	/**
	 * 公司名称
	 */
	private String name;
	/**
	 * 手机号码
	 */
	private String telephone;
	/**
	 * 注册日期
	 */
	private Date createDate;
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
	
	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		OwnerAccessVo objVo = (OwnerAccessVo) obj;
		if (createDate == null) {
			if (objVo.createDate != null)
				return false;
		} else if (!createDate.equals(objVo.createDate))
			return false;
		if (telephone == null) {
			if (objVo.telephone != null)
				return false;
		} else if (!telephone.equals(objVo.telephone))
			return false;
		if (username == null) {
			if (objVo.username != null)
				return false;
		} else if (!username.equals(objVo.username))
			return false;
		if (remark == null) {
			if (objVo.remark != null)
				return false;
		} else if (!remark.equals(objVo.remark))
			return false;
		if (remarkNum == null) {
			if (objVo.remarkNum != null)
				return false;
		} else if (!remarkNum.equals(objVo.remarkNum))
			return false;
		if (remarkSecond == null) {
			if (objVo.remarkSecond != null)
				return false;
		} else if (!remarkSecond.equals(objVo.remarkSecond))
			return false;
		if (name == null) {
			if (objVo.name != null)
				return false;
		} else if (!name.equals(objVo.name))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		final int prime = 31;
		int result = 1;
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((remarkNum == null) ? 0 : remarkNum.hashCode());
		result = prime * result + ((remarkSecond == null) ? 0 : remarkSecond.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		return result;
	}

	
	public OwnerAccessVo(Date createDate , String telephone , String username , String remark , Long remarkNum , BigDecimal remarkSecond ) {
		super();
		this.createDate = createDate;
		this.telephone = telephone;
		this.username = username;
		this.remark = remark;
		this.remarkNum = remarkNum;
		this.remarkSecond = remarkSecond;
	}
	
	public OwnerAccessVo(Object[] rs) {
		this.username = rs[0] == null ? "" : rs[0].toString();
		this.name = rs[1] == null ? "" : rs[1].toString();
		this.telephone = rs[2] == null ? "" : rs[2].toString();
		this.createDate = (Date) rs[3];
		this.remark = rs[4].toString();
		this.remarkNum = Long.valueOf(rs[5].toString());
		this.remarkSecond = new BigDecimal(rs[6].toString()).setScale(2, BigDecimal.ROUND_HALF_UP);
	}
	
}
