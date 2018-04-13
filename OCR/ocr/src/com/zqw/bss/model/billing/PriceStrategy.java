package com.zqw.bss.model.billing;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.model.sys.User;

@Entity
@Table(name = "t_bss_PriceStrategy")
public class PriceStrategy extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 主键id
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	/**
	 *	满多少月
	 **/
	private Integer timeNum;
	/**
	 * 哪一个产品 
	 **/
	@ManyToOne(targetEntity = AccountProduct.class, fetch = FetchType.EAGER)
	@JoinColumn(name="accountProduct_id")
	private AccountProduct accountProduct;
	/**
	 *折扣数 
	 */
	private BigDecimal totalAmt = new BigDecimal(0);

	private Date createDate;
 
	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public AccountProduct getAccountProduct() {
		return accountProduct;
	}

	public void setAccountProduct(AccountProduct accountProduct) {
		this.accountProduct = accountProduct;
	}

	public Integer getTimeNum() {
		return timeNum;
	}

	public void setTimeNum(Integer timeNum) {
		this.timeNum = timeNum;
	}

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
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

	public PriceStrategy(Long id, Integer timeNum, BigDecimal totalAmt) {
		super();
		this.id = id;
		this.timeNum = timeNum;
		this.totalAmt = totalAmt;
	}

	public PriceStrategy() {
		super();
	}

}
