
package com.zqw.bss.service.fms.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.fms.PurchaseReceipt;
import com.zqw.bss.model.fms.Receipt;
import com.zqw.bss.model.fms.SalesReceipt;
import com.zqw.bss.service.fms.ReceiptService;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.fms.ReceiptListForVo;


@Service
@Qualifier("receiptService")
@SuppressWarnings({ "unchecked", "unused", "rawtypes" })
public class ReceiptServiceImpl implements ReceiptService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());


	
	protected DAO dao;

	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean createReceipt(Receipt receipt) {
		logger.info("begin createReceipt.");

		if (receipt instanceof SalesReceipt) {
			SalesReceipt receipts = (SalesReceipt) receipt;
			
			try{
//				receipts = preparesaveSalesReceipt(receipts);
//				if(favourites!=null){
//					favourites.setBizId(receipts.getId());
//					favourites.setAmount(receipts.getReceiptAmt());
//					favouritesService.saveFavourites(favourites);
//				}
				Object save = dao.save(receipts);
			}catch(Exception e){
				throw new OperationException("发票号码重复！");
			}
		}
		if (receipt instanceof PurchaseReceipt) {
			PurchaseReceipt receipts = (PurchaseReceipt) receipt;
			try{
				dao.save(receipts);
//				receipts = preparesavePurchaseReceipt(receipts);
//				if(favourites!=null){
//					favourites.setBizId(receipts.getId());
//					favourites.setAmount(receipts.getReceiptAmt());
//					favouritesService.saveFavourites(favourites);
//				}
			}catch(Exception e){
				throw new OperationException("发票号码重复！");
			}
		}
		logger.info("end createReceipt. id = [" + receipt.getId() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateReceipt(Receipt receipt) {
		logger.info("begin updateReceipt.");
//		List<Favourites> list = dao.find("from Favourites where favouritesType = 'Receipt' and bizId = "+receipt.getId());
//		Favourites favourites= null;
//		if(list.size()>0)
//			favourites = list.get(0);
//		this.deleteReceipt(receipt.getId());
//		dao.flush();
//		receipt.setId(null);
//		this.createReceipt(receipt,favourites);
		if (receipt instanceof SalesReceipt) {
			SalesReceipt receipts = (SalesReceipt) receipt;
			Object update = dao.update(receipts);
		}
		if (receipt instanceof PurchaseReceipt) {
			PurchaseReceipt receipts = (PurchaseReceipt) receipt;
			dao.update(receipts);
		}	
		logger.info("end updateReceipt.");
		return true;
	}

//	@Override
//	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
//	public Boolean createSalesReceipt(SalesReceipt receipt) {
//		logger.info("begin createSalesReceipt.");
//		Boolean res = saveSalesReceipt(receipt);
//		logger.info("end createSalesReceipt. id = [" + receipt.getId() + "]");
//		return res;
//	}
//
//	@Override
//	public Boolean createPurchaseReceipt(PurchaseReceipt receipt) {
//		logger.info("begin createPurchaseReceipt.");
//		Boolean res = savePurchaseReceipt(receipt);
//		logger.info("end createPurchaseReceipt. id = [" + receipt.getId() + "]");
//		return res;
//	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteReceipt(Long id) {
		logger.info("begin deletePurchaseReceipt. id = [" + id + "]");
//		Receipt receipt = this.getReceiptById(id);
//		if (receipt instanceof SalesReceipt) {
//			SalesReceipt salesReceipt = (SalesReceipt) receipt;
//			List<ReceiptSalesDeliveryOrderRelation> list = salesReceipt.getReceiptSalesDeliveryOrderRelations();
//			for (int i = 0; i < list.size(); i++) {
//				Long count = dao.executeHql("update SalesDeliveryOrder set receiptsAmt = (receiptsAmt -"
//						+ list.get(i).getUseAmt() + ")  where id =  " + list.get(i).getSalesDeliveryOrder().getId(),
//						null);
//			}
//		}
//		if (receipt instanceof PurchaseReceipt) {
//			PurchaseReceipt purchaseReceipt = (PurchaseReceipt) receipt;
//			List<ReceiptPurchaseDeliveryOrderRelation> list = purchaseReceipt
//					.getReceiptPurchaseDeliveryOrderRelations();
//			for (int i = 0; i < list.size(); i++) {
//				Long count = dao.executeHql("update PurchaseDeliveryOrder set receiptsAmt = (receiptsAmt -"
//						+ list.get(i).getUseAmt() + ")  where id =  " + list.get(i).getPurchaseDeliveryOrder().getId(),
//						null);
//			}
//		}
		dao.removeObject(Receipt.class, id);
//		List<Favourites> list = dao.find("from Favourites where favouritesType = 'Receipt' and bizId = "+id);
//		if(list!=null && list.size()>0){
//			dao.removeObject(list.get(0));
//		}
//		logger.info("end deletePurchaseReceipt.");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Receipt getReceiptById(Long id,Long ownerId) {
		logger.info("begin getPurchaseReceiptById. id = [" + id + "]");
		Receipt receipt = (Receipt) dao.getObject(Receipt.class, id);
		logger.info("end getPurchaseReceiptById.");
		if(!receipt.getOwnerId().equals(ownerId)){
			throw new OperationException("该对象不属于该用户，请联系管理员！");
		}
		return receipt;
	}


	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<ReceiptListForVo> searchReceiptListForVo(BasePagerObject bso,Long ownerId) {
		logger.info("begin searchReceiptListForVo.");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String countSql = "select count( DISTINCT receipt.id)"
				+ " from Receipt receipt, ClientInfo clientInfo,UserInfo userInfo"
				+ " where  userInfo.id =clientInfo.userInfo.id and receipt.clientId = clientInfo.id and receipt.ownerId = "
				+ ownerId + " " + conStr;
		Long countReceipt = dao.getCount4Paging(countSql);
		
		//合并查询发票数据
		String sql = "SELECT "
				+ "receipt.id, "
				+ "receipt.clientId, "
				+ "i. NAME, "
				+ "receipt.receiptNumber, "
				+ "receipt.entryDate, "
				+ "receipt.receiptAmt, "
				+ "receipt.receiptInvoiceType, "
				+ "receipt.receiptType, "
				+ "receipt.unuseAmt,"
				+ "receipt.lastUpdateDate as lastUpdateDate "
			+ "FROM "
				+ "t_fms_receipt receipt, "
				+ "t_crm_client_info clientInfo "
			+ "LEFT JOIN t_crm_user_info i ON clientInfo.userInfo_id = i.id "
			+ "WHERE "
				+ "receipt.clientId = clientInfo.id "
				+ "AND receipt.ownerId = "+ ownerId + " " + conStr;
		String dcmtype = "";
		for (int i = 0; i < bso.condition.size(); i++) {
			if (bso.condition.get(i).getKey().equals("receiptType")&&bso.condition.get(i).getValue()[0].equals("sales")) {
				dcmtype="sales";
			}
			if (bso.condition.get(i).getKey().equals("receiptType")&&bso.condition.get(i).getValue()[0].equals("purchase")) {
				dcmtype="purchase";
			}
		}
		for (int i = 0; i < bso.condition.size(); i++) {
			if (bso.condition.get(i).getKey().equals("receiptType")) {
				bso.condition.get(i).setValue(new String[]{});
			}
		}
		conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sqll =" UNION ALL  SELECT receipt.id,receipt.clientInfoId,i.name,receipt.receiptNumber,receipt.entryDate,"
				+ "receipt.receiptAmt,receipt.receiptInvoiceType,'salesdcm' receiptType"
				+ ", 0.00 unuseAmt, receipt.lastUpdateDate AS lastUpdateDate FROM t_crm_general_documents receipt, t_crm_client_info clientInfo "
				+ "LEFT JOIN  t_crm_user_info i   ON clientInfo.userInfo_id = i.id   WHERE receipt.clientInfoId = clientInfo.id "
				+ " and receipt.documentType='sales'  AND receipt.receiptInvoiceType IS NOT NULL and receipt.receiptNumber is not null and receipt.receiptNumber<>'' "
				+ "AND receipt.ownerId = "+ ownerId + " " + conStr;
//				+ " UNION ALL SELECT receipt.id,'公司内部收入',receipt.receiptNumber,receipt.entryDate,receipt.receiptAmt,receipt.receiptInvoiceType,'salesdcm' receiptType,"
//				+ "0.00 unuseAmt,receipt.lastUpdateDate AS lastUpdateDate FROM t_crm_general_documents receipt WHERE receipt.documentType='sales' "
//				+ "AND receipt.receiptInvoiceType IS NOT NULL AND receipt.receiptNumber IS NOT NULL AND receipt.clientInfoId IS NULL AND receipt.receiptNumber<>'' "
//				+ "AND receipt.ownerId = "+ownerId + " " +conStr ;
    
			String sqlll =	" UNION ALL  SELECT receipt.id,receipt.clientInfoId,i.name,receipt.receiptNumber,receipt.entryDate,"
				+ "receipt.receiptAmt,receipt.receiptInvoiceType,'purchasedcm' receiptType"
				+ ", 0.00 unuseAmt, receipt.lastUpdateDate AS lastUpdateDate FROM t_crm_general_documents receipt, t_crm_client_info clientInfo "
				+ "LEFT JOIN  t_crm_user_info i   ON clientInfo.userInfo_id = i.id   WHERE receipt.clientInfoId = clientInfo.id "
				+ " and receipt.documentType='purchase'	AND receipt.receiptInvoiceType IS NOT NULL and receipt.receiptNumber is not null and receipt.receiptNumber<>''"
				+ "AND receipt.ownerId = "+ ownerId + " " + conStr;
//				+ " UNION ALL SELECT receipt.id,'公司内部支出' ,receipt.receiptNumber,receipt.entryDate,receipt.receiptAmt,receipt.receiptInvoiceType,"
//				+ " 'purchasedcm' receiptType, 0.00 unuseAmt, receipt.lastUpdateDate AS lastUpdateDate FROM t_crm_general_documents receipt "
//				+ "WHERE receipt.documentType='purchase' AND receipt.receiptInvoiceType IS NOT NULL AND receipt.receiptNumber IS NOT NULL AND receipt.receiptNumber<>''"
//				+ " AND receipt.clientInfoId IS NULL AND receipt.ownerId = "+ownerId+" "+conStr;
		String allsql = sql+sqll+sqlll;
		if(dcmtype.equals("sales"))
			allsql = sql+sqll;
		if(dcmtype.equals("purchase"))
			allsql = sql+sqlll;
		List listRS = dao.getLst4PagingWithSQL(allsql+" order by lastUpdateDate desc ", new int[] {
				bso.getPagenum(),
				bso.getPagesize() });

		List<ReceiptListForVo> listVO = new ArrayList<ReceiptListForVo>();
		for (Object rsArray : listRS) {
			ReceiptListForVo vo = new ReceiptListForVo(
					(Object[]) rsArray);
			listVO.add(vo);
		}
		Long countgd=dao.getCount4PagingWithSQL("select count(receipt.id)  FROM t_crm_general_documents receipt, t_crm_client_info clientInfo "
				+ "LEFT JOIN  t_crm_user_info i   ON clientInfo.userInfo_id = i.id   WHERE receipt.clientInfoId = clientInfo.id "
				+ "	AND receipt.receiptInvoiceType IS NOT NULL and receipt.receiptNumber is not null and receipt.receiptNumber<>'' "
				+ "AND receipt.ownerId = "+ ownerId + " " + conStr);
		Long count = countReceipt+countgd;
		BaseModelList<ReceiptListForVo>  lists =  new BaseModelList<ReceiptListForVo>(count, WebUtil.getEntryListFromProxyList(listVO, dao));
		logger.info("end searchReceiptListForVo.");
		return lists;
	}

//	@Override
//	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
//	public BaseModelList<DeliveryOrderForListVO> getSalesReceipt(BasePagerObject bso) {
//		logger.info("begin getSalesReceipt.");
//		List<DeliveryOrderForListVO> deliveryOrder = new ArrayList<DeliveryOrderForListVO>();
//		BaseModelList<DeliveryOrderForListVO> deliveryOrderForListVO = deliveryOrderService
//				.getSalesDeliveryOrderForListVOByPage(bso);
//		for (DeliveryOrderForListVO dov : deliveryOrderForListVO.getRows()) {
//			if (dov.getDeliveryStatus().toString() != "delivered"
//					|| dov.getDeliveryStatus().toString() != "partialReturn"
//					|| dov.getDeliveryStatus().toString() != "allReturn") {
//				continue;
//			}
//			if (dov.getDeliverAmt() == null) {
//				continue;
//			}
//			// if (dov.getReceiptsAmt() != null) {
//			// if (dov.getDeliverAmt().compareTo(dov.getReceiptsAmt()) == 0) {
//			// continue;
//			// }
//			// }
//			deliveryOrder.add(dov);
//		}
//		Long count = (long) deliveryOrder.size();
//		return new BaseModelList<DeliveryOrderForListVO>(count, WebUtil.getEntryListFromProxyList(deliveryOrder, dao));
//	}
//
//	@Override
//	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
//	public BaseModelList<DeliveryOrderForListVO> getPurchaseReceipt(BasePagerObject bso) {
//		logger.info("begin getPurchaseReceipt.");
//		List<DeliveryOrderForListVO> deliveryOrder = new ArrayList<DeliveryOrderForListVO>();
//		BaseModelList<DeliveryOrderForListVO> deliveryOrderForListVO = deliveryOrderService
//				.getPurchaseDeliveryOrderForListVOByPage(bso);
//		for (DeliveryOrderForListVO dov : deliveryOrderForListVO.getRows()) {
//			if (dov.getDeliveryStatus().toString() != "received"
//					|| dov.getDeliveryStatus().toString() != "partialReturn"
//					|| dov.getDeliveryStatus().toString() != "allReturn") {
//				continue;
//			}
//			if (dov.getDeliverAmt() == null) {
//				continue;
//			}
//			// if (dov.getReceiptsAmt() != null) {
//			// if (dov.getDeliverAmt().compareTo(dov.getReceiptsAmt()) == 0) {
//			// continue;
//			// }
//			// }
//			deliveryOrder.add(dov);
//		}
//		Long count = (long) deliveryOrder.size();
//		return new BaseModelList<DeliveryOrderForListVO>(count, WebUtil.getEntryListFromProxyList(deliveryOrder, dao));
//	}
//
//	private Boolean saveSalesReceipt(SalesReceipt receipt) {
//		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
//		List<ReceiptSalesDeliveryOrderRelation> list = receipt.getReceiptSalesDeliveryOrderRelations();
//		Long id = 0l;
//		ReceiptSalesDeliveryOrderRelation rs = new ReceiptSalesDeliveryOrderRelation();
//		BigDecimal used = BigDecimal.ZERO;
//		SalesDeliveryOrder sdo = new SalesDeliveryOrder();
//		if (null == receipt.getId()) {
//			for (int i = 0; i < list.size(); i++) {
//				sdo = (SalesDeliveryOrder) dao.getObject(SalesDeliveryOrder.class,
//						list.get(i).getSalesDeliveryOrder().getId());
//				sdo.setReceiptsAmt(sdo.getReceiptsAmt().add(list.get(i).getUseAmt()));
//				dao.save(sdo);
//			}
//		} else {
//			Object[] obj = { receipt.getId() };
//			String sql1 = "select * from t_fms_receipt_order_relation where salesReceipt_id=?";
//			// ReceiptOrderRelation 的list
//			List<ReceiptSalesDeliveryOrderRelation> salesList = (List<ReceiptSalesDeliveryOrderRelation>) dao
//					.executeQuerySql(sql1, obj);
//			// String sql2="select receiptsAmt from t_sales_delivery_order where
//			// id=?";
//			for (int i = 0; i < salesList.size(); i++) {
//				// 获取要改的对象
//				sdo = (SalesDeliveryOrder) dao.getObject(SalesDeliveryOrder.class,
//						salesList.get(i).getSalesDeliveryOrder().getId());
//				// 减去创建时的useAmt 即初始累计金额
//				BigDecimal result = sdo.getReceiptsAmt().subtract(salesList.get(i).getUseAmt());
//				updateSalesReceiptAmt(salesList.get(i).getSalesDeliveryOrder().getId(), result);
//				sdo = salesList.get(i).getSalesDeliveryOrder();
//				for (int j = 0; i > list.size(); i++) {
//					if (list.get(j).getSalesDeliveryOrder().getId().equals(salesList.get(i).getId())) {
//						sdo.setReceiptsAmt(result.add(list.get(j).getUseAmt()));
//						dao.save(sdo);
//					}
//				}
//			}
//		}
//		SalesReceipt res = new SalesReceipt();
//		if (used.compareTo(receipt.getReceiptAmt()) <= 0) {
//			receipt.setOwnerId(ownerId);
//			receipt.setUnuseAmt(receipt.getReceiptAmt().subtract(used));
//			SalesDeliveryOrder sdo1;
//			for (int i = 0; i < list.size(); i++) {
//				used.add(list.get(i).getUseAmt());
//				// id = receipt.getId();
//				id = receipt.getReceiptSalesDeliveryOrderRelations().get(i).getSalesDeliveryOrder().getId();
//				sdo1 = (SalesDeliveryOrder) dao.getObject(SalesDeliveryOrder.class, id);
//				Object[] obj = { (Long) id };
//				String hql = "select count(useAmt) from t_fms_receipt_order_relation where salesDeliveryOrder_id=? ";
//				List<BigDecimal> useAmt = (List<BigDecimal>) dao.executeQuerySql(hql, obj);
//				SalesOrderInvoice sod = (SalesOrderInvoice) dao.getObject(SalesOrderInvoice.class,
//						sdo1.getSalesOrderInvoice().getId());
//				if ((new BigDecimal(String.valueOf(useAmt.get(0)))
//						.add(receipt.getReceiptSalesDeliveryOrderRelations().get(i).getUseAmt()))
//								.compareTo(sod.getAmt()) > 0) {
//					throw new OperationException(
//							"编号为" + list.get(i).getSalesDeliveryOrder().getOrderNumber() + "的订单开出的发票总金额超过订单金额！");
//				}
//				rs.setOwnerId(ownerId);
//				rs.setSalesReceipt(res);
//				rs.setSalesDeliveryOrder(list.get(i).getSalesDeliveryOrder());
//				rs.setUseAmt(list.get(i).getUseAmt());
//				// dao.save(rs);
//				res = (SalesReceipt) dao.save(receipt);
//			}
//		} else {
//			throw new OperationException("销售单发票总金额大于发票单总金额！");
//		}
//		return true;
//	}
//
//	private Boolean savePurchaseReceipt(PurchaseReceipt receipt) {
//		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
//		List<ReceiptPurchaseDeliveryOrderRelation> list = receipt.getReceiptPurchaseDeliveryOrderRelations();
//
//		Long id = 0l;
//		ReceiptPurchaseDeliveryOrderRelation rs = new ReceiptPurchaseDeliveryOrderRelation();
//		BigDecimal used = BigDecimal.ZERO;
//		for (int i = 0; i < list.size(); i++) {
//			used.add(list.get(i).getUseAmt());
//			// id = receipt.getId();
//			id = receipt.getReceiptPurchaseDeliveryOrderRelations().get(i).getPurchaseDeliveryOrder().getId();
//			Object[] obj = { (Long) id };
//			String hql = "select count(useAmt) from ReceiptOrderRelation where salesDeliveryOrder.id=? ";
//			List<BigDecimal> useAmt = (List<BigDecimal>) dao.executeQuerySql(hql, obj);
//			String hql1 = "select receiptsAmt from SalesDeliveryOrder where id=?";
//			List<BigDecimal> totalAmt = (List<BigDecimal>) dao.executeQuerySql(hql1, obj);
//			if (new BigDecimal(String.valueOf(useAmt.get(0)))
//					.add(receipt.getReceiptPurchaseDeliveryOrderRelations().get(i).getUseAmt())
//					.compareTo(totalAmt.get(0)) > 0) {
//				throw new OperationException(
//						"编号为" + list.get(i).getPurchaseDeliveryOrder().getOrderNumber() + "的订单开出的发票总金额超过订单金额！");
//			}
//			rs.setOwnerId(ownerId);
//			rs.setPurchaseReceipt(receipt);
//			rs.setPurchaseDeliveryOrder(list.get(i).getPurchaseDeliveryOrder());
//			dao.save(rs);
//		}
//
//		PurchaseReceipt res = new PurchaseReceipt();
//		if (used.compareTo(receipt.getReceiptAmt()) <= 0) {
//			receipt.setOwnerId(ownerId);
//			receipt.setUnuseAmt(receipt.getReceiptAmt().subtract(used));
//			res = (PurchaseReceipt) dao.save(receipt);
//			List<ReceiptPurchaseDeliveryOrderRelation> list1 = receipt.getReceiptPurchaseDeliveryOrderRelations();
//			for (int i = 0; i < list1.size(); i++) {
//				list1.get(i).setOwnerId(ownerId);
//				list1.get(i).setPurchaseReceipt(res);
//				dao.save(list1.get(i));
//			}
//		} else {
//			throw new OperationException("销售单发票总金额大于发票单总金额！");
//		}
//		return true;
//	}
//
//	private Boolean updateSalesReceiptAmt(Long id, BigDecimal amt) {
//		// id为deliverid
//		Object[] obj = { amt, id };
//		String hql = "update SalesDeliveryOrder set receiptsAmt=? where id= ?";
//		// dao.updateOrRemoveNativeSql(hql,obj)
//		return true;
//	}
//
//	private Boolean updatePurchaseReceiptAmt(Long id) {
//		return true;
//	}
//
//	private PurchaseReceipt preparesavePurchaseReceipt(PurchaseReceipt receipts) {
//		List<ReceiptPurchaseDeliveryOrderRelation> list = receipts.getReceiptPurchaseDeliveryOrderRelations();
//		BigDecimal unUseAmt = BigDecimal.ZERO;
//		for (int i = 0; i < list.size(); i++) {
//			unUseAmt = unUseAmt.add(list.get(i).getUseAmt());
//			PurchaseDeliveryOrder sdo = (PurchaseDeliveryOrder) dao.getObject(PurchaseDeliveryOrder.class,
//					list.get(i).getPurchaseDeliveryOrder().getId());
//			if ((sdo.getPurchaseOrderInvoice().getAmt())
//					.compareTo(list.get(i).getUseAmt()) < 0) {
//				throw new OperationException("发票金额大于收货单金额，不能创建发票");
//			}
//		}
//		if (receipts.getReceiptAmt().compareTo(unUseAmt) < 0) {
//			throw new OperationException("发票本次收票金额大于发票总金额，不能创建发票");
//		}
//		receipts.setUnuseAmt(receipts.getReceiptAmt().subtract(unUseAmt));
//		receipts = (PurchaseReceipt) dao.save(receipts);
//
//		for (int i = 0; i < list.size(); i++) {
//			list.get(i).setPurchaseReceipt(receipts);
//			Long count = dao.executeHql("update PurchaseDeliveryOrder set receiptsAmt = receiptsAmt + "
//					+ list.get(i).getUseAmt() + "  where id =  " + list.get(i).getPurchaseDeliveryOrder().getId(),
//					null);
//			dao.save(list.get(i));
//		}
//		return receipts;
//	}
//
//	private SalesReceipt preparesaveSalesReceipt(SalesReceipt receipts) {
//		List<ReceiptSalesDeliveryOrderRelation> list = receipts.getReceiptSalesDeliveryOrderRelations();
//		BigDecimal unUseAmt = BigDecimal.ZERO;
//		for (int i = 0; i < list.size(); i++) {
//			unUseAmt = unUseAmt.add(list.get(i).getUseAmt());
//			SalesDeliveryOrder sdo = (SalesDeliveryOrder) dao.getObject(SalesDeliveryOrder.class,
//					list.get(i).getSalesDeliveryOrder().getId());
//			if ((sdo.getSalesOrderInvoice().getAmt())
//					.compareTo(list.get(i).getUseAmt()) < 0) {
//				throw new OperationException("发票金额大于收货单金额，不能创建发票");
//			}
//		}
//		if (receipts.getReceiptAmt().compareTo(unUseAmt) < 0) {
//			throw new OperationException("发票本次开票金额大于发票总金额，不能创建发票");
//		}
//		receipts.setUnuseAmt(receipts.getReceiptAmt().subtract(unUseAmt));
//		receipts = (SalesReceipt) dao.save(receipts);
//		for (int i = 0; i < list.size(); i++) {
//			list.get(i).setSalesReceipt(receipts);
//			Long count = dao.executeHql("update SalesDeliveryOrder set receiptsAmt = receiptsAmt +"
//					+ list.get(i).getUseAmt() + "  where id = " + list.get(i).getSalesDeliveryOrder().getId(), null);
//			dao.save(list.get(i));
//		}
//		return receipts;
//	}
//
//	@Override
//	public BaseModelList<DeliveryOrderForListVO> getSalesReceiptupdate(Long id, BasePagerObject bso) {
//		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
//
//		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
//		String sql = "select new com.zqw.account.vo.biz.DeliveryOrderForListVO(salesDeliveryOrder.orderNumber,salesDeliveryOrder.deliverTime, "
//				+ " salesOrder.orderNumber, clientInfo.userInfo.name," + " salesDeliveryOrder.deliveryStatus,"
//				+ " salesDeliveryOrder.deliveryAddress,"
//				+ " salesDeliveryOrder.id, clientInfo.id, salesOrder.id,salesDeliveryOrder.receipts,salesDeliveryOrder.receiptsAmt,salesDeliveryOrder.salesOrderInvoice.amt,salesDeliveryOrder.deliverOrderTime )";
//		String fromStr = " from SalesDeliveryOrder salesDeliveryOrder,ClientInfo clientInfo,  SalesOrder salesOrder "
//				+ " where  salesDeliveryOrder.salesOrderId = salesOrder.id "
//				+ " and clientInfo.id = salesOrder.clientInfo.id " + " and salesDeliveryOrder.ownerId = " + ownerId
//				+ "  and (salesDeliveryOrder.deliveryStatus = 'delivered' or salesDeliveryOrder.deliveryStatus = 'partialReturn' or salesDeliveryOrder.deliveryStatus = 'allReturn') and salesDeliveryOrder.salesOrderInvoice.id is not null  "
//				+ conStr;
//		String qp = "  and salesDeliveryOrder.receiptsAmt< salesDeliveryOrder.salesOrderInvoice.amt";
//
//		String fromStrone = fromStr + qp;
//		SalesReceipt  sales = (SalesReceipt) dao.getObject(SalesReceipt.class, id);
////		if (update.equals("update")) {
////			fromStrone = fromStr;
////		}
//		List<DeliveryOrderForListVO> list = dao.getLst4Paging(sql + fromStrone,
//				new int[] { bso.getPagenum(), bso.getPagesize() });
//		List<DeliveryOrderForListVO> listdelivers = new ArrayList<DeliveryOrderForListVO>();
//		Boolean oid = true;
//		if(sales!=null){
//			for(ReceiptSalesDeliveryOrderRelation rsdo : sales.getReceiptSalesDeliveryOrderRelations()){
//				for(DeliveryOrderForListVO vo:list){
//					if(vo.getDeliveryOrderId().equals(rsdo.getSalesDeliveryOrder().getId())){
//						oid = false;
//					}
//				}
//				if(oid==true){
//					List<DeliveryOrderForListVO> listdeliver=dao.find(sql + fromStr+" and salesDeliveryOrder.id="+rsdo.getSalesDeliveryOrder().getId());
//					listdelivers.addAll(listdeliver);
//				}
//			}
//		}
//		String countSql = "select count(distinct salesDeliveryOrder.orderNumber) " + fromStrone;
//		Long count = dao.getCount4Paging(countSql)+listdelivers.size();
//		listdelivers.addAll(list);
//		BaseModelList<DeliveryOrderForListVO> lists = new BaseModelList<DeliveryOrderForListVO>(count,
//				WebUtil.getEntryListFromProxyList(listdelivers, dao));
//		logger.info("end  getSalesDeliveryOrderForListVOByPage:[ id =" + WebUtil.getLogBasicString() + "]");
//		return lists;
//	}
//
//	@Override
//	public BaseModelList<DeliveryOrderForListVO> getPurchaseReceiptupdate(Long id, BasePagerObject bso) {
//		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
//		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
//
//		String sql = "select new com.zqw.account.vo.biz.DeliveryOrderForListVO(purchaseDeliveryOrder.orderNumber,purchaseDeliveryOrder.deliverTime, "
//				+ " purchaseOrder.orderNumber, clientInfo.userInfo.name, purchaseDeliveryOrder.deliveryStatus,"
//				+ " purchaseDeliveryOrder.deliveryAddress,"
//				+ " purchaseDeliveryOrder.id, clientInfo.id, purchaseOrder.id,purchaseDeliveryOrder.receipts,purchaseDeliveryOrder.receiptsAmt,purchaseDeliveryOrder.purchaseOrderInvoice.amt,purchaseDeliveryOrder.deliverOrderTime )";
//
//		String fromStr = " from PurchaseDeliveryOrder purchaseDeliveryOrder,ClientInfo clientInfo, PurchaseOrder purchaseOrder "
//				+ " where purchaseDeliveryOrder.purchaseOrderId = purchaseOrder.id "
//				+ " and clientInfo.id = purchaseOrder.clientInfo.id " + " and purchaseDeliveryOrder.ownerId = "
//				+ ownerId
//
//				+ " and (purchaseDeliveryOrder.deliveryStatus = 'received' or purchaseDeliveryOrder.deliveryStatus = 'partialReturn' or purchaseDeliveryOrder.deliveryStatus = 'allReturn')  and purchaseDeliveryOrder.purchaseOrderInvoice.id is not  null  "
//				+ conStr;
//		String qp = "  and purchaseDeliveryOrder.receiptsAmt< purchaseDeliveryOrder.purchaseOrderInvoice.amt";
//
//		String fromStrone = fromStr + qp;
////		if (update.equals("update")) {
////			fromStrone = fromStr;
////		}
//		PurchaseReceipt purchase = (PurchaseReceipt) dao.getObject(PurchaseReceipt.class, id);
//		List<DeliveryOrderForListVO> list = dao.getLst4Paging(sql + fromStrone,
//				new int[] { bso.getPagenum(), bso.getPagesize() });
//		List<DeliveryOrderForListVO> listdelivers = new ArrayList<DeliveryOrderForListVO>();
//		Boolean oid = true;
//		if(purchase!=null){
//			for(ReceiptPurchaseDeliveryOrderRelation rsdo : purchase.getReceiptPurchaseDeliveryOrderRelations()){
//				for(DeliveryOrderForListVO vo:list){
//					if(vo.getDeliveryOrderId().equals(rsdo.getPurchaseDeliveryOrder().getId())){
//						oid = false;
//					}
//				}
//				if(oid==true){
//					List<DeliveryOrderForListVO> listdeliver=dao.find(sql + fromStr+" and purchaseDeliveryOrder.id="+rsdo.getPurchaseDeliveryOrder().getId());
//					listdelivers.addAll(listdeliver);
//				}
//			}
//		}
//		
//		String countSql = "select count(distinct purchaseDeliveryOrder.orderNumber) " + fromStrone;
//		Long count = dao.getCount4Paging(countSql)+listdelivers.size();
//		listdelivers.addAll(list);
//		BaseModelList<DeliveryOrderForListVO> lists = new BaseModelList<DeliveryOrderForListVO>(count,
//				WebUtil.getEntryListFromProxyList(listdelivers, dao));
//		logger.info("end  getSalesReceiptupdate:[ id =" + WebUtil.getLogBasicString() + "]");
//		return lists;
//	}
//
//	@Override
//	public Map<String, BigDecimal> getPurchaseTotalAmtByClientName(Long clientId) {
//
//		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
//		String sql = "select new com.zqw.account.vo.biz.DeliveryOrderForListVO("
//				+ "purchaseDeliveryOrder.purchaseOrderInvoice.amt,purchaseDeliveryOrder.receiptsAmt,(purchaseDeliveryOrder.purchaseOrderInvoice.amt-purchaseDeliveryOrder.receiptsAmt) AS unreceiptAmt)";
//
//		String fromStr = " from PurchaseDeliveryOrder purchaseDeliveryOrder,ClientInfo clientInfo, PurchaseOrder purchaseOrder "
//				+ " where  purchaseDeliveryOrder.purchaseOrderId = purchaseOrder.id "
//				+ " and clientInfo.id = purchaseOrder.clientInfo.id " + " and purchaseDeliveryOrder.ownerId = "
//				+ ownerId + " and clientInfo.id = " + clientId
//				+ "  and (purchaseDeliveryOrder.deliveryStatus = 'received' or purchaseDeliveryOrder.deliveryStatus = 'partialReturn' or purchaseDeliveryOrder.deliveryStatus = 'allReturn') and purchaseDeliveryOrder.purchaseOrderInvoice.id is not null  ";
//		List<DeliveryOrderForListVO> list = new ArrayList<DeliveryOrderForListVO>();
//		try {
//			list = dao.find(sql + fromStr);
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//
//		BigDecimal receiptsAmt = BigDecimal.ZERO;
//		BigDecimal deliveryAmt = BigDecimal.ZERO;
//		BigDecimal unreceiptAmt = BigDecimal.ZERO;
//		for (DeliveryOrderForListVO vo : list) {
//			receiptsAmt = receiptsAmt.add(vo.getReceiptsAmt());
//			deliveryAmt = deliveryAmt.add(vo.getDeliverAmt());
//			unreceiptAmt = unreceiptAmt.add(vo.getUnreceiptAmt());
//		}
//		Map<String, BigDecimal> map = new HashMap<String, BigDecimal>();
//		map.put("receiptsAmt", receiptsAmt);
//		map.put("deliveryAmt", deliveryAmt);
//		map.put("unreceiptAmt", unreceiptAmt);
//		logger.info("end  getPurchaseTotalAmtByClientName:[ id =" + WebUtil.getLogBasicString() + "]");
//		return map;
//	}
//
//	@Override
//	public Map<String, BigDecimal> getSalesTotalAmtByClientName(Long clientId) {
//		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
//		String sql = "select new com.zqw.account.vo.biz.DeliveryOrderForListVO("
//				+ "salesDeliveryOrder.salesOrderInvoice.amt,salesDeliveryOrder.receiptsAmt,(salesDeliveryOrder.salesOrderInvoice.amt-salesDeliveryOrder.receiptsAmt) AS unreceiptAmt)";
//
//		String fromStr = " from SalesDeliveryOrder salesDeliveryOrder,ClientInfo clientInfo,  SalesOrder salesOrder "
//				+ " where  salesDeliveryOrder.salesOrderId = salesOrder.id "
//				+ " and clientInfo.id = salesOrder.clientInfo.id " + " and salesDeliveryOrder.ownerId = " + ownerId
//				+ " and clientInfo.id = " + clientId
//				+ "  and (salesDeliveryOrder.deliveryStatus = 'delivered' or salesDeliveryOrder.deliveryStatus = 'partialReturn' or salesDeliveryOrder.deliveryStatus = 'allReturn') and salesDeliveryOrder.salesOrderInvoice.id is not null  ";
//		List<DeliveryOrderForListVO> list = dao.find(sql + fromStr);
//		BigDecimal receiptsAmt = BigDecimal.ZERO;
//		BigDecimal deliveryAmt = BigDecimal.ZERO;
//		BigDecimal unreceiptAmt = BigDecimal.ZERO;
//		for (DeliveryOrderForListVO vo : list) {
//			receiptsAmt = receiptsAmt.add(vo.getReceiptsAmt());
//			deliveryAmt = deliveryAmt.add(vo.getDeliverAmt());
//			unreceiptAmt = unreceiptAmt.add(vo.getUnreceiptAmt());
//		}
//		Map<String, BigDecimal> map = new HashMap<String, BigDecimal>();
//		map.put("receiptsAmt", receiptsAmt);
//		map.put("deliveryAmt", deliveryAmt);
//		map.put("unreceiptAmt", unreceiptAmt);
//		logger.info("end  getSalesTotalAmtByClientName:[ id =" + WebUtil.getLogBasicString() + "]");
//		return map;
//	}
//
//	@Override
//	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
//	public List searchReceiptList() {
//		logger.info("begin searchReceiptListForVo.");
//		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
//		String sql = "select new com.zqw.account.vo.fms.ReceiptListForVo(receipt.id,receipt.clientId,clientInfo.userInfo.name,"
//				+ "receipt.receiptNumber,receipt.entryDate,receipt.receiptAmt,receipt.unuseAmt,receipt.receiptInvoiceType,receipt.class) "
//				+ " from Receipt receipt, ClientInfo clientInfo "
//				+ " where receipt.clientId = clientInfo.id and receipt.ownerId = " + ownerId;
//		String sqlReim = "select new com.zqw.account.vo.fms.ReceiptReimbursementVo(receipt.id,receipt.name,"
//				+ "receipt.receiptInvoiceType,receipt.receiptNumber,receipt.entryDate,receipt.receiptAmt,receipt.receiptType) "
//				+ " from Reimbursement receipt "
//				+ " where  (bizStatus = 'normal' or bizStatus = 'close' ) and receipt.receiptNumber is not null and receipt.ownerId = "
//				+ ownerId;
//		String sqlEx = "select new com.zqw.account.vo.fms.ReceiptReimbursementVo(receipt.name,"
//				+ "receipt.receiptInvoiceType,receipt.receiptNumber,receipt.entryDate,receipt.receiptAmt,receipt.receiptType,receipt.id) "
//				+ " from ExpensePayment receipt "
//				+ " where (bizStatus = 'normal' or bizStatus = 'close' ) and receipt.receiptInvoiceType is not null  and receipt.ownerId = "
//				+ ownerId;
//		String sqlFeeIncome = "select new com.zqw.account.vo.fms.ReceiptFeeIncomeVo(receipt.id,receipt.name,"
//				+ "receipt.receiptInvoiceType,receipt.receiptNumber,receipt.entryDate,receipt.receiptAmt,receipt.receiptType) "
//				+ " from FeeIncome receipt  " + " where (bizStatus = 'normal' or bizStatus = 'close' ) and receipt.receiptNumber is not null  and  receipt.ownerId = "
//				+ ownerId;
//		List<ReceiptListForVo> listReceipt = dao.find(sql);
//		List<ReceiptReimbursementVo> listReim = dao.find(sqlReim);
//		List<ReceiptReimbursementVo> listEx = dao.find(sqlEx);
//		listReim.addAll(listEx);
//		List<ReceiptFeeIncomeVo> listFeeIncome = dao.find(sqlFeeIncome);
//		for (ReceiptReimbursementVo rfo : listReim) {
//			ReceiptListForVo vo = new ReceiptListForVo();
//			vo.setReceiptNumber(rfo.getReceiptNumber());
//			if (rfo.getExpensePaymentid() != null) {
//				vo.setReceiptid(rfo.getExpensePaymentid());
//			}
//			if (rfo.getReimbursementid() != null) {
//				vo.setReceiptid(rfo.getReimbursementid());
//			}
//			listReceipt.add(vo);
//		}
//		for (ReceiptFeeIncomeVo rfo : listFeeIncome) {
//			ReceiptListForVo vo = new ReceiptListForVo();
//			vo.setReceiptNumber(rfo.getReceiptNumber());
//			vo.setReceiptid(rfo.getReceiptid());
//			listReceipt.add(vo);
//		}
//		logger.info("end searchReceiptListForVo.");
//		return listReceipt;
//
//	}

}
