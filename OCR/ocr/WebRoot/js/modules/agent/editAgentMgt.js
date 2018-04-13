/*
 * 编辑代理商界面js
 */

var EditAgentMgt=function(){
	var me=this;
	this.data=null;
	
	this.initInput=function(){
		me.data=$.pk.data;
		console.log(me.data);
		if(me.data==undefined||me.data==null){
			Core.alert({
				message:'data入参错误！'
			});
		}
		
		me.initPage(me.data);
		me.initValidator();
	}
	
	/*
	 * 初始化页面
	 */
	this.initPage=function(data){
		$('#editAgent-head').comboBox({
			source:ComboBoxSources.getRecords('salesInfo_name'),
			displayMember:'name_user',
			valueMember:'id',
			width:'100%'
		}).jqxComboBox({disabled:true}).val(data.sales==undefined?'':data.sales.id);
		
		$('#editAgent-cust').comboBox({
			source:ComboBoxSources.getRecords('custService_name'),
			displayMember: 'name_user', 
			valueMember: 'id',
			width:'100%'
		}).jqxComboBox({disabled:true}).val(data.customer==undefined?'':data.customer.id);
		
		
//		$('#editAgent-head').jqxComboBox({disabled:true});
//		$('#editAgent-cust').jqxComboBox({disabled:true});
		
		if(data.type=='enterprise'){
			$('#editAgent-type').val('enterprise');
			$('#editAgent-compName').val(data.userInfo.name);
			$('#editAgent-busi').val(data.userInfo.businessCode);
			$('#editAgent-tax').val(data.userInfo.taxCode);
		} else {
			$('#editAgentSex').css('display','');
			$('#editAgentComp').css('display','none');
			$('#editAgentName').css('display','');
			$('#editAgentBusi').css('display','none');
			$('#editAgentTax').css('display','none');
			$('#editAgentCert-type').css('display','');
			$('#editAgentCert-number').css('display','');
			$('#enterprise-editqq').css('display','none');
			$('#enterprise-editwx').css('display','none');
			$('#edit-qq').css('display','');
			$('#edit-wx').css('display','');
			
			//
			$('#editAgent-type').val('person');
			if(data.userInfo.salutation=='nan'){
				$('#editAgent-sex').val('nan');
			} else if(data.userInfo.salutation=='nv'){
				$('#editAgent-sex').val('nv');
			} else {
				$('#editAgent-sex').val('');
			}
			$('#editAgent-name').val(data.userInfo.name);
			
			$('#editAgent-certType').val(data.userInfo.certificateType);
			$('#editAgent-certNumber').val(data.userInfo.certificateId);
			
		}
		
		$('#editAgent-type').attr('disabled','disabled');
		
		$('#editAgent-number').val(data.agentCode);
		$('#editAgent-userName').val(data.agentName);
		$('#editAgent-bank').val(data.openBank);
		$('#editAgent-bankNumber').val(data.bankAccount);
		$('#editAgent-phone').val(data.userInfo.telephone);
		$('#editAgent-eamil').val(data.userInfo.email);
		$('#editAgent-qq').val(data.userInfo.qq);
		$('#editAgent-wx').val(data.userInfo.wechat);
		$('#editAgent-remark').val(data.userInfo.remark);
		
		//地址
		$.each(data.userInfo.address,function(i,v){
			var line = '<tr>'+
						'<td class="hidden">'+v.shortName+'</td>'+
						'<td><i class="glyphicon glyphicon-home"'+
						'style="padding-right: 20px;"></i></td>'+
					'<td><font>'+v.province+'</font><font>'+v.city+'</font><font>'+v.district+'</font><font>'+v.street+'</font></td>'+
					'<td class="hidden">'+v.zipCode+'</td>'+
					'<td class="hidden">'+v.remark+'</td>'+
					'<td style="float:rigth;">'+
					'<font class="md-rate-review edit">编辑</font>'+
					'<font class="md-cancel delete">删除</font></td>'+
				'</tr>';
			$('#editAgent-address').append(line);
		});
	}
	
	this.initValidator = function(){
		$('#editAgentMgt').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#editAgent-sex', message: '请选择', action: 'keyup,blur',
                	rule: function(input,commit){
                		if($('#editAgent-type').val()=='person') {
                			if(input.val()==null) return false;
                			return true;
                		} else {
                			return true;
                		}
                	}
                },
                { input: '#editAgent-phone', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#editAgent-phone', message: '联系电话格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
                		return true;
                	}
                },
                { input: '#editAgent-pw', message: '不能为空', action: ' keyup,blur',rule:'required'},
                { input: '#editAgent-pw', message: '长度不能小于6位', action: ' keyup,blur',
                	rule:function(input,commit){
                		if(input.val().length<6) return false;
                		return true;
                	}
                },
                { input: '#editAgent-apw', message: '不能为空', action: ' keyup,blur',rule:'required'},
                { input: '#editAgent-apw', message: '两次输入密码不一致', action: ' keyup,blur',
                	rule:function(input,commit){
                		if(input.val()!=$('#editAgent-pw').val()) return false;
                		return true;
                	}
                },
                { input: '#editAgent-eamil', message: '邮箱格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return true;
                		else{
                			if(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(input.val())) return true;
                			return false;
                		}
                	}
                },
