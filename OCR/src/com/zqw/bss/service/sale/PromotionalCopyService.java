package com.zqw.bss.service.sale;

import java.util.List;

import com.zqw.bss.model.sale.PromotionalCopy;

public interface PromotionalCopyService {
	
	/**保存推广
	 * @param promotionalCopy
	 * @return
	 */
	public Boolean savePromotionalCopy(PromotionalCopy promotionalCopy);
	
	/**修改推广
	 * @param promotionalCopy
	 * @return
	 */
	public Boolean updatePromotionalCopy(PromotionalCopy promotionalCopy);
	
	/**查询所有推广
	 * @return
	 */
	public List<PromotionalCopy> getAllPromotionalCopy();
	
	/**删除
	 * @param id
	 * @return
	 */
	public Boolean delPromotionalCopy(Long id);
	
	/**查询单个
	 * @param id
	 * @return
	 */
	public PromotionalCopy  getPromotionalCopyById(Long id);
}
