//==============================================================================
// Created on 2007-3-27
// $Id: DAO.java,v 1.3 2008/07/08 07:54:10 maozh Exp $
//==============================================================================
package com.zqw.bss.framework.dao;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;

import com.zqw.bss.framework.dao.BaseDAOHibernate.StatementType;
import com.zqw.bss.framework.base.query.QueryBuilder;

/**
 * <p>
 * The interface of DAO
 * 
 * </p>
 * 
 * <p>
 * Copyright: Copyright (c) 2007-2010 www.accountyun.com
 * </p>
 * 
 * @author <a href="mailto:20199166@qq.com">wang hualong</a>
 * @version 1.0, $Revision: 1.3 $, $Date: 2008/07/08 07:54:10 $
 */
@SuppressWarnings("rawtypes")
public interface DAO {

	/**
	 * Query all records of class.
	 * 
	 * @param clazz
	 *            the type of objects (a.k.a. while table) to get data from
	 * @return List of populated objects
	 */
	public List getObjects(Class clazz);

	/**
	 * Get a record by class and id.
	 * 
	 * @param clazz
	 *            model class to lookup
	 * @param id
	 *            the identifier (primary key) of the class
	 * @param LockMode
	 *            Lock Mode
	 * 
	 * @return a populated object
	 * @see org.springframework.orm.ObjectRetrievalFailureException
	 */
	
	public Object getObject(Class clazz, Serializable id, Object... lockMode);

	/**
	 * Find records stated by object.
	 * 
	 * @param o
	 *            the object to save
	 * @return TODO
	 */
	public List findByExample(Object obj);

	/**
	 * Insert a record.
	 * 
	 * @param o
	 *            the object to save
	 * @return TODO
	 */
	public Object save(Object o);
	
	/**
	 * Insert a record but not invoke setDefaultValueInModel
	 * 
	 * @param o
	 *            the object to save
	 * @return TODO
	 */
	public Object saveNoSetDefaultValue(Object o);

	public Object save(Object o, Serializable id);

	/**
	 * Persist an object , save or update.
	 * 
	 * @param o
	 *            the object to save
	 * @return TODO
	 */
	public Object saveOrUpdate(Object o);

	/**
	 * Update an object.
	 * 
	 * @param object
	 * @return TODO
	 */
	public Object update(Object object);
	
	
	/**
	 * Update an object but not invoke setDefaultValueInModel.
	 * 
	 * @param object
	 * @return TODO
	 */
	public Object updateNoSetDefaultValue(Object object);
	

	/**
	 * Delete a record by class and id.
	 * 
	 * @param clazz
	 *            model class to lookup
	 * @param id
	 *            the identifier (primary key) of the class
	 */
	public void removeObject(Class clazz, Serializable id);

	/**
	 * Delete an object.
	 */
	public void removeObject(Object object);

	/**
	 * Delete objects by ids.
	 * 
	 * @param clazz
	 * @param ids
	 */
	public void removeBatch(Class clazz, Serializable[] ids);

	/**
	 * Delete objects by ids.
	 * 
	 * @param clazz
	 * @param ids
	 */
	public Long updateOrRemoveNativeSql(final String sql, final Object[] param);

	/**
	 * Find records by query.
	 * 
	 * @param filter
	 * @return
	 */
	public List find(String query);

	/**
	 * Find records by filter.
	 * 
	 * @param query
	 * @return
	 */
	public List find(QueryBuilder queryBuilder);

	/**
	 * Refresh an object.
	 * 
	 * @param object
	 * 
	 */
	public void refresh(Object object);

	/**
	 * Commit update to db.
	 */
	public void flush();

	/**
	 * Detached the object from session.
	 */
	public void clear();

	/**
	 * Query pagination results by query.
	 * 
	 * @param query
	 * @param start
	 * @param length
	 * @param param
	 * @return
	 */
	public List find(String query, int start, int length, Object... param);

	/**
	 * Query by hql and parameters.
	 * 
	 * @param hql
	 * @param param
	 * @return
	 */
	public List find(String hql, Serializable param);

	/**
	 * Query by hql and parameters.
	 * 
	 * @param hql
	 * @param param
	 * @return
	 */
	public List find(String hql, Object[] param);

	/**
	 * Query by class and parameters.
	 * 
	 * @param clazz
	 *            class.
	 * @param criterions
	 *            parameters.
	 * @return result.
	 */
	public List getList(Class clazz, Criterion[] criterions);

	/**
	 * @param clazz
	 * @param criterions
	 * @return
	 */
	public Object getFirst(Class clazz, Criterion[] criterions);

	/**
	 * @param class1
	 * @param criterions
	 * @param orders
	 * @return
	 */
	public List getList(Class class1, Criterion[] criterions, Order[] orders);

	/**
	 * @param className
	 * @param criterions
	 * @return
	 */
	public List getList(String className, Criterion[] criterions);

	/**
	 * @param className
	 * @param sequenceName
	 * @return
	 */
	public List getNextId(String sequenceName);

	/**
	 * @param qb
	 * @return
	 */
	public int count(QueryBuilder qb);

	public List getObjects(final Class clazz, Collection ids);

	/**
	 * 
	 * @param clazz
	 * @param field
	 *            the field which value in values
	 * @param values
	 * @return
	 */
	public List getObjects(final Class clazz, String field, Collection values);

	/**
	 * Whether the values exists on the columns in the records
	 * 
	 * @param names
	 *            columns, separated by ','<br>
	 *            such as "name,loginid,password"
	 */
	public boolean isNotUnique(Object entity, String names);

	public Session getHibSession();

	public List getLst4Paging(final String sql, final int[] params);
	
	public List getLst4PagingWithSQL(final String sql, final int[] params) ;

	public Long getCount4Paging(final String sql);
	
	public Long getCount4PagingWithSQL(final String sql);

	public long executeSql(final String sql, final Object[] param);
	
	public long executeHql(final String hql, final Object[] param);

	/**
	 * 
	 * @param String
	 *            sql
	 * @param Object
	 *            [] param
	 * @return list
	 */
	public List executeQuerySql(final String sql, final Object[] param);
	
	public Query bindParamToQueryByName(StatementType type, final String sqlorhql, Map<String, Object> params);

	public void bindParamToQueryByName(Query query, Map<String, Object> params);

	public Query bindParamToQueryByIndex(StatementType type, final String sqlorhql, final Object[] param);

	public void bindParamToQueryByIndex(Query query, final Object[] param);

}
