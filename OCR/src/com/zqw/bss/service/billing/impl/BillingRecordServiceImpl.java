package com.zqw.bss.service.billing.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.BillingRecord;
import com.zqw.bss.service.billing.BillingRecordService;
import com.zqw.bss.util.WebUtil;


@Service
@SuppressWarnings({"unchecked" , "unused"})
public class BillingRecordServiceImpl implements BillingRecordService {

	Logger log = Logger.getLogger(getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public BillingRecord saveBillingRecord(BillingRecord billingRecord) {
		// TODO Auto-generated method stub
		log.debug("begin saveBillingRecord.");
		BillingRecord br = (BillingRecord)dao.save(billingRecord);
		return br;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delBillingRecordById(Long billingRecordId) {
		// TODO Auto-generated method stub
		Boolean flag = false;
		try {
			dao.removeObject(BillingRecord.class, billingRecordId);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
			log.debug("del fail Info = " + e.getMessage());
		}
		return flag;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateBillingRecord(BillingRecord billingRecord) {
		// TODO Auto-generated method stub
		log.debug("begin updateBillingRecord.");
		BillingRecord br = (BillingRecord) dao.update(billingRecord);
		log.debug("end  updateBillingRecord.Quotation : [ id =" + br.getId() + WebUtil.getLogBasicString() + "]");
		if(null != br && !"".equals(br) )
			return Boolean.TRUE;
		else
			return Boolean.FALSE;
	}
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BillingRecord getBillingRecordById(Long billingRecordId) {
		// TODO Auto-generated method stub
		BillingRecord billingRecord = (BillingRecord)dao.getObject(BillingRecord.class, billingRecordId);
		return billingRecord;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<BillingRecord> findBillingRecord(BasePagerObject condition) {
		// TODO Auto-generated method stub
		log.debug("begin findBillingRecord.");
		List<BillingRecord> list = dao.getLst4Paging(HsqlUtil.genSearchSql(
				condition, BillingRecord.class, null), new int[] {
				condition.getPagenum(),
				condition.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(
				condition, BillingRecord.class));
		BaseModelList<BillingRecord> lists =new BaseModelList<BillingRecord>(count, WebUtil.getEntryListFromProxyList(list, dao));
		log.debug("end findBillingRecord:[ id ="+ WebUtil.getLogBasicString() + "]");
		return null;
	}	
	
}
