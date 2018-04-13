package com.zqw.bss.vo.crm;

import com.zqw.bss.framework.model.BaseObject;

public class UserInfoForListVO extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = -335415535866026472L;
	
	/**
	 * id
	 */
	private Long id;
	
	/**
	 * 公司名称
	 */
	private String name;
	
	/**
	 *公司电话 
	 */
	private String telephone;

	private String category1="";

	private String category2="";
	
	public String getCategory1() {
		return category1;
	}

	public void setCategory1(String category1) {
		this.category1 = category1;
	}

	public String getCategory2() {
		return category2;
	}

	public void setCategory2(String category2) {
		this.category2 = category2;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	@Override
	public boolean equals(Object arg0) {
		if (this == arg0)
			return true;
		if (getClass() != arg0.getClass())
			return false;
		UserInfoForListVO other = (UserInfoForListVO) arg0;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(id))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		}  else if (!name.equals(other.name))
			return false;
		if (telephone == null) {
			if (other.telephone != null)
				return false;
		}  else if (!telephone.equals(other.telephone))
			return false;
		
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		return result;
	}

	public UserInfoForListVO(Long id, String name, String telephone) {
		super();
		this.id = id;
		this.name = name;
		this.telephone = telephone;
	}

	public UserInfoForListVO() {
		super();
	}

}
