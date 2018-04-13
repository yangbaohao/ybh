var EquipmentdetMgt = function(){
	var me = this;
	var url = _global_settings.service.url+"/asset";
	this.data = null;
	this.random = null;
	/**
	 * 初始化资产详情界面
	 */
	this.initInput = function(){
		me.data = $.pk.data;
		me.random = ($.pk.random +"0").substring(2,8);
		if($.pk!==undefined){
			if($.pk.data===undefined || $.pk.random===undefined){
				Core.alert({
					message:"data,random入参错误",
					callback:function(){
						$.closeTab();
					}
				});
			}
		}
		$("#viewequip-assetRef").attr("id","viewequip-assetRef"+me.random);
		$("#viewequip-assetName").attr("id","viewequip-assetName"+me.random);
		$("#viewequip-purchaseDate").attr("id","viewequip-purchaseDate"+me.random);
		$("#viewequip-iniValue").attr("id","viewequip-iniValue"+me.random);
		$("#viewequip-totalDepreciatedValue").attr("id","viewequip-totalDepreciatedValue"+me.random);
		$("#viewequip-assetBal").attr("id","viewequip-assetBal"+me.random);
		$("#viewequip-scrapValueRatio").val("id","viewequip-scrapValueRatio"+me.random);
		$("#viewequip-sumExpectVal").attr("id","viewequip-sumExpectVal"+me.random);
		$("#viewequip-scrapValueRatio").attr("id","viewequip-scrapValueRatio"+me.random);
		$("#viewequip-coaDepreciate").attr("id","viewequip-coaDepreciate"+me.random);
		$("#viewequip-coaExpense").attr("id","viewequip-coaExpense"+me.random);
		/*$("#viewequip-inlineRadio1").attr("id","viewequip-inlineRadio1"+me.random);
		$("#viewequip-inlineRadio2").attr("id","viewequip-inlineRadio2"+me.random);*/
		$("#viewequip-dateshow_hide2").attr("id","viewequip-dateshow_hide2"+me.random);
		$("#viewequip-dateshow_hide3").attr("id","viewequip-dateshow_hide3"+me.random);
		$("#viewequip-y").attr("id","viewequip-y"+me.random);
		$("#viewequip-n").attr("id","viewequip-n"+me.random);
		$("#viewequip-expectTime").attr("id","viewequip-expectTime"+me.random);
		$("#viewequip-assetMonth").attr("id","viewequip-assetMonth"+me.random);
		$("#viewequip-startTime").attr("id","viewequip-startTime"+me.random);
		$("#viewequip-endTime").attr("id","viewequip-endTime"+me.random);
		$("#viewequip-iniprice").attr("id","viewequip-iniprice"+me.random);
		$("#viewequip-ininum").attr("id","viewequip-ininum"+me.random);
		if(me.data.startDepreciate=='pauseDepreciate'){
			$('#viewequip-stop')[0].checked=true;
			$("#"+"viewequip-dateshow_hide2"+me.random).css('display','none');
			$("#"+"viewequip-dateshow_hide3"+me.random).css('display','none');
		}
		$('#viewequip-stop').attr({'id':'#viewequip-stop'+me.random,'disabled':'disabled'});
		$("#viewequip-income").attr("id","viewequip-income"+me.random);
		$("#viewequip-jsy").attr("id","viewequip-jsy"+me.random);
		$("#eqmgt_view_sell").attr("id","eqmgt_view_sell"+me.random);
		
		
		$("#viewequip-iniprice"+me.random).val(me.data.price);
		$("#viewequip-ininum"+me.random).val(me.data.qty);
		$("#"+"viewequip-assetRef"+me.random).val(me.data.assetRef);
		$("#"+"viewequip-assetName"+me.random).val(me.data.name);
		$("#"+"viewequip-purchaseDate"+me.random).val(me.data.purchaseDate.substring(0,10));
		$("#"+"viewequip-iniValue"+me.random).val(money(me.data.iniValue));
		$("#"+"viewequip-totalDepreciatedValue"+me.random).val(money(me.data.totalDepreciatedValue));
		
		$("#"+"viewequip-scrapValueRatio"+me.random).val(me.data.scrapValueRatio);
		$("#"+"viewequip-sumExpectVal"+me.random).val(money(me.data.iniValue * (me.data.scrapValueRatio/100)));
		$("#"+"viewequip-scrapValueRatio"+me.random).val(me.data.scrapValueRatio);
		$("#"+"viewequip-coaDepreciate"+me.random).val(me.getStockSubject('chartOfAccounts',me.data.coaDepreciate.id));
		$("#"+"viewequip-coaExpense"+me.random).val(me.getStockSubject('chartOfAccounts',me.data.coaExpense.id));
		var startDepreciate = me.data.startDepreciate; //判断是否折旧
		if(startDepreciate in {'stopDepreciate':true,'scrap':true,'sell':true}){
			$('#eqmgt_viewState').replaceWith('<span class="btn btn-success float-right mg10">已'+getCodeData(startDepreciate)+'</span>');
		}
//		if(startDepreciate=='scrap'){
//			$("#"+"viewequip-assetBal"+me.random).val(0);
//		}else{
			$("#"+"viewequip-assetBal"+me.random).val(money(me.data.iniValue - me.data.totalDepreciatedValue));
//		}
		if(startDepreciate=='sell'){
			$('#eqmgt_view_sell'+me.random).css('display','');
			$("#viewequip-income"+me.random).val(money(me.data.income));
			$("#viewequip-jsy"+me.random).val(money(me.data.income-me.data.iniValue+me.data.totalDepreciatedValue));
		}
		/*if(startDepreciate == "undepreciate"){ //不折旧
			$("#"+"viewequip-inlineRadio2"+me.random).attr("checked","checked");
			$("#"+"viewequip-y"+me.random).css({display:"none"});
			$("#"+"viewequip-dateshow_hide2"+me.random).css({display:"none"});
			$("#"+"viewequip-dateshow_hide3"+me.random).css({display:"none"});
		}else{ //折旧
*/			//$("#"+"viewequip-inlineRadio1"+me.random).attr("checked","checked");
			$("#"+"viewequip-n"+me.random).css({display:"none"});
			$("#"+"viewequip-expectTime"+me.random).val(me.data.depreciateMonth);
			//$("#"+"viewequip-assetMonth"+me.random).val(money((me.data.iniValue - $("#"+"viewequip-sumExpectVal"+me.random).val())/me.data.depreciateMonth));
			$("#"+"viewequip-assetMonth"+me.random).val(me.data.monthlyDepreciateValue);
			if(me.data.depreciateStartMonth!=null)
			$("#"+"viewequip-startTime"+me.random).val(me.data.depreciateStartMonth.substring(0,7));
			if(me.data.depreciateEndMonth!=null)
			$("#"+"viewequip-endTime"+me.random).val(me.data.depreciateEndMonth.substring(0,7));
	//	}
	};
	
	//初始化科目
	this.getStockSubject = function(name,id){
		var adapter = ComboBoxSources.getAdapter(name);
		var records = adapter.records; 
//		console.log(records);
		for(var i=0;i<records.length;i++){
			if(records[i].id == id){
				return records[i].name;
			}
		}
		if(!id){
			ComboBoxSources.load(name);
			return "暂无";
		}
	}
	
	this.settings = {  
			source:{
		        datafields: [
		            { name: 'id', type: 'long' },
		            { name: 'name', type: 'string' },
		            { name: 'type', type: 'string' },
		            { name: 'unit', type: 'string' },
		            { name: 'createDate', type: 'date'}
		        ],
		        url: url+"/search",
		    },
			grid:{element:"EquiGrid"},
			ajax:{url:url},
	};
}

