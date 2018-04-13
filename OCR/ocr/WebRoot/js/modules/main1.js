/**
 * 
 * 登录之后的主界面功能js，工程中所有的js皆在此匿名函数下运行。
 * 
 */
var _global_settings = {id:Core.randNum(),js_path:"/js",html_path:"/page"};

(function(_global_settings){
	
	_global_settings.service = {};
	_global_settings.service.url = ws_url+"/CXF/rs";
//	_global_settings.service.url = "/CXF/rs";
	_global_settings.owner = {};
	
	if(window.location.host.indexOf('localhost')==-1) {
		_global_settings.service.url = "/CXF/rs";
	}
	
	/*
	 * 1、对于Tab 需要维护一tab列表数组用于记录tab的title和index
	 * 2、对于左侧菜单的a, 读取href的地址，将html片断采用Ajax方式载入，并添加到tab里。
	 */
	
		var js_path = _global_settings.js_path;
		var html_path = _global_settings.html_path;
		var left = "page/common/left.html";
//		left = "page/test/testLeft.html";
		
		var zqwTabMgt = new ZqwTab_Mgt();
		_global_settings.zqwTabMgt = zqwTabMgt;
		var main_Tab = "mainTab";
		
		//用于记录当前打开的tab数组:格式如[{index:0,title:"title0"},{index:1,title:"title1"}]
		var tab_array = [];
		var js_array = [];
		
	
		$(document).ready(function () {
	   	 	//resources.jsp下面的js在此处加载
			
			//加载菜单页面，获取当前登录用户权限，控制是否显示某些菜单。
//			company();

			var date=new Date();
			var arr=['日','一','二','三','四','五','六'];
			var sb=date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日 星期'+arr[date.getDay()];
			
			$('#time').html(sb);	
			
			//点击我的bss
//			if(_global_settings.owner.roleName=='Sys_Admin'){
//				$('#main-myBss').removeClass('hide').off('click').on('click',function(){
//					$.addTab({title:'我的bss',url:'page/modules/sys/myBss.html',reload:true});
//				});	
//			}
//	    	else
//	    		$('#main-myBss').css('display','none');
//			$('#main-myBss').on('click',function(){
//				$.addTab({title:'我的bss',url:'page/modules/sys/myBss.html',reload:true});
//			});
//			debugger;
//			var alink = $('#main-changeLanguage');
//			if(_global_settings.owner.roleName=='taxStaffadmin' || _global_settings.owner.roleName=='taxStaff'){
//				alink.css('display','inline-block');
//			}else{
//				alink.css('display','none');
//			}
//			alink.off('click').on('click',function(){
//				localStorage.setItem(alink,alink.text());
//				localStorage.getItem(alink);
//				if(localStorage.getItem(alink)=='英文'){
//					Core.alert({
//						title: '提示',
//						message: '当前状态是中文状态,<br />切换到英文状态,报表和账簿都将以英文呈现！是否继续切换？',
//						callback:function(){
//							alink.text('中文');
//							window.location.reload();
//						}
//					});
//				}
//				if(localStorage.getItem(alink)=='中文'){
//					Core.alert({
//						title: '提示',
//						message: '当前状态是英文状态,<br />切换到中文状态,报表和账簿都将以中文呈现！是否继续切换？',
//						callback:function(){
//							alink.text('英文');
//							window.location.reload();
//						}
//					});
//				}
//			});
//			
//			if(localStorage.getItem(alink)=='英文'){
//				alink.text('中文').attr('title','点击切换到'+alink.text()+'状态');
//			}else if(localStorage.getItem(alink)=='中文'){
//				alink.text('英文').attr('title','点击切换到'+alink.text()+'状态');
//			}else if(localStorage.getItem(alink)==null){
//				alink.attr('title','点击切换到'+alink.text()+'状态');;
//			}
			
			//刷新缓存按钮事件
//			$("#main-refreshBtn").on({
//				"click":function(){
//					var html = $("#main-refreshBtn").html();
//					ComboBoxSources.loadAll();
//				}
//			});
			
			var refreshEvent=function(){
				var arr=[];
				var nodelist=$('#zqw_tabs').find('li');
				var len = nodelist.length;
				for(var i=0;i<len;i++){
					console.log(nodelist.eq(i).data('map'))
					arr.push(nodelist.eq(i).data('map'));
				}
				console.log(arr.toString());
				localStorage.map=[];
				localStorage.owner=_global_settings.owner.username;
				localStorage.map=JSON.stringify(arr);
				localStorage.index=$('#zqw_tabs').find('li.active').index()
				window.onbeforeunload = function(e){}
				window.location.href=window.location.href;
			};
//			window.refreshEvent=refreshEvent;
						
			//刷新缓存按钮事件
			$("#main-refreshBtn").on({
				"click":function(){
					delete localStorage.map;
					delete localStorage.index;
					refreshEvent();
					//ComboBoxSources.loadAll();
				}
			});
			
			var menuMgt = new MenuMgt();
			menuMgt.initUserPermissions();
			menuMgt.initLeftMenu();
			
			company();
			//是否显示子代理
//			if(_global_settings.owner.senior=='false'){
//				$('#level1_2').remove();
//			}
			
			//修改密码
			$('#main-updatePassword').off('click').on('click', function(){
				if($('#segment-updatePassword').length==0){
					$.get('page/common/segment/updatePassword.html',function(res){
						$(res).appendTo($('body'));
						$('#segment-updatePassword').modal('show');
						timeOut(function(){
							$('#segment-updatePassword').find('input').val('')
						},200)
						
					});
				}else{
					$('#segment-updatePassword').modal('show');
					timeOut(function(){
						$('#segment-updatePassword').find('input').val('')
					},200)
				}
			});
			
			var html = $("<img style='position: fixed;display:none;z-index: 50000;' id='floatImg' src=''/>");
			var html2 = $("<img style='position: fixed;display:none;z-index: 50000;background-color:#f4f2f2' id='grid_test_img' src=''/>");
			$('body').append(html).append(html2);
			
			$('#level1_menu>li').eq(0).addClass('active');
			
			$(".level1 > li > a").click(function(e){
				//e.preventDefault();
				$(".level1 > li").removeClass("active");
				$(this).parent().addClass("active");
				var li_id = $(this).parent().attr("id").substring(7);
				if($(this).parent().hasClass("has_sub")==false){
					$(".level2").animate({width:"0"},200);
					return $(this).addTab();
				}else{
					$(".level2").animate({width:"0"},200);
					$("#level2_"+li_id).animate({width:"120px"},200);
				}
				return false;
			});
			$(".level2 > li  >a").click(function(e){
				$(".level2 > li").removeClass("active");
				$(this).parent().addClass("active");
				return $(this).addTab();
//				e.preventDefault();
			});
			
			$("#mainTab").on({
				"created":function(e){
					var zqw_tabs = $("#zqw_tabs");
					var tabs = zqw_tabs.find("ul li");
					var l = tabs.length;
	   				for(var index=0;index<l;index++){
	   					var tab_item = {};
	   					tab_item.index = index;
	   					tab_item.title = tabs.eq(index).text().trim();
	   					tab_array.push(tab_item);
//	   					zqwTabMgt.tab_array.push(tab_item);
	   				}
	   				
	   				console.log('created event,'+tab_array.length);
				},
				"add":function(e,p,title,content){
					console.log(e+'-'+p+'-'+title);
					tab_array = [];
					var zqw_tabs = $("#zqw_tabs");
					var tabs = zqw_tabs.find("ul li");
					var l = tabs.length;
			   		
	   				for(var index=0;index<l;index++){
	   					var tab_item = {};
	   					tab_item.index = index;
	   					tab_item.title = tabs.eq(index).text().trim();
	   					
	   					tabs.eq(index).attr('title',tabs.eq(index).text().trim());
	   					
	   					tab_array.push(tab_item);
	   				}
	   				
	   				if(l>9){
			   		}
	   				
	   				var abc = $('.active').eq(0).data('map');

                    if (abc != null && abc.read == false) {
                        var title = abc.title;
                        var url = abc.url;
                        var pk = abc.pk;
                        if (localStorage.index == null) {
                            abc.read = null;
                            $.addTab({ title: title, url: url, pk: pk, map: abc, reload: true });
                        }
                    }
	   				
	   				console.log('add event '+p+','+tab_array.length);
				},
				"removed":function(e,ind){
					tab_array = [];
					var zqw_tabs = $("#zqw_tabs");
					var tabs = zqw_tabs.find("ul li");
					var l = tabs.length;
	   				for(var index=0;index<l;index++){
	   					var tab_item = {};
	   					tab_item.index = index;
	   					tab_item.title = tabs.eq(index).text().trim();
	   					
//	   					tabs.eq(index).removeAttr('title');
	   					
	   					tab_array.push(tab_item);
	   				}
	   				
	   				console.log('removed event '+ind+','+tab_array.length);
				},
				"selected":function(e,index){
					console.log('selected event '+index+','+tab_array.length);
					var node = $('.zqw_refreshGrid');
					$.each(node,function(){
						if(!$(this).is(':hidden')){
							var grid_id=$(this).attr('id');
							try{
								$("#"+grid_id).jqxGrid('updatebounddata', 'cells');	
								$("#"+grid_id).jqxGrid('clearselection');
							}catch(e){}
						}
					});
					
					var abc = $('.active').eq(0).data('map');

                    if (abc != null && abc.read == false) {
                        var title = abc.title;
                        var url = abc.url;
                        var pk = abc.pk;
                        if (localStorage.index == null) {
                            abc.read = null;
                            $.addTab({ title: title, url: url, pk: pk, map: abc, reload: true });
                        }
                    }
				},
			});
			
//			if(_global_settings.owner.roleName=='taxStaff'||_global_settings.owner.roleName=='taxStaffadmin'){
//				$.addTab({title:'客户管理',url:'page/modules/user/userbMgt.html',reload:true});
//				$(".level1 > li").eq(0).addClass("active");
//			} else if(_global_settings.owner.roleName=='loanaudit') {
//				$.addTab({title:'项目审核',url:'page/modules/ps/proAudit.html',reload:true});
//				$(".level1 > li").eq(0).addClass("active");
//			} else {
//				$.addTab({title:'用户管理',url:'page/modules/user/userMgt.html',reload:true});
//				$(".level1 > li").eq(1).addClass("active");
//			}
			
			$("#mainTab").trigger($.Event("created"));
		});
		
		$(document).keydown(function(event){
			var target = event.target;
			
			if ((event.altKey)&&((event.keyCode==37)||(event.keyCode==39))){ 
				event.returnValue=false; 
				return false;
			}
			
			//屏蔽后退键 
			if(event.keyCode==8 && target.type != "password" && target.type != "text" && target.type!= "textarea"){
				return false;  
			}

			//屏蔽F5刷新键 
//			if(event.keyCode==116){
//				return false; 
//			}
			
			//屏蔽回车键
			if(event.keyCode == 13){
				var node = $('.searchBtn');   
				$.each(node,function(){
					if(!$(this).is(':hidden')){
						event.preventDefault();
						$(this).trigger('click');
						return false;
					}
				});
				return ;
			}
		});
		
		/**
		 * 将内容添加到tab末尾并展现。
		 * 将内容添加到tab首，第1位，注意：第0位是首页
		 * @param {Object}
		 *            options.tabs_ele 目标tab的id
		 * @param {String}
		 *            options.title 当前tab的title
		 * @param {String}
		 *            options.content 插入到tab内容（html,text）
		 * @param {boolean}
		 *            options.isFrame 是否以iFrame的形式插入到tab
		 * @param {String}
		 *            options.url 如果是iFrame为true,将加载打开url链接;如果iFrame为false，将load目标连接
		 */
		$.addTab = function(options){
//			console.log(tab_array);
    		var defaults = {tabs_ele:main_Tab,title:"",content:"",isFrame:false, url:"",reload:false,position:0};
    		var settings = $.extend(true,defaults,options);
    		
    		//默认在active之后打开，如果position 为大于0的值，则在最后打开。
    		if(settings.position == 0 ){
    			settings.position = zqwTabMgt.selectedIndex();
    		}else{
    			settings.position = 0;
    		}
    		
    		var addContent = function(){
    			//如果没有添加过，则到获取html添加到主tab.
    			if(settings.url === "" || settings.url == "#"){//url为空，直接将内容添加到tab
    				zqwTabMgt.addTab(settings.position,settings.title,settings.content,settings.map);
//    				permission_func();
    			}
    			else{
    				//采用Ajax方式加载页面，并将内容加入到content.
    				var temp_div = $("<div></div>");
    				$.pk=settings.pk;
    				$.ajax({
    					url : settings.url,
    					cache : true,
    					async:false,
    					type : 'get',
    					dataType : 'html',
    					success : function(res) {	
    						$.timeOutCookie(res);
    						var map={};
	    						map.pk=$.pk;
	    						map.title=settings.title;
	    						map.url=settings.url; 
    						zqwTabMgt.addTab(settings.position,settings.title,res,map);
    						if(settings.callback)
    							timeOut(settings.callback);
    					},
    					error : function() {
    						
    					}
    				});
    				temp_div.html("");
    				temp_div = null;    				
    			}
    		};
    		
    		var reloadContent = function(tab_index){
    			if(settings.url === "" || settings.url == "#"){//url为空，直接将内容添加到tab
    				zqwTabMgt.setContent(tab_index,settings.content);
    			}
    			else{
    				//采用Ajax方式加载页面，并将内容加入到content.
    				var temp_div = $("<div></div>");
    				$.pk=settings.pk;
    				$.ajax({
    					url : settings.url,
    					cache : true,
    					async:false,
    					type : 'get',
    					dataType : 'html',
    					success : function(res) {
    						$.timeOutCookie(res);
    						zqwTabMgt.setContent(tab_index,res);
    						if(settings.callback)
    							timeOut(settings.callback);
    					},
    					error : function() {
    						
    					}
    				});
    				temp_div.html("");
    				temp_div = null;    				
    			}
    		};
    		
    		if(settings.isFrame){//iFrame不判重复，可多次添加
    			if(settings.url === ""){return;}
    			var iframe = '<iframe src="'+settings.url+'" name="tabReportItem" width="100%" height="100%" style="background:#fff;min-height:768px;margin:0px;padding:0px;overflow-y:none;overflow-x:none;" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"></iframe><br clear="all">';
    			zqwTabMgt.addTab(settings.position,settings.title,iframe);
    		}else{
    			//添加一个tab，需要遍历tab_array，判断其是否已经添加过
    			var is_duplicate = false;
    			for(var index = 0;index < tab_array.length;index++){
    				var obj = tab_array[index];
    				var mytitle = "";
    				var stitle =settings.title;
    				
//    				if(settings.title.indexOf('/')>-1)
//    					stitle=settings.title.replace('/','');
    				
//    				console.log(settings.title);
    				
//    				if($(stitle).length>0){
//    					mytitle = $(stitle).text().trim();
//    				}else{
    					mytitle = stitle.trim();
//    				}
    				if(obj.title == settings.title.trim()){
    					is_duplicate = true;
    					
//    					permission_func();
    					if(settings.reload === true){
    						//如果需要重新加载，则重新设置内容
    						reloadContent(obj.index);
    					}
    					//如果已经添加过，则直接打开该tab.
    					zqwTabMgt.clickTab(obj.index);
    					break;
    				}
    			}
    			if(!is_duplicate){
    				addContent();
    			}
    		}
    	};
		
    	/**
    	 * 关闭当前打开的tab或者关闭tab_index的tab
    	 */
    	$.closeTab = function(tab_index){
    		setPara();
    		if(tab_index === undefined) {
//    			tab_index = $("#"+main_Tab).jqxTabs("selectedItem");
    			tab_index = zqwTabMgt.selectedIndex();
    		}
    		if(tab_index != 0){
    			zqwTabMgt.removeTab(tab_index);
    		}
//    		$("#"+main_Tab).jqxTabs('removeAt', tab_index);
    	};
    	
    	$.addTabCloseEvent = function(handler){
    		zqwTabMgt.addCloseEvent(zqwTabMgt.selectedIndex(),handler);
    	};
		
		/**
		 * 动态获取javascript并执行回调函数
		 */
		$.loadScript = function(js_url,callback){
			callback = callback===undefined?function(){}:callback;
			var flag = false;
			$.each(js_array,function(i,v){
				console.log(v);
				if(v == js_url){
					flag = true;
				}else{
					console.log(v);
				}
			});
			if(!flag)
			$.getScript( js_url,function(){callback();});
			else callback();
			return false;
		};
		
		/**
		 * 获取html模板
		 */
		$.loadHtml = function(html_url,title){
			var temp_div = $("<div></div>");
			temp_div.load( html_url, function(res) {
				$.timeOutCookie(res);
				try{
					var map={};
						map.title=title;
						map.url=html_url+'?v='+version_html; 
					$.addTab({title:title,isFrame:false, url:"",content:$(this).html(),reload:true,map:map});	
//					permission_func();
				}catch(e){
					alert(e);
				}
			});
		};
		
    	
		/**
		 * 针对Dom的添加Tab的方法
		 * 此处实现从template获取内容然后加载到tab
		 */
    	$.fn.extend({
    		addTab:function(){
    			var url = $(this).attr("href");
    			if(url === undefined) url = "";
    			
    			if(url==="" || url =="#"){
    				
    				$.addTab({
    					title:$(this).html(),
    					isFrame:false, 
    					url:url, 
    					content:"<div class='content'><h2>"+ $(this).html()+" is comming soon!</h2></div>",
    					reload:true
    					});
    				
    			}else if($(this).attr("flag")=="iframe"){
    				
    				if(url==="" || url=="#") {
    					Core.alert({message:"iframe的url非法"});
    					return false;
    				}
    				$.addTab({title:$(this).text(),isFrame:true, url:url,reload:true});
    			}else if(url.indexOf("http://")===0){
    				$(this).attr("target","_blank");
    				return true;
    			}else{
    				var title = $(this).text();
    				$.loadHtml(url,title);
    				return false;
    			}
           		return false;
    		}
    	});
    		
})(_global_settings);

