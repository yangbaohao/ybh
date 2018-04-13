package com.zqw.bss.service.sale.impl;

import java.util.List;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.model.sale.UserSaler;
import com.zqw.bss.service.sale.UserSalerService;

@Service
@Qualifier("userSalerService")
@SuppressWarnings({"unchecked" })
public class UserSalerServiceImpl implements UserSalerService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<UserSaler> getAllUsersaler(String type) {
		logger.info("begin getAllUsersaler");
		List<UserSaler> list = dao.find("FROM UserSaler WHERE type = '"+type+"'");
		logger.info("end getAllUsersaler");
		return list;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveUserSaler(List<UserSaler> users,String type) {
		logger.info("begin saveUserSaler");
		//customer 客服 sales 销售
		if (type.equals("customer")) {
			List<UserSaler> find = dao.find("FROM UserSaler u WHERE u.type='customer'");
			for (UserSaler userSaler : find) {
				int emp=0;
				for (UserSaler u : users) {
					if (userSaler.getEmployeeCode().equals(u.getEmployeeCode())) {
						emp++;
					}
				}
				if (emp==0) {
					dao.executeSql("UPDATE t_bss_sys_user SET distributionCustomerEmployeeCode=NULL WHERE distributionCustomerEmployeeCode='"
							+ userSaler.getEmployeeCode() + "'", null);
				}
			}
			
			dao.executeSql("DELETE FROM t_bss_user_saler WHERE type='customer' ", null);
			for (UserSaler userSaler : users) {
				dao.save(userSaler);
			}
			logger.info("begin saveUserSaler");
			return true;
		}else{

			List<UserSaler> find = dao.find("FROM UserSaler u WHERE u.type='sales'");
			for (UserSaler userSaler : find) {
				int emp=0;
				for (UserSaler u : users) {
					if (userSaler.getEmployeeCode().equals(u.getEmployeeCode())) {
						emp++;
					}
				}
				if (emp==0) {
					dao.executeSql("UPDATE t_bss_sys_user SET distributionEmployeeCode=NULL WHERE distributionEmployeeCode='"
							+ userSaler.getEmployeeCode() + "'", null);
				}
			}
			dao.executeSql("DELETE FROM t_bss_user_saler WHERE type='sales' ", null);
			for (UserSaler userSaler : users) {
				dao.save(userSaler);
			}
//			if (users == null) {
//				dao.executeSql("DELETE FROM t_bss_user_saler WHERE type='sales' ", null);
//			} else {
//				String str = " (";
//				for (UserSaler userSaler : users) {
//					Long id = userSaler.getId();
//					if (id == null) {
//						UserSaler save = (UserSaler) dao.save(userSaler);
//						str += save.getId() + ",";
//					} else {
//						str += id + ",";
//					}
//				}
//				str = str.substring(0, str.length() - 1) + ")";
//				dao.executeSql("DELETE FROM t_bss_user_saler WHERE id not in " + str +" type='sales'", null);
//			}
			logger.info("begin saveUserSaler");
			return true;
		}
		
	}

}
