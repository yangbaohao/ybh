/*
*订单管理界面js
*/

var OrderMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/accountorder';
	
	this.initInput=function(){
		me.initPage();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		sortdatafield:'ex.orderCreateDate',	
		'ex.loginId':{value:[],action:'like'},
		'ex.name':{value:[],action:'like'},
		'ex.orderCode':{value:[],action:'like'},
		'ex.orderCreateDate':{value:[],action:'between'},
		'ex.productName':{value:[],action:'like'},
		'ex.payStatus':{value:[],action:'eq'}
	}
	
	this.initPage=function(){
		$('#order-show').css('display','');
		$('#order-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#order-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#order-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#order-time').on('change',function(){
			setValueById('order-time','order-sTime','order-eTime');
		});
		
		$('#order-module').comboBox({
			source:ComboBoxSources.getRecords('productName'),
			searchMode:'contains',
			displayMember:'productName',
			valueMember:'productName',
			width:'100%'
		});
		
		$('#order-status').dropDownlist({
			source:{'all':'全部','give':'赠送','paid':'已支付','paying':'支付中','offline':'线下支付','fail':'支付失败'},
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#order-show').addClass('hiddendiv');
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('orderMgtGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[								
				{ text: '订单号',width:'18%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            			html +='<a class="hoverspan viewOrder">'+rowdata.orderCode+'</a>';
  	            		return html+'</div>';
					}
				},
				{ text: '用户名',dataField:'loginId',width:'12%'},
				{ text: '公司名称',dataField:'name',width:'15%'},
				{ text: '订单模块',dataField:'productName',width:'15%'},
  	            { text: '总金额',dataField:'totalAmt',cellsalign:'left', cellsformat: 'c2',width:'10%'},
  	            { text: '订单时间',width:'10%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            		return html+rowdata.orderCreateDate.substring(0,10)+'</div>';
					}
  	            },
  	            { text: '到期时间',width:'10%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            		return html+rowdata.orderEndDate.substring(0,10)+'</div>';
					}
  	            },
  	            { text: '状态',dataField:'abc',width:'10%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            		return html+getCodeData(rowdata.payStatus)+'</div>';
					}
  	            }
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#orderMgtGrid').grid(grid_sets);
		
		//点击单号
		$('#orderMgtGrid').on('click','.viewOrder',function(){
			var index = $('#orderMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#orderMgtGrid').jqxGrid('getrowdata', index);
				console.log(rowdata);
//	   			   if(data.payStatus=='notpaid'){
//	   				$.addTab({title:'订单详情',url:'page/modules/prod/viewOrder.html',pk:
//		   			   {data:data,amount:data.totalAmt,orderCode:data.orderCode},reload:true});
//	   				return false;
//	   			   }
//	   			   $.addTab({title:'订单详情',url:'page/modules/pay/orderDetails.html',pk:
//	   			   {data:data.accountProducts,amount:data.totalAmt,orderCode:data.orderCode,orderEndDate:data.orderEndDate},reload:true});
	   			var obj={"condition":[],"filterscount":0,"groupscount":0,"pagenum":0,"pagesize":100};
	   			obj.condition.push({"value":[rowdata.id.toString()],"action":"eq","key":"accountOrder.id"});
	   			var sub=new Base64().encode(JSON.stringify(obj));
	   			Core.AjaxRequest({
	   	            url : _global_settings.service.url+'/accountOrderPay/page/'+sub,
	   	            type: 'GET',
	   	            callback: function(res) {
	   	            	var data=res.rows[0];
	   	            	console.log(data);
	   	            	$.addTab({title:'订单详情',url:'page/modules/prod/viewOrder.html',pk:
	  	   			   {data:data.accountOrder,amount:data.totalAmt,orderCode:data.accountOrder.orderCode,vouchers:data.vouchers,name:rowdata.name},
	  	   			   	reload:true});
	   	            	console.log(res);
	   	            },
	   	            failure:function(res){
	   	            	
	   	            }
	   	        });
			}
		});
	}
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'orderMgtGrid'},
		ajax:{url:url},
	};
	
	this.searchDataInfo = function(){
    	$('#orderMgtGrid').jqxGrid('applyfilters');
    	$('#orderMgtGrid').jqxGrid('refreshfilterrow'); 
    	$('#orderMgtGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#orderMgtGrid').jqxGrid('updatebounddata', 'cells');
    	$('#orderMgtGrid').jqxGrid('clearselection');
    	$('#orderMgtGrid').jqxGrid('refreshdata');
    };
}

var OrderBindModle=function(orderMgt){
	var me=this;
	
	this.search=function(){
		var username = $('#order-username').val(),
			compname = $('#order-compName').val(),
			ordercode = $('#order-number').val(),
			st = $('#order-sTime').val(),
			et = $('#order-eTime').val(),
			productName = $('#order-module').val(),
			status = $('#order-status').val();
		
		orderMgt.searchObj['ex.loginId'].value=[];
		if(username!='')
			orderMgt.searchObj['ex.loginId'].value.push(username);
		
		orderMgt.searchObj['ex.name'].value=[];
		if(compname!='')
			orderMgt.searchObj['ex.name'].value.push(compname);
		
		orderMgt.searchObj['ex.orderCode'].value=[];
		if(ordercode)
			orderMgt.searchObj['ex.orderCode'].value.push(ordercode);
		
		orderMgt.searchObj['ex.orderCreateDate'].value=[];
		if(st!=''&&et!='')
			orderMgt.searchObj['ex.orderCreateDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et==='')
			orderMgt.searchObj['ex.orderCreateDate'].value.push(st+' '+'00:00:00',getNowFormatDate()+' '+'23:59:59');
		
		if(st===''&&et!='')
			orderMgt.searchObj['ex.orderCreateDate'].value.push('2015-01-01'+' '+'00:00:00',et+' '+'23:59:59');
		
		orderMgt.searchObj['ex.productName'].value=[];
		if(productName!='全部')
			orderMgt.searchObj['ex.productName'].value.push(productName);
		
		orderMgt.searchObj['ex.payStatus'].value=[];
		if(status!='all')
			orderMgt.searchObj['ex.payStatus'].value.push(status);
		
		orderMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#order-search').on('click',function(){
			if($('#order-show').is(':hidden'))
				$('#order-show').slideDown('slow');
			else 
				me.search();
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#order-search').off('click');
	}
}