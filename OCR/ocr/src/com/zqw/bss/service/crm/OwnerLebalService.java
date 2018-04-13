package com.zqw.bss.service.crm;

import java.util.List;

import com.zqw.bss.model.crm.OwnerLebal;

public interface OwnerLebalService {
	
	public Boolean createOwnerLebal(List<OwnerLebal> ownerLebal);
	
	public List<OwnerLebal> getAllOwnerLebalList();
	
	public Boolean updateOwnerLebal(OwnerLebal ownerLebal,Long ownerId);
}
