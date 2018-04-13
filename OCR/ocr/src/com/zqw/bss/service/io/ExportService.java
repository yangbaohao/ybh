package com.zqw.bss.service.io;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;

import com.zqw.bss.framework.vo.BasePagerObject;

public interface ExportService {

	Response exportSalesOrderVo(HttpServletRequest request, HttpServletResponse response, BasePagerObject query);

}
