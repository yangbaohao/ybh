/*
 * 佣金申请界面js
 */
var ComnaMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/accountorder';
	this.debug=false;
	this.id=null;
	
	this.initInput=function(){
		me.initWindows();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initWindows=function(){
		$('#comnApySpWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:360,
			height:'auto',			
			minWidth: 700, 
			cancelButton: $('#comnApySpBackBtn'),
			initContent:function(){
				$('#comnApySp').jqxDropDownList({
					source:{'paid':'同意','notpaid':'拒绝'},
					height:34,
					width:'25%',
					selectedIndex:0
				});
			}
		}).on({
			'open':function(){		
				
			},
			'close':function(){
				setTimeout(function(){
					$('#comnApySp').jqxDropDownList({selectedIndex:0});
				},500);
			}
		});
	}
	
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('comnApyGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[								
				{ text: '日期',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:6px">';
						return html+rowdata.orderCreateDate.substring(0,10)+'</div>';
					}
				},
				{ text: '代理商编码',dataField:'agentCode',width:'10%'},
				{ text: '代理商用户名',dataField:'agentName',width:'15%'},
				{ text: '客户名称',dataField:'name',width:'15%'},
				{ text: '购买模块',dataField:'productName',width:'15%'},
  	            { text: '购买金额',dataField:'priceAmt',cellsalign:'right', cellsformat: 'c2',width:'15%'},
  	            { text: '提取佣金',dataField:'revenueAmt',cellsalign:'right',cellsformat:'c2',width:'10%'},
  	            { text: '操作',width:'10%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div style="padding-top:2px;text-align:center">';
						if(_global_settings.owner.roleName=='Sys_Admin')
							html += '<a class="hoverspan md-verified-user comnApy-sp" title="审批"></a>';
						
						return html+'</div>';
					}
  	            }
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#comnApyGrid').grid(grid_sets);
		
		//审批
		$('#comnApyGrid').on('click','.comnApy-sp',function(){
			var index = $('#comnApyGrid').jqxGrid('getselectedrowindex');
			var rowdata = $('#comnApyGrid').jqxGrid('getrowdata',index);
			me.id = rowdata.id;
			console.log(rowdata);
			$('#comnApySpWin').jqxWindow('open');
		});
		
	}	
	
	this.settings = {  
		source:{
	        url: url+'/search/page/01',
	        data:me.searchObj,
	    },
		grid:{element:'userGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			sortdatafield:'orderCreateDate'
		};
		
		if(_global_settings.owner.roleName=='salesStaff'){
			me.searchObj['ow.sales_id']={value:[''+_global_settings.owner.userid+''],action:'eq'};
		}
	}
	
	this.searchDataInfo = function(){
    	$('#comnApyGrid').jqxGrid('applyfilters');
    	$('#comnApyGrid').jqxGrid('refreshfilterrow'); 
    	$('#comnApyGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#comnApyGrid').jqxGrid('updatebounddata', 'cells');
    	$('#comnApyGrid').jqxGrid('clearselection');
    	$('#comnApyGrid').jqxGrid('refreshdata');
    };
}

var ComnaBindModle=function(comnaMgt){
	var me=this;
	
	this.bind=function(){
		//保存审批处理
		$('#comnApySpPassBtn').on('click',function(){
			console.log(comnaMgt.id);
			Core.AjaxRequest({
				url:_global_settings.service.url+'/agentrevenue/examine',
				type:'POST',
				params:{id:comnaMgt.id,remark:$('#comnApySpAdvice').val(),payStatus:$('#comnApySp').val()},
				async:false,
				callback:function(){
					$('#comnApySpWin').jqxWindow('close');
					$('#comnApyGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
					
				}
			});
		});
	}
	
	this.unbindAll=function(){
		$('#comnApySpPassBtn').off('click');
	}
}
