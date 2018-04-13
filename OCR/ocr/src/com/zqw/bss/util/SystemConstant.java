//==============================================================================

// Created on 2009-7-16
// $Id$
//==============================================================================
package com.zqw.bss.util;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2007-2010 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */

/**
 * <p>Title:</p>
 * <p>Description:</p>
 * <p>Copyright: Copyright (c) 2016 </p>
 * <p>Company:zqw</p>
 * @author Dhuan
 * @date 2016年7月5日 下午4:11:16
 * @version 1.0
 */
/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2016
 * </p>
 * <p>
 * Company:zqw
 * </p>
 * 
 * @author Dhuan
 * @date 2016年7月5日 下午4:11:17
 * @version 1.0
 */
@SuppressWarnings({ "unchecked", "rawtypes" })
public class SystemConstant {

	static public String TIME_PERIOD_TODAY = "Today";

	static public String TIME_PERIOD_THISWEEK = "ThisWeek";

	// static public String TIME_PERIOD_LASTWEEK = "LastWeek";

	static public String TIME_PERIOD_THISMONTH = "ThisMonth";

	static public String TIME_PERIOD_LASTMONTH = "LastMonth";

	static public String TIME_PERIOD_MOREOLDER = "MoreOlder";

	static public String PRINT_MAP_KEY = "mapKey";

	static public String PRINT_DS_KEY = "dsKey";

	public static String MODEL_PACKAGE_NAME = "com.zqw.bss.model";

	public static String MODEL_FRAMEWORK_PACKAGE_NAME = "com.zqw.bss.framework.model";

	public static String PROXY_OBJ_SPLIT_STR = "_\\$\\$_";

	public static String SESSION_KEY_USER_NAME = "username";

	public static String SESSION_KEY_USERINFO_ID = "userInfoId";

	public static String SESSION_KEY_USERINFO_NAME = "userInfoName";

	public static String SESSION_KEY_USER_PERMISSIONS = "permissions";

	public static String SESSION_KEY_USER_ROLES = "roles";

	public static String SESSION_KEY_OWNER_ID = "ownerId";

	public static String MSG_VALID = "msg_validCode_";

	public static String VALID_CACHE = "valid_cache";
	
	//配置在application里的系统变量，指向配置文件路径
	public static String CONFIG_PATH = "config_path"; 
	/**
	 * 2017年8月2日 16:52:26 外箱类型
	 * @author win7
	 *	张沂飞
	 */
	static public enum CartonType {
		/**
		 * 尺寸
		 * 长宽高
		 */
		size,
		
		/**
		 * 体积
		 */
		volume
	}
	
	static public enum DispatchType {
		VIP {
			public String toString() {
				return "VIP";
			}
		},
		OTHER {
			public String toString() {
				return "OTHER";
			}

		},
		/**
		 * System push系统推送
		 */
		SYSPUSH{
			public String toString() {
				return "SYSPUSH";
			}
		},
		/**
		 * 线下验码
		 */
		LINE{
			public String toString() {
				return "LINE";
			}
		}

	};

	static public enum EntryStatus {
		INITIAL {
			@Override
			public String toString() {
				return "INITIAL";
			}
		},
		ACTIVE {
			@Override
			public String toString() {
				return "ACTIVE";
			}
		},
		DISABLED {
			@Override
			public String toString() {
				return "DISABLED";
			}
		},
		EXPIRIED {
			@Override
			public String toString() {
				return "EXPIRIED";
			}
		}
	};

	/**
	 * 账期状态
	 */
	static public enum AccountPeriodStatus {
		/**
		 * 打开
		 */
		opened {
			@Override
			public String toString() {
				return "opened";
			}
		},
		/**
		 * 关闭
		 */
		closed {
			@Override
			public String toString() {
				return "closed";
			}
		},
		/**
		 * 反结账
		 */
		reopened {
			@Override
			public String toString() {
				return "reopened";
			}
		}
	}

	/**
	 * 订单状态
	 */
	static public enum OrderStatus {

		/**
		 * 3:终止订单
		 */
		stop {
			@Override
			public String toString() {
				return "stop";
			}
		},
		/**
		 * 6、待审的running
		 */
		running {
			@Override
			public String toString() {
				return "running";
			}
		},
		/**
		 * 2: 还没开始送
		 */
		undelivered {
			@Override
			public String toString() {
				return "undelivered";
			}
		},
		/**
		 * 1: 部分送
		 */
		partialdelivered {
			@Override
			public String toString() {
				return "partialdelivered";
			}
		},
		/**
		 * 0: 全部送完
		 */
		alldelivered {
			@Override
			public String toString() {
				return "alldelivered";
			}
		},
		/**
		 * 4、作废
		 */
		canceled {
			@Override
			public String toString() {
				return "canceled";
			}
		},
		/**
		 * 5、生成销售单
		 */
		createdSalesOrder {
			@Override
			public String toString() {
				return "createdSalesOrder";
			}
		},
		/**
		 * 未生成销售单
		 */
		notCreatedSalesOrder {
			@Override
			public String toString() {
				return "notCreatedSalesOrder";
			}
		}
	}

	static public enum ReceiptType {
		feeincome {
			@Override
			public String toString() {
				return "feeincome";
			}
		},
		reimbursement {
			@Override
			public String toString() {
				return "reimbursement";
			}
		}
	}
	/**
	 * 凭证类型
	 */
	public enum JournalType {
		input("input"), carryover("carryover"), auto("auto"),generalDcouments("generalDcouments");

		JournalType(String name) {
			this.name = name;
		}
		
		/**
		 * 手动 : input、自动: auto、期末结账: carryover
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 退货状态
	 */
	static public enum ReturnStatus {
		/**
		 * 未收
		 */
		notreceived {
			@Override
			public String toString() {
				return "notreceived";
			}
		},

		/**
		 * 拒收
		 */
		rejected {
			@Override
			public String toString() {
				return "rejected";
			}
		},
		/**
		 * 已收
		 */
		received {
			@Override
			public String toString() {
				return "received";
			}
		},
		/**
		 * 作废
		 */
		canceled {
			@Override
			public String toString() {
				return "canceled";
			}
		}
	}

	/**
	 * 送货状态
	 */
	static public enum DeliveryStatus {
		/**
		 * 未收
		 */
		notreceived {
			@Override
			public String toString() {
				return "notreceived";
			}
		},
		/**
		 * 未送
		 */
		notdelivered {
			@Override
			public String toString() {
				return "notdelivered";
			}
		},
		/**
		 * 拒收
		 */
		rejected {
			@Override
			public String toString() {
				return "rejected";
			}
		},
		/**
		 * 已收
		 */
		received {
			@Override
			public String toString() {
				return "received";
			}
		},
		/**
		 * 已送
		 */
		delivered {
			@Override
			public String toString() {
				return "delivered";
			}
		},
		/**
		 * 作废
		 */
		canceled {
			@Override
			public String toString() {
				return "canceled";
			}
		},
		/**
		 * 部分退货
		 */
		partialReturn {
			@Override
			public String toString() {
				return "partialReturn";
			}
		},
		/**
		 * 全部退货
		 */
		allReturn {
			@Override
			public String toString() {
				return "partialReturn";
			}
		}
	}

	/**
	 * 贷款审批状态
	 * @author Administrator
	 *
	 */
	static public enum LoanState {
		/**
		 * 未提交
		 */
		NoSubmitted{
			@Override
			public String toString() {
				return "NoSubmitted";
			}
		},
		/**
		 * 待审
		 */
		Pending{
			@Override
			public String toString() {
				return "Pending";
			}
		},
		/**
		 * 已批
		 */
		Approved{
			@Override
			public String toString() {
				return "Approved";
			}
		},
		/**
		 * 已拒
		 */
		Refuse{
			@Override
			public String toString() {
				return "Refuse";
			}
		}
	}
	public static enum ResourceType {

