// WebService请求地址
//var web_service_name = "/longrender-ws";
//var ws_url = "http://" + window.location.host + web_service_name;// 发布使用的url

var Core = {};
//var journalUrl=null;

Core.fileAjaxRequest = function (settings){
	var nodelist=$('.uploader-list');
	var msg=null;
	$.each(nodelist,function(i,e){
		console.log($(e).is(':hidden'));
		if(!$(e).is(':hidden')){
			if($(e).find('.state').text().indexOf('等待上传')>-1){
				msg="系统检测到有附件没有上传,继续操作将不会保存附件,是否继续操作？";
				return false;
			}else if($(e).find('.state').text().indexOf('上传中')>-1){
				msg="系统检测到有附件正在上传,继续操作将不会保存附件,是否继续操作？";
				return false;
			}
		}
	})
	if(msg!=null&&settings.checkFile!==false&&(settings.type=='POST'||settings.type=='PUT')){
		setTimeout(function(){
			Core.confirm({
				 message:msg,
				 confirmCallback:function(){
					 Core.AjaxRequest(settings);
				 }
			})
		},200);
	}else{
		Core.AjaxRequest(settings);
	}	
};

/**
 * Ajax请求方法
 * 
 * @param {Object}
 *            settings.params 参数对象，必须
 * @param {Object}
 *            settings.async 是否异步提交
 * @param {String}
 *            settings.url 请求地址，必须
 * @param {Function}
 *            settings.callback 成功后回调方法，必须
 * @param {boolean}
 *            settings.showMsg 处理成功时，是否显示提示信息 true:显示 false:不显示
 * @param {boolean}
 *            settings.showWaiting 是否显示等待条 true:显示 false:不显示
 * @param {Number}
 *            settings.timeout 超时时间
 * @param {String}
 *            settings.successMsg 成功消息
 * @param {String}
 *            settings.failureMsg 失败消息
 */
Core.AjaxRequest = function (settings) {
    // 参数对象
    var params = settings.params === undefined ? null : settings.params,
    showWaiting = settings.showWaiting === undefined ? true : settings.showWaiting,
    showMsg = settings.showMsg === undefined ? true : settings.showMsg,
    async = settings.async === undefined ? true : settings.async,
    dataType = settings.dataType === undefined ? "json" : settings.dataType, 
    type = settings.type === undefined ? "POST" : settings.type,
    contentType = settings.contentType === undefined ? "application/json; charset=UTF-8" : settings.contentType,
    cache = settings.cache === undefined ? true : settings.cache,
    timeout = settings.timeout === undefined ? 60 * 1000 : settings.timeout,
	waiting = null;//TODO 测试后删除该变量

    if (showWaiting) {
    	waiting = 1;
    	if($("#alertWindow").length > 0){
    		$("body").find("#cover_div").remove();
    	}
    	var div = "<div id='cover_div' style='position:absolute;top:0px;left:0px;width:100%;height:100%;background:#b1b1b1;filter:Alpha(Opacity=10);/* IE */-moz-opacity:0.1;/* Moz + FF */opacity: 0.1;z-index:999999'><img src=images/common/loading6.gif style='position:absolute;top:48%;left:48%'/></div>";
    	$("body").append(div);
    	$("#cover_div").find('img').css('top',($(window).height()-20)/2+$(document).scrollTop())
    }
    
    // 发送请求
    jQuery.ajax({
    	contentType : contentType,
        url: urlAddRandom(settings.url),
        type: type,
        data: JSON.stringify(params),
        async: async,
        dataType: dataType,
        beforeSend: function(XMLHttpRequest) {
        },
        cache : cache,
        timeout: timeout,
        success: function (result, textStatus) {
            if (waiting != null) {
            	clearcoverlayout();
            }
            var now = new Date();
            /*if ((result instanceof Object) == false) {
	    		if (settings.callback) { // 回调方法
				    settings.callback(result);
				}
	    		return;
            }*/
            if (type == 'GET') {
	    		if (settings.callback) { // 回调方法
				    settings.callback(result, textStatus);
				}
	    		return;
            }
            if (showMsg == true) {
                //TODO result.message需要删除，没有必要从后端传来
                var successMsg = '操作成功';
                if (settings.successMsg && settings.successMsg != '') {
                    successMsg = settings.successMsg;
                }/* else if (result.message && result.message != '') {
                    successMsg = result.message;
                }*/
					Core.alert({
						title: "提示",
						message: successMsg,
						callback:function(){
		                    if (settings.callback) { // 回调方法
		                        settings.callback(result, textStatus);
		                    }
						}
					});
            } else {
                if (settings.callback) { // 回调方法
                    settings.callback(result, textStatus);
                }
            }
        },
        error: function (response, options) {
        	clearcoverlayout();
        	$.timeOutCookie(response.responseText);
			//if (waiting != null) {
				// 关闭遮盖层
				
			//}
			if (response.status == 500) {
				//TODO 错误编码
				// "{"errorCode":"er001","errorMsg":"用户名错误！"}"
				var obj = response.responseJSON;
				if (showMsg == true) {
					if(type=="DELETE" && obj.errorCode.indexOf("Exception")>-1){
						Core.alert({
							title : "错误",
							type : "error",
							message : "该数据已被使用，不能删除。",
							callback : function() {
								// 回调方法
								if (typeof settings.failure == "function") {
									settings.failure(response);
								}
							}
						});
					}else{
						var errCode=obj.errorCode==''?'错误信息':obj.errorCode;
						Core.alert({
							title : "错误",
							type : "error",
							message : errCode + ":" + obj.errorMsg,
							callback : function() {
								// 回调方法
								if (typeof settings.failure == "function") {
									settings.failure(response);
								}
							}
						});
					}
				} else {
					if (typeof settings.failure == "function") {
						settings.failure(response);
					}
				}

			} else if (response.status == 403) {
				//禁止访问
				settings.failure(response);
			} else if (response.status == 404) {
				Core.alert({
					title : "错误",
					type : "error",
					message : "404:请求没有找到",
					callback : function() {
						// 回调方法
						if (typeof settings.failure == "function") {
							settings.failure(response);
						}
					}
				});
				// if (isLoginPage==0||window.location.pathname == ctx +
				// "/pages/login.jsp" || window.location.pathname == ctx + "/")
				// {
				// return;
				// } else {
				// Core.showTimeoutDiv();
				// return;
				// }
			}
        }
    });
};

/**
 * jqx.dataAdapter for datatable
 */
