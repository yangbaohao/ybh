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
	<link href="styles/bootstrap/icons.css" rel="stylesheet"/>
	<link href="styles/bootstrap/pages.css" rel="stylesheet" type="text/css" />
    <link href="styles/bootstrap/responsive.css" rel="stylesheet" type="text/css" />
    <link href="styles/bootstrap/components.css" rel="stylesheet" type="text/css" />
    <link href="styles/bootstrap/bootstrap-responsive.min.css"/>
	<%@ include file="/page/common/resources.jsp"%>
	<link href="styles/jqx.tab.title.css" rel="stylesheet" type="text/css" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv="cache-control" content="no-cache" />
	<title>中全网-云会计</title>
	<!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
    <script src="https://oss.maxcdn.com/libs/respond.js/1.3.0/respond.min.js"></script>
    <![endif]-->
    <script type="text/javascript">
    	
    	$.addTab = function(options){
    		var defaults = {tabs_ele:"mainTab",title:"",content:"",isFrame:false, url:""};
    		var settings = $.extend(true,defaults,options);
    		
    		if(settings.isFrame){
    			if(settings.url == ""){return;}
    			var iframe = '<iframe src="'+settings.url+'" name="tabReportItem" width="100%" height="100%" style="background:#fff;min-height:428px;margin:0px;padding:0px;overflow-y:none;overflow-x:none;" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"></iframe><br clear="all">';
    			$("#"+settings.tabs_ele).jqxTabs("addLast",settings.title,iframe);
    		}else{
    			if(settings.url == ""){
    				$("#"+settings.tabs_ele).jqxTabs("addLast",settings.title,settings.content);
    			}else if(settings.url == "#"){
    				$("#"+settings.tabs_ele).jqxTabs("addLast",settings.title,"<h2>"+settings.title+" is comming soon!</h2>");
    			}
    			else{
    				//采用Ajax方式加载页面，并将内容加入到content.
    				var temp_div = $("<div></div>");
    				temp_div.load( settings.url, function(res) {
	    				$("#"+settings.tabs_ele).jqxTabs("addLast",settings.title,res);
					});
    				temp_div.html("");
    				temp_div = null;
    			}
    		}
    		$("#"+settings.tabs_ele).jqxTabs('ensureVisible', $("#"+settings.tabs_ele).jqxTabs("length")-1);
    	}
    	
    	$.fn.extend({
    		addTab:function(){
    			$.addTab({title:$(this).html(),isFrame:false, url:$(this).attr("href")});
           		return false;
    		}
    	});
    		
         $(document).ready(function () {
        	 
        	//加载菜单页面，TODO:left菜单将通过json数据拼装
        	$("#left").load("page/common/left.html",function(){
        		$("ul li > a").click(function(){
    	       		$(this).addTab();
    	       		return false;
    	       	});  
        	});
         $("#time").text(new Date().format("yyyy年MM月dd日"));
        	//$("#mainTab").jqxTabs({width:"100%",height:"100%",scrollPosition: "both",showCloseButtons: true, theme : currentTheme});
        	$("#mainTab").jqxTabs({width:"100%",scrollPosition: "both",showCloseButtons: true, theme : currentTheme});
        	$("#mainTab").jqxTabs("hideCloseButtonAt", 0);
	       	
        	
        	/* $("#btnSearch").click(function(){
        		$.addTab({title:"test", content:"<div style='color:red'>nihao</div>"});
            	$.addTab({title:"用户管理",isFrame:true, url:ctx+"/page/sys/user_management.jsp"});
        	}); */
        	
        	
        	
    	});
    </script>
</head>
<body class="fixed-left">