		menu("菜单"), button("按钮"), function("功能");

		private final String info;

		private ResourceType(String info) {
			this.info = info;
		}

		public String getInfo() {
			return info;
		}
	}

	/**
	 * 付款状态
	 */
	static public enum PayStatus {
		/**
		 * 3：取消付款
		 */
		cancel {
			@Override
			public String toString() {
				return "cancel";
			}
		},
		/**
		 * 2：还没开始付款
		 */
		notpaid {
			@Override
			public String toString() {
				return "notpaid";
			}
		},
		/**
		 * 1：部分付款
		 */
		paying {
			@Override
			public String toString() {
				return "paying";
			}
		},
		/**
		 * 退款
		 */
		paidRe {
			@Override
			public String toString() {
				return "paidRe";
			}
		},
		/**
		 * 0：全部付清
		 */
		paid {
			@Override
			public String toString() {
				return "paid";
			}
		}
		,
		/**
		 * 0：支付失败
		 */
		fail {
			@Override
			public String toString() {
				return "fail";
			}
		}
		,
		apply {
			@Override
			public String toString() {
				return "apply";
			}
		}
		,
		give {
			@Override
			public String toString() {
				return "give";
			}
		}
		,
		offline {
			@Override
			public String toString() {
				return "offline";
			}
		},
		tryout {
			@Override
			public String toString() {
				return "tryout";
			}
		}
	}
	
	/**
	 * 支付方式
	 * 
	 * @author chxiaoqi
	 *
	 */
	static public enum Channel {
		ALIPAY {
			@Override
			public String toString() {
				return "ALIPAY";
			}
		},
		OTHER {
			@Override
			public String toString() {
				return "OTHER";
			}
		},
		GIVE {
			@Override
			public String toString() {
				return "GIVE";
			}
		}
	}

	/**
	 * Log产生类型
	 */
	public enum SourceType {
		purchase("purchase"), returnPurchase("returnPurchase"), sales("sales"), returnSales("returnSales"), stockcheck(
				"stockcheck"), initPurchase("initPurchase");

		SourceType(String name) {
			this.name = name;
		}

		/**
		 * 采购:purchase、销售:sales、盘点:stockCheck
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 付款方式
	 */
	public enum PayWay {
		cash("cash"), alipay("alipay"), wechatpay("wechatpay"), bankpayonline("bankpayonline"), payinadvance(
				"payinadvance"), cheque("cheque"), bankpay("bankpay"), collectinadvance("collectinadvance");

		PayWay(String name) {
			this.name = name;
		}

		/**
		 * 现金: cash、支付宝: alipay、微信支付: wechatpay、银行转账[网银支付]: bankpayonline、
		 * 使用预收款: payinadvance、支票: cheque、银行存款: bankpay
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}
	/**
	 * 优惠卷类型
	 */
	static public enum VoucherType{
		/**
		 * 普通
		 */
		ordinary{
			@Override
			public String toString() {
				return "ordinary";
			}
		},
		/**
		 * 全部
		 */
		all{
			@Override
			public String toString() {
				return "all";
			}	
		}
	}
	/**
	 * 借贷方式
	 */
	static public enum Display {
		/**
		 * 0: [可以借，也可以贷]
		 */
		debit {
			@Override
			public String toString() {
				return "debit";
			}
		},
		/**
		 * 1: 只能借
		 */
		credit {
			@Override
			public String toString() {
				return "credit";
			}
		},
		/**
		 * -1: 只能贷
		 */
		unlimited {
			@Override
			public String toString() {
				return "unlimited";
			}
		}
	}

	/**
	 * 借贷标识
	 */
	static public enum DebitCredit {
		/**
		 * 借
		 */
		debit {
			@Override
			public String toString() {
				return "debit";
			}
		},
		/**
		 * 贷
		 */
		credit {
			@Override
			public String toString() {
				return "credit";
			}
		}
	}

	/**
	 * 业务状态(仅报销单、费用支出、其他收入使用)
	 * 
	 * @author ZZ
	 * @company zqw 2016年7月16日 下午3:03:47
	 */
	static public enum BizStatus {
		canceled {
			@Override
			public String toString() {
				return "canceled";
			}
		},
		normal {
			@Override
			public String toString() {
				return "normal";
			}
		},
		close {
			@Override
			public String toString() {
				return "close";
			}
		}

	}
	/**
	 * 客服驳回理由
	 */
	static public enum KFRejectReason{
		/**
		 * 智能转换过程中无法识别您的笔记
		 */
		kfRejectFont {
			@Override
			public String toString() {
				return "kfRejectFont";
			}
		},
		/**
		 *  智能转换过程中产品信息识别不全
		 */
		kfRejectInfo {
			@Override
			public String toString() {
				return "kfRejectInfo";
			}
		}
	} 
	/**
	 * 快捷开单单据类型
	 */
	static public enum OrderApprovalStatus {
		/**
		 * 初始化
		 */
		init {
			@Override
			public String toString() {
				return "init";
			}
		},
		/**
		 *  客户付费提交 无人抢单 待抢单
		 */
		stayOrder {
			@Override
			public String toString() {
				return "stayOrder";
			}
		},
		/**
		 * 抢单成功
		 */
		orderSuccess {
			@Override
			public String toString() {
				return "orderSuccess";
			}
		},
		/**
		 * 提交
		 */
		orderSubmit {
			@Override
			public String toString() {
				return "orderSubmit";
			}
		},
		/**
		 * 审核中/审核已经开始
		 */
		checking {
			@Override
			public String toString() {
				return "checking";
			}
		},
		/**
		 * 复核通过
		 */
		checkAgainSuccess {
			@Override
			public String toString() {
				return "checkAgainSuccess";
			}
		},
	
		/**
		 * 复核不通过
		 */
		checkAgainFailed {
			@Override
			public String toString() {
				return "checkAgainFailed";
			}
		},
		/**
		 * 审核通过
		 */
		checkSuccess {
			@Override
			public String toString() {
				return "checkSuccess";
			}
		},
		/**
		 * 客户成功确认
		 */
		complete {
			@Override
			public String toString() {
				return "complete";
			}
		},
		/**
		 * 审核不通过
		 */
		checkFailed {
			@Override
			public String toString() {
				return "checkFailed";
			}
		},
		/**
		 * 客户拒绝
		 */
		checkRefused {
			@Override
			public String toString() {
				return "checkRefused";
			}
		},
		/**
		 * 再次提交		
		 */
		orderSubmitAgain {
			@Override
			public String toString() {
				return "orderSubmitAgain";
			}
		},
		/**
		 * 客服驳回
		 */
		KFReject{
			@Override
			public String toString() {
				return "KFReject";
			}
		},
		/**
		 * 客户撤销
		 */
		KHBackout{
			@Override
			public String toString() {
				return "KHBackout";
			}
		},
		/**
		 * 客户重新提交
		 */
		KHSubmitAgain{
			@Override
			public String toString() {
				return "KHSubmitAgain";
			}
		}
	}


	/**
	 * 
	 */
	public enum StartDepreciate {
		depreciate("depreciate"), undepreciate("undepreciate"), scrap("scrap"),sell("sell");

		StartDepreciate(String name) {
			this.name = name;
		}

		/**
		 * 0: 未开始折旧: depreciate、 1: 开始折旧: undepreciate、 2: 报废: scrap
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 
	 */
	public enum AccountType {
		golden("golden"), silver("silver"), normarl("normarl");

		AccountType(String name) {
			this.name = name;
		}

