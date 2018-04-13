package com.zqw.bss.test.sys;

import java.io.IOException;

import org.apache.http.client.ClientProtocolException;
import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.test.ServiceTestCase;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class UserServiceTest extends ServiceTestCase {
	@Before
	public void setUp() throws Exception {

	}

	@After
	public void tearDown() throws Exception {

	}

	@Test
	public void test_001_Login() throws ClientProtocolException, IOException {
		super.login("admin", "yicui602");
	}

	// @Test
	public void test_002_User() throws Exception {
		String query = "{'condition':[" + "{'key':'locked','value':['N'],'action':'eq'}"
				+ ",{'key':'username','value':['aya'],'action':'like'}" + "]," + "'filterscount':'0',"
				+ "'pagenum':'0'," + "'pagesize':'20'," + "'recordstartindex':'0'," + "'recordendindex':'20'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("user/sales/" + conStr);
		System.out.println(reStr);
	}

	@Test
	public void test_003_UserTax() throws Exception {
		String query = "{'condition':["
/*				+ "{'value':['2016-09-10 00:00:00','2016-09-16 23:59:59'],'action':'between','key':'user.createDate'} ,"
				+ "{'key':'user.employeeCode','value':[''],'action':'like'} ,"
				+ "{'key':'user.username','value':[''],'action':'like'} ,"
				+ "{'key':'user.locked','value':[''],'action':'eq'}"*/
				+ "]," 
				+ "'filterscount':'0'," + "'pagenum':'0'," + "'pagesize':'20',"
				+ "'recordstartindex':'0'," + "'recordendindex':'20'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String resStr = this.getGetRetrunStr("user/userTax/-1/-1/" + conStr);
		System.out.println(resStr);
	}

}
