package com.zqw.bss.model.fms;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.Index;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.basic.UionPKId;
import com.zqw.bss.util.AutoValueIgnore;
import com.zqw.bss.util.SystemConstant.DebitCredit;
import com.zqw.bss.util.SystemConstant.Display;

/**
 * <p>
 * 科目类
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
@Table(name = "t_fms_chart_of_account", indexes = {
		@Index(name = "parentId_index", columnList = "parentId"),
		@Index(name = "name_index", columnList = "name"),
		@Index(name = "ref_index", columnList = "ref")
},
uniqueConstraints={@UniqueConstraint(columnNames={"ownerId", "name"})})
public class ChartOfAccount extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7404853361818031075L;
	
	@EmbeddedId
	private UionPKId uuId;
	
	/**
	 *id
	 */
	private Long id;

	/**
	 *注册用户
	 */
	private Long ownerId;

	/**
	 *父类科目
	 */
	private Long parentId;

	/**
	 *科目级别
	 */
	private Long level;

	/**
	 *entry日期
	 */
	private Date entryDateTime;

	/**
	 *借方对应现金流量表的记录
	 */
	private CashFlow debitCashFlow;

	/**
	 *贷方现金流量表的记录
	 */
	private CashFlow creditCashFlow;

	/**
	 *科目名字
	 */
	private String name;

	/**
	 *ID号 , ID 为4位数，如果是子科目的，就为6位数，在前面4位数后面加2位数
	 */
	private String ref;

	/**
	 *就是如果该科目是父科目（下面有子科目的，可以设置No，这样的话，凭证录入就不能直接选这个，只能选子科目录入）
	 * 凡是父科目的，都不允许直接录入，都必须录入到子科目里面。
	 */
	
	private Boolean allowInput=Boolean.FALSE;
	
	/**
	 *1: 借 -1: 贷
	 */
	private DebitCredit debitCredit = DebitCredit.debit;

	/**
	 * 流动资产 1，非流动资产5，流动负债11， 非流动负债15，所有者权益21， 主营收入31，主营成本71， 主营支出51，非主营收入41
	 * 非主营支出61， 利润 81
	 * 
	 * 资产类： 流动资产 1， 非流动资产5，
	 * 
	 * 负债类： 流动负债11， 非流动负债15，
	 * 
	 * 所有者权益类： 所有者权益21，
	 * 
	 * 成本类： 主营成本71，
	 * 
	 * 损益类： 主营收入31， 主营支出51， 非主营收入41 非主营支出61， 利润 81
	 * 
	 * 
	 * 
	 */
	private Long coaClass;

	/**
	 * 0 ，可以借，也可以贷;1，只能借;-1，只能贷。
	 */
	private Display display = Display.unlimited;

	/**
	 * 全部的科目，都有一个初始的值。没有就默认是0
	 */
	private BigDecimal iniValue =  BigDecimal.ZERO;

	/**
	 * 固化当前值，每次有交易都更新
	 */
	private BigDecimal currValue = BigDecimal.ZERO;

	/**
	 * 等于ref
	 */
	private String hardCode;

	/**
	 * 本年累计借方',
	 */
	private BigDecimal debitAmt = BigDecimal.ZERO;

	/**
	 * 本年累计贷方
	 */
	private BigDecimal creditAmt = BigDecimal.ZERO;

	/**
	 * 年初余额
	 */
	private BigDecimal balance = BigDecimal.ZERO;

	/**
	 * 是否启用
	 */
	private Boolean enabled=Boolean.TRUE;

	/**
	 * 是否来自原始的科目
	 */

	private Boolean frTemplate;

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;

	@JsonIgnore
	@EmbeddedId
	public UionPKId getUuId() {
		return uuId;
	}

	public void setUuId(UionPKId uuId) {
		if(uuId==null)
			this.setUuId(new UionPKId());
		this.uuId = uuId;
	}
	
	
	@Transient
	public Long getId() {
		
		return uuId==null?null: uuId.getId();
	}

	

	public void setId(Long id) {
		if(uuId==null)
			this.setUuId(new UionPKId());
		this.uuId.setId(id);
	}

	@Transient
	@JsonIgnore
	public Long getOwnerId() {
		return uuId==null?null: uuId.getOwnerId();
	}

	public void setOwnerId(Long ownerId) {
		this.uuId.setOwnerId(ownerId);
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public Long getLevel() {
		return level;
	}

	public void setLevel(Long level) {
		this.level = level;
	}

	@AutoValueIgnore
	@ManyToOne(targetEntity = CashFlow.class, fetch = FetchType.LAZY)
	public CashFlow getDebitCashFlow() {
		return debitCashFlow;
	}

	public void setDebitCashFlow(CashFlow debitCashFlow) {
		this.debitCashFlow = debitCashFlow;
	}

	@AutoValueIgnore
	@ManyToOne(targetEntity = CashFlow.class, fetch = FetchType.LAZY)
	public CashFlow getCreditCashFlow() {
		return creditCashFlow;
	}

	public void setCreditCashFlow(CashFlow creditCashFlow) {
		this.creditCashFlow = creditCashFlow;
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

	public Date getEntryDateTime() {
		return entryDateTime;
	}

	public void setEntryDateTime(Date entryDateTime) {
		this.entryDateTime = entryDateTime;
	}
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getAllowInput() {
		return allowInput;
	}

	public void setAllowInput(Boolean allowInput) {
		this.allowInput = allowInput;
	}

	public Long getCoaClass() {
		return coaClass;
	}

	public void setCoaClass(Long coaClass) {
		this.coaClass = coaClass;
	}

	@Enumerated(value = EnumType.STRING)
	public DebitCredit getDebitCredit() {
		return debitCredit;
	}

	public void setDebitCredit(DebitCredit debitCredit) {
		this.debitCredit = debitCredit;
	}

	@Enumerated(value = EnumType.STRING)
	public Display getDisplay() {
		return display;
	}

	public void setDisplay(Display display) {
		this.display = display;
	}

	@Column(scale=2)
	public BigDecimal getIniValue() {
		return iniValue;
	}

	public void setIniValue(BigDecimal iniValue) {
		this.iniValue = iniValue;
	}

	@Column(scale=2)
	public BigDecimal getCurrValue() {
		return currValue;
	}

	@Column(scale=2)
	public BigDecimal getDebitAmt() {
		return debitAmt;
	}

	public void setDebitAmt(BigDecimal debitAmt) {
		this.debitAmt = debitAmt;
	}

	@Column(scale=2)
	public BigDecimal getCreditAmt() {
		return creditAmt;
	}

	public void setCreditAmt(BigDecimal creditAmt) {
		this.creditAmt = creditAmt;
	}

	@Column(scale=2)
	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	@Column(name = "enabled")
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	public void setCurrValue(BigDecimal currValue) {
		this.currValue = currValue;
	}

	@Column(nullable = false, updatable = false)
	public String getHardCode() {
		return hardCode;
	}

	public void setHardCode(String hardCode) {
		this.hardCode = hardCode;
	}

	@Column(name = "frTemplate")
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getFrTemplate() {
		return frTemplate;
	}

	public void setFrTemplate(Boolean frTemplate) {
		this.frTemplate = frTemplate;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 0;
		result = prime * result
				+ ((coaClass == null) ? 0 : coaClass.hashCode());
		result = prime * result
				+ ((allowInput == null) ? 0 : allowInput.hashCode());
		result = prime * result
				+ ((currValue == null) ? 0 : currValue.hashCode());
		result = prime * result
				+ ((debitCredit == null) ? 0 : debitCredit.hashCode());
		result = prime * result + ((display == null) ? 0 : display.hashCode());
		result = prime * result
				+ ((frTemplate == null) ? 0 : frTemplate.hashCode());
		result = prime * result
				+ ((hardCode == null) ? 0 : hardCode.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result
				+ ((iniValue == null) ? 0 : iniValue.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		
		result = prime * result
				+ ((parentId == null) ? 0 : parentId.hashCode());
		result = prime * result + ((ref == null) ? 0 : ref.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (getClass() != obj.getClass())
			return false;
		ChartOfAccount other = (ChartOfAccount) obj;
		if (coaClass == null) {
			if (other.coaClass != null)
				return false;
		} else if (!coaClass.equals(other.coaClass))
			return false;
		if (allowInput == null) {
			if (other.allowInput != null)
				return false;
		} else if (!allowInput.equals(other.allowInput))
			return false;
		if (currValue == null) {
			if (other.currValue != null)
				return false;
		} else if (!currValue.equals(other.currValue))
			return false;
		if (debitCredit == null) {
			if (other.debitCredit != null)
				return false;
		} else if (!debitCredit.equals(other.debitCredit))
			return false;
		if (display == null) {
			if (other.display != null)
				return false;
		} else if (!display.equals(other.display))
			return false;
		if (frTemplate == null) {
			if (other.frTemplate != null)
				return false;
		} else if (!frTemplate.equals(other.frTemplate))
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
		if (iniValue == null) {
			if (other.iniValue != null)
				return false;
		} else if (!iniValue.equals(other.iniValue))
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
		if (parentId == null) {
			if (other.parentId != null)
				return false;
		} else if (!parentId.equals(other.parentId))
			return false;
		if (ref == null) {
			if (other.ref != null)
				return false;
		} else if (!ref.equals(other.ref))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return this.id + "," + this.ref + this.name + ":{iniValue:"
				+ this.iniValue + ",balance:" + this.balance + "}\r\n";

	}

	@SuppressWarnings("unused")
	private String displayValue;

	@Transient
	public String getDisplayValue() {
		return this.ref + this.name;
	}
	
	@SuppressWarnings("unused")
	private String pid;
	
	@Transient
	public String getPid() {
		return this.parentId==null?"":this.parentId.toString();
	}

	public void setDisplayValue(String displayValue) {
		this.displayValue = displayValue;
	}

}
