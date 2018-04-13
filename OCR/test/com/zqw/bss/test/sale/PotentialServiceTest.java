package com.zqw.bss.test.sale;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.model.sale.Potential;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.test.ServiceTestCase;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class PotentialServiceTest extends ServiceTestCase {

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
	public void test_002_Potential() throws Exception {
		Potential bean = new Potential();
		bean.setClosingDate(new Date());
		bean.setComment("888");
		bean.setContact("3334");
		bean.setCreateBy("3");
		bean.setCreateDate(new Date());
		bean.setEmail("123@qq.com");
		bean.setLastUpdateBy("2");
		bean.setLastUpdateDate(new Date());
		bean.setPhone("18312345678");
		bean.setPotentialName("efef");
		//bean.setId(1L);
		SalesAgent salesAgent = new SalesAgent();
		salesAgent.setId(3L);
		bean.setSalesAgent(salesAgent);
		List<PotentialTrack> trackList = new ArrayList<PotentialTrack>();
		PotentialTrack pt = new PotentialTrack();
		pt.setCreateBy("9");
		trackList.add(pt);
		bean.setTrackList(trackList);
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPostRetrunStr("potential/", bean);
		System.out.println(resStr);
	}

	// @Test
	public void test_003_Potential() throws Exception {
		Potential bean = new Potential();
		bean.setClosingDate(new Date());
		bean.setComment("888");
		bean.setContact("3334");
		bean.setCreateBy("3");
		bean.setCreateDate(new Date());
		bean.setEmail("123@qq.com");
		bean.setLastUpdateBy("2");
		bean.setLastUpdateDate(new Date());
		bean.setPhone("18312345678");
		bean.setPotentialName("efef");
		SalesAgent salesAgent = new SalesAgent();
		salesAgent.setId(1L);
		bean.setSalesAgent(salesAgent);
		List<PotentialTrack> trackList = new ArrayList<PotentialTrack>();
		PotentialTrack pt = new PotentialTrack();
		pt.setCreateBy("9");
		trackList.add(pt);
		bean.setTrackList(trackList);
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPutRetrunStr("potential/", bean);
		System.out.println(resStr);
	}

	// @Test
	public void test_004_Potential() throws Exception {

		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getGetRetrunStr("potential/1");
		System.out.println(resStr);
	}

	// @Test
	public void test_005_Potential() throws Exception {

		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getDelRetrunStr("potential/1");
		System.out.println(resStr);
	}

	//@Test
	public void test_003_GET_getProductByPage() throws ClientProtocolException, IOException {
		// 执行DEL请求，并判断返回值
		String query = "{'condition':[]," + "'filterscount':'0'," + "'sortdatafield':'id'," + "'sortorder':'desc',"
				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";

		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("potential/page/" + conStr);
		System.out.println(reStr);
	}
	
	/**
	 * 测试条件查询
	 */
	@Test
	public void test_006_Potential() throws Exception{
		String query = "{'condition':["
				+"{'key':'createDate','value':['2016-08-24 00:00:00','2016-08-31 23:59:59'],'action':'between',},"
				+ "{'key':'status','value':['success'],'action':'eq',}"		
				+ "],"
				+ "'filterscount':'0',"
				+ "'pagenum':'0',"
				+ "'pagesize':'10',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'1000'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("potential/page/" + conStr);
		System.out.println(reStr);
	}
}
