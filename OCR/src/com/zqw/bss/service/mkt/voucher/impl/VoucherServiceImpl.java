package com.zqw.bss.service.mkt.voucher.impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.model.BaseObject;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.billing.Account;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.billing.AgentRequestPay;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.model.sale.Potential;
import com.zqw.bss.model.sys.InformationLogs;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.service.mkt.voucher.VoucherService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.DispatchType;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.mkt.VoucherNameVo;
import com.zqw.bss.vo.mkt.VoucherVo;

@Service
@Qualifier("voucherService")
public class VoucherServiceImpl implements VoucherService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Autowired
	private CommonService commonService;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveVoucher(Voucher voucher) {
		logger.info("begin saveVoucher.");
		dao.save(voucher);
		logger.info("end saveVoucher.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateVoucher(Voucher voucher) {
		logger.info("begin updateVoucher.");
		dao.update(voucher);
		logger.info("end updateVoucher.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteVoucher(Long id) {
		Boolean flag = false;
		try {
			dao.removeObject(Voucher.class, id);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return flag;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Voucher> getAllVoucherByPage(BasePagerObject bso) {
		logger.info("begin getAllVoucherByPage.");
		List<Voucher> list = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, Voucher.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, Voucher.class));
		BaseModelList<Voucher> lists = new BaseModelList<Voucher>(count, WebUtil.getEntryListFromProxyList(list, dao));
		return lists;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Voucher getVoucherById(Long id) {
		logger.info("begin getVoucherById");
		Voucher voucher = (Voucher) dao.getObject(Voucher.class, id);
		if (voucher != null) {
			return voucher;
		} else {
			throw new OperationException("No Voucher Found!");
		}
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Voucher> getAllVoucherByAvailablePage(BasePagerObject bso, int use) {
		String hql = "from Voucher where available=" + use;
		String count = "SELECT COUNT(*) FROM Voucher WHERE available=" + use;
		List<Voucher> list = dao.getLst4Paging(hql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count4Paging = dao.getCount4Paging(count);
		BaseModelList<Voucher> lists = new BaseModelList<>(count4Paging, list);
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public void test1() {
		List list = dao.getLst4PagingWithSQL("select * from t_bss_voucher ", new int[] { 0, 9999 });
		System.out.println(list.size());
		Long long1 = dao.getCount4PagingWithSQL("select count(*) from t_bss_voucher ");
		System.out.println(long1);
	}
	
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Voucher> getAllVoucherPageString(BasePagerObject bso) {
		// --------------------------条件查询
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		conStr = conStr.substring(4);
		String sql = "SELECT * FROM t_bss_voucher WHERE " + conStr;
		String countSql = "SELECT COUNT(*) FROM t_bss_voucher WHERE " + conStr;
		List<Voucher> list = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(countSql);
		// List<Voucher> list = dao.getLst4Paging(HsqlUtil.genSearchSql(bso,
		// Voucher.class, null),
		// new int[] { bso.getPagenum(), bso.getPagesize() });
		// Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso,
		// Voucher.class));

		BaseModelList<Voucher> lists = new BaseModelList<>(count, list);
		return lists;
	}
	
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Voucher> getAllVoucherPageNumber(BasePagerObject bso) {
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		conStr = conStr.substring(4);
		conStr = conStr.replaceAll("'", "");
		String sql = "SELECT * FROM t_bss_voucher WHERE " + conStr;
		String countSql = "SELECT COUNT(*) FROM t_bss_voucher WHERE " + conStr;
		List<Voucher> list = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(countSql);
		BaseModelList<Voucher> lists = new BaseModelList<>(count, list);
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean putVoucher(String dispatchType,String name, String startDate, String endDate, BigDecimal amount,String[] userId,String voucherType,Long num) {

		logger.info("begin putVoucher");
		// 判断代金卷name是否为空或null
		if (name == null || name.length() <= 0) {
			throw new OperationException("代金券名称不能为空");
		}
		// 判断代金卷name是否重复
		List nameList = dao.find("from Voucher v where v.name = ?", new Object[] { name });
		if (nameList.size() != 0) {
			throw new OperationException("此代金卷已存在");
		}
		if (dispatchType.equals("SYSPUSH")) {
			for (int i = 0; i < userId.length; i++) {
				String voucherCode = commonService.getVoucherCode("COUPONS", 8);
				Voucher v = new Voucher(name, voucherCode, amount, DispatchType.SYSPUSH, startDate, endDate,
						Long.valueOf(userId[i]),voucherType);
				List list = dao.executeQuerySql("select o.loginId FROM t_crm_owner o WHERE o.id ="+userId[i]+" LIMIT 1", null);
				InformationLogs logs=new InformationLogs("您有"+amount+"元优惠券到账了！",userId[i],(String)list.get(0));
				dao.save(v);
				dao.save(logs);
			}
		}else if (dispatchType.equals("LINE")) {
			for (int i = 0; i < num; i++) {
				String voucherCode = commonService.getVoucherCode("COUPONS", 8);
				Voucher v = new Voucher(name, voucherCode, amount, DispatchType.LINE, startDate, endDate,
						voucherType);
				dao.save(v);
			}
		}
		

		logger.info("end putVoucher");
		return true;
	}
	
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Map<String, Object> getUserPage(BigDecimal amountmin, BigDecimal amountmax, String state,
			BigDecimal statemin, BigDecimal statemax, String datemin, String datemax, String user,String activitNumber) {
		// 抽出代金卷状态和付费金额
		logger.info("begin getUserPage");
		// Iterator<String> nameItr = bso.keys();
		// Map<String, String> outMap = new HashMap<String, String>();
		// while (nameItr.hasNext()) {
		// String name = nameItr.next();
		// if (name.equals("createDate")) {
		// String s = bso.getString(name);
		// String[] strA=s.split(",");
		// String z=strA[0];
		// }
		// }

		//
		// List<Condition> condition = bso.getCondition();
		// List<Condition> temp = new ArrayList<Condition>();
		String in = "";
		String stateString = "";
		
		if (amountmin.compareTo(new BigDecimal(-1)) != 0) {
			List list = dao.executeQuerySql(
					"SELECT temp.id FROM (SELECT o.id id,o.loginId loginId,SUM(pay.totalAmt) sum FROM t_crm_owner o "
							+ "LEFT JOIN t_bss_order ord ON ord.ownerId=o.id "
							+ "LEFT JOIN t_bss_order_pay pay ON pay.accountOrder_id=ord.id "
							+ "where pay.payStatus='paid' GROUP BY o.id) temp where temp.sum>" + amountmin
							+ " AND temp.sum <" + amountmax,
					null);
			if (list.size() != 0) {
				in += " AND id in(";
				for (Object object : list) {
					in += object + ",";
				}
				in = in.substring(0, in.length() - 1);
				in += ")";
			}
		}

		List list = new ArrayList<>();
		String sql = "";
		if (!state.equals("-1")) {
			if (statemin.compareTo(new BigDecimal(-1)) == 0) {
				if (state.equals("use")) {
					sql = "available='N'";
				} else if (state.equals("noUse")) {
					sql = "available='Y'";
				} else if (state.equals("overdue")) {
					sql = "overdue='Y'";
				}
				list = dao.executeQuerySql("select ownerId FROM t_bss_voucher WHERE " + sql + " GROUP BY ownerId",
						null);

			} else {

				if (state.equals("use")) {
					sql = "available='N'";
				} else if (state.equals("noUse")) {
					sql = "available='Y'";
				} else if (state.equals("overdue")) {
					sql = "overdue='Y'";
				}
				list = dao.executeQuerySql("select ownerId FROM t_bss_voucher WHERE " + sql
						+ " GROUP BY ownerId having SUM(amount)>" + statemin + " AND SUM(amount)<" + statemax, null);

			}
			if (list.size() != 0) {
				// AND (v.id=2 OR v.id=1)
				stateString += " AND (";
				for (Object object : list) {
					stateString += " id =" + object + " OR";
				}
				stateString = stateString.substring(0, stateString.length() - 3);
				stateString += ")";
			}
		}

		String conStr = "";
		// 注册时间
		if (!datemin.equals("-1")) {
			conStr += " AND createDate > '" + datemin + "' AND createDate < '" + datemax+"'";
		}
		// 用户名
		if (!user.equals("-1")) {
			conStr += " AND loginId = '"+user+"'";
		}
		//activitNumber 活动码
		if (!activitNumber.equals("-1")) {
			conStr += " AND activitNumber like '%"+activitNumber+"%'";
		}
		// if (con.getKey().equals("amount")) {
		// 判断付费金额
		// String amount[] = con.getValue();
		// List list = dao.executeQuerySql(
		// "SELECT temp.id FROM (SELECT u.id id,u.username
		// name,SUM(pay.totalAmt) sum FROM t_bss_sys_user u LEFT JOIN
		// t_crm_owner o ON o.sales_id =u.id "
		// + "LEFT JOIN t_bss_order ord ON ord.ownerId=o.id "
		// + "LEFT JOIN t_bss_order_pay pay ON
		// pay.accountOrder_id=ord.id "
		// + "where pay.payStatus='paid' " + "GROUP BY u.id) temp where
		// temp.sum>" + amount[0]
		// + " AND temp.sum <" + amount[1],
		// null);
		// List list = dao.executeQuerySql(
		// "SELECT temp.id FROM (SELECT o.id id,o.loginId
		// loginId,SUM(pay.totalAmt) sum FROM t_crm_owner o "
		// + "LEFT JOIN t_bss_order ord ON ord.ownerId=o.id "
		// + "LEFT JOIN t_bss_order_pay pay ON pay.accountOrder_id=ord.id "
		// + "where pay.payStatus='paid' GROUP BY o.id) temp where temp.sum>" +
		// amount[0]
		// + " AND temp.sum <" + amount[1],
		// null);
		// if (list.size() != 0) {
		// in += " AND id in(";
		// for (Object object : list) {
		// in += object + ",";
		// }
		// in = in.substring(0, in.length() - 1);
		// in += ")";
		// }

		// } else if (con.getKey().equals("state")) {
		// 代金卷状态
		// String state[] = con.getValue();
		// List list = new ArrayList<>();
		// String sql = "";
		// if (state.length == 1) {
		// if (state[0].equals("use")) {
		// sql = "available='N'";
		// } else if (state[0].equals("noUse")) {
		// sql = "available='Y'";
		// } else if (state[0].equals("overdue")) {
		// sql = "overdue='Y'";
		// }
		// list = dao.executeQuerySql("select ownerId FROM t_bss_voucher WHERE "
		// + sql + " GROUP BY ownerId",
		// null);
		// } else {
		//
		// if (state[0].equals("use")) {
		// sql = "available='N'";
		// } else if (state[0].equals("noUse")) {
		// sql = "available='Y'";
		// } else if (state[0].equals("overdue")) {
		// sql = "overdue='Y'";
		// }
		// list = dao.executeQuerySql("select ownerId FROM t_bss_voucher WHERE "
		// + sql
		// + " GROUP BY ownerId having SUM(amount)>" + state[1] + " AND
		// SUM(amount)<" + state[2],
		// null);
		//
		// }
		// if (list.size() != 0) {
		// // AND (v.id=2 OR v.id=1)
		// stateString += " AND (";
		// for (Object object : list) {
		// stateString += " id =" + object + " OR";
		// }
		// stateString = stateString.substring(0, stateString.length() - 3);
		// stateString += ")";
		// }
		// } else {
		// temp.add(con);
		// }
		//
		// bso.setCondition(temp);

		// String conStr = HsqlUtil.getConditionHqlStr(bso, new
		// StringBuilder());
		String sql2 = "FROM Owner WHERE 1=1 " + conStr + stateString + in+ " AND id>1";
		List<Owner> find = dao.find(sql2);
		List ids = new ArrayList<>();
		for (Owner owner : find) {
			ids.add(owner.getId());
		}
		Long count = dao.getCount4Paging("SELECT COUNT(*) FROM Owner WHERE 1=1 " + conStr + stateString + in+" AND id>1");
		Map base = new HashMap<>();
		base.put("ids", ids);
		base.put("count", count);
		logger.info("end getUserPage");
		return base;
	}
	
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<VoucherVo> getVoucherSupervise(BasePagerObject bso) {
		logger.info("begin getVoucherSupervise");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String temp = "SELECT v.name,SUM(v.amount) amount,v.dispatchType,v.startTime,v.endTime,COUNT(v.id) sum,COUNT(if(v.available='N',true,null)) as available,v.type FROM t_bss_voucher v  GROUP BY v.name ORDER BY v.createDate DESC";
		String sql = "SELECT t.* FROM (" + temp + ") t where 1=1 " + conStr;
		List list = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL("SELECT count(t.name) FROM (" + temp + ") t where 1=1 " + conStr);
		List<VoucherVo> voList = new ArrayList<>();
		for (Object object : list) {
			VoucherVo vo = new VoucherVo((Object[]) object);
			voList.add(vo);
		}
		BaseModelList<VoucherVo> base = new BaseModelList<>(count, WebUtil.getEntryListFromProxyList(voList, dao));
		logger.info("end getVoucherSupervise");
		return base;
	}
	
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<VoucherNameVo> getVouchreName(BasePagerObject bso) {
		logger.info("begin getVouchreName");
		List<Condition> condition = bso.getCondition();
		List<Condition> temp = new ArrayList<Condition>();
		for (Condition con : condition) {
			if (con.getKey().equals("type")) {
				String conValue = con.getValue()[0];
				if (!(conValue.equals("用户") || conValue.equals("用") || conValue.equals("户"))) {
					List<VoucherNameVo> listVo = new ArrayList<>();
					BaseModelList<VoucherNameVo> base = new BaseModelList<>(0L, listVo);
					logger.info("end getVouchreName");
					return base;
				}
			} else {
				temp.add(con);

			}
		}
		bso.setCondition(temp);

		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String sql = "SELECT v.voucherCode,v.amount,v.dispatchType,a.agentName,o.loginId,v.available,v.startTime,v.endTime,v.overdue FROM t_bss_voucher v  LEFT JOIN t_crm_owner o ON o.id=v.ownerId LEFT JOIN t_bss_agent a ON a.agentCode=o.agentCode WHERE 1=1 "
				+ conStr;
		List list = dao.getLst4PagingWithSQL(sql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4PagingWithSQL(
				"SELECT count(v.voucherCode) FROM t_bss_voucher v  LEFT JOIN t_crm_owner o ON o.id=v.ownerId LEFT JOIN t_bss_agent a ON a.agentCode=o.agentCode WHERE 1=1 "
						+ conStr);
		List<VoucherNameVo> listVo = new ArrayList<>();
		for (Object object : list) {
			VoucherNameVo vo = new VoucherNameVo((Object[]) object);
			listVo.add(vo);
		}
		BaseModelList<VoucherNameVo> base = new BaseModelList<>(count, listVo);
		logger.info("end getVouchreName");
		return base;
	}
	
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Boolean voucherCheck(String name) {
		logger.info("begin getVouchreName");
		String sql = "SELECT id FROM t_bss_voucher where name='" + name+"'";
		List list = dao.executeQuerySql(sql, null);

		if (list.size() != 0) {
			throw new OperationException("代金券名称重复");
		}
		logger.info("begin getVouchreName");
		return Boolean.TRUE;
	}
}
