/*
 * 代金券详情界面js
 */

var ViewVou=function(){
	var me=this;
	var url=_global_settings.service.url+'/voucher/vouchername';
	var startTime=null;
	var endTime=null;
	this.name=null;
	
	this.initInput=function(){
		$('#viewVou-show').css('display','');
		
		me.name = $.pk.name;
//		console.log(me.name);
		if($.pk!=undefined||$.pk!=null){
			if($.pk.name==undefined||$.pk.name==null){
				Core.alert({
					message:'传入名称错误'
				});
				$.closeTab();
			}
		}
		
		$('#viewVou-show').addClass('hiddendiv');
		$('#viewVou-name').text(me.name);
		
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewVouGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				console.log(records);
				$.each(records,function(i){
					startTime = records[i].startTime.substring(0,10);
					endTime = records[i].endTime.substring(0,10);
					
					$('#viewVou-time').text('有效期：'+startTime+'——'+endTime);
					console.log(startTime,endTime);
					return;
				});
			}
		}, false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(params){
                return demoAdapter.recordids;
            }
    	   ,columns:[
					{ text: '代金券编号',dataField:'voucherCode',width:'20%'},
					{ text: '代金券金额',dataField:'amount',cellsalign:'right',cellsformat: 'c2',width:'10%'},
					{ text: '发放类型',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	  	            		var html = '<div class="agrid">';
	  	            			html += rowdata.dispatchType=='SYSPUSH'?'系统推送':'线下验码';
	  	            		return html+'</div>';
						}
					},
					{ text: '用户类型',dataField:'userType',width:'15%'},
					{ text: '代理商',dataField:'agentName',width:'15%'},
					{ text: '分配用户名',dataField:'loginId',width:'15%'},
					{ text: '状态',dataField:'state',width:'15%'}
				],
    	   pagesize: 20,
    	   columnsheight: 45,
    	   ready:function(){
//    		   var rows = $('#comnMgtGrid').jqxGrid('source');
//    		   console.log(rows);
    	   }
	    };
		$('#viewVouGrid').grid(grid_sets);
	}
	
	this.settings = {  
		source:{
	        url: url,
	        data:me.searchObj,
	    },
		grid:{element:'viewVouGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'v.name':{value:[''+me.name+''],action:'eq'},
			'v.voucherCode':{value:[],action:'like'},
			'a.agentName':{value:[],action:'like'},
			'o.loginId':{value:[],action:'like'},
			type:{value:[],action:'like'}
			
		}	
	};
	
	this.searchDataInfo = function(){
    	$('#viewVouGrid').jqxGrid('applyfilters');
    	$('#viewVouGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewVouGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewVouGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewVouGrid').jqxGrid('clearselection');
    	$('#viewVouGrid').jqxGrid('refreshdata');
    };
}

var viewVouBindModle=function(viewVou){
	var me=this;
	var url=_global_settings.service.url+'/common/export/voucher';
	
	this.search=function(){
		var code = $('#viewVou-code').val(),type = $('#viewVou-type').val(),
			agent = $('#viewVou-agent').val(),username = $('#viewVou-username').val();
		
		viewVou.searchObj['v.voucherCode'].value=[];
		viewVou.searchObj['a.agentName'].value=[];
		viewVou.searchObj['o.loginId'].value=[];
		viewVou.searchObj.type.value=[];
		
		if(code!='')
			viewVou.searchObj['v.voucherCode'].value.push(code);
		
		if(agent!='')
			viewVou.searchObj['a.agentName'].value.push(agent);
		
		if(username!='')
			viewVou.searchObj['o.loginId'].value.push(username);
		
		if(type!='')
			viewVou.searchObj.type.value.push(type);
		
		viewVou.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewVou-search').on('click',function(){
			if($('#viewVou-show').is(':hidden'))
				$('#viewVou-show').slideDown('slow');
			else
				me.search();
		});
		
		//点击导出
		$('#viewVou-import').on('click',function(){
			window.open(url+'/'+viewVou.name+'/'+'eyJjb25kaXRpb24iOltdLCJmaWx0ZXJzY291bnQiOjAsImdyb3Vwc2NvdW50IjowLCJwYWdlbnVtIjowLCJwYWdlc2l6ZSI6MjB9');
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#viewVou-search').off('click');
		$('#viewVou-import').off('click');
	}
}