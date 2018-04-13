package com.zqw.bss.vo.sale;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.zqw.bss.framework.model.BaseObject;

public class SalesAgentFollowVo extends BaseObject{
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((agentName == null) ? 0 : agentName.hashCode());
		result = prime * result + ((comment == null) ? 0 : comment.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lebal == null) ? 0 : lebal.hashCode());
		result = prime * result + ((salesName == null) ? 0 : salesName.hashCode());
		result = prime * result + ((serviceName == null) ? 0 : serviceName.hashCode());
		result = prime * result + ((telephone == null) ? 0 : telephone.hashCode());
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
		SalesAgentFollowVo other = (SalesAgentFollowVo) obj;
		if (agentName == null) {
			if (other.agentName != null)
				return false;
		} else if (!agentName.equals(other.agentName))
			return false;
		if (comment == null) {
			if (other.comment != null)
				return false;
		} else if (!comment.equals(other.comment))
			return false;
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
		if (lebal == null) {
			if (other.lebal != null)
				return false;
		} else if (!lebal.equals(other.lebal))
			return false;
		if (salesName == null) {
			if (other.salesName != null)
				return false;
		} else if (!salesName.equals(other.salesName))
			return false;
		if (serviceName == null) {
			if (other.serviceName != null)
				return false;
		} else if (!serviceName.equals(other.serviceName))
			return false;
		if (telephone == null) {
			if (other.telephone != null)
				return false;
		} else if (!telephone.equals(other.telephone))
			return false;
		return true;
	}

	/**
	 * 主键id
	 */
	private String id;
	
	private Date createDate;

	
	/**
	 *代理名字 
	 */
	private String agentName;
	/**
	 * 电话
	 */
	private String telephone;
	/**
	 * *销售负责人 名字
	 */
	private String salesName;
	/**
	 * 客服
	 */
	private String serviceName;
	/**
	 * 标签
	 */
	private String lebal;
	
	/**
	 * 备注
	 */
	private List<String> comment=new ArrayList();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getAgentName() {
		return agentName;
	}

	public void setAgentName(String agentName) {
		this.agentName = agentName;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getSalesName() {
		return salesName;
	}

	public void setSalesName(String salesName) {
		this.salesName = salesName;
	}

	public String getServiceName() {
		return serviceName;
	}

	public void setServiceName(String serviceName) {
		this.serviceName = serviceName;
	}

	public String getLebal() {
		return lebal;
	}

	public void setLebal(String lebal) {
		this.lebal = lebal;
	}

	public List getComment() {
		return comment;
	}

	public void setComment(List comment) {
		this.comment = comment;
	}

	public SalesAgentFollowVo(Object object) {
		Object[]obj=(Object[]) object;
		this.id= obj[0]+"";
		this.createDate=(Date) obj[1];
		this.agentName=(String) obj[2];
		this.telephone=(String) obj[3];
		this.salesName=(String) obj[4];
		this.serviceName=(String) obj[5];
		this.lebal=(String) obj[6];
		String s=(String) obj[7];
		
		if ( s != null ) {
			String[] split = s.split("----");
			this.comment= java.util.Arrays.asList(split);
		}
		
	}
	public SalesAgentFollowVo() {
		super();
		// TODO Auto-generated constructor stub
	}

	
	
}
