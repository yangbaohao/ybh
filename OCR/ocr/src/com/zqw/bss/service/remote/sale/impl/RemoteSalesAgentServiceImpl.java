package com.zqw.bss.service.remote.sale.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.shiro.cache.CacheManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.zqw.bss.util.SmsTools;
import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.service.remote.crm.impl.RemoteOwnerServiceImpl;
import com.zqw.bss.service.remote.sale.RemoteSalesAgentService;
import com.zqw.bss.service.sale.SalesAgentService;
import com.zqw.bss.util.HttpSender;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.billing.SalesAgentVo;
import com.zqw.bss.vo.sale.SalesAgentFollowVo;
import com.zqw.bss.vo.sys.OwnerDetailsVo;

@SuppressWarnings("unused")
public class RemoteSalesAgentServiceImpl implements RemoteSalesAgentService{

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	public SalesAgentService salesAgentService;
	@Autowired
	protected DAO dao;
	@Autowired
	public CommonService commonService;
	@Autowired
	private CacheManager cacheManager;
	
	@Override
	public SalesAgent saveSalesAgent(SalesAgent salesAgent) {
		logger.info("begin saveSalesAgent. id = ["+salesAgent.getId()+"]");
		return salesAgentService.saveSalesAgent(salesAgent);
	}

