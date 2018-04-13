/*
 * 潜在客户界面js
 */

var boolean=true;

var CustMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/importLog';
	this.custData=null;
	
	this.initInput=function(){
		me.initPage();
		me.initWindows();
//		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		sortdatafield:'createDate',
		status:{value:[],action:'eq'},
		batchNum:{value:[],action:'like'},
		createDate:{value:[],action:'between'}
	};
	
	this.initPage=function(){
		$('#cust-show').css('display','');
		
		$('#cust-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#cust-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#cust-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#cust-time').on('change',function(){
			setValueById('cust-time','cust-sTime','cust-eTime');
		});
		
		$('#cust-status').dropDownlist({
			source:{'all':'请选择','sendSuccess':'已发送','notSend':'未发送'},
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#cust-show').addClass('hiddendiv');
	}
	
	this.initWindows = function(){
		$('#custWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:700,
			minHeight:300,
			height:'auto',			
			minWidth: 600, 
			maxWidth:800, 
			cancelButton: $('#cancelCustBtn'),
			initContent:function(){
				
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#custwin-zt').val('');
				$('#custwin-remark').val('');
				$('#custwin-phone').val('');
			},500);
		});
		
		$('#editCustWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:700,
			minHeight:300,
			height:'auto',			
			minWidth: 600, 
			maxWidth:800, 
			cancelButton: $('#cancelEditCustBtn'),
			initContent:function(){
				
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#custwin-editzt').val('');
				$('#custwin-editremark').val('');
				$('#custwin-editphone').val('');
			},500);
		});
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('custMgtGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var	grid_sets = {
	  	     source:demoAdapter
		     ,rendergridrows: function(){
                  return demoAdapter.recordids;
             }
    	     ,columns:[
						{ text: '导入时间',width:'10%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
								return html+rowdata.createDate.substring(0,10)+'</div>';
							}
						},
						{ text: '客户主题',dataField:'batchNum',width:'15%'},
						{ text: '数量',width:'15%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid" title="客户详情">';
									html += '<a class="hoverspan viewCustDet">'+rowdata.num+'</a>';
								return html+'</div>';
							}
						},
						{ text: '注册用户数',width:'15%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
									html += '<a class="hoverspan viewRegisterCust">'+rowdata.registerNum+'</a>';
								return html+'</div>';
							}
						},
						{ text: '备注',dataField:'remark',width:'15%'},
						{ text: '状态',width:'15%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
								return html+getCodeData(rowdata.status)+'</div>';
							}
						},
						{ text: '操作',width:'15%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="text-center">'; 
									html += '<a class="hoverspan md-edit editCust" title="编辑"></a>'; 
									html += '<a class="hoverspan md-archive importCust" title="导入客户"></a>';
								return html+'</div>';
							}
						}
    	            ],
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#custMgtGrid').grid(grid_sets);
		
		//点击数量
		$('#custMgtGrid').on('click','.viewCustDet',function(){
			var index = $('#custMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#custMgtGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'客户详情',isFrame:false,url:'page/modules/buso/viewCust.html',
					pk:{batchNum:rowdata.batchNum,date:rowdata.createDate},reload:true});
			}
		});
		
		//点击注册用户数
		$('#custMgtGrid').on('click','.viewRegisterCust',function(){
			var index = $('#custMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#custMgtGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'注册用户详情',isFrame:false,url:'page/modules/buso/viewRegisterCust.html',
					pk:{batchNum:rowdata.batchNum,createDate:rowdata.createDate},reload:true});
			}
		});
		
		//点击编辑
		$('#custMgtGrid').on('click','.editCust',function(){
			boolean = false;
			var index = $('#custMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#custMgtGrid').jqxGrid('getrowdata',index);
				console.log(rowdata);
				me.custData = rowdata;
				$('#editCustWin').jqxWindow('open',function(){
					$('#custwin-editzt').val(rowdata.batchNum);
					$('#custwin-editremark').val(rowdata.remark);
					$('#custwin-editphone').val(rowdata.testPhone);
				});
			}
		});
		
		//点击导入
		$('#custMgtGrid').on('click','.importCust',function(){
			var index = $('#custMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#custMgtGrid').jqxGrid('getrowdata',index);
				console.log(rowdata);
//				customerId = rowdata.id;
				var obj={url:_global_settings.service.url+'/common/import/potentialCustomers/'+rowdata.id};
				$('#cust-attachment').html('');
				$('#cust-modal').modal('show');
				$('#cust-attachment').fileuploader(obj);
			}
		});
	}	
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj
	    },
		grid:{element:'custMgtGrid'},
		ajax:{url:url},
	};
	
