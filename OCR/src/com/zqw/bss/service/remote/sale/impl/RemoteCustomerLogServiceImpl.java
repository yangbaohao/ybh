package com.zqw.bss.service.remote.sale.impl;



import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;


import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.sale.CustomerLog;


import com.zqw.bss.service.remote.sale.RemoteCustomerLogService;
import com.zqw.bss.service.sale.CustomerLogService;


public class RemoteCustomerLogServiceImpl implements RemoteCustomerLogService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected CustomerLogService customerLogService;

	@Override
	public BaseModelList<CustomerLog> getCustomerLogByPage(String query) {
		logger.info("begin getCustomerLogByPage");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<CustomerLog> list=customerLogService.getCustomerLogByPage(bso);
		logger.info("end getCustomerLogByPage");
		return list;
	}

	@Override
	public Boolean saveCustomerLog(CustomerLog CustomerLog) {
		logger.info("begin saveCustomerLog");
		Boolean bo= customerLogService.saveCustomerLog(CustomerLog);
		logger.info("end saveCustomerLog");
		return bo;
	}

	@Override
	public Boolean delectCustomerLog(Long id) {
		logger.info("begin delectCustomerLog");
		Boolean bo=customerLogService.delectCustomerLog(id);
		logger.info("end delectCustomerLog");
		return bo;
	}

	@Override
	public Boolean updateCustomerLog(CustomerLog customerLog) {
		logger.info("begin updateCustomerLog");
		Boolean bo=customerLogService.updateCustomerLog(customerLog);
		logger.info("end updateCustomerLog");
		return bo;
	}

	@Override
	public Boolean saveContentRemark(Remark remark, String type,Long id) {
		logger.info("begin saveContentRemark");
		Boolean bo=customerLogService.saveContentRemark(remark,type,id);
		logger.info("end saveContentRemark");
		return bo;
	}

	@Override
	public Boolean updateContentRemark(Remark remark, String type) {
		logger.info("begin updateContentRemark");
		Boolean bo=customerLogService.updateContentRemark(remark,type);
		logger.info("end updateContentRemark");
		return bo;
	}



	



}
