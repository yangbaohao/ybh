/*!
 *  Author:dingwenyuan
 *  email:492055811@qq.com
 */
/**
 * 可编辑Grid
 * 
 * @param [Object]
 *            settings.source 表格数据源
 *            
 * @param string
 *            settings.sourceType 采购costPrice 销售salePrice
 *            
 * @param [Object]
 *            settings.gridSettings Grid设置
 *            settings.gridSettings={
 *            	editable: true,
 *            	delBtn:true
 *            };
 *
 * @param [Object]
 *            settings.columns 对应列参数设置
 *            [
 *	             {text: '种类',datafield: 'type',columntype: 'combobox',pk:true,jqxSettings:{
 *	            	 source:'producttype',
 *	            	 displayMember: "typeValue", 
 *	 				 valueMember: "typeValue",
 *	             }},	        
 *	             {text: '产品',datafield: 'id',columntype: 'combobox',pk:true,jqxSettings:{
 *	            	 selectedIndex: 0,
 *	            	 source:productSourceName,
 *	            	 displayMember: "name", 
 *	 				 valueMember: "id",
 *	             },displayfield:'name',pk:true},	
 *	             {text: 'SKU码',datafield: 'sku',columntype: 'combobox',jqxSettings:{
 *	            	 source:'sku',
 *	            	 displayMember: "typeValue", 
 *	 				 valueMember: "typeValue",
 *	             }},	
 *	             {text: '规格型号',datafield: 'prodSpecId'},
 *	             {text: '销售数量',datafield: 'price1',cellsalign: 'right',pk:true,columntype: 'numberinput',jqxSettings:{
 *	            	 decimalDigits: 2
 *	             },aggregates: ["sum"],aggregatesrenderer:true},
 *	             {text: '单价',datafield: 'price2',pk:true,cellsalign: 'right',cellsformat: 'c2',columntype: 'numberinput',jqxSettings:{
 *	            	 decimalDigits: 2
 *	             },aggregates: ["sum"],aggregatesrenderer:true},
 *	             {text: '金额',datafield: 'price3',pk:true,cellsalign: 'right',cellsformat: 'c2',columntype: 'numberinput',jqxSettings:{
 *	            	 decimalDigits: 2
 *	             },aggregates: ["sum"],aggregatesrenderer:true,editable:false},
 *	             {text: '送货数量',datafield: 'price4',cellsalign: 'right',pk:true}
 *	            ]
 *            
 * @param {Object}
 *            settings.aggregates 总计列对应关系
 *            settings.aggregates=[{type:'Multiply',datafield:['price1','price2','price3']}];
 *            
 * @param function
 *            settings.columnSumEvent cell数据改变事件
 *            settings.columnSumEvent=function(){
 *				var sum=$("#addSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3',['sum']);
 *			}
 * @param function
 *            settings.delEvent row删除事件
 *            settings.delEvent=function(){
 *				var sum=$("#addSaleOrder_grid").jqxGrid('getcolumnaggregateddata', 'price3',['sum']);
 *			}
 *            
 */
