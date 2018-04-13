/*
 *代理报税管理界面js
 */

var AgentDecMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user';
	this.debug=false;
	this.data=null;
	
	me.urls3={url: {value:[url+'/userTax/-1/-1']}};
	
	this.setUrl=function(){
		
		var su = $('#agentDec-su').val()==''?-1:$('#agentDec-su'),
			eu = $('#agentDec-eu').val()==''?-1:$('#agentDec-eu');//负责客户
		
		me.urls3['url']={value:[url+'/userTax/'+su+'/'+eu]};
		
		console.log(me.urls3);
	}
	
	this.initInput=function(){
		me.initPage();
		me.initWindows();
//		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		sortdatafield:'user.createDate',
		'user.username':{value:[],action:'like'},
		'user.employeeCode':{value:[],action:'like'},
		'user.locked':{value:[],action:'eq'},
		'user.createDate':{value:[],action:'between'}
	}
	
	this.initPage=function(){
		$('#agentDec-show').css('display','');
		
		$('#agentDec-time').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#agentDec-sTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#agentDec-eTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		
		$('#agentDec-time').on('change',function(){
			setValueById('agentDec-time','agentDec-sTime','agentDec-eTime');
		});
		
		$('#agentDec-status').dropDownlist({
			source:{'all':'请选择','N':'启用','Y':'禁用'},
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#agentDec-show').addClass('hiddendiv');
	}
	
	this.initWindows = function(){
		$('#agentDecLockedWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:260,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#agentDecLockedCancleBtn'),
			initContent:function(){
				$('#agentDec-locked').dropDownlist({
					source:{'false':'否','true':'是'},
					height:34,
					width:'100%',
					selectedIndex:0
				});
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#agentDec-name').val('');
				$('#agentDec-locked').dropDownlist({selectedIndex:0});
			},500);
		});
	}
	
	/**
	 * getTaxerInfo 拉出所有报税人名单,姓名,id
	 */
	this.getTaxerInfo=function(username){
		var rd = ComboBoxSources.getRecords('taxerInfo');
		for(i=0;i<rd.length;i++){
			if(username==rd[i].username){
				return rd[i];
			}
		}
		
		if(!username){
			return '';
		}
	}
	
	//初始化grid
	this.initGrid=function(){
//		me.settings.source.data = me.searchObj;
		
		var source={
				url: me.urls3.url.value[0],
		        dataUrl:me.urls3,
		        data:me.searchObj
		    }
		
//		this.settings = {  
//			source:{
//		        url: url+'/userTax/-1/-1',
//		        data:me.searchObj,
//		    },
//			grid:{element:'agentDecGrid'},
//			ajax:{url:url}
//		};
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentDecGrid', source,{
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
					{ text: '日期',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px">';
							return html+rowdata.createDate.substring(0,10)+'</div>';
						}
					},
					{ text: '编号',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px;padding-left:2px">';
								html+='<a class="hoverspan viewAgentDec">'+rowdata.employeeCode+'</a>';
							return html+'</div>';
						}
					},
					{ text: '代理报税(姓名/用户名)',width:'12%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px;padding-left:2px">';
								html+=me.getTaxerInfo(rowdata.username).name+'('+rowdata.username+')';
							return html+'</div>';
						}
					},
					{ text: '负责客户',dataField:'ownerNum',width:'12%'},
					{ text: '负责人',width:'12%'},
					{ text: '累计佣金',cellsformat:'c2',cellsalign:'right',width:'12%'},
					{ text: '未提佣金',cellsformat:'c2',cellsalign:'right',width:'12%'},
					{ text: '禁用',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px">';
							return html+getCodeData(rowdata.locked)+'</div>';
						}
					},
					{ text: '操作',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:2px;text-align:center">';
								html+='<a class="hoverspan md-format-list-bulleted fpcust" title="分配用户"></a>';
								html+='<a class="hoverspan md-error notuse" title="禁用"></a>';
							return html+'</div>';
						}
					}
				],
    	    pagesize: 20,
    	    columnsheight: 45,
    	    ready:function(){
//    		   var rows = $('#comnMgtGrid').jqxGrid('source');
//    		   console.log(rows);
    	    }
	    };
		$('#agentDecGrid').grid(grid_sets);
		
		//分配用户
		$('#agentDecGrid').on('click','.fpcust',function(){
			var index = $('#agentDecGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#agentDecGrid').jqxGrid('getrowdata',index);
				console.log(rowdata);
				$.addTab({title:'分配用户',isFrame:false,url:'page/modules/spm/agentStnMgt.html',
					pk:{username:rowdata.username},reload:true});
			}
		});
		
		//点击禁用
		$('#agentDecGrid').on('click','.notuse',function(){
			var index = $('#agentDecGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#agentDecGrid').jqxGrid('getrowdata',index);
				me.data = rowdata;
				console.log(rowdata);
				$('#agentDecLockedWin').jqxWindow('open',function(){
					$('#agentDec-name').val(rowdata.username);
				});
			}
		});
		
		//点击编码
		$('#agentDecGrid').on('click','.viewAgentDec',function(){
			var index = $('#agentDecGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#agentDecGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'详情',isFrame:false,url:'page/modules/spm/viewAgentDec.html',
					pk:{username:rowdata.username,employeeCode:rowdata.employeeCode},reload:true});
			}
		});
		
	}
	
