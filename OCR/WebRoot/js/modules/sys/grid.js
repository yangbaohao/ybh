!function(){timeOut(function(){(new t).init()});var e=function(){return{name:"",type:"",price:"",weight:"",length:"",color:"",number:"",cost:"",inventory:"",photo:"",saletotal:""}},t=function(){var t=this,n=$("#grid");t.init=function(){t.initGrid(),t.loadEvent(),t.initBox(),t.dataBind(),t.returnFunc(),t.callBacks(),t.callBacks1(),t.imgSuoFang(),t.ajaxDeferred(),t.money(),$("#grid_comboBox").comboBox({source:["上海","北京","苏州","nanjing"],displayMember:"name",valueMember:"name",width:200}),$("#grid_input").on("keyup",function(e){var t=$(this).val(),n=/[ ]+/;n.test(t)&&(t=t.replace(n,""),$(this).val(t))})};var i=function(){return{x:"aaa"}},o=function(){return{x:"bbb"}},a=function(){return{x:"ccc"}};t.money=function(){var e=2.222;e=e.toFixed(2)};t.swhen=function(){$.when(i(),o(),a()).then(function(e,t){}).fail(function(){})};!function(){$.ajax({type:"get",url:"js/modules/sys/source.txt"})}();(function(){}).call(function(){},"test"),t.test=function(){};var r=function(){return[{name:"a",age:10},{name:"b",age:11}]};t.returnFunc=function(){},t.dataBind=function(){var e={datatype:"array",localdata:r()},t=new $.jqx.dataAdapter(e,{loadComplete:function(){for(var e=t.records,n=e.length,i="",o=0;o<n;o++){i+=e[o].age+","}$("#grid_html").html(i)}});t.dataBind()};t.initGrid=function(){var e={datatype:"json",datafields:[{name:"time",type:"date"},{name:"choose",type:"bool"},{name:"id",type:"string"},{name:"name",type:"string"},{name:"type",type:"string"},{name:"price",type:"string"},{name:"weight",type:"string"},{name:"length",type:"string"},{name:"color",type:"string"},{name:"number",type:"string"},{name:"cost",type:"string"},{name:"inventory",type:"string"},{name:"photo",type:"string"},{name:"saletotal",type:"string"}],url:"js/modules/sys/source.txt",type:"get",async:!0,cache:!1},i=new $.jqx.dataAdapter(e,{beforeLoadComplete:function(e,t,n){},loadComplete:function(e){},loadError:function(e,t,n){}});n.jqxGrid({altrows:!0,width:"100%",source:i,columnsresize:!0,enablehover:!0,showstatusbar:!0,statusbarheight:40,showaggregates:!0,pageable:!0,pagesize:20,editable:!0,editmode:"click",selectionmode:"singlecell",autoheight:!0,rowsheight:40,columns:t.setColumns(),columnsheight:40,scrollmode:"deferred",enablebrowserselection:!1,enabletooltips:!0,enableanimations:!1,enabletooltips:!0,rendered:function(e){n.jqxGrid("getcolumnaggregateddata","number",["sum"]).sum},ready:function(){l()}})},t.setColumns=function(){var e=[{text:"时间",datafield:"time",cellsformat:"yyyy-MM-dd"},{text:"选择",datafield:"choose",columntype:"checkbox",enabletooltips:!1,hidden:!1,cellvaluechanging:function(e,t,i,o,a){for(var r=n.jqxGrid("getrows"),d=0;d<r.length;d++)r[d].choose=!1;return!o}},{text:"产品id",datafield:"id",width:"10%",displayfield:"prodName",columntype:"template",createeditor:function(e,t,n){var i=n.width(),o={height:"40px",searchMode:"none",width:i,enableBrowserBoundsDetection:!1,displayMember:"prodName",valueMember:"id",placeHolder:"请选择"};n.comboBox(o)},initeditor:function(e,t,i,o,a){var r=n.jqxGrid("getrowdata",e),d=null==r.id?"":r.id,l=[{id:1,prodName:"北京",_name:"beijing",namepy:"bj"},{id:2,prodName:"上海",_name:"shanghai",namepy:"sh"},{id:3,prodName:"苏州",_name:"suzhou",namepy:"sz"}];i.comboBox({source:l,height:40,width:"auto"}).val(d),timeOut(function(){i.jqxComboBox("open"),i.find("input").eq(0).focus()},0)},geteditorvalue:function(e,t,n){return{label:n.find("input").val(),value:n.val()}}},{text:"名称",datafield:"name",displayfield:"name",width:"10%",enabletooltips:!1,geteditorvalue:function(e,t,n){return n.val()}},{text:"种类",datafield:"type"},{text:"价格",datafield:"price",editable:!0,validation:function(e,t){return!(t<0||t>150)||{result:!1,message:"Quantity should be in the 0-150 interval"}}},{text:"数量",draggable:!1,align:"right",cellsalign:"right",datafield:"number",cellsformat:"f2",minwidth:"5%",aggregates:["sum","min"]},{text:"销售总价",datafield:"saletotal",resizable:!1,editable:!1,width:"8%",hidden:!1,aggregates:["sum"],aggregatesrenderer:function(e){var t=n.jqxGrid("getcolumnaggregateddata","saletotal",["sum"]).sum;t=money(t,2,!0);return'<div style="position:relative;margin:10px 10px 10px 22px;overflow:hidden">总价:'+t+"</div>"}},{text:"采购总价",datafield:"purchasetotal",resizable:!1,editable:!1,width:"8%",hidden:!0,aggregates:["sum"],aggregatesrenderer:function(e){var t=n.jqxGrid("getcolumnaggregateddata","purchasetotal",["sum"]).sum;t=money(t,2,!0);return'<div style="position:relative;margin:10px 10px 10px 22px;overflow:hidden">采购:'+t+"</div>"}},{text:"重量",datafield:"weight",width:"5%",cellsrenderer:function(e,t,n,i,o,a){return $(i).text(2)[0].outerHTML}},{text:"长度",datafield:"length"},{text:"颜色",datafield:"color",width:"5%"},{text:"进价",datafield:"cost",cellclassname:function(e,t,n,i){if(n<1.5)return"redcell"}},{text:"库存",datafield:"inventory"},{text:"图片",datafield:"photo",minwidth:"5%",editable:!1,cellsrenderer:function(e,t,n,i,o,a){}}],t=[{text:"操作",datafield:"operate",editable:!1,align:"center",width:"7%",cellsrenderer:function(e,t,n,i,o,a){return'<div style="text-align: center;padding-top: 8px;"><a class="md-cancel hoverspan del" title="删除"></a><a class=" md-description hoverspan copy" title="复制"></a><a class="md-note-add hoverspan add" title="新增"></a></div>'}},{text:"编号",editable:!1,resizable:!1,aggregatesrenderer:function(e,t,n){return'<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: center;">合计</div>'},datafield:"sequence",width:"3%",cellsrenderer:function(e,t,n,i,o,a){return"<div style='margin:11px auto;text-align:center;'>"+(e+1)+"</div>"}}];return e.unshift(t[1]),e.unshift(t[0]),e},t.loadEvent=function(){n.on("bindingcomplete",function(){}),n.on("columnclick",function(e){var t=e.args;t.column,t.datafield,t.originalEvent}),n.on("click",".del",function(e){var t=n.jqxGrid("getrows");1!=t.length&&Core.confirm({message:"确定要删除？",confirmCallback:function(){var e=n.jqxGrid("getselectedcell").rowindex,i=n.jqxGrid("getrowid",e);n.jqxGrid("deleterow",i);var o={localdata:t,type:"array"},a=new $.jqx.dataAdapter(o,{beforeLoadComplete:function(e,t,n){},loadComplete:function(e){},loadError:function(e,t,n){}});n.jqxGrid({source:a})}})}),n.on("click",".add",function(){var t=(n.jqxGrid("getselectedcell").rowindex,n.jqxGrid("source").records,e());n.jqxGrid("addrow",null,t)}),n.on("click",".copy",function(){var e=n.jqxGrid("getrows"),t=n.jqxGrid("getselectedcell").rowindex,i=n.jqxGrid("getrowdata",t);e.splice(t+1,0,i);var o={localdata:e,type:"array"},a=new $.jqx.dataAdapter(o,{beforeLoadComplete:function(e,t,n){},loadComplete:function(e){},loadError:function(e,t,n){}});n.jqxGrid({source:a})}),n.on("cellbeginedit",function(e){var t=e.args;e.args.datafield,e.args.rowindex,t.value,t.row}),n.on("cellendedit",function(e){var t=e.args,i=t.datafield,o=t.rowindex,a=t.value,r=(t.oldValue,n.jqxGrid("getrowdata",o));["price","number","saletotal","weight","length","cost","inventory"].indexOf(i)>-1&&(r[i]=money(a,2,!0)),l(r);var d=n.jqxGrid("getrowid",o);n.jqxGrid("updaterow",d,r)}),$("#grid_render").off("click").on("click",function(){var e=[{name:"西瓜",type:"小",price:"2.4",weight:"1.8",length:"0.3",color:"红",number:"17",cost:"1.0",inventory:"200",photo:"红色",saletotal:""},{name:"葡萄",type:"中",price:"3.2",weight:"0.6",length:"1.1",color:"黄",number:"30",cost:"1.5",inventory:"150",photo:"黄色",saletotal:""},{name:"柚子",type:"大",price:"2.7",weight:"2.2",length:"2.3",color:"橙",number:"23",cost:"1.1",inventory:"180",photo:"橙色",saletotal:""},{name:"西瓜",type:"小",price:"2.4",weight:"1.8",length:"0.3",color:"红",number:"16",cost:"1.0",inventory:"200",photo:"红色",saletotal:""},{name:"葡萄",type:"中",price:"3.2",weight:"0.6",length:"1.1",color:"黄",number:"30",cost:"1.5",inventory:"150",photo:"黄色",saletotal:""},{name:"柚子",type:"大",price:"2.7",weight:"2.2",length:"2.3",color:"橙",number:"23",cost:"1.1",inventory:"180",photo:"橙色",saletotal:""}],t={localdata:e,type:"array"},i=new $.jqx.dataAdapter(t,{beforeLoadComplete:function(e,t,n){},loadComplete:function(e){},loadError:function(e,t,n){}});n.jqxGrid({source:i})}),$("#grid_saleTotal,#grid_purchaseTotal").off("click").on("click",function(){var e=$(this).attr("id"),t="grid_saleTotal"==e?"saletotal":"purchasetotal";n.jqxGrid("iscolumnvisible",t)?n.jqxGrid("hidecolumn",t):n.jqxGrid("showcolumn",t),n.jqxGrid("setcolumnproperty",t,"editable",!1);for(var i=n.jqxGrid("source").records,o=i.length,a=0;a<o;a++)l(i[a]);n.jqxGrid("refresh"),n.jqxGrid("refreshaggregates")}),$("#grid_getdata").off("click").on("click",function(){for(var e=n.jqxGrid("source").records,t={boundindex:!0,uid:!0,undefined:!0,uniqueid:!0,visibleindex:!0},i=[],o=0;o<e.length;o++){var a={};for(var r in e[o])t[r]||(a[r]=e[o][r]);i.push(a)}for(var o=0;o<i.length;o++){var d=i[o];for(var r in d)n.jqxGrid("iscolumnvisible",r)||delete d[r]}})};var d=[{datafield:["price","number","saletotal"]},{datafield:["cost","number","purchasetotal"]}],l=function(e){for(var e=null==e?n.jqxGrid("getrows"):e,t=d.length,i=0;i<t;i++){var o=d[i].datafield;e[o[2]]=money(e[o[0]]*e[o[1]],2,!0)}};t.setData=function(e){var t=[],i={boundindex:!0,uid:!0,uniqueid:!0,undefined:!0,visibleindex:!0},o=[];if(void 0===e){o=n.jqxGrid("source").records;for(var a=0;a<o.length;a++){var r={};for(var d in o[a])i[d]||(r[d]=o[a][d]);t.push(r)}return t}delete i[void 0],o=e;for(var a=0;a<o.length;a++)for(var d in i)o[a][d]=a;return o},t.initBox=function(){$("#grid_box").jqxComboBox({height:"40px",multiSelect:!0,theme:"energyblue",popupZIndex:-1,searchMode:"none",showArrow:!1,placeHolder:""}),$("#grid_box").find("input").css({width:200}),timeOut(function(){var e=$("#grid_box").attr("aria-owns");$("#"+e).addClass("hide")}),$("#grid_box").on("keyup",function(e){e.preventDefault();var t=$(this);if(t.off("change"),13==e.keyCode){var n=t.find("input").val(),i=t.jqxComboBox("getSelectedItems"),o=[];if(null!=i)for(var a=0;a<i.length;a++)o.push(i[a].value);""!=n&&o.push(n),t.jqxComboBox({source:o}),$("#grid_box").find("input").css({width:200});for(var a=0;a<o.length;a++)t.jqxComboBox("selectIndex",a);c()}})};var c=function(){$("#grid_box").on("change",function(){$("#grid_box").off("change");for(var e=$("#grid_box").jqxComboBox("getSelectedItems"),t=[],n=0;n<e.length;n++)t.push(e[n].value);$("#grid_box").jqxComboBox({source:t}),$("#grid_box").find("input").css({width:200});for(var n=0;n<t.length;n++)$("#grid_box").jqxComboBox("selectIndex",n)})},s=function(e){},u=function(e){};t.callBacks=function(){Core.AjaxRequest({type:"get",showMsg:!1,url:"js/modules/sys/source.txt",callback:function(e){var t=$.Callbacks("once");t.add(u),t.add(s),t.fire(e),t.add(s),t.fire(e)}})};var f=function(){};t.callBacks1=function(){var e=$.Callbacks("once,memory");e.add(f),e.fire("1"),e.add(f),e.fire("2"),e.add(f),e.fire("3"),e.add(f),e.fire("4"),Core.AjaxRequest({type:"get",showMsg:!1,url:"js/modules/sys/source.txt",callback:function(e){var t=$.Callbacks("memory");t.add(u),t.fire(e),t.add(s)}})},t.imgSuoFang=function(){$("#grid_img").on("click",".gridimg",function(e){e.preventDefault();var t=$(this),n=$(window).height(),i=$(window).width(),o=t[0].naturalHeight,a=t[0].naturalWidth,r=t.attr("src");!function(){var e=.6*i,t=function(e){var t=Math.max.call(null,e,o,a);return t>e?e/t:1},d=o*t(e),l=a*t(e);if(d>n){var e=.9*n;d=o*t(e),l=a*t(e)}$("#grid_test_img").attr("src",r).css({width:l,height:d,top:(n-d)/2,left:(i-l)/2}).show()}()});$("#grid_test_img").off("mousewheel").off("mousedown").on({click:function(){$(this).hide()},mousedown:function(e){var t=!0,n=e.clientX,i=e.clientY,o=$(this)[0].offsetLeft,a=$(this)[0].offsetTop;$(this)[0].ondragstart=function(){return!1},$(document).off("mousemove").on("mousemove",function(e){var r=e.clientX-n,d=e.clientY-i;t&&$("#grid_test_img").css({left:o+r,top:a+d})}),$(document).off("mouseup").on("mouseup",function(){t=!1})},mousewheel:function(e){var t=$(this),n=parseFloat(t[0].style.height.replace("px","")),i=parseFloat(t[0].style.width.replace("px","")),o=parseFloat(t.css("left").replace("px","")),a=parseFloat(t.css("top").replace("px","")),r=e.originalEvent.wheelDelta,d=r>0?1.1:.9,l=r>0?-.1:.1,c={left:o+l*i/2+"px",top:a+l*n/2+"px",width:i*d,height:n*d};return t.css(c),!1}})};t.ajaxDeferred=function(){var e=$.Deferred();setTimeout(function(){e.resolve(5)},1e3),e.then(function(e){return 2*e}),e.done(function(e){})};var f=function(){};$("#grid_chufa").on("click",function(){var e=document.createEvent("Event");e.initEvent("build",!0,!0),$("#grid_render")[0].addEventListener("build",f,!1),$("#grid_render")[0].dispatchEvent(e)}),$("#grid_chufa")[0].getData=function(){}}}();