package com.zqw.bss.service.fms;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.fms.Receipt;
import com.zqw.bss.vo.fms.ReceiptListForVo;

public interface ReceiptService {
	
	/**
	 * 创建发票
	 * @param receipt
	 * @return
	 */
	public Boolean createReceipt(Receipt receipt);
	
	/**
	 * 修改发票
	 * @param receipt
	 * @return
	 */
	public Boolean updateReceipt(Receipt receipt);

//	/**
//	 * 获取开票的发票
//	 * @param 
//	 * @return 发票 对象List
//	 */
//	public BaseModelList<DeliveryOrderForListVO> getSalesReceipt(BasePagerObject bso);
//	/**
//	 * 获取收票的发票
//	 * @param 
//	 * @return 发票 对象List
//	 */
//	public BaseModelList<DeliveryOrderForListVO> getPurchaseReceipt(BasePagerObject bso);
//	/**
//	 * 获取开票的发票
//	 * @param 
//	 * @return 发票 对象List
//	 */
//	public BaseModelList<DeliveryOrderForListVO> getSalesReceiptupdate(Long id,BasePagerObject bso);
//	/**
//	 * 获取收票的发票
//	 * @param 
//	 * @return 发票 对象List
//	 */
//	public BaseModelList<DeliveryOrderForListVO> getPurchaseReceiptupdate(Long id,BasePagerObject bso);
//	/**
//	 * 创建发票
//	 * @param 发票 对象
//	 * @return 发票 对象
//	 */
//	public Boolean createSalesReceipt(SalesReceipt receipt); 
//	
//	/**
//	 * @param receipt
//	 * @return
//	 */
//	public Boolean createPurchaseReceipt(PurchaseReceipt receipt); 
	
//	/**
//	 * 修改发票
//	 * @param 发票 对象
//	 * @return Boolean
//	 */
////	public SalesReceipt updateSalesReceipt(SalesReceipt receipt);
//	
//	/**
//	 * 修改发票
//	 * @param 发票对象
//	 * @return Boolean
//	 */
////	public PurchaseReceipt updatePurchaseReceipt(PurchaseReceipt receipt);
	
	/**
	 * 删除发票
	 * @param id
	 * @return  Boolean
	 */
	public Boolean deleteReceipt(Long id);
	
	/**
	 * 通过id查询 发票 对象
	 * @param id
	 * @return 发票 对象
	 */
	public Receipt getReceiptById(Long id,Long ownerId);

	public BaseModelList<ReceiptListForVo> searchReceiptListForVo(BasePagerObject bso,Long ownerId); 
	
//	/**
//	 * 分页查询发票列表Vo
//	 * @param 发票查询条件(分页查询条件json固定格式)
//	 * @return  发票列表Vo
//	 */
//	public BaseModelList searchReceiptListForVo(BasePagerObject bso);
//	
//	Map<String, BigDecimal> getPurchaseTotalAmtByClientName(Long clientName) ;
//	
//	Map<String, BigDecimal> getSalesTotalAmtByClientName(Long clientName) ;
//	
//	public List searchReceiptList();
}
