var EquipmentAddBssMgt = function(){
	var me = this;
	var url = _global_settings.service.url+"/ac/";
	this.coaExpenseCombo = []; //公司设置里的费用科目 
	this.checked=null;//判断是否折旧
	
	this.settings = {  
		source:{
	        datafields: [
                { name: 'ownerId', type: 'number' },
	            { name: 'coaDepreciate', type:'ChartOfAccount'}, //折旧科目
	            { name: 'coaExpense', type: 'ChartOfAccount' },  //费用科目
	            { name: 'name', type:'string'},
	            { name: 'assetRef', type:'string'},
	            { name: 'purchaseDate', type:'date'},
	            { name: 'iniValue', type:'float'},
	            { name: 'totalDepreciatedValue', type:'float'},
	            { name: 'scrapValueRatio', type:'float'},
	            { name: 'startDepreciate', type:'string'},
	            { name: 'depreciateMonth', type:'number'},
	            { name: 'depreciateStartMonth', type:'date'},
	            { name: 'depreciateEndMonth', type:'date'},
	            { name: 'monthlyDepreciateValue', type:'float'},
	            { name: 'createDate', type:'date'},
	            { name: 'createBy', type:'string'},
	            { name: 'lastUpdateDate', type:'date'},
	            { name: 'lastUpdateBy', type:'string'}
	        ],
	        url: url+"/search",
//		        data:me.searchObj,
	    },
		grid:{element:"EquiGrid"},
		ajax:{url:url},
	};
	
	
	/**
     * 刷新
     */
    this.refreshDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('updatebounddata', 'cells');
    	$("#"+el).jqxGrid('clearselection');
    	$('#'+el).jqxGrid('refreshdata');
    };
    
    
  //初始化添加固定资产界面
	this.initInput = function(){	
		$.addTabCloseEvent();
		
		//累计折旧科目下拉数据
	    $("#add-coaDepreciate").coaCombbox({
			width:'100%',
			height:34,
			theme:currentTheme,
			displayMember: "name", 
        	valueMember: "id", 
        	placeHolder:"请选择或输入",
        	searchMode: 'contains'
		},['1602','1702']);
		
    	
    	//费用科目下拉框数据
		$("#add-coaExpense").coaCombbox({
			width:'100%',
			height:34,
			theme:currentTheme,
			displayMember: "name", 
        	valueMember: "id", 
        	placeHolder:"请选择或输入",
        	searchMode: 'contains'
		},['510101','660120','660225']);
		
		$("#add-purchaseDate").datetimeinput({placeHolder:'除暂停折旧，不可编辑',formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$("#add-startTime").datetimeinput({placeHolder:'除暂停折旧，不可编辑',formatString:"yyyy-MM",width:'100%',height: '34px'});
		
		var setAllVal=function(){
			//debugger;
			var num=$('#add-ininum').val();
			var price=$('#add-iniprice').val();
			var scrap=$('#add-scrapValueRatio').val();
			var mouth=$('#add-expectTime').val();
			var startMouth=$('#add-startTime').val();
			var date=new Date();
			var fullYearNow=date.getFullYear();
			var monthNow=date.getMonth()+1;
			monthNow=monthNow.toString().length>1?monthNow:'0'+monthNow;
			if(num==parseInt(num)&&!isNaN(price)){
				var sum=money(num*price);
				$('#add-iniValue').val(sum);//原值
			}
			if(num==parseInt(num)&&!isNaN(price)&&!isNaN(scrap)){
				$('#add-sumExpectVal').val(money($('#add-iniValue').val()*scrap/100));//预计净残值
			}
			if(mouth==parseInt(mouth)&&startMouth!=''&&mouth>=0){
				me.setEndTime(mouth);//折旧结束日期
			}
			if(num==parseInt(num)&&mouth==parseInt(mouth)&&!isNaN(price)&&!isNaN(scrap)&&mouth!=0){
				$('#add-assetMonth').val(money((parseFloat($('#add-iniValue').val())-parseFloat($('#add-sumExpectVal').val()))/mouth));//月折旧/摊销额
				var mouthSum=0;//累计折旧月数
				if(startMouth!=''){
					if(startMouth<(fullYearNow+'-'+monthNow)){
						var startMouth_year=startMouth.substring(0,4);
						var startMouth_mouth=startMouth.substring(5,7);
						if(fullYearNow>startMouth_year){
							mouthSum+=12*(parseInt(fullYearNow)-parseInt(startMouth_year));
							mouthSum+=(parseInt(monthNow)-parseInt(startMouth_mouth));
							
						}else if(monthNow>startMouth_mouth){
							mouthSum+=(parseInt(monthNow)-parseInt(startMouth_mouth));
						}else{
							mouthSum=0;
						}
						
					}
					//debugger
					if(mouthSum<mouth){
						$('#add-totalDepreciatedValue').val(money(mouthSum*$('#add-assetMonth').val()));
					}else{
						$('#add-totalDepreciatedValue').val(money(mouth*$('#add-assetMonth').val()));
					}
					$('#add-assetBal').val(money(parseFloat($('#add-iniValue').val())-parseFloat($('#add-totalDepreciatedValue').val())));//资产余额
				}
			}
		};
		
		$('#add-equipment').on('keyup','.addequipment',function(){
			setAllVal();
		});
		
		$("#add-startTime").on('valueChanged',function(event){
			setAllVal();
		});
		
//		$('#add-ininum,#add-iniprice').on('keyup blur',function(){
//			var num=$('#add-ininum').val();
//			var price=$('#add-iniprice').val();
//			if(num==parseInt(num)&&!isNaN(price)){
//				var sum=money(num*price);
//				$('#add-iniValue').attr('value',sum);
//				$('#add-iniValue').trigger("change");
//			}else{
//				$('#add-iniValue').attr('value',0);
//			}
//			
//		});
//		
//		$("#add-iniValue").on("change",function(){	 //原值		 
//			var iniValue = $("#add-iniValue").val(); //原值
//			var scrapValueRatio = $("#add-scrapValueRatio").val();//残值率
//			var expectTime = $("#add-expectTime").val(); //折旧期间
//			/*me.checked=$('#add-equipInlineRadio1').attr('checked');//判断是否折旧
////			var totalDepreciatedValue = $("#add-totalDepreciatedValue").val(); //累计折旧额
//			if(me.checked=='checked'){*/
//				$("#add-totalDepreciatedValue").val('');
//				$("#add-assetBal").val('');
//				if(iniValue == ""){
//					$("#add-sumExpectVal").val("");
//					$("#add-assetMonth").val(""); //月折旧/摊销额
//					$("#add-assetBal").val("");
//					$("#add-totalDepreciatedValue").val("");
//				}else{ //原值不为空
//					if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){ //原值是数字
//						if(scrapValueRatio == ""){
//							$("#add-sumExpectVal").val("");
//						}else if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0){ //残值率是数字
//							if(scrapValueRatio <= 100){
//								var sumExpectVal = iniValue * scrapValueRatio / 100;
//								sumExpectVal = money(sumExpectVal);
//								$("#add-sumExpectVal").val(sumExpectVal);  //设置预计净残值
//								if(expectTime == ""){ //折旧期间为空
//									$("#add-assetMonth").val("");
//								}else{
//									if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0){ //折旧期间是数字
//										var assetMonth =  (iniValue - sumExpectVal) / expectTime;
//										assetMonth = money(assetMonth);
//										$("#add-assetMonth").val(assetMonth); //月折旧
//										var getMonth = me.judgeAndGetMonth();
//										if(getMonth == 0){
//											$('#add-assetBal').val(money(iniValue-sumExpectVal));
//											$('#add-totalDepreciatedValue').val(money(0));
//										}else{
//											var totalDepreciatedValue = (iniValue - sumExpectVal)/expectTime*getMonth;
//											if(totalDepreciatedValue >= iniValue - sumExpectVal){
//												totalDepreciatedValue = iniValue - sumExpectVal;
//												$('#add-assetBal').val(sumExpectVal);
//											}
//											$('#add-totalDepreciatedValue').val(money(totalDepreciatedValue));
//											$('#add-assetBal').val(money(iniValue - totalDepreciatedValue));
//										}
//									}else{
//										$("#add-assetMonth").val("");
//									}
//								}
//							}
//						}else{ //残值率不是数字
//							$("#add-sumExpectVal").val("");
//						}
//					}else { //原值不是数字
//						$("#add-sumExpectVal").val("");
//						$("#add-assetMonth").val(""); //月折旧/摊销额
//						$("#add-assetBal").val("");
//						$("#add-totalDepreciatedValue").val("");
//					}
//				}
//			/*}else{ //如果不折旧
//				$("#add-totalDepreciatedValue").val(money(0));
//				if(iniValue==''){
//					console.log('++++');
//					$("#add-assetBal").val('');
//					$('#add-sumExpectVal').val('');
//				}else{
//					if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){ //原值是数字
////						$("#add-assetBal").val(money(iniValue));
//						if(scrapValueRatio==''){
//							$('#add-sumExpectVal').val('');
//						}else if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0){
//							$('#add-sumExpectVal').val(money(iniValue*scrapValueRatio/100));
//							$("#add-assetBal").val(money(iniValue-iniValue*scrapValueRatio/100));
//						}else{
//							$('#add-sumExpectVal').val('');
//							$("#add-assetBal").val('');
//						}
//					}else{
//						$("#add-assetBal").val('');
//						$('#add-sumExpectVal').val('');
//					}
//				}
//			}*/
//		});
//
//		$("#add-scrapValueRatio").bind("input",function(){  //残值率
//			var iniValue = $("#add-iniValue").val(); //原值
//			var scrapValueRatio = $("#add-scrapValueRatio").val(); //残值率
//			var expectTime = $("#add-expectTime").val();//折旧期间
//			/*me.checked=$("#add-equipInlineRadio1").attr("checked");//判断是否折旧
//			if(me.checked=='checked'){*/
//				if(scrapValueRatio == ""){
//					$("#add-sumExpectVal").val("");
//					$("#add-assetMonth").val("");
//					$("#add-assetBal").val("");
//					$("#add-totalDepreciatedValue").val("");
//				}else{ //残值率不为空
//					if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0) { //残值率是数字
//						if(scrapValueRatio <= 100){
//							if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0) { //原值是数字
//								var sumExpectVal = iniValue * scrapValueRatio / 100;
//								sumExpectVal = money(sumExpectVal);
//								$("#add-sumExpectVal").val(sumExpectVal);  //设置预计净残值
//								if(expectTime == ""){ //折旧期间为空
//									$("#add-assetMonth").val("");
//								}else{
//									if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0){ //折旧期间是数字
//										var assetMonth = (iniValue - sumExpectVal) / expectTime;
//										assetMonth = money(assetMonth);
//										$("#add-assetMonth").val(assetMonth);
//										var getMonth = me.judgeAndGetMonth();
//										if(getMonth == 0){
//											$("#add-totalDepreciatedValue").val(money(0));
//											$("#add-assetBal").val(money(iniValue - sumExpectVal));
//										}else{
//											var totalDepreciatedValue = (iniValue - sumExpectVal) / expectTime * getMonth;
//											if(totalDepreciatedValue >= iniValue - sumExpectVal){ //如果累计折旧额大于等于原值减去净残值
//												totalDepreciatedValue = iniValue - sumExpectVal;
//											}
//											totalDepreciatedValue = money(totalDepreciatedValue);
//											$("#add-totalDepreciatedValue").val(totalDepreciatedValue);
//											$("#add-assetBal").val(money(iniValue - totalDepreciatedValue));
//										}
//									}else{ //折旧期间不是数字
//										$("#add-assetMonth").val("");
//									}
//								}
//							}else {
//								$("#add-sumExpectVal").val("");
//								$("#add-assetMonth").val("");
//							}
//						}else{
//							$("#add-sumExpectVal").val("");
//						}
//					}else { //残值率不是数字
//						$("#add-sumExpectVal").val("");
//						$("#add-assetMonth").val("");
//						$("#add-assetBal").val("");
//						$("#add-totalDepreciatedValue").val("");
//					}
//				}
//			
//		});
//		
//		$("#add-expectTime").bind("input",function(){  //折旧期间
//			var expectTime = $("#add-expectTime").val(); //折旧期间
//			var iniValue = $("#add-iniValue").val(); //原值
//			var sumExpectVal = $("#add-sumExpectVal").val(); //预计净残值
//			var startTime = $("#add-startTime").val(); //折旧开始日期
//			if(expectTime == "" || expectTime == 0){
//				$("#add-assetMonth").val("");
//				$("#add-endTime").val("");
//				$("#add-assetBal").val("");
//				$("#add-totalDepreciatedValue").val("");
//			}else{ //折旧期间不为空
//				if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0) { //折旧期间是数字
//					var patrn = /^\d*$/;
//					if(patrn.exec(expectTime)){ //折旧期间是正数
//						if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0) { //原值是数字 
//							if(sumExpectVal == ""){ //预计净残值为空
//								$("#add-assetMonth").val("");
//							}else{
//								var assetMonth = (iniValue - sumExpectVal)/expectTime;
//								assetMonth = money(assetMonth);
//								$("#add-assetMonth").val(assetMonth); //设置月折旧/摊销额
//								var getMonth = me.judgeAndGetMonth();
//								if(getMonth == 0){
//									$("#add-totalDepreciatedValue").val(money(0));
//									$("#add-assetBal").val(money(iniValue - sumExpectVal));
//								}else{
//									var totalDepreciatedValue = (iniValue - sumExpectVal)/expectTime * getMonth;
//									if(totalDepreciatedValue >= iniValue-sumExpectVal){ //如果累计折旧大于等于原值减去净残值
//										totalDepreciatedValue = iniValue-sumExpectVal;
//									}
//									totalDepreciatedValue = money(totalDepreciatedValue);
//									$("#add-totalDepreciatedValue").val(totalDepreciatedValue);
//									$("#add-assetBal").val(money(iniValue-totalDepreciatedValue));
//								}
//							}
//						}else { //原值不是数字
//							$("#add-assetMonth").val("");
//						}
//						
//						if(startTime == ""){ //折旧开始日期为空
//							$("#add-endTime").val(""); 
////							$("#add-assetMonth").val("");
//							$("#add-assetBal").val("");
//							$("#add-totalDepreciatedValue").val("");
//						}else{
//							me.setEndTime(expectTime); //设置折旧结束日期
//						}
//					}else{
////						return false;
//					}
//				}else{ //折旧期间不是数字
//					$("#add-assetMonth").val("");
//					$("#add-endTime").val(""); //折旧结束日期
//					$("#add-assetBal").val("");
//					$("#add-totalDepreciatedValue").val("");
//				}
//			}
//		});
		
		//折旧开始日期
//		$("#add-startTime").on('valueChanged',function(event){
//			var expectTime = $("#add-expectTime").val(); //折旧期间
//			var startTime = $("#add-startTime").val(); //折旧开始日期
//			var iniValue = $("#add-iniValue").val(); //原值
//			var sumExpectVal = $("#add-sumExpectVal").val(); //预计净残值
//			if(startTime == ""){
//				$("#add-endTime").val("");
//				$("#add-totalDepreciatedValue").val("");
//				$("#add-assetBal").val("");
//			}else{ //折旧开始日期不为空
//				if(expectTime == "" || expectTime ==0){
//					$("#add-endTime").val("");
//					$("#add-totalDepreciatedValue").val("");
//					$("#add-assetBal").val("");
//				}else{ //折旧期间不为空或0
//					if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0){ //如果折旧期间是数字
//						var patrn = /^\d*$/;
//						if(patrn.exec(expectTime)){ //折旧期间是正数
//							me.setEndTime(expectTime);
//							var getMonth = me.judgeAndGetMonth();
//							console.log(getMonth);
//							if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)){
//								if(/^(\-?\d*)(\.\d+)?$/g.exec(sumExpectVal)){
//									if(getMonth == 0){
//										$("#add-totalDepreciatedValue").val(money(0));
//										$("#add-assetBal").val(money(iniValue - sumExpectVal));
//									}else{
//										var totalDepreciatedValue = (iniValue - sumExpectVal) / expectTime * getMonth;
//										if(totalDepreciatedValue < iniValue-sumExpectVal){ 
//											totalDepreciatedValue = money(totalDepreciatedValue);
//											$("#add-totalDepreciatedValue").val(totalDepreciatedValue);
//											$("#add-assetBal").val(money(iniValue - totalDepreciatedValue));
//										}else{  //如果累计折旧额大于等于原值减去净残值
//											$("#add-totalDepreciatedValue").val(money(iniValue-sumExpectVal));
//											$("#add-assetBal").val(money(sumExpectVal));
//										}
//									}
//								}else{
//									
//								}
//							}else{
//								
//							}
//						}else{
//							$("#add-totalDepreciatedValue").val("");
//							$("#add-assetBal").val("");
//						}
//					}else {
//						$("#add-endTime").val("");
//					}
//				}
//			}
//		});
//		
//		//购买日期
//		$("#add-purchaseDate").bind("valueChanged",function(){
//			var buyTime = $("#add-purchaseDate").val(); //购买日期
//			var startTime = $("#add-startTime").val(); //折旧开始日期
//			var iniValue = $("#add-iniValue").val(); //原值
//			var scrapValueRatio = $("#add-scrapValueRatio").val();//残值率
//			var sumExpectVal = $("#add-sumExpectVal").val(); //净残值
//			var expectTime = $("#add-expectTime").val(); //折旧期间
//			/*me.checked=$("#add-equipInlineRadio1").attr("checked");//判断是否折旧
//			if(me.checked=='checked'){*/
//				if(buyTime == ""){
//					$("#add-totalDepreciatedValue").val("");
//					$("#add-assetBal").val("");
//				}else{ //购买日期不为空
//					if(startTime == ""){
//						$("#add-totalDepreciatedValue").val("");
//						$("#add-assetBal").val("");
//					}else{ //折旧开始日期不为空
//						if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){ //原值是数字
//							if(/^(\-?\d*)(\.\d+)?$/g.exec(sumExpectVal)&&sumExpectVal>=0){ //净残值是数字
//								if(expectTime == "" || expectTime == 0){
//									$("#add-totalDepreciatedValue").val("");
//									$("#add-assetBal").val("");
//								}else{
//									var patrn = /^\d*$/;
//									if(patrn.exec(expectTime)){
//										var getMonth = me.judgeAndGetMonth();
//										console.log(getMonth);
//										if(getMonth ==0){
//											$("#add-totalDepreciatedValue").val(money(0));
//											$("#add-assetBal").val(money(iniValue - sumExpectVal));
//										}else{
//											totalDepreciatedValue = (iniValue - sumExpectVal) / expectTime * getMonth;
//											if(totalDepreciatedValue >= iniValue - sumExpectVal){ //如果累计折旧额大于等于原值减去净残值
//												totalDepreciatedValue = iniValue - sumExpectVal;
//											}
//											totalDepreciatedValue = money(totalDepreciatedValue);
//											$("#add-totalDepreciatedValue").val(totalDepreciatedValue);
//											$("#add-assetBal").val(money(iniValue - totalDepreciatedValue));
//										}
//									}else{
////										return false;
//									}
//								}
//							}else{
//								
//							}
//						}else{
//							return true;
//						}
//					}
//				}
//			/*}else{//选择否
//				console.log(scrapValueRatio);
//				if(scrapValueRatio==''){
//					$('#add-sumExpectVal').val('');
//					$('#add-assetBal').val('');
//				}else if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0&&scrapValueRatio<=100){
//					if(iniValue==''){
//						$('#add-sumExpectVal').val('');
//						$('#add-assetBal').val('');
//					}else if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){
//						$('#add-sumExpectVal').val(money(iniValue*scrapValueRatio/100));
//						$('#add-assetBal').val(money(iniValue-iniValue*scrapValueRatio/100));
//					}
//				}else{
//					$('#add-sumExpectVal').val('');
//					$('#add-assetBal').val('');
//				}
//			}*/
//			
//		});
		
		//金额添加小数点后两位
		$("#add-iniValue").bind("blur",function(){ //原值失去焦点
			var iniValue = $("#add-iniValue").val();
			if(iniValue == ""){
				
			}else{
				if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)) {
					iniValue = money(iniValue);
					$("#add-iniValue").val(iniValue);
				}else {
					
				}
			}
		});
		
		$("#add-startTime").jqxDateTimeInput('val','');
		me.initValidator();
	};
	
	//判断输入的折旧开始日期是否合法,并返回getMonth。
	this.judgeAndGetMonth = function(){
		var getMonth;
		var date = new Date();
		var year = parseInt(date.getFullYear()); //当前年份
		var month = parseInt(date.getMonth());
		month = month + 1; //当前月份
		var day = date.getDate();//当前日
		var startTime = $("#add-startTime").val(); //折旧开始日期
		var buyTime = $("#add-purchaseDate").val(); // 购买日期
		if(buyTime == ""){
			getMonth = 0;
		}else if(startTime == ""){
			getMonth = 0;
		}else{ //折旧开始日期和购买日期都不为空
			var startYear = parseInt(startTime.substring(0,4)); //折旧开始日期的年份
			var startMonth = parseInt(startTime.substring(5)); //折旧开始日期的月份
			var buyYear = parseInt(buyTime.substring(0,4)); //购买日期的年份
			var buyMonth = parseInt(buyTime.substring(5,7)); //购买日期的月份
			var buyDay = parseInt(buyTime.substring(8,10)); //购买日期的日
			//debugger;
			if(buyYear > year){
				getMonth = 0;
			}else if(buyYear == year){
				if(buyMonth >= month){
					getMonth = 0;
				}else{ //购买日期和当前日期是同一年
					if(startYear < buyYear){
						getMonth = 0;
					}/*else if(startMonth < buyMonth){
						getMonth = 0;
					}*/else{ //购买日期合法，且折旧开始日期合法
						if(startYear == year){ //折旧开始日期和当前日期是同一年
							if(startMonth < month){
								getMonth = month - startMonth;
							}else{
								getMonth = 0;
							}
						}else if(startYear > year){ //折旧开始年份大于当前年份
							getMonth = 0;
						}else{ //开始折旧年份小于当前年份
							if(startMonth == month){
								getMonth = 12 * (year - startYear);
							}else if(startMonth < month){
								getMonth = 12 * (year - startYear) + (month - startMonth);
							}else{
								getMonth = 12 * (year - startYear) - (startMonth - month);
							}
						}
					}
				}
			}else{
				if(startYear < buyYear){
					getMonth = 0;
				}/*else if(startMonth < buyMonth){
					getMonth = 0;
				}*/else{ //购买日期合法，且折旧开始日期合法
					if(startYear == year){ //折旧开始日期和当前日期是同一年
						if(startMonth < month){
							getMonth = month - startMonth;
						}else{
							getMonth = 0;
						}
					}else if(startYear > year){ //折旧开始年份大于当前年份
						getMonth = 0;
					}else{ //开始折旧年份小于当前年份
						if(startMonth == month){
							getMonth = 12 * (year - startYear);
						}else if(startMonth < month){
							getMonth = 12 * (year - startYear) + (month - startMonth);
						}else{
							getMonth = 12 * (year - startYear) - (startMonth - month);
						}
					}
				}
			} 
		}
		return getMonth;
		
	}
	
	//设置折旧结束日期
	this.setEndTime = function(expectTime){
		var start = $("#add-startTime").jqxDateTimeInput('val');
		var arr = start.split("-");
		var month;
		var arrMonth;
		var arrYear;
		var year;
		month = parseInt(expectTime); //输入的值
		arrMonth = parseInt(arr[1]); //1
		arrYear = parseInt(arr[0]); //2016
		year = Math.floor(month/12);
		if(year == 0){ //输入的月份小于12
			if(arrMonth == 1){ 			//当前是一月份
				month = month;
				year = arrYear;
			}else{  //当前不是一月份
				if((month+arrMonth)<=12){
					month = arrMonth + month - 1;
					year = arrYear;
				}else{
					if((month+arrMonth)%13 == 0){
						year = arrYear;
						month = 12;
					}else{
						year = arrYear + 1;
						month = (month+arrMonth)%13;
					}
				}
			}
		}else { //输入的月份大于等于12
			if(arrMonth == 1){ //当前是一月份
				if(month == 12){
					year = arrYear;
					month = month;
				}else{
					year = (Math.floor(month/12)) + arrYear;
					month = (month % 12) + arrMonth - 1;
					if(month == 0){
						month = 12;
						year = year - 1;
					}
				}
			}else{  //当前不是一月份
				if(month == 12){
					year = arrYear + 1;
					month = arrMonth - 1;
				}else{
					year = (Math.floor(month/12)) + arrYear;
					month = (month % 12) + arrMonth - 1;
					if(month>12){
						month=(month%12)
						year=year+1;						
					}
				}
			}
		}
		
		//判断month
		if(month < 10){
			month = "0"+month;
		}
		$("#add-endTime").val(year+"-"+month);
		
	};
	
	//初始化页面的校验
	this.initValidator = function(){
		$("#add-equipment").jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#add-assetRef', message: "不能为空", action: 'keyup, blur', rule:'required'},   
                { input: '#add-assetRef', message: "必须是数字或字母", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/[\u4E00-\u9FA5]/g.test(input.val())) return false;
                		return true;
	        	   	}  
                },
                { input: '#add-assetName', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#add-iniValue', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#add-iniValue', message: "必须是数字", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) return true;
                		return false;
	        	   	}  
                },
                { input: '#add-iniprice', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#add-iniprice', message: "必须是数字", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) return true;
                		return false;
	        	   	}  
                },
                { input: '#add-ininum', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#add-ininum', message: "必须是整数", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(parseInt(input.val()).toFixed(0)!==input.val()) return false;
						if(isNaN(input.val())||input.val()<0||input.val()=='') return false;
	        	   		return true;
	        	   	}  
                },
                { input: '#add-iniValue', message: "不能小于0", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val() < 0) return false;
                		return true;
	        	   	}  
                },
                { input: '#add-totalDepreciatedValue', message: "必须是数字", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) return true;
                		return false;
                	} 
                },
                { input: '#add-totalDepreciatedValue', message: "不能大于原值", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val() > parseInt($("#add-iniValue").val())) return false;
                		return true;
                	} 
                },
                { input: '#add-scrapValueRatio', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#add-scrapValueRatio', message: "必须是数字", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) return true;
                		return false;
                	} 
                },
                { input: '#add-scrapValueRatio', message: "不能大于100", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val() > 100) return false;
                		return true;
                	} 
                },
                { input: '#add-scrapValueRatio', message: "不能小于0", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val() < 0) return false;
                		return true;
                	} 
                },
                { input: '#add-coaDepreciate', message: "输入不合法，请重新输入", action: 'keyup, blur', 
                	rule:function(input,commit){
		        		if(input.val()==''||input.jqxComboBox('getSelectedItem')==null) return false;
		        		return true;
	        	   	}  
                },
                { input: '#add-coaExpense', message: "输入不合法，请重新输入", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val()==''||input.jqxComboBox('getSelectedItem')==null) return false;
                		return true;
	        	   	}  
                },
                { input: '#add-purchaseDate', message: "请选择", action: 'keyup, blur', 
                	rule:function(input,commit){
		        		if(input.val() === '') return false;
		        		return true;
	        	   	}  
                },
                { input: '#add-purchaseDate', message: "购买日期不能大于当前日期", action: 'blur',
                	rule:function(input,commit){
                		var date = new Date();
                		var year = date.getFullYear(); //获得当前年份
                		var month = date.getMonth(); //获得当前月份
                		var day = date.getDate(); //获得当前日
                		month = month + 1;
            			if(parseInt(input.val().substring(0,4)) > year){
                			return false;
                		}else if(parseInt(input.val().substring(0,4)) == year){
                			if(parseInt(input.val().substring(5,7)) > month){
                    			return false;
                    		}else if(parseInt(input.val().substring(5,7)) == month){
                    			if(parseInt(input.val().substring(8)) > day){
                    				return false;
                    			}else{
                    				return true;
                    			}
                    		}else{
                    			return true;
                    		}
                		}else{
                			return true;
                		}
                	}
                },
                { input: '#add-startTime', message: "请选择", action: 'blur',
                	rule:function(input,commit){
                		/*var checked = $("#add-equipInlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			if(input.val() === "") return false;
                    		return true;
                		/*}else{
                			return true;
                		}*/
                	}
                },
                { input: '#add-startTime', message: "折旧开始日期不能小于购买日期", action: 'change,blur',
                	rule:function(input,commit){
                		/*var checked = $("#add-equipInlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			/*var purchaseDate = $("#add-purchaseDate").val(); //购买日期
                			var purchaseDateYear = purchaseDate.substring(0,4); 
                			var purchaseDateMonth = purchaseDate.substring(5,7);
                			var startTime = $("#add-startTime").val(); //折旧开始日期
                			var startTimeYear = startTime.substring(0,4);
                			var startTimeMonth = startTime.substring(5);
                			if(parseInt(startTimeYear) < parseInt(purchaseDateYear)){ //折旧开始年份小于购买年份
                    			return false;
                    		}else if(parseInt(startTimeMonth) < parseInt(purchaseDateMonth)){ //折旧开始年份大于等于购买年份，但折旧开始月份小于购买月份
                    			return false;
                    		}else{
                    			return true;
                    		}*/
                		if($('#add-purchaseDate').val()=='') return true;
                		if(input.val()<$('#add-purchaseDate').val().toString().substring(0,7)){
                			return false;
                		}
                		return true;
                		/*}else{
                			return true;
                		}*/
                	}
                },
                { input: '#add-expectTime', message: "不能为空", action: 'keyup ,blur',
                	rule:function(input,commit){
                		/*var checked = $("#add-equipInlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			if(input.val() === "") return false;
                    		return true;
                		/*}else{
                			return true;
                		}*/
                	}
                },
                { input: '#add-expectTime', message: "必须是数字,且大于0", action: 'keyup, blur',
                	rule:function(input,commit){
                		/*var checked = $("#add-equipInlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			if(input.val() ==0){
                				return false;
                			}else{
                				
                			}
                			if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) {
                				return true;
                			}else {
                				$("#add-assetMonth").val("");
                				$("#add-endTime").val("");
                				return false;
                			}
                		/*}else{
                			return true;
                		}*/
                	}
                },
                { input: '#add-expectTime', message: "必须是整数", action: 'keyup, blur',
                	rule:function(input,commit){
                		/*var checked = $("#add-equipInlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			var patrn = /^\d*$/;
                			if(patrn.exec(input.val())) return true;
                			return false;
                		/*}else{
                			return true;
                		}*/
                	}
                }
           ]
    	});
	}
	
}

