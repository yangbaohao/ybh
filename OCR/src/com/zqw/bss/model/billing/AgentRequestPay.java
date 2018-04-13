package com.zqw.bss.model.billing;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
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
import com.zqw.bss.model.sale.AgentRevenue;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.util.AutoValueIgnore;
import com.zqw.bss.util.SystemConstant.PayStatus;

@Entity
@Table(name = "t_bss_agent_request_pay",indexes = {
		@Index(name = "payStatus_index", columnList = "payStatus"),
		@Index(name = "remark_index", columnList = "remark")
})
public class AgentRequestPay extends BaseObject {

	public AgentRequestPay() {
		super();
		// TODO Auto-generated constructor stub
	}

	private static final long serialVersionUID = -3674333975556571673L;

	private Long id;

	
	//private List<AgentRevenue> agentRevenues = new ArrayList<AgentRevenue>();
	private AgentRevenue agentRevenue;

	private PayStatus payStatus;

	private String remark;

	/**
	 * 创建日期
	 */
	private Date createDate;

	/**
	 * 创建人
	 */
	private String createBy;

	/**
	 * 更新日期
	 */
	private Date lastUpdateDate;

	/**
	 * 更新操作人
	 */
	private String lastUpdateBy;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

//	@AutoValueIgnore
//	@OneToMany(fetch = FetchType.EAGER)
//	@JoinColumn(name = "agentRequestPay_id")
//	@BatchSize(size = 100)
//	public List<AgentRevenue> getAgentRevenues() {
//		return agentRevenues;
//	}
//
//	public void setAgentRevenues(List<AgentRevenue> agentRevenues) {
//		this.agentRevenues = agentRevenues;
//	}
	@AutoValueIgnore
	@ManyToOne(targetEntity = AgentRevenue.class, fetch = FetchType.EAGER)
	//@ManyToOne(cascade ={ CascadeType.PERSIST, CascadeType.REMOVE }, targetEntity = AgentRevenue.class)
	//@JoinColumn(name = "agentRequest_id")
	public AgentRevenue getAgentRevenue() {
		return agentRevenue;
	}

	public void setAgentRevenue(AgentRevenue agentRevenue) {
		this.agentRevenue = agentRevenue;
	}

	@Enumerated(EnumType.STRING)
	public PayStatus getPayStatus() {
		return payStatus;
	}

	public void setPayStatus(PayStatus payStatus) {
		this.payStatus = payStatus;
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

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((agentRevenue == null) ? 0 : agentRevenue.hashCode());
		result = prime * result + ((createBy == null) ? 0 : createBy.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((lastUpdateBy == null) ? 0 : lastUpdateBy.hashCode());
		result = prime * result + ((lastUpdateDate == null) ? 0 : lastUpdateDate.hashCode());
		result = prime * result + ((payStatus == null) ? 0 : payStatus.hashCode());
		result = prime * result + ((remark == null) ? 0 : remark.hashCode());
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
		AgentRequestPay other = (AgentRequestPay) obj;
		if (agentRevenue == null) {
			if (other.agentRevenue != null)
				return false;
		} else if (!agentRevenue.equals(other.agentRevenue))
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
		if (payStatus != other.payStatus)
			return false;
		if (remark == null) {
			if (other.remark != null)
				return false;
		} else if (!remark.equals(other.remark))
			return false;
		return true;
	}

	public AgentRequestPay(Long id, AgentRevenue agentRevenue, PayStatus payStatus, String remark, Date createDate,
			String createBy, Date lastUpdateDate, String lastUpdateBy) {
		super();
		this.id = id;
		this.agentRevenue = agentRevenue;
		this.payStatus = payStatus;
		this.remark = remark;
		this.createDate = createDate;
		this.createBy = createBy;
		this.lastUpdateDate = lastUpdateDate;
		this.lastUpdateBy = lastUpdateBy;
	}

}
