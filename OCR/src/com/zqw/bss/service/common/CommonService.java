package com.zqw.bss.service.common;

import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.core.Response;

import org.apache.cxf.jaxrs.ext.multipart.Attachment;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.basic.BasicFileInfo;
import com.zqw.bss.model.basic.FileInfo;
import com.zqw.bss.model.crm.ClientInfo;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.vo.common.AccessVo;
import com.zqw.bss.vo.common.ClientInfoVo;
import com.zqw.bss.vo.common.OwnerAccessVo;
import com.zqw.bss.vo.common.OwnerListVo;
import com.zqw.bss.vo.common.OwnerNumVo;
import com.zqw.bss.vo.crm.ClientInfoForBssVo;
import com.zqw.bss.vo.sys.SearchUserByTaxListVo;
import com.zqw.bss.vo.sys.UerSessionListForVo;

/**
 * <p>
 * Common Service
 * </p>
 * 通用服务接口
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, 2016-5-31
 */
public interface CommonService {

	public String getUuId(String prefix, int len, Long... times);

	/**
	 * 获取系统编号
	 * 
	 * @param String
	 *            type 类型
	 * @param Long
	 *            len 编号长度
	 * 
	 * @return String
	 */
	public String getSystemCode(String type, int len, Long... times);

	public FileInfo getFileInfo(Long id);

	public List<FileInfo> getFileInfoList(String ids);

	/**
	 * 文件下载功能
	 * 
	 * @param Long
	 *            文件ID
	 * @param String
	 *            hardCode
	 * @return Response
	 */
	public Response downloadFile(Long id);

	/**
	 * 表单提交，文件上传
	 * 
	 * @return
	 */
	public FileInfo uploadFileByForm(Attachment attachment);

	/**
	 * 批量删除文件
	 * 
	 * @param Long
	 *            文件ID
	 * @param String
	 *            hardCode
	 * @return Response
	 */
	public Boolean removeFiles(String ids);
	
	public Map<String,String> getUserInformation();
	
	/**
	 * 生成代金卷 编码
	 * @param prefix
	 * @param len
	 * @param times
	 * @return
	 */

	public String getVoucherCode(String prefix, int len, Long... times);


	/**
	 * 
	 * @param userCondition
	 * @return 每日注册用户以及有效用户数量列列表
	 */
	public BaseModelList<OwnerNumVo> getOwnerNumVo(String role, BasePagerObject bso);
	
	public BaseModelList<OwnerAccessVo> getOwnerAccessVo(BigDecimal startRemarkNum, BigDecimal endRemarkNum, BigDecimal startSecond, BigDecimal endSecond, String date, String role, BasePagerObject bso);
	
	public BaseModelList<OwnerAccessVo> getTestOwnerAccessVo(String date, BasePagerObject bso);
	
	public BaseModelList<AccessVo> getRemarkAccess(BasePagerObject bso);
	
	public List<OwnerListVo> getOwnerBySalesId();
	
	public BaseModelList<OwnerListVo> getOwnerByDate(String date, String role, BasePagerObject bso);
	public BaseModelList<OwnerListVo> getEffectiveOwnerByDate(String date, String role, BasePagerObject bso) ;
	
	/**
	 * 通过xls导入潜在用户的信息
	 * @param remark 
	 * @param batchNum 
	 * @throws IOException 
	 */
	public StringBuffer importXlsPotentialCustomersInfo(Long importLogId, Attachment file)  throws IOException;

	/**
	 * 通过xls导入报税用户的信息
	 * @param remark 
	 * @param batchNum 
	 * @throws IOException 
	 */
	public StringBuffer importXlsTaxOwnerInfo(Long importLogId, Attachment file)  throws IOException;
	
	/**
	 * 通过xls导入免费兑换券信息
	 * @param products
	 * @param freeTime
	 * @param file
	 * @return
	 * @throws IOException 
	 */
	public StringBuffer importCouponInfo(String products, Long freeTime, Attachment file) throws IOException;
	
	public List<UerSessionListForVo> getCustomer();
	
	public List<SearchUserByTaxListVo> getAllCustomerAndSales(String sales);
	
	
	/**
	 * 通过xls导入凭证的信息
	 * 
	 * @throws IOException
	 * @throws ParseException 
	 */
	public Boolean importXlsJournal(Attachment file,Long ownerId,String createBy) throws IOException, ParseException;
	
	public Response getFile(Long id);
	
	
	/**
	 * 删除文件
	 * 
	 * @param Long
	 *            文件ID
	 * @param String
	 *            hardCode
	 * @return Response
	 */
	public Boolean removeFile(Long id);
	
	/**
	 * 表单提交，文件上传
	 * 
	 * @return
	 */
	public BasicFileInfo uploadFileByForm(Attachment attachment,Long ownerId);

	public Boolean importXlsCOA(Attachment file,Long ownerId) throws IOException;
	
	public BaseModelList<ClientInfoForBssVo> getallClientInfoForBss(BasePagerObject ClientInfoCondition,Long owenrId);
	
	public Boolean importXlsEnterpriseInfo(Attachment file,Long ownerId) throws IOException;

	public Boolean createClientInfoAndUserInfo(ClientInfo clientInfo);
	
	public Boolean updateClientInfoAndUserInfo(ClientInfo clientInfo);
	
	public Boolean deleteClientInfoAndUserInfo(Long id,Long ownerId);
	
	void exportFile(HttpServletRequest request, HttpServletResponse response, String fileName, String query) throws IOException ;

	public List<BasicFileInfo> getBasicFileInfo(String ids);
	
	public List<ClientInfoVo> getAllClientInfoVO(String flag,Long ownerId); 
	
	/**
	 * 通过xls导入报税用户的信息
	 * @param remark 
	 * @param batchNum 
	 * @throws IOException 
	 */
	public StringBuffer importXlsPotential(Long importLogId, Attachment file)  throws IOException;

	public void exportUser(HttpServletRequest request, HttpServletResponse response, String query);

	public List<User> importUser(Attachment file) throws IOException;

	public List<FileInfo> getFileInfo(String ids);
	
	public Boolean getPermissionVip(Long ownerId);
}
