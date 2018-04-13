var ProfitQuarterReportMgt = function(){
	var me=this;
	var url = _global_settings.service.url+'/ac/';
	this.random = Math.random();
	//this.profitQuarterReportId = null;
	this.yearAmt = null;
	this.monthAmt = null;
	this.date = new Date();
	//初始化页面所有的控件
	this.initInput = function(){
		//me.setIdAndTextAlign();
		$("#profitQuarterReport_nowDate").text(me.setDate());
		$('#profitQuarterReport-time').monthpicker({callback:'dasdasd'});
		$('#profitQuarterReport-time').val($('#profitQuarterReport-time').val().substring(0,4));
		$("#profitQuarterReport_comname").text(currentUserInfo.name);
		me.getTableData();
		me.initPages();
	}
	
	this.initPages = function(){
		if($('#main-changeLanguage').html() == "中文" ){
			$('#profitQuarterReport-search').html('&nbsp;&nbsp;Search&nbsp;&nbsp;&nbsp;');
			$('#profitQuarterReport-print').html('&nbsp;&nbsp;Print&nbsp;&nbsp;&nbsp;');
			$('#profitQuarterReport-out').html('&nbsp;&nbsp;Export&nbsp;&nbsp;&nbsp;');
			$('#profitQuarter-searchDate').html('Date');
			$('#profitQuarter-headMsg').html('Quarterly Statement');
			$('#profitQuarterReport-refresh').html('Refresh');
//			$('#profitQuarterReport_comname').html('SuZhou Yi Cui Network Technology co., LTD');
//			$('#profit-table04').html("China's Accounting Standards 04 Report")
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
			$('#profitQuarterReport_nowDate').html(setDate());
			$('#profitQuarterReport_unit').html('Unit：RMB');
			
			//渲染表数据
			var profitDataThead = $('#profitQuarterReportDataTable>thead>tr>th');
			profitDataThead.eq(0).html('Items');
			profitDataThead.eq(1).html('Line No:');
			profitDataThead.eq(2).html('Accumulated Amount For The Year');
			profitDataThead.eq(3).html('First Quarter');
			profitDataThead.eq(4).html('Second Quarter');
			profitDataThead.eq(5).html('Third Quarter');
			profitDataThead.eq(6).html('Fourth Quarter');
		}
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
	
	//返回当前年份
	/*this.getYearAndMonth = function(){
		var year = me.date.getFullYear();
		var month = me.date.getMonth();
		month = month + 1;
		if(month < 10){
			month = "0" + month;
		}
		return year+"-"+month;
	}*/
	this.getYear = function(){
	var year = me.date.getFullYear();
	return year;
}
	//请求表数据
	this.getTableData= function(){
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:false,
			url:url +new Base64().encode("tosys/coaReport/quarterAmt/profit/"+me.getYear()+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback:function(res){ //表数据
				console.log(res);
				
				for(var i=0;i<res.length;i++){
					me.sequence = res[i].sequence;//行数
					//me.itemVale1 = res[i].itemVale1;//本月金额
					me.itemVale2 = res[i].itemVale2;//本年累计金额
					me.itemVale3 = res[i].itemVale3;//第一季度金额
					me.itemVale4 = res[i].itemVale4;//第二季度金额
					me.itemVale5 = res[i].itemVale5;//第三季度金额
					me.itemVale6 = res[i].itemVale6;//第四季度金额
					me.addDataToTable(me.sequence,me.itemVale2,me.itemVale3,me.itemVale4,me.itemVale5,me.itemVale6);
				}
//				me.calculate();
				me.setTextStyle();//设置表样式
				
				if($('#main-changeLanguage').html() == "中文"){
					var profitQuarterReportTd = $('#profitQuarterReportDataTable>tbody>tr');
					for(var i=0; i<profitQuarterReportTd.length; i++){
						profitQuarterReportTd.find('td:first').eq(i).html(res[i].itemEnglishName);
					}
				}
			}
		});
	}
	
	//设置表样式
	this.setTextStyle=function(){
		$("#profitQuarterReportDataTable tr:gt(0)").each(function(i,v){
			var id = $(this).attr('id');
			if(id!=undefined){
				$(this).find('td').each(function(i){
					if(i==2||i==3||i==4||i==5||i==6){
						$(this).attr('class','p-r-10 text-right');
					}
				});
			}
		});
	}
	
	//循环表，添加数据
	this.addDataToTable = function(sequence,itemVale2,itemVale3,itemVale4,itemVale5,itemVale6){
		$("#profitQuarterReportDataTable tr:gt(0)").each(function(i,v){
			$(this).find('td').each(function(m){
				if(m==1){
					var value = $(this).text();
					if(value == sequence){
						$(this).next().text(formatNum(itemVale2));
						$(this).next().next().text(formatNum(itemVale3));
						$(this).next().next().next().text(formatNum(itemVale4));
						$(this).next().next().next().next().text(formatNum(itemVale5));
						$(this).next().next().next().next().next().text(formatNum(itemVale6));
					
					}else{
						if($(this).next().text()== "" || $(this).next().next().text() == ""
							||$(this).next().next().next().text() == ""||$(this).next().next().next().next().text() == ""||
							$(this).next().next().next().next().next().text() == ""){
							$(this).next().text(0);
							$(this).next().next().text(0);
							$(this).next().next().next().text(0);
							$(this).next().next().next().next().text(0);
							$(this).next().next().next().next().next().text(0);
						
						
						}else{ //如果添加过数据，则不允许覆盖
							
						}
					}
				}
			});
		});
	}
	
}	

