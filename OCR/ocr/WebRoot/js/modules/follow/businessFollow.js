/*
 *查看商机跟进表js 
 */

var BusinessFollowMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/potential/';
	var currentRoleName = _global_settings.owner.roleName;
	this.debug=false;
	this.initInput=function(){
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
//		me.initInformation();
	}
	
	this.initUserPage=function(){
		$('#businessFollow-show').css('display','');
		
		$('#businessFollow-date').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		//选择时间改变时间
		$('#businessFollow-sDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#businessFollow-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#businessFollow-date').on('change',function(){
			var td = $('#businessFollow-date').attr('id');
			var sd = $('#businessFollow-sDate').attr('id');
			var ed = $('#businessFollow-eDate').attr('id');
			setValueById(td,sd,ed);
		});
		
		// 销售负责人
		var salesRd = null;
		if(getCurrentInfo() == 'sales' || getCurrentInfo() == 'sale'){
			salesRd = ComboBoxSources.getRecords('sale_name');
		}else{
			salesRd = ComboBoxSources.getRecords('salesInfo_name');
		}
		$('#businessFollow-sales').comboBox({
			theme : currentTheme,
			source : salesRd,
			searchMode : 'contains',
			displayMember : 'name_user',
			valueMember : 'employeeCode',
			height : 34,
			width : '100%',
			placeHolder:"请选择或输入"
		});
		
		$('#businessFollow-status').jqxDropDownList({
			source:{'all':'请选择','notContact':'未联系','notSuccess':'未成功','success':'已成功'},
			width:'100%',
			height:34,
			selectedIndex:0,
			dropDownHeight:150
		});
		
		$('#businessFollow-show').addClass('hiddendiv');
	}
	
	this.searchObj={};
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.setting.source.data = me.searchObj;
		me.setting.source.url = url+'page';
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('businessFollow', me.setting.source,{
			beforeLoadComplete:function(records){
				
			}	
		}, me.debug);
		
		//初始化Grid
		var grid_set = {
	  	    source:demoAdapter,
			columnsresize: false,
			autorowheight: true,
		    autoheight: true,
		    rendergridrows: function(){
	            return demoAdapter.recordids;
	        }
    	   ,columns:[								
				{ text: '新增日期',dataField:'lastUpdateDate',width:'7%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div style=" margin-top:-10px; position:relative; top:50%;text-overflow: ellipsis;">';
						return html+rowdatas.lastUpdateDate.substring(0,10)+'</div>';
					}
			    },
			    { text: '潜在客户',dataField:'potentialName',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div style=" margin-top:-10px; position:relative; top:50%; text-overflow: ellipsis;">';
						return html+rowdatas.potentialName+'</div>';
					}
				},
				{ text: '联系电话',dataField:'phone',width:'9%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div style=" margin-top:-10px; position:relative; top:50%; text-overflow: ellipsis;">';
						return html+rowdatas.phone+'</div>';
					}
				},
				{ text: '公司名称',dataField:'contact',width:'13%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div style=" margin-top:-10px; position:relative; top:50%; text-overflow: ellipsis;">';
						return html+rowdatas.contact+'</div>';
					}
				},
				{ text: '销售负责人(姓名/用户名)',width:'15%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
  	            		var html = '<div style=" margin-top:-10px; position:relative; top:50%; text-overflow: ellipsis;">';
						if(rowdatas.sal.length>0){
							$.each(rowdatas.sal,function(i,v){
								html+= getSalesInfoById(rowdatas.sal[i].id, null)===undefined || getSalesInfoById(rowdatas.sal[i].id, null) ==='' ? "" :
									getSalesInfoById(rowdatas.sal[i].id, null).name_user+'&nbsp; ';
							});
						}else{
							html += '';
						}
					return html+'</div>';
					}
  	            },
  	            { text: '客服负责人(姓名/用户名)',width:'15%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
  	            		var html = '<div style=" margin-top:-10px; position:relative; top:50%; text-overflow: ellipsis;">';
						if(rowdatas.custom.length>0){
							$.each(rowdatas.custom,function(i,v){
								html+= getCustomerInfoById(null, rowdatas.custom[i].employeeCode) === undefined || getCustomerInfoById(null, rowdatas.custom[i].employeeCode) ==='' ?'':
									getCustomerInfoById(null, rowdatas.custom[i].employeeCode).name_user+'&nbsp; ';
							});
						}else{
							html += '';
						}
					return html+'</div>';
					}
  	            },
			    { text: '状态',width:'5%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html = '';
						if(rowdatas.status=='success'){
							html+='<div style="margin-top:-6px; position:relative; top:50%;">'+'已成功'+'</div>';
						} 
						if(rowdatas.status=='notContact'){
							html+='<div style="margin-top:-6px; position:relative; top:50%;">'+'未联系'+'</div>';
						}
						if(rowdatas.status=='notSuccess'){
							html+='<div style="margin-top:-6px; position:relative; top:50%;">'+'未成功'+'</div>';
						}
						
						return html+'</div>';
					}
  	            },
				{ text: '备注详情',width:'26%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
						var html='';var a='';
				    	if(rowdatas.trackList!==undefined){
				    		for(var i=0; i<rowdatas.trackList.length; i++){
				    			a=rowdatas.trackList[i].lastUpdateDate+'&nbsp;,&nbsp;'+rowdatas.trackList[i].comment;
			    				html+='<div class="agrid" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis; height:auto; line-height:20px; font-size:13px;" title='+a+'>'+a+'</div>';
					    	}
				    	}
				    	return '<div style="height:auto;">'+html+'</div>';
			    	}
			    }
	  	    ],
    	   columnsheight: 45,
	    };
		$('#businessFollow').grid(grid_set);
	}
	
	this.setting = {  
		source:{ data:me.searchObj },
		grid:{element:'businessFollow'},
		ajax:{url:url},
	};
	this.initSearch=function(){
		me.searchObj={
//			sortdatafield:'createDate',	
			't.createDate':{value:[],action:'between'},
			potentialName:{value:[],action:'like'},
			phone:{value:[],action:'like'},
			contact:{value:[],action:'like'},
			status:{value:[],action:'eq'},
			's.username':{value:[],action:'like'},
			't.salesAgent.agentName':{value:[],action:'like'}
		};
		
		if(currentRoleName=='customerService'||currentRoleName=='salesStaff'){
			me.searchObj['s.id']={value:[''+_global_settings.owner.userid+''],action:'eq'};
		}
	}
	
	this.searchDataInfo = function(){
    	$('#businessFollow').jqxGrid('applyfilters');
    	$('#businessFollow').jqxGrid('refreshfilterrow'); 
    	$('#businessFollow').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#businessFollow').jqxGrid('updatebounddata', 'cells');
    	$('#businessFollow').jqxGrid('clearselection');
    	$('#businessFollow').jqxGrid('refreshdata');
    };
}

