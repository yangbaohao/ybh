var quickKey=function(){
	var me=this;
	var count = 0;
	quickKey.prototype.defaultrow = function() {
        return {
        	"name": "",
            "id": null,
            "printOfGoods": "",
            "photoId": "",
            //"sku": "",
            "salesQty": "",
            "purchasedQty": "",
            "spec": "",
            "descr": "",
            "color": "",
            "prodColourDescr": "",
            "weight": "",
            "totalCartons": "",
            "eachCartons": "",
            "qty": "",
            "priceBefore": "",
            "price3": "",
            "price3_server": "",
            "extent": "",
            "breadth": "",
            "altitude": "",
            "tj": "",
            "deliveiedQty": "",
            "deliveryQtyNow": "",
            "remark": "",
            "dzid": "",
            "rowweight": "",
            "ysprice": "",
            "dsprice": "",
            'volume': "", //体积
            'yards': '', //细码
            "unit": "",
            "unitRate": "",
            "basicUnit": "",
            "unitsFlag": "",
            "unitRateqty": "",
            "deliveryQtyAll": "",
            "inventoryReducere": "",
            "amountFormula": "",
            "inventoryQtyFormula": "",
            "discount":"",
            "originalPrice":"",
        	"specId":"",
            "colorId":""
        }
    };
		
	//快捷键
	quickKey.prototype.anyKey=function(){
		$(document).keyup(function(event){
			var e=event||window.event;
			var code=e.keyCode;
			var ak=$('#addSO').is(':visible'),
				vk=$('#viewSO').is(':visible'),
				ek=$('#editSO').is(':visible'),
				hk=$('#home_html').is(':visible');
			
//			console.log(e);
			//首页enter键
			if(code==13&&!e.ctrlKey){
				if(hk){
					me.homeKey();
				}
				if(ak||ek){
					me.addedit(code,e);
				}
//				return false;
			}
			
			//新增界面快捷键:F1,F2,F3,F4,F6
			if(code==112||code==113||code==114||code==115||code==117){
//				window.onhelp=function(){
//					return false; F1帮助
//				}
				e.preventDefault();
				if(ak||ek){
					me.addedit(code,e);
				}
				return false;
			}
			
			//esc
			if(code==27){
				if(ak||ek){
					me.addedit(code,e);
				}
				return ;
			}
			
			//0,1-9
			if(code==48||code==49||code==50||code==51||code==52||code==53||code==54||code==55||code==56||code==57){
				if(ak||ek){
					me.addedit(code,e);
				}
				return ;
			}
			//0,1-9
			if(code==96||code==97||code==98||code==99||code==100||code==101||code==102||code==103||code==104||code==105){
				if(ak||ek){
					me.addedit(code,e);
				}
				return ;
			}
			//alt+q
			if(code==81&&e.altKey){
				if(ek||ak){
					me.altQ(e);
				}
				return ;
			}
			//shift+q
			if(code==81&&e.shiftKey){
				if(ek||ak){
					me.shiftQ(e);
				}
				return ;
			}
			//shift+w
			if(code==87&&e.shiftKey){
				if(ek||ak){
					me.shiftW(e);
				}
				return ;
			}
			//alt+e
			if(code==69&&e.altKey){
				if(ek||ak){
					me.altE(e);
				}
				return ;
			}
			
			//上下
			if(code==38||code==40){
				if(ek||ak){
					me.updown(e);
				}
				if(ek||vk||ak){
					me.topdown(e);
				}
				
				return ;
			}
			
			//ctrl+q
			if(code==81&&e.ctrlKey){
				me.ctrlQ(e);
				return ;
			}
			
			//ctrl+enter
			if(code==13&&e.ctrlKey){
				me.ctrlEnter(e);
				return ;
			}
			
			//ctrl+shift
			if(e.shiftKey&&e.ctrlKey){
				if(vk){
					me.ctrlShift(e);
				}
				return ;
			}

		});
	}
	
	
//	首页快捷键enter抢单
//	1.特别加急类型单子优先，加急类型单子次之，一般类型单子最后
//	2.日期正序抢单，先提交的先被抢
	quickKey.prototype.homeKey=function(){
		//除审核人外
		if(_global_settings.owner.roleName!='Ocr_auditor'){
			Core.AjaxRequest({
				type:'get',
				showMsg:false,
				url:_global_settings.service.url+'/report/enterGrap',
				callback:function(data){
					Core.alert({
                        message: '抢单成功，正在为您跳转至销售单界面...',
                        hide: '500',
                        callback: function() {
                            $.addTab({
                                title: '新建销售单',
                                url: 'page/modules/biz/addSaleOrder.html',
                                pk: {data:data},
                                reload: true
                            });
                        }
                    });
				},
				failure:function(res){
					Core.alert({message:res.responseJSON.errorMsg});
				}
			});
			console.info('home,enter,createBy');
		}
	}
	
	//新建快捷键
	quickKey.prototype.addedit=function(code,e){
		if($('#viewSO').is(':visible')) return ;
		
		var ak=$('#addSO').is(':visible');
		var grid='addSaleOrder_grid';
		var addBtn='addSO-ress',content='addSO';
		var nodeName=e.target.nodeName;
		if(!ak){
			content='editSO';
			addBtn='editSO-ress';
			grid='editSaleOrder_grid';
		}
		
		console.log('addedit,key');
		switch (code){
			case 112:
				e.preventDefault();
				var len=$('#floatImg>img').length;
				if(len<5){
					$('#'+content).find('.thumbnailImg').eq(0).trigger('dblclick');
				}
				break;
			case 113:
				e.preventDefault();
				var len=$('#floatImg>img').length;
				if(len<5){
					$('#'+content).find('.thumbnailImg').eq(1).trigger('dblclick');
				}
				break;
			case 114:
				e.preventDefault();
				var len=$('#floatImg>img').length;
				if(len<5){
					$('#'+content).find('.thumbnailImg').eq(2).trigger('dblclick');
				}
				break;
			case 115:
				e.preventDefault();
				var len=$('#floatImg>img').length;
				if(len<5){
					$('#'+content).find('.thumbnailImg').eq(3).trigger('dblclick');
				}
				break;
			case 117:
				e.preventDefault();
				var len=$('#floatImg>img').length;
				if(len<5){
					$('#'+content).find('.thumbnailImg').eq(4).trigger('dblclick');
				}
				break;
			case 27:
				var img=$('#floatImg>img');
				if(img.length>0){
					img.eq(0).trigger('dblclick');
				}
				break;
			case 49: //1
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 0, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 0, 'productName');
				}
				break;	
			case 97: //1
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 0, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 0, 'productName');
				}
				break;
			case 50: //2
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 1, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 1, 'productName');
				}
				break;
			case 98: //2
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 1, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 1, 'productName');
				}
				break;
			case 51: //3
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 2, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 2, 'productName');
				}
				break;
			case 99: //3
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 2, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 2, 'productName');
				}
				break;
			case 52: //4
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 3, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 3, 'productName');
				}
				break;
			case 100: //4
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 3, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 3, 'productName');
				}
				break;
			case 53: //5
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 4, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 4, 'productName');
				}
				break;
			case 101: //5
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 4, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 4, 'productName');
				}
				break;
			case 54: //6
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 5, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 5, 'productName');
				}
				break;
			case 102: //6
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 5, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 5, 'productName');
				}
				break;
			case 55: //7
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 6, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 6, 'productName');
				}
				break;
			case 103: //7
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 6, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 6, 'productName');
				}
				break;
			case 56: //8
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 7, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 7, 'productName');
				}
				break;
			case 104: //8
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 7, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 7, 'productName');
				}
				break;
			case 57: //9
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 8, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 8, 'productName');
				}
				break;
			case 105: //9
				if(nodeName=='BODY'){
					$('#'+grid).jqxGrid('selectcell', 8, 'productName');
					$('#'+grid).jqxGrid('begincelledit', 8, 'productName');
				}
				break;
			case 96: //0
				if(nodeName=='BODY'){
	            	for(var i=0;i<5;i++){
	            		$('#'+grid).jqxGrid('addrow', null, me.defaultrow());
	            	}
				}
				break;
			case 48: //0
				if(nodeName=='BODY'){
	            	for(var i=0;i<5;i++){
	            		$('#'+grid).jqxGrid('addrow', null, me.defaultrow());
	            	}
				}
				break;
			case 13: //enter新增地址
				console.log('nodeName',nodeName);
