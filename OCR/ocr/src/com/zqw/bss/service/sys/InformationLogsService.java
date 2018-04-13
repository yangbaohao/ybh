package com.zqw.bss.service.sys;

import java.math.BigDecimal;
import java.util.Map;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sys.InformationLogs;
import com.zqw.bss.vo.sys.InformationLogsVo;

public interface InformationLogsService {

	public Boolean saveInformationLogs(InformationLogs informationLogs,String ids);
	
	public BaseModelList<InformationLogsVo> getInformationLogsVoList(BasePagerObject query);
	
	public BaseModelList<InformationLogsVo> getInformationLogsVoListDetail(BasePagerObject query,String code);
	
	public Map<String, Object> getUserPage(BigDecimal amountmin, BigDecimal amountmax, String state,
			BigDecimal statemin, BigDecimal statemax, String datemin, String datemax, String user, String activitNumber,
			String phoneNumber);
}
