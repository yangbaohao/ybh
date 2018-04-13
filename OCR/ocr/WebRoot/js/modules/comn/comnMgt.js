/*
 * 代理商佣金管理界面js
 */
var ComnMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/agentrevenue';
//	this.comnData=null;
	
	this.initInput=function(){
		me.set();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	//设置
	this.set=function(){
		Core.AjaxRequest({
			url:_global_settings.service.url+'/agentrevenue/total',
			type:'GET',
			showMsg:false,
			async:false,
			callback:function(res){
				console.log(res);
				$('#smnComn').text(money(res.fee));
				$('#hmnComn').text(money(res.isFee));
				$('#balComn').text(money(res.unFee));
			},
			failure:function(){
				
			}
		});
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('comnMgtGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(params){
                return demoAdapter.recordids;
            }
    	   ,columns:[
					{ text: '日期',dataField:'orderCreateDate',width:'18%'},
					{ text: '客户购买金额',dataField:'totalAmt',cellsformat: 'c2',width:'18%'},
					{ text: '应提佣金',dataField:'fee',cellsformat:'c2',width:'18%'},
					{ text: '已提佣金',dataField:'isFee',cellsformat:'c2',width:'18%'},
					{ text: '状态',width:'18%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="agrid">';
								html+=rowdata.payStatus=='paid'?'已提交':(rowdata.payStatus=='notpaid'?'未提取':'已申请');
//							if(rowdata.payStatus=='paid')
//								html += '已提取';
//							if(rowdata.payStatus=='notpaid')
//								html += '未提取';
//							if(rowdata.payStatus=='apply')
//								html += '已申请';
							return html+'</div>';
						}
					},
					{ text:'操作',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div class="text-center" title="查看审批记录">';
								html += '<a class="hoverspan md-dns viewProcess"></a>';
							return html+'</div>';
						}
					}
				],
    	   pagesize: 20,
    	   columnsheight: 45,
    	   ready:function(){
//    		   var rows = $('#comnMgtGrid').jqxGrid('source');
//    		   console.log(rows);
    	   }
	    };
		$('#comnMgtGrid').grid(grid_sets);
		
		//点击查看
		$('#comnMgtGrid').on('click','.viewProcess',function(){
			var index = $('#comnMgtGrid').jqxGrid('getselectedrowindex');
			var rowdata = $('#comnMgtGrid').jqxGrid('getrowdata',index);
			var list = rowdata.list==undefined?'no':rowdata.list;
			
			if($('#comn_modal').length==0){
				$.loadModal('page/common/segment/getComn.html',function(res){
					$('body').append(res);
					me.initComnModal(list);
				});
			}else{
				me.initComnModal(list);
			}
				
		});

	}
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'comnMgtGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'salesAgent.id':{value:[''+_global_settings.owner.id+''],action:'eq'}	
		};
	}
	
	this.searchDataInfo = function(){
    	$('#comnMgtGrid').jqxGrid('applyfilters');
    	$('#comnMgtGrid').jqxGrid('refreshfilterrow'); 
    	$('#comnMgtGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#comnMgtGrid').jqxGrid('updatebounddata', 'cells');
    	$('#comnMgtGrid').jqxGrid('clearselection');
    	$('#comnMgtGrid').jqxGrid('refreshdata');
    };
    
    this.initComnModal=function(list){
    	$('#comn_modal').modal('show');
    	
    	//查看界面
    	if(list){
    		$('#comn_table').addClass('hide');
    		$('#comn_tableView').removeClass('hide').find('tbody').find('tr:gt(0)').remove();
    		$('#saveComnBtn').addClass('hide');
    		$('#comn_text').text('查看审批记录');
    		
			if(list=='no'){
				var line='<tr><td class="text-center" colspan="4">暂无审批记录</td></tr>';
				$('#comn_tableView').find('tbody').append(line);
				return false;
			}
			
			$.each(list,function(i,v){
				var payStatus=list[i].payStatus=='notpaid'?'拒绝':'同意';
				var line = '<tr><td>'+list[i].createDate+'</td>'+
						'<td>'+list[i].createBy+'</td>'+
						'<td>'+payStatus+'</td>'+
						'<td>'+list[i].remark+'</td>'+'</tr>';
				
				$('#comn_tableView').find('tbody').append(line);
			});
    		
    	}else{
    		$('#comn_table').removeClass('hide');
    		$('#comn_tableView').addClass('hide');
    		$('#saveComnBtn').removeClass('hide');
    		$('#comn_text').text('提取佣金');
    	}
	}
}

var ComnBindModle=function(comnMgt){
	var me=this;
	
	this.bind=function(){
		$('#comn-btn').on('click',function(){
			if($('#comn_modal').length==0){
				$.loadModal('page/common/segment/getComn.html',function(res){
					$('body').append(res);
					comnMgt.initComnModal();
				});
			}else{
				comnMgt.initComnModal();
			}
		});
	}
	
	this.unbindAll=function(){
		$('#comn-btn').off('click');
	}
}