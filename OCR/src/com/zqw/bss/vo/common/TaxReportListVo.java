package com.zqw.bss.vo.common;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.TaxType;

public class TaxReportListVo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Long id;
	
	/**
	 * 增值税税率
	 */
	private Long vat;
	
	/**
	 * 纳税人性质
	 */
	private TaxType taxType;
	/**
	 * 用户名
	 */
	private String loginId;
	/**
	 * 公司名称
	 */
	private String name;
	
	/**
	 * 模块名称
	 */
	private String productName;
	
	private String mouthDate;

	public Long getVat() {
		return vat;
	}

	public void setVat(Long vat) {
		this.vat = vat;
	}

	public TaxType getTaxType() {
		return taxType;
	}

	public void setTaxType(TaxType taxType) {
		this.taxType = taxType;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}
	
	public String getMouthDate() {
		return mouthDate;
	}

	public void setMouthDate(String mouthDate) {
		this.mouthDate = mouthDate;
	}

	public TaxReportListVo(){
		
	}
	
	public TaxReportListVo(Long id, String loginId, String name) {
		super();
		this.id = id;
		this.loginId = loginId;
		this.name = name;
	}

	public TaxReportListVo(Long id, String loginId, String name,Long vat,TaxType taxType) {
		super();
		this.id = id;
		this.loginId = loginId;
		this.name = name;
		this.vat = vat;
		this.taxType = taxType;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((mouthDate == null) ? 0 : mouthDate.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((productName == null) ? 0 : productName.hashCode());
		result = prime * result + ((taxType == null) ? 0 : taxType.hashCode());
		result = prime * result + ((loginId == null) ? 0 : loginId.hashCode());
		result = prime * result + ((vat == null) ? 0 : vat.hashCode());
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
		TaxReportListVo other = (TaxReportListVo) obj;
		if (mouthDate == null) {
			if (other.mouthDate != null)
				return false;
		} else if (!mouthDate.equals(other.mouthDate))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (productName == null) {
			if (other.productName != null)
				return false;
		} else if (!productName.equals(other.productName))
			return false;
		if (taxType != other.taxType)
			return false;
		if (loginId == null) {
			if (other.loginId != null)
				return false;
		} else if (!loginId.equals(other.loginId))
			return false;
		if (vat == null) {
			if (other.vat != null)
				return false;
		} else if (!vat.equals(other.vat))
			return false;
		return true;
	}

}
