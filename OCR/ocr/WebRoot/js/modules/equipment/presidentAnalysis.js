/**
 * 运营分析
 */

var PresidentAnalysisMgt = function(){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
//	var url2 = common
	this.date = new Date();
	
	//初始化页面所有的控件
	this.initInput = function(){
		$("#presidentAnalysis_nowDate").text(me.setDate());
		$("#presidentAnalysis_comname").text(currentUserInfo.name);
		me.setTime();
//		me.setDate();
		me.getTableData();
		me.initPages();
	}
	
	this.initPages = function(){
		if($('#main-changeLanguage').html() == "中文" ){
			$('#president-searchdate').text('Date');
			$('#presidentAnalysis-search').text("Search");
			$('#presidentAnalysis-refresh').text("Refresh");
			$('#presidentAnalysis-print').text("print");
			$('#presidentAnalysis-out').text("Export");
			$('#presidentAnalysis-headMsg').text("Operation Analysis");
			
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
			$('#presidentAnalysis_nowDate').text(setDate());
			$('#presidentAnalysis-unit').text("Unit：RMB");
			
			//渲染表数据
			var presidentDataThead = $('#presidentAnalysisDataTable>thead>tr>th');
			presidentDataThead.eq(0).html('Items');
			presidentDataThead.eq(1).html('Line No.');
			presidentDataThead.eq(2).html('Current amount/Ratio');
			presidentDataThead.eq(3).html('Accumulated Amount For The Month');
			presidentDataThead.eq(4).html('Compared with the previous period');
			presidentDataThead.eq(5).html('With the proportion of the previous period');
			presidentDataThead.eq(6).html('Financial analysis and suggestion');
			
			var presidentDataTbody = $('#presidentAnalysisDataTable>tbody>tr');
			presidentDataTbody.eq(0).text("Capital Operation");
			presidentDataTbody.eq(1).find('td:first').text("Income");
			presidentDataTbody.eq(2).find('td:first').text("Expend");
			presidentDataTbody.eq(3).find('td:first').text("Net Income ");
			
			presidentDataTbody.eq(4).text("The Profits Of profit and loss");
			presidentDataTbody.eq(5).find('td:first').text("Income");
			presidentDataTbody.eq(6).find('td:first').text("Cost");
			presidentDataTbody.eq(7).find('td:first').text("Net Profit (negative net loss)");
			
			presidentDataTbody.eq(8).text("Short Term Solvency Ratio");
			presidentDataTbody.eq(9).find('td:first').text("Working Capital");
			presidentDataTbody.eq(10).find('td:first').text("Current ratio");
			presidentDataTbody.eq(11).find('td:first').text("Quick Ratio");
			presidentDataTbody.eq(12).find('td:first').text("Cash Ratio");
			
			presidentDataTbody.eq(13).text("Long-term Solvency Ratios");
			presidentDataTbody.eq(14).find('td:first').text("Debt To Assets Ratio");
			presidentDataTbody.eq(15).find('td:first').text("Equity Ratio");
			presidentDataTbody.eq(16).find('td:first').text("Equity Multiplier EM");
			presidentDataTbody.eq(17).find('td:first').text("Debt-to-long Capital Ratio");
			
			presidentDataTbody.eq(18).text("Operating Capacity Ratio");
			
			presidentDataTbody.eq(19).find('td').eq(0).text("Receivables Turnover Ratio");
			presidentDataTbody.eq(19).find('td').eq(1).text("Receivables Turnover Number");
			presidentDataTbody.eq(20).find('td:first').text("Receivables Turnover Days");
			presidentDataTbody.eq(21).find('td:first').text("Accounts Receivable And Income Ratio");
			
			presidentDataTbody.eq(22).find('td').eq(0).text("Inventory Turnover Ratio");
			presidentDataTbody.eq(22).find('td').eq(1).text("Inventory Turnover Number");
			presidentDataTbody.eq(23).find('td:first').text("Inventory Turnover Days");
			presidentDataTbody.eq(24).find('td:first').text("Inventory To Income Ratio");
			
			presidentDataTbody.eq(25).find('td').eq(0).text("Current Asset Turnover");
			presidentDataTbody.eq(25).find('td').eq(1).text("Current Asset Turnover Number");
			presidentDataTbody.eq(26).find('td:first').text("Current Asset Turnover Days");
			presidentDataTbody.eq(27).find('td:first').text("Current Asset And Income Ratio");
			
			presidentDataTbody.eq(28).find('td').eq(0).text("Non Current Asset Turnover Ratio");
			presidentDataTbody.eq(28).find('td').eq(1).text("Non Current Asset Turnover Ratio Number");
			presidentDataTbody.eq(29).find('td:first').text("Non Current Asset Turnover Ratio Days");
			presidentDataTbody.eq(30).find('td:first').text("Non Current Asset And Income Ratio");
			
			presidentDataTbody.eq(31).find('td').eq(0).text("Total Assets Turnover");
			presidentDataTbody.eq(31).find('td').eq(1).text("Total Assets Turnover Number");
			presidentDataTbody.eq(32).find('td:first').text("Total Assets Turnover Days");
			presidentDataTbody.eq(33).find('td:first').text("Total Assets And Income Ratio");
			
			presidentDataTbody.eq(34).text("Profitability Ratios");
			presidentDataTbody.eq(35).find('td:first').text("Net Profit Margin on Sales/Net profit margin");
			presidentDataTbody.eq(36).find('td:first').text("Rate Of Return On Total Assets");
			presidentDataTbody.eq(37).find('td:first').text("ROE (Rate of Return on Common Stockholders’ Equity)");
			
			$('#presidentAnalysisDataTable>tbody>tr').find('td:last').text('Detail');
			$('#alertDet-msg').text('Senior financial experts wait for you to provide advisory services, please call (0086 400-7788-966 Transfer 1)');
			$('#presidentAnalysis-confirm').text('OK');
		}
	}
	
	//时间改变
	$("#presidentAnalysis-time").bind('focus,blur',function(){
		console.log("++");
		var time = $("#presidentAnalysis-time").val();
		$("#presidentAnalysis_nowDate").text('');
		$("#presidentAnalysis_nowDate").text(time);
	})

	//设置搜索时间
	this.setTime = function(){
		$('#presidentAnalysis-time').monthpicker({callback:'dasdasd'});
//		$("#presidentAnalysis-time").datetimeinput({formatString:"yyyy-MM", width: '120px', height: '34px'});
//		$("#presidentAnalysis-time").jqxDateTimeInput('val',new Date()); //设置结束日期默认为当天
	}
	
	//请求表数据
	this.getTableData = function(){
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:false,
			url:url +new Base64().encode('tosys/coaReport/presidentAnaly/'+me.getYearAndMonth()+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback:function(res){ //表数据
//				console.log(res);
				var sequence;
				var lastmothAmt;
				var mothAmt;
				var mothaCompare;
				var mothaPercentage;
				for(var i=0;i<res.length;i++){
					sequence = res[i].sequence;
					lastmothAmt = res[i].lastmothAmt;
					mothAmt = res[i].mothAmt;
					mothaCompare = res[i].mothaCompare;
					mothaPercentage = res[i].mothaPercentage;
					me.setTableData(sequence,mothAmt,lastmothAmt,mothaCompare,mothaPercentage);
				}
				//me.setPercent();
				me.setTextStyle();//设置表样式
			}
		});
	}