$.fn.easyGrid = function(settings) {;
    window.modallist = {};
    window.prodmodallist = function(name, type, obj, oldvalue, imgId) {
        if (window.modallist[name] == null) {
            window.modallist[name] = {}
        }
        if (window.modallist[name][type] == null) {
            window.modallist[name][type] = []
        }
        var arr = window.modallist[name][type];
        var update = false
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].name == oldvalue) {
                arr[i] = obj;
                update = true;
                break;
            }
            if (arr[i].name == imgId) {
                arr[i] = obj;
                update = true;
                break;
            }
        }
        if (!update) {
            arr.push(obj);
        }
    }
    var settings = settings === undefined ? {} : settings;
    settings.ownerSettings.elementId = $(this)[0].id;
    console.log(settings);
    $(this).attr({
        'data-id': settings.ownerSettings.elementId,
        'data-soOwnerId': settings.ownerSettings.soOwnerId,
        'data-name': settings.ownerSettings.userName
    });

    var gridSettings = $.extend(true, { editable: true, delBtn: true }, settings.gridSettings);

    var xsweight = 'kg';
    if (_global_settings.acOwner.productKgFlag) { //如果商户开启重量
        Core.AjaxRequest({
            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/prodUnit/' + settings.ownerSettings.soOwnerId + '/' + settings.ownerSettings.userName),
            type: 'get',
            showMsg: false,
            // async: false,
            callback: function(res) {
                xsweight = res[0].descr == undefined ? 'kg' : res[0].descr;
                //				console.log(res);
            }
        });
    }

    var singleUnit = []; //单个单位
    if (_global_settings.acOwner.productunitFlag) { //如果商户开启单位
        Core.AjaxRequest({
            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/singleUnit/' + settings.ownerSettings.soOwnerId + '/' + settings.ownerSettings.userName),
            type: 'get',
            showMsg: false,
            // async: false,
            callback: function(res) {
                singleUnit = res;
                //				console.log(res);
            }
        });
    }

    var defaultrow = function() {
        return {
            "name": "",
            "id": null,
            "printOfGoods": "",
            "photoId": "",
            //"sku": "",
            "salesQty": "",
            "purchasedQty": "",
            "spec": "",
            "descr": "",
            "color": "",
            "prodColourDescr": "",
            "weight": "",
            "totalCartons": "",
            "eachCartons": "",
            "qty": "",
            "priceBefore": "",
            "price3": "",
            "price3_server": "",
            "extent": "",
            "breadth": "",
            "altitude": "",
            "tj": "",
            "deliveiedQty": "",
            "deliveryQtyNow": "",
            "remark": "",
            "dzid": "",
            "rowweight": "",
            "ysprice": "",
            "dsprice": "",
            'volume': "", //体积
            'yards': '', //细码
            "unit": "",
            "unitRate": "",
            "basicUnit": "",
            "unitsFlag": "",
            "unitRateqty": "",
            "deliveryQtyAll": "",
            "inventoryReducere": "",
            "amountFormula": "",
            "inventoryQtyFormula": "",
        }
    };

    var source = [defaultrow()];

    var sourceType = settings.sourceType == null ? 'salePrice' : settings.sourceType;

    var iscopy = settings.iscopy == null ? false : settings.iscopy;

    var easyGridType = settings.easyGridType;

    var modalNameMap = {
        'addSaleOrder_grid': 'addSOProduct',
        'editSaleOrder_grid': 'editSOProduct',
        'addPurchaseOrder_grid': 'addPOProduct',
        'editPurchaseOrder_grid': 'editPOProduct'
    }
    var modalName = modalNameMap[$(this).attr('id')];

    var saleorbuy = '';
    var addoredit = '';

    var columntypeQtyText = '';
    var columntypedeliveiedQtyText = '';
    var columntypedeliveryQtyNowText = '';
    var qtyedit = false;
    var qtyNowVisible = true;
    if (sourceType == 'costPrice') {
        saleorbuy = 'buy';
        columntypeQtyText = '采购';
        if (modalName != null && modalName.indexOf('edit') > -1) {
            addoredit = 'edit';
            columntypedeliveiedQtyText = '已收数量';
            columntypedeliveryQtyNowText = '本次收货';
            qtyNowVisible = false;
        } else {
            addoredit = 'add';
            columntypedeliveiedQtyText = '收货数量';
        }
        /*2017-05-08 注释，采购单也有装箱等*/
        //qtyedit=true;
    } else {
        saleorbuy = 'sale';
        columntypeQtyText = '销售';
        if (modalName != null && modalName.indexOf('edit') > -1) {
            addoredit = 'edit';
            columntypedeliveiedQtyText = '送货数量';
            columntypedeliveryQtyNowText = '本次送货';
            qtyNowVisible = false;
        } else {
            addoredit = 'add';
            columntypedeliveiedQtyText = '送货数量';
        }
    }

    var addbtn = '',
        addspecbtn = '',
        addunitbtn = '';
    var sendStartbtn = '',
        sendRunbtn = '',
        style = "";
    var productSourceName = null;
    if (gridSettings.delBtn) {
        //添加单位按钮
        if (sourceType == 'costPrice' || sourceType == 'salePrice') {
            addunitbtn = '<div class="col-sm-1 p-0 p-l-10 p-t-10 littleAdd addUnit" style="top: -4px;left: 20px;">' +
                '<a href="javascript:void(0)" data="productunit" >' +
                '<i class="icon-plus"></i></a></div>'
        }
        if (_global_settings.acOwner.productNumberFlag == 'true') {
            //productSourceName='productsInUse_Part';
            productSourceName = settings.productSourceName.productsInUse_Part;
        } else {
            //productSourceName='productsInUse';
            productSourceName = settings.productSourceName.productsInUse;
        }

        if (settings.stop) {

        } else {
            style = "cursor: pointer;text-decoration: underline;color:#00B7EF;margin-top: -2px;";
            sendStartbtn = '<a class="color-1193C5 hoverspan md-local-shipping " style="color:#00B7EF;margin:0;" title="一键' + columntypedeliveiedQtyText[0] + '货"></a>';
            sendRunbtn = '<a class="color-1193C5 hoverspan md-local-shipping " style="color:#00B7EF;margin:0;" title="一键' + columntypedeliveiedQtyText[1] + '货"></a>'
        }

        addbtn = "<i style='vertical-align: middle;padding-left:5px;' data-toggle='modal' data-target='#" + modalName + "' class='icon-plus addbtn' data-btn='biz:prod:create'>";
        addspecbtn = "<i style='vertical-align: middle;padding-left:5px;' class='icon-plus addbtn addspecbtn' data-btn='biz:prod:create'>";
    } else {
        if (_global_settings.acOwner.productNumberFlag == 'true') {
            productSourceName = settings.productSourceName.product_Part;
        } else {
            //productSourceName='productsInUse';
            productSourceName = settings.productSourceName.product;
        }

    }

    var needRefresh = false;
    if (settings.source !== undefined) {
        if (settings.source.length == 0) {
            source = [defaultrow()];
        } else {
            source = getDataDirty(settings.source);
            if (1 == 2 && settings.salesId) {
                Core.AjaxRequest({
                    type: "GET",
                    showMsg: false,
                    async: false,
                    url: ctx + '/CXF/rs/order/orderConvert/' + settings.salesId,
                    callback: function(res) {
                        for (var i in res) {
                            for (var j = 0; j < source.length; j++) {
                                if (source[j].sequence == i) {
                                    source[j].qty = res[i];
                                }
                            }
                        }
                    },
                    failure: function(res) {
                        return ele;
                    }
                });
            }
            if (gridSettings.delBtn || iscopy) {
                source.push(defaultrow());
            }
        }
        needRefresh = true;
    }
    var table = $(this);

    var columnsheight = 20;

    settings.columns = [

        { text: '种类  ', datafield: 'type', hidden: true },
        {
            text: "产品" /*+addbtn*/ + '<div id="' + table.attr('id') + 'id" style="float:right;color:cornflowerblue;"></div>',
            datafield: 'productName',
            columntype: 'combobox',
            pk: true,
            jqxSettings: {
                selectedIndex: 0,
                source: productSourceName,
                displayMember: "_name",
                valueMember: "productName",
            },
            displayfield: 'productName',
            pk: true,
            width: '14%',
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = table.jqxGrid('getcolumnaggregateddata', 'inventoryReducere', ['sum']).sum;
                // if (gridSettings.dellist) {
                //     sum = getgridcheckedsum('price_long', table);
                // }
                var txt = money(sum, 2, true);
                var html = ''
                if (txt != 0) {
                    html = '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库存减少:' +
                        txt + '</div>';
                }
                return html;
            },
            enabletooltips: !gridSettings.delBtn /*,cellbeginedit:cellbeginedit,*/
        },
        { text: '客户货号', datafield: 'printOfGoods' },
        {
            text: '图片',
            datafield: 'photoId',
            editable: false,
            width: '60px',
            cellsrenderer: function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
                var src = '';
                var ids = '';
                if (rowdata.photoId != undefined && rowdata.photoId != '') {
                    //产品有图片
                    if (rowdata.photoAddId != undefined && rowdata.photoAddId != '') {
                        //颜色图片覆盖掉产品图片情况
                        ids = rowdata.photoAddId;
                    } else {
                        //颜色图片没有覆盖掉情况
                        ids = rowdata.photoId;
                    }
                } else {
                    //产品没有图片
                    if (rowdata.photoAddId != undefined && rowdata.photoAddId != '') {
                        //颜色图片覆盖掉产品图片情况
                        ids = rowdata.photoAddId;
                    } else {
                        //颜色图片没有覆盖掉情况
                        ids = '';
                    }
                }

                if (ids != null && ids != '') {
                    src = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + ids + '/' + settings.ownerSettings.soOwnerId + '/' + settings.ownerSettings.userName);
                }
                if (src != '') {
                    src = "<img title='点击查看大图' width='48' height='32' src='" + src + "'>";
                } else {
                    src = '<input type="button" style="opacity: 0.99; position: absolute; top: 0%; left: 0%; padding: 0px; margin-top: 2px; margin-left: 2px;' +
                        ' width: 96%; height: 36px;" value="请选择" role="button" class="jqx-rc-all jqx-button jqx-fill-state-normal addPhoto">';
                }
                var img = "<div style='background: white;text-align:center;margin: 3px;'>" +
                    src + "</div>";
                return img;
            }
        },

        { text: '货号   ', datafield: 'sku', hidden: true },
        {
            text: '规格型号' /*+addspecbtn*/ ,
            datafield: 'spec',
            editable: false,
            columntype: 'button',
            resizable: false,
            width: '100px',
            cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties) {
                if (value == '' || value == null) {
                    return "请选择";
                }
                return value;
            },
            buttonclick: function(row) {
                //$(window).resize();
                timeOut(function() {
                    timeOut(function() {
                        $('#comboboxeditor' + table.attr('id') + 'id').css('display', 'none');
                        specModal2(table.attr('id'), null, sourceType, settings.productSourceName);
                    }, 20)
                }, 0)
                return true;
            },
            displayfield: 'spec'
        },
        {
            text: '颜色',
            datafield: 'color',
            columntype: 'button',
            editable: false,
            resizable: false,
            width: '60px',
            cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties) {
                if (value == '' || value == null) {
                    return "请选择";
                }
                return value;
            },
            buttonclick: function(row) {
                //$(window).resize(); 
                timeOut(function() {
                    timeOut(function() {
                        $('#comboboxeditor' + table.attr('id') + 'id').css('display', 'none');
                        colorModal(table.attr('id'), null, sourceType, settings.productSourceName);
                    }, 20)
                }, 0)
                return true;
            },
            displayfield: 'color'
        },
        {
            text: '重量',
            datafield: 'weight',
            cellsalign: 'right' /*,cellsformat: 'f2'*/ ,
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = table.jqxGrid('getcolumnaggregateddata', 'rowweight', ['sum']).sum;
                //	            	 console.log(xsweight);
                if (gridSettings.dellist) {
                    sum = getgridcheckedsum('rowweight', table);
                }
                var txt = '';
                if (xsweight == 'g') {
                    sum = money(sum / 1000, 4, true);
                } else {
                    sum = money(sum, 4, true);
                }
                txt = sum + 'kg';
                return '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">重量:' +
                    txt + '</div>';
            },
            width: '5%'
        },
        {
            text: '细码',
            datafield: 'yards',
            editable: false,
            hidden: true,
            resizable: true,
            width: '15%',
            cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties) {
                if (value == '' || value == null) {
                    return '<input type="button" style="opacity: 0.99; position: absolute; top: 0%; left: 0%; padding: 0px; margin-top: 2px; margin-left: 2px;' +
                        ' width: 98%; height: 36px;" value="请选择" role="button" class="jqx-rc-all jqx-button jqx-fill-state-normal addyards">';
                }
                return '<input type="button" style="opacity: 0.99; position: absolute; top: 0%; left: 0%; padding: 0px; margin-top: 2px; margin-left: 2px;' +
                    ' width: 98%; height: 36px;" value="' + value + '" role="button" class="jqx-rc-all jqx-button jqx-fill-state-normal addyards">';
            },
            aggregates: [{
                '细码合计': function(aggregatedValue, currentValue, columnfield, row) {
                    var yards = row.yards == null ? '' : row.yards.toString();
                    if (yards != null) {
                        var sum = 0;
                        if (!gridSettings.dellist || row.waitdel == true) {
                            $.each(yards.split(','), function(i, v) {
                                if (v > 0)
                                    sum += 1;
                            })
                        }
                        return money(aggregatedValue + sum, 4, true);
                    }
                    return aggregatedValue;
                },
                '损耗数量': function(aggregatedValue, currentValue, columnfield, row) {
                    var yards = row.yards == null ? '' : row.yards.toString();
                    var sum = 0;
                    if (yards != null) {
                        if (!gridSettings.dellist || row.waitdel == true) {
                            $.each(yards.split(','), function(i, v) {
                                if (v < 0)
                                    sum += parseFloat(v) * row.unitRate;
                            })
                        }
                        return money(aggregatedValue + sum, 4, true);
                    }
                    return aggregatedValue;
                }
            }],
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = aggregates;
                var text = '';
                $.each(aggregates, function(i, v) {
                    if (v != 0) {
                        text += i + ':' + Math.abs(v) + '&nbsp;&nbsp;&nbsp;'
                    }
                });

                //var txt = money(sum, 2, true);
                return '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    text + '</div>';
            }
        },
        {
            text: /*columntypeQtyText+*/ '箱数',
            datafield: 'totalCartons',
            width: '5%',
            cellsalign: 'right' /*,cellsformat: 'n'*/ ,
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = table.jqxGrid('getcolumnaggregateddata', 'totalCartons', ['sum']).sum;
                if (gridSettings.dellist) {
                    sum = getgridcheckedsum('totalCartons', table);
                }
                var txt = money(sum, 4, true);
                return '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总箱数:' +
                    txt + '</div>';
            }
        },
        { text: '每箱数量', datafield: 'eachCartons', width: '6%', cellsalign: 'right' },
        {
            text: /*columntypeQtyText+*/ '总数量',
            datafield: 'qty',
            width: '5%',
            cellsalign: 'right',
            pk: true,
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = table.jqxGrid('getcolumnaggregateddata', 'unitRateqty', ['sum']).sum;
                var txt = money(sum, 4, true) == 'NaN' ? '0.00' : money(sum, 4, true);
                return '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;总数量:' +
                    txt + '</div>';
            },
            editable: qtyedit
        },
        {
            text: '单位' + addunitbtn,
            cellsalign: 'left',
            columntype: 'template',
            hidden: true,
            datafield: 'unitRate',
            displayfield: 'unit',
            width: '5%',
            jqxSettings: {
                // type: 'vendor',
                // source: 'productunitSingle',
                displayMember: "unitName",
                valueMember: "unitName",
                width: '5%',
            },
            initeditor: function(row, cellvalue, editor, celltext, pressedChar) {
                var rowdata = table.jqxGrid('getrowdata', row);
                var tableId = table.attr('id');
                var ownerId = $('#' + tableId).data().soownerid;
                var name = $('#' + tableId).data().name;
                var productName = rowdata.productName;
                if (productName == null || productName == '') {
                    editor.comboBox({
                        //	                        	 width: '5%',
                        width: 'auto',
                        source: [],
                        displayMember: "unitName",
                        valueMember: "unitName",
                    })
                } else {
                    var prod = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product, 'name', productName);
                    //		                     var prod = ComboBoxSources.getInfoMapByKey('product', 'id', prodId);
                    if (prod.multiUnitFlag) {
                        var prodContainerList = $.extend(true, [], prod.prodContainerList);
                        $.each(prodContainerList, function(i, v) {
                            if (i != 0) {
                                v._unitName = v.unitName;
                                v.unitName = v.unitName + '(' + v.rate + prodContainerList[0].unitName + ')';
                            }
                        })
                        editor.comboBox({
                            //		                        	 width: '5%',
                            width: 'auto',
                            source: prodContainerList,
                            displayMember: "unitName",
                            valueMember: "unitName",
                        })
                    } else {
                        var abc = unitArr;
                        //		                         var source = prod.prodContainerList==undefined?singleUnit:prod.prodContainerList;
                        //循环去除重复
                        //		                    	 for(var i in abc){
                        //	                    			 for(var j in singleUnit){
                        //	                    				 if(abc.length>0){
                        //			                    			 if(abc[i].unitName==singleUnit[j].unitName){
                        //			                    				 abc.splice(i,1);
                        //			                    			 }
                        //			                    		 }
                        //		                    		 }
                        //		                    	 }

                        var source = singleUnit.concat(abc);
                        editor.comboBox({
                            //		                        	 width: '5%',
                            width: 'auto',
                            source: source,
                            displayMember: "unitName",
                            valueMember: "unitName",
                        })
                    }
                    //		                     editor.jqxComboBox('clearSelection');
                    editor.val(rowdata.unit);
                }
                console.log(unitArr);
                //	                     var pro = null;
                //	                 	 getProductInUsePart(ownerId, name, function(res) {
                //	                 		 pro = res.product;
                //	                 	 });

                // editor.trigger('value', cellvalue);
                timeOut(function() {
                    editor.jqxComboBox('open');
                    editor.find('input').eq(0).focus();
                    editor.triggerHandler('keyup');
                }, 0)
            },
            geteditorvalue: function(row, cellvalue, editor) {
                // return the editor's value.
                var cell = editor.jqxComboBox('getSelectedItem');
                if (cell != null) {
                    return {
                        label: cell.label,
                        value: cell.originalItem.rate
                    }
                }
                return {
                    label: '',
                    value: '1'
                };
            },

        },
        { text: '已采购', datafield: 'purchasedQty', editable: false, pk: true, hidden: true, cellsalign: 'right', },
        { text: '销售数量', datafield: 'salesQty', editable: false, pk: true, hidden: true, cellsalign: 'right', },
        { text: '单价  ', datafield: 'priceBefore', pk: true, cellsalign: 'right', },
        {
            text: '金额    ',
            datafield: 'price3_server',
            pk: true,
            cellsalign: 'right',
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = table.jqxGrid('getcolumnaggregateddata', 'price3', ['sum']).sum;
                if (gridSettings.dellist) {
                    sum = getgridcheckedsum('price3', table);
                }
                var txt = money(sum) === 'NaN' ? '0.00' : money(sum);
                return '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金额:' +
                    txt + '</div>';
            },
            editable: false
        },
        { text: '长', columngroup: '外箱尺寸', width: '4%', datafield: 'extent', cellsalign: 'right' /*,cellsformat: 'f2'*/ },
        {
            text: '宽',
            columngroup: '外箱尺寸',
            width: '4%',
            datafield: 'breadth',
            cellsalign: 'right',
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = table.jqxGrid('getcolumnaggregateddata', 'tj', ['sum']).sum / 1000000;
                if (gridSettings.dellist) {
                    sum = getgridcheckedsum('tj', table) / 1000000;
                }
                var txt = money(sum, 4, true) == 0 ? '<0.0001' : money(sum, 4, true);
                return '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;体积:' +
                    txt + 'm³</div>';
            } /*,cellsformat: 'f2'*/
        },
        { text: '高', columngroup: '外箱尺寸', width: '4%', datafield: 'altitude', cellsalign: 'right' },
        {
            text: '体积',
            columngroup: '外箱尺寸',
            hidden: true,
            datafield: 'tj',
            cellsalign: 'right',
            /*cellsformat: 'f2',*/
            aggregates: ["sum"],
            aggregatesrenderer: true,
            editable: false
        },
        {
            text: '外箱尺寸(m³)',
            datafield: 'volume',
            cellsalign: 'right',
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
                //	                     var sum = table.jqxGrid('getcolumnaggregateddata', 'tj', ['sum']).sum;
                var sum = table.jqxGrid('getcolumnaggregateddata', 'volume', ['sum']).sum;
                if (gridSettings.dellist) {
                    sum = getgridcheckedsum('tj', table);
                }
                var txt = money(sum, 2, true) == 0 ? '<0.01' : money(sum, 2, true);
                return '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;体积:' +
                    txt + 'm³</div>';
            }
        },
        {
            text: '<div class="sendStart " title="' + (qtyNowVisible == true ? '一键' + columntypedeliveiedQtyText[0] + "货" : "") + '" style="' + (qtyNowVisible == true ? style : "") + '">' + columntypedeliveiedQtyText + sendStartbtn + '</div>',
            width: '7%',
            datafield: 'deliveryQtyNow',
            cellsalign: 'right',
            pk: true,
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = table.jqxGrid('getcolumnaggregateddata', 'deliveryQtyAll', ['sum']).sum;
                if (gridSettings.dellist) {
                    sum = getgridcheckedsum('deliveryQtyAll', table);
                }
                var txt = money(sum, 4, true);
                return '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">' +
                    columntypedeliveiedQtyText + ':' +
                    txt + '</div>';
            },
        },
        //	             {text: '<div class="sendRun" title="一键'+columntypedeliveiedQtyText[1]+'货" style="'+style+'">'+columntypedeliveryQtyNowText+sendRunbtn+'</div>'
        //	            	 ,hidden:qtyNowVisible, width: '7%',datafield: 'deliveiedQty',cellsalign: 'right',pk:true
        //	            	 ,aggregates: ["sum"],aggregatesrenderer:true},
        { text: '备注      ', datafield: 'remark' },
        { text: '单子id', datafield: 'dzid', hidden: true, cellsformat: 'n', },
        {
            text: '总重量',
            datafield: 'rowweight',
            hidden: true,
            aggregates: [{
                "sum": function(aggregatedValue, currentValue, datafield, rowdata) {
                    //
                    if (rowdata.waitdel) {
                        return aggregatedValue + currentValue;
                    }

                    return aggregatedValue;
                }
            }]
        },
        { text: '主单位', datafield: 'basicUnit', hidden: true },
        { text: '是否开启多单位', datafield: 'unitsFlag', hidden: true },
        { text: '单位数量', datafield: 'unitRateqty', hidden: true },
        { text: '送货总数量', datafield: 'deliveryQtyAll', hidden: true },
        { text: '后台总金额', datafield: 'price3', hidden: true },
        { text: '已收送货总金额', datafield: 'ysprice', hidden: true, aggregates: ["sum"] },
        { text: '待收送货总金额', datafield: 'dsprice', hidden: true, aggregates: ["sum"] },
        { text: '金额公式', datafield: 'amountFormula', hidden: true },
        { text: '库存数量公式', datafield: 'inventoryQtyFormula', hidden: true },
        { text: 'inventoryReducere', datafield: 'inventoryReducere', hidden: true, aggregates: ["sum"] },
    ];

    settings.aggregates = [{ type: 'Multiply', datafield: ['totalCartons', 'eachCartons', 'qty'] },
        { type: 'Multiply', datafield: ['qty', 'priceBefore', 'price3_server'] },
        { type: 'Multiply', datafield: ['deliveryQtyNow', 'priceBefore', 'ysprice'] },
        { type: 'Multiply', datafield: ['deliveiedQty', 'priceBefore', 'dsprice'] },
        { type: 'Multiply', datafield: ['qty', 'weight', 'rowweight'] },
        { type: 'Multiply', datafield: ['rowweight', 'unitRate', 'rowweight'] },
        { type: 'Multiply', datafield: ['deliveryQtyNow', 'unitRate', 'deliveryQtyAll'] },
        { type: 'Multiply', datafield: ['qty', 'unitRate', 'unitRateqty'] },
        { type: 'Multiply', datafield: ['totalCartons', 'extent', 'breadth', 'altitude', 'tj'] }
    ];

    if (_global_settings.acOwner.cartonType == 'volume') {
        settings.aggregates = [
            { type: 'Multiply', datafield: ['totalCartons', 'eachCartons', 'qty'] },
            { type: 'Multiply', datafield: ['qty', 'priceBefore', 'price3_server'] },
            { type: 'Multiply', datafield: ['deliveiedQty', 'priceBefore', 'ysprice'] },
            { type: 'Multiply', datafield: ['deliveryQtyNow', 'priceBefore', 'dsprice'] },
            { type: 'Multiply', datafield: ['qty', 'weight', 'rowweight'] },
            { type: 'Multiply', datafield: ['rowweight', 'unitRate', 'rowweight'] },
            { type: 'Multiply', datafield: ['deliveryQtyNow', 'unitRate', 'deliveryQtyAll'] },
            { type: 'Multiply', datafield: ['qty', 'unitRate', 'unitRateqty'] },
            { type: 'Multiply', datafield: ['totalCartons', 'volume', 'tj'] }
        ];
    }

    if (gridSettings.delBtn.toString() == 'false') {
        settings.columns[3] = {
                text: '图片',
                datafield: 'photoId',
                editable: false,
                width: '60px',
                cellsrenderer: function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
                    var src = '';
                    var ids = '';
                    if (rowdata.photoId != undefined && rowdata.photoId != '') {
                        //产品有图片
                        if (rowdata.photoAddId != undefined && rowdata.photoAddId != '') {
                            //颜色图片覆盖掉产品图片情况
                            ids = rowdata.photoAddId;
                        } else {
                            //颜色图片没有覆盖掉情况
                            ids = rowdata.photoId;
                        }
                    } else {
                        //产品没有图片
                        if (rowdata.photoAddId != undefined && rowdata.photoAddId != '') {
                            //颜色图片覆盖掉产品图片情况
                            ids = rowdata.photoAddId;
                        } else {
                            //颜色图片没有覆盖掉情况
                            ids = '';
                        }
                    }
                    if (ids != null && ids != '') {
                        src = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + ids + '/' + settings.ownerSettings.soOwnerId + '/' + settings.ownerSettings.userName);
                    }
                    if (src != '') {
                        src = "<img title='点击查看大图' width='48' height='32' src='" + src + "'>";
                    }
                    var img = "<div style='background: white;text-align:center;margin: 3px;'>" +
                        src + "</div>";
                    return img;
                }
            },

            settings.columns[5] = {
                text: '规格型号',
                columntype: 'combobox',
                jqxSettings: {
                    source: 'producttype',
                    displayMember: "spec",
                    valueMember: "spec",
                },
                width: '8%',
                datafield: 'spec',
                displayfield: 'spec'
            };
        settings.columns[6] = {
            text: '颜色',
            datafield: 'color',
            columntype: 'combobox',
            width: '5%',
            jqxSettings: {
                displayMember: "color",
                valueMember: "color",
                source: 'producttype',
            },
            displayfield: 'color'
        };

        delete settings.columns[8].cellsrenderer;
    }

    for (var i in _global_settings.owner.easyGridSetting) {
        settings.columns = deleteBy(settings.columns, i, 'datafield');
    }

    settings.columns = setToggerColumns(settings.toggerColumns, settings.columns, saleorbuy);

    //总数量不能输入
    if (_global_settings.acOwner.yardsFlag) {
        for (var i = 0; i < settings.columns.length; i++) {
            if (settings.columns[i].datafield == 'qty') {
                settings.columns[i].editable = false;
            }
        }
    }

    /*for(var i in _global_settings.owner.easyGridSetting){
    	var datafield=_global_settings.owner.easyGridSetting[i];
    	if(datafield=='zx'){
    		
    	}
    	settings.columns=deleteBy(settings.columns,datafield,'datafield');
    }*/

    var aggregates = settings.aggregates;

    var columns = settings.columns;

    var pk = {};

    var datafields = {};



    //获取可见的列数据 for function getDataWash
    var getVisibleColumn = function() {
        var yes = {
            printOfGoods: '', //打印品名
            totalCartons: 0, //总箱数
            eachCartons: 0, //每箱数量
            spec: null, //规格型号
            color: null, //图片
            weight: 0, //重量
            extent: 0, //长
            breadth: 0, //宽
            altitude: 0, //高
            remark: '', //备注
            yards: '', //细码
            unit: '', //单位
            deliveryQtyNow: 0, //送货数量
            volume: 0, //体积
        }
        var obj = {}
        for (var i in yes) {
            try {
                if (table.jqxGrid('iscolumnvisible', i)) {
                    obj[i] = yes[i]
                }
            } catch (e) {}
        }
        return obj;
    }

    var getData = function(ArrObj, filter) {;
        var oldData = [];
        var not = {
            boundindex: true,
            uid: true,
            uniqueid: true,
            undefined: true,
            visibleindex: true,
        }

        var data = [];
        if (ArrObj === undefined) {
            data = table.jqxGrid('source').records;
            for (var i = 0; i < data.length; i++) {
                var obj = {};
                for (var j in data[i]) {
                    if (!not[j]) {
                        obj[j] = data[i][j];
                    }
                }
                oldData.push(obj);
            }
            return oldData;
        } else {
            delete not[undefined];
            data = ArrObj;
            for (var i = 0; i < data.length; i++) {
                for (var j in not) {
                    data[i][j] = i;
                }
            }
            return data;
        }
    }

    //数据清洗  洗掉不要的数据
    var getDataWash = function(ArrObj, checked) {
        var yes = {
            sequence: 0, //编号
            //zl:0,
            qty: 0, //销售总数
            priceBefore: 0, //价格
            dzid: null,
            productName: null,
            photoId: null,
            photoAddId: null,
            deliveryQtyNow: 0, //送货数量
            spec: null,
            color: null,
            unitsFlag: null,
            amountFormula: '', //金额公式
            inventoryQtyFormula: '', //库存数量公式
          //id:null

            /*totalCartons:0,//总箱数
				eachCartons:0,//每箱数量
				prodSpecId:null,//规格型号
				prodColourId:null,//图片
				//prodSpecId:null,//
				weight:null,//重量
				extent:null,//长
				breadth:null,//宽
				altitude:null,//高
*/
        }
        yes = $.extend(true, yes, getVisibleColumn());
        if (yes.unit !== undefined) {
            yes.unitRate = ''; //单位和主单位的比率
            yes.basicUnit = ''; //主单位
        }
        var jsons = [];
        //		var prod = ComboBoxSources.getInfoMapByKey(productSourceName,'id');
        for (var i = 0; i < ArrObj.length; i++) {
            var prod = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', ArrObj[i].productName);
            var json = {};
            for (var j in yes) {
                var cell = ArrObj[i][j];
                if (cell == null || cell == '') {
                    //json[j]=null;
                    //改成给个默认值
                    json[j] = yes[j];
                    if (j == 'sequence') {
                        json[j] = i + 1;
                    }
                    if (j == 'unitsFlag') {
                        json[j] = prod.multiUnitFlag;
                    }
                } else {
                    if (j == 'sequence') {
                        json[j] = i + 1;
                    }
                    /*else if(j=='photoId'){
                    						json[j] = ArrObj[i]['oldPhotoId']; 
                    					}*/
                    else if (j == 'unit') {
                        json[j] = ArrObj[i][j].replace(/\(.{0,}\)$/, '');
                    } else {
                        json[j] = cell;
                    }
                }
            }
            if (json.qty != 0 && (json.productName == null || json.productName == '')) {
                Core.alert({ message: '第' + (i + 1) + '行' + '请重新选择产品' });
                throw '第' + (i + 1) + '行' + '请重新选择产品';
            }
            if (json.productName != null && json.productName != '' && json.productName != undefined) {
                //				var errorID=json.product.id;
                //				if(JSON.stringify(ComboBoxSources.getInfoMapByKey('product','id',errorID)).length===2){
                //					Core.alert({message:'请选择产品'});
                //					throw '产品只能是下拉框里面的';
                //				}
                if (checked !== false) {
                    if (json.qty == 0) {
                        Core.alert({ message: '第' + (i + 1) + '行' + columntypeQtyText + '数量不能为0' });
                        throw '第' + (i + 1) + '行' + columntypeQtyText + '数量不能为0';
                    }
                    if (json.priceBefore < 0) {
                        Core.alert({ message: '第' + (i + 1) + '行' + '单价不能为负数' });
                        throw '第' + (i + 1) + '行' + '单价不能为负数';
                    }
                    /*if((json.prodSpecId==0||json.prodSpecId==null||json.prodSpecId=='')&&_global_settings.owner.productSpeFlag=='true'){
                    	var len=prod[json.product.id].prodSpecList.length;
                    	if(len!=0){
                    		if(settings.stop!=true){
                    			Core.alert({message:'请选择规格型号'});
                    			throw '请选择规格型号';
                    		}
                    	}
                    }*/
                    if (json.totalCartons < 0 || json.totalCartons < 0 || json.qty < 0 || json.deliveryQtyNow < 0) {
                        Core.alert({ message: '第' + (i + 1) + '行' + '数量不能为负数' });
                        throw '第' + (i + 1) + '行' + '数量不能为负数';
                    }
                    if (json.deliveryQtyNow < 0) {
                        var txt = '';
                        if (addoredit == 'add') {
                            if (saleorbuy == 'sale') {
                                txt = '送货数量';
                            } else {
                                txt = '收货数量';
                            }
                        } else {
                            if (saleorbuy == 'sale') {
                                txt = '已送数量';
                            } else {
                                txt = '已收数量';
                            }
                        }
                        Core.alert({ message: '第' + (i + 1) + '行' + txt + '不能为负数' });
                        throw '第' + (i + 1) + '行' + '数量不能为负数';
                    }
                    if (json.deliveryQtyNow < 0) {
                        var txt = '';
                        if (addoredit == 'add') {

                        } else {
                            if (saleorbuy == 'sale') {
                                txt = '本次送货';
                            } else {
                                txt = '本次收货';
                            }
                        }
                        Core.alert({ message: '第' + (i + 1) + '行' + txt + '不能为负数' });
                        throw '第' + (i + 1) + '行' + '数量不能为负数';
                    }
                }

                ;
                if (json.photoId != undefined && json.photoId != '') {
                    //产品有图片
                    if (json.photoAddId != undefined && json.photoAddId != '') {
                        //颜色图片覆盖掉情况
                        delete json.photoId;
                    } else {
                        //颜色图片没有覆盖掉情况
                        delete json.photoAddId;
                    }
                } else {
                    //产品没有图片
                    if (json.photoAddId != undefined && json.photoAddId != '') {
                        //颜色图片覆盖掉情况
                        delete json.photoId;
                    } else {
                        //颜色图片没有覆盖掉情况
                        delete json.photoAddId;
                        delete json.photoId;
                    }
                }

                //				json.id=json.id;
                //				json.qty=money(json.qty,2,true);
                json.qty = money(json.qty, 4, true);
                json.priceBefore = money(json.priceBefore, 4, true) === 'NaN' ? '0.00' : money(json.priceBefore, 4, true);
                delete json.dzid;
                json.productName = json.productName.trim();
                //				console.log('.............'+json);
                jsons.push(json);
            }
        }
        return jsons;
    }

    //数据填充，消灭空值 ，获取产品相关信息
    function getDataDirty(ArrObj, pkObj) {;
        var yes = {
                name: true,
                //type:true,
                color: null, //图片 
                spec: null,
                sku: true,
                priceBefore: '0.00',
                deliveryQtyNow: 0, //本次送货,
                unit: '' //单位
            }
            //		var prod=ComboBoxSources.getInfoMapByKey(settings.productSourceName.product,'id');
        for (var i = 0; i < ArrObj.length; i++) {
            var json = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product, 'name', ArrObj[i].productName);
            //			var json={};
            //			ArrObj[i].unit = prod.unit;
            for (var j in yes) {
                if (j === 'spec') {
                    if (ArrObj[i].spec != null) {
                        //var _s=ComboBoxSources.getArrSourceOrderByKey(json.prodSpecList,'id',ArrObj[i].prodSpecId);
                        //_s=_s==null?{}:_s[0];
                        ArrObj[i].descr = ArrObj[i].spec;
                    } else {
                        ArrObj[i].spec = '';
                        ArrObj[i].descr = '';
                    }
                } else if (j === 'prodAddId') {
                    if (ArrObj[i].photoAddId != null && ArrObj[i].photoAddId != null) {
                        ArrObj[i].photoId = ArrObj[i].photoAddId;
                    } else {
                        ArrObj[i].photoId = '';
                    }
                } else if (j === 'color') {
                    if (ArrObj[i].color != null) {
                        ArrObj[i].color = ArrObj[i].color;
                    } else {
                        ArrObj[i].color = '';
                    }
                } else if (j == 'deliveryQtyNow') {
                    ArrObj[i].deliveryQty = 0;
                } else if (j == 'priceBefore') {
                    ArrObj[i].priceBefore = money(ArrObj[i].priceBefore, 4, true) === 'NaN' ? '0.00' : money(ArrObj[i].priceBefore, 4, true);
                } else if (j === 'unit') {
                    if (json.multiUnitFlag) {
                        var zhudanwei = json.prodContainerList == null ? null : json.prodContainerList[0];
                        if (zhudanwei != null) {
                            if (ArrObj[i][j] != '' && ArrObj[i][j] != null && ArrObj[i][j] != zhudanwei.unitName) {
                                // if (ArrObj[i][j] != zhudanwei.unitName) {
                                ArrObj[i][j] = ArrObj[i][j] + '(' + ArrObj[i].unitRate + zhudanwei.unitName + ')';
                            }
                        }
                    }
                } else {
                    ArrObj[i][j] = json[j];
                }
            }
        }
        return ArrObj;
    }

    var getRowData = function() {
        var selectedrowindex = table.jqxGrid('getselectedrowindex');
        return table.jqxGrid('getrowdata', selectedrowindex);
    }

    var addLastRow = function(name) {
        var rows = getData();
        var data = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', name);
        if (data == null) return rows;
        for (var i = 0; i < rows.length; i++) {
            var _row = rows[i];
            if (_row.id == '' || _row.id == null) {
                _row.id = data.id;
                _row.name = data.name;
                _row.type = data.type == '' ? '未分类' : data.type;
                _row.sku = data.sku;
                _row.spec = data.spec;
                _row.priceBefore = parseFloat(data[sourceType != 'salePrice' ? 'purchasePrice' : 'salePrice']);

                _row.spec = data.spec;
                _row.photoId = data.photoId;
                _row.photoAddId = data.photoAddId;
                _row.color = data.color;

                return rows;
            }
        }
        var _row = {};
        _row.name = data.productName;
        _row.type = data.type == '' ? '未分类' : data.type;
        _row.sku = data.sku;
        _row.spec = data.spec;
        _row.priceBefore = parseFloat(data[sourceType != 'salePrice' ? 'purchasePrice' : 'salePrice']);

        _row.photoId = data.photoId;
        _row.photoAddId = data.photoAddId;
        _row.color = data.color;

        rows.push(_row);
        return rows;
    }

    //设置行数据
    var setRowData = function(datafield, rowBoundIndex) {
        var selectedrowindex = rowBoundIndex;

        var id = table.jqxGrid('getrowid', selectedrowindex);

        var arr = table.jqxGrid('getrowdata', selectedrowindex);

        if (datafield == 'productName') {
            if (arr[datafield] == null) return;

            var data = ComboBoxSources.getInfoMapOrderByKey(productSourceName, 'name', arr[datafield]);

            if (data == null) return;
            data = data[0];
            arr.productName = data.name;
            if (data.type == '' || data.type == null) {
                data.type = '未分类';
            }
            arr.type = data.type;
            //arr.sku=data.sku;
            //			arr.spec=data.spec;
            if (arr.priceBefore == null || arr.priceBefore == '' || arr.priceBefore == 0 || arr.priceBefore == 'NaN') {
                arr.priceBefore = parseFloat(data[sourceType != 'salePrice' ? 'purchasePrice' : 'salePrice']);
            }
            //			arr.color=data.color;

            arr.photoId = data.prodPhoto;
            //			arr.photoAddId=data.prodPhoto;
            //			arr.unit=data.unit;
            arr.unit = '';
            arr.unitRate = '';
            arr.basicUnit = '';
            arr.unitsFlag = false;
            arr.amountFormula = data.amountFormula; //金额公式
            arr.inventoryQtyFormula = data.inventoryFormula; //库存数量公式
            if (data.multiUnitFlag) {
                var prodContainerList = data.prodContainerList;
                var commonFlag = ComboBoxSources.getInfoMapByKey(prodContainerList, 'commonFlag', true);
                var zdw = prodContainerList[0]
                if (zdw.unitName != commonFlag.unitName) {
                    commonFlag.unitName = commonFlag.unitName + '(' + commonFlag.rate + zdw.unitName + ')'
                }
                arr.basicUnit = zdw.unitName;
                arr.unit = commonFlag.unitName;
                arr.unitRate = commonFlag.rate;
                arr.unitsFlag = true;
                if (sourceType == 'salePrice') {
                    arr.priceBefore = commonFlag.salePrice;
                    arr.cost = commonFlag.purchasePrice;
                } else {
                    arr.priceBefore = commonFlag.purchasePrice;
                }
            } else {
                arr.basicUnit = data.unit;
                arr.unit = data.unit;
                arr.unitRate = 1;
            }
        }
    }

    //根据cell数据设置列数据
    var setRowCoaData = function(datafield, target) {

        var selectedrowindex = table.jqxGrid('getselectedrowindex');

        var id = table.jqxGrid('getrowid', selectedrowindex);

        var arr = table.jqxGrid('getrowdata', selectedrowindex);

        var source = ComboBoxSources.getInfoMapByKey(productSourceName, 'type')

        var data = null;
        if (datafield == 'productName') {
            data = ComboBoxSources.getInfoMapByKey(productSourceName, 'productName', arr['productName']);
            if (data != null) {
                data = data.productName;
            }
        }
        if (datafield == 'spec') {
            if (arr['productName'] != null && arr['productName'] != '') {
                data = ComboBoxSources.getInfoMapByKey(productSourceName, 'productName', arr['productName']);
                if (data != null) {
                    data = data.spec;
                }
            }
        }
        if (datafield == 'color') {
            if (arr['productName'] != null && arr['productName'] != '') {
                data = ComboBoxSources.getInfoMapByKey(productSourceName, 'productName', arr['productName']);
                if (data != null) {
                    data = data.color;
                }
            }
        }
        target.jqxComboBox({ source: data });
    }
    
  //计算行数据
    var computeRow = function(row) {
        var arr = ['priceBefore', 'cost', 'extent', 'breadth', 'altitude', 'volume',
            'weight', 'totalCartons', 'eachCartons', 'tj', 'qty', 'deliveiedQty', 'deliveryQtyNow', 'purchaseNumber'
        ];
        for (var index = 0; index < arr.length; index++) {
            var element = arr[index];
            row[element] = money(row[element], 4, true)
        }
      //单子是否开启公式
        var customFormulaFlag = false;
        if ((addoredit == 'add' && _global_settings.acOwner.customNumberFlag) ||
            ((addoredit == 'edit' || addoredit == 'view') && settings.order.customNumberFlag)) {
            customFormulaFlag = true;
        }

        for (var i = 0; i < aggregates.length; i++) {
            if (aggregates[i].type == 'Multiply') {
                if (aggregates[i].datafield.length == 3) {
                    if (aggregates[i].datafield[2] == 'qty' && !table.jqxGrid('iscolumnvisible', 'eachCartons')) {

                    } else {
                        if ($.strInArr(aggregates[i].datafield[2], ['price3_server', 'ysprice', 'dsprice'])) {
                            var v = ((row[aggregates[i].datafield[0]]) * money(row[aggregates[i].datafield[1]], 4, true));
                            if ($.strInArr(aggregates[i].datafield[2], ['ysprice', 'dsprice'])) {
                                row[aggregates[i].datafield[2]] = money(v);
                            }
                            if (aggregates[i].datafield[2] == 'price3_server') {
                                row[aggregates[i].datafield[2]] = money(v);
                                row['price3'] = v;
                            }

                        } else {
                            if (aggregates[i].datafield[1] == 'unitRate' && (!row[aggregates[i].datafield[1]] || table.jqxGrid('iscolumnvisible', 'eachCartons') || !table.jqxGrid('iscolumnvisible', 'unitRate'))) {
                                var v = money(row[aggregates[i].datafield[0]], 4, true) * 1;
                            } else {
                                var v = money(row[aggregates[i].datafield[0]], 4, true) * money(row[aggregates[i].datafield[1]], 4, true);
                            }

                            //var v = money((row[aggregates[i].datafield[0]]) * (row[aggregates[i].datafield[1]]),4,true);
                            row[aggregates[i].datafield[2]] = money(v, 4, true);
                        }
                    }
                    
                    if (row.amountFormula != null && row.amountFormula != '' &&
                        $.strInArr(aggregates[i].datafield[2], ['price3_server', 'ysprice', 'dsprice'])) {
                        //新增商户设置开公式或者编辑查看单子有公式，进行公式计算
                        if (customFormulaFlag) {
                            var v = fouroperations(row.amountFormula, row, aggregates[i].datafield[0])
                            row[aggregates[i].datafield[2]] = v;
                            if (aggregates[i].datafield[2] == 'price3_server') {
                                row[aggregates[i].datafield[2]] = money(v);
                                row['price3_server'] = money(v,2,true);
                                row['price3'] = money(v,2,true);
                            }
                        }
                    }
                }
                try {
                    if (aggregates[i].datafield.length == 5) {
                        var v = money((row[aggregates[i].datafield[0]]) * (money(row[aggregates[i].datafield[1]]) *
                            (row[aggregates[i].datafield[2]]) * (row[aggregates[i].datafield[3]])));
                        row[aggregates[i].datafield[4]] = v;
                    }
                } catch (e) {}
            }
        }
        
        if (customFormulaFlag) {
            if (row.inventoryQtyFormula != null && row.inventoryQtyFormula != '') {
                var v = fouroperations(row.inventoryQtyFormula, row, 'qty',true);
                row.inventoryReducere = v;
            } else {
                row.inventoryReducere = 0;
            }
        }
    }

    var grid_refresh = function(json) {
        //var oldData=[];
        if (json != null) {
            var _data = json;
        } else {
            var _data = table.jqxGrid('source').records;
        }
        var data = $.extend(true, _data, []);
        //console.time('行列总额计算时间');
        for (var i = 0; i < data.length; i++) {
        	computeRow(data[i]);
//            var obj = {};
//            for (var j = 0; j < aggregates.length; j++) {
//                if (aggregates[j].type == 'Multiply') {
//                    if (aggregates[j].datafield.length == 3) {
//                        if (aggregates[j].datafield[2] == 'qty') {} else {
//                            if ($.strInArr(aggregates[j].datafield[2], ['price3_server', 'ysprice', 'dsprice'])) {
//                                var v = (data[i][aggregates[j].datafield[0]]) * money(data[i][aggregates[j].datafield[1]], 4, true);
//
//                                if ($.strInArr(aggregates[j].datafield[2], ['ysprice', 'dsprice'])) {
//                                    data[i][aggregates[j].datafield[2]] = money(v);
//                                }
//                                if (aggregates[j].datafield[2] == 'price3_server') {
//                                    data[i][aggregates[j].datafield[2]] = money(v);
//                                    data[i]['price3'] = v
//                                }
//                            } else {
//                                if (aggregates[j].datafield[1] == 'unitRate' && (!data[i][aggregates[j].datafield[1]] || table.jqxGrid('iscolumnvisible', 'eachCartons') || table.jqxGrid('iscolumnvisible', 'unitRate'))) {
//                                    var v = data[i][aggregates[j].datafield[0]] * 1;
//                                } else {
//                                    var v = data[i][aggregates[j].datafield[0]] * data[i][aggregates[j].datafield[1]];
//                                }
//
//                                data[i][aggregates[j].datafield[2]] = money(v, 4, true);
//                            }
//                        }
//                    }
//                    try {
//                        if (aggregates[j].datafield.length == 5) {
//                            var v = money((data[i][aggregates[j].datafield[0]]) * money((data[i][aggregates[j].datafield[1]]) *
//                                (data[i][aggregates[j].datafield[2]]) * (data[i][aggregates[j].datafield[3]])));
//                            data[i][aggregates[j].datafield[4]] = v;
//                        }
//                    } catch (e) {}
//
//                }
//            }
        }
        //timeOut(function(){
        grid_render(data);
        //},0)
    }

    //列参数初始化处理
    var columns_Handle = function(column) {
        ////console.time('columns_Handle执行时间');
        //console.error(column);
        var columns = $.extend(true, [], column);
        var defaultArr = [{
            text: '编号',
            editable: false,
            enabletooltips: false,
            resizable: false,
            pk: true,
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
                var renderstring = '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: center;">' +
                    '合计</div>';
                return renderstring;
            },
            datafield: 'sequence',
            columntype: 'number',
            width: '3%',
            cellsrenderer: function(row, column, value) {
                //console.log(value) 
                return "<div style='margin:11px auto;text-align:center;'>" + (value + 1) + "</div>";
            }
        }, {
            text: '操作',
            editable: false,
            width: '7%',
            datafield: '操作',
            align: 'center',
            cellsrenderer: function(rowIndex) {
                var rtStr = '<div style="text-align: center;padding-top: 8px;">' +
                    '<a class="md-cancel hoverspan del" data-id="' + rowIndex + '" title="删除"></a>' +
                    '<a class=" md-description hoverspan copy" data-id="' + rowIndex + '" title="复制"></a>' +
                    '<a class="md-note-add hoverspan add" data-id="' + rowIndex + '" title="新增"></a>' +
                    '</div>';
                return rtStr;
            }
        }];

        var jqxType = {
            template: function(jqxSettings, datafield) {
                var defaultArr = {
                    theme: currentTheme,
                    //animationType: 'slide',
                    animationType: 'none',
                    //renderSelectedItem: refNameByPinyin,
                    height: '40px',
                    searchMode: 'none',
                    enableBrowserBoundsDetection: false,
                    placeHolder: "请选择",
                    source: []
                };
                var _settings = $.extend(true, defaultArr, jqxSettings);
                var key = '',
                    source = '';
                if (_settings.type == "product") {
                    key = "id";
                    source = productSourceName;
                }
                if (_settings.type == "vendor") {
                    key = "clientInfoid";
                    source = "vendor_p";
                }
                delete _settings.type;
                return function(rowindex, column, editor, e, f) {
                    if (source != '') {
                        var obj = ComboBoxSources.getRecords(source);
                        _settings.source = obj;
                    }
                    editor.comboBox(_settings);
                    if (key == "id") {
                        editor.addClass(datafield);
                    }
                }
            },
            combobox: function(jqxSettings, datafield) {
                var defaultArr = {
                    theme: currentTheme,
                    //renderSelectedItem: refNameByPinyin,
                    height: '40px',
                    searchMode: 'containsignorecase',
                    autoComplete: true,
                    enableBrowserBoundsDetection: false,
                    placeHolder: "请选择"
                };
                var _settings = $.extend(true, defaultArr, jqxSettings);


                return function(rowindex, column, editor) {
                    var row = table.jqxGrid('getrowdata', rowindex);
                    if (row.productName != null && row.productName != '') {
                        var arr = search(row.productName);
                        var obj = arr[0];
                        var value = arr[1];
                        obj.length = 200;
                    } else {
                        var obj = ComboBoxSources.getInfoMapByKey(productSourceName);
                        obj.length = 200;
                    }
                    editor.jqxComboBox({
                        theme: currentTheme,
                        searchMode: 'none',
                        enableBrowserBoundsDetection: false,
                        //autoOpen: true,
                        source: obj,
                        height: '40px',
                        displayMember: "name",
                        valueMember: "name",
                    });
                    editor.addClass(datafield);
                }
            },
            numberinput: function(jqxSettings) {
                return function(row, column, editor) {
                    editor.jqxNumberInput(jqxSettings);
                }
            },
            dropdownlist: function(jqxSettings, datafield) {
                var defaultArr = {
                    autoDropDownHeight: true,
                    placeHolder: "请选择"
                }
                var settings = $.extend(true, defaultArr, jqxSettings);
                settings.source = ComboBoxSources.getInfoMapByKey(settings.source);
                return function(row, column, editor) {
                    editor.jqxDropDownList(settings).addClass(datafield);
                }
            }
        };
        var len = columns.length;
        for (var i = 0; i < len; i++) {
            if (columns[i].columntype != null) {
                if (typeof jqxType[columns[i].columntype] === 'function') {
                    columns[i].createeditor = jqxType[columns[i].columntype](columns[i].jqxSettings, columns[i].datafield);
                }
            }
            if (columns[i].aggregatesrenderer === true) {
                columns[i].aggregatesrenderer = function(aggregates, column, element) {
                    var sum = null;
                    var txt = '';
                    var align = 'right';
                    if (columns[i].cellsformat) {
                        sum = aggregates.sum == null ? 0 : aggregates.sum;
                        sum = money(moneySmall(sum.toString().replace('￥', '')));
                    } else {
                        sum = aggregates.sum;
                    }
                    if (gridSettings.dellist) {
                        sum = getgridcheckedsum(column.datafield, table);
                    }
                    if (column.text.indexOf('编号') > -1) {
                        sum = '合计';
                        align = 'left';
                    }
                    if (column.text.indexOf('金额') > -1) {
                        txt = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金额:';
                        sum = money(sum);
                    } else {
                        sum = money(sum, 4, true);
                    }
                    if (column.text.indexOf('重量') > -1) {
                        txt = '重量:';
                    }
                    if (column.text.indexOf('箱数') > -1) {
                        txt = '总箱数:';
                    }
                    if (column.text.indexOf('总数量') > -1) {
                        txt = '总数量:';
                    }
                    if (column.text.indexOf('送货数量') > -1) {
                        txt = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;送货数量:';
                    }
                    if (column.text.indexOf('收货数量') > -1) {
                        txt = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收货数量:';
                    }
                    if (column.text.indexOf('已送数量') > -1) {
                        txt = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已送数量:';
                    }
                    if (column.text.indexOf('已收数量') > -1) {
                        txt = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已收数量:';
                    }
                    if (column.text.indexOf('本次送货') > -1) {
                        txt = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本次送货:';
                    }
                    if (column.text.indexOf('本次收货') > -1) {
                        txt = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本次收货:';
                    }
                    /*if(column.text.indexOf('体积')>-1){ 
                    	sum+='m³';
                    } */
                    var renderstring = '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: ' + align + '; ">' +
                        txt + sum + '</div>';
                    if (qtyNowVisible == false && (txt == '已送数量:' || txt == '已收数量:')) {
                        renderstring = '';
                    }
                    return renderstring;
                }
            }
        }

        columns.unshift(defaultArr[0]);
        if (gridSettings.delBtn) {
            columns.unshift(defaultArr[1]);
        }
        if (gridSettings.dellist) {
            var html = '<div style="position: absolute; top: 50%; left: 50%; margin-top: -7px; margin-left: -10px; overflow: visible; cursor: auto;" id="dellist" tabindex="0" class="jqx-widget jqx-checkbox"><div class="jqx-checkbox-default jqx-fill-state-normal jqx-rc-all"><div style="width: 13px; height: 13px;"><span style="width: 13px; height: 13px;" class=""></span></div></div><div style="clear: both;"></div></div>';
            columns.unshift({ text: html, columntype: 'checkbox', width: '3%', datafield: 'waitdel', hidden: false, enabletooltips: false });
            $('#addPurchaseOrder_grid').on('click', '#dellist', function() {
                var t = $(this).find('span');
                var bool = false;
                var type = null;
                if (t.attr('class') === 'jqx-checkbox-check-checked') {
                    type = 'remove';
                    //t.removeClass('jqx-checkbox-check-checked');
                } else {
                    //t.addClass('jqx-checkbox-check-checked');
                    type = 'add';
                    bool = true;
                }
                var arr = $('#addPurchaseOrder_grid').getData();
                var newArr = [];
                for (var i in arr) {
                    arr[i].waitdel = bool;
                    newArr.push(arr[i]);
                }
                if (newArr.length == 0) {
                    $('#addPurchaseOrder_grid').updateListRow([{}]);
                } else {
                    $('#addPurchaseOrder_grid').updateListRow(newArr);
                }

                if (type == 'remove') {
                    $('#dellist').find('span').removeClass('jqx-checkbox-check-checked');
                } else {
                    $('#dellist').find('span').addClass('jqx-checkbox-check-checked');
                    //bool=true;
                }
            })

            for (var i in columns) {
                var datafield = columns[i].datafield;
                if (datafield === 'qty') {
                    columns[i].text = '本次采购';
                }
                if (datafield === 'purchasedQty' || datafield === 'salesQty') {
                    columns[i].hidden = false;
                }
            }
        }
        ////console.timeEnd('columns_Handle执行时间');
        return columns;
    }

    var dataCopyLast = function(arr) {
        var obj = {};
        var json = arr[arr.length - 1];
        for (var i in json) {
            obj[i] = null;
        }
        arr.push(obj);
        return arr;
    }
    var dataCopyNullList = function(arr) {
        var obj = {};
        var json = arr[arr.length - 1];
        for (var i in json) {
            obj[i] = null;
        }
        return obj;
    }
    var grid_render = function(data, bool) {
        if (bool === false) {
            var source = {
                localdata: data,
                datatype: "array"
            };
            var dataAdapter = new $.jqx.dataAdapter(source, {
                downloadComplete: function(data, status, xhr) {},
                loadComplete: function(data) {},
                loadError: function(xhr, status, error) {}
            });
            table.jqxGrid({ source: dataAdapter });
            settings.columnSumEvent();
            return;
        }

        var source = {
            localdata: data,
            datatype: "json",
            datafields: [
                //{ name: 'name', value: 'id', values: { source: ComboBoxSources.getInfoMapByKey(productSourceName), value: 'id', name: 'name' } },
                { name: 'productName', type: 'string' },
                { name: 'id', type: 'string' },
                { name: 'waitdel', type: 'bool' },
                { name: 'printOfGoods', type: 'string' },
                { name: 'photoId', type: 'string' },
                { name: 'oldPhotoId', type: 'string' },
                { name: 'photoAddId', type: 'string' },
                //{ name: 'sku', type: 'string'},
                { name: 'spec', type: 'string' },
                { name: 'descr', type: 'string' },
                { name: 'color', type: 'string' },
                { name: 'prodColourDescr', type: 'string' },
                { name: 'weight', type: 'string' },
                { name: 'totalCartons', type: 'string' },
                { name: 'eachCartons', type: 'string' },
                { name: 'qty', type: 'string' },
                { name: 'purchasedQty', type: 'string' },
                { name: 'salesQty', type: 'string' },
                { name: 'priceBefore', type: 'string' },
                { name: 'price3', type: 'string' },
                { name: 'price3_server', type: 'string' },
                { name: 'extent', type: 'string' },
                { name: 'breadth', type: 'string' },

                { name: 'altitude', type: 'string' },
                { name: 'tj', type: 'string' },
                { name: 'deliveiedQty', type: 'string' },
                { name: 'deliveryQtyNow', type: 'string' },
                { name: 'remark', type: 'string' },
                { name: 'dzid', type: 'string' },
                { name: 'rowweight', type: 'string' },
                { name: 'ysprice', type: 'string' },
                { name: 'dsprice', type: 'string' },
                { name: 'volume', type: 'string' },
                { name: 'yards', type: 'string' },
                { name: 'unit', type: 'string' },
                { name: 'unitRate', type: 'string' },
                { name: 'unitRateqty', type: 'string' },
                { name: 'basicUnit', type: 'string' },
                { name: 'unitsFlag', type: 'string' },
                { name: 'deliveryQtyAll', type: 'string' },
                { name: 'inventoryReducere', type: 'string' },
                { name: 'amountFormula', type: 'string' },
                { name: 'inventoryQtyFormula', type: 'string' }
            ],
            addrow: function(rowid, rowdata, position, commit) {
                commit(true);
            },
            updaterow: function(rowid, rowdata, commit) {
                    commit(true);
                }
                /*datafields:[
                            //{ name: 'firstname', type: 'object' },
                            { name: 'firstname', type: 'string' },
                            { name: 'lastname', type: 'string' },
                            { name: 'dropdownlist', type: 'string' }]*/
        };
        var dataAdapter = new $.jqx.dataAdapter(source, {
            loadComplete: function(data) {},
            loadError: function(xhr, status, error) {}
        });

        table.jqxGrid({
            selectionmode: 'singlerow',
            //selectionmode: 'singlerow',
            columnsheight: columnsheight,
            altrows: true,
            editable: gridSettings.editable,
            columnsresize: true,
            width: '100%',
            rowsheight: 40,
            pageable: false,
            enablebrowserselection: false,
            enabletooltips: true, //title
            autoheight: true,
            localization: gridLocalizationObj,
            source: dataAdapter,
            statusbarheight: 40, //底部
            showstatusbar: true, //合计
            showaggregates: true,
            showtoolbar: false, //头部
            rendertoolbar: function(toolbar) {

            },
            columns: columns_Handle(columns),
            columngroups: [
                { text: '外箱尺寸(cm)', align: 'center', name: '外箱尺寸' }
            ],
            ready: function() {
                table.addClass('easyGrid');
                timeOut(function() {
                    //table.resize();  
                })

            },
            //	              virtualmode: true,
            //	              rendergridrows: function() {
            //	            	  
            //	            	  //return dataAdapter._source.localdata;
            //	                  return dataAdapter.records;
            //	              },
        });
    };

    if (needRefresh) {
        grid_refresh(source);
    } else {
        grid_render(source);
    }

    if (gridSettings.delBtn) {
        //上传产品图片
        table.on('click', '.addPhoto', function(event) {

            //$(window).resize();
            setTimeout(function() {
                //$('#comboboxeditor'+table.attr('id')+'id').css('display','none');
                timeOut(function() {
                    photoModal(table.attr('id'), settings.productSourceName);
                }, 20)

            }, 0)
        });

        //细码
        table.on('click', '.addyards', function(event) {
            setTimeout(function() {
                timeOut(function() {
                    yardsModal(table.attr('id'));
                }, 20)
            }, 0)
        });

        //新增单位
        table.on('click', '.addUnit', function(e) {
            setTimeout(function() {
                timeOut(function() {
                    addUnitModal(table.attr('id'));
                }, 20)
            }, 0)
        });

        //一键送货
        table.on('click', '.sendStart', function(event) {
            //			if(!qtyNowVisible) return ;
            //$(window).resize();
            timeOut(function() {
                var records = table.jqxGrid('source').records;
                for (var i = 0; i < records.length; i++) {
                    records[i].deliveryQtyNow = records[i].qty;
                    computeRow(records[i]);
//                    records[i].ysprice = records[i].deliveryQtyNow * records[i].priceBefore;
//                    records[i].deliveryQtyAll = money((records[i].unitRate == '' ? 1 : records[i].unitRate) * records[i].deliveryQtyNow, 4, true);
                }
                table.jqxGrid('source').records = records;
                table.jqxGrid('refreshdata');
                table.jqxGrid('refresh');

                if (typeof settings.columnSumEvent === 'function') {
                    settings.columnSumEvent();
                }
            })
        });

        //编辑界面一键送货
        table.on('click', '.sendRun', function(event) {
            //$(window).resize();
            timeOut(function() {
                var records = table.jqxGrid('source').records;
                for (var i = 0; i < records.length; i++) {
                    records[i].deliveryQtyNow = money(money(records[i].qty) - money(records[i].deliveiedQty), 2, true);
                    computeRow(records[i]);
//                    records[i].dsprice = records[i].deliveiedQty * records[i].priceBefore;
//                    records[i].deliveryQtyAll=records[i].unitRate*records[i].deliveryQtyNow;
                }
                table.jqxGrid('source').records = records;
                table.jqxGrid('refreshdata');
                table.jqxGrid('refresh');

                if (typeof settings.columnSumEvent === 'function') {
                    settings.columnSumEvent();
                }
            })
        });

        //删除
        table.on('click', '.del', function(event) {
            var length = table.jqxGrid('source').records.length;
            //			if($(this).attr('data-id')==length ){
            //				return false;
            //			}
            if (1 == length) {
                return false;
            }
            Core.confirm({
                message: "确定要删除？",
                confirmCallback: function() {
                    var arr = table.jqxGrid('source').records;
                    var selectIndex = table.jqxGrid('getselectedrowindex');
                    var id = table.jqxGrid('getrowid', selectIndex);
                    table.jqxGrid('deleterow', id);
                    arr = getData(arr);
                    table.jqxGrid('source').records = arr;
                    table.jqxGrid('refreshdata');
                    //table.jqxGrid('refresh'); 
                    if (typeof settings.columnSumEvent === 'function') {
                        settings.columnSumEvent();
                    }
                }
            })
            return false;
        });

        //添加空行
        table.on('click', '.add', function(event) {
            timeOut(function() {
                table.jqxGrid('beginupdate');
                var selectedrowindex = table.jqxGrid('getselectedrowindex');
                var row = table.jqxGrid('getrowdata', selectedrowindex);
                var arr = table.jqxGrid('source').records;
                //arr.push(getData()[selectedrowindex]);
                var _row = defaultrow();
                //_row.dzid=null;
                arr.splice(selectedrowindex + 1, 0, _row);
                arr = getData(arr);
                table.jqxGrid('source').records = arr;
                table.jqxGrid('refreshdata');
                //table.jqxGrid('refresh');
                if (typeof settings.columnSumEvent === 'function') {
                    settings.columnSumEvent();
                }
                table.jqxGrid('endupdate');
            }, 0)
        });

        //复制行
        table.on('click', '.copy', function(event) {
            timeOut(function() {
                table.jqxGrid('beginupdate');
                var selectedrowindex = table.jqxGrid('getselectedrowindex');
                var row = table.jqxGrid('getrowdata', selectedrowindex);
                var arr = table.jqxGrid('source').records;
                //arr.push(getData()[selectedrowindex]);
                var _row = getData()[selectedrowindex];
                _row.dzid = null;
                arr.splice(selectedrowindex + 1, 0, _row);
                arr = getData(arr);
                table.jqxGrid('source').records = arr;
                table.jqxGrid('refreshdata');
                //table.jqxGrid('refresh');
                if (typeof settings.columnSumEvent === 'function') {
                    settings.columnSumEvent();
                }
                table.jqxGrid('endupdate');
            }, 0)
            var length = table.jqxGrid('source').records.length;
            var selectIndex = table.jqxGrid('getselectedrowindex') + 1;
            if (selectIndex == length) {
                return false;
            }
        });
    }

    //刷新计算总额
    table.on('resetColumnSum', function() {
        if (typeof settings.columnSumEvent === 'function') {
            settings.columnSumEvent();
        }
    })

    //刷新列表
    table.on('click', '.addspecbtn', function() {;
        var name = table.attr('id');
        var selectedrowindex = table.jqxGrid('getselectedrowindex');
        var row = table.jqxGrid('getrowdata', selectedrowindex) == null ? {} : table.jqxGrid('getrowdata', selectedrowindex);
        var prodId = row.id;
        if (prodId == null || prodId == '') {
            Core.alert({ message: '请先选择产品' });
            return false;
        }

        specModal(name, prodId);
    });

    //刷新列表
    table.on('refresh', function(event) {
        grid_refresh();
    });

    table.on('click', '.jqx-grid-header,.jqx-button,.del,.add,.copy,.addPhoto', function(event) {;
        console.log(event.keyCode);
        //var selectedrowindex = table.jqxGrid('getselectedrowindex');
        var lastcell = table.data('lastcell');
        var lastindex = table.data('lastindex');
        //table.jqxGrid('begincelledit', selectedrowindex,lastcell);
        table.jqxGrid('endcelledit', lastindex, lastcell, false);
    });

    /*table.on('blur','input', function (event) {
    	//if($(event.target).attr('id')!='dropdownlistArrowcomboboxeditor'+table.attr('id')){
    		var lastcell=table.data('lastcell');
    		var lastindex=table.data('lastindex');
    		table.jqxGrid('endcelledit', lastindex,lastcell, false);
    	//}
    	
    })*/

    //cell开始编辑
    table.on('cellbeginedit', function(event) {

        //event.stopPropagation();
        event.stopPropagation();
        // event arguments.
        var args = event.args;
        // column data field.
        var datafield = event.args.datafield;
        // row's bound index.
        var rowBoundIndex = event.args.rowindex;
        // cell value
        var value = args.value;
        // row's data.
        var rowData = args.row;

        table.data('lastcell', datafield);
        table.data('lastindex', rowBoundIndex);

        //console.log(event.target);  
        var length = table.jqxGrid('source').records.length - 1;
        var selectedrowindex = table.jqxGrid('getselectedrowindex');

        if (datafield == 'productName' && $('#comboboxeditor' + table.attr('id') + datafield).length > 0) {
            $('#comboboxeditor' + table.attr('id') + datafield).jqxComboBox('clearSelection');
        }

        var cell = rowData[datafield] == null ? '' : rowData[datafield]; //输入值后台返回或自己输入
        var name = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', cell).name == undefined ? value :
            ComboBoxSources.getInfoMapByKey(productSourceName, 'name', cell).name;
        if (datafield == 'productName' && $('#comboboxeditor' + table.attr('id') + datafield).length > 0) {
            console.time('控件生成时间')
                //var source=ComboBoxSources.getInfoMapByKey(productSourceName);
                //source.length=100;
            var source = search(rowData['productName'])[0] == undefined ? value : search(rowData['productName'])[0];
            source.length = 200;
            $('#comboboxeditor' + table.attr('id') + datafield).jqxComboBox({
                source: source
            });
            console.timeEnd('控件生成时间')
            $('#comboboxeditor' + table.attr('id') + datafield).val(cell);
            timeOut(function() {
                $('#comboboxeditor' + table.attr('id') + datafield).val(cell);
                $('#comboboxeditor' + table.attr('id') + datafield).find('input.jqx-combobox-input').val(cell);
                //				 if(value!=''){
                //					 $('#comboboxeditor'+table.attr('id')+datafield).jqxComboBox('addItem', value);
                //				 }
                $('#comboboxeditor' + table.attr('id') + datafield).jqxComboBox('open');
            }, 0)
            console.log('--------上部分--------');
        } else {
            if (datafield == 'productName') {
                $('#comboboxeditor' + table.attr('id') + datafield).val(cell);
            }
            //$('#textboxeditor'+table.attr('id')+datafield).focus();
            timeOut(function() {
                if (datafield == 'productName') {
                    $('#comboboxeditor' + table.attr('id') + datafield).val(cell);
                    //					 if(value!=''){
                    //						 $('#comboboxeditor'+table.attr('id')+datafield).jqxComboBox('addItem', value);
                    //					 }
                    $('#comboboxeditor' + table.attr('id') + datafield).jqxComboBox('open');
                    console.log('----------下部分----应该弹出了吧');
                }
            }, 0)
            console.log('----------下部分---------');
        }

    });
    var search = function(str, pk) {
        console.time('搜索时间');
        var _pk = pk == null ? '_name' : pk;
        var obj = ComboBoxSources.getInfoMapByKey(settings.productSourceName.productsInUse, _pk);
        // $.extend(true, {}, obj, obj);
        var arr = [];
        var value = null;
        for (var i in obj) {
            var oc = obj[i];
            var pk_rp = _pk.replace('_', '');
            if (oc[pk_rp] === str) {
                arr.unshift(oc);
                value = oc['productName'];
            } else if (pk_rp === 'name' && oc[pk_rp].replace(oc.sku, '') === str) {
                arr.unshift(oc);
                value = oc['productName'];
            } else if (pk_rp === 'name' &&
                (oc._name.indexOf(str) > -1 || oc.name.indexOf(str) > -1)) {
                arr.push(oc);
            } else if (i.indexOf(str) > -1) {
                arr.push(oc);
            }
        }
        console.timeEnd('搜索时间');
        return [arr, value];
    };
    var easytablekeyup = null;

    table.on('keyup', '.productName', function(event) {
        console.info('keyup：检测中');
        if (table.prop('comStart') === 'start') {
            event.stopPropagation()
            return; // 中文输入过程中不截断
        }
        console.info('keyup：检测结束');
        //console.log(event);
        var t = $(this);
        var label = $('#' + table.attr('id') + 'id');
        console.log('keyup:' + event.keyCode);
        var ecode = event.keyCode == null ? '' : event.keyCode;

        if ($.strEqArr(ecode, [13, 17, 35, 36, 37, 38, 39, 40, ''])) {
            console.log('文字长度：' + t.find('input.jqx-combobox-input').val().length);
            return true;
        }
        //var txt=t.find('input.jqx-combobox-input').val();
        clearTimeout(easytablekeyup)
        easytablekeyup = setTimeout(function() {
            var iputIndex = t.find('input').focusIndex();
            if (t.val().length == 0) {
                label.text('');
                //return ;
            }

            if (t.jqxComboBox('getSelectedItem') == null) {
                var txt = t.val();
                //var sourceByName=ComboBoxSources.getInfoMapByKey(productSourceName,'name',txt);
                var sourceByName = ComboBoxSources.getInfoMapByKey(settings.productSourceName.productsInUse_server, 'name', txt);
                if (sourceByName.name == null) {
                    var sourceAllByName = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product_server, 'name', txt)
                    if (sourceAllByName.name != null) {
                        //            			Core.alert({message:'产品存在，但是被禁用，请开启后使用'});
                        //            			label.text('被禁用产品');
                        //        				return ;
                    }
                    label.text('新产品');
                    //return ;
                } else {
                    //t.val(sourceByName.id);
                    //t.jqxComboBox({selectedIndex: 0})
                }
            } else {
                var txt = t.find('input.jqx-combobox-input').val();
                var sourceByName = ComboBoxSources.getInfoMapByKey(settings.productSourceName.productsInUse_server, 'name', txt);
                if (sourceByName.name == null) {
                    var sourceAllByName = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product_server, 'name', txt)
                    if (sourceAllByName.name != null) {
                        $('#comboboxeditor' + table.attr('id') + 'productName').jqxComboBox('clearSelection');
                        $('#comboboxeditor' + table.attr('id') + 'productName').find('input.jqx-combobox-input').val(txt);
                        //            			Core.alert({message:'产品存在，但是被禁用，请开启后使用'});
                        //            			label.text('被禁用产品');
                        //        				return ;
                    } else {
                        label.text('新产品');
                        $('#comboboxeditor' + table.attr('id') + 'productName').jqxComboBox('clearSelection');
                        $('#comboboxeditor' + table.attr('id') + 'productName').find('input.jqx-combobox-input').val(txt);
                        //return ;
                    }
                } else {
                    //$('#comboboxeditor'+table.attr('id')+'id').jqxComboBox('clearSelection');
                    //$('#comboboxeditor'+table.attr('id')+'id').find('input.jqx-combobox-input').val(txt);
                }

            }
            var arr = search(txt);
            var obj = arr[0];
            var value = arr[1];
            obj.length = 200;
            t.jqxComboBox({
                source: obj
            });
            if (value != null) {
                t.val(value);
                label.text('');
            } else {
                t.find('input').val(txt)
                t.find('input').focusIndex(iputIndex);
            }
            //label.text('');
            console.log(t.val());
        }, 60)
    }).on('compositionend', '.productName', function() {
        table.prop('comStart', 'end');
        console.info('中文输入：结束');
        var t = $(this);
        timeOut(function() {
            t.trigger('keyup');
        }, 0)
    }).on('compositionstart', '.productName', function(e) {
        console.log(e);
        table.prop('comStart', 'start');
        console.info('中文输入：开始');
    });

    //cell结束编辑
    table.on('cellendedit', function(event) {
        //return;
        debugger
        $('#' + table.attr('id') + 'id').text('');
        var datafield = event.args == null ? {} : event.args.datafield;
        var rowBoundIndex = event.args.rowindex;
        var selectedrowindex = event.args.rowindex;
        var id = table.jqxGrid('getrowid', selectedrowindex);
        var productName = event.args.value; //去掉粘贴的中间空格
        var row = table.jqxGrid('getrowdata', selectedrowindex);
        var oldname = row.productName;
        if (typeof event.args.value === 'object') {
            var searchName = event.args.value.label;
            var sourceByName = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', searchName);
        } else {
            var searchName = event.args.value.replace(/ /g, '');
            var sourceByName = ComboBoxSources.getInfoMapByKey(settings.productSourceName.productsInUse, 'name', searchName);
        }

        if (datafield == 'productName') { /*&&(event.args.oldvalue.value==row.id||JSON.stringify(sourceByName).toString().length==2)*/
            //判断输入产品是否为新增并且不为空
            if (JSON.stringify(sourceByName).toString().length == 2 && searchName != '') {
                if (searchName == null) {
                    return true;
                }
                if (typeof event.args.value === 'object') {
                    var lostProduct = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product, 'name', searchName).name;
                } else {
                    var lostProduct = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product, 'name', searchName).name;
                }
                if (lostProduct != null) {
                    var obj = { productName: '' };
                    timeOut(function() {
                        var commit = table.jqxGrid('updaterow', id, obj);
                    }, 0)

                    //	                Core.alert({ message: '产品存在，但是被禁用，请开启后使用' });
                    //	                return false;
                }
                //event.stopPropagation();

                var url = _global_settings.service.url + "/product";
                var _go = _global_settings.owner;
                var prodColourList = [];
                var prodSpecList = [];
                if (_go.productCoLorTypeFlag == 'true') {
                    prodColourList = ComboBoxSources.getRecords('systemColorList_forAjax');
                }
                if (_go.productSpeTypeFlag == 'true') {
                    prodSpecList = ComboBoxSources.getRecords('systemSpec_forAjax');
                }
                var list = {
                    productName: searchName,
                    prodColourList: prodColourList,
                    prodSpecList: prodSpecList
                }
                var data = $.extend(true, table.jqxGrid('getrowdata', selectedrowindex), {});
                var json = {};
                for (var i in data) {
                    if (data[i] == null) {
                        json[i] = '';
                    } else {
                        json[i] = data[i];
                    }
                }
                json.productName = searchName;
                json.photoId = '';
                json.photoAddId = '';
                timeOut(function() {
                    if (row.productName == null || row.productName == '' || row.productName == undefined) {
                        $('#comboboxeditor' + table.attr('id') + datafield).jqxComboBox('addItem', searchName);
                    }
                    var commit = table.jqxGrid('updaterow', id, json);
                }, 0)

                //return false;
            }
            if (sourceByName.name != '' && sourceByName.name != null) {
                //选择下拉的
                if (event.args.oldvalue === event.args.value) {
                    return true;
                }
                row.productName = sourceByName.name;
                row.photoId = sourceByName.prodPhoto;
                row.spec = '';
                row.color = '';
                row.name = sourceByName.name;
                setRowData(datafield, rowBoundIndex);
            } else {
                row.productName = productName;
                row.photoId = '';
                row.spec = '';
                row.color = '';
                //	        	for(var i in row){
                //	        		row[i]='';
                //	        	}
                var commit = table.jqxGrid('updaterow', id, row);
                return true;
            }
        } else if (datafield == 'unitRate') {
            if (event.args.value.label != null && event.args.value.label != '' &&
                event.args.value.label != event.args.oldvalue.label) {
                var prod = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', row.productName);
                if (prod.multiUnitFlag) {
                    var unitRow = ComboBoxSources.getInfoMapByKey(prod.prodContainerList, 'unitName', event.args.value.label.replace(/\(.{0,}\)$/, ''))
                    row.unitRate = unitRow.rate;
                    if (unitRow.unitName != row.basicUnit) { //所选单位不是基本单位
                        row.unit = unitRow.unitName + '(' + row.unitRate + row.basicUnit + ')';
                    } else {
                        row.unit = unitRow.unitName;
                    }

                    if (sourceType == 'salePrice') {
                        row.priceBefore = unitRow.salePrice;
                    } else {
                        row.priceBefore = unitRow.purchasePrice;
                    }
                } else { //新增的单个单位
                    row.unit = event.args.value.label;
                    row.unitRate = 1;
                    row.basicUnit = event.args.value.label;
                }
            } else if (event.args.value.label == null || event.args.value.label == '') {
                row.unitRate = 1;
                row.basicUnit = '';
                row.unit = '';
            }
        } else { //(datafield != 'productName') 
            row[datafield] = event.args.value;
        }

        var row = table.jqxGrid('getrowdata', selectedrowindex);

        //	    if (datafield == 'productName') {
        //	    	
        //	    	var sourcesPorduct = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product,'name',productName);
        //	        $.setGoodsBinning(table, selectedrowindex, row, function() {
        //	            if (typeof settings.columnSumEvent === 'function') {
        //	                settings.columnSumEvent();
        //	            }
        //	        }, sourceType,false,table.jqxGrid('iscolumnvisible', 'totalCartons'),sourcesPorduct);
        //	    }

        //var row= table.jqxGrid('getrowdata', selectedrowindex);
        row.qty=(row.qty==''||row.qty=='NaN')?0:row.qty;
        var oldqty = row.qty;
        var arr2 = ['priceBefore'];
        for (var i = 0; i < arr2.length; i++) {
            var v = row[arr2[i]];
            row[arr2[i]] = money(v, 4, true);
        }
        
        computeRow(row);
        
        if (datafield == 'qty') {
            row.totalCartons = 0;
            row.eachCartons = 0;
            row.qty = oldqty;
        }
        var arr = ['weight', 'totalCartons', 'eachCartons', 'qty', 'extent', 'breadth', 'altitude', 'volume', 'tj', 'deliveiedQty', 'deliveryQtyNow'];
        for (var i = 0; i < arr.length; i++) {
            var v = row[arr[i]];
            row[arr[i]] = money(v, 4, true);
            var arrs = ['extent', 'breadth', 'altitude', 'volume'];
            if (arrs.indexOf(arr[i]) > -1) {
                row[arr[i]] = money(v, 4, true);
            }
        }
        //table.jqxGrid('refresh');
        var xrow = $.extend(true, {}, row);
        console.error(row)
        if (datafield == 'productName') {
            var prod_productName = xrow.productName;
            var commit = table.jqxGrid('updaterow', id, xrow);
            timeOut(function() {
                var row = table.jqxGrid('getrowdata', selectedrowindex);
                row.productName = prod_productName;
                console.error(row);
            }, 0)

            if (typeof settings.columnSumEvent === 'function') {
                settings.columnSumEvent();
            }
        } else {
            timeOut(function() {
                var commit = table.jqxGrid('updaterow', id, xrow);
                if (typeof settings.columnSumEvent === 'function') {
                    settings.columnSumEvent();
                }
            }, 0)
        }

        return true;

    });
    
    var fouroperations = function(expression, row, qtydatafield,bool) {
        var formulaMap = {
            meas: 'tj',
            weight: 'rowweight',
            price: 'priceBefore',
            eachCartons: 'eachCartons',
            totalCartons: 'totalCartons',
            qty: 'qty',
//            inventoryQty: 'inventoryQty'
            inventoryQty:'inventoryReducere'
        };
//        if (qtydatafield == 'purchaseNumber') {
//            formulaMap.price = 'cost';
//            formulaMap.totalCartons = 'purchaseEachCartons';
//            formulaMap.qty = 'purchaseNumber';
//        }
        //计算金额的公式，有库存数量
        if(expression.indexOf('inventoryQty')>-1){
        	expression=expression.replace('inventoryQty',row.inventoryQtyFormula);
        }
        var arr = expression.split(' ');
        for (var i = 0; i < arr.length; i++) {
            var line = formulaMap[arr[i]];
            if (line != null) {
                arr[i] = row[line];
                if (line == 'qty') {
                    arr[i] = row[qtydatafield];
                    
                    if(bool){
                    	arr[i] = row['qty'];
                        var unitRate = row.unitRate;
                        if (unitRate == null || unitRate == '') {
                            unitRate = 1;
                        }
                        if (addoredit == 'add') {
                            //单位
                            var productunitFlag = _global_settings.acOwner.productunitFlag;
                            if (productunitFlag) {
                                arr[i] = arr[i] * unitRate;
                            }
                        }
                        if (addoredit == 'edit' || addoredit == 'view') {
                            //单位
                            var productunitFlag = settings.order.productunitFlag;
                            if (productunitFlag) {
                                arr[i] = arr[i] * unitRate;
                            }
                        }
                    }
                }
                
//                if (qtydatafield == 'inventoryQty') { //计算库存减少
//                    //取aggregates里面第一个计算数量的字段
//                    arr[i] = row['qty'];
//                    var unitRate = row.unitRate;
//                    if (unitRate == null || unitRate == '') {
//                        unitRate = 1;
//                    }
//                    if (addoredit == 'add') {
//                        //单位
//                        var productunitFlag = _global_settings.acOwner.productunitFlag;
//                        if (productunitFlag) {
//                            arr[i] = arr[i] * unitRate;
//                        }
//                    }
//                    if (addoredit == 'edit' || addoredit == 'view') {
//                        //单位
//                        var productunitFlag = settings.order.productunitFlag;
//                        if (productunitFlag) {
//                            arr[i] = arr[i] * unitRate;
//                        }
//                    }
//                }
            }
        }
        console.log(arr)
        for(var i=0,len=arr.length;i<len;i++){
        	if(arr[i]==''){
        		arr[i]=0;
        	}
        }
        return eval(arr.join(''));
    };
    window.fouroperations = fouroperations;

    //内部dom挂载私有方法
    table[0].getData = function(objArr) { return getData(objArr) }

    table[0].getDataWash = function(objArr, checked) { return getDataWash(objArr, checked) }

    table[0].getDataDirty = function() { return getDataDirty() }

    table[0].addLastRow = function(name) { return addLastRow(name) }

    /*
     * source 
     * 
     * bool true不重新渲染列
     * */
    table[0].grid_render = function(source, bool) { grid_render(source, bool) }
}

