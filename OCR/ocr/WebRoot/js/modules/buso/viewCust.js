/*
 * 查看潜在客户界面js
*/

var ViewCustMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/potentialCustomers';
	this.id=null;
	
	this.initInput=function(){
		$('#viewCustTime').text($.pk.date.substring(0,10));
		$('#viewCustZt').text($.pk.batchNum);
		
		me.initWindows();
//		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
		batchNum:{value:[''+$.pk.batchNum+''],action:'eq'}	
	};
	
//	this.initSearch=function(){
//		me.searchObj={
//				
//		};
//	}
	
	this.initWindows=function(){
		$('#viewCustMgtWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:460,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#viewCustMgtCancleBtn'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				$('#viewCustRemark').val('');
			}
		});
	
		$('#mesEditCustWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:300,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#cancelMesEditCustBtn'),
			initContent:function(){
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#meseditwin-editcust').val('');
				$('#meseditwin-editphone').val('');
			},500);
		});
		
		$('#mesCustSendWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:700,
			minHeight:300,
			height:'auto',			
			minWidth: 600, 
			maxWidth:800, 
			cancelButton: $('#cancelCustSendBtn'),
			initContent:function(){
				
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#messendwin-code').val('');
				$('#messendwin-zt').val('');
				$('#messendwin-mes').val('');
			},500);
		});
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewCustGrid', me.settings.source,{
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
						{ text: '潜在客户',width:'15%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
									html += '<a class="hoverspan viewCustDetail">'+rowdata.potentialName+'</a>';
								return html+'</div>';
							}
						},
						{ text: '职位',dataField:'potentialPosition',width:'10%'},
						{ text: '联系电话',dataField:'phone',width:'10%'},
						{ text: '公司名称',dataField:'contact',width:'15%'},
						{ text: '企业类型',dataField:'companyType',width:'10%'},
						{ text: '地址区域',dataField:'address',width:'15%'},
						{ text: '主营行业',dataField:'industry',width:'15%'},
						{ text: '操作',width:'10%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid text-center" style="padding-top:2px">'; 
									html += '<a class="hoverspan md-add addRemark" title="增加备注"></a>';
									html += '<a class="hoverspan md-edit custEdit" title="编辑"></a>'; 
									html += '<a class="hoverspan md-exit-to-app mesSend" title="发送"></a>';
								return html+'</div>';
							}
						}
    	            ],
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#viewCustGrid').grid(grid_sets);
		
		//点击客户
		$('#viewCustGrid').on('click','.viewCustDetail',function(){
			var index = $('#viewCustGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#viewCustGrid').jqxGrid('getrowdata',index);
				console.log(rowdata);
				$.addTab({title:'短信详情',isFrame:false,url:'page/modules/buso/custDetail.html',
					pk:{custId:rowdata.id},reload:true});
			}
		});
		
		//点击增加备注
		$('#viewCustGrid').on('click','.addRemark',function(){
			var index = $('#viewCustGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#viewCustGrid').jqxGrid('getrowdata',index);
				me.id=rowdata.id;
				console.log(rowdata);
				$('#viewCustMgtWin').jqxWindow('open',function(){
					
					var se={
						localdata: rowdata.trackList,
			            datatype: 'array'
				    }
					
					var demo = new $.jqx.dataAdapter(se);;
					
					//初始化Grid
					$('#viewCustRemarkTbody').jqxGrid({
			            source: demo,
			            width:'100%',
			            height:160,
			            pageable:false,
			            columns: [
			              { text: '更新时间',dataField:'createDate',width:'50%' },
			              { text: '备注',dataField:'comment',width:'50%' },
			            ]
			        });
					
				});
			}
		});
		
		//点击编辑
		$('#viewCustGrid').on('click','.custEdit',function(){
			var index = $('#viewCustGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#viewCustGrid').jqxGrid('getrowdata',index);
				me.id=rowdata.id;
				$('#mesEditCustWin').jqxWindow('open',function(){
					$('#meseditwin-editcust').val(rowdata.potentialName);
					$('#meseditwin-editphone').val(rowdata.phone);
				});
			}
		});
		
		//点击发送
		$('#viewCustGrid').on('click','.mesSend',function(){
			var index = $('#viewCustGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#viewCustGrid').jqxGrid('getrowdata',index);
				me.id=rowdata.id;
				$('#mesCustSendWin').jqxWindow('open',function(){
					Core.AjaxRequest({
						async:false,
						url:_global_settings.service.url+'/salesagent/getcode/messagecode',
						type:'GET',
						dataType:'text',
						callback:function(res){
							$('#messendwin-code').val(res);
						},
						failure:function(){
							
						}
					});
				});
			}
		});
	}	
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'viewCustGrid'},
		ajax:{url:url},
	};
	
	this.searchDataInfo = function(){
    	$('#viewCustGrid').jqxGrid('applyfilters');
    	$('#viewCustGrid').jqxGrid('refreshfilterrow'); 
    	$('#viewCustGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#viewCustGrid').jqxGrid('updatebounddata', 'cells');
    	$('#viewCustGrid').jqxGrid('clearselection');
    	$('#viewCustGrid').jqxGrid('refreshdata');
    };
}

