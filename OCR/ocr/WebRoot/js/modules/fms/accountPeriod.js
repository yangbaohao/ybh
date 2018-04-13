timeOut(function(){
(function(){
	
	var url = _global_settings.service.url;
	
	var acpd_pass=true;
	
	var acpd_come=0;
	
	//timeOut(function(){
		$('#acpd-datetime').monthpicker({
			callback:'a'
		});	
	//},10)
	
	//检查是否显示业务往来
	checkInitialAccountPeriod(addYWWL);
	
	$('.acpd-label1').on('click',function(){
		$.addTab({title:"期末结转",isFrame:false,url:"page/modules/fms/finalTransaction.html",
			reload:true});
	})
	
	$('.acpd-label2').on('click',function(){
		$.addTab({title:"资产负债表",isFrame:false,url:"page/modules/equipment/assetLiabilitie.html",
			reload:true});
	})
	
	$('#acpd-cknow').on('click',function(){	
//		debugger
		
		if(currentUserInfo.mouthDate<$('#acpd-datetime').val()){
			Core.confirm({
				 message:currentUserInfo.mouthDate+"账期未关闭,是否继续检查"+$('#acpd-datetime').val()+'账期？',
				 title:'提示',
				 confirmCallback:function(){
					 	acpd_come++;
						$('.acpd_YWWL').remove();
						//debugger
						checkInitialAccountPeriod(addYWWL);
						//检查后3项
						Core.AjaxRequest({
							type:"GET",
							//showMsg:false,
							url:url+"/ac/"+new Base64().encode("tosys/carryover/search/accounts/"+$('#acpd-datetime').val()+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
							callback:function(res){
								var data=res;
								var len=0;
								var len2=0;
								var html='';
								var html2=''	
								//$('#accountPeriodmoderlist').find('.panel-heading').trigger("click");
								for(var i in data){
												
									if(i!=='报表结平'){
										if(i==='结转损益'){
											var span='<span style="padding-left:10px;color:red;font-weight:900;font-size:17px;">!<span>';
											acpd_pass=false;
										}else{
											var span='<span style="padding-left:10px;color:yellow;font-weight:900;font-size:17px;">!<span>';
										}
										html+='<tr style="border-bottom: 2px solid #D2D2D2;">'+
											'<td style="width: 40%;"><span >'+i+'</span></td>'+
											'<td>本月未'+i+span+'</td>'+
										'</tr>';
										len+=1;
									}else{
										//$('#acpd-goon').attr('disabled','disabled');	
										//$('#acpd-goon').css('display','none');
										var span='<span style="padding-left:10px;color:red;font-weight:900;font-size:17px;">!<span>';
										html2+='<tr style="border-bottom: 2px solid #D2D2D2;">'+
										'<td style="width: 40%;"><span >资产负债表</span></td>'+
										'<td>不平'+span+'</td>'+
									'</tr>';
										len2+=1;
										acpd_pass=false;
									}
									
								}
								$('.acpd-label1').text('共有6项——其中'+len+'项会有危险');
								$('.acpd-label2').text('共有1项——其中'+len2+'项会有危险');
								$('#acpd-finalTransaction').find('tbody').html(html);
								$('#acpd-reportform').find('tbody').html(html2);
								if(len>0){
									$('#acpd-finalTransaction').collapse('show');
								}else{
									$('#acpd-finalTransaction').collapse('hide');
								}
								if(len2>0){
									$('#acpd-reportform').collapse('show');
								}else{
									$('#acpd-reportform').collapse('hide');
								}
								acpd_step_func();
							},
							failure:function(res){
					        	//Core.alert({message:"系统出错！"});
					        }
						});
				 }
			});
		}else{
			acpd_come++;
			$('.acpd_YWWL').remove();
			//debugger
			checkInitialAccountPeriod(addYWWL);
			//检查后3项
			Core.AjaxRequest({
				type:"GET",
				//showMsg:false,
				url:url+"/ac/"+new Base64().encode("tosys/carryover/search/accounts/"+$('#acpd-datetime').val()+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
				callback:function(res){
					var data=res;
					var len=0;
					var len2=0;
					var html='';
					var html2=''	
					//$('#accountPeriodmoderlist').find('.panel-heading').trigger("click");
					for(var i in data){
									
						if(i!=='报表结平'){
							if(i==='结转损益'){
								var span='<span style="padding-left:10px;color:red;font-weight:900;font-size:17px;">!<span>';
								acpd_pass=false;
							}else{
								var span='<span style="padding-left:10px;color:yellow;font-weight:900;font-size:17px;">!<span>';
							}
							html+='<tr style="border-bottom: 2px solid #D2D2D2;">'+
								'<td style="width: 40%;"><span >'+i+'</span></td>'+
								'<td>本月未'+i+span+'</td>'+
							'</tr>';
							len+=1;
						}else{
							//$('#acpd-goon').attr('disabled','disabled');	
							//$('#acpd-goon').css('display','none');
							var span='<span style="padding-left:10px;color:red;font-weight:900;font-size:17px;">!<span>';
							html2+='<tr style="border-bottom: 2px solid #D2D2D2;">'+
							'<td style="width: 40%;"><span >资产负债表</span></td>'+
							'<td>不平'+span+'</td>'+
						'</tr>';
							len2+=1;
							acpd_pass=false;
						}
						
					}
					$('.acpd-label1').text('共有6项——其中'+len+'项会有危险');
					$('.acpd-label2').text('共有1项——其中'+len2+'项会有危险');
					$('#acpd-finalTransaction').find('tbody').html(html);
					$('#acpd-reportform').find('tbody').html(html2);
					if(len>0){
						$('#acpd-finalTransaction').collapse('show');
					}else{
						$('#acpd-finalTransaction').collapse('hide');
					}
					if(len2>0){
						$('#acpd-reportform').collapse('show');
					}else{
						$('#acpd-reportform').collapse('hide');
					}
					acpd_step_func();
				},
				failure:function(res){
		        	//Core.alert({message:"系统出错！"});
		        }
			});
		}		
	});
	
	
	$('#acpd-goon').on('click',function(){
		Core.AjaxRequest({
			type:"GET",
			async:false,
			showMsg:false,
			url:url+"/common/owner/accountperiod/"+currentUserInfo.id,
			callback:function(res){
				accountdate = res.accountPeriodMonth;
				console.log(accountdate);
			},
			failure:function(res){
	        	Core.alert({message:"系统出错！"});
	        }
		})
		if(accountdate<$('#acpd-datetime').val()){
			Core.alert({message:accountdate+'账期未关闭，请检查'+accountdate+'账期'});
			return false;
		}

		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			url:url+"/ac/"+new Base64().encode("tosys/carryover/closeAccountPeriod/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
			async:false,
			callback:function(res){
				//$('#acpd-goon').css('display','none');		
				//$('#acpd-goback').css('display','');
				var sss=res.createBy ;
				if(sss=='报表结平'){
					var mn=res.accountPeriodMonth.toString().substring(5,7);
					if(mn==0){
						mn=12;
					}
					if(mn.length==1){
						mn='0'+mn;
					}
					var msg=mn+'月份报表不平，不能结账！';
					Core.alert({message:msg});
					_global_settings.owner.accountPeriodMonth=res.accountPeriodMonth;
					
				}else{
					var m=res.accountPeriodMonth.toString().substring(5,7)-1;
					if(m==0){
						m=12;
					}
					if(m.length==1){
						m='0'+m;
					}
					var msg='结账成功，'+m+'月份账期已关闭';
					Core.alert({message:msg});
					_global_settings.owner.accountPeriodMonth=res.accountPeriodMonth;
				}
			},
			failure:function(res){
	        	Core.alert({message:"系统出错！"});
	        }
		});
	});
	
	
	$('#acpd-goback').on('click',function(){
		Core.AjaxRequest({
			type:"GET",
			async:false,
			url:url+"/ac/"+new Base64().encode("tosys/carryover/reOpenAccountPeriod/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
			callback:function(res){
				var msg = "没有关闭的会计期，不能反结账！"
				 if(res.accountPeriodMonth!=undefined){
					var m=res.accountPeriodMonth.toString().substring(0,7);
					
					 msg='反结账成功，'+m+'月份账期已打开';
				}
				Core.alert({message:msg});
				_global_settings.owner.accountPeriodMonth=res.accountPeriodMonth;
			},
			failure:function(res){
	        	//Core.alert({message:"系统出错！"});
	        }
		});
	});
	
	
	function addYWWL(bool){
		//已结账
		if(!bool){
			return false;
		}
		var html=					'<div class="panel panel-default acpd_YWWL">                                                              '+
		'	<div class="panel-heading" data-toggle="collapse"                                           '+
		'		data-parent="#accordion-test-2zf1" href="#acpd-YWWL"                        '+
		'		aria-expanded="false">                                                                  '+
		'		<h4 class="panel-title">                                                                '+
		'			<a class="zkk collapsed"><span class="acpd-num">1</span>.业务往来挂账与财务往来账款</a><span class="weijiancha"><a'+
		'				class="hoverspan acpd-label0" style="color: #169ad0;"                           '+
		'				></a></span>                                           '+
        '                                                                                               '+
		'		</h4>                                                                                   '+
		'	</div>                                                                                      '+
		'	<div id="acpd-YWWL" class="panel-collapse collapse"                                         '+
		'		aria-expanded="false" style="height: 0px;">                                             '+
		'		<div class="panel-body">                                                                '+
		'			<div class="card-box" style="background: #ffffff;">                                 '+
		'				<div class="row">                                                               '+
		'					<div class="table-responsive">                                              '+
		'						<table class="table m-0 tablewhite">                                    '+
		'							<tbody>                                                             '+
		'							</tbody>                                                            '+
		'						</table>                                                                '+
		'					</div>                                                                      '+
        '                                                                                               '+
		'				</div>                                                                          '+
		'			</div>                                                                              '+
		'		</div>                                                                                  '+
		'	</div>                                                                                      '+
		'</div>                                                                                         ';
		$('#acpd-check1').children().eq(0).before(html);
		
		if(acpd_come!=0){
			//检查隐藏项
			Core.AjaxRequest({
				type:"GET",
				//showMsg:false,
				url:url+"/ac/"+new Base64().encode("tosys/carryover/search/accountsForInit/"+$('#acpd-datetime').val()+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
				callback:function(res){
					var html='',len0=0;
					if(res!=null){
						var span='<span style="padding-left:10px;color:red;font-weight:900;font-size:17px;">!<span>';
						var map={
							'期初预收款':'客户期初预收总额-预收账款期初值=',
							'期初应收款':'客户期初应收总额-应收账款期初值=',
							'期初预付款':'供应商期初预付总额-预付账款期初值=',
							'期初应付款':'供应商期初应付总额-应付账款期初值='
						};
						
						for(var i in res){
							if(res[i]!=0){
								html+='<tr style="border-bottom: 2px solid #D2D2D2;">'+
								'<td style="width: 40%;"><span >'+i+'</span></td>'+
								'<td>'+map[i]+(res[i]>0?moneyBig(res[i])+'>0':moneyBig(res[i])+'<0')+span+'</td>'+
								'</tr>';
								len0+=1;
								acpd_pass=false;
							}
						}
						
					}
					$('.acpd-label0').text('共有4项——其中'+len0+'项会有危险');
					$('#acpd-YWWL').find('tbody').html(html);
					//debugger
					if(len0>0){
						$('#acpd-YWWL').collapse('show');
					}else{
						$('#acpd-YWWL').collapse('hide');
					}
					//$('#accountPeriodmoderlist').find('.panel-heading').eq(0).trigger("click");
					acpd_step_func();
					console.log(res);
				},
				failure:function(res){
					
				}
			});
		}else{
			acpd_step_func();
		}
		
	}
	
	function acpd_step_func(){
		$('.acpd-num').each(function(i,v){
			$(this).text(i+1);
		})
		if(acpd_come!=0){
			if(acpd_pass==false){
				$('.acpd-label3').text('有红色风险，不可继续结账！')
			}else{
				$('.acpd-label3').text('无红色风险，点击继续结账，去结账吧！')
			}
		}		
	}
	//window.acpd_step_func=acpd_step_func
})()
},10)