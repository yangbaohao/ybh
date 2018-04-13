/*
 * 设置新增，查看，编辑窗口
 */

(function(){
	$('#cau-addType').dropDownlist({
		source:{'enterprise':'企业','person':'个人'},
		width:'100%',
		height:34,
		selectedIndex:0
	});
	
	$('#cau-editType').dropDownlist({
		source:{'enterprise':'企业','person':'个人'},
		width:'100%',
		height:34,
		selectedIndex:0
	});
	
	var width = window.innerWidth-15+'px';
	var height = document.body.scrollHeight+'px';
	$('#addWindow').css({'width':width,'height':height,'display':'none'});
	$('#editWindow').css({'width':width,'height':height,'display':'none'});
	$('#viewWindow').css({'width':width,'height':height,'display':'none'});
	

})()