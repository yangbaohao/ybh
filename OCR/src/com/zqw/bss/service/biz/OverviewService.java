package com.zqw.bss.service.biz;

import java.util.List;
import java.util.Map;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.biz.OcrEnclosureOrder;
import com.zqw.bss.model.biz.OcrSaleOrder;
import com.zqw.bss.vo.biz.OrderSalesLogs;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.biz.SalesOrderLogVo;
import com.zqw.bss.vo.biz.WaitOrderListVo;

public interface OverviewService {
	//导出和总揽的查询
	BaseModelList<SalesOrderListVo> getSimpleSalesOrderVo(BasePagerObject bso, String string);
	
	Map<String, String> getUserName();

	BaseModelList<SalesOrderLogVo> searchLogInfo(BasePagerObject bso);

	List<WaitOrderListVo> waitOrder();



	OcrSaleOrder getOrder(Long id);
	
	BaseModelList<SalesOrderListVo> getSimpleSalesOrderVoList(BasePagerObject bso);
	


	List<OrderSalesLogs>  orderSalesLogsList(Long salesId);

	List<String> getEmployee();

	OcrEnclosureOrder kfRejectOrder(Long uuid);

	List<WaitOrderListVo> waitCheck();

	Map<String,List> searchLogFileInfo(BasePagerObject bso);

}