Core.AcTableDataAdapter = function(eleId, source_setting, adp_setting, debug){

	if(debug === undefined){
		debug = false;
	}
	
	var source = Core.AcTableSource(eleId,source_setting,debug);
	
	var adapterSetting = adp_setting === undefined ? {}: adp_setting;
	
	
	/**
	 * 发送前对url,params进行重新设置
	 * url--->source.url
	 * params----->source.data
	 */
	adapterSetting.beforeSend = function(jqXHR,jqxHRSettings){
//		if(jqxHRSettings.url.indexOf("?")!=-1){
//			jqxHRSettings.url = jqxHRSettings.url.substring(0,jqxHRSettings.url.indexOf("?"));
//		}
//		var datainformation = $("#"+eleId).jqxGrid('getdatainformation');
//			
//		var sortinformation = datainformation.sortinformation;
//		var sortcolumn = sortinformation.sortcolumn;
//		var sortdirection = sortinformation.sortdirection;
//		
//		var paginginformation = datainformation.paginginformation;
//		var pagenum = paginginformation.pagenum;
//		var pagesize = paginginformation.pagesize;
//		var pagescount = paginginformation.pagescount;
//		//filterscount=0&groupscount=0&pagenum=0&pagesize=10&recordstartindex=0&recordendindex=10
//		
//		//filterscount=0&groupscount=0&sortdatafield=name&sortorder=asc&pagenum=0&pagesize=10&recordstartindex=0&recordendindex=10&model%5Bname%5D=e
//		source.data.filterscount=0;
//		source.data.groupscount=0;
//		if(sortcolumn){
//			source.data.sortdatafield=sortcolumn;
//		}
//		
//		if(sortdirection){
//			if(sortdirection.ascending)
//				source.data.sortorder="asc";
//			if(sortdirection.descending)
//				source.data.sortorder="desc";
//		}
//		source.data.pagenum=pagenum;
//		source.data.pagesize=pagesize;
//		
//		console.log(JSON.stringify(source.data));
//		
//		var params_clone = $.extend(true,{},source.data);
//		var condition = params_clone.condition;
//		var con = [];
//		if(condition){
//			a:for(var key in condition){
//				var obj = condition[key];
//				if(obj.value==null || obj.value.length == 0 ){
//					continue a;
//				}else{
//					//TODO 空值的处理
//					if(obj.action=="between"){
//						if(obj.value.length!=2){
//							continue a;
//						}
//						if(obj.value[0]==null && obj.value[1]==null){
//							continue a;
//						}
//						if(obj.value[0]==null && obj.value[1]!=null){
//							obj.action = "le";
//						}
//						if(obj.value[0]!=null && obj.value[1]==null){
//							obj.action = "ge";
//						}
//					}else{
//						for(var i=0;i<obj.value.length;i++){
//							if(obj.value[i]==null){
//								continue a;
//							}
//						}
//					}
//				}
//				obj.key = key;
//				con.push(obj);
//			}
//		}
//		params_clone.condition = con;
//		console.log(new Base64().encode(JSON.stringify(params_clone)));
//		
//		//将grid的数据解析并base64编码后提交到服务端 TODO debug，moc环境下注销掉，正式环境打开注释
//		jqxHRSettings.url = jqxHRSettings.url+"/"+new Base64().encode(JSON.stringify(params_clone).replace("_$_",".")).replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c");
//		console.log(jqxHRSettings.url);
	};
	
	var default_settings = {
        downloadComplete: function (data, status, xhr) {console.log("downloadComplete"); },
        loadComplete: function (data) { console.log("loadComplete");},
        loadError: function (xhr, status, error) { 
        	console.log(xhr);
        	console.log("loadError"+status+"--"+error);
        	$.timeOutCookie(xhr.responseText);
        }
    };
	
	$.extend(true,default_settings,adapterSetting);

	return new $.jqx.dataAdapter(
			source,
			default_settings
			);
}

/**
 * jqx.dataAdapter对象的封装
 * 
 */
