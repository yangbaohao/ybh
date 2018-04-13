var ViewBusoMgt=function(){
	var me=this;
	var url = _global_settings.service.url+'/potential/';
	var info = getCurrentInfo();
	this.id=null;
	this.BusoData=null;
	
	this.initInput=function(){
		me.id=$.pk.id;
		if($.pk!=undefined){
			if(me.id==null||me.id==undefined){
				Core.alert({message:'id入参错误！'});
			}
		}
	}
	
	var setBuso=function(id){
		if(id==undefined||id==null){
			id=$.pk.id;
		}
		
		//初始化查看页面
		var initPage=function(data){
			if(info.indexOf('sale')>=0||info=='agent'){
				$('#viewBuso-sales').parent().parent().find('label').text('销售负责人');
			}
			if(info.indexOf('customer')>=0){
				$('#viewBuso-sales').parent().parent().find('label').text('客服');
			}
			
			$('#viewBuso-cust').val(data.potentialName);

			data.salesAgent==undefined?$('#viewBuso-agent').val(''):$('#viewBuso-agent').val(getAgentInfoById(data.salesAgent.id).name_user);

			$('#viewBuso-compName').val(data.contact);
				
			var saleAndCust='';
			for(var i=0;i<data.sal.length;i++){
				if(i==data.sal.length-1){
					if(data.custom.length==0){
						saleAndCust+=getSalesInfoById(data.sal[i].id).name_user;
					}else{
						saleAndCust+=getSalesInfoById(data.sal[i].id).name_user+'，';	
					}
				}else{
					saleAndCust+=getSalesInfoById(data.sal[i].id).name_user+'，';
				}
			}
			for(var i=0;i<data.custom.length;i++){
				if(i==data.custom.length-1){
					saleAndCust+=getCustomerInfoById(data.custom[i].id).name_user;
				}else{
					saleAndCust+=getCustomerInfoById(data.custom[i].id).name_user+'，';
				}
			}
			
			$('#viewBuso-sales').val(saleAndCust);
			
			$('#viewBuso-date').val(data.closingDate.substring(0,10));
			$('#viewBuso-phone').val(data.phone);
			$('#viewBuso-email').val(data.email);
			$('#viewBuso-work').val(data.title);
			$('#viewBuso-wx').val(data.wechat);
			$('#viewBuso-qq').val(data.qq);
			$('#viewBuso-remark').val(data.comment);
			
			$('#viewBuso-address').find('tbody').children().remove();
			
			$.each(data.address,function(i,v){
				var le = '<tr>'+
						'<td><font>'+v.province+'</font>'+
						'<font>'+v.city+'</font>'+
						'<font>'+v.district+'</font>'+
						'<font>'+v.street+'</font></td>'+'</tr>';
				$('#viewBuso-address').append(le);
			});
		}
		
		Core.AjaxRequest({
			url:url+id,
			type:'GET',
			async:false,
			showMsg:false,
			callback:function(data){
				
				me.BusoData=data;
				initPage(data);
			},
			failure:function(data){
				
			}
		});
	}
	
	var busoId;
	window.setBuso=setBuso;
	setBuso(busoId);
}

var ViewBusoBindModle=function(viewBusoMgt){
	var me=this;
	
	this.bind=function(){
		//点击编辑按钮
		$('#editBusoBtn').on('click',function(){
			$.addTab({title:'编辑商机',url:'page/modules/buso/editBuso.html',isFrame:false,
				pk:{data:viewBusoMgt.BusoData},reload:true});
		});
	}
	
	this.unbindAll=function(){
		$('#editBusoBtn').off('click');
	}
}