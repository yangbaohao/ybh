/*
 * 查看成功用户界面js
 */
var PaidAgent=function(){
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
		$('#paidAgentName').html(agentName);
	}
	
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#paidAgent-show').css('display','');
		
		$('#paidAgent-time').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#paidAgent-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#paidAgent-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#paidAgent-time').on('change',function(){
			setValueById('paidAgent-time','paidAgent-sTime','paidAgent-eTime');
		});
		
		var rd = ComboBoxSources.getRecords('userInfo'),nameArr=['全部'],arr=['全部'];
		for(var i=0;i<rd.length;i++){
			nameArr.push(rd[i].username);
			arr.push(rd[i].name);
		}
		$('#paidAgent-name').comboBox({
			theme:currentTheme,
			source:nameArr,
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#paidAgent-compName').comboBox({
			theme:currentTheme,
			source:arr,
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#viewPaidAgentRemarkWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:420,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#paidAgentRemarkCancleBtn'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				setTimeout(function(){
				},500);
			}
		});
		
		$('#paidAgent-show').addClass('hiddendiv');
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
		me.settings.source.url = url+'paid/'+agentCode;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('paidAgentGrid', me.settings.source,{
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
						{ text: '累计购买金额',dataField:'totalAmt',cellsalign:'right', cellsformat: 'c2',width:'10%'},
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
					    { text: '备注',width:'7%',
					    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
				           		var rtStr = '<div style="text-align:center">';
					            	rtStr += '<a class="hoverspan md-note-add viewPaidAgentRemark" title="查看备注"></a>';
					            	rtStr += '</div>';
				           		return rtStr;
							}
					    }
					],
		  	  pagesize: me.settings.grid.pagesize,
	    	  columnsheight: 50
		    };
			$('#paidAgentGrid').grid(grid_sets);
			
			//点击查看备注
			$('#paidAgentGrid').on('click','.viewPaidAgentRemark',function(){
				var index = $('#paidAgentGrid').jqxGrid('getselectedrowindex');
				var data=$('#paidAgentGrid').jqxGrid('getrowdata',index);

				$('#viewPaidAgentRemarkWin').jqxWindow('open',function(){
					var se={
						localdata: data.remark,
			            datatype: 'array'
				    }
					var demo = new $.jqx.dataAdapter(se);;
					//初始化Grid
					$('#paidAgentRemarkTbody').jqxGrid({
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
		grid:{element:'paidAgentGrid'},
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
    	$('#paidAgentGrid').jqxGrid('applyfilters');
    	$('#paidAgentGrid').jqxGrid('refreshfilterrow'); 
    	$('#paidAgentGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#paidAgentGrid').jqxGrid('updatebounddata', 'cells');
    	$('#paidAgentGrid').jqxGrid('clearselection');
    	$('#paidAgentGrid').jqxGrid('refreshdata');
    };
}

var PaidAgentBindModle=function(paidAgent){
	var me=this;
	
	this.search=function(){
		var st = $('#paidAgent-sTime').find('input').val(),
			et = $('#paidAgent-eTime').find('input').val(),
			username = $('#paidAgent-name').val(),
			compName = $('#paidAgent-compName').find('input').val(),
			phone = $('#paidAgent-phone').val();
		
		paidAgent.searchObj['o.createDate'].value=[];
		if(st!=''&&et!='')
			paidAgent.searchObj['o.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		paidAgent.searchObj['o.loginId'].value=[];
		if(username!='全部')
			paidAgent.searchObj['o.loginId'].value.push(username);
		
		paidAgent.searchObj['ui.name'].value=[];
		if(compName!='全部')
			paidAgent.searchObj['ui.name'].value.push(compName);
		
		paidAgent.searchObj['o.regTelephone'].value=[];
		if(phone!='')
			paidAgent.searchObj['o.regTelephone'].value.push(phone);
		
		paidAgent.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#paidAgent-search').on('click',function(){
			if($('#paidAgent-show').is(':hidden')){
				$('#paidAgent-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
//		$('#paidAgent-search').off('click');
	}
}