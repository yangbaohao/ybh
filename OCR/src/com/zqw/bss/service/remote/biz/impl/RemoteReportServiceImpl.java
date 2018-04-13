package com.zqw.bss.service.remote.biz.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.service.biz.ReportService;
import com.zqw.bss.service.remote.biz.RemoteReportService;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.report.PerformanceVO;

public class RemoteReportServiceImpl implements RemoteReportService{
	@Autowired
	private ReportService reportService;

	@Override
	public BaseModelList<PerformanceVO> searchCreaterReport(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return reportService.searchCreaterReport(bso);
	}

	@Override
	public BaseModelList<PerformanceVO> searchCheckerReport(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return reportService.searchCheckerReport(bso);
	}

	@Override
	public SalesOrderListVo enterGrap() {
		// TODO Auto-generated method stub
		return reportService.enterGrap();
	}
}
