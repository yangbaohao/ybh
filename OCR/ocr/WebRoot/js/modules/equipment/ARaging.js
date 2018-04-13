var AragMgt = function(){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	this.date = new Date();
	this.sumnormalAmt=0;//未超期应收合计
	this.sumdueAmt30=0;//1-30天合计
	this.sumdueAmt60=0;//31-60天合计
	this.sumdueAmt90=0;//61-90天合计
	this.sumdueAmtMore90=0;//大于90天合计
	this.sumdueAmtAll=0;//超期小计合计
	
	//初始化页面所有的控件
	this.initInput = function(){
		$("#arag_nowDate").text(me.setDate());
		$("#arag_comname").text(currentUserInfo.name);
		me.initCustomer();
		me.getTableData();
		$('#araging-show').attr('class','row hiddendiv');
		me.initPages();
	}
	
	this.initPages = function(){
		if($('#main-changeLanguage').html() == "中文"){
			$('#arag-search').text("Search");
			$('#arag-refresh').text("Refresh");
			$('#arag-print').text("Print");
			$('#arag-out').text("Export");
			$('#arag-unit').text("Unit：RMB");
			
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
			$('#arag_nowDate').text(setDate());
			$('#arag-headMsg').text("Accounts Receivable Aging Sheet");
			
			//渲染表数据
			var apagDataThead = $('#ARDataTable>thead>tr:first>th');
			apagDataThead.eq(0).html('Client Name');
			apagDataThead.eq(1).html('No overdue Receivables');
			apagDataThead.eq(2).html('Overdue Receivables');
			apagDataThead.eq(3).html('Overdue Subtotal');
			
			var apagDataThead = $('#ARDataTable>thead>tr:last>th');
			apagDataThead.eq(0).html('Net term (1-30 days )');
			apagDataThead.eq(1).html('Net term (30-60 days )');
			apagDataThead.eq(2).html('Net term (60-90 days )');
			apagDataThead.eq(3).html('Net term (Above 90 days )');
			
			$('#ARDataTable>tbody>tr:last').find('td').eq(0).text('Total');
		}
	}

	//初始化客户下拉框
	var custSource=[],arr=ComboBoxSources.getRecords('clientInfo');
	for(var i=0;i<arr.length;i++){
		if(arr[i].customerFlag){
			custSource.push(arr[i]);
		}
	}
	
	this.initCustomer=function(){
		$("#arag-cust").comboBox({
			source:custSource,
			theme:currentTheme,
			displayMember: "name", 
			valueMember: "name", 
			width:'220px',
			height:'34px',
        	placeHolder:"请选择或输入"
		});
	}
	
	//请求表数据
	this.getTableData = function(){
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:true,
			url:url +new Base64().encode('tosys/coaReport/ar/%20/'+0+'/'+0+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback:function(res){ //表数据
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
				//添加最后一行
				me.addLastLine();
				me.setTextStyle();//设置表样式
			}
		});
	}
	
	//根据clientid获取客户名
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
	
	//设置表样式
	this.setTextStyle=function(){
		$("#ARDataTable tr:gt(0)").each(function(){
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
		$("#ARDataTbody").append(line);
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
		$("#ARDataTbody").append(line);
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
	this.search=function(){
		me.sumnormalAmt=0;
		me.sumdueAmt30=0;
		me.sumdueAmt60=0;
		me.sumdueAmt90=0;
		me.sumdueAmtMore90=0;
		me.sumdueAmtAll=0;
		$("#ARDataTbody").html('');
		var clientId=$("#arag-cust").val();
		var start=$("#arag-amt").val();
		var end=$("#arag-secondamt").val();
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
			url:url+new Base64().encode('tosys/coaReport/ar/'+clientId+'/'+start+'/'+end+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
//			url:url +"/ar/"+clientId+'/'+start+'/'+end,
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

var AragBindModle = function(aragMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	
	this.bind = function(){   
		
		/*$("#arag-search").on("click",function(){
			aragMgt.search();
		});*/
		//点击搜索
		$("#arag-search").on('click',function(){
			if($('#araging-show').is(':hidden')){
				$('#araging-show').slideDown('slow');
			}else{
				aragMgt.search();
			}
		});
		
		hiddenAclick();
	$("#arag-refresh").on("click",function(){
		$.addTab({title:"应收账龄表",isFrame:false,url:ctx+"/page/modules/equipment/ARaging.html",pk:{random:Math.random()},reload:true});
	});
	
	//导出
	$("#arag-out").on({
		"click":function(){
			var clientId=$("#arag-cust").val();
			var start=$("#arag-amt").val();
			var end=$("#arag-secondamt").val();
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
				$.openHref(_global_settings.service.url+"/ac/exportReport/"+new Base64().encode('tosys/coaReport/export/aragEnglish/'+clientId+'/'+start+'/'+end+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId))
			else
				$.openHref(_global_settings.service.url+"/ac/exportReport/"+new Base64().encode('tosys/coaReport/export/arag/'+clientId+'/'+start+'/'+end+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId))
		}
	});
	}
	this.unbindAll = function(){
		$("#arag-search").off('click');
	}
	//打印
	$('#arag-print').on('click',function(){
		var name='%20',amt='0',endAmt='0';
		if($('#arag-cust').val()!=="")
			name=$('#arag-cust').val();
		
		if($('#arag-amt').val()!='')
			amt=$('#arag-amt').val();
		
		if($('#arag-secondamt').val()!='')
			endAmt=$('#arag-secondamt').val();
		
		if($('#main-changeLanguage').html() == "中文" )
			window.open(url+'print/'+new Base64().encode('reportName=AragingPrintEN&name='+name+'&beginAmt='+amt+'&endAmt='+endAmt+'&printType=pdf&ownerId='+currentUserInfo.id+'&username='+currentUserInfo.loginId));
		else
			window.open(url+'print/'+new Base64().encode('reportName=AragingPrint&name='+name+'&beginAmt='+amt+'&endAmt='+endAmt+'&printType=pdf&ownerId='+currentUserInfo.id+'&username='+currentUserInfo.loginId));
//		var aragamt=$('#arag-amt').val();
//		var aragsecondamt=$('#arag-secondamt').val();
//		if(name!="IA=="&&aragamt!=""&&aragsecondamt!=""){
//window.open(ws_url+"/page/print/printHtml.jsp?reportName=AragingPrint&name="+name+"&beginAmt="+aragamt+"&endAmt="+aragsecondamt+"&printType=pdf");	
//		}else if(name=="IA=="&&aragamt==""&&aragsecondamt==""){
//window.open(ws_url+"/page/print/printHtml.jsp?reportName=AragingPrint&name= &beginAmt=0&endAmt=0&printType=pdf");	
//		}else if(name!="IA=="&&aragamt!=""&&aragsecondamt==""){
//window.open(ws_url+"/page/print/printHtml.jsp?reportName=AragingPrint&name="+name+"&beginAmt="+aragamt+"&endAmt=0&printType=pdf");	
//		}else if(name!="IA=="&&aragamt==""&&aragsecondamt!=""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=AragingPrint&name="+name+"&beginAmt=0&endAmt="+aragsecondamt+"&printType=pdf");	
//		}else if(name!="IA=="&&aragamt==""&&aragsecondamt==""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=AragingPrint&name="+name+"&beginAmt=0&endAmt=0&printType=pdf");	
//		}else if(name=="IA=="&&aragamt!=""&&aragsecondamt!=""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=AragingPrint&name= &beginAmt="+aragamt+"&endAmt="+aragsecondamt+"&printType=pdf");	
//		}else if(name=="IA=="&&aragamt!=""&&aragsecondamt==""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=AragingPrint&name= &beginAmt="+aragamt+"&endAmt=0&printType=pdf");	
//		}else if(name=="IA=="&&aragamt==""&&aragsecondamt!=""){
//			window.open(ws_url+"/page/print/printHtml.jsp?reportName=AragingPrint&name= &beginAmt=0&endAmt="+aragsecondamt+"&printType=pdf");	
//		}			
	})
}