var viewDetail=function(){
	var me=this;
	var url=_global_settings.service.url+'/overview/search/orderlist';
	var vduser=null;
	
	this.initInput=function(){
		me.initPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initPage=function(){
		if($.pk.vduser!=undefined){
			vduser=$.pk.vduser;
			$('#vduname').text(vduser.name);
			$('#vdphone').text(vduser.phone);
		}
		console.log(vduser);
	}
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'so.ownerId':{value:[''+vduser.ownerId+''],action:'eq'}			
		}
		if(vduser.type!=null){
			me.searchObj['so.serviceType']={value:[''+vduser.type+''],action:'eq'}
		}
	}
	
	this.initGrid=function(){
		var source={
			url:url,
	        data:me.searchObj
	    }
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('vdGrid', source,{
			beforeLoadComplete:function(records){
				
			},
			loadComplete:function(rd){
			}
		}, false);
		
		//初始化Grid
		var	grid_sets = {
	  	    source:demoAdapter,
	  	    rendergridrows: function(){
                 return demoAdapter.recordids;
            },
            columns:me.initColumns(),
    	    pagesize: 20,
    	    columnsheight: 45
	    };
		
		$('#vdGrid').grid(grid_sets);
	}
	
	this.initColumns=function(){
		var columns=[
				{ text: '单号',dataField:'orderNumber', width:'11%'/*,hidden:true*/},
				{ text: '服务类型', width:'11%',
					cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
						var html='<div class="agrid">';
						return html+getCodeData(rowdata.serviceType)+'</div>';
					}
				},
				{ text: '状态',width:'12%',
					cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
						var html='<div class="agrid">';
						return html+getCodeData(rowdata.orderType)+'</div>';
					}
				},
				{ text: '负责人',dataField:'responsibleName',width:'11%'},
				{ text: '提交时间',dataField:'submitDate',width:'11%'},
				{ text: '接单时间',dataField:'orderSuccessDate',width:'11%'},
				{ text: '完成时间',dataField:'orderSubmitDate',width:'11%'},
				{ text: '审核时间',dataField:'checkSuccessDate',width:'11%'},
			    { text: '用户确认时间',dataField:'completeDate',width:'11%'}
			];
		
		return columns;
	}
}