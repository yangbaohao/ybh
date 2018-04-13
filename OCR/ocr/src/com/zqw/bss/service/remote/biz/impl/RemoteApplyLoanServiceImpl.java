package com.zqw.bss.service.remote.biz.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.ws.rs.PathParam;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.biz.ApplyLoan;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.biz.ApplyLoanService;
import com.zqw.bss.service.mkt.voucher.VoucherService;
import com.zqw.bss.service.remote.biz.RemoteApplyLoanService;
import com.zqw.bss.service.remote.mkt.voucher.RemoteVoucherService;
import com.zqw.bss.util.SystemConstant.DispatchType;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.mkt.VoucherNameVo;
import com.zqw.bss.vo.mkt.VoucherVo;

public class RemoteApplyLoanServiceImpl implements RemoteApplyLoanService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected ApplyLoanService applyLoanService;

	@Override
	public BaseModelList<ApplyLoan> getApplyLoanByPage(String query) {
		logger.info("begin getApplyLoanByPage");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<ApplyLoan> list = applyLoanService.getApplyLoanByPage(bso);
		logger.info("end getApplyLoanByPage");
		return list;
	}

	@Override
	public Boolean approval(ApplyLoan applyLoan) {
		logger.info("begin approval");
		Boolean bo= applyLoanService.approval(applyLoan);
		logger.info("end approval");
		return bo;
	}

	@Override
	public Boolean deleteApplyLoan(Long id) {
		logger.info("begin deleteApplyLoan");
		Boolean bo= applyLoanService.deleteApplyLoan(id);
		logger.info("end deleteApplyLoan");
		return bo;
	}
	

}
