/*
 * 代理推广界面js
 */

var CopAgentMgt=function(){
	var me=this;
	var url= _global_settings.service.url+'/promotionalcopy'
	
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
				$('#copagent-ul').children().remove();
				me.initList(res);
			},
			failure:function(){
				
			}
		});
	}
	
	//初始化ul列表
	this.initList=function(res){
		
		var currentUrl = setCurrentUrl();
		
		var t = '2016年10月31日  11:18';
		var ts = '2016年10月31日  14:30';
		
		var li = '<li class="p-l-r-10 p-8 m-b-15" style="background-color:#EBEBEB">'+
		 '<span class="m-r-15">'+t+'</span>'+
		 '<span class="m-r-15" style="font-weight:600">秒账发布推广文案</span>'+
		 '<a class="agentTz hoverspan" style="color:#5C86C2" target="_Blank" href='+currentUrl+'page/modules/cop/promoteAgent.html>'+
		 '代理商推广《一》</a>'+
		 '<a class="agentCspan float-right" target="_Blank" href='+currentUrl+'page/modules/cop/promoteAgent.html>查看详情</a>'+
		 '</li>';
		
		var ls = '<li class="p-l-r-10 p-8 m-b-15" style="background-color:#EBEBEB">'+
		 '<span class="m-r-15">'+ts+'</span>'+
		 '<span class="m-r-15" style="font-weight:600">秒账发布推广文案</span>'+
		 '<a class="agentTz hoverspan" style="color:#5C86C2" target="_Blank" href='+currentUrl+'page/modules/cop/promote.html>'+
		 '代理商推广《二》</a>'+
		 '<a class="agentCspan float-right" target="_Blank" href='+currentUrl+'page/modules/cop/promote.html>查看详情</a>'+
		 '</li>';
		
		$('#copagent-ul').append(li);
		$('#copagent-ul').append(ls);
		
		$('.agentTz').on('click',function(){
			var m=this;
			var hf = $(m).attr('href');
			if(_global_settings.owner.roleName!='Sys_Admin'){
				if(_global_settings.owner.roleName!='agentistrator'){
					if(_global_settings.owner.roleName=='salesStaff'||_global_settings.owner.roleName=='salesManage'){
						$(m).attr('href',hf+'?salesId='+_global_settings.owner.userid);
					} else{
						$(m).attr('href',hf+'?customerId='+_global_settings.owner.userid);
					}
				}
				else {
					if(_global_settings.owner.senior=='true')
						$(m).attr('href',hf+'?parentAgentCode='+_global_settings.owner.agentCode);
					else
						$(m).attr('href',hf+'?salesType='+_global_settings.owner.salesType+'&agentCode='+_global_settings.owner.agentCode);
				}
				
				setTimeout(function(){
					$(m).attr('href',hf);
				},500);
			}
		});
		
		$('.agentCspan').on('click',function(){
			var m=this;
			var hf = $(m).attr('href');
			if(_global_settings.owner.roleName!='Sys_Admin'){
				if(_global_settings.owner.roleName!='agentistrator'){
					if(_global_settings.owner.roleName=='salesStaff'||_global_settings.owner.roleName=='salesManage'){
						$(m).attr('href',hf+'?salesId='+_global_settings.owner.userid);
					} else{
						$(m).attr('href',hf+'?customerId='+_global_settings.owner.userid);
					}
				}
				else {
					if(_global_settings.owner.senior=='true')
						$(m).attr('href',hf+'?parentAgentCode='+_global_settings.owner.agentCode);
					else
						$(m).attr('href',hf+'?salesType='+_global_settings.owner.salesType+'&agentCode='+_global_settings.owner.agentCode);
				}
				
				setTimeout(function(){
					$(m).attr('href',hf);
				},500);
			}
		});
	}
}

var CopAgentBindModle=function(copAgentMgt){
	var me=this;
	
	this.bind=function(){
		
	}
	
	this.unbindAll=function(){
		
	}
}