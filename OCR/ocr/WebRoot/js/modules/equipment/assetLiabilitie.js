var AssetliabilitieMgt = function(){
	var me=this;
	var url = _global_settings.service.url+"/ac/"; 
	this.date = new Date();
	this.random = Math.random();
	
	//初始化页面所有的控件
	this.initInput = function(){
		$('#asset-sendEmail').css('display','none');
		$("#assetLiabilitie_nowDate").text(me.setDate());
		$('#asset-time').monthpicker({callback:'dasdasd'});
		$("#asset_comname").text(currentUserInfo.name);
		me.getTableData();
		me.initPages();
	}
	
	this.initPages = function(){
		if($('#main-changeLanguage').html() == "中文"){
			$('#asset-search').html('&nbsp;&nbsp;Search&nbsp;&nbsp;&nbsp;');
			$('#assert-print').html('&nbsp;&nbsp;Print&nbsp;&nbsp;&nbsp;');
			$('#asset-out').html('&nbsp;&nbsp;Export&nbsp;&nbsp;&nbsp;');
			$('#asset-searchDate').html('Date');
//			$('#asset_comname').html('SuZhou Yi Cui Network Technology co., LTD');
			$('#asset-headMsg').html('Balance Sheet');
			$('#asset-refresh').html('Refresh');
//			$('#asset-table01').html("China's Accounting Standards 01 Report")
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
			$('#assetLiabilitie_nowDate').html(setDate());
			$('#asset_unit').html('Unit：RMB');
			
			//渲染表数据
			var profitDataThead = $('#assetLiabilitieDateTable>thead>tr>th');
			profitDataThead.eq(0).html('Assets');
			profitDataThead.eq(1).html('Line No.');
			profitDataThead.eq(2).html('End. balance ');
			profitDataThead.eq(3).html('Beg. balance ');
			profitDataThead.eq(4).html("Liabilities & Owners('Stockholders') equity ");
			profitDataThead.eq(5).html('Line No.');
			profitDataThead.eq(6).html('End. balance ');
			profitDataThead.eq(7).html('Beg. balance ');
			
			$('#assetLiabilitieDateTable>tbody>tr').eq(0).find('td').eq(0).text('Current Assets');
			$('#assetLiabilitieDateTable>tbody>tr').eq(0).find('td').eq(4).text('Current liabilities');
			$('#assetLiabilitieDateTable>tbody>tr').eq(16).find('td').eq(0).text('Non Floating Assets');
			$('#assetLiabilitieDateTable>tbody>tr').eq(12).find('td').eq(4).text('Non Liabilities Assets');
			$('#assetLiabilitieDateTable>tbody>tr').eq(25).find('td').eq(4).text("Owner's Equity (Or Shareholders' Equity):");
		}
	}
	
	//重置id并设置td内容样式
	this.setIdAndTextAlign = function(){
		$("#assetLiabilitieDateTable tr:gt(0)").each(function(i,v){ //循环遍历表格，从第二行开始
			var id = $(this).attr("id");
			if(id!=undefined){
				$(this).attr("id",id+me.random);
			}
		})
	};
	
	//请求表数据
	this.getTableData = function(){
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			url: url+new Base64().encode("tosys/coaReport/loanAmt/liabilities/"+$('#asset-time').val()+'/'+currentUserInfo.id+"/"+currentUserInfo.loginId),
			callback:function(res){ //表数据
				var sequence;
				var itemVale1;
				var itemVale2;
				var assetItems;
				for(var i=0;i<res.length;i++){
					sequence = res[i].sequence; //非数字，则为NaN
					itemVale1 = res[i].itemVale1;
					itemVale2 = res[i].itemVale2;
					assetItems = res[i].itemEnglishName;
					me.setDataToTable(sequence,itemVale1,itemVale2,assetItems);
				}
				
				me.setTextStyle();//设置表样式
				if($('#main-changeLanguage').html() == "中文"){
					var assetLiabilitiesTd = $('#assetLiabilitieDateTable>tbody>tr');
					for(var i=0; i<assetLiabilitiesTd.length; i++){
						if(sequence != '-'){
							
						}
//						assetLiabilitiesTd.find('td:first').eq(i).html(res[i].itemEnglishName);
					}
				}
			}
		});
	}
	
	//设置表样式
	this.setTextStyle=function(){
		$("#assetLiabilitieDateTable tr:gt(0)").each(function(){
			$(this).find('td').each(function(i){
				if(i==1||i==5){
					$(this).attr('class','text-center');
				}
				if(i==2||i==3){
					$(this).attr('class','p-r-8 text-right');
				}
				if(i==6||i==7){
					$(this).attr('class','p-r-10 text-right');
				}
			});
		});
	}
	
	//循环表，添加数据
	this.setDataToTable = function(sequence,itemVale1,itemVale2,assetItems){
		$("#assetLiabilitieDateTable tr:gt(0)").each(function(i,v){
			if(sequence != "-"){ //如果sequence是数字
				$(this).find('td').each(function(m,n){
					if(m==1||m==5){  //每一行下的第2个td和第6个td
						var value = $(this).text();
						if(value != "-"){ //value是数字
							if(value == sequence){ //找到对应的行次，添加下一个，下下一个表格数据
								$(this).next().text(formatNum(itemVale1));
								$(this).next().next().text(formatNum(itemVale2));
								if($('#main-changeLanguage').html() == "中文"){
									console.log($(this).prev());
//									$("#assetLiabilitieDateTable tr:gt(0)").eq(i).find('td:first').text(assetItems);
									$(this).prev().text(assetItems);
								}
							}else{
								if($(this).next().text() =="" || $(this).next().next().text() == ""){
									$(this).next().text(0);
									$(this).next().next().text(0);
								}else{ //如果已经添加过数据，则不能覆盖
									
								}
							}
						}else{
							
						}
					}
				})
			}
		});
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
	
}

