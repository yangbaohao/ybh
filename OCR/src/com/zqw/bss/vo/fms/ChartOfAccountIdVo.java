package com.zqw.bss.vo.fms;

import com.zqw.bss.framework.model.BaseObject;

public class ChartOfAccountIdVo extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -1892552256605733775L;

	private Long id;
	
	/**
	 * 科目编码
	 */
	private String hardCode;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getHardCode() {
		return hardCode;
	}

	public void setHardCode(String hardCode) {
		this.hardCode = hardCode;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((hardCode == null) ? 0 : hardCode.hashCode());
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
		ChartOfAccountIdVo other = (ChartOfAccountIdVo) obj;
		if (hardCode == null) {
			if (other.hardCode != null)
				return false;
		} else if (!hardCode.equals(other.hardCode))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	public ChartOfAccountIdVo(Long id, String hardCode) {
		super();
		this.id = id;
		this.hardCode = hardCode;
	}
	
	

}
