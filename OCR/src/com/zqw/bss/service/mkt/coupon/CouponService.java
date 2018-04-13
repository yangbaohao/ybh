package com.zqw.bss.service.mkt.coupon;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.mkt.Coupon;
import com.zqw.bss.vo.mkt.CouponVo;

public interface CouponService {

	/**
	 * 创建免费兑换券
	 */
	public Boolean saveCoupon(Coupon coupon);
	
	/**
	 * 修改免费兑换券
	 */
	public Boolean updateCoupon(Coupon coupon);
	
	/**
	 * 删除免费兑换券
	 */
	public Boolean deleteCoupon(Long id);
	
	/**
	 * 根据id查一个
	 */
	public Coupon getCouponById(Long id);
	
	/**
	 * 分页查询
	 */
	public BaseModelList<Coupon>getAllCouponByPage(BasePagerObject bso);
	
	/**
	 * 验证兑换券名称是否重复
	 * @param bso
	 * @return
	 */
	public Boolean couponCheck(String name);

	
	/**
	 * 修改模块信息和有效月份
	 * @param id
	 * @param products
	 * @param freeTime
	 * @return
	 */
	public Boolean updateProductAndFreeTime(CouponVo couponvo); 
}
