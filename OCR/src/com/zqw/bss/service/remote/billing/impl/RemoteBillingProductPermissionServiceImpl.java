package com.zqw.bss.service.remote.billing.impl;

import javax.ws.rs.PathParam;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.BillingProductPermission;
import com.zqw.bss.service.billing.BillingProductPermissionService;
import com.zqw.bss.service.remote.billing.RemoteBillingProductPermissionService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

public class RemoteBillingProductPermissionServiceImpl implements RemoteBillingProductPermissionService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Autowired
	private BillingProductPermissionService billingProductPermissionService;

	@Override
	public Boolean saveBillingProductPermission(String channel,String ids,String amt,BillingProductPermission billingProductPermission) {
		logger.info("begin saveBillingProductPermission. id  = [" + billingProductPermission.getId() + "]");
		return billingProductPermissionService.saveBillingProductPermission(channel,ids,amt,billingProductPermission);
	}

	@Override
	public Boolean delBillingProductPermissionById(Long billingProductPermissionId) {
		// TODO Auto-generated method stub
		logger.info("begin delBillingProductPermissionById. id = ["+billingProductPermissionId+"]");
		return billingProductPermissionService.delBillingProductPermissionById(billingProductPermissionId);
	}

	@Override
	public Boolean updateBillingProductPermission(BillingProductPermission billingProductPermissionId) {
		// TODO Auto-generated method stub
		logger.info("begin updateBillingProductPermission. id = ["+billingProductPermissionId+"]");
		return billingProductPermissionService.updateBillingProductPermission(billingProductPermissionId);
	}

	@Override
	public BillingProductPermission getBillingProductPermissionById(Long billingProductPermissionId) {
		// TODO Auto-generated method stub
		logger.info("begin getBillingProductPermissionById. id = ["+billingProductPermissionId+"]");
		return billingProductPermissionService.getBillingProductPermissionById(billingProductPermissionId);
	}

	@Override
	public BaseModelList<BillingProductPermission> findBillingProductPermission(String query) {
		// TODO Auto-generated method stub
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		bso.setSortdatafield("lastUpdateDate");
		bso.setSortorder("desc");
		Condition con = new Condition();
		con.setAction("eq");
		con.setKey("ownerId");
		String[] str = new String[] { String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID)) };
		con.setValue(str);
		bso.condition.add(con);
		logger.info(bso);
		BaseModelList<BillingProductPermission> billingProductPermission = billingProductPermissionService.findBillingProductPermission(bso);
		logger.info("end  findBillingProductPermission:[ id =" + WebUtil.getLogBasicString() + "]");
		return billingProductPermission;
	}	

}
