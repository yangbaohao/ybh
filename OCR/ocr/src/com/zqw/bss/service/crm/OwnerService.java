package com.zqw.bss.service.crm;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PayRemark;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.vo.crm.OwnerInfoVo;
import com.zqw.bss.vo.crm.UserInfoForListVO;
import com.zqw.bss.vo.sys.OcrSearchUserBuyListVo;
import com.zqw.bss.vo.sys.OwnerDetailsVo;
import com.zqw.bss.vo.sys.OwnerInformationVo;
import com.zqw.bss.vo.sys.SearchOwnerListvo;
import com.zqw.bss.vo.sys.SearchUserBuyListVo;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2016 www.accountyun.com
 * </p>
 * <p>
 * Company:zqw
 * </p>
 * 
 * @author lzy
 * @date 2016年4月15日 上午9:14:53
 * @version 1.0
 */

public interface OwnerService {

	public Owner getOwner(Long ownerId);

	/**
	 * 获取注册展示信息
	 */
	public BaseModelList<OwnerInfoVo> getOwnerInfoVoAll(BasePagerObject condition);

	public Boolean updateOwnerRemarkBySales(Owner owner);

	/**
	 * admin用户列表
	 * 
	 * @param startAmt
	 * @param endAmt
	 * @param userCondition
	 * @return
	 */
	public BaseModelList<SearchUserBuyListVo> getSearchUserBuyVobusrListVo(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition);

	/**
	 * admin用户列表
	 * 
	 * @param startAmt
	 * @param endAmt
	 * @param userCondition
	 * @return
	 */
	public BaseModelList<OcrSearchUserBuyListVo> getOcrSearchUserBuyVobusrListVo(BigDecimal startAmt, BigDecimal endAmt,
			BasePagerObject userCondition);

	
	/**
	 * 获取用户详情
	 * 
	 * @param id
	 * @return
	 */
	public OwnerInformationVo getDetailOwner(Long id);

	/**
	 * added by wx importCreateTime 2016年10月28日 checkName:是否检查姓名
	 * checkStartMonth:是否检查账期
	 */
	public boolean createImportRegInfoAll(Map map, Boolean checkName, Boolean checkStartMonth, List<User> user, AccountProduct ap);

	/**
	 * 保税管理员修改用户信息
	 * 
	 * @param owner
	 * @return
	 */
	public Boolean updateLoginById(Map<String, String> flagMap);

	/**
	 * 修改保税人信息
	 * 
	 * @param owner
	 * @return
	 */
	public Boolean updateTaxCodeByName(Map<String, String> flagMap);

	public List<Remark> getRemark(String id);

	/**
	 * 成功客户，付费用户详情
	 * 
	 * @param sales_id2
	 */
	public BaseModelList<OwnerDetailsVo> getOwnerDetails(String num, String type, String sales_id, BasePagerObject bso);

	public BaseModelList<Owner> getOwnerList(String num, BasePagerObject bso);

	public Boolean writeownerlist(String ids, Long id, String employeeCode,String num);

	public Map<String, String> getIsOrNoRemarkOwner(BigDecimal startAmt, BigDecimal endAmt, BasePagerObject bso);

	public PayRemark createPayRemark(PayRemark payRemark);
	
	public Boolean updatePayRemark(PayRemark payRemark);
	
	public Boolean deletePayRemark(Long id);
	
	public Boolean sendEmail(String qq,Long ownerId, String startDate,String endDate,BigDecimal amt) throws Exception;

	public BaseModelList<PayRemark> getAllPayRemark(Long ownerId,String type,BasePagerObject bso);

	public UserInfoForListVO getOwnerInfomation(Long ownerId);

	public List<SearchOwnerListvo> getUserInfomation();
	
}
