/*
 * 系统推送管理界面js
 */
var PushMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/informationLogs';
	
	this.initInput=function(){
		me.initPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initPage=function(){
		$('#push-show').css('display','');
		
		$('#push-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#push-sTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#push-eTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		
		$('#push-time').on('change',function(){
			setValueById('push-time','push-sTime','push-eTime');
		});
		
		$('#push-show').addClass('hiddendiv');
		
		$('#push-user').comboBox({
			source:ComboBoxSources.getRecords('salesInfo_name'),
			searchMode:'contains',
			displayMember:'name_user',
			valueMember:'username',
			width:'90%'
		});
	};

	this.getSalesByName=function(username){
		var records = ComboBoxSources.getRecords('salesInfo');
		for(var i=0;i<records.length;i++){
			if(records[i].username==username){
				return records[i];
			}
		}
		if(!username){
			return '';
		}
	}
	this.getCustomerByName=function(username){
		var records = ComboBoxSources.getRecords('custService');
		for(var i=0;i<records.length;i++){
			if(records[i].username==username){
				return records[i];
			}
		}
		if(!username){
			return '';
		}
	}
	//初始化grid
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('pushMgtGrid', me.settings.source,{
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
					{ text: '日期',dataField:'createDate',width:'13%'},
					{ text: '编号',dataField:'number',width:'13%'},
					{ text: '代推送主题',dataField:'theme',width:'20%'},
					{ text: '推送数量',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid" title="查看详情">';
								html += '<a class="hoverspan viewPushDetail">'+rowdata.count+'</a>';
							return html+'</div>';
						}
					},
					{ text: '查看数量',dataField:'lookCount',width:'10%'},
					{ text: '推送内容',width:'21%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid">';
							return html+rowdata.content+'</div>';
						}
					},
					{ text: '推送人',width:'13%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid text-center" style="padding-top:6px">';
							if(rowdata.username == 'admin'){
								html += '系统管理员(admin)';
							}else if(me.getSalesByName(rowdata.username)!=undefined){
								html+=me.getSalesByName(rowdata.username).userInfo.name+'('+rowdata.username+')';
							}else if(me.getCustomerByName(rowdata.username)!=undefined){
								html+=me.getCustomerByName(rowdata.username).name+'('+rowdata.username+')';
							}
							return html+'</div>'
						}
					},
				],
    	   pagesize: 20,
    	   columnsheight: 45,
    	   ready:function(){
    	   }
	    };
		$('#pushMgtGrid').grid(grid_sets);
	}	
//	
//	this.refreshInputGrid=function(){
//		if($('#push-send')){
//			
//		}
//	}
	
	this.settings = {  
		source:{
	        url: url+'/search/page',
	        data:me.searchObj,
	    },
		grid:{element:'pushMgtGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'il.number':{value:[],action:'like'},
			'il.createDate':{value:[],action:'between'},
			'il.theme':{value:[],action:'like'},
			'il.createBy':{value:[],action:'like'}
		}	
	};
	
	this.searchDataInfo = function(){
    	$('#pushMgtGrid').jqxGrid('applyfilters');
    	$('#pushMgtGrid').jqxGrid('refreshfilterrow'); 
    	$('#pushMgtGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#pushMgtGrid').jqxGrid('updatebounddata', 'cells');
    	$('#pushMgtGrid').jqxGrid('clearselection');
    	$('#pushMgtGrid').jqxGrid('refreshdata');
    };
}

var PushBindModle=function(pushMgt){
	var me=this;

	this.search=function(){
		var st=$('#push-sTime').val(),
			et=$('#push-eTime').val(),
			num=$('#push-num').val(),
			theme=$('#push-theme').val(),
			user=$('#push-user').val();
			
		
		pushMgt.searchObj['il.createDate'].value=[];
		if(st!=''&& et!='')
			pushMgt.searchObj['il.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&& et===''){
			pushMgt.searchObj['il.createDate'].value.push(st+' '+'00:00:00');
			pushMgt.searchObj['il.createDate'].action='ge';
		}
		
		if(st===''&& et!=''){
			pushMgt.searchObj['il.createDate'].value.push('2015-01-01'+' '+'00:00:00',et+' '+'23:59:59');
			pushMgt.searchObj['il.createDate'].action='le';
		}
			
		pushMgt.searchObj['il.number'].value=[];
		if(num!='')
			pushMgt.searchObj['il.number'].value.push(num);
		
		pushMgt.searchObj['il.theme'].value=[];
		if(theme!='')
			pushMgt.searchObj['il.theme'].value.push(theme);
		
		pushMgt.searchObj['il.createBy'].value=[];
		if(user!='')
			pushMgt.searchObj['il.createBy'].value.push(user);
		
		pushMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#push-search').on('click',function(){
			if($('#push-show').is(':hidden'))
				$('#push-show').slideDown('slow');
			else
				me.search();
		});
		
		hiddenAclick();
		
		//新增推送
		$('#push-send').on('click',function(){
			$.addTab({title:'推送代金券',url:'page/modules/buso/addPush.html',isFrame:false,
				reload:true});
		});
		
		//查看详情
		$('#pushMgtGrid').on('click','.viewPushDetail',function() {
			var index = $('#pushMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#pushMgtGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'查看详情',url:'page/modules/buso/viewPushDetail.html',isFrame:false,
					pk:{number:rowdata.number},reload:true});
			}
		});
	};
	
	this.unbindAll=function(){
//		$('#push-search').off('click');
//		$('#push-send').off('click');
	};
}