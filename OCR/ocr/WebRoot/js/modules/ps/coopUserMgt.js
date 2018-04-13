/*
*合作用户管理界面js
*/

var CpuMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user/search';
	
	this.initInput=function(){
		me.initPage();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		'owe.createDate':{value:[],action:'between'},
		'owe.regTelephone':{value:[],action:'like'},
		'owe.loginId':{value:[],action:'like'},
		'enter.name':{value:[],action:'like'},
		'enterpriseInfo.name':{value:[],action:'like'}
	}
	
	this.initPage=function(){
		$('#cpu-show').css('display','');
		
		$('#cpu-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#cpu-sTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		$('#cpu-eTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		
		$('#cpu-time').on('change',function(){
			setValueById('cpu-time','cpu-sTime','cpu-eTime');
		});
		
		$('#cpu-show').addClass('hiddendiv');
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('coopUserGrid', me.settings.source,{
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
				{ text: '注册日期',width:'16.5%',
	    		    cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            		return html+rowdata.enrtyDate.substring(0,10)+'</div>';
					}
				},
				{ text: '用户名',width:'16.5%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            			html+='<a class="hoverspan viewCpu">'+rowdata.username+'</a>';
	            		return html+'</div>';
					}
				},
				{ text: '电话号码',dataField:'telephone',width:'16.5%'},
				{ text: '公司名称',dataField:'name',width:'16.5%'},
				{ text: '合作商编码',dataField:'partnerCode',width:'17%'},
  	            { text: '合作商名称',dataField:'partnarName',width:'17%'}
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#coopUserGrid').grid(grid_sets);
		
		//点击用户名
		$('#coopUserGrid').on('click','.viewCpu',function(){
			var index = $('#coopUserGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#coopUserGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'浏览历史',pk:{id:data.id,username:data.username,name:data.name},url:'page/modules/user/viewUserMoreVisit.html',reload:true});
			}
		});
		
	}
	
	this.settings = {  
		source:{
	        url: url+'/partnerCode',
	        data:me.searchObj
	    },
		grid:{element:'coopUserGrid'},
		ajax:{url:url}
	};
	
	this.searchDataInfo = function(){
    	$('#coopUserGrid').jqxGrid('applyfilters');
    	$('#coopUserGrid').jqxGrid('refreshfilterrow'); 
    	$('#coopUserGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#coopUserGrid').jqxGrid('updatebounddata', 'cells');
    	$('#coopUserGrid').jqxGrid('clearselection');
    	$('#coopUserGrid').jqxGrid('refreshdata');
    };
}

var CpuBindModle=function(cpuMgt){
	var me=this;
	var url=_global_settings.service.url+'/applyloan';
	
	this.search=function(){
		
		var st=$('#cpu-sTime').val(),
			et=$('#cpu-eTime').val(),
			username=$('#cpu-user').val(),
			phone=$('#cpu-phone').val(),
			company=$('#cpu-company').val(),
			agent=$('#cpu-agent').val();
		
		cpuMgt.searchObj['owe.createDate'].value=[];
		if(st!=''&&et!='')
			cpuMgt.searchObj['owe.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et==='')
			cpuMgt.searchObj['owe.createDate'].value.push(st+' '+'00:00:00');
			cpuMgt.searchObj['owe.createDate'].value.action='ge';
		
		if(st===''&&et!='')
			cpuMgt.searchObj['owe.createDate'].value.push(et+' '+'23:59:59');
			cpuMgt.searchObj['owe.createDate'].value.action='le';
		
		cpuMgt.searchObj['owe.loginId'].value=[];
		if(username!='')
			cpuMgt.searchObj['owe.loginId'].value.push(username);
			
		cpuMgt.searchObj['owe.regTelephone'].value=[];
		if(phone!='')
			cpuMgt.searchObj['owe.regTelephone'].value.push(phone);
		
		cpuMgt.searchObj['enterpriseInfo.name'].value=[];
		if(company!='')
			cpuMgt.searchObj['enterpriseInfo.name'].value.push(company);
		
		cpuMgt.searchObj['enter.name'].value=[];
		if(agent!='')
			cpuMgt.searchObj['enter.name'].value.push(agent);
		
		cpuMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#cpu-search').on('click',function(){
			if($('#cpu-show').is(':hidden'))
				$('#cpu-show').slideDown('slow');
			else 
				me.search();
		});
		
		hiddenAclick();
		
	}
	
	this.unbindAll=function(){
		$('#cpu-search').off('click');
	}
}