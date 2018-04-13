package com.zqw.bss.service.remote.sys.impl;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sys.InformationLogs;
import com.zqw.bss.service.remote.sys.RemoteInformationLogsService;
import com.zqw.bss.service.sys.InformationLogsService;
import com.zqw.bss.vo.sys.InformationLogsVo;

public class RemoteInformationLogsServiceImpl implements RemoteInformationLogsService{

	@Autowired
	protected DAO dao;
	
	@Autowired
	private InformationLogsService informationLogsService;

	@Override
	public Boolean saveInformationLogs(InformationLogs informationLogs, String ids) {
		return informationLogsService.saveInformationLogs(informationLogs, ids);
	}

	@Override
	public BaseModelList<InformationLogsVo> getInformationLogsVoList(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return informationLogsService.getInformationLogsVoList(bso);
	}

	@Override
	public BaseModelList<InformationLogsVo> getInformationLogsVoListDetail(String query,String code) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return informationLogsService.getInformationLogsVoListDetail(bso, code);
	}

	@Override
	public Map<String, Object> getUserPage(BigDecimal amountmin, BigDecimal amountmax, String state,
			BigDecimal statemin, BigDecimal statemax, String datemin, String datemax, String user, String activitNumber,
			String phoneNumber) {
		return informationLogsService.getUserPage(amountmin, amountmax, state, statemin, statemax, datemin, datemax, user, activitNumber, phoneNumber);
	}
	
}
