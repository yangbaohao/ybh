package com.zqw.bss.service.sale;

import java.util.List;
import java.util.Map;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.vo.billing.SalesAgentVo;
import com.zqw.bss.vo.sale.SalesAgentFollowVo;
import com.zqw.bss.vo.sys.OwnerDetailsVo;

public interface SalesAgentService {

	/**
	 * 添加销售代理记录
	 * @param personInfo	个人信息
	 * @param salesAgent	销售代理
	 * @return
	 */
	public SalesAgent saveSalesAgent(SalesAgent salesAgent);
	
	/**
	 * 修改销售代理记录
	 * @param personInfo 个人信息
	 * @param salesAgent 销售代理
	 * @return
	 */
	public Boolean updateSalesAgent(String state,SalesAgent salesAgent);
	
	/**
	 * 删除销售代理记录
	 * @param id 主键id
	 * @return
	 */
	public Boolean deleteSalesAgent(Long id);

	/**
	 * 分页销售代理记录
	 * @param bso
	 * @return
	 */
	public BaseModelList<SalesAgent> getPageSalesAgent(BasePagerObject bso);
	
	/**
	 * id获取销售代理记录
	 * @param id
	 * @return
	 */
	public SalesAgent getSalesAgentById(Long id);

	/**
	 * 获取销售代理
	 */
	public List<SalesAgent> getListSalesAgent();
	/**
	 * 佣金历史
	 * @param bso
	 * @return
	 */
	public BaseModelList<SalesAgentVo> getPageSalesAgentVo(BasePagerObject bso,String[] customernum,String[] fees);

	public BaseModelList<SalesAgentFollowVo> follow(BasePagerObject bso);

	public PotentialTrack savePotentialTrack(PotentialTrack potentialTrack);

	public List<SalesAgent> getSenior(String senior);
	/**
	 * 成功和付费用
	 * @param type
	 * @param agentCode
	 * @param bso
	 * @return
	 */

	public BaseModelList<OwnerDetailsVo> getOwnerDetails(String type, String agentCode, BasePagerObject bso);

	public BaseModelList<SalesAgent> getHaveSalesAgent(String num,String id, BasePagerObject bso);

	public Map<String, Long> followUp(BasePagerObject bso);

}
