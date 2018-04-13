/*
 *查看用户跟进表js 
 */

var UserFollowMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user/search/userbuy/0/0/'+_global_settings.owner.roleName;
	this.debug=false;
	this.initInput=function(){
		me.initUserPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initUserPage=function(){
		$('#userFollow-show').css('display','');
		
		$('#userFollow-date').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		//选择时间改变时间
		$('#userFollow-sDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#userFollow-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#userFollow-date').on('change',function(){
			var td = $('#userFollow-date').attr('id');
			var sd = $('#userFollow-sDate').attr('id');
			var ed = $('#userFollow-eDate').attr('id');
			setValueById(td,sd,ed);
		});
		
		// 销售负责人
		var salesRd = null;
		if(getCurrentInfo() == 'sales' || getCurrentInfo() == 'sale'){
			salesRd = ComboBoxSources.getRecords('sale_name');
		}else{
			salesRd = ComboBoxSources.getRecords('salesInfo_name');
		}
		$('#userFollow-sales').comboBox({
			theme : currentTheme,
			source : salesRd,
			searchMode : 'contains',
			displayMember : 'name_user',
			valueMember : 'employeeCode',
			height : 34,
			width : '100%',
			placeHolder: "请选择或输入"
		});
		
		// 客服
		$('#userFollow-kefu').comboBox({
			theme : currentTheme,
			source : ComboBoxSources.getRecords('custService_name'),
			searchMode : 'contains',
			displayMember : 'name_user',
			valueMember : 'employeeCode',
			height : 34,
			width : '100%',
			placeHolder:"请选择或输入用户名"
		});
		
		$('#userFollow-show').addClass('hiddendiv');
	}
	
	this.searchObj={};
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.setting.source.data = me.searchObj;
		me.setting.source.url = url;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('userFollow', me.setting.source,{
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
						var html='<div class="agrid" style=" margin-top:-21px; position:relative; top:50%; text-overflow: ellipsis;">';
						return html+rowdatas.createDate.substring(0,10)+'</div>';
					}
			    },
			    { text: '用户名称',width:'13%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="agrid" style=" margin-top:-21px; position:relative; top:50%; text-overflow: ellipsis;">';
						return html+rowdatas.username+'<br />'+rowdatas.name+'</div>';
					}
				},
				{ text: '联系电话',dataField:'telephone',width:'9%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="agrid" style=" margin-top:-21px; position:relative; top:50%; text-overflow: ellipsis;">';
						return html+rowdatas.telephone+'</div>';
					}
				},
				{ text: '销售负责人(姓名/用户名)',width:'11%',
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html = '<div class="agrid" style="margin-top:-21px; position:relative; top:50%;">';
							html += rowdatas.employeeCode == undefined || rowdatas.employeeCode == '' || rowdatas.employeeCode == null ? '' : 
								getSalesInfoById(null, rowdatas.employeeCode) ==undefined ? '' : getSalesInfoById(null, rowdatas.employeeCode).name_user;
							return html+'</div>';
					}
			    },
			    { text: '客服人员(姓名/用户名)',width:'10%',
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html = '<div class="agrid" style="margin-top:-21px; position:relative; top:50%;">';
							html += rowdatas.customerCode == undefined || rowdatas.customerCode == '' || rowdatas.customerCode == null ? '' :
								getCustomerInfoById(null, rowdatas.customerCode) ? '' : getCustomerInfoById(null, rowdatas.customerCode).name_user;
						return html+'</div>';
					}
			    },
			    { text: '标签',width:'9%',
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html = '<div class="agrid" style="margin-top:-21px; position:relative; top:50%;">';
							html += rowdatas.lebal == undefined || rowdatas.lebal == null || rowdatas.lebal == '' ? '' : rowdatas.lebal;
						return html+'</div>';
					}
			    },
				{ text: '备注详情',width:'40%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
						var html='';var a='';
				    	if(rowdatas.remark!==undefined){
				    		for(var i=0; i<rowdatas.remark.length; i++){
				    			a=rowdatas.remark[i].createDate+'&nbsp;,&nbsp;'+rowdatas.remark[i].remark;
			    				html+='<div class="agrid" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis; height:auto; line-height:20px; font-size:13px;" title='+a+'>'+a+'</div>';
					    	}
				    	}
				    	return '<div style="height:auto;">'+html+'</div>';
			    	}
			    }
	  	    ],
    	   columnsheight: 50,
	    };
		$('#userFollow').grid(grid_set);

	}
	
	this.setting = {  
			source:{ data:me.searchObj },
			grid:{element:'userFollow'},
			ajax:{url:url},
		};
	this.initSearch=function(){
		me.searchObj={
			'owner0.createDate':{value:[],action:'between'},
			'owner0.loginId':{value:[],action:'like'},
			'owner0.regTelephone':{value:[],action:'like'},
			'owner0.employeeCode':{value:[],action:'eq'},
			'owner0.customerCode':{value:[],action:'eq'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#userFollow').jqxGrid('applyfilters');
    	$('#userFollow').jqxGrid('refreshfilterrow'); 
    	$('#userFollow').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#userFollow').jqxGrid('updatebounddata', 'cells');
    	$('#userFollow').jqxGrid('clearselection');
    	$('#userFollow').jqxGrid('refreshdata');
    };
}

var UserFollowBindModle=function(userFollowMgt){
	var me=this;
	
	this.search=function(bool){

		var sDate = $('#userFollow-sDate').val(),
			eDate = $('#userFollow-eDate').val(),
			name = $('#userFollow-name').val(),
			regTelephone = $('#userFollow-telephone').val(),
			employeeCode = $('#userFollow-sales').val(),
			customerCode = $('#userFollow-kefu').val();
		//查询日期
		userFollowMgt.searchObj['owner0.createDate'].value=[];
		if(sDate!='' && eDate!=''){
			userFollowMgt.searchObj['owner0.createDate'].value.push(sDate+' '+'00:00:00',eDate+' '+'23:59:59');
		}
		
		if(sDate!=''&&eDate===''){
			userFollowMgt.searchObj['owner0.createDate'].value.push(sDate+' '+'00:00:00');
			userFollowMgt.searchObj['owner0.createDate'].action='ge';
		}
		
		if(sDate===''&&eDate!=''){
			userFollowMgt.searchObj['owner0.createDate'].value.push(eDate+' '+'23:59:59');
			userFollowMgt.searchObj['owner0.createDate'].action='le';
		}
		
		//用户名称
		userFollowMgt.searchObj['owner0.loginId'].value=[];
		if(name!=''){
			userFollowMgt.searchObj['owner0.loginId'].value.push(name);
		}
		//联系电话
		userFollowMgt.searchObj['owner0.regTelephone'].value=[];
		if(regTelephone!='')
			userFollowMgt.searchObj['owner0.regTelephone'].value.push(regTelephone);

		var saleVals = $('#userFollow-sales').find('input').val(),
			custVals = $('#userFollow-kefu').find('input').val();
		//销售负责人
		userFollowMgt.searchObj['owner0.employeeCode'].value=[];
		if(saleVals!=null && saleVals != ''&& saleVals != undefined){
			userFollowMgt.searchObj['owner0.employeeCode'].value.push(employeeCode);
		}
		
		//客服
		userFollowMgt.searchObj['owner0.customerCode'].value=[];
		if(custVals!=null && custVals != ''&& custVals != undefined){
			userFollowMgt.searchObj['owner0.customerCode'].value.push(customerCode);
		}

		if(bool===true){
			return userFollowMgt.searchObj;
		}
		
		userFollowMgt.searchDataInfo();
	}

	this.initInformation = function(){
    	var obj = getConditionParams(me.search(true));
    	
    	Core.AjaxRequest({
            type: "GET",
            async: false,
            url: _global_settings.service.url+'/owner/isornotremark/0/0/'+_global_settings.owner.roleName+'/'+obj,
            callback: function (res) {
            	$('#readyFollowUser').text(res.noRemark);
            	$('#alreadyFollowUser').text(res.isRemark);
            },
            failure: function (e) {
            }
        });
	}
	
	this.bind=function(){
		//点击搜索
		$('#userFollow-search').on('click',function(){
			if($('#userFollow-show').is(':hidden')){
				$('#userFollow-show').slideDown('slow');
			}else{
				me.search();
				me.initInformation();
			}
		});
		
		hiddenAclick();
		
		//导出
		$('#userFollow-export').off('click').on('click', function() {
			var url = _global_settings.service.url+'/common/export/userbuy/0/0/'+_global_settings.owner.roleName+'/';
			var obj = getConditionParams(me.search(true));
			$.openHref(url + obj + '?t='+Math.random() );
		});
	}
	
	this.unbindAll=function(){
	}
}
