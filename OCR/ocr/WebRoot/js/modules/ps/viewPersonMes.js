/*
 * 基本信息界面js 
 */
var ad=new address('pmAddressTableArs','form-control');
ad.init();

var PmMgt=function(){
	var me=this;
	this.bool=false;
	
	this.initInput=function(){
		me.getInfo();
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
		$('#pm-user').val(data.username);
		$('#pm-company').val(data.userInfo.name);
		$('#pm-phone').val(data.userInfo.telephone==undefined?'':data.userInfo.telephone);
		$('#pm-email').val(data.userInfo.email==undefined?'':data.userInfo.email);
		$('#pm-busiNum').val(data.userInfo.businessCode==undefined?'':data.userInfo.businessCode);
		$('#pm-taxNum').val(data.userInfo.taxCode==undefined?'':data.userInfo.taxCode);
		$('#pm-bank').val(data.openBank==undefined?'':data.openBank);
		$('#pm-bankNumber').val(data.bankAccount==undefined?'':data.bankAccount);
		$('#pm-qq').val(data.userInfo.qq==undefined?'':data.userInfo.qq);
		$('#pm-wx').val(data.userInfo.wechat==undefined?'':data.userInfo.wechat);
		$('#pm-remark').val(data.userInfo.remark==undefined?'':data.userInfo.remark);
		
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
//					'<font class="md-rate-review edit" data-toggle="modal" data-target="#pmAddress">编辑</font>'+
//					'<font class="md-cancel style=color:#75798B; delete">删除</font></td>'+
				'</tr>';
			$('#pm-address').append(line);
		});
		
	}
}

var PmBindModle=function(pmMgt){
	var me=this;
		
	this.bind=function(){
		
		//点击编辑按钮
		$('#editPersonMesBtn').on('click',function(){
			$.addTab({title:'编辑贷款审核人',url:'page/modules/ps/editPersonMes.html',isFrame:false,
				/*pk:{data:viewBusoMgt.BusoData},*/reload:true});
		});
	}
	this.unbindAll=function(){
		$('#pmAddressBtn').off('click');
		$('#pmBtn').off('click');
	}
}