/*
 * 推广文案界面js
 */

var CopMgt=function(){
	var me=this;
	var url= _global_settings.service.url+'/promotionalcopy';
	var owner = _global_settings.owner;
	
	this.initInput=function(){
		setTimeout(function(){
			me.initPage();
		},300);
	}
	
	//初始化页面
	this.initPage=function(){
		Core.AjaxRequest({
			url:url+'/search/all',
			type:'GET',
			async:false,
			callback:function(res){
				console.log(res);
				$('#cop-ul').children().remove();
				me.initList(res);
			},
			failure:function(){
				
			}
		});
	}
	
	//初始化ul列表
	this.initList=function(res){
//		debugger 
		var currentUrl = setCurrentUrl(); 
//			var currentUrl = 'http://127.0.0.1:8080/ACBss/';
			
			
		var time = '2016年10月28日  10:30';
		var tm = '2016年8月20日  09:56';
		var t = '2016年8月21日  15:36';
//		for(var i=0;i<6;i++){
			var ls = '<li class="p-l-r-10 p-8 m-b-15" style="background-color:#EBEBEB">'+
			 '<span class="m-r-15">'+time+'</span>'+
			 '<span class="m-r-15" style="font-weight:600">秒账发布推广文案</span>'+
			 '<a class="tz hoverspan" style="color:#5C86C2" target="_Blank" href='+currentUrl+'page/modules/cop/promoteCustomer.html>'+
			 '用户推广</a>'+
			 '<a class="cspan float-right" target="_Blank" href='+currentUrl+'page/modules/cop/promoteCustomer.html>查看详情</a>'+
			 '</li>';
			
//			var l = '<li class="p-l-r-10 p-8 m-b-15" style="background-color:#EBEBEB">'+
//			 '<span class="m-r-15">'+tm+'</span>'+
//			 '<span class="m-r-15" style="font-weight:600">秒账发布推广文案</span>'+
//			 '<a class="tz hoverspan" style="color:#5C86C2" target="_Blank" href='+currentUrl+'extend-article02.html>'+
//			 '解决中小企业家所面临的运营痛点！</a>'+
//			 '<a class="cspan float-right" target="_Blank" href='+currentUrl+'extend-article02.html>查看详情</a>'+
//			 '</li>';
//			
//			var il = '<li class="p-l-r-10 p-8 m-b-15" style="background-color:#EBEBEB">'+
//			 '<span class="m-r-15">'+t+'</span>'+
//			 '<span class="m-r-15" style="font-weight:600">秒账发布推广文案</span>'+
//			 '<a class="tz hoverspan" style="color:#5C86C2" target="_Blank" href='+currentUrl+'extend-article03.html>'+
//			 '秒账的增值服务</a>'+
//			 '<a class="cspan float-right" target="_Blank" href='+currentUrl+'extend-article03.html>查看详情</a>'+
//			 '</li>';
			
			//192.168.0.30:8080/cuiyiNetwork
			//www.ydcfo.com
			
			$('#cop-ul').append(ls);
//			$('#cop-ul').append(l);
//			$('#cop-ul').append(il);
//		}
			
		var clickTarget=function(m){
			var hf = $(m).attr('href');
			if(owner.roleName!='Sys_Admin'){
				if(owner.roleName=='agentistrator'){
					$(m).attr('href',hf+'?salesType='+owner.salesType+'&agentCode='+owner.agentCode);
				}else {
					if(owner.roleName=='salesStaff'||owner.roleName=='salesManage'|| owner.roleName=='secondLevelSalesManage'){
						if(owner.employeeCode=='null'||owner.employeeCode==undefined){
							$(m).attr('href',hf+'?salesType='+owner.salesType+'&salesId='+owner.userid);
						}
						else{
							$(m).attr('href',hf+'?salesType='+owner.salesType+'&salesId='+owner.userid+'&employeeCode='+owner.employeeCode);
						}
					} else {
						if(owner.employeeCode=='null'||owner.employeeCode==undefined){
							$(m).attr('href',hf+'?salesType='+owner.salesType+'&customerId='+owner.userid);
						}
						else{
							$(m).attr('href',hf+'?salesType='+owner.salesType+'&customerId='+owner.userid+'&employeeCode='+owner.employeeCode);
						}
					}
				}
				
				window.open($(m).attr('href'));
				
				setTimeout(function(){
					$(m).attr('href',hf);
				},500);
			}
		}	
		
		$('.tz').on('click',function(){
			var m=this;
			clickTarget(m);
			
		});
		
		$('.cspan').on('click',function(){
			var m=this;
			clickTarget(m);
		});
	}
}

var CopBindModle=function(){
	var me=this;
	
	this.bind=function(){
		
	}
	
	this.unbindAll=function(){
		
	}
}