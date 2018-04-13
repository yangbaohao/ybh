package com.zqw.bss.test.sale;

import java.io.File;
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
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.PotentialCustomersTrack;
import com.zqw.bss.model.sale.ShortMessage;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.test.ServiceTestCase;
import com.zqw.bss.util.SystemConstant.PotentialCustomersStatus;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class PotentialCustomersServiceTest extends ServiceTestCase {

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

	//保存
	//@Test
	public void test_002_PotentialCustomers() throws Exception {
		PotentialCustomers bean = new PotentialCustomers();
		bean.setPotentialName("test2");
		bean.setPhone("18312345672");
		bean.setContact("233332");
		bean.setAddress("上海2");
		User sales = new User();
		sales.setId(4L);
		bean.setSales(sales);
		bean.setCreateBy("3");
		bean.setCreateDate(new Date());
		bean.setLastUpdateBy("3");
		bean.setLastUpdateDate(new Date());
		/*List<PotentialCustomersTrack> trackList = new ArrayList<PotentialCustomersTrack>();
		PotentialCustomersTrack pt = new PotentialCustomersTrack();
		pt.setCreateBy("9");
		trackList.add(pt);
		bean.setTrackList(trackList);*/
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPostRetrunStr("potentialCustomers/", bean);
		System.out.println(resStr); 
	}
	
	//修改
	//@Test
	public void test_003_PotentialCustomers() throws Exception {
		PotentialCustomers bean = new PotentialCustomers();
		bean.setId(5L);
		bean.setPotentialName("1");
		bean.setPotentialPosition("2");
		bean.setPhone("15666229282");
		bean.setContact("3");
		bean.setCompanyType("4");
		bean.setIndustry("5");
		bean.setAddress("6");
		bean.setCompanyRemark("7");
		//bean.setAddress("上海3");
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPutRetrunStr("potentialCustomers/", bean);
		System.out.println(resStr);
	}

	//分页查询
	//@Test
	public void test_004_GET_getPotentialCustomersByPage() throws ClientProtocolException, IOException {
		String query = "{'condition':["
//				+ "{'value':['2016-09-10 00:00:00','2016-10-20 23:59:59'],'action':'between','key':'createDate'} ,"
//				+ "{'value':['1'],'action':'like','key':'potentialName'} ,"
//				+ "{'value':[''],'action':'like','key':'sales.userInfo.name'} ,"
//				+ "{'value':['notSend'],'action':'eq','key':'potentialCustomersStatus'} ,"
				+ "{'value':['3'],'action':'like','key':'phone'} ,"
				+ "{'value':['测试22'],'action':'eq','key':'batchNum'} ,"
				+ "]," + "'filterscount':'0'," + "'sortdatafield':'id'," + "'sortorder':'desc',"
				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("potentialCustomers/page/" + conStr);
		System.out.println(reStr);
	}
	
	//修改状态
	//@Test
	public void test_005_UpdatePotentialCustomersStatus() throws Exception {
		PotentialCustomers bean = new PotentialCustomers();
		bean.setId(3L);
		bean.setPotentialCustomersStatus(PotentialCustomersStatus.register);
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPutRetrunStr("potentialCustomers/status/", bean);
		System.out.println(resStr);
		}
		
	//导入
	//@Test
	public void test_006_inputPotentialCustomersFile() throws Exception {
	   	String fName =" F:\\PotentialCustomers.xlsx";
    	File tempFile =new File(fName.trim());  
    	String resStr = this.getPostRetrunStr("common/import/potentialCustomers/", tempFile);
		System.out.println(resStr);
		}
	
	//新增备注
	//@Test
	public void test_007_PotentialTrack() throws Exception {
		PotentialCustomersTrack bean = new PotentialCustomersTrack();
		//PotentialCustomers potentialCustomers = new PotentialCustomers();
		//potentialCustomers.setId(3L);
		//bean.setPotentialCustomers(potentialCustomers);
		bean.setComment("1111");
		bean.setPotentialCustomersId(124L);
		// 转成JSON格式
		// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
		String resStr = this.getPostRetrunStr("potentialCustomersTrack/", bean);
		System.out.println(resStr);
	}

	//分页查询备注
	//@Test
	public void test_008_GET_getPotentialTrackByPage() throws ClientProtocolException, IOException {
		String query = "{'condition':["
				+ "{'value':['124'],'action':'eq','key':'potential_customers_id'} ,"
				+ "]," + "'filterscount':'0'," + "'sortdatafield':'id'," + "'sortorder':'desc',"
				+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String reStr = this.getGetRetrunStr("potentialCustomersTrack/page/" + conStr);
		System.out.println(reStr);
	}
	
	//根据客户id查询所有备注
	//@Test
		public void test_009_PotentialTrackList() throws Exception {
			String resStr = this.getGetRetrunStr("potentialCustomersTrack/tracks/3");
			System.out.println(resStr);
		}
		
		//分页查询
		//@Test
		public void test_010_GET_getImportLogByPage() throws ClientProtocolException, IOException {
			String query = "{'condition':["
					+ "{'value':['2016-09-10 00:00:00','2016-10-20 23:59:59'],'action':'between','key':'createDate'} ,"
					+ "{'value':['1'],'action':'like','key':'batchNum'} ,"
					//+ "{'value':[''],'action':'eq','key':'status'} ,"
					+ "]," + "'filterscount':'0'," + "'sortdatafield':'id'," + "'sortorder':'desc',"
					+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";
			byte[] b = query.getBytes();
			String conStr = Encodes.encodeBase64(b);
			String reStr = this.getGetRetrunStr("importLog/page/" + conStr);
			System.out.println(reStr);
		}
		
		//根据客户id查询所有短信
		//@Test
			public void test_011_shortMessageList() throws Exception {
				String resStr = this.getGetRetrunStr("potentialCustomers/shortMessages/10");
				System.out.println(resStr);
			}
		
		//保存主题
		//@Test
		public void test_012_PotentialCustomers() throws Exception {
			ImportLog importLog = new ImportLog();
			importLog.setBatchNum("4");
			importLog.setRemark("测试");
			// 转成JSON格式
			// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
			String resStr = this.getPostRetrunStr("importLog/", importLog);
			System.out.println(resStr); 
		}
		
		//修改主题
		//@Test
		public void test_013_PotentialCustomers() throws Exception {
			ImportLog importLog = new ImportLog();
			importLog.setId(3L);
			importLog.setRemark("测试2");
			// 转成JSON格式
			// JSONObject json = JSONObject.fromObject(bean,jsonConfig);
			String resStr = this.getPutRetrunStr("importLog/", importLog);
			System.out.println(resStr);
		}
		
		//分页查询备注
		//@Test
		public void test_014_GET_getPotentialCustomersByPage() throws ClientProtocolException, IOException {
			String query = "{'condition':["
					+ "{'value':['10'],'action':'eq','key':'pl.id'} ,"
					+ "]," + "'filterscount':'0'," + "'sortdatafield':'id'," + "'sortorder':'desc',"
					+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'10'}";
			byte[] b = query.getBytes();
			String conStr = Encodes.encodeBase64(b);
			String reStr = this.getGetRetrunStr("potentialCustomers/shortMessagesPage/" + conStr);
			System.out.println(reStr);
		}
		
		//分页查询短信主题
				//@Test
				public void test_015_GET_getPotentialCustomersByPage() throws ClientProtocolException, IOException {
					String query = "{'condition':["
						//	+ "{'value':['0','3'],'action':'between','key':'shortMessage.messageLogs.num'} ,"
							+ "]," + "'filterscount':'0'," + "'sortdatafield':'id'," + "'sortorder':'desc',"
							+ "'pagenum':'0'," + "'pagesize':'10'," + "'recordstartindex':'0'," + "'recordendindex':'10'}";
					byte[] b = query.getBytes();
					String conStr = Encodes.encodeBase64(b);
					String reStr = this.getGetRetrunStr("shortmessage/page/" + conStr);
					System.out.println(reStr);
				}
		//给单个人发送短信
		@Test
		public void test_016_SendmessageToPerson() throws Exception {
			ShortMessage shortMessage = new ShortMessage();
			shortMessage.setPotentialCustomersId(78L);
			shortMessage.setMessageCode("wx03");
			shortMessage.setMessageContent("测试短信");
			shortMessage.setMessageTitle("测试咯03");
			String resStr = this.getPostRetrunStr("potentialCustomers/sendmessageToPerson/", shortMessage);
			System.out.println(resStr); 
		}
				
}
