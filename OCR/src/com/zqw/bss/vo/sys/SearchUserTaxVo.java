package com.zqw.bss.vo.sys;
import java.math.BigDecimal;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.util.SystemConstant.Accountingstandards;
import com.zqw.bss.util.SystemConstant.SalesType;
import com.zqw.bss.util.SystemConstant.StandardMoney;
import com.zqw.bss.util.SystemConstant.TaxType;
public class SearchUserTaxVo extends BaseObject{

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
	 * 公司名
	 */
	private String name;
	/**
	 * 注册电话
	 */

	private String regTelephone;
	/**
	 * 注册人邮件
	 */
	private String email;

	/**
	 * 注册用户状态
	 */
	private Boolean locked = Boolean.FALSE;

	/**
	 * 币种
	 */
	private StandardMoney currency = StandardMoney.RMB;

	/**
	 * 纳税人性质
	 */
	private TaxType taxType = TaxType.smallscale;

	/**
	 * 增值税税率
	 */
	private Long vat;

	/**
	 * 会计准则
	 */
	private Accountingstandards accountingStandards = Accountingstandards.smallbusiness;

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
	 * 代税人代码
	 */
	private String taxCode;
	
	/**
	 * 购买模块名
	 */
	private String productName;

	/**
	 * 账期
	 */
	private String mouthDate;
	
	/**
	 * 报税人
	 */
	private String taxer;
	
	/**
	 * 报税状态
	 */
	private String taxProgressType;
	
	private String owerTaxCode;
	
	private String paidType;
	
	private Date startDate;
	
	private Date endDate;
	
	private String dateType;
	
	private BigDecimal payAmt;
	
	private String category1="";
	
	private String category2="";
	
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

	public String getDateType() {
		return dateType;
	}

	public void setDateType(String dateType) {
		this.dateType = dateType;
	}

	public BigDecimal getPayAmt() {
		return payAmt;
	}

