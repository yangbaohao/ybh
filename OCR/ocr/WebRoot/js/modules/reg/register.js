(function(){
	$("#register_close").click(function(){
		window.location.href="page/login/login.jsp";
	});
	var urlParam;
	var tmpValid;
	var isExist;
	var flag = false;
	var curWwwPath = window.document.location.href;
	var pathName =  window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	var localhostPath = curWwwPath.substring(0,pos);
	//var projectName = pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	var projectName = "/AccountingCloud";
	
	var baseUrl = localhostPath + projectName + "/CXF/rs/";
	
	$("#validCode").attr("disabled",true);
	$('#form-company-Booked-Date').monthpicker({callback:'dasdasd'});
	
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
	        $(obj).text("免费获取验证码(" + countdown +")");
	    } 
	setTimeout(function() { 
	    settime(obj) }
	    ,1000) 
	}
	
	$("#a_privacypolicy").on('click',function(){
		var win = window.open('../AccountingCloud/template/privacyPolicy.pdf');
	});
	$("#a_useragreement").on('click',function(){
		var win = window.open('../AccountingCloud/template/userAgreement.pdf');
	});
		
	function validReg(obj , param){
		var regUname = /^[A-Za-z0-9_]+$/;
		var regPhone = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
		var regEmail = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
		var regPass = /^(\w{6,20})$/;
		if("" == param){
			var type = $(obj).attr("mark");
			var valT = $(obj).val();
			if(type == 'uname'){
				var result = regUname.test(valT);
		    	return result;
			}else if(type == 'email'){
				var result = regEmail.test(valT);
		    	return result;
			}else if(type == 'phone'){
		    	var result = regPhone.test(valT);
		    	return result;
			}else if(type == 'pass'){
				var result = regPass.test(valT);
				return result;
			}
		}else{
			if(param == 'uname'){
				var result = regUname.test(obj);
		    	return result;
			}else if(param == 'email'){
				var result = regEmail.test(obj);
		    	return result;
			}else if(param == 'phone'){
		    	var result = regPhone.test(obj);
		    	return result;
			}else if(param == 'pass'){
				var result = regPass.test(obj);
				return result;
			}
		}
	}
	
    function validAll(){
    	var uname = $("#form-company-username").val();
    	var pername = $("#form-person-name").val();
    	var compname = $("#form-company-name").val();
    	var email = $("#company_email_number").val();
    	var phone = $("#company_phone_number").val();
    	var validCode = $("#form-company-auth-code").val();
    	var pass = $("#form-company-password").val();
    	var realPass = $("#form-company-password-affirm").val();
    	var accountPeriod = $("#form-company-Booked-Date").val();
    	
    	//用户名
    	if("" == uname){  
    		$("#form-uname-close").css("display","none");
			$("#form-uname-close1").css("display","block");
			$("#form-uname-close2").css("display","none");
			$("#form-uname-check").css("display","none");
    		$("#form-uname-check1").css("display","none");
     		flag = false;
    	}else{
    		if(validReg(uname,'uname')){
    			$.ajax({
    				//提交数据的类型 GET
    				type:"GET",
    				//提交的网址 
    				url: baseUrl+"owner/direct/login/" + uname,
    				//返回数据的格式
    				datatype: "json",
    				async: false,
    				//成功返回之后调用的函数
    				success: function (data) {
    					console.log(data);
    					if(data){      //用户名是否存在
    						$("#form-uname-check").css("display","none");
    						$("#form-uname-close").css("display","block");
    	        			$("#form-uname-close1").css("display","none");
    	        			$("#form-uname-close2").css("display","none");
    	            		$("#form-uname-check1").css("display","none");
    	            		flag = false;
    		 	        }else{
    		 	        	$("#form-uname-close").css("display","none");
    	        			$("#form-uname-close1").css("display","none");
    	        			$("#form-uname-close2").css("display","none");
    	        			$("#form-uname-check").css("display","block");
    	            		$("#form-uname-check1").css("display","none");
    	            		//个人姓名
    	            		if("" == pername){
    	            			$("#form-person-close").css("display","block");
    	                 		$("#form-person-check").css("display","none");
    	                 		$("#form-person-check1").css("display","none");
    	                 		flag = false;
    	            		}else{
    	            			$("#form-person-close").css("display","none");
    	                 		$("#form-person-check").css("display","block");
    	                 		$("#form-person-check1").css("display","none");
    	            			//公司名称
        	                	if("" == compname){
        	                		$("#form-company-close").css("display","block");
        	                 		$("#form-company-check").css("display","none");
        	                 		$("#form-company-check1").css("display","none");
        	                 		flag = false;
        	                	}else{
        	                		$("#form-company-close").css("display","none");
        	                		$("#form-company-check").css("display","block");
        	                		//邮箱
        	                    	if("" == email){
        	                    		$("#form-email-close").css("display","block");
        	                    		$("#form-email-close1").css("display","none");
        	                     		$("#form-email-check").css("display","none");
        	                     		$("#form-email-check1").css("display","none");
        	                     		flag = false;
        	                    	}else{
        	                    		if(validReg(email,'email')){
        	                    			$("#form-email-close").css("display","none");
        	                        		$("#form-email-check").css("display","block");
        	                        		//手机
        	                            	if("" == phone){      
        	                            		$("#form-phone-close").css("display","block");
        	                             		$("#form-phone-check").css("display","none");
        	                             		$("#form-phone-check1").css("display","none");
        	                             		flag = false;
        	                            	}else{
        	                            		if(validReg(phone,'phone')){
        	                            			$("#form-phone-close").css("display","none");
        	        	                    		$("#form-phone-check").css("display","block");
        	        	                    		//验证码
        	        	                        	if("" == validCode){
        	        	                        		$("#form-auth-code-close").css("display","block");
        	        	                        		$("#form-auth-code-close1").css("display","none");
        	        	                         		$("#form-auth-code-check").css("display","none");
        	        	                         		$("#form-auth-code-check1").css("display","none");
        	        	                         		flag = false;
        	        	                        	}else{
        	        	                        		if(validCode == tmpValid){
        	        	                        			$("#form-auth-code-close").css("display","none");
        	        	                        			$("#form-auth-code-close1").css("display","none");
        	        		                        		$("#form-auth-code-check").css("display","block");
        	        		                        		//密码
        	        		                            	if("" == pass){     
        	        		                            		$("#form-pass-close").css("display","block");
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
            	        			                                		//记账日期
            	        			                                    	if("" == accountPeriod){
            	        			                                    		$("#form-account-period-close").css("display","block");
            	        			                                    		$("#form-account-period-close1").css("display","none");
            	        			                                     		$("#form-account-period-check").css("display","none");
            	        			                                     		$("#form-account-period-check1").css("display","none");
            	        			                                     		flag = false;
            	        			                                    	}else{
            	        			                                    		$("#form-account-period-check1").css("display","none");
            	        			                                    		$("#form-account-period-close").css("display","none");
            	        			                                    		$("#form-account-period-check").css("display","block");
            	        			                                    		//纳税人性质
            	        			                                    		$("#form-tax_select").css("display","block");
            	        			                                    		$("#form-tax_select1").css("display","none");
            	        			                                    		flag = true;
            	        			                                    	}
        	        			                        				}else{
        	        			                        					$("#form-pass-affirm-close").css("display","block");
        	        			                        					$("#form-pass-affirm-check").css("display","none");
        	        			                        				}
        	        			                                	}
        	        		                            		}else{
        	        		                            			$("#form-pass-close").css("display","none");
        	        		                            			$("#form-pass-close1").css("display","block");
        	        			                            		$("#form-pass-check").css("display","none");
        	        		                            		}
        	        		                            	}
        	        	                        		}
        	        	                        	}
        	                            		}else{
        	                            			$("#form-phone-close").css("display","none");
        	                            			$("#form-phone-close1").css("display","block");
        	        	                    		$("#form-phone-check").css("display","none");
        	                            		}
        	                            	}
        	                    		}else{
        	                    			$("#form-email-close").css("display","none");
        	                    			$("#form-email-close1").css("display","block");
        	                        		$("#form-email-check").css("display","none");
        	                        	}
        	                    	}
        	                	}
    	            		}
    					}
    				}
    			});
    		}else{
    			$("#form-uname-close").css("display","none");
    			$("#form-uname-close1").css("display","none");
    			$("#form-uname-close2").css("display","block");
    			$("#form-uname-check").css("display","none");
        		$("#form-uname-check1").css("display","none");
    		}
    	}
    	return flag;
    }
    
    function return_fail_login() {
        $("#qy_fail").hide();
        $("#qyxx_div").hide();
        $("#no1_div").show();
        $("#flow_fail").show();
        $("#flow_succeed").hide();
        $("#flow_top_1").attr("class", "show_flow_top");
        $("#flow_top_2").removeClass("show_flow_top");
        $("#flow_top_3").removeClass("show_flow_top");
        return false;
    };
    
    $("#validCode").on({
        "click": function () {
        	
        	$("#form-auth-code-close").css("display","none");
        	settime(this);
        	var phone = $("#company_phone_number").val();
        	
        	$.ajax({
    			//提交数据的类型 GET
    			type:"GET",
    			//提交的网址
                url: baseUrl+"owner/direct/valid/" + phone,
                //返回数据的格式
              	datatype: "json",
              	//成功返回之后调用的函数
                success: function (data) {
                	tmpValid = data;
                	if(null != data && '' != data){
                		
    				}else{
    					$("#form-auth-code-close").css("display","none");
    					$("#form-auth-code-check").css("display","block");
    				}
    			}
    		});
        }
	});
    
    $("#return_login").on({
        "click": function () {
        	return_fail_login();
            return false;
        }
    });
    //注册页面(输入电话号码)
	$("#company_phone_number").on('keyup',function(){
		if(validReg(this,"")){
			$("#validCode").attr("disabled",false);
		}
	});
	
	$("input").focus(function(){
		var typ = $(this).attr("id");
		if("form-company-username" == typ){
			$("#form-uname-close").css("display","none");
			$("#form-uname-check1").css("display","none");
		}else if("form-person-name" == typ){
			$("#form-person-check").css("display","none");
			$("#form-person-check1").css("display","none");
		}else if("form-company-name" == typ){
			$("#form-company-close").css("display","none");
			$("#form-company-check1").css("display","none");
		}else if("company_email_number" == typ){
			$("#form-email-close").css("display","none");
			$("#form-email-check1").css("display","none");
		}else if("company_phone_number" == typ){
			$("#form-phone-close").css("display","none");
			$("#form-phone-check1").css("display","none");
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
	
	$("input").blur(function(){
		var typ = $(this).attr("id");
		var optionValue = $(this).val();
		if("form-company-username" == typ){
			//用户名
			if("" == optionValue){
				$("#form-uname-close").css("display","none");
    			$("#form-uname-close1").css("display","block");
    			$("#form-uname-close2").css("display","none");
    			$("#form-uname-check").css("display","none");
        		$("#form-uname-check1").css("display","none");
			}else{
				if(validReg(this,"")){
					$("#form-uname-close1").css("display","none");
					$("#form-uname-close2").css("display","none");
					$("#form-uname-check").css("display","block");
					$.ajax({
						//提交数据的类型 GET
						type:"GET",
						//提交的网址 
						url: baseUrl+"owner/direct/login/" + optionValue,
						//返回数据的格式
						datatype: "json",
						//成功返回之后调用的函数
						success: function (data) {
							if(data){
								$("#form-uname-close").css("display","block");
				         		$("#form-uname-check").css("display","none");
				 	        }else{
								$("#form-uname-close").css("display","none");
								$("#form-uname-check").css("display","block");
							}
						}
					});
				}else{
					$("#form-uname-close").css("display","none");
	    			$("#form-uname-close1").css("display","none");
	    			$("#form-uname-close2").css("display","block");
	    			$("#form-uname-check").css("display","none");
	        		$("#form-uname-check1").css("display","none");
				}
			}
		}else if("form-person-name" == typ){
			if("" == optionValue){
				$("#form-person-close").css("display","block");
				$("#form-person-check").css("display","none");
				$("#form-person-check1").css("display","none");
			}else{
				$("#form-person-close").css("display","none");
				$("#form-person-check").css("display","block");
				$("#form-person-check1").css("display","none");
			}
		}else if("form-company-name" == typ){
			if("" == optionValue){
				$("#form-company-close").css("display","block");
				$("#form-company-check").css("display","none");
			}else{
				$("#form-company-close").css("display","none");
				$("#form-company-check").css("display","block");
			}
		}else if("company_email_number" == typ){
			//邮箱
			if("" == optionValue){
				$("#form-email-close").css("display","block");
				$("#form-email-close1").css("display","none");
				$("#form-email-check").css("display","none");
			}else{
				if(validReg(this,"")){
					$("#form-email-close1").css("display","none");
					$("#form-email-check").css("display","block");
				}else{
					$("#form-email-close1").css("display","block");
					$("#form-email-check").css("display","none");
				}
			}
		}else if("company_phone_number" == typ){
			//手机号码
			if("" == optionValue){
				$("#form-phone-close").css("display","block");
				$("#form-phone-check").css("display","none");
			}else{
				if(validReg(this,"")){
					$("#form-phone-close1").css("display","none");
					$("#form-phone-check").css("display","block");
					$("#validCode").attr("disabled",false);
				}else{
					$("#form-phone-close1").css("display","block");
					$("#form-phone-check").css("display","none");
				}
			}
		}else if("form-company-auth-code" == typ){
			//验证码
			if("" == optionValue){
				$("#form-auth-code-close").css("display","block");
				$("#form-auth-code-check").css("display","none");
			}else{
				if(optionValue == tmpValid){
					$("#form-auth-code-close").css("display","none");
					$("#form-auth-code-close1").css("display","none");
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
			}else{
				if(validReg(this,"")){
					$("#form-pass-close").css("display","none");
					$("#form-pass-close1").css("display","none");
					$("#form-pass-check").css("display","block");
				}else{
					$("#form-pass-close1").css("display","block");
					$("#form-pass-check").css("display","none");
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
    
	
	
	$('#step2_btn').on('click',function(){
		if(validAll()){
			var type = "enterprise";
			//User信息
			var username = $('#form-company-username').val();              //用户名
			var pername = $('#form-person-name').val();                    //姓名
			var name = $('#form-company-name').val();                      //公司名称
			var telephone = $('#company_phone_number').val();              //电话
			var email = $('#company_email_number').val();				   //邮箱
			var password = $('#form-company-password').val();              //密码 
			var accountperiod = $('#form-company-Booked-Date').val();      //记账日期
			var taxType = $('#tax_select').val();                          //纳税人性质
			
			var mapReg = {};
			mapReg.name = name;
			mapReg.email = email;
			mapReg.telephone = telephone;
			mapReg.username = username;
			mapReg.password = password;
			mapReg.startMonth = accountperiod;
			mapReg.taxType = taxType;
			mapReg.pername = pername;
						
			urlParam = JSON.stringify(mapReg);
			$.ajax({
				//提交数据的类型 POST
				type:"POST",
				//提交的网址
	            url: baseUrl+"owner/direct/reg",
	            //提交的数据
	            data: urlParam,
	          	//返回数据的格式
	          	datatype: "json",
	          	
	          	contentType:"application/json; charset=UTF-8",
	          	//成功返回之后调用的函数
	            success: function (data) {
	            	$("#no1_div").css("display","none");
	            	if(data){
						$("#qy_succeed").css("display","block");
					}else{
						$("#qy_fail").css("display","block");
					}
				}  
			});
		}
	});
	
})()