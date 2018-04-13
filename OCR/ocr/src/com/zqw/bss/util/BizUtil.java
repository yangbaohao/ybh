package com.zqw.bss.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

//import com.zqw.account.model.fms.Journal;
//import com.zqw.account.service.fms.JournalService;
import com.zqw.bss.util.SystemConstant.JournalBizType;

/**
 * <p>
 * 业务工具类
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
public class BizUtil {

	/**
	 * 更改凭证的业务信息
	 * 
	 * @param ThreadLocal
	 *            <Map<JournalBizType, Journal>> tl ,存放凭证信息的线程变量
	 * 
	 * @param Long
	 *            id 业务ID
	 * @param JournalService
	 *            JournalService
	 * @return void
	 */
//	public static BigDecimal updateJournalBizInfo(
//			ThreadLocal<Map<JournalBizType, Journal>> tl, Long id,
//			JournalService journalService) {
//		Map<JournalBizType, Journal> map = tl.get();
//		if (map != null) {
//			for (JournalBizType journalBizType : map.keySet()) {
//				journalService.updateJournal(map.get(journalBizType).getId(),
//						journalBizType, id);
//				tl.remove();
//				return map.get(journalBizType).getTotalAmt();
//			}
//		}
//		return null;
//	}

	/**
	 * 去掉列表中包含重复的coaHardCode对象
	 * 
	 * @param List
	 *            <Map> coaMonthSumList 目标对象
	 * 
	 * 
	 * @return List<Map> 返回去重后的列表
	 */
	public static List<Map> distinctCoaHardCodeInList(List<Map> coaMonthSumList) {
		if (coaMonthSumList.size() == 0)
			return coaMonthSumList;

		List<Map> coaMonthSumListTemp = new ArrayList<Map>();
		String tempHardCode = "";
		// 去掉列表中含有重复的coaHardCode
		for (Map map : coaMonthSumList) {

			if (tempHardCode.equals(map.get("0"))) {
				continue;
			}
			tempHardCode = (String) map.get("0");
			coaMonthSumListTemp.add(map);

		}
		return coaMonthSumListTemp;
	}
	public static String formatReceiptNumber(String receiptNumber){
		if(receiptNumber==null){
			return null;
		}
		if(!receiptNumber.startsWith("NO"))
			receiptNumber = "NO:"+receiptNumber;
		return receiptNumber;
	}

}
