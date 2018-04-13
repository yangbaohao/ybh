package com.zqw.bss.test.common;

import java.io.File;
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
public class CommonServiceTest extends ServiceTestCase {
	@Before
	public void setUp() throws Exception {

	}

	@After
	public void tearDown() throws Exception {

	}

	@Test
	public void test_001_Login() throws ClientProtocolException, IOException {
		super.login("baoshui", "123456");
	}
	
	//@Test
	public void test_002_Owner() throws Exception{
		/*String query = "{'condition':[{'value':['2016-09-10 00:00:00','2016-09-16 23:59:59'],'action':'between','key':'t.createDate'}],"
				+ "'pagenum':'0',"
				+ "'pagesize':'5',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'5'}";*/
		String query = "{'condition':["
				+ "{'key':'ownerNum','value':['0','5'],'action':'between'}"
				+ "],"
				+ "'pagenum':'0',"
				+ "'pagesize':'50',"
				+ "'recordstartindex':'0',"
				+ "'recordendindex':'50'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("common/owner/count/Sys_Admin/" + conStr);
		System.out.println(reStr);
	}

	//@Test
		public void test_003_OwnerAccess() throws Exception{
			String query = "{'condition':["
					/*+ "{'value':['1'],'action':'eq','key':'l.ownerId'} "
					+ "{'value':['2016-09-10 00:00:00','2016-09-16 23:59:59'],'action':'between','key':'l.createDate'} ,"
					+ "{'value':['2016-09-10'],'action':'eq','key':'Date(l.createDate)'} ,"
					+ "{'value':['admin'],'action':'like','key':'o.loginId'} ,"
					+ "{'value':['益萃网'],'action':'like','key':'i.name'} ,"
					+ "{'value':['12346345'],'action':'like','key':'o.regTelephone'} ,"
					+ "{'value':['2016-07-10 00:00:00','2016-09-16 23:59:59'],'action':'between','key':'o.createDate'} ,"
					+ "{'value':['2'],'action':'eq','key':'o.sales_id'} ,"
					+ "{'value':[''],'action':'like','key':'l.remark'} "*/
					+ "{'value':['益萃网'],'action':'like','key':'i.name'} "
					+ "],"
					+ "'pagenum':'0',"
					+ "'pagesize':'20',"
					+ "'recordstartindex':'0',"
					+ "'recordendindex':'20'}";
			byte[] b = query.getBytes();
			String conStr = Encodes.encodeBase64(b);
			String reStr = this.getGetRetrunStr("common/owner/access/-1/-1/-1/-1/2016-09-27/Sys_Admin/" + conStr );
			System.out.println(reStr);
		}
		
		//@Test
		public void test_004_OwnerByAccess() throws Exception{
			String query ="tosys/carryover/create/carryover/wages/2/duhuan";
			byte[] b = query.getBytes();
			String conStr = Encodes.encodeBase64(b);
			String json = "{'noteNumber':'','fileInfoIds':'','remark':'','currency':'RMB','journalNumber':'','remarkPrint':'','journalType':'input','entryDate':'2016-09-01','journalDetails':[{'description':'计提工资','chartOfAccount':{'id':200},'debitAmt':'1','creditAmt':0},{'description':'计提工资','chartOfAccount':{'id':177},'debitAmt':'1','creditAmt':0},{'description':'计提工资','chartOfAccount':{'id':83},'debitAmt':0,'creditAmt':'2'}]}";
			String reStr = this.getPostRetrunStr("bss/"+conStr,json);
			System.out.println(reStr);
		}
		
		//@Test
		public void test_005_Owner() throws Exception{
			String reStr = this.getGetRetrunStr("common/owner/information");
			System.out.println(reStr);
		}
		
		//@Test
		public void test_006_coupons() throws Exception{
			String fName =" F:\\coupons.xls";
			File tempFile =new File( fName.trim());
			String reStr = this.getPostFileRetrunStr("common/importCoupon/1,2/3", tempFile );
			System.out.println(reStr);
		}
		
		//@Test
		public void test_007_importOwner() throws Exception{
			String fName =" F:\\代理报税用户导入模版.xls";
			File tempFile =new File( fName.trim());
			String reStr = this.getPostFileRetrunStr("common/import/taxOwner/1", tempFile );
			System.out.println(reStr);
		}
		
		//@Test
		public void test_008_TestOwnerAccess() throws Exception{
			String query = "{'condition':["
//					+ "{'value':['131'],'action':'like','key':'l.phone'} "
					+ "],"
					+ "'pagenum':'0',"
					+ "'pagesize':'20',"
					+ "'recordstartindex':'0',"
					+ "'recordendindex':'20'}";
			byte[] b = query.getBytes();
			String conStr = Encodes.encodeBase64(b);
			String reStr = this.getGetRetrunStr("common/testOwner/access/2016-11-2/" + conStr );
			System.out.println(reStr);
		}
		
		//@Test
		public void test_009_RemarkAccess() throws Exception{
			String query = "{'condition':["
					+ "{'value':['2016-11-4 00:00:00','2016-11-4 23:59:59'],'action':'between','key':'l.createDate'} "
					+ "],"
					+ "'pagenum':'0',"
					+ "'pagesize':'20',"
					+ "'recordstartindex':'0',"
					+ "'recordendindex':'20'}";
			byte[] b = query.getBytes();
			String conStr = Encodes.encodeBase64(b);
			String reStr = this.getGetRetrunStr("common/remark/access/" + conStr );
			System.out.println(reStr);
		}
		
		@Test
		public void test_010_exportUser() throws Exception{
			String query = "{'condition':["
					+ "],"
					+ "'pagenum':'0',"
					+ "'pagesize':'20',"
					+ "'recordstartindex':'0',"
					+ "'recordendindex':'20'}";
			byte[] b = query.getBytes();
			String conStr = Encodes.encodeBase64(b);
			String reStr = this.getGetRetrunStr("common/export/user/0/0/Sys_Admin/" + conStr );
			System.out.println(reStr);
		}
}