/**
 * 菜单管理类
 */
var MenuMgt = function(){
	
	var me = this;
	
	//所有的左侧菜单定义
	this.menus =  [
		{id:0,name:"总览",icon:"md-home",href:"page/modules/home.html",iframe:false,permission:"all"},
		{id:1,name:"用户管理",icon:"md-group",href:"page/modules/user/userMgt.html",iframe:false,permission:"ocruser"},
		{id:2,name:"业绩报表",icon:"md-format-align-right",href:"page/modules/sys/report.html",iframe:false,permission:"ocrreport"},
		{id:3,name:"员工管理",icon:"md-account-box",href:"page/modules/sys/sysMgt.html",iframe:false,permission:"ocrperson"},
		{id:4,name:"业务日志",icon:"md-assignment",href:"page/modules/sys/operationLog.html",iframe:false,permission:"ocrlog"},
		{id:5,name:"附件存档",icon:"md-folder-open",href:"page/modules/sys/fileMgt.html",iframe:false,permission:"ocrattachment"},
//		{id:6,name:"测试",icon:"md-description",href:"page/modules/sys/grid.html",iframe:false,permission:"*"},
//		{id:7,name:"图片",icon:"md-description",href:"page/modules/sys/image.html",iframe:false,permission:"*"},
	];
	
	//当前登陆用户的所有权限字符串数组
	this.permissions = [];
	
	//初始化左侧菜单
	this.initLeftMenu = function(){
		var myMenus = [];
		$.each(me.menus,function(index,menu){
//			if(menu.permission==="*" || $.inArray(menu.permission, me.permissions)>=0){
			if(menu.permission==="*" || me.permissions.toString().indexOf(menu.permission+':')>=0){
				if(menu.child != undefined){
					me.initLeftChildMenu(menu.child);
				}
				myMenus.push(menu);
			}
		});
		var aside = $("aside");
		var ul = $('#level1_menu');
		
		//处理菜单
		$.each(myMenus,function(i,menu){
			var parent_li = $('<li id="level1_'+menu.id+'"><a href="'+menu.href+'" '+(menu.iframe==true?'flag="iframe"':'')+'><i class="'+menu.icon+'"></i><span class="hide">'+menu.name+'</span></a></li>');
			if(menu.child != undefined){
				//处理子菜单，将菜单加到对应的父亲上
				var flag = false;
				var sub_ul = $('<ul class="level2" id="level2_'+menu.id+'" style="width:0;display:block"><li>'+menu.name+'</li></ul>');
				$.each(menu.child,function(i,v){
					if(v.delFlag == false){
						$('<li id="level2_"'+v.id+'"><a href="'+v.href+'" '+(v.iframe==true?'flag="iframe"':'')+'>'+v.name+'</a></li>')
						.appendTo(sub_ul);
						flag = true;
					}
				});
				if(flag === true){
					parent_li.addClass("has_sub");
					sub_ul.appendTo(aside);
				}
			}
			parent_li.appendTo(ul);
		});
		
		leftMenuHover();
		
	};
	
	//左侧菜单事件绑定
	this.eventBind = function(){
		
		$(".level1 > li > a").click(function(e){
//			e.preventDefault();
			$(".level1 > li").removeClass("active");
			$(this).parent().addClass("active");
			var li_id = $(this).parent().attr("id").substring(7);
			if($(this).parent().hasClass("has_sub")==false){
				$(".level2").animate({width:"0"},200);
			}else{
				$(".level2").animate({width:"0"},200);
				$("#level2_"+li_id).animate({width:"120px"},200);
			}
		});
		$(".level2 > li  >a").click(function(e){
//			e.preventDefault();
			$(".level2 > li").removeClass("active");
			$(this).parent().addClass("active");
		});
	};
	
	
	this.initLeftChildMenu = function(menus){
		$.each(menus,function(index,menu){
			if(menu.permission == undefined) menu.permission = "*";
			//if($.inArray(menu.permission, me.permissions) < 0){
			if( me.permissions.toString().indexOf(menu.permission+':') < 0){
				menu.delFlag = true;
			}else{
				menu.delFlag = false;
			}
			if(menu.permission === "*"){
				menu.delFlag = false;
			}
		});
	};
	
	//获取用户权限
	this.initUserPermissions = function(){
		Core.AjaxRequest({
            url : ws_url+"/CXF/rs/resource/permission/type/all",//URL待定
            type: "GET",
            showMsg: false,
            async: false,
            callback: function(res) {
            	permission=res;
            	//将所有权限字符串push到permissions
            	$.each(res,function(index,v){
//            		console.log("UUUUU"+v);
            		if(v != undefined){
            			me.permissions.push(v);
            		}
            	});
            	//me.permissions.sort();
            	me.permissions = $.unique(me.permissions);
            },
            failure:function(res){
            }
        });
	};
			
};
