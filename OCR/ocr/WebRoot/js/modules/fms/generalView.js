(function(){
	
	timeOut(function(){
		var a=new app();
		a.init();
	},0)
	
	var app=function(){
		
		var me=this;
		
		var url = _global_settings.service.url;
		
		var id_modal=null;
		
		me.init=function(){
			me.loadPublicControl();
			me.loadEvent();	
			
			me.requestJson();
		}
		
		me.requestJson=function(){
			
			Core.AjaxRequest({
		        url : _global_settings.service.url+'/owner/category/'+currentUserInfo.id,
		        type: "GET",
		        showMsg:false,
		        callback: function(res) {  
		        	$(".category1_name").val(res.category1);
					$(".category1_name").val(res.category2);
		        },
		        failure:function(e){
		        	Core.alert({
						message:e.responseJSON.errorMsg
					})
		        }
		    });
			
			var id;
			if($.pk.data!=undefined ){
				if($.pk.data.dcmid != undefined){
					id = $.pk.data.dcmid ;
				}
			}else if($.pk.id != undefined){
				id = $.pk.id;
			}
			Core.AjaxRequest({
				type:"GET",
				url:url+'/ac/'+new Base64().encode("tobss/receipt/generaldocument/"+id+'/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
				callback:function(res){
					console.log(res);
					json=res;
					var list=res;			
					//debugger
					$("#generalView_returnFlag")[0].checked=list.returnFlag;
					$("#generalView_campanyFlag")[0].checked=list.isStuff;
					$("#generalView_type").val(list.dcmType);
					$("#generalView_clientName").val(list.clientInfoId);
					$("#generalView_vendorName").val(list.clientInfoId);
					$("#generalView_num").val(list.payNumber);
					$("#generalView_time").val(list.entryDate);
					$("#generalView_way").val(list.payWay);
					$("#generalView_category1").val(list.Category1);
					$("#generalView_category2").val(list.Category2);
					$("#generalView_moneyType").val(getCodeData(list.oandiType));
					
					var data=ComboBoxSources.getInfoMapByKey('chartOfAccounts','id');
					//科目
					if(list.coaDeposits!=null){
						var generalView_account=list.coaDeposits.split(',');
						var coaDeposits='';
						for(var i=0;i<generalView_account.length;i++){
							coaDeposits+=data[generalView_account[i]].name+',';
						}
						coaDeposits=coaDeposits.substring(0,coaDeposits.length-1);
						$("#generalView_account").val(coaDeposits);
					}
					//事由
					if(list.coaReasons!=null){
						var generalView_account=list.coaReasons.split(',');
						var coaReasons='';
						for(var i=0;i<generalView_account.length;i++){
							coaReasons+=data[generalView_account[i]].name+',';
						}
						coaReasons=coaReasons.substring(0,coaReasons.length-1);
						$("#generalView_reason").val(coaReasons);
					}
					//支出类别
					if(list.oandiType!=null){
						var generalView_moneyType=list.oandiType.split(',');
						var oandiType='';
						for(var i=0;i<generalView_moneyType.length;i++){
							oandiType+=getCodeData(generalView_moneyType[i])+',';
						}
						oandiType=oandiType.substring(0,oandiType.length-1);
						//$("#generalView_moneyType").html('').comboBox().val(oandiType);
						$("#generalView_moneyType").replaceWith('<input type="text" class="form-control" value="" readonly="readonly" id="generalView_moneyType">');
						$("#generalView_moneyType").val(oandiType);
					}
					
					$("#generalView_amt").val(money(list.amt));
					$("#generalView_preAmount").val(money(list.prepareAmt));
					//debugger
					if(list.isUsername!=false){
						if(list.userId!=null){
							$('#generalView_person-show').removeClass('hide');
						}
						$("#generalView_person").val(list.userId);
						
					}else{
						$("#generalView_person").replaceWith('<input type="text" class="form-control" value="" readonly="readonly" id="generalView_person">');
						$("#generalView_person").val(list.username);
						$('#generalView_person-show').find('.control-label').text('预支人员');
					}
					
					$("#generalView_mark").val(list.lebal);
					$("#generalView_invType").val(getCodeData(list.receiptInvoiceType));
					$("#generalView_tax").val(list.vat);
					$("#generalView_rmb").val(list.currency);
					$("#generalView_invNum").val(list.receiptNumber);
					$("#generalView_invMon").val(list.receiptAmt);
					$("#generalView_addremarkPrint").val(list.remarkprint);
					$("#generalView_addremark").val(list.remark);	
					
					var pindex=$('#generalView_type').jqxDropDownList('getSelectedIndex');
					var index=$('#generalView_moneyType').jqxDropDownList('getSelectedIndex')==-1?0:$('#generalView_moneyType').jqxDropDownList('getSelectedIndex');
					me.set_person(pindex,index,list.coaDeposits,list.coaReasons);
					
					var _addattachment=$("#generalView_addattachment")
					timeOut(function(){
						_addattachment.fileuploader({readonly:true,filelist:list.fileInfoIds});
					})
					
					$.visibleDoFunc($('#generalView_addForm').find('.jqx-dropdownlist-state-normal'),function(x){						
						x.jqxDropDownList('disabled',true);
					})
					$.visibleDoFunc($('#generalView_addForm').find('.jqx-combobox'),function(x){
						x.jqxComboBox('disabled',true);
					})
					$.visibleDoFunc($('#generalView_addForm').find('.jqx-datetimeinput'),function(x){
						x.jqxDateTimeInput('disabled',true);
					})
					$.visibleDoFunc($('#generalView_addForm').find('input'),function(x){							
						x.attr('readonly','readonly');
					})
					
					$("#generalView_accountday").val(list.termValue);
					
					$('#generalView_returnFlag').attr('disabled','disabled');
					$('#generalView_campanyFlag').attr('disabled','disabled');
					
					$('#generalView_print').on('click',function(){
						if(list.dcmType in {'nowreceivables':0,'answerreceivables':1,'preparereceivables':2}){
							window.open('page/print/printHtml.jsp?reportName=CurrencyBill&CurrencyBillId='+list.id+'&printType=pdf');
						}else{
							window.open('page/print/printHtml.jsp?reportName=CurrencyBillPay&CurrencyBillPayId='+list.id+'&printType=pdf');
						}
					});
					
					if(list.createFlag==false){
						$('#generalView_addsave').remove();
					}
					if(list.receiptInvoiceType==null||list.receiptInvoiceType==''){
						$('#generalView_invType_show').remove();
					}
					
					var url = _global_settings.service.url ;
					$('#generalView_save').on('click',function(){
						var _list={};
						_list.amount=list.amt;
						_list.orderNumber=list.payNumber;
						_list.clientInfoId=list.clientInfoId;
						_list.bizId=list.id;
						_list.favouritesType='generraldocument';
						console.log(list);
						Core.AjaxRequest({            
				            url:url+"/favourites",
							type: "POST",
				            params:_list,
				            callback: function(res) {
				            },
				            failure:function(res){
				            }
				        });
					})
					
					$('#generalView_del').on('click',function(){
						Core.confirm({message:'确定要删除？',
							 confirmCallback:function(){
								 Core.AjaxRequest({            
							            url:url+'/generalDocuments/delete/'+id,
										type: "GET",
							            //params:_list,
							            callback: function(res) {
							            	$.closeTab();
							            },
							            failure:function(res){
							            }
							        });
							 }
						});			
						
					})
					
					var nodelist={
						createby:{
							'编辑':'generalView_addsave',
							'删除':'generalView_del',
						}
					}
					var power=new powerStatus(list,nodelist);
					power.init();
					
					idReset('generalView_addForm');
					
					
				},
				failure:function(){
					idReset('generalView_addForm');
					$.closeTab();
				}
			});
		}
		
		me.loadPublicControl=function(){
			var category={};
			if(_global_settings.owner.taxType=='generalvat'){
				category={" ":" ","otherinvoice":"其他","specialinvoice":"增值税专用发票","ordinaryinvoice":"增值税普通发票"};
			}else{
				category={" ":" ","otherinvoice":"其他","ordinaryinvoice":"增值税普通发票"};
			}
			$("#generalView_invType").dropDownlist({
				source:category,
				selectedIndex:0,
				width:"100%"
			});
			
			$("#generalView_addCategory1Btn").on({
				"click":function(){
					var type = $(this).attr("data");
					Core.showModal({					
						type:type,
						broth:"generalView_category1",
						callback:function(res){
						}
					});
				}
			});
			
			$("#generalView_addCategory2Btn").on({
				"click":function(){
					var type = $(this).attr("data");
					Core.showModal({					
						type:type,
						broth:"generalView_category2",
						callback:function(res){
						}
					});
				}
			});
			
			/*$("#generalView_account").coaCombbox({				
				width:'100%',
				height:33,
				displayMember: "name", 
	        	valueMember: "id", 
			});*/
			
			$('#generalView_way').dropDownlist({
				source:{
				'cash':'现金',
				'alipay':'支付宝',
				'wechatpay':'微信支付',
				'bankpay':'银行存款',
				'bankpayonline':'网银支付',
				'cheque':'支票',
				'journalOutflow':'凭证流出',
				'journalInflow':'凭证流入',
				},
				//selectedIndex:0,
				placeHolder:'',
				width:"100%"
			});
			$("#generalView_time").datetimeinput({width:'100%',height:33,value:new Date()});					
			$("#generalView_amt").moneyinput();
			$('#generalView_preAmount').moneyinput();
			$("#generalView_category1").comboBoxType({
				source:ComboBoxSources.getRecords('category1'),
				placeHolder:'',
				width:'100%'
			});
			$("#generalView_category2").comboBoxType({
				source:ComboBoxSources.getRecords('category2'),
				placeHolder:'',
				width:'100%'
			});
			
			$("#generalView_tax").dropDownlist({
				source:{"0":"0%","3":"3%","5":"5%","6":"6%","11":"11%","13":"13%","17":"17%"},
				selectedIndex: 0,
				width:'100%'
			});
			//$("#generalView_rmb").dropDownlist({source:{'RMB':'人民币'},selectedIndex: 0});
			
			
			$("#generalView_type").dropDownlist({
				//source:['现收款','预收款','应收款','现付款','预付款','应付款','其他'],
				source:{'nowreceivables':'现收款','answerreceivables':'预收款',
					'preparereceivables':'应收款','nowpayment':'现付款',
					'answerpayment':'预付款','preparepayment':'应付款','otherdocuments':'其他'},
				width:'100%'
			});
			
			/*$("#generalView_reason").coaCombboxChoose({
				height:33,
				width:'100%',
				selectedIndex:0
			},['a']);*/
			
			$('#generalView_person').comboBox({
				source:ComboBoxSources.getRecords('users'),
				displayMember: "name", 
				valueMember: "userid"
				//selectedIndex:0
			})
			$('#generalView_clientName').comboBox({
				source:ComboBoxSources.getRecords('clientInfo'),
				displayMember: "name", 
				valueMember: "clientInfoid",
				placeHolder:'',
			    height: '33px',
			    width: '100%'
				//selectedIndex:0
			})
			$('#generalView_vendorName').comboBox({
				source:ComboBoxSources.getRecords('clientInfo'),
				displayMember: "name", 
				valueMember: "clientInfoid",
				placeHolder:'',
				width: '100%'
				//selectedIndex:0
			});
		}
		
		me.loadControlPayIn=function(x){
			/*$('#generalView_clientName').comboBox({
				source:ComboBoxSources.getRecords('customer'),
				displayMember: "name", 
				valueMember: "clientInfoid",
				placeHolder:'请选择'
				//selectedIndex:0
			})*/
			/*$("#generalView_account").coaCombbox({				
				width:'100%',
				height:33,
				displayMember: "name", 
	        	valueMember: "id", 
			},['1001','1002','1012']);*/
			$("#generalView_moneyType").dropDownlist({
				source:{'choose':'','outofbusiness':'营业外','mainbusiness':'主营业务',
					'otherbusiness':'其他业务','shorttermloan':'关于借款','OtherPay':'其他应付',
					'interestincome':'利息收入','documentsgetPay ':'冲销应收款 '},
				placeHolder:'',
				width:'100%'/*,
				selectedIndex:0*/
			});			
			if(x==0&&$('#generalView_returnFlag').is(':checked')){
				$("#generalView_moneyType").dropDownlist({
					source:{'returnvendor':'供应商退款'},
					width:'100%',
					selectedIndex:0
				});	
				$('#generalView_addForm').find('.control-label.col-sm-4').each(function(){
					$(this).text($(this).text().replace('应收','应付').replace('预收','预付'));
				})
			}
			
		};
		
		me.loadControlPayOut=function(x){
			/*$('#generalView_clientName').comboBox({
				source:ComboBoxSources.getRecords('vendor'),
				displayMember: "name", 
				valueMember: "clientInfoid",
				placeHolder:'请选择'
				//selectedIndex:0
			})*/
			/*$("#generalView_account").coaCombbox({				
				width:'100%',
				height:33,
				displayMember: "name", 
	        	valueMember: "id", 
			},['1001','1002','1012','1221']);*/
			
			$("#generalView_moneyType").dropDownlist({
				source:{'choose':'','SALES':'销售','MANAGEMENT':'管理','FINANCE':'财务','UNRELATED':'营业外',
					'IMPREST':'提取备用金','ADVANCE':'预支报销','PREPAREWAGES':'预支工资','Otherreceivable':'其他应收',
					'STAFF':'关于职工','REPAYMENT':'关于还款','documentsPay ':'冲销应付款 ','carryoverCost':'结转成本'},
				placeHolder:'',
				width:'100%'
			});
			if(x==3&&$('#generalView_returnFlag').is(':checked')){
				$("#generalView_moneyType").dropDownlist({
					source:{'returnclient':'客户退款'},
					width:'100%',
					selectedIndex:0
				});	
				$('#generalView_addForm').find('.control-label.col-sm-4').each(function(){
					$(this).text($(this).text().replace('应付','应收').replace('预付','预收'));
				})
			}
			
		};
		
		me.loadEvent=function(){
			var eventForType=function(i){
				switch(i){
						case 0:
							(function(){
								$('#generalView_addForm').find('.hide').removeClass('hide');
								$('#generalView_moneyType').trigger('change');
								if($('#generalView_returnFlag').is(':checked')){
									$('#generalView_clientName_show').addClass('hide');
								}else{
									$('#generalView_vendorName_show').addClass('hide');
								}
								if($('#generalView_campanyFlag').is(':checked')){
									$('#generalView_campanyFlag_show').addClass('hide');
								}
							})();
							break;
						case 1:
							(function(){
								$('#generalView_addForm').find('.hide').removeClass('hide');
								$('#generalView_moneyType').trigger('change');
								$('#generalView_moneyType-show').addClass('hide');
								$('#generalView_reason-show').addClass('hide');
								$('#generalView_vendorName_show').addClass('hide');
								$('#generalView_returnFlag_show').addClass('hide');
							})();
							break;
						case 2:
							(function(){
								$('#generalView_addForm').find('.hide').removeClass('hide');
								$('#generalView_moneyType').trigger('change');
								$('#generalView_way-show').addClass('hide');
								$('#generalView_account-show').addClass('hide');
								$('#generalView_vendorName_show').addClass('hide');
								$('#generalView_returnFlag_show').addClass('hide');
							})();
							break;
						case 3:
							(function(){
								$('#generalView_addForm').find('.hide').removeClass('hide');
								$('#generalView_moneyType').trigger('change');		
								if($('#generalView_returnFlag').is(':checked')){
									$('#generalView_vendorName_show').addClass('hide');
								}else{
									$('#generalView_clientName_show').addClass('hide');
								}
								if($('#generalView_campanyFlag').is(':checked')){
									$('#generalView_campanyFlag_show').addClass('hide');
								}
							})();
							break;
						case 4:
							(function(){
								$('#generalView_addForm').find('.hide').removeClass('hide');
								$('#generalView_moneyType').trigger('change');
								$('#generalView_moneyType-show').addClass('hide');
								$('#generalView_reason-show').addClass('hide');
								$('#generalView_clientName_show').addClass('hide');
								$('#generalView_returnFlag_show').addClass('hide');
							})();
							break;
						case 5:
							(function(){
								$('#generalView_addForm').find('.hide').removeClass('hide');
								$('#generalView_moneyType').trigger('change');
								$('#generalView_way-show').addClass('hide');
								$('#generalView_account-show').addClass('hide');
								$('#generalView_clientName_show').addClass('hide');
								$('#generalView_returnFlag_show').addClass('hide');
							})();
							break;
						case 6:
							(function(){
								
							})();
							break;
						case 7:
							(function(){
								
							})();
							break;
						case 8:
							(function(){
								
							})();
							break;
					}
			}
			
			$('#generalView_type').on('change',function(){
				//debugger
				var index=$(this).jqxDropDownList('getSelectedIndex');
				$('#generalView_moneyType').jqxDropDownList({selectedIndex:0});
				if(index<3){
					
					$('#generalView_addForm').find('.control-label.col-sm-3').each(function(){
						$(this).text($(this).text().replace('付款','收款').replace('支出账户','存入账户')
								.replace('支出类别','收入类别')/*.replace('供应商','客户')*/);
					});
					$('#generalView_addForm').find('.control-label.col-sm-4').each(function(){
						$(this).text($(this).text().replace('应付','应收').replace('预付','预收'));
					});
					$('#generalView_addForm').find('.generalView_returnFlag').each(function(){
						$(this).text($(this).text().replace('客户','供应商'));
					})
					$('#generalView_addForm').find('.generalView_campanyFlag').each(function(){
						$(this).text($(this).text().replace('支出','收入'));
					})
					me.loadControlPayIn(index);
				}else{
							
					$('#generalView_addForm').find('.control-label.col-sm-3').each(function(){
						$(this).text($(this).text().replace('收款','付款').replace('存入账户','支出账户')
								.replace('收入类别','支出类别')/*.replace('客户','供应商')*/);
					});	
					$('#generalView_addForm').find('.control-label.col-sm-4').each(function(){
						$(this).text($(this).text().replace('应收','应付').replace('预收','预付'));
					});
					$('#generalView_addForm').find('.generalView_returnFlag').each(function(){
						$(this).text($(this).text().replace('供应商','客户'));
					
					})
					$('#generalView_addForm').find('.generalView_campanyFlag').each(function(){
						$(this).text($(this).text().replace('收入','支出'));
					})
					me.loadControlPayOut(index);		
				}
				eventForType(index);
			})
			
			$('#generalView_clientName,#generalView_vendorName').on('change',function(){					
				$('#generalView_type').trigger('change');
			})
			
			$('#generalView_returnFlag').on('change',function(){		
				$('#generalView_campanyFlag')[0].checked=false;
				$('#generalView_type').trigger('change');
			})
			
			$('#generalView_campanyFlag').on('change',function(){
				$('#generalView_returnFlag')[0].checked=false;
				$('#generalView_type').trigger('change');
			})
			
			$('#generalView_person,#generalView_account').on('change',function(){						
				var pindex=$('#generalView_type').jqxDropDownList('getSelectedIndex');
				var index=$('#generalView_moneyType').jqxDropDownList('getSelectedIndex')==-1?0:$('#generalView_moneyType').jqxDropDownList('getSelectedIndex');
				me.set_person(pindex,index);
			})
			
			$('#generalView_moneyType').on('change',function(){
				$('#generalView_preAmount-show').addClass('hide');
				$('#generalView_person-show').addClass('hide');
				var pindex=$('#generalView_type').jqxDropDownList('getSelectedIndex');
				var index=$(this).jqxDropDownList('getSelectedIndex');
				var code='';
				if(pindex<3){
					if(pindex==0&&$('#generalView_returnFlag').is(':checked')){						
						return ;
					}
					if(index==7){
						/*$("#generalView_reason").jqxComboBox({
							source:['应收账款'],
							disabled:true,
							selectedIndex:0
						});*/
						$('#generalView_preAmount-show').removeClass('hide');
						return ;
					}
					var map={
						0:'',
						1:'6301',
						2:'6001',
						3:'6051',
						4:'2001',
						5:'2241',
						6:'660302',
						7:'a',
						8:'a',
						9:'a',
						10:'a',
						11:'a',
					};
				}else{
					if(pindex==3&&$('#generalView_returnFlag').is(':checked')){						
						return ;
					}
					if(index==11){
						/*$("#generalView_reason").jqxComboBox({
							source:['应付账款'],
							disabled:true,
							selectedIndex:0
						});*/
						$('#generalView_preAmount-show').removeClass('hide');
						return ;
					}
					var map={							
						0:'',
						1:'6601',
						2:'6602',
						3:'6603',
						4:'6711',
						5:'1001',
						6:'1221',
						7:'1221',
						8:'1221',
						9:'2211',
						10:'2001,2241',
						11:'a',
						12:'6401'
					};
					
				}
				code=map[index].split(',');
				
				/*$("#generalView_reason").coaCombboxChoose({
					height:33,
					width:'100%',
					disabled:false,
					selectedIndex:0
				},code);*/				
				$('#generalView_person').jqxComboBox('clearSelection');	
				me.set_person(pindex,index);			
			});
			
			me.set_person=function(pindex,index,coa,rea){
				//return ;
				var c=coa==null?'':coa;
				var r=rea==null?'':rea;
				if(json.createFlag==false&&json.userId!=null){
					$('#generalView_person-show').removeClass('hide');
				}
				if(pindex>2){
					if((index==6||index==7||index==8)||
							(pindex==3&&!$('#generalView_returnFlag').is(':checked')&&index<11							
							&&$.strEqArr('26',c.split(',')))||$.strEqArr('26',r.split(','))
							){
						$('#generalView_person-show').removeClass('hide');
					}
				}
				if((pindex==3&&!$('#generalView_returnFlag').is(':checked')&&index<11
						&&$('#generalView_person').val()!=''
						&&$.strEqArr('26',c.split(',')))
						){
					$('#generalView_amt').attr('disabled','disabled');
				}else{
					$('#generalView_amt').removeAttr('disabled');
				}
			}
			
			$('#generalView_addsave').on('click',function(){
				$.closeTab();
				$.addTab({title:'编辑通用单据',url:'page/modules/public/generalEdit.html'
					,pk:{id:id},reload:true});
			})
						
		};
		
		me.getJson=function(){
			var generalView_clientName=$("#generalView_clientName").is(':visible')?$("#generalView_clientName").val():null;
			var generalView_type=$("#generalView_type").is(':visible')?$("#generalView_type").val():null;
			var generalView_num=$("#generalView_num").is(':visible')?$("#generalView_num").val():null;
			var generalView_time=$("#generalView_time").is(':visible')?$("#generalView_time").val():null;
			var generalView_way=$("#generalView_way").is(':visible')?$("#generalView_way").val():null;
			var generalView_account=$("#generalView_account").is(':visible')?$("#generalView_account").val():null;
			var generalView_moneyType=$("#generalView_moneyType").is(':visible')?$("#generalView_moneyType").val():null;
			var generalView_reason=$("#generalView_reason").is(':visible')?$("#generalView_reason").val():null;
			var generalView_amt=$("#generalView_amt").is(':visible')?$("#generalView_amt").val():null;
			var generalView_preAmount=$("#generalView_preAmount").is(':visible')?$("#generalView_preAmount").val():null;
			var generalView_person=$("#generalView_person").is(':visible')?$("#generalView_person").val():null;
			var generalView_mark=$("#generalView_mark").is(':visible')?$("#generalView_mark").val():null;
			var generalView_category1=$("#generalView_category1").is(':visible')?$("#generalView_category1").val():null;
			var generalView_category2=$("#generalView_category2").is(':visible')?$("#generalView_category2").val():null;
			var generalView_invType=$("#generalView_invType").is(':visible')?$("#generalView_invType").val():null;
			var generalView_tax=$("#generalView_tax").is(':visible')?$("#generalView_tax").val():null;
			var generalView_rmb=$("#generalView_rmb").is(':visible')?$("#generalView_rmb").val():null;
			var generalView_invNum=$("#generalView_invNum").is(':visible')?$("#generalView_invNum").val():null;
			var generalView_invMon=$("#generalView_invMon").is(':visible')?$("#generalView_invMon").val():null;
			
			var generalView_addremarkPrint=$("#generalView_addremarkPrint").is(':visible')?$("#generalView_addremarkPrint").val():'';
			var generalView_addremark=$("#generalView_addremark").is(':visible')?$("#generalView_addremark").val():'';
			
			var documentType='sales';
			if($('#generalView_type').jqxDropDownList('getSelectedIndex')>2){
				documentType='purchase';
			}
			var fileInfoIds = [];//文件列表
			$("#generalView_addattachment").find(".item").each(function(i,v){
				var fid = $(v).attr('data-id');
				if(fid !== undefined){
					fileInfoIds.push(fid);
				}
			});
			fileInfoIds=fileInfoIds.toString();
			
			return {
					clientInfoId:generalView_clientName,
					payNumber:generalView_num,
					payWay:generalView_way,
					dcmType:generalView_type,
					currency:generalView_rmb,
					receiptNumber:generalView_invNum,
					receiptInvoiceType:generalView_invType,
					amt:generalView_amt,
					lebal:generalView_mark,
					prepareAmt:generalView_preAmount,
					vat:generalView_tax,
					receiptAmt:generalView_invMon,
					entryDate:generalView_time,
					oandiType:generalView_moneyType,					
					Category1:generalView_category1,
					Category2:generalView_category2,
					coaDeposits:generalView_account,
					coaReasons:generalView_reason,
					remark:generalView_addremark,
					remarkprint:generalView_addremarkPrint,
					documentType:documentType,
					userId:generalView_person,
					fileInfoIds:fileInfoIds
			};
		}
		
		me.save=function(){
			var json=me.getJson();			
			Core.AjaxRequest({
                url : url+'/generalDocuments/',
                type: "POST",
                async:false,
                params:json,
                callback: function(res) {
                	$.closeTab();
                },
                failure:function(res){
                }
            });
		};
				
	}
	
})();