		/**
		 * 1: 黄金: golden、2: 白银: silver、3: 普通: normarl
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 
	 */
	public enum AccountStatus {
		initial("initial"), actived("actived"), suspend("suspend"), expired("expired"), closed("closed");

		AccountStatus(String name) {
			this.name = name;
		}

		/**
		 * 1: 初始化: initial、2: 激活: actived、3: 锁定: suspend、4: 过期: expired、5: 停用:
		 * closed
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 系统初始化
	 */
	public enum TransactionType {
		pay("pay"), acquire("acquire");

		TransactionType(String name) {
			this.name = name;
		}

		/**
		 * 付款:pay、收款:acquire
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 付款类型
	 */
	public enum ChargePlanType {
		/**
		 * 打折
		 */
		discount {
			public String toString() {
				return "discount";
			}
		},
		/**
		 * 固定计价
		 */
		fixed {
			public String toString() {
				return "fixed";
			}
		},
		/**
		 * 原价
		 */
		original {
			public String toString() {
				return "original";
			}
		}
	}

	/**
	 * 证件类型
	 */
	public enum CertificateType {
		IDENTITY_CARD("IDENTITY_CARD"), PASSPORT("PASSPORT"), SOLDIER_CARD("SOLDIER_CARD"), TAIWAN_COMPATRIOTS_CARD(
				"TAIWAN_COMPATRIOTS_CARD"), LICENSE("LICENSE");

		CertificateType(String name) {
			this.name = name;
		}

		/**
		 * 身份证:IDENTITY_CARD、护照:PASSPORT、士兵卡:SOLDIER_CARD、 台湾同胞卡:
		 * TAIWAN_COMPATRIOTS_CARD、许可证: LICENSE
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 工作流状态
	 */
	static public enum BpmnStatus {

		/**
		 * 不需要审批
		 */
		NOAPPROVE {
			public String toString() {
				return "NOAPPROVE";
			}
		},

		/**
		 * 初始化
		 */
		PRE {
			public String toString() {
				return "PRE";
			}
		},
		/**
		 * 开始
		 */
		START {
			public String toString() {
				return "START";
			}
		},
		/**
		 * 运行中
		 */
		RUNNING {
			public String toString() {
				return "RUNNING";
			}
		},
		/**
		 * 放弃
		 */
		REJECT {
			public String toString() {
				return "REJECT";
			}
		},
		/**
		 * 失败
		 */
		FAIL {
			public String toString() {
				return "FAIL";
			}
		},
		/**
		 * 完成
		 */
		COMPLETE {
			public String toString() {
				return "COMPLETE";
			}
		}
	};
	/**
	 * 计重方式
	 */
	static public enum WeightWay {
		/**
		 * 单个产品
		 */
		single,
		/**
		 * 整箱计算
		 */
		container
	}
	
	/**
	 * 工作流中进程状态
	 */
	static public enum ProcessStatus {
		/**
		 * 初始化
		 */
		INITIAL {
			public String toString() {
				return "INITIAL";
			}
		},
		/**
		 * 进行中
		 */
		INPROCESS {
			public String toString() {
				return "INPROCESS";
			}
		},
		/**
		 * 活跃状态
		 */
		ACTIVE {
			public String toString() {
				return "ACTIVE";
			}
		},
		/**
		 * 异常状态
		 */
		DISABLED {
			public String toString() {
				return "DISABLED";
			}
		},
		/**
		 * 过期
		 */
		EXPIRIED {
			@Override
			public String toString() {
				return "EXPIRIED";
			}
		}
	};

	/**
	 * 纳税人性质
	 */
	static public enum TaxType {
		/**
		 * 小规模纳税人
		 */
		smallscale {
			public String toString() {
				return "smallscale";
			}
		},
		/**
		 * 一般增值税纳税人
		 */
		generalvat {
			public String toString() {
				return "generalvat";
			}
		}
	};

	/**
	 * 公司性质
	 */
	static public enum ComType {
		/**
		 * 有限责任公司
		 */
		ltd {
			public String toString() {
				return "ltd";
			}
		},
		/**
		 * 非公司企业
		 */
		unincorporated {
			public String toString() {
				return "unincorporated ";
			}
		},
		/**
		 * 私营企业
		 */
		individual {
			public String toString() {
				return "individual ";
			}
		},
		/**
		 * 集体企业
		 */
		corp {
			public String toString() {
				return "corp ";
			}
		},
		/**
		 * 独资企业
		 */
		proprietorship {
			public String toString() {
				return "proprietorship ";
			}
		},
		/**
		 * 合资企业
		 */
		jointventures {
			public String toString() {
				return "jointventures ";
			}
		},
		/**
		 * 外商独资企业
		 */
		wfoe {
			public String toString() {
				return "wfoe ";
			}
		}
	};

	/**
	 * 币种
	 */
	static public enum StandardMoney {
		/**
		 * 人民币
		 */
		RMB {
			public String toString() {
				return "RMB";
			}
		}
	};

	/**
	 * 
	 */

	static public enum PaidType {
		paytrue {
			public String toString() {
				return "paytrue";
			}
		},
		payfalse {
			public String toString() {
				return "payfalse";
			}
		},
		paytruewait {  
			public String toString() {
				return "paytruewait";
			}
		},
		payfalsewait {
			public String toString() {
				return "payfalsewait";
			}
		}
	}
	
	static public enum DateType {
		//按月
		paymouth {
			public String toString() {
				return "paymouth";
			}
		},
		//按季 paymouth payseason payhalfyear payyear
		payseason {
			public String toString() {
				return "payseason";
			}
		},
		//按半年
		payhalfyear {
			public String toString() {
				return "payhalfyear";
			}
		},
		//按年
		payyear {
			public String toString() {
				return "payyear";
			}
		}
	}
	
	static public enum SalesType {
		// 销售直销
		salesDirect {
			public String toString() {
				return "salesDirect";
			}
		},
		// 代理直销
		agentDirect {
			public String toString() {
				return "agentDirect";
			}
		},
		// 商机转化
		transformation {
			public String toString() {
				return "transformation";
			}
		},
		//第三方业务系统
		 otherSystem {
			public String toString() {
				return "otherSystem";
			}
		},
		 TaxSystem {
			public String toString() {
				return "TaxSystem";
			}
		}
	}

	static public enum Accountingstandards {
		smallbusiness {
			public String toString() {
				return "smallbusiness";
			}
		}
	};

	static public enum CompanyType {
		year {
			public String toString() {
				return "year";
			}
		},
		month {
			public String toString() {
				return "month";
			}
		}
	}

	/**
	 * 发票类型
	 */
	static public enum InvoiceType {
		/**
		 * 专用增值税发票
		 */
		addedtax {
			public String toString() {
				return "addedtax";
			}
		},
		/**
		 * 其他发票
		 */
		othertax {
			public String toString() {
				return "othertax";
			}
		}
	};

	/**
	 * 报表类型
	 */
	static public enum ReportType {
		/**
		 * 利润表
		 */
		profit {
			public String toString() {
				return "profit";
			}
		},
		/**
		 * 余额表
		 */
		balance {
			public String toString() {
				return "balance";
			}
		},
		/**
		 * 资产负债表
		 */
		liabilities {
			public String toString() {
				return "liabilities";
			}
		}
	};

	/**
	 * 参数业务类型
	 */
	static public enum OwnerBizType {

		journalaudit {
			public String toString() {
				return "journalaudit";
			}
		},
		category1 {
			public String toString() {
				return "category1";
			}
		},
		category2 {
			public String toString() {
				return "category2";
			}
		},
		producttype {
			public String toString() {
				return "producttype";
			}
		},
		productunit {
			public String toString() {
				return "productunit";
			}
		}
	};

