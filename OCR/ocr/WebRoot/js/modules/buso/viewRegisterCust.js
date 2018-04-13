/*
 * 点击注册用户数界面js
 */

var RscustMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/potentialCustomers';
	this.debug=false;
	this.batchNum=$.pk.batchNum;
	
	me.urls3={url: {value:[url+'/registered']}};
	
	this.setUrl=function(){
		
		me.urls3['url']={value:[url+'/matching']};
		
		me.searchDataInfo();
		console.log(me.urls3);
	}
	
	this.initInput=function(){
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		sortdatafield:'createDate',
		batchNum:{value:[''+me.batchNum+''],action:'eq'}
	}
	
	var mesContent= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
		
    	var html='';
    	$.each(rowdata.messageContent,function(i,o){
    		html+='<div style="border-top:1px solid #EBEFF2;padding-right:5px;">'+rowdata.messageContent[i]+'</div>';
		});
		return '<div style="height: auto;">'+html+'</div>';
	};
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		var source={
			url: me.urls3.url.value[0],
	        dataUrl:me.urls3,
	        data:me.searchObj
	    }
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('rsCustMgtGrid', source,{
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
						{ text: '注册日期',dataField:'createDate',width:'20%'/*,
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
								return html+rowdata.createDate.substring(0,10)+'</div>';
							}*/
						},
						{ text: '用户名',dataField:'potentialName',width:'20%'},
						{ text: '电话号码',dataField:'phone',width:'20%'},
						{ text: '公司名称',dataField:'contact',width:'20%'},
						{ text: '短信内容',width:'20%',cellsrenderer:mesContent}
    	            ],
             autorowheight: true,
			 autoheight: true,       
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#rsCustMgtGrid').grid(grid_sets);
	}	
	
	this.searchDataInfo = function(){
    	$('#rsCustMgtGrid').jqxGrid('applyfilters');
    	$('#rsCustMgtGrid').jqxGrid('refreshfilterrow'); 
    	$('#rsCustMgtGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#rsCustMgtGrid').jqxGrid('updatebounddata', 'cells');
    	$('#rsCustMgtGrid').jqxGrid('clearselection');
    	$('#rsCustMgtGrid').jqxGrid('refreshdata');
    };
}

var RscustBindModle=function(rscustMgt){
	var me=this;
	
	this.bind=function(){
		//点击用户匹配
		$('#rscust-search').on('click',function(){
			rscustMgt.setUrl();
		});
	}
	
	this.unbindAll=function(){
		$('#rscust-search').off('click');
	}
}
