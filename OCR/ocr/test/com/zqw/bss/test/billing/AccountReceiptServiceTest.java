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

import com.zqw.bss.model.billing.AccountReceipt;
import com.zqw.bss.test.ServiceTestCase;
import com.zqw.bss.util.SystemConstant.PayStatus;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class AccountReceiptServiceTest extends ServiceTestCase{
	
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
	public void test_004_AccountReceipt() throws Exception {
		AccountReceipt bean = new AccountReceipt();
		bean.setAddress("彭江路602");
		bean.setAmount(BigDecimal.ONE);
		bean.setCreateBy("9");
		bean.setCreateDate(new Date());
		bean.setDate(new Date());
		bean.setId(2L);
		bean.setIndustry("IT");
		bean.setLastUpdateBy("9");
		bean.setLastUpdateDate(new Date());
		bean.setOwnerId(8L);
		bean.setPayee("2");
		bean.setPayer("2");
		bean.setTaxAccount("2");
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPostRetrunStr("accountReceipt/create", bean);
		System.out.println(resStr);
	}

	// @Test
	public void test_045_AccountReceipt() throws Exception {
		String resStr = this.getGetRetrunStr("accountReceipt/get/accountReceipt");
		System.out.println(resStr);
	}

	//@Test
	public void test_046_AccountReceipt() throws Exception {
		String resStr = this.getGetRetrunStr("accountReceipt/get/accountReceiptId");
		System.out.println(resStr);
	}

	//@Test
	public void test_047_AccountReceipt() throws Exception {
		String resStr = this.getDelRetrunStr("accountReceipt/del");
		System.out.println(resStr);
	}
}
