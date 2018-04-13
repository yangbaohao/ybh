var BssDetailMoneyMgt = function(){
	var me=this;
//	var id=null;
//	var tId=null;
//	var res = null;
//	var last = null;
	this.debug=false;
	var url = _global_settings.service.url+"/ac/";
	this.date = new Date();
	this.arr = [];
	this.arr2 = [];
	this.hardCode = '1001'; //科目编码
	this.initAmt = 0;//期初余额
	this.currentAmt = 0;
	this.debitCredit; //借贷方向
	this.sumInitAmt = 0;//合计余额
	this.sumDebitAmt = 0;//借方合计
	this.sumCreditAmt = 0;//贷方合计
	this.createDate; //第一条和最后一条的日期
	this.recordRes; //请求数据
	
	
	//初始化页面所有控件
	this.initInput = function(){
		$('#detail-sendEmail').css('display','none');
		$("#detailMoney_nowDate").text(me.setDate());
		me.createDate = me.getYearmonth();
		me.getOneSub();
		me.setOneSub();
		me.getTwoSub();
		me.setTwoSub();
		
		if($.pk!=null&&$.pk.search==true){
		}else{
			me.getSearch(); //初始化明细表
		}
		me.searchDate();
		me.initComboBoxes();
		me.initPages();
	}
	
	this.initPages = function(){
		if($('#main-changeLanguage').html() == "中文" ){
			$('#detail-search').text("Search");
			$('#detail-searchdate').text("Date");
			$('#detail-print').text("Print");
			$('#detail-out').text("Export");
			$('#detail-headMsg').text("Detail Account");
			$('#detail-unit').text("unit：RMB");
			$('#detail-category').text('Category A');
			$('#detail-subjects').text('Subjects');
			$('#detail-subjectsTwo').text('Secondary Subjects')
			
			var detailMoneyDataThead = $('#detailMoneyDataTable>thead>tr>th');
			detailMoneyDataThead.eq(0).text('Date');
			detailMoneyDataThead.eq(1).text('Documents Number');
			detailMoneyDataThead.eq(2).text('Remark');
			detailMoneyDataThead.eq(3).text('Debit');
			detailMoneyDataThead.eq(4).text('Credit');
			detailMoneyDataThead.eq(5).text('Balance');
			
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
			$('#detailMoney_nowDate').html(setDate());
		}
	}
	
	this.getSearch = function(){
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			url: url+new Base64().encode("tosys/coaReport/journal/detailedaccount/"+me.hardCode+"/"+me.createDate+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId),
			callback:function(res){ //
				var last = res.pop();
				me.setTableData(res);
				me.addFirstLine(res); //给表格添加首行和尾行
				me.setTdValue(res,me.hardCode,me.getYearmonth(),last);
//				me.addLastLine(res);
			}
		});
	}
	
	//设置表数据
	this.setTableData= function(res){
		console.log(res);
		var id = $("#detailMoney_oneSub").val(); //所选择科目id
		me.debitCredit = me.getCredit(id); //所选择科目的借贷方向
		for(var i=0;i<res.length;i++){
			if(res[i].description==''||res[i].description==undefined){
				res[i].description = '';
			}
//			var rtStr="";
//			if(res[i].journalBizType == "purchaseDelivery"){
//				rtStr = '<div style="text-align: center;padding-top: 12px;">';
//          		rtStr += '<a class="color-1193C5 viewJourReceiveDetail" data-id='+res[i].bizId+'>'+"收货"+'</a>';
//          		rtStr += '</div>';
//               
//			}
// 	        if(res[i].journalBizType == "purchasePay"){
//				rtStr = '<div style="text-align: center;padding-top: 12px;">';
//          		rtStr += '<a class="color-1193C5 viewJourPayDetail" data-id='+res[i].bizId+'>'+"付款"+'</a>';
//          		rtStr += '</div>';
//          		
//			}
//	  	    if(res[i].journalBizType == "salesDelivery"){
//				rtStr = '<div style="text-align: center;padding-top: 12px;">';
//          		rtStr += '<a class="color-1193C5 viewJourSendDetail" data-id='+res[i].bizId+'>'+"送货"+'</a>';
//          		rtStr += '</div>';
//          		
//			}
//   	  	    if(res[i].journalBizType == "salesPay"){
//				rtStr = '<div style="text-align: center;padding-top: 12px;">';
//          		rtStr += '<a class="color-1193C5 viewJourReceiveMoneyDetail" data-id='+res[i].bizId+'>'+"收款"+'</a>';
//          		rtStr += '</div>';
//          		
//			}
//	   	  	if(res[i].journalBizType == "stockcheck"){
//				rtStr = '<div style="text-align: center;padding-top: 12px;">';
//          		rtStr += '<span class="viewInvenDetail" data-id='+res[i].bizId+'>'+"盘存"+'</span>';
//          		rtStr += '</div>';
//          		
//			}
//	   	  	if(res[i].journalBizType == "expensePayment"){
//				rtStr = '<div style="text-align: center;padding-top:12px;">';
//          		rtStr += '<a class="color-1193C5 " data-id='+res[i].bizId+'>'+"费用支出"+'</a>';
//          		rtStr += '</div>';
//          		 
//			}
//	   	  	if(res[i].journalBizType=="feeincomepay"){
//		   	  	 rtStr = '<div style="text-align: center;padding-top:12px;">';
//          		rtStr += '<a class="color-1193C5 viewCostIncome" data-id='+res[i].bizId+'>'+"其他收入"+'</a>';
//          		rtStr += '</div>';
//          		
//	   	  	}
//	   	  	if(res[i].journalBizType=="salesReturnDelivery"){
//		   	  	rtStr = '<div style="text-align: center;padding-top:12px;">';
//          		rtStr += '<a class="color-1193C5 viewSalesReturn" data-id='+res[i].bizId+'>'+"销售退货"+'</a>';
//          		rtStr += '</div>';
//          	
//	   	  	}
//	   	  	if(res[i].journalBizType=="purchaseReturnDelivery"){
//		   	  	rtStr = '<div style="text-align: center;padding-top: 12px;">';
//          		rtStr += '<a class="color-1193C5 viewPurchaseReturn" data-id='+res[i].bizId+'>'+"采购退货"+'</a>';
//          		rtStr += '</div>';
//          		
//	   	  	}
//	   	  	if(res[i].journalBizType=="salesReturnPay"){
//		   	  	rtStr = '<div style="text-align: center;padding-top: 12px;">';
//          		rtStr += '<a class="color-1193C5 viewSalesReturnPay" data-id='+res[i].bizId+'>'+"销售退款"+'</a>';
//          		rtStr += '</div>';
//          		
//	   	  	}
//	   	  	if(res[i].journalBizType=="purchaseReturnPay"){
//		   	  	 rtStr = '<div style="text-align: center;padding-top: 12px;">';
//          		rtStr += '<a class="color-1193C5 viewPurchaseReturnPay" data-id='+res[i].bizId+'>'+"采购退款"+'</a>';
//          		rtStr += '</div>';
//          		
//	   	  	}
			var a = res[i].journalNumberForShow==undefined?'':res[i].journalNumberForShow;
			var description;
			if(res[i].description=='发票生成凭证'){
				if($('#main-changeLanguage').html() == "中文" ){
					description = 'Invoice Generation Certificate';
				}else{
					description = res[i].description
				}
			}else{
				description = res[i].description;
			}
			var line = '<tr>'+
				'<td>'+res[i].createDate.substring(0,10)+'</td>'+  //日期 data-id='+rowdata.boundindex+'
				'<td class="certificate text-center" data-id='+res[i].journalid+'>'+a+'</td>'+               //凭证号
				'<td>'+description+'</td>'+				   //摘要
				'<td>'+money(res[i].debitAmt)+'</td>'+		   //借方
				'<td>'+money(res[i].creditAmt)+'</td>'+       //贷方 
				'<td>'+'</td>'+                                    //余额
//				'<td>'+rtStr+'</td>'+	//关联业务 mee
				'</tr>';
			$("#detailMoneyTbody").append(line);
		
		}
	}
	//点击最后一列 mee
	//查看凭证
	/*$('#detailMoneyTbody').on('click','.certificate',function(){		
		var journalid = $(this).attr('data-id');
			Core.AjaxRequest({
				type:"GET",
				showMsg:false,
//				url:url2 + "/detail/"+journalid,
				url:url +new Base64().encode("tosys/coaReport/journal/detailedaccount/"+me.hardCode+"/"+me.createDate+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
				callback:function(res){ //凭证详情数据
					$.addTab({title:'凭证详（'+res.journalNumber+'）情',isFrame:false,url:'page/modules/fms/JournalView.html',pk:res,reload:true});
				}
			});

	})
	//采购退款
	$("#detailMoneyTbody").on("click",".viewPurchaseReturnPay",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'退款单',url:'page/modules/biz/viewPayment.html',pk:{id:i},reload:true});
	});
	//销售退款
	$("#detailMoneyTbody").on("click",".viewSalesReturnPay",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'退款单',url:'page/modules/biz/viewReceive.html',pk:{id:i},reload:true});
	});
	//销售退货OK
	$("#detailMoneyTbody").on("click",".viewSalesReturn",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'退货单',url:'page/modules/biz/viewGoodsReturn.html',pk:{id:i,random:Math.random()},reload:true});
	});
	//采购退货
	$("#detailMoneyTbody").on("click",".viewPurchaseReturn",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'退货单',url:'page/modules/biz/viewGoodsrecReturn.html',pk:{id:i,random:Math.random()},reload:true});
	});
	//其他收入OK
	$("#detailMoneyTbody").on("click",".viewCostIncome",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'查看其他收入',url:'page/modules/prod/viewcostIncome.html',pk:{id:i},reload:true});
	});
	
	//费用支出OK
	$("#detailMoneyTbody").on("click",".viewExpensePayment",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'查看费用支出',url:'page/modules/prod/viewCostPay.html',pk:{id:i},reload:true});
	});
	
	//收货
	$("#detailMoneyTbody").on("click",".viewJourReceiveDetail",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'收货单',url:'page/modules/biz/viewReceiveCargo.html',pk:{deliveryOrderId:i},reload:true});
	});
	//送货OK
	$("#detailMoneyTbody").on("click",".viewJourSendDetail",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'送货单',url:'page/modules/biz/viewSendCargo.html',pk:{deliveryOrderId:i},reload:true});
	});
	//收款OK
	$("#detailMoneyTbody").on("click",".viewJourReceiveMoneyDetail",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'收款',url:'page/modules/biz/viewReceive.html',pk:{id:i},reload:true});
	});
	//付款OK
	$("#detailMoneyTbody").on("click",".viewJourPayDetail",function(){
		var i=$(this).attr('data-id');
		$.addTab({title:'付款',url:'page/modules/biz/viewPayment.html',pk:{id:i},reload:true});
	});*/
	
	//添加首行
	this.addFirstLine = function(res){
      
		var html = $("#detailMoneyTbody").html();
		if(res.length!=0){
			if($('#main-changeLanguage').html() == "中文" ){
				var line = '<tr>'+
				'<td>'+me.createDate+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'Initial Balance'+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'</td>'+
				'<td>'+money(me.initAmt)+'</td>'+  //余额默认为零，循环时重置
				'</tr>';
			}else{
				var line = '<tr>'+
				'<td>'+me.createDate+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'期初余额'+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'</td>'+
				'<td>'+money(me.initAmt)+'</td>'+  //余额默认为零，循环时重置
				'</tr>';
			}
		}else if(res.length==0){
			if($('#main-changeLanguage').html() == "中文" ){
				var line = '<tr>'+
				'<td>'+me.createDate+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'Initial Balance'+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'</td>'+
				'<td>'+money(me.currentAmt)+'</td>'+  //余额默认为零，循环时重置meee
				'</tr>';
			}else{
				var line = '<tr>'+
				'<td>'+me.createDate+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'期初余额'+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'</td>'+
				'<td>'+money(me.currentAmt)+'</td>'+  //余额默认为零，循环时重置meee
				'</tr>';
			}
		}
		
		$("#detailMoneyTbody").html(line+html);
	}
	//添加尾行
	this.addLastLine = function(list,res,last){
		console.log(me.sumDebitAmt);
		var sum;
		if(me.debitCredit == 'debit'){
			sum = money(parseFloat(me.initAmt)+parseFloat(me.sumDebitAmt)-parseFloat(me.sumCreditAmt));
		}else{
			sum = money(parseFloat(me.initAmt)+parseFloat(me.sumCreditAmt)-parseFloat(me.sumDebitAmt));
		}
		console.log("========="+sum);
		if(list.length!=0){
			if($('#main-changeLanguage').html() == "中文" ){
				var line = '<tr>'+
					'<td>'+me.createDate+'</td>'+
					'<td>'+'</td>'+
					'<td>'+'This month total'+'</td>'+
					'<td>'+money(me.sumDebitAmt)+'</td>'+  //借方合计
					'<td>'+money(me.sumCreditAmt)+'</td>'+ //贷方合计
					'<td>'+sum+  //余额合计
					'</td>'+
					'</tr>';
			}else{
				var line = '<tr>'+
				'<td>'+me.createDate+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'本月合计'+'</td>'+
				'<td>'+money(me.sumDebitAmt)+'</td>'+  //借方合计
				'<td>'+money(me.sumCreditAmt)+'</td>'+ //贷方合计
				'<td>'+sum+  //余额合计
				'</td>'+
				'</tr>';
			}
		}else{
			if($('#main-changeLanguage').html() == "中文" ){
				var line = '<tr>'+
					'<td>'+me.createDate+'</td>'+
					'<td>'+'</td>'+
					'<td>'+'This month total'+'</td>'+
					'<td>'+money(0)+'</td>'+  //借方合计
					'<td>'+money(0)+'</td>'+ //贷方合计
					'<td>'+money(me.currentAmt)+  //余额合计meee
					'</td>'+
					'</tr>';	
			}else{
				var line = '<tr>'+
					'<td>'+me.createDate+'</td>'+
					'<td>'+'</td>'+
					'<td>'+'本月合计'+'</td>'+
					'<td>'+money(0)+'</td>'+  //借方合计
					'<td>'+money(0)+'</td>'+ //贷方合计
					'<td>'+money(me.currentAmt)+  //余额合计meee
					'</td>'+
					'</tr>';
			}
		}
		$("#detailMoneyTbody").append(line);
		
		if($('#main-changeLanguage').html() == "中文" ){
			var lasttr='<tr>'+
						'<td>'+me.createDate+'</td>'+
						'<td>'+'</td>'+
						'<td>'+'Accumulated This Year'+'</td>'+
						'<td>'+money(last.debitAmt)+'</td>'+  //借方合计
						'<td>'+money(last.creditAmt)+'</td>'+ //贷方合计
						'<td>'+money(last.balance)+  //余额合计
						'</td>'+
						'</tr>';
		}else{
			var lasttr='<tr>'+
				'<td>'+me.createDate+'</td>'+
				'<td>'+'</td>'+
				'<td>'+'本年累计'+'</td>'+
				'<td>'+money(last.debitAmt)+'</td>'+  //借方合计
				'<td>'+money(last.creditAmt)+'</td>'+ //贷方合计
				'<td>'+money(last.balance)+  //余额合计
				'</td>'+
				'</tr>';
		}
		
		$("#detailMoneyTbody").append(lasttr);
		
		me.setTextRight();//设置td样式
	}
	
	//设置td样式
	this.setTextRight=function(){
		$('#detailMoneyTbody').find('tr').each(function(){
			$(this).find('td').each(function(i){
				if(i==3||i==4||i==5){
					$(this).attr('class','text-right');
				}
			});
		});
	}
	
	//循环表格，计算数据
	this.setTdValue = function(list,hardCode,createDate,last){//meee
		console.log("++++++++"+me.debitCredit);
		var url2 = _global_settings.service.url+"/ac/"
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			url:url+new Base64().encode("tosys/coaReport/monthSum/"+me.hardCode+"/"+me.createDate+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId),
			callback:function(res){ 
				console.log(res);
				me.initAmt = parseFloat(res.initAmt);//期初余额
				me.currentAmt=parseFloat(res.currentAmt);//合计meee
				if(list.length!=0){
				$("#detailMoneyTbody").find('tr').eq(0).find('td').eq(5).text(money(me.initAmt)); //给首行余额设置期初余额 （当有内容时）
				}else{
				$("#detailMoneyTbody").find('tr').eq(0).find('td').eq(5).text(money(me.currentAmt)); //给首行余额设置期初余额 （当没有搜到内容时）	
				}
				$("#detailMoneyTbody").find('tr').each(function(i){ 
					if(i != 0){ //从第二行开始循环表格
						if(me.debitCredit == 'debit'){ //借方
							$(this).find('td').eq(5).text(  //借方减贷方加上余额
									money(
										  parseFloat($(this).find('td').eq(3).text())-
										  parseFloat($(this).find('td').eq(4).text())+
										  parseFloat(me.initAmt)
										 )
									);
							me.initAmt = money( //重置余额
											   parseFloat($(this).find('td').eq(5).text()
											  )
										); 
							console.log(me.initAmt);
						}
						if(me.debitCredit == 'credit'){ //贷方
							$(this).find('td').eq(5).text(  //贷方减借方加上余额
									money(
										  parseFloat($(this).find('td').eq(4).text())-
										  parseFloat($(this).find('td').eq(3).text())+
										  parseFloat(me.initAmt)
										 )
									);
							me.initAmt = money(  //重置余额
											   parseFloat($(this).find('td').eq(5).text()
											  )
										); 
							console.log("++"+me.initAmt);
						}
						
						//每添加一条数据，计算借方贷方之和
						me.sumDebitAmt += parseFloat(
													 $(this).find('td').eq(3).text()
													 ); //借方合计
						me.sumCreditAmt += parseFloat(
													 $(this).find('td').eq(4).text()
													 ); //贷方合计
					}
				});
				//添加完表格数据，把期初余额重置为第一行的余额
				me.initAmt = $("#detailMoneyTbody").find('tr').eq(0).find('td').eq(5).text();//期初余额
				//me.currentAmt=$("#detailMoneyTbody").find('tr').eq(0).find('td').eq(5).text();//期初余额
				me.addLastLine(list,res,last); //添加最后一行meee
				
				
				//循环表格，把金额转换成逗号分隔
				me.setFormat();
			}
		});
	}
	
	//循环表格，把金额转换成逗号分隔
	this.setFormat=function(){
		$("#detailMoneyTbody").find('tr').each(function(){
			$(this).find('td').each(function(i){
				if(i==3||i==4||i==5){
					if($(this).text()!=''){ //排除空的单元格
						var text = $(this).text();
						$(this).text(formatNum(money(text)));//设置逗号分隔
					}
				}
			})
		});
	}
	
	//
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
	
	//返回当前年月
	this.getYearmonth = function(){
		var year = me.date.getFullYear();
		var month = me.date.getMonth();
		month = month + 1;
		var day = me.date.getDate();
		if(month < 10){
			month = "0" + month;
		}
		
		return year+"-"+month;
	}
	
	//搜索日期
	this.searchDate = function(){
		$('#detail-time').monthpicker({callback:'dasdasd'});
//		$("#detail-time").datetimeinput({formatString:"yyyy-MM", width: '120px', height: '34px'});
//		$("#detail-time").jqxDateTimeInput('val',new Date()); //设置结束日期默认为当天
	}
	
	//类目一的数据
	this.setType = function(){
		var typeSource = [
		                  "全部",
			              "种类一",
			              "种类二",
			              "种类三",
			              "种类四",
			              "种类五",
			              "种类六",
			            ];
		$("#detailMoney_type").jqxDropDownList({
			   placeHolder: '请选择',	
		       source: typeSource,
		       theme: 'energyblue',
		       width: '100%',
		       height: '30px',
		       selectedIndex: 0,
		       dropDownHeight: 200
		});
	}
	
	//获得一级科目借贷方向
	this.getCredit = function(id){
		var records = ComboBoxSources.getRecords('chartOfAccounts'); 
		for(var i=0;i<records.length;i++){
			if(records[i].id == id){
				me.debitCredit = records[i].debitCredit;
				return me.debitCredit;
			}
		}
	}
	
	//获得一级科目
	this.getOneSub = function(){
		var records = ComboBoxSources.getRecords('chartOfAccounts'); 
		for(var i=0;i<records.length;i++){
			if(records[i].level == 1){
				var hardCode = records[i].hardCode;
				me.arr.push(hardCode);
			}
		}
//		console.log(me.arr);
	}
	
	//初始化一级科目
	this.setOneSub = function(){
		$("#detailMoney_oneSub").coaCombboxOne({
	       theme: 'energyblue',
	       displayMember: "displayValue", 
       	   valueMember: "id",
	       width: '100%',
	       height: '30px',
	       selectedIndex: 0,
	       searchMode: 'contains',
	       dropDownHeight: 200
		},me.arr);
		
		id=$('#detailMoney_oneSub').val();
	}
	
