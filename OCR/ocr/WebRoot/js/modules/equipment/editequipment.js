var EquipmenteditBssMgt = function(){
	var me = this;
	var url = _global_settings.service.url+"/asset";
	this.data = null;
	this.checked=null;//判断是否折旧
	
	this.stop={
		sum:0,
		time:null
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
    
  //初始化科目
	this.getStockSubject = function(name,id){
		var adapter = ComboBoxSources.getAdapter(name);
		var records = adapter.records; 
//		console.log(records);
		for(var i=0;i<records.length;i++){
			if(records[i].id == id){
				return records[i].name;
			}
		}
		if(!id){
			ComboBoxSources.load(name);
			return "暂无";
		}
	}
	
	//初始化编辑资产界面
	this.initInput = function(){
		$.addTabCloseEvent();
		$('#editequip-totalDepreciatedValue').attr('readonly','true');
		me.data = $.pk.data;
		if($.pk!==undefined){
			if($.pk.data===undefined){
				Core.alert({
					message:"data入参错误",
					callback:function(){
						$.closeTab();
					}
				});
			}
		}
		if(me.data.startDepreciate=='pauseDepreciate'){
			//$('#editequip-stop')[0].checked=true;
			me.stop.sum=me.data.totalDepreciatedValue;
			me.stop.time=me.data.depreciatePauseMonth;
			setTimeout(function(){
				$('#editequip-stop').trigger('click');
			},200)
			
			/*$('#editEquipmentPage').on('change',function(){
				var smallvalue=$('#editequip-totalDepreciatedValue').val();
				setTimeout(function(){
					if($('#editequip-stop')[0].checked!=true){
						if($('#editequip-expectTime').val()!=''&&$('#editequip-startTime').val()!=''){
							var bigvalue=parseFloat(smallvalue)+parseFloat(stop.sum);
							$('#editequip-totalDepreciatedValue').val(money(bigvalue));
							var overvalue=parseFloat($('#editequip-assetBal').val())-parseFloat(stop.sum);//资产余额
							$('#editequip-assetBal').val(overvalue);
						}
						
					}else{
						$('#editequip-totalDepreciatedValue').val(money(stop.sum));
						var end=parseFloat($('#editequip-iniValue').val())-stop.sum;
						$('#editequip-assetBal').val(money(end));
					}
				},300)
			});*/
		}else{
			$('#editEquipmentPage').find('input').attr('disabled','disabled');
			$("#editequip-purchaseDate").jqxDateTimeInput({'disabled':true});
			$("#editequip-startTime").jqxDateTimeInput({'disabled':true});
			//$("#editequip-coaDepreciate").jqxComboBox({'disabled':true});
			//$("#editequip-coaExpense").jqxComboBox({'disabled':true});
			//$('#editequip-scrapValueRatio').removeAttr('disabled');
			$('#editequip-assetRef').removeAttr('disabled');
			$('#editequip-assetName').removeAttr('disabled');
			$('#editequip-stop').removeAttr('disabled');
		}
		$('#editequip-stop').val(me.data.startDepreciate);
		$('#editequip-iniprice').val(me.data.price),
		$('#editequip-ininum').val(me.data.qty),
		$("#editequip-assetRef").val(me.data.assetRef);
		$("#editequip-assetName").val(me.data.name);
		$("#editequip-iniValue").val(money(me.data.iniValue));
		$("#editequip-totalDepreciatedValue").val(money(me.data.totalDepreciatedValue));
		$("#editequip-assetBal").val(money(me.data.iniValue - me.data.totalDepreciatedValue));
		$("#editequip-scrapValueRatio").val(me.data.scrapValueRatio);
		$("#editequip-sumExpectVal").val(money(me.data.iniValue * (me.data.scrapValueRatio/100)));
		$("#editequip-scrapValueRatio").val(me.data.scrapValueRatio);
		$("#editequip-purchaseDate").datetimeinput({formatString:"yyyy-MM-dd",width: '100%', height: '34px'});
		$("#editequip-purchaseDate").jqxDateTimeInput('setDate',new Date(me.data.purchaseDate.substring(0,10)));
		/*var startDepreciate = me.data.startDepreciate; //判断是否折旧
		if(startDepreciate == "undepreciate"){ //不折旧
			$("#editequip-inlineRadio1").attr("checked",false);
			$("#editequip-inlineRadio2").attr("checked",true);
			$("#editequip-dateshow_hide2").css({display:"none"});
			$("#editequip-startTime").datetimeinput({formatString:"yyyy-MM",width: '100%', height: '34px'});
			$("#editequip-startTime").jqxDateTimeInput('setDate',new Date());
		}else{ //折旧
*/			//$("#editequip-inlineRadio1").attr("checked",true);
			//$("#editequip-inlineRadio2").attr("checked",false);
			$("#editequip-dateshow_hide2").css({display:"block"});
			$("#editequip-expectTime").val(me.data.depreciateMonth);
			if(me.data.depreciateMonth!=null){
				//$("#editequip-assetMonth").val(money((me.data.iniValue - $("#editequip-sumExpectVal").val())/me.data.depreciateMonth));
				$("#editequip-assetMonth").val(me.data.monthlyDepreciateValue)
			}
			$("#editequip-startTime").datetimeinput({formatString:"yyyy-MM",width: '100%', height: '34px'});
			//$("#editequip-startTime").jqxDateTimeInput('setDate',new Date(me.data.depreciateStartMonth.substring(0,7)));
			//$("#editequip-endTime").val(me.data.depreciateEndMonth.substring(0,7));
			$("#editequip-startTime").val(me.data.depreciateStartMonth);
			if(me.data.depreciateEndMonth!=null)
			$("#editequip-endTime").val(me.data.depreciateEndMonth.substring(0,7));
		//}
		
		//累计折旧科目下拉数据
    	$("#editequip-coaDepreciate").coaCombbox({ 
    		displayMember: "name",
    		valueMember: "id",
			width: "100%", 
			height: 34,
			searchMode: 'contains'
    	},['1602','1702']);
    	$("#editequip-coaDepreciate").val(me.data.coaDepreciate.id);
    	
    	//费用科目下拉框数据
    	$("#editequip-coaExpense").coaCombbox({ 
    		displayMember: "name", 
    		valueMember: "id",
			width: "100%", 
			height: 34,
			searchMode: 'contains'
    	},['5101','6601','6602']);
    	$("#editequip-coaExpense").val(me.data.coaExpense.id);
		
    	
    	var setAllVal=function(){
			//debugger;
			var num=$('#editequip-ininum').val();
			var price=$('#editequip-iniprice').val();
			var scrap=$('#editequip-scrapValueRatio').val();
			var mouth=$('#editequip-expectTime').val();
			var startMouth=$('#editequip-startTime').val();
			var date=new Date();
			var fullYearNow=date.getFullYear();
			var monthNow=date.getMonth()+1;
			monthNow=monthNow.toString().length>1?monthNow:'0'+monthNow;
			if(num==parseInt(num)&&!isNaN(price)){
				var sum=money(num*price);
				$('#editequip-iniValue').val(sum);//原值
			}
			if(num==parseInt(num)&&!isNaN(price)&&!isNaN(scrap)){
				$('#editequip-sumExpectVal').val(money($('#editequip-iniValue').val()*scrap/100));//预计净残值
				$('#editequip-assetBal').val(money(parseFloat($('#editequip-iniValue').val())-parseFloat(money($('#editequip-totalDepreciatedValue').val()))))
			}
			if(mouth==parseInt(mouth)&&startMouth!=''&&mouth>=0){
				me.setEndTime(mouth);//折旧结束日期
			}
			if(num==parseInt(num)&&mouth==parseInt(mouth)&&!isNaN(price)&&!isNaN(scrap)&&mouth!=0){
				$('#editequip-assetMonth').val(money((parseFloat($('#editequip-iniValue').val())-parseFloat($('#editequip-sumExpectVal').val())-me.stop.sum)/mouth));//月折旧/摊销额
				var mouthSum=0;//累计折旧月数
				if(startMouth!=''){
				//	debugger;
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
					if(mouthSum<mouth){
						$('#editequip-totalDepreciatedValue').val(money(mouthSum*$('#editequip-assetMonth').val()));
					}else{
						$('#editequip-totalDepreciatedValue').val(money(mouth*$('#editequip-assetMonth').val()));
					}
					$('#editequip-totalDepreciatedValue').val(money(parseFloat($('#editequip-totalDepreciatedValue').val())+me.stop.sum))
					$('#editequip-assetBal').val(money(parseFloat($('#editequip-iniValue').val())-parseFloat($('#editequip-totalDepreciatedValue').val())));//资产余额
				}
			}
		};
		me.setAllVal=setAllVal;
		
		$('#editEquipmentPage').on('keyup','.editequipment',function(){
			setAllVal();
		});
		
		$("#editequip-startTime").on('valueChanged',function(){
			setAllVal();
		});
    	
//    	$('#editequip-ininum,#editequip-iniprice').on('keyup blur',function(){
//			var num=$('#editequip-ininum').val();
//			var price=$('#editequip-iniprice').val();
//			if(num==parseInt(num)&&!isNaN(price)){
//				var sum=money(num*price);
//				$('#editequip-iniValue').val(sum);
//				$('#editequip-iniValue').trigger("change");
//			}else{
//				$('#editequip-iniValue').val(0);
//			}
//			
//		});
//    	
//    	$("#editequip-iniValue").on("change",function(){	 //原值		 
//			var iniValue = $("#editequip-iniValue").val(); //原值
//			var scrapValueRatio = $("#editequip-scrapValueRatio").val();//残值率
//			var expectTime = $("#editequip-expectTime").val(); //折旧期间
////			var totalDepreciatedValue = $("#editequip-totalDepreciatedValue").val(); //累计折旧额
//			/*me.checked=$("#editequip-inlineRadio1").attr("checked");//判断是否折旧
//			if(me.checked=='checked'){*/
//				if(iniValue == ""){
//					$("#editequip-sumExpectVal").val("");
//					$("#editequip-assetMonth").val(""); //月折旧/摊销额
//					$("#editequip-assetBal").val("");
//					$("#editequip-totalDepreciatedValue").val("");
//				}else{ //原值不为空
//					if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0) { //原值是数字
//						if(scrapValueRatio == ""){
//							$("#editequip-sumExpectVal").val("");
//						}else if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0){ //残值率是数字
//							if(scrapValueRatio <= 100){
//								var sumExpectVal = iniValue * scrapValueRatio / 100;
//								sumExpectVal = money(sumExpectVal);
//								$("#editequip-sumExpectVal").val(sumExpectVal);  //设置预计净残值
//								if(expectTime == ""){ //折旧期间为空
//									$("#editequip-assetMonth").val("");
//								}else{
//									if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0){ //折旧期间是数字
//										var assetMonth =  (iniValue - sumExpectVal) / expectTime;
//										assetMonth = money(assetMonth);
//										$("#editequip-assetMonth").val(assetMonth); //月折旧
//										var getMonth = me.judgeAndGetMonth();
//										if(getMonth == 0){
//											$('#editequip-assetBal').val(money(iniValue-sumExpectVal));
//											$('#editequip-totalDepreciatedValue').val(money(0));
//										}else{
//											var totalDepreciatedValue = (iniValue - sumExpectVal)/expectTime*getMonth;
//											if(totalDepreciatedValue >= iniValue - sumExpectVal){
//												totalDepreciatedValue = iniValue - sumExpectVal;
//												$('#editequip-assetBal').val(sumExpectVal);
//											}
//											$('#editequip-totalDepreciatedValue').val(money(totalDepreciatedValue));
//											$('#editequip-assetBal').val(money(iniValue - totalDepreciatedValue));
//										}
//									}else{
//										$("#editequip-assetMonth").val("");
//									}
//								}
//							}
//						}else{ //残值率不是数字
//							$("#editequip-sumExpectVal").val("");
//						}
//					}else { //原值不是数字
//						$("#editequip-sumExpectVal").val("");
//						$("#editequip-assetMonth").val(""); //月折旧/摊销额
//						$("#editequip-assetBal").val("");
//						$("#editequip-totalDepreciatedValue").val("");
//					}
//				}
//			/*}else{ //选择否
//				$("#editequip-totalDepreciatedValue").val(money(0));
//				if(iniValue==''){
//					console.log('++++');
//					$("#editequip-assetBal").val('');
//					$('#editequip-sumExpectVal').val('');
//				}else{
//					if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){ //原值是数字
////						$("#edit-assetBal").val(money(iniValue));
//						if(scrapValueRatio==''){
//							$('#editequip-sumExpectVal').val('');
//						}else if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0){
//							$('#editequip-sumExpectVal').val(money(iniValue*scrapValueRatio/100));
//							$("#editequip-assetBal").val(money(iniValue-iniValue*scrapValueRatio/100));
//						}else{
//							$('#editequip-sumExpectVal').val('');
//							$("#editequip-assetBal").val('');
//						}
//					}else{
//						$("#editequip-assetBal").val('');
//						$('#editequip-sumExpectVal').val('');
//					}
//				}
//			}*/
//			
//		});
//    	$("#editequip-scrapValueRatio").bind("input",function(){  //残值率
//			var iniValue = $("#editequip-iniValue").val(); //原值
//			var scrapValueRatio = $("#editequip-scrapValueRatio").val(); //残值率
//			var expectTime = $("#editequip-expectTime").val();//折旧期间
//			/*me.checked=$("#editequip-inlineRadio1").attr("checked");//判断是否折旧
//			if(me.checked=='checked'){*/
//				if(scrapValueRatio == ""){
//					$("#editequip-sumExpectVal").val("");
//					$("#editequip-assetMonth").val("");
//					$("#editequip-assetBal").val("");
//					$("#editequip-totalDepreciatedValue").val("");
//				}else{ //残值率不为空
//					if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0) { //残值率是数字
//						if(scrapValueRatio <= 100){
//							if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0) { //原值是数字
//								var sumExpectVal = iniValue * scrapValueRatio / 100;
//								sumExpectVal = money(sumExpectVal);
//								$("#editequip-sumExpectVal").val(sumExpectVal);  //设置预计净残值
//								if(expectTime == ""){ //折旧期间为空
//									$("#editequip-assetMonth").val("");
//								}else{
//									if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0){ //折旧期间是数字
//										var assetMonth = (iniValue - sumExpectVal) / expectTime;
//										assetMonth = money(assetMonth);
//										$("#editequip-assetMonth").val(assetMonth);
//										var getMonth = me.judgeAndGetMonth();
//										if(getMonth == 0){
//											$("#editequip-totalDepreciatedValue").val(money(0));
//											$("#editequip-assetBal").val(money(iniValue - sumExpectVal));
//										}else{
//											var totalDepreciatedValue = (iniValue - sumExpectVal) / expectTime * getMonth;
//											if(totalDepreciatedValue >= iniValue - sumExpectVal){ //如果累计折旧额大于等于原值减去净残值
//												totalDepreciatedValue = iniValue - sumExpectVal;
//											}
//											totalDepreciatedValue = money(totalDepreciatedValue);
//											$("#editequip-totalDepreciatedValue").val(totalDepreciatedValue);
//											$("#editequip-assetBal").val(money(iniValue - totalDepreciatedValue));
//										}
//									}else{ //折旧期间不是数字
//										$("#editequip-assetMonth").val("");
//									}
//								}
//							}else {
//								$("#editequip-sumExpectVal").val("");
//								$("#editequip-assetMonth").val("");
//							}
//						}
//					}else { //残值率不是数字
//						$("#editequip-sumExpectVal").val("");
//						$("#editequip-assetMonth").val("");
//						$("#editequip-assetBal").val("");
//						$("#editequip-totalDepreciatedValue").val("");
//					}
//				}
//			/*}else{ //选择否
//				if(scrapValueRatio==''){
//					$('#editequip-sumExpectVal').val('');
//					$('#editequip-assetBal').val('');
//				}else if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0&&scrapValueRatio<=100){
//					if(iniValue==''){
//						$('#editequip-sumExpectVal').val('');
//						$('#editequip-assetBal').val('');
//					}else if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){
//						$('#editequip-sumExpectVal').val(money(iniValue*scrapValueRatio/100));
//						$('#editequip-assetBal').val(money(iniValue-iniValue*scrapValueRatio/100));
//					}
//				}else{
//					$('#editequip-sumExpectVal').val('');
//					$('#editequip-assetBal').val('');
//				}
//			}*/
//			
//		});
//    	
//    	$("#editequip-expectTime").bind("input",function(){  //折旧期间
//			var expectTime = $("#editequip-expectTime").val(); //折旧期间
//			var iniValue = $("#editequip-iniValue").val(); //原值
//			var sumExpectVal = $("#editequip-sumExpectVal").val(); //预计净残值
//			var startTime = $("#editequip-startTime").val(); //折旧开始日期
//			if(expectTime == "" || expectTime == 0){
//				$("#editequip-assetMonth").val("");
//				$("#editequip-endTime").val("");
//				$("#editequip-assetBal").val("");
//				$("#editequip-totalDepreciatedValue").val("");
//			}else{ //折旧期间不为空
//				if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0) { //折旧期间是数字
//					var patrn = /^\d*$/;
//					if(patrn.exec(expectTime)){ //折旧期间是正数
//						if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0) { //原值是数字 
//							if(sumExpectVal == ""){ //预计净残值为空
//								$("#editequip-assetMonth").val("");
//							}else{
//								var assetMonth = (iniValue - sumExpectVal)/expectTime;
//								assetMonth = money(assetMonth);
//								$("#editequip-assetMonth").val(assetMonth); //设置月折旧/摊销额
//								var getMonth = me.judgeAndGetMonth();
//								if(getMonth == 0){
//									$("#editequip-totalDepreciatedValue").val(money(0));
//									$("#editequip-assetBal").val(money(iniValue - sumExpectVal));
//								}else{
//									var totalDepreciatedValue = (iniValue - sumExpectVal)/expectTime * getMonth;
//									if(totalDepreciatedValue >= iniValue-sumExpectVal){ //如果累计折旧大于等于原值减去净残值
//										totalDepreciatedValue = iniValue-sumExpectVal;
//									}
//									totalDepreciatedValue = money(totalDepreciatedValue);
//									$("#editequip-totalDepreciatedValue").val(totalDepreciatedValue);
//									$("#editequip-assetBal").val(money(iniValue-totalDepreciatedValue));
//								}
//							}
//						}else { //原值不是数字
//							$("#editequip-assetMonth").val("");
//						}
//						
//						if(startTime == ""){ //折旧开始日期为空
//							$("#editequip-endTime").val(""); 
////							$("#editequip-assetMonth").val("");
//							$("#editequip-assetBal").val("");
//							$("#editequip-totalDepreciatedValue").val("");
//						}else{
//							me.setEndTime(expectTime); //设置折旧结束日期
//						}
//					}else{
////						return false;
//					}
//				}else{ //折旧期间不是数字
//					$("#editequip-assetMonth").val("");
//					$("#editequip-endTime").val(""); //折旧结束日期
//					$("#editequip-assetBal").val("");
//					$("#editequip-totalDepreciatedValue").val("");
//				}
//			}
//		});
//		
//    	//折旧开始日期
//		$("#editequip-startTime").on('valueChanged',function(event){
//			var expectTime = $("#editequip-expectTime").val(); //折旧期间
//			var startTime = $("#editequip-startTime").val(); //折旧开始日期
//			var iniValue = $("#editequip-iniValue").val(); //原值
//			var sumExpectVal = $("#editequip-sumExpectVal").val(); //预计净残值
//			if(startTime == ""){
//				$("#editequip-endTime").val("");
//				$("#editequip-totalDepreciatedValue").val("");
//				$("#editequip-assetBal").val("");
//			}else{ //折旧开始日期不为空
//				if(expectTime == "" || expectTime ==0){
//					$("#editequip-endTime").val("");
//					$("#editequip-totalDepreciatedValue").val("");
//					$("#editequip-assetBal").val("");
//				}else{ //折旧期间不为空或0
//					if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0){ //如果折旧期间是数字
//						var patrn = /^\d*$/;
//						if(patrn.exec(expectTime)){ //折旧期间是正数
//							me.setEndTime(expectTime);
//							var getMonth = me.judgeAndGetMonth();
//							if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)){
//								if(/^(\-?\d*)(\.\d+)?$/g.exec(sumExpectVal)){
//									if(getMonth == 0){
//										$("#editequip-totalDepreciatedValue").val(money(0));
//										$("#editequip-assetBal").val(money(iniValue - sumExpectVal));
//									}else{
//										var totalDepreciatedValue = (iniValue - sumExpectVal) / expectTime * getMonth;
//										if(totalDepreciatedValue < iniValue-sumExpectVal){ 
//											totalDepreciatedValue = money(totalDepreciatedValue);
//											$("#editequip-totalDepreciatedValue").val(totalDepreciatedValue);
//											$("#editequip-assetBal").val(money(iniValue - totalDepreciatedValue));
//										}else{  //如果累计折旧额大于等于原值减去净残值
//											$("#editequip-totalDepreciatedValue").val(money(iniValue-sumExpectVal));
//											$("#editequip-assetBal").val(money(sumExpectVal));
//										}
//									}
//								}else{
//									
//								}
//							}else{
//								
//							}
//						}else{
//							$("#editequip-totalDepreciatedValue").val("");
//							$("#editequip-assetBal").val("");
//						}
//					}else {
//						$("#editequip-endTime").val("");
//					}
//				}
//			}
//		});
//		
//		//购买日期
//		$("#editequip-purchaseDate").bind("valueChanged",function(){
//			var buyTime = $("#editequip-purchaseDate").val(); //购买日期
//			var startTime = $("#editequip-startTime").val(); //折旧开始日期
//			var iniValue = $("#editequip-iniValue").val(); //原值
//			var sumExpectVal = $("#editequip-sumExpectVal").val(); //净残值
//			var expectTime = $("#editequip-expectTime").val(); //折旧期间
//			var scrapValueRatio = $("#editequip-scrapValueRatio").val();//残值率
//			/*me.checked=$("#editequip-inlineRadio1").attr("checked");//判断是否折旧
//			if(me.checked=='checked'){*/
//				if(buyTime == ""){
//					$("#editequip-totalDepreciatedValue").val("");
//					$("#editequip-assetBal").val("");
//				}else{ //购买日期不为空
//					if(startTime == ""){
//						$("#editequip-totalDepreciatedValue").val("");
//						$("#editequip-assetBal").val("");
//					}else{ //折旧开始日期不为空
//						if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){ //原值是数字
//							if(/^(\-?\d*)(\.\d+)?$/g.exec(sumExpectVal)&&sumExpectVal>=0){ //净残值是数字
//								if(expectTime == "" || expectTime == 0){
//									$("#editequip-totalDepreciatedValue").val("");
//									$("#editequip-assetBal").val("");
//								}else{
//									var patrn = /^\d*$/;
//									if(patrn.exec(expectTime)){
//										var getMonth = me.judgeAndGetMonth();
//										console.log(getMonth);
//										if(getMonth ==0){
//											$("#editequip-totalDepreciatedValue").val(money(0));
//											$("#editequip-assetBal").val(money(iniValue - sumExpectVal));
//										}else{
//											totalDepreciatedValue = (iniValue - sumExpectVal) / expectTime * getMonth;
//											if(totalDepreciatedValue >= iniValue - sumExpectVal){ //如果累计折旧额大于等于原值减去净残值
//												totalDepreciatedValue = iniValue - sumExpectVal;
//											}
//											totalDepreciatedValue = money(totalDepreciatedValue);
//											$("#editequip-totalDepreciatedValue").val(totalDepreciatedValue);
//											$("#editequip-assetBal").val(money(iniValue - totalDepreciatedValue));
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
//			/*}else{ //选择否
//				console.log(scrapValueRatio);
//				if(scrapValueRatio==''){
//					$('#editequip-sumExpectVal').val('');
//					$('#editequip-assetBal').val('');
//				}else if(/^(\-?\d*)(\.\d+)?$/g.exec(scrapValueRatio)&&scrapValueRatio>=0&&scrapValueRatio<=100){
//					if(iniValue==''){
//						$('#editequip-sumExpectVal').val('');
//						$('#editequip-assetBal').val('');
//					}else if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){
//						$('#editequip-sumExpectVal').val(money(iniValue*scrapValueRatio/100));
//						$('#editequip-assetBal').val(money(iniValue-iniValue*scrapValueRatio/100));
//					}
//				}else{
//					$('#editequip-sumExpectVal').val('');
//					$('#editequip-assetBal').val('');
//				}
//			}*/
//			
//		});
		
		
		//金额添加小数点后两位
		$("#editequip-iniValue").bind("blur",function(){ //原值失去焦点
			var iniValue = $("#editequip-iniValue").val();
			if(iniValue == ""){
				
			}else{
				if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)) {
					iniValue = money(iniValue);
					$("#editequip-iniValue").val(iniValue);
				}else {
					
				}
			}
		});
		
		//判断输入的折旧开始日期是否合法,并返回getMonth。
		this.judgeAndGetMonth = function(){
			var getMonth;
			var date = new Date();
			var year = parseInt(date.getFullYear()); //当前年份
			var month = parseInt(date.getMonth());
			month = month + 1; //当前月份
			var day = date.getDate();//当前日
			var startTime = $("#editequip-startTime").val(); //折旧开始日期
			var buyTime = $("#editequip-purchaseDate").val(); // 购买日期
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
			var start = $("#editequip-startTime").jqxDateTimeInput('val');
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
			$("#editequip-endTime").val(year+"-"+month);
		};
		
		me.initValidator();
	};
	
	
	/**
	 * 初始化所有表单的校验
	 */
	this.initValidator = function(){
		var getCheck=function(){
			return $('#editequip-stop')[0].checked;
		}
		
		$("#editEquipmentPage").jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#editequip-assetRef', message: "不能为空", action: 'keyup, blur', rule:'required'},   
                { input: '#editequip-assetRef', message: "必须是数字或字母", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/[\u4E00-\u9FA5]/g.test(input.val())) return false;
                		return true;
	        	   	}  
                },
                { input: '#editequip-assetName', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#editequip-iniValue', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#editequip-iniValue', message: "必须是数字", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) return true;
                		return false;
	        	   	}  
                },
                { input: '#editequip-iniprice', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#editequip-iniprice', message: "必须是数字", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) return true;
                		return false;
	        	   	}  
                },
                { input: '#editequip-ininum', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#editequip-ininum', message: "必须是整数", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(parseInt(input.val()).toFixed(0)!==input.val()) return false;
						if(isNaN(input.val())||input.val()<0||input.val()=='') return false;
	        	   		return true;
	        	   	}  
                },
                { input: '#editequip-iniValue', message: "不能小于0", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val() < 0) return false;
                		return true;
	        	   	}  
                },
                { input: '#editequip-scrapValueRatio', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#editequip-scrapValueRatio', message: "必须是数字", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) {
                			return true;
                		}else {
                			$("#editequip-sumExpectVal").val("");
                			return false;
                		}
                	} 
                },
                { input: '#editequip-scrapValueRatio', message: "不能大于100", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val() > 100) return false;
                		return true;
                	} 
                },
                { input: '#editequip-scrapValueRatio', message: "不能小于0", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val() < 0) return false;
                		return true;
                	} 
                },
                { input: '#editequip-purchaseDate', message: "请选择", action: 'keyup, blur', 
                	rule:function(input,commit){
		        		if(input.val() === '') return false;
		        		return true;
	        	   	}  
                },
                { input: '#editequip-purchaseDate', message:'购买日期不能大于当前日期!',action:'blur,keyup',
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
                { input: '#editequip-coaDepreciate', message: "请选择", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val()==''||input.jqxComboBox('getSelectedItem')==null) return false;
                		return true;
	        	   	}  
                },
                { input: '#editequip-coaExpense', message: "输入不合法，请重新输入", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val()==''||input.jqxComboBox('getSelectedItem')==null) return false;
                		return true;
	        	   	}  
                },
                { input: '#editequip-startTime', message: "请选择", action: 'blur',
                	rule:function(input,commit){
                		if(getCheck()) return true;
                		/*var checked = $("#editequip-inlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			if(input.val() === "") return false;
                    		return true;
                		/*}else{
                			return true;
                		}*/
                	}
                },
                { input: '#editequip-startTime', message: "折旧开始日期不能小于购买日期", action: 'change,blur',
                	rule:function(input,commit){
                		if(getCheck()) return true;
                		/*var checked = $("#editequip-inlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			/*var purchaseDate = $("#editequip-purchaseDate").val(); //购买日期
                			var purchaseDateYear = purchaseDate.substring(0,4); 
                			var purchaseDateMonth = purchaseDate.substring(5,7);
                			var startTime = $("#editequip-startTime").val(); //折旧开始日期
                			var startTimeYear = startTime.substring(0,4);
                			var startTimeMonth = startTime.substring(5);
                			if(parseInt(startTimeYear) < parseInt(purchaseDateYear)){ //折旧开始年份小于购买年份
                    			return false;
                    		}else if(parseInt(startTimeMonth) < parseInt(purchaseDateMonth)){ //折旧开始年份大于等于购买年份，但折旧开始月份小于购买月份
                    			return false;
                    		}else{
                    			return true;
                    		}*/
                		if($('#editequip-purchaseDate').val()=='') return true;
                		if(input.val()<$('#editequip-purchaseDate').val().toString().substring(0,7)){
                			return false;
                		}
                		return true;	
                		/*}else{
                			return true;
                		}*/
                	}	
                },
                { input: '#editequip-startTime', message: "折旧重新开始日期不能小于上次停止折旧日期", action: 'change,blur',
                	rule:function(input,commit){
                		if(getCheck()) return true;
                		if(me.stop.time==null) return true;
                		if(input.val()<me.stop.time.toString().substring(0,7)){
                			return false;
                		}
                		return true;
                	}	
                },
                { input: '#editequip-expectTime', message: "不能为空", action: 'keyup,blur',
                	rule:function(input,commit){
                		if(getCheck()) return true;
                		/*var checked = $("#editequip-inlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			if(input.val() === "") return false;
                    		return true;
                		/*}else{
                			return true;
                		}*/
                	}
                },
                { input: '#editequip-expectTime', message: "必须是数字，且大于0", action: 'keyup,blur',
                	rule:function(input,commit){
                		if(getCheck()) return true;
                		/*var checked = $("#editequip-inlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                		
                			if(input.val() ==0){
                				return false;
                			}else{
                				
                			}
                			if(/^(\-?\d*)(\.\d+)?$/g.exec(input.val())) {
                				return true;
                			}else {
                				$("#editequip-assetMonth").val(0);
                				$("#editequip-endTime").val("");
                				return false;
                			}
                		/*}else{
                			return true;
                		}*/
                	}
                },
                { input: '#editequip-expectTime', message: "必须是整数", action: 'keyup, blur',
                	rule:function(input,commit){
                		if(getCheck()) return true;
                		/*var checked = $("#editequip-inlineRadio1").attr("checked");
                		if(checked == "checked"){*/
                			var patrn = /^\d*$/;
                			if(patrn.exec(input.val())){
                				return true;
                			}else{
                				return false;
                			}
                		/*}else{
                			return true;
                		}*/
                	}
                }
           ]
    	});
	}
	
	
	this.settings = {  
		source:{
	        datafields: [
	            { name: 'id', type: 'long' },
	            { name: 'name', type: 'string' },
	            { name: 'type', type: 'string' },
	            { name: 'unit', type: 'string' },
	            { name: 'createDate', type: 'date'}
	        ],
	        url: url+"/update",
	    },
		grid:{element:"EquiGrid"},
		ajax:{url:url},
	};
	
}

