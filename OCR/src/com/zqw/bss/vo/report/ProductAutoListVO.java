package com.zqw.bss.vo.report;

import com.zqw.bss.framework.model.BaseObject;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:产品输入框自动匹配产品所需的字段
 * </p>
 * <p>
 * Copyright: Copyright (c) 2016 www.accountyun.com
 * </p>
 * <p>
 * Company:zqw
 * </p>
 * 
 * @author zhangzhe
 * @date 2016年5月14日 上午10:17:56
 * @version 1.0
 */
public class ProductAutoListVO extends BaseObject {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1305295700935233461L;

	/**
	 * 产品名称
	 */
	private String name;

	/**
	 * sku编码
	 */
	private String sku;

	/**
	 * id
	 */
	private Long id;


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSku() {
		return sku;
	}

	public void setSku(String sku) {
		this.sku = sku;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + ((sku == null) ? 0 : sku.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());

		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (getClass() != obj.getClass())
			return false;
		ProductAutoListVO other = (ProductAutoListVO) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!sku.equals(other.sku))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}

	public ProductAutoListVO(Long id, String sku, String name) {
		super();
		this.name = name;
		this.sku = sku;
		this.id=id;
	}

	public ProductAutoListVO() {
		super();
	}
	
}
