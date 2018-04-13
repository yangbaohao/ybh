package com.zqw.bss.model.sale;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.util.AutoValueIgnore;
import com.zqw.bss.util.SystemConstant.PotentialCustomersStatus;

@Entity
@Table(name = "t_bss_potential_customers", indexes = {
		@Index(name = "potentialName_index", columnList = "potentialName"),
		@Index(name = "potentialPosition_index", columnList = "potentialPosition"),
		@Index(name = "phone_index", columnList = "phone"),
		@Index(name = "batchNum_index", columnList = "batchNum")})
public class PotentialCustomers extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 主键id
	 */
	private Long id;
	
	/**
	 * 潜在客户名称
	 */
	private String potentialName;
	
	/**
	 * 潜在客户职位
	 */
	private String potentialPosition;
	
	/**
	 * 电话或手机
	 */
	private String phone;

	/**
	 * 公司名
	 */
	private String contact;

	/**
	 * 客户地址
	 */
	private String address;

	/**
	 * 企业类型
	 */
	private String companyType;
	
	/**
	 * 企业备注
	 */
	private String companyRemark;
	
	/**
	 * 导入备注
	 */
	private String remark;
	
	/**
	 * 主营行业
	 */
	private String industry;
	
	/**
	 * 销售负责人
	 */
	private User sales;

	/**
	 * 状态
	 * 	notSend 未发送
	 * 	sendSuccess   已发送
	 *  register  已注册
	 */
	private PotentialCustomersStatus potentialCustomersStatus = PotentialCustomersStatus.notSend;

	private List<PotentialCustomersTrack> trackList = new ArrayList<PotentialCustomersTrack>();

	/**
	 * 批次
	 */
	private String batchNum;
	
	
	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	@Column(nullable = false)
	public String getPotentialName() {
		return potentialName;
	}

	public void setPotentialName(String potentialName) {
		this.potentialName = potentialName;
	}
	
	@Column(nullable = false)
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
	@AutoValueIgnore
	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, targetEntity = User.class, fetch = FetchType.EAGER,optional=true)
	public User getSales() {
		return sales;
	}

	public void setSales(User sales) {
		this.sales = sales;
	}
	
	@Enumerated(EnumType.STRING)
	public PotentialCustomersStatus getPotentialCustomersStatus() {
		return potentialCustomersStatus;
	}

	public void setPotentialCustomersStatus(PotentialCustomersStatus potentialCustomersStatus) {
		this.potentialCustomersStatus = potentialCustomersStatus;
	}

	@OneToMany(cascade = { CascadeType.ALL }, targetEntity = PotentialCustomersTrack.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "potential_customers_id")
	@BatchSize(size = 50)
	public List<PotentialCustomersTrack> getTrackList() {
		return trackList;
	}

	public void setTrackList(List<PotentialCustomersTrack> trackList) {
		this.trackList = trackList;
	}

	@Column(nullable = false, updatable = false)
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	
	@Column(nullable = false, updatable = false)
	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	public String getLastUpdateBy() {
		return lastUpdateBy;
	}

	public void setLastUpdateBy(String lastUpdateBy) {
		this.lastUpdateBy = lastUpdateBy;
	}

	public String getBatchNum() {
		return batchNum;
	}

	public void setBatchNum(String batchNum) {
		this.batchNum = batchNum;
	}

	public String getPotentialPosition() {
		return potentialPosition;
	}

	public void setPotentialPosition(String potentialPosition) {
		this.potentialPosition = potentialPosition;
	}

	public String getCompanyType() {
		return companyType;
	}

	public void setCompanyType(String companyType) {
		this.companyType = companyType;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	public String getCompanyRemark() {
		return companyRemark;
	}

	public void setCompanyRemark(String companyRemark) {
		this.companyRemark = companyRemark;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		PotentialCustomers other = (PotentialCustomers) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (potentialName == null) {
			if (other.potentialName != null)
				return false;
		} else if (!potentialName.equals(other.potentialName))
			return false;
		if (address == null) {
			if (other.address != null)
				return false;
		} else if (!address.equals(other.address))
			return false;
		if (contact == null) {
			if (other.contact != null)
				return false;
		} else if (!contact.equals(other.contact))
			return false;
		if (phone == null) {
			if (other.phone != null)
				return false;
		} else if (!phone.equals(other.phone))
			return false;
		if (potentialCustomersStatus == null) {
			if (other.potentialCustomersStatus != null)
				return false;
		} else if (!potentialCustomersStatus.equals(other.potentialCustomersStatus))
			return false;
		if (createBy == null) {
			if (other.createBy != null)
				return false;
		} else if (!createBy.equals(other.createBy))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (lastUpdateBy == null) {
			if (other.lastUpdateBy != null)
				return false;
		} else if (!lastUpdateBy.equals(other.lastUpdateBy))
			return false;
		if (lastUpdateDate == null) {
			if (other.lastUpdateDate != null)
				return false;
		} else if (!lastUpdateDate.equals(other.lastUpdateDate))
			return false;
		if (batchNum == null) {
			if (other.batchNum != null)
				return false;
		} else if (!batchNum.equals(other.batchNum))
			return false;
		if (companyType == null) {
			if (other.companyType != null)
				return false;
		} else if (!companyType.equals(other.companyType))
			return false;
		if (potentialPosition == null) {
			if (other.potentialPosition != null)
				return false;
		} else if (!potentialPosition.equals(other.potentialPosition))
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		if (industry == null) {
			if (other.industry != null)
				return false;
		} else if (!industry.equals(other.industry))
			return false;
		if (companyRemark == null) {
			if (other.companyRemark != null)
				return false;
		} else if (!companyRemark.equals(other.companyRemark))
			return false;
		return true;
	}
	
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((potentialName == null) ? 0 : potentialName.hashCode());
		result = prime * result + ((address == null) ? 0 : address.hashCode());
		result = prime * result + ((contact == null) ? 0 : contact.hashCode());
		result = prime * result + ((phone == null) ? 0 : phone.hashCode());
		result = prime * result + ((batchNum == null) ? 0 : batchNum.hashCode());
		result = prime * result + ((potentialCustomersStatus == null) ? 0 : potentialCustomersStatus.hashCode());
		result = prime * result + ((companyType == null) ? 0 : companyType.hashCode());
		result = prime * result + ((potentialPosition == null) ? 0 : potentialPosition.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((industry == null) ? 0 : industry.hashCode());
		result = prime * result + ((companyRemark == null) ? 0 : companyRemark.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		return result;
	}

}
