package com.zqw.bss.service.remote.fms.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.fms.Receipt;
import com.zqw.bss.service.fms.ReceiptService;
import com.zqw.bss.service.remote.fms.RemoteReceiptService;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.fms.ReceiptListForVo;

public class RemoteReceiptServiceImpl implements RemoteReceiptService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Autowired
	protected ReceiptService receiptService;

	@Override
	public Boolean createReceipt(Receipt receipt) {
		logger.info("begin createReceipt.");

//		List<ReceiptListForVo> list =receiptService.searchReceiptList();
//		for(ReceiptListForVo rp : list){
//			if(receipt.getReceiptNumber()!=null&&rp.getReceiptNumber()!=null){
//				if(rp.getReceiptNumber().equals(receipt.getReceiptNumber())){
//					throw new OperationException("发票号码重复，请重新填写");
//				}
//			}
//		}
		return receiptService.createReceipt(receipt);
	}

	@Override
	public Boolean updateReceipt(Receipt receipt) {
		logger.info("begin updateReceipt.");

//		List<ReceiptListForVo> list =receiptService.searchReceiptList();
//		for(ReceiptListForVo rp : list){
//			if(receipt.getReceiptNumber()!=null&&rp.getReceiptNumber()!=null){
//				if(rp.getReceiptNumber().equals(receipt.getReceiptNumber())&&rp.getReceiptid()!=receipt.getId()){
//					throw new OperationException("发票号码重复，请重新填写");
//				}
//			}
//		}
//		Receipt rt = (Receipt)dao.getObject(Receipt.class, receipt.getId(), LockMode.UPGRADE_NOWAIT);
//		WebUtil.verifyOjbectOwnerId(rt, dao);
		return receiptService.updateReceipt(receipt);
	}
	// @Override
	// public Boolean createSalesReceipt(SalesReceipt receipt) {
	// logger.info("begin createReceipt.");
	// Boolean flag = receiptService.createSalesReceipt(receipt);
	// logger.info("end createReceipt.");
	// return flag;
	// }
	//
	// @Override
	// public Boolean createPurchaseReceipt(PurchaseReceipt receipt) {
	// logger.info("begin createReceipt.");
	// Boolean flag = receiptService.createPurchaseReceipt(receipt);
	// logger.info("end createReceipt.");
	// return flag;
	// }

	@Override
	public Boolean delReceipt(Long id) {
		logger.info("begin delPurchaseReceipt.");

//		Receipt rt = (Receipt)dao.getObject(Receipt.class,id, LockMode.UPGRADE_NOWAIT);
//		WebUtil.verifyOjbectOwnerId(rt, dao);
		return receiptService.deleteReceipt(id);
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Receipt getReceiptById(Long id,Long ownerId) {
		logger.info("begin getPurchaseReceiptById.");

		Receipt receipt = receiptService.getReceiptById(id,ownerId);
//		WebUtil.verifyOjbectOwnerId(receipt, dao);
//		if (receipt instanceof SalesReceipt) {
//			SalesReceipt salesReceipt = (SalesReceipt) receipt;
////			for (ReceiptSalesDeliveryOrderRelation rso : salesReceipt.getReceiptSalesDeliveryOrderRelations()) {
////				rso.setSalesReceipt(null);
////			}
//			receiptService
//		}
//		if (receipt instanceof PurchaseReceipt) {
////			PurchaseReceipt purchaseReceipt = (PurchaseReceipt) receipt;
////			for (ReceiptPurchaseDeliveryOrderRelation rpd : purchaseReceipt
////					.getReceiptPurchaseDeliveryOrderRelations()) {
////				rpd.setPurchaseReceipt(null);
////			}
//		}
		return (Receipt) WebUtil.getEntryFromProxyObj(receipt);
	}

	@Override
	public BaseModelList<ReceiptListForVo> searchReceiptListForVo(String query,Long ownerId) {

		logger.info("begin searchReceiptListForVo.");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		logger.info("end searchReceiptListForVo.");
		return receiptService.searchReceiptListForVo(bso,ownerId);
	}

//	@Override
//	public BaseModelList<DeliveryOrderForListVO> getSalesReceipt(String query) {
//		SecurityUtils.getSubject().checkPermission("fms:receipt:view");
//		String request = HsqlUtil.DecodeRequest(query);
//		BasePagerObject bso = HsqlUtil.toPager(request);
//		logger.info("begin getSalesReceipt.");
//		BaseModelList<DeliveryOrderForListVO> list = receiptService.getSalesReceipt(bso);
//		logger.info("end  getSalesReceipt:[ id =" + WebUtil.getLogBasicString() + "]");
//		return list;
//	}

//	@Override
//	public BaseModelList<DeliveryOrderForListVO> getPurchaseReceipt(String query) {
//		SecurityUtils.getSubject().checkPermission("fms:receipt:view");
//		String request = HsqlUtil.DecodeRequest(query);
//		BasePagerObject bso = HsqlUtil.toPager(request);
//		logger.info("begin getPurchaseReceipt.");
//		BaseModelList<DeliveryOrderForListVO> list = receiptService.getPurchaseReceipt(bso);
//		logger.info("end  getPurchaseReceipt:[ id =" + WebUtil.getLogBasicString() + "]");
//		return list;
//	}

//	@Override
//	public BaseModelList<DeliveryOrderForListVO> getPurchaseReceiptupdate(Long id,String query) {
//		SecurityUtils.getSubject().checkPermission("fms:receipt:view");
//		// TODO Auto-generated method stub
//		String request = HsqlUtil.DecodeRequest(query);
//		BasePagerObject bso = HsqlUtil.toPager(request);
//		return receiptService.getPurchaseReceiptupdate(id,bso);
//	}
//
//	@Override
//	public BaseModelList<DeliveryOrderForListVO> getSalesReceiptupdate(Long id,String query) {
//		SecurityUtils.getSubject().checkPermission("fms:receipt:view");
//		// TODO Auto-generated method stub
//		String request = HsqlUtil.DecodeRequest(query);
//		BasePagerObject bso = HsqlUtil.toPager(request);
//		return receiptService.getSalesReceiptupdate(id,bso);
//	}
//
//	@Override
//	public Map<String, BigDecimal> getPuechaseTotalAmtByClientName(Long clientId) {
//		// TODO Auto-generated method stub
//		return receiptService.getPurchaseTotalAmtByClientName(clientId);
//	}
//
//	@Override
//	public Map<String, BigDecimal> getSalesTotalAmtByClientName(Long clientId) {
//		// TODO Auto-generated method stub
//		return receiptService.getSalesTotalAmtByClientName(clientId);
//	}

}