Core.AcDataAdapter = function(eleId, source_setting, adp_setting, debug){
	console.log('====');
	if(debug === undefined){
		debug = false;
	}
	source_setting.data = source_setting.data===null?{condition:{}} : {condition:source_setting.data};
	
	var source = Core.AcSource(eleId,source_setting,debug);
	
	var adapterSetting = adp_setting === undefined ? {}: adp_setting;
	
	
	/**
	 * 发送前对url,params进行重新设置
	 * url--->source.url
	 * params----->source.data
	 */
	adapterSetting.beforeSend = function(jqXHR,jqxHRSettings){
		if(jqxHRSettings.url.indexOf("?")!=-1){
			//jqxHRSettings.url = jqxHRSettings.url.substring(0,jqxHRSettings.url.indexOf("?"));
			jqxHRSettings.url = source_setting.dataUrl===undefined?jqxHRSettings.url.substring(0,jqxHRSettings.url.indexOf("?")):source_setting.dataUrl['url']['value'][0];
			//			console.log(jqxHRSettings.url);
		}
//		console.log("AcDataAdapter beforeSend:"+JSON.stringify(source_setting.data));
		var datainformation = $("#"+eleId).jqxGrid('getdatainformation');
		
		var sortinformation = datainformation.sortinformation;
		var sortcolumn = sortinformation.sortcolumn;
		var sortdirection = sortinformation.sortdirection;
		
		var paginginformation = datainformation.paginginformation;
		var pagenum = paginginformation.pagenum;
		var pagesize = paginginformation.pagesize;
		var pagescount = paginginformation.pagescount;
		//filterscount=0&groupscount=0&pagenum=0&pagesize=10&recordstartindex=0&recordendindex=10
		
		//filterscount=0&groupscount=0&sortdatafield=name&sortorder=asc&pagenum=0&pagesize=10&recordstartindex=0&recordendindex=10&model%5Bname%5D=e
		source_setting.data.filterscount=0;
		source_setting.data.groupscount=0;
//		if(sortcolumn){
			source_setting.data.sortdatafield=sortcolumn;
//		}
		if(sortcolumn==undefined){
//			console.log(source_setting.data.condition);
			if(source_setting.data.condition!=undefined){
				if(source_setting.data.condition.sortdatafield!=undefined)
					source_setting.data.sortdatafield=source_setting.data.condition.sortdatafield;
			}
		}
			
		
		if(sortdirection){
			if(sortdirection.ascending)
				source_setting.data.sortorder="asc";
			if(sortdirection.descending)
				source_setting.data.sortorder="desc";
		}
		source_setting.data.pagenum=pagenum;
		source_setting.data.pagesize=pagesize;
		
		var params_clone = $.extend(true,{},source_setting.data);
		var condition = params_clone.condition;
		var con = [];
		if(condition){
			a:for(var key in condition){
				var obj = condition[key];
//				console.log("OB"+obj.action);
				if(obj.value==null || obj.value.length == 0 ){
					continue a;
				}else{
					//TODO 空值的处理
					if(obj.action=="between"){
						if(obj.value.length!=2){
							continue a;
						}
						if(obj.value[0]==null && obj.value[1]==null){
							continue a;
						}
						if(obj.value[0]==null && obj.value[1]!=null){
							obj.action = "le";
						}
						if(obj.value[0]!=null && obj.value[1]==null){
							obj.action = "ge";
						}
					}else{
						for(var i=0;i<obj.value.length;i++){
							if(obj.value[i]==null){
								continue a;
							}
						}
					}
				}
				obj.key = key;
				con.push(obj);
//				console.log("OBJ"+obj.key);
			}
		}
		params_clone.condition = con;
//		console.log(JSON.stringify(params_clone));
//		console.log(new Base64().encode(JSON.stringify(params_clone)));
//		console.log(new Base64().encode(JSON.stringify(params_clone)).replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"));
		//将grid的数据解析并base64编码后提交到服务端 TODO debug，moc环境下注销掉，正式环境打开注释
		if(source_setting.myPage===true){
			jqxHRSettings.url = jqxHRSettings.url+"/"+pagenum*pagesize+"/"+(parseInt(pagenum)+1)*pagesize;
		}else if(debug===false){
			jqxHRSettings.url = jqxHRSettings.url + "/" + new Base64().encode(JSON.stringify(params_clone).replace("_$_", ".")).replace(/\//g, "_a").replace(/\+/g, "_b").replace(/\=/g, "_c");
		}
		
//		journalUrl=jqxHRSettings.url.substring(jqxHRSettings.url.lastIndexOf('/')+1);
		
		jqxHRSettings.url+='?t='+Math.random();
		
//		console.log(journalUrl);
//		source_setting.data.recordstartindex=pagenum;
//		source_setting.data.recordendindex=pagenum;
//		console.log(jqxHRSettings.url);
	};
	
	var default_settings = {
		downloadComplete: function(data, status, xhr) {
//			$('#'+eleId).jqxGrid('source').totalrecords = data.totalRows;
//            if (source.totalrecords !== undefined) {
//            	console.log("totalrecords:"+data.totalRows);
            	source.totalrecords = data.totalRows;
//            }
        },
        loadComplete: function (data) { /*permission_func();*/console.log("loadComplete");},
        loadError: function (xhr, status, error) { console.log(xhr);console.log("loadError"+status+"--"+error);}
    };
	
	$.extend(true,default_settings,adapterSetting);

	return new $.jqx.dataAdapter(
			source,
			default_settings
			);
	
}

Core.AcTableSource = function(eleId,settings, debug){
	
	var is_debug = debug === undefined ? false:debug;
	var gridId = eleId===undefined ? null:eleId;
	var params = settings.data === undefined ? {} : settings.data;
	if(gridId == null) return null;
	
	var default_source = {};
	
	if(is_debug){
		default_source = {
			datatype:"csv",
			type:"GET",
			cache:false,
			async:true
		};
	}else{
		default_source = {
			datatype:"json",
			type:"GET",
			cache:false,
			data:params,
			async:true,
			root:"rows",
			beforeprocessing: function(data){		
//				console.log(this);
//				this.totalrecords = data.totalRows;
			},
			sort: function(){
				// update the grid and send a request to the server.
//				$("#"+gridId).jqxGrid('updatebounddata', 'sort');
			},
			filter: function(){
					// update the grid and send a request to the server.
//				$("#"+gridId).jqxGrid('updatebounddata', 'filter');
			}
		}; 
	}
	
	var source = $.extend(true,{}, default_source, settings);
	return source;
}

/**
 * 针对grid,datatable的source进行设置，除eleId, url, params为必须传入
 * 其他参数与jqxAdapter的source参数一致。
 * 
 * @param {String}
 *            eleId 主键ID，必须
 * @param {String}
 *            settings.url 请求地址，必须
 * @param {Object}
 *            settings.data 参数对象，必须
 * @param {Boolean}
 * 			  debug	是否调试环境
 *            
 */
Core.AcSource = function(eleId,settings, debug){
//	console.log("AcSource:"+JSON.stringify(settings.data));
	var is_debug = debug === undefined ? false:debug;
	var gridId = eleId===undefined ? null:eleId;
//	var params = settings.data === undefined ? {} : settings.data;
	if(gridId == null) return null;
	
	var default_source = {};
	
	if(is_debug){
		default_source = {
			datatype:"csv",
			type:"GET",
			cache:false,
			async:true,
			data:settings.data
		};
	}else{
		default_source = {
			datatype:"json",
			type:"GET",
			cache:false,
			data:settings.data,
			async:true,
			root:"rows",
//			beforeprocessing: function(data){		
//			},
			sort: function(){
				// update the grid and send a request to the server.
				$("#"+gridId).jqxGrid('updatebounddata', 'desc');
			},
			filter: function(){
					// update the grid and send a request to the server.
				$("#"+gridId).jqxGrid('updatebounddata', 'filter');
			}
		}; 
	}
	
	var source = $.extend(true,{}, default_source, settings);
	return source;
}

/**
 * jqx.dataAdapter请求
 * 
 * @param {String}
 *            settings.gridId 主键ID，必须
 * @param {String}
 *            settings.url 请求地址，必须
 * @param {Object}
 *            settings.params 参数对象，必须
 * @param {Object}
 *            settings.async 是否异步提交
 * @param {String}
 *            settings.cache 是否缓存
 */
Core.NewDataAdapter = function (settings) {
    // 参数对象
    var params = settings.params === undefined ? {condition:{}} : {condition:settings.params};
    var async = settings.async === undefined ? false : settings.async;
    var cache = settings.cache === undefined ? false : settings.cache;
    var dataType = settings.dataType === undefined ? "json" : settings.dataType;
    var type = settings.type === undefined ? "GET" : settings.type;
    var contentType = settings.contentType === undefined ? "application/json; charset=UTF-8" : settings.contentType;
    var gridId = settings.gridId;
	var source =
    {
    	 datatype: dataType,
    	 contentType: contentType,
         url: settings.url,
         root: 'rows',
         cache: cache,
         async: async,
         data: params,//GET提交时该参数会被忽略
         type: type,
		 beforeprocessing: function(data)
		 {		
			source.totalrecords = data.totalRows;
		 },
		 sort: function()
		 {
			// update the grid and send a request to the server.
			$("#"+settings.gridId).jqxGrid('updatebounddata', 'sort');
		 },
		 filter: function()
		 {
			// update the grid and send a request to the server.
			$("#"+settings.gridId).jqxGrid('updatebounddata', 'filter');
		 }
    };
	
	source = $.extend(true,source, settings.source);
	
	var adapterSetting= settings.setting === undefined ? {}: settings.setting;
	
	adapterSetting.beforeSend = function(jqXHR){
//		alert(settings.url);
		var url = source.url;
		url = url.substring(0,url.indexOf("?"));
//		alert(settings.url);
		var datainformation = $("#"+gridId).jqxGrid('getdatainformation');
		var rowscount = datainformation.rowscount;
			
		var sortinformation = datainformation.sortinformation;
		var sortcolumn = sortinformation.sortcolumn;
		var sortdirection = sortinformation.sortdirection;
			
		var paginginformation = datainformation.paginginformation;
		var pagenum = paginginformation.pagenum;
		var pagesize = paginginformation.pagesize;
		var pagescount = paginginformation.pagescount;
//		console.log(JSON.stringify(datainformation));
		//filterscount=0&groupscount=0&pagenum=0&pagesize=10&recordstartindex=0&recordendindex=10
		
		//filterscount=0&groupscount=0&sortdatafield=name&sortorder=asc&pagenum=0&pagesize=10&recordstartindex=0&recordendindex=10&model%5Bname%5D=e
		params.filterscount=0;
		params.groupscount=0;
		if(sortcolumn){
			params.sortdatafield=sortcolumn;
		}
		
		if(sortdirection){
			if(sortdirection.ascending)
				params.sortorder="asc";
			if(sortdirection.descending)
				params.sortorder="desc";
		}
		params.pagenum=pagenum;
		params.pagesize=pagesize;
		
//		console.log(JSON.stringify(params));
		
		var params_clone = $.extend(true,{},params);
		var condition = params_clone.condition;
		var con = [];
		if(condition){
			a:for(var key in condition){
				var obj = condition[key];
				if(obj.value==null || obj.value.length == 0 ){
					continue a;
				}else{
					//TODO 空值的处理
					if(obj.action=="between"){
						if(obj.value.length!=2){
							continue a;
						}
						if(obj.value[0]==null && obj.value[1]==null){
							continue a;
						}
						if(obj.value[0]==null && obj.value[1]!=null){
							obj.action = "le";
						}
						if(obj.value[0]!=null && obj.value[1]==null){
							obj.action = "ge";
						}
					}else{
						for(var i=0;i<obj.value.length;i++){
							if(obj.value[i]==null){
								continue a;
							}
						}
					}
				}
				obj.key = key;
				con.push(obj);
			}
		}
		params_clone.condition = con;
//		console.log(JSON.stringify(params_clone));
//		console.log(new Base64().encode(JSON.stringify(params_clone)));
//		console.log(new Base64().encode(JSON.stringify(params_clone)).replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"));
		
		//将grid的数据解析并base64编码后提交到服务端 
		settings.url = settings.url+"/"+new Base64().encode(JSON.stringify(params_clone).replace("_$_",".")).replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c");
		
//		params.recordstartindex=pagenum;
//		params.recordendindex=pagenum;
//		console.log(settings.url);
	};
    return new $.jqx.dataAdapter(source,adapterSetting);
};

/**
 * AjaxFileUpload请求方法
 * 
 * @param {String}
 *            settings.url 请求地址，必须
 * @param {Array}
 *            settings.fileElementId 上传文件ID，数组的形式，必须
 * @param {Object}
 *            settings.params 参数对象
 * @param {String}
 *            settings.submitBtnId 提交按钮ID，用于点击后禁用按钮
 * @param {Function}
 *            settings.callback 成功后回调方法
 * @param {boolean}
 *            settings.showMsg 处理成功时，是否显示提示信息 true:显示 false:不显示
 * @param {boolean}
 *            settings.showWaiting 是否显示等待条 true:显示 false:不显示
 */
Core.AjaxFileUpload = function (settings) {
    // 参数对象
    var params = settings.params === undefined ? null : settings.params,
    submitBtnId = settings.submitBtnId === undefined ? "" : settings.submitBtnId,
    showWaiting = settings.showWaiting === undefined ? true : settings.showWaiting,
    showMsg = settings.showMsg === undefined ? true : settings.showMsg,
	waiting = null;

    if (showWaiting) {
		waiting = 1;
	    opensavelayout();
    }
    if(submitBtnId!=""){
    	$("#"+submitBtnId).attr("disabled",true);
    }

    // 发送请求
    $.ajaxFileUpload({  
  	    url:settings.url+"?token="+currentUser.user.token,  
  	    secureuri:false,  
  	    fileElementId: settings.fileElementId,
  	    dataType: 'text',
  	    data: settings.params,  
  	    success: function (data, status){ 
  	    	data = eval('(' + data + ')'); 
  	    	if(submitBtnId!=""){
  	    		$("#"+submitBtnId).attr("disabled",false);
  	    	}
  	    	clearcoverlayout();
  	    	if(status=="success"){
  	    		if(showMsg){
  	    			Core.alert({
    					title: "提示",
    					message: data.message,
    					callback:function(){
    						settings.callback(data);
    					}
    				});
    			}else{
    				settings.callback(data);
    			}
  	    	}
  	    },  
  	    error: function(data){  
  	    	if(submitBtnId!=""){
  	    		$("#"+submitBtnId).attr("disabled",false);
  	    	}
  	    	clearcoverlayout();
  	    	alert("error");
  	    }  
  	});
};

/**
 * AjaxSubmit提交带file的表单
 * 
 * @param {Object}
 *            settings.async 是否异步提交，
 * @param {String}
 *            settings.url 请求地址，必须
 * @param {Function}
 *            settings.formId form的ID，必须
 * @param {boolean}
 *            settings.showMsg 处理成功时，是否显示提示信息 true:显示 false:不显示
 * @param {boolean}
 *            settings.showWaiting 是否显示等待条 true:显示 false:不显示
 * @param {String}
 *            settings.successMsg 成功消息
 * @param {String}
 *            settings.failureMsg 失败消息
 */

Core.AjaxFormSubmit = function (settings) {
    // 参数对象
	if (settings.formId === undefined) {
		return;
	}
	var showWaiting = settings.showWaiting === undefined ? true : settings.showWaiting;
	var async = settings.async === undefined ? true : settings.async;
	var showMsg = settings.showMsg === undefined ? true : settings.showMsg;
	var url = settings.url === undefined ? $("#"+settings.formId).attr("action") : settings.url;
	var dataType = settings.dataType === undefined ? "json" : settings.dataType;
	var waiting = null;
    if (showWaiting) {
//        waiting = mini.loading("正在处理中，请稍后.", "提示");
    }
	var options = {
		 type:'POST',
		 async : async,
		 dataType: dataType,
	     url: url,
	     success: function (result) { 
//           if (waiting != null) {
//            	mini.hideMessageBox(waiting);
//            }
           if ((result instanceof Object) == false) {
	    		if (settings.callback) { // 回调方法
				    settings.callback(result);
				}
	    		return;
           }
            if (result.status == undefined) {
                if (result.timeout != undefined && result.timeout == true) {
                    var message = '发生异常.';
                    if (result.message && result.message != '') {
                        message = result.message;
                    }
//                	Core.alertWarning(message, '提示', function () {
//                        var win = window;
//                        while (win != win.parent) {
//                            win = win.parent;
//                        }
//                        win.location = ctx;
//                	});
                } else {
					if (settings.callback) { // 回调方法
					    settings.callback(result);
					}
                }
            } else if (result.status == true) {
                if (showMsg == true) {
                    // 请求成功时的提示
                    var successMsg = '操作成功';
                    if (result.message && result.message != '') {
                        successMsg = result.message;
                    } else if (settings.successMsg && settings.successMsg != '') {
                        successMsg = settings.successMsg;
                    }
//                    Core.alertInfo(successMsg, '提示', function () {
//	                    if (settings.callback) { // 回调方法
//	                        settings.callback(result);
//	                    }
//                    });
                } else {
                    if (settings.callback) { // 回调方法
                        settings.callback(result);
                    }
                }
            } else if (result.status == false) {
                var message = '发生异常';
                if (result.message && result.message != '') {
                	// 后台设定的业务消息
                    message = result.message;
                } else if (settings.failureMsg && settings.failureMsg != '') {
                	// 前台指定的错误信息
                    message = settings.failureMsg;
                }
                if (result.exceptionMessage && result.exceptionMessage != '') {
                	// 有异常信息
//                    Core.ExceptionWindow(message, result.exceptionMessage, function () {
//	                    if(typeof settings.failure == "function"){
//	                    	settings.failure(result);
//	                	}
//                    });
                } else {
//                	Core.alertError(message, '错误', function () {
//	                    if(typeof settings.failure == "function"){
//	                    	settings.failure(result);
//	                	}
//                	});
                }
            }
        },
        error: function (response, options) {
//            if (waiting != null) {
//            	mini.hideMessageBox(waiting);
//            }
            if (typeof response.getResponseHeader == "function") {
                // 得到response里面的头信息
                var sessionStatus = response.getResponseHeader("session-status");
                if (sessionStatus == "timeout") {
                	// 登陆超时
//                	Core.alertWarning('<span style="color:red"><b>登录超时，请重新登录！</b></span>', '提示', function () {
//                        var win = window;
//                        while (win != win.parent) {
//                            win = win.parent;
//                        }
//                        win.location = ctx;
//                    });
                    return false;
                } else if (sessionStatus == "pagenotfind") {
                	// 页面不存在
//                	Core.alertWarning('<span style="color:red"><b>很抱歉，您要访问的页面不存在！</b></span>', '提示', function () {});
                    return false;
                } else {
                	if (response.status == 405) {
//                		Core.alertError("您请求的地址在服务器中不存在！", '', function (){
//                			Core.CloseWindow();
//                		});
                	} else {
//                		Core.alertServerError();
                	}
                }
            }
        }
	};
	$("#"+settings.formId).ajaxSubmit(options);
};

/**
 * jqwidget自定义Confirm窗口
 * 
 * @param {String}
 *            settings.title 窗口标题
 * @param {String}
 *            settings.message 显示信息
 * @param {String}
 *            settings.okBtnName 确定按钮名称
 * @param {String}
 *            settings.cancelBtnNm 取消按钮名称
 * @param {String}
 *            settings.type 提示类型(info, warning, error)
 * @param {Function}
 *            settings.confirmCallback 确定按钮回调函数
 * @param {Function}
 *            settings.cancelCallback 取消按钮回调函数
 */
Core.confirm = function (settings) {
	
    var title = settings.title === undefined ? $.i18n.prop('core.confirm.title') : settings.title,
    	message = settings.message === undefined ? "" : settings.message,
    	okBtnNm = settings.yes === undefined ? $.i18n.prop('core.confirm.yes') : settings.yes,
    	cancelBtnNm = settings.no === undefined ? $.i18n.prop('core.confirm.no') : settings.no,
	    type = settings.type === undefined ? "info" : settings.type,
	    height=settings.height===undefined?195:settings.height,
	    width=settings.width===undefined?450:settings.width,
    	left=settings.left==undefined?300:settings.left,
    	right=settings.right==undefined?130:settings.right;
    	
    	// 判断body中是否存在了alertWindow
		if($("#confirmWindow").length > 0){
			//$('#confirmWindow').jqxWindow('destroy');
			$('#confirmWindow').remove();
		}
    	
	/*$('<div id="confirmWindow">'+
		'<div id="customWindowHeader">'+
		  '<span id="captureContainer" style="float: left">'+title+'</span>'+
		'</div>'+
		'<div id="customWindowContent" style="overflow: hidden">'+
			'<div style="width:100%;height:70px;position:relative;top:0px;left:0px;padding-top:15px;">'
			+'<table>'
			+'<tr>'
			+'	<td><i class="icons-32-blue icon-help-circled"></i></td>'
			+'	<td>'+message+'</td>'
			+'</tr>'
			+'</table>'
			+'</div>'+
			'<div style="float: right; margin-top: 0px;">'+
				' <input type="button" class="button_02" style="cursor:pointer;margin-right: 5px" value=' + okBtnNm + ' id="okButton" />'+
				' <input type="button" class="button_02" style="cursor:pointer" value=' + cancelBtnNm + ' id="cancelButton" />'+
			'</div>'+
		'</div>'+
		'</div>').appendTo($("body"));*/
    	
    	var w=$('<div id="confirmWindow">'+
    			'<div id="customWindowHeader">'+
    			  '<span id="captureContainer" style="float: left">'+title+'</span>'+
    			'</div>'+
    			'<div id="customWindowContent" style="overflow: hidden">'+
    				'<div style="width:100%;height:60px;line-height:16px;position:relative;top:0px;left:0px;padding-top:50px;text-align:center;">'
    				+// typeIcon + 
    				'<font style="font-size: 15px;">'+ message + '</font></div>'+
    				//'<div style="float: right; margin-top: 40px;margin-bottom:5px;">'+
    				'<div style="bottom: 5px;right: 5px;position: absolute;">'+
    				' <input type="button" class="button_02" style="width:100px;height:33px;margin-top:20px;" value=' + okBtnNm + ' id="okButton_cf" />'+
    				' <input type="button" class="button_02" style="width:100px;height:33px;margin-top:20px;" value=' + cancelBtnNm + ' id="cancelButton" />'+
    				'</div>'+
    			'</div>'+
    			'</div>');
    			w.appendTo($("body"));

	$("#confirmWindow .jqx-window-modal").css("width","1200px");
	
/*	$('#confirmWindow').on('open',function(){
		 alert(1);
		 permission_func();
    });*/
	
	var windowW = $(window).width(); 
	var windowH = $(window).height();
	 $('#confirmWindow').jqxWindow({ 
		 //position: { x: (windowW-left)/2, y: (windowH-right)/2 },
		 position: { x: (windowW-width)/2, y: (windowH-height)/2+$(document).scrollTop() },
		 width: width,
         height: height, 
         resizable: false,
         isModal: true, 
         closeButtonAction:'close',
         theme:currentTheme,
         initContent: function () {
             $('#okButton_cf').jqxButton({disabled: false , theme: currentTheme});
             $('#cancelButton').jqxButton({disabled: false, theme: currentTheme });
             $('#okButton_cf').focus();
         }
     });
	 
	 

	$('#confirmWindow').find('#okButton_cf').click(function() {
		$('#confirmWindow').jqxWindow('close');
		if (settings.confirmCallback) {
			settings.confirmCallback();	
		}
		$('#confirmWindow').jqxWindow('destroy');
		return true;
	});
	
	$('#confirmWindow').find('#cancelButton').click(function() {
		$('#confirmWindow').jqxWindow('close');
		if (settings.cancelCallback) {
			settings.cancelCallback();	
		}
		$('#confirmWindow').jqxWindow('destroy');
	});
		
		
};

/**
 * jqwidget自定义alert窗口
 * 
 * @param {String}
 *            settings.title 窗口标题
 * @param {String}
 *            settings.message 显示信息
 * @param {String}
 *            settings.okBtnName 确定按钮名称
 * @param {String}
 *            settings.cancelBtnNm 取消按钮名称
 * @param {String}
 *            settings.type 提示类型(info, warning, error)
 * @param {Function}
 *            settings.callback 确定按钮回调函数
 */

Core.alert = function (settings) {
	var title = settings.title === undefined ? $.i18n.prop('core.alter.title') : settings.title,
	    message = settings.message === undefined ? "" : settings.message,
	    okBtnNm = settings.yes === undefined ? $.i18n.prop('core.alter.yes') : settings.yes,
	    type = settings.type === undefined ? "info" : settings.type,
		width = settings.width === undefined ? 450 : settings.width,				
		height = 195,
		hide=settings.hide===undefined?true:settings.hide;
	    callback=settings.callback===undefined?function(){}:settings.callback;
	    
	    avaiable=settings.avaiable===undefined?true:settings.avaiable;
	
		var typeIcon = '<i class="icons-32-blue icon-info-circled"></i>';
		if (type == "warning") {
			typeIcon = '<i class="icons-32-yellow icon-attention-1"></i>';
		}else if (type == "error") {
			typeIcon = '<i class="icons-32-red icon-cancel-circled"></i>';
		} else 	if (type == "info") {
			typeIcon = '<i class="icons-32-blue icon-info-circled"></i>';
		}
		
		// 判断body中是否存在了alertWindow
		if($("#alertWindow").length > 0){
			$('#alertWindow').jqxWindow('destroy');
		}
		
		if($("#avaiableFade").length > 0){
			$('#avaiableFade').remove();
		}
		
		//不做操作的提示框
		if(avaiable){
			var ww=$('<div id="avaiableFade" class="alert alert-warning alert-dismissible fade in" role="alert">'+
					'<div class="close" data-dismiss="alert" aria-label="Close">'+
					'<span id="avaiableWindow">'+message+'</span>'+
//					'<div class="succeed_icon"><i class="ion-checkmark"></i></div>'+
					'</div>'+
					'</div>');
			
			ww.appendTo($("body"));
			height=height===undefined?ww.height()+30:height;
			
			var windowW = $(window).width(); 
			var windowH = $(window).height();
			
			var wd=1.15*$('#avaiableWindow').width();
		
			if(wd>800){
				wd=800;
			}
			
			$('#avaiableFade').css({
				position:'absolute',
				top:$(document).scrollTop()+400+'px',
				height:40,
				width:wd,
				'z-index':20000
			});
			
			$('#avaiableWindow').css({'word-break':'break-all','text-align':'center'});
			$('#avaiableFade').css({'left':windowW/2-95-$('#avaiableFade').width()/2+'px','height':13+1.05*$('#avaiableWindow').height()});
			
			var  _hideAlert2,t1=0,t2=0;
			
			if(settings.hide){
				t1=new Date().getTime();
				_hideAlert2=setTimeout(function(){
					$('#avaiableFade').trigger('click');
				},settings.hide);
			}else{
				t1=new Date().getTime();
				_hideAlert2=setTimeout(function(){
					$('#avaiableFade').trigger('click');
				},3000);
			}
			
			$('#avaiableFade').off('click').on('click',function(){
				t2=new Date().getTime();
				
				var time=(t2-t1)/1000;
				if(time>=3){
					$('#avaiableWindow').off('close').alert('close');
					clearTimeout(_hideAlert2);
				}else{
					if(settings.hide){
						$('#avaiableWindow').off('close').alert('close');
						clearTimeout(_hideAlert2);
					}
				}
			});
			
			if (typeof callback=='function'){
				callback();	
			}
			
			return false;
		}

		var w=$('<div id="alertWindow">'+
			'<div id="customWindowHeader">'+
			  '<span id="captureContainer" style="float: left">'+title+'</span>'+
			'</div>'+
			'<div id="customWindowContent" style="overflow: hidden">'+
				'<div style="width:100%;height:60px;line-height:16px;position:relative;top:0px;left:0px;padding-top:50px;text-align:center;">'
				+ typeIcon + 
				'<span class="coretips" style="">'+ message + '</span></div>'+
				'<div style="float: right; margin-top: 40px;margin-bottom:5px;">'+
					' <input type="button" class="button_02" value="'+okBtnNm+'" id="okButton" style="width:100px;height:33px;margin-top:20px;position: relative;"/>'+
				'</div>'+
			'</div>'+
			'</div>');
			w.appendTo($("body"));
		height=height===undefined?w.height()+30:height;
		 
		var windowW = $(window).width(); 
		var windowH = $(window).height();
		 $('#alertWindow').jqxWindow({
			 position: { x: (windowW-width)/2, y: (windowH-height)/2/*+$(document).scrollTop()*/ },
			 width: width,
	         height: height, 
	         resizable: false,
	         isModal: true,
	         theme:currentTheme,
	         keyboardCloseKey: 'none',
	         showCloseButton:false,
	         //closeButtonAction:'close',
	         initContent: function () {
	             $('#okButton').jqxButton({disabled: false, theme: currentTheme});
	             $('#okButton').focus();
	         }
	     });
		 
		var  _hideAlert;
		if(hide){
			_hideAlert=setTimeout(function(){
				if($('#okButton')[0]) $('#okButton').trigger('click');
			},5000);
		}
		if(settings.hide){
			_hideAlert=setTimeout(function(){
				if($('#okButton')[0]) $('#okButton').trigger('click');
			},settings.hide);
		}

		$('#alertWindow').find('#okButton').click(function() {
			if($('.java_buy').length!=0){
				var attr=$('.java_buy').attr('data-permissions');
				if(attr!=='billing:product:useraccount'&&attr!=='billing:product:apprval')
				$.closeTab();
			}
			$('#alertWindow').jqxWindow('destroy');
			clearTimeout(_hideAlert);
			//$(window).off("resize");					
			if (typeof callback=='function') {
				callback();	
			}
		});
		
		
		$(window).resize(function(){
			try{
				$('#alertWindow').jqxWindow({
					//position: { x: offset.left + 50, y: offset.top + 50}
					position: { x: ($(window).width() -$('#alertWindow').width())/2, y: ($(window).height() -$('#alertWindow').height())/2+$(document).scrollTop()}
				});
//				console.log("i'm resize ok!",offset.left,$('#alertWindow').height());
			}catch(e){
				$(window).off('resize');
			}
		})
		
};

/**
 * 附件文件下载。
 */
Core.attachmentDownload = function (attachmentSid) {
	if (attachmentSid == undefined || attachmentSid == null || attachmentSid == "") {
		return;
	}
	if (isNaN(attachmentSid)) {
		return;
	}
	var url= ctx + "/download/" + attachmentSid;
	window.location=url;
};

/**
 * map转数组。
 * 
 * @param {Map}map
 *            map对象
 * @return 数组
 */
Core.map2Ary = function (map) {
    var list = [];
    for (var key in map) {
        list.push([key, map[key]]);
    }
    return list;
};
/**
 * 获取map中的值。
 * 
 * @param {String}value
 *            要渲染的值
 * @param {Map}mapping
 *            Map对象
 * @param {String}defaultText
 *            没有对应的key时的默认值
 * @return {String}对应的value值
 */
Core.map = function (value, mapping, defaultText) {
    return mapping[value] || (defaultText === undefined || defaultText === null ? value : defaultText);
};


/** 问候 */
Core.sayHello = function () {
    var hour = new Date().getHours(),
     hello = '';
    if (hour < 6) {
        hello = '凌晨好';
    } else if (hour < 9) {
        hello = '早上好';
    } else if (hour < 12) {
        hello = '上午好';
    } else if (hour < 14) {
        hello = '中午好';
    } else if (hour < 17) {
        hello = '下午好';
    } else if (hour < 19) {
        hello = '傍晚好';
    } else if (hour < 22) {
        hello = '晚上好';
    } else {
        hello = '夜里好';
    }
    return hello + '，';
} ;

/** 打开窗口**/
Core.openWindow = function (url,name,iWidth,iHeight) {
	//window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽  
	var iTop = (window.screen.height-30-iHeight)/2;       //获得窗口的垂直位置;  
	var iLeft = (window.screen.width-10-iWidth)/2;        //获得窗口的水平位置;  
	window.open(url,name,'height='+iHeight+',innerHeight='+iHeight+',width='+iWidth+',innerWidth='+iWidth+',top='+iTop+',left='+iLeft+',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,modal=yes,location=no,status=no');  
};

/** 模态窗口方法 */
Core.openModalWindow = function (url,param,iWidth,iHeight,e) {
	// 相对于浏览器的居中位置   
	var iTop = (window.screen.height-30-iHeight)/2;       //获得窗口的垂直位置;  
	var iLeft = (window.screen.width-10-iWidth)/2;        //获得窗口的水平位置;  
	var result= window.showModalDialog(url,param,'dialogWidth='+iWidth+'px;dialogHeight='+iHeight+'px;dialogLeft:'+iLeft+'px;dialogTop:'+iTop+'px','toolbar=no;menubar=no;center=yes;scrollbars=auto;resizeable=no;location=no;status=no');  
	return result;
};

/** 格式化日期 */
Date.prototype.format = function(format){ 
	var o = { 
		"M+" : this.getMonth()+1,
		"d+" : this.getDate(),
		"h+" : this.getHours(),
		"m+" : this.getMinutes(),
		"s+" : this.getSeconds(),
		"q+" : Math.floor((this.getMonth()+3)/3), 
		"S" : this.getMilliseconds()
	};

	if(/(y+)/.test(format)) { 
		format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	}

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(format)) { 
			format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	} 
	return format;
	//For example:
	//var date = new Date();
	//alert(date.format("yyyy年MM月dd日""));
	//alert(date.format("MM月d日""));
};

