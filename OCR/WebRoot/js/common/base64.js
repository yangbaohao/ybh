function Base64(){_keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",this.encode=function(r){var e,t,o,a,n,c,h,d="",C=0;for(r=_utf8_encode(r);C<r.length;)e=r.charCodeAt(C++),t=r.charCodeAt(C++),o=r.charCodeAt(C++),a=e>>2,n=(3&e)<<4|t>>4,c=(15&t)<<2|o>>6,h=63&o,isNaN(t)?c=h=64:isNaN(o)&&(h=64),d=d+_keyStr.charAt(a)+_keyStr.charAt(n)+_keyStr.charAt(c)+_keyStr.charAt(h);return d},this.decode=function(r){var e,t,o,a,n,c,h,d="",C=0;for(r=r.replace(/[^A-Za-z0-9\+\/\=]/g,"");C<r.length;)a=_keyStr.indexOf(r.charAt(C++)),n=_keyStr.indexOf(r.charAt(C++)),c=_keyStr.indexOf(r.charAt(C++)),h=_keyStr.indexOf(r.charAt(C++)),e=a<<2|n>>4,t=(15&n)<<4|c>>2,o=(3&c)<<6|h,d+=String.fromCharCode(e),64!=c&&(d+=String.fromCharCode(t)),64!=h&&(d+=String.fromCharCode(o));return d=_utf8_decode(d)},_utf8_encode=function(r){r=r.replace(/\r\n/g,"\n");for(var e="",t=0;t<r.length;t++){var o=r.charCodeAt(t);o<128?e+=String.fromCharCode(o):o>127&&o<2048?(e+=String.fromCharCode(o>>6|192),e+=String.fromCharCode(63&o|128)):(e+=String.fromCharCode(o>>12|224),e+=String.fromCharCode(o>>6&63|128),e+=String.fromCharCode(63&o|128))}return e},_utf8_decode=function(r){for(var e="",t=0,o=c1=c2=0;t<r.length;)o=r.charCodeAt(t),o<128?(e+=String.fromCharCode(o),t++):o>191&&o<224?(c2=r.charCodeAt(t+1),e+=String.fromCharCode((31&o)<<6|63&c2),t+=2):(c2=r.charCodeAt(t+1),c3=r.charCodeAt(t+2),e+=String.fromCharCode((15&o)<<12|(63&c2)<<6|63&c3),t+=3);return e}}