
package com.zqw.bss.service.remote.crm.impl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.shiro.cache.CacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.util.StringUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PayRemark;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.sys.AcUser;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.crm.OwnerService;
import com.zqw.bss.service.remote.crm.RemoteOwnerService;
import com.zqw.bss.service.sys.UserService;
import com.zqw.bss.util.HttpSender;
import com.zqw.bss.util.SmsTools;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.crm.OwnerInfoVo;
import com.zqw.bss.vo.crm.UserInfoForListVO;
import com.zqw.bss.vo.sys.OwnerDetailsVo;
import com.zqw.bss.vo.sys.OwnerInformationVo;
import com.zqw.bss.vo.sys.SearchOwnerListvo;

public class RemoteOwnerServiceImpl implements RemoteOwnerService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	protected DAO dao;

	@Autowired
	private OwnerService ownerService;

	@Autowired
	private UserService userService;

	@Autowired
	private CacheManager cacheManager;

	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}

	@Override
	public Boolean getUserInfoById(String loginId) {
		logger.info("begin getUserInfoById. id  = [" + loginId + "]");
		if (userService.getSimpleUserByUsername(loginId) != null) {
			Boolean boo = true;
			logger.info("end  getUserInfoById:[ id =" + WebUtil.getLogBasicString() + "]");
			return boo;
		} else {
			Boolean boo = false;
			logger.info("end  getUserInfoById:[ id =" + WebUtil.getLogBasicString() + "]");
			return boo;
		}
	}

	@Override
	public Owner getOwner(Long ownerId) {
		logger.info("begin getOwner. id = [" + ownerId + "]");
		return ownerService.getOwner(ownerId);
	}

	@Override
	public BaseModelList<OwnerInfoVo> getOwnerInfoVoAll(BasePagerObject condition) {
		logger.info("begin getOwnerInfoVoAll");
		return ownerService.getOwnerInfoVoAll(condition);
	}

	@Override
	public String getPhoneByUsername(String username) {
		StringBuffer sbf = new StringBuffer();
		logger.info("begin getUserByUsername.");
		User user = (User) WebUtil.getEntryFromProxyObj(userService.getUserByUsername(username), dao);
		String str = "";
		if (null != user) {
			String telephone = user.getUserInfo().getTelephone();
			sbf.append(telephone.substring(0, 3));
			sbf.append(telephone.substring(8));
			str = sbf.toString();
			logger.info("end  getPhoneByUsername:[ id =" + WebUtil.getLogBasicString() + "]");
			return str;
		} else
			throw new OperationException("系统中不存在该用户!");
	}

	private boolean vailMsgCodeTime(String cacheKey) {
		logger.info("begin vailMsgCodeTime");
		Date timecacheVale = (Date) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + cacheKey + "time");
		if (timecacheVale == null) {
			return true;
		}
		Date now = new Date();
		long time = (now.getTime() - timecacheVale.getTime()) / 1000;
		if (time > 60) {
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey + "time");
			logger.info("end vailMsgCodeTime");
			return true;
		}
		logger.info("end vailMsgCodeTime");
		return false;
	}

	@Override
	public Boolean getVaildCode(String uname, Long count) throws Exception {
		logger.info("begin getVaildColdByPhone. id  = [" + uname + "]");
		ipLimit();
		User user = (User) WebUtil.getEntryFromProxyObj(userService.getUserByUsername(uname), dao);
		if (null != user) {
			String phone = user.getUserInfo().getTelephone();
			if (StringUtil.isNotEmpty(phone)) {
				// 60秒内只可获取一次验证码
				if (!this.vailMsgCodeTime(phone)) {
					throw new OperationException("60秒内只可获取一次验证码");
				}
				this.createMsgVaildCode(phone, count);
				logger.info("end  getVaildColdByPhone:[ id =" + WebUtil.getLogBasicString() + "]");
				return true;
			} else
				throw new OperationException("系统中不存在该用户!");
		} else
			throw new OperationException("系统中不存在该用户!");
	}

	@Override
	public Boolean updateUserPwd(String valid, String uname, String pass) throws Exception {
		logger.info("begin updateUserPwd.");
		User user = (User) WebUtil.getEntryFromProxyObj(userService.getUserByUsername(uname), dao);
		String tel = user.getUserInfo().getTelephone();
		// 验证码五分钟失效
		Date timecacheVale = (Date) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + tel + "time");
		if (timecacheVale != null) {
			Date now = new Date();
			long time = (now.getTime() - timecacheVale.getTime()) / 1000;
			if (time > 300) {
				cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + tel);
				throw new OperationException("验证码已失效");
			}
		}
		if (this.vaildForgetMsgCode(valid, tel)) {
			Boolean boo = userService.changePasswordByName(user.getUsername(), pass);
			logger.info("end  updateUserPwd.:[ id =" + WebUtil.getLogBasicString() + "]");
			return boo;
		} else
			throw new OperationException("输入的验证码跟系统参数的不一致");
	}

	private boolean createMsgVaildCode(String cacheKey, Long count) throws Exception {
		logger.info("begin createMsgVaildCode");
		String cacheValue = null;
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getRequest();
		String ip = WebUtil.getIpAddr(request);
		if (count % 2 == 0) {
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey + "forget");
			cacheValue = SmsTools.templateSMS(cacheKey);
		} else {
			cacheValue = HttpSender.getMsg(cacheKey, count);
		}
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + cacheKey + "forget",
				cacheValue);
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + cacheKey + "time", new Date());
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + ip + "time", new Date());
		logger.info("end createMsgVaildCode");
		return true;
	}
	
	

	private boolean vaildForgetMsgCode(String tragetValue, String cacheKey) {
		logger.info("begin vaildForgetMsgCode");
		String cacheVale = (String) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + cacheKey + "forget");
		if (tragetValue.equals(cacheVale)) {
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey + "forget");
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey + "time");
			logger.info("end vaildForgetMsgCode");
			return true;
		}
		logger.info("vaildForgetMsgCode");
		return false;
	}

	public void ipLimit() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getRequest();
		String ip = WebUtil.getIpAddr(request);

		Date timecacheVale = (Date) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + ip + "time");
		if (timecacheVale != null) {
			Date now = new Date();
			long time = (now.getTime() - timecacheVale.getTime()) / 1000;
			if (time > 60) {
				cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + ip + "time");
				cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + ip);
			} else {
				int visits;
				String visi = (String) cacheManager.getCache(SystemConstant.VALID_CACHE)
						.get(SystemConstant.MSG_VALID + ip);
				if (visi == null) {
					visits = 0;
				} else {
					visits = Integer.parseInt(visi);
				}
				if (visits < 19) {
					visits++;
					visi = String.valueOf(visits);
					cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + ip, visi);
				} else {
					throw new OperationException("ip访问次数过多");
				}
			}
		}
	}

	@Override
	public Boolean updateOwnerRemarkBySales(Owner owner) {
		return ownerService.updateOwnerRemarkBySales(owner);
	}

	@Override
	public OwnerInformationVo getDetailOwner(Long id) {
		return (OwnerInformationVo) WebUtil.getEntryFromProxyObj(ownerService.getDetailOwner(id), dao);
	}
	
	@Override
	public Boolean createRegInfoAll(Map map) throws Exception{

		logger.info("begin createRegInfoAll.");
		map.put("password", "123456");
		boolean exist = ownerService.createImportRegInfoAll(map, true, true,null,null);
		logger.info("error  createRegInfoAll:[ id =" + WebUtil.getLogBasicString() + "]");
		return exist;
	}
	
	@Override
	public Boolean updateLoginById(Map<String, String> flagMap) {
		// TODO Auto-generated method stub
		logger.info("begin updateLoginById.");
		String[] keys = { "vat", "taxType", "startMonth", "ownerId","enterpriseName","enterpriseTaxCode"};
		if (!flagMap.keySet().containsAll(CollectionUtils.arrayToList(keys)))
			throw new OperationException("数据传入错误，请联系系统管理员！");
		return ownerService.updateLoginById(flagMap);
	}

	@Override
	public Boolean updateTaxCodeByName(Map<String, String> flagMap) throws Exception {
		logger.info("begin updateTaxCodeByName.");
		String[] keys = { "name", "taxCode"};
		if (!flagMap.keySet().containsAll(CollectionUtils.arrayToList(keys)))
			throw new OperationException("数据传入错误，请联系系统管理员！");
		return ownerService.updateTaxCodeByName(flagMap);
	}

	@Override
	public Boolean getEnrolledAgentVaildCode(String uname, Long count) throws Exception {
		// TODO Auto-generated method stub
		logger.info("begin getEnrolledAgentVaildCode. id  = [" + uname + "]");
		ipLimit();
		AcUser acUser = (AcUser) WebUtil.getEntryFromProxyObj(userService.getAcUserByUsername(uname), dao);
		if (null != acUser) {
			String phone = acUser.getUserInfo().getTelephone();
			if (StringUtil.isNotEmpty(phone)) {
				// 60秒内只可获取一次验证码
				if (!this.vailMsgCodeTime(phone)) {
					throw new OperationException("60秒内只可获取一次验证码");
				}
				this.createEnrolledAgentCode(phone, count);
				logger.info("end  getEnrolledAgentVaildCode:[ id =" + WebUtil.getLogBasicString() + "]");
				return true;
			} else
				throw new OperationException("系统中不存在该用户!");
		} else
			throw new OperationException("系统中不存在该用户!");
	}
	
	private boolean createEnrolledAgentCode(String cacheKey, Long count) throws Exception {
		logger.info("begin createMsgVaildCode");
		String cacheValue = null;
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getRequest();
		String ip = WebUtil.getIpAddr(request);
		if (count % 2 == 0) {
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey + "enrolledAgent");
			cacheValue = SmsTools.templateSMS(cacheKey);
		} else {
			cacheValue = HttpSender.getMsg(cacheKey, count);
		}
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + cacheKey + "enrolledAgent",
				cacheValue);
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + cacheKey + "time", new Date());
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + ip + "time", new Date());
		logger.info("end createMsgVaildCode");
		return true;
	}

	@Override
	public String getPhoneByAcUsername(String username) throws Exception {
		// TODO Auto-generated method stub
		StringBuffer sbf = new StringBuffer();
		logger.info("begin getUserByUsername.");
		AcUser user = (AcUser) WebUtil.getEntryFromProxyObj(userService.getAcUserByUsername(username), dao);
		String str = "";
		if (null != user) {
			String telephone = user.getUserInfo().getTelephone();
			sbf.append(telephone.substring(0, 3));
			sbf.append(telephone.substring(8));
			str = sbf.toString();
			logger.info("end  getPhoneByUsername:[ id =" + WebUtil.getLogBasicString() + "]");
			return str;
		} else
			throw new OperationException("系统中不存在该用户!");
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean vaildMsgCodeFirst(String valid, String username) throws Exception {
		// TODO Auto-generated method stub
		logger.info("begin vaildMsgCodeFirst.");
		AcUser user = (AcUser) WebUtil.getEntryFromProxyObj(userService.getAcUserByUsername(username), dao);
		String phone="";
		if (null != user) {
			 phone = user.getUserInfo().getTelephone();
		}
		String cacheVale = (String) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + phone + "enrolledAgent");
		Date timecacheVale = (Date) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + phone + "time");
		//验证码有效时间5分钟
		if (timecacheVale != null) {
			Date now = new Date();
			long time = (now.getTime() - timecacheVale.getTime()) / 1000;
			if (time > 300) {
				cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + phone + "enrolledAgent");
				throw new OperationException("验证码已失效");
			}
		}
		if (valid.equals(cacheVale)) {
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + phone + "enrolledAgent");
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + phone + "time");
			logger.info("end vaildMsgCodeFirst");
			return true;
		}
		return false;
	}

	@Override
	public List<Remark> getRemark(String id) {
		logger.info("begin getRemark");
		List<Remark> list=ownerService.getRemark(id);
		logger.info("end getRemark");
		return list;
	}
	
	@Override
	public BaseModelList<OwnerDetailsVo> getOwnerDetails(String num,String type, String sales_id,String query) {
		logger.info("begin getOwnerDetails");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<OwnerDetailsVo> list=ownerService.getOwnerDetails(num,type,sales_id,bso);
		logger.info("end getOwnerDetails");
		return list;
	}

	@Override
	public BaseModelList<Owner> getOwnerList(String num,String query) {
		logger.info("begin getOwnerDetails");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<Owner> list=ownerService.getOwnerList(num,bso);
		logger.info("end getOwnerDetails");
		return list;
	}

	@Override
	public Boolean writeownerlist(String ids,Long id,String employeeCode,String num) {
		return ownerService.writeownerlist(ids,id,employeeCode,num);
	}
	
	@Override
	public Map<String, String> getIsOrNoRemarkOwner(BigDecimal startAmt, BigDecimal endAmt, String roleName,
			String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return ownerService.getIsOrNoRemarkOwner(startAmt,endAmt,bso);
	}

	@Override
	public PayRemark createPayRemark(PayRemark payRemark) {
		return ownerService.createPayRemark(payRemark);
	}

	@Override
	public Boolean updatePayRemark(PayRemark payRemark) {
		// TODO Auto-generated method stub
		return ownerService.updatePayRemark(payRemark);
	}

	@Override
	public Boolean deletePayRemark(Long id) {
		// TODO Auto-generated method stub
		return ownerService.deletePayRemark(id);
	}
	
	@Override
	public BaseModelList<PayRemark> getAllPayRemark(Long ownerId,String type,String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return ownerService.getAllPayRemark(ownerId,type,bso);
	}
	
	@Override
	public Boolean sendEmail(String qq,Long ownerId, String startDate,String endDate,BigDecimal amt) throws Exception {
		// TODO Auto-generated method stub
		return ownerService.sendEmail(qq,ownerId,startDate,endDate,amt);
	}

	@Override
	public UserInfoForListVO getOwnerInfomation(Long ownerId) {
		return ownerService.getOwnerInfomation(ownerId);
	}

	@Override
	public List<SearchOwnerListvo> getUserInfomation() {
		return ownerService.getUserInfomation();
	}

}
