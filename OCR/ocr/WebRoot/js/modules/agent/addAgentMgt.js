/*
 * 新增代理商管理界面js
 */

var AddAgentMgt=function(){
	var me=this;
	this.boolean=false;
	
	this.initInput=function(){
		me.initPage();
		me.judgeName();
		me.initValidator();
	}
	
	//验证用户名是否重复
	this.judgeName=function(){
		$('#addAgent-userName').on('blur',function(){
			var name = $(this).val();
			if(name!='') {
				Core.AjaxRequest({
					url:_global_settings.service.url+'/user/repeat/'+name,
					type:'GET',
					showMsg:false,
					async:false,
					callback:function(res){
						me.boolean=res;
						if(res){
							Core.alert({message:'用户名已被使用！'});
						}
					}
				});
			}
		});
	}
	
	/*
	 * 初始化页面
	 */
	this.initPage=function(){
		$('#addAgent-head').comboBox({
			source:ComboBoxSources.getRecords('salesInfo_name'),
			displayMember: 'name_user', 
			valueMember: 'id',
			width:'100%'
		});
		
		$('#addAgent-cust').comboBox({
			source:ComboBoxSources.getRecords('custService_name'),
			displayMember: 'name_user', 
			valueMember: 'id',
			width:'100%'
		});
		
		var info=getCurrentInfo();
		if(info.indexOf('sale')>=0){
//			$('#addAgent-head').val(_global_settings.owner.userid);
			$('#addAgent-head').jqxComboBox({disabled:true}).val(_global_settings.owner.userid);
		}
		
		if(info.indexOf('customer')>=0){
//			$('#addAgent-cust').val(_global_settings.owner.userid);
			$('#addAgent-cust').jqxComboBox({disabled:true}).val(_global_settings.owner.userid);
		}
//		if(currentRoleName=='salesStaff'||currentRoleName=='salesManage'||currentRoleName=='secondLevelSalesManage'){
//			$('#addAgent-head').val(_global_settings.owner.userid);
//			$('#addAgent-head').jqxComboBox({disabled:true});
//		}
//		
//		if(currentRoleName=='customerService'||currentRoleName=='customerManage'||currentRoleName=='secondLevelSalesManage'){
//			$('#addAgent-cust').val(_global_settings.owner.userid);
//			$('#addAgent-cust').jqxComboBox({disabled:true});
//		}
		
		$('#addAgent-type').on('change',function(){
			var val = $(this).val();
			if(val=='person'){   //个人
				$('#person-qq').css('display','');
				$('#person-wx').css('display','');
				$('#addAgentSex').css('display','');
				$('#addAgentName').css('display','');
				$('#addAgentCert-type').css('display','');
				$('#addAgentCert-number').css('display','');
				$('#addAgentComp').css('display','none');
				$('#addAgentBusi').css('display','none');
				$('#addAgentTax').css('display','none');
				$('#entryprise-qq').css('display','none');
				$('#entryprise-wx').css('display','none');
			}else{  //企业
				$('#person-qq').css('display','none');
				$('#person-wx').css('display','none');
				$('#addAgentSex').css('display','none');
				$('#addAgentName').css('display','none');
				$('#addAgentCert-type').css('display','none');
				$('#addAgentCert-number').css('display','none');
				$('#addAgentComp').css('display','');
				$('#addAgentBusi').css('display','');
				$('#addAgentTax').css('display','');
				$('#entryprise-qq').css('display','');
				$('#entryprise-wx').css('display','');
			}
		});
		
		Core.AjaxRequest({
			url:_global_settings.service.url+'/salesagent/getcode/agentcode',
			type:'GET',
			dataType:'text',
			async:false,
			callback:function(res){
				$('#addAgent-number').val(res);
			},
			failure:function(){
				
			}
		});
	}
	
	this.initValidator = function(){
		$('#addAgentMgt').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#addAgent-userName', message: '不能为空', action: 'keyup,blur', rule: 'required'},
                { input: '#addAgent-userName', message: '用户名只能是数字，字母，下划线', action: 'keyup,blur', 
                	rule:function(input,commit){
                		if(!/^[A-Za-z0-9_]+$/.test(input.val())) return false;
                		return true;
                	}
                },
//                { input: '#addAgent-compName', message: '不能为空', action: 'keyup,blur',
//                	rule:function(input,commit){
//                		if($('#addAgent-type').val()=='person') return true;
//                		else {
//                			if(input.val()=='') return false;
//                			return true;
//                		}
//                	}
//                },
                { input: '#addAgent-head', message: '请选择', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return true;
                		if(input.jqxComboBox('getSelectedItem')==null) return false;
                		return true;
                	}
                },
                { input: '#addAgent-cust', message: '请选择', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return true;
                		if(input.jqxComboBox('getSelectedItem')==null) return false;
                		return true;
                	}
                },
                { input: '#addAgent-pw', message: '不能为空', action: 'keyup,blur', rule: 'required'},
                { input: '#addAgent-pw', message: '长度不能小于6位', action: 'keyup,blur', 
                	rule: function(input,commit){
                		if(input.val().length<6) return false;
                		return true;
                	}
                },
                { input: '#addAgent-apw', message: '不能为空', action: 'keyup,blur', rule: 'required'},
                { input: '#addAgent-apw', message: '两次输入密码不一致', action: 'keyup,blur', 
                	rule: function(input,commit){
                		if(input.val()!=$('#addAgent-pw').val()) return false;
                		return true;
                	}
                },
                { input: '#addAgent-phone', message: '不能为空', action: 'keyup,blur', rule: 'required'},
                { input: '#addAgent-phone', message: '格式不正确', action: 'keyup,blur', 
                	rule: function(input,commit){
                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
                		return true;
                	}
                },
                { input: '#addAgent-eamil', message: '格式不正确', action: 'keyup,blur',
                	rule: function(input,commit){
                		if(input.val()=='') return true;
                		else{
                			if(/^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$/.test(input.val())) return true;
                			return false;
                		}
                	}
                },
                { input: '#addAgent-certNumber', message: '不能为空', action: 'keyup,blur',
                	rule: function(input,commit){
                		if($('#addAgent-type').val()=='enterprise') return true;
                		else{
                			if(input.val()=='') return false;
                			return true;
                		}
                	}
                }
             ]
		});
	}
}

