/*
 *使用券界面js 
 */

var UseVou=function(){
	var me=this;
	var url=_global_settings.service.url+'/coupon';
	this.id=null;
	
	this.initInput=function(){
		me.initWindows();
		me.initPage();
		me.initGrid(me.searchObj);
	}
	
	this.initWindows=function(){
		$('#useVouWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:360,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#cancelUseVouBtn'),
			initContent:function(){
				$('#editusevou-modules').jqxDropDownList({
					theme:currentTheme,
					source:ComboBoxSources.getRecords('productName'),
					searchMode:'contains',
					displayMember:'productName',
					valueMember:'productName',
					height:34,
					width:'100%',
					checkboxes: true,
					placeHolder:''
				});
			}
		}).on({
			'close':function(){
				setTimeout(function(){
					$('#editusevou-code').val('');
					$('#editusevou-modules').jqxDropDownList('uncheckAll');
					$('#editusevou-time').val('');
				},500);
			}
		});
	}
	
	this.initPage=function(){
		$('#useVou-show').css('display','');
		
		$('#useVou-module').comboBox({
			source:ComboBoxSources.getRecords('productName'),
			searchMode:'contains',
			displayMember:'productName',
			width:'100%'
		});
		
		$('#useVou-status').dropDownlist({
			source:{'all':'请选择','N':'已使用','Y':'未使用'},
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#useVou-show').addClass('hiddendiv');
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('useVouGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[								
				{ text: '使用券编码', dataField: 'couponCode',width:'17.5%'},
				{ text: '免费模块',dataField:'accountProductName',width:'17.5%'},
				{ text: '免费期间',dataField:'freeTime',width:'10%'},
				{ text: '开始日期',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            			html+=rowdata.startTime==undefined?'':rowdata.startTime.substring(0,10);
  	            		return html+'</div>';	
					}
				},
  	            { text: '到期日期',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            			html+=rowdata.endTime==undefined?'':rowdata.endTime.substring(0,10);
  	            		return html+'</div>';	
					}
  	            },
  	            { text: '状态',dataField:'available',width:'10%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            			html+=rowdata.available==true?'未使用':'已使用';
  	            		return html+'</div>';	
					}
  	            },
  	            { text: '使用用户名',dataField:'ownerName',width:'15%'},
  	            { text: '操作',width:'10%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var rtStr = '<div class="text-center">';
		  	            	rtStr += '<a class="hoverspan md-edit editUseVoucher" title="编辑"></a>';
	  	            		rtStr += '</div>';
  	            		return rtStr;
					}
  	            }
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#useVouGrid').grid(grid_sets);
		
		//点击编辑
		$('#useVouGrid').on('click','.editUseVoucher',function(){
			var index = $('#useVouGrid').jqxGrid('getselectedrowindex');
			var data = $('#useVouGrid').jqxGrid('getrowdata',index);
			if(!data.available){
				Core.alert({
					message:'已经使用的使用券不可编辑！'
				});
				return false;
			}
			
			me.id=data.id;
			console.log(data);
			$('#useVouWin').jqxWindow('open',function(){
				var modules = data.accountProductName == undefined?'':data.accountProductName.split(',');
				$('#editusevou-code').val(data.couponCode);
				$.each(modules,function(i){
					$('#editusevou-modules').jqxDropDownList('checkItem',modules[i]);
				});
				$('#editusevou-time').val(data.freeTime);
			});
		});
	}	
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'useVouGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={
		'ex.couponCode':{value:[],action:'like'},	
		'ex.accountProductName':{value:[],action:'like'},
		'ex.freeTime':{value:[],action:'eq'},
		'ex.available':{value:[],action:'eq'},
		'ex.ownerName':{value:[],action:'like'}
			
	};
	
	this.searchDataInfo = function(){
    	$('#useVouGrid').jqxGrid('applyfilters');
    	$('#useVouGrid').jqxGrid('refreshfilterrow'); 
    	$('#useVouGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#useVouGrid').jqxGrid('updatebounddata', 'cells');
    	$('#useVouGrid').jqxGrid('clearselection');
    	$('#useVouGrid').jqxGrid('refreshdata');
    };
	
}

var UseVouBindModle=function(useVou){
	var me=this;
	var url=_global_settings.service.url+'/coupon/updateCoupon';
	
	this.search=function(){
		var code=$('#useVou-code').val(),module=$('#useVou-module').find('input').val(),
			date=$('#useVou-date').val(),status=$('#useVou-status').val(),
			name=$('#useVou-name').val();
		
		useVou.searchObj['ex.couponCode'].value=[];
		if(code!='')
			useVou.searchObj['ex.couponCode'].value.push(code);
		
		useVou.searchObj['ex.accountProductName'].value=[];
		if(module!='')
			useVou.searchObj['ex.accountProductName'].value.push(module);
		
		useVou.searchObj['ex.freeTime'].value=[];
		if(date!='')
			useVou.searchObj['ex.freeTime'].value.push(date);
		
		useVou.searchObj['ex.available'].value=[];
		if(status!='all')
			useVou.searchObj['ex.available'].value.push(status);
		
		useVou.searchObj['ex.ownerName'].value=[];
		useVou.searchObj['ex.ownerName'].value.push(name);
		
		useVou.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#useVou-search').on('click',function(){
			if($('#useVou-show').is(':hidden'))
				$('#useVou-show').slideDown('slow');
			else
				me.search();
		});
		
		hiddenAclick();
		
		//点击导入
		$('#useVou-import').on('click',function(){
			var obj={url:_global_settings.service.url+'/common/importCoupon/9/3'};
			$('#useVou-attachment').html('');
			$('#useVou-modal').modal('show');
			$('#useVou-attachment').fileuploader(obj);
		});
		
		//点击保存
		$('#saveUseVouBtn').on('click',function(){
			var obj={};
				obj.id=useVou.id,obj.freeTime=$('#editusevou-time').val(),
				obj.products=[];
			var pro = $('#editusevou-modules').jqxDropDownList('getCheckedItems');
			$.each(pro,function(i){
				obj.products.push(pro[i].originalItem.id);
			});
			console.log(obj.products);
			Core.AjaxRequest({
				type:'PUT',
				url:url,
				params:obj,
				async:false,
				callback:function(){
					$('#useVouWin').jqxWindow('close');
					$('#useVouGrid').jqxGrid('updatebounddata', 'cells');
				}
			});
			
		});
		
	}
	
	this.unbindAll=function(){
		$('#useVou-search').off('click');
		$('#useVou-import').off('click');
		$('#saveUseVouBtn').off('click');
	}
}