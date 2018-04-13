package com.zqw.bss.model.crm;

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
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.BatchSize;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.util.AutoValueIgnore;
import com.zqw.bss.util.SystemConstant.SalesType;
import com.zqw.bss.util.SystemConstant.StandardMoney;



/**
 * <p>
 * 系统注册用户
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
@Table(name = "t_crm_owner", indexes = { 
		@Index(name = "loginId_index", columnList = "loginId"),
		@Index(name = "regTelephone_index", columnList = "regTelephone")
})
public class Owner extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * Id
	 */
	private Long id;

	/**
	 * 账户余额
	 */
	private BigDecimal balance = BigDecimal.ZERO;

	/**
	 * 到期时间
	 */
	private Date validDatetime;

	/**
	 * 登陆账号
	 */
	private String loginId;

	/**
	 * 注册人名
	 */
	private String regName;
	/**
	 * 注册电话
	 */

	private String regTelephone;
	/**
	 * 注册人邮件
	 */
	private String regEmail;


	/**
	 * 注册企业信息
	 */
	private EnterpriseInfo enterpriseInfo;

	/**
	 * 注册用户状态
	 */
	private Boolean locked = Boolean.FALSE;

	/**
	 * 币种
	 */
	private StandardMoney currency = StandardMoney.RMB;


	/**
	 * 审核标志
	 */
	private Boolean auditFlag = Boolean.FALSE;

	/**
	 * 审核功能字符串
	 */
	private String auditFunctions = "";
	
	/**
	 * 数据权限标志
	 */
	private Boolean dataFlag = Boolean.FALSE;

	/**
	 * 数据权限字符串
	 * 客户：client
	 * 供应商：vendor
	 * 报价单：quotation
	 * 销售单：salesOrder
	 * 采购单：purchaseOrder
	 * 销售送货：salesDelivery
	 * 采购收货：purchaseDelivery
	 */
	private String dataFunctions = "";

	/**
	 * 是否启用分类一
	 */
	private Boolean category1Flag = Boolean.FALSE;
	/**
	 * 是否启用分类一
	 */
	private Boolean category2Flag = Boolean.FALSE;

	/**
	 * 分类一名称
	 */
	private String category1 = "分类一";

	/**
	 * 分类二名称
	 */
	private String category2 = "分类二";
	
	/**
	 * 是否启用种类
	 */
	private Boolean producttypeFlag = Boolean.FALSE;
	
	/**
	 * 是否启用单位
	 */
	private Boolean productunitFlag = Boolean.FALSE;
	
	/**
	 * 是否启用重量
	 */
	private Boolean productKgFlag = Boolean.FALSE;
	
	/**
	 * 是否启用货号
	 */
	private Boolean productNumberFlag = Boolean.FALSE;
	
	/**
	 * 是否启用颜色
	 */
	private Boolean productCoLorFlag = Boolean.FALSE;
	
	/**
	 *是否启用 装箱
	 */
	private Boolean productBoxFlag = Boolean.FALSE;
	
	/**
	 * 是否启用规格型号
	 */
	private Boolean productSpeFlag = Boolean.FALSE;
	
	/**
	 * 是否启用打印条款
	 */
	
	/**
	 * 打印条款内容
	 */
	private String printTermContent = "";
	
	/**
	 * 是否启用打印图片
	 */
	private Boolean printPictureFlag  = Boolean.FALSE;
	
	/**
	 * 收送货
	 */
	private Boolean deliveryFlag = Boolean.FALSE;
	
	/**
	 * 是否开启统一甚至规格型号
	 */
	private Boolean productSpeTypeFlag = Boolean.FALSE;
	
	/**
	 * 是否启统一设置颜色
	 */
	private Boolean productCoLorTypeFlag = Boolean.FALSE;
	
	/**
	 * 是否开启外箱尺寸
	 */
	private Boolean productMeasFlag = Boolean.FALSE;
	
	/**
	 * 是否开启会计开单
	 */
	private Boolean shortcutBilling = Boolean.FALSE;
	
	/**
	 * 是否开启热敏蓝牙打印
	 */
	private Boolean blueTooth = Boolean.FALSE;
	
	/**
	 * 增值税税率
	 */
	private Long vat;

	
	/**
	 * 销售代理编号
	 */
	private String agentCode;

	/**
	 * 类型
	 */
	private SalesType salesType = SalesType.salesDirect;

	/**
	 * 销售代码
	 */
	private String employeeCode;
	
	/**
	 * 五金
	 */
	private Boolean hangyeFlag0=Boolean.FALSE;
	
	/**
	 * 塑料
	 */
	private Boolean hangyeFlag1=Boolean.FALSE;
	
	/**
	 * 玩具
	 */
	private Boolean hangyeFlag2=Boolean.FALSE;

	/**
	 * 围巾
	 */
	private Boolean hangyeFlag3=Boolean.FALSE;
	
	/**
	 * 鞋帽箱包
	 */
	private Boolean hangyeFlag4=Boolean.FALSE;
	
	/**
	 * 眼睛钟表
	 */
	private Boolean hangyeFlag5=Boolean.FALSE;
	
	/**
	 * 文具
	 */
	private Boolean hangyeFlag6=Boolean.FALSE;
	
	/**
	 * 包装纸
	 */
	private Boolean hangyeFlag7=Boolean.FALSE;
	
	/**
	 * 雨具
	 */
	private Boolean hangyeFlag8=Boolean.FALSE;
	
	/**
	 * 客服代码
	 */
	private String customerCode;
	
	/**
	 * 其他
	 */
	private Boolean hangyeFlag9=Boolean.FALSE;
	
	private String lebal;
	/**
	 * 备注
	 */
	private List<Remark> remark = new ArrayList<Remark>();
	
	/**
	 *销售代理商 
	 */
	private SalesAgent agent;
	
	/**
	 *销售负责人 
	 */
	private User sales;
	
	private Date createDate;

	private String createBy;

	private Date lastUpdateDate;

	private String lastUpdateBy;
	
	@AutoValueIgnore
	@ManyToOne(targetEntity = User.class, fetch = FetchType.EAGER)
	public User getSales() {
		return sales;
	}

	public void setSales(User sales) {
		this.sales = sales;
	}
	@AutoValueIgnore
	@ManyToOne(targetEntity = SalesAgent.class, fetch = FetchType.LAZY)
	public SalesAgent getAgent() {
		return agent;
	}

	public void setAgent(SalesAgent agent) {
		this.agent = agent;
	}
	
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getBlueTooth() {
		return blueTooth;
	}

	public void setBlueTooth(Boolean blueTooth) {
		this.blueTooth = blueTooth;
	}

	public String getCustomerCode() {
		return customerCode;
	}

	public void setCustomerCode(String customerCode) {
		this.customerCode = customerCode;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getPrintPictureFlag() {
		return printPictureFlag;
	}

	public void setPrintPictureFlag(Boolean printPictureFlag) {
		this.printPictureFlag = printPictureFlag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductCoLorTypeFlag() {
		return productCoLorTypeFlag;
	}

	public void setProductCoLorTypeFlag(Boolean productCoLorTypeFlag) {
		this.productCoLorTypeFlag = productCoLorTypeFlag;
	}

	public String getLebal() {
		return lebal;
	}

	public void setLebal(String lebal) {
		this.lebal = lebal;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductSpeTypeFlag() {
		return productSpeTypeFlag;
	}

	public void setProductSpeTypeFlag(Boolean productSpeTypeFlag) {
		this.productSpeTypeFlag = productSpeTypeFlag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag0() {
		return hangyeFlag0;
	}
	
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductMeasFlag() {
		return productMeasFlag;
	}

	public void setProductMeasFlag(Boolean productMeasFlag) {
		this.productMeasFlag = productMeasFlag;
	}

	public void setHangyeFlag0(Boolean hangyeFlag0) {
		this.hangyeFlag0 = hangyeFlag0;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag1() {
		return hangyeFlag1;
	}

	public void setHangyeFlag1(Boolean hangyeFlag1) {
		this.hangyeFlag1 = hangyeFlag1;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag2() {
		return hangyeFlag2;
	}

	public void setHangyeFlag2(Boolean hangyeFlag2) {
		this.hangyeFlag2 = hangyeFlag2;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag3() {
		return hangyeFlag3;
	}

	public void setHangyeFlag3(Boolean hangyeFlag3) {
		this.hangyeFlag3 = hangyeFlag3;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag4() {
		return hangyeFlag4;
	}

	public void setHangyeFlag4(Boolean hangyeFlag4) {
		this.hangyeFlag4 = hangyeFlag4;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag5() {
		return hangyeFlag5;
	}

	public void setHangyeFlag5(Boolean hangyeFlag5) {
		this.hangyeFlag5 = hangyeFlag5;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag6() {
		return hangyeFlag6;
	}

	public void setHangyeFlag6(Boolean hangyeFlag6) {
		this.hangyeFlag6 = hangyeFlag6;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag7() {
		return hangyeFlag7;
	}

	public void setHangyeFlag7(Boolean hangyeFlag7) {
		this.hangyeFlag7 = hangyeFlag7;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag8() {
		return hangyeFlag8;
	}

	public void setHangyeFlag8(Boolean hangyeFlag8) {
		this.hangyeFlag8 = hangyeFlag8;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getHangyeFlag9() {
		return hangyeFlag9;
	}

	public void setHangyeFlag9(Boolean hangyeFlag9) {
		this.hangyeFlag9 = hangyeFlag9;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getDeliveryFlag() {
		return deliveryFlag;
	}

	public void setDeliveryFlag(Boolean deliveryFlag) {
		this.deliveryFlag = deliveryFlag;
	}
	
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductKgFlag() {
		return productKgFlag;
	}

	public void setProductKgFlag(Boolean productKgFlag) {
		this.productKgFlag = productKgFlag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductNumberFlag() {
		return productNumberFlag;
	}

	public void setProductNumberFlag(Boolean productNumberFlag) {
		this.productNumberFlag = productNumberFlag;
	}
	
	

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductCoLorFlag() {
		return productCoLorFlag;
	}
	
	
	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getShortcutBilling() {
		return shortcutBilling;
	}

	public void setShortcutBilling(Boolean shortcutBilling) {
		this.shortcutBilling = shortcutBilling;
	}

	public void setProductCoLorFlag(Boolean productCoLorFlag) {
		this.productCoLorFlag = productCoLorFlag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductBoxFlag() {
		return productBoxFlag;
	}

	public void setProductBoxFlag(Boolean productBoxFlag) {
		this.productBoxFlag = productBoxFlag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getProductSpeFlag() {
		return productSpeFlag;
	}

	public void setProductSpeFlag(Boolean productSpeFlag) {
		this.productSpeFlag = productSpeFlag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	public Boolean getDataFlag() {
		return dataFlag;
	}

	public void setDataFlag(Boolean dataFlag) {
		this.dataFlag = dataFlag;
	}

	public String getDataFunctions() {
		return dataFunctions;
	}

	public void setDataFunctions(String dataFunctions) {
		this.dataFunctions = dataFunctions;
	}

	@Enumerated(EnumType.STRING)
	public SalesType getSalesType() {
		return salesType;
	}

	public void setSalesType(SalesType salesType) {
		this.salesType = salesType;
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

	public Long getVat() {
		return vat;
	}

	public void setVat(Long vat) {
		this.vat = vat;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}



	

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	public StandardMoney getCurrency() {
		return currency;
	}

	public void setCurrency(StandardMoney currency) {
		this.currency = currency;
	}

	

	@org.hibernate.annotations.Type(type = "yes_no")
	@Column(nullable = false)
	public Boolean getCategory1Flag() {
		return category1Flag;
	}

	

	
	@org.hibernate.annotations.Type(type = "yes_no")
	@Column(nullable = false)
	public Boolean getAuditFlag() {
		return auditFlag;
	}
	


	public void setAuditFlag(Boolean auditFlag) {
		this.auditFlag = auditFlag;
	}

	public String getAuditFunctions() {
		return auditFunctions;
	}

	public void setAuditFunctions(String auditFunctions) {
		this.auditFunctions = auditFunctions;
	}

	public void setCategory1Flag(Boolean category1Flag) {
		this.category1Flag = category1Flag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	@Column(nullable = false)
	public Boolean getCategory2Flag() {
		return category2Flag;
	}

	public void setCategory2Flag(Boolean category2Flag) {
		this.category2Flag = category2Flag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	@Column(nullable = false)
	public Boolean getProducttypeFlag() {
		return producttypeFlag;
	}

	public void setProducttypeFlag(Boolean producttypeFlag) {
		this.producttypeFlag = producttypeFlag;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	@Column(nullable = false)
	public Boolean getProductunitFlag() {
		return productunitFlag;
	}

	public void setProductunitFlag(Boolean productunitFlag) {
		this.productunitFlag = productunitFlag;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@AutoValueIgnore
	@ManyToOne(targetEntity = EnterpriseInfo.class, fetch = FetchType.EAGER)
	public EnterpriseInfo getEnterpriseInfo() {
		return enterpriseInfo;
	}

	public void setEnterpriseInfo(EnterpriseInfo enterpriseInfo) {
		this.enterpriseInfo = enterpriseInfo;
	}

	public Date getValidDatetime() {
		return validDatetime;
	}

	public void setValidDatetime(Date validDatetime) {
		this.validDatetime = validDatetime;
	}

	@org.hibernate.annotations.Type(type = "yes_no")
	@Column(nullable = false)
	public Boolean getLocked() {
		return locked;
	}

	public void setLocked(Boolean locked) {
		this.locked = locked;
	}

	@Column(nullable = false)
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@Column(nullable = false)
	public String getCreateBy() {
		return createBy;
	}

	public void setCreateBy(String createBy) {
		this.createBy = createBy;
	}

	@Column(nullable = false)
	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	@Column(nullable = false)
	public String getLastUpdateBy() {
		return lastUpdateBy;
	}

	public void setLastUpdateBy(String lastUpdateBy) {
		this.lastUpdateBy = lastUpdateBy;
	}

	@Column(nullable = false)
	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getRegName() {
		return regName;
	}

	public void setRegName(String regName) {
		this.regName = regName;
	}

	public String getRegTelephone() {
		return regTelephone;
	}

	public void setRegTelephone(String regTelephone) {
		this.regTelephone = regTelephone;
	}

	public String getRegEmail() {
		return regEmail;
	}

	public void setRegEmail(String regEmail) {
		this.regEmail = regEmail;
	}

	public String getAgentCode() {
		return agentCode;
	}

	public void setAgentCode(String agentCode) {
		this.agentCode = agentCode;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getPrintTermContent() {
		return printTermContent;
	}

	public void setPrintTermContent(String printTermContent) {
		this.printTermContent = printTermContent;
	}

	@OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE },targetEntity=Remark.class, fetch = FetchType.EAGER)
	@JoinColumn(name = "owner_id")
	@BatchSize(size = 50)
	public List<Remark> getRemark() {
		return remark;
	}

	public void setRemark(List<Remark> remark) {
		this.remark = remark;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((agent == null) ? 0 : agent.hashCode());
		result = prime * result + ((agentCode == null) ? 0 : agentCode.hashCode());
		result = prime * result + ((auditFlag == null) ? 0 : auditFlag.hashCode());
		result = prime * result + ((auditFunctions == null) ? 0 : auditFunctions.hashCode());
		result = prime * result + ((balance == null) ? 0 : balance.hashCode());
		result = prime * result + ((blueTooth == null) ? 0 : blueTooth.hashCode());
		result = prime * result + ((category1 == null) ? 0 : category1.hashCode());
		result = prime * result + ((category1Flag == null) ? 0 : category1Flag.hashCode());
		result = prime * result + ((category2 == null) ? 0 : category2.hashCode());
		result = prime * result + ((category2Flag == null) ? 0 : category2Flag.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((currency == null) ? 0 : currency.hashCode());
		result = prime * result + ((customerCode == null) ? 0 : customerCode.hashCode());
		result = prime * result + ((dataFlag == null) ? 0 : dataFlag.hashCode());
		result = prime * result + ((dataFunctions == null) ? 0 : dataFunctions.hashCode());
		result = prime * result + ((deliveryFlag == null) ? 0 : deliveryFlag.hashCode());
		result = prime * result + ((employeeCode == null) ? 0 : employeeCode.hashCode());
		result = prime * result + ((enterpriseInfo == null) ? 0 : enterpriseInfo.hashCode());
		result = prime * result + ((hangyeFlag0 == null) ? 0 : hangyeFlag0.hashCode());
		result = prime * result + ((hangyeFlag1 == null) ? 0 : hangyeFlag1.hashCode());
		result = prime * result + ((hangyeFlag2 == null) ? 0 : hangyeFlag2.hashCode());
		result = prime * result + ((hangyeFlag3 == null) ? 0 : hangyeFlag3.hashCode());
		result = prime * result + ((hangyeFlag4 == null) ? 0 : hangyeFlag4.hashCode());
		result = prime * result + ((hangyeFlag5 == null) ? 0 : hangyeFlag5.hashCode());
		result = prime * result + ((hangyeFlag6 == null) ? 0 : hangyeFlag6.hashCode());
		result = prime * result + ((hangyeFlag7 == null) ? 0 : hangyeFlag7.hashCode());
		result = prime * result + ((hangyeFlag8 == null) ? 0 : hangyeFlag8.hashCode());
		result = prime * result + ((hangyeFlag9 == null) ? 0 : hangyeFlag9.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((lebal == null) ? 0 : lebal.hashCode());
		result = prime * result + ((locked == null) ? 0 : locked.hashCode());
		result = prime * result + ((loginId == null) ? 0 : loginId.hashCode());
		result = prime * result + ((printPictureFlag == null) ? 0 : printPictureFlag.hashCode());
		result = prime * result + ((printTermContent == null) ? 0 : printTermContent.hashCode());
		result = prime * result + ((productBoxFlag == null) ? 0 : productBoxFlag.hashCode());
		result = prime * result + ((productCoLorFlag == null) ? 0 : productCoLorFlag.hashCode());
		result = prime * result + ((productCoLorTypeFlag == null) ? 0 : productCoLorTypeFlag.hashCode());
		result = prime * result + ((productKgFlag == null) ? 0 : productKgFlag.hashCode());
		result = prime * result + ((productMeasFlag == null) ? 0 : productMeasFlag.hashCode());
		result = prime * result + ((productNumberFlag == null) ? 0 : productNumberFlag.hashCode());
		result = prime * result + ((productSpeFlag == null) ? 0 : productSpeFlag.hashCode());
		result = prime * result + ((productSpeTypeFlag == null) ? 0 : productSpeTypeFlag.hashCode());
		result = prime * result + ((producttypeFlag == null) ? 0 : producttypeFlag.hashCode());
		result = prime * result + ((productunitFlag == null) ? 0 : productunitFlag.hashCode());
		result = prime * result + ((regEmail == null) ? 0 : regEmail.hashCode());
		result = prime * result + ((regName == null) ? 0 : regName.hashCode());
		result = prime * result + ((regTelephone == null) ? 0 : regTelephone.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
		result = prime * result + ((sales == null) ? 0 : sales.hashCode());
		result = prime * result + ((salesType == null) ? 0 : salesType.hashCode());
		result = prime * result + ((shortcutBilling == null) ? 0 : shortcutBilling.hashCode());
		result = prime * result + ((validDatetime == null) ? 0 : validDatetime.hashCode());
		result = prime * result + ((vat == null) ? 0 : vat.hashCode());
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
		Owner other = (Owner) obj;
		if (agent == null) {
			if (other.agent != null)
				return false;
		} else if (!agent.equals(other.agent))
			return false;
		if (agentCode == null) {
			if (other.agentCode != null)
				return false;
		} else if (!agentCode.equals(other.agentCode))
			return false;
		if (auditFlag == null) {
			if (other.auditFlag != null)
				return false;
		} else if (!auditFlag.equals(other.auditFlag))
			return false;
		if (auditFunctions == null) {
			if (other.auditFunctions != null)
				return false;
		} else if (!auditFunctions.equals(other.auditFunctions))
			return false;
		if (balance == null) {
			if (other.balance != null)
				return false;
		} else if (!balance.equals(other.balance))
			return false;
		if (blueTooth == null) {
			if (other.blueTooth != null)
				return false;
		} else if (!blueTooth.equals(other.blueTooth))
			return false;
		if (category1 == null) {
			if (other.category1 != null)
				return false;
		} else if (!category1.equals(other.category1))
			return false;
		if (category1Flag == null) {
			if (other.category1Flag != null)
				return false;
		} else if (!category1Flag.equals(other.category1Flag))
			return false;
		if (category2 == null) {
			if (other.category2 != null)
				return false;
		} else if (!category2.equals(other.category2))
			return false;
		if (category2Flag == null) {
			if (other.category2Flag != null)
				return false;
		} else if (!category2Flag.equals(other.category2Flag))
			return false;
		if (createBy == null) {
			if (other.createBy != null)
				return false;
		} else if (!createBy.equals(other.createBy))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (currency != other.currency)
			return false;
		if (customerCode == null) {
			if (other.customerCode != null)
				return false;
		} else if (!customerCode.equals(other.customerCode))
			return false;
		if (dataFlag == null) {
			if (other.dataFlag != null)
				return false;
		} else if (!dataFlag.equals(other.dataFlag))
			return false;
		if (dataFunctions == null) {
			if (other.dataFunctions != null)
				return false;
		} else if (!dataFunctions.equals(other.dataFunctions))
			return false;
		if (deliveryFlag == null) {
			if (other.deliveryFlag != null)
				return false;
		} else if (!deliveryFlag.equals(other.deliveryFlag))
			return false;
		if (employeeCode == null) {
			if (other.employeeCode != null)
				return false;
		} else if (!employeeCode.equals(other.employeeCode))
			return false;
		if (enterpriseInfo == null) {
			if (other.enterpriseInfo != null)
				return false;
		} else if (!enterpriseInfo.equals(other.enterpriseInfo))
			return false;
		if (hangyeFlag0 == null) {
			if (other.hangyeFlag0 != null)
				return false;
		} else if (!hangyeFlag0.equals(other.hangyeFlag0))
			return false;
		if (hangyeFlag1 == null) {
			if (other.hangyeFlag1 != null)
				return false;
		} else if (!hangyeFlag1.equals(other.hangyeFlag1))
			return false;
		if (hangyeFlag2 == null) {
			if (other.hangyeFlag2 != null)
				return false;
		} else if (!hangyeFlag2.equals(other.hangyeFlag2))
			return false;
		if (hangyeFlag3 == null) {
			if (other.hangyeFlag3 != null)
				return false;
		} else if (!hangyeFlag3.equals(other.hangyeFlag3))
			return false;
		if (hangyeFlag4 == null) {
			if (other.hangyeFlag4 != null)
				return false;
		} else if (!hangyeFlag4.equals(other.hangyeFlag4))
			return false;
		if (hangyeFlag5 == null) {
			if (other.hangyeFlag5 != null)
				return false;
		} else if (!hangyeFlag5.equals(other.hangyeFlag5))
			return false;
		if (hangyeFlag6 == null) {
			if (other.hangyeFlag6 != null)
				return false;
		} else if (!hangyeFlag6.equals(other.hangyeFlag6))
			return false;
		if (hangyeFlag7 == null) {
			if (other.hangyeFlag7 != null)
				return false;
		} else if (!hangyeFlag7.equals(other.hangyeFlag7))
			return false;
		if (hangyeFlag8 == null) {
			if (other.hangyeFlag8 != null)
				return false;
		} else if (!hangyeFlag8.equals(other.hangyeFlag8))
			return false;
		if (hangyeFlag9 == null) {
			if (other.hangyeFlag9 != null)
				return false;
		} else if (!hangyeFlag9.equals(other.hangyeFlag9))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (lastUpdateBy == null) {
			if (other.lastUpdateBy != null)
				return false;
		} else if (!lastUpdateBy.equals(other.lastUpdateBy))
			return false;
		if (lastUpdateDate == null) {
			if (other.lastUpdateDate != null)
				return false;
		} else if (!lastUpdateDate.equals(other.lastUpdateDate))
			return false;
		if (lebal == null) {
			if (other.lebal != null)
				return false;
		} else if (!lebal.equals(other.lebal))
			return false;
		if (locked == null) {
			if (other.locked != null)
				return false;
		} else if (!locked.equals(other.locked))
			return false;
		if (loginId == null) {
			if (other.loginId != null)
				return false;
		} else if (!loginId.equals(other.loginId))
			return false;
		if (printPictureFlag == null) {
			if (other.printPictureFlag != null)
				return false;
		} else if (!printPictureFlag.equals(other.printPictureFlag))
			return false;
		if (printTermContent == null) {
			if (other.printTermContent != null)
				return false;
		} else if (!printTermContent.equals(other.printTermContent))
			return false;
		if (productBoxFlag == null) {
			if (other.productBoxFlag != null)
				return false;
		} else if (!productBoxFlag.equals(other.productBoxFlag))
			return false;
		if (productCoLorFlag == null) {
			if (other.productCoLorFlag != null)
				return false;
		} else if (!productCoLorFlag.equals(other.productCoLorFlag))
			return false;
		if (productCoLorTypeFlag == null) {
			if (other.productCoLorTypeFlag != null)
				return false;
		} else if (!productCoLorTypeFlag.equals(other.productCoLorTypeFlag))
			return false;
		if (productKgFlag == null) {
			if (other.productKgFlag != null)
				return false;
		} else if (!productKgFlag.equals(other.productKgFlag))
			return false;
		if (productMeasFlag == null) {
			if (other.productMeasFlag != null)
				return false;
		} else if (!productMeasFlag.equals(other.productMeasFlag))
			return false;
		if (productNumberFlag == null) {
			if (other.productNumberFlag != null)
				return false;
		} else if (!productNumberFlag.equals(other.productNumberFlag))
			return false;
		if (productSpeFlag == null) {
			if (other.productSpeFlag != null)
				return false;
		} else if (!productSpeFlag.equals(other.productSpeFlag))
			return false;
		if (productSpeTypeFlag == null) {
			if (other.productSpeTypeFlag != null)
				return false;
		} else if (!productSpeTypeFlag.equals(other.productSpeTypeFlag))
			return false;
		if (producttypeFlag == null) {
			if (other.producttypeFlag != null)
				return false;
		} else if (!producttypeFlag.equals(other.producttypeFlag))
			return false;
		if (productunitFlag == null) {
			if (other.productunitFlag != null)
				return false;
		} else if (!productunitFlag.equals(other.productunitFlag))
			return false;
		if (regEmail == null) {
			if (other.regEmail != null)
				return false;
		} else if (!regEmail.equals(other.regEmail))
			return false;
		if (regName == null) {
			if (other.regName != null)
				return false;
		} else if (!regName.equals(other.regName))
			return false;
		if (regTelephone == null) {
			if (other.regTelephone != null)
				return false;
		} else if (!regTelephone.equals(other.regTelephone))
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		if (sales == null) {
			if (other.sales != null)
				return false;
		} else if (!sales.equals(other.sales))
			return false;
		if (salesType != other.salesType)
			return false;
		if (shortcutBilling == null) {
			if (other.shortcutBilling != null)
				return false;
		} else if (!shortcutBilling.equals(other.shortcutBilling))
			return false;
		if (validDatetime == null) {
			if (other.validDatetime != null)
				return false;
		} else if (!validDatetime.equals(other.validDatetime))
			return false;
		if (vat == null) {
			if (other.vat != null)
				return false;
		} else if (!vat.equals(other.vat))
			return false;
		return true;
	}
	
	





}
