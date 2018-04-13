/**
 * 
 */

var exportData=[];
var urls=journalUrl;
$(function(){
	
	var getTaxerInfo=function(username){
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
	
	//拉出所有报税人员
	$("#JournalSelectTime").dropDownlist({source:['请选择','最近一周','最近两周',"最近三周","本月","本季度","本年"], width: '100%'});
	
	$('#JournalSelectTime').on('change',function(){
		setValueById('JournalSelectTime','journalTm1','journalTm2');
	});
	$("#importJournal").on({
		"click":function(){
			$('#journalmgt-attachment').html('');
			$('#journalmgt-modal').modal("show");
			var url='journal';
			$('#journalmgt-attachment').fileuploader({url:_global_settings.service.url+ '/common/importjournal/'+currentUserInfo.id+'/'+_global_settings.owner.username});
			/*setTimeout(function(){
				$(window).resize();	
			},1500);*/
		}
	});
	//mee
	$("#journalTm1").datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
	$("#journalTm2").datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
	$('#joural-show').attr('class','row hiddendiv');
	
	$('#jouralSearchBtn').on('click',function(){
		if($('#joural-show').is(':hidden')){
			$('#joural-show').slideDown('show');
		}else{
			getSearchObj();
			searchDataInfo('Journal');
		}
	});
	hiddenAclick();
	
	var search1={
			
	};	
	
	 var url = _global_settings.service.url;
    var source =
    {
        datafields: [
            { name: 'entryDate', type: 'string' },
            /*{ name: 'boundindex', type: 'number' },*/
            { name: 'journalNumberForShow', type: 'string' },
            { name: 'journalNumber', type: 'string' },
            { name: 'journalDetails', type: 'string' },
            { name: 'journalType', type: 'string' },
            { name: 'journalBizType', map: 'journalBizType' },
            //{ name: ['kemu','kemu2'], type: 'float' },
            { name: 'createBy', type: 'string' },
            { name: 'lastUpdateBy', type: 'string' },
            { name: 'remark', type: 'string' },
            { name: 'remarkPrint', type: 'string' },
            { name: 'currency', type: 'string' },
            { name: 'id', type: 'number' },
            { name: 'bizId', type: 'number' },            
            { name: 'fileInfoIds', type: 'string' },
            { name: 'noteNumber', type: 'number' },
            { name: 'clientId', type: 'string' },
            { name: 'personId', type: 'string' },
            { name: 'receiptInvoiceType', type: 'string' },
            { name: 'vat', type: 'string' },
            { name: 'receiptNumber', type: 'string' },
            { name: 'journalRelationType', type: 'string' },
            { name: 'returnFlag', type: 'bool' },
            { name: 'termValue', type: 'string' },
            { name: 'generalDocumentsCreateBy', type: 'string' },
            //{ name: 'journalBizType', type: 'string' },
           
        ],
        url: url+"/ac/journal",
        data:search1
    };
    
    
    var description= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
//		debugger;
    	var html='';
    	$.each(rowdata.journalDetails,function(i,o){
    		var a=o.description===(null||undefined)?'':o.description;
    		html+='<div class="JournalDiv" style="border-top: 1px solid  #EBEFF2;" title='+a+'>'+a+'</div>';
    		//html+='<div class="JournalDiv" style="border-top: 1px solid  #EBEFF2;">'+a+'</div>';
		})
		return '<div style="height:auto;">'+html+'</div>';
//		return html;

	};
	
	
	var chartOfAccount= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
		
    	var html=''; 
    	$.each(rowdata.journalDetails,function(i,o){
			if(o.chartOfAccount.id!=null){
				html+='<div class="JournalDiv" style="border-top: 1px solid  #EBEFF2;">'+getProductInfoById(o.chartOfAccount.id,'chartOfAccounts').name+'</div>';
			}else{
				html+='<div class="JournalDiv" style="border-top: 1px solid  #EBEFF2;"></div>';
			}
					
		})
    	return '<div style="height: auto;">'+html+'</div>';
	};
	
	var creditAmt= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
		
    	var html='';
    	$.each(rowdata.journalDetails,function(i,o){
    		var creditAmt=o.creditAmt===0?'':'￥'+moneyBig(o.creditAmt);
    		html+='<div class="JournalDiv" style="border-top: 1px solid  #EBEFF2;    text-align: right;padding-right:5px;">'+creditAmt+'</div>';
		})
		return '<div style="height: auto;">'+html+'</div>';
	};
	
	var debitAmt= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
		
    	var html='';
    	$.each(rowdata.journalDetails,function(i,o){
    		var debitAmt=o.debitAmt===0?'':'￥'+moneyBig(o.debitAmt);
    		html+='<div class="JournalDiv" style="border-top: 1px solid  #EBEFF2;    text-align: right;padding-right:5px;">'+debitAmt+'</div>';
		})
		return '<div style="height: auto;">'+html+'</div>';
	};
	
	var createBy= function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
    	var html='';
    	if(rowdata.createBy=='AdminAccount'){
    		html+='<div>代理报税</div>';
		}else if(rowdata.createBy == _global_settings.owner.username){
			html+='<div>'+_global_settings.owner.companyname+'</div>';
		}else{
			html+='<div>'+rowdata.createBy+'</div>';
		}
		return '<div style="height: auto;position:absolute;top:44%;left:5%">'+html+'</div>';
	};
    
	
	var settings = {
			grid:{
				element:"Journal",
				columns: [
   	  	               { text: '日期', dataField: 'entryDate',width:'8%'},
   	  	               { text: '凭证字号', dataField: 'journalNumberForShow',width:'7%'},
   	  	               { text: '关联业务',width:'6%',
	   	  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	   	  	            		var rows=rowdata.journalDetails.length;
	   	  	            		var h=24*rows/2-4.5;
	   	  	            		/*if(rowdata.journalBizType == "purchaseDelivery"){
									var rtStr = '<div style="text-align: center;padding-top: '+h+'px;text-decoration: underline;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewJourReceiveDetail" data-id='+rowdata.boundindex+'>'+"收货"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
								}
			   	  	            if(rowdata.journalBizType == "purchasePay"){
									var rtStr = '<div style="text-align: center;padding-top: '+h+'px;text-decoration: underline;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewJourPayDetail" data-id='+rowdata.boundindex+'>'+"付款"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
								}
				   	  	        if(rowdata.journalBizType == "salesDelivery"){
									var rtStr = '<div style="text-align: center;padding-top: '+h+'px;text-decoration: underline;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewJourSendDetail" data-id='+rowdata.boundindex+'>'+"送货"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
								}
					   	  	    if(rowdata.journalBizType == "salesPay"){
									var rtStr = '<div style="text-align: center;padding-top: '+h+'px;text-decoration: underline;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewJourReceiveMoneyDetail" data-id='+rowdata.boundindex+'>'+"收款"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
								}
						   	  	if(rowdata.journalBizType == "stockcheck"){
									var rtStr = '<div style="text-align: center;padding-top: '+h+'px;text-decoration: underline;">';
			  	            		rtStr += '<span class="viewInvenDetail" data-id='+rowdata.boundindex+'>'+"盘存"+'</span>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
								}
						   	  	if(rowdata.journalBizType == "expensePayment"){
									var rtStr = '<div style="text-align: center;padding-top: '+h+'px;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewExpensePayment" data-id='+rowdata.boundindex+'>'+"费用支出"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
								}
						   	  	if(rowdata.journalBizType=="feeincomepay"){
							   	  	var rtStr = '<div style="text-align: center;padding-top: '+h+'px;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewCostIncome" data-id='+rowdata.boundindex+'>'+"其他收入"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
						   	  	}
						   	  	if(rowdata.journalBizType=="salesReturnDelivery"){
							   	  	var rtStr = '<div style="text-align: center;padding-top: '+h+'px;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewSalesReturn" data-id='+rowdata.boundindex+'>'+"销售退货"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
						   	  	}
						   	  	if(rowdata.journalBizType=="purchaseReturnDelivery"){
							   	  	var rtStr = '<div style="text-align: center;padding-top: '+h+'px;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewPurchaseReturn" data-id='+rowdata.boundindex+'>'+"采购退货"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
						   	  	}
						   	  	if(rowdata.journalBizType=="salesReturnPay"){
							   	  	var rtStr = '<div style="text-align: center;padding-top: '+h+'px;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewSalesReturnPay" data-id='+rowdata.boundindex+'>'+"销售退款"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
						   	  	}
						   	  	if(rowdata.journalBizType=="purchaseReturnPay"){
							   	  	var rtStr = '<div style="text-align: center;padding-top: '+h+'px;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewPurchaseReturnPay" data-id='+rowdata.boundindex+'>'+"采购退款"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
					   	  		}*/
		   	  	            	if(rowdata.journalBizType=='generalDocuments'){
							   	  	var rtStr = '<div style="text-align: center;padding-top: '+h+'px;">';
			  	            		rtStr += '<a class="color-1193C5 hoverspan viewgeneral" data-id='+rowdata.boundindex+'>'+"通用单据"+'</a>';
			  	            		rtStr += '</div>';
			  	            		return rtStr;
						   	  	}
			   	  	            if(rowdata.journalBizType=='Receipt'){
							   	  	var rtStr = '<div style="text-align: center;padding-top: '+h+'px;">';
				  	            		rtStr += '<a class="color-1193C5 hoverspan receiptView" data-id='+rowdata.boundindex+'>'+"发票"+'</a>';
				  	            		rtStr += '</div>';
				  	            		return rtStr;
						   	  	}
   	  	            		}
   	  	               },
   	  	               { text: '摘要', cellsrenderer:description,width:'19%'},
   	  	               { text: '科目', cellsrenderer:chartOfAccount,width:'20%',height:'50px'},
   	  	               //{ text: '科目', dataField:'kemu' ,sortable:false, filterable:false,width:'10%'},
   	  	               { text: '借方金额',cellsrenderer:debitAmt,width:'10%'},
   	  	               { text: '贷方金额',cellsrenderer:creditAmt,width:'11%'},
   	  	               { text: '制单人', dataField:'createBy',width:"9%",
   	  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	   	  	            	var html='';
		   	  	           if(rowdata.createBy=='AdminAccount'){
			   	  	       		html+='<div>代理报税</div>';
			   	  	   		}else{
			   	  	   			if(getTaxerInfo(rowdata.createBy)!=undefined){
			   	  	   				if(getTaxerInfo(rowdata.createBy).username == rowdata.createBy){
			   	  	   					html+='<div>'+getTaxerInfo(rowdata.createBy).name+'</div>';
			   	  	   				}
			   	  	   			}else{
			   	  	   				html+='<div>'+rowdata.createBy+'</div>';
			   	  	   			}
			   	  	   		}
			   	  	   		return '<div style="height: auto;position:absolute;top:44%;left:5%">'+html+'</div>';
	  	            	  } 
   	  	               },
   	  	               //{ text: '审核人',dataField: 'lastUpdateBy', width:'6%'},   	  	          
   	  	               { text: "操作", dataField: 'opt',align:"center",width:"8%",
	  	            	  cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	  	            		var rowsum=rowdata.journalDetails.length;
   	  	            		var h=(10*rowsum)+'px';
	  	            		var rtStr = '<div style="text-align: center;padding-top:'+h+'">';
	  	            		rtStr += '<a class="md-dns JournalView " title="查看"  data-id='+rowdata.boundindex+' ></a>';
	  	            		rtStr += '<a class="md-rate-review icons-18-black JournalEdit editbtn" data-btn="fms:journal:create" title="修改"  data-id='+rowdata.boundindex+' ></a>';
	  	            		//rtStr += '<a class=" md-note-add " title="插入"  data-id='+rowdata.boundindex+' ></a>';
	  	            		rtStr += '<a class="md-cancel  JournalDel delbtn" data-btn="fms:journal:create" title="删除"   data-id='+rowdata.boundindex+' ></a>';
	  	            		rtStr += '</div>';
	  	            		return rtStr;
	  	            	  }   	  	               
	  	              }
   	  	         
   	  	              ]
				},
				
	};
	

	
	//initAdapter
	var demoAdapter = Core.AcDataAdapter("Journal", source,  {
		loadComplete:function(records){
			//console.log(records);
			//console.log("++="+records);
			for(var i=0;i<records.rows.length;i++){
				exportData.push(records.rows[i]);	
			}
		}
		
	}, false);
	
	
	//Grid设置
	var grid_sets = {
			   autorowheight: true,
			   autoheight: true,
			   width:'100%',
    	  	   source:demoAdapter,
    	  	   rendergridrows: function(){
    	  		 var sources=ComboBoxSources.getInfoMapByKey('users','username');
	  	  		   sources.AdminAccount={name:'代理报税'};
	  	  		    $.each(demoAdapter.records,function(i,v){
	  	  		    	try{
	  	  		    		v.createBy=sources[v.createBy].name;
	  	  		    	}catch(e){console.log('i"m bug'+e)}
	  	  		    	try{
	  	  		    		v.entryDate=v.entryDate.substring(0,10);
	  	  		    	}catch(e){console.log('i"m bug'+e)}    	  		    	
	  	  		    	/*try{
	  	  		    		//console.log(v,JSON.stringify(v),v.entryDate,v.boundindex);
	  	  		    		var rtStr = '<div style="text-align: center;">';
		  	            		rtStr += '<a class="md-dns JournalView " title="查看"  data-id='+v.index+' ></a>';
		  	            		rtStr += '<a class="md-rate-review icons-18-black JournalEdit editbtn" data-btn="fms:journal:create" title="修改"  data-id='+v.uid+' ></a>';
		  	            		//rtStr += '<a class=" md-note-add " title="插入"  data-id='+rowdata.boundindex+' ></a>';
		  	            		rtStr += '<a class="md-cancel  JournalDel delbtn" data-btn="fms:journal:create" title="删除" data-id='+v.uid+' ></a>';
		  	            		rtStr += '</div>';
		  	            		v.opt=rtStr;
	  	  		    	}catch(e){}*/
	  	  		    })
	                  return demoAdapter.records;
                },
               columns:settings.grid.columns,
        	   columnsheight:settings.grid.columnsheight,
        	   pagesize: settings.grid.pagesize,
        	   columnsheight: 45,
        	   //editable: true,
        	   //sortable:true,
        	   enablehover:false,
        	   selectionmode: 'checkbox',
        	   //selectionmode:'none'
    };
	$("#"+settings.grid.element).grid(grid_sets);
	
	$("#jouralExportBtn").click(function(){
//		debugger;
		getSearchObj();
		searchDataInfo('Journal');		
		var _url=journalUrl;
		window.open(_global_settings.service.url +"/ac/export/"+ _url);
	});
	
	//发票
	$("#Journal").on("click",".receiptView",function(){
		var i=$(this).attr('data-id');
		var data=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'发票查看',isFrame:false,
			url:'page/modules/fms/receiptView.html',pk:{id:data.bizId, data:data}});
	})
	
	//通用单据
	$("#Journal").on("click",".viewgeneral",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'查看通用单据',isFrame:false,
			url:'page/modules/fms/generalView.html',pk:{id:pk.bizId}});
	});
	
	//采购退款
	$("#Journal").on("click",".viewPurchaseReturnPay",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'退款单',url:'page/modules/biz/viewPayment.html',pk:{id:pk.bizId},reload:true});
	});
	//销售退款
	$("#Journal").on("click",".viewSalesReturnPay",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'退款单',url:'page/modules/biz/viewReceive.html',pk:{id:pk.bizId},reload:true});
	});
	//销售退货
	$("#Journal").on("click",".viewSalesReturn",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'退货单',url:'page/modules/biz/viewGoodsReturn.html',pk:{id:pk.bizId,random:Math.random()},reload:true});
	});
	//采购退货
	$("#Journal").on("click",".viewPurchaseReturn",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'退货单',url:'page/modules/biz/viewGoodsrecReturn.html',pk:{id:pk.bizId,random:Math.random()},reload:true});
	});
	//其他收入
	$("#Journal").on("click",".viewCostIncome",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'查看其他收入',url:'page/modules/prod/viewcostIncome.html',pk:{id:pk.bizId},reload:true});
	});
	
	//费用支出
	$("#Journal").on("click",".viewExpensePayment",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'查看费用支出',url:'page/modules/prod/viewCostPay.html',pk:{id:pk.bizId},reload:true});
	});
	
	//收货
	$("#Journal").on("click",".viewJourReceiveDetail",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'收货单',url:'page/modules/biz/viewReceiveCargo.html',pk:{deliveryOrderId:pk.bizId},reload:true});
	});
	//送货
	$("#Journal").on("click",".viewJourSendDetail",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'送货单',url:'page/modules/biz/viewSendCargo.html',pk:{deliveryOrderId:pk.bizId},reload:true});
	});
	//收款
	$("#Journal").on("click",".viewJourReceiveMoneyDetail",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'收款',url:'page/modules/biz/viewReceive.html',pk:{id:pk.bizId},reload:true});
	});
	//付款
	$("#Journal").on("click",".viewJourPayDetail",function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'付款',url:'page/modules/biz/viewPayment.html',pk:{id:pk.bizId},reload:true});
	});
	
	$('#Journal').on('click','.JournalEdit',function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		//console.log(pk);
		if(pk.journalType!=='input'){
			Core.alert({message:'业务生成凭证不可编辑！'});
			return false;
		}
		//return false;
		$.addTab({title:'编辑凭证',url:'page/modules/fms/JournalEdit.html',pk:pk,reload:true});
	});
	
	$('#Journal').on('click','.JournalView',function(){		
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		$.addTab({title:'查看凭证',url:'page/modules/fms/JournalView.html',pk:pk,reload:true});
	})
	
	$('#Journal').on('click','.JournalDel',function(){
		var i=$(this).attr('data-id');
		var pk=$('#Journal').jqxGrid('getrowdata',i);
		if(pk.journalType==='auto'){
			Core.alert({message:'业务生成凭证不可删除！'});
			return false;
		}
		var id=pk.id;
		//var id=$(this).attr('data-id');
		Core.confirm({
			message:"确定要删除？",
			confirmCallback:function(){
				Core.AjaxRequest({
	                url : _global_settings.service.url+ "/ac/"+new Base64().encode('tosys/coaReport/'+id+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
	                type: "DELETE",	
	                dataType:'text',
	                showMsg:false,
	                callback: function(res) {
	                	Core.alert({message:''+res+'',hide:'2000'});
	                	refreshDataInfo('Journal');
	                },
	                failure:function(res){
	                }
	            });
			}
		});
	})
	
	
	// 点击批量打印
	$("#jouralPrintBtn").on("click", function() {
		
		var index = $('#Journal').jqxGrid('getselectedrowindexes');
		console.log(index);
		console.log(exportData);
//		debugger;
		if(exportData!=undefined||exportData!=''||exportData!=null){
			if(index.length==0){
				Core.alert({message:'请选择需要打印的项'});
			}else if(index.length>0){
				var arr = [];
				var resultId = null;
				
				$.each(index,function(i,v){
					if(exportData[index[i]]!=undefined){
						console.log(exportData);
						indexId = exportData[index[i]].id;
						arr.push(indexId);
					}
				});
				resultId = arr.join(",");
				console.log(resultId);
				
				var url1 = new Base64().encode("printHtml2reportName=JournalPrint2&journalsId="+resultId+"&printType=pdf&ownerId="+currentUserInfo.id+'&username='+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c");
				window.open(_global_settings.service.url+"/ac/print/"+url1);
			}
		}
	});
	
	
	//批量打印
//	printList({
//		btn:'#jouralPrintBtn',	
//		grid:'#Journal',	
//		reportName:'JournalPrint2',
//		idName:'journalsId',
//	});
	
	
	$("#addpingzheng").click(function(){
		$.addTab({title:'新增凭证',url:'page/modules/fms/JournalDetail.html'});
	});

	
	
	$('.jouralSearchtime').datetimeinput({formatString: "yyyy-MM-dd",width:'100%', height: '33px'});
	
	$('#journalTm2').val(new Date());
	
	/*$('#JournalSelectTime').on('change',function(){
		console.info('look:'+$(this).attr('id'));
		setValueById('JournalSelectTime','journalTm1');
	});*/
		
	
	function getSearchObj(){
		if($('#journalMn1').val()!==''&&$('#journalMn2').val()!==''){
			search1['t.journal.totalAmt']={value:[$('#journalMn1').val(),$('#journalMn2').val()],action:'between'};			
		}else if($('#journalMn1').val()!==''&&$('#journalMn2').val()===''){
			search1['t.journal.totalAmt']={value:[$('#journalMn1').val()],action:'ge'};			
		}else if($('#journalMn1').val()===''&&$('#journalMn2').val()!==''){
			search1['t.journal.totalAmt']={value:[$('#journalMn2').val()],action:'le'};			
		}else{
			delete search1['t.journal.totalAmt'];
		}
		if($('#journalTm1').val()!==''&&$('#journalTm2').val()!==''){
			search1['t.journal.entryDate']={value:[$('#journalTm1').val()+" 00:00:00",$('#journalTm2').val()+" 23:59:59"],action:'between'};			
		} else if ($('#journalTm1').val()!==''&& $('#journalTm2').val()===''){
			search1['t.journal.entryDate']={value:[$('#journalTm1').val()+" 00:00:00",getNowFormatDate()+" 23:59:59"],action:'between'};
		}else if ($('#journalTm1').val()===''&& $('#journalTm2').val()!==''){
			search1['t.journal.entryDate']={value:["2015-01-01"+" 00:00:00", $('#journalTm2').val()+" 23:59:59"],action:'between'};
		}else{
			delete search1['t.journal.entryDate'];
		}
		if($('#journalNumber').val()!==''){
			number = $('#journalNumber').val();
			number = number.substring(0,2);
			type = '';
			value = $('#journalNumber').val();
			if(number=='Y0'){
				type = 'auto';
				value = $('#journalNumber').val().substring(2);
			}
			if(number=='S0'){
				type = 'input';
				value = $('#journalNumber').val().substring(2);	
			}
			if(number=='Z0'){
				type = 'carryover';
				value = $('#journalNumber').val().substring(2);
			}
			if(type == ''){
				number = number.substring(0,1);
				if(number=='Y'){
					type = 'auto';
					value = $('#journalNumber').val().substring(1);
				}
				if(number=='S'){
					type = 'input';
					value = $('#journalNumber').val().substring(1);
				}
				if(number=='Z'){
					type = 'carryover';
					value = $('#journalNumber').val().substring(1);
				}
			}
			
			if(value!=''){
				search1['t.journal.journalNumber']={value:[value],action:'like'};
			}else{
				delete search1['t.journal.journalNumber'];
			}
			if(type!=''){
				search1['t.journal.journalType']={value:[type],action:'eq'};
			}else{
				delete search1['t.journal.journalType'];
			}
		}else{
			delete search1['t.journal.journalNumber'];
			delete search1['t.journal.journalType'];
		}	
		if($('#journaldescription').val()!==''){
			search1['t.description']={value:[$('#journaldescription').val()],action:'like'};
		}else{
			delete search1['t.description'];
		}	
		if($('#journalCoa').val()!==''){
			search1['t.chartOfAccount.name']={value:[$('#journalCoa').val()],action:'like'};
		}else{
			delete search1['t.chartOfAccount.name'];
		}	
		console.log(search1);
		
		
	}
	
	
	/**
	 * 查询列表数据
	 */
    function searchDataInfo(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('applyfilters');
    	$("#"+el).jqxGrid('refreshfilterrow'); 
    	$("#"+el).jqxGrid('clearselection');
    };
	
	 /**
     * 刷新
     */
    var refreshDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('updatebounddata', 'cells');
    	$("#"+el).jqxGrid('clearselection');
    	$('#'+el).jqxGrid('refreshdata');
    };
    
    window.refreshJournalGrid=refreshDataInfo;

});
function downloadTemplate(){
	var urls
	if(getHostName()=='localhost'){
		urls ='/SimpleBss/template/JournalImportModel.xls';
	}else{
		urls ='template/JournalImportModel.xls';
	}
	window.open(urls);
}
