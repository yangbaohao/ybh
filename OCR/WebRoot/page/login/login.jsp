<!--logInForMobile=OK-->

<%--注意：第一行不可以删除，用于手机端验证--%>
<%@page
	import="org.apache.shiro.web.filter.authc.FormAuthenticationFilter"%>
<%@ page contentType="text/html;charset=UTF-8" language="java"%>
<%@ page isELIgnored="false"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<!DOCTYPE html>
<html>
<head>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<base href="${ctx}/" />

<!-- 外网 -->
<!-- <base href="/" /> -->

<!-- <script language="javascript">
	if (document.getElementById("level1_menu") != null) {
		window.onbeforeunload = function(event) {
		}
		$("body").hide();
		window.location.href = "${ctx}";
	}
</script> -->
<%
	org.apache.shiro.SecurityUtils.getSubject().logout();
%>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<!-- <meta content="yes" name="apple-mobile-web-app-capable"> -->
<meta name="viewport"
	content="width=device-width, user-scalable=no,initial-scale=1,maximum-scale=1.0, minimum-scale=1.0">
<title>订单OCR</title>

<!-- CSS -->
<link rel="shortcut icon" href="images/common/favicon_1.png"
	mce_href="images/common/favicon_1.png">
<link rel="stylesheet" href="styles/bootstrap/bootstrap.min.css">
<link href="styles/bootstrap/core.css" rel="stylesheet" />
<link href="styles/bootstrap/icons.css" rel="stylesheet" />
<link href="styles/bootstrap/me.css" rel="stylesheet" />
<script type="text/javascript" src="js/common/jquery-1.11.1.min.js"></script>
</head>
<body style="background-color: #EAEBEC">


	<%
		String error = (String) request.getAttribute(FormAuthenticationFilter.DEFAULT_ERROR_KEY_ATTRIBUTE_NAME);
	%>

	<c:set var="exp_type" value="<%=error%>" />
	<c:set var="tips" value=""></c:set>


	<c:if test="${fn:contains(exp_type,'LockedAccountException')}">
		<c:set var="tips" value="该账号锁定，不允许登陆!"></c:set>
	</c:if>
	<c:if test="${fn:contains(exp_type,'DisabledAccountException')}">
		<c:set var="tips" value="账号不允许登陆!"></c:set>
	</c:if>
	<c:if test="${fn:contains(exp_type,'UnknownAccountException')}">
		<c:set var="tips" value="账号不存在!"></c:set>
	</c:if>
	<c:if test="${fn:contains(exp_type,'IncorrectCredentialsException')}">
		<c:set var="tips" value="密码错误!"></c:set>
	</c:if>

	<!-- Top content -->
	<div class="top-content" id="phoneTop">
		<div class="inner-bg">
			<div class="container">
				<!-- <div class="row">
                <div class="col-sm-4 col-sm-offset-4">
                    <h1><img src="images/common/logo.png" alt="" style="width: 40%;"/></h1>

                    <div class="description">
                        <p>
                            <img src="images/common/logo_text_blue.png" alt=""/>
                        </p>
                    </div>
                </div>
            </div> -->
				<div class="row">
					<div class="col-md-4"></div>
					<div class="col-md-4">
						<div id="login_div">
							<div class="text-center p-t-30">
								<img src="images/MZ_beforelogin.png">
							</div>

							<div class="form-bottom p-t-30">
								<form role="form" action="page/login/login.jsp" method="post"
									class="login-form">
									<!-- <div class="row">
										<div class="form-group">
											<div class="col-sm-10 col-sm-offset-1 login_wjmm">
												<a class="float-right" href="page/reg/agentRegister.html">代理商注册&gt;</a>
											</div>
										</div>
									</div> -->

									<!-- 错误提示 -->
									<div class="row p-b-0" id="errorMsg">
										<div class="col-sm-10 col-sm-offset-1" style="color: red">
											<c:out value="${tips}"></c:out>
										</div>
									</div>

									<div class="row p-b-0">
										<div class="col-sm-10 col-sm-offset-1">
											<input type="text" name="username" placeholder='用户名默认手机号'
												value='' class="form-control sform-con" id="form-username">
										</div>
									</div>
									<div class="row">
										<div class="col-sm-10 col-sm-offset-1">
											<input type="password" name="password" placeholder="密码"
												class="form-control" id="form-password"
												style="border: transparent">
										</div>
									</div>
									<div class="row p-b-0">
										<div class="col-sm-10 col-sm-offset-1">
											<button id="step1_btn" class="btn"
												style="width: 100%; margin-bottom: 15px;">登 录</button>
										</div>
									</div>
									<div class="row p-b-50">
										<div class="col-sm-10 col-sm-offset-1">
											<div class="form-group p-l-20">
												<!-- <div class="checkbox checkbox_login float-left">
                                                <input checked="true" id="checkbox13" type="checkbox"/>
                                                <label for="checkbox13" style="line-height:140% !important">记住密码</label>
                                            </div> -->
												<div class="float-right login_wjmm">
													<a href="page/reg/forgetpwd.html">忘记密码&gt;</a>
												</div>
											</div>
										</div>
									</div>

									<!-- <div class="row p-b-50">
                                    <div class="col-sm-10 col-sm-offset-1">
                                    	<div class="row">
                                    		<div class="col-md-4 text-left"><i class="fa fa-weixin"></i><a href='#'>微信登录</a></div>
                                    		<div class="col-md-4 text-center"><i class="fa fa-qq"></i><a href='#'>QQ登录</a></div>
                                    		<div class="col-md-4 text-right"><i class="fa fa-weibo"></i><a href='#'>微博登录</a></div>
                                    	</div>
									</div>
                                </div> -->
								</form>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>
</body>

<script type="text/javascript">
	var flag = false;
	var userAgentInfo = navigator.userAgent;
	var Agents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad",
			"iPod" ];
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = true;
			break;
		}
	}
	if (flag) {
		var fs = $('.form-control');
		$.each(fs, function() {
			$(this).css('height', '40px');
		});

		$('#phoneTop').addClass('p-l-r-20');
		$('#step1_btn').css('height', '40px');

	} else {
		$('#login_div').addClass('login_div');
	}

	/* window.onload = function() {
		var un = document.getElementById('form-username'), pw = document
				.getElementById('form-password');
		un.oninput = function() {
			errorMsg.style.display = 'none';
		}
	} */
	/* localStorage.clear(); */
</script>


</html>