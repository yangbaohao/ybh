package com.zqw.bss.service.mkt;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.vo.mkt.GiveDetailVo;
import com.zqw.bss.vo.mkt.SearchAccountProductListVo;

public interface AccountProductService {
 
		/**
		 *   创建产品
		 * @param AccountProduct
		 * @return
		 */
		public Boolean savaAccountProduct(AccountProduct accountProduct);

		/**
		 * 修改产品
		 * @param AccountProduct
		 * @return
		 */
		public Boolean updateAccountProduct(AccountProduct accountProduct);
		
		/**
		 * 修改产品状态
		 * @param accountProduct
		 * @return
		 */
		public Boolean updateProductStatus(AccountProduct accountProduct);
		
		/**删除产品
		 * @param id
		 * @return
		 */
		public AccountProduct getAccountProductById(Long id);
	
	/**
	 * 分页查询产品信息
	 * @param bso
	 * @return BaseModelList<AccountProduct>
	 */
	public BaseModelList<SearchAccountProductListVo> getAllAccountProductByPage(BasePagerObject bso);
	
	public List<SearchAccountProductListVo> getAllAccountProductName();
	
	public BaseModelList<GiveDetailVo> getAllGiveDetail(Long id,BasePagerObject bso);
}
