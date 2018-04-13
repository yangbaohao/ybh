/*
 *查看用户分配详情界面js
 */

var VudMgt = function() {
	var me = this;
	var url = _global_settings.service.url + '/user/manage/forall/';
	this.data = $.pk.data;

	this.initInput = function() {
		$('#viewuserd-show').css('display', '');
		$('#viewuserd-show').addClass('hiddendiv');
		me.initPage();
		me.initGrid(me.searchObj);
	}

	this.initPage = function() {
		$('#viewuser-selRoleName').text(me.data.name);
		$('#viewuser-selUserName').text('(' + me.data.username + ')');

		$('#viewUserdEmpWin').jqxWindow({
			theme : currentTheme,
			isModal : true,
			autoOpen : false,
			showCollapseButton : false,
			minHeight : 260,
			minWidth : 500,
			resizable : true,
			cancelButton : $('#cancelViewuserdEmpBtn'),
			initContent : function() {

			}
		});
	}

	// 初始化grid
	this.initGrid = function() {
		me.settings.source.data = me.searchObj;
		// 初始化数据源
		var demoAdapter = Core.AcDataAdapter('viewUserdGrid',
				me.settings.source, {
					beforeLoadComplete : function(records) {

					}
				}, me.debug);

		// 初始化Grid
		var grid_sets = {
			source : demoAdapter,
			rendergridrows : function(params) {
				return demoAdapter.recordids;
			},
			columns : [
					{
						text : '用户名',
						dataField : 'username',
						width : '12.5%'
					},
					{
						text : '姓名',
						dataField : 'name',
						width : '12.5%'
					},
					{
						text : '角色',
						dataField : 'roleName',
						width : '12.5%'
					},
					{
						text : '电话',
						dataField : 'phone',
						width : '12.5%'
					},
					{
						text : '拥有代理商',
						dataField : 'agentNum',
						width : '12.5%'
					},
					{
						text : '成功客户',
						dataField : 'successNum',
						width : '12.5%'
					},
					{
						text : '付费客户',
						dataField : 'payNum',
						width : '12.5%'
					},
					{
						text : '操作',
						width : '12.5%',
						align : 'center',
						cellsrenderer : function(rowIndex, columnfield, value,
								defaulthtml, columnproperties, rowdata) {
							var rtStr = '<div class="text-center">';
							rtStr += '<a class="hoverspan md-cancel deleteUserdBtn" title="删除"></a>';
							return rtStr + '</div>';
						}
					} ],
			pagesize : 20,
			columnsheight : 45,
			ready : function() {
			}
		};
		$('#viewUserdGrid').grid(grid_sets);

	}

	this.settings = {
		source : {
			url : url + me.data.userid,
			data : me.searchObj,
		},
		grid : {
			element : 'viewUserdGrid'
		},
		ajax : {
			url : url
		}
	};

	this.searchObj = {
		'u.username' : {
			value : [],
			action : 'like'
		},
		'u.userInfo.name' : {
			value : [],
			action : 'like'
		},
		'u.userInfo.telephone' : {
			value : [],
			action : 'like'
		}
	};

	/**
	 * 查询列表数据
	 */
	this.searchDataInfo = function() {
		$('#viewUserdGrid').jqxGrid('applyfilters');
		$('#viewUserdGrid').jqxGrid('refreshfilterrow');
		$('#viewUserdGrid').jqxGrid('clearselection');
	};

}

var VudBindModle = function(vudMgt) {
	var me = this;
	var url = _global_settings.service.url + '/user/userParentCode/byId';

	this.search = function() {
		var username = $('#viewuserd-username').val(), name = $(
				'#viewuserd-name').val(), phone = $('#viewuserd-phone').val();

		vudMgt.searchObj['u.username'].value = [];
		if (username != '')
			vudMgt.searchObj['u.username'].value.push(username);

		vudMgt.searchObj['u.userInfo.name'].value = [];
		if (name != '')
			vudMgt.searchObj['u.userInfo.name'].value.push(name);

		vudMgt.searchObj['u.userInfo.telephone'].value = [];
		if (phone != '')
			vudMgt.searchObj['u.userInfo.telephone'].value.push(phone);

		vudMgt.searchDataInfo();
	}

	var getEmp = function(str) {
		Core.AjaxRequest({
			url : _global_settings.service.url + '/common/manage/' + str,
			type : 'GET',
			showMsg : false,
			async : false,
			callback : function(res) {
				console.log(res);
				$('#viewuserd-emp').dropDownlist({
					theme : currentTheme,
					source : res,
					searchMode : 'contains',
					displayMember : 'username',
					valueMember : 'id',
					height : 34,
					width : '100%',
					checkboxes : true,
					placeHolder : ''
				});
			}
		});
	}

	this.bind = function() {

		// 点击删除
		$('#viewUserdGrid').off('click').on(
				'click',
				'.deleteUserdBtn',
				function() {
					var index = $('#viewUserdGrid').jqxGrid(
							'getselectedrowindex');
					if (index >= 0) {
						var rowdata = $('#viewUserdGrid').jqxGrid('getrowdata',
								index);
						console.log(rowdata);
						Core.confirm({
							message : '确定要解绑员工：' + rowdata.username + '('
									+ rowdata.name + ')',
							confirmCallback : function() {
								Core.AjaxRequest({
									type : 'PUT',
									url : url,
									params : {
										id : rowdata.id
									},
									async : false,
									showMsg:false,
									callback : function() {
										setCloseAlertTimeOneSecond();
										$('#viewUserdGrid').jqxGrid(
												'updatebounddata', 'cells');
									}
								});
							}
						});
					}
				});

		// 点击搜索
		$('#viewuserd-search').on('click', function() {
			if ($('#viewuserd-show').is(':hidden'))
				$('#viewuserd-show').slideDown('slow');
			else
				me.search();
		});

		hiddenAclick();

		// 点击分配
		$('#viewuserd-fp').on('click', function() {

			$('#viewUserdEmpWin').jqxWindow('open', function() {
				$('#viewuserd-uname').text(vudMgt.data.username);
				if (vudMgt.data.roleName == 'salesManage')
					getEmp('sales');
				else if (vudMgt.data.roleName == 'customerManage')
					getEmp('customer');
				else if (vudMgt.data.roleName == 'secondLevelSalesManage')
					getEmp('secondLevelSalesManage');
				else
					getEmp('secondLevelCustomerManage');
			});

		});

		// 保存分配员工
		$('#viewuserdSaveBtn').on(
				'click',
				function() {
					var ids = [];
					var items = $('#viewuserd-emp').jqxDropDownList(
							'getCheckedItems');

					$.each(items, function(i) {
						var obj = {};
						obj.id = items[i].originalItem.id;
						ids.push(obj);
					});

					Core.AjaxRequest({
						url : _global_settings.service.url + '/user/gaveup/'
								+ vudMgt.data.userid,
						type : 'PUT',
						params : ids,
						async : false,
						showMsg:false,
						callback : function() {
							try {
								setCloseAlertTimeOneSecond();
								$('#viewUserdEmpWin').jqxWindow(
										'close',
										function() {
											$('#viewuserd-name').text('');
											$('#viewuserd-emp')
													.jqxDropDownList(
															'uncheckAll');
										});
								$('#viewUserdGrid').jqxGrid('updatebounddata',
										'cells');
							} catch (e) {
							}
						}
					});

				});

	}

	this.unbindAll = function() {
		$('#viewuserd-search').off('click');
		$('#viewuserd-fp').off('click');
		$('#viewuserdSaveBtn').off('click');
	}
}