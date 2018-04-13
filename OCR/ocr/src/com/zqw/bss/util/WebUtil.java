package com.zqw.bss.util;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLDecoder;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.zqw.bss.framework.dao.DAO;
import com.zqw.bss.framework.exception.OperationException;
import com.zqw.bss.util.security.shiro.SessionUtil;

/**
 * Web层相关的实用工具类
 * 
 * @author wanghl
 */
@SuppressWarnings({ "rawtypes", "unchecked", "unused", "resource" })
public class WebUtil {

	private static final Logger logger = Logger.getLogger(WebUtil.class.getName());

	/** 下拉列表框显示值Key */
	public static final String COMBOX_TEXT_FIELD = "textFieldKey";

	/** 下拉列表框实际值Key */
	public static final String COMBOX_VALUE_FIELD = "valueFieldKey";

	private static Object ChartOfAccount;

	/**
	 * 返回当前用户及ownerId拼接的字符串
	 * 
	 * @param Long
	 *            ownerId
	 * 
	 * @return String
	 */
	public static String getLogBasicString() {

		return "  username= " + (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME);
	}

	public static void verify4Update(Object retObj, Object srcObj) {
		Method getMethod = null;
		Method setMethod = null;
		for (Field f : retObj.getClass().getDeclaredFields()) {
			try {
				PropertyDescriptor pd = new PropertyDescriptor(f.getName(), retObj.getClass());
				getMethod = pd.getReadMethod();
				setMethod = pd.getWriteMethod();
				try {
					if (getMethod != null && getMethod.invoke(srcObj, null) != null) {
						try {
							setMethod.invoke(retObj, getMethod.invoke(srcObj, null));
						} catch (IllegalArgumentException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} catch (IllegalAccessException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						} catch (InvocationTargetException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
					}
				} catch (IllegalArgumentException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				} catch (InvocationTargetException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			} catch (IntrospectionException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}
	}

	/**
	 * 将请求参数封装为Map<br>
	 * request中的参数t1=1&t1=2&t2=3<br>
	 * 形成的map结构：<br>
	 * key=t1;value=1,2<br>
	 * key=t2;value=3<br>
	 * 
	 * @param request
	 *            HTTP请求对象
	 * @return 封装后的Map
	 */
	public static HashMap<String, String> getParameterMap(HttpServletRequest request) {

		// 参数Map
		Map properties = request.getParameterMap();
		// 返回值HaspMap
		HashMap<String, String> returnMap = new HashMap<String, String>();
		Iterator entries = properties.entrySet().iterator();
		Map.Entry entry;
		String name = "";
		String value = "";
		while (entries.hasNext()) {
			entry = (Map.Entry) entries.next();
			name = (String) entry.getKey();
			Object valueObj = entry.getValue();
			if (null == valueObj) {
				value = "";
			} else if (valueObj instanceof String[]) {
				String[] values = (String[]) valueObj;
				for (int i = 0; i < values.length; i++) {
					value = values[i] + ",";
				}
				value = value.substring(0, value.length() - 1);
			} else {
				value = valueObj.toString();
			}
			returnMap.put(name, value);
		}
		return returnMap;
	}

	/**
	 * 把pojo字段转为数据库字段<br>
	 * fileName -> FILE_NAME
	 * 
	 * @param field
	 *            变量名
	 * @return 字段名
	 */
	public static String toClumn(String field) {

		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < field.length(); i++) {
			char c = field.charAt(i);
			if (Character.isUpperCase(c) && i > 0) {
				sb.append("_").append(Character.toUpperCase(c));
			} else {
				sb.append(Character.toUpperCase(c));
			}
		}
		return sb.toString();
	}

	/**
	 * 使用Response输出指定格式内容.
	 */
	protected static void render(HttpServletResponse response, String text, String contentType) {

		try {
			response.setContentType(contentType);
			if (text == null || StringUtils.EMPTY.equals(text)) {
				text = "";
			}
			response.getWriter().write(text);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 直接输出字符串.
	 */
	public static void renderText(HttpServletResponse response, String text) {

		render(response, text, "text/plain;charset=UTF-8");
	}

	/**
	 * 直接输出JSON.
	 */
	public static void renderJson(HttpServletResponse response, String text) {

		render(response, text, "application/json; charset=utf-8");
	}

	/**
	 * 直接输出HTML.
	 */
	public static void renderHtml(HttpServletResponse response, String html) {

		render(response, html, "text/html;charset=UTF-8");
	}

	/**
	 * 直接输出XML.
	 */
	public static void renderXML(HttpServletResponse response, String xml) {

		render(response, xml, "text/xml;charset=UTF-8");
	}

	/**
	 * MD5加密5
	 * 
	 * @param data
	 *            数据值
	 * @param salt
	 *            加密添加字符串
	 * @return 加密后字符串
	 */
	public static String encrypt(String data, String salt) {

		// 可以更换算法:sha512Hex
		return DigestUtils.md5Hex("loongrender" + data);
	}

	/**
	 * BASE64加密
	 * 
	 * @param data
	 * @return
	 */
	public static String encryptBase64(String data) {
		return Base64.encodeBase64String(data.getBytes());
	}

	/**
	 * BASE64解密
	 * 
	 * @param data
	 * @return
	 */
	public static String decryptBase64(String data) {
		return new String(Base64.decodeBase64(data));
	}

	/**
	 * 判断是否为hibernate代理类
	 * 
	 * @param clsName
	 *            String
	 * @return boolean
	 */
	private static boolean isPorxyObject(String clsName) {
		if (clsName.split(SystemConstant.PROXY_OBJ_SPLIT_STR).length > 1)
			return true;
		return false;

	}

	/**
	 * 根据hibernate代理对象 产生一个空的实体对象
	 * 
	 * @param Object
	 *            obj
	 * @return Object
	 */
	private static Object createEmptyEntrFromProxy(Object obj) throws Exception {
		if (isPorxyObject(obj.getClass().getName())) {
			String clsname = obj.getClass().getName().split(SystemConstant.PROXY_OBJ_SPLIT_STR)[0];
			return Class.forName(clsname).newInstance();
		}
		return null;

	}

	/**
	 * 将hibernate proxy对象转换为实体对象
	 * 
	 * @param Object
	 *            targetObject
	 * 
	 * @param DAO
	 *            dao
	 * 
	 * @return Object enrtyObject
	 * 
	 */
	public static Object getEntryFromProxyObj(Object targetObject, DAO dao) {
		dao.clear();
		return getEntryFromProxyObj(targetObject);

	}

	/**
	 * 将hibernate proxy对象列表转换为实体对象列表
	 * 
	 * @param List
	 *            targetList
	 * 
	 * @param DAO
	 *            dao
	 * 
	 * @return List enrtyObjectList
	 * 
	 */

	public static List getEntryListFromProxyList(List targetList, DAO dao) {
		if (targetList == null)
			return null;
		dao.clear();
		List objList = new ArrayList();
		for (int i = 0; i < targetList.size(); i++) {
			objList.add(getEntryFromProxyObj(targetList.get(i)));
		}
		return objList;

	}

	/**
	 * 获取目标对象的指定方法
	 * 
	 * @param Object
	 *            targetObject
	 * @return EntryObject
	 */
	private static Method getMethodWithNameAndObject(Object targetObject, String methodName, Class fieldClass)
			throws NoSuchMethodException {

		Method m;
		try {
			m = targetObject.getClass().getMethod(methodName, fieldClass);
		} catch (NoSuchMethodException e) {
			if (fieldClass.getSuperclass().getName().startsWith(SystemConstant.MODEL_PACKAGE_NAME)
					|| fieldClass.getSuperclass().getName().startsWith(SystemConstant.MODEL_FRAMEWORK_PACKAGE_NAME))
				return getMethodWithNameAndObject(targetObject, methodName, fieldClass.getSuperclass());
			else
				throw e;
		}

		return m;

	}

	/**
	 * 将hibernate proxy对象转换为实体对象
	 * 
	 * @param Object
	 *            targetObject
	 * @return EntryObject
	 */
	public static Object getEntryFromProxyObj(Object targetObject) {
		if (targetObject == null)
			return null;

		Field[] field = getAllDeclaredField(targetObject.getClass());

		try {
			for (int j = 0; j < field.length; j++) {
				String name = field[j].getName();

				name = name.substring(0, 1).toUpperCase() + name.substring(1);

				if ("SerialVersionUID".equals(name))
					continue;

				if (name.startsWith("_"))
					continue;
				String type = field[j].getGenericType().toString().replace("class ", "");
				Object fieldValue = null;

				try {
					Method gm = targetObject.getClass().getMethod("get" + name);
					JsonIgnore jsonIgnore = gm.getAnnotation(JsonIgnore.class);
					if (jsonIgnore != null)
						continue;
					fieldValue = gm.invoke(targetObject);
					if (fieldValue == null)
						continue;
					String[] names = { "UuId", "Id", "OwnerId" };

					if (CollectionUtils.arrayToList(names).contains(name)) {
						Method sm = targetObject.getClass().getMethod("set" + name, fieldValue.getClass());
						sm.invoke(targetObject, fieldValue);
					}

				} catch (java.lang.reflect.InvocationTargetException e) {
					logger.debug("getEntryFromProxyObj exception msg =" + e.getMessage());
					Object entryObj = createEmptyEntrFromProxy(targetObject);
					try {
						// 获取ID的值
						Method getId = targetObject.getClass().getMethod("getId");
						Long id = (Long) getId.invoke(targetObject);
						// 设置ID的值
						Method setId = entryObj.getClass().getMethod("setId", Long.class);
						setId.invoke(entryObj, id);

					} catch (Exception e1) {
						e1.printStackTrace();
						logger.debug(
								"getEntryFromProxyObj exception msg =" + e1.getMessage() + ". getID() return  error!");

					}
					return entryObj;

				}

				if (type.startsWith(SystemConstant.MODEL_PACKAGE_NAME)
						|| type.startsWith(SystemConstant.MODEL_FRAMEWORK_PACKAGE_NAME)) {
					fieldValue = getEntryFromProxyObj(fieldValue);

					Method m = getMethodWithNameAndObject(targetObject, "set" + name, fieldValue.getClass());

					m.invoke(targetObject, fieldValue);

					continue;
				}

				if (type.startsWith(List.class.getName())) {

					List valueList = (List) fieldValue;
					List newValueList = new ArrayList();
					Method m = targetObject.getClass().getMethod("set" + name, List.class);
					try {
						for (int i = 0; i < valueList.size(); i++) {
							Object entryObj = getEntryFromProxyObj(valueList.get(i));
							newValueList.add(entryObj);

							m.invoke(targetObject, newValueList);
						}
					} catch (org.hibernate.LazyInitializationException e) {
						logger.debug("getEntryFromProxyObj list exception" + e.getMessage());
						List nullList = null;
						m.invoke(targetObject, nullList);

					}

				}

			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return targetObject;
	}

	/**
	 * 设置实体对象的默认值
	 * 
	 * @param obj
	 */
	public static <T> void setDefaultValueInModel(T obj) {

		if (SecurityUtils.getSubject() != null) {
			setDefaultValueInModel(obj, (String) SessionUtil.get(SystemConstant.SESSION_KEY_USER_NAME));

		} else {

			throw new OperationException("User is not Login!");

		}
	}

	/**
	 * 获取指定类的所有字段，包括model包的父类
	 * 
	 * @param Class
	 *            cls
	 */
	public static Field[] getAllDeclaredField(Class cls) {

		Field[] initField = new Field[] {};

		while (cls.getPackage().getName().startsWith(SystemConstant.MODEL_PACKAGE_NAME)
				|| cls.getPackage().getName().startsWith(SystemConstant.MODEL_FRAMEWORK_PACKAGE_NAME)) {

			try {

				Field[] thisField = cls.getDeclaredFields();

				Field[] newField = new Field[initField.length + thisField.length];
				System.arraycopy(thisField, 0, newField, 0, thisField.length);
				System.arraycopy(initField, 0, newField, thisField.length, initField.length);
				initField = newField;
				cls = cls.getSuperclass();

			} catch (Exception e) {
				e.printStackTrace();
			}

		}

		return initField;

	}

	/**
	 * 设置实体类如下字段的值 createDate,createBy,lastUpdateDate,lastUpdateBy
	 * 
	 * @param Object
	 *            model
	 * 
	 * 
	 * @param String
	 *            currentUser,
	 *
	 */
	public static void setDefaultValueInModel(Object model, String currentUser, Set... objs) {

		if (objs.length == 0) {
			Set[] objstm = { new HashSet() };
			objs = objstm;
		}
		if (objs[0].contains(model))
			return;
		objs[0].add(model);

		Field[] field = getAllDeclaredField(model.getClass());

		try {
			for (int j = 0; j < field.length; j++) {
				String name = field[j].getName();

				name = name.substring(0, 1).toUpperCase() + name.substring(1);
				String type = field[j].getGenericType().toString().replace("class ", "");

				if (type.startsWith(SystemConstant.MODEL_PACKAGE_NAME)
						|| type.startsWith(SystemConstant.MODEL_FRAMEWORK_PACKAGE_NAME)) {
					Method m = model.getClass().getMethod("get" + name);
					Object obj = m.invoke(model);
					if (obj != null) {
						Long idvalue = 0L;
						try {
							Method getIdM = obj.getClass().getMethod("getId");
							idvalue = (Long) getIdM.invoke(obj);
						} catch (Exception e) {
							e.printStackTrace();
						}

						AutoValueIgnore autoValueIgnore = m.getAnnotation(AutoValueIgnore.class);
						// id为空，或者没有AutoValueIgnore注解，都需要执行setDefaultValueInModel
						if (idvalue == null || autoValueIgnore == null) {

							// 如果为对象id不为空，则不设置默认值
							setDefaultValueInModel(obj, currentUser, objs);
						}

					}
					continue;
				}

				if (type.startsWith(List.class.getName())) {

					Method m = model.getClass().getMethod("get" + name);

					AutoValueIgnore autoValueIgnore = m.getAnnotation(AutoValueIgnore.class);

					List values = (List) m.invoke(model);
					if (values != null) {
						for (int i = 0; i < values.size(); i++) {
							Long idvalue = 0L;
							try {
								Method getIdM = values.get(i).getClass().getMethod("getId");
								idvalue = (Long) getIdM.invoke(values.get(i));
							} catch (Exception e) {
								e.printStackTrace();
							}

							// id为空，或者没有AutoValueIgnore注解，都需要执行setDefaultValueInModel
							if (idvalue == null || autoValueIgnore == null) {
								setDefaultValueInModel(values.get(i), currentUser, objs);
							}

						}
					}
					continue;
				}

				if (type.equals(Date.class.getName()) && (name.equals("CreateDate"))) {
					Method m = model.getClass().getMethod("get" + name);
					Date value = (Date) m.invoke(model);
					if (value == null) {
						m = model.getClass().getMethod("set" + name, Date.class);
						m.invoke(model, new Date());
					}
					continue;
				}

				if (type.equals(Date.class.getName()) && name.equals("LastUpdateDate")) {
					Method m = model.getClass().getMethod("get" + name);

					m = model.getClass().getMethod("set" + name, Date.class);
					m.invoke(model, new Date());
					continue;

				}

				if (type.equals(String.class.getName()) && (name.equals("CreateBy"))) {
					Method m = model.getClass().getMethod("get" + name);
					String value = (String) m.invoke(model);
					if (value == null) {
						m = model.getClass().getMethod("set" + name, String.class);
						m.invoke(model, currentUser);
					}
					continue;
				}

				if (type.equals(String.class.getName()) && (name.equals("LastUpdateBy"))) {
					Method m = model.getClass().getMethod("get" + name);
					m = model.getClass().getMethod("set" + name, String.class);
					m.invoke(model, currentUser);
					continue;

				}

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 设置实体类如下字段的值 createDate,createBy,lastUpdateDate,lastUpdateBy,OwnerId
	 * 
	 * @param Object
	 *            model
	 * 
	 * 
	 * @param String
	 *            currentUser,
	 * @param Long
	 *            ownerId
	 */
	public static void setDefaultValueInModel(Object model, String currentUser,
			Long ownerId, Set... objs) {

		if (objs.length == 0) {
			Set[] objstm = { new HashSet() };
			objs = objstm;
		}
		if (objs[0].contains(model))
			return;
		objs[0].add(model);

		Field[] field = getAllDeclaredField(model.getClass());

		try {
			for (int j = 0; j < field.length; j++) {
				String name = field[j].getName();

				name = name.substring(0, 1).toUpperCase() + name.substring(1);
				String type = field[j].getGenericType().toString().replace(
						"class ", "");

				if (type.startsWith(SystemConstant.MODEL_PACKAGE_NAME)
						|| type.startsWith(SystemConstant.MODEL_FRAMEWORK_PACKAGE_NAME)) {
					Method m = model.getClass().getMethod("get" + name);
					Object obj = m.invoke(model);
					if (obj != null) {
						Long idvalue = 0L;
						try {
							Method getIdM = obj.getClass().getMethod("getId");
							idvalue = (Long) getIdM.invoke(obj);
						} catch (Exception e) {
							e.printStackTrace();
						}

						AutoValueIgnore autoValueIgnore = m
								.getAnnotation(AutoValueIgnore.class);
						// id为空，或者没有AutoValueIgnore注解，都需要执行setDefaultValueInModel
						if (idvalue == null || autoValueIgnore == null) {

							// 如果为对象id不为空，则不设置默认值
							setDefaultValueInModel(obj, currentUser, ownerId,
									objs);
						}

					}
					continue;
				}

				if (type.startsWith(List.class.getName())) {

					Method m = model.getClass().getMethod("get" + name);

					AutoValueIgnore autoValueIgnore = m
							.getAnnotation(AutoValueIgnore.class);

					List values = (List) m.invoke(model);
					if (values != null) {
						for (int i = 0; i < values.size(); i++) {
							Long idvalue = 0L;
							try {
								Method getIdM = values.get(i).getClass()
										.getMethod("getId");
								idvalue = (Long) getIdM.invoke(values.get(i));
							} catch (Exception e) {
								e.printStackTrace();
							}

							// id为空，或者没有AutoValueIgnore注解，都需要执行setDefaultValueInModel
							if (idvalue == null || autoValueIgnore == null) {
								setDefaultValueInModel(values.get(i),
										currentUser, ownerId, objs);
							}

						}
					}
					continue;
				}

				if (type.equals(Date.class.getName())
						&& (name.equals("CreateDate"))) {
					Method m = model.getClass().getMethod("get" + name);
					Date value = (Date) m.invoke(model);
					if (value == null) {
						m = model.getClass()
								.getMethod("set" + name, Date.class);
						m.invoke(model, new Date());
					}
					continue;
				}

				if (type.equals(Date.class.getName())
						&& name.equals("LastUpdateDate")) {
					Method m = model.getClass().getMethod("get" + name);

					m = model.getClass().getMethod("set" + name, Date.class);
					m.invoke(model, new Date());
					continue;

				}

				if (type.equals(String.class.getName())
						&& (name.equals("CreateBy"))) {
					Method m = model.getClass().getMethod("get" + name);
					String value = (String) m.invoke(model);
					if (value == null) {
						m = model.getClass().getMethod("set" + name,
								String.class);
						m.invoke(model, currentUser);
					}
					continue;
				}

				if (type.equals(String.class.getName())
						&& (name.equals("LastUpdateBy"))) {
					Method m = model.getClass().getMethod("get" + name);
					m = model.getClass().getMethod("set" + name, String.class);
					m.invoke(model, currentUser);
					continue;

				}

				if (type.equals(java.lang.Long.class.getName())
						&& (name.equals("OwnerId"))) {
					Method m = model.getClass().getMethod("get" + name);
					Long value = (Long) m.invoke(model);
					if (value == null) {
						m = model.getClass()
								.getMethod("set" + name, Long.class);
						m.invoke(model, ownerId);
					} else {
						if (!value.equals(ownerId))
							throw new OperationException("访问对象不属于当前用户，请联系管理员！");

					}
					continue;
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * java反射bean的get方法
	 * 
	 * @param objectClass
	 * @param fieldName
	 * @return
	 */
	private static Method getGetMethod(Class<? extends Object> objectClass, String fieldName) {

		try {
			Class[] parameterTypes = new Class[1];
			Field field = getField(objectClass, fieldName);
			parameterTypes[0] = field.getType();
			StringBuffer sb = new StringBuffer();
			sb.append("get");
			sb.append(fieldName.substring(0, 1).toUpperCase());
			sb.append(fieldName.substring(1));
			Method method = objectClass.getMethod(sb.toString(), parameterTypes);
			return method;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	/**
	 * java反射bean的set方法
	 * 
	 * @param objectClass
	 * @param fieldName
	 * @return
	 */
	public static Method getSetMethod(Class<? extends Object> objectClass, String fieldName) {

		try {
			Class[] parameterTypes = new Class[1];
			Field field = getField(objectClass, fieldName);
			parameterTypes[0] = field.getType();
			StringBuffer sb = new StringBuffer();
			sb.append("set");
			sb.append(fieldName.substring(0, 1).toUpperCase());
			sb.append(fieldName.substring(1));
			Method method = objectClass.getMethod(sb.toString(), parameterTypes);
			return method;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}

	}

	/**
	 * 获取类已经类的父的某一声明变量
	 * 
	 * @param clazz
	 * @param fieldName
	 *            变量名
	 * @return Field 变量
	 * @throws NoSuchFieldException
	 */
	private static Field getField(Class clazz, String fieldName) throws NoSuchFieldException {
		try {
			return clazz.getDeclaredField(fieldName);
		} catch (NoSuchFieldException e) {
			Class superClass = clazz.getSuperclass();
			if (superClass == null) {
				throw e;
			} else {
				return getField(superClass, fieldName);
			}
		}
	}

	/**
	 * 执行set方法
	 * 
	 * @param o执行对象
	 * @param fieldName属性
	 * @param value值
	 */
	private static void invokeSet(Object o, String fieldName, Object value) {

		Method method = getSetMethod(o.getClass(), fieldName);
		try {
			method.invoke(o, new Object[] { value });
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 取得系统消息
	 * 
	 * @param msgId
	 *            消息ID
	 * @param arg
	 *            消息设置参数
	 * @return 消息内容
	 */
	public static String getMessage(String msgId, Object[] arg) {
		String message = StringUtils.EMPTY;
		try {
			// 获取消息处理类
			MessageSource messageSource = new ClassPathXmlApplicationContext(
					"classpath:/config/spring/spring-message-bean.xml");
			message = messageSource.getMessage(msgId, arg, Locale.CHINA);
		} catch (Exception e) {
		}

		return message;
	}

	/**
	 * 取得系统消息
	 * 
	 * @param msgId
	 *            消息ID
	 * @return 消息内容
	 */
	public static String getMessage(String msgId) {
		return WebUtil.getMessage(msgId, null);
	}

	/**
	 * 取得前后N年分下拉列表Map
	 * 
	 * @param yearCount
	 *            指定年数
	 * @param addPreYear
	 *            是否取得前N年份(true:是;false:否)
	 * @param addNextYear
	 *            是否取得后N年份(true:是;false:否)
	 * @return 下拉列表Map
	 */
	public static Map<String, String> getYearMap(int yearCount, boolean addPreYear, boolean addNextYear) {

		Map<String, String> yearMap = new LinkedHashMap<String, String>();

		// 日历取得
		Calendar cder = Calendar.getInstance();

		int cYear = cder.get(Calendar.YEAR);

		// 前N年
		if (addPreYear) {
			for (int i = yearCount; i >= 1; i--) {
				yearMap.put(String.valueOf(cYear - i), String.valueOf(cYear - i));
			}
		}
		// 今年
		yearMap.put(String.valueOf(cYear), String.valueOf(cYear));
		// 后N年
		if (addNextYear) {
			for (int j = 1; j <= yearCount; j++) {
				yearMap.put(String.valueOf(cYear + j), String.valueOf(cYear + j));
			}
		}

		return yearMap;
	}

	/**
	 * 取得月份下拉列表Map
	 * 
	 * @return 下拉列表Map
	 */
	public static Map<String, String> getMonthMap() {

		Map<String, String> monthMap = new LinkedHashMap<String, String>();

		// 12月份
		monthMap.put("1", "01");
		monthMap.put("2", "02");
		monthMap.put("3", "03");
		monthMap.put("4", "04");
		monthMap.put("5", "05");
		monthMap.put("6", "06");
		monthMap.put("7", "07");
		monthMap.put("8", "08");
		monthMap.put("9", "09");
		monthMap.put("10", "10");
		monthMap.put("11", "11");
		monthMap.put("12", "12");

		return monthMap;
	}

	/**
	 * 取得前后N年年份中文下拉列表Map
	 * 
	 * @param yearCount
	 *            指定年数
	 * @param addPreYear
	 *            是否取得前N年份(true:是;false:否)
	 * @param addNextYear
	 *            是否取得后N年份(true:是;false:否)
	 * @return 下拉列表Map
	 */
	public static Map<String, String> getYearChineseMap(int yearCount, boolean addPreYear, boolean addNextYear) {

		Map<String, String> yearMap = new LinkedHashMap<String, String>();

		// 日历取得
		Calendar cder = Calendar.getInstance();

		int cYear = cder.get(Calendar.YEAR);

		// 前N年
		if (addPreYear) {
			for (int i = yearCount; i >= 1; i--) {
				yearMap.put(String.valueOf(cYear - i), String.valueOf(cYear - i) + "年");
			}
		}
		// 今年
		yearMap.put(String.valueOf(cYear), String.valueOf(cYear) + "年");
		// 后N年
		if (addNextYear) {
			for (int j = 1; j <= yearCount; j++) {
				yearMap.put(String.valueOf(cYear + j), String.valueOf(cYear + j) + "年");
			}
		}

		return yearMap;
	}

	public static Map<String, String> getMonthChineseMap() {
		Map<String, String> monthMap = new LinkedHashMap<String, String>();

		// 12月份
		monthMap.put("1", "1月");
		monthMap.put("2", "2月");
		monthMap.put("3", "3月");
		monthMap.put("4", "4月");
		monthMap.put("5", "5月");
		monthMap.put("6", "6月");
		monthMap.put("7", "7月");
		monthMap.put("8", "8月");
		monthMap.put("9", "9月");
		monthMap.put("10", "10月");
		monthMap.put("11", "11月");
		monthMap.put("12", "12月");

		return monthMap;
	}

	public static Map<String, String> getWeekMap() {
		Map<String, String> weekMap = new LinkedHashMap<String, String>();
		weekMap.put("0", "星期日");
		weekMap.put("1", "星期一");
		weekMap.put("2", "星期二");
		weekMap.put("3", "星期三");
		weekMap.put("4", "星期四");
		weekMap.put("5", "星期五");
		weekMap.put("6", "星期六");
		return weekMap;
	}

	public static Map<String, String> getQuarterMap() {
		Map<String, String> quarterMap = new LinkedHashMap<String, String>();
		quarterMap.put("1", "第一季度");
		quarterMap.put("2", "第二季度");
		quarterMap.put("3", "第三季度");
		quarterMap.put("4", "第四季度");
		return quarterMap;
	}

	/*
	 * public static String getYearMapJson(int yearCount, boolean addPreYear,
	 * boolean addNextYear) { ArrayList<Map<String, String>> yearList = new
	 * ArrayList<Map<String, String>>(); // 日历取得 Calendar cder =
	 * Calendar.getInstance(); int cYear = cder.get(Calendar.YEAR); Map<String,
	 * String> yearMap = null; // 前N年 if (addPreYear) { for (int i = yearCount;
	 * i >= 1; i--) { yearMap = new LinkedHashMap<String, String>();
	 * yearMap.put(WebUtil.COMBOX_TEXT_FIELD, String.valueOf(cYear - i) + "年");
	 * yearMap.put(WebUtil.COMBOX_VALUE_FIELD, String.valueOf(cYear - i));
	 * yearList.add(yearMap); } } // 今年 yearMap = new LinkedHashMap<String,
	 * String>(); yearMap.put(WebUtil.COMBOX_TEXT_FIELD, String.valueOf(cYear) +
	 * "年"); yearMap.put(WebUtil.COMBOX_VALUE_FIELD, String.valueOf(cYear));
	 * yearList.add(yearMap); // 后N年 if (addNextYear) { for (int j = 1; j <=
	 * yearCount; j++) { yearMap = new LinkedHashMap<String, String>();
	 * yearMap.put(WebUtil.COMBOX_TEXT_FIELD, String.valueOf(cYear + j) + "年");
	 * yearMap.put(WebUtil.COMBOX_VALUE_FIELD, String.valueOf(cYear + j));
	 * yearList.add(yearMap); } } return JsonUtil.Encode(yearList); }
	 * 
	 * public static String getMonthChineseMapJson() { ArrayList<Map<String,
	 * String>> monthList = new ArrayList<Map<String, String>>();
	 * 
	 * for (int i = 1; i <= 12; i++) { Map<String, String> monthMap = new
	 * HashMap<String, String>(); monthMap.put(WebUtil.COMBOX_TEXT_FIELD,
	 * String.valueOf(i) + "月"); monthMap.put(WebUtil.COMBOX_VALUE_FIELD,
	 * String.valueOf(i));
	 * 
	 * monthList.add(monthMap); }
	 * 
	 * return JsonUtil.Encode(monthList); }
	 * 
	 * public static String getWeekMapJson() { ArrayList<Map<String, String>>
	 * weekList = new ArrayList<Map<String, String>>(); String[] num = new
	 * String[] { "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六" }; for (int i
	 * = 0; i <= 6; i++) { Map<String, String> weekMap = new
	 * LinkedHashMap<String, String>(); weekMap.put(WebUtil.COMBOX_TEXT_FIELD,
	 * num[i]); weekMap.put(WebUtil.COMBOX_VALUE_FIELD, String.valueOf(i + 1));
	 * weekList.add(weekMap); } return JsonUtil.Encode(weekList); }
	 * 
	 * public static String getQuarterMapJson() { ArrayList<Map<String, String>>
	 * quarterList = new ArrayList<Map<String, String>>(); String[] num = new
	 * String[] { "第一季度", "第二季度", "第三季度", "第四季度" }; for (int i = 0; i < 4; i++)
	 * { Map<String, String> quarterMap = new LinkedHashMap<String, String>();
	 * quarterMap.put(WebUtil.COMBOX_TEXT_FIELD, num[i]);
	 * quarterMap.put(WebUtil.COMBOX_VALUE_FIELD, String.valueOf(i + 1));
	 * quarterList.add(quarterMap); } return JsonUtil.Encode(quarterList); }
	 */

	/**
	 * 取得客户端真实IP
	 * 
	 * @param request
	 * @return 客户端真实IP
	 */
	public static String getIpAddr(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwarded-For");
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
			ip = request.getRemoteAddr();
		}
		return ip;
	}

	/**
	 * 根据当前系统时间生成ID
	 * 
	 * @return 精确到毫秒
	 */
	public static long IdGenerator() {

		long baseId;
		long t = System.currentTimeMillis();
		// 52~43
		baseId = t;
		baseId &= 0x1FF0000000L;
		baseId <<= 14;
		// 28~15
		t &= 0xFFFC000L;
		baseId |= t;
		// 42~29
		SecureRandom ng = new SecureRandom();
		t = ng.nextLong();
		t &= 0x3FFF0000000L;
		// 14~1
		baseId |= t;
		baseId |= t;
		baseId /= 10000;
		baseId *= 10000;
		baseId &= 0x1FFFFFFFFFFFFL;
		return baseId;

	}

	/**
	 * 查询数据字典
	 * 
	 * @param category
	 *            数据字典类型
	 * @return List<Code> 返回
	 * 
	 *         public static List<Code> findListCode(String category) { List
	 *         <Code> list = new ArrayList<Code>(); Criteria criteria = new
	 *         Criteria(); criteria.put("codeCategory", category);
	 *         criteria.setOrderByClause("sort"); CodeService codeService =
	 *         SpringContextHolder.getBean("codeServiceImpl"); list =
	 *         codeService.selectByParams(criteria); return list; }
	 */

	/**
	 * 根据字段值和数据字典类型查询字段显示值
	 * 
	 * @param codeValue
	 * @param category
	 * @return
	 * 
	 * 		public static String findDisplayByParams(String codeValue, String
	 *         category) { Criteria criteria = new Criteria();
	 *         criteria.put("codeValue", codeValue);
	 *         criteria.put("codeCategory", category); CodeService codeService =
	 *         SpringContextHolder.getBean("codeServiceImpl"); List <Code> list
	 *         = codeService.selectByParams(criteria); Code code = list.get(0);
	 *         return code.getCodeDisplay(); }
	 */
	/**
	 * 生成指定位数随机密码
	 * 
	 * @return 随机密码
	 */
	public static String randomPwd(int length) {
		String randomPwd = "";
		StringBuffer buffer = new StringBuffer("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
		Random r = new Random();
		int range = buffer.length();
		for (int i = 0; i < length; i++) {
			randomPwd += buffer.charAt(r.nextInt(range));
		}
		return randomPwd;
	}

	/**
	 * 生成随机UUID值
	 * 
	 * @return 随机密码
	 */
	public static String UUID() {
		return UUID.randomUUID().toString();
	}

	/**
	 * 生成指定位数随机帐号+日期
	 * 
	 * @return 随机帐号+日期
	 */
	public static String randomAccount(int length) {
		String randomAccount = "";
		StringBuffer buffer = new StringBuffer("abcdefghijklmnopqrstuvwxyz");
		Random r = new Random();
		int range = buffer.length();
		for (int i = 0; i < length; i++) {
			randomAccount += buffer.charAt(r.nextInt(range));
		}
		Calendar cal = Calendar.getInstance();// 使用日历类
		String year = cal.get(Calendar.YEAR) + "";// 得到年
		String month = (cal.get(Calendar.MONTH) + 1) + "";// 得到月，因为从0开始的，所以要加1
		String day = cal.get(Calendar.DAY_OF_MONTH) + "";// 得到天
		randomAccount += year.substring(2, 4) + month + day;
		return randomAccount;
	}

	/**
	 * 向指定 URL 发送POST方法的请求
	 * 
	 * @param url
	 *            发送请求的 URL
	 * @param param
	 *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	 * @return 所代表远程资源的响应结果
	 */
	public static String sendPost(String url, String param) {
		PrintWriter out = null;
		BufferedReader in = null;
		String result = "";
		try {
			URL realUrl = new URL(url);
			// 打开和URL之间的连接
			URLConnection conn = realUrl.openConnection();
			// 设置通用的请求属性
			conn.setRequestProperty("accept", "*/*");
			conn.setRequestProperty("connection", "Keep-Alive");
			conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
			// 发送POST请求必须设置如下两行
			conn.setDoOutput(true);
			conn.setDoInput(true);
			// 获取URLConnection对象对应的输出流
			out = new PrintWriter(conn.getOutputStream());
			// 发送请求参数
			out.print(param);
			// flush输出流的缓冲
			out.flush();
			// 定义BufferedReader输入流来读取URL的响应
			in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		} catch (Exception e) {
			System.out.println("发送 POST 请求出现异常！" + e);
			e.printStackTrace();
		}
		// 使用finally块来关闭输出流、输入流
		finally {
			try {
				if (out != null) {
					out.close();
				}
				if (in != null) {
					in.close();
				}
			} catch (IOException ex) {
				ex.printStackTrace();
			}
		}
		return result;
	}

	/**
	 * 向指定URL发送GET方法的请求
	 * 
	 * @param url
	 *            发送请求的URL
	 * @param param
	 *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
	 * @return URL 所代表远程资源的响应结果
	 */
	public static String sendGet(String url, String param) {
		String result = "";
		BufferedReader in = null;
		try {
			String urlNameString = url + "?" + param;
			URL realUrl = new URL(urlNameString);
			// 打开和URL之间的连接
			URLConnection connection = realUrl.openConnection();
			// 设置通用的请求属性
			connection.setRequestProperty("accept", "*/*");
			connection.setRequestProperty("connection", "Keep-Alive");
			connection.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");
			// 建立实际的连接
			connection.connect();
			// 获取所有响应头字段
			Map<String, List<String>> map = connection.getHeaderFields();
			// 遍历所有的响应头字段
			/*
			 * for (String key : map.keySet()) { System.out.println(key + "--->"
			 * + map.get(key)); }
			 */
			// 定义 BufferedReader输入流来读取URL的响应
			in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		} catch (Exception e) {
			System.out.println("发送GET请求出现异常！" + e);
			e.printStackTrace();
		}
		// 使用finally块来关闭输入流
		finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (Exception e2) {
				e2.printStackTrace();
			}
		}
		return result;
	}

	/**
	 * 向指定 URL 发送POST方法的请求
	 * 
	 * @param url
	 *            发送请求的 URL
	 * @param param
	 *            请求参数，Json串
	 * @return 所代表远程资源的响应结果
	 */
	public static String sendPostJson(String urlstr, String param) {
		StringBuffer sb = new StringBuffer("");
		try {
			// 创建连接
			URL url = new URL(urlstr);
			HttpURLConnection connection = (HttpURLConnection) url.openConnection();
			connection.setDoOutput(true);
			connection.setDoInput(true);
			connection.setRequestMethod("POST");
			connection.setUseCaches(false);
			connection.setInstanceFollowRedirects(true);
			connection.setRequestProperty("Content-Type", "application/json");
			connection.connect();

			// POST请求
			DataOutputStream out = new DataOutputStream(connection.getOutputStream());
			out.writeBytes(param);
			out.flush();
			out.close();

			// 读取响应
			BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
			String lines;

			while ((lines = reader.readLine()) != null) {
				lines = new String(lines.getBytes(), "utf-8");
				sb.append(lines);
			}
			reader.close();
			// 断开连接
			connection.disconnect();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return sb.toString();
	}

	public static Map getParamsMap(String queryString, String enc) {
		Map paramsMap = new HashMap();
		if (queryString != null && queryString.length() > 0) {
			int ampersandIndex, lastAmpersandIndex = 0;
			String subStr, param, value;
			String[] paramPair, values, newValues;
			do {
				ampersandIndex = queryString.indexOf('&', lastAmpersandIndex) + 1;
				if (ampersandIndex > 0) {
					subStr = queryString.substring(lastAmpersandIndex, ampersandIndex - 1);
					lastAmpersandIndex = ampersandIndex;
				} else {
					subStr = queryString.substring(lastAmpersandIndex);
				}
				paramPair = subStr.split("=");
				param = paramPair[0];
				value = paramPair.length == 1 ? "" : paramPair[1];
				try {
					value = URLDecoder.decode(value, enc);
				} catch (UnsupportedEncodingException ignored) {
				}
				if (paramsMap.containsKey(param)) {
					values = (String[]) paramsMap.get(param);
					int len = values.length;
					newValues = new String[len + 1];
					System.arraycopy(values, 0, newValues, 0, len);
					newValues[len] = value;
				} else {
					newValues = new String[] { value };
				}
				paramsMap.put(param, value);
			} while (ampersandIndex > 0);
		}
		return paramsMap;
	}

	/**
	 * 新增时 对某个字段赋值
	 * 
	 * @param obj
	 * @param property
	 * @param value
	 * 
	 *            add by qct 2014-07-30
	 */
	public static <T> void prepareProperty(T obj, String property, Object value) {
		invokeSet(obj, property, value);
	}

}
