(function(){	
  
	setTimeout($.addTabCloseEvent,200);	
	
	var isCheckEd=false;
	var lineData = null;
	var blurEvent = function(event){
		var input = $(this);
		var value = input.val();
		if(value!='' && JournalDetailTableCheckNum(value)){
			$(this).css('border','');
			input.val(money(value).replace('-',''));
		}
		else{
			input.val('');
		}
	};
	
	Core.AjaxRequest({
		type:'GET',
		url:ws_url+'/CXF/rs/ac/'+new Base64().encode('tosys/coaReport/ownerinformation/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
		async:false,
		callback:function(res){
			console.log(res);
			lineData = res;
			$('.category1_name').text(res.category1);
			$('.category2_name').text(res.category2);
		}
	});
	
	
	var html='';
	html+='<tr>                                                                               ';
	html+='	<td style=""><input class="JournalDetailChart form-control" type="text"></td>                                                           ';
	html+='	<td style=""><div class="JournalDetailSelect"></div>                                                      ';
	html+='	</td>                                                                                  ';
	html+='	<td style=""><input class="JournalDetailNum numBorrow form-control" type="text"></td>                                                           ';
	html+='	<td style=""><input class="JournalDetailNum numLoad form-control" type="text"></td>                                                           ';
	html+='	<td style="">                                                      ';
	html+='			<div class="JournalDetailtp1"></div>                                                       ';
	html+='	</td>                                                                                  ';
	html+='	<td style="">                                                    ';
	html+='			<div class="JournalDetailtp2"></div>                                                                ';
	html+='	</td>                                                                                  ';
	html+='	<td class="del_icon" style=""><i class="    md-cancel   del  JournalDetailDel"></i>';
	html+='	</td>                                                                                           ';
	html+='</tr>           ';
	$('#JournalDetailTable').easytable({
		tr:html,
		tr_load_func:function(tr){
			tr.find(".JournalDetailNum").moneyinput({defaultValue:''});
			tr.find(".JournalDetailNum").off("blur").on("blur",blurEvent);
			tr.find('.JournalDetailSelect').coaCombbox({width:'100%',height:'33px'});
			tr.find('.JournalDetailtp1').comboBoxType({source:ComboBoxSources.getRecords('category1'),height:'33px'});
			tr.find('.JournalDetailtp2').comboBoxType({source:ComboBoxSources.getRecords('category2'),height:'33px'});
		}
	}).on('dblclick','.numBorrow',function(){
		var sumBorrow=0;
		var sunLoad=0;
			
		$.each($('.numBorrow'),function(){
			sumBorrow=($(this).val()=="")?parseFloat(sumBorrow):parseFloat(sumBorrow)+parseFloat($(this).val());
		})
	    $.each($('.numLoad'),function(){
	    	sunLoad=($(this).val()=="")?parseFloat(sunLoad):parseFloat(sunLoad)+parseFloat($(this).val());
		})
		if($(this).val()==''){	         
			if($(this).parent().next().children().val()==''){
				if(parseFloat(sumBorrow)<parseFloat(sunLoad)){
					var add=parseFloat(sunLoad)-parseFloat(sumBorrow);
					sumBorrow+=add;
					$(this).val(money(add));
				}
			}
			}else{
				if($(this).parent().next().children().val()==''){
					if(parseFloat(sumBorrow)<parseFloat(sunLoad)){
						var add=parseFloat(sunLoad)-parseFloat(sumBorrow)+parseFloat($(this).val());
						sumBorrow+=add;
						$(this).val(money(add));
					}
				}	
			}
		$('#JournalDetailNumSum1').text('￥'+money(sumBorrow));
		$('#JournalDetail_receiptmon').val(money(sumBorrow));
		
	}).on('dblclick','.numLoad',function(){
		var sumBorrow=0;
		var sunLoad=0;
		$.each($('.numBorrow'),function(){
			sumBorrow=($(this).val()=="")?parseFloat(sumBorrow):parseFloat(sumBorrow)+parseFloat($(this).val());
		})
	    $.each($('.numLoad'),function(){
	    	sunLoad=($(this).val()=="")?parseFloat(sunLoad):parseFloat(sunLoad)+parseFloat($(this).val());
		})
		if($(this).val()==''){	         
			if($(this).parent().prev().children().val()==''){
				if(parseFloat(sumBorrow)>parseFloat(sunLoad)){
					var add=parseFloat(sumBorrow)-parseFloat(sunLoad);
					sunLoad+=add;
					$(this).val(money(add));
				}
			}
		}else{
				if($(this).parent().prev().children().val()==''){
					if(parseFloat(sumBorrow)>parseFloat(sunLoad)){
						var add=parseFloat(sumBorrow)-parseFloat(sunLoad)+parseFloat($(this).val());
						sunLoad+=add;
						$(this).val(money(add));
					}
				}	
			}
		$('#JournalDetailNumSum2').text('￥'+money(sunLoad));

	}).on('dblclick','.JournalDetailChart',function(){			
		$(this).val($(this).parent().parent().prev('tr').find('.JournalDetailChart').val());		
	});
	
	for(var i=0;i<3;i++){
		timeOut(function(){
			$('#JournalDetailTable tbody').trigger('addline');
		},50)
	}
		
	 function createJournal1(){
	    	$('#JournalDetailTable').on('change','.JournalDetailtp1',function(){
	    		//debugger
	        	$('#JournalDetailTable').off('change','.JournalDetailtp1');
	        	pass=false;
	        	var node=$(this);
	        	var selectedIndex=$(this).jqxComboBox('selectedIndex');
	        	$.each($('.JournalDetailtp1'),function(i,v){
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
	    	$('#JournalDetailTable').on('change','.JournalDetailtp2',function(){
	    		$('#JournalDetailTable').off('change','.JournalDetailtp2');
	        	pass=false;
	        	var node=$(this);
	        	var selectedIndex=$(this).jqxComboBox('selectedIndex');
	        	$.each($('.JournalDetailtp2'),function(i,v){
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
		
		$("#JournalDetail-addCategory1Btn").on({
			"click":function(){			
				var type = $(this).attr("data");
				Core.showModal({
					type:type,
					broth:".JournalDetailtp1",
					callback:function(res){
					}
				});
			}
		});		
		$("#JournalDetail-addCategory2Btn").on({
			"click":function(){
				var type = $(this).attr("data");
				Core.showModal({
					type:type,
					broth:".JournalDetailtp2",
					callback:function(res){
						
					}
				});
			}
		});

	
	$("#JournalDetailattachment").fileuploader({bool:true,url:_global_settings.service.url+'/common/file/'+currentUserInfo.id});
	/*$('.JournalDetailtp1').comboBoxType({source:ComboBoxSources.getRecords('category1'),height:'33px'});
	$('.JournalDetailtp2').comboBoxType({source:ComboBoxSources.getRecords('category2'),height:'33px'});*/
	
	/*if(ComboBoxSources.getInfoMapByKey('users','username')[currentUserInfo.loginId]){
		var vals = ComboBoxSources.getInfoMapByKey('users','username')[currentUserInfo.loginId].name;
		$('#JournalDetailcreateby').val(vals);
	}*/
	$('#JournalDetailcreateby').val(_global_settings.owner.companyname);
	
	$('#datepicker').datetimeinput({formatString: "yyyy-MM-dd",width: '170px', height: '33px',value:new Date()});
	
	$('#JournalDetail_receiptType').dropDownlist({
		source:{'请选择':'请选择','specialinvoice':'增值税专用发票','ordinaryinvoice':'增值税普通发票','otherinvoice':'其他'},
		width:'100%',
		selectedIndex:0
	})
	
	$('#JournalDetail_type').dropDownlist({
		source:{'unassociation':'不匹配','inflow':'资金流入','outflow':'资金流出','OtherAssociation':'其他'},
		selectedIndex:0
	})
	
	$('#JournalDetail_tax').dropDownlist({
		source:{"请选择":"请选择","0":"0%","3":"3%","5":"5%","6":"6%","11":"11%","13":"13%","17":"17%"},
		selectedIndex:0
	}).val(_global_settings.owner.vat);
	
	/*$('#JournalDetail_allclient').comboBox({
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
			$('#JournalDetail_clinet').comboBox({
				source:data,
				displayMember: "name", 
				valueMember: "clientInfoid",
				placeHolder:'请选择'
				//placeHolder:'客户员工二选一'
				//selectedIndex:0
			})
		}
	});
	
	Core.AjaxRequest({
		type:'GET',
		url:_global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/clientInfos/N/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
		async:false,
		callback:function(data){
			console.log(data);
			$('#JournalDetail_vendor').comboBox({
				source:data,
				displayMember: "name", 
				valueMember: "clientInfoid",
				placeHolder:'请选择'
				//placeHolder:'供应商员工二选一',
				//selectedIndex:0
			});
		}
	});
	
//	Core.AjaxRequest({
//		type:'GET',
//		url:_global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/users/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
//		async:false,
//		callback:function(data){
//			console.log(data);
			$('#JournalDetail_ordercreateby').comboBox({
				source:ComboBoxSources.getRecords('users'),
				displayMember: "name", 
				valueMember: "username",
				placeHolder:'请选择'
				//selectedIndex:0
			}).val(currentUserInfo.loginId);
			
			$('#JournalDetailusers').comboBox({
				source:ComboBoxSources.getRecords('users'),
				displayMember: "name", 
				valueMember: "userid",
				placeHolder:'请选择'
				//selectedIndex:0
			});
//		}
//	});
	
	
//	$('#JournalDetailusers_mon').comboBox({
//		placeHolder:'请选择'
//	})
	var user_mon=function(userid){
		if(userid==''){			
			$('#JournalDetailusers_mon').val('');
			return ;
		}
		
		
		Core.AjaxRequest({
			type : "GET",		
			url :_global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/userAmt/'+userid+'/create/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback : function(res) {
				var data=res;
				$('#JournalDetailusers_mon').val(money(res));
				/*$.each(data,function(i,v){
					v.lable=money(v.amt)+'('+v.type+')';
				})
				console.log(data);
				$('#JournalDetailusers_mon').comboBox({
					source:data,
					displayMember: "lable", 
					valueMember: "id",
					placeHolder:'请选择'
					//selectedIndex:0
				})*/
			}
		});
	}
	
	
	/*$('#JournalDetail_allclient').on('change',function(){
		Core.AjaxRequest({
			type : "GET",		
			url : ws_url + "/CXF/rs/clientinfo/search/clientinfo/id/"+$(this).val(),
			callback : function(res) {
				var t=res;
			}
		});
		$('#JournalDetailusers').jqxComboBox('clearSelection');	
		$('#JournalDetailusers_mon').jqxComboBox('clearSelection');
	});*/
	var customerTermValue=function(id){
		if(id==null) return ;
		if(id==''){
			$('#JournalDetail_termValue').val('');
			return ;
		}
		Core.AjaxRequest({
			type : "GET",		
			url : _global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/search/clientinfo/id/'+id+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback : function(res) {
				var t=res;
				var termValue=t.customerTermValue==null?'':t.customerTermValue;		
				$('#JournalDetail_termValue').val(termValue);
			}
		});
	}
	var vendorTermValue=function(id){
		if(id==null) return ;
		if(id==''){
			$('#JournalDetail_termValue').val('');
			return ;
		}
		Core.AjaxRequest({
			type : "GET",		
			url : _global_settings.service.url+'/ac/'+new Base64().encode('tosys/coaReport/search/clientinfo/id/'+id+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
			callback : function(res) {
				var t=res;
				var termValue=t.vendorTermValue==null?'':t.vendorTermValue;		
				$('#JournalDetail_termValue').val(termValue);
			}
		});
	}
	
	$('#JournalDetail_receiptType').on('change',function(){
		var v=$(this).val();
		if(v=='请选择'){
			$('.JournalDetail_receiptType_show').hide();
		}else{
			$('.JournalDetail_receiptType_show').show();
		}
	});
	
	$('#JournalDetail_clinet').on('change',function(){
		customerTermValue($(this).val());
		$('#JournalDetailusers').jqxComboBox('clearSelection');	
//		$('#JournalDetailusers_mon').jqxComboBox('clearSelection');
	});
	$('#JournalDetail_vendor').on('change',function(){
		vendorTermValue($(this).val());
		$('#JournalDetailusers').jqxComboBox('clearSelection');	
//		$('#JournalDetailusers_mon').jqxComboBox('clearSelection');
	});
	$('#JournalDetailusers').on('change',function(){
		var user=$(this).val();
		//var id=getProductInfoById(user,'users',null,'username').userid;
		user_mon(user);
		$('#JournalDetail_termValue').val('');
		$('#JournalDetail_clinet').jqxComboBox('clearSelection');	
		$('#JournalDetail_vendor').jqxComboBox('clearSelection');	
	});
	
	var selectedIdList=[];
	
	var pipiusers_mon=0;
	
	var pipiCoaView=function(){		
		var type=$('#JournalDetail_type').val();
		$.addHide('#JournalDetail_pipi');
		$.addHide('.pipi');
		$.addHide('#pipiclinet','#pipivendor','#pipicreateby','#pipiusers_mon','#pipiusers','#pipitermValue');
		if($('#JournalDetail_type').val()=='unassociation'){
			return ;
		}
		pipiusers_mon=0;
		if($.inArray(coalist['1221'].id,selectedIdList)!=-1){
			$.removeHide('#JournalDetail_pipi');
			$.removeHide('#pipiusers');
			
			var list=getJournalDetailTableList();
			var len=list.length;
			for(var i=0;i<len;i++){
				if(list[i].chartOfAccount.id=='26'&&list[i].creditAmt!=0){
					$.removeHide('#pipiusers_mon');
					pipiusers_mon=list[i].creditAmt;
					break;
				}
			}
		}
		if($('#JournalDetail_clinet').is(':visible')){
			customerTermValue($('#JournalDetail_clinet').val());
		}else{
			vendorTermValue($('#JournalDetail_vendor').val());
		}
		
		
		if(type!=='unassociation'){			
			$.removeHide('#JournalDetail_pipi');
			$.removeHide('.pipi');		
			$.removeHide('#pipicreateby');	
			$.removeHide('#pipiusers');		
			$.removeHide('#pipitermValue');
			if(type=='inflow'){
				$.removeHide('#pipiclinet');	
				$('.JournalDetail_returnFlag').text('供应商退款');
			}
			if(type=='outflow'){
				$.removeHide('#pipivendor');		
				$('.JournalDetail_returnFlag').text('客户退款');			
			}
		}
		
		if(type=='unassociation'){	
			$.addHide('#JournalDetail_pipi');
			/*	var bool=false;
				//debugger
				var list=getJournalDetailTableList();
				var len=list.length;
				
				for(var i=0;i<len;i++){
					var _coaid=list[i].chartOfAccount.id;
					if(_coaid!=''){
						if($.strInArr(getProductInfoById(_coaid,'chartOfAccounts').hardCode,['1001','1002','1012'])){
							if(list[i].creditAmt!=0){
								$.removeHide('#pipitermValue');
								$.removeHide('#JournalDetail_pipi');
								if($('#JournalDetail_returnFlag').is(':checked')){
									$.removeHide('#pipiclinet');
								}else{
									$.removeHide('#pipivendor');									
									$('.JournalDetail_returnFlag').text('客户退款');		
								}
								return ;
							}else{
								$.removeHide('#pipitermValue');
								$.removeHide('#JournalDetail_pipi');
								if($('#JournalDetail_returnFlag').is(':checked')){
									$.removeHide('#pipivendor');
								}else{
									$.removeHide('#pipiclinet');
									$('.JournalDetail_returnFlag').text('供应商退款');	
								}
								return ;
							}
						}
						if(coalist['2203'].id==_coaid||coalist['1122'].id==_coaid){
							$.removeHide('#pipitermValue');
							$.removeHide('#JournalDetail_pipi');
							if($('#JournalDetail_returnFlag').is(':checked')){
								$.removeHide('#pipivendor');	
							}else{
								$.removeHide('#pipiclinet');
								$('.JournalDetail_returnFlag').text('供应商退款');		
							}
							return ;
						}
						if(coalist['1123'].id==_coaid||coalist['2202'].id==_coaid){
							$.removeHide('#pipitermValue');
							$.removeHide('#JournalDetail_pipi');
							if($('#JournalDetail_returnFlag').is(':checked')){
								$.removeHide('#pipiclinet');
							}else{
								$.removeHide('#pipivendor');								
								$('.JournalDetail_returnFlag').text('客户退款');		
							}
							return ;
						}
					}
				}*/
		}
		
		if(type=='inflow'||type=='unassociation'){
			if($('#JournalDetail_returnFlag').is(':checked')){
				$.removeHide('#pipivendor');
				$.addHide('#pipiclinet');	
			}
		}
		
		if(type=='outflow'){
			if($('#JournalDetail_returnFlag').is(':checked')){
				$.removeHide('#pipiclinet');
				$.addHide('#pipivendor');		
			}					
		}
	};
	
	var showtime=function(){
		selectedIdList=[];
		$.each($('.JournalDetailSelect'),function(){
			var id=$(this).val();
			if(id!=''){
				selectedIdList.push(id);
			}
			
		})
		pipiCoaView();
	};
	
	$('#JournalDetailTable').on('keyup change',function(){		
		//debugger;
		showtime()
	})
	
	var coalist=ComboBoxSources.getInfoMapByKey('chartOfAccounts','hardCode');
	var coaIdlist=[];
	coaIdlist.push(coalist['2203'].id);
	coaIdlist.push(coalist['1122'].id);
	coaIdlist.push(coalist['1123'].id);
	coaIdlist.push(coalist['2202'].id);
	coaIdlist.push(coalist['1001'].id);
	coaIdlist.push(coalist['1002'].id);
	coaIdlist.push(coalist['1012'].id);
	
	$('#JournalDetail_type').on('change',function(){
		showtime();
	})
	
	$('#JournalDetail_returnFlag').on('change',function(){
		showtime();
	})
	
	$('#JournalDetailTable').on('change','.JournalDetailSelect',function(event){	
			var itemvalue = $(this).val();
			console.log(itemvalue);
			selectedIdList=[];
			
			var i=0;
			//var val=$(event.originalEvent.target).val();
			$.each($('.JournalDetailSelect'),function(){
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
			
			showtime();
			
	});
	
	
	
	$('#JournalDetailTable').on('keyup','.JournalDetailNum',function(){
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
		
		$('#JournalDetailNumSumCn').text(digitUppercase(money(sum[1])));
		$('#JournalDetailNumSum1').text('￥'+money(sum[1]));
		$('#JournalDetail_receiptmon').val(money(sum[1]));
		$('#JournalDetailNumSum2').text('￥'+money(sum[0]));
		$('#JournalDetailusers_mon').trigger('change');

	});
	
	
	
	$('#JournalDetailTable').on('paste','.JournalDetailNum',function(f){
		f.preventDefault();
		var content;
		if (f.originalEvent.clipboardData) {
            content = (f.originalEvent || f).clipboardData.getData("text/plain")
        } 
		if(JournalDetailTableCheckNum(content)){
			$(this).val(content);
		}
		console.log(content);
	});
	
	var getJsonByType=function(){
		//var JournalDetail_allclient=$("#JournalDetail_allclient").val();
		var JournalDetail_type=$("#JournalDetail_type").val();
		var JournalDetail_clinet=$("#JournalDetail_clinet").val();
		var JournalDetail_vendor=$("#JournalDetail_vendor").val();
		var JournalDetailusers=$("#JournalDetailusers").is(':visible')?$("#JournalDetailusers").val():null;
		var JournalDetail_receiptType=$("#JournalDetail_receiptType").is(':visible')?$("#JournalDetail_receiptType").val():null;
		var JournalDetail_tax=$("#JournalDetail_tax").is(':visible')?$("#JournalDetail_tax").val():null;
		var JournalDetail_receiptNum=$("#JournalDetail_receiptNum").is(':visible')?$("#JournalDetail_receiptNum").val():null;
		var JournalDetail_receiptmon=$("#JournalDetail_receiptmon").is(':visible')?$("#JournalDetail_receiptmon").val():null;
		var JournalDetail_ordercreateby=$("#JournalDetail_ordercreateby").is(':visible')?$("#JournalDetail_ordercreateby").val():null;
		var JournalDetailusers_mon=$("#JournalDetailusers_mon").is(':visible')?$("#JournalDetailusers_mon").val():null;
		var JournalDetail_returnFlag=$("#JournalDetail_returnFlag").is(':visible')?$("#JournalDetail_returnFlag").is(':checked'):null;
		var JournalDetail_termValue=$("#JournalDetail_termValue").is(':visible')?$("#JournalDetail_termValue").val():null;
		var journalBizType=null;
		if(JournalDetailusers_mon!=null){
			journalBizType='expensePayment';
		}
		
		var clientId='';
		if($("#JournalDetail_clinet").is(':visible')){
			clientId=JournalDetail_clinet;
		}else{
			clientId=JournalDetail_vendor;
		}
		if(JournalDetail_receiptType=="请选择"){
			JournalDetail_receiptType=null;
		}
		return {
				journalRelationType:JournalDetail_type,
				clientId:clientId,
				receiptInvoiceType:JournalDetail_receiptType,
				receiptNumber:JournalDetail_receiptNum,
				receiptAmt:JournalDetail_receiptmon,
				vat:JournalDetail_tax,
				personId:JournalDetailusers,
				generalDocumentsCreateBy:JournalDetail_ordercreateby,
				expensePaymentId:JournalDetailusers_mon,
				//bizId:JournalDetailusers_mon,
				//journalBizType:journalBizType,
				returnFlag:JournalDetail_returnFlag,
				termValue:JournalDetail_termValue
		}
	};
	
	$("#JournalDetail_Page").jqxValidator({
		animationDuration: 1,
		hintType: 'label',
        rules: [
			{ input: '#JournalDetail_clinet', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null&&$('#JournalDetailusers').val()=='') return false;
						return true;
					} 
			},
			{ input: '#JournalDetail_vendor', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null&&$('#JournalDetailusers').val()=='') return false;
						return true;
					} 
			},
			/*{ input: '#JournalDetail_allclient', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null||input.val()=='') return false;
						return true;
					} 
			},*/
			{ input: '#JournalDetailusers', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null&&input.val()!='') return false;
						return true;
					} 
			},
			{ input: '#JournalDetail_ordercreateby', message: "请选择", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					if(input.jqxComboBox('getSelectedItem')==null&&input.val()!='') return false;
						return true;
					} 
			},
//			{ input: '#JournalDetailusers_mon', message: "请选择", action: 'keyup,change', 
//				rule: function(input,commit){
//					if(input.is(':hidden')) return true; 
//					var item=input.jqxComboBox('getSelectedItem')
//					if(item==null&&input.val()!='') return false;					
//					return true
//					} 
//			},
			{ input: '#JournalDetailusers_mon', message: "其他应收款贷方金额不能大于预支金额", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					var item=input.jqxComboBox('getSelectedItem')					
					if(item!=null&&parseFloat(money(item.originalItem.amt))<parseFloat(money(pipiusers_mon)))	
						return false;
					return true
					} 
			},
			{ input: '#JournalDetail_receiptNum', message: "不能为空", action: 'keyup,change', 
				rule: function(input,commit){
					if(input.is(':hidden')) return true; 
					var v=input.val();					
					if(v=='')	{
						return false;
					}
						
					return true
					} 
			}
                
                ]
	})
	
	$('#JournalDetailTableAdd').on('click',function(){
		var url=_global_settings.service.url+'/ac/';
		if($(this).attr('id')==='JournalDetailTableAddAndSubmit'){
			url=url+'/commit/%20';
			console.log(url);
		}else{
			url=url+new Base64().encode('tosys/coaReport/create/'+currentUserInfo.id+'/'+currentUserInfo.loginId+'/'+_global_settings.owner.username);
		}
		//验证tr行有输入行数据是否完整
		//console.log(JournalDetailTableIsSelect());
		 if(!JournalDetailTableIsSelect()){
			 
			 return false;
		 }
		 
		 //验证是否有相同的科目
		 var JournalDetailSelectarr=[];
		 var JournalDetailSelecti=0;
		 $.each($('.JournalDetailSelect'),function(){
			 if($(this).val()!==''){
			 JournalDetailSelectarr[JournalDetailSelecti]=$(this).val();
			 JournalDetailSelecti+=1;
			 }
		 })
		 console.log('科目',JournalDetailSelectarr,isRepeat(JournalDetailSelectarr));
		 if(isRepeat(JournalDetailSelectarr)){
			 Core.alert({message:"科目不能相同！"})
			 return false;
		 }
		 
		 
		
		//验证金额输入是否是数字
		//var nodeList=$('#JournalDetailTable>tbody>tr');
		var numList=$('.JournalDetailNum');
		$.each(numList,JournalDetailTableCheckNum);
		console.log('check:',isCheckEd);
		if(isCheckEd===false){
			Core.alert({message:"输入金额只能为数字！"});
			return false;
		}
		
		if($('#JournalDetailNumSum1').text()!==$('#JournalDetailNumSum2').text()){
			Core.alert({message:"借贷不平衡！"});
			return false;
		}
		
		var arr= getJournalDetailTableList();
		
		if(arr.length===0){
			Core.alert({message:"请输入金额！"})
			return false;
		}
		
		var fileInfoIds = [];//文件列表
		$("#JournalDetailattachment").find(".item").each(function(i,v){
			var fid = $(v).attr('data-id');
			if(fid !== undefined){
				fileInfoIds.push(fid);
			}
		});
		
		var json={
				//noteNumber:fileInfoIds.length,
				noteNumber:$('#journalnoteNumber').val(),
				fileInfoIds:fileInfoIds.toString(),
			    "remark": $('#JournalDetailRemark').val(),
			    "journalType": "input",
			    "currency": 'RMB',
			    entryDate:$('#datepicker').val(),
			    "remarkPrint": $('#JournalDetailRemarkPrint').val(),
			    journalDetails:arr
		};
		json=$.extend(true,{},json,getJsonByType());
		console.log(JSON.stringify(json));
		var list = json['journalDetails'];

		var sub = [ 'NV', 'AK', 'HI' ];
		
		var post=JournalDetailTableJsonFormat(list,sub);
		
		if(!$("#JournalDetail_Page").jqxValidator("validate")){
			return false;
		}
		if(post){
			Core.AjaxRequest({
                url : url,
                type: "POST",
                async:false,
                params:json,
                dataType:'text',
                showMsg:false,
                callback: function(res) {
                	if(res){
                		try{
	                		var hide;
	                		if(res == '操作成功'){
	                			hide = '1000'
	                		}else{
	                			hide = '3000'
	                		}
	                		Core.alert({message:''+res+'',hide:hide});
                			$('#Journal').jqxGrid('updatebounddata','cells');
                		}catch(e){}
                		$.closeTab();
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
	);
	
	function JournalDetailTableCheckNum(){
		
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
	
	function  JournalDetailTableNum(){
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
	

	var getJournalDetailTableList = function() {
		
		var arr = [];
		var i=0;
		$.each($('#JournalDetailTable>tbody>tr'), function() {
			
			var that = $(this).children();
			if(that.eq(2).children().val()!==''||that.eq(3).children().val()!==''){
			arr[i] = {
				description : that.eq(0).children().val(),				
				chartOfAccount :{id: that.eq(1).children().val()},
				debitAmt : that.eq(2).children().val()===''?0:that.eq(2).children().val(),
				creditAmt : that.eq(3).children().val()===''?0:that.eq(3).children().val(),
				category1:that.eq(4).children().val(),
				category2:that.eq(5).children().val(),
				 createDate: $('#datepicker').val(),//+' '+ getHMS()
				//createBy:'admin'
			};
			i+=1;
			}
		})
		return arr;
			
		};
		
		
	var JournalDetailTableIsSelect=function(){
			var selectList=$('#JournalDetailTable> tbody>tr');
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
		
	var JournalDetailTableJsonFormat=function(list,arr){
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
			var length=$('.JournalDetailNum').length-1;
			var JournalDetailNumSum1=0;
			var JournalDetailNumSum2=0;
			for(var i=0;i<length;i++){
				var sum=$('.JournalDetailNum').eq(i).val()*1000;
					if(i%2===1 &&!isNaN(sum)){
						JournalDetailNumSum1+=parseInt(sum);
						//console.log($('.JournalDetailNum').eq(i).val());
					}
					if(i%2===0&&!isNaN(sum)){
						JournalDetailNumSum2+= parseInt(sum);
						//console.log($('.JournalDetailNum').eq(i).val());
					}
			}
			console.log('i is:',i);
			return [JournalDetailNumSum1/1000,JournalDetailNumSum2/1000];
		};
		

	  

})()