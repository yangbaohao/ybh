package com.zqw.bss.service.sale;


import java.util.Map;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.Potential;

public interface PotentialService {

	/**
	 * 添加商机信息记录
	 * @param salesAgent  销售代理
	 * @param trackList	商机跟踪详细记录集、
	 * @param potential 商机信息
	 * @return
	 */
	public Boolean savePotential(Potential potential);
	
	/**
	 * 修改商机信息记录
	 * @param salesAgent 销售代理
	 * @param trackList	商机跟踪详细记录集
	 * @param potential 商机信息
	 * @return
	 */
	public Boolean updatePotential(Potential potential);
	
	/**
	 * 删除商机信息记录
	 * @param id 主键id
	 * @return
	 */
	public Boolean deletePotential(Long id);

	/**
	 * 分页商机信息记录
	 * @param bso
	 * @return
	 */
	public BaseModelList<Potential> getPagePotential(BasePagerObject bso);
	
	/**
	 * id获取商机信息记录
	 * @param id
	 * @return
	 */
	public Potential getPotentialById(Long id);

	/**
	 * id修改商机信息状态
	 * @param id
	 * @return
	 */
	public Potential updatePotentialStatusById(Potential potential);

	public Map<String, Long> followup(BasePagerObject bso);
}
