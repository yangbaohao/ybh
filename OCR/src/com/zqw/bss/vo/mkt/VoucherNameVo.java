package com.zqw.bss.vo.mkt;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

/**
 * 代金券管理详情
 * 
 * @author win7
 *
 */
public class VoucherNameVo extends BaseObject {
	// 编码
	private String voucherCode;
	// 代金卷金额
	private BigDecimal amount;
	// 发放类型
	private String dispatchType;
	// 用户类型
	private String userType = "用户";
	// 代理商
	private String agentName;
	// 分配的用户名
	private String loginId;
	// 是否使用
	private String available;
	/**
	 * 有效期开始时间
	 */
	private Date startTime;
	/**
	 * 有效期结束时间
	 */
	private Date endTime;
	/**
	 * 代金券状态
	 */
	private String state;

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getVoucherCode() {
		return voucherCode;
	}

	public void setVoucherCode(String voucherCode) {
		this.voucherCode = voucherCode;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getDispatchType() {
		return dispatchType;
	}

	public void setDispatchType(String dispatchType) {
		this.dispatchType = dispatchType;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getAgentName() {
		return agentName;
	}

	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getAvailable() {
		return available;
	}

	public void setAvailable(String available) {
		this.available = available;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((agentName == null) ? 0 : agentName.hashCode());
		result = prime * result + ((amount == null) ? 0 : amount.hashCode());
		result = prime * result + ((available == null) ? 0 : available.hashCode());
		result = prime * result + ((dispatchType == null) ? 0 : dispatchType.hashCode());
		result = prime * result + ((loginId == null) ? 0 : loginId.hashCode());
		result = prime * result + ((userType == null) ? 0 : userType.hashCode());
		result = prime * result + ((voucherCode == null) ? 0 : voucherCode.hashCode());
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
		VoucherNameVo other = (VoucherNameVo) obj;
		if (agentName == null) {
			if (other.agentName != null)
				return false;
		} else if (!agentName.equals(other.agentName))
			return false;
		if (amount == null) {
			if (other.amount != null)
				return false;
		} else if (!amount.equals(other.amount))
			return false;
		if (available == null) {
			if (other.available != null)
				return false;
		} else if (!available.equals(other.available))
			return false;
		if (dispatchType == null) {
			if (other.dispatchType != null)
				return false;
		} else if (!dispatchType.equals(other.dispatchType))
			return false;
		if (loginId == null) {
			if (other.loginId != null)
				return false;
		} else if (!loginId.equals(other.loginId))
			return false;
		if (userType == null) {
			if (other.userType != null)
				return false;
		} else if (!userType.equals(other.userType))
			return false;
		if (voucherCode == null) {
			if (other.voucherCode != null)
				return false;
		} else if (!voucherCode.equals(other.voucherCode))
			return false;
		return true;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public VoucherNameVo(Object[] object) {
		this.voucherCode = (String)object[0];
		this.amount = (BigDecimal)object[1];
		this.dispatchType = (String)object[2];
		this.agentName = (String)object[3];
		this.loginId = (String)object[4];
		this.available = object[5].toString();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			this.startTime = sdf.parse(object[6].toString());
			this.endTime = sdf.parse(object[7].toString());
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Date date=new Date();

		if ((object[5].toString()).equals("N")) {
			this.state = "已使用";
		}else if((new Date()).after(this.endTime)||(object[8].toString()).equals("Y")) {
			this.state = "已过期";
		}else if((object[5].toString()).equals("Y")){
			this.state = "未使用";
		}
	}
}
