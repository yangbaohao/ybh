var OperationLogMgt = function(){
	var me = this;
	var url = _global_settings.service.url+'/overview/';
	
	this.initInput = function(){
		me.initPage();
		me.initSearch();
		me.initOperationLogGrid();
	}
	
	this.initPage = function(){
		$('#operationLogGrid-show').css('display','');
		
		$('#operationLogGrid-time').dropDownlist({
			source:{'0':'请选择','1':'最近一周','2':'最近两周','3':'最近三周','4':'本月','5':'本季度','6':'本年'},
			selectedIndex:0,
			dropDownHeight:120
		});
		$('#operationLogGrid-sDate,#operationLogGrid-eDate').datetimeinput(/*{formatString:"yyyy-MM-dd", width: '100%', height: '34px'}*/);
//		$('#operationLogGrid-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#operationLogGrid-time').on('change',function(){
			setValueById('operationLogGrid-time','operationLogGrid-sDate','operationLogGrid-eDate');
		});
		
		$('#operationLogGrid-name').comboBox({
			source:ComboBoxSources.getRecords('username'),
			displayMember:'name',
			valueMember:'name'
		});
		
		$('#operationLogGrid-show').addClass('hiddendiv');
		
		hiddenAclick();
	}
	
	$('#operationLogGrid-search').off('click').on('click',function(){
		if($('#operationLogGrid-show').is(':hidden')){
			$('#operationLogGrid-show').slideDown('slow');
		}else{
			search();
		}
	});
	
	var search=function(){
		var st=$('#operationLogGrid-sDate').val(),
			et=$('#operationLogGrid-eDate').val(),
			name=$('#operationLogGrid-name').val();
		
		me.searchObj.handleDate.value=[];
		if(st!=''&&et!=''){
			me.searchObj.handleDate.value.push(st,et);
			me.searchObj.handleDate.action='between';
		}
		if(st!=''&&et==''){
			me.searchObj.handleDate.value.push(st);
			me.searchObj.handleDate.action='ge';
		}
		if(st==''&&et!=''){
			me.searchObj.handleDate.value.push(et);
			me.searchObj.handleDate.action='le';
		}
		if(name!=''){
			me.searchObj['logd.createBy'].value.push(name);
		}
		
		searchDataInfo('operationLogGrid');
	}
	
	this.searchObj = {};
	
	this.initSearch=function(){
		me.searchObj={
			'handleDate':{value:[],action:'between'},
			'logd.createBy':{value:[],action:'like'}
		}
	}
	
	/**
	 * 初始化用户grid
	 */
	this.initOperationLogGrid = function(){
		var source={
	        data:me.searchObj,
	        url : url+'searchLogInfo'
	    }
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('operationLogGrid', source,{
			beforeLoadComplete:function(records){
			},
			loadComplete:function(rd){
			}
		}, false);
		
		//初始化Grid
		var	grid_sets = {
	  	    source:demoAdapter
		    ,rendergridrows: function(){
                 return demoAdapter.recordids;
            },
            columns:me.initColumns(),
    	    pagesize: 20,
    	    enablehover: false,
    	    columnsheight: 45
	    };
		
		$('#operationLogGrid').grid(grid_sets);
	}
	
	/**
	 * 初始化数据列
	 */
	this.initColumns= function(){
		var columns = [
				{ text: '日期',dataField: 'handleDate',width:'25%'},
				{ text: '用户名',width:'25%',dataField: 'createBy'},	
				{ text: '操作详情',width:'25%',
					cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
						var html='<div class="agrid">';
							html += getCodeData(rowdata.handletype);
						return html+'</div>';
					}
				},
				{ text: '关联任务',dataField:'orderNumber',width:'25%',
					cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
						var abs = rowdata.orderNumber==undefined?'':rowdata.orderNumber;
						var html='<div class="agrid">';
							html+='<a class="hoverspan viewOcrAboutTask">'+abs+'</a>';
						return html+'</div>';
					}
				}
			];
		return columns;
	};
}