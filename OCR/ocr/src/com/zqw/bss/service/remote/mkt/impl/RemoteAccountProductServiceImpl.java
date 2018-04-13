package com.zqw.bss.service.remote.mkt.impl;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.service.mkt.AccountProductService;
import com.zqw.bss.service.remote.mkt.RemoteAccountProductService;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.vo.mkt.GiveDetailVo;
import com.zqw.bss.vo.mkt.SearchAccountProductListVo;

public class RemoteAccountProductServiceImpl implements RemoteAccountProductService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Autowired
	protected AccountProductService accountProductService;
	
	@Override
	public Boolean savaAccountProduct(AccountProduct accountProduct) {
		logger.info("begin savaAccountProduct. id = ["+accountProduct.getId()+"]");
		return accountProductService.savaAccountProduct(accountProduct);
	}

	@Override
	public Boolean updateAccountProduct(AccountProduct accountProduct) {
		// TODO Auto-generated method stub
		logger.info("begin updateAccountProduct. id = ["+accountProduct.getId()+"]");
		return accountProductService.updateAccountProduct(accountProduct);
	}
	
	@Override
	public Boolean updateProductStatus(AccountProduct accountProduct) {
		// TODO Auto-generated method stub
		logger.info("begin updateProductStatus. id = ["+ accountProduct.getId()+"]");
		return accountProductService.updateProductStatus(accountProduct);
	}

	@Override
	public AccountProduct getAccountProductById(Long id) {
		// TODO Auto-generated method stub
		logger.info("begin getAccountProductById. id = ["+id+"]");
		return (AccountProduct) WebUtil.getEntryFromProxyObj(accountProductService.getAccountProductById(id), dao);
	}

	@Override
	public BaseModelList<SearchAccountProductListVo> getAllAccountProduct(String query) {
		logger.info("begin getAllAccountProduct.");
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		BaseModelList<SearchAccountProductListVo> purchaseDeliveryOrder =accountProductService.getAllAccountProductByPage(bso);
		logger.info("end getAllAccountProduct.");
		return purchaseDeliveryOrder;
	
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<SearchAccountProductListVo> getAllAccountProductName() {
		logger.info("begin getAllAccountProductName");
		return WebUtil.getEntryListFromProxyList(accountProductService.getAllAccountProductName(), dao);
	}

	@Override
	public BaseModelList<GiveDetailVo> getAllGiveDetail(Long id, String query) {
		logger.info("begin getAllGiveDetail.");
		BasePagerObject bso=HsqlUtil.toPager(HsqlUtil.DecodeRequest(query));
		BaseModelList<GiveDetailVo> giveDetail=accountProductService.getAllGiveDetail(id, bso);
		logger.info("end getAllGiveDetail.");
		return giveDetail;
	}

}
