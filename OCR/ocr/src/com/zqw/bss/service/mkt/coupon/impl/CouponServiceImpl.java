package com.zqw.bss.service.mkt.coupon.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.model.mkt.Coupon;
import com.zqw.bss.service.mkt.coupon.CouponService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
import com.zqw.bss.vo.mkt.CouponVo;

@Service
@Qualifier("couponService")
public class CouponServiceImpl implements CouponService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveCoupon(Coupon coupon) {
		logger.info("begin saveCoupon.");
		dao.save(coupon);
		logger.info("end saveCoupon.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateCoupon(Coupon coupon) {
		logger.info("begin updateCoupon.");
		dao.update(coupon);
		logger.info("end updateCoupon.");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteCoupon(Long id) {
		Boolean flag = false;
		try {
			dao.removeObject(Coupon.class, id);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
		}
		return flag;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Coupon> getAllCouponByPage(BasePagerObject bso) {
		logger.info("begin getAllCouponByPage.");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		String selectSql = "select ex.* ";
		String fromSql = "from(select c.id, c.couponCode, group_concat(DISTINCT ap.productName) AS accountProductName, c.available, c.freeTime, c.startTime, c.endTime, ifnull(o.loginId,'') AS ownerName from t_bss_coupon c "
				+ "LEFT JOIN t_bss_coupon_product_info cpi ON c.id = cpi.coupon_id "
				+ "LEFT JOIN t_bss_account_product ap ON ap.id = cpi.account_product_id "
				+ "LEFT JOIN t_crm_owner o ON c.ownerId=o.id "
				+ "GROUP BY c.couponCode "
				+ "ORDER BY c.available DESC, c.startTime DESC, c.createDate DESC, c.id DESC"
				+ ") ex WHERE 1=1 "+conStr;
		List list = dao.getLst4PagingWithSQL(selectSql + fromSql, new int[] { bso.getPagenum(), bso.getPagesize() });
		List<CouponVo> voList=new ArrayList<>();
		for (Object object : list) {
			Object[] o= (Object[])object;
			CouponVo vo=new CouponVo(o);
			voList.add(vo);
		}
		String countSql = "select count(ex.id) ";
		Long count = dao.getCount4PagingWithSQL(countSql + fromSql);
		BaseModelList<Coupon> lists = new BaseModelList<Coupon>(count, WebUtil.getEntryListFromProxyList(voList, dao));
		return lists;

	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Coupon getCouponById(Long id) {
		logger.info("begin getCouponById");
		Coupon coupon = (Coupon) dao.getObject(Coupon.class, id);
		if (coupon != null) {
			return coupon;
		} else {
			throw new OperationException("No Coupon Found!");
		}
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Boolean couponCheck(String name) {
		logger.info("begin getVouchreName");
		String sql = "SELECT id FROM t_bss_coupon where name='" + name+"'";
		List list = dao.executeQuerySql(sql, null);

		if (list.size() != 0) {
			throw new OperationException("代金券名称重复");
		}
		logger.info("begin getVouchreName");
		return Boolean.TRUE;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateProductAndFreeTime(CouponVo couponvo) {
		Coupon coupon = (Coupon) dao.getObject(Coupon.class, couponvo.getId());
		Long[] products = couponvo.getProducts();
		if(!coupon.getAvailable())
			throw new OperationException("已使用的使用券不可以编辑");
		//产品集合
		List<AccountProduct> accountProductList = new ArrayList<AccountProduct>();
		//循环产品id保存到产品集合
			for(int p=0;p<products.length;p++){
				if(products[p]!=null){
					//后台赠送开通服务
					Long pid=products[p];
					//产品
					AccountProduct accountProduct = new AccountProduct();
					accountProduct.setId(pid);
					accountProductList.add(accountProduct);
				}
			}
		coupon.setAccountProductList(accountProductList);
		coupon.setFreeTime(couponvo.getFreeTime());
		coupon.setLastUpdateBy((String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME));
		coupon.setLastUpdateDate(new Date());
		dao.update(coupon);
		return true;
	}
}