//	//获得二级科目
	this.getTwoSub = function(){
		var records = ComboBoxSources.getRecords('chartOfAccounts');
		for(var i=0;i<records.length;i++){
			if(records[i].level == 2 && records[i].pid == 1){
				var hardCode = records[i].hardCode;
				me.arr2.push(hardCode);
			}
		}
//		console.log(me.arr);
	}
	
//	//初始化二级科目
	this.setTwoSub = function(){
		$("#detailMoney_twoSub").coaCombboxTwo({
	       theme: 'energyblue',
	       displayMember: "displayValue", 
       	   valueMember: "id",
	       width: '100%',
	       height: '30px',
	       selectedIndex: 0,
	       searchMode: 'contains',
	       dropDownHeight: 200
		},me.arr2);
		
		tId=$('#detailMoney_twoSub').val();
	}
	
//	//一级科目改变，二级请求数据
	this.getHardCodeByPid = function(pid){
		me.arr2 = []; //每次一级改变，清空二级数组
		var records = ComboBoxSources.getRecords('chartOfAccounts');
		for(var i=0;i<records.length;i++){
			if(records[i].level == 2 && records[i].pid == pid){
				var hardCode = records[i].hardCode;
				me.arr2.push(hardCode);
			}
		}
	}
//	
//	//根据科目id查找hardCode
	this.searchHardCode = function(name,id){
		var adapter = ComboBoxSources.getAdapter(name);
		var records = adapter.records;
		for(var i=0;i<records.length;i++){
			if(records[i].id == id){
				return records[i].hardCode;
			}
		}
		if(!id){
			ComboBoxSources.load(name);
			return "暂无";
		}
	}
	
	this.getSearchByChange = function(hardCode,createDate){ //所选择科目的hardCode和所选择的时间
		//清空表数据
		$("#detailMoneyTbody").html('');
		me.initAmt = 0;//期初余额
		me.currentAmt = 0;
		me.sumInitAmt = 0;//合计余额
		me.sumDebitAmt = 0;//借方合计
		me.sumCreditAmt = 0;//贷方合计
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:false,
			url: url+new Base64().encode("tosys/coaReport/journal/detailedaccount/"+me.hardCode+"/"+me.createDate+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId),
			callback:function(res){ //
				var last=res.pop();
				me.setTableData(res);
				me.addFirstLine(res);//meee
				me.setTdValue(res,hardCode,createDate,last);//meee
			} 
		});
	}
	
	this.initComboBoxes =function(){
		var _selectevt = function(){
			me.sumDebitAmt=0; //重置借方合计
			me.sumCreditAmt=0; //重置贷方合计
			me.sumInitAmt = 0;//重置合计余额
			me.initAmt=0; //重置期初余额
			var id = $(this).val(); //二级科目id
			me.createDate = $("#detail-time").val();
			if(me.createDate == ''){
				me.createDate = me.getYearmonth();
			}
			if($("#detailMoney_oneSub").jqxComboBox('getSelectedItem')==null){
				//me.hardCode = me.searchHardCode('chartOfAccounts',$("#detailMoney_oneSub").val());
				//me.getSearchByChange(me.hardCode,me.createDate);
				$("#detailMoney_oneSub").jqxComboBox('selectIndex', 0)
			}else{
				if(id == '全部'){
					id = $("#detailMoney_oneSub").val();//一级科目的id
					me.hardCode = me.searchHardCode('chartOfAccounts',id);
					me.getSearchByChange(me.hardCode,me.createDate);
				}else{
					me.hardCode = me.searchHardCode('chartOfAccounts',id);
					me.getSearchByChange(me.hardCode,me.createDate);
				}
			}
		};
	
		//一级科目改变事件
		$("#detailMoney_oneSub").on({
			'change':function(){
				$("#detailMoney_twoSub").off('change');
				me.sumDebitAmt=0; //重置借方合计
				me.sumCreditAmt=0; //重置贷方合计
				me.sumInitAmt = 0;//重置合计余额
				me.initAmt=0; //重置期初余额
				var pid = $(this).val();//所选择科目的id
				me.createDate = $("#detail-time").val();
				if(me.createDate == ''){
					me.createDate = me.getYearmonth();
				}
				if($("#detailMoney_oneSub").jqxComboBox('getSelectedItem')==null||$("#detailMoney_oneSub").val()==''){
					/*Core.alert({message:'科目选择有误'});
					$("#detailMoney_oneSub").val('');*/
				}else{
					me.hardCode = me.searchHardCode('chartOfAccounts',pid);
				}
				
				me.getSearchByChange(me.hardCode,me.createDate);
		//		console.log(hardCode);
		//		//二级科目获取数据
				me.getHardCodeByPid(pid);
				var records=[],filter=me.arr2;
				var record = ComboBoxSources.getRecords('chartOfAccounts');
				if(filter===undefined){
				}else{
					$.each(record,function(i,v){
						var hardCode = v.ref;
						for(var _i=0;_i<filter.length;_i++){
							if(hardCode.indexOf(filter[_i]) == 0 && hardCode.length == 6){ 
								records.push(v);
							}
						}
					});
				}
				var items = $("#detailMoney_twoSub").jqxComboBox('getItems');
				var length = items.length;
				for(var i=1;i<length;i++){
					$("#detailMoney_twoSub").jqxComboBox('removeAt', 1);
				}
				$.each(records,function(i,v){
					$("#detailMoney_twoSub").jqxComboBox('addItem', v);
				});
				$("#detailMoney_twoSub").jqxComboBox('selectIndex', 0);
				$("#detailMoney_twoSub").on('change',_selectevt);
			},
		});
	
		//二级科目改变
		$("#detailMoney_twoSub").on('change',_selectevt);
	}
	
	this.searchObj = {
	};
	/**
	 * 初始化搜索组件
	 */
	this.initSearch = function(){
		me.searchObj = {					//修改
			'coa.hardCode':{value:['1001'],action:"like"},
			'journalDetail.createDate':{value:[''+me.getYearmonth()+''],action:'like'}
		};
		
	}
	
	/**
	 * 查询列表数据
	 */
    this.searchDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('applyfilters');
    	$("#"+el).jqxGrid('refreshfilterrow'); 
    	$("#"+el).jqxGrid('clearselection');
    };
	
	/**
	 * 查询
	 */
    this.search = function(hardCode,createDate){
    	me.searchObj['coa.hardCode'].value = [''+hardCode+''];
		me.searchObj['journalDetail.createDate'].value = [''+createDate+''];
		me.searchDataInfo();
		
    }
    
	/**
     * 刷新
     */
    this.refreshDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('updatebounddata', 'cells');
    	$("#"+el).jqxGrid('clearselection');
    	$('#'+el).jqxGrid('refreshdata');
    };
	
}

