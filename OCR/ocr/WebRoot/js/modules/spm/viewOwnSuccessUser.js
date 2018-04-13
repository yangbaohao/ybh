/*
 * 查看成功用户界面js
 */
var ViewOwnSuccessUser=function(){
	var me=this;
	var ids = null;
	var employeeCode = null;
	var agentName = null;
	var id = null;
	var url=_global_settings.service.url+'/owner/ownerdetails/';
	var currentRoleName = _global_settings.owner.roleName;
	var beginDate= null;
	var endDate = null;
	this.debug=false;
	this.userData=null;
	this.initInput=function(){
		id=$.pk.id;
		beginDate = $.pk.beginDate;
		endDate = $.pk.endDate;
		employeeCode = $.pk.employeeCode;
		agentName=$.pk.agentName;
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
		$('#viewOwnSuccessUserName').html(agentName);
	}
	
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#viewOwnSuccessUser-show').css('display','');
		
		$('#viewOwnSuccessUser-time').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#viewOwnSuccessUser-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#viewOwnSuccessUser-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#viewOwnSuccessUser-time').on('change',function(){
			setValueById('viewOwnSuccessUser-time','viewOwnSuccessUser-sTime','viewOwnSuccessUser-eTime');
		});
		
		var rd = ComboBoxSources.getRecords('userInfo'),nameArr=['全部'];
		for(var i=0;i<rd.length;i++){
			nameArr.push(rd[i].username);
		}
		$('#viewOwnSuccessUser-name').comboBox({
			theme:currentTheme,
			source:nameArr,
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#viewOwnSuccessUserRemarkWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:420,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#ownSuccessUserRemarkCancleBtn'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				setTimeout(function(){
				},500);
			}
		});
		
		$('#viewOwnSuccessUser-show').addClass('hiddendiv');
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
		/**
		 * me.settings.source.url
		 * 
		 * 前台接口文档说明
		 * 
		 * 点击查看三个详情页，需要注意分页接口处的四个点,就是url后面四个参数。
		 * 第一个参数。0/1,如果为销售传0，客服传1
		 * 第二个参数，success/paid/salesagent三个类型
		 * 第三个参数，id是当前所属销售负责人的id
		 * 第四个参数，query里面的o.createDate,需要把分页检索中的beginDate和endDate传到接口上来,如果没有日期，则是放进日期的最大最小值
		 * 
		 * */
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'0/success/'+id+'/'+setUrlCondition({
			beginDate: beginDate,
			endDate: endDate,
			key: 'o.createDate'
		});
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewOwnSuccessUserGrid', me.settings.source,{
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
						{ text: '日期',dataField:'createDate',width:'12%'},
						{ text: '用户名',dataField:'loginId',width:'15%'},
						{ text: '电话号码',dataField:'regTelephone',width:'10%'},
						{ text: '公司名称',dataField:'name',width:'18%'},
						{ text: '累计购买金额',dataField:'totalAmt',cellsalign:'right', cellsformat: 'c2',width:'10%'},
						{ text: '客服人员(姓名/用户名)',width:'12%',
				        	   cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
									var html = '<div style="padding-top:6px">';
										html+=rowdata.kf==''?'':(getCustomerInfoByName(rowdata.kf)==undefined?'':
											getCustomerInfoByName(rowdata.kf).name+'('+getCustomerInfoByName(rowdata.kf).username+')');
									return html+'</div>';
								}
				            },
					    { text: '标签',width:'15%',dataField:'lebal'},
					    { text: '备注',width:'8%',
					    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
					    		userData = rowdata;
					    		var rtStr = '<div style="text-align:center">';
					            	rtStr += '<a class="hoverspan md-note-add viewOwnSuccessRemark" title="查看备注"></a>';
					            	rtStr += '</div>';
				           		return rtStr;
							}
					    }
					],
		  	  pagesize: me.settings.grid.pagesize,
	    	  columnsheight: 50
		    };
			$('#viewOwnSuccessUserGrid').grid(grid_sets);
			

			//点击查看备注
			$('#viewOwnSuccessUserGrid').on('click','.viewOwnSuccessRemark',function(){
				var index = $('#viewOwnSuccessUserGrid').jqxGrid('getselectedrowindex');
				var data=$('#viewOwnSuccessUserGrid').jqxGrid('getrowdata',index);
				
				$('#viewOwnSuccessUserRemarkWin').jqxWindow('open',function(){
					var se={
						localdata: data.remark,
			            datatype: 'array'
				    }
					var demo = new $.jqx.dataAdapter(se);;
					//初始化Grid
					$('#ownSuccessUserRemarkTbody').jqxGrid({
			            source: demo,
			            width:'100%',
			            height:160,
			            autorowheight: true,
					    autoheight: true,
			            pageable:false,
//			            selectionmode:'checkbox',
			            columns: [
			              { text: '更新时间',dataField:'createDate',width:'40%',height:'auto' },
			              { text: '备注',dataField:'remark',width:'60%',height:'auto' },
			            ]
			        });
				});
			});
	}
	
	this.settings = {  
		source:{
	        data:me.searchObj,
	    },
		grid:{element:'viewOwnSuccessUserGrid'},
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
    	$('#viewOwnSuccessUserGrid').jqxGrid('applyfilters');
    	$('#viewOwnSuccessUserGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewOwnSuccessUserGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewOwnSuccessUserGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewOwnSuccessUserGrid').jqxGrid('clearselection');
    	$('#viewOwnSuccessUserGrid').jqxGrid('refreshdata');
    };
}

var ViewOwnSuccessUserBindModle=function(viewOwnSuccessUser){
	var me=this;
	
	this.search=function(bool){
		var st = $('#viewOwnSuccessUser-sTime').find('input').val(),
			et = $('#viewOwnSuccessUser-eTime').find('input').val(),
			username = $('#viewOwnSuccessUser-name').val(),
			phone = $('#viewOwnSuccessUser-phone').val();
		
		viewOwnSuccessUser.searchObj['o.createDate'].value=[];
		if(st!=''&&et!='')
			viewOwnSuccessUser.searchObj['o.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et==='')
			viewOwnSuccessUser.searchObj['o.createDate'].value.push(st+' '+'00:00:00');
			viewOwnSuccessUser.searchObj['o.createDate'].action='ge';
		
		if(st===''&&et!='')
			viewOwnSuccessUser.searchObj['o.createDate'].value.push(et+' '+'23:59:59');
			viewOwnSuccessUser.searchObj['o.createDate'].action='le';
		
		viewOwnSuccessUser.searchObj['o.loginId'].value=[];
		if(username!='全部')
			viewOwnSuccessUser.searchObj['o.loginId'].value.push(username);
		
		viewOwnSuccessUser.searchObj['o.regTelephone'].value=[];
		if(phone!='')
			viewOwnSuccessUser.searchObj['o.regTelephone'].value.push(phone);
		
		if(bool === true){
			return viewOwnSuccessUser.searchObj;
		}
		viewOwnSuccessUser.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewOwnSuccessUser-search').on('click',function(){
			if($('#viewOwnSuccessUser-show').is(':hidden')){
				$('#viewOwnSuccessUser-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
//		$('#viewOwnSuccessUser-search').off('click');
	}
}