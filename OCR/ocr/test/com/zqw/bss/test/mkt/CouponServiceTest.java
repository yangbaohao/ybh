package com.zqw.bss.test.mkt;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.model.mkt.Coupon;
import com.zqw.bss.test.ServiceTestCase;
import com.zqw.bss.vo.mkt.CouponVo;

import net.sf.json.JSONObject;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class CouponServiceTest extends ServiceTestCase{
	@Before
	public void setUp() throws Exception {
	
	}

	@After
	public void tearDown() throws Exception {

	}

	@Test
	public void test_001_Login() throws ClientProtocolException, IOException {
		super.login("admin", "yicui602");
	}
	/**
	 * 保存
	 * @throws Exception
	 */
	//@Test 
	public void test_002_Coupon() throws Exception {
		//结束日期+7天
		SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
		Date beginDate = new Date();
		Calendar date = Calendar.getInstance();
		date.setTime(beginDate);
		date.set(Calendar.DATE, date.get(Calendar.DATE) + 7);
		Date endDate1 = dft.parse(dft.format(date.getTime()));
		
		
		int couponcode=9;
		for (int i = 0; i <10; i++) {
			
			Coupon bean=new Coupon();
			bean.setCouponCode(couponcode+"");
			bean.setAvailable(false);
			bean.setStartTime(new Date());
			bean.setEndTime(endDate1);
			bean.setCreateDate(new Date());
			bean.setCreateBy("admin");
			bean.setLastUpdateDate(new Date());
			bean.setLastUpdateBy("admin");
			couponcode++;
			// 转成JSON格式
			JSONObject json = JSONObject.fromObject(bean,jsonConfig);
			String str = this.getPostRetrunStr("coupon/", json);
			System.out.println(str);
			
		}
		
		
	}
	
	/**
	 *  修改
	 */
	//@Test
	public void test_003_Coupon() throws Exception{
		Coupon bean=new Coupon();
		bean.setId(2L);
		bean.setCouponCode("0004");
		bean.setStartTime(new Date());
		bean.setEndTime(new Date());
		bean.setCreateDate(new Date());
		bean.setCreateBy("aya");
		bean.setLastUpdateDate(new Date());
		bean.setLastUpdateBy("aya");
		bean.setAvailable(true);
		String str = this.getPutRetrunStr("coupon/", bean);
		System.out.println(str);
	}
	/**
	 * 查询
	 */
	//@Test
	public void test_004_Coupon() throws Exception{
		String str = this.getGetRetrunStr("coupon/3");
		System.out.println(str);
	}
	/**
	 * 删除
	 */
	//@Test
	public void test_005_Coupon() throws Exception{
		String str = this.getDelRetrunStr("coupon/3");
		System.out.println(str);
	}
	
	/**
	 * 分页查询
	 */
	//@Test
	public void test_006_Coupon() throws Exception{
		String query = "{'condition':["
				//+"{'key':'ex.couponCode','value':['123'],'action':'like'}"
				+"{'key':'ex.ownerName','value':['a'],'action':'like'}"
				+ "]," + "'filterscount':'0',"
				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";

		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("coupon/page/" + conStr);
		System.out.println(reStr);
	}

	/**
	 * 判断优惠卷名称是否已经存在
	 */
//	@Test
	public void test_014_Coupon()throws Exception{
		String query = "{'condition':["
				+"{'key':'name','value':['优惠卷测试'],'action':'eq'}"
				+ "],"
				+ "'filterscount':'0',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String str = this.getGetRetrunStr("coupon/check/"+conStr);
		System.out.println(str);
	}
	
	/**
	 * 修改模块和使用日期
	 */
	@Test
	public void test_015_updateCoupon()throws Exception{
		CouponVo query = new CouponVo();
		query.setId(4L);
		query.setFreeTime(4L);
		query.setProducts(new Long[]{2L,3L,4L});
		String str = this.getPutRetrunStr("coupon/updateCoupon/", query);
		System.out.println(str);
	}
}
