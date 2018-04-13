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
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.test.ServiceTestCase;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class PotentialTrackServiceTest extends ServiceTestCase {

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
	public void test_002_PotentialTrack() throws Exception {
		PotentialTrack bean = new PotentialTrack();
		bean.setPlanDate(new Date());
		bean.setComment("8999");
		bean.setCreateBy("9");
		bean.setCreateDate(new Date());
		bean.setLastUpdateBy("33");
		bean.setLastUpdateDate(new Date());
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPostRetrunStr("potentialTrack/", bean);
		System.out.println(resStr);
	}

	// @Test
	public void test_003_PotentialTrack() throws Exception {
		PotentialTrack bean = new PotentialTrack();

		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPutRetrunStr("potentialTrack/", bean);
		System.out.println(resStr);
	}

	// @Test
	public void test_004_PotentialTrack() throws Exception {

		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getGetRetrunStr("potentialTrack/1");
		System.out.println(resStr);
	}

	// @Test
	public void test_005_PotentialTrack() throws Exception {

		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getDelRetrunStr("potentialTrack/1");
		System.out.println(resStr);
	}

	@Test
	public void test_003_GET_getProductByPage() throws ClientProtocolException, IOException {
		// 执行DEL请求，并判断返回值
		String query = "{'condition':[]," + "'filterscount':'0'," + "'sortdatafield':'id'," + "'sortorder':'desc',"
				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";

		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("potentialTrack/page/" + conStr);
		System.out.println(reStr);
	}
}
