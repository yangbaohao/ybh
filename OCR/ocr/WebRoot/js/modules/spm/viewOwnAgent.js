/*
 * 查看拥有代理商界面js
 */
var ViewOwnAgent=function(){
	var me=this;
	var agentName = null;
	var id = null;
	var url=_global_settings.service.url+'/salesagent/have/';
	var currentRoleName = _global_settings.owner.roleName;
	var beginDate= null;
	var endDate = null;
	this.debug=false;
	this.userData=null;
	this.initInput=function(){
		id = $.pk.id;
		agentName = $.pk.agentName;
		beginDate = $.pk.beginDate;
		endDate = $.pk.endDate;
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
		$('#viewOwnAgentName').html(agentName);
	}
	
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#viewOwnAgent-show').css('display','');
		
		$('#viewOwnAgent-time').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#viewOwnAgent-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#viewOwnAgent-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#viewOwnAgent-time').on('change',function(){
			setValueById('viewOwnAgent-time','viewOwnAgent-sTime','viewOwnAgent-eTime');
		});
		
		var rd = ComboBoxSources.getRecords('userInfo'),nameArr=['全部'];
		for(var i=0;i<rd.length;i++){
			nameArr.push(rd[i].username);
		}
		$('#viewOwnAgent-name').comboBox({
			theme:currentTheme,
			source:nameArr,
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#viewOwnAgentRemarkWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:420,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#ownAgentRemarkCancleBtn'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				setTimeout(function(){
				},500);
			}
		});
		
		$('#viewOwnAgent-show').addClass('hiddendiv');
	}
	
	//获取客服
	this.getCustService=function(custCode){
		var rd = ComboBoxSources.getRecords('custService');
		for(i=0;i<rd.length;i++){
			if(custCode==rd[i].employeeCode){
				return rd[i];
			}
		}
		if(!custCode){
			return '';
		}
	}
	
	//获取客服
	this.getCustomer=function(id){
		var records = ComboBoxSources.getRecords('custService');
		for(var i=0;i<records.length;i++){
			if(records[i].id==id){
				return records[i];
			}
		}
		if(!id){
			return '';
		}
			
	}
	
	this.initGrid=function(){
		/**
		 * me.settings.source.url
		 * 
		 * 点击查看三个详情页，需要注意分页接口处的四个点,就是url后面四个参数。
		 * 第一个参数。0/1,如果为销售传0，客服传1
		 * 第二个参数，success/paid/salesagent三个类型
		 * 第三个参数，id是当前所属销售负责人的id
		 * 第四个参数，query里面的o.createDate,需要把分页检索中的beginDate和endDate传到接口上来,如果没有日期，则是放进日期的最大最小值
		 * 
		 * */
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'0/'+id+'/'+setUrlCondition({
			beginDate: beginDate,
			endDate: endDate,
			key: 'sa.userInfo.createDate'
		});
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewOwnAgentGrid', me.settings.source,{
			beforeLoadComplete:function(records){
			}
		}, me.debug);
		var search1={};
		
		var grid_sets = {
				columnsresize: false,
				autorowheight: true,
//			    autoheight: true,
		  	    source:demoAdapter,
			    rendergridrows: function(){
	                return demoAdapter.recordids;
	            }
	    	   ,columns:[
						{ text: '日期',width:'12%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
								return html+rowdata.userInfo.createDate.substring(0,10)+'</div>';
							}
						},
						{ text: '用户名',width:'14%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-left:2px;padding-top:6px">';
								return html+rowdata.agentName+'</div>';
							}
						},
						{ text: '电话号码',width:'12%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-left:2px;padding-top:6px">';
								return html+rowdata.userInfo.telephone+'</div>';
							}
						},
						{ text: '佣金系数',width:'12%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
									html+=rowdata.rate*100+'%';
								return html+'</div>';
							}
						},
						{ text: '客服人员(姓名/用户名)',width:'12%',
			        	   cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
									html+=rowdata.customer==undefined?'':(me.getCustomer(rowdata.customer.id)==undefined?'':
										me.getCustomer(rowdata.customer.id).name+'('+me.getCustomer(rowdata.customer.id).username+')');
								return html+'</div>';
							}
			            },
			            { text: '父级代理(姓名/用户名)',width:'12%',
			            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
		            			var html = '<div style="padding-top:6px">';
		            				html+=rowdata.parentAgentName==undefined?'':getAgentInfoByName(rowdata.parentAgentName)==undefined?'':
		            					getAgentInfoByName(rowdata.parentAgentName).name+'('+getAgentInfoByName(rowdata.parentAgentName).agentName+')';
		            			return html+'</div>';
							}
			            },
			            { text: '标签',dataField:'lebal',width:'14%'},
					    { text: '备注',width:'12%',
					    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
					    		me.userData = rowdata;
					    		var rtStr = '<div style="text-align:center">';
					            	rtStr += '<a class="hoverspan md-note-add viewOwnAgentRemark" title="查看备注"></a>';
					            	rtStr += '</div>';
				           		return rtStr;
							}
					    }
					],
		  	  pagesize: me.settings.grid.pagesize,
	    	  columnsheight: 50
		    };
			$('#viewOwnAgentGrid').grid(grid_sets);
			

			//点击查看备注
			$('#viewOwnAgentGrid').on('click','.viewOwnAgentRemark',function(){
				var index = $('#viewOwnAgentGrid').jqxGrid('getselectedrowindex');
				var data=$('#viewOwnAgentGrid').jqxGrid('getrowdata',index);
				
				$('#viewOwnAgentRemarkWin').jqxWindow('open',function(){
					var se={
						localdata: data.remark,
			            datatype: 'array'
				    }
					var demo = new $.jqx.dataAdapter(se);;
					//初始化Grid
					$('#ownAgentRemarkTbody').jqxGrid({
			            source: demo,
			            width:'100%',
			            height:160,
			            autorowheight: true,
					    autoheight: true,
			            pageable:false,
//			            selectionmode:'checkbox',
			            columns: [
			              { text: '更新时间',dataField:'createDate',width:'40%'},
			              { text: '备注',dataField:'remark',width:'60%'},
			            ]
			        });
				});
			});
	}
	
	this.settings = {  
		source:{
	        data:me.searchObj,
	    },
		grid:{element:'viewOwnAgentGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'sa.userInfo.createDate':{value:[],action:'between'},
			agentName:{value:[],action:'like'},
			'userInfo.telephone':{value:[],action:'like'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#viewOwnAgentGrid').jqxGrid('applyfilters');
    	$('#viewOwnAgentGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewOwnAgentGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewOwnAgentGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewOwnAgentGrid').jqxGrid('clearselection');
    	$('#viewOwnAgentGrid').jqxGrid('refreshdata');
    };
}

var ViewOwnAgentBindModle=function(viewOwnAgent){
	var me=this;
	
	this.search=function(){
		var st = $('#viewOwnAgent-sTime').find('input').val(),
			et = $('#viewOwnAgent-eTime').find('input').val(),
			username = $('#viewOwnAgent-name').find('input').val(),
			phone = $('#viewOwnAgent-phone').val();
		
		viewOwnAgent.searchObj['userInfo.createDate'].value=[];
		if(st!=''&&et!='')
			viewOwnAgent.searchObj['userInfo.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et==='')
			viewOwnAgent.searchObj['userInfo.createDate'].value.push(st+' '+'00:00:00');
			viewOwnAgent.searchObj['userInfo.createDate'].action='ge';
		
		if(st===''&&et!='')
			viewOwnAgent.searchObj['userInfo.createDate'].value.push(et+' '+'00:00:00');
			viewOwnAgent.searchObj['userInfo.createDate'].action='le';
		
		viewOwnAgent.searchObj['agentName'].value=[];
		if(username !='全部')
			viewOwnAgent.searchObj['agentName'].value.push(username);
		
		viewOwnAgent.searchObj['userInfo.telephone'].value=[];
		if(phone!='')
			viewOwnAgent.searchObj['userInfo.telephone'].value.push(phone);
		
		viewOwnAgent.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewOwnAgent-search').on('click',function(){
			if($('#viewOwnAgent-show').is(':hidden')){
				$('#viewOwnAgent-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#viewOwnAgent-search').off('click');
	}
}