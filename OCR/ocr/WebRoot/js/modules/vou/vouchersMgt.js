/*
 * 代金券管理界面js
 */
var VouMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/voucher';
	
	this.initInput=function(){
		me.initPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initPage=function(){
		$('#vou-show').css('display','');
		
		$('#vou-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#vou-sTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#vou-eTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		
		$('#vou-time').on('change',function(){
			setValueById('vou-time','vou-sTime','vou-eTime');
		});
		
		$('#vou-type').dropDownlist({
			source:{'all':'请选择','SYSPUSH':'系统推送','LINE':'线下验码'},
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#vou-stype').dropDownlist({
			source:{'select':'请选择','ordinary':'普通代金券','all':'全额代金券'},
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#vou-show').addClass('hiddendiv');
	};
	
	//初始化grid
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('vouGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(params){
                return demoAdapter.recordids;
            }
    	   ,columns:[
					{ text: '代金券名称',width:'15%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid" title="查看详情">';
								html += '<a class="hoverspan viewVouchers">'+rowdata.name+'</a>';
							return html+'</div>';
						}
					},
					{ text: '代金券类型',width:'15%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid">';
							return html+getCodeData(rowdata.type)+'</div>';
						}
					},
					{ text: '代金券总金额',dataField:'amount',cellsalign:'right',cellsformat: 'c2',width:'15%'},
					{ text: '发放类型',width:'15%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid">';
								html+=rowdata.dispatchType=='SYSPUSH'?'系统推送':'线下验码';
							return html+'</div>';
						}
					},
					{ text: '开券日期',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid">';
							return html+rowdata.startTime.substring(0,10)+'</div>';
						}
					},
					{ text: '有效日期',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid">';
							return html+rowdata.endTime.substring(0,10)+'</div>';
						}
					},
					{ text:'总数量',dataField:'sum',width:'10%'},
					{ text:'使用数量',dataField:'available',width:'10%'}
				],
    	   pagesize: 20,
    	   columnsheight: 45,
    	   ready:function(){
//    		   var rows = $('#comnMgtGrid').jqxGrid('source');
//    		   console.log(rows);
    	   }
	    };
		$('#vouGrid').grid(grid_sets);
		
		//点击名称查看详情
		$('#vouGrid').on('click','.viewVouchers',function(){
			var index = $('#vouGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#vouGrid').jqxGrid('getrowdata',index);
//				console.log(rowdata);
				$.addTab({title:'代金券详情',isFrame:false,url:'page/modules/vou/viewVouChers.html',
					pk:{name:rowdata.name},reload:true});
			}
		});
	}	
	
	this.settings = {  
		source:{
	        url: url+'/vouchersupervise',
	        data:me.searchObj,
	    },
		grid:{element:'vouGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			't.name':{value:[],action:'like'},
			't.amount':{value:[],action:'between'},
			't.sum':{value:[],action:'between'},
			't.startTime':{value:[],action:'between'},
			't.dispatchType':{value:[],action:'eq'},
			't.type':{value:[],action:'eq'}
		}	
	};
	
	this.searchDataInfo = function(){
    	$('#vouGrid').jqxGrid('applyfilters');
    	$('#vouGrid').jqxGrid('refreshfilterrow'); 
    	$('#vouGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#vouGrid').jqxGrid('updatebounddata', 'cells');
    	$('#vouGrid').jqxGrid('clearselection');
    	$('#vouGrid').jqxGrid('refreshdata');
    };
}

var VouBindModle=function(vouMgt){
	var me=this;
	
	this.search=function(){
		var name=$('#vou-name').val(),
			type=$('#vou-stype').val(),
			sc=$('#vou-sc').val(),
			ec=$('#vou-ec').val(),
			sm=$('#vou-sm').val(),
			em=$('#vou-em').val(),
			st=$('#vou-sTime').val(),
			et=$('#vou-eTime').val(),
			stype=$('#vou-type').val();
		
		vouMgt.searchObj['t.name'].value=[];
		if(name!='')
			vouMgt.searchObj['t.name'].value.push(name);
		
		vouMgt.searchObj['t.type'].value=[];
		if(type!='select')
			vouMgt.searchObj['t.type'].value.push(type);
		
		vouMgt.searchObj['t.amount'].value=[];
		if(sc!=''&&ec!='')
			vouMgt.searchObj['t.amount'].value.push(sc,ec);
		
		vouMgt.searchObj['t.sum'].value=[];
		if(sm!=''&&em!='')
			vouMgt.searchObj['t.sum'].value.push(sm,em);
		
		vouMgt.searchObj['t.startTime'].value=[];
		if(st!=''&&et!='')
			vouMgt.searchObj['t.startTime'].value.push(st,et);
		
		if(st!=''&&et==='')
			vouMgt.searchObj['t.startTime'].value.push(st, getNowFormatDate());
		
		if(st===''&&et!='')
			vouMgt.searchObj['t.startTime'].value.push('2015-01-01',et);
		
		vouMgt.searchObj['t.dispatchType'].value=[];
		if(stype!='all')
			vouMgt.searchObj['t.dispatchType'].value.push(stype);
		
		vouMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#vou-search').on('click',function(){
			if($('#vou-show').is(':hidden'))
				$('#vou-show').slideDown('slow');
			else
				me.search();
		});
		
		hiddenAclick();
		
		//点击推送
		$('#vou-send').on('click',function(){
			$.addTab({title:'推送代金券',url:'page/modules/vou/vouChersSend.html',isFrame:false,
				reload:true});
		});
	};
	
	this.unbindAll=function(){
		$('#vou-search').off('click');
		$('#vou-send').off('click');
	};
}