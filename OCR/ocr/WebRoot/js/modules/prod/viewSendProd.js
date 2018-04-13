/*
 * 产看赠送产品详情界面js
 */

var VspMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/accountproduct'
	var id=$.pk.id;
	
	this.initInput=function(){
		$('#vsp-show').css('display','');
		$('#viewSendProd-date').datetimeinput({value:new Date(),formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#vsp-show').addClass('hiddendiv');
		me.initGrid(me.searchObj);
	}
	
	//初始化grid
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewSendProductGrid', me.settings.source,{
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
					{ text: '赠送日期',dataField:'createDate',width:'10%'/*,
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid">';
							return html+rowdata.createDate.substring(0,10)+'</div>';
						}*/
					},
					{ text: '用户名',dataField:'userName',width:'15%'},
					{ text: '联系电话',dataField:'tel',width:'10%'},
					{ text: '公司名称',dataField:'commpanyName',width:'15%'},
					{ text: '代理商',dataField:'daili',width:'15%'},
					{ text: '销售负责人',dataField:'sale',width:'15%'},
					{ text: '客服',dataField:'kefu',width:'10%'},
					{ text: '状态',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid">';
								html += rowdata.type==undefined?'':getCodeData(rowdata.type.toLowerCase());
							return html+'</div>';
						}
					}
				],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#viewSendProductGrid').grid(grid_sets);
		
	}	
	
	this.settings = {  
		source:{
	        url: url+'/givedetail/'+id,
	        data:me.searchObj,
	    },
		grid:{element:'viewSendProductGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={
		'p.createDate':{value:[],action:'like'},
		't.loginId':{value:[],action:'like'},
		't.regTelephone':{value:[],action:'like'}
	};
	
	this.searchDataInfo = function(){
    	$('#viewSendProductGrid').jqxGrid('applyfilters');
    	$('#viewSendProductGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewSendProductGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewSendProductGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewSendProductGrid').jqxGrid('clearselection');
    	$('#viewSendProductGrid').jqxGrid('refreshdata');
    };
    
}

var VspBindModle=function(vspMgt){
	var me=this;
	var url=_global_settings.service.url+'/billingProductPermission/create';
	
	this.search=function(){
		var date=$('#viewSendProd-date').val(),
			name=$('#viewSendProd-name').val(),
			phone=$('#viewSendProd-phone').val();
		
		vspMgt.searchObj['p.createDate'].value=[];
		if(date!='')
			vspMgt.searchObj['p.createDate'].value.push(date);
		
		vspMgt.searchObj['t.loginId'].value=[];
		if(name!='')
			vspMgt.searchObj['t.loginId'].value.push(name);
			
		vspMgt.searchObj['t.regTelephone'].value=[];
		if(phone!='')
			vspMgt.searchObj['t.regTelephone'].value.push(phone);
		
		vspMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewSendProd-search').on('click',function(){
			if($('#vsp-show').is(':hidden'))
				$('#vsp-show').slideDown('slow');
			else
				me.search();
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#viewSendProd-search').off('click');
	}
}