	static public enum ExpensePaymentType {
		expensePayment {
			@Override
			public String toString() {
				return "expensePayment";
			}
		},
	}

	/**
	 * 发票类型
	 */
	static public enum ReceiptInvoiceType {
		specialinvoice {
			@Override
			public String toString() {
				return "specialinvoice";
			}
		},
		ordinaryinvoice {
			@Override
			public String toString() {
				return "ordinaryinvoice";
			}
		},
		otherinvoice {
			@Override
			public String toString() {
				return "otherinvoice";
			}
		}
	}

	/**
	 * 产品类型
	 */
	static public enum ProductserviceType {
		/**
		 * 0： 即销售又采购
		 */
		onlysale {
			@Override
			public String toString() {
				return "onlysale";
			}
		},
		/**
		 * 1：只销售
		 */
		onlypurchase {
			@Override
			public String toString() {
				return "onlypurchase";
			}
		},
		/**
		 * 2: 只采购
		 */
		saleandpurchase {
			@Override
			public String toString() {
				return "saleandpurchase";
			}
		},
	}

	
	static public enum OandiType{

		returnclient{
			@Override
			public String toString(){
				return "returnclient";
			}
		},
		returnvendor{  
			@Override
			public String toString(){
				return "returnvendor";
			}
		},
		carryoverCost{  
			@Override
			public String toString(){
				return "carryoverCost";
			}
		},
		/**
		 * 支付报销单
		 */
		PAYREIMBURSEMENT{
			@Override
			public String toString(){
				return "PAYREIMBURSEMENT";
			}
		},
		/**
		 * 采购支付
		 */
		PURCHARSEPAY {
			@Override
			public String toString(){
				return "PURCHARSEPAY";
			}
		},
		/**
		 * 采购预付
		 */
		PURCHARSEPREPAY {
			@Override
			public String toString(){
				return "PURCHARSEPREPAY";
			}
		},
		/**
		 * 采购
		 */
		PURCHARSE {
			@Override
			public String toString(){
				return "PURCHARSE";
			}
		},
		/**
		 * 销售
		 */
		SALES {
			@Override
			public String toString(){
				return "SALES";
			}
		},
		/**
		 * 管理
		 */
		MANAGEMENT {
			@Override
			public String toString(){
				return "MANAGEMENT";
			}
		},
		/**
		 * 财务
		 */
		FINANCE{
			@Override
			public String toString(){
				return "FINANCE";
			}
		},
		/**
		 * 营业外
		 */
		UNRELATED{
			@Override
			public String toString(){
				return "UNRELATED";
			}
		},
		/**
		 * 提取备用金
		 */
		IMPREST{
			@Override
			public String toString(){
				return "IMPREST";
			}
		},
		/**
		 * 预支报销
		 */
		ADVANCE{
			@Override
			public String toString(){
				return "ADVANCE";
			}
		},
		/**
		 * 其它预收
		 */
		OTHERADVANCE{
			@Override
			public String toString(){
				return "OTHERADVANCE";
			}
		},
		/**
		 * 关于职工
		 */
		STAFF{
			@Override
			public String toString(){
				return "STAFF";
			}
		},
		/**
		 * 还款
		 */
		REPAYMENT{
			@Override
			public String toString(){
				return "REPAYMENT";
			}
		},
		/**
		 * 预支工资
		 */
		PREPAREWAGES{
			@Override
			public String toString(){
				return "PREPAREWAGES";
			}
		},
		Otherreceivable{
			@Override
			public String toString(){
				return "Otherreceivable";
			}
		},
		documentsPay{
			@Override
			public String toString(){
				return "documentsPay";
			}
		},

		/**
		 * 销售预收
		 */
		SALESPREPAY {
			@Override
			public String toString(){
				return "SALESPREPAY";
			}
		},
		SALESPAY {
			@Override
			public String toString(){
				return "SALESPAY";
			}
		},
		/**
		 * 营业外
		 */
		outofbusiness{
			@Override
			public String toString() {
				return "outofbusiness";
			}
		},
		/**
		 * 主营业务
		 */
		mainbusiness{
			@Override
			public String toString() {
				return "mainbusiness";
			}
		},
		/**
		 * 其他业务
		 */
		otherbusiness{
			@Override
			public String toString() {
				return "otherbusiness";
			}
		},
		/**
		 * 短期借款
		 */
		shorttermloan{
			@Override
			public String toString() {
				return "shorttermloan";
			}
		},
		/**
		 * 利息收入
		 */
		interestincome{
			@Override
			public String toString() {
				return "interestincome";
			}
		},
		/**
		 * 其他应付
		 */
		OtherPay{
			@Override
			public String toString() {
				return "OtherPay";
			}
		},
		
		/**
		 * 冲销应收款
		 */
		documentsgetPay{
			@Override
			public String toString() {
				return "documentsgetPay";
			}
		},
		/**
		 * 预收款
		 */
		generalreceived{
			@Override
			public String toString() {
				return "generalreceived";
			}
		},
		/**
		 * 预付款
		 */
		generalpay{
			@Override
			public String toString() {
				return "generalpay";
			}
		}
	}
	
	/**
	 * 期末结转类型
	 */
	public enum ComputeCarryoverClass {

		/**
		 * 计提工资
		 */
		wages("wages"),
		/**
		 * 摊销待摊费用
		 */
		amortization("amortization"),
		/**
		 * 计提税金
		 */
		gold("gold"),
		/**
		 * 结转未交增值税
		 */
		tax("tax"),
		/**
		 * 计提所得税
		 */
		incometax("incometax"),
		/**
		 * 计提折旧
		 */
		depreciation("depreciation"),
		/**
		 * 结转损益
		 */
		carryover("carryover");

		ComputeCarryoverClass(String name) {
			this.name = name;
		}

		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	private static Map<String, String> dict;

