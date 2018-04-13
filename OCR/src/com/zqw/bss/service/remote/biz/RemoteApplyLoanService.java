package com.zqw.bss.service.remote.biz;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;

import com.zqw.bss.framework.util.MediaTypes;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.model.biz.ApplyLoan;
import com.zqw.bss.model.crm.AccountPeriod;
import com.zqw.bss.model.crm.TaxDeclare;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.vo.common.AccessVo;
import com.zqw.bss.vo.common.OwnerAccessVo;
import com.zqw.bss.vo.common.OwnerListVo;
import com.zqw.bss.vo.common.OwnerNumVo;
import com.zqw.bss.vo.common.TaxDeclareListVo;
import com.zqw.bss.vo.common.TaxReportListVo;
import com.zqw.bss.vo.sys.SearchUserByTaxListVo;

@Path("/applyloan")
public interface RemoteApplyLoanService {

	/**
	 * 贷款分页
	 * 
	 * @return Map
	 */
	@GET
	@Path("/page/{query}")
	@Consumes(MediaTypes.JSON_UTF_8)
	@Produces(MediaTypes.JSON_UTF_8)
	public BaseModelList<ApplyLoan> getApplyLoanByPage(@PathParam("query") String query);
	
	/**
	 * 审批
	 * @param applyLoan
	 * @return
	 */
	@PUT
	@Path("/")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean approval(ApplyLoan applyLoan);
	
	@GET
	//@PUT
	@Path("/delete/{id}")
	@Produces(MediaTypes.JSON_UTF_8)
	public Boolean deleteApplyLoan(@PathParam("id") Long id);
}
