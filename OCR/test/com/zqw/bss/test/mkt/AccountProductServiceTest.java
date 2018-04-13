package com.zqw.bss.test.mkt;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.test.ServiceTestCase;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class AccountProductServiceTest extends ServiceTestCase{
	
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

//	@Test
	public void test_003_GET_getProductByPage() throws ClientProtocolException, IOException {
			// 执行DEL请求，并判断返回值
		String query = "{'condition':[],"
				+ "'filterscount':'0',"
				+ "'sortdatafield':'id',"
				+ "'sortorder':'desc',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'30'}";
		
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("accountproduct/page/"+conStr);
		System.out.println(reStr);
	}
	@Test
	public void test_001_GET_getProductByPage() throws ClientProtocolException, IOException {
		AccountProduct accountProduct = new AccountProduct();
		accountProduct.setDescription("");
		
	}
}
