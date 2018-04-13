/*
 * 查看代理商个人信息界面js
 */
var PsMgt=function(){
	var me=this;
	var url = _global_settings.service.url+'/salesagent/';
	this.id=null;
	this.data=null;
	
	this.initInput=function(){
//		debugger;
		
		if(me.id==undefined||me.id==null){
			Core.alert({
				message:'id入参错误！',
			});
			$.closeTab();
		}
		
	}
	
	//获取代理商id
	var getId=function(id){
		
		//获取销售负责人
		var getSales=function(id){
			var rd = ComboBoxSources.getRecords('salesInfo');
			for(var i=0;i<rd.length;i++){
				if(rd[i].id==id){
					return rd[i];
				}
			}
			if(!id){
				return '';
			}
		}
		
		//获取客服
		var getCust=function(id){
			var rd = ComboBoxSources.getRecords('custService');
			for(var i=0;i<rd.length;i++){
				if(rd[i].id==id){
					return rd[i];
				}
			}
			if(!id){
				return '';
			}
		}
		
		//初始化查看页面
		var initView=function(res){
			if(res.type == 'enterprise'){
				$('#viewPs-type').val('企业');
				$('#viewPs-compName').val(res.userInfo.name);
				$('#viewPs-busi').val(res.userInfo.businessCode);
				$('#viewPs-tax').val(res.userInfo.taxCode);
			} else {
				$('#viewPs-type').val('个人');
				$('#viewPsSex').css('display','');
				$('#viewPsComp').css('display','none');
				$('#viewPsName').css('display','');
				$('#viewPsBusi').css('display','none');
				$('#viewPsTax').css('display','none');
				$('#viewPsCert-type').css('display','');
				$('#viewPsCert-number').css('display','');
				$('#enterprise-viewPsqq').css('display','none');
				$('#enterprise-viewPswx').css('display','none');
				$('#view-Psqq').css('display','');
				$('#view-Pswx').css('display','');
				
				//
				if(res.userInfo.salutation=='nan'){
					$('#viewPs-sex').val('男');
				} else if(res.userInfo.salutation=='nv') {
					$('#viewPs-sex').val('女');
				} else{
					$('#viewPs-sex').val('');
				}
				$('#viewPs-name').val(res.userInfo.name);
				
				$('#viewPs-certType').val(getCodeData(res.userInfo.certificateType));
				$('#viewPs-certNumber').val(res.userInfo.certificateId);
				
			}
			
			$('#viewPs-number').val(res.agentCode);

//			debugger;
			res.sales==undefined?$('#viewPs-head').val(''):$('#viewPs-head').val(getSales(res.sales.id).username);
			res.customer==undefined?$('#viewPs-cust').val(''):$('#viewPs-cust').val(getCust(res.customer.id).username);
			
			$('#viewPs-userName').val(res.agentName);
			$('#viewPs-bank').val(res.openBank);
			$('#viewPs-bankNumber').val(res.bankAccount);
			$('#viewPs-phone').val(res.userInfo.telephone);
			$('#viewPs-eamil').val(res.userInfo.email);
			$('#viewPs-qq').val(res.userInfo.qq);
			$('#viewPs-wx').val(res.userInfo.wechat);
			$('#viewPs-remark').val(res.userInfo.remark);
			
			//地址
			$('#viewPs-address').find('tbody').children().remove();
			
			$.each(res.userInfo.address,function(i,v){
				var line = '<tr>'+
							'<td><font>'+v.province+'</font>'+
							'<font>'+v.city+'</font>'+
							'<font>'+v.district+'</font>'+
							'<font>'+v.street+'</font></td></tr>';
				$('#viewPs-address').append(line);
			});
		}
		
		
		var rd = ComboBoxSources.getRecords('salesAgent');
		for(var i=0;i<rd.length;i++){
			if(rd[i].id==id){
				me.id=rd[i].id;
			}
		}
		
		Core.AjaxRequest({
			url:url+me.id,
			type:'GET',
			async:false,
			callback:function(res){
				me.data=res;
				console.log(res);
				initView(res);
			},
			failure:function(){
				
			}
		});
		
	}
	
//	debugger;
	window.getId = getId;
	getId(_global_settings.owner.id);
	
}

var PsBindModle=function(psMgt){
	var me=this;
	
	this.bind=function(){
		//点击编辑按钮
		$('#editPsBtn').on('click',function(){
			$.addTab({title:'编辑代理商',url:'page/modules/agent/editAgentMgt.html',
				pk:{data:psMgt.data},reload:true});
		});
	}
	
	this.unbindAll=function(){
		$('#editPsBtn').off('click');
	}
}