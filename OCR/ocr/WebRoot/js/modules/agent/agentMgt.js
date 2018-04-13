/*
 * 代理商管理界面js
 */
var AgentMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/salesagent';
	
	this.initInput=function(){
		me.initAgentPage();
		me.initSearch();
		me.initGrid(me.searchObj);
		me.agentChange();
	}
	
	this.agentChange=function(){
		
		var resource=ComboBoxSources.getRecords('allSenior');
		for(var i=0; i<resource.length; i++){
			resource[i].name_user = resource[i].userInfo.name+'('+resource[i].agentName+')';
			resource[i]._user = resource[i].agentName;
		}
		
		$('#agent-name').comboBox({
			source:resource,
			searchMode:'contains',
			displayMember:'name_user',
			valueMember:'_user',
			width:'100%'
		});
		
		$('#agentSenior').on('select',function(){
			var source=null;
			var agentType = $('#agentSenior').val();
			
			if(agentType=='small')
				source=ComboBoxSources.getRecords('notSenior');
			if(agentType=='big')
				source=ComboBoxSources.getRecords('isSenior');
			if(agentType=='all')
				source=ComboBoxSources.getRecords('allSenior');
			for(var i=0; i<source.length; i++){
				source[i].name_user = source[i].userInfo.name+'('+source[i].agentName+')';
				resource[i]._user = resource[i].agentName;
			}
			
			$('#agent-name').comboBox({
				source:source,
				width:'100%'
			});
		});
	}
	
	/*
	 * 初始化页面
	 */
	this.initAgentPage=function(){
		$('#agent-show').css('display','');
		
		$('#agentCustomer').dropDownlist({
			source:{'client':'成功客户','free':'付费客户'},
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#agentSenior').dropDownlist({
			source:{'all':'全部代理','small':'普通代理','big':'高级代理'},
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#agent-customer').comboBox({
			source:ComboBoxSources.getRecords('custService_name'),
			searchMode:'contains',
			displayMember:'name_user',
			valueMember:'username',
			width:'100%'
		});
		
		$('#agent-lebal').comboBox({
			source:ComboBoxSources.getRecords('agentLabel'),
			searchMode:'contains',
			displayMember:'lebal',
			valueMember:'lebal',
			width:'100%'
		});
		
		$('#agent-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#agent-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#agent-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#agent-time').on('change',function(){
			setValueById('agent-time','agent-sTime','agent-eTime');
		});
		
		$('#agent-head').comboBox({
			source:ComboBoxSources.getRecords('salesInfo_name'),
			searchMode:'contains',
			displayMember:'name_user',
			valueMember:'username',
			width:'100%'
		});
		
		$('#agent-show').addClass('row hiddendiv');
	}
	
	this.initColumns=function(){
		var columns=[
				{ text: '日期',width:'8%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
						return html+rowdata.userInfo.createDate.substring(0,10)+'</div>';
					}
				},
				{ text: '用户名',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html+='<a class="hoverspan viewAgent">';
						return html+rowdata.agentName+'</a></div>';
					}
				},
				{ text: '电话号码',dataField:'phone',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
						return html+rowdata.userInfo.telephone+'</a></div>';
					}
				},
				{ text: '佣金系数',width:'6%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html+=rowdata.rate*100+'%';
						return html+'</div>';
					}
				},
				{ text: '成功客户',dataField:'client',width:'6%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html+='<a class="hoverspan succeedAgent">';
						return html+rowdata.client+'</a></div>';
					}
	           },
	           { text: '付费客户', dataField:'feeClient',width:'6%',
	        	   cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html+='<a class="hoverspan payAgent">';
						return html+rowdata.feeClient+'</a></div>';
					}
	           },
	           { text: '销售负责人(姓名/用户名)',width:'11%',
	           		cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html+=rowdata.sales==undefined?'':getSalesInfoById(rowdata.sales.id).name_user;
						return html+'</div>';
					}
	           },
	           { text: '客服人员(姓名/用户名)',width:'10%',
	        	   cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html+=rowdata.customer==undefined?'':getCustomerInfoById(rowdata.customer.id).name_user;
						return html+'</div>';
					}
	           },
	           { text: '父级代理(姓名/用户名)',dataField:'parentAgentName',width:'10%',
	        	   cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html+=rowdata.parentAgentCode==undefined?'':getAgentInfoById(null,rowdata.parentAgentCode).name_user;
						return html+'</div>';
					}
	           },
	           { text: '标签<div class="userMgtDiv"><a class="hoverspan md-add addAgentLabel"></a></div>',dataField:'lebal',width:'8%'},
	           { text: '状态',width:'6%',hidden:false,
	           		cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html+=rowdata.user==undefined?'':getCodeData(rowdata.user.locked);
						return html+'</div>';
					}
	           },
	           { text: '操作',width:'9%',
	           		cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
		           		var rtStr = '<div class="text-center">';
		           			rtStr += '<a class="hoverspan md-format-list-bulleted fpSalesAgent" title="分配信息"></a>';
			            	rtStr += '<a class="hoverspan md-edit editAgentLebal" title="编辑标签"></a>';
			            	rtStr += '<a class="hoverspan md-note-add addAgentRemark" title="添加备注"></a>';
			            	rtStr += '<a class="hoverspan md-error disableAgentBtn" title="禁用"></a>';
			            	rtStr += '</div>';
		           		return rtStr;
					}
	           }
		  ];
		
		var info=getCurrentInfo();
		if(info!='sys'){
			for(var i in columns){
				columns[i].width='9.09%';
				if(columns[i].text=='状态'){
					columns[i].hidden=true;
				}
				if(columns[i].text=='操作'){
					columns[i].cellsrenderer=function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
		           			var rtStr = '<div class="text-center">';
		           			if(info!='sale'||info!='customer'){
	           					rtStr += '<a class="hoverspan md-format-list-bulleted fpSalesAgent" title="分配信息"></a>';
	           				}
			            	rtStr += '<a class="hoverspan md-edit editAgentLebal" title="编辑标签"></a>';
			            	rtStr += '<a class="hoverspan md-note-add addAgentRemark" title="添加备注"></a>';
			            	rtStr += '</div>';
		           		return rtStr;
					};
				}
			}
		}
		
		return columns;
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		},false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:me.initColumns(),
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#agentGrid').grid(grid_sets);
		
		//点击禁用
		$('#agentGrid').on('click','.disableAgentBtn',function(){
			var index = $('#agentGrid').jqxGrid('getselectedrowindex');
			var data=$('#agentGrid').jqxGrid('getrowdata',index);
			console.log(data);
			disabledUser(data.user.id,data.agentName,data.user.locked);
		});
		
		//分配销售负责人
		$('#agentGrid').on('click','.fpSalesAgent',function(){
			var index = $('#agentGrid').jqxGrid('getselectedrowindex');
			var data=$('#agentGrid').jqxGrid('getrowdata',index);
			allotSale(data);
		});
		
		//点击编辑标签
		$('#agentGrid').on('click','.editAgentLebal',function(){
			var index = $('#agentGrid').jqxGrid('getselectedrowindex');
			var data=$('#agentGrid').jqxGrid('getrowdata',index);
			addUserLabel(data.id,data.lebal,'agentLabel');
		});
		
		//点击查看备注
		$('#agentGrid').on('click','.addAgentRemark',function(){
			var index = $('#agentGrid').jqxGrid('getselectedrowindex');
			var data=$('#agentGrid').jqxGrid('getrowdata',index);
			addRemark(data.trackList,data.id,'agent');
		});
		
		//点击新增标签
		$('#agentGrid').on('click','.addAgentLabel',function(){
			addUserLabel(null,null,'agentLabel');
		});
		
		//查看代理商
		$('#agentGrid').on('click','.viewAgent',function(){
			var index = $('#agentGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#agentGrid').jqxGrid('getrowdata',index);
//				console.log(data);
				$.addTab({title:'查看代理商',url:'page/modules/agent/viewAgentMgt.html',
					pk:{id:data.id},reload:true});
			}
		});
		
		//查看成功用户
		$('#agentGrid').on('click','.succeedAgent',function(){
			var index = $('#agentGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#agentGrid').jqxGrid('getrowdata',index);
//				console.log(data);
				$.addTab({title:'查看成功用户',url:'page/modules/agent/viewSuccessAgent.html',
					pk:{agentCode:data.agentCode,id:data.id,agentName:data.agentName},reload:true});
			}
		});
		
		//查看付费用户
		$('#agentGrid').on('click','.payAgent',function(){
			var index = $('#agentGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#agentGrid').jqxGrid('getrowdata',index);
//				console.log(data);
				$.addTab({title:'查看付费用户',url:'page/modules/agent/viewPaidAgent.html',
					pk:{agentCode:data.agentCode,id:data.id,agentName:data.agentName},reload:true});
			}
		});
	}
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'userGrid'},
		ajax:{url:url},
	};
		
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'userInfo.createDate':{value:[],action:'between'},	
			agentName:{value:[],action:'like'},
			lebal:{value:[],action:'like'},
			'customer.username':{value:[],action:'like'},
			'userInfo.telephone':{value:[],action:'like'},
			'sales.username':{value:[],action:'like'},
			'o.client':{value:[],action:'between'},
			feeClient:{value:[],action:'between'},
			senior:{value:[],action:'eq'}
		};
		
		if(_global_settings.owner.roleName=='salesStaff'){
			me.searchObj['sales.id']={value:[''+_global_settings.owner.userid+''],action:'eq'};
		} 
	}
	
	this.searchDataInfo = function(){
    	$('#agentGrid').jqxGrid('applyfilters');
    	$('#agentGrid').jqxGrid('refreshfilterrow'); 
    	$('#agentGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentGrid').jqxGrid('updatebounddata', 'cells');
    	$('#agentGrid').jqxGrid('clearselection');
    	$('#agentGrid').jqxGrid('refreshdata');
    };
}

