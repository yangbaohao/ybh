/**
 * 发送请求获取借贷金额
 */
(function(){	
	
	setTimeout($.addTabCloseEvent,200);
	
	var url = _global_settings.service.url;	
	var id=$.pk.id;
	var name=$.pk.name;
	console.log(name);
	var creditAmtsum=0;
	var debitAmtsum=0;
	var arrlist='';
//	var tablerd=false;
	var journaldate1 = $.pk.journaldate;
	//var stringid=""; var stringArr = new Array(); var tansforString; 
	//if(journaldate1)
	$("#createjournaldate").datetimeinput({formatString:"yyyy-MM-dd",width:'90%',height:33,value:new Date()});
	//if(journaldate1<$("#createjournaldate").val().substring(0,7)){
		$("#createjournaldate").val(journaldate1);
	//}
	
	
	var blurEvent = function(event){
		var input = $(this);
		var value = input.val();
		if(value!='' && createJoutnalTableCheckNum(value)){
			$(this).css('border','');
			input.val(money(value).replace('-',''));
		}
		else{
			input.val('');
		}
	};
	
	var tft=function(i,sum){		
		var node=$('#createJoutnalTable> tbody');
		if($.pk.id==='carryover'){
			node.find('tr').eq(-1).children().eq(0).children().val(name);
			var id=getProductInfoById('4103','chartOfAccounts','','hardCode').id;
			node.find('tr').eq(-1).children().eq(1).children().val(id);
			node.find('tr').eq(-1).children().eq(i).children().val(sum);
			setTimeout(sort,0);
		}else{
			node.find('tr').eq(-1).remove();
		}
		node.find('.createJoutnalSelect').jqxComboBox("disabled",true);
		node.find('.createJoutnalChart').attr("disabled","disabled");
		node.find('.createJoutnalNum').attr("disabled","disabled");	
		$('#createJoutnalTable').off('click');		
	}
	
	$('.createJoutnalSelect').eq(-1).coaCombbox({width:'100%'});
	
//	$("#createJoutnalDetailattachment").fileuploader();
	/*if(ComboBoxSources.getInfoMapByKey('users','username')[currentUserInfo.loginId]){
		var vals = ComboBoxSources.getInfoMapByKey('users','username')[currentUserInfo.loginId].name;
		$('#createJoutnalcreateBy').val(vals);
	}*/
	$('#createJoutnalcreateBy').val(_global_settings.owner.companyname);
	
	//通过id 发送请求
	Core.AjaxRequest({
		type:"GET",
		//showMsg:false,
		showWaiting:true,
		url:url+"/ac/"+new Base64().encode("tosys/carryover/search/chartOfAccount/"+id+"/"+journaldate1+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
		callback:function(res){
			var rows=res;
			for(var i =0;i<rows.length;i++){
				if(id==='carryover'){
					//console.log(rows)
					for(var j in rows[0]){
						//console.info('see!'+j,rows[0][j]);
						loadcarryover(j,rows[0][j]);						
					}					
					arrlist+=rows[i].journalid+',';
					
					
				}else{
					loadList(rows[i]);
					arrlist+=rows[i].journalid+',';
				}
				
			}
			/*if($.pk==='carryover'||$.pk==='depreciation'){
				creditAmtsum
			}else{*/
			if(rows.length>0){
				var num=creditAmtsum>debitAmtsum?lastrow('win'):lastrow();
				function lastrow(win){				
					if(win){
						if($.pk.id==='carryover'||$.pk.id==='depreciation'){
							tft(2,money(creditAmtsum-debitAmtsum));							
						}
						return creditAmtsum
					}else{
						if($.pk.id==='carryover'||$.pk.id==='depreciation'){
							tft(3,money(debitAmtsum-creditAmtsum));						
						}
						return debitAmtsum
					}
				}
			}
			console.log('look:'+num);
			$('#createJoutnalNumSumCn').text(digitUppercase(money(num)));
			$('#createJoutnalNumSum1').text('￥'+money(num));
			$('#createJoutnalNumSum2').text('￥'+money(num));
			$('#createJoutnalTable .createJoutnalNum').moneyinput({defaultValue:''}).off("blur").on('blur',blurEvent);
			//}
			
			timeOut(function(){
//				dropDownList();
//				tablerd=true;
			},200)
		},
		failure:function(res){
        	//alert("系统出错！");
        }
	});
	
	var i=2;
	var html=function(){
    	var html;
		html+='<tr data-index="'+i+'">                                                                               ';
		html+='	<td style=""><input class="createJoutnalChart form-control" type="text"></td>                                                           ';
		html+='	<td style=""><div class="createJoutnalSelect"></div>                                                      ';
		html+='	</td>                                                                                  ';
		html+='	<td style=""><input class="createJoutnalNum numBorrow3 form-control" type="text"></td>                                                           ';
		html+='	<td style=""><input class="createJoutnalNum numLoad3 form-control" type="text"></td>                                                           ';
		html+='	<td class="del_icon" style=""><i class="    md-cancel     createJoutnalDel"></i>';
		html+='	</td>                                                                                           ';
		html+='</tr>           ';
		return html;
    }

	/**
	 * 把去重之后的数组转换成字符串
	 */
	function arrToString(array){
		for(var i=0;i<array.length;i++){
			tansforString += array[i]
		}
	}
	
    function loadList(list){     	
    	var row=$('#createJoutnalTable> tbody').children().eq(-1);
    	row.find('.createJoutnalSelect').eq(-1).coaCombbox({width:'100%'});
    	var description=name;
		var id=list.id;//
		var creditAmt=list.creditAmt===(0||undefined)?0:parseFloat(list.creditAmt);
		var debitAmt=list.debitAmt===(0||undefined)?0:parseFloat(list.debitAmt);
		creditAmtsum+=creditAmt;
		debitAmtsum+=debitAmt;
		row.find('.createJoutnalChart').val(description);
		row.find('.createJoutnalSelect').val(id);
		row.find('.createJoutnalNum').eq(0).val(debitAmt===0?'':list.debitAmt);
		row.find('.createJoutnalNum').eq(1).val(creditAmt===0?'':list.creditAmt);
		$('#createJoutnalTable> tbody').children().eq(-1).after(html());
//		if(tablerd)
//			dropDownListlast();
		$('.createJoutnalSelect').eq(-1).coaCombbox({width:'100%'});
	}
    
    function loadcarryover(ca,num){     	
    	var row=$('#createJoutnalTable> tbody').children().eq(-1);
    	row.find('.createJoutnalSelect').eq(-1).coaCombbox({width:'100%'});
    	var description=name;
		var debitAmt=0;
		var creditAmt=0;
		row.find('.createJoutnalChart').val(description);					
		//if(parseInt(ca[1])>3){
		if(getProductInfoById(ca,'chartOfAccounts','','hardCode').debitCredit!=='credit'){
			ca=getProductInfoById(ca,'chartOfAccounts','','hardCode').id;
			//console.log('type1:'+ca,num);
			//for(var i=0;i<amountArr.length;i++){
				//alert(list[amountArr[i]])
				if(num>0){//贷					
					row.find('.createJoutnalSelect').val(ca);
					creditAmt=parseFloat(num);
					row.find('.createJoutnalNum').eq(1).val(money(num));
					row.find('.createJoutnalNum').eq(0).val('');
				}else if(num<0){//借
					row.find('.createJoutnalSelect').val(ca);
					debitAmt=-parseFloat(num);
					row.find('.createJoutnalNum').eq(0).val(money(-num));
					row.find('.createJoutnalNum').eq(1).val('');
				}
		}else{
			ca=getProductInfoById(ca,'chartOfAccounts','','hardCode').id;
			//console.log('type2:'+ca,num);
			//for(var i=0;i<amountArr3.length;i++){
				if(num>0){//借
					row.find('.createJoutnalSelect').val(ca);
					debitAmt=parseFloat(num);
					row.find('.createJoutnalNum').eq(0).val(money(num));
					row.find('.createJoutnalNum').eq(1).val('');
				}else if(num<0){	//贷
					row.find('.createJoutnalSelect').val(ca);
					creditAmt=-parseFloat(num);
					row.find('.createJoutnalNum').eq(1).val(money(-num));
					row.find('.createJoutnalNum').eq(0).val('');
				}

		}
		creditAmtsum+=creditAmt;
		debitAmtsum+=debitAmt;
		$('#createJoutnalTable> tbody').children().eq(-1).after(html());
//		if(tablerd)
//			dropDownListlast();
		
		$('.createJoutnalSelect').eq(-1).coaCombbox({width:'100%'});
	}
    
    
    function sort(){
    	$.each($('#createJoutnalTable>tbody').find('tr'),function(){
    		var tr=$(this);
    		var input=$(this).children().eq(3).find('input');
    		if(input.val()!==''){
    			//console.log(tr[0]);    			
    			$('#createJoutnalTable>tbody').find('tr').eq(-1).after(tr.clone(true));
    			$(this).remove();
    		}

    	});
    	
    }
	
	//createJoutnalTable绑定添加行事件
	$('#createJoutnalTable').on('click',function(event){		
		if($(event.target).parent()[0]===$('#createJoutnalTable> tbody').children().eq(-1)[0]
		||$(event.target).parent().parent()[0]===$('#createJoutnalTable> tbody').children().eq(-1)[0]){								
			$('#createJoutnalTable> tbody').children().eq(-1).after(html());
			// dropDownList();
			 //dropDownListClick();
			/*$('.createJoutnalSelect').eq(-1).jqxComboBox({
				source:ComboBoxSources.getRecords($.pk.id),
				displayMember: "displayValue", 
				valueMember: "id",			
			});		*/
			$('.createJoutnalNum').eq(-1).moneyinput({defaultValue:''});
			$('.createJoutnalNum').eq(-1).off("blur").on("blur",blurEvent);
			$('.createJoutnalNum').eq(-2).moneyinput({defaultValue:''});
			$('.createJoutnalNum').eq(-2).off("blur").on("blur",blurEvent);
			$('.createJoutnalSelect').eq(-1).coaCombbox({width:'100%'});
//			if(tablerd)
//				dropDownListlast();
			i+=1;
		}
		//mee
		$('#createJoutnalTable tbody tr').on('dblclick',function(){	
			
			$(this).find('.createJoutnalChart').val($(this).prev('tr').find('.createJoutnalChart').val());			
		})
		      
		$(".numBorrow3").on('dblclick',function(){
			
	
			  var sumBorrow=0;
				var sunLoad=0;
				
			$.each($('.numBorrow3'),function(){
				sumBorrow=($(this).val()=="")?parseFloat(sumBorrow):parseFloat(sumBorrow)+parseFloat($(this).val());
			})
		    $.each($('.numLoad3'),function(){
		    	sunLoad=($(this).val()=="")?parseFloat(sunLoad):parseFloat(sunLoad)+parseFloat($(this).val());
			})
			/*if($(this).parent().next().children().val()==''){
			  if(parseFloat(sumBorrow)<parseFloat(sunLoad)){
				$(this).val(money(parseFloat(sunLoad)-parseFloat(sumBorrow)));
			   }
			}*/
			if($(this).val()==''){	         
				if($(this).parent().next().children().val()==''){
					if(parseFloat(sumBorrow)<parseFloat(sunLoad)){
						$(this).val(money(parseFloat(sunLoad)-parseFloat(sumBorrow)));
					}
				}
				}else{
					if($(this).parent().next().children().val()==''){
						if(parseFloat(sumBorrow)<parseFloat(sunLoad)){
							$(this).val(money(parseFloat(sunLoad)-parseFloat(sumBorrow)+parseFloat($(this).val())));
						}
					}	
				}
			$('#createJoutnalNumSum1').text('￥'+money(sumBorrow));
		})
		$(".numLoad3").on('dblclick',function(){
//			debugger
			  var sumBorrow=0;
				var sunLoad=0;
			$.each($('.numBorrow3'),function(){
				sumBorrow=($(this).val()=="")?parseFloat(sumBorrow):parseFloat(sumBorrow)+parseFloat($(this).val());
			})
		    $.each($('.numLoad3'),function(){
		    	sunLoad=($(this).val()=="")?parseFloat(sunLoad):parseFloat(sunLoad)+parseFloat($(this).val());
			})
		if($(this).val()==''){	         
			if($(this).parent().prev().children().val()==''){
				if(parseFloat(sumBorrow)>parseFloat(sunLoad)){
					$(this).val(money(parseFloat(sumBorrow)-parseFloat(sunLoad)));
				}
			}
			}else{
				if($(this).parent().prev().children().val()==''){
					if(parseFloat(sumBorrow)>parseFloat(sunLoad)){
						$(this).val(money(parseFloat(sumBorrow)-parseFloat(sunLoad)+parseFloat($(this).val())));
					}
				}	
			}
			
			$('#createJoutnalNumSum2').text('￥'+money(sunLoad));

		})
	});
	
	$('#createJoutnalTable').on('change','.createJoutnalSelect',function(event){	
		var args = event.args;
		if($(this).val()!=='科目'){
			var i=0;
			var val=$(event.target).val();
			$.each($('.createJoutnalSelect'),function(){
				if($(this).val()===args.item.value){
					i+=1;
				}
			})
			if(i>1){
				Core.alert({message:"科目不能相同！"})
				$(this).val('');
			}			
		}
	});
	
	$('#createJournalCurrency').dropDownlist({
		source:{'unassociation':'不匹配'},
		selectedIndex:0
	})
	
	/*$('#createJoutnalTable').on('keypress','.createJoutnalNum',function(){		
		$(this).off('moneyinput');
		$(this).moneyinput();
	})*/
	
	$('#createJoutnalTable').on('keyup','.createJoutnalNum',function(){
		if(createJoutnalTableCheckNum($(this).val())!==false){
			$(this).css('border','');
			console.log($(this).val());
			console.log(true);	
		}
		else{
			$(this).css('border','2px solid red');
			console.log(false);
		}
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
		$('#createJoutnalNumSumCn').text(digitUppercase(money(sum[1])));
		$('#createJoutnalNumSum1').text('￥'+money(sum[1]));
		$('#createJoutnalNumSum2').text('￥'+money(sum[0]));
	});
		
	$('#createJoutnalTable').on('paste','.createJoutnalNum',function(f){
		f.preventDefault();
		var content;
		if (f.originalEvent.clipboardData) {
            content = (f.originalEvent || f).clipboardData.getData("text/plain")
        } 
		if(createJoutnalTableCheckNum(content)){
			$(this).val(content);
		}
		console.log(content);
	})
	
	$('#createJoutnalTable').on('click','.createJoutnalDel',function(){
		if($('#createJoutnalTable> tbody').children().length===1){
			return false;
		}
		var t=$(this);
		Core.confirm({
			message:"确定要删除？",
			confirmCallback:function(){
				t.parent().parent().remove();
			}
		});
	});
	
	$('#createJoutnalTableAdd').on('click',function(){
		//验证tr行有输入行数据是否完整
		//console.log(createJoutnalTableIsSelect());
		 if(!createJoutnalTableIsSelect()){
			 Core.alert({message:"输入行数据不完整！"})
			 return false;
		 }
		 
		 //验证是否有相同的科目
		 var createJoutnalSelectarr=[];
		 var createJoutnalSelecti=0;
		 $.each($('.createJoutnalSelect'),function(){
			 if($(this).val()!==''){
			 createJoutnalSelectarr[createJoutnalSelecti]=$(this).val();
			 createJoutnalSelecti+=1;
			 }
		 })
		 console.log('科目',createJoutnalSelectarr,isRepeat(createJoutnalSelectarr));
		 if(isRepeat(createJoutnalSelectarr)){
			 Core.alert({message:"科目不能相同！"})
			 return false;
		 }
		 
		 
		
		//验证金额输入是否是数字
		//var nodeList=$('#createJoutnalTable>tbody>tr');
		var numList=$('.createJoutnalNum');
		$.each(numList,createJoutnalTableCheckNum);
		console.log('check:',isCheckEd);
		if(isCheckEd===false){
			Core.alert({message:"输入金额只能为数字！"});
			return false;
		}
		
		if($('#createJoutnalNumSum1').text()!==$('#createJoutnalNumSum2').text()){
			Core.alert({message:"保存失败，借贷不平衡！"});
			return false;
		}
		
		var arr= getcreateJoutnalTableList();
		
		if(arr.length===0){
			Core.alert({message:"提交失败，请输入金额！"})
			return false;
		}
		
		var fileInfoIds = [];//文件列表
		$("#createJoutnalDetailattachment").find(".item").each(function(i,v){
			var fid = $(v).attr('data-id');
			if(fid !== undefined){
				fileInfoIds.push(fid);
			}
		});
		
		var json={
				noteNumber:$('#createJournaljournalnoteNumber').val(),
				fileInfoIds:fileInfoIds.toString(),
			    "remark": $('#createJoutnalRemark').val(),
			    "currency": "RMB"/*$('#createJournalCurrency').val()*/,
			    "journalNumber": $('#createJournalNumber').val(),
			    "remarkPrint": $('#createJoutnalRemarkPrint').val(),
				//lastUpdateBy:arrlist.substring(0,arrlist.length-1),
			    "journalType": "input",
			    entryDate:$('#createjournaldate').val(),
			    journalDetails:arr
		};
		
		var list = json['journalDetails'];

		var sub = [ 'NV', 'AK', 'HI' ];
		
		var post=createJoutnalTableJsonFormat(list,sub);
		
		var url1='';

		//if(id==='depreciation'||id==='carryover'){
			//url1=_global_settings.service.url+'/journal/create/asset/'+id;
			if(id==='carryover'){
				json.journalType=id;
			}
		//}else{
			//url1=_global_settings.service.url+'/journal/create/carryover/'+arrlist.substring(0,arrlist.length-1);
			url1=_global_settings.service.url+"/ac/"+new Base64().encode("tosys/carryover/create/carryover/"+id+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c");
		//}
		
		console.log(JSON.stringify(json));
		
		if(post){
			console.log(11111);
			Core.AjaxRequest({
                url : url1,
                type: "POST",
                params:json,
                async:false,
                dataType:'text',
                showMsg:false,
//                successMsg:"操作成功",
                callback: function(res) {
                	
                	var rs = 'true';
                	if(res!=rs){
                		Core.alert({message:res});
                	}
                	else{
                		setCloseAlertTimeOneSecond();
                		$.closeTab();
                	}
                },
                failure:function(res){
                	//Core.alert({message:"Error"});
                	
                }
            });
		}
		else{
			Core.alert({message:"同一科目只能为借方或贷方金额！"})
		}
	}
	)
	
	function createJoutnalTableCheckNum(){
		
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
	
	function  createJoutnalTableNum(){
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
	

	var getcreateJoutnalTableList = function() {
		
		var arr = [];
		var i=0;
		$.each($('#createJoutnalTable>tbody>tr'), function() {
			
			var that = $(this).children();
			if(that.eq(2).children().val()!==''||that.eq(3).children().val()!==''){
			arr[i] = {
				description : that.eq(0).children().val(),
				chartOfAccount :{id: that.eq(1).children().val()},
				debitAmt: that.eq(2).children().val()===''?0:that.eq(2).children().val(),
				creditAmt: that.eq(3).children().val()===''?0:that.eq(3).children().val(),
				//createDate: $('#datepickerEdit').val()+' '+ getHMS(),
				//createBy:'admin'
			};
			i+=1;
			}
		})
		return arr;
			
		};
		
		
	var createJoutnalTableIsSelect=function(){
			var selectList=$('#createJoutnalTable> tbody>tr');
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
				}else{
					pass=false;
					console.log(this);
					return false;
				}
			})
			return pass;
		}
		
	var createJoutnalTableJsonFormat=function(list,arr){
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
			var length=$('.createJoutnalNum').length-1;
			var createJoutnalNumSum1=0;
			var createJoutnalNumSum2=0;
			for(var i=0;i<length;i++){
				var sum=$('.createJoutnalNum').eq(i).val()*1000;
					if(i%2===1 &&!isNaN(sum)){
						createJoutnalNumSum1+=parseInt(sum);
						//console.log($('.createJoutnalNum').eq(i).val());
					}
					if(i%2===0&&!isNaN(sum)){
						createJoutnalNumSum2+= parseInt(sum);
						//console.log($('.createJoutnalNum').eq(i).val());
					}
			}
			console.log('i is:',i);
			return [createJoutnalNumSum1/1000,createJoutnalNumSum2/1000];
		};
		
		function digitUppercase(n) {  
	        var fraction = ['角', '分'];  
	        var digit = [  
	            '零', '壹', '贰', '叁', '肆',  
	            '伍', '陆', '柒', '捌', '玖'  
	        ];  
	        var unit = [  
	            ['元', '万', '亿'],  
	            ['', '拾', '佰', '仟']  
	        ];  
	        var head = n < 0 ? '欠' : '';  
	        n = Math.abs(n);  
	        var s = '';  
	        for (var i = 0; i < fraction.length; i++) {  
	            s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');  
	        }  
	        s = s || '整';  
	        n = Math.floor(n);  
	        for (var i = 0; i < unit[0].length && n > 0; i++) {  
	            var p = '';  
	            for (var j = 0; j < unit[1].length && n > 0; j++) {  
	                p = digit[n % 10] + unit[1][j] + p;  
	                n = Math.floor(n / 10);  
	            }  
	            s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;  
	        }  
	        return head + s.replace(/(零.)*零元/, '元')  
	            .replace(/(零.)+/g, '零')  
	            .replace(/^整$/, '零元整');  
	    };  
})()