var EquipmenteditBssBindModle = function(equipmenteditBssMgt){
	var me = this;
	
	 /**
	 * 提交编辑固定资产
	 */
	 this.editEquipment = function(params){
		 if($("#editEquipmentPage").jqxValidator("validate")){
			 Core.AjaxRequest({
			   url : _global_settings.service.url+"/ac/"+new Base64().encode('tosys/coaReport/asset/update/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
	           type: "PUT",
	           async:false,
	           params:params,
	           showMsg:false,
	           callback: function(res) {
	        	   if(res == 0){
	        		   try{
	        			   setCloseAlertTimeOneSecond();
	        			   equipmenteditBssMgt.refreshDataInfo();
	    	        	   $.closeTab();
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
		 }
		 return false;
	 }
	 
	 /**
		 * 提交编辑固定资产前赋值
		 */
	 this.initEditEquParam = function(){
		var id = equipmenteditBssMgt.data.id;
		var assetRef = $("#editequip-assetRef").val();   //资产编码
		var purchaseDate = $("#editequip-purchaseDate").val();  //购买日期
		var name = $("#editequip-assetName").val();  //资产名称
		var iniValue = $("#editequip-iniValue").val();   //原值
		var totalDepreciatedValue = $("#editequip-totalDepreciatedValue").val(); //累计折旧额
		var assetBal = $("#editequip-assetBal").val();  //资产余额		
		var scrapValueRatio = $("#editequip-scrapValueRatio").val();   //残值率
		var sumExpectVal = $("#editequip-sumExpectVal").val();  //预计净残值
		var expectTime = $("#editequip-expectTime").val();  //预计折旧期间
		var assetMonth = $("#editequip-assetMonth").val();   //月折旧
		var startTime = $("#editequip-startTime").val();  // 折旧开始日期
		var endTime = $("#editequip-endTime").val();  //折旧结束日期
		var coaDepreciate; //累计折旧科目
		var coaExpense; //费用科目
		var startDepreciate; //是否开始折旧
		var depreciateMonth;//折旧期间
		var depreciateStartMonth; //开始折旧日期
		var depreciateEndMonth;//结束折旧日期
		var monthlyDepreciateValue; //月折旧
		var depreciatePauseMonth=null;
		
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
		var index = $("#editequip-coaDepreciate").jqxComboBox('getSelectedIndex');
		var item = $("#editequip-coaDepreciate").jqxComboBox('getItem',index);
		if(index == -1){//如果没有选择
			coaDepreciate = equipmenteditBssMgt.data.coaDepreciate.id;
		}else{
			coaDepreciate = item.value;
		}
		var eIndex = $("#editequip-coaExpense").jqxComboBox('getSelectedIndex');
		var eItem = $("#editequip-coaExpense").jqxComboBox('getItem',eIndex);
		if(eIndex == -1){ //如果没有选择
			coaExpense = equipmenteditBssMgt.data.coaExpense.id;
		}else{
			coaExpense = eItem.value;
		}
		/*var check = $("#editequip-inlineRadio1").attr("checked");
		if(check == "checked"){ //判断是否折旧
*/			startDepreciate =  0;
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
		var startDepreciate=undefined;
		if($('#editequip-stop')[0].checked==true){
			startDepreciate='pauseDepreciate';
			depreciateMonth=null;
			monthlyDepreciateValue=0;
			depreciateStartMonth=null;
			depreciateEndMonth=null;
			if(equipmenteditBssMgt.data.depreciatePauseMonth!=null)
			depreciatePauseMonth=equipmenteditBssMgt.data.depreciatePauseMonth;
		}/*else{
			//startDepreciate=$('#editequip-stop').val()=='stopDepreciate'?'stopDepreciate':'depreciate';
			startDepreciate='depreciate';
		}*/
		return {
			startDepreciate:startDepreciate,
			id:id,
			coaDepreciate:{id:coaDepreciate},
			coaExpense:{id:coaExpense},
			price:$('#editequip-iniprice').val(),
			qty:$('#editequip-ininum').val(),
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
			depreciatePauseMonth:depreciatePauseMonth,
			startDepreciate:startDepreciate
		};
	 }
	 
	//设置累计折旧和资产余额，点击否
	 this.setValue=function(){
		 var iniValue=$('#editequip-iniValue').val();
		 var sumExpectVal = $('#editequip-sumExpectVal').val();//预计净残值
		 $('#editequip-totalDepreciatedValue').val(money(0));
		 if(iniValue==''){
			 $('#editequip-assetBal').val('');
		 }else if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){
			 if(/^(\-?\d*)(\.\d+)?$/g.exec(sumExpectVal)&&sumExpectVal>=0){
				 $('#editequip-assetBal').val(money(iniValue-sumExpectVal));
			 }
		 }
	 }
	 
	 //设置累计折旧和资产余额，点击是
	 this.setTwoValue=function(){
		 var iniValue = $('#editequip-iniValue').val();//原值
		 var sumExpectVal = $('#editequip-sumExpectVal').val();//预计净残值
		 var expectTime = $('#editequip-expectTime').val();//折旧期间
		 var getMonth = equipmenteditBssMgt.judgeAndGetMonth();
		 console.log('Month:'+getMonth);
		 if(iniValue==''){
			 $('#editequip-totalDepreciatedValue').val('');
			 $('#editequip-assetBal').val('');
		 }else{
			 if(/^(\-?\d*)(\.\d+)?$/g.exec(iniValue)&&iniValue>=0){//原值是数字
				 if(sumExpectVal==''){
					 $('#editequip-totalDepreciatedValue').val('');
					 $('#editequip-assetBal').val('');
				 }else{
					 if(/^(\-?\d*)(\.\d+)?$/g.exec(sumExpectVal)&&sumExpectVal>=0){//预计净残值是数字
						 if(expectTime==''){
							 $('#editequip-totalDepreciatedValue').val('');
							 $('#editequip-assetBal').val('');
						 }else{
							 if(/^(\-?\d*)(\.\d+)?$/g.exec(expectTime)&&expectTime>=0){//折旧期间是数字
								 if(getMonth==0){
									 $('#editequip-totalDepreciatedValue').val(money(0));
									 $('#editequip-assetBal').val(money(iniValue-sumExpectVal));
								 }else{
									 var totalDepreciatedValue = (iniValue-sumExpectVal)/expectTime*getMonth;
									 if(totalDepreciatedValue>=iniValue){
										 $('#editequip-totalDepreciatedValue').val(money(iniValue-sumExpectVal));
										 $('#editequip-assetBal').val(money(sumExpectVal));
									 }else{
										 $('#editequip-totalDepreciatedValue').val(money(totalDepreciatedValue));
										 $('#editequip-assetBal').val(money(iniValue-totalDepreciatedValue));
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
		$('#editequip-stop').on('change',function(){
			//$("#editequip-dateshow_hide2").find('input').val('');
			equipmenteditBssMgt.setAllVal();
			//debugger;
			if($(this)[0].checked==true){
				//
				if(equipmenteditBssMgt.data.startDepreciate=='pauseDepreciate'){
					$('#editequip-totalDepreciatedValue').val(equipmenteditBssMgt.stop.sum);
				}
				$("#editequip-dateshow_hide2").css({display:"none"});				
			}else{
				$("#editequip-dateshow_hide2").css({display:"block"});
			}
		})
		
		
		//是
		$("#editequip-inlineRadio1").on({'click':function(){
			$("#editequip-dateshow_hide2").css({display:"block"});
			$("#editequip-inlineRadio1").attr("checked",true);
			$("#editequip-inlineRadio2").attr("checked",false);
			me.setTwoValue();
			console.log('first');
		}});
		//否
		$("#editequip-inlineRadio2").on({'click':function(){
			me.setValue();
			console.log('second');
			$("#editequip-dateshow_hide2").css({display:"none"});
			$("#editequip-inlineRadio1").attr("checked",false);
			$("#editequip-inlineRadio2").attr("checked",true);
		}});
		
		//点击按钮，保存编辑资产
		$("#editequip-button").on({"click":function(){
			me.editEquipment(me.initEditEquParam());
		}});
	}
	
	
	this.unbindAll = function(){
		$("#editequip-inlineRadio1").off('click');
		$("#editequip-inlineRadio2").off('click');
		$("#editequip-button").off('click');
	}
	
	
}