/*
*项目审核界面js
*/

var AuMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/applyloan';
	this.debug=false;
	this.id=null;
	
	this.initInput=function(){
		me.initPage();
		me.initWindows();
		me.initGrid(me.searchObj);
	}
	
	this.searchObj={
//		'ap.investigators':{value:[],action:'like'},
//		'ap.cooperatedInvestigators':{value:[],action:'like'},
		'ap.loanResponsible':{value:[],action:'like'},
		'ap.projectName':{value:[],action:'like'},
		'ap.createDate':{value:[],action:'between'},
		'ap.loanState':{value:[],action:'eq'},
		'en.name':{value:[],action:'like'}
	}
	
	this.initPage=function(){
		$('#proAudit-show').css('display','');
		
		$('#proAudit-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#proAudit-sTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		$('#proAudit-eTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		
		$('#proAudit-time').on('change',function(){
			setValueById('proAudit-time','proAudit-sTime','proAudit-eTime');
		});
		
		$('#proAudit-status').dropDownlist({
			source:{'all':'全部','Pending':'待审','Approved':'已批','Refuse':'已拒'},
			height:34,
			width:'100%',
			selectedIndex:0
		});
		
		$('#proAudit-show').addClass('hiddendiv');
	}
	
	this.initWindows=function(){
		$('#proAuditWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:450,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#proAuditCancleBtn'),
			initContent:function(){
				
			}
		}).on({
			'close':function(){
				setTimeout(function(){
					$('#proAuditWin-opinion').val('');
				},500);
			}
		});
		
		$('#viewProAuditWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:350,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#viewProAuditCancleBtn'),
			initContent:function(){
				
			}
		}).on({
			'close':function(){
			}
		});
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('proAuditGrid', me.settings.source,{
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
				{ text: '申请日期',dataField:'createDate',width:'14.2%'/*,
	    		    cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            		return html+rowdata.createDate.substring(0,10)+'</div>';
					}*/
				},
				{ text: '公司名称',dataField:'companyName',width:'18.8%'},
//				{ text: '贷款项目名称',dataField:'projectName',width:'14%'},
//				{ text: '申报部门',dataField:'declarationDepartment',width:'12.5%'},
//				{ text: '主办调查人',dataField:'investigators',width:'12.5%'},
				{ text: '用户名',dataField:'createBy',width:'12%'},
				{ text: '贷款负责人',dataField:'peopleName',width:'12%'},
				{ text: '联系电话',dataField:'tel',width:'14.2%'},
  	            { text: '状态',width:'14.2%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
	            		var html = '<div class="agrid">';
	            		return html+getCodeData(rowdata.loanState)+'</div>';
					}
  	            }, 
  	          	{ text: '操作',width:'14.2%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) { 
  	            		var html = '<div class="text-center">';
//  	            			html += '<a class="hoverspan md-assignment-returned loadProAudit" title="下载查看"></a>';
  	            			html += '<a class="hoverspan md-verified-user paProAudit" title="审批"></a>';
  	            			html += '<a class="hoverspan md-cancel deleteProAudit" title="删除"></a>';
  	            			html += '<a class="hoverspan md-description viewProAudit" title="审批历史"></a>';
  	            		return html+'</div>';
					}
  	          	}
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#proAuditGrid').grid(grid_sets);
		
		//点击下载查看
		$('#proAuditGrid').on('click','.loadProAudit',function(){
			var index = $('#proAuditGrid').jqxGrid('getselectedrowindex');
			var data = $('#proAuditGrid').jqxGrid('getrowdata',index);
//			console.log(data);
			window.open(_global_settings.service.url+'/common/file/'+data.fileId);
			
		});
		
		//点击审批
		$('#proAuditGrid').on('click','.paProAudit',function(){
			var index = $('#proAuditGrid').jqxGrid('getselectedrowindex');
			var data = $('#proAuditGrid').jqxGrid('getrowdata',index);
			me.id = data.id;
			
			if(data.loanState=='Approved'){
				Core.alert({message:'审批状态为已批，不需要审批！'});
				return false;
			}
			
			$('#proAuditWin').jqxWindow('open');
			proAuditw('proAuditWinGrid',data.remark);
		});
		
		//点击审批历史
		$('#proAuditGrid').on('click','.viewProAudit',function(){
			var index = $('#proAuditGrid').jqxGrid('getselectedrowindex');
			var data = $('#proAuditGrid').jqxGrid('getrowdata',index);
			me.id = data.id;
			$('#viewProAuditWin').jqxWindow('open');
			proAuditw('viewProAuditWinGrid',data.remark);
		});
		
		//点击删除
		$('#proAuditGrid').on('click','.deleteProAudit',function(){
			var index = $('#proAuditGrid').jqxGrid('getselectedrowindex');
			var data = $('#proAuditGrid').jqxGrid('getrowdata',index);

			if(data.loanState!='Approved') {
				Core.alert({message:'审批状态为'+getCodeData(data.loanState)+'，不可删除！'});
				return false;
			}
			
			Core.confirm({
				message:'确定要删除吗？',
				confirmCallback:function(){
					Core.AjaxRequest({
						url:url+'/delete/'+data.id,
						type:'GET',
						async:false,
						callback:function(){
							$('#proAuditGrid').jqxGrid('updatebounddata', 'cells');
						}
					});
				}
			});
//			console.log(data);
		});
	}
	
	//审批窗口//审批历史窗口
	var proAuditw=function(gd,remark){
			
		var se={
			localdata: remark,
            datatype: 'array'
	    }
		
		var demo = new $.jqx.dataAdapter(se);
		
		//初始化Grid
		$('#'+gd).jqxGrid({
            source: demo,
            width:'100%',
            height:160,
            pageable:false,
            columns: [
              { text: '更新人',dataField:'lastUpdateBy',width:'33.3%' },
              { text: '备注',dataField:'remark',width:'33.3%' },
              { text: '更新时间',dataField:'createDate',width:'33.4%' }
            ]
        });
	}
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'proAuditGrid'},
		ajax:{url:url},
	};
	
	this.searchDataInfo = function(){
    	$('#proAuditGrid').jqxGrid('applyfilters');
    	$('#proAuditGrid').jqxGrid('refreshfilterrow'); 
    	$('#proAuditGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#proAuditGrid').jqxGrid('updatebounddata', 'cells');
    	$('#proAuditGrid').jqxGrid('clearselection');
    	$('#proAuditGrid').jqxGrid('refreshdata');
    };
}

