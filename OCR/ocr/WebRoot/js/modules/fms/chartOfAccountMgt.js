/**
 * 科目设置界面，组件UI类
 */
var ChartOfAccountMgt = function(){
	
	var me = this;
	
	var debug = false;
	
	var url = _global_settings.service.url+"/chartOfAccount";
	
	this.settings = {
			ajax:{url:url}
	};
	
	this.coaType = ["assetCOA","liabiliyCOA","ownershipCOA","costCOA","profitCOA"];
	
	this.initInput = function(){
		//5个bootstrap 风格tab的渲染
		$.each(me.coaType,function(i,v){
			me.initGrid(v,i+1);
			me.initWindows(v);
			me.initValidator(v);
		});
		me.initTabs();
		
		$.addTabCloseEvent();
	};
	
	this.initWindows = function(coaType){
		
		var debitCredit_key_value = [{value:"debit",label:"借"},{value:"credit",label:"贷"}];
		
		var enabled_key_value = [{value:true,label:"启用"},{value:false,label:"停用"}];
		
		var cloneOne = $("#addCoaWin").clone();
		cloneOne.attr("id",cloneOne.attr("id")+coaType).find("*").each(function(i,v){
			if($(this).attr("id")){
				$(this).attr("id",$(this).attr("id")+coaType);
			}
		});
		
		$("#addCoaWin").after(cloneOne);
		
		$("#addCoaWin"+coaType).jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			showCollapseButton: false,
			maxHeight: '100%', 
			maxWidth: '100%', 
			minHeight: 200, 
			minWidth: 200, 
			resizable:true,
			height: 460, 
			width: 800,
			cancelButton: $("#canceladdCoaBtn"+coaType),
			initContent:function(){
				$("#addCoa-debitCredit"+coaType).jqxDropDownList({width: '100%', height: 37, autoDropDownHeight: true, 
					placeHolder:'请选择',
					disabled:true,
     			    displayMember: "label", 
     			    valueMember: "value",
             	    source: debitCredit_key_value });
				
				$("#addCoa-enabled"+coaType).jqxDropDownList({width: '100%', height: 37, autoDropDownHeight: true, 
					placeHolder:'请选择',
					displayMember: "label", 
					valueMember: "value",
					source: enabled_key_value });
				
				$("#addCoa-ref"+coaType).input({width:'86%',height:37});
				$("#addCoa-name"+coaType).input({width:'86%',height:37});
//				$("#addCoa-iniValue"+coaType).input({width:'90%',height:37});
//				$("#addCoa-debitAmt"+coaType).input({width:'90%',height:37});
//				$("#addCoa-creditAmt"+coaType).input({width:'90%',height:37});
//				$("#addCoa-balance"+coaType).input({width:'90%',height:37,disabled:true});
				$("#addCoa-iniValue"+coaType).moneyinput({width:'90%',height:37,allowNull:false});
				$("#addCoa-debitAmt"+coaType).moneyinput({width:'90%',height:37,allowNull:false});
				$("#addCoa-creditAmt"+coaType).moneyinput({width:'90%',height:37,allowNull:false});
				$("#addCoa-balance"+coaType).moneyinput({width:'90%',height:37,disabled:true,allowNull:false}).attr('disabled','disabled');
				
			}
		}).on({
			"open":function(){
				var rowindex = $('#'+coaType+"Grid").jqxGrid('getselectedrowindex');
        	    if(rowindex >= 0){
        	    	var data = $('#'+coaType+"Grid").jqxGrid('getrowdata', rowindex);
        	    	
//        	    	console.log(data);
        	    	
        	    	$("#addCoa-level"+coaType).val(parseInt(data.level)+1);
        	    	$("#addCoa-debitCredit"+coaType).val(data.debitCredit);
        	    	$("#addCoa-parentId"+coaType).val(data.id);
        	    	$("#addCoa-coaClass"+coaType).val(data.coaClass);
        	    	$("#addCoa-name"+coaType).val(data.name+"-");
        	    	
        	    	if(eval(data.allowInput) == true){
        	    		$("#addCoa-iniValue"+coaType).val(data.iniValue);
        				$("#addCoa-debitAmt"+coaType).val(data.debitAmt);
        				$("#addCoa-creditAmt"+coaType).val(data.creditAmt);
        				$("#addCoa-balance"+coaType).val(data.balance);
        	    	}else{
        	    		$("#addCoa-iniValue"+coaType).val(0);
        				$("#addCoa-debitAmt"+coaType).val(0);
        				$("#addCoa-creditAmt"+coaType).val(0);
        				$("#addCoa-balance"+coaType).val(0);
        	    	}
        	    	
        	    	//找到该节点所有子节点，取子节点最大值+1
        	    	var dataAdapter = $("#"+coaType+"Grid").jqxGrid('source');
            		var records = dataAdapter.records;
            		var maxRef = data.ref,
            			_max = 0,
            			flag = false;
            		var len = data.ref.length;
            		
            		//查找节点最大值（01-95范围内），95以上不自动生成，由用户手动输入
            		for(var _in = 0; _in < records.length; _in++){
            			var record = records[_in];
            			
            			if(record.ref.indexOf(data.ref) === 0 && record.ref.length == len+2){
            				//将长度为len+2的提取出来
            				var _value = parseInt(record.ref.substring(len,len+2));
            				if(_max < _value && _value < 95){
            					_max = _value;
            					maxRef = record.ref;
            					flag = true;
            				}
            				
            				if(_value >=95){
            					console.log('break,value larger than 95:'+_value + ",_max:"+_max);
            					break;
            				}
            				
//            				var max = parseInt(maxRef);
//            				var _recordRef = parseInt(record.ref);
//            				if(max < _recordRef){
//	            				maxRef = record.ref;
//	            				flag = true;
//            				}
            			}
            		}
            		if(flag===false){
            			console.log('no maxRef');
            			maxRef = data.ref+"01";
            			$("#addCoa-name"+coaType).jqxInput('focus'); 
            		}else{
            			if(_max+1 >= 95){
            				console.log('bigger than 95:'+ (_max+1));
            				maxRef = maxRef.substring(0,len);
            				$("#addCoa-ref"+coaType).jqxInput('focus'); 
            			}else{
            				console.log('less than 95:'+ (_max+1));
            				maxRef = parseInt(maxRef)+1;
            				$("#addCoa-name"+coaType).jqxInput('focus'); 
            			}
            		}
        	    	$("#addCoa-ref"+coaType).val(maxRef);
        	    	$("#addCoa-parentRef"+coaType).val(data.ref);
        	    }
				$("#addCoa-coatype"+coaType).val(coaType);
				$("#addCoa-enabled"+coaType).val(true);
				
				$('#addCoaForm'+coaType).jqxValidator('hide');
				$('#addCoaForm'+coaType).find(".jqx-validator-error-label").text("");
			},
			"close":function(){
    	    	$("#addCoa-level"+coaType).val("");
    	    	$("#addCoa-coaClass"+coaType).val("");
    	    	
    	    	$("#addCoa-coatype"+coaType).val("");
    	    	$("#addCoa-parentId"+coaType).val("");
    	    	
				$("#addCoa-ref"+coaType).val("");
				$("#addCoa-name"+coaType).val("");
				$("#addCoa-enabled"+coaType).val(true);
				$("#addCoa-debitCredit"+coaType).val("");
				$("#addCoa-iniValue"+coaType).val(0);
				$("#addCoa-debitAmt"+coaType).val(0);
				$("#addCoa-creditAmt"+coaType).val(0);
				$("#addCoa-balance"+coaType).val(0);
				
				$("#addCoa-parentRef"+coaType).val("");
			}
		});
		
		
		var cloneEdit = $("#editCoaWin").clone();
		cloneEdit.attr("id",cloneEdit.attr("id")+coaType).find("*").each(function(i,v){
			if($(this).attr("id")!==undefined){
				$(this).attr("id",$(this).attr("id")+coaType);
			}
		});
		
		$("#editCoaWin").after(cloneEdit);
		
		$("#editCoaWin"+coaType).jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			showCollapseButton: false,
			maxHeight: '100%', 
			maxWidth: '100%', 
			minHeight: 200, 
			minWidth: 200, 
			resizable:true,
			height: 460, 
			width: 800,
			cancelButton: $("#canceleditCoaBtn"+coaType),
			initContent:function(){
				$("#editCoa-debitCredit"+coaType).jqxDropDownList({width: '90%', height: 37, autoDropDownHeight: true, 
					placeHolder:'请选择',
					disabled:true,
	     			displayMember: "label", 
	     			valueMember: "value",
	             	source: debitCredit_key_value });
				
				$("#editCoa-enabled"+coaType).jqxDropDownList({width: '90%', height: 37, autoDropDownHeight: true, 
					placeHolder:'请选择',
					displayMember: "label", 
					valueMember: "value",
					source: enabled_key_value });
				
				$("#editCoa-ref"+coaType).input({width:'85%',height:37});
				$("#editCoa-name"+coaType).input({width:'85%',height:37});
				$("#editCoa-iniValue"+coaType).input({width:'90%',height:37});
				$("#editCoa-debitAmt"+coaType).input({width:'90%',height:37});
				$("#editCoa-creditAmt"+coaType).input({width:'90%',height:37});
				$("#editCoa-balance"+coaType).input({width:'90%',height:37,disabled:true});
			}
		}).on({
			"open":function(){
				var rowindex = $('#'+coaType+"Grid").jqxGrid('getselectedrowindex');
        	    if(rowindex >= 0){
        	    	var data = $('#'+coaType+"Grid").jqxGrid('getrowdata', rowindex);
        	    	console.log(data);
        	    	$("#editCoa-id"+coaType).val(data.id);  //根据id编辑
        	    	if(data.id===undefined || data.id == null){
        	    		$("#editCoa-ref"+coaType).jqxInput("disabled",false);
        	    	}else{
        	    		$("#editCoa-ref"+coaType).jqxInput("disabled",true);
        	    	}
        	    	
        	    	$("#editCoa-level"+coaType).val(parseInt(data.level));
        	    	$("#editCoa-coaClass"+coaType).val(data.coaClass);
        	    	
        	    	$("#editCoa-coatype"+coaType).val(coaType);
        	    	
        	    	if(data.pid!== undefined){
        	    		$("#editCoa-parentId"+coaType).val(data.pid);
        	    	}
        	    	if(data.parentId !== undefined){
        	    		$("#editCoa-parentId"+coaType).val(data.parentId);
        	    	}
        	    	
    				$("#editCoa-ref"+coaType).val(data.ref);
    				$("#editCoa-name"+coaType).val(data.name);
    				if(parseInt(data.level)==1){
    					$("#editCoa-name"+coaType).jqxInput('disabled',true);
    					$("#editCoa-iniValue"+coaType).jqxInput('focus'); 
    				}else{
    					$("#editCoa-name"+coaType).jqxInput('disabled',false);
    					$("#editCoa-iniValue"+coaType).jqxInput('focus');
    				}
    				if(eval(data.allowInput) == false){
    					$('#edit-tips'+coaType).html('  (该科目存在子科目，取值为系统自动计算其所有子科目总和，不可编辑。)');
    					$("#editCoa-iniValue"+coaType).jqxInput('disabled',true);
    					$("#editCoa-debitAmt"+coaType).jqxInput('disabled',true);
    					$("#editCoa-creditAmt"+coaType).jqxInput('disabled',true);
    					$("#editCoa-balance"+coaType).jqxInput('disabled',true);
    				}else{
    					$('#edit-tips'+coaType).html('');
    					$("#editCoa-iniValue"+coaType).jqxInput('disabled',false);
    					$("#editCoa-debitAmt"+coaType).jqxInput('disabled',false);
    					$("#editCoa-creditAmt"+coaType).jqxInput('disabled',false);
    					$("#editCoa-balance"+coaType).jqxInput('disabled',false);
    				}
    				$("#editCoa-enabled"+coaType).val(data.enabled);
    				$("#editCoa-debitCredit"+coaType).val(data.debitCredit);
    				$("#editCoa-iniValue"+coaType).val(data.iniValue);
    				$("#editCoa-debitAmt"+coaType).val(data.debitAmt);
    				$("#editCoa-creditAmt"+coaType).val(data.creditAmt);
    				$("#editCoa-balance"+coaType).val(data.balance);
    				$("#editCoa-oldRef"+coaType).val(data.ref);
    				$("#editCoa-parentRef"+coaType).val(data.parentRef);
        	    }else{
        	    	Core.alert({message:"请选择一项！"});
        	    	$("#editCoaWin"+coaType).jqxWindow("close");
        	    }
        	    
        	    $('#editCoaForm'+coaType).jqxValidator('hide');
				$('#editCoaForm'+coaType).find(".jqx-validator-error-label").text("");
			},
			"close":function(){
				$("#editCoa-id"+coaType).val(null);  //根据id编辑
    	    	
    	    	$("#editCoa-level"+coaType).val("");
    	    	$("#editCoa-coaClass"+coaType).val("");
    	    	
    	    	$("#editCoa-coatype"+coaType).val("");
    	    	$("#editCoa-parentId"+coaType).val("");
    	    	
				$("#editCoa-ref"+coaType).val("");
				$("#editCoa-name"+coaType).val("");
				$("#editCoa-enabled"+coaType).val(true);
				$("#editCoa-debitCredit"+coaType).val("");
				$("#editCoa-iniValue"+coaType).val(0);
				$("#editCoa-debitAmt"+coaType).val(0);
				$("#editCoa-creditAmt"+coaType).val(0);
				$("#editCoa-balance"+coaType).val(0);
				$("#editCoa-oldRef"+coaType).val("");
				$("#editCoa-parentRef"+coaType).val("");
			}
		});
	};
	
	this.initTabs = function(){
		$('#chartOfAccountTab a').click(function (e) {
	    	  e.preventDefault();
	    	  
	    	  var ind = $( ".indicator" );
	    	  var href = $(this).attr("href");
	    	  if(href == "#900-1"){
	    		  $( ".indicator" ).animate({ left: "0%",right:"80%"}, "slow" );
	    		  me.searchDataInfo("assetCOAGrid");
	    	  }
	    	  if(href == "#900-2"){
	    		  $( ".indicator" ).animate({ left: "20%",right:"60%"}, "slow" );
	    		  me.searchDataInfo("liabiliyCOAGrid");
	    	  }
	    	  if(href == "#900-3"){
	    		  $( ".indicator" ).animate({ left: "40%",right:"40%"}, "slow" );
	    		  me.searchDataInfo("ownershipCOAGrid");
	    	  }
	    	  if(href == "#900-4"){
	    		  $( ".indicator" ).animate({ left: "60%",right:"20%"}, "slow" );
	    		  me.searchDataInfo("costCOAGrid");
	    	  }
	    	  if(href == "#900-5"){
	    		  $( ".indicator" ).animate({ left: "80%",right:"0%"}, "slow" );
	    		  me.searchDataInfo("profitCOAGrid");
	    	  }
	    	  $(this).tab('show');
	    	  
	    });
	};
	
	/**
	 * 对科目进行设置
	 * 1、对每一项进行是否是父节点判断
	 * 2、向上累加父节点的各值
	 * 3、如果传递了_editedRow，使用新值进行计算
	 * 4、父对象被停用，所有子对象也必须被停用
	 */
	this.generateCoa = function(records, _editedRow,hardCode){
		console.time('计算时间');
		/**
		 * 累加各个值
		 */
		var _hardCode='';
		var len=records.length;
		var accumulation = function(record){
			_hardCode=hardCode==null?'':hardCode.substring(0,record.hardCode.length);
			var flag = true;
			var iniValue=0,debitAmt=0,creditAmt=0,balance=0;
			
			var childrenlen=0,ischildren=false;
			
			for(var i=0;i<len;i++){
				
				var r = records[i];
				
				if(r.ref == record.ref){//不跟自己比较
					continue;
				}else{
					if(r.ref.indexOf(record.ref)===0){	
						//debugger
						records[i] = accumulation(r);//累加子节点
						if(_editedRow == undefined){
							
						}else if(r.ref == _editedRow.ref){
							r = _editedRow;
						}
						if(r.ref.length == record.ref.length+2 && eval(r.enabled)==true){
							//累加各值
							iniValue += parseFloat(r.iniValue);
							debitAmt += parseFloat(r.debitAmt);
							creditAmt += parseFloat(r.creditAmt);
							balance += parseFloat(r.balance);
						}
						flag = false;
					}
				}
			}
			
			if(record.allowInput!=flag){
				record.submitFlag = true;
			}
			
			record.allowInput = flag;
			
			if(record.allowInput==false){
				if(record.iniValue != iniValue 
						|| record.debitAmt != debitAmt 
						|| record.creditAmt != creditAmt 
						|| record.balance != balance)
					record.submitFlag = true;
				record.iniValue = iniValue;
				record.debitAmt = debitAmt;
				record.creditAmt = creditAmt;
				record.balance = balance;
			}
//			if(record.hardCode.indexOf('1001')>-1)
//			console.log('_hardCode:'+_hardCode+' record.hardCode:'+record.hardCode);
			//此处应该有bug
			if(_hardCode==record.hardCode){
				//debugger
				record.submitFlag = true;
				record.iniValue = 0;
				record.debitAmt = 0;
				record.creditAmt = 0;
				record.balance = 0;
			}
			return record;
		};
		
		for(var i=0;i<len;i++){
			var record = records[i];
			if(record.level==1){
				records[i] = accumulation(record);
			}
		}
		console.timeEnd('计算时间');
		return records;
	};
	
	
	//科目启停
	this.disableChildren=function(record,records,el){
		if(record.enabled==false||record.enabled=='false'){
    		for(var i=0;i<records.length;i++){
	        	var r = records[i];
				if(r.ref == record.ref){//不跟自己比较
					records[i].submitFlag = true;
					continue;
				}else if(record.ref.indexOf(r.ref)===0&&r.enabled.toString()=='false'){
					return false;
				}else if(r.ref.indexOf(record.ref)===0){
						records[i].enabled = false;
						records[i].submitFlag = true;
				}
        	}
    	}else{
    		for(var i=0;i<records.length;i++){
	        	var r = records[i];
				if(r.ref == record.ref){//不跟自己比较
					records[i].submitFlag = true;
					continue;
				}else if(record.ref.indexOf(r.ref)===0&&r.enabled.toString()=='false'){
					return false;
				}else if(r.ref.indexOf(record.ref)===0){
						records[i].enabled = true;
						records[i].submitFlag = true;
				}
        	}
    	}
		//$("#"+el+"Grid").jqxGrid('refreshdata'); 
		//$("#"+el+"Grid").jqxGrid('refresh');
	}
	
	this.initGrid = function(el,coaClass){
		// prepare the data
		var source =
		{
		 	dataType: "json",
			id: 'ref',
			type:'GET',
		   	url:url+"/class/"+coaClass+"/"+currentUserInfo.id,
		   	deleterow: function (rowid, commit) {
                commit(true);
            },
		};
		             
		var dataAdapter = new $.jqx.dataAdapter(source,{
			beforeLoadComplete: function (records) {
				$.each(records,function(i,v){
		    		if(v.debitCredit =="debit"){
		    				v.debitCreditLabel = "借";
		    		} else if(v.debitCredit == "credit"){
			            	v.debitCreditLabel = "贷";
		    		} else {
			           	v.debitCreditLabel = "unknown";
			        }
		    		
		    		v.iniValue = (v.iniValue===undefined||v.iniValue==null?0:v.iniValue);
		    		v.debitAmt = (v.debitAmt===undefined||v.debitAmt==null?0:v.debitAmt);
		    		v.creditAmt = (v.creditAmt===undefined||v.creditAmt==null?0:v.creditAmt);
		    		v.balance = (v.balance===undefined||v.balance==null?0:v.balance);
				});
				
				return records;
//		    	return me.generateCoa(records);
			}
		});
		
		var cellbeginedit = function (row, datafield, columntype, value) {
			
			var rowData = $('#'+el+"Grid").jqxGrid('getrowdata', row);
			var rowDatas = $('#'+el+"Grid").jqxGrid('getrows');
			
			var bool=me.disableChildren(rowData,rowDatas);
			console.log(bool);
			//debugger;
			if(bool==false) {
				return false;
			}
			
			console.log('cellbeginedit');
			if(value == null) return false;
			
			if(datafield == 'enabled'){
				var iniValue = parseFloat(rowData.iniValue);
	        	var debitAmt = parseFloat(rowData.debitAmt);
	        	var creditAmt = parseFloat(rowData.creditAmt);
	        	var balance = parseFloat(rowData.balance);
	        	if(iniValue==0 &&debitAmt==0 &&creditAmt==0 &&balance==0) {
	        		console.log('enabled 可以修改');
					return true;
				}else{
					console.log('enabled 不可修改');
					return false;
				}
			}
			
			if(rowData.enabled == false){//停用的不可被修改
				return false;
			}
			
            return rowData.allowInput;
        };
        
        /**
         * 期初值、累计借贷值变化事件
         */
        var cellvaluechanging= function (row, datafield, columntype, oldvalue, newvalue) {
        	
        	console.log('cellvaluechanging  start');
        	
        	if(newvalue===undefined || newvalue == null){
        		newvalue = 0;
        	}
        	
        	if(isNaN(parseFloat(newvalue)) || !isFinite(newvalue)){
        		newvalue = 0;
        	}
        	
        	if(newvalue == '') newvalue=0;
        	
        	console.log(datafield+"--"+columntype+'---'+oldvalue+'--'+newvalue);
        	
        	var rowData = $('#'+el+"Grid").jqxGrid('getrowdata', row);
        	
        	var iniValue = datafield=='iniValue'?parseFloat(newvalue):parseFloat(rowData.iniValue);
        	var debitAmt = datafield=='debitAmt'?parseFloat(newvalue):parseFloat(rowData.debitAmt);
        	var creditAmt = datafield=='creditAmt'?parseFloat(newvalue):parseFloat(rowData.creditAmt);
        	
        	console.log(iniValue+"--"+debitAmt+'---'+creditAmt);
        	
        	if(rowData.debitCredit == "debit"){
				rowData.balance = iniValue - debitAmt + creditAmt;
			}
			if(rowData.debitCredit == "credit"){
				rowData.balance = iniValue + debitAmt - creditAmt;
			}
			if(newvalue != oldvalue){
				rowData.submitFlag = true;
			}
			console.log('new:'+newvalue+"--old:"+oldvalue);
			console.log('cellvaluechanging  end');
            return newvalue;
        };
        
        /**
         * 启停值变化事件
         */
        var enabledchanging = function(row, datafield, columntype, oldvalue, newvalue){
        	console.log('enabled changing start');
        	var rowData = $('#'+el+"Grid").jqxGrid('getrowdata', row);
        	var iniValue = parseFloat(rowData.iniValue);
        	var debitAmt = parseFloat(rowData.debitAmt);
        	var creditAmt = parseFloat(rowData.creditAmt);
        	var balance = parseFloat(rowData.balance);
        	setTimeout(function(){
        		$("#"+el+"Grid").jqxGrid('refresh');
        	},100);
        	
        	if(eval(newvalue)==false){
				if(iniValue==0 &&debitAmt==0 &&creditAmt==0 &&balance==0) {
					console.log('enabled changing 1 end');
					return newvalue;
				}else{
					console.log('enabled changing 2 end');
					return oldvalue;
				}
			}else{
				console.log('enabled changing 3 end');
				return newvalue;
			}
        };
        
        var enabledValidation = function (cell, value) {
        	console.log(cell);
        	console.log(value);
            return true;
        };
        
        var validation = function (cell, value) {
        	console.log('validation'+value);
        	
//        	if(value===undefined || value == null){
//        		return { result: false, message: "输入非法！" };;
//        	}
//        	value = value.replace(/^\s+|\s+$/g,'');
//        	
//        	if(value == '') return { result: false, message: "不能为空" };
//        	
        	if(!isNaN(parseFloat(value)) && isFinite(value)){
        		return true;
        	}else{
        		return { result: false, message: "输入非法！" };
        	}
        };
        
//        var cellendedit = function (row, datafield, columntype, oldvalue, newvalue) {
//        	var records = $("#"+el+"Grid").jqxGrid('source').records;
//            $("#"+el+"Grid").jqxGrid('source').records = me.generateCoa(records);
//            me.searchDataInfo(el+"Grid");
//            return true;
//        }
        
        var editable=true;
        editable=el==='profitCOA'?false:true;
		             
		$("#"+el+"Grid").jqxGrid({
			width: "100%",
		    theme:currentTheme,
		    source: dataAdapter,
		    columnsresize: true,
		    columnsheight: 40,
		    rowsheight:40,
		    autoheight: true,
		    localization: gridLocalizationObj,
		    enablebrowserselection:true,
		   	pageable:false,
		   	editable:true,
		   	editmode: 'dblclick',
//		    altrows:true,
		    selectionmode: "singlerow",
		    columns: [
//		        { text: 'id', dataField: 'id', width: 200 },
		    	{ text: '科目编码', datafield: 'ref', width: "10%", editable:false },
		     	{ text: '科目名称', datafield: 'name', width: "30%", editable:false },
		     	{ text: '方向', datafield: 'debitCreditLabel', width: "5%", editable:false},
		      	{ text: '期初值', datafield: 'iniValue', width: "10%",cellsformat: 'c2',cellsalign: 'right', editable:editable,cellbeginedit:cellbeginedit,cellvaluechanging:cellvaluechanging },
		      	{ text: '本年累计借方', datafield:'debitAmt',width: "10%",cellsformat: 'c2',cellsalign: 'right', editable:true,cellbeginedit:cellbeginedit,cellvaluechanging:cellvaluechanging },
		     	{ text: '本年累计贷方', datafield:'creditAmt',width: "10%",cellsformat: 'c2',cellsalign: 'right', editable:true,cellbeginedit:cellbeginedit,cellvaluechanging:cellvaluechanging },
		     	{ text: '年初余额',  datafield:'balance',width: "10%",cellsformat: 'c2',cellsalign: 'right',editable:false },
		     	{ text: '是否启用', datafield:'enabled',width: "8%",columntype:'checkbox',cellbeginedit:cellbeginedit,cellvaluechanging:enabledchanging },//editable:false,
		    	{ text: '操作', width: "7%",
		        	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	    	  	    	var rtStr = '<div class=\"jqx-grid-cell-left-align\" style=\"margin-top:6px\">';
	    	  	    	if(rowdata.level<4){
	    	  	    		rtStr += '<a class="addCOA md-add-circle" title="添加子科目" ></a>';
	    	  	    	}
	    	  	    	rtStr += '<a class="editCOA md-rate-review" title="编辑" ></a>';
	    	  	    	//debugger
	    	  	    	if(eval(rowdata.delFlag) === true||(rowdata.allowInput==true&&rowdata.level!=1)){
	    	  	    		rtStr += '<a class="deleteCOA  md-cancel" title="删除" ></a>';
	    	  	    	}
	    	  	     	
	    	  	      	rtStr += '</div>';
	    	  	        return rtStr;
		        	}   
		    	}
		      ]
		                 
		});
		
        $("#"+el+"Grid").on('cellendedit', function (event) {
        	// event arguments.
            var args = event.args;
            // column data field.
            var datafield = event.args.datafield;
            
//            if(datafield == 'enabled') return false;
            // row's bound index.
            var rowBoundIndex = event.args.rowindex;
            // cell value
            var newvalue = args.value;
            // row's data.
            var rowData = args.row;
            console.log("cellendedit---");
            
            var newRowData = $.extend(true,{},rowData);
            console.log(newRowData);
            newRowData.iniValue = datafield=='iniValue'?newvalue:rowData.iniValue;
            newRowData.debitAmt = datafield=='debitAmt'?newvalue:rowData.debitAmt;
            newRowData.creditAmt = datafield=='creditAmt'?newvalue:rowData.creditAmt;
            newRowData.enabled = datafield=='enabled'?newvalue:rowData.enabled;
            console.log(newRowData);
            
//            if(datafield != 'enabled' && rowData.enalbed ==false) {
//            	//被禁用的不需要执行
//            	return false;
//            }
//            
//            
            var records = $("#"+el+"Grid").jqxGrid('source').records;
            $("#"+el+"Grid").jqxGrid('source').records = me.generateCoa(records,newRowData);
        });
        
        $("#"+el+"Grid").on('cellendedit',function(event){
        	var record = event.args.row;
        	var records = $("#"+el+"Grid").jqxGrid('source').records;
        	me.disableChildren(record,records,el);
        	
        	
        	
        })
		             
		$("#"+el+"Grid").on("click",".addCOA",function(){
		 	var screenWidth = $(window).width();
		    var screenHeight = $(window).height();
		    var scrolltop = $(document).scrollTop();
		    var objLeft = (screenWidth - $("#addCoaWin"+el).width())/2 ;
		    var objTop = (screenHeight - $("#addCoaWin"+el).height())/2 + scrolltop;
		    $("#addCoaWin"+el).jqxWindow({ position: { x: objLeft, y: objTop}});
		    $("#addCoaWin"+el).jqxWindow("open");
		    $('#addCoaForm'+el).jqxValidator('hide');
			$('#addCoaForm'+el).find(".jqx-validator-error-label").text("");
		});
		
		             
		$("#"+el+"Grid").on("click",".editCOA",function(event){
			/*var selectedrowindex = $("#"+el+"Grid").jqxGrid('getselectedrowindex');
			var level = $("#"+el+"Grid").jqxGrid('getrowdata', selectedrowindex).level;
			if(level==1){
				Core.alert({message:'该科目为父科目，取值为系统自动计算其所有子科目总和,不可编辑！'});
				return false;
			}*/
			var screenWidth = $(window).width();
			var screenHeight = $(window).height();
		  	var scrolltop = $(document).scrollTop();
		 	var objLeft = (screenWidth - $("#editCoaWin"+el).width())/2 ;
			var objTop = (screenHeight - $("#editCoaWin"+el).height())/2 + scrolltop;
			$("#editCoaWin"+el).jqxWindow({ position: { x: objLeft, y: objTop }});
		    $("#editCoaWin"+el).jqxWindow("open");
		    $('#editCoaForm'+el).jqxValidator('hide');
			$('#editCoaForm'+el).find(".jqx-validator-error-label").text("");
		});
		
		$("#"+el+"Grid").on("click",".deleteCOA",function(){
			
			
			var selectedrowindex = $("#"+el+"Grid").jqxGrid('getselectedrowindex');
            var rowscount = $("#"+el+"Grid").jqxGrid('getdatainformation').rowscount;
            if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                var id = $("#"+el+"Grid").jqxGrid('getrowid', selectedrowindex);
                
                var data = $("#"+el+"Grid").jqxGrid('getrowdatabyid', id);
                               
                if(data.id==null){
                	Core.confirm({
    					message:"确定要删除吗？",
    					confirmCallback:function(){
    						var commit = $("#"+el+"Grid").jqxGrid('deleterow', id);
    						//timeOut(delChildren,0)
    	        			delChildren(id);
    					}
                	})
        		}else{
        			Core.confirm({
    					message:"确定要删除吗？",
    					confirmCallback:function(){
    						Core.AjaxRequest({
    	        				type:"DELETE",
    	        				//showMsg:false,
    	        				async:false,
    	        				//url:url+"/accountPeriod/getPeriodByMonth/"+$('#acpd-datetime').val(),
    	        				url:_global_settings.service.url+'/chartOfAccount/'+data.id+"/"+currentUserInfo.id,
    	        				callback:function(res){
    	        					var commit = $("#"+el+"Grid").jqxGrid('deleterow', id);
    	        					//timeOut(delChildren,0)
    	        					delChildren(id);
    	        				},
    	        				failure:function(res){
    	        					
    	        				}
    	        			});
    					}
    				});
        		}
                
                //删除子节点
                function delChildren(id){                
                    var records = $("#"+el+"Grid").jqxGrid('source').records;
                    var oldRecords = $.extend(true,[],records);
                    var bdhardCode='';
                    $.each(oldRecords,function(i,v){
                    	
                    	if(data.ref == v.ref){
                    		
                    	}else if(v.ref.indexOf(data.ref)===0){
                    		 var commit = $("#"+el+"Grid").jqxGrid('deleterow', v.uid);
                    	}
                    });
                    delete oldRecords;
                    
                    $("#"+el+"Grid").jqxGrid('source').records = me.generateCoa($("#"+el+"Grid").jqxGrid('source').records,null,id);
    			}
                
                
            }
		});
		             
	};
	
	/**
	 * 初始化所有表单的校验
	 */
	this.initValidator = function(coaType){
		
		var validateMoney = function(input,commit,addOrEdit){
			
			var v = input.val();
			
			var debitCredit = $("#"+addOrEdit+"Coa-debitCredit"+coaType).val();
			var iniValue = parseFloat($("#"+addOrEdit+"Coa-iniValue"+coaType).val());
			var debitAmt = parseFloat($("#"+addOrEdit+"Coa-debitAmt"+coaType).val());
			var creditAmt = parseFloat($("#"+addOrEdit+"Coa-creditAmt"+coaType).val());
			
			if(!isNaN(parseFloat(v)) && isFinite(v)){
				if(debitCredit == "debit"){
					$("#"+addOrEdit+"Coa-balance"+coaType).val(money(iniValue-debitAmt+creditAmt));
					return true;
				}
				if(debitCredit == "credit"){
					$("#"+addOrEdit+"Coa-balance"+coaType).val(money(iniValue-creditAmt+debitAmt));
					return true;
				}
			}else{
				return false;
			}
		};
		
		var validateDuplicateRef = function(input,commit,addOrEdit){
			
			var validate = function(input,commit,oldRef){
				var dataAdapter = $("#"+coaType+"Grid").jqxGrid('source');
	    		var records = dataAdapter.records;
	    		var duplicated = false;
	    		var v = input.val();
	    		var count = 0;
	    		for(var _in = 0; _in<records.length;_in++){
	    			var r = records[_in];
		    		if(v == r.ref ){
		    			count++;
		    		}
	    		}
	    		if(oldRef == v){
    				count--;
    			}
	    		return count==0;
			};
			
			if(addOrEdit===undefined){
				return validate(input,commit);
			}
			
			if(addOrEdit === true ){
				var eid = $("#editCoa-id"+coaType).val();
				if(eid==null || eid==""){
					var oldRef = $("#editCoa-oldRef"+coaType).val();
					return validate(input,commit,oldRef);
				}
			}
			return true;
		};
		
		var validateRef = function(input,commit,addOrEdit){
			var value = input.val();
			if(IsPositiveInteger(input,commit)==true){//整数
				var level = parseInt($("#addCoa-level"+coaType).val());
				if(addOrEdit === true){
					level = parseInt($("#editCoa-level"+coaType).val());
				}
				var length = level*2+2;
				if(value.length!=length){//长度必须是
//					console.log('length is not '+length+ "--"+value.length+"--"+value+"-"+level);
					return false;
				}else{
					var parentRef = $("#addCoa-parentRef"+coaType).val();
					if(addOrEdit === true){
						parentRef = $("#editCoa-parentRef"+coaType).val();
					}
					if(value.indexOf(parentRef) === 0){//必须是父ref开头
						return true;
					}else{
//						console.log('not start with parentRef --' +parentRef);
						return false;
					}
				}
			}else{
				console.log('not positive integer');
				return false;
			}
		};
		
		$("#addCoaForm"+coaType).jqxValidator({
    		animationDuration: 1,
    		hintType: 'label',
            rules: [
				{ input: "#addCoa-ref"+coaType, message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: "#addCoa-ref"+coaType, message: "科目编码格式不符", action: 'keyup, blur', rule: validateRef },
				{ input: "#addCoa-ref"+coaType, message: "科目编码已存在", action: 'keyup, blur', rule: validateDuplicateRef },
				{ input: '#addCoa-name'+coaType, message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#addCoa-debitCredit'+coaType, message: "请选择", action: 'change', 
					rule: function(input,commit){
			    		if(input.val() === '') return false;
				   		return true;
						} 
				},
				{ input: '#addCoa-enabled'+coaType, message: "请选择", action: 'change', 
					rule: function(input,commit){
			    		if(input.val() === '') return false;
				   		return true;
					}
				},
				{ input: '#addCoa-enabled'+coaType, message: "不可停用", action: 'change', 
					rule: function(input,commit){
						var iniValue = parseFloat($("#addCoa-iniValue"+coaType).val());
						var debitAmt = parseFloat($("#addCoa-debitAmt"+coaType).val());
						var creditAmt = parseFloat($("#addCoa-creditAmt"+coaType).val());
						var balance = parseFloat($("#addCoa-balance"+coaType).val());
						if(eval(input.val())==false){
							if(iniValue==0 &&debitAmt==0 &&creditAmt==0 &&balance==0) {
								return true;
							}else{
								return false
							}
						}else{
							return true;
						}
					}
				},
				{ input: '#addCoa-iniValue'+coaType, message: "必须是数字", action: 'keyup, blur', rule: function(input,commit){
					return validateMoney(input,commit,"add");
				} },
				{ input: '#addCoa-debitAmt'+coaType, message: "必须是数字", action: 'keyup, blur', 
					rule: function(input,commit){
						return validateMoney(input,commit,"add");
					} 
				},
				{ input: '#addCoa-creditAmt'+coaType, message: "必须是数字", action: 'keyup, blur', 
					rule: function(input,commit){
						return validateMoney(input,commit,"add");
					} 
				}
//				{ input: '#addCoa-balance'+coaType, message: "不能为空", action: 'keyup, blur', 
//					rule: function(input,commit){
//						return validateMoney(input,commit);
//					} 
//				}
			]
    	});
		
		$("#editCoaForm"+coaType).jqxValidator({
			animationDuration: 1,
			hintType: 'label',
			rules: [
				{ input: "#editCoa-ref"+coaType, message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: "#editCoa-ref"+coaType, message: "科目编码格式不符", action: 'keyup, blur', 
					rule: function(input,commit){ return validateRef(input,commit,true); }
				},
				{ input: "#editCoa-ref"+coaType, message: "科目编码已存在", action: 'keyup, blur', 
					rule: function(input,commit){ return validateDuplicateRef(input,commit,true); } 
				},
				{ input: '#editCoa-name'+coaType, message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#editCoa-debitCredit'+coaType, message: "请选择", action: 'change', 
					rule: function(input,commit){
			    		if(input.val() === '') return false;
				   		return true;
						}
				},
				{ input: '#editCoa-enabled'+coaType, message: "请选择", action: 'change', 
					rule: function(input,commit){
			    		if(input.val() === '') return false;
				   		return true;
					}
				},
				{ input: '#editCoa-enabled'+coaType, message: "不可停用", action: 'change', 
					rule: function(input,commit){
						var iniValue = parseFloat($("#editCoa-iniValue"+coaType).val());
						var debitAmt = parseFloat($("#editCoa-debitAmt"+coaType).val());
						var creditAmt = parseFloat($("#editCoa-creditAmt"+coaType).val());
						var balance = parseFloat($("#editCoa-balance"+coaType).val());
						if(eval(input.val())==false){
							if(iniValue==0 &&debitAmt==0 &&creditAmt==0 &&balance==0) {
								return true;
							}else{
								return false
							}
						}else{
							return true;
						}
					}
				},
				{ input: '#editCoa-iniValue'+coaType, message: "必须是数字", action: 'keyup, blur',
					rule: function(input,commit){
						return validateMoney(input,commit,"edit");
					} 	
				},
				{ input: '#editCoa-debitAmt'+coaType, message: "必须是数字", action: 'keyup, blur', 
					rule: function(input,commit){
						return validateMoney(input,commit,"edit");
					} 
				},
				{ input: '#editCoa-creditAmt'+coaType, message: "必须是数字", action: 'keyup, blur', 
					rule: function(input,commit){
						return validateMoney(input,commit,"edit");
					} 
				}
//				{ input: '#editCoa-balance'+coaType, message: "不能为空", action: 'keyup, blur', 
//					rule: function(input,commit){
//						return validateMoney(input,commit,"edit");
//					} 
//				}
			    ]
		});
	};
	/**
	 * 查询列表数据
	 */
    this.searchDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('refreshdata'); 
    	$("#"+el).jqxGrid('refresh'); 
