var agentType=null,phoneNumber=null,phoneMes=null,userName=null,passWord=null,rpassWord=null,currentUrl=window.location.pathname;!function(){$("#reg-getMessage").attr("disabled",!0),currentUrl=1==currentUrl.indexOf("SimpleBss")?currentUrl.substring(0,10):"";var e=!1,s=!1,a=null,c=0,n=window.location.href,r=null,o=null,l=null,d=/parentAgentCode=(\w+)&?/;d.test(n)&&(r=d.exec(n)[1]);var p=/salesId=(\w+)&?/;p.test(n)&&(o=p.exec(n)[1]);var i=/customerId=(\w+)&?/;i.test(n)&&(l=i.exec(n)[1]),null!=r&&$("#reg-parentAgentCode").val(r),$.ajax({url:currentUrl+"/CXF/rs/salesagent/getcode/agentcode",type:"GET",dataType:"text",success:function(e){$("#reg-agentCode").val(e)}});!function(){$("#reg-getMessage").off("click").on("click",function(){if($("#reg-getMessage").attr("disabled",!0),c+=1,s){var e=$("#reg-phone").val();$.ajax({url:currentUrl+"/CXF/rs/salesagent/direct/valid/"+e+"/"+c,type:"GET",dataType:"text",success:function(e){a=e}}),d("reg-getMessage")}});var n=60,d=function(e){if(0==n)return $("#reg-getMessage").attr("disabled",!1),$("#"+e).text("重新发送"),void(n=60);n--,$("#"+e).text("重新发送"+n+"s"),setTimeout(function(){d("reg-getMessage")},1e3)};$("#reg-phone").on("input",function(){""!=$(this).val()&&(/^1[3|4|5|7|8]\d{9}$/.test($(this).val())?$("#reg-getMessage").attr("disabled",!1):$("#reg-getMessage").attr("disabled",!0))}),$("#reg-phone").on("blur",function(){""==$(this).val()?($("#phone-check").css("display",""),$("#phone-check1").css("display","none"),$("#phone-checked").css("display","none")):($("#phone-check").css("display","none"),/^1[3|4|5|7|8]\d{9}$/.test($(this).val())?($("#phone-check1").css("display","none"),$("#phone-checked").css("display",""),s=!0,$("#reg-userName").val($(this).val()),$("#reg-getMessage").attr("disabled",!1)):($("#phone-check1").css("display",""),$("#phone-ceecked").css("display","none")))});!function(){$("#reg-agentType").on("change",function(){"choose"==$(this).val()?$("#agentType-check").css("display",""):$("#agentType-check").css("display","none")}),$("#reg-userName").on("blur",function(){""==$(this).val()?($("#userName-check").css("display",""),$("#userName-check1").css("display","none"),$("#username-check2").css("display","none"),$("#userName-checked").css("display","none")):($("#userName-check").css("display","none"),/^[A-Za-z0-9_]+$/.test($(this).val())?($("#userName-check2").css("display","none"),$.ajax({type:"GET",url:currentUrl+"/CXF/rs/user/username/"+$(this).val(),success:function(e){void 0==e?($("#userName-check1").css("display","none"),$("#userName-checked").css("display","")):($("#userName-check1").css("display",""),$("#userName-checked").css("display","none"))}})):($("#userName-check2").css("display",""),$("#userName-check1").css("display","none"),$("#userName-checked").css("display","none")))}),$("#reg-password").on("blur",function(){""==$(this).val()?($("#password-check").css("display",""),$("#password-checked").css("display","none"),$("#password-check1").css("display","none")):$(this).val().length<6?($("#password-check").css("display","none"),$("#password-checked").css("display","none"),$("#password-check1").css("display","")):($("#password-check").css("display","none"),$("#password-check1").css("display","none"),$("#password-checked").css("display",""))}),$("#reg-apassword").on("blur",function(){var e=$("#reg-password").val();""==$(this).val()?($("#apassword-check1").css("display",""),$("#apassword-checked").css("display","none"),$("#apassword-check").css("display","none")):$(this).val()==e?($("#apassword-check1").css("display","none"),$("#apassword-checked").css("display",""),$("#apassword-check").css("display","none")):($("#apassword-check1").css("display","none"),$("#apassword-checked").css("display","none"),$("#apassword-check").css("display",""))})}(),$("#registerBtn").on("click",function(){"choose"==$("#reg-agentType").val()?($("#agentType-check").css("display",""),e=!1):($("#agentType-check").css("display","none"),""==$("#reg-phone").val()?($("#phone-check").css("display",""),$("#phone-check1").css("display","none"),$("#phone-checked").css("display","none"),e=!1):($("#phone-check").css("display","none"),/^1[3|4|5|7|8]\d{9}$/.test($("#reg-phone").val())?($("#phone-check1").css("display","none"),$("#phone-checked").css("display",""),e=!0,""==$("#reg-userName").val()?($("#userName-check").css("display",""),$("#userName-check1").css("display","none"),$("#userName-checked").css("display","none"),e=!1):($("#userName-check").css("display","none"),/^[A-Za-z0-9_]+$/.test($("#reg-userName").val())?($("#userName-check2").css("display","none"),$.ajax({type:"GET",url:currentUrl+"/CXF/rs/user/username/"+$("#reg-userName").val(),success:function(s){if(void 0==s)if($("#userName-check1").css("display","none"),$("#userName-checked").css("display",""),e=!0,""==$("#reg-password").val())$("#password-check").css("display",""),$("#password-check1").css("display","none"),$("#password-checked").css("display","none"),boolead=!1;else if($("#reg-password").val().length<6)$("#password-check").css("display","none"),$("#password-check1").css("display",""),$("#password-checked").css("display","none"),boolead=!1;else if($("#password-check").css("display","none"),$("#password-check1").css("display","none"),$("#password-checked").css("display",""),boolead=!0,""==$("#reg-apassword").val())$("#apassword-check1").css("display",""),$("#apassword-check").css("display","none"),e=!1;else if($("#reg-apassword").val()!=$("#reg-password").val())$("#apassword-check").css("display",""),$("#apassword-check1").css("display","none"),$("#apassword-checked").css("display","none"),e=!1;else{if($("#apassword-check").css("display","none"),$("#apassword-check1").css("display","none"),$("#apassword-checked").css("display",""),!(e=!0))return!1;agentType=$("#reg-agentType").val(),phoneNumber=$("#reg-phone").val(),phoneMes=$("#reg-message").val(),userName=$("#reg-userName").val(),passWord=$("#reg-password").val(),rpassWord=$("#reg-apassword").val();var a={};a.user={},a.userInfo={},null!=o&&(a.sales={},a.sales.id=o),null!=l&&(a.customer={},a.customer.id=l),a.parentAgentCode=r,a.type=$("#reg-agentType").val(),a.agentCode=$("#reg-agentCode").val(),a.rate=0,a.userInfo.type=$("#reg-agentType").val(),a.agentName=$("#reg-userName").val(),a.user.valid=$("#reg-message").val(),a.userInfo.telephone=$("#reg-phone").val(),a.userInfo.ownerId=-1,a.userInfo.createDate=new Date,a.userInfo.createBy=$("#reg-userName").val(),"person"==$("#reg-agentType").val()&&(a.userInfo.name=$("#reg-userName").val()),a.user.ownerId=-1,a.user.username=$("#reg-userName").val(),a.user.password=$("#reg-password").val(),a.user.oldPassword=$("#reg-apassword").val(),a.user.createBy=$("#reg-userName").val(),a.user.createDate=new Date,a.user.roles=[{id:2}],a.userInfo.address=[],$.ajax({dataType:"json",data:JSON.stringify(a),contentType:"application/json; charset=UTF-8",type:"POST",url:currentUrl+"/CXF/rs/salesagent/savephone/",success:function(e){$("#registerPage").css("display","none"),$("#register-success").css("display","")},error:function(e){$("#registerPage").css("display","none"),$("#register-fail").css("display","")}})}else e=!1,$("#userName-check1").css("display",""),$("#userName-checked").css("display","none")}})):($("#userName-check2").css("display",""),$("#userName-check1").css("display","none"),$("#userName-checked").css("display","none"),e=!1))):($("#phone-check1").css("display",""),$("#phone-ceecked").css("display","none"),e=!1)))}),$("#back-register").on("click",function(){$("#register-fail").css("display","none"),$("#registerPage").css("display","block"),$("#reg-agentType").val(agentType),$("#reg-phone").val(phoneNumber),$("#reg-message").val(phoneMes),$("#reg-userName").val(userName),$("#reg-password").val(passWord),$("#reg-apassword").val(rpassWord)}),$("#return-login").on("click",function(){$("#return-login").parent().attr("href",currentUrl+"/page/login/login.jsp")})}()}();