/**
 * *********************************************
 * 
 * 我的Bss界面js
 * 
 * 分别有三个主要功能，秒账折扣，注册销售负责人，注册客服负责人.分别用三个构造函数做以区分
 * 
 * *********************************************
 */

var MyBssMgt = function () {
    var me = this;
    var rowdata = null;
    var list = null;
    this.url = _global_settings.service.url;
    var recordList = null;
    var list = null;

    this.searchObj = {};

    this.init = function () {
    	me.initGrid();
        me.initEvent();
        me.bindModel();
        $('#myBssName').text(_global_settings.owner.companyname);
        $('#myBssBar').find('span').eq(0).css('color', 'orange');
    }

    var getJson = function (tj) {
        if (tj != null) {
            if (tj == 'regSaler') {
                $('#myBssMatchGrid').css('display','block');
                $('#productInformaticaGrid').css('display','none');
                $('#myBssMatchCustGrid').css('display','none');
            }else if(tj == 'acDisacount'){
            	$('#myBssMatchGrid').css('display','none');
                $('#productInformaticaGrid').css('display','block');
                $('#myBssMatchCustGrid').css('display','none');
            }else if(tj == 'regCustomers'){
            	$('#myBssMatchGrid').css('display','none');
                $('#productInformaticaGrid').css('display','none');
                $('#myBssMatchCustGrid').css('display','block');
            }
        }
    };
	getJson();
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('productInformaticaGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
	  	   ,pageable:false
	  	   ,autorowheight: true
		    ,autoheight: true
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[								
				{ text: '产品模块',width:'15%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid"  style="position: relative; top:50%; margin-top:-10px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
		  	            	html += rowdata.productName;
	  	            		html += '</div>';
  	            		return html;
					}
				},
				{ text: '产品编号',dataField:'productCode',width:'10%'},
				{ text: '产品简介',dataField:'description',width:'40%'},
				{ text: '产品价格/月',dataField:'priceAmt',cellsalign:'right', cellsformat: 'c2',width:'12%'},
				{ text: '月份/折扣率',width:'13%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid" style="text-align:right;">';
  	            			$.each(rowdata.priceStrategy,function(i,v){
  	            				html+= rowdata.priceStrategy[i].timeNum+'/'+rowdata.priceStrategy[i].totalAmt+'<br />';
  	            			})
	  	            		html += '</div>';
  	            		return html;
					}
				},
				{ text: '操作',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid"  style="text-align:center">';
  	            			html += '<a class="hoverspan md-format-list-bulleted fpDisacount"></a>';
	  	            		html += '</div>';
  	            		return html;
					}
				},
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#productInformaticaGrid').grid(grid_sets);
	}	
	
	this.settings = {  
		source:{
	        url: me.url+'/accountproduct/page',
	        data:me.searchObj,
	    },
		grid:{element:'productInformaticaGrid'},
		ajax:{url:me.url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
		};
	}
	
	this.searchDataInfo = function(){
    	$('#productInformaticaGrid').jqxGrid('applyfilters');
    	$('#productInformaticaGrid').jqxGrid('refreshfilterrow'); 
    	$('#productInformaticaGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#productInformaticaGrid').jqxGrid('updatebounddata', 'cells');
    	$('#productInformaticaGrid').jqxGrid('clearselection');
    	$('#productInformaticaGrid').jqxGrid('refreshdata');
    };

    this.initEvent = function () {
        $('#myBssBar').on('click', 'span', function () {
            $('#myBssBar').find('span').css('color', '');
            $(this).css({'color': 'orange'});
            getJson($(this).attr('data-id'));
        })
    }
    
    
    /**
     * 折扣初始化弹出框
     * 
     * 区分有数据情况下和没有数据的情况
     * 
     * 有数据加上data-id=当前这一行的id，没有数据就新增，则不加data-id,删除的时候会用到data-id，如果有data-id。则请求接口删除。没有则前台直接删除
     * 
     */
    this.setLine = function () {
    	//有数据的情况下
        if (list.priceStrategy.length > 0) {
            for (var i = 0; i < list.priceStrategy.length; i++) {
            	var rowIds = list.priceStrategy[i].id;
                var line = $('<tr style="border-bottom: solid 1px #ccc;"'
                		+' data-id = '+rowIds+'>'
                		+'<td><span>秒账折扣时长</span><button class="spanbg">-</button><input type="text" value="1" class="acDiscountMonth"><button class="spanbg">+</button><span>个月 ，折扣为</span><input type="text" value="0.1" class="acDiscountResult" style="margin-left:5px;"></td>'
                		+'<td style="border-top:solid 1px #ccc; margin-top:-1px;"><i class="md-cancel del" title="删除"></i></td>'
                		+'</tr>');
                $('#acDiscount-tbody').append(line);
                $('#acDiscount-tbody').off('click');
                $('#acDiscount-tbody').find('tr>td:last-child').css('display', 'none');
                line.find('.acDiscountMonth').val(list.priceStrategy[i].timeNum == undefined ? '1' : list.priceStrategy[i].timeNum);
                line.find('.acDiscountResult').val(list.priceStrategy[i].totalAmt == undefined ? '0.2' : list.priceStrategy[i].totalAmt);
                line.find('.acDiscountMonth').attr('disabled', true);
                line.find('.acDiscountResult').attr('disabled', true);
                line.find('.spanbg').attr('disabled', true);
                $('#editAcDiscount').css('display', 'block');
                $('#addAcDiscount').css('display', 'none');
            }
        } else {
        	//没有数据的情况下----新增
            $('#saveAcDiscount').css('display', 'none');
//            $('#cancelAcDiscount').css('display', 'none');
            $('#editAcDiscount').css('display', 'none');
            $('#addAcDiscount').css('display', 'block');
        }

    }
    
    //折扣新增一行
    this.addLine = function () {
        var index = $('#acDiscount-tbody').children().length + 1;
        var line = $('<tr style="border-bottom: solid 1px #ccc;"><td><span>秒账折扣时长</span><button class="spanbg">-</button><input type="text" value="1"  class="acDiscountMonth"><button class="spanbg">+</button><span>个月 ，折扣为</span><input type="text" value="0.1" class="acDiscountResult" style="margin-left:5px;"></td><td style="border-top:none;"><i class="md-cancel del" title="删除"></i></td></tr>');
        $('#acDiscount-tbody').append(line);
        me.changeTimeNum();
        me.removeLine();
        $('#acDiscount-tbody').off('click');
        $('#acDiscount-tbody').on('click', 'tr', function () {
            if ($(this)[0] == $('#acDiscount-tbody').find('tr').eq(-1)[0]) {
                me.addLine();
            }
        });
    }
    
    //加加减减
    this.changeTimeNum = function () {
        $('.spanbg').off('click');
        $('.spanbg').on('click', function (e) {
            var n = $(this);
            var num = parseInt(n.parent().find('.acDiscountMonth').val());
            if (n.text() == '-') {
                if (num > 1)
                    n.parent().find('.acDiscountMonth').val(num - 1);
            }
            if (n.text() == '+') {
                if (num < 12)
                    n.parent().find('.acDiscountMonth').val(num + 1);
            }
        });
    }
    //折扣点击删除
    this.removeLine = function () {
        $('#acDiscount-tbody').find('tr>td:last-child').off('click')
        $('#acDiscount-tbody').find('tr>td:last-child').on('click', function (event) {
            event.stopPropagation();
            var tr = $(this).parent();
            var indexs = $(this).parent().index();
            var ids = null;
            console.log(indexs);
            if ($('#acDiscount-tbody').find('tr').length > 1) {
                if (list.priceStrategy.length > 0) {
                    for (var i = 0; i < $('#acDiscount-tbody').find('tr').length; i++) {
                        if (tr.attr('data-id')!=undefined) {
                            //移除接口返回的
                            ids = tr.attr('data-id');
                            console.log(ids);
                            Core.confirm({
                                message: "确定要删除？",
                                confirmCallback: function () {
                                    Core.AjaxRequest({
                                        url: _global_settings.service.url + "/pricestrategy/" + ids,
                                        type: "DELETE",
                                        dataType: 'text',
                                        showMsg: false,
                                        callback: function (res) {
                                            tr.remove();
                                        },
                                        failure: function (res) {
                                        }
                                    });
                                }
                            });
                            break;
                        } else {
                            //编辑时移除，此时表格是有数据的
                            Core.confirm({
                                message: "确定要删除？",
                                confirmCallback: function () {
                                    tr.remove();
                                }
                            });
                            break;
                        }
                    }
                } else {
                    //新增时移除,没有数据情况下
                    Core.confirm({
                        message: "确定要删除？",
                        confirmCallback: function () {
                            tr.remove();
                        }
                    });
                }
            }
        });
    }
    
    this.bindModel = function(){
    
	    //折扣新增--在最初始状态下，没有任何数据
	    $('#addAcDiscount').off().on('click', function () {
	        me.addLine();
	        $('#saveAcDiscount').css('display', 'block');
	        $('#editAcDiscount').css('display', 'none');
	        $('#addAcDiscount').css('display', 'none');
	//        $('#cancelAcDiscount').css('display', 'block');
	    });
	    
	    //折扣编辑
	    $('#editAcDiscount').off('click').on('click', function () {
	        //点击行添加行
	        $('#acDiscount-tbody').off().on('click', 'tr', function () {
	            if ($(this)[0] == $('#acDiscount-tbody').find('tr').eq(-1)[0]) {
	                me.addLine();
	            }
	        });
	        me.changeTimeNum();
	        me.removeLine();
	        $('#acDiscount-tbody').find('tr>td:last-child').css('display', 'block');
	        $(this).css('display', 'none');
	        $('#saveAcDiscount').css('display', 'block');
	        $('.spanbg').removeAttr('disabled');
	        $('.acDiscountMonth').removeAttr('disabled');
	        $('.acDiscountResult').removeAttr('disabled');
	//        $('#cancelAcDiscount').css('display', 'block');
	    });
	    
	    //打开秒账折扣窗口
	    $('#productInformaticaGrid').on('click','.fpDisacount',function(){
			var index = $('#productInformaticaGrid').jqxGrid('getselectedrowindex');
			var rowdata = $('#productInformaticaGrid').jqxGrid('getrowdata',index);
			list = rowdata;
			console.log(list);
			$('#myBss_Grid').modal('show');
    		$('#acDiscount-tbody').html('');
    		me.setLine();
		});
	
	    //点击保存---一行就是一个请求---多行发多次请求
		$('#saveAcDiscount').off('click').on('click', function () {
			 var acDiscountTr = $('#acDiscount-tbody').find('tr');
		        for (var i = 0; i < acDiscountTr.length; i++) {
		            var PriceStrategy = {};
			            PriceStrategy.timeNum = $('.acDiscountMonth').eq(i).val();
			            PriceStrategy.totalAmt = $('.acDiscountResult').eq(i).val();
			            
			            PriceStrategy.accountProduct = {
			            		id: list.id,
			            		productCode: list.productCode,		//产品编号
			            		productName: list.productName,		//产品模块
			            		description: list.description,		//产品简介
			            		permission: list.permission,
			            		priceAmt: list.priceAmt				//产品价格
			            };
	            		console.log(PriceStrategy);			            
			            
		            if( $('.acDiscountResult').eq(i).val()>1 || $('.acDiscountResult').eq(i).val()<0){
		            	Core.alert({message:'请检查输入格式是否正确！'});
		            	break;
		            }
			            
			        //保存接口请求到的数据---带上id
		            if ($('#acDiscount-tbody').find('tr').eq(i).attr('data-id') != undefined) {
		                PriceStrategy.id = $('#acDiscount-tbody').find('tr').eq(i).attr('data-id');
		                
		                if ($('.acDiscountResult').eq(i).val() != '') {
			                Core.AjaxRequest({
			                    type: "PUT",
			                    async: false,
			                    params: PriceStrategy,
			                    url: _global_settings.service.url + "/pricestrategy",
			                    showMsg:false,
			                    callback: function (res) {
			                    	setCloseAlertTimeOneSecond();
			                        $('#acDiscount-tbody').html('');
			                        me.setLine();
			                        $('#saveAcDiscount').css('display', 'none');
			                        $('#editAcDiscount').css('display', 'block');
			                        $('#myBss_Grid').modal('hide');
			                        $('#productInformaticaGrid').jqxGrid('updatebounddata','cells');
		//	                        $('#cancelAcDiscount').css('display', 'none');
			                    },
			                    failure: function (e) {
			                    }
			                });
			            }
		            }else{
		            	//保存自己新增的数据----不带id
			            if ($('.acDiscountResult').eq(i).val() != '' && $('.acDiscountMonth').eq(i).val() != '') {
			                Core.AjaxRequest({
			                    type: "PUT",
			                    async: false,
			                    params: PriceStrategy,
			                    url: _global_settings.service.url + "/pricestrategy",
			                    callback: function (res) {
			                        $('#acDiscount-tbody').html('');
			                        me.setLine();
			                        $('#saveAcDiscount').css('display', 'none');
			                        $('#editAcDiscount').css('display', 'block');
			                        $('#myBss_Grid').modal('hide');
			                        $('#productInformaticaGrid').jqxGrid('updatebounddata','cells');
		//	                        $('#cancelAcDiscount').css('display', 'none');
			                    },
			                    failure: function (e) {
			                    }
			                });
			            }
		            }
		        }
		});
	    	
	    
	    /*//点击取消
	    $('#cancelAcDiscount').off('click').on('click', function () {
	        $('#acDiscount-tbody').html('');
	        me.setLine();
	        $(this).css('display', 'none');
	        $('#saveAcDiscount').css('display', 'none');
	        if (rowdata.rows.length > 0)
	            $('#editAcDiscount').css('display', 'block');
	        else
	            $('#addAcDiscount').css('display', 'none');
	    });*/
    }
}

