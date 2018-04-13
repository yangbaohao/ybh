package com.zqw.bss.model.crm;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.zqw.bss.util.AutoValueIgnore;

/**
 * <p>
 * 针对单一客户的应付，应收统计物化类
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
@Table(name = "t_materialize_client_account")
public class ClientAccount extends BaseAccount {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8062442866478003473L;

	/**
	 * 客户（供应商）信息
	 */
	private ClientInfo clientInfo;

	@AutoValueIgnore
	@ManyToOne(targetEntity = ClientInfo.class, fetch = FetchType.LAZY)
	public ClientInfo getClientInfo() {
		return clientInfo;
	}

	public void setClientInfo(ClientInfo clientInfo) {
		this.clientInfo = clientInfo;
	}

}
