package com.zqw.bss.service.remote.common.impl;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;

import org.apache.commons.lang.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.message.Message;
import org.apache.cxf.phase.PhaseInterceptorChain;
import org.apache.cxf.transport.http.AbstractHTTPDestination;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.basic.BasicFileInfo;
import com.zqw.bss.model.basic.FileInfo;
import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.ClientInfo;
import com.zqw.bss.model.crm.TaxDeclare;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.model.sale.Potential;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.service.common.TaxReportingAgentService;
import com.zqw.bss.service.crm.OwnerService;
import com.zqw.bss.service.fms.AccountPeriodService;
import com.zqw.bss.service.mkt.voucher.VoucherService;
import com.zqw.bss.service.remote.common.RemoteCommonService;
import com.zqw.bss.service.sale.PotentialService;
import com.zqw.bss.service.sale.SalesAgentService;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.ExcelUtil;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.common.AccessVo;
import com.zqw.bss.vo.common.ClientInfoVo;
import com.zqw.bss.vo.common.OwnerAccessVo;
import com.zqw.bss.vo.common.OwnerListVo;
import com.zqw.bss.vo.common.OwnerNumVo;
import com.zqw.bss.vo.common.TaxDeclareListVo;
import com.zqw.bss.vo.common.TaxReportListVo;
import com.zqw.bss.vo.crm.ClientInfoForBssVo;
import com.zqw.bss.vo.sys.SearchOwnerListvo;
import com.zqw.bss.vo.sys.SearchUserBuyListVo;
import com.zqw.bss.vo.sys.SearchUserByTaxListVo;
import com.zqw.bss.vo.sys.UerSessionListForVo;

