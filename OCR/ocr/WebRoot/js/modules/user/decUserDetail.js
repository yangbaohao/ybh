/*
 * 访问人数界面js
 */
var UserDeltailMgt=function(){
	var me=this;
	var employeeCode =null;
	var url=_global_settings.service.url+'/user/';
	this.debug=false;

	this.initInput=function(){
		employeeCode = $.pk.employeeCode;
//		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}

	/*
	 * 初始化table
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'searchertax/'+employeeCode;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('userDeltailMgtGrid', me.settings.source,{
			beforeLoadComplete:function(records){
			}
		}, me.debug);
		var search1={};
		//初始化Grid
		var grid_sets = {
			columnsresize: false,
			autorowheight: true,
		    autoheight: true,
	  	    source:demoAdapter,
		    rendergridrows: function(){
                return demoAdapter.records;
            }
    	   ,columns:[								
				{ text: '用户名',dataField:'loginId',width:'20%',height:'20px'},
				{ text: '备注',dataField:'name',width:'20%',height:'20px'},
				{ text: '纳税人性质',dataField:'taxType',width:'20%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						if(rowdata.taxType=='generalvat'){
							rowdata.taxType='一般增值税纳税人';
						}else if(rowdata.taxType=='smallscale'){
							rowdata.taxType='小规模纳税人';
						}
						var html = '<div style="padding-top:6px; padding-left:6px;">'+rowdata.taxType
						return html+'</div>';
					}
				},
				{ text: '增值税率(%)',dataField:'vat',width:'20%',height:'20px'},
				{ text: '当前账期',dataField:'mouthDate',width:'20%',height:'20px'}      
	  	    ],
//    	   pagesize:2,
//    	   pagesizeoptions: [2,5,10,15],
	  	  pagesize: me.settings.grid.pagesize,
    	   columnsheight: 45
	    };
		$('#userDeltailMgtGrid').grid(grid_sets);
	}	

	this.settings = {  
		source:{
	        data:me.searchObj
	    },
		grid:{element:'userDeltailMgtGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			name:{value:[],action:'like'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#userDeltailMgtGrid').jqxGrid('applyfilters');
    	$('#userDeltailMgtGrid').jqxGrid('refreshfilterrow'); 
    	$('#userDeltailMgtGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#userDeltailMgtGrid').jqxGrid('updatebounddata', 'cells');
    	$('#userDeltailMgtGrid').jqxGrid('clearselection');
    	$('#userDeltailMgtGrid').jqxGrid('refreshdata');
    };
}

var userDeltailBindModel=function(vistMgt){
	var me=this;
	
	this.search=function(){
		var comName = $('#agentDailytest-com').find('input').val();
		if(comName!='全部')
			vistMgt.searchObj['i.name']={value:[comName],action:'like'};
		vistMgt.searchDataInfo();
	}
		
	this.bind=function(){
		//点击搜索
		$('#agentDailyTest-search').on('click',function(){
			alert();
			if($('#agentDailyTest-show').is(':hidden')){
				$('#agentDailyTest-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		hiddenAclick();
	}
	
	this.unbindAll=function(){
//		$('#agentDailyVisit-search').off('click');
		$('#userDeltailMgtGrid').off('click');	
	}	
}