$.fn.getData = function(objArr) {
    return $(this)[0].getData(objArr);
};
$.fn.getDataWash = function(checked) {;
    return $(this)[0].getDataWash($(this).getData(), checked);
};
$.fn.getDataDirty = function(objArr) {
    return $(this)[0].getDataDirty(objArr);
};
$.fn.addLastRow = function(name) {

    var t = $(this);
    var yes = {
        totalCartons: 0, //总箱数
        eachCartons: 0, //每箱数量
        prodSpecId: null, //规格型号
        prodColourId: null, //图片
        weight: null, //重量
        extent: null, //长
        breadth: null, //宽
        altitude: null, //高
        'tj': null //体积
    }
    var arr = []
    for (var i in yes) {
        try {
            if (!t.jqxGrid('iscolumnvisible', i)) {
                arr.push(i);
            }
        } catch (e) {}
    }
    t[0].grid_render(t[0].addLastRow(name));
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == 'totalCartons') {
            t.jqxGrid('setcolumnproperty', 'qty', 'editable', true);
        }
        t.jqxGrid('hidecolumn', arr[i]);
    }
    t.jqxGrid('hidecolumn', 'dzid');
};

$.fn.updateListRow = function(arrObj) {
    var t = $(this);
    t[0].grid_render(arrObj, false);
};
//获取当前选中行的数据
$.fn.getRowData = function() {
    var selectedrowindex = $(this).jqxGrid('getselectedrowindex');
    return $(this).jqxGrid('getrowdata', selectedrowindex);
};
//hide show
$.fn.boxSetting = function(visible, soOwnerId, userName) {
    var t = $(this);
    var type = visible == 'hide' ? 'hidecolumn' : 'showcolumn';
    var bool = visible == 'hide' ? true : false;
//    var arr = ['totalCartons', 'eachCartons', 'extent', 'breadth', 'altitude'];
    var arr = ['totalCartons', 'eachCartons'];

    if (_global_settings.acOwner.cartonType == 'volume') {
        arr = ['totalCartons', 'eachCartons', 'volume'];
    }

    for (var i = 0; i < arr.length; i++) {
        t.jqxGrid('beginupdate');
        t.jqxGrid(type, arr[i]);
        t.jqxGrid('endupdate');
    }
    t.jqxGrid('setcolumnproperty', 'qty', 'editable', bool);
};
$.fn.printOfGoodsFlag = function(visible, soOwnerId, userName) {

    var t = $(this);
    var type = visible == 'hide' ? 'hidecolumn' : 'showcolumn';

    //根据设置或隐藏
    if (_global_settings.acOwner.blueTooth) {
        if (t.attr('id').indexOf('ale') > -1) {
            type = 'hidecolumn';
        }
    }

    var arr = 'printOfGoods';
    t.jqxGrid('beginupdate');
    t.jqxGrid(type, arr);
    t.jqxGrid('endupdate');
};
$.fn.productMeasFlag = function(visible, soOwnerId, userName) {
    var t = $(this);
    var type = visible == 'hide' ? 'hidecolumn' : 'showcolumn';
    var arr = ['volume'];
    //根据设置或隐藏
    if (_global_settings.acOwner.cartonType == 'size' || _global_settings.acOwner.cartonType == null) {
        arr = ['extent', 'breadth', 'altitude'];
    }

    for (var i = 0; i < arr.length; i++) {
        t.jqxGrid('beginupdate');
        t.jqxGrid(type, arr[i]);
        t.jqxGrid('endupdate');
    }
};

