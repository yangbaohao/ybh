var DfuMgt=function(){var e=this,t=_global_settings.service.url+"/user";e.data=$.pk.data,this.indexs=[],this.initInput=function(){$("#selectUserCode").text(e.data.employeeCode),$("#selectUserName").text(e.data.username+"("+e.data.name+")"),e.initGrid(e.searchObj)},this.searchObj={},this.initGrid=function(){var t=Core.AcDataAdapter("decFpUserGrid",e.settings.source,{beforeLoadComplete:function(e){}},e.debug),d={source:t,rendergridrows:function(){return t.recordids},columns:[{text:"用户名",dataField:"loginId",width:"19.6%"},{text:"备注",dataField:"name",width:"19.6%"},{text:"纳税人性质",width:"19.4%",cellsrenderer:function(e,t,d,r,i,s){return'<div style="padding-top:6px">'+getCodeData(s.taxType)+"</div>"}},{text:"增值税率(%)",dataField:"vat",width:"19.4%"},{text:"当前账期",dataField:"mouthDate",width:"19.4%"}],selectionmode:"checkbox",pagesize:20,columnsheight:45};$("#decFpUserGrid").grid(d),$("#decFpUserGrid").on("rowselect",function(t){var d=$("#decFpUserGrid").jqxGrid("getselectedrowindexes");e.indexs=[],$.each(d,function(t,r){void 0!=$("#decFpUserGrid").jqxGrid("getrowdata",d[t])&&void 0!=d[t]&&e.indexs.push(d[t])})}),$("#decFpUserGrid").on("rowunselect",function(t){var d=$("#decFpUserGrid").jqxGrid("getselectedrowindexes");e.indexs=[],$.each(d,function(t,r){void 0!=$("#decFpUserGrid").jqxGrid("getrowdata",d[t])&&void 0!=d[t]&&e.indexs.push(d[t])})})},this.settings={source:{url:t+"/searchusertax/fenpei",data:e.searchObj},grid:{element:"decFpUserGrid"},ajax:{url:t}},this.searchDataInfo=function(){$("#decFpUserGrid").jqxGrid("applyfilters"),$("#decFpUserGrid").jqxGrid("refreshfilterrow"),$("#decFpUserGrid").jqxGrid("clearselection")},this.refreshDataInfo=function(){$("#decFpUserGrid").jqxGrid("updatebounddata","cells"),$("#decFpUserGrid").jqxGrid("clearselection"),$("#decFpUserGrid").jqxGrid("refreshdata")}},DfuBindModle=function(e){var t=_global_settings.service.url+"/common";this.bind=function(){$("#decfpuser-save").on("click",function(){if(0==e.indexs.length)return Core.alert({message:"请选择客户！"}),!1;var d=[];$.each(e.indexs,function(t){var r=$("#decFpUserGrid").jqxGrid("getrowdata",e.indexs[t]),i={};i.id=r.id,i.loginId=r.loginId,i.name=r.name,i.mouthDate=r.mouthDate,d.push(i)}),Core.AjaxRequest({url:t+"/owner/tax/update/"+e.data.username,type:"POST",params:d,async:!1,showMsg:!1,callback:function(){try{setCloseAlertTimeOneSecond(),$.closeTab(),$("#decUserGridMgt").jqxGrid("updatebounddata","cells"),$("#userbMgtGrid").jqxGrid("updatebounddata","cells")}catch(e){}}})})},this.unbindAll=function(){$("#decfpuser-save").off("click")}};