//==============================================================================
// Created on 2007-3-27
// $Id: BaseDAOHibernate.java,v 1.3 2008/07/08 07:54:10 maozh Exp $
//==============================================================================

package com.zqw.bss.framework.dao;

import java.io.Serializable;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.LockMode;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.orm.hibernate4.HibernateCallback;
import org.springframework.orm.hibernate4.support.HibernateDaoSupport;
import org.springframework.util.Assert;

import static com.zqw.bss.framework.dao.BaseDAOHibernate.StatementType.SQL;
import com.zqw.bss.framework.base.query.QueryBuilder;
import com.zqw.bss.util.WebUtil;

/**
 * <p>
 * Base dao
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2007-2010 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision: 1.3 $, $Date: 2008/07/08 07:54:10 $
 */
@SuppressWarnings( { "unchecked", "rawtypes" })
public class BaseDAOHibernate extends HibernateDaoSupport implements DAO {
	protected final Log log = LogFactory.getLog(getClass());

	static enum StatementType{
		SQL, HQL;
	}
	/*
	 * 
	 * @see dao.DAO#getObjects(java.lang.Class)
	 */
	public List getObjects(Class clazz) {
		Assert.notNull(clazz, "Class can not be null!");
		return getHibernateTemplate().loadAll(clazz);
	}

	/*
	 * 
	 * @see dao.DAO#findByExample(java.lang.Object)
	 */
	public List<Object> findByExample(Object obj) {
		Assert.notNull(obj, "The query object can not be null!");
		return getHibernateTemplate().findByExample(obj);
	}

	/*
	 * 
	 * @see DAO#getObject(java.lang.Class, java.io.Serializable,Object... args)
	 */
	public Object getObject(Class clazz, Serializable id, Object... lockMode) {
		Assert.notNull(clazz, "Class can not be null!");
		Assert.notNull(id, "The query object can not be null!");
		LockMode lm = null;
		for (Object object : lockMode) {
			lm = (LockMode) object;
			break;
		}
		return getHibernateTemplate().get(clazz, id, lm);
	}

	/*
	 * 
	 * @see dao.DAO#save(java.lang.Object)
	 */
	public Object save(Object o) {

		WebUtil.setDefaultValueInModel(o);
		return this.saveNoSetDefaultValue(o);

	}

	public Object saveNoSetDefaultValue(Object o) {
		Assert.notNull(o, "The object saved can not be null!");
		getHibernateTemplate().persist(o);
		return o;

	}

	/*
	 * 
	 * @see dao.DAO#save(java.lang.Object, java.io.Serializable)
	 */
	public Object save(Object o, Serializable id) {
		Assert.notNull(o, "The object saved can not be null!");
		Assert.notNull(id, "The key of saved object can not be null!");
		WebUtil.setDefaultValueInModel(o);
		getHibernateTemplate().persist(o);
		return o;
	}

	/*
	 * 
	 * @see dao.DAO#saveOrUpdate(java.lang.Object)
	 */
	public Object saveOrUpdate(Object o) {
		Assert.notNull(o, "The object saved or updated can not be null!");
		WebUtil.setDefaultValueInModel(o);
		getHibernateTemplate().saveOrUpdate(o);
		return o;
	}

	/*
	 * 
	 * @see dao.DAO#update(java.lang.Object)
	 */
	public Object update(Object object) {
		WebUtil.setDefaultValueInModel(object);
		return this.updateNoSetDefaultValue(object);
	}

	public Object updateNoSetDefaultValue(Object object) {

		Assert.notNull(object, "The object updated can not be null!");
		getHibernateTemplate().merge(object);
		return object;
	}

	/*
	 * 
	 * @see dao.DAO#removeObject(java.lang.Class, java.io.Serializable)
	 */
	public void removeObject(Class clazz, Serializable id) {
		Assert.notNull(clazz, "Class can not be null!");
		Assert.notNull(id, "The key of removed object can not be null!");
		getHibernateTemplate().delete(getObject(clazz, id));
	}

	/*
	 * 
	 * @see dao.DAO#removeObject(java.lang.Object)
	 */
	public void removeObject(Object object) {
		Assert.notNull(object, "The removed object can not be null!");
		getHibernateTemplate().delete(object);
	}

	/*
	 * 
	 * @see dao.DAO#removeBatch(java.lang.Class, java.io.Serializable[])
	 */
	public void removeBatch(final Class clazz, final Serializable[] ids) {
		Assert.notNull(clazz, "Class can not be null!");
		getHibernateTemplate().execute(new HibernateCallback() {
			public Object doInHibernate(Session session)
					throws HibernateException {
				for (int i = 0; i < ids.length; i++) {
					Object obj = session.load(clazz, ids[i]);
					if (obj != null) {
						session.delete(obj);
					} else {
						log.warn("Can not delete the object with key:" + ids[i]
								+ " on " + clazz.getName());
					}
				}
				return null;
			}
		});
	}