/**
 * 根据clientId-客户id
 * productId产品id
 * prodSpecId规格型号id 设置 装箱尺寸
 * 
 * selector			表格id
 * id				选中编辑一行的id
 * _row				表数据（要保存的）
 * callback			回调函数
 * sourceType		类型（此项目只有salePrice小商版就不止一个类型，包括销售单和采购单）
 * isasync			是否异步
 * totalCartons		table.jqxGrid('iscolumnvisible', 'totalCartons')
 * sourcesProduct	当前产品缓存信息
 */
$.setGoodsBinning = function(selector, id, _row, callback, sourceType, isasync, totalCartons, sourcesProduct) {;
    var clientId = null;
    if (isasync === true) {

    } else {
        isasync = false;
    }
    $.visibleDoFunc($('.easyGridClientId'), function(x) {
        clientId = x.val();
    })

    var productName = _row.productName,
        productId = null,
        spec = _row.spec;

    for (var i in sourcesProduct) {
        if (productName == sourcesProduct['name']) {
            productId = sourcesProduct['id'];
        }
    }
    if (clientId == '' || clientId == null) {
        clientId = null;
    }
    if (productId == '' || productId == null) {
        return false;
    }
    if (spec == '' || spec == null) {
        spec = null;
    }
    if (sourceType == 'salePrice') {
        var url = _global_settings.service.url + '/SimpleAC/' + new Base64().encode('order/goodsBinning/' + clientId + '/' + productId + '/' + spec);
    } else {
        var url = _global_settings.service.url + '/SimpleAC/' + new Base64().encode('/order/goodsBinning/purchaseOrder/' + clientId + '/' + productId + '/' + spec)
    }
    Core.AjaxRequest({
        type: 'GET',
        showMsg: false,
        async: isasync,
        url: url,
        callback: function(res) {
            var row = selector.jqxGrid('getrowdata', id);
            var server_list = ['printOfGoods', 'weight', 'totalCartons', 'eachCartons', 'priceBefore', 'extent', 'breadth', 'altitude'];
            for (var i = 0; i < server_list.length; i++) {
                var num = res[server_list[i]];
                if (num != '' && num != null && num != 0)
                    row[server_list[i]] = res[server_list[i]];
            }
            if (totalCartons) {
                //				row.qty=money(row.totalCartons*row.eachCartons,2,true);
                row.qty = money(row.totalCartons * row.eachCartons, 4, true);
            } else {
                row.totalCartons = 0;
                row.eachCartons = 0;
                //				row.qty=money(row.qty,2,true);
                row.qty = money(row.qty, 4, true);
            }

            row.price3_server = money(row.priceBefore * row.qty);
            row.price3 = (row.priceBefore * row.qty);
            row.photoId = row.photoId === undefined ? sourcesProduct === undefined ? '' : sourcesProduct.prodPhoto : row.photoId;
            var commit = selector.jqxGrid('updaterow', id, row);

            if (typeof callback === 'function') {
                callback();
            }
        },
        failure: function(e) {;
        }
    })

};

