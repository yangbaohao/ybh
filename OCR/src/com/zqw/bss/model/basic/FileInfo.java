package com.zqw.bss.model.basic;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>
 * 系统上传或产生的文件对应的元元数据
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
@Table(name = "t_bss_file_info", indexes = { @Index(name = "fileName_index", columnList = "fileName"),
		@Index(name = "showName_index", columnList = "showName") })
public class FileInfo extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/**
	 * id
	 */
	private Long id;

	/**
	 * 文件名称
	 */

	private String fileName;

	/**
	 * 文件路径
	 */
	@JsonIgnore
	private String filePath;

	/**
	 * 描叙
	 */
	private String fileDesc;

	/**
	 * 文件对应的编码
	 */
	private String showName;

	private Date createDate;

	private String createBy;
	@JsonIgnore
	private Date lastUpdateDate;
	@JsonIgnore
	private String lastUpdateBy;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getShowName() {
		return showName;
	}

	public void setShowName(String showName) {
		this.showName = showName;
	}

	public String getFileDesc() {
		return fileDesc;
	}

	public void setFileDesc(String fileDesc) {
		this.fileDesc = fileDesc;
	}

	@Column(nullable = false, updatable = false)
	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	@Column(nullable = false, updatable = false)
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
	public boolean equals(Object obj) {
		if (this == obj)
			return true;

		if (getClass() != obj.getClass())
			return false;
		FileInfo other = (FileInfo) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}

	public FileInfo() {
		super();
		// TODO Auto-generated constructor stub
	}

	public FileInfo( String filePath,String fileName,String showName) {
		this.fileName = fileName;
		this.filePath = filePath;
		this.showName=showName;
	}
	
}
