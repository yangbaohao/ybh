package com.zqw.bss.service.remote.billing.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.BillingRecord;
import com.zqw.bss.service.billing.BillingRecordService;
import com.zqw.bss.service.remote.billing.RemoteBillingRecordService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

public class RemoteBillingRecordServiceImpl implements RemoteBillingRecordService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Autowired
	private BillingRecordService billingRecordService;

	@Override
	public BillingRecord saveBillingRecord(BillingRecord billingRecord) {
		// TODO Auto-generated method stub
		logger.info("begin saveBillingRecord. id  = [" + billingRecord.getId() + "]");
		return billingRecordService.saveBillingRecord(billingRecord);
	}

	@Override
	public Boolean delBillingRecordById(Long billingRecordId) {
		// TODO Auto-generated method stub
		logger.info("begin delBillingRecordById. id = ["+billingRecordId+"]");
		return billingRecordService.delBillingRecordById(billingRecordId);
	}

	@Override
	public Boolean updateBillingRecord(BillingRecord billingRecordId) {
		// TODO Auto-generated method stub
		logger.info("begin updateBillingRecord. id = ["+billingRecordId+"]");
		return billingRecordService.updateBillingRecord(billingRecordId);
	}

	@Override
	public BillingRecord getBillingRecordById(Long billingRecordId) {
		// TODO Auto-generated method stub
		logger.info("getBillingRecordById. id =["+billingRecordId+"]");
		return billingRecordService.getBillingRecordById(billingRecordId);
	}

	@Override
	public BaseModelList<BillingRecord> findBillingRecord(String query) {
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
		BaseModelList<BillingRecord> billingRecord = billingRecordService.findBillingRecord(bso);
		logger.info("end  findBillingRecord:[ id =" + WebUtil.getLogBasicString() + "]");
		return billingRecord;
	}	

}
