package com.zqw.bss.vo.fms;

import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.ReceiptInvoiceType;

/**
 * <p>Title:</p>
 * <p>Description:</p>
 * <p>Copyright: Copyright (c) 2016 </p>
 * <p>Company:zqw</p>
 * @author Dhuan
 * @date 2016年7月7日 下午6:26:52
 * @version 1.0
 */
public class ReceiptListForVo extends BaseObject {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -6116090139076237765L;

	private Long receiptid;
	
	private Long deliverid;
	
	private Long clientid;
	
	private Long dcmid;

	private Long reimbursementid;
	
	private Long expensePaymentid;
	
	/**
	 * 客户名称
	 */
	private String name; 
	
	private String useAmt; 
	/**
	 * 发票类型
	 */
	private String receiptType;
	
	/**
	 * 发票类别
	 */
	private ReceiptInvoiceType receiptInvoiceType;
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

	public Long getDcmid() {
		return dcmid;
	}

	public void setDcmid(Long dcmid) {
		this.dcmid = dcmid;
	}

	public Long getReimbursementid() {
		return reimbursementid;
	}

	public void setReimbursementid(Long reimbursementid) {
		this.reimbursementid = reimbursementid;
	}

	public Long getExpensePaymentid() {
		return expensePaymentid;
	}

	public void setExpensePaymentid(Long expensePaymentid) {
		this.expensePaymentid = expensePaymentid;
	}

	public String getUseAmt() {
		return useAmt;
	}

	public void setUseAmt(String useAmt) {
		this.useAmt = useAmt;
	}

	public Long getDeliverid() {
		return deliverid;
	}

	public void setDeliverid(Long deliverid) {
		this.deliverid = deliverid;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ReceiptInvoiceType getReceiptInvoiceType() {
		return receiptInvoiceType;
	}

	public void setReceiptInvoiceType(ReceiptInvoiceType receiptInvoiceType) {
		this.receiptInvoiceType = receiptInvoiceType;
	}

	public Long getReceiptid() {
		return receiptid;
	}

	public void setReceiptid(Long receiptid) {
		this.receiptid = receiptid;
	}

	public Long getClientid() {
		return clientid;
	}

	public void setClientid(Long clientid) {
		this.clientid = clientid;
	}

	public String getReceiptType() {
		return receiptType;
	}

	public void setReceiptType(String receiptType) {
		this.receiptType = receiptType;
	}


	public String getReceiptNumber() {
		return receiptNumber;
	}

	public void setReceiptNumber(String receiptNumber) {
		this.receiptNumber = receiptNumber;
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

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((clientid == null) ? 0 : clientid.hashCode());
		result = prime * result + ((entryDate == null) ? 0 : entryDate.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((receiptNumber == null) ? 0 : receiptNumber.hashCode());
		result = prime * result + ((receiptInvoiceType == null) ? 0 : receiptInvoiceType.hashCode());
		result = prime * result + ((receiptType == null) ? 0 : receiptType.hashCode());
		result = prime * result + ((receiptid == null) ? 0 : receiptid.hashCode());
		result = prime * result + ((receiptAmt == null) ? 0 : receiptAmt.hashCode());
		result = prime * result + ((unuseAmt == null) ? 0 : unuseAmt.hashCode());
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
		ReceiptListForVo other = (ReceiptListForVo) obj;
		if (clientid == null) {
			if (other.clientid != null)
				return false;
		} else if (!clientid.equals(other.clientid))
			return false;
		if (entryDate == null) {
			if (other.entryDate != null)
				return false;
		} else if (!entryDate.equals(other.entryDate))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (receiptNumber == null) {
			if (other.receiptNumber != null)
				return false;
		} else if (!receiptNumber.equals(other.receiptNumber))
			return false;
		if (receiptInvoiceType == null) {
			if (other.receiptInvoiceType != null)
				return false;
		} else if (!receiptInvoiceType.equals(other.receiptInvoiceType))
			return false;
		if (receiptType == null) {
			if (other.receiptType != null)
				return false;
		} else if (!receiptType.equals(other.receiptType))
			return false;
		if (receiptid == null) {
			if (other.receiptid != null)
				return false;
		} else if (!receiptid.equals(other.receiptid))
			return false;
		if (receiptAmt == null) {
			if (other.receiptAmt != null)
				return false;
		} else if (!receiptAmt.equals(other.receiptAmt))
			return false;
		if (unuseAmt == null) {
			if (other.unuseAmt != null)
				return false;
		} else if (!unuseAmt.equals(other.unuseAmt))
			return false;
		return true;
	}
	
	public ReceiptListForVo(){
		
	}
	
	public ReceiptListForVo(Object[] rs) {
		
		if (rs[0] != null){
			if(rs[7].equals("salesdcm")||rs[7].equals("purchasedcm")){
				this.dcmid = Long.valueOf(rs[0].toString());
			}else
			if(rs[7].equals("reimbursement")){
				this.reimbursementid = Long.valueOf(rs[0].toString());
			}else if(rs[7].equals("expensePayment")){
				this.expensePaymentid = Long.valueOf(rs[0].toString());
			}else{
				this.receiptid = Long.valueOf(rs[0].toString());
			}
		}
		this.clientid = Long.valueOf(rs[1].toString());
		this.name = (String) rs[2];
		this.receiptNumber = (String) rs[3];
		this.entryDate = (Date) rs[4];
		this.receiptAmt = (BigDecimal) rs[5];
		if (rs[6] != null)
			this.receiptInvoiceType = ReceiptInvoiceType.valueOf(rs[6].toString());
		if(rs[7].equals("salesdcm")){
			this.receiptType = "sales";
		}else
		if(rs[7].equals("purchasedcm")){
			this.receiptType = "purchase";
		}else
			this.receiptType =rs[7].toString();
		this.unuseAmt =(BigDecimal) rs[8];
	}
	
	// 
	public ReceiptListForVo(Long receiptid,String name, String receiptNumber, Date entryDate,
			BigDecimal receiptAmt, BigDecimal unuseAmt,ReceiptInvoiceType receiptInvoiceType, String receiptType) {
		super();
		this.receiptid = receiptid;
		this.name = name;
		this.receiptNumber = receiptNumber;
		this.entryDate = entryDate;
		this.receiptAmt = receiptAmt;
		this.receiptInvoiceType = receiptInvoiceType;
		this.receiptType = receiptType;
		this.unuseAmt = unuseAmt;
	}
	
	public ReceiptListForVo(Long deliverid, String useAmt) {
		super();
		this.deliverid = deliverid;
		this.useAmt = useAmt;
	}
	
}
