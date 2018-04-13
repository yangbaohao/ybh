/**
 * 系统设置界面js
 */
var UserMgt = function(){
	
	var me = this;
	
	this.debug = false;
	this.id=null;
	this.boolean=false;
	this.sudata=null;
	
	var name=false;
	this.autoAddStaffNum = null;
	
	var roleList=[];
	/**
	 * 查询条件对象
	 */
	this.searchObj = {};
	
	/**
	 * 初始化页面上所有的控件
	 */
	this.initInput = function(){
		
		
		me.initSearch();
		me.initGrid(me.searchObj);
		me.initWindows();
		me.initValidator();
		me.userNameJudge();
		//me.initRoleGrid();
		//me.initRoleWindows();
	};
	
	/**
	 * 初始化搜索组件
	 */
	this.initSearch = function(){
		me.searchObj = {
			username:{value:[],action:"like"},
			'userInfo.name':{value:[],action:'like'},
			'role.roleNameCN':{value:[],action:'like'},
			'userInfo.telephone':{value:[],action:'like'}
		};		
		//$("#search-username").input({width:300});

	};
	
	this.userNameJudge=function(){
		$('#add-username').on('blur',function(){
			var val = $('#add-username').val();
			if(val!=''){
				Core.AjaxRequest({
					url:_global_settings.service.url+'/user/repeat/'+val,
					type:'GET',
					async:false,
					callback:function(res){
						me.boolean=res;
						if(res){
							Core.alert({message:'用户名不能重复！'});
						}
					}
				});
			}
		});
	}
	
	/**
	 * 初始化所有窗口
	 */
	this.initWindows = function(){
		$("#"+me.settings.addWin.element).jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			//showCollapseButton: false,
			maxHeight:1000,
			minHeight:420,
			height:'auto',			
			//minHeight: 500, 
			minWidth: 500, 
			//resizable:true,
			cancelButton: $("#cancelAddUserBtn"),
			initContent:function(){
				$("#add-salutation").dropDownlist({ source: ["男","女"],width:'100%'})				
			}
		}).on({
			"open":function(){	
				me.autoAddStaffCode();
				$('#add-userid').val("");
				$("#add-password").val("");
				$("#add-passwordcheck").val("");
				$("#add-username").val("");
				 $("#add-name").val('');
				 $("#add-email").val('');
				 $("#add-telephone").val('');
				 $("#add-title").val('');
				 $("#add-mobile").val('');
				 //$("#add-qq").val('');
				 //$("#add-checkTowType").jqxDropDownList({selectedIndex: 0})
				 $("#add-salutation").jqxDropDownList({selectedIndex: 0});	
				 $('#add-employeeCode').val(me.autoAddStaffNum);
			}
		});
		
		$('#editUserWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			showCollapseButton: false,
			//maxHeight: '100%', 
			maxWidth: '100%', 
			minHeight: 200, 
			minWidth: 500, 
			resizable:true,
			//height: 500, 
			//width: 800,
			cancelButton: $("#cancelEditUserBtn"),
			initContent:function(){
				$("#edit-locked").dropDownlist({ source: {'true':'是','false':'否'},selectedIndex: 0,width:'100%'});
				$('#editInfo-salutation').dropDownlist({
					source:['男','女'],
					width:'100%'
				});
			}
		}).on({
			"open":function(){
				var rowindex = $('#'+me.settings.grid.element).jqxGrid('getselectedrowindex');
        	    if(rowindex >= 0){
        	    	var data = $('#'+me.settings.grid.element).jqxGrid('getrowdata', rowindex);
        	    	console.log(data);
					$("#edit-id").val(data.userid);
					$("#edit-username").text(data.username);
					$("#edit-locked").jqxDropDownList('selectItem',data.locked);
					$('#editInfo-salutation').val(data.salutation);
        	    }else{
        	    	Core.alert({message:"请选择一项！"});
        	    	$("#"+me.settings.editWin.element).jqxWindow("close");
        	    }
			}
		});
		
		$("#editUserInfoWin").jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			showCollapseButton: false,
			//maxHeight: '100%', 
			maxWidth: '100%', 
			minHeight: 200, 
			minWidth: 500, 
			resizable:true,
			//height: 500, 
			//width: 800,
			cancelButton: $("#canceleditUserInfoBtn"),
			initContent:function(){
			}
		}).on({
			"open":function(){
			},
			'close':function(){
				$('#editInfo-username').val('');
				$('#editInfo-employeeCode').val('');
				$('#editInfo-name').val('');
				$('#editInfo-password').val('');
				$('#editInfo-passwordcheck').val('');
				
				$('#editInfo-mobile').val('');
				$('#editInfo-email').val('');
				$('#editInfo-title').val('');
			}
		});
		
		$("#editRoleGridHtml").jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			showCollapseButton: false,
			minHeight: 500, 
			minWidth: 500, 
			resizable:true,
			cancelButton: $("#cancelEditRoleBtn_user"),
			initContent:function(){							
				
			}
		}).on({
			
		});
		
		$("#editEmpWin").jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			showCollapseButton: false,
			minHeight: 260, 
			minWidth: 500, 
			resizable:true,
			cancelButton: $("#cancelEditEmpBtn"),
			initContent:function(){							
				
			}
		}).on({
			
		});

		$('#editUserInfoWin, #disabled_user, #editRoleGridHtml, #addUserWin, #editEmpWin').center();
	    $(window).on('resize', function() {
	        $('#editUserInfoWin, #disabled_user, #editRoleGridHtml, #addUserWin, #editEmpWin').center({transition:0});
	    });
	};
	
	/**
	 * 初始化所有表单的校验
	 */
	this.initValidator = function(){
		$('#addUserWin').jqxValidator({
			hintType: 'label',
    		animationDuration: 1
           ,rules: [
                /*{ input: '#add-employeeCode', message: "不能为空", action: 'keyup, blur', rule: 'required' }, 
                { input: '#add-employeeCode', message: "必须为数字，长度5位", action: 'keyup, blur', 
                	rule:function(input,commit){
                		var patrn = /^\d*$/;
                    	if(patrn.exec(input.val())){
                    		if(input.val().length!=5) return false;
                    		return true;
                    	}else{
                    		return false;
                    	}
                	} 
                },*/
				{ input: '#add-password', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#add-password', message: "密码长度应为6-20位", action: 'keyup, blur',
					rule: function(input,commit){
						var val = input.val();
						if(val.length<6||val.length>20)
							return false;
						return true;
					}
				},
				{ input: '#add-username', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#add-username', message: "只能是数字,字母,下划线。下划线不能开头或结尾", action: 'keyup, blur', 
					rule: function(input,commit){
						var val = input.val();
						var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（） &;|{}【】‘；：”“'。，、？\u4e00-\u9fa5]") ;						
						console.log(val.indexOf('—'),val.indexOf('—'));
						if(val.indexOf('_')===0||val.indexOf('_')===val.length-1){
							return false;
						}else{
							if(reg.test(input.val())){
								return false;
							}else{
								return true;
							}
						}
					}
				},
				{ input: '#add-passwordcheck', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#add-passwordcheck', message: "两次密码不一致", action: 'keyup, blur',
					rule: function(input,commit){
						var val = input.val();
						var p=$('#add-password').val();
						if(val!==p) 
							return false;
						return true;
					}
				},
				{ input: '#add-name', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#add-mobile', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#add-mobile', message: "手机号码格式不正确", action: 'keyup, blur', 
					rule: function(input,commit){
						if(input.val() !==''){
							var reg = /^1(3|4|5|7|8)\d{9}$/;         
							//var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;       
							  return reg.test(input.val());
							}else{
								return true
							}
					} 
				}, 
				{ input: '#add-email', message: "邮箱格式不正确", action: 'keyup, blur', 
					rule: function(input,commit){
						if(input.val() !==''){
							var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;         
							//var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;       
							  return reg.test(input.val());
							}else{
								return true
							}
					} 
				},    
			]
    	});
		
		$('#editUserInfoWin').jqxValidator({
			hintType: 'label',
			animationDuration: 1
			,rules: [
					{ input: '#editInfo-password', message: "不能为空", action: 'keyup, blur', rule: 'required' },
					{ input: '#editInfo-password', message: "密码长度应为6-20位", action: 'keyup, blur',
						rule: function(input,commit){
							var val = input.val();
							if(val.length<6||val.length>20)
								return false;
							return true;
						}
					},
					{ input: '#editInfo-passwordcheck', message: "不能为空", action: 'keyup, blur', rule: 'required' },
					{ input: '#editInfo-passwordcheck', message: "两次密码不一致", action: 'keyup, blur',
						rule: function(input,commit){
							var val = input.val();
							var p=$('#editInfo-password').val();
							if(val!==p) 
								return false;
							return true;
						}
					},
					{ input: '#editInfo-name', message: "不能为空", action: 'keyup, blur', rule: 'required' },
					{ input: '#editInfo-mobile', message: "不能为空", action: 'keyup, blur', rule: 'required' },
					{ input: '#editInfo-email', message: "邮箱格式不正确", action: 'keyup, blur', 
						rule: function(input,commit){
							if(input.val() !==''){
								var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;         
								//var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;       
								  return reg.test(input.val());
								}else{
									return true
								}
						} 
					}
			   ]
		});
	};
	
	/**
	 * 查询列表数据
	 */
    this.searchDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('applyfilters');
    	$("#"+el).jqxGrid('refreshfilterrow'); 
    	$("#"+el).jqxGrid('clearselection');
    };
    
    /**
     * 刷新
     */
    this.refreshDataInfo = function(element){
    	var el = element===undefined?me.settings.grid.element:element;
    	$("#"+el).jqxGrid('updatebounddata', 'cells');
    	$("#"+el).jqxGrid('clearselection');
    };
	
    this.initOperation = function(){};
    
	/**
	 * 初始化grid
	 */
	this.initGrid = function(){
		
		me.settings.source.data = me.searchObj;
		
		console.log(me.settings.grid.element);
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter(me.settings.grid.element, me.settings.source,  {
			beforeLoadComplete:function(records){
//				console.log("Records"+records);
			}
			
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	    	  	   source:demoAdapter
	    		   ,rendergridrows: function(){
	                    return demoAdapter.recordids;
	                }
	        	   ,columns:[
//							{ text: 'id', dataField: 'userid',width:'10%'},
							{ text: ' 员工编号', dataField: 'userNumber',width:'11%'},
							{ text: '用户名', dataField: 'username',width:'11%',
								cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	    	  	            		var rtStr = '<div class="agrid">';
	    	  	            			if(rowdata.roleName=='salesManage'||rowdata.roleName=='customerManage'||
	    	  	            			   rowdata.roleName=='secondLevelSalesManage'||rowdata.roleName=='secondLevelCustomerManage'){
	    	  	            				rtStr += '<a class="hoverspan viewUserDetail" title="查看详情">'+rowdata.username+'</a>';
	    	  	            			}else{
	    	  	            				rtStr += rowdata.username;
	    	  	            			}
		    	  	            		rtStr += '</div>';
	    	  	            		return rtStr;
	    	  	              	}
							},
							{ text: '姓名', dataField: 'name', width:'11%'},
					         { text: '手机号码',  dataField:"telephone",width:'11%'},
//					         { text: '邮箱',  dataField:"email", width:'12%'},
					         {text: '角色', dataField:'roleNameCN',width:'11%'},
							{ text: '是否禁用', dataField: 'locked',width:'11%',cellsrenderer:codeRender},
							{ text: '创建人', dataField: 'createBy',width:'11%'},
							{ text: '创建日期', dataField: 'createDate',width:'11%',
								cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	    	  	            		var rtStr = '<div class="agrid">';
	    	  	            		return rtStr+rowdata.createDate.substring(0,10)+'</div>';
	    	  	              	}
							},
							/*{ text: 'organizationId', dataField: 'organizationId',width:'5%'},
							{ text: 'userinfoId', dataField: 'userinfoId',width:'5%'},*/
	        	             
	       	  	            { text: "操作", align:"center",width:"12%",
	    	  	             	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	    	  	            		var rtStr = '<div style="text-align: center;">';
	    	  	            			if(rowdata.roleName=='salesManage'||rowdata.roleName=='customerManage'||
	    	  	            			   rowdata.roleName=='secondLevelSalesManage'||rowdata.roleName=='secondLevelCustomerManage'){
	    	  	            				rtStr += '<a class="md-account-circle editEmp" title="分配员工"></a>';
	    	  	            			}
		    	  	            		rtStr += '<a class="md-format-list-bulleted AddRoleBtn" title="分配角色"></a>';
		    	  	            		rtStr += '<a class="md-mode-edit editUserInfoBtn" title="编辑"></a>';
		    	  	            		rtStr += '<a class="md-error editUserBtn" title="禁用"></a>';
		    	  	            		//rtStr += '<a class=" md-cancel   " style=color:#75798B; title="删除" href="javascript:void(0);"></a>';
		    	  	            		rtStr += '</div>';
	    	  	            		return rtStr;
	    	  	              	}
	    	  	             }
	       	  	             ],
	       	  	   pagesizeoptions: [2,5,10],
	        	   columnsheight:me.settings.grid.columnsheight,
	        	   pagesize: me.settings.grid.pagesize,
	        	   columnsheight: 45
	    };
		$("#"+me.settings.grid.element).grid(grid_sets);
		
		//点击分配员工
		$('#userGrid').on('click','.editEmp',function(){
			var index = $('#userGrid').jqxGrid('getselectedrowindex');
			var data = $('#userGrid').jqxGrid('getrowdata',index);
			console.log(data);
			me.sudata=data;
			$('#editEmpWin').jqxWindow('open',function(){
				$('#editemp-name').text(data.username);
				if(data.roleName=='salesManage')
					getEmp('sales');
				else if(data.roleName=='customerManage')
					getEmp('customer');
				else if(data.roleName=='secondLevelSalesManage')
					getEmp('secondLevelSalesManage');
				else 
					getEmp('secondLevelCustomerManage');
			});
		});
		
		//点击用户名
		$('#userGrid').on('click','.viewUserDetail',function(){
			var index = $('#userGrid').jqxGrid('getselectedrowindex');
			
			if(index>=0){
				var data = $('#userGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'分配详情',url:'page/modules/sys/viewUserd.html',pk:{data:data},reload:true});
			}
			
		});
		
	};
	
	var getEmp=function(str){
		Core.AjaxRequest({
			url:_global_settings.service.url+'/common/manage/'+str,
			type:'GET',
			showMsg:false,
			async:false,
			callback:function(res){
				console.log(res);
				$('#editemp-emp').dropDownlist({
					theme:currentTheme,
					source:res,
					searchMode:'contains',
					displayMember:'username',
					valueMember:'id',
					height:34,
					width:'100%',
					checkboxes: true,
					placeHolder:''
				});
			}
		});
	}
	
	/**
	 * 初始化RoleGrid
	 */
	
	
	
	var url = _global_settings.service.url;

	
	this.settings = {
			source:{
				datafields: [
							{ name: 'userid', type: 'number' },
							{ name: 'useInfoid', type: 'number' },
							{ name: 'createBy', type: 'string' },
							{ name: 'createDate', map: 'createDate' },
							{ name: 'locked', type: 'boolean' },
							{ name: 'name', type: 'string' },
							{ name: 'telephone', type: 'string' },
							{ name: 'email', type: 'string' },
							{ name: 'username', type: 'string' },
							{ name: 'roleName', type: 'string' },
							{ name: 'roleNameCN', type: 'string' },
							{ name: 'employeeCode', type: 'string' },
							{ name: 'userNumber', type: 'string' }
				         ],
				 data:me.searchObj,
				 url: url+"/user/search",
			},
			grid:{element:"userGrid"},
			addWin:{element:"addUserWin"},
			editWin:{element:"editUserWin"},	
			addForm:{element:"addUserForm"},
			editForm:{element:"editUserForm"},
			ajax:{url:url},
	};
	
	this.autoAddStaffCode = function() {
		Core.AjaxRequest({
            url:url+"/salesagent/getcode/usercode",
			type: "GET",
			async:false,
			dataType: 'text',
            showMsg:false,
            callback: function(res) {
            	me.autoAddStaffNum = res;
            },
            failure:function(error){
            	Core.alert({
            		message:'您的网络似乎不太稳定，请刷新页面！'
            	});
            }
        });
	}
	
}	

