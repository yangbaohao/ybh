package com.zqw.bss.vo.fms;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.DebitCredit;

/**
 * <p>
 * 科目列表VO
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * 
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
public class ChartOfAccountForListVO extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1717363304755628739L;

	/**
	 *id
	 */
	private Long id;

	/**
	 *显示 科目+名字
	 */
	private String displayValue;

	/**
	 *科目名字
	 */
	private String name;

	/**
	 *编号为4位数，如果是子科目的，就为6位数，在前面4位数后面加2位数
	 */
	private String ref;

	/**
	 * 是否有子科目
	 */
	private Boolean allowInput;

	/**
	 * 等于ref 科目编码
	 */
	private String hardCode;

	/**
	 *  科目类型
	 */
	private Long coaClass;
	
	/**
	 * 科目借贷方向
	 */
	private DebitCredit debitCredit ;

	public ChartOfAccountForListVO() {

	}

	public ChartOfAccountForListVO(Long id, String displayValue, String name,
			String ref, Boolean allowInput, String hardCode, Long coaClass ,DebitCredit debitCredit) {

		this.id = id;
		this.displayValue = displayValue;
		this.name = name;
		this.ref = ref;
		this.allowInput = allowInput;
		this.hardCode = hardCode;
		this.coaClass = coaClass;
		this.debitCredit = debitCredit;
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

	public String getRef() {
		return ref;
	}

	public void setRef(String ref) {
		this.ref = ref;
	}

	public Boolean getAllowInput() {
		return allowInput;
	}

	public void setAllowInput(Boolean allowInput) {
		this.allowInput = allowInput;
	}

	public String getHardCode() {
		return hardCode;
	}

	public void setHardCode(String hardCode) {
		this.hardCode = hardCode;
	}

	public Long getCoaClass() {
		return coaClass;
	}

	public void setCoaClass(Long coaClass) {
		this.coaClass = coaClass;
	}

	public String getDisplayValue() {
		return displayValue;
	}

	public void setDisplayValue(String displayValue) {
		this.displayValue = displayValue;
	}
	
	public DebitCredit getDebitCredit() {
		return debitCredit;
	}

	public void setDebitCredit(DebitCredit debitCredit) {
		this.debitCredit = debitCredit;
	}


	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((allowInput == null) ? 0 : allowInput.hashCode());
		result = prime * result
				+ ((coaClass == null) ? 0 : coaClass.hashCode());
		result = prime * result
				+ ((hardCode == null) ? 0 : hardCode.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((ref == null) ? 0 : ref.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (getClass() != obj.getClass())
			return false;
		ChartOfAccountForListVO other = (ChartOfAccountForListVO) obj;
		if (allowInput == null) {
			if (other.allowInput != null)
				return false;
		} else if (!allowInput.equals(other.allowInput))
			return false;
		if (coaClass == null) {
			if (other.coaClass != null)
				return false;
		} else if (!coaClass.equals(other.coaClass))
			return false;
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
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (ref == null) {
			if (other.ref != null)
				return false;
		} else if (!ref.equals(other.ref))
			return false;
		return true;
	}

}
