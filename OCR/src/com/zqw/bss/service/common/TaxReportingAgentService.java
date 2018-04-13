package com.zqw.bss.service.common;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.TaxDeclare;
import com.zqw.bss.vo.common.TaxDeclareListVo;
import com.zqw.bss.vo.common.TaxReportListVo;

public interface TaxReportingAgentService {
	
	/**
	 * 可以分配的用户
	 * @return List
	 */
	public List<TaxReportListVo> getAllTaxReportUser();
	
	/**
	 * 通过代理报税人分配用户
	 * @param username
	 * @param taxReportListVo
	 * @return
	 */
	public Boolean updateTaxReportingAgent(String username,List<TaxReportListVo> taxReportListVo);
	
	
	public TaxDeclare updateTaxReporting(TaxDeclare taxDeclare);
	
	public BaseModelList<TaxDeclareListVo> getTaxReporting(Long ownerId,String uesername,BasePagerObject bso);
	
	public AccountPeriod getAccountPeriod(Long id);
		
	
}
