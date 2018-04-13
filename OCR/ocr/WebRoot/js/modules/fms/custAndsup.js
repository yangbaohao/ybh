/*
*客户/供应商界面js
*/

var CauMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/common';
	this.id=null;
	
	this.initInput=function(){
		$('#cau-addCust')[0].checked=true;
//		$('#cau-editCust')[0].checked=true;
		
		me.initSearch();
		me.initGrid(me.searchObj);
		me.addVdt();
		me.editVdt();
		me.typeChange();
	}
	
	//类型改变
	this.typeChange=function(){
		$('#cau-addType').on('change',function(){
			var val=$(this).val();
			if(val=='person')
				$('#cau-addJc').attr('readonly',true).val('');
			else
				$('#cau-addJc').removeAttr('readonly');
		});
		
		$('#cau-editType').on('change',function(){
			var val=$(this).val();
			if(val=='person')
				$('#cau-editJc').attr('readonly',true).val('');
			else 
				$('#cau-editJc').removeAttr('readonly');
		});
	}
	
	//添加窗口校验
	this.addVdt = function(){
		$('#addWindow').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
				{ input: '#cau-addName',message: '不能为空',action:'keyup,blur',rule:'required'},
				{ input: '#cau-addDate',message: '不能为空',action:'keyup,blur',rule:'required'},
                { input: '#cau-addDate',message: '大于或等于0的整数',action:'keyup,blur',
                	rule:function(input,commit){
                		var reg = /^([0-9]\d{0,}|0)$/;
                		if(reg.test(Number(input.val()))) return true;
                		return false;
                	}
                }
             ]
		});
	}
	
	//编辑窗口校验
	this.editVdt = function(){
		$('#editWindow').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
				{ input: '#cau-editName',message: '不能为空',action:'keyup,blur',rule:'required'},
				{ input: '#cau-editDate',message: '不能为空',action:'keyup,blur',rule:'required'},
                { input: '#cau-editDate',message: '大于或等于0的整数',action:'keyup,blur',
                	rule:function(input,commit){
                		var reg = /^([0-9]\d{0,}|0)$/;
                		if(reg.test(Number(input.val()))) return true;
                		return false;
                	}
                }
             ]
		});
	}
	
	this.clearAddWin=function(){
		$('#cau-addType').dropDownlist({source:{'enterprise':'企业','person':'个人'},selectedIndex:0,width:'100%'});
		$('#addWindow').css('display','none');
		$('#cau-addSup')[0].checked=false;
		$('#cau-addCust')[0].checked=true;
		$('#addWindow').find('input').val('');
	}
	
	this.clearEditWin=function(){
		$('#cau-editType').dropDownlist({source:{'enterprise':'企业','person':'个人'},selectedIndex:0,width:'100%'});
		$('#editWindow').css('display','none');
		$('#cau-editSup')[0].checked=false;
		$('#cau-editCust')[0].checked=false;
		$('#editWindow').find('input').val('');
	}
	
	//初始化grid
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('cauGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(params){
                return demoAdapter.recordids;
            }
    	   ,columns:[
					{ text: '客户/供应商名称',dataField:'name',width:'40%'},
					{ text: '账期',width:'40%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	  	            		var html = '<div class="agrid">';
	  	            			if(rowdata.vendorType&&rowdata.customerFlag){
	  	            				html+=rowdata.vendorTermValue;
	  	            			} else {
	  	            				if(rowdata.vendorType)
		  	            				html+=rowdata.vendorTermValue;
		  	            			if(rowdata.customerFlag)
		  	            				html+=rowdata.customerTermValue;
	  	            			}
	  	            			
	  	            		return html+'</div>';
	  	              	}
					},
					{ text: '操作',width:'20%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	  	            		var rtStr = '<div style="text-align: center;">';
    	  	            		rtStr += '<a class="md-dns hoverspan viewCustAndSup" title="查看"></a>';
    	  	            		rtStr += '<a class="md-mode-edit hoverspan editCustAndSup" title="编辑"></a>';
    	  	            		rtStr += '<a class="md-cancel hoverspan deleteCustAndSup" title="删除"></a>';
    	  	            		rtStr += '</div>';
	  	            		return rtStr;
	  	              	}
					}
				],
    	    pagesize: 20,
    	    columnsheight: 45
	    };
		$('#cauGrid').grid(grid_sets);
		
		//点击编辑
		$('#cauGrid').on('click','.editCustAndSup',function(){
			$('#editWindowY').css('top',window.scrollY+150+'px');
			editCustAndSup();
		});
		
		//点击查看
		$('#cauGrid').on('click','.viewCustAndSup',function(){
//			debugger;
			$('#viewWindowY').css('top',window.scrollY+150+'px');
			viewCustAndSup();
		});
		
		//点击删除
		$('#cauGrid').on('click','.deleteCustAndSup',function(){
			deleteCustAndSup();
		});
		
	}
	
	var deleteCustAndSup=function(){
		var index = $('#cauGrid').jqxGrid('getselectedrowindex');
		if(index>=0){
			var data = $('#cauGrid').jqxGrid('getrowdata',index);
			console.log(data);
			if(data.isBsscreate&&data.orderFlag){
				Core.alert({message:'抱歉，此客户已经产生业务数据，不能删除！'});
				return false;
			}
			
			if(!data.isBsscreate){
				Core.alert({message:'抱歉，此客户是秒账系统新增客户，此界面不能删除！'});
				return false;
			}
			
			Core.confirm({
				message:'确定要删除吗？',
				confirmCallback:function(){
					Core.AjaxRequest({
						url:_global_settings.service.url+'/common/clientInfo/delete/'+data.id+'/'+currentUserInfo.id,
						type:'DELETE',
						async:false,
						showMsg:false,
						callback:function(){
							setCloseAlertTimeOneSecond();
							$('#cauGrid').jqxGrid('updatebounddata','cells');
						},
						failure : function(error) {
						}
					});
				}
			});
			
		}
	}
	
	var editCustAndSup=function(){
		
		var index = $('#cauGrid').jqxGrid('getselectedrowindex');
		if(index>=0){
			var data = $('#cauGrid').jqxGrid('getrowdata',index);
			console.log(data);
			me.id=data.id;
			
			if(!data.isBsscreate){
				Core.alert({message:'抱歉，此客户是秒账系统新增客户，此界面不能编辑！'});
				return false;
			}
//			debugger
			
			$('#editWindow').css('display','');
			$('#editWindow').css('height',document.body.scrollHeight+'px');
			
			$('#cau-editType').val(data.type);
			if(data.customerFlag)
				$('#cau-editCust')[0].checked=true;
			if(data.vendorType)
				$('#cau-editSup')[0].checked=true;
			$('#cau-editCode').val(data.number);
			$('#cau-editName').val(data.name);
			$('#cau-editJc').val(data.shortName);
			
			if(data.customerTermValue!=undefined)
				$('#cau-editDate').val(data.customerTermValue);
			if(data.vendorTermValue!=undefined)
				$('#cau-editDate').val(data.vendorTermValue);
		}
	}
	
	var viewCustAndSup=function(){
		$('#viewWindow').css('display','');
		$('#viewWindow').css('height',document.body.scrollHeight+'px');
		
		var index = $('#cauGrid').jqxGrid('getselectedrowindex');
		if(index>=0){
			var data = $('#cauGrid').jqxGrid('getrowdata',index);
			console.log(data);
			$('#cau-viewType').val(data.type=='person'?'个人':'企业');
			if(data.customerFlag)
				$('#cau-viewCust')[0].checked=true;
			if(data.vendorType)
				$('#cau-viewSup')[0].checked=true;

			$('#cau-viewCode').val(data.number);
			$('#cau-viewName').val(data.name);
			$('#cau-viewJc').val(data.shortName);
			
			if(data.customerTermValue!=undefined)
				$('#cau-viewDate').val(data.customerTermValue);
			if(data.vendorTermValue!=undefined)
				$('#cau-viewDate').val(data.vendorTermValue);
		}
	}
	
	this.settings = {  
		source:{
	        url: url+'/client/'+currentUserInfo.id,
	        data:me.searchObj,
	    },
		grid:{element:'cauGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'u.name':{value:[],action:'like'}	
		}	
	};
	
	this.searchDataInfo = function(){
    	$('#cauGrid').jqxGrid('applyfilters');
    	$('#cauGrid').jqxGrid('refreshfilterrow'); 
    	$('#cauGrid').jqxGrid('clearselection');
    };
}

