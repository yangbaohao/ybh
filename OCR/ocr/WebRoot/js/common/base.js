
/**
 * BaseManager为每个界面提供通用的组件初始化工作
 */
var BaseManager = function(settings){
	
	var defaults = {
		tab:{element :null},
		grid:{
			element :null,
			datatype:"json",
			contentType:"application/json; charset=UTF-8",
			url : null,
			columnsheight: 45
		}
	};
	settings = $.extend(true, defaults, settings);
	
//	var me = this;
	
//	this.bindModel = new BaseModel(settings,this);
	
	//搜索条件
	this.searchObj = {};
	
	this.initInput = function(){
		if(settings.tab.element){
			$('#'+settings.tab.element).jqxTabs({showCloseButtons: true, theme : currentTheme});
			$('#'+settings.tab.element).jqxTabs('hideCloseButtonAt', 0); 
		}
	};
	
	//初始化搜索组件
	this.initSearch = function(){};
	
	//初始化列表
    this.initGrid = function(obj,source,setting){
    	if(settings.grid.element){
    		
    		var dataAdapter = Core.NewDataAdapter({gridId:settings.grid.element,url:settings.grid.url,params:obj,source:source});
        	
    		var sets = {
    	    	  	   source:dataAdapter
    	    		   ,rendergridrows: function(){
    	                    return dataAdapter.records;
    	                }
    	        	   ,columns:settings.grid.columns,
    	        	   columnsheight:settings.grid.columnsheight,
    	        	   pagesize: settings.grid.pagesize
    	    	    };
    		sets = $.extend({},sets,setting);
        	$("#"+settings.grid.element).grid(sets);
    	}
    };
	
	//初始化弹出窗口
	this.initWindows = function(){
		alert("initWindows");
	};
	
	//初始化校验器
	this.initValidator = function(){alert("initValidator");};
	
	//初始化各控件值
    this.initOperation = function(){};
    
    //查询列表数据
    this.searchDataInfo = function(element){
    	var el = element===undefined?settings.grid.element:element;
    	$("#"+el).jqxGrid('applyfilters');
    	$("#"+el).jqxGrid('refreshfilterrow'); 
    	$("#"+el).jqxGrid('clearselection');
    };
    
    //刷新
    this.refreshDataInfo = function(element){
    	var el = element===undefined?settings.grid.element:element;
    	$("#"+el).jqxGrid('updatebounddata', 'cells');
    	$("#"+el).jqxGrid('clearselection');
    };
};

/**
 * BaseModel为绑定事件基类
 */
var BaseModel = function(settings,_manager){
	var defaults = {
		grid:{element :null},
		addWin:{element:null},
		editWin:{element:null},
		addForm:{element:null},
		editForm:{element:null},
		ajax:{
			contentType:"application/json; charset=UTF-8",
			url:null,
			async: false,
			dataType:"json",
		},
		condition:null
	};
	settings = $.extend(true,defaults, settings);
	
//	var me = this;
	
	this.search = function(){alert("seach");};
	
	this.add = function(){
		$("#"+settings.addWin.element).jqxWindow("open");
	};
	
	this.edit = function(){
		var rowindex = $('#'+settings.grid.element).jqxGrid('getselectedrowindex');
	    if(rowindex >= 0){
	    	$("#"+settings.editWin.element).jqxWindow("open");
	    }
	};
	
	this.remove=function(){
		var rowindex = $('#'+settings.grid.element).jqxGrid('getselectedrowindex');
	    if(rowindex >= 0){
	    	var data = $('#'+settings.grid.element).jqxGrid('getrowdata', rowindex);
			Core.confirm({
				message:"确定要删除？",
				confirmCallback:function(){
					Core.AjaxRequest({
		                url : settings.ajax.deleteUrl == undefined ? settings.ajax.url+data.id : settings.ajax.deleteUrl + data.id,
		                type: "DELETE",
		                async: settings.ajax.async,
		                dataType:settings.ajax.dataType,
		                callback: function(res) {
							_manager.initOperation();
							_manager.refreshDataInfo();
		                },
		                failure:function(res){
		                }
		            });
				}
			});
	    }
	};
	
	this.fillModel = function(){return null;};
	
	this.initAddParam = function(){return null;};
	
	function _addSubmit(obj){
		if(obj){
			Core.AjaxRequest({
                url : settings.ajax.addUrl == null ? settings.ajax.url : settings.ajax.addUrl,
                type: "POST",
                params:obj,
                successMsg:"操作成功",
                callback: function(res) {
					_manager.initOperation();
					_manager.refreshDataInfo();
					$("#"+settings.addWin.element).jqxWindow("close");
                },
                failure:function(res){
                }
            });
		}
	};
	
	function _editSubmit(obj){
		Core.AjaxRequest({
            url : settings.ajax.editUrl == null ? settings.ajax.url : settings.ajax.editUrl,
            type: "PUT",
            params:obj,
            callback: function(res) {
            	Core.alert({
					message:"操作成功",
					callback:function(){
						_manager.initOperation();
						_manager.refreshDataInfo();
						$("#"+settings.editWin.element).jqxWindow("close");
					}
				});
            },
            failure:function(res){
            }
        });
	};
	
	this.addSubmit=function(obj, validate){
		if(validate===false){
			_addSubmit(obj);
		}else if($('#'+settings.addForm.element).jqxValidator('validate')){
			_addSubmit(obj);
		}
	};
	
	this.initEditParam = function(){return null;};
	
	this.editSubmit=function(obj, validate){
		if(validate===false){
			_editSubmit(obj);
		}else if($('#'+settings.editForm.element).jqxValidator('validate')){
			_editSubmit(obj);
		}
	};
};
