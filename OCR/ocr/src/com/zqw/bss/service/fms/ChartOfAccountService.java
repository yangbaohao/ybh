package com.zqw.bss.service.fms;

import java.math.BigDecimal;
import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.basic.UionPKId;
import com.zqw.bss.model.fms.ChartOfAccount;
import com.zqw.bss.util.SystemConstant.ComputeCarryoverClass;
import com.zqw.bss.vo.fms.ChartOfAccountBankListVo;
import com.zqw.bss.vo.fms.ChartOfAccountForListVO;
import com.zqw.bss.vo.fms.ChartOfAccountIdVo;

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
 * @date 2016年4月20日 下午1:20:18
 * @version 1.0
 */
@SuppressWarnings("rawtypes")
public interface ChartOfAccountService {

	/**
	 * 创建科目
	 * 
	 * @param chartOfAccount
	 * @return
	 */
	public ChartOfAccount saveChartOfAccount(ChartOfAccount chartOfAccount,Long ownerId);

	/**
	 * 删除科目
	 * 
	 * @param id
	 * @return
	 */
	public Boolean delChartOfAccount(Long id,Long ownerId);

	/**
	 * 修改科目
	 * 
	 * @param chartOfAccount
	 * @return
	 */
	public Boolean updateChartOfAccount(ChartOfAccount chartOfAccount,Long ownerId);
	
	/**
	 * 查询账户科目
	 */
	public List<ChartOfAccount> getAccountChartOfAccount(Long ownerId);

	/**
	 *获取科目 by id
	 * 
	 * @param id
	 * @return
	 */
	public ChartOfAccount getChartOfAccountById(Long id,Long ownerId);

	/**
	 * get chartOfAccount by code
	 * 
	 * @param code
	 * @return ChartOfAccount
	 */
	public ChartOfAccount getChartOfAccountByCode(String code,Long ownerId);

	/**
	 * 根据OwnerId为-1的数据查询
	 * 
	 * @param code
	 * @return
	 */

	public ChartOfAccount getByCodeWithNegativeOwnerId(String code);

	/**
	 * find by ChartOfAccount 条件
	 * 
	 * @param chartOfAccount
	 * @return
	 */
	public List<ChartOfAccount> findChartOfAccount(ChartOfAccount chartOfAccount);

	/**
	 * 获取所有科目
	 * 
	 * @return
	 */
	public List<ChartOfAccount> getChartOfAccounts(Long ownerId);

	/**
	 * find ChartOfAccount by coaClass
	 * 
	 * @param is
	 */
	public List<ChartOfAccount> getChartOfAccounts(Long[] is,Long ownerId);

	/**
	 * 科目列表分页
	 * 
	 * @param chartOfAccountCondition
	 * @return
	 */
	public BaseModelList<ChartOfAccount> findChartOfAccounts(
			BasePagerObject chartOfAccountCondition);

	/**
	 * 获取部分科目
	 * @return
	 */
	public List<ChartOfAccount> getChartOfAccountByRef(Integer classid,Long ownerId);

	/**
	 * 获取科目 by parentid
	 * @return
	 */
	public List<ChartOfAccount> getChartOfAccountByParentid(Long parentid,Long ownerId);

	/**
	 * 提交保存科目
	 * 
	 * @param chartOfAccounts
	 * @return
	 */
	public Boolean saveCOA(List<ChartOfAccount> chartOfAccounts,Long ownerId);

	/**
	 * 更改科目及其父科目的currentVale，当前科目必须是叶子节点
	 * 
	 * @param UionPKId
	 *            chartOfAccount 主键
	 * @param BigDecimal
	 *            amt 发生额
	 * 
	 * @return
	 */
	public Boolean updateCurrentValueWithParent(UionPKId pk, BigDecimal amt, String flag);

	/**
	 * @param name
	 *            ,结转业务名称
	 * @param ctime
	 *            统计日期，格式为yyyy-MM
	 * @return
	 */
	public List getChartOfAccountList(ComputeCarryoverClass classId,
			String ctime,Long ownerId);

	/**
	 * 获取科目列表Vo
	 * @return
	 */
	public List<ChartOfAccountForListVO> getAllChartOfAccountForListVO(Long ownerId);

	/**
	 * 获取科目Vo by query
	 * @param query
	 * @return
	 */
	public ChartOfAccountForListVO getChartOfAccountForListVO(Long ownerId,String query);

	/**
	 * 获取资金分布
	 * @return
	 */
	public List<ChartOfAccountBankListVo> getBankCapital();

	
	/**
	 * 获取所有科目的id
	 * @return
	 */
	public List<ChartOfAccountIdVo> getIdFromChartOfAccount(Long ownerId);

	public void modifyCoaMonthSumByCoaAmt(BigDecimal initAmt, BigDecimal balanceAmt, String hardCode,Long ownerId);
}
