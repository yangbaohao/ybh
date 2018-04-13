package com.zqw.bss.vo.sys;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class SearchUserByTaxListVo extends BaseObject {



	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Id
	 */
	private Long id;
	/**
	 * 创建时间
	 */
	private Date createDate;

	/**
	 * 员工编号
	 */
	private String employeeCode;
	
	/**
	 * 用户名
	 */
	private String username;
	
	/**
	 * 负责客人数量
	 */
	private int ownerNum;
	/**
	 * 用户状态
	 */
	private Boolean locked;

	


	public SearchUserByTaxListVo() {

	}
	
	public SearchUserByTaxListVo(Long id, String employeeCode, String username) {
		super();
		this.id = id;
		this.employeeCode = employeeCode;
		this.username = username;
	}
	
	public SearchUserByTaxListVo(Date createDate, String employeeCode, String username, int ownerNum, Boolean locked) {
		super();
		this.createDate = createDate;
		this.employeeCode = employeeCode;
		this.username = username;
		this.ownerNum = ownerNum;
		this.locked = locked;
	}

	public SearchUserByTaxListVo(Object[] rs,String id) {
		this.id = Long.valueOf(rs[0].toString());
		this.employeeCode =  rs[1].toString();
		this.username = rs[2].toString();
	}
	
	public SearchUserByTaxListVo(Object[] rs) {
		this.createDate = (Date) rs[0];
		this.employeeCode = rs[1] == null ? "" : rs[1].toString();
		this.username = rs[2] == null ? "" : rs[2].toString();
		this.ownerNum = rs[3] == null ? 0 : Integer.valueOf(rs[3].toString());
		this.id = rs[4] == null ? 0L : Long.valueOf(rs[4].toString());
		if(rs.length==6){
			if(rs[5].toString().equals("Y")){
				this.setLocked(Boolean.TRUE);
			}else{
				this.setLocked(Boolean.FALSE);
			}
		}
	}
	
	public Date getCreateDate() {
		return createDate;
	}


	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}


	public String getemployeeCode() {
		return employeeCode;
	}


	public void setemployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}


	public String getUsername() {
		return username;
	}


	public void setUsername(String username) {
		this.username = username;
	}


	public int getOwnerNum() {
		return ownerNum;
	}


	public void setOwnerNum(int ownerNum) {
		this.ownerNum = ownerNum;
	}


	public Boolean getLocked() {
		return locked;
	}


	public void setLocked(Boolean locked) {
		this.locked = locked;
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((locked == null) ? 0 : locked.hashCode());
		result = prime * result + ((employeeCode == null) ? 0 : employeeCode.hashCode());
		result = prime * result + ownerNum;
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
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
		SearchUserByTaxListVo other = (SearchUserByTaxListVo) obj;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (locked == null) {
			if (other.locked != null)
				return false;
		} else if (!locked.equals(other.locked))
			return false;
		if (employeeCode == null) {
			if (other.employeeCode != null)
				return false;
		} else if (!employeeCode.equals(other.employeeCode))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (ownerNum == 0) {
			if (other.ownerNum != 0)
				return false;
		} 
		return true;
	}

}
