/*
 * 新增合作商界面js 
 */
var ad=new address('cpaAddressTableArs','form-control');
ad.init();

var AcpMgt=function(){
	var me=this;
	this.bool=false;
	
	this.initInput=function(){
		me.initPage();
		me.judgeName();
		me.initValidator();
	}
	/*
	 * 初始化界面
	 */
	this.initPage=function(){
		Core.AjaxRequest({
			url:_global_settings.service.url+'/salesagent/getcode/agentcode',
			type:'GET',
			dataType:'text',
			async:false,
			callback:function(res){
				$('#addCpa-code').val(res);
			},
			failure:function(){
				
			}
		});
		
		$('#addCpa-person').comboBox({
			source:ComboBoxSources.getRecords('docker'),
			displayMember: 'username', 
			valueMember: 'id',
			width:'100%',
			height:34,
			placeHolder:''
		});
		
	}
	
	//判断用户名是否重复
	this.judgeName=function(){
		$('#addCpa-user').on('blur',function(){
			var val = $(this).val();
			if(val!=''){
				Core.AjaxRequest({
					type:'GET',
					url:_global_settings.service.url+'/user/repeat/'+val,
					showMsg:false,
					callback:function(res){
						me.bool=res;
						if(res){
							Core.alert({message:'用户名已存在，请重新输入！'});
							return false;
						}
					}
				});
			}
		});
	}
	
	
	this.initValidator = function(){
		$('#addCoopAgent').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
			    { input: '#addCpa-person', message: '请选择', action: 'keyup,blur',
			    	rule:function(input,commit){
			    		if(input.jqxComboBox('getSelectedItem')==null) return false;
			    		return true;
			    	} 
			    },
                { input: '#addCpa-user', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#addCpa-pwd', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#addCpa-pwd', message: '长度不能小于6位', action: 'keyup,blur', 
                	rule:function(input,commit){
                		if(input.val().length<6) return false;
                		return true;
                	}
                },
                { input: '#addCpa-apwd', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#addCpa-apwd', message: '两次输入密码不一致', action: 'keyup,blur', 
                	rule:function(input,commit){
                		if(input.val()!=$('#addCpa-pwd').val()) return false;
                		return true;
                	}
                },
                { input: '#addCpa-phone', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#addCpa-phone', message: '联系电话格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
                		return true;
                	}
                },
                { input: '#addCpa-company', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#addCpa-email', message: '邮箱格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return true;
                		else{
                			if(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(input.val())) return true;
                			return false;
                		}
                	}
                }
             ]
		});
	}	
	
}

