!function(t,e){t.fn.monthpicker=function(e){var i=function(){return!1};t(this).on({keypress:i,keydown:i,paste:i});var n=t(this).offset().top+parseFloat(t(this).css("height").replace("px","")),o=t(this).offset().left,s=(new Date).getFullYear(),r=t(this);void 0===e.callback||function(){var t=(new Date).getMonth()+1;t=1==t.toString().length?"0"+t:t,r.attr("value",s+"-"+t)}();for(var h=[],a=0;a<40;a++)h[a]=s-a;var c=e.months||["01","02","03","04","05","06","07","08","09","10","11","12"],l=e.years||h,p=function(e){this._el=t(e),this._init(),this._render(),this._renderYears(),this._renderMonths(),this._bind()};p.prototype={destroy:function(){this._el.off("click"),this._yearsSelect.off("click"),this._container.off("click"),t(document).off("click",t.proxy(this._hide,this)),this._container.remove()},_init:function(){this._el.html(l[0]+"-"+c[0]),this._el.data("monthpicker",this)},_bind:function(){this._el.on("click",t.proxy(this._show,this)),t(document).on("click",t.proxy(this._hide,this)),this._yearsSelect.on("click",function(t){t.stopPropagation()}),this._container.on("click","button",t.proxy(this._selectMonth,this))},_show:function(t){t.preventDefault(),t.stopPropagation(),this._container.css("display","inline-block")},_hide:function(){this._container.css("display","none")},_selectMonth:function(i){var n=t(i.target).data("value"),o=c[n],s=this._yearsSelect.val();if("text"==this._el.attr("type")){var r=this._el.val();if(this._el.val(s+"-"+o),r!=s+"-"+o){var i=t.Event("change");this._el.trigger(i,s+"-"+o)}}else{var r=this._el.html();if(this._el.html(s+"-"+o),r!=s+"-"+o){var i=t.Event("change");this._el.trigger(i,s+"-"+o)}}e.onMonthSelect&&e.onMonthSelect(n,s)},_render:function(){var e=(this._el.position(),{display:"none",position:"absolute",top:n,left:o});this._id=(new Date).valueOf(),this._container=t('<div class="monthpicker" id="monthpicker-'+this._id+'">').css(e).appendTo(t("body"))},_renderYears:function(){var e=t.map(l,function(t){return"<option>"+t+"</option>"}),i=t('<div class="years">').appendTo(this._container);this._yearsSelect=t("<select>").html(e.join("")).appendTo(i)},_renderMonths:function(){var e=["<table>","<tr>"];t.each(c,function(t,i){t>0&&t%4==0&&(e.push("</tr>"),e.push("<tr>")),e.push('<td><button data-value="'+t+'">'+i+"</button></td>")}),e.push("</tr>"),e.push("</table>"),this._container.append(e.join(""))}};var _={destroy:function(){var t=this.data("monthpicker");return t&&t.destroy(),this}};return _[e]?_[e].apply(this,Array.prototype.slice.call(arguments,1)):"object"!=typeof e&&e?void t.error("Method "+e+" does not exist on monthpicker"):this.each(function(){return new p(this)})}}(jQuery);