var CpuMgt=function(){var e=this,r=_global_settings.service.url+"/user/search";this.initInput=function(){e.initPage(),e.initGrid(e.searchObj)},this.searchObj={"owe.createDate":{value:[],action:"between"},"owe.regTelephone":{value:[],action:"like"},"owe.loginId":{value:[],action:"like"},"enter.name":{value:[],action:"like"},"enterpriseInfo.name":{value:[],action:"like"}},this.initPage=function(){$("#cpu-show").css("display",""),$("#cpu-time").dropDownlist({source:["请选择","最近一周","最近两周","最近三周","本月","本季度","本年"],theme:"energyblue",width:"100%",height:"34px",selectedIndex:0,dropDownHeight:150}),$("#cpu-sTime").datetimeinput({formatString:"yyyy-MM-dd",width:"100%",height:"34px"}),$("#cpu-eTime").datetimeinput({formatString:"yyyy-MM-dd",width:"100%",height:"34px"}),$("#cpu-time").on("change",function(){setValueById("cpu-time","cpu-sTime","cpu-eTime")}),$("#cpu-show").addClass("hiddendiv")},this.initGrid=function(){e.settings.source.data=e.searchObj;var r=Core.AcDataAdapter("coopUserGrid",e.settings.source,{beforeLoadComplete:function(e){}},e.debug),a={source:r,rendergridrows:function(){return r.recordids},columns:[{text:"注册日期",width:"16.5%",cellsrenderer:function(e,r,a,i,t,s){return'<div class="agrid">'+s.enrtyDate.substring(0,10)+"</div>"}},{text:"用户名",width:"16.5%",cellsrenderer:function(e,r,a,i,t,s){var n='<div class="agrid">';return(n+='<a class="hoverspan viewCpu">'+s.username+"</a>")+"</div>"}},{text:"电话号码",dataField:"telephone",width:"16.5%"},{text:"公司名称",dataField:"name",width:"16.5%"},{text:"合作商编码",dataField:"partnerCode",width:"17%"},{text:"合作商名称",dataField:"partnarName",width:"17%"}],pagesize:20,columnsheight:45};$("#coopUserGrid").grid(a),$("#coopUserGrid").on("click",".viewCpu",function(){var e=$("#coopUserGrid").jqxGrid("getselectedrowindex");if(e>=0){var r=$("#coopUserGrid").jqxGrid("getrowdata",e);$.addTab({title:"浏览历史",pk:{id:r.id,username:r.username,name:r.name},url:"page/modules/user/viewUserMoreVisit.html",reload:!0})}})},this.settings={source:{url:r+"/partnerCode",data:e.searchObj},grid:{element:"coopUserGrid"},ajax:{url:r}},this.searchDataInfo=function(){$("#coopUserGrid").jqxGrid("applyfilters"),$("#coopUserGrid").jqxGrid("refreshfilterrow"),$("#coopUserGrid").jqxGrid("clearselection")},this.refreshDataInfo=function(){$("#coopUserGrid").jqxGrid("updatebounddata","cells"),$("#coopUserGrid").jqxGrid("clearselection"),$("#coopUserGrid").jqxGrid("refreshdata")}},CpuBindModle=function(e){var r=this;_global_settings.service.url;this.search=function(){var r=$("#cpu-sTime").val(),a=$("#cpu-eTime").val(),i=$("#cpu-user").val(),t=$("#cpu-phone").val(),s=$("#cpu-company").val(),n=$("#cpu-agent").val();e.searchObj["owe.createDate"].value=[],""!=r&&""!=a&&e.searchObj["owe.createDate"].value.push(r+" 00:00:00",a+" 23:59:59"),""!=r&&""===a&&e.searchObj["owe.createDate"].value.push(r+" 00:00:00"),e.searchObj["owe.createDate"].value.action="ge",""===r&&""!=a&&e.searchObj["owe.createDate"].value.push(a+" 23:59:59"),e.searchObj["owe.createDate"].value.action="le",e.searchObj["owe.loginId"].value=[],""!=i&&e.searchObj["owe.loginId"].value.push(i),e.searchObj["owe.regTelephone"].value=[],""!=t&&e.searchObj["owe.regTelephone"].value.push(t),e.searchObj["enterpriseInfo.name"].value=[],""!=s&&e.searchObj["enterpriseInfo.name"].value.push(s),e.searchObj["enter.name"].value=[],""!=n&&e.searchObj["enter.name"].value.push(n),e.searchDataInfo()},this.bind=function(){$("#cpu-search").on("click",function(){$("#cpu-show").is(":hidden")?$("#cpu-show").slideDown("slow"):r.search()}),hiddenAclick()},this.unbindAll=function(){$("#cpu-search").off("click")}};