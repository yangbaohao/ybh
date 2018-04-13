package com.zqw.bss.test;

import org.junit.After;
import org.junit.Before;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.stereotype.Component;

import com.zqw.bss.framework.util.Encodes;
import com.zqw.bss.util.HttpRestUtil;

import net.sf.json.JSONObject;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Component
public class JournalTest extends ServiceTestCase {
	@Before
	public void setUp() throws Exception {

	}

	@After
	public void tearDown() throws Exception {

	}

	// @Test
	public void test_002_Journal() throws Exception {
		String ttb = HttpRestUtil.getGetRetrunStr("tosys/coaReport/loanAmt/liabilities/2016-09/2/duhuan");
		System.out.println(ttb);
		// http://127.0.01:8080/ACBss/CXF/rs/ac/dG9zeXMvY29hUmVwb3J0L2xvYW5BbXQvbGlhYmlsaXRpZXMvMjAxNi0wOS8yL2R1aHVhbg==
	}

	/**
	 * 获取凭证的列表(分页)
	 * 
	 * @throws Exception
	 */
	// @Test
	public void test_003_Journal() throws Exception {
		String query = "{'condition':[]," + "'filterscount':'0'," + "'sortdatafield':'id'," + "'sortorder':'desc',"
				+ "'pagenum':'0'," + "'pagesize':'100'," + "'recordstartindex':'0'," + "'recordendindex':'30'}";
		byte[] b = query.getBytes();
		String conStr = Encodes.encodeBase64(b);
		String ttb = HttpRestUtil.getGetRetrunStr("tosys/coaReport/journal/page/" + conStr + "/2/duhuan");
		System.out.println(ttb);
		// http://127.0.01:8080/ACBss/CXF/rs/ac/dG9zeXMvY29hUmVwb3J0L2pvdXJuYWwvcGFnZS9leWRqYjI1a2FYUnBiMjRuT2x0ZExDZG1hV3gwWlhKelkyOTFiblFuT2ljd0p5d25jMjl5ZEdSaGRHRm1hV1ZzWkNjNkoybGtKeXduYzI5eWRHOXlaR1Z5SnpvblpHVnpZeWNzSjNCaFoyVnVkVzBuT2ljd0p5d25jR0ZuWlhOcGVtVW5PaWN4TURBbkxDZHlaV052Y21SemRHRnlkR2x1WkdWNEp6b25NQ2NzSjNKbFkyOXlaR1Z1WkdsdVpHVjRKem9uTXpBbmZRPT0vMi9kdWh1YW4=
	}

	/**
	 * 查询凭证对应的借贷之和
	 * 
	 * @throws Exception
	 */
	// @Test
	public void test_004_Journal() throws Exception {
		String ref = "1405";
		String debitCredit = "debit";
		String journalDate = "2016-09";
		String ttb = HttpRestUtil.getGetRetrunStr(
				"tosys/coaReport/journal/search/amt/" + ref + "/" + debitCredit + "/" + journalDate + "/2/duhuan");
		System.out.println(ttb);
	}

	/**
	 * 测算金额接口
	 * 
	 * @param ctime
	 *            日期
	 * @return Map
	 */
	//@Test
	public void test_005_Journal() throws Exception {
		String ttb = HttpRestUtil.getGetRetrunStr("tosys/coaReport/journal/compute/2016-09/12/duhuan");
		System.out.println(ttb);
	}

	/**
	 * 银行对账信息
	 * 
	 * @param ref
	 * @param debitCredit
	 * @param journalDate
	 * @return List银行对账列表
	 */
	// @Test
	public void test_006_Journal() throws Exception {
		String ttb = HttpRestUtil
				.getGetRetrunStr("tosys/coaReport/journal/search/bankreconlist/1001/debit/2016-07/2/duhuan");
		System.out.println(ttb);
	}

	/**
	 * 结账时设置journalNumber 用户id不属于他
	 */
	// @Test
	public void test_007_Journal() throws Exception {
		String ttb = HttpRestUtil.getGetRetrunStr("tosys/coaReport/journal/closeaccount/2016-09/2/duhuan");
		System.out.println(ttb);
	}

	/**
	 * 获取明细账的列表
	 * 
	 * @param coahardcode
	 *            科目编码
	 * @param month
	 *            日期
	 * @return 细账的列表
	 */
	// @Test
	public void test_008_Journal() throws Exception {
		String ttb = HttpRestUtil.getGetRetrunStr("tosys/coaReport/detailedaccount/1001/2016-07/2/duhuan");
		System.out.println(ttb);
	}

	/**
	 * 创建凭证
	 * 
	 * @param journal对象
	 * @return Boolean
	 */
	@Test
	public void test_009_Journal() throws Exception {
		// String jsonStr =
		// "{'noteNumber':'','fileInfoIds':'','remark':'','currency':'RMB','journalNumber':'','remarkPrint':'','journalType':'input','entryDate':'2016-09-01','journalDetails':[{'description':'计提工资','chartOfAccount':{'id':200},'debitAmt':'1','creditAmt':0},{'description':'计提工资','chartOfAccount':{'id':177},'debitAmt':'1','creditAmt':0},{'description':'计提工资','chartOfAccount':{'id':83},'debitAmt':0,'creditAmt':'2'}]}";
		String jsonStr = "{'noteNumber':'','fileInfoIds':'','remark':'','journalType':'input','currency':'RMB','entryDate':'2016-09-23'\n"
				+ ",'remarkPrint':'','journalDetails':[{'description':'','chartOfAccount':{'id':284},'debitAmt':0,'creditAmt'\n"
				+ ":'999.00','category1':'','category2':'','createDate':'2016-09-23'},{'description':'','chartOfAccount'\n"
				+ ":{'id':267},'debitAmt':'999.00','creditAmt':0,'category1':'','category2':'','createDate':'2016-09-23'\n"
				+ "}]}";
		JSONObject json = JSONObject.fromObject(jsonStr);
		String str = HttpRestUtil.getPostRetrunStr("tosys/coaReport/create/12/duhuan", json);
		System.out.println(str);
	}

	/**
	 * 凭证下的费用支出
	 */
	// @Test
	public void test_010_Journal() throws Exception {
		String ttb = HttpRestUtil.getGetRetrunStr("tosys/coaReport/expensePayment/search/9/2/duhuan");
		System.out.println(ttb);

	}
	
	
}
