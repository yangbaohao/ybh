<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<%@ include file="/page/common/taglibs.jsp"%>
	<link href="styles/bootstrap/bootstrap.min.css" rel="stylesheet">
	<link href="styles/bootstrap/core.css" rel="stylesheet"/>
	<link href="styles/bootstrap/me.css" rel="stylesheet"/>
	<link href="styles/bootstrap/icon.css" rel="stylesheet"/>
	<link href="styles/bootstrap/pages.css" rel="stylesheet" type="text/css" />
    <link href="styles/bootstrap/responsive.css" rel="stylesheet" type="text/css" />
    <link href="styles/bootstrap/components.css" rel="stylesheet" type="text/css" />
    <link href="styles/bootstrap/bootstrap-responsive.min.css"/>
	<%@ include file="/page/common/resources.jsp"%>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="cache-control" content="no-cache" />
	<style type="text/css">
	.content{min-height:700px;}
	</style>
	<title>秒账</title>
	<!--[if lt IE 9]>
    <script src="js/common/html5shiv.js"></script>
    <script src="js/common/respond.min.js"></script>
    <![endif]-->
    <script type="text/javascript" src="js/common/address.js"></script>
    <script type="text/javascript" src="js/modules/main.js"></script>

</head>
<body class="fixed-left">

<!-- 左侧菜单 -->
<div class="left side-menu">
    <div id="left">
          
    </div>
</div>

	<!-- Begin page -->
	<div id="wrapper">
	
		<!-- Start right Content here -->
		<!-- ============================================================== -->
		<div class="content-page">
			<div class="navbar navbar-default navbar-fixed-top right-nav">
			  <div class="container right-menu">
			  	<div class="row" style="padding:0;margin:0">
				  <div class="four-icon-box" style="float:left;padding:0;">
	
	                <div class="btn-group three-icons" style="background:transparent;">
	                    <button class="btn-white dropdown-toggle p-0" id="left-receiptBtn"
	                            data-toggle="dropdown" aria-expanded="false"
	                            style="background:transparent;">
	                           <!--  <span class="caret"></span> -->
	                        <i class="md-note-add text-white"></i>
	                    </button>
	                    <div class="dropdown-menu p-0 m-0" role="menu"  aria-labelledby="dropdownMenu1"
	                         style="width:155px;background:#EEEEEE;" id="receipt">
	                        <span id="top"></span>
	                    </div>
	                </div>
	
	                <div class="btn-group three-icons" style="background:transparent;">
	                    <button class="btn-white dropdown-toggle p-0" style="background:transparent;">
	                        <i class="md-star text-white text-white"></i>
	                    </button>
	                </div>
	                
	                 <div class="btn-group  three-icons" title="刷新缓存" style="background: transparent;height:40px;">
	                    <button class="btn-white dropdown-toggle p-0" id="main-refreshBtn" style="background:transparent;">
	                        <i class="md-autorenew text-white"></i>
	                    </button>
	                </div>
	            </div>
	            <!-- <div class="col-md-4"></div> -->
	            
            	<div style="padding:0;float:right;">
		            <div class="btn-group three-icons" title="退出登录" style="background: transparent;float:right !important;width:40px;">
		                    <a class="btn-white p-0" id="main-logoutBtn"
		                            style="background:transparent;" href="logout">
		                        <i class="md-exit-to-app text-white"></i>
		                    </a>
		             </div>
		             <div class="showtime-box hidden-xs hidden-sm" style="float:right;padding:0px 40px;background:transparent;"><span id="index-username"></span>&nbsp;/&nbsp;<span id="index-companyname"></span></div>
		             <div class="showtime-box hidden-xs hidden-sm" style="float:right;padding:0px 40px;text-align:right;">
			            <span id="time">2016年4月2日 星期六</span>
		            </div>
	            </div>
	            </div>
	            <!-- <div class="col-md-1" style="height:100%;background:#000;"></div> -->
	            
	            <div id="zqw_tabs_wrapper" class="row" style="padding:0;margin:0;background:#ccc;">
	            
	            <div id="zqw_tabs" style="float:left;width:95%; overflow-x:hidden">
				  	<ul class="nav nav-pills top-navigation-tab" role="navigation" style="width:transparent;">
				  	<!-- <li>
				  	<a href="javascript:void(1)">新建报价单（BJ201401020099）</a>
				  	<i class="fa fa-remove close-tab"></i>
					</li>
				  	<li>
				  	<a href="javascript:void(1)">新建报价单（BJ201401020099）</a>
				  	<i class="fa fa-remove close-tab"></i>
				  	</li>
				  	<li>
				  	<a href="javascript:void(1)">新建报价单（BJ201401020099）</a>
				  	<i class="fa fa-remove close-tab"></i>
				  	</li> -->
				  	</ul>
				</div>
				<!-- <div style="float:right;">
					<ul class="nav nav-pills top-navigation-tab" role="navigation">
						<li>
					  	<button class="dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown">
					    	...<span class="caret"></span>
					  	</button>
					  	<ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
						  	<li role="presentation"><a role="menuitem" tabindex="-1" href="#">首页</a></li>
						    <li role="presentation" class="divider"></li>
						    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">关闭当前</a></li>
						    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">关闭所有</a></li>
						    <li role="presentation"><a role="menuitem" tabindex="-1" href="#">关闭其他</a></li>
					  	</ul>
					  </li>
					</ul>	  
				</div> -->
			  	</div>
	            
			  </div>
			  
			  
			</div>
			<div class="content" style="margin-top:80px;">
			<div class="col-md-12" id="mainTab">
				<ul>
					<li><i class='md-home'></i><span class="hidden-xs">首页</span></li>
				</ul>
				<div>
					<!-- tabContent -->
				</div>
			</div>
			</div>
			<!-- END content -->
		</div>
		<!-- END content-page -->
	</div>

</body>
</html>