package com.zqw.bss.model.sale;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
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
import javax.persistence.Transient;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.crm.UserInfo;
import com.zqw.bss.model.mkt.AgentCoupon;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.util.AutoValueIgnore;

/**
 * <p>
 * 销售代理(代理商)
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.ydcfo.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0
 */
@Entity
@Table(name = "t_bss_agent")
public class SalesAgent extends BaseObject {

	private static final long serialVersionUID = 6882343693368854888L;
	/**
	 * 主键id
	 */
	private Long id;
	/**
	 * 代理编号
	 */
	private String agentCode;
	/**
	 * 父代理编号
	 */
	private String parentAgentCode;
	/**
	 * 父代理收益率
	 */
	private double parentRate;
	/**
	 * 父代理名
	 */
	private String parentAgentName;
	/**
	 * 用户信息
	 */
	private UserInfo userInfo;
	/**
	 *销售负责人 
	 */
	private User sales;
	/**
	 *代理名字 
	 */
	private String agentName;
	/**
	 * 成功客户
	 */
	private int client;
	/**
	 * 付费客户
	 */
	private int feeClient;
	/**
	 * 累计佣金
	 */
	private BigDecimal fee;
	/**
	 * 未提佣金 
	 */
	private BigDecimal unFee;
	/**
	 * 代理商类型
	 */
	private String type;
	
	/**
	 * 开户银行 
	 */
	private String openBank;
	/**
	 * 银行账号 
	 */
	private String bankAccount;
	/**
	 *  用户账号信息
	 */
	private User user;
		
	public SalesAgent(){};
	/**
	 * 代理收益率
	 */
	private double rate;
	/**
	 * 是否是高级代理
	 */
	private Boolean senior;
	
	/**
	 * 标签
	 */
	private String lebal;
	
	/**
	 *  客服信息
	 */
	private User customer;
	/**
	 * 代理的姓名
	 */
	private String name;
	@Transient
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	private List<PotentialTrack> trackList = new ArrayList<PotentialTrack>();
	
	public SalesAgent(Long id, String agentCode, User sales, String agentName, 
			 String type, String openBank, String bankAccount) {
		super();
		this.id = id;
		this.agentCode = agentCode;
		this.sales = sales;
		this.agentName = agentName;
		this.type = type;
		this.openBank = openBank;
		this.bankAccount = bankAccount;
	}
	
	public SalesAgent(Object[] array){
		this.setId(((BigInteger)array[0]).longValue());
		this.setAgentCode((String)array[1]);
		this.setSales((User)array[2]);
		this.setAgentName((String)array[3]);
		this.setType((String)array[4]);
		this.setOpenBank((String)array[5]);
		this.setBankAccount((String)array[6]);
	}
	public SalesAgent(Object[] array,String name){
		this.setId(((BigInteger)array[0]).longValue());
		this.setAgentCode((String)array[1]);
		this.setSales((User)array[2]);
		this.setAgentName((String)array[3]);
		this.setType((String)array[4]);
		this.setOpenBank((String)array[5]);
		this.setBankAccount((String)array[6]);
		this.name=name;
	}
	
	public SalesAgent(Object[] array,int i){
		this.setId(((BigInteger)array[0]).longValue());
		this.setAgentCode((String)array[1]);
		this.setAgentName((String)array[2]);
	}



	public double getRate() {
		return rate;
	}

	public void setRate(double rate) {
		this.rate = rate;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getOpenBank() {
		return openBank;
	}

	public void setOpenBank(String openBank) {
		this.openBank = openBank;
	}

	public String getBankAccount() {
		return bankAccount;
	}

	public void setBankAccount(String bankAccount) {
		this.bankAccount = bankAccount;
	}

	public String getParentAgentCode() {
		return parentAgentCode;
	}

	public void setParentAgentCode(String parentAgentCode) {
		this.parentAgentCode = parentAgentCode;
	}

	public String getAgentCode() {
		return agentCode;
	}

	public void setAgentCode(String agentCode) {
		this.agentCode = agentCode;
	}

	public String getAgentName() {
		return agentName;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getSenior() {
		return senior;
	}

	public void setSenior(Boolean senior) {
		this.senior = senior;
	}

	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}
	
	@AutoValueIgnore
	@ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
	public User getCustomer() {
		return customer;
	}

	public void setCustomer(User customer) {
		this.customer = customer;
	}

	@AutoValueIgnore
	@ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
	public User getSales() {
		return sales;
	}

	public void setSales(User personInfo) {
		this.sales = personInfo;
	}
	@Transient
	public String getParentAgentName() {
		return parentAgentName;
	}

	public void setParentAgentName(String parentAgentName) {
		this.parentAgentName = parentAgentName;
	}

	@Transient
	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Transient
	public int getClient() {
		return client;
	}

	public void setClient(int client) {
		this.client = client;
	}
	@Transient
	public int getFeeClient() {
		return feeClient;
	}

	public void setFeeClient(int feeClient) {
		this.feeClient = feeClient;
	}
	@Transient
	public BigDecimal getFee() {
		return fee;
	}

	public void setFee(BigDecimal fee) {
		this.fee = fee;
	}
	@Transient
	public BigDecimal getUnFee() {
		return unFee;
	}

	public void setUnFee(BigDecimal unFee) {
		this.unFee = unFee;
	}

	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, targetEntity = UserInfo.class, fetch = FetchType.EAGER,optional=true)
	public UserInfo getUserInfo() {
		return userInfo;
	}

	public void setUserInfo(UserInfo userInfo) {
		this.userInfo = userInfo;
	}
	
	public double getParentRate() {
		return parentRate;
	}

	public void setParentRate(double parentRate) {
		this.parentRate = parentRate;
	}

	public String getLebal() {
		return lebal;
	}

	public void setLebal(String lebal) {
		this.lebal = lebal;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((agentCode == null) ? 0 : agentCode.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
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
		SalesAgent other = (SalesAgent) obj;
		if (agentCode == null) {
			if (other.agentCode != null)
				return false;
		} else if (!agentCode.equals(other.agentCode))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}
	
	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },targetEntity=PotentialTrack.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "salesAgent_id")
	@BatchSize(size = 50)
	public List<PotentialTrack> getTrackList() {
		return trackList;
	}

	public void setTrackList(List<PotentialTrack> trackList) {
		this.trackList = trackList;
	}

	public SalesAgent(Long id, String agentName, UserInfo userInfo, String agentCode) {
		this.id = id;
		this.agentCode = agentCode;
		this.agentName = agentName;
		this.userInfo = userInfo;
	}

	
}
