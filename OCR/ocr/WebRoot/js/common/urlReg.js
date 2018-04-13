/*!
 *  Author:dingwenyuan
 *  email:492055811@qq.com
 */
(function(){
	var urlReg=function(url,parameter){
		this.url=url;
		this.parameter=parameter;
	};
	urlReg.prototype.getParameter=function(){
		var parameter=this.parameter;
		var url=this.url;
		if(parameter===undefined){
			throw 'parameter is undefined';
		}
		if(typeof parameter === 'string'){
			parameter=parameter.split(',');
		}
		var obj={};
		var len=parameter.length;
		for(var i =0;i<len;i++){
			var p=parameter[i];
			var ref=null;
			var reg = eval('/'+p+'=(\\w+)&?/');
			if(reg.test(url)){
				ref=reg.exec(url)[1];
				obj[p]=ref;
			}
		}		
		return obj;
	};
	
	window.urlReg=urlReg;
	
	var imgBase64=function(input){
		this.input=input[0];
	}
	
	imgBase64.prototype.toDataURL=function(img,callback){
		 var t=this;
		 var file=t.input.files[0];
		 var reader = new FileReader();

		 reader.onload = (function(theFile) {
             return function(e) {
                 //var i = img;
            	 var i = document.createElement('img');
                 i.src = e.target.result;
                 console.log($(i).width());
                 console.log($(i).height());
                 setTimeout(function() {
                     i.src = t.compress(i).src;
                     callback(i.src);
                 }, 0);
             };
         })(file);

         reader.readAsDataURL(file);
	}
	
    /**
     * Receives an Image Object (can be JPG OR PNG) and returns a new Image Object compressed
     * @param {Image} source_img_obj The source Image Object
     * @param {Integer} quality The output quality of Image Object
     * @return {Image} result_image_obj The compressed Image Object
     */

	imgBase64.prototype.compress=function(source_img_obj, quality, output_format) {

        var mime_type = "image/jpeg";
        if (output_format != undefined && output_format == "png") {
            mime_type = "image/png";
        }
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
        var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0, cvs.width, cvs.height);
        var newImageData = cvs.toDataURL(mime_type, 0.9);
//      cvs.width = source_img_obj.naturalWidth;
//      cvs.height = source_img_obj.naturalHeight;
//      var ctx = cvs.getContext("2d").drawImage(source_img_obj, 0, 0);
//      var newImageData = cvs.toDataURL(mime_type, 0.25);
        var result_image_obj = new Image();
        result_image_obj.src = newImageData;
        return result_image_obj;
    }
	
	window.imgBase64=imgBase64;
})()
