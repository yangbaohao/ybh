/*
 * 代理报税
 * 查看用户界面js 
 */

var ViewTaxerUserMgt=function(){
	var me=this;
	var url=_global_settings.service.url;
	this.debug=false;
	this.data = $.pk.data;
	console.log(me.data);
	var listData = null;
	this.initInput=function(){
		me.initWindows();
		me.initPage();
		me.initGrid();
		me.bind();
		me.unbindAll();
	}
	
	this.searchObjPayment={}
	
	this.searchObjPayment={};
	
	/**
	 * getTaxerInfo 拉出所有报税人名单,姓名,id
	 */
	this.getTaxerInfo=function(username){
		var rd = ComboBoxSources.getRecords('taxerInfo');
		for(i=0;i<rd.length;i++){
			if(username==rd[i].username){
				return rd[i];
			}
		}
		
		if(!username){
			return '';
		}
	}
	
	this.initWindows = function(){
		$('#editReceiptMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 700,
			minHeight : 300,
			height : 'auto',
			minWidth : 600,
			maxWidth : 800,
			cancelButton : $('#editReceiptMgtCancleBtn'),
			initContent : function() {
			}
		}).on('close', function() {
			setTimeout(function() {

			},'open',function(){ 

			},500);
		});
		
		$('#editPaymentMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 700,
			minHeight : 300,
			height : 'auto',
			minWidth : 600,
			maxWidth : 800,
			cancelButton : $('#editPaymentMgtCancleBtn'),
			initContent : function() {
			}
		}).on('close', function() {
			setTimeout(function() {
			},'open',function(){ 
			},500);
		});
	}
	
	this.initPage=function(){
		$('#viewTaxerUser-taxer').text(me.getTaxerInfo(me.data.taxer)==undefined?'':me.getTaxerInfo(me.data.taxer).name);
		$('#viewTaxerUser-username').text(me.data.loginId);
		$('#viewTaxerUser-stime').text(me.data.startDate==undefined?'':me.data.startDate.substring(0,10));
		$('#viewTaxerUser-etime').text(me.data.endDate==undefined?'':me.data.endDate.substring(0,10));
		$('#viewTaxerUser-name').text(me.data.name);
		$('#viewTaxerUser-taxrate').text(me.data.vat+'%');
		$('#viewTaxerUser-taxType').text(getCodeData(me.data.taxType));
		$('#viewTaxerUser-owerTaxCode').text(me.data.owerTaxCode);
		$('#viewTaxerUser-period').text(getCodeData(me.data.dateType));
		$('#viewTaxerUser-money').text('￥'+money(me.data.payAmt));
		$('#viewTaxerUser-email').text(me.data.email);
		$('#viewTaxerUser-phone').text(me.data.regTelephone);
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		//收款
		me.settings.source.data = me.searchObjReceipt;
		me.settings.source.url = _global_settings.service.url+'/owner/search/payRemark/'+me.data.id+'/pay';
		var demoAdapter = Core.AcDataAdapter('viewTaxerUserReceipt', me.settings.source,{
			beforeLoadComplete:function(records){
			}
		}, me.debug);
		
		//催款
		me.setting1.source.data = me.searchObjPayment;
		me.setting1.source.url = _global_settings.service.url+'/owner/search/payRemark/'+me.data.id+'/nopay';
		var demoAdapter1 = Core.AcDataAdapter('viewTaxerUserPayment', me.setting1.source,{
			beforeLoadComplete:function(records){
			}
		}, me.debug);
		
		//初始化收款Grid
		var grid_sets = {
	  	   source:demoAdapter
	  	   ,pageable:false
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[								
				{ text: '收款日期',width:'20%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div style="padding-top:6px;">';
  	            		html+=rowdata.entryDate.substring(0,10);
  	            		return html+'</div>';
					}
				},
				{ text: '收款区间',dataField:'startDate',width:'20%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div style="padding-top:6px;">';
  	            		if(rowdata.startDate!=undefined||rowdata.endDate!=undefined){
  	            			html+=rowdata.startDate.substring(0,7)+'~'+rowdata.endDate.substring(0,7);
  	            		}
  	            		return html+'</div>';
					}
				},
  	            { text: '收款金额',dataField:'amt',cellsformat: 'c2',width:'20%'},
  	            { text: '收款方式',width:'20%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div style="padding-top:6px;">';
  	            			html+= getCodeData(rowdata.dateType);
  	            		return html+'</div>';
					}
  	            },
  	            { text: '操作',width:'20%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div style="padding-top:6px; text-align:center;">';
//	  	            		html += '<a class="hoverspan md-highlight-remove  deleteReceiptLineBtn" data-index="'+rowIndex+'" title="删除"></a>';
							html += '<a class="hoverspan md-edit editReceiptLineBtn" data-index="'+rowIndex+'" title="编辑"></a>';
  	            		return html+'</div>';
					}
  	            }
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#viewTaxerUserReceipt').grid(grid_sets);
		
		//初始化催款Grid
		var grid_set = {
	  	    source:demoAdapter1,
			columnsresize: false,
			autorowheight: true,
		    autoheight: true,
		    columnsheight: 45,
//    	    pagesize: 1,
		    pageable:false,
//		    altrows:true,
//		    enablehover: false,
//		    sortable:false,
		    rendergridrows: function(){
	            return demoAdapter1.records;
	        }
    	   ,columns:[								
				{ text: '催款日期',width:'20%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div style="padding-top:6px;">';
  	            		html+=rowdata.entryDate.substring(0,10);
  	            		return html+'</div>';
					}
				},
				{ text: '催款区间',dataField:'startDate',width:'20%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div style="padding-top:6px;">';
  	            		if(rowdata.startDate!=undefined||rowdata.endDate!=undefined){
  	            			html+=rowdata.startDate.substring(0,7)+'~'+rowdata.endDate.substring(0,7);
  	            		}
  	            		return html+'</div>';
					}
				},
  	            { text: '催款金额',dataField:'amt',cellsformat: 'c2',width:'20%'},
  	            { text: '催款方式',width:'20%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div style="padding-top:6px;">';
  	            			html+= getCodeData(rowdata.dateType);
  	            		return html+'</div>';
					}
  	            },
  	            { text: '操作',width:'20%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div style="padding-top:6px; text-align:center;">';
//	  	            		html += '<a class="hoverspan md-highlight-remove  deletePaymentLineBtn" data-index="'+rowIndex+'" title="删除"></a>';
							html += '<a class="hoverspan md-edit editPaymentLineBtn" data-index="'+rowIndex+'" title="编辑"></a>';
  	            		return html+'</div>';
					}
  	            }
	  	    ],
	    };
		$('#viewTaxerUserPayment').grid(grid_set);
	}
	
	this.settings = {  
		source:{
	        data:me.searchObjReceipt,
	    },
		grid:{element:'viewTaxerUserReceipt'},
		ajax:{url:url},
	};
	
	this.setting1 = {  
			source:{
		        data:me.searchObjPayment,
		    },
			grid:{element:'viewTaxerUserPayment'},
			ajax:{url:url},
	};
	
	this.bind=function(){
		
		// TODO 收款删除
		$('#viewTaxerUserReceipt').on('click','.deleteReceiptLineBtn', function() {
			var index = $(this).attr('data-index');
			var data = $("#viewTaxerUserReceipt").jqxGrid('getrowdata', index);
			listData = data;
			
			Core.AjaxRequest({
				type : 'DELETE',
				url : _global_settings.service.url+'/owner/payRemark/delete/'+listData.id,
				async : false,
				showMsg:false,
				callback : function() {
					setCloseAlertTimeOneSecond();
					$('#viewTaxerUserReceipt').jqxGrid('updatebounddata','cells');
				},
				failure : function() {
				}
			});
		});
		
		//收款编辑
		$('#viewTaxerUserReceipt').on('click','.editReceiptLineBtn', function() {
			var index = $(this).attr('data-index');
			var data = $("#viewTaxerUserReceipt").jqxGrid('getrowdata', index);
			listData = data;
			console.log(data);
			$('#editReceiptMgtWin').jqxWindow('open', function() {
				
				$('#editReceipt-period').dropDownlist({
					source : {'paymouth':'按月收款','payseason' : '按季度收款','payhalfyear' : '按半年收款','payyear' : '按年收款'},
					theme : currentTheme,
					height : 34,
					width : '100%',
					selectedIndex : 0
				});
				
				$('#editReceipt-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#editReceipt-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#editReceipt-amount').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#editReceipt-money').input({width:'98%',height:33}).moneyinput();
				
				$('#editReceipt-loginId').val(me.data.loginId);
				$('#editReceipt-name').val(me.data.name);
				$('#editReceipt-amount').val(data.entryDate.substring(0,10));
				$('#editReceipt-money').val(money(data.amt));
				$('#editReceipt-sTime').val(data.startDate.substring(0,7));
				$('#editReceipt-eTime').val(data.endDate.substring(0,7));
				
				if(data.startDate!=undefined){
					$('#editReceipt-sTime').val(data.startDate);
					editReceiptPeriodSelect();
				}else{
					$('#editReceipt-sTime').val($('#editReceipt-amount').val());
					editReceiptPeriodSelect();
				}
				$('#editReceipt-sTime').change(function(){
					editReceiptPeriodSelect();
				})
				
				function editReceiptPeriodSelect(){
					if($('#editReceipt-period').val()=='paymouth'){
						
						$('#editReceipt-money').val(money(data.amt));
						$('#editReceipt-eTime').val( getChangeDate($('#editReceipt-sTime').val(), 1) );
					
					}else if($('#editReceipt-period').val()=='payseason'){
						
						$('#editReceipt-money').val(money(data.amt*3));
						$('#editReceipt-eTime').val( getChangeDate( $('#editReceipt-sTime').val(), 3) );
					
					}else if($('#editReceipt-period').val()=='payhalfyear'){
						
						$('#editReceipt-money').val(money(data.amt*6));
						$('#editReceipt-eTime').val( getChangeDate($('#editReceipt-sTime').val(), 6) );
					
					}else if($('#editReceipt-period').val()=='payyear'){
						
						$('#editReceipt-money').val(money(data.amt*12));
						$('#editReceipt-eTime').val( getChangeDate($('#editReceipt-sTime').val(), 12) );
					}
				}
				editReceiptPeriodSelect();
				
				$('#editReceipt-period').on('select',function(){
					editReceiptPeriodSelect();
				})
			});
		});
		
		//收款编辑保存
		$('#editReceiptSubmitBtn').off('click').on('click',function(){
			var obj = {};
				obj.id = listData.id;
				obj.owner = {id:me.data.id},																//owner
				obj.entryDate = $('#editReceipt-amount').val();												//当前账期
				obj.startDate = $('#editReceipt-sTime').val();												//合同开始日期
				obj.endDate = $('#editReceipt-eTime').val();												//合同结束日期
				obj.dateType = $('#editReceipt-period').val();												//收款周期
				obj.amt = $('#editReceipt-money').val();													//收款金额
				obj.type = 'pay';
			
			Core.AjaxRequest({
				type : 'PUT',
				url : _global_settings.service.url+'/owner/payRemark/update',
				async : false,
				params : obj,
				showMsg:false,
				callback : function() {
					setCloseAlertTimeOneSecond();
					$('#editReceiptMgtWin').jqxWindow('close');
					$('#viewTaxerUserReceipt').jqxGrid('updatebounddata','cells');
				},
				failure : function() {
				}
			});
		})
		
		
		//催款删除
		$('#viewTaxerUserPayment').on('click','.deletePaymentLineBtn', function() {
			var index = $(this).attr('data-index');
			var data = $("#viewTaxerUserPayment").jqxGrid('getrowdata', index);
			listData = data;
			
			Core.AjaxRequest({
				type : 'DELETE',
				url : _global_settings.service.url+'/owner/payRemark/delete/'+listData.id,
				async : false,
				showMsg:false,
				callback : function() {
					setCloseAlertTimeOneSecond();
					$('#viewTaxerUserPayment').jqxGrid('updatebounddata','cells');
				},
				failure : function() {
				}
			});
		});
		
		//催款编辑
		$('#viewTaxerUserPayment').on('click','.editPaymentLineBtn', function() {
			var index = $(this).attr('data-index');
			var data = $("#viewTaxerUserPayment").jqxGrid('getrowdata', index);
			listData = data;
			console.log(data);
			$('#editPaymentMgtWin').jqxWindow('open', function() {
				$('#editPayment-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#editPayment-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#editPayment-amount').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#editPayment-money').input({width:'98%',height:33}).moneyinput();
				
				$('#editPayment-loginId').val(me.data.loginId);
				$('#editPayment-name').val(me.data.name);
				$('#editPayment-amount').val(data.entryDate.substring(0,10));
				$('#editPayment-money').val(money(data.amt));
				$('#editPayment-sTime').val(data.startDate.substring(0,7));
				$('#editPayment-eTime').val(data.endDate.substring(0,7));
				
				$('#editPayment-period').dropDownlist({
					source : {'paymouth':'按月收款','payseason' : '按季度收款','payhalfyear' : '按半年收款','payyear' : '按年收款'},
					theme : currentTheme,
					height : 34,
					width : '100%',
					selectedIndex : 0
				});
				
				if(data.startDate!=undefined){
					$('#editPayment-sTime').val(data.startDate);
					editPaymentPeriodSelect();
				}else{
					$('#editPayment-sTime').val($('#editPayment-amount').val());
					editPaymentPeriodSelect();
				}
				$('#editPayment-sTime').change(function(){
					editPaymentPeriodSelect();
				})
				
				function editPaymentPeriodSelect(){
					if($('#editPayment-period').val()=='paymouth'){
						
						$('#editPayment-money').val(money(data.amt));
						$('#editPayment-eTime').val( getChangeDate($('#editPayment-sTime').val(), 1) );
					
					}else if($('#editPayment-period').val()=='payseason'){
						
						$('#editPayment-money').val(money(data.amt*3));
						$('#editPayment-eTime').val( getChangeDate( $('#editPayment-sTime').val(), 3) );
					
					}else if($('#editPayment-period').val()=='payhalfyear'){
						
						$('#editPayment-money').val(money(data.amt*6));
						$('#editPayment-eTime').val( getChangeDate($('#editPayment-sTime').val()), 6);
					
					}else if($('#editPayment-period').val()=='payyear'){
						
						$('#editPayment-money').val(money(data.amt*12));
						$('#editPayment-eTime').val( getChangeDate($('#editPayment-sTime').val(), 12) );
					}
				}
				editPaymentPeriodSelect();
				
				$('#editPayment-period').on('select',function(){
					editPaymentPeriodSelect();
				})
			});
		});
		
		//催款编辑保存
		$('#editPaymentSubmitBtn').off('click').on('click',function(){
			var obj = {};	
				obj.id = listData.id;
				obj.owner = {id:me.data.id}, 																//id
				obj.entryDate = $('#editPayment-amount').val();												//当前账期
				obj.startDate = $('#editPayment-sTime').val();												//合同开始日期
				obj.endDate = $('#editPayment-eTime').val();												//合同结束日期
				obj.dateType = $('#editPayment-period').val();												//收款周期
				obj.amt	 = $('#editPayment-money').val();													//收款金额
				obj.type = 'nopay';
			
			Core.AjaxRequest({
				type : 'PUT',
				url : _global_settings.service.url+'/owner/payRemark/update',
				async : false,
				params : obj,
				showMsg:false,
				callback : function() {
					setCloseAlertTimeOneSecond();
					$('#editPaymentMgtWin').jqxWindow('close');
					$('#viewTaxerUserPayment').jqxGrid('updatebounddata','cells');
				},
				failure : function() {
				}
			});
		})
	}
	
	this.unbindAll=function(){
//		$('#editReceiptSubmitBtn').off('click');
//		$('#editPaymentSubmitBtn').off('click');
	}
}
