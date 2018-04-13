package com.zqw.bss.service.sale.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.util.HsqlUtil;
import com.zqw.bss.framework.vo.BaseModelList;
import com.zqw.bss.framework.vo.BasePagerObject;
import com.zqw.bss.framework.vo.Condition;
import com.zqw.bss.model.crm.Address;
import com.zqw.bss.model.sale.Potential;
import com.zqw.bss.model.sys.User;
import com.zqw.bss.service.sale.PotentialService;
import com.zqw.bss.util.SystemConstant;
import com.zqw.bss.util.WebUtil;
import com.zqw.bss.util.security.shiro.SessionUtil;
@Service
@Qualifier("potentialService")
public class PotentialServiceImpl implements PotentialService {

	private final Logger logger = Logger.getLogger(this.getClass().getName());

	@Autowired
	protected DAO dao;

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean savePotential(Potential potential) {
		logger.info("begin savePotential.");
		List<User> listC=potential.getCustom();
		List<User> list=new ArrayList<User>();
		if(listC.size()!=0){
			for(User u:listC){
				User user=(User)dao.getObject(User.class, u.getId());
				list.add(user);
			}
			potential.setCustom(list);
		}else{
			potential.setCustom(null);
		}
		
		
		//Long idf=null;
		
		
		List<User> listS=potential.getSal();
		List<User> lis=new ArrayList<User>();
		if(listS.size()!=0){
			for(User u:listS){
				User user=(User)dao.getObject(User.class, u.getId());
				lis.add(user);
			}
			potential.setSal(lis);
		}else{
			potential.setSal(null);
		}
		//Long idf=null;
		//potential.setSal(lis);
		
		List<Address> address=new ArrayList<Address>();
		for(Address add : potential.getAddress()){
			address.add((Address)dao.save(add));
		}
		potential.setAddress(address);
		//Long uid=potential.getSales().getId();
		Long sid =null;
		if(potential.getSalesAgent()!=null)
			sid=potential.getSalesAgent().getId();
		//Long cid=potential.getCustomer().getId();
		//potential.setSales(null);
		potential.setSalesAgent(null);
		//potential.setCustomer(null);
		Potential poten=(Potential)dao.save(potential);
		if(sid!=null){
			Object[] param=new Object[2];
			param[0]=sid;
			param[1]=poten.getId();
			dao.executeHql("update Potential ar SET ar.salesAgent.id=? where ar.id=?", param);
		}
		/*if(uid!=null){
			Object[] par=new Object[2];
			par[0]=uid;
			par[1]=poten.getId();
			dao.executeHql("update Potential a SET a.sales.id=? where a.id=?", par);
		}*/
//		if(cid!=null){
//			Object[] param=new Object[2];
//			param[0]=cid;
//			param[1]=poten.getId();
//			dao.executeHql("update Potential ar SET ar.customer.id=? where ar.id=?", param);	
//		}
		logger.info("end savePotential[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean updatePotential(Potential potential) {
		logger.info("begin updatePotential.");
		List<User> listC=potential.getCustom();
		List<User> list=new ArrayList<User>();
		for(User u:listC){
			User user=(User)dao.getObject(User.class, u.getId());
			list.add(user);
		}
		//Long idf=null;
		potential.setCustom(list);
		
		List<User> listS=potential.getSal();
		List<User> lis=new ArrayList<User>();
		for(User u:listS){
			User user=(User)dao.getObject(User.class, u.getId());
			lis.add(user);
		}
		//Long idf=null;
		potential.setSal(lis);
		
		/*if(potential.getSales()!=null&&potential.getSales().getId()!=null){
			idf=potential.getSales().getId();
		}
		potential.setSales(null);*/
		dao.update(potential);
		/*for(int n=0;n<listC.size();n++){
			
		}*/
		/*Object[] param=new Object[2];
		param[0]=idf;
		param[1]=potential.getId();
		dao.executeHql("update from Potential set sales.id=? where id=?", param);*/
		logger.info("end updateSalesAgent[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Boolean deletePotential(Long id) {
		logger.info("begin deletePotential.");
		Object[] param=new Object[1];
		param[0]=id;
		dao.executeHql("delete from Potential ar where ar.id=?", param);
		logger.info("end deleteSalesAgent[ id =" + WebUtil.getLogBasicString() + "]");
		return true;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public BaseModelList<Potential> getPagePotential(BasePagerObject bso) {
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		List<User> users = dao.find(
				"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		User user=null;
		if(users.size()>0){
			user=users.get(0);
		}

		String conStr ="";
		List<Potential> urls=new ArrayList<>();
		Long count=0L;
		
		if(roles.contains("salesManage")){

			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			String sql ="";
			//获取二级销售主管编号
			List<String> empCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode = '"+user.getEmployeeCode()+"'", null);
			if(empCode.size()>0){
				String[] ar = (String[])empCode.toArray(new String[empCode.size()]);
				for(int i=0;i<ar.length;i++){
					String temp=ar[i];
					ar[i]="'"+temp+"'";
				}
				String se=Arrays.toString(ar);
				String newSt = se.replaceAll("\\[","(");
				String newSt2 = newSt.replaceAll("]",")");
				//获取二级销售主管下，销售的编号
				List<String> empCod = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode in "+newSt2+"", null);
				if(empCod.size()>0){
					String[] art = (String[])empCod.toArray(new String[empCod.size()]);
					for(int i=0;i<art.length;i++){
						String temp=art[i];
						art[i]="'"+temp+"'";
					}
					String see=Arrays.toString(art);
					String newStr = see.replaceAll("\\[","(");
					String newStr2 = newStr.replaceAll("]",")");
					sql = " select t from Potential t,User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newStr2+" or s.employeeCode in "+newSt2+" ) group by t.id  ORDER BY t.createDate DESC";
					urls = dao.getLst4Paging(sql,new int[] { bso.getPagenum(), bso.getPagesize() });
					String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newStr2+" or s.employeeCode in "+newSt2+" )";
					count = dao.getCount4Paging(sqlCon);
				}else{
					sql = "select t from Potential t,User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newSt2+" )  group by t.id ORDER BY t.createDate DESC";
					urls = dao.getLst4Paging(sql,new int[] { bso.getPagenum(), bso.getPagesize() });
					String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newSt2+" )";
					count = dao.getCount4Paging(sqlCon);
				}
				
			}else{
				sql = " select t from Potential t,User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
				urls = dao.getLst4Paging(sql,new int[] { bso.getPagenum(), bso.getPagesize() });
				String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' )";
				count = dao.getCount4Paging(sqlCon);
			}
		}if(roles.contains("secondLevelSalesManage")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			String sql = "select t from Potential t,User s where s.id in elements ( t.sal ) "+conStr+"  and ( s.parentEmployeeCode='"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
			urls = dao.getLst4Paging(sql,new int[] { bso.getPagenum(), bso.getPagesize() });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr+"   and ( s.parentEmployeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' )";
			
			count = dao.getCount4Paging(sqlCon);
		}else if(roles.contains("customerManage")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			String sql ="";
			//获取二级销售主管编号
			List<String> empCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode = '"+user.getEmployeeCode()+"'", null);
			if(empCode.size()>0){
				String[] ar = (String[])empCode.toArray(new String[empCode.size()]);
				for(int i=0;i<ar.length;i++){
					String temp=ar[i];
					ar[i]="'"+temp+"'";
				}
				String se=Arrays.toString(ar);
				String newSt = se.replaceAll("\\[","(");
				String newSt2 = newSt.replaceAll("]",")");
				//获取二级销售主管下，销售的编号
				List<String> empCod = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode in "+newSt2+"", null);
				if(empCod.size()>0){
					String[] art = (String[])empCod.toArray(new String[empCod.size()]);
					for(int i=0;i<art.length;i++){
						String temp=art[i];
						art[i]="'"+temp+"'";
					}
					String see=Arrays.toString(art);
					String newStr = see.replaceAll("\\[","(");
					String newStr2 = newStr.replaceAll("]",")");
					sql = " select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newStr2+" or s.employeeCode in "+newSt2+" ) group by t.id ORDER BY t.createDate DESC";
					urls = dao.getLst4Paging(sql,new int[] { bso.getPagenum(), bso.getPagesize() });
					String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+"  and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newStr2+" or s.employeeCode in "+newSt2+ ")";
					count = dao.getCount4Paging(sqlCon);
				}else{
					sql = "select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newSt2+" ) group by t.id ORDER BY t.createDate DESC";
					urls = dao.getLst4Paging(sql,new int[] { bso.getPagenum(), bso.getPagesize() });
					String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newSt2+" )";
					count = dao.getCount4Paging(sqlCon);
				}
				
			}else{
				sql = " select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
				urls = dao.getLst4Paging(sql,new int[] { bso.getPagenum(), bso.getPagesize() });
				String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' )";
				count = dao.getCount4Paging(sqlCon);
			}
			
		}else if(roles.contains("secondLevelCustomerManage")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			String sql = "select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+"   and( s.parentEmployeeCode='"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
			urls = dao.getLst4Paging(sql,new int[] { bso.getPagenum(), bso.getPagesize() });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+"   and( s.parentEmployeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' )";
			
			count = dao.getCount4Paging(sqlCon);
		} if(roles.contains("salesStaff")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			urls =dao.getLst4Paging("select t FROM Potential t,User s WHERE s.id in elements ( t.sal )  "+conStr+" group by t.id ORDER BY t.createDate DESC", new int[] { bso.getPagenum(), bso.getPagesize() });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr;
			count = dao.getCount4Paging(sqlCon);
		}else if(roles.contains("customerService")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			urls =dao.getLst4Paging("select t FROM Potential t,User s WHERE s.id in elements ( t.custom )  "+conStr+" group by t.id ORDER BY t.createDate DESC", new int[] { bso.getPagenum(), bso.getPagesize() });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr;
			count = dao.getCount4Paging(sqlCon);
			
			//count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, Potential.class)); 
		}else if(roles.contains("Sys_Admin")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			//2017年5月31日 10:19:27在s.id in elements ( t.sal ) or s.id in elements ( t.custom )外面了个括号
			urls =dao.getLst4Paging("select t FROM Potential t,User s  WHERE (s.id in elements ( t.sal ) or s.id in elements ( t.custom )) "+conStr+" group by t.id ORDER BY t.createDate DESC", new int[] { bso.getPagenum(), bso.getPagesize() });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where  (s.id in elements ( t.sal ) or s.id in elements ( t.custom )) "+conStr;
			count = dao.getCount4Paging(sqlCon);
		}else if(roles.contains("agentistrator")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			urls =dao.getLst4Paging("FROM Potential t WHERE 1=1 "+conStr+" ORDER BY t.createDate DESC", new int[] { bso.getPagenum(), bso.getPagesize() });
			String sqlCon = "select count(t.id) from  Potential t  where 1=1 "+conStr;
			count = dao.getCount4Paging(sqlCon);
		}
		
		BaseModelList<Potential> lists = new BaseModelList<Potential>(count, WebUtil.getEntryListFromProxyList(urls, dao));
		return lists;
	}

	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Potential getPotentialById(Long id) {
		logger.info("begin getPotentialById. id = [" + id + "]");
		Potential pro = (Potential) dao.getObject(Potential.class, id);
		if(pro.getCustom().size()>0){
			List<User> user = new ArrayList<User>();
			for(User u : pro.getCustom()){
				if(user.size()>0){
					for(User us : user){
						if(!us.getId().equals(u.getId()))
							user.add(u);
					}
				}else{
					user.add(u);
				}
			}
			pro.setCustom(user);
		}
		if(pro.getSal().size()>0){
			List<User> user = new ArrayList<User>();
			for(User u : pro.getSal()){
				if(user.size()>0){
					for(User us : user){
						if(!us.getId().equals(u.getId()))
							user.add(u);
					}
				}else{
					user.add(u);
				}
			}
			pro.setSal(user);
		}
		logger.info("end getPotentialById:[ id =" + WebUtil.getLogBasicString() + "]");
		return pro;
	}

