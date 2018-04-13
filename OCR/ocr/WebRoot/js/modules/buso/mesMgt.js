var MesMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/shortmessage';
	this.message=null;
	
	this.initInput=function(){
		me.initPage();
		me.initWindows();
//		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		sortdatafield:'createDate',
		messageCode:{value:[],action:'like'},
		messageTitle:{value:[],action:'like'},
		createBy:{value:[],action:'like'},
		createDate:{value:[],action:'between'},
		messageNumber:{value:[],action:'between'}
	}
	
	this.initPage=function(){
		$('#mes-show').css('display','');
		
		$('#mes-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#mes-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#mes-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#mes-time').on('change',function(){
			setValueById('mes-time','mes-sTime','mes-eTime');
		});
		
		$('#mes-show').addClass('hiddendiv');
	}
	
	this.initWindows = function(){
		$('#mesWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:700,
			minHeight:300,
			height:'auto',			
			minWidth: 600, 
			maxWidth:800, 
			cancelButton: $('#cancelMesBtn'),
			initContent:function(){
				
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#meswin-zt').val('');
				$('#meswin-mes').val('');
			},500);
		});
		
		$('#mesEditWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:700,
			minHeight:300,
			height:'auto',			
			minWidth: 600, 
			maxWidth:800, 
			cancelButton: $('#cancelMesEditBtn'),
			initContent:function(){
				
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#meswin-editcode').val('');
				$('#meswin-editzt').val('');
				$('#meswin-editmes').val('');
			},500);
		});
	}
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('mesMgtGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var	grid_sets = {
	  	     source:demoAdapter
		     ,rendergridrows: function(){
                  return demoAdapter.recordids;
             }
    	     ,columns:[
						{ text: '日期',width:'15%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
								return html+rowdata.createDate.substring(0,10)+'</div>';
							}
						},
						{ text: '编号',dataField:'messageCode',width:'20%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
									html += '<a class="hoverspan viewMes">'+rowdata.messageCode+'</a>';
								return html+'</div>';
							}
						},
						{ text: '短信主题',dataField:'messageTitle',width:'20%'},
						{ text: '发送用户数',dataField:'messageNumber',width:'15%'/*,
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div>';
								var number = 0;
								if(rowdata.messageLogs!=undefined){
									$.each(rowdata.messageLogs,function(i){
										number += rowdata.messageLogs[i].num;
									});
								} 
								return html+'<div style="padding-top:6px" title='+number+'>'+number+'</div></div>';
							}
						*/},
						{ text: '写信人(姓名/用户名)',width:'15%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
								if(rowdata.createBy == 'admin'){
									html += '系统管理员(admin)';
								}else if(getSalesInfoByName(rowdata.createBy)!=undefined){
									html+=getSalesInfoByName(rowdata.createBy).userInfo.name+'('+rowdata.createBy+')';
								}else if(getCustomerInfoByName(rowdata.createBy)!=undefined){
									html+=getCustomerInfoByName(rowdata.createBy).name+'('+rowdata.createBy+')';
								}
								return html+'</div>'
							}
						},
						{ text: '操作',width:'15%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="text-center">';
									html += '<a class="hoverspan md-edit editMes" title="编辑"></a>';
									html += '<a class="hoverspan md-exit-to-app sendMes" title="发送"></a>';
								return html+'</div>';
							}
						}
    	            ],
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#mesMgtGrid').grid(grid_sets);
		
		//点击编辑
		$('#mesMgtGrid').on('click','.editMes',function(){
			var index = $('#mesMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#mesMgtGrid').jqxGrid('getrowdata',index);
				me.message = rowdata;
				$('#mesEditWin').jqxWindow('open',function(){
					$('#meswin-editcode').val(rowdata.messageCode);
					$('#meswin-editzt').val(rowdata.messageTitle);
					$('#meswin-editmes').val(rowdata.messageContent);
				});
			}
		});
		
		//点击发送
		$('#mesMgtGrid').on('click','.sendMes',function(){
			var index = $('#mesMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#mesMgtGrid').jqxGrid('getrowdata',index);
				console.log(rowdata);
				$.addTab({title:'发送短信',isFrame:false,url:'page/modules/buso/mesSendMgt.html',
					pk:{id:rowdata.id},reload:true});
			}
		});
		
		//点击查看详情
		$('#mesMgtGrid').on('click','.viewMes',function(){
			var index = $('#mesMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#mesMgtGrid').jqxGrid('getrowdata',index);
				console.log(rowdata);
				$.addTab({title:'查看短信',isFrame:false,url:'page/modules/buso/viewMes.html',
					pk:{mesId:rowdata.id},reload:true});
			}
		});
	}
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'mesMgtGrid'},
		ajax:{url:url},
	};
	
