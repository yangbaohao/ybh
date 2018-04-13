package com.zqw.bss.model.basic;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.zqw.bss.framework.model.BaseObject;

@Entity
@Table(name = "t_bss_sequence_number", uniqueConstraints = { @UniqueConstraint(columnNames = { "prefix" }) })
public class SequenceNumber extends BaseObject {

	/**
	 * id
	 */
	private Long id;

	/**
	 * 
	 */
	private static final long serialVersionUID = -7017032262258022529L;

	/**
	 * 随机编码
	 */
	private String prefix;

	/**
	 * 凭证编号
	 */
	private Long number = 1L;

	/**
	 * 凭证编号
	 */
	private Date createDate = new Date();

	public SequenceNumber() {

	}

	public SequenceNumber(String prefix) {

		this.prefix = prefix;

	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public Long getNumber() {
		return number;
	}

	public void setNumber(Long number) {
		this.number = number;
	}

	@Column(columnDefinition = "date")
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((number == null) ? 0 : number.hashCode());
		result = prime * result + ((prefix == null) ? 0 : prefix.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (getClass() != obj.getClass())
			return false;
		SequenceNumber other = (SequenceNumber) obj;
		if (number == null) {
			if (other.number != null)
				return false;
		} else if (!number.equals(other.number))
			return false;
		if (prefix == null) {
			if (other.prefix != null)
				return false;
		} else if (!prefix.equals(other.prefix))
			return false;
		return true;
	}

}
