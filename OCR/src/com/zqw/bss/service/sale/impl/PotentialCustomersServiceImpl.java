package com.zqw.bss.service.sale.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

import javax.mail.Folder;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.sale.ImportLogService;
import com.zqw.bss.service.sale.PotentialCustomersService;
import com.zqw.bss.service.sale.ShortMessageService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.sale.PotentialCustomersForListVO;
import com.zqw.bss.vo.sale.PotentialCustomersRegisterVo;

@Service
@Qualifier("potentialCustomersService")
public class PotentialCustomersServiceImpl implements PotentialCustomersService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;
	@Autowired
	protected ShortMessageService shortMessageService;
	@Autowired
	protected ImportLogService importLogService;
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean savePotentialCustomers(PotentialCustomers potentialCustomers) {
		logger.info("begin savePotentialCustomers.");
		Long uid = potentialCustomers.getSales().getId();
		potentialCustomers.setSales(null);
		PotentialCustomers poten = (PotentialCustomers) dao.save(potentialCustomers);
		if (uid != null) {
			Object[] par = new Object[2];
			par[0] = uid;
			par[1] = poten.getId();
			dao.executeHql("update PotentialCustomers a SET a.sales.id=? where a.id=?", par);
		}
		logger.info("end savePotentialCustomers[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updatePotentialCustomers(PotentialCustomers potentialCustomers) {
		logger.info("begin updatePotentialCustomers.");
		// 通过手机号查询用户信息
		List<PotentialCustomers> phones = this.getAllListPotentialCustomersByPhone(potentialCustomers.getPhone());
		if (!phones.isEmpty() && phones.size() > 0) {
			// 判断该手机号是否是它本身
			if (phones.size() == 1 && phones.get(0).getId() == potentialCustomers.getId()) {

			} else {
				// 如果已存在则抛异常
				throw new OperationException("该手机号已存在!");
			}
		}

		Object[] param = new Object[11];
		param[0] = potentialCustomers.getPotentialName();
		param[1] = potentialCustomers.getPotentialPosition();
		param[2] = potentialCustomers.getPhone();
		param[3] = potentialCustomers.getContact();
		param[4] = potentialCustomers.getCompanyType();
		param[5] = potentialCustomers.getIndustry();
		param[6] = potentialCustomers.getAddress();
		param[7] = potentialCustomers.getCompanyRemark();
		param[8] = new Date();
		param[9] = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		param[10] = potentialCustomers.getId();
		dao.executeHql("update PotentialCustomers ar SET " + " ar.potentialName = ?," + " ar.potentialPosition = ?,"
				+ " ar.phone = ?," + " ar.contact = ?," + " ar.companyType = ?," + " ar.industry = ?,"
				+ " ar.address = ?," + " ar.companyRemark = ?," + " ar.lastUpdateDate=? , " + " ar.lastUpdateBy=? "
				+ " where ar.id=?", param);
		logger.info("end updateSalesAgent[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<PotentialCustomers> getPagePotentialCustomers(BasePagerObject bso) {
		List<PotentialCustomers> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, PotentialCustomers.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, PotentialCustomers.class));
		BaseModelList<PotentialCustomers> lists = new BaseModelList<PotentialCustomers>(count,
				WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public PotentialCustomers getPotentialCustomersById(Long id) {
		logger.info("begin getPotentialCustomersById. id = [" + id + "]");
		PotentialCustomers pro = (PotentialCustomers) dao.getObject(PotentialCustomers.class, id);
		logger.info("end getPotentialCustomersById:[ id =" + WebUtil.getLogBasicString() + "]");
		return pro;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public PotentialCustomers updatePotentialCustomersStatusById(PotentialCustomers potentialCustomers) {
		Object[] param = new Object[2];
		param[0] = potentialCustomers.getPotentialCustomersStatus();
		param[1] = potentialCustomers.getId();
		dao.executeHql("update PotentialCustomers ar SET ar.potentialCustomersStatus =? where ar.id=?", param);
		return potentialCustomers;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<PotentialCustomersForListVO> getAllListPotentialCustomers() {
		logger.info("begin getAllListPotentialCustomers");
		String hql = "select new com.zqw.bss.vo.sale.PotentialCustomersForListVO("
				+ "pc.id,pc.potentialName,pc.phone,pc.batchNum)  from PotentialCustomers pc ";
		List<PotentialCustomersForListVO> pc = (List<PotentialCustomersForListVO>) dao.find(hql);
		logger.info("end getAllListPotentialCustomers.[ id =" + WebUtil.getLogBasicString() + "]");
		return pc;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<PotentialCustomers> getAllListPotentialCustomers(String batchNum) {
		logger.info("begin getAllListPotentialCustomers");
		Object[] param = new Object[1];
		param[0] = batchNum;
		String hql = "from PotentialCustomers pc where pc.batchNum = ? ";
		List<PotentialCustomers> pc = (List<PotentialCustomers>) dao.find(hql, param);
		logger.info("end getAllListPotentialCustomers：[ id =" + WebUtil.getLogBasicString() + "]");
		return pc;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<PotentialCustomers> getAllListPotentialCustomersByPhone(String phone) {
		logger.info("begin getAllListPotentialCustomers");
		Object[] param = new Object[1];
		param[0] = phone;
		String hql = "from PotentialCustomers pc where pc.phone = ? ";
		List<PotentialCustomers> pc = (List<PotentialCustomers>) dao.find(hql, param);
		logger.info("end getAllListPotentialCustomers：[ id =" + WebUtil.getLogBasicString() + "]");
		return pc;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<ShortMessage> getAllListShortMessage(Long id) {
		logger.info("begin getAllListPotentialCustomers");
		Object[] param = new Object[1];
		param[0] = id;
		String hql = "select sm from PotentialCustomers pl,ShortMessage sm inner join fetch sm.messageLogs ml  where pl.batchNum = ml.batchNum "
				+ "and pl.id = ?";
		List<ShortMessage> messages = dao.find(hql, param);
		logger.info("end getAllListPotentialCustomers：[ id =" + WebUtil.getLogBasicString() + "]");
		return messages;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deletePotentialCustomersByPhone(String phone) {
		logger.info("begin deletePotentialCustomersByPhone.");
		Object[] param = new Object[1];
		param[0] = phone;
		dao.executeHql("delete from PotentialCustomers pc where pc.phone=?", param);
		logger.info("end deletePotentialCustomersByPhone.");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<ShortMessage> getPageShortMessage(BasePagerObject bso) {
		logger.info("begin getPageShortMessage.");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String hql = "select sm from PotentialCustomers pl,ShortMessage sm inner join fetch sm.messageLogs ml  where pl.batchNum = ml.batchNum "
				+ conStr;
		List<ShortMessage> list = dao.getLst4Paging(hql, new int[] { bso.getPagenum(), bso.getPagesize() });
		String sqlcount = "select count(distinct sm.id) from PotentialCustomers pl,ShortMessage sm inner join sm.messageLogs ml  where pl.batchNum = ml.batchNum "
				+ conStr;
		Long count = dao.getCount4Paging(sqlcount);
		BaseModelList<ShortMessage> lists = new BaseModelList<ShortMessage>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		logger.info("end getPageShortMessage.");
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public BaseModelList<PotentialCustomersRegisterVo> putMatching(BasePagerObject bso) {
		List<PotentialCustomers> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, PotentialCustomers.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		if (urls.size() != 0) {
			String phone = " IN (";
			for (PotentialCustomers potentialCustomers : urls) {
				phone += potentialCustomers.getPhone() + ",";
			}
			phone = phone.substring(0, phone.length() - 1) + ")";
			Long num = dao.getCount4PagingWithSQL("select COUNT(DISTINCT(o.regTelephone)) from t_crm_owner o where o.regTelephone" + phone);
			if (num!=0) {
				List<Condition> condition = bso.getCondition();
				Condition condition2 = condition.get(0);
				//修改注册数量
				dao.executeHql("update ImportLog SET registerNum="+num+" WHERE batchNum='"+condition2.getValue()[0]+"'", null);
				//修改客户状态
				dao.executeSql("UPDATE t_bss_potential_customers pc SET pc.potentialCustomersStatus='register' WHERE pc.phone in(select DISTINCT(o.regTelephone) from t_crm_owner o where o.regTelephone"+phone+")", null);
				BaseModelList<PotentialCustomersRegisterVo> lists = registered(bso);
//				//查询已经注册的客户
//				String hql="FROM PotentialCustomers pot WHERE pot.potentialCustomersStatus='register' AND batchNum='"+condition2.getValue()[0]+"'";
//				List<PotentialCustomers> list = dao.getLst4Paging(hql, new int[] { bso.getPagenum(), bso.getPagesize() });
//				Long count = dao.getCount4Paging("SELECT COUNT(pot.id) "+hql);
//				BaseModelList<PotentialCustomers> lists = new BaseModelList<PotentialCustomers>(count, WebUtil.getEntryListFromProxyList(list, dao));
				return lists;
				}
		}
		return null;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<PotentialCustomersRegisterVo> registered(BasePagerObject bso) {
		List<Condition> condition = bso.getCondition();
		Condition condition2 = condition.get(0);
		String sql="select e.id,e.createDate,e.loginId,e.phone,e.`name`,group_concat(sm.messageContent ORDER BY sm.id SEPARATOR '---------') messageContent FROM(\n" +
				"select pot.id id,ow.createDate createDate,ow.loginId loginId,pot.phone phone,u.`name` name,pot.batchNum  batchNum FROM\n" +
				"	t_bss_potential_customers pot\n" +
				"	LEFT JOIN t_crm_owner ow ON pot.phone=ow.regTelephone\n" +
				"	LEFT JOIN t_crm_user_info u ON u.id=ow.enterpriseInfo_id\n" +
				"	\n" +
				"WHERE\n" +
				"	pot.potentialCustomersStatus = 'register' AND\n" +
				"  pot.batchNum ='"+condition2.getValue()[0]+"'" +
				")e,t_bss_message_log ml,t_bss_short_message sm where ml.batchNum=e.batchNum and sm.id=ml.shortmessage_id\n" +
				"GROUP BY e.loginId ORDER BY e.id";
		List lst4PagingWithSQL = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		List<PotentialCustomersRegisterVo> listVo = new ArrayList<>();
		for (Object obj  : lst4PagingWithSQL) {
			PotentialCustomersRegisterVo vo=new PotentialCustomersRegisterVo(obj);
			listVo.add(vo);
		}
		String hql="FROM\n" +
				"	t_bss_potential_customers pot\n" +
				"	LEFT JOIN t_crm_owner ow ON pot.phone=ow.regTelephone\n" +
				"	LEFT JOIN t_crm_user_info u ON u.id=ow.enterpriseInfo_id\n" +
				"WHERE\n" +
				"	pot.potentialCustomersStatus = 'register'\n" +
				"AND batchNum ='"+condition2.getValue()[0]+"'";
//		List list =dao.getLst4PagingWithSQL("select pot.id,ow.createDate,ow.loginId,pot.phone,u.`name` "+hql, new int[] { bso.getPagenum(), bso.getPagesize() });
//		List<PotentialCustomersRegisterVo> listVo = new ArrayList<>();
//		for (Object obj : list) {
//			Object[]o=(Object[]) obj;
//			String hql2 = "select sm from PotentialCustomers pl,ShortMessage sm inner join fetch sm.messageLogs ml  where pl.batchNum = ml.batchNum AND pl.id ="+o[0];
//			List<ShortMessage> ShortMessageList = dao.find(hql2);
//			PotentialCustomersRegisterVo vo=new PotentialCustomersRegisterVo(o,ShortMessageList);
//			listVo.add(vo);
//		}
		Long count = dao.getCount4PagingWithSQL("SELECT COUNT(pot.id) "+hql);
		BaseModelList<PotentialCustomersRegisterVo> lists = new BaseModelList<PotentialCustomersRegisterVo>(count, WebUtil.getEntryListFromProxyList(listVo, dao));
		return lists;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean sendmessageToPerson(ShortMessage shortMessage) {
		//通过id获取该用户信息
		List<PotentialCustomers> pcs = dao.find("from PotentialCustomers  where id = "+shortMessage.getPotentialCustomersId());
		//原批次
		String batchNum = pcs.get(0).getBatchNum();
		String phone = pcs.get(0).getPhone();
		Long id = pcs.get(0).getId();
		//判断发信人是客服还是销售
		String username = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (roles.contains("salesStaff")||roles.contains("salesManage")) {
			List<User> find = dao.find("FROM User u where u.username='"+username+"'");
			shortMessage.setSales(find.get(0));
		}else if(roles.contains("customerService")||roles.contains("customerManage")){
			List<User> find = dao.find("FROM User u where u.username='"+username+"'");
			shortMessage.setCustomer(find.get(0));
		}
		//1.保存短信内容--ShortMessage
		shortMessageService.saveShortMessage(shortMessage);
		//2.查询该客户当前批次是否只有他自己
		Long pcNum=dao.getCount4Paging("select count(id) from PotentialCustomers where batchNum='"+batchNum+"'");
		//2.1如果当前批次只有他自己直接调用发短信接口
		if(pcNum.equals(1L)){
			shortMessageService.senderMessage(shortMessage.getId(), batchNum);
		//2.2否则
		}else{
			//3.以客户名创建客户批次--修改导入日志ImportLog
			ImportLog importLog = new ImportLog();
			importLog.setBatchNum(phone);
			importLog.setRemark("单独发送短信自动生成");
			importLog.setNum(1);
			importLogService.saveImportLog(importLog);
			//4.将改客户移至最新的批次下
			this.updateBatchNum(id, batchNum, phone);
			//5.调用发送短信接口senderMessage
			shortMessageService.senderMessage(shortMessage.getId(), phone);
		}
		return null;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateBatchNum(Long id, String lastBatchNum, String batchNum) {
		//1.将改客户移至最新的批次下--修改潜在客户PotentialCustomers
		Object[] param = new Object[4];
		param[0] = batchNum;
		param[1] = new Date();
		param[2] = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		param[3] = id;
		dao.executeHql("update PotentialCustomers ar SET " 
				+ " ar.batchNum = ?," 
				+ " ar.lastUpdateDate=? , " 
				+ " ar.lastUpdateBy=? "
				+ " where ar.id=?", param);
		//2.将原客户批次数量减1--ImportLog
		importLogService.updateImportLogNum(lastBatchNum, -1);
		return true;
	}
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateNameAndPhone(PotentialCustomers potentialCustomers) {
		logger.debug("begin updatePotentialCustomers.");
		// 通过手机号查询用户信息
		List<PotentialCustomers> phones = this.getAllListPotentialCustomersByPhone(potentialCustomers.getPhone());
		if (!phones.isEmpty() && phones.size() > 0) {
			// 判断该手机号是否是它本身
			if (phones.size() == 1 && phones.get(0).getId().equals(potentialCustomers.getId())) {

			} else {
				// 如果已存在则抛异常
				throw new OperationException("该手机号已存在!");
			}
		}

		Object[] param = new Object[5];
		param[0] = potentialCustomers.getPotentialName();
		param[1] = potentialCustomers.getPhone();
		param[2] = new Date();
		param[3] = (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
		param[4] = potentialCustomers.getId();
		dao.executeHql("update PotentialCustomers ar SET " 
				+ " ar.potentialName = ?," 
				+ " ar.phone = ?," 
				+ " ar.lastUpdateDate=? , " 
				+ " ar.lastUpdateBy=? "
				+ " where ar.id=?", param);
		logger.debug("end updateSalesAgent[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

}
