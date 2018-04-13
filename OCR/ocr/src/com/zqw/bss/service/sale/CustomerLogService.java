package com.zqw.bss.service.sale;



import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.sale.CustomerLog;
import com.zqw.bss.model.sys.User;


public interface CustomerLogService {

	BaseModelList<CustomerLog> getCustomerLogByPage(BasePagerObject bso);

	Boolean saveCustomerLog(CustomerLog customerLog);

	Boolean delectCustomerLog(Long id);

	Boolean updateCustomerLog(CustomerLog customerLog);

	Boolean saveContentRemark(Remark remark, String type,Long id);

	Boolean updateContentRemark(Remark remark, String type);
	//根据手机号或者用户名查询该用户是属于哪一个客服的，如果是多个客服，就从多个中随机一个，返回 user（客服）
	/**
	 * 
	 * @param type phone 手机号 name用户名
	 * @param parameter
	 * @return
	 */
	User  queryUser(String type,String parameter);
	//.如果是陌生客服，就随机分配一个一个客服，返回user（客服)
	User randomUser();
	
	
}
