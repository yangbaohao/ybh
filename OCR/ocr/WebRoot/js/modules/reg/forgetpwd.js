(function(){
//	$("#forgetpwd_close").click(function(){
//		window.location.href="page/login/login.jsp";
//	});
	var count = 0;
	var flag;
	var urlParam;
	var tmpValid;
	var exists;
	var curWwwPath = window.document.location.href;
	var pathName =  window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	var localhostPaht = curWwwPath.substring(0,pos);
	var projectName = pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	
	var baseUrl = window.location.pathname;
	
	if(baseUrl.indexOf('SimpleBss')==1)
		baseUrl = baseUrl.substring(0,6);
	else
		baseUrl = '';
	
	console.log('baseUrl:'+baseUrl);
	
	$("#btn1").attr("disabled",true);
	
	//倒计时
	var countdown=60;
	function settime(obj) {
	    if (countdown == 0) {
	        obj.removeAttribute("disabled");
	        $(obj).text("重新发送");
	        countdown = 60; 
	        return;
	    } else {
	    	countdown--;
	        obj.setAttribute("disabled", true);
	        $(obj).text("获取验证码(" + countdown +")");
	    } 
	    setTimeout(function() { 
	    	settime(obj) 
	    	},1000)
	}
	
	function validReg(obj , param){
		
		var regPass = /^(\w{6,20})$/;
		if("" == param){
			var type = $(obj).attr("mark");
			var valT = $(obj).val();
			if(type == 'pass'){
				var result = regPass.test(valT);
				return result;
			}
		}else{
			if(param == 'pass'){
				var result = regPass.test(obj);
				return result;
			}
		}
	}
	
	function validAll(){
		var uname = $("#form-company-username").val();
    	var validCode = $("#form-company-auth-code").val();
    	var pass = $("#form-company-password").val();
    	var realPass = $("#form-company-password-affirm").val();
		//用户名
		if("" == uname){    
			$("#form-uname-close1").css("display","block");
	 		$("#form-uname-check").css("display","none");
	 		$("#form-uname-check1").css("display","none");
	 		flag = false;
		}else{
			$("#form-uname-close1").css("display","none");
			$("#form-uname-check").css("display","block");
    		//验证码
        	if("" == validCode){    
        		$("#form-auth-code-close").css("display","block");
        		$("#form-auth-code-close1").css("display","none");
         		$("#form-auth-code-check").css("display","none");
         		$("#form-auth-code-check1").css("display","none");
         		flag = false;
        	}else{
        		if(1 == 1){
        			$("#form-auth-code-close").css("display","none");
            		$("#form-auth-code-close1").css("display","none");
             		$("#form-auth-code-check").css("display","block");
             		$("#form-auth-code-check1").css("display","none");
            		//密码
                	if("" == pass){
                		$("#form-pass-close").css("display","block");
                		$("#form-pass-close1").css("display","none");
                 		$("#form-pass-check").css("display","none");
                 		$("#form-pass-check1").css("display","none");
                 		flag = false;
                	}else{
                		if(validReg(pass,'pass')){
                			$("#form-pass-close").css("display","none");
                    		$("#form-pass-check").css("display","block");
                    		//确认密码
                        	if("" == realPass){
                        		$("#form-pass-affirm-close").css("display","block");
                         		$("#form-pass-affirm-check").css("display","none");
                         		$("#form-pass-affirm-check1").css("display","none");
                         		flag = false;
                        	}else{
                        		if(pass == realPass){
                        			$("#form-pass-affirm-close").css("display","none");
                            		$("#form-pass-affirm-check").css("display","block");
                            		flag =  true;
                        		}else{
                        			$("#form-pass-affirm-close").css("display","block");
                            		$("#form-pass-affirm-check").css("display","none");
                            		$("#form-pass-affirm-check1").css("display","none");
                            		flag = false;
                        		}
                        	}
                		}else{
                			$("#form-pass-close").css("display","none");
                    		$("#form-pass-close1").css("display","block");
                     		$("#form-pass-check").css("display","none");
                     		$("#form-pass-check1").css("display","none");
                     		flag = false;
                		}
                	}
        		}else{
        			$("#form-auth-code-close").css("display","none");
            		$("#form-auth-code-close1").css("display","block");
             		$("#form-auth-code-check").css("display","none");
             		$("#form-auth-code-check1").css("display","none");
             		flag = false;
        		}
        	}
    	}
		return flag;
	}
        

    //输入用户名
	$("#form-company-uname").on('keyup',function(){
		var uname = $("#form-company-uname").val();
		if(uname == '')
			$("#btn1").attr("disabled",true);
		else 
			$("#btn1").attr("disabled",false);
	});
	
	// 获取光标校验
	$("input").focus(function(){
		var typ = $(this).attr("id");
		if("form-company-username" == typ){
			$("#form-uname-close").css("display","none");
			$("#form-uname-check1").css("display","none");
		}else if("form-company-auth-code" == typ){
			$("#form-auth-code-close").css("display","none");
			$("#form-auth-code-check1").css("display","none");
		}else if("form-company-password" == typ){
			$("#form-pass-close").css("display","none");
			$("#form-pass-check1").css("display","none");
		}else if("form-company-password-affirm" == typ){
			$("#form-pass-affirm-close").css("display","none");
			$("#form-pass-affirm-check1").css("display","none");
		}
	});
	
	// 失去光标校验
	$("input").blur(function(){
		var typ = $(this).attr("id");
		var optionValue = $(this).val();
		
		if("form-company-uname" == typ){
			//用户名
			if("" == optionValue){
				$("#form-uname-close1").css("display","block");
				$("#form-uname-close").css("display","none");
				$("#form-uname-check").css("display","none");
				$("#form-uname-check1").css("display","none");
			}else{
				$.ajax({
					//提交数据的类型 GET
					type:"GET",
					//提交的网址
//					url: baseUrl+"owner/direct/login/" + optionValue,
					url: baseUrl+"/CXF/rs/owner/direct/login/" + optionValue,
					//返回数据的格式
					datatype: "json",
					//成功返回之后调用的函数
					success: function (data) {
						exists = data;
						if(data){
							$("#form-uname-close").css("display","none");
							$("#form-uname-close1").css("display","none");
							$("#form-uname-check").css("display","block");
							$("#form-uname-check1").css("display","none");
							$("#btn1").attr("disabled",false);
			 	        }else{
							$("#form-uname-close").css("display","block");
							$("#form-uname-close1").css("display","none");
							$("#form-uname-check").css("display","none");
							$("#form-uname-check1").css("display","none");
							$("#btn1").attr("disabled",true);
						}
					}
				});
			}
		}else if("form-company-auth-code" == typ){
			//验证码
			if("" == optionValue){
				$("#form-auth-code-close").css("display","block");
				$("#form-auth-code-close1").css("display","none");
				$("#form-auth-code-check").css("display","none");
			}else{
				if(1 == 1){
					$("#form-auth-code-close").css("display","none");
					$("#form-auth-code-check").css("display","block");
				}else{
					$("#form-auth-code-close1").css("display","block");
					$("#form-auth-code-check").css("display","none");
				}
			}
		}else if("form-company-password" == typ){
			//密码
			if("" == optionValue){
				$("#form-pass-close").css("display","block");
				$("#form-pass-close1").css("display","none");
				$("#form-pass-check").css("display","none");
				$("#form-pass-check1").css("display","none");
			}else{
				if(validReg(this,"")){
					$("#form-pass-close").css("display","none");
					$("#form-pass-close1").css("display","none");
					$("#form-pass-check").css("display","block");
					$("#form-pass-check1").css("display","none");
				}else{
					$("#form-pass-close").css("display","none");
					$("#form-pass-close1").css("display","block");
					$("#form-pass-check").css("display","none");
					$("#form-pass-check1").css("display","none");
				}
			}
		}else if("form-company-password-affirm" == typ){
			//确认密码
			if("" == optionValue){
				$("#form-pass-affirm-close").css("display","block");
				$("#form-pass-affirm-check").css("display","none");
			}else{
				var pass = $('#form-company-password').val();
				if(pass == optionValue){
					$("#form-pass-affirm-close").css("display","none");
					$("#form-pass-affirm-check").css("display","block");
				}else{
					$("#form-pass-affirm-close").css("display","block");
					$("#form-pass-affirm-check").css("display","none");
				}
			}
		}
	});
	
	//忘记密码页面
	//免费获取验证码
	$('#btn1').click(function(){
//		if($(this).text()!=='免费获取验证码' && $(this).text()!=='重新发送'){
//			return false;
//		}
		var username = $("#form-company-uname").val();
		if(exists){
			$.ajax({
				//提交数据的类型 GET
				type:"GET",
				//提交的网址
//	            url: baseUrl+"owner/direct/phone/" + username,
	            url: baseUrl+"/CXF/rs/owner/direct/phone/" + username,
	            //返回数据的格式
	          	datatype: "json",
	          	//成功返回之后调用的函数
	          	success: function (data) {
	          		console.log(data);
	          		var a = data.toString().substr(0,3);
	          		var b = "****";
	          		var c = data.toString().substr(3);
	          		var phone = a + b + c;
	          		console.log(phone);
	          		$('#mark_no').text(phone);
          			$('#Confirmphone').slideDown(300);
//          			$('#qyzh').css('boxShadow','0px 0px 0px white');
				}
			});
		}
	});
	
	$('#btn_Confirmphone').on("click",function(){
		$('#Confirmphone').slideUp(300);
		$('#btn1').attr('disabled',true);
//		$('#qyzh').css('boxShadow','0px 0px 0px white');
		
		var i=60;
		var time=function(){
			i-=1;
			$('#btn1').text('获取验证码('+i+')');	
//			$('#btn1').css('disabled',true);
			if(i===0){
				clearInterval(times);
				$('#btn1').text("重新发送");
				$('#btn1').removeAttr('disabled');
			}
		};
		count+=1;
		var times= setInterval(time,1000);
		var uname = $("#form-company-uname").val();
		$.ajax({
			//提交数据的类型 GET
			type:"GET",
			//提交的网址
//			url: baseUrl+"owner/direct/valid/session/" + uname+'/'+count,
			url: baseUrl+"/CXF/rs/owner/direct/valid/session/" + uname+'/'+count,
            //返回数据的格式
          	datatype: "json",
          	//成功返回之后调用的函数
          	success: function (data) {
          		tmpValid = data;
			}
		});
	});
	
	$('#btn_cancelPhone').click(function(){
		$('#Confirmphone').slideUp(300);
//		$('#qyzh').css('boxShadow','0px 0px 0px white');
	});
	
	//点击返回登录
	$('#aid').on('click',function(){
		$('#aid').attr('href',baseUrl+'/page/login/login.jsp');
	});
	
	$('#return_login').on('click',function(){
		$('#return_login').attr('href',baseUrl+'/page/login/login.jsp');
	});
	
	$('#forgetpwd_next').on('click',function(){
		if(validAll()){
			var uname = $('#form-company-uname').val();
			var validCode = $('#form-company-auth-code').val();
			var pass = $('#form-company-password').val();
			//var tragetValue=$('#form-company-auth-code').val();
			var url = {'password':pass,'username':uname,'roles':[],'locked':false};
			var urlParam = JSON.stringify(url);
			$.ajax({
				//提交数据的类型 PUT
				type:"PUT",
				//提交的网址
//	            url: baseUrl+"owner/direct/upwd/" + validCode +'/'+ uname+'/'+ pass,
	            url: baseUrl+"/CXF/rs/owner/direct/upwd/" + validCode +'/'+ uname+'/'+ pass,
	            //提交的数据
	            data:urlParam,
	          	//返回数据的格式
	          	datatype: "json",
	          	
	          	contentType:"application/json; charset=UTF-8",
	          	//成功返回之后调用的函数
	          	success: function (data) {
	            	if(data){
	            		$("#forgetpwd_one").css("display","none");
	            		$("#qy_succeed").css("display","block");
					}else{
	            		$("#forgetpwd_one").css("display","none");
						$("#qy_fail").css("display","block");
					}
				}  
			});
			
		}
	})
})()