/**
 * 禁止鼠标右键
 */
/*开发阶段先屏蔽
document.oncontextmenu = function() { 
	return false; 
};
*/

/**
 * 禁止back space键
 */
/*
document.body.onkeydown = function(event) {
	if(event.keyCode==8) {
		return false;
	}
};
*/

//Array.prototype.delByIndex=function(n){
//	if(n<0){
//		return this;
//	}else{
//		return this.slice(0,n).concat(this.slice(n+1,this.length));
//	}
//};

/*将yyyy-MM-dd hh:mm:ss格式的字条串转化为时间对象*/
String.prototype.toDate = function(){ 
	var temp = this.toString(); 
	temp = temp.replace(/-/g, "/"); 
	var date = new Date(Date.parse(temp)); 
	return date; 
};

/*将'/','''和'"'编码转义*/
String.prototype.toEscapeString=function(){
	var s=this.replace(/\\/g,'\\\\').replace(/\'/g,'\\\'').replace(/\"/g,'\\\"');
	return s;
};

/**
 * 操作cookie
 * 
 * Core.cookie('username'); //获得cookie   
 * Core.cookie('username', '张三'); //设置cookie   
 * Core.cookie('username', '李四', { expires: 3 }); //设置带时间的cookie 3小时   
 * Core.cookie('username', '', { expires: -1 }); //删除cookie  
 * Core.cookie('username', null); //删除 cookie  
 */
Core.cookie = function(name, value, options) {
	if (typeof value != 'undefined') {
		options = options || {};
		if (value === null) {
			value = '';
			options.expires = -1;
		}
		var expires = '';
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime()
						+ (options.expires * 60 * 60 * 1000));
			} else {
				date = options.expires;
			}
			expires = ';expires=' + date.toUTCString();
		}
		var path = options.path ? ';path=' + options.path : '';
		var domain = options.domain ? ';domain=' + options.domain : '';
		var secure = options.secure ? ';secure' : '';
		document.cookie = [ name, '=', encodeURIComponent(value), expires,
				path, domain, secure ].join('');
	} else {
		var cookieValue = null;
		if (document.cookie && document.cookie != '') {
			var cookies = document.cookie.split(';');
			for ( var i = 0; i < cookies.length; i++) {
				var cookie = jQuery.trim(cookies[i]);
				if (cookie.substring(0, name.length + 1) == (name + '=')) {
					cookieValue = decodeURIComponent(cookie
							.substring(name.length + 1));
					break;
				}
			}
		}
		return cookieValue;
	}
};

