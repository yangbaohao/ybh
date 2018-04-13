package com.zqw.bss.test.resource.db;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

import com.zqw.bss.model.billing.Account;
import com.zqw.bss.model.billing.AccountOrder;
import com.zqw.bss.model.billing.AccountOrderPay;
import com.zqw.bss.model.billing.AccountReceipt;
import com.zqw.bss.model.billing.AgentRequestPay;
import com.zqw.bss.model.billing.BillingProductPermission;
import com.zqw.bss.model.billing.BillingRecord;
import com.zqw.bss.model.crm.Owner;
import com.zqw.bss.model.crm.PersonInfo;
import com.zqw.bss.model.mkt.AccountProduct;
import com.zqw.bss.model.mkt.Voucher;
import com.zqw.bss.model.sale.AgentRevenue;
import com.zqw.bss.model.sale.Potential;
import com.zqw.bss.model.sale.PotentialTrack;
import com.zqw.bss.model.sale.SalesAgent;
import com.zqw.bss.util.SystemConstant.DispatchType;
import com.zqw.bss.util.SystemConstant.PayStatus;
import com.zqw.bss.util.SystemConstant.PayWay;
import com.zqw.bss.util.SystemConstant.StandardMoney;


/**
 * <p>
 * hibernate orm测试
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2015-2020 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision$, $Date$
 */
@SuppressWarnings({ "deprecation"})
public class HibernateModelTest {

	private static Configuration cfg = null;

	private static SessionFactory sessionFactory = null;

	Session session = null;

	Transaction tx = null;

	@BeforeClass
	public static void setUpBeforeClass() throws Exception {
		try {

			cfg = new Configuration().addAnnotatedClass(com.zqw.bss.model.billing.Account.class)
					.addAnnotatedClass(com.zqw.bss.model.billing.AgentRequestPay.class)
					.addAnnotatedClass(com.zqw.bss.model.billing.BillingProductPermission.class)
					.addAnnotatedClass(com.zqw.bss.model.billing.BillingRecord.class)
					.addAnnotatedClass(com.zqw.bss.model.billing.AccountOrder.class)
					.addAnnotatedClass(com.zqw.bss.model.billing.AccountOrderPay.class)
					.addAnnotatedClass(com.zqw.bss.model.billing.AccountReceipt.class)
					
					.addAnnotatedClass(com.zqw.bss.model.crm.Address.class)
					.addAnnotatedClass(com.zqw.bss.model.crm.EnterpriseInfo.class)
					.addAnnotatedClass(com.zqw.bss.model.crm.Owner.class)
					.addAnnotatedClass(com.zqw.bss.model.crm.PersonInfo.class)
					.addAnnotatedClass(com.zqw.bss.model.crm.UserInfo.class)
					
					.addAnnotatedClass(com.zqw.bss.model.mkt.AccountProduct.class)
					.addAnnotatedClass(com.zqw.bss.model.mkt.Voucher.class)
					
					.addAnnotatedClass(com.zqw.bss.model.sale.AgentRevenue.class)
					.addAnnotatedClass(com.zqw.bss.model.sale.Potential.class)
					.addAnnotatedClass(com.zqw.bss.model.sale.PotentialTrack.class)
					.addAnnotatedClass(com.zqw.bss.model.sale.SalesAgent.class)
					
					.addAnnotatedClass(com.zqw.bss.model.sys.Organization.class)
					.addAnnotatedClass(com.zqw.bss.model.sys.Resource.class)
					.addAnnotatedClass(com.zqw.bss.model.sys.Role.class)
					.addAnnotatedClass(com.zqw.bss.model.sys.User.class)
					.addAnnotatedClass(com.zqw.bss.model.sale.SalesAgent.class);

			cfg.setProperty("hibernate.connection.driver_class", "com.mysql.jdbc.Driver")
					.setProperty("hibernate.connection.url", "jdbc:mysql://192.168.1.36:3306/bss")
					.setProperty("hibernate.connection.username", "root")
					.setProperty("hibernate.connection.password", "root").setProperty("hibernate.format_sql", "true")
					.setProperty("hibernate.use_outer_join", "true").setProperty("hibernate.max_fetch_depth", "4").

					setProperty("hibernate.hbm2ddl.auto", "update")
					.setProperty("hibernate.dialect", "org.hibernate.dialect.MySQL5InnoDBDialect");

			sessionFactory = cfg.buildSessionFactory();

		} catch (Exception e) {
			e.printStackTrace();

		}
	}

	@AfterClass
	public static void tearDownAfterClass() throws Exception {
	}

	@Before
	public void setUp() throws Exception {

		session = sessionFactory.openSession();

		tx = session.beginTransaction();

	}

	@After
	public void tearDown() throws Exception {
		tx.commit();
	}

