package com.zqw.bss.service.sale;


import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;
import com.zqw.bss.vo.sale.PotentialCustomersForListVO;
import com.zqw.bss.vo.sale.PotentialCustomersRegisterVo;

public interface PotentialCustomersService {

	/**
	 * 添加潜在客户记录
	 * @param sales  销售
	 * @param trackList	潜在客户跟踪详细记录集、
	 * @param potentialCustomersCustomers 潜在客户
	 * @return
	 */
	public Boolean savePotentialCustomers(PotentialCustomers potentialCustomers);
	
	/**
	 * 修改潜在客户记录
	 * @param sales 销售
	 * @param trackList	潜在客户跟踪详细记录集
	 * @param potentialCustomers 潜在客户
	 * @return
	 */
	public Boolean updatePotentialCustomers(PotentialCustomers potentialCustomers);

	/**
	 * 分页潜在客户记录
	 * @param bso
	 * @return
	 */
	public BaseModelList<PotentialCustomers> getPagePotentialCustomers(BasePagerObject bso);
	
	/**
	 * id获取潜在客户记录
	 * @param id
	 * @return
	 */
	public PotentialCustomers getPotentialCustomersById(Long id);

	/**
	 * id修改潜在客户状态
	 * @param id
	 * @return
	 */
	public PotentialCustomers updatePotentialCustomersStatusById(PotentialCustomers potentialCustomers);
	
	/**
	 * 获取潜在客户列表
	 * @return
	 */
	public List<PotentialCustomersForListVO> getAllListPotentialCustomers();
	
	/**
	 * 根据批次查询用户列表
	 * @param batchNum
	 * @return PotentialCustomers
	 */
	public List<PotentialCustomers> getAllListPotentialCustomers(String batchNum);
	
	/**
	 * 根据手机号查询用户列表
	 * @param phone
	 * @return PotentialCustomers
	 */
	public List<PotentialCustomers> getAllListPotentialCustomersByPhone(String phone);
	
	/**
	 * 根据用户id查询已发短信列表
	 * @param ID
	 * @return ShortMessage
	 */
	public List<ShortMessage> getAllListShortMessage(Long id);
	
	/**
	 * 删除潜在用户记录
	 * @param phone
	 * @return
	 */
	public Boolean deletePotentialCustomersByPhone(String phone);


	/**
	 * 根据潜在用户获取备注列表
	 * @param bso
	 * @return
	 */
	public BaseModelList<ShortMessage> getPageShortMessage(BasePagerObject bso);

	/**
	 * 用户匹配
	 * @param bso
	 * @return
	 */
	public BaseModelList<PotentialCustomersRegisterVo> putMatching(BasePagerObject bso);
	/**
	 * 查询注册用户数
	 * @param bso
	 * @return
	 */
	public BaseModelList<PotentialCustomersRegisterVo> registered(BasePagerObject bso);

	/**
	 * 发送短信给个人 
	 * @param shortMessage 短信内容
	 */	
	public Boolean sendmessageToPerson(ShortMessage shortMessage);
	
	/**
	 * 修改潜在客户批次
	 * @param id 用户id
	 * @param lastBatchNum 原批次
	 * @param batchNum 新批次
	 * @return
	 */
	public Boolean updateBatchNum(Long id,String lastBatchNum, String batchNum);
	
	/**
	 *根据id修改潜在用户姓名和手机号
	 * @param potentialCustomers 潜在客户
	 * @return
	 */
	public Boolean updateNameAndPhone(PotentialCustomers potentialCustomers);
}
