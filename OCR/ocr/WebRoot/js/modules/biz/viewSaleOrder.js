/**
 * 查看销售单界面js
 * 分以下几种种查看方式
 * 1,正常销售单查看-凡是提交过都正常		正常请求接口
 * 2,未提交前提下客户撤销				请求备份接口
 * 3,未提交前提下客服驳回				请求小商快捷开单接口
 * 4,待抢单状态下客户撤销				请求备份接口
 */
var ViewSaleOrderMgt = function() {

    var me = this;

    this.url = _global_settings.service.url + '/overview';

    this.random = null; //随机数

    this.orderId = null; //订单ID

    this.data = null; //订单详情

    this.stop = false; //是否拒收

    this.receiveRecord = null; //收款记录

    this.saleRowdata = null; //当前单据信息	

    this.enterPriceInfo = null; //商户信息	

    // this.getListData = null; //单据状态

    this.customerSource = null; //客户信息

    var sumAmt = 0; //总额

    var typeArr = [],
        bool = 0;

    this.initInput = function() {
        me.saleRowdata = $.pk.data;

        if ($.pk != undefined) {
            me.orderId = $.pk.data.id;
            me.random = $.pk.data.random;
        }
        if (me.random == null || me.random == '') {
            me.random = new Date().getTime();
        }
        //		debugger
        me.initWindows();

        me.initPermissionStatus(me.saleRowdata);

        me.initOcrOrderStatus(me.saleRowdata);

        //bool默认为0（正常状态下)
        //bool为1时是客户撤销状态下
        //bool为2时是客服驳回状态下
        // debugger
        // $.each(me.getListData, function(i, v) {
        //     typeArr.push(v.handleType);
        // });

        // if (typeArr.indexOf('KHBackout') > -1 && typeArr.indexOf('orderSubmit') < 0) {
        //     //凡是客服未提交前提下的客户撤销都是请求备份接口，有两种情况
        //     //未抢单下客户撤销+已抢单下客户撤销
        //     bool = 1;
        // }

        // if (typeArr.indexOf('KFReject') > -1 && typeArr.indexOf('orderSubmit') < 0 && typeArr.indexOf('KHBackout') < 0) {
        //     //满足两个条件，1是客服驳回。2是没有提交销售单。
        //     //如果满足客服驳回和提交，bool=0，查看正常销售单
        //     bool = 2;
        // }

        // if (bool == 0) {
        //     //是否装箱
        //     me.isbox = 'N';
        //     me.getSaleOrderDetail(me.saleRowdata.uuid);
        //     getPriseInfo({
        //         id: 'viewSOAddressTableArs',
        //         soOwnerId: me.saleRowdata.soOwnerId,
        //         userName: me.saleRowdata.userName,
        //         callback: function(res) {
        //             me.enterPriceInfo = res;
        //             if (res[0].blueTooth) {
        //                 $('#viewSO-boxflag').parents('.col-md-1').addClass('hide');
        //             }
        //         }
        //     });
        // } else {
        //     this.initOtherStatusOrder(bool);
        // }
    };

    /**
     * 特殊状态下查看销售单
     * 1,正常销售单查看-凡是提交过都正常		正常请求接口
     * 2,未提交前提下客户撤销				请求备份接口
     * 3,未提交前提下客服驳回				请求小商快捷开单接口
     * 4,待抢单状态下客户撤销				请求备份接口
     */
    this.initOtherStatusOrder = function(bool) {
        var urls = '';
        if (bool == 1) {
            urls = _global_settings.service.url + '/overview/kfRejectOrder/' + me.saleRowdata.uuid;
        } else if (bool == 2) {
            urls = _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/salesorderid/' + me.saleRowdata.id + '/' + me.saleRowdata.soOwnerId + '/' + me.saleRowdata.userName);
        }
        
        Core.AjaxRequest({
            type: 'GET',
            url: urls,
            // async : false,
            showMsg: false,
            callback: function(res, textStatus) {
                if (textStatus == 'success') {
                    me.initOtherStatusPages(res, bool);
                } else {}
            },
            failure: function(e) {
                var err = JSON.parse(e.responseText);
                Core.alert({
                    message: err.errorMsg
                });
            }
        });
    }

    /**
     * 初始化查看销售单
     */
    this.initOtherStatusPages = function(data, bool) {
//        debugger
        
        if (bool == 1) {
            //有且仅有(未提交状态下客服驳回，然后客户撤销)或者带抢单状态下客户撤销
            $('#viewSO-receiveTable').css('display', 'none');
        }
        if (bool == 2) { //未提交状态下客服驳回
            me.getReceiveRecord(data.salesOrderDeal.id);
            $('#viewSO-attachment').fileuploader({
                filelist: data.fileInfoIds.toString(),
                orderId: me.saleRowdata.id,
                ownerId: me.saleRowdata.soOwnerId,
                ownerName: me.saleRowdata.userName,
                readonly: true,
                orderType: me.saleRowdata.orderType,
                showImg:false
            });
            return;
        }

//        $('#viewFastSo-list').show();
//        $('#viewSO-send-span').show();
        $('.viewfileorderhide').hide();

        var arr = [];
        if (data.fileInfoIds.indexOf(',') > 0) {
            arr = data.fileInfoIds.split(',');
        } else {
            arr.push(data.fileInfoIds);
        }
        me.loadImgSpan(arr);

        $('#viewSO-orderNumber').val(data.orderNumber);
        $('#viewSO-remarkPrint').val(data.remarkPrint);
        //        debugger
        $('#viewSO-address').val(data.address);

        $('#' + 'viewSO-saletime').val(data.orderDate == undefined ? '' : data.orderDate.substring(0, 10));
        $('#' + 'viewSO-sendTime').val(data.deliveryDate == undefined ? '' : data.deliveryDate.substring(11, 12) == 0 ?
            data.deliveryDate.substring(0, 10) : data.deliveryDate.substring(0, 16));
        $('#' + 'viewSO-rectime').val(data.planDeliveryDate == undefined ? '' : data.planDeliveryDate.substring(0, 10));

        $('#viewSO-Form').find('.viewSoIcons').show();
        $('#viewSO-orderMoney-span').find('.viewSO-orderPartMoney-text').text('合同金额');
//        $('#viewSO-orderPartMoney-span').hide();
        $('#viewSO-orderPartMoney').removeClass('b-0').removeClass('p-l-0');
        $('#viewSO-orderPartMoney').parent().removeClass('ab65').removeClass('col-sm-10').removeClass('col-sm-7')
            .addClass('ab90').addClass('col-sm-9');
        $('#viewSO-orderMoney-span').removeClass('col-md-3').addClass('col-md-4')
        $('#viewSO-orderMoney-span').find('label').addClass('m-l-15').addClass('leftlabel');
        $('#viewSO-orderMoney-span').insertAfter($('#viewSO-addCustomerId-span'));
        $('#viewSO-orderMoney').val(money(data.totalAmt));
        
//        if (data.clientInfo != undefined && data.clientInfo.id != undefined) {
//            getCustomerComboboxSource({
//                soOwnerId: me.saleRowdata.soOwnerId,
//                userName: me.saleRowdata.userName,
//                callback: function(res) {
//                    me.customerSource = res;
//                    $('#viewSO-customerName').val(me.getCustomer(data.clientInfo.id)._name);
//                }
//            });
//        }
    }

    //获取客户
//    this.getCustomer = function(clientInfoid) {
//        var rd = me.customerSource;
//        for (var i = 0; i < rd.length; i++) {
//            if (rd[i].clientInfoid == clientInfoid) {
//                return rd[i];
//            }
//        }
//
//        return '';
//    }


    /**
     * 依据小商的商户设置的业务属性来计算未收款
     */
    this.setOrderNoReceive = function(data) {
        //debugger
        var huowu = $("#viewSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3', ['sum']).sum;
        huowu = parseFloat(money(huowu));
        var type = data[0].arrearsType;

        var all = parseFloat($('#viewSO-orderMoney').val()); //合同金额
        var prefer = parseFloat($('#viewSO-preferMoney').val()); //优惠金额
        var alreadyReceive = parseFloat($('#viewSO-orderReceive').val()); //已收金额
        var alreadyDeliver = parseFloat($('#viewSO-orderAlreadyDeliver').val()); //已送金额
        var tax = parseFloat(money($('#viewSO-viewTaxLimit').val())); //税额

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

        //已收大于已送或者已送大于合同
        if (noReceive < 0) {
            $('#viewSO-orderOverReceive').val(money(-noReceive));
            $('#viewSO-orderNoReceive').val(money(0));
            $('#viewSO-orderOverReceive').parents('.col-md-3').find('.row').removeClass('hide');
        } else {
            $('#viewSO-orderOverReceive').val(money(0));
            $('#viewSO-orderNoReceive').val(money(noReceive));
            $('#viewSO-orderOverReceive').parents('.col-md-3').find('.row').removeClass('show');
        }
    }

    /**
     * 初始化模态窗口
     */
    this.initWindows = function() {
        $('#ocrCheckSubmitWindow').jqxWindow({
            theme: currentTheme,
            isModal: true,
            autoOpen: false,
            maxHeight: 1000,
            height: 450,
            width: 600,
            minWidth: 500,
            cancelButton: $('#cancelOcrCheckSubmit'),
            initContent: function() {}
        }).on('close', function() {
            $('#ocrCheckSubmitRemark').val('');
        });

        $('#ocrCheckSubmitWindow').center();
        $(window).on('resize', function() {
            $('#ocrCheckSubmitWindow').center({ transition: 0 });
        });
    }

    /**
     * 初始化订单状态列表
     */
    this.initOcrOrderStatus = function(data) {
        Core.AjaxRequest({
            type: 'GET',
            url: _global_settings.service.url + '/overview/orderSalesLogs/getlist/' + data.uuid,
            // async: false,
            showMsg: false,
            callback: function(res) {
                // me.getListData = res;
//            	debugger
                $.each(res, function(i, v) {
                    typeArr.push(v.handleType);
                });
            	
            	var last=typeArr[typeArr.length-1];
            	/**
                 * 特殊状态下查看销售单
                 * 1,正常销售单查看-凡是提交过都正常		正常请求接口
                 * 2,未提交前提下客户撤销				请求备份接口
                 * 3,未提交前提下客服驳回				请求小商快捷开单接口
                 * 4,待抢单状态下客户撤销				请求备份接口*/

                if (last.indexOf('KHBackout') > -1 &&typeArr.indexOf('orderSubmit') <0) {
                    //凡是客服未提交前提下的客户撤销都是请求备份接口，有两种情况
                    //未抢单下客户撤销+已抢单下客户撤销
                    bool = 1;
                }

                if (last.indexOf('KFReject') > -1 && typeArr.indexOf('orderSubmit') < 0) {
                    //满足两个条件，1是客服驳回。2是没有提交销售单。
                    //如果满足客服驳回和提交，bool=0，查看正常销售单
                    bool = 2;
                }
                
                if (bool == 0) {
                    //是否装箱
                    me.isbox = 'N';
                    // me.getSaleOrderDetail(me.saleRowdata.uuid);
                    getPriseInfo({
                        id: 'viewSOAddressTableArs',
                        soOwnerId: me.saleRowdata.soOwnerId,
                        userName: me.saleRowdata.userName,
                        callback: function(res) {
                            me.enterPriceInfo = res;
                            if (res[0].blueTooth) {
                                $('#viewSO-boxflag').parents('.col-md-1').addClass('hide');
                            }

                            me.getSaleOrderDetail(me.saleRowdata.uuid);
                        }
                    });
                } else {
                    me.initOtherStatusOrder(bool);
                }

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

                $('#viewOcrStatusGrid').grid(grid_sets);
            },
            failure: function(e) {
                var err = JSON.parse(e.responseText);
                Core.alert({
                    message: err.errorMsg
                });
            }
        });
    }
    
    /**
     * 设置登录角色权限问题
     */
    this.initPermissionStatus = function(data) {
        var orderType = data.orderType;
//        $('#viewSO-receiveAndSave').css('display', 'none');
        var info = getCurrentInfo();

        if (info == 'ocr_writer') {
	          var arr = ['complete', 'checkAgainSuccess', 'checkSuccess']
	          if (arr.indexOf(orderType) > -1) {
	              $('#viewSO-editBtn').css('display', 'none');
	          } else {
	              $('#viewSO-editBtn').css('display', 'block');
	          }
	      }
        
        var arrs = ['complete', 'checkAgainSuccess', 'checkSuccess', 'KFReject', 'KHBackout'];
        if (arrs.indexOf(orderType) > -1) {
//          $('#viewSO-checkBtn').css('display', 'none');
            $('#viewSO-editBtn').css('display', 'none');
            $('#viewSO-rejectBtn').css('display', 'none');
        }
       
        if (info == 'ocr_checker'||info=='ocr_sys'||info=='ocr_grp') {
        	if(info=='ocr_checker'){
        		$('#viewSO-editBtn').css('display', 'none');
                $('#viewSO-rejectBtn').css('display', 'none');
        	}
            if (orderType == 'orderSubmit' || orderType == 'checking' || orderType == 'orderSubmitAgain' || orderType == 'checkingAgain') {
//                $('#viewSO-checkBtn').css('display', 'block').trigger('click');
            	$('#viewSO-checkPass').removeClass('hide');
            	$('#viewSO-checkRefuse').removeClass('hide');
            	
            	//打开审批窗口
                var attrSuccess = 'checkSuccess',
                    attrFailed = 'checkFailed';
                //		debugger
                if (me.saleRowdata.orderType == 'orderSubmit' || me.saleRowdata.orderType == 'checking') {
                    attrSuccess = 'checkSuccess';
                    attrFailed = 'checkFailed';
                } else if (me.saleRowdata.orderType == 'orderSubmitAgain' || me.saleRowdata.orderType == 'checkingAgain') {
                    attrSuccess = 'checkAgainSuccess';
                    attrFailed = 'checkAgainFailed';
                }
                $('#viewSO-checkPass').attr('data-status', attrSuccess);
                
                $('#viewSO-checkRefuse').on('click', function() {
                    $('#ocrCheckSubmitWindow').jqxWindow('open', function() {
                        $('#ocrCheckSubmitRemark').val('').focus();
                        $('#saveOcrCheckSubmit').attr('data-status', attrFailed);
                    });
                });
            	
            } else {
//                $('#viewSO-checkBtn').css('display', 'none');
            }
        }
    }

    this.loadImgSpan = function(arr) {
        var str = ''
        for (var i in arr) {
            var imgSrc = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + arr[i] + '/' + me.saleRowdata.soOwnerId + '/' + me.saleRowdata.userName);
            var html = ' <form class="col-md-4 imgFile">                                                                                                                         ' +
                '	       <div class="col-md-12">                                                                                                                      ' +
                '			  <div class="viewimgDetailRowImgCell" style="height:100pt">                                                                                                                    ' +
                '			      <img src="' + imgSrc + '" style="width: 100%; height: 100%;position: relative;" class="img0"> ' +
                //'<i class="md-cancel close-lab"></i>' +
                '			  </div>                                                                                                                                    ' +
                //'			  <input type="file" name="file" multiple="multiple" style="display:none" class="file0">                                        ' +
                //'			  <div class="m-t-10 relative proTypeLabel" style=" width: 190pt;background: #f8f9f9;color: #53687D;">                                                                                                ' +
                // '<input type="checkbox" checked="true" class="prod_specCheck"><input class="prod_specText" placeholder="颜色描述" value="">|<input class="prod_specNum" placeholder=""></div>                                                         ' +
                //    		'				  <i class="md-cancel close-lab"></i>'+
                '			  </div>                                                                                                                                    ' +
                '	       </div>                                                                                                                                       ' +
                '	   </form>';
            str += html;
        }
        $('.viewimgDetailRowList').html(str);
        $('#viewFastSo-list').css('display','');
    }

    /**
     * 查找订单明细
     */
    this.getSaleOrderDetail = function(ids) {
        Core.AjaxRequest({
            url: me.url + '/getOrder/' + ids,
            type: 'GET',
            showMsg: false,
            callback: function(data) {
                //debugger
                me.jsdata = $.extend(true, {}, data);
                me.data = data;
                me.receiveRecord = data;

                me.initPage(data);
                me.initReceiveRecord(data.ocrSaleOrderBill);
                me.initPay(data.ocrSaleOrderBill);

                var settings = {
                	inputId: '#otherPayInput',
                    labelId: '#viewOtherpay',
                    otherDesc: data.otherAmtdesc,
                    view:true
                }
                otherPay(settings);

                me.orderNumber = data.orderNumber;

//                $('#viewFastSo').attr('disabled', 'disabled');

                $('#viewSO-attachment').fileuploader({
                    filelist: data.fileInfoIds.toString(),
                    orderId: me.saleRowdata.id,
                    ownerId: me.saleRowdata.soOwnerId,
                    ownerName: me.saleRowdata.userName,
                    readonly: true,
                    orderType: me.saleRowdata.orderType,
                    showImg:false
                });
            },
            failure: function(e) {
                var err = JSON.parse(e.responseText);
                Core.alert({
                    message: err.errorMsg,
                    callback: function() {
                        $.closeTab();
                    }
                });
            }
        });
    }

    /**
     * 初始化收款记录
     */
    this.initReceiveRecord = function(res) {
        if (res.length == 0) {
            $('#' + 'viewSO-receiveTable').css('display', 'none');
            $('#' + 'viewSO-orderNoReceive').val($('#viewSO-orderMoney').val());
        } else {
            $('#' + 'viewSO-receiveTable').css('display', '');
            me.initReceiveDetails(res);
        }
    }

    /**
     * 初始化页面
     */
    this.initPage = function(data) {
        console.log(data);
        $('#' + 'viewSO-customerName').val(data.clientName==undefined?data.clientInfo.userInfo.name:data.clientName);
        $('#' + 'viewSO-orderNumber').val(data.orderNumber);
        //额外费用
        $('#' + 'viewSO-otherpay').attr('disabled', 'disabled');
        $('#viewOtherpay').attr('disabled', 'disabled');
        if (data.otherAmt == 0 || data.otherAmt == undefined) {
            $('#' + 'viewSO-otherpay')[0].checked = false;
        } else {
            $('#' + 'viewSO-otherpay')[0].checked = true;
            $('#' + 'viewSOshowOtherpay').css('display', '');
            $('#' + 'viewSO-otherpayInput').val(money(data.otherAmt));
        }

        $('#' + 'viewSO-saletime').val(data.orderDate == undefined ? '' : data.orderDate.substring(0, 10));
        $('#' + 'viewSO-sendTime').val(data.deliveryDate == undefined ? '' : data.deliveryDate.substring(11, 12) == 0 ?
            data.deliveryDate.substring(0, 10) : data.deliveryDate.substring(0, 16));
        $('#' + 'viewSO-rectime').val(data.planDeliveryDate == undefined ? '' : data.planDeliveryDate.substring(0, 10));

        //		var ad = data.ocrSaleOrderAddress[0];
        //		var shortName,province,city,district,streets,street,reAd;
        ////		debugger
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
        //			$('#'+'viewSO-address').val(ad.addressLabel == undefined ? reAd == undefined ? '' : reAd : ad.addressLabel);
        //		}else{
        //			$('#'+'viewSO-address').val('')	
        //		}
        //		$('#'+'viewSO-address').attr('data-id',data.ocrSaleOrderAddress[0] ===undefined ? '' : data.ocrSaleOrderAddress[0].id);

        if(data.deliveryAddress==undefined){
        	var abc=data.addressList;
        	var ress='';
        	for(var i=0;i<abc.length;i++){
        		ress+=abc[i].description+',';
        	}
        	$('#' + 'viewSO-address').val(ress.substring(0,ress.length-1));
        }else{
        	$('#' + 'viewSO-address').val(data.deliveryAddress);
        }

        var toggerColumns = {};
        //货品装箱
        $('#viewSO-box').attr('disabled', 'disabled');
        if (data.goodsBinning != 'N') {
            $('#viewSO-box')[0].checked = true;
            me.isbox = 'Y';
        } else {
        	$('#viewSO-box').parents('.priseInfoFlag').hide();
            toggerColumns.totalCartons = true;
            toggerColumns.eachCartons = true;
//            toggerColumns.extent = true;
//            toggerColumns.breadth = true;
//            toggerColumns.altitude = true;
        }

        console.log('.............' + _global_settings.acOwner.yardsFlag)

        //外箱尺寸
        $('#viewSO-productMeasFlag').attr('disabled', 'disabled');
        if (data.productMeasFlag) {
            $('#viewSO-productMeasFlag')[0].checked = true;
            if (data.cartonType == 'size' || data.cartonType == null) {
                toggerColumns.volume = true;
            } else {
                toggerColumns.extent = true;
                toggerColumns.breadth = true;
                toggerColumns.altitude = true;
            }
        } else {
        	$('#viewSO-productMeasFlag').parents('.priseInfoFlag').hide();
            toggerColumns.extent = true;
            toggerColumns.breadth = true;
            toggerColumns.altitude = true;
            toggerColumns.volume = true;
        }

        //细码
        //      var yardsFlag=_global_settings.acOwner.yardsFlag;
        if (data.yardsFlag) {
            toggerColumns.yards = false;
//            $('.priseInfoFlag').hide();
        }

        //单位
        var productunitFlag = data.productunitFlag;
        if (productunitFlag) {
            toggerColumns.unitRate = false;
//            $('.priseInfoFlag').hide();
        }

        //打印品名
        $('#viewSO-boxflag').attr('disabled', 'disabled');
        if (data.printOfGoodsFlag) {
            $('#viewSO-boxflag')[0].checked = true;
        } else {
            toggerColumns.printOfGoods = true;
            $('#viewSO-nameNoFlag').css({ 'cursor': 'not-allowed', 'background': '#e7e7e7' })
        }

        //税额
        $('#viewSO-tax').val(data.vat + '%');
        if (data.vat != 0) {
            $('#viewSOTaxLimit').css('display', '');
            $('#viewSO-taxLimit').val(money(data.vatAmt == undefined ? 0 : data.vatAmt));
        }

        $('#viewSO-orderMoney').val(money(data.totalAmt));

        $('#viewSO-preferMoney').val(money(data.cheapAmt));
        
        $('#viewSO-orderAlreadyDeliver').val(money(data.alreadyDeliverAmt));

        $('#viewSO-orderNoReceive').val(money(data.nopaidAmt));

        $('#viewSO-box').on('change', function() {

            var t = $(this);
            if (t.is(':checked')) {
                $('#viewSaleOrder_grid').boxSetting('show');
            } else {
                $('#viewSaleOrder_grid').boxSetting('hide');
            }
        })

        $('#viewSO-boxflag').on('change', function() {
            var t = $(this);
            if (t.is(':checked')) {
                $('#viewSaleOrder_grid').printOfGoodsFlag('show');
            } else {
                $('#viewSaleOrder_grid').printOfGoodsFlag('hide');
            }
        })

        $('#viewSO-productMeasFlag').on('change', function() {
            var t = $(this);
            if (t.is(':checked')) {
                $('#viewSaleOrder_grid').productMeasFlag('show');
            } else {
                $('#viewSaleOrder_grid').productMeasFlag('hide');
            }
        })

        $('#' + 'viewSO-remarkPrint').val(data.remarkPrint);


        //新版grid初始化
        getProductInUsePart(me.saleRowdata.soOwnerId, me.saleRowdata.userName, function(res) {
            //debugger
            var productSourceName = res;
            $('#viewSaleOrder_grid').easyGrid({
                columnSumEvent: function() {
                    var sum = $("#viewSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3', ['sum']);
                    sumAmt = sum.sum;
                },
                stop: me.stop,
                source: data.ocrSaleOrderDetail,
                order:data,
                toggerColumns: toggerColumns,
                sourceType: 'salePrice',
                productSourceName: productSourceName,
                gridSettings: {
                    editable: false,
                    delBtn: false
                },
                ownerSettings: {
                    soOwnerId: me.saleRowdata.soOwnerId,
                    userName: me.saleRowdata.userName,
                    elementId: null
                },
            });
        })
    }

    /**
     * 初始化收款记录
     */
    this.initReceiveDetails = function(receiveRecord) {
        var obj = {
            setOrderNoReceive: me.setOrderNoReceive,
            enterPriceInfo: me.enterPriceInfo,
            source: receiveRecord,
            orderMoney: $('#viewSO-orderMoney'),
            receiveMoney: $('#viewSO-orderReceive'),
            notReceiveMoney: $('#viewSO-orderNoReceive'),
            overReceiveMoney: $('#viewSO-orderOverReceive')
        }
        $('#viewSO-receiveRecordTable').zqwRecOrpayTable(obj);
    };

    this.initPay = function(data) {
        var obj = {
            setOrderNoReceive: me.setOrderNoReceive,
            enterPriceInfo: me.enterPriceInfo,
            type: 'salesorderbill',
            data: data,
            orderMoney: $('#viewSO-orderMoney'),
            orderReceive: $('#viewSO-orderReceive'),
            orderNoReceive: $('#viewSO-orderNoReceive'),
            orderOverReceive: $('#viewSO-orderOverReceive'),
            grid:'viewSaleOrder_grid'
        }
        $('#viewSO-receiveRecordTablex').easytableExamplex(obj);

    }

    this.getReceiveRecord = function(id) {
        Core.AjaxRequest({
            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/salesorderbill/' + id + '/' + me.saleRowdata.soOwnerId + '/' + me.saleRowdata.userName),
            type: 'GET',
            showMsg: false,
            //			async:false,
            callback: function(res) {
                me.initReceiveRecord(res);
            },
            failure: function(e) {}
        });
    }

};

var ViewSaleOrderBindModle = function(viewSOMgt) {

    var me = this;
    var random = viewSOMgt.random;

//    this.initEditParam = function() {
//        delete viewSOMgt.jsdata.orderPaidStatus;
//        delete viewSOMgt.jsdata.orderStatus;
//
//        if (viewSOMgt.data.clientPeople != undefined) {
//            viewSOMgt.jsdata.clientPeople.type = 'person';
//        }
//        Core.confirm({
//            message: '确定要转为销售单吗？',
//            confirmCallback: function() {
//                Core.AjaxRequest({
//                    url: viewSOMgt.url + '/update',
//                    type: 'PUT',
//                    params: viewSOMgt.jsdata,
//                    async: false,
//                    callback: function(res) {
//                        //						console.log('======='+res.id);
//                        saveMes(res.id);
//                        $.closeTab();
//
//                        //刷新额外费用
//                        ComboBoxSources.load('getOtherAmt');
//
//                        $.addTab({
//                            title: '销售单' + res.orderNumber,
//                            url: 'page/modules/biz/viewSaleOrder.html',
//                            pk: { orderId: viewSOMgt.orderId, random: new Date().getTime() },
//                            reload: true
//                        });
//                    }
//                });
//            }
//        })
//    }

    //保存消息
//    var saveMes = function(salesId) {
//        Core.AjaxRequest({
//            url: ctx + '/CXF/rs/informationLogs/save/' + salesId + '/sales',
//            type: 'GET',
//            showMsg: false,
//            callback: function() {
//
//            }
//        })
//    }

    this.bind = function() {

            /**
             * 客服驳回
             * 只有客户通过和审核、复核通过不可驳回，其他状态都可以
             * 驳回字段目前只限定后台给定特定字段。
             */

            $('#viewSO-rejectBtn').off('click').on('click', function() {
            	setPara();
                rejectOcrOrder(viewSOMgt.saleRowdata.uuid);
            });

            //编辑销售单
            $('#viewSO-editBtn').off('click').on('click', function() {
            	setPara();
                $.closeTab();
                $.addTab({
                    title: '编辑销售单',
                    url: 'page/modules/biz/editSaleOrder.html',
                    pk: { data: viewSOMgt.saleRowdata, },
                    reload: true
                });
            })

            //审批通过和复审通过
            $('#viewSO-checkPass').off('click').on('click', function(e) {
            	setPara();
                submitOrderCheck($(this).attr('data-status'));
            })

            //审批不通过和复核不通过
            $('#saveOcrCheckSubmit').off('click').on('click', function(e) {
            	setPara();
                submitOrderCheck($(this).attr('data-status'));
            })

            function submitOrderCheck(type) {
                var obj = {};
                obj.remark = $('#ocrCheckSubmitRemark').val();
                obj.orderApprovalStatus = type;
                obj.id = viewSOMgt.saleRowdata.uuid;

                if (type == 'checkFailed' || type == 'checkAgainFailed') {
                    if ($('#ocrCheckSubmitRemark').val() === '') {
                        Core.alert({
                            message: '审批不通过意见不能为空'
                        });
                        return false;
                    }
                }

                Core.AjaxRequest({
                    url: _global_settings.service.url + '/overview/orderSalesLogs',
                    type: 'POST',
                    params: obj,
//                    async: false,
//                    showMsg: false,
                    callback: function(res) {
                        $('#ocrCheckSubmitWindow').jqxWindow('close');
                        $.closeTab();
                        $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
                        $('#placeOrders').jqxGrid('updatebounddata', 'cells');
//                        $('#operationLog').jqxGrid('updatebounddata', 'cells');
                    },
                    failure: function(e) {},

                });
            }
        }
        //收款记录是否为空
//    var checkRec = function(res) {
//        var bool = false;
//        if (res.length == 0)
//            bool = true;
//        return bool;
//    }
//
//    //弹出提示
//    var alertMes = function() {
//            Core.alert({
//                message: '操作成功',
//                callback: function() {
//                    $('#viewSO-receiveAndSave').text('收款');
//
//                    $('#viewSO-receiveTable').remove();
//                    initRec(true);
//
//                    $('#viewSO-receiveTablex').remove();
//                    openRec(true);
//                }
//            });
//            //		return false;
//        }
        //保存收款记录
//    var submitReceive = function(id) {
//        var obj = {};
//        obj.salesOrderDeal = { id: id, salesOrder: { id: parseInt(viewSOMgt.orderId) } };
//        obj.ownerId = _global_settings.owner.userinfoid;
//
//        var receiveDetail = getReceiveDetail(); //收款记录
//
//        if (!judgeRec()) {
//            Core.alert({ message: '编辑的收款金额不能为0！' });
//            return false;
//        }
//
//        if (receiveDetail.all.length == 0) {
//            alertMes();
//        } else {
//            if (receiveDetail.put.length != 0) {
//                saveRec(receiveDetail.put, 'PUT');
//            }
//            if (receiveDetail.post.length != 0) {
//                saveRec(receiveDetail.post, 'POST');
//            }
//        }
//        $('#viewSO-receiveTable').remove();
//        initRec();
//
//        $('#viewSO-receiveTablex').remove();
//        openRec();
//
//        $('#viewSO-receiveAndSave').text('收款');
//
//    }

//    //收款
//    var openRec = function(bool) {
//        //有收款记录，收款记录被全部删除了
//        if (bool) return false;
//
//        var table =
//            '<div class="row" id="viewSO-receiveTablex' + '" style="display:none">' +
//            '<div class="bootstrap-table">' +
//            '<div class="fixed-table-toolbar"></div>' +
//            '<div class="fixed-table-container" style="padding-bottom: 0px;">' +
//            '<div class="fixed-table-header" style="display: none;">' +
//            '<table></table>' +
//            '</div>' +
//            '<div class="fixed-table-body">' +
//            '<table id="viewSO-receiveRecordTablex' + '" class="table user-table table-striped m-b-0 table-hover" data-toggle="table" style="cursor: pointer;">' +
//
//            '<thead id="viewSO-receiveRecordTheadx' + '">' +
//            '<th class="border-rightlast"><span class="colorspan">删除</span></th>' +
//            '<th class="border-right"><span class="colorspan">收款日期</span></th>' +
//            '<th class="border-right"><span class="colorspan">收款金额</span></th>' +
//            '<th class="border-right"><span class="colorspan">收款方式</span></th>' +
//            '<th class="border-right"><span class="colorspan">备注</span></th>' +
//            '</thead>' +
//            '<tbody style="border-bottom:1px solid #EEEEEE" class="bg-white" id="viewSO-receiveRecordTbodyx' + '">' +
//
//            '</tbody>' +
//            //								'<tfoot id="viewSO-receiveRecordTfootx'+'">'+
//            //									'<tr style="background:#F8F9F9;border-bottom:1px solid #CCCCCC">'+
//            //										'<td colspan="6" style="height:40px;"></td>'+
//            //									'</tr>'+
//            //								'</tfoot>'+
//            '</table>' +
//            '</div>' +
//            '</div>' +
//            '</div>' +
//            '<div class="clearfix" style="background-color: #FFFFFF"></div>' +
//            '</div>';
//
//        $('#tableReceiveCardBox').append(table);
//    }
//
//    //初始化收款记录
//    var initRec = function(bool) {
//        //有收款记录，收款记录被全部删除了
//        if (bool) return false;
//
//        var table =
//            '<div class="row" id="viewSO-receiveTable' + '" style="display:none">' +
//            '<div class="bootstrap-table">' +
//            '<div class="fixed-table-toolbar"></div>' +
//            '<div class="fixed-table-container" style="padding-bottom: 0px;">' +
//            '<div class="fixed-table-header" style="display: none;">' +
//            '<table></table>' +
//            '</div>' +
//            '<div class="fixed-table-body">' +
//            '<table id="viewSO-receiveRecordTable' + '" class="table user-table table-striped m-b-0 table-hover" data-toggle="table" style="cursor: pointer;">' +
//
//            '<thead id="viewSO-receiveRecordThead' + '">' +
//            '<th class="border-right"><span class="colorspan">收款日期</span></th>' +
//            '<th class="border-right"><span class="colorspan">收款金额</span></th>' +
//            '<th class="border-right"><span class="colorspan">收款方式</span></th>' +
//            '<th class="border-right"><span class="colorspan">备注</span></th>' +
//            '</thead>' +
//            '<tbody style="border-bottom:1px solid #EEEEEE" class="bg-white" id="viewSO-receiveRecordTbody' + '">' +
//
//            '</tbody>' +
//            //								'<tfoot id="viewSO-receiveRecordTfoot'+'">'+
//            //									'<tr style="background:#F8F9F9;border-bottom:1px solid #CCCCCC">'+
//            //										'<td colspan="6" style="height:40px;"></td>'+
//            //									'</tr>'+
//            //								'</tfoot>'+
//            '</table>' +
//            '</div>' +
//            '</div>' +
//            '</div>' +
//            '<div class="clearfix" style="background-color: #FFFFFF"></div>' +
//            '</div>';
//        //		debugger
//        $('#tableReceiveCardBox').append(table);
//
//        //getReceiveRecord(viewSOMgt.data.salesOrderDeal.id);
//    }
//
//    //获取付款记录明细
//    var getReceiveDetail = function() {
//        //		debugger
//        var arr = {},
//            tr = $('#viewSO-receiveRecordTbodyx').children();
//        arr.put = [], arr.post = [], arr.all = []
//        $.each(tr, function(i) {
//            var val = tr.eq(i).find('.receiveMoney').val();
//            var value = tr.eq(i).find('.receiveMoney').data('value');
//            var payway = tr.eq(i).find('.receiveWay').val();
//            var dataPayWay = tr.eq(i).find('.receiveWay').data('value');
//            var remark = tr.eq(i).find('.remark').val();
//            var dataRemark = tr.eq(i).find('.remark').data('value');
//            var time = tr.eq(i).find('.time').val();
//            var dataTime = tr.eq(i).find('.time').data('value');
//            if (val != 0 && val != '') {
//                var obj = {};
//                obj.id = tr.eq(i).find('.recId').text();
//                obj.createDate = tr.eq(i).find('.time').val();
//                obj.amount = val;
//                obj.payWay = tr.eq(i).find('.receiveWay').val();
//                obj.remark = tr.eq(i).find('.remark').val();
//                if (obj.id == '') {
//                    arr.post.push(obj);
//                }
//
//                if ((val != value && value != undefined) || (payway != dataPayWay && dataPayWay != undefined) ||
//                    (remark != dataRemark && dataRemark != undefined) || (time != dataTime && dataTime != undefined)) {
//                    arr.put.push(obj);
//                }
//                arr.all.push(obj);
//            }
//            if (val == 0) {
//                var obj = {};
//                obj.id = tr.eq(i).find('.recId').text();
//                obj.createDate = tr.eq(i).find('.time').val();
//                obj.amount = val;
//                obj.payWay = tr.eq(i).find('.receiveWay').val();
//                obj.remark = tr.eq(i).find('.remark').val();
//                if (obj.id != '') {
//                    arr.all.push(obj);
//                }
//            }
//        });
//        return arr;
//    }

    this.unbindAll = function() {}
}