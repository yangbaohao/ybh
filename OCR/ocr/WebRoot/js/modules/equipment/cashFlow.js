var CashflowMgt = function(){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	this.random = Math.random();
	this.cashFlowId = null;
	this.yearAmt = null;
	this.monthAmt = null;
	this.date = new Date();
	
	//初始化页面所有的控件
	this.initInput = function(){
		me.setIdAndTextAlign();
		$("#cashFlow_nowDate").text(me.setDate());
		$('#cashflow-time').monthpicker({callback:'dasdasd'});
		$("#cashflow_comname").text(_global_settings.owner.companyname);
//		$("#cashflow-time").datetimeinput({formatString:"yyyy-MM", width: '120px', height: '34px'});
//		$("#cashflow-time").jqxDateTimeInput('val',new Date()); //设置结束日期默认为当天
		me.getTableData();
		me.disInput('y');
		me.disInput('m');
		me.inputEvent();
		me.initPages();
		
	}
	
	this.initPages = function(){
        if($('#main-changeLanguage').html() == "中文"){
            $('#cashflow-search').html('&nbsp;&nbsp;Search&nbsp;&nbsp;&nbsp;');
            $('#cashflow-print').html('&nbsp;&nbsp;Print&nbsp;&nbsp;&nbsp;');
            $('#cashflow-out').html('&nbsp;&nbsp;Export&nbsp;&nbsp;&nbsp;');
            $('#cashFlow-searchdate').html('Date');
            $('#cashFlow-headMsg').html('Cash Flow Statement');
//			$('#cashflow_comname').html('SuZhou Yi Cui Network Technology co., LTD');
//			$('#cashflow-table03').html("China's Accounting Standards 02 Report")

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
            $('#cashFlow_nowDate').text(setDate());
            $('#cashFlow-unit').html('Unit：RMB');

            //渲染表数据
            var cashflowDataThead = $('#cashFlowDataTable>thead>tr>th');
            cashflowDataThead.eq(0).html('Items');
            cashflowDataThead.eq(1).html('Line No.');
            cashflowDataThead.eq(2).html('Accumulated Amount For The Year');
            cashflowDataThead.eq(3).html('Accumulated Amount For The Month');

            var cashFlowdataTbody = $('#cashFlowDataTable>tbody>tr');
            cashFlowdataTbody.eq(0).find('td:first').text('I、 Cash flows from operating activities:');
            cashFlowdataTbody.eq(1).find('td:first').text('Cash received from sale of goods or rendering of services');
            cashFlowdataTbody.eq(2).find('td:first').text('Other cash received relating to operating activities');
            cashFlowdataTbody.eq(3).find('td:first').text('Cash paid for goods and services');
            cashFlowdataTbody.eq(4).find('td:first').text('Cash paid to and on behalf of employees');
            cashFlowdataTbody.eq(5).find('td:first').text('Payments of all types of taxes');
            cashFlowdataTbody.eq(6).find('td:first').text('Other cash paid relating to operating activities');
            cashFlowdataTbody.eq(7).find('td:first').text('Net cash flows from operating activities');
            cashFlowdataTbody.eq(8).find('td:first').text('II、 cash flow from investing activities:');
            cashFlowdataTbody.eq(9).find('td:first').text('Cash received from disposal of investments');
            cashFlowdataTbody.eq(10).find('td:first').text('Cash received from returns on investments');
            cashFlowdataTbody.eq(11).find('td:first').text('Net cash received from disposal of fixed assets,intangible assets & other long-term assets');
            cashFlowdataTbody.eq(12).find('td:first').text('Other cash received relating to investing activities');
            cashFlowdataTbody.eq(13).find('td:first').text('Cash paid to acquire fixed assets,intangible assets & other long-term assets');
            cashFlowdataTbody.eq(14).find('td:first').text('Net cash flows from investing activities');
            cashFlowdataTbody.eq(15).find('td:first').text('III、 cash flow from financing activities:');
            cashFlowdataTbody.eq(16).find('td:first').text('Cash received from borrowings');
            cashFlowdataTbody.eq(17).find('td:first').text('Cash received from capital contribution');
            cashFlowdataTbody.eq(18).find('td:first').text('Cash repayments of amounts borrowed');
            cashFlowdataTbody.eq(19).find('td:first').text('Cash payments of interest expenses');
            cashFlowdataTbody.eq(20).find('td:first').text('Cash payments for distribution of dividends or profit');
            cashFlowdataTbody.eq(21).find('td:first').text('Net cash flows from financing activities');
            cashFlowdataTbody.eq(22).find('td:first').text('IV、Net increase in cash');
            cashFlowdataTbody.eq(23).find('td:first').text('Plus:Cash at beginning of year');
            cashFlowdataTbody.eq(24).find('td:first').text('V、Cash at end of year');
        }
    }
	
	this.inputEvent=function(){
		var type_m='update';
		$("#cashflow-update-m").on('click',function(){
			var btn=$(this);
			$('.editInput_m').parent().removeClass('p-r-10').addClass('p-r-l-10');
			$('.editInput_y').parent().removeClass('p-r-10').addClass('p-r-l-10');
			if(type_m=='save'){
				var j20=moneySmall($('#cf_input_m_20').text());
				var j21=moneySmall($('#cf_input_m_21').text());
				var j22=moneySmall($('#cf_input_m_22').text());
				if(money(j20+j21)!=money(j22)){
					Core.alert({
						message:'现金净增加额加期初现金余额不等于期末现金余额,请重新调整'
					})
					return false;
				}
				var arr=[];
				$('#cashFlowDataTable').find('.editInput_m').each(function(i,v){
					var json={};
					var t=$(this);
					json.id=t.attr('data-id');
					if(i in {6:true,12:true,18:true,19:true,20:true,21:true}){
						json.monthAmt=moneySmall(t.text());
					}else{
						json.monthAmt=moneySmall(t.val());
					}
					
					arr.push(json);
				})
				Core.AjaxRequest({
					type:"POST",
					showMsg:false,
					async:false,
					params:arr,
					url:url+new Base64().encode("tosys/coaReport/adjust/"+$('#cashflow-time').val()+'/'+currentUserInfo.id+"/"+currentUserInfo.loginId),
					callback:function(res){
						setCloseAlertTimeOneSecond();
						me.setValue(res);
						btn.addClass('md-rate-review');
						btn.removeClass('md-save');
						btn.attr('title','保存');
						//btn.html('调 &nbsp;&nbsp;&nbsp;整');
						me.disInput('m');
						type_m='update';							
					}
				});
				
				return ;
			}
			if(type_m=="update"){				
				btn.addClass('md-save');
				btn.removeClass('md-rate-review');
				btn.attr('title','保存');
				//btn.html('保&nbsp;&nbsp;&nbsp;存');
				me.allowInput('m');
				type_m='save';
				return ;
			}
		})
		
		var type_y='update';
		$("#cashflow-update-y").on('click',function(){
			var btn=$(this);
			$('.editInput_m').parent().removeClass('p-r-10').addClass('p-r-l-10');
			$('.editInput_y').parent().removeClass('p-r-10').addClass('p-r-l-10');
			if(type_y=='save'){
				var j20=moneySmall($('#cf_input_y_20').text());
				var j21=moneySmall($('#cf_input_y_21').text());
				var j22=moneySmall($('#cf_input_y_22').text());
				if(money(j20+j21)!=money(j22)){
					Core.alert({
						message:'现金净增加额加期初现金余额不等于期末现金余额,请重新调整'
					})
					return false;
				}
				var arr=[];
				$('#cashFlowDataTable').find('.editInput_y').each(function(i,v){
					var json={};
					var t=$(this);
					json.id=t.attr('data-id');
					if(i in {6:true,12:true,18:true,19:true,20:true,21:true}){
						json.yearAmt=moneySmall(t.text());
					}else{
						json.yearAmt=moneySmall(t.val());
					}
					
					arr.push(json);
				})
				Core.AjaxRequest({
					type:"POST",
					showMsg:false,
					async:false,
					params:arr,
					url:url+new Base64().encode("tosys/coaReport/adjustYear/"+$('#cashflow-time').val()+'/'+currentUserInfo.id+"/"+currentUserInfo.loginId),
					callback:function(res){
						setCloseAlertTimeOneSecond();
						me.setValue(res);
						btn.addClass('md-rate-review');
						btn.removeClass('md-save');
						btn.attr('title','保存');
						//btn.html('调 &nbsp;&nbsp;&nbsp;整');
						me.disInput('y');
						type_y='update';							
					}
				});
				
				return ;
			}
			if(type_y=="update"){				
				btn.addClass('md-save');
				btn.removeClass('md-rate-review');
				btn.attr('title','保存');
				//btn.html('保&nbsp;&nbsp;&nbsp;存');
				me.allowInput('y');
				type_y='save';
				return ;
			}
		})
		
		$('.editInput_m').moneyinput();
		$('.editInput_y').moneyinput();
		$('.editInput_m').parent().removeClass('p-r-10').addClass('p-r-l-10');
		$('.editInput_y').parent().removeClass('p-r-10').addClass('p-r-l-10');
		
		$("#cashFlowDataTable").on('keyup','.editInput_m',function(){
			// 计算数值
			// 对应公式：7=1+2-3-4-5-6 13=8+9+10-11-12 19=14+15-16-17-18 20=7+13+19
			// 22=20+21
			if($('#cf_input_m_1').attr('readonly')) return ;
			var sum7=0;
			var sum13=0;
			var sum19=0;
			var sum20=0;
			var sum21=0;
			var sum22=0;
			var sum7_arr_m=[1,2,3,4,5,6];
			$.each(sum7_arr_m,function(i,v){
				sum7_arr_m[i]=parseFloat(moneySmall($('#cf_input_m_'+v).val()));
			})
			sum7=sum7_arr_m[0]+sum7_arr_m[1]-sum7_arr_m[2]-sum7_arr_m[3]-sum7_arr_m[4]-sum7_arr_m[5];
			$('#cf_input_m_7').text(moneyBig(sum7));
			
			var sum13_arr_m=[8,9,10,11,12];
			$.each(sum13_arr_m,function(i,v){
				sum13_arr_m[i]=parseFloat(moneySmall($('#cf_input_m_'+v).val()));
				
			})
			sum13=sum13_arr_m[0]+sum13_arr_m[1]+sum13_arr_m[2]-sum13_arr_m[3]-sum13_arr_m[4];
			$('#cf_input_m_13').text(moneyBig(sum13));
			
			var sum19_arr_m=[14,15,16,17,18];
			$.each(sum19_arr_m,function(i,v){
				sum19_arr_m[i]=parseFloat(moneySmall($('#cf_input_m_'+v).val()));
			})
			sum19=sum19_arr_m[0]+sum19_arr_m[1]-sum19_arr_m[2]-sum19_arr_m[3]-sum19_arr_m[4];
			$('#cf_input_m_19').text(moneyBig(sum19));
						
			sum20=moneySmall(sum7)+moneySmall(sum13)+moneySmall(sum19);
			$('#cf_input_m_20').text(moneyBig(sum20));
		})
		
		$("#cashFlowDataTable").on('keyup','.editInput_y',function(){
			// 计算数值
			// 对应公式：7=1+2-3-4-5-6 13=8+9+10-11-12 19=14+15-16-17-18 20=7+13+19
			// 22=20+21
			if($('#cf_input_y_1').attr('readonly')) return ;
			var sum7=0;
			var sum13=0;
			var sum19=0;
			var sum20=0;
			var sum21=0;
			var sum22=0;
			var sum7_arr_y=[1,2,3,4,5,6];
			$.each(sum7_arr_y,function(i,v){
				sum7_arr_y[i]=parseFloat(moneySmall($('#cf_input_y_'+v).val()));
			})
			sum7=sum7_arr_y[0]+sum7_arr_y[1]-sum7_arr_y[2]-sum7_arr_y[3]-sum7_arr_y[4]-sum7_arr_y[5];
			$('#cf_input_y_7').text(moneyBig(sum7));
			
			var sum13_arr_y=[8,9,10,11,12];
			$.each(sum13_arr_y,function(i,v){
				sum13_arr_y[i]=parseFloat(moneySmall($('#cf_input_y_'+v).val()));
				
			})
			sum13=sum13_arr_y[0]+sum13_arr_y[1]+sum13_arr_y[2]-sum13_arr_y[3]-sum13_arr_y[4];
			$('#cf_input_y_13').text(moneyBig(sum13));
			
			var sum19_arr_y=[14,15,16,17,18];
			$.each(sum19_arr_y,function(i,v){
				sum19_arr_y[i]=parseFloat(moneySmall($('#cf_input_y_'+v).val()));
			})
			sum19=sum19_arr_y[0]+sum19_arr_y[1]-sum19_arr_y[2]-sum19_arr_y[3]-sum19_arr_y[4];
			$('#cf_input_y_19').text(moneyBig(sum19));
						
			sum20=moneySmall(sum7)+moneySmall(sum13)+moneySmall(sum19);
			$('#cf_input_y_20').text(moneyBig(sum20));
		})
	}
	
	this.disInput=function(type){
		$("#cashFlowDataTable").find('.editInput_'+type).each(function(){
			$(this).attr('readonly','readonly');
		})
	}
	
	this.allowInput=function(type){
		$("#cashFlowDataTable").find('.editInput_'+type).each(function(){
			$(this).removeAttr('readonly');
		})
	}
	
	this.setValue=function(res,date){
		for(var i=0;i<res.length;i++){
			var id = res[i].id;
			var yearAmt = res[i].yearAmt;
			var monthAmt = res[i].monthAmt;
			var sum3_y=0;
			var sum3_m=0;
			if(id in {7:true,13:true,19:true,20:true,21:true,22:true}){
				$('#cf_input_y_'+id).text(moneyBig(yearAmt));
				$('#cf_input_m_'+id).text(moneyBig(monthAmt));	
				if(id in {7:true,13:true,19:true}){
					sum3_y+=yearAmt;
					sum3_m+=monthAmt;
				}
			}else{
				$('#cf_input_y_'+id).val(money(yearAmt));						
				$('#cf_input_m_'+id).val(money(monthAmt));						
			}
			$('#cf_input_m_'+id).attr('data-id',id);
			$('#cf_input_y_'+id).attr('data-id',id);
			
			//me.addDataToTable(me.cashFlowId,me.yearAmt,me.monthAmt);
		}
		$("#cashFlowDataTable").data('time',date);
	}
	
	//重置id
	this.setIdAndTextAlign = function(){
		$("#cashFlowDataTable tr:gt(0)").each(function(i,v){ //循环遍历表格，从第二行开始
			var id = $(this).attr("id");
			if(id!=undefined){
				$(this).attr("id",id+me.random);
			}
		})
	};
	
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
	
	//请求表数据
    this.getTableData= function(){
        Core.AjaxRequest({
            type:"GET",
            showMsg:false,
            url: url+new Base64().encode("tosys/coaReport/cashflow/month/"+$('#cashflow-time').val()+'/'+currentUserInfo.id+"/"+currentUserInfo.loginId),
            callback:function(res){ //表数据
                for(var i=0;i<res.length;i++){
                    me.cashFlowId = res[i].id;
                    me.yearAmt = res[i].yearAmt;
                    me.monthAmt = res[i].monthAmt;
                    me.addDataToTable(me.cashFlowId,me.yearAmt,me.monthAmt);
                }
                me.setValue(res,me.getYearAndMonth());
//				me.calculate();
                me.setTextStyle();//设置表样式
            }
        });
    }
	
	//设置表样式
	this.setTextStyle=function(){
		$("#cashFlowDataTable tr:gt(0)").each(function(i,v){
			var id = $(this).attr('id');
			if(id!=undefined){
				$(this).find('td').each(function(i){
					if(i==2||i==3){
						$(this).attr('class','p-r-10 text-right');
					}
				});
			}
		});
	}
	
	//循环表格添加数据
	this.addDataToTable = function(cashFlowId,yearAmt,monthAmt){
		var table = $("#cashFlowDataTable"); 
		$("#cashFlowDataTable tr:gt(0)").each(function(i,v){ //循环遍历表格，从第二行开始
			var id = $(this).attr("id");
			if(id!=undefined){ //排除未定义id的行
				if(id.substring(0,3)>=100){
					id = id.substring(0,2);
				}else{
					id = id.substring(0,1);
				}
				$(this).find('td').each(function(i){ //找到每一行下的td
					var t=$(this);
					var input=t.find('input');
					if(i!=0&&i!=1){ //排除每一行下的第一个和第二个td
						if(id==cashFlowId){ //找到相对应的那一行，然后添加数据
							if(i==2){
								input.val(formatNum(yearAmt));
							}else{
								input.val(formatNum(monthAmt));	
							}
						}else{ //如果已经添加过数据的行，则不允许赋值0，数据应不变
							if(input.val() == ""){
								input.val(0); //等于空的赋值0
							}else{
								//不等于空的，说明已经添加过数据
							}
						}
					}
				});
			}
		});
	}
	
	//set经营活动产生的现金流量净额
	this.setFirstValue = function(){
		var yearValue = 0;
		var monthValue = 0;
		var table = $("#cashFlowDataTable>tbody>tr");
			table.each(function(i,v){
			if(i>0 && i<=6){
				if(i==1||i==2){
					$(this).find('td').each(function(m,n){
						if(m!=0&&m!=1){
							if(m==2){
								yearValue += parseFloat($(this).text());
							}else{
								monthValue += parseFloat($(this).text());
							}
						}
					})
				}else{
					$(this).find('td').each(function(m,n){
						if(m!=0&&m!=1){
							if(m==2){
								yearValue -= parseFloat($(this).text());
							}else{
								monthValue -= parseFloat($(this).text());
							}
						}
					})
				}
			}
		})
		return [yearValue,monthValue];
	};
	
	//set投资活动产生的现金流量净额
	this.setSecondValue = function(){
		var yearValue = 0;
		var monthValue = 0;
		var table = $("#cashFlowDataTable>tbody>tr");
		table.each(function(i,v){
			if(i>=9 && i<=13){
				if(i>=9&&i<=11){
					$(this).find('td').each(function(m,n){
						if(m!=0&&m!=1){
							if(m==2){
								yearValue += parseFloat($(this).text());
							}else{
								monthValue += parseFloat($(this).text());
							}
						}
					})
				}else{
					$(this).find('td').each(function(m,n){
						if(m!=0&&m!=1){
							if(m==2){
								yearValue -= parseFloat($(this).text());
							}else{
								monthValue -= parseFloat($(this).text());
							}
						}
					})
				}
			}
		});
		return [yearValue,monthValue];
	}
	
	//set筹资活动产生的现金流量净额
	this.setThirdValue = function(){
		var yearValue = 0;
		var monthValue = 0;
		var table = $("#cashFlowDataTable>tbody>tr");
		table.each(function(i,v){
			if(i>=16&&i<=20){
				if(i>=16&&i<=17){
					$(this).find('td').each(function(m,n){
						if(m!=0&&m!=1){
							if(m==2){
								yearValue += parseFloat($(this).text());
							}else{
								monthValue += parseFloat($(this).text());
							}
						}
					})
				}else{
					$(this).find('td').each(function(m,n){
						if(m!=0&&m!=1){
							if(m==2){
								yearValue -= parseFloat($(this).text());
							}else{
								monthValue -= parseFloat($(this).text());
							}
						}
					})
				}
			}
		});
		return [yearValue,monthValue];
	}
	//计算表
	this.calculate = function(){
		var table = $("#cashFlowDataTable>tbody>tr");
		
		table.eq(7).find('td').eq(2).text(me.setFirstValue()[0]);
		table.eq(7).find('td').eq(3).text(me.setFirstValue()[1]);
		table.eq(14).find('td').eq(2).text(me.setSecondValue()[0]);
		table.eq(14).find('td').eq(3).text(me.setSecondValue()[1]);
		table.eq(21).find('td').eq(2).text(me.setThirdValue()[0]);
		table.eq(21).find('td').eq(3).text(me.setThirdValue()[1]);
		
		//现金净增加额
		var value1 = parseFloat(table.eq(7).find('td').eq(2).text())+parseFloat(table.eq(14).find('td').eq(2).text())+parseFloat(table.eq(21).find('td').eq(2).text());
		var value2 = parseFloat(table.eq(7).find('td').eq(3).text())+parseFloat(table.eq(14).find('td').eq(3).text())+parseFloat(table.eq(21).find('td').eq(3).text());
		table.eq(22).find('td').eq(2).text(parseFloat(value1));
		table.eq(22).find('td').eq(3).text(parseFloat(value2));
		//期末现金余额
		var value3 = parseFloat(table.eq(23).find('td').eq(2).text());
		var value4 = parseFloat(table.eq(23).find('td').eq(3).text());
		table.eq(24).find('td').eq(2).text(value1+value3);
		table.eq(24).find('td').eq(3).text(value2+value4);
	}
}

