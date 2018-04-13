var ReceiptEdit = function(){

	var me = this;
	var url = _global_settings.service.url;
	var data = null;
	var editCustomerData,
		editAgentData;
	
	this.initInput = function(){
		data = $.pk.data;
		console.log(data)
		me.initInterface();
		me.initUserPage();
		me.initPage();
		me.initValidator();
		me.bindModel();
	}
	
	this.initInterface = function(){
		//客户的获取
		Core.AjaxRequest({
			url:url+'/common/getAllclient/Y/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				editCustomerData = res;
			},
			failure:function(){
			}
		});
		
		//供应商的获取
		Core.AjaxRequest({
			url:url+'/common/getAllclient/N/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				editAgentData = res;
			},
			failure:function(){
			}
		});
	}
	
	this.initUserPage = function(){
		if(data.receiptType=='sales'){
			$('#receiptEdit-radioOut').attr('checked',true);
			$('#rcptEdit-account').parent().parent().find('label:first').text('收款账户');
		}else if(data.receiptType=='purchase'){
			$('#receiptEdit-radioIn').attr('checked',true);
			$('#rcptEdit-account').parent().parent().find('label:first').text('付款账户');
		}
		
		$('#receiptEdit-radioOut').attr('disabled',true);
		$('#receiptEdit-radioIn').attr('disabled',true);
		
		$("#rcptEdit-category").dropDownlist({
			source:{"otherinvoice":"其他","specialinvoice":"增值税专用发票","ordinaryinvoice":"增值税普通发票"},
			width:'100%',
			height:'34px',
			disabled:false,
			selectedIndex:0
		});
		
		var vatSource = [ '0%', '3%', '6%', '11%', '13%', '17%' ];
		$('#rcptEdit-tax').dropDownlist({
			source : vatSource,
			theme : currentTheme,
			width : '100%',
			height : '34px',
			dropDownHeight : 200,
			selectedIndex : 0
		});
		
		$("#rcptEdit-time").datetimeinput({
			width:'100%',
			height:33,
			value:new Date(),
			formatString:"yyyy-MM-dd"
		});	
		
		//客户的获取
//		editCustomerData.push('不匹配');
		//供应商的获取
//		editCustomerData.push('不匹配');
		
		if($('#receiptEdit-radioOut')[0].checked){
			//客户---收款
			$('#rcptEdit-reasons').coaCombboxChoose({
				width:'100%',
				height:34,
				theme:currentTheme,
				displayMember: "name", 
	        	valueMember: "id", 
//	        	placeHolder:"请输入",
	        	selectedIndex:0,
	        	searchMode: 'contains'
			},['6001','6051']);
			
			$('#rcptEdit-account').coaCombboxChoose({
				width:'100%',
				height:34,
				theme:currentTheme,
				displayMember: "name", 
	        	valueMember: "id", 
//	        	placeHolder:"请输入",
	        	selectedIndex:0,
	        	searchMode: 'contains'
			},['1122','1001','1002']);
			
			$("#rcptEdit-clientName").jqxComboBox({
				source:editCustomerData,
				displayMember: "name", 
				valueMember: "clientId",
				width:'100%',
				height:'34px'
			});
			$('#rcptEdit-account').parent().parent().find('label:first').text('收款账户');
			
		}else if($('#receiptEdit-radioIn')[0].checked){
			//供应商--付款
			$('#rcptEdit-reasons').coaCombboxChoose({
				width:'100%',
				height:34,
				theme:currentTheme,
				displayMember: "name", 
	        	valueMember: "id", 
//	        	placeHolder:"请输入",
	        	selectedIndex:0,
	        	searchMode: 'contains'
			},['1405','1403','6601','6602','6603','5301']);
			
			$('#rcptEdit-account').coaCombboxChoose({
				width:'100%',
				height:34,
				theme:currentTheme,
				displayMember: "name", 
	        	valueMember: "id", 
//	        	placeHolder:"请输入",
	        	selectedIndex:0,
	        	searchMode: 'contains'
			},['2202','1001','1002']);
			
			$("#rcptEdit-clientName").jqxComboBox({
				source:editAgentData,
				displayMember: "name", 
				valueMember: "clientId",
				width:'100%',
				height:'34px'
			});
			$('#rcptEdit-account').parent().parent().find('label:first').text('付款账户');
		}
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
	
	this.getClientCustomerByName = function(name){
		for(i=0;i<clientCRd.length;i++){
			if(name==clientCRd[i].name){
				return clientCRd[i];
			}
		}
		
		if(!name){
			return '';
		}
	}
	
	this.getClientAgentByName = function(name){
		for(i=0;i<clientARd.length;i++){
			if(name==clientARd[i].name){
				return clientARd[i];
			}
		}
		
		if(!name){
			return '';
		}
	}
	
	this.initPage = function(){

		if(data.clientId!=undefined){
			if(me.getClientCustomer(data.clientId)!=undefined){
				$('#rcptEdit-clientName').val(me.getClientCustomer(data.clientId).name);
			}else if(me.getClientAgent(data.clientId)!=undefined){
				$('#rcptEdit-clientName').val(me.getClientAgent(data.clientId).name);
			}
		}else{
			if(data.name!=undefined){
				$('#rcptEdit-clientName').val(data.name);
			}else{
				$('#rcptEdit-clientName').val('');
			}
		}
		
		var reasonsVals = ComboBoxSources.getInfoMapOrderByKey('chartOfAccounts','id', data.coaReason.id);
		var accountVals = ComboBoxSources.getInfoMapOrderByKey('chartOfAccounts','id', data.coaDeposit.id);
		
		$('#rcptEdit-reasons').val(data.coaReason==undefined?reasonsVals:data.coaReason.displayValue);
		$('#rcptEdit-account').val(data.coaDeposit==undefined?accountVals:data.coaDeposit.displayValue);
		$('#rcptEdit-type').val( data.receiptType==undefined?'':data.receiptType);
		$('#rcptEdit-num').val(data.receiptNumber==undefined?'':data.receiptNumber);
		$('#rcptEdit-time').val(data.entryDate==undefined?'':data.entryDate);
		$('#rcptEdit-moneyType').val('人民币');
		$('#rcptEdit-tax').val(data.taxRate+'%');
		$("#rcptEdit-sum").input({width:'98%',height:33}).moneyinput();
		$('#rcptEdit-sum').val(money(data.receiptAmt));
		$('#rcptEdit-addremarkPrint').val(data.remark2);
		$('#rcptEdit-addremark').val(data.remark);
		$("#rcptEdit-addattachment").fileuploader({bool:true,url:_global_settings.service.url+'/common/file/'+currentUserInfo.id,avision:true});
		$('#rcptEdit-nosum').val(money(data.unuseAmt));
		
		if(data.receiptInvoiceType=='otherinvoice'){
			$('#rcptEdit-category').val('otherinvoice');
		}else if(data.receiptInvoiceType=='specialinvoice'){
			$('#rcptEdit-category').val('specialinvoice');
		}else if(data.receiptInvoiceType=='ordinaryinvoice'){
			$('#rcptEdit-category').val('ordinaryinvoice');
		}else{
			$('#rcptEdit-category').val('');
		}
	}
	
	this.initValidator = function(){
		$("#rcptEdit-addForm").jqxValidator({
    		animationDuration: 1,
    		hintType: 'label',
            rules: [
				{ input: '#rcptEdit-clientName', message: "不能为空", action: 'keyup,blur',
					rule: function(input,commit){
	        		if(input.val() === '') return false;
        	   		return true;
					} 
				},
				{ input: '#rcptEdit-category', message: "请选择", action: 'change, select', 
					rule: function(input,commit){
	        		if(input.val() === ''||input.jqxDropDownList('getSelectedItem')==null) return false;
        	   		return true;
					} 
				},
				{ input: '#rcptEdit-time', message: "不能为空", action: 'change, select', 
					rule: function(input,commit){
	        		if(input.val() === '') return false;
        	   		return true;
					} 
				},
				{ input: '#rcptEdit-num', message: "发票号码不能为空", action: 'keyup,blur', 
					rule: function(input,commit){
						var num=input.val();
						if(num==''){
							return false;
						}
						return true;
					} 
				},
				{ input: '#rcptEdit-sum', message: "请输入数字", action: 'keyup,blur',rule: IsNum},
				{ input: '#rcptEdit-sum', message: "不能小于0", action: 'keyup,blur',
					rule: function(input,commit){
						if(input.val() < 0) return false;
						return true;
					} 
				},
			]
    	})
	}

	this.bindModel = function(){
		$('#rcptEdit-addsave').on('click',function(){
			me.submitParam(me.initParam());
		})
		
		$('#rcptEdit-sum').keyup(function(){
			$('#rcptEdit-nosum').val(money($('#rcptEdit-sum').val()))
		})
	}
	
	this.initParam=function(){
		var fileInfoIds = [];//文件列表
		$("#rcptEdit-addattachment").find(".item").each(function(i,v){
			var fid = $(v).attr('data-id');
			if(fid !== undefined){
				fileInfoIds.push(fid);
			}
		});
		var obj={};
			obj.id=data.id;
			obj.receiptNumber = $('#rcptEdit-num').val();			//发票号码
			obj.entryDate = $('#rcptEdit-time').val();				//开票日期
			obj.receiptAmt = money($('#rcptEdit-sum').val());		//发票金额
			obj.taxRate = $("#rcptEdit-tax").val().replace('%','')	//   税率
			obj.receiptInvoiceType = $('#rcptEdit-category').val();	//发票类别
			obj.remark = $('#rcptEdit-addremark').val();			//   备注
			obj.remark2 = $('#rcptEdit-addremarkPrint').val();		//   备注
			obj.fileInfoIds = fileInfoIds.toString();				//文件上传
			obj.unuseAmt = $('#rcptEdit-nosum').val();				//  未匹配
			obj.coaReason = {id: $('#rcptEdit-reasons').val()};		//发票事由
			obj.coaDeposit = {id: $('#rcptEdit-account').val()};	//账户
			obj.createBy = _global_settings.owner.username;			//用户名
		
		//公司名称---付款---客户
		var clientName = $('#rcptEdit-clientName').find('input').val();
		if($('#receiptEdit-radioOut').attr('checked')){
			if(me.getClientCustomerByName(clientName)!=undefined){
				obj.clientId = me.getClientCustomerByName(clientName).clientId;
			}else{
				obj.name = clientName;
			}
			obj.receiptType = 'sales';
		}
		
		//公司名称---收款---供应商
		if($('#receiptEdit-radioIn').attr('checked')){
			if(me.getClientAgentByName(clientName)!=undefined){
				obj.clientId = me.getClientAgentByName(clientName).clientId;
			}else{
				obj.name = clientName;
			}
			obj.receiptType = 'purchase';
		}
		console.log(obj);
		return obj;
	}
	
	this.submitParam=function(param){
		if($('#rcptEdit-addForm').jqxValidator('validate')){
			Core.AjaxRequest({
				url:url+'/ac/'+ new Base64().encode('tobss/receipt/update/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
				type:'PUT',
				params:param,
				async:false,
				showMsg:false,
				callback:function(res){
					try{
						if(res.code == false){
							Core.alert({
								message:res.errorMsg,
								callback:function(){
									$.closeTab();
								}
							})
						}else{
							setCloseAlertTimeOneSecond();
							$.closeTab();
							$.addTab({title:'发票',url:'page/modules/fms/receipt.html',isFrame:false,reload:true});
						}
					}catch(e){}
				},
				failure:function(){
				}
			});
		}
	}
	
	this.unbindAll=function(){
		$('#rcptEdit-addsave').off();
	}
}