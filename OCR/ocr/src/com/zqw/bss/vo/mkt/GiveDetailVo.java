package com.zqw.bss.vo.mkt;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

/**
 * 产品赠送详情
 * @author 大宝
 *
 */
public class GiveDetailVo extends BaseObject{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public GiveDetailVo() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * 赠送日期
	 */
	private Date createDate;
	
	/**
	 * 用户名
	 */
	private String userName;
	
	/**
	 * 联系电话
	 */
	private String tel;
	/**
	 * 公司名称
	 */
	private String commpanyName;
	/**
	 * 代理商
	 */
	private String daili;
	/**
	 * 销售负责人
	 */
	private String sale;
	/**
	 * 客服
	 */
	private String kefu;
	/**
	 * 类型
	 */
	private String type;
	
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}
	public String getCommpanyName() {
		return commpanyName;
	}
	public void setCommpanyName(String commpanyName) {
		this.commpanyName = commpanyName;
	}
	public String getDaili() {
		return daili;
	}
	public void setDaili(String daili) {
		this.daili = daili;
	}
	public String getSale() {
		return sale;
	}
	public void setSale(String sale) {
		this.sale = sale;
	}
	public String getKefu() {
		return kefu;
	}
	public void setKefu(String kefu) {
		this.kefu = kefu;
	}
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((commpanyName == null) ? 0 : commpanyName.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((daili == null) ? 0 : daili.hashCode());
		result = prime * result + ((kefu == null) ? 0 : kefu.hashCode());
		result = prime * result + ((sale == null) ? 0 : sale.hashCode());
		result = prime * result + ((tel == null) ? 0 : tel.hashCode());
		result = prime * result + ((userName == null) ? 0 : userName.hashCode());
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
		GiveDetailVo other = (GiveDetailVo) obj;
		if (commpanyName == null) {
			if (other.commpanyName != null)
				return false;
		} else if (!commpanyName.equals(other.commpanyName))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (daili == null) {
			if (other.daili != null)
				return false;
		} else if (!daili.equals(other.daili))
			return false;
		if (kefu == null) {
			if (other.kefu != null)
				return false;
		} else if (!kefu.equals(other.kefu))
			return false;
		if (sale == null) {
			if (other.sale != null)
				return false;
		} else if (!sale.equals(other.sale))
			return false;
		if (tel == null) {
			if (other.tel != null)
				return false;
		} else if (!tel.equals(other.tel))
			return false;
		if (userName == null) {
			if (other.userName != null)
				return false;
		} else if (!userName.equals(other.userName))
			return false;
		return true;
	}
	
	public GiveDetailVo(Object[] object){
		this.createDate=(Date) object[2];
		this.commpanyName=(String) object[5];
		this.tel=(String) object[4];
		this.daili=(String) object[6];
		this.sale=(String) object[7];
		this.kefu=(String) object[8];
		this.userName=(String) object[3];
		this.type=(String) object[9];
	}
}
