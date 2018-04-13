package com.zqw.bss.test.billing;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Date;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.test.ServiceTestCase;
import com.zqw.bss.util.SystemConstant.PayWay;
import com.zqw.bss.util.SystemConstant.StandardMoney;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class AccountOrderPayServiceTest extends ServiceTestCase{
		
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
	
	//@Test
	public void test_002_POST_saveAccountOrderPay() throws Exception {
		AccountOrderPay accountOrderPay = new AccountOrderPay();
		
		accountOrderPay.setAccountAmt(BigDecimal.ONE);
		accountOrderPay.setAmt(BigDecimal.ONE);
		accountOrderPay.setCurrency(StandardMoney.RMB);
		accountOrderPay.setOwnerId(8L);
		accountOrderPay.setPayDate(new Date());
		accountOrderPay.setPayWay(PayWay.alipay);
		accountOrderPay.setRemark("测试数据");
		accountOrderPay.setTotalAmt(BigDecimal.ONE);
		accountOrderPay.setVouchertAmt(BigDecimal.ONE);
		
		//转成JSON格式
	    //JSONObject json = JSONObject.fromObject(bean,jsonConfig);
	    String resStr = this.getPostRetrunStr("accountOrderPay/create" , accountOrderPay);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_002_delAccountOrderPay() throws Exception {
		Long id = 4L;
		String resStr = this.getDelRetrunStr("accountOrderPay/del/" + id);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_003_updateAccountOrderPay() throws Exception {
		AccountOrderPay accountOrderPay = new AccountOrderPay();
		accountOrderPay.setId(5L);
		accountOrderPay.setRemark("测试数据update");
		
		String resStr = this.getPutRetrunStr("accountOrderPay/update", accountOrderPay);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_004_getAccountOrderPayById() throws Exception {
		Long id = 5L;
		String resStr = this.getGetRetrunStr("accountOrderPay/get/"+id);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_005_getAccountOrderPayAll() throws Exception {
		String resStr = this.getGetRetrunStr("accountOrderPay/get/AccountOrderPay");
		System.out.println(resStr);
	}
	
	//@Test
	public void test_006_getAccountOrderPayPage() throws Exception {
		
		String query = "{'condition':["
				+"{'key':'id','value':['5'],'action':'eq'}"
				+ "],"
				+ "'filterscount':'0',"
//				+ "'sortdatafield':'id',"
//				+ "'sortorder':'asc',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		
		String resStr = this.getGetRetrunStr("accountOrderPay/search/page/" + conStr);
		System.out.println(resStr);
	}
	/**
	 * 查询审批
	 */
	@Test
	public void test_007_getAccountOrderPayPage() throws Exception {
		String str = this.getGetRetrunStr("accountOrderPay/getAccountOrderPay/5");
		System.out.println(str);
	}
}
