/**
 * 
 */
package com.zqw.bss.model.fms;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.BatchSize;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zqw.bss.framework.model.bpmn.BpmnBaseObject;
import com.zqw.bss.util.SystemConstant.BizStatus;
import com.zqw.bss.util.SystemConstant.JournalBizType;
import com.zqw.bss.util.SystemConstant.JournalType;
import com.zqw.bss.util.SystemConstant.StandardMoney;

/**
 * <p>
 * 凭证类
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
@Table(name = "t_fms_journal", indexes = {
		@Index(name = "remark_index", columnList = "remark"), @Index(name = "clientId_index", columnList = "clientId"),
		@Index(name = "bizId_index", columnList = "bizId"),
		@Index(name = "fileInfoIds_index", columnList = "fileInfoIds") },
uniqueConstraints={@UniqueConstraint(columnNames={"ownerId", "journalType","journalNumber","entryMonth"})})   
public class Journal extends BpmnBaseObject {

	public Journal() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = -2389005783102852521L;

	/**
	 * ownerId
	 */
	private Long ownerId;

	/**
	 * 凭证明细列表
	 */
	private List<JournalDetail> journalDetails = new ArrayList<JournalDetail>();

	/**
	 * 凭证类型 0: 手工录入的凭证 1: 业务过来的自动产生的凭证 2: 结转产生的凭证
	 * 
	 * 
	 */
	private JournalType journalType = JournalType.auto;

	/**
	 * 凭证号
	 */
	private Long journalNumber;

	/**
	 * 凭证号
	 */
	private String journalNumberForShow;

	/**
	 * 币种
	 */
	private StandardMoney currency = StandardMoney.RMB;

	/**
	 * 总金额
	 */
	private BigDecimal totalAmt = new BigDecimal(0);

	/**
	 * 备注（打印出现）
	 */
	private String remarkPrint;
	/**
	 * 备注（打印不出现）
	 */
	private String remark;
	/**
	 * 凭证发生日期
	 */
	private Date entryDate;

	/**
	 * 凭证发生月
	 */
	private String entryMonth;

	/**
	 * 关联业务ID
	 */
	private Long bizId;

	/**
	 * 客户ID
	 */
	private Long clientId;

	/**
	 * 关联业务类型
	 */
	private JournalBizType journalBizType;

	/**
	 * 对应上传文件的id列表
	 */
	private String fileInfoIds;

	/**
	 * 附单页码
	 */
	private Long noteNumber;

	/**
	 * 业务状态： 作废canceled，正常normal，关闭closed,
	 */
	protected BizStatus bizStatus;

	@Enumerated(EnumType.STRING)
	public BizStatus getBizStatus() {
		return bizStatus;
	}

	public void setBizStatus(BizStatus bizStatus) {
		this.bizStatus = bizStatus;
	}

	@JsonIgnore
	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	public void setJournalNumberForShow(String journalNumberForShow) {
		this.journalNumberForShow = journalNumberForShow;
	}

	public String getEntryMonth() {
		return entryMonth;
	}

	public void setEntryMonth(String entryMonth) {
		this.entryMonth = entryMonth;
	}

	@Transient
	public String getJournalNumberForShow() {
		if (this.getJournalType().equals(JournalType.auto)) {
			if (this.getJournalNumber() < 10) {
				return "Y0" + this.getJournalNumber().toString();
			}
			return "Y" + this.getJournalNumber().toString();
		}
		if (this.getJournalType().equals(JournalType.carryover)) {
			if (this.getJournalNumber() < 10) {
				return "Z0" + this.getJournalNumber().toString();
			}
			return "Z" + this.getJournalNumber().toString();
		}
		if (this.getJournalType().equals(JournalType.input) ) {
			if (this.getJournalNumber() < 10) {
				return "S0" + this.getJournalNumber().toString();
			}
			return "S" + this.getJournalNumber().toString();
		}
		if (this.getJournalType().equals(JournalType.generalDcouments)) {
			if (this.getJournalNumber() < 10) {
				return "T0" + this.getJournalNumber().toString();
			}
			return "T" + this.getJournalNumber().toString();
		}
		return journalNumberForShow;
	}

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.REMOVE }, fetch = FetchType.EAGER)
	@JoinColumn(name = "journal_id")
	@OrderBy("debitAmt desc, creditAmt desc")
	@BatchSize(size = 100)
	public List<JournalDetail> getJournalDetails() {
		return journalDetails;
	}

	public void setJournalDetails(List<JournalDetail> journalDetails) {
		this.journalDetails = journalDetails;
	}

	@Enumerated(EnumType.STRING)
	public JournalType getJournalType() {
		return journalType;
	}

	public void setJournalType(JournalType journalType) {
		this.journalType = journalType;
	}

	public Long getJournalNumber() {
		return journalNumber;
	}

	public void setJournalNumber(Long journalNumber) {
		this.journalNumber = journalNumber;
	}

	public String getFileInfoIds() {
		return fileInfoIds;
	}

	public void setFileInfoIds(String fileInfoIds) {
		this.fileInfoIds = fileInfoIds;
	}

	@Enumerated(EnumType.STRING)
	public StandardMoney getCurrency() {
		return currency;
	}

	public void setCurrency(StandardMoney currency) {
		this.currency = currency;
	}

	public Date getEntryDate() {
		return entryDate;
	}

	public void setEntryDate(Date entryDate) {
		this.entryDate = entryDate;
	}

	public String getRemarkPrint() {
		return remarkPrint;
	}

	public void setRemarkPrint(String remarkPrint) {
		this.remarkPrint = remarkPrint;
	}

	@Column(scale = 2)
	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getBizId() {
		return bizId;
	}

	public void setBizId(Long bizId) {
		this.bizId = bizId;
	}

	@Enumerated(EnumType.STRING)
	public JournalBizType getJournalBizType() {
		return journalBizType;
	}

	public void setJournalBizType(JournalBizType journalBizType) {
		this.journalBizType = journalBizType;
	}

	public Long getNoteNumber() {
		return noteNumber;
	}

	public void setNoteNumber(Long noteNumber) {
		this.noteNumber = noteNumber;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((bizId == null) ? 0 : bizId.hashCode());
		result = prime * result + ((clientId == null) ? 0 : clientId.hashCode());
		result = prime * result + ((currency == null) ? 0 : currency.hashCode());
		result = prime * result + ((entryDate == null) ? 0 : entryDate.hashCode());
		result = prime * result + ((fileInfoIds == null) ? 0 : fileInfoIds.hashCode());
		result = prime * result + ((journalBizType == null) ? 0 : journalBizType.hashCode());
		result = prime * result + ((journalDetails == null) ? 0 : journalDetails.hashCode());
		result = prime * result + ((journalNumber == null) ? 0 : journalNumber.hashCode());
		result = prime * result + ((journalType == null) ? 0 : journalType.hashCode());
		result = prime * result + ((noteNumber == null) ? 0 : noteNumber.hashCode());
		result = prime * result + ((ownerId == null) ? 0 : ownerId.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((remarkPrint == null) ? 0 : remarkPrint.hashCode());
		result = prime * result + ((totalAmt == null) ? 0 : totalAmt.hashCode());
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
		Journal other = (Journal) obj;
		if (bizId == null) {
			if (other.bizId != null)
				return false;
		} else if (!bizId.equals(other.bizId))
			return false;
		if (clientId == null) {
			if (other.clientId != null)
				return false;
		} else if (!clientId.equals(other.clientId))
			return false;
		if (currency != other.currency)
			return false;
		if (entryDate == null) {
			if (other.entryDate != null)
				return false;
		} else if (!entryDate.equals(other.entryDate))
			return false;
		if (fileInfoIds == null) {
			if (other.fileInfoIds != null)
				return false;
		} else if (!fileInfoIds.equals(other.fileInfoIds))
			return false;
		if (journalBizType != other.journalBizType)
			return false;
		if (journalDetails == null) {
			if (other.journalDetails != null)
				return false;
		} else if (!journalDetails.equals(other.journalDetails))
			return false;
		if (journalNumber == null) {
			if (other.journalNumber != null)
				return false;
		} else if (!journalNumber.equals(other.journalNumber))
			return false;
		if (journalType != other.journalType)
			return false;
		if (noteNumber == null) {
			if (other.noteNumber != null)
				return false;
		} else if (!noteNumber.equals(other.noteNumber))
			return false;
		if (ownerId == null) {
			if (other.ownerId != null)
				return false;
		} else if (!ownerId.equals(other.ownerId))
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		if (remarkPrint == null) {
			if (other.remarkPrint != null)
				return false;
		} else if (!remarkPrint.equals(other.remarkPrint))
			return false;
		if (totalAmt == null) {
			if (other.totalAmt != null)
				return false;
		} else if (!totalAmt.equals(other.totalAmt))
			return false;
		return true;
	}

}
