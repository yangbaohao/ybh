/*
*成功客户界面js
*/

var VcMgt=function(){
	var me=this;
	var data=$.pk.data;
	var url=_global_settings.service.url+'/user/search/partnersuccess/';
	
	this.initInput=function(){
		me.initPage();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		'o.createDate':{value:[],action:'between'},
		'o.loginId':{value:[],action:'like'},
		'o.regTelephone':{value:[],action:'like'},
		'en.name':{value:[],action:'like'}
	}
	
	this.initPage=function(){
		$('#viewClient-code').text(data.employeeCode);
		$('#viewClient-company').text(data.userInfo.name);
		
		$('#viewClient-show').css('display','');
		
		$('#viewClient-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#viewClient-sTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		$('#viewClient-eTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		
		$('#viewClient-time').on('change',function(){
			setValueById('viewClient-time','viewClient-sTime','viewClient-eTime');
		});
		
		$('#viewClient-show').addClass('hiddendiv');
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewClientGrid', me.settings.source,{
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
				{ text: '注册日期',dataField:'enrtyDate',width:'25%'},
				{ text: '用户名',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            			html+='<a class="hoverspan viewClientUser">'+rowdata.username+'</a>';
	            		return html+'</div>';
					}
				},
				{ text: '电话号码',dataField:'telephone',width:'25%'},
				{ text: '公司名称',dataField:'name',width:'25%'}
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#viewClientGrid').grid(grid_sets);
		
		//点击用户名
		$('#viewClientGrid').on('click','.viewClientUser',function(){
			var index=$('#viewClientGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#viewClientGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'浏览历史',pk:{id:data.id,username:data.username,name:data.name},url:'page/modules/user/viewUserMoreVisit.html',reload:true});
			}
		});
		
	}
	
	this.settings = {  
		source:{
	        url: url+data.employeeCode,
	        data:me.searchObj
	    },
		grid:{element:'viewClientGrid'},
		ajax:{url:url}
	};
	
	this.searchDataInfo = function(){
    	$('#viewClientGrid').jqxGrid('applyfilters');
    	$('#viewClientGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewClientGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewClientGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewClientGrid').jqxGrid('clearselection');
    	$('#viewClientGrid').jqxGrid('refreshdata');
    };
}

var VcBindModle=function(vcMgt){
	var me=this;
	var url=_global_settings.service.url+'/applyloan';
	
	this.search=function(){
		var st=$('#viewClient-sTime').val(),et=$('#viewClient-eTime').val(),
			name=$('#viewClient-name').val(),phone=$('#viewClient-phone').val(),
			company=$('#viewClient-companyName').val();
		
		vcMgt.searchObj['o.createDate'].value=[];
		if(st!=''&&et!='')
			vcMgt.searchObj['o.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		vcMgt.searchObj['o.loginId'].value=[];
		if(name!='')
			vcMgt.searchObj['o.loginId'].value.push(name);
		
		vcMgt.searchObj['o.regTelephone'].value=[];
		if(phone!='')
			vcMgt.searchObj['o.regTelephone'].value.push(phone);
		
		vcMgt.searchObj['en.name'].value=[];
		if(company!='')
			vcMgt.searchObj['en.name'].value.push(company);
		
		vcMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewClient-search').on('click',function(){
			if($('#viewClient-show').is(':hidden'))
				$('#viewClient-show').slideDown('slow');
			else 
				me.search();
		});
		
		hiddenAclick();
		
	}
	
	this.unbindAll=function(){
		$('#viewClient-search').off('click');
	}
}