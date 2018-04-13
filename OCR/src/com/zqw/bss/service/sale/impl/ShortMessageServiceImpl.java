package com.zqw.bss.service.sale.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.model.sale.MessageLog;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;
import com.zqw.bss.service.sale.ImportLogService;
import com.zqw.bss.service.sale.ShortMessageService;
import com.zqw.bss.util.HttpSender;
import com.zqw.bss.util.WebUtil;
@Service
public class ShortMessageServiceImpl implements ShortMessageService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());
	
	@Autowired
	protected DAO dao;
	
	@Autowired
	private ImportLogService importLogService;
	
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean saveShortMessage(ShortMessage ShortMessage) {
		logger.info("begin saveSalesAgent.");
		// 获取销售代理id
		if (ShortMessage.getSales() == null || ShortMessage.getSales().getId() == null) {
			ShortMessage.setSales(null);
		}
		dao.save(ShortMessage);
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updateShortMessage(ShortMessage ShortMessage) {
		logger.info("begin saveSalesAgent.");
		// 获取销售代理id
		if (ShortMessage.getSales() == null || ShortMessage.getSales().getId() == null) {
			ShortMessage.setSales(null);
		}
		dao.update(ShortMessage);
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deleteShortMessage(Long id) {
		logger.info("begin deleteShortMessage.");
		Object[] param=new Object[1];
		param[0]=id;
		dao.executeHql("delete from ShortMessage ar where ar.id=?", param);
		logger.info("end deleteShortMessage[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<ShortMessage> getPageShortMessage(BasePagerObject bso) {
		List<ShortMessage> urls = dao.getLst4Paging(HsqlUtil.genSearchSql(bso, ShortMessage.class, null),
				new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, ShortMessage.class));
		BaseModelList<ShortMessage> lists = new BaseModelList<ShortMessage>(count, WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public ShortMessage getShortMessageById(Long id) {
		logger.info("begin getShortMessageById. id = [" + id + "]");
		ShortMessage pro = (ShortMessage) dao.getObject(ShortMessage.class, id);
		logger.info("end getShortMessageById:[ id =" + WebUtil.getLogBasicString() + "]");
		return pro;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean senderMessage(Long id, String num) {
		//获取本短信内容
		ShortMessage pro = (ShortMessage) dao.getObject(ShortMessage.class, id);
		//获取该批次的客户电话记录
		List<String> list=(List<String>)dao.find("select phone from PotentialCustomers where batchNum='"+num+"'");
		List<ImportLog> li=(List<ImportLog>)dao.find("from ImportLog where batchNum='"+num+"'");
		//将list对象转成String
		if(list.size()>0){
			String phoneNum=StringUtils.strip(list.toString(),"[]");
			String number=phoneNum.replace(" ", "");
			//发送批次存入数据库
			List<MessageLog> lis=pro.getMessageLogs();
			MessageLog ml=new MessageLog();
			ml.setBatchNum(num);
			ml.setNum(list.size());
			ml.setImportDate(li.get(0).getCreateDate());
			ml.setRemark(li.get(0).getRemark());
			ml.setStatus("sendSuccess");
			lis.add(ml);
			pro.setMessageLogs(lis);
			pro.setMessageNumber(pro.getMessageNumber()+list.size());
			dao.update(pro);
			li.get(0).setStatus("sendSuccess");
			importLogService.updateStatusBybatchNum(li.get(0));

			//2016年10月8日 17:00:54 wx
			//如果测试手机号不为空则添加测试手机号
			if(StringUtils.isNotBlank(li.get(0).getTestPhone())){
				number += "," + li.get(0).getTestPhone();
			}
			
			HttpSender.getMsges(number, pro.getMessageContent());

			return true;
		}
		return false;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<MessageLog> getCustomersPageShortMessage(Long id, BasePagerObject bso) {
		//得到已发送的批次号
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		//List<MessageLog> list=(List<MessageLog>)dao.find("select messageLogs from ShortMessage where id="+id+conStr);
		List<MessageLog> list=(List<MessageLog>)dao.getLst4Paging("select s.messageLogs from ShortMessage s where s.id="+id+conStr, new int[] { bso.getPagenum(), bso.getPagesize() });
		
		
		List<MessageLog> li = (List<MessageLog>)dao.find("select s.messageLogs from ShortMessage s where s.id="+id+conStr);
		Long count=(long) li.size();
		BaseModelList<MessageLog> lists = new BaseModelList<MessageLog>(count,
				WebUtil.getEntryListFromProxyList(list, dao));
		return lists;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<ImportLog> getCustomersPageShortMessageNoSend(Long id, BasePagerObject bso) {
		String conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
		List<MessageLog> list=(List<MessageLog>)dao.find("select s.messageLogs from ShortMessage s where s.id="+id);
		String hql="";
		String conthql="";
		if(list.size()>0){
			List<String> lit=new ArrayList<>();
			for(MessageLog m:list){
				lit.add("'"+m.getBatchNum()+"'");
			}
			String phoneNum=StringUtils.strip(lit.toString(),"[]");
			String number=phoneNum.replace(" ", "");
			hql="from ImportLog p where p.batchNum not in ("+number+")" + conStr;
			conthql="select count(p.id) from ImportLog p where p.batchNum not in ("+number+")" + conStr;
		}else{
			hql="from ImportLog p where 1=1 " + conStr;
			conthql="select count(p.id) from ImportLog p where 1=1 " + conStr;
		}
		List<ImportLog> li=(List<ImportLog>)dao.getLst4Paging(hql, new int[] { bso.getPagenum(), bso.getPagesize() });
		Long count=dao.getCount4Paging(conthql);
		BaseModelList<ImportLog> lists = new BaseModelList<ImportLog>(count,
				WebUtil.getEntryListFromProxyList(li, dao));
		return lists;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public List<PotentialCustomers> getbatchNumById(Long id) {
		List<MessageLog> list=(List<MessageLog>)dao.find("select s.messageLogs from ShortMessage s where s.id="+id);
		List<PotentialCustomers> lis=null;
		if(list.size()>0){
			List<String> lit=new ArrayList<>();
			for(MessageLog m:list){
				lit.add("'"+m.getBatchNum()+"'");
			}
			String phoneNum=StringUtils.strip(lit.toString(),"[]");
			String number=phoneNum.replace(" ", "");
			String hql="from PotentialCustomers p where p.batchNum not in ("+number+")"+ " GROUP BY p.batchNum";
			lis=(List<PotentialCustomers>)dao.find(hql);
			return lis;
		}
		lis=(List<PotentialCustomers>)dao.find("from PotentialCustomers p GROUP BY p.batchNum");
		return lis;
	}

	
}
