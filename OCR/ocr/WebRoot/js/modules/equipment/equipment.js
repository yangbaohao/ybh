var EquipmentBssMgt = function(){
	 var me = this;
	 this.debug = false;
	 var url = _global_settings.service.url+"/ac/journal";
	 var rowdatas = null;

	 /**
	 * 初始化页面上所有的控件
	 */
	this.initInput = function(){
		me.initSearch();
		me.initGrid(me.searchObj);
		me.initEvent();
		$('#eqmgt_sale_rq').datetimeinput({width:140,height:33,value:new Date()});
		$('#eqmgt_break_rq').datetimeinput({width:140,height:33,value:new Date()});
	};
	 
	/**
	 * 绑定事件
	 */
	this.initEvent=function(){
		$('#eqmgt_sale_sr').on('keyup blur',function(){
			var sr_val=parseFloat(money($(this).val()));
			var ye_val=parseFloat(money($('#eqmgt_sale_ye').text()));
			$('#eqmgt_sale_jsy').text(money(sr_val-ye_val));
		});
		
		$('#eqmgt_sale_saveBtn').on('click',function(){
			if(!$("#eqmgt_sale_modal").jqxValidator("validate")){
				return false;
			}
			var rowindex = $("#EquiGrid").jqxGrid('getselectedrowindex');
			var data = $("#EquiGrid").jqxGrid('getrowdata', rowindex);
			var depreciateDate='';
			if(data.depreciateStartMonth!=null){
				depreciateDate=data.depreciateStartMonth.substring(0,10);
			}else{
				depreciateDate=data.depreciatePauseMonth.substring(0,10);
			}
			if($('#eqmgt_sale_rq').val()<depreciateDate){
				Core.alert({message:'出售日期不能早于已经计提过折旧的日期'});
				return false;
			}
			var po={
					id:$('#eqmgt_sale_id').text(),
					depreciateEndMonth:$('#eqmgt_sale_rq').val(),
					income:$('#eqmgt_sale_sr').val()
			}
			Core.AjaxRequest({
				url : _global_settings.service.url+"/ac/"+new Base64().encode('tosys/coaReport/asset/sell/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
	            type: "PUT",
	            async:false,
	            params:po,
	            showMsg:false,
	            callback: function(res) {
	            	setCloseAlertTimeOneSecond();
	            	$("#EquiGrid").jqxGrid('updatebounddata', 'cells');
	            }
			});
		});
		
		$('#eqmgt_break_saveBtn').on('click',function(){
			if(!$("#eqmgt_break_modal").jqxValidator("validate")){
				return false;
			}
			var rowindex = $("#EquiGrid").jqxGrid('getselectedrowindex');
			var data = $("#EquiGrid").jqxGrid('getrowdata', rowindex);
			var depreciateDate='';
			if(data.depreciateStartMonth!=null){
				depreciateDate=data.depreciateStartMonth.substring(0,10);
			}else{
				depreciateDate=data.depreciatePauseMonth.substring(0,10);
			}
			if($('#eqmgt_break_rq').val()<depreciateDate){
				Core.alert({message:'报废日期不能早于已经计提过折旧的日期'});
				return false;
			}
			var po={
					id:$('#eqmgt_break_id').text(),
					depreciateEndMonth:$('#eqmgt_break_rq').val()
			}
			Core.AjaxRequest({
				url : _global_settings.service.url+"/ac/"+new Base64().encode('tosys/coaReport/asset/scrap/'+currentUserInfo.id+'/'+currentUserInfo.loginId),
	            type: "PUT",
	            async:false,
	            params:po,
	            showMsg:false,
	            callback: function(res) {
	            	setCloseAlertTimeOneSecond();
	            	data.startDepreciate=='sell';
	            	$("#EquiGrid").jqxGrid('updatebounddata', 'cells');
	            }
			});
		});
		
		$("#eqmgt_sale_modal").jqxValidator({
    		animationDuration: 1,
    		hintType: 'label',
            rules: [
				{ input: '#eqmgt_sale_rq', message: "请选择", action: 'keyup, blur', 
					rule: function(input,commit){
	        		if(input.val()=='') return false;
        	   		return true;
					} 
				},
				{ input: '#eqmgt_sale_sr', message: "只能为大于0的数字", action: 'keyup, blur', 
					rule: function(input,commit){
	        		if(parseFloat(input.val())==input.val()&&input.val()>0) return true;
        	   		return false;
					} 
				}
				]
		});
		
		$("#eqmgt_break_modal").jqxValidator({
    		animationDuration: 1,
    		hintType: 'label',
            rules: [
				{ input: '#eqmgt_break_rq', message: "请选择", action: 'keyup, blur', 
					rule: function(input,commit){
	        		if(input.val()=='') return false;
        	   		return true;
					} 
				}				
				]
		});
	};
	
	/**
	 * 初始化grid
	 */
	this.initGrid = function(){
		
		me.settings.source.data = me.searchObj;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter(me.settings.grid.element, me.settings.source,  {
			beforeLoadComplete: function (records) {
//					console.log(records);
			},
			loadComplete:function(records){
//					console.log(records);
			}
		}, me.debug);
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[
					{ text: '资产编码', dataField: 'assetRef',width:'10%'/*,
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	  	            		var rtStr = '<div class="grida likea"  title="查看资产详情">';
	  	            		//var random=new Date().getTime();
	  	            		rtStr += '<a class="color-1193C5 hoverspan viewequipmentDetail viewabtn" data-btn="fms:asset:view">'+value+'</a>';
	  	            		rtStr += '</div>';
	  	            		return rtStr;
    	            	}*/
					},
					{ text: '资产名称', dataField: 'name',width:'15%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	  	            		var rtStr = '<div class="grida likea" title="查看资产详情">';
	  	            		//var random=new Date().getTime();
	  	            		rtStr += '<a class="color-1193C5 hoverspan viewequipmentDetail viewabtn" data-btn="fms:asset:view">'+value+'</a>';
	  	            		rtStr += '</div>';
	  	            		return rtStr;
    	            	}
					},
					{ text: '数量', dataField: 'qty',width:'10%'},
					{ text: '单价', dataField: 'price',cellsalign:'right', cellsformat: 'c2',width:'10%'},
					{ text: '资产原值', dataField: 'iniValue',cellsalign:'right', cellsformat: 'c2',width:'10%'},
					{ text: '月折旧/摊销额', dataField: 'monthlyDepreciateValue',cellsformat: 'c2',cellsalign:'right',width:'10%'},
					{ text: '累计折旧额', dataField: 'totalDepreciatedValue',cellsformat: 'c2',cellsalign:'right',width:'10%'},
   	  	            { text: "净残值",cellsalign:'right',width:"10%",sortable: false,
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	       	  	            var sumExpectVal = money(rowdata.iniValue * rowdata.scrapValueRatio / 100);
							var rtStr = '<div style="text-align: right;padding-top: 6px;padding-right:4px;">';
	  	            		rtStr += '￥'+sumExpectVal+'</div>';
	  	            		return rtStr;
       	  	            }
   	  	            },
   	  	            { text: "状态", dataField:"startDepreciate",width:"7%",cellsrenderer:codeRender},
   	  	            { text: "操作", align:"center",width:"8%",sortable: false,
       	  	           cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	       	  	            var rtStr = '<div style="text-align: center;padding-top: 2px;">';
	       	  	       		rtStr += '<a class="color-1193C5 hoverspan md-rate-review editEquipment editbtn" data-btn="fms:asset:update"  title="编辑"></a>';
	       	  	       		rtStr += '<a class="md-local-offer eqmgt_sale editbtn" data-toggle="modal" data-target="#eqmgt_sale_modal" data-btn="fms:asset:update" title="出售" ></a>';
	       	  	       		rtStr += '<a class="md-delete eqmgt_break editbtn" data-toggle="modal" data-target="#eqmgt_break_modal" data-btn="fms:asset:update" title="报废" ></a>';
	  	            		rtStr += '</div>';
	  	            		return rtStr;
       	  	            }
   	  	            }
	  	        ],
