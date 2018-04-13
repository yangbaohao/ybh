package com.zqw.bss.test.mkt;

import java.io.IOException;
import java.math.BigDecimal;
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
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.test.ServiceTestCase;
import com.zqw.bss.util.SystemConstant.DispatchType;

import net.sf.json.JSONObject;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class VoucherServiceTest extends ServiceTestCase{
	@Before
	public void setUp() throws Exception {

	}

	@After
	public void tearDown() throws Exception {

	}

	@Test
	public void test_001_Login() throws ClientProtocolException, IOException {
		super.login("admin", "yicui338");
	}
	/**
	 * 保存
	 * @throws Exception
	 */
	//@Test 
	public void test_002_Voucher() throws Exception {
		//结束日期+7天
		SimpleDateFormat dft = new SimpleDateFormat("yyyy-MM-dd");
		Date beginDate = new Date();
		Calendar date = Calendar.getInstance();
		date.setTime(beginDate);
		date.set(Calendar.DATE, date.get(Calendar.DATE) + 7);
		Date endDate1 = dft.parse(dft.format(date.getTime()));
		
		
		int vouchercode=9;
		for (int i = 0; i <10; i++) {
			
			Voucher bean=new Voucher();
			bean.setVoucherCode(vouchercode+"");
			bean.setName("测试代金卷2");
			bean.setAmount(new BigDecimal("1"));
			bean.setAvailable(false);
			bean.setDispatchType(DispatchType.VIP);
			bean.setStartTime(new Date());
			bean.setEndTime(endDate1);
			bean.setCreateDate(new Date());
			bean.setCreateBy("admin");
			bean.setLastUpdateDate(new Date());
			bean.setLastUpdateBy("admin");
			vouchercode++;
			// 转成JSON格式
			JSONObject json = JSONObject.fromObject(bean,jsonConfig);
			String str = this.getPostRetrunStr("voucher/", json);
			System.out.println(str);
			
		}
		
		
	}
	
	/**
	 *  修改
	 */
	//@Test
	public void test_003_Voucher() throws Exception{
		Voucher bean=new Voucher();
		bean.setId(2L);
		bean.setVoucherCode("0004");
		bean.setName("测试代金卷2");
		bean.setAmount(new BigDecimal("1"));
		bean.setStartTime(new Date());
		bean.setEndTime(new Date());
		bean.setCreateDate(new Date());
		bean.setCreateBy("aya");
		bean.setLastUpdateDate(new Date());
		bean.setLastUpdateBy("aya");
		bean.setDispatchType(DispatchType.OTHER);
		bean.setAvailable(true);
		String str = this.getPutRetrunStr("voucher/", bean);
		System.out.println(str);
	}
	/**
	 * 查询
	 */
	//@Test
	public void test_004_Voucher() throws Exception{
		String str = this.getGetRetrunStr("voucher/3");
		System.out.println(str);
	}
	/**
	 * 删除
	 */
	//@Test
	public void test_005_Voucher() throws Exception{
		String str = this.getDelRetrunStr("voucher/3");
		System.out.println(str);
	}
	
	/**
	 * 分页查询
	 */
	//@Test
	public void test_006_Voucher() throws Exception{
		String query = "{'condition':[]," + "'filterscount':'0',"
				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";

		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("voucher/page/" + conStr);
		System.out.println(reStr);
	}
	/**
	 * 是否使用分页查询
	 */
	//@Test
	public void test_007_Voucher() throws Exception{
		String query = "{'condition':[]," + "'filterscount':'0',"
				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";

		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("voucher/available/" + conStr+"/"+1);
		System.out.println(reStr);
	}
	/**
	 * 测试
	 */
	//@Test
	public void test_008_Voucher()throws Exception{
		this.getGetRetrunStr("voucher/test");	
	}
	/**
	 * 条件查询
	 */
	//@Test
	public void test_009_Voucher()throws Exception{
//		String query = "{'condition':[{key:"+"\"available\""+",value:[1],action:'eq'}]," + "'filterscount':'0',"
//				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";
		
		
		String query = "{'condition':["
				+"{'key':'available','value':['1'],'action':'eq'}"
				+ "],"
				+ "'filterscount':'0',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String str = this.getGetRetrunStr("voucher/PageNumber/"+conStr);
		System.out.println(str);
	}
	/**
	 * 发放优惠卷
	 * @throws Exception
	 */
	//@Test
	public void test_010_Voucher()throws Exception{
		String query = "{'condition':["
				+"{'key':'value','value':['优惠卷测试','2016-08-08 12:10:12','2017-08-08 12:10:12','100'],'action':'eq'},"
				+"{'key':'userId','value':['2','4'],'action':'eq'}"
				+ "],"
				+ "'filterscount':'0',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		this.getGetRetrunStr("voucher/putVoucher/"+conStr);
	}
	
	/**
	 * 代金卷搜索
	 */
	@Test
	public void test_011_Voucher()throws Exception{
		String query = "{'condition':["
				+"{'key':'createDate','value':['2016-08-24 00:00:00','2016-10-31 23:59:59'],'action':'between'}"
				//+"{'key':'loginId','value':['xiaoming'],'action':'eq'}"
				//+"{'key':'amount','value':['100','50000'],'action':'between'}"
				//+"{'key':'state','value':['noUse','100','50000'],'action':'between'}"
				//+"{'key':'state','value':['noUse'],'action':'between'}"
				+ "],"
				+ "'filterscount':'0',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String str = this.getGetRetrunStr("voucher/search/page/"+conStr);
		System.out.println(str);
	}
	/**
	 * 查询所有代金卷 
	 */
	//@Test
	public void test_012_Voucher()throws Exception{
		String query = "{'condition':["
				+"{'key':'t.name','value':['优惠卷测试'],'action':'like'},"
				+"{'key':'t.sum','value':['1','90000'],'action':'between'},"
				+"{'key':'t.dispatchType','value':['SYSPUSH'],'action':'eq'},"
				+"{'key':'t.startTime','value':['2015-08-24 00:00:00','2019-10-31 23:59:59'],'action':'between'},"
				+"{'key':'t.endTime','value':['2015-08-24 00:00:00','2019-10-31 23:59:59'],'action':'between'},"
				+"{'key':'t.sum','value':['1','999'],'action':'between'}"
				+ "],"
				+ "'filterscount':'0',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String str = this.getGetRetrunStr("voucher/voucherSupervise/"+conStr);
		System.out.println(str);
	}
	/**
	 * 查询代金卷详情
	 */
	//@Test
	public void test_013_Voucher()throws Exception{
		String query = "{'condition':["
				+"{'key':'v.voucherCode','value':['GMFWZF'],'action':'like'},"
				+"{'key':'a.agentName','value':['xiaoming'],'action':'like'},"
				+"{'key':'o.loginId','value':['777'],'action':'like'}"
				+ "],"
				+ "'filterscount':'0',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String str = this.getGetRetrunStr("voucher/voucherName/"+conStr);
		System.out.println(str);
	}
	/**
	 * 判断优惠卷名称是否已经存在
	 */
//	@Test
	public void test_014_Voucher()throws Exception{
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
		String str = this.getGetRetrunStr("voucher/check/"+conStr);
		System.out.println(str);
	}
}
