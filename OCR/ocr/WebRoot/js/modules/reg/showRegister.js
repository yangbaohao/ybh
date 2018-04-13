$(document).ready(function() {
	
	var curWwwPath = window.document.location.href;
	var pathName =  window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	var localhostPath = curWwwPath.substring(0,pos);
	//var projectName = pathName.substring(0,pathName.substr(1).indexOf('/')+1);
	var projectName = "/AccountingCloud";
	
	var baseUrl = localhostPath + projectName + "/CXF/rs/";
	
	$('#showRegister').DataTable({
		//"ajax": "http://localhost:8080/AccountingCloud/js/modules/reg/test.txt"
		/*"ajax": "http://localhost:8080/AccountingCloud/js/modules/reg/test.txt",
		"columns": [ 
			{ "data": "username" },
	        { "data": "name" },
	        { "data": "email" },
	        { "data": "telephone" },
	        { "data": "accountPeriodMonth" },
	        { "data": "lastUpdateDate" }
		]*/
		/*"sProcessing": "处理中...",
		"sLengthMenu": "显示 _MENU_ 项结果",
		"sZeroRecords": "没有匹配结果",
		"sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
		"sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
		"sInfoFiltered": "(由 _MAX_ 项结果过滤)",
		"sInfoPostFix": "",
		"search": "搜索",
		"paginate": {
            "sFirst": "首页",
            "sPrevious": "上一页",
            "sNext": "下一页",
            "sLast": "末页"
		},*/
		"bAutoWidth": false,           //自适应宽度
		//"aaSorting": [[0, "asc"]],     //"aaSorting": [[4, "asc"]],   从第0列开始，以第4列倒序排列
		"lengthMenu": [10, 20, 30],
		//"pagingType": "full_numbers",
		"language": {
		"processing": "正在加载中......",
        "lengthMenu": "每页显示 _MENU_ 条记录",
        "zeroRecords": "对不起，查询不到相关数据！",
        "info": "当前为 _PAGE_ 页,总页数为 _PAGES_",             //当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录      
        "infoEmpty": "没找到数据",
        "infoFiltered": "(从 _MAX_ 条数据中检索)",
        "search": "搜索",
        "paginate": {
                    "sFirst": "首页",
                    "sPrevious": "上一页",
                    "sNext": "下一页",
                    "sLast": "末页"
                }
    	},
		"processing": true,
		"ajax": {
			"contentType":"application/json; charset=UTF-8",
			"type": "GET",
			"deferRender": true,
			"url": baseUrl + "owner/direct/search/page",
			"dataSrc": "rows"
		},
		//"ajax": "http://localhost:8080/AccountingCloud/js/modules/reg/test.json",
		"columns": [
			{ "data": "username" },
			{ "data": "name" },
			{ "data": "email" },
	        { "data": "telephone" },
	        { "data": "accountPeriodMonth" },
	        { "data": "lastUpdateDate" }
		]
	});
	
	 /*$('#showRegister tbody').on( 'mouseover', 'td', function () {
         var colIdx = table.cell(this).index().column;
         if (colIdx !== lastIdx) {
             $(table.cells().nodes()).removeClass('highlight');
             $(table.column( colIdx).nodes()).addClass('highlight');
         }
     })
     .on( 'mouseleave', function () {
         $( table.cells().nodes() ).removeClass( 'highlight' );
     });*/
});

/*var result;
$.ajax({
	type: "GET",
	datatype: "json",
	async:false,
	url: baseUrl + "owner/direct/search/page",            //"http://localhost:8080/AccountingCloud/js/modules/reg/test.txt", 
	success: function(data){
		result = JSON.stringify(data);
	}
});

var tmp = $('#showRegister > tbody').html();*/

/*result = data;
delete result.totalRows;
console.log(result);
alert(JSON.stringify(result));*/

