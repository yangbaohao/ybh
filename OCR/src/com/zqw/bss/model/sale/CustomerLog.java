package com.zqw.bss.model.sale;


import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.util.AutoValueIgnore;

/**
 * 客服咨询记录 
 * 
 */

@Entity
@Table(name = "t_bss_customer_log")
public class CustomerLog extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 主键id
	 */
	private Long id;
	
	/**
	 * 聊天内容
	 */
//	private String content;
	private List<Remark> content;
	
	/**
	 * 电话 
	 */
	private String phone;
	
//	/**
//	 * 类型，0是客服,1是注册用户,2是非注册
//	 */
//	private String type;

	/**
	 *  客服信息
	 */
	private User customer;
	/**
	 * 备注
	 */
//	private String remark;
	private List<Remark> remark;
	
	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	
	/*
	 * 登录用户的名字
	 */
	private String name;
	
	
	/**
	 * 删除状态  1 删除  0未删
	 */
	private String isdelete="0";
	
	public String getIsdelete() {
		return isdelete;
	}

	public void setIsdelete(String isdelete) {
		this.isdelete = isdelete;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@AutoValueIgnore
	@ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}
	


	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

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



	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Override
	public boolean equals(Object arg0) {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return 0;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },targetEntity=Remark.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "content_id")
	@BatchSize(size = 50)
	public List<Remark> getContent() {
		return content;
	}

	public void setContent(List<Remark> content) {
		this.content = content;
	}

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },targetEntity=Remark.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "customer_log_id")
	@BatchSize(size = 50)
	public List<Remark> getRemark() {
		return remark;
	}

	public void setRemark(List<Remark> remark) {
		this.remark = remark;
	}
	
}
