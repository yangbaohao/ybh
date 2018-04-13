package com.zqw.bss.vo.sale;

import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class AgentRevenueDetailsVo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 主键id
	 */
	private Long id;
	/**
	 * 登陆账号
	 */
	private String loginId;
	/**
	 * 注册电话
	 */

	private String regTelephone;
	
	/**
     * 记录创建时间
     */
    private Date createDate;
	
    /**
     * 充值金额，单位元，保留两位
     */
    private BigDecimal amount;
    
    /**
	 * 公司名
	 */
	private String name;
    
	/**
	 * 购买模块名
	 */
	private String productName;
	
	/**
	 * 未提佣金 
	 */
	private BigDecimal unFee;
	
	/**
	 * 应提佣金 
	 */
	private BigDecimal neFee;
	/**
	 * 已提佣金 
	 */
	private BigDecimal edFee;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getRegTelephone() {
		return regTelephone;
	}

	public void setRegTelephone(String regTelephone) {
		this.regTelephone = regTelephone;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public BigDecimal getUnFee() {
		return unFee;
	}

	public void setUnFee(BigDecimal unFee) {
		this.unFee = unFee;
	}

	public BigDecimal getNeFee() {
		return neFee;
	}

	public void setNeFee(BigDecimal neFee) {
		this.neFee = neFee;
	}

	public BigDecimal getEdFee() {
		return edFee;
	}

	public void setEdFee(BigDecimal edFee) {
		this.edFee = edFee;
	}

	public AgentRevenueDetailsVo(Object[] rsArray) {
		if(rsArray[0]==null){
			this.id=0L;
		}else{
			this.id=Long.valueOf(rsArray[0].toString());
		}
		this.loginId=(String)rsArray[1];
		this.regTelephone=(String)rsArray[2];
		this.amount=(BigDecimal)rsArray[3];
		this.createDate=(Date)rsArray[4];
		this.productName=(String)rsArray[5];
		this.name=(String)rsArray[6];
		this.unFee=(BigDecimal)rsArray[7];
		if(rsArray[8]==null){
			this.neFee=BigDecimal.ZERO;
		}else{
			this.neFee=(BigDecimal)rsArray[8];
		}
		if(rsArray[9]==null){
			this.edFee=BigDecimal.ZERO;
		}else{
			this.edFee=(BigDecimal)rsArray[9];
		}
		
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

}