//	this.initSearch=function(){
//		me.searchObj={
//			
//		};
//	}
	
	this.searchDataInfo = function(){
    	$('#custMgtGrid').jqxGrid('applyfilters');
    	$('#custMgtGrid').jqxGrid('refreshfilterrow'); 
    	$('#custMgtGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#custMgtGrid').jqxGrid('updatebounddata', 'cells');
    	$('#custMgtGrid').jqxGrid('clearselection');
    	$('#custMgtGrid').jqxGrid('refreshdata');
    };
}

var CustBindModle=function(custMgt){
	var me=this;
	var url=_global_settings.service.url+'/importLog';
	
	this.search=function(){
		var status = $('#cust-status').val(),batchNum = $('#cust-name').val(),
			st = $('#cust-sTime').val(),et = $('#cust-eTime').val();
		
		custMgt.searchObj.status.value=[];
		if(status!='all')
			custMgt.searchObj.status.value.push(status);
		
		custMgt.searchObj.batchNum.value=[];
		if(batchNum!='')
			custMgt.searchObj.batchNum.value.push(batchNum);
		
		custMgt.searchObj.createDate.value=[];
		if(st!=''&&et!='')
			custMgt.searchObj.createDate.value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		if(st!=''&&et===''){
			custMgt.searchObj.createDate.value.push(st+' '+'00:00:00');
			custMgt.searchObj.createDate.action='ge';	
		}
			
		if(st===''&&et!=''){
			custMgt.searchObj.createDate.value.push(et+' '+'23:59:59');
			custMgt.searchObj.createDate.action='le';
		}
		
		custMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#cust-search').on('click',function(){
			if($('#cust-show').is(':hidden')){
				$('#cust-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
		
		//点击下载模板
		$('#cust-load').on('click',function(){
			window.open('template/PotentialCustomers.xls');
		});
		
//		//点击导入
//		$('#mes-import').on('click',function(){
//			$('#cust-attachment').html('');
//			$('#cust-modal').modal('show');
//			$('#cust-attachment').fileuploader();
//		});
		
		//点击新增主题
		$('#mes-addZt').on('click',function(){
			boolean = true;
			$('#custWin').jqxWindow('open');
		});
		
		//保存新增主题
		$('#addCustSaveBtn').off('click').on('click',function(){
			var obj={};
			obj.batchNum = $('#custwin-zt').val(),obj.remark = $('#custwin-remark').val(),
			obj.testPhone = $('#custwin-phone').val();
			
			if(obj.batchNum==''){
				Core.alert({message:'客户主题不能为空！'});
				return false;
			}
			
			var arr=$('#custwin-phone').val().split('，');
			for(var i=0;i<arr.length;i++){
				if(arr[i]!=''){
					if(!/^1[34578]\d{9}$/.test(arr[i])){
						Core.alert({message:'电话号码格式不正确。多个电话，逗号隔开'});
						return false;
					}
				}
			}
			
			Core.AjaxRequest({
				type:'POST',
				url:url,
				async:false,
				params:obj,
				callback:function(){
					$('#custWin').jqxWindow('close');
					$('#custMgtGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
				}
			});
		});
		
		//保存编辑主题
		$('#editCustSaveBtn').on('click',function(){
			var obj={};
			obj.id = custMgt.custData.id,obj.remark = $('#custwin-editremark').val(),
			obj.testPhone = $('#custwin-editphone').val();
			
			var arr=$('#custwin-editphone').val().split('，');
			for(var i=0;i<arr.length;i++){
				if(arr[i]!=''){
					if(!/^1[34578]\d{9}$/.test(arr[i])){
						Core.alert({message:'电话号码格式不正确。多个电话，逗号隔开'});
						return false;
					}
				}
			}
			
			Core.AjaxRequest({
				type:'PUT',
				url:url,
				async:false,
				params:obj,
				callback:function(){
					$('#editCustWin').jqxWindow('close');
					$('#custMgtGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
				}
			});
		});
	}
	
	this.unbindAll=function(){
		$('#cust-search').off('click');
		$('#cust-load').off('click');
		$('#mes-addZt').off('click');
		$('#addCustSaveBtn').off('click');
		$('#editCustSaveBtn').off('click');
	}
}
