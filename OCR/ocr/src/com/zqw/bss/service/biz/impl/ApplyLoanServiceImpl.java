package com.zqw.bss.service.biz.impl;

import java.util.List;
import java.util.Set;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.basic.FileInfo;
import com.zqw.bss.model.biz.ApplyLoan;
import com.zqw.bss.model.crm.Remark;
import com.zqw.bss.service.biz.ApplyLoanService;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.SystemConstant.LoanState;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;

@Service
@Qualifier("applyLoanService")
public class ApplyLoanServiceImpl implements ApplyLoanService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<ApplyLoan> getApplyLoanByPage(BasePagerObject bso) {
		logger.info("begin getApplyLoanByPage");
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (!roles.contains("loanaudit")) {
			throw new OperationException("用户角色没有此权限");
		}
//		List<ApplyLoan> list = dao
//				.getLst4Paging(
//						"select new com.zqw.bss.model.biz.ApplyLoan(en.name,ap) from ApplyLoan ap,EnterpriseInfo en,Owner ow where ow.enterpriseInfo=en.id and ow.id=ap.ownerId and ap.isdelete= 0 and ap.loanState <> 'NoSubmitted' "
//								+ conStr + " order by ap.createBy desc",
//						new int[] { bso.getPagenum(), bso.getPagesize() });
//		Long count = dao.getCount4Paging(
//				"SELECT COUNT(ap.id) FROM ApplyLoan ap,EnterpriseInfo en,Owner ow where ow.enterpriseInfo=en.id and ow.id=ap.ownerId and ap.isdelete= 0 and ap.loanState <> 'NoSubmitted' "
//						+ conStr);
		String hql="FROM ApplyLoan ap WHERE ap.isdelete= 0 and ap.loanState <> 'NoSubmitted' "+ conStr + " order by ap.createDate desc";
		List<ApplyLoan> list = dao.getLst4Paging(hql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count= dao.getCount4Paging("SELECT COUNT(ap.id) FROM ApplyLoan ap WHERE ap.isdelete= 0 and ap.loanState <> 'NoSubmitted' "+ conStr );
		BaseModelList<ApplyLoan> lists = new BaseModelList<ApplyLoan>(count, list);
		logger.info("end getApplyLoanByPage");
		return lists;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean approval(ApplyLoan applyLoan) {
		logger.info("begin approval");
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (!roles.contains("loanaudit")) {
			throw new OperationException("用户角色没有此权限");
		}
		ApplyLoan ap = (ApplyLoan) dao.getObject(ApplyLoan.class, applyLoan.getId());
		if (!ap.getLoanState().equals(LoanState.Pending)) {
			throw new OperationException("此条信息无法审批");
		}
		if (applyLoan.getLoanState().equals(LoanState.Refuse)) {
			ap.setLoanState(LoanState.Refuse);
		} else if (applyLoan.getLoanState().equals(LoanState.Approved)) {
			ap.setLoanState(LoanState.Approved);
		}
		List<Remark> remark = applyLoan.getRemark();
		ap.getRemark().add(remark.get(0));
		dao.update(ap);
		logger.info("end approval");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteApplyLoan(Long id) {
		
		logger.info("begin deleteApplyLoan");
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		if (!roles.contains("loanaudit")) {
			throw new OperationException("用户角色没有此权限");
		}
		ApplyLoan ap = (ApplyLoan) dao.getObject(ApplyLoan.class, id);
		if (!ap.getLoanState().equals(LoanState.Approved)) {
			throw new OperationException("该状态下此条单据无法删除");
		}
		dao.executeSql("UPDATE t_biz_applyLoan ap SET ap.isdelete=1 where ap.id=" + id, null);
		logger.info("end deleteApplyLoan");
		return true;
		
	}

}
