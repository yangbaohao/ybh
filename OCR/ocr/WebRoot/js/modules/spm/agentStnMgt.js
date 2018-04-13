/*
*分配用户界面js
*/

var AgentStnMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user';
	this.indexs=[];
	this.debug=false;
	this.username=null;
	
	this.initInput=function(){
		me.username=$.pk.username;
		if(me.username==undefined){
			Core.alert({message:'username入参错误！'});
			$.closeTab();
		}
		console.log(me.username);
		
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	//初始化grid
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentStnGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(params){
                return demoAdapter.recordids;
            }
    	   ,columns:[
					{ text: '用户名',dataField:'loginId',width:'24.3%'},
					{ text: '公司名',dataField:'name',width:'24.3%'},
					{ text: '账期',dataField:'mouthDate',width:'24.4%'},
					{ text: '购买模块',dataField:'productName',width:'24.4%'}
				],
			selectionmode:'checkbox',
    	    pagesize: 20,
    	    columnsheight: 45,
    	    ready:function(){
    	    }
	    };
		$('#agentStnGrid').grid(grid_sets);
		
		//点击选择
		$('#agentStnGrid').on('rowselect',function(){
			var ins = $('#agentStnGrid').jqxGrid('getselectedrowindexes');
			me.indexs = [];
			
			$.each(ins,function(i,v){
				var data = $('#agentStnGrid').jqxGrid('getrowdata',ins[i]);
				if(data!=undefined){
					if(ins[i]!=undefined)
						me.indexs.push(ins[i]);
				}
			});
			console.log('select:'+me.indexs);
		});
		
		//取消选择
		$('#agentStnGrid').on('rowunselect',function(){
			var ins = $('#agentStnGrid').jqxGrid('getselectedrowindexes');
			me.indexs = [];
			
			$.each(ins,function(i,v){
				var data = $('#agentStnGrid').jqxGrid('getrowdata',ins[i]);
				if(data!=undefined){
					if(ins[i]!=undefined)
						me.indexs.push(ins[i]);
				}
			});
			console.log('unSelect:'+me.indexs);
		});
		
	}
	
	this.settings = {  
		source:{
	        url: url+'/searchusertax/isnull',
	        data:me.searchObj,
	    },
		grid:{element:'agentStnGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			//	
		}	
	};
}

var AgentStnBindModle=function(agentStnMgt){
	var me=this;
	var url=_global_settings.service.url+'/common';
	
	this.bind=function(){
		//点击保存
		$('#agentStn-save').on('click',function(){
			var param=[];
			if(agentStnMgt.indexs.length==0){
				Core.alert({message:'请选择客户！'});
				return false;
			}
			
			$.each(agentStnMgt.indexs,function(i){
				var obj = {};
				var rowdata = $('#agentStnGrid').jqxGrid('getrowdata',agentStnMgt.indexs[i]);
				obj.id = rowdata.id;
				obj.loginId = rowdata.loginId;
				obj.name = rowdata.name;
				
				if(rowdata.date!=undefined){  //账期
					obj.date = rowdata.date;
				}
				
				obj.productName = rowdata.productName;
				param.push(obj);
			});
			//console.log(param);
			
			Core.AjaxRequest({
				type:'POST',
				url:url+'/owner/tax/update/'+agentStnMgt.username,
				async:false,
				params:param,
				showMsg:false,
				callback:function(res){
					setCloseAlertTimeOneSecond();
					try{
						$('#agentDecGrid').jqxGrid('updatebounddata','cells');
						$.closeTab();
					}catch(e){}
					
				},
				failure:function(){
					
				}
				
			});
		});
		
		//点击取消
		$('#agentStn-cancle').on('click',function(){
			$.closeTab();
		});
	}
	
	this.unbindAll=function(){
		$('#agentStn-save').off('click');
		$('#agentStn-cancle').off('click');
	}
}