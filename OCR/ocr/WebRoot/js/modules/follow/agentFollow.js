/*
 *查看代理商跟进表js 
 */

var AgentFollowMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/salesagent/follow';
	this.debug=false;
	this.initInput=function(){
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initUserPage=function(){
		$('#agentFollow-show').css('display','');
		
		$('#agentFollow-date').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		//选择时间改变时间
		$('#agentFollow-sDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#agentFollow-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#agentFollow-date').on('change',function(){
			var td = $('#agentFollow-date').attr('id');
			var sd = $('#agentFollow-sDate').attr('id');
			var ed = $('#agentFollow-eDate').attr('id');
			setValueById(td,sd,ed);
		});
		
		// 销售负责人
		var salesRd = null;
		if(getCurrentInfo() == 'sales' || getCurrentInfo() == 'sale'){
			salesRd = ComboBoxSources.getRecords('sale_name');
		}else{
			salesRd = ComboBoxSources.getRecords('salesInfo_name');
		}
		$('#agentFollow-sales').comboBox({
			theme : currentTheme,
			source : salesRd,
			searchMode : 'contains',
			displayMember : 'name_user',
			valueMember : 'employeeCode',
			height : 34,
			width : '100%',
			placeHolder:"请选择或输入"
		});
		
		
		// 客服
		$('#agentFollow-kefu').comboBox({
			theme : currentTheme,
			source : ComboBoxSources.getRecords('custService_name'),
			searchMode : 'contains',
			displayMember : 'name_user',
			valueMember : 'employeeCode',
			height : 34,
			width : '100%',
			placeHolder:"请选择或输入"
		});
		
		$('#agentFollow-show').addClass('hiddendiv');
	}
	
	this.searchObj={};
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.setting.source.data = me.searchObj;
		me.setting.source.url = url;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('agentFollow', me.setting.source,{
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
				{ text: '注册日期',dataField:'createDate',width:'8%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="agrid" style=" margin-top:-15px; position:relative; top:50%;text-overflow: ellipsis;">';
						return html+rowdatas.userInfo.createDate.substring(0,10)+'</div>';
					}
			    },
			    { text: '代理商名称',dataField:'agentName',width:'8%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="agrid" style=" margin-top:-15px; position:relative; top:50%; text-overflow: ellipsis;">';
						return html+rowdatas.agentName+'</div>';
					}
				},
				{ text: '联系电话',dataField:'telephone',width:'9%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="agrid" style=" margin-top:-15px; position:relative; top:50%; text-overflow: ellipsis;">';
						return html+rowdatas.userInfo.telephone+'</div>';
					}
				},
				{ text: '销售负责人(姓名/用户名)',width:'12%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html = '<div class="agrid" style=" margin-top:-15px; position:relative; top:50%; text-overflow: ellipsis;">';
							/*html += rowdatas.sales==undefined || rowdatas.sales=='' || rowdatas.sales== null ? '' :
								getSalesInfoById(null, rowdatas.employeeCode) ==undefined ? '' : getSalesInfoById(null, rowdatas.employeeCode).name_user;*/
						var vals = getSatffInfoByKey({
							keys : 'employeeCode',
							map : 'salesInfo_name',
							words : (rowdatas.sales==undefined || rowdatas.sales=='' || rowdatas.sales== null )? '' : rowdatas.sales.employeeCode
						});
						html += (vals===undefined || vals==='' || vals===null) ? '' : vals.name_user;
						return html+'</div>';
					}
			    },
			    { text: '客服人员(姓名/用户名)',width:'12%',
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
			    		var html = '<div class="agrid" style=" margin-top:-15px; position:relative; top:50%; text-overflow: ellipsis;">';
							/*html += rowdatas.customer == undefined || rowdatas.customer == '' || rowdatas.customer == null ? '':
								getCustomerInfoById(null, rowdatas.customer) === undefined ? '' : getCustomerInfoById(null, rowdatas.customer).name_user;*/
			    		var vals = getSatffInfoByKey({
							keys : 'employeeCode',
							map : 'custService_name',
							words : (rowdatas.customer==undefined || rowdatas.customer=='' || rowdatas.customer== null )? '' : rowdatas.customer.employeeCode
						});
						html += (vals===undefined || vals==='' || vals===null) ? '' : vals.name_user;
						return html+'</div>';
						
					}
			    },
			    { text: '标签',width:'8%',
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html = '<div class="agrid" style="margin-top:-15px; position:relative; top:50%;">';
							html+=rowdatas.lebal==undefined?'':rowdatas.lebal;
						return html+'</div>';
					}
			    },
				{ text: '备注详情',width:'43%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
						var html='';var a='';
				    	if(rowdatas.trackList!==undefined){
				    		for(var i=0; i<rowdatas.trackList.length; i++){
				    			a=rowdatas.trackList[i].lastUpdateDate.substring(0.10)+'&nbsp;,&nbsp;'+rowdatas.trackList[i].comment;
			    				html+='<div class="agrid" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis; height:auto; line-height:20px; font-size:13px;">'+a+'</div>';
					    	}
				    	}
				    	return '<div style="height:auto;">'+html+'</div>';
			    	}
			    }
	  	    ],
    	   columnsheight: 45,
	    };
		$('#agentFollow').grid(grid_set);
	}
	
	this.setting = {  
			source:{ data:me.searchObj },
			grid:{element:'agentFollow'},
			ajax:{url:url},
		};
	this.initSearch=function(){
		me.searchObj={
			's.userInfo.createDate':{value:[],action:'between'},
			's.agentName':{value:[],action:'like'},
			's.userInfo.telephone':{value:[],action:'like'},
			's.sales.username':{value:[],action:'like'},
			's.customer.username':{value:[],action:'like'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#agentFollow').jqxGrid('applyfilters');
    	$('#agentFollow').jqxGrid('refreshfilterrow'); 
    	$('#agentFollow').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#agentFollow').jqxGrid('updatebounddata', 'cells');
    	$('#agentFollow').jqxGrid('clearselection');
    	$('#agentFollow').jqxGrid('refreshdata');
    };
}

var AgentFollowBindModle=function(agentFollowMgt){
	var me=this;
	
	this.search=function(bool){
		
		var sDate = $('#agentFollow-sDate').val(),
			eDate = $('#agentFollow-eDate').val(),
			name = $('#agentFollow-name').val(),
			telephone=$('#agentFollow-telephone').val(),
			employeeCode = $('#agentFollow-sales').val(),
			customerCode = $('#agentFollow-kefu').val();
		
		//查询日期
		agentFollowMgt.searchObj['s.userInfo.createDate'].value=[];
		if(sDate!='' && eDate!=''){
			agentFollowMgt.searchObj['s.userInfo.createDate'].value.push(sDate+' '+'00:00:00',eDate+' '+'23:59:59');
		}
		
		if(sDate!='' && eDate===''){
			agentFollowMgt.searchObj['s.userInfo.createDate'].value.push(sDate+' '+'00:00:00');
			agentFollowMgt.searchObj['s.userInfo.createDate'].action='ge';
		}
		
		if(sDate==='' && eDate!=''){
			agentFollowMgt.searchObj['s.userInfo.createDate'].value.push(eDate+' '+'00:00:00');
			agentFollowMgt.searchObj['s.userInfo.createDate'].action='le';
		}
		
		//用户名称
		agentFollowMgt.searchObj['s.agentName'].value=[];
		if(name!=''){
			agentFollowMgt.searchObj['s.agentName'].value.push(name);
		}
		//联系电话
		agentFollowMgt.searchObj['s.userInfo.telephone'].value=[];
		if(telephone!='')
			agentFollowMgt.searchObj['s.userInfo.telephone'].value.push(telephone);

		//销售负责人
		agentFollowMgt.searchObj['s.sales.username'].value=[];
		if(employeeCode != null && employeeCode != '' && employeeCode != undefined){
			agentFollowMgt.searchObj['s.sales.username'].value.push(employeeCode);
		}
		
		//客服
		agentFollowMgt.searchObj['s.customer.username'].value=[];
		if(customerCode != null && customerCode !='' && customerCode != undefined){
			agentFollowMgt.searchObj['s.customer.username'].value.push(customerCode);
		}
		
		if(bool===true){
			return agentFollowMgt.searchObj;
		}
		
		agentFollowMgt.searchDataInfo();
	}

	this.initInformation = function(){
    	var obj = getConditionParams(me.search(true));
    	Core.AjaxRequest({
            type: "GET",
            async: false,
            url: _global_settings.service.url+'/salesagent/followup/'+obj,
            callback: function (res) {
            	$('#readyFollowAgent').text(res.noFollowUp);
            	$('#alreadyFollowAgent').text(res.isFollowUp);
            },
            failure: function (e) {
            }
        });
	}
	
	this.bind=function(){
		//点击搜索
		$('#agentFollow-search').on('click',function(){
			if($('#agentFollow-show').is(':hidden')){
				$('#agentFollow-show').slideDown('slow');
			}else{
				me.initInformation();
				me.search();
			}
		});
		
		hiddenAclick();
		
		//导出
		$('#agentFollow-export').off('click').on('click', function() {
			var url = _global_settings.service.url+'/common/export/follow/';
			var obj = getConditionParams(me.search(true));
			$.openHref(url + obj + '?t='+Math.random() );
		});
	}
	
	this.unbindAll=function(){
		$('#agentFollow-search').off('click');
	}
}
