package com.zqw.bss.test.sale;


import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.sale.AgentRevenue;
import com.zqw.bss.test.ServiceTestCase;
import com.zqw.bss.util.SystemConstant.PayStatus;

import net.sf.json.JSONObject;


@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class AgentRevenueServiceTest extends ServiceTestCase{

	@Before
	public void setUp() throws Exception {
		
	}

	@After
	public void tearDown() throws Exception {
		
	}

	@Test
	public void test_001_Login() throws ClientProtocolException, IOException {
		super.login("admin", "yicui338");
		//super.login("xiaoming", "123456");
	}
	
	//@Test
	public void test_002_AgentRevenue() throws Exception {
		AgentRevenue bean=new AgentRevenue();
		AccountOrderPay op=new AccountOrderPay();
//		op.setId(10L);
		op.setAmt(BigDecimal.ONE);
		//bean.setId(23L);
		bean.setAccountOrderPay(op);
		bean.setPayStatus(PayStatus.paid);
		bean.setRevenueAmt(BigDecimal.ONE);
		//转成JSON格式
	    //JSONObject json = JSONObject.fromObject(bean,jsonConfig);
	    String resStr = this.getPostRetrunStr("agentRevenue/", bean);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_003_AgentRevenue() throws Exception {
		AgentRevenue bean=new AgentRevenue();
		AccountOrderPay op=new AccountOrderPay();
		op.setId(10L);
		op.setAmt(BigDecimal.ONE);
		bean.setId(5L);
		bean.setAccountOrderPay(op);
		bean.setPayStatus(PayStatus.paid);
		bean.setRevenueAmt(BigDecimal.ZERO);
		//转成JSON格式
	    //JSONObject json = JSONObject.fromObject(bean,jsonConfig);
	    String resStr = this.getPutRetrunStr("agentRevenue/", bean);
		System.out.println(resStr);
	}
	
	//@Test
	public void test_004_AgentRevenue() throws Exception {
		
		//转成JSON格式
	    //JSONObject json = JSONObject.fromObject(bean,jsonConfig);
	    String resStr = this.getGetRetrunStr("agentRevenue/1");
		System.out.println(resStr);
	}
	
	//@Test
	public void test_005_AgentRevenue() throws Exception {
		
		//转成JSON格式
	    //JSONObject json = JSONObject.fromObject(bean,jsonConfig);
	    String resStr = this.getDelRetrunStr("agentRevenue/1");
		System.out.println(resStr);
	}
	
	//@Test
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
		String reStr = this.getGetRetrunStr("agentRevenue/page/"+conStr);
		System.out.println(reStr);
	}
//	@Test
	public void test_006_AgentRevenue() throws Exception {
		//long[]ceshi={5};	
		//String str = this.getGetRetrunStr("agentRevenue/updateAgentRevenueApply/"+ceshi);
		//String str = this.getGetRetrunStr("agentRevenue/updateAgentRevenueApply/[5]");
		List<AgentRevenue> agentRevenue=new ArrayList<>();
		AgentRevenue revenue=new AgentRevenue();
		revenue.setId(5L);
		AgentRevenue revenue2=new AgentRevenue();
		revenue2.setId(7L);
		agentRevenue.add(revenue);
		agentRevenue.add(revenue2);
		String str = this.getPostRetrunStr("agentRevenue/updateAgentRevenueApply/",agentRevenue);
		System.out.println(str);
	}
	/**
	 * 申请审批
	 */
	@Test
	public void test_007_AgentRevenue() throws Exception {
		AgentRevenue revenue=new AgentRevenue();
		revenue.setId(7L);
		revenue.setRemark("申请不通过");
		revenue.setPayStatus(PayStatus.notpaid);
		String str = this.getPostRetrunStr("agentRevenue/examine",revenue);
		System.out.println(str);
	}
}
