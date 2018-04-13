package com.zqw.bss.service.mkt.voucher;

import java.math.BigDecimal;
import java.util.Map;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.vo.mkt.VoucherNameVo;
import com.zqw.bss.vo.mkt.VoucherVo;

public interface VoucherService {

	/**
	 * 创建优惠卷
	 */
	public Boolean saveVoucher(Voucher voucher);
	
	/**
	 * 修改产品
	 */
	public Boolean updateVoucher(Voucher voucher);
	
	/**
	 * 删除产品
	 */
	public Boolean deleteVoucher(Long id);
	
	/**
	 * 根据id查一个
	 */
	public Voucher getVoucherById(Long id);
	
	/**
	 * 分页查询
	 */
	public BaseModelList<Voucher>getAllVoucherByPage(BasePagerObject bso);
	
	/**
	 * 分页查询 所有available 未使用或已经使用
	 */
	public BaseModelList<Voucher> getAllVoucherByAvailablePage(BasePagerObject basePagerObject,int use);
	
	/**
	 * 测试方法
	 */
	public void test1();
	
	/**
	 * 根据
	 * String类型参数
	 * 分页查询
	 * @param basePagerObject
	 * @return
	 */
	public BaseModelList<Voucher> getAllVoucherPageString(BasePagerObject basePagerObject);
	/**
	 * 根据数字类型参数分页查询
	 * @param basePagerObject
	 * @return
	 */
	public BaseModelList<Voucher> getAllVoucherPageNumber(BasePagerObject basePagerObject);
	
	/**
	 * 发放几张优惠卷
	 */
	public Boolean putVoucher(String dispatchType,String name, String startDate, String endDate, BigDecimal amount,String[] userId,String voucherType,Long num);
	
	/**
	 * 条件查询 可用于发送代金卷的客户
	 */
	public Map<String, Object> getUserPage(BigDecimal amountmin, BigDecimal amountmax, String state,
			BigDecimal statemin, BigDecimal statemax, String datemin, String datemax, String user,String activitNumber);

	/**
	 * 查询所有代金卷 
	 */
	public BaseModelList<VoucherVo> getVoucherSupervise(BasePagerObject bso);
	/**
	 * 代金券管理详细信息
	 * @param bso
	 * @return
	 */
	
	public BaseModelList<VoucherNameVo> getVouchreName(BasePagerObject bso);
	
	/**
	 * 验证代金卷名称是否重复
	 * @param bso
	 * @return
	 */
	public Boolean voucherCheck(String name);

	
}