var unitArr = []; //单位数组
//添加单位
var addUnitModal = function(grid) {
    //商户信息
    var ownerId = $('#' + grid).data().soownerid;
    var username = $('#' + grid).data().name;

    var initAddUnit = function() {
        var tr = '<tr><td><input data-index="0" data-blacklist=" " class="addLine" type="text"></td><td colspan="2"></td></tr>';
        $('#order_unitTbody').html('').append(tr);

        //获取商户单位
        Core.AjaxRequest({
            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/searchOwnerUnitTypeVO/' + ownerId + '/' + username),
            type: 'GET',
            async: false,
            callback: function(res) {
                //	        	console.log(res);
                initUnit(res);
            },
            failure: function() {

            }
        });

        $('#order_unitTbody').off('keyup').on('keyup', '.addLine', function(e) {
            var t = $(this);
            var v = t.val(),
                code = e.keyCode;
            if (code == 13) {
                if (v != '') {
                    if (check(v)) {
                        Core.alert({ message: '单位已存在，请重新输入！' });
                        $(this).val('');
                        return false;
                    }
                    var line = '<tr><td><input data-blacklist=" " class="addUnit" type="text" value="' + v + '"></td><td colspan="2"><span class="md-cancel delete"></span></td></tr>';
                    t.parents('tr').after(line);
                    t.val('');
                    _index(); //重置index
                    $('#order_unitTbody').find('.addUnit').off('blur').on('blur', _blur);
                }
            }
            //			console.log(e)
        });

        $('#order_unitTbody').find('.addUnit').off('blur').on('blur', _blur);

        $('#order_unitTbody').off('click').on('click', '.delete', function(e) {
            var t = $(this);
            Core.confirm({
                message: '确定要删除吗？',
                confirmCallback: function() {
                    t.parents('tr').remove();
                    _index();
                }
            })
        });

        $('#order_addUnit').modal('show');

        saveUnit();
    }

    //检查重复
    var check = function(value) {
        var bool = false;
        var tr = $('#order_unitTbody').find('tr:gt(0)');
        for (var i = 0, len = tr.length; i < len; i++) {
            if (tr.eq(i).find('input').val() == value) {
                return true;
            }
        }

        return bool;
    }

    var _blur = function() {
        var t = $(this);
        var index = t.attr('data-index');
        var oldv = t.attr('value');
        var newv = t.val();
        if (newv != oldv) {
            if (checkAll(t, newv, index)) {
                Core.alert({ message: '第' + index + '行单位已存在，请重新填写！' });
                t.val(oldv);
                return false;
            }
        }
    }

    //检查重复
    var checkAll = function(t, value, inx) {
        var bool = false;
        var tr = $('#order_unitTbody').find('tr');
        for (var i = 0, len = tr.length; i < len; i++) {
            if (i != inx) {
                if (tr.eq(i).find('input').val() == value) {
                    return true;
                }
            }
        }

        return bool;
    }

    var _index = function() {
        var tr = $('#order_unitTbody').find('tr');
        for (var i = 0, len = tr.length; i < len; i++) {
            tr.eq(i).find('input').attr('data-index', i);
        }
    }

    var initUnit = function(data) {
        console.log('============' + unitArr);
        for (var i = 0; i < unitArr.length; i++) {
            var tr = '<tr>' +
                //					'<td><input readonly type="text" data-value="'+data[i].unitGroupName+'" value="'+data[i].unitGroupName+'"></td>'+
                '<td><input data-index="' + (i + 1) + '" data-blacklist=" " type="text" class="addUnit" value="' + unitArr[i].unitName + '"></td>' +
                '<td colspan="2"><span class="md-cancel delete"></span></td></tr>';
            $('#order_unitTbody').append(tr);
        }
        for (var i = 0; i < data.length; i++) {
            var tr = '<tr>' +
                //					'<td><input readonly type="text" data-value="'+data[i].unitGroupName+'" value="'+data[i].unitGroupName+'"></td>'+
                '<td><input readonly type="text" value="' + data[i].unitGroupName + '"></td>' +
                '<td colspan="2"></td></tr>';
            $('#order_unitTbody').append(tr);
        }
    }

    //保存
    var saveUnit = function() {
        $('#save_addUnitBtn').on('click', function() {
            unitArr = [];
            var tr = $('#order_unitTbody').find('tr');
            $.each(tr, function(i, v) {
                var t = $(v);
                var value = t.find('input').val();
                var r = t.find('input').attr('readonly');
                //				console.log(r);
                if (value != '') {
                    if (!r) {
                        var obj = {
                            unitName: value,
                            rate: 1
                        }
                        unitArr.push(obj);
                    }
                }
            });
        });
    }

    if ($('#order_addUnit').length == 0) {
        $.loadModal('page/common/segment/addUnit.html', function(res) {
            $('body').append(res);
            initAddUnit();
        });
    } else {
        initAddUnit();
    }
}

/**
 * 添加产品图片
 * gridName		grid名字
 * proId		产品id
 * sourceType	销售或者采购
 * 
 * 整体思路
 * 打开弹框，显示原本客户带过来的，新增自己新增的。
 * 新增的没有pid，从小商那边过来的有pid（当前选择的id）
 * 这一步保存是前台做，后台值记录当前这一条销售单的所有信息。
 * 因此涉及到规格型号，颜色，产品图片的一系列操作先是只在客户端保存，再将这条信息放到当前销售单里面去。再提交至服务器端
 */
