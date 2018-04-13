package com.zqw.bss.service.sale.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.sale.CustomerLog;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.sale.CustomerLogService;

import com.zqw.bss.util.WebUtil;

@Service
@Qualifier("customerLogService")
public class CustomerLogServiceImpl implements CustomerLogService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<CustomerLog> getCustomerLogByPage(BasePagerObject bso) {
		logger.info("begin getCustomerLogByPage");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		@SuppressWarnings("unchecked")
		List<CustomerLog> list = dao.getLst4Paging("FROM CustomerLog c WHERE c.isdelete='0' " + conStr,
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging("SELECT count(c.id) FROM CustomerLog c WHERE c.isdelete='0' " + conStr);
		@SuppressWarnings("unchecked")
		BaseModelList<CustomerLog> lists = new BaseModelList<CustomerLog>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		logger.info("end getCustomerLogByPage");
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveCustomerLog(CustomerLog customerLog) {
		logger.info("begin saveCustomerLog");
		dao.save(customerLog);
		logger.info("end saveCustomerLog");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delectCustomerLog(Long id) {
		logger.info("begin delectCustomerLog");
		dao.executeSql("UPDATE t_bss_customer_log SET isdelete ='1' WHERE id=" + id, null);
		logger.info("end delectCustomerLog");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateCustomerLog(CustomerLog customerLog) {
		logger.info("begin updateCustomerLog");
		dao.update(customerLog);
		logger.info("end updateCustomerLog");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveContentRemark(Remark remark, String type, Long id) {
		logger.info("begin saveContentRemark");
		Remark re = (Remark) dao.save(remark);
		if (type.equals("remark")) {
			dao.executeSql("UPDATE t_bss_remark SET customer_log_id = " + id + " WHERE id= " + re.getId(), null);
		} else if (type.equals("content")) {
			dao.executeSql("UPDATE t_bss_remark SET content_id = " + id + " WHERE id= " + re.getId(), null);
		}
		logger.info("end saveContentRemark");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateContentRemark(Remark remark, String type) {
		logger.info("begin updateContentRemark");
		dao.executeSql("UPDATE t_bss_remark SET remark ='" + remark.getRemark() + "' WHERE id=" + remark.getId(), null);
		logger.info("end updateContentRemark");
		return true;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public User queryUser(String type, String parameter) {
		logger.info("begin queryUser");
		List<CustomerLog> lists = new ArrayList<>();
		if (type.equals("phone")) {
			lists = dao.find("FROM CustomerLog WHERE phone LIKE '%" + parameter + "%'");
		} else if (type.equals("name")) {
			lists = dao.find("FROM CustomerLog WHERE name LIKE '%" + parameter + "%'");
		}
		int index = (int) (Math.random() * lists.size());
		User user = lists.get(index).getCustomer();
		logger.info("end queryUser");
		return user;
	}

	@Override
	public User randomUser() {
		logger.info("begin randomUser");
		List<User> find = dao.find("FROM User u join fetch u.roles ro WHERE u.locked='N' AND ro.id in(3,7,9) ");
		int index = (int) (Math.random() * find.size());
		User user = find.get(index);
		logger.info("end randomUser");
		return user;
	}

}
