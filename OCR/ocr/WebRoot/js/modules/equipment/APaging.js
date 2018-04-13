/**
 * 应付账龄表
 */
var ApagMgt = function(){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
//	var url2 = common
	this.date = new Date();
	this.sumnormalAmt=0;//未超期应收合计
	this.sumdueAmt30=0;//1-30天合计
	this.sumdueAmt60=0;//31-60天合计
	this.sumdueAmt90=0;//61-90天合计
	this.sumdueAmtMore90=0;//大于90天合计
	this.sumdueAmtAll=0;//超期小计合计
	
	//初始化页面所有的控件
	this.initInput = function(){
		$("#apag_nowDate").text(me.setDate());
		$("#apag_comname").text(currentUserInfo.name);
///		me.setTime();
//		me.setDate();
		me.initVendor();
		me.getTableData();
		$('#apaging-show').attr('class','row hiddendiv');
		me.initPages();
	}
	
	this.initPages = function(){
		if($('#main-changeLanguage').html() == "中文"){
			$('#apag-search').text("Search");
			$('#apag-refresh').text("Refresh");
			$('#apag-print').text("Print");
			$('#apag-out').text("Export");
			$('#apag-unit').text("Unit：RMB");
			
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
			$('#apag_nowDate').text(setDate());
			$('#apag-headMsg').text("Accounts Payable Aging Sheet");
			
			//渲染表数据
			var apagDataThead = $('#APDataTable>thead>tr:first>th');
			apagDataThead.eq(0).html('Vendor Name');
			apagDataThead.eq(1).html('No overdue payable');
			apagDataThead.eq(2).html('Overdue ayable');
			apagDataThead.eq(3).html('Subtotal');
			
			var apagDataThead = $('#APDataTable>thead>tr:last>th');
			apagDataThead.eq(0).html('Net term (1-30 days )');
			apagDataThead.eq(1).html('Net term (30-60 days )');
			apagDataThead.eq(2).html('Net term (60-90 days )');
			apagDataThead.eq(3).html('Net term (Above 90 days )');
			
			$('#APDataTable>tbody>tr:last').find('td').eq(0).text('Total');
		}
	}
	
	var supSource=[],arrSup=ComboBoxSources.getRecords('clientInfo');
	for(var i=0;i<arrSup.length;i++){
		if(arrSup[i].vendorType){
			supSource.push(arrSup[i]);
		}
	}
	
	this.initVendor=function(){
		$("#arag-vendor").comboBox({
			source:supSource,
			theme:currentTheme,
			displayMember: "name", 
			valueMember: "name", 
			width:'220px',
			height:'34px',
        	placeHolder:"请选择或输入"
		});
	}
	//时间改变
	$("#apag-time").bind('focus,blur',function(){
		console.log("++");
		var time = $("#apag-time").val();
		$("#apag_nowDate").text('');
		$("#apag_nowDate").text(time);
	})

	//设置搜索时间
	this.setTime = function(){
//		$('#apag-time').monthpicker({callback:'dasdasd'});
//		$("#apag-time").datetimeinput({formatString:"yyyy-MM", width: '120px', height: '34px'});
//		$("#apag-time").jqxDateTimeInput('val',new Date()); //设置结束日期默认为当天
	}
	this.getClientName=function(id){
		var records = ComboBoxSources.getRecords('clientInfo');
		for(var i=0;i<records.length;i++){
			if(records[i].clientInfoid==id){
				return records[i];
			}
		}
		if(!id){
			return '暂无';
		}
	}
	//请求表数据
	this.getTableData = function(){
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:true,
			url:url +new Base64().encode('tosys/coaReport/ap/%20/'+0+'/'+0+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback:function(res){//表数据
//				console.log(res);
				var clientId;
				var dueAmt30;
				var dueAmt60;
				var dueAmt90;
				var dueAmtMore90;
				var dueAmtAll;
				
				for(var i=0;i<res.length;i++){
					clientId = res[i].clientId;
					normalAmt = res[i].normalAmt;
					dueAmt30 = res[i].dueAmt30;
					dueAmt60 = res[i].dueAmt60;
					dueAmt90 = res[i].dueAmt90;
					dueAmtMore90 = res[i].dueAmtMore90;
					dueAmtAll =dueAmt30+dueAmt60+dueAmt90+dueAmtMore90;
					me.setTableData(clientId,normalAmt,dueAmt30,dueAmt60,dueAmt90,dueAmtMore90,dueAmtAll);
				}
				
				me.addLastLine();
				me.setTextStyle();//设置表样式
			}
		});
	}
	
	//设置表样式
	this.setTextStyle=function(){
		$("#APDataTable tr:gt(0)").each(function(){
			$(this).find('td').each(function(i){
				if(i!=0){
					$(this).attr('class','p-r-8 text-right');
				}
			});
		});
	}
	
	//循环表，添加数据                        
	this.setTableData = function(clientId,normalAmt,dueAmt30,dueAmt60,dueAmt90,dueAmtMore90,dueAmtAll){
		
		var line='<tr>'+
				 '<td class="text-left">'+me.getClientName(clientId).name+'</td>'+
				 '<td>'+formatNum(normalAmt)+'</td>'+
				 '<td>'+formatNum(dueAmt30)+'</td>'+
				 '<td>'+formatNum(dueAmt60)+'</td>'+
				 '<td>'+formatNum(dueAmt90)+'</td>'+
				 '<td>'+formatNum(dueAmtMore90)+'</td>'+
				 '<td>'+formatNum(dueAmtAll)+'</td>'+
				 '</tr>';
		me.sumnormalAmt+=normalAmt;
		me.sumdueAmt30+=dueAmt30;
		me.sumdueAmt60+=dueAmt60;
		me.sumdueAmt90+=dueAmt90;
		me.sumdueAmtMore90+=dueAmtMore90;
		me.sumdueAmtAll+=dueAmtAll;
		$("#APDataTbody").append(line);
	}
	
	//添加最后一行
	this.addLastLine=function(){
		var line='<tr>'+
		 '<td class="text-left">'+'合计'+'</td>'+
		 '<td>'+formatNum(me.sumnormalAmt)+'</td>'+
		 '<td>'+formatNum(me.sumdueAmt30)+'</td>'+
		 '<td>'+formatNum(me.sumdueAmt60)+'</td>'+
		 '<td>'+formatNum(me.sumdueAmt90)+'</td>'+
		 '<td>'+formatNum(me.sumdueAmtMore90)+'</td>'+
		 '<td>'+formatNum(me.sumdueAmtAll)+'</td>'+
		 '</tr>';
		$("#APDataTbody").append(line);
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
	this.search=function(){
		me.sumnormalAmt=0;
		me.sumdueAmt30=0;
		me.sumdueAmt60=0;
		me.sumdueAmt90=0;
		me.sumdueAmtMore90=0;
		me.sumdueAmtAll=0;
		$("#APDataTbody").html('');
		var clientId=$("#arag-vendor").val();
		var start=$("#apag-amt").val();
		var end=$("#apag-secondamt").val();
		if(clientId==''){
			clientId='%20';
		}
		if(start==''){
			start=0;
		}
		if(end==''){
			end=0;
		}
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			showWaiting:false,
			url:url +new Base64().encode('tosys/coaReport/ap/'+clientId+'/'+start+'/'+end+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback:function(res){
				for(var i=0;i<res.length;i++){
					var cId = res[i].clientId;
					var normalAmt = res[i].normalAmt;
					var dueAmt30 = res[i].dueAmt30;
					var dueAmt60 = res[i].dueAmt60;
					var dueAmt90 = res[i].dueAmt90;
					var dueAmtMore90 = res[i].dueAmtMore90;
					var dueAmtAll =dueAmt30+dueAmt60+dueAmt90+dueAmtMore90;
					me.setTableData(cId,normalAmt,dueAmt30,dueAmt60,dueAmt90,dueAmtMore90,dueAmtAll);
				}
				me.addLastLine();
				me.setTextStyle();
			}
		});
	}
}