var BusinessFollowBindModle=function(businessFollowMgt){
	var me=this;
	
	this.search=function(bool){
		var salesVal = $('#businessFollow-sales').find('input').val();
		var salesSearchVal = salesVal.substring(salesVal.indexOf('(')+1,salesVal.length-1);
		
		var st = $('#businessFollow-sDate').val(),
			et = $('#businessFollow-eDate').val(),
			potentialName = $('#businessFollow-customer').val(),
			phone = $('#businessFollow-telephone').val(),
			contact = $('#businessFollow-company').val(),
			salesname = getSalesInfoByName(salesVal)==undefined?getSalesInfoByName(salesSearchVal)==undefined?'':getSalesInfoByName(salesSearchVal).username:getSalesInfoByName(salesVal).username,
			status = $('#businessFollow-status').val();
		
		//查询日期
		businessFollowMgt.searchObj['t.createDate'].value=[];
		if(st!=''&&et!=''){
			businessFollowMgt.searchObj['t.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		}
		
		if(st!=''&&et===''){
			businessFollowMgt.searchObj['t.createDate'].value.push(st+' '+'00:00:00');
			businessFollowMgt.searchObj['t.createDate'].action='ge';
		}
		
		if(st===''&&et!=''){
			businessFollowMgt.searchObj['t.createDate'].value.push(et +' '+'00:00:00');
			businessFollowMgt.searchObj['t.createDate'].action='le';
		}
		
		//潜在客户
		businessFollowMgt.searchObj.potentialName.value=[];
		if(potentialName!='')
			businessFollowMgt.searchObj.potentialName.value.push(potentialName);
		
		//联系电话
		businessFollowMgt.searchObj['phone'].value=[];
		if(phone!='')
			businessFollowMgt.searchObj['phone'].value.push(phone);

		//公司名称
		businessFollowMgt.searchObj['contact'].value=[];
		if(contact!='')
			businessFollowMgt.searchObj['contact'].value.push(contact);
		
		//销售负责人
		businessFollowMgt.searchObj['s.username'].value=[];
		if(salesname != '' && salesname !=null)
			businessFollowMgt.searchObj['s.username'].value.push(salesname);
		
		//	状态
		businessFollowMgt.searchObj.status.value=[];
		if(status!='all')
			businessFollowMgt.searchObj.status.value.push(status);
		
		if(bool===true){
			return businessFollowMgt.searchObj;
		}
		businessFollowMgt.searchDataInfo();
	}
	
	this.initInformation = function(){
    	var obj = getConditionParams(me.search(true));
    	
    	Core.AjaxRequest({
            type: "GET",
            async: false,
            url: _global_settings.service.url+'/potential/followup/'+obj,
            callback: function (res) {
            	$('#readyFollowBusiness').text(res.noFollowUp);
            	$('#alreadyFollowBusiness').text(res.isFollowUp);
            },
            failure: function (e) {
            }
        });
	}
	
	this.bind=function(){
		//点击搜索
		$('#businessFollow-search').off('click').on('click',function(){
			if($('#businessFollow-show').is(':hidden')){
				$('#businessFollow-show').slideDown('slow');
			}else{
				me.search();
				me.initInformation();
			}
		});
		
		hiddenAclick();
		
		//导出
		$('#businessFollow-export').off('click').on('click', function() {
			var url = _global_settings.service.url+'/common/export/potential/';
			var obj = getConditionParams(me.search(true));
			$.openHref(url + obj + '?t='+Math.random() );
		});
	}
	
	this.unbindAll=function(){
		
	}
}
