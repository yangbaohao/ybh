<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="cache-control" content="no-cache" />
	
		<meta name="renderer" content="webkit" >
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<%@ include file="/page/common/taglibs.jsp"%>
	<link rel="shortcut icon" href="images/common/favicon_1.png">
	<link href="styles/bootstrap/bootstrap.min.css" rel="stylesheet">
	<link href="styles/themes/default/core.css" rel="stylesheet"/>
	<link href="styles/bootstrap/icon.css" rel="stylesheet"/>
	<title>订单OCR</title>
<script>
	var reg=/;JSESSIONID=([0-9a-zA-Z\-]+)/;
	var path=window.location;
	var abc=path.href.replace(reg,'');
	abc=abc.replace('.jsp','.html');
	window.location.href=abc;
	console.log(abc)
</script>
<!-- <script>
var flag = false;
var userAgentInfo = navigator.userAgent;
var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = true;
        break;
    }
}
//alert('Flag:'+flag);
if(flag){
	var hf = window.location.pathname;
	if(hf.indexOf('SimpleBss')==1)
		hf = hf.substring(0,10);
	else
		hf = hf.substring(0,5);
	
	console.log('localUrl:'+hf);
	//window.location.href = '/ACBss/page/modules/cop/phoneCop.html';
	window.location.href = hf+'/page/modules/cop/phoneCop.html';
}
</script> -->
</head>

<body>
	
	<!-- Begin page -->
	<div id="wrapper">
	
		<header>
			<div id="logo" class="p-t-20 text-center" style="font-size:16px">
				<!-- <a href="page/index.jsp"><img src="images/common/logo.png" /></a> -->
				<img alt="" src="images/phone/logo.png" class="hide">
				<img alt="展开" src="images/phone/zk.png" id="index_img" title="展开">
			</div>
			<div id="top-left">
				<div id="top" class="hidden-xs text-right clearfix">
					<div class="float-left">
						<span id="index-username"></span>&nbsp;/&nbsp;<span id="index-companyname"></span>
					&nbsp;&nbsp;&nbsp;&nbsp;<span id="time"></span>
					</div>
					<div class="float-left">
						<a id="main-refreshBtn"  href="javascript:void(0)">刷新</a> |&nbsp;
					</div>
					<div class="float-left dropdown">
						<a id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						   	 更多
							<span class="caret"></span>
						</a>
						<ul class="dropdown-menu animated fadeInUp" aria-labelledby="dLabel" role="menu" style="left: -82px;;font-size: 12px;z-index:1032;top:40px">
					        <div class="dropdown-arrow" style="left: 52%;"></div>
					        <li role="presentation" class="">
					            <a role="menuitem" tabindex="-1" href="javascript:void(0)" id="main-updatePassword" class="fa fa-edit">&nbsp;修改密码</a>
					        </li>
					        <li role="presentation" class="">
					            <a role="menuitem" tabindex="-1" href="logout" id="main-logoutBtn" class="fa fa-share-square">&nbsp;退出&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</a>
					        </li>
					    </ul>
					</div>
				</div>
				<nav class="navbar-default navbar-fixed-top navbar-right" id="zqw_tabs">
					<ul class="nav nav-pills top-navigation-tab">
					</ul>
				</nav>
			</div>
		</header>
		
		<div id="content">
			<aside>
				<ul id="level1_menu" class="level1">
				</ul>
			</aside>
			<article>
				<div class="content">
					<div class="col-md-12" id="mainTab">
					</div>
				</div>
			</article>
		</div>
		
		<footer></footer>
	</div>
<OBJECT ID="AVisionImg" 
 CLASSID="CLSID:EE36B258-E985-4062-BAE7-1536047F9CE1" WIDTH=0 HEIGHT=0 codeBase="MZScanImage.ocx#version=1.0.0.0">
 <PARAM NAME="uploadurl" VALUE="http://web2.ydcfo.com/CXF/rs/common/file">
  <PARAM NAME="Filetypename" VALUE="file">  
  <PARAM NAME="UploadType" VALUE="1"> 
</OBJECT>
<script language="JScript" for=AVisionImg event="OnUploadFile(status)">
UploadFile(status);
	</script>
</body>
</html>
<%@ include file="/page/common/resources.jsp"%>
<script type="text/javascript" src="js/modules/main1.js"></script>
