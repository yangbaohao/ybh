package com.zqw.bss.service.biz;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.basic.FileInfo;
import com.zqw.bss.model.biz.ApplyLoan;
import com.zqw.bss.model.mkt.Voucher;
/**
 * 
 * @author Administrator
 *
 */
public interface ApplyLoanService {
	
	/**
	 * 分页查询
	 */
	public BaseModelList<ApplyLoan>getApplyLoanByPage(BasePagerObject bso);

	public Boolean approval(ApplyLoan applyLoan);
 
	
	public Boolean deleteApplyLoan(Long id);

}
