var MesSendMgt=function(){var e=this;this.id=null;var t=_global_settings.service.url+"/shortmessage";this.chooseData=null,this.chooseIndex=[],this.initInput=function(){e.id=$.pk.id,e.initSearch(),e.initGrid(e.searchObj)},this.settings={source:{url:t+"/nosend/"+$.pk.id,data:e.searchObj},grid:{element:"mesSendGrid"},ajax:{url:t}},this.initGrid=function(){var t=Core.AcDataAdapter("mesSendGrid",e.settings.source,{beforeLoadComplete:function(e){}},!1),d={source:t,rendergridrows:function(){return t.recordids},columns:[{text:"导入时间",width:"19.6%",cellsrenderer:function(e,t,d,i,n,s){return'<div class="agrid">'+s.createDate.substring(0,10)+"</div>"}},{text:"主题",width:"19.6%",cellsrenderer:function(e,t,d,i,n,s){var r='<div class="agrid">';return(r+='<a class="hoverspan custViewMes" data-index="'+e+'">'+s.batchNum+"</a>")+"</div>"}},{text:"数量",dataField:"num",width:"19.4%"},{text:"备注",dataField:"remark",width:"19.4%"},{text:"状态",width:"19.4%",cellsrenderer:function(e,t,d,i,n,s){return'<div class="agrid">'+getCodeData(s.status)+"</div>"}}],enablehover:!1,selectionmode:"checkbox",pagesize:20,columnsheight:45};$("#mesSendGrid").grid(d),$("#mesSendGrid").on("click",".custViewMes",function(){var e=$(this).attr("data-index");if(e>=0){var t=$("#mesSendGrid").jqxGrid("getrowdata",e);$.addTab({title:"查看客户",isFrame:!1,url:"page/modules/buso/viewCust.html",pk:{batchNum:t.batchNum,date:t.createDate},reload:!0})}}),$("#mesSendGrid").on("rowselect",function(t){var d=$("#mesSendGrid").jqxGrid("getselectedrowindexes");if(e.chooseIndex=[],$.each(d,function(t,i){void 0!=$("#mesSendGrid").jqxGrid("getrowdata",d[t])&&void 0!=d[t]&&e.chooseIndex.push(d[t])}),1==d.length){var i=$("#mesSendGrid").jqxGrid("getrowdata",d[0]);$("#mesSend-zt").text(i.batchNum),e.chooseData=i}else $("#mesSend-zt").text(""),e.chooseData=null}),$("#mesSendGrid").on("rowunselect",function(){var t=$("#mesSendGrid").jqxGrid("getselectedrowindexes");if(e.chooseIndex=[],$.each(t,function(d,i){void 0!=$("#mesSendGrid").jqxGrid("getrowdata",t[d])&&void 0!=t[d]&&e.chooseIndex.push(t[d])}),1==t.length){var d=$("#mesSendGrid").jqxGrid("getrowdata",t[0]);$("#mesSend-zt").text(d.batchNum),e.chooseData=d}else $("#mesSend-zt").text(""),e.chooseData=null})},this.searchObj={},this.initSearch=function(){e.searchObj={}}},MesSendBindModle=function(e){var t=_global_settings.service.url+"/shortmessage";this.bind=function(){$("#mesSend-send").on("click",function(){if(0==e.chooseIndex.length||e.chooseIndex.length>1)return Core.alert({message:"请选择一个主题！"}),!1;$("#mesSend-send").attr("disabled",!0),setTimeout(function(){$("#mesSend-send").removeAttr("disabled")},2e3),Core.AjaxRequest({type:"GET",url:t+"/sendmessage/"+e.id+"/"+e.chooseData.batchNum,async:!1,callback:function(){$("#mesSend-zt").text(""),$("#mesSendGrid").jqxGrid("updatebounddata","cells"),$("#mesSendGrid").jqxGrid("clearselection");try{$("#mesMgtGrid").jqxGrid("updatebounddata","cells")}catch(e){}},failure:function(){}})})},this.unbindAll=function(){$("#mesSend-send").off("click")}};