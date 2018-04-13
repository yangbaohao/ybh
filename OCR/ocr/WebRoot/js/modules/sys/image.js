//文件上传压缩和显示进度js

(function(){
	var file = null;
	$('#fileLoad').click(function(){
		$('#file').trigger('click');
	});
	
	$('#file').change(function(){debugger
		file = this.files[0];
		console.log(file);
//		uploadFile(file);
		var objUrl = getObjectURL(this.files[0]);
		$('#fileImg').attr('src',objUrl);
		
		toDataURL(this.files[0])
	});
	
	function toDataURL(file){
        var ready=new FileReader();
        /*开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容.*/
        ready.readAsDataURL(file);
        ready.onload=function(){
//        	console.log(this)
            var result=this.result;
        	setTimeout(function(){debugger
//        		console.log($('#fileLoad').find('img')[0])
//        		compress(file,result);
        		compress($('#fileLoad').find('img')[0])
        	},100)
        }
    }
	
	function compress(source_img_obj){
		var mime_type = 'image/jpeg';
		var cvs = document.createElement('canvas');
        //naturalWidth真实图片的宽度
        var bs = 1;
        var suofang = function(w, h) {
            var box = 1600;
            var max = Math.max.call(this, box, w, h);
            var scale = max > box ? box / max : 1;
            var _w = w * scale,
                _h = h * scale;
            return [_w, _h, w, h]
        }
        var sf = suofang(source_img_obj.naturalWidth, source_img_obj.naturalHeight);
        console.log(sf);
        cvs.width = sf[0];
        cvs.height = sf[1];
        var ctx = cvs.getContext('2d').drawImage(source_img_obj, 0, 0, cvs.width, cvs.height);
        var newImageData = cvs.toDataURL(mime_type, 0.9);
        
        var result_image_obj = new Image();
        result_image_obj.src = newImageData;
//        console.log(result_image_obj)
//        return result_image_obj;
        postImgBase64(result_image_obj.src)
    }
	
	var postImgBase64 = function(src){
		var formData = new FormData();
		function dataURLtoBlob(dataurl) {
            try {
                var arr = dataurl.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);
            } catch (e) {
                Core.alert({ message: '图片上传失败，请重新上传' });
                throw new Error('图片上传失败，请重新上传');
            }
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }
        //test:
        var blob = dataURLtoBlob(src);
        console.log(blob);
        debugger
//        var file = $('#fileLoad').find('img')[0];
        $.each(file,function(x,y){
        	formData.append(x,y);
        })
        formData.append('file', blob,file.name);
        console.log(formData.get('file'))
        //发送formData到后台
//      _global_settings.service.url+'/SimpleAC/file/'+new Base64().encode('toocr/order/file/'+_global_settings.owner.username);
        $.ajax({
        	type:'post',
        	url: _global_settings.service.url+'/SimpleAC/file/'+new Base64().encode('toocr/order/file/'+_global_settings.owner.username),
            data: formData,
            // async: false,
            cache: false,
            contentType: false,
            processData: false,
        	xhr: function() {  // custom xhr
	            var myXhr = $.ajaxSettings.xhr();
	            if(myXhr.upload){ // check if upload property exists
	                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
	            }
	            return myXhr;
	        },
	        success:function(){}
        });
	}
	
	function progressHandlingFunction(e){
	    if(e.lengthComputable){
	    	console.log('上传进度：'+e.loaded+'\n'+'总大小：'+e.total);
	    	var process = e.loaded / e.total * 100;
	        $('#process').css({width:process+'%'});
	    }
	}
	
	//建立一个可存取file的url
	var getObjectURL = function(file) {
	    var url = null;
	    if (window.createObjectURL != undefined) { // basic
	        url = window.createObjectURL(file);
	    } else if (window.URL != undefined) { // mozilla(firefox)
	        url = window.URL.createObjectURL(file);
	    } else if (window.webkitURL != undefined) { // webkit or chrome
	        url = window.webkitURL.createObjectURL(file);
	    }
	    return url;
	}
	
	//上传文件
	function uploadFile(file){
		console.error(file);
		$('#file_text').html('').html(file.name);
	}
	
	//开始上传
	$('#fileStart').click(function(){
		var formData = new FormData();
		formData.append('file',file);
		$.ajax({
        	type:'post',
        	url: _global_settings.service.url+'/SimpleAC/file/'+new Base64().encode('toocr/order/file/'+_global_settings.owner.username),
            data: formData,
            // async: false,
            cache: false,
            contentType: false,
            processData: false,
        	xhr: function() {  // custom xhr
	            var myXhr = $.ajaxSettings.xhr();
	            if(myXhr.upload){ // check if upload property exists
	                myXhr.upload.addEventListener('progress',progressHandlingFunction, false); // for handling the progress of the upload
	            }
	            return myXhr;
	        },
	        success:function(){console.log('上传success')}
        });
	})
	
	
	//点击
	$('#addBtn').on('click',function() {
		var img = '<img class="imgs" style="width:300px;height:300px;border:1px solid grey"/>';
		$('#drop').find('div').append(img);
//		timeOut(function(){
//			addEvent($(img));
//		},20)
		
		//传两个参数，第二个参数为true时，表示点击添加按钮，参考新建产品界面添加颜色按钮。
		//为每一个新添加的元素 添加拖拽事件
		//设置for循环为一次即可
		//第一个参数为数组，[img] $('#drop').find('.imgs');
		
		//要先解除事件绑定，避免重复绑定事件
//		addEvent();  
	})
	
	$('#delBtn').on('click',function() {
		$('#drop').find('.imgs').last().remove();
	})
	
	//添加事件
	var addEvent = function(e) {
		var t = $('#drop').find('.imgs').last()[0];
		
		t.ondragenter = function (e) {
			var target = e.target;
			console.error('enter',target,target.style.border)
			target.style.border = '1px solid red';
		}
		
		t.ondragover = function (e) {
	    	e.preventDefault();
	    }
		
		t.ondragleave = function (e) {
			var target = e.target;
			target.style.border = '1px solid grey';
	    };
	    
		//释放鼠标
		t.ondrop = function (e) {
			e.preventDefault();  
			
			var target = e.target;
			var objUrl = getObjectURL(e.dataTransfer.files[0]);
		       
			$(this).attr('src',objUrl);
			target.style.border = '1px solid grey'; 
		       
		    return false;
		};
	}
	
//	document.ondragstart = function(e){
//		console.error('start')
//		e.preventDefault();
//		return false;
//	}
//	document.ondragenter = function(e){
//		e.preventDefault();
//	}
//	
//	document.ondragover = function(e){
//		e.preventDefault();
//	}
	
	//拖拽上传
//	var drop = $('#drop').find('.imgs');
	
	$('#drop').on('dragenter','.imgs',function(e){
		var target = e.target;
		console.error('enter',target)
		target.style.border = '1px solid red';
	})
	
	$('#drop').on('dragover','.imgs',function(e){
		e.preventDefault();
	})
	
	$('#drop').on('dragleave','.imgs',function(e){
		var target = e.target;
		target.style.border = '1px solid grey';
	})
	
	$('#drop').on('drop','.imgs',function(e){
		e.preventDefault();  
	
		var target = e.target;
		var file = e.originalEvent.dataTransfer.files[0]; //e.dataTransfer.files[0]
		var objUrl = getObjectURL(file);
	       
		$(this).attr('src',objUrl);
		target.style.border = '1px solid grey'; 
	       
//	    return false;
	})
	
//	for(var i = 0; i < drop.length; i++) {
//		drop[i].ondragenter = function (e) {
//			var target = e.target;
//			console.error('enter',target,target.style.border)
//			target.style.border = '1px solid red';
//		}
//		
//		drop[i].ondragover = function (e) {
//	    	e.preventDefault();
//	    }
//		
//		drop[i].ondragleave = function (e) {
//			var target = e.target;
//			target.style.border = '1px solid grey';
//	    };
//	    
//		//释放鼠标
//		drop[i].ondrop = function (e) {
//			e.preventDefault();  
//			
//			var target = e.target;
//			var objUrl = getObjectURL(e.dataTransfer.files[0]);
//		       
//			$(this).attr('src',objUrl);
//			target.style.border = '1px solid grey'; 
//		       
//		    return false;
//		}; 
//	}
	
})();