	@Override
	@Transactional(readOnly = false, propagation = Propagation.REQUIRED)
	public Potential updatePotentialStatusById(Potential potential) {
		Object[] param=new Object[2];
		param[0]=potential.getStatus();
		param[1]=potential.getId();
		dao.executeHql("update Potential ar SET ar.status =? where ar.id=?", param);
		return null;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
	public Map<String, Long> followup(BasePagerObject bso) {
		Set<String> roles = (Set<String>) SessionUtil.get(SystemConstant.SESSION_KEY_USER_ROLES);
		List<User> users = dao.find(
				"from User where username = '" + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME) + "'");
		User user=null;
		if(users.size()>0){
			user=users.get(0);
		}

		String conStr ="";
		List<Potential> urls=new ArrayList<>();
		Long count=0L;
		
		if(roles.contains("salesManage")){

			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			String sql ="";
			//获取二级销售主管编号
			List<String> empCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode = '"+user.getEmployeeCode()+"'", null);
			if(empCode.size()>0){
				String[] ar = (String[])empCode.toArray(new String[empCode.size()]);
				for(int i=0;i<ar.length;i++){
					String temp=ar[i];
					ar[i]="'"+temp+"'";
				}
				String se=Arrays.toString(ar);
				String newSt = se.replaceAll("\\[","(");
				String newSt2 = newSt.replaceAll("]",")");
				//获取二级销售主管下，销售的编号
				List<String> empCod = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode in "+newSt2+"", null);
				if(empCod.size()>0){
					String[] art = (String[])empCod.toArray(new String[empCod.size()]);
					for(int i=0;i<art.length;i++){
						String temp=art[i];
						art[i]="'"+temp+"'";
					}
					String see=Arrays.toString(art);
					String newStr = see.replaceAll("\\[","(");
					String newStr2 = newStr.replaceAll("]",")");
					sql = " select t from Potential t,User s where s.id in elements ( t.sal ) "+conStr+" and t.status='notContact' and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newStr2+" or s.employeeCode in "+newSt2+" ) group by t.id  ORDER BY t.createDate DESC";
					urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
					String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newStr2+" or s.employeeCode in "+newSt2+" )";
					count = dao.getCount4Paging(sqlCon);
				}else{
					sql = "select t from Potential t,User s where s.id in elements ( t.sal ) "+conStr+" and t.status='notContact' and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newSt2+" )  group by t.id ORDER BY t.createDate DESC";
					urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
					String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newSt2+" )";
					count = dao.getCount4Paging(sqlCon);
				}
				
			}else{
				sql = " select t from Potential t,User s where s.id in elements ( t.sal ) "+conStr+" and t.status='notContact' and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
				urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
				String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' )";
				count = dao.getCount4Paging(sqlCon);
			}
		}if(roles.contains("secondLevelSalesManage")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			String sql = "select t from Potential t,User s where s.id in elements ( t.sal ) "+conStr+" and  t.status='notContact' and s.parentEmployeeCode != null and ( s.parentEmployeeCode='"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
			urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr+" and s.parentEmployeeCode != null and ( s.parentEmployeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' )";
			
			count = dao.getCount4Paging(sqlCon);
		}else if(roles.contains("customerManage")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			String sql ="";
			//获取二级销售主管编号
			List<String> empCode = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode = '"+user.getEmployeeCode()+"'", null);
			if(empCode.size()>0){
				String[] ar = (String[])empCode.toArray(new String[empCode.size()]);
				for(int i=0;i<ar.length;i++){
					String temp=ar[i];
					ar[i]="'"+temp+"'";
				}
				String se=Arrays.toString(ar);
				String newSt = se.replaceAll("\\[","(");
				String newSt2 = newSt.replaceAll("]",")");
				//获取二级销售主管下，销售的编号
				List<String> empCod = dao.executeQuerySql("select u.employeeCode from t_bss_sys_user u where u.parentEmployeeCode in "+newSt2+"", null);
				if(empCod.size()>0){
					String[] art = (String[])empCod.toArray(new String[empCod.size()]);
					for(int i=0;i<art.length;i++){
						String temp=art[i];
						art[i]="'"+temp+"'";
					}
					String see=Arrays.toString(art);
					String newStr = see.replaceAll("\\[","(");
					String newStr2 = newStr.replaceAll("]",")");
					sql = " select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+" and t.status='notContact' and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newStr2+" or s.employeeCode in "+newSt2+" ) group by t.id ORDER BY t.createDate DESC";
					urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
					String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+"  and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newStr2+" or s.employeeCode in "+newSt2+ ")";
					count = dao.getCount4Paging(sqlCon);
				}else{
					sql = "select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+" and t.status='notContact' and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newSt2+" ) group by t.id ORDER BY t.createDate DESC";
					urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
					String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode in "+newSt2+" )";
					count = dao.getCount4Paging(sqlCon);
				}
				
			}else{
				sql = " select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+" and t.status='notContact' and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
				urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
				String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+" and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' )";
				count = dao.getCount4Paging(sqlCon);
			}
			sql = " select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+" and t.status='notContact' and ( s.employeeCode = '"+user.getEmployeeCode()+"'  or s.parentEmployeeCode='"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
			urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+" and ( s.parentEmployeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' )";
			count = dao.getCount4Paging(sqlCon);
			
		}else if(roles.contains("secondLevelCustomerManage")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			String sql = "select t from Potential t,User s where s.id in elements ( t.custom ) "+conStr+" and t.status='notContact' and s.parentEmployeeCode != null and( s.parentEmployeeCode='"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' ) group by t.id ORDER BY t.createDate DESC";
			urls = dao.getLst4Paging(sql,new int[] { 0,99999999 });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr+" and s.parentEmployeeCode != null and( s.parentEmployeeCode = '"+user.getEmployeeCode()+"' or s.employeeCode = '"+user.getEmployeeCode()+"' )";
			
			count = dao.getCount4Paging(sqlCon);
		} if(roles.contains("salesStaff")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			urls =dao.getLst4Paging("select t FROM Potential t,User s WHERE s.id in elements ( t.sal )  "+conStr+" and t.status='notContact' group by t.id ORDER BY t.createDate DESC", new int[] { 0,99999999 });
			//String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr;
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.sal ) "+conStr;//duhuan 
			count = dao.getCount4Paging(sqlCon);
		}else if(roles.contains("customerService")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			urls =dao.getLst4Paging("select t FROM Potential t,User s WHERE s.id in elements ( t.custom )  "+conStr+" and t.status='notContact' group by t.id ORDER BY t.createDate DESC", new int[] { 0,99999999 });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where s.id in elements ( t.custom ) "+conStr;
			count = dao.getCount4Paging(sqlCon);
			
			//count = dao.getCount4Paging(HsqlUtil.genCountSql(bso, Potential.class));
		}else if(roles.contains("Sys_Admin")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			urls =dao.getLst4Paging("select t FROM Potential t,User s  WHERE (s.id in elements ( t.sal ) or s.id in elements ( t.custom )) and t.status='notContact' "+conStr+" group by t.id ORDER BY t.createDate DESC",new int[] { 0,99999999 });
			String sqlCon = "select count(DISTINCT t.id) from  Potential t , User s where (s.id in elements ( t.sal ) or s.id in elements ( t.custom )) "+conStr;
			count = dao.getCount4Paging(sqlCon);
		}else if(roles.contains("agentistrator")){
			conStr = HsqlUtil.getConditionHqlStr(bso, new StringBuilder());
			urls =dao.getLst4Paging("FROM Potential t WHERE 1=1 "+conStr+" and t.status='notContact' ORDER BY t.createDate DESC", new int[] { 0,99999999 });
			String sqlCon = "select count(t.id) from  Potential t  where 1=1 "+conStr;
			count = dao.getCount4Paging(sqlCon);
		}
		Long noFollowUp=0L;
		for (Potential potential : urls) {
			if (potential.getTrackList().size()==0) {
				noFollowUp++;
			}
		}
		Long isFollowUp=count-noFollowUp;
		Map<String,Long> map=new HashMap<>();
		map.put("noFollowUp", noFollowUp);
		map.put("isFollowUp", isFollowUp);
		return map;
	}
	
	
}