<!-- 左侧菜单 -->
<div class="left side-menu">
    <div id="left">
        <!--- Divider 
        <div class="container" id="sidebar-menu" style="background: #34495E;">
            <div class="card-box m-b-0 p-b-0 hidden-xs">
                <img src="images/common/00.png" alt="" style="width: 90%;" />
            </div>
            <div class="visible-xs">
                <img src="images/common/00.png" alt="" style="width: 90%;" />
            </div>
            <div class="showtime-box hidden-xs">
                <i class="icon-calender"></i> <span id="time">2016年4月2日 星期六</span>
            </div>
            <div class="btn-group text-center hidden-xs hidden-sm yun-box">
                <i class="icon-settings text-white p-t-10 p-r-5"></i>
                <span class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">秒账云会计公司</span>
                <div class="dropdown-menu p-0 m-0" role="menu"
                     style="width:350px;background:#EEEEEE;position: absolute;top: 130%;left: 50%;">
				<span id="top" style=" border-left: 10px solid #9AA3AC;border-right: 10px solid #9AA3AC;"></span>

                <div class="p-20 container">
                        <div class="row">
                            <div class="col-md-6">
                                <b style="color:black;">设置</b>
                                <p><span class="hoverspan">公司设置</span></p>
                                <p><span class="hoverspan" onclick="addTab(24,'会计科目','#')">会计科目</span></p>
                                <p><span class="hoverspan" onclick="addTab(100,'凭证模板','#')">凭证模板</span></p>
                                <p><span class="hoverspan">付款方式</span></p>
                                <p><span class="hoverspan">货币种类</span></p>
                                <p><span class="hoverspan" onclick="addTab(25,'银行对账','#')" href="#">银行对账</span></p>
                                <p><span class="hoverspan" onclick="addTab(37,'导出数据','#')">导出数据</span></p>
                            </div>
                            <div class="col-md-6">
                                <b style="color:black;">工具</b>
                                <p><span class="hoverspan">账 号</span></p>
                                <p><span class="hoverspan">管理用户</span></p>
                                <p><span class="hoverspan">反馈</span></p>
                                <p><span class="hoverspan">退出登录</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="four-icon-box">

                <div class="three-icons" style="background: #596A7A;height:40px;">
                    <button class="btn-white dropdown-toggle p-0">
                        <i class="icon-clock text-white"></i>
                    </button>
                </div>

                <div class="btn-group three-icons" style="background: #7F8B99;">
                    <button class="btn-white dropdown-toggle p-0"
                            data-toggle="dropdown" aria-expanded="false"
                            style="background: #7F8B99;">
                        <i class="icon-plus text-white"></i>
                    </button>
                    <div class="dropdown-menu p-0 m-0" role="menu"
                         style="width:500px;background:#EEEEEE;position: absolute;top: 130%;left: 0;">
                        <span id="top"></span>

                        <div class="p-20 container">
                            <h4>创建单据</h4>
                            <div class="row">
                                <div class="col-md-4">
                                    <b style="color:black;">客户</b>
                                    <p><span class="hoverspan">发票</span></p>
                                    <p><span class="hoverspan">收款</span></p>
                                    <p><span class="hoverspan">报价</span></p>
                                    <p><span class="hoverspan">销售单</span></p>
                                    <p><span class="hoverspan">红字发票</span></p>
                                    <p><span class="hoverspan">退款</span></p>
                                </div>
                                <div class="col-md-4">
                                    <b style="color:black;">供应商</b>
                                    <p><span class="hoverspan">付款</span></p>
                                    <p><span class="hoverspan">采购订单</span></p>
                                    <p><span class="hoverspan">红字发票</span></p>
                                </div>
                                <div class="col-md-4">
                                    <b style="color:black;">其他</b>
                                    <p><span class="hoverspan">记字凭证</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="btn-group three-icons" style="background: #9AA3AC;">
                    <button class="btn-white dropdown-toggle p-0">
                        <i class="    md-star text-white      "></i>
                    </button>
                </div>

                <div class="btn-group three-icons" style="background: #B4BBC1;">
                    <button class="btn-white dropdown-toggle p-0"
                            data-toggle="dropdown" aria-expanded="false"
                            style="background: #B4BBC1;">
                        <i class="md-search text-white"></i>
                    </button>
                    <div class="dropdown-menu p-0 m-0" role="menu" style="width:300px;background:#EEEEEE;position: absolute;top: 130%;left: 0;">
                        <span id="top"></span>
                        <div class="p-20 container">
                            <div class="form-group has-feedback m-b-0">
                                <label class="sr-only" for="search">产品搜索：</label>
                                <input class="form-control" id="search" type="text" placeholder="搜素" />
                                <span class="glyphicon glyphicon-search form-control-feedback"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <ul>
                <li><a href="#" class="waves-effect"><i class="icon-home"></i><span class="hidden-xs">首 页</span> </a></li>

                <li><a href="${ctx }/page/sys/user_management.jsp" class="waves-effect"> <i class="icon-people"></i><span class="hidden-xs">客 户</span></a></li>

                <li><a href="${ctx }/page/sys/role_mgt.jsp" class="waves-effect"><i class="icon-user"></i><span class="hidden-xs">供应商</span> </a></li>
                <li><a href="${ctx }/page/test/testContent.html" class="waves-effect"><i class="icon-user"></i><span class="hidden-xs">测试内容</span> </a></li>

                <li class="has_sub"><a href="" class="waves-effect"><i class="md-assignments"></i><span class="hidden-xs">购销记录</span> </a>
                    <ul class="list-unstyled">
                        <li><a href="#" class="waves-effect">凭证</a></li>
                        <li><a href="#" class="waves-effect">入账</a></li>
                        <li><a href="#" class="waves-effect">出账</a></li>
                        <li><a href="#" class="waves-effect">送货</a></li>
                        <li><a href="#" class="waves-effect">收货</a></li>
                    </ul>
                </li>

                <li><a href="#" class="waves-effect"><i class="icon-drawar"></i><span class="hidden-xs">产品/服务 </span> </a></li>
                <li><a href="#" class="waves-effect"><i class="icon-layers"></i><span class="hidden-xs">库 存</span> </a></li>
                <li><a href="#" class="waves-effect"><i class="icon-grid"></i><span class="hidden-xs">固定资产</span> </a></li>
                <li><a href="#" class="waves-effect"><i class="icon-chart"></i><span class="hidden-xs">报 表</span> </a></li>
                <li><a href="#" class="waves-effect"><i class="icon-user-follow"></i><span class="hidden-xs">员 工 </span> </a></li>
                <li class="has_sub"><a href="#" class="waves-effect"><i class="icon-settings"></i><span class="hidden-xs">设置</span> </a></li>
                <li class="has_sub"><a href="#" class="waves-effect"><i class="icon-question" style=:"padding-left:0;"></i><span class="hidden-xs">帮 助</span> </a></li>
            </ul>
        </div>-->
    
    </div>
</div>

	<!-- Begin page -->
	<div id="wrapper">
	
		<!-- Start right Content here -->
		<!-- ============================================================== -->
		<div class="content-page">
			<div class="content">
			<div class="col-lg-12" id="mainTab">
				<ul>
					<li><i class='icon-home'></i>首页</li>
				</ul>
				<div>
					<!-- tabContent -->
				</div>
			</div>
			</div>
			<!-- END content -->
			<div style="padding:20px;"></div>
		</div>
		<!-- END content-page -->
	</div>

</body>
</html>