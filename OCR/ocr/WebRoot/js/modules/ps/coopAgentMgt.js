/*
*合作商管理界面js
*/

var CpaMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user';
	
	this.initInput=function(){
		me.initPage();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		'u.createDate':{value:[],action:'between'},
		'u.employeeCode':{value:[],action:'like'},
		'u.username':{value:[],action:'like'},
		'ui.name':{value:[],action:'like'},
		'ui.telephone':{value:[],action:'like'}
	}
	
	this.initPage=function(){
		$('#cpa-show').css('display','');
		
		$('#cpa-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#cpa-sTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		$('#cpa-eTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		
		$('#cpa-time').on('change',function(){
			setValueById('cpa-time','cpa-sTime','cpa-eTime');
		});
		
		$('#cpa-show').addClass('hiddendiv');
	}
	
	//获取对接人
	var getDock=function(id){
		var rd=ComboBoxSources.getRecords('docker');
		for(var i=0;i<rd.length;i++){
			if(rd[i].id==id){
				return rd[i];
			}
		}
		
		if(!id){
			return '';
		}
	}
	
	//获取对接人
	var getDockByName=function(username){
		var rd=ComboBoxSources.getRecords('docker');
		for(var i=0;i<rd.length;i++){
			if(rd[i].username==username){
				return rd[i];
			}
		}
		
		if(!username){
			return '';
		}
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('coopAgentGrid', me.settings.source,{
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
				{ text: '日期',width:'14%',
	    		    cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            		return html+rowdata.createDate.substring(0,10)+'</div>';
					}
				},
				{ text: '合作商编码',dataField:'employeeCode',width:'14%'},
				{ text: '用户名',dataField:'username',width:'14%'},
				{ text: '公司名称',width:'14%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            		return html+rowdata.userInfo.name+'</div>';
					}
				},
				{ text: '电话号码',width:'14%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            		return html+rowdata.userInfo.telephone+'</div>';
					}
				},
				{ text: '成功客户',width:'15%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            			html+='<a class="hoverspan viewClient">'+rowdata.client+'</a>';
	            		return html+'</div>';
					}
				},
  	            { text: '对接人',width:'15%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            		return html+getDockByName(rowdata.docking.username).userInfo.name+'('+getDockByName(rowdata.docking.username).username+')'+'</div>';
					}
  	            }
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#coopAgentGrid').grid(grid_sets);
		
		//点击成功客户
		$('#coopAgentGrid').on('click','.viewClient',function(){
			var index=$('#coopAgentGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#coopAgentGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'查看详情',pk:{data:data},url:'page/modules/ps/viewClient.html',reload:true});
			}
		});
		
	}
	
	this.settings = {  
		source:{
	        url: url+'/partner',
	        data:me.searchObj
	    },
		grid:{element:'coopAgentGrid'},
		ajax:{url:url}
	};
	
	this.searchDataInfo = function(){
    	$('#coopAgentGrid').jqxGrid('applyfilters');
    	$('#coopAgentGrid').jqxGrid('refreshfilterrow'); 
    	$('#coopAgentGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#coopAgentGrid').jqxGrid('updatebounddata', 'cells');
    	$('#coopAgentGrid').jqxGrid('clearselection');
    	$('#coopAgentGrid').jqxGrid('refreshdata');
    };
}

var CpaBindModle=function(cpaMgt){
	var me=this;
	var url=_global_settings.service.url+'/applyloan';
	
	this.search=function(){
		var st=$('#cpa-sTime').val(),
			et=$('#cpa-eTime').val(),
			code=$('#cpa-code').val(),
			username=$('#cpa-user').val(),
			company=$('#cpa-company').val(),
			phone=$('#cpa-phone').val();
		
		cpaMgt.searchObj['u.createDate'].value=[];
		if(st!=''&et!='')
			cpaMgt.searchObj['u.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&et==='')
			cpaMgt.searchObj['u.createDate'].value.push(st+' '+'00:00:00',getNowFormatDate()+' '+'23:59:59');
		
		if(st===''&et!='')
			cpaMgt.searchObj['u.createDate'].value.push('2015-01-01'+' '+'00:00:00',et+' '+'23:59:59');
		
		cpaMgt.searchObj['u.employeeCode'].value=[];
		if(code!='')
			cpaMgt.searchObj['u.employeeCode'].value.push(code);
		
		cpaMgt.searchObj['u.username'].value=[];
		if(username!='')
			cpaMgt.searchObj['u.username'].value.push(username);
		
		cpaMgt.searchObj['ui.name'].value=[];
		if(company!='')
			cpaMgt.searchObj['ui.name'].value.push(company);
		
		cpaMgt.searchObj['ui.telephone'].value=[];
		if(phone!='')
			cpaMgt.searchObj['ui.telephone'].value.push(phone);
		
		cpaMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#cpa-search').on('click',function(){
			if($('#cpa-show').is(':hidden'))
				$('#cpa-show').slideDown('slow');
			else 
				me.search();
		});
		
		//点击新增
		$('#cpa-add').on('click',function(){
			$.addTab({title:'新增合作商',url:'page/modules/ps/addCoopAgent.html',reload:true});
		});
		
		hiddenAclick();
		
	}
	
	this.unbindAll=function(){
		$('#cpa-search').off('click');
		$('#cpa-add').off('click');
	}
}