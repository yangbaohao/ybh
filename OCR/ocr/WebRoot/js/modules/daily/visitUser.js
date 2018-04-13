/*
 * 访问人数界面js
 */
var VistMgt=function(){
	var me=this;
	var createDate =null;
	var url=_global_settings.service.url+'/common';
	this.debug=false;

	this.initInput=function(){
		createDate = $.pk.createDate;
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}

	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#agentDailyVisit-show').css('display','');
		
		var rd = ComboBoxSources.getRecords('userInfo'),companyArr=['全部'];
		for(var i=0;i<rd.length;i++){
			companyArr.push(rd[i].name);
		}
		$('#agentDailyVisit-com').comboBox({
			theme:currentTheme,
			source:ComboBoxSources.getRecords('userInfo'),
			searchMode:'contains',
			displayMember:'name',
			valueMember: 'username',
			height:34,
			width:'100%',
		});
		$('#agentDailyVisit-show').addClass('hiddendiv');
	}

	/*
	 * 初始化table
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'/owner/access/-1/-1/-1/-1/'+createDate+'/'+_global_settings.owner.roleName;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentDailyGrid-visit', me.settings.source,{
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
				{ text: '用户名',dataField:'username',width:'8%',
					cellsrenderer:function ( rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="visitAgentCode" style="position: relative; top:50%; margin-top:-6px; text-align: center; text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.username+'</div>';
					}
				},
				{ text: '公司名称',dataField:'name',width:'13%',
					cellsrenderer:function ( rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="visitAgentCode" style="position: relative; top:50%; margin-top:-6px; text-align: center; text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.name+'</div>';
					}
				},
				  { text: '联系电话',dataField:'telephone',width:'8%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="visitAgentCode" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.telephone+'</div>';
					}
				  },
				{ text: '注册时间',dataField:'createDate',width:'13%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="visitAgentCode" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.createDate+'</div>';
					}
				},
				{ text: '最初访问时间',dataField:'minCreateDate',width:'13%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="visitAgentCodeFirst" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.minCreateDate+'</div>';
					}
				},
				{ text: '最后离开时间',dataField:'maxCreateDate',width:'13%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html='<div class="visitAgentCodeLast" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdata.maxCreateDate+'</div>';
					}
				},
				{ text: '访问模块',dataField:'remark',width:'18%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
				    	if(rowdata.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdata.accessList.length; i++){
				    			a=rowdata.accessList[i].remark;
			    				html+='<div class="visitAgentCodeReMark" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden; height:auto; line-height:24px;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
			    },
				{ text: '访问次数',width:'6%',
			    	cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
				    	if(rowdata.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdata.accessList.length; i++){
				    			a=rowdata.accessList[i].remarkNum;
			    				html+='<div class="visitAgentCodeReMark" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden; height:auto; line-height:24px;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
				},
				{ text: '停留时间(分)',width:'8%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
				    	if(rowdata.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdata.accessList.length; i++){
				    			a=rowdata.accessList[i].remarkSecond;
			    				html+='<div class="visitAgentCodeReMark	" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden; height:auto; line-height:24px;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
				}      
	  	    ],
//    	   pagesize:2,
//    	   pagesizeoptions: [2,5,10,15],
	  	  pagesize: me.settings.grid.pagesize,
    	   columnsheight: 50
	    };
		$('#agentDailyGrid-visit').grid(grid_sets);
	}	

	this.settings = {  
		source:{
	        data:me.searchObj
	    },
		grid:{element:'agentDailyGrid-visit'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			name:{value:[],action:'like'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#agentDailyGrid-visit').jqxGrid('applyfilters');
    	$('#agentDailyGrid-visit').jqxGrid('refreshfilterrow'); 
    	$('#agentDailyGrid-visit').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentDailyGrid-visit').jqxGrid('updatebounddata', 'cells');
    	$('#agentDailyGrid-visit').jqxGrid('clearselection');
    	$('#agentDailyGrid-visit').jqxGrid('refreshdata');
    };
}

var VistBindModle=function(vistMgt){
	var me=this;
	
	this.search=function(){
		var comName = $('#agentDailyVisit-com').find('input').val();
		if(comName != '全部' && comName != '')
			vistMgt.searchObj['name']={value:[comName],action:'like'};
		vistMgt.searchDataInfo();
	}
		
	this.bind=function(){
		//点击搜索
		$('#agentDailyVisit-search').on('click',function(){
			if($('#agentDailyVisit-show').is(':hidden')){
				$('#agentDailyVisit-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		hiddenAclick();
		
		
		//TODO 搜索的时候，enter事件在这里如果触发，不知道为什么会导致url重定向。在先这里屏蔽了。如果有更好的办法。再修改。
		$('#agentDailyVisit-show').keydown(function(e){
		    if (e.keyCode == 13) {   
		    	console.log('-------------');
		    	//$('#agentDailyVisit-search').click();
		    	e.preventDefault();
		    	e.keyCode=0;
		    	return false;
		    }
		})
	}
	
	this.unbindAll=function(){
//		$('#agentDailyVisit-search').off('click');
		$('#agentDailyGrid-visit').off('click');	
	}	
}