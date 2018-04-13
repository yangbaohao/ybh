/*
 *查看统计报表js 
 */

var VrcMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/common/remark/access';
	this.debug=false;
	this.initInput=function(){
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initUserPage=function(){
		$('#viewReCount-show').css('display','');
		
		$('#viewReCount-date').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		//选择时间改变时间
		$('#viewReCount-sDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#viewReCount-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#viewReCount-date').on('change',function(){
			var td = $('#viewReCount-date').attr('id');
			var sd = $('#viewReCount-sDate').attr('id');
			var ed = $('#viewReCount-eDate').attr('id');
			setValueById(td,sd,ed);
		});
		
		$('#viewReCount-show').addClass('hiddendiv');
	}
	
	this.searchObj={};
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.setting.source.data = me.searchObj;
		me.setting.source.url = url;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewReCount', me.setting.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_set = {
	  	    source:demoAdapter,
			columnsresize: false,
			autorowheight: true,
		    autoheight: true,
		    rendergridrows: function(){
	            return demoAdapter.records;
	        }
    	   ,columns:[								
				{ text: '访问模块',dataField:'remark',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="JournalDiv" style=" margin-top:6px;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdatas.remark+'</div>';
					}
			    },
			    { text: '访问次数',dataField:'remarkNum',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="JournalDiv" style=" margin-top:6px; text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdatas.remarkNum+'</div>';
					}
				},
				{ text: '有效访问次数',dataField:'ownerLoginNum',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="JournalDiv" style=" margin-top:6px; text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdatas.ownerLoginNum+'</div>';
					}
				},
				{ text: '停留时间(分)',dataField:'remarkSecond',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="JournalDiv" style=" margin-top:6px; text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdatas.remarkSecond+'</div>';
					}
				}
	  	    ],
    	   columnsheight: 45,
	    };
		$('#viewReCount').grid(grid_set);
	}
	
	this.setting = {  
			source:{ data:me.searchObj },
			grid:{element:'viewReCount'},
			ajax:{url:url},
		};
	this.initSearch=function(){
		me.sarchObj={
			'createDate':{value:[],action:'between'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#viewReCount').jqxGrid('applyfilters');
    	$('#viewReCount').jqxGrid('refreshfilterrow'); 
    	$('#viewReCount').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewReCount').jqxGrid('updatebounddata', 'cells');
    	$('#viewReCount').jqxGrid('clearselection');
    	$('#viewReCount').jqxGrid('refreshdata');
    };
}

var VrcBindModle=function(vrcMgt){
	var me=this;
	
	this.search = function(){
		var sDate = $('#viewReCount-sDate').val(),
			eDate = $('#viewReCount-eDate').val();
		
		//查询日期
		vrcMgt.searchObj['createDate']= [];
		if(sDate!=='' && eDate!==''){
			vrcMgt.searchObj['createDate'] = {value:[sDate+" 00:00:00",eDate+" 23:59:59"],action:'between'};
		}
		
		if(sDate!=='' && eDate===''){
			vrcMgt.searchObj['createDate']={value:[sDate+" 00:00:00"],action:'ge'};
		}
		
		if(sDate==='' && eDate!==''){
			vrcMgt.searchObj['createDate']={value:[eDate+" 23:59:59"],action:'le'};
		}
		vrcMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewReCount-search').on('click',function(){
			if($('#viewReCount-show').is(':hidden')){
				$('#viewReCount-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		
	}
}
