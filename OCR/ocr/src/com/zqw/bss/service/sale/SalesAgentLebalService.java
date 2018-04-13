package com.zqw.bss.service.sale;

import java.util.List;

import com.zqw.bss.model.crm.OwnerLebal;
import com.zqw.bss.model.sale.SalesAgentLebal;

public interface SalesAgentLebalService {
	
	public Boolean createSalesAgentLebal(List<SalesAgentLebal> salesAgentLebal);
	
	

	Boolean updateSalesAgentLebal(SalesAgentLebal salesAgentLebal, Long ownerId);

	List<SalesAgentLebal> getAllSalesAgentLebal();


}