var AuBindModle=function(auMgt){
	var me=this;
	var url=_global_settings.service.url+'/applyloan';
	
	this.search=function(){
		var /*investigators=$('#proAudit-user').val(),*/
			/*cooperatedInvestigators=$('#proAudit-usert').val(),*/
			loanResponsible=$('#proAudit-head').val(), 
			projectName=$('#proAudit-proname').val(),
			st=$('#proAudit-sTime').val(),et=$('#proAudit-eTime').val(),
			loanState=$('#proAudit-status').val(),name=$('#proAudit-compname').val();
		
//		auMgt.searchObj['ap.investigators'].value=[];
//		if(investigators!='')
//			auMgt.searchObj['ap.investigators'].value.push(investigators);
		
//		auMgt.searchObj['ap.cooperatedInvestigators'].value=[];
//		if(cooperatedInvestigators!='')
//			auMgt.searchObj['ap.cooperatedInvestigators'].value.push(cooperatedInvestigators);
		
		auMgt.searchObj['ap.loanResponsible'].value=[];
		if(loanResponsible!='')
			auMgt.searchObj['ap.loanResponsible'].value.push(loanResponsible);
		
		auMgt.searchObj['ap.projectName'].value=[];
		if(projectName!='')
			auMgt.searchObj['ap.projectName'].value.push(projectName);
		
		auMgt.searchObj['ap.createDate'].value=[];
		if(st!=''&&et!='')
			auMgt.searchObj['ap.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		
		auMgt.searchObj['ap.loanState'].value=[];
		if(loanState!='all')
			auMgt.searchObj['ap.loanState'].value.push(loanState);
		
		auMgt.searchObj['en.name'].value=[];
		if(name!='')
			auMgt.searchObj['en.name'].value.push(name);
		
		auMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#proAudit-search').on('click',function(){
			if($('#proAudit-show').is(':hidden'))
				$('#proAudit-show').slideDown('slow');
			else 
				me.search();
		});
		
		hiddenAclick();
		
		//审批通过，审批不通过
		$('#proAuditAgreeBtn,#proAuditRejectBtn').on('click',function(){
			var tid = $(this).attr('id');
			var obj={};
			obj.loanState=null;
			obj.id=auMgt.id;
			obj.remark=[{'remark':$('#proAuditWin-opinion').val()}];
			
			if(tid=='proAuditAgreeBtn')
				obj.loanState='Approved';
			else
				obj.loanState='Refuse';
			
			Core.AjaxRequest({
				url:url,
				type:'PUT',
				params:obj,
				async:false,
				callback:function(){
					$('#proAuditWin').jqxWindow('close');
					$('#proAuditGrid').jqxGrid('updatebounddata', 'cells');
				}
			});
//			console.log(obj);
			
		});
		
	}
	
	this.unbindAll=function(){
		$('#proAudit-search').off('click');
	}
}