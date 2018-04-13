(function(){
	var ajax_func=function(){
		var defer = true;
		
		var ajax=function(){
			return $.ajax({
				type:'get',
				url:'js/modules/sys/data.txt',
				success:function(res){
					console.error('success');
				}
			});
		}
		
		if(defer){
			var t = $.Deferred();
			setTimeout(function(){
				ajax().always(function(){
					t.resolve();
				});
			},0)
			return t;
		}
	}
	console.log(ajax_func())
	ajax_func().then(function(data){
		console.log(data)
	});
//	var a=0;
//	for(var i=0;i<99999999;i++){
//		a+=1;
//	}
	console.error('me');
	
//	var ajax=function(){
//		return $.ajax({
//			type:'get',
//			url:'js/modules/sys/data.txt',
//			success:function(res){
//				console.error('success');
//			}
//		});
//	}
	
//	$.when(ajax()).then(function(data){
//		console.log(data);
//	})
	
})();