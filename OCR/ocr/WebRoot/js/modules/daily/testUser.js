/*
 * 访问人数界面js
 */
var TestMgt=function(){
	var me=this;
	var createDate =null;
	var url=_global_settings.service.url+'/common';
	this.debug=false;

	this.initInput=function(){
		createDate = $.pk.createDate;
		$('#agentDailyTest-show').addClass('hiddendiv');
		me.initSearch();
		me.initGrid(me.searchObj);
	}

	/*
	 * 初始化table
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'/testOwner/access/'+createDate;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentDailyGrid-test', me.settings.source,{
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
				{ text: '登录时间',dataField:'minCreateDate',width:'14%',
					cellsrenderer:function ( rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="testCreateDate" style="position: relative; top:50%; margin-top:-6px; text-align: center; text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.minCreateDate+'</div>';
					}
				},
				{ text: '联系电话',dataField:'telephone',width:'14%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="testPhone" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.telephone+'</div>';
					}
				},
				{ text: '用户名',dataField:'username',width:'14%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="testUsername" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.username+'</div>';
					}
				},
				{ text: '登陆次数',dataField:'loginNum',width:'14%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="testLoginNum" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.loginNum+'</div>';
					}
				},
				{ text: '访问模块',dataField:'remark',width:'22%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
				    	if(rowdata.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdata.accessList.length; i++){
				    			a=rowdata.accessList[i].remark;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
			    },
				{ text: '访问次数',width:'11%',
			    	cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
				    	if(rowdata.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdata.accessList.length; i++){
				    			a=rowdata.accessList[i].remarkNum;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
				},
				{ text: '停留时间(分)',width:'11%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
				    	if(rowdata.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdata.accessList.length; i++){
				    			a=rowdata.accessList[i].remarkSecond;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
				}      
	  	    ],
	  	  pagesize: me.settings.grid.pagesize,
    	   columnsheight: 45
	    };
		$('#agentDailyGrid-test').grid(grid_sets);
	}	

	this.settings = {  
		source:{
	        data:me.searchObj
	    },
		grid:{element:'agentDailyGrid-test'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			phone:{value:[],action:'like'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#agentDailyGrid-test').jqxGrid('applyfilters');
    	$('#agentDailyGrid-test').jqxGrid('refreshfilterrow'); 
    	$('#agentDailyGrid-test').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentDailyGrid-test').jqxGrid('updatebounddata', 'cells');
    	$('#agentDailyGrid-test').jqxGrid('clearselection');
    	$('#agentDailyGrid-test').jqxGrid('refreshdata');
    };
}

var TestBindModle=function(testMgt){
	var me=this;
	
	this.search=function(){
		var telphone = $('#agentDailyTest-telphone').val();
		if(telphone!='')
			testMgt.searchObj['l.phone']={value:[telphone],action:'like'};
		testMgt.searchDataInfo();
	}
		
	this.bind=function(){
		//点击搜索
		$('#agentDailyTest-search').on('click',function(){
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
		$('#agentDailyGrid-test').off('click');	
	}	
}