var ViewCustBindModle=function(viewCustMgt){
	var me=this;
	var url = _global_settings.service.url+'/potentialCustomersTrack';
	var urls=_global_settings.service.url+'/potentialCustomers';
	
	this.bind=function(){
		//保存添加备注  
		$('#viewCustMgtSaveBtn').on('click',function(){
			if($('#viewCustRemark').val().length>100){
				Core.alert({message:'短信内容100字以内'});
				return false;
			}
			
			console.log(viewCustMgt.id);
			var potentialCustomersId=viewCustMgt.id;
			Core.AjaxRequest({
				url:url,
				async:false,
				type:'POST',
				params:{'comment':$('#viewCustRemark').val(),potentialCustomersId:potentialCustomersId},
				callback:function(res){
					console.log(res);
					$('#viewCustMgtWin').jqxWindow('close');
					
					try{
						$('#viewCustGrid').jqxGrid('updatebounddata','cells');
					}catch(e){}
				},
				failure:function(res){
					
				}
			});
		});
		
		//保存编辑客户信息
		$('#saveMesEditCustBtn').on('click',function(){
			var potentialName = $('#meseditwin-editcust').val(),phone = $('#meseditwin-editphone').val();
			
			Core.AjaxRequest({
				url:urls+'/updateNameAndPhone',
				type:'PUT',
				async:false,
				params:{id:viewCustMgt.id,potentialName:potentialName,phone:phone},
				callback:function(){
					$('#mesEditCustWin').jqxWindow('close');
					$('#viewCustGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
					
				}
			});
			
		});
		
		//发送短信
		$('#saveCustSendBtn').on('click',function(){
			$('#saveCustSendBtn').attr('disabled',true);
			setTimeout(function(){
				$('#saveCustSendBtn').removeAttr('disabled');
			},2000);
			
			var obj={};
			
//			obj.sales={};
//			if(_global_settings.owner.roleName=='salesStaff'){
//				obj.sales={id:_global_settings.owner.userid};
//			}
				
			obj.messageCode = $('#messendwin-code').val();
			obj.messageContent = $('#messendwin-mes').val();
			obj.messageTitle = $('#messendwin-zt').val();
			obj.potentialCustomersId = viewCustMgt.id
			
			Core.AjaxRequest({
				type:'POST',
				url:urls+'/sendmessageToPerson',
				async:false,
				params:obj,
				callback:function(){
					//刷新.
					$('#mesCustSendWin').jqxWindow('close');
					$('#viewCustGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
					
				}
			});
		});
	}
	
	this.unbindAll=function(){
		$('#viewCustMgtSaveBtn').off('click');
		$('#saveMesEditCustBtn').off('click');
		$('#saveCustSendBtn').off('click');
	}
}
