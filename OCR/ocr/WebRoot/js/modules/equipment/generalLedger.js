/**
 * 总账
 */

var GeneralLedgerMgt = function(){
	var me=this;
	this.debug=false;
	var url = _global_settings.service.url+'/ac/';
	this.date = new Date();
	
	
	//初始化页面所有控件
	this.initInput = function(){
		$("#generalLedger_nowDate").text(me.setDate());
		$("#generalLedger_comname").text(_global_settings.owner.companyname);
		me.loadControl();
		me.getSearch(); //初始化明细表
		me.searchDate();
		me.initPages();
	}
	
	this.initPages = function(){
		//TODO 加以权限切换中英文
		if($('#main-changeLanguage').html() == "中文"){
			$('#generalLedger-search').text("Search");
			$('#generalLedger-print').text("Print");
			$('#generalLedger-refresh').text("Refresh");
			$('#generalLedger-out').text("Export");
			$('#generalLedger-searchdate').text("Date");
			$('#generalLedger-headMsg').text("General Ledger");
			$('#generalLedger-unit').text("Unit：RMB");
			$('#generalLedger-subject').text("Subject");
			
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
			$('#generalLedger_nowDate').html(setDate());
			
			//渲染表数据
			var generalLedgerDataThead = $('#generalLedgerDataTable>thead>tr>th');
			generalLedgerDataThead.eq(0).html('Date');
			generalLedgerDataThead.eq(1).html('Account Name');
			generalLedgerDataThead.eq(2).html('Remark');
			generalLedgerDataThead.eq(3).html('Debit');
			generalLedgerDataThead.eq(4).html('Credit');
			generalLedgerDataThead.eq(5).html('Balance');
		}
	}
	
	this.loadControl=function(){
		var source=ComboBoxSources.getInfoMapOrderByKey('chartOfAccounts','level',1);
		source.unshift({"name":"全部","hardCode":""});
		$("#generalLedger_oneSub").comboBox({
			source:source,
			displayMember:'name',
			valueMember:'hardCode',
			disabled:false,
			placeHolder:"全部",
			selectedIndex:0
		});
	}
	
	this.getSearch = function(hardCode,date){
		var hardCode=hardCode==null?'%20':hardCode;
		hardCode=hardCode==''?'%20':hardCode;
		var date=date==null?me.getYearmonth():$('#generalLedger-time').val();
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:false,
			url:url+new Base64().encode("tosys/coaReport/ledger/"+hardCode+"/"+date+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId),
			callback:function(res){
				me.setTableData(res);
			}
		});
	}
	
	//设置表数据
	this.setTableData= function(res){
//		console.log(res);
		var body='';
		var accountArr = ['Vault Cash','Bank Deposit','Other Monetary Capital','Temporary Investment','Bills receivable','Accounts receivable',
		                  'Accounts Prepayment','Dividend Receivable','Interest receivable','Other receivables ','Bad debt reserves ','Consignment-in',
		                  'Material Procurement','Materials In Transit','Raw materials','Materials Cost Difference','Commodity Stocks','Merchandise shipped',
		                  'Differences between purchasing and selling price','Materials for Consigned Processing','Revolving Materials','Inventory falling price reserves',
		                  'Long-term debt investments','Provision for long-term investment','Financial assets available for sale','Long-term investment on stocks',
		                  'Long-term equity investment devaluation provision','Investment Real Estate','Long-term Accounts Receivable','Fixed Asset','Accumulated depreciation',
		                  'Fixed assets depreciation reserves','Construction-in-progress','Engineer Material','Disposal of Fixed Assets','Productive Biological Assets',
		                  'Productive living assets accumulated depreciation','Intangible Assets','Accumulated Amortization','Impairment For Intangible Assets',
		                  'Goodwill','Long-term deferred expenses','Deferred Tax Asset','Unsettled Assets Profit and Loss','Short-term Borrowing',
		                  'Transactional Moneytary Liabilities','Bills payable','Accounts Payable','Deposit received','Payroll Payable','Taxes and Dues Payable',
		                  'Profit Payable','Interest Payable','Other Payables','Accounts Of Consigned Goods','Deferred Profits','Long-term Borrowing',
		                  'Bond payable','Long-term payables','Special  Payables','Estimated Liabilities','Deferred Tax Liability','Actual Receipt Capital',
		                  'Additional Paid-In Capital','Features Surplus','Current Year Profits','Allocation of Profits','Treasury Share','Production Cost',
		                  'Manufacturing Expenses','Service Costs','R&D Expenditure','Engineering Constructon','Mechanical Engineering','Prime Operating Revenue',
		                  'Other Business Revenue','Loss of the change of fair value','investment income','Non-operating Revenue','Prime Operating Cost',
		                  'Other Operational Costs','Business Tariff And Annex','Selling Expenses',' Managing Costs','Financing Costs','Asset Impairment loss',
		                  'Non-business Expenditure','Income Tax Expense','Profit and Loss Adjustment of Former Years']
		for(var i=0;i<res.length;i++){
			if(res[i].description==''||res[i].description==undefined){
				res[i].description = '';
			}
			var rtStr="";
			var date=res[i].date.substring(0,10);
			var id=res[i].id;
			var data=ComboBoxSources.getInfoMapByKey('chartOfAccounts','id',id);
			var name=data.name;
			var hardCode=data.hardCode;
			//var initValueC=res[i].initValue.debitAmt;
			//var initValueD=res[i].initValue.creditAmt;
			var initValueB=moneyBig(res[i].initValue.balance);
			
			var monthValueC=moneyBig(res[i].monthValue.debitAmt);
			var monthValueD=moneyBig(res[i].monthValue.creditAmt);
			var monthValueB=moneyBig(res[i].monthValue.balance);
			
			var yearValueC=moneyBig(res[i].yearValue.debitAmt);
			var yearValueD=moneyBig(res[i].yearValue.creditAmt);
			var yearValueB=moneyBig(res[i].yearValue.balance);
			
			if($('#main-changeLanguage').html() == "中文"){
				name = accountArr[i];
			}
			
			var line = '<tr>'+
				'<td rowspan="3">'+date+'</td>'+  //日期 data-id='+rowdata.boundindex+'
				'<td rowspan="3" class="certificate text-center" data-date='+date+' data-id='+hardCode+'><a class="color-1193C5 hoverspan">'+name+'</a></td>'+               //科目号
				//'<td rowspan="3" class="text-center" data-id='+id+'>'+name+'</td>'+               //凭证号
				'<td class="initia-balance">期初余额</td>'+				   //摘要
				'<td class="text-right"></td>'+		   //借方
				'<td class="text-right"></td>'+       //贷方 
				'<td class="text-right">'+initValueB+'</td>'+                                    //余额
				//'<td>'+rtStr+'</td>'+	//关联业务 mee
				'</tr>'+
				'<tr>'+
				'<td class="month-cumulative">本月累计</td>'+				   //摘要
				'<td class="text-right">'+monthValueC+'</td>'+		   //借方
				'<td class="text-right">'+monthValueD+'</td>'+       //贷方 
				'<td class="text-right">'+monthValueB+'</td>'+                                    //余额
				'</tr>'+
				'<tr>'+
				'<td class="year-cumulative">本年累计</td>'+				   //摘要
				'<td class="text-right">'+yearValueC+'</td>'+		   //借方
				'<td class="text-right">'+yearValueD+'</td>'+       //贷方 
				'<td class="text-right">'+yearValueB+'</td>'+                                    //余额
				'</tr>';
			body+=line;
		}
		$("#generalLedgerTbody").html(body);
		if($('#main-changeLanguage').html() == "中文"){
			$("#generalLedgerTbody").find('.initia-balance').text('Initia Balance');
			$("#generalLedgerTbody").find('.month-cumulative').text('Month Cumulative');
			$("#generalLedgerTbody").find('.year-cumulative').text('Year Cumulative');
		}
	}
	
	//查看明细账
	$('#generalLedgerTbody').on('click','.certificate',function(){	
		var hardCode = $(this).attr('data-id');
		var date=$(this).attr('data-date');
		$.addTab({title:'明细账',isFrame:false,url:'page/modules/equipment/detailMoney.html',pk:{
			search:true
		},callback:function(){
			$('#detail-time').val(date);
			$('#detailMoney_oneSub').val(ComboBoxSources.getInfoMapByKey('chartOfAccounts','hardCode',hardCode).id);
		},reload:true});
	})
	
	
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
		$('#generalLedger-time').monthpicker({callback:'dasdasd'});
