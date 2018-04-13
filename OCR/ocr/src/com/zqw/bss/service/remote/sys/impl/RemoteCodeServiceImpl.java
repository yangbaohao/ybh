package com.zqw.bss.service.remote.sys.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.vo.CodeVo;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.service.remote.sys.RemoteCodeService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;

/**
 * 数据字典服务
 * @author chxiaoqi
 *
 */
public class RemoteCodeServiceImpl implements RemoteCodeService {
	
	private final Logger logger = Logger.getLogger(this.getClass());
	
	private CommonService commonService;
	
	@Autowired
	public void setCommonService(CommonService commonService) {
		this.commonService = commonService;
	}

	private Map<String,List<CodeVo>> map = new HashMap<String,List<CodeVo>>();
	
	public RemoteCodeServiceImpl(){
		List<CodeVo> user_locked_list = new ArrayList<CodeVo>();
		CodeVo user_locked_vo1 = new CodeVo(1L,"USER_LOCKED","true","冻结",1);
		CodeVo user_locked_vo2 = new CodeVo(2L,"USER_LOCKED","false","不冻结",2);
		user_locked_list.add(user_locked_vo1);
		user_locked_list.add(user_locked_vo2);
		
		//用户状态
		List<CodeVo> user_status_list = new ArrayList<CodeVo>();
		CodeVo user_status_vo1 = new CodeVo(1L,"USER_STATUS","true","可用",1);
		CodeVo user_status_vo2 = new CodeVo(2L,"USER_STATUS","false","不可用",2);
		user_status_list.add(user_status_vo1);
		user_status_list.add(user_status_vo2);
		
		CodeVo customerTypeVo1 = new CodeVo(3L,"CUSTOMER_TYPE","PERSONAL","个人",1);
		CodeVo customerTypeVo2 = new CodeVo(4L,"CUSTOMER_TYPE","ENTERPRISE","企业",2);
		List<CodeVo> customerTypeList = new ArrayList<CodeVo>();
		customerTypeList.add(customerTypeVo1);
		customerTypeList.add(customerTypeVo2);
		
		CodeVo customerStatusVo1 = new CodeVo(5L,"CUSTOMER_STATUS","INITIAL","初始",1);
		CodeVo customerStatusVo2 = new CodeVo(6L,"CUSTOMER_STATUS","ACTIVE","已激活",2);
		CodeVo customerStatusVo3 = new CodeVo(7L,"CUSTOMER_STATUS","EXPIRIED","过期",3);
		List<CodeVo> customerStatusList = new ArrayList<CodeVo>();
		customerStatusList.add(customerStatusVo1);
		customerStatusList.add(customerStatusVo2);
		customerStatusList.add(customerStatusVo3);
		
		CodeVo certificateTypeVo1 = new CodeVo(8L,"CERTIFICATE_TYPE","IDENTITY_CARD","身份证",1);
		CodeVo certificateTypeVo2 = new CodeVo(9L,"CERTIFICATE_TYPE","PASSPORT","护照",2);
		CodeVo certificateTypeVo3 = new CodeVo(10L,"CERTIFICATE_TYPE","SOLDIER_CARD","军官证",3);
		CodeVo certificateTypeVo4 = new CodeVo(11L,"CERTIFICATE_TYPE","TAIWAN_COMPATRIOTS_CARD","台胞证",4);
		List<CodeVo> certificateTypeList = new ArrayList<CodeVo>();
		certificateTypeList.add(certificateTypeVo1);
		certificateTypeList.add(certificateTypeVo2);
		certificateTypeList.add(certificateTypeVo3);
		certificateTypeList.add(certificateTypeVo4);
		
		CodeVo unitIdTypeVo1 = new CodeVo(12L,"UNITID_TYPE","LICENSE","营业执照",1);
		List<CodeVo> unitIdTypeList = new ArrayList<CodeVo>();
		unitIdTypeList.add(unitIdTypeVo1);
		
		CodeVo workOrderVo1 = new CodeVo(13L,"WORKORDER_STATUS","INITIAL","初始",1);
		CodeVo workOrderVo2 = new CodeVo(14L,"WORKORDER_STATUS","ACTIVE","已激活",2);
		CodeVo workOrderVo3 = new CodeVo(15L,"WORKORDER_STATUS","EXPIRIED","过期",3);
		List<CodeVo> workOrderList = new ArrayList<CodeVo>();
		workOrderList.add(workOrderVo1);
		workOrderList.add(workOrderVo2);
		workOrderList.add(workOrderVo3);
		
		CodeVo workOrderTypeVo1 = new CodeVo(13L,"WORKORDER_TYPE","COMPLAINT","投诉",1);
		CodeVo workOrderTypeVo2 = new CodeVo(14L,"WORKORDER_TYPE","CONSULT","咨询",2);
		CodeVo workOrderTypeVo3 = new CodeVo(15L,"WORKORDER_TYPE","PROVISION","服务开通",3);
		List<CodeVo> workOrderTypeList = new ArrayList<CodeVo>();
		workOrderTypeList.add(workOrderTypeVo1);
		workOrderTypeList.add(workOrderTypeVo2);
		workOrderTypeList.add(workOrderTypeVo3);
		
		CodeVo ContractTypeListVo1 = new CodeVo(16L,"CONTRACT_TYPE","IAAS","基础设施服务",1);
		CodeVo ContractTypeListVo2 = new CodeVo(17L,"CONTRACT_TYPE","PAAS","平台服务",2);
		CodeVo ContractTypeListVo3 = new CodeVo(18L,"CONTRACT_TYPE","SOFTWARE","软件服务",3);
		List<CodeVo> ContractTypeList = new ArrayList<CodeVo>();
		ContractTypeList.add(ContractTypeListVo1);
		ContractTypeList.add(ContractTypeListVo2);
		ContractTypeList.add(ContractTypeListVo3);
		
		CodeVo ContractStatusListVo1 = new CodeVo(16L,"CONTRACT_STATUS","INITIAL","创建中",1);
		CodeVo ContractStatusListVo2 = new CodeVo(17L,"CONTRACT_STATUS","INPROCESS","已提交",2);
		CodeVo ContractStatusListVo3 = new CodeVo(18L,"CONTRACT_STATUS","ACTIVE","已生效",3);
		CodeVo ContractStatusListVo4 = new CodeVo(18L,"CONTRACT_STATUS","DISABLED","禁用",3);
		CodeVo ContractStatusListVo5 = new CodeVo(19L,"CONTRACT_STATUS","EXPIRIED","已结束",4);
		List<CodeVo> ContractStatusList = new ArrayList<CodeVo>();
		ContractStatusList.add(ContractStatusListVo1);
		ContractStatusList.add(ContractStatusListVo2);
		ContractStatusList.add(ContractStatusListVo3);
		ContractStatusList.add(ContractStatusListVo4);
		ContractStatusList.add(ContractStatusListVo5);
		
		CodeVo PayTypeListVo1 = new CodeVo(20L,"PAY_TYPE","PREPAY","预付费",1);
		CodeVo PayTypeListVo2 = new CodeVo(21L,"PAY_TYPE","AFTERPAY","后付费",2);
		List<CodeVo> PayTypeList = new ArrayList<CodeVo>();
		PayTypeList.add(PayTypeListVo1);
		PayTypeList.add(PayTypeListVo2);
		
		// 角色状态
		List<CodeVo> role_status_list = new ArrayList<CodeVo>();
		CodeVo role_status_vo1 = new CodeVo(1L,"ROLE_STATUS","true","可用",1);
		CodeVo role_status_vo2 = new CodeVo(2L,"ROLE_STATUS","false","不可用",2);
		role_status_list.add(role_status_vo1);
		role_status_list.add(role_status_vo2);
		
		//税率
		List<CodeVo> sale_vat_list = new ArrayList<CodeVo>();
		CodeVo sale_vat_vo1 = new CodeVo(1L,"SALE_VAT","first","0%",1);
		CodeVo sale_vat_vo2 = new CodeVo(2L,"SALE_VAT","second","3%",2);
		CodeVo sale_vat_vo3 = new CodeVo(3L,"SALE_VAT","third","6%",3);
		CodeVo sale_vat_vo4 = new CodeVo(4L,"SALE_VAT","fourth","11%",4);
		CodeVo sale_vat_vo5 = new CodeVo(5L,"SALE_VAT","five","13%",5);
		CodeVo sale_vat_vo6 = new CodeVo(6L,"SALE_VAT","six","17%",6);
		sale_vat_list.add(sale_vat_vo1);
		sale_vat_list.add(sale_vat_vo2);
		sale_vat_list.add(sale_vat_vo3);
		sale_vat_list.add(sale_vat_vo4);
		sale_vat_list.add(sale_vat_vo5);
		sale_vat_list.add(sale_vat_vo6);
		
		
		
		
		List<CodeVo> entry_status_list = new ArrayList<CodeVo>();
		CodeVo entry_status_vo1 = new CodeVo(1L,"ENTRY_STATUS","INITIAL","INITIAL",1);
		CodeVo entry_status_vo2 = new CodeVo(2L,"ENTRY_STATUS","ACTIVE","ACTIVE",2);
		CodeVo entry_status_vo3 = new CodeVo(3L,"ENTRY_STATUS","DISABLED","DISABLED",3);
		CodeVo entry_status_vo4 = new CodeVo(3L,"ENTRY_STATUS","EXPIRIED","EXPIRIED",4);
		entry_status_list.add(entry_status_vo1);
		entry_status_list.add(entry_status_vo2);
		entry_status_list.add(entry_status_vo3);
		entry_status_list.add(entry_status_vo4);
		
		List<CodeVo> potential_type_list = new ArrayList<CodeVo>();
		CodeVo potential_type_vo1 = new CodeVo(1L,"POTENTIAL_TYPE","Existed","存在",1);
		CodeVo potential_type_vo2 = new CodeVo(2L,"POTENTIAL_TYPE","NEW","新建",2);
		potential_type_list.add(potential_type_vo1);
		potential_type_list.add(potential_type_vo2);
		
		List<CodeVo> potential_source_list = new ArrayList<CodeVo>();
		CodeVo potential_source_vo1 = new CodeVo(1L,"POTENTIAL_SOURCE","TELE","电话",1);
		CodeVo potential_source_vo2 = new CodeVo(2L,"POTENTIAL_SOURCE","AD","广告",2);
		CodeVo potential_source_vo3 = new CodeVo(3L,"POTENTIAL_SOURCE","MAIL","邮件",3);
		potential_source_list.add(potential_source_vo1);
		potential_source_list.add(potential_source_vo2);
		potential_source_list.add(potential_source_vo3);
		
		List<CodeVo> potential_stage_list = new ArrayList<CodeVo>();
		CodeVo potential_stage_vo1 = new CodeVo(1L,"POTENTIAL_STAGE","QUALIFICATION_AUDIT","资质审查",1);
		CodeVo potential_stage_vo2 = new CodeVo(2L,"POTENTIAL_STAGE","REQUIREMENT_ANALYSIS","需求分析",2);
		CodeVo potential_stage_vo3 = new CodeVo(3L,"POTENTIAL_STAGE","VALUE_ADVICE","价值建议",3);
		CodeVo potential_stage_vo4 = new CodeVo(3L,"POTENTIAL_STAGE","DECISION","确定决策者",4);
		CodeVo potential_stage_vo5 = new CodeVo(3L,"POTENTIAL_STAGE","QUOTE","提案/报价",5);
		CodeVo potential_stage_vo6 = new CodeVo(3L,"POTENTIAL_STAGE","NEGOTIATION","谈判/复审",6);
		CodeVo potential_stage_vo7 = new CodeVo(3L,"POTENTIAL_STAGE","DEAL","成交",7);
		CodeVo potential_stage_vo8 = new CodeVo(3L,"POTENTIAL_STAGE","LOSTHINT","丢失的线索",8);
		CodeVo potential_stage_vo9 = new CodeVo(3L,"POTENTIAL_STAGE","CLOSE","因竞争丢失关闭",9);
		potential_stage_list.add(potential_stage_vo1);
		potential_stage_list.add(potential_stage_vo2);
		potential_stage_list.add(potential_stage_vo3);
		potential_stage_list.add(potential_stage_vo4);
		potential_stage_list.add(potential_stage_vo5);
		potential_stage_list.add(potential_stage_vo6);
		potential_stage_list.add(potential_stage_vo7);
		potential_stage_list.add(potential_stage_vo8);
		potential_stage_list.add(potential_stage_vo9);
		
		// Charge Plan Type
		List<CodeVo> charge_plan_type_list = new ArrayList<CodeVo>();
		CodeVo charge_plan_type_vo1 = new CodeVo(1L,"CHARGE_PLAN_TYPE","ORIGINAL","原始计价",1);
		CodeVo charge_plan_type_vo2 = new CodeVo(2L,"CHARGE_PLAN_TYPE","FIXED","固定计价",2);
		CodeVo charge_plan_type_vo3 = new CodeVo(3L,"CHARGE_PLAN_TYPE","DISCOUNT","打折",3);
		charge_plan_type_list.add(charge_plan_type_vo1);
		charge_plan_type_list.add(charge_plan_type_vo2);
		charge_plan_type_list.add(charge_plan_type_vo3);
		
		List<CodeVo> charging_type_list = new ArrayList<CodeVo>();
		CodeVo charging_type_vo1 = new CodeVo(1L,"CHARGING_TYPE","TIME","按周期计费",1);
		CodeVo charging_type_vo2 = new CodeVo(2L,"CHARGING_TYPE","ONEOFF","一次性计费",2);
		CodeVo charging_type_vo3 = new CodeVo(3L,"CHARGING_TYPE","USAGE","使用量计费",3);
		charging_type_list.add(charging_type_vo1);
		charging_type_list.add(charging_type_vo2);
		charging_type_list.add(charging_type_vo3);
		
		// Product Charge Unit
		List<CodeVo> charge_unit_list = new ArrayList<CodeVo>();
		CodeVo charge_unit_vo1 = new CodeVo(1L,"CHARGE_UNIT","YEAR","年",1);
		CodeVo charge_unit_vo2 = new CodeVo(2L,"CHARGE_UNIT","MONTH","月",2);
		CodeVo charge_unit_vo3 = new CodeVo(2L,"CHARGE_UNIT","DAY","天",3);
		CodeVo charge_unit_vo4 = new CodeVo(2L,"CHARGE_UNIT","HOUR","小时",4);
		charge_unit_list.add(charge_unit_vo1);
		charge_unit_list.add(charge_unit_vo2);
		charge_unit_list.add(charge_unit_vo3);
		charge_unit_list.add(charge_unit_vo4);
		
		List<CodeVo> UniteResourcePriceType_list = new ArrayList<CodeVo>();
		CodeVo UniteResourcePriceType_vo1 = new CodeVo(1L,"UniteResourcePriceType","TIME","按周期计价",1);
		CodeVo UniteResourcePriceType_vo2 = new CodeVo(2L,"UniteResourcePriceType","USAGE","按量计价",2);
		CodeVo UniteResourcePriceType_vo3 = new CodeVo(3L,"UniteResourcePriceType","ONETIME","一次性计费",3);
		
		UniteResourcePriceType_list.add(UniteResourcePriceType_vo1);
		UniteResourcePriceType_list.add(UniteResourcePriceType_vo2);
		UniteResourcePriceType_list.add(UniteResourcePriceType_vo3);
		
		List<CodeVo> dispatchTypeList = new ArrayList<CodeVo>();
		CodeVo dispatchType_vo1 = new CodeVo(1L,"DispatchType","VIP","VIP用户",1);
		CodeVo dispatchType_vo2 = new CodeVo(2L,"DispatchType","OTHER","其他用户",2);
		dispatchTypeList.add(dispatchType_vo1);
		dispatchTypeList.add(dispatchType_vo2);
		
		List<CodeVo> providerList = new ArrayList<CodeVo>();
		CodeVo provider_vo1 = new CodeVo(1L,"PROVIDER","XCloud","XCloud",1);
		providerList.add(provider_vo1);
		
		List<CodeVo> contractStandardList = new ArrayList<CodeVo>();
		CodeVo contractStandard_vo1 = new CodeVo(1L,"CONTRACT_STANDARD","UNSTANDARD","非标准合同",1);
		CodeVo contractStandard_vo2 = new CodeVo(1L,"CONTRACT_STANDARD","STANDARD","标准合同",2);
		contractStandardList.add(contractStandard_vo1);
		contractStandardList.add(contractStandard_vo2);
		
		List<CodeVo> resourceTypeList = new ArrayList<CodeVo>();
//		CodeVo resourceType_vo1 = new CodeVo(1L,"RESOURCE_TYPE","menu","菜单",1);
		CodeVo resourceType_vo2 = new CodeVo(2L,"RESOURCE_TYPE","function","功能",1);
		CodeVo resourceType_vo3 = new CodeVo(3L,"RESOURCE_TYPE","button","按钮",2);
//		resourceTypeList.add(resourceType_vo1);
		resourceTypeList.add(resourceType_vo2);
		resourceTypeList.add(resourceType_vo3);
		
		map.put("SALT_VAT",sale_vat_list);
		map.put("DISPATCH_TYPE", dispatchTypeList);
		map.put("PRICE_TYPE", UniteResourcePriceType_list);
		map.put("USER_STATUS", user_status_list);
		map.put("RESOURCE_TYPE", resourceTypeList);
		map.put("ORGANIZATION_STATUS", user_status_list);
		map.put("CUSTOMER_TYPE", customerTypeList);
		map.put("CUSTOMER_STATUS", customerStatusList);
		map.put("CERTIFICATE_TYPE", certificateTypeList);
		map.put("UNITID_TYPE", unitIdTypeList);
		map.put("WORKORDER_STATUS", workOrderList);
		map.put("WORKORDER_TYPE", workOrderTypeList);
		map.put("CONTRACT_TYPE", ContractTypeList);
		map.put("CONTRACT_STATUS", ContractStatusList);
		map.put("PAY_TYPE", PayTypeList);
		map.put("ROLE_STATUS", role_status_list);
		map.put("ENTRY_STATUS", entry_status_list);
		map.put("POTENTIAL_TYPE", potential_type_list);
		map.put("POTENTIAL_SOURCE", potential_source_list);
		map.put("POTENTIAL_STAGE", potential_stage_list);
		map.put("CHARGE_PLAN_TYPE", charge_plan_type_list);
		map.put("CHARGE_UNIT", charge_unit_list);
		map.put("CHARGING_TYPE", charging_type_list);
		map.put("USER_LOCKED", user_locked_list);
		map.put("PROVIDER", providerList);
		map.put("CONTRACT_STANDARD", contractStandardList);
	}

	@Override
	public List<CodeVo> getCodeByCategory(String category) {
		logger.info("begin getCodeByCategory.");
		logger.info(map.get(category));
		List<CodeVo> list = map.get(category);
		logger.info("end  getCodeByCategory:[ id ="+ WebUtil.getLogBasicString() + "]");
		return list;
	}

	@Override
	public Map<String, String> getdictionary() {
		logger.info("begin getdictionary.");
		Map<String, String> map = SystemConstant.getDict();
		logger.info("end  getdictionary:[ id ="+ WebUtil.getLogBasicString() + "]");
		return map;
	}
	

	@Override
	public String getRandomCode(String prefix, int length) {
		logger.info("begin getRandomCode");
		if(StringUtils.isEmpty(prefix)) prefix = "";
		if(length < 0) length = 0;
		String str =  commonService.getUuId(prefix.toUpperCase(),length).toUpperCase();
		logger.info("end getRandomCode");
		return str;
	}

}