	public static Map<String, String> getDict() {
		if (dict == null) {
			dict = new HashMap();
			
			dict.put("paymouth", "按月收款");
			dict.put("payseason", "按季度收款");
			dict.put("payhalfyear", "按半年收款");
			dict.put("payyear", "按年收款");
			  
			dict.put("paytruewait", "正常（催款中）");
			dict.put("payfalsewait", "欠费（催款中）");
			dict.put("paytrue", "正常");
			dict.put("payfalse", "欠费");
			
			dict.put("SALES","销售");
			dict.put("MANAGEMENT","管理");
			dict.put("FINANCE","财务");
			dict.put("UNRELATED","营业外");
			dict.put("IMPREST","提取备用金");
			dict.put("ADVANCE","预支报销");
			dict.put("STAFF","关于职工");
			dict.put("REPAYMENT","关于还款");
			dict.put("outofbusiness","营业外");
			dict.put("mainbusiness","主营业务");
			dict.put("otherbusiness","其他业务");
			dict.put("shorttermloan","关于借款");
			dict.put("interestincome","利息收入");
			dict.put("PREPAREWAGES","预支工资");
			dict.put("Otherreceivable","其他应收");
			dict.put("carryoverCost", "结转成本");
			
			dict.put("salesDirect", "销售直销");
			dict.put("agentDirect", "代理直销");
			dict.put("transformation", "商机转化");
			dict.put("month", "月");
			dict.put("year", "年");
			dict.put("feeincomepay", "费用收入");
			dict.put("feeincome", "费用收入");
			dict.put("reimbursement", "费用支出");
			dict.put("expensePayment", "费用支出");
			dict.put("otherinvoice", "其他");
			dict.put("specialinvoice", "增值税专用发票");
			dict.put("ordinaryinvoice", "增值税普通发票");
			dict.put("othertax", "其他发票");
			dict.put("addedtax", "增值税发票");
			dict.put("saleandpurchase", "即销售又采购");
			dict.put("onlypurchase", "只采购");
			dict.put("onlysale", "只销售");
			dict.put("scrap", "报废");
			dict.put("sell", "出售");
			dict.put("balance", "科目余额表");
			dict.put("profit", "利润表");
			dict.put("liabilities", "资产负债表");
			dict.put("Today", "今天");
			dict.put("ThisWeek", "本周");
			dict.put("ThisMonth", "本月");
			dict.put("LastMonth", "最后一月");
			dict.put("MoreOlder", "更早");

			dict.put("TIME", "按周期");
			dict.put("USAGE", "按用量");
			dict.put("HOUR", "小时");
			dict.put("DAY", "天");
			dict.put("MONTH", "月");
			dict.put("YEAR", "年");
			dict.put("PREPAY", "预付费");
			dict.put("AFTERPAY", "后付费");
			dict.put("IAAS", "基础设施服务");
			dict.put("PAAS", "平台服务");
			dict.put("SOFTWARE", "软件服务");
			dict.put("COMMITED", "完成");
			dict.put("GOLDEN", "金牌");
			dict.put("SILVER", "银牌");
			dict.put("NORMARL", "普通");
			dict.put("CLOSED", "关闭");
			dict.put("SUSPEND", "暂停");
			dict.put("PAY", "付款");
			dict.put("ACQUIRE", "赠送");
			dict.put("DISCOUNT", "打折");
			dict.put("FIXED", "固定价格");
			dict.put("ORIGINAL", "原始价格");
			dict.put("COMPLAINT", "投诉");
			dict.put("CONSULT", "咨询");
			dict.put("PROVISION", "规定");
			dict.put("PERSONAL", "个人");
			dict.put("ENTERPRISE", "企业");
			dict.put("IDENTITY_CARD", "身份证");
			dict.put("PASSPORT", "护照");
			dict.put("SOLDIER_CARD", "军官证");
			dict.put("TAIWAN_COMPATRIOTS_CARD", "台胞证");
			dict.put("LICENSE", "营业执照");
			dict.put("Existed", "存在");
			dict.put("NEW", "新建");
			dict.put("TELE", "电话");
			dict.put("AD", "广告");
			dict.put("MAIL", "邮件");
			dict.put("QUALIFICATION_AUDIT", "资质审核");
			dict.put("REQUIREMENT_ANALYSIS", "需求分析");
			dict.put("VALUE_ADVICE", "价值建议");
			dict.put("DECISION", "决定");
			dict.put("QUOTE", "引用");
			dict.put("NEGOTIATION", "谈判");
			dict.put("DEAL", "交易");
			dict.put("LOSTHINT", "LOSTHINT");
			dict.put("CLOSE", "关闭");
			dict.put("MENU", "菜单");
			dict.put("BUTTON", "按钮");
			dict.put("FUNCTION", "功能");
			/**
			 * BpmnStatus
			 */
			dict.put("PRE", "未提交");
			dict.put("START", "待审");
			dict.put("RUNNING", "待审");
			dict.put("REJECT", "已拒");
			dict.put("FAIL", "失败");
			dict.put("COMPLETE", "已批");
			dict.put("NOAPPROVE", "不审批");
			/**
			 * ProcessStatus
			 */
			dict.put("INITIAL", "初始化");
			dict.put("ACTIVE", "完成");
			dict.put("DISABLED", "禁用");
			dict.put("EXPIRIED", "过期");
			dict.put("INPROCESS", "进行中");
			// ----------------------------------------------------------------新旧分割线----------
			dict.put("undelivered", "未送货");
			dict.put("partialdelivered", "送货中");
			dict.put("alldelivered", "已完成");
			dict.put("running", "进行中");
			dict.put("true", "是");
			dict.put("false", "否");
			dict.put("notreceived", "未收到");
			dict.put("notdelivered", "未送出");
			dict.put("delivered", "已送出");
			dict.put("received", "已收到");
			dict.put("rejected", "作废");
			dict.put("menu", "菜单");
			dict.put("button", "按钮");
			dict.put("function", "功能");
			dict.put("notpaid", "未支付");
			dict.put("fail", "支付失败");
			dict.put("paying", "支付中");
			dict.put("cancel", "取消付款");
			dict.put("paid", "已支付");
			dict.put("offline", "线下支付");
			dict.put("purchase", "进货");
			dict.put("sales", "出货");
			dict.put("stockcheck", "盘存");
			dict.put("initPurchase", "期初录入");
			dict.put("input", "录入");
			dict.put("carryover", "结转");
			dict.put("tryout", "试用");
			dict.put("give", "赠送");
			dict.put("auto", "自动");
			dict.put("prepay", "预付");
			dict.put("pay", "支付");
			dict.put("cash", "现金");
			dict.put("alipay", "支付宝");
			dict.put("wechatpay", "微信支付");
			dict.put("bankpayonline", "网银支付");
			dict.put("payinadvance", "使用预付款");
			dict.put("collectinadvance", "使用预收款");
			dict.put("bankpay", "银行存款");
			dict.put("virement", "转账");
			dict.put("cheque", "支票");
			dict.put("debit", "借");
			dict.put("credit", "贷");
			dict.put("unlimited", "不限");
			dict.put("depreciate", "折旧");
			dict.put("undepreciate", "未折旧");
			dict.put("golden", "黄金");
			dict.put("silver", "白银");
			dict.put("normarl", "普通");
			dict.put("initial", "初始化");
			dict.put("actived", "激活");
			dict.put("suspend", "锁定");
			dict.put("expired", "过期");
			dict.put("closed", "停用");
			dict.put("acquire", "购得");
			dict.put("discount", "打折");
			dict.put("fixed", "固定计价");
			dict.put("original", "原价");
			dict.put("IDENTITY_CARD", "身份证");
			dict.put("PASSPORT", "护照");
			dict.put("SOLDIER_CARD", "军官证");
			dict.put("TAIWAN_COMPATRIOTS_CARD", "台胞证");
			dict.put("LICENSE", "许可证");
			//------------------- 贷款审批
			dict.put("NoSubmitted", "未提交");
			dict.put("Pending", "待审");
			dict.put("Approved", "已批");
			dict.put("Refuse", "已拒");

			// -----------------------------------------------------公司信息-----------
			dict.put("software", "计算机软件");
			dict.put("electric", "电子商务及通讯电子行业");
			dict.put("finance", "金融、财务顾问及典当抵押行业");
			dict.put("house", "房地产、建筑和物业装修装潢行业");
			dict.put("intermediary", "代理记账、会展、广告媒体、服务中介外包行业");
			dict.put("commerce", "贸易、进出口和代理批发零售行业");
			dict.put("education", "教育培训行业");
			dict.put("manufacture", "生产制造及加工行业");
			dict.put("transportation", "交通运输、物流和物品存储行业");
			dict.put("nonprofit", "非营利机构、学校和科研机构");
			dict.put("afhf", "农林牧渔行业");
			dict.put("smallscale", "小规模纳税人");
			dict.put("generalvat", "一般增值税纳税人");

			dict.put("ltd", "有限责任公司");
			dict.put("unincorporated", "非公司企业");
			dict.put("individual", "个体工商户");
			dict.put("corp", "股份有限责任公司");
			dict.put("proprietorship", "私营独资企业");
			dict.put("jointventures", "中外合资企业");
			dict.put("wfoe", "外商独资企业");

			dict.put("RMB", "人民币");

			dict.put("smallbusiness", "小企业会计准则");

			dict.put("create", "创建");
			dict.put("update", "修改");
			dict.put("delete", "删除");
			dict.put("query", "查询");
			
			dict.put("opened", "打开"); 
			dict.put("closed", "关闭"); 
			dict.put("reopened", "反结账"); 

			dict.put("QuotationOrder", "报价单");
			dict.put("SalesOrder", "销售单");
			dict.put("PurchaseOrder", "采购单");
			dict.put("SalesDeliveryOrder", "送货单");
			dict.put("PurchaseDeliveryOrder", "收货单");
			dict.put("Journal", "凭证单");
			dict.put("SalesOrderPay", "收款单");
			dict.put("salesReturnPay", "销售退款单");
			dict.put("purchaseReturnPay", "采购退款单");
			dict.put("PurchaseOrderPay", "付款单");
			dict.put("Reimbursement", "报销单");
			dict.put("ExpensePayment", "费用支出单");
			dict.put("FeeIncome", "费用收入单");

			dict.put("canceled", "作废");
			dict.put("close", "已完成");
			dict.put("normal", "进行中");
			dict.put("createdSalesOrder", "生成销售单");
			dict.put("notCreatedSalesOrder", "未生成销售单");
			/**
			 * 支出类型
			 */
			dict.put("SALES", "销售");
			dict.put("MANAGEMENT", "管理");
			dict.put("FINANCE", "财务");
			dict.put("UNRELATED", "营业外");
			dict.put("IMPREST", "提取备用金");
			dict.put("ADVANCE", "预支报销");
			dict.put("STAFF", "关于职工");
			dict.put("REPAYMENT", "还款");
			/**
			 * 潜在用户状态
			 */
			dict.put("notSend", "未发送");
			dict.put("sendSuccess", "已发送");
			dict.put("register", "已注册");
			/**
			 * 代金卷类型
			 */
			dict.put("ordinary", "普通");
			dict.put("all", "全额");
			
			/**
			 * 代金券发放类型
			 */
			dict.put("SYSPUSH", "系统推送");
			dict.put("LINE", "线下验码");
			
			dict.put("PURCHARSEPREPAY", "采购预付");
			dict.put("PURCHARSEPAY", "采购支出");
			dict.put("PAYREIMBURSEMENT", "支付报销单");
			dict.put("SALESPREPAY", "销售预收");
			dict.put("SALESPAY", "销售收入");
			 
			dict.put("returnclient", "客户退款");
			dict.put("returnvendor", "供应商退款");
			
			 dict.put("reimsales", "销售");
			 dict.put("reimguli", "管理");
			 dict.put("reimyanfa", "研发");
			dict.put("PURCHARSE", "采购");
			dict.put("SALES", "销售");
			dict.put("MANAGEMENT", "管理");	
			dict.put("FINANCE", "财务");
			dict.put("UNRELATED", "营业外支出");
			dict.put("IMPREST", "提取备用金");
			dict.put("ADVANCE", "预支报销");
			dict.put("OTHERADVANCE", "其它预收");
			dict.put("STAFF", "关于职工");
			dict.put("REPAYMENT", "关于还款");
			
			dict.put("salesDirect", "销售直销");
			dict.put("agentDirect", "代理直销");
			dict.put("transformation", "商机转化");
			dict.put("feeincomepay", "其他收入");
			dict.put("feeincome", "其他收入");
			dict.put("reimbursement", "报销");
			dict.put("generraldocument", "通用单据");
			dict.put("EXPENSEPAYMENT", "费用支出");
			dict.put("otherinvoice", "其他");
			dict.put("specialinvoice", "增值税专用发票");
			dict.put("ordinaryinvoice", "增值税普通发票");
			dict.put("othertax", "其他发票");
			dict.put("addedtax", "增值税发票");
			dict.put("saleandpurchase", "即销售又采购");
			dict.put("onlypurchase", "只采购");
			dict.put("onlysale", "只销售");
//			dict.put("scrap", "报废");
			dict.put("balance", "科目余额表");
			dict.put("profit", "利润表");
			dict.put("profitQuarter", "利润表季报");
			dict.put("liabilities", "资产负债表");
			dict.put("expense", "费用明细表");
			
			dict.put("Today", "今天");
			dict.put("ThisWeek", "本周");
			dict.put("ThisMonth", "本月");
			dict.put("LastMonth", "最后一月");
			dict.put("MoreOlder", "更早");
			
			dict.put("month", "月");
			dict.put("TIME", "按周期");
			dict.put("USAGE", "按用量");
			dict.put("HOUR", "小时");
			dict.put("DAY", "天");
			dict.put("MONTH", "月");
			dict.put("YEAR", "年");
			dict.put("PREPAY", "预付费");
			dict.put("AFTERPAY", "后付费");
			dict.put("IAAS", "基础设施服务");
			dict.put("PAAS", "平台服务");
			dict.put("SOFTWARE", "软件服务");
			dict.put("COMMITED", "完成");
			dict.put("GOLDEN", "金牌");
			dict.put("SILVER", "银牌");
			dict.put("NORMARL", "普通");
			dict.put("CLOSED", "关闭");
			dict.put("SUSPEND", "暂停");
			dict.put("PAY", "付款");
			dict.put("ACQUIRE", "赠送");
			dict.put("DISCOUNT", "打折");
			dict.put("FIXED", "固定价格");
			dict.put("ORIGINAL", "原始价格");
			dict.put("COMPLAINT", "投诉");
			dict.put("CONSULT", "咨询");
			dict.put("PROVISION", "规定");
			dict.put("PERSONAL", "个人");
			dict.put("ENTERPRISE", "企业");
			dict.put("IDENTITY_CARD", "身份证");
			dict.put("PASSPORT", "护照");
			dict.put("SOLDIER_CARD", "军官证");
			dict.put("TAIWAN_COMPATRIOTS_CARD", "台胞证");
			dict.put("LICENSE", "营业执照");
			dict.put("Existed", "存在");
			dict.put("NEW", "新建");
			dict.put("TELE", "电话");
			dict.put("AD", "广告");
			dict.put("MAIL", "邮件");
			dict.put("QUALIFICATION_AUDIT", "资质审核");
			dict.put("REQUIREMENT_ANALYSIS", "需求分析");
			dict.put("VALUE_ADVICE", "价值建议");
			dict.put("DECISION", "决定");
			dict.put("QUOTE", "引用");
			dict.put("NEGOTIATION", "谈判");
			dict.put("DEAL", "交易");
			dict.put("LOSTHINT", "LOSTHINT");
			dict.put("CLOSE", "关闭");
			dict.put("MENU", "菜单");
			dict.put("BUTTON", "按钮");
			dict.put("FUNCTION", "功能");
			/**
			 * BpmnStatus
			 */
			dict.put("PRE", "未提交");
			dict.put("START", "待审");
			dict.put("RUNNING", "待审");
			dict.put("REJECT", "已拒");
			dict.put("FAIL", "失败");
			dict.put("COMPLETE", "已批");
			dict.put("NOAPPROVE", "不需审批");
			/**
			 * ProcessStatus
			 */
			dict.put("INITIAL", "初始化");
			dict.put("ACTIVE", "完成");
			dict.put("DISABLED", "禁用");
			dict.put("EXPIRIED", "过期");
			dict.put("INPROCESS", "进行中");
			// ----------------------------------------------------------------新旧分割线----------
			dict.put("undelivered", "未送货");
			dict.put("partialdelivered", "送货中");
			dict.put("alldelivered", "已完成");
			
			dict.put("unreceived", "未收货");
			dict.put("allreceived", "已完成");
			dict.put("partialreceived", "收货中");
			
			dict.put("running", "进行中");
			dict.put("true", "是");
			dict.put("false", "否");
			dict.put("notreceived", "未收到");
			dict.put("notdelivered", "未送出");
			dict.put("delivered", "已送出");
			dict.put("closedOrder", "已关闭");
			dict.put("partialReturn", "部分退货");
			dict.put("allReturn", "全部退货");
			dict.put("received", "已收到");
			dict.put("rejected", "作废");
			dict.put("menu", "菜单");
			dict.put("button", "按钮");
			dict.put("function", "功能");
			dict.put("nosalespaid", "未收款");
			
			dict.put("tryout", "试用");
			dict.put("notpaid", "未支付");
			dict.put("paying", "支付中");
			dict.put("paid", "已支付");
			dict.put("cancel", "取消订单");
			dict.put("fail", "支付失败");
			dict.put("give", "赠送");
			dict.put("offline", "线下支付");
			dict.put("ordinary", "普通优惠券");
			dict.put("all", "全额优惠券");
			
			dict.put("purchase", "收票");
			dict.put("sales", "开票");
			dict.put("stockcheck", "盘存");
			dict.put("initPurchase", "期初录入");
			dict.put("advanceSales","销售提前出库");
			dict.put("advanceSalesForUpdate","销售提前出库更新");
			dict.put("advanceSalesForCancel", "销售退回入库");
			dict.put("advanceSalesForClose", "销售退回入库");
			dict.put("input", "录入");
			dict.put("carryover", "结转");
			dict.put("auto", "自动");
			dict.put("prepay", "预付");
			dict.put("pay", "支付");
			dict.put("cash", "现金");
			dict.put("alipay", "支付宝");
			dict.put("wechatpay", "微信支付");
			dict.put("bankpayonline", "网银支付");
			dict.put("payinadvance", "使用预付款");
			dict.put("collectinadvance", "使用预收款");
			dict.put("journalInflow", "凭证流入");
			dict.put("journalOutflow", "凭证流出");
			
			dict.put("bankpay", "银行存款");
			dict.put("virement", "转账");
			dict.put("cheque", "支票");
			dict.put("debit", "借");
			dict.put("credit", "贷");
			dict.put("unlimited", "不限");
			//固定资产
			dict.put("depreciate", "折旧中");
//			dict.put("undepreciate", "未折旧");
			dict.put("stopDepreciate", "折旧完成");
			dict.put("scrap", "报废");
			dict.put("pauseDepreciate", "暂停折旧");
			dict.put("sell", "出售");
			
			dict.put("golden", "黄金");
			dict.put("silver", "白银");
			dict.put("normarl", "普通");
			dict.put("initial", "初始化");
			dict.put("actived", "激活");
			dict.put("suspend", "锁定");
			dict.put("expired", "过期");
			dict.put("closed", "停用");
			dict.put("acquire", "购得");
			dict.put("discount", "打折");
			dict.put("fixed", "固定计价");
			dict.put("original", "原价");
			dict.put("IDENTITY_CARD", "身份证");
			dict.put("PASSPORT", "护照");
			dict.put("SOLDIER_CARD", "军官证");
			dict.put("TAIWAN_COMPATRIOTS_CARD", "台胞证");
			dict.put("LICENSE", "许可证");
			
			dict.put("NoSubmitted", "未提交");
			dict.put("Pending", "待审");
			dict.put("Approved", "已批");
			dict.put("Refuse", "已拒");
			dict.put("frJournal", "凭证生成");
			// -----------------------------------------------------公司信息-----------
			dict.put("software", "计算机软件");
			dict.put("electric", "电子商务及通讯电子行业");
			dict.put("finance", "金融、财务顾问及典当抵押行业");
			dict.put("house", "房地产、建筑和物业装修装潢行业");
			dict.put("intermediary", "代理记账、会展、广告媒体、服务中介外包行业");
			dict.put("commerce", "贸易、进出口和代理批发零售行业");
			dict.put("education", "教育培训行业");
			dict.put("manufacture", "生产制造及加工行业");
			dict.put("transportation", "交通运输、物流和物品存储行业");
			dict.put("nonprofit", "非营利机构、学校和科研机构");
			dict.put("afhf", "农林牧渔行业");
			dict.put("smallscale", "小规模纳税人");
			dict.put("generalvat", "一般增值税纳税人");

			dict.put("ltd", "有限责任公司");
			dict.put("unincorporated", "非公司企业");
			dict.put("individual", "个体工商户");
			dict.put("corp", "股份有限责任公司");
			dict.put("proprietorship", "私营独资企业");
			dict.put("jointventures", "中外合资企业");
			dict.put("wfoe", "外商独资企业");

			dict.put("RMB", "人民币");

			dict.put("smallbusiness", "小企业会计准则");
			
			dict.put("create", "创建");
			dict.put("update", "修改");
			dict.put("delete", "删除");
			dict.put("query", "查询");
			dict.put("upgrade", "更新");
			
			dict.put("QuotationOrder", "报价单");
			dict.put("SalesOrder", "销售单");
			dict.put("PurchaseOrder", "采购单");
			dict.put("SalesDeliveryOrder", "送货单");
			dict.put("PurchaseDeliveryOrder", "收货单");
			dict.put("Journal", "凭证单");
			dict.put("SalesOrderPay", "收款单");
			dict.put("salesReturnPay", "销售退款单");
			dict.put("purchaseReturnPay", "采购退款单");
			dict.put("PurchaseOrderPay", "付款单");
			dict.put("Reimbursement", "报销单");
			dict.put("ExpensePayment", "费用支出单");
			dict.put("expensePayment", "费用支出");
			dict.put("FeeIncome", "其他收入单");
			dict.put("PurchaseReturnDeliveryOrder", "采购退货单");
			dict.put("SalesReturnDeliveryOrder", "销售退货单");
			dict.put("Receipt", "发票");
			dict.put("generalDocuments","通用单据");
			
			dict.put("SalesGeneralDocuments","通用单据");
			dict.put("PurchaseGeneralDocuments","通用单据");
			
			dict.put("canceled", "作废");
			dict.put("close", "已完成");
			dict.put("normal", "进行中");
			dict.put("createdSalesOrder", "生成销售单");
			dict.put("closedOrder", "关闭");
			dict.put("notCreatedSalesOrder", "未生成销售单");

			dict.put("allverify","全部核销");
			dict.put("someverify","部分核销");
			dict.put("noverify","未核销");
			
			dict.put("OtherPay","其他应付");
			/**
			 * 支出类型
			 */
			dict.put("SALES","销售");
			dict.put("MANAGEMENT","管理");
			dict.put("FINANCE","财务");
			dict.put("UNRELATED","营业外");
			dict.put("IMPREST","提取备用金");
			dict.put("ADVANCE","预支报销");
			dict.put("STAFF","关于职工");
			dict.put("REPAYMENT","关于还款");
			dict.put("outofbusiness","营业外");
			dict.put("mainbusiness","主营业务");
			dict.put("otherbusiness","其他业务");
			dict.put("shorttermloan","关于借款");
			dict.put("interestincome","利息收入");
			dict.put("PREPAREWAGES","预支工资");
			dict.put("Otherreceivable","其他应收");
			dict.put("carryoverCost", "结转成本");
			/**
			 * 单据类型         
			 */
			dict.put("nowreceivables","现收款");
			dict.put("answerreceivables","预收款");
			dict.put("preparereceivables","应收款");
			dict.put("nowpayment","现付款");
			dict.put("answerpayment","预付款");
			dict.put("preparepayment","应付款");
			dict.put("otherdocuments","其他");
			
			/**
			 * 凭证匹配通用单据类型
			 */
			dict.put("unassociation", "不匹配");
			dict.put("inflow", "资金流入");
			dict.put("outflow", "资金流出");
			dict.put("OtherAssociation", "其他");
			
			dict.put("generalpay", "预付款");
			dict.put("generalreceived", "预收款");
			dict.put("documentsPay", "冲销应付款");
			dict.put("documentsgetPay", "冲销应收款");
			
			dict.put("reimsales", "销售");
			dict.put("reimguli", "管理");
			dict.put("reimyanfa", "研发");
			
			dict.put("Inventory", "库存");
			
			dict.put("unassociation", "不匹配");
			dict.put("inflow", "资金流入");
			dict.put("outflow", "资金流出");
			dict.put("OtherAssociation", "其他");
			
			dict.put("checkBegin", "审核开始");
			dict.put("checkAgainBegin", "复核开始");
			dict.put("upload", "上传");
			dict.put("download", "下载");
			dict.put("stayOrder", "待抢单");
			dict.put("orderSuccess", "已抢单");
			dict.put("orderSubmit", "待审核");
			dict.put("checking", "审核中");
			dict.put("checkingAgain", "复核中");
			dict.put("checkSuccess", "审核通过");
			dict.put("complete", "客户确认");
			dict.put("checkFailed", "审核不通过");
			dict.put("checkRefused", "客户拒绝");
			dict.put("orderSubmitAgain", "待复审");
			dict.put("general", "一般");
			dict.put("emergency", "加急");
			dict.put("veryEmergency", "特别加急");
			dict.put("loginLog", "登陆");
			dict.put("checkAgainSuccess", "复核通过");
			dict.put("checkAgainFailed", "复核不通过");
			dict.put("KFReject", "客服驳回");
			dict.put("KHBackout", "客户撤销");
			dict.put("KHSubmitAgain", "客户重新提交");
			dict.put("kfRejectFont", "很抱歉,智能转换过程中无法识别您的笔记");//驳回理由 无法识别笔记
			dict.put("kfRejectInfo", "很抱歉,智能转换过程中产品信息识别不全");//驳回理由 信息不全
		}
		return dict;
	}