var AcpBindModle=function(acpMgt){
	var me=this;
	
	this.clearAd=function(){
		$('#cpaAddress').find('input').val('');
		$('#cpaAddress').find('select').val('');
		$('#cpaAddress').find('textarea').val('');
	}
	
	this.addRess=function(){
		var table = $('#addCpa-address');
		var ad = $('#cpaAddressTableArs').children();
		var ad1 = ad.eq(0).val();
		var ad2 = ad.eq(1).val();
		var ad3 = ad.eq(2).val();
		var street = $('#cpaAddressTableSt').val();
		var sn = $('#cpaAddressTableSn').val(); //简称
		var zc = $('#cpaAddressTableZc').val(); //邮编
		var rm = $('#cpaAddressTableRm').val(); //备注
		
		var line = '<tr>'+
					'<td class="hidden">'+sn+'</td>'+
						'<td><i class="glyphicon glyphicon-home"'+
						'style="padding-right: 20px;"></i></td>'+
					'<td><font>'+ad1+'</font><font>'+ad2+'</font><font>'+ad3+'</font><font>'+street+'</font></td>'+
					'<td class="hidden">'+zc+'</td>'+
					'<td class="hidden">'+rm+'</td>'+
					'<td style="float:rigth;">'+
					'<font class="md-rate-review edit" data-toggle="modal" data-target="#cpaAddress">编辑</font>'+
					'<font class="md-cancel style=color:#75798B; delete">删除</font></td>'+
				'</tr>';
		
		var co = $('#cpaAddressTableArs').children().eq(0).val(),ct = $('#cpaAddressTableArs').children().eq(1).val(),
			cs = $('#cpaAddressTableArs').children().eq(2).val(),st = $('#cpaAddressTableSt').val();
		
		console.log(co+','+ct+','+cs+','+st);
		if(co!=''&&ct!=''&&cs!=''&&st!=''){
			if($('#cpaAddressTableType').val()!==''){ //编辑
				var i=$('#cpaAddressTableType').val();
				$('#addCpa-address').find('tr').eq(i).replaceWith(line);
			}else{
				$('#addCpa-address').append(line);
			}
		}
	}
		
	this.bind=function(){
		//取消点击
		$('#cancleCpaAddressBtn').on('click',function(){
			me.clearAd();
		});
		//保存地址
		$('#cpaAddressBtn').on('click',function(){
			me.addRess();
			me.clearAd();
		});
		
		//点击编辑地址
		$('#addCpa-address').on('click','.edit',function(){
			//初始化地址模态框			
			var nodelist=$('#addCpa-address').find('tr');
			var i=$(this).parent().parent().index();
			var arr={};
				arr={ shortName: nodelist.eq(i).find('td').eq(0).text(),
						province:nodelist.eq(i).find('td').eq(2).children().eq(0).text(),
						city:nodelist.eq(i).find('td').eq(2).children().eq(1).text(),
						district:nodelist.eq(i).find('td').eq(2).children().eq(2).text(),
						street:nodelist.eq(i).find('td').eq(2).children().eq(3).text(),
						zipCode:nodelist.eq(i).find('td').eq(3).text(),
						remark:nodelist.eq(i).find('td').eq(4).text()						
				}
				
				$('#cpaAddressTableSn').val(arr.shortName);
				$('#cpaAddressTableRm').val(arr.remark);
				$('#cpaAddressTableZc').val(arr.zipCode);
				$('#cpaAddressTableSt').val(arr.street);
				
				$('#cpaAddressTableType').val(i);
				
				ad.setVal(arr.province,arr.city,arr.district);
		});
		
		//点击删除地址
		$('#addCpa-address').on('click','.delete',function(){
			var t=$(this);
			Core.confirm({
				message:"确认删除吗？",
				confirmCallback:function(){
					t.parent().parent().remove();
				}
			});
		});
		
		//保存新增合作商
		$('#addCoopAgentBtn').on('click',function(){
			me.submitParam(me.initParam());
		});
	}
	
	this.submitParam=function(param){
//		debugger;
		if($('#addCoopAgent').jqxValidator('validate')){
			
			if(acpMgt.bool){
				Core.alert({message:'用户名已存在，请重新输入！'});
				return false;
			}
			
			var url = _global_settings.service.url+'/user/savepartner';
			Core.AjaxRequest({
				url:url,
				type:'POST',
				params:param,
				async:false,
				showMsg:false,
				callback:function(res){
					try{
						setCloseAlertTimeOneSecond();
						$.closeTab();
						$('#coopAgentGrid').jqxGrid('updatebounddata','cells');
					}catch(e){}
				},
				failure:function(e){
					console.log(e);
				}
			});
			
		}
	}
	
	this.initParam=function(){
		var user={};
			user.userInfo={};
		
		user.userInfo.name = $('#addCpa-company').val();
		user.userInfo.telephone = $('#addCpa-phone').val();
		user.userInfo.email = $('#addCpa-email').val();
		user.userInfo.businessCode = $('#addCpa-busiNum').val();
		user.userInfo.taxCode = $('#addCpa-taxNum').val();
		
		
		user.userInfo.qq = $('#addCpa-qq').val();
		user.userInfo.wechat = $('#addCpa-wx').val();
		user.userInfo.remark = $('#addCpa-remark').val();
		user.userInfo.ownerId=-1;
		user.userInfo.type='enterprise';
		user.userInfo.address = me.getAddress();
		
		//用户信息
		user.ownerId=-1;
		user.employeeCode=$('#addCpa-code').val();
		user.docking={id:$('#addCpa-person').val()};
		user.username=$('#addCpa-user').val();
		user.password=$('#addCpa-pwd').val();
		user.oldPassword=$('#addCpa-apwd').val();
		user.openBank = $('#addCpa-bank').val();
		user.bankAccount = $('#addCpa-bankNumber').val();
//		user.roles=[{id:2}];
		
		return user;
	}
	
	this.getAddress=function(){
		var tr = $('#addCpa-address').find('tr');
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
		
		return address;
	}
	
	this.unbindAll=function(){
		$('#cpaAddressBtn').off('click');
		$('#addCoopAgentBtn').off('click');
	}
}