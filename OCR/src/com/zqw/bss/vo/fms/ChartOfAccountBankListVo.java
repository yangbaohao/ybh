package com.zqw.bss.vo.fms;

import java.math.BigDecimal;

import com.zqw.bss.framework.model.BaseObject;

public class ChartOfAccountBankListVo extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 3642936238480392436L;

	/**
	 *科目名字
	 */
	private String name;
	
	/**
	 * 固化当前值，每次有交易都更新
	 */
	private BigDecimal currValue = BigDecimal.ZERO;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getCurrValue() {
		return currValue;
	}

	public void setCurrValue(BigDecimal currValue) {
		this.currValue = currValue;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((currValue == null) ? 0 : currValue.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
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
		ChartOfAccountBankListVo other = (ChartOfAccountBankListVo) obj;
		if (currValue == null) {
			if (other.currValue != null)
				return false;
		} else if (!currValue.equals(other.currValue))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		return true;
	}

	public ChartOfAccountBankListVo(String name, BigDecimal currValue) {
		super();
		this.name = name;
		this.currValue = currValue;
	}
	
}