//		        	   columnsheight:me.settings.grid.columnsheight,
    	   pagesize: 10,
    	   pageSizeOptions: ['10', '20', '30'],
    	   columnsheight: 45
	    };
		$("#"+me.settings.grid.element).grid(grid_sets);
		//点击编辑按钮
		$("#EquiGrid").on("click",".editEquipment",function(e){
			var rowindex = $("#EquiGrid").jqxGrid('getselectedrowindex');
			if(rowindex>=0){
				var data = $("#EquiGrid").jqxGrid('getrowdata', rowindex);
				if(data.startDepreciate=='stopDepreciate'||data.startDepreciate=='scrap'||data.startDepreciate=='sell'){
					Core.alert({message:'当前状态不可编辑！'});
					return false;
				}
				$.addTab({title:"编辑资产", isFrame:false,url:ctx+"/page/modules/equipment/editequipment.html",pk:{data:data},reload:true});
			}
		});
		
		//出售
		$("#EquiGrid").on("click",".eqmgt_sale",function(e){
			var rowindex = $("#EquiGrid").jqxGrid('getselectedrowindex');
			if(rowindex>=0){
				var data = $("#EquiGrid").jqxGrid('getrowdata', rowindex);
				if(data.startDepreciate=='scrap'||data.startDepreciate=='sell'){
					Core.alert({message:'当前状态不可出售！'});
					return false;
				}
				$('#eqmgt_sale_rq').val(new Date());
				$('#eqmgt_sale_sr').val('');
				$('#eqmgt_sale_ye').text('');
				$('#eqmgt_sale_jsy').text('');
				$('#eqmgt_sale_id').text('');
				$('#eqmgt_sale_ye').text(money(data.iniValue-data.totalDepreciatedValue));
				$('#eqmgt_sale_id').text(data.id);
			}
		});
		
		//报废
		$("#EquiGrid").on("click",".eqmgt_break",function(e){
			var rowindex = $("#EquiGrid").jqxGrid('getselectedrowindex');
			if(rowindex>=0){
				var data = $("#EquiGrid").jqxGrid('getrowdata', rowindex);
				if(data.startDepreciate=='stopDepreciate'||data.startDepreciate=='scrap'||data.startDepreciate=='sell'){
					Core.alert({message:'当前状态不可报废！'});
					return false;
				}
				$('#eqmgt_break_rq').val(new Date());
				$('#eqmgt_break_id').text('');
				$('#eqmgt_break_id').text(data.id);
			}
		});
	};
	
	var obj={"condition":[],"filterscount":0,"groupscount":0,"sortorder":"desc","pagenum":0,"pagesize":20};
	var sub=new Base64().encode(JSON.stringify(obj));
	var sup = new Base64().encode('tosys/coaReport/asset/search/'+currentUserInfo.id+"/"+currentUserInfo.loginId);
	this.settings = {  
		source:{
	        datafields: [
	            { name: 'id', type: 'number'},         
	            { name: 'ownerId', type: 'number' },
	            { name: 'coaDepreciate', type:'ChartOfAccount'}, //折旧科目
	            { name: 'coaExpense', type: 'ChartOfAccount' },  //费用科目
	            { name: 'name', type:'string'},
	            { name: 'assetRef', type:'string'},
	            { name: 'purchaseDate', map:'purchaseDate'},
	            { name: 'iniValue', type:'float'},
	            { name: 'totalDepreciatedValue', type:'float'},
	            { name: 'scrapValueRatio', type:'float'},
	            { name: 'startDepreciate', type:'string'},
	            { name: 'depreciateMonth', type:'number'},
	            { name: 'depreciateStartMonth', map:'depreciateStartMonth'},
	            { name: 'depreciateEndMonth', map:'depreciateEndMonth'},
	            { name: 'monthlyDepreciateValue', type:'float'},
	            { name: 'createDate', type:'date'},
	            { name: 'createBy', type:'string'},
	            { name: 'lastUpdateDate', type:'date'},
	            { name: 'lastUpdateBy', type:'string'},
	            { name: 'price', type:'string'},
	            { name: 'qty', type:'string'},
	            { name: 'depreciatePauseMonth', type:'string'}
	        ],
	        url: url,
	        data:me.searchObj,
	    },
		grid:{element:"EquiGrid"},
		ajax:{url:url},
	};

	/**
	 * 查询列表数据
	 */
    this.searchDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('applyfilters');
    	$("#"+el).jqxGrid('refreshfilterrow'); 
    	$("#"+el).jqxGrid('clearselection');
    };
	
    /**
	 * 查询条件对象
	 */
	this.searchObj = {};
	
	/**
	 * 初始化搜索组件
	 */
	this.initSearch = function(){
		me.searchObj = {					//修改
		name:{value:[],action:"like"}
		};
	}
    /**
     * 刷新
     */
    this.refreshDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('updatebounddata', 'cells');
    	$("#"+el).jqxGrid('clearselection');
    	$('#'+el).jqxGrid('refreshdata');
    };
    
	    
}	