var photoModal = function(gridName, productSourceName) {

    var selectedrowindex = $('#' + gridName).jqxGrid('getselectedrowindex');
    var arr = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
    var ownerId = $('#' + gridName).data().soownerid;
    var name = $('#' + gridName).data().name;
    var productName = arr.productName;
    if (productName == null || productName == '') {
        Core.alert({ message: '请选择产品' });
        return false;
    }

    var pro = productSourceName.product;
    //	getProductInUsePart(ownerId, name, function(res) {
    //		pro = res.product;
    //	});

    var product = ComboBoxSources.getInfoMapByKey(pro, 'name', productName);

    //2017-11-27注释
//    if (product.prodPhoto != null && product.prodPhoto != '') {
//        return false;
//    }
    var photoModal_reset = function() {
        $("#photoModal_list").html('<div style="width: 258.66px; height: 166px; position: relative;">  ' +
            '	<img class="img0" border="0" src="images/common/photo_icon2.png"' +
            '		width="100%" height="100%"> <i                              ' +
            '		class="md-cancel close-lab"></i>                            ' +
            '</div>                                                             ' +
            '<input type="file" class="file0" style="display: none"             ' +
            '	name="file">                                                    ');
        photoModal_event();
        $("#photoModal").modal("show");
    };
    var photoModal_event = function(totalCartons) {

        //保存----这一步是前台做，不请求接口，图片上传那一步是请求接口
        $('#photoModal_saveBtn').off('click').on('click', function() {

            try {
                var product = ComboBoxSources.getInfoMapByKey(pro, 'name', productName);
                product.prodPhoto = $("#photoModal").find('.file0').data('id');
                if (product.prodPhoto == null || product.prodPhoto == '') {
                    Core.alert({ message: '请上传产品图片' });
                    throw new Error('请上传产品图片');
                }
                product.name = product._name;
                delete product._name;

                var obj = {
                    pid: product.id,
                    photoId: product.prodPhoto
                }

                $("#photoModal").modal("hide");
                arr.photoId = product.prodPhoto;
                arr.oldPhotoId = arr.photoId;
                var commit = $('#' + gridName).jqxGrid('updaterow', selectedrowindex, arr);
            } catch (e) {
                //				Core.alert({message:'文件上传失败！'});
            }
        })
    };
    if ($("#photoModal").length == 0) {
        $.loadModal("page/common/segment/photoModal.html", function(res) {
            var html = $(res);
            $('body').append(html);

            $('#photoModal').on('click', '.close-lab', function(event) {
                var t = $(this);
                var parent = $(this).parents('form');

                var dataId = t.data('id');
                if (dataId != '' && dataId != null) {
                    Core.AjaxRequest({
                        url: ws_url + '/CXF/rs/common/file/' + dataId,
                        type: 'DELETE',
                        showMsg: false,
                        callback: function(res) {
                            parent.find('.file0').val('');
                            parent.find('.img0').attr('src', 'images/common/photo_icon2.png');
                            parent.find('.file0').data('id', '');
                            t.data('id', '');
                        },
                        failure: function(res) {}
                    });
                    return false;
                }
            });
            $('#photoModal').on('click', '.img0', function() {
                    if ($(this).attr('src').indexOf('images/common') == -1) {
                        return;
                    }
                    $(this).parents('form').find('.file0').trigger('click');
                })
                //颜色文件
            $('#photoModal').on('change', '.file0', function() {;
                var t = $(this);
                var objUrl = getObjectURL(this.files[0]);
                var ownerId = $('#' + gridName).attr('data-soOwnerId');
                var name = $('#' + gridName).attr('data-name');
                console.log("objUrl = " + objUrl);
                if (uploadImage(t, t.parents('form'), ownerId, name)) {
                    timeOut(function() {
                        t.parents('form').find('.img0').attr("src", objUrl);
                    });
                }
            });
            photoModal_reset();
        });
    } else {
        photoModal_reset();
    }
};

/**
 * 添加颜色
 * gridName		grid名字
 * proId		产品id
 * sourceType	销售或者采购
 * 
 * 整体思路
 * 打开弹框，显示原本客户带过来的，新增自己新增的。
 * 新增的没有pid，从小商那边过来的有pid（当前选择的id）
 * 这一步保存是前台做，后台值记录当前这一条销售单的所有信息。
 * 因此涉及到规格型号，颜色，产品图片的一系列操作先是只在客户端保存，再将这条信息放到当前销售单里面去。再提交至服务器端
 * ocr这边并不建议做删除功能，因为规格型号和颜色都是前台做的保存，特别是如果出现删除非当前行这种情况，前台是操控不了这种数据删除的
 */