var EquipmentAddBssBindModle = function(equipmentAddBssMgt){
	var me = this;

	  /**
	 * 提交添加固定资产
	 */
	 this.addEquipment = function(params){
		 console.log(params);
		 if($("#add-equipment").jqxValidator("validate")){
			 Core.AjaxRequest({
	           url : _global_settings.service.url+"/ac/"+new Base64().encode('tosys/coaReport/asset/create/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
	           type: "POST",
	           async:false,
	           params:params,
	           showMsg:false,
	           callback: function(res) {
	        	   if(res == 0){
	        		   try{
	        			  setCloseAlertTimeOneSecond();
	 					  equipmentAddBssMgt.refreshDataInfo();
	 					  var tab_index;
	 					  $.closeTab(tab_index);
	 	        	   }catch(e){
	 	        	   }
	        	   }else if (res == 1){
	        		   Core.alert({ message : "固定资产编码重复不能保存!" });
	        	   }
	           },
	           failure:function(e){
	        	   Core.alert({ message : "固定资产异常,不能保存！" });
	           }
	       });	 
	 	}else{
	 		
	 	}
		 return false;
	 }
	 
	 /**
	 * 提交添加固定资产前赋值
	 */
	 this.initAddEquParam = function(){
		var assetRef = $("#add-assetRef").val();   //资产编码
		var purchaseDate = $("#add-purchaseDate").val();  //购买日期
		var name = $("#add-assetName").val();  //资产名称
		var iniValue = $("#add-iniValue").val();   //原值
		var totalDepreciatedValue = $("#add-totalDepreciatedValue").val(); //累计折旧额
		var assetBal = $("#add-assetBal").val();  //资产余额		
		var scrapValueRatio = $("#add-scrapValueRatio").val();   //残值率
		var sumExpectVal = $("#add-sumExpectVal").val();  //预计净残值
		var expectTime = $("#add-expectTime").val();  //预计折旧期间
		var assetMonth = $("#add-assetMonth").val();   //月折旧
		var startTime = $("#add-startTime").val();  // 折旧开始日期
		var endTime = $("#add-endTime").val();  //折旧结束日期
		var coaDepreciate = $("#add-coaDepreciate").val(); //累计折旧科目
		var coaExpense= $("#add-coaExpense").val(); //费用科目
		var startDepreciate; //是否开始折旧
		var depreciateMonth;//折旧期间
		var depreciateStartMonth; //开始折旧日期
		var depreciateEndMonth;//结束折旧日期
		var monthlyDepreciateValue; //月折旧
		
		//设置折旧开始和折旧结束日期的时，分，秒
		var date = new Date();
		var time;
		var hh = date.getHours();
		var mm = date.getMinutes();
		var ss = date.getSeconds();
		if(hh < 10){
			hh = "0" + hh;
		}
		if(mm < 10){
			mm = "0" + mm;
		}
		if(ss < 10){
			ss = "0" + ss;
		}
		time = hh + ":" + mm + ":" + ss;
		
		/*var checked = $("#add-equipInlineRadio1").attr("checked"); //是否现在折旧
		if(checked == "checked"){*/
			startDepreciate =  0;
			depreciateMonth = expectTime;
			monthlyDepreciateValue = assetMonth;
			depreciateStartMonth = startTime + "-01"+ " "+time;
			depreciateEndMonth = endTime + "-01"+" "+time;
		/*}else{
			startDepreciate = 1;
			depreciateMonth = null;
			monthlyDepreciateValue = null;
			depreciateStartMonth = null;
			depreciateEndMonth = null;
		}*/
		
		return {
			coaDepreciate:{id:coaDepreciate},
			coaExpense:{id:coaExpense},
			price:$('#add-iniprice').val(),
			qty:$('#add-ininum').val(),
			name:name,
			assetRef:assetRef,
			purchaseDate:purchaseDate+" "+time,
			iniValue:iniValue,
			totalDepreciatedValue:totalDepreciatedValue,
			scrapValueRatio:scrapValueRatio,
			depreciateMonth:depreciateMonth, //折旧期间
			depreciateStartMonth:depreciateStartMonth,
			depreciateEndMonth:depreciateEndMonth,
			monthlyDepreciateValue:monthlyDepreciateValue,
			startDepreciate:startDepreciate
		};
	 }
	 
	//设置累计折旧和资产余额，点击否
	 this.setValue=function(){
		 var iniValue=$('#add-iniValue').val();
		 var sumExpectVal = $('#add-sumExpectVal').val();//预计净残值
		 $('#add-totalDepreciatedValue').val(money(0));
		 if(iniValue==''){
			 $('#add-assetBal').val('');
		 }else if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){
			 if(/^(\-?\d*)(\.\d+)?$/g.exec(sumExpectVal)&&sumExpectVal>=0){
				 $('#add-assetBal').val(money(iniValue-sumExpectVal));
			 }
		 }
	 }
	 
	 //设置累计折旧和资产余额，点击是
	 this.setTwoValue=function(){
		 var iniValue = $('#add-iniValue').val();//原值
		 var sumExpectVal = $('#add-sumExpectVal').val();//预计净残值
		 var expectTime = $('#add-expectTime').val();//折旧期间
		 var getMonth = equipmentAddBssMgt.judgeAndGetMonth();
		 console.log('Month:'+getMonth);
		 if(iniValue==''){
			 $('#add-totalDepreciatedValue').val('');
			 $('#add-assetBal').val('');
		 }else{
			 if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){//原值是数字
				 if(sumExpectVal==''){
					 $('#add-totalDepreciatedValue').val('');
					 $('#add-assetBal').val('');
				 }else{
					 if(/^(\-?\d*)(\.\d+)?$/g.exec(sumExpectVal)&&sumExpectVal>=0){//预计净残值是数字
						 if(expectTime==''){
							 $('#add-totalDepreciatedValue').val('');
							 $('#add-assetBal').val('');
						 }else{
							 if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0){//折旧期间是数字
								 if(getMonth==0){
									 $('#add-totalDepreciatedValue').val(money(0));
									 $('#add-assetBal').val(money(iniValue-sumExpectVal));
								 }else{
									 var totalDepreciatedValue = (iniValue-sumExpectVal)/expectTime*getMonth;
									 if(totalDepreciatedValue>=iniValue){
										 $('#add-totalDepreciatedValue').val(money(iniValue-sumExpectVal));
										 $('#add-assetBal').val(money(sumExpectVal));
									 }else{
										 $('#add-totalDepreciatedValue').val(money(totalDepreciatedValue));
										 $('#add-assetBal').val(money(iniValue-totalDepreciatedValue));
									 }
								 }
							 }
						 }
					 }
				 }
			 } 
		 }
	 }
	 
	 this.bind = function(){
		$("#add-assetSave").on({'click':function(){
			me.addEquipment(me.initAddEquParam());
		}});
		
		$("#add-equipInlineRadio1").on("click",function(){
			$("#add-equipInlineRadio1").attr("checked",true);
			$("#add-equipInlineRadio2").attr("checked",false);
			$("#dateshow_hide").css({display:"block"});
			me.setTwoValue();
			console.log('first');
		});
		$("#add-equipInlineRadio2").on("click",function(){
			me.setValue();
			$("#add-equipInlineRadio1").attr("checked",false);
			$("#add-equipInlineRadio2").attr("checked",true);
			$("#dateshow_hide").css({display:"none"});
			console.log('second');
		});
	 };
	 
	 this.unbindAll = function(){
		$("#add-assetSave").off('click');
		$("#add-equipInlineRadio1").off('click');
		$("#add-equipInlineRadio2").off('click');
	 };

}