package com.zqw.bss.service.sale;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.model.sale.MessageLog;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;

public interface ShortMessageService {

	/**
	 * 添加短信记录
	 * @param sales  销售
	 * @param ShortMessage 短信
	 * @return
	 */
	public Boolean saveShortMessage(ShortMessage ShortMessage);
	
	/**
	 * 修改短信记录
	 * @param sales 销售
	 * @param ShortMessage 短信
	 * @return
	 */
	public Boolean updateShortMessage(ShortMessage ShortMessage);
	
	/**
	 * 删除短信记录
	 * @param id 主键id
	 * @return
	 */
	public Boolean deleteShortMessage(Long id);

	/**
	 * 分页短信记录
	 * @param bso
	 * @return
	 */
	public BaseModelList<ShortMessage> getPageShortMessage(BasePagerObject bso);
	
	/**
	 * id获取短信记录
	 * @param id
	 * @return
	 */
	public ShortMessage getShortMessageById(Long id);
	
	/**
	 * 发送短信 
	 * @param id 短信id
	 * @param num 数量
	 */
	public Boolean senderMessage(Long id,String num);

	/**
	 *	发送短信记录 
	 */
	public BaseModelList<MessageLog> getCustomersPageShortMessage(Long id, BasePagerObject bso);

	/**
	 * 未发送短信的批次
	 */
	public BaseModelList<ImportLog> getCustomersPageShortMessageNoSend(Long id, BasePagerObject bso);

	/**
	 * 可选批次 
	 */
	public List<PotentialCustomers> getbatchNumById(Long id);
	
}