	/**
	 * 记录日志的业务
	 */
	
	static public enum TaxProgressType {
		//未操作
		nodo {
			@Override
			public String toString() {
				return "nodo";
			}
		},	
		//已结转损益
		docarryover {
			@Override
			public String toString() {
				return "docarryover";
			}
		},
		//已结转损益
		docheckout {
			@Override
			public String toString() {
				return "docheckout";
			}
		},
		docomplete {
			@Override
			public String toString() {
				return "docomplete";
			}
		},
	}
	
	static public enum ActionLogType {
		/**
		 * 保价单
		 */
		quotationorder {
			@Override
			public String toString() {
				return "quotationorder";
			}
		},
		/**
		 * 销售单
		 */
		sales {
			@Override
			public String toString() {
				return "sales";
			}
		},
		/**
		 * 送货
		 */
		salesdelivery {
			@Override
			public String toString() {
				return "salesdelivery";
			}
		},
		/**
		 * 收款
		 */
		salesorderpay {
			@Override
			public String toString() {
				return "salesorderpay";
			}
		},
		/**
		 * 采购
		 */
		purchase {
			@Override
			public String toString() {
				return "purchase";
			}
		},
		/**
		 * 收货
		 */
		purchasedelivery {
			@Override
			public String toString() {
				return "purchasedelivery";
			}
		},
		/**
		 * 付款
		 */
		purchasepay {
			@Override
			public String toString() {
				return "purchasepay";
			}
		},
		/**
		 * 凭证
		 */
		journal {
			@Override
			public String toString() {
				return "journal";
			}
		}
	}

