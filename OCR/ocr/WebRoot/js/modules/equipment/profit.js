var ProfitMgt = function(){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	this.date = new Date();
	var rowdata = null;
	
	//初始化页面所有的控件
	this.initInput = function(){
		$("#profit-sendEmail").css('display','none');
		$("#profit_nowDate").text(me.setDate());
		$("#profit_comname").text(currentUserInfo.name);
		me.setTime();
		me.getTableData();
		me.initPages();
	}
	
	//时间改变
	$("#profit-time").bind('focus,blur',function(){
		var time = $("#profit-time").val();
		$("#profit_nowDate").text('');
		$("#profit_nowDate").text(time);
	})
	//设置搜索时间
	this.setTime = function(){
		$('#profit-time').monthpicker({callback:'dasdasd'});
	}
	this.initPages = function(){
		if($('#main-changeLanguage').html() == "中文" ){
			$('#profit-search').html('&nbsp;&nbsp;Search&nbsp;&nbsp;&nbsp;');
			$('#profit-print').html('&nbsp;&nbsp;Print&nbsp;&nbsp;&nbsp;');
			$('#profit-out').html('&nbsp;&nbsp;Export&nbsp;&nbsp;&nbsp;');
			$('#profit-searchDate').html('Date');
			$('#profit-headMsg').html('Income Statement');
//			$('#profit_comname').html('SuZhou Yi Cui Network Technology co., LTD');
//			$('#profit-table02').html("China's Accounting Standards 02 Report")
			
			//设置时间
			var setDate = function(){
				var year = me.date.getFullYear();
				var month = me.date.getMonth();
				month = month + 1;
				var day = me.date.getDate();
				if(month < 10){
					month = "0" + month;
				}
				if(day < 10){
					day = "0" + day;
				}
				return day+'/'+month+'/'+year;
			}
			$('#profit_nowDate').html(setDate());
			$('#profit-unit').html('Unit：RMB');
			
			//渲染表数据
			var profitDataThead = $('#profitDataTable>thead>tr>th');
			profitDataThead.eq(0).html('Items');
			profitDataThead.eq(1).html('Line No.');
			profitDataThead.eq(2).html('Accumulated Amount For The Year');
			profitDataThead.eq(3).html('Accumulated Amount For The Month');
		}
	}
	
	//请求表数据
	this.getTableData = function(){
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			url: url+new Base64().encode("tosys/coaReport/monthAmt/profit/"+$('#profit-time').val()+'/'+currentUserInfo.id+"/"+currentUserInfo.loginId),
			callback:function(res){ //表数据
				rowdata = res;
				var sequence;
				var itemVale1;
				var itemVale2;
				for(var i=0;i<res.length;i++){
					sequence = res[i].sequence;//行数
					itemVale1 = res[i].itemVale1;//本月累计
					itemVale2 = res[i].itemVale2;//本年累计金额
					me.setTableData(sequence,itemVale1,itemVale2);
				}
				
				me.setTextStyle();//设置表样式
				
				//TODO 加以权限切换中英文
				if($('#main-changeLanguage').html() == "中文"){
					var profitDataTd = $('#profitDataTable>tbody>tr');
					for(var i=0; i<profitDataTd.length; i++){
						profitDataTd.find('td:first').eq(i).html(res[i].itemEnglishName);
					}
				}
			}
		});
		return rowdata;
	}
	
	//设置表样式
	this.setTextStyle=function(){
		$("#profitDataTable tr:gt(0)").each(function(){
			$(this).find('td').each(function(i){
				if(i==1){
					$(this).attr('class','text-center');
				}
				if(i==2||i==3){
					$(this).attr('class','p-r-10 text-right');
				}
			});
		});
	}
	
	//循环表，添加数据
	this.setTableData = function(sequence,itemVale1,itemVale2){
		$("#profitDataTable tr:gt(0)").each(function(i,v){
			$(this).find('td').each(function(m){
				if(m==1){
					var value = $(this).text();
					if(value == sequence){
						$(this).next().text(formatNum(itemVale2));
						$(this).next().next().text(formatNum(itemVale1));
					}else{
						if($(this).next().text()== "" || $(this).next().next().text() == ""){
							$(this).next().text(0);
							$(this).next().next().text(0);
						}else{ //如果添加过数据，则不允许覆盖
							
						}
					}
				}
			});
		});
	}
	
	//设置时间
	this.setDate = function(){
		var year = me.date.getFullYear();
		var month = me.date.getMonth();
		month = month + 1;
		var day = me.date.getDate();
		if(month < 10){
			month = "0" + month;
		}
		if(day < 10){
			day = "0" + day;
		}
		return year+"年"+month+"月"+day+"日";
	}
	
	//返回当前年份和月份
	this.getYearAndMonth = function(){
		var year = me.date.getFullYear();
		var month = me.date.getMonth();
		month = month + 1;
		if(month < 10){
			month = "0" + month;
		}
		return year+"-"+month;
	}
}

var ProfitBindModle = function(profitMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	
	//每次点击搜索按钮请求表数据
	this.searchTableData = function(yearMonth){
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			url: url+new Base64().encode("tosys/coaReport/monthAmt/profit/"+yearMonth+'/'+currentUserInfo.id+"/"+currentUserInfo.loginId),
			callback:function(res){ //表数据
				var sequence;
				var itemVale1;
				var itemVale2;
				for(var i=0;i<res.length;i++){
					sequence = res[i].sequence;
					itemVale1 = res[i].itemVale1;
					itemVale2 = res[i].itemVale2;
					profitMgt.setTableData(sequence,itemVale1,itemVale2);
				}
			}
		});
	}
	
	//每次点击搜索，先清空表格数据
	this.emptyTable = function(yearMonth){
		$("#profitDataTable tr:gt(0)").each(function(){
			$(this).find('td').each(function(x,y){
				if(x==2||x==3){
					$(this).text('');
				}
			});
		})
		me.searchTableData(yearMonth);
	}
	
	this.bind = function(){
		//点击搜索
		$("#profit-search").on("click",function(){
			var yearMonth = $("#profit-time").val();
			if(yearMonth == ''){
				yearMonth = profitMgt.getYearAndMonth();
			}
			$("#profit_nowDate").text(yearMonth);
			me.emptyTable(yearMonth);
		});
	}
	
	this.unbindAll = function(){
		$("#profit-search").off('click');
	}
	
	//导出
	$("#profit-out").on({
		"click":function(){
			var time = profitMgt.getYearAndMonth();
			var dateTime =  $('#profit-time').val();
			if(dateTime.length==11){
				dateTime = time;
			}
			if($('#main-changeLanguage').text()=='中文'){
				var url = new Base64().encode("tosys/coaReport/export/profitEnglish/"+dateTime+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId);
			}else{
				var url = new Base64().encode("tosys/coaReport/export/profit/"+dateTime+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId);
			}
			$.openHref(_global_settings.service.url+'/ac/exportReport/'+url);
		}
	});
	
	//打印
	$('#profit-print').on('click',function(){
		var time = profitMgt.getYearAndMonth();
		var dateTime =  $('#profit-time').val();
		if(dateTime.length==11){
			dateTime = time;
		}
//		debugger;
		if($('#main-changeLanguage').text()=='中文')
			var url = new Base64().encode("reportName=ProfitPrintEN&date="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
		else
			var url = new Base64().encode("reportName=ProfitPrint&date="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
		window.open(_global_settings.service.url+"/ac/print/"+url);
	});
}