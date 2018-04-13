package com.zqw.bss.service.common.impl;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.activation.DataHandler;
import javax.servlet.ServletContext;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.hibernate.LockMode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.DateUtil;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.util.StringUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.basic.BasicFileInfo;
import com.zqw.bss.model.basic.CoaSequence;
import com.zqw.bss.model.basic.FileInfo;
import com.zqw.bss.model.basic.SequenceNumber;
import com.zqw.bss.model.basic.UionPKId;
import com.zqw.bss.model.billing.Account;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.billing.BillingProductPermission;
import com.zqw.bss.model.crm.Address;
import com.zqw.bss.model.crm.ClientAccount;
import com.zqw.bss.model.crm.ClientBank;
import com.zqw.bss.model.crm.ClientInfo;
import com.zqw.bss.model.crm.EnterpriseInfo;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PersonInfo;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.crm.UserInfo;
import com.zqw.bss.model.fms.ChartOfAccount;
import com.zqw.bss.model.fms.Journal;
import com.zqw.bss.model.fms.JournalDetail;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.model.mkt.Coupon;
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.model.sale.Potential;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sale.UserSaler;
import com.zqw.bss.model.sys.AcUser;
import com.zqw.bss.model.sys.Role;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.service.crm.OwnerService;
import com.zqw.bss.service.fms.AccountPeriodService;
import com.zqw.bss.service.mkt.AccountProductService;
import com.zqw.bss.service.sale.ImportLogService;
import com.zqw.bss.service.sale.PotentialCustomersService;
import com.zqw.bss.service.sale.PotentialCustomersTrackService;
import com.zqw.bss.service.sale.PotentialService;
import com.zqw.bss.service.sale.SalesAgentService;
import com.zqw.bss.service.sys.RoleService;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.ExcelUtil;
import com.zqw.bss.util.SystemConfig;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.DebitCredit;
import com.zqw.bss.util.SystemConstant.JournalType;
import com.zqw.bss.util.SystemConstant.PayStatus;
import com.zqw.bss.util.SystemConstant.SalesType;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.PasswordHelper;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.common.AccessVo;
import com.zqw.bss.vo.common.ClientInfoVo;
import com.zqw.bss.vo.common.OwnerAccessListVo;
import com.zqw.bss.vo.common.OwnerAccessVo;
import com.zqw.bss.vo.common.OwnerListVo;
import com.zqw.bss.vo.common.OwnerNumVo;
import com.zqw.bss.vo.crm.ClientInfoForBssVo;
import com.zqw.bss.vo.crm.ClientInfoListVo;
import com.zqw.bss.vo.sale.PotentialCustomersForListVO;
import com.zqw.bss.vo.sys.SearchUserByTaxListVo;
import com.zqw.bss.vo.sys.SearchUserListVo;
import com.zqw.bss.vo.sys.UerSessionListForVo;

