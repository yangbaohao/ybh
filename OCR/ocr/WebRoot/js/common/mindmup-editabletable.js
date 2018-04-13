
$.fn.easytableExamplex=function(settings){
	var source=settings.source;
	
	var limit=settings.limit;
	
	var tax = settings.tax;
	
	var setOrderNoReceive=settings.setOrderNoReceive, 
		enterPriceInfo = settings.enterPriceInfo,
		data=settings.data,
		orderMoney=settings.orderMoney,
		orderReceive=settings.orderReceive,
		orderNoReceive=settings.orderNoReceive,
		orderOverReceive=settings.orderOverReceive,
		grid=settings.grid;
	
	var isview=settings.isview;
	
	if(isview!=null&&isview.toString()=='true'){
		source='product';
	}
	
	//var callback=setting.callback();
	
	var table=$(this);
//	debugger
	var line = "<tr class='cwhite'>" +
	"<td class='blt'><i class='md-cancel del'></i><i class='md-description copy hidden'></i></td>"+
	'<td class="brt brtt"><div class="time"></div></td>'+
	'<td class="brt brtt"><input type="text" class="receiveMoney form-control"><span class="hidden recId"></span></td>'+
	"<td class='brt brtt'><div class='receiveWay'></div></td>" + //prodCombboxs
	"<td class='brt brtt br0'><input type='text' class='remark form-control'></td>" +
	"</tr>";
	
	
	table.easytable({
		tr:line,
		tr_load_func:function(tr,res){
//			var w=174;  //ctrl+v复制
			var res=res==undefined?'':res;
//			if(res=='') w=200;
			var abc=tr;
			abc.find('.time').datetimeinput({
				width:'200px' ,
				height:33,
				formatString: 'yyyy-MM-dd',
				showTimeButton: false,
//				showCalendarButton: false,
				value:new Date()
			}).val(res.time);
			
			abc.find('.time').find('input').keydown(function(e){
				e.preventDefault();
				if(e.keyCode==39){
//					console.log(e.target);
					var select=e.target.selectionStart;
					if(select==8||select==10){
						abc.find('.receiveMoney').focus();
					}
				}
			});
			
			abc.find('.receiveWay').dropDownlist({
				//source:{'cash':'现金','alipay':'支付宝','wechatpay':'微信支付','bankpayonline':'银行转账',/*'bankpay':'刷卡',*/'cheque':'支票'},
				//source:{'cash':'现金','alipay':'支付宝','wechatpay':'微信支付',/*'bankpayonline':'银行转账',*/'bankpay':'银行存款','bankpayonline':'网银支付','cheque':'支票'},
				source:{'cash':'现金','alipay':'支付宝','wechatpay':'微信支付','bankpayonline':'银行转账','bankpay':'刷卡','cheque':'支票'},
				width:'140px', 
				height:33,
				selectedIndex:0
			}).val(res.way);
			
			abc.find('.receiveWay').keydown(function(e){
				if(e.keyCode==39){ //向右
//					console.log(e.target);
					abc.find('.remark').focus();
					$(this).jqxDropDownList('close');
				}
				if(e.keyCode==37){ //向左
					abc.find('.receiveMoney').focus();
					$(this).jqxDropDownList('close');
				}
			});
			
			abc.find('.receiveMoney').moneyinput().val(res.receive);
			if(res=='') abc.find('.receiveMoney').width(200);
			abc.find('.remark').val(res.remark);
			abc.find('.receiveMoney').on('change keyup',function(){
				var val=$(this).val();
				var tr=$(this).parent();
				var _id=tr.find('.recId').text();
				if(_id!=''){
					if(val==0){
//						Core.alert({message:'编辑的收/付款记录不能为0！'});
						$(this).addClass('s1r');
//						return false;
					}else{
						$(this).removeClass('s1r');
					}
				}
				//收款记录变化，使未收已送款发生变化
				setOrderNoReceive(enterPriceInfo);
			})//.moneyinput().width(200);
			
			abc.find('.receiveMoney').keydown(function(e){
				var t=$(this);
				var val=t.val();
				var select=e.target.selectionStart;
				var cell=$('#'+grid).jqxGrid('getselectedcell');
				if(cell!=undefined){
					$('#'+grid).jqxGrid('unselectcell',cell.rowindex,cell.datafield);
				}
				
				if(e.keyCode==39){ //向右
					if(select==val.length){
						abc.find('.receiveWay').jqxDropDownList('focus');
						abc.find('.receiveWay').jqxDropDownList('open');
					}
				}
				if(e.keyCode==37){ //向左
					if(select==0){
						abc.find('.time').jqxDateTimeInput('focus');
						abc.find('.time').jqxDateTimeInput('open');
					}
				}
				//ctrl+x
				if(e.keyCode==88&&e.ctrlKey){
					abc.find('.del').trigger('click');
					return false;
				}
				//ctrl+shift
				if(e.shiftKey&&e.ctrlKey){
					abc.find('.copy').trigger('click');
					return false;
				}
			});
			
			abc.find('.remark').keydown(function(e){
				var val=$(this).val();
				var select=e.target.selectionStart;
				var cell=$('#'+grid).jqxGrid('getselectedcell');
				if(cell!=undefined){
					$('#'+grid).jqxGrid('unselectcell',cell.rowindex,cell.datafield);
//					return false;
				}
				
				if(e.keyCode==37){ //向左
					if(select==0){
						abc.find('.receiveWay').jqxDropDownList('focus');
						abc.find('.receiveWay').jqxDropDownList('open');
					}
				}
				//ctrl+x
				if(e.keyCode==88&&e.ctrlKey){
					abc.find('.del').trigger('click');
					return false;
				}
				//ctrl+shift
				if(e.shiftKey&&e.ctrlKey){
					abc.find('.copy').trigger('click');
					return false;
				}
			});
		},
		tr_del_func:function(tr,callback){
			var id=tr.find('.recId').text();
			if(id==''){
				callback()
				return;
			}
				
			Core.AjaxRequest({
				url:_global_settings.service.url+'/'+settings.type+'/delete/'+id,
				type:'POST',
				callback:function(){
					callback()
				}
			})
		}
	}).on('change keyup ',function(){
		var node=$(this);
		var tr=node.find('tbody').children();
		var allreceive=0,allvatsum=0;
		tr.each(function(){
			var t=$(this);
			var num=money(t.find('.receiveMoney').val()); 
			allreceive+=num*1;
		});
//		debugger
		orderReceive.val(money(allreceive));
		
		//收款记录变化，使未收已送款发生变化
		setOrderNoReceive(enterPriceInfo);
	});
	
	//收款记录变化，使未收已送款发生变化
	setOrderNoReceive(enterPriceInfo);
	
	var loadTableTrData=function(data){
		$.each(data,function(i,v){
			var tr=table.find('tbody>tr').eq(-1);
			tr.find('.recId').text(v.id);
			tr.find('.time').data('value',v.createDate.substring(0,10)).val(v.createDate.substring(0,10));
			tr.find('.receiveMoney').val(money(v.amount)).data('value',v.amount);
			tr.find('.receiveWay').data('value',v.payWay).val(v.payWay);
			
			tr.find('.remark').data('value',v.remark).val(v.remark);
			tr.trigger('click');
			
		})
		if(isview){
			table.find('tbody>tr').eq(-1).remove();
		}
		table.trigger('change');
	}
	
	var disabledTable=function(){
		table.find('input').each(function(){
			$(this).attr('disabled','disabled');
		})
		table.find('.jqx-combobox-state-normal').each(function(){
			$(this).jqxComboBox('disabled',true);
		})
//		table.find('.vat').each(function(){
//			$(this).jqxDropDownList('disabled',true);
//		})
		table.find('.del').each(function(){
			$(this).parent().remove();
		})
		table.find('tr').on('click',function(){
			return false;
		})
	}
	if(data)
		loadTableTrData(data)
	if(isview)
		disabledTable()

	//var html=[];
	
}