/**
 * 判断是否是项目支持的浏览器
 * 
 */
Core.browser = function(){
	var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    var isSupportBrowser = false;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0; 

    //以下进行测试
    if (Sys.ie) {
	    if (Number(Sys.ie) >=9) { 	
	    	isSupportBrowser = true;
	   }
    }else if (Sys.firefox) {
    	//document.write('Firefox: ' + Sys.firefox);
    	isSupportBrowser = true;
    }else if (Sys.chrome){
    	//document.write('Chrome: ' + Sys.chrome);
    	isSupportBrowser = true;
    }else if (Sys.opera){
    	//document.write('Opera: ' + Sys.opera);
    	isSupportBrowser = false;
    }else if (Sys.safari){
    	//document.write('Safari: ' + Sys.safari);
    	isSupportBrowser = true;
    }else{
    	isSupportBrowser = true;
    }
    return isSupportBrowser;
};

function clearcoverlayout(){
	$("body").find("#cover_div").remove();  
}

function opensavelayout(){
	if($("#alertWindow").length > 0){
		$("body").find("#cover_div").remove();
	}
	var div = "<div id='cover_div' style='position:absolute;top:0px;left:0px;width:100%;height:100%;background:#fff;filter:Alpha(Opacity=10);/* IE */-moz-opacity:0.1;/* Moz + FF */opacity: 0.1;z-index:999999'><img src=images/common/loading6.gif style='position:absolute;top:48%;left:48%'></img></div>";
	$("body").append(div);
}

