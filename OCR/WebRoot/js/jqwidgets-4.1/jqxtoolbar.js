!function(o){o.jqx.jqxWidget("jqxToolBar","",{}),o.extend(o.jqx._jqxToolBar.prototype,{defineInstance:function(){var e={width:"100%",minWidth:null,maxWidth:null,height:35,tools:"",initTools:null,minimizeWidth:200,disabled:!1,rtl:!1,events:["open","close"]};o.extend(!0,this,e)},createInstance:function(){var o=this;o._toolToWidgetMapping={button:"jqxButton",toggleButton:"jqxToggleButton",dropdownlist:"jqxDropDownList",combobox:"jqxComboBox",input:"jqxInput"},o._toolChanges=new Array,o.render()},render:function(){var o=this,e=!0;o.host.html(""),o.host.removeClass(o.toThemeProperty("jqx-widget jqx-fill-state-normal jqx-rc-all jqx-toolbar jqx-fill-state-disabled")),o._setSize(),o._destroyTools(!1),o._toolWidgets&&(e=!1,o._minimizeButton.add(o._minimizePopup).remove()),o._appendMinimizeButton(),o._addClasses(),o._createTools(),!0===o.disabled&&(o.host.addClass(o.toThemeProperty("jqx-fill-state-disabled")),o._disableTools(!0)),o._minimize(),o._removeHandlers(),o._addHandlers(),!1===e&&o._toolChanges.length>0&&o._restoreChanges()},refresh:function(o){!0!==o&&this.render()},getTools:function(){return this._toolWidgets},destroy:function(){var o=this;o._removeHandlers(),o._destroyTools(),o.host.remove()},_destroyTools:function(o){var e=this;if(!1!==o&&(o=!0),e._toolWidgets)for(var t=e._toolWidgets.length-1;t>=0;t--)e._destroyTool(t,o)},_destroyTool:function(o,e){var t=this;o=parseInt(o,10);var i=t._toolWidgets[o];if(i){var s=i.type,r=t._getBothTools(i);"custom"!==s?r[t._toolToWidgetMapping[s]]("destroy"):r.remove(),i.menuSeparator&&i.menuSeparator.remove(),t._toolWidgets.splice(o,1),t._checkType(s)&&t._refreshButtonGroups(),t._minimize(),!1!==e&&t._toolChanges.push({action:"destroyTool",index:o})}},destroyTool:function(o){this._destroyTool(o,!0)},addTool:function(o,e,t,i){var s,r,n,a,l=this;s="first"===e?0:l._toolWidgets.length,l._toolWidgets[s-1]&&(r=l._toolWidgets[s-1].tool,n=l._toolWidgets[s-1].separatorAfterWidget?"|":l._toolWidgets[s-1].type),!0===t?a="|":l._toolWidgets[s+1]&&(a=l._toolWidgets[s+1].type);var d=l._initializeTool(s,o,r,n,a,i,!1);"first"===e?l._toolWidgets.splice(0,0,d):l._toolWidgets.push(d),l._removeHandlers(),l._addHandlers(),l._checkType(o)&&l._refreshButtonGroups(),"first"!==e&&l._minimizedTools>0?l._minimizeTool(!0):l._minimize(),l._toolChanges.push({action:"addTool",type:o,position:e,separator:t,initCallback:i})},_disableTools:function(o){for(var e=this,t=0;t<e._toolWidgets.length;t++)e.disableTool(t,o)},disableTool:function(o,e){var t=this;o=parseInt(o,10);var i=t._toolWidgets[o];if(i){var s=i.type,r=t._getBothTools(i);"custom"!==s&&r[t._toolToWidgetMapping[s]]({disabled:e}),t._toolChanges.push({action:"disableTool",index:o,disable:e})}},propertyChangedHandler:function(e,t,i,s){if("initTools"!==t&&s!==i)switch(t){case"theme":""!==i&&(e.host.removeClass("jqx-widget-"+i+" jqx-fill-state-normal-"+i+" jqx-rc-all-"+i+" jqx-toolbar-"+i),e._minimizePopup.removeClass("jqx-popup-"+i+" jqx-fill-state-normal-"+i+" jqx-rc-b-"+i+" jqx-toolbar-minimized-popup-"+i)),e._addClasses(),e._minimizePopup.addClass(e.toThemeProperty("jqx-popup jqx-fill-state-normal jqx-rc-b jqx-toolbar-minimized-popup"));for(var r=0;r<e._toolWidgets.length;r++){var n=e._toolWidgets[r];if("custom"!==n.type){var a=e._getBothTools(n);n.menuTool&&n.menuSeparator&&(n.menuSeparator.removeClass("jqx-fill-state-pressed-"+i+" jqx-toolbar-minimized-popup-separator-"+i),n.menuSeparator.addClass(e.toThemeProperty("jqx-fill-state-pressed jqx-toolbar-minimized-popup-separator"))),a[e._toolToWidgetMapping[e._toolWidgets[r].type]]({theme:s})}}o.jqx.utilities.setTheme(i,s,e.host);break;case"width":e.host.width(s),e._minimize();break;case"minWidth":e.host.css("min-width",s),e._minimize();break;case"maxWidth":e.host.css("max-width",s),e._minimize();break;case"height":e.host.height(s);for(var l=0;l<e._toolWidgets.length;l++){var d=e._toolWidgets[l],m=d.type,p=e._getBothTools(d);"button"===m||"toggleButton"===m||"repeatButton"===m||"linkButton"===m?p.css("height",s):"dropdownlist"!==m&&"combobox"!==m&&"input"!==m||p[e._toolToWidgetMapping[m]]({height:s-2})}break;case"tools":e._removeHandlers(),e._destroyTools(),e._createTools(),e._addHandlers(),e._minimize();break;case"minimizeWidth":if(!0===e._isOpen){var h=parseInt(e._minimizePopup.css("left"),10)-(s-i);e._minimizePopup.css({width:s+"px",left:h+"px"})}else e._minimizePopup.width(s);break;case"rtl":e.render();break;case"disabled":!0===s?(e.host.addClass(e.toThemeProperty("jqx-fill-state-disabled")),e._disableTools(!0)):(e.host.removeClass(e.toThemeProperty("jqx-fill-state-disabled")),e._disableTools(!1))}},_raiseEvent:function(e,t){void 0===t&&(t={owner:null});var i=this.events[e];t.owner=this;var s=new o.Event(i);return s.owner=this,s.args=t,s.preventDefault&&s.preventDefault(),this.host.trigger(s)},_addClasses:function(){var o=this;o.host.addClass(o.toThemeProperty("jqx-widget jqx-fill-state-normal jqx-rc-all jqx-toolbar")),!0===o.rtl&&o.host.addClass(o.toThemeProperty("jqx-toolbar-rtl"))},_checkType:function(o){return"button"===o||"toggleButton"===o||"repeatButton"===o||"linkButton"===o},_refreshButtonGroups:function(){function e(o,e,i,s,r,n){o[e+"Class"](t.toThemeProperty("jqx-toolbar-tool-inner-button")),o[i+"Class"](t.toThemeProperty("jqx-rc-all")),o[s+"Class"](t.toThemeProperty("jqx-rc-l")),o[r+"Class"](t.toThemeProperty("jqx-rc-r")),o.css("border-left-width",n+"px")}var t=this;o.each(t._toolWidgets,function(o,i){if(t._checkType(i.type)){var s,r,n=t._getBothTools(i);o>0&&(s=t._toolWidgets[o-1].separatorAfterWidget?"|":t._toolWidgets[o-1]),i.separatorAfterWidget?r="|":o<t._toolWidgets.length-1&&(r=t._toolWidgets[o+1]);var a=s&&t._checkType(s.type),l=!1===i.separatorAfterWidget&&r&&t._checkType(r.type);a||l?!a&&l?e(n,"remove","remove","add","remove",1):a&&l?e(n,"add","remove","remove","remove",0):a&&!l&&e(n,"remove","remove","remove","add",0):e(n,"remove","add","remove","remove",1);var d=t.rtl?"rtl":"ltr";l?(n.removeClass(t.toThemeProperty("jqx-toolbar-tool-separator-"+d)),n.removeClass(t.toThemeProperty("jqx-toolbar-tool-no-separator-"+d))):i.separatorAfterWidget?(n.removeClass(t.toThemeProperty("jqx-toolbar-tool-no-separator-"+d)),n.addClass(t.toThemeProperty("jqx-toolbar-tool-separator-"+d))):(n.removeClass(t.toThemeProperty("jqx-toolbar-tool-separator-"+d)),n.addClass(t.toThemeProperty("jqx-toolbar-tool-no-separator-"+d)))}})},_addHandlers:function(){var e=this,t=e.element.id;o.jqx.utilities.resize(e.host,function(){if(o.jqx.browser.msie&&o.jqx.browser.version<8&&"string"==typeof e.width&&"%"===e.width.charAt(e.width.length-1)){var t=e.host.parent().width(),i=t*parseFloat(e.width.replace("%",""))/100,s=parseInt(e.host.css("border-left-width"),10)+parseInt(e.host.css("border-right-width"),10)+parseInt(e.host.css("padding-left"),10)+parseInt(e.host.css("padding-right"),10);e.host.css("width",i-s-1)}!0===e._isOpen&&(e._minimizePopup.hide(),e._isOpen=!1,e._raiseEvent("1")),e._minimize()}),e.addHandler(o(document),"click.jqxToolbar"+t,function(){!0===e._isOpen&&e._openMinimizePopup()}),e.addHandler(e._minimizeButton,"click.jqxToolbar"+t,function(o){o.stopPropagation(),e._openMinimizePopup()}),e.addHandler(o(".jqx-popup"),"click.jqxToolbar"+t,function(e){o(e.target).hasClass("jqx-window-content")||e.stopPropagation()})},_removeHandlers:function(){var e=this,t=e.element.id;e.removeHandler(o(document),"click.jqxToolbar"+t),e.removeHandler(e._minimizeButton,"click.jqxToolbar"+t),e.removeHandler(o(".jqx-popup"),"click.jqxToolbar"+t)},_setSize:function(){var o=this;o.host.width(o.width),o.host.height(o.height),o.minWidth&&o.host.css("min-width",o.minWidth),o.maxWidth&&o.host.css("max-width",o.maxWidth)},_createTools:function(){var e=this,t=e.tools.split(" "),i=o.trim(e.tools.replace(/\|/g,""));i=i.replace(/\s+/g," "),i=i.split(" "),e._toolWidgets=new Array;var s=0;o.each(i,function(o,r){i[o]!==t[o+s]&&s++;var n,a=o+s;e._toolWidgets[o-1]&&(n=e._toolWidgets[o-1].tool);var l=t[a],d=t[a-1],m=t[a+1],p=e.initTools;if(""===l)return!0;var h=e._initializeTool(o,l,n,d,m,p,!0);e._toolWidgets.push(h)}),e._minimizePopup.css({display:"none",visibility:"visible"})},_initializeTool:function(e,t,i,s,r,n,a){var l,d,m=this,p=m._initializeWidget(t,l,d,i);l=p.tool,d=p.menuTool;var h=!0;if(l.addClass(m.toThemeProperty("jqx-toolbar-tool")),!0===m.rtl&&l.addClass(m.toThemeProperty("jqx-toolbar-tool-rtl")),m.initTools){var u;u=!0===a?m.initTools(t,e,l,!1):n(t,l,!1),!u||!1!==u.minimizable&&!1!==u.menuTool?(!0===a?m.initTools(t,e,d,!0):n(t,d,!0),d.addClass(m.toThemeProperty("jqx-toolbar-tool-minimized"))):("custom"!==t?d[m._toolToWidgetMapping[t]]("destroy"):d.remove(),!1===u.minimizable&&(h=!1),d=!1)}var _=!1,c=l;d&&(c=c.add(d),d.css("display","none"));var g,T=m.rtl?"rtl":"ltr",x=["button","toggleButton","repeatButton","linkButton"],f={button:"jqxButton",toggleButton:"jqxToggleButton",repeatButton:"jqxRepeatButton",linkButton:"jqxRepeatButton"};return"|"===r?(_=!0,c.addClass(m.toThemeProperty("jqx-toolbar-tool-separator-"+T)),d&&(g=o('<div class="'+m.toThemeProperty("jqx-fill-state-pressed jqx-toolbar-minimized-popup-separator")+'"></div>'),m._minimizePopup.append(g))):(-1===x.indexOf(t)||-1!==x.indexOf(t)&&-1===x.indexOf(r))&&c.addClass(m.toThemeProperty("jqx-toolbar-tool-no-separator-"+T)),-1===x.indexOf(s)&&-1!==x.indexOf(t)&&-1!==x.indexOf(r)?!1===m.rtl?c[f[t]]({roundedCorners:"left"}):(c[f[t]]({roundedCorners:"right"}),c.css("border-left-width",0)):-1!==x.indexOf(s)&&-1!==x.indexOf(t)&&-1!==x.indexOf(r)?(c.addClass(m.toThemeProperty("jqx-toolbar-tool-inner-button")),c.css("border-left-width",0)):-1!==x.indexOf(s)&&-1!==x.indexOf(t)&&-1===x.indexOf(r)&&(!1===m.rtl?(c[f[t]]({roundedCorners:"right"}),c.css("border-left-width",0)):c[f[t]]({roundedCorners:"left"})),o.jqx.browser.msie&&o.jqx.browser.version<8&&"combobox"===t&&c.find(".jqx-combobox-arrow-normal").width(18),{type:t,tool:l,separatorAfterWidget:_,minimizable:h,minimized:!1,menuTool:d,menuSeparator:g}},_initializeWidget:function(e,t,i,s){function r(){i=t.clone(),s?(s.after(t),n._minimizePopup.append(i)):(n.host.prepend(t),n._minimizePopup.prepend(i))}var n=this;if("custom"!==e&&void 0===n.host[n._toolToWidgetMapping[e]]){var a=n._toolToWidgetMapping[e].toLowerCase();throw new Error("jqxToolBar: Missing reference to "+a+".js")}switch(e){case"button":case"toggleButton":t=o("<button></button>"),r(),t.add(i)[n._toolToWidgetMapping[e]]({theme:n.theme,height:n.host.height(),disabled:n.disabled,rtl:n.rtl});break;case"dropdownlist":case"combobox":t=o("<div></div>"),r(),t.add(i)[n._toolToWidgetMapping[e]]({theme:n.theme,autoDropDownHeight:!0,height:n.host.height()-2,disabled:n.disabled,rtl:n.rtl});break;case"input":t=o('<input type="text" />'),r(),t.add(i).jqxInput({theme:n.theme,height:n.host.height()-2,disabled:n.disabled,rtl:n.rtl});break;case"custom":t=o("<div></div>"),r()}return{tool:t,menuTool:i}},_appendMinimizeButton:function(){var e=this;e._minimizedTools=0,e._minimizeButton=o('<div class="'+e.toThemeProperty("jqx-menu-minimized-button jqx-toolbar-minimized-button")+'"></div>'),e._minimizePopup=o('<div id="'+e.element.id+'Popup" class="'+e.toThemeProperty("jqx-popup jqx-fill-state-normal jqx-rc-b jqx-toolbar-minimized-popup")+'"></div>'),!0===e.rtl&&(e._minimizeButton.addClass(e.toThemeProperty("jqx-toolbar-minimized-button-rtl")),e._minimizePopup.addClass(e.toThemeProperty("jqx-toolbar-minimized-popup-rtl"))),e.host.append(e._minimizeButton),o("body").append(e._minimizePopup),e._isOpen=!1,e._minimizePopup.width(e.minimizeWidth)},_openMinimizePopup:function(){var o=this;if(!1===o._isOpen){var e=o.host.offset(),t=e.left;!1===o.rtl&&(t+=o.host.outerWidth()-o._minimizePopup.outerWidth());var i=e.top+o.host.outerHeight()-1;o._minimizePopup.css({left:t,top:i}),o._minimizePopup.slideDown("fast",function(){o._isOpen=!0,o._raiseEvent("0")})}else o._minimizePopup.slideUp("fast"),o._isOpen=!1,o._raiseEvent("1")},_minimize:function(){var o=this,e=0;o._minimizedTools>0&&(e=o._minimizeButton.outerWidth()+parseInt(o._minimizeButton.css("margin-left"),10));var t=o.host.width()-parseInt(o.host.css("padding-left"),10)-parseInt(o.host.css("padding-right"),10)-e;if(!(t<0)){for(var i,s=0,r=0;r<o._toolWidgets.length;r++)if(!1===o._toolWidgets[r].minimized){var n=o._toolWidgets[r].tool.outerWidth(!0);s+=n}else void 0===i&&(i=o._toolWidgets[r].tool.outerWidth(!0));s>t?(o._minimizeTool(!0),o._minimize()):void 0!==i&&s+i<t&&(o._minimizeTool(!1),o._minimize())}},_minimizeTool:function(o){var e,t,i=this;if(!0===o){for(var s=i._toolWidgets.length-1;s>=0;s--)if(e=i._toolWidgets[s],!1!==e.minimizable&&!1===e.minimized){t=i._getToolValue(e.tool,e.type),e.tool[0].style.display="none",e.menuTool&&(e.menuTool.show(),i._setToolValue(t,e.menuTool,e.type)),e.menuSeparator&&e.menuSeparator.show(),i._toolWidgets[s].minimized=!0,i._minimizedTools++,1===i._minimizedTools&&i._minimizeButton.show();break}}else for(var r=0;r<i._toolWidgets.length;r++)if(e=i._toolWidgets[r],!0===e.minimized){e.menuTool&&(t=i._getToolValue(e.menuTool,e.type),e.menuTool.hide()),e.menuSeparator&&e.menuSeparator.hide(),e.tool.show(),e.menuTool&&i._setToolValue(t,e.tool,e.type),i._toolWidgets[r].minimized=!1,i._minimizedTools--,0===i._minimizedTools&&i._minimizeButton.hide();break}},_getToolValue:function(o,e){var t;switch(e){case"button":case"custom":t=void 0;break;case"toggleButton":var i=o.hasClass("jqx-fill-state-pressed");t={text:o.text(),toggled:i};break;case"dropdownlist":case"combobox":t=o[this._toolToWidgetMapping[e]]("getSelectedIndex");break;case"input":t=o.val()}return t},_setToolValue:function(o,e,t){if(void 0!==o)switch(t){case"button":case"custom":break;case"toggleButton":e.text(o.text);e.hasClass("jqx-fill-state-pressed")!==o.toggled&&e.jqxToggleButton("toggle");break;case"dropdownlist":case"combobox":o=e[this._toolToWidgetMapping[t]]("selectIndex",o);break;case"input":e.val(o)}},_restoreChanges:function(){var e=this;o.each(e._toolChanges,function(o,t){"addTool"===t.action?e.addTool(t.type,t.position,t.separator,t.initCallback):"destroyTool"===t.action?e._destroyTool(t.index):"disableTool"===t.action&&e.disableTool(t.index,t.disable)})},_getBothTools:function(o){var e=o.tool;return o.menuTool&&(e=e.add(o.menuTool)),e}})}(jqxBaseFramework);