var BssDetailMoneyBindModle = function(bssDetailMoneyMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	//点击搜索按钮
	this.searchByTime = function(){
		var hardCode = bssDetailMoneyMgt.hardCode;
		var time = $("#detail-time").val();
		if(time == ''){
			time = bssDetailMoneyMgt.getYearmonth()
		}
		bssDetailMoneyMgt.createDate = time;
		$("#detailMoney_nowDate").text(time);
		bssDetailMoneyMgt.getSearchByChange(hardCode,time);
	}
	
	this.bind=function(){
		$("#detail-search").on('click',function(){
			me.searchByTime();
		});
	}
	
	this.unbindAll=function(){
		$("#detail-search").off('click');
	}
	//打印
	$('#detail-print').on('click',function(){
		var time = bssDetailMoneyMgt.getYearmonth();
		var dateTime =  $('#detail-time').val();
		if(dateTime.length==11){
			dateTime = time;
		}
		if($('#detailMoney_twoSub').val()!="全部"){
			if($('#main-changeLanguage').text()=='中文')
				var url = new Base64().encode("reportName=InventoryCashEN&detailBilldate="+dateTime+"&printType=pdf&chartOfAccountid="+$('#detailMoney_twoSub').val()+"&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
			else
				var url = new Base64().encode("reportName=InventoryCash&detailBilldate="+dateTime+"&printType=pdf&chartOfAccountid="+$('#detailMoney_twoSub').val()+"&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
			window.open(_global_settings.service.url+"/ac/print/"+url);	
		}else{
			if($('#main-changeLanguage').text()=='中文')
				var url = new Base64().encode("reportName=InventoryCashEN&detailBilldate="+dateTime+"&printType=pdf&chartOfAccountid="+$('#detailMoney_oneSub').val()+"&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
			else
				var url = new Base64().encode("reportName=InventoryCash&detailBilldate="+dateTime+"&printType=pdf&chartOfAccountid="+$('#detailMoney_oneSub').val()+"&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
			window.open(_global_settings.service.url+"/ac/print/"+url);
		}
	});
	
	//导出
	$("#detail-out").on({
		"click":function(){
			var code=null;
			var tid = $('#detailMoney_twoSub').val();
			if(tid=='全部')
				code=bssDetailMoneyMgt.searchHardCode('chartOfAccounts',$('#detailMoney_oneSub').val());
			else
				code=bssDetailMoneyMgt.searchHardCode('chartOfAccounts',tid);
			console.log(code);
			
			var time = bssDetailMoneyMgt.getYearmonth();
			var dateTime = $('#detail-time').val()
			if(dateTime.length==11){
				dateTime = time;
			}
			if($('#main-changeLanguage').text()=='中文')
				var url = new Base64().encode("tosys/coaReport/export/detailMoneyEnglish/"+code+"/"+dateTime+'/0/0/0/0/0/0/0/0/0/'+currentUserInfo.id+"/"+currentUserInfo.loginId);
			else
				var url = new Base64().encode("tosys/coaReport/export/detailMoney/"+code+"/"+dateTime+'/0/0/0/0/0/0/0/0/0/'+currentUserInfo.id+"/"+currentUserInfo.loginId);
			$.openHref(_global_settings.service.url+'/ac/exportReport/'+url);
		}
	});
	
}