	/**
	 * @param className
	 * @param sequenceName
	 * @return
	 */
	public Long updateOrRemoveNativeSql(final String sql, final Object[] param) {
		return (Long) getHibernateTemplate().execute(new HibernateCallback() {

			public Object doInHibernate(Session session)
					throws HibernateException {
				Query query = null;
				query = session.createSQLQuery(sql);
				int i = 0;
				if (param != null)
					for (Object pr : param) {
						query.setParameter(i, pr);
						i++;
					}

				return Long.valueOf(query.executeUpdate());
			}
		});
	}

	public long executeSql(final String sql, final Object[] param) {
		Query query = getHibSession().createSQLQuery(sql);

		if (param != null) {
			int i = 0;
			for (Object pr : param) {
				query.setParameter(i, pr);
				i++;
			}
		}
		return query.executeUpdate();
	}

	
	public long executeHql(final String hql, final Object[] param) {
		Query query = getHibSession().createQuery(hql);

		if (param != null) {
			int i = 0;
			for (Object pr : param) {
				query.setParameter(i, pr);
				i++;
			}
		}
		return query.executeUpdate();
	}

	
	
	public List executeQuerySql(final String sql, final Object[] param) {
		Query query = getHibSession().createSQLQuery(sql);

		if (param != null) {
			int i = 0;
			for (Object pr : param) {
				query.setParameter(i, pr);
				i++;
			}
		}
		return query.list();
	}

	/*
	 * 
	 * @see dao.DAO#find(java.lang.String)
	 */
	public List find(String query) {
		Assert.notNull(query, "The query can not be null!");
		return getHibernateTemplate().find(query);
	}

	/*
	 * 
	 * @see dao.DAO#refresh(java.lang.Object)
	 */
	public void refresh(Object object) {
		WebUtil.setDefaultValueInModel(object);
		getHibernateTemplate().refresh(object);
	}

	/*
	 * 
	 * @see dao.DAO#flush()
	 */
	public void flush() {
		getHibernateTemplate().flush();
	}

	/*
	 * 
	 * @see dao.DAO#clear()
	 */
	public void clear() {

		getHibernateTemplate().clear();

	}

	/*
	 * 
	 * @see dao.DAO#find(java.lang.String, int, int)
	 */
	public List find(String query, int start, int length, Object... param) {
		return getObjects(query, start, length, param);
	}

	public List getObjects(final String queryString, final int position,
			final int length, final Object... values) {
		Assert.notNull(queryString, "The query can not be null!");
		return (List) getHibernateTemplate().execute(new HibernateCallback() {
			public List doInHibernate(Session session)
					throws HibernateException {
				Query query = session.createQuery(queryString);
				if (values != null) {
					for (int i = 0; i < values.length; i++) {
						query.setParameter(i, values[i]);
					}
				}

				query.setFirstResult(position);
				query.setMaxResults(length);
				List lt = query.list();
				return lt;
			}
		});
	}

	/*
	 * 
	 * @see dao.DAO#find(com.insigma.trust.base.query. QueryBuilder)
	 */
	public List find(final QueryBuilder queryBuilder) {
		if (queryBuilder != null) {
			return (List) getHibernateTemplate().execute(
					new HibernateCallback() {

						public List doInHibernate(Session session)
								throws HibernateException {
							DetachedCriteria dc = queryBuilder
									.getDetachedCriteria();
							for (Iterator it = queryBuilder.getOrderBys()
									.iterator(); it.hasNext();) {
								Order element = (Order) it.next();
								dc.addOrder(element);
							}
							return dc.getExecutableCriteria(session).list();
						}

					});
		}
		return null;
	}

	/**
	 * @param hql
	 * @param param
	 * @return
	 * @see com.zqw.bss.framework.dao.DAO#find(java.lang.String,
	 *      java.io.Serializable)
	 */
	public List find(final String hql, final Serializable param) {
		Assert.notNull(hql, "The query can not be null!");
		Assert.notNull(param, "The parameter can not be null!");
		return getHibernateTemplate().find(hql, param);
	}

	/**
	 * 
	 * @param hql
	 * @param param
	 * @return
	 */
	public List find(final String hql, final Object[] param) {
		Assert.notNull(hql, "The query can not be null!");
		Assert.notNull(param, "The parameter can not be null!");
		return getHibernateTemplate().find(hql, param);
	}

