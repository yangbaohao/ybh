package com.zqw.bss.util;

import java.sql.Connection;
import java.sql.SQLException;

import org.hibernate.FlushMode;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.jdbc.Work;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.orm.hibernate4.SessionHolder;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * 
 * @author wm 2017/7/6
 *
 */
public class HibernateUtil {

	private static final Logger log = LoggerFactory.getLogger(HibernateUtil.class);

	public static void runInNewSession(boolean readOnlyTx, Runnable runnable) {
		runInNewSession(readOnlyTx, "sessionFactory", runnable);
	}

	public static void runInNewSession(boolean readOnlyTx, String hibernateSessionFactoryBeanName, final Runnable runnable) {
		
		SessionFactory sessionFactory = SpringContextHolder.getBean(hibernateSessionFactoryBeanName);
		
		Session session = null;
		Transaction tx = null;
		
		if (!TransactionSynchronizationManager.hasResource(sessionFactory)) {
			session = sessionFactory.openSession();
		}
		
		try {
			if (session!=null){
				session.setFlushMode(readOnlyTx?FlushMode.MANUAL:FlushMode.AUTO);
				SessionHolder sessionHolder = new SessionHolder(session);
				TransactionSynchronizationManager.bindResource(sessionFactory, sessionHolder);
				TransactionSynchronizationManager.setCurrentTransactionReadOnly(readOnlyTx);
				
				tx = session.beginTransaction();
			}
			
			if (readOnlyTx){
				session.doWork(new Work(){
					@Override
					public void execute(Connection connection) throws SQLException {
						connection.setReadOnly(true);
						runnable.run();
					}});
			} else {
				runnable.run();
			}
			
			if (tx!=null) tx.commit();
		} catch (Throwable t){
			if (tx!=null) tx.rollback();
			log.error("transaction failed, rollbacked, {}", t.getMessage(), t);
		} finally {
			if (session != null) {
				try {
					session.flush();
				} catch (Exception e) {
					log.warn("failed to flush hibernate session {}, ignored", session, e);
				}
				try {
					session.close();
				} catch (Exception e) {
					log.warn("failed to close hibernate session {}, ignored", session, e);
				}
			}
		}
	}
}