//判断url是否添加随机数
function urlAddRandom(url){
	if(url.indexOf("?")>0){
		url=url+"&r="+Math.random();
		return url;
	}else{
		url=url+"?r="+Math.random();
		return url;
	}
}

/**
 * 产生随机数
 * @returns 随机数
 */
Core.randNum = function () {
	var start = 10000;
	var end = 999999999999;
    return Math.floor(Math.random() * (end - start + 1) + start);
};

$.removeArray = function(array, from, to) {
	var rest = array.slice((to || from) + 1 || array.length);
	array.length = from < 0 ? array.length + from : from;
	return array.push.apply(array, rest);
};

Core.console=function(setting){
//	console.log(setting);
	var title=setting.title===undefined?'提示':setting.title;
	var type=setting.type===undefined?'sm':setting.type;
	var id=setting.id===undefined?'myModal':setting.id;
			
	/*var myWindow='<button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bs-example-modal-'+type+'">'+title+'</button>';

	myWindow+='<div class="modal fade bs-example-modal-'+type+'" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">';
		myWindow+='<div class="modal-dialog modal-'+type+'">';
			myWindow+='<div class="modal-content">sdasdasdas';
		      
		      myWindow+='</div>';
		    	  myWindow+=' </div>';
		    		  myWindow+='</div>';
		    		  
		    		  
		    		  */
	
	var myWindow='<div class="modal fade" id="'+id+'">';
	myWindow+='<div class="modal-dialog modal-'+type+'">';
	myWindow+='<div class="modal-content"> ';
	myWindow+='<div class="modal-header">';
	myWindow+='<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	myWindow+='<h4 class="modal-title">'+title+'</h4>';
	myWindow+='</div>';
	myWindow+='<div class="modal-body">';
	myWindow+='<p>您确定要进行此操作吗？</p>';
	myWindow+='</div>';
	myWindow+='<div class="modal-footer">';
	myWindow+='<button type="button" class="btn btn-default btn-'+type+'" data-dismiss="modal">取消</button> ';
	myWindow+='<button type="button" class="btn btn-primary btn-'+type+'">确定</button> ';
	myWindow+='</div>';
	myWindow+='</div>';
	myWindow+='</div>';
	myWindow+='</div>';     
	if($("#"+id).length>0){
		$("#"+id).remove();
		$("body").append(myWindow);
	}
	else{
		$("body").append(myWindow);
	}
}

