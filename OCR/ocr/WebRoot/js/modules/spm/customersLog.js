/*
 *查看用户跟进表js 
 */

var CustomersLogMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/customerLog';
	this.debug=false;
	this.userData = null;
	this.lineData = null;
	this.initInput=function(){
		me.initUserPage();
		me.initWindows();
		me.initSearch();
		me.initValidator();
		me.initGrid(me.searchObj);
	}
	
	this.initValidator = function(){
		$('#addChatContentWin').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#addChatContentRemark',message: '100字以内',action:'keyup,blur',
                	rule:function(input,commit){
                		if(input.val().length>100) return false;
                		return true;
                	}
                },
                { input: '#addChatContentRemark', message: "不能为空", action: 'keyup, blur', rule: 'required' }
             ]
		});
		$('#remarkLogWin').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#customersLogRemark',message: '100字以内',action:'keyup,blur',
                	rule:function(input,commit){
                		if(input.val().length>100) return false;
                		return true;
                	}
                },
                { input: '#customersLogRemark', message: "不能为空", action: 'keyup, blur', rule: 'required' },  
             ]
		});
	}
	
	this.initUserPage=function(){
		$('#customersLog-show').css('display','');
		
		$('#customersLog-date').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
	        width: '100%',
	        height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		//选择时间改变时间
		$('#customersLog-sDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#customersLog-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#customersLog-date').on('change',function(){
			var td = $('#customersLog-date').attr('id');
			var sd = $('#customersLog-sDate').attr('id');
			var ed = $('#customersLog-eDate').attr('id');
			setValueById(td,sd,ed);
		});
		
		$('#customersLog-show').addClass('hiddendiv');
		
		var getCustInfo=function(){
			Core.AjaxRequest({
				url:_global_settings.service.url+'/user/managesaleinfo/'+_global_settings.owner.employeeCode,
				type:'GET',
				showMsg:false,
				async:false,
				callback:function(res){
					console.log(res);
					var rd = res
					$('#customersLog-cust').comboBox({
						source:res,
						displayMember:'username',
						valueMember:'id',
						height:34,
						width:'100%',
						placeHolder:'请选择',
						dropDownHeight:'100px'
//						selectedIndex:0
					});
//					$('#customersLog-cust').val(id);
				}
			});
		}
		getCustInfo();
	}
	
	this.initWindows = function(){
		$('#remarkLogWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:500,
			height:'500',			
			minWidth: 650, 
			cancelButton: $('#customersLogRemarkCancleBtn'),
			initContent:function(){
				$('#customersLogRemark').val('');
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#customersLogRemark').val('');
			},500);
		});
		
		$('#deleteCustomerLogWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:900,
			minHeight:280,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#customerLogCancelBtn'),
			initContent:function(){
			}
		}).on('close',function(){
		});
		
		$('#addChatContentWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:900,
			minHeight:450,
			height:'500',			
			minWidth: 650,
			width:650,
			cancelButton: $('#addChatContentCancelBtn'),
			initContent:function(){
				$('#addChatContentRemark').val('');
			}
		}).on('close',function(){
			$('#addChatContentRemark').val('');
		});
	}
	
	//获取销售负责人
	this.getSalesInfo=function(employeeCode){
		var rd = ComboBoxSources.getRecords('salesInfo');
		for(i=0;i<rd.length;i++){
			if(employeeCode==rd[i].employeeCode){
				return rd[i];
			}
		}
		
		if(!employeeCode){
			return '';
		}
	}
	
	//获取客服
	this.getCustService=function(custCode){
		var rd = ComboBoxSources.getRecords('custService');
		for(i=0;i<rd.length;i++){
			if(custCode==rd[i].employeeCode){
				return rd[i];
			}
		}
		
		if(!custCode){
			return '';
		}
	}

	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.setting.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('customersLog', me.setting.source,{
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
				{ text: '日期',dataField:'createDate',width:'9%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="agrid">';
						return html+rowdatas.createDate.substring(0,10)+'</div>';
					}
			    },
			    { text: '电话',width:'9%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="agrid">';
							html+=rowdatas.phone;
						return html+'</div>';
					}
				},
				{ text: '客服(姓名/用户名)',width:'11%',
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html = '<div class="agrid">';
							html+=rowdatas.customer.employeeCode==undefined?'':
								(me.getCustService(rowdatas.customer.employeeCode)==undefined?'':
									me.getCustService(rowdatas.customer.employeeCode).name+'('+me.getCustService(rowdatas.customer.employeeCode).username+')');
						return html+'</div>';
					}
			    },
			    { text: '用户名',width:'9%',
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html = '<div class="agrid">';
							html+=rowdatas.name==undefined?'':rowdatas.name;
						return html+'</div>';
					}
			    },
			    { text: '聊天内容',width:'30%',
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
			    		var html='';var a='';
				    	if(rowdatas.content!==undefined){
				    		for(var i=0; i<rowdatas.content.length; i++){
				    			a=rowdatas.content[i].remark;
			    				html+='<div class="agrid" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis; height:auto; line-height:20px; font-size:13px;" title='+a+'>'+a+'</div>';
					    	}
				    	}
				    	return '<div style="height:auto;">'+html+'</div>';
					}
			    },
			    { text: '备注',width:'24%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='';var a='';
				    	if(rowdatas.remark.length>0){
				    		for(var i=0; i<rowdatas.remark.length; i++){
				    			a=rowdatas.remark[i].remark;
			    				html+='<div class="agrid" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis; height:auto; line-height:20px; font-size:13px;" title='+a+'>'+a+'</div>';
					    	}
				    	}
				    	return '<div style="height:auto;">'+html+'</div>';
					}
				},
				{ text: '操作',width:'8%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
						var html = '<div style="text-align:center; margin-top:-17px; position:relative; top:50%; text-overflow: ellipsis;">';
							html += '<a class="hoverspan md-edit addChatContentBtn" data-index="'+rowIndex+'" title="添加聊天内容"></a>';
							html += '<a class="hoverspan md-note-add remarkLogBtn" data-index="'+rowIndex+'" title="添加备注"></a>';
							html += '<a class="hoverspan md-cancel  delLogBtn" data-index="'+rowIndex+'" title="删除"></a>';
						return html + '</div>';
			    	}
			    }
	  	    ],
    	   columnsheight: 50,
	    };
		$('#customersLog').grid(grid_set);
		
		//增加备注
		$('#customersLog').on('click','.remarkLogBtn',function(){
			var index = $('#customersLog').jqxGrid('getselectedrowindex');
			var data = $('#customersLog').jqxGrid('getrowdata',index);
			me.lineData = data;
			$('#remarkLogWin').jqxWindow('open',function(){
				var se={
					localdata: data.remark,
		            datatype: 'array'
			    }
				var demo = new $.jqx.dataAdapter(se);;
				//初始化Grid
				$('#customersLogRemarkTbody').jqxGrid({
		            source: demo,
		            width:'100%',
		            height:220,
		            pageable:false,
//		            selectionmode:'checkbox',
		            columns: [
		              { text: '更新时间',dataField:'createDate',width:'40%' },
		              { text: '备注',dataField:'remark',width:'60%' },
		            ]
		        });
					
			});
		});
		
		//保存增加备注
		$('#customersLogRemarkSaveBtn').off('click').on('click',function(){
			if($('#remarkLogWin').jqxValidator('validate')){
				var ids=me.lineData.id
				var url = _global_settings.service.url+'/customerLog/add/remark/'+ids;
				
				Core.AjaxRequest({
					url:url,
					type:'POST',
					params:{remark:$('#customersLogRemark').val()},
					async:false,
					showMsg:false,
					callback:function(){
						setCloseAlertTimeOneSecond();
						$('#remarkLogWin').jqxWindow('close');
						$('#customersLog').jqxGrid('updatebounddata','cells');
						$('#customersLogRemarkTbody').jqxGrid('updatebounddata','cells');
						$('#customersLogRemark').val('');
					},
					failure:function(){
					}
				});
			}
		});
		
		//增加聊天内容
		$('#customersLog').on('click','.addChatContentBtn',function(){
			var index = $('#customersLog').jqxGrid('getselectedrowindex');
			var data = $('#customersLog').jqxGrid('getrowdata',index);
			me.userData = data;
			$('#addChatContentWin').jqxWindow('open',function(){
				var se={
					localdata: data.content,
		            datatype: 'json'
			    }
				var demo = new $.jqx.dataAdapter(se);;
				//初始化Grid
				$('#addChatContentTbody').jqxGrid({
		            source: demo,
		            width:'100%',
		            height:220,
//		            autorowheight: true,
//				    autoheight: true,
		            pageable:false,
//		            selectionmode:'checkbox',
		            columns: [
		              { text: '类型',width:'40%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
								var html='';
									html+= '<div class="agrid" style=" margin-top:-17px; position:relative; top:50%; text-overflow: ellipsis;">';
									if(rowdatas.type=='0'){
										html+= '客服';
									}else if(rowdatas.type=='1'){
										html+= '注册用户';	
									}else if(rowdatas.type=='2'){
										html+= '非注册用户';
									}	
								return html+'</div>';
							}
						},
		              { text: '聊天内容',dataField: 'remark', width:'60%',
					    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
					    		var html = '<div class="agrid" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis; height:auto; line-height:20px; font-size:13px;" title='+rowdatas.remark+'>'+rowdatas.remark+'</div>';
						    	return '<div style="height:auto;">'+html+'</div>';
							}
					    },
		            ]
		        });
					
			});
		});
		
		//保存增加聊天内容
		$('#addChatContentSaveBtn').off('click').on('click',function(){
			if($('#addChatContentWin').jqxValidator('validate')){
				var ids=me.userData.id;
				var types = null;
				var currentRole = _global_settings.owner.roleName;
				if(currentRole=='customerService'||currentRole=='customerManage'||currentRole=='secondLevelCustomerManage') {
					types = '0';
				}
				var url = _global_settings.service.url+'/customerLog/add/content/'+ids;
				Core.AjaxRequest({
					url:url,
					type:'POST',
					params:{type:types,remark:$('#addChatContentRemark').val()},
					async:false,
					showMsg:false,
					callback:function(){
						setCloseAlertTimeOneSecond();
						$('#addChatContentTbody').jqxGrid('updatebounddata','cells');
						$('#addChatContentWin').jqxWindow('close');
						$('#customersLog').jqxGrid('updatebounddata','cells');
						$('#addChatContentRemark').val('');
					},
					failure:function(){
						
					}
				});
			}
		});
		
		//删除一行
		$('#customersLog').on('click','.delLogBtn',function(){
			var index = $('#customersLog').jqxGrid('getselectedrowindex');
			var data = $('#customersLog').jqxGrid('getrowdata',index);
			$('#deleteCustomerLogWin').jqxWindow('open');
			$('#customerLogConfirmBtn').on('click',function(){
				Core.AjaxRequest({
					url:url+'/'+data.id,
					type:'DELETE',
					async:false,
					showMsg:false,
					callback:function(){
						setCloseAlertTimeOneSecond();
						$('#deleteCustomerLogWin').jqxWindow('close');
						$('#customersLog').jqxGrid('updatebounddata','cells');
					},
					failure:function(){
					}
				});
			});
		});
	}
	
	this.setting = {  
			source:{
				url: url+'/page',
				data:me.searchObj,
				updaterow: function (rowid, rowdata, commit) {
		            // synchronize with the server - send update command
		            // call commit with parameter true if the synchronization with the server was successful 
		            // and with parameter false if the synchronization has failed.
		            commit(true);
		        }
			},
			grid:{element:'customersLog'},
			ajax:{url:url},
	};
	
	this.searchObj={};
	this.initSearch=function(){
		me.searchObj={
				'c.createDate':{value:[],action:'between'},
				'c.phone':{value:[],action:'like'},
				'c.customer.username':{value:[],action:'like'},
				'c.name':{value:[],action:'like'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#customersLog').jqxGrid('applyfilters');
    	$('#customersLog').jqxGrid('refreshfilterrow'); 
    	$('#customersLog').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#customersLog').jqxGrid('updatebounddata', 'cells');
    	$('#customersLog').jqxGrid('clearselection');
    	$('#customersLog').jqxGrid('refreshdata');
    };
}

var CustomersLogBindModle=function(customersLogMgt){
	var me=this;
	this.search=function(){
		var sDate=$('#customersLog-sDate').val(),
			eDate=$('#customersLog-eDate').val(),
			phone=$('#customersLog-phone').val(),
			username= $('#customersLog-username').val(),
			cust=$('#customersLog-cust').find('input').val();
		//查询日期
		customersLogMgt.searchObj['c.createDate'].value=[];
		if(sDate!='' && eDate!='')
			customersLogMgt.searchObj['c.createDate'].push(sDate+' '+'00:00:00',eDate+' '+'23:59:59');;
		
		if(sDate!='' && eDate==='')
			customersLogMgt.searchObj['c.createDate'].value.push(sDate+' '+'00:00:00');
			customersLogMgt.searchObj['c.createDate'].action='ge';
		
		if(sDate==='' && eDate!='')
			customersLogMgt.searchObj['c.createDate'].value.push(eDate+' '+'00:00:00');
			customersLogMgt.searchObj['c.createDate'].action='le';
		
		customersLogMgt.searchObj['c.phone'].value=[];
		if(phone!='')
			customersLogMgt.searchObj['c.phone'].value.push(phone);
		
		customersLogMgt.searchObj['c.name'].value=[];
		if(username!='')
			customersLogMgt.searchObj['c.name'].value.push(username);
		
		customersLogMgt.searchObj['c.customer.username'].value=[];
		if(cust!=''&&cust!=null)
			customersLogMgt.searchObj['c.customer.username'].value.push(cust);
		
		customersLogMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#customersLog-search').on('click',function(){
			if($('#customersLog-show').is(':hidden')){
				$('#customersLog-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		
	}
}
