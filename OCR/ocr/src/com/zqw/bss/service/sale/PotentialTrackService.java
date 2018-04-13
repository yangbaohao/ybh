package com.zqw.bss.service.sale;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.PotentialTrack;

public interface PotentialTrackService {

	/**
	 * 添加商机信息跟踪记录
	 * @param potentialTrack	商机信息跟踪
	 * @return
	 */
	public PotentialTrack savePotentialTrack(PotentialTrack potentialTrack);
	
	/**
	 * 修改商机信息跟踪记录
	 * @param potentialTrack	商机信息跟踪
	 * @return
	 */
	public Boolean updatePotentialTrack(PotentialTrack potentialTrack);
	
	/**
	 * 删除商机信息跟踪记录
	 * @param id 主键id
	 * @return
	 */
	public Boolean deletePotentialTrack(Long id);

	/**
	 * 分页商机信息跟踪记录
	 * @param bso
	 * @return
	 */
	public BaseModelList<PotentialTrack> getPagePotentialTrack(BasePagerObject bso);
	
	/**
	 * id获取商机信息跟踪记录
	 * @param id
	 * @return
	 */
	public PotentialTrack getPotentialTrackById(Long id);
}