	/**
	 * 支出类别
	 */
	static public enum ExpenseType {
		/**
		 * 销售
		 */
		SALES {
			@Override
			public String toString() {
				return "SALES";
			}
		},
		/**
		 * 管理
		 */
		MANAGEMENT {
			@Override
			public String toString() {
				return "MANAGEMENT";
			}
		},
		/**
		 * 财务
		 */
		FINANCE {
			@Override
			public String toString() {
				return "FINANCE";
			}
		},
		/**
		 * 营业外
		 */
		UNRELATED {
			@Override
			public String toString() {
				return "UNRELATED";
			}
		},
		/**
		 * 提取备用金
		 */
		IMPREST {
			@Override
			public String toString() {
				return "IMPREST";
			}
		},
		/**
		 * 预支报销
		 */
		ADVANCE {
			@Override
			public String toString() {
				return "ADVANCE";
			}
		},
		/**
		 * 关于职工
		 */
		STAFF {
			@Override
			public String toString() {
				return "STAFF";
			}
		},
		/**
		 * 还款
		 */
		REPAYMENT {
			@Override
			public String toString() {
				return "REPAYMENT";
			}
		}

	}

	/**
	 * 操作方式
	 */
	static public enum MethodType {
		/**
		 * 新增
		 */
		create {
			@Override
			public String toString() {
				return "save";
			}
		},
		/**
		 * 查询
		 */
		find {
			@Override
			public String toString() {
				return "find";
			}
		},
		/**
		 * 更新
		 */
		update {
			@Override
			public String toString() {
				return "update";
			}
		},
		/**
		 * 删除
		 */
		delete {
			@Override
			public String toString() {
				return "delete";
			}
		}
	}

