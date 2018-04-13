package com.zqw.bss.service.remote.mkt.voucher.impl;

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
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.mkt.voucher.VoucherService;
import com.zqw.bss.service.remote.mkt.voucher.RemoteVoucherService;
import com.zqw.bss.util.SystemConstant.DispatchType;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.mkt.VoucherNameVo;
import com.zqw.bss.vo.mkt.VoucherVo;

public class RemoteVoucherServiceImpl implements RemoteVoucherService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected VoucherService voucherService;

	//
	// @Override
	// public Boolean saveVoucher(Voucher voucher) {
	// // TODO Auto-generated method stub
	// logger.info("begin saveVoucher. id = ["+voucher.getId()+"]");
	// return voucherService.saveVoucher(voucher);
	// }
	//
	// @Override
	// public Boolean updateVoucher(Voucher voucher) {
	// // TODO Auto-generated method stub
	// logger.info("begin updateVoucher. id = ["+voucher.getId()+"]");
	// return voucherService.updateVoucher(voucher);
	// }
	//
	// @Override
	// public Voucher getVoucherById(Long id) {
	// // TODO Auto-generated method stub
	// logger.info("begin getVoucherById. id = ["+id+"]");
	// return (Voucher)
	// WebUtil.getEntryFromProxyObj(voucherService.getVoucherById(id));
	//
	// }
	//
	// @Override
	// public Boolean deleteVoucher(Long id) {
	// // TODO Auto-generated method stub
	// logger.info("begin deleteVoucher. id = ["+id+"]");
	// return voucherService.deleteVoucher(id);
	// }
	//
	// @Override
	// public BaseModelList<Voucher> getAllVoucherByPage(String query) {
	// logger.info("begin getAllVoucherByPage");
	// String request = HsqlUtil.DecodeRequest(query);
	// BasePagerObject bso = HsqlUtil.toPager(request);
	// bso.setSortdatafield("id");
	// bso.setSortorder("desc");
	// return voucherService.getAllVoucherByPage(bso);
	// }
	//
	//
	// @Override
	// public BaseModelList<Voucher> getAllVoucherByAvailablePage(String query,
	// int use) {
	// logger.info("begin getAllVoucherByAvailablePage");
	// String request = HsqlUtil.DecodeRequest(query);
	// BasePagerObject bso = HsqlUtil.toPager(request);
	// return voucherService.getAllVoucherByAvailablePage(bso, use);
	// }
	//
	// @Override
	// public BaseModelList<Voucher> getAllVoucherPageString(String query) {
	// logger.info("begin getAllVoucherPageString");
	// String request = HsqlUtil.DecodeRequest(query);
	// BasePagerObject bso = HsqlUtil.toPager(request);
	// return voucherService.getAllVoucherPageString(bso);
	// }
	//
	// @Override
	// public BaseModelList<Voucher> getAllVoucherPageNumber(String query) {
	// logger.info("begin getAllVoucherPageNumber");
	// String request = HsqlUtil.DecodeRequest(query);
	// BasePagerObject bso = HsqlUtil.toPager(request);
	// return voucherService.getAllVoucherPageNumber(bso);
	// }

	@Override
	public Boolean putVoucher(String dispatchType,String name, String startDate, String endDate, BigDecimal amount, String userId,String voucherType,Long num) {
		logger.info("begin putVoucher");
//		String request = HsqlUtil.DecodeRequest(query);
//		BasePagerObject bso = HsqlUtil.toPager(request);
//		List<Condition> list = bso.getCondition();
//		String[] value = new String[] {};
//		String[] userId = new String[] {};
//
//		for (Condition condition : list) {
//			if (condition.getKey().equals("value")) {
//				value = condition.getValue();
//			} else if (condition.getKey().equals("userId")) {
//				userId = condition.getValue();
//			}
//		}
		String[] splitId = userId.split(",");
		Boolean putVoucher = voucherService.putVoucher(dispatchType,name, startDate, endDate,  amount,  splitId,voucherType,num);
		logger.info("end putVoucher");
		return putVoucher;
	}

	@Override
	public Map<String, Object> getUserPage(BigDecimal amountmin, BigDecimal amountmax, String state,
			BigDecimal statemin, BigDecimal statemax, String datemin, String datemax, String user,String activitNumber) {
		logger.info("begin getUserPage");
		// String request = HsqlUtil.DecodeRequest(query);
		// request="{'createDate':['2016-09-13','2016-09-20'],'state':['notUse']}";
		// JSONObject jsonObj = new JSONObject(request);
		// BasePagerObject bso = HsqlUtil.toPager(request);
		Map<String, Object> list = voucherService.getUserPage(amountmin,amountmax, state,
				statemin,statemax, datemin, datemax,  user,activitNumber);
		logger.info("end getUserPage");
		return list;
	}

	@Override
	public BaseModelList<VoucherVo> getVoucherSupervise(String query) {
		logger.info("begin getVoucherSupervise");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<VoucherVo> list = voucherService.getVoucherSupervise(bso);
		logger.info("end getVoucherSupervise");
		return list;
	}

	@Override
	public BaseModelList<VoucherNameVo> getVouchreName(String query) {
		logger.info("begin getVouchreName");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<VoucherNameVo> list = voucherService.getVouchreName(bso);
		logger.info("end getVouchreName");
		return list;
	}

	@Override
	public Boolean voucherCheck(String name) {
		logger.info("begin voucherCheck");
//		String request = HsqlUtil.DecodeRequest(query);
//		BasePagerObject bso = HsqlUtil.toPager(request);
		Boolean check = voucherService.voucherCheck(name);
		logger.info("end voucherCheck");
		return check;
	}



}