	@Override
	public SalesAgent saveSalesAgentPhone(SalesAgent salesAgent) {
		logger.info("begin saveSalesAgentPhone. id = ["+salesAgent.getId()+"]");
		if(null != salesAgent && null != salesAgent.getUserInfo() && null!= salesAgent.getUser()){
			String phone=salesAgent.getUserInfo().getTelephone();
					//验证码五分钟失效
					Date timecacheVale = (Date) cacheManager.getCache(SystemConstant.VALID_CACHE)
							.get(SystemConstant.MSG_VALID + phone+"time");
					if(timecacheVale!=null){
						Date now=new Date();
						long time=(now.getTime()-timecacheVale.getTime())/1000;
						if (time>300) {
							cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + phone);
							throw new OperationException("验证码已失效");
						}
						}
			if (!this.vaildMsgCode(salesAgent.getUser().getValid(),phone )) {
				throw new OperationException("验证码不正确！");
			}
		}
		return salesAgentService.saveSalesAgent(salesAgent);
	}
	
	@Override
	public Boolean updateSalesAgent(String state,SalesAgent salesAgent) {
		logger.info("begin updateSalesAgent. id = ["+salesAgent.getId()+"]");
		return salesAgentService.updateSalesAgent(state,salesAgent);
	}

	@Override
	public Boolean deleteSalesAgent(Long id) {
		logger.info("begin deleteSalesAgent. id = ["+id+"]");
		return salesAgentService.deleteSalesAgent(id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public BaseModelList<SalesAgent> getPageSalesAgent(String query) {
		logger.info("begin getPageSalesAgent");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		bso.setSortdatafield("userInfo.lastUpdateDate");
		//bso.setSortdatafield("id");
		bso.setSortorder("desc");
		return (BaseModelList<SalesAgent>)WebUtil.getEntryFromProxyObj(salesAgentService.getPageSalesAgent(bso));
	}

	@Override
	public BaseModelList<SalesAgentVo> getPageSalesAgentVo(String query){
		logger.info("begin getPageSalesAgentVo");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject condition = HsqlUtil.toPager(request);
		//bso.setSortdatafield("lastUpdateDate");
		condition.setSortdatafield("agentCode");
		condition.setSortorder("asc");
		//bso.setSortdatafield("userInfo.lastUpdateDate");
		//bso.setSortorder("desc");
		
		//取得赢的佣金和付费客户
		List<Condition> bsoList = condition.getCondition();
		List<Condition> bsoRemove =new ArrayList<>();
		String[] customernum = new String[]{};
		String[] fees = new String[]{};
		int temp = 0;
		for (Condition bso : bsoList) {
			if (bso.getKey().equals("customernum")) {
				bsoRemove.add(bso);
				customernum = bso.getValue();
			} else if(bso.getKey().equals("fee")) {
				bsoRemove.add(bso);
				fees = bso.getValue();
			}else{
				
			}
		}
		if (bsoRemove.size()!=0) {
			bsoList.removeAll(bsoRemove);
			condition.setCondition(bsoList);
		}
		return salesAgentService.getPageSalesAgentVo(condition,customernum,fees);
	}
	
	@Override
	public SalesAgent getSalesAgentById(Long id) {
		logger.info("begin getSalesAgentById. id = ["+id+"]");
		return (SalesAgent)WebUtil.getEntryFromProxyObj(salesAgentService.getSalesAgentById(id));
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SalesAgent> getListSalesAgent() {
		logger.info("begin getListSalesAgent");
		return (List<SalesAgent>)WebUtil.getEntryListFromProxyList(salesAgentService.getListSalesAgent(),dao);
	}

	@Override
	public Boolean getVaildCodeByPhone(String phone, Long count) throws Exception {
		logger.info("begin getVaildColdByPhone. id  = [" + phone + "]");
		ipLimit();
		Boolean bool = false;
		if (!this.vailMsgCodeTime(phone)){
			throw new OperationException("60秒内只可获取一次验证码");
		}
		try {
			this.createMsgVaildCode(phone, count);
			bool = true;
		} catch (Exception e) {
			// TODO: handle exception
		}
		logger.info("end  getVaildColdByPhone:[ id =" + WebUtil.getLogBasicString() + "]");
		return bool;
	}

	@Override
	public String getSystemCode(String type) throws Exception {
		logger.info("begin getSystemCode");
		if("agentcode".equals(type))
			return commonService.getSystemCode("AgentCode", 5, 0L);
		if("messagecode".equals(type))
			return commonService.getSystemCode("MessageCode", 5, 0L);
		if("usercode".equals(type))
			return commonService.getSystemCode("Usercode", 5, 0L);
		return null;
	}
	
	private boolean vaildMsgCode(String tragetValue, String cacheKey) {
		logger.info("begin vaildMsgCode");
		String cacheVale = (String) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + cacheKey+"reg");
		if (tragetValue.equals(cacheVale)) {
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey+"reg");
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey+"time");
			logger.info("end vaildMsgCode");
			return true;
		}
		logger.info("end vaildMsgCode");
		return false;
	}
	
	private boolean vailMsgCodeTime(String cacheKey){
		logger.info("begin vailMsgCodeTime");
		Date timecacheVale = (Date) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + cacheKey+"time");
		if(timecacheVale==null){
			return true;
		}
		Date now=new Date();
		long time=(now.getTime()-timecacheVale.getTime())/1000;
		if (time>60) {
			logger.info("end vailMsgCodeTime");
			return true;
		}
		logger.info("end vailMsgCodeTime");
		return false;
	}
	
	private boolean createMsgVaildCode(String cacheKey, Long count) throws Exception {
		logger.info("begin createMsgVaildCode");
		String cacheValue=null;
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getRequest();
		String ip = WebUtil.getIpAddr(request);
		if(count%2==0){
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey+"reg");
			cacheValue = SmsTools.templateSMS(cacheKey);
		}else {
			cacheValue = HttpSender.getMsg(cacheKey, count);
		}
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + cacheKey+"reg", cacheValue);
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + cacheKey+"time", new Date());
		cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + ip+"time", new Date());
		logger.info("end createMsgVaildCode");
		return true;
	}
 
	@Override
	public Boolean vaildMsgCodeFirst(String tragetValue, String cacheKey) throws Exception {
		logger.info("begin vaildMsgCodeFirst");
		String cacheVale = (String) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + cacheKey+"reg");
		if (tragetValue.equals(cacheVale)) {
			cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + cacheKey+"time");
			logger.info("end vaildMsgCodeFirst");
			return true;
		}
		logger.info("end vaildMsgCodeFirst");
		return false;
	}

	public void ipLimit() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getRequest();
		String ip = WebUtil.getIpAddr(request);

		Date timecacheVale = (Date) cacheManager.getCache(SystemConstant.VALID_CACHE)
				.get(SystemConstant.MSG_VALID + ip +"time");
		if(timecacheVale!=null){
			Date now=new Date();
			long time=(now.getTime()-timecacheVale.getTime())/1000;
			if (time>60) {
				cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + ip +"time");
				cacheManager.getCache(SystemConstant.VALID_CACHE).remove(SystemConstant.MSG_VALID + ip );
			}else{
				int visits;
				String visi= (String)cacheManager.getCache(SystemConstant.VALID_CACHE).get(SystemConstant.MSG_VALID + ip);
				if(visi==null){
					visits=0;
				}else{
					visits= Integer.parseInt(visi);
				}
				if(visits<19){
					visits++;
					visi=String.valueOf(visits);
					cacheManager.getCache(SystemConstant.VALID_CACHE).put(SystemConstant.MSG_VALID + ip, visi);
				}else{
					throw new OperationException("ip访问次数过多");
				}
			}
		}
	}

	@Override
	public BaseModelList<SalesAgentFollowVo> follow(String query) {
		logger.info("begin follow");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<SalesAgentFollowVo> list=salesAgentService.follow(bso);
		logger.info("end follow");
		return list;
	}

	@Override
	public PotentialTrack savePotentialTrack(PotentialTrack potentialTrack) {
		logger.info("begin savePotentialTrack");
		PotentialTrack track= salesAgentService.savePotentialTrack(potentialTrack);
		logger.info("end savePotentialTrack");
		return track;
	}

	@Override
	public List<SalesAgent> getSeniorTrue() {
		logger.info("begin getSeniorTrue");
		List<SalesAgent> list =salesAgentService.getSenior("true");
		logger.info("end getSeniorTrue");
		return list;
	}
	@Override
	public List<SalesAgent> getSeniorFalse() {
		logger.info("begin getSeniorTrue");
		List<SalesAgent> list =salesAgentService.getSenior("false");
		logger.info("end getSeniorTrue");
		return list;
	}

	@Override
	public List<SalesAgent> getSeniorAll() {
		logger.info("begin getSeniorAll");
		List<SalesAgent> list =salesAgentService.getSenior("all");
		logger.info("end getSeniorAll");
		return list;
	}

	@Override
	public BaseModelList<OwnerDetailsVo> getOwnerDetails(String type,String agentCode, String query) {
		logger.info("begin getOwnerDetails");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<OwnerDetailsVo> list=salesAgentService.getOwnerDetails(type,agentCode,bso);
		logger.info("end getOwnerDetails");
		return list;
	}

	@Override
	public BaseModelList<SalesAgent> getHaveSalesAgent(String num,String id,String query) {
		logger.info("begin getHaveSalesAgent");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<SalesAgent> list=salesAgentService.getHaveSalesAgent(num,id,bso);
		logger.info("end getHaveSalesAgent");
		return list;
	}

	@Override
	public Map<String, Long> followUp(String query) {
		logger.info("begin followUp");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		Map<String, Long> map=salesAgentService.followUp(bso);
		logger.info("end followUp");
		return map;
	}
	
}
