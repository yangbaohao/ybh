/*
 *查看用户浏览历史js 
 */

var ViewMoreMgt=function(){
	var me=this;
	this.id=$.pk.id;
	this.username=$.pk.username;
	this.name=$.pk.name;
	var url=_global_settings.service.url+'/user/search/userAccess/'+me.id+'/1/'+_global_settings.owner.roleName;
	this.debug=false;
	this.initInput=function(){
		me.initPage();
		me.initGrid();
	}
	this.searchObj1={};
	
	this.initPage=function(){
		$('#viewUserMoreVisit-username').text(me.username);
		$('#viewUserMoreVisit-company').text(me.name);
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.setting1.source.data = me.searchObjs;
		me.setting1.source.url = url;
		//初始化浏览历史数据源
		var demoAdapter1 = Core.AcDataAdapter('viewUserMoreVisit', me.setting1.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化浏览历史Grid
		var grid_set = {
	  	    source:demoAdapter1,
			columnsresize: false,
			autorowheight: true,
		    autoheight: true,
		    rendergridrows: function(){
	            return demoAdapter1.records;
	        }
    	   ,columns:[								
				{ text: '访问时间',dataField:'createDate',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="JournalDiv" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdatas.createDate+'</div>';
					}
				},
				{ text: '访问模块',dataField:'remark',width:'25%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
				    	if(rowdatas.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdatas.accessList.length; i++){
				    			a=rowdatas.accessList[i].remark;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
			    },
				{ text: '访问次数',width:'25%',
			    	cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
				    	if(rowdatas.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdatas.accessList.length; i++){
				    			a=rowdatas.accessList[i].remarkNum;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
				},
				{ text: '停留时间(分)',width:'25%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
				    	if(rowdatas.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdatas.accessList.length; i++){
				    			a=rowdatas.accessList[i].remarkSecond;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
				}
	  	    ],
    	   columnsheight: 45,
	    };
		$('#viewUserMoreVisit').grid(grid_set);
	}
	
	this.setting1 = {  
			source:{ data:me.searchObj1 },
			grid:{element:'viewUserMoreVisit'},
			ajax:{url:url},
		};
}

var ViewMoreBindModle=function(viewMoreMgt){
	var me=this;
	
	this.bind=function(){
		
	}
	
	this.unbindAll=function(){
		
	}
}
