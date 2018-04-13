/*
 *代金券推送界面js 
 */

var VouSendMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/voucher';
	this.boolean=null;
	
	this.initInput=function(){
		me.initPage();
		me.initValidator();
		me.nameBlur();
		me.amtInput();
	}
	
	this.initPage=function(){
		$('#vousend-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#vousend-sTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#vousend-eTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#vousend-startTime').datetimeinput({value:new Date(),formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#vousend-endTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		
		$('#vousend-time').on('change',function(){
			setValueById('vousend-time','vousend-sTime','vousend-eTime');
		});
		
		$('#vousend-sendtype').dropDownlist({
			source:{'SYSPUSH':'系统推送','LINE':'线下验码'},
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#vousend-vouchers').dropDownlist({
			source:{'choose':'请选择','noUse':'未使用金额','use':'已使用金额','overdue':'已过期金额'},
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#vousend-type').dropDownlist({
			source:{'ordinary':'普通代金券','all':'全额代金券'},
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
//		$('#vousend-show').addClass('hiddendiv');
		
		$('#vousend-sendtype').on('select',function(){
			var val =  $('#vousend-sendtype').val();
			if(val=='SYSPUSH') {
				$('#vousendNum').css('display','none');
				$('#vousendHead').css('display','');
				$('#vousend-show').css('display','');
				$('#vousend-amt').val('');
			} else {
				$('#vousendNum').css('display','');
				$('#vousendHead').css('display','none');
				$('#vousend-show').css('display','none');
				$('#vousend-amt').val('');
				$('#vousend-num').val('');
			}
		});
	}
	
	this.initValidator = function(){
		$('#vouChersSend').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#vousend-name', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#vousend-price', message: '不能为空', action: 'keyup,blur',rule:'required'},
//                { input: '#vousend-price', message: '联系电话格式不正确,请重新输入', action: 'keyup,blur',
//                	rule:function(input,commit){
//                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
//                		return true;
//                	}
//                },
                { input: '#vousend-num', message: '大于0的数', action: 'keyup,blur',
                	rule:function(input,commit){
                		if($('#vousendNum').is(':hidden')) return true;
                		else {
                			if(/^\d*$/.test(input.val())&&input.val()>0) return true;
                			return false;
                		}
                	}
                },
                { input: '#vousend-startTime',message: '不能为空',action:'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return false;
                		return true;
                	}
                },
                { input: '#vousend-endTime',message: '不能为空',action:'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return false;
                		return true;
                	}
                }
             ]
		});
	}	
	
	this.nameBlur=function(){
		$('#vousend-name').on('blur',function(){
			if($('#vousend-name').val()!=''){
				Core.AjaxRequest({
					type:'GET',
					url:url+'/check/'+$('#vousend-name').val(),
					async:false,
					callback:function(res){
						me.boolean=res;
//						alert(boolean);
					},
					failure:function(){
						
					}
				});
			}
		});
	}
	
	this.amtInput=function(){
		$('#vousend-price').on('input',function(){
			var price = $('#vousend-price').val();
			var val = $('#vousend-sendtype').val();
			if(val=='SYSPUSH') {
				$('#userNumber').text()==''?$('#vousend-amt').val(''):$('#vousend-amt').val(price*parseInt($('#userNumber').text()));;
			} else {
				$('#vousend-num').val()==''?$('#vousend-amt').val(''):$('#vousend-amt').val(price*$('#vousend-num').val());
			}
		});
		
		$('#vousend-num').on('input',function(){
			var val = $('#vousend-num').val();
			$('#vousend-price').val()==''?$('#vousend-amt').val(''):$('#vousend-amt').val(val*$('#vousend-price').val());
		});
		
	}
	
}

var VouSendBindModle=function(vouSendMgt){
	var me=this;
	var url=_global_settings.service.url+'/voucher';
	var ids=null;
	
	this.bind=function(){
		//点击搜索
		$('#vousend-search').on('click',function(){
			var sc=$('#vousend-sc').val(),ec=$('#vousend-ec').val(), //付费金额
				vouchers=$('#vousend-vouchers').val(),svouchers=$('#vousend-sVouchers').val(),evouchers=$('#vousend-eVouchers').val(), //代金券
				st=$('#vousend-sTime').val(),et=$('#vousend-eTime').val(), //时间
				username=$('#vousend-username').val(), //用户名
				code=$('#vousend-code').val();//活动码
			
			if(!(sc!=''&&ec!=''))
				sc=-1,ec=-1
				
			if(vouchers=='choose')
				vouchers=-1;
			
			if(!(svouchers!=''&&evouchers!=''))
				svouchers=-1,evouchers=-1;
			
			if(!(st!=''&&et!=''))
				st=-1,et=-1;
			
			if(username=='')
				username=-1;
			
			if(code=='')
				code=-1;
			
			Core.AjaxRequest({
				type:'GET',
				url:_global_settings.service.url+'/voucher/search/page/'+sc+'/'+ec+'/'+vouchers+'/'+svouchers+'/'+evouchers+'/'+st+'/'+et+'/'+username+'/'+code,
				async:false,
//				showMsg:false,
				callback:function(res){
					console.log(res);
					ids=res.ids;
					$('#userNumber').text(res.count);
				},
				failure:function(res){
					
				}
			});
			
		});
		
		var judge=function(num){
			if(num==0||num==''){
				return false;
			}
			return true;
		}
		
		//点击保存
		$('#vousend-save').on('click',function(){
			var bool=true;
			
			var name=$('#vousend-name').val(), //名称
				sTime=$('#vousend-startTime').val(),eTime=$('#vousend-endTime').val(), //日期
				amount=$('#vousend-price').val(); //单价
				type=$('#vousend-type').val();//类型
				sendType=$('#vousend-sendtype').val();//推送类型
				num = $('#vousend-num').val(),//代金券数量
				userNumber = $('#userNumber').text();
//			debugger;
			if($('#vouChersSend').jqxValidator('validate')){
				if(vouSendMgt.boolean==null){
					Core.alert({message:'代金券名称重复！'});
					return false;
				}
				
				if(sendType=='SYSPUSH'){
					num=-1;
					bool=judge(userNumber);
				} else{
					ids=-1;
				}
				
				if(!bool){
					Core.alert({message:'用户数不能为0或者空！'});
					return false;
				}
				
				Core.AjaxRequest({
					type:'GET',
					url:url+'/putvoucher/'+sendType+'/'+name+'/'+sTime+'/'+eTime+'/'+amount+'/'+ids+'/'+type+'/'+num,
					async:false,
					showMsg:false,
					callback:function(res){
						try{
							setCloseAlertTimeOneSecond();
							$('#vouGrid').jqxGrid('updatebounddata','cells');
							$.closeTab();
						}catch(e){}
					},
					failure:function(){
						
					}
				});
			}
			
//			else if(userNumber==''){
//				Core.alert({message:'请您先搜索出推送用户数量！'});
//			}else if(userNumber==0){
//				Core.alert({message:'没有您要搜索的用户，请重新检查您的检索条件！'});
//			}
		});
		
		//点击取消
		$('#vousend-cancle').on('click',function(){
			$.closeTab();
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#vousend-search').off('click');
		$('#vousend-save').off('click');
		$('#vousend-cancle').off('click');
	}
}