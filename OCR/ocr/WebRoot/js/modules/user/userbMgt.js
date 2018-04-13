/*
 * 客户管理界面js
 */
var UserbMgt = function() {
	var me = this;
	var url = _global_settings.service.url + '/user';
	var settime = null;
	this.debug = false;
	this.userbData = null;

	this.initInput = function() {
		if (_global_settings.owner.roleName != 'taxStaffadmin') {
			$('#userb-add').remove();
			$('#userb-import').remove();
			$('#userb-download').remove();
		}
		me.initUserPage();
		me.initWindows();
		me.initValidator();
		me.initGrid(me.searchObj);
	}

	this.searchObj = {
		'l.accountPeriodMonth' : {value : [],action : 'eq'},
		't.taxType' : {value : [],action : 'eq'},
		't.loginId' : {value : [],action : 'like'},
		'i.name' : {value : [],action : 'like'}
	};

	/*
	 * 初始化页面
	 */
	this.initUserPage = function() {
		$('#userb-show').css('display','');
		
		// 用户名
		var rd = ComboBoxSources.getRecords('userInfo'), arr = [ '全部' ];
		for (var i = 0; i < rd.length; i++) {
			arr.push(rd[i].username);
		}
		$('#userb-username').comboBox({
			theme : currentTheme,
			source : arr,
			searchMode : 'contains',
			displayMember : 'username',
			height : 34,
			width : '100%',
			selectedIndex : 0
		});
		// 备注
		var rd = ComboBoxSources.getRecords('userInfo'), arr = [ '全部' ];
		for (var i = 0; i < rd.length; i++) {
			arr.push(rd[i].name);
		}
		$('#userb-buymou').comboBox({
			theme : currentTheme,
			source : arr,
			searchMode : 'contains',
			displayMember : 'name',
			height : 34,
			width : '100%',
			selectedIndex : 0
		});
		
		$('#userb-tax').dropDownlist({
			source : {'all':'全部','smallscale' : '小规模纳税人','generalvat' : '一般增值税纳税人'},
			theme : currentTheme,
			height : 34,
			width : '100%',
			selectedIndex : 0
		});
		
		$('#userb-pday').monthpicker({callback : 'abc'});
		$('#userb-pday').val('');
		
		$('#userb-show').addClass('hiddendiv');
	}

	this.initWindows = function() {
		$('#userbMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 700,
			minHeight : 300,
			height : 'auto',
			minWidth : 600,
			maxWidth : 800,
			cancelButton : $('#userbMgtCancleBtn'),
			initContent : function() {
				$('#userbMgtDate').monthpicker({callback : 'abc'});
				
			}
		}).on('close', function() {
			setTimeout(function() {
				$('#userb-company').text('');
			}, 500);
		});

		$('#addUserbMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 900,
			minHeight : 460,
			height : 'auto',
			minWidth : 900,
			maxWidth : 900,
			cancelButton : $('#addUserbMgtCancleBtn'),
			initContent : function() {
				$('#addbMgtDate').monthpicker({callback : 'abc'});
				// 新增--增值税率
				var vatSource = [ '0%', '3%', '6%', '11%', '13%', '17%' ];
				$('#add-vat').dropDownlist({
					source : vatSource,
					theme : currentTheme,
					width : '100%',
					height : '34px',
					dropDownHeight : 200,
					selectedIndex : 0
				});
				
				$('#add-taxType').dropDownlist({
					source : {'smallscale' : '小规模纳税人','generalvat' : '一般增值税纳税人'},
					theme : currentTheme,
					height : 34,
					width : '100%',
					selectedIndex : 0
				});
				
				$('#payee-period').dropDownlist({
					source : {'paymouth':'按月收款','payseason' : '按季度收款','payhalfyear' : '按半年收款','payyear' : '按年收款'},
					theme : currentTheme,
					height : 34,
					width : '100%',
					selectedIndex : 0
				});
				$('#payee-period').val('paymouth');
				$('#contract-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'}).val('');
				$('#contract-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'}).val('');
				$('#add-email').val('');
				$('#add-phone').val('');
				$("#payee-amount").input({width:'98%',height:33}).moneyinput();
				$('#payee-amount').val('0.00');
			}
		}).on('close', function() {
			setTimeout(function() {
				$('#add-name').val('');
			}, 500);
		});

		$('#editUserbMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 700,
			minHeight : 460,
			height : 'auto',
			minWidth : 900,
			maxWidth : 900,
			cancelButton : $('#editUserbMgtCancleBtn'),
			initContent : function() {
				$('#edit-MgtDate').monthpicker({callback : 'abc'});
				$('#edit-period').dropDownlist({
					source : {'paymouth':'按月收款','payseason' : '按季度收款','payhalfyear' : '按半年收款','payyear' : '按年收款'},
					theme : currentTheme,
					height : 34,
					width : '100%',
					selectedIndex : 0
				});
				
				$('#edit-taxType').dropDownlist({
					source : {'smallscale' : '小规模纳税人','generalvat' : '一般增值税纳税人'},
					theme : currentTheme,
					height : 34,
					width : '100%',
					selectedIndex : 0
				});
				
				// 编辑--增值税率
				var vatSource = [ '0%', '3%', '6%', '11%', '13%', '17%' ];
				$('#edit-vat').dropDownlist({
					source : vatSource,
					theme : currentTheme,
					width : '100%',
					height : '34px',
					dropDownHeight : 200,
					selectedIndex : 0
				});
				$('#edit-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#edit-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#edit-amount').input({width:'98%',height:33}).moneyinput();
			}
		}).on({
			'close': function() {
				setTimeout(function() {
					$('#edit-name').val('');
				}, 500);
			},
			'open':function(){
			}
		})

		$('#partUserbMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 700,
			minHeight : 300,
			height : 'auto',
			minWidth : 600,
			maxWidth : 800,
			cancelButton : $('#partUserbMgtCancleBtn'),
			initContent : function() {
			}
		}).on('close', function() {
			setTimeout(function() {
				$('#part-name').val('');
			},'open',function(){ 
				ComboBoxSources.load('taxManage');
			},500);
		});
		
		$('#matchUserbMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 700,
			minHeight : 300,
			height : 'auto',
			minWidth : 600,
			maxWidth : 800,
			cancelButton : $('#matchUserbMgtCancleBtn'),
			initContent : function() {
				$('#match-getMsg').text('免费获取验证码');
			}
		}).on('close', function() {
			setTimeout(function() {
				$('#match-getMsg').text('免费获取验证码');
			}, 500);
		});
		//TODO
		$('#receiptUserbMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 700,
			minHeight : '450',
			height : '450',
			minWidth : 600,
			maxWidth : 800,
			cancelButton : $('#receiptUserbMgtCancleBtn'),
			initContent : function() {
				$('#receipt-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#receipt-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#receipt-amount').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#receipt-money').input({width:'100%',height:33}).moneyinput();
			}
		}).on('close', function() {
			setTimeout(function() {

			},'open',function(){ 

			},500);
		});
		
		$('#sendEmailUserbMgtWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			maxHeight : 700,
			minHeight : 480,
			height : '480',
			minWidth : 600,
			maxWidth : 800,
			cancelButton : $('#sendEmailUserbMgtCancleBtn'),
			initContent : function() {
				$('#sendEmail-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#sendEmail-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#sendEmail-amount').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
				$('#sendEmail-money').input({width:'98%',height:33}).moneyinput();
			}
		}).on('close', function() {
			setTimeout(function() {

			},'open',function(){ 

			},500);
		});
	}
	
	/**
	 * getTaxerInfo 拉出所有报税人名单,姓名,id
	 */
	this.getTaxerInfo=function(username){
		var rd = ComboBoxSources.getRecords('taxerInfo');
		for(i=0;i<rd.length;i++){
			if(username==rd[i].username){
				return rd[i];
			}
		}
		
		if(!username){
			return '';
		}
	}

	var initColumns = function() {
		if (_global_settings.owner.roleName == 'taxStaffadmin') {
			return [
					{text : '用户名', width : '12.2%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px; text-overflow:ellipsis; white-space: nowrap; overflow: hidden;">';
								html+= '<a class="hoverspan viewTaxerUserDetail" data-index="'+rowIndex+'"  >'+rowdata.loginId+'</a>';
								html+= '</div>';
							return html;
						}
					},
					{text : '公司名称', width : '12.2%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px; text-overflow:ellipsis; white-space: nowrap; overflow: hidden;">';
								html+= rowdata.name
								html+= '</div>';
							return html;
						}
					},
					{text : '纳税人性质',width : '10%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px">';
							return html + getCodeData(rowdata.taxType)+'</div>';
						}
					},
					{text : '纳税人识别号',dataField : 'owerTaxCode',width : '9%'},
					{text : '增值税率(%)',dataField : 'vat',width : '9%'},
					{text : '当前账期',dataField : 'mouthDate',width : '8%'},
					{text : '报税人',dataField : 'taxer',width : '9%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html='';
		   	  	            if(rowdata.taxer=='AdminAccount'){
			   	  	       		html+='<div>代理报税</div>';
			   	  	   	    }else{
			   	  	   			if(me.getTaxerInfo(rowdata.taxer)!=undefined){
			   	  	   				if(me.getTaxerInfo(rowdata.taxer).username == rowdata.taxer){
			   	  	   					html+='<div style="padding-top:6px;">'+me.getTaxerInfo(rowdata.taxer).name+'</div>';
			   	  	   				}
			   	  	   			}else{
			   	  	   				html+='<div style="padding-top:6px;">'+rowdata.taxer+'</div>';
			   	  	   			}
			   	  	   		}
			   	  	   		return '<div>'+html+'</div>';
						}
					},//
					{text : '报税状态',dataField : 'taxProgressType',width : '10%'},
					{text : '收款状态',width : '8%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px">';
							return html + getCodeData(rowdata.paidType)+'</div>';
						}
					},
					{text : '操作',width : '10%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="text-align:center">';
								html += '<a class="hoverspan md-label  decGoodsBtn" data-index="'+rowIndex+'" title="报税"></a>';
								html += '<a class="hoverspan md-edit editGoodsBtn" data-index="'+rowIndex+'" title="编辑"></a>';
								html += '<a class="hoverspan md-format-list-bulleted partGoodsBtn" data-index="'+rowIndex+'" title="分配员工"></a>';
								html += '<a class="hoverspan md-attach-money receiptMoneyBtn" data-index="'+rowIndex+'" title="收款"></a>';
								html += '<a class="hoverspan md-send sendPaymentEmail" data-index="'+rowIndex+'" title="发送催款邮件"></a>';
								return html + '</div>';
						}
					} 
			 ]
		} else {
			return [
					{text : '用户名',width : '15%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px; text-overflow:ellipsis; white-space: nowrap; overflow: hidden;">';
								html+= '<a class="hoverspan viewTaxerUserDetail" data-index="'+rowIndex+'"  >'+rowdata.loginId+'</a>';
								html+= '</div>';
							return html;
						}
					},
					{text : '公司名称', width : '15%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px; text-overflow:ellipsis; white-space: nowrap; overflow: hidden;">';
								html+= rowdata.name
								html+= '</div>';
							return html;
						}
					},
					{text : '纳税人性质',width : '15%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px">';
							return html + getCodeData(rowdata.taxType)+'</div>';
						}
					},
					{text : '纳税人识别号',dataField : 'owerTaxCode',width : '10.6%'},
					{text : '增值税率(%)',dataField : 'vat',width : '8%'},
					{text : '当前账期',dataField : 'mouthDate',width : '8%'},
					{text : '状态',dataField : 'taxProgressType',width : '8%'},
					{text : '收款状态',width : '10%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px">';
							return html + getCodeData(rowdata.paidType)+'</div>';
						}
					},
					{text : '操作',width : '8%',
						cellsrenderer : function(rowIndex, columnfield, value,defaulthtml, columnproperties, rowdata) {
							var html = '<div style="text-align:center;">';
								html += '<a class="hoverspan md-label decGoodsBtn" data-index="'+rowIndex+'" title="报税"></a>';
								html += '<a class="hoverspan md-edit editGoodsBtn" data-index="'+rowIndex+'" title="编辑"></a>';
								html += '<a class="hoverspan md-attach-money receiptMoneyBtn" data-index="'+rowIndex+'" title="收款"></a>';
								html += '<a class="hoverspan md-send sendPaymentEmail" data-index="'+rowIndex+'" title="发送催款邮件"></a>';
							return html + '</div>';
						}
					}
			  ]
		}
	}

	/*
	 * 初始化grid
	 */
	this.initGrid = function() {
		// me.settings.source.data = me.searchObj;
		// 初始化数据源
		var demoAdapter = Core.AcDataAdapter('userbMgtGrid',
				me.settings.source, {
					beforeLoadComplete : function(records) {

					}
				}, me.debug);

		// 初始化Grid
		// 如果是代理报税人登录

		var grid_sets = {
			source : demoAdapter,
//			enablebrowserselection:true,
			enablehover: false,
			rendergridrows : function() {
				return demoAdapter.recordids;
			},
			columns : initColumns(),
			selectionmode : 'checkbox',
			pagesize : 20,
			columnsheight : 45
		};

		$('#userbMgtGrid').grid(grid_sets);
		// 左侧选择
		$('#userbMgtGrid').on('rowselect rowunselect',function(){
			leftSelect();
		});
		
		
		//点击用户查看详情
		$('#userbMgtGrid').on('click','.viewTaxerUserDetail',function(){
			var index = $(this).attr('data-index');
			if(index>=0){ 
				var data = $("#userbMgtGrid").jqxGrid('getrowdata', index);
				$.addTab({title:'查看用户',url:'page/modules/user/viewTaxerUserDetail.html',isFrame:false,
					pk:{data:data},reload:true});
			}
		});

	}
	
	var leftSelect=function(){
		indexes = [];
		var inx=0,inxi=null;
		var index = $('#userbMgtGrid').jqxGrid('getselectedrowindexes');
		
		$.each(index,function(i){
			if(index[i]!=undefined){
				inx++;
				inxi=index[i];
			}
		});
		
		indexes=index;
		
		if(inx>1||inx==0){
			removeIndex(arr_tab);
			$('#index-companyname').text('');
		}
		
		if(inx===1){
			if(inxi>0){
				var data = $('#userbMgtGrid').jqxGrid('getrowdata',inxi);
				if(data!=undefined){
					$('#index-companyname').text(data.name);
				}
			}
		}
	}

	this.settings = {
		source:{
			url:url + '/searchusertax/1',
			data:me.searchObj
		},
		grid:{element : 'userbMgtGrid'},
		ajax:{url : url},
	};

	this.searchDataInfo = function() {
		$('#userbMgtGrid').jqxGrid('applyfilters');
		$('#userbMgtGrid').jqxGrid('refreshfilterrow');
		$('#userbMgtGrid').jqxGrid('clearselection');
	};

	this.refreshDataInfo = function() {
		$('#userbMgtGrid').jqxGrid('updatebounddata', 'cells');
		$('#userbMgtGrid').jqxGrid('clearselection');
		$('#userbMgtGrid').jqxGrid('refreshdata');
	};
	/**
	 * 初始化所有表单的校验
	 */
	this.initValidator = function(){
		$('#addUserbMgtWin').jqxValidator({
			hintType: 'label',
    		animationDuration: 1
           ,rules: [
                { input: '#add-loginId', message: "不能为空", action: 'keyup, blur', rule: 'required' },    
                { input: '#add-loginId', message: "只能是数字,字母,下划线。下划线不能开头或结尾", action: 'keyup, blur', 
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
				},/*,
				{ input: '#add-eamil', message: '邮箱格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return true;
                		else{
                			if(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(input.val())) return true;
                			return false;
                		}
                	}
                },*/
                { input: '#add-phone', message: '联系电话格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
                		return true;
                	}
                },
			]
    	});
		
		$('#sendEmailUserbMgtWin').jqxValidator({
			hintType: 'label',
    		animationDuration: 1
           ,rules: [
                { input: '#sendEmail-money', message: "不能为空", action: 'keyup, blur', rule: 'required' }, 
                { input: '#sendEmail-sTime', message: "不能为空", action: 'keyup, blur', rule: 'required' },
                { input: '#sendEmail-eTime', message: "不能为空", action: 'keyup, blur', rule: 'required' },
			]
    	});
	}
}
/**
 * 页面中所有组件按钮的事件定义及绑定活动
 */