//                { input: '#editAgent-head', message: '请选择', action: 'keyup,blur',
//                	rule:function(input,commit){
//                		if(input.val()==''||input.jqxDropDownList('getSelectedItem')==null) return false;
//                		return true;
//                	}
//                },
                { input: '#editAgent-certNumber', message: '请选择', action: 'keyup,blur',
                	rule:function(input,commit){
                		if($('#editAgent-type').val()=='enterprise') return true;
                		else {
                			if(input.val()=='') return false;
                			return true;
                		}
                	}
                }
             ]
		});
	}
	
}

var EditAgentBindModle=function(editAgentMgt){
	var me=this;
	
	this.bind=function(){
		//点击添加地址
		$('#editaddress-btn').off('click').on('click',function(){
			addRess('#editAgent-address');
		});
		
		//点击编辑或者删除地址
		$('#editAgent-address').on('click','.edit',function(){
			editOrdelAddress('#editAgent-address',$(this),'edit');
		});
		
		$('#editAgent-address').on('click','.delete',function(){
			editOrdelAddress('#editAgent-address',$(this),'delete');
		});
		
		//保存编辑代理商
		$('#editAgentBtn-btn').on('click',function(){
			me.submitEditParam(me.initEditParam());
		});
	}
	
	this.submitEditParam=function(param){
		if($('#editAgentMgt').jqxValidator('validate')){
			console.log(param);
			var url = _global_settings.service.url +'/salesagent/1';
			Core.AjaxRequest({
				params:param,
				type:'PUT',
				url:url,
				async:false,
				callback:function(res){
					try{
						$.closeTab();
						getAgentById(editAgentMgt.data.id);
						getId(_global_settings.owner.userinfoid);
						$('#agentGrid').jqxGrid('updatebounddata','cells');
						ComboBoxSources.load('salesAgent');
					}catch(e){
					}
				},
				failure:function(res){
					
				}
			});
		}
	}
	
	this.initEditParam=function(){
		console.log(editAgentMgt.data);
		var pc = editAgentMgt.data.parentAgentCode;
		var obj={};
			obj.user={};
			obj.userInfo={};
			obj.sales = {};
			obj.customer={};
			
			obj.id = editAgentMgt.data.id;
			obj.type = $('#editAgent-type').val();
			obj.agentCode = $('#editAgent-number').val();
			obj.senior = editAgentMgt.data.senior;
		
		if(obj.senior==undefined){
			obj.senior=null;
		} 
		
		if(pc==undefined){
			obj.parentAgentCode = null;
		} else {
			obj.parentAgentCode = pc;
		}
		
		
		if(obj.type=='person'){
			obj.userInfo.name = $('#editAgent-name').val();
			obj.userInfo.salutation = $('#editAgent-sex').val();
			obj.userInfo.certificateType = $('#editAgent-certType').val();
			obj.userInfo.certificateId = $('#editAgent-certNumber').val();
		}
		else{
			obj.userInfo.name = $('#editAgent-compName').val();
			obj.userInfo.businessCode = $('#editAgent-busi').val();
			obj.userInfo.taxCode = $('#editAgent-tax').val();
		}
		
		obj.openBank = $('#editAgent-bank').val();
		obj.bankAccount = $('#editAgent-bankNumber').val();
//		debugger;
		obj.rate = editAgentMgt.data.rate;
		
		obj.userInfo.type = $('#editAgent-type').val();
		obj.agentName = $('#editAgent-userName').val();
		obj.userInfo.email = $('#editAgent-eamil').val();
		obj.userInfo.remark = $('#editAgent-remark').val();
		obj.userInfo.telephone = $('#editAgent-phone').val();
		obj.userInfo.qq = $('#editAgent-qq').val();
		obj.userInfo.wechat = $('#editAgent-wx').val();
		obj.userInfo.id = editAgentMgt.data.userInfo.id;
		
		obj.userInfo.ownerId  = -1;
		obj.sales.id = $('#editAgent-head').val(); 
		obj.customer.id = $('#editAgent-cust').val(); 
//		obj.personInfo.type = 'person';
		
		//用户信息
		obj.user.ownerId=-1;
		obj.user.id = editAgentMgt.data.user.id;
		obj.user.username=$('#editAgent-userName').val();
		obj.user.password=$('#editAgent-pw').val();
		obj.user.oldPassword=$('#editAgent-apw').val();
		obj.user.roles=[{id:2}];
		
		obj.userInfo.address = me.getAddress();
		
		return obj;
	}
	
	this.getAddress=function(){
		var tr = $('#editAgent-address').find('tr');
		var address=[];
//		debugger;
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
		console.log(address);
		return address;
	}
	
	this.unbindAll=function(){
		$('#editAgentBtn-btn').off('click');
		$('#editAgentMgtAddressBtn').off('click');
		$('#editAgentCancleAddressBtn').off('click');
	}
}