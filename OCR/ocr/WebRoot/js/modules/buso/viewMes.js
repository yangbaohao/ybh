/*
 *查看短信界面js 
 */

var ViewMesMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/shortmessage';
	this.debug=false;
	this.id=$.pk.mesId;
	
	this.initInput=function(){
		
//		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		sortdatafield:'createDate',
		batchNum:{value:[],action:'like'}
	};
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewMesGrid', me.settings.source,{
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
						{ text: '导入时间',width:'20%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
								return html+rowdata.importDate.substring(0,10)+'</div>';
							}
						},
						{ text: '客户主题',width:'20%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
									html += '<a class="hoverspan viewMesDet">'+rowdata.batchNum+'</a>';
								return html+'</div>';
							}
						},
						{ text: '数量',dataField:'num',width:'20%'},
						{ text: '备注',dataField:'remark',width:'20%'},
						{ text: '状态',width:'20%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
								return html+getCodeData(rowdata.status)+'</div>';
							}
						}
    	            ],
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#viewMesGrid').grid(grid_sets);
		
		//点击主题
		$('#viewMesGrid').on('click','.viewMesDet',function(){
			var index = $('#viewMesGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#viewMesGrid').jqxGrid('getrowdata',index);
				console.log(rowdata);
				$.addTab({title:'查看客户',isFrame:false,url:'page/modules/buso/viewCust.html',
					pk:{batchNum:rowdata.batchNum,date:rowdata.createDate},reload:true});
			}
		});
	}
	
	this.settings = {  
		source:{
	        url: url+'/send/'+me.id,
	        data:me.searchObj
	    },
		grid:{element:'viewMesGrid'},
		ajax:{url:url},
	};
	
//	this.initSearch=function(){
//		me.searchObj={
//			
//		};
//	}
	
	this.searchDataInfo = function(){
    	$('#viewMesGrid').jqxGrid('applyfilters');
    	$('#viewMesGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewMesGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewMesGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewMesGrid').jqxGrid('clearselection');
    	$('#viewMesGrid').jqxGrid('refreshdata');
    };
}

var ViewMesBindModle=function(viewMesMgt){
	var me=this;
	
	this.bind=function(){
		//点击搜索
		$('#viewmes-search').on('click',function(){
			var batchNum = $('#viewmes-zt').val();
			
			viewMesMgt.searchObj.batchNum.value=[];
			if(batchNum!='')
				viewMesMgt.searchObj.batchNum.value.push(batchNum);
			
			viewMesMgt.searchDataInfo();
		});
	}
	
	this.unbindAll=function(){
		$('#viewmes-search').off('click');
	}
}