var AgentBindModle=function(agentMgt){
	var me=this;
	
	this.search=function(){
		var agentName = $('#agent-name').val(),
			username = $('#agent-head').val(),
			custSer = $('#agent-customer').val(),
			st = $('#agent-sTime').val(),
			et = $('#agent-eTime').val(),
			lebal = $('#agent-lebal').find('input').val(),
			phone = $('#agent-phone').val(),
			sc = $('#agent-sc').val(),
			ec = $('#agent-ec').val();
		
		var custSel = $('#agentCustomer').val();
		
		agentMgt.searchObj['o.client'].value=[];
		agentMgt.searchObj.feeClient.value=[];
		
		if(custSel=='client'){
			if(sc!=''&&ec!=''){
				agentMgt.searchObj['o.client'].value.push(sc,ec);	
			}
		} 
		
		if(custSel=='free'){
			if(sc!=''&&ec!=''){
				agentMgt.searchObj.feeClient.value.push(sc,ec);	
			}
		}
			
		agentMgt.searchObj['userInfo.telephone'].value=[];
		if(phone!='')
			agentMgt.searchObj['userInfo.telephone'].value.push(phone);
		
		agentMgt.searchObj.lebal.value=[];
		if(lebal!='')
			agentMgt.searchObj.lebal.value.push(lebal);
		
		agentMgt.searchObj['customer.username'].value=[];
		if(custSer!='')
			agentMgt.searchObj['customer.username'].value.push(custSer);
		
		var sen = $('#agentSenior').val();
		agentMgt.searchObj.senior.value=[];
		if(sen=='small')
			agentMgt.searchObj.senior.value.push('N');
		if(sen=='big')
			agentMgt.searchObj.senior.value.push('Y');
		
		agentMgt.searchObj.agentName.value=[];
		if(agentName!='')
			agentMgt.searchObj.agentName.value.push(agentName);
			
		agentMgt.searchObj['userInfo.createDate'].value=[];
		if(st!=''&&et!='')
			agentMgt.searchObj['userInfo.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et==='')
			agentMgt.searchObj['userInfo.createDate'].value.push(st+' '+'00:00:00',getNowFormatDate()+' '+'23:59:59');
		
		if(st===''&&et!='')
			agentMgt.searchObj['userInfo.createDate'].value.push('2015-01-01'+' '+'00:00:00',et+' '+'23:59:59');
		
		agentMgt.searchObj['sales.username'].value=[];
		if(username!='')
			agentMgt.searchObj['sales.username'].value.push(username);
		
		
		agentMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#agent-search').on('click',function(){
			if($('#agent-show').is(':hidden')){
				$('#agent-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
		
		//点击新增
		$('#addagent-btn').on('click',function(){
			$.addTab({title:'新增代理商',url:'page/modules/agent/addAgentMgt.html',reload:true});
		});
	}
	
	this.unbindAll=function(){
		$('#agent-search').off('click');
		$('#fpSalesAgentBtn').off('click');
	}
}