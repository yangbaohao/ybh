package com.zqw.bss.test.crm;

import static org.junit.Assert.assertNotNull;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.test.ServiceTestCase;
import com.zqw.bss.util.SystemConstant.Accountingstandards;
import com.zqw.bss.util.SystemConstant.StandardMoney;
import com.zqw.bss.util.SystemConstant.TaxType;

import net.sf.json.JSONObject;

/**
 * <p>Title:</p>
 * <p>Description:系统注册测试类</p>
 * <p>Copyright: Copyright (c) 2016 www.accountyun.com</p>
 * <p>Company:zqw</p>
 * @author lzy
 * @date 2016年4月15日 下午2:33:26
 * @version 1.0
 */

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@SuppressWarnings({"unused", "unchecked" , "rawtypes"})
public class OwnerServiceTest extends ServiceTestCase {

	
	private static String test_global_id = "1";
	
	@Before
	public void setUp() throws Exception {
	}

	@After
	public void tearDown() throws Exception {
	}
	
	@Test
	public void test_001_Login() throws ClientProtocolException, IOException {
		super.login("20161029", "123456");
	}
	
	//@Test
	public void test_002_getOwner() throws ClientProtocolException, IOException {
	
		String reStr = this.getGetRetrunStr("owner/get");
		String res=reStr.toString();
		System.out.println(res);
	}
	
	//@Test
	public void test_003_updateOwner() throws ClientProtocolException, IOException {
		Owner ow=new Owner();
		ow.setId(1l);
		//ow.setCategory1Flag(true);
		ow.setCurrency(StandardMoney.RMB);
        ow.setVat(5L);
        //ow.setStartMonth("2016-05-30");
		String reStr = this.getPutRetrunStr("owner/update",ow);
		String res=reStr.toString();
		System.out.println(res);
	}
	
	//@Test
	public void test_004_updateOwnerBizFlag() throws ClientProtocolException, IOException {
		String userStr = this.getPutRetrunStr("owner/updateOwnerFlag/1/journalauditFlag/false");
		JSONObject clientJson = JSONObject.fromObject(userStr);
		String res=clientJson.toString();
		System.out.println(userStr);
	}
	
	//@Test
	public void test_005_Post_CreateRegInfoAll() throws ClientProtocolException,
		IOException,Exception{
		
		// 构建用户对象
		Map map = new HashMap();
		
		map.put("username", "201610291047");
		map.put("enterpriseName", "公司名称测试");
		map.put("taxType", "smallscale");
		map.put("vat", 5);
		map.put("startMonth", "2016-06");
		
		// 执行POST请求，并判断返回值
		String userStr = this.getPostRetrunStr("owner/direct/reg", map);
		assertNotNull("返回的用户对象为空！" , userStr);
	}
	
	//@Test
	public void test_006_Put_UpdateUserPwd() throws ClientProtocolException, IOException {
		String valid = "300139";
		// 构建用户对象
		User user = new User();
		user.setUsername("admin");
		user.setPassword("1");
		//转换JSON格式
		JSONObject userJson = JSONObject.fromObject(user , ServiceTestCase.jsonConfig);
		// 执行PUT请求，并判断返回值
		String userStr = this.getPutRetrunStr("owner/direct/upwd"+valid , userJson);
		assertNotNull("返回的用户对象为空！" , userStr);
	}
	
	//@Test
	public void test_007_Get_GetUserInfoById() throws ClientProtocolException, IOException {
		// 执行GET请求，并判断返回值
		String userStr = this.getGetRetrunStr("owner/direct/login/admin");
		assertNotNull("返回的用户对象为空！" , userStr);
	}
	
	//@Test
	public void test_008_Get_GetUserInfoById() throws ClientProtocolException, IOException {
		// 执行GET请求，并判断返回值
		String phone = "15216743826";
		String userStr = this.getGetRetrunStr("owner/direct/valid/" + phone);
		assertNotNull("返回的用户对象为空！" , userStr);
	}
	
	//@Test
	public void test_008_Get_GetPhoneByUsername() throws ClientProtocolException, IOException {
		// 执行GET请求，并判断返回值
		String userStr = this.getGetRetrunStr("owner/direct/phone/admin");
		assertNotNull("返回的用户对象为空！" , userStr);
	}
	
	//@Test
	public void test_009_Get_GetPhoneByUsername() throws ClientProtocolException, IOException {
		String str = this.getPutRetrunStr("owner/updatePeriod","2016-06");
		System.out.println(str);
	}
	
	//@Test
	public void test_010_Put_PutUpdateOwnerFlag() throws ClientProtocolException, IOException {
		Map<String , Boolean> map = new HashMap<String ,Boolean>();
		map.put("category1Flag", false);
		map.put("category2Flag", false);
		map.put("journalauditFlag", false);
		map.put("producttypeFlag", false);
		map.put("productunitFlag", false);
		String str = this.getPutRetrunStr("owner/flag",map);
		System.out.println(str);
	}
	
	//@Test
	public void test_011_Put_PutUpdateOwnerInfo() throws ClientProtocolException, IOException {
		Map<String,String> map = new HashMap<String ,String>();
		
		map.put("ownerId", "313");
		map.put("enterpriseName", "公司名称测试1");
		map.put("taxType", "smallscale");
		map.put("vat", "16");
		map.put("startMonth", "2016-05");
		
		String str = this.getPutRetrunStr("owner/updateLoginById",map);
		System.out.println(str);
	}
	
	//@Test
	public void test_012_Get_GetOwnerInfoVoAll() throws ClientProtocolException, IOException {
		
		// 执行GET请求，并判断返回值
		String query = "{'condition':["
				+"{'key':'owner.id','value':['1'],'action':'eq'}],"
				+ "'filterscount':'0',"
				+ "'sortdatafield':'owner.id',"     //owner.id
				+ "'sortorder':'',"                 //desc
				+ "'pagenum':'0',"
				+ "'pagesize':'100',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'30'}";
		byte[] b = query.getBytes();
		//String conStr = new BASE64Encoder().encode(b);       /"+conStr
		String conStr = Encodes.encodeBase64(b);
				
		String ownerInfoStr = this.getGetRetrunStr("owner/search/page");
		System.out.println(ownerInfoStr);
		assertNotNull("返回的注册展示信息为空！", ownerInfoStr);
	
	}
	
	@Test
	public void test_013_Put_updateTaxCodeByName() throws ClientProtocolException, IOException {
		Map<String,String> map = new HashMap<String ,String>();
		
		map.put("name", "qwer123");
		map.put("taxCode", "20161");
		String str = this.getPutRetrunStr("owner/updateTaxCodeByName",map);
		System.out.println(str);
	}
	
}
