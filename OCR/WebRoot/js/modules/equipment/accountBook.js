var AccountBookMgt=function(){var e=this;this.initInput=function(){e.initPages()},this.initPages=function(){var e=$("#main-changeLanguage");"英文"==localStorage.getItem(e)&&($("#moneyDetail-msg").text("According to the subsidiary ledger account registration book called ledger ledger, referred to as . Also known as Ming subdivision accounts, according to the set details subjects of general ledger is used for classification, registration a kind of economic and business transactions, provide detailed accounting information."),$("#generalLedger-msg").text("According to the general ledger accounts for registration of all transactions, the total classified accounting ledgers provide omnibus accounting information. The accounting information provided by the general ledger is the main basis for the preparation of accounting statements."),$("#subjectBal-msg").text("Also known as the 'general ledger balance summary table', it is in accordance with the general ledger balance system"),$("#subjectBal_table").text("Account Balance Sheet"),$("#generalLedger_table").text("General Ledger"),$("#moneyDetail_table").text("Detail Account"))}},AccountBookBindModle=function(e){this.bind=function(){$("#moneyDetail_table").on("click",function(){$.addTab({title:"明细账",isFrame:!1,url:ctx+"/page/modules/equipment/detailMoney.html"})}),$("#generalLedger_table").on("click",function(){$.addTab({title:"总账",isFrame:!1,url:ctx+"/page/modules/equipment/generalLedger.html"})}),$("#subjectBal_table").on("click",function(){$.addTab({title:"科目余额表",isFrame:!1,url:ctx+"/page/modules/equipment/subjectBal.html"})})},this.unbindAll=function(){$("#moneyDetail_table").off("click"),$("#subjectBal_table").off("click")}};