@SuppressWarnings("unchecked")
public class RemoteCommonServiceImpl implements RemoteCommonService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;
	@Autowired
	protected CommonService commonService;
	@Autowired
	protected TaxReportingAgentService taxReportingAgentService;
	@Autowired
	protected OwnerService ownerService;
	@Autowired
	protected UserService userService;
	@Autowired
	protected SalesAgentService salesAgentService;
	@Autowired
	protected VoucherService voucherService;
	@Autowired
	protected AccountPeriodService accountPeriodService;
	@Autowired
	protected PotentialService potentialService;
	
	@Override
	public void getNothing() {

	}
	
	@Override
	public Map<String, String> getUserInformation() {
		// TODO Auto-generated method stub
		logger.info("begin getUserInformation");
		return commonService.getUserInformation();
	}

	@Override
	public BaseModelList<OwnerNumVo> getOwnerNumVo(String role, String query) {
		logger.info("begin getOwnerNumVo");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return commonService.getOwnerNumVo(role, bso);
	}

	@Override
	public BaseModelList<OwnerAccessVo> getOwnerAccessVo(BigDecimal startRemarkNum, BigDecimal endRemarkNum,
			BigDecimal startSecond, BigDecimal endSecond, String date, String role, String query) {
		logger.info("begin  getUsersByRegisterDate.");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return commonService.getOwnerAccessVo(startRemarkNum, endRemarkNum, startSecond, endSecond, date, role, bso);
	}

	@Override
	public BaseModelList<OwnerListVo> getOwnerByDate(String effective, String date, String role, String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		if (effective.equals("effective")) {
			return commonService.getEffectiveOwnerByDate(date, role, bso);
		} else
			return commonService.getOwnerByDate(date, role, bso);
	}

	@Override
	public List<TaxReportListVo> getAllTaxReportUser() {
		return WebUtil.getEntryListFromProxyList(taxReportingAgentService.getAllTaxReportUser(), dao);
	}

	@Override
	public Boolean updateTaxReportingAgent(String username, List<TaxReportListVo> taxReportListVo) {
		return taxReportingAgentService.updateTaxReportingAgent(username, taxReportListVo);
	}
	

	@Override
	public List<OwnerListVo> getOwnerBySalesId() {
		logger.info("begin  getOwnerBySalesId.");
		return commonService.getOwnerBySalesId();
	}

	@Override
	public TaxDeclare saveTaxReporting(TaxDeclare taxDeclare) {
		if(taxDeclare.getOwnerId()==null){
			return null;
		}
		return taxReportingAgentService.updateTaxReporting(taxDeclare);
	}

	@Override
	public BaseModelList<TaxDeclareListVo> getTaxReporting(Long ownerId,String uesername,String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return taxReportingAgentService.getTaxReporting(ownerId,uesername,bso);
	}

	@Override
	public Boolean importEnterpriseInfo(String type, Long importLogId, Attachment file)
			throws UnsupportedEncodingException, FileNotFoundException, IOException {
		logger.info("begin importEnterpriseInfo. ");
		StringBuffer get=null;
		switch (type) {
		case ("potentialCustomers"):
			get=commonService.importXlsPotentialCustomersInfo(importLogId, file);
			break;
		case ("taxOwner"):
			commonService.importXlsTaxOwnerInfo(importLogId, file);
			break;
		case ("Potential"):
			commonService.importXlsPotential(importLogId, file);
			break;
		}
		if(get!=null&&!"".equals(get.toString())){
			throw new OperationException(get.toString());
		}
		logger.info("end importEnterpriseInfo. ");
		return true;
	}

	@Override
	public AccountPeriod getAccountPeriod(Long id) {
		// TODO Auto-generated method stub
		return (AccountPeriod) WebUtil.getEntryFromProxyObj(taxReportingAgentService.getAccountPeriod(id),dao);
	}

	@Override
	public Boolean importCouponInfo(String products, Long freeTime, Attachment file)
			throws UnsupportedEncodingException, FileNotFoundException, IOException  {
		logger.info("begin importEnterpriseInfo. ");
		StringBuffer get=null;
		get=commonService.importCouponInfo(products, freeTime, file);
		logger.info("end importEnterpriseInfo. ");
		return true;
	}

	@Override
	public List<UerSessionListForVo> getCustomer() {
		
		return commonService.getCustomer();
	}

	@Override
	public BaseModelList<OwnerAccessVo> getTestOwnerAccessVo(String date, String query) {
		logger.info("begin  getTestOwnerAccessVo.");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return commonService.getTestOwnerAccessVo(date, bso);
	}

	@Override
	public BaseModelList<AccessVo> getRemarkAccess(String query) {
		logger.info("begin  getRemarkAccess.");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return commonService.getRemarkAccess(bso);
	}

	@SuppressWarnings("unchecked")
	public void exportUser(BigDecimal startAmt,
			BigDecimal endAmt,String roleName, String query) throws IOException {
		// 先获取http对象

		Message messageContext = PhaseInterceptorChain.getCurrentMessage();
		HttpServletRequest request = (HttpServletRequest) messageContext.get(AbstractHTTPDestination.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) messageContext.get(AbstractHTTPDestination.HTTP_RESPONSE);

		logger.info("begin searchJournals.");
		String fileName = "UserInfo";
		String columnNames[] = { "日期", "用户名", "电话号码", "公司名称", "累计购买金额", "代理商", "销售负责人", "客服人员", "标签"};// 列名
		String keys[] = { "createDate", "username", "telephone", "name", "totalAmt", "agent","employee", "customer", "lebal"};// map中的key
		String request4pager = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request4pager);
		bso.setSortdatafield("lastUpdateDate");
		bso.setPagesize(Integer.valueOf("999999999"));
		bso.setSortorder("desc");
		List<SearchUserBuyListVo> list = null;
		List<SearchOwnerListvo> lists = null;
		//所有代理商
		List<SalesAgent> salesAgentList = salesAgentService.getListSalesAgent();
		Map<String,String> salesAgentMap = new HashMap<String,String>();
		for(SalesAgent s : salesAgentList){
			if(StringUtils.isNotBlank(s.getAgentCode()))
				salesAgentMap.put(s.getAgentCode(), s.getName()+"("+s.getAgentName()+")");
		}
		//获取所有用户信息 - 在DAO操作放在service交互
		//List<User> userList = dao.find("from User");
		List<User> userList = userService.findUsers(new User());
		Map<String,String> userMap = new HashMap<String,String>();
		for(User u : userList){
			if(StringUtils.isNotBlank(u.getEmployeeCode()))
			userMap.put(u.getEmployeeCode(), u.getUserInfo().getName()+"("+u.getUsername()+")");
		}
		
		if(roleName.equals("Sys_Admin")){
			lists = WebUtil.getEntryListFromProxyList(ownerService.getSearchUserBuyVobusrListVo(startAmt,endAmt,bso).getRows(), dao);
		}else if(roleName.equals("agentistrator")){
			list = userService.getSearchUserBuyVobusrListVo(startAmt,endAmt,bso).getRows();
		}else if(roleName.equals("salesStaff")||roleName.equals("salesManage")||roleName.equals("secondLevelSalesManage")){
			lists = WebUtil.getEntryListFromProxyList(userService.getSearchSalesUserBuyListVo(startAmt,endAmt,bso).getRows(), dao);
		}else if(roleName.equals("customerService")||roleName.equals("customerManage")||roleName.equals("secondLevelCustomerManage")){
			lists = WebUtil.getEntryListFromProxyList(userService.getSearchSalesUserBuyList(startAmt,endAmt,bso).getRows(), dao);
		}else if(roleName.equals("taxStaff")){
			list = userService.getSearchTaxUserBuyListVo(bso).getRows();
		}else{
			throw new OperationException("当前用户角色不能导出！");
		}
		List<Map<String, Object>> listmap = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sheetName", "UserInfo");
		listmap.add(map);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		if(roleName.equals("agentistrator") || roleName.equals("taxStaff")){
			for (SearchUserBuyListVo userBuy : list) {
				Map<String, Object> mapValue = new HashMap<String, Object>();
				mapValue.put("createDate", sdf.format(userBuy.getCreateDate()));
				mapValue.put("username", userBuy.getUsername());
				mapValue.put("telephone", userBuy.getTelephone());
				mapValue.put("name", userBuy.getName());
				if (userBuy.getTotalAmt()!=null) {
					mapValue.put("totalAmt", userBuy.getTotalAmt());
				} else {
					mapValue.put("totalAmt", "");
				}
				if(salesAgentMap.containsKey(userBuy.getAgentCode())){
					mapValue.put("agent", salesAgentMap.get(userBuy.getAgentCode()));
				}
				if(userMap.containsKey(userBuy.getEmployeeCode())){
					mapValue.put("employee", userMap.get(userBuy.getEmployeeCode()));
				}
				if(userMap.containsKey(userBuy.getVoucher())){
					mapValue.put("customer", userMap.get(userBuy.getVoucher()));
				}
				mapValue.put("lebal", userBuy.getLebal());
				listmap.add(mapValue);
			}
		}else{
			for (SearchOwnerListvo userBuy : lists) {
				Map<String, Object> mapValue = new HashMap<String, Object>();
				mapValue.put("createDate", sdf.format(userBuy.getCreateDate()));
				mapValue.put("username", userBuy.getUsername());
				mapValue.put("telephone", userBuy.getTelephone());
				mapValue.put("name", userBuy.getName());
				if (userBuy.getTotalAmt()!=null) {
					mapValue.put("totalAmt", userBuy.getTotalAmt());
				} else {
					mapValue.put("totalAmt", "");
				}
				if(salesAgentMap.containsKey(userBuy.getAgentCode())){
					mapValue.put("agent", salesAgentMap.get(userBuy.getAgentCode()));
				}
				if(userMap.containsKey(userBuy.getEmployeeCode())){
					mapValue.put("employee", userMap.get(userBuy.getEmployeeCode()));
				}
				if(userMap.containsKey(userBuy.getCustomerCode())){
					mapValue.put("customer", userMap.get(userBuy.getCustomerCode()));
				}
				mapValue.put("lebal", userBuy.getLebal());
				listmap.add(mapValue);
			}
		}
		excelExport(request, response, listmap, columnNames, keys, fileName);
	}
	
	public static void excelExport(HttpServletRequest request, HttpServletResponse response,
			List<Map<String, Object>> list, String columnNames[], String keys[], String fileName) throws IOException {
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			ExcelUtil.createWorkBook(list, keys, columnNames).write(os);
		} catch (IOException e) {
			e.printStackTrace();
		}
		byte[] content = os.toByteArray();
		InputStream is = new ByteArrayInputStream(content);
		// 设置response参数，可以打开下载页面
		response.reset();
		response.setContentType("application/vnd.ms-excel;charset=utf-8");
		response.setHeader("Content-Disposition",
				"attachment;filename=" + new String((fileName + ".xls").getBytes(), "utf-8"));
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

	@Override
	public List<SearchUserByTaxListVo> getAllCustomerAndSales(String sales) {
		return WebUtil.getEntryListFromProxyList(commonService.getAllCustomerAndSales(sales), dao);
	}

	@Override
	public void exportVoucher(String name, String query) throws IOException {
		// 先获取http对象

		Message messageContext = PhaseInterceptorChain.getCurrentMessage();
		HttpServletRequest request = (HttpServletRequest) messageContext.get(AbstractHTTPDestination.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) messageContext.get(AbstractHTTPDestination.HTTP_RESPONSE);
		logger.info("begin exportVoucher");
		
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (roles.contains("Sys_Admin")) {
			
		String fileName = "VoucherInfo";//文件名
		String columnNames[] = { "代金券编号", "代金券金额", "开始时间", "结束时间" };// 列名
		String keys[] = { "voucherCode","amount","startTime","endTime"};// map中的key
		String request4pager = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request4pager);
		com.zqw.bss.framework.vo.Condition con = new com.zqw.bss.framework.vo.Condition();
		con.setAction("eq");
		con.setKey("name");
		String[] str = new String[] {name};
		con.setValue(str);
		con.setValue(str);
		bso.condition.add(con);
		bso.setSortdatafield("voucherCode");
		bso.setPagesize(Integer.valueOf("999999999"));
		bso.setSortorder("desc");
		List<Voucher> list = voucherService.getAllVoucherByPage(bso).getRows();
		List<Map<String, Object>> listmap = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sheetName", "VoucherInfo");
		listmap.add(map);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		for (Voucher voucher : list) {
			Map<String, Object> mapValue = new HashMap<String, Object>();
			mapValue.put("voucherCode",voucher.getVoucherCode());
			mapValue.put("amount",voucher.getAmount());
			mapValue.put("startTime", sdf.format(voucher.getStartTime()));
			mapValue.put("endTime", sdf.format(voucher.getEndTime()));
			listmap.add(mapValue);
		}
		excelExport(request, response, listmap, columnNames, keys, fileName);
		}else{
			throw new OperationException("用户没有此权限");
		}
		logger.info("end exportVoucher");
		
	}

	@Override
	public Boolean checkInitialAccountPeriod(Long ownerId) {
		// TODO Auto-generated method stub
		return accountPeriodService.checkInitialAccountPeriod(ownerId);
	}

	@Override
	public Boolean importXlsJournal(Attachment file,Long ownerId,String createBy) throws IOException, ParseException {
		logger.info("begin importXlsJournal");
		Boolean importXlsJournal = commonService.importXlsJournal(file,ownerId,createBy);
		logger.info("end importXlsJournal");
		return importXlsJournal;
	}
	
	@Override
	public Response downloadFile(Long id) {
		logger.info("begin downloadFile.");
		Response response = commonService.getFile(id);
		logger.info("end downloadFile:[ id =" + WebUtil.getLogBasicString() + "]");
		return response;
	}

	@Override
	public Boolean removeFile(Long id) {
		logger.info("begin removeFile.");
		Boolean boolea = commonService.removeFile(id);
		logger.info("end removeFile:[ id =" + WebUtil.getLogBasicString() + "]");
		return boolea;
	}
	
	@Override
	public BasicFileInfo uploadFileByForm(Long ownerId,Attachment attachment) {

		logger.info("begin uploadFileByForm.");
		BasicFileInfo fileInfo = null;
		try {
			fileInfo = commonService.uploadFileByForm(attachment,ownerId);
		} catch (Exception e) {
			try {
				Thread.sleep(500);
			} catch (InterruptedException e1) {
				e1.printStackTrace();
			}
			fileInfo = commonService.uploadFileByForm(attachment,ownerId);
		}

		logger.info("end uploadFileByForm:[ id =" + WebUtil.getLogBasicString() + "]");
		return fileInfo;
	
	}

	@Override
	public Boolean importEnterpriseInfo(Attachment file,Long ownerId) throws UnsupportedEncodingException, FileNotFoundException,
			IOException, ParseException, InterruptedException, Exception {
		logger.info("begin importEnterpriseInfo.");

		commonService.importXlsCOA(file,ownerId);
		
		logger.info("end importEnterpriseInfo.");
		return true;
	}

	@Override
	public BaseModelList<ClientInfoForBssVo> getallClientInfoForBss(String query, Long ownerId) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return commonService.getallClientInfoForBss(bso, ownerId);
	}

	@Override
	public Boolean importPersonAndEnterpriseInfo(Attachment file, Long ownerId) throws Exception {
		// TODO Auto-generated method stub
		return commonService.importXlsEnterpriseInfo(file, ownerId);
	}

	@Override
	public Boolean createClientInfoAndUserInfo(ClientInfo clientInfo, Long ownerId,String username) {
		// TODO Auto-generated method stub
		clientInfo.setPrivilege(","+username+",");
		clientInfo.getUserInfo().setOwnerId(ownerId);
		clientInfo.getUserInfo().setCreateDate(new Date());
		clientInfo.getUserInfo().setCreateBy(username);
		clientInfo.setCreateDate(new Date());
		clientInfo.setCreateBy(username);
		clientInfo.setOwnerId(ownerId);
		clientInfo.setIsBsscreate(true);
		return commonService.createClientInfoAndUserInfo(clientInfo);
	}

	@Override
	public Boolean updateClientInfoAndUserInfo(ClientInfo clientInfo, Long ownerId, String username) {
		// TODO Auto-generated method stub
		clientInfo.setPrivilege(","+username+",");
		clientInfo.getUserInfo().setOwnerId(ownerId);
		clientInfo.getUserInfo().setCreateDate(new Date());
		clientInfo.getUserInfo().setCreateBy(username);
		clientInfo.setCreateDate(new Date());
		clientInfo.setCreateBy(username);
		clientInfo.setOwnerId(ownerId);
		clientInfo.setIsBsscreate(true);
		return commonService.updateClientInfoAndUserInfo(clientInfo);
	}

	@Override
	public Boolean deleteClientInfoAndUserInfo(Long id, Long ownerId) {
		// TODO Auto-generated method stub
		return commonService.deleteClientInfoAndUserInfo(id, ownerId);
	}

	public void exportJournal(String type, String query) throws IOException {
		// 先获取http对象

		Message messageContext = PhaseInterceptorChain.getCurrentMessage();
		HttpServletRequest request = (HttpServletRequest) messageContext.get(AbstractHTTPDestination.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) messageContext.get(AbstractHTTPDestination.HTTP_RESPONSE);
		switch (type) {
		// 商务贷款申请
		case ("clientInfo"):
			commonService.exportFile(request, response, "客户导入模板", query);
			break;
		case ("receiptImport"):
			commonService.exportFile(request, response, "发票导入模板", query);
			break;
		case ("user"):
			commonService.exportUser(request, response, query);
			break;
		case ("follow"):
			exportFollow(query);
			break;
		case ("potential"):
			exportPotential(query);
			break;
		}
	}

	@Override
	public List<BasicFileInfo> getFileInfoList(String ids) {
		logger.info("begin getFileInfoList.");
		List<BasicFileInfo> fileInfo = commonService.getBasicFileInfo(ids);
		logger.info("end getFileInfoList:[ id =" + WebUtil.getLogBasicString() + "]");
		return fileInfo;
	}
	
	@Override
	public List<ClientInfoVo> getAllClientInfoVO(String flag, Long ownerId) {
		return WebUtil.getEntryListFromProxyList(commonService.getAllClientInfoVO(flag, ownerId), dao);
	}
	
	@Override
	public List<User> importUser(Attachment file) throws UnsupportedEncodingException, FileNotFoundException,
			IOException, ParseException, InterruptedException, Exception {
		// TODO Auto-generated method stub
		logger.info("start importUser. ");
		List<User> list = commonService.importUser(file);
		logger.info("end importUser. ");
		return list;
	}
	
	@SuppressWarnings("unchecked")
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	@Override
	public void export(String type, BigDecimal startAmt,
			BigDecimal endAmt,String roleName, String query) throws IOException {
		switch (type) {
		// 导出用户信息
		case ("user"):
			exportUser(startAmt, endAmt, roleName, query);
			break;
		case ("userbuy"):
			exportUserbuy(startAmt, endAmt, roleName, query);
			break;			
		}
	}
	
	@SuppressWarnings("unchecked")
	public void exportUserbuy(BigDecimal startAmt,
			BigDecimal endAmt,String roleName, String query) throws IOException {
		// 先获取http对象
		logger.info("begin exportUserbuy.");
		Message messageContext = PhaseInterceptorChain.getCurrentMessage();
		HttpServletRequest request = (HttpServletRequest) messageContext.get(AbstractHTTPDestination.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) messageContext.get(AbstractHTTPDestination.HTTP_RESPONSE);

		String fileName = "UserBuyInfo";
		String columnNames[] = { "注册日期", "用户名称(公司名称)", "联系电话", "销售负责人(姓名/用户名)", "客服人员(姓名/用户名)", "标签", "备注详情"};// 列名
		String keys[] = { "createDate", "username", "telephone","employee", "customer", "lebal", "remark"};// map中的key
		
		String request4pager = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request4pager);
		bso.setSortdatafield("lastUpdateDate");
		bso.setPagesize(Integer.valueOf("999999999"));
		bso.setSortorder("desc");
		List<SearchUserBuyListVo> list = null;
		List<SearchOwnerListvo> lists = null;
		
		//获取所有用户信息 - 在DAO操作放在service交互
		//List<User> userList = dao.find("from User");
		List<User> userList = userService.findUsers(new User());
		Map<String,String> userMap = new HashMap<String,String>();
		for(User u : userList){
			if(StringUtils.isNotBlank(u.getEmployeeCode()))
			userMap.put(u.getEmployeeCode(), u.getUserInfo().getName()+"("+u.getUsername()+")");
		}
		
		if(roleName.equals("Sys_Admin")){
			lists = WebUtil.getEntryListFromProxyList(ownerService.getSearchUserBuyVobusrListVo(startAmt,endAmt,bso).getRows(), dao);
		}else if(roleName.equals("agentistrator")){
			list = userService.getSearchUserBuyVobusrListVo(startAmt,endAmt,bso).getRows();
		}else if(roleName.equals("salesStaff")||roleName.equals("salesManage")||roleName.equals("secondLevelSalesManage")){
			lists = WebUtil.getEntryListFromProxyList(userService.getSearchSalesUserBuyListVo(startAmt,endAmt,bso).getRows(), dao);
		}else if(roleName.equals("customerService")||roleName.equals("customerManage")||roleName.equals("secondLevelCustomerManage")){
			lists = WebUtil.getEntryListFromProxyList(userService.getSearchSalesUserBuyList(startAmt,endAmt,bso).getRows(), dao);
		}else if(roleName.equals("taxStaff")){
			list = userService.getSearchTaxUserBuyListVo(bso).getRows();
		}else{
			throw new OperationException("当前用户角色不能导出！");
		}
		List<Map<String, Object>> listmap = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sheetName", "UserInfo");
		listmap.add(map);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		if(roleName.equals("agentistrator") || roleName.equals("taxStaff")){
			for (SearchUserBuyListVo userBuy : list) {
				Map<String, Object> mapValue = new HashMap<String, Object>();
				mapValue.put("createDate", sdf.format(userBuy.getCreateDate()));
				mapValue.put("username", userBuy.getUsername()+"("+userBuy.getName()+")");
				mapValue.put("telephone", userBuy.getTelephone());
				if(userMap.containsKey(userBuy.getEmployeeCode())){
					mapValue.put("employee", userMap.get(userBuy.getEmployeeCode()));
				}
				if(userMap.containsKey(userBuy.getVoucher())){
					mapValue.put("customer", userMap.get(userBuy.getVoucher()));
				}
				mapValue.put("lebal", userBuy.getLebal());
				String remarks = "";
				if(userBuy.getRemark()!=null){
					for (int i = 0; i < userBuy.getRemark().size(); i++) {
						remarks += userBuy.getRemark().get(i).getRemark()+"("+sdf2.format(userBuy.getRemark().get(i).getCreateDate())+")";
						if(i != userBuy.getRemark().size()-1 && StringUtils.isNotBlank(userBuy.getRemark().get(i).getRemark())){
							remarks += "，";
						}
					}
				}
				mapValue.put("remark", remarks);
				listmap.add(mapValue);
			}
		}else{
			for (SearchOwnerListvo userBuy : lists) {
				Map<String, Object> mapValue = new HashMap<String, Object>();
				mapValue.put("createDate", sdf.format(userBuy.getCreateDate()));
				mapValue.put("username", userBuy.getUsername()+"("+userBuy.getName()+")");
				mapValue.put("telephone", userBuy.getTelephone());
				if(userMap.containsKey(userBuy.getEmployeeCode())){
					mapValue.put("employee", userMap.get(userBuy.getEmployeeCode()));
				}
				if(userMap.containsKey(userBuy.getCustomerCode())){
					mapValue.put("customer", userMap.get(userBuy.getCustomerCode()));
				}
				mapValue.put("lebal", userBuy.getLebal());
				String remarks = "";
				if(userBuy.getRemark()!=null){
					for (int i = 0; i < userBuy.getRemark().size(); i++) {
						remarks += userBuy.getRemark().get(i).getRemark()+"("+sdf2.format(userBuy.getRemark().get(i).getCreateDate())+")";
						if(i != userBuy.getRemark().size()-1 && StringUtils.isNotBlank(userBuy.getRemark().get(i).getRemark())){
							remarks += "，";
						}
					}
				}
				mapValue.put("remark", remarks);
				listmap.add(mapValue);
			}
		}
		
		excelExport(request, response, listmap, columnNames, keys, fileName);
		logger.info("end exportUserbuy.");
	}
	
	private void exportFollow(String query) throws IOException {
		logger.info("begin exportFollow.");
		Message messageContext = PhaseInterceptorChain.getCurrentMessage();
		HttpServletRequest request = (HttpServletRequest) messageContext.get(AbstractHTTPDestination.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) messageContext.get(AbstractHTTPDestination.HTTP_RESPONSE);

		String fileName = "FollowInfo";
		String columnNames[] = { "注册日期", "代理商名称", "联系电话", "销售负责人(姓名/用户名)", "客服人员(姓名/用户名)", "标签", "备注详情"};// 列名
		String keys[] = { "createDate", "username", "telephone","employee", "customer", "lebal", "remark"};// map中的key
		
		String request4pager = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request4pager);
		bso.setSortdatafield("lastUpdateDate");
		bso.setPagesize(Integer.valueOf("999999999"));
		bso.setSortorder("desc");
		
		//获取所有用户信息 - 在DAO操作放在service交互
		//List<User> userList = dao.find("from User");
		List<User> userList = userService.findUsers(new User());
		Map<String,String> userMap = new HashMap<String,String>();
		for(User u : userList){
			if(StringUtils.isNotBlank(u.getEmployeeCode()))
			userMap.put(u.getEmployeeCode(), u.getUserInfo().getName()+"("+u.getUsername()+")");
		}
		
		List<SalesAgent> list =  WebUtil.getEntryListFromProxyList(salesAgentService.follow(bso).getRows(),dao);
		List<Map<String, Object>> listmap = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sheetName", fileName);
		listmap.add(map);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		for (SalesAgent salesAgent : list) {
			Map<String, Object> mapValue = new HashMap<String, Object>();
			mapValue.put("createDate", sdf.format(salesAgent.getUserInfo().getCreateDate()));
			mapValue.put("username", salesAgent.getAgentName());
			mapValue.put("telephone", salesAgent.getUserInfo().getTelephone());
			if(salesAgent.getSales() != null)
			mapValue.put("employee", salesAgent.getSales().getUserInfo().getName()+"("+salesAgent.getSales().getUsername()+")");
			if(salesAgent.getCustomer() != null)
			mapValue.put("customer", salesAgent.getCustomer().getUserInfo().getName()+"("+salesAgent.getCustomer().getUsername()+")");
			mapValue.put("lebal", salesAgent.getLebal());
			String remarks = "";
			if(salesAgent.getTrackList()!=null){
				for (int i = 0; i < salesAgent.getTrackList().size(); i++) {
					remarks += sdf2.format(salesAgent.getTrackList().get(i).getCreateDate())+"，"+salesAgent.getTrackList().get(i).getComment();
					if(i != salesAgent.getTrackList().size()-1 && StringUtils.isNotBlank(salesAgent.getTrackList().get(i).getComment())){
						remarks += "，";
					}
				}
			}
			mapValue.put("remark", remarks);
			listmap.add(mapValue);
		}
		
		excelExport(request, response, listmap, columnNames, keys, fileName);
		logger.info("end exportFollow.");
	}
	
	private void exportPotential(String query) throws IOException {
		logger.info("begin exportPotential.");
		Message messageContext = PhaseInterceptorChain.getCurrentMessage();
		HttpServletRequest request = (HttpServletRequest) messageContext.get(AbstractHTTPDestination.HTTP_REQUEST);
		HttpServletResponse response = (HttpServletResponse) messageContext.get(AbstractHTTPDestination.HTTP_RESPONSE);

		String fileName = "PotentialInfo";
		String columnNames[] = { "新增日期", "潜在客户", "联系电话", "公司名称", "销售负责人(姓名/用户名)", "状态", "备注详情"};// 列名
		String keys[] = { "createDate", "potentialName", "phone","contact", "employee", "status", "remark"};// map中的key
		
		String request4pager = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request4pager);
		bso.setSortdatafield("lastUpdateDate");
		bso.setPagesize(Integer.valueOf("999999999"));
		bso.setSortorder("desc");
		
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		List<Condition> conditionlist = bso.getCondition();
		if (roles.contains("agentistrator")) {
			Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
			String[] a = { id.toString() };
			Condition cd = new Condition();
			cd.setKey("salesAgent.userInfo.id");
			cd.setValue(a);
			cd.setAction("eq");
			conditionlist.add(cd);
			bso.setCondition(conditionlist);
		}
		
		List<Potential> list =  potentialService.getPagePotential(bso).getRows();
		List<Map<String, Object>> listmap = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sheetName", fileName);
		listmap.add(map);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		for (Potential potential : list) {
			Map<String, Object> mapValue = new HashMap<String, Object>();
			mapValue.put("createDate", sdf.format(potential.getCreateDate()));
			mapValue.put("potentialName", potential.getPotentialName());
			mapValue.put("phone", potential.getPhone());
			mapValue.put("contact", potential.getContact());
			String employees = "";
			for(User u : potential.getSal()){
				employees += u.getUserInfo().getName()+"("+u.getUsername()+") ";
			}
			mapValue.put("employee", employees);
			mapValue.put("status", "notContact".equals(potential.getStatus())?"未联系":"notSuccess".equals(potential.getStatus())?"未成功":"success".equals(potential.getStatus())?"已成功":"");
			String remarks = "";
			if(potential.getTrackList()!=null){
				for (int i = 0; i < potential.getTrackList().size(); i++) {
					remarks += sdf2.format(potential.getTrackList().get(i).getCreateDate())+"，"+potential.getTrackList().get(i).getComment();
					if(i != potential.getTrackList().size()-1 && StringUtils.isNotBlank(potential.getTrackList().get(i).getComment())){
						remarks += "，";
					}
				}
			}
			mapValue.put("remark", remarks);
			listmap.add(mapValue);
		}
		
		excelExport(request, response, listmap, columnNames, keys, fileName);
		logger.info("end exportPotential.");
	}

	@Override
	public List<FileInfo> getFileInfo(String ids) {
		logger.info("begin getFileInfoList.");
		List<FileInfo> fileInfo = commonService.getFileInfo(ids);
		logger.info("end getFileInfoList:[ id =" + WebUtil.getLogBasicString() + "]");
		return fileInfo;
	}
}
