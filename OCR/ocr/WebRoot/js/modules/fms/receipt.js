/**
 * 发票分页js
 */

var ReceiptMgt = function(){
	var me = this;
	var url = _global_settings.service.url;
	var clientCRd = null;
	var clientARd = null; 
	
	this.initInput = function(){
		$('#receipt-show').css('display','');
		$('#receipt-show').addClass('hiddendiv');
//		me.initUserPages();
		me.initInterface();
		me.initGrid(me.searchObj);
		me.bindModel();
	}
	
	this.initUserPages = function(){
		$("#rcpt-startTime").datetimeinput({
			width:'100%',
			height:33,
			formatString:"yyyy-MM-dd"
		});
		
		$("#rcpt-endTime").datetimeinput({
			width:'100%',
			height:33,
			value:new Date()
		});
		
		$("#rcpt-time").dropDownlist({
			source:["请选择 ","最近一周","最近两周","最近三周","本月","本季度","本年"],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		$("#rcpt-category").dropDownlist({
			source:{'all':'全部',"otherinvoice":"其他","specialinvoice":"增值税专用发票","ordinaryinvoice":"增值税普通发票"},
			width:'100%',
			height:33,
		});
		
		$("#rcpt-type").dropDownlist({
			source:{'all':'全部','sales':'开票','purchase':'收票'},
			width:'100%',
			height:33,
		});
		
		$("#rcpt-time").on("change",function(){
			var timeId = $("#rcpt-time").attr("id");
			var startTimeId = $("#rcpt-startTime").attr("id");
			var endTimeId = $("#rcpt-endTime").attr("id");
			setValueById(timeId,startTimeId,endTimeId);
		});
		
		$("#rcpt-addchartOfAccount").coaCombbox({
			width:'90%',
			height:37,
			theme:currentTheme,
			displayMember: "name", 
        	valueMember: "id", 
        	placeHolder:"请输入",
        	searchMode: 'contains'
		},['1001','1002','1012']);
		
		setTimeout(function(){
			$('#receipt-show').attr('class','row hiddendiv');
		},200);
	}
	
	this.initInterface = function(){
		//供应商的获取
		Core.AjaxRequest({
			url:url+'/common/getAllclient/N/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				clientARd = res;
			},
			failure:function(){
			}
		});
		
		//客户的获取
		Core.AjaxRequest({
			url:url+'/common/getAllclient/Y/'+currentUserInfo.id,
			type:'GET',
			async:false,
			callback:function(res){
				clientCRd = res;
			},
			failure:function(){
			}
		});
	}
	
	this.searchObj={
			'receiptNumber':{value:[],action:'like'}
	};
	
	this.getClientCustomer = function(clientId){
		for(i=0;i<clientCRd.length;i++){
			if(clientId==clientCRd[i].clientId){
				return clientCRd[i];
			}
		}
		
		if(!clientId){
			return '';
		}
	}
	
	this.getClientAgent = function(clientId){
		for(i=0;i<clientARd.length;i++){
			if(clientId==clientARd[i].clientId){
				return clientARd[i];
			}
		}
		
		if(!clientId){
			return '';
		}
	}
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.setting.source.data = me.searchObj;
		me.setting.source.url = url+'/receipt/search/'+currentUserInfo.id;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('rcpt-Grid', me.setting.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_set = {
	  	    source:demoAdapter,
			columnsresize: false,
//			autorowheight: true,
//		    autoheight: true,
		    rendergridrows: function(){
	            return demoAdapter.recordids;
	        }
    	   ,columns:[	
						{ text: '公司名称', width:'15%',
						    cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						    	var html='<div class="jqx-grid-cell-left-align" style="margin-top: 6px;">';
						    	if(rowdata.clientid!=undefined){
						  			if(me.getClientCustomer(rowdata.clientid)!=undefined){
						  				html+=me.getClientCustomer(rowdata.clientid).name;
						  			}else if(me.getClientAgent(rowdata.clientid)!=undefined){
						  				html+=me.getClientAgent(rowdata.clientid).name;
						  			}
						  		}
						  		html+='</div>';
				 	    		return html;
						    }},
				 	    { text: '发票日期', width:'15%',
						    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							  		var rtStr = '<div class="grida">'+rowdata.entryDate.substring(0,10)+'</div>';
							  		return rtStr;
							    },
				 	    },
				 	    { text: '发票号码', dataField: 'receiptNumber',width:'15%',
				 	    	cellsrenderer:function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
							var html='<div class="jqx-grid-cell-left-align" style="margin-top: 6px;">';
								html+='<a class="viewRcpt hoverspan" data-btn="biz:sales:view" >'+value+'</a>';
								html+='</div>';
				 	    		return html;
				 	    	}
					    	},        	
				 	    { text: '类型',width:'15%',
				 	    	cellsrenderer:function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
							var html='<div class="jqx-grid-cell-left-align" style="margin-top: 6px;">';
								html+=rowdata.receiptType=='sales'?'开票':'收票';
								html+='</div>';
				 	    		return html;
				 	    	}
				 	    },      	
				 	    { text: '发票类别', dataField: 'receiptInvoiceType',width:'14%',
				 	    	cellsrenderer:function(row, columnfield, value, defaulthtml, columnproperties, rowdata){
								var html='<div class="jqx-grid-cell-left-align" style="margin-top: 6px;">';
								if(rowdata.receiptInvoiceType=='otherinvoice'){
									html+='其他';
								}else if(rowdata.receiptInvoiceType=='specialinvoice'){
									html+='增值税专用发票';
								}else if(rowdata.receiptInvoiceType=='ordinaryinvoice'){
									html+='增值税普通发票';
								}else{
									html+='';
								}
								html+='</div>';
				 	    		return html;
				 	    	}
				 	    },        	
				 	    { text: '发票金额', dataField: 'receiptAmt',width:'14%',cellsalign:'right',cellsformat: 'c2'},        	
//				 	    { text: '已匹配金额', dataField: 'eAmt',width:'12%',cellsalign:'right',cellsformat: 'c2'},	                	
				 	    { text: '未匹配金额', dataField: 'unuseAmt',width:'12%',cellsalign:'right',cellsformat: 'c2'},        	
				 	    /*{ text: '操作',width:'12%',cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
				     		var rtStr = '<div style="text-align:center;padding-top:2px">';
				     		rtStr += '<a class="color-1193C5 hoverspan md-dns viewRcpt " data-btn="" title="查看"></a>';
				  		rtStr += '<a class="color-1193C5 hoverspan md-rate-review editRcpt " data-btn="" title="编辑"></a>';
				  		rtStr += '<a class="color-1193C5 hoverspan md-cancel delRcpt " data-btn="" title="删除"></a>';
				  		rtStr += '</div>';
				  		return rtStr;
				     	}},   */  
	  	    ],
    	   columnsheight: 50,
	    };
		$('#rcpt-Grid').grid(grid_set);

	}
	
	this.setting = {  
			source:{ data:me.searchObj },
			grid:{element:'rcpt-Grid'},
			ajax:{url:url},
		};
	
	this.searchDataInfo = function(){
    	$('#rcpt-Grid').jqxGrid('applyfilters');
    	$('#rcpt-Grid').jqxGrid('refreshfilterrow'); 
    	$('#rcpt-Grid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#rcpt-Grid').jqxGrid('updatebounddata', 'cells');
    	$('#rcpt-Grid').jqxGrid('clearselection');
    	$('#rcpt-Grid').jqxGrid('refreshdata');
    };
	
	this.bindModel = function(){
		
		$("#rcpt-Grid").on('click','.viewRcpt',function(){
			var rowindex = $("#rcpt-Grid").jqxGrid('getselectedrowindex');
			if(rowindex>=0){
				var data = $("#rcpt-Grid").jqxGrid('getrowdata',rowindex);
				console.log(data);
				if(data.dcmid==undefined){
					$.addTab({title:'发票查看',isFrame:false,url:'page/modules/fms/receiptView.html',
						pk:{data:data},reload:true});
				}else{
					$.addTab({title:'通用单据查看',isFrame:false,url:'page/modules/fms/generalView.html',
						pk:{data:data},reload:true});
				}
			}
		})
		
//		新增
		$('#addrcpt-btn').on('click',function(){
			$.addTab({title:'新增发票',url:'page/modules/fms/receiptAdd.html'});
		});
		
//		导入
		$('#importrcpt-btn').on('click',function(){
			var obj = {url : url + '/ac/file/' + new Base64().encode('tobss/receipt/importReceipt/'+_global_settings.owner.username+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId)};
			$('#receipt-attachment').html('');
			$('#receipt-modal').modal('show');
			$('#receipt-attachment').fileuploader(obj);
		});
		
		//导入之后
		$("#receipt-modal").find(".glyphicon-remove").on({"click":function(){
			 $('.modal-backdrop').css('display','none');
		}});
		
		//下载模板
		$('#downloadrcpt-btn').off('click').on('click',function(){
			var sUrl = '192.168.1.3:8080/SimpleBss/' ;
			if(getHostName() == 'localhost' || sUrl.indexOf(getHostName())>-1){
				var urls ='/SimpleBss/CXF/rs/common/export/receiptImport/0';
			}else{
				var urls ='/CXF/rs/common/export/receiptImport/0';
			}
			window.open(urls);
		})
		
//		搜索
		$('#rcpt-search').on('click',function(){
			if($('#receipt-show').is(':hidden')){
				$('#receipt-show').slideDown('show');
			}else{
				me.search();	
			}
		});
		
		hiddenAclick();
	}
	
	
	
	this.search=function(){
		var receiptNum = $('#rcpt-num').val();
		me.searchObj['receiptNumber'].value = [];
		if(receiptNum!=''){
			me.searchObj['receiptNumber'].value.push(receiptNum);
		}
		me.searchDataInfo();
	}
	this.unbindAll = function(){
		
	}

}