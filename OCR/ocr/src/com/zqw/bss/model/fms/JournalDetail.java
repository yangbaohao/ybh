package com.zqw.bss.model.fms;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.AutoValueIgnore;
import com.zqw.bss.util.SystemConstant.DebitCredit;

/**
 * <p>
 * 凭证详细信息
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@Entity
@Table(name = "t_fms_journal_detail")
public class JournalDetail extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8113681672139768315L;
	/**
	 *id
	 */
	private Long id;
	/**
	 * ownerId
	 */
	private Long ownerId;

	/**
	 * 明细所属科目
	 */
	private ChartOfAccount chartOfAccount;

	/**
	 * 贷方金额
	 */
	private BigDecimal creditAmt = new BigDecimal(0);

	/**
	 * 借方金额
	 */
	private BigDecimal debitAmt = new BigDecimal(0);

	/**
	 * 凭证信息
	 */
	private Journal journal;

	/**
	 * 摘要(详情)
	 */
	private String description;
	
	/**
	 * 银行对账Flag
	 */
	private Boolean bankReconFlag = Boolean.FALSE;
	
	/**
	 * 分类一
	 */
	private String category1;
	
	/**
	 * 分类二
	 */
	private String category2;

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;

	/**
	 * 依据借贷方向，获取凭证金额
	 */
	@Transient
	public BigDecimal computeAmt() {

		this.chartOfAccount.getDebitCredit();

		BigDecimal amtflag = null;
		if (chartOfAccount.getDebitCredit().equals(DebitCredit.debit))
			amtflag = BigDecimal.valueOf(1);
		else
			amtflag = BigDecimal.valueOf(-1);

		BigDecimal sumAmt = getDebitAmt().subtract(getCreditAmt()).multiply(
				amtflag);

		return sumAmt;

	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@JsonIgnore
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}



	public String getCategory1() {
		return category1;
	}

	public void setCategory1(String category1) {
		this.category1 = category1;
	}

	public String getCategory2() {
		return category2;
	}

	public void setCategory2(String category2) {
		this.category2 = category2;
	}

	@JsonIgnore
	@AutoValueIgnore
	@ManyToOne(targetEntity = Journal.class, fetch = FetchType.EAGER)
	public Journal getJournal() {
		return journal;
	}

	public void setJournal(Journal journal) {
		this.journal = journal;
	}

	@AutoValueIgnore
	@ManyToOne(targetEntity = ChartOfAccount.class, fetch = FetchType.LAZY)
	public ChartOfAccount getChartOfAccount() {
		return chartOfAccount;
	}

	public void setChartOfAccount(ChartOfAccount chartOfAccount) {
		this.chartOfAccount = chartOfAccount;
	}

	@Column(scale=2)
	public BigDecimal getCreditAmt() {
		return creditAmt;
	}

	public void setCreditAmt(BigDecimal creditAmt) {
		this.creditAmt = creditAmt;
	}

	@Column(scale=2)
	public BigDecimal getDebitAmt() {
		return debitAmt;
	}

	public void setDebitAmt(BigDecimal debitAmt) {
		this.debitAmt = debitAmt;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Column(nullable = false, updatable = false)
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getBankReconFlag() {
		return bankReconFlag;
	}

	public void setBankReconFlag(Boolean bankReconFlag) {
		this.bankReconFlag = bankReconFlag;
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

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (getClass() != obj.getClass())
			return false;
		JournalDetail other = (JournalDetail) obj;
		if (chartOfAccount == null) {
			if (other.chartOfAccount != null)
				return false;
		} else if (!chartOfAccount.equals(other.chartOfAccount))
			return false;
		if (creditAmt == null) {
			if (other.creditAmt != null)
				return false;
		} else if (!creditAmt.equals(other.creditAmt))
			return false;
		if (debitAmt == null) {
			if (other.debitAmt != null)
				return false;
		} else if (!debitAmt.equals(other.debitAmt))
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result
				+ ((chartOfAccount == null) ? 0 : chartOfAccount.hashCode());
		result = prime * result
				+ ((creditAmt == null) ? 0 : creditAmt.hashCode());
		result = prime * result
				+ ((debitAmt == null) ? 0 : debitAmt.hashCode());
		result = prime * result
				+ ((description == null) ? 0 : description.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		return result;
	}

}
