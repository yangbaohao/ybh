/**
 * 新建销售单界面js
 */

var AddSaleOrderMgt = function() {

    var me = this;

    this.url = _global_settings.service.url + '/order';

    this.customerId = null;

    this.random = null;

    this.otherAmtdesc = ''; //额外费用

    this.otherAmts = []; //额外费用id
    this.orderId = null;
    this.saleRowdata = null;

    this.enterPriceInfo = null;

    var sumAmt = 0; //订单总额
    var toggerColumns = {};

    var address = []; //送货地址
    this.addAddressObj = [];

    unitArr = []; //单位数组
	specArr = []; //规格数组
	colorArr= []; //颜色数组
	prodArr = []; //产品数组
	
    //超收款
    var setOverReceive = function() {
        //已收大于订单
        if ($('#addSO-orderReceive').val() * 1 > $('#addSO-orderMoney').val() * 1) {
            $('#addSO-orderOverReceive').parents('.col-md-3').find('.row').removeClass('hide');
            //$('#addSO-orderOverReceive').val(money($('#addSO-orderReceive').val()-$('#addSO-orderMoney').val()));
        } else {
            $('#addSO-orderOverReceive').parents('.col-md-3').find('.row').addClass('hide');
            //$('#addSO-orderOverReceive').val('0.00');
        }
    }

    //快捷开单初始化
    this.addFastSoFunc = function() {

        $('#addSO-orderMoney').on('keyup', function() {
            timeOut(function() {
                $('#addSO-receiveRecordTbody').find('.receiveMoney').eq(0).trigger('keyup');
                //	    		$('#addSO-addTaxLimit').triggerHandler('change');
            })
        });

        $('#addSO-preferMoney').on('keyup', function() {
            timeOut(function() {
                $('#addSO-orderMoney').val(money($('#addSO-orderPartMoney').val() - $('#addSO-preferMoney').val()));
                $('#addSO-addTaxLimit').trigger('keyup');
            })
        })

        $('#addSO-orderMoney').moneyinput({ 'textalign': 'left' });
        $('#addSO-addOrderNum').moneyinput();

        //快捷开单
        /* if(ComboBoxSources.getRecords('priseInfo')[0].shortcutBilling.toString()=='true'){
         }*/
    }

    /**
     * 初始化三个提交按钮不同状态
     */
//    this.initSaveBtnStatus = function() {
//        $('#viewSO-receiveAndSave').css('display', '');
//        var info = getCurrentInfo();
//        if (info == 'ocr_writer') {}
//        if (info == 'ocr_checker') {
//            $('#saveAddSaleOrderBtn').css('display', '');
//        }
//    }

    //依据小商的商户设置的业务属性来计算未收款
    this.setOrderNoReceive = function(data) {
        //        debugger
        var huowu = $("#addSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3', ['sum']).sum;
        huowu = parseFloat(money(huowu));
        var type = data[0].arrearsType;

        var all = parseFloat($('#addSO-orderMoney').val()); //合同金额
        var prefer = parseFloat($('#addSO-preferMoney').val()); //优惠金额
        var alreadyReceive = parseFloat($('#addSO-orderReceive').val()); //已收金额
        var alreadyDeliver = parseFloat($('#addSO-orderDeliver').val()); //已送金额
        var tax = parseFloat(money($('#addSO-addTaxLimit').val())); //税额

        var noReceive = '';
        //欠款按合同金额统计:未收款（欠款）=合同金额-已收款金额
        if (type === 'contractAmount') {
            noReceive = all - alreadyReceive;
        }
        //欠款按送货金额统计
        if (type === 'deliveryAmount') {
            if (huowu <= alreadyDeliver) {
                //全部送货情况：未收款（欠款）=已送货金额+税额-已收款金额-优惠金额
                noReceive = alreadyDeliver - alreadyReceive - prefer + tax;
            } else {
                //部分送货情况：未收款（欠款）=已送货金额-已收款金额
                noReceive = alreadyDeliver - alreadyReceive;
            }
        }
        //已收大于已送
        if (noReceive < 0) {
            $('#addSO-orderOverReceive').val(money(-noReceive));
            $('#addSO-orderNoReceive').val(money(0));
            $('#addSO-orderOverReceive').parents('.col-md-3').find('.row').removeClass('hide');
        } else {
            $('#addSO-orderOverReceive').val(money(0));
            $('#addSO-orderNoReceive').val(money(noReceive));
            $('#addSO-orderOverReceive').parents('.col-md-3').find('.row').removeClass('show');
        }
    }

    this.initInput = function() {
        me.saleRowdata = $.pk.data;

        //根据商户设置隐藏，此处为调用
        getPriseInfo({
            id: 'addSOAddressTableArs',
            soOwnerId: me.saleRowdata.soOwnerId,
            userName: me.saleRowdata.userName,
            callback: function(res) {
                me.enterPriceInfo = res;
                if (res[0].printSize == 'BT') {
                    $('#addSO-boxflag').parents('.col-md-1').addClass('hide');
                }
                
                //新版grid初始化
                //getAcOwnerInformation(me.saleRowdata.soOwnerId,me.saleRowdata.userName);
                getProductInUsePart(me.saleRowdata.soOwnerId, me.saleRowdata.userName, function(res) {
                	var productSourceName = res; //
                	me.initAddOrderPages(productSourceName);
                });
            }
        });

        me.addFastSoFunc();

//        $('#addSOProductSalePrice').moneyinput({ textalign: 'left' });

        closeModel();
        showAddress('addSO-addCustomerId', '#addSOAddressTableSn', '#addSOAddress');

        $('#addSO-otherpayInput').moneyinput();
        $('#addSO-addTaxLimit').moneyinput( /*{allowDecimal:true}*/ );
        $('#addSO-preferMoney').moneyinput();

        //收款方式
        $('#addSOpayWayBtn').on('click', function() {

        });

        $('#addSO-boxflag').on('change', function() {
            var t = $(this);
            //timeOut(function(){
            if (t.is(':checked')) {
                $('#addSaleOrder_grid').printOfGoodsFlag('show');
            } else {
                $('#addSaleOrder_grid').printOfGoodsFlag('hide');
            }
            //},200)
        })

        //		$('#addSOcancleAddressBtn').on('click',clearAddress);

        $('#addSO-saleTime').datetimeinput({ width: '90%', height: 33, formatString: 'yyyy-MM-dd', showTimeButton: false }); //订单日期
        $('#addSO-recTime').datetimeinput({
            width: '90%',
            height: 33,
            formatString: 'yyyy-MM-dd',
            showTimeButton: false,
        }); //计划收款日期
        $('#addSO-sendTime').datetimeinput({
            width: '90%',
            height: 33,
            formatString: 'yyyy-MM-dd HH:mm',
            showTimeButton: true,
            showCalendarButton: true,
        }); //送货日期
        //		$('#addSO-addOrderNumber').input({width:'90%',height:33,disabled:true});//订单编号

        $('#addSO-addTax').dropDownlist({
            source: { '0': '0%', '3': '3%', '5': '5%', '6': '6%', '11': '11%', '13': '13%', '17': '17%' },
            width: '75%',
            height: 35,
            selectedIndex: 0
        });

        $('#addSO-addTax').on('select', function() {
            if ($(this).val() == 0) {
                $('#addSOtaxLimit').css('display', 'none');
                $('#addSO-addTaxLimit').val('');
                //				$('#addSO-sum').val(money(sumAmt));
            } else {
                $('#addSOtaxLimit').css('display', '');
                $('#addSO-addTaxLimit').val(money(sumAmt * (parseInt($(this).val()) / 100)));
                //				$('#addSO-sum').val(money(sumAmt+$('#addSO-addTaxLimit').val()*1));
            }

            $('#addSO-orderPartMoney').val(money(sumAmt + $('#addSO-addTaxLimit').val() * 1));
            $('#addSO-orderMoney').val(money($('#addSO-orderPartMoney').val() - $('#addSO-preferMoney').val()));

            me.setOrderNoReceive(me.enterPriceInfo);
            setOverReceive();
        });

        $('#addSO-addTaxLimit').on('change keyup', function() {
            var val = $(this).val() == '' ? 0 : $(this).val();

            //			$('#addSO-sum').val(money(val*1+sumAmt*1));
            $('#addSO-orderPartMoney').val(money(val * 1 + sumAmt * 1));
            $('#addSO-orderMoney').val(money($('#addSO-orderPartMoney').val() - $('#addSO-preferMoney').val()));

            me.setOrderNoReceive(me.enterPriceInfo);
            setOverReceive();
        });

//        me.initAddOrderPages();
        me.initValidator();

        $.addTabCloseEvent();
    };
    
    /**
     * 设置登录角色权限问题
     */
//    this.initPermissionStatus = function(data) {
//        $('#viewSO-receiveAndSave').css('display', 'none');
//        var info = getCurrentInfo();
//        if (info == 'ocr_writer') {
//            $('#viewSO-checkBtn').css('display', 'none');
//        }
//        if (info == 'ocr_checker') {
//            if (data.orderType == 'checkFailed') {
//                $('#viewSO-checkBtn').css('display', 'none');
//            }
//        }
//        if (data.orderType == 'checkSuccess') {
//            $('#viewSO-checkBtn').css('display', 'none');
//        }
//        if (data.orderType == 'orderSubmitAgain') {
//            $('#viewSO-checkBtn').text('复核')
//        }
//    }

    //初始化页面
    this.initAddOrderPages = function(productSourceName) {
        Core.AjaxRequest({
            type: 'GET',
            showMsg: false,
            // async: false,
            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/salesorderid/' + me.saleRowdata.id + '/' + me.saleRowdata.soOwnerId + '/' + me.saleRowdata.userName),
            callback: function(res, textStatus) {
                //            	console.log(res);
            	
                //外箱尺寸
                var productMeasFlag = _global_settings.acOwner.productMeasFlag.toString() == 'true' ? true : false;
                //是否显示体积或长宽高
                me.cartonType = _global_settings.acOwner.cartonType;

                //是否装箱
                var productBoxFlag = _global_settings.acOwner.productBoxFlag.toString() == 'true' ? true : false;

//                if (!productBoxFlag) {
//                    $('#addSO-productMeasFlag').attr('disabled', 'disabled');
//                }

                $('#addSO-box').on('change', function() {
                    var t = $(this);
                    if (t.is(':checked')) {
                        $('#addSaleOrder_grid').boxSetting('show');
//                        $('#addSO-productMeasFlag').removeAttr('disabled').prop('checked', productMeasFlag).trigger('change');
                    } else {
                        $('#addSaleOrder_grid').boxSetting('hide');
                        //$('#addSO-productMeasFlag')[0].checked=false;
//                        $('#addSO-productMeasFlag').attr('disabled', 'disabled').prop('checked', false).trigger('change');
                    }
                }).prop('checked', productBoxFlag) //.trigger('change');

                $('#addSO-productMeasFlag').on('change', function() {
                    var t = $(this);
                    if (t.is(':checked')) {
                        $('#addSaleOrder_grid').productMeasFlag('show',me.cartonType);
                    } else {
                        $('#addSaleOrder_grid').productMeasFlag('hide',me.cartonType);
                    }
                }).prop('checked', productMeasFlag) //.trigger('change');

                //细码
                var yardsFlag = _global_settings.acOwner.yardsFlag;
                if (yardsFlag) {
                    toggerColumns.yards = false;
                    $('#addSO-box').parents('.priseInfoFlag').hide();
                }
                
                //外箱尺寸
//                if(!productMeasFlag){
//                	$('#addSO-productMeasFlag').parents('.priseInfoFlag').hide();
//                }

                //单位
                var productunitFlag = _global_settings.acOwner.productunitFlag;
                if (productunitFlag) {
                    toggerColumns.unitRate = false;
//                    $('.priseInfoFlag').hide();
                }

                if (!productBoxFlag) {
                    toggerColumns.totalCartons = true;
                    toggerColumns.eachCartons = true;
                    $('#addSO-box').parents('.priseInfoFlag').hide();
                } 
//                debugger
                if (!productMeasFlag) {
                	$('#addSO-productMeasFlag').parents('.priseInfoFlag').hide();
                    toggerColumns.extent = true;
                    toggerColumns.breadth = true;
                    toggerColumns.altitude = true;
                    toggerColumns.volume = true;
                } else {
                    if (me.cartonType === 'size' || me.cartonType === null) {
                        toggerColumns.volume = true;
                        toggerColumns.extent = false;
                        toggerColumns.breadth = false;
                        toggerColumns.altitude = false;
                    } else {
                    	toggerColumns.volume = false;
                        toggerColumns.extent = true;
                        toggerColumns.breadth = true;
                        toggerColumns.altitude = true;
                    }
                }

                //打印客户品名
                if (!$('#addSO-boxflag').is(':checked')) {
                    toggerColumns.printOfGoods = true;
                }
                
                $('#addSaleOrder_grid').easyGrid({
                    columnSumEvent: function() {
                        var sum = $("#addSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3', ['sum']);
                        sumAmt = sum.sum;

                        var ysprice = $("#addSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'ysprice', ['sum']).sum;
                        var dsprice = $("#addSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'dsprice', ['sum']).sum;
                        $('#addSO-orderDeliver').val(money(ysprice + dsprice));
//                        $('#addSO-orderDeliver').val(money(sumAmt));

                        var val = $('#addSO-addTax').val(); //税率

                        var value = money(sumAmt * val / 100);

                        if (val == 0) {
                            //							$('#addSO-sum').val(money(sumAmt));
                            $('#addSO-orderPartMoney').val(money(sumAmt));
                            $('#addSO-orderMoney').val(money($('#addSO-orderPartMoney').val() - $('#addSO-preferMoney').val()));
                            me.setOrderNoReceive(me.enterPriceInfo);
                        } else {
                            $('#addSO-addTaxLimit').val(value);
                            //							$('#addSO-sum').val(money(value*1+sumAmt*1));
                            $('#addSO-orderPartMoney').val(money(value * 1 + sumAmt * 1));
                            $('#addSO-orderMoney').val(money($('#addSO-orderPartMoney').val() - $('#addSO-preferMoney').val()));
                            me.setOrderNoReceive(me.enterPriceInfo);
                        }

                        setOverReceive();
                    },
                    productSourceName: productSourceName,
                    ownerSettings: {
                        soOwnerId: me.saleRowdata.soOwnerId,
                        userName: me.saleRowdata.userName,
                        elementId: null
                    },
                    toggerColumns: toggerColumns,
                    gridSettings: {
                        editable: true,
                        delBtn: true
                    }
                });
                
                //初始化页面
                me.order = res;
                me.getReceiveRecord(res.salesOrderDeal.id);

                //初始化图片附件列表
                $('#addSO-attachment').fileuploader({
                    filelist: res.fileInfoIds.toString(),
                    orderId: me.saleRowdata.id,
                    ownerId: me.saleRowdata.soOwnerId,
                    ownerName: me.saleRowdata.userName,
                    readonly: true
                });

//                $('#addFastSo').attr('disabled', true);
//                $('#addSO-Form').find('.editBtna').attr('disabled', true);

                $('#addSO-addOrderNumber').val(res.orderNumber);
//              me.customerId = res.clientInfo.id;
                me.initCustomer(res.clientInfo);

                $('#addSO-saleTime').val(res.orderDate) //销售日期
                $('#addSO-recTime').val(res.planDeliveryDate); //收款日期
                $('#addSO-sendTime').val(res.deliveryDate); //送货日期
                address = res.addressList;
                //                        $('#addSO-addReceiverAddress').val(res.address); //地址
                $('#addSO-addTax').val(res.vat); //税率
                $('#addSO-preferMoney').val(money(res.cheapAmt)); //优惠金额
                $('#addSO-orderMoney').val(money(res.otherAmt)); //订单金额
                //				$('#addSO-orderReceive').val(getCodeData(res));				//已收款
                //				$('#addSO-orderNoReceive').val();							//未收款
                $('#addSO-remarkPrint').val(res.remarkPrint); //备注
            }
        });
    }

    /**
     * 查找收款记录
     */
    this.getReceiveRecord = function(id) {
        Core.AjaxRequest({
            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/salesorderbill/' + id + '/' + me.saleRowdata.soOwnerId + '/' + me.saleRowdata.userName),
            type: 'GET',
            showMsg: false,
            //			async:false,
            callback: function(res) {
                me.initRecRecords(res);
            },
            failure: function(e) {}
        });
    }

    /**
     * 获取客户信息，并初始化客户相关控件
     */
    this.initCustomer = function(res) {
    	var data = res;
        $('#addSO-addCustomerId').comboBox({
            source: [{ name: data.userInfo.name, clientInfoid: data.id }],
            displayMember: 'name',
            valueMember: 'clientInfoid',
            width: '90.888%',
            height: 33
        }).val(data.id);
        $('#addSO-addCustomerId').jqxComboBox({ disabled: true });

        $.each(data.userInfo.address, function(j, va) {
            if (va.shortName == '') {
                va.addressLabel = va.province + va.city + va.district + va.street;
            } else {
                va.addressLabel = '(' + va.shortName + ')' + va.province + va.city + va.district + va.street;
            }
        });

        me.initReceiverAddress(data.userInfo.address);
    }

    /**
     * 初始化收货地址下拉框
     */
    this.initReceiverAddress = function(addressArray) {
        //        address = addressArray;
        $('#addSO-addReceiverAddress').comboBox({
            source: addressArray,
            displayMember: 'addressLabel',
            valueMember: 'addressLabel',
            width: '91.45555%',
            height: 33,
            selectedIndex: 0,
            checkboxes: true //多选
        });

        setTimeout(function() {
            for (var i = 0; i < address.length; i++)
                $('#addSO-addReceiverAddress').jqxComboBox('checkItem', address[i].description);
        }, 500);
        //        $('#addSO-addReceiverAddress').jqxComboBox('checkItem',address[0].addressLabel);
    };

    /**
     * 收付款记录
     */
    this.initRecRecords = function(data) {
        var objx = {
            setOrderNoReceive: me.setOrderNoReceive,
            enterPriceInfo: me.enterPriceInfo,
            data: data,
            orderMoney: $('#addSO-orderMoney'),
            orderReceive: $('#addSO-orderReceive'),
            orderNoReceive: $('#addSO-orderNoReceive'),
            orderOverReceive: $('#addSO-orderOverReceive'),
            grid:'addSaleOrder_grid'
        }

        $('#addSO-receiveRecordTable').easytableExamplex(objx);
    }

    /**
     * 初始化所有表单的校验
     */
    this.initValidator = function() {
        $('#addSO-Form').jqxValidator({
            animationDuration: 1,
            hintType: 'label',
            rules: [{
                    input: '#addSO-recTime',
                    message: '不能小于销售日期',
                    action: 'keyup, change',
                    rule: function(input, commit) {
                        if (input.val() == '') return true;
                        if (input.val() < $('#addSO-saleTime').val()) return false;
                        return true;
                    }
                },
                {
                    input: '#addSO-sendTime',
                    message: '不能小于销售日期',
                    action: 'keyup, change',
                    rule: function(input, commit) {
                        if (input.val() == '') return true;
                        if (input.val() < $('#addSO-saleTime').val()) return false;
                        return true;
                    }
                }
            ]
        });
    }

    //验证
    var initValidatorAdd = function() {
        $('#addSOAddress').jqxValidator({
            animationDuration: 1,
            hintType: 'label',
            rules: [{
                    input: '#addSOAddressTableArs',
                    message: "不能为空",
                    action: 'keyup,change',
                    rule: function(input, commit) {
                        //						
                        var t = true
                        $.each(input.children(), function(i) {
                                if ($(this).val() === '' && i < 2) t = false;
                                return;
                            })
                            //						if(input.children().eq(0).val()==='') t=false;
                        if (!t) {
                            return false;
                        } else {
                            return true;
                        }

                    }
                },
                { input: '#addSOAddressTableSt', message: "不能为空", action: 'keyup, blur', rule: 'required' },
            ]
        });
    }

    initValidatorAdd();
};


var AddSaleOrderBindModle = function(addSOMgt) {
    var me = this;

    //获取收款记录明细
    var getReceiveDetail = function() {
        var arr = [],
            tr = $('#addSO-receiveRecordTbody').children();
        $.each(tr, function(i) {
            var val = tr.eq(i).find('.receiveMoney').val();
            if (val != 0 && val != '') {
                var obj = {};
                obj.createDate = tr.eq(i).find('.time').val();
                obj.amount = val;
                obj.payWay = tr.eq(i).find('.receiveWay').val();
                obj.remark = tr.eq(i).find('.remark').val();
                arr.push(obj);
            }
        });

        return arr;
    }

    //保存收款记录
//    var submitReceive = function(id) {
//        var obj = {};
//        obj.salesOrderDeal = { id: id };
//        obj.ownerId = addSOMgt.saleRowdata.soOwnerId;
//
//        var receiveDetail = getReceiveDetail(); //收款记录
//        var name = $('#addSO-addCustomerId').find('input').val();
//        $.closeTab();
//        if (receiveDetail.length == 0) {
//            return false;
//        }
//
//        $.each(receiveDetail, function(i) {
//            obj.customerName = name;
//            obj.createDate = receiveDetail[i].createDate;
//            obj.amount = receiveDetail[i].amount;
//            obj.payWay = receiveDetail[i].payWay;
//            obj.remark = receiveDetail[i].remark;
//
//            console.log('++++++++++' + obj)
//        });
//    }

    //保存PO
    this.submitOrder = function(po, bool) {
        console.log(po);
        var boolean = true;
        $.each(po.salesOrderDetails, function(i) {
            if (po.salesOrderDetails[i].qty == 0) {
                boolean = false;
            }
        });

        if (bool == true) {} else {
            if ($('#addSO-Form').jqxValidator('validate')) {
                Core.AjaxRequest({
                    url: _global_settings.service.url + '/overview/saveOrder',
                    type: 'POST',
//                  async: false,
                    showWaiting: true,
                    params: po,
                    successMsg: '操作成功',
                    callback: function(res) {
                        $.closeTab();
                        $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
//                        ComboBoxSources.load('waitOrder');
                    },
                    failure: function(e) {}
                });
            }
        }
    }

    //保存消息
//    var saveMes = function(salesId) {
//        Core.AjaxRequest({
//            url: ctx + '/CXF/rs/informationLogs/save/' + salesId + '/sales',
//            type: 'GET',
//            showMsg: false,
//            // async: false,
//            callback: function() {
//
//            }
//        })
//    }

//    this.refreshInputGrid = function() {
//        //刷新可能的列表
//        try {
//            refreshFBar('Y');
//            window.refreshCustomerBizMgtGrid('customerBizMgttable');
//        } catch (e) { console.log(e); }
//
//        try {
//            $('#customerPurchaseMgttable1' + addSOMgt.random).jqxGrid('updatebounddata', 'cells');
//        } catch (e) {
//            console.log(e);
//        }
//        try {
//            $('#vendorPurchaseMgttable1' + addSOMgt.random).jqxGrid('updatebounddata', 'cells');
//        } catch (e) {
//            console.log(e);
//        }
//    }

    //新版grid
    var getSalesOrder = function(checked) {

        var table = $('#addSaleOrder_grid').getDataWash(checked);
        return table;
    }

    this.initAddParam = function(bool) {
        //        debugger;
        var obj = {};
        obj.clientName = $('#addSO-addCustomerId').find('input').val(); //客户信息
        obj.clientId = $('#addSO-addCustomerId').val(); //客户id

        //        if (typeof $('#addSO-addReceiverAddress').val() == 'number') { //收货地址
        //            addSOMgt.initCustomer({
        //                customerId: addSOMgt.customerId,
        //                soOwnerId: addSOMgt.saleRowdata.soOwnerId,
        //                userName: addSOMgt.saleRowdata.userName,
        //                flag: false,
        //                callbacks: function(res) {
        //                    if (res.length > 0) {
        //                        $.each(res, function(i, v) {
        //                            if ($('#addSO-addReceiverAddress').val() == v.id) {
        //                                console.log(res[i]);
        //                                res[i].addAddressId = res[i].id;
        //                                delete res[i].id;
        //                                me.addAddressObj = res[i];
        //                                obj.ocrSaleOrderAddress = [res[i]];
        //                            }
        //                        });
        //                    } else {
        //                        obj.ocrSaleOrderAddress = [];
        //                    }
        //                }
        //            });
        //        } else {
        //            var arrs = [];
        //            if (addSOMgt.addAddressObj != undefined) {
        //                arrs.push(addSOMgt.addAddressObj);
        //            };
        //            if (arrs.length > 0) {
        //                obj.ocrSaleOrderAddress = arrs; //收货地址id如果是没做修改，传id。做了修改。传val
        //            } else {
        //                obj.ocrSaleOrderAddress = [];
        //            }
        //        }

        var addressGetCheckedItems = $('#addSO-addReceiverAddress').jqxComboBox('getCheckedItems');
        var deliveryAddress = '';
        var ocrAddress = addSOMgt.addAddressObj;
        obj.ocrSaleOrderAddress = [];

        $.each(addressGetCheckedItems, function(i) {
            deliveryAddress += addressGetCheckedItems[i].value + ','
        });
        deliveryAddress = deliveryAddress.substring(0, deliveryAddress.length - 1);

        if (ocrAddress.length != 0) {
            //新增地址，且被选中
            //        	obj.ocrSaleOrderAddress=[];
            var arrSource = deliveryAddress.split(',')
            for (var k = 0; k < ocrAddress.length; k++) {
                for (var m = 0; m < arrSource.length; m++) {
                    if (ocrAddress[k].addressLabel == arrSource[m]) {
                        obj.ocrSaleOrderAddress.push(ocrAddress[k]);
                    }
                }
            }
        }
        obj.deliveryAddress = deliveryAddress;

        //        console.log(deliveryAddress);
        //        console.log(obj.ocrSaleOrderAddress);

        obj.orderDate = $('#addSO-saleTime').val(); //销售日期
        obj.deliveryDate = $('#addSO-sendTime').val() == '' ? '' : $('#addSO-sendTime').val() + ':00'; //送货日期
        obj.planDeliveryDate = $('#addSO-recTime').val(); //计划送货日期
        obj.orderNumber = $('#addSO-addOrderNumber').val(); //销售单单号

        obj.otherAmtdesc = addSOMgt.otherAmtdesc; //额外费用描述
        obj.otherAmt = $('#addSO-otherpayInput').val(); //额外费用
        if (!$('#addSO-otherpay')[0].checked) {
            obj.otherAmtdesc = ''; //额外费用
            obj.otherAmt = '';
        }

        obj.remarkPrint = $('#addSO-remarkPrint').val(); //打印备注时显示

        obj.productMeasFlag = $('#addSO-productMeasFlag')[0].checked; //是否开启外箱尺寸
        obj.printOfGoodsFlag = $('#addSO-boxflag')[0].checked; //是否开启客户货号
        obj.goodsBinning = 'N'; //是否开启货品装箱
        if ($('#addSO-box')[0].checked) {
            obj.goodsBinning = 'Y';
        }

        obj.simpleOrderId = addSOMgt.saleRowdata.id //销售单id

        obj.vat = $('#addSO-addTax').val(); //税率
        obj.vatAmt = $('#addSO-addTaxLimit').val(); //税额
        obj.totalAmt = $('#addSO-orderMoney').val(); //订单金额
        obj.cheapAmt = $('#addSO-preferMoney').val(); //优惠金额
        obj.uuid = addSOMgt.saleRowdata.uuid;

        obj.discountFlag = _global_settings.acOwner.ownerAttr.discountFlag; //折扣
        obj.yardsFlag = _global_settings.acOwner.yardsFlag;
        obj.productunitFlag = _global_settings.acOwner.productunitFlag;
        obj.customFormulaFlag = _global_settings.acOwner.ownerAttr.customFormulaFlag;
        obj.productKgFlag = _global_settings.acOwner.productKgFlag; //重量
        if(obj.productKgFlag){
        	obj.weightUnit = _global_settings.acOwner.prodUnit[0].descr;  //重量单位
        	obj.weightWay = _global_settings.acOwner.prodUnit[0].weightWay;  //计重方式
        }
//        debugger
        if($('#addSO-productMeasFlag')[0].checked){
        	obj.cartonType = addSOMgt.cartonType;
        }

        var receiveDetail = getReceiveDetail(); //收款记录
        obj.ocrSaleOrderBill = [];

        $.each(receiveDetail, function(i) {

            var objs = {}
            objs.createDate = receiveDetail[i].createDate;
            objs.amount = receiveDetail[i].amount;
            objs.payWay = receiveDetail[i].payWay;
            objs.remark = receiveDetail[i].remark;

            obj.ocrSaleOrderBill.push(objs);
//            console.log('++++++++++' + obj);
        });

        //获取销售单详情
//        if ($('#addFastSo').is(':checked')) {
//            //快捷开单部分
//            obj.orderType = 'enclosure';
//            var salesOrderDetailsid = _global_settings.owner.ppid;
//            if (salesOrderDetailsid == 'NoProduct') {
//
//            }
//
//            obj.orderStatus = $('#addSO-send-span').data('id');
//            if (bool) {
//                obj.orderStatus = 'undelivered';
//            }
//            if (obj.orderStatus == 'partialdelivered') {
//                obj.salesOrderDeal = {};
//                obj.salesOrderDeal.paidAmt = $('#addSO-addOrderNum').val();
//                if (!bool) {
//                    obj.deliverAmt = money(obj.totalAmt - obj.salesOrderDeal.paidAmt);
//                }
//            } else if (obj.orderStatus == 'alldelivered') {
//                obj.deliverAmt = 0;
//            } else {
//                obj.deliverAmt = obj.totalAmt;
//            }
//
//        } else {
            //普通销售单
            obj.ocrSaleOrderDetail = getSalesOrder(!bool);
//        }

        //文件列表
        obj.fileInfoIds = [];
        $('#addSO-attachment').find('.item').each(function(i, v) {
            var fid = $(v).attr('data-id');
            if (fid !== undefined) {
                obj.fileInfoIds.push(fid);
            }
        });
//        if ($('#addFastSo').is(':checked')) {
//            var idlist = '';
//            var node = $('#imgDetailRow').find('.close-lab');
//            $.each(node, function(i, v) {
//                var t = $(v);
//                var pid = t.data('id');
//                if (pid != null && pid != '') {
//                    obj.fileInfoIds.push(pid);
//                }
//            })
//        }

        obj.fileInfoIds = obj.fileInfoIds.toString();
        console.log(obj);
        return obj;
    };

    this.bind = function() {

        /**
         * 客服驳回
         * 只有客户通过和审核、复核通过不可驳回，其他状态都可以
         * 驳回字段目前只限定后台给定特定字段。
         */

        $('#addOcrOrderReject').off('click').on('click', function() {
            //debugger
        	setPara();
            rejectOcrOrder(addSOMgt.saleRowdata.uuid);
        });

        $('#saveAddSaleOrderBtn').off('click').on({
            'click': function() {
            	setPara();
//            	return false;
                if ($('#addSO-Form').jqxValidator('validate')) {
                    //保存销售单
                    getMsgForNullSpecId($('#addSaleOrder_grid').getDataWash(), me.submitOrder, me.initAddParam());
                }
            }
        });

        $('#addSOAddressBtn').on('click', function() {
//            if (addSOMgt.customerId == null) {
//                Core.alert({ message: '请先选择客户！' });
//                return false;
//            }
            if ($('#addSOAddress').jqxValidator('validate')) {
                var addressObj = {
                    shortName: $('#addSOAddressTableSn').val(),
                    province: $('#addSOAddressTableArs').find('select').eq(0).val(),
                    city: $('#addSOAddressTableArs').find('select').eq(1).val(),
                    district: $('#addSOAddressTableArs').find('select').eq(2).val(),
                    street: $('#addSOAddressTableSt').val(),
                    zipCode: $('#addSOAddressTableZc').val(),
                    remark: $('#addSOAddressTableRm').val()
                }

                var myshortName = addressObj.shortName == '' ? '' : '(' + addressObj.shortName + ')';

                addressObj.addressLabel = myshortName + addressObj.province + addressObj.city + addressObj.district + addressObj.street;

                addSOMgt.addAddressObj.push(addressObj);

                $('#addSOAddress').modal('hide');
                $('#addSO-addReceiverAddress').jqxComboBox('addItem', { label: addressObj.addressLabel });
                //$('#addSO-addReceiverAddress').val(key)
                $("#addSO-addReceiverAddress").jqxComboBox('checkItem', addressObj.addressLabel);
                //                console.log(addSOMgt.addAddressObj);
            }
        });

//        $('#addSO-addSaveOCr').off('click').on('click', function() {
//                getMsgForNullSpecId($('#addSaleOrder_grid').getDataWash(), me.submitOrder, me.initAddParam());
//                //			if(addSOMgt.orderId==undefined){
//                //				return false;
//                //			}
//                timeOut(function() {
//                    var str = 'general';
//                    if ($('#addSO-emergency').is(':checked')) {
//                        str = 'emergency';
//                    }
//                    Core.AjaxRequest({
//                        url: addSOMgt.url + '/ocr/' + me.orderId + '/' + str,
//                        type: "GET",
//                        showMsg: false,
//                        callback: function(res) {
//
//                        },
//                        failure: function(res) {
//                            //Core.alert({message:res});
//                        }
//                    });
//                }, 1000)
//            })
//        $('#cancelAddSaleOrderBtn').on({
//            'click': function() {
//                Core.confirm({
//                    message: '确定要取消？',
//                    confirmCallback: function() {
//                        $.closeTab();
//                        me.refreshInputGrid();
//                    }
//                });
//            }
//        });

        var settings = {
        	inputId:'#addSO-otherpay',	
        	labelId:'#addOtherPay',
            showId: '#addSO-otherpayInput',
            otherDesc: addSOMgt.otherAmtdesc,
            mgt: addSOMgt,
            ownerId: addSOMgt.saleRowdata.soOwnerId,
            name: addSOMgt.saleRowdata.userName
        }
        otherPay(settings);
    }

    this.unbindAll = function() {

    }
}