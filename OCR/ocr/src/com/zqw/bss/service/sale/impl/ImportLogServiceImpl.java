package com.zqw.bss.service.sale.impl;

import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.service.sale.ImportLogService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
@Service
@Qualifier("importLogService")
public class ImportLogServiceImpl implements ImportLogService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public ImportLog saveImportLog(ImportLog importLog) {
		logger.info("begin saveImportLog.");
		ImportLog potTrack=(ImportLog)dao.save(importLog);
		logger.info("end saveImportLog[ id =" + WebUtil.getLogBasicString() + "]");
		return potTrack;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateImportLog(ImportLog importLog) {
		logger.info("begin updateImportLog.");
		Object[] param=new Object[5];
		param[0]=importLog.getRemark();
		param[1]=importLog.getTestPhone();
		param[2]=new Date();
		param[3]=(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		param[4]=importLog.getId();
		dao.executeHql("update ImportLog il set il.remark=? , il.testPhone=? , il.lastUpdateDate=? , il.lastUpdateBy=? where il.id=?", param);
		logger.info("end updateImportLog[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteImportLog(Long id) {
		logger.info("begin deleteImportLog.");
		Object[] param=new Object[1];
		param[0]=id;
		dao.executeHql("delete from ImportLog ar where ar.id=?", param);
		logger.info("end deleteImportLog[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<ImportLog> getPageImportLog(BasePagerObject bso) {
		List<ImportLog> urls = dao.getLst4Paging("from ImportLog where createBy = '"+(String)SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME)+"'",
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, ImportLog.class));
		BaseModelList<ImportLog> lists = new BaseModelList<ImportLog>(count, WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public ImportLog getImportLogById(Long id) {
		logger.info("begin getImportLogById. id = [" + id + "]");
		ImportLog pro = (ImportLog) dao.getObject(ImportLog.class, id);
		logger.info("end getImportLogById:[ id =" + WebUtil.getLogBasicString() + "]");
		return pro;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<ImportLog> getImportLogBybatchNum(String batchNum) {
		Object[] param=new Object[1];
		param[0]=batchNum;
		List<ImportLog>  importLogs= dao.find("from ImportLog il where il.batchNum = ?", param);
		return importLogs;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public ImportLog updateStatusBybatchNum(ImportLog importLog) {
		Object[] param=new Object[2];
		param[0]=importLog.getStatus();
		param[1]=importLog.getBatchNum();
		dao.executeHql("update ImportLog il SET il.status =? where il.batchNum=?", param);
		return importLog;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateImportLogNum(ImportLog importLog) {
		logger.info("begin updateImportLog.");
		Object[] param=new Object[4];
		param[0]=importLog.getNum();
		param[1]=importLog.getLastUpdateDate();
		param[2]=importLog.getLastUpdateBy();
		param[3]=importLog.getId();
		dao.executeHql("update ImportLog il set il.num=il.num + ? , il.lastUpdateDate=? , il.lastUpdateBy=? where il.id=?", param);
		logger.info("end updateImportLog[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateImportLogNum(String batchNum, int num) {
		logger.info("begin updateImportLog.");
		Object[] param=new Object[2];
		param[0]=num;
		param[1]=batchNum;
		dao.executeHql("update ImportLog il set il.num = il.num + ? where il.batchNum=?", param);
		logger.info("end updateImportLog.");
		return true;
	}
	
}