var UserbBindModle = function(userbMgt) {
	var me = this;
	var count = 0;
	var url = _global_settings.service.url + '/common';

	this.search = function() {
		var username = $('#userb-username').find('input').val(), 
			name = $('#userb-buymou').find('input').val(), 
			mouthDate = $('#userb-pday').val(),
			tax = $('#userb-tax').val();
		
		// 备注
		userbMgt.searchObj['i.name'].value = [];
		if (name != '全部')
			userbMgt.searchObj['i.name'].value.push(name);
		
		// 用户名
		userbMgt.searchObj['t.loginId'].value = [];
		if (username != '全部')
			userbMgt.searchObj['t.loginId'].value.push(username);
		
		// 纳税人性质
		userbMgt.searchObj['t.taxType'].value = [];
		if (tax != 'all')
			userbMgt.searchObj['t.taxType'].value.push(tax);
		
		// 账期
		userbMgt.searchObj['l.accountPeriodMonth'].value = [];
		if(mouthDate!='')
			userbMgt.searchObj['l.accountPeriodMonth'].value.push(mouthDate);

		userbMgt.searchDataInfo();
	}

	this.bind = function() {
		// 点击搜索
		$('#userb-search').on('click', function() {
			if ($('#userb-show').is(':hidden')) {
				$('#userb-show').slideDown('slow');
			} else {
				me.search();
			}
		});

		// 点击下载模板
		$('#userb-download').on('click', function() {
			var sUrl = '192.168.1.3:8080/SimpleBss/' ;
			if(getHostName() == 'localhost' || sUrl.indexOf(getHostName())>-1){
				var urls ='/SimpleBss/template/owner.xls';
				window.open(urls);
			}else{
				window.open('/template/owner.xls');
			}
		});

		// 点击导入
		$("#userb-import").on("click", function() {
			var obj = {url : url + '/import/taxOwner/' + _global_settings.owner.userid};
			$('#userb-attachment').html('');
			$('#userb-modal').modal('show');
			$('#userb-attachment').fileuploader(obj);
		});

		
		/**
		 * 报税人新增用户 会出现四种情况
		 * 1，直接新增，用户名不存在重复的情况下
		 * 2，如果重复，a，在秒账正常注册的用户，后台返回false，则需要发送验证码，进行匹配，调取验证码的接口，通过用户名获取该用户名注册的手机号，在通过手机号发送请求获取验证码，验证验证码成功之后保存新增
		 * 3，如果重复，b，自己下面已存在的用户，后台跑出异常，在ajax请求的failure里直接提示用户名存在
		 * 4，如果重复，c，别人家报税人下面的用户，后台返回false，则需要发送验证码，进行匹配
		 * */   
		
		//打开新增窗口
		$('#userb-add').on('click', function() {
			$('#addUserbMgtWin').jqxWindow('open');
			emptyInputVal();
		});
		
		//保存新增
		$('#addUserSubmitBtn').off('click').on('click',function() {
			submitAddTaxerParams(initAddTaxerParams());
		});
		
		//点击发送验证码,新增用户，匹配秒账用户
		$('#match-getMsg').off().on('click',function(){
			sendPhoneMsg();
		});
		
		//确认发送验证码
  		$('#match_Confirmphone').off().on("click",function(){
  			countDownTimer();
  		});
  		
  		//取消发送验证码
  		$('#match_cancelPhone').click(function(){
  			$('#matchConfirmphone').slideUp(300);
  		});

		//确认验证码
    	$('#matchUserSubmitBtn').off().on('click',function() {
    		matchValidCode();
    	})
    	
    	//取消保存
    	$('#addUserbMgtCancleBtn').off('click').on('click',function(){
			emptyInputVal();
			$('#addUserbMgtWin').jqxWindow('close');
		})
		
		//新增模态框关闭
		$('#addUserbMgtWin').find('.jqx-window-close-button').off('click').on('click',function(){
			emptyInputVal();
			$('#addUserbMgtWin').jqxWindow('close');
		})
		
    	//清空输入框值
		function emptyInputVal(){
			$('#add-email').val('');
			$('#add-phone').val('');
			$('#payee-amount').val('0.00');
			$('#add-name').val('');
			$('#add-loginId').val('');
			$('#add-taxpayer').val('');
			$('#contract-sTime').val('');
			$('#contract-eTime').val('');
		}
    	
    	//新增保存数据-map对象
		function initAddTaxerParams() {
			var obj = {};
			if($('#addUserbMgtWin').jqxValidator('validate')){
					obj.username = $('#add-loginId').val(),												//用户名
					obj.enterpriseName = $('#add-name').val(),											//公司名
					obj.taxType = $('#add-taxType').val(), 												//纳税人性质
					obj.vat = $('#add-vat').val().substring(0,$('#add-vat').val().length - 1),			//增值税率
					obj.startMonth = $('#addbMgtDate').val();											//当前账期
					obj.enterpriseTaxCode = $('#add-taxpayer').val();									//纳税人识别号
					obj.startDate = $('#contract-sTime').val();											//合同开始日期
					obj.endDate = $('#contract-eTime').val();											//合同结束日期
					obj.dateType = $('#payee-period').val();											//收款周期
					obj.payAmt = money($('#payee-amount').val())=='NaN'?'0.00':money($('#payee-amount').val());	//收款金额
					obj.email = $('#add-email').val()													//邮箱
					obj.regTelephone = $('#add-phone').val();											//电话
			}
			return obj;
		}
		
		//新增保存
		function submitAddTaxerParams(params) {
			var bool;
			Core.AjaxRequest({
				type : 'POST',
				url : _global_settings.service.url+'/owner/direct/reg',
				async : false,
				params : params,
				showMsg:false,
				callback : function(res) {
					bool = res;
					if(res === true){
						//直接新增情况，res = true
						setCloseAlertTimeOneSecond();
						emptyInputVal();
						$('#addUserbMgtWin').jqxWindow('close');
						$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
					}else{
						initMatchTaxerParams(params);
					}
				},
				failure : function(error) {
					/**
					 * 新增自己本身已经存在的用户
					 * 合同格式错误
					 */
					var responseText=JSON.parse(error.responseText);
					Core.alert({ message: responseText.errorMsg });
				}
			})
			return bool;
		}
		
		//初始化匹配框信息
		function initMatchTaxerParams(params) {
			$('#matchUserbMgtWin').jqxWindow('open');
			$('#match-username').html(params.username);
			$('#match-inputUserName').val(params.username);
			$('#match-validCode').val('');
			$('#match-validCode').attr('disabled',true);
			$('#match-getMsg').text('免费获取验证码');
			
			//监听验证码输入框值的变化，和提交按钮的变化
			$('#match-validCode').keyup(function(){
				if($('#match-validCode').val().length>0){
					$('#matchUserSubmitBtn').attr('disabled',false)
				}else{
					$('#matchUserSubmitBtn').attr('disabled',true)
				}
			})
		}
		
		//发送信息
		function sendPhoneMsg() {
			$.ajax({
				type:"GET",
	            url: _global_settings.service.url+"/owner/direct/acPhone/" + $('#match-inputUserName').val(),
	          	datatype: "json",
	          	success: function (data) {
	          		confirmSendMsgPhone(data);
	          	},
	          	failure : function(e) {
					var err=JSON.parse(e.responseText);
					Core.alert({
						message: err.errorMsg,
						callback:function(){
							$('#userbMgtWin').jqxWindow('close');
						}
					});
				}
	          })
		}
		
		//确认发送信息
		function confirmSendMsgPhone(data) {
      		var a = data.toString().substr(0,3);
      		var b = "****";
      		var c = data.toString().substr(3);
      		var phone = a + b + c;
      		$('#mark_no').text(phone);
  			$('#matchConfirmphone').slideDown(300);
      		$('#qyzh').css('boxShadow','0px 0px 0px white');
		}
		
		//倒计时
		function countDownTimer() {
			$('#matchConfirmphone').slideUp(300);
  			var i=60;
  			var time = function(){
  				i-=1;
  				$('#match-getMsg').text('获取验证码('+i+')');	
  				$('#match-getMsg').attr('disabled',true);
  				if(i===0){
  					clearInterval(times);
  					$('#match-getMsg').text("重新发送");
  					$('#match-getMsg').attr('disabled',false);
  				}
  			};
  			count+=1;
  			var times= setInterval(time,1000);
  			var uname = $("#match-inputUserName").val();
  			$.ajax({
  				type:"GET",
  				url: _global_settings.service.url+"/owner/direct/enrolledAgent/session/" + uname+'/'+count,
  	          	datatype: "json",
  	          	success: function (data) {
  	          		/**
  	          		 * 模态框关闭事件，在短信验证码发送之后的情况下
  	          		 * 此时的短信模态框的html所在位置不可更换，因为有索引eq(4),如果更换，则会报错
  	          		 */
  	          		$('.jqx-window-close-button').eq(4).on('click',function(){
      	          		clearInterval(times);
						$('#match-getMsg').attr('disabled',false);
						$('#match-getMsg').text('免费获取验证码');
  	          		});
  	          		
  	          		//返回---匹配提示框返回按钮事件--在发送验证码之后返回情况下
					$('#matchUserbMgtCancleBtn').on('click',function(){
						clearInterval(times);
						$('#match-getMsg').attr('disabled',false);
						$('#match-getMsg').text('免费获取验证码');
					});
					
					$('#match-validCode').attr('disabled',false);
  	          	},
				failure : function(error) {
					//短信验证码发送不出去
					Core.alert({ message: '短信发送失败！请检查您的网络，似乎不太好哦！' });
				}
  	        })
		}
		
		//匹配验证码
		function matchValidCode(){
    		var resultValidCode;
    		var username = $('#match-inputUserName').val(),
			valid = $('#match-validCode').val();
		
          	Core.AjaxRequest({
				url:_global_settings.service.url+'/owner/direct/valid/verify/'+valid+'/'+username,
				type:'GET',
				showMsg:false,
				async:false,
				callback:function(res){
					resultValidCode=res;
				}
			});
          	//验证码匹配成功的情况
          	if(resultValidCode == true){
	          	var objs={}
	          		objs.name=$("#match-inputUserName").val(),
	          		objs.taxCode=_global_settings.owner.employeeCode;
          		
	          	Core.AjaxRequest({
					url:_global_settings.service.url+'/owner/updateTaxCodeByName',
					type:'PUT',
					params : objs,
					showMsg:false,
					async:false,
					callback:function(res){
						if(res){
							Core.alert({
								message:'匹配成功,刷新页面即可查看！',
								callback: function(){
									$('#matchUserbMgtWin').jqxWindow('close',function(){
										clearInterval(times);
										$('#match-getMsg').attr('disabled',false);
										$('#match-getMsg').text('免费获取验证码');
									});
									$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
									$('#addUserbMgtWin').jqxWindow('close');
								}
							});
						}
					}
				});
          	}else{
          		Core.alert({message:'验证码输入有误，请重新输入！'});
          	}
		}

		// 点击报税
		$('#userbMgtGrid').on('click','.decGoodsBtn',function() {
			var index = $(this).attr('data-index');
			var rowdata = $('#userbMgtGrid').jqxGrid('getrowdata', index);
			me.userbData = rowdata;
			$('#userbMgtWin').jqxWindow('open', function() {
				$('#userb-company').text(rowdata.name);
				$('#userbMgtDate').val(rowdata.mouthDate);
			});
		});

		// 点击确认报税
		$('#userbMgtConfirmBtn').on('click',function() {
			var obj = {};
				obj.mouthDate = $('#userbMgtDate').val(),
				obj.ownerId = me.userbData.id,
				obj.username = me.userbData.loginId;
				obj.vat = me.userbData.vat;
			
			Core.AjaxRequest({
				type : 'POST',
				url : _global_settings.service.url+'/common/tax/save',
				async : false,
				params : obj,
				showMsg:false,
				callback : function() {
					setCloseAlertTimeOneSecond();
					$('#userbMgtWin').jqxWindow('close');
					$('#userbMgtGrid').jqxGrid('updatebounddata', 'cells');
				},
				failure : function(e) {
					var err=JSON.parse(e.responseText);
					Core.alert({
						message: err.errorMsg,
						callback:function(){
							$('#userbMgtWin').jqxWindow('close');
						}
					});
				}
			});
			
		});

		// 编辑
		$('#userbMgtGrid').on('click','.editGoodsBtn', function() {
			var index = $(this).attr('data-index');
			var data = $("#userbMgtGrid").jqxGrid('getrowdata', index);
			me.userbData = data;
			initEditUserbWin(data);
		});
		
		//初始化编辑框信息
		function initEditUserbWin(data){
			console.log(data);
			$('#editUserbMgtWin').jqxWindow('open', function() {
				$('#edit-loginId').val(data.loginId);
				$('#edit-name').val(data.name);
				$('#edit-taxType').val(data.taxType);
				$('#edit-vat').val(data.vat + '%');
				$('#edit-MgtDate').val(data.mouthDate);
				$('#edit-taxpayer').val(data.owerTaxCode);
				$('#edit-sTime').val(data.startDate);
				$('#edit-eTime').val(data.endDate);
				$('#edit-period').val(data.dateType);
				$('#edit-amount').val(money(data.payAmt));
				$('#edit-phone').val(data.regTelephone==undefined?'':data.regTelephone);	
				$('#edit-email').val(data.email==undefined?'':data.email);
			});
		}
		
		//初始化编辑后提交信息--map
		function initSubmitEidtParams(){
			var obj = {};
				obj.ownerId = me.userbData.id, 														//id
				obj.username = $('#edit-loginId').val(),											//用户名
				obj.enterpriseName = $('#edit-name').val(),											//公司名
				obj.taxType = $('#edit-taxType').val(), 											//纳税人性质
				obj.vat = $('#edit-vat').val().substring(0,$('#edit-vat').val().length - 1),		//增值税率
				obj.startMonth = $('#edit-MgtDate').val();											//当前账期
				obj.enterpriseTaxCode = $('#edit-taxpayer').val();									//纳税人识别号
				obj.startDate = $('#edit-sTime').val();												//合同开始日期
				obj.endDate = $('#edit-eTime').val();												//合同结束日期
				obj.dateType = $('#edit-period').val();												//收款周期
				obj.payAmt = $('#edit-amount').val();												//收款金额
				obj.email = $('#edit-email').val();													//邮箱
				obj.regTelephone = $('#edit-phone').val();											//电话、
			return obj;
		}

		//submit
		function submitEidtParams(data){
			Core.AjaxRequest({
				type : 'PUT',
				url : _global_settings.service.url+'/owner/updateLoginById',
				async : false,
				params : data,
				showMsg:false,
				callback : function() {
					setCloseAlertTimeOneSecond();
					$('#editUserbMgtWin').jqxWindow('close');
					$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
				},
				failure : function(e) {
					Core.alert({
						message:e.responseJSON.errorMsg
					})
				}
			});
		}
		// 保存编辑
		$('#editUserSubmitBtn').on('click',function() {
			submitEidtParams(initSubmitEidtParams());
		});
		//匹配回车事件
		enterSubmit('#editUserbMgtWin','#editUserSubmitBtn');
		
		// 分配
		$('#userbMgtGrid').on('click','.partGoodsBtn', function() {
			var index = $(this).attr('data-index');
			var data = $('#userbMgtGrid').jqxGrid('getrowdata', index);
			me.userbData = data;
			Core.AjaxRequest({
				type : 'GET',
				url : _global_settings.service.url+'/user/taxManage',
				async : false,
				callback : function(res) {
					console.log(res);
					var arr = [];
					for(var i=0;i<res.length;i++){
						if(userbMgt.getTaxerInfo(res[i].username).username == res[i].username){
							arr.push(userbMgt.getTaxerInfo(res[i].username).name);
						}
					}
					$('#part-taxer').dropDownlist({
						theme : currentTheme,
						source : arr,
						searchMode : 'contains',
						displayMember : 'username',
						height : 34,
						width : '100%',
						selectedIndex : 0,
					});
					$('#partUserbMgtWin').jqxWindow('open', function() {
						if(userbMgt.getTaxerInfo(data.taxer).username == data.taxer){
							$('#part-taxer').val(userbMgt.getTaxerInfo(data.taxer).name);
						}
						$('#part-username').val(data.loginId);
						$('#part-name').val(data.name);
					});
				},
				failure : function() {
				}
			});
		});
		// 点击确认分配
		$('#partUserSubmitBtn').on('click',function() {
			//根据姓名获取用户名
			var partTaxer =null;
			var getTaxerInfomation=function(name){
				var rd = ComboBoxSources.getRecords('taxerInfo');
				for(i=0;i<rd.length;i++){
					if(name==rd[i].name){
						return rd[i];
					}
				}
				
				if(!name){
					return '';
				}
			}
			if(getTaxerInfomation($('#part-taxer').val()).name == $('#part-taxer').val()){
				partTaxer = getTaxerInfomation($('#part-taxer').val()).username;
			}
			var obj = [{
				id : me.userbData.id,
				loginId : partTaxer,
				name : $('#part-username').val(),
				mouthDate : me.userbData.mouthDate
			}];
			Core.AjaxRequest({
				type : 'POST',
				url : _global_settings.service.url+'/common/owner/tax/update/'+ partTaxer,
				async : false,
				params : obj,
				showMsg:false,
				callback : function() {
					setCloseAlertTimeOneSecond();
					$('#partUserbMgtWin').jqxWindow('close');
					$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
				},
				failure : function() {
				}
			});
		});
		
		// TODO 收款
		$('#userbMgtGrid').on('click','.receiptMoneyBtn', function() {
			var index = $(this).attr('data-index');
			var data = $("#userbMgtGrid").jqxGrid('getrowdata', index);
			me.userbData = data;
			$('#receiptUserbMgtWin').jqxWindow('open', function() {
				

				$('#receipt-period').dropDownlist({
					source : {'paymouth':'按月收款','payseason' : '按季度收款','payhalfyear' : '按半年收款','payyear' : '按年收款'},
					theme : currentTheme,
					height : 34,
					width : '100%',
//					selectedIndex : 0
				});
				
				console.log(me.userbData);
				$('#receipt-loginId').val(me.userbData.loginId);
				$('#receipt-name').val(me.userbData.name);
				$('#receipt-amount').val(new Date());
				$('#receipt-period').val(me.userbData.dateType);	
				
				$('#receipt-period').on('select',function(){
					receiptPeriodSelect();
				})
				
				if(me.userbData.startDate!=undefined){
					$('#receipt-sTime').val(me.userbData.startDate);
					receiptPeriodSelect();
				}else{
					$('#receipt-sTime').val($('#receipt-amount').val());
					receiptPeriodSelect();
				}
				$('#receipt-sTime').change(function(){
					receiptPeriodSelect();
				})
				
				function receiptPeriodSelect(){
					if($('#receipt-period').val()=='paymouth'){
						
						$('#receipt-money').val(money(data.payAmt));
						$('#receipt-eTime').val( getChangeDate( $('#receipt-sTime').val(), 1) );
						
					}else if($('#receipt-period').val()=='payseason'){
						
						$('#receipt-money').val(money(data.payAmt*3));
						$('#receipt-eTime').val( getChangeDate( $('#receipt-sTime').val(), 3 ) );
						
					}else if($('#receipt-period').val()=='payhalfyear'){
						
						$('#receipt-money').val(money(data.payAmt*6));
						$('#receipt-eTime').val( getChangeDate($('#receipt-sTime').val(), 6) );
						
					}else if($('#receipt-period').val()=='payyear'){
						
						$('#receipt-money').val(money(data.payAmt*12));
						$('#receipt-eTime').val( getChangeDate($('#receipt-sTime').val(), 12) );
						
					}
				}
				receiptPeriodSelect();
				
			});
		});
		
		//确认收款
		$('#receiptUserSubmitBtn').on('click',function(){
			var obj = {};
				obj.entryDate = $('#receipt-amount').val();						//收款日期
				obj.dateType = $('#receipt-period').val();						//收款周期
				obj.startDate = $('#receipt-sTime').val()==''?'':$('#receipt-sTime').val();	//收款区间
				obj.endDate = $('#receipt-eTime').val()==''?'':$('#receipt-eTime').val();		//收款区间
				obj.amt =money( $('#receipt-money').val() )=='NaN'?'': money( $('#receipt-money').val() );					//收款金额
				obj.owner = {};
				obj.owner.id = me.userbData.id;									//当前用户ID
				obj.type = 'pay';
			
			Core.AjaxRequest({
				type : 'POST',
				url : _global_settings.service.url+'/owner/payRemark',
				async : false,
				params : obj,
				showMsg:false,
				callback : function() {
					setCloseAlertTimeOneSecond();
					$('#receiptUserbMgtWin').jqxWindow('close');
					$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
				},
				failure : function() {
				}
			});
		});
		
		// TODO 催款发送邮件
		$('#userbMgtGrid').on('click','.sendPaymentEmail', function() {
			var index = $(this).attr('data-index');
			var data = $("#userbMgtGrid").jqxGrid('getrowdata', index);
			me.userbData = data;
			console.log(data)
			$('#sendEmailUserbMgtWin').jqxWindow('open', function() {
				
				$('#sendEmail-period').dropDownlist({
					source : {'paymouth':'按月收款','payseason' : '按季度收款','payhalfyear' : '按半年收款','payyear' : '按年收款'},
					theme : currentTheme,
					height : 34,
					width : '100%',
					selectedIndex : 0
				});
				
				$('#sendEmail-loginId').val(me.userbData.loginId);
				$('#sendEmail-name').val(me.userbData.name);
				$('#sendEmail-amount').val(new Date());
				$('#sendEmail-money').val(money(me.userbData.payAmt=='0'?'0.00':me.userbData.payAmt));
				$('#sendEmail-email').text(me.userbData.email==undefined?'':me.userbData.email);
				$('#sendEmail-period').val(me.userbData.dateType);
				
				if(me.userbData.startDate!=undefined){
					$('#sendEmail-sTime').val(me.userbData.startDate);
					sendEmailPeriodSelect();
				}else{
					$('#sendEmail-sTime').val($('#sendEmail-amount').val());
					sendEmailPeriodSelect();
				}
				$('#sendEmail-sTime').change(function(){
					sendEmailPeriodSelect();
				})
				
				function sendEmailPeriodSelect(){
					if($('#sendEmail-period').val()=='paymouth'){
						
						$('#sendEmail-money').val(money(data.payAmt));
						$('#sendEmail-eTime').val( getChangeDate($('#sendEmail-sTime').val(), 1) );
						
					}else if($('#sendEmail-period').val()=='payseason'){
						
						$('#sendEmail-money').val(money(data.payAmt*3));
						$('#sendEmail-eTime').val( getChangeDate( $('#sendEmail-sTime').val(), 3 ) );
						
					}else if($('#sendEmail-period').val()=='payhalfyear'){
						
						$('#sendEmail-money').val(money(data.payAmt*6));
						$('#sendEmail-eTime').val( getChangeDate($('#sendEmail-sTime').val(), 6) );
					
					}else if($('#sendEmail-period').val()=='payyear'){
					
						$('#sendEmail-money').val(money(data.payAmt*12));
						$('#sendEmail-eTime').val( getChangeDate($('#sendEmail-sTime').val(), 12) );
					
					}
				}
				sendEmailPeriodSelect();
				
				$('#sendEmail-period').on('select',function(){
					sendEmailPeriodSelect();
				})
				
				$('#sendEmailUserSubmitBtn').off('click').on('click',function(){
					var sendEmail = $('#sendEmail-email').text();
					var reg =/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g;
					if(  sendEmail ==''){
						Core.alert({
							message:'发送催款邮件，邮件不能为空哦！是否需要去编辑邮件？',
							callback:function(){
								$('#sendEmailUserbMgtWin').jqxWindow('close');
								$('#editUserbMgtWin').jqxWindow('open', function() {
									$('#edit-loginId').val(data.loginId);
									$('#edit-name').val(data.name);
									$('#edit-taxType').val(data.taxType);
									$('#edit-vat').val(data.vat + '%');
									$('#edit-MgtDate').val(data.mouthDate);
									$('#edit-taxpayer').val(data.owerTaxCode);
									$('#edit-sTime').val(data.startDate);
									$('#edit-eTime').val(data.endDate);
									$('#edit-period').val(data.dateType);
									$('#edit-amount').val(money(data.payAmt));
									$('#edit-phone').val(data.regTelephone==undefined?'':data.regTelephone);	
									$('#edit-email').val(data.email==undefined?'':data.email);
								});
							}
						});
					}else if( !reg.test(sendEmail) ){
						Core.alert({
							message:'邮件格式不正确，请确认邮件格式！',
							callback:function(){
								$('#sendEmailUserbMgtWin').jqxWindow('close');
								
								$('#editUserbMgtWin').jqxWindow('open', function() {
									$('#edit-loginId').val(data.loginId);
									$('#edit-name').val(data.name);
									$('#edit-taxType').val(data.taxType);
									$('#edit-vat').val(data.vat + '%');
									$('#edit-MgtDate').val(data.mouthDate);
									$('#edit-taxpayer').val(data.owerTaxCode);
									$('#edit-sTime').val(data.startDate);
									$('#edit-eTime').val(data.endDate);
									$('#edit-period').val(data.dateType);
									$('#edit-amount').val(money(data.payAmt));
									$('#edit-phone').val(data.regTelephone==undefined?'':data.regTelephone);	
									$('#edit-email').val(data.email==undefined?'':data.email);
								});
							}
						});
					}else if($('#sendEmail-money').val()=='0.00'){
						Core.alert({
							message:'催款金额不能为零！',
						});
					}else if(Number($('#sendEmail-sTime').val().replace(/[-]/g,''))>Number($('#sendEmail-eTime').val().replace(/[-]/g,''))){
						Core.alert({message:'请检查收款区间时间！'});
					}else{
						var obj = {};
							obj.entryDate = $('#sendEmail-amount').val();					//收款日期
							obj.dateType = $('#sendEmail-period').val();					//收款周期
							obj.startDate = $('#sendEmail-sTime').val()==''?'':$('#sendEmail-sTime').val();				//收款区间（起）
							obj.endDate = $('#sendEmail-eTime').val()==''?'':$('#sendEmail-eTime').val();				//收款区间（终）
							obj.amt = money( $('#sendEmail-money').val() )=='NaN'?'0.00':money( $('#sendEmail-money').val() );//收款金额
							obj.owner = {};
							obj.owner.id = me.userbData.id;									//当前用户ID
							obj.type = 'nopay';

						Core.AjaxRequest({
							type : 'POST',
							url : _global_settings.service.url+'/owner/payRemark',
							async : false,
							params : obj,
							showMsg:false,
							callback : function(res) {
								//储存邮件
								Core.AjaxRequest({
									type : 'GET',
									url : _global_settings.service.url+'/owner/mail/'+me.userbData.email+'/'+me.userbData.id+'/'+$('#sendEmail-sTime').val()+'/'+$('#sendEmail-eTime').val()+'/'+$('#sendEmail-money').val(),
									async : false,
									params : obj,
									callback : function(res) {
										console.log(res);
										//确认发送
										setCloseAlertTimeOneSecond();
										$('#sendEmailUserbMgtWin').jqxWindow('close');
										$('#userbMgtGrid').jqxGrid('updatebounddata','cells');
									},
									failure : function() {
										Core.alert({
											message:e.responseJSON.errorMsg
										})
									}
								});
							},
							failure : function(e) {
								Core.alert({
									message:e.responseJSON.errorMsg,
									callback:function(){
										$('#sendEmailUserbMgtWin').jqxWindow('close');
									}
								})
							}
						});
					} 
				})
			});
		});
		
		hiddenAclick();
	}

	this.unbindAll = function() {
		$('#userb-search').off('click');
		$('#addUserSubmitBtn').off('click');
		$('#editUserSubmitBtn').off('click');
		$('#userbMgtConfirmBtn').off('click');
		$('#partUserSubmitBtn').off('click');
		$('#receiptUserSubmitBtn').off('click');
		$('#sendEmailUserSubmitBtn').off('click');
	}
}