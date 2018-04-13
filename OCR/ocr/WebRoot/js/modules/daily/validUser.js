/*
 * 查看有效注册人数界面js
 */
var VadMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/common/';
	var createDate=null;
	this.debug=false;
	
	this.initInput=function(){
		createDate = $.pk.createDate;
//		alert(createDate);
		me.initUserPage();
//		me.initWindows();
	//		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		if($.pk!==undefined){
			if($.pk.createDate === undefined){
				Core.alert({
					message:"id入参错误",
					callback:function(){	
						$.closeTab();
					}
				});
			}
		}
	}
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.url = url+'owner/company/effective/'+createDate+'/'+_global_settings.owner.roleName;
		me.settings.source.data = me.searchObj;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentDailyGrid-valid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[									
				{ text: '用户名',dataField:'username',width:'33.33333%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
//						html+='<a class="hoverspan regUser">'+rowdata.client+'</a>';
						return html+rowdata.username+'</div>';
					}
				},
				{ text: '公司名称',dataField:'name',width:'33.33333%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
//						html+='<a class="hoverspan validUser">'+rowdata.client+'</a>';
						return html+rowdata.name+'</div>';
					}
				},
  	            { text: '联系电话',dataField:'telephone',width:'33.33333%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
//						html+='<a class="hoverspan visitUser">'+rowdata.client+'</a>';
						return html+rowdata.telephone+'</div>';
					}
  	            }/*,
				{ text: '注册地址',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:20px;">';
						return html+rowdata.userInfo.createDate.substring(0,10)+'</div>';
					}
				}*/
	  	    ],
    	   pagesize: me.settings.grid.pagesize,
    	   columnsheight: 45
	    };
		$('#agentDailyGrid-valid').grid(grid_sets);
	}	
	
	this.settings = {  
		source:{
//	        url: url+'/owner/company/effective/2016-09-14',
	        data:me.searchObj
	    },
		grid:{element:'agentDailyGrid-valid'},
		ajax:{url:url}
	};
	
	/*this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			agentName:{value:[],action:'like'},
			type:{value:[],action:'eq'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#agentDailyGrid-valid').jqxGrid('applyfilters');
    	$('#agentDailyGrid-valid').jqxGrid('refreshfilterrow'); 
    	$('#agentDailyGrid-valid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentDailyGrid-valid').jqxGrid('updatebounddata', 'cells');
    	$('#agentDailyGrid-valid').jqxGrid('clearselection');
    	$('#agentDailyGrid-valid').jqxGrid('refreshdata');
    };*/
}

var VadBindModle=function(vadMgt){
	var me=this;
	
	/*this.search=function(){
		var name = $('#agentDaily-name').find('input').val(),type = $('#agentDaily-type').val();
		
		ValMgt.searchObj.agentName.value=[];
		if(name!='全部')
			ValMgt.searchObj.agentName.value.push(name);
		
		ValMgt.searchObj.type.value=[];
		if(type!='all')
			ValMgt.searchObj.type.value.push(type);
		
		
		ValMgt.searchDataInfo();
	}*/
}