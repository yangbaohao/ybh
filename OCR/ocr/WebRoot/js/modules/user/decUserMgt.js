/*
 * 报税人员管理界面js
 */

var DurMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user';
	this.userData=null;
	this.boolean=false;
	
	this.initInput=function(){
		me.initWindows();
		me.initValidator();
		me.initGrid(me.searchObj);
		me.userNameJudge();
	}
	
	this.userNameJudge=function(){
		$('#adddec-username').on('blur',function(){
			var val = $('#adddec-username').val();
			if(val!=''){
				Core.AjaxRequest({
					url:url+'/repeat/'+val,
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
	
	this.searchObj={
		'user.username':{value:[],action:'like'}	
	}
	
	this.initWindows=function(){
		$('#addDecUserWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:580,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#cancelAddDecUserBtn'),
			initContent:function(){
				$('#adddec-salutation').dropDownlist({ source: ['男','女'],width:'100%',selectedIndex:0});				
			}
		}).on({
			'close':function(){
				$('#addDecUserWin').find('input').val('');
			}
		});
		
		$('#editDecUserInfoWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:580,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#cancelEditDecUserBtn'),
			initContent:function(){
				$('#editdecuser-salutation').dropDownlist({ source: ['男','女'],width:'100%'});				
			}
		}).on({
			'close':function(){
				$('#editDecUserInfoWin').find('input').val('');
			}
		});
		
		$('#disableUserWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:280,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#cancelDisableUserBtn'),
			initContent:function(){
				$('#disabled-locked').dropDownlist({ source: {'true':'是','false':'否'},width:'100%',selectedIndex:0});				
			}
		});
		
	}
	
	/**
	 * 初始化grid
	 */
	this.initGrid = function(){
		
		me.settings.source.data = me.searchObj;
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('decUserGridMgt', me.settings.source,  {
			beforeLoadComplete:function(records){
			}
			
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.records;
            }
    	   ,columns:[
					{ text: '员工编号', dataField: 'employeeCode',width:'10%'},
					{ text: '用户名', dataField: 'username',width:'15%'},
					{ text: '姓名', dataField: 'name', width:'15%'},
			        { text: '手机号码',dataField:'telephone',width:'10%'},
			        { text: '职位', dataField:'title',width:'10%'},
			        { text: '用户数',dataField:'ownerNum',width:'10%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px; padding-left:6px;">';
							html+='<a class="hoverspan userNum">'+rowdata.ownerNum+'</a>';
							return html+'</div>';
						}
					},
					{ text: '是否禁用',width:'15%',
			        	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	  	            		var rtStr = '<div class="agrid">';
	  	            		return rtStr+getCodeData(rowdata.locked);
	  	              	}
					},
   	  	            { text: '操作', align:'center',width:'15%',
	  	             	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
	  	            		var rtStr = '<div style="text-align: center;">';
	  	            			rtStr += '<a class="hoverspan md-mode-edit editDecUserBtn" title="编辑"></a>';
		  	            		rtStr += '<a class="hoverspan md-format-list-bulleted fpUserBtn" title="分配客户"></a>';
		  	            		rtStr += '<a class="hoverspan md-error disableUserBtn" title="禁用"></a>';
		  	            		rtStr += '</div>';
	  	            		return rtStr;
	  	              	}
	  	            }
   	  	        ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#decUserGridMgt').grid(grid_sets);
		
		//点击编辑
		$('#decUserGridMgt').on('click','.editDecUserBtn',function(){
			var index=$('#decUserGridMgt').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#decUserGridMgt').jqxGrid('getrowdata',index);
				me.userData=data;
				$('#editDecUserInfoWin').jqxWindow('open',function(){
					$('#editdecuser-username').val(data.username);
					$('#editdecuser-employeeCode').val(data.employeeCode);
					$('#editdecuser-name').val(data.name);
					$('#editdecuser-mobile').val(data.telephone);
//					$('#editdecuser-email').val(data.email);
				});
			}
		});
		
		//点击用户详情
		$('#decUserGridMgt').on('click','.userNum',function(){
			var index=$('#decUserGridMgt').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#decUserGridMgt').jqxGrid('getrowdata',index);
				$.addTab({title:'用户详情',isFrame:false,url:'page/modules/user/decUserDetail.html',
					pk:{employeeCode:data.employeeCode},reload:true});
			}
		});
		
		//点击禁用
		$('#decUserGridMgt').on('click','.disableUserBtn',function(){
			var index=$('#decUserGridMgt').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#decUserGridMgt').jqxGrid('getrowdata',index);
				me.userData=data;
				$('#disableUserWin').jqxWindow('open',function(){
					$('#disable-username').val(data.username);
				});
			}	
		});
		
		//点击分配客户
		$('#decUserGridMgt').on('click','.fpUserBtn',function(){
			var index=$('#decUserGridMgt').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#decUserGridMgt').jqxGrid('getrowdata',index);
				
				if(data.locked){
					Core.alert({message:'禁用的用户不能分配客户！'});
					return false;
				}
				
				$.addTab({title:'分配客户',isFrame:false,url:'page/modules/user/decFpUser.html',
					pk:{data:data},reload:true});
			}
		});
		
	};
	
	this.settings = {  
		source:{
	        url: url+'/userAgentTax',
	        data:me.searchObj,
	    },
		grid:{element:'decUserGridMgt'},
		ajax:{url:url},
	};
	
	this.searchDataInfo = function(){
    	$('#decUserGridMgt').jqxGrid('applyfilters');
    	$('#decUserGridMgt').jqxGrid('refreshfilterrow'); 
    	$('#decUserGridMgt').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#decUserGridMgt').jqxGrid('updatebounddata', 'cells');
    	$('#decUserGridMgt').jqxGrid('clearselection');
    	$('#decUserGridMgt').jqxGrid('refreshdata');
    };
    
    /**
	 * 初始化所有表单的校验
	 */
	this.initValidator = function(){
		$('#addDecUserWin').jqxValidator({
			hintType: 'label',
    		animationDuration: 1
           ,rules: [
                { input: '#adddec-username', message: "不能为空", action: 'keyup, blur', rule: 'required' },    
                { input: '#adddec-username', message: "只能是数字,字母,下划线。下划线不能开头或结尾", action: 'keyup, blur', 
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
                { input: '#adddec-employeeCode', message: "不能为空", action: 'keyup, blur', rule: 'required' }, 
                { input: '#adddec-employeeCode', message: "必须为数字，长度5位", action: 'keyup, blur', 
                	rule:function(input,commit){
                		var patrn = /^\d*$/;
                    	if(patrn.exec(input.val())){
                    		if(input.val().length!=5) return false;
                    		return true;
                    	}else{
                    		return false;
                    	}
                	} 
                },
				{ input: '#adddec-password', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#adddec-password', message: "密码长度应为6-20位", action: 'keyup, blur',
					rule: function(input,commit){
						var val = input.val();
						if(val.length<6||val.length>20)
							return false;
						return true;
					}
				},
				{ input: '#adddec-passwordcheck', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#adddec-passwordcheck', message: "两次密码输入不一致", action: 'keyup, blur',
					rule: function(input,commit){
						var val = input.val();
						if(val!=$('#adddec-password').val())
							return false;
						return true;
					} 
				},
				{ input: '#adddec-name', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#adddec-mobile', message: "不能为空", action: 'keyup, blur', rule: 'required' },
				{ input: '#adddec-mobile', message: '格式不正确', action: 'keyup,blur', 
                	rule: function(input,commit){
                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
                		return true;
                	}
                },
				{ input: '#adddec-email', message: "邮箱格式不正确", action: 'keyup, blur', 
					rule: function(input,commit){
						if(input.val()!=''){
							var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;         
							return reg.test(input.val());
						}else{
							return true
						}
					} 
				}  
			]
    	});
		
		$('#editDecUserInfoWin').jqxValidator({
			hintType: 'label',
			animationDuration: 1
			,rules: [
					{ input: '#editdecuser-password', message: "不能为空", action: 'keyup, blur', rule: 'required' },
					{ input: '#editdecuser-password', message: "密码长度应为6-20位", action: 'keyup, blur',
						rule: function(input,commit){
							var val = input.val();
							if(val.length<6||val.length>20)
								return false;
							return true;
						}
					},
					{ input: '#editdecuser-passwordcheck', message: "不能为空", action: 'keyup, blur', rule: 'required' },
					{ input: '#editdecuser-passwordcheck', message: "两次密码输入不一致", action: 'keyup, blur',
						rule: function(input,commit){
							var val = input.val();
							if(val!=$('#editdecuser-password').val())
								return false;
							return true;
						} 
					},
					{ input: '#editdecuser-name', message: "不能为空", action: 'keyup, blur', rule: 'required' },
					{ input: '#editdecuser-mobile', message: "不能为空", action: 'keyup, blur', rule: 'required' },
					{ input: '#editdecuser-mobile', message: '格式不正确', action: 'keyup,blur', 
	                	rule: function(input,commit){
	                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
	                		return true;
	                	}
	                },
					{ input: '#editdecuser-email', message: "邮箱格式不正确", action: 'keyup, blur', 
						rule: function(input,commit){
							if(input.val()!=''){
								var reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;         
								return reg.test(input.val());
							}else{
								return true
							}
						} 
					} 
			   ]
		});
	}
}

var DurBindModle=function(durMgt){
	var me=this;
	var url=_global_settings.service.url+'/user';
	
	this.search=function(){
		var username=$('#search-decusername').val();
		
		durMgt.searchObj['user.username'].value=[];
		if(username!='')
			durMgt.searchObj['user.username'].value.push(username);
		
		durMgt.searchDataInfo();
	}
	
	this.saveUser=function(){
		var obj={};
		obj.username = $('#adddec-username').val(),
		obj.employeeCode = $('#adddec-employeeCode').val(),
		obj.password = $('#adddec-password').val(),
		obj.locked=false,
		obj.roles=[],
		
		obj.userInfo={},
		obj.userInfo.email = $('#adddec-email').val(),
		obj.userInfo.name = $('#adddec-name').val(),
		obj.userInfo.salutation = $('#adddec-salutation').val(),
		obj.userInfo.telephone = $('#adddec-mobile').val(),
		obj.userInfo.title = $('#adddec-title').val();
		obj.userInfo.type='person';
		
		console.log(obj);
		if(durMgt.boolean){
			Core.alert({message:'用户名不能重复！'});
			return false;
		}
		
		if($('#addDecUserWin').jqxValidator('validate')){
			Core.AjaxRequest({
				type:'POST',
				url:url+'/savetax',
				params:obj,
				async:false,
				callback:function(){
					$('#addDecUserWin').jqxWindow('close');
					try{
						ComboBoxSources.load('taxManage');
						$('#decUserGridMgt').jqxGrid('updatebounddata','cells');
						$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
					}catch(e){ }
				}
			});
		}	
	}
	
	this.saveEditUser=function(id){
		var obj={};
			obj.id=id;
			obj.username = $('#editdecuser-username').val(),
			obj.employeeCode = $('#editdecuser-employeeCode').val(),
			obj.password = $('#editdecuser-password').val(),
			obj.locked=durMgt.userData.locked,
			obj.parentEmployeeCode=durMgt.userData.parentEmployeeCode;
			obj.roles=[],
			
			obj.userInfo={},
			obj.userInfo.email = $('#editdecuser-email').val(),
			obj.userInfo.name = $('#editdecuser-name').val(),
			obj.userInfo.salutation = $('#editdecuser-salutation').val(),
			obj.userInfo.telephone = $('#editdecuser-mobile').val(),
			obj.userInfo.title = $('#editdecuser-title').val();
			obj.userInfo.type='person';
		
		
		console.log(obj);
		
		if($('#editDecUserInfoWin').jqxValidator('validate')){
			Core.AjaxRequest({
				type:'PUT',
				url:url,
				params:obj,
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					$('#editDecUserInfoWin').jqxWindow('close');
					$('#decUserGridMgt').jqxGrid('updatebounddata','cells');
					$('#userbMgt').jqxGrid('updatebounddata','cells');
					$('#Journal').jqxGrid('updatebounddata','cells');
				}
			});
		}
	}
	
	this.bind=function(){
		//点击搜索
		$('#searchDecUserBtn').on('click',function(){
			me.search();
		});
		
		//点击添加员工
		$('#addDecUserBtn').on('click',function(){
			$('#addDecUserWin').jqxWindow('open');
		});
		
		//保存添加员工
		$('#addDecUserSubmitBtn').off('click').on('click',function(){
			me.saveUser();
			$('#decUserGridMgt').jqxGrid('updatebounddata','cells');
			$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
			$('#partUserbMgtWin').jqxGrid('updatebounddata','cells');
		});
		
		//保存编辑员工
		$('#editDecUserSubmitBtn').off('click').on('click',function(){
			me.saveEditUser(durMgt.userData.id);
		});
		
		//保存禁用
		$('#disableUserSubmitBtn').off('click').on('click',function(){
			var locked=$('#disabled-locked').val();
			Core.AjaxRequest({
				url:url+'/lock/'+durMgt.userData.id+'/'+locked,
				type:'PUT',
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					$('#disableUserWin').jqxWindow('close');
					$('#decUserGridMgt').jqxGrid('updatebounddata','cells');
				}
			});
		});
	}
	
	this.unbindAll=function(){
		$('#addDecUserBtn').off('click');
		$('#searchDecUserBtn').off('click');
	}
}