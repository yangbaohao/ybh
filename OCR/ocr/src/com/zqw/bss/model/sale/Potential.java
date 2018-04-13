package com.zqw.bss.model.sale;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.crm.Address;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.util.AutoValueIgnore;

/**
 * <p>
 * 商机信息
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0
 */

@Entity
@Table(name = "t_bss_potential")
public class Potential extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 7592033714604074627L;
	/**
	 * 主键id
	 */
	private Long id;

	/**
	 * 商机名
	 */
	private String potentialName;

	/**
	 * 电话或手机
	 */
	private String phone;

	/**
	 * email
	 */
	private String email;

	/**
	 * 公司名
	 */
	private String contact;

	/**
	 * 备注
	 */
	private String comment;
	/**
	 * 客户地址
	 */
	private List<Address> address = new ArrayList<Address>();
	/**
	 * 销售代理(代理商)
	 */
	private SalesAgent salesAgent;
	/**
	 * 销售负责人
	 */
	private List<User> sal;
	/**
	 * QQ 
	 */
	private String qq;

	/**
	 * 微信
	 */
	private String wechat;

	/**
	 * 职位
	 */
	private String title;
	/**
	 * 状态
	 * 	notContact 未联系
	 * 	success 已完成
	 */
	private String status="notContact";
	/**
	 * 预计成交日期
	 */
	private Date closingDate;

	private List<PotentialTrack> trackList = new ArrayList<PotentialTrack>();

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	
	/**
	 *  客服信息
	 */
	private List<User> custom;
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "t_bss_potential_custom", joinColumns = { @JoinColumn(name = "potential_id") }, inverseJoinColumns = {
			@JoinColumn(name = "custom_id") })
	@BatchSize(size = 100)
	public List<User> getCustom() {
		return custom;
	}

	public void setCustom(List<User> custom) {
		this.custom = custom;
	}

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

	public String getPhone() {
		return phone;
	}

	@AutoValueIgnore
	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE }, fetch = FetchType.EAGER)
	@JoinColumn(name = "potential_id")
	@BatchSize(size = 50)
	public List<Address> getAddress() {
		return address;
	}

	public void setAddress(List<Address> address) {
		this.address = address;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "t_bss_potential_sal", joinColumns = { @JoinColumn(name = "potential_id") }, inverseJoinColumns = {
			@JoinColumn(name = "sal_id") })
	@BatchSize(size = 100)
	public List<User> getSal() {
		return sal;
	}

	public void setSal(List<User> userInfo) {
		this.sal = userInfo;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@ManyToOne(targetEntity = SalesAgent.class, fetch = FetchType.EAGER)
	public SalesAgent getSalesAgent() {
		return salesAgent;
	}

	public void setSalesAgent(SalesAgent salesAgent) {
		this.salesAgent = salesAgent;
	}

	@Column(nullable = false)
	public Date getClosingDate() {
		return closingDate;
	}

	public void setClosingDate(Date closingDate) {
		this.closingDate = closingDate;
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

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
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

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },targetEntity=PotentialTrack.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "potential_id")
	@BatchSize(size = 50)
	public List<PotentialTrack> getTrackList() {
		return trackList;
	}

	public void setTrackList(List<PotentialTrack> trackList) {
		this.trackList = trackList;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
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
		Potential other = (Potential) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
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
		return true;
	}

}
