/**
 * 编辑销售单界面js
 */

var EditSaleOrderMgt = function() {
    var me = this;

    this.url = _global_settings.service.url + '/overview';

    this.random = null;

    this.orderId = null;

    this.data = null;

    this.recRed = null; //收款记录

    this.customerId = null;

    this.selectId = null;

    this.stop = false; //是否拒收

    this.otherAmtdesc = ''; //额外费用

    this.otherAmts = []; //额外费用id

    this.saleRowdata = null;

    this.addAddressObj = [];

    this.enterPriceInfo = null;

    var sumAmt = 0; //总额

    var address = []; //地址
    this.addressNew = [];
    
    unitArr = []; //单位数组
	specArr = []; //规格数组
	colorArr= []; //颜色数组
	prodArr = []; //产品数组
	
    //超收款
    var setOverReceive = function() {
        //已收大于订单
        if ($('#editSO-orderReceive').val() * 1 > $('#editSO-orderMoney').val() * 1) {
            $('#editSO-orderOverReceive').parents('.col-md-3').find('.row').removeClass('hide');
            //$('#editSO-orderOverReceive').val(money($('#editSO-orderReceive').val()-$('#editSO-orderMoney').val()));
        } else {
            $('#editSO-orderOverReceive').parents('.col-md-3').find('.row').addClass('hide');
            //$('#editSO-orderOverReceive').val('0.00');
        }
    }

    var initValidatorAdd = function() {
        $('#editSOAddress').jqxValidator({
            animationDuration: 1,
            hintType: 'label',
            rules: [{
                    input: '#editSOAddressTableArs',
                    message: "不能为空",
                    action: 'keyup, change',
                    rule: function(input, commit) {
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
                { input: '#editSOAddressTableSt', message: "不能为空", action: 'keyup, blur', rule: 'required' },
            ]
        });
    }

    this.initWindows = function() {
        $('#ocrSubmitAgainWindow').jqxWindow({
            theme: currentTheme,
            isModal: true,
            autoOpen: false,
            maxHeight: 1000,
            height: 450,
            width: 600,
            minWidth: 500,
            cancelButton: $('#cancelSubmitAgainSubmit'),
            initContent: function() {}
        }).on('close', function() {
            $('#ocrSubmitAgainRemark').val('');
        });

        $('#ocrSubmitAgainWindow, #editSOAddress').center();
        $(window).on('resize', function() {
            $('#ocrSubmitAgainWindow, #editSOAddress').center({ transition: 0 });
        });
    }

    this.editFastSoFunc = function() {

        $('#editSO-orderMoney').on('keyup', function() {
            timeOut(function() {
                $('#editSO-receiveRecordTbody').find('.receiveMoney').eq(0).trigger('keyup');
                //	    		$('#editSO-addTaxLimit').triggerHandler('change');
            })
        })

        $('#editSO-orderMoney').moneyinput({ 'textalign': 'left' });
        $('#editSO-addOrderNum').moneyinput();
    }

    this.initInput = function() {

        me.saleRowdata = $.pk.data;

        me.initWindows();
        //		$('#editSO-editReceiverAddress').jqxComboBox({
        //			placeHolder : '请选择送货地址',
        //			width : '91.45556%',
        //			height : 33,
        //			theme : currentTheme
        //		});

        $('#editSO-orderMoney').on('keyup', function() {
            //计算
            $('#editSO-send-span').find('.succImg:visible').parent('.addSuccImg').trigger('click');
            timeOut(function() {
                $('#editSO-receiveRecordTbody').find('.receiveMoney').eq(0).trigger('keyup');
                //	    		$('#editSO-addTaxLimit').triggerHandler('change');
            })
        })

        $('#editSO-preferMoney').on('keyup', function() {
            var huowu = $("#editSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3', ['sum']).sum;
            $('#editSO-orderMoney').val(money(huowu - $('#editSO-preferMoney').val()));
            var m = huowu - $('#editSO-preferMoney').val() >= 0 ? huowu - $('#editSO-preferMoney').val() : 0;
            $('#editSO-orderNoReceive').val(money(m));
        })


        //		me.editFastSoFunc();
        $('#editSOProductSalePrice').moneyinput({ textalign: 'left' });
        //根据设置隐藏
        getPriseInfo({
            id: 'editSOAddressTableArs',
            soOwnerId: me.saleRowdata.soOwnerId,
            userName: me.saleRowdata.userName,
            callback: function(res) {
                me.enterPriceInfo = res;
                if (res[0].printSize == 'BT') {
                    $('#editSO-boxflag').parents('.col-md-1').addClass('hide');
                }

                me.getSaleOrderDetail(me.saleRowdata.uuid);
            }
        });
        closeModel();

        showAddress('editSO-editCustomerId', '#editSOAddressTableSn', '#editSOAddress');

        $('#editSO-otherpayInput').moneyinput();
        $('#editSO-editTaxLimit').moneyinput();
        $('#editSO-preferMoney').moneyinput();

        if ($.pk != undefined) {
            me.orderId = $.pk.data.id;
            me.random = $.pk.data.random;

            me.englishFlag = $.pk.data.englishFlag;
            me.printPictureFlag = $.pk.data.printPictureFlag;
            me.printPriceFlag = $.pk.data.printPriceFlag;
            me.printProductFeeFlag = $.pk.data.printProductFeeFlag;
            me.printNameNoFlag = $.pk.data.printNameNoFlag;
            me.printWeightFlag = $.pk.data.printWeightFlag;
            me.printItemFlag = $.pk.data.printItemFlag;
        }

        // me.getSaleOrderDetail(me.saleRowdata.uuid);

        me.initValidator();
        initValidatorAdd();

        me.initPermissionStatus(me.saleRowdata);

        me.initOcrOrderStatus(me.saleRowdata);
    }


    //依据小商的商户设置的业务属性来计算未收款
    this.setOrderNoReceive = function(data) {
        var huowu = $("#editSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3', ['sum']).sum;
        huowu = parseFloat(money(huowu));
        var type = data[0].arrearsType;

        //		var all=parseFloat($('#editSO-orderPartMoney').val());							//合同金额
        var all = parseFloat($('#editSO-orderMoney').val()); //合同金额
        var prefer = parseFloat($('#editSO-preferMoney').val()); //优惠金额
        var alreadyReceive = parseFloat($('#editSO-orderReceive').val()); //已收金额
        var alreadyDeliver = parseFloat($('#editSO-orderAlreadyDeliver').val()); //已送金额
        var tax = parseFloat(money($('#editSO-editTaxLimit').val())); //税额

        var noReceive = '';
        //欠款按合同金额统计:未收款（欠款）=合同金额-已收款金额
        if (type === 'contractAmount') {
            noReceive = all - alreadyReceive;
        }
        //欠款按送货金额统计
        if (type === 'deliveryAmount') {
            if (huowu <= alreadyDeliver) { //全部送货情况：未收款（欠款）=已送货金额+税额-已收款金额-优惠金额
                noReceive = alreadyDeliver + tax - alreadyReceive - prefer;
            } else { //部分送货情况：未收款（欠款）=已送货金额-已收款金额
                noReceive = alreadyDeliver - alreadyReceive;
            }
        }

        //已收大于已送
        if (noReceive < 0) {
            $('#editSO-orderOverReceive').val(money(-noReceive));
            $('#editSO-orderNoReceive').val(money(0));
            $('#editSO-orderOverReceive').parents('.col-md-3').find('.row').removeClass('hide');
        } else {
            $('#editSO-orderOverReceive').val(money(0));
            $('#editSO-orderNoReceive').val(money(noReceive));
            $('#editSO-orderOverReceive').parents('.col-md-3').find('.row').removeClass('show');
        }
    }

    /**
     * 设置登录角色权限问题
     */
    this.initPermissionStatus = function(data) {
        var info = getCurrentInfo();
        if (info == 'ocr_writer') {
            $('#saveEditBtn').text('提交');
        }
        var arr = ['checkFailed', 'orderSubmitAgain', 'checkAgainFailed', 'checkRefused']
        if (arr.indexOf(data.orderType) > -1) {
            $('#saveEditBtn').text('再次提交');
        }
    }

    //查找订单详情
    this.getSaleOrderDetail = function(id) {
        Core.AjaxRequest({
            url: me.url + '/getOrder/' + id,
            type: 'GET',
            showMsg: false,
            //			async:false,
            callback: function(data) {
//                var ocrSaleOrderDetail = data.ocrSaleOrderDetail;
//                for (var i = 0; i < ocrSaleOrderDetail.length; i++) {
//                    ocrSaleOrderDetail[i].yards = ocrSaleOrderDetail[i].qty.toString();
//                }
//                data.ocrSaleOrderDetail = ocrSaleOrderDetail;

                me.otherAmtdesc = data.otherAmtdesc;
                me.otherAmts = data.otherAmts;
                me.data = data;

                me.initCustomer(data.clientId, data.clientName);
                $('#editSO-editCustomerId').comboBox({
                    source: [{ name: data.clientName, id: data.clientId }],
                    displayMember: 'name',
                    valueMember: 'id',
                    width: '91.45556%',
                    height: 33,
                    checkboxes: true
                }).val(id);

                me.initEdit(data);

                var isenclosure = data.orderType == 'enclosure' ? true : false

//                $('#editFastSo').attr('disabled', 'disabled');

                $('#editSO-attachment').fileuploader({
                    filelist: data.fileInfoIds.toString(),
                    orderId: me.saleRowdata.id,
                    ownerId: me.saleRowdata.soOwnerId,
                    ownerName: me.saleRowdata.userName,
                    readonly: true,
                    orderType: me.saleRowdata.orderType,
                    showImg:false
                });
            },
            failure: function(res) {
                Core.alert({
                    message: res,
                    callback: function() {
                        $.closeTab();
                    }
                })
            }
        });
    }

    //拒收计算
    var stopSum = function() {
        if ($('#editSO-editTax').val() == 0) {
            $('#editSOtaxLimit').css('display', 'none');
            $('#editSO-editTaxLimit').val('');
            //			$('#editSO-sum').val(money(sumAmt));
        } else {
            $('#editSOtaxLimit').css('display', '');
            $('#editSO-editTaxLimit').val(money(sumAmt * (parseInt($('#editSO-editTax').val()) / 100)));
            //			$('#editSO-sum').val(money(sumAmt*1+$('#editSO-editTaxLimit').val()*1)); //总额
        }

        $('#editSO-orderPartMoney').val(money(sumAmt * 1 + $('#editSO-editTaxLimit').val() * 1));
        $('#editSO-orderMoney').val(money($('#editSO-orderPartMoney').val() - $('#editSO-preferMoney').val()));
    }

    //初始化页面组件
    this.initEdit = function(order) {
        var toggerColumns = {};
        //货品装箱
        if (order.goodsBinning != 'N') {
            $('#editSO-box')[0].checked = true;
        } else {
            toggerColumns.totalCartons = true;
            toggerColumns.eachCartons = true;
            $('#editSO-box').parents('.priseInfoFlag').hide();
//            toggerColumns.extent = true;
//            toggerColumns.breadth = true;
//            toggerColumns.altitude = true;
//            $('#editSO-productMeasFlag').attr('disabled', 'disabled');
        }

        //客户
        $('#editSO-editCustomerId').jqxComboBox({ disabled: true });
        $('#editSO-editCustomerId').val(order.clientId);
        $('#editSO-editCustomerId').find('input').val(order.clientName);
        //$('#editSO-editCustomerId').jqxComboBox('getSelectedItem')==null?$('#editSO-editCustomerId').val(''): '';
        me.customerId = $('#editSO-editCustomerId').val();

        //		me.addAddressObj = order.ocrSaleOrderAddress[0];
        //地址
        //		debugger
        //		var ad = order.ocrSaleOrderAddress[0];
        //		var shortName,province,city,district,streets,street,reAd;
        //		if(ad!=undefined){
        //			shortName = ad.shortName == undefined ? '' : ad.shortName;
        //			province = ad.province == undefined ? '' : ad.province;
        //			city = ad.city ==undefined ? '' : ad.city;
        //			district = ad.district ==undefined ? '' : ad.district;
        //			streets = ad.streets ==undefined ? '' : ad.streets;
        //			street = district+streets;
        //			reAd = '('+shortName+')'+province+city+street;
        //			if(shortName==''){
        //				reAd = province+city+street;
        //			}
        //			$('#editSO-editReceiverAddress').val(ad.addressLabel == undefined ? reAd == undefined ? '' : reAd : ad.addressLabel);
        //		}else{
        //			$('#editSO-editReceiverAddress').val('')	
        //		}
        //		$('#editSO-editReceiverAddress').find('input').val(ad==undefined?'':ad.addressLabel == undefined ? reAd == undefined ? '' : reAd : ad.addressLabel);
        address = order.deliveryAddress;
        var ad = order.ocrSaleOrderAddress == undefined ? [] : order.ocrSaleOrderAddress;
        for (var i = 0; i < ad.length; i++) {
            me.addressNew.push(ad[i]);
        }
        //		addressNew

        //外箱尺寸
        me.cartonType=order.cartonType;
        if (order.productMeasFlag) {
            $('#editSO-productMeasFlag')[0].checked = true;
            if (order.cartonType == 'size' || order.cartonType == null) {
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
        } else {
            toggerColumns.extent = true;
            toggerColumns.breadth = true;
            toggerColumns.altitude = true;
            toggerColumns.volume = true;
            $('#editSO-productMeasFlag').parents('.priseInfoFlag').hide();
        }

        //打印品名
        if (order.printOfGoodsFlag) {
            $('#editSO-boxflag')[0].checked = true;
        } else {
            toggerColumns.printOfGoods = true;
        }

        //单位
        //		var productunitFlag=_global_settings.acOwner.productunitFlag;
        var productunitFlag = order.productunitFlag;
        if (productunitFlag) {
            toggerColumns.unitRate = false;
//            $('.priseInfoFlag').hide();
        }

        //细码
        var yardsFlag = _global_settings.acOwner.yardsFlag;
        if (yardsFlag) {
            toggerColumns.yards = false;
            toggerColumns.totalCartons = true;
            toggerColumns.eachCartons = true;
//            toggerColumns.extent = true;
//            toggerColumns.breadth = true;
//            toggerColumns.altitude = true;
//            toggerColumns.volume = true;
//            $('#editSO-box').parents('.priseInfoFlag').hide();
//            $('.priseInfoFlag').hide();
        }

        //打印品名
        $('#editSO-boxflag').on('change', function() {
            var t = $(this);
            if (t.is(':checked')) {
                $('#editSaleOrder_grid').printOfGoodsFlag('show');
            } else {
                $('#editSaleOrder_grid').printOfGoodsFlag('hide');
            }
        })

        $('#editSO-orderAlreadyDeliver').val(money(order.alreadyDeliverAmt));

        $('#editSO-orderNoReceive').val(money(order.nopaidAmt));

        //拒收的单子
        if (me.stop) {
            me.initStopDetails(order.salesOrderDetails, order, toggerColumns);
            $('#editSO-editTax').jqxDropDownList({ disabled: true });
            $('#editSO-editTaxLimit').attr('readonly', 'readonly');
            $('#editSO-orderMoney').attr('readonly', 'readonly').val(money(order.totalAmt));
        } else {
            me.initOrderDetails(order.ocrSaleOrderDetail, order.vatAmt, toggerColumns);
            $('#editSO-orderMoney').val(money(order.totalAmt));
        }

        sumAmt = order.totalAmt - (order.vatAmt == undefined ? 0 : order.vatAmt);

        //税率改变
        $('#editSO-editTax').on('select', function() {
            if ($(this).val() == 0) {
                $('#editSOtaxLimit').css('display', 'none');
                $('#editSO-editTaxLimit').val('');
            } else {
                $('#editSOtaxLimit').css('display', '');
                $('#editSO-editTaxLimit').val(money(sumAmt * (parseInt($(this).val()) / 100)));
            }

            $('#editSO-orderPartMoney').val(money(sumAmt * 1 + $('#editSO-editTaxLimit').val() * 1));
            $('#editSO-orderMoney').val(money($('#editSO-orderPartMoney').val() - $('#editSO-preferMoney').val()));
            me.setOrderNoReceive(me.enterPriceInfo);
            setOverReceive();

        });

        //税额
        $('#editSO-editTaxLimit').on('change keyup', function() {
            var val = $(this).val() == '' ? 0 : $(this).val();

            $('#editSO-orderPartMoney').val(money(sumAmt * 1 + val * 1));
            $('#editSO-orderMoney').val(money($('#editSO-orderPartMoney').val() - $('#editSO-preferMoney').val()));
            me.setOrderNoReceive(me.enterPriceInfo);

            setOverReceive();
        });

        //税率下拉
        $('#editSO-editTax').dropDownlist({
            source: { '0': '0%', '3': '3%', '5': '5%', '6': '6%', '11': '11%', '13': '13%', '17': '17%' },
            width: '75%',
            height: 35,
            selectedIndex: 0
        }).val(order.vat);

        //销售单号
        $('#editSO-editOrderNumber').val(order.orderNumber);

        //额外费用
        if (order.otherAmt == 0 || order.otherAmt == undefined) {
            $('#editSO-otherpay')[0].checked = false;
        } else {
            $('#editSO-otherpay')[0].checked = true;
            $('#editSOshowOtherpay').css('display', '');
            $('#editSO-otherpayInput').val(money(order.otherAmt));
        }

        //三个时间
        var orderDate = order.orderDate == null ? '' : order.orderDate.substring(0, 10);
        $('#editSO-time').datetimeinput({ width: '90%', height: 34, formatString: 'yyyy-MM-dd', showTimeButton: false }).val(orderDate);
        $('#editSO-rectime').datetimeinput({ width: '90%', height: 34, formatString: 'yyyy-MM-dd', showTimeButton: false }).val(order.planDeliveryDate == undefined ? '' : order.planDeliveryDate.substring(0, 10));
        $('#editSO-sendTime').datetimeinput({
            width: '90%',
            height: 34,
            formatString: 'yyyy-MM-dd HH:mm',
            showTimeButton: true,
            showCalendarButton: true,
        }).val(order.deliveryDate == undefined ? '' : order.deliveryDate.substring(0, 16));

        $('#editSO-orderMoney').val(money(order.totalAmt));
        //税率
        if (order.vat != 0) {
            $('#editSOtaxLimit').css('display', '');
            $('#editSO-editTaxLimit').val(money(order.vatAmt));
        }

        $('#editSO-orderMoney').val(money(order.totalAmt));

        $('#editSO-preferMoney').val(money(order.cheapAmt));

        $('#editSO-orderPartMoney').val(money(order.totalAmt + order.cheapAmt));

        //收付款信息
        me.recRed = order.ocrSaleOrderBill;
        if (me.recRed.length == 0) {
            //			$('#editSO-orderMoney').text($('.allsum').text());
            //			$('#editSO-orderNoReceive').text($('.allsum').text());
        } else {
            //			$('#editSO-receiveRecord')[0].checked=true;
            $('#editSO-receiveTable').css('display', '');
        }
        me.initReceiveRed(me.recRed);

        $('#editSO-remarkPrint').val(order.remarkPrint);

        var settings = {
        	inputId:'#editSO-otherpay',	
        	labelId:'#editOtherpay',
        	showId: '#editSO-otherpayInput',
            otherDesc: me.otherAmtdesc == undefined ? '' : me.otherAmtdesc,
            res: me.otherAmtdesc == undefined ? '' : me.otherAmtdesc,
            ownerId: me.saleRowdata.soOwnerId,
            name: me.saleRowdata.userName,
            mgt: me
        }

        otherPay(settings);

    }

    /**
     * 获取客户信息，并初始化客户相关控件
     */
    this.initCustomer = function(id) {
        var customerId = id;
        var soOwnerId = me.saleRowdata.soOwnerId;
        var userName = me.saleRowdata.userName;

        Core.AjaxRequest({
            type: 'GET',
            showMsg: false,
            //			async:false,
            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/search/clientinfo/id/' + customerId + '/' + soOwnerId + '/' + userName),
            callback: function(res) {

                var data = res;
                me.selectId = res.userInfo.id;

                $.each(data.userInfo.address, function(j, va) {
                    if (va.shortName == '') {
                        va.addressLabel = va.province + va.city + va.district + va.street;
                    } else {
                        va.addressLabel = '(' + va.shortName + ')' + va.province + va.city + va.district + va.street;
                    }
                });
                me.initReceiverAddress(data.userInfo.address);
            }
        });
    }

    /**
     * 初始化收货地址下拉框
     */
    this.initReceiverAddress = function(addressArray) {
        //		if(addressArray.length>0 && address.length>0){
        //			$.each(addressArray, function(i,v){
        //				if(v.id == address[0].id){
        //					address=addressArray;
        if (me.addressNew.length != 0) {
            addressArray = addressArray.concat(me.addressNew);
        }
        //		console.log(addressArray);

        $('#editSO-editReceiverAddress').comboBox({
            source: addressArray,
            displayMember: 'addressLabel',
            valueMember: 'addressLabel',
            width: '91.45556%',
            height: 33,
            checkboxes: true
        });

        setTimeout(function() {
            var abc = address.split(',');
            //			console.log(abc);
            for (var i = 0; i < abc.length; i++) {
                $('#editSO-editReceiverAddress').jqxComboBox('checkItem', abc[i]);
            }
        }, 500);

        //		console.log(address);
        //				}else{
        //					$('#editSO-editReceiverAddress').comboBox({
        //						source : address,
        //						displayMember : 'addressLabel',
        //						valueMember : 'addAddressId',
        //						placeHolder : '请选择送货地址',
        //						width : '91.45556%',
        //						height : 33,
        //						selectedIndex:0,
        //						theme : currentTheme
        //					});
        //					$('#editSO-editReceiverAddress').jqxComboBox('addItem', v.addressLabel);
        //				}
        //			})
        //		}
    }

    /**
     * 初始化订单明细输入列表
     */
    this.initOrderDetails = function(orderDetails, vatAmt, toggerColumns) {

        //新版grid初始化
        getProductInUsePart(me.saleRowdata.soOwnerId, me.saleRowdata.userName, function(res) {
            var productSourceName = res;
            $('#editSaleOrder_grid').easyGrid({
                columnSumEvent: function() {
                    var ysprice = $("#editSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'ysprice', ['sum']).sum;
                    var dsprice = $("#editSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'dsprice', ['sum']).sum;
                    $('#editSO-orderAlreadyDeliver').val(money(ysprice + dsprice));

                    var sum = $("#editSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3', ['sum']);
                    sumAmt = sum.sum;

                    var val = $('#editSO-editTax').val(); //税率

                    var value = money(sumAmt * val / 100);

                    if (val == 0) {
                        //					$('#editSO-sum').val(money(sumAmt));
                        $('#editSO-orderPartMoney').val(money(sumAmt));
                        $('#editSO-orderMoney').val(money($('#editSO-orderPartMoney').val() - $('#editSO-preferMoney').val()));
                        me.setOrderNoReceive(me.enterPriceInfo);
                    } else {
                        $('#editSO-editTaxLimit').val(value);
                        //					$('#editSO-sum').val(money(value*1+sumAmt*1));
                        $('#editSO-orderPartMoney').val(money(value * 1 + sumAmt * 1));
                        $('#editSO-orderMoney').val(money($('#editSO-orderPartMoney').val() - $('#editSO-preferMoney').val()));
                        me.setOrderNoReceive(me.enterPriceInfo);
                    }
                    setOverReceive();
                },
                toggerColumns: toggerColumns,
                source: orderDetails,
                sourceType: 'salePrice',
                productSourceName: productSourceName,
                order:me.data,
                ownerSettings: {
                    soOwnerId: me.saleRowdata.soOwnerId,
                    userName: me.saleRowdata.userName,
                    elementId: null
                },
                gridSettings: {
                    editable: true,
                    delBtn: true
                }
            });
        });
    }

    this.initOcrOrderStatus = function(data) {
        Core.AjaxRequest({
            type: 'GET',
            url: _global_settings.service.url + '/overview/orderSalesLogs/getlist/' + data.uuid,
//            async: false,
            showMsg: false,
            callback: function(res) {

                var se = {
                    localdata: res,
                    datatype: 'json'
                }

                var demo = new $.jqx.dataAdapter(se);

                //初始化Grid
                var grid_sets = {
                    source: demo,
                    rendergridrows: function() {
                        return demo.recordids;
                    },
                    pageable: false,
                    width: '100%',
                    height: 'auto',
                    enablehover: false,
                    columnsheight: 45,
                    columns: [
                        { text: '更新人', dataField: 'createBy', width: '15%' },
                        {
                            text: '备注',
                            width: '70%',
                            cellsrenderer: function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
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
                                    case 'KHBackout': //客户撤销
                                        abc = rowdata.backRemark == undefined ? '' : rowdata.backRemark;
                                        break;
                                    default:
                                        abc = '';
                                        break;
                                }
                                html += getCodeData(rowdata.handleType);
                                if (abc != '' && abc != undefined) {
                                    html += '：';
                                }
                                html += abc;
                                return html + '</div>';
                            }
                        },
                        { text: '更新时间', dataField: 'handleDate', width: '15%' },
                    ]
                };

                $('#viewOcrOrderStatusGrid').grid(grid_sets);

            },
            failure: function(e) {
                var err = JSON.parse(e.responseText);
                Core.alert({
                    message: err.errorMsg
                });
            }
        });
    }

    //拒收的单子
    this.initStopDetails = function(orderDetails, order, toggerColumns) {

        //新版grid初始化
        $('#editSaleOrder_grid').easyGrid({
            columnSumEvent: function() {
                var sum = $("#editSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3', ['sum']);

                setOverReceive();

            },
            toggerColumns: toggerColumns,
            stop: true,
            source: orderDetails,
            sourceType: 'salePrice',
            gridSettings: {
                editable: false,
                delBtn: false
            }
        });

        //sumAmt=$('#editSaleOrder_grid').jqxGrid('getcolumnaggregateddata', 'price3',['sum']).sum;
        sumAmt = order.totalAmt - (order.vatAmt == undefined ? 0 : order.vatAmt);
    }

    /**
     * 初始化收款记录
     */
    this.initReceiveRed = function(recRed) {
        var obj = {
            setOrderNoReceive: me.setOrderNoReceive,
            enterPriceInfo: me.enterPriceInfo,
            type: 'salesorderbill',
            data: recRed,
            orderMoney: $('#editSO-orderMoney'),
            orderReceive: $('#editSO-orderReceive'),
            orderNoReceive: $('#editSO-orderNoReceive'),
            orderOverReceive: $('#editSO-orderOverReceive'),
            grid:'editSaleOrder_grid'
        }
        $('#editSO-receiveTable').easytableExamplex(obj);

    };

    /**
     * 初始化所有表单的校验
     */
    this.initValidator = function() {
        $('#editSO-Form').jqxValidator({
            animationDuration: 1,
            hintType: 'label',
            rules: [{
                    input: '#editSO-rectime',
                    message: '不能小于销售日期',
                    action: 'keyup, change',
                    rule: function(input, commit) {
                        if (input.val() == '') return true;
                        if (input.val() < $('#editSO-time').val()) return false;
                        return true;
                    }
                },
                {
                    input: '#editSO-sendTime',
                    message: '不能小于销售日期',
                    action: 'keyup, change',
                    rule: function(input, commit) {
                        if (input.val() == '') return true;
                        if (input.val() < $('#editSO-time').val()) return false;
                        return true;
                    }
                }
            ]
        });
    }

}

var EditSaleOrderBindModle = function(editSOMgt) {

    var me = this;

//    this.refreshInputGrid = function() {
//        // 刷新可能的列表
//        try {
//            $('#saleOrderGrid').jqxGrid('updatebounddata', 'cells');
//        } catch (e) {}
//    }

    var getSalesOrder = function(bool) {
        var table = $('#editSaleOrder_grid').getDataWash(bool);
        return table;
    }

    //校验
    var judgeRec = function() {
        var tr = $('#editSO-receiveRecordTbody').children();
        if (tr.find('.s1r').length > 0) {
            return false;
        }

        return true;
    }

    //获取收款记录明细
    var getReceiveDetail = function() {
        var arr = [],
            tr = $('#editSO-receiveRecordTbody').children();
        $.each(tr, function(i) {
            var val = tr.eq(i).find('.receiveMoney').val();
            if (val != 0 && val != '') {
                var obj = {};
                obj.cerateDate = tr.eq(i).find('.time').val();
                obj.amount = val;
                obj.payWay = tr.eq(i).find('.receiveWay').val();
                obj.remark = tr.eq(i).find('.remark').val();
                arr.push(obj);
            }
        });

        return arr;
    }

//    var saveReceive = function(obj, arr, type) {
//        var name = $('#editSO-editCustomerId').find('input').val();
//
//        $.each(arr, function(i) {
//            obj.customerName = name;
//            obj.id = arr[i].id;
//            obj.createDate = arr[i].createDate;
//            obj.amount = arr[i].amount;
//            obj.payWay = arr[i].payWay;
//            obj.remark = arr[i].remark;
//            //			console.log('++++++++++'+obj)
//
//            Core.AjaxRequest({
//                url: ctx + '/CXF/rs/salesorderbill',
//                type: type,
//                params: obj,
//                showMsg: false,
//                async: false,
//                callback: function() {
//                    //					$.closeTab();
//                }
//            });
//        });
//    }

    //保存收款记录
//    var submitReceive = function(id) {
//        var obj = {};
//        obj.salesOrderDeal = { id: id };
//        obj.ownerId = editSOMgt.saleRowdata.soOwnerId;
//
//        var receiveDetail = getReceiveDetail(); //收款记录
//        var name = $('#editSO-editCustomerId').find('input').val();
//        $.closeTab();
//        if (receiveDetail.length == 0) {
//            return false;
//        }
//
//        $.each(receiveDetail, function(i) {
//            obj.customerName = name;
//            obj.ceateDate = receiveDetail[i].createDate;
//            obj.amount = receiveDetail[i].amount;
//            obj.payWay = receiveDetail[i].payWay;
//            obj.remark = receiveDetail[i].remark;
//
//            console.log('++++++++++' + obj)
//        });
//    }

    // 保存SO
    this.submitOrder = function(po, bool) {
        //		var check=$('#editSO-receiveRecord')[0].checked;
        if (!bool) {
            if (!judgeRec()) {
                Core.alert({ message: '编辑的收款金额不能为0！' });
                return false;
            }
        }

        Core.AjaxRequest({
            url: editSOMgt.url + '/updateOrder',
            type: 'PUT',
            //            async:false,
            params: po,
            showWaiting: true,
            successMsg: '操作成功',
            //            showMsg:false,
            callback: function(res) {
                setCloseAlertTimeOneSecond();
                $('#ocrSubmitAgainWindow').jqxWindow('close');
                $('#ocrSubmitAgainWindow').jqxWindow('destroy');
                $.closeTab();
                $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
                //            	$('#viewOcrOrderStatusGrid').jqxGrid('updatebounddata','cells');
                //            	$('#viewOcrStatusGrid').jqxGrid('updatebounddata','cells');
            },
            failure: function(e) {
                var err = JSON.parse(e.responseText);
                Core.alert({
                    message: err.errorMsg
                });
            }
        });
    }

    //保存消息
//    var saveMes = function(salesId) {
//        Core.AjaxRequest({
//            url: ctx + '/CXF/rs/informationLogs/save/' + salesId + '/sales',
//            type: 'GET',
//            showMsg: false,
//            async: false,
//            callback: function() {
//
//            }
//        })
//    }

    this.initEditParam = function(submitRemark, bool) {
        var obj = {};
        obj.id = editSOMgt.data.id //OCR销售单id
        obj.submitRemark = submitRemark; //再次提交备注
        obj.clientName = $('#editSO-editCustomerId').find('input').val(); //客户信息
        obj.clientId = $('#editSO-editCustomerId').val(); //客户id
        obj.address = '';

        var addressGetCheckedItems = $('#editSO-editReceiverAddress').jqxComboBox('getCheckedItems');
        var deliveryAddress = '';
        var ocrAddress = editSOMgt.addAddressObj;
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
            if (editSOMgt.addressNew.length != 0) {
                obj.ocrSaleOrderAddress = obj.ocrSaleOrderAddress.concat(editSOMgt.addressNew);
            }
        } else {
            if (editSOMgt.addressNew.length != 0) {
                //        		obj.ocrSaleOrderAddress=[];
                obj.ocrSaleOrderAddress = editSOMgt.addressNew;
            }
        }
        obj.deliveryAddress = deliveryAddress;
        console.log(obj.deliveryAddress);
        console.log(obj.ocrSaleOrderAddress);

        //      return false;
        //		if(typeof $('#editSO-editReceiverAddress').val() == 'number') {			//收货地址
        //			editSOMgt.initCustomer({
        //        		customerId : editSOMgt.customerId,
        //        		soOwnerId : editSOMgt.saleRowdata.soOwnerId,
        //        		userName :  editSOMgt.saleRowdata.userName,
        //        		flag : false,
        //        		callbacks : function(res) {
        //        			if(res.length>0){
        //        				$.each(res, function(i, v){
        //            				if( $('#editSO-editReceiverAddress').val() == v.id){
        //            					console.log(res[i]);
        //            					res[i].addAddressId = res[i].id;
        //            					delete res[i].id;
        //            					obj.ocrSaleOrderAddress = [res[i]];
        //            				}
        //            			});
        //        			}else{
        //        				obj.ocrSaleOrderAddress = [];
        //        			}
        //        		}
        //        	});
        //		}else{
        //			var arrs = [];
        //			if(editSOMgt.addAddressObj!=undefined){
        //				arrs.push(editSOMgt.addAddressObj);
        //			};
        //			if(arrs.length>0){
        //				obj.ocrSaleOrderAddress = arrs; 							//收货地址id如果是没做修改，传id。做了修改。传val
        //			}else{
        //				obj.ocrSaleOrderAddress = [];
        //			}
        //		}

        obj.orderDate = $('#editSO-time').val(); //销售日期
        obj.deliveryDate = $('#editSO-sendTime').val() == '' ? '' : $('#editSO-sendTime').val() + ':00'; //送货日期
        obj.planDeliveryDate = $('#editSO-rectime').val(); //计划送货日期
        obj.orderNumber = $('#editSO-editOrderNumber').val(); //销售单单号

        obj.otherAmtdesc = editSOMgt.otherAmtdesc; //额外费用描述
        obj.otherAmt = $('#editSO-otherpayInput').val(); //额外费用
        if (!$('#editSO-otherpay')[0].checked) {
            obj.otherAmtdesc = ''; //额外费用
            obj.otherAmt = '';
        }

        obj.remarkPrint = $('#editSO-remarkPrint').val(); //打印备注时显示

        obj.productMeasFlag = $('#editSO-productMeasFlag')[0].checked; //是否开启外箱尺寸
        obj.printOfGoodsFlag = $('#editSO-boxflag')[0].checked; //是否开启客户货号
        obj.goodsBinning = 'N'; //是否开启货品装箱
        if ($('#editSO-box')[0].checked) {
            obj.goodsBinning = 'Y';
        }

        obj.simpleOrderId = editSOMgt.saleRowdata.id //销售单id

        obj.vat = $('#editSO-editTax').val(); //税率
        obj.vatAmt = $('#editSO-editTaxLimit').val(); //税额
        obj.totalAmt = $('#editSO-orderMoney').val(); //订单金额
        obj.cheapAmt = $('#editSO-preferMoney').val(); //优惠金额
        obj.uuid = editSOMgt.saleRowdata.uuid;

        obj.discountFlag = _global_settings.acOwner.ownerAttr.discountFlag; //折扣
        obj.yardsFlag = _global_settings.acOwner.yardsFlag;
        obj.productunitFlag = _global_settings.acOwner.productunitFlag;
        obj.customFormulaFlag = _global_settings.acOwner.ownerAttr.customFormulaFlag;
        obj.productKgFlag = _global_settings.acOwner.productKgFlag; //重量
        if(obj.productKgFlag){
        	obj.weightUnit = _global_settings.acOwner.prodUnit[0].descr;  //重量单位
        	obj.weightWay = _global_settings.acOwner.prodUnit[0].weightWay;  //计重方式
        }
        if($('#editSO-productMeasFlag')[0].checked){
        	obj.cartonType = editSOMgt.cartonType;
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
            console.log('++++++++++' + obj);
        });

        //获取销售单详情
//        if ($('#addFastSo').is(':checked')) {
//            //快捷开单部分
//            obj.orderType = 'enclosure';
//            var salesOrderDetailsid = _global_settings.owner.ppid;
//            if (salesOrderDetailsid == 'NoProduct') {}
//
//            obj.orderStatus = $('#editSO-send-span').data('id');
//            if (bool) {
//                obj.orderStatus = 'undelivered';
//            }
//            if (obj.orderStatus == 'partialdelivered') {
//                obj.salesOrderDeal = {};
//                obj.salesOrderDeal.paidAmt = $('#editSO-editOrderNum').val();
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
        $('#editSO-attachment').find('.item').each(function(i, v) {
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
    }

    this.bind = function() {

        /**
         * 客服驳回
         * 只有客户通过和审核、复核通过不可驳回，其他状态都可以
         * 驳回字段目前只限定后台给定特定字段。
         */

        $('#editSoRejectBtn').off('click').on('click', function() {
        	setPara();
            rejectOcrOrder(editSOMgt.saleRowdata.uuid);
        });

        //前台新增地址，不提交到后台
        $('#editSOAddressBtn').on('click', function() {
//            if (editSOMgt.customerId == null) {
//                Core.alert({ message: '请先选择客户！' });
//                return false;
//            }
            if ($('#editSOAddress').jqxValidator('validate')) {
                var addressObj = {
                    shortName: $('#editSOAddressTableSn').val(),
                    province: $('#editSOAddressTableArs').find('select').eq(0).val(),
                    city: $('#editSOAddressTableArs').find('select').eq(1).val(),
                    district: $('#editSOAddressTableArs').find('select').eq(2).val(),
                    street: $('#editSOAddressTableSt').val(),
                    zipCode: $('#editSOAddressTableZc').val(),
                    remark: $('#editSOAddressTableRm').val()
                }

                var myshortName = addressObj.shortName == '' ? '' : '(' + addressObj.shortName + ')';

                addressObj.addressLabel = myshortName + addressObj.province + addressObj.city + addressObj.district + addressObj.street;

                editSOMgt.addAddressObj.push(addressObj);

                $('#editSOAddress').modal('hide');
                $('#editSO-editReceiverAddress').jqxComboBox('addItem', { label: addressObj.addressLabel });
                $('#editSO-editReceiverAddress').jqxComboBox('checkItem', addressObj.addressLabel);
            }

        });

        //保存编辑
        $('#saveEditBtn').off('click').on('click', function() {
        	setPara();
            var type = editSOMgt.saleRowdata.orderType;
            var arr = ['checkFailed', 'checkAgainFailed', 'checkRefused', 'orderSubmitAgain', 'checking','checkingAgain', 'orderSubmit', 'orderSubmitAgain'];
            if (arr.indexOf(type) > -1) {
                $('#ocrSubmitAgainWindow').jqxWindow('open',function(){$('#ocrSubmitAgainRemark').focus();});
            } else if (type == 'orderSubmit') {
                timeOut(function() {
                    getMsgForNullSpecId($('#editSaleOrder_grid').getDataWash(), me.submitOrder, me.initEditParam('', null))
                });
            }
        });
        $('#saveSubmitAgainSubmit').off('click').on('click', function() {
            var submitRemark = $('#ocrSubmitAgainRemark').val();
            if (submitRemark == '') {
                Core.alert({ message: '提交理由不可为空' });
                return false;
            }
            //保存销售单
            timeOut(function() {
                getMsgForNullSpecId($('#editSaleOrder_grid').getDataWash(), me.submitOrder, me.initEditParam(submitRemark, null))
            });
        })
//        debugger
        //外箱尺寸
//        var productMeasFlag = _global_settings.acOwner.productMeasFlag == 'true' ? true : false;
        $('#editSO-productMeasFlag').on('change', function() {
            var t = $(this);
            if (t.is(':checked')) {
                $('#editSaleOrder_grid').productMeasFlag('show',editSOMgt.cartonType);
            } else {
                $('#editSaleOrder_grid').productMeasFlag('hide',editSOMgt.cartonType);
            }
        });

        //是否装箱
//        var productBoxFlag = _global_settings.acOwner.productBoxFlag == 'true' ? true : false;
        $('#editSO-box').on('change', function() {
            var t = $(this);
            if (t.is(':checked')) {
                //$('#editSaleOrder_grid').jqxGrid('beginupdate');
                $('#editSaleOrder_grid').boxSetting('show');
                //$('#editSaleOrder_grid').jqxGrid('endupdate');
            } else {
                //$('#editSaleOrder_grid').jqxGrid('beginupdate');
                $('#editSaleOrder_grid').boxSetting('hide');
                //$('#editSaleOrder_grid').jqxGrid('endupdate');
            }
        });
    }

    this.unbindAll = function() {

    }
}