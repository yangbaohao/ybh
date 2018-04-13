/*
 * 查看成功用户界面js
 */
var SuccessAgent=function(){
	var me=this;
	var agentCode = null;
	var agentName = null;
	var id = null;
	var url=_global_settings.service.url+'/salesagent/ownerdetails/';
	this.debug=false;
	this.userData=null;
	this.initInput=function(){
		agentCode=$.pk.agentCode;
		id = $.pk.id;
		agentName = $.pk.agentName;
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
		$('#successAgentName').html(agentName);
	}
	
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#successAgent-show').css('display','');
		
		$('#successAgent-time').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#successAgent-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#successAgent-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#successAgent-time').on('change',function(){
			setValueById('successAgent-time','successAgent-sTime','successAgent-eTime');
		});
		
		var rd = ComboBoxSources.getRecords('userInfo'),nameArr=['全部'],arr=['全部'];
		for(var i=0;i<rd.length;i++){
			nameArr.push(rd[i].username);
			arr.push(rd[i].name);
		}
		$('#successAgent-name').comboBox({
			theme:currentTheme,
			source:nameArr,
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#successAgent-compName').comboBox({
			theme:currentTheme,
			source:arr,
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#viewSuccessAgentRemarkWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:420,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#SuccessAgentRemarkCancleBtn'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				setTimeout(function(){
				},500);
			}
		});
		
		$('#successAgent-show').addClass('hiddendiv');
	}
	
	//获取销售负责人
	this.getSalesInfo=function(employeeCode){
		var rd = ComboBoxSources.getRecords('salesInfo');
		for(i=0;i<rd.length;i++){
			if(employeeCode==rd[i].employeeCode){
				return rd[i];
			}
		}
		if(!employeeCode){
			return '';
		}
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
	
	this.initGrid=function(){
		
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'success/'+agentCode;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('successAgentGrid', me.settings.source,{
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
	                return demoAdapter.records;
	            }
	    	   ,columns:[
						{ text: '日期',dataField:'createDate',width:'10%'},
						{ text: '用户名',dataField:'loginId',width:'15%'},
						{ text: '电话号码',dataField:'regTelephone',width:'10%'},
						{ text: '公司名称',dataField:'name',width:'15%'},
						{ text: '累计购买金额',dataField:'totalAmt',cellsalign:'right', cellsformat: 'c2',width:'9%'},
					    { text: '销售负责人(姓名/用户名)',width:'12%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';;
								//获取销售负责人
								var getSales=function(username){
									var rd = ComboBoxSources.getRecords('salesInfo');
									for(i=0;i<rd.length;i++){
										if(username==rd[i].username){
											return rd[i];
										}
									}
									if(!username){
										return '';
									}
								}
								if(getSales(rowdata.xs)!=undefined && getSales(rowdata.xs)!='' && getSales(rowdata.xs)!=null){
									html += getSales(rowdata.xs).userInfo.name+'('+getSales(rowdata.xs).username+')';
					    		}else{
					    			html+=rowdata.xs;
					    		}
								return html+'</div>';
							}
					    },
					    { text: '客服人员(姓名/用户名)',width:'12%',
					    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
					    		var html = '<div class="agrid">';;
								//获取客服
								var getCust=function(username){
									var rd = ComboBoxSources.getRecords('custService');
									for(i=0;i<rd.length;i++){
										if(username==rd[i].username){
											return rd[i];
										}
									}
									if(!username){
										return '';
									}
								}
								if(getCust(rowdata.kf)!=undefined && getCust(rowdata.kf)!='' && getCust(rowdata.kf)!=null){
									html += getCust(rowdata.kf).name+'('+getCust(rowdata.kf).username+')';
					    		}else{
					    			html+=rowdata.kf;
					    		}
								return html+'</div>';	
					    	}
					    },
					    { text: '标签',width:'9%',dataField:'lebal'},
					    { text: '备注',width:'8%',
					    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
					    		userData = rowdata;
					    		var rtStr = '<div style="text-align:center">';
					            	rtStr += '<a class="hoverspan md-note-add viewSuccessAgentRemark" title="查看备注"></a>';
					            	rtStr += '</div>';
				           		return rtStr;
							}
					    }
					],
		  	  pagesize: me.settings.grid.pagesize,
	    	  columnsheight: 50
		    };
			$('#successAgentGrid').grid(grid_sets);
			
			//点击查看备注
			$('#successAgentGrid').on('click','.viewSuccessAgentRemark',function(){
				var index = $('#successAgentGrid').jqxGrid('getselectedrowindex');
				var data=$('#successAgentGrid').jqxGrid('getrowdata',index);
				
				$('#viewSuccessAgentRemarkWin').jqxWindow('open',function(){
					var se={
						localdata: data.remark,
			            datatype: 'array'
				    }
					var demo = new $.jqx.dataAdapter(se);;
					//初始化Grid
					$('#SuccessAgentRemarkTbody').jqxGrid({
			            source: demo,
			            width:'100%',
			            height:160,
			            autorowheight: true,
					    autoheight: true,
			            pageable:false,
//			            selectionmode:'checkbox',
			            columns: [
			              { text: '更新时间',dataField:'createDate',width:'40%' },
			              { text: '备注',dataField:'remark',width:'60%' },
			            ]
			        });
				});
			});
	}
	
	this.settings = {  
		source:{
	        data:me.searchObj,
	    },
		grid:{element:'successAgentGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'o.createDate':{value:[],action:'between'},
			'o.loginId':{value:[],action:'like'},
			'o.regTelephone':{value:[],action:'like'},
			'ui.name':{value:[],action:'like'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#successAgentGrid').jqxGrid('applyfilters');
    	$('#successAgentGrid').jqxGrid('refreshfilterrow'); 
    	$('#successAgentGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#successAgentGrid').jqxGrid('updatebounddata', 'cells');
    	$('#successAgentGrid').jqxGrid('clearselection');
    	$('#successAgentGrid').jqxGrid('refreshdata');
    };
}

var SuccessAgentBindModle=function(successAgent){
	var me=this;
	
	this.search=function(){
		var st = $('#successAgent-sTime').find('input').val(),
			et = $('#successAgent-eTime').find('input').val(),
			username = $('#successAgent-name').val(),
			compName = $('#successAgent-compName').find('input').val(),
			phone = $('#successAgent-phone').val();
		
		successAgent.searchObj['o.createDate'].value=[];
		if(st!=''&&et!='')
			successAgent.searchObj['o.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		successAgent.searchObj['o.loginId'].value=[];
		if(username!='全部')
			successAgent.searchObj['o.loginId'].value.push(username);
		
		successAgent.searchObj['ui.name'].value=[];
		if(compName!='全部')
			successAgent.searchObj['ui.name'].value.push(compName);
		
		successAgent.searchObj['o.regTelephone'].value=[];
		if(phone!='')
			successAgent.searchObj['o.regTelephone'].value.push(phone);
		
		successAgent.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#successAgent-search').on('click',function(){
			if($('#successAgent-show').is(':hidden')){
				$('#successAgent-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
//		$('#successAgent-search').off('click');
	}
}