var AddAgentBindModle=function(addAgentMgt){
	var me=this;
	
	this.bind=function(){
		//点击添加地址
		$('#addaddress-btn').off('click').on('click',function(){
			addRess('#addAgent-address');
		});
		
		//点击编辑或者删除地址
		$('#addAgent-address').on('click','.edit',function(){
			editOrdelAddress('#addAgent-address',$(this),'edit');
		});
		
		$('#addAgent-address').on('click','.delete',function(){
			editOrdelAddress('#addAgent-address',$(this),'delete');
		});
		
		//保存新增代理商
		$('#addAgentBtn').on('click',function(){
			me.submitParam(me.initParam());
		});
	}
	
	this.submitParam=function(param){
		
		if(addAgentMgt.boolean) {
			Core.alert({message:'用户名已被使用！'});
			return false;
		}
		
		if($('#addAgentMgt').jqxValidator('validate')){
			var url = _global_settings.service.url +'/salesagent/save';
			Core.AjaxRequest({
				params:param,
				type:'POST',
				url:url,
				async:false,
				callback:function(res){
					$.closeTab();
					try{
						$('#agentGrid').jqxGrid('updatebounddata','cells');
						ComboBoxSources.load('salesAgent');
					}catch(e){};
					
				},
				failure:function(res){
					
				}
			});
		}
	}
	
	
	this.initParam=function(){
		var obj={};
			obj.user={};
			obj.userInfo={};
			obj.sales = {};
			obj.customer={};
			
			obj.type = $('#addAgent-type').val();
			obj.agentCode = $('#addAgent-number').val();
			obj.agentName = $('#addAgent-userName').val();
		
		if(obj.type=='person'){
			obj.userInfo.name = $('#addAgent-name').val();
			obj.userInfo.salutation = $('#addAgent-sex').val();
			obj.userInfo.certificateType = $('#addAgent-certType').val();
			obj.userInfo.certificateId = $('#addAgent-certNumber').val();
		}
		else{
			obj.userInfo.name = $('#addAgent-compName').val();
			obj.userInfo.businessCode = $('#addAgent-busi').val();
			obj.userInfo.taxCode = $('#addAgent-tax').val();
		}
		
		obj.openBank = $('#addAgent-bank').val();
		obj.bankAccount = $('#addAgent-bankNumber').val();
		
		obj.userInfo.type = $('#addAgent-type').val();
		obj.userInfo.email = $('#addAgent-eamil').val();
		obj.userInfo.remark = $('#addAgent-remark').val();
		obj.userInfo.telephone = $('#addAgent-phone').val();
		obj.userInfo.qq = $('#addAgent-qq').val();
		obj.userInfo.wechat = $('#addAgent-wx').val();
		
		obj.userInfo.ownerId  = -1;

		//用户信息
		obj.user.ownerId=-1;
		obj.user.username=$('#addAgent-userName').val();
		obj.user.password=$('#addAgent-pw').val();
		obj.user.oldPassword=$('#addAgent-apw').val();
		obj.user.roles=[{id:2}];
		
		obj.userInfo.address = me.getAddress();
		
		obj.sales.id = $('#addAgent-head').val(); 
		
		obj.customer.id = $('#addAgent-cust').val();
//		console.log(obj);
		return obj;
	}
	
	this.getAddress=function(){
		var tr = $('#addAgent-address').children().children();
		var address=[];
		$.each(tr,function(i){
			var obj = {};
			obj.shortName = tr.eq(i).find('td').eq(0).text();
			obj.province = tr.eq(i).find('td').eq(2).children().eq(0).text();
			obj.city = tr.eq(i).find('td').eq(2).children().eq(1).text();
			obj.district = tr.eq(i).find('td').eq(2).children().eq(2).text();
			obj.street = tr.eq(i).find('td').eq(2).children().eq(3).text();
			obj.zipCode = tr.eq(i).find('td').eq(3).text();
			obj.remark = tr.eq(i).find('td').eq(4).text();
			obj.ownerId = -1;
			
			address.push(obj);
		});
//		console.log(address);
		return address;
	}
	
	this.unbindAll=function(){
		$('#addAgentBtn').off('click');
	}
}