//		$("#generalLedger-time").datetimeinput({formatString:"yyyy-MM", width: '120px', height: '34px'});
//		$("#generalLedger-time").jqxDateTimeInput('val',new Date()); //设置结束日期默认为当天
	}
}

var GeneralLedgerBindModle = function(generalLedgerMgt){
	var me=this;
	
	//点击搜索按钮
	this.searchByTime = function(){
		var time=$('#generalLedger-time').val();
		var code=$('#generalLedger_oneSub').val();
		if($('#generalLedger_oneSub').jqxComboBox('getSelectedItem')==null){
			code='';
		}
		generalLedgerMgt.getSearch(code,time);
	}
	
	this.bind=function(){
		//导出
		$("#generalLedger-out").on({
			"click":function(){
				createDate = $("#generalLedger-time").val();
				if(createDate == ''){
					createDate = generalLedgerMgt.getYearmonth();
				}
				id = $("#generalLedger_oneSub").val();//一级科目的id
				 hardCode=$('#generalLedger_oneSub').val()==""?"%20":$('#generalLedger_oneSub').val();
				if($('#generalLedger_oneSub').jqxComboBox('getSelectedItem')==null){
					hardCode='%20';
				}
				if($('#main-changeLanguage').text()=='中文')
					$.openHref(_global_settings.service.url+'/ac/exportReport/'+new Base64().encode('tosys/coaReport/export/generalLedgerEnglish/'+hardCode+'/'+createDate+'/0/0/0/0/0/0/0/0/0/'+currentUserInfo.id+"/"+currentUserInfo.loginId));
				else
					$.openHref(_global_settings.service.url+'/ac/exportReport/'+new Base64().encode('tosys/coaReport/export/generalLedger/'+hardCode+'/'+createDate+'/0/0/0/0/0/0/0/0/0/'+currentUserInfo.id+"/"+currentUserInfo.loginId));
			}
		});
		
		//总账
		$("#generalLedger-refresh").on('click',function(){
			$.addTab({title:"总账",isFrame:false,url:ctx+"/page/modules/equipment/generalLedger.html",reload:true});
		});
		
		$("#generalLedger-search").on('click',function(){
			$("#generalLedger_nowDate").text($('#generalLedger-time').val());
			me.searchByTime();
		});
	}
	
	this.unbindAll=function(){
		$("#generalLedger-search").off('click');
	}
	//打印
	$('#generalLedger-print').on('click',function(){
		var time = generalLedgerMgt.getYearmonth();
		var dateTime =  $('#generalLedger-time').val();
		if(dateTime.length==11){
			dateTime = time;
		}
		if($('#generalLedger_oneSub').val()==""){
			if($('#main-changeLanguage').text()=='中文')
				var url = new Base64().encode("reportName=GeneralLedgerEN&date="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
			else
				var url = new Base64().encode("reportName=GeneralLedger&date="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
			window.open(_global_settings.service.url+"/ac/print/"+url);
		}else{
			if($('#main-changeLanguage').text()=='中文')
				var url = new Base64().encode("reportName=GeneralLedgerEN&date="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId+'&code='+$('#generalLedger_oneSub').val()+'&1=1');
			else
				var url = new Base64().encode("reportName=GeneralLedger&date="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId+'&code='+$('#generalLedger_oneSub').val()+'&1=1');
			window.open(_global_settings.service.url+"/ac/print/"+url);
		}
	})
}