var MatchSalers = function(){
	var me = this;
	var lineData = null;
	var dropListData = null;
	var dropSalersArr = [];
	var dataRes = null;
	var distributionEmployeeCode =null;
	
    me.url = _global_settings.service.url;
    
	this.init = function(){
		me.setLineData();
		me.initPages();
		me.initValidators();
	}
	
	this.initPages = function(){
		$('#doMoreSalersWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1400,
			minHeight:600,
			height:'600',			
			minWidth: 600, 
			cancelButton: $('#doMoreSalers-cancel'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				setTimeout(function(){
					$('#doMoreSalersTbody').jqxGrid('clearselection');
				},500);
			}
		});
	}
	
	/**
     * 销售负责人---初始化
     * 
     * 区分有数据情况下和没有数据的情况
     * 
     * 有数据加上data-id=当前这一行的id，没有数据就新增，则不加data-id,删除的时候会用到data-id，如果有data-id。则请求接口删除。没有则前台直接删除
     * 
     */
    this.setLineData = function(){
    	//点击获取负责人
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			async:false,
			dataType:'text',
			url:_global_settings.service.url+"/user/customerOrSales/sales",
			callback:function(res){
				dropListData = JSON.parse(res);
				console.log(dropListData);
				for(var i=0; i<dropListData.length; i++){
				  var rd  = dropListData[i].userInfo.name+'('+dropListData[i].username+')';
				  dropSalersArr.push(rd);
				}
			}
		});
    	//点击获取
        Core.AjaxRequest({
            type: "GET",
            //showMsg:false,
            async: false,
            dataType: 'text',
            url: _global_settings.service.url + "/usersaler/sales",
            callback: function (res) {
                lineData = JSON.parse(res);
                console.log(lineData);
                //有数据的情况下
                if (lineData.length > 0) {
                    for (var i = 0; i < lineData.length; i++) {
                    	var rowId = lineData[i].id;
                        var line = $('<tr style="border-bottom: solid 1px #ccc;"'
                        		+' data-id = '+rowId+'>'
                        		+'<td class="col-md-4">'
                        		+'<div class="row">'
                        		+'<div class="form-horizontal">'
                        		+'<div class="form-group">'
                        		+'<label  class="control-label col-sm-4 p-r-0">负责人</label>'
                        		+'<div class="col-sm-8 p-r-0">'
								+'<div class="distributeSaler">'
								+'</div></div></div></div></div>'
								+'</td>'
								+'<td class="col-md-4">'
                        		+'<div class="row">'
                        		+'<div class="form-horizontal">'
                        		+'<div class="form-group">'
                        		+'<label class="control-label col-sm-4 p-r-0">分配比例</label>'
                        		+'<div class="col-sm-8 p-r-0">'
								+'<input type="text" class="form-control distributeProportion" />'
								+'</div></div></div></div>'
								+'</td>'
								+'<td class="col-md-1"><i style="float:right;" class="md-format-list-bulleted tel" title="手机号码"></i></td>'
    							+'<td class="col-md-1"><i style="float:right;" class="md-cancel del" title="删除"></i></td>'
    							+'</tr>');
                        
                        $('#matchSalers-tbody').append(line);
                      
                        line.find('.distributeSaler').jqxComboBox({
    						source:dropSalersArr,
    						theme:currentTheme,
    						displayMember: "username", 
    						valueMember: "id", 
    						width:'100%',
    						height:'34px',
    						searchMode:'containsignorecase',
    						//selectedIndex:i,
//    			        	placeHolder:"请选择或输入"
    					});
    					line.find('.distributeSaler').val(getSalesInfoByName(lineData[i].name).userInfo.name+'('+lineData[i].name+')');
    					line.find('.distributeProportion').val(lineData[i].proportion == undefined ? '1' : lineData[i].proportion);
                        me.realTelephone();
                        $('#matchSalers-tbody').off('click');
                        $('#matchSalers-tbody').find('tr>td>.tel').css('display', 'block');
                        $('#matchSalers-tbody').find('tr>td:last-child>.del').css('display', 'none');
                        line.find('.distributeSaler').jqxComboBox({disabled:true});
                        line.find('.distributeProportion').attr("disabled",true);
                        $('#editMatchSalers').css('display', 'block');
                        $('#addMatchSalers').css('display', 'none');
                    }
                } else {
                	//没有数据的情况下----新增
                    $('#saveMatchSalers').css('display', 'none');
                    $('#editMatchSalers').css('display', 'none');
                    $('#addMatchSalers').css('display', 'block');
                    $('#cancelMatchSalers').css('display', 'none');
                }
            }
        });
    }
    
    //分配新增一行
    this.addLines = function () {
        var index = $('#matchSalers-tbody').children().length + 1;
        var line = $('<tr style="border-bottom: solid 1px #ccc;">'
        		+'<td class="col-md-4">'
        		+'<div class="row">'
        		+'<div class="form-horizontal">'
        		+'<div class="form-group">'
        		+'<label class="control-label col-sm-4 p-r-0">负责人</label>'
        		+'<div class="col-sm-8 p-r-0">'
				+'<div class="distributeSaler">'
				+'</div></div></div></div></div>'
				+'</td>'
				+'<td class="col-md-4">'
        		+'<div class="row">'
        		+'<div class="form-horizontal">'
        		+'<div class="form-group">'
        		+'<label class="control-label col-sm-4 p-r-0">分配比例</label>'
        		+'<div class="col-sm-8 p-r-0">'
				+'<input type="text" class="form-control distributeProportion" value="1"/>'
				+'</div></div></div></div>'
				+'</td>'
				+'<td class="col-md-1"><i style="float:right;" class="md-format-list-bulleted tel" title="手机号码"></i></td>'
				+'<td class="col-md-1"><i style="float:right;" class="md-cancel del" title="删除"></i></td>'
				+'</tr>');
        $('#matchSalers-tbody').append(line);
        $('#matchSalers-tbody').find('tr>td>.tel').css('display', 'none');
        line.find('.distributeSaler').jqxComboBox({
			source:dropSalersArr,
			theme:currentTheme,
			displayMember: "username", 
			valueMember: "id", 
			width:'100%',
			height:'34px',
			searchMode:'containsignorecase',
			//selectedIndex:i,
        	placeHolder:"请选择或输入"
		});
        me.removeLines();
//        me.realTelephone();
        $('#matchSalers-tbody').off('click');
        $('#matchSalers-tbody').on('click', 'tr', function () {
            if ($(this)[0] == $('#matchSalers-tbody').find('tr').eq(-1)[0]) {
                me.addLines();
            }
        });
    }
    
    //判断所选内容不能重复
	this.compareRepeat = function(){
		var bool =false;
		for(var i=0; i<$('.distributeSaler').length; i++){
			for(var j=i+1; j<$('.distributeSaler').length; j++){
				if($('.distributeSaler').eq(i).val()!=''){
					var salesVals = $('.distributeSaler').eq(i).val(),
						salesVal = $('.distributeSaler').eq(j).val(),
						salesResultVals = salesVals.substring(salesVals.indexOf('(')+1,salesVals.length-1),
						salesResultVal = salesVal.substring(salesVal.indexOf('(')+1,salesVal.length-1);
					if(salesResultVals == salesResultVal){
						bool = true;
						break;
					}
				}
			}
		}
		return bool;
	}
    
	//分配新增--在最初始状态下，没有任何数据
    $('#addMatchSalers').off().on('click', function () {
        me.addLines();
//        me.realTelephone();
        $('#saveMatchSalers').css('display', 'block');
        $('#editMatchSalers').css('display', 'none');
        $('#addMatchSalers').css('display', 'none');
//        $('#cancelAcDiscount').css('display', 'block');
    });
    
    //分配编辑
    $('#editMatchSalers').off('click').on('click', function () {
        console.log(lineData);
        //点击行添加行
        $('#matchSalers-tbody').off().on('click', 'tr', function () {
            if ($(this)[0] == $('#matchSalers-tbody').find('tr').eq(-1)[0]) {
                me.addLines();
            }
        });
        me.removeLines();
//        me.realTelephone();
        $('#matchSalers-tbody').find('tr>td>.tel').css('display', 'none');
        $('#matchSalers-tbody').find('tr>td:last-child>.del').css('display', 'block');
        $(this).css('display', 'none');
        $('#saveMatchSalers').css('display', 'block');
        $('.distributeProportion').attr("disabled",false);
        $('.distributeSaler').jqxComboBox({disabled:false});
//        $('#cancelAcDiscount').css('display', 'block');
    });
    
    //分配点击删除
    this.removeLines = function () {
        $('#matchSalers-tbody').find('tr>td:last-child').off('click')
        $('#matchSalers-tbody').find('tr>td:last-child').on('click', function (event) {
            event.stopPropagation();
            var tr = $(this).parent();
            var indexs = $(this).parent().index();
            var ids = null;
            console.log(indexs);
            if ($('#matchSalers-tbody').find('tr').length > 1) {
                Core.confirm({
                    message: "确定要删除？",
                    confirmCallback: function () {
                        tr.remove();
                    }
                });
            }
        });
    }

    this.initValidators = function(){
    	var bool =false;
    	var reg = /^\d+$/;
    	var proportionCust = $('#matchSalers-tbody').find('.distributeProportion');
    	for(var i=0; i<proportionCust.length; i++){
    		if(!reg.test(proportionCust.eq(i).val())){
    			bool = true;
    			break;
    		};
    	}
    	return bool;
	}
    
    //分配点击手机号码--批量分配
    this.realTelephone = function () {
    	$('#matchSalers-tbody').find('tr>td>.tel').off('click');
        $('#matchSalers-tbody').find('tr>td>.tel').on('click', function (event) {
            event.stopPropagation();
            var indexs = $(this).parent().parent().index();
            // 销售负责人的employeeCode
            var distributeSalerVal = $('.distributeSaler').eq(indexs).val(),
            	distributeSalerCheckVal = $('.distributeSaler').eq(indexs).val().substring(distributeSalerVal.indexOf('(')+1,distributeSalerVal.length-1);
    		if(getSalesInfoByName(distributeSalerCheckVal)!=undefined && getSalesInfoByName(distributeSalerCheckVal)!=''){
    			distributionEmployeeCode = getSalesInfoByName(distributeSalerCheckVal).employeeCode;
        	}else if(getCustomerInfoByName(distributeSalerCheckVal)!=undefined && getCustomerInfoByName(distributeSalerCheckVal)!=''){
        		distributionEmployeeCode = getCustomerInfoByName(distributeSalerCheckVal).employeeCode;
        	}
            //点击获取负责人
    		Core.AjaxRequest({
    			type:"GET",
    			//showMsg:false,
    			async:false,
    			dataType:'text',
    			url:_global_settings.service.url+"/user/distributionEmployeeCode",
    			callback:function(res){
    				//初始化数据
    				dataRes = JSON.parse(res);
    				$('#doMoreSalersWin').jqxWindow('open',function(){
						var se={
							localdata: dataRes,
				            datatype: 'json'
					    }
						
						var demo = new $.jqx.dataAdapter(se);
						//初始化Grid
						$('#doMoreSalersTbody').jqxGrid({
				            source: demo,
				            width:'100%',
				            height:430,
				            pageable:false,
				            selectionmode:'checkbox',
				            columns: [
				              { text: '销售或客服负责人',width:'48%',
				            	  cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
										var html='<div class="agrid">';
											html+= rowdata.username;
										return html+'</div>';
									}
				              },
				              { text: '电话号码',width:'48%',
				            	  cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
										var html='<div class="agrid">';
											html+= rowdata.userInfo.telephone;
										return html+'</div>';
									}
				              }
				            ]
				        });
						
			    		//判断是否被选中distributionEmployeeCode 
			    		$.each(dataRes,function(i,v){
							if(dataRes[i].distributionEmployeeCode == distributionEmployeeCode){
								$('#doMoreSalersTbody').jqxGrid('selectrow', i);	//让当前这一行处于选中状态
							}
						});
					});
    			}
    		});
        });
    	//编辑保存负责人手机号码
		$('#doMoreSalers-save').off('click').on('click',function(){
			var arr = [];
			var len =$('#doMoreSalersTbody').jqxGrid('getselectedrowindexes');
			
			if(dataRes==undefined||dataRes==''||dataRes==null){
				Core.alert({message:'暂无负责人可操作！'});
			}else{
				if(len.length==0){
					Core.alert({message:'所选负责人不能为空！'});
				}else if(len.length>0){
					var index = $('#doMoreSalersTbody').jqxGrid('getselectedrowindexes');
					$.each(len,function(i,v){
						var obj = {};
						obj.id = dataRes[len[i]].id;
						arr.push(obj);
						console.log(arr);
					});
					Core.AjaxRequest({
						url: _global_settings.service.url + "/user/savepartner/sales/"+distributionEmployeeCode,
						type:'POST',
						params: arr,
						async:false,
						showMsg:false,
						callback:function(data){
							try{
								setCloseAlertTimeOneSecond();
								$('#doMoreSalersWin').jqxWindow('close');
								$('#doMoreSalersTbody').jqxGrid('clearselection');
							}catch(e){}
						},
						failure:function(e){
						}
					});
				}
			}
		});
    }
    
    //点击保存
    $('#saveMatchSalers').off('click').on('click', function () {
    	var arr = [];
        for (var i = 0; i < $('#matchSalers-tbody').find('tr').length; i++) {
        	var obj = {};
        	if($('.distributeProportion').eq(i).val()==''){
        		Core.alert({message:'请检查分配比例格式！'});
        		break;
        	}else if(me.compareRepeat()){
				Core.alert({message:'所选负责人不能重复！'});
				return false;
			}else if(me.initValidators()){
				Core.alert({message:'分配比例只能是大于或等于0的数字'});
				return false;
			}else if($('.distributeSaler').eq(i).val() != '' && $('.distributeProportion').eq(i).val()!=''||$('.distributeProportion').eq(i).val()!=0){
        		/*
        		 * 保存--传name,proportion,employeeCode,id
        		 * */
				if($('.distributeSaler').eq(i).val() != ''){
					var salersOrCustVal = $('.distributeSaler').eq(i).find('input').val(),
						salersOrCustReVal = salersOrCustVal.substring(salersOrCustVal.indexOf('(')+1,salersOrCustVal.length-1);
					
	            	// 销售负责人的employeeCode,销售负责人的id
            		if(getSalesInfoByName(salersOrCustVal)!=undefined){
            			obj.name = salersOrCustVal;
	            		obj.employeeCode = getSalesInfoByName(salersOrCustVal).employeeCode;
	            		obj.userId = getSalesInfoByName(salersOrCustVal).id;
	            	}else if(getSalesInfoByName(salersOrCustReVal)!=undefined){
	            		obj.name = salersOrCustReVal;
	            		obj.employeeCode = getSalesInfoByName(salersOrCustReVal).employeeCode;
	            		obj.userId = getSalesInfoByName(salersOrCustReVal).id;
	            	}else if(getCustomerInfoByName(salersOrCustVal)!=undefined ){
	            		obj.name = salersOrCustVal;
	            		obj.employeeCode = getCustomer(salersOrCustVal).employeeCode;
	            		obj.userId = getCustomer(salersOrCustVal).id;
	            	}else if(getCustomerInfoByName(salersOrCustReVal)!=undefined){
	            		obj.name = salersOrCustReVal;
	            		obj.employeeCode = getCustomer(salersOrCustReVal).employeeCode;
	            		obj.userId = getCustomer(salersOrCustReVal).id;
	            	}else{
	            		Core.alert({message:'所选负责人有误！'});
	            	}
            		
	            	obj.proportion =  $('.distributeProportion').eq(i).val();
	            	obj.type = 'sales';
	            	arr.push(obj);
	            	console.log(arr);
	           }
        	}
        }
        
        Core.AjaxRequest({
            type: "POST",
            async: false,
            params: arr,
            url: _global_settings.service.url + "/usersaler/sales",
            showMsg:false,
            callback: function (res) {
            	setCloseAlertTimeOneSecond();
                $('#matchSalers-tbody').html('');
                me.setLineData();
                $('#saveMatchSalers').css('display', 'none');
                $('#editMatchSalers').css('display', 'block');
//	                        $('#cancelAcDiscount').css('display', 'none');
            },
            failure: function (e) {
            }
        });
    });
}
var MatchCustomers = function(){
	var me = this;
	var lineData = null;
	var dropListData = null;
	var dropCustArr = [];
	var dataRes = null;
	var distributionCustomerEmployeeCode =null;
	
    me.url = _global_settings.service.url;
    
	this.init = function(){
		me.setLineDataByCust();
		me.initPages();
		me.initValidator();
	}
	
	this.initPages = function(){
		$('#doMoreCustomersWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1400,
			minHeight:600,
			height:'600',			
			minWidth: 600, 
			cancelButton: $('#doMoreCustomers-cancel'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				setTimeout(function(){
					$('#doMoreCustomersTbody').jqxGrid('clearselection');
				},500);
			}
		});
	}
	
	
	/**
     * 客服负责人---初始化
     * 
     * 区分有数据情况下和没有数据的情况
     * 
     * 有数据加上data-id=当前这一行的id，没有数据就新增，则不加data-id,删除的时候会用到data-id，如果有data-id。则请求接口删除。没有则前台直接删除
     * 
     */
    this.setLineDataByCust = function(){
    	//点击获取负责人
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			async:false,
			dataType:'text',
			url:_global_settings.service.url+"/user/customerOrSales/customer",
			callback:function(res){
				dropListData = JSON.parse(res);
				for(var i=0; i<dropListData.length; i++){
					var rd = dropListData[i].userInfo.name+'('+dropListData[i].username+')';
					dropCustArr.push(rd);
				}
			}
		});
    	
    	//点击获取
        Core.AjaxRequest({
            type: "GET",
            //showMsg:false,
            async: false,
            dataType: 'text',
            url: _global_settings.service.url + "/usersaler/customer",
            callback: function (res) {
                lineData = JSON.parse(res);
                console.log(lineData);
                //有数据的情况下
                if (lineData.length > 0) {
                    for (var i = 0; i < lineData.length; i++) {
                    	var rowId = lineData[i].id;
                        var line = $('<tr style="border-bottom: solid 1px #ccc;"'
                        		+' data-id = '+rowId+'>'
                        		+'<td class="col-md-4">'
                        		+'<div class="row">'
                        		+'<div class="form-horizontal">'
                        		+'<div class="form-group">'
                        		+'<label  class="control-label col-sm-4 p-r-0">负责人</label>'
                        		+'<div class="col-sm-8 p-r-0">'
								+'<div class="distributeCustomer">'
								+'</div></div></div></div></div>'
								+'</td>'
								+'<td class="col-md-4">'
                        		+'<div class="row">'
                        		+'<div class="form-horizontal">'
                        		+'<div class="form-group">'
                        		+'<label class="control-label col-sm-4 p-r-0">分配比例</label>'
                        		+'<div class="col-sm-8 p-r-0">'
								+'<input type="text" class="form-control distributeProportionCust" />'
								+'</div></div></div></div>'
								+'</td>'
								+'<td class="col-md-1"><i style="float:right;" class="md-format-list-bulleted tel" title="手机号码"></i></td>'
    							+'<td class="col-md-1"><i style="float:right;" class="md-cancel del" title="删除"></i></td>'
    							+'</tr>');
                        
                        $('#matchCustomers-tbody').append(line);
                        line.find('.distributeCustomer').jqxComboBox({
    						source:dropCustArr,
    						theme:currentTheme,
    						displayMember: "username", 
//    						valueMember: "id", 
    						width:'100%',
    						height:'34px',
    						searchMode:'containsignorecase',
    						//selectedIndex:i,
//    			        	placeHolder:"请选择或输入"
    					});
    					line.find('.distributeCustomer').val(getCustomerInfoByName(lineData[i].name).name+'('+lineData[i].name+')');
    					line.find('.distributeProportionCust').val(lineData[i].proportion == undefined ? '1' : lineData[i].proportion);
                        me.realTelephone();
                        $('#matchCustomers-tbody').off('click');
                        $('#matchCustomers-tbody').find('tr>td>.tel').css('display', 'block');
                        $('#matchCustomers-tbody').find('tr>td:last-child>.del').css('display', 'none');
                        line.find('.distributeCustomer').jqxComboBox({disabled:true});
                        line.find('.distributeProportionCust').attr("disabled",true);
                        $('#editMatchCustomers').css('display', 'block');
                        $('#addMatchCustomers').css('display', 'none');
                        $('#saveMatchCustomers').css('display', 'none');
                        $('#cancelMatchCustomers').css('display', 'none');
                    }
                } else {
                	//没有数据的情况下----新增
                    $('#saveMatchCustomers').css('display', 'none');
                    $('#editMatchCustomers').css('display', 'none');
                    $('#addMatchCustomers').css('display', 'block');
                    $('#cancelMatchCustomers').css('display', 'none');
                }
            }
        });
    }
    
    //分配新增一行
    this.addLinesByCust = function () {
        var index = $('#matchCustomers-tbody').children().length + 1;
        var line = $('<tr style="border-bottom: solid 1px #ccc;">'
        		+'<td class="col-md-4">'
        		+'<div class="row">'
        		+'<div class="form-horizontal">'
        		+'<div class="form-group">'
        		+'<label class="control-label col-sm-4 p-r-0">负责人</label>'
        		+'<div class="col-sm-8 p-r-0">'
				+'<div class="distributeCustomer">'
				+'</div></div></div></div></div>'
				+'</td>'
				+'<td class="col-md-4">'
        		+'<div class="row">'
        		+'<div class="form-horizontal">'
        		+'<div class="form-group">'
        		+'<label class="control-label col-sm-4 p-r-0">分配比例</label>'
        		+'<div class="col-sm-8 p-r-0">'
				+'<input type="text" class="form-control distributeProportionCust" value="1"/>'
				+'</div></div></div></div>'
				+'</td>'
				+'<td class="col-md-1"><i style="float:right;" class="md-format-list-bulleted tel" title="手机号码"></i></td>'
				+'<td class="col-md-1"><i style="float:right;" class="md-cancel del" title="删除"></i></td>'
				+'</tr>');
        $('#matchCustomers-tbody').append(line);
        $('#matchCustomers-tbody').find('tr>td>.tel').css('display', 'none');
        line.find('.distributeCustomer').jqxComboBox({
			source:dropCustArr,
			theme:currentTheme,
			displayMember: "username", 
//			valueMember: "id", 
			width:'100%',
			height:'34px',
			searchMode:'containsignorecase',
			//selectedIndex:i,
        	placeHolder:"请选择或输入"
		});
        me.removeLines();
//        me.realTelephone();
        $('#matchCustomers-tbody').off('click');
        $('#matchCustomers-tbody').on('click', 'tr', function () {
            if ($(this)[0] == $('#matchCustomers-tbody').find('tr').eq(-1)[0]) {
                me.addLinesByCust();
            }
        });
    }
    
    //判断所选内容不能重复
	this.compareRepeat = function(){
		var bool =false;
		for(var i=0; i<$('.distributeCustomer').length; i++){
			for(var j=i+1; j<$('.distributeCustomer').length; j++){
				if($('.distributeCustomer').eq(i).val()!=''){
					var customerVal = $('.distributeCustomer').eq(i).val(),
						customerVals = $('.distributeCustomer').eq(j).val(),
						customerReVal = customerVal.substring(customerVal.indexOf('(')+1,customerVal.length-1),
						customerReVals = customerVals.substring(customerVals.indexOf('(')+1,customerVals.length-1);
					if(customerReVals == customerReVal){
						bool = true;
						break;
					}
				}
			}
		}
		return bool;
	}
    
	//分配新增--在最初始状态下，没有任何数据
    $('#addMatchCustomers').off().on('click', function () {
        me.addLinesByCust();
//        me.realTelephone();
        $('#saveMatchCustomers').css('display', 'block');
        $('#editMatchCustomers').css('display', 'none');
        $('#cancelMatchCustomers').css('display', 'none');
        $('#addMatchCustomers').css('display', 'none');
    });
    
    //分配编辑
    $('#editMatchCustomers').off('click').on('click', function () {
        console.log(lineData);
        //点击行添加行
        $('#matchCustomers-tbody').off().on('click', 'tr', function () {
            if ($(this)[0] == $('#matchCustomers-tbody').find('tr').eq(-1)[0]) {
                me.addLinesByCust();
            }
        });
        me.removeLines();
//        me.realTelephone();
        $('#matchCustomers-tbody').find('tr>td>.tel').css('display', 'none');
        $('#matchCustomers-tbody').find('tr>td:last-child>.del').css('display', 'block');
        $(this).css('display', 'none');
        $('#saveMatchCustomers').css('display', 'block');
        $('.distributeProportionCust').attr("disabled",false);
        $('.distributeCustomer').jqxComboBox({disabled:false});
//        $('#cancelAcDiscount').css('display', 'block');
    });
    
    //分配点击删除
    this.removeLines = function () {
        $('#matchCustomers-tbody').find('tr>td:last-child').off('click')
        $('#matchCustomers-tbody').find('tr>td:last-child').on('click', function (event) {
            event.stopPropagation();
            var tr = $(this).parent();
            var indexs = $(this).parent().index();
            var ids = null;
            console.log(indexs);
            if ($('#matchCustomers-tbody').find('tr').length > 1) {
                Core.confirm({
                    message: "确定要删除？",
                    confirmCallback: function () {
                        tr.remove();
                    }
                });
            }
        });
    }
    
    this.initValidator = function(){
    	var bool =false;
    	var reg = /^\d+$/;
    	var proportionCust = $('#matchCustomers-tbody').find('.distributeProportionCust');
    	for(var i=0; i<proportionCust.length; i++){
    		if(!reg.test(proportionCust.eq(i).val())){
    			bool = true;
    			break;
    		};
    	}
    	return bool;
	}
    
    //分配点击手机号码
    this.realTelephone = function () {
        $('#matchCustomers-tbody').find('tr>td>.tel').on('click', function (event) {
            event.stopPropagation();
            var indexs = $(this).parent().parent().index();
            // 销售负责人的employeeCode
    		var distributeCustomerVal = $('.distributeCustomer').eq(indexs).val(),
	        	distributeCustomerCheckVal = $('.distributeCustomer').eq(indexs).val().substring(distributeCustomerVal.indexOf('(')+1,distributeCustomerVal.length-1);
			if(getSalesInfoByName(distributeCustomerCheckVal)!=undefined && getSalesInfoByName(distributeCustomerCheckVal)!=''){
				distributionCustomerEmployeeCode = getSalesInfoByName(distributeCustomerCheckVal).employeeCode;
	    	}else if(getCustomerInfoByName(distributeCustomerCheckVal)!=undefined && getCustomerInfoByName(distributeCustomerCheckVal)!=''){
	    		distributionCustomerEmployeeCode = getCustomerInfoByName(distributeCustomerCheckVal).employeeCode;
	    	}
			console.log(distributionCustomerEmployeeCode);
            //点击获取负责人
    		Core.AjaxRequest({
    			type:"GET",
    			//showMsg:false,
    			async:false,
    			dataType:'text',
    			url:_global_settings.service.url+"/user/distributionEmployeeCode",
    			callback:function(res){
    				//初始化数据
    				dataRes = JSON.parse(res);
    				$('#doMoreCustomersWin').jqxWindow('open',function(){
						var se={
							localdata: dataRes,
				            datatype: 'json'
					    }
						
						var demo = new $.jqx.dataAdapter(se);
						//初始化Grid
						$('#doMoreCustomersTbody').jqxGrid({
				            source: demo,
				            width:'100%',
				            height:430,
				            pageable:false,
				            selectionmode:'checkbox',
				            columns: [
				              { text: '销售或客服负责人',width:'48%',
				            	  cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
										var html='<div class="agrid">';
											html+= rowdata.username;
										return html+'</div>';
									}
				              },
				              { text: '电话号码',width:'50%',
				            	  cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
										var html='<div class="agrid">';
											html+= rowdata.userInfo.telephone;
										return html+'</div>';
									}
				              }
				            ]
				        });
						
			    		//判断是否被选中distributionCustomerEmployeeCode 
			    		$.each(dataRes,function(i,v){
							if(dataRes[i].distributionCustomerEmployeeCode == distributionCustomerEmployeeCode){
								$('#doMoreCustomersTbody').jqxGrid('selectrow', i);	//让当前这一行处于选中状态
							}
						});
					});
    			}
    		});
        });
    	//编辑保存负责人手机号码
		$('#doMoreCustomers-save').off('click').on('click',function(){
//			debugger;
			var arr = [];
			var len =$('#doMoreCustomersTbody').jqxGrid('getselectedrowindexes');
			
			if(dataRes==undefined||dataRes==''||dataRes==null){
				Core.alert({message:'暂无负责人可操作！'});
			}else{
				if(len.length==0){
					Core.alert({message:'所选负责人不能为空！'});
				}else if(len.length>0){
					var index = $('#doMoreCustomersTbody').jqxGrid('getselectedrowindexes');
					$.each(len,function(i,v){
						var obj = {};
						obj.id = dataRes[len[i]].id;
						arr.push(obj);
						console.log(arr);
					});
					Core.AjaxRequest({
						url: _global_settings.service.url + "/user/savepartner/customer/"+distributionCustomerEmployeeCode,
						type:'POST',
						params: arr,
						async:false,
						showMsg:false,
						callback:function(data){
							try{
								setCloseAlertTimeOneSecond();
								$('#doMoreCustomersWin').jqxWindow('close');
								$('#doMoreCustomersTbody').jqxGrid('clearselection');
							}catch(e){}
						},
						failure:function(e){
						}
					});
				}
			}
		});
    }
    
    //点击保存
    $('#saveMatchCustomers').off('click').on('click', function () {
    	var arr = [];
        for (var i = 0; i < $('#matchCustomers-tbody').find('tr').length; i++) {
        	var obj = {};
        	if($('.distributeProportionCust').eq(i).val()==''){
        		Core.alert({message:'请检查分配比例格式！'});
        		break;
        	}else if(me.compareRepeat()){
				Core.alert({message:'所选负责人不能重复！'});
				return false;
			}else if(me.initValidator()){
				Core.alert({message:'分配比例只能是大于或等于0的数字'});
				return false;
			}else if($('.distributeCustomer').eq(i).val() != '' && $('.distributeProportionCust').eq(i).val()!=''||$('.distributeProportionCust').eq(i).val()!=0){
        		/*
        		 * 保存--传name,proportion,employeeCode,id
        		 * */
				if($('.distributeCustomer').eq(i).val() != ''){
					
					var salersOrCustVals = $('.distributeCustomer').eq(i).find('input').val(),
						salersOrCustReVals = salersOrCustVals.substring(salersOrCustVals.indexOf('(')+1,salersOrCustVals.length-1);
					
	            	// 客服负责人的employeeCode,id.name
            		if(getSalesInfoByName(salersOrCustVals)!=undefined){
            			obj.name = salersOrCustVals;
	            		obj.employeeCode = getSalesInfoByName(salersOrCustVals).employeeCode;
	            		obj.userId = getSalesInfoByName(salersOrCustVals).id;
	            	}else if(getSalesInfoByName(salersOrCustReVals)!=undefined){
	            		obj.name = salersOrCustReVals;
	            		obj.employeeCode = getSalesInfoByName(salersOrCustReVals).employeeCode;
	            		obj.userId = getSalesInfoByName(salersOrCustReVals).id;
	            	}else if(getCustomerInfoByName(salersOrCustVals)!=undefined){
	            		obj.name = salersOrCustVals;
	            		obj.employeeCode = getCustomerInfoByName(salersOrCustVals).employeeCode;
	            		obj.userId = getCustomerInfoByName(salersOrCustVals).id;
	            	}else if(getCustomerInfoByName(salersOrCustReVals)!=undefined){
	            		obj.name = salersOrCustReVals;
	            		obj.employeeCode = getCustomerInfoByName(salersOrCustReVals).employeeCode;
	            		obj.userId = getCustomerInfoByName(salersOrCustReVals).id;
	            	}else{
	            		Core.alert({message:'所选负责人有误！'});
	            	}
            		
            		obj.proportion =  $('.distributeProportionCust').eq(i).val();
	            	obj.type = 'customer';
	            	arr.push(obj);
	            	console.log(arr);
	           }
        	}
        }
        
        Core.AjaxRequest({
            type: "POST",
            async: false,
            params: arr,
            url: _global_settings.service.url + "/usersaler/customer",
            showMsg:false,
            callback: function (res) {
            	setCloseAlertTimeOneSecond();
                $('#matchCustomers-tbody').html('');
                me.setLineDataByCust();
                $('#saveMatchCustomers').css('display', 'none');
                $('#addMatchCustomers').css('display', 'none');
                $('#cancelMatchCustomers').css('display', 'none');
                $('#editMatchCustomers').css('display', 'block');
            },
            failure: function (e) {
            }
        });
    });
}
//获取销售负责人
var getSales=function(id){
	var rd = ComboBoxSources.getRecords('salesInfo');
	for(var i=0;i<rd.length;i++){
		if(rd[i].id==id){
			return rd[i]; 
		}
	}
	
	if(!id){
		return '';
	}
}

//获取客服
var getCustomer=function(id){
	var rd = ComboBoxSources.getRecords('custService');
	for(var i=0;i<rd.length;i++){
		if(rd[i].id==id){
			return rd[i];
		}
	}
	
	if(!id){
		return '';
	}
}
