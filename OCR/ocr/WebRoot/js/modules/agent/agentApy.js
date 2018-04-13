/*
 * 代理商申请界面js
 */
var ApyMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/salesagent';
	this.debug=false;
	
	this.initInput=function(){
		me.initUserPage();
//		me.initWindows();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#agentApy-show').css('display','');
		
		var rd = ComboBoxSources.getRecords('salesAgent'),arr=['全部'];
		for(var i=0;i<rd.length;i++){
			arr.push(rd[i].agentName);
		}
		$('#agentApy-name').comboBox({
			theme:currentTheme,
			source:arr,
			searchMode:'contains',
//			displayMember:'agentName',
//			valueMember:'id',
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#agentApy-type').jqxDropDownList({
			source:{'all':'全部','enterprise':'企业','person':'个人'},
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		$('#agentApy-show').addClass('hiddendiv');
	}
	
//	this.initWindows=function(){
//		$('#agentApySpWin').jqxWindow({
//			theme : currentTheme,
//			isModal: true,
//			autoOpen: false,
//			maxHeight:1000,
//			minHeight:360,
//			height:'auto',			
//			minWidth: 700, 
//			cancelButton: $('#agentApySpBackBtn'),
//			initContent:function(){
//				$('#agentApySpGrid').grid({
//	         		   virtualmode:false,
//	         		   pageable:false,
//	         		   columns:[
//	       		            { text: '审核人', datafield: 'username',width:'25%'}
//	       		            ,{ text: '审核状态', datafield: 'status',width:'25%'}
//	       	                ,{ text: '备注', datafield: 'content',width:'25%'}
//	       	                ,{ text: '审核时间', datafield: 'time',width:'25%'}
//	       	           ]
//	         	  });
//			}
//		}).on({
//			"open":function(){		
//				
//			}
//		});
//	}
	
	//获取销售负责人
	this.getSalesAgent=function(id){
		var records = ComboBoxSources.getRecords('salesInfo');
		for(var i=0;i<records.length;i++){
			if(records[i].id==id){
				return records[i];
			}
		}
		if(!id){
			return '';
		}
			
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentApyGrid', me.settings.source,{
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
				{ text: '日期',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px">';
						return html+rowdata.userInfo.createDate.substring(0,10)+'</div>';
					}
				},
				{ text: '类型',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px">';
							html+=rowdata.type=='enterprise'?'企业':'个人';
						return html+'</div>';
					}
				},
				{ text: '用户名',dataField:'agentName',width:'25%'},
  	            { text: '销售负责人(姓名/用户名)',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px">';
							html+=rowdata.sales==undefined?'':
								(me.getSalesAgent(rowdata.sales.id)==undefined?'':
									me.getSalesAgent(rowdata.sales.id).userInfo.name+'('+me.getSalesAgent(rowdata.sales.id).username+')');
						return html+'</div>';
					}
  	            },
				/*,
  	            { text: '操作',width:'20%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px">';
						html+='<a class="hoverspan spBtn">'+'审核'+'</a>';
						return html+'</div>';
					}
  	            }*/
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#agentApyGrid').grid(grid_sets);
		
		//点击审核
//		$('#agentApyGrid').on('click','.spBtn',function(){
//			$('#agentApySpWin').jqxWindow('open');
//		});
	}	
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'agentApyGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			agentName:{value:[],action:'like'},
			type:{value:[],action:'eq'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#agentApyGrid').jqxGrid('applyfilters');
    	$('#agentApyGrid').jqxGrid('refreshfilterrow'); 
    	$('#agentApyGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentApyGrid').jqxGrid('updatebounddata', 'cells');
    	$('#agentApyGrid').jqxGrid('clearselection');
    	$('#agentApyGrid').jqxGrid('refreshdata');
    };
}

var ApyBindModle=function(apyMgt){
	var me=this;
	
	this.search=function(){
		var name = $('#agentApy-name').find('input').val(),type = $('#agentApy-type').val();
		
		apyMgt.searchObj.agentName.value=[];
		if(name!='全部')
			apyMgt.searchObj.agentName.value.push(name);
		
		apyMgt.searchObj.type.value=[];
		if(type!='all')
			apyMgt.searchObj.type.value.push(type);
		
		
		apyMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#agentApy-search').on('click',function(){
			if($('#agentApy-show').is(':hidden')){
				$('#agentApy-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
		
		//点击审核
//		$('#AgentApySP').on('click',function(){
//			$('#agentApySpWin').jqxWindow('open');
//		});
	}
	
	this.unbindAll=function(){
		$('#agentApy-search').off('click');
	}
}