/**
 * 首页界面初始化
 */
var HomeMgt = function() {
    var me = this;
    var pagesize=20;
    var currentRoleName = _global_settings.owner.roleName;

    this.initInput = function() {
        me.initUserPage();
        me.initSearch();
        me.initPlaceOrders();
        //      me.initBizLog();
        me.initOcrOrderGrid();
        me.bind();
        me.unbindAll();
    };

    /**
     * 初始化搜索组建
     */
    this.initUserPage = function() {

        $('#ocrOrder-show').css('display', '');

        var statusObj = {
            'all': '请选择',
            'stayOrder': '待抢单',
            'orderSuccess': '抢单成功',
            'orderSubmit': '待审核',
            'checking': '审核中',
            'checkSuccess': '审核通过',
            'checkFailed': '审核不通过',
            'checkingAgain': '复核中',
            'checkAgainSuccess': '复核通过',
            'checkAgainFailed': '复核不通过',
            'complete': '客户成功确认',
            'checkRefused': '客户拒绝',
            'orderSubmitAgain': '再次提交',
            'kfReject': '客服驳回',
            'KHBackout': '客户撤销',
            'KHSubmitAgain': '客户重新提交'
        }
        $('#ocrOrder-status').dropDownlist({
            source: statusObj,
            selectedIndex: 0
        });

        $('#ocrOrder-serviceType').dropDownlist({
            source: { 'all': '请选择', 'emergency': '加急', 'general': '一般', 'veryEmergency': '特别加急' },
            selectedIndex: 0,
            dropDownHeight: 120
        });

        $('#ocrOrder-responsibleName').comboBox({
            source: ComboBoxSources.getRecords('getEmployee'),
            displayMember: 'name',
            valueMember: 'name'
        });

        $('#ocrOrder-submitDate').dropDownlist({
            source: { 'logsum.createDate': '提交日期', 'orderSuccessDate': '接单时间', 'orderSubmitDate': '完成时间', 'checkBeginDate': '审核开始时间', 'checkSuccessDate': '审核完成时间' },
            //			displayMember:'username',
            //			valueMember:'username',
            selectedIndex: 0,
            dropDownHeight: 150
        });

        $('#ocrOrder-date').dropDownlist({
            source: { '0': '请选择', '1': '最近一周', '2': '最近两周', '3': '最近三周', '4': '本月', '5': '本季度', '6': '本年' },
            selectedIndex: 0,
            dropDownHeight: 120
        });
        $('#ocrOrder-sDate,#ocrOrder-eDate').datetimeinputs( /*{formatString:"yyyy-MM-dd", width: '100%', height: '34px'}*/ );
        //		$('#ocrOrder-eDate').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});

        $('#ocrOrder-date').on('change', function() {
            setValueById('ocrOrder-date', 'ocrOrder-sDate', 'ocrOrder-eDate');
        });

        //		var allUserName = ComboBoxSources.getRecords('allUsername');
        $('#ocrOrder-userName').comboBox({
            source: ComboBoxSources.getRecords('username'),
            displayMember: 'name',
            valueMember: 'name'
        });

        $('#ocrOrder-ownerName').comboBox({
            source: ComboBoxSources.getRecords('company'),
            displayMember: 'company',
            valueMember: 'company'
        });

        $('#ocrOrder-show').addClass('hiddendiv');

    }


    this.searchObj = {};

    this.initSearch = function() {
        me.searchObj = {
            'logsum.orderApprovalStatus': { value: [], action: 'eq' },
            'serviceType': { value: [], action: 'eq' },
            "CONCAT(userinfo2.name,'(', bsssysuser.username,')')": { value: [], action: 'like' },
            'logsum.createDate': { value: [], action: 'between' },
            'orderSuccessDate': { value: [], action: 'between' },
            'orderSubmitDate': { value: [], action: 'between' },
            'checkBeginDate': { value: [], action: 'between' },
            'checkSuccessDate': { value: [], action: 'between' },
            'logsum.orderNumber': { value: [], action: 'like' },
            'sysuser.username': { value: [], action: 'like' },
            'userinfoe.name': { value: [], action: 'like' },
            'userinfo.telephone': { value: [], action: 'like' },
        }
    }

    /**
     * 待抢单列表
     */
    this.initPlaceOrders = function() {
        var url = null;
        if (currentRoleName == 'Ocr_auditor') {
            $('#placeOrdersTitle').text('待审核列表');
            url = _global_settings.service.url + "/overview/waitCheck";
        } else {
            url = _global_settings.service.url + "/overview/waitOrder"
        }

        $('#placeOrders').html('');

        Core.AjaxRequest({
            type: 'GET',
            url: url,
            callback: function(data) {
                for (var i = 0, length = data.length; i < length; i++) {
                    var type = data[i].serviceType;
                    var html =
                        '<div class="inbox-item row p-0 m-0">' +
                        '<div class="col-lg-12 p-0 m-0">' +
                        '<div class="p-t-10 m-l-15">' +
                        '<a class="serviceTypeAlink">' +
                        '<p class="m-0">' + getCodeData(type) + '：' + data[i].orderQty + '单</p>' +
                        '<p class="m-0">' +
                        '<span style="font-size:12px;">' + data[i].begingDate + '</span>' +
                        '<span style="font-size:12px;">—' + data[i].endDate + '</span>' +
                        '</p>' +
                        '</a>' +
                        '</div>' +
                        '</div>'
                    '</div>';

                    $('#placeOrders').append(html);
                    $('.serviceTypeAlink').eq(i).data('type', type);
                    if (type == 'emergency' || type == 'checkRefused') {
                        $('#placeOrders').find('.serviceTypeAlink').eq(i).css('color', 'red');
                    }
                }
            }
        });
    };

    window.initPlaceOrders = me.initPlaceOrders;

    /**
     * 业务日志
     */
    this.initBizLog = function() {

        var obj = { "condition": [], "filterscount": 0, "groupscount": 0, "pagenum": 0, "pagesize": 20 };
        var url = _global_settings.service.url + '/overview/searchLogInfo/' + new Base64().encode(JSON.stringify(obj));

        Core.AjaxRequest({
            type: 'GET',
            url: url,
            callback: function(data) {
                var source = data.rows;
                for (var i = 0, length = source.length; i < length; i++) {
                    var number = source[i].orderNumber == undefined ? '' : source[i].orderNumber;
                    var html = '<div class="time-item">' +
                        '<div class="item-info">' +
                        '<div class="text-muted">' + source[i].createBy + ' ' + getCodeData(source[i].handletype) + '<br/>' +
                        '<a>' + number + '</a>' +
                        '</div>' +
                        '<p>' + source[i].handleDate + '</p>' +
                        '</div>' +
                        '</div>';
                    $('#operationLog').append(html);
                }
            }
        });
    };

    /**
     * 初始化用户grid
     */
    this.initOcrOrderGrid = function() {
        var source = {
            data: me.searchObj,
            url: _global_settings.service.url + '/overview/search/salesorder/byvo',
            type:'get'
        }

        //初始化数据源
        var demoAdapter = Core.AcDataAdapter('userInformationGrid', source, {
            beforeLoadComplete: function(records){},
            loadComplete: function(res) {
            	pagesize = res.totalRows <= 20 ? 20 : res.totalRows;
//            	console.log(res.totalRows);
            }
        }, me.debug);

        //初始化Grid
        var grid_sets = {
            source: demoAdapter,
            rendergridrows: function() {
                return demoAdapter.recordids;
            },
            pagesize: 20,
            sortable: true,
            enablehover: false,
            columnsheight: 45,
            columns: me.initColumns(),
//            pagerrenderer: pagerrenderer,
        };

        $('#userInformationGrid').grid(grid_sets)//.on("pagesizechanged", function (event) {
    	    // event arguments.
//    	    var args = event.args;
//    	    // page number.
//    	    var pagenum = args.pagenum;
//    	    // old page size.
//    	    var oldpagesize = args.oldpagesize;
//    	    // new page size.
//    	    var pagesize = args.pagesize;
//        	table.jqxGrid('pagesize',10);
//    	    table.jqxGrid('gotopage',8);
//    	    console.log(args);
    	//})//.on("pagechanged", function (event) {
//    		// event arguments.
//    	    var args = event.args;
//    	    // page number.
//    	    var pagenum = args.pagenum;
//    	    // page size.
//    	    var pagesize = args.pagesize;
//    	    console.log(args)
//    	});
    }
    
  //下拉选择
//    var table = $('#userInformationGrid');
//	var start = 1; //i开始
//	var end = 10;  //i结束
//	var select = 0;//select button
	
	//初始化分页
	var gratepage = function (pagecount) {
//		console.log(lastpage)
		var html = '<div class="float-right littlebtn" style="height:26px">';
//		var endbtn = pagecount > end ? 10 : pagecount;
		
		
		for(var i = start; i <= end; i++) {
			if( i <= 0) continue;
			if( i > pagecount) break;
//			if (i == pagecount) {
//				html += '<div class="selectbtn" style="width:40px;float:left;border:1px solid grey;text-align:center;border-radius:4px">'+i+'</div>';
//			} else {
				html += '<div class="selectbtn" style="width:40px;float:left;border:1px solid grey;text-align:center;border-radius:4px;margin-right:5px;margin-left:5px">'+i+'</div>';
//			}
		}
		
		return html + '</div>';
	}
	
	var pagerrenderer = function () {
		 console.time('生成时间');
	     var element = $("<div style='margin-left: 10px; margin-top: 5px; width: 100%; height: 40px;'></div>");
	     var datainfo = table.jqxGrid('getdatainformation');
	     var paginginfo = datainfo.paginginformation;
	     var rowscount = datainfo.rowscount == 0 ? 1 : datainfo.rowscount; //数据总数
	     var pagecount = paginginfo.pagescount; //页数
	     var pagenum = paginginfo.pagenum; //页码
	     var pagesize = paginginfo.pagesize;
	     console.log(datainfo)
//	     console.log(paginginfo);
	     
	     var input = $("<div class='tiaozhi' style='font-size: 11px; margin-right: 10px;float: right;width:200px'>"+
	    		 "<label class='float-left'>跳至</label>" +
	    		 "<input class='float-left form-control' style='width:70px;height:25px' type='text'>" +
	    		 "<label class='float-left'>页</label></div>");
	     input.appendTo(element);
	    
	     var dropselect = $("<div style='font-size: 11px; margin-right: 100px;float: right;'></div>");
//	     dropselect.text("1-" + paginginfo.pagesize + ' of ' + datainfo.rowscount);
	     dropselect.dropDownlist({source:{'10':'10条/页','20':'20条/页','50':'50条/页'},width:90,height:25}).val(pagesize);
	     dropselect.appendTo(element);
	     self.label = dropselect;
	     
	     var leftButton = $("<div style='padding: 0px; float: right;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
	     leftButton.find('div').addClass('jqx-icon-arrow-left');
	     leftButton.width(36);
	     leftButton.jqxButton({
	         theme: 'energyblue'
	     });
	     var rightButton = $("<div style='padding: 0px; float: right;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
	     rightButton.find('div').addClass('jqx-icon-arrow-right');
	     rightButton.width(36);
	     rightButton.jqxButton({
	         theme: 'energyblue'
	     });
	     
	     rightButton.appendTo(element);
	     debugger
    	 element.append(gratepage(pagecount));
	     element.find('.selectbtn').eq(select).addClass('select'); //abcnum
	     
	     leftButton.appendTo(element);
	     
	     var showtotal = $('<div style="float:left">共'+rowscount+'条记录</div>');
	     showtotal.appendTo(element);
	     
	     // update buttons states.
	     var handleStates = function (event, button, className, add) {
	         button.on(event, function () {
	             if (add == true) {
	                 button.find('div').addClass(className);
	             } else button.find('div').removeClass(className);
	         });
	     }
	     rightButton.click(function () {debugger
	    	 var selectbtn = element.find('.select');
	     	 var last = element.find('.selectbnt').last().text();
     	 	 var index = parseInt(selectbtn.index());
	    	 var info = table.jqxGrid('getdatainformation');
		     var count = info.paginginformation.pagescount; //页数
	     	 var pagenum = info.paginginformation.pagenum; //pagenum
	     	 if(last == count) return;
	     	 console.log(index)
	     	 select = index;
	     	 
	     	 if(index < 4) {
	     		 select++;
	     	 } else if (index >= 4) {
	     		 end++;
	     		 if(end > count) {
	     			 end = count;
	     			 select++;
	     		 }else {
//	     			 select = 4;
	     			 select = select;
	     		 }
	     	 }
	     	 start = end - 10 + 1;
	     	 
	    	 table.jqxGrid('gotonextpage');
	     });
	     leftButton.click(function () {debugger
	    	 var selectbtn = element.find('.select');
	     	 var first = element.find('.selectbtn').first().text();	
 	 	 	 var index = parseInt(selectbtn.index());
	    	 var info = table.jqxGrid('getdatainformation');
		     var count = info.paginginformation.pagescount; //页数
	    	 var pagenum = info.paginginformation.pagenum; //pagenum
	    	 if(first == 1) return;
	     	 select = index;
	     	 
	     	 if(index > 4) {
	     		 select--
	     	 } else if(index <= 4){
	     		 end--;
	     		 if(end < 10) {
	     			 end = 10;
	     			 select--;
	     		 }else {
//	     			 select = 4;
	     			 select = select;
	     		 }
	     	 }
	    	 
	     	 start = end - 10 + 1;
	    	 table.jqxGrid('gotoprevpage');
//	    	 table.jqxGrid('gotopage',index);
	     });
	     
	     //下拉选择
	     dropselect.on('select',function(){debugger
	    	 var info = table.jqxGrid('getdatainformation');
	    	 var lastpagesize = info.paginginformation.pagesize;
	    	 var lastpagenum = info.paginginformation.pagenum;
//	    	 var selectbtn = element.find('.selectbtn');
//	    	 var lastnum = parseInt(selectbtn.last().text());
//	     	 var firstnum = parseInt(selectbtn.first().text());
	     	 var nowpagesize = parseInt($(this).val());
	    	 var nowpagenum = 0, pagecount = 0;
	    	 if(nowpagesize > lastpagesize) { //页码
	    		 nowpagenum = Math.floor(lastpagenum / (nowpagesize / lastpagesize));
	    	 } else {
	    		 nowpagenum = Math.floor(lastpagenum * (lastpagesize / nowpagesize));
	    	 }
	    	 
	    	 if(rowscount % nowpagesize == 0) {
	    		 pagecount = rowscount / nowpagesize;  //总页数
	    	 } else {
	    		 pagecount = Math.ceil(rowscount / nowpagesize);
	    	 }
	    	 
	    	 console.log('每页数据'+nowpagesize+'条\n','页码'+nowpagenum+'\n','总页数'+pagecount);
	    	 
	    	 end = nowpagenum + 2;
	    	 if(end < 10) {
	    		 end = 10;
	    		 select = nowpagenum;
	    	 } else {
	    		 select = 8;
	    	 }
	    	 start = end - 10 + 1;
	    	 
	    	 table.jqxGrid('pagesize',nowpagesize); //会重新触发第313行
	    	 table.jqxGrid('gotopage',nowpagenum);
//	    	 table.jqxGrid('refresh');
//	    	 table.trigger('pagesizechanged',nowpagesize,nowpagenum);
	     });
	     
	     //点击按钮
	     element.find('.selectbtn').on('click' ,function() {debugger
	    	 var t = $(this);
	     	 var index = t.index();
	    	 var text = parseInt(t.text());
	    	 var last = parseInt(element.find('.selectbtn').last().text());
	    	 var first = parseInt(element.find('.selectbtn').first().text());
	    	 var info = table.jqxGrid('getdatainformation');
	     	 var count = info.paginginformation.pagescount; //页数
	     	 var pagenum = info.paginginformation.pagenum;
	     	 if(pagenum + 1 == text) return; //重复点击
	     	 
	     	 select = index;
	     	 
	     	 if(text == last) {
	     		 end += 8;
	     		 if(end > count) {
	     			 end = count;
	     			 select = end < 10 ? text - 1 : text - (end - 10 + 1); //text - start
	     		 }else {
	     			 select = 1;
	     		 } 
	     	 } else if(text == first) {
	     		 end -= 8;
	     		 if(end < 10) {
	     			 end = 10;
	     			 select = text - 1;
	     		 } else {
	     			 select = 8;
	     		 }
	     	 } 
	     	 
	     	 start = end - 10 + 1;
	     	 
	    	 table.jqxGrid('gotopage',text - 1);
	     })
	     
	     //跳至
	     input.find('input').on('keyup' ,function(event) {debugger
	    	 var info = table.jqxGrid('getdatainformation');
	     	 var count = info.paginginformation.pagescount; //页数
	     	 var selectbtn = element.find('.selectbtn');
	     	 var lastnum = parseInt(selectbtn.last().text());
	     	 var firstnum = parseInt(selectbtn.first().text());
	    	 var iptvalue = parseInt($(this).val()); //输入的数
	    	 var keyCode = event.keyCode;

	    	 if(iptvalue > count || iptvalue < 1) return;
	    	 
	    	 if(iptvalue != '') {
	    		 if(keyCode == 13) {
	    			 if(iptvalue >= firstnum && iptvalue <= lastnum) {
	    				for(var i = 0,len = selectbtn.length;i < len ; i++) {
	    					if(iptvalue == selectbtn[i].innerText) {
	    						select = i;
//	    						iptvalue = i + 1;
	    						break;
	    					}
	    				}
//	    				select = iptvalue;
	    				end = lastnum;
	    				start = firstnum;
	    			 } else if(iptvalue > lastnum) {
	    				 end = iptvalue + 1;
	    				 if(end > count) {
	    	     			 end = count;
//	    	     			 select = 1;
	    	     			 select = 9;
	    	     		 }else {
	    	     			 select = 8;
	    	     		 }
	    				 start = end - 10 + 1;
	    			 } else {
	    				 end = iptvalue - 1;
	    	     		 if(end < 10) {
	    	     			 end = 10;
	    	     			 select = iptvalue - 1;
	    	     		 } else {
	    	     			 if(end < iptvalue) {  //iptvalue=11;
	    	     				 end = iptvalue + 1;
	    	     				 select = 8;
	    	     			 }else {
	    	     				 select = 1;
	    	     			 }
	    	     		 }
	    	     		 start = end - 10 + 1;
	    			 }
	    			 table.jqxGrid('gotopage',iptvalue - 1);
	    		 }
	    	 }
	     });
	     
	     console.timeEnd('生成时间');
	     
	     return element;
	 }

    var setCol = function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {

        var html = '<div class="agrid">';
        var text = columnproperties.text;

        switch (text) {
//	        case '编号':
//	        	var index = rowdata.boundindex + 1;
//	        	return html+index + '<div>';
            case '用户名':
                var name = rowdata.userName;
                var count = rowdata.ocrCount == undefined ? 0 : rowdata.ocrCount;
                if (count > 0 && count < 4) {
                    html += name + '<span class="count">' + count + '</span></div>';
                } else {
                    html += name;
                }
                return html + '<div>';
            case '单号':
                if (rowdata.orderType == 'stayOrder') {
                    html += rowdata.orderNumber;
                } else if(currentRoleName=='Ocr_auditor'&&rowdata.orderType=='orderSubmit'){
                	html += rowdata.orderNumber;
                } else{
                	html += '<a class="hoverspan viewOcrSalesOrder">' + rowdata.orderNumber + '</a>';
                }
                return html + '</div>';
            case '服务类型':
                if (rowdata.serviceType == 'emergency') {
                    html = '<div class="agrid" style="color:red;" title="' + getCodeData(rowdata.serviceType) + '">';
                } else {
                    html = '<div class="agrid" title="' + getCodeData(rowdata.serviceType) + '">';
                }
                html += getCodeData(rowdata.serviceType) + '</div>';
                return html + '</div>';
//            case '审单完成':
//                if (rowdata.checkAgainSuccessDate == undefined) {
//                    html = '<div class="agrid" title="' + rowdata.checkSuccessDate + '">';
//                } else {
//                    html = '<div class="agrid" title="' + rowdata.checkAgainSuccessDate + '">';
//                }
//                return html + '</div>';    
            case '单据状态':
                var type = rowdata.orderType;
                if (type == 'stayOrder' || type == 'checkRefused' || type == 'checkFailed' | type == 'checkAgainFailed') {
                    html = '<div class="agrid"><a class="hoverspan viewOcrOrderStatus" title="查看单据状态" style="color:red;">';
                } else {
                    html = '<div class="agrid"><a class="hoverspan viewOcrOrderStatus" title="查看单据状态">';
                }
                html += getCodeData(rowdata.orderType) + '</a>';
                return html + '</div>';
            case '操作':
                html = '<div class="text-center">';
                var type = rowdata.orderType;
                if (currentRoleName == 'Ocr_createBy' || currentRoleName == 'Ocr_Admin'||currentRoleName=='Ocr_group') {
                    if (type == 'stayOrder') {
                        html += '<a class="hoverspan md-play-install getSalerOrder" title="抢单"></a>';
                    }
                }
                if (currentRoleName == 'Ocr_auditor' || currentRoleName == 'Ocr_Admin'||currentRoleName=='Ocr_group') {
                    if (type == 'orderSubmit' || type == 'orderSubmitAgain') {
                        html += '<a class="hoverspan md-check-box checkSalerOrder" title="审批"></a>';
                    }
                }
                return html + '</div>';
        }

    }

    /**
     * 初始化数据列
     */
    this.initColumns = function() {
        var columns = [
//            { text: '编号', width: '3%', cellsrenderer: setCol },                       
            { text: '用户名', datafield: 'userName', width: '8%', cellsrenderer: setCol },
            { text: '商户名称', datafield: 'ownerName', width: '10%' },
            /*{ text: '电话号码',datafield:'telephone',width:'8%'},*/
            { text: '单号', datafield: 'orderNumber', width: '10%', cellsrenderer: setCol },
            { text: '产品数量', datafield: 'detailQty', width: '5%' },
            { text: '服务类型', width: '5%', cellsrenderer: setCol },
            { text: '单据状态', width: '7%', cellsrenderer: setCol },
            { text: '制单人', datafield: 'responsibleName', width: '8%' },
            { text: '审核人', datafield: 'checkName', width: '8%' },
            { text: '客户提交', datafield: 'submitDate' },
            { text: '接单时间', datafield: 'orderSuccessDate' },
            { text: '制单完成', datafield: 'orderSubmitDate' },
            { text: '审单时间', datafield: 'checkBeginDate' },
            { text: '审单完成', datafield: 'checkSuccessDate'/*, cellsrenderer: setCol*/ },
            { text: '用户确认', datafield: 'completeDate' },
            { text: '操作', width: '4%', cellsrenderer: setCol }
        ];
        return columns;
    };

    window.initCol=me.initColumns;
    var abc=new quickKey();
    abc.anyKey();
    
    this.searchDataInfo = function() {
        $('#userInformationGrid').jqxGrid('applyfilters');
        $('#userInformationGrid').jqxGrid('refreshfilterrow');
        $('#userInformationGrid').jqxGrid('clearselection');
    };

    this.refreshDataInfo = function() {
        $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
        $('#userInformationGrid').jqxGrid('clearselection');
        $('#userInformationGrid').jqxGrid('refreshdata');
    };

    this.search = function() {
        var orderType = $('#ocrOrder-status').val(), //单据状态
            serviceType = $('#ocrOrder-serviceType').val(), //服务类型
            responsibleName = $('#ocrOrder-responsibleName').val(), //负责人
            orderNumber = $('#ocrOrder-number').val(), //单号
            userName = $('#ocrOrder-userName').val(), //用户名
            ownerName = $('#ocrOrder-ownerName').val(), //商户名				
            telephone = $('#ocrOrder-phone').val(), //电话号码
            st = $('#ocrOrder-sDate').val(),
            et = $('#ocrOrder-eDate').val(),
            date = $('#ocrOrder-submitDate').val();

        me.searchObj['logsum.orderApprovalStatus'].value = [];
        if (orderType != 'all')
            me.searchObj['logsum.orderApprovalStatus'].value.push(orderType);

        me.searchObj['serviceType'].value = [];
        if (serviceType != 'all')
            me.searchObj['serviceType'].value.push(serviceType);

        me.searchObj["CONCAT(userinfo2.name,'(', bsssysuser.username,')')"].value = [];
        if (responsibleName != '')
            me.searchObj["CONCAT(userinfo2.name,'(', bsssysuser.username,')')"].value.push(responsibleName);

        me.searchObj['logsum.orderNumber'].value = [];
        if (orderNumber != '')
            me.searchObj['logsum.orderNumber'].value.push(orderNumber);

        me.searchObj['sysuser.username'].value = [];
        if (userName != '')
            me.searchObj['sysuser.username'].value.push(userName);

        me.searchObj['userinfoe.name'].value = [];
        if (ownerName != '')
            me.searchObj['userinfoe.name'].value.push(ownerName);

        me.searchObj['userinfo.telephone'].value = [];
        if (telephone != '')
            me.searchObj['userinfo.telephone'].value.push(telephone);

        me.searchObj['logsum.createDate'].value = [];
        me.searchObj['orderSuccessDate'].value = [];
        me.searchObj['orderSubmitDate'].value = [];
        me.searchObj['checkBeginDate'].value = [];
        me.searchObj['checkSuccessDate'].value = [];

        if (st != '' && et != '') {
            me.searchObj[date].value.push(st + ' ' + '00:00:00', et + ' ' + '23:59:59');
            me.searchObj[date].action = 'between';
        }
        if (st === '' && et != '') {
            me.searchObj[date].value.push(et + ' ' + '23:59:59');
            me.searchObj[date].action = 'le';
        }
        if (st != '' && et === '') {
            me.searchObj[date].value.push(st + ' ' + '00:00:00');
            me.searchObj[date].action = 'ge';
        }

        me.searchDataInfo();
    }

    /**
     * 绑定事件
     */
    this.bind = function() {
        /*debugger
        var audioSrc = 'images/1014.mp3',
        	audio = document.createElement('audio');
        	audio.src = audioSrc;
        	var reader = new FileReader();
        	reader.readAsDataURL(audio.src);
        	reader.onload = function() {
        		console.log(reader.result);
        	};*/

        /**
         * getboundrows 获取表格数据
         * addrow新增一行
         * deleterow删除一行
         * 
         * 拿到后台返回的数据
         * 1，需要新增数据到表格上。2，刷新带抢单列表
         */
        // connectWebsocket(function(msg) {
        //     if (msg != '' && msg != undefined && msg.data != undefined) {

        //         if (msg.data == 'ocr:checkOrder' && currentRoleName == 'Ocr_auditor') { //审核人
        //             $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
        //             me.initPlaceOrders();
        //             //语音消息提醒和弹框提醒
        //             popNotice('images/1014.mp3');
        //         }

        //         if (msg.data == 'ocr:stayOrder' && currentRoleName == 'Ocr_createBy') { //制单人
        //             $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
        //             me.initPlaceOrders();
        //             //语音消息提醒和弹框提醒
        //             popNotice('images/1014.mp3');
        //         }
        //     }

        // });

        //点击搜索
        $('#ocrOrder-search').on('click', function() {
//        	console.log('select',select,start,end)
            if ($('#ocrOrder-show').is(':hidden')) {
                $('#ocrOrder-show').slideDown('slow');
            } else {
//            	start = 1;
//            	end = 10;
//            	select = 0;
                me.search();
            }
        });

        hiddenAclick();

        //点击带抢单列表搜索
        $('#placeOrders').on('click', '.serviceTypeAlink', function() {
            var serviceType = $(this).data('type');
            $('#ocrOrder-serviceType').jqxDropDownList({ selectedIndex: 0 });
            $('#ocrOrder-status').jqxDropDownList({ selectedIndex: 0 });

            var arr = ['checkRefused', 'KHSubmitAgain', 'checkAgainFailed', 'checkFailed']

            if (serviceType != 'checkRefused') {
                if (serviceType != 'KHSubmitAgain') {
                    if (currentRoleName == 'Ocr_auditor') {
                        $('#ocrOrder-status').val(serviceType); //审核人点击搜索此单据
                    } else {
                        if (serviceType == 'checkAgainFailed' || serviceType == 'checkFailed') {
                            $('#ocrOrder-status').val(serviceType);
                        } else {
                            $('#ocrOrder-serviceType').val(serviceType); //带抢单状态
                            $('#ocrOrder-status').val('stayOrder');
                        }
                    }
                } else {
                    $('#ocrOrder-status').val(serviceType); //客户重新提交状态
                }
            } else {
                $('#ocrOrder-status').val(serviceType); //客户拒绝状态
            }

            me.search();
        });


        var initProveModal = function(source) {
            $('#view_prove').modal('show');

            var data = {
                localdata: source,
                datatype: 'array'
            }

            var demo = new $.jqx.dataAdapter(data);

            var remark = function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
                var html = '<div class="agrid">';
                var abc = '';
                switch (rowdata.handleType) {
                    case 'orderSubmitAgain': //再次提交
                        abc = rowdata.submitRemark == undefined ? '' : rowdata.submitRemark;
                        break;
                    case 'KFReject': //客服驳回
                        abc = rowdata.rejectRemark == undefined ? '' : rowdata.rejectRemark;
                        break;
                    case 'checkSuccess': //审核
                        abc = rowdata.checkRemark == undefined ? '' : rowdata.checkRemark;
                        break;
                    case 'checkFailed': //复核
                        abc = rowdata.checkRemark == undefined ? '' : rowdata.checkRemark;
                        break;
                    case 'checkRefused': //客户驳回
                        abc = rowdata.refusedRemark == undefined ? '' : rowdata.refusedRemark;
                        break;
                    default:
                        abc = '';
                        break;
                }
                html += getCodeData(rowdata.handleType);
                if (abc != '') {
                    html += '：';
                }
                html += abc;
                return html + '</div>';
            }

            var columns = [
                { text: '更新时间', datafield: 'handleDate', width: '33%' },
                { text: '备注', datafield: 'remark', width: '33%', cellsrenderer: remark },
                { text: '更新人', datafield: 'createBy', width: '34%' }
            ];

            //初始化Grid
            $('#view_prove_grid').jqxGrid({
                source: demo,
                width: '100%',
                height: 160,
                pageable: false,
                columns: columns,
                autorowheight: true,
                autoheight: true,
            });
        }

        //查看单据状态--审批流程
        $('#userInformationGrid').on('click', '.viewOcrOrderStatus', function() {
            var index = $('#userInformationGrid').jqxGrid('getSelectedrowindex');
            if (index >= 0) {
                var rowdata = $('#userInformationGrid').jqxGrid('getrowdata', index);
                Core.AjaxRequest({
                    type: 'GET',
                    url: _global_settings.service.url + '/overview/orderSalesLogs/getlist/' + rowdata.uuid,
                    showMsg: false,
                    callback: function(source) {
                        if ($('#view_prove').length == 0) {
                            $.loadModal('page/common/segment/viewProve.html', function(res) {
                                $('body').append(res);
                                initProveModal(source);
                            });
                        } else {
                            initProveModal(source);
                        }
                    }
                });
            }
        });

        //抢单
        $('#userInformationGrid').on('click', '.getSalerOrder', function() {
            var index = $('#userInformationGrid').jqxGrid('getSelectedrowindex');
            if (index >= 0) {
                var rowdata = $('#userInformationGrid').jqxGrid('getrowdata', index);
                if (rowdata.orderType == 'stayOrder') {
                    Core.AjaxRequest({
                        type: 'PUT',
                        url: _global_settings.service.url + '/overview/orderSuccess/' + rowdata.uuid,
                        // async: false,
                        showMsg: false,
                        callback: function(res) {
                            try {
                                $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
                                Core.alert({
                                    message: '抢单成功，正在为您跳转至销售单界面...',
                                    hide: '500',
                                    callback: function() {
                                        $.addTab({
                                            title: '新建销售单',
                                            url: 'page/modules/biz/addSaleOrder.html',
                                            isFrame: false,
                                            pk: { data: rowdata },
                                            reload: true
                                        });
                                    }
                                })
                            } catch (e) {}
                        },
                        failure: function(e) {
                            var err = JSON.parse(e.responseText);
                            Core.alert({
                                message: err.errorMsg
                            });
                        }
                    });
                }
            }
        });

        /**
         * 点击单号viewOcrSalesOrder转至销售单
         * 有以下几种情况，根据orderType判断
         * 最终状态只有客户确认和客户撤销这两种状态
         * 登录(loginLog)
         * 加急(emergency)
         * 一般(general)
         * 特别加急(veryEmergency)
         * 待抢单(orderSuccess)				新建销售单
         * 未抢单(stayOrder)					不可点击	
         * 提交(orderSubmit)					只可以查看,不可以编辑(处于审核中)
         * 审核通过(checkSuccess)				提交至客户，订单状态处于审批通过状态，此时只可以查看订单。任何角色不可进行其他任何操作
         * 审核不通过(checkFailed)				如果是抢单人，点击进入编辑页面。如果是审核人，进入查看页面，如果是admin提示需要进入的页面
         * 再次提交(orderSubmitAgain)			抢单人只可以查看，审核人和admin拥有审核权利
         * 复核通过(checkAgainSuccess)			提交至客户，订单状态处于审批通过状态，此时只可以查看订单。任何角色不可进行其他任何操作
         * 复核不通过(checkAgainFailed)			如果是抢单人，点击进入编辑页面。如果是审核人，进入查看页面，如果是admin提示需要进入的页面
         * 客户确认(complete)					只可以查看,任何角色不可进行其他任何操作
         * 客户拒绝(checkRefused)				如果是抢单人，点击进入编辑页面。如果是审核人，进入查看页面，如果是admin提示需要进入的页面
         * 客户撤销(KHBackout)					1，只有待抢单，审核、复核通过可以撤销。2，凡是客服驳回之后的单子，客户都可以撤销
         * 客服驳回(kfReject)					1只有客户通过和审核、复核通过状态不可驳回，其他状态都可以,2审核人不可驳回。3,驳回之后客服可以查看。
         * 客户重新提交(KHSubmitAgain)			1直接进入原先客服名下（还是有原先客服驳回的那个人进行操作）
         */

        $('#userInformationGrid').on('click', '.viewOcrSalesOrder', function() {
            //            debugger
            var index = $('#userInformationGrid').jqxGrid('getSelectedrowindex');
            if (index >= 0) {
                var rowdata = $('#userInformationGrid').jqxGrid('getrowdata', index);
                var orderType = rowdata.orderType;
                //                console.log(rowdata)
                if (orderType == 'orderSuccess' || orderType == 'KHSubmitAgain') {
                    if (currentRoleName == 'Ocr_auditor') {
                        Core.alert({ message: '此订单处于' + getCodeData(rowdata.orderType) + '状态，不可审核!' });
                    } else {
                        $.addTab({
                            title: '新建销售单',
                            url: 'page/modules/biz/addSaleOrder.html',
                            isFrame: false,
                            pk: { data: rowdata },
                            reload: true
                        });
                    }
                } else {
                    $.addTab({
                        title: '查看销售单',
                        url: 'page/modules/biz/viewSaleOrder.html',
                        isFrame: false,
                        pk: { data: rowdata },
                        reload: true
                    });
                }
            }
        });

        $('#userInformationGrid').on('click', '.checkSalerOrder', function() {
            var index = $('#userInformationGrid').jqxGrid('getSelectedrowindex');
            if (index >= 0) {
                var rowdata = $('#userInformationGrid').jqxGrid('getrowdata', index);
                var orderType = rowdata.orderType;
                var arr = ['stayOrder', 'orderSuccess', 'checkFailed', 'checkAgainSuccess', 'checkAgainFailed', 'checkRefused'];
                if (arr.indexOf(orderType) > -1) {
                    Core.alert({ message: '此订单处于' + getCodeData(rowdata.orderType) + '状态，不可审核!' });
                }
                if (orderType == 'orderSubmit' || orderType == 'checkSuccess' || orderType == 'orderSubmitAgain') {
                    $.addTab({
                        title: '查看销售单',
                        url: 'page/modules/biz/viewSaleOrder.html',
                        isFrame: false,
                        pk: { data: rowdata },
                        reload: true
                    });
                }
            }
        });
        
        //定时刷新数据，刷新带抢单。
        var refreshdata = function () {
        	if(time != null) {
        		clearTimeout(time);
        	}
        	$('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
        	me.initPlaceOrders();
        	setTimeout(arguments.callee ,3 * 60 * 1000);
        }
        var time = null;
        time = setTimeout(refreshdata ,3 * 60 * 1000);
        
//        var timerFn = function() {
//            $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
//            me.initPlaceOrders();
//        }
//        timers = setInterval(timerFn, 3 * 60 * 1000);
        //if(timers!=null) clearInterval(timers);

        //定义一个flag，切换点击状态
        $('#home-fixed').off('click').on('click', function() {
        	var img=$('#homeFixedImg').attr('src');
        	if(img.indexOf('toLeft')>-1){
        		$('#home-left').removeClass('col-md-12').addClass('col-md-10');
        		$('#home-right').removeClass('hide');
        		$('#homeFixedImg').attr('src', 'images/common/toRight.png');
        	}else{
        		$('#home-left').removeClass('col-md-10').addClass('col-md-12');
        		$('#home-right').addClass('hide');
        		$('#homeFixedImg').attr('src', 'images/common/toLeft.png');
        	}
        	$('#userInformationGrid').resize();
        });

        //导出
        $('#ocrOrder-export').off('click').on('click', function() {
            var obj = me.searchObj;
            var condition = getConditionParams(obj,pagesize);
            $.openHref(_global_settings.service.url + '/overview/search/salesorder/export/' + condition);
        });
        
        //缩放
        $('#index_img').off('click').on('click',function(){
        	var title=$(this).attr('title');
        	if(title=='展开'){
        		$('aside').css({width:140});
            	$('article').css({'margin-left':150});
            	$('#zqw_tabs').css({'margin-left':140});
            	$('#level1_menu').find('span').removeClass('hide');
            	$(this).attr('title','收起').css({transform:'rotate(180deg)','margin-left':102});
            	$('#logo').find('img').eq(0).removeClass('hide');
        	}else{
        		$('aside').css({width:50});
            	$('article').css({'margin-left':60});
            	$('#zqw_tabs').css({'margin-left':50});
            	$('#level1_menu').find('span').addClass('hide');
            	$(this).attr('title','展开').css({transform:'rotate(0deg)','margin-left':-88});
            	$('#logo').find('img').eq(0).addClass('hide');
        	}
        	$('#userInformationGrid').resize();
        });

    };

    /**
     * 解绑事件
     */
    this.unbindAll = function() {
        $('#home-fixedIn').off();
    };
};