var EquipmentBssBindModle = function(equipmentBssMgt){
	var me = this;
	/**
	 * 查询
	 */
    this.search = function(){
		var sName = $("#equipment-name").val();
		equipmentBssMgt.searchObj.name.value = [];
		if(sName!=''){
			equipmentBssMgt.searchObj.name.value.push(sName);
		}
		
		equipmentBssMgt.searchDataInfo();
		
    }
    
  //查看资产详情
	$("#EquiGrid").on('click','.viewequipmentDetail', function (event){ 
		event.preventDefault();
		var rowindex = $("#EquiGrid").jqxGrid('getselectedrowindex');
		if(rowindex>=0){
			var data = $("#EquiGrid").jqxGrid('getrowdata', rowindex);
		    $.addTab({title:data.name, isFrame:false,url:ctx+"/page/modules/equipment/equipmentDetail.html",pk:{data:data,random:Math.random()},reload:true});
		}
	});
    
	this.bind = function(){
		//新增固定资产
		$("#addequipment-btn").on('click',function(){
			$.addTab({title:"新增固定资产", isFrame:false,url:ctx+"/page/modules/equipment/addequipment.html",reload:true});
		});
		
		$("#equipment-search").on({'click':me.search});
	};
	
	this.unbindAll = function(){
		$("#equipment-search").off('click');
		$("#addequipment-btn").off('click');
	};
	
}