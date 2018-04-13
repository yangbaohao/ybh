
var agentType=null;
var phoneNumber=null;
var phoneMes=null;
var userName=null;
var passWord=null;
var rpassWord=null;
var currentUrl = window.location.pathname;

(function(){
	$('#reg-getMessage').attr('disabled',true);
	if(currentUrl.indexOf('SimpleBss')==1)
		currentUrl = currentUrl.substring(0,10);
	else
		currentUrl = '';
	
	console.log('currentUrl:'+currentUrl);
	
	var boolean=false;
	var phone = false;
	var mes = null;
	var count = 0;//验证码点击次数
	
	var path=window.location.href;
	
	var parentAgentCode=null;
	var salesId=null;
	var customerId=null;
	
	var regparentAgentCode=/parentAgentCode=(\w+)&?/;
	if(regparentAgentCode.test(path)){
		parentAgentCode=regparentAgentCode.exec(path)[1];
	}	
	
	var regsalesId=/salesId=(\w+)&?/;
	if(regsalesId.test(path)){
		salesId=regsalesId.exec(path)[1];
	}
	
	var regcustomerId=/customerId=(\w+)&?/;
	if(regcustomerId.test(path)){
		customerId=regcustomerId.exec(path)[1];
	}
	
//	alert('ssss:'+salesId);
	
	if(parentAgentCode!=null){
//		$('#parentAgentCode').attr('class','row');
		$('#reg-parentAgentCode').val(parentAgentCode);
	}
	
	$.ajax({
		//async:false,
//		url:'/ACBss/CXF/rs/salesagent/getcode/agentcode',
		url:currentUrl+'/CXF/rs/salesagent/getcode/agentcode',
		type:'GET',
		dataType:'text',
		success:function(res){
			$('#reg-agentCode').val(res);
		}
	});
	
	var typeChange=function(){
		//点击获取验证码
		$('#reg-getMessage').off('click').on('click',function(){
//			$('#getMes-div').addClass('coverdiv');
			$('#reg-getMessage').attr('disabled',true);
			count+=1;
//			alert(phone);
			//debugger;
			if(phone){
				var val = $('#reg-phone').val();
				$.ajax({
//	                url: '/ACBss/CXF/rs/salesagent/direct/valid/' + val + '/' + count,
	                url: currentUrl+'/CXF/rs/salesagent/direct/valid/' + val + '/' + count,
	                type:'GET',
	                dataType:'text',
	                //async:false,
	                success: function(data){
	                	mes = data;
	                	console.log('DATA:'+data);
	                	//return false;
	    			}
	    		});
				settime('reg-getMessage');
				
			} else {
				//return false;
			}
		});
		
		var countdown=60;
		var settime=function(obj) {
		    if (countdown == 0) {
//		        $('#getMes-div').removeClass('coverdiv');
		        $('#reg-getMessage').attr('disabled',false);
		        $('#'+obj).text('重新发送');
		        countdown = 60; 
		        return ;
		    } else {
		    	countdown--;
//		        $('#getMes-div').addClass('coverdiv');
		        $('#'+obj).text('重新发送'+countdown+'s');
//		        setTimeout(function() { 
//				    settime('reg-getMessage') }
//				    ,1000);
//		        return false;
		    } 
		    setTimeout(function() { 
			    settime('reg-getMessage') }
			    ,1000)
		};
		
			
		//手机号码
		$('#reg-phone').on('input',function(){
			if($(this).val()!=''){
				if(/^1[3|4|5|7|8]\d{9}$/.test($(this).val())){
//					$('#getMes-div').removeClass('coverdiv');
					$('#reg-getMessage').attr('disabled',false);
				}else {
//					$('#getMes-div').addClass('coverdiv');
					$('#reg-getMessage').attr('disabled',true);
				}
			}
		});	
			
		
		//手机号码
		$('#reg-phone').on('blur',function(){
			if($(this).val()==''){
				$('#phone-check').css('display','');
				$('#phone-check1').css('display','none');
				$('#phone-checked').css('display','none');
//				boolean = false;
			} else {
				$('#phone-check').css('display','none');
				if(!(/^1[3|4|5|7|8]\d{9}$/.test($(this).val()))){
					$('#phone-check1').css('display','');
					$('#phone-ceecked').css('display','none');
//					boolean = false;
				} else {
					$('#phone-check1').css('display','none');
					$('#phone-checked').css('display','');
//					boolean = true;
					phone = true;
					$('#reg-userName').val($(this).val());
					
//					$('#getMes-div').removeClass('coverdiv');
					$('#reg-getMessage').attr('disabled',false);
				}
			}
		});
		
		//短信验证码
		/*$('#reg-message').on('blur',function(){
			if($(this).val()==''){
				$('#message-check1').css('display','');
				$('#message-check').css('display','none');
				$('#message-checked').css('display','none');
			} else {
				$('#message-check1').css('display','none');
				if(mes!=null){
					if($(this).val()!=mes){
						$('#message-check').css('display','');
						$('#message-checked').css('display','none');
					} else {
						$('#message-check').css('display','none');
						$('#message-checked').css('display','');
					}
				}
			}
		});*/
		
	
		//第一页信息校验
		var judgeFirst=function(){
			
			//类型
			$('#reg-agentType').on('change',function(){
				if($(this).val()=='choose'){
					$('#agentType-check').css('display','');
				}else{
					$('#agentType-check').css('display','none');
				}
			});
			
			//用户名
			$('#reg-userName').on('blur',function(){
				if($(this).val()==''){
					$('#userName-check').css('display','');
					$('#userName-check1').css('display','none');
					$('#username-check2').css('display','none');
					$('#userName-checked').css('display','none');
//					boolean = false;
				} else {
					$('#userName-check').css('display','none');
					if(!/^[A-Za-z0-9_]+$/.test($(this).val())){ //是中文
						$('#userName-check2').css('display','');
						$('#userName-check1').css('display','none');
						$('#userName-checked').css('display','none');
					} else {
						$('#userName-check2').css('display','none');
						$.ajax({
							type:'GET',
							url:currentUrl+'/CXF/rs/user/username/'+$(this).val(),
//							url:'/ACBss/CXF/rs/user/username/'+$(this).val(),
		//					async:false,
							success:function(re){
								console.log('RE:'+re);
								if(re==undefined){
									$('#userName-check1').css('display','none');
									$('#userName-checked').css('display','');
//									boolean = true;
								} else {
//									boolean = false;
									$('#userName-check1').css('display','');
									$('#userName-checked').css('display','none');
								}
							}
						});
					}
				}
			});
			
			
			//密码
			$('#reg-password').on('blur',function(){
				if($(this).val()==''){
					$('#password-check').css('display','');
					$('#password-checked').css('display','none');
					$('#password-check1').css('display','none');
//					boolean = false;
				} else {
					if($(this).val().length < 6){
						$('#password-check').css('display','none');
						$('#password-checked').css('display','none');
						$('#password-check1').css('display','');
//						boolean = false;
					} else {
						$('#password-check').css('display','none');
						$('#password-check1').css('display','none');
						$('#password-checked').css('display','');
//						boolean = true;
					}
				}
			});
			
			//确认密码
			$('#reg-apassword').on('blur',function(){
				var pw = $('#reg-password').val();
				if($(this).val()==''){
					$('#apassword-check1').css('display','');
					$('#apassword-checked').css('display','none');
					$('#apassword-check').css('display','none');
//					boolean =false;
				} else {
					if($(this).val()==pw){
						$('#apassword-check1').css('display','none');
						$('#apassword-checked').css('display','');
						$('#apassword-check').css('display','none');
//						boolean = true;
					} else {
						$('#apassword-check1').css('display','none');
						$('#apassword-checked').css('display','none');
						$('#apassword-check').css('display','');
//						boolean = false;;
					}
				}
			});
			
		};
		
		judgeFirst();
		
		
		//点击立即注册
		$('#registerBtn').on('click',function(){
			if($('#reg-agentType').val()=='choose'){
				$('#agentType-check').css('display','');
				boolean =false;
			}else{
				$('#agentType-check').css('display','none');
				//手机号码
				if($('#reg-phone').val()==''){
					$('#phone-check').css('display','');
					$('#phone-check1').css('display','none');
					$('#phone-checked').css('display','none');
					boolean = false;
				} else {
					$('#phone-check').css('display','none');
					if(!(/^1[3|4|5|7|8]\d{9}$/.test($('#reg-phone').val()))){
						$('#phone-check1').css('display','');
						$('#phone-ceecked').css('display','none');
						boolean = false;
					} else {  //手机号码校验正确
						$('#phone-check1').css('display','none');
						$('#phone-checked').css('display','');
						boolean = true;
						
					//用户名
						if($('#reg-userName').val()==''){
							$('#userName-check').css('display','');
							$('#userName-check1').css('display','none');
							$('#userName-checked').css('display','none');
							boolean = false;
						} else {
							$('#userName-check').css('display','none');
							if(!/^[A-Za-z0-9_]+$/.test($('#reg-userName').val())){ //中文
								$('#userName-check2').css('display','');
								$('#userName-check1').css('display','none');
								$('#userName-checked').css('display','none');
								boolean = false;
							} else {
								$('#userName-check2').css('display','none');
								$.ajax({
									type:'GET',
//									url:'/ACBss/CXF/rs/user/username/'+$('#reg-userName').val(),
									url:currentUrl+'/CXF/rs/user/username/'+$('#reg-userName').val(),
//									async:false,
									success:function(re){
										console.log('RE:'+re);
										if(re==undefined){  //用户名校验正确
//											alert('one');
											$('#userName-check1').css('display','none');
											$('#userName-checked').css('display','');
											boolean = true;
											
										//密码
											if($('#reg-password').val()==''){
												$('#password-check').css('display','');
												$('#password-check1').css('display','none');
												$('#password-checked').css('display','none');
												boolead = false;
											} else {
												if($('#reg-password').val().length < 6){
													$('#password-check').css('display','none');
													$('#password-check1').css('display','');
													$('#password-checked').css('display','none');
													boolead = false;
												} else {   //密码校验正确
													$('#password-check').css('display','none');
													$('#password-check1').css('display','none');
													$('#password-checked').css('display','');
													boolead = true;
													
												//确认密码
													if($('#reg-apassword').val()==''){
														$('#apassword-check1').css('display','');
														$('#apassword-check').css('display','none');
														boolean = false;
													} else {
														if($('#reg-apassword').val()!=$('#reg-password').val()){
															$('#apassword-check').css('display','');
															$('#apassword-check1').css('display','none');
															$('#apassword-checked').css('display','none');
															boolean = false;
														} else { //确认密码校验正确
															$('#apassword-check').css('display','none');
															$('#apassword-check1').css('display','none');
															$('#apassword-checked').css('display','');
															boolean = true;
															
//															if(mes==null){
//																boolean = false;
//															}
															
//															alert(boolean);
															//传值到后台保存
															if(boolean){
																
																agentType=$('#reg-agentType').val();
																phoneNumber=$('#reg-phone').val();
																phoneMes=$('#reg-message').val();
																userName=$('#reg-userName').val();
																passWord=$('#reg-password').val();
																rpassWord=$('#reg-apassword').val();
																
																
																var obj={};
																obj.user={};
																obj.userInfo={};
																if(salesId!=null){
																	obj.sales = {};
																	obj.sales.id = salesId;
																}
																
																if(customerId!=null){
																	obj.customer = {};
																	obj.customer.id = customerId;
																}
																
																console.log(salesId);
																
																obj.parentAgentCode=parentAgentCode;
																
																obj.type = $('#reg-agentType').val();
																obj.agentCode = $('#reg-agentCode').val();
																obj.rate=0;
																
																obj.userInfo.type = $('#reg-agentType').val();
																obj.agentName = $('#reg-userName').val();
																
																obj.user.valid = $('#reg-message').val();
																obj.userInfo.telephone = $('#reg-phone').val();
																
																obj.userInfo.ownerId  = -1;
																obj.userInfo.createDate=new Date();
																obj.userInfo.createBy=$('#reg-userName').val();
																
																if($('#reg-agentType').val()=='person'){
																	obj.userInfo.name=$('#reg-userName').val();
																}
																
																//用户信息
																obj.user.ownerId=-1;
																obj.user.username=$('#reg-userName').val();
																obj.user.password=$('#reg-password').val();
																obj.user.oldPassword=$('#reg-apassword').val();
																obj.user.createBy=$('#reg-userName').val();
																obj.user.createDate=new Date();
																obj.user.roles=[{id:2}];
																
																obj.userInfo.address = [];
																//保存
																$.ajax({
																	dataType:'json',
																	data:JSON.stringify(obj),
																	contentType:'application/json; charset=UTF-8',
																	type:'POST',
//																	url:'/ACBss/CXF/rs/salesagent/savephone/',
																	url:currentUrl+'/CXF/rs/salesagent/savephone/',
																	//async:false,
																	success:function(res){
//																		window.location.href = 'page/reg/ewm.html?text='+$('#reg-agentCode').val();
																		$('#registerPage').css('display','none');
																		$('#register-success').css('display','');
																	},
																	error:function(data){
																		console.log(data);
																		$('#registerPage').css('display','none');
																		$('#register-fail').css('display','');
//																		$('#mes-span').text(data.responseText.substring(28,35));
//																		console.log(data.responseText);
																	}
																});
															} else {
																return false;
															}
															
														}
													}
													
												}
											}
											
										} else {  //用户名重复
//											alert('again');
											boolean = false;
											$('#userName-check1').css('display','');
											$('#userName-checked').css('display','none');
										}
									}
								});
							}
						}
						
					}
				}
			}
			
		});
		
		//返回重新注册
		$('#back-register').on('click',function(){
			$('#register-fail').css('display','none');
			$('#registerPage').css('display','block');
//			debugger;
			$('#reg-agentType').val(agentType);
			$('#reg-phone').val(phoneNumber);
			$('#reg-message').val(phoneMes);
			$('#reg-userName').val(userName);
			$('#reg-password').val(passWord);
			$('#reg-apassword').val(rpassWord);
		});
		
		//点击立即登录
		$('#return-login').on('click',function(){
			$('#return-login').parent().attr('href',currentUrl+'/page/login/login.jsp');
		});
		
	}();
	
})();