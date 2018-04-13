/*
 *订单明细界面js 
 */

var VoMgt=function(){
	
	var me=this;
	
	me.url = _global_settings.service.url;
	
	me.data=$.pk.data;
	
	me.name=$.pk.name;
	
	me.amount=$.pk.amount;
	
	me.orderCode=$.pk.orderCode;
	
	me.orderEndDate=$.pk.orderEndDate;
	
	me.vouchers=$.pk.vouchers;
	
	me.init=function(){
		me.loadList(me.data);
		if(me.vouchers==null){
			//读取可用优惠券
			me.getAccountList();
		}else{
			//加载优惠券并执行一些操作
			me.readAccountList();
		}
		me.loadEvent();
		$('#orderDetailsCompanyName').text(me.name);
		$('#orderDetailsCode').text(me.orderCode);
		$('#orderDetailsSum').text(money(me.amount));
	};
	
	me.loadEvent=function(){
		
		$('#orderDetailsPage').on('click','.myAccount',function(event){
			//event.stopPropagation();
			//event.preventDefault();
			if(me.vouchers!=null) return false;
			if(event.target.nodeName.toLowerCase()!='input'){
				if($(this).find('input')[0].checked==true){
					$(this).find('input')[0].checked=false
				}else{
					$(this).find('input')[0].checked=true;
				}
			}
			
			var myAccountSum= me.getCheckSum();
			if(me.amount/2>parseFloat(myAccountSum)){
				var lost=parseFloat(me.amount)-parseFloat(myAccountSum);
			}else{
				var lost=me.amount/2;
			}
			
			$('#orderDetailsSum').text(money(lost));
		});
		
		$('#orderDetails-search').on('click',function(){
			var sub=$('#orderDetails-code').val();
			if(sub==''){
				Core.alert({message:'不能为空！'});
				return false;
			}
			Core.AjaxRequest({
	            url : me.url+'/voucher/code/'+sub,
	            type: "GET",
	            callback: function(res) {
	            	if(res==null){
	            		Core.alert({message:'此优惠券号码无效！'})
	            		return false;
	            	}
	            	var html=loadmyAccountList(res,true);
	            	$("#orderDetailsMyAccountList").append(html);
	            },
	            failure:function(res){
	            	//me.loadAccountList();
	            }
	        });
		});
		
		$('#orderDetailsBtn').on('click',function(){
			var record = new Object();
			//record.status = "NOTPAID";
			//record.channel = "ALIPAY";
			record.amount = $("#orderDetailsSum").text();
			record.orderCode=$("#orderDetailsCode").text();
			// 添加订单支付记录，以及优惠券使用记录，设置为false，支付成功之后设置为true
			var json={};
			json.vouchers=me.getvouchers();
			json.accountOrder={orderCode:record.orderCode};
			json.amt=record.amount;
			json.accountAmt=0;
			json.vouchertAmt=0;
			json.totalAmt=record.amount;
			console.log(json);
			Core.AjaxRequest({
				type:"post",
				params:json,
				async:false,
				showMsg:false,
				url:ws_url+'/CXF/rs/accountOrderPay/create',
				callback:function(res){
					
				},
				failure:function(res){
					Core.alert({'message':'订单创建失败！'})
		        }
			});
			
			
			Core.confirm({
				title:"充值",
				message:"支付宝充值结果确认",
				yes:"支付完成",
				no:"支付失败",
				type:"info",
				confirmCallback:function(){
					$.closeTab();
					try{
						$("#payHistory_Grid").jqxGrid('updatebounddata', 'cells');
					}catch(e){}
				},
				cancelCallback:function(){
					Core.alert({message:'请联系客服'});
					$.closeTab();
					try{
						$("#payHistory_Grid").jqxGrid('updatebounddata', 'cells');
					}catch(e){}
					
				}
			});
			
			var w = window.open();
			w.location = ctx + '/page/pay/pay_api.jsp?amount='+record.amount+'&orderCode='+record.orderCode;
			
		});
		
		/*$("#orderDetailsPage").jqxValidator({
    		animationDuration: 1,
    		hintType: 'label',
            rules: [
				{ input: '#orderDetails-code', message: "请选择", action: 'keyup, blur', 
					rule: function(input,commit){
	        		if(input.jqxComboBox('getSelectedItem')==null) return false;
        	   		return true;
					} 
				}
		]})*/
	};
	
	me.getCheckSum=function(){
		var node=$('#orderDetailsPage').find('.myAccount');
		var sum=0;
		$.each(node,function(){
			if($(this).find('input')[0].checked==true){
				sum+=parseFloat($(this).find('.myAccountPrice').find('span').text());
			}
		})
		return sum;
	};
	
	//加载订单详情
	me.loadList=function(data){
		var html=loadPayList(data);
		$("#orderDetailsList").html(html);
		if(data.accountProducts.length==1){
			$('#orderDetailsList').find('.col-md-6').attr('class','col-md-12');
			$('#orderDetailsList').find('.hight120').attr('class','hight70');
		}
	};
	
	me.loadAccountList=function(data,isView){
		var html=loadmyAccountList(data,true,isView);
		$("#orderDetailsMyAccountList").html(html);
	};
	
	me.getvouchers=function(){
		var node=$('.myAccountListCheck');
		var arr=[]
		$.each(node,function(){
			if($(this)[0].checked){
				var json=JSON.parse($(this).next().text());
				arr.push(json);
				//arr.push(JSON.parse($(this).attr('data-id')));
			}
		})
		return arr;
	};
	
	//window.getvouchers=me.getvouchers
	
	//读取可用优惠券
	me.getAccountList=function(){
		var obj={"value":["Y"],"action":"eq","key":"clientInfo.customerFlag"}
		var obj={"condition":[],"filterscount":0,"groupscount":0,"pagenum":0,"pagesize":100};
		obj.condition.push({"value":["Y"],"action":"eq","key":"available"},{"value":["N"],"action":"eq","key":"overdue"});
		var sub=new Base64().encode(JSON.stringify(obj));
		Core.AjaxRequest({
            url : me.url+'/voucher/page/'+sub,
            type: "GET",
            callback: function(res) {
            	me.loadAccountList(res.rows);
            },
            failure:function(res){
            	me.loadAccountList();
            }
        });
	};
	
	//加载优惠券并执行一些操作
	me.readAccountList=function(){
		me.loadAccountList(me.vouchers,true);
		$('.orderDetails-bar').remove();
		if(me.vouchers.length==0){
			$('#orderDetails-title').parent().parent().remove();
		}
		$('#orderDetails-title').html('已使用优惠券');
	};
}
