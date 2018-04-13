/**
 * 科目余额表
 */
var BssSubjectBalMgt = function(){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	var url2 = _global_settings.service.url+"/chartOfAccount";
	this.date = new Date();
	this.random = Math.random();
	this.sumBalance=0;//期初余额之和
	this.sumDebit=0;//借方之和
	this.sumCredit=0;//贷方之和
	this.sumLastBalance=0;//期末余额
	this.type=1;//科目种类
	
	//初始化页面所有控件
	this.initInput = function(){
		$('#subjectBal-sendEmail').css('display','none');
		$("#subjectBal_nowDate").text(me.setDate());
		$('#subjectBal-time').monthpicker({callback:'dasdasd'});
		$("#subjectbal_comname").text(_global_settings.owner.companyname);
		me.getTableData(me.getYearAndMonth(),me.type);
		me.initPages();
	}
	
	this.initPages = function(){
		if($('#main-changeLanguage').html() == "中文" ){
			$('#subjectBal-search').text("Search");
			$('#subjectBal-print').text("Print");
			$('#subjectBal-out').text("Export");
			$('#subjectBal-searchdate').text("Date");
			$('#subjectBal-headMsg').text("Account Balance Sheet");
			$('#subjectBal-unit').text("Unit：RMB");
			
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
			$('#subjectBal_nowDate').text(setDate());

			//渲染表数据
			var subjectDataThead = $('#subjectBalDataTable>thead>tr>th');
//			subjectDataThead.eq(0).html('Account Code');
			subjectDataThead.eq(1).html('Account Name');
			subjectDataThead.eq(2).html('Beginning balance');
			subjectDataThead.eq(3).html('Current Occurrence Amount');//本期发生额
			subjectDataThead.eq(4).html('Ending balance');
			subjectDataThead.eq(5).html('Debit');
			subjectDataThead.eq(6).html('Credit');
			
			$('#subjectBal_dropdownMenuCode').text('Account Code');
			$('#show_two').text('Expand two');
			$('#show_three').text('Expand Three');
			$('#show_four').text('ExpandAll');
			$('#show_one').text('PackUp');
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
	
	//获得当前年和月
	this.getYearAndMonth = function(){
		var year = me.date.getFullYear();
		var month = me.date.getMonth();
		month = month + 1;
		if(month < 10){
			month = "0" + month;
		}
		return year+"-"+month;
	}
	
	//请求表数据
	this.getTableData = function(time,type){
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:false,
			url: url+new Base64().encode("tosys/coaReport/balance/balance/"+me.getYearAndMonth()+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId+"/"+me.type),
			callback:function(res){ //表数据
				var list=res.pop();
				$.each(res,function(i){
					me.addTableData(res[i]);
				})					
				me.addLastData(list);	
				
				//TODO 加以权限切换中英文
				if($('#main-changeLanguage').html() == "中文"){
					var subjectDataTd = $('#subjectBalTbody>tbody>tr');
					for(var i=0; i<$('#subjectBalTbody').children().length-2; i++){
						$('#subjectBalTbody').children().eq(i).children().eq(1).html(res[i].itemEnglishName==undefined?res[i].itemName:res[i].itemEnglishName);
					}
				}
			}
		});
	}
	
	//添加数据
	this.addTableData=function(res){
		//科目名称
		var messageByHardcode=ComboBoxSources.getInfoMapByKey('chartOfAccounts','hardCode');
		
		var messageByHardcodeThis=messageByHardcode[res.itemCoaHardCodes];
		var messageThisName=messageByHardcodeThis.name;
		//判断是否debit
		var messageThisDebitCredit=messageByHardcodeThis.debitCredit;
		var debit=(res.itemVale1==undefined)?0:res.itemVale1;//借方
		var crebit=(res.itemVale2==undefined)?0:res.itemVale2;//贷方
		var endAmt=(res.itemVale3==undefined)?0:res.itemVale3;//期末余额
		var beginAmt='';//期初余额
		if(messageThisDebitCredit=='debit'){
			beginAmt=parseFloat(endAmt-debit+crebit);
		}else{
			beginAmt=parseFloat(endAmt+debit-crebit);
		}
		var line=$('<tr>'+
				'<td class="code text-left p-l-20">'+res.itemCoaHardCodes+'</td>'+//科目代码
				'<td class="name text-left p-l-20">'+messageThisName+'</td>'+//科目名称
				'<td class="beginAmt text-right">'+money(beginAmt)+'</td>'+//期初余额
				'<td class="debit text-right">'+money(debit)+'</td>'+//借方
				'<td class="crebit text-right">'+money(crebit)+'</td>'+//贷方
				'<td class="endAmt text-right">'+money(endAmt)+'</td>'+//期末余额
				'</tr>');
		$('#subjectBalTbody').append(line);
		me.sumBalance+=parseFloat(line.find('.beginAmt').text());
		me.sumDebit+=parseFloat(line.find('.debit').text());
		me.sumCredit+=parseFloat(line.find('.crebit').text());
		me.sumLastBalance+=parseFloat(line.find('.endAmt').text());
	}
	
	//添加尾行
	this.addLastData=function(list){
		console.log(me.sumBalance,me.sumDebit)
		var line = '<tr>'+
			'<td id="totalMonth" colspan=2 class="text-center">'+'本月合计'+'</td>'+
			'<td class="text-right">'+(money(me.sumBalance))+'</td>'+
			'<td class="text-right">'+(money(me.sumDebit))+'</td>'+
			'<td class="text-right">'+(money(me.sumCredit))+'</td>'+
			'<td class="text-right">'+(money(me.sumLastBalance))+'</td>'+
			'</tr>';
		$('#subjectBalTbody').append(line);
		if($('#main-changeLanguage').html() == "中文"){
			$('#subjectBalTbody').find('#totalMonth').text('Month Cumulative');
		}
		
		var lasttr='<tr>'+
			'<td id="totalYears" colspan=2 class="text-center">'+'本年累计'+'</td>'+
			'<td class="text-right">'+(money(list.itemVale4))+'</td>'+
			'<td class="text-right">'+(money(list.itemVale1))+'</td>'+
			'<td class="text-right">'+(money(list.itemVale2))+'</td>'+
			'<td class="text-right">'+(money(list.itemVale3))+'</td>'+
			'</tr>';

		$("#subjectBalTbody").append(lasttr);
		if($('#main-changeLanguage').html() == "中文"){
			$('#subjectBalTbody').find('#totalYears').text('Year Cumulative');
		}
	}

	
}

