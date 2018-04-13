/*
 * 报税管理员分配客户界面js
 */

var DfuMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user';
	me.data=$.pk.data;
	this.indexs=[];
	
	this.initInput=function(){
		console.log(me.data);
		$('#selectUserCode').text(me.data.employeeCode);
		$('#selectUserName').text(me.data.username+'('+me.data.name+')');
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
//		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('decFpUserGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var	grid_sets = {
	  	     source:demoAdapter
		     ,rendergridrows: function(){
                  return demoAdapter.recordids;
             }
    	     ,columns:[
						{ text: '用户名',dataField:'loginId',width:'19.6%'},
						{ text: '备注',dataField:'name',width:'19.6%'},
						{ text: '纳税人性质',width:'19.4%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
//								console.log(rowdata);
								var html = '<div style="padding-top:6px">';
								return html+getCodeData(rowdata.taxType)+'</div>';
							}
						},
						{ text: '增值税率(%)',dataField:'vat',width:'19.4%'},
						{ text: '当前账期',dataField:'mouthDate',width:'19.4%'}
    	            ],
    	     selectionmode:'checkbox',
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#decFpUserGrid').grid(grid_sets);
		
		//选择事件
		$('#decFpUserGrid').on('rowselect',function (event){
		    var index = $('#decFpUserGrid').jqxGrid('getselectedrowindexes');
		    me.indexs=[];
		    
		    $.each(index,function(i,v){
		    	var data = $('#decFpUserGrid').jqxGrid('getrowdata',index[i]);
		    	if(data!=undefined){
		    		if(index[i]!=undefined)
		    			me.indexs.push(index[i]);
		    	}
		    });
		    
		});
		
		$('#decFpUserGrid').on('rowunselect',function (event){
		    var index = $('#decFpUserGrid').jqxGrid('getselectedrowindexes');
		    me.indexs=[];
		    
		    $.each(index,function(i,v){
		    	var data = $('#decFpUserGrid').jqxGrid('getrowdata',index[i]);
		    	if(data!=undefined){
		    		if(index[i]!=undefined)
		    			me.indexs.push(index[i]);
		    	}
		    });
		    
		});
		
	}	
	
	this.settings = {  
		source:{
	        url: url+'/searchusertax/fenpei',
	        data:me.searchObj
	    },
		grid:{element:'decFpUserGrid'},
		ajax:{url:url},
	};
	
	this.searchDataInfo = function(){
    	$('#decFpUserGrid').jqxGrid('applyfilters');
    	$('#decFpUserGrid').jqxGrid('refreshfilterrow'); 
    	$('#decFpUserGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#decFpUserGrid').jqxGrid('updatebounddata', 'cells');
    	$('#decFpUserGrid').jqxGrid('clearselection');
    	$('#decFpUserGrid').jqxGrid('refreshdata');
    };
}

var DfuBindModle=function(dfuMgt){
	var me=this;
	var url=_global_settings.service.url+'/common';
	
	this.bind=function(){
		//点击保存
		$('#decfpuser-save').on('click',function(){
			if(dfuMgt.indexs.length==0){
				Core.alert({message:'请选择客户！'});
				return false;
			}
			
			var arr=[];
			$.each(dfuMgt.indexs,function(i){
				var data = $('#decFpUserGrid').jqxGrid('getrowdata',dfuMgt.indexs[i]);
				var obj={};
					obj.id=data.id,obj.loginId=data.loginId,obj.name=data.name,
					obj.mouthDate=data.mouthDate;
				arr.push(obj);
			});
//			console.log(arr);
			
			Core.AjaxRequest({
				url:url+'/owner/tax/update/'+dfuMgt.data.username,
				type:'POST',
				params:arr,
				async:false,
				showMsg:false,
				callback:function(){
					try{
						setCloseAlertTimeOneSecond();
						$.closeTab();
						$('#decUserGridMgt').jqxGrid('updatebounddata','cells');
						$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
					}catch(e){};
				}
			});
			
		});
	}
	
	this.unbindAll=function(){
		$('#decfpuser-save').off('click');
	}
}