//				if($('#confirmWindow').length==1){
//					me.btn('okButton_cf');
//					timeOut(function(){
//						$('#okButton_cf').trigger('click');
//					},500);
//					return ;
//				}
				
				if(nodeName=='BODY'||nodeName=='A'){ //新增地址
					$('#'+addBtn).trigger('click');
				}
				
				break;
		}
	}
	
	//查看快捷键
	quickKey.prototype.viewKey=function(){
		console.log('view,key');
	}
	
	//编辑快捷键
	quickKey.prototype.editKey=function(e){
		
	}
	
	//alt+q
	quickKey.prototype.altQ=function(e){
		e.preventDefault();
		if($('#viewSO').is(':visible')) return ;
		
		var ak=$('#addSO').is(':visible');
		var target=e.target;
		
		//新建页面
		if(ak){
			if($('#addSO-box').is(':visible')){
				document.addSelectForm.addbox.focus();
			}else if($('#addSO-productMeasFlag').is(':visible')){
				document.addSelectForm.addbox1.focus();
			}else{
				document.addSelectForm.addbox2.focus();
			}
		}else{ //编辑界面
			if($('#editSO-box').is(':visible')){
				document.editSelectForm.editbox.focus();
			}else if($('#editSO-productMeasFlag').is(':visible')){
				document.editSelectForm.editbox1.focus();
			}else{
				document.editSelectForm.editbox2.focus();
			}
		}
	}
	
	//shift+q
	quickKey.prototype.shiftQ=function(e){
		e.preventDefault();
		if($('#viewSO').is(':visible')) return ;
		
		var ak=$('#addSO').is(':visible');
		var addBtn='addSO-ress';
		var target=e.target,address='addSO-addReceiverAddress';
		if(!ak){
			addBtn='editSO-ress';
			address='editSO-editReceiverAddress';
		}
		
		$('#'+address).jqxComboBox('focus');
		$('#'+address).jqxComboBox('open');
		
		$('#'+address).off('close').on('close',function(event){
			var t=$(this);
			var index=t.jqxComboBox('getSelectedIndex');
			if(index==-1) return ;
			var item=t.jqxComboBox('getItem',index);
			var value=t.find('input').val();
			var arr=value.split(',');
			var boolean=false;
			for(var i=0;i<arr.length;i++){
				if(item.label==arr[i].trim()){
					boolean=true;
					break;
				}
			}
			if(!boolean){
				t.jqxComboBox('checkItem',item.label);
			}else{
				t.jqxComboBox('uncheckItem',item.label);
			}
			
			var val=t.find('input').val();
			if(val==''){ //默认第一个
				var it=t.jqxComboBox('getItem',0);
				t.jqxComboBox('checkItem',it.label);
			}
			
//			$('#'+addBtn).attr('tabindex','0').focus();
			t.jqxComboBox('unselectIndex',index);
			console.log('index',index,'value',value,'val',val);
		});
	}
	
	//shift+w
	quickKey.prototype.shiftW=function(e){
		e.preventDefault();
		if($('#viewSO').is(':visible')) return ;
		
		var ak=$('#addSO').is(':visible');
		var target=e.target,time='addSO-saleTime';
		if(!ak){
			time='editSO-time';
		}
		
		$('#'+time).jqxDateTimeInput('focus');
		$('#'+time).jqxDateTimeInput('open');
		$('#'+time).off('close').on('close',function(){
			var t=$(this);
			var date=t.jqxDateTimeInput('getText');
			t.find('input').focus();
			console.log('date',date);
		});
	}
	
	//alt+e
	quickKey.prototype.altE=function(e){
		e.preventDefault();
		if($('#viewSO').is(':visible')) return ;
		
		var ak=$('#addSO').is(':visible');
		var target=e.target,table='addSO-receiveRecordTbody';
		if(!ak){
			table='editSO-receiveRecordTbody';
		}
		$('#'+table).find('tr').eq(0).find('.receiveMoney').focus();
		
	}
	
	//updown
	quickKey.prototype.updown=function(e){
		e.preventDefault();
		if($('#viewSO').is(':visible')) return ;
		
		var ak=$('#addSO').is(':visible');
		var p=e.target.parentNode;
		var table='#addSO-receiveRecordTbody';
		if(!ak){
			table='#editSO-receiveRecordTbody';
		}
		
		var parent=$(p).parents(table);
		if(parent.length==1){ //如果是在table上按上下
			var index=$(p).parent().index();
			var inx=$(p).index();
			if(e.keyCode==38){ //up
				if(index==0) return ;
				parent.find('tr').eq(index-1).find('td').eq(inx).find('input').focus();
			}else{ //down
				if(index==$(table).children().length-1) return ;
				parent.find('tr').eq(index+1).find('td').eq(inx).find('input').focus();
			}
		}
	}
	
	//ctrl+q 驳回
	quickKey.prototype.ctrlQ=function(e){
		e.preventDefault();
		var btn='addOcrOrderReject';
		var vk=$('#viewSO').is(':visible');
		var ek=$('#editSO').is(':visible');
		if(vk){
			btn='viewSO-rejectBtn';
		}
		if(ek){
			btn='editSoRejectBtn';
		}
		
		me.btn(btn);
		$('#'+btn).trigger('click');
	}
	
	//top,down
	quickKey.prototype.topdown=function(e){
		e.preventDefault();
		
		if(e.keyCode==40){ //down
			if($('#ocrOrderReject').is(':visible')){
				$('#unkownWriting')[0].checked = false;
		        $('#unkownInformation')[0].checked = true;
			}
		}else{
			if($('#ocrOrderReject').is(':visible')){
				$('#unkownWriting')[0].checked = true;
		        $('#unkownInformation')[0].checked = false;
			}
		}
	}
	
	//ctrl+enter
	quickKey.prototype.ctrlEnter=function(e){
		e.preventDefault();
		var ak=$('#addSO').is(':visible'); //新增
		var vk=$('#viewSO').is(':visible'); //查看
		var ek=$('#editSO').is(':visible'); //编辑
		var bh=$('#ocrOrderReject').is(':visible'); //驳回弹框
		
		if(ak){
			if(bh){
				me.btn('saveRejectReason');
				$('#saveRejectReason').trigger('click');
			}else{
				if($('#saveAddSaleOrderBtn').is(':visible')){ //提交
					me.btn('saveAddSaleOrderBtn');
					$('#saveAddSaleOrderBtn').trigger('click');
				}
//				else{
//					me.btn('saveAddSaleSaveSubmit');
//					$('#saveAddSaleSaveSubmit').trigger('click'); //再次提交
//				}
			}
			return ;
		}
		
		if(vk){
			if(bh){
				me.btn('saveRejectReason');
				$('#saveRejectReason').trigger('click');
			}else{
				if($('#ocrCheckSubmitWindow').jqxWindow('isOpen')){ //审核不通过窗口
					me.btn('saveOcrCheckSubmit');
					$('#saveOcrCheckSubmit').trigger('click');
				}else{
					if($('#viewSO-checkPass').is(':visible')){
						me.btn('viewSO-checkPass');
						$('#viewSO-checkPass').trigger('click'); //审核通过
					}
				}
			}
			return ;
		}
		
		if(ek){
			if(bh){
				me.btn('saveRejectReason');
				$('#saveRejectReason').trigger('click');
			}else{
				if($('#ocrSubmitAgainWindow').jqxWindow('isOpen')){
					me.btn('saveSubmitAgainSubmit');
					$('#saveSubmitAgainSubmit').trigger('click');
				}else{
					me.btn('saveEditBtn');
					$('#saveEditBtn').trigger('click'); //编辑界面提交
				}
			}
			return ;
		}
	}
	
	//ctrl+shift
	quickKey.prototype.ctrlShift=function(e){
		e.preventDefault();
		$('#ocrCheckSubmitWindow').jqxWindow('open',function(){
			me.btn('viewSO-checkRefuse');
			$('#ocrCheckSubmitRemark').focus();
		});
	}
	
	quickKey.prototype.btn=function(btn){
		$('#'+btn).addClass('btnClass');
		timeOut(function(){
			$('#'+btn).removeClass('btnClass');
		},800);
	}
}