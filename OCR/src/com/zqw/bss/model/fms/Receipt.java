package com.zqw.bss.model.fms;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.BizUtil;
import com.zqw.bss.util.SystemConstant.ReceiptInvoiceType;
import com.zqw.bss.util.SystemConstant.StandardMoney;

/**
 * <p>Title:</p>
 * <p>Description:</p>
 * <p>Copyright: Copyright (c) 2016 </p>
 * <p>Company:zqw</p>
 * @author Dhuan
 * @date 2016年7月5日 下午8:52:33
 * @version 1.0
 */
@Entity
@Table(name = "t_fms_receipt",indexes={
		@Index(name = "ownerId_index", columnList = "ownerId"),
		@Index(name = "clientId_index", columnList = "clientId"),
		@Index(name = "receiptNumber_index", columnList = "receiptNumber"),
		@Index(name = "taxRate_index", columnList = "taxRate"),
		@Index(name = "fileInfoIds_index", columnList = "fileInfoIds")},
		uniqueConstraints = {@UniqueConstraint(columnNames={"ownerId", "receiptNumber"})
	})
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "receiptType", discriminatorType = DiscriminatorType.STRING)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "receiptType")
@JsonSubTypes( {
		@JsonSubTypes.Type(name = "purchase", value = PurchaseReceipt.class),
		@JsonSubTypes.Type(name = "sales", value = SalesReceipt.class) })

public abstract class Receipt extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 9002127384465262519L;

	/**
	 * id
	 */
	private Long id;

	/**
	 * 注册用户ID
	 */
	private Long ownerId;

	private Long clientId;
	/**
	 * 发票号码
	 */
	private String receiptNumber;

	/**
	 * 开票日期
	 */
	private Date entryDate;

	/**
	 * 发票金额
	 */
	private BigDecimal receiptAmt = new BigDecimal(0);

	/**
	 * 未匹配金额
	 */
	private BigDecimal unuseAmt = new BigDecimal(0);

	/**
	 * 发票类别
	 */
	private ReceiptInvoiceType receiptInvoiceType;
	
	/**
	 * 账户科目
	 */
	private ChartOfAccount coaDeposit;
	
	/**
	 * 事由科目
	 */
	private ChartOfAccount coaReason;
	
	/**
	 * 备注打印时不显示
	 */
	private String remark;
	
	/**
	 * 备注打印时显示
	 */
	private String remark2;

	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	/**
	 * 税率
	 */
	private Long taxRate;
	
    private String fileInfoIds;
    
    private StandardMoney currency = StandardMoney.RMB;
    
    /**
     * 公司名称
     */
    private String name;
	
    public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Enumerated(EnumType.STRING)
	public StandardMoney getCurrency() {
		return currency;
	}

	public void setCurrency(StandardMoney currency) {
		this.currency = currency;
	}

//	@AutoValueIgnore
	@ManyToOne(targetEntity = ChartOfAccount.class, fetch = FetchType.LAZY)
	public ChartOfAccount getCoaReason() {
		return coaReason;
	}

	public void setCoaReason(ChartOfAccount coaReason) {
		this.coaReason = coaReason;
	}
	
//	@AutoValueIgnore
	@ManyToOne(targetEntity = ChartOfAccount.class, fetch = FetchType.LAZY)
	public ChartOfAccount getCoaDeposit() {
		return coaDeposit;
	}

	public void setCoaDeposit(ChartOfAccount coaDeposit) {
		this.coaDeposit = coaDeposit;
	}
	
	public String getFileInfoIds() {
		return fileInfoIds;
	}

	public void setFileInfoIds(String fileInfoIds) {
		this.fileInfoIds = fileInfoIds;
	}

	public Long getTaxRate() {
		return taxRate;
	}

	public void setTaxRate(Long taxRate) {
		this.taxRate = taxRate;
	}

	public String getRemark2() {
		return remark2;
	}

	public void setRemark2(String remark2) {
		this.remark2 = remark2;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	@Enumerated(EnumType.STRING)
	public ReceiptInvoiceType getReceiptInvoiceType() {
		return receiptInvoiceType;
	}

	public void setReceiptInvoiceType(ReceiptInvoiceType receiptInvoiceType) {
		this.receiptInvoiceType = receiptInvoiceType;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}


	public String getReceiptNumber() {
		return BizUtil.formatReceiptNumber(receiptNumber);
	}

	public void setReceiptNumber(String receiptNumber) {
		this.receiptNumber = BizUtil.formatReceiptNumber(receiptNumber);
	}

	public Date getEntryDate() {
		return entryDate;
	}

	public void setEntryDate(Date entryDate) {
		this.entryDate = entryDate;
	}

	public BigDecimal getReceiptAmt() {
		return receiptAmt;
	}

	public void setReceiptAmt(BigDecimal receiptAmt) {
		this.receiptAmt = receiptAmt;
	}

	public BigDecimal getUnuseAmt() {
		return unuseAmt;
	}

	public void setUnuseAmt(BigDecimal unuseAmt) {
		this.unuseAmt = unuseAmt;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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

}
