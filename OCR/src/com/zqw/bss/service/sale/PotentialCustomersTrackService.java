package com.zqw.bss.service.sale;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.PotentialCustomersTrack;

public interface PotentialCustomersTrackService {

	/**
	 * 添加潜在客户跟踪记录
	 * @param potentialCustomersTrack	潜在客户跟踪
	 * @return
	 */
	public PotentialCustomersTrack savePotentialCustomersTrack(PotentialCustomersTrack potentialCustomersTrack);
	
	/**
	 * 修改潜在客户跟踪记录
	 * @param potentialCustomersTrack	潜在客户跟踪
	 * @return
	 */
	public Boolean updatePotentialCustomersTrack(PotentialCustomersTrack potentialCustomersTrack);
	
	/**
	 * 删除商机信息跟踪记录
	 * @param id 主键id
	 * @return
	 */
	public Boolean deletePotentialCustomersTrack(Long id);

	/**
	 * 分页潜在客户跟踪记录
	 * @param bso
	 * @return
	 */
	public BaseModelList<PotentialCustomersTrack> getPagePotentialCustomersTrack(BasePagerObject bso);
	
	/**
	 * id获取商机信息跟踪记录
	 * @param id
	 * @return
	 */
	public PotentialCustomersTrack getPotentialCustomersTrackById(Long id);

	/**
	 * 根据潜在用户id查询备注列表
	 * @param potentialCustomersId
	 * @return
	 */
	public List<PotentialCustomersTrack> getTrackByPotentialCustomersId(String potentialCustomersId);
}
