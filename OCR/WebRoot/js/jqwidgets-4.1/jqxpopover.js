!function(e){e.jqx.jqxWidget("jqxPopover","",{}),e.extend(e.jqx._jqxPopover.prototype,{defineInstance:function(){var o={arrowOffsetValue:null,animationType:"fade",position:"bottom",animationOpenDelay:"fast",animationCloseDelay:"fast",autoClose:!0,isModal:!1,height:null,initContent:null,offset:null,rtl:!1,showArrow:!0,showCloseButton:!1,selector:null,title:"",width:null,_toggleElement:null,_popover:null,_popoverTop:0,_popoverLeft:0,_init:!1,_ie8:e.jqx.browser.msie&&8===e.jqx.browser.version,_ie7:e.jqx.browser.msie&&e.jqx.browser.version<8,_left:0,_top:0,events:["open","close"]};e.extend(!0,this,o)},createInstance:function(){var e=this;e._content=e.host.children()},render:function(){var o=this,t=o.element.id;if(o._content.detach(),o._toggleElement=e(o.selector),0===o._toggleElement.length)throw new Error('jqxPopover: Invalid Popover toggler: "'+o.selector+'".');if(null===o._toggleElement)throw new Error("jqxPopover: Missing Popover toggler.");var r=e('<div id="'+t+'" class="'+o.toThemeProperty("jqx-popover")+'"><div class="'+o.toThemeProperty("jqx-popover-arrow")+'"></div><div class="'+o.toThemeProperty("jqx-popover-title")+'"></div><div class="'+o.toThemeProperty("jqx-popover-content")+'"></div></div>');e("body").append(r);var n=o.host.data();o.host.detach(),o.host=r,o.host.data(n),o.element=r[0],o.element.id=t,o._popover=e("#"+t);var i=o._popover.find(".jqx-popover-title");i.append(o.title);var s=o._popover.find(".jqx-popover-content");if(s.append(o._content),o._popover.hide(),o._removeHandlers(),o._addHandlers(),o._popover.addClass(o.position),i.addClass(o.toThemeProperty("jqx-widget-header")),o._popover.addClass(o.toThemeProperty("jqx-widget jqx-widget-content jqx-rc-all")),o.showArrow&&o._popover.addClass(o.toThemeProperty("jqx-popover-arrow-"+o.position)),o.rtl&&(i.addClass(o.toThemeProperty("jqx-rtl")),i.css("direction","rtl"),s.css("direction","rtl")),o.showCloseButton){var p=e('<div class="'+this.toThemeProperty("jqx-window-close-button-background")+'"></div>'),a=e('<div style="width: 100%; height: 100%;" class="'+this.toThemeProperty("jqx-window-close-button")+" "+this.toThemeProperty("jqx- md-cancel  ")+'"></div>');p.append(a),i.append(p),i.css("min-height","16px"),p.addClass(o.toThemeProperty("jqx-popover-close-button")),o.closeButton=a,o.rtl&&p.addClass(o.toThemeProperty("jqx-popover-close-button-rtl"))}if(o.arrowOffsetValue)if("bottom"==o.position||"top"==o.position){var l=o._popover.find(".jqx-popover-arrow").css("margin-left");o._popover.find(".jqx-popover-arrow").css("margin-left",parseInt(l)+o.arrowOffsetValue)}else{var d=o._popover.find(".jqx-popover-arrow").css("margin-top");o._popover.find(".jqx-popover-arrow").css("margin-top",parseInt(d)+o.arrowOffsetValue)}(o.width||o.height)&&(o._popover.css("width",o.width),o._popover.css("height",o.height))},refresh:function(e){this.render()},destroy:function(){var e=this;0!==e.length&&(e._removeHandlers(),e._popover.remove(),e._removeModalBackground())},propertyChangedHandler:function(e,o,t,r){this.render()},_stickToToggleElement:function(){var e=this;e._popover.css("left","0px"),e._popover.css("top","0px");var o=e._toggleElement,t=o.offset(),r=o.outerHeight(),n=o.outerWidth(),i=e._popover.height(),s=e._popover.width();switch(e.position){case"left":e._popoverTop=t.top-i/2+r/2,e._popoverLeft=t.left-e._popover.outerWidth();break;case"right":e._popoverTop=t.top-i/2+r/2,e._popoverLeft=t.left+n;break;case"top":e._popoverTop=t.top-e._popover.outerHeight(),e._popoverLeft=t.left-s/2+n/2;break;case"bottom":e._popoverTop=t.top+r,e._popoverLeft=t.left-s/2+n/2}var p=e.offset?e.offset.left:0,a=e.offset?e.offset.top:0;e._popover.css("top",a+e._popoverTop),e._popover.css("left",p+e._popoverLeft)},open:function(){function e(){t._popover.show(),t._raiseEvent("0"),t._isOpen=!0}function o(){t.initContent&&!1===t._init&&(t.initContent(),t._init=!0,t._stickToToggleElement())}var t=this;if(t._stickToToggleElement(),!0===t._ie7)return e(),void o();switch(t.animationType){case"fade":t._popover.fadeIn(t.animationOpenDelay,function(){t._raiseEvent("0"),o(),t._isOpen=!0});break;case"none":e(),o()}t._makeModalBackground()},close:function(){function e(){o._popover.hide(),o._raiseEvent("1"),o._isOpen=!1}var o=this;if(o._isOpen){if(!0===o._ie7)return void e();switch(o.animationType){case"fade":o._popover.fadeOut(o.animationCloseDelay,function(){o._raiseEvent("1"),o._isOpen=!1});break;case"none":e()}o._removeModalBackground()}},_raiseEvent:function(o,t){void 0===t&&(t={owner:null});var r=this.events[o];t.owner=this;var n=new e.Event(r);return n.owner=this,n.args=t,n.preventDefault&&n.preventDefault(),this._popover.trigger(n)},_makeModalBackground:function(){var o=this;!0===o.isModal&&(o.modalBackground=e("<div></div>"),o.modalBackground.addClass(this.toThemeProperty("jqx-popover-modal-background")),e(document.body).prepend(o.modalBackground),e(document.body).addClass(o.toThemeProperty("jqx-unselectable")),o.host.addClass(o.toThemeProperty("jqx-selectable")))},_removeModalBackground:function(){var o=this;!0===o.isModal&&void 0!==o.modalBackground&&(o.modalBackground.remove(),e(document.body).removeClass(o.toThemeProperty("jqx-unselectable")),o.host.removeClass(o.toThemeProperty("jqx-selectable")))},_addHandlers:function(){var o=this,t=o.element.id;o.addHandler(e(document),"keydown.jqxPopover"+t,function(e){27==e.keyCode&&o.close()}),o.addHandler(e(document),"click.jqxPopover"+t,function(t){o.closeButton&&t.target==o.closeButton[0]&&o.close(),!0===o.autoClose&&(t.target==o.element||e(t.target).ischildof(o._popover)||o.isModal||o.close())}),o.addHandler(e(window),"resize.jqxPopover"+t,function(e){"none"!=o.element.style.display&&o._stickToToggleElement()}),o.selector&&o.addHandler(o._toggleElement,"click.jqxPopover"+t,function(e){e.stopPropagation(),"none"!=o.host.css("display")?o.close():o.open()})},_removeHandlers:function(){var o=this,t=o.element.id;o.removeHandler(e(document),"click.jqxPopover"+t),o.selector&&o.removeHandler(o._toggleElement,"click.jqxPopover"+t),o.removeHandler(e(document),"keydown.jqxPopover"+t),o.removeHandler(e(window),"resize.jqxPopover"+t)}})}(jqxBaseFramework);