var EquipmentdetBindModle = function(equipmentdetMgt){
	var me = this;
	//equipmentdetMgt.data;
	this.bind = function(){
//		$("#viewequip-back").attr("id","viewequip-back"+equipmentdetMgt.random);
//		$("#"+"viewequip-back"+equipmentdetMgt.random).on({'click':function(){
//			var tab_index;
//			$.closeTab(tab_index);
//		}});
	}
	
	this.unbindAll = function(){
//		$("#viewequip-back").attr("id","viewequip-back"+equipmentdetMgt.random);
//		$("#"+"viewequip-back"+equipmentdetMgt.random).off('click');
	}
	//打印add-assetPrint
	$('#add-assetPrint').on('click',function(){
//	debugger;
	var url1 = new Base64().encode("reportName=AssetPrint2&assetId="+equipmentdetMgt.data.id+"&printType=pdf&ownerId="+currentUserInfo.id+'&username='+currentUserInfo.loginId).replace("_$_",".").replace(/\//g,"_a").replace(/\+/g,"_b").replace(/\=/g,"_c");
		if(equipmentdetMgt.data.startDepreciate=='sell'){
			window.open( _global_settings.service.url+"/ac/print/"+url1);
		}else{
			window.open( _global_settings.service.url+"/ac/print/"+url1);	//出售
		}
})
}

