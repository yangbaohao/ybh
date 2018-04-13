var ReceiptAdd = function(){

	var me = this;
	var url = _global_settings.service.url;
	var clientCustomer,
		clientAgent;
	
	
	this.initInput = function(){
		me.initInterface();
		me.initUserPage();
		me.initValidator();
		me.bindModel();
	}

	this.initInterface = function(){
		//客户的获取---收款
		Core.AjaxRequest({
			url:url+'/common/getAllclient/Y/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				clientCustomer = res;
			},
			failure:function(){
			}
		});
		
		//供应商的获取--供应商
		Core.AjaxRequest({
			url:url+'/common/getAllclient/N/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				clientAgent = res;
			},
			failure:function(){
			}
		});
	}
	
	this.initUserPage = function(){
		
//		$('#receipt-radioOut').attr("checked",true); 
		$('#rcptAdd-reasons').coaCombboxChoose({
			width:'100%',
			height:34,
			theme:currentTheme,
			displayMember: "name", 
        	valueMember: "id", 
//        	placeHolder:"请输入",
        	selectedIndex:0,
        	searchMode: 'contains'
		},['6001','6051']);
		
		$('#rcptAdd-account').coaCombboxChoose({
			width:'100%',
			height:34,
			theme:currentTheme,
			displayMember: "name", 
        	valueMember: "id", 
//        	placeHolder:"请输入",
        	selectedIndex:0,
        	searchMode: 'contains'
		},['1122','1001','1002']);
		
		$("#rcptAdd-category").dropDownlist({
			source:{"otherinvoice":"其他","specialinvoice":"增值税专用发票","ordinaryinvoice":"增值税普通发票"},
			width:'100%',
			height:'34px',
			disabled:false,
			selectedIndex:1
		});
		
		var vatSource = [ '0%', '3%', '6%', '11%', '13%', '17%' ];
		$('#rcptAdd-tax').dropDownlist({
			source : vatSource,
			theme : currentTheme,
			width : '100%',
			height : '34px',
			dropDownHeight : 200,
			selectedIndex : 0
		});
		
		$("#rcptAdd-time").datetimeinput({
			width:'100%',
			height:33,
			value:new Date(),
			formatString:"yyyy-MM-dd"
		});
		
		$("#rcptAdd-sum").input({width:'98%',height:33}).moneyinput();
		if($('#receipt-radioOut')[0].checked){
			$("#rcptAdd-clientName").comboBox({
				source:clientCustomer,
				displayMember: "name", 
				valueMember: "clientId",
				width:'100%',
				placeHolder:'请选择或输入'
			});
		}else if($('#receipt-radioIn')[0].checked){
			$("#rcptAdd-clientName").comboBox({
				source:clientAgent,
				displayMember: "name", 
				valueMember: "clientId",
				width:'100%',
				placeHolder:'请选择或输入'
			});
		}
		
	}
	
	this.getClientCustomer = function(name){
		for(i=0;i<clientCustomer.length;i++){
			if(name==clientCustomer[i].name){
				return clientCustomer[i];
			}
		}
		
		if(!name){
			return '';
		}
	}
	
	this.getClientAgent = function(name){
		//客户的获取
		for(i=0;i<clientAgent.length;i++){
			if(name==clientAgent[i].name){
				return clientAgent[i];
			}
		}
		
		if(!name){
			return '';
		}
	}
	
	this.initValidator = function(){
		$("#rcptAdd-addForm").jqxValidator({
    		animationDuration: 1,
    		hintType: 'label',
            rules: [
				{ input: '#rcptAdd-clientName', message: "不能为空", action: 'keyup,blur',
					rule: function(input,commit){
	        		if(input.val() === '') return false;
        	   		return true;
					} 
				},
				/*{ input: '#rcptAdd-category', message: "请选择", action: 'change, select', 
					rule: function(input,commit){
	        		if(input.val() === ''||input.jqxDropDownList('getSelectedItem')==null) return false;
        	   		return true;
					} 
				},*/
				{ input: '#rcptAdd-time', message: "不能为空", action: 'change, select', 
					rule: function(input,commit){
	        		if(input.val() === '') return false;
        	   		return true;
					} 
				},
				{ input: '#rcptAdd-num', message: "发票号码不能为空", action: 'keyup,blur', 
					rule: function(input,commit){
						var num=input.val();
						if(num==''){
							return false;
						}
						return true;
					}
				},
				{ input: '#rcptAdd-sum', message: "请输入数字", action: 'keyup,blur',rule: IsNum},
				{ input: '#rcptAdd-sum', message: "不能小于0", action: 'keyup,blur',
					rule: function(input,commit){
						if(input.val() < 0) return false;
						return true;
					} 
				},
				{ input: '#rcptAdd-num', message: "发票号码只能是8位数字", action: 'keyup,blur',
					rule: function(input,commit){
						if(input.val().length !== 8) return false;
						return true;
					} 
				},
			]
    	})
	}

	this.bindModel = function(){
		$('#rcptAdd-addsave').on('click',function(){
			
			if($('#rcptAdd-sum').val()==0){
				Core.alert({message:'发票金额不能为0！'});
				return false;
			}
			
			me.submitParam(me.initParam());
		})
		
		$("#rcptAdd-addattachment").fileuploader({bool:true,url:_global_settings.service.url+'/common/file/'+currentUserInfo.id,avision:true});
	
		$('#rcptAdd-sum').keyup(function(){
			$('#rcptAdd-nosum').val(money($('#rcptAdd-sum').val()))
		})
		
		//监听开票类型的单选框事件
		$('#receipt-radioOut').change(function(){
			$('#rcptAdd-reasons').coaCombboxChoose({
				width:'100%',
				height:34,
				theme:currentTheme,
				displayMember: "name", 
	        	valueMember: "id", 
//	        	placeHolder:"请输入",
	        	selectedIndex:0,
	        	searchMode: 'contains'
			},['6001','6051']);
			
			$('#rcptAdd-account').coaCombboxChoose({
				width:'100%',
				height:33,
				theme:currentTheme,
				displayMember: "name", 
	        	valueMember: "id", 
//	        	placeHolder:"请输入",
	        	searchMode: 'contains'
			},['1122','1001','1002']);
			
			$("#rcptAdd-clientName").comboBox({
				source:clientCustomer,
				displayMember: "name", 
				valueMember: "clientId",
				width:'100%',
				placeHolder:'请选择或输入'
			});
			$('#rcptAdd-account').parent().parent().find('label:first').text('收款账户');
		})
		
		$('#receipt-radioIn').change(function(){
			$('#rcptAdd-reasons').coaCombboxChoose({
				width:'100%',
				height:34,
				theme:currentTheme,
				displayMember: "name", 
	        	valueMember: "id", 
//	        	placeHolder:"请输入",
	        	selectedIndex:0,
	        	searchMode: 'contains'
			},['1405','1403','6601','6602','6603','5301']);
			
			$('#rcptAdd-account').coaCombboxChoose({
				width:'100%',
				height:33,
				theme:currentTheme,
				displayMember: "name", 
	        	valueMember: "id", 
//	        	placeHolder:"请输入",
	        	selectedIndex:0,
	        	searchMode: 'contains'
			},['2202','1001','1002']);
			
			$("#rcptAdd-clientName").comboBox({
				source:clientAgent,
				displayMember: "name", 
				valueMember: "clientId",
				width:'100%',
				placeHolder:'请选择或输入'
			});
			$('#rcptAdd-account').parent().parent().find('label:first').text('付款账户');
		})
	}
	
	this.initParam=function(){
		var fileInfoIds = [];//文件列表
		$("#rcptAdd-addattachment").find(".item").each(function(i,v){
			var fid = $(v).attr('data-id');
			if(fid !== undefined){
				fileInfoIds.push(fid);
			}
		});
		
		var obj={};
			obj.receiptNumber = $('#rcptAdd-num').val();			//发票号码
			obj.entryDate = $('#rcptAdd-time').val();				//开票日期
			obj.receiptAmt = money($('#rcptAdd-sum').val());		//发票金额
			obj.taxRate = $("#rcptAdd-tax").val().replace('%','')	//   税率
			obj.receiptInvoiceType = $('#rcptAdd-category').val();	//发票类别
			obj.remark = $('#rcptAdd-addremark').val();				//   备注
			obj.remark2 = $('#rcptAdd-addremarkPrint').val();		//   备注
			obj.fileInfoIds = fileInfoIds.toString();				//文件上传
			obj.unuseAmt = money($('#rcptAdd-nosum').val());		//  未匹配
			obj.coaReason = {id: $('#rcptAdd-reasons').val()};		//发票事由
			obj.coaDeposit = {id: $('#rcptAdd-account').val()};		//   账户
			obj.createBy = _global_settings.owner.username;			//用户名
	
		//公司名称---付款---客户
		if($('#receipt-radioOut')[0].checked){
			var clientName = $('#rcptAdd-clientName').find('input').val();
			if(me.getClientCustomer(clientName)!=undefined){
				obj.clientId = me.getClientCustomer(clientName).clientId;
			}else{
				obj.name = clientName;
			}
			obj.receiptType  = 'sales';							//发票类别
			
		}
		
		//公司名称---收款---供应商
		if($('#receipt-radioIn')[0].checked){
			var clientName = $('#rcptAdd-clientName').find('input').val();
			if(me.getClientAgent(clientName)!=undefined){
				obj.clientId = me.getClientAgent(clientName).clientId;
			}else{
				obj.name = clientName;
			}
			obj.receiptType  = 'purchase';						//发票类别
		}
		console.log(obj);
		return obj;
	}
	
	this.submitParam=function(param){
		if($('#rcptAdd-addForm').jqxValidator('validate')){
			Core.AjaxRequest({
				url:url+'/ac/'+new Base64().encode('tobss/receipt/create/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
				type:'POST',
				params:param,
				async:false,
				showMsg:false,
				callback:function(res){
					console.log(res);
					try{
						if(res.code == true){
							setCloseAlertTimeOneSecond();
							$.closeTab();
							$.addTab({title:'发票',url:'page/modules/fms/receipt.html',isFrame:false,reload:true});
						}else if(res.code == false){
							Core.alert({
								message:res.errorMsg
							})
						}
					}catch(e){}
				},
				failure:function(){
				}
			});
		}
	}
	
	this.unbindAll=function(){
		$('#rcptAdd-addsave').off();
	}
}