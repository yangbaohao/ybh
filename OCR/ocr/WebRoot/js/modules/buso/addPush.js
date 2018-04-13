/*
 *新增系统推送界面js 
 */

var AddPushMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/voucher';
	this.boolean=null;
	
	this.initInput=function(){
		me.initNumber();
		me.initPage();
		me.initValidator();
		me.nameBlur();
//		me.amtInput();
	}
	
	this.initNumber=function(){
		Core.AjaxRequest({
			url:_global_settings.service.url+'/code/random/ /5',
			type:'GET',
			async:false,
			callback:function(res){
				$('#addPush-num').val(res);
			},
			failure:function(e){
				
			}
		});
	}
	
	this.initPage=function(){
		$('#addPush-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#addPush-sTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#addPush-eTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		
		$('#addPush-time').on('change',function(){
			setValueById('addPush-time','addPush-sTime','addPush-eTime');
		});
		
		$('#addPush-vouchers').dropDownlist({
			source:{'choose':'请选择','noUse':'未使用金额','use':'已使用金额','overdue':'已过期金额'},
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
//		$('#addPush-show').addClass('hiddendiv');
	}
	
	this.initValidator = function(){
		$('#editPushContent').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#addPush-type', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#addPush-remark', message: '不能为空', action: 'keyup,blur',rule:'required'},
             ]
		});
	}	
	
	this.nameBlur=function(){
		$('#addPush-name').on('blur',function(){
			if($('#addPush-name').val()!=''){
				Core.AjaxRequest({
					type:'GET',
					url:url+'/check/'+$('#addPush-name').val(),
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
		$('#addPush-price').on('input',function(){
			var price = $('#addPush-price').val();
			var val = $('#addPush-sendtype').val();
			if(val=='SYSPUSH') {
				$('#userNumber').text()==''?$('#addPush-amt').val(''):$('#addPush-amt').val(price*parseInt($('#userNumber').text()));;
			} else {
				$('#addPush-num').val()==''?$('#addPush-amt').val(''):$('#addPush-amt').val(price*$('#addPush-num').val());
			}
		});
		
		$('#addPush-num').on('input',function(){
			var val = $('#addPush-num').val();
			$('#addPush-price').val()==''?$('#addPush-amt').val(''):$('#addPush-amt').val(val*$('#addPush-price').val());
		});
		
	}
	
}

var AddPushBindModle=function(addPushMgt){
	var me=this;
	var url=_global_settings.service.url+'/voucher';
	var ids=null;
	
	this.bind=function(){
		//点击搜索
		$('#addPush-search').on('click',function(){
			var	st=$('#addPush-sTime').val(),
				et=$('#addPush-eTime').val(), //时间
				username=$('#addPush-username').val(), //用户名
				sm=$('#addPush-smoney').val(),
				em=$('#addPush-emoney').val(), //付费金额
				vouchers=$('#addPush-vouchers').val(),
				svouchers=$('#addPush-sVouchers').val(),
				evouchers=$('#addPush-eVouchers').val(), //代金券
				telephone=$('#addPush-telephone').val(),//电话号码
				code=$('#addPush-code').val();//活动码
			
			if(!(sm!=''&&em!=''))
				sm=-1,em=-1
				
			if(vouchers=='choose')
				vouchers=-1;
			
			if(!(svouchers!=''&&evouchers!=''))
				svouchers=-1,evouchers=-1;
			
			if(!(st!=''&&et!=''))
				st=-1,et=-1;
			
			if(username=='')
				username=-1;
			
			if(telephone=='')
				telephone=-1;
			
			if(code=='')
				code=-1;
			
			Core.AjaxRequest({
				type:'GET',
				url:_global_settings.service.url+'/informationLogs/search/page/'+sm+'/'+em+'/'+vouchers+'/'+svouchers+'/'+evouchers+'/'+st+'/'+et+'/'+username+'/'+code+'/'+telephone,
				async:false,
//				showMsg:false,
				callback:function(res){
//					console.log(res);
					ids=res.ids;
					$('#addPush-user').text(res.count);
				},
				failure:function(e){
					
				}
			});
			
		});
		
		//点击保存
		$('#addPush-save').on('click',function(){
			var obj = {};
				obj.number=$('#addPush-num').val(), //推送编号
				obj.theme=$('#addPush-type').val(),//主题
				obj.content=$('#addPush-remark').val(); //备注
			
			if($('#editPushContent').jqxValidator('validate') && ids!=undefined && ids!=0){

				Core.AjaxRequest({
					type:'POST',
					url:_global_settings.service.url+'/informationLogs/'+ids,
					async:false,
					params:obj,
					callback:function(res){
						try{
							$('#pushMgtGrid').jqxGrid('updatebounddata','cells');
							$.closeTab();
						}catch(e){}
					},
					failure:function(e){
					}
				});
			}else if(ids==0){
				Core.alert({message:'没有您要搜索的用户，请重新检查您的检索条件！'});
			}else if(ids==undefined||ids==''||ids==null){
				Core.alert({message:'请您先搜索出推送用户数量！'});
			}else{
				Core.alert({message:'请您填写推送必填信息！'});
			}
		});
		
		//点击取消
		$('#addPush-cancle').on('click',function(){
			$.closeTab();
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#addPush-search').off('click');
		$('#addPush-save').off('click');
		$('#addPush-cancle').off('click');
	}
}