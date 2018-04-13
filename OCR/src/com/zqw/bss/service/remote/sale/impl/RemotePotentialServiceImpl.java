package com.zqw.bss.service.remote.sale.impl;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.sale.Potential;
import com.zqw.bss.service.remote.sale.RemotePotentialService;
import com.zqw.bss.service.sale.PotentialService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

public class RemotePotentialServiceImpl implements RemotePotentialService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected PotentialService potentialService;

	@Override
	public Boolean savePotential(Potential potential) {
		logger.info("begin savePotential. id = [" + potential.getId() + "]");
		return potentialService.savePotential(potential);
	}

	@Override
	public Boolean updatePotential(Potential potential) {
		logger.info("begin updatePotential. id = [" + potential.getId() + "]");
		return potentialService.updatePotential(potential);
	}

	@Override
	public Boolean deletePotential(Long id) {
		logger.info("begin deletePotential. id = [" + id + "]");
		return potentialService.deletePotential(id);
	}

	@SuppressWarnings("unchecked")
	@Override
	public BaseModelList<Potential> getPagePotential(String query) {
		logger.info("begin getPagePotential");
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
			//return potentialService.getPagePotential(bso);
		}
		return potentialService.getPagePotential(bso);

	}

	@Override
	public Potential getPotentialById(Long id) {
		logger.info("begin getPotentialById. id = ["+id+"]");
		return (Potential) WebUtil.getEntryFromProxyObj(potentialService.getPotentialById(id));
	}

	@Override
	public Potential updatePotentialStatusById(Potential potential) {
		logger.info("begin updatePotentialStatusById. id =["+potential.getId()+"]");
		return potentialService.updatePotentialStatusById(potential);
	}

	@Override
	public Map<String, Long> followup(String query) {
		logger.info("begin getPagePotential");
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
			//return potentialService.getPagePotential(bso);
		}
		return potentialService.followup(bso);

	}

}