var CashflowBindModle = function(cashflowMgt){
	var me=this;
	var url = _global_settings.service.url+"/ac/";
	
	//每次点击搜索请求表数据
    this.searchTableData = function(yearMonth){
        Core.AjaxRequest({
            type:"GET",
            showMsg:false,
            url: url+new Base64().encode("tosys/coaReport/cashflow/month/"+yearMonth+'/'+currentUserInfo.id+"/"+currentUserInfo.loginId),
            callback:function(res){ //表数据
                for(var i=0;i<res.length;i++){
                    cashflowMgt.cashFlowId = res[i].id;
                    cashflowMgt.yearAmt = res[i].yearAmt;
                    cashflowMgt.monthAmt = res[i].monthAmt;
                    cashflowMgt.addDataToTable(cashflowMgt.cashFlowId,cashflowMgt.yearAmt,cashflowMgt.monthAmt);
                }
            }
        });
    }
	
	//每次点击搜索，先清空表格数据
	this.emptyTable = function(yearMonth){
		/*$("#cashFlowDataTable tr:gt(0)").each(function(i,v){ //循环遍历表格，从第二行开始
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
		});*/
		me.searchTableData(yearMonth);
	}
	
	this.bind = function(){
		//点击搜索
		$("#cashflow-search").on('click',function(){
			var yearMonth = $("#cashflow-time").val();
			if(yearMonth == ''){
				yearMonth = cashflowMgt.getYearAndMonth();
			}
			$("#cashFlow_nowDate").text(yearMonth);			
			me.emptyTable(yearMonth);
		});
		//点击刷新
		$("#cashflow-refresh").on('click',function(){
			$.addTab({title:"现金流量表",isFrame:false,url:ctx+"/page/modules/equipment/cashFlow.html",pk:{random:Math.random()},reload:true});
		});
		$("#cashflow-out").on({
			"click":function(){
				
				var yearMonth = $("#cashflow-time").val();
				if(yearMonth == ''){
					yearMonth = cashflowMgt.getYearAndMonth();
				}
				$.openHref(_global_settings.service.url+'/common/export/cashflow/'+yearMonth)
			}
		});
	}
	
	this.unbindAll = function(){
		
	}
	//导出
    $("#cashflow-out").on({
        "click":function(){
            var time = cashflowMgt.getYearAndMonth();
            var dateTime =   $('#cashflow-time').val();
            if(dateTime.length==11){
                dateTime = time;
            }
            var url;
            if($('#main-changeLanguage').html() == "中文"){
            	url = new Base64().encode("tosys/coaReport/export/cashflowEnglish/"+dateTime+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId);
            }else{
            	url = new Base64().encode("tosys/coaReport/export/cashflow/"+dateTime+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId);
            }
            $.openHref(_global_settings.service.url+'/ac/exportReport/'+url);
        }
    });

    //打印事件
    $('#cashflow-print').on('click',function(){
        var time = cashflowMgt.getYearAndMonth();
        var dateTime =   $('#cashflow-time').val()
        if(dateTime.length==11){
            dateTime = time;
        }
        var url;
        if($('#main-changeLanguage').html() == "中文"){
            url = new Base64().encode("reportName=CashFlowPrintEN&date="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
        }else{
            url = new Base64().encode("reportName=CashFlowPrint&date="+dateTime+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
        }
        window.open(_global_settings.service.url+"/ac/print/"+url);
    });
	
}