/*,
complete: function (data, textStatus) {  
    alert(data); 
},*/
//$(document).ready(function() {
//	
//	var curWwwPath = window.document.location.href;
//	var pathName =  window.document.location.pathname;
//	var pos = curWwwPath.indexOf(pathName);
//	var localhostPath = curWwwPath.substring(0,pos);
//	//var projectName = pathName.substring(0,pathName.substr(1).indexOf('/')+1);
//	var projectName = "/AccountingCloud";
//	
//	var baseUrl = localhostPath + projectName + "/CXF/rs/";
//	
//	var urlParamData = "";
//	var jsquery = {'condition':[{'key':'owner.id','value':['1'],'action':'eq'}],
//			'filterscount':'',
//			'sortdatafield':'',
//			'sortorder':'',
//			'pagenum':'0',
//			'pagesize':'100',
//			'recordstartindex':'0',
//			'recordendindex':'30'
//		};
//	
//	urlParamData = JSON.stringify(jsquery);
	
	
	/*var dt = $('#showRegister').DataTable({
		"processing": true,
		"serverSide": true,
		"ajax": "http://localhost:8080/AccountingCloud/js/modules/reg/test.txt",
		"columns": [ 
			{ "data": "username" },
	        { "data": "name" },
	        { "data": "email" },
	        { "data": "telephone" },
	        { "data": "accountPeriodMonth" },
	        { "data": "lastUpdateDate" }
		],
		"order": [[1, 'asc']]
	});*/
	/*$('#showRegister').DataTable({
		"bAutoWidth": false,         //自适应宽度
		"aaSorting": [[0, "asc"]],
		"lengthMenu": [10, 20, 30],
		"pagingType": "full_numbers",
		"language": {
		"processing": "正在加载中......",
        "lengthMenu": "每页显示 _MENU_ 条记录",
        "zeroRecords": "对不起，查询不到相关数据！",
        //"info": "显示 page _PAGE_ of _PAGES_",             //当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录      
        "infoEmpty": "没找到数据",
        "infoFiltered": "(filtered from _MAX_ total records)",
        "search": "搜索",
        "paginate": {
                    "sFirst": "首页",
                    "sPrevious": "上一页",
                    "sNext": "下一页",
                    "sLast": "末页"
                }
    	},
		"processing": true,
		"ajax": {
			"type": "GET",
			//"data": urlParamData,
			"dataType": "json",
			"url": test.json,
			"data": function (data) {
				var res=data;
				delete res.totalRows;
				console.log(res);
				return res;
			}
		},
		"ajax": "http://localhost:8080/AccountingCloud/js/modules/reg/test.txt",
		"columns": [
			{ "data": "username" },
	        { "data": "name" },
	        { "data": "email" },
	        { "data": "telephone" },
	        { "data": "accountPeriodMonth" },
	        { "data": "lastUpdateDate" }
    	]
	});*/
	
	/*
	
	"fnServerData": function (sUrl, aoData, fnCallback) {
            $.ajax({
                "url": baseUrl + "owner/direct/search/page",
                "type": "GET",
                "success": fnCallback,
                "dataType": "json",
                "cache": false
            });
		},
	
	
	
	"bAutoWidth": false,         //自适应宽度
		"aaSorting": [[0, "asc"]],
		"lengthMenu": [10, 20, 30],
		"pagingType": "full_numbers",
		"language": {
		"processing": "正在加载中......",
        "lengthMenu": "每页显示 _MENU_ 条记录",
        "zeroRecords": "对不起，查询不到相关数据！",
        "info": "显示 page _PAGE_ of _PAGES_",             //当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录      
        "infoEmpty": "没找到数据",
        "infoFiltered": "(filtered from _MAX_ total records)",
        "search": "搜索",
        "paginate": {
                    "sFirst": "首页",
                    "sPrevious": "上一页",
                    "sNext": "下一页",
                    "sLast": "末页"
                }
    	},
		"processing": true,
	
	"ajax": {
			"type": "GET",
			"data": aoData,
			"dataType": "json",
			"url": baseUrl + "owner/search/page/",
			"data": function (data) {
				return data;
			}
		},
	
	var lastIdx = null;
    var table = $('#showRegister').DataTable();
    $('#example tbody')
        .on( 'mouseover', 'td', function () {
            var colIdx = table.cell(this).index().column;
            if ( colIdx !== lastIdx ) {
                $( table.cells().nodes() ).removeClass( 'highlight' );
                $( table.column( colIdx ).nodes() ).addClass( 'highlight' );
            }
        })
        .on( 'mouseleave', function () {
            $( table.cells().nodes() ).removeClass( 'highlight' );
        });*/
	
	
	/*$.getScript("/js/common/base64.js",function(){   //../..
	urlParamData = new Base64().encode(JSON.stringify(jsquery));
	});*/
	
//});