var swfobject=function(){function e(){if(!T){if(F.ie&&F.win){var e=p("span");try{var t=A.getElementsByTagName("body")[0].appendChild(e);t.parentNode.removeChild(t)}catch(e){return}}T=!0,L&&(clearInterval(L),L=null);for(var a=S.length,n=0;n<a;n++)S[n]()}}function t(e){T?e():S[S.length]=e}function a(e){if(typeof N.addEventListener!=m)N.addEventListener("load",e,!1);else if(typeof A.addEventListener!=m)A.addEventListener("load",e,!1);else if(typeof N.attachEvent!=m)N.attachEvent("onload",e);else if("function"==typeof N.onload){var t=N.onload;N.onload=function(){t(),e()}}else N.onload=e}function n(){for(var e=E.length,t=0;t<e;t++){var a=E[t].id;if(F.pv[0]>0){var n=f(a);n&&(E[t].width=n.getAttribute("width")?n.getAttribute("width"):"0",E[t].height=n.getAttribute("height")?n.getAttribute("height"):"0",u(E[t].swfVersion)?(F.webkit&&F.webkit<312&&i(n),v(a,!0)):E[t].expressInstall&&!O&&u("6.0.65")&&(F.win||F.mac)?o(E[t]):l(n))}else v(a,!0)}}function i(e){var t=e.getElementsByTagName(b)[0];if(t){var a=p("embed"),n=t.attributes;if(n)for(var i=n.length,r=0;r<i;r++)"data"==n[r].nodeName.toLowerCase()?a.setAttribute("src",n[r].nodeValue):a.setAttribute(n[r].nodeName,n[r].nodeValue);var o=t.childNodes;if(o)for(var l=o.length,s=0;s<l;s++)1==o[s].nodeType&&"param"==o[s].nodeName.toLowerCase()&&a.setAttribute(o[s].getAttribute("name"),o[s].getAttribute("value"));e.parentNode.replaceChild(a,e)}}function r(e){F.ie&&F.win&&u("8.0.0")&&N.attachEvent("onunload",function(){var t=f(e);if(t){for(var a in t)"function"==typeof t[a]&&(t[a]=function(){});t.parentNode.removeChild(t)}})}function o(e){O=!0;var t=f(e.id);if(t){if(e.altContentId){var a=f(e.altContentId);a&&(j=a,k=e.altContentId)}else j=s(t);!/%$/.test(e.width)&&parseInt(e.width,10)<310&&(e.width="310"),!/%$/.test(e.height)&&parseInt(e.height,10)<137&&(e.height="137"),A.title=A.title.slice(0,47)+" - Flash Player Installation";var n=F.ie&&F.win?"ActiveX":"PlugIn",i=A.title,r="MMredirectURL="+N.location+"&MMplayerType="+n+"&MMdoctitle="+i,o=e.id;if(F.ie&&F.win&&4!=t.readyState){var l=p("div");o+="SWFObjectNew",l.setAttribute("id",o),t.parentNode.insertBefore(l,t),t.style.display="none",N.attachEvent("onload",function(){t.parentNode.removeChild(t)})}d({data:e.expressInstall,id:C,width:e.width,height:e.height},{flashvars:r},o)}}function l(e){if(F.ie&&F.win&&4!=e.readyState){var t=p("div");e.parentNode.insertBefore(t,e),t.parentNode.replaceChild(s(e),t),e.style.display="none",N.attachEvent("onload",function(){e.parentNode.removeChild(e)})}else e.parentNode.replaceChild(s(e),e)}function s(e){var t=p("div");if(F.win&&F.ie)t.innerHTML=e.innerHTML;else{var a=e.getElementsByTagName(b)[0];if(a){var n=a.childNodes;if(n)for(var i=n.length,r=0;r<i;r++)1==n[r].nodeType&&"param"==n[r].nodeName.toLowerCase()||8==n[r].nodeType||t.appendChild(n[r].cloneNode(!0))}}return t}function d(e,t,a){var n,i=f(a);if(typeof e.id==m&&(e.id=a),F.ie&&F.win){var o="";for(var l in e)e[l]!=Object.prototype[l]&&("data"==l?t.movie=e[l]:"styleclass"==l.toLowerCase()?o+=' class="'+e[l]+'"':"classid"!=l&&(o+=" "+l+'="'+e[l]+'"'));var s="";for(var d in t)t[d]!=Object.prototype[d]&&(s+='<param name="'+d+'" value="'+t[d]+'" />');i.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+o+">"+s+"</object>",r(e.id),n=f(e.id)}else if(F.webkit&&F.webkit<312){var u=p("embed");u.setAttribute("type",g);for(var h in e)e[h]!=Object.prototype[h]&&("data"==h?u.setAttribute("src",e[h]):"styleclass"==h.toLowerCase()?u.setAttribute("class",e[h]):"classid"!=h&&u.setAttribute(h,e[h]));for(var v in t)t[v]!=Object.prototype[v]&&"movie"!=v&&u.setAttribute(v,t[v]);i.parentNode.replaceChild(u,i),n=u}else{var y=p(b);y.setAttribute("type",g);for(var w in e)e[w]!=Object.prototype[w]&&("styleclass"==w.toLowerCase()?y.setAttribute("class",e[w]):"classid"!=w&&y.setAttribute(w,e[w]));for(var C in t)t[C]!=Object.prototype[C]&&"movie"!=C&&c(y,C,t[C]);i.parentNode.replaceChild(y,i),n=y}return n}function c(e,t,a){var n=p("param");n.setAttribute("name",t),n.setAttribute("value",a),e.appendChild(n)}function f(e){return A.getElementById(e)}function p(e){return A.createElement(e)}function u(e){var t=F.pv,a=e.split(".");return a[0]=parseInt(a[0],10),a[1]=parseInt(a[1],10),a[2]=parseInt(a[2],10),t[0]>a[0]||t[0]==a[0]&&t[1]>a[1]||t[0]==a[0]&&t[1]==a[1]&&t[2]>=a[2]}function h(e,t){if(!F.ie||!F.mac){var a=A.getElementsByTagName("head")[0],n=p("style");if(n.setAttribute("type","text/css"),n.setAttribute("media","screen"),F.ie&&F.win||typeof A.createTextNode==m||n.appendChild(A.createTextNode(e+" {"+t+"}")),a.appendChild(n),F.ie&&F.win&&typeof A.styleSheets!=m&&A.styleSheets.length>0){var i=A.styleSheets[A.styleSheets.length-1];typeof i.addRule==b&&i.addRule(e,t)}}}function v(e,t){var a=t?"inherit":"hidden";T?f(e).style.visibility=a:h("#"+e,"visibility:"+a)}function y(e){if(!e)return 0;for(var t=e.childNodes,a=t.length,n=0;n<a;n++)if(1==t[n].nodeType&&"object"==t[n].nodeName.toLowerCase()&&(t=t[n].childNodes,a=t.length,n=0),1==t[n].nodeType&&"param"==t[n].nodeName.toLowerCase()&&"swfversion"==t[n].getAttribute("name"))return t[n].getAttribute("value");return 0}function w(e){if(!e)return"";for(var t=e.childNodes,a=t.length,n=0;n<a;n++)if(1==t[n].nodeType&&"object"==t[n].nodeName.toLowerCase()&&(t=t[n].childNodes,a=t.length,n=0),1==t[n].nodeType&&"param"==t[n].nodeName.toLowerCase()&&"expressinstall"==t[n].getAttribute("name"))return t[n].getAttribute("value");return""}var m="undefined",b="object",g="application/x-shockwave-flash",C="SWFObjectExprInst",N=window,A=document,I=navigator,S=[],E=[],L=null,j=null,k=null,T=!1,O=!1,F=function(){var e=typeof A.getElementById!=m&&typeof A.getElementsByTagName!=m&&typeof A.createElement!=m&&typeof A.appendChild!=m&&typeof A.replaceChild!=m&&typeof A.removeChild!=m&&typeof A.cloneNode!=m,t=[0,0,0],a=null;if(typeof I.plugins!=m&&typeof I.plugins["Shockwave Flash"]==b)(a=I.plugins["Shockwave Flash"].description)&&(a=a.replace(/^.*\s+(\S+\s+\S+$)/,"$1"),t[0]=parseInt(a.replace(/^(.*)\..*$/,"$1"),10),t[1]=parseInt(a.replace(/^.*\.(.*)\s.*$/,"$1"),10),t[2]=/r/.test(a)?parseInt(a.replace(/^.*r(.*)$/,"$1"),10):0);else if(typeof N.ActiveXObject!=m){var n=null,i=!1;try{n=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")}catch(e){try{n=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"),t=[6,0,21],n.AllowScriptAccess="always"}catch(e){6==t[0]&&(i=!0)}if(!i)try{n=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")}catch(e){}}if(!i&&n)try{a=n.GetVariable("$version"),a&&(a=a.split(" ")[1].split(","),t=[parseInt(a[0],10),parseInt(a[1],10),parseInt(a[2],10)])}catch(e){}}var r=I.userAgent.toLowerCase(),o=I.platform.toLowerCase(),l=!!/webkit/.test(r)&&parseFloat(r.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")),s=/win/.test(o?o:r),d=/mac/.test(o?o:r);return{w3cdom:e,pv:t,webkit:l,ie:!1,win:s,mac:d}}();!function(){if(F.w3cdom){if(t(n),F.ie&&F.win)try{A.write("<script id=__ie_ondomload defer=true src=//:><\/script>");var i=f("__ie_ondomload");i&&(i.onreadystatechange=function(){"complete"==this.readyState&&(this.parentNode.removeChild(this),e())})}catch(e){}F.webkit&&typeof A.readyState!=m&&(L=setInterval(function(){/loaded|complete/.test(A.readyState)&&e()},10)),typeof A.addEventListener!=m&&A.addEventListener("DOMContentLoaded",e,null),a(e)}}();return{registerObject:function(e,t,a){if(F.w3cdom&&e){var n=document.getElementById(e),i=w(n),r={};r.id=e,r.swfVersion=t||y(n),r.expressInstall=a||""!=i&&i,E[E.length]=r,v(e,!1)}},getObjectById:function(e){var t=null;if(F.w3cdom&&T){var a=f(e);if(a){var n=a.getElementsByTagName(b)[0];!n||n&&typeof a.SetVariable!=m?t=a:typeof n.SetVariable!=m&&(t=n)}}return t},embedSWF:function(e,a,n,i,r,l,s,c,f){if(F.w3cdom&&e&&a&&n&&i&&r)if(n+="",i+="",u(r)){v(a,!1);var p=typeof f==b?f:{};p.data=e,p.width=n,p.height=i;var h=typeof c==b?c:{};if(typeof s==b)for(var y in s)s[y]!=Object.prototype[y]&&(typeof h.flashvars!=m?h.flashvars+="&"+y+"="+s[y]:h.flashvars=y+"="+s[y]);t(function(){d(p,h,a),p.id==a&&v(a,!0)})}else l&&!O&&u("6.0.65")&&(F.win||F.mac)&&(v(a,!1),t(function(){var e={};e.id=e.altContentId=a,e.width=n,e.height=i,e.expressInstall=l,o(e)}))},getFlashPlayerVersion:function(){return{major:F.pv[0],minor:F.pv[1],release:F.pv[2]}},hasFlashPlayerVersion:u,createSWF:function(e,t,a){return F.w3cdom&&T?d(e,t,a):void 0},createCSS:function(e,t){F.w3cdom&&h(e,t)},addDomLoadEvent:t,addLoadEvent:a,getQueryParamValue:function(e){var t=A.location.search||A.location.hash;if(null==e)return t;if(t)for(var a=t.substring(1).split("&"),n=0;n<a.length;n++)if(a[n].substring(0,a[n].indexOf("="))==e)return a[n].substring(a[n].indexOf("=")+1);return""},expressInstallCallback:function(){if(O&&j){var e=f(C);e&&(e.parentNode.replaceChild(j,e),k&&(v(k,!0),F.ie&&F.win&&(j.style.display="block")),j=null,k=null,O=!1)}}}}();