var BssSubjectBalBindModle = function(bssSubjectBalMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	bssSubjectBalMgt.type=1;
	
	//每次点击搜索，需要清空表格数据
	this.emptyTable = function(time,type){
		var time=$("#subjectBal-time").val();
		$('#subjectBalTbody').html('');
		bssSubjectBalMgt.sumBalance=0;//期初余额之和
		bssSubjectBalMgt.sumDebit=0;//借方之和
		bssSubjectBalMgt.sumCredit=0;//贷方之和
		bssSubjectBalMgt.sumLastBalance=0;//期末余额
		me.getTableData(time,type);
	}
	
	//请求表数据
	this.getTableData = function(time,type){
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			showWaiting:false,
			url: url+new Base64().encode("tosys/coaReport/balance/balance/"+time+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId+"/"+bssSubjectBalMgt.type),
			callback:function(res){ //表数据
				var list=res.pop();
				$.each(res,function(i){
					bssSubjectBalMgt.addTableData(res[i]);
				})					
				bssSubjectBalMgt.addLastData(list);				
			}
		});
	}
	
	this.bind = function(){
		//点击搜索
		var time = $("#subjectBal-time").val();
		console.log(time);
		if(time == ''){
			time = bssSubjectBalMgt.getYearAndMonth();
		}
		
		$("#subjectBal-search").on('click',function(){	
			time = $("#subjectBal-time").val();
			$("#subjectBal_nowDate").text(time);
			me.emptyTable(time,bssSubjectBalMgt.type);
		});
		
		//科目余额表
		$("#subjectBal-refresh").on('click',function(){
			$.addTab({title:"科目余额表",isFrame:false,url:ctx+"/page/modules/equipment/subjectBal.html",reload:true});
		});
		//点击caret
		$('#show_one').on('click',function(){
			bssSubjectBalMgt.type=1;
	
			me.emptyTable(time,bssSubjectBalMgt.type);
		})
		$('#show_two').on('click',function(){
			bssSubjectBalMgt.type=2;
		
			me.emptyTable(time,bssSubjectBalMgt.type);
		})
		$('#show_three').on('click',function(){
			bssSubjectBalMgt.type=3;
		
			me.emptyTable(time,bssSubjectBalMgt.type);
		})
		$('#show_four').on('click',function(){
			bssSubjectBalMgt.type=4;
			
			me.emptyTable(time,bssSubjectBalMgt.type);
		})
		//打印事件
		$('#subjectBal-print').on('click',function(){
			var time = bssSubjectBalMgt.getYearAndMonth();
			var dateTime = $('#subjectBal-time').val();
			if(dateTime.length==11){
				dateTime = time;
			}
			if($('#main-changeLanguage').text()=='中文')
				var url = new Base64().encode("reportName=AccountBalanceEN&accountBalancedate="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId+"&type="+bssSubjectBalMgt.type+"&printType=pdf");
			else
				var url = new Base64().encode("reportName=AccountBalance&accountBalancedate="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId+"&type="+bssSubjectBalMgt.type+"&printType=pdf");
			window.open(_global_settings.service.url+"/ac/print/"+url);
		});
		
		//导出
		$("#subjectBal-out").on({
			"click":function(){
				
				var time = bssSubjectBalMgt.getYearAndMonth();
				var dateTime = $('#subjectBal-time').val();
				if(dateTime.length==11){
					dateTime = time;
				}
				if($('#main-changeLanguage').text()=='中文')
					var url = new Base64().encode("tosys/coaReport/export/subjectBalEnglish/"+dateTime+"/"+bssSubjectBalMgt.type+'/0/0/0/0/0/0/0/0/0/'+currentUserInfo.id+"/"+currentUserInfo.loginId);
				else
					var url = new Base64().encode("tosys/coaReport/export/subjectBal/"+dateTime+"/"+bssSubjectBalMgt.type+'/0/0/0/0/0/0/0/0/0/'+currentUserInfo.id+"/"+currentUserInfo.loginId);
				$.openHref(_global_settings.service.url+'/ac/exportReport/'+url);
			}
		});
	}
	
	this.unbindAll = function(){
		$("#subjectBal-search").off('click');
	}
}