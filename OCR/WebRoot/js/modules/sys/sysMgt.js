var UserMgt=function(){var e=this;this.debug=!1,this.id=null,this.boolean=!1,this.sudata=null;this.autoAddStaffNum=null;this.searchObj={},this.initInput=function(){e.initSearch(),e.initGrid(e.searchObj),e.initWindows(),e.initValidator(),e.userNameJudge()},this.initSearch=function(){e.searchObj={username:{value:[],action:"like"},"userInfo.name":{value:[],action:"like"},"role.roleNameCN":{value:[],action:"like"},"userInfo.telephone":{value:[],action:"like"}}},this.userNameJudge=function(){$("#add-username").on("blur",function(){var t=$("#add-username").val();""!=t&&Core.AjaxRequest({url:_global_settings.service.url+"/user/repeat/"+t,type:"GET",async:!1,callback:function(t){e.boolean=t,t&&Core.alert({message:"用户名不能重复！"})}})})},this.initWindows=function(){$("#"+e.settings.addWin.element).jqxWindow({theme:currentTheme,isModal:!0,autoOpen:!1,maxHeight:1e3,minHeight:420,height:"auto",minWidth:500,cancelButton:$("#cancelAddUserBtn"),initContent:function(){$("#add-salutation").dropDownlist({source:["男","女"],width:"100%"})}}).on({open:function(){e.autoAddStaffCode(),$("#add-userid").val(""),$("#add-password").val(""),$("#add-passwordcheck").val(""),$("#add-username").val(""),$("#add-name").val(""),$("#add-email").val(""),$("#add-telephone").val(""),$("#add-title").val(""),$("#add-mobile").val(""),$("#add-salutation").jqxDropDownList({selectedIndex:0}),$("#add-employeeCode").val(e.autoAddStaffNum)}}),$("#editUserWin").jqxWindow({theme:currentTheme,isModal:!0,autoOpen:!1,showCollapseButton:!1,maxWidth:"100%",minHeight:200,minWidth:500,resizable:!0,cancelButton:$("#cancelEditUserBtn"),initContent:function(){$("#edit-locked").dropDownlist({source:{true:"是",false:"否"},selectedIndex:0,width:"100%"}),$("#editInfo-salutation").dropDownlist({source:["男","女"],width:"100%"})}}).on({open:function(){var t=$("#"+e.settings.grid.element).jqxGrid("getselectedrowindex");if(t>=0){var i=$("#"+e.settings.grid.element).jqxGrid("getrowdata",t);$("#edit-id").val(i.userid),$("#edit-username").text(i.username),$("#edit-locked").jqxDropDownList("selectItem",i.locked),$("#editInfo-salutation").val(i.salutation)}else Core.alert({message:"请选择一项！"}),$("#"+e.settings.editWin.element).jqxWindow("close")}}),$("#editUserInfoWin").jqxWindow({theme:currentTheme,isModal:!0,autoOpen:!1,showCollapseButton:!1,maxWidth:"100%",minHeight:200,minWidth:500,resizable:!0,cancelButton:$("#canceleditUserInfoBtn"),initContent:function(){}}).on({open:function(){},close:function(){$("#editInfo-username").val(""),$("#editInfo-employeeCode").val(""),$("#editInfo-name").val(""),$("#editInfo-password").val(""),$("#editInfo-passwordcheck").val(""),$("#editInfo-mobile").val(""),$("#editInfo-email").val(""),$("#editInfo-title").val("")}}),$("#editRoleGridHtml").jqxWindow({theme:currentTheme,isModal:!0,autoOpen:!1,showCollapseButton:!1,minHeight:500,minWidth:500,resizable:!0,cancelButton:$("#cancelEditRoleBtn_user"),initContent:function(){}}).on({}),$("#editEmpWin").jqxWindow({theme:currentTheme,isModal:!0,autoOpen:!1,showCollapseButton:!1,minHeight:260,minWidth:500,resizable:!0,cancelButton:$("#cancelEditEmpBtn"),initContent:function(){}}).on({}),$("#editUserInfoWin, #disabled_user, #editRoleGridHtml, #addUserWin, #editEmpWin").center(),$(window).on("resize",function(){$("#editUserInfoWin, #disabled_user, #editRoleGridHtml, #addUserWin, #editEmpWin").center({transition:0})})},this.initValidator=function(){$("#addUserWin").jqxValidator({hintType:"label",animationDuration:1,rules:[{input:"#add-password",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#add-password",message:"密码长度应为6-20位",action:"keyup, blur",rule:function(e,t){var i=e.val();return!(i.length<6||i.length>20)}},{input:"#add-username",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#add-username",message:"只能是数字,字母,下划线。下划线不能开头或结尾",action:"keyup, blur",rule:function(e,t){var i=e.val(),n=new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（） &;|{}【】‘；：”“'。，、？一-龥]");return 0!==i.indexOf("_")&&i.indexOf("_")!==i.length-1&&!n.test(e.val())}},{input:"#add-passwordcheck",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#add-passwordcheck",message:"两次密码不一致",action:"keyup, blur",rule:function(e,t){return e.val()===$("#add-password").val()}},{input:"#add-name",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#add-mobile",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#add-mobile",message:"手机号码格式不正确",action:"keyup, blur",rule:function(e,t){if(""!==e.val()){return/^1(3|4|5|7|8)\d{9}$/.test(e.val())}return!0}},{input:"#add-email",message:"邮箱格式不正确",action:"keyup, blur",rule:function(e,t){if(""!==e.val()){return/[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+\/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(e.val())}return!0}}]}),$("#editUserInfoWin").jqxValidator({hintType:"label",animationDuration:1,rules:[{input:"#editInfo-password",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#editInfo-password",message:"密码长度应为6-20位",action:"keyup, blur",rule:function(e,t){var i=e.val();return!(i.length<6||i.length>20)}},{input:"#editInfo-passwordcheck",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#editInfo-passwordcheck",message:"两次密码不一致",action:"keyup, blur",rule:function(e,t){return e.val()===$("#editInfo-password").val()}},{input:"#editInfo-name",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#editInfo-mobile",message:"不能为空",action:"keyup, blur",rule:"required"},{input:"#editInfo-email",message:"邮箱格式不正确",action:"keyup, blur",rule:function(e,t){if(""!==e.val()){return/[\w!#$%&'*+\/=?^_`{|}~-]+(?:\.[\w!#$%&'*+\/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(e.val())}return!0}}]})},this.searchDataInfo=function(t){var i=void 0===t?e.settings.grid.element:t;$("#"+i).jqxGrid("applyfilters"),$("#"+i).jqxGrid("refreshfilterrow"),$("#"+i).jqxGrid("clearselection")},this.refreshDataInfo=function(t){var i=void 0===t?e.settings.grid.element:t;$("#"+i).jqxGrid("updatebounddata","cells"),$("#"+i).jqxGrid("clearselection")},this.initOperation=function(){},this.initGrid=function(){e.settings.source.data=e.searchObj;var i=Core.AcDataAdapter(e.settings.grid.element,e.settings.source,{beforeLoadComplete:function(e){}},e.debug),n={source:i,rendergridrows:function(){return i.recordids},columns:[{text:" 员工编号",dataField:"userNumber",width:"11%"},{text:"用户名",dataField:"username",width:"11%",cellsrenderer:function(e,t,i,n,a,r){var o='<div class="agrid">';return"salesManage"==r.roleName||"customerManage"==r.roleName||"secondLevelSalesManage"==r.roleName||"secondLevelCustomerManage"==r.roleName?o+='<a class="hoverspan viewUserDetail" title="查看详情">'+r.username+"</a>":o+=r.username,o+="</div>"}},{text:"姓名",dataField:"name",width:"11%"},{text:"手机号码",dataField:"telephone",width:"11%"},{text:"角色",dataField:"roleNameCN",width:"11%"},{text:"是否禁用",dataField:"locked",width:"11%",cellsrenderer:codeRender},{text:"创建人",dataField:"createBy",width:"11%"},{text:"创建日期",dataField:"createDate",width:"11%",cellsrenderer:function(e,t,i,n,a,r){return'<div class="agrid">'+r.createDate.substring(0,10)+"</div>"}},{text:"操作",align:"center",width:"12%",cellsrenderer:function(e,t,i,n,a,r){var o='<div style="text-align: center;">';return"salesManage"!=r.roleName&&"customerManage"!=r.roleName&&"secondLevelSalesManage"!=r.roleName&&"secondLevelCustomerManage"!=r.roleName||(o+='<a class="md-account-circle editEmp" title="分配员工"></a>'),o+='<a class="md-format-list-bulleted AddRoleBtn" title="分配角色"></a>',o+='<a class="md-mode-edit editUserInfoBtn" title="编辑"></a>',o+='<a class="md-error editUserBtn" title="禁用"></a>',o+="</div>"}}],pagesizeoptions:[2,5,10],columnsheight:e.settings.grid.columnsheight,pagesize:e.settings.grid.pagesize,columnsheight:45};$("#"+e.settings.grid.element).grid(n),$("#userGrid").on("click",".editEmp",function(){var i=$("#userGrid").jqxGrid("getselectedrowindex"),n=$("#userGrid").jqxGrid("getrowdata",i);e.sudata=n,$("#editEmpWin").jqxWindow("open",function(){$("#editemp-name").text(n.username),t("salesManage"==n.roleName?"sales":"customerManage"==n.roleName?"customer":"secondLevelSalesManage"==n.roleName?"secondLevelSalesManage":"secondLevelCustomerManage")})}),$("#userGrid").on("click",".viewUserDetail",function(){var e=$("#userGrid").jqxGrid("getselectedrowindex");if(e>=0){var t=$("#userGrid").jqxGrid("getrowdata",e);$.addTab({title:"分配详情",url:"page/modules/sys/viewUserd.html",pk:{data:t},reload:!0})}})};var t=function(e){Core.AjaxRequest({url:_global_settings.service.url+"/common/manage/"+e,type:"GET",showMsg:!1,async:!1,callback:function(e){$("#editemp-emp").dropDownlist({theme:currentTheme,source:e,searchMode:"contains",displayMember:"username",valueMember:"id",height:34,width:"100%",checkboxes:!0,placeHolder:""})}})},i=_global_settings.service.url;this.settings={source:{datafields:[{name:"userid",type:"number"},{name:"useInfoid",type:"number"},{name:"createBy",type:"string"},{name:"createDate",map:"createDate"},{name:"locked",type:"boolean"},{name:"name",type:"string"},{name:"telephone",type:"string"},{name:"email",type:"string"},{name:"username",type:"string"},{name:"roleName",type:"string"},{name:"roleNameCN",type:"string"},{name:"employeeCode",type:"string"},{name:"userNumber",type:"string"}],data:e.searchObj,url:i+"/user/search"},grid:{element:"userGrid"},addWin:{element:"addUserWin"},editWin:{element:"editUserWin"},addForm:{element:"addUserForm"},editForm:{element:"editUserForm"},ajax:{url:i}},this.autoAddStaffCode=function(){Core.AjaxRequest({url:i+"/salesagent/getcode/usercode",type:"GET",async:!1,dataType:"text",showMsg:!1,callback:function(t){e.autoAddStaffNum=t},failure:function(e){Core.alert({message:"您的网络似乎不太稳定，请刷新页面！"})}})}},UserBindModle=function(e){var t,i,n=this,a=_global_settings.service.url;this.popupAddWin=function(){$("#"+e.settings.addWin.element).jqxWindow("open",function(){})},this.popupEditWin=function(){$("#"+e.settings.grid.element).jqxGrid("getselectedrowindex")>=0?$("#"+e.settings.editWin.element).jqxWindow("open"):Core.alert({message:"请选择一项！"})},this.popupEditeditRoleGrid=function(){var e={datatype:"json",datafields:[{name:"id",type:"float"},{name:"roleNameCN",type:"string"},{name:"description",type:"string"}],url:a+"/role/"},t=new $.jqx.dataAdapter(e);$("#editRoleGrid").jqxGrid({localization:gridLocalizationObj,width:"100%",autoheight:!0,source:t,sortable:!0,filterable:!0,pageable:!0,ready:function(){$("#editRoleGrid").on("rowselect rowunselect",function(e){roleList=[];var t=$("#editRoleGrid").jqxGrid("getselectedrowindexes");for(var i in t)if(t.hasOwnProperty(i))try{var n=$("#editRoleGrid").jqxGrid("getrowdatabyid",parseInt(t[i]));roleList[i]={id:n.id,roleName:n.roleName,available:!1}}catch(e){}})},selectionmode:"checkbox",altrows:!0,columns:[{text:"角色名称",dataField:"roleNameCN",width:"46%"},{text:"角色描述",dataField:"description",width:"46%"}]}),$("#editRoleGridHtml").jqxWindow("open")},this.addSubmit=function(t){return e.boolean?(Core.alert({message:"用户名不能重复！"}),!1):($("#addUserWin").jqxValidator("validate")&&Core.AjaxRequest({url:a+"/user",type:"POST",async:!1,params:t,showMsg:!1,callback:function(t){t&&(setCloseAlertTimeOneSecond(),e.initOperation(),e.refreshDataInfo(),$("#addUserWin").jqxWindow("close",function(){$("#add-employeeCode").val("")}))},failure:function(e){Core.alert({message:e.responseJSON.errorMsg})}}),!1)},this.initAddParam=function(){var e=$("#add-username").val(),t=$("#add-employeeCode").val(),i=$("#add-password").val(),n=$("#add-name").val();return{employeeCode:t,password:i,username:e,roles:[],locked:!1,userInfo:{email:$("#add-email").val(),name:n,salutation:$("#add-salutation").val(),telephone:$("#add-mobile").val(),title:$("#add-title").val(),type:"person"}}},this.editInfoSubmit=function(t){return $("#editUserInfoWin").jqxValidator("validate")&&Core.AjaxRequest({url:a+"/user",type:"PUT",async:!1,params:t,showMsg:!1,callback:function(t){t&&(setCloseAlertTimeOneSecond(),e.initOperation(),e.refreshDataInfo(),$("#editUserInfoWin").jqxWindow("close"))},failure:function(e){Core.alert({message:e.responseJSON.errorMsg})}}),!1},this.initEditInfoParam=function(e){var t=$("#editInfo-username").val(),i=$("#editInfo-employeeCode").val(),n=$("#editInfo-password").val(),a=$("#editInfo-name").val();return{employeeCode:i,password:n,id:e,username:t,roles:[],locked:!1,userInfo:{email:$("#editInfo-email").val(),name:a,salutation:$("#editInfo-salutation").val(),telephone:$("#editInfo-mobile").val(),title:$("#editInfo-title").val(),type:"person"}}},this.disabledUser=function(){var t=$("#edit-id").val(),i=$("#edit-locked").val();Core.AjaxRequest({url:a+"/user/lock/"+t+"/"+i,type:"PUT",async:!1,showMsg:!1,callback:function(t){setCloseAlertTimeOneSecond(),e.initOperation(),e.refreshDataInfo(),$("#editUserWin").jqxWindow("close")},failure:function(e){}})},this.remove=function(){var t=$("#"+e.settings.grid.element).jqxGrid("getselectedrowindex");if(t>=0){var i=$("#"+e.settings.grid.element).jqxGrid("getrowdata",t);Core.confirm({message:"确定要删除？",confirmCallback:function(){Core.AjaxRequest({url:a+"/user/"+i.id,type:"DELETE",async:!1,dataType:e.settings.ajax.dataType,callback:function(t){e.initOperation(),e.refreshDataInfo()},failure:function(e){}})}})}else Core.alert({message:"请选择一项！"})},this.search=function(t){var i=$("#search-username").val();if(e.searchObj.username.value=[],""!=i&&e.searchObj.username.value.push(i),t)return e.searchObj;e.searchDataInfo()},this.bind=function(){$("#userGrid").off("click",".editUserInfoBtn").on("click",".editUserInfoBtn",function(){var t=$("#userGrid").jqxGrid("getselectedrowindex"),i=$("#userGrid").jqxGrid("getrowdata",t);e.id=i.userid,$("#editUserInfoWin").jqxWindow("open",function(){$("#editInfo-username").val(i.username),$("#editInfo-employeeCode").val(i.userNumber),$("#editInfo-name").val(i.name),$("#editInfo-mobile").val(i.telephone),$("#editInfo-email").val(i.email),$("#editInfo-title").val(i.title),$("#editInfo-salutation").dropDownlist({source:["男","女"],width:"100%"}),$("#editInfo-salutation").val(void 0==i.salutation?"":i.salutation)})}),$("#createUserBtn").off("click").on({click:n.popupAddWin}),$("#userGrid").off("click",".editUserBtn").on("click",".editUserBtn",n.popupEditWin),$("#deleteUserBtn").off("click").on({click:n.remove}),$("#addUserSubmitBtn").off("click").on({click:function(){n.addSubmit(n.initAddParam())}}),$("#editUserInfoSubmitBtn").off("click").on("click",function(){n.editInfoSubmit(n.initEditInfoParam(e.id))}),$("#editUserSubmitBtn").off("click").on({click:function(){n.disabledUser()}}),$("#userGrid").off("click",".AddRoleBtn").on("click",".AddRoleBtn",function(){var e=$("#userGrid").jqxGrid("getselectedrowindex");rowdata=$("#userGrid").jqxGrid("getrowdata",e),t=rowdata.userid,i=rowdata.username,0===$("#editRoleGrid").children().length?n.popupEditeditRoleGrid():($("#editRoleGrid").jqxGrid("unselectallrows"),$("#editRoleGridHtml").jqxWindow("open")),Core.AjaxRequest({url:a+"/user/rolebyid/"+t,type:"GET",showMsg:!1,callback:function(e){var t=e,i=$("#contenttableeditRoleGrid").children().length;for(var n in t)for(var a=0;a<i;a++)$("#editRoleGrid").jqxGrid("getcellvalue",a,"id")===t[n]&&$("#editRoleGrid").jqxGrid("selectrow",a)},failure:function(e){}})}),$("#searchUserBtn").off("click").on("click",function(){n.search()}),$("#editRoleSubmitBtn_user").off("click").on("click",function(){if(roleList.length>1)return Core.alert({message:"一个员工只能分配一个角色哦！"}),!1;var n={username:i,id:t,roles:roleList,locked:!1};Core.AjaxRequest({url:a+"/user/byrole/",type:"PUT",params:n,async:!1,showMsg:!1,callback:function(t){try{setCloseAlertTimeOneSecond(),e.refreshDataInfo(),$("#editRoleGridHtml").jqxWindow("close")}catch(e){}}})}),$("#editEmpSaveBtn").on("click",function(){var t=[],i=$("#editemp-emp").jqxDropDownList("getCheckedItems");$.each(i,function(e){var n={};n.id=i[e].originalItem.id,t.push(n)}),Core.AjaxRequest({url:_global_settings.service.url+"/user/gaveup/"+e.sudata.userid,type:"PUT",params:t,async:!1,showMsg:!1,callback:function(){setCloseAlertTimeOneSecond(),$("#editEmpWin").jqxWindow("close",function(){$("#editemp-name").text(""),$("#editemp-emp").jqxDropDownList("uncheckAll")}),$("#userGrid").jqxGrid("updatebounddata","cells")}})}),$("#importUserBtn").on("click",function(){var e={url:a+"/common/import/users/"};$("#sysUserMgt-attachment").html(""),$("#sysUserMgt-modal").modal("show"),$("#sysUserMgt-attachment").fileuploader(e)}),$("#exportUserBtn").on("click",function(){var e=_global_settings.service.url+"/common/export/user/",t={condition:[],filterscount:0,groupscount:0,sortorder:"desc",pagenum:0,pagesize:20},i=n.search(!0),a=[];for(var r in i){var o={};o.key=r,o.value=i[r].value,void 0!=i[r].value&&null!=i[r].value&&""!=i[r].value||(o.value=[]),o.action=i[r].action,void 0!=i[r].value[0]&&""!=i[r].value[0]&&null!=i[r].value[0]&&a.push(o)}t.condition=a,t=(new Base64).encode(JSON.stringify(t)),$.openHref(e+t+"?t="+Math.random())})},this.unbindAll=function(){$("#createUserBtn").off("click"),$("#editUserBtn").off("click"),$("#deleteUserBtn").off("click"),$("#addUserSubmitBtn").off("click"),$("#editUserSubmitBtn").off("click"),$("#searchUserBtn").off("click"),$("#editUserInfoSubmitBtn").off("click"),$("#editEmpSaveBtn").off("click")}};