var ProfitQuarterReportBindModle = function(profitQuarterReportMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	
	//每次点击搜索请求表数据
	this.searchTableData = function(year){
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:false,
			url:url +new Base64().encode("tosys/coaReport/quarterAmt/profit/"+year+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),//yearMonth
			callback:function(res){ //表数据
				for(var i=0;i<res.length;i++){
					me.sequence = res[i].sequence;
					//me.itemVale1 = res[i].itemVale1;//本月金额
					me.itemVale2 = res[i].itemVale2;//本年累计金额
					me.itemVale3 = res[i].itemVale3;//第一季度金额
					me.itemVale4 = res[i].itemVale4;//第二季度金额
					me.itemVale5 = res[i].itemVale5;//第三季度金额
					me.itemVale6 = res[i].itemVale6;//第四季度金额
					profitQuarterReportMgt.addDataToTable(me.sequence,me.itemVale2,me.itemVale3,me.itemVale4,me.itemVale5,me.itemVale6);
				}
			}
		});
	}
	
	//每次点击搜索，先清空表格数据
	this.emptyTable = function(year){
	
		$("#profitQuarterReportDataTable tr:gt(0)").each(function(i,v){ //循环遍历表格，从第二行开始
			var id = $(this).attr("id");
			if(id!=undefined){ //排除未定义id的行
				if(id.substring(0,3)>=100){
					id = id.substring(0,2);
				}else{
					id = id.substring(0,1);
				}
				$(this).find('td').each(function(i){ //找到每一行下的td
					if(i!=0&&i!=1){ //排除每一行下的第一个和第二个td
						$(this).text('');
					}
				});
			}
		});
		me.searchTableData(year);
	}
	
	this.bind = function(){
		//mee
		$('#profitQuarterReport-time').on('change',function(){
			$(this).val($(this).val().substring(0,4));
		});
		//点击搜索profitQuarterReport-refresh
		$("#profitQuarterReport-search").on('click',function(){
		
			/*var yearMonth = $("#profitQuarterReport-time").val();
			if(yearMonth == ''){
				yearMonth = profitQuarterReportMgt.getYearAndMonth();
			}
			$("#profitQuarterReport_nowDate").text(yearMonth);
			me.emptyTable(yearMonth);*/
			var year = $("#profitQuarterReport-time").val();
			if(year == ''){
				year= profitQuarterReportMgt.getYearAndMonth();
			}
			$("#profitQuarterReport_nowDate").text(year);
			me.emptyTable(year);
		});
		
		//导出
		$("#profitQuarterReport-out").on({
			
			"click":function(){
				var year = $("#profitQuarterReport-time").val();
				if(year == ''){
					year= profitQuarterReportMgt.getYearAndMonth();
				}
				if($('#main-changeLanguage').text()=='中文')
					$.openHref(_global_settings.service.url+'/ac/exportReport/'+new Base64().encode("tosys/coaReport/export/profitQuarterReportEnglish/"+year+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId))
				else
					$.openHref(_global_settings.service.url+'/ac/exportReport/'+new Base64().encode("tosys/coaReport/export/profitQuarterReport/"+year+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId))
			}
		});
		//点击刷新profitQuarterReport-refresh
		$("#profitQuarterReport-refresh").off('click').on('click',function(){
			$.addTab({title:"利润表季报",isFrame:false,url:ctx+"/page/modules/equipment/profitQuarterReport.html",pk:{random:Math.random()},reload:true});
		});
	}
	
	this.unbindAll = function(){
		
	}
	//打印事件
	$('#profitQuarterReport-print').on('click',function(){	
		 var oDate = new Date(); 
		 var year=oDate.getFullYear();
		 if($('#main-changeLanguage').html() == "中文" )
			 window.open(_global_settings.service.url+"/ac/print/"+new Base64().encode("reportName=ProfitPrintQuarterEN&date="+year+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId));
		 else
			 window.open(_global_settings.service.url+"/ac/print/"+new Base64().encode("reportName=ProfitPrintQuarter&date="+year+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId));
	})
	
}