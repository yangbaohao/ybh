!function(){function e(e){var n=new FileReader;n.readAsDataURL(e),n.onload=function(){this.result;setTimeout(function(){t($("#fileLoad").find("img")[0])},100)}}function t(e){var t=document.createElement("canvas"),n=function(e,t){var n=Math.max.call(this,1600,e,t),r=n>1600?1600/n:1;return[e*r,t*r,e,t]}(e.naturalWidth,e.naturalHeight);t.width=n[0],t.height=n[1];var r=(t.getContext("2d").drawImage(e,0,0,t.width,t.height),t.toDataURL("image/jpeg",.9)),i=new Image;i.src=r,a(i.src)}function n(e){if(e.lengthComputable){var t=e.loaded/e.total*100;$("#process").css({width:t+"%"})}}var r=null;$("#fileLoad").click(function(){$("#file").trigger("click")}),$("#file").change(function(){r=this.files[0];var t=i(this.files[0]);$("#fileImg").attr("src",t),e(this.files[0])});var a=function(e){var t=new FormData,a=function(e){try{var t=e.split(","),n=t[0].match(/:(.*?);/)[1],r=atob(t[1]),a=r.length,i=new Uint8Array(a)}catch(e){throw Core.alert({message:"图片上传失败，请重新上传"}),new Error("图片上传失败，请重新上传")}for(;a--;)i[a]=r.charCodeAt(a);return new Blob([i],{type:n})}(e);$.each(r,function(e,n){t.append(e,n)}),t.append("file",a,r.name),$.ajax({type:"post",url:_global_settings.service.url+"/SimpleAC/file/"+(new Base64).encode("toocr/order/file/"+_global_settings.owner.username),data:t,cache:!1,contentType:!1,processData:!1,xhr:function(){var e=$.ajaxSettings.xhr();return e.upload&&e.upload.addEventListener("progress",n,!1),e},success:function(){}})},i=function(e){var t=null;return void 0!=window.createObjectURL?t=window.createObjectURL(e):void 0!=window.URL?t=window.URL.createObjectURL(e):void 0!=window.webkitURL&&(t=window.webkitURL.createObjectURL(e)),t};$("#fileStart").click(function(){var e=new FormData;e.append("file",r),$.ajax({type:"post",url:_global_settings.service.url+"/SimpleAC/file/"+(new Base64).encode("toocr/order/file/"+_global_settings.owner.username),data:e,cache:!1,contentType:!1,processData:!1,xhr:function(){var e=$.ajaxSettings.xhr();return e.upload&&e.upload.addEventListener("progress",n,!1),e},success:function(){}})}),$("#addBtn").on("click",function(){$("#drop").find("div").append('<img class="imgs" style="width:300px;height:300px;border:1px solid grey"/>')}),$("#delBtn").on("click",function(){$("#drop").find(".imgs").last().remove()});$("#drop").on("dragenter",".imgs",function(e){e.target.style.border="1px solid red"}),$("#drop").on("dragover",".imgs",function(e){e.preventDefault()}),$("#drop").on("dragleave",".imgs",function(e){e.target.style.border="1px solid grey"}),$("#drop").on("drop",".imgs",function(e){e.preventDefault();var t=e.target,n=e.originalEvent.dataTransfer.files[0],r=i(n);$(this).attr("src",r),t.style.border="1px solid grey"})}();