$.fn.zqwRecOrpayTable=function(settings){
	var source=settings.source;
	
	var setOrderNoReceive=settings.setOrderNoReceive, 
		enterPriceInfo = settings.enterPriceInfo,
		orderMoney=settings.orderMoney,
		receiveMoney=settings.receiveMoney,
		notReceiveMoney=settings.notReceiveMoney,
		overReceiveMoney=settings.overReceiveMoney;
	
	var table=$(this);
	
	var line = "<tr class='cwhite'>" +
	'<td class="brt"><div class="time"></div></td>'+
	'<td class="brt"><div class="money"></div></td>'+
	"<td class='brt'><div class='way'></div></td>"+
	"<td ><div class='remark'></div></td>" +
	"</tr>";
	
	var loadTableTrData=function(source){
		var sum=0;
		var map={'cash':'现金','alipay':'支付宝','wechatpay':'微信支付','bankpayonline':'银行转账','bankpay':'刷卡','cheque':'支票'};
		$.each(source,function(i,v){
			table.find('tbody').append(line);
			var tr=table.find('tbody').children().eq(i);
			tr.find('.time').text(v.createDate.substring(0,10));
			tr.find('.money').text(money(v.amount));
			//tr.find('.way').text(getCodeData(v.payWay));
			tr.find('.way').text(map[v.payWay]);
			tr.find('.remark').text(v.remark);
			
			sum+=v.amount*1;
		});
		
		receiveMoney.val(money(sum));
		
		//收款记录变化，使未收已送款发生变化
		if(enterPriceInfo!=null&&enterPriceInfo!=undefined){
			setOrderNoReceive(enterPriceInfo);
		}
	}
	
	if(source!=undefined)
		loadTableTrData(source)
	
}
