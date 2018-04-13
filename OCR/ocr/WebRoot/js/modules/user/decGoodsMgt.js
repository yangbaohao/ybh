/*
 * 报税界面js
 */

var DecGoodsMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/common';
	this.debug=false;
	
	this.initInput=function(){
		$('#decGoods-company').text(currentUserInfo.name);
		$('#decGoods-tax').text('：'+getCodeData(currentUserInfo.taxType));
		$('#decGoods-taxCode').text(currentUserInfo.owerTaxCode);
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	/**
	 * getTaxerInfo 拉出所有报税人名单,姓名,id
	 */
	var getTaxerInfo=function(username){
		var rd = ComboBoxSources.getRecords('taxerInfo');
		for(i=0;i<rd.length;i++){
			if(username==rd[i].username){
				return rd[i];
			}
		}
		
		if(!username){
			return '';
		}
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
//		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('decGoodsMgtGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var	grid_sets = {
	  	     source:demoAdapter
		     ,rendergridrows: function(res){
                  return demoAdapter.recordids;
             }
    	     ,columns:[
						{ text: '日期',dataField:'mouthDate',width:'20%'},
						{ text: '报税人',dataField:'username',width:'20%',
							cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
								var html='';
			   	  	            if(rowdata.taxer=='AdminAccount'){
				   	  	       		html+='<div>代理报税</div>';
				   	  	   	    }else{
				   	  	   			if(getTaxerInfo(rowdata.username)!=undefined){
				   	  	   				if(getTaxerInfo(rowdata.username).username == rowdata.username){
				   	  	   					html+='<div>'+getTaxerInfo(rowdata.username).name+'</div>';
				   	  	   				}
				   	  	   			}else{
				   	  	   				html+='<div>'+rowdata.username+'</div>';
				   	  	   			}
				   	  	   		}
				   	  	   		return '<div style="height: auto;position:absolute;top:44%;">'+html+'</div>';
							}
						},
						{ text: '增值税率(%)',dataField:'vat',width:'20%'},
						{ text: '状态',dataField:'taxStatus',width:'20%'/*,
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="padding-top:6px">';
								return html+getCodeData(rowdata.taxProgressType)+'</div>';
							}*/
						},
						{ text: '操作',width:'20%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div style="text-align:center">';
								html += '<a class="hoverspan md-label decGoodsMgtBtn" title="报税"></a>';
								return html+'</div>';
							}
						}
    	            ],
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#decGoodsMgtGrid').grid(grid_sets);
		
		//点击报税
		$('#decGoodsMgtGrid').on('click','.decGoodsMgtBtn',function(){
			var index = $('#decGoodsMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#decGoodsMgtGrid').jqxGrid('getrowdata',index);

				if(rowdata.taxwithStatus){
					Core.alert({
						message:currentUserInfo.name+','+rowdata.mouthDate+'已报税！'
					});
					return false;
				}
				
				var obj={};
				obj.mouthDate = rowdata.mouthDate,obj.ownerId = rowdata.ownerId,
				obj.productName = rowdata.productName,obj.taxStatus = rowdata.taxStatus,
				obj.vat = rowdata.vat;
				console.log(obj);
				Core.confirm({
					message:currentUserInfo.name+','+rowdata.mouthDate+'是否已成功报税？',
					confirmCallback:function(){
						Core.AjaxRequest({
							type:'POST',
							url:url+'/tax/save',
							async:false,
							params:obj,
							showMsg:false,
							callback:function(){
								setCloseAlertTimeOneSecond();
								$('#decGoodsMgtGrid').jqxGrid('updatebounddata','cells');
							},
							failure:function(err){
								Core.alert({
									message:err.responseJSON.errorMsg,
									callback:function(){
									}
								})
							}
						});
					},
					cancelCallback:function(){
						
					}
				});
			}
		});
	}	
	
	this.settings = {  
		source:{
	        url: url+'/tax/search/'+currentUserInfo.id+'/'+currentUserInfo.loginId,
	        data:me.searchObj,
	    },
		grid:{element:'decGoodsMgtGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
				//
		};
	}
	
	this.searchDataInfo = function(){
    	$('#decGoodsMgtGrid').jqxGrid('applyfilters');
    	$('#decGoodsMgtGrid').jqxGrid('refreshfilterrow'); 
    	$('#decGoodsMgtGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#decGoodsMgtGrid').jqxGrid('updatebounddata', 'cells');
    	$('#decGoodsMgtGrid').jqxGrid('clearselection');
    	$('#decGoodsMgtGrid').jqxGrid('refreshdata');
    };
}

var DecGoodsBindModle=function(decGoodsMgt){
	var me=this;
	
	this.bind=function(){
		
	}
	
	this.unbindAll=function(){
		
	}
}