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
$.fn.easyGrid = function(settings) {
//    window.modallist = {};
//    window.prodmodallist = function(name, type, obj, oldvalue, imgId) {
//        if (window.modallist[name] == null) {
//            window.modallist[name] = {}
//        }
//        if (window.modallist[name][type] == null) {
//            window.modallist[name][type] = []
//        }
//        var arr = window.modallist[name][type];
//        var update = false
//        for (var i = 0; i < arr.length; i++) {
//            if (arr[i].name == oldvalue) {
//                arr[i] = obj;
//                update = true;
//                break;
//            }
//            if (arr[i].name == imgId) {
//                arr[i] = obj;
//                update = true;
//                break;
//            }
//        }
//        if (!update) {
//            arr.push(obj);
//        }
//    }
    var settings = settings === undefined ? {} : settings;
    settings.ownerSettings.elementId = $(this)[0].id;
    console.log(settings);
    $(this).attr({
        'data-id': settings.ownerSettings.elementId,
        'data-soOwnerId': settings.ownerSettings.soOwnerId,
        'data-name': settings.ownerSettings.userName
    });

    var gridSettings = $.extend(true, { editable: true, delBtn: true }, settings.gridSettings);

    var productInfo=[]; //产品信息
    var xsweight = 'kg';
    if (_global_settings.acOwner.productKgFlag) { //如果商户开启重量
//        Core.AjaxRequest({
//            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/prodUnit/' + settings.ownerSettings.soOwnerId + '/' + settings.ownerSettings.userName),
//            type: 'get',
//            showMsg: false,
//            // async: false,
//            callback: function(res) {
//                xsweight = res[0].descr == undefined ? 'kg' : res[0].descr;
//                //				console.log(res);
//            }
//        });
    	xsweight=_global_settings.acOwner.prodUnit[0].descr;
    }
    
    var singleUnit = []; //单个单位
    if (_global_settings.acOwner.productunitFlag) { //如果商户开启单位
//        Core.AjaxRequest({
//            url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/singleUnit/' + settings.ownerSettings.soOwnerId + '/' + settings.ownerSettings.userName),
//            type: 'get',
//            showMsg: false,
//            // async: false,
//            callback: function(res) {
//                singleUnit = res;
//                //				console.log(res);
//            }
//        });
    	var vo=_global_settings.acOwner.ownerUnitTypeVO;
    	for(var i=0;i<vo.length;i++){
    		if(vo[i].single){
    			singleUnit.push(vo[i].unitGroup[0]);
    		}
    	}
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
            "discount":"",
            "originalPrice":"",
        	"specId":"",
            "colorId":""
        }
    };

    var source =  [defaultrow(),defaultrow(),defaultrow(),defaultrow(),defaultrow()];

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
        } else if(modalName != null && modalName.indexOf('add') > -1){
            addoredit = 'add';
            columntypedeliveiedQtyText = '送货数量';
        } else {
        	addoredit = 'view';
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
        if (settings.source.length ==0) {
            source = [defaultrow()];
        } else {
            source = getDataDirty(settings.source);
            for(var i=0;i<source.length;i++){
            	if(_global_settings.acOwner.ownerAttr.discountFlag){
            		//开启折扣，单价和折后价互换
                 	var a=source[i].priceBefore; 
                 	var b=source[i].originalPrice==undefined?a:source[i].originalPrice;
                 	source[i].priceBefore=b;
                 	source[i].originalPrice=a;
                 	var c=source[i].discount==undefined?1:source[i].discount;
                 	source[i].discount=c*100+'%';
                }
            }
            
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
            columntype: 'template',
            pk: true,
            jqxSettings: {
                selectedIndex: 0,
                source: productSourceName,
                displayMember: "name",
                valueMember: "name",
            },
            displayfield: 'productName',
            width: '14%',
            initeditor: function(row, cellvalue, editor, celltext, pressedChar) {
            	var rowdata = table.jqxGrid('getrowdata', row);
            	var source = productSourceName.concat(prodArr);
            	var productName = rowdata.productName;
            	source=sortData(source,productName,'name');
            	editor.comboBox({
                    width: '14%',
                    source: source,
//                  autoOpen: true,
                    displayMember: 'name',
                    valueMember: 'name',
                }).val(rowdata.productName);
            	
            	timeOut(function() {
                    editor.jqxComboBox('open');
                    editor.find('input').eq(0).focus().addClass('productName');
//                  editor.triggerHandler('keyup');
                }, 0)
            },
            geteditorvalue: function(row, cellvalue, editor) {
                // return the editor's value.
            	return {
                    label: editor.find('input').val(),
                    value: editor.val()
                }
            },
            aggregatesrenderer: function(aggregates, column, element) {
                var sum = table.jqxGrid('getcolumnaggregateddata', 'inventoryReducere', ['sum']).sum;
                // if (gridSettings.dellist) {
                //     sum = getgridcheckedsum('price_long', table);
                // }
                var txt = money(sum, 4, true);
                var html = ''
            	if ((addoredit == 'add' && _global_settings.acOwner.ownerAttr.customFormulaFlag) ||
                    ((addoredit == 'edit' || addoredit == 'view') && settings.order.customFormulaFlag)) {
            		if (txt != 0) {
                        html = '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;库存减少:' +
                            txt + '</div>';
                    }
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
                var id = rowdata.photoId==undefined||rowdata.photoId==''?'':rowdata.photoId;

                if (id != '') {
                    src = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + id + '/' + settings.ownerSettings.soOwnerId + '/' + settings.ownerSettings.userName);
                }
                if (src != '') {
                    src = "<img width='48' height='32' src='" + src + "' data-id='"+id+"'>";
                } else {
                    src = '<input type="button" style="opacity: 0.99; position: absolute; top: 0%; left: 0%; padding: 0px; margin-top: 2px; margin-left: 2px;' +
                        ' width: 96%; height: 36px;" value="请选择" role="button" class="jqx-rc-all jqx-button jqx-fill-state-normal addPhoto">';
                }
                var img = "<div style='background: white;text-align:center;margin: 3px;'>" +
                    src + "</div>";
                return img;
            },
            enabletooltips: false
        },

        { text: '货号   ', datafield: 'sku', hidden: true },
        {
            text: '规格型号' /*+addspecbtn*/ ,
            columntype: 'template',
            hidden:false,
            datafield: 'spec',
            displayfield: 'spec',
            width: '5%',
            jqxSettings: {
                // type: 'vendor',
                // source: 'productunitSingle',
                displayMember: "descr",
                valueMember: "descr",
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
                        //width: '5%',
                        width: 'auto',
                        source: [],
                        displayMember: 'descr',
                        valueMember: 'descr',
                    });
                    editor.find('input').eq(0).focus().addClass('spec');
                } else if(search(productName,true)){//新增产品
                	if(_global_settings.acOwner.productSpeTypeFlag==true){ //小商开启了统一规格
                		Core.AjaxRequest({
                            type: 'GET',
                            showWaiting:false,
                            async:false,
                            url: _global_settings.service.url+'/SimpleAC/'+new Base64().encode('toocr/order/searchOwnerSpec/'+ownerId+'/'+name),
                            callback: function(res) {
                            	for(var i in res){
                            		res[i].descr=res[i].typeValue;
                            	}
                            	var source=$.checkArr(res.concat(specArr));
                            	source=sortData(source,rowdata.spec);
                            	editor.comboBox({
    		                        width: 'auto',
    		                        source: source,
//    		                        autoOpen: true,
    		                        displayMember: 'descr',
    		                        valueMember: 'descr',
    		                    }).val(rowdata.spec);
                            	
                            	timeOut(function() {
                                    editor.jqxComboBox('open');
                                    editor.find('input').eq(0).focus().addClass('spec');
//                                    editor.triggerHandler('keyup');
                                }, 0)
                            }
                        });
                	}else{
                		var source=sortData(specArr,rowdata.spec);
                		editor.comboBox({
	                        width: 'auto',
//	                        source: specArr,
	                        source: source,
//	                        autoOpen: true,
	                        displayMember: 'descr',
	                        valueMember: 'descr',
	                    }).val(rowdata.spec);
                    	
                    	timeOut(function() {
                            editor.jqxComboBox('open');
                            editor.find('input').eq(0).focus().addClass('spec');;
//                            editor.triggerHandler('keyup');
                        }, 0)
                	}
                } else {
                	var prod = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product, 'name', productName);
            		Core.AjaxRequest({
                        type: 'GET',
                        showWaiting:false,
//                      async:false,
                        url: _global_settings.service.url+'/SimpleAC/'+new Base64().encode('toocr/order/productid/'+prod.id+'/'+ownerId+'/'+name),
                        callback: function(res) {
                        	var source=$.checkArr(res.prodSpecList.concat(specArr));
                        	source=sortData(source,rowdata.spec);
                        	editor.comboBox({
		                        width: 'auto',
		                        source: source,
//		                        autoOpen: true,
		                        displayMember: 'descr',
		                        valueMember: 'descr',
		                    }).val(rowdata.spec);
                        	
                        	timeOut(function() {
                                editor.jqxComboBox('open');
                                editor.find('input').eq(0).focus().addClass('spec');;
//                              editor.triggerHandler('keyup');
                            }, 0)
                        }
                    });
                }
            },
            geteditorvalue: function(row, cellvalue, editor) {
                // return the editor's value.
            	return {
                    label: editor.find('input').val(),
                    value: editor.val()
                }
            },
        },
        {
            text: '颜色',
            datafield: 'color',
            columntype: 'template',
            displayfield: 'color',
            hidden:false,
            width: '5%',
            jqxSettings: {
                // type: 'vendor',
                // source: 'productunitSingle',
                displayMember: "descr",
                valueMember: "descr",
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
                        //width: '5%',
                        width: 'auto',
                        source: [],
                        displayMember: 'descr',
                        valueMember: 'descr',
                    });
                    editor.find('input').eq(0).focus().addClass('color');
                } else if(search(productName,true)){//新增产品
                	if(_global_settings.acOwner.productCoLorTypeFlag==true){ //小商开启了统一颜色
                		Core.AjaxRequest({
                            type: 'GET',
                            showWaiting:false,
                            async:false,
                            url: _global_settings.service.url+'/SimpleAC/'+new Base64().encode('toocr/order/searchOwnerColor/'+ownerId+'/'+name),
                            callback: function(res) {
                            	for(var i in res){
                            		res[i].descr=res[i].typeValue;
                            	}
                            	var source=$.checkArr(res.concat(colorArr));
                            	source=sortData(source,rowdata.color)
                            	editor.comboBox({
    		                        width: 'auto',
    		                        source: source,
//    		                        autoOpen: true,
    		                        displayMember: 'descr',
    		                        valueMember: 'descr',
    		                    }).val(rowdata.color);
                            	
                            	timeOut(function() {
                                    editor.jqxComboBox('open');
                                    editor.find('input').eq(0).focus().addClass('color');;
//                                    editor.triggerHandler('keyup');
                                }, 0)
                            }
                        });
                	}else{
                		editor.comboBox({
	                        width: 'auto',
	                        source: colorArr,
//	                        autoOpen: true,
	                        displayMember: 'descr',
	                        valueMember: 'descr',
	                    }).val(rowdata.color);
                    	
                    	timeOut(function() {
                            editor.jqxComboBox('open');
                            editor.find('input').eq(0).focus().addClass('color');;
//                            editor.triggerHandler('keyup');
                        }, 0)
                	}
                } else {
                	var prod = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product, 'name', productName);
            		Core.AjaxRequest({
                        type: 'GET',
                        showWaiting:false,
//                      async:false,
                        url: _global_settings.service.url+'/SimpleAC/'+new Base64().encode('toocr/order/productid/'+prod.id+'/'+ownerId+'/'+name),
                        callback: function(res) {
                        	var source=$.checkArr(res.prodColourList.concat(colorArr));
                        	source=sortData(source,rowdata.color)
                        	editor.comboBox({
		                        width: 'auto',
		                        source: source,
//		                        autoOpen: true,
		                        displayMember: 'descr',
		                        valueMember: 'descr',
		                    }).val(rowdata.color);
                        	
                        	timeOut(function() {
                                editor.jqxComboBox('open');
                                editor.find('input').eq(0).focus().addClass('color');;
//                                editor.triggerHandler('keyup');
                            }, 0)
                        }
                    });
                }
            },
            geteditorvalue: function(row, cellvalue, editor) {
                // return the editor's value.
            	return {
                    label: editor.find('input').val(),
                    value: editor.val()
                }
            },
        },
        {
            text: '重量',
            datafield: 'weight',
            cellsalign: 'right' /*,cellsformat: 'f2'*/ ,
            aggregates: ["sum"],
            aggregatesrenderer: function(aggregates, column, element) {
            	if ((addoredit == 'add' && _global_settings.acOwner.ownerAttr.customFormulaFlag) ||
                    ((addoredit == 'edit' || addoredit == 'view') && settings.order.customFormulaFlag)) {
            		return '';
                }
                
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
//            editable: false,
            hidden: true,
            resizable: true,
            width: '15%',
            cellsrenderer: function(row, columnfield, value, defaulthtml, columnproperties) {
//                if (value == '' || value == null) {
//                    return '<input type="button" style="opacity: 0.99; position: absolute; top: 0%; left: 0%; padding: 0px; margin-top: 2px; margin-left: 2px;' +
//                        ' width: 98%; height: 36px;" value="请选择" role="button" class="jqx-rc-all jqx-button jqx-fill-state-normal addyards">';
//                }
//                return '<input type="button" style="opacity: 0.99; position: absolute; top: 0%; left: 0%; padding: 0px; margin-top: 2px; margin-left: 2px;' +
//                    ' width: 98%; height: 36px;" value="' + value + '" role="button" class="jqx-rc-all jqx-button jqx-fill-state-normal addyards">';
            },
            aggregates: [{
                '细码匹数': function(aggregatedValue, currentValue, columnfield, row) {
                    var yards = row.yards == null ? '' : row.yards.toString();
//                	for(var i=0;i<yards.length;i++){
//                		if(yards[i]=='，'){
//                			str+=',';
//                		}else{
//                			str+=yards[i];
//                		}
//                	}
                    if (yards != null) {
                        var sum = 0;
                        if (!gridSettings.dellist || row.waitdel == true) {
                            $.each(yards.split(','), function(i, v) {
                            	if(v.indexOf('*')>-1){
                            		sum+=v.split('*')[0]*1;
                            	}else{
                            		if (v > 0)
                                        sum += 1;
                            	}
                            })
                        }
                        return money(aggregatedValue + sum, 4, true);
                    }
                    return aggregatedValue;
                },
                '损耗数量': function(aggregatedValue, currentValue, columnfield, row) {
                    var yards = row.yards == null ? '' : row.yards.toString();
                    var unitRate = row.unitRate;
                    if(unitRate==null||unitRate==''){
                    	unitRate=1;
                    }
                    var sum = 0;
                    if (yards != null) {
                        if (!gridSettings.dellist || row.waitdel == true) {
                            $.each(yards.split(','), function(i, v) {
                            	var abc=eval(v);
                        		if (abc < 0)
                                    sum += parseFloat(abc) * unitRate;
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
                var spec = rowdata.spec==undefined?'':rowdata.spec;
                var color = rowdata.color==undefined?'':rowdata.color;
                if (productName == null || productName == '') {
                    editor.comboBox({
                        //width: '5%',
                        width: 'auto',
                        source: [],
                        displayMember: "unitName",
                        valueMember: "unitName",
                    })
                } else {
                    var prod = ComboBoxSources.getInfoMapByKey(settings.productSourceName.product, 'name', productName);
//                  var prod = ComboBoxSources.getInfoMapByKey('product', 'id', prodId);
                    if (prod.multiUnitFlag) {
                    	Core.AjaxRequest({
                            type: 'GET',
                            showWaiting:false,
//                          async:false,
                            url: _global_settings.service.url+'/SimpleAC/'+new Base64().encode('toocr/order/productid/'+prod.id+'/'+ownerId+'/'+name),
                            callback: function(res) {
                            	console.error('获取数据');
        		        		var inDataList = res.inDataList;
        		        		var mainContainer = res.prodContainerList[0].unitName;//基本单位
        		                var source=[];
        		        		$.each(inDataList, function(i, v) {
        		        			if(spec == v.spec && color == v.colour){
        		        				var prodContainerList = v.prodContainerList;
        		        				$.each(prodContainerList,function(x,y){
        		        					if (y.unitName != mainContainer) {
        				                        y._unitName = y.unitName;
        				                        y.unitName = y.unitName + '(' + y.rate + mainContainer + ')';
        				                    }
        		        				});
        		        				
        		        				var commonFlag = ComboBoxSources.getInfoMapByKey(prodContainerList, 'commonFlag', true); //常用单位
        				        		
        				        		source=sortData(prodContainerList,rowdata.unit,'unitName');
        		                        editor.comboBox({
        		                            //width: '5%',
        		                            width: 'auto',
        		                            source: source,
        		                            displayMember: "unitName",
        		                            valueMember: "unitName",
        		                        }).val(commonFlag.unitName);
        		                        timeOut(function() {
        		                            editor.jqxComboBox('open');
        		                            editor.find('input').eq(0).focus();
        		                        }, 0)
        		        			}
        		                });
        		        		
        		        		if(source.length==0){
        		        			var prodContainer=res.prodContainerList
        		        			$.each(prodContainer,function(x,y){
    		        					if (y.unitName != mainContainer) {
    				                        y._unitName = y.unitName;
    				                        y.unitName = y.unitName + '(' + y.rate + mainContainer + ')';
    				                    }
    		        				});
        		        			source=sortData(prodContainer,rowdata.unit,'unitName');
    		                        editor.comboBox({
    		                            //width: '5%',
    		                            width: 'auto',
    		                            source: source,
    		                            displayMember: "unitName",
    		                            valueMember: "unitName",
    		                        }).val(rowdata.unit);
    		                        timeOut(function() {
    		                            editor.jqxComboBox('open');
    		                            editor.find('input').eq(0).focus();
    		                        }, 0)
        		        		}
                            }
                        });
                    } else {
                        var abc = unitArr;
                        var source = singleUnit.concat(abc);
                        source=sortData(source,rowdata.unit,'unitName');
                        editor.comboBox({
                            //width: '5%',
                            width: 'auto',
                            source: source,
                            displayMember: "unitName",
                            valueMember: "unitName",
                        }).val(rowdata.unit)
                    }
                    //		                     editor.jqxComboBox('clearSelection');
//                    editor.val(rowdata.unit);
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
//                    editor.triggerHandler('keyup');
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
        { text: '单价 ', datafield: 'priceBefore', pk: true, cellsalign: 'right', },
        { text: '折扣', datafield: 'discount', pk: true, cellsalign: 'right', hidden:!_global_settings.acOwner.ownerAttr.discountFlag,
        	cellsrenderer: function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
//                var rtStr = '<div class="jqx-grid-cell-right-align" style="margin-top:12px">';
//                return rtStr+value*100+'%' + '</div>';
            }
        },
        { text: '折后价', datafield: 'originalPrice', pk: true,editable:false, cellsalign: 'right', hidden:!_global_settings.acOwner.ownerAttr.discountFlag},
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
            	if ((addoredit == 'add' && _global_settings.acOwner.ownerAttr.customFormulaFlag) ||
                    ((addoredit == 'edit' || addoredit == 'view') && settings.order.customFormulaFlag)) {
            		return '';
                }
                var sum = table.jqxGrid('getcolumnaggregateddata', 'tj', ['sum']).sum / 1000000;
                if (gridSettings.dellist) {
                    sum = getgridcheckedsum('tj', table) / 1000000;
                }
                
                var txt = money(sum, 4, true) == 0 ? '<0.0001' : money(sum, 4, true);
                var html = '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;体积:' +
                    txt + 'm³</div>';
                
                return html;
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
                //var sum = table.jqxGrid('getcolumnaggregateddata', 'tj', ['sum']).sum;
            	if ((addoredit == 'add' && _global_settings.acOwner.ownerAttr.customFormulaFlag) ||
                   ((addoredit == 'edit' || addoredit == 'view') && settings.order.customFormulaFlag)) {
            		return '';
                }
                var sum = table.jqxGrid('getcolumnaggregateddata', 'tj', ['sum']).sum;
                if (gridSettings.dellist) {
                    sum = getgridcheckedsum('tj', table);
                }
                
                var txt = money(sum, 4, true) == 0 ? '<0.0001' : money(sum, 4, true);
                var html = '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: left">&nbsp;&nbsp;&nbsp;体积:' +
                    txt + 'm³</div>';
                
                return html;
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
        { text: 'grid_focus', datafield: 'grid_focus', hidden: true },
        { text: '产品规格ID', datafield: 'specId', hidden: true },
        { text: '产品颜色ID', datafield: 'colorId', hidden: true }
    ];

    settings.aggregates = [{ type: 'Multiply', datafield: ['totalCartons', 'eachCartons', 'qty'] },
        { type: 'Multiply', datafield: ['priceBefore', 'discount', 'originalPrice'] },
        { type: 'Multiply', datafield: ['qty', 'priceBefore', 'price3_server'] },
        { type: 'Multiply', datafield: ['deliveryQtyNow', 'priceBefore', 'ysprice'] },
        { type: 'Multiply', datafield: ['deliveiedQty', 'priceBefore', 'dsprice'] },
        { type: 'Multiply', datafield: ['qty', 'weight', 'rowweight'] },
        { type: 'Multiply', datafield: ['rowweight', 'unitRate', 'rowweight'] },
        { type: 'Multiply', datafield: ['deliveryQtyNow', 'unitRate', 'deliveryQtyAll'] },
        { type: 'Multiply', datafield: ['qty', 'unitRate', 'unitRateqty'] },
        { type: 'Multiply', datafield: ['totalCartons', 'extent', 'breadth', 'altitude', 'tj'] }
    ];

    if ((addoredit == 'add' && _global_settings.acOwner.cartonType == 'volume') ||
            ((addoredit == 'edit' || addoredit == 'view') && settings.order.cartonType == 'volume')) {
        settings.aggregates = [
            { type: 'Multiply', datafield: ['totalCartons', 'eachCartons', 'qty'] },
            { type: 'Multiply', datafield: ['priceBefore', 'discount', 'originalPrice'] },
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
    
    //计重方式
    if (_global_settings.acOwner.prodUnit[0].weightWay == 'container') {
        settings.aggregates.splice(5, 1, { type: 'Multiply', datafield: ['totalCartons', 'weight', 'rowweight'] });
        settings.aggregates.splice(6, 1);
    }
    
    //开启折扣
    if (_global_settings.acOwner.ownerAttr.discountFlag) {
        settings.aggregates.splice(3, 1, { type: 'Multiply', datafield: ['deliveiedQty', 'originalPrice', 'ysprice'] });
        settings.aggregates.splice(4, 1, { type: 'Multiply', datafield: ['deliveryQtyNow', 'originalPrice', 'dsprice'] });
    }

    if (gridSettings.delBtn.toString() == 'false') {
        settings.columns[3] = {
                text: '图片',
                datafield: 'photoId',
                editable: false,
                width: '60px',
                cellsrenderer: function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
                    var src = '';
                    var id = rowdata.photoId==undefined?'':rowdata.photoId;
//                    if (rowdata.photoId != undefined && rowdata.photoId != '') {
//                        //产品有图片
//                        if (rowdata.photoAddId != undefined && rowdata.photoAddId != '') {
//                            //颜色图片覆盖掉产品图片情况
//                            ids = rowdata.photoAddId;
//                        } else {
//                            //颜色图片没有覆盖掉情况
//                            ids = rowdata.photoId;
//                        }
//                    } else {
//                        //产品没有图片
//                        if (rowdata.photoAddId != undefined && rowdata.photoAddId != '') {
//                            //颜色图片覆盖掉产品图片情况
//                            ids = rowdata.photoAddId;
//                        } else {
//                            //颜色图片没有覆盖掉情况
//                            ids = '';
//                        }
//                    }
                    if (id != '') {
                        src = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + id + '/' + settings.ownerSettings.soOwnerId + '/' + settings.ownerSettings.userName);
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
//    if (_global_settings.acOwner.yardsFlag) {
//        for (var i = 0; i < settings.columns.length; i++) {
//            if (settings.columns[i].datafield == 'qty') {
//                settings.columns[i].editable = false;
//            }
//        }
//    }

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
            discount:'',//折扣
            originalPrice:'',
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

    var getData = function(ArrObj, filter) {
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
                    else if(j=='originalPrice'||j=='discount'){  //折扣价和单价互换
                		if(j=='discount'){
                			json[j] = money(cell.split('%')[0]/100,4,true);
                		}else{
                			var ab=ArrObj[i][j];
                    		var ba=json['priceBefore'];
                    		json['priceBefore']=ab;
                    		json[j]=ba;
                		}
					}
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
    function getDataDirty(ArrObj, pkObj) {
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
        var selectedrowindex = table.jqxGrid('getselectedcell').rowindex;
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
    
    var getProductInfoById=function(prodId){
    	var prodId=prodId;
    	var userId=settings.ownerSettings.soOwnerId;
    	var name=settings.ownerSettings.userName;
    	Core.AjaxRequest({
    		type:'get',
    		url:_global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/productid/' + prodId + '/' + userId + '/' +name),
//    		async:false,
    		showMsg:false,
    		callback:function(product){
    			productInfo = product;
    			console.log(product)
    		}
    	})
    }
    
    //获取规格，颜色对应---单位
    var getUnitBySpecColor=function(arr,pid){
    	var pid=pid;
    	var user=settings.ownerSettings.userName;
    	var userId=settings.ownerSettings.soOwnerId; 
    	
    	Core.AjaxRequest({
    		type:'get',
    		url:_global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/inventoryDetail/'+userId+'/'+user+'/'+pid+'/0/0'),
//    		async:false,
    		showMsg:false,
    		callback:function(source){
    			console.error('获取数据');
        		var prodContainerList = source.conList;
        		var mainContainer = source.mainContainer;//基本单位
                
        		$.each(prodContainerList, function(i, v) {
                    if (v.unitName != mainContainer) {
                        v._unitName = v.unitName;
                        v.unitName = v.unitName + '(' + v.rate + mainContainer + ')';
                    }
                });
        		var commonFlag = ComboBoxSources.getInfoMapByKey(prodContainerList, 'commonFlag', true); //常用单位
        		
    			arr.basicUnit = mainContainer;
                arr.unit = commonFlag.unitName;
                arr.unitRate = commonFlag.rate;
                arr.unitsFlag = true;
                if (sourceType == 'salePrice') {
                    arr.priceBefore = commonFlag.salePrice;
                    arr.cost = commonFlag.purchasePrice;
                } else {
                    arr.priceBefore = commonFlag.purchasePrice;
                }
                table.jqxGrid('refresh');
//              console.error(source)
    		}
    	})
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
            			arr.spec=data.spec;
            if (arr.priceBefore == null || arr.priceBefore == '' || arr.priceBefore == 0 || arr.priceBefore == 'NaN') {
                arr.priceBefore = parseFloat(data[sourceType != 'salePrice' ? 'purchasePrice' : 'salePrice']);
            }
            			arr.color=data.color;

            arr.photoId = data.prodPhoto==undefined?arr.photoId:data.prodPhoto;
            //			arr.photoAddId=data.prodPhoto;
            //			arr.unit=data.unit;
            arr.unit = '';
            arr.unitRate = '';
            arr.basicUnit = '';
            arr.unitsFlag = false;
            arr.amountFormula = data.amountFormula; //金额公式
            arr.inventoryQtyFormula = data.inventoryFormula; //库存数量公式
            if (data.multiUnitFlag) {
            	getUnitBySpecColor(arr,data.id);
//            	var user=settings.ownerSettings.userName;
//            	var userId=settings.ownerSettings.soOwnerId; 
//            	Core.AjaxRequest({
//            		type:'get',
//            		url:_global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/inventoryDetail/'+userId+'/'+user+'/'+data.id+'/0/0'),
////            		async:false,
//            		showMsg:false,
//            		callback:function(source){
//            			console.error('获取数据');
//                		var prodContainerList = source.conList;
//                		var mainContainer = source.mainContainer;//基本单位
//                        
//                		$.each(prodContainerList, function(i, v) {
//                            if (v.unitName != mainContainer) {
//                                v._unitName = v.unitName;
//                                v.unitName = v.unitName + '(' + v.rate + mainContainer + ')';
//                            }
//                        });
//                		var commonFlag = ComboBoxSources.getInfoMapByKey(prodContainerList, 'commonFlag', true); //常用单位
//                		
//                        arr.basicUnit = mainContainer;
//                        arr.unit = commonFlag.unitName;
//                        arr.unitRate = commonFlag.rate;
//                        arr.unitsFlag = true;
//                        if (sourceType == 'salePrice') {
//                            arr.priceBefore = commonFlag.salePrice;
//                            arr.cost = commonFlag.purchasePrice;
//                        } else {
//                            arr.priceBefore = commonFlag.purchasePrice;
//                        }
//                        table.jqxGrid('refresh');
////                		console.error(source)
//            		}
//            	})
            	
//              var prodContainerList = data.prodContainerList;
                
            } else {
                arr.basicUnit = data.unit;
                arr.unit = data.unit;
                arr.unitRate = 1;
            }
        }
    }

    //根据cell数据设置列数据
    var setRowCoaData = function(datafield, target) {

        var selectedrowindex = table.jqxGrid('getselectedcell').rowindex;

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
    
    var fouroperations = function(expression, row, qtydatafield,bool) {
        var formulaMap = {
    		volume: 'volume',
            extent: 'extent',
            breadth: 'breadth',
            altitude: 'altitude',
            weight: 'weight',
            price: 'priceBefore',
            originalPrice:'originalPrice',
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
        
        //开启折扣
        if(_global_settings.acOwner.ownerAttr.discountFlag){
        	if(expression.indexOf('price')>-1){
//        		row['originalPrice']=row['price']*row['discount'].split('%')[0]/100;
        		expression=expression.replace('price','originalPrice');
        	}
        }
        
        if (expression.indexOf('meas') > -1) {
            if (_global_settings.acOwner.cartonType == 'volume') {
                expression = expression.replace(/meas/g, 'volume');
            } else {
                expression = expression.replace(/meas/g, 'extent * breadth * altitude');
            }
        }
        
        var arr = expression.split(' ');
        for (var i = 0; i < arr.length; i++) {
            var line = formulaMap[arr[i]];
            if (line != null) {
                arr[i] = row[line];
                if (line == 'qty') {
                    arr[i] = row[qtydatafield]==undefined?0:row[qtydatafield];
                    if(bool){
                    	arr[i] = row['qty'];
                    	//细码特殊处理，数量等于每个细码的绝对值相加
                        if (table.jqxGrid('iscolumnvisible', 'yards')) {
                            var yards = row.yards;
                            var sum = 0;
                            if (yards != null) {
                            	var y = yards.split(',');
                                $.each(y, function(i, v) {
//                                    sum += Math.abs(v);
                                	var abc=eval(v);
//                                	if(v.indexOf('*')>-1){
//                                		var a=v.split('*'),b=1;
//                                		for(var k=0;k<a.length;k++){
//                                			b=b*a[k];
//                                		}
//                                		sum+=b;
//                                	}else{
//                                		if(v > 0){
//                                    		sum += v*1;
//                                    	}
//                                	}
                                	if(abc>0){
                                		sum+=abc;
                                	}
                                })
                                arr[i] = sum;
                            }
                        }
                    	
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
//        console.log(arr)
        for(var i=0,len=arr.length;i<len;i++){
        	if(arr[i]==''){
        		arr[i]=0;
        	}
        }
        return eval(arr.join(''));
    };
    window.fouroperations = fouroperations;
    
  //计算行数据
    var computeRow = function(row) {
        var arr = ['priceBefore', 'cost', 'extent', 'breadth', 'altitude', 'volume',
            'weight', 'totalCartons', 'eachCartons', 'tj', 'qty', 'deliveiedQty', 'deliveryQtyNow', 'purchaseNumber'];
        
        for (var index = 0; index < arr.length; index++) {
            var element = arr[index];
            row[element] = money(row[element], 4, true)
        }
      //单子是否开启公式
        var customFormulaFlag = false;
        if ((addoredit == 'add' && _global_settings.acOwner.ownerAttr.customFormulaFlag) ||
            ((addoredit == 'edit' || addoredit == 'view') && settings.order.customFormulaFlag)) {
            customFormulaFlag = true;
        }

        for (var i = 0; i < aggregates.length; i++) {
            if (aggregates[i].type == 'Multiply') {
                if (aggregates[i].datafield.length == 3) {
                    if (aggregates[i].datafield[2] == 'qty' && !table.jqxGrid('iscolumnvisible', 'eachCartons')) {

                    } else if ((aggregates[i].datafield[0] == 'totalCartons' || aggregates[i].datafield[1] == 'weight') &&
                    		_global_settings.acOwner.prodUnit[0].weightWay!='single'&&!table.jqxGrid('iscolumnvisible', 'totalCartons')) {
                        var v = 1 * row[aggregates[i].datafield[1]];
                        row[aggregates[i].datafield[2]] = money(v, 4, true);
                    }else {
                        if ($.strInArr(aggregates[i].datafield[2], ['price3_server', 'ysprice', 'dsprice','originalPrice'])) {
                            var v = row[aggregates[i].datafield[0]] * row[aggregates[i].datafield[1]];
                            if ($.strInArr(aggregates[i].datafield[2], ['ysprice', 'dsprice'])) {
                                row[aggregates[i].datafield[2]] = money(v);
                            }
                            if (aggregates[i].datafield[2] == 'price3_server') {
                            	if(!_global_settings.acOwner.ownerAttr.discountFlag){
                            		row[aggregates[i].datafield[2]] = money(v);
                                    row['price3'] = money(v);
                            	}
                            }
                            //折后价
                            if(_global_settings.acOwner.ownerAttr.discountFlag){
                            	if(aggregates[i].datafield[2] == 'originalPrice'){
                            		var discount=row[aggregates[i].datafield[1]];
//                            		if(discount==undefined){
////                            			row[aggregates[i].datafield[1]]=discount+'%';
//                            			discount=1;
//                            		}else if(discount==''){
//                            			
//                            		}else{
//                            			if(discount.toString().indexOf('%')>-1){
////                            				row[aggregates[i].datafield[1]]=discount+'%';
////                                			discount+='%';
//                            				discount=discount.split('%')[0];
//                            			}
//                            		}
                            		if(discount!=undefined){
                            			if(discount.toString().indexOf('%')>-1){
                            				discount=discount.split('%')[0];
                            			}
                            		}
//                            		var count=discount.toString().split('%')[0];
                                	var v=row[aggregates[i].datafield[0]]*discount/100;
                                	row[aggregates[i].datafield[2]] = money(v, 4, true);
//                                	row[aggregates[i].datafield[1]] = discount+'%';
                                	row['price3_server']=money(row['qty']*row[aggregates[i].datafield[2]],4,true);
                                	row['price3']=row['price3_server'];
                                }
                            }
                        } else {
                            if (aggregates[i].datafield[1] == 'unitRate' && (!row[aggregates[i].datafield[1]] || table.jqxGrid('iscolumnvisible', 'eachCartons') || !table.jqxGrid('iscolumnvisible', 'unitRate'))) {
                                var v = money(row[aggregates[i].datafield[0]], 4, true) * 1;
                            } else if (aggregates[i].datafield[2] == 'tj') {
                                if (table.jqxGrid('iscolumnvisible', 'eachCartons')) {
                                    var v = row[aggregates[i].datafield[0]] * row[aggregates[i].datafield[1]];
                                } else {
                                    var v = 1 * row[aggregates[i].datafield[1]];
                                }
                            }  else {
                                var v = row[aggregates[i].datafield[0]] * row[aggregates[i].datafield[1]];
                            }

                            //var v = money((row[aggregates[i].datafield[0]]) * (row[aggregates[i].datafield[1]]),4,true);
                            if(aggregates[i].datafield[2]=='qty'&&row.productName!=''&&row.productName!=undefined){
                            	if(v==0) v=1; //qty默认为1
                            }
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
//                            //row[aggregates[i].datafield[2]] = money(v);
//                            	row['price3_server'] = money(v,2,true);
//                              row['price3'] = money(v,2,true);
                                row['price3_server'] = money(v);
                                row['price3'] = money(v);
                            }
                        }
                    }
                }
                try {
                    if (aggregates[i].datafield.length == 5) {
                    	if (aggregates[i].datafield[4] == 'tj') {
                            if (table.jqxGrid('iscolumnvisible', 'eachCartons')) {
                                var v = row[aggregates[i].datafield[0]] * row[aggregates[i].datafield[1]] *
                                    row[aggregates[i].datafield[2]] * row[aggregates[i].datafield[3]];

                            } else {
                                var v = 1 * row[aggregates[i].datafield[1]] *
                                    row[aggregates[i].datafield[2]] * row[aggregates[i].datafield[3]];
                            }
                            row[aggregates[i].datafield[4]] = v;
                        }
                    	
//                        var v = money((row[aggregates[i].datafield[0]]) * (money(row[aggregates[i].datafield[1]]) *
//                            (row[aggregates[i].datafield[2]]) * (row[aggregates[i].datafield[3]])));
//                        row[aggregates[i].datafield[4]] = v;
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

    var grid_refresh = function(json,bool) {
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
        grid_render(data, bool);
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
            }else {
                columns[i].geteditorvalue = function(row, cellvalue, editor, a, b, c) {
                    // return the editor's value.
                    console.log(a, b, c)
//                    var arr = ['yards'];
                    if (editor[0].id.indexOf('yards')>-1) {
                    	var reg=/^(\-?)\d+(\.\d+)?((\*?)(\-?)\d+(\.\d+)?){0,}$/;
                    	var val=editor.val();
                    	var arr=val.split(','),length=arr.length;
                    	var newArr=[];
                    	for(var i=0;i<length;i++){
                    		var abc=money(arr[i],4,true).toString();
                    		if(reg.test(abc)){
//                    			if(abc.indexOf('*')>-1){
//                    				arr[i]=money(abc,4,true);
//                    			}
                    			var bc=eval(abc);
                    			if(bc>0){
                    				newArr.push(abc);
                    			}else if(bc<0){
                    				if(abc.indexOf('*')==-1){
                    					newArr.push(abc);
                    				}
                    			}
                    		}
                    	}
                    	
                        return newArr.toString();
                    }
                    return editor.val();
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
                { name: 'inventoryQtyFormula', type: 'string' },
                { name: 'grid_focus', type: 'string' },
                { name: 'discount', type: 'string'},
                { name: 'originalPrice', type: 'string'},
                { name: 'specId', type: 'string'},
                { name: 'colorId', type: 'string'}
            ],
            addrow: function(rowid, rowdata, position, commit) {
                commit(true);
                timeOut(function() {
                	 table.jqxGrid('endupdate');
                })
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
            selectionmode: 'singlecell',
            //selectionmode: 'singlerow',
            editmode: 'click',
            enableanimations: false,
            scrollmode: 'deferred',
            enablemousewheel: true,
            keyboardnavigation: true,
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
              //table.resize();  
                
                timeOut(function(){
                	grid_refresh();
                });
            },
            rendered: function (columnHeaderElement) {
            	// Your code here.                   
//            	timeOut(function(){
//            		$('#addSaleOrder_grid').jqxGrid('selectcell', 0, 'productName');
//            		$('#addSaleOrder_grid').jqxGrid('begincelledit', 0, 'productName');
//            	},1200)
            },
            handlekeyboardnavigation:function(event){
            	if(table.is(':visible')){
            		var target = event.target;
                	var key = event.charCode ? event.charCode : event.keyCode ? event.keyCode : 0;
                	var id=target.id;
                	//备注换行
                	if(id.indexOf('remarkPrint')>-1){
                		if(key==13){
                			return false;
                		}
                	}
                	
                    console.log('zuhejian?:', key, event.ctrlKey, 'target:', $(target));
                	var index=target.selectionStart==undefined?0:target.selectionStart; //光标位置
                	var cell=table.jqxGrid('getselectedcell');
                	if(cell==undefined){
                		if(key == 27){
                			var img=$('#floatImg>img');
            				if(img.length>0){
            					img.eq(0).trigger('dblclick');
            				}
                		}
                		return ;
                	}
                	if($('#confirmWindow').length==1){
//                		console.log('tanchu');
                		if(key==13){
                			$('#okButton_cf').addClass('btnClass');
                    		timeOut(function(){
        						$('#okButton_cf').trigger('click');
        					},500);
                		}
                		return true;
                	}
                	var value=$(target).val(),rowindex=cell.rowindex,datafield=cell.datafield;
                	var length=value.length==undefined?'':value.length;
                	var t=$('#templateeditor'+table.attr('id')+datafield);
                	
//                	if(key==13){
//                		if (!$('.modal').is(':visible')) {
//                            timeOut(function(param) {
//                                yardsModal(table.attr('id'));
//                            })
//
//                            return true;
//                        }
//                		console.log(cell)
//                	}
                	
//                	return false;
                	
                	//向右
                	if(event.keyCode==39){
                		if(index==length){
                			table.jqxGrid('endcelledit', rowindex, datafield, false);
                		}
                	}
                	//向左
                	if(event.keyCode==37){
                		if(index==0){
                			table.jqxGrid('endcelledit', rowindex, datafield, false);
                		}
                	}
                	
                	if(event.keyCode==9){
                		timeOut(function(){
                			console.log($('#' + t.attr('aria-owns')));
                			$('#' + t.attr('aria-owns')).hide();
                		},60)
                	}
                	
                	//alt+r
                	if(event.keyCode==82&&event.altKey){
//                		console.log('alt+r');
                		if(datafield=='remark'){
                			var len=value.length;
                			target.selectionStart=len;
                			target.selectionEnd=len;
                		}
                	}
                	//0,1,2,3,4,5,6,7,8,9
                	if(event.keyCode==48||event.keyCode==96){
                		if(id=='content'+table.attr('id')){
                			if(datafield=='操作'||datafield=='sequence'){
                				for(var i=0;i<5;i++){
            	            		table.jqxGrid('addrow', null, defaultrow());
            	            	}
                				return true;
                			}
                		}
                	}
                	
                	//ctrl+alt
                	if(event.altKey&&event.ctrlKey){
                		table.jqxGrid('endcelledit', rowindex, datafield, false);
                		table.jqxGrid('selectcell',rowindex,'productName');
                	}
                	
                	//ctrl+x
                	if(event.ctrlKey&&key==88){
                		if(target.className.indexOf('form-control')==-1&&target.className.indexOf('jqx-calendar')==-1){
                			if(t.length){
                    			t.jqxComboBox('close');
                    		}
                			table.jqxGrid('endcelledit', rowindex, datafield, false);
//                			table.jqxGrid('unselectcell',cell.rowindex,cell.datafield);
                    		table.find('.del').eq(rowindex).trigger('click');
                    		return true;
                		}
                	}
                	//ctrl+shift
                	if(event.ctrlKey&&event.shiftKey){
//                		var parent=$(target).parents('#'+table.attr('id'));
                		if(target.className.indexOf('form-control')==-1&&target.className.indexOf('jqx-calendar')==-1){
                			if(t.length){
                    			t.jqxComboBox('close');
                    		}
                			table.jqxGrid('endcelledit', rowindex, datafield, false);
                			table.find('.copy').eq(rowindex).trigger('click');
                			return true;
                		}
                	}
                }
            }
            	
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
//                    var commoit=table.jqxGrid('updaterow',i,records[i])
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
                    var selectIndex = table.jqxGrid('getselectedcell').rowindex;
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
                var selectedrowindex = table.jqxGrid('getselectedcell').rowindex;
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
                var selectedrowindex = table.jqxGrid('getselectedcell').rowindex;
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
            var selectIndex = table.jqxGrid('getselectedcell') + 1;
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
    table.on('click', '.addspecbtn', function() {
        var name = table.attr('id');
        var selectedrowindex = table.jqxGrid('getselectedcell').rowindex;
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
    	grid_refresh(null, false);
    });

    //.jqx-grid-cell,
    table.on('click', '.jqx-grid-header,.jqx-button,.del,.add,.copy,.addPhoto', function(event) {
        console.log(event.keyCode);
        var cell = table.data();
        if (cell.lastcell != null) {
            table.jqxGrid('endcelledit', cell.lastindex, cell.lastcell, false);
        }
        
//        var cell=table.jqxGrid('getselectedcell');
//        var value=cell.value==undefined?'':cell.value;
        
        console.log(event.target.selectionStart);
    });

    /*table.on('blur','input', function (event) {
    	//if($(event.target).attr('id')!='dropdownlistArrowcomboboxeditor'+table.attr('id')){
    		var lastcell=table.data('lastcell');
    		var lastindex=table.data('lastindex');
    		table.jqxGrid('endcelledit', lastindex,lastcell, false);
    	//}
    	
    })*/
    
    //细码enter
//    table.on('keydown',function(e){
//    	e.preventDefault();
//    	var cell=table.jqxGrid('getselectedcell');
//    	var datafield=cell.datafield;
//    	if(datafield=='yards'){
//    		if(e.keyCode==13){
//    			yardsModal(table.attr('id'));
//    			return false;
//    		}
//    	}
//    	
//    	console.log(datafield);
//    });

    //cell开始编辑 
    table.on('cellbeginedit', function(event) {
    	console.log('cellbeginedit',event.keyCode);
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
        
//        timeOut(function(){
//        	if(value != '' && value != undefined){
//        		if(datafield == 'productName' || datafield == 'spec'
//        			|| datafield == 'color' || datafield == 'unitRate'){
//        			if(datafield == 'unitRate') value = args.row.unit;
//        			var text = $('#templateeditoraddSaleOrder_grid'+datafield)[0];
//                	var len = value.toString().length;
//                	text.selectionStart=len;
//                	text.selectionEnd=len;
//        		}else{
//                	var text = $('#textboxeditoraddSaleOrder_grid'+datafield)[0];
//    	        	var len = value.toString().length;
//    	        	text.selectionStart=len;
//    	        	text.selectionEnd=len;
//                }
//            }
//        },60);

        table.data('lastcell', datafield);
        table.data('lastindex', rowBoundIndex);
//        table.jqxGrid('endcelledit', rowBoundIndex, datafield, false);
    });
    
    var search = function(prod,bool) {
//        console.time('搜索时间');
//        var _pk = pk == null ? '_name' : pk;
//        var obj = ComboBoxSources.getInfoMapByKey(settings.productSourceName.productsInUse, _pk);
//        // $.extend(true, {}, obj, obj);
//        var arr = [];
//        var value = null;
//        for (var i in obj) {
//            var oc = obj[i];
//            var pk_rp = _pk.replace('_', '');
//            if (oc[pk_rp] === str) {
//                arr.unshift(oc);
//                value = oc['productName'];
//            } else if (pk_rp === 'name' && oc[pk_rp].replace(oc.sku, '') === str) {
//                arr.unshift(oc);
//                value = oc['productName'];
//            } else if (pk_rp === 'name' &&
//                (oc._name.indexOf(str) > -1 || oc.name.indexOf(str) > -1)) {
//                arr.push(oc);
//            } else if (i.indexOf(str) > -1) {
//                arr.push(oc);
//            }
//        }
//        console.timeEnd('搜索时间');
        
        if(prod=='') return false;
        
        //规格型号/颜色,选择时，判断产品是否为新增
        var newProd = prodArr;
        if(bool){
        	for(var i=0,len=newProd.length;i<len;i++){
            	if(newProd[i].name==prod){
            		return true;
            	}
            }
        	return false;
        }
        console.time('时间')
        var source=settings.productSourceName.product.concat(prodArr);
        for(var i=0,len=source.length;i<len;i++){
        	if(source[i].name==prod){
        		return true;
        	}
        }
        console.timeEnd('时间')
        return false;
    };
    var easytablekeyup = null;
    
    table.on('keyup','.color',function(){
    	console.info('keyup：检测中');
        if (table.prop('comStart') === 'start') {
            event.stopPropagation()
            return; // 中文输入过程中不截断
        }
        var t = $(this);
        var val = t.val();
        var select = $('#templateeditor'+table.attr('id')+'color');
        var items = select.jqxComboBox('getItems');
        
        var label = $('#'+table.attr('id')+'id');
        console.log('keyup:' + event.keyCode);
        
        if(event.keyCode==9){
        	timeOut(function(){
        		$('#' + select.attr('aria-owns')).hide();
        		select.jqxComboBox('open');
        	},60);
        }
        
        clearTimeout(easytablekeyup);
        easytablekeyup = setTimeout(function() {
        	for(var i in items){
        		if(val==items[i].label){
        			select.jqxComboBox('selectItem',val);
        		}
        	}
        }, 60)
    });

    table.on('keyup','.spec',function(){
    	console.info('keyup：检测中');
        if (table.prop('comStart') === 'start') {
            event.stopPropagation()
            return; // 中文输入过程中不截断
        }
        var t = $(this);
        var val = t.val();
        var select = $('#templateeditor'+table.attr('id')+'spec');
        var items = select.jqxComboBox('getItems');
        
        var label = $('#'+table.attr('id')+'id');
        console.log('keyup:' + event.keyCode);
        
        if(event.keyCode==9){
        	timeOut(function(){
        		$('#' + select.attr('aria-owns')).hide();
        		select.jqxComboBox('open');
        	},60);
        }
        
        clearTimeout(easytablekeyup);
        easytablekeyup = setTimeout(function() {
        	for(var i in items){
        		if(val==items[i].label){
        			select.jqxComboBox('selectItem',val);
        		}
        	}
        }, 60)
    });
    
    table.on('cellclick',function(e){
//    	var cell=table.jqxGrid('getselectedcell');
//    	if(cell==null) return ;
//    	var datafield=cell.datafield;
//    	var index=cell.rowindex;
//    	if(datafield=='sequence'||datafield=='操作'){
//    		table.jqxGrid('endcelledit', index, 'productName', false);
//    	}
//    	console.log(e.target.selectionStart);
    });
    
    table.on('keyup', '.productName', function(event) {
        //console.log(event);
        var t = $(this);
        var val = t.val();
        var select = $('#templateeditor'+table.attr('id')+'productName');
        
        var label = $('#' + table.attr('id') + 'id');
        console.log('keyup:' + event.keyCode);
        
        if(event.keyCode == 9) {
        	timeOut(function() {
        		$('#' + select.attr('aria-owns')).hide();
        		select.jqxComboBox('open');
        	},60);
        }

        clearTimeout(easytablekeyup);
        //屏蔽esc
        if(event.keyCode == 27) {
        	$('#floatImg>img').eq(0).trigger('dblclick');
//        	table.jqxGrid('begincelledit', 0, 'grid_focus');
//    		table.jqxGrid('endcelledit', 0, 'grid_focus', true);
        	select.jqxComboBox('open');
        	return true;
        }
        
        easytablekeyup = setTimeout(function() {
            var iputIndex = t.find('input').focusIndex();
//            if (val.length == 0) {
//                label.text('');
//                return ;
//            }
            if(val == '') {
            	label.text('');
            	select.jqxComboBox('clearSelection');
            	return ;
            } else {
            	console.time('检测时间');
            	var bool = search(val);
            	console.timeEnd('检测时间');
            	
            	if(!bool) {
            		label.text('新产品');
            	} else {
            		label.text('');
            		select.jqxComboBox('selectItem',val);
            	}
            }
//          return ;
        }, 60)
    });
    
    //cell结束编辑
    table.on('cellendedit', function(event) {
        //return;
    	event.preventDefault();
        debugger
        var lastcell = table.data();
        $('#'+table.attr('id')+'id').text('');
        var datafield = event.args == null ? {} : event.args.datafield;
        var t = $('#templateeditor'+table.attr('id')+datafield);
        if (t.length > 0) {
            timeOut(function() {
                console.log($('#' + t.attr('aria-owns')));
                $('#' + t.attr('aria-owns')).hide();
                // $('#' + templateeditor.attr('aria-owns')).addClass('hide');
            }, 60)
        }
        
        var rowBoundIndex = event.args.rowindex;
        var selectedrowindex = event.args.rowindex;
        var id = table.jqxGrid('getrowid', selectedrowindex);
        var productName = event.args.value; //去掉粘贴的中间空格
//        if(t.length==0) event.args.value=event.args.oldvalue; //没有打开下拉框
        var row = table.jqxGrid('getrowdata', selectedrowindex);
        var oldname = row.productName;
        if (typeof event.args.value === 'object') {
            var searchName = event.args.value==null?row.name:event.args.value.label;
            var sourceByName = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', searchName);
        } else {
            var searchName = event.args.value.replace(/ /g, '');
            var sourceByName = ComboBoxSources.getInfoMapByKey(settings.productSourceName.productsInUse, 'name', searchName);
        }

        if (datafield == 'productName') { /*&&(event.args.oldvalue.value==row.id||JSON.stringify(sourceByName).toString().length==2)*/
        	if(!table.jqxGrid('iscolumnvisible','yards')){
        		row['qty']=1;
        	}
        	//开启折扣
        	if(table.jqxGrid('iscolumnvisible', 'discount')){
//        		if(row['discount']==''){
        			row['discount']='100%';
//        		}
        	}
        	//开启装箱
        	if(table.jqxGrid('iscolumnvisible','totalCartons')){
        		row['totalCartons']=1;
        		row['eachCartons']=0;
        		row['qty']=0;
        	}
        	
        	//判断输入产品是否为新增并且不为空
            if (JSON.stringify(sourceByName).toString().length == 2 && searchName != '') {
                if (searchName == null) {
                    return true;
                }
//              var endcelledit = table.jqxGrid('endcelledit', selectedrowindex, lastcell.lastcell, false);

                row.productName = searchName;
                row.photoId = '';//row.photoId==undefined?'':row.photoId;
                //tab键
                if(t.jqxComboBox('getSelectedItem')==null){
                	row.spec = '';
                	row.color = '';
                }
                row.name = searchName;
                row.unit = '';
                row.basicUnit = '';
                row.amountFormula = _global_settings.acOwner.ownerAttr.amount;
                row.inventoryQtyFormula = _global_settings.acOwner.ownerAttr.inventoryQty;
                //开启装箱
//            	if(table.jqxGrid('iscolumnvisible','totalCartons')){
//            		row['qty']=1;
//            	}
                //输入不一样
                if(!search(searchName)){
                	prodArr.push({name:searchName});
                }
                timeOut(function() {
//                    $('#comboboxeditor' + table.attr('id') + datafield).jqxComboBox('addItem', searchName);
                    var commit = table.jqxGrid('updaterow', id, row);
                }, 0)
                return true;
            }
            if (sourceByName.name != '' && sourceByName.name != null) {
                //选择下拉的
                if (event.args.oldvalue === event.args.value.value) {
                    return false;
                }
                row.productName = searchName;
                row.photoId = sourceByName.prodPhoto;//==undefined?row.photoId:sourceByName.prodPhoto;
//              row.spec = '';
//              row.color = '';
                row.name = searchName;
//              if(event.args.oldvalue == '')
                setRowData(datafield, rowBoundIndex);
            } else {
            	//开启折扣
            	if(table.jqxGrid('iscolumnvisible', 'discount')){
            		row['discount']='0';
            	}
            	row.qty = 0;
                row.productName = searchName;
                row.photoId = '';
                row.spec = '';
                row.color = '';
                row.name = '';
                row.unit = '';
                row.basicUnit = '';
                //tab键
                if(t.jqxComboBox('getSelectedItem')==null){
                	t.jqxComboBox('close');
                }
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
                //tab键
                if(t.jqxComboBox('getSelectedItem')==null){
                	t.jqxComboBox('close');
                }
            }
        } else if(datafield=='spec'){ //(datafield != 'productName')
        	//规格型号新增
        	var t = $('#templateeditor'+table.attr('id')+datafield);
        	var label = event.args.value.label;
        	var item = t.jqxComboBox('getSelectedItem');
        	
        	//输入时没有选中，表示新增
        	if(item==null){
        		if(label!='')
        		specArr.push({descr:label});
        	}
        	//tab键
            if(t.jqxComboBox('getSelectedItem')==null){
            	t.jqxComboBox('close');
            }
        	row[datafield] = label;
        } else if(datafield=='color'){
        	var prod = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', row.productName);
        	//颜色新增
        	var t = $('#templateeditor'+table.attr('id')+datafield);
        	var label = event.args.value.label;
        	var item = t.jqxComboBox('getSelectedItem');
        	
        	//输入时没有选中，表示新增
        	if(item==null){
        		if(label!='')
        		colorArr.push({descr:label});
        	}
        	//tab键
            if(t.jqxComboBox('getSelectedItem')==null){
            	t.jqxComboBox('close');
            }
        	row[datafield] = label;
        } else if(datafield=='yards'){
        	var yards = event.args.value,sum = 0;
        	row[datafield] = event.args.value;
//        	for(var i=0;i<yards.length;i++){
//        		if(yards[i]=='，'){
//        			str+=',';
//        		}else{
//        			str+=yards[i];
//        		}
//        	}
        	$.each(yards.split(','), function(i, v) {
        		sum+=eval(v);
//        		if(v.indexOf('*')>-1){
//        			var a=v.split('*');
//        			var b=1;
//        			for(var i=0;i<a.length;i++){
//        				b=b*a[i];
//        			}
//        			sum+=eval(a.join(''));
//        			sum+=b;
//        		}else{
//        			sum += v*1;
//        		}
            });
        	row.qty = sum;
        	
        } else if(datafield=='discount'){
        	var a=event.args.value.split('%')[0];
        	var b=(a>=1000||a<=0)?1000:money(a);
        	var c=b.toString().split('.');
        	if(c.length==1){
        		b=c[0];
        	}else{
        		if(c[1]=='00'){
        			b=c[0];
        		}
        	}
        	row[datafield]=b+'%';
        	row['originalPrice']=money(row['priceBefore']*b/100,4,true);
        }else{
        	row[datafield] = event.args.value;
        }

        row.qty=(row.qty==''||row.qty=='NaN')?0:row.qty;
        var oldqty = row.qty;
//        var arr2 = ['priceBefore'];
//        for (var i = 0; i < arr2.length; i++) {
//            var v = row[arr2[i]];
//            row[arr2[i]] = money(v, 4, true);
//        }
        
//        computeRow(row);
        
        if (datafield == 'qty') {
            row.totalCartons = 0;
            row.eachCartons = 0;
            row.qty = oldqty;
        }
        var arr = ['weight', 'priceBefore', 'totalCartons', 'eachCartons', 'qty', 'extent', 'breadth', 'altitude', 'volume', 'tj', 'deliveiedQty', 'deliveryQtyNow'];
        for (var i = 0; i < arr.length; i++) {
            var v = row[arr[i]];
            row[arr[i]] = money(v, 4, true);
            var arrs = ['extent', 'breadth', 'altitude', 'volume'];
            if (arrs.indexOf(arr[i]) > -1) {
                row[arr[i]] = money(v, 4, true,true);
            }
        }
        
        computeRow(row);
        
        //table.jqxGrid('refresh');
        var xrow = $.extend(true, {}, row);
        console.error(row)
        if (datafield == 'productName') {
        	var prod = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', row.productName);
        	console.error(prod.id)
        	getProductInfoById(prod.id);
            if (typeof settings.columnSumEvent === 'function') {
                settings.columnSumEvent();
            }
        } else {
            timeOut(function() {
            	if(datafield=='spec'||datafield=='color'){
            		var prod = ComboBoxSources.getInfoMapByKey(productSourceName, 'name', row.productName);
            		if(event.args.value.value != event.args.oldvalue){
            			if(prod.id){
                			setUnit(xrow,prod.id);
                		}
            		}
            	}
            	console.log(xrow)
                var commit = table.jqxGrid('updaterow', id, xrow);
                if (typeof settings.columnSumEvent === 'function') {
                    settings.columnSumEvent();
                }
            }, 0)
        }

        return true;

    });
    
    var setUnit=function(row,id){
    	var prodId=id;
    	var userId=settings.ownerSettings.soOwnerId;
    	var name=settings.ownerSettings.userName;
    	Core.AjaxRequest({
    		type:'get',
    		url:_global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/productid/' + prodId + '/' + userId + '/' +name),
    		async:false,
    		showMsg:false,
    		callback:function(res){
    			if(!res.multiUnitFlag){
        			var prodColourList=res.prodColourList;
                	for(var i=0;i<prodColourList.length;i++){
                		if(row[color]==prodColourList[i].descr){
                			var photo='';
                			if(prodColourList[i].photo!=undefined&&prodColourList[i].photo!=''){
                				photo=prodColourList[i].photo;
                			}
                			if(photo!=''){
                				row.photoId=photo;
                			}
                		}
                	}
    				
    				return false;
    			}
    			var spec = row.spec == undefined ? '' : row.spec;
    			var color = row.color == undefined ? '' : row.color;
    			var inDataList = res.inDataList;
        		var mainContainer = res.prodContainerList[0].unitName;//基本单位
    			$.each(inDataList, function(i, v) {
        			if(spec == v.spec && color == v.colour){
        				var prodContainerList = v.prodContainerList;
        				$.each(prodContainerList,function(x,y){
        					if (y.unitName != mainContainer) {
		                        y._unitName = y.unitName;
		                        y.unitName = y.unitName + '(' + y.rate + mainContainer + ')';
		                    }
        				});
        				
        				var commonFlag = ComboBoxSources.getInfoMapByKey(prodContainerList, 'commonFlag', true); //常用单位
        				row.basicUnit = mainContainer;
        				row.unit = commonFlag.unitName;
        				row.unitRate = commonFlag.rate;
        				row.unitsFlag = true;
                        if (sourceType == 'salePrice') {
                        	row.priceBefore = commonFlag.salePrice;
                        	row.cost = commonFlag.purchasePrice;
                        } else {
                        	row.priceBefore = commonFlag.purchasePrice;
                        }
                        return false;
//                        table.jqxGrid('refresh');
        			}else{
        				var prodContainerList = res.prodContainerList;
        				$.each(prodContainerList,function(x,y){
        					if (y.unitName != mainContainer) {
		                        y._unitName = y.unitName;
		                        y.unitName = y.unitName + '(' + y.rate + mainContainer + ')';
		                    }
        				});
        				row.basicUnit = mainContainer;
        				row.unit = row.unit;
        				row.unitRate = row.unitRate;
        				row.unitsFlag = true;
//                        if (sourceType == 'salePrice') {
//                        	row.priceBefore = commonFlag.salePrice;
//                        	row.cost = commonFlag.purchasePrice;
//                        } else {
//                        	row.priceBefore = commonFlag.purchasePrice;
//                        }
        			}
                });
    		}
    	})
    }
    
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
$.fn.getDataWash = function(checked) {
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
    var selectedrowindex = $(this).jqxGrid('getselectedcell').rowindex;
    return $(this).jqxGrid('getrowdata', selectedrowindex);
};
//hide show
$.fn.boxSetting = function(visible) {
//    var t = $(this);
//    var type = visible == 'hide' ? 'hidecolumn' : 'showcolumn';
//    var bool = visible == 'hide' ? true : false;
////    var arr = ['totalCartons', 'eachCartons', 'extent', 'breadth', 'altitude'];
//    var arr = ['totalCartons', 'eachCartons'];
//
////    if (_global_settings.acOwner.cartonType == 'volume') {
////        arr = ['totalCartons', 'eachCartons', 'volume'];
////    }
//    
//    t.jqxGrid('beginupdate');
//    for (var i = 0; i < arr.length; i++) {
//        t.jqxGrid(type, arr[i]);
//    }
//    
//    t.jqxGrid('endupdate');
//    t.jqxGrid('setcolumnproperty', 'qty', 'editable', bool);
//    t.trigger('refresh');
    var t = $(this);
    if (t.is(':hidden')) {
        return;
    }
    var type = visible == 'hide' ? 'hidecolumn' : 'showcolumn';
    var bool = visible == 'hide' ? true : false;
    var arr = ['totalCartons', 'eachCartons'];
    t.jqxGrid('beginupdate');
//    if (t.jqxGrid('iscolumnvisible', 'suppliersId')) {
//        if (bool) {
//            t.jqxGrid('hidecolumn', 'purchaseNumber');
//            t.jqxGrid('showcolumn', 'purchaseNumberSum');
//        } else {
//            t.jqxGrid('showcolumn', 'purchaseNumber');
//            t.jqxGrid('hidecolumn', 'purchaseNumberSum');
//        }
//        // arr = ['totalCartons', 'eachCartons', 'purchaseNumber'];
//    }
    for (var i = 0; i < arr.length; i++) {
        t.jqxGrid(type, arr[i]);
    }
    t.jqxGrid('setcolumnproperty', 'qty', 'editable', bool);

    t.jqxGrid('endupdate');
    t.trigger('refresh');
};
$.fn.printOfGoodsFlag = function(visible) {

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
$.fn.productMeasFlag = function(visible,cartonType) {
    var t = $(this);
    var type = visible == 'hide' ? 'hidecolumn' : 'showcolumn';
    var arr = ['volume'];
    //根据设置或隐藏
    if (cartonType == 'size' || cartonType == null) {
        arr = ['extent', 'breadth', 'altitude'];
    }

    t.jqxGrid('beginupdate');	
    for (var i = 0; i < arr.length; i++) {
        t.jqxGrid(type, arr[i]);
    }
    t.jqxGrid('endupdate');
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
$.setGoodsBinning = function(selector, id, _row, callback, sourceType, isasync, totalCartons, sourcesProduct) {
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
var specArr = []; //规格数组
var colorArr= []; //颜色数组
var prodArr = []; //产品数组

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
            var val = tr.eq(0).find('input').val();
            if(check(val)){
            	Core.alert({ message: '单位已存在，请重新输入！' });
            	tr.eq(0).find('input').val('');
                return false;
            }
            
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

    var selectedrowindex = $('#' + gridName).jqxGrid('getselectedcell').rowindex;
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
                var cell = $('#' + gridName).data();
                $('#' + gridName).jqxGrid('begincelledit', selectedrowindex, 'grid_focus');
                $('#' + gridName).jqxGrid('endcelledit', selectedrowindex, 'grid_focus', true);
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
                success: function(data) {
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

//细码模态框事件
var yardsModal = function(gridName) {
    var selectedrowindex = $('#' + gridName).jqxGrid('getselectedcell').rowindex;
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
            var selectedrowindex = $('#' + gridName).jqxGrid('getselectedcell').rowindex;
            t.jqxGrid('setcellvalue', selectedrowindex, "yards", arr.join(','));
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
        if (columns[i].datafield === 'qty'/* && qtyeditable*/) {
        	if(qtyeditable){
        		columns[i].editable = true;
        	}
        	if(_global_settings.acOwner.yardsFlag){
        		columns[i].editable = false;
        	}
            //		}else if(columns[i].datafield==='printOfGoods'&&ComboBoxSources.getRecords('priseInfo')[0].blueTooth){
        }
        
//        if(columns[i].datafield=='discount'||columns[i].datafield=='originalPrice'){
//        	//开启折扣
//        	if(_global_settings.acOwner.ownerAttr.discountFlag){
//        		columns[i].hidden=false;
//        	}
//        }
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
    var html = $("<div style='position: fixed;display:none;z-index: 9999990;' id='floatImg'></div>");
    var html2 = $("<div class='md-rotate-right hide' id='floatImg_rotate' title='点击旋转' style='color:red;cursor:pointer;font-size:33px;float:right;position:fixed;z-index:999'></div>");
    $('body').append(html).append(html2);
    //    dragImg('floatImg');

    var oImg = document.getElementById('floatImg');
    /*拖拽功能*/
    (function() {
    	$('#floatImg').off('mousedown').on({
//			'dblclick':function(){
//				$(this).hide();
//			},
			'mousedown':function(e){
				console.log(e);
				var start = true;
				var clientX = e.clientX;
				var clientY = e.clientY;
				var left = $(this)[0].offsetLeft;
				var top = $(this)[0].offsetTop;
				console.log(clientX,clientY,left,top);
				
				var _w = oImg.offsetWidth,_h = oImg.offsetHeight;
				var rotate = oImg.getAttribute('rotate');
	            if(rotate==90||rotate==270){
	            	var a=(oImg.offsetHeight-oImg.offsetWidth)/2;
	            	_w = oImg.offsetHeight-a,_h = oImg.offsetWidth+a;
	            }
	            console.log(_w,_h)
				
				$(this)[0].ondragstart = function() {
                    return false;
                } //拖动图片时，防止鼠标变形
				
	            $('#floatImg').off('mousemove').on('mousemove',function(evt){
					var _left = evt.clientX - clientX;
					var _top = evt.clientY -clientY;
					if(start){
						console.log(_left,_top,left,top)
			            $('#floatImg_rotate').css({top:top+_top+_h,left:left+_left+_w});
						$('#floatImg').css({left:left + _left,top:top + _top});
					}
				});
	            $('#floatImg').off('mouseup').on('mouseup',function(e){
					console.error('mouseup',e);
					start = false;
				});
			}
		});
    	
//        addEvent(oImg, 'mousedown', function(ev) {
//            var oEvent = prEvent(ev),
//                oParent = oImg.parentNode,
//                disX = oEvent.clientX - oImg.offsetLeft,
//                disY = oEvent.clientY - oImg.offsetTop,
//                ww = oImg.offsetWidth,hh = oImg.offsetHeight;
//            
//            var rotate = oImg.getAttribute('rotate');
//	            if(rotate==90||rotate==270){
//	            	var a=(oImg.offsetHeight-oImg.offsetWidth)/2;
//	            	ww = oImg.offsetHeight-a,hh = oImg.offsetWidth+a;
////	            	console.log(ww,hh)
//	            }
//                startMove = function(ev) {
//                    if (oParent.setCapture) {
//                        oParent.setCapture();
//                    }
//                    var oEvent = ev || window.event,
//                        l = oEvent.clientX - disX,
//                        t = oEvent.clientY - disY;
//                    oImg.style.left = l + 'px';
//                    oImg.style.top = t + 'px';
//                    $('#floatImg_rotate').css({top:t+hh,left:l+ww});
//                    oParent.onselectstart = function() {
//                        return false;
//                    }
//                },
//                endMove = function(ev) {
//                    if (oParent.releaseCapture) {
//                        oParent.releaseCapture();
//                    }
//                    oParent.onselectstart = null;
//                    removeEvent(oParent, 'mousemove', startMove);
//                    removeEvent(oParent, 'mouseup', endMove);
//                };
//            addEvent(oParent, 'mousemove', startMove);
//            addEvent(oParent, 'mouseup', endMove);
//            
//            return false;
//        });
    })();
    /*以鼠标位置为中心的滑轮放大功能*/
    (function() {
    	$('#floatImg').on('mousewheel', function(e, xy) {
            //e.originalEvent.deltaY>0?'向下':'向上';
    		var node = $(this);
            var sfbs = e.originalEvent.wheelDelta > 0 ? 1.1 : 0.9;
            var psbs = e.originalEvent.wheelDelta > 0 ? -0.1 : 0.1;
            //				var w=node.width();
            //				var h=node.height();
            var w = parseFloat(node[0].style.width.replace('px', ''));
            var h = parseFloat(node[0].style.height.replace('px', ''));
            console.log(w, h)
//            var position = node.position();
            var top = parseFloat(node.css('top').replace('px', ''));
            var left = parseFloat(node.css('left').replace('px', ''));
            var wh = {
                top: top + psbs * h / 2,
                left: left + psbs * w / 2,
                width: w * sfbs,
                height: h * sfbs
            };
            node.css(wh);
            var t = $('#floatImg_rotate');
            var r = node.attr('rotate')==undefined?0:parseFloat(node.attr('rotate'));
            if(r==360) r=0;
            var rt = parseFloat(t.css('top').replace('px', ''));
            var rl = parseFloat(t.css('left').replace('px', ''));
            if(r==0||r==180){
        		t.css({top:rt - psbs * h / 2,left:rl - psbs * w / 2});
        	}else{
        		t.css({top:rt - psbs * w / 2,left:rl - psbs * h / 2});
        	}
//            t.css({top:rt - psbs * h / 2,left:rl - psbs * w / 2});
//            b.css({top:top+h+(w-h)/2,left:left+w-(w-h)/2});
            return false;
        })
    	
//        addWheelEvent(oImg, function(delta) {
//            var ratioL = (this.clientX - oImg.offsetLeft) / oImg.offsetWidth,
//                ratioT = (this.clientY - oImg.offsetTop) / oImg.offsetHeight,
//                ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
//                w = parseInt(oImg.offsetWidth * ratioDelta),
//                h = parseInt(oImg.offsetHeight * ratioDelta),
//                l = Math.round(this.clientX - (w * ratioL)),
//                t = Math.round(this.clientY - (h * ratioT)),
//            	ww = w,hh = h;
//            
//            var rotate = oImg.getAttribute('rotate');
//	            if(rotate==90||rotate==270){
//	            	var a=(h-w)/2;
//	            	ww = h-a,hh = w+a;
////	            	console.log(ww,hh)
//	            }
//            with(oImg.style) {
//                width = w + 'px';
//                height = h + 'px';
//                left = l + 'px';
//                top = t + 'px';
//            }
//            $('#floatImg_rotate').css({top:t+hh,left:l+ww});
//        });
    })();

    $('#floatImg_rotate').on('click', function() {
        var rotate = $('#floatImg').data('rotate');
        rotate += 90;
        $('#floatImg').data('rotate', rotate).css('transform', 'rotate(' + rotate + 'deg)');
        setPosition($('#floatImg'),$('#floatImg_rotate'),true);
//        var w = $('#floatImg').width(),h = $('#floatImg').height();
//        var top = $('#floatImg').offset().top,left = $('#floatImg').offset().left;
//        $(this).css({top:top+h,left:left+w});
//        $('#floatImg').attr('width',h).attr('height',w);
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
    
    //旋转按钮在右下角
    var setPosition=function(a,b,t){
    	var boolean=t==undefined?false:t; //点击按钮
    	var w = parseFloat(a[0].style.width.replace('px','')),
    		h = parseFloat(a[0].style.height.replace('px','')),
        	top = parseFloat(a[0].style.top.replace('px','')),
        	left = parseFloat(a[0].style.left.replace('px',''));
        
        if(boolean){
        	var r=a.attr('rotate')==undefined?0:parseFloat(a.attr('rotate'));
        	if(r==360) r=0;
        	if(r==90||r==270){
        		b.css({top:top+h,left:left+w});
        	}else{
        		b.css({top:top+h+(w-h)/2,left:left+w-(w-h)/2});
        	}
        	a.attr('rotate',r+90);
        }else{
//        	if(!b.is(':visible')){
            	b.removeClass('hide');
            	b.css({top:top+h,left:left+w});
//            }else{
//            	b.addClass('hide');
//            }
        }
    }
    
    var imgPosition=function(childImg){
    	isImgLoad(function() {
        	var w=0;
        	for(var i=0;i<childImg.length;i++){
        		w+=childImg[i].naturalWidth;
        	}
//            var w = $('#floatImg>img')[0].naturalWidth;
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
//              height: h
            }).show();
            
            setPosition($('#floatImg'),$('#floatImg_rotate'));
            
        }, '#floatImg>img');
    }
    
    $(document).on(
        'dblclick', 'img',
        function(e) {
        	var t = $(this);
        	var dataId=t.attr('data-id');
        	$('#floatImg').data('rotate', 0).css('transform', 'rotate(0deg)');
           
            var src = t.attr('src') == null ? '' : t.attr('src');
            if (src == null || src == '' || src.indexOf('rs/SimpleAC/down') == -1) {
                return;
            }
            src = src.replace('/thumbnail/', '/original/');
            var img=$("<img style='height:100%'/>");
            img.attr('src',src).attr('data-id',dataId).addClass('floatImg');
//            $('#floatImg').append(img);
//            var wid=(100/$('#floatImg>img').length).toFixed(2);
//            $('#floatImg>img').css({width:wid+'%'});
        	console.log(dataId);
//        	return false;
        	if($('#floatImg').is(':visible')) {
        		$('#floatImg').attr('rotate', 0)
        		var cls=t.attr('class');
        		var child=$('#floatImg>img');
        		var length=child.length;
        		if(length<=5){
        			if(length==5){
        				if(cls=='floatImg'){
        					t.remove();
        					var c=$('#floatImg>img');
        					if(c.length==0){
        						$('#floatImg').attr('rotate',0).hide();
        	                    $('#floatImg_rotate').addClass('hide');
        					}else{
        						var wid=(100/c.length).toFixed(2);
        		        		c.css({width:wid+'%'});
        		        		imgPosition(c);
        					}
        					return ;
        				}else{
        					return ;
        				}
        			}
    				for(var i=0;i<length;i++){
            			var dId=$(child[i]).attr('data-id');
            			
            			if(cls=='floatImg'||dId==dataId){
        					$(child[i]).remove();
        					var c=$('#floatImg>img');
        					if(c.length==0){
        						$('#floatImg').attr('rotate',0).hide();
        	                    $('#floatImg_rotate').addClass('hide');
        					}else{
        						var wid=(100/c.length).toFixed(2);
        		        		c.css({width:wid+'%'});
        		        		imgPosition(c);
        					}
        					return ;
        				}
            		}
        		}
        		
        		$('#floatImg').append(img);
        		var wid=(100/$('#floatImg>img').length).toFixed(2);
        		$('#floatImg>img').css({width:wid+'%'});
        		
        	}else{
        		$('#floatImg').append(img);
	            var wid=(100/$('#floatImg>img').length).toFixed(2);
	            $('#floatImg>img').css({width:wid+'%'});
        	}
            
            imgPosition($('#floatImg>img'));
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