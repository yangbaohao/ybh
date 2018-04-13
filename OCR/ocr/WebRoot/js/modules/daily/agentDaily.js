/*
 * 代理商申请界面js
 */
var AdyMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/common';
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
		$('#agentDaily-show').css('display','');
		
		var rd = ComboBoxSources.getRecords('salesAgent'),arr=['全部'];
		for(var i=0;i<rd.length;i++){
			arr.push(rd[i].userName);
		}
		$('#agentDaily-date').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		$('#agentDaily-number').jqxDropDownList({
			source:{'registerNum':'注册人数', 'aregisterNum':'有效注册人数', 'visitNum':'访问人数'},
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
		});
		//选择时间改变时间
		$('#agentDaily-sDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#agentDaily-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#agentDaily-date').on('change',function(){
			var td = $('#agentDaily-date').attr('id');
			var sd = $('#agentDaily-sDate').attr('id');
			var ed = $('#agentDaily-eDate').attr('id');
			setValueById(td,sd,ed);
		});
		$('#agentDaily-show').addClass('hiddendiv');
	}

	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentDailyGrid', me.settings.source,{
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
						return html+rowdata.createDate+'</div>';
					}
				},
				{ text: '注册人数',dataField:'ownerNum',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
						html+='<a class="hoverspan regUser">'+rowdata.ownerNum+'</a>';
						return html+'</div>';
					}
				},
				{ text: '有效注册人数',dataField:'realOwnerNum',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
						html+='<a class="hoverspan validUser">'+rowdata.realOwnerNum+'</a>';
						return html+'</div>';
					}
				},
/*				{ text: '登陆测试账号人数',dataField:'testNum',width:'20%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
						html+='<a class="hoverspan testUser">'+rowdata.testNum+'</a>';
						return html+'</div>';
					}
				},*/
  	            { text: '访问人数',dataField:'accessNum',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px; padding-left:6px;">';
						html+='<a class="hoverspan visitUser">'+rowdata.accessNum+'</a>';
						return html+'</div>';
					}
  	            }
	  	    ],
    	   pagesize: me.settings.grid.pagesize,
    	   columnsheight: 45
	    };
		$('#agentDailyGrid').grid(grid_sets);
		
		//点击注册人数
		$('#agentDailyGrid').on('click','.regUser',function(){
			var index = $('#agentDailyGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#agentDailyGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'注册人数',isFrame:false,url:'page/modules/daily/regUser.html',
					pk:{createDate:rowdata.createDate},reload:true});
			}
		});
		//点击有效注册人数
		$('#agentDailyGrid').on('click','.validUser',function(){
			var index = $('#agentDailyGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#agentDailyGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'有效注册人数',isFrame:false,url:'page/modules/daily/validUser.html',
					pk:{createDate:rowdata.createDate},
					reload:true});
			}
		});
		
/*		//登陆测试账号人数
		$('#agentDailyGrid').on('click','.testUser',function(){
			var index = $('#agentDailyGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#agentDailyGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'登陆测试账号人数',isFrame:false,url:'page/modules/daily/testUser.html',
					pk:{createDate:rowdata.createDate},
					reload:true});
			}
		});*/
		
		//点击访问人数
		$('#agentDailyGrid').on('click','.visitUser',function(){
			var index = $('#agentDailyGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#agentDailyGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'访问人数',isFrame:false,url:'page/modules/daily/visitUser.html',
					pk:{createDate:rowdata.createDate},
					reload:true});
			}
		});
		
	}	
	
	this.settings = {  
		source:{
	        url: url+'/owner/count/'+_global_settings.owner.roleName,
	        data:me.searchObj,
	    },
		grid:{element:'agentDailyGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.sarchObj={
			createDate:{value:[],action:'between'},
			ownerNum:{value:[],action:'between'},
			realOwnerNum:{value:[],action:'between'},
			accessNum:{value:[],action:'between'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#agentDailyGrid').jqxGrid('applyfilters');
    	$('#agentDailyGrid').jqxGrid('refreshfilterrow'); 
    	$('#agentDailyGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentDailyGrid').jqxGrid('updatebounddata', 'cells');
    	$('#agentDailyGrid').jqxGrid('clearselection');
    	$('#agentDailyGrid').jqxGrid('refreshdata');
    };
}

var AdyBindModle=function(adyMgt){
	var me=this;
	
	this.search=function(){
		var myVal = $('#agentDaily-number').val(),
			startNumber = $("#agentDaily-sNumber").val(),
			endNumber= $("#agentDaily-eNumber").val(),
			sDate=$('#agentDaily-sDate').val(),
			eDate=$('#agentDaily-eDate').val();
		
		//查询日期
		adyMgt.searchObj['createDate']=[];
		if(sDate!=='' && eDate!==''){
			adyMgt.searchObj['createDate']={value:[sDate+" 00:00:00",eDate+" 23:59:59"],action:'between'};
		}
		
		if(sDate!=='' && eDate===''){
			adyMgt.searchObj['createDate']={value:[sDate+" 00:00:00"],action:'ge'};
		}
		
		if(sDate==='' && eDate!==''){
			adyMgt.searchObj['createDate']={value:[eDate+" 23:59:59"],action:'le'};
		}
		
		//查询人数
		adyMgt.searchObj['ownerNum']=[];
		if(myVal=='registerNum' && startNumber!='' && endNumber!=''){
			adyMgt.searchObj['ownerNum']={value:[startNumber,endNumber],action:'between'};
		}
		
		adyMgt.searchObj['realOwnerNum']=[];
		if(myVal=='aregisterNum' && startNumber!='' && endNumber!=''){
			adyMgt.searchObj['realOwnerNum']={value:[startNumber,endNumber],action:'between'};
		}
		
		adyMgt.searchObj['accessNum']=[];
		if(myVal=='visitNum' && startNumber!='' && endNumber!=''){
			adyMgt.searchObj['accessNum']={value:[startNumber,endNumber],action:'between'};
		}

		adyMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#agentDaily-search').on('click',function(){
//			e.stopPropagation();
			if($('#agentDaily-show').is(':hidden')){
				$('#agentDaily-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
		
	}
	
	this.unbindAll=function(){
		$('#agentDaily-search').off('click');
	}
}