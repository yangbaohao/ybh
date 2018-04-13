/*
 * 点击潜在客户界面js
 */

var CustDetailMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/potentialCustomers';
	this.debug=false;
	this.custId=$.pk.custId;
	
	this.initInput=function(){
		console.log(me.custId);
		
//		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		'pl.id':{value:[''+me.custId+''],action:'eq'}	
	};
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('custDetailGrid', me.settings.source,{
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
						{ text: '日期',width:'25%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
								return html+rowdata.createDate.substring(0,10)+'</div>';
							}
						},
						{ text: '短信主题',dataField:'messageTitle',width:'25%'},
						{ text: '发信人',dataField:'createBy',width:'25%'},
						{ text: '短信内容',dataField:'messageContent',width:'25%'}
    	            ],
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#custDetailGrid').grid(grid_sets);
	}
	
//	this.initSearch=function(){
//		me.searchObj={
//			
//		};
//	}
	
	this.settings = {  
		source:{
	        url: url+'/shortMessagesPage',
	        data:me.searchObj,
	    },
		grid:{element:'custDetailGrid'},
		ajax:{url:url},
	};
	
	this.searchDataInfo = function(){
    	$('#custDetailGrid').jqxGrid('applyfilters');
    	$('#custDetailGrid').jqxGrid('refreshfilterrow'); 
    	$('#custDetailGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#custDetailGrid').jqxGrid('updatebounddata', 'cells');
    	$('#custDetailGrid').jqxGrid('clearselection');
    	$('#custDetailGrid').jqxGrid('refreshdata');
    };
}

var CustDetailBindModle=function(custDetailMgt){
	var me=this;
	
	this.bind=function(){
		
	}
	
	this.unbindAll=function(){
		
	}
}