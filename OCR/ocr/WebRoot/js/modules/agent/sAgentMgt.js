/*
 * 代理商管理界面js
 */
var SagentMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/salesagent';
	this.salesAgentData=null;
	
	this.initInput=function(){
		me.initAgentPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	/*
	 * 初始化页面
	 */
	this.initAgentPage=function(){
		$('#sagent-type').dropDownlist({
			source:{'all':'全部','enterprise':'企业','person':'个人'},
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		$('#sagent-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#sagent-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#sagent-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#sagent-time').on('change',function(){
			var td = $('#sagent-time').attr('id');
			var sd = $('#sagent-sTime').attr('id');
			var ed = $('#sagent-eTime').attr('id');
			setValueById(td,sd,ed);
		});
		
		$('#sagent-name').comboBox({
			source:ComboBoxSources.getRecords('salesAgent_name'),
			searchMode:'contains',
			displayMember:'name_user',
			valueMember:'name_user',
			width:'100%'
		});
		
		$('#sagent-show').addClass('hiddendiv');
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('sagentGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[								
				{ text: '日期',width:'15%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
//						console.log(rowdata);
						var html = '<div class="agrid">';
						return html+rowdata.userInfo.createDate.substring(0,10)+'</div>';
					}
				},
				{ text: '编号',dataField:'agentCode',width:'17%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
//						html+='<a class="hoverspan viewAgent">';
						return html+rowdata.agentCode+'</div>';
					}
				},
				{ text: '类型',dataField:'type',width:'17%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
						var type=rowdata.type=='enterprise'?'企业':'个人'
						return html+type+'</div>';
					}
				},
				{ text: '用户名',dataField:'agentName',width:'17%'},
  	            { text: '成功客户',dataField:'client',width:'17%'},
  	            { text: '付费客户', dataField:'feeClient',width:'17%'}
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#sagentGrid').grid(grid_sets);
		
	}
	
	this.settings = {  
			source:{
		        url: url+'/page',
		        data:me.searchObj,
		    },
			grid:{element:'userGrid'},
			ajax:{url:url}
		};
		
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
//			parentAgentCode:{value:[''+_global_settings.owner.agentCode+''],action:'eq'},
			'userInfo.createDate':{value:[],action:'between'},	
			agentName:{value:[],action:'like'},
			agentCode:{value:[],action:'like'},
			type:{value:[],action:'eq'},
			'o.client':{value:[],action:'between'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#sagentGrid').jqxGrid('applyfilters');
    	$('#sagentGrid').jqxGrid('refreshfilterrow'); 
    	$('#sagentGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#sagentGrid').jqxGrid('updatebounddata', 'cells');
    	$('#sagentGrid').jqxGrid('clearselection');
    	$('#sagentGrid').jqxGrid('refreshdata');
    };
}

var SagentBindModle=function(sagentMgt){
	var me=this;
	
	this.search=function(){
		var agentCode = $('#sagent-number').val(),
			agentName = $('#sagent-name').val(),
			type = $('#sagent-type').val(),
			st = $('#sagent-sTime').val(),
			et = $('#sagent-eTime').val(),
			sc = $('#sagent-sc').val(),
			ec = $('#sagent-ec').val();
			
		sagentMgt.searchObj.agentCode.value=[];
		if(agentCode!='')
			sagentMgt.searchObj.agentCode.value.push(agentCode);
		
		sagentMgt.searchObj.agentName.value=[];
		if(agentName!='')
			sagentMgt.searchObj.agentName.value.push(agentName);
		
		
		sagentMgt.searchObj.type.value=[];
		if(type!='all')
			sagentMgt.searchObj.type.value.push(type);

		sagentMgt.searchObj['userInfo.createDate'].value=[];
		if(st!='' && et!=''){
			sagentMgt.searchObj['userInfo.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		}
		
		if(st!=''&& et===''){
			sagentMgt.searchObj['userInfo.createDate'].value.push(st+' '+'00:00:00');
			sagentMgt.searchObj['userInfo.createDate'].action = 'ge';
		}
		
		if(st===''&& et!=''){
			sagentMgt.searchObj['userInfo.createDate'].value.push(et+' '+'23:59:59');
			sagentMgt.searchObj['userInfo.createDate'].action = 'le'
		}
		
		sagentMgt.searchObj['o.client'].value=[];
		if(sc!=''&&ec!=''){
			sagentMgt.searchObj['o.client'].value.push(sc,ec);	
		}
		
		sagentMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#sagent-search').on('click',function(){
			if($('#sagent-show').is(':hidden')){
				$('#sagent-show').slideDown(500);
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#sagent-search').off('click');
	}
}