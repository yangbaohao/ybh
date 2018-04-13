package com.zqw.bss.service.sale;

import java.util.List;

import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.model.sale.UserSaler;
import com.zqw.bss.vo.billing.SalesAgentVo;
import com.zqw.bss.vo.sale.SalesAgentFollowVo;
import com.zqw.bss.vo.sys.OwnerDetailsVo;

public interface UserSalerService {

	List<UserSaler> getAllUsersaler(String type);

	Boolean saveUserSaler(List<UserSaler> users,String type);
	
}