var colorModal = function(gridName, prodId, sourceType, productSourceName) {
    //var product=$('#'+gridName).getRowData();
    //	console.log(product)
    var selectedrowindex = $('#' + gridName).jqxGrid('getselectedrowindex');
    var arr = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
    var ownerId = $('#' + gridName).attr('data-soOwnerId');
    var name = $('#' + gridName).attr('data-name');
    var productName = arr.productName;
    var productId = null;

    var pro = productSourceName.product;
    //	getProductInUsePart(ownerId, name, function(res) {
    //		pro = res.product;
    //	});
    if (productName != undefined) {
        $.each(pro, function(i, v) {
            if (v['name'] == productName) {
                productId = v['id']
            }
        });
    }

    $('#colorModal_id').val(productName);
    $('#colorModal_search_text').val('');
    var txt = '';
    if (gridName.indexOf('Sale') > -1) {
        txt = '销售';
    } else {
        txt = '采购';
    }
    var totalCartons = false;
    try {
        totalCartons = $('#' + gridName).jqxGrid('iscolumnvisible', 'totalCartons');
    } catch (e) {}
    var numPlaceholder = '';
    if (totalCartons) {
        numPlaceholder = '箱数';
    } else {
        numPlaceholder = txt + '数量';
    }
    if (productName == null || productName == '') {
        Core.alert({ message: '请选择产品' });
        return false;
    }

    var load_html = function(prodColourList) {
        var prodColourHtml = '';
        $.each(prodColourList, function(i, v) {
            var src = "images/common/photo_icon2.png";

            var photo = null;
            if (v.photo != null && v.photo != '' && v.photo != 'undefined') {
                photo = v.photo;
                src = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + photo + '/' + ownerId + '/' + name);
            }

            var descr = v.descr === undefined ? v.name === undefined ? v.typeValue === undefined ? '' : v.typeValue : v.name : v.descr;

            var html = ' <form class="col-md-3 imgFile" style="padding-bottom: 40pt;">                                                                                                                         ' +
                '	       <div class="col-md-12">                                                                                                                      ' +
                '			  <div class="colorModalImgCell">                                                                                                                    ' +
                '			      <img title="查看大图" src="' + src + '" style="width: 100%; height: 100%;" class="img0"> ' +
                //			'<i class="md-cancel close-lab" data-id="'+v.photo+'" data-pid="'+v.id+'"></i>'+
                '			  </div>                                                                                                                                    ' +
                '			  <input type="file" name="file" data-id="' + v.photo + '" data-pid="' + v.id + '" style="display:none" class="file0">                                        ' +
                '			  <div class="m-t-10 relative proTypeLabel" style=" width: 190pt;background: #f8f9f9;color: #53687D;">                                                                                                ' +
                '			      <div class="text-center seifColorDefine" >' +
                '<div class="prod_checkbox">' +
                '<input type="checkbox" class="prod_specCheck prod_checkbox_left" data-pid="' + v.id + '">' +
                '<span class="prod_checkbox_left_img" data-checked="' + v.likeFlag + '" data-pid="' + v.id + '"  data-type="colour"></span></div>' +
                '<input  style="80%" class="prod_specText" data-oldvalue="' + descr + '" placeholder="颜色描述" data-pid="' + v.id + '" data-orderflag="' + v.orderFlag + '" value="' + descr + '">' +
                //			'|<input class="prod_specNum" placeholder="'+numPlaceholder+'"></div>                                                         '+
                '</div>                                                         ' +
                //			'				  <i class="md-cancel close-lab"></i>'+
                '			  </div>                                                                                                                                    ' +
                '	       </div>                                                                                                                                       ' +
                '	   </form>';
            prodColourHtml += html;
        })
        return prodColourHtml;
    }

    var colorModal_search = function(descr, id) {
        Core.AjaxRequest({
            type: "GET",
            showWaiting: false,
            url: _global_settings.service.url + "/product/searchcolor/" + descr + "/" + id,
            callback: function(res) {
                var prodColourList = res;
                var prodColourHtml = load_html(prodColourList);
                $("#colorModal").find('.colorModalList').html(prodColourHtml);
                $("#colorModal").find('.colorModalList').find('.prod_specNum').moneyinput({ textalign: 'center', noEndZero: true });
            }
        });
    }

    var colorModal_reset = function() {
        //禁用回车
        $('#colorModal').keydown(function(e) {
            if (e.keyCode == 13) return false;
            return true;
        });

        $("#colorModal").find('.colorModalList').html('');
        var selectedrowindex = $('#' + gridName).jqxGrid('getselectedrowindex');
        var arr = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
        var records = $('#' + gridName).jqxGrid('source').records;
        var currentColorData = arr.currentColorData;
        var id = arr.id;
        var ownerId = $('#' + gridName).data().soownerid;
        var userName = $('#' + gridName).data().name;

        if (productId != undefined) {
            //从数据库读到的当前产品id
            Core.AjaxRequest({
                type: "GET",
                showWaiting: false,
                url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/productid/' + productId + '/' + ownerId + '/' + userName),
                callback: function(res) {
                    //产品数据
                    var prodColourList = res.prodColourList;
                    if (modallist[res.name] != null) {
                        if (modallist[res.name].colorModalList != undefined) {
                            prodColourList = prodColourList.concat(modallist[res.name].colorModalList);
                            for (var j = 0; j < prodColourList.length; j++) {
                                $.each(records, function(i, v) {
                                    if (v.color != undefined && v.color != '' && v.color != null) {
                                        if (prodColourList[j].name == v.color) {
                                            if (prodColourList[j].photo == '' || prodColourList[j].photo == undefined || prodColourList[j].photo == null) {
                                                //如果图片不存在，有两种情况，一是没有上传图片，二是先填写颜色描述，再上传图片
                                                if (v.photoAddId != '' && v.photoAddId != undefined) {
                                                    //情况二
                                                    prodColourList[j].photo = v.photoAddId;
                                                } else {
                                                    //情况一
                                                    prodColourList[j].photo = '';
                                                }
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    }
                    var prodColourHtml = load_html(prodColourList);
                    $("#colorModal").find('.colorModalList').html(prodColourHtml);

                    var proColor = $("#colorModal").find('.prod_specText');
                    $.each(proColor, function(i, v) {
                        var pid = proColor.eq(i).attr('data-pid');
                        if (pid != 'undefined' && pid != '' && pid != null && pid != undefined) {
                            $("#colorModal").find('.close-lab').removeClass('md-cancel');
                            $("#colorModal").find('.prod_specText').eq(i).attr('disabled', true);
                        }
                        if ($(this).val() == arr.color) {
                            $(this).parent().find('.prod_specCheck').attr('checked', true);
                        }
                    });

                    $("#colorModal").find('.colorModalList').find('.prod_specNum').moneyinput({ textalign: 'center', noEndZero: true });
                    colorModal_event(totalCartons);
                    $("#colorModal").modal("show");
                    return;
                }
            });
        } else {
            //自己新增的
            var prodColourList = [];
            Core.AjaxRequest({
                type: "GET",
                showWaiting: false,
                async: false,
                url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/searchOwnerColor/' + ownerId + '/' + userName),
                callback: function(res) {
                    var arr = [];
                    for (var i = 0; i < res.length; i++) {
                        arr[i] = {};
                        arr[i].id = res[i].id;
                        arr[i].descr = res[i].typeValue;
                    }
                    prodColourList = prodColourList.concat(res);

                }
            })
            if (modallist[productName] != null) {
                if (modallist[productName].colorModalList != undefined) {
                    prodColourList = prodColourList.concat(modallist[productName].colorModalList);
                }
                $.each(prodColourList, function(j, k) {
                    $.each(records, function(i, v) {
                        if (v.color != undefined && v.color != '' && v.color != null) {
                            if (prodColourList[j].name == v.color) {
                                if (prodColourList[j].photo == '' || prodColourList[j].photo == undefined || prodColourList[j].photo == null) {
                                    //如果图片不存在，有两种情况，一是没有上传图片，二是先填写颜色描述，再上传图片
                                    if (v.photoAddId != '' && v.photoAddId != undefined) {
                                        //情况二
                                        prodColourList[j].photo = v.photoAddId;
                                    } else {
                                        //情况一
                                        prodColourList[j].photo = '';
                                    }
                                }
                            }
                        }
                    })
                })
            }
            var prodColourHtml = load_html(prodColourList);
            $("#colorModal").find('.colorModalList').html(prodColourHtml);

            var proColor = $("#colorModal").find('.prod_specText');
            $.each(proColor, function(i, v) {
                var pid = proColor.eq(i).attr('data-pid');
                if (pid != 'undefined' && pid != '' && pid != null && pid != undefined) {
                    $("#colorModal").find('.close-lab').removeClass('md-cancel');
                    $("#colorModal").find('.prod_specText').eq(i).attr('disabled', true);
                }

                if ($(this).val() == arr.color) {
                    $(this).parent().find('.prod_specCheck').attr('checked', true);
                }
            });

            $("#colorModal").find('.colorModalList').find('.prod_specNum').moneyinput({ textalign: 'center', noEndZero: true });
            colorModal_event(totalCartons);
            $("#colorModal").modal("show");
            return;
        }
    };
    var colorModal_event = function(totalCartons) {
        //颜色详情自定义
        $('#colorModalListAddBtn').off('click').on('click', function() {
            var t = $('.colorModalList');
            var la = $(' <form class="col-md-3 imgFile" style="padding-bottom: 40pt;">                                                                                                                         ' +
                '	       <div class="col-md-12">                                                                                                                      ' +
                '			  <div class="colorModalImgCell">                                                                                                                    ' +
                '			      <img src="images/common/photo_icon2.png" style="width: 100%; height: 100%;position: relative;" class="img0"> ' +
                //    		'<i class="md-cancel close-lab"></i>'+
                '			  </div>                                                                                                                                    ' +
                '			  <input type="file" name="file" multiple="multiple" style="display:none" class="file0">                                        ' +
                '			  <div class="m-t-10 relative proTypeLabel" style=" width: 190pt;background: #f8f9f9;color: #53687D;">                                                                                                ' +
                '<div class="prod_checkbox">' +
                '<input type="checkbox" checked="true" class="prod_specCheck prod_checkbox_left">' +
                '<span class="prod_checkbox_left_img" data-checked="false"  data-type="colour"></span></div>' +
                //    		'<input class="prod_specText" placeholder="颜色描述" data-orderFlag="false" value="">|<input class="prod_specNum" placeholder="'+numPlaceholder+'"></div>                                                         '+
                '<input  style="width:80%" class="prod_specText" data-blacklist=" " placeholder="颜色描述" data-orderFlag="false" value=""></div>                                                         ' +
                //    		'				  <i class="md-cancel close-lab"></i>'+
                '			  </div>                                                                                                                                    ' +
                '	       </div>                                                                                                                                       ' +
                '	   </form>');
            la.find('.prod_specNum').moneyinput({ textalign: 'center', noEndZero: true });
            t.prepend(la);
            $('.colorModalList').find('.prod_specText').eq(0).focus();
            
            $('.colorModalList').find('.prod_specText').on('input',function(){
            	var val=$(this).val();
            	$(this).val(val.replace(/ /g, ''));
            });
        });
        var editColor = function(isOldValue) {
            var ownerId = $('#' + gridName).attr('data-soOwnerId');
            var username = $('#' + gridName).attr('data-name');
            var colorLabel = $('.colorModalList').find('.imgFile');

            ComboBoxSources.getInfoMapByKey(pro, 'name');
            var arrCol = [];
            var addList = [];

            $.each(colorLabel, function(i, value) {
                var t = $(this);
                var descr = '';
                if (isOldValue == true) {
                    if (t.find('.prod_specText').data('oldvalue') != null) {
                        descr = t.find('.prod_specText').data('oldvalue');
                    } else {
                        descr = t.find('.prod_specText').val();
                    }
                } else {
                    descr = t.find('.prod_specText').val();
                }
                var obj = {
                    color: descr,
                    orderFlag: t.find('.prod_specText').data('orderflag'),
                    photoAddId: t.find('.file0').data('id') == 'undefined' ? undefined : t.find('.file0').data('id'),
                    qty: '',
                    id: t.find('.file0').data('pid')
                }
                var addObj = {
                    id: t.find('.file0').data('pid'),
                    qty: t.find('.prod_specNum').val(),
                    color: t.find('.prod_specText').val(),
                    photoAddId: t.find('.file0').data('id') == 'undefined' ? undefined : t.find('.file0').data('id'),
                    orderFlag: t.find('.prod_specText').data('orderflag')
                }
                if (obj.color == '' && obj.photoAddId != null) {
                    Core.alert({ message: '颜色描述不能为空' });
                    throw '颜色描述不能为空';
                }
                if (obj.color != '' || (obj.photoId != null && obj.photoId != '')) {
                    arrCol.push(obj);
                    if (t.find('.prod_specCheck').is(':checked')) {
                        addList.push(addObj);
                    }
                }
            })

            $("#colorModal").modal("hide");
            var row = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
            var needAddList = [];
            var prodList = ComboBoxSources.getInfoMapByKey(pro, 'name');
            var _prodObj = prodList[productName];

            //循环保存的信息
            if (addList.length > 0) {
                for (var j = 0; j < addList.length; j++) {
                    var obj = {};
                    obj.id = productId;
                    obj.productName = row.productName;
                    obj.photoAddId = addList[j].photoAddId;
                    obj.color = addList[j].color;

                    //带下去规格
                    obj.spec = row.spec;
                    obj.photoId = addList[j].photoAddId;
                    if (obj.photoId == '' || obj.photoId == null) { //如果没有产品图片
                        if (_prodObj != undefined) { //如果产品是新增的
                            obj.photoId = _prodObj.prodPhoto;
                        } else {
                            obj.photoId = addList[j].photoAddId; //那么显示颜色图片
                        }
                    }
                    needAddList.push(obj);
                }
            }
            var arr = $.extend(true, $('#' + gridName).jqxGrid('source').records, []);
            var lastarr = arr.splice(selectedrowindex + 1);

            var needAddList_0 = needAddList.shift();
            //造一个row替换选中row
            var _row = arr.pop();
            //_row.dzid=null;
            if (needAddList_0 == null) {
                _row.photoAddId = null;
                _row.color = '';
                if (_prodObj != undefined) {
                    _row.photoId = _prodObj.prodPhoto;
                    _row.oldPhotoId = _prodObj.prodPhoto;
                } else {
                    _row.photoId = '';
                    _row.oldPhotoId = '';
                }
            } else {
                _row.id = needAddList_0.id;
                _row.productName = needAddList_0.productName;
                _row.photoAddId = needAddList_0.photoAddId;
                _row.color = needAddList_0.color;
                _row.oldPhotoId = _row.photoId;
                _row.photoId = needAddList_0.photoAddId;
                if (_row.photoId == '' || _row.photoId == null) { //如果产品没有图片
                    if (_prodObj != undefined) {
                        _row.photoId = _prodObj.prodPhoto; //如果产品不是新增的，则显示产品自带图片
                    } else { //如果产品是新增的
                        if (needAddList_0.photoAddId != undefined && needAddList_0.photoAddId != '') {
                            _row.photoId = addList[j].photoAddId; //那么显示颜色图片
                        } else {
                            _row.photoId = _row.oldPhotoId; //如果颜色没有图片，那么显示产品图片
                        }

                    }
                }
            }

            needAddList.unshift(_row);

            arr = arr.concat(needAddList).concat(lastarr);
            arr = $('#' + gridName).getData(arr);

            $('#' + gridName).updateListRow(arr);
            $('#' + gridName).trigger('resetColumnSum');

            //			 var id=selectedrowindex;
            //			 var sourcesPorduct = ComboBoxSources.getInfoMapByKey(pro,'name',productName);
            //			 for(var i=0;i<addList.length;i++){
            //				 var row=$('#'+gridName).jqxGrid('getrowdata', id);
            ////				 row.currentColorData = arrCol;
            //				 $.setGoodsBinning($('#'+gridName),id, row,function(){
            //					 $('#'+gridName).trigger('resetColumnSum');
            //				 },sourceType,true,totalCartons, sourcesPorduct);
            //				 id++;
            //			 }
        }

        //搜索颜色
        $('#colorModal_search_Btn').off('click').on('click', function() {
            var t = $('#colorModal_search_text').val();
            if (t == '') {
                t = '%20';
            }
            var id = productId;
            colorModal_search(t, id);
        })

        //新增编辑颜色
        $('.colorModalList').off('blur', '.prod_specText')
            .on('blur', '.prod_specText', function(event) {
                var t = $(this);
                if ((t.data('pid') == 'undefined' || t.data('pid') == undefined) && t.val() != '') {
                    var name = t.val();
                    var photo = t.parents('.imgFile').find('.file0').data('id');
                    if (photo == 'undefined' || photo == undefined) {
                        photo = '';
                    }
                    var list = {
                        name: name,
                        photo: photo
                    }
                    prodmodallist(arr.productName, 'colorModalList', list, t.data('oldvalue'));
                    t.data('oldvalue', name);
                    return;
                } else if (t.data('pid') != null) {
                    return;
                }
            })

        $('#colorModal_saveBtn').off('click').on('click', function() {
            //颜色
            editColor();
            return;
            var choose = false;
            var selfDefineSpec = $('#colorModal').find('.seifColorDefine').find('.prod_specText');
            $.each(selfDefineSpec, function(i, value) {
                var t = $(this);
                var orderflag = t.data('orderflag') == null ? '' : t.data('orderflag').toString();
                if (t.data('oldvalue') != t.val() && orderflag == 'true') {
                    choose = true;
                    return false;
                }
            })
            if (choose) {
                Core.confirm({
                    message: "检查到您修改的颜色，已经被订单使用，是否继续修改，绑定的单据会一起改变。",
                    yes: '继续',
                    confirmCallback: function() {
                        editColor();
                    },
                    cancelCallback: function() {
                        editColor(true);
                    }
                });
            } else {
                editColor();
            }
        })
    };
    if ($("#colorModal").length == 0) {
        $.loadModal("page/common/segment/colorModal.html", function(res) {
            var html = $(res);
            $('body').append(html);

            $('#colorModal_id').val(productName);

            $('#colorModal').on('click', '.close-lab', function(event) {
                var t = $(this);
                var parent = $(this).parents('form');
                var length = $('#edit-colorList').children().length;

                var id = $(this).data('pid');
                var indexs = $(this).index();

                var dataId = t.data('id');
                if (dataId != '' && dataId != null) {
                    parent.find('.file0').val('');
                    parent.find('.img0').attr('src', 'images/common/photo_icon2.png');
                    parent.find('.file0').data('id', '');
                    t.data('id', '');
                    return false;
                }
                ///////////////////////////////////////////////////////////////////////////////////////////////////////
                //删除有两种情况	客户新增和自己新增
                //ocr这边并不建议做删除功能，因为规格型号和颜色都是前台做的保存，特别是如果出现删除非当前行这种情况，前台是操控不了这种数据删除的

                if (id != null && id != '' && id != 'undefined') { //客户自己新增的不可删除
                } else {
                    //前台删除自己新增的颜色	有两种况，删除当前行和删除非当前行	此处是前台增删改查，没有通过后台。所以此处只做可以删除当前行这一种情况
                    //删除当前行数据，如果
                    Core.confirm({
                        message: '确定要删除？',
                        confirmCallback: function() {
                            parent.remove();
                            var arr = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
                            removeArrayByIndex(window.modallist[arr.productName].colorModalList, indexs);
                        }
                    })
                }
            });
            $('.colorModalList').on('click', '.img0', function() {
                    if ($(this).attr('src').indexOf('images/common') == -1) {
                        return;
                    }
                    $(this).parents('form').find('.file0').trigger('click');
                })
                //颜色文件
            $('.colorModalList').on('change', '.file0', function() {;
                var t = $(this);
                var objUrl = getObjectURL(this.files[0]);
                var arr = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
                var ownerId = $('#' + gridName).attr('data-soOwnerId');
                var name = $('#' + gridName).attr('data-name');
                console.log("objUrl = " + objUrl);
                if (uploadImage(t, t.parents('form'), ownerId, name)) {
                    timeOut(function() {
                        t.parents('form').find('.img0').attr("src", objUrl);
                    })
                }
            });
            colorModal_reset();
        });
    } else {
        colorModal_reset();
    }
};

//建立一个可存取file的url
var getObjectURL = function(file) {
        var url = null;
        if (window.createObjectURL != undefined) { // basic
            url = window.createObjectURL(file);
        } else if (window.URL != undefined) { // mozilla(firefox)
            url = window.URL.createObjectURL(file);
        } else if (window.webkitURL != undefined) { // webkit or chrome
            url = window.webkitURL.createObjectURL(file);
        }
        return url;
    }
    /**
     * 上传产品图片----POST
     *
     * fileInput		文件input
     * fileForm			文件form
     * ownerId			当前客户ownerid
     * name				当前客户姓名
     */
var uploadImage = function(fileInput, fileForm, ownerId, name) {
        //判断是否有选择上传文件
        if (!checkFileType(fileInput)) {
            return false;
        };
        var postImgBase64 = function(content) {
            var url = ctx + '/CXF/rs/SimpleAC/file/' + new Base64().encode('toocr/order/file/' + ownerId + '/' + name);
            var formData = new FormData();

            function dataURLtoBlob(dataurl) {
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            }
            //test:
            var blob = dataURLtoBlob(content);
            //var blob = new Blob([content]);

            //formData.append("webmasterfile", blob);
            var file = fileInput[0].files[0];
            //
            $.each(file, function(k, v) {
                formData.append(k, v);
            });
            formData.append('file', blob,
                file.name);
            console.log(formData);
            $.ajax({
                type: "POST",
                url: url,
                data: formData,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function(data) {;
                    fileInput.data('id', data.id);
                    if (fileForm.attr('class').indexOf('imgFile') > -1) {
                        fileForm.find('.close-lab').data('id', data.id);
                    }
                    //提交颜色
                    if (fileInput.parents('.colorModalList').length > 0) {
                        var name = fileInput.parents('.imgFile').find('.prod_specText').val();
                        if (name == '') {
                            //Core.alert({message:'规格描述不能为空'});
                            return false;
                        }
                        var productName = $('#colorModal_id').val();
                        var photo = data.id;
                        var list = {
                            productName: productName,
                            //			    			id:fileInput.parents('.imgFile').find('.prod_specText').data('pid'),
                            photoAddId: photo,
                            color: name
                        }
                    } else if (fileInput.parents('#photoModal_list').length > 0) {
                        //上传产品图片部分
                        fileInput.parents('#photoModal_list').find('.file0').data('id', data.id);
                    }
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //alert("上传失败，请检查网络后重试");
                    Core.alert({ message: '上传失败，请检查文件格式或刷新后重试！' });
                }
            });
        }
        timeOut(function() {
            var imgBase = new imgBase64(fileInput);
            imgBase.toDataURL(fileInput.parents('.imgFile').find('img')[0], postImgBase64);
        })

        return true;
    }
    //文件检测，只能上传图片
var checkFileType = function(selector) {
    var imgPath = '';
    if (typeof selector === 'string') {
        imgPath = selector;
    } else {
        imgPath = selector.val();
    }

    if (imgPath == "") {
        if (typeof selector !== 'string') {
            Core.alert({
                message: '请选择上传图片！'
            });
            selector.parents('form').find('img').attr('src', 'images/common/photo_icon2.png');
        }
        return;
    }
    var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
    if (strExtension != 'jpg' && strExtension != 'jpeg' && strExtension != 'gif' &&
        strExtension != 'png' && strExtension != 'bmp') {
        if (typeof selector !== 'string') {
            Core.alert({
                message: '请选择图片文件！'
            });
        }

        return false;
    }
    return true;
}

/**
 * 添加规格型号
 * gridName		grid名字
 * proId		产品id
 * sourceType	销售或者采购
 * 
 * 整体思路
 * 打开弹框，显示原本客户带过来的，新增自己新增的。
 * 新增的没有pid，从小商那边过来的有pid（当前选择的id）
 * 这一步保存是前台做，后台值记录当前这一条销售单的所有信息。
 * 因此涉及到规格型号，颜色，产品图片的一系列操作先是只在客户端保存，再将这条信息放到当前销售单里面去。再提交至服务器端
 * ocr这边并不建议做删除功能，因为规格型号和颜色都是前台做的保存，特别是如果出现删除非当前行这种情况，前台是操控不了这种数据删除的
 */

var specModal2 = function(gridName, prodId, sourceType, productSourceName) {
    var selectedrowindex = $('#' + gridName).jqxGrid('getselectedrowindex');
    var arr = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
    var productId = arr.id;
    var productName = arr.productName;
    var soOwnerId = $('#' + gridName).attr('data-soOwnerId');
    var userName = $('#' + gridName).attr('data-name');

    var txt = '';
    if (gridName.indexOf('Sale') > -1) {
        txt = '销售';
    } else {
        txt = '采购';
    }
    var totalCartons = false;
    try {
        totalCartons = $('#' + gridName).jqxGrid('iscolumnvisible', 'totalCartons');
    } catch (e) {}
    var numPlaceholder = '';
    if (totalCartons) {
        numPlaceholder = '箱数';
    } else {
        numPlaceholder = txt + '数量';
    }
    if (productName == null || productName == '') {
        Core.alert({ message: '请选择产品' });
        return false;
    }

    var product = productSourceName.product;
    //	getProductInUsePart(soOwnerId, userName, function(res) {
    //		product = res.product;
    //	});
    //	console.log(productSourceName)
    //	console.log(product)
    var currentPorduct = ComboBoxSources.getInfoMapByKey(product, 'name', productName);

    var specModal_event = function(totalCartons, soOwnerId, userName, currentPorduct) {
        var editSpec = function(isOldValue) {;
                var selfDefineSpec = $('#specModal2').find('.selfDefine');
                //规格型号
                var arrSpec = []; //查所有
                var addList = []; //查新增
                var hashmap = {};
                $.each(selfDefineSpec, function(i, v) {
                    var t = $(this);
                    var descr = '';
                    if (isOldValue == true) {
                        if (t.find('.prod_specText').data('oldvalue') != null) {
                            descr = t.find('.prod_specText').data('oldvalue');
                        } else {
                            descr = t.find('.prod_specText').val();
                        }
                    } else {
                        descr = t.find('.prod_specText').val();
                    }
                    var obj = {
                        id: t.find('.prod_specText').data('pid'),
                        spec: descr,
                        specFlag: t.find('.prod_specText').data('orderflag'),
                        qty: t.find('.prod_specNum').data('qty') == undefined ? t.find('.prod_specNum').val() == undefined ? '0' : t.find('.prod_specNum').val() : t.find('.prod_specNum').data('qty'),
                    }
                    var addObj = {
                        id: t.find('.prod_specText').data('pid'),
                        spec: t.find('.prod_specText').val(),
                        qty: t.find('.prod_specNum').data('qty') == undefined ? t.find('.prod_specNum').val() == undefined ? '0' : t.find('.prod_specNum').val() : t.find('.prod_specNum').data('qty'),
                    }
                    if (obj.spec != '') {
                        hashmap[obj.spec.toLowerCase()] = true;
                        arrSpec.push(obj)
                        if (t.find('.prod_specCheck').is(':checked')) {
                            addList.push(addObj);
                        }
                    }
                })
                currentPorduct.prodSpecList = arrSpec;
                currentPorduct.name = currentPorduct._name;
                delete product._name;

                $("#specModal2").modal("hide");

                var needAddList = []; //需要新增的
                var row = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);

                var _prodObj = currentPorduct;
                for (var j = 0; j < addList.length; j++) {
                    var obj = {};
                    obj.photoId = row.photoId;
                    obj.productName = row.productName;
                    obj.color = row.color;
                    //				 obj.qty=addList[j].qty;
                    obj.spec = addList[j].spec;
                    needAddList.push(obj);

                }
                var arr = $.extend(true, $('#' + gridName).jqxGrid('source').records, []);
                var lastarr = arr.splice(selectedrowindex + 1);

                var needAddList_0 = needAddList.shift();
                //造一个row替换选中row
                var _row = arr.pop();
                //_row.dzid=null;
                if (needAddList_0 == null) {
                    _row.spec = '';
                } else {
                    if (_global_settings.acOwner.productCoLorFlag == 'true') {
                        _row.spec = needAddList_0.spec;
                        _row.productName = needAddList_0.productName;
                    } else {
                        _row.spec = needAddList_0.spec;
                        _row.productName = needAddList_0.productName;
                    }
                }

                needAddList.unshift(_row);

                arr = arr.concat(needAddList).concat(lastarr);
                arr = $('#' + gridName).getData(arr);
                $('#' + gridName).updateListRow(arr);
                $('#' + gridName).trigger('resetColumnSum');

                var id = selectedrowindex;
                var currentArr = [];;
                for (var i = 0; i < addList.length; i++) {
                    var rows = $('#' + gridName).jqxGrid('getrowdata', id);
                    $.setGoodsBinning($('#' + gridName), id, rows, function() {
                        $('#' + gridName).trigger('resetColumnSum');
                    }, sourceType, true, totalCartons, currentPorduct);
                    id++;
                };
            }
            //保存
        $('#specModal2_saveBtn').off('click').on('click', function() {

            if (compareSpec()) {
                Core.alert({ message: '规格型号描叙不能重复！' });
                return false;
            }
            //规格型号
            editSpec();
            return;
            var choose = false;
            var selfDefineSpec = $('#specModal2').find('.selfDefine').find('.prod_specText');
            $.each(selfDefineSpec, function(i, value) {
                var t = $(this);
                var orderflag = t.data('orderflag') == null ? '' : t.data('orderflag').toString();
                if (t.data('oldvalue') != t.val() && orderflag == 'true') {
                    choose = true;
                    return false;
                }
            })
            if (choose) {
                Core.confirm({
                    message: "检查到您修改的规格型号，已经被订单使用，是否继续修改，订单和库存该规格型号文字会同步修改。",
                    yes: '继续',
                    confirmCallback: function() {
                        editSpec();
                    },
                    cancelCallback: function() {
                        editSpec(true);
                    }
                });
            } else {
                editSpec();
            }

        });

        $('#specModelAddBtn').off('click').on('click', function() {
            var t = $('.specModal2List');
            var html = $(' <form class="col-md-3 specdiv" style="padding-bottom: 10pt;">' +
                '	       <div class="col-md-12">' +
                '			  <div class="m-t-10 relative proTypeLabel" style=" width: 190pt;background: #f8f9f9;color: #53687D;">' +
                '			      <div class="text-center selfDefine" >' +
                '<div class="prod_checkbox">' +
                '<input type="checkbox" checked="true" class="prod_specCheck prod_checkbox_left">' +
                '<span class="prod_checkbox_left_img" data-checked="false"  data-type="spec"></span></div>' +
                '<input class="prod_specText" data-blacklist=" " placeholder="规格描述" style="width:80%;">' +
                //			'<span class="prod_specNum_span">|</span><input class="prod_specNum" data-orderFlag="false" placeholder="'+numPlaceholder+'" ></div>'+
                '</div>' +
                //			'				  <i class="md-cancel close-lab"></i>'+
                '			  </div>' +
                '	       </div>' +
                '	   </form>');
            html.find('.prod_specNum').moneyinput({ textalign: 'center', noEndZero: true });
            t.prepend(html);
            $('.specModal2List').find('.prod_specText').eq(0).focus();
            
            $('.specModal2List').find('.prod_specText').on('input',function(){
            	var val=$(this).val();
            	$(this).val(val.replace(/ /g, ''));
            });
        });

        //规格型号描叙不能重复
        function compareSpec() {
            var bool = false;
            var selfDefineSpec = $('#specModal2').find('.selfDefine');
            if (selfDefineSpec.length > 1) {
                for (var i = 0; i < selfDefineSpec.length; i++) {
                    for (var j = i + 1; j < selfDefineSpec.length; j++) {
                        if (selfDefineSpec.find('.prod_specText').eq(i).val() == selfDefineSpec.find('.prod_specText').eq(j).val()) {
                            bool = true;
                            break;
                        } else {}
                    }
                }
            }
            return bool;
        }

        //新增编辑规格型号
        $('.specModal2List').off('blur', '.prod_specText')
            .on('blur', '.prod_specText', function(event) {

                // 			if(compareSpec()){
                // 				Core.alert({message:'规格型号描叙不能重复！'});
                //				return false;
                // 			}
                var t = $(this);
                if (t.data('pid') == null && t.val() != '') {
                    var name = t.val();
                    var list = {
                        name: name
                    }
                    prodmodallist(arr.productName, 'specModalList', list, t.data('oldvalue'));
                    t.data('oldvalue', name);
                }
            });
    }

    var load_html = function(currentSpecData) {;
        var prodSpecHtml = '';
        if (currentSpecData != null && currentSpecData != undefined && currentSpecData != '') {
            $.each(currentSpecData, function(i, v) {
                if (currentSpecData[i].id === undefined) {
                    var src = "images/common/photo_icon2.png";

                    var html = ' <form class="col-md-3 specdiv" style="padding-bottom: 10pt;">                                                                                                                         ' +
                        '	       <div class="col-md-12">                                                                                                                      ' +
                        '			  <div class="m-t-10 relative proTypeLabel" style=" width: 190pt;background: #f8f9f9;color: #53687D;">                                                                                                ' +
                        '			      <div class="text-center selfDefine" >' +
                        '<div class="prod_checkbox">' +
                        '<input type="checkbox" class="prod_specCheck prod_checkbox_left">' +
                        '<span class="prod_checkbox_left_img" data-checked="" data-pid=""  data-type="spec"></span></div>' +
                        '<input style="80%" class="prod_specText" data-oldValue="' + v.name + '" data-pid="" data-orderFlag="" placeholder="规格描述" value="' + v.name + '">' +
                        //					'<span class="prod_specNum_span">|</span><input class="prod_specNum" placeholder="销售数量" data-qty="'+v.qty+'" value=""></div>                                                         '+
                        '</div>' +
                        //					'				  <i class="md-cancel close-lab"></i>'+
                        '			  </div>                                                                                                                                    ' +
                        '	       </div>                                                                                                                                       ' +
                        '	   </form>';
                    prodSpecHtml += html;
                } else {
                    var spec = v.descr == undefined ? v.spec : v.descr;
                    var html = ' <form class="col-md-3 specdiv" style="padding-bottom: 10pt;">                                                                                                                         ' +
                        '	       <div class="col-md-12">                                                                                                                      ' +
                        '			  <div class="m-t-10 relative proTypeLabel" style=" width: 190pt;background: #f8f9f9;color: #53687D;">                                                                                                ' +
                        '			      <div class="text-center selfDefine" >' +
                        '<div class="prod_checkbox">' +
                        '<input type="checkbox" class="prod_specCheck prod_checkbox_left">' +
                        '<span class="prod_checkbox_left_img" data-checked="' + v.likeFlag + '" data-pid="' + v.id + '"  data-type="spec"></span></div>' +
                        '<input style="80%" class="prod_specText" data-oldValue="' + spec + '" data-pid="' + v.id + '" data-orderFlag="' + v.orderFlag + '" placeholder="规格描述" value="' + spec + '">' +
                        //'<span class="prod_specNum_span">|</span><input class="prod_specNum" placeholder="'+numPlaceholder+'" data-qty="'+v.qty+'" value=""></div>                                                         '+
                        '</div>                                                         ' +
                        //					'				  <i class="md-cancel close-lab"></i>'+
                        '			  </div>                                                                                                                                    ' +
                        '	       </div>                                                                                                                                       ' +
                        '	   </form>';
                    prodSpecHtml += html;
                }
            });
        }
        return prodSpecHtml;
    }

    var specModal2_search = function(descr, id) {
        Core.AjaxRequest({
            type: "GET",
            showWaiting: false,
            url: _global_settings.service.url + "/product/searchspec/" + descr + "/" + id,
            callback: function(res) {
                var prodSpecList = res;

                var prodSpecHtml = load_html(prodSpecList);

                $("#specModal2").find('.specModal2List').html(prodSpecHtml);
                $("#specModal2").find('.specModal2List').find('.prod_specNum').moneyinput({ textalign: 'center', noEndZero: true });
            }
        });
    }

    var specModal2_reset = function(currentPorduct, soOwnerId, userName) {
        //禁止回车键
        $('#specModal2').keydown(function(e) {
            //			console.log(e.keyCode);
            if (e.keyCode == 13) return false;
            return true;
        });

        $("#specModal2").find('.specModal2List').html('');
        var selectedrowindex = $('#' + gridName).jqxGrid('getselectedrowindex');
        var arr = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
        var id = arr.id;

        if (currentPorduct.id != undefined) {
            //从小商拉的产品
            Core.AjaxRequest({
                type: "GET",
                showWaiting: false,
                url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/productid/' + currentPorduct.id + '/' + soOwnerId + '/' + userName),
                callback: function(res) {
                    //产品数据
                    var prodSpecList = res.prodSpecList;
                    if (modallist[res.name] != null) {
                        if (modallist[res.name].specModalList != undefined) {
                            prodSpecList = prodSpecList.concat(modallist[res.name].specModalList);
                        }
                    }
                    var prodSpecHtml = load_html(prodSpecList);

                    $("#specModal2").find('.specModal2List').append(prodSpecHtml);
                    var proSpec = $("#specModal2").find('.prod_specText');
                    $.each(proSpec, function(i, v) {
                        var pid = proSpec.eq(i).attr('data-pid');
                        if (pid != undefined && pid != '' && pid != null) {
                            $("#specModal2").find('.close-lab').eq(i).removeClass('md-cancel');
                            $("#specModal2").find('.prod_specText').eq(i).attr('disabled', true);
                        }
                        if ($(this).val() == arr.spec) {
                            $(this).parent().find('.prod_specCheck').attr('checked', true);
                        }
                    });
                    $("#specModal2").find('.specModal2List').find('.prod_specNum').moneyinput({ textalign: 'center', noEndZero: true });
                    specModal_event(totalCartons, soOwnerId, userName, currentPorduct);
                    $("#specModal2").modal("show");
                },
                failure: function(e) {}
            });
        } else {
            //新增的产品数据
            var prodSpecList = [];
            Core.AjaxRequest({
                type: "GET",
                showWaiting: false,
                async: false,
                url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/searchOwnerSpec/' + soOwnerId + '/' + userName),
                callback: function(res) {
                    var arr = [];
                    for (var i = 0; i < res.length; i++) {
                        arr[i] = {};
                        arr[i].id = res[i].id;
                        arr[i].descr = res[i].typeValue;
                    }
                    prodSpecList = prodSpecList.concat(arr);

                }
            })
            var prodSpecHtml = '';
            if (modallist[arr.productName] != undefined) { //自己新增
                for (var key in modallist[arr.productName]) {
                    if (key != 'specModalList') { //如果当前这个modallist不是规格型号的，那么直接返回
                        prodSpecHtml = load_html(prodSpecList);
                    } else { //如果当前这个modallist是规格型号的，那么加入一起
                        prodSpecList = prodSpecList.concat(modallist[arr.productName].specModalList);
                        prodSpecHtml = load_html(prodSpecList);
                    }
                }
            } else { //选择小商的,直接渲染
                prodSpecHtml = load_html(prodSpecList);
            }

            $("#specModal2").find('.specModal2List').append(prodSpecHtml);
            var proSpec = $("#specModal2").find('.prod_specText');
            $.each(proSpec, function(i, v) {
                var pid = proSpec.eq(i).attr('data-pid');
                if (pid != undefined && pid != '' && pid != null) {
                    $("#specModal2").find('.close-lab').eq(i).removeClass('md-cancel');
                    $("#specModal2").find('.prod_specText').eq(i).attr('disabled', true);
                }
                if ($(this).val() == arr.spec) {
                    $(this).parent().find('.prod_specCheck').attr('checked', true);
                }
            });
            $("#specModal2").find('.specModal2List').find('.prod_specNum').moneyinput({ textalign: 'center', noEndZero: true });
            specModal_event(totalCartons, soOwnerId, userName, currentPorduct);
            $("#specModal2").modal("show");
        }
    };
    if ($("#specModal2").length == 0) {
        $.loadModal("page/common/segment/specModel2.html", function(res) {
            var html = $(res);
            $('body').append(html);
            if (_global_settings.acOwner.productCoLorFlag == 'true') {
                var style = '<style>                   ' +
                    '    #specModal2 .prod_specText {      ' +
                    '        width: 84%;       ' +
                    '        height: 33px;     ' +
                    '        text-align: center;' +
                    '        border: none;     ' +
                    '        outline: none;    ' +
                    '    }                     ' +
                    '                          ' +
                    '    #specModal2 .prod_specNum {       ' +
                    '        display: none;    ' +
                    '    }                     ' +
                    '                          ' +
                    '    #specModal2 .prod_specNum_span {  ' +
                    '        display: none;    ' +
                    '    }                     ' +
                    '</style>                  ';
                html.append(style);
            }

            //删除
            $('.specModal2List').on('click', '.close-lab', function(event) {

                var parent = $(this).parents('.specdiv');
                var length = $('.specModal2List').children().length;

                var id = parent.find('.prod_specText').data('pid');
                if (id == null || id == '') {
                    //	    		if(length==1&&parent.index()==0) return false;
                    parent.remove();
                    return false;
                }

                Core.confirm({
                    message: '确定要删除？',
                    confirmCallback: function() {
                        Core.AjaxRequest({
                            url: ctx + "/CXF/rs/product/del/prodspec/" + id,
                            type: "POST",
                            //showMsg:false,
                            callback: function(res) {
                                //							
                                parent.find('.prod_specText').data('pid', '')
                                parent.find('.prod_specText').val('');
                                parent.remove();
                            },
                            failure: function(res) {}
                        });
                    }
                })
                return false;
            })

            specModal2_reset(currentPorduct, soOwnerId, userName);
        });
    } else {
        specModal2_reset(currentPorduct, soOwnerId, userName);
    }
};

//细码模态框事件
var yardsModal = function(gridName) {
    var selectedrowindex = $('#' + gridName).jqxGrid('getselectedrowindex');
    var selectedrowdata = $('#' + gridName).jqxGrid('getrowdata', selectedrowindex);
    var localdata = (selectedrowdata.yards == null || selectedrowdata.yards == '') ? [] : selectedrowdata.yards.split(',');
    var arrToObj = function(param) {
        var localArray = [];
        for (var index = 0; index < param.length; index++) {
            localArray[index] = {}
            localArray[index].label = param[index];
            localArray[index].value = index.toString();
        }
        return localArray;
    }
    var source = {
        localdata: arrToObj(localdata),
        datatype: "array"
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    var yardsModal_box_checkall = function() {
        var t = $('#yardsModal_box');
        for (var i = 0; i < source.localdata.length; i++) {
            t.jqxComboBox('selectIndex', i);
        }
    };
    var yardsModal_box_data = function(dataExpand) {
        dataExpand = dataExpand != false ? true : false;
        var t = $('#yardsModal_box')
        var items = t.jqxComboBox('getSelectedItems');
        var input = money(t.find('input').val(), 4, true);
        var arr = [];
        $.each(items, function(index) {
            arr.push(this.label);
        });
        if (input != 0) {
            arr.push(input.toString());
        }
        if (dataExpand) {
            return arrToObj(arr);
        } else {
            return arr;
        }

    }
    var yardsModal_box_event = function() {
        $('#yardsModal_saveBtn').off('click').on('click', function() {
            var arr = yardsModal_box_data(false);
            var sum = 0;
            $.each(arr, function(i, v) {
                sum += parseFloat(v);
            })
            if (arr.length > 20) {
                Core.alert({ message: '细码个数不能超过20个哦' });
                return false;
            } else if (Math.max.apply(null, arr) > 9999999) {
                Core.alert({ message: '单个细码数值不能超过1000万，请删除后重试' });
                return false;
            }
            var t = $('#' + gridName);
            var selectedrowindex = $('#' + gridName).jqxGrid('getselectedrowindex')
            t.jqxGrid('setcellvalue', selectedrowindex, "yards", arr.join(','))
            var editable = t.jqxGrid('getcolumnproperty', 'qty', 'editable');
            t.jqxGrid('setcolumnproperty', 'qty', 'editable', true);
            t.jqxGrid('begincelledit', selectedrowindex, "qty", sum);
            t.jqxGrid('endcelledit', selectedrowindex, "qty", false);
            t.jqxGrid('setcolumnproperty', 'qty', 'editable', editable)
            $('#yardsModal').modal('hide');
            //selectedrowdata.name = source.localdata
        });
        $('#yardsModal_box').off('keyup').on('keyup', function(e) {
            var key = e.keyCode;
            if (key == 13) {
                var value = $(this).find('input').val();
                if (value == '') {
                    $('#yardsModal_saveBtn').triggerHandler('click');
                    return;
                }
                if (yardsModal_box_data(false).length > 20) {
                    Core.alert({ message: '细码个数不能超过20个哦' });
                    return false;
                } else if (value > 9999999) {
                    Core.alert({ message: '单个细码数值不能超过1000万' });
                    return false;
                }
                console.log(yardsModal_box_data());
                source.localdata = yardsModal_box_data();
                dataAdapter.dataBind();
                yardsModal_box_checkall();
            }
        })
    };
    var yardsModal_reset = function() {
        yardsModal_box_event();

        $('#yardsModal_box').jqxComboBox({
            source: dataAdapter
        });
        yardsModal_box_checkall();
        $('#yardsModal').modal('show');
        $('#yardsModal_box').find('input').focus();
    };
    if ($("#yardsModal").length == 0) {
        $.loadModal("page/common/segment/yardsModal.html", function(res) {
            var html = $(res);
            $('body').append(html);
            $('#yardsModal_box').jqxComboBox({
                showArrow: false,
                multiSelect: true,
                width: '100%',
                popupZIndex: -1,
                searchMode: 'none',
                displayMember: "label",
                valueMember: "value",
                height: 30
            });
            yardsModal_reset();
        })

    } else {
        yardsModal_reset();
    }
}

var deleteBy = function(arr, arrValue, Key) {
    if (typeof arrValue === 'string') {
        arrValue = [arrValue];
    }
    var newArr = []
    for (var i = 0; i < arr.length; i++) {
        var push = true;
        for (var v = 0; v < arrValue.length; v++) {
            if (arr[i][Key] == arrValue[v]) {
                console.log(arr[i][Key]);
                push = false;
                break;
            }
        }
        if (push) {
            newArr.push(arr[i]);
        }
    }
    return newArr;
};

var setToggerColumns = function(map, columns, saleorbuy) {
    var qtyeditable = false;
    for (var i = 0; i < columns.length; i++) {
        for (var j in map) {
            if (map[j] === true || map[j] === false) {
                if (columns[i].datafield == j) {
                    if (j === 'totalCartons') {
                        qtyeditable = true;
                    }
                    columns[i].hidden = map[j];
                }
            }
        }
        if (columns[i].datafield === 'qty' && qtyeditable) {
            columns[i].editable = true;
            //		}else if(columns[i].datafield==='printOfGoods'&&ComboBoxSources.getRecords('priseInfo')[0].blueTooth){
        }
        /*else if(columns[i].datafield==='printOfGoods'){
        			
        			if(saleorbuy=='sale'){
        				columns[i].hidden=true;
        			}
        		}*/
    }
    return columns;
};

(function($) {
    function BrowserType() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串 
        var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器 
        // var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器 
        var isIE = window.ActiveXObject || "ActiveXObject" in window
            // var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器 
        var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
        var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器 
        var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器 
        var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && !isEdge; //判断Chrome浏览器 

        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (userAgent.indexOf('MSIE 6.0') != -1) {
                return "IE6";
            } else if (fIEVersion == 7) {
                return "IE7";
            } else if (fIEVersion == 8) {
                return "IE8";
            } else if (fIEVersion == 9) {
                return "IE9";
            } else if (fIEVersion == 10) {
                return "IE10";
            } else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
                return "IE11";
            } else {
                return "0"
            } //IE版本过低
        } //isIE end 

        if (isFF) { return "FF"; }
        if (isOpera) { return "Opera"; }
        if (isSafari) { return "Safari"; }
        if (isChrome) { return "Chrome"; }
        if (isEdge) { return "Edge"; }
    } //myBrowser() end 
    var close = true; //
    //    var html = $("<div style='position: relative;margin:0 auto;overflow: hidden;display:none;z-index: 9999990;border:solid 1px #d1d1d1;box-shadow:2px 2px 3px #e8e8e8;background-color:rgba(0,0,0,.1)' id='floatImg'>"
    //    			+	"<div style='width:100%;height:30px;border-bottom:solid 1px #AAA;cursor:move;text-align:right;padding-right:10px;background-color:#f5f5f5;'>×</div>"
    //    			+	"<img id='floatImgInner' style='width:100%;position: absolute;'/>"
    //    			+	"<div style='width:100%;height:30px;position: absolute;left:0;bottom:0;background-color:#f5f5f5;overflow:hidden;'>"
    //    			+		"<div style='width:200px;margin:0 auto;'>"
    //    			+			"<div class='viewer-left' style='float:left;font-size:16px;margin:0 10px;cursor:pointer;'>←</div>"
    //    			+			"<div class='viewer-right' style='float:left;font-size:16px;margin:0 10px;cursor:pointer;'>→</div>"
    //    			+			"<div class='viewer-vertical' style='float:left;font-size:16px;margin:0 10px;cursor:pointer;'>↔</div>"
    //    			+			"<div class='viewer-horizontal' style='float:left;font-size:16px;margin:0 10px;cursor:pointer;'>↕</div>"
    //    			+			"<div class='viewer-reset' style='float:left;font-size:16px;margin:0 10px;cursor:pointer;'>○</div>"
    //    			+		"<div>"
    //    			+	"</div>"
    //    			+"</div>");
    var html = $("<div style='position: fixed;display:none;z-index: 9999990;' id='floatImg'>" +
        "<img style='width:100%;height:100%'/><div class='md-rotate-right' id='floatImg_rotate' title='点击旋转' style='cursor: pointer;font-size:25px;float: right;'></div>");
    $('body').append(html);
    //    dragImg('floatImg');

    var oImg = document.getElementById('floatImg');
    /*拖拽功能*/
    (function() {
        addEvent(oImg, 'mousedown', function(ev) {
            var oEvent = prEvent(ev),
                oParent = oImg.parentNode,
                disX = oEvent.clientX - oImg.offsetLeft,
                disY = oEvent.clientY - oImg.offsetTop,
                startMove = function(ev) {
                    if (oParent.setCapture) {
                        oParent.setCapture();
                    }
                    var oEvent = ev || window.event,
                        l = oEvent.clientX - disX,
                        t = oEvent.clientY - disY;
                    oImg.style.left = l + 'px';
                    oImg.style.top = t + 'px';
                    oParent.onselectstart = function() {
                        return false;
                    }
                },
                endMove = function(ev) {
                    if (oParent.releaseCapture) {
                        oParent.releaseCapture();
                    }
                    oParent.onselectstart = null;
                    removeEvent(oParent, 'mousemove', startMove);
                    removeEvent(oParent, 'mouseup', endMove);
                };
            addEvent(oParent, 'mousemove', startMove);
            addEvent(oParent, 'mouseup', endMove);
            return false;
        });
    })();
    /*以鼠标位置为中心的滑轮放大功能*/
    (function() {
        addWheelEvent(oImg, function(delta) {
            var ratioL = (this.clientX - oImg.offsetLeft) / oImg.offsetWidth,
                ratioT = (this.clientY - oImg.offsetTop) / oImg.offsetHeight,
                ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
                w = parseInt(oImg.offsetWidth * ratioDelta),
                h = parseInt(oImg.offsetHeight * ratioDelta),
                l = Math.round(this.clientX - (w * ratioL)),
                t = Math.round(this.clientY - (h * ratioT));
            with(oImg.style) {
                width = w + 'px';
                height = h + 'px';
                left = l + 'px';
                top = t + 'px';
            }
        });
    })();

    $('#floatImg_rotate').on('click', function() {
        var rotate = $('#floatImg').data('rotate');
        rotate += 90;
        $('#floatImg').data('rotate', rotate).css('transform', 'rotate(' + rotate + 'deg)');
    })

    var clickType = 'dblclick';
    if (BrowserType() != "Chrome") {
        clickType = 'dblclick';
        $(document).on('click', 'img', function() {
            var t = $(this);
            var src = t.attr('src') == null ? '' : t.attr('src');
            if (src.indexOf('rs/common/file/original/') > -1 && src == null || src == '' || src.indexOf('rs/common/file/thumbnail/') == -1) {
                return;
            } else {
                Core.alert({ message: '双击即可查看大图哦' });
            }
        })
    }
    $(document).on(
        'dblclick', 'img',
        function(e) {
            if ($('#floatImg').is(':visible')) {
                $('#floatImg').hide();
                return;
            }
            //console.log(e.target); 
            $('#floatImg').data('rotate', 0).css('transform', 'rotate(0deg)');
            var t = $(this);
            var src = t.attr('src') == null ? '' : t.attr('src');

            if (src == null || src == '' || src.indexOf('rs/SimpleAC/down') == -1) {
                return;
            }
            src = src.replace('/thumbnail/', '/original/');
            $('#floatImg').find('img').attr('src', src);
            //            if(window.viewImgWindow){
            //            	if(!viewImgWindow.closed){
            //            		viewImgWindow.close();
            //            	}
            //            }
            //window.viewImgWindow = window.open('', '', 'height=100, width=100, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes, location=no, status=no');
            //window.viewImgWindow = window.open('','_blank', '秒账', 'toolbar=no, menubar=no, scrollbars=no, resizable=1, location=yes, status=no');
            isImgLoad(function() {
                var w = $('#floatImg>img')[0].naturalWidth;
                var h = $('#floatImg>img')[0].naturalHeight;
                var suofang = function(w, h) {
                    var ww = $(window).width();
                    var wh = $(window).height();
                    var box = 0.618 * ww;
                    var scale = function(box) {
                        var max = Math.max.call(this, box, w, h);
                        return max > box ? box / max : 1;
                    }
                    var _w = w * scale(box),
                        _h = h * scale(box);
                    if (_h > wh) {
                        var box = 0.95 * wh;
                        _w = w * scale(box),
                            _h = h * scale(box);
                    }
                    return [_w, _h, w, h]
                };

                var sf = suofang(w, h);
                w = sf[0];
                h = sf[1];
                var ww = $(window).width();
                var wh = $(window).height();
                $('#floatImg').css({
                    top: (wh - h) / 2,
                    left: (ww - w) / 2,
                    width: w,
                    height: h + 60
                }).center().show();
                //  $('#floatImg').center().show();
                //                timeOut(function(){
                //                	//var window.viewImgWindow = window.open('', '', 'height='+h+', width='+w+', top='+(wh - h) / 2+', left='+(ww - w) / 2+', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
                //                	//window.viewImgWindow = window.open('', '', 'height='+h+', width='+w+', top='+(wh - h) / 2+', left='+(ww - w) / 2+'');
                //                	window.viewImgWindow.resizeTo(w,h);
                //                	window.viewImgWindow.moveTo((ww - w) / 2,(wh - h) / 2);
                //                	src = 'http://'+window.location.host+src;
                //                	var img = $(viewImgWindow.document.createElement('img'));
                //                	img.attr({'id':'',src:src}).css({width:'100%',height:'100%'});
                //                	$(viewImgWindow.document).find('body').css('margin','0').append(img);
                //                	$(viewImgWindow.document).find('head').append('<title>查看图片</title>');
                //                },100)
            }, '#floatImg>img')
        });

    $('body').on('click', '.yulan', function() {
        var src = 'http://' + window.location.host + $(this).attr('src');
        //var t = window.open('', '', 'height=100, width=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
        var t = window.open();
        var img = t.document.createElement('img');
        img.src = src;
        t.document.getElementsByTagName('body')[0].appendChild(img);
    })
})($);


var getMsgForNullSpecId = function(source, callback, param1, param2, param3) {

    if (_global_settings.owner.easyGridSetting.spec == false) {
        callback(param1, param2, param3);
        return;
    }

    var arr = ComboBoxSources.getInfoMapOrderByKey(source, 'prodSpecId')['未分类'];
    if (arr == null || arr.length == 0) {
        arr = [];
    }
    var list = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].spec == undefined) {
            list.push(arr[i].sequence);
        }
    }
    list = list.toString();
    if (list.length > 0) {
        timeOut(function() {
            Core.confirm({
                message: '第' + list + '行没有选择规格型号，确认保存此销售单吗？？',
                confirmCallback: function() {
                    callback(param1, param2, param3);
                }
            });
        })

    } else {
        timeOut(function() {
            callback(param1, param2, param3);
        })
    }

};