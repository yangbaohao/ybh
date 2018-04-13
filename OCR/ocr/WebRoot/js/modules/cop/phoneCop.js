(function(){
	
	var roleName=null,agentCode=null,data=null;
	
	var url = window.location.pathname;
	if(url.indexOf('SimpleBss')==1){
		url = url.substring(0,10);
	}else{
		url = '';
	}
	
//	var url= '/ACBss/CXF/rs/common/ownerinformation';
	url= url+'/CXF/rs/common/ownerinformation';
	
	console.log(url);
	
	var initEwm=function(res){
		var lhf = 'http://qr.liantu.com/api.php?text=';
		var hf = $('#userlink').attr('src');
		if(roleName!='Sys_Admin'){
			if(res.roleName=='agentistrator'){
				$('#userlink').attr('src',lhf+hf+'?salesType='+res.salesType+'%26agentCode='+res.agentCode);
			}else {
				if(res.roleName=='salesStaff'||res.roleName=='salesManage'){
					if(res.employeeCode=='null'||res.employeeCode==undefined){
						$('#userlink').attr('src',lhf+hf+'?salesType='+res.salesType+'%26salesId='+res.userid);
					}
					else{
						$('#userlink').attr('src',lhf+hf+'?salesType='+res.salesType+'%26salesId='+res.userid+'%26employeeCode='+res.employeeCode);
					}
				} else{
					if(res.employeeCode=='null'||res.employeeCode==undefined){
						$('#userlink').attr('src',lhf+hf+'?salesType='+res.salesType+'%26salesId='+res.userid);
					}
					else{
						$('#userlink').attr('src',lhf+hf+'?salesType='+res.salesType+'%26salesId='+res.userid+'%26employeeCode='+res.employeeCode);
					}
				}
			}
		} else {
			$('#isAgent').remove();
			$('#userlinkewm').remove();
		}
	}
	
	var initEwms=function(res){
		var lhf = 'http://qr.liantu.com/api.php?text=';
		var hf = $('#bssuserlink').attr('src');
		if(roleName!='Sys_Admin'){
			if(res.roleName=='agentistrator'){
				if(res.senior=='true')
					$('#bssuserlink').attr('src',lhf+hf+'?parentAgentCode='+res.agentCode);
				else {
					$('#notAgent').remove();
					$('#bssuserlink').attr('src',lhf+hf+'?salesType='+res.salesType+'%26agentCode='+res.agentCode);
				}
			} else {
				if(res.roleName=='salesStaff'||res.roleName=='salesManage'){
					$('#bssuserlink').attr('src',lhf+hf+'?salesId='+res.userid);
				} else {
					$('#bssuserlink').attr('src',lhf+hf+'?customerId='+res.userid);
				}
			}
		} else {
			$('#notAgent').remove();
			$('#bssuserlinkewm').remove();
		}
		
	}
	
	$.ajax({
		async:false,
		url:url,
		type:'GET',
		success:function(res){
			data = res;
			roleName = res.roleName;
			agentCode = res.agentCode;
			initEwm(res);
			initEwms(res);
		}
	});
	
//	for(var i=0;i<15;i++){
//		$('#phoneCop-ul').append(li);
//	}
	
	$('.aBtn').on('click',function(){
		
		var currentUrl = setCurrentUrl();
		
		var m=this;
		var hf = $(this).attr('href');
		console.log(hf);
		if(roleName!='Sys_Admin'){
			if($(m).attr('href')=='http://'+currentUrl+'/page/modules/cop/promoteCustomer.html'){
				if(data.roleName=='agentistrator'){
					location.href=hf+'?salesType='+data.salesType+'&agentCode='+data.agentCode;
				}else {
					if(res.roleName=='salesStaff'||res.roleName=='salesManage'){
						if(data.employeeCode=='null'||data.employeeCode==undefined){
							location.href=hf+'?salesType='+data.salesType+'&salesId='+data.userid;
						}
						else{
							location.href=hf+'?salesType='+data.salesType+'&salesId='+data.userid+'&employeeCode='+data.employeeCode;
						}
					} else {
						if(data.employeeCode=='null'||data.employeeCode==undefined){
							location.href=hf+'?salesType='+data.salesType+'&customerId='+data.userid;
						}
						else{
							location.href=hf+'?salesType='+data.salesType+'&customerId='+data.userid+'&employeeCode='+data.employeeCode;
						}
					}
				}
				
				setTimeout(function(){
					//alert(999)
					$(m).attr('href',hf);
					
				},500);
				
			}
			else {
				if(data.roleName=='agentistrator'){
					if(data.senior=='true'){
						location.href=hf+'?parentAgentCode='+data.agentCode;
					}else{
						location.href=hf+'?salesType='+data.salesType+'&agentCode='+data.agentCode;
					}
				} else {
					if(res.roleName=='salesStaff'||res.roleName=='salesManage'){
						location.href=hf+'?salesId='+data.userid;
					} else {
						location.href=hf+'?customerId='+data.userid;
					}
				}
				
				setTimeout(function(){
					$(m).attr('href',hf);
				},500);
			}
			
			return false;
		}
	});
	
	
	
})();