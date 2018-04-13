/**
 * 页面加载时候执行 
 */

$(function(){
	var nowdate = new Date();
	var uuid=0;
	//$("#startdate").datetimeinput({formatString:"yyyy-MM",width:'90%',height:33,value:new Date()});//筛选日期
	$('#startdate').monthpicker({
		callback:'a'
		/*//years: [2015, 2014, 2013, 2012, 2011],
        topOffset: 6*/
	});	
	
	
	var url = _global_settings.service.url;	
	//测算金额
	$('#measureamount').on('click',function(){	
		//发送ajax请求 把金额append到指定的位置
		var date = $("#startdate").val();
		Core.AjaxRequest({
			type:"GET",
			showMsg:false,
			url:url+"/ac/"+new Base64().encode("tosys/carryover/compute/"+date+"/"+currentUserInfo.id+"/"+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c"),
			callback:function(res){
//				var text=["计提工资","摊销待摊费用","计提税金","结转未交增值税","计提折旧","计提所得税","结转损益"];
				var text=["计提工资","摊销待摊费用","计提税金","结转未交增值税","计提折旧","结转损益"];
				var arr=["wages","amortization","gold","tax","depreciation"/*,"incometax"*/,"carryover"];
				for(var i in arr){
					$('.finalTransactionMn').eq(i).text('￥'+(res[arr[i]]===null?'0.00':money(res[arr[i]])));
				}
				uuid+=1;
	
			},
			failure:function(res){
				Core.alert({message:'系统出错！'})
	        }
		});
	});
	
	
	$('.finalTransactionBtns').on('click',function(){
		if(uuid>0){
			$.addTab({title:'生成凭证',url:'page/modules/fms/createJoutnal.html',reload:true,
				//pk:$(this).data('id')
				pk:{id:$(this).data('id'),name:$(this).parent().children().eq(0).children().text(),journaldate:$("#startdate").val()}
			});
		}else{
			Core.alert({message:'请先测算金额！'})
			
		}
	});


		
	
	
	

})



