//jqx window
Core.console2 = function (settings) {
	var title = settings.title === undefined ? $.i18n.prop('core.alter.title') : settings.title,
	    message = settings.message === undefined ? "" : settings.message,
	   // type = settings.type === undefined ? "info" : settings.type,
		width = settings.width === undefined ? 280 : settings.width,
		html=settings.html === undefined?"":settings.html ,
		callback=settings.callback===undefined?false:settings.callback,
		height = settings.height;
	
		/*var typeIcon = '<i class="icons-32-blue icon-info-circled"></i>';
		if (type == "warning") {
			typeIcon = '<i class="icons-32-yellow icon-attention-1"></i>';
		}else if (type == "error") {
			typeIcon = '<i class="icons-32-red icon-cancel-circled"></i>';
		} else 	if (type == "info") {
			typeIcon = '<i class="icons-32-blue icon-info-circled"></i>';
		}*/
		
		// 判断body中是否存在了alertWindow
		if($("#alertWindow").length > 0){
			$('#alertWindow').jqxWindow('destroy');
		}

		var w=$('<div id="alertWindow">'+
			'<div id="customWindowHeader">'+
			  '<span id="captureContainer" style="float: left">'+title+'</span>'+
			'</div>'+
			'<div id="customWindowContent" style="overflow: hidden">'+
				'<div style="padding-top:15px;padding-bottom:15px;">'
				+ html+
				'</div>'+
				
			'</div>'+
			'</div>');
			w.appendTo($("body"));
		height=height===undefined?w.height()+30:height;
		 
		var windowW = $(window).width(); 
		var windowH = $(window).height();
		 $('#alertWindow').jqxWindow({
			 position: { x: (windowW-width)/2, y: (windowH-height)/2+$(document).scrollTop() },
			 width: width,
	         height: height,	         
	         resizable: true,	       
	         isModal: true,
	         maxWidth:"1300",
	         //minWidth:"150",
	         minHeight:"60",
	         maxHeight:"800",	        	 
	         theme:currentTheme,
	         closeButtonAction:'close',
	         /*initContent: function () {
	             $('#okButton').jqxButton({disabled: false, theme: currentTheme});
	             $('#okButton').focus();
	         }*/
	     });

		$('#alertWindow').find('#okButton').click(function() {
			$(window).off('resize');
			$('#alertWindow').jqxWindow('destroy');
			if (settings.callback) {
				settings.callback();	
			}
		});
		
		//$("#jqxDate").jqxDateTimeInput({ width: '188px', height: '38px' });
		
		$(window).resize( function(){	
			try{
				$('#alertWindow').jqxWindow({			
					position: { x: ($(window).width() -$('#alertWindow').width())/2, y: ($(window).height()- $('#alertWindow').height())/2+$(document).scrollTop()}				
				});
//				console.log("i'm resize ok!",$(window).height(),$('#alertWindow').scroll().height());
			}catch(e){
				$(window).off('resize');
			}
			

		})
		
};

