package com.zqw.bss.model.crm;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;

import com.zqw.bss.util.SystemConstant;

/**
 * <p>
 * 个人信息
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * <code>PersonInfo</code>类用于描述个人信息。
 * 
 * 
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0
 */
@Entity
@Table(name = "t_crm_person_info")
@PrimaryKeyJoinColumn(name = "id")
public class PersonInfo extends UserInfo {

	private static final long serialVersionUID = 396089996856727980L;

	/**
	 * 性别
	 */
	private String salutation;

	/**
	 * 证件类型
	 */
	private SystemConstant.CertificateType certificateType;

	/**
	 * id
	 */
	private String certificateId;



	/**
	 * 职位
	 */
	private String title;
	/**
	 * 部门
	 */
	private String department;

	@Enumerated(EnumType.STRING)
	public SystemConstant.CertificateType getCertificateType() {
		return certificateType;
	}

	public void setCertificateType(SystemConstant.CertificateType certificateType) {
		this.certificateType = certificateType;
	}

	public String getCertificateId() {
		return certificateId;
	}

	public void setCertificateId(String certificateId) {
		this.certificateId = certificateId;
	}

	public String getSalutation() {
		return salutation;
	}

	public void setSalutation(String salutation) {
		this.salutation = salutation;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		PersonInfo other = (PersonInfo) obj;
		if (certificateId == null) {
			if (other.certificateId != null)
				return false;
		} else if (!certificateId.equals(other.certificateId))
			return false;
		if (certificateType == null) {
			if (other.certificateType != null)
				return false;
		} else if (!certificateType.equals(other.certificateType))
			return false;
		if (department == null) {
			if (other.department != null)
				return false;
		} else if (!department.equals(other.department))
			return false;
		if (salutation == null) {
			if (other.salutation != null)
				return false;
		} else if (!salutation.equals(other.salutation))
			return false;
		if (title == null) {
			if (other.title != null)
				return false;
		} else if (!title.equals(other.title))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + ((certificateId == null) ? 0 : certificateId.hashCode());
		result = prime * result + ((certificateType == null) ? 0 : certificateType.hashCode());
		result = prime * result + ((department == null) ? 0 : department.hashCode());

		result = prime * result + ((salutation == null) ? 0 : salutation.hashCode());
		result = prime * result + ((title == null) ? 0 : title.hashCode());
		return result;
	}
	public PersonInfo(){};
}