//	this.=function(){
//		me.searchObj={
//			//	
//		}	
//	};
	
	this.searchDataInfo = function(){
    	$('#agentDecGrid').jqxGrid('applyfilters');
    	$('#agentDecGrid').jqxGrid('refreshfilterrow'); 
    	$('#agentDecGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentDecGrid').jqxGrid('updatebounddata', 'cells');
    	$('#agentDecGrid').jqxGrid('clearselection');
    	$('#agentDecGrid').jqxGrid('refreshdata');
    };
}

var AgentDecBindModle=function(agentDecMgt){
	var me=this;
	
	this.search=function(){
		var username = $('#agentDec-username').val(),
			employeeCode = $('#agentDec-code').val(),
			locked = $('#agentDec-status').val(),
			st = $('#agentDec-sTime').val(),
			et = $('#agentDec-eTime').val();
		
		agentDecMgt.searchObj['user.username'].value=[];
		if(username!='')
			agentDecMgt.searchObj['user.username'].value.push(username);
		
		agentDecMgt.searchObj['user.employeeCode'].value=[];
		if(employeeCode!='')
			agentDecMgt.searchObj['user.employeeCode'].value.push(employeeCode);
		
		agentDecMgt.searchObj['user.locked'].value=[];
		if(locked!='all')
			agentDecMgt.searchObj['user.locked'].value.push(locked);
		
		agentDecMgt.searchObj['user.createDate'].value=[];
		if(st!=''&&et!='')
			agentDecMgt.searchObj['user.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et==='')
			agentDecMgt.searchObj['user.createDate'].value.push(st+' '+'00:00:00', getNowFormatDate()+' '+'23:59:59');
		
		if(st===''&&et!='')
			agentDecMgt.searchObj['user.createDate'].value.push('2015-01-01'+' '+'00:00:00',et+' '+'23:59:59');
		
		agentDecMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#agentDec-search').on('click',function(){
			if($('#agentDec-show').is(':hidden'))
				$('#agentDec-show').slideDown('slow');
			else {
				agentDecMgt.setUrl();
				me.search();
			}
		});
		
		hiddenAclick();
		
		//点击保存禁用
		$('#agentDecLockedSaveBtn').on('click',function(){
			console.log(agentDecMgt.data);
			var id = agentDecMgt.data.id;
			var locked = $('#agentDec-locked').val();
			Core.AjaxRequest({
				url:_global_settings.service.url+'/user/lock/'+id+'/'+locked,
				type:'PUT',
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					$('#agentDecLockedWin').jqxWindow('close');
					$('#agentDecGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
					
				}
			});
		});
	}
	
	this.unbindAll=function(){
		$('#agentDec-search').off('click');
		$('#agentDecLockedSaveBtn').off('click');
	}
}