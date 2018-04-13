package com.zqw.bss.service.remote.sale.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.ImportLog;
import com.zqw.bss.model.sale.MessageLog;
import com.zqw.bss.model.sale.PotentialCustomers;
import com.zqw.bss.model.sale.ShortMessage;
import com.zqw.bss.service.remote.sale.RemoteShortMessageService;
import com.zqw.bss.service.sale.ShortMessageService;
import com.zqw.bss.util.WebUtil;

public class RemoteShortMessageServiceImpl implements RemoteShortMessageService {

	@Autowired
	protected DAO dao;
	
	@Autowired
	private ShortMessageService shortMessageService;
	
	@Override
	public Boolean saveShortMessage(ShortMessage ShortMessage) {
		return shortMessageService.saveShortMessage(ShortMessage);
	}

	@Override
	public Boolean updateShortMessage(ShortMessage ShortMessage) {
		return shortMessageService.updateShortMessage(ShortMessage);
	}

	@Override
	public Boolean deleteShortMessage(Long id) {
		return shortMessageService.deleteShortMessage(id);
	}

	@Override
	public BaseModelList<ShortMessage> getPageShortMessage(String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return (BaseModelList<ShortMessage>) WebUtil.getEntryFromProxyObj(shortMessageService.getPageShortMessage(bso));
	}

	@Override
	public ShortMessage getShortMessageById(Long id) {
		return (ShortMessage) WebUtil.getEntryFromProxyObj(shortMessageService.getShortMessageById(id));
	}

	@Override
	public Boolean senderMessage(Long id, String num) {
		return shortMessageService.senderMessage(id, num);
	}

	@Override
	public BaseModelList<MessageLog> getShortMessageByIdGetPage(Long id, String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return (BaseModelList<MessageLog>) WebUtil.getEntryFromProxyObj(shortMessageService.getCustomersPageShortMessage(id,bso));
	}

	@Override
	public BaseModelList<ImportLog> getShortMessageByIdGetPageNoSend(Long id, String query) {
		String request = HsqlUtil.DecodeRequest(query);
		BasePagerObject bso = HsqlUtil.toPager(request);
		return (BaseModelList<ImportLog>) WebUtil.getEntryFromProxyObj(shortMessageService.getCustomersPageShortMessageNoSend(id,bso));
	}

	@Override
	public List<PotentialCustomers> getbatchNumById(Long id) {
		return (List<PotentialCustomers>)WebUtil.getEntryListFromProxyList(shortMessageService.getbatchNumById(id),dao);
	}

	
	
}