	/**
	 * @param clazz
	 * @param criterions
	 * @return
	 * @see com.zqw.bss.framework.dao.DAO#getList(java.lang.Class,
	 *      org.hibernate.criterion.Criterion[])
	 */
	public List getList(final Class clazz, final Criterion[] criterions) {
		Assert.notNull(clazz, "Class can not be null!");

		return (List) getHibernateTemplate().execute(new HibernateCallback() {

			public List doInHibernate(Session session)
					throws HibernateException {
				Criteria query = session.createCriteria(clazz);
				if ((criterions != null) && (criterions.length > 0)) {
					for (int i = 0; i < criterions.length; i++) {
						query.add(criterions[i]);
					}
				}
				return query.list();
			}
		});
	}

	/**
	 * 
	 * @param clazz
	 * @param ids
	 * @return
	 */
	public List getObjects(final Class clazz, Collection ids) {
		String idString = "";
		for (Object id : ids) {
			idString = idString + id + ",";
		}
		idString = idString.substring(0, idString.length() - 1);
		return getHibernateTemplate().find(
				"select distinct obj from " + clazz.getName()
						+ " as obj where obj.id in (" + idString + ")");
	}

	/**
	 * 
	 * @param clazz
	 * @param field
	 *            the field which value in values
	 * @param values
	 * @return
	 */
	public List getObjects(final Class clazz, String field, Collection values) {
		String idString = "";
		for (Object id : values) {
			idString = idString + id + ",";
		}
		idString = idString.substring(0, idString.length() - 1);
		String HQL = "from " + clazz.getName() + " where " + field + " in ('"
				+ idString + "')";
		return getHibernateTemplate().find(HQL);
	}

	/**
	 * Get the first record of the query
	 * 
	 * @param clazz
	 *            class name.
	 * @param criterions
	 *            conditions.
	 * @return result.
	 * @see com.zqw.bss.framework.dao.DAO#getFirst(java.lang.Class,
	 *      org.hibernate.criterion.Criterion[])
	 */
	public Object getFirst(Class clazz, Criterion[] criterions) {
		List lt = getList(clazz, criterions);
		if ((lt != null) && (!lt.isEmpty())) {
			return lt.get(0);
		}
		return null;
	}

	/**
	 * @param clazz
	 * @param criterions
	 * @param orders
	 * @return
	 * @see com.zqw.bss.framework.dao.DAO#getList(java.lang.Class,
	 *      org.hibernate.criterion.Criterion[],
	 *      org.hibernate.criterion.Order[])
	 */
	public List getList(final Class clazz, final Criterion[] criterions,
			final Order[] orders) {
		Assert.notNull(clazz, "Class can not be null!");
		return (List) getHibernateTemplate().execute(new HibernateCallback() {

			public List doInHibernate(Session session)
					throws HibernateException {
				Criteria criteria = session.createCriteria(clazz);
				if ((criterions != null) && (criterions.length > 0)) {
					for (int i = 0; i < criterions.length; i++) {
						criteria.add(criterions[i]);
					}
				}
				if ((orders != null) && (orders.length > 0)) {
					for (int i = 0; i < orders.length; i++) {
						criteria.addOrder(orders[i]);
					}
				}
				return criteria.list();
			}
		});
	}

	/**
	 * @param className
	 * @param criterions
	 * @return
	 * @see com.zqw.bss.framework.dao.DAO#getList(java.lang.String,
	 *      org.hibernate.criterion.Criterion[])
	 */
	public List getList(final String className, final Criterion[] criterions) {
		Assert.notNull(className, "Class name can not be null");
		return (List) getHibernateTemplate().execute(new HibernateCallback() {

			public List doInHibernate(Session session)
					throws HibernateException {
				Criteria criteria = null;
				try {
					criteria = session.createCriteria(Class.forName(className));
				} catch (ClassNotFoundException e) {
					logger
							.error(
									"$HibernateCallback.doInHibernate(Session) -- e=" + e, e); //$NON-NLS-1$
					throw new IllegalArgumentException(
							"The class name is not correct,classname = "
									+ className);
				}
				if ((criterions != null) && (criterions.length > 0)) {
					for (int i = 0; i < criterions.length; i++) {
						criteria.add(criterions[i]);
					}
				}
				return criteria.list();
			}
		});
	}

	/**
	 * @param className
	 * @param sequenceName
	 * @return
	 */
	public List getNextId(final String sequenceName) {
		return (List) getHibernateTemplate().execute(new HibernateCallback() {

			public Object doInHibernate(Session session)
					throws HibernateException {
				Query query = null;
				query = session.createSQLQuery("select next value for "
						+ sequenceName + " from sysibm.sysdummy1");
				return query.list();
			}
		});
	}

	/**
	 * @param qb
	 * @return
	 * @see com.zqw.bss.framework.dao.DAO#count(com.zqw.bss.framework.base.query.QueryBuilder)
	 */
	public int count(final QueryBuilder queryBuilder) {
		return ((Integer) getHibernateTemplate().execute(
				new HibernateCallback() {

					public Integer doInHibernate(Session session)
							throws HibernateException {
						DetachedCriteria dc = queryBuilder
								.getDetachedCriteria();
						Criteria ct = dc.getExecutableCriteria(session);
						return (Integer) ct.setProjection(
								Projections.rowCount()).uniqueResult();
					}
				})).intValue();
	}

