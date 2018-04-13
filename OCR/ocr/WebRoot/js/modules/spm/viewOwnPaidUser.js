/*
 * 查看付费用户界面js
 */
var ViewOwnPaidUser=function(){
	var me=this;
	var agentName = null;
	var id = null;
	var employeeCode = null;
	var url=_global_settings.service.url+'/owner/ownerdetails/';
	var currentRoleName = _global_settings.owner.roleName;
	var beginDate= null;
	var endDate = null;
	this.debug=false;
	this.userData=null;
	this.initInput=function(){
		id = $.pk.id;
		agentName = $.pk.agentName;
		employeeCode = $.pk.employeeCode;
		beginDate = $.pk.beginDate;
		endDate = $.pk.endDate;
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
		$("#viewOwnPaidUserName").html(agentName)
	}
	
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#viewOwnPaidUser-show').css('display','');
		
		$('#viewOwnPaidUser-time').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#viewOwnPaidUser-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#viewOwnPaidUser-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#viewOwnPaidUser-time').on('change',function(){
			setValueById('viewOwnPaidUser-time','viewOwnPaidUser-sTime','viewOwnPaidUser-eTime');
		});
		
		var rd = ComboBoxSources.getRecords('userInfo'),nameArr=['全部'];
		for(var i=0;i<rd.length;i++){
			nameArr.push(rd[i].username);
		}
		$('#viewOwnPaidUser-name').comboBox({
			theme:currentTheme,
			source:nameArr,
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#viewOwnPaidUserRemarkWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:420,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#ownPaidUserRemarkCancleBtn'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				setTimeout(function(){
				},500);
			}
		});
		
		$('#viewOwnPaidUser-show').addClass('hiddendiv');
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
		 * 点击查看三个详情页，需要注意分页接口处的四个点,就是url后面四个参数。
		 * 第一个参数。0/1,如果为销售传0，客服传1
		 * 第二个参数，success/paid/salesagent三个类型
		 * 第三个参数，id是当前所属销售负责人的id
		 * 第四个参数，query里面的o.createDate,需要把分页检索中的beginDate和endDate传到接口上来,如果没有日期，则是放进日期的最大最小值
		 * 
		 * */
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'0/paid/'+id+'/'+setUrlCondition({
			beginDate: beginDate,
			endDate: endDate,
			key: 'o.createDate'
		});
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewOwnPaidUserGrid', me.settings.source,{
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
					            	rtStr += '<a class="hoverspan md-note-add viewOwnPaidUserRemark" title="查看备注"></a>';
					            	rtStr += '</div>';
				           		return rtStr;
							}
					    }
					],
		  	  pagesize: me.settings.grid.pagesize,
	    	  columnsheight: 50
		    };
			$('#viewOwnPaidUserGrid').grid(grid_sets);
			

			//点击查看备注
			$('#viewOwnPaidUserGrid').on('click','.viewOwnPaidUserRemark',function(){
				var index = $('#viewOwnPaidUserGrid').jqxGrid('getselectedrowindex');
				var data=$('#viewOwnPaidUserGrid').jqxGrid('getrowdata',index);
				
				$('#viewOwnPaidUserRemarkWin').jqxWindow('open',function(){
					var se={
						localdata: data.remark,
			            datatype: 'array'
				    }
					var demo = new $.jqx.dataAdapter(se);;
					//初始化Grid
					$('#ownPaidUserRemarkTbody').jqxGrid({
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
		grid:{element:'viewOwnPaidUserGrid'},
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
    	$('#viewOwnPaidUserGrid').jqxGrid('applyfilters');
    	$('#viewOwnPaidUserGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewOwnPaidUserGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewOwnPaidUserGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewOwnPaidUserGrid').jqxGrid('clearselection');
    	$('#viewOwnPaidUserGrid').jqxGrid('refreshdata');
    };
}

var ViewOwnPaidUserBindModle=function(viewOwnPaidUser){
	var me=this;
	
	this.search=function(){
		var st = $('#viewOwnPaidUser-sTime').find('input').val(),
			et = $('#viewOwnPaidUser-eTime').find('input').val(),
			username = $('#viewOwnPaidUser-name').val(),
			phone = $('#viewOwnPaidUser-phone').val();
		
		viewOwnPaidUser.searchObj['o.createDate'].value=[];
		if(st!=''&&et!='')
			viewOwnPaidUser.searchObj['o.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et==='')
			viewOwnPaidUser.searchObj['o.createDate'].value.push(st+' '+'00:00:00');
			viewOwnPaidUser.searchObj['o.createDate'].action='ge';
		
		if(st===''&&et!='')
			viewOwnPaidUser.searchObj['o.createDate'].value.push(et+' '+'00:00:00');
			viewOwnPaidUser.searchObj['o.createDate'].action='le';
		
		viewOwnPaidUser.searchObj['o.loginId'].value=[];
		if(username!='全部')
			viewOwnPaidUser.searchObj['o.loginId'].value.push(username);
		
		viewOwnPaidUser.searchObj['o.regTelephone'].value=[];
		if(phone!='')
			viewOwnPaidUser.searchObj['o.regTelephone'].value.push(phone);
		
		viewOwnPaidUser.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewOwnPaidUser-search').on('click',function(){
			if($('#viewOwnPaidUser-show').is(':hidden')){
				$('#viewOwnPaidUser-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
//		$('#viewOwnPaidUser-search').off('click');
	}
}