	public void setPayAmt(BigDecimal payAmt) {
		this.payAmt = payAmt;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getPaidType() {
		return paidType;
	}

	public void setPaidType(String paidType) {
		this.paidType = paidType;
	}

	public String getOwerTaxCode() {
		return owerTaxCode;
	}

	public void setOwerTaxCode(String owerTaxCode) {
		this.owerTaxCode = owerTaxCode;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public String getAgentCode() {
		return agentCode;
	}

	public void setAgentCode(String agentCode) {
		this.agentCode = agentCode;
	}

	public String getProductName() {
		return productName;
	}

	public void setProductName(String productName) {
		this.productName = productName;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public BigDecimal getBalance() {
		return balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public Date getValidDatetime() {
		return validDatetime;
	}

	public void setValidDatetime(Date validDatetime) {
		this.validDatetime = validDatetime;
	}

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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Boolean getLocked() {
		return locked;
	}

	public void setLocked(Boolean locked) {
		this.locked = locked;
	}

	public StandardMoney getCurrency() {
		return currency;
	}

	public void setCurrency(StandardMoney currency) {
		this.currency = currency;
	}

	public TaxType getTaxType() {
		return taxType;
	}

	public void setTaxType(TaxType taxType) {
		this.taxType = taxType;
	}

	public Long getVat() {
		return vat;
	}

	public void setVat(Long vat) {
		this.vat = vat;
	}

	public Accountingstandards getAccountingStandards() {
		return accountingStandards;
	}

	public void setAccountingStandards(Accountingstandards accountingStandards) {
		this.accountingStandards = accountingStandards;
	}

	public SalesType getSalesType() {
		return salesType;
	}

	public void setSalesType(SalesType salesType) {
		this.salesType = salesType;
	}

	public String getTaxCode() {
		return taxCode;
	}

	public void setTaxCode(String taxCode) {
		this.taxCode = taxCode;
	}

	public String getMouthDate() {
		return mouthDate;
	}

	public void setMouthDate(String mouthDate) {
		this.mouthDate = mouthDate;
	}

	public String getTaxer() {
		return taxer;
	}

	public void setTaxer(String taxer) {
		this.taxer = taxer;
	}

	public String getTaxProgressType() {
		return taxProgressType;
	}

	public void setTaxProgressType(String taxProgressType) {
		this.taxProgressType = taxProgressType;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((agentCode == null) ? 0 : agentCode.hashCode());
		result = prime * result + ((productName == null) ? 0 : productName.hashCode());
		result = prime * result + ((id== null) ? 0 :id.hashCode());
		result = prime * result + ((balance== null) ? 0 :balance.hashCode());
		result = prime * result + ((validDatetime== null) ? 0 :validDatetime.hashCode());
		result = prime * result + ((loginId== null) ? 0 :loginId.hashCode());
		result = prime * result + ((regName== null) ? 0 :regName.hashCode());
		result = prime * result + ((regTelephone== null) ? 0 :regTelephone.hashCode());
		result = prime * result + ((email== null) ? 0 :email.hashCode());
		result = prime * result + ((locked== null) ? 0 :locked.hashCode());
		result = prime * result + ((currency== null) ? 0 :currency.hashCode());
		result = prime * result + ((taxType== null) ? 0 :taxType.hashCode());
		result = prime * result + ((vat== null) ? 0 :vat.hashCode());
		result = prime * result + ((accountingStandards== null) ? 0 :accountingStandards.hashCode());
		result = prime * result + ((salesType== null) ? 0 :salesType.hashCode());
		result = prime * result + ((employeeCode== null) ? 0 :employeeCode.hashCode());
		result = prime * result + ((taxCode== null) ? 0 :taxCode.hashCode());
		result = prime * result + ((mouthDate== null) ? 0 :mouthDate.hashCode());
		result = prime * result + ((taxer== null) ? 0 :taxer.hashCode());
		result = prime * result + ((taxProgressType== null) ? 0 :taxProgressType.hashCode());
		result = prime * result + ((name== null) ? 0 :name.hashCode());
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
		SearchUserTaxVo other = (SearchUserTaxVo) obj;
		if (agentCode == null) {
			if (other.agentCode != null)
				return false;
		} else if (!agentCode.equals(other.agentCode))
			return false;
		if (productName == null) {
			if (other.productName != null)
				return false;
		} else if (!productName.equals(other.productName))
			return false;
		return true;
	}

	public SearchUserTaxVo(Object[] rsArray) {
		if(rsArray[0]!=null)
		this.paidType = rsArray[0].toString();
		this.id=Long.valueOf(rsArray[1].toString());
		this.balance=(BigDecimal)rsArray[2];
		this.validDatetime=(Date)rsArray[3];
		this.loginId=(String)rsArray[4];
		this.regName=(String)rsArray[5];
		this.regTelephone=(String)rsArray[6];
		this.email=(String)rsArray[7];
		this.locked=rsArray[8].equals("Y")?true:false;
		this.currency=Enum.valueOf(StandardMoney.class, ((String) rsArray[9]).trim());
		this.taxType=Enum.valueOf(TaxType.class, ((String) rsArray[10]).trim());
		if(rsArray[11]!=null){
			this.vat=Long.valueOf(rsArray[11].toString());
		}else{
			this.vat=0L;
		}
		this.accountingStandards=Enum.valueOf(Accountingstandards.class, ((String) rsArray[12]).trim());
		this.agentCode=(String)rsArray[13];
		this.salesType=Enum.valueOf(SalesType.class, ((String) rsArray[14]).trim());
		this.employeeCode=(String)rsArray[15];
		this.taxCode=(String)rsArray[16];
		this.productName=(String)rsArray[17];
		this.mouthDate=(String)rsArray[18];
		this.taxer=(String)rsArray[19];
		if(rsArray[20]==null)
			this.taxProgressType="无申报记录";
		else
		this.taxProgressType=(String)rsArray[20];
		this.name=(String)rsArray[21];
		if(rsArray[22]!=null)
		this.owerTaxCode=(String)rsArray[22];
		if(rsArray[23]!=null)
			this.startDate = (Date)rsArray[23];
		if(rsArray[24]!=null)
			this.endDate = (Date)rsArray[24];
		if(rsArray[25]!=null)
			this.dateType = rsArray[25].toString();
		if(rsArray[26]!=null)
			this.payAmt =new  BigDecimal(rsArray[26].toString());
		if(rsArray[27]!=null)
			this.category1 = rsArray[27].toString();
		if(rsArray[28]!=null)
			this.category2 = rsArray[28].toString();
	}

	public SearchUserTaxVo(Object object, Object object2, Object object3, Object object4, Object object5,
			Object object6) {
		this.id=Long.valueOf(object+"");
		this.loginId=(String) object2;
		this.name=(String) object3;
		if (object4.equals("smallscale")) {
			this.taxType=TaxType.smallscale;
		}else{
			this.taxType=TaxType.generalvat;
		}
		if(object5!=null){
			this.vat=Long.valueOf(object5.toString());
		}else{
			this.vat=0L;
		}
		this.mouthDate=(String) object6;	
	}

	public SearchUserTaxVo(Object[] rsArray, Object object) {
		this.id=Long.valueOf(rsArray[0].toString());
		this.balance=(BigDecimal)rsArray[1];
		this.validDatetime=(Date)rsArray[2];
		this.loginId=(String)rsArray[3];
		this.regName=(String)rsArray[4];
		this.regTelephone=(String)rsArray[5];
		this.email=(String)rsArray[6];
		this.locked=rsArray[7].equals("Y")?true:false;
		this.currency=Enum.valueOf(StandardMoney.class, ((String) rsArray[8]).trim());
		this.taxType=Enum.valueOf(TaxType.class, ((String) rsArray[9]).trim());
		if(rsArray[10]!=null){
			this.vat=Long.valueOf(rsArray[10].toString());
		}else{
			this.vat=0L;
		}
		this.accountingStandards=Enum.valueOf(Accountingstandards.class, ((String) rsArray[11]).trim());
		this.agentCode=(String)rsArray[12];
		this.salesType=Enum.valueOf(SalesType.class, ((String) rsArray[13]).trim());
		this.employeeCode=(String)rsArray[14];
		this.taxCode=(String)rsArray[15];
		this.productName=(String)rsArray[16];
		this.mouthDate=(String)rsArray[17];
		this.taxer=(String)rsArray[18];
		if(rsArray[19]==null)
			this.taxProgressType="无申报记录";
		else
		this.taxProgressType=(String)rsArray[19];
		this.name=(String)rsArray[20];
		if(rsArray[21]!=null)
		this.owerTaxCode=(String)rsArray[21];
	}

}
