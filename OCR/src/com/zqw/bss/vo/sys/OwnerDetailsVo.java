package com.zqw.bss.vo.sys;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.model.crm.Remark;

public class OwnerDetailsVo extends BaseObject{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 
	 */
	private Long id;
	/**
	 * 日期
	 */
	private Date createDate;
	/**
	 * 登陆账号
	 */
	private String loginId;
	/**
	 * 注册电话
	 */

	private String regTelephone;
	/**
	 * 公司名称
	 */
	private String name;
	
	
	/**
	 * 累计购买金额
	 */
	private BigDecimal totalAmt =BigDecimal.ZERO;

	/**
	 * 销售负责人
	 */
	private String xs;

	/**
	 * 客服人员
	 */
	private String kf;
	
	/**
	 * 标签
	 */
	private String lebal;
	
	/**
	 * 备注
	 */
	private List<Remark> remark = new ArrayList<Remark>();

	public OwnerDetailsVo(Object[] o,List<Remark> remark) {
		this.id=Long.valueOf(o[0]+"");
		this.createDate= (Date) o[1];
		this.loginId=(String) o[2];
	    String regTelephone = (String) o[3];
		if (regTelephone == null) {
			this.regTelephone = "";
		}else{
			this.regTelephone = regTelephone;
		}
		String name=(String) o[4];
		if (name == null) {
			this.name = "";
		}else{
			this.name = name;
		}
		BigDecimal totalAmt=(BigDecimal) o[5];
		if (totalAmt == null) {
			this.totalAmt = BigDecimal.ZERO;
		}else{
			this.totalAmt = totalAmt;
		}
		String xs=(String) o[6];
		if (xs == null) {
			this.xs = "";
		}else{
			this.xs = xs;
		}
		String kf=(String) o[7];
		if (kf == null) {
			this.kf = "";
		}else{
			this.kf = kf;
		}
		String lebal=(String) o[8];
		if (lebal == null) {
			this.lebal = "";
		}else{
			this.lebal = lebal;
		}
		this.remark=remark;
//		String s=(String) o[9];
//		List<Map<String,String>> remote=new ArrayList<>();
//		if ( s != null ) {
////			String[] split = s.split("----");
////			this.comment= java.util.Arrays.asList(split);
//			String[] split = s.split("--------");
//			for (String string : split) {
//				String[] split2 = string.split("@@@");
//				Map<String,String> map= new HashMap<>();
//				map.put("createDate", split2[0]);
//				map.put("remark", split2[1]);
//				remote.add(map);
//			}
//		}
//		this.remote=remote;
	}

	public List<Remark> getRemark() {
		return remark;
	}

	public void setRemark(List<Remark> remark) {
		this.remark = remark;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public String getXs() {
		return xs;
	}

	public void setXs(String xs) {
		this.xs = xs;
	}

	public String getKf() {
		return kf;
	}

	public void setKf(String kf) {
		this.kf = kf;
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
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((kf == null) ? 0 : kf.hashCode());
		result = prime * result + ((lebal == null) ? 0 : lebal.hashCode());
		result = prime * result + ((loginId == null) ? 0 : loginId.hashCode());
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((regTelephone == null) ? 0 : regTelephone.hashCode());
		result = prime * result + ((totalAmt == null) ? 0 : totalAmt.hashCode());
		result = prime * result + ((xs == null) ? 0 : xs.hashCode());
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
		OwnerDetailsVo other = (OwnerDetailsVo) obj;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (kf == null) {
			if (other.kf != null)
				return false;
		} else if (!kf.equals(other.kf))
			return false;
		if (lebal == null) {
			if (other.lebal != null)
				return false;
		} else if (!lebal.equals(other.lebal))
			return false;
		if (loginId == null) {
			if (other.loginId != null)
				return false;
		} else if (!loginId.equals(other.loginId))
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (regTelephone == null) {
			if (other.regTelephone != null)
				return false;
		} else if (!regTelephone.equals(other.regTelephone))
			return false;
		if (totalAmt == null) {
			if (other.totalAmt != null)
				return false;
		} else if (!totalAmt.equals(other.totalAmt))
			return false;
		if (xs == null) {
			if (other.xs != null)
				return false;
		} else if (!xs.equals(other.xs))
			return false;
		return true;
	}

	public OwnerDetailsVo() {
		super();
		// TODO Auto-generated constructor stub
	}



	
	

}
