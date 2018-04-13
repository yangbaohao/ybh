function downloadTemplate(){var e=(new Base64).encode("tosys/coaReport/export/coa/0/"+currentUserInfo.id+"/"+currentUserInfo.loginId);window.open(_global_settings.service.url+"/ac/exportReport/"+e)}var ChartOfAccountMgt=function(){var me=this,debug=!1,url=_global_settings.service.url+"/chartOfAccount";this.settings={ajax:{url:url}},this.coaType=["assetCOA","liabiliyCOA","ownershipCOA","costCOA","profitCOA"],this.initInput=function(){$.each(me.coaType,function(e,a){me.initGrid(a,e+1),me.initWindows(a),me.initValidator(a)}),me.initTabs(),$.addTabCloseEvent()},this.initWindows=function(coaType){var debitCredit_key_value=[{value:"debit",label:"借"},{value:"credit",label:"贷"}],enabled_key_value=[{value:!0,label:"启用"},{value:!1,label:"停用"}],cloneOne=$("#addCoaWin").clone();cloneOne.attr("id",cloneOne.attr("id")+coaType).find("*").each(function(e,a){$(this).attr("id")&&$(this).attr("id",$(this).attr("id")+coaType)}),$("#addCoaWin").after(cloneOne),$("#addCoaWin"+coaType).jqxWindow({theme:currentTheme,isModal:!0,autoOpen:!1,showCollapseButton:!1,maxHeight:"100%",maxWidth:"100%",minHeight:200,minWidth:200,resizable:!0,height:460,width:800,cancelButton:$("#canceladdCoaBtn"+coaType),initContent:function(){$("#addCoa-debitCredit"+coaType).jqxDropDownList({width:"100%",height:37,autoDropDownHeight:!0,placeHolder:"请选择",disabled:!0,displayMember:"label",valueMember:"value",source:debitCredit_key_value}),$("#addCoa-enabled"+coaType).jqxDropDownList({width:"100%",height:37,autoDropDownHeight:!0,placeHolder:"请选择",displayMember:"label",valueMember:"value",source:enabled_key_value}),$("#addCoa-ref"+coaType).input({width:"86%",height:37}),$("#addCoa-name"+coaType).input({width:"86%",height:37}),$("#addCoa-iniValue"+coaType).moneyinput({width:"90%",height:37,allowNull:!1}),$("#addCoa-debitAmt"+coaType).moneyinput({width:"90%",height:37,allowNull:!1}),$("#addCoa-creditAmt"+coaType).moneyinput({width:"90%",height:37,allowNull:!1}),$("#addCoa-balance"+coaType).moneyinput({width:"90%",height:37,disabled:!0,allowNull:!1}).attr("disabled","disabled")}}).on({open:function(){var rowindex=$("#"+coaType+"Grid").jqxGrid("getselectedrowindex");if(rowindex>=0){var data=$("#"+coaType+"Grid").jqxGrid("getrowdata",rowindex);$("#addCoa-level"+coaType).val(parseInt(data.level)+1),$("#addCoa-debitCredit"+coaType).val(data.debitCredit),$("#addCoa-parentId"+coaType).val(data.id),$("#addCoa-coaClass"+coaType).val(data.coaClass),$("#addCoa-name"+coaType).val(data.name+"-"),1==eval(data.allowInput)?($("#addCoa-iniValue"+coaType).val(data.iniValue),$("#addCoa-debitAmt"+coaType).val(data.debitAmt),$("#addCoa-creditAmt"+coaType).val(data.creditAmt),$("#addCoa-balance"+coaType).val(data.balance)):($("#addCoa-iniValue"+coaType).val(0),$("#addCoa-debitAmt"+coaType).val(0),$("#addCoa-creditAmt"+coaType).val(0),$("#addCoa-balance"+coaType).val(0));for(var dataAdapter=$("#"+coaType+"Grid").jqxGrid("source"),records=dataAdapter.records,maxRef=data.ref,_max=0,flag=!1,len=data.ref.length,_in=0;_in<records.length;_in++){var record=records[_in];if(0===record.ref.indexOf(data.ref)&&record.ref.length==len+2){var _value=parseInt(record.ref.substring(len,len+2));if(_max<_value&&_value<95&&(_max=_value,maxRef=record.ref,flag=!0),_value>=95)break}}!1===flag?(maxRef=data.ref+"01",$("#addCoa-name"+coaType).jqxInput("focus")):_max+1>=95?(maxRef=maxRef.substring(0,len),$("#addCoa-ref"+coaType).jqxInput("focus")):(maxRef=parseInt(maxRef)+1,$("#addCoa-name"+coaType).jqxInput("focus")),$("#addCoa-ref"+coaType).val(maxRef),$("#addCoa-parentRef"+coaType).val(data.ref)}$("#addCoa-coatype"+coaType).val(coaType),$("#addCoa-enabled"+coaType).val(!0),$("#addCoaForm"+coaType).jqxValidator("hide"),$("#addCoaForm"+coaType).find(".jqx-validator-error-label").text("")},close:function(){$("#addCoa-level"+coaType).val(""),$("#addCoa-coaClass"+coaType).val(""),$("#addCoa-coatype"+coaType).val(""),$("#addCoa-parentId"+coaType).val(""),$("#addCoa-ref"+coaType).val(""),$("#addCoa-name"+coaType).val(""),$("#addCoa-enabled"+coaType).val(!0),$("#addCoa-debitCredit"+coaType).val(""),$("#addCoa-iniValue"+coaType).val(0),$("#addCoa-debitAmt"+coaType).val(0),$("#addCoa-creditAmt"+coaType).val(0),$("#addCoa-balance"+coaType).val(0),$("#addCoa-parentRef"+coaType).val("")}});var cloneEdit=$("#editCoaWin").clone();cloneEdit.attr("id",cloneEdit.attr("id")+coaType).find("*").each(function(e,a){void 0!==$(this).attr("id")&&$(this).attr("id",$(this).attr("id")+coaType)}),$("#editCoaWin").after(cloneEdit),$("#editCoaWin"+coaType).jqxWindow({theme:currentTheme,isModal:!0,autoOpen:!1,showCollapseButton:!1,maxHeight:"100%",maxWidth:"100%",minHeight:200,minWidth:200,resizable:!0,height:460,width:800,cancelButton:$("#canceleditCoaBtn"+coaType),initContent:function(){$("#editCoa-debitCredit"+coaType).jqxDropDownList({width:"90%",height:37,autoDropDownHeight:!0,placeHolder:"请选择",disabled:!0,displayMember:"label",valueMember:"value",source:debitCredit_key_value}),$("#editCoa-enabled"+coaType).jqxDropDownList({width:"90%",height:37,autoDropDownHeight:!0,placeHolder:"请选择",displayMember:"label",valueMember:"value",source:enabled_key_value}),$("#editCoa-ref"+coaType).input({width:"85%",height:37}),$("#editCoa-name"+coaType).input({width:"85%",height:37}),$("#editCoa-iniValue"+coaType).input({width:"90%",height:37}),$("#editCoa-debitAmt"+coaType).input({width:"90%",height:37}),$("#editCoa-creditAmt"+coaType).input({width:"90%",height:37}),$("#editCoa-balance"+coaType).input({width:"90%",height:37,disabled:!0})}}).on({open:function(){var rowindex=$("#"+coaType+"Grid").jqxGrid("getselectedrowindex");if(rowindex>=0){var data=$("#"+coaType+"Grid").jqxGrid("getrowdata",rowindex);$("#editCoa-id"+coaType).val(data.id),void 0===data.id||null==data.id?$("#editCoa-ref"+coaType).jqxInput("disabled",!1):$("#editCoa-ref"+coaType).jqxInput("disabled",!0),$("#editCoa-level"+coaType).val(parseInt(data.level)),$("#editCoa-coaClass"+coaType).val(data.coaClass),$("#editCoa-coatype"+coaType).val(coaType),void 0!==data.pid&&$("#editCoa-parentId"+coaType).val(data.pid),void 0!==data.parentId&&$("#editCoa-parentId"+coaType).val(data.parentId),$("#editCoa-ref"+coaType).val(data.ref),$("#editCoa-name"+coaType).val(data.name),1==parseInt(data.level)?($("#editCoa-name"+coaType).jqxInput("disabled",!0),$("#editCoa-iniValue"+coaType).jqxInput("focus")):($("#editCoa-name"+coaType).jqxInput("disabled",!1),$("#editCoa-iniValue"+coaType).jqxInput("focus")),0==eval(data.allowInput)?($("#edit-tips"+coaType).html("  (该科目存在子科目，取值为系统自动计算其所有子科目总和，不可编辑。)"),$("#editCoa-iniValue"+coaType).jqxInput("disabled",!0),$("#editCoa-debitAmt"+coaType).jqxInput("disabled",!0),$("#editCoa-creditAmt"+coaType).jqxInput("disabled",!0),$("#editCoa-balance"+coaType).jqxInput("disabled",!0)):($("#edit-tips"+coaType).html(""),$("#editCoa-iniValue"+coaType).jqxInput("disabled",!1),$("#editCoa-debitAmt"+coaType).jqxInput("disabled",!1),$("#editCoa-creditAmt"+coaType).jqxInput("disabled",!1),$("#editCoa-balance"+coaType).jqxInput("disabled",!1)),$("#editCoa-enabled"+coaType).val(data.enabled),$("#editCoa-debitCredit"+coaType).val(data.debitCredit),$("#editCoa-iniValue"+coaType).val(data.iniValue),$("#editCoa-debitAmt"+coaType).val(data.debitAmt),$("#editCoa-creditAmt"+coaType).val(data.creditAmt),$("#editCoa-balance"+coaType).val(data.balance),$("#editCoa-oldRef"+coaType).val(data.ref),$("#editCoa-parentRef"+coaType).val(data.parentRef)}else Core.alert({message:"请选择一项！"}),$("#editCoaWin"+coaType).jqxWindow("close");$("#editCoaForm"+coaType).jqxValidator("hide"),$("#editCoaForm"+coaType).find(".jqx-validator-error-label").text("")},close:function(){$("#editCoa-id"+coaType).val(null),$("#editCoa-level"+coaType).val(""),$("#editCoa-coaClass"+coaType).val(""),$("#editCoa-coatype"+coaType).val(""),$("#editCoa-parentId"+coaType).val(""),$("#editCoa-ref"+coaType).val(""),$("#editCoa-name"+coaType).val(""),$("#editCoa-enabled"+coaType).val(!0),$("#editCoa-debitCredit"+coaType).val(""),$("#editCoa-iniValue"+coaType).val(0),$("#editCoa-debitAmt"+coaType).val(0),$("#editCoa-creditAmt"+coaType).val(0),$("#editCoa-balance"+coaType).val(0),$("#editCoa-oldRef"+coaType).val(""),$("#editCoa-parentRef"+coaType).val("")}})},this.initTabs=function(){$("#chartOfAccountTab a").click(function(e){e.preventDefault();var a=($(".indicator"),$(this).attr("href"));"#900-1"==a&&($(".indicator").animate({left:"0%",right:"80%"},"slow"),me.searchDataInfo("assetCOAGrid")),"#900-2"==a&&($(".indicator").animate({left:"20%",right:"60%"},"slow"),me.searchDataInfo("liabiliyCOAGrid")),"#900-3"==a&&($(".indicator").animate({left:"40%",right:"40%"},"slow"),me.searchDataInfo("ownershipCOAGrid")),"#900-4"==a&&($(".indicator").animate({left:"60%",right:"20%"},"slow"),me.searchDataInfo("costCOAGrid")),"#900-5"==a&&($(".indicator").animate({left:"80%",right:"0%"},"slow"),me.searchDataInfo("profitCOAGrid")),$(this).tab("show")})},this.generateCoa=function(records,_editedRow,hardCode){for(var _hardCode="",len=records.length,accumulation=function(record){_hardCode=null==hardCode?"":hardCode.substring(0,record.hardCode.length);for(var flag=!0,iniValue=0,debitAmt=0,creditAmt=0,balance=0,childrenlen=0,ischildren=!1,i=0;i<len;i++){var r=records[i];r.ref!=record.ref&&(0===r.ref.indexOf(record.ref)&&(records[i]=accumulation(r),void 0==_editedRow||r.ref==_editedRow.ref&&(r=_editedRow),r.ref.length==record.ref.length+2&&1==eval(r.enabled)&&(iniValue+=parseFloat(r.iniValue),debitAmt+=parseFloat(r.debitAmt),creditAmt+=parseFloat(r.creditAmt),balance+=parseFloat(r.balance)),flag=!1))}return record.allowInput!=flag&&(record.submitFlag=!0),record.allowInput=flag,0==record.allowInput&&(record.iniValue==iniValue&&record.debitAmt==debitAmt&&record.creditAmt==creditAmt&&record.balance==balance||(record.submitFlag=!0),record.iniValue=iniValue,record.debitAmt=debitAmt,record.creditAmt=creditAmt,record.balance=balance),_hardCode==record.hardCode&&(record.submitFlag=!0,record.iniValue=0,record.debitAmt=0,record.creditAmt=0,record.balance=0),record},i=0;i<len;i++){var record=records[i];1==record.level&&(records[i]=accumulation(record))}return records},this.disableChildren=function(e,a,t){if(0==e.enabled||"false"==e.enabled)for(var i=0;i<a.length;i++){var d=a[i];if(d.ref!=e.ref){if(0===e.ref.indexOf(d.ref)&&"false"==d.enabled.toString())return!1;0===d.ref.indexOf(e.ref)&&(a[i].enabled=!1,a[i].submitFlag=!0)}else a[i].submitFlag=!0}else for(var i=0;i<a.length;i++){var d=a[i];if(d.ref!=e.ref){if(0===e.ref.indexOf(d.ref)&&"false"==d.enabled.toString())return!1;0===d.ref.indexOf(e.ref)&&(a[i].enabled=!0,a[i].submitFlag=!0)}else a[i].submitFlag=!0}},this.initGrid=function(el,coaClass){var source={dataType:"json",id:"ref",type:"GET",url:url+"/class/"+coaClass+"/"+currentUserInfo.id,deleterow:function(e,a){a(!0)}},dataAdapter=new $.jqx.dataAdapter(source,{beforeLoadComplete:function(e){return $.each(e,function(e,a){"debit"==a.debitCredit?a.debitCreditLabel="借":"credit"==a.debitCredit?a.debitCreditLabel="贷":a.debitCreditLabel="unknown",a.iniValue=void 0===a.iniValue||null==a.iniValue?0:a.iniValue,a.debitAmt=void 0===a.debitAmt||null==a.debitAmt?0:a.debitAmt,a.creditAmt=void 0===a.creditAmt||null==a.creditAmt?0:a.creditAmt,a.balance=void 0===a.balance||null==a.balance?0:a.balance}),e}}),cellbeginedit=function(e,a,t,i){var d=$("#"+el+"Grid").jqxGrid("getrowdata",e),r=$("#"+el+"Grid").jqxGrid("getrows");if(0==me.disableChildren(d,r))return!1;if(null==i)return!1;if("enabled"==a){var o=parseFloat(d.iniValue),l=parseFloat(d.debitAmt),n=parseFloat(d.creditAmt),c=parseFloat(d.balance);return 0==o&&0==l&&0==n&&0==c}return 0!=d.enabled&&d.allowInput},cellvaluechanging=function(e,a,t,i,d){void 0!==d&&null!=d||(d=0),!isNaN(parseFloat(d))&&isFinite(d)||(d=0),""==d&&(d=0);var r=$("#"+el+"Grid").jqxGrid("getrowdata",e),o="iniValue"==a?parseFloat(d):parseFloat(r.iniValue),l="debitAmt"==a?parseFloat(d):parseFloat(r.debitAmt),n="creditAmt"==a?parseFloat(d):parseFloat(r.creditAmt);return"debit"==r.debitCredit&&(r.balance=o-l+n),"credit"==r.debitCredit&&(r.balance=o+l-n),d!=i&&(r.submitFlag=!0),d},enabledchanging=function(row,datafield,columntype,oldvalue,newvalue){var rowData=$("#"+el+"Grid").jqxGrid("getrowdata",row),iniValue=parseFloat(rowData.iniValue),debitAmt=parseFloat(rowData.debitAmt),creditAmt=parseFloat(rowData.creditAmt),balance=parseFloat(rowData.balance);return setTimeout(function(){$("#"+el+"Grid").jqxGrid("refresh")},100),0==eval(newvalue)?0==iniValue&&0==debitAmt&&0==creditAmt&&0==balance?newvalue:oldvalue:newvalue},enabledValidation=function(e,a){return!0},validation=function(e,a){return!(isNaN(parseFloat(a))||!isFinite(a))||{result:!1,message:"输入非法！"}},editable=!0;editable="profitCOA"!==el,$("#"+el+"Grid").jqxGrid({width:"100%",theme:currentTheme,source:dataAdapter,columnsresize:!0,columnsheight:40,rowsheight:40,autoheight:!0,localization:gridLocalizationObj,enablebrowserselection:!0,pageable:!1,editable:!0,editmode:"dblclick",selectionmode:"singlerow",columns:[{text:"科目编码",datafield:"ref",width:"10%",editable:!1},{text:"科目名称",datafield:"name",width:"30%",editable:!1},{text:"方向",datafield:"debitCreditLabel",width:"5%",editable:!1},{text:"期初值",datafield:"iniValue",width:"10%",cellsformat:"c2",cellsalign:"right",editable:editable,cellbeginedit:cellbeginedit,cellvaluechanging:cellvaluechanging},{text:"本年累计借方",datafield:"debitAmt",width:"10%",cellsformat:"c2",cellsalign:"right",editable:!0,cellbeginedit:cellbeginedit,cellvaluechanging:cellvaluechanging},{text:"本年累计贷方",datafield:"creditAmt",width:"10%",cellsformat:"c2",cellsalign:"right",editable:!0,cellbeginedit:cellbeginedit,cellvaluechanging:cellvaluechanging},{text:"年初余额",datafield:"balance",width:"10%",cellsformat:"c2",cellsalign:"right",editable:!1},{text:"是否启用",datafield:"enabled",width:"8%",columntype:"checkbox",cellbeginedit:cellbeginedit,cellvaluechanging:enabledchanging},{text:"操作",width:"7%",cellsrenderer:function(rowIndex,columnfield,value,defaulthtml,columnproperties,rowdata){var rtStr='<div class="jqx-grid-cell-left-align" style="margin-top:6px">';return rowdata.level<4&&(rtStr+='<a class="addCOA md-add-circle" title="添加子科目" ></a>'),rtStr+='<a class="editCOA md-rate-review" title="编辑" ></a>',(!0===eval(rowdata.delFlag)||1==rowdata.allowInput&&1!=rowdata.level)&&(rtStr+='<a class="deleteCOA  md-cancel" title="删除" ></a>'),rtStr+="</div>"}}]}),$("#"+el+"Grid").on("cellendedit",function(e){var a=e.args,t=e.args.datafield,i=(e.args.rowindex,a.value),d=a.row,r=$.extend(!0,{},d);r.iniValue="iniValue"==t?i:d.iniValue,r.debitAmt="debitAmt"==t?i:d.debitAmt,r.creditAmt="creditAmt"==t?i:d.creditAmt,r.enabled="enabled"==t?i:d.enabled;var o=$("#"+el+"Grid").jqxGrid("source").records;$("#"+el+"Grid").jqxGrid("source").records=me.generateCoa(o,r)}),$("#"+el+"Grid").on("cellendedit",function(e){var a=e.args.row,t=$("#"+el+"Grid").jqxGrid("source").records;me.disableChildren(a,t,el)}),$("#"+el+"Grid").on("click",".addCOA",function(){var e=$(window).width(),a=$(window).height(),t=$(document).scrollTop(),i=(e-$("#addCoaWin"+el).width())/2,d=(a-$("#addCoaWin"+el).height())/2+t;$("#addCoaWin"+el).jqxWindow({position:{x:i,y:d}}),$("#addCoaWin"+el).jqxWindow("open"),$("#addCoaForm"+el).jqxValidator("hide"),$("#addCoaForm"+el).find(".jqx-validator-error-label").text("")}),$("#"+el+"Grid").on("click",".editCOA",function(e){var a=$(window).width(),t=$(window).height(),i=$(document).scrollTop(),d=(a-$("#editCoaWin"+el).width())/2,r=(t-$("#editCoaWin"+el).height())/2+i;$("#editCoaWin"+el).jqxWindow({position:{x:d,y:r}}),$("#editCoaWin"+el).jqxWindow("open"),$("#editCoaForm"+el).jqxValidator("hide"),$("#editCoaForm"+el).find(".jqx-validator-error-label").text("")}),$("#"+el+"Grid").on("click",".deleteCOA",function(){function e(e){var a=$("#"+el+"Grid").jqxGrid("source").records,t=$.extend(!0,[],a);$.each(t,function(e,a){if(d.ref==a.ref);else if(0===a.ref.indexOf(d.ref)){$("#"+el+"Grid").jqxGrid("deleterow",a.uid)}}),delete t,$("#"+el+"Grid").jqxGrid("source").records=me.generateCoa($("#"+el+"Grid").jqxGrid("source").records,null,e)}var a=$("#"+el+"Grid").jqxGrid("getselectedrowindex"),t=$("#"+el+"Grid").jqxGrid("getdatainformation").rowscount;if(a>=0&&a<t){var i=$("#"+el+"Grid").jqxGrid("getrowid",a),d=$("#"+el+"Grid").jqxGrid("getrowdatabyid",i);null==d.id?Core.confirm({message:"确定要删除吗？",confirmCallback:function(){$("#"+el+"Grid").jqxGrid("deleterow",i);e(i)}}):Core.confirm({message:"确定要删除吗？",confirmCallback:function(){Core.AjaxRequest({type:"DELETE",async:!1,url:_global_settings.service.url+"/chartOfAccount/"+d.id+"/"+currentUserInfo.id,callback:function(a){$("#"+el+"Grid").jqxGrid("deleterow",i);e(i)},failure:function(e){}})}})}})},this.initValidator=function(coaType){var validateMoney=function(e,a,t){var i=e.val(),d=$("#"+t+"Coa-debitCredit"+coaType).val(),r=parseFloat($("#"+t+"Coa-iniValue"+coaType).val()),o=parseFloat($("#"+t+"Coa-debitAmt"+coaType).val()),l=parseFloat($("#"+t+"Coa-creditAmt"+coaType).val());return!(isNaN(parseFloat(i))||!isFinite(i))&&("debit"==d?($("#"+t+"Coa-balance"+coaType).val(money(r-o+l)),!0):"credit"==d?($("#"+t+"Coa-balance"+coaType).val(money(r-l+o)),!0):void 0)},validateDuplicateRef=function(e,a,t){var i=function(e,a,t){for(var i=$("#"+coaType+"Grid").jqxGrid("source"),d=i.records,r=e.val(),o=0,l=0;l<d.length;l++){r==d[l].ref&&o++}return t==r&&o--,0==o};if(void 0===t)return i(e);if(!0===t){var d=$("#editCoa-id"+coaType).val();if(null==d||""==d){return i(e,0,$("#editCoa-oldRef"+coaType).val())}}return!0},validateRef=function(e,a,t){var i=e.val();if(1==IsPositiveInteger(e,a)){var d=parseInt($("#addCoa-level"+coaType).val());!0===t&&(d=parseInt($("#editCoa-level"+coaType).val()));var r=2*d+2;if(i.length!=r)return!1;var o=$("#addCoa-parentRef"+coaType).val();return!0===t&&(o=$("#editCoa-parentRef"+coaType).val()),0===i.indexOf(o)}return!1};$("#addCoaForm"+coaType).jqxValidator({animationDuration:1,hintType:"label",rules:[{input:"#addCoa-ref"+coaType,message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#addCoa-ref"+coaType,message:"科目编码格式不符",action:"keyup, blur",rule:validateRef},{input:"#addCoa-ref"+coaType,message:"科目编码已存在",action:"keyup, blur",rule:validateDuplicateRef},{input:"#addCoa-name"+coaType,message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#addCoa-debitCredit"+coaType,message:"请选择",action:"change",rule:function(e,a){return""!==e.val()}},{input:"#addCoa-enabled"+coaType,message:"请选择",action:"change",rule:function(e,a){return""!==e.val()}},{input:"#addCoa-enabled"+coaType,message:"不可停用",action:"change",rule:function(input,commit){var iniValue=parseFloat($("#addCoa-iniValue"+coaType).val()),debitAmt=parseFloat($("#addCoa-debitAmt"+coaType).val()),creditAmt=parseFloat($("#addCoa-creditAmt"+coaType).val()),balance=parseFloat($("#addCoa-balance"+coaType).val());return 0!=eval(input.val())||0==iniValue&&0==debitAmt&&0==creditAmt&&0==balance}},{input:"#addCoa-iniValue"+coaType,message:"必须是数字",action:"keyup, blur",rule:function(e,a){return validateMoney(e,a,"add")}},{input:"#addCoa-debitAmt"+coaType,message:"必须是数字",action:"keyup, blur",rule:function(e,a){return validateMoney(e,a,"add")}},{input:"#addCoa-creditAmt"+coaType,message:"必须是数字",action:"keyup, blur",rule:function(e,a){return validateMoney(e,a,"add")}}]}),$("#editCoaForm"+coaType).jqxValidator({animationDuration:1,hintType:"label",rules:[{input:"#editCoa-ref"+coaType,message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#editCoa-ref"+coaType,message:"科目编码格式不符",action:"keyup, blur",rule:function(e,a){return validateRef(e,a,!0)}},{input:"#editCoa-ref"+coaType,message:"科目编码已存在",action:"keyup, blur",rule:function(e,a){return validateDuplicateRef(e,a,!0)}},{input:"#editCoa-name"+coaType,message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#editCoa-debitCredit"+coaType,message:"请选择",action:"change",rule:function(e,a){return""!==e.val()}},{input:"#editCoa-enabled"+coaType,message:"请选择",action:"change",rule:function(e,a){return""!==e.val()}},{input:"#editCoa-enabled"+coaType,message:"不可停用",action:"change",rule:function(input,commit){var iniValue=parseFloat($("#editCoa-iniValue"+coaType).val()),debitAmt=parseFloat($("#editCoa-debitAmt"+coaType).val()),creditAmt=parseFloat($("#editCoa-creditAmt"+coaType).val()),balance=parseFloat($("#editCoa-balance"+coaType).val());return 0!=eval(input.val())||0==iniValue&&0==debitAmt&&0==creditAmt&&0==balance}},{input:"#editCoa-iniValue"+coaType,message:"必须是数字",action:"keyup, blur",rule:function(e,a){return validateMoney(e,a,"edit")}},{input:"#editCoa-debitAmt"+coaType,message:"必须是数字",action:"keyup, blur",rule:function(e,a){return validateMoney(e,a,"edit")}},{input:"#editCoa-creditAmt"+coaType,message:"必须是数字",action:"keyup, blur",rule:function(e,a){return validateMoney(e,a,"edit")}}]})},this.searchDataInfo=function(e){var a=void 0===e?me.settings.grid.element:e;$("#"+a).jqxGrid("refreshdata"),$("#"+a).jqxGrid("refresh")},this.refreshDataInfo=function(e){var a=void 0===e?me.settings.grid.element:e;$("#"+a).jqxGrid("updateBoundData"),$("#"+a).jqxGrid("clearSelection"),$("#"+a).jqxGrid("refreshdata")}},ChartOfAccountBindModle=function(chartOfAccountMgt){var me=this;this.add=function(e){if($("#addCoaForm"+e).jqxValidator("validate")){var a=$("#addCoa-debitCredit"+e).val(),t=null;t="debit"==a?"借":"credit"==a?"贷":"unknown";for(var i={parentId:""==$("#addCoa-parentId"+e).val()?null:$("#addCoa-parentId"+e).val(),ref:$("#addCoa-ref"+e).val(),coaClass:$("#addCoa-coaClass"+e).val(),name:$("#addCoa-name"+e).val(),debitCredit:a,debitCreditLabel:t,iniValue:$("#addCoa-iniValue"+e).val(),debitAmt:$("#addCoa-debitAmt"+e).val(),creditAmt:$("#addCoa-creditAmt"+e).val(),balance:$("#addCoa-balance"+e).val(),level:$("#addCoa-level"+e).val(),enabled:$("#addCoa-enabled"+e).val(),hardCode:$("#addCoa-ref"+e).val(),submitFlag:!0,parentRef:""==$("#addCoa-parentRef"+e).val()?null:$("#addCoa-parentRef"+e).val(),delFlag:!0},d=$("#"+e+"Grid").jqxGrid("source"),r=d.records,o=$("#"+e+"Grid").jqxGrid("getselectedrowindex"),d=$("#"+e+"Grid").jqxGrid("source"),r=d.records,l=1,n=0;n<r.length;n++){var c=r[n],u=i.parentRef.length;if(0===c.ref.indexOf(i.parentRef)&&c.ref.length>=u+2&&(l++,i.level==c.level&&parseInt(i.ref)<parseInt(c.ref))){l--;break}}r.splice(o+l,0,i),$("#"+e+"Grid").jqxGrid("source").records=chartOfAccountMgt.generateCoa(r),$("#addCoaWin"+e).jqxWindow("close"),chartOfAccountMgt.searchDataInfo(e+"Grid")}},this.edit=function(e){if($("#editCoaForm"+e).jqxValidator("validate")){var a=$("#editCoa-debitCredit"+e).val(),t=null;t="debit"==a?"借":"credit"==a?"贷":"unknown";var i={id:$("#editCoa-id"+e).val(),parentId:""==$("#editCoa-parentId"+e).val()?null:$("#editCoa-parentId"+e).val(),ref:$("#editCoa-ref"+e).val(),hardCode:$("#editCoa-ref"+e).val(),coaClass:$("#editCoa-coaClass"+e).val(),name:$("#editCoa-name"+e).val(),debitCredit:a,debitCreditLabel:t,iniValue:$("#editCoa-iniValue"+e).val(),debitAmt:$("#editCoa-debitAmt"+e).val(),creditAmt:$("#editCoa-creditAmt"+e).val(),balance:$("#editCoa-balance"+e).val(),level:$("#editCoa-level"+e).val(),enabled:$("#editCoa-enabled"+e).val(),submitFlag:!0,parentRef:""==$("#editCoa-parentRef"+e).val()?null:$("#editCoa-parentRef"+e).val(),delFlag:""!=$("#editCoa-parentRef"+e).val()};""!=i.id&&null!=i.id||delete i.id;var d=$("#"+e+"Grid").jqxGrid("getselectedrowindex"),r=$("#"+e+"Grid").jqxGrid("getdatainformation").rowscount;if(d>=0&&d<r){var o=$("#"+e+"Grid").jqxGrid("getrowid",d);$("#"+e+"Grid").jqxGrid("updaterow",o,i);$("#"+e+"Grid").jqxGrid("ensurerowvisible",d),$("#editCoaWin"+e).jqxWindow("close");var l=$("#"+e+"Grid").jqxGrid("source").records;$("#"+e+"Grid").jqxGrid("source").records=chartOfAccountMgt.generateCoa(l),chartOfAccountMgt.disableChildren(i,l,e),chartOfAccountMgt.searchDataInfo(e+"Grid")}}},this.remove=function(e){},this.computeBalance=function(submitFlag){var debitValue=0,creditValue=0,debitYearValue=0,creditYearValue=0,debitBalanceValue=0,creditBalanceValue=0,isBalance=!1;if($.each(chartOfAccountMgt.coaType,function(i,v){var dataAdapter=$("#"+v+"Grid").jqxGrid("source"),records=dataAdapter.records;$.each(records,function(_in,record){"debit"==record.debitCredit&&1==eval(record.enabled)&&eval(1==record.allowInput)&&(debitValue+=parseFloat(record.iniValue),debitBalanceValue+=parseFloat(record.balance),debitYearValue+=parseFloat(record.debitAmt),creditYearValue+=parseFloat(record.creditAmt)),"credit"==record.debitCredit&&1==eval(record.enabled)&&eval(1==record.allowInput)&&(creditValue+=parseFloat(record.iniValue),creditBalanceValue+=parseFloat(record.balance),debitYearValue+=parseFloat(record.debitAmt),creditYearValue+=parseFloat(record.creditAmt))})}),$("#computeDebitValue").text(parseFloat(debitValue).toFixed(2)),$("#computeCreditValue").text(parseFloat(creditValue).toFixed(2)),$("#computeDeviationValue").text(Math.abs(debitValue-creditValue).toFixed(2)),$("#computeYearDebitValue").text(parseFloat(debitYearValue).toFixed(2)),$("#computeYearCreditValue").text(parseFloat(creditYearValue).toFixed(2)),$("#computeDeviationYearValue").text(Math.abs(debitYearValue-creditYearValue).toFixed(2)),$("#computeDebitBalanceValue").text(parseFloat(debitBalanceValue).toFixed(2)),$("#computeCreditBalanceValue").text(parseFloat(creditBalanceValue).toFixed(2)),$("#computeDeviationBalanceValue").text(Math.abs(debitBalanceValue-creditBalanceValue).toFixed(2)),debitValue=parseFloat(debitValue).toFixed(2),creditValue=parseFloat(creditValue).toFixed(2),debitYearValue=parseFloat(debitYearValue).toFixed(2),creditYearValue=parseFloat(creditYearValue).toFixed(2),debitBalanceValue=parseFloat(debitBalanceValue).toFixed(2),creditBalanceValue=parseFloat(creditBalanceValue).toFixed(2),debitValue!=creditValue?($("#computeDebitValue").parent().addClass("error"),$("#computeCreditValue").parent().addClass("error"),$("#computeDeviationValue").parent().addClass("error")):($("#computeDebitValue").parent().removeClass("error"),$("#computeCreditValue").parent().removeClass("error"),$("#computeDeviationValue").parent().removeClass("error")),debitYearValue!=creditYearValue?($("#computeYearDebitValue").parent().addClass("error"),$("#computeYearCreditValue").parent().addClass("error"),$("#computeDeviationYearValue").parent().addClass("error")):($("#computeYearDebitValue").parent().removeClass("error"),$("#computeYearCreditValue").parent().removeClass("error"),$("#computeDeviationYearValue").parent().removeClass("error")),debitBalanceValue!=creditBalanceValue?($("#computeDebitBalanceValue").parent().addClass("error"),$("#computeCreditBalanceValue").parent().addClass("error"),$("#computeDeviationBalanceValue").parent().addClass("error")):($("#computeDebitBalanceValue").parent().removeClass("error"),$("#computeCreditBalanceValue").parent().removeClass("error"),$("#computeDeviationBalanceValue").parent().removeClass("error")),!0===submitFlag)return isBalance=debitValue==creditValue&&debitBalanceValue==creditBalanceValue&&debitYearValue==creditYearValue,0==isBalance&&$("#computeBalanceModal").modal("show"),isBalance;$("#computeBalanceModal").modal("show")},this.submitAll=function(){var e=[];!0===me.computeBalance(!0)&&($.each(chartOfAccountMgt.coaType,function(a,t){var i=$("#"+t+"Grid").jqxGrid("source"),d=i.records;$.each(d,function(a,t){if(!0===t.submitFlag){var i=$.extend(!0,{},t);void 0===i.parentId&&(i.parentId=null),void 0!==i.pid&&""!=i.pid&&(i.parentId=i.pid),delete i.submitFlag,delete i.uid,delete i.debitCreditLabel,delete i.visibleindex,delete i.uniqueid,delete i.boundindex,delete i.parentRef,delete i.delFlag,delete i.pid,e.push(i)}})}),e.length>0?Core.AjaxRequest({url:_global_settings.service.url+"/ac/"+(new Base64).encode("tosys/carryover/coas/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),type:"POST",params:e,showMsg:!1,callback:function(e){0==e.flag&&Core.alert({message:e.errorMsg}),1==e.flag&&setCloseAlertTimeOneSecond(),ComboBoxSources.load("chartOfAccounts"),$.addTab({title:"科目设置",url:"page/modules/fms/chartOfAccountMgt.html",reload:!0})},failure:function(e){}}):Core.alert({message:"您并没有修改任何科目信息。"}))},this.bind=function(){$("#computeBalanceBtn").on({click:me.computeBalance}),$("#submitAllBtn").on({click:me.submitAll}),$("#importCOA").on({click:function(){$("#coamgt-attachment").html(""),$("#coamgt-modal").modal("show"),$("#coamgt-attachment").fileuploader({url:_global_settings.service.url+"/common/importxlscoa/"+currentUserInfo.id})}}),$("#coamgt-modal").find(".glyphicon-remove").on({click:function(){$.each(chartOfAccountMgt.coaType,function(e,a){$("#"+chartOfAccountMgt.coaType[e]+"Grid").jqxGrid("updatebounddata","cells")})}}),$.each(chartOfAccountMgt.coaType,function(e,a){$("#addCoaSubmitBtn"+a).on({click:function(){me.add(a)}}),$("#editCoaSubmitBtn"+a).on({click:function(){me.edit(a)}})})},this.unbindAll=function(){$("#computeBalanceBtn").off("click"),$("#submitAllBtn").off("click"),$.each(chartOfAccountMgt.coaType,function(e,a){$("#addCoaSubmitBtn"+a).off("click"),$("#editCoaSubmitBtn"+a).off("click")})}};