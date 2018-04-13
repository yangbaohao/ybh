package com.zqw.bss.service.sale;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.ImportLog;

public interface ImportLogService {

	/**
	 * 添加记录
	 * @param importLog	
	 * @return
	 */
	public ImportLog saveImportLog(ImportLog importLog);
	
	/**
	 * 修改主题备注
	 * @param importLog	
	 * @return
	 */
	public Boolean updateImportLog(ImportLog importLog);
	
	/**
	 * 删除记录
	 * @param id 主键id
	 * @return
	 */
	public Boolean deleteImportLog(Long id);

	/**
	 * 分页记录
	 * @param bso
	 * @return
	 */
	public BaseModelList<ImportLog> getPageImportLog(BasePagerObject bso);
	
	/**
	 * id获取记录
	 * @param id
	 * @return
	 */
	public ImportLog getImportLogById(Long id);

	/**
	 * 根据批次id查询列表
	 * @param batchNum
	 * @return
	 */
	public List<ImportLog> getImportLogBybatchNum(String batchNum);
	
	/**
	 * 根据批次修改导入日志状态
	 * @param id
	 * @return
	 */
	public ImportLog updateStatusBybatchNum(ImportLog importLog);
	
	/**
	 * 修改数量
	 * @param importLog	
	 * @return
	 */
	public Boolean updateImportLogNum(ImportLog importLog);
	
	/**
	 * 修改数量
	 * @param batchNum批次，num改变差值
	 * @return
	 */
	public Boolean updateImportLogNum(String batchNum, int num);
}