/**
 * 页面中所有组件按钮的事件定义及绑定活动
 */
var UserBindModle = function(userMgt){
	
	var me = this;	
	
	var name=false;
	
	var userId,username;
	
	var url=_global_settings.service.url;
	/**
	 * 弹出添加model框
	 */
	this.popupAddWin = function(){
		$("#"+userMgt.settings.addWin.element).jqxWindow("open",function(){
			//$('#add-employeeCode').removeAttr('readonly');
		});
		
	};
	
	/**
	 * 弹出编辑model框
	 */
	this.popupEditWin = function(){
		var rowindex = $('#'+userMgt.settings.grid.element).jqxGrid('getselectedrowindex');
	    if(rowindex >= 0){
	    	$("#"+userMgt.settings.editWin.element).jqxWindow("open");
	    }else{
	    	Core.alert({message:"请选择一项！"});
	    }
	}
	
	
	/**
	 * 弹出编辑model框
	 */
	this.popupEditeditRoleGrid = function(){		
        var source =
        {
            datatype: "json",
            datafields: [
                { name: 'id', type: 'float' },

							{ name: 'roleNameCN', type: 'string' },
							{ name: 'description', type: 'string' }

            ],
           
            url:  url+"/role/"
        };
        var dataAdapter = new $.jqx.dataAdapter(source);
        // create jqxgrid.
        $("#editRoleGrid").jqxGrid(
        {
        	localization: gridLocalizationObj,
            width: "100%",
            autoheight: true,
            //height: 'auto',
            source: dataAdapter,
            sortable: true,
            filterable: true,
            pageable: true,
            ready: function ()
            {
            	
            	$("#editRoleGrid").on('rowselect rowunselect',function (event){
            		roleList=[];
            		
            		var list= $('#editRoleGrid').jqxGrid('getselectedrowindexes');  
            		for(var i in list){
            			if(list.hasOwnProperty(i)){
            				try{
	            				var a=$('#editRoleGrid').jqxGrid('getrowdatabyid', parseInt(list[i]));           				
	            				roleList[i]={id:a['id'],roleName:a['roleName'],available:false};
            				}catch(e){            					
            				}
            			}
            		}
            		console.log(roleList);
            		
            	} );         
            	
            },
            selectionmode: 'checkbox',
            altrows: true,
            columns:[
						
						
						{ text: '角色名称', dataField: 'roleNameCN',width:'46%'},
						{ text: '角色描述', dataField: 'description',width:'46%'},
    	  	             ]
        });
		
        $("#editRoleGridHtml").jqxWindow("open");
	}
	
	/**
	 * 提交添加model
	 */
	this.addSubmit = function(params){
		if(userMgt.boolean){
			Core.alert({message:'用户名不能重复！'});
			return false;
		}
		
		if($('#addUserWin').jqxValidator("validate")){
			console.log(params);
			Core.AjaxRequest({
                url:url+"/user",
				type: "POST",
				async:false,
                params:params,
                showMsg:false,
                callback: function(res) {
                	if(res){
                		setCloseAlertTimeOneSecond();
                    	userMgt.initOperation();
                    	userMgt.refreshDataInfo();                	
    					$('#addUserWin').jqxWindow("close",function(){
    						$('#add-employeeCode').val('');
    					});
                	}
                	
                },
                failure:function(error){
                	Core.alert({
                		message:error.responseJSON.errorMsg
                	});
                }
            });
			
		}
		return false;
	};	
	
	/**
	 * 提交添加model前，对model赋值
	 */
	this.initAddParam = function(){
		var username = $("#add-username").val();
		var employeeCode = $('#add-employeeCode').val();
		var password = $("#add-password").val();
		
		var name = $("#add-name").val();
		var email = $("#add-email").val();
		var salutation = $("#add-salutation").val();
		var mobile = $("#add-mobile").val();
		var title = $("#add-title").val();
		
		console.log('add');
		return {
				employeeCode:employeeCode,
			    password: password,
//			    id:$('#add-userid').val(),
			    username: username,
			    roles: [],
			    locked: false,
			    userInfo: {
			          email: email,
			          name: name,
			          salutation: salutation,
			          telephone: mobile,
			          title: title,
			          type: "person"
			    }
		};
	};
	
	
	/**
	 * 提交编辑员工model
	 */
	this.editInfoSubmit = function(params){
		console.log('edit');
		if($('#editUserInfoWin').jqxValidator("validate")){
			console.log(params);
			Core.AjaxRequest({
                url:url+"/user",
				type: "PUT",
				async:false,
                params:params,
                showMsg:false,
                callback: function(res) {
                	if(res){
                		setCloseAlertTimeOneSecond();
                    	userMgt.initOperation();
                    	userMgt.refreshDataInfo();                	
    					$('#editUserInfoWin').jqxWindow("close");
                	}
                	
                },
                failure:function(error){
                	Core.alert({
                		message:error.responseJSON.errorMsg
                	})
                }
            });
			
		}
		return false;
	};	
	
	/**
	 * 提交编辑员工model前，对model赋值
	 */
	this.initEditInfoParam = function(id){
		
		var username = $("#editInfo-username").val();
		var employeeCode = $('#editInfo-employeeCode').val();
		var password = $("#editInfo-password").val();
		
		var name = $("#editInfo-name").val();
		var email = $("#editInfo-email").val();
		var salutation = $("#editInfo-salutation").val();
		var mobile = $("#editInfo-mobile").val();
		var title = $("#editInfo-title").val();
		
		console.log('edit');
		return {
				employeeCode:employeeCode,
			    password: password,
			    id:id,
			    username: username,
			    roles: [],
			    locked: false,
			    userInfo: {
			          email: email,
			          name: name,
			          salutation: salutation,
			          telephone: mobile,
			          title: title,
			          type: "person"
			    }
		};
	};
	
	
	
	/**
	 * 提交禁用员工model
	 */
	this.disabledUser=function(){
		var id=$('#edit-id').val(),locked=$('#edit-locked').val();
		
		Core.AjaxRequest({
            url:url+'/user/lock/'+id+'/'+locked,
			type: "PUT",
			async:false,
			showMsg:false,
            callback: function(res) {
            	setCloseAlertTimeOneSecond();
            	userMgt.initOperation();
				userMgt.refreshDataInfo();
				$("#editUserWin").jqxWindow("close");
            },
            failure:function(res){
            }
        });
	};
	
	
	/**
	 * 删除一个model
	 */
	this.remove = function(){
		var rowindex = $('#'+userMgt.settings.grid.element).jqxGrid('getselectedrowindex');
	    if(rowindex >= 0){
	    	var data = $('#'+userMgt.settings.grid.element).jqxGrid('getrowdata', rowindex);
			Core.confirm({
				message:"确定要删除？",
				confirmCallback:function(){
					Core.AjaxRequest({
		                url : url+ "/user/"+data.id,
		                type: "DELETE",
		                async: false,
		                dataType:userMgt.settings.ajax.dataType,
		                callback: function(res) {
		                	userMgt.initOperation();
		                	userMgt.refreshDataInfo();
		                },
		                failure:function(res){
		                }
		            });
				}
			});
	    }else{
	    	Core.alert({message:"请选择一项！"});
	    }
	};
	
	/**
	 * 查询
	 */
	this.search = function(bool){

		var username = $('#search-username').val();
		
		userMgt.searchObj.username.value = [];
		if(username!='')
			userMgt.searchObj.username.value.push(username);
		
		if(bool){
			return userMgt.searchObj;
		}

		
		userMgt.searchDataInfo();
	};
	
	/**
	 * 将本类中定义的事件与页面中的组件行为绑定起来
	 */
	this.bind = function(){
		
		$('#userGrid').off('click','.editUserInfoBtn').on('click','.editUserInfoBtn',function(){
			var rowindex = $("#userGrid").jqxGrid('getselectedrowindex');
			var data = $("#userGrid").jqxGrid('getrowdata', rowindex);
			userMgt.id=data.userid;
			console.log(data);
			$("#editUserInfoWin").jqxWindow("open",function(){
				$('#editInfo-username').val(data.username);
				$('#editInfo-employeeCode').val(data.userNumber);
				$('#editInfo-name').val(data.name);
				
				$('#editInfo-mobile').val(data.telephone);
				$('#editInfo-email').val(data.email);
				$('#editInfo-title').val(data.title);
				
				$('#editInfo-salutation').dropDownlist({
					source:['男','女'],
					width:'100%'
				});
				$('#editInfo-salutation').val(data.salutation==undefined?'':data.salutation);
			});
			console.log(data);
		})
		
		$("#createUserBtn").off('click').on({'click':me.popupAddWin});
		$("#userGrid").off('click','.editUserBtn').on('click','.editUserBtn',me.popupEditWin);
		$("#deleteUserBtn").off('click').on({'click':me.remove});

		$("#addUserSubmitBtn").off('click').on({'click':function(){
			me.addSubmit(me.initAddParam());
		}});
		
		$('#editUserInfoSubmitBtn').off('click').on('click',function(){
			me.editInfoSubmit(me.initEditInfoParam(userMgt.id));
		});
		
		//禁用
		$("#editUserSubmitBtn").off('click').on({'click':function(){
			me.disabledUser();
		}});
		$("#userGrid").off('click','.AddRoleBtn').on('click','.AddRoleBtn',function(){
			var rowindex = $('#userGrid').jqxGrid('getselectedrowindex');			
			rowdata= $('#userGrid').jqxGrid('getrowdata',rowindex);
//			if(rowdata!==undefined){
//				console.info(rowdata,username);
				userId=rowdata.userid;
				username=rowdata.username;
				console.info(userId,username);
				if($("#editRoleGrid").children().length===0){
					me.popupEditeditRoleGrid();				
				}
				else{
					$('#editRoleGrid').jqxGrid('unselectallrows');
					$("#editRoleGridHtml").jqxWindow("open");
				}
				
				//$('#editRoleGrid').jqxGrid('clearselection');
				Core.AjaxRequest({	               
	                url:url+"/user/rolebyid/"+userId,
					type: "GET",
					showMsg:false,
	                callback: function(res) {
	                	console.log(res);
	                	var json=res;
	                	var length=$('#contenttableeditRoleGrid').children().length;
	                	for(var i in json){
	                		//if(json.hasOwnProperty(i)){
	                			for(var j=0;j<length;j++){
	                				if($('#editRoleGrid').jqxGrid('getcellvalue', j, "id")===json[i]){
	    	                			$('#editRoleGrid').jqxGrid('selectrow', j);
	                				}
	                			}
	                		//}
	                	}
	                },
	                failure:function(res){
	                	//alert("网络出错！")
	                }
	            });
//			}
//			else{
//				Core.alert({message:"请选择一项！"});
//				return false;
//			}
			
			
		});

		
		$("#searchUserBtn").off('click').on('click',function(){
			me.search();
		});

		$('#editRoleSubmitBtn_user').off('click').on('click',function(){
			if(roleList.length>1){
				Core.alert({message:'一个员工只能分配一个角色哦！'});
				return false;
			}
			var json={
					username:username,
				    "id": userId,
				    "roles": roleList,
				    "locked": false
				    
				};
			console.log(JSON.stringify(json));
			Core.AjaxRequest({
				 url:url+'/user/byrole/',
					type: "PUT",
		            params:json,    
		            async:false,
		            showMsg:false,
	                callback: function(res) {
	                	try{
	                		setCloseAlertTimeOneSecond();
	                		userMgt.refreshDataInfo();   
	                		$("#editRoleGridHtml").jqxWindow("close");
	                	}catch(e){}
	                },

            });
		});
		
		//保存分配员工
		$('#editEmpSaveBtn').on('click',function(){
			var ids=[];
			var items = $('#editemp-emp').jqxDropDownList('getCheckedItems');
			
			$.each(items,function(i){
				var obj={};
				obj.id=items[i].originalItem.id;
				ids.push(obj);
			});
			
			Core.AjaxRequest({
				url:_global_settings.service.url+'/user/gaveup/'+userMgt.sudata.userid,
				type:'PUT',
				params:ids,
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					$('#editEmpWin').jqxWindow('close',function(){
						$('#editemp-name').text('');
						$('#editemp-emp').jqxDropDownList('uncheckAll');
					});
					$('#userGrid').jqxGrid('updatebounddata','cells');
				}
			});
		});
		
		//导入
		$('#importUserBtn').on('click', function() {
			var obj = {url : url + '/common/import/users/'};
			$('#sysUserMgt-attachment').html('');
			$('#sysUserMgt-modal').modal('show');
			$('#sysUserMgt-attachment').fileuploader(obj);
		})
		
		//导出
		$('#exportUserBtn').on('click', function() {
			var url = _global_settings.service.url+'/common/export/user/';
			var obj={"condition":[],"filterscount":0,"groupscount":0,"sortorder":"desc","pagenum":0,"pagesize":20};
			var data = me.search(true);
			var arr=[];
			for(var i in data){
				var json={}
				json.key=i;
				json.value=data[i].value;
				if(data[i].value==undefined|| data[i].value==null || data[i].value==''){
					json.value = [];//如果输入框内值不合法，则让它为空
				}
				json.action=data[i].action;
				if(data[i].value[0]!=undefined && data[i].value[0]!='' && data[i].value[0]!= null){
					arr.push(json);//如果有其中一个值不合法。则不放进condition里面
				}
			}				
			obj.condition=arr;
			obj=new Base64().encode(JSON.stringify(obj));
			$.openHref(url + obj + '?t='+Math.random() );
		})
	}
	
	this.unbindAll = function(){
		$("#createUserBtn").off('click');
		$("#editUserBtn").off('click');
		$("#deleteUserBtn").off('click');
		$("#addUserSubmitBtn").off('click');
		$("#editUserSubmitBtn").off('click');
		$("#searchUserBtn").off('click');
		$('#editUserInfoSubmitBtn').off('click');
		$('#editEmpSaveBtn').off('click');
	}
}
