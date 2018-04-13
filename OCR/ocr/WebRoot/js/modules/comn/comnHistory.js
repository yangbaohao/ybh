/*
 * 佣金历史界面js
 */
var ComnhMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/salesagent';
	var currentRoleName = _global_settings.owner.roleName;
	this.debug=false;
	
	this.initInput=function(){
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#comnH-show').css('display','');
		
		var rd = ComboBoxSources.getRecords('salesAgent'),arr=['全部'];
		for(var i=0;i<rd.length;i++){
			arr.push(rd[i].agentName);
		}
		$('#comnH-name').comboBox({
			theme:currentTheme,
			source:arr,
			searchMode:'contains',
//			displayMember:'agentName',
//			valueMember:'id',
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#comnH-show').addClass('hiddendiv');
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('comnHistoryGrid', me.settings.source,{
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
				{ text: '代理商编码', dataField: 'agentCode',width:'10%'	},
				{ text: '代理商用户名',dataField:'agentName',width:'15%'},
				{ text: '付费客户',width:'15%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            			html += '<a class="hoverspan viewComn">'+rowdata.customernum+'</a></div>';
  	            		return html;
					}
				},
				{ text: '累计购买金额',dataField:'amt',cellsalign:'right', cellsformat: 'c2',width:'15%'},
  	            { text: '应提佣金',dataField:'fee',cellsalign:'right', cellsformat: 'c2',width:'15%'},
  	            { text: '已提佣金',dataField:'revenueAmt',cellsalign:'right', cellsformat: 'c2',width:'15%'},
  	            { text: '未提佣金',dataField:'notRevenueAmt',cellsalign:'right',cellsformat:'c2',width:'15%'}
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#comnHistoryGrid').grid(grid_sets);
		
		//点击付费客户
		$('#comnHistoryGrid').on('click','.viewComn',function(){
			var index = $('#comnHistoryGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data = $('#comnHistoryGrid').jqxGrid('getrowdata',index);
				console.log(data);
				$.addTab({title:'佣金详情',url:'page/modules/comn/viewComn.html',pk:{name:data.agentName,agentCode:data.agentCode, agentId:data.id},reload:true});
			}
		});
	}	
	
	this.settings = {  
		source:{
	        url: url+'/search/page',
	        data:me.searchObj,
	    },
		grid:{element:'comnHistoryGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			agentCode:{value:[],action:'like'},
			agentName:{value:[],action:'like'},
			customernum:{value:[],action:'between'},
			fee:{value:[],action:'between'}
//			customernum:{value:[],action:'between'}
		};
		
		if(currentRoleName=='salesStaff'||currentRoleName=='salesManage'){
			me.searchObj['ow.sales_id']={value:[''+_global_settings.owner.userid+''],action:'eq'};
		}
	}
	
	this.searchDataInfo = function(){
    	$('#comnHistoryGrid').jqxGrid('applyfilters');
    	$('#comnHistoryGrid').jqxGrid('refreshfilterrow'); 
    	$('#comnHistoryGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#comnHistoryGrid').jqxGrid('updatebounddata', 'cells');
    	$('#comnHistoryGrid').jqxGrid('clearselection');
    	$('#comnHistoryGrid').jqxGrid('refreshdata');
    };
}

var ComnhBindModle=function(comnhMgt){
	var me=this;
	
	this.search=function(){
		var agentCode = $('#comnH-number').val(),agentName = $('#comnH-name').find('input').val(),
			cs = $('#comnH-sc').val(),ce = $('#comnH-ec').val(),
			sa = $('#comnH-sa').val(),ea = $('#comnH-ea').val();
		
		comnhMgt.searchObj.agentCode.value=[];
		if(agentCode!='')
			comnhMgt.searchObj.agentCode.value.push(agentCode);
		
		comnhMgt.searchObj.agentName.value=[];
		if(agentName!='全部')
			comnhMgt.searchObj.agentName.value.push(agentName);
		
		comnhMgt.searchObj.customernum.value=[];
		if(cs!=''&&ce!='')
			comnhMgt.searchObj.customernum.value.push(cs,ce);
		
		comnhMgt.searchObj.fee.value=[];
		if(sa!=''&&ea!='')
			comnhMgt.searchObj.fee.value.push(sa,ea);
		
		
		comnhMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#comnH-search').on('click',function(){
			if($('#comnH-show').is(':hidden')){
				$('#comnH-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#comnH-search').off('click');
	}
}