	/**
	 * Get session.
	 * 
	 * @return
	 */
	public Session getHibSession() {

		try {
			return this.getSessionFactory().getCurrentSession();
		} catch (Exception e) {
			e.printStackTrace();
			return this.getSessionFactory().openSession();
		}

	}

	/**
	 * Whether the values exists on the columns in the records
	 * 
	 * @param names
	 *            columns, seperated by ','<br>
	 *            such as "name,loginid,password"
	 */
	public boolean isNotUnique(Object entity, String names) {
		Assert.hasText(names);
		Criteria criteria = getHibSession().createCriteria(entity.getClass())
				.setProjection(Projections.rowCount());
		String[] nameList = names.split(",");
		try {
			for (String name : nameList) {
				criteria.add(Restrictions.eq(name, PropertyUtils.getProperty(
						entity, name)));
			}

			String idName = getSessionFactory().getClassMetadata(
					entity.getClass()).getIdentifierPropertyName();
			if (idName != null) {
				Object idValue = PropertyUtils.getProperty(entity, idName);
				// If update, exclude itself
				if ((idValue != null) && (!idValue.equals("")))
					criteria.add(Restrictions.not(Restrictions.eq(idName,
							idValue)));
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
			return false;
		}
		return ((Integer) criteria.uniqueResult()) > 0;
	}

	/**
	 * @param className
	 * @param sequenceName
	 * @return
	 */
	public List getLst4Paging(final String sql, final int[] params) {
		return (List) getHibernateTemplate().execute(new HibernateCallback() {

			public Object doInHibernate(Session session)
					throws HibernateException {
				Query query = null;
				query = session.createQuery(sql);
				query.setFirstResult(params[0] * params[1]);
				query.setMaxResults(params[1]);
				return query.list();
			}
		});
	}

	/**
	 * @param className
	 * @param sequenceName
	 * @return
	 */
	public List getLst4PagingWithSQL(final String sql, final int[] params) {
		return (List) getHibernateTemplate().execute(new HibernateCallback() {

			public Object doInHibernate(Session session)
					throws HibernateException {
				Query query = null;
				query = session.createSQLQuery(sql);
				query.setFirstResult(params[0] * params[1]);
				query.setMaxResults(params[1]);
				return query.list();
			}
		});
	}

	public Long getCount4Paging(final String hql) {
		return (Long) getHibernateTemplate().execute(new HibernateCallback() {

			public Object doInHibernate(Session session)
					throws HibernateException {
				Query query = null;
				query = session.createQuery(hql);
				return query.uniqueResult();
			}
		});
	}

	public Long getCount4PagingWithSQL(final String sql) {
		return (Long) getHibernateTemplate().execute(new HibernateCallback() {

			public Object doInHibernate(Session session)
					throws HibernateException {
				Query query = null;
				query = session.createSQLQuery(sql);
				return Long.valueOf(query.uniqueResult().toString());
			}
		});
	}
	
	public Query bindParamToQueryByIndex(StatementType type, final String sqlorhql, final Object[] param) {
		Query query = SQL.equals(type)?getHibSession().createSQLQuery(sqlorhql):getHibSession().createQuery(sqlorhql);
		bindParamToQueryByIndex(query, param);
		return query;
	}

	public void bindParamToQueryByIndex(Query query, final Object[] param) {
		if (param != null) {
			int i = 0;
			for (Object pr : param) {
				query.setParameter(i++, pr);
			}
		}
	}

	public Query bindParamToQueryByName(StatementType type, final String sqlorhql, Map<String, Object> params) {
		Query query = SQL.equals(type)?getHibSession().createSQLQuery(sqlorhql):getHibSession().createQuery(sqlorhql);
		bindParamToQueryByName(query, params);
		return query;
	}

	public void bindParamToQueryByName(Query query, Map<String, Object> params) {
		if (params != null && params.size()>0) {
			for (Map.Entry<String, Object> e : params.entrySet()) {
				applyNamedParameterToQuery(query, e.getKey(), e.getValue());
			}
		}
	}
	
	//copied from org.springframework.orm.hibernate5.HibernateTemplate.applyNamedParameterToQuery(Query, String, Object)
	private void applyNamedParameterToQuery(Query queryObject, String paramName, Object value) throws HibernateException {
		if (value instanceof Collection) {
			queryObject.setParameterList(paramName, (Collection<?>) value);
		}
		else if (value instanceof Object[]) {
			queryObject.setParameterList(paramName, (Object[]) value);
		}
		else {
			queryObject.setParameter(paramName, value);
		}
	}

}
