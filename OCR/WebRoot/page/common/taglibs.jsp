<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page isELIgnored="false"  %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>

<base href="${pageContext.request.contextPath}/" />
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!-- 外网 -->
<%-- <base href="/" />
<c:set var="ctx" value="${pageContext.request.contextPath}"/> --%>

<%-- <c:set var="ctx" value="/AccountingCloud"/> --%>
<c:set var="langLocale" value="zh_CN"/>
<c:set var="jqxVersion" value="4.1"/>
<c:if test="${param.lang!=null}">
	<c:set var="langLocale" value="${param.lang}" />
	<input type="hidden" value="${param.lang}" id="langHid"/>
	<c:set  var="currentlang"  value="${param.lang}"  scope="session"  />
</c:if>

<c:if test="${sessionScope.currentlang==null}">
	<c:set  var="currentlang"  value="${langLocale}"  scope="session"  />
</c:if>


<fmt:setLocale value="${sessionScope.currentlang}"/>
<fmt:setBundle basename="i18n.message"/>
<script type="text/javascript">
	var ctx = "${ctx}";
	var ws_url = "${ctx}";
	var isLoginPage = 1;
	var currentlang= "${sessionScope.currentlang}";
</script>