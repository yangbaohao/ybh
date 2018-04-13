(function(){
	
	
	var random=new Date().getTime();
	
	var arr=['JournalViewdatepicker',            
	         'JournalViewjournalNumber',            
	         'JournalViewjournalnoteNumber',        
	         'JournalViewTable',        
	         'JournalViewNumSumcn',        
	         'JournalViewNumSum1',        
	         'JournalViewNumSum2',        
	         'journalViewcreateBy',
	         'JournalViewremarkPrint',        
	         'JournalViewPrint',        
	         'JournalViewattachment',        
	         'journal-btn',        
	         //'voidViewJournalBtn',        
	         'JournalView_jqxgridComment',     
	         'JournalView_auditBtnSP',        
	         'JournalView_auditBtn',        
	         'JournalViewTableAddAndSubmit',
	         'JournalView-btn-print'];
	for(var i in arr){
		$('#'+arr[i]).attr('id',arr[i]+random) ;
	}
	
	var url = _global_settings.service.url +"/favourites";
	var list=$.pk;
	var taskId=$.pk.taskId;
	var parent=$.pk.parent;
	console.log(list,$.pk);
	var creditAmtsum=0;
	
	/**
	 * getTaxerInfo 拉出所有报税人名单,姓名,id
	 */
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
	
	var pre = "JournalView_";
	
	var initAuditInfo = function(obj){
//		console.log(obj);
		//初始化审批列表
		$("#"+pre+"jqxgridComment"+random).auditList({bpmnObj:obj});
		
		//初始化提交窗口
		$("#"+pre+"jqxgridComment"+random).auditWindow({pre:'JournalView_'+random,parent:parent,url:'journal',id:list.id,type:'view',callback:$.closeTab});
		
		$("#"+pre+'auditBtn'+random).on({'click':function(){
			$("#"+pre+random+"winAudit").jqxWindow("open");
		}});
		
		//初始化审批窗口
		$("#"+pre+"jqxgridComment"+random).auditWindowSP({pre:'costExpense_'+random,parent:parent,value:taskId,callback:$.closeTab});
		
		$("#"+pre+'auditBtnSP'+random).on({'click':function(){
			$("#"+pre+random+"winAuditSP").jqxWindow("open");
		}});
	};
	
	var coalist=ComboBoxSources.getInfoMapByKey('chartOfAccounts','hardCode');
	var coaIdlist=[];
	var selectedIdList=[];
	coaIdlist.push(coalist['2203'].id);
	coaIdlist.push(coalist['1122'].id);
	coaIdlist.push(coalist['1123'].id);
	coaIdlist.push(coalist['2202'].id);
	coaIdlist.push(coalist['1001'].id);
	coaIdlist.push(coalist['1002'].id);
	coaIdlist.push(coalist['1012'].id);
	
	var pipiViewCoaView=function(list){		
		
		var type=list.journalRelationType;
		if(type=='unassociation'||type==null){
			return ;
		}
		$.addHide('#JournalView_pipiView');
		$.addHide('.pipiView');
		$.addHide('#pipiViewclinet','#pipiViewvendor','#pipiViewcreateby','#pipiViewusers_mon','#pipiViewusers','#pipiViewtermValue');
		pipiViewusers_mon=0;
		if($.inArray(coalist['1221'].id,selectedIdList)!=-1){
			$.removeHide('#JournalView_pipiView');
			$.removeHide('#pipiViewusers');
			
			var journalDetails=list.journalDetails;
			var len=journalDetails.length;
			for(var i=0;i<len;i++){
				if(journalDetails[i].chartOfAccount.id=='26'&&journalDetails[i].creditAmt!=0){
					$.removeHide('#pipiViewusers_mon');
					pipiViewusers_mon=journalDetails[i].creditAmt;
					break;
				}
			}
		}

		if(type!=='unassociation'){			
			$.removeHide('#JournalView_pipiView');
			$.removeHide('.pipiView');		
			$.removeHide('#pipiViewcreateby');	
			$.removeHide('#pipiViewusers');	
			$.removeHide('#pipiViewtermValue');
			if(type=='inflow'){
				$.removeHide('#pipiViewclinet');	
				$('.JournalView_returnFlag').text('供应商退款');	
			}
			if(type=='outflow'){
				$.removeHide('#pipiViewvendor');	
				$('.JournalView_returnFlag').text('客户退款');	
			}		
		}
		
		if(type=='unassociation'){			
				var bool=false;
				//debugger
				var journalDetails=list.journalDetails;
				var len=journalDetails.length;
				
				for(var i=0;i<len;i++){
					var _coaid=journalDetails[i].chartOfAccount.id;
					if(_coaid!=''){
						if($.strInArr(getProductInfoById(_coaid,'chartOfAccounts').hardCode,['1001','1002','1012'])){
							if(journalDetails[i].creditAmt!=0){
								$.removeHide('#pipiViewtermValue');
								$.removeHide('#JournalView_pipiView');
								if($('#JournalView_returnFlag').is(':checked')){
									$.removeHide('#pipiViewclinet');
								}else{
									$.removeHide('#pipiViewvendor');									
									$('.JournalView_returnFlag').text('客户退款');		
								}
								return ;
							}else{
								$.removeHide('#pipiViewtermValue');
								$.removeHide('#JournalView_pipiView');
								if($('#JournalView_returnFlag').is(':checked')){
									$.removeHide('#pipiViewvendor');
								}else{
									$.removeHide('#pipiViewclinet');
									$('.JournalView_returnFlag').text('供应商退款');	
								}
								return ;
							}
						}
						if(coalist['2203'].id==_coaid||coalist['1122'].id==_coaid){
							$.removeHide('#pipiViewtermValue');
							$.removeHide('#JournalView_pipiView');
							if($('#JournalView_returnFlag').is(':checked')){
								$.removeHide('#pipiViewvendor');	
							}else{
								$.removeHide('#pipiViewclinet');
								$('.JournalView_returnFlag').text('供应商退款');		
							}
							return ;
						}
						if(coalist['1123'].id==_coaid||coalist['2202'].id==_coaid){
							$.removeHide('#pipiViewtermValue');
							$.removeHide('#JournalView_pipiView');
							if($('#JournalView_returnFlag').is(':checked')){
								$.removeHide('#pipiViewclinet');
							}else{
								$.removeHide('#pipiViewvendor');								
								$('.JournalView_returnFlag').text('客户退款');		
							}
							return ;
						}
					}
				}
		}
		if(type=='inflow'||type=='unassociation'){
			if($('#JournalView_returnFlag').is(':checked')&&$('#JournalView_returnFlag').is(':visible')){
				$.removeHide('#pipiViewvendor');
				$.addHide('#pipiViewclinet');	
			}
		}
		
		if(type=='outflow'){
			if($('#JournalView_returnFlag').is(':checked')&&$('#JournalView_returnFlag').is(':visible')){
				$.removeHide('#pipiViewclinet');
				$.addHide('#pipiViewvendor');		
			}					
		}
	};
	/*var pipiViewCoaView=function(type){		
		//debugger
		$.addHide('#JournalView_pipiView');
		$.addHide('.pipiView');
		$.addHide('#pipiViewclinet','#pipiViewvendor','#pipiViewcreateby','#pipiViewusers_mon','#pipiViewusers','#pipiViewtermValue');
		if($.inArray(coalist['1221'].id,selectedIdList)!=-1){
			$.removeHide('#JournalView_pipiView');
			$.removeHide('#pipiViewusers');		
			
			var _jdList=list.journalDetails;
			var len=_jdList.length;
			for(var i=0;i<len;i++){
				if(_jdList[i].chartOfAccount.id=='26'&&_jdList[i].creditAmt!=0){
					$.removeHide('#pipiViewusers_mon');
					break;
				}
			}
		}
		
		if(type=='unassociation'){
				var bool=false;
				for(var i=0;i<selectedIdList.length;i++){
					if($.strInArr(getProductInfoById(selectedIdList[i],'chartOfAccounts').hardCode,['1001','1002','1012'])){
						bool=true;
						break;
					}
				}
				
				if($.inArray(coalist['2203'].id,selectedIdList)!=-1||$.inArray(coalist['1122'].id,selectedIdList)!=-1
						||bool){
					$.removeHide('#JournalView_pipiView');
					//$.removeHide('#pipiViewallclient');
					$.removeHide('#pipiViewclinet');
					$.removeHide('#pipiViewtermValue');
				}
				if($.inArray(coalist['1123'].id,selectedIdList)!=-1||$.inArray(coalist['2202'].id,selectedIdList)!=-1){
					$.removeHide('#JournalView_pipiView');
					//$.removeHide('#pipiViewallclient');
					$.removeHide('#pipiViewvendor');
					$.removeHide('#pipiViewtermValue');
				}
		}
		
		if(type!=='unassociation'){		
			$.removeHide('#JournalView_pipiView');
			$.removeHide('.pipiView');		
			$.removeHide('#pipiViewusers');
			$.removeHide('#pipiViewcreateby');				
		}
		if(type=='inflow'){
			if($('#JournalView_returnFlag').is(':checked')){
				$.removeHide('#pipiViewvendor');
				$.addHide('#pipiViewclinet');
				$.removeHide('#pipiViewtermValue');
			}else{
				$.removeHide('#pipiViewclinet');
				$.addHide('#pipiViewvendor');
				$.removeHide('#pipiViewtermValue');
			}
		}
		$('.JournalView_returnFlag').text('供应商退款');
		if(type=='outflow'){
			if($('#JournalView_returnFlag').is(':checked')){
				$.removeHide('#pipiViewclinet');
				$.addHide('#pipiViewvendor');
				$.removeHide('#pipiViewtermValue');
			}else{
				$.removeHide('#pipiViewvendor');
				$.addHide('#pipiViewclinet');
				$.removeHide('#pipiViewtermValue');
			}
			$('.JournalView_returnFlag').text('客户退款');
		}
	};*/
	
	loadHtml(list);
	
	//绑定提交到工作流按钮事件
	/*viewPageSubmitBtn('JournalViewTableAddAndSubmit'+random,_global_settings.service.url+'/journal/commit/id',
			list.id);*/
	
	//作废按钮
	//viewPageCancelBtn('voidViewJournalBtn'+random,url,list.id);
	
	function loadHtml(list){
		try{
			$('#JournalViewdatepicker'+random).val(list.entryDate.substring(0,10)/*.toLocaleDateString().replace(/\//g,'-')*/);
		}catch(e){
			console.log(e+list.entryDate)
		}
//		$('#JournalViewdatepicker').val(list.entryDate.format('yyyy-MM-dd'));
		$('#JournalViewjournalNumber'+random).val(list.journalNumberForShow);
		$('#JournalViewjournalnoteNumber'+random).val(list.noteNumber);
		$('#JournalViewremarkPrint'+random).val(list.remark);
		$('#JournalViewPrint'+random).val(list.remarkPrint);
		
		var createBy = null;
		if(list.createBy=='AdminAccount'){
			createBy = '代理报税';
   		}else{
   			if(getTaxerInfo(list.createBy)!=undefined){
   				if(getTaxerInfo(list.createBy).username == list.createBy){
   					createBy = getTaxerInfo(list.createBy).name;
   				}
   			}else{
   				createBy = list.createBy;
   			}
   		}
		$('#journalViewcreateBy'+random).val(createBy);
		//文件列表
		$("#JournalViewattachment"+random).fileuploader({bool:true,readonly:true,filelist:list.fileInfoIds});
		var rows=list.journalDetails;
		for(var i in rows){
			loadList(rows[i]);
		}		
		
		if(list.clientId!=null){
			var name=getProductInfoById(list.clientId,'clientInfo',null,'clientInfoid').name;
			$("#JournalView_clinet").val(name);
			$("#JournalView_vendor").val(name);
		}
		if(list.personId!=null){
			var personId=getProductInfoById(list.personId,'users',null,'userid').name;
			$("#JournalViewusers").val(personId);
		}
		if(list.generalDocumentsCreateBy!=null){
			var generalDocumentsCreateBy=getProductInfoById(list.generalDocumentsCreateBy,'users',null,'username').name;
			$("#JournalView_ordercreateby").val(generalDocumentsCreateBy);
		}
		$("#JournalView_receiptType").val(getCodeData(list.receiptInvoiceType));	
		if(list.vat!=null)
		$("#JournalView_tax").val(list.vat+'%');
		$("#JournalView_receiptNum").val(list.receiptNumber);
		$("#JournalView_termValue").val(list.termValue);
		$("#JournalView_returnFlag")[0].checked=list.returnFlag;
		timeOut(function(){
			$('#JournalView_type').val(getCodeData(list.journalRelationType));
			pipiViewCoaView(list);
		},0)
		
		$('#JournalViewusers_mon').val(list.prepareAmt);
		/*if(list.journalBizType=='expensePayment'&&list.personId!=null){
			Core.AjaxRequest({
				type : "GET",		
				url : ws_url + "/CXF/rs/autolist/stuff/"+list.personId,
				callback : function(res) {
					var data=res;
					var value=''
					$.each(data,function(i,v){
						if(v.id==list.expensePaymentId)
							value=money(v.amt)+'('+v.type+')';
						return ;
					})
					$('#JournalViewusers_mon').text(value);
				}
			});
		}*/
		if(list.receiptInvoiceType==null||list.receiptInvoiceType==''){
			$('.JournalView_receiptType_show').hide();
		}
		$('#JournalViewNumSumcn'+random).text("人民币"+digitUppercase(creditAmtsum));
		//mee
		if($('#JournalViewNumSumcn'+random).text().substr(-1,1)=='角'){
			$('#JournalViewNumSumcn'+random).text($('#JournalViewNumSumcn'+random).text()+'整');
		}
		$('#JournalViewNumSum1'+random).text('￥'+money(creditAmtsum));
		$('#JournalViewNumSum2'+random).text('￥'+money(creditAmtsum));
		
		
	};
	

	    function loadList(list){			
				var description=list.description===(null||undefined)?'':list.description;
				selectedIdList.push(list.chartOfAccount.id);
				var displayValue=getProductInfoById(list.chartOfAccount.id,'chartOfAccounts').displayValue;
				var creditAmt=list.creditAmt;
				var debitAmt=list.debitAmt;
				var category1=list.category1==null?'':list.category1;
				var category2=list.category2==null?'':list.category2;

				creditAmtsum+=creditAmt;
				creditAmt=creditAmt==0?'':'￥'+money(creditAmt);
				debitAmt=debitAmt==0?'':'￥'+money(debitAmt);
			    var html='<tr data-index="0">'+
			    '<td style="">'+description+'</td>'+
			    '<td style="">'+displayValue+'</td>'+
			    '<td style="">'+debitAmt+'</td>'+
			    '<td style="">'+creditAmt+'</td>'+
			    '<td style="">'+category1+'</td>'+
			    '<td style="">'+category2+'</td>'+
			    '</tr>';			 

				$('#JournalViewTable'+random).append(html);			   
		}
		
		$('#JournalViewAddBtn'+random).on('click',function(){
			$.addTab({title:'新增凭证',url:'page/modules/fms/JournalDetail.html',reload:true});
		});
	    
	   
	    
		
		
		//点击收藏
		$('#journal-btn'+random).on('click',function(){
			var data={};
			data.amount=$("#JournalViewNumSum1"+random).text().substring(1);
			data.orderNumber=$('#JournalViewjournalNumber'+random).val();
			data.clientInfoId='';
			data.bizId=list.id;
			data.favouritesType='Journal';
			console.log(data);
			Core.AjaxRequest({            
	            url:url,
				type: "POST",
	            params:data,
	            callback: function(res) {
	            	
	            },
	            failure:function(res){
	            }
	        });
		});
		//点击打印
		$('#JournalView-btn-print'+random).on('click',function(){
			var url1 = new Base64().encode("reportName=JournalPrint&journalId="+list.id+"&printType=pdf&ownerId="+currentUserInfo.id+'&username='+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c");
			window.open(_global_settings.service.url+"/ac/print/"+url1);
		});
})()