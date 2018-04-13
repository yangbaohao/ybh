/*
 * 基本信息界面js 
 */
var ad=new address('editPmAddressTableArs','form-control');
ad.init();

var EditPmMgt=function(){
	var me=this;
	this.bool=false;
	
	this.initInput=function(){
		me.getInfo();
		me.initValidator();
	}
	/*
	 * 获取用户登录信息
	 */
	this.getInfo=function(){
		Core.AjaxRequest({
			url:_global_settings.service.url+'/user/username/'+_global_settings.owner.username,
			type:'GET',
			async:false,
			callback:function(res){
//				console.log(res);
				me.initPage(res);
			},
			failure:function(){
				
			}
		});
		
	}
	
	//初始化页面
	this.initPage=function(data){
		$('#editPm-user').val(data.username);
		$('#editPm-company').val(data.userInfo.name);
		$('#editPm-phone').val(data.userInfo.telephone==undefined?'':data.userInfo.telephone);
		$('#editPm-email').val(data.userInfo.email==undefined?'':data.userInfo.email);
		$('#editPm-busiNum').val(data.userInfo.businessCode==undefined?'':data.userInfo.businessCode);
		$('#editPm-taxNum').val(data.userInfo.taxCode==undefined?'':data.userInfo.taxCode);
		$('#editPm-bank').val(data.openBank==undefined?'':data.openBank);
		$('#editPm-bankNumber').val(data.bankAccount==undefined?'':data.bankAccount);
		$('#editPm-qq').val(data.userInfo.qq==undefined?'':data.userInfo.qq);
		$('#editPm-wx').val(data.userInfo.wechat==undefined?'':data.userInfo.wechat);
		$('#editPm-remark').val(data.userInfo.remark==undefined?'':data.userInfo.remark);
		
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
					'<font class="md-rate-review edit" data-toggle="modal" data-target="#editPmAddress">编辑</font>'+
					'<font class="md-cancel style=color:#75798B; delete">删除</font></td>'+
				'</tr>';
			$('#editPm-address').append(line);
		});
		
	}
	
	this.initValidator = function(){
		$('#personMesMgt').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#editPm-user', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#editPm-pwd', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#editPm-pwd', message: '长度不能小于6位', action: 'keyup,blur', 
                	rule:function(input,commit){
                		if(input.val().length<6) return false;
                		return true;
                	}
                },
                { input: '#editPm-apwd', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#editPm-apwd', message: '两次输入密码不一致', action: 'keyup,blur', 
                	rule:function(input,commit){
                		if(input.val()!=$('#editPm-pwd').val()) return false;
                		return true;
                	}
                },
                { input: '#editPm-phone', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#editPm-phone', message: '联系电话格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
                		return true;
                	}
                },
                { input: '#editPm-company', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#editPm-email', message: '邮箱格式不正确,请重新输入', action: 'keyup,blur',
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

var EditPmBindModle=function(editPmMgt){
	var me=this;
	
	this.clearAd=function(){
		$('#editPmAddress').find('input').val('');
		$('#editPmAddress').find('select').val('');
		$('#editPmAddress').find('textarea').val('');
	}
	
	this.addRess=function(){
		var table = $('#editPm-address');
		var ad = $('#editPmAddressTableArs').children();
		var ad1 = ad.eq(0).val();
		var ad2 = ad.eq(1).val();
		var ad3 = ad.eq(2).val();
		var street = $('#editPmAddressTableSt').val();
		var sn = $('#editPmAddressTableSn').val(); //简称
		var zc = $('#editPmAddressTableZc').val(); //邮编
		var rm = $('#editPmAddressTableRm').val(); //备注
		
		var line = '<tr>'+
					'<td class="hidden">'+sn+'</td>'+
						'<td><i class="glyphicon glyphicon-home"'+
						'style="padding-right: 20px;"></i></td>'+
					'<td><font>'+ad1+'</font><font>'+ad2+'</font><font>'+ad3+'</font><font>'+street+'</font></td>'+
					'<td class="hidden">'+zc+'</td>'+
					'<td class="hidden">'+rm+'</td>'+
					'<td style="float:rigth;">'+
					'<font class="md-rate-review edit" data-toggle="modal" data-target="#editPmAddress">编辑</font>'+
					'<font class="md-cancel style=color:#75798B; delete">删除</font></td>'+
				'</tr>';
		
		var co = $('#editPmAddressTableArs').children().eq(0).val(),ct = $('#editPmAddressTableArs').children().eq(1).val(),
			cs = $('#editPmAddressTableArs').children().eq(2).val(),st = $('#editPmAddressTableSt').val();
		
		console.log(co+','+ct+','+cs+','+st);
		if(co!=''&&ct!=''&&cs!=''&&st!=''){
			if($('#editPmAddressTableType').val()!==''){ //编辑
				var i=$('#editPmAddressTableType').val();
				$('#editPm-address').find('tr').eq(i).replaceWith(line);
			}else{
				$('#editPm-address').append(line);
			}
		}
	}
		
	this.bind=function(){
		//取消点击
		$('#cancleeditPmAddressBtn').on('click',function(){
			me.clearAd();
		});
		//保存地址
		$('#editPmAddressBtn').on('click',function(){
			me.addRess();
			me.clearAd();
		});
		
		//点击编辑地址
		$('#editPm-address').on('click','.edit',function(){
			//初始化地址模态框			
			var nodelist=$('#editPm-address').find('tr');
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
				
				$('#editPmAddressTableSn').val(arr.shortName);
				$('#editPmAddressTableRm').val(arr.remark);
				$('#editPmAddressTableZc').val(arr.zipCode);
				$('#editPmAddressTableSt').val(arr.street);
				
				$('#editPmAddressTableType').val(i);
				
				ad.setVal(arr.province,arr.city,arr.district);
		});
		
		//点击删除地址
		$('#editPm-address').on('click','.delete',function(){
			var t=$(this);
			Core.confirm({
				message:"确认删除吗？",
				confirmCallback:function(){
					t.parent().parent().remove();
				}
			});
		});
		
		//保存新增合作商
		$('#editPmBtn').on('click',function(){
			me.submitParam(me.initParam());
		});
	}
	
	this.submitParam=function(param){
//		debugger;
		if($('#personMesMgt').jqxValidator('validate')){
			
			var url = _global_settings.service.url+'/user/detailed';
			Core.AjaxRequest({
				url:url,
				type:'PUT',
				params:param,
				async:false,
				callback:function(res){
//					console.log(res);
					$.closeTab();
					try{
						$.addTab({title:"基本信息",isFrame:false,url:ctx+"/page/modules/ps/viewPersonMes.html",reload:true});
						$('#viewPersonMesMgt').jqxGrid('updatebounddata','cells');
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
		
		user.userInfo.name = $('#editPm-company').val();
		user.userInfo.telephone = $('#editPm-phone').val();
		user.userInfo.email = $('#editPm-email').val();
		user.userInfo.businessCode = $('#editPm-busiNum').val();
		user.userInfo.taxCode = $('#editPm-taxNum').val();
		
		
		user.userInfo.qq = $('#editPm-qq').val();
		user.userInfo.wechat = $('#editPm-wx').val();
		user.userInfo.remark = $('#editPm-remark').val();
		user.userInfo.ownerId=-1;
		user.userInfo.type='enterprise';
		user.userInfo.address = me.getAddress();
		
		//用户信息
		user.ownerId=-1;
//		user.employeeCode=$('#addCpa-code').val();
//		user.docking={id:$('#addCpa-person').val()};
		user.username=$('#editPm-user').val();
		user.password=$('#editPm-pwd').val();
		user.oldPassword=$('#editPm-apwd').val();
		user.openBank = $('#editPm-bank').val();
		user.bankAccount = $('#editPm-bankNumber').val();
//		user.roles=[{id:2}];
		
		return user;
	}
	
	this.getAddress=function(){
		var tr = $('#editPm-address').find('tr');
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
		$('#editPmAddressBtn').off('click');
		$('#editPmBtn').off('click');
	}
}