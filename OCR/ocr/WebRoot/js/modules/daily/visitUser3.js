/*
 * 访问人数界面js
 */
var exportUserInfo=[];
var beforeUserInfo=[];
var VistMgt=function(){
	var me=this;
	var createDate =null;
	var url=_global_settings.service.url+'/common';
	this.debug=false;
	var ownerIds= null;
	this.ownerNewArr=[];
	this.data=[];
	this.rowData;

	this.initInput=function(){
		me.beforeInitData();
	}
	//渲染页面之前，先存储用户信息返回的值。
	this.beforeInitData=function(){
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			async: false,
			url:_global_settings.service.url+"/common/owner/information",
			callback:function(res){
				beforeUserInfo=res;	//call=======>>>line-5
				createDate = $.pk.createDate;
				me.initUserPage();
				me.initSearch();
				me.initGrid(me.searchObj);
				me.getTableData();
			},
		});
	}
	
	//请求表数据
	this.getTableData=function(){
		if($.pk!==undefined){
			if($.pk.createDate === undefined){
				Core.alert({
					message:"日期入参错误",
					callback:function(){	
						$.closeTab();
					}
				});
			}
		}
	}

	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		/*
		var records = ComboBoxSources.getRecords('records'),arr=['全部'];
		for(var i=0;i<records.length;i++){
			arr.push(records[i].name);
		}*/
		$('#agentDailyVisit-com').jqxDropDownList({
			source:[],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		/*$('#agentDailyVisit-date').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});*/
		
		/*$('#agentDailyVisit-number').jqxDropDownList({
			source:[],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});*/
		/*$('#agentDailyVisit-sDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#agentDailyVisit-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#agentDailyVisit-date').on('change',function(){
			var td = $('#agentDailyVisit-date').attr('id');
			var sd = $('#agentDailyVisit-sDate').attr('id');
			var ed = $('#agentDailyVisit-eDate').attr('id');
			setValueById(td,sd,ed);
		});
		
		$('#agentDailyVisit-number').on('change',function(){
			var td = $('#agentDailyVisit-number').attr('id');
			var sd = $('#agentDailyVisit-sNumber').attr('id');
			var ed = $('#agentDailyVisit-eNumber').attr('id');
			setValueById(td,sd,ed);
		});*/
		
		$('#agentDailyVisit-show').addClass('hiddendiv');
	}

	/*
	 * 初始化table
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		me.settings.source.url = url+'/owner/access/-1/-1/-1/-1/'+createDate;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentDailyGrid-visit', me.settings.source,{
			loadComplete:function(records){
				var ownerOldArr=[];
				for(var i=0; i<records.rows.length; i++){
					me.ownerIds=records.rows[i].ownerId;
					ownerOldArr.push(records.rows[i].ownerId);
				}
				if(records.rows.length-1){
					me.ownerNewArr=ownerOldArr;
				}
				console.log(me.ownerNewArr);
				//匹配左右接口id值将数据对应的
				var ownerArrLength=me.ownerNewArr.length;
				for(var i=0; i<beforeUserInfo.length; i++){
					for(var j=0; j<ownerArrLength; j++){
						if(me.ownerNewArr[j]===beforeUserInfo[i].id){
							if(beforeUserInfo[i].username != undefined){
								$(".visitAgentCode").eq(j).html(beforeUserInfo[i].username);
								$(".visitCompanyName").eq(j).html(beforeUserInfo[i].name);
								$(".visitAgentTelephone").eq(j).html(beforeUserInfo[i].telephone);
								$(".visitRegCreateDate").eq(j).html(beforeUserInfo[i].createDate);
							}
						}
					}
				}
			}
		}, me.debug);
		
		
/*		var search1={};*/
		var remark= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
	    	if(rowdata.accessList!==undefined){
	    		var html='',a='';
	    		for(var i=0; i<rowdata.accessList.length; i++){
	    			a=rowdata.accessList[i].remark;
	    			if(a!=undefined ){
	    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
	    			}
		    	}
	    	return '<div style="height:auto;">'+html+'</div>';
	    	}
		};
		
		var remarkNum= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){		
	    	if(rowdata.accessList!==undefined){
	    		var html='',a='';
	    		for(var i=0; i<rowdata.accessList.length; i++){
		    		a=rowdata.accessList[i].remarkNum;
		    		html+='<div class="JournalDiv" style="border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
		    	}
	    		return '<div style="height:auto;">'+html+'</div>';
	    	}	
		};
		
		var remarkSecond= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
	    	if(rowdata.accessList!==undefined){
	    		var html='',a='';
	    		for(var i=0; i<rowdata.accessList.length; i++){
		    		a=rowdata.accessList[i].remarkSecond;
		    		html+='<div class="JournalDiv" style="border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
		    	}
	    		return '<div style="height: auto;">'+html+'</div>';
	    	}	
		};
		//初始化table
		var grid_sets = {
			columnsresize: false,
			autorowheight: true,
		    autoheight: true,
	  	    source:demoAdapter,
		    rendergridrows: function(rowdata){
		    	
		    	for(var i=0;i<rowdata.data.length; i++){
		    		if(rowdata.data[i] !=undefined){
		    			if(rowdata.data[i].accessList!=undefined || rowdata.data[i].accessList == ''){
		    				me.data.push(rowdata.data[i]);
		    			}
		    		}
		    	}
		    	rowdata.data = me.data;
		    	rowdata.endindex = me.data.length;
		    	me.rowData = rowdata;
                return demoAdapter.records;
            }
    	   ,columns:[								
				{ text: '用户名',width:'14%',
					cellsrenderer:function ( rowdata) {
						var html = '<div class="visitAgentCode" style="padding-top:6px; text-align: center;">';
						return html;
					}
				},
				{ text: '公司名称',width:'16%',
					cellsrenderer:function ( rowdata) {
						var html = '<div class="visitCompanyName" style="padding-top:6px; text-align: center;">';
						return html;
					}
				},
				  { text: '联系电话',width:'14%',
					cellsrenderer:function (rowdata) {
						var html = '<div class="visitAgentTelephone" style="padding-top:6px; text-align: center;">';
						return html;
					}
				  },
				{ text: '注册时间',width:'14%',
					cellsrenderer:function (rowdata) {
						var html = '<div class="visitRegCreateDate" style="padding-top:6px; text-align: center;">';
						return html;
					}
				},
				{ text: '访问模块',dataField:'remark',width:'20%',cellsrenderer:remark},
				{ text: '访问次数',width:'11%',cellsrenderer:remarkNum},
				{ text: '停留时间(分)',width:'11%',cellsrenderer:remarkSecond}      
	  	    ],
//    	   pagesize: me.settings.grid.pagesize,
	  	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#agentDailyGrid-visit').grid(grid_sets);
	}	
	
	this.settings = {  
		source:{
			url: url+'/owner/access/-1/-1/-1/-1/'+createDate,
	        data:me.searchObj,
	        datafields: [
	                     /*{ name: 'Date(l.createDate)', type: 'number', action: 'eq'},*/
	                    /* { name: 'remarkNum', type: 'number'},
	                     { name: 'remarkSecond', type: 'number' }*/
//	                     {name:'name', type: 'string', action:'eq'}
	                 ]
	    },
		grid:{element:'agentDailyGrid-visit'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			/*loginId:{value:string,action:'like'},
			regTelephone:{value:number,action:'like'},
			createDate:{value:number,action:'like'},
			remark:{value:number,action:'like'},
			remarkNum:{value:number,action:'between'},name:{value:string,action:'eq'}
			remarkSecond:{value:number,action:'between'}*/
		};
	}
	
	this.searchDataInfo = function(){
    	$('#agentDailyGrid-visit').jqxGrid('applyfilters');
    	$('#agentDailyGrid-visit').jqxGrid('refreshfilterrow'); 
    	$('#agentDailyGrid-visit').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentDailyGrid-visit').jqxGrid('updatebounddata', 'cells');
    	$('#agentDailyGrid-visit').jqxGrid('clearselection');
    	$('#agentDailyGrid-visit').jqxGrid('refreshdata');
    };
}

var VistBindModle=function(vistMgt){
	var me=this;
	
	this.search=function(){
		var name = $('#agentDaily-name').find('input').val(),type = $('#agentDaily-type').val();
		
//		vistMgt.searchObj.name.value=[];
		if(name!='全部')
			vistMgt.searchObj.agentName.value.push(name);
		
		vistMgt.searchObj.type.value=[];
		if(type!='all')
			vistMgt.searchObj.type.value.push(type);
		vistMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#agentDailyVisit-search').on('click',function(){
			if($('#agentDailyVisit-show').is(':hidden')){
				$('#agentDailyVisit-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		hiddenAclick();
	}
	
	this.unbindAll=function(){
//		$('#agentDailyVisit-search').off('click');
//		$('#agentDailyGrid-visit').off('click');	
	}	
}