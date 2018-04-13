package com.zqw.bss.vo.sys;

import java.util.Date;

import com.zqw.bss.framework.model.BaseObject;

public class InformationLogsVo extends BaseObject{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * 推送编号
	 */
	private String number;
	
	/**
	 * 推送主题
	 */
	private String theme;
	
	/**
	 * 日期
	 */
	private Date createDate;
	
	
	/**
	 * 条数
	 */
	private Long count=1L;
	
	/**
	 * 查看数量
	 */
	private Long lookCount;
	
	/**
	 * 消息内容
	 */
	private String content;
	
	/**
	 * 推送人
	 */
	private String username;
	
	/**
	 * 是否查看
	 */
	private Boolean flag;
	
	/**
	 * 公司名称
	 */
	private String name;

	public Long getLookCount() {
		return lookCount;
	}

	public void setLookCount(Long lookCount) {
		this.lookCount = lookCount;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Boolean getFlag() {
		return flag;
	}

	public void setFlag(Boolean flag) {
		this.flag = flag;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getTheme() {
		return theme;
	}

	public void setTheme(String theme) {
		this.theme = theme;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Long getCount() {
		return count;
	}

	public void setCount(Long count) {
		this.count = count;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((content == null) ? 0 : content.hashCode());
		result = prime * result + ((count == null) ? 0 : count.hashCode());
		result = prime * result + ((createDate == null) ? 0 : createDate.hashCode());
		result = prime * result + ((number == null) ? 0 : number.hashCode());
		result = prime * result + ((theme == null) ? 0 : theme.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
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
		InformationLogsVo other = (InformationLogsVo) obj;
		if (content == null) {
			if (other.content != null)
				return false;
		} else if (!content.equals(other.content))
			return false;
		if (count == null) {
			if (other.count != null)
				return false;
		} else if (!count.equals(other.count))
			return false;
		if (createDate == null) {
			if (other.createDate != null)
				return false;
		} else if (!createDate.equals(other.createDate))
			return false;
		if (number == null) {
			if (other.number != null)
				return false;
		} else if (!number.equals(other.number))
			return false;
		if (theme == null) {
			if (other.theme != null)
				return false;
		} else if (!theme.equals(other.theme))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

	public InformationLogsVo(String number, String theme, Date createDate, Long count, String content,
			String username) {
		super();
		this.number = number;
		this.theme = theme;
		this.createDate = createDate;
		this.count = count;
		this.content = content;
		this.username = username;
	}
	
	public InformationLogsVo(Boolean flag, Date createDate, String name, String content,
			String username) {
		super();
		this.flag = flag;
		this.createDate = createDate;
		this.name = name;
		this.content = content;
		this.username = username;
	}
	
	public InformationLogsVo(String number,Long lookCount){
		super();
		this.number=number;
		this.lookCount = lookCount;
	}
}
