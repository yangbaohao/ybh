/*
 * 查看注册人数界面js
 */
var RegMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/common/';
	var createDate=null;
	this.debug=false;
	this.initInput=function(){
		createDate = $.pk.createDate;
		me.initUserPage();
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
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'owner/company/unEffective/'+createDate+'/'+_global_settings.owner.roleName;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentDailyGrid-reg', me.settings.source,{
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
				{ text: '用户名',dataField:'username',width:'33.3%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
						return html+rowdata.username+'</div>';
					}
				},
				{ text: '公司名称',dataField:'name',width:'33.3%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
						return html+rowdata.name+'</div>';
					}
				},
  	            { text: '联系电话',dataField:'telephone',width:'33.3%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
						if(rowdata.telephone!=undefined){
							return html+rowdata.telephone+'</div>';
						}
					}
  	            }
	  	    ],
    	   pagesize: me.settings.grid.pagesize,
    	   columnsheight: 45
	    };
		$('#agentDailyGrid-reg').grid(grid_sets);	
	}	
	
	this.settings = {  
		source:{
	        data:me.searchObj
	    },
		grid:{element:'agentDailyGrid-reg'},
		ajax:{url:url}
	};
}

var RegBindModle=function(regMgt){
	var me=this;
	
}