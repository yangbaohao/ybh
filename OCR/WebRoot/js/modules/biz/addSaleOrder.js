var AddSaleOrderMgt=function(){var e=this;this.url=_global_settings.service.url+"/order",this.customerId=null,this.random=null,this.otherAmtdesc="",this.otherAmts=[],this.orderId=null,this.saleRowdata=null,this.enterPriceInfo=null;var d=0,a={},r=[];this.addAddressObj=[],unitArr=[],specArr=[],colorArr=[],prodArr=[];var t=function(){1*$("#addSO-orderReceive").val()>1*$("#addSO-orderMoney").val()?$("#addSO-orderOverReceive").parents(".col-md-3").find(".row").removeClass("hide"):$("#addSO-orderOverReceive").parents(".col-md-3").find(".row").addClass("hide")};this.addFastSoFunc=function(){$("#addSO-orderMoney").on("keyup",function(){timeOut(function(){$("#addSO-receiveRecordTbody").find(".receiveMoney").eq(0).trigger("keyup")})}),$("#addSO-preferMoney").on("keyup",function(){timeOut(function(){$("#addSO-orderMoney").val(money($("#addSO-orderPartMoney").val()-$("#addSO-preferMoney").val())),$("#addSO-addTaxLimit").trigger("keyup")})}),$("#addSO-orderMoney").moneyinput({textalign:"left"}),$("#addSO-addOrderNum").moneyinput()},this.setOrderNoReceive=function(e){var d=$("#addSaleOrder_grid").jqxGrid("getcolumnaggregateddata","price3",["sum"]).sum;d=parseFloat(money(d));var a=e[0].arrearsType,r=parseFloat($("#addSO-orderMoney").val()),t=parseFloat($("#addSO-preferMoney").val()),o=parseFloat($("#addSO-orderReceive").val()),i=parseFloat($("#addSO-orderDeliver").val()),n=parseFloat(money($("#addSO-addTaxLimit").val())),s="";"contractAmount"===a&&(s=r-o),"deliveryAmount"===a&&(s=d<=i?i-o-t+n:i-o),s<0?($("#addSO-orderOverReceive").val(money(-s)),$("#addSO-orderNoReceive").val(money(0)),$("#addSO-orderOverReceive").parents(".col-md-3").find(".row").removeClass("hide")):($("#addSO-orderOverReceive").val(money(0)),$("#addSO-orderNoReceive").val(money(s)),$("#addSO-orderOverReceive").parents(".col-md-3").find(".row").removeClass("show"))},this.initInput=function(){e.saleRowdata=$.pk.data,getPriseInfo({id:"addSOAddressTableArs",soOwnerId:e.saleRowdata.soOwnerId,userName:e.saleRowdata.userName,callback:function(d){e.enterPriceInfo=d,"BT"==d[0].printSize&&$("#addSO-boxflag").parents(".col-md-1").addClass("hide"),getProductInUsePart(e.saleRowdata.soOwnerId,e.saleRowdata.userName,function(d){var a=d;e.initAddOrderPages(a)})}}),e.addFastSoFunc(),closeModel(),showAddress("addSO-addCustomerId","#addSOAddressTableSn","#addSOAddress"),$("#addSO-otherpayInput").moneyinput(),$("#addSO-addTaxLimit").moneyinput(),$("#addSO-preferMoney").moneyinput(),$("#addSOpayWayBtn").on("click",function(){}),$("#addSO-boxflag").on("change",function(){$(this).is(":checked")?$("#addSaleOrder_grid").printOfGoodsFlag("show"):$("#addSaleOrder_grid").printOfGoodsFlag("hide")}),$("#addSO-saleTime").datetimeinput({width:"90%",height:33,formatString:"yyyy-MM-dd",showTimeButton:!1}),$("#addSO-recTime").datetimeinput({width:"90%",height:33,formatString:"yyyy-MM-dd",showTimeButton:!1}),$("#addSO-sendTime").datetimeinput({width:"90%",height:33,formatString:"yyyy-MM-dd HH:mm",showTimeButton:!0,showCalendarButton:!0}),$("#addSO-addTax").dropDownlist({source:{0:"0%",3:"3%",5:"5%",6:"6%",11:"11%",13:"13%",17:"17%"},width:"75%",height:35,selectedIndex:0}),$("#addSO-addTax").on("select",function(){0==$(this).val()?($("#addSOtaxLimit").css("display","none"),$("#addSO-addTaxLimit").val("")):($("#addSOtaxLimit").css("display",""),$("#addSO-addTaxLimit").val(money(d*(parseInt($(this).val())/100)))),$("#addSO-orderPartMoney").val(money(d+1*$("#addSO-addTaxLimit").val())),$("#addSO-orderMoney").val(money($("#addSO-orderPartMoney").val()-$("#addSO-preferMoney").val())),e.setOrderNoReceive(e.enterPriceInfo),t()}),$("#addSO-addTaxLimit").on("change keyup",function(){var a=""==$(this).val()?0:$(this).val();$("#addSO-orderPartMoney").val(money(1*a+1*d)),$("#addSO-orderMoney").val(money($("#addSO-orderPartMoney").val()-$("#addSO-preferMoney").val())),e.setOrderNoReceive(e.enterPriceInfo),t()}),e.initValidator(),$.addTabCloseEvent()},this.initAddOrderPages=function(o){Core.AjaxRequest({type:"GET",showMsg:!1,url:_global_settings.service.url+"/SimpleAC/"+(new Base64).encode("toocr/order/salesorderid/"+e.saleRowdata.id+"/"+e.saleRowdata.soOwnerId+"/"+e.saleRowdata.userName),callback:function(i,n){var s="true"==_global_settings.acOwner.productMeasFlag.toString();e.cartonType=_global_settings.acOwner.cartonType;var l="true"==_global_settings.acOwner.productBoxFlag.toString();$("#addSO-box").on("change",function(){$(this).is(":checked")?$("#addSaleOrder_grid").boxSetting("show"):$("#addSaleOrder_grid").boxSetting("hide")}).prop("checked",l),$("#addSO-productMeasFlag").on("change",function(){$(this).is(":checked")?$("#addSaleOrder_grid").productMeasFlag("show",e.cartonType):$("#addSaleOrder_grid").productMeasFlag("hide",e.cartonType)}).prop("checked",s),_global_settings.acOwner.yardsFlag&&(a.yards=!1,$("#addSO-box").parents(".priseInfoFlag").hide()),_global_settings.acOwner.productunitFlag&&(a.unitRate=!1),l||(a.totalCartons=!0,a.eachCartons=!0,$("#addSO-box").parents(".priseInfoFlag").hide()),s?"size"===e.cartonType||null===e.cartonType?(a.volume=!0,a.extent=!1,a.breadth=!1,a.altitude=!1):(a.volume=!1,a.extent=!0,a.breadth=!0,a.altitude=!0):($("#addSO-productMeasFlag").parents(".priseInfoFlag").hide(),a.extent=!0,a.breadth=!0,a.altitude=!0,a.volume=!0),$("#addSO-boxflag").is(":checked")||(a.printOfGoods=!0),$("#addSaleOrder_grid").easyGrid({columnSumEvent:function(){var a=$("#addSaleOrder_grid").jqxGrid("getcolumnaggregateddata","price3",["sum"]);d=a.sum;var r=$("#addSaleOrder_grid").jqxGrid("getcolumnaggregateddata","ysprice",["sum"]).sum,o=$("#addSaleOrder_grid").jqxGrid("getcolumnaggregateddata","dsprice",["sum"]).sum;$("#addSO-orderDeliver").val(money(r+o));var i=$("#addSO-addTax").val(),n=money(d*i/100);0==i?($("#addSO-orderPartMoney").val(money(d)),$("#addSO-orderMoney").val(money($("#addSO-orderPartMoney").val()-$("#addSO-preferMoney").val())),e.setOrderNoReceive(e.enterPriceInfo)):($("#addSO-addTaxLimit").val(n),$("#addSO-orderPartMoney").val(money(1*n+1*d)),$("#addSO-orderMoney").val(money($("#addSO-orderPartMoney").val()-$("#addSO-preferMoney").val())),e.setOrderNoReceive(e.enterPriceInfo)),t()},productSourceName:o,ownerSettings:{soOwnerId:e.saleRowdata.soOwnerId,userName:e.saleRowdata.userName,elementId:null},toggerColumns:a,gridSettings:{editable:!0,delBtn:!0}}),e.order=i,e.getReceiveRecord(i.salesOrderDeal.id),$("#addSO-attachment").fileuploader({filelist:i.fileInfoIds.toString(),orderId:e.saleRowdata.id,ownerId:e.saleRowdata.soOwnerId,ownerName:e.saleRowdata.userName,readonly:!0}),$("#addSO-addOrderNumber").val(i.orderNumber),e.initCustomer(i.clientInfo),$("#addSO-saleTime").val(i.orderDate),$("#addSO-recTime").val(i.planDeliveryDate),$("#addSO-sendTime").val(i.deliveryDate),r=i.addressList,$("#addSO-addTax").val(i.vat),$("#addSO-preferMoney").val(money(i.cheapAmt)),$("#addSO-orderMoney").val(money(i.otherAmt)),$("#addSO-remarkPrint").val(i.remarkPrint)}})},this.getReceiveRecord=function(d){Core.AjaxRequest({url:_global_settings.service.url+"/SimpleAC/"+(new Base64).encode("toocr/order/salesorderbill/"+d+"/"+e.saleRowdata.soOwnerId+"/"+e.saleRowdata.userName),type:"GET",showMsg:!1,callback:function(d){e.initRecRecords(d)},failure:function(e){}})},this.initCustomer=function(d){var a=d;$("#addSO-addCustomerId").comboBox({source:[{name:a.userInfo.name,clientInfoid:a.id}],displayMember:"name",valueMember:"clientInfoid",width:"90.888%",height:33}).val(a.id),$("#addSO-addCustomerId").jqxComboBox({disabled:!0}),$.each(a.userInfo.address,function(e,d){""==d.shortName?d.addressLabel=d.province+d.city+d.district+d.street:d.addressLabel="("+d.shortName+")"+d.province+d.city+d.district+d.street}),e.initReceiverAddress(a.userInfo.address)},this.initReceiverAddress=function(e){$("#addSO-addReceiverAddress").comboBox({source:e,displayMember:"addressLabel",valueMember:"addressLabel",width:"91.45555%",height:33,selectedIndex:0,checkboxes:!0}),setTimeout(function(){for(var e=0;e<r.length;e++)$("#addSO-addReceiverAddress").jqxComboBox("checkItem",r[e].description)},500)},this.initRecRecords=function(d){var a={setOrderNoReceive:e.setOrderNoReceive,enterPriceInfo:e.enterPriceInfo,data:d,orderMoney:$("#addSO-orderMoney"),orderReceive:$("#addSO-orderReceive"),orderNoReceive:$("#addSO-orderNoReceive"),orderOverReceive:$("#addSO-orderOverReceive"),grid:"addSaleOrder_grid"};$("#addSO-receiveRecordTable").easytableExamplex(a)},this.initValidator=function(){$("#addSO-Form").jqxValidator({animationDuration:1,hintType:"label",rules:[{input:"#addSO-recTime",message:"不能小于销售日期",action:"keyup, change",rule:function(e,d){return""==e.val()||!(e.val()<$("#addSO-saleTime").val())}},{input:"#addSO-sendTime",message:"不能小于销售日期",action:"keyup, change",rule:function(e,d){return""==e.val()||!(e.val()<$("#addSO-saleTime").val())}}]})};!function(){$("#addSOAddress").jqxValidator({animationDuration:1,hintType:"label",rules:[{input:"#addSOAddressTableArs",message:"不能为空",action:"keyup,change",rule:function(e,d){var a=!0;return $.each(e.children(),function(e){""===$(this).val()&&e<2&&(a=!1)}),!!a}},{input:"#addSOAddressTableSt",message:"不能为空",action:"keyup, blur",rule:"required"}]})}()},AddSaleOrderBindModle=function(e){var d=this,a=function(){var e=[],d=$("#addSO-receiveRecordTbody").children();return $.each(d,function(a){var r=d.eq(a).find(".receiveMoney").val();if(0!=r&&""!=r){var t={};t.createDate=d.eq(a).find(".time").val(),t.amount=r,t.payWay=d.eq(a).find(".receiveWay").val(),t.remark=d.eq(a).find(".remark").val(),e.push(t)}}),e};this.submitOrder=function(e,d){var a=!0;$.each(e.salesOrderDetails,function(d){0==e.salesOrderDetails[d].qty&&(a=!1)}),1==d||$("#addSO-Form").jqxValidator("validate")&&Core.AjaxRequest({url:_global_settings.service.url+"/overview/saveOrder",type:"POST",showWaiting:!0,params:e,successMsg:"操作成功",callback:function(e){$.closeTab(),$("#userInformationGrid").jqxGrid("updatebounddata","cells")},failure:function(e){}})};var r=function(e){return $("#addSaleOrder_grid").getDataWash(e)};this.initAddParam=function(d){var t={};t.clientName=$("#addSO-addCustomerId").find("input").val(),t.clientId=$("#addSO-addCustomerId").val();var o=$("#addSO-addReceiverAddress").jqxComboBox("getCheckedItems"),i="",n=e.addAddressObj;if(t.ocrSaleOrderAddress=[],$.each(o,function(e){i+=o[e].value+","}),i=i.substring(0,i.length-1),0!=n.length)for(var s=i.split(","),l=0;l<n.length;l++)for(var c=0;c<s.length;c++)n[l].addressLabel==s[c]&&t.ocrSaleOrderAddress.push(n[l]);t.deliveryAddress=i,t.orderDate=$("#addSO-saleTime").val(),t.deliveryDate=""==$("#addSO-sendTime").val()?"":$("#addSO-sendTime").val()+":00",t.planDeliveryDate=$("#addSO-recTime").val(),t.orderNumber=$("#addSO-addOrderNumber").val(),t.otherAmtdesc=e.otherAmtdesc,t.otherAmt=$("#addSO-otherpayInput").val(),$("#addSO-otherpay")[0].checked||(t.otherAmtdesc="",t.otherAmt=""),t.remarkPrint=$("#addSO-remarkPrint").val(),t.productMeasFlag=$("#addSO-productMeasFlag")[0].checked,t.printOfGoodsFlag=$("#addSO-boxflag")[0].checked,t.goodsBinning="N",$("#addSO-box")[0].checked&&(t.goodsBinning="Y"),t.simpleOrderId=e.saleRowdata.id,t.vat=$("#addSO-addTax").val(),t.vatAmt=$("#addSO-addTaxLimit").val(),t.totalAmt=$("#addSO-orderMoney").val(),t.cheapAmt=$("#addSO-preferMoney").val(),t.uuid=e.saleRowdata.uuid,t.discountFlag=_global_settings.acOwner.ownerAttr.discountFlag,t.yardsFlag=_global_settings.acOwner.yardsFlag,t.productunitFlag=_global_settings.acOwner.productunitFlag,t.customFormulaFlag=_global_settings.acOwner.ownerAttr.customFormulaFlag,t.productKgFlag=_global_settings.acOwner.productKgFlag,t.productKgFlag&&(t.weightUnit=_global_settings.acOwner.prodUnit[0].descr,t.weightWay=_global_settings.acOwner.prodUnit[0].weightWay),$("#addSO-productMeasFlag")[0].checked&&(t.cartonType=e.cartonType);var u=a();return t.ocrSaleOrderBill=[],$.each(u,function(e){var d={};d.createDate=u[e].createDate,d.amount=u[e].amount,d.payWay=u[e].payWay,d.remark=u[e].remark,t.ocrSaleOrderBill.push(d)}),t.ocrSaleOrderDetail=r(!d),t.fileInfoIds=[],$("#addSO-attachment").find(".item").each(function(e,d){var a=$(d).attr("data-id");void 0!==a&&t.fileInfoIds.push(a)}),t.fileInfoIds=t.fileInfoIds.toString(),t},this.bind=function(){$("#addOcrOrderReject").off("click").on("click",function(){setPara(),rejectOcrOrder(e.saleRowdata.uuid)}),$("#saveAddSaleOrderBtn").off("click").on({click:function(){setPara(),$("#addSO-Form").jqxValidator("validate")&&getMsgForNullSpecId($("#addSaleOrder_grid").getDataWash(),d.submitOrder,d.initAddParam())}}),$("#addSOAddressBtn").on("click",function(){if($("#addSOAddress").jqxValidator("validate")){var d={shortName:$("#addSOAddressTableSn").val(),province:$("#addSOAddressTableArs").find("select").eq(0).val(),city:$("#addSOAddressTableArs").find("select").eq(1).val(),district:$("#addSOAddressTableArs").find("select").eq(2).val(),street:$("#addSOAddressTableSt").val(),zipCode:$("#addSOAddressTableZc").val(),remark:$("#addSOAddressTableRm").val()},a=""==d.shortName?"":"("+d.shortName+")";d.addressLabel=a+d.province+d.city+d.district+d.street,e.addAddressObj.push(d),$("#addSOAddress").modal("hide"),$("#addSO-addReceiverAddress").jqxComboBox("addItem",{label:d.addressLabel}),$("#addSO-addReceiverAddress").jqxComboBox("checkItem",d.addressLabel)}});var a={inputId:"#addSO-otherpay",labelId:"#addOtherPay",showId:"#addSO-otherpayInput",otherDesc:e.otherAmtdesc,mgt:e,ownerId:e.saleRowdata.soOwnerId,name:e.saleRowdata.userName};otherPay(a)},this.unbindAll=function(){}};