/*	this.setPercent=function(){
		$.each($('.sortb'),function(){
			$(this).nextAll().eq(0).text($(this).nextAll().eq(0).text()+'%');
			$(this).nextAll().eq(1).text($(this).nextAll().eq(1).text()+'%');
			$(this).nextAll().eq(2).text($(this).nextAll().eq(2).text()+'%');
		})
	}*/
	//设置表样式
	this.setTextStyle=function(){
		$("#presidentAnalysisDataTable tr:gt(0)").each(function(){
			$(this).find('.sort').each(function(i){
				//data-toggle="modal" data-target="#addCustomerClientMgtAddPerson"
					$(this).attr('class','sort text-center');
					$(this).nextAll().attr('class','text-right');
					$(this).nextAll().eq(-1).attr('class','text-center color-1193C5 hoverspan').attr('data-toggle','modal').attr('data-target','#alertDet');
			});
			$(this).find('.sortb').each(function(i){
				//data-toggle="modal" data-target="#addCustomerClientMgtAddPerson"
					$(this).attr('class','sortb text-center');
					$(this).nextAll().attr('class','text-right');
					$(this).nextAll().eq(-1).attr('class','text-center color-1193C5 hoverspan').attr('data-toggle','modal').attr('data-target','#alertDet');
			});
			$(this).find('.sortc').each(function(i){
				//data-toggle="modal" data-target="#addCustomerClientMgtAddPerson"
					$(this).attr('class','sortc text-center');
					$(this).nextAll().attr('class','text-right');
					$(this).nextAll().eq(-1).attr('class','text-center color-1193C5 hoverspan').attr('data-toggle','modal').attr('data-target','#alertDet');
			});
		});
	}
	
	//循环表，添加数据
	this.setTableData = function(sequence,mothAmt,lastmothAmt,mothaCompare,mothaPercentage){
	
		$.each($('.sort'),function(i,value){
			if($(this).text()==sequence){				
				$(this).nextAll().eq(0).text(money(mothAmt));
				$(this).nextAll().eq(1).text(money(lastmothAmt));
				$(this).nextAll().eq(2).text(money(mothaCompare));
				$(this).nextAll().eq(3).text(money(mothaPercentage));
				$(this).nextAll().eq(-1).text("详情");
				if($('#main-changeLanguage').html() == "中文" ){
					$(this).nextAll().eq(-1).text("Detail");
				}
			}
		})
			$.each($('.sortb'),function(i,value){
				if($(this).text()==sequence){				
					$(this).nextAll().eq(0).text(money(mothAmt)+'%');
					$(this).nextAll().eq(1).text(money(lastmothAmt)+'%');
					$(this).nextAll().eq(2).text(money(mothaCompare)+'%');
					$(this).nextAll().eq(3).text(money(mothaPercentage));
					$(this).nextAll().eq(-1).text("详情");
					if($('#main-changeLanguage').html() == "中文" ){
						$(this).nextAll().eq(-1).text("Detail");
					}
				}
			})
				$.each($('.sortc'),function(i,value){
					if($(this).text()==sequence){				
						$(this).nextAll().eq(0).text(mothAmt);
						$(this).nextAll().eq(1).text(lastmothAmt);
						$(this).nextAll().eq(2).text(mothaCompare);
						$(this).nextAll().eq(3).text(mothaPercentage);
						$(this).nextAll().eq(-1).text("详情");
						if($('#main-changeLanguage').html() == "中文" ){
							$(this).nextAll().eq(-1).text("Detail");
						}
					}
				})
			
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

var PresidentAnalysisBindModle = function(presidentAnalysisMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	
	//每次点击搜索按钮请求表数据
	this.searchTableData = function(yearMonth){
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			showWaiting:false,
			url:url +new Base64().encode('tosys/coaReport/presidentAnaly/'+yearMonth+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback:function(res){ //表数据
				var sequence;
				var lastmothAmt;
				var mothAmt;
				var mothaCompare;
				var mothaPercentage;
				for(var i=0;i<res.length;i++){
					sequence = res[i].sequence;
					lastmothAmt = res[i].lastmothAmt;
					mothAmt = res[i].mothAmt;
					mothaCompare = res[i].mothaCompare;
					mothaPercentage = res[i].mothaPercentage;
					presidentAnalysisMgt.setTableData(sequence,mothAmt,lastmothAmt,mothaCompare,mothaPercentage);
				}
				
			}
		});
	}
	
	//每次点击搜索，先清空表格数据
	this.emptyTable = function(yearMonth){
		$("#presidentAnalysisDataTable tr:gt(0)").each(function(){
			$(this).find('.sort').each(function(x,y){				
					$(this).nextAll().text('');			
			});
		})
		me.searchTableData(yearMonth);
	}
	
	this.bind = function(){
		//点击搜索
		$("#presidentAnalysis-search").on("click",function(){
			var yearMonth = $("#presidentAnalysis-time").val();
			if(yearMonth == ''){
				yearMonth = presidentAnalysisMgt.getYearAndMonth();
			}
			$("#presidentAnalysis_nowDate").text(yearMonth);
			me.emptyTable(yearMonth);
		});
		$("#presidentAnalysis-refresh").on("click",function(){	
			$.addTab({title:"运营分析",isFrame:false,url:ctx+"/page/modules/equipment/presidentAnalysis.html",pk:{random:Math.random()},reload:true});			
	});
		//导出
		$("#presidentAnalysis-out").on({
			"click":function(){
				var yearMonth = $("#presidentAnalysis-time").val();
				if(yearMonth == ''){
					yearMonth = presidentAnalysisMgt.getYearAndMonth();
				}
				if($('#main-changeLanguage').html() == "中文" )
					$.openHref(_global_settings.service.url+'/ac/exportReport/'+new Base64().encode("tosys/coaReport/export/presidentAnalysisEnglish/"+yearMonth+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId));
				else
					$.openHref(_global_settings.service.url+'/ac/exportReport/'+new Base64().encode("tosys/coaReport/export/presidentAnalysis/"+yearMonth+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId));
			}
		});
		
	}
	
	this.unbindAll = function(){
		$("#presidentAnalysis-search").off('click');
	}
	//打印
	$('#presidentAnalysis-print').on('click',function(){
		if($('#main-changeLanguage').html() == "中文" )
			window.open(_global_settings.service.url+"/ac/print/"+new Base64().encode("reportName=OperationAnalysisEN&moth="+$('#presidentAnalysis-time').val()+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId));
		else
			window.open(_global_settings.service.url+"/ac/print/"+new Base64().encode("reportName=OperationAnalysis&moth="+$('#presidentAnalysis-time').val()+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId));
	})

}