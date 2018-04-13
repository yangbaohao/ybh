package com.zqw.bss.test.sale;

import java.io.IOException;
import java.util.Date;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.model.crm.EnterpriseInfo;
import com.zqw.bss.model.crm.PersonInfo;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.test.ServiceTestCase;

import net.sf.json.JSONObject;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class SalesAgentServiceTest extends ServiceTestCase {

	@Before
	public void setUp() throws Exception {

	}

	@After
	public void tearDown() throws Exception {

	}

	@Test
	public void test_001_Login() throws ClientProtocolException, IOException {
		//super.login("admin", "yicui338");
		super.login("xiaoming", "123456");
	}

	//@Test
	public void test_002_SalesAgent() throws Exception {
		SalesAgent bean = new SalesAgent();
		bean.setAgentCode("00099");
		User person = new User();
		person.setId(10L);
		bean.setSales(person);
		EnterpriseInfo e=new EnterpriseInfo();
		e.setCreateBy("9");
		e.setCreateDate(new Date());
		e.setOwnerId(-1L);
		e.setName("cess");
		bean.setUserInfo(e);
		bean.setType("enterprise");
		// 转成JSON格式
		JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		Object obj = json.get("userInfo");
		JSONObject job = JSONObject.fromObject(obj);
		job.accumulate("type", "enterprise");
		json.remove("userInfo");
		json.accumulate("userInfo", job);
		
		Object obj1 = json.get("personInfo");
		JSONObject job1 = JSONObject.fromObject(obj1);
		job1.accumulate("type", "person");
		json.remove("personInfo");
		json.accumulate("personInfo", job1);
		String resStr = this.getPostRetrunStr("salesAgent/", json);
		System.out.println(resStr);
	}

	// @Test
	public void test_003_SalesAgent() throws Exception {
		SalesAgent bean = new SalesAgent();
		bean.setAgentCode("00094");
		PersonInfo pi = new PersonInfo();
		pi.setId(38L);
		bean.setUserInfo(pi);
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);   
		String resStr = this.getPutRetrunStr("salesAgent/", bean);
		System.out.println(resStr);
	}

	//@Test
	public void test_004_SalesAgent() throws Exception {

		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getGetRetrunStr("salesAgent/8");
		System.out.println(resStr);
	}

	// @Test
	public void test_005_SalesAgent() throws Exception {

		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getDelRetrunStr("salesAgent/1");
		System.out.println(resStr);
	}

	//@Test
	public void test_003_GET_getProductByPage() throws ClientProtocolException, IOException {
		// 执行DEL请求，并判断返回值
		String query = "{'condition':[]," + "'filterscount':'0',"
				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";

		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("salesAgent/page/" + conStr);
		System.out.println(reStr);
	}
	/**
	 * 多条件查询测试
	 */
	//@Test
	public void test_006_SalesAgent() throws Exception{
		String query = "{'condition':["
				+"{'key':'sales.locked','value':['N'],'action':'eq'}"
				+ "],"
				+ "'filterscount':'0',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String str = this.getGetRetrunStr("salesAgent/page/"+conStr);
		System.out.println(str);
	}
	
	@Test
	public void test_007_SalesAgent() throws Exception{
		String str = this.getGetRetrunStr("agentRevenue/agentRevenueAll");
		System.out.println(str);
	}
}
