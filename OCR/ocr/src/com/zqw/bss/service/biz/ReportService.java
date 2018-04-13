package com.zqw.bss.service.biz;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.vo.biz.SalesOrderListVo;
import com.zqw.bss.vo.report.PerformanceVO;

public interface ReportService {

	BaseModelList<PerformanceVO> searchCreaterReport(BasePagerObject bso);

	BaseModelList<PerformanceVO> searchCheckerReport(BasePagerObject bso);

	SalesOrderListVo enterGrap();

}
