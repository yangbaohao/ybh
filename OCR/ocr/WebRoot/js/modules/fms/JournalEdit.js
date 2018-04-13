(function(){	

	setTimeout($.addTabCloseEvent,200);
	
	var i=2;
	
	var journalNumber=null;
	
	var blurEvent = function(event){
		var input = $(this);
		var value = input.val();
		if(value!='' && JournalEditTableCheckNum(value)){
			$(this).css('border','');
			input.val(money(value).replace('-',''));
		}
		else{
			input.val('');
		}
	};
	
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
	
	var html=function(){
    	var html = '';
		html+='<tr data-index="'+i+'">                                                                               ';
		html+='	<td style=""><input class="JournalEditChart form-control" type="text"></td>                                                           ';
		html+='	<td style=""><div class="JournalEditSelect"></div>                                                      ';
		html+='	</td>                                                                                  ';
		html+='	<td style=""><input class="JournalEditNum numBorrow2 form-control" type="text"></td>                                                           ';
		html+='	<td style=""><input class="JournalEditNum numLoad2 form-control" type="text"></td>                                                           ';
		html+='	<td style="">                                                      ';
		html+='			<div class="JournalEdittp1"></div>                                                      ';
		html+='	</td>                                                                                  ';
		html+='	<td style="">                                                    ';
		html+='			<div class="JournalEdittp2"></div>                                                  ';
		html+='	</td>                                                                                  ';
		html+='	<td class="del_icon" style=""><i class="    md-cancel     JournalEditDel"></i>';
		html+='	</td>                                                                                           ';
		html+='</tr>           ';
		return html;
    };
    
    
	$('.JournalEdittp1').comboBoxType({source:ComboBoxSources.getRecords('category1'),height:'33px'});
	$('.JournalEdittp2').comboBoxType({source:ComboBoxSources.getRecords('category2'),height:'33px'});
	
	$("#JournalEdit-addCategory1Btn").on({
		"click":function(){			
			var type = $(this).attr("data");
			Core.showModal({
				type:type,
				broth:".JournalEdittp1",
				callback:function(res){
				}
			});
		}
	});		
	$("#JournalEdit-addCategory2Btn").on({
		"click":function(){
			var type = $(this).attr("data");
			Core.showModal({
				type:type,
				broth:".JournalEdittp2",
				callback:function(res){
					
				}
			});
		}
	});
	
	var list=$.pk;
	
	var ready=false; 
	
	var creditAmtsum=0;
	
	var getJson=function(){
		var fileInfoIds = [];//文件列表
		$("#JournalEditattachment").find(".item").each(function(i,v){
			var fid = $(v).attr('data-id');
			if(fid !== undefined){
				fileInfoIds.push(fid);
			}
		});
		
		var arr= getJournalEditTableList();
		
		var json={
				//noteNumber:fileInfoIds.length,
				noteNumber:$('#journalEditnoteNumber').val(),
				fileInfoIds:fileInfoIds.toString(),
				id:$('#journalEditid').val(),
			    "remark": $('#JournalEditRemark').val(),
			    //"ownerId": 66,
			    "journalType": "input",
			    //"creditAmt": 234567,
			    //"lastUpdateBy": "",
			    //"createBy": $('#journalEditcreateBy').val(),
			    entryDate:$('#datepickerEdit').val()+' '+ getHMS(),
			    "currency": "RMB",
			    //"lastUpdateDate": "2016-04-23 13:19:24",
			    //"debitAmt": 234567,
			    "journalNumber": journalNumber,
			    "remarkPrint": $('#JournalEditRemarkPrint').val(),
			    //"createDate": $('#datepicker').val()+' '+ getHMS(),
			    journalDetails:arr
		};
		console.log(JSON.stringify(json));
		return json;
	};
	
	$('#JournalEdit_receiptType').dropDownlist({
		source:{'请选择':'请选择','specialinvoice':'增值税专用发票','ordinaryinvoice':'增值税普通发票','otherinvoice':'其他'},
		width:'100%',
		selectedIndex:0
	})
	
	$('#JournalEdit_type').dropDownlist({
		source:{'unassociation':'不匹配','inflow':'资金流入','outflow':'资金流出','OtherAssociation':'其他'},
		//selectedIndex:0
	})
	
	$('#JournalEdit_tax').dropDownlist({
		source:{"0":"0%","3":"3%","5":"5%","6":"6%","11":"11%","13":"13%","17":"17%"},
		selectedIndex:0
	})
	
	$('#JournalEdit_receiptType').on('change',function(){
		var v=$(this).val();
		if(v=='请选择'){
			$('.JournalEdit_receiptType_show').hide();
		}else{
			$('.JournalEdit_receiptType_show').show();
		}
	});
	
	/*$('#JournalEdit_allclient').comboBox({
		source:ComboBoxSources.getRecords('clientInfo'),
		displayMember: "name", 
		valueMember: "clientInfoid",
		//selectedIndex:0
	})*/
	
	Core.AjaxRequest({
		type:'GET',
		url:_global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/clientInfos/Y/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
		async:false,
		callback:function(data){
			console.log(data);
			$('#JournalEdit_clinet').comboBox({
				source:data,
				displayMember: "name", 
				valueMember: "clientInfoid",
				placeHolder:'请选择'
			})
		}
	});
	
	Core.AjaxRequest({
		type:'GET',
		url:_global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/clientInfos/N/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
		async:false,
		callback:function(data){
			console.log(data);
			$('#JournalEdit_vendor').comboBox({
				source:data,
				displayMember: "name", 
				valueMember: "clientInfoid",
				placeHolder:'请选择'
			})
		}
	});
	
	
//	$('#JournalEdit_clinet').comboBox({
//		source:ComboBoxSources.getRecords('customer'),
//		displayMember: "name", 
//		valueMember: "clientInfoid",
//		placeHolder:'请选择'
//		//placeHolder:'客户员工二选一'
//		//selectedIndex:0
//	})
	
//	$('#JournalEdit_vendor').comboBox({
//		source:ComboBoxSources.getRecords('vendor'),
//		displayMember: "name", 
//		valueMember: "clientInfoid",
//		placeHolder:'请选择'
//		//placeHolder:'供应商员工二选一',
//		//selectedIndex:0
//	})
	
	$('#JournalEdit_ordercreateby').comboBox({
		source:ComboBoxSources.getRecords('users'),
		displayMember: "name", 
		valueMember: "username",
		placeHolder:'请选择'
		//selectedIndex:0
	}).val(list.generalDocumentsCreateBy);
	$('#JournalEditusers').comboBox({
		source:ComboBoxSources.getRecords('users'),
		displayMember: "name", 
		valueMember: "userid",
		placeHolder:'请选择',
		width:'100%',
		height:'33px'
		//selectedIndex:0
	})
	
	/*$('#JournalEditusers_mon').comboBox({
		placeHolder:'请选择'
	})*/
	var user_mon=function(userid){
		if(ready==false) return ;
		if(userid==''){			
			$('#JournalEditusers_mon').val('');
			return ;
		}
		Core.AjaxRequest({
			type : "GET",		
			url : _global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/userAmt/'+userid+'/create/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback : function(res) {
				var data=res;
				$('#JournalEditusers_mon').val(money(res));
				/*$.each(data,function(i,v){
					v.lable=money(v.amt)+'('+v.type+')';
				})
				console.log(data);
				$('#JournalEditusers_mon').comboBox({
					source:data,
					displayMember: "lable", 
					valueMember: "id",
					placeHolder:'请选择'
					//selectedIndex:0
				})*/
			}
		});
	}
	
	/*$('#JournalEdit_allclient').on('change',function(){
		$('#JournalEditusers').jqxComboBox('clearSelection');	
		$('#JournalEditusers_mon').jqxComboBox('clearSelection');
	});*/
	var customerTermValue=function(id){
		if(ready==false) return ;
		if(id==null) return ;
		if(id==''){
			$('#JournalEdit_termValue').val('');
			return ;
		}
		Core.AjaxRequest({
			type : "GET",		
			url : _global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/search/clientinfo/id/'+id+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback : function(res) {
				var t=res;
				var termValue=t.customerTermValue==null?'':t.customerTermValue;		
				$('#JournalEdit_termValue').val(termValue);
			}
		});
	}
	var vendorTermValue=function(id){
		if(ready==false) return ;
		if(id==null) return ;
		if(id==''){
			$('#JournalEdit_termValue').val('');
			return ;
		}
		Core.AjaxRequest({
			type : "GET",		
			url : _global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/search/clientinfo/id/'+id+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback : function(res) {
				var t=res;
				var termValue=t.vendorTermValue==null?'':t.vendorTermValue;		
				$('#JournalEdit_termValue').val(termValue);
			}
		});
	}
	
	
	
	
	
	
	var selectedIdList=[];
	
	var pipiusers_mon=0;
	
	var pipiEditCoaView=function(list){		
		//debugger
		var type=$('#JournalEdit_type').val();
		$.addHide('#JournalEdit_pipiEdit');
		$.addHide('.pipiEdit');
		$.addHide('#pipiEditclinet','#pipiEditvendor','#pipiEditcreateby','#pipiEditusers_mon','#pipiEditusers','#pipiEdittermValue');
		if(type=='unassociation'){
			return ;
		}
		pipiEditusers_mon=0;
		if($.inArray(coalist['1221'].id,selectedIdList)!=-1){
			$.removeHide('#JournalEdit_pipiEdit');
			$.removeHide('#pipiEditusers');
			
			var list=getJournalEditTableList();
			var len=list.length;
			for(var i=0;i<len;i++){
				if(list[i].chartOfAccount.id=='26'&&list[i].creditAmt!=0){
					$.removeHide('#pipiEditusers_mon');
					pipiEditusers_mon=list[i].creditAmt;
					break;
				}
			}
		}
		if($('#JournalEdit_clinet').is(':visible')){
			customerTermValue($('#JournalEdit_clinet').val());
		}else{
			vendorTermValue($('#JournalEdit_vendor').val());
		}
		
		if(type!=='unassociation'){			
			$.removeHide('#JournalEdit_pipiEdit');
			$.removeHide('.pipiEdit');		
			$.removeHide('#pipiEditcreateby');	
			$.removeHide('#pipiEditusers');		
			$.removeHide('#pipiEdittermValue');
			if(type=='inflow'){
				$.removeHide('#pipiEditclinet');
				$('.JournalEdit_returnFlag').text('供应商退款');		
			}
			if(type=='outflow'){
				$.removeHide('#pipiEditvendor');	
				$('.JournalEdit_returnFlag').text('客户退款');	
			}	
		}
		
		if(type=='unassociation'){	
			$.addHide('#JournalDetail_pipi');
				/*var bool=false;
				//debugger
				var list=getJournalEditTableList();
				var len=list.length;
				
				for(var i=0;i<len;i++){
					var _coaid=list[i].chartOfAccount.id;
					if(_coaid!=''){
						if($.strInArr(getProductInfoById(_coaid,'chartOfAccounts').hardCode,['1001','1002','1012'])){
							if(list[i].creditAmt!=0){
								$.removeHide('#pipiEdittermValue');
								$.removeHide('#JournalEdit_pipiEdit');
								if($('#JournalEdit_returnFlag').is(':checked')){
									$.removeHide('#pipiEditclinet');
								}else{
									$.removeHide('#pipiEditvendor');									
									$('.JournalEdit_returnFlag').text('客户退款');		
								}
								return ;
							}else{
								$.removeHide('#pipiEdittermValue');
								$.removeHide('#JournalEdit_pipiEdit');
								if($('#JournalEdit_returnFlag').is(':checked')){
									$.removeHide('#pipiEditvendor');
								}else{
									$.removeHide('#pipiEditclinet');
									$('.JournalEdit_returnFlag').text('供应商退款');	
								}
								return ;
							}
						}
						if(coalist['2203'].id==_coaid||coalist['1122'].id==_coaid){
							$.removeHide('#pipiEdittermValue');
							$.removeHide('#JournalEdit_pipiEdit');
							if($('#JournalEdit_returnFlag').is(':checked')){
								$.removeHide('#pipiEditvendor');	
							}else{
								$.removeHide('#pipiEditclinet');
								$('.JournalEdit_returnFlag').text('供应商退款');		
							}
							return ;
						}
						if(coalist['1123'].id==_coaid||coalist['2202'].id==_coaid){
							$.removeHide('#pipiEdittermValue');
							$.removeHide('#JournalEdit_pipiEdit');
							if($('#JournalEdit_returnFlag').is(':checked')){
								$.removeHide('#pipiEditclinet');
							}else{
								$.removeHide('#pipiEditvendor');								
								$('.JournalEdit_returnFlag').text('客户退款');		
							}
							return ;
						}
					}
				}*/
		}
		if(type=='inflow'||type=='unassociation'){
			if($('#JournalEdit_returnFlag').is(':checked')&&$('#JournalEdit_returnFlag').is(':visible')){
				$.removeHide('#pipiEditvendor');
				$.addHide('#pipiEditclinet');	
			}
		}
		
		if(type=='outflow'){
			if($('#JournalEdit_returnFlag').is(':checked')&&$('#JournalEdit_returnFlag').is(':visible')){
				$.removeHide('#pipiEditclinet');
				$.addHide('#pipiEditvendor');		
			}					
		}
	};
	
	/*var pipiEditCoaView=function(){		
		var type=$('#JournalEdit_type').val();
		$.addHide('#JournalEdit_pipiEdit');
		$.addHide('.pipiEdit');
		$.addHide('#pipiEditclinet','#pipiEditvendor','#pipiEditcreateby','#pipiEditusers_mon','#pipiEditusers','#pipiEdittermValue');
		pipiusers_mon=0;
		if($.inArray(coalist['1221'].id,selectedIdList)!=-1){
			$.removeHide('#JournalEdit_pipiEdit');
			$.removeHide('#pipiEditusers');		
			
			var list=getJournalEditTableList();
			var len=list.length;
			for(var i=0;i<len;i++){
				if(list[i].chartOfAccount.id=='26'&&list[i].creditAmt!=0){
					$.removeHide('#pipiEditusers_mon');
					pipiusers_mon=list[i].creditAmt;
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
				console.log(bool)
				if($.inArray(coalist['2203'].id,selectedIdList)!=-1||$.inArray(coalist['1122'].id,selectedIdList)!=-1
						||bool){
					//$.removeHide('#pipiEditallclient');
					$.removeHide('#pipiEditclinet');
					$.removeHide('#pipiEdittermValue');
					$.removeHide('#JournalEdit_pipiEdit');
				}
				if($.inArray(coalist['1123'].id,selectedIdList)!=-1||$.inArray(coalist['2202'].id,selectedIdList)!=-1){
					//$.removeHide('#pipiEditallclient');
					$.removeHide('#pipiEditvendor');
					$.removeHide('#pipiEdittermValue');
					$.removeHide('#JournalEdit_pipiEdit');
				}
		}
		
		if(type!=='unassociation'){		
			$.removeHide('#JournalEdit_pipiEdit');
			$.removeHide('.pipiEdit');		
			$.removeHide('#pipiEditusers');
			$.removeHide('#pipiEditcreateby');	
			
		}
		if(type=='inflow'){
			if($('#JournalEdit_returnFlag').is(':checked')){
				$.removeHide('#pipiEditvendor');
				$.addHide('#pipiEditclinet');
				$.removeHide('#pipiEdittermValue');
			}else{
				$.removeHide('#pipiEditclinet');
				$.addHide('#pipiEditvendor');
				$.removeHide('#pipiEdittermValue');
			}
			//$.removeHide('#pipiEditallclient');
		}
		$('.JournalEdit_returnFlag').text('供应商退款');
		if(type=='outflow'){
			if($('#JournalEdit_returnFlag').is(':checked')){
				$.removeHide('#pipiEditclinet');
				$.addHide('#pipiEditvendor');
				$.removeHide('#pipiEdittermValue');
			}else{
				$.removeHide('#pipiEditvendor');
				$.addHide('#pipiEditclinet');
				$.removeHide('#pipiEdittermValue');
			}
			$('.JournalEdit_returnFlag').text('客户退款');
		}
		if($('#JournalEdit_clinet').is(':visible')){
			customerTermValue($('#JournalEdit_clinet').val());
		}else{
			vendorTermValue($('#JournalEdit_vendor').val());
		}
		
	};*/
	
	var showtime=function(){
		selectedIdList=[];
		 $.each($('.JournalEditSelect'),function(){
			 var id=$(this).val();
			 if(id!=''){
				selectedIdList.push(id);
			 }
		 })
		pipiEditCoaView();
	};
	
	var coalist=ComboBoxSources.getInfoMapByKey('chartOfAccounts','hardCode');
	var coaIdlist=[];
	coaIdlist.push(coalist['2203'].id);
	coaIdlist.push(coalist['1122'].id);
	coaIdlist.push(coalist['1123'].id);
	coaIdlist.push(coalist['2202'].id);
	coaIdlist.push(coalist['1001'].id);
	coaIdlist.push(coalist['1002'].id);
	coaIdlist.push(coalist['1012'].id);
	
	
	
	var checkJson=function(){
		//验证tr行有输入行数据是否完整
		//console.log(JournalEditTableIsSelect());
		 if(!JournalEditTableIsSelect()){
			 
			 return false;
		 }
		 
		 //验证是否有相同的科目
		 var JournalEditSelectarr=[];
		 var JournalEditSelecti=0;
		 $.each($('.JournalEditSelect'),function(){
			 if($(this).val()!==''){
			 JournalEditSelectarr[JournalEditSelecti]=$(this).val();
			 JournalEditSelecti+=1;
			 }
		 })
		 console.log('科目',JournalEditSelectarr,isRepeat(JournalEditSelectarr));
		 if(isRepeat(JournalEditSelectarr)){
			 Core.alert({message:"科目不能相同！"})
			 return false;
		 }
		 
		 
		
		//验证金额输入是否是数字
		//var nodeList=$('#JournalEditTable>tbody>tr');
		var numList=$('.JournalEditNum');
		$.each(numList,JournalEditTableCheckNum);
		console.log('check:',isCheckEd);
		if(isCheckEd===false){
			Core.alert({message:"输入金额只能为数字！"});
			return false;
		}
		
		if($('#JournalEditNumSum1').text()!==$('#JournalEditNumSum2').text()){
			Core.alert({message:"借贷不平衡！"});
			return false;
		}
		
		var arr= getJournalEditTableList();
		
		if(arr.length===0){
			Core.alert({message:"请输入金额！"})
			return false;
		}
		
		return true;
	};
	

	
	loadHtml(list);
	
	console.log(list);
	function loadHtml(list){
//		debugger;
		journalNumber=list.journalNumber;
		$('#journalEditnoteNumber').val(list.noteNumber);
		$('#journalEditid').val(list.id);
		$("#JournalEditattachment").fileuploader({bool:true,filelist:list.fileInfoIds,url:_global_settings.service.url+'/common/file/'+currentUserInfo.id});
		$('#journalEditNumber').val(list.journalNumberForShow);
		$('#JournalEditRemarkPrint').text(list.remarkPrint);
		$('#JournalEditRemark').text(list.remark);	
		$('#datepickerEdit').datetimeinput({formatString: "yyyy-MM-dd",width: '170px', height: '33px',value:new Date()});
		$('#datepickerEdit').val(list.entryDate);
		
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
		$('#journalEditcreateBy').val(createBy);
		
		
		$("#JournalEdit_clinet").val(list.clientId);
		$("#JournalEdit_vendor").val(list.clientId);
		$("#JournalEditusers").val(list.personId);		
		$("#JournalEdit_receiptType").val(list.receiptInvoiceType);
		$("#JournalEdit_tax").val(list.vat);
		$("#JournalEdit_receiptNum").val(list.receiptNumber);
		$('#JournalEdit_returnFlag')[0].checked=list.returnFlag;
		$('#JournalEdit_type').val(list.journalRelationType);
		
		//$("#JournalEdit_ordercreateby").val(list.);
		
		var rows=list.journalDetails;
		console.log(rows);
		//for(var i in rows){
			for(var i =0;i<rows.length;i++){
			loadList(rows[i]);
		}		
		
		pipiEditCoaView(list);
		
		timeOut(function(){			
			//
			$("#JournalEditusers_mon").val(list.prepareAmt);
			$("#JournalEdit_termValue").val(list.termValue);
			ready=true;
		},20)
		//console.log(digitUppercase(creditAmtsum));
		$('#JournalEditNumSumCn').text(digitUppercase(creditAmtsum));
		$('#JournalEditNumSum1').text('￥'+money(creditAmtsum));
		$('#JournalEdit_receiptmon').val(money(creditAmtsum));
		$('#JournalEditNumSum2').text('￥'+money(creditAmtsum));
		
		$('#JournalEdit_clinet').on('change',function(){
			customerTermValue($(this).val());
			$('#JournalEditusers').jqxComboBox('clearSelection');	
			//$('#JournalEditusers_mon').jqxComboBox('clearSelection');
		});
		$('#JournalEdit_vendor').on('change',function(){
			vendorTermValue($(this).val());
			$('#JournalEditusers').jqxComboBox('clearSelection');	
			//$('#JournalEditusers_mon').jqxComboBox('clearSelection');
		});
		$('#JournalEditusers').on('change',function(){
			var user=$(this).val();
			//var id=getProductInfoById(user,'users',null,'username').userid;
			user_mon(user);
			$('#JournalEdit_termValue').val('');
			$('#JournalEdit_clinet').jqxComboBox('clearSelection');	
			$('#JournalEdit_vendor').jqxComboBox('clearSelection');	
		});
		$('#JournalEdit_type').on('change',function(){
			showtime();
		})
		
		$('#JournalEdit_returnFlag').on('change',function(){
			showtime();
		})
		
		$('#JournalEditTable').on('keyup change',function(){		
			showtime()
		})
		/*//业务状态
		didStatus({
			'JournalEditTableAdd':{'bizStatus':list.bizStatus},
			'JournalEditTableAddAndSubmit':{'bizStatus':list.bizStatus}
		});
		
		//工作流状态
		BpmnStatus(list.bpmnStatus,list.createBy,{
			'初次提交':'JournalEditTableAddAndSubmit',
			'再次提交':'editJournal_auditBtn',
			'审批记录':'editJournal_jqxgridComment',
			'保存':'JournalEditTableAdd'
		},$.pk.Bpmn);*/
		
	};
	var pre = "editJournal_";
	
	var initAuditInfo = function(obj){
		//TODO 权限检查
		/*if(obj.status === undefined){
			
		}else if(obj.status =='INPROCESS'){
			$("#"+me.pre+"jqxgridComment").auditList({bpmnObj:obj});
			$("#eidt-saveCost").off('click').hide();
			$("#edit-saveAndSubmitCost").off('click').hide();
		}
		
		if(obj.bpmnStatus=="REJECT"){
			$("#"+me.pre+"jqxgridComment").auditList({bpmnObj:obj});
		}*/
		
		//$("#"+me.pre+"jqxgridComment").auditWindow({pre:'editCostExpense_',taskId:obj.processInstanceId,bpmnObj:obj});
		$("#"+me.pre+"jqxgridComment").auditWindow({
			pre:'editJournal_',
			url:'journal',
			json:getJson,
			parent:list.parent,
			type:'edit',
			callback:$.closeTab
		});
		
		$("#"+me.pre+'auditBtn').on({'click':function(){
			if(checkJson()){
				$("#"+me.pre+"winAudit").jqxWindow("open");
			}
		}});
	};
	

	    function loadList(list){
	    	
	    	//debugger;
	    	var row=$('#JournalEditTable> tbody').children().eq(-1);
	    	//row.after(html());	    	
	    	row.find('.JournalEditSelect').eq(-1).coaCombbox({width:'100%',height:'33px'});
	    	var description=list.description;
			var id=list.chartOfAccount.id;
			selectedIdList.push(id);
			var creditAmt=list.creditAmt;
			var debitAmt=list.debitAmt;
			var category1=list.category1;
			var category2=list.category2;
			console.log('id:'+id);
			creditAmtsum+=creditAmt;
			row.find('.JournalEditChart').val(description);
			row.find('.JournalEditSelect').val(id);
			row.find('.JournalEditNum').eq(0).val(debitAmt===0?'':money(debitAmt));
			row.find('.JournalEditNum').eq(1).val(creditAmt===0?'':money(creditAmt));
			row.find('.JournalEdittp1').eq(0).val(category1);
			row.find('.JournalEdittp2').eq(0).val(category2);
			$('#JournalEditTable> tbody').children().eq(-1).after(html());
			$('.JournalEditSelect').eq(-1).coaCombbox({width:'100%',height:'33px'});
			$('.JournalEdittp1').eq(-1).comboBoxType({source:ComboBoxSources.getRecords('category1'),height:'33px'});
			$('.JournalEdittp2').eq(-1).comboBoxType({source:ComboBoxSources.getRecords('category2'),height:'33px'});
		}
	
	    
	    
	
	//JournalEditTable绑定添加行事件
	$('#JournalEditTable').on('click',function(event){		

		if($(event.target).parent()[0]===$('#JournalEditTable> tbody').children().eq(-1)[0]
		||$(event.target).parent().parent()[0]===$('#JournalEditTable> tbody').children().eq(-1)[0]){			
		
			
	//		$('.user-table> tbody').children().eq(-1).after(html());
			var h = $(html());
			h.find(".JournalEditNum").moneyinput({defaultValue:''});
			h.find(".JournalEditNum").off("blur").on("blur",blurEvent);
			$('#JournalEditTable> tbody').append(h);
			$('.JournalEditSelect').eq(-1).coaCombbox({width:'100%',height:'33px'});
			$('.JournalEdittp1').eq(-1).comboBoxType({source:ComboBoxSources.getRecords('category1'),height:'33px'});
			$('.JournalEdittp2').eq(-1).comboBoxType({source:ComboBoxSources.getRecords('category2'),height:'33px'});
			i+=1;
			//console.log("I'm King!",html);

		}
		//mee
		$('#JournalEditTable tbody tr').on('dblclick',function(){			
			$(this).find('.JournalEditChart').val($(this).prev('tr').find('.JournalEditChart').val());			
		})
		      
		$(".numBorrow2").on('dblclick',function(){
			  var sumBorrow=0;
				var sunLoad=0;
				
			$.each($('.numBorrow2'),function(){
				sumBorrow=($(this).val()=="")?parseFloat(sumBorrow):parseFloat(sumBorrow)+parseFloat($(this).val());
			})
		    $.each($('.numLoad2'),function(){
		    	sunLoad=($(this).val()=="")?parseFloat(sunLoad):parseFloat(sunLoad)+parseFloat($(this).val());
			})
			/*if($(this).parent().next().children().val()==''){
			  if(parseFloat(sumBorrow)<parseFloat(sunLoad)){
				$(this).val(money(parseFloat(sunLoad)-parseFloat(sumBorrow)));
			   }
			}*/
			if($(this).val()==''){	         
				if($(this).parent().next().children().val()==''){
					if(parseFloat(sumBorrow)<parseFloat(sunLoad)){
						$(this).val(money(parseFloat(sunLoad)-parseFloat(sumBorrow)));
					}
				}
				}else{
					if($(this).parent().next().children().val()==''){
						if(parseFloat(sumBorrow)<parseFloat(sunLoad)){
							$(this).val(money(parseFloat(sunLoad)-parseFloat(sumBorrow)+parseFloat($(this).val())));
						}
					}	
				}
			$('#JournalEditNumSum1').text('￥'+money(sumBorrow));
			$('#JournalEdit_receiptmon').val(money(sumBorrow));
			showtime()
		})
		$(".numLoad2").on('dblclick',function(){
			  var sumBorrow=0;
				var sunLoad=0;
			$.each($('.numBorrow2'),function(){
				sumBorrow=($(this).val()=="")?parseFloat(sumBorrow):parseFloat(sumBorrow)+parseFloat($(this).val());
			})
		    $.each($('.numLoad2'),function(){
		    	sunLoad=($(this).val()=="")?parseFloat(sunLoad):parseFloat(sunLoad)+parseFloat($(this).val());
			})
			if($(this).val()==''){	         
			if($(this).parent().prev().children().val()==''){
				if(parseFloat(sumBorrow)>parseFloat(sunLoad)){
					$(this).val(money(parseFloat(sumBorrow)-parseFloat(sunLoad)));
				}
			}
			}else{
				if($(this).parent().prev().children().val()==''){
					if(parseFloat(sumBorrow)>parseFloat(sunLoad)){
						$(this).val(money(parseFloat(sumBorrow)-parseFloat(sunLoad)+parseFloat($(this).val())));
					}
				}	
			}
			
			$('#JournalEditNumSum2').text('￥'+money(sunLoad));
			showtime()
		})
		
		
		});
    
	
	 function createJournal1(){
	    	$('#JournalEditTable').on('change','.JournalEdittp1',function(){
	    		//debugger
	        	$('#JournalEditTable').off('change','.JournalEdittp1');
	        	pass=false;
	        	var node=$(this);
	        	var selectedIndex=$(this).jqxComboBox('selectedIndex');
	        	$.each($('.JournalEdittp1'),function(i,v){
	        		//debugger;
	        		if($(v)[0]==node[0]){
	        			pass=true;
	        		}else{
	        			if(pass){
	        				$(v).jqxComboBox({selectedIndex:selectedIndex })
	        			}
	        		}
	        		
	        	})
	        	createJournal1();
	        })
	    }
	    createJournal1();
	    function createJournal2(){
	    	$('#JournalEditTable').on('change','.JournalEdittp2',function(){
	    		$('#JournalEditTable').off('change','.JournalEdittp2');
	        	pass=false;
	        	var node=$(this);
	        	var selectedIndex=$(this).jqxComboBox('selectedIndex');
	        	$.each($('.JournalEdittp2'),function(i,v){
	        		//debugger;
	        		if($(v)[0]==node[0]){
	        			pass=true;
	        		}else{
	        			if(pass){
	        				$(v).jqxComboBox({selectedIndex:selectedIndex })
	        			}
	        		}
	        		
	        	})
	        	createJournal2();
	        })
	    }
	    createJournal2();
	
	$('#JournalEditTable').on('change','.JournalEditSelect',function(event){	
		var args = event.args;
		console.log(args);
		if($(this).val()!==''){
			var i=0;
			var val=$(event.target).val();
			$.each($('.JournalEditSelect'),function(){
				if($(this).val()===args.item.value){
					i+=1;
					console.log(i,$(this).val(),val);
				}
			})
			if(i>1){
				Core.alert({message:"科目不能相同！"})
				//$(event.target).val('科目');
				$(this).val('');
			}
			
		}
		
		var itemvalue = $(this).val();
		console.log(itemvalue);
		selectedIdList=[];
		
		var i=0;
		$.each($('.JournalEditSelect'),function(){
			var id=$(this).val();
			if(id!=''){
				selectedIdList.push(id);
				if(id===itemvalue){
					i+=1;
				}
			}
		})
		if(i>1){
			Core.alert({message:"科目不能相同！"});
			//$(event.target).val('科目');
			$(this).jqxComboBox('clearSelection');
		}	
		
		showtime(selectedIdList);
	});
	
	$('#JournalEditTable .JournalEditNum').moneyinput({defaultValue:''}).off("blur").on('blur',blurEvent);
	
	
	$('#JournalEditTable').on('keyup','.JournalEditNum',function(){
		if($(this).parent().next().children().is('input')){
			$(this).parent().next().children().val('');
			$(this).parent().next().children().css('border','');
		}
		else if($(this).parent().prev().children().is('input')){
			$(this).parent().prev().children().val('');
			$(this).parent().prev().children().css('border','');
		}
		var sum=getSum();
		console.log('sum',sum);
		
		$('#JournalEditNumSumCn').text(digitUppercase(money(sum[1])));
		$('#JournalEditNumSum1').text('￥'+money(sum[1]));
		$('#JournalEdit_receiptmon').val(money(sum[1]));
		$('#JournalEditNumSum2').text('￥'+money(sum[0]));
		$('#JournalEditusers_mon').trigger('change');

	});
	
	
	
	$('#JournalEditTable').on('paste','.JournalEditNum',function(f){
		f.preventDefault();
		var content;
		if (f.originalEvent.clipboardData) {
            content = (f.originalEvent || f).clipboardData.getData("text/plain")
        } 
		if(JournalEditTableCheckNum(content)){
			$(this).val(content);
		}
		console.log(content);
	})
	
	$('#JournalEditTable').on('click','.JournalEditDel',function(){
		if($('#JournalEditTable> tbody').children().length===1){
			return false;
		}
		var t=$(this);
		Core.confirm({
			message:"确定要删除？",
			confirmCallback:function(){
				t.parent().parent().remove();
			}
		});
		return false;
	});
	
	var getJsonByType=function(){
		//var JournalEdit_allclient=$("#JournalEdit_allclient").val();
		var JournalEdit_type=$("#JournalEdit_type").val();
		var JournalEdit_clinet=$("#JournalEdit_clinet").val();
		var JournalEdit_vendor=$("#JournalEdit_vendor").val();
		var JournalEditusers=$("#JournalEditusers").is(':visible')?$("#JournalEditusers").val():null;
		var JournalEdit_receiptType=$("#JournalEdit_receiptType").is(':visible')?$("#JournalEdit_receiptType").val():null;
		var JournalEdit_tax=$("#JournalEdit_tax").is(':visible')?$("#JournalEdit_tax").val():null;
		var JournalEdit_receiptNum=$("#JournalEdit_receiptNum").is(':visible')?$("#JournalEdit_receiptNum").val():null;
		var JournalEdit_receiptmon=$("#JournalEdit_receiptmon").is(':visible')?$("#JournalEdit_receiptmon").val():null;
		var JournalEdit_ordercreateby=$("#JournalEdit_ordercreateby").is(':visible')?$("#JournalEdit_ordercreateby").val():null;
		var JournalEditusers_mon=$("#JournalEditusers_mon").is(':visible')?$("#JournalEditusers_mon").val():null;
		var JournalEdit_returnFlag=$("#JournalEdit_returnFlag").is(':visible')?$("#JournalEdit_returnFlag").is(':checked'):null;
		var JournalEdit_termValue=$("#JournalEdit_termValue").is(':visible')?$("#JournalEdit_termValue").val():null;
		var journalBizType=null;
		if(JournalEditusers_mon!=null){
			journalBizType='expensePayment';
		}
		
		var clientId='';
		if($("#JournalEdit_clinet").is(':visible')){
			clientId=JournalEdit_clinet;
		}else{
			clientId=JournalEdit_vendor;
		}
		if(JournalEdit_receiptType=="请选择"){
			JournalEdit_receiptType=null;
		}
		return {
				journalRelationType:JournalEdit_type,
				clientId:clientId,
				receiptInvoiceType:JournalEdit_receiptType,
				receiptNumber:JournalEdit_receiptNum,
				receiptAmt:JournalEdit_receiptmon,
				vat:JournalEdit_tax,
				personId:JournalEditusers,
				generalDocumentsCreateBy:JournalEdit_ordercreateby,
				prepareAmt:JournalEditusers_mon,
				//expensePaymentId:JournalEditusers_mon,
				//journalBizType:journalBizType,
				returnFlag:JournalEdit_returnFlag,
				termValue:JournalEdit_termValue
		}
	};
	
	$("#JournalEdit_Page").jqxValidator({
		animationDuration: 1,
		hintType: 'label',
        rules: [
			{ input: '#JournalEdit_clinet', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null&&$('#JournalEditusers').val()=='') return false;
						return true;
					} 
			},
			{ input: '#JournalEdit_vendor', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null&&$('#JournalEditusers').val()=='') return false;
						return true;
					} 
			},
			/*{ input: '#JournalEdit_allclient', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null) return false;
						return true;
					} 
			},*/
			{ input: '#JournalEditusers', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null&&input.val()!='') return false;
						return true;
					} 
			},
			{ input: '#JournalEdit_ordercreateby', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null&&input.val()!='') return false;
						return true;
					} 
			},
			/*{ input: '#JournalEditusers_mon', message: "不能为空", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					var item=input.jqxComboBox('getSelectedItem')
					if(item==null&&input.val()!='') return false;					
					return true
					} 
			},*/
			{ input: '#JournalEditusers_mon', message: "其他应收款贷方金额不能大于预支金额", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					var item=input.val();					
					if(item!=''&&parseFloat(money(item))<parseFloat(money(pipiusers_mon)))	
						return false;
					return true
					} 
			}
                
                ]
	})
	
	$('#JournalEditTableAdd').on('click',function(){
		if(false==checkJson()){
			return false;
		}
		
		var url=_global_settings.service.url+'/ac/';
		var type='PUT';
		if($(this).attr('id')==='JournalEditTableAddAndSubmit'){
			url=url+'/commit/%20';
			type="PUT";
			console.log(url);
		}else{
			url=url+new Base64().encode('tosys/coaReport/update/'+currentUserInfo.id+'/'+currentUserInfo.loginId);
		}
		
		
		var json=getJson();
		
		var list = json['journalDetails'];

		var sub = [ 'NV', 'AK', 'HI' ];
		
		var post=JournalEditTableJsonFormat(list,sub);
		
		json=$.extend(true,{},json,getJsonByType());
		
		if(!$("#JournalEdit_Page").jqxValidator("validate")){
			return false;
		}
		if(post){
			Core.AjaxRequest({
                url : url,
                type: type,
                params:json,
                async:false,
                dataType:'text',
                showMsg:false,
                callback: function(res) {
                	Core.alert({message:''+res+''});
                	if(res){
                		try{
                			$('#Journal').jqxGrid('updatebounddata','cells');
                			$.closeTab();
                		}catch(e){}
                	}
                	else{
                		Core.alert({message:"借贷不平衡！"});
                	}
                },
                failure:function(res){
                }
            });
		}
		else{
			Core.alert({message:"同一科目只能为借方或贷方金额！"})
		}
	}
	)
	
	
	
	function JournalEditTableCheckNum(){
		
		isCheckEd=false;
		var isNum=arguments.length===2? arguments[1].value:arguments[0];
		if(!isNaN(isNum)){
			$(this).css('border','');
			isCheckEd=true;
			return true;
		}
		else{			
			$(this).focus();
			$(this).css('border','solid 2px red');
			isCheckEd=false;
			return false;
		}
		console.log('running...');
	};
	
	function  JournalEditTableNum(){
		console.log(event.keyCode,event.paste);
		if(event.keyCode>47&&event.keyCode<58||event.keyCode===46){
			//$(event.target).css('border','');
			event.returnValue = true; 
		}else {    
			//$(event.target).css('border','solid 2px red');
	         event.returnValue = false;    
	    }    
	};
	

	
	function isRepeat(arr){
		 
		var hash = {};
		 
		for(var i in arr) {
		if(hash[arr[i]])
		 
		return true;
		 
		hash[arr[i]] = true;
		 
		}		
		 
		return false;
		 
		}
	

	function getJournalEditTableList() {
		
		var arr = [];
		var i=0;
		$.each($('#JournalEditTable>tbody>tr'), function() {
			
			var that = $(this).children();
			if(that.eq(2).children().val()!==''||that.eq(3).children().val()!==''){
			arr[i] = {
				description : that.eq(0).children().val(),
				chartOfAccount :{id: that.eq(1).children().val()},
				debitAmt: that.eq(2).children().val()===''?0:that.eq(2).children().val(),
				creditAmt: that.eq(3).children().val()===''?0:that.eq(3).children().val(),
				createDate: $('#datepickerEdit').val()+' '+ getHMS(),
				category1:that.eq(4).children().val(),
				category2:that.eq(5).children().val()
				//createBy:'admin'
			};
			i+=1;
			}
		})
		return arr;
			
		};
		
		
	var JournalEditTableIsSelect=function(){
			var selectList=$('#JournalEditTable> tbody>tr');
			var pass=true;
			$.each(selectList,function(){
				var td1=$(this).eq(0).children().eq(0).children().val();
				var td2=$(this).eq(0).children().eq(1).children().jqxComboBox('getSelectedItem');
				var td3=$(this).eq(0).children().eq(2).children().val();
				var td4=$(this).eq(0).children().eq(3).children().val();
				if(td2!=null&&(td3!==''||td4!=='')){
					pass=true;
					//return false;
				}else if(td2==null&&td3===''&&td4===''){
					pass=true;
				}else if(td2==null){
					Core.alert({message:"请选择科目！"})
					pass=false;
					return false;
				}else if(td3===''||td4===''){
					Core.alert({message:"请输入金额！"})
					pass=false;
					return false;
				}
			})
			return pass;
		}
		
	var JournalEditTableJsonFormat=function(list,arr){
			var post = true;
			$.each(arr, function(i, arr) {

				console.log(i, arr);
				var arr1 = [], arr2 = [], arr3 = [];
				var len = 0;
				var len2 = 0;
				for ( var i in list) {
					if (list.hasOwnProperty(i)) {
						if (list[i].chartOfAccount === arr) {
							arr1[len] = list[i].creditAmt;
							len += 1;
						}
					}
				}
				len = 0;
				//console.log(arr1);

				for ( var j in arr1) {
					if (arr1.hasOwnProperty(j)) {
						if (arr1[j].length === 0) {
							arr2[len] = arr1[j];
						} else {
							arr3[len2] = arr1[j];
						}
						console.log(arr1[j])
					}
				}
				if (arr3.length * arr2.length !== 0) {
					console.log('it goback');
					//return 1;
					post = false;
					return false;
				}
			})
			return post;
		}
		
		var getSum=function(){
			var length=$('.JournalEditNum').length-1;
			var JournalEditNumSum1=0;
			var JournalEditNumSum2=0;
			for(var i=0;i<length;i++){
				var sum=$('.JournalEditNum').eq(i).val()*1000;
					if(i%2===1 &&!isNaN(sum)){
						JournalEditNumSum1+=parseInt(sum);
						//console.log($('.JournalEditNum').eq(i).val());
					}
					if(i%2===0&&!isNaN(sum)){
						JournalEditNumSum2+= parseInt(sum);
						//console.log($('.JournalEditNum').eq(i).val());
					}
			}
			console.log('i is:',i);
			return [JournalEditNumSum1/1000,JournalEditNumSum2/1000];
		};
				
	  

})()