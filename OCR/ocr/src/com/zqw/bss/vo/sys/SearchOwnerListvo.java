package com.zqw.bss.vo.sys;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.crm.Remark;

public class SearchOwnerListvo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long accountorderid;
	
	private Long personid;
	
	private Long enterpriseInfoid;
	
	private Long ownerId;
	
	private String productCode;
	/**
	 * 购买时间
	 */
	private Date createDate;
	
	/**
	 *
	 */
	private Date lastDate;
	/**
	 * 用户名
	 */
	private String username;
	
	/**
	 * 公司名称
	 */
	private String name;
	
	/**
	 * 公司名称
	 */
	private String telephone;
	/**
	 * 功能名称
	 */
	private String productName;
	
	
	private String employeeCode ;
	
	/**
	 * 客服编码
	 */
	private String customerCode ;
	/**
	 * 订单总额
	 */
	private BigDecimal totalAmt;
	
	/**
	 * 订单总额
	 */
	private BigDecimal mouthAmt;
	
	/**
	 * 代理商
	 */
	private String voucher;

	/**
	 * 销售代理编号
	 */
	private String agentCode;
	
	/**
	 * 销售
	 */
	private String saler;
	
	/**
	 * 备注
	 */
	private List<Remark> remark;

	/**
	 * 
	 */
	private String agentusername;
	
	/**
	 * 标签
	 */
	
	private String lebal;
	
	private String type;
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getCustomerCode() {
		return customerCode;
	}

	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}

	public String getLebal() {
		return lebal;
	}

	public void setLebal(String lebal) {
		this.lebal = lebal;
	}

	public String getProductCode() {
		return productCode;
	}

	public void setProductCode(String productCode) {
		this.productCode = productCode;
	}

	public Date getLastDate() {
		return lastDate;
	}

	public void setLastDate(Date lastDate) {
		this.lastDate = lastDate;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getAgentusername() {
		return agentusername;
	}

	public void setAgentusername(String agentusername) {
		this.agentusername = agentusername;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getAgentCode() {
		return agentCode;
	}

	public void setAgentCode(String agentCode) {
		this.agentCode = agentCode;
	}

	public Long getPersonid() {
		return personid;
	}

	public void setPersonid(Long personid) {
		this.personid = personid;
	}

	public Long getEnterpriseInfoid() {
		return enterpriseInfoid;
	}

	public void setEnterpriseInfoid(Long enterpriseInfoid) {
		this.enterpriseInfoid = enterpriseInfoid;
	}

	public BigDecimal getMouthAmt() {
		return mouthAmt;
	}

	public void setMouthAmt(BigDecimal mouthAmt) {
		this.mouthAmt = mouthAmt;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public Long getAccountorderid() {
		return accountorderid;
	}

	public void setAccountorderid(Long accountorderid) {
		this.accountorderid = accountorderid;
	}

	public String getVoucher() {
		return voucher;
	}

	public void setVoucher(String voucher) {
		this.voucher = voucher;
	}

	public String getSaler() {
		return saler;
	}

	public void setSaler(String saler) {
		this.saler = saler;
	}

	public List<Remark> getRemark() {
		return remark;
	}

	public void setRemark(List<Remark> remark) {
		this.remark = remark;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((accountorderid == null) ? 0 : accountorderid.hashCode());
		result = prime * result + ((agentCode == null) ? 0 : agentCode.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((enterpriseInfoid == null) ? 0 : enterpriseInfoid.hashCode());
		result = prime * result + ((mouthAmt == null) ? 0 : mouthAmt.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((personid == null) ? 0 : personid.hashCode());
		result = prime * result + ((productName == null) ? 0 : productName.hashCode());
		result = prime * result + ((saler == null) ? 0 : saler.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
		result = prime * result + ((totalAmt == null) ? 0 : totalAmt.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		result = prime * result + ((voucher == null) ? 0 : voucher.hashCode());
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
		SearchOwnerListvo other = (SearchOwnerListvo) obj;
		if (accountorderid == null) {
			if (other.accountorderid != null)
				return false;
		} else if (!accountorderid.equals(other.accountorderid))
			return false;
		if (agentCode == null) {
			if (other.agentCode != null)
				return false;
		} else if (!agentCode.equals(other.agentCode))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (enterpriseInfoid == null) {
			if (other.enterpriseInfoid != null)
				return false;
		} else if (!enterpriseInfoid.equals(other.enterpriseInfoid))
			return false;
		if (mouthAmt == null) {
			if (other.mouthAmt != null)
				return false;
		} else if (!mouthAmt.equals(other.mouthAmt))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (personid == null) {
			if (other.personid != null)
				return false;
		} else if (!personid.equals(other.personid))
			return false;
		if (productName == null) {
			if (other.productName != null)
				return false;
		} else if (!productName.equals(other.productName))
			return false;
		if (saler == null) {
			if (other.saler != null)
				return false;
		} else if (!saler.equals(other.saler))
			return false;
		if (telephone == null) {
			if (other.telephone != null)
				return false;
		} else if (!telephone.equals(other.telephone))
			return false;
		if (totalAmt == null) {
			if (other.totalAmt != null)
				return false;
		} else if (!totalAmt.equals(other.totalAmt))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		if (voucher == null) {
			if (other.voucher != null)
				return false;
		} else if (!voucher.equals(other.voucher))
			return false;
		return true;
	}
	public SearchOwnerListvo(Object[] rsArray) {
		this.ownerId = Long.valueOf(rsArray[0].toString());
		this.createDate = (Date) rsArray[1];
		this.username = (String) rsArray[2];
		this.name = (String) rsArray[3];
		this.telephone = (String) rsArray[4];
		this.employeeCode = (String)rsArray[5];
		this.agentCode = (String) rsArray[6];
		if(rsArray[7]!=null)
		this.totalAmt = new BigDecimal(rsArray[7].toString());
		this.lastDate = (Date) rsArray[8];
		if(rsArray[9]!=null)
		this.lebal = (String) rsArray[9];
		this.customerCode = (String) rsArray[10];
		this.type =  (String) rsArray[11];
	}
	
	public SearchOwnerListvo(Object[] rsArray, Object object) {
		this.ownerId = Long.valueOf(rsArray[0].toString());
		this.username =  rsArray[1].toString();
		if(rsArray[2]!=null)
		this.name = rsArray[2].toString();
	}
}
