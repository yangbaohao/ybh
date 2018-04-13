/*
 * 系统推送管理界面js
 */
var ViewPushDetail=function(){
	var me=this;
	var number = null;
	var url=_global_settings.service.url+'/informationLogs';
	this.debug=false;
	
	this.initInput=function(){
		number = $.pk.number;
		console.log(number);
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	//初始化grid
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'/search/detail/'+number;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewPushDetailGrid', me.settings.source,{
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
    	            { text: '推送时间', width:'20%',
    	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
      	            		var html = '<div class="agrid">';
      	            			html += rowdata.createDate.substring(0,10)+'</div>';
      	            		return html;
    					}
    	            },
					{ text: '用户名',dataField:'username',width:'20%'},
					{ text: '是否查看',dataField:'flag',width:'20%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html='<div class="agrid">';
							if(rowdata.flag===false){
								html+='否';
							}else{
								html+='是';
							}
							return html+'</div>';
						}
					},
					{ text: '推送内容',dataField:'content',width:'20%'},
					{ text: '公司名称',dataField:'name',width:'20%'},
				],
    	   pagesize: 20,
    	   columnsheight: 45,
    	   ready:function(){
    	   }
	    };
		$('#viewPushDetailGrid').grid(grid_sets);
	}	
	
	this.settings = {  
		source:{
	        data:me.searchObj,
	    },
		grid:{element:'viewPushDetailGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'il.username':{value:[],action:'like'},
		}	
	};
	
	this.searchDataInfo = function(){
    	$('#viewPushDetailGrid').jqxGrid('applyfilters');
    	$('#viewPushDetailGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewPushDetailGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewPushDetailGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewPushDetailGrid').jqxGrid('clearselection');
    	$('#viewPushDetailGrid').jqxGrid('refreshdata');
    };
}

var ViewPushDetailBindModle=function(viewPushDetail){
	var me=this;

	this.search=function(){
		var name=$('#viewPushDetail-user').val();
		
//		viewPushDetail.searchObj['t.name'].value=[];
//		if(name!='')
//			viewPushDetail.searchObj['t.name'].value.push(name);
//		
//		viewPushDetail.searchObj['t.type'].value=[];
//		if(type!='select')
//			viewPushDetail.searchObj['t.type'].value.push(type);
//		
//		viewPushDetail.searchObj['t.amount'].value=[];
//		if(sc!=''&&ec!='')
//			viewPushDetail.searchObj['t.amount'].value.push(sc,ec);
		
		viewPushDetail.searchObj['il.username'].value=[];
		if(name!='')
			viewPushDetail.searchObj['il.username'].value.push(name);
		
		viewPushDetail.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewPushDetail-search').on('click',function(){
			me.search();
		});
	};
	
	this.unbindAll=function(){
//		$('#push-search').off('click');
//		$('#push-send').off('click');
	};
}