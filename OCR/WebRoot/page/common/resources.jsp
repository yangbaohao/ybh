<%@ page language="java" contentType="text/html; charset=UTF-8"%>
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.base.css" type="text/css" />
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.account.css" type="text/css" />
	<%-- <link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.bootstrap.css" type="text/css" /> --%>
	
	<%-- <link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.orange.css" type="text/css" />
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.metro.css" type="text/css" />
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.metrodark.css" type="text/css" />
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.darkblue.css" type="text/css" />
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.shinyblack.css" type="text/css" />
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.classic.css" type="text/css" />
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.office.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.windowsphone.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.mobile.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.summer.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.black.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.blackberry.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.fresh.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.glacier.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.light.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.web.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.arctic.css" type="text/css" /> 
	<link rel="stylesheet" href="styles/jqwidgets-${jqxVersion}/jqx.android.css" type="text/css" />  --%>	
	<link href="styles/jqx.tab.title.css" rel="stylesheet" type="text/css" /> 
	<link href="styles/jquery.monthpicker.css" rel="stylesheet" type="text/css" />
	<%-- <link rel="stylesheet" href="styles/common.css?v1001" type="text/css" />
	<link rel="stylesheet" href="styles/login.css" type="text/css"> --%>
	
	<script type="text/javascript" src="js/common/jquery-3.0.0.min.js"></script>
	
	<script type="text/javascript" src="js/common/jquery.i18n.properties.js"></script>
	<script type="text/javascript" src="js/common/base64.js"></script>
	<script type="text/javascript" src="js/common/jquery.monthpicker.js"></script>
	
	<script type="text/javascript" src="js/jqwidgets-${jqxVersion}/jqx-all.js"></script>
	
	<script type="text/javascript" src="js/jqwidgets-${jqxVersion}/globalization/globalize.js"></script>
	<script type="text/javascript" src="js/jqwidgets-${jqxVersion}/globalization/globalize.culture.zh-CN.js"></script>
	
	<script type="text/javascript" src="js/common/core.js"></script>
	<!-- <script type="text/javascript" src="js/common/base.js?v1000"></script> -->
	<script type="text/javascript" src="js/common/validate-custom.js"></script>
	<script type="text/javascript" src="js/common/mindmup-editabletable.js"></script>
	<script type="text/javascript" src="js/common/jqxgrid.pager.js"></script>
	
	<%-- <script type="text/javascript" src="js/common/swfobject_modified.js"></script> --%>
	
	<script src="js/common/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/common/address.js"></script>
	<script type="text/javascript" src="js/common/common.js?v1000"></script>
	<script type="text/javascript" src="js/common/urlReg.js?v0106_v3"></script>
	<script type="text/javascript" src="js/common/jquery.monthpicker.js"></script>
	<script type="text/javascript" src="js/common/easyGrid1.js?v0106_v3"></script>
	<script type="text/javascript" src="js/common/power.js?v0106_v3"></script>
	<script type="text/javascript" src="js/common/quickKey.js?v0106_v3"></script>
	
<script type="text/javascript">	
	loadBundles(currentlang);
	window.onbeforeunload = function(e){
 		//console.log(event);
 		var evt = e||window.event;
 		if(window.location.hostname!=='localhost'){
 			evt.returnValue=""; 
 		}
 		  
	}
</script>