var AssetliabilitieBindModle = function(assetliabilitieMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	
	//每次点击搜索请求表数据
	this.searchTableData = function(yearMonth){
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			url: url+new Base64().encode("tosys/coaReport/loanAmt/liabilities/"+yearMonth+'/'+currentUserInfo.id+"/"+currentUserInfo.loginId),
			callback:function(res){ //表数据
				var sequence;
				var itemVale1;
				var itemVale2;
				for(var i=0;i<res.length;i++){
					sequence = res[i].sequence; //非数字，则为NaN
					itemVale1 = res[i].itemVale1;
					itemVale2 = res[i].itemVale2;
					assetliabilitieMgt.setDataToTable(sequence,itemVale1,itemVale2);
				}
			}
		});
	}
	
	//每次点击搜索，先清空表格数据
	this.emptyTable = function(yearMonth){
		$("#assetLiabilitieDateTable tr:gt(0)").each(function(){
			$(this).find('td').each(function(x){
				if(x==2||x==3||x==6||x==7){
					$(this).text('');
				}
			})
		});
		me.searchTableData(yearMonth);
	}
	
	this.bind = function(){
		//点击搜索
		$("#asset-search").on('click',function(){
			var yearMonth = $("#asset-time").val();
			if(yearMonth == ''){
				yearMonth = assetliabilitieMgt.getYearAndMonth();
			}
			$("#assetLiabilitie_nowDate").text(yearMonth);
			me.emptyTable(yearMonth);
		});
	}
	
	this.unbindAll = function(){
		$("#asset-search").off('click');
	}
	
	//导出
	$("#asset-out").on({
		"click":function(){
			var time = assetliabilitieMgt.getYearAndMonth();
			var dateTime =  $('#asset-time').val();
			if(dateTime.length==11){
				dateTime = time;
			}
			if($('#main-changeLanguage').text()=='中文')
				var url = new Base64().encode("tosys/coaReport/export/assetLiabilitieEnglish/"+dateTime+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId);
			else
				var url = new Base64().encode("tosys/coaReport/export/assetLiabilitie/"+dateTime+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId);
			$.openHref(_global_settings.service.url+'/ac/exportReport/'+url);
		}
	});
	
	//打印
	$('#assert-print').on('click',function(){
		var time = assetliabilitieMgt.getYearAndMonth();
		var dateTime =  $('#asset-time').val();
		if(dateTime.length==11){
			dateTime = time;
		}
		if($('#main-changeLanguage').html() == "中文")
			var url = new Base64().encode("reportName=LiabilitiesPrintEN&date="+$('#asset-time').val()+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
		else
			var url = new Base64().encode("reportName=LiabilitiesPrint&date="+$('#asset-time').val()+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
		window.open(_global_settings.service.url+"/ac/print/"+url);
	});
	
}