var ApagBindModle = function(apagMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	
	this.bind = function(){
		/*$("#apag-search").on("click",function(){
			apagMgt.search();
		});*/
		//点击搜索
		$("#apag-search").on('click',function(){
			if($('#apaging-show').is(':hidden')){
				$('#apaging-show').slideDown('slow');
			}else{
				apagMgt.search();
			}
		});
		
		hiddenAclick();
		//点击刷新
		$("#apag-refresh").on("click",function(){
			$.addTab({title:"应付账龄表",isFrame:false,url:ctx+"/page/modules/equipment/APaging.html",pk:{random:Math.random()},reload:true});
		});
		//导出
		$("#apag-out").on({
			"click":function(){
				var clientId=$("#arag-vendor").val();
				var start=$("#apag-amt").val();
				var end=$("#apag-secondamt").val();
				if(clientId==''){
					clientId='%20';
				}
				if(start==''){
					start=0;
				}
				if(end==''){
					end=0;
				}
				if($('#main-changeLanguage').text()=='中文')
					$.openHref(_global_settings.service.url+"/ac/exportReport/"+new Base64().encode('tosys/coaReport/export/apagEnglish/'+clientId+'/'+start+'/'+end+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId));
				else
					$.openHref(_global_settings.service.url+"/ac/exportReport/"+new Base64().encode('tosys/coaReport/export/apag/'+clientId+'/'+start+'/'+end+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId));
			}
		});
	}
	
	this.unbindAll = function(){
		$("#apag-search").off('click');
	}
	//打印
	$('#apag-print').on('click',function(){
		var name='',amt=0,sAmt=0;
		if($('#arag-vendor').val()=="")
			name='%20';
		
		if($('#apag-amt').val()!='')
			amt=$('#apag-amt').val();
		
		if($('#apag-secondamt').val()!='')
			sAmt=$('#apag-secondamt').val();
		
		if($('#main-changeLanguage').text()=='中文')
			window.open(url+'print/'+new Base64().encode('reportName=ApagingPrintEN&name='+name+'&beginAmt='+amt+'&endAmt='+sAmt+'&printType=pdf&ownerId='+currentUserInfo.id+'&username='+currentUserInfo.loginId));
		else
			window.open(url+'print/'+new Base64().encode('reportName=ApagingPrint&name='+name+'&beginAmt='+amt+'&endAmt='+sAmt+'&printType=pdf&ownerId='+currentUserInfo.id+'&username='+currentUserInfo.loginId))
		
//		if(name!="IA=="&&apagamt!=""&&apagsecondamt!=""){
//window.open(ws_url+"/page/print/printHtml.jsp?reportName=ApagingPrint&name="+name+"&beginAmt="+apagamt+"&endAmt="+apagsecondamt+"&printType=pdf");	
//		}else if(name=="IA=="&&apagamt==""&&apagsecondamt==""){
//window.open(ws_url+"/page/print/printHtml.jsp?reportName=ApagingPrint&name= &beginAmt=0&endAmt=0&printType=pdf");	
//		}else if(name!="IA=="&&apagamt!=""&&apagsecondamt==""){
//window.open(ws_url+"/page/print/printHtml.jsp?reportName=ApagingPrint&name="+name+"&beginAmt="+apagamt+"&endAmt=0&printType=pdf");	
//		}else if(name!="IA=="&&apagamt==""&&apagsecondamt!=""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=ApagingPrint&name="+name+"&beginAmt=0&endAmt="+apagsecondamt+"&printType=pdf");	
//		}else if(name!="IA=="&&apagamt==""&&apagsecondamt==""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=ApagingPrint&name="+name+"&beginAmt=0&endAmt=0&printType=pdf");	
//		}else if(name=="IA=="&&apagamt!=""&&apagsecondamt!=""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=ApagingPrint&name= &beginAmt="+apagamt+"&endAmt="+apagsecondamt+"&printType=pdf");	
//		}else if(name=="IA=="&&apagamt!=""&&apagsecondamt==""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=ApagingPrint&name= &beginAmt="+apagamt+"&endAmt=0&printType=pdf");	
//		}else if(name=="IA=="&&apagamt==""&&apagsecondamt!=""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=ApagingPrint&name= &beginAmt=0&endAmt="+apagsecondamt+"&printType=pdf");	
//		}			
		
		})
}