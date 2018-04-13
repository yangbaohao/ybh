package com.zqw.bss.service.remote.mkt.coupon.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.mkt.Coupon;
import com.zqw.bss.service.mkt.coupon.CouponService;
import com.zqw.bss.service.remote.mkt.coupon.RemoteCouponService;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.mkt.CouponVo;

public class RemoteCouponServiceImpl implements RemoteCouponService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected CouponService couponService;

	
	 @Override
	 public Boolean saveCoupon(Coupon coupon) {
	 logger.info("begin saveCoupon. id = ["+coupon.getId()+"]");
	 return couponService.saveCoupon(coupon);
	 }
	
	 @Override
	 public Boolean updateCoupon(Coupon coupon) {
	 logger.info("begin updateCoupon. id = ["+coupon.getId()+"]");
	 return couponService.updateCoupon(coupon);
	 }
	
	 @Override
	 public Coupon getCouponById(Long id) {
	 logger.info("begin getCouponById. id = ["+id+"]");
	 return (Coupon)
	 WebUtil.getEntryFromProxyObj(couponService.getCouponById(id));
	
	 }
	
	 @Override
	 public Boolean deleteCoupon(Long id) {
	 logger.info("begin deleteCoupon. id = ["+id+"]");
	 return couponService.deleteCoupon(id);
	 }
	
	 @Override
	 public BaseModelList<Coupon> getAllCouponByPage(String query) {
	 logger.info("begin getAllCouponByPage");
	 String request = HsqlUtil.DecodeRequest(query);
	 BasePagerObject bso = HsqlUtil.toPager(request);
	 return couponService.getAllCouponByPage(bso);
	 }
	
	@Override
	public Boolean couponCheck(String name) {
		logger.info("begin couponCheck");
		Boolean check = couponService.couponCheck(name);
		logger.info("end couponCheck");
		return check;
	}

	@Override
	public Boolean updateProductAndFreeTime(CouponVo couponvo) {
		logger.info("begin updateCoupon. id = ["+couponvo.getId()+"]");
		 return couponService.updateProductAndFreeTime(couponvo);
	}

}