//    	$("#"+el).jqxGrid('clearSelection');
    };
    
    /**
     * 刷新
     */
    this.refreshDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('updateBoundData');
    	$("#"+el).jqxGrid('clearSelection');
    	$('#'+el).jqxGrid('refreshdata');
    };
	
};

/**
 * 
 * 科目设置界面，组件事件绑定类
 */
var ChartOfAccountBindModle = function(chartOfAccountMgt){
	
	var me = this;

    this.add = function(coaType){
    	if($("#addCoaForm"+coaType).jqxValidator("validate")){
    		
    		var debitCredit = $("#addCoa-debitCredit"+coaType).val();
    		
    		var debitCreditLabel = null;
    		if(debitCredit =="debit"){
				debitCreditLabel = "借";
			} else if(debitCredit == "credit"){
	            debitCreditLabel = "贷";
			} else {
	           	debitCreditLabel = "unknown";
	        }
    		
    		var datarow = {
    			parentId:$("#addCoa-parentId"+coaType).val()==""?null:$("#addCoa-parentId"+coaType).val(),
    			ref:$("#addCoa-ref"+coaType).val(),
    			coaClass:$("#addCoa-coaClass"+coaType).val(),
    			name:$("#addCoa-name"+coaType).val(),
    			debitCredit:debitCredit,
    			debitCreditLabel:debitCreditLabel,
    			iniValue:$("#addCoa-iniValue"+coaType).val(),
    			debitAmt:$("#addCoa-debitAmt"+coaType).val(),
    			creditAmt:$("#addCoa-creditAmt"+coaType).val(),
    			balance:$("#addCoa-balance"+coaType).val(),
    			level:$("#addCoa-level"+coaType).val(),
    			enabled:$("#addCoa-enabled"+coaType).val(),
    			hardCode:$("#addCoa-ref"+coaType).val(),
    			submitFlag:true,
    			parentRef:$("#addCoa-parentRef"+coaType).val()==""?null:$("#addCoa-parentRef"+coaType).val(),
    			delFlag:true
    		};
    		
    		var dataAdapter = $("#"+coaType+"Grid").jqxGrid('source');
    		var records = dataAdapter.records;
    		var selectedrowindex = $("#"+coaType+"Grid").jqxGrid('getselectedrowindex');
    		
    		//查找插入的索引位置
    		var dataAdapter = $("#"+coaType+"Grid").jqxGrid('source');
    		var records = dataAdapter.records;
    		var _step = 1;
    		for(var _in = 0; _in < records.length; _in++){
    			var record = records[_in];
    			var len = datarow.parentRef.length;
    			if(record.ref.indexOf(datarow.parentRef) === 0 && record.ref.length >= len+2){
    				console.log('passes:'+datarow.ref+'--' +record.ref);
    				_step++;
    				if( datarow.level == record.level && parseInt(datarow.ref) < parseInt(record.ref)){
    					//找到同一级别比自身大的那一个节点
    					console.log('find max one:'+ record.ref);
    					_step--;
    					break;
    				}
    			}
    		}
    		
    		records.splice(selectedrowindex + _step, 0, datarow); //TODO 不准确
    		
    		$("#"+coaType+"Grid").jqxGrid('source').records = chartOfAccountMgt.generateCoa(records);
    		
    		$("#addCoaWin"+coaType).jqxWindow("close");
    		chartOfAccountMgt.searchDataInfo(coaType+"Grid");
    	}

	};
	/**
	 * 编辑选中科目
	 */
	this.edit = function(coaType){
		if($("#editCoaForm"+coaType).jqxValidator("validate")){
			
			var debitCredit = $("#editCoa-debitCredit"+coaType).val();
    		
    		var debitCreditLabel = null;
    		if(debitCredit =="debit"){
				debitCreditLabel = "借";
			} else if(debitCredit == "credit"){
	            debitCreditLabel = "贷";
			} else {
	           	debitCreditLabel = "unknown";
	        }
    		
    		var datarow = {
    			id:$("#editCoa-id"+coaType).val(),
    			parentId:$("#editCoa-parentId"+coaType).val()==""?null:$("#editCoa-parentId"+coaType).val(),
    			ref:$("#editCoa-ref"+coaType).val(),
    			hardCode:$("#editCoa-ref"+coaType).val(),
    			coaClass:$("#editCoa-coaClass"+coaType).val(),
    			name:$("#editCoa-name"+coaType).val(),
    			debitCredit:debitCredit,
    			debitCreditLabel:debitCreditLabel,
    			iniValue:$("#editCoa-iniValue"+coaType).val(),
    			debitAmt:$("#editCoa-debitAmt"+coaType).val(),
    			creditAmt:$("#editCoa-creditAmt"+coaType).val(),
    			balance:$("#editCoa-balance"+coaType).val(),
    			level:$("#editCoa-level"+coaType).val(),
    			enabled:$("#editCoa-enabled"+coaType).val(),
    			submitFlag:true,
    			parentRef:$("#editCoa-parentRef"+coaType).val()==""?null:$("#editCoa-parentRef"+coaType).val(),
    			delFlag:$("#editCoa-parentRef"+coaType).val()==""?false:true
    		};
    		
    		if(datarow.id==""||datarow.id==null){
    			delete datarow.id;
    		}
    		
			var selectedrowindex = $("#"+coaType+"Grid").jqxGrid('getselectedrowindex');
			
            var rowscount = $("#"+coaType+"Grid").jqxGrid('getdatainformation').rowscount;
            
            if (selectedrowindex >= 0 && selectedrowindex < rowscount) {
                var id = $("#"+coaType+"Grid").jqxGrid('getrowid', selectedrowindex);
                var commit = $("#"+coaType+"Grid").jqxGrid('updaterow', id, datarow);
                
                $("#"+coaType+"Grid").jqxGrid('ensurerowvisible', selectedrowindex);
                $("#editCoaWin"+coaType).jqxWindow("close");
                
                var records = $("#"+coaType+"Grid").jqxGrid('source').records;
                $("#"+coaType+"Grid").jqxGrid('source').records = chartOfAccountMgt.generateCoa(records);
                
                chartOfAccountMgt.disableChildren(datarow,records,coaType);
                
                chartOfAccountMgt.searchDataInfo(coaType+"Grid");
            }
    	}
	};
	
	this.remove = function(el){
	};
	
	/**
	 * 试算平衡
	 */
	this.computeBalance = function(submitFlag){
		var debitValue = 0;
		var creditValue = 0;
		
		var debitYearValue = 0;
		var creditYearValue = 0;
		
		var debitBalanceValue = 0;
		var creditBalanceValue = 0;
		
		var isBalance = false;
		
		$.each(chartOfAccountMgt.coaType,function(i,v){
			var dataAdapter = $("#"+v+"Grid").jqxGrid('source');
    		var records = dataAdapter.records;
    		$.each(records,function(_in,record){
    			if(record.debitCredit == "debit" && eval(record.enabled) == true && eval(record.allowInput == true)){
    				debitValue += parseFloat(record.iniValue);
    				debitBalanceValue += parseFloat(record.balance);
    				debitYearValue += parseFloat(record.debitAmt);
    				creditYearValue += parseFloat(record.creditAmt);
    			}
    			if(record.debitCredit == "credit" && eval(record.enabled) == true && eval(record.allowInput == true)){
    				creditValue += parseFloat(record.iniValue);
    				creditBalanceValue += parseFloat(record.balance);
    				debitYearValue += parseFloat(record.debitAmt);
    				creditYearValue += parseFloat(record.creditAmt);
    			}
    		});
		});
		
		$("#computeDebitValue").text(parseFloat(debitValue).toFixed(2));
		$("#computeCreditValue").text(parseFloat(creditValue).toFixed(2));
		$("#computeDeviationValue").text(Math.abs(debitValue-creditValue).toFixed(2));
		
		$("#computeYearDebitValue").text(parseFloat(debitYearValue).toFixed(2));
		$("#computeYearCreditValue").text(parseFloat(creditYearValue).toFixed(2));
		$("#computeDeviationYearValue").text(Math.abs(debitYearValue-creditYearValue).toFixed(2));
		
		$("#computeDebitBalanceValue").text(parseFloat(debitBalanceValue).toFixed(2));
		$("#computeCreditBalanceValue").text(parseFloat(creditBalanceValue).toFixed(2));
		$("#computeDeviationBalanceValue").text(Math.abs(debitBalanceValue-creditBalanceValue).toFixed(2));
		
		debitValue = parseFloat(debitValue).toFixed(2);
		creditValue = parseFloat(creditValue).toFixed(2);
		debitYearValue = parseFloat(debitYearValue).toFixed(2);
		creditYearValue = parseFloat(creditYearValue).toFixed(2);
		debitBalanceValue = parseFloat(debitBalanceValue).toFixed(2);
		creditBalanceValue = parseFloat(creditBalanceValue).toFixed(2);
		
		if(debitValue!=creditValue){
			$("#computeDebitValue").parent().addClass("error");
			$("#computeCreditValue").parent().addClass("error");
			$("#computeDeviationValue").parent().addClass("error");
		}else{
			$("#computeDebitValue").parent().removeClass("error");
			$("#computeCreditValue").parent().removeClass("error");
			$("#computeDeviationValue").parent().removeClass("error");
		}
		
		if(debitYearValue!=creditYearValue){
			$("#computeYearDebitValue").parent().addClass("error");
			$("#computeYearCreditValue").parent().addClass("error");
			$("#computeDeviationYearValue").parent().addClass("error");
		}else{
			$("#computeYearDebitValue").parent().removeClass("error");
			$("#computeYearCreditValue").parent().removeClass("error");
			$("#computeDeviationYearValue").parent().removeClass("error");
		}
		
		if(debitBalanceValue!=creditBalanceValue){
			$("#computeDebitBalanceValue").parent().addClass("error");
			$("#computeCreditBalanceValue").parent().addClass("error");
			$("#computeDeviationBalanceValue").parent().addClass("error");
		}else{
			$("#computeDebitBalanceValue").parent().removeClass("error");
			$("#computeCreditBalanceValue").parent().removeClass("error");
			$("#computeDeviationBalanceValue").parent().removeClass("error");
		}
		
		if(submitFlag===true){
			isBalance = (debitValue==creditValue && debitBalanceValue==creditBalanceValue && debitYearValue==creditYearValue);
			if(isBalance == false){
				$("#computeBalanceModal").modal('show');
			}
			return isBalance;
		}
		else{
			$("#computeBalanceModal").modal('show');
		}
	};
	
	this.submitAll = function(){
		var submitRecords = [];
		
		//是否试算平衡
		if(me.computeBalance(true) === true){
		
			$.each(chartOfAccountMgt.coaType,function(i,v){
				var dataAdapter = $("#"+v+"Grid").jqxGrid('source');
	    		var records = dataAdapter.records;
	    		$.each(records,function(_in,record){
	    			if(record.submitFlag === true){
	    				var submitRecord = $.extend(true,{},record);
//	    				submitRecord.allowInput = !submitRecord.allowInput;
	    				if(submitRecord.parentId === undefined) submitRecord.parentId = null;
	    				if(submitRecord.pid!==undefined && submitRecord.pid != '') submitRecord.parentId = submitRecord.pid;
	    				delete submitRecord.submitFlag;
	    				delete submitRecord.uid;
	    				delete submitRecord.debitCreditLabel;
	    				delete submitRecord.visibleindex;
	    				delete submitRecord.uniqueid;
	    				delete submitRecord.boundindex;
	    				delete submitRecord.parentRef;
	    				delete submitRecord.delFlag;
	    				delete submitRecord.pid;
//	    				delete submitRecord.allowInput;
	    				submitRecords.push(submitRecord);
	    			}
	    		});
			});
			
			if(submitRecords.length > 0)
				Core.AjaxRequest({
	                url : _global_settings.service.url+"/ac/"+new Base64().encode("tosys/carryover/coas/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
	                type: "POST",
	                params:submitRecords,
	                showMsg:false,
	                callback: function(res) {
	                	if(res.flag==false){
	                		Core.alert({message:res.errorMsg});
	                	}
	                	if(res.flag==true){
	                		setCloseAlertTimeOneSecond();
	                	}
	                	ComboBoxSources.load('chartOfAccounts');
            			$.addTab({title:"科目设置",url:'page/modules/fms/chartOfAccountMgt.html',reload:true});
	                },
	                failure:function(res){
	                }
	            });
			else{
				Core.alert({message:"您并没有修改任何科目信息。"});
			}
		}
	};
	
	
	this.bind = function(){
		
		$("#computeBalanceBtn").on({
			"click":me.computeBalance
		});
		
		$("#submitAllBtn").on({
			"click":me.submitAll
		});
		$("#importCOA").on({
			"click":function(){
				$('#coamgt-attachment').html('');
				$('#coamgt-modal').modal("show");
				$('#coamgt-attachment').fileuploader({url:_global_settings.service.url+"/common/importxlscoa/"+currentUserInfo.id});
			}
		});
		//导入之后的刷新
		$("#coamgt-modal").find(".glyphicon-remove").on({"click":function(){
			$.each(chartOfAccountMgt.coaType,function(i,v){
				$('#'+chartOfAccountMgt.coaType[i]+'Grid').jqxGrid('updatebounddata','cells');
			});
		}});
		
		$.each(chartOfAccountMgt.coaType,function(i,v){
			$("#addCoaSubmitBtn"+v).on({
				"click":function(){me.add(v);}
			});
			$("#editCoaSubmitBtn"+v).on({
				"click":function(){me.edit(v);}
			});
		});
		
	};
	
	this.unbindAll = function(){
		$("#computeBalanceBtn").off("click");
		$("#submitAllBtn").off("click");
		
		$.each(chartOfAccountMgt.coaType,function(i,v){
			$("#addCoaSubmitBtn"+v).off("click");
			$("#editCoaSubmitBtn"+v).off("click");
		});
	};
	
	
};
function downloadTemplate(){
//	window.open("template/COAImportModel.xls");
//	getSearchObj();
	var urls = new Base64().encode("tosys/coaReport/export/coa/0/"+currentUserInfo.id+"/"+currentUserInfo.loginId);
	window.open(_global_settings.service.url +"/ac/exportReport/"+urls);
}