	@Test
	public void test() {
		//Owner
		Owner owner=new Owner();
		owner.setId(8L);
		
		PersonInfo pi=new PersonInfo();
		pi.setId(38L);
		
		AgentRequestPay agentRequestPay=new AgentRequestPay();
		agentRequestPay.setId(2L);
		
		Account ac=new Account();
		ac.setId(2L);
		ac.setAccountCode("00003");
		ac.setAmount(BigDecimal.ONE);
		ac.setCreateBy("9");
		ac.setCreateDate(new Date());
		ac.setLastUpdateBy("9");
		ac.setLastUpdateDate(new Date());
		ac.setOwnerId(owner.getId());
		session.save(ac);
		
		BillingProductPermission bpp=new BillingProductPermission();
		bpp.setId(2L);
		bpp.setOwnerId(owner.getId());
		bpp.setPermission("biz:inventory:view");
		bpp.setStartDate(new Date());
		bpp.setEndDate(new Date());
		session.save(bpp);
		
		BillingRecord br=new BillingRecord();
		br.setAccountCode("00003");
		br.setAmount(BigDecimal.ONE);
		br.setCreateBy("9");
		br.setCreateDate(new Date());
		br.setCustomerName("00003");
		br.setFlowNo("5");
		br.setId(2L);
		br.setLastUpdateBy("9");
		br.setLastUpdateDate(new Date());
		//br.setPayWay(PayWay.alipay);
		br.setRequestId("201260003");
		br.setStatus(PayStatus.paid);
		session.save(br);
		
		AccountProduct ap=new AccountProduct();
		ap.setCreateBy("9");
		ap.setCreateDate(new Date());
		ap.setDescription("测试数据");
		ap.setId(2L);
		ap.setLastUpdateBy("9");
		ap.setPermission("biz:inventory:view");
		ap.setPriceAmt(BigDecimal.ONE);
		ap.setProductCode("CFO0002");
		ap.setProductName("CFO");
		ap.setStatus(true);
		session.save(ap);
		
		AccountOrder o=new AccountOrder();
		List<AccountProduct> apList=new ArrayList<AccountProduct>();
		apList.add(ap);
		o.setAccountProducts(apList);
		o.setChannel("支付宝");
		o.setCreateBy("9");
		o.setCreateDate(new Date());
		o.setId(2L);
		o.setLastUpdateBy("9");
		o.setLastUpdateDate(new Date());
		o.setOrderBeginDate(new Date());
		o.setOrderCode("JY0082");
		o.setOrderCreateDate(new Date());
		o.setOwnerId(owner.getId());
		o.setPayStatus(PayStatus.paid);
		o.setTotalAmt(BigDecimal.ONE);
		session.save(o);
		
		Voucher v=new Voucher();
		v.setAmount(BigDecimal.ONE);
		v.setAvailable(Boolean.TRUE);
		v.setCreateBy("9");
		v.setCreateDate(new Date());
		v.setDispatchType(DispatchType.OTHER);
		v.setEndTime(new Date());
		v.setId(2L);
		v.setLastUpdateBy("9");
		v.setLastUpdateDate(new Date());
		v.setName("name");
		v.setStartTime(new Date());
		v.setVoucherCode("CFO003");
		session.save(v);	
		
		AccountReceipt r=new AccountReceipt();
		r.setAddress("彭江路602");
		r.setAmount(BigDecimal.ONE);
		r.setCreateBy("9");
		r.setCreateDate(new Date());
		r.setDate(new Date());
		r.setId(2L);
		r.setIndustry("IT");
		r.setLastUpdateBy("9");
		r.setLastUpdateDate(new Date());
		r.setOwnerId(owner.getId());
		r.setPayee("2");
		r.setPayer("2");
		r.setTaxAccount("2");
		session.save(r);
		
		
		PotentialTrack pt=new PotentialTrack();
		pt.setComment("hehaj");
		pt.setCreateBy("9");
		pt.setCreateDate(new Date());
		pt.setId(2L);
		pt.setLastUpdateBy("9");
		pt.setLastUpdateDate(new Date());
		pt.setPlanDate(new Date());
		session.save(pt);
		
		SalesAgent sa=new SalesAgent();
		sa.setAgentCode("2");
		sa.setId(2L);
		sa.setUserInfo(pi);
		session.save(sa);
		
		Potential p=new Potential();
		p.setClosingDate(new Date());
		p.setComment("2");
		p.setContact("2");
		p.setCreateBy("9");
		p.setCreateDate(new Date());
		p.setEmail("123@qq.com");
		p.setId(2L);
		p.setLastUpdateBy("9");
		p.setLastUpdateDate(new Date());
		p.setPhone("18312345678");
		p.setPotentialName("skkms");
		p.setSalesAgent(sa);
		List<PotentialTrack> ptList=new ArrayList<PotentialTrack>();
		ptList.add(pt);
		p.setTrackList(ptList);
		session.save(p);
		
		AccountOrderPay op=new AccountOrderPay();
		op.setAccountAmt(BigDecimal.ONE);
		op.setAmt(BigDecimal.ONE);
		List<BillingProductPermission> bpplist=new ArrayList<BillingProductPermission>();
		bpplist.add(bpp);
		op.setBillingProductPermissions(bpplist);
		op.setBillingRecord(br);
		op.setCurrency(StandardMoney.RMB);
		op.setId(2L);
		op.setAccountOrder(o);
		op.setOwnerId(owner.getId());
		op.setPayDate(new Date());
		op.setPayWay(PayWay.alipay);
		op.setRemark("测试数据");
		op.setTotalAmt(BigDecimal.ONE);
		List<Voucher> vlist=new ArrayList<Voucher>();
		vlist.add(v);
		op.setVouchers(vlist);
		op.setVouchertAmt(BigDecimal.ONE);
		session.save(op);
		
		AgentRevenue ar=new AgentRevenue();
		ar.setId(2L);
		ar.setAccountOrderPay(op);
		ar.setPayStatus(PayStatus.paid);
		ar.setRevenueAmt(BigDecimal.ONE);
		session.save(ar);
		
		AgentRequestPay arp=new AgentRequestPay();
		arp.setId(2L);
		arp.setCreateBy("9");
		arp.setCreateDate(new Date());
		arp.setLastUpdateBy("9");
		arp.setLastUpdateDate(new Date());
		arp.setPayStatus(PayStatus.notpaid);
		arp.setRemark("测试数据");
		List<AgentRevenue> arlist=new ArrayList<AgentRevenue>();
		arlist.add(ar);
		//arp.setAgentRevenues(arlist);
		session.save(arp);
		
		
	}
}
