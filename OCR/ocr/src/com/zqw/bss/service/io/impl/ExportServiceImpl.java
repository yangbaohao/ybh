package com.zqw.bss.service.io.impl;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.service.biz.OverviewService;
import com.zqw.bss.service.io.ExcelUtil;
import com.zqw.bss.service.io.ExportService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.vo.biz.SalesOrderListVo;



@Service
public class ExportServiceImpl implements ExportService{
	
	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	private OverviewService overviewService;
	
	@Override
	public Response exportSalesOrderVo(HttpServletRequest request, HttpServletResponse response, BasePagerObject query) {
		// TODO Auto-generated method stub
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		String fileName = "OCR信息" + getDate();
		String columnNames[] = { "用户名", "商户名称", "单号", "产品数量", "服务类型" ,"单据状态","负责人","提交日期","接单时间","完成时间","审核开始时间","审核结束时间","用户确认时间"};// 列名
		String keys[] = { "userName", "ownerName", "orderNumber", "detailQty", "serviceType","orderType","responsibleName","submitDate"
				,"orderSuccessDate","orderSubmitDate","checkBeginDate","checkSuccessDate","completeDate"};// map中的key
		BaseModelList<SalesOrderListVo> list =  overviewService.getSimpleSalesOrderVo(query, "export");
		List<SalesOrderListVo> lists = list.getRows();
		List<Map<String, Object>> listmap = new ArrayList<Map<String,Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sheetName", "OCR");
		listmap.add(map);
		for (SalesOrderListVo salesOrderListVo : lists) {
			Map<String, Object> mapValue = new HashMap<String, Object>();
			mapValue.put("userName", salesOrderListVo.getUserName());
			mapValue.put("ownerName", salesOrderListVo.getOwnerName());
			mapValue.put("orderNumber", salesOrderListVo.getOrderNumber());
			mapValue.put("detailQty", salesOrderListVo.getDetailQty());
			mapValue.put("serviceType", SystemConstant.getDict().get(salesOrderListVo.getServiceType()));
			mapValue.put("orderType", SystemConstant.getDict().get(salesOrderListVo.getOrderType()));
			mapValue.put("responsibleName", salesOrderListVo.getResponsibleName());
			mapValue.put("submitDate", salesOrderListVo.getSubmitDate()==null? "":sdf.format(salesOrderListVo.getSubmitDate()));
			mapValue.put("orderSuccessDate",salesOrderListVo.getOrderSuccessDate()==null? "":sdf.format(salesOrderListVo.getOrderSuccessDate()));
			mapValue.put("orderSubmitDate", salesOrderListVo.getOrderSubmitDate()==null? "":sdf.format(salesOrderListVo.getOrderSubmitDate()));
			mapValue.put("checkBeginDate", salesOrderListVo.getCheckBeginDate()==null? "":sdf.format(salesOrderListVo.getCheckBeginDate()));
			mapValue.put("checkSuccessDate", salesOrderListVo.getCheckSuccessDate()==null? "":sdf.format(salesOrderListVo.getCheckSuccessDate()));
			mapValue.put("completeDate",salesOrderListVo.getCompleteDate()==null? "": sdf.format(salesOrderListVo.getCompleteDate()));
			listmap.add(mapValue);
		}
		Map<String, String> titlemap = new HashMap<String, String>();
		titlemap.put("fileName", "OCR客户信息");
		try {
			ExcelUtil.createWBEquals(listmap, keys, columnNames,titlemap).write(os);
			excelExport(request, response, fileName, os);
		} catch (IOException e) {
			e.printStackTrace();
		};
		return null;
	}	
	
	private String getDate() {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmss");
		String Str = sdf.format(date);
		return Str;
	}	
	
	private void excelExport(HttpServletRequest request, HttpServletResponse response, String fileName,
			ByteArrayOutputStream os) throws IOException {
		byte[] content = os.toByteArray();
		InputStream is = new ByteArrayInputStream(content);
		// 设置response参数，可以打开下载页面
		response.reset();
		response.setContentType("application/vnd.ms-excel;charset=utf-8");
		String agent = request.getHeader("User-Agent");
		boolean isMSIE = (agent != null && (-1 != agent.indexOf("MSIE") || agent.indexOf("rv:") != -1)
				&& agent.indexOf("Firefox") == -1) || (agent != null && -1 != agent.indexOf("Trident"))
				|| (agent != null && -1 != agent.indexOf("Edge"));

		if (fileName.indexOf(".") == -1)
			fileName = fileName + ".xls";
		if (isMSIE) {
			response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(fileName, "UTF-8"));
		} else {
			response.setHeader("Content-Disposition",
					"attachment;filename=" + new String((fileName).getBytes(), "iso-8859-1"));
		}
		ServletOutputStream out = response.getOutputStream();
		BufferedInputStream bis = null;
		BufferedOutputStream bos = null;
		try {
			bis = new BufferedInputStream(is);
			bos = new BufferedOutputStream(out);
			byte[] buff = new byte[2048];
			int bytesRead;
			while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
				bos.write(buff, 0, bytesRead);
			}
		} catch (final IOException e) {
			throw e;
		} finally {
			if (bis != null)
				bis.close();
			if (bos != null)
				bos.close();
		}
	}
	
	
}
