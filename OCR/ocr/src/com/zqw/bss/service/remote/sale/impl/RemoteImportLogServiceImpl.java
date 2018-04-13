package com.zqw.bss.service.remote.sale.impl;

import java.text.ParseException;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.service.remote.sale.RemoteImportLogService;
import com.zqw.bss.service.sale.ImportLogService;
import com.zqw.bss.util.WebUtil;

public class RemoteImportLogServiceImpl implements RemoteImportLogService{
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected ImportLogService importLogService;
	
	protected DAO dao;
	
	@Autowired
	public void setImportLogService(ImportLogService importLogService) {
		this.importLogService = importLogService;
	}
	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Override
	public ImportLog saveImportLog(ImportLog importLog) {
		logger.info("begin saveImportLog. id = ["+importLog.getId()+"]");
		List<ImportLog> importLogs = importLogService.getImportLogBybatchNum(importLog.getBatchNum());
		if(importLogs!=null&&importLogs.size()>0){
			throw new OperationException(importLog.getBatchNum()+ "批次已存在！");
		}
		return importLogService.saveImportLog(importLog);
	}

	@Override
	public Boolean updateImportLog(ImportLog importLog) {
		logger.info("begin updateImportLog. id = ["+importLog.getId()+"]");
		return importLogService.updateImportLog(importLog);
	}

	@Override
	public Boolean deleteImportLog(Long id) {
		logger.info("begin deleteImportLog. id = ["+id+"]");
		return importLogService.deleteImportLog(id);
	}

	@Override
	public BaseModelList<ImportLog> getPageImportLog(String query) {
		logger.info("begin getPageImportLog");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return importLogService.getPageImportLog(bso);
	}

	@Override
	public ImportLog getImportLogById(Long id) {
		logger.info("begin getImportLogById. id = ["+id+"]");
		return importLogService.getImportLogById(id);
	}

	@Override
	public List<ImportLog> getImportLogBybatchNum(String potentialCustomersId) throws ParseException {
		logger.info("begin  getTrackByPotentialCustomersId.");
		List<ImportLog> list = WebUtil.getEntryListFromProxyList(importLogService.getImportLogBybatchNum(potentialCustomersId), dao);
		logger.info("begin  getTrackByPotentialCustomersId:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	
}
