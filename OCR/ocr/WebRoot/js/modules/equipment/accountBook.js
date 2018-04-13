var AccountBookMgt = function(){
	var me=this;
	
	
	this.initInput = function(){
		me.initPages();
	}
	this.initPages = function(){
		var alink = $('#main-changeLanguage');
		if(localStorage.getItem(alink) == "英文" ){
			$('#moneyDetail-msg').text("According to the subsidiary ledger account registration book called ledger ledger, referred to as . Also known as Ming subdivision accounts, according to the set details subjects of general ledger is used for classification, registration a kind of economic and business transactions, provide detailed accounting information.");
			$('#generalLedger-msg').text("According to the general ledger accounts for registration of all transactions, the total classified accounting ledgers provide omnibus accounting information. The accounting information provided by the general ledger is the main basis for the preparation of accounting statements.");
			$('#subjectBal-msg').text("Also known as the 'general ledger balance summary table', it is in accordance with the general ledger balance system");
//			$('#moneyDetail-msg').text("");
			
			$('#subjectBal_table').text('Account Balance Sheet');
			$('#generalLedger_table').text('General Ledger');
			$('#moneyDetail_table').text('Detail Account');
		}
	}
}

var AccountBookBindModle = function(accountBookMgt){
	var me=this;
	
	
	this.bind = function(){
		//明细账
		$("#moneyDetail_table").on('click',function(){
			$.addTab({title:"明细账",isFrame:false,url:ctx+"/page/modules/equipment/detailMoney.html"});
		});
		//总账
		$("#generalLedger_table").on('click',function(){
			$.addTab({title:"总账",isFrame:false,url:ctx+"/page/modules/equipment/generalLedger.html"});
		});
		//科目余额表
		$("#subjectBal_table").on('click',function(){
			$.addTab({title:"科目余额表",isFrame:false,url:ctx+"/page/modules/equipment/subjectBal.html"});
		});
	}
	
	this.unbindAll = function(){
		$("#moneyDetail_table").off('click');
		$("#subjectBal_table").off('click');
	}
}