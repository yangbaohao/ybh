var ReceiptView = function(){

	var me = this;
	var url = _global_settings.service.url;
	var url2 = _global_settings.service.url +"/favourites";
	var ids = null;
	var bizId = null;
	var data = null;
	
	this.initInput = function(){
		console.log($.pk.data);
		ids = $.pk.data.receiptid;
		if($.pk.data.bizId != undefined){
			bizId = $.pk.data.bizId;
			console.log(bizId);
		}
		me.initInterface();
		me.initUserPage();
		me.bindModel();
	}
	
	this.initInterface = function(){
		
		var id = null;
		//区分从凭证进来的和直接从发票进来的
		if($.pk.data.bizId != undefined){
			id = bizId;
		}else{
			id = ids;
		}
		//详情---查看
		Core.AjaxRequest({
			url:url+'/receipt/id/'+id+'/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				data = res;
				console.log(res);
			},
			failure:function(){
			}
		});
		
		//供应商的获取--收款
		Core.AjaxRequest({
			url:url+'/common/getAllclient/N/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				clientARd = res;
			},
			failure:function(){
			}
		});
		
		//客户的获取--开票
		Core.AjaxRequest({
			url:url+'/common/getAllclient/Y/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				clientCRd = res;
			},
			failure:function(){
			}
		});
	}
	
	this.getClientCustomer = function(clientId){
		for(i=0;i<clientCRd.length;i++){
			if(clientId==clientCRd[i].clientId){
				return clientCRd[i];
			}
		}
		
		if(!clientId){
			return '';
		}
	}
	
	this.getClientAgent = function(clientId){
		for(i=0;i<clientARd.length;i++){
			if(clientId==clientARd[i].clientId){
				return clientARd[i];
			}
		}
		
		if(!clientId){
			return '';
		}
	}
	
	this.initUserPage = function(){
		
		if(data.receiptType=='sales'){
			$('#receiptView-radioOut').attr('checked',true);
			$('#rcptView-account').parent().parent().find('label:first').text('收款账户');
		}else if(data.receiptType=='purchase'){
			$('#receiptView-radioIn').attr('checked',true);
			$('#rcptView-account').parent().parent().find('label:first').text('付款账户');
		}
		
		$('#receiptView-radioOut').attr('disabled',true);
		$('#receiptView-radioIn').attr('disabled',true)
		
//		$("#rcptView-clientName").jqxComboBox({
//			source:data,
//			width:'100%',
//			height:'34px',
//			disabled:true,
//		});
//		
		$("#rcptView-reasons").jqxComboBox({
			source:data,
			width:'100%',
			height:'34px',
			disabled:true,
			displayMember: "name", 
        	valueMember: "id"
		});
		
		$("#rcptView-account").jqxComboBox({
			source:data,
			width:'100%',
			height:'34px',
			disabled:true,
			displayMember: "name", 
        	valueMember: "id"
		});
		
		if(data.clientId!=undefined){
			if(me.getClientCustomer(data.clientId)!=undefined){
				$('#rcptView-clientName').val(me.getClientCustomer(data.clientId).name);
			}else if(me.getClientAgent(data.clientId)!=undefined){
				$('#rcptView-clientName').val(me.getClientAgent(data.clientId).name);
			}
		}else{
			if(data.name!=undefined){
				$('#rcptView-clientName').val(data.name);
			}else{
				$('#rcptView-clientName').val('');
			}
		}

		$('#rcptView-num').val(data.receiptNumber==undefined?'':data.receiptNumber);
		$('#rcptView-time').val(data.entryDate==undefined?'':data.entryDate.substring(0,10));
		$('#rcptView-tax').val(data.taxRate==undefined?'0%':data.taxRate+'%');
		$('#rcptView-sum').val(money(data.receiptAmt));
		$('#rcptView-addremarkPrint').val(data.remark2==undefined?'':data.remark2);
		$('#rcptView-addremark').val(data.remark==undefined?'':data.remark);
		$('#rcptView-nosum').val(money(data.unuseAmt));
		$('#rcptView-reasons').find('input').css('color','#000')
		$('#rcptView-account').find('input').css('color','#000')
		$('#rcptView-reasons').val(data.coaReason==undefined?'':data.coaReason.id==undefined?'':data.coaReason.id);
		$('#rcptView-account').val(data.coaDeposit==undefined?'': data.coaDeposit.id ==undefined?'':data.coaDeposit.id);
		$('#rcptView-category').val(getCodeData(data.receiptInvoiceType)==undefined?'':getCodeData(data.receiptInvoiceType));
		
		if(data.coaReason==undefined && data.coaDeposit==undefined){
			$('#rcptView-editsave').css('display','none');
			$('#rcptView-delsave').css('display','none');
		}
	}
	
	this.bindModel = function(){
		
		//附件上传
		$("#rcptView-addattachment").fileuploader({
			readonly:true,
			filelist:data.fileInfoIds
		});
		
		//删除
		$('#rcptView-delsave').off('click').on('click',function(){
			Core.confirm({
				message:'确定要删除？',
				confirmCallback:function(){
					Core.AjaxRequest({
						type:"DELETE",
						showWaiting:false,
						url:_global_settings.service.url+'/ac/'+new Base64().encode( 'tobss/receipt/delete/'+data.id+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
						showMsg:false,
						callback:function(res){
							setCloseAlertTimeOneSecond();
							$.closeTab();
							$("#rcpt-Grid").jqxGrid('updatebounddata', 'cells');
//							$("#Journal").jqxGrid('updatebounddata', 'cells');
						},
						failure:function(res){
			            }
					});
				}
			});
		})
		
		//编辑
		$('#rcptView-editsave').on('click',function(){
			$.closeTab();
			$.addTab({title:"发票编辑",url:"page/modules/fms/receiptEdit.html",
				pk:{data:data},reload:true});
		})
		
		//打印
		$('#rcptView-addsaveprint').off('click').on('click',function(){
			var url;
			
			if(data.coaReason==undefined && data.coaDeposit==undefined){	//AC新增的，在bss打印
				
				if($('#receiptView-radioOut')[0].checked){
					url = new Base64().encode("reportName=SalesReceiptPrint&salesReceiptId="+data.id+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
				}else if($('#receiptView-radioIn')[0].checked){
					url = new Base64().encode("reportName=PurchaseReceiptPrint&purchaseReceiptId="+data.id+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
				}
				window.open(_global_settings.service.url+"/ac/print/"+url);
			}else{
				//bss新增
				if($('#receiptView-radioOut')[0].checked){
					url = new Base64().encode("reportName=SalesReceiptPrintbss&salesReceiptId="+data.id+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
				}else if($('#receiptView-radioIn')[0].checked){
					url = new Base64().encode("reportName=PurchaseReceiptPrintbss&purchaseReceiptId="+data.id+"&printType=pdf&ownerId="+currentUserInfo.id+"&username="+currentUserInfo.loginId);
				}
				window.open(_global_settings.service.url+"/ac/print/"+url);
			}
		})
	}

	this.unbindAll=function(){
		
	}
}