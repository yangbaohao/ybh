/*
 *代理报税详情界面js
 */

var ViewAgentDecMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user';
	this.debug=false;
	this.username=$.pk.username;
	this.employeeCode=$.pk.employeeCode;
	
	this.initInput=function(){
		me.initPage();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		't.loginId':{value:[],action:'like'},	
		't.taxType':{value:[],action:'eq'},
		'l.accountPeriodMonth':{value:[],action:'eq'},
		'c.productName':{value:[],action:'like'},
		't.taxCode':{value:[me.employeeCode],action:'eq'}
	};
	
	this.initPage=function(){
		$('#viewAgentDec-show').css('display','');
		
		$('#viewAgentDec-tax').dropDownlist({
			source:{'all':'请选择','smallscale':'小规模纳税人','generalvat':'一般增值税纳税人'},
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		var rd = ComboBoxSources.getRecords('productName'),arr=['全部'];
		for(var i=0;i<rd.length;i++){
			arr.push(rd[i].productName);
		}
		
		$('#viewAgentDec-buy').comboBox({
			source:arr,
			searchMode:'contains',
			displayMember:'productName',
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#viewAgentDec-date').monthpicker({callback:'abc'});
		$('#viewAgentDec-show').addClass('hiddendiv');
	}
	
	
	//初始化grid
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewAgentDecGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(params){
                return demoAdapter.recordids;
            }
    	   ,columns:[
					{ text: '用户名',dataField:'loginId',width:'15%'},
					{ text: '公司名称',dataField:'name',width:'15%'},
					{ text: '纳税人性质',width:'15%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
					//		console.log(rowdata);
							var html = '<div style="padding-top:6px">';
							return html+getCodeData(rowdata.taxType)+'</div>';
						}
					},
					{ text: '增值税率(%)',dataField:'vat',width:'15%'},
					{ text: '账期',dataField:'mouthDate',width:'10%'},
					{ text: '购买模块',dataField:'productName',width:'20%'},
					{ text: '状态',dataField:'taxProgressType',width:'10%'} 
				],
    	    pagesize: 20,
    	    columnsheight: 45,
    	    ready:function(){
    	    }
	    };
		$('#viewAgentDecGrid').grid(grid_sets);
		
	}
	
	this.settings = {  
		source:{
	        url: url+'/searchusertax/1',
	        data:me.searchObj,
	    },
		grid:{element:'viewAgentDecGrid'},
		ajax:{url:url}
	};
	
	this.searchDataInfo = function(){
    	$('#viewAgentDecGrid').jqxGrid('applyfilters');
    	$('#viewAgentDecGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewAgentDecGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewAgentDecGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewAgentDecGrid').jqxGrid('clearselection');
    	$('#viewAgentDecGrid').jqxGrid('refreshdata');
    };
}

var ViewAgentDecBindModle=function(viewAgentDecMgt){
	var me=this;
	
	this.search=function(){
		var username = $('#viewAgentDec-username').val(),type = $('#viewAgentDec-tax').val(),
			monthDate = $('#viewAgentDec-date').val(),productName = $('#viewAgentDec-buy').find('input').val();
		
		viewAgentDecMgt.searchObj['t.loginId'].value=[];
		if(username!='')
			viewAgentDecMgt.searchObj['t.loginId'].value.push(username);
		
		viewAgentDecMgt.searchObj['t.taxType'].value=[];
		if(type!='all')
			viewAgentDecMgt.searchObj['t.taxType'].value.push(type);
		
		viewAgentDecMgt.searchObj['l.accountPeriodMonth'].value=[];
		viewAgentDecMgt.searchObj['l.accountPeriodMonth'].value.push(monthDate);
		
		viewAgentDecMgt.searchObj['c.productName'].value=[];
		if(productName!='全部')
			viewAgentDecMgt.searchObj['c.productName'].value.push(productName);
		
		viewAgentDecMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewAgentDec-search').on('click',function(){
			if($('#viewAgentDec-show').is(':hidden'))
				$('#viewAgentDec-show').slideDown('slow');
			else
				me.search();
				console.log('++');
		});
		
		hiddenAclick();
		
		//点击分配用户
		$('#viewAgentDec-stn').on('click',function(){
//			alert(viewAgentDecMgt.username);
			$.addTab({title:'分配用户',isFrame:false,url:'page/modules/spm/agentStnMgt.html',
				pk:{username:viewAgentDecMgt.username},reload:true});
		});
		
	}
	
	this.unbindAll=function(){
		$('#viewAgentDec-search').off('click');
		$('#viewAgentDec-stn').off('click');
	}
}