var loadHtml=function(el,json){
	var html='';
	for(var i in json){
		html+='<tr><td><input type="text" data-id="'+json[i].id+'" value="'+json[i].typeValue+'"></td><td><span class=" md-cancel delete"></span></td></tr>';
	}
	html+='<tr><td><input type="text"></td><td><span class=" md-cancel delete"></span></td></tr>';
	$('#'+el).html(html);	 
	loadCatogeryInfo();
};

function loadCatogeryInfo(){
	Core.AjaxRequest({
        url : _global_settings.service.url+'/owner/category/'+currentUserInfo.id,
        type: "GET",
        showMsg:false,
        callback: function(res) {  
        	$.each(res,function(i,v){
        		if(res.id == currentUserInfo.id){
        			$('#category1_name').val(res.category1);
		        	$('#category2_name').val(res.category2);
		        	$('.category1_name,#category1_name').not('input').text(res.category1);
		        	$('.category2_name,#category2_name').not('input').text(res.category2);  
        		}
        	})
        },
        failure:function(e){
        	Core.alert({
				message:e.responseJSON.errorMsg
			})
        }
    });
}

var getData=function(el,type,dropdownlist){
	
	Core.AjaxRequest({
        url : _global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/ownerBizTypeInfo/get/'+type+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
        type: "GET",
        showMsg:false,
        callback: function(res) {        	    
        	loadHtml(el,res);
        	
        	$("#segment-"+type).on("click focus",'tr',function(){
        		var targer=$(this),
        		parent=$(this).parent().parent(),
        		last=$(this).parent().children().eq(-1);	
        		if(targer[0]===last[0]&&
        				targer.parent()[0].nodeName.toLowerCase()==='tbody'){			
        			targer.clone().appendTo(parent);
        			targer.next().find('input').val('');
        		}		
        	});
        	
        	$("#segment-"+type).on("click",'.delete',function(){
        		if($(this).parent().parent().parent().children().length>1){
            		$(this).parent().parent().remove();
        		}
        		return false;
        	});
        	
        	$("#segment-"+type).on("click",'.obit-modalBtn',function(){
        		var dropdownlist=$.myBroth;
        		var ownerBizType=type;	
        		console.log(ownerBizType,el);
        		var arr=[];
        		var j=0;
        		$.each($('#'+el).children(),function(i,e){
        			var typeValue=$(this).children().eq(0).find('input').val();
        			var id=$(this).children().eq(0).find('input').attr('data-id');
        			if(typeValue!==''){
        				arr[j]={typeValue:typeValue,ownerBizType:ownerBizType,id:id};
        				j+=1;
        			}
        		});
        		

        		if(ownerBizType=='category1'||ownerBizType=='category2'){
        			var name='';
        			if(ownerBizType=='category1'){
        				 name=$('#category1_name').val();
        			}else{
        				name=$('#category2_name').val();
        			}
        			var nameArr={					
        			};
        			
        			nameArr[ownerBizType]=name;
        			
        			Core.AjaxRequest({
        		        url : _global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/owner/category/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
        		        type: "PUT",
        		        params:nameArr,
        		        showMsg:false,
        		        callback: function(res) { 
        		        	setCloseAlertTimeOneSecond();
        		        	loadCatogeryInfo()
        		        },
        		        failure:function(e){
        		        	Core.alert({
        						message:e.responseJSON.errorMsg
        					})
        		        }
        		    });
        			
        			Core.AjaxRequest({
        		        url : _global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/ownerBizTypeInfo/list/'+ownerBizType+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
        		        type: "POST",
        		        params:arr,
        		        showMsg:false,
        		        callback: function(res) {  
        		        	setCloseAlertTimeOneSecond();
        		        },
        		        failure:function(e){
        		        	Core.alert({
        						message:e.responseJSON.errorMsg
        					})
        		        }
        		    });
        		}
        		
        		Core.AjaxRequest({
        			url:_global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/ownerBizTypeInfo/get/'+ownerBizType+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
        	        type: "GET",
        	        callback: function(res) {
        	        	ComboBoxSources.load(ownerBizType,true);
        	        	var record = ComboBoxSources.getRecords(ownerBizType);
	        			
	        			if(dropdownlist!=null&&dropdownlist!=''){
	        				if($(dropdownlist).length!=0){
	        					$(dropdownlist).jqxComboBox({
    	        					source:record
    	        				});
	        					
	        				}else{
	        					$("#"+dropdownlist).jqxComboBox({
    	        					source:record
    	        				});
	        					
	        				}
	        			}
        	        	if(ownerBizType=='producttype'){
	                        var updateProductTypeArr=[]
		        			for(var i=0;i<record.length;i++){
		        				updateProductTypeArr.push(record[i]);
		        			}
	                        updateProductTypeArr.push({"id":0,"ownerBizType":"producttype","typeValue":"未分类"});
		        			$('.productTypeAddNClass').jqxComboBox({
	        					source:updateProductTypeArr
	        				});
        	            } 
        	        },
        	        failure:function(res){
        	        }
        	    });		
        	});
        },
        failure:function(res){
        }
    });
};

Core.showModal = function(settings){
	var defaults = {
			type:"",
			broth:"",
			show:true,
			callback : function(res){
				
			}
	};
	settings = $.extend(true,defaults, settings);
	
	$.myBroth=settings.broth;
	
	if($("#segment-"+settings.type).length == 0){
		$.get("page/common/segment/"+settings.type+".html?v=2016-08-22",function(res){
			var html = $(res);
			$('body').append(html);
			settings.callback(res);
			getData('obti-'+settings.type,settings.type);
			if(settings.show)
			$("#segment-"+settings.type).modal("show");
			$("#segment-"+settings.type).on('shown.bs.modal', function () {
				loadHtml('obti-'+settings.type,ComboBoxSources.getRecords(settings.type));
			});
		});
	}else{
		//loadHtml('obti-'+settings.type,ComboBoxSources.getRecords(settings.type));
		if(settings.show)
		$("#segment-"+settings.type).modal("show");
	}
};