	/**
	 * 产生凭证的类型
	 */
	public enum JournalBizType {
		purchaseDelivery("purchaseDelivery"), purchaseReturnDelivery("purchaseReturnDelivery"), purchasePay(
				"purchasePay"), salesDelivery("salesDelivery"), salesReturnDelivery(
						"salesReturnDelivery"), salesPay("salesPay"), stockcheck("stockcheck"), expensePayment(
								"expensePayment"), feeincomepay("feeincomepay"), salesReturnPay(
										"salesReturnPay"), purchaseReturnPay("purchaseReturnPay");

		JournalBizType(String name) {
			this.name = name;
		}

		/**
		 * (收货:purchaseDelivery、 付款:purchasePay 、送货:salesDelivery、 收款:salesPay、
		 * 盘存:stockcheck)
		 */
		private String name;

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}
	}

	/**
	 * 计重方式
	 * @author  zhangYiFei
	 *
	 */
	static public enum WeightUnit {
		g,
		kg
	}
	
	/**
	 * 潜在用户状态
	 */
	static public enum PotentialCustomersStatus {
		/**
		 * 1:未发送
		 */
		notSend {
			@Override
			public String toString() {
				return "notSend";
			}
		},
		/**
		 * 2：已发送
		 */
		sendSuccess {
			@Override
			public String toString() {
				return "sendSuccess";
			}
		},
		/**
		 * 3：已注册
		 */
		register {
			@Override
			public String toString() {
				return "register";
			}
		}
	}
	
	/**
	 * 
	* @Description: TODO(消息类型) 
	* @author Lambert 
	* @date 2017年5月23日 下午4:11:58 
	*
	 */
	static public enum InformationType {
		/**
		 * 收款提醒
		 */
		CollectionRemind{
			@Override
			public String toString() {
				return "CollectionRemind";
			}
		},
		
		/**
		 * 付款提醒
		 */
		paymentRemind{
			@Override
			public String toString() {
				return "paymentRemind";
			}
		},
		
		/**
		 * 送货提醒
		 */
		DeliveryRemind{
			@Override
			public String toString() {
				return "DeliveryRemind";
			}
		},
		
		/**
		 * 收货提醒
		 */
		ReceivingRemind{
			@Override
			public String toString() {
				return "ReceivingRemind";
			}
		},
		/**
		 * 系统提醒
		 */
		SystemRemind{
			@Override
			public String toString() {
				return "SystemRemind";
			}
		},
		/**
		 * 订单装换
		 */
		OCR{
			@Override
			public String toString() {
				return "OCR";
			}
		}
	}
}
