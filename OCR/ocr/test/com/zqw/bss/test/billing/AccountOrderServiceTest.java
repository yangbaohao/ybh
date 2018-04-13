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
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.test.ServiceTestCase;
import com.zqw.bss.util.SystemConstant.PayStatus;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class AccountOrderServiceTest extends ServiceTestCase {

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

	@Test
	public void test_002_POST_saveAccountOrder() throws Exception {
		AccountOrder accountOrder = new AccountOrder();
		
		accountOrder.setChannel("渠道1");
		accountOrder.setOrderCode("订单编号");
		accountOrder.setOrderCreateDate(new Date());
		accountOrder.setTotalAmt(new BigDecimal("1000"));
		accountOrder.setPayStatus(PayStatus.notpaid);
		accountOrder.setOwnerId(1L);
		accountOrder.setOrderBeginDate(new Date());
		
		//转成JSON格式
	    //JSONObject json = JSONObject.fromObject(bean,jsonConfig);
	    String resStr = this.getPostRetrunStr("accountOrder/create" , accountOrder);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_002_delAccountOrderById() throws Exception {
		Long id = 4L;
		String resStr = this.getDelRetrunStr("accountOrder/del/" + id);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_003_updateAccountOrder() throws Exception {
		AccountOrder accountOrder = new AccountOrder();
		accountOrder.setId(5L);
		accountOrder.setOrderCode("订单编号update");
		
		String resStr = this.getPutRetrunStr("accountOrder/update", accountOrder);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_004_getAccountOrderById() throws Exception {
		Long id = 5L;
		String resStr = this.getGetRetrunStr("accountOrder/get/"+id);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_005_getAllAccountOrder() throws Exception {
		String resStr = this.getGetRetrunStr("accountOrder/get/accountorder");
		System.out.println(resStr);
	}
	
	//@Test
	public void test_006_getAccountOrderPage() throws Exception {
		
		String query = "{'condition':["
				+"{'key':'a.id','value':['8'],'action':'eq'}"
				+ "],"
				+ "'filterscount':'0',"
//					+ "'sortdatafield':'id',"
//					+ "'sortorder':'asc',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		
		String resStr = this.getGetRetrunStr("accountOrder/search/page/" + conStr);
		System.out.println(resStr);
	}
}