@SuppressWarnings({ "unchecked", "unused", "rawtypes" })
@Service
@Qualifier("commonService")
public class CommonServiceImpl implements CommonService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Autowired
	protected PotentialCustomersService potentialCustomersService;

	@Autowired
	protected PotentialCustomersTrackService potentialCustomersTrackService;

	@Autowired
	protected ImportLogService importLogService;

	@Autowired
	protected AccountProductService accountProductService;

	@Autowired
	protected PotentialService potentialService;
	
	@Autowired
	protected OwnerService ownerService;
	
	@Autowired
	protected UserService userService;

	@Autowired
	protected RoleService roleService;
	
	@Autowired
	protected SalesAgentService salesAgentService;
	
	@Autowired
	protected AccountPeriodService accountPeriodService;
	
	private void timeOut(Long... times) {
		if (times != null && times.length > 0) {
			times[0] = times[0] + 1L;
			if (times[0] > 30)
				throw new OperationException("系统产生编号出错,请联系管理员!");
		}
	}
	
	private String getDate() {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddhhmmss");
		String Str = sdf.format(date);
		return Str;
	}

	private SequenceNumber setSeqNumber(String insertPrefix, SequenceNumber uuIdNumber) {
		List<Long> jnList = dao.find("select id  from SequenceNumber where prefix = ?", insertPrefix);
		try {
			if (jnList.size() > 0) {
				// if (jnList.get(0) != null)
				// uuIdNumber.setNumber(jnList.get(0) + 1);
				Long id = jnList.get(0);
				uuIdNumber = (SequenceNumber) dao.getObject(SequenceNumber.class, id);
				uuIdNumber.setNumber(uuIdNumber.getNumber() + 1);
				dao.update(uuIdNumber);
				dao.flush();
			} else {
				uuIdNumber = new SequenceNumber(insertPrefix);
				dao.save(uuIdNumber);
				dao.flush();
			}
		} catch (Exception e) {
			e.printStackTrace();
			// TODO: handle exception
			throw new OperationException("系统编号错误，请刷新页面重试！");
		}
		return uuIdNumber;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public String getUuId(String prefix, int len, Long... times) {
		logger.info("begin getUuId.");
		timeOut(times);

		// String insertPrefix = prefix + DateUtil.format(new Date(),
		// "yyyyMMdd");
		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
		String insertPrefix = ownerId + "#_#" + prefix + DateUtil.format(new Date(), "yyyyMMdd");
		SequenceNumber uuIdNumber = null;
		// new SequenceNumber(insertPrefix);

		uuIdNumber = setSeqNumber(insertPrefix, uuIdNumber);

		// try {
		// dao.save(uuIdNumber);
		// dao.flush();
		// } catch (Exception e) {
		// e.printStackTrace();
		// if (times == null || times.length == 0L) {
		// Long[] timesTm = { 1L };
		// times = timesTm;
		// }
		// return getUuId(prefix, len, times);
		// }
		logger.info("end  getUuId:[ id =" + WebUtil.getLogBasicString() + "]");
		// return insertPrefix + String.format("%0" + len + "d",
		// uuIdNumber.getNumber());
		return insertPrefix.split("#_#")[1] + String.format("%0" + len + "d", uuIdNumber.getNumber());
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public String getSystemCode(String type, int len, Long... times) {
		logger.info("begin getSystemCode.");
		timeOut(times);

		String insertPrefix = type;

		SequenceNumber uuIdNumber = null;
		// new SequenceNumber(insertPrefix);

		uuIdNumber = setSeqNumber(insertPrefix, uuIdNumber);

		// try {
		// dao.save(uuIdNumber);
		// dao.flush();
		// } catch (Exception e) {
		// e.printStackTrace();
		// if (times == null || times.length == 0L) {
		// Long[] timesTm = { 1L };
		// times = timesTm;
		// }
		// return getSystemCode(type, len, times);
		// }
		logger.info("end  getSystemCode:[ id =" + WebUtil.getLogBasicString() + "]");
		String id = String.format("%0" + len + "d", uuIdNumber.getNumber());
		if(insertPrefix.equals("BssTRYOUTMZ")){
			id =  insertPrefix+id;
		}
		return id;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Response downloadFile(Long id) {
		logger.info("begin downloadFile.");
		FileInfo fi = (FileInfo) dao.getObject(FileInfo.class, id);
		if (fi == null)
			throw new OperationException("文件不存在，请刷新页面！");

		String fileFullName = fi.getFilePath() + fi.getFileName();
		File file = new File(fileFullName);
		ResponseBuilder response = Response.ok(file);
		try {
			response.header("Content-Disposition",
					"attachment;filename=" + java.net.URLEncoder.encode(fi.getShowName(), "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		logger.info("end  downloadFile:[ id =" + WebUtil.getLogBasicString() + "]");
		return response.build();
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	@Override
	public FileInfo uploadFileByForm(Attachment file) {
		logger.info("begin uploadFileByForm.");
		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
		String today = DateUtil.format(new Date(), "yyyyMMdd");
		DataHandler dh = file.getDataHandler();

		FileInfo fileInfo = new FileInfo();

		fileInfo.setShowName(StringUtil.fileNameToUTF_8(dh.getName()));

		fileInfo.setFilePath(SystemConfig.getSysProperty("sys.filePath.basic") + File.separatorChar + ownerId
				+ File.separatorChar + DateUtil.format(new Date(), "yyyyMMdd") + File.separatorChar);
		fileInfo.setFileName(this.getUuId((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME), 10));

		try {
			InputStream ins = dh.getInputStream();
			writeToFile(ins, fileInfo.getFilePath(), fileInfo.getFilePath() + fileInfo.getFileName());
		} catch (Exception e) {
			throw new OperationException("文件上传失败，请稍后再试！");
		}
		dao.save(fileInfo);
		logger.info("end  uploadFileByForm:[ id =" + WebUtil.getLogBasicString() + "]");
		return fileInfo;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<FileInfo> uploadFileList(List<Attachment> files) {
		logger.info("begin uploadFileList.");
		List<FileInfo> fileInfoList = new ArrayList<FileInfo>();
		for (Attachment file : files) {
			if (StringUtil.isNotEmpty(file.getDataHandler().getName()))
				fileInfoList.add(this.uploadFileByForm(file));
		}
		logger.info("end  uploadFileList:[ id =" + WebUtil.getLogBasicString() + "]");
		return fileInfoList;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	@Override
	public Boolean removeFiles(String ids) {
		logger.info("begin removeFiles.");
		for (String id : ids.split(",")) {
			this.removeFile(Long.valueOf(id));

		}
		logger.info("end  removeFiles:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	private void writeToFile(InputStream ins, String path, String fileName) {
		try {
			logger.info("begin writeToFile.");
			File file = new File(path);
			file.mkdirs();
			OutputStream out = new FileOutputStream(new File(fileName));
			int read = 0;
			byte[] bytes = new byte[1024];

			while ((read = ins.read(bytes)) != -1) {
				out.write(bytes, 0, read);
			}
			out.flush();
			out.close();
			logger.info("end  writeToFile:[ id =" + WebUtil.getLogBasicString() + "]");
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	private String writeToString(InputStream ins) throws Exception {
		logger.info("begin writeToString.");
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		byte[] b = new byte[1024];
		int i = -1;
		while ((i = ins.read(b)) != -1) {
			out.write(b, 0, i);
		}
		ins.close();
		String str = new String(out.toByteArray(), "UTF-8");
		logger.info("end  writeToString:[ id =" + WebUtil.getLogBasicString() + "]");
		return str;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public FileInfo getFileInfo(Long id) {
		logger.info("begin getFileInfo.");
		FileInfo fileInfo = (FileInfo) dao.getObject(FileInfo.class, id);
		logger.info("end  getFileInfo:[ id =" + WebUtil.getLogBasicString() + "]");
		return fileInfo;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<FileInfo> getFileInfoList(String ids) {
		logger.info("begin getFileInfoList.");
		List<FileInfo> list = dao.getObjects(FileInfo.class, CollectionUtils.arrayToList(ids.split(",")));
		logger.info("end  getFileInfoList:[ id =" + WebUtil.getLogBasicString() + "]");
		return list;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Map<String, String> getUserInformation() {
		logger.info("begin getUserInformation.");
		// Long ownerId = (Long)
		// SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		/*
		 * List<User> user = dao.find("from User user where user.username = '" +
		 * username + "' and user.ownerId = "+ownerId);
		 */
		List<User> user = dao
				.find("from User user where user.username = '" + username + "' and user.userInfo.id = " + ownerId);
		/*
		 * List<SearchUserListVo> roleNameList = dao.find(
		 * "select new com.zqw.bss.vo.sys.SearchUserListVo(user.id, role.roleName ,role.roleNameCN) from  User user left join user.roles role"
		 * + " where ownerId =  '" + ownerId + "' and  user.id = " +
		 * user.get(0).getId());
		 */
		List<SearchUserListVo> roleNameList = dao
				.find("select new com.zqw.bss.vo.sys.SearchUserListVo(user.id, role.roleName ,role.roleNameCN) from  User user left join user.roles role"
						+ " where user.userInfo.id =  '" + ownerId + "' and  user.id = " + user.get(0).getId());

		String roleName = "";

		for (SearchUserListVo vo : roleNameList) {
			roleName += vo.getRoleName() + ",";
		}
		roleName = roleName.substring(0, roleName.length() - 1);
		Owner own = (Owner) dao.getObject(Owner.class,  (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID));
		EnterpriseInfo enterpriseInfo = new EnterpriseInfo();
		if (own != null && own.getEnterpriseInfo() != null) {
			enterpriseInfo = (EnterpriseInfo) dao.getObject(EnterpriseInfo.class, own.getEnterpriseInfo().getId());
		}

		List<User> list = dao.find("FROM User u where u.username='" + username + "'");
		User use = list.get(0);
		UserInfo userInfo = (UserInfo) dao.getObject(UserInfo.class, use.getUserInfo().getId());
		Map<String, String> map = new HashMap<String, String>();
		map.put("username", username);
		if ("taxStaff".equals(roleName) || "taxStaffadmin".equals(roleName)) {
			map.put("taxname", enterpriseInfo.getName());
		}
		if (userInfo != null) {
			String boo  = "N";
			for (SearchUserListVo vo : roleNameList) {
				if(vo.getRoleName().equals("Ocr_Admin")){
					boo = "Y";
					break;
				}
			}
			if(boo.equals("Y"))
				map.put("companyname", enterpriseInfo.getName());
			else{
				List<EnterpriseInfo> en =  dao.find("from EnterpriseInfo where ownerId = "+own.getId());
				map.put("companyname",en.get(0).getName());
			}
		}
		if ("agentistrator".equals(roleName)) {
			map.put("salesType", SalesType.agentDirect.toString());
			List<SalesAgent> salesAgent = dao.find("from SalesAgent sa where sa.userInfo.id = " + ownerId);
			map.put("agentCode", salesAgent.get(0).getAgentCode());
		} else if ("salesStaff".equals(roleName) || "customerService".equals(roleName) || "salesManage".equals(roleName)
				|| "customerManage".equals(roleName)|| "secondLevelCustomerManage".equals(roleName)|| "secondLevelSalesManage".equals(roleName)) {
			map.put("salesType", SalesType.salesDirect.toString());
		}

		/*
		 * if(owner.getSalesType()!=null){ map.put("salesType",
		 * owner.getSalesType().toString()); } if(owner.getAgentCode()!=null){
		 * map.put("agentCode", owner.getAgentCode()); }
		 */
		String roleNameCN = "";
		for (SearchUserListVo vo : roleNameList) {
			roleNameCN += vo.getRoleNameCN() + ",";
		}
		roleNameCN = roleNameCN.substring(0, roleNameCN.length() - 1);
		map.put("roleNameCN", roleNameCN);
		map.put("roleName", roleName);
		List<SalesAgent> agent = dao.find("from SalesAgent sa where sa.userInfo.id = " + ownerId
				+ " and sa.userInfo.id =" + SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID));
		if (agent.size() > 0) {
			map.put("id", String.valueOf(agent.get(0).getId()));
			map.put("senior", String.valueOf(agent.get(0).getSenior()));
		}
		map.put("userid", String.valueOf(user.get(0).getId()));
		map.put("employeeCode", String.valueOf(user.get(0).getEmployeeCode()));
		map.put("userInfoid", String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID)));
		logger.info("end  getUserInformation:[ id =" + WebUtil.getLogBasicString() + "]");
		return map;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRES_NEW)
	public String getVoucherCode(String prefix, int len, Long... times) {
		logger.info("begin getOrderCodeId.");
		timeOut(times);

		String insertPrefix = prefix + DateUtil.format(new Date(), "yyyyMMdd");

		SequenceNumber uuIdNumber = null;

		uuIdNumber = setSeqNumber(insertPrefix, uuIdNumber);

		logger.info("end  getUuId:[ id =" + WebUtil.getLogBasicString() + "]");
		return uuIdNumber.getPrefix() + String.format("%0" + len + "d", uuIdNumber.getNumber());
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<OwnerNumVo> getOwnerNumVo(String role, BasePagerObject bso) {
		logger.info("begin getOwnerNumVo.");
		String whereSql = "";
		if (StringUtil.isEmpty(role) || !role.contains("Sys_Admin")) {
			List<User> users = dao.find("from User where username = '"
					+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			whereSql = " where employeeCode = '" + users.get(0).getEmployeeCode() + "' or customerCode = '"
					+ users.get(0).getEmployeeCode() + "' ";
		}
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String selectSql = "SELECT createDate, ownerNum, realOwnerNum, accessNum, testNum ";
		String fromSql = "FROM ( SELECT l.createDate, t.ownerNum, t.realOwnerNum, l.accessNum, al.testNum FROM ( "
				// 查询登录人数左关联用户注册数
				+ "SELECT DATE(l.createDate) createDate,COUNT(DISTINCT(l.ownerId)) accessNum from t_sys_access_log l "
				+ "LEFT JOIN t_crm_owner o ON o.id = l.ownerId " + whereSql + " GROUP BY DATE(l.createDate) " + ") l "
				+ "LEFT JOIN ( " + "SELECT " + "DATE(owner0.createDate) createDate, "
				+ "COUNT(DISTINCT(owner0.loginId)) ownerNum, " + "COUNT(DISTINCT(owner0.regTelephone)) realOwnerNum "
				+ "FROM " + "t_crm_owner owner0 " + whereSql + " GROUP BY " + "DATE(owner0.createDate)  " + ") t "
				+ "ON l.createDate = t.createDate "
				// 通过日期登录人数关联测试用户登录人数
				+ "LEFT JOIN ( "
				+ "SELECT DATE(al.createDate) createDate, COUNT(DISTINCT al.phone) testNum FROM t_sys_access_log al "
				+ "WHERE al.remark = '测试账号登录' " + "AND al.phone  != '' " + "GROUP BY DATE(al.createDate) " + " )al "
				+ "ON al.createDate = l.createDate "
				// 合并上
				+ " union "
				// 查询用户注册数左关联登录人数
				+ "SELECT t.createDate, t.ownerNum, t.realOwnerNum, l.accessNum, al.testNum FROM ( "
				+ "SELECT DATE(l.createDate) createDate,COUNT(DISTINCT(l.ownerId)) accessNum from t_sys_access_log l "
				+ "LEFT JOIN t_crm_owner o ON o.id = l.ownerId " + whereSql + " GROUP BY DATE(l.createDate) " + ") l "
				+ "RIGHT JOIN ( " + "SELECT " + "DATE(owner0.createDate) createDate, "
				+ "COUNT(DISTINCT(owner0.loginId)) ownerNum, " + "COUNT(DISTINCT(owner0.regTelephone)) realOwnerNum "
				+ "FROM " + "t_crm_owner owner0 " + whereSql + " GROUP BY " + "DATE(owner0.createDate)  " + ") t "
				+ "ON l.createDate = t.createDate "
				// 通过日期登录人数关联测试用户登录人数
				+ "LEFT JOIN ( "
				+ "SELECT DATE(al.createDate) createDate, COUNT(DISTINCT al.phone) testNum FROM t_sys_access_log al "
				+ "WHERE al.remark = '测试账号登录' " + "AND al.phone  != '' " + "GROUP BY DATE(al.createDate) " + " )al "
				+ "ON al.createDate = l.createDate " + " ) o " + " WHERE 1 = 1 " + conStr
				+ " ORDER BY o.createDate DESC ";
		String countSql = "SELECT COUNT(*)  ";
		List listRS = dao.getLst4PagingWithSQL(selectSql + fromSql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(countSql + fromSql);

		List<OwnerNumVo> listVO = new ArrayList<OwnerNumVo>();
		for (Object rsArray : listRS) {
			OwnerNumVo vo = new OwnerNumVo((Object[]) rsArray);
			listVO.add(vo);
		}
		BaseModelList<OwnerNumVo> lists = new BaseModelList<OwnerNumVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		logger.info("end getOwnerNumVo.");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<OwnerAccessVo> getOwnerAccessVo(BigDecimal startRemarkNum, BigDecimal endRemarkNum,
			BigDecimal startSecond, BigDecimal endSecond, String date, String role, BasePagerObject bso) {
		logger.info("begin getOwnerAccessVo.");
		String dateone = date + " 00:00:00";
		String datetwo = date + " 23:59:59";

		String whereSql = "";
		if (StringUtil.isEmpty(role) || !role.contains("Sys_Admin")) {
			List<User> users = dao.find("from User where username = '"
					+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			whereSql = " AND (employeeCode = '" + users.get(0).getEmployeeCode() + "' or customerCode = '"
					+ users.get(0).getEmployeeCode() + "') ";
		}

		// String havingStr = " HAVING 1 = 1 ";
		// if (startRemarkNum.compareTo(BigDecimal.valueOf(-1)) != 0)
		// havingStr += " AND remarkNum >= "
		// + startRemarkNum;
		// if (endRemarkNum.compareTo(BigDecimal.valueOf(-1)) != 0)
		// havingStr += " AND remarkNum <= "
		// + endRemarkNum;
		// if (startSecond.compareTo(BigDecimal.valueOf(-1)) != 0)
		// havingStr += " AND second >= "
		// + startSecond;
		// if (endSecond.compareTo(BigDecimal.valueOf(-1)) != 0)
		// havingStr += " AND second <= "
		// + endSecond;

		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String selectSql = "SELECT o.id, o.loginId, i.name, o.regTelephone, o.createDate, min(l.createDate) minCreateDate,max(l.createDate) maxCreateDate ";
		String fromSql = "FROM t_sys_access_log l " + "LEFT JOIN t_crm_owner o ON o.id = l.ownerId "
				+ "LEFT JOIN t_crm_user_info i ON o.enterpriseInfo_id = i.id " + "WHERE l.createDate>='" + dateone
				+ "' and l.createDate<='" + datetwo + "'" + whereSql + conStr + " GROUP BY l.ownerId"
				// + havingStr
				+ " ORDER BY l.ownerId DESC ";
		String countSql = "SELECT COUNT(*)  FROM ( " + "SELECT l.ownerId " + "FROM t_sys_access_log l "
				+ "LEFT JOIN t_crm_owner o ON o.id = l.ownerId " + "LEFT JOIN t_crm_user_info i ON o.id = i.ownerId "
				+ "WHERE l.createDate>='" + dateone + "' and l.createDate<='" + datetwo + "'" + whereSql + conStr
				+ " GROUP BY l.ownerId "
				// + havingStr
				+ " ) o";
		List listRS = dao.getLst4PagingWithSQL(selectSql + fromSql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(countSql);
		List<OwnerAccessListVo> accessListVos = new ArrayList<OwnerAccessListVo>();
		Long temp = null;
		String selectAccessSql = "SELECT l.ownerId, l.remark, COUNT(l.remark) remarkNum, SUM(l.second)/60 second ";
		String fromAccessSql = "";
		List<AccessVo> listVO = null;
		for (int i = 0; i < listRS.size(); i++) {
			Object[] rsArray = (Object[]) listRS.get(i);
			// 用户id==temp
			temp = Long.valueOf(rsArray[0].toString());
			listVO = new ArrayList<AccessVo>();
			// 查询该用户的访问日志
			fromAccessSql = "FROM t_sys_access_log l " + "WHERE l.remark != '' AND l.ownerId = " + temp + " and"
					+ " l.createDate>='" + dateone + "' and l.createDate<='" + datetwo + "'"
					+ " GROUP BY l.ownerId, l.remark "
					// + havingStr
					+ " ORDER BY COUNT(l.remark) DESC ";
			List listAccess = dao.executeQuerySql(selectAccessSql + fromAccessSql, null);
			for (int j = 0; j < listAccess.size(); j++) {
				Object[] accArray = (Object[]) listAccess.get(j);
				AccessVo avo = new AccessVo((Object[]) accArray);
				listVO.add(avo);
			}
			OwnerAccessListVo vo = new OwnerAccessListVo((Object[]) rsArray);
			vo.setAccessList(listVO);
			accessListVos.add(vo);
		}
		BaseModelList<OwnerAccessVo> lists = new BaseModelList<OwnerAccessVo>(count,
				WebUtil.getEntryListFromProxyList(accessListVos, dao));
		logger.info("end getOwnerAccessVo.");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<OwnerAccessVo> getTestOwnerAccessVo(String date, BasePagerObject bso) {
		logger.info("begin getTestOwnerAccessVo.");
		String dateone = date + " 00:00:00";
		String datetwo = date + " 23:59:59";

		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String selectSql = "SELECT l.id, l.loginId, l.phone, l.minCreateDate, l.maxCreateDate, al.loginNum ";
		String fromSql = "FROM (	"
				// 查询测试账号登录用户手机号，注册名，当日登录时间，离开时间
				+ "SELECT o.id, o.loginId, l.phone, min(l.createDate) minCreateDate, max(l.createDate) maxCreateDate "
				+ "FROM t_sys_access_log l  " + "LEFT JOIN t_crm_owner o " + "ON o.regTelephone = l.phone "
				+ "WHERE l.phone !='' and l.createDate>='" + dateone + "' and l.createDate<='" + datetwo + "'" + conStr
				+ " GROUP BY l.phone " + "ORDER BY min(l.createDate) DESC ) l "
				// 通过手机号关联该用户总的访问次数
				+ "LEFT JOIN " + "(SELECT al.phone,COUNT(DISTINCT DATE(al.createDate)) loginNum "
				+ "FROM t_sys_access_log al " + "WHERE al.remark = '测试账号登录' " + "GROUP BY al.phone " + ") al "
				+ "ON al.phone = l.phone ";
		String countSql = "SELECT COUNT(*)  FROM ( " + "SELECT l.phone " + "FROM t_sys_access_log l "
				+ "WHERE  l.phone !='' and l.createDate>='" + dateone + "' and l.createDate<='" + datetwo + "'" + conStr
				+ " GROUP BY l.phone " + " ) o";
		List listRS = dao.getLst4PagingWithSQL(selectSql + fromSql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(countSql);
		List<OwnerAccessListVo> accessListVos = new ArrayList<OwnerAccessListVo>();
		String temp = null;
		String selectAccessSql = "SELECT l.ownerId, l.remark, COUNT(l.remark) remarkNum, SUM(l.second)/60 second ";
		String fromAccessSql = "";
		List<AccessVo> listVO = null;
		for (int i = 0; i < listRS.size(); i++) {
			Object[] rsArray = (Object[]) listRS.get(i);
			// 用户phone==temp
			temp = rsArray[2].toString();
			listVO = new ArrayList<AccessVo>();
			// 查询该用户的访问日志
			fromAccessSql = "FROM t_sys_access_log l " + "WHERE l.phone = " + temp + " and" + " l.createDate>='"
					+ dateone + "' and l.createDate<='" + datetwo + "'" + " GROUP BY l.remark "
					+ " ORDER BY COUNT(l.remark) DESC ";
			List listAccess = dao.executeQuerySql(selectAccessSql + fromAccessSql, null);
			for (int j = 0; j < listAccess.size(); j++) {
				Object[] accArray = (Object[]) listAccess.get(j);
				AccessVo avo = new AccessVo((Object[]) accArray);
				listVO.add(avo);
			}
			OwnerAccessListVo vo = new OwnerAccessListVo((Object[]) rsArray, listVO);
			accessListVos.add(vo);
		}
		BaseModelList<OwnerAccessVo> lists = new BaseModelList<OwnerAccessVo>(count,
				WebUtil.getEntryListFromProxyList(accessListVos, dao));
		logger.info("end getTestOwnerAccessVo.");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<OwnerListVo> getOwnerByDate(String date, String role, BasePagerObject bso) {
		String dateone = date + " 00:00:00";
		String datetwo = date + " 23:59:59";

		String whereSql = "";
		if (StringUtil.isEmpty(role) || !role.contains("Sys_Admin")) {
			List<User> users = dao.find("from User where username = '"
					+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			whereSql = " AND (o.employeeCode = '" + users.get(0).getEmployeeCode() + "' or o.customerCode = '"
					+ users.get(0).getEmployeeCode() + "') ";
		}

		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = "select new com.zqw.bss.vo.common.OwnerListVo(o.loginId,en.name,o.regTelephone) from Owner o "
				+ "left join o.enterpriseInfo en where o.createDate>='" + dateone + "' and o.createDate<='" + datetwo
				+ "'" + whereSql + conStr;
		List<OwnerListVo> list = dao.getLst4Paging(sql + " order by o.lastUpdateDate desc",
				new int[] { bso.getPagenum(), bso.getPagesize() });
		String sqlcount = "select count(DISTINCT o.id) from Owner o "
				+ "left join o.enterpriseInfo en where o.createDate>='" + dateone + "' and o.createDate<='" + datetwo
				+ "'" + whereSql + conStr;
		Long count = dao.getCount4Paging(sqlcount);
		BaseModelList<OwnerListVo> lists = new BaseModelList<OwnerListVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<OwnerListVo> getEffectiveOwnerByDate(String date, String role, BasePagerObject bso) {
		String dateone = date + " 00:00:00";
		String datetwo = date + " 23:59:59";

		String whereSql = "";
		if (StringUtil.isEmpty(role) || !role.contains("Sys_Admin")) {
			List<User> users = dao.find("from User where username = '"
					+ (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
			whereSql = " AND (o.employeeCode = '" + users.get(0).getEmployeeCode() + "' or o.customerCode = '"
					+ users.get(0).getEmployeeCode() + "') ";
		}

		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = "select new com.zqw.bss.vo.common.OwnerListVo(o.loginId,en.name,o.regTelephone) from Owner o"
				+ " left join o.enterpriseInfo en where o.createDate>='" + dateone + "' and o.createDate<='" + datetwo
				+ "' " + whereSql + " group by o.regTelephone" + conStr;
		List<OwnerListVo> list = dao.getLst4Paging(sql + " order by o.lastUpdateDate desc",
				new int[] { bso.getPagenum(), bso.getPagesize() });
		String sqlcount = "select count(DISTINCT o.regTelephone) from Owner o"
				+ " left join o.enterpriseInfo en where o.createDate>='" + dateone + "' and o.createDate<='" + datetwo
				+ "'" + whereSql + conStr;
		Long count = dao.getCount4Paging(sqlcount);
		BaseModelList<OwnerListVo> lists = new BaseModelList<OwnerListVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<OwnerListVo> getOwnerBySalesId() {
		String hql = "select new com.zqw.bss.vo.common.OwnerListVo(o.id,o.loginId,en.name,o.regTelephone,o.createDate,o.sales.id) from Owner o"
				+ " left join o.enterpriseInfo en";
		List<OwnerListVo> ui = (List<OwnerListVo>) dao.find(hql);
		return ui;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public StringBuffer importXlsPotentialCustomersInfo(Long importLogId, Attachment file) throws IOException {
		logger.info("begin importXlsPotentialCustomersInfo.");
		StringBuffer logGet = new StringBuffer();
		ImportLog importLog = importLogService.getImportLogById(importLogId);
		String batchNum = importLog.getBatchNum();
		List<User> user = dao.find(
				" from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		User sales = new User();
		Long userId = user.get(0).getId();
		sales.setId(userId);

		String today = DateUtil.format(new Date(), "yyyyMMdd");
		DataHandler dh = file.getDataHandler();

		FileInfo fileInfo = new FileInfo();

		fileInfo.setShowName(StringUtil.fileNameToUTF_8(dh.getName()));

		fileInfo.setFilePath(SystemConfig.getSysProperty("sys.filePath.basic") + File.separatorChar + userId
				+ File.separatorChar + DateUtil.format(new Date(), "yyyyMMdd") + File.separatorChar);

		fileInfo.setFileName(this.getUuId((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME), 10));

		List<PotentialCustomersForListVO> customerlist = potentialCustomersService.getAllListPotentialCustomers();
		List<String> phoneList = new ArrayList<>();
		InputStream ins = dh.getInputStream();
		// 开始行定位
		int StartNum = 0;
		HSSFWorkbook wb = new HSSFWorkbook(ins);
		HSSFSheet sheet = wb.getSheetAt(0); // 第一个工作表
		Boolean error = false;// 判断当前手机号是否在本表中重复
		for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {

			error = false;

			HSSFRow row = sheet.getRow(i); // 获取第i+1行
			// try{

			for (int j = 0; j < 8; j++) {
				if (row.getCell(j) != null) {
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				} else {
					row.createCell(j);
					row.getCell(j).setCellValue("");
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				}

			}

			PotentialCustomers pc = new PotentialCustomers();
			// PersonInfo person = new PersonInfo();
			// ci.setUserInfo(person);
			// try {
			// 判断开始循环的行
			if (!row.getCell(0).getStringCellValue().equals("")) {
				if ((row.getCell(0).getStringCellValue().equals("潜在客户")
						|| row.getCell(0).getStringCellValue().substring(0, 1).equals("*"))) {
					continue;

				}
			}
			// 如果潜在客户姓名为空结束
			if (row.getCell(0).getStringCellValue().equals("")) {
				break;
			}

			// 潜在客户手机号
			if (!(row.getCell(2) == null || row.getCell(2).getStringCellValue().equals(""))) {

				// 判断手机号是否重复
				for (PotentialCustomersForListVO customer : customerlist) {
					if (customer.getPhone().trim().equals(row.getCell(2).getStringCellValue().trim())) {
						// 0.删除原有备注信息
						// 1.删除原有该手机号的潜在客户信息
						potentialCustomersService.deletePotentialCustomersByPhone(customer.getPhone());
						// 2.减少该批次的用户数量
						importLogService.updateImportLogNum(customer.getBatchNum(), -1);
					}
				}

				// 判断手机号在自己表中是否重复
				for (String phone : phoneList) {
					if (phone.trim().equals(row.getCell(2).getStringCellValue().trim())) {
						logGet.append("第").append(i + 1).append("行潜在客户手机号重复！").append("\n");
						error = true;
						// throw new OperationException("第" + (i + 1) +
						// "行潜在客户手机号重复！");
					}
				}
				// 如果重复就跳过该行数据
				if (error) {
					continue;
				}

				// 将新的手机号添加到集合中
				phoneList.add(row.getCell(2).getStringCellValue().trim());

				pc.setPhone(row.getCell(2).getStringCellValue());
			} else {
				logGet.append("第").append(i + 1).append("行潜在客户手机号不能为空！").append("\n");
				continue;
				// throw new OperationException("第" + (i + 1) +
				// "行潜在客户手机号不能为空！");
			}

			// 潜在客户姓名
			if (!(row.getCell(0) == null || row.getCell(0).getStringCellValue().equals(""))) {
				pc.setPotentialName(row.getCell(0).getStringCellValue());
			} else {
				logGet.append("第").append(i + 1).append("行潜在客户姓名不能为空！").append("\n");
				continue;
				// throw new OperationException("第" + (i + 1) + "行潜在客户姓名不能为空！");
			}

			// 职位
			if (!row.getCell(1).getStringCellValue().equals("")) {
				pc.setPotentialPosition(row.getCell(1).getStringCellValue());
			}

			// 公司名称
			if (!row.getCell(3).getStringCellValue().equals("")) {
				pc.setContact(row.getCell(3).getStringCellValue());
			}

			// 地址区域
			if (!row.getCell(4).getStringCellValue().equals("")) {
				pc.setAddress(row.getCell(4).getStringCellValue());
			}

			// 企业类型
			if (!row.getCell(5).getStringCellValue().equals("")) {
				pc.setCompanyType(row.getCell(5).getStringCellValue());
			}

			// 企业备注
			if (!row.getCell(6).getStringCellValue().equals("")) {
				pc.setCompanyRemark(row.getCell(6).getStringCellValue());
			}

			// 主营行业
			if (!row.getCell(7).getStringCellValue().equals("")) {
				pc.setIndustry(row.getCell(7).getStringCellValue());
			}

			// 销售负责人
			pc.setSales(sales);
			// 批次
			pc.setBatchNum(batchNum);

			// 条数加1
			StartNum++;

			try {
				potentialCustomersService.savePotentialCustomers(pc);
			} catch (DataIntegrityViolationException e) {
				logGet.append("导入失败,第").append(i + 1).append("行编号重复！！").append("\n");
				continue;
				// throw new OperationException("导入失败,第" + (i + 1) + "行编号重复！！");
			}
		}
		importLog = new ImportLog();
		importLog.setId(importLogId);
		importLog.setNum(StartNum);
		importLog.setLastUpdateBy((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME));
		importLog.setLastUpdateDate(new Date());
		importLogService.updateImportLogNum(importLog);
		logger.info("end importXlsPotentialCustomersInfo.");
		return logGet;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public StringBuffer importCouponInfo(String products, Long freeTime, Attachment file) throws IOException {
		logger.info("begin importCouponInfo.");
		// 报错日志
		StringBuffer logGet = new StringBuffer();
		// 产品集合
		List<AccountProduct> accountProductList = new ArrayList<AccountProduct>();
		// 循环产品id保存到产品集合
		if (products != null && products != "") {
			String[] product = products.split(",");
			for (int p = 0; p < product.length; p++) {
				if (product[p] != null && product[p] != "") {
					// 后台赠送开通服务
					Long id = Long.parseLong(product[p]);
					// 产品
					AccountProduct accountProduct = new AccountProduct();
					accountProduct.setId(id);
					accountProductList.add(accountProduct);
				}
			}
		}

		// 查询当前所有的已存在的编码
		List<Coupon> couponlist = dao.find("from Coupon");

		String today = DateUtil.format(new Date(), "yyyyMMdd");
		DataHandler dh = file.getDataHandler();

		FileInfo fileInfo = new FileInfo();

		fileInfo.setShowName(StringUtil.fileNameToUTF_8(dh.getName()));

		List<User> user = dao.find(
				" from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		User sales = new User();
		Long userId = user.get(0).getId();
		sales.setId(userId);

		fileInfo.setFilePath(SystemConfig.getSysProperty("sys.filePath.basic") + File.separatorChar + userId
				+ File.separatorChar + DateUtil.format(new Date(), "yyyyMMdd") + File.separatorChar);

		fileInfo.setFileName(this.getUuId((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME), 10));

		// 当前文档中的编码集合
		List<String> couponCodeList = new ArrayList<>();

		InputStream ins = dh.getInputStream();
		// 开始行定位
		int StartNum = 0;
		HSSFWorkbook wb = new HSSFWorkbook(ins);
		HSSFSheet sheet = wb.getSheetAt(0); // 第一个工作表
		for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {
			HSSFRow row = sheet.getRow(i); // 获取第i+1行

			for (int j = 0; j < 1; j++) {
				if (row.getCell(j) != null) {
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				} else {
					row.createCell(j);
					row.getCell(j).setCellValue("");
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				}

			}

			Coupon coupon = new Coupon();

			// 判断开始循环的行
			if (!row.getCell(0).getStringCellValue().equals("")) {
				if ((row.getCell(0).getStringCellValue().equals("使用券编码")
						|| row.getCell(0).getStringCellValue().substring(0, 1).equals("*"))) {
					continue;
				}
			}
			// 如果使用券编码为空结束
			if (row.getCell(0).getStringCellValue().equals("")) {
				break;
			}

			// 判断使用券编码是否重复
			for (Coupon c : couponlist) {
				if (c.getCouponCode().trim().equals(row.getCell(0).getStringCellValue().trim())) {
					logGet.append("导入失败,第").append(i + 1).append("行编号重复！！");
					throw new OperationException("第" + (i + 1) + "行使用券编码重复！");
				}
			}

			// 判断使用券编码在自己表中是否重复
			for (String couponCode : couponCodeList) {
				if (couponCode.trim().equals(row.getCell(0).getStringCellValue().trim())) {
					continue;
				}
			}

			// 将新的使用券编码添加到集合中
			couponCodeList.add(row.getCell(0).getStringCellValue().trim());

			coupon.setCouponCode(row.getCell(0).getStringCellValue().trim());
			coupon.setAccountProductList(accountProductList);
			coupon.setFreeTime(freeTime);

			try {
				dao.save(coupon);
			} catch (DataIntegrityViolationException e) {
				logGet.append("导入失败,第").append(i + 1).append("行编号重复！！");
				throw new OperationException("导入失败,第" + (i + 1) + "行编号重复！！");
			}
		}
		logger.info("end importCouponInfo.");
		return logGet;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public StringBuffer importXlsTaxOwnerInfo(Long importLogId, Attachment file) throws IOException {
		logger.info("begin importXlsTaxOwnerInfo.");
		StringBuffer logGet = new StringBuffer();

		List<User> user = dao.find(
				" from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		AccountProduct ap=(AccountProduct)dao.getObject(AccountProduct.class, 10L);
		Long userId = user.get(0).getId();
		String userCode = user.get(0).getEmployeeCode();

		String today = DateUtil.format(new Date(), "yyyyMMdd");
		DataHandler dh = file.getDataHandler();

		FileInfo fileInfo = new FileInfo();

		fileInfo.setShowName(StringUtil.fileNameToUTF_8(dh.getName()));

		fileInfo.setFilePath(SystemConfig.getSysProperty("sys.filePath.basic") + File.separatorChar + userId
				+ File.separatorChar + DateUtil.format(new Date(), "yyyyMMdd") + File.separatorChar);

		fileInfo.setFileName(this.getUuId((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME), 10));

		// 当前所有用户集合
		List<AcUser> ownerList = dao.find("from AcUser");
		// 用于存放当前文件用户名集合
		List<String> loginIdList = new ArrayList<>();

		InputStream ins = dh.getInputStream();
		// 用户名规则
		String regEx = "(?!_)[a-zA-Z0-9_]+";
		Pattern pattern = Pattern.compile(regEx);

		// 开始行定位
		int StartNum = 0;
		HSSFWorkbook wb = new HSSFWorkbook(ins);
		HSSFSheet sheet = wb.getSheetAt(0); // 第一个工作表
		for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {

			HSSFRow row = sheet.getRow(i); // 获取第i+1行
			// try{
			// 如果中间又空行则提示错误
			if (row == null)
				throw new OperationException("第" + (i + 1) + "行数据为空！");

			for (int j = 0; j < 12; j++) {
				if (row.getCell(j) != null) {
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				} else {
					row.createCell(j);
					row.getCell(j).setCellValue("");
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				}

			}

			Map map = new HashMap<>();
			// 判断开始循环的行
			if (!row.getCell(0).getStringCellValue().equals("")) {
				if ((row.getCell(0).getStringCellValue().equals("用户名（字母和数字）")
						|| row.getCell(0).getStringCellValue().substring(0, 1).equals("*"))) {
					continue;

				}
			}
			// 如果用户姓名为空结束
			if (row.getCell(0) == null || row.getCell(0).getStringCellValue().equals("")) {
				throw new OperationException("第" + (i + 1) + "行用户名不能为空！");
			} else {
				// 字符串是否与正则表达式相匹配
				if (!pattern.matcher(row.getCell(0).getStringCellValue()).matches())
					throw new OperationException("第" + (i + 1) + "行用户名格式不正确！");
			}

			// 用户名是否重复
			for (AcUser o : ownerList) {
				if (o.getUsername().trim().toUpperCase()
						.equals(row.getCell(0).getStringCellValue().trim().toUpperCase())) {
					throw new OperationException("第" + (i + 1) + "行用户已是秒账用户，不可导入，请在文件中删除，直接去客户界面新增吧！");
				}
			}

			// 判断用户名在自己表中是否重复
			for (String loginId : loginIdList) {
				if (loginId.trim().equals(row.getCell(0).getStringCellValue().trim())) {
					throw new OperationException("第" + (i + 1) + "行潜用户名在当前Excel表中重复出现！");
				}
			}

			// 将新的用户名添加到集合中
			loginIdList.add(row.getCell(0).getStringCellValue().trim());

			map.put("username", row.getCell(0).getStringCellValue().trim());

			// 备注--公司名称
			if (!row.getCell(1).getStringCellValue().equals("")) {
				Remark remark = new Remark();
				remark.setRemark(row.getCell(1).getStringCellValue());
				List<Remark> remarkList = new ArrayList<Remark>();
				remarkList.add(remark);
				map.put("enterpriseName", row.getCell(1).getStringCellValue().trim());
			}

			// 纳税人性质
			if (!row.getCell(2).getStringCellValue().equals("")) {
				if ("小规模纳税人".equals(row.getCell(2).getStringCellValue())) {
					map.put("taxType", "smallscale");
				} else if ("一般增值税纳税人".equals(row.getCell(2).getStringCellValue())) {
					map.put("taxType", "generalvat");
				} else {
					throw new OperationException("第" + (i + 1) + "行请选择正确的纳税人性质！");
				}
			}

			// 纳税人识别号
			if (!row.getCell(3).getStringCellValue().equals("")) {
				map.put("enterpriseTaxCode", row.getCell(3).getStringCellValue());
			}

			// 增值税率
			if (!row.getCell(4).getStringCellValue().equals("")) {
				map.put("vat", row.getCell(4).getStringCellValue());
			}

			// 账期
			if (!row.getCell(5).getStringCellValue().equals("")) {
				Calendar c = new GregorianCalendar(1900, 0, -1);
				Date d = c.getTime();
				String importStr = "";
				String todayStr = "";
				try {
					Date _d = DateUtils.addDays(d, Integer.parseInt(row.getCell(5).getStringCellValue()));

					importStr = DateUtil.format(_d, "yyyy-MM");

					todayStr = DateUtil.format(new Date(), "yyyy-MM");
				} catch (Exception e) {
					throw new OperationException("第" + (i + 1) + "行日期格式错误！");
				}

				if (DateUtil.compareMonth(importStr, todayStr) > 0)
					throw new OperationException("第" + (i + 1) + "行当前账期不能大于当前月！");

				map.put("startMonth", importStr);
			}
			//联系电话
			if (!row.getCell(11).getStringCellValue().equals("")) {
				map.put("regTelephone", row.getCell(11).getStringCellValue());
			}else{
				throw new OperationException("第" + (i + 1) + "行联系电话不能为空！");
			}
			map.put("taxCode", userCode);
			// 初始化密码
			map.put("password", "123456");

			try {
//				System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"+i);
			    ownerService.createImportRegInfoAll(map, false, false, user, ap);
				if (i % 20 == 0) { // 每一千条刷新并写入数据库
					dao.getHibSession().flush();
					dao.getHibSession().clear();
				}
			} catch (DataIntegrityViolationException e) {
				throw new OperationException("导入失败,第" + (i + 1) + "行编号重复！");
			}
		}
		logger.info("end importXlsTaxOwnerInfo.");
		return logGet;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public boolean createImportRegInfoAll(Map map, Boolean checkName, Boolean checkStartMonth,List<User> user1 ,int hang) {
		logger.info("begin createRegInfoAll.");
		
		AcUser user = new AcUser();
		
		if(StringUtils.isBlank((String) map.get("username")))
			throw new OperationException("用户名不能为空！");
		if(checkName){
			//当前所有用户集合
			Object[] par=new Object[1];
			par[0]=(String) map.get("username");
			//当前所有用户集合
			List userList = dao.executeQuerySql("select ownerId from t_sys_user where username = ?",par);
//			List<AcUser> userList = dao.find("from AcUser where username = ?", par);
			if(userList.size()>0){
				Object[] par1=new Object[1];
				par1[0]=userList.get(0);
				List taxCodeList = dao.executeQuerySql("select taxCode from t_crm_owner where id = ?",par1);
				if(!taxCodeList.isEmpty()&&taxCodeList.get(0)!=null){
					List<String> employeeCodeList = dao.executeQuerySql("select employeeCode from t_bss_sys_user where parentEmployeeCode = '"+user1.get(0).getEmployeeCode()+"'", null);
					employeeCodeList.add(user1.get(0).getEmployeeCode());
					for(String employeeCode : employeeCodeList){
						if(taxCodeList.get(0).equals(employeeCode)){
							throw new OperationException(map.get("username")+ "用户已是您的客户，不需要再次新增！");
						}
					}
				}
				return false;
			}
		}
		Owner owner = new Owner();
		owner.setLoginId((String) map.get("username"));
		owner.setAgentCode((String) map.get("agentCode"));
		if((String) map.get("vat")!=null){
			owner.setVat(Long.valueOf((String) map.get("vat")));
		}
		owner.setCreateDate(new Date());
		owner.setCreateBy((String) map.get("username"));
		owner.setLastUpdateBy((String) map.get("username"));
		owner.setLastUpdateDate(new Date());
		
		
		
		//手机号取倒入人的手机号
		if(StringUtils.isNotBlank(user1.get(0).getUserInfo().getTelephone())){
			owner.setRegTelephone(user1.get(0).getUserInfo().getTelephone());
			map.put("telephone", user1.get(0).getUserInfo().getTelephone());
		}
		
		if (SalesType.agentDirect.toString().equals((String) map.get("salesType")))
			owner.setSalesType(SalesType.agentDirect);
		else if(SalesType.transformation.toString().equals((String) map.get("salesType")))
			owner.setSalesType(SalesType.transformation);
		else
			owner.setSalesType(SalesType.salesDirect);
		

		String todayStr = DateUtil.format(new Date(), "yyyy-MM");
		if(checkStartMonth){
			if (map.get("startMonth") != null && DateUtil.parse((String) map.get("startMonth"), "yyyy-MM") == null)
				throw new OperationException("日期格式错误！");
			
			if (map.get("startMonth") != null && DateUtil.compareMonth((String) map.get("startMonth"), todayStr) > 0)
				throw new OperationException("开始使用月份不能大于当前月！");
		}

		owner.setSalesType(SalesType.TaxSystem);

		//联系电话
		if(StringUtils.isNotBlank((String) map.get("regTelephone")))
			owner.setRegTelephone((String) map.get("regTelephone"));
		Date aoDate = randomDate("2016-09-01", "2017-04-20");
		owner.setCreateDate(aoDate);
		dao.saveNoSetDefaultValue(owner);

		logger.info("info saveUser.");
		PersonInfo personInfo = new PersonInfo();
		if(StringUtils.isNotBlank((String) map.get("username"))){
			personInfo.setName((String) map.get("username"));
		}else{
			personInfo.setName("暂未设置");
		}
		personInfo.setEmail((String) map.get("email"));
		personInfo.setTelephone((String) map.get("telephone"));
		user = new AcUser((String) map.get("username"), (String) map.get("password"), personInfo);

		PasswordHelper.encryptPassword(user);

		WebUtil.setDefaultValueInModel(user, user.getUsername(), owner.getId());
		
		List<Role> roles = new ArrayList<Role>();
		Role ro = new Role();
		ro.setId(2L);
		roles.add(ro); // 初始化注册用户的角色为管理员(不包括角色管理20、资源管理21)
		user.setRoles(roles);
		user = (AcUser) dao.save(user);

		EnterpriseInfo enterpriseInfo = new EnterpriseInfo();
		if(StringUtils.isNotBlank((String) map.get("enterpriseName"))){
			enterpriseInfo.setName((String) map.get("enterpriseName"));
		}else{
			enterpriseInfo.setName("暂未设置");
		}
		enterpriseInfo.setOwnerId(owner.getId());
		enterpriseInfo.setTelephone((String) map.get("telephone"));
		enterpriseInfo.setEmail((String) map.get("email"));
		enterpriseInfo.setRegisterTime(new Date());
		enterpriseInfo.setTaxCode((String) map.get("enterpriseTaxCode"));
		enterpriseInfo.setCreateDate(new Date());
		enterpriseInfo.setCreateBy((String) map.get("username"));
		enterpriseInfo.setLastUpdateBy((String) map.get("username"));
		enterpriseInfo.setLastUpdateDate(new Date());
		dao.saveNoSetDefaultValue(enterpriseInfo);

		owner.setEnterpriseInfo(enterpriseInfo);
		dao.updateNoSetDefaultValue(owner);
		//使用一个月
		AccountOrder ao=new AccountOrder();
		ao.setChannel("TRYOUT");
		ao.setCreateBy(owner.getLoginId());
		ao.setLastUpdateBy(owner.getLoginId());
		ao.setLastUpdateDate(aoDate);
		ao.setOrderBeginDate(aoDate);
		BillingProductPermission bpp=new BillingProductPermission();
		AccountProduct ap=(AccountProduct)dao.getObject(AccountProduct.class, 10L);
		Calendar calendarStr=Calendar.getInstance();
		calendarStr.setTime(aoDate);
		calendarStr.add(Calendar.MONTH,1);	//多加一个月
		if(hang<=3571){
			calendarStr.add(Calendar.YEAR,1);	//多加一年
		}
		bpp.setAccountProduct(ap);
		List<AccountProduct> accountProducts=new ArrayList<AccountProduct>();
		accountProducts.add(ap);
		ao.setAccountProducts(accountProducts);
		bpp.setEndDate(calendarStr.getTime());
		ao.setOrderCreateDate(aoDate);
		ao.setOrderEndDate(calendarStr.getTime());
		ao.setOwnerId(owner.getId());
		ao.setTimeNum(1);
		ao.setPayStatus(PayStatus.paid);
		if(hang<=357){
			ao.setTotalAmt(new BigDecimal(4800));	
		}else if(hang<=1071){
			ao.setTotalAmt(new BigDecimal(2400));
		}else if(hang <= 1785){
			ao.setTotalAmt(new BigDecimal(1200));
		}else if(hang <= 3571){
			ao.setTotalAmt(new BigDecimal(600));
		}else{
			ao.setTotalAmt(BigDecimal.ZERO);
			ao.setPayStatus(PayStatus.tryout);
		}
		ao.setCreateDate(aoDate);
		ao.setOrderCode(getSystemCode("BssTRYOUTMZ", 8));
		bpp.setStartDate(new Date());
		bpp.setOwnerId(owner.getId());
		bpp.setPermission(ap.getPermission());
		dao.saveNoSetDefaultValue(ao);
		dao.saveNoSetDefaultValue(bpp);
		//填写带过来的销售负责人
		String sId=(String) map.get("salesId");
		if(sId!=null&&sId!=""){
			Long salesId=Long.parseLong(sId);
			Object[] par=new Object[2];
			par[0]=salesId;
			par[1]=owner.getId();
			List role =dao.executeQuerySql("SELECT roleName FROM t_bss_sys_user u LEFT JOIN t_bss_userrole_info ut ON "
					+ "ut.userid=u.id LEFT JOIN  t_bss_sys_role_info t ON t.id=ut.roleid WHERE u.id="+salesId,null);
			List licode=dao.executeQuerySql("SELECT employeeCode FROM t_bss_sys_user WHERE id="+salesId, null);
			if(role.get(0).toString().equals("customerManage")||role.get(0).toString().equals("customerService")){
				dao.executeSql("update t_crm_owner a SET a.customerCode='"+licode.get(0).toString()+"' where a.id= "+ owner.getId(),null);
			}else{
				dao.executeHql("update Owner a SET a.employeeCode='"+licode.get(0).toString()+"' where a.id= "+ owner.getId(),null);
				dao.executeSql("update t_crm_owner a SET a.sales_id=? where a.id=?", par);
			}
		}else{
			if(owner.getAgentCode()!=null&&owner.getAgentCode()!=""){
				Object[] pa=new Object[1];
				pa[0]=owner.getAgentCode();
				List listUn=dao.executeQuerySql("SELECT sales_id from t_bss_agent WHERE agentCode=?",pa);
				if(listUn.size()>0&&listUn.get(0)!=null){
					Object[] parm=new Object[1];
					parm[0]=Long.valueOf(listUn.get(0).toString());
					List licode=dao.executeQuerySql("SELECT employeeCode FROM t_bss_sys_user WHERE ID=?", parm);
					if(licode.size()>0&&licode.get(0)!=null){
						Object[] par=new Object[2];
						String code = licode.get(0).toString();
						par[0]=Long.valueOf(listUn.get(0).toString());
						par[1]=owner.getId();
						dao.executeHql("update Owner a SET a.employeeCode='"+code+"' where a.id= "+ owner.getId(),null);
						dao.executeSql("update t_crm_owner a SET a.sales_id=? where a.id=?", par);
					}
				}
			}else{
//				String[] usersaler = SystemConfig.getCoaProperty("user.saler.distribution").split(",");
				//注册销售负责人
				List executeQuerySql = dao.executeQuerySql("select ucode.id,ucode.employeeCode from t_bss_sys_user u,t_crm_user_info ui,t_bss_sys_user ucode  where  u.userInfo_id=ui.id AND ui.telephone= "+owner.getRegTelephone()+" AND u.distributionEmployeeCode is NOT NULL AND ucode.employeeCode=u.distributionEmployeeCode", null);
				if (executeQuerySql.size()!=0) {
					//强制
					Object[] object =(Object[]) executeQuerySql.get(0);
					dao.executeHql("update Owner a SET a.employeeCode='"+object[1]+"' where a.id= "+ owner.getId(),null);
					dao.executeSql("update t_crm_owner a SET a.sales_id="+object[0]+" where a.id= "+ owner.getId(),null);
				}else{	
					//按照比例
					List<UserSaler> find = dao.find("FROM UserSaler");
					if (find!=null && find.size()>0) {
						List list = dao.executeQuerySql("select  SUm(s.proportion) FROM t_bss_user_saler s ", null);
						String [] usersaler=new String [Integer.valueOf(list.get(0)+"")];
						int emp=0;
						for (UserSaler saler : find) {
							for (int i = 0+emp; i < saler.getProportion()+emp; i++) {
								usersaler[i]=saler.getName();
							}
							emp+=saler.getProportion();
						}
						int random = (int) ( Math.random () * usersaler.length );
						List<UserSaler> salers = dao.find("FROM UserSaler s WHERE s.name='"+usersaler[random]+"'");
						dao.executeHql("update Owner a SET a.employeeCode='"+salers.get(0).getEmployeeCode()+"' where a.id= "+ owner.getId(),null);
						dao.executeSql("update t_crm_owner a SET a.sales_id="+salers.get(0).getUserId()+" where a.id= "+ owner.getId(),null);
					}else{
						dao.executeHql("update Owner a SET a.employeeCode='' where a.id= "+ owner.getId(),null);
					}
				}
			}
		}
		
		
		Object[] obj = { owner.getId() };
		
//		dao.executeSql(
//				"insert into t_fms_chart_of_account (id,ownerId,coaClass,allowInput,createBy,createDate,currValue,debitCredit,display,enabled,entryDateTime,frTemplate,hardCode,debitAmt,creditAmt,balance,iniValue,lastUpdateBy,lastUpdateDate,name,parentId,ref,creditCashFlow_id,debitCashFlow_id,level)"
//						+ " select id,? ownerId,coaClass,allowInput,createBy,createDate,0 currValue,debitCredit,'unlimited' display,enabled,entryDateTime,frTemplate,hardCode,0 debitAmt,0 creditAmt,0 balance,0 iniValue,lastUpdateBy,lastUpdateDate,name,parentId,ref,creditCashFlow_id,debitCashFlow_id,level"
//						+ " from t_fms_chart_of_account where ownerId = -1 ",
//				obj);
		Account ac = new Account();
		ac.setAmount(BigDecimal.ZERO);
		ac.setOwnerId(owner.getId());
		ac.setAccountCode(owner.getLoginId());
		ac.setCreateBy(owner.getLoginId());
		ac.setCreateDate(owner.getCreateDate());
		ac.setLastUpdateBy(owner.getLastUpdateBy());
		ac.setLastUpdateDate(owner.getLastUpdateDate());
		dao.saveNoSetDefaultValue(ac);
		logger.info("end  createRegInfoAll. [ id =" + user.getId() + "]");
		return true;
	}
	
	/** 
     * 获取随机日期 
     *  
     * @param beginDate 
     *            起始日期，格式为：yyyy-MM-dd 
     * @param endDate 
     *            结束日期，格式为：yyyy-MM-dd 
     * @return 
     */  
  
    private static Date randomDate(String beginDate, String endDate) {  
        try {  
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");  
            Date start = format.parse(beginDate);// 构造开始日期  
            Date end = format.parse(endDate);// 构造结束日期  
            // getTime()表示返回自 1970 年 1 月 1 日 00:00:00 GMT 以来此 Date 对象表示的毫秒数。  
            if (start.getTime() >= end.getTime()) {  
                return null;  
            }  
            long date = random(start.getTime(), end.getTime());  
  
            return new Date(date);  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
        return null;  
    }  
  
    private static long random(long begin, long end) {  
        long rtn = begin + (long) (Math.random() * (end - begin));  
        // 如果返回的是开始时间和结束时间，则递归调用本函数查找随机值  
        if (rtn == begin || rtn == end) {  
            return random(begin, end);  
        }  
        return rtn;  
    }  

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<UerSessionListForVo> getCustomer() {
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		List<User> users = dao.find(
				"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		String sql = "";
		String code = " and user.employeeCode in (";
		String codele = "";
		if (roles.contains("customerManage")) {
			List<User> userM = dao.find(
					"from User where  parentEmployeeCode = '" + users.get(0).getEmployeeCode() + "'");
			for (User se : userM) {
				code = code + "'" + se.getEmployeeCode() + "',";
			}
			List codelevel = dao.executeQuerySql(
					"select user.employeeCode from t_bss_sys_user user left join t_crm_user_info cu on cu.id = user.userInfo_id"
							+ " left join t_bss_userrole_info u on user.id=u.userid "
							+ " left join t_bss_sys_role_info role on role.id=u.roleid  where role.roleName = 'secondLevelCustomerManage' and user.parentEmployeeCode = '"
							+ users.get(0).getEmployeeCode() + "'",
					null);
			for(int i = 0; i< codelevel.size(); i++){
				codele = codele+"'"+codelevel.get(i).toString()+"',";
			}
			if(codelevel.size()>0){
				codele=codele.substring(0,codele.length()-1);
				List<User> userL = dao.find(
					"from User where parentEmployeeCode in (" + codele + ")");
				for (User se : userL) {
					code = code + "'" + se.getEmployeeCode() + "',";
				}
			}
			code = code + "'" + users.get(0).getEmployeeCode() + "')";
			sql = code;
		}
		if (roles.contains("secondLevelCustomerManage")) {
			List<User> userL = dao.find(
					"from User where parentEmployeeCode = '" + users.get(0).getEmployeeCode() + "'");
			for (User se : userL) {
				code = code + "'" + se.getEmployeeCode() + "',";
			}
			code = code + "'" + users.get(0).getEmployeeCode() + "')";
			sql = code;
		}
		if (roles.contains("customerService")) {
			sql = " and user.employeeCode = '" + users.get(0).getEmployeeCode() + "' ";
		}
		List<UerSessionListForVo> user = dao.executeQuerySql(
				"select user.id,user.username,user.employeeCode,cu.name,user.locked from t_bss_sys_user user left join t_crm_user_info cu on cu.id = user.userInfo_id"
						+ " left join t_bss_userrole_info u on user.id=u.userid "
						+ " left join t_bss_sys_role_info role on role.id=u.roleid  where role.roleName in ('customerService','customerManage','secondLevelCustomerManage')"
						+ " and user.locked='N' " + sql,
				null);
		List<UerSessionListForVo> personList = new ArrayList<UerSessionListForVo>();
		for (Object array : user) {
			UerSessionListForVo personInfo = new UerSessionListForVo((Object[]) array);
			personList.add(personInfo);
		}
		return personList;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<AccessVo> getRemarkAccess(BasePagerObject bso) {
		logger.info("begin getRemarkAccess.");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String selectSql = "SELECT l.offerremark, COUNT(l.remark) remarkNum, COUNT(DISTINCT l.ownerId) ownerLoginNum, SUM(l.second)/60 second ";
		String fromSql = "FROM t_sys_access_log l " + "WHERE l.offerremark IS NOT NULL " + "and l.offerremark !='' "
				+ conStr + " GROUP BY l.offerremark " + "ORDER BY l.sort";
		String countSql = "SELECT COUNT(DISTINCT l.offerremark) " + "FROM t_sys_access_log l "
				+ "WHERE l.offerremark IS NOT NULL " + "and l.offerremark !='' " + conStr;
		List listRS = dao.getLst4PagingWithSQL(selectSql + fromSql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(countSql);
		List<AccessVo> listVO = new ArrayList<AccessVo>();
		for (int j = 0; j < listRS.size(); j++) {
			Object[] accArray = (Object[]) listRS.get(j);
			AccessVo avo = new AccessVo((Object[]) accArray, "ownerLoginNum");
			listVO.add(avo);
		}
		BaseModelList<AccessVo> lists = new BaseModelList<AccessVo>(count,
				WebUtil.getEntryListFromProxyList(listVO, dao));
		logger.info("end getRemarkAccess.");
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<SearchUserByTaxListVo> getAllCustomerAndSales(String sales) {
		String name = "";
		if (sales.equals("sales"))
			name = "('salesStaff','secondLevelSalesManage')";
		if (sales.equals("customer"))
			name = "('customerService','secondLevelCustomerManage')";
		if (sales.equals("secondLevelSalesManage"))
			name = "('salesStaff')";
		if (sales.equals("secondLevelCustomerManage"))
			name = "('customerService')";
		String sql = "select new com.zqw.bss.vo.sys.SearchUserByTaxListVo(user.id,user.employeeCode,user.username) from User user left join user.roles role where "
				+ " role.roleName in " + name + " and user.parentEmployeeCode is null ";
		List<SearchUserByTaxListVo> list = dao.find(sql);
		return list;
	}

	/**
	 * 凭证导入
	 * 
	 * @throws ParseException
	 */
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRES_NEW)
	public Boolean importXlsJournal(Attachment file, Long ownerId, String createBy) throws IOException, ParseException {
		logger.info("begin importXlsJournal.");
		// Long ownerId =56L;
		// 获取用户名
		// String hql1 = "select userInfo" + " from User user ,UserInfo userInfo
		// "
		// + " where user.userInfo.id = userInfo.id and user.ownerId = " +
		// ownerId;
		// UserInfo userInfo = (UserInfo) dao.find(hql1).get(0);
		DataHandler dh = file.getDataHandler();
		InputStream ins = dh.getInputStream();
		HSSFWorkbook wb = null;
		try {
			wb = new HSSFWorkbook(ins);
		} catch (Exception e) {
			throw new OperationException("文件格式错误");
		}
		HSSFSheet sheet = wb.getSheetAt(0); // 第一个工作表
		// 获取全部可用的科目Map<String,COA>
		String hql = "from ChartOfAccount a where  a.uuId.ownerId=" + ownerId;
		List<ChartOfAccount> list = (List<ChartOfAccount>) dao.find(hql);
		Map<String, ChartOfAccount> coaMap = new HashMap<String, ChartOfAccount>();
		for (int j = 0; j < list.size(); j++) {
			if (list.get(j).getEnabled().equals(Boolean.TRUE)) {
				coaMap.put(list.get(j).getName(), list.get(j));
			}
		}
		// 当前导入凭证的序号
		String ceq = null;
		// 最大凭证字号
		Long topCeq = 0l;
		// 当前导入的凭证
		Journal globalJ = new Journal();
		for (int i = 0; i <= sheet.getLastRowNum(); i++) {
			System.out.println("第" + (i + 1) + "行---------------------");
			HSSFRow row = sheet.getRow(i);
			for (int j = 0; j < 10; j++) {
				if (null != row.getCell(j)) {
					// 设置单元格数据类型
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				} else {
					row.createCell(j);
					row.getCell(j).setCellValue("");
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				}
			}
			HSSFRow nextRow = sheet.getRow(i + 1);
			if (i != sheet.getLastRowNum()) {
				// 为借贷平衡判断方便，给偶数行下一行设置单元格格式
				for (int j = 0; j < 10; j++) {
					if (null != nextRow.getCell(j)) {
						// 设置单元格数据类型
						nextRow.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
					} else {
						nextRow.createCell(j);
						nextRow.getCell(j).setCellValue("");
						nextRow.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
					}
				}
			}
			// 标志位为当前行分类true=凭证行，false=凭证明细行
			Boolean journalFlag = true;
			if (row.getCell(0) == null || row.getCell(0).getStringCellValue().equals("")) {
				if (null != row || row.getCell(5) != null || !row.getCell(5).getStringCellValue().trim().equals("")) {
					journalFlag = false;
				} else {
					break;
				}
			}
			if (row.getCell(0).getStringCellValue().equals("*") || row.getCell(0).getStringCellValue().equals("凭证字号")) {
				continue;
			}
			Journal journal = new Journal();
			JournalDetail jd = new JournalDetail();
			DateFormat df = new SimpleDateFormat("yyyy/MM/dd");

			// 当前行第一列为空的时候
			if (!(row.getCell(0).getStringCellValue().equals("")) && row.getCell(0).getStringCellValue() != null) {
				// 获取当前导入的凭证序号
				ceq = row.getCell(0).getStringCellValue();
				// 验证日期格式是否正确
				String date = row.getCell(1).getStringCellValue();

				try {
					journal.setCreateDate(df.parse(date));
				} catch (ParseException e) {
					throw new OperationException("第" + (i + 1) + "行，日期填写格式错误。");
				}
				if (!row.getCell(2).getStringCellValue().equals("")) {
					Long pageNumber = Long.valueOf(row.getCell(2).getStringCellValue());
					journal.setNoteNumber(pageNumber);
				}
				// if(available.equals("")||available.equals("启用")){
				// }else if(available.equals("禁用")){
				//
				// }else{
				// throw new OperationException("第"+(i+1)+"行，是否启用填写错误。");
				// }

			}
			journal.setJournalType(JournalType.input);
			String description = row.getCell(4).getStringCellValue();
			jd.setDescription(description);

			String coaName = row.getCell(5).getStringCellValue();
			ChartOfAccount coa = new ChartOfAccount();
			try {
				coa.setId(((ChartOfAccount) coaMap.get(coaName)).getUuId().getId());
			} catch (NullPointerException e) {
				throw new OperationException("第" + (i + 1) + "行，会计科目名称填写有误，不存在对应的会计科目。");
			}
			coa.setOwnerId(ownerId);
			jd.setChartOfAccount(coa);

			BigDecimal debitAmt;
			if (null == row.getCell(6).getStringCellValue() || row.getCell(6).getStringCellValue().equals("")) {
				debitAmt = BigDecimal.ZERO;
			} else {
				debitAmt = BigDecimal.valueOf(Double.valueOf(row.getCell(6).getStringCellValue()));
			}
			jd.setDebitAmt(debitAmt);
			BigDecimal creditAmt;
			if (null == row.getCell(7).getStringCellValue() || row.getCell(7).getStringCellValue().equals("")) {
				creditAmt = BigDecimal.ZERO;
			} else {
				creditAmt = BigDecimal.valueOf(Double.valueOf(row.getCell(7).getStringCellValue()));
			}
			jd.setCreditAmt(creditAmt);
			String category1 = row.getCell(8).getStringCellValue();
			jd.setCategory1(category1);
			String category2 = row.getCell(9).getStringCellValue();
			jd.setCategory2(category2);

			// 根据当前行类型,设置关联关系
			if (journalFlag) {
				Long journalNumber = Long.valueOf(row.getCell(0).getStringCellValue());
				journal.setEntryDate(new Date());
				journal.setJournalType(JournalType.input);
				journal.setJournalNumber(journalNumber);
				journal.setOwnerId(ownerId);
				// 设置月份
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
				journal.setEntryMonth(sdf.format(df.parse(row.getCell(1).getStringCellValue())));

				journal.getJournalDetails().add(jd);

				try {
					journal.setCreateBy(createBy);
					journal = (Journal) dao.save(journal);

				} catch (DataIntegrityViolationException e) {
					throw new OperationException("日期年月或凭证字号输入重复，请检查！凭证字号：" + ceq);
				}

				jd.setJournal(journal);
				dao.save(jd);
				globalJ = journal;
				// 更新凭证字号序列

				String prefix = SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID) + "_"
						+ DateUtil.format(new Date(), "yyyy-MM") + "_" + JournalType.input.toString();
				SequenceNumber uuIdNumber = null;

				List<Long> idList = dao.find(" select id from SequenceNumber where prefix = ?  ", prefix);
				if (idList.size() > 0) {
					Long id = idList.get(0);
					uuIdNumber = (SequenceNumber) dao.getObject(SequenceNumber.class, id);
					// 凭证编号取最大值
					topCeq = globalJ.getJournalNumber() > topCeq ? globalJ.getJournalNumber() : topCeq;
					uuIdNumber.setNumber(topCeq);
					dao.save(uuIdNumber);
					if (journalNumber >= globalJ.getJournalNumber()) {
						uuIdNumber.setNumber(globalJ.getJournalNumber());
						dao.save(uuIdNumber);
					}
				} else {
					uuIdNumber = new SequenceNumber(prefix);
					dao.save(uuIdNumber);

				}

			} else {
				globalJ.getJournalDetails().add(jd);
				globalJ = (Journal) dao.save(globalJ);
				dao.save(globalJ);
				jd.setJournal(globalJ);
				dao.save(jd);
			}
			// 判断凭证明细是否同时填写了借贷金额或同时没填
			if ((jd.getCreditAmt().compareTo(BigDecimal.ZERO) == 0 && jd.getDebitAmt().compareTo(BigDecimal.ZERO) == 0)
					|| !(jd.getCreditAmt().compareTo(BigDecimal.ZERO) == 0)
							&& !(jd.getDebitAmt().compareTo(BigDecimal.ZERO) == 0)) {
				throw new OperationException("第" + (i + 1) + "行，借方金额贷方金额要求填写其中一个。");
			}
			// 判断是否为凭证明细行最后一行
			// 当下一行第一列为空，判断借贷是否平衡
			if (i == sheet.getLastRowNum()
					|| (!sheet.getRow(i + 1).getCell(5).getStringCellValue().equals("")
							&& !String.valueOf(sheet.getRow(i + 1).getCell(0).getStringCellValue()).equals(""))
					|| (sheet.getRow(i + 1).getCell(5).getStringCellValue().equals("")
							&& sheet.getRow(i + 1).getCell(0).getStringCellValue().equals(""))) {
				BigDecimal debit = BigDecimal.ZERO;
				BigDecimal credit = BigDecimal.ZERO;
				for (JournalDetail jl : globalJ.getJournalDetails()) {
					debit = debit.add(jl.getDebitAmt());
					credit = credit.add(jl.getCreditAmt());
				}
				if (!(debit.compareTo(credit) == 0)) {
					throw new OperationException("借贷不平衡！凭证字号:" + ceq);
				}
			}

		}
		logger.info("end importXlsJournal.");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Response getFile(Long id) {
		logger.info("begin downloadFile.");

		Object[] obj = (Object[]) dao.executeQuerySql(
				"SELECT i.filePath,i.fileName,i.showName FROM t_basic_file_info i WHERE i.id=" + id, null).get(0);
		FileInfo fi = new FileInfo((String) obj[0], (String) obj[1], (String) obj[2]);
		// FileInfo fi = (FileInfo) dao.getObject(FileInfo.class, id);
		if (fi == null)
			throw new OperationException("文件不存在，请刷新页面！");

		String fileFullName = fi.getFilePath() + fi.getFileName();
		File file = new File(fileFullName);
		ResponseBuilder response = Response.ok(file);
		try {
			response.header("Content-Disposition",
					"attachment;filename=" + java.net.URLEncoder.encode(fi.getShowName(), "UTF-8"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		logger.info("end  downloadFile:[ id =" + WebUtil.getLogBasicString() + "]");
		return response.build();
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	@Override
	public Boolean removeFile(Long id) {
		logger.info("begin removeFile.");
		FileInfo fi = (FileInfo) dao.getObject(FileInfo.class, id);
		if (fi == null)
			return true;
		String fullName = fi.getFilePath() + fi.getFileName();
		File file = new File(fi.getFilePath() + fi.getFileName());
		file.delete();
		dao.removeObject(FileInfo.class, id);
		logger.info("end  removeFile:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public BasicFileInfo uploadFileByForm(Attachment file, Long ownerId) {
		logger.info("begin uploadFileByForm.");

		String today = DateUtil.format(new Date(), "yyyyMMdd");
		DataHandler dh = file.getDataHandler();

		BasicFileInfo fileInfo = new BasicFileInfo();

		fileInfo.setShowName(StringUtil.fileNameToUTF_8(dh.getName()));

		fileInfo.setFilePath(SystemConfig.getSysProperty("sys.filePath.basic") + File.separatorChar + ownerId
				+ File.separatorChar + DateUtil.format(new Date(), "yyyyMMdd") + File.separatorChar);

		Random random = new Random();
		random.setSeed((new Date()).getTime());

		synchronized (this) {
			fileInfo.setFileName(this.getUuId((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME), 12)
					+ random.nextInt());
		}
		try {
			InputStream ins = dh.getInputStream();
			writeToFile(ins, fileInfo.getFilePath(), fileInfo.getFilePath() + fileInfo.getFileName());
		} catch (Exception e) {
			throw new OperationException("文件上传失败，请稍后再试！");
		}
		fileInfo.setCreateBy("test");
		fileInfo.setOwnerId(ownerId);
		dao.save(fileInfo);
		logger.info("end  uploadFileByForm:[ id =" + WebUtil.getLogBasicString() + "]");
		return fileInfo;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRES_NEW)
	public Boolean importXlsCOA(Attachment file, Long ownerId) throws IOException {
		logger.info("begin importXlsCOA.");
		// Long ownerId = (Long)
		// SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
		Date dt = new Date();
		Long time = dt.getTime();

		String today = DateUtil.format(new Date(), "yyyyMMdd");
		DataHandler dh = file.getDataHandler();

		InputStream ins = dh.getInputStream();
		HSSFWorkbook wb = new HSSFWorkbook();
		try {
			wb = new HSSFWorkbook(ins);
		} catch (Exception e) {
			throw new OperationException("系统错误，请稍后再试！");
		}

		String hql = "from ChartOfAccount a where  a.uuId.ownerId=" + ownerId;
		// -------------------------------当前账号中的全部科目
		List<ChartOfAccount> coaList = (List<ChartOfAccount>) dao.find(hql);
		Map<Long, Map<String, ChartOfAccount>> levelList = new HashMap<Long, Map<String, ChartOfAccount>>();
		List<ChartOfAccount> oldList = (List<ChartOfAccount>) dao.find(hql);
		Map<String, ChartOfAccount> newMap = new HashMap<String, ChartOfAccount>();

		// 按科目分级，不同分级的科目放到不同的map中，然后将所有map放到list中方便插入时子级科目查找并设置父级科目
		for (int i = 0; i < coaList.size(); i++) {
			Map<String, ChartOfAccount> levelMap = new HashMap<String, ChartOfAccount>();
			levelMap.put(coaList.get(i).getHardCode(), coaList.get(i));
			ChartOfAccount coaCur = coaList.get(i);
			for (int j = i + 1; j < coaList.size(); j++) {
				if (coaCur.getLevel().equals(coaList.get(j).getLevel())) {
					levelMap.put(coaList.get(j).getHardCode(), coaList.get(j));
					coaList.remove(j);
					j--;
				}
			}
			// 将当前list中第一个科目的level作为下标将按科目级别创建的levelMap放入list中
			levelList.put(coaCur.getLevel(), levelMap);
		}
		BigDecimal credit = BigDecimal.ZERO;
		BigDecimal debit = BigDecimal.ZERO;
		BigDecimal initCredit = BigDecimal.ZERO;
		BigDecimal initDebit = BigDecimal.ZERO;
		// -------------------------------获取文件中填写的科目信息，遍历五个工作表将数据放到Map<hardCode,coa>
		for (int index = 0; index < wb.getNumberOfSheets(); index++) {
			HSSFSheet sheet = wb.getSheetAt(index); // 第一个工作表
			for (int i = 1; i <= sheet.getLastRowNum(); i++) {
				HSSFRow row = sheet.getRow(i);
				for (int j = 0; j < 10; j++) {
					// 通过第一行第一格判断是否为科目导入文件
					if (null != row.getCell(j)) {
						row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
					} else {
						row.createCell(j);
						row.getCell(j).setCellValue("");
						row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
					}
				}
				ChartOfAccount coa = new ChartOfAccount();
				// ---------检验第一列
				if (null == row || row.getCell(0) == null || row.getCell(0).getStringCellValue().trim().equals("")) {
					continue;
				}
				System.out.println("===========================" + row.getCell(0).getStringCellValue());
				if (row.getCell(0).getStringCellValue().equals("科目编码")
						|| row.getCell(0).getStringCellValue().trim().equals("科目导入")
						|| row.getCell(0).getStringCellValue().trim().substring(0, 1).equals("*")
						|| row.getCell(0).getStringCellValue().equals("②")) {
					continue;
				}
				// 检验科目编码长度
				// if (!((row.getCell(0).getStringCellValue().length() % 2) ==
				// 0)
				// || row.getCell(0).getStringCellValue().length() < 6) {
				// throw new OperationException(
				// "第" + (i + 1) + "行,科目编码长度有误,当前长度为:" +
				// row.getCell(0).getStringCellValue().length());
				// }
				// 6开头的损益类科目期初值只能为零
				if (row.getCell(0).getStringCellValue().substring(0, 1).equals("6")
						&& !row.getCell(3).getStringCellValue().trim().equals("")) {
					if (!(BigDecimal.valueOf(Double.valueOf(row.getCell(3).getStringCellValue()))
							.compareTo(BigDecimal.ZERO) == 0)) {
						throw new OperationException(
								"第" + (i + 1) + "行,损益类科目期初值不能填写除0以外的值,当前值为:" + row.getCell(3).getStringCellValue());
					}
				}
				// 获得科目级数
				Long level = Long.valueOf(row.getCell(0).getStringCellValue().length() / 2 - 1);
				if (row.getCell(0).getCellStyle().getFillForegroundColor() == IndexedColors.GREY_25_PERCENT
						.getIndex()) {
					continue;
				}
				Long parentLevel = level - 1;
				String hardCode = row.getCell(0).getStringCellValue();
				// 检验科目编码填写是否合法
				ChartOfAccount coaParent = new ChartOfAccount();

				coa.setHardCode(hardCode);
				coa.setRef(hardCode);
				coa.setLevel(level);
				// 根据科目编码获取到父级的id并赋值
				if (levelList.containsKey(parentLevel)
						&& levelList.get(parentLevel).containsKey(hardCode.substring(0, hardCode.length() - 2))) {
					coaParent = levelList.get(parentLevel).get(hardCode.substring(0, hardCode.length() - 2));
					coa.setParentId(coaParent.getId());
					coa.setDebitCredit(coaParent.getDebitCredit());
					coa.setCreditCashFlow(coaParent.getCreditCashFlow());
					coa.setDebitCashFlow(coaParent.getDebitCashFlow());
					coa.setCoaClass(coaParent.getCoaClass());
				}

				coa.setAllowInput(true);

				// ---检验第二列
				// 检验科目名称是否为空
				if (row.getCell(1).getStringCellValue().trim().equals("")) {
					throw new OperationException("第" + (i + 1) + "行，科目名称不能为空。");
				}
				coa.setName(row.getCell(1).getStringCellValue());
				coa.setDisplayValue(row.getCell(1).getStringCellValue());
				coa.setName(row.getCell(1).getStringCellValue());
				// ---检验第三列
				if (row.getCell(2).getStringCellValue().equals("借")
						|| row.getCell(2).getStringCellValue().equals("贷")) {
					coa.setDebitCredit(row.getCell(2).equals("借") ? DebitCredit.debit : DebitCredit.credit);
				} else {
					throw new OperationException("第" + (i + 1) + "行，借贷方向填写有误：" + row.getCell(2).getStringCellValue());
				}

				// ---检验第四列
				// 检验期初值
				if (row.getCell(3).getStringCellValue().trim().equals("")) {
					coa.setIniValue(BigDecimal.ZERO);
				} else {
					try {
						coa.setIniValue(BigDecimal.valueOf(Double.valueOf(row.getCell(3).getStringCellValue())));
					} catch (Exception e) {
						throw new OperationException("第" + (i + 1) + "行，期初值填写有误。");
					}
				}

				// 检验累计借方
				if (row.getCell(4).getStringCellValue().trim().equals("")) {
					coa.setDebitAmt(BigDecimal.ZERO);
				} else {
					try {
						coa.setDebitAmt(BigDecimal.valueOf(Double.valueOf(row.getCell(4).getStringCellValue())));
					} catch (Exception e) {
						throw new OperationException("第" + (i + 1) + "行，借方金额填写有误。");
					}
				}
				if (row.getCell(5).getStringCellValue().trim().equals("")) {
					coa.setCreditAmt(BigDecimal.ZERO);
				} else {
					try {
						coa.setCreditAmt(BigDecimal.valueOf(Double.valueOf(row.getCell(5).getStringCellValue())));
					} catch (Exception e) {
						throw new OperationException("第" + (i + 1) + "行，贷方金额填写有误。");
					}
				}
				debit = debit.add(coa.getDebitAmt());
				credit = credit.add(coa.getCreditAmt());
				if (coa.getIniValue().compareTo(BigDecimal.ZERO) != 0) {

					if (row.getCell(2).getStringCellValue().equals("贷")) {
						initCredit = initCredit.add(coa.getIniValue());
					} else {
						initDebit = initDebit.add(coa.getIniValue());
					}
				}
				// initDebit=initDebit.add(coa.getDebitCredit().equals(DebitCredit.debit)?coa.getDebitAmt():BigDecimal.ZERO);
				// initCredit=initCredit.add(coa.getDebitCredit().equals(DebitCredit.credit)?coa.getCreditAmt():BigDecimal.ZERO);
				// 检验是否启用
				if (row.getCell(6).getStringCellValue().trim().equals("")
						|| row.getCell(6).getStringCellValue().trim().equals("启用")) {
					coa.setAllowInput(true);
					coa.setEnabled(true);
				} else if (row.getCell(6).getStringCellValue().trim().equals("禁用")) {
					coa.setAllowInput(true);
					coa.setEnabled(false);
				} else {
					throw new OperationException("第" + (i + 1) + "行，是否启用填写有误。");
				}
				// 借方科目的，等于期初值加贷减借;贷方科目的，等于期初值加借减贷
				if (coa.getDebitCredit().equals(DebitCredit.debit)) {
					coa.setBalance(coa.getIniValue().add(coa.getDebitAmt()).subtract(coa.getCreditAmt()));
				} else {
					coa.setBalance(coa.getIniValue().add(coa.getCreditAmt()).subtract(coa.getDebitAmt()));
				}
				coa.setLevel(Long.valueOf(coa.getHardCode().length() / 2 - 1));

				newMap.put(coa.getHardCode(), coa);
				if (!levelList.get(coa.getLevel()).containsKey(coa.getHardCode())) {
					levelList.get(coa.getLevel()).put(coa.getHardCode(), coa);
				}
			}
		}
		if (debit.compareTo(credit) != 0) {
			throw new OperationException("借贷不平衡，借方总额:" + debit + ",贷方总额：" + credit);
		}
		if (initCredit.compareTo(initDebit) != 0) {
			throw new OperationException("借贷方期初值不同，借方期初值:" + initDebit + ",贷方期初值：" + initCredit);
		}
		BigDecimal creditAmt = BigDecimal.ZERO;
		BigDecimal debitAmt = BigDecimal.ZERO;
		// *************************************循环插入******************************************
		for (int i = 0; i < oldList.size(); i++) {
			ChartOfAccount oldCoa = oldList.get(i);

			if (!oldCoa.getAllowInput()) {
				newMap.remove(oldCoa.getHardCode());
				continue;
			}
			// ---------------------------------------------是否已存在旧科目，已存在则更新
			newMap.size();
			if (newMap.containsKey(oldCoa.getHardCode())) {
				ChartOfAccount newCoa = newMap.get(oldCoa.getHardCode());
				oldCoa.setName(newCoa.getName());
				oldCoa.setEnabled(newCoa.getEnabled());

				// 先更新父级
				if (oldCoa.getHardCode().length() != 4) {
					levelList = this.saveCoa(newCoa, oldCoa, levelList, ownerId);
				}

				oldCoa.setIniValue(newCoa.getIniValue());
				oldCoa.setCreditAmt(newCoa.getCreditAmt());
				oldCoa.setDebitAmt(newCoa.getDebitAmt());
				if (oldCoa.getDebitCredit().equals(DebitCredit.debit)) {
					oldCoa.setBalance(oldCoa.getIniValue().add(oldCoa.getDebitAmt()).subtract(oldCoa.getCreditAmt()));
				} else {
					oldCoa.setBalance(oldCoa.getIniValue().add(oldCoa.getCreditAmt()).subtract(oldCoa.getDebitAmt()));
				}
				newMap.remove(oldCoa.getHardCode());
				try {
					dao.save(oldCoa);
				} catch (DataIntegrityViolationException e) {
					throw new OperationException("科目名称重复，科目编码:" + oldCoa.getHardCode());
				}
				// Map <String,ChartOfAccount> mapVal=new
				// HashMap<String,ChartOfAccount>();
				levelList.get(oldCoa.getLevel()).put(oldCoa.getHardCode(), oldCoa);
				UionPKId upid = new UionPKId();
				upid.setId(oldCoa.getId());
				upid.setOwnerId(ownerId);

			} else {
				// --------------------------------------------如果不存在就删除
				Long id = oldCoa.getId();

				UionPKId upid = new UionPKId();
				upid.setId(id);
				upid.setOwnerId(ownerId);

				// 检查该科目能否被删除
				ChartOfAccount chartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, upid);
				if (chartOfAccount.getHardCode().length() == 4) {
					continue;
				}
				// 因为可以删除的都是子集，所以，必然有parentId
				Long parentId = chartOfAccount.getParentId();
				if (!chartOfAccount.getAllowInput()) {
					throw new OperationException("抱歉，" + chartOfAccount.getDisplayValue() + " 有子科目，不可删除！");
				}
				Long count = dao.getCount4PagingWithSQL("select count(id) from t_fms_journal_detail where ownerId = "
						+ ownerId + " and chartOfAccount_id = " + id);
				count += dao.getCount4PagingWithSQL(
						"select count(id) from t_prod_product " + "where ownerId = " + ownerId + " and (coaCost_id = "
								+ id + " or coaIncome_id = " + id + " or coaInventory_id = " + id + ")");

				count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_asset " + "where (coaDepreciate_id = "
						+ id + " " + "or coaExpense_id = " + id + ") and ownerId = " + ownerId);

				count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_expense_payment "
						+ "where coaFunds_id = " + id + " and ownerId = " + ownerId);
				count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_expense_payment "
						+ "where coaReason_id = " + id + " and ownerId = " + ownerId);

				count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_fee_income "
						+ "where coaDeposit_id = " + id + " and ownerId = " + ownerId);
				count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_fee_income " + "where coaReason_id = "
						+ id + " and ownerId = " + ownerId);

				count += dao.getCount4PagingWithSQL("select count(id) from  t_fms_reimreceipt "
						+ "where coaReason_id = " + id + " and ownerId = " + ownerId);

				count += dao.getCount4PagingWithSQL("select count(id) from t_purchase_order_pay "
						+ "where coaFunds_id = " + id + " and ownerId = " + ownerId);
				count += dao.getCount4PagingWithSQL("select count(id) from t_sales_order_pay " + "where coaFunds_id = "
						+ id + " and ownerId = " + ownerId);

				if (count > 0) {
					throw new OperationException("抱歉，" + chartOfAccount.getDisplayValue() + " 已产生关联业务，不可删除！");
				}

				this.updateAllValueWithParentForDelete(upid, oldCoa.getCreditAmt(), oldCoa.getDebitAmt(),
						oldCoa.getIniValue(), oldCoa.getBalance());
				dao.removeObject(ChartOfAccount.class, upid);
				dao.flush();
				// 查询科目子集数量
				Long cCount = dao.getCount4PagingWithSQL("select count(id) from t_fms_chart_of_account where ownerId = "
						+ ownerId + " and parentId = " + parentId);
				if (cCount == 0) {
					Long cou = dao.executeSql("update t_fms_chart_of_account set allowInput = 'Y' where ownerId = "
							+ ownerId + " and id = " + parentId, null);
					if (cou != 1) {
						throw new OperationException("对不起，父科目状态未正常更新，请联系客服。");
					}
				}

			}
		}
		// ------------------------------------剩余的记录为需要新增的科目
		Collection<ChartOfAccount> CoaList = newMap.values();
		List<ChartOfAccount> cCoa = new ArrayList<ChartOfAccount>();
		for (ChartOfAccount coa : CoaList) {
			cCoa.add(coa);
		}
		for (ChartOfAccount coa : cCoa) {
			// if(!coa.getAllowInput()){
			// continue;
			// }
			if (coa.getUuId() == null) {
				coa.setUuId(new UionPKId());
			}
			if (coa.getId() == null) {
				CoaSequence coaseq = new CoaSequence();
				try {
					dao.save(coaseq);
				} catch (DataIntegrityViolationException e) {
					throw new OperationException("科目名称重复，科目编码:" + coa.getHardCode());
				}
				coa.setId(coaseq.getId());

			}
			System.out.println("-------------------" + coa.getHardCode());
			if (coa.getHardCode().length() != 4) {

				coa.setDebitCredit(levelList.get(Long.valueOf(coa.getHardCode().length() / 2) - 2)
						.get(coa.getHardCode().substring(0, coa.getHardCode().length() - 2)).getDebitCredit());
			}
			// 更新父级
			if (coa.getDebitCredit().equals(DebitCredit.debit)) {
				coa.setBalance(coa.getIniValue().add(coa.getDebitAmt()).subtract(coa.getCreditAmt()));
			} else {
				coa.setBalance(coa.getIniValue().add(coa.getCreditAmt()).subtract(coa.getDebitAmt()));
			}
			if (!(coa.getHardCode().length() == 4)) {
				this.saveCoa(levelList, coa, false);
				ChartOfAccount coaParent = (ChartOfAccount) levelList
						.get(Long.valueOf(coa.getHardCode().length() / 2 - 2))
						.get(coa.getHardCode().substring(0, coa.getHardCode().length() - 2));
				coa.setParentId(coaParent.getId());
			}

			UionPKId upid = new UionPKId();
			upid.setId(coa.getId());
			upid.setOwnerId(ownerId);
			coa.setOwnerId(ownerId);
			try {
				coa = (ChartOfAccount) dao.save(coa);
				// 科目名称重复时候抛出异常
			} catch (DataIntegrityViolationException e) {
				throw new OperationException("科目名称重复，科目编码:" + coa.getHardCode());
			}
			Map<String, ChartOfAccount> mapVal = new HashMap<String, ChartOfAccount>();

			levelList.get(coa.getLevel()).put(coa.getHardCode(), coa);
			// dao.flush();
			// if (!levelList.containsKey(coa.getLevel())) {
			// Map<String, ChartOfAccount> map = new HashMap<String,
			// ChartOfAccount>();
			// levelList.put(coa.getLevel(), map);
			// }
			levelList.get(coa.getLevel()).put(coa.getHardCode(), coa);
			// 新增第一个子级的时候执行的更新操作
			Long count1 = dao.getCount4PagingWithSQL("select count(id) from t_fms_chart_of_account " + "where id = "
					+ coa.getParentId() + " and ownerId = " + coa.getOwnerId());
			dao.flush();
			if (count1 == 1) {
				dao.executeSql("update t_fms_journal_detail set chartOfAccount_id = " + coa.getId() + " "
						+ "where chartOfAccount_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);
				dao.executeSql("update t_fms_asset set coaDepreciate_id = " + coa.getId() + " "
						+ "where coaDepreciate_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);
				dao.executeSql("update t_fms_asset set coaExpense_id = " + coa.getId() + " " + "where coaExpense_id = "
						+ coa.getParentId() + " and ownerId = " + ownerId, null);

				dao.executeSql("update t_fms_expense_payment set coaFunds_id = " + coa.getId() + " "
						+ "where coaFunds_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);
				dao.executeSql("update t_fms_expense_payment set coaReason_id = " + coa.getId() + " "
						+ "where coaReason_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);

				dao.executeSql("update t_fms_fee_income set coaDeposit_id = " + coa.getId() + " "
						+ "where coaDeposit_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);
				dao.executeSql("update t_fms_fee_income set coaReason_id = " + coa.getId() + " "
						+ "where coaReason_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);

				dao.executeSql("update t_fms_reimreceipt set coaReason_id = " + coa.getId() + " "
						+ "where coaReason_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);

				dao.executeSql("update t_prod_product set coaCost_id = " + coa.getId() + " " + "where coaCost_id = "
						+ coa.getParentId() + " and ownerId = " + ownerId, null);
				dao.executeSql("update t_prod_product set coaIncome_id = " + coa.getId() + " " + "where coaIncome_id = "
						+ coa.getParentId() + " and ownerId = " + ownerId, null);
				dao.executeSql("update t_prod_product set coaInventory_id = " + coa.getId() + " "
						+ "where coaInventory_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);

				dao.executeSql("update t_purchase_order_pay set coaFunds_id = " + coa.getId() + " "
						+ "where coaFunds_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);
				dao.executeSql("update t_sales_order_pay set coaFunds_id = " + coa.getId() + " "
						+ "where coaFunds_id = " + coa.getParentId() + " and ownerId = " + ownerId, null);

			}

		}
		dao.flush();
		return true;
	}

	// 新增时调用
	private Map<Long, Map<String, ChartOfAccount>> saveCoa(Map<Long, Map<String, ChartOfAccount>> levelList,
			ChartOfAccount coa, Boolean flag
	// , ChartOfAccount coaParent
	) {
		System.out.println("******************" + coa.getHardCode());
		// 新的子级coa
		// 原本的子级
		ChartOfAccount oldCoa = levelList.get(coa.getLevel() - 1)
				.get(coa.getHardCode().substring(0, coa.getHardCode().length() - 2));
		// 新的父级
		ChartOfAccount newParent = levelList.get(coa.getLevel() - 1)
				.get(coa.getHardCode().substring(0, coa.getHardCode().length() - 2));
		if (flag) {
			newParent.setDebitAmt(newParent.getDebitAmt().subtract(oldCoa.getDebitAmt()));
			newParent.setCreditAmt(newParent.getCreditAmt().subtract(oldCoa.getCreditAmt()));
			newParent.setIniValue(newParent.getIniValue().subtract(oldCoa.getIniValue()));
			newParent.setBalance(newParent.getBalance().subtract(oldCoa.getBalance()));
		}
		newParent.setDebitAmt(newParent.getDebitAmt().add(coa.getDebitAmt()));
		newParent.setCreditAmt(newParent.getCreditAmt().add(coa.getCreditAmt()));
		newParent.setIniValue(newParent.getIniValue().add(coa.getIniValue()));
		newParent.setBalance(newParent.getBalance().add(coa.getBalance()));
		dao.save(newParent);
		levelList.get(newParent.getLevel()).put(newParent.getHardCode(), newParent);
		if (newParent.getLevel() != 1) {
			this.saveCoa(levelList, newParent, true);
		}

		return levelList;
	}

	// 更新时调用
	private Map<Long, Map<String, ChartOfAccount>> saveCoa(ChartOfAccount newCoa, ChartOfAccount oldCoa,
			Map<Long, Map<String, ChartOfAccount>> levelList, Long ownerId) {
		ChartOfAccount coaParent = new ChartOfAccount();

		ChartOfAccount newParent = levelList.get(oldCoa.getLevel() - 1)
				.get(oldCoa.getHardCode().substring(0, oldCoa.getHardCode().length() - 2));
		coaParent.setDebitAmt(newParent.getDebitAmt());
		coaParent.setCreditAmt(newParent.getCreditAmt());
		coaParent.setBalance(newParent.getBalance());
		coaParent.setIniValue(newParent.getIniValue());
		coaParent.setLevel(newParent.getLevel());
		coaParent.setHardCode(newParent.getHardCode());

		if (newParent.getDebitAmt() == null)
			newParent.setDebitAmt(BigDecimal.ZERO);

		if (oldCoa.getDebitAmt() == null)
			oldCoa.setDebitAmt(BigDecimal.ZERO);

		if (newParent.getCreditAmt() == null)
			newParent.setCreditAmt(BigDecimal.ZERO);

		if (oldCoa.getCreditAmt() == null)
			oldCoa.setCreditAmt(BigDecimal.ZERO);

		if (newParent.getIniValue() == null)
			newParent.setIniValue(BigDecimal.ZERO);

		if (oldCoa.getIniValue() == null)
			oldCoa.setIniValue(BigDecimal.ZERO);

		newParent.setDebitAmt(newParent.getDebitAmt().subtract(oldCoa.getDebitAmt()));
		newParent.setCreditAmt(newParent.getCreditAmt().subtract(oldCoa.getCreditAmt()));
		newParent.setIniValue(newParent.getIniValue().subtract(oldCoa.getIniValue()));
		newParent.setBalance(newParent.getBalance().subtract(oldCoa.getBalance()));

		newParent.setDebitAmt(newParent.getDebitAmt().add(newCoa.getDebitAmt()));
		newParent.setCreditAmt(newParent.getCreditAmt().add(newCoa.getCreditAmt()));
		newParent.setIniValue(newParent.getIniValue().add(newCoa.getIniValue()));
		newParent.setBalance(newParent.getBalance().add(newCoa.getBalance()));
		if (newParent.getId() == null) {
			CoaSequence coaseq = new CoaSequence();
			dao.save(coaseq);
			newParent.setId(coaseq.getId());
		}
		dao.save(newParent);
		levelList.get(newParent.getLevel()).put(newParent.getHardCode(), newParent);
		if (newParent.getLevel() != 1) {
			this.saveCoa(newParent, coaParent, levelList, ownerId);
		}
		return levelList;
	}

	private Boolean updateAllValueWithParentForDelete(UionPKId pk, BigDecimal credit, BigDecimal debit,
			BigDecimal iniValue, BigDecimal balance) {
		logger.info("begin updateCurrentValueWithParent.");
		ChartOfAccount chartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, pk,
				LockMode.UPGRADE_NOWAIT);

		if (!chartOfAccount.getAllowInput())
			throw new OperationException("科目：" + chartOfAccount.getDisplayValue() + "有子科目，不能参与计算！");

		chartOfAccount.setCreditAmt(chartOfAccount.getCreditAmt().subtract(credit));
		chartOfAccount.setDebitAmt(chartOfAccount.getDebitAmt().subtract(debit));
		chartOfAccount.setBalance(chartOfAccount.getBalance().subtract(balance));
		chartOfAccount.setIniValue(chartOfAccount.getIniValue().subtract(iniValue));

		Long pid = chartOfAccount.getParentId();

		int n = 0;
		while (pid != null) {
			UionPKId uPK = new UionPKId(pid, pk.getOwnerId());
			ChartOfAccount parentChartOfAccount = (ChartOfAccount) dao.getObject(ChartOfAccount.class, uPK,
					LockMode.UPGRADE_NOWAIT);

			parentChartOfAccount.setCreditAmt(parentChartOfAccount.getCreditAmt().subtract(credit));
			parentChartOfAccount.setDebitAmt(parentChartOfAccount.getDebitAmt().subtract(debit));
			parentChartOfAccount.setBalance(parentChartOfAccount.getBalance().subtract(balance));
			parentChartOfAccount.setIniValue(parentChartOfAccount.getIniValue().subtract(iniValue));
			dao.update(parentChartOfAccount);
			pid = parentChartOfAccount.getParentId();
			n++;
			if (parentChartOfAccount.getId().equals(pid) || n > 10)
				break;
		}

		dao.update(chartOfAccount);
		logger.info("end updateCurrentValueWithParent:[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<ClientInfoForBssVo> getallClientInfoForBss(BasePagerObject ClientInfoCondition, Long owenrId) {
		String conStr = HsqlUtil.getConditionHqlStr(ClientInfoCondition, new StringBuilder());
		String sql = "SELECT t.id,t.number,t.customerFlag,t.vendorType,t.customerTermValue,t.vendorTermValue,t.isBsscreate,u.name,en.shortName,t.orderFlag,'enterprise' type "
				+ "			FROM t_crm_client_info t  " + "			LEFT JOIN t_crm_enterprise_info en ON  "
				+ "				t.userInfo_id = en.id " + "			LEFT JOIN t_crm_user_info u ON  "
				+ "				t.userInfo_id = u.id " + "			WHERE t.ownerId	=" + owenrId
				+ " AND t.userInfo_id = en.id AND u.name <> '不匹配' " + conStr + "		UNION ALL "
				+ "		SELECT t.id,t.number,t.customerFlag,t.vendorType,t.customerTermValue,t.vendorTermValue,t.isBsscreate,u.name,'' shortName,t.orderFlag,'person' type   "
				+ "			FROM t_crm_client_info t  " + "			LEFT JOIN t_crm_person_info en ON  "
				+ "				t.userInfo_id = en.id " + "			LEFT JOIN t_crm_user_info u ON  "
				+ "				t.userInfo_id  = u.id " + "			WHERE t.ownerId	=" + owenrId
				+ " AND t.userInfo_id = en.id AND u.name <> '不匹配' " + conStr;
		List<ClientInfoForBssVo> listvo = dao.getLst4PagingWithSQL(sql,
				new int[] { ClientInfoCondition.getPagenum(), ClientInfoCondition.getPagesize() });
		List<ClientInfoForBssVo> list = new ArrayList<ClientInfoForBssVo>();
		for (Object rsArray : listvo) {
			ClientInfoForBssVo vo = new ClientInfoForBssVo((Object[]) rsArray);
			list.add(vo);
		}
		Long count = dao.getCount4PagingWithSQL(
				"select count(distinct t.id) FROM t_crm_client_info t LEFT JOIN t_crm_enterprise_info en ON t.userInfo_id = en.id"
						+ " LEFT JOIN t_crm_user_info u ON  t.userInfo_id = u.id WHERE t.ownerId	=" + owenrId
						+ " AND t.userInfo_id = en.id AND u.name <> '不匹配' " + conStr);
		Long count1 = dao.getCount4PagingWithSQL(
				"select count(distinct t.id)  FROM t_crm_client_info t LEFT JOIN t_crm_person_info en ON t.userInfo_id = en.id"
						+ " LEFT JOIN t_crm_user_info u ON  t.userInfo_id = u.id WHERE t.ownerId	=" + owenrId
						+ " AND t.userInfo_id = en.id AND u.name <> '不匹配' " + conStr);
		count = count + count1;
		BaseModelList<ClientInfoForBssVo> lists = new BaseModelList<ClientInfoForBssVo>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean importXlsEnterpriseInfo(Attachment file, Long ownerId) throws IOException {
		String today = DateUtil.format(new Date(), "yyyyMMdd");
		DataHandler dh = file.getDataHandler();

		FileInfo fileInfo = new FileInfo();

		fileInfo.setShowName(StringUtil.fileNameToUTF_8(dh.getName()));

		fileInfo.setFilePath(SystemConfig.getSysProperty("sys.filePath.basic") + File.separatorChar + ownerId
				+ File.separatorChar + DateUtil.format(new Date(), "yyyyMMdd") + File.separatorChar);

		fileInfo.setFileName(this.getUuId((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME), 10));
		String filename = fileInfo.getShowName();
		System.out.println(System.currentTimeMillis() + "，文件格式检验");
		if (!(filename.substring(filename.length() - 3, filename.length()).equals("xls")
				|| filename.substring(filename.length() - 4, filename.length()).equals("xlsx")
				|| filename.substring(filename.length() - 4, filename.length()).equals("xlsm"))) {
			throw new OperationException("文件格式错误!");
		}

		Long lisf = dao.getCount4PagingWithSQL("SELECT count(o.id) from t_bss_order o , t_crm_owner owner "
				+ "WHERE o.ownerId = owner.id and ( o.payStatus='paid' or o.payStatus='give' or o.payStatus='offline' ) and o.ownerId="
				+ ownerId);
		if (lisf == 0) {
			throw new OperationException("该用户还没购买产品，请先去购买！");
		} else {
			Long countt = dao
					.getCount4PagingWithSQL("select count(id) from t_bss_billing_product_permission where ownerId = "
							+ ownerId + " and endDate>now()");
			if (countt == 0) {
				throw new OperationException("该用户购买产品已到期，请续费！");
			}
		}

		// 查询该用户是否可以有期初预收 期初应收 期初预付 期初应付
		Long count = dao.getCount4Paging("select count(id) from AccountPeriod where ownerId = " + ownerId
				+ " and accountPeriodStatus = 'closed' ");
		Boolean balance = false;
		if (count == 0L) {
			balance = true;
		}
		List ownerUsername = dao.executeQuerySql("select o.loginId from t_crm_owner o where o.id =" + ownerId, null);
		InputStream ins = dh.getInputStream();
		List userlist = dao.executeQuerySql("select u.name from t_crm_client_info t  left join t_crm_user_info u on "
				+ " u.id = t.userInfo_id where t.ownerId = " + ownerId, null);
		HSSFWorkbook wb = new HSSFWorkbook(ins);
		HSSFSheet sheet = wb.getSheet("导入客户");
		for (int i = 0; i <= sheet.getLastRowNum(); i++) {

			HSSFRow row = sheet.getRow(i); // 获取第i+1行
			if (null == row) {
				break;
			}

			for (int j = 0; j < 5; j++) {
				if (null != row.getCell(j)) {
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				} else {
					row.createCell(j);
					row.getCell(j).setCellValue("");
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				}
			}
			if (!row.getCell(0).getStringCellValue().equals("")) {
				if ((row.getCell(0).getStringCellValue().equals("编号")
						|| row.getCell(0).getStringCellValue().substring(0, 1).equals("*"))) {
					continue;
				}
			}

			if (row.getCell(3).getStringCellValue().equals("")) {
				break;
			}
			ClientInfoListVo u1 = new ClientInfoListVo();
			for (Object user : userlist) {
				if (user.toString().trim().equals(row.getCell(3).getStringCellValue().trim())) {
					throw new OperationException("第" + (i + 1) + "行客户/供应商名称重复！");

				}
			}

			u1.setName(row.getCell(3).getStringCellValue().trim());
			userlist.add(u1);
			ClientInfo ci = new ClientInfo();
			ci.setOwnerId(ownerId);

			if (row.getCell(0).getStringCellValue().equals("")) {
				ci.setNumber(null);
			} else {
				ci.setNumber(row.getCell(0).getStringCellValue());
			}

			// if (row.getCell(1).getStringCellValue().equals("") &&
			// row.getCell(2).getStringCellValue().equals("")) {
			// throw new OperationException("请检查第" + (i + 1) + "行账期信息完整性！");
			// }
			if (!(row.getCell(1).getStringCellValue().equals("") && row.getCell(2).getStringCellValue().equals(""))) {
				if (!row.getCell(1).getStringCellValue().equals("")) {
					ci.setCustomerFlag(true);
					ci.setCustomerTermValue(Long.parseLong(row.getCell(1).getStringCellValue()));
				} else {
					ci.setCustomerFlag(false);
				}

				if ((!row.getCell(2).getStringCellValue().equals(""))) {
					ci.setVendorType(true);
					ci.setVendorTermValue(Long.parseLong(row.getCell(2).getStringCellValue()));
				} else {
					ci.setVendorType(false);
				}
			} else {
				throw new OperationException("第" + (i + 1) + "行客户账期和供应商账期不能同时为空！");

			}
			ci.setOwnerId(ownerId);
			List<ClientBank> cbList = new ArrayList<ClientBank>();
			ClientBank cb = new ClientBank();
			cb.setOwnerId(ownerId);
			cbList.add(cb);
			ci.setClientBanks(cbList);
			try {
				EnterpriseInfo enterpriseInfo = new EnterpriseInfo();
				enterpriseInfo.setName(row.getCell(3).getStringCellValue());
				enterpriseInfo.setShortName(row.getCell(4).getStringCellValue());
				enterpriseInfo.setOwnerId(ownerId);
				enterpriseInfo.setCreateBy(ownerUsername.get(0).toString());
				ci.setCreateBy(ownerUsername.get(0).toString());
				ci.setUserInfo(enterpriseInfo);
				ci.setIsBsscreate(true);
				ClientAccount ca = new ClientAccount();
				ca.setOwnerId(ownerId);
				ca.setCreateBy(ownerUsername.get(0).toString());
				ca.setClientInfo(ci);
				dao.save(ca);
				dao.save(enterpriseInfo);
				dao.save(ci);
			} catch (DataIntegrityViolationException e) {
				throw new OperationException("导入失败,第" + (i + 1) + "行编号重复！！");
			}
		}
		return null;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean createClientInfoAndUserInfo(ClientInfo clientInfo) {
		logger.info("begin createClientInfoAndUserInfo.");
		if (clientInfo.getNumber().equals("")) {
			clientInfo.setNumber(null);
		}
		boolean b = false;
		Long lisf = dao.getCount4PagingWithSQL("SELECT count(o.id) from t_bss_order o , t_crm_owner owner "
				+ "WHERE o.ownerId = owner.id and ( o.payStatus='paid' or o.payStatus='give' or o.payStatus='offline' or o.payStatus='tryout') and o.ownerId="
				+ clientInfo.getOwnerId());
		if (lisf == 0) {
			throw new OperationException("该用户还没购买产品，请先去购买！");
		} else {
			Long countt = dao
					.getCount4PagingWithSQL("select count(id) from t_bss_billing_product_permission where ownerId = "
							+ clientInfo.getOwnerId() + " and endDate>now()");
			if (countt == 0) {
				throw new OperationException("该用户购买产品已到期，请续费！");
			}
		}
		List<ClientInfo> ciList = dao.find("from ClientInfo where ownerId = " + clientInfo.getOwnerId());
		for (ClientInfo ci : ciList) {
			if (ci.getUserInfo().getName().equals(clientInfo.getUserInfo().getName())) {
				throw new OperationException("客户、供应商名称不可重复，请修改名称后再试！");
			}
			if (ci.getNumber() != null && clientInfo.getNumber() != null
					&& ci.getNumber().equals(clientInfo.getNumber())) {
				throw new OperationException("编码重复，请重新填写！");
			}
		}
		List<ClientBank> li = new ArrayList<ClientBank>();
		ClientBank cb = new ClientBank();
		cb.setBankName("");
		cb.setOwnerId(clientInfo.getOwnerId());
		li.add(cb);
		clientInfo.setClientBanks(li);
		UserInfo userInfo = clientInfo.getUserInfo();
		List<Address> alist = userInfo.getAddress();
		logger.info("begin save UserInfo by userInfo ");
		UserInfo ui = (UserInfo) dao.save(userInfo);
		// logger.info("end save UserInfo by userInfo.[ id =" +
		// WebUtil.getLogBasicString() + "]");

		logger.info("begin save ClientInfo by clientInfo");
		ClientInfo ci = (ClientInfo) dao.save(clientInfo);
		// logger.info("end save ClientInfo by clientInfo.[ id =" +
		// WebUtil.getLogBasicString() + "]");

		logger.info("begin save ClientInfo by clientInfo");
		ClientAccount clientAccount = new ClientAccount();
		clientAccount.setOwnerId(ci.getOwnerId());
		clientAccount.setCreateBy(ci.getCreateBy());
		clientAccount.setCreateDate(ci.getCreateDate());
		clientAccount.setClientInfo(ci);
		ClientAccount client = (ClientAccount) dao.save(clientAccount);
		// 根据情况判断是否新增prepay
		logger.info("end  save ClientInfo by clientInfo.[ id =" + WebUtil.getLogBasicString() + "]");

		if (userInfo instanceof EnterpriseInfo) {

			EnterpriseInfo ei = (EnterpriseInfo) userInfo;

			if (ei.getPersonInfos() != null) {
				List<PersonInfo> list = new ArrayList<PersonInfo>();
				for (PersonInfo p : list) {
					dao.save(p);
				}
			}
		}

		if (ci != null) {
			b = true;
		}
		logger.info("end createClientInfoAndUserInfo.[ id =" + WebUtil.getLogBasicString() + "]");
		return b;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateClientInfoAndUserInfo(ClientInfo clientInfo) {
		ClientInfo ci = (ClientInfo) dao.getObject(ClientInfo.class, clientInfo.getId());

		Long lisf = dao.getCount4PagingWithSQL("SELECT count(o.id) from t_bss_order o , t_crm_owner owner "
				+ "WHERE o.ownerId = owner.id and ( o.payStatus='paid' or o.payStatus='give' or o.payStatus='offline' or o.payStatus='tryout') and o.ownerId="
				+ clientInfo.getOwnerId());
		if (lisf == 0) {
			throw new OperationException("该用户还没购买产品，请先去购买！");
		} else {
			Long countt = dao
					.getCount4PagingWithSQL("select count(id) from t_bss_billing_product_permission where ownerId = "
							+ clientInfo.getOwnerId() + " and endDate>now()");
			if (countt == 0) {
				throw new OperationException("该用户购买产品已到期，请续费！");
			}
		}
		clientInfo.setCreateDate(ci.getCreateDate());
		if (clientInfo.getNumber().equals("")) {
			clientInfo.setNumber(null);
		}
		List<ClientInfo> ciList = dao.find("from ClientInfo where ownerId = " + clientInfo.getOwnerId());
		for (ClientInfo cidd : ciList) {
			if (cidd.getUserInfo().getName().equals(clientInfo.getUserInfo().getName())
					&& !cidd.getId().equals(clientInfo.getId())) {
				throw new OperationException("客户、供应商名称不可重复，请修改名称后再试！");
			}
			if (cidd.getNumber() != null && clientInfo.getNumber() != null
					&& cidd.getNumber().equals(clientInfo.getNumber()) && !cidd.getId().equals(clientInfo.getId())) {
				throw new OperationException("编码重复，请重新填写！");
			}
		}
		UserInfo user = null;
		if ((clientInfo.getUserInfo() instanceof EnterpriseInfo && ci.getUserInfo() instanceof EnterpriseInfo)
				|| (clientInfo.getUserInfo() instanceof PersonInfo && ci.getUserInfo() instanceof PersonInfo)) {
			clientInfo.getUserInfo().setId(ci.getUserInfo().getId());
		} else {
			Long idd = ci.getUserInfo().getId();
			ci.setUserInfo(null);
			dao.update(ci);
			dao.flush();
			dao.removeObject(UserInfo.class, idd);
			user = (UserInfo) dao.save(clientInfo.getUserInfo());
			dao.flush();
			clientInfo.setUserInfo(user);
		}
		dao.update(clientInfo);
		dao.update(clientInfo.getUserInfo());
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteClientInfoAndUserInfo(Long id, Long ownerId) {
		ClientInfo ci = (ClientInfo) dao.getObject(ClientInfo.class, id);
		Long lisf = dao.getCount4PagingWithSQL("SELECT count(o.id) from t_bss_order o , t_crm_owner owner "
				+ "WHERE o.ownerId = owner.id and ( o.payStatus='paid' or o.payStatus='give' or o.payStatus='offline' or o.payStatus='tryout' ) and o.ownerId="
				+ ownerId);
		if (lisf == 0) {
			throw new OperationException("该用户还没购买产品，请先去购买！");
		} else {
			Long countt = dao
					.getCount4PagingWithSQL("select count(id) from t_bss_billing_product_permission where ownerId = "
							+ ownerId + " and endDate>now()");
			if (countt == 0) {
				throw new OperationException("该用户购买产品已到期，请续费！");
			}
		}
		if (!ci.getIsBsscreate() == true)
			throw new OperationException("删除对象不能删除！");
		List<ClientAccount> ca = dao.find("from ClientAccount where clientInfo.id =" + id + " and ownerId= " + ownerId);
		dao.removeObject(ClientAccount.class, ca.get(0).getId());
		dao.removeObject(ClientInfo.class, id);
		return true;
	}

	@Override
	public void exportFile(HttpServletRequest request, HttpServletResponse response, String fileName, String query)
			throws IOException {
		logger.info("begin exportFile.");
		// 获取网站部署路径(通过ServletContext对象)，用于确定下载文件位置，从而实现下载
		ServletContext servletContext = request.getSession().getServletContext();
		String path = servletContext.getRealPath("/");
		// 通过文件路径获得File对象(假如此路径中有一个download.pdf文件)
		byte[] buffer = null;
		FileInputStream fis = null;
		ByteArrayOutputStream bos = null;
		try {
			File file;
			String fileAllName = "";
			if (fileName.equals("商务贷款申请")) {
				fileAllName = fileName + ".docx";
			} else if (fileName.equals("客户信息导入模板") || fileName.equals("商务贷款资料")) {
				fileAllName = fileName + ".zip";
			} else {
				fileAllName = fileName + ".xls";
			}
			file = new File(path + "template/" + fileAllName);

			fis = new FileInputStream(file);
			bos = new ByteArrayOutputStream();
			byte[] b = new byte[1024];
			int n;
			while ((n = fis.read(b)) != -1) {
				bos.write(b, 0, n);
			}
			this.excelExport(request, response, fileName, bos);
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (fis != null)
				fis.close();
			if (bos != null)
				bos.close();
		}

		logger.info("end exportFile.");
	}

	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public void excelExport(HttpServletRequest request, HttpServletResponse response, String fileName,
			ByteArrayOutputStream os) throws IOException {

		byte[] content = os.toByteArray();
		InputStream is = new ByteArrayInputStream(content);
		// 设置response参数，可以打开下载页面
		response.reset();
		response.setContentType("application/vnd.ms-excel;charset=utf-8");
		String agent = request.getHeader("User-Agent");
		boolean isMSIE = (agent != null && (agent.indexOf("MSIE") != -1 || agent.indexOf("rv:") != -1)
				&& agent.indexOf("Firefox") == -1);

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

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<BasicFileInfo> getBasicFileInfo(String ids) {
		logger.info("begin getFileInfoList.");
		List<BasicFileInfo> list = dao.getObjects(BasicFileInfo.class, CollectionUtils.arrayToList(ids.split(",")));
		logger.info("end  getFileInfoList:[ id =" + WebUtil.getLogBasicString() + "]");
		return list;
	}
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<ClientInfoVo> getAllClientInfoVO(String flag,Long ownerId) {
		logger.info("begin getAllClientInfoVO.");
//		createUnknowClientInfo();
		String hql = "select new com.zqw.bss.vo.common.ClientInfoVo(clientInfo.id,userInfo.id,userInfo.name,"
				+ "clientInfo.customerFlag,clientInfo.vendorType,clientInfo.customerTermValue,clientInfo.vendorTermValue)"
				+ " from UserInfo userInfo, ClientInfo clientInfo "
				+ " where clientInfo.userInfo.id= userInfo.id and  " + " clientInfo.ownerId = " + ownerId;

		if (flag.equals("Y")) {
			String hql1 = "  and clientInfo.available = 'Y'  and clientInfo.customerFlag = 'Y' ";//+" order by clientInfo.available DESC"
			List<ClientInfoVo> list = dao.find(hql + hql1);
			return list;
		} else if (flag.equals("N")) {
			String hql2 = " and clientInfo.vendorAvailable = 'Y' and  clientInfo.vendorType = 'Y' ";//+" order by clientInfo.available DESC "
			List<ClientInfoVo> list = dao.find(hql + hql2);
			return list;
		}
		String shql = "select new com.zqw.bss.vo.common.ClientInfoVo(clientInfo.id,userInfo.id,userInfo.name,"
				+ "clientInfo.customerFlag,clientInfo.vendorType,clientInfo.customerTermValue,clientInfo.vendorTermValue)"
				+ " from UserInfo userInfo, ClientInfo clientInfo , ClientAccount ca "
				+ " where clientInfo.userInfo.id= userInfo.id and  clientInfo.id = ca.clientInfo.id and clientInfo.ownerId = " + ownerId;
		
		if(flag.equals("SY")){
			String shql1 = " and (clientInfo.available = 'Y' or (ca.salesPayableAmt <> 0 and clientInfo.available = 'N')) and clientInfo.customerFlag = 'Y' ";
			List<ClientInfoVo> list = dao.find(shql + shql1);
			return list;
		}else if(flag.equals("PN")){
			String shql1 = " and (clientInfo.vendorAvailable = 'Y' or (ca.purchasePayableAmt <> 0 and clientInfo.vendorAvailable = 'N')) and clientInfo.vendorType = 'Y' ";
			List<ClientInfoVo> list = dao.find(shql + shql1);
			return list;
		}

		logger.info("end getAllClientInfoVO.[ id =" + WebUtil.getLogBasicString() + "]");
		return null;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public StringBuffer importXlsPotential(Long importLogId, Attachment file) throws IOException {
		StringBuffer logGet = new StringBuffer();
		List<User> user = dao.find(
				" from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		Set<String> roles = (Set<String>) SessionUtil
				.get(SystemConstant.SESSION_KEY_USER_ROLES);

		Long userId = user.get(0).getId();
		
		DataHandler dh = file.getDataHandler();

		FileInfo fileInfo = new FileInfo();

		fileInfo.setShowName(StringUtil.fileNameToUTF_8(dh.getName()));

		fileInfo.setFilePath(SystemConfig.getSysProperty("sys.filePath.basic") + File.separatorChar + userId
				+ File.separatorChar + DateUtil.format(new Date(), "yyyyMMdd") + File.separatorChar);

		fileInfo.setFileName(this.getUuId((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME), 10));

		// 用于存放当前文件用户名集合
		List<String> loginIdList = new ArrayList<>();

		InputStream ins = dh.getInputStream();

		// 开始行定位
		int StartNum = 0;
		HSSFWorkbook wb = new HSSFWorkbook(ins);
		HSSFSheet sheet = wb.getSheetAt(0); // 第一个工作表
		for (int i = 0; i < sheet.getPhysicalNumberOfRows(); i++) {

			HSSFRow row = sheet.getRow(i); // 获取第i+1行
			// try{
			// 如果中间又空行则提示错误
			if (row == null)
				throw new OperationException("第" + (i + 1) + "行数据为空！");
			
			for (int j = 0; j < 9; j++) {
				if (row.getCell(j) != null) {
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				} else {
					row.createCell(j);
					row.getCell(j).setCellValue("");
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				}
			}
			Potential po = new Potential();
			User us = new User();
			if(user.size()>0){
				us.setId(user.get(0).getId());
			}
			List<User> userList = new ArrayList<User>();
			List<User> userLists = new ArrayList<User>();
			userList.add(us);
			List<Address> addressList = new ArrayList<Address>();
			Address addr = new Address();
			addressList.add(addr);
			if(!roles.contains("Sys_Admin")){
				if(roles.contains("salesManage")||roles.contains("secondLevelSalesManage")||roles.contains("salesStaff")){
					po.setSal(userList);
					po.setCustom(userLists);
				}
				if(roles.contains("customerManage")||roles.contains("secondLevelCustomerManage")||roles.contains("customerService")){
					po.setCustom(userList);
					po.setSal(userLists);
				}
				if(roles.contains("agentistrator")){
					SalesAgent sa = new SalesAgent();
					List id = dao.executeQuerySql("select id from t_bss_agent where userInfo_id = "+user.get(0).getUserInfo().getId(), null);
					List idsal = dao.executeQuerySql("select sales_id from t_bss_agent where userInfo_id = "+user.get(0).getUserInfo().getId(), null);
					if(id.size()>0)
						sa.setId(Long.valueOf(id.get(0).toString()));
					po.setSalesAgent(sa);
					if(idsal.size()>0){
						List<User> userListss= new ArrayList<User>();
						po.setCustom(userListss);
						User uss = new User();
						uss.setId(Long.valueOf(idsal.get(0).toString()));
						userLists.add(uss);
						po.setSal(userLists);
					}else{
						po.setCustom(userLists);
					}
				}
			}else{
				po.setCustom(userLists);
				po.setSal(userList);
			}
			if(row.getCell(0).toString().length()>0){
				if ((row.getCell(0).getStringCellValue().equals("创建日期")
						|| row.getCell(0).getStringCellValue().substring(0, 1).equals("*"))) {
					continue;
				}
			}
			if(row.getCell(0) == null || row.getCell(0).getStringCellValue().equals("")){
				po.setCreateDate(new Date());
			}else{
				Calendar c = new GregorianCalendar(1900, 0, -1);
				Date d = c.getTime();
				po.setClosingDate(DateUtils.addDays(d, Integer.parseInt(row.getCell(0).getStringCellValue())));
			}
			if (row.getCell(1) == null || row.getCell(1).getStringCellValue().equals("")) {
				throw new OperationException("第" + (i + 2) + "潜在客户名不能为空！");
			}else{
				po.setPotentialName(row.getCell(1).getStringCellValue());
			}
			if (row.getCell(3) == null || row.getCell(3).getStringCellValue().equals("")) {
				throw new OperationException("第" + (i + 4) + "公司名名不能为空！");
			}else{
				po.setContact(row.getCell(3).getStringCellValue());
			}
			if (row.getCell(2) == null || row.getCell(2).getStringCellValue().equals("")) {
				throw new OperationException("第" + (i + 3) + "电话号码不能为空！");
			}else{
				po.setPhone(row.getCell(2).getStringCellValue());
			}
			if (row.getCell(4) == null || row.getCell(4).getStringCellValue().equals("")) {
				po.setClosingDate(new Date());
			}else{
				Calendar c = new GregorianCalendar(1900, 0, -1);
				Date d = c.getTime();
				po.setClosingDate(DateUtils.addDays(d, Integer.parseInt(row.getCell(4).getStringCellValue())));
			}
			if(row.getCell(5) == null || row.getCell(5).getStringCellValue().equals("")){
			}else{
				SalesAgent sa = new SalesAgent();
				List id = dao.executeQuerySql("select id from t_bss_agent where agentName = '"+row.getCell(5).getStringCellValue()+"'", null);
				if(id.size()>0){
					sa.setId(Long.valueOf(id.get(0).toString()));
					po.setSalesAgent(sa);
				}
			}
			if(row.getCell(6) == null || row.getCell(6).getStringCellValue().equals("")){
			}else{
				List<User> userListsales = new ArrayList<User>();
				User ussales = new User();
				List id = dao.executeQuerySql("select id from t_bss_sys_user where username = '"+row.getCell(6).getStringCellValue()+"'", null);
				if(id.size()>0){
					ussales.setId(Long.valueOf(id.get(0).toString()));
					userListsales.add(ussales);
					po.setSal(userListsales);
				}
			}
			if(row.getCell(7) == null || row.getCell(7).getStringCellValue().equals("")){
			}else{
				List<User> userListcustomer = new ArrayList<User>();
				User uscustomer = new User();
				List id = dao.executeQuerySql("select id from t_bss_sys_user where username = '"+row.getCell(7).getStringCellValue()+"'", null);
				if(id.size()>0){
					uscustomer.setId(Long.valueOf(id.get(0).toString()));
					userListcustomer.add(uscustomer);
					po.setCustom(userListcustomer);
				}
			}
			potentialService.savePotential(po);
		}
		return logGet;
	}

	@Override
	public void exportUser(HttpServletRequest request, HttpServletResponse response, String query) {
		logger.info("start exportUser.");
		List<Map<String, Object>> listmap = new ArrayList<Map<String, Object>>();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("sheetName", "用户");
		listmap.add(map);
		logger.info("begin exportUser.");
		List<User> userList = userService.getUsers();
		Map<String, String> userMap = new HashMap<String, String>();
			if(userList.size()>5000){
				throw new OperationException("超出单次导出限制，员工数量数量需小于5000才可以导出，如有疑问请联系客服。");
			}
		for (User user : userList) {
			userMap.put(user.getUsername(), user.getUserInfo().getName());
		}
		
		String fileName = "用户" + getDate();
		String columnNames[] = { "用户名", "密码（需手动填写）", "姓名", "性别", "手机号码", "电子邮箱", "角色", "是否禁用", "创建人", "创建日期" };// 列名
		String keys[] = { "username", "psw", "name", "salutation", "telephone", "email", "roleNameCN", "locked",
				"createBy", "createDate" };// map中的key
		String request4pager = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request4pager);

		bso.setPagesize(Integer.valueOf("999999999"));
		Condition con = new Condition();
		con.setAction("eq");
		con.setKey("users.ownerId");
		String[] str = new String[] { String.valueOf(SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID)) };
		con.setValue(str);
		bso.condition.add(con);
		BaseModelList<SearchUserListVo> list = userService.findUsers(bso);
		List<SearchUserListVo> SearchUserListVoList = list.getRows();
		for (SearchUserListVo searchUserListVo : SearchUserListVoList) {
			Map<String, Object> mapValue = new HashMap<String, Object>();
			mapValue.put("username", searchUserListVo.getUsername());
			mapValue.put("name", searchUserListVo.getName());
			mapValue.put("salutation",
					searchUserListVo.getSalutation() != null ? searchUserListVo.getSalutation() : "");
			mapValue.put("telephone", searchUserListVo.getTelephone());
			mapValue.put("email", searchUserListVo.getEmail());
			mapValue.put("roleNameCN", searchUserListVo.getRoleNameCN());
			mapValue.put("locked", searchUserListVo.getLocked() == true ? "是" : "否");
			mapValue.put("createBy", userMap.get(searchUserListVo.getCreateBy()));
			mapValue.put("createDate", searchUserListVo.getCreateDate());
			// mapValue.put("psw",PasswordHelper.decrypt(userService.getUserById(searchUserListVo.getUserid()).getPassword())
			// );

			listmap.add(mapValue);
		}
		try {
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			ExcelUtil.createWBUser(listmap, keys, columnNames, null).write(os);
			excelExport(request, response, fileName, os);
		} catch (IOException e) {
			e.printStackTrace();
		}
		logger.info("end exportUser.");

	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public List<User> importUser(Attachment file) throws IOException {
		logger.info("begin importUser.");
		// (LinkedHashMap)file.getHeaders().get("m")
		Long ownerId = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_OWNER_ID);
		Date dt = new Date();
		Long time = dt.getTime();// 这就是距离1970年1月1日0点0分0秒的毫秒数

		String today = DateUtil.format(new Date(), "yyyyMMdd");
		DataHandler dh = file.getDataHandler();

		FileInfo fileInfo = new FileInfo();

		fileInfo.setShowName(StringUtil.fileNameToUTF_8(dh.getName()));

		fileInfo.setFilePath(SystemConfig.getSysProperty("sys.filePath.basic") + File.separatorChar + ownerId
				+ File.separatorChar + DateUtil.format(new Date(), "yyyyMMdd") + File.separatorChar);

		fileInfo.setFileName(this.getUuId((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME), 10));
		String filename = fileInfo.getShowName();
		System.out.println(System.currentTimeMillis() + "，文件格式检验");
		if (!filename.substring(filename.length() - 4, filename.length()).equals(".xls")) {
			throw new OperationException("文件格式错误!");
		}

		InputStream ins = dh.getInputStream();

		HSSFWorkbook wb = new HSSFWorkbook(ins);
		HSSFSheet sheet = wb.getSheet("用户");
		if (sheet == null) {
			throw new OperationException("导入失败,文件有误！");
		}
		List<User> list = new ArrayList<User>();
		List<Role> roleList = roleService.getAllRoleList();
		// 当前所有用户集合
		List<User> ownerList = dao.find("from User ");
		// 用于存放当前文件用户名集合
		List<String> loginIdList = new ArrayList<>();

		// 用户名规则
		String regEx = "(?!_)[a-zA-Z0-9_]+";
		Pattern pattern = Pattern.compile(regEx);
		for (int i = 0; i <= sheet.getPhysicalNumberOfRows(); i++) {

			HSSFRow row = sheet.getRow(i); // 获取第i+1行
			// try{
			// 如果中间又空行则提示错误
			if (row == null)
				// throw new OperationException("第" + (i + 1) + "行数据为空！");
				continue;
			Boolean emFlag = true;
			for (int j = 0; j < 8; j++) {
				if (row.getCell(j) != null) {
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
					if (!row.getCell(j).getStringCellValue().trim().equals("")) {
						emFlag = false;
					}
				} else {
					row.createCell(j);
					row.getCell(j).setCellValue("");
					row.getCell(j).setCellType(Cell.CELL_TYPE_STRING);
				}

			}
			if (emFlag) {
				continue;
			}
			if ((sheet.getRow(i).getCell(0).getStringCellValue().length() >= 2
					&& sheet.getRow(i).getCell(0).getStringCellValue().substring(0, 1).equals("*"))
					|| sheet.getRow(i).getCell(0).getStringCellValue().equals("用户名")) {
				continue;
			}
			User newUser = new User();
			PersonInfo personInfo = new PersonInfo();
			List<Role> roles = new ArrayList<Role>();
			// 判断开始循环的行
			if (!row.getCell(0).getStringCellValue().equals("")) {
				if (row.getCell(0).getStringCellValue().equals("用户名") && i == 0) {
					continue;

				}
			}
			// 如果用户姓名为空结束
			if (row.getCell(0) == null || row.getCell(0).getStringCellValue().equals("")) {
				throw new OperationException("第" + (i + 1) + "行用户名为空！");
				// break;
			} else {
				// 字符串是否与正则表达式相匹配
				if (!pattern.matcher(row.getCell(0).getStringCellValue()).matches())
					throw new OperationException("第" + (i + 1) + "行用户名格式不正确！");
			}

			// 用户名是否重复
			for (User o : ownerList) {
				if (o.getUsername().trim().toUpperCase()
						.equals(row.getCell(0).getStringCellValue().trim().toUpperCase())) {
					throw new OperationException("第" + (i + 1) + "行用户名已被使用，不可导入，请修改用户名！");
				}
			}

			// 判断用户名在自己表中是否重复
			for (String loginId : loginIdList) {
				if (loginId.trim().equals(row.getCell(0).getStringCellValue().trim())) {
					throw new OperationException("第" + (i + 1) + "行用户名在当前Excel表中重复出现！");
				}
			}

			// 将新的用户名添加到集合中
			loginIdList.add(row.getCell(0).getStringCellValue().trim());
			newUser.setUsername(row.getCell(0).getStringCellValue().trim());
			// 密码
			String psw = row.getCell(1).getStringCellValue().trim();
			if (!psw.equals("")) {
				newUser.setPassword(psw);
			} else {
				throw new OperationException("第" + (i + 1) + "行密码不能为空！");
			}
			if (psw.length() < 6 || psw.length() > 20) {
				throw new OperationException("第" + (i + 1) + "行密码长度必须为6-20位！");
			}
			// 姓名
			if (!row.getCell(2).getStringCellValue().equals("")) {
				personInfo.setName(row.getCell(2).getStringCellValue());
			} else {
				throw new OperationException("第" + (i + 1) + "行姓名不能为空！");
			}

			// 性别
			if (row.getCell(3).getStringCellValue().equals("")) {
				throw new OperationException("第" + (i + 1) + "行性别不能为空！");
			}
			if (row.getCell(3).getStringCellValue().equals("男") || row.getCell(3).getStringCellValue().equals("女")) {
				personInfo.setSalutation(row.getCell(3).getStringCellValue());
			} else {
				throw new OperationException("第" + (i + 1) + "行性别填写有误！");
			}

			// 手机号
			if (!row.getCell(4).getStringCellValue().equals("")) {
				personInfo.setTelephone(row.getCell(4).getStringCellValue());
			} else {
				throw new OperationException("第" + (i + 1) + "行手机号不能为空！");
			}

			// 邮箱
			String email = row.getCell(5).getStringCellValue().trim();
			if (!email.equals("")) {
				String check = "^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
				Pattern regex = Pattern.compile(check);
				Matcher matcher = regex.matcher(email);
				if (!matcher.matches()) {
					throw new OperationException("第" + (i + 1) + "行邮箱格式不正确！");
				}
				personInfo.setEmail(row.getCell(5).getStringCellValue());
			}

			// 角色
			if (!row.getCell(6).getStringCellValue().equals("")) {
				String item = row.getCell(6).getStringCellValue();
				Boolean flag = true;
				for (Role role : roleList) {
					if (item.equals(role.getRoleNameCN())) {
//						if (item.contains("老板") && row.getCell(7).getStringCellValue().equals("是")) {
//							throw new OperationException("第" + (i + 1) + "行，角色为老板时必须启用！");
//						}
						roles.add(role);
						flag = false;
					}
				}
				if (flag) {
					throw new OperationException("第" + (i + 1) + "行填写了不存在的角色名：" + item + "！");
				}
				newUser.setRoles(roles);
			}
			if (newUser.getRoles() == null || newUser.getRoles().size() == 0) {
				throw new OperationException("第" + (i + 1) + "行，请至少填写一个有效的角色名！");
			}
			newUser.setUserInfo(personInfo);
			// 启用禁用
			if (row.getCell(7).getStringCellValue().equals("是") || row.getCell(7).getStringCellValue().equals("否")) {
				newUser.setLocked(row.getCell(7).getStringCellValue().equals("是") ? true : false);
			} else {
				throw new OperationException("第" + (i + 1) + "行是否禁用填写有误！");
			}
			newUser.setEmployeeCode(this.getSystemCode("Usercode", 5, 0L));
			// try {
			
			newUser = userService.saveUser(newUser);
			if(newUser.getRoles().get(0).getId().toString().equals("2")){
				List<SalesAgent> listag = dao.find("from SalesAgent where agentName = '"+newUser.getUsername()+"'");
				if(listag.size()==0){
					SalesAgent salesAgent = new SalesAgent();
					salesAgent.setAgentCode(this.getSystemCode("AgentCode", 5, 0L));
					salesAgent.setAgentName(newUser.getUsername());
					salesAgent.setType("");
					salesAgent.setUser(newUser);
					salesAgent.setUserInfo(newUser.getUserInfo());
					salesAgent=salesAgentService.saveSalesAgent(salesAgent);
					salesAgent.setType("person");
					dao.update(salesAgent);
				}
			}
			list.add(newUser);
			// if (i % 100 == 0) {
			// dao.getHibSession().flush();
			// dao.getHibSession().clear();
			// }
			// } catch (DataIntegrityViolationException e) {
			// throw new OperationException("导入失败,第" + (i + 1) + "行编号重复！");
			// }

		}
		if (list.size() == 0) {
			throw new OperationException("导入失败,模板中信息为空！");
		}
		logger.info("end importUser.");
		return list;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<FileInfo> getFileInfo(String ids) {
		logger.info("begin getFileInfoList.");
		List<FileInfo> list = dao.getObjects(FileInfo.class, CollectionUtils.arrayToList(ids.split(",")));
		logger.info("end  getFileInfoList:[ id =" + WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	@Transactional(readOnly=true,propagation=Propagation.REQUIRED)
	public Boolean getPermissionVip(Long ownerId) {
		List  list =  dao.executeQuerySql("select t.permission from t_bss_billing_product_permission t"
							+ " where  t.endDate>=now() and now()>=t.startDate and t.permission ='simple:sys:vip' and owner ="+ownerId, null);
		if(list.size()>0){
			return true;
		}else{
			return false;
		}
	}
	
}