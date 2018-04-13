package com.zqw.bss.service.billing.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.billing.BillingProductPermission;
import com.zqw.bss.model.billing.BillingRecord;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.service.billing.AccountOrderService;
import com.zqw.bss.service.billing.BillingProductPermissionService;
import com.zqw.bss.service.common.CommonService;
import com.zqw.bss.service.crm.OwnerService;
import com.zqw.bss.service.mkt.AccountProductService;
import com.zqw.bss.service.sale.AgentRevenueService;
import com.zqw.bss.util.SystemConstant.Channel;
import com.zqw.bss.util.SystemConstant.PayStatus;
import com.zqw.bss.util.SystemConstant.PayWay;
import com.zqw.bss.util.SystemConstant.StandardMoney;
import com.zqw.bss.util.WebUtil;


@Service
@SuppressWarnings({"unchecked" , "unused"})
public class BillingProductPermissionServiceImpl implements BillingProductPermissionService {

	Logger log = Logger.getLogger(getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Autowired
	private AccountProductService accountProductService;
	
	@Autowired
	private AccountOrderService accountOrderService;
	
	@Autowired
	private CommonService commonService;
	
	@Autowired
	private OwnerService ownerService;
	
	@Autowired
	private AgentRevenueService agentRevenueService;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveBillingProductPermission(String channel,String ids,String amt,BillingProductPermission billingProductPermission) {
		log.debug("begin saveBillingProductPermission.");
		if(ids!=null&&ids!=""){
			String[] st=ids.split(",");
			String[] se=null;
			if(channel.equals("OFFLINE")){
				se=amt.split(",");
			}
			
			AccountProduct accountProduct=accountProductService.getAccountProductById(billingProductPermission.getAccountProduct().getId());
			for(int s=0;s<st.length;s++){
				if(st[s]!=null&&st[s]!=""){
					//后台赠送开通服务
					Long idl=Long.parseLong(st[s]);
					BillingProductPermission bpp=new BillingProductPermission();
					bpp.setOwnerId(idl);
					bpp.setPermission(billingProductPermission.getPermission());
					bpp.setAccountProduct(accountProduct);
					bpp.setEndDate(billingProductPermission.getEndDate());
					bpp.setStartDate(billingProductPermission.getStartDate());
					
					
					//获取用户
					Owner owner=ownerService.getOwner(idl);
					//产生虚拟订单记录
					AccountOrder accountOrder=new AccountOrder();
					List<AccountProduct> li=new ArrayList<AccountProduct>();
					li.add(accountProduct);
					accountOrder.setAccountProducts(li);
					accountOrder.setOrderBeginDate(billingProductPermission.getStartDate());
					accountOrder.setOrderEndDate(billingProductPermission.getEndDate());
					accountOrder.setOrderCreateDate(new Date());
					
					accountOrder.setOwnerId(idl);
					accountOrder.setChannel(channel);
					if(channel.equals("GIVE")){
						accountOrder.setPayStatus(PayStatus.give);
						accountOrder.setOrderCode(commonService.getVoucherCode("MZGIVE", 8));
						accountOrder.setTotalAmt(accountProduct.getPriceAmt());
						AccountOrder ac=accountOrderService.saveAccountOrder(accountOrder);
						bpp.setAccountOrder(ac);
						BillingProductPermission bpps=(BillingProductPermission)dao.save(bpp);
					}else if(channel.equals("OFFLINE")){
						accountOrder.setPayStatus(PayStatus.offline);
						accountOrder.setOrderCode(commonService.getVoucherCode("XXZFGM", 8));
						accountOrder.setTotalAmt(new BigDecimal(se[s]).setScale(2, BigDecimal.ROUND_HALF_UP));
						AccountOrder ac=accountOrderService.saveAccountOrder(accountOrder);
						bpp.setAccountOrder(ac);
						BillingProductPermission bpps=(BillingProductPermission)dao.save(bpp);	
						
						AccountOrderPay op=new AccountOrderPay();
						op.setAccountAmt(new BigDecimal(se[s]).setScale(2, BigDecimal.ROUND_HALF_UP));
						op.setAmt(new BigDecimal(se[s]).setScale(2, BigDecimal.ROUND_HALF_UP));
						List<BillingProductPermission> bpplist=new ArrayList<BillingProductPermission>();
						bpplist.add(bpps);
						op.setBillingProductPermissions(bpplist);
						op.setCurrency(StandardMoney.RMB);
						op.setAccountOrder(ac);
						op.setOwnerId(idl);
						op.setPayDate(new Date());
						op.setPayWay(PayWay.alipay);
						op.setTotalAmt(new BigDecimal(se[s]).setScale(2, BigDecimal.ROUND_HALF_UP));
						op=(AccountOrderPay)dao.save(op);
						//插入支付记录
						BillingRecord br=new BillingRecord();
						br.setAccountCode(owner.getLoginId());
						br.setAmount(new BigDecimal(se[s]).setScale(2, BigDecimal.ROUND_HALF_UP));
						br.setFlowNo(accountOrder.getOrderCode());
						br.setRequestId(accountOrder.getOrderCode());
						br.setStatus(PayStatus.offline);
						br.setOwnerId(idl);
						br.setChannel(Channel.OTHER);
						br.setAccountOrderPay(op);
						br=(BillingRecord)dao.save(br);
						//自动结算佣金
						agentRevenueService.computeAgentRevenue(owner, br.getAmount(), op);
					}
					
				}
			}
		}
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean delBillingProductPermissionById(Long billingProductPermissionId) {
		// TODO Auto-generated method stub
		Boolean flag = false;
		try {
			dao.removeObject(BillingProductPermission.class, billingProductPermissionId);
			flag = true;
		} catch (Exception e) {
			// TODO: handle exception
			log.debug("del fail Info = " + e.getMessage());
		}
		return flag;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateBillingProductPermission(BillingProductPermission billingProductPermission) {
		// TODO Auto-generated method stub
		log.debug("begin updateBillingProductPermission.");
		BillingProductPermission bpp = (BillingProductPermission) dao.update(billingProductPermission);
		log.debug("end  updateBillingProductPermission.Quotation : [ id =" + bpp.getId() + WebUtil.getLogBasicString() + "]");
		if(null != bpp && !"".equals(bpp) )
			return Boolean.TRUE;
		else
			return Boolean.FALSE;
	}
	
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BillingProductPermission getBillingProductPermissionById(Long BillingProductPermissionId) {
		// TODO Auto-generated method stub
		BillingProductPermission billingProductPermission = (BillingProductPermission)dao.getObject(BillingProductPermission.class, BillingProductPermissionId);
		return billingProductPermission;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<BillingProductPermission> findBillingProductPermission(BasePagerObject condition) {
		// TODO Auto-generated method stub
		log.debug("begin findBillingProductPermission.");
		List<BillingProductPermission> list = dao.getLst4Paging(HsqlUtil.genSearchSql(
				condition, BillingProductPermission.class, null), new int[] {
				condition.getPagenum(),
				condition.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(
				condition, BillingProductPermission.class));
		BaseModelList<BillingProductPermission> lists =new BaseModelList<BillingProductPermission>(count, WebUtil.getEntryListFromProxyList(list, dao));
		log.debug("end findBillingProductPermission:[ id ="+ WebUtil.getLogBasicString() + "]");
		return null;
	}

}
