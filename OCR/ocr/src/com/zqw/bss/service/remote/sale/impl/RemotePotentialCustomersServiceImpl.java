package com.zqw.bss.service.remote.sale.impl;

import java.text.ParseException;
import java.util.List;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;
import com.zqw.bss.service.remote.sale.RemotePotentialCustomersService;
import com.zqw.bss.service.sale.PotentialCustomersService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.sale.PotentialCustomersRegisterVo;

public class RemotePotentialCustomersServiceImpl implements RemotePotentialCustomersService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected PotentialCustomersService potentialCustomersService;

	protected DAO dao;
	
	@Autowired
	public void setDao(DAO dao) {
		this.dao = dao;
	}
	
	@Override
	public Boolean savePotentialCustomers(PotentialCustomers potentialCustomers) {
		logger.info("begin savePotentialCustomers. id = [" + potentialCustomers.getId() + "]");
		return potentialCustomersService.savePotentialCustomers(potentialCustomers);
	}

	@Override
	public Boolean updatePotentialCustomers(PotentialCustomers potentialCustomers) {
		logger.info("begin updatePotentialCustomers. id = [" + potentialCustomers.getId() + "]");
		return potentialCustomersService.updatePotentialCustomers(potentialCustomers);
	}

	@SuppressWarnings("unchecked")
	@Override
	public BaseModelList<PotentialCustomers> getPagePotentialCustomers(String query) {
		logger.info("begin getPagePotentialCustomers");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		List<Condition> list = bso.getCondition();
		if (roles.contains("agentistrator")) {

			Long id = (Long) SessionUtil.get(SystemConstant.SESSION_KEY_USERINFO_ID);
			String[] a = { id.toString() };
			Condition cd = new Condition();
			cd.setKey("salesAgent.userInfo.id");
			cd.setValue(a);
			cd.setAction("eq");
			list.add(cd);
			bso.setCondition(list);
			// bso.setSortdatafield("salesAgent.lastUpdateDate desc");
			//return potentialCustomersService.getPagePotentialCustomers(bso);
		}
		return potentialCustomersService.getPagePotentialCustomers(bso);

	}

	@Override
	public PotentialCustomers getPotentialCustomersById(Long id) {
		logger.info("begin getPotentialCustomersById. id = ["+id+"]");
		return (PotentialCustomers) WebUtil.getEntryFromProxyObj(potentialCustomersService.getPotentialCustomersById(id));
	}

	@Override
	public PotentialCustomers updatePotentialCustomersStatusById(PotentialCustomers potentialCustomers) {
		logger.info("begin updatePotentialCustomersStatusById. id =["+potentialCustomers.getId()+"]");
		return potentialCustomersService.updatePotentialCustomersStatusById(potentialCustomers);
	}

	@Override
	public List<ShortMessage> getAllListShortMessage(Long id) throws ParseException {
		logger.info("begin  getTrackByPotentialCustomersId.");
		List<ShortMessage> list = WebUtil.getEntryListFromProxyList(potentialCustomersService.getAllListShortMessage(id), dao);
		logger.info("begin  getTrackByPotentialCustomersId:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	public BaseModelList<ShortMessage> getPageShortMessage(String query) {
		logger.info("begin getPageShortMessage");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return potentialCustomersService.getPageShortMessage(bso);
	}

	@Override
	public BaseModelList<PotentialCustomersRegisterVo> putMatching(String query) {
		logger.info("begin putMatching");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<PotentialCustomersRegisterVo> putMatching = potentialCustomersService.putMatching(bso);
		logger.info("end putMatching");
		return putMatching;
	}

	@Override
	public BaseModelList<PotentialCustomersRegisterVo> registered(String query) {
		logger.info("begin registered");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<PotentialCustomersRegisterVo> registered = potentialCustomersService.registered(bso);
		logger.info("end registered");
		return registered;
	}


	@Override
	public Boolean sendmessageToPerson(ShortMessage shortMessage) {
		logger.info("begin sendmessageToPerson");
		return potentialCustomersService.sendmessageToPerson(shortMessage);
	}
	
	@Override
	public Boolean updateNameAndPhone(PotentialCustomers potentialCustomers) {
		logger.info("begin updatePotentialCustomers. id = [" + potentialCustomers.getId() + "]");
		return potentialCustomersService.updateNameAndPhone(potentialCustomers);
	}

}