//	this.initSearch=function(){
//		me.searchObj={
//			
//		};
//	}
	
	this.searchDataInfo = function(){
    	$('#mesMgtGrid').jqxGrid('applyfilters');
    	$('#mesMgtGrid').jqxGrid('refreshfilterrow'); 
    	$('#mesMgtGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#mesMgtGrid').jqxGrid('updatebounddata', 'cells');
    	$('#mesMgtGrid').jqxGrid('clearselection');
    	$('#mesMgtGrid').jqxGrid('refreshdata');
    };
}

var MesBindModle=function(mesMgt){
	var me=this;
	var url=_global_settings.service.url+'/shortmessage';
	
	this.search=function(){
		var messageCode = $('#mes-code').val(),
			messageTitle = $('#mes-batchNum').val(),
			createBy = $('#mes-person').val(),
			st = $('#mes-sTime').val(),
			et = $('#mes-eTime').val(),
			sc = $('#mes-sc').val(),
			ec = $('#mes-ec').val();
		
		mesMgt.searchObj.messageCode.value=[];
		if(messageCode!='')
			mesMgt.searchObj.messageCode.value.push(messageCode);
		
		mesMgt.searchObj.messageTitle.value=[];
		if(messageTitle!='')
			mesMgt.searchObj.messageTitle.value.push(messageTitle);
		
		mesMgt.searchObj.createBy.value=[];
		if(createBy!='')
			mesMgt.searchObj.createBy.value.push(createBy);
		
		mesMgt.searchObj.createDate.value=[];
		if(st!=''&&et!='')
			mesMgt.searchObj.createDate.value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et==='')
			mesMgt.searchObj.createDate.value.push(st+' '+'00:00:00', getNowFormatDate()+' '+'23:59:59');
		
		if(st===''&&et!='')
			mesMgt.searchObj.createDate.value.push('2015-01-01'+' '+'00:00:00',et+' '+'23:59:59');
		
		mesMgt.searchObj.messageNumber.value=[];
		if(sc!=''&&ec!='')
			mesMgt.searchObj.messageNumber.value.push(sc,ec);
			
		mesMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#mes-search').on('click',function(){
			if($('#mes-show').is(':hidden')){
				$('#mes-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
		
		//点击新增短信
		$('#mes-add').on('click',function(){
			$('#mesWin').jqxWindow('open',function(){
				Core.AjaxRequest({
					async:false,
					url:_global_settings.service.url+'/salesagent/getcode/messagecode',
					type:'GET',
					dataType:'text',
					callback:function(res){
						$('#meswin-code').val(res);
					},
					failure:function(){
						
					}
				});
			});
		});
		
		//保存新增短信
		$('#addMesSaveBtn').on('click',function(){
			var obj={};obj.sales={};
			if(_global_settings.owner.roleName=='salesStaff'){
				obj.sales={id:_global_settings.owner.userid};
			}
				
			obj.messageCode = $('#meswin-code').val();
			obj.messageContent = $('#meswin-mes').val();
			obj.messageTitle = $('#meswin-zt').val();
				 
			Core.AjaxRequest({
				type:'POST',
				url:url,
				params:obj,
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					$('#mesWin').jqxWindow('close');
					$('#mesMgtGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
				}
			});
		});
		
		//保存编辑短信
		$('#addMesSaveEditBtn').on('click',function(){
			delete mesMgt.message.uid;
			delete mesMgt.message.uniqueid;
			delete mesMgt.message.visibleindex;
			delete mesMgt.message.boundindex;
			
			mesMgt.message.messageTitle = $('#meswin-editzt').val();
			mesMgt.message.messageContent = $('#meswin-editmes').val();
			console.log(mesMgt.message);
			Core.AjaxRequest({
				type:'PUT',
				url:url,
				params:mesMgt.message,
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					$('#mesEditWin').jqxWindow('close');
					$('#mesMgtGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
					
				}
			});
		});
	}
	
	this.unbindAll=function(){
		$('#mes-search').off('click');
		$('#mes-add').off('click');
		$('#addMesSaveBtn').off('click');
		$('#addMesSaveEditBtn').off('click');
	}
}