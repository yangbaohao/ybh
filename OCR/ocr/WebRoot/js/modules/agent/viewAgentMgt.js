/*
 * 查看代理商界面js
 */
var ViewAgentMgt=function(){
	var me=this;
	var url = _global_settings.service.url+'/salesagent/';
	this.id=null;
	this.data=null;
	
	this.initInput=function(){
		if(me.id==undefined||me.id==null){
			Core.alert({
				message:'id入参错误！',
			});
			$.closeTab();
		}
		
//		me.getAgentById();
	}
	
	//根据id查找代理商
	var getAgentById=function(id){
		me.id=$.pk.id;
		if(me.id==undefined){
			me.id = id;
		}
		console.log('+++++'+me.id);
		
		//初始化查看页面
		var initView=function(res){
			if(res.type == 'enterprise'){
				$('#viewAgent-type').val('企业');
				$('#viewAgent-compName').val(res.userInfo.name);
				$('#viewAgent-busi').val(res.userInfo.businessCode);
				$('#viewAgent-tax').val(res.userInfo.taxCode);
			} else {
				$('#viewAgent-type').val('个人');
				$('#viewAgnetSex').css('display','');
				$('#viewAgentComp').css('display','none');
				$('#viewAgentName').css('display','');
				$('#viewAgentBusi').css('display','none');
				$('#viewAgentTax').css('display','none');
				$('#viewAgentCert-type').css('display','');
				$('#viewAgentCert-number').css('display','');
				$('#enterprise-viewqq').css('display','none');
				$('#enterprise-viewwx').css('display','none');
				$('#view-qq').css('display','');
				$('#view-wx').css('display','');
				
				//
				if(res.userInfo.salutation=='nan'){
					$('#viewAgent-sex').val('男');
				} else if(res.userInfo.salutation=='nv'){
					$('#viewAgent-sex').val('女');
				} else {
					$('#viewAgent-sex').val('');
				}
				$('#viewAgent-name').val(res.userInfo.name);
				
				$('#viewAgent-certType').val(getCodeData(res.userInfo.certificateType));
				$('#viewAgent-certNumber').val(res.userInfo.certificateId);
				
			}
			
			$('#viewAgent-number').val(res.agentCode);
			
			res.sales==undefined?'':$('#viewAgent-head').val(getSalesInfoById(res.sales.id).name_user);
			res.customer==undefined?'':$('#viewAgent-cust').val(getCustomerInfoById(res.customer.id).name_user);
			
			$('#viewAgent-userName').val(res.agentName);
			$('#viewAgent-bank').val(res.openBank);
			$('#viewAgent-bankNumber').val(res.bankAccount);
			$('#viewAgent-phone').val(res.userInfo.telephone);
			$('#viewAgent-eamil').val(res.userInfo.email);
			$('#viewAgent-qq').val(res.userInfo.qq);
			$('#viewAgent-wx').val(res.userInfo.wechat);
			$('#viewAgent-remark').val(res.userInfo.remark);
			
			//地址
			$('#viewAgent-address').find('tbody').children().remove();
			
			$.each(res.userInfo.address,function(i,v){
				var line = '<tr>'+
							'<td><font>'+v.province+'</font>'+
							'<font>'+v.city+'</font>'+
							'<font>'+v.district+'</font>'+
							'<font>'+v.street+'</font></td></tr>';
				$('#viewAgent-address').append(line);
			});
		}
		
		
		Core.AjaxRequest({
			url:url+me.id,
			type:'GET',
			async:false,
			showMsg:false,
			callback:function(res){
				me.data=res;
				console.log(res);
				initView(res);
			},
			failure:function(){
				
			}
		});
	}
	
	window.getAgentById = getAgentById;
	getAgentById(id);
	
}

var ViewAgentBindModle=function(viewAgentMgt){
	var me=this;
	
	this.bind=function(){
		//点击编辑按钮
		$('#editAgentBtn').on('click',function(){
			$.addTab({title:'编辑代理商',url:'page/modules/agent/editAgentMgt.html',
				pk:{data:viewAgentMgt.data},reload:true});
		});
	}
	
	this.unbindAll=function(){
		$('#editAgentBtn').off('click');
	}
}