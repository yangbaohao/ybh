/*
*佣金详情界面js
*/

var ViewcMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/agentrevenue';
	this.debug=false;
	
	this.initInput=function(){
		me.initPage();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		'o.loginId':{value:[],action:'like'},
		'f.name':{value:[],action:'like'},
		'o.regTelephone':{value:[],action:'like'},
		'biz.createDate':{value:[],action:'between'},
		's.productName':{value:[],action:'like'},
		neFee:{value:[],action:'between'},
		edFee:{value:[],action:'between'},
		unFee:{value:[],action:'between'}
	}
	
	this.initPage=function(){
		$('#viewc-show').css('display','');
		
		$('#viewc-agentName').text($.pk.name);
		$('#viewc-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#viewc-sTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		$('#viewc-eTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		
		$('#viewc-time').on('change',function(){
			setValueById('viewc-time','viewc-sTime','viewc-eTime');
		});
		
		var rd = ComboBoxSources.getRecords('productName'),arr=['全部'];
		for(var i=0;i<rd.length;i++){
			arr.push(rd[i].productName);
		}
		$('#viewc-module').comboBox({
			theme:currentTheme,
			source:arr,
			searchMode:'contains',
			displayMember:'productName',
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#viewc-status').dropDownlist({
			source:{'neFee':'应提佣金','edFee':'已提佣金','unFee':'未提佣金'},
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#viewc-show').addClass('hiddendiv');
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewComnGrid', me.settings.source,{
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
				{ text: '购买日期',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            		return html+rowdata.createDate.substring(0,10)+'</div>';
					}
				},
				{ text: '用户名',dataField:'loginId',width:'11.25%'},
				{ text: '电话号码',dataField:'regTelephone',width:'11.25%'},
				{ text: '公司名称',dataField:'name',width:'11.25%'},
				{ text: '购买金额',dataField:'amount',cellsalign:'left', cellsformat: 'c2',width:'11.25%'},
				{ text: '购买模块',dataField:'productName',width:'11.25%'},
  	            { text: '应提佣金',dataField:'neFee',cellsalign:'left', cellsformat: 'c2',width:'11.25%'},
  	            { text: '已提佣金',dataField:'edFee',cellsalign:'left', cellsformat: 'c2',width:'11.25%'},
  	          	{ text: '未提佣金',dataField:'unFee',cellsalign:'left', cellsformat: 'c2',width:'11.25%'}
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#viewComnGrid').grid(grid_sets);
		
	}
	
	this.settings = {  
		source:{
	        url: url+'/agentrevenuedetails/'+$.pk.agentCode,
	        data:me.searchObj,
	    },
		grid:{element:'viewComnGrid'},
		ajax:{url:url},
	};
	
	this.searchDataInfo = function(){
    	$('#viewComnGrid').jqxGrid('applyfilters');
    	$('#viewComnGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewComnGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewComnGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewComnGrid').jqxGrid('clearselection');
    	$('#viewComnGrid').jqxGrid('refreshdata');
    };
}

var ViewcBindModle=function(viewcMgt){
	var me=this;
	
	this.search=function(){
		var loginId=$('#viewc-username').val(),
			name=$('#viewc-compName').val(),
			phone=$('#viewc-number').val(),
			st=$('#viewc-sTime').val(),
			et=$('#viewc-eTime').val(),
			pro=$('#viewc-module').find('input').val(),
			status=$('#viewc-status').val(),
			sa=$('#viewc-sAmt').val(),
			ea=$('#viewc-eAmt').val();

		viewcMgt.searchObj['o.loginId'].value=[];
		if(loginId!='')
			viewcMgt.searchObj['o.loginId'].value.push(loginId);
		
		viewcMgt.searchObj['f.name'].value=[];
		if(name!='')
			viewcMgt.searchObj['f.name'].value.push(name);
		
		viewcMgt.searchObj['o.regTelephone'].value=[];
		if(phone!='')
			viewcMgt.searchObj['o.regTelephone'].value.push(phone);
		
		viewcMgt.searchObj['biz.createDate'].value=[];
		if(st!=''&&et!='')
			viewcMgt.searchObj['biz.createDate'].value.push(st,et);
		
		viewcMgt.searchObj['s.productName'].value=[]
		if(pro!='全部')	
			viewcMgt.searchObj['s.productName'].value.push(pro);
		
		viewcMgt.searchObj.neFee.value=[];
		viewcMgt.searchObj.edFee.value=[];
		viewcMgt.searchObj.unFee.value=[];
		
		if(status=='neFee'){
			if(sa!=''&&ea!='')
				viewcMgt.searchObj.neFee.value.push(sa,ea);
		}
		
		if(status=='edFee'){
			if(sa!=''&&ea!='')
				viewcMgt.searchObj.edFee.value.push(sa,ea);
		}
		
		if(status=='unFee'){
			if(sa!=''&&ea!='')
				viewcMgt.searchObj.unFee.value.push(sa,ea);
		}
			
		viewcMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#viewc-search').on('click',function(){
			if($('#viewc-show').is(':hidden'))
				$('#viewc-show').slideDown('slow');
			else 
				me.search();
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#viewc-search').off('click');
	}
}