var CauBindModle=function(cauMgt){
	var me=this;
	var url=_global_settings.service.url+'/common';
	
	this.saveAddCustAndSup=function(){
//		debugger
		var obj={};
			obj.userInfo={};
			obj.clientBanks=[];
			
			obj.userInfo.type=$('#cau-addType').val(),
			obj.userInfo.name=$('#cau-addName').val(),
			obj.userInfo.shortName=$('#cau-addJc').val(),
			obj.userInfo.address=[];
			obj.userInfo.personInfos=[];
			
			obj.customerFlag=$('#cau-addCust')[0].checked,
			obj.vendorType=$('#cau-addSup')[0].checked,
			obj.number=$('#cau-addCode').val();
		
		if(obj.customerFlag)
			obj.customerTermValue=$('#cau-addDate').val();
		
		if(obj.vendorType)
			obj.vendorTermValue=$('#cau-addDate').val();
		
		if(obj.userInfo.type=='person'){
			delete obj.userInfo.personInfos;
			delete obj.userInfo.shortName;
		}
			
		
		if($('#addWindow').jqxValidator('validate')){
			console.log(obj);
			Core.AjaxRequest({
				url:ws_url+'/CXF/rs/common/clientInfo/create/'+currentUserInfo.id+'/'+currentUserInfo.loginId,
				type:'POST',
				params:obj,
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					cauMgt.clearAddWin();
					$('#cauGrid').jqxGrid('updatebounddata','cells');
				},
				failure : function(error) {
					var err = JSON.parse(error.responseText);
					Core.alert({
						message: err.errorMsg,
						callback:function(){
							$('#addWindow').css('display','none');
						}
					});
				}
			});
		}
	}
	
	this.saveEditCustAndSup=function(){
		var obj={};
			obj.userInfo={};
			obj.clientBanks=[];
			
			obj.userInfo.type=$('#cau-editType').val(),
			obj.userInfo.name=$('#cau-editName').val(),
			obj.userInfo.shortName=$('#cau-editJc').val(),
			obj.userInfo.address=[];
			obj.userInfo.personInfos=[];
			
			obj.customerFlag=$('#cau-editCust')[0].checked,
			obj.vendorType=$('#cau-editSup')[0].checked,
			obj.number=$('#cau-editCode').val();
			
			obj.id=cauMgt.id;
		
		if(obj.customerFlag)
			obj.customerTermValue=$('#cau-editDate').val();
		
		if(obj.vendorType)
			obj.vendorTermValue=$('#cau-editDate').val();
		
		if(obj.userInfo.type=='person'){
			delete obj.userInfo.personInfos;
			delete obj.userInfo.shortName;
		}
		
		if($('#editWindow').jqxValidator('validate')){
			console.log(obj);
			Core.AjaxRequest({
				url:ws_url+'/CXF/rs/common/clientInfo/update/'+currentUserInfo.id+'/'+currentUserInfo.loginId,
				type:'PUT',
				params:obj,
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					cauMgt.clearEditWin();
					$('#cauGrid').jqxGrid('updatebounddata','cells');
				},
				failure : function(error) {
					var err = JSON.parse(error.responseText);
					Core.alert({
						message: err.errorMsg,
						callback:function(){
							$('#editWindow').css('display','none');
						}
					});
				}
			});
		}
	}
	
	var search=function(){
		var name=$('#cau-name').val();
		
		cauMgt.searchObj['u.name'].value=[];
		if(name!='')
			cauMgt.searchObj['u.name'].value.push(name);
		
		cauMgt.searchDataInfo();
	}
	
	this.bind=function(){
		
		//点击搜索
		$('#cau-searchBtn').on('click',function(){
			search();
		});
		
		//点击新增
		$('#cau-add').on('click',function(){
			$('#addWindow').css('display','');
			$('#cau-addType').dropDownlist({source:{'enterprise':'企业','person':'个人'},selectedIndex:0,width:'100%'});
			$('#addWindow').css('height',document.body.scrollHeight+'px');
		});
		
		//保存新增
		$('#cau-addSave').on('click',function(){
			me.saveAddCustAndSup();
		});
		
		//取消新增
		$('#cau-addCancle').on('click',function(){
			cauMgt.clearAddWin();
		});
		
		//保存编辑
		$('#cau-editSave').on('click',function(){
			me.saveEditCustAndSup();
		});
		
		//取消编辑
		$('#cau-editCancle').on('click',function(){
			cauMgt.clearEditWin();
		});
		
		//关闭
		$('#cau-viewCancle').on('click',function(){
			$('#viewWindow').css('display','none');
			$('#viewWindow').find('input').val('');
			$('#cau-viewCust')[0].checked=false;
			$('#cau-viewSup')[0].checked=false;
		});
		
		//下载模板
		$('#cau-download').on('click',function(){
			window.open(_global_settings.service.url+'/common/export/clientInfo/0');
		});
		
		//点击导入
		$('#cau-import').on('click', function(){
			var obj = {url:url+'/importxlsclient/'+currentUserInfo.id};
			$('#cau-attachment').html('');
			$('#cau-modal').modal('show');
			$('#cau-attachment').fileuploader(obj);
		});
	}
	
	this.unbindAll=function(){
		$('#cau-searchBtn').off('click');
		$('#cau-add').off('click');
		$('#cau-addSave').off('click');
		$('#cau-addCancle').off('click');
		$('#cau-editSave').off('click');
		$('#cau-editCancle').off('click');
		$('#cau-viewCancle').off('click');
		$('#cau-download').off('click');
		$('#cau-import').off('click');
	}
}