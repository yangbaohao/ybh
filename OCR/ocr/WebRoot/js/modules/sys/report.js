var Report=function(){
	var me=this;
	var url=_global_settings.service.url;
	var account=0;//循环次数
	var data=[];//报表数据

	this.initInput=function(){
//		Core.AjaxRequest({
//			url:url+''
//		});
//		me.createSearch();
//		me.checkSearch();
		me.initSearch();
		me.init();
	}
	
	this.init=function(){
		$('#report-show').css('display','');
		$('#report_date').val('createDate');
		$('#report-user').comboBox({
			source:ComboBoxSources.getRecords('getEmployee')
		});
		$('#report-role').dropDownlist({
			source:['制单人','审核人'],
			dropDownHeight:60,
			selectedIndex:0
		});
		$('#report-mins').dropDownlist({
			source:{'avgTime':'平均制单时长(min)','checkTimeNumber':'平均审单时长(min)'},
			dropDownHeight:60,
			selectedIndex:0
		});
		$('#report-time').dropDownlist({
            source: { '0': '请选择', '1': '最近一周', '2': '最近两周', '3': '最近三周', '4': '本月', '5': '本季度', '6': '本年' },
            selectedIndex: 0,
            dropDownHeight: 120
        });
        $('#report-st,#report-et').datetimeinputs();
        $('#report-time').on('change',function(){
            setValueById('report-time','report-st','report-et');
        });
        $('#report-nums').dropDownlist({
        	source:{
        		'detailQty':'平均制单产品数',
        		'kfreject':'制单驳回单数',
        		'checkFailed':'审核拒绝单数',
        		'checkRefused':'客户驳回单数',
        		'khbackout':'客户撤销单数',
        		'total':'制单数量'
        	},
        	selectedIndex:0
        });
        $('#report-role').on('select',function(){
        	var value=$(this).val();
        	for(var i in me.searchObj){
    			me.searchObj[i].value=[];
    		}
        	$('#report-show').find('input').val('');
//        	console.log(index)
        	if(value=='制单人'){
        		account=0;
        		$('#report_date').val('createDate');
        		$('#report-mins').val('avgTime');
        		$('#checkTable').parent().addClass('hide');
        		$('#createTable').parent().removeClass('hide');
        		$('#createTable').html('');
        		$('#report-nums').dropDownlist({
                	source:{
                		'detailQty':'平均制单产品数',
                		'kfreject':'制单驳回单数',
                		'checkFailed':'审核拒绝单数',
                		'checkRefused':'客户驳回单数',
                		'khbackout':'客户撤销单数',
                		'total':'制单数量'
                	},
                	selectedIndex:0
                });
        		me.initCreate();
        	}else{
        		account=0;
        		$('#report_date').val('checkDate');
        		$('#report-mins').val('checkTimeNumber');
        		$('#createTable').parent().addClass('hide');
        		$('#checkTable').parent().removeClass('hide');
        		$('#checkTable').html('');
        		$('#report-nums').dropDownlist({
                	source:{
                		'checkDetailQtyNumber':'平均审单产品数',
                		'checkAgainRefusedNumber':'复核拒绝单数',
                		'checkRefusedNumber':'审核拒绝单数',
                		'khrefusedNumber':'客户驳回单数',
                		'khbackOutNumber':'客户撤销单数',
                		'checkNumber':'审单数量'
                	},
                	selectedIndex:0
                });
        		me.initCheck();
        	}
        });
        $('#report-show').addClass('hiddendiv');
        
        me.search();
        me.initCreate();
        me.mouseWheel();
	}
	
	this.searchObj={};
	
	//制单/审单搜索条件
	this.initSearch=function(){
		me.searchObj={
			username:{value:[],action:'like'},  	 //员工
			detailQty:{value:[],action:'between'},   //平均制单产品数
			kfreject:{value:[],action:'between'},    //制单驳回单数
			checkFailed:{value:[],action:'between'}, //审核拒绝单数
			checkRefused:{value:[],action:'between'},//客户驳回单数
			khbackout:{value:[],action:'between'},   //客户撤销单数
			total:{value:[],action:'between'},		 //制单数量
			avgTime:{value:[],action:'between'}, 	 //平均制单时长
			createDate:{value:[],action:'between'},  //时间
			
			checkTimeNumber:{value:[],action:'between'},     	 //平均审单时长	
			checkDetailQtyNumber:{value:[],action:'between'},	 //平均审单产品数
			checkAgainRefusedNumber:{value:[],action:'between'}, //复核拒绝单数
			checkRefusedNumber:{value:[],action:'between'},		 //审核拒绝单数
			khrefusedNumber:{value:[],action:'between'},		 //客户驳回单数
			khbackOutNumber:{value:[],action:'between'},		 //客户撤销单数
			checkNumber:{value:[],action:'between'},			 //审单数量
			checkDate:{value:[],action:'between'}				 //时间
		}
//		var obj={'condition':[],'filterscount':0,'groupscount':0,'pagenum':0,'pagesize':10000};
//		obj.condition.push(me.createObj);
//		console.log(new Base64().encode(JSON.stringify(obj)));
	}
	
	//鼠标滑动
	this.mouseWheel=function(){
		$(document).on('mousewheel',function(e){
			var height = $(window).height(); //可见高度   
            var scrollTop = $(window).scrollTop(); //滚动高度 
            var domheight = $(document).height(); //页面高度
            if (domheight - height - scrollTop >= 0 && domheight - height - scrollTop < 1){
            	if($('#createTable').parent().is(':visible')){
            		me.initCreate(true);
            	}
            	if($('#checkTable').parent().is(':visible')){
            		me.initCheck(true);
            	}
            }
		});
	}
	
	//制单人报表
	this.initCreate=function(bool){
		if(bool){
			me.initCreateTable(data);
			return ;
		}
		
		var obj={'condition':[],'filterscount':0,'groupscount':0,'pagenum':0,'pagesize':10000};
		var search=me.searchObj;
		for(var i in search){
			var value=search[i].value;
			if(value.length!=0){
				search[i]['key']=i;
				obj.condition.push(search[i]);
			}
		}
		
//		console.log(obj)
		
		Core.AjaxRequest({
			url:url+'/report/search/creater/'+new Base64().encode(JSON.stringify(obj)),
			type:'get',
			showMsg:false,
			callback:function(res){
				data=res.rows;
				me.initCreateTable(res.rows);
			},
			failure:function(){
				data=[];
				me.initCreateTable([]);
			}
		});
	}
	
	//审核人报表
	this.initCheck=function(bool){
		if(bool){
			me.initCheckTable(data);
			return ;
		}
		
		var obj={'condition':[],'filterscount':0,'groupscount':0,'pagenum':0,'pagesize':10000};
		var search=me.searchObj;
		for(var i in search){
			var value=search[i].value;
			if(value.length!=0){
				search[i]['key']=i;
				obj.condition.push(search[i]);
			}
		}
		
		Core.AjaxRequest({
			url:url+'/report/search/checker/'+new Base64().encode(JSON.stringify(obj)),
			type:'get',
			showMsg:false,
			callback:function(res){
				data=res.rows;
				me.initCheckTable(res.rows);
			},
			failure:function(){
				data=[];
				me.initCheckTable([]);
			}
		});
	}
	
	this.initCreateTable=function(res){
		console.time('报表时间');
		var len=length=res.length;
		if(len==0&&account==0){
			$('#createTable').html('<tr><td colspan="11">暂无数据</td></tr>');
			account++;
			return ;
		}
		if(account>=length) return ;//已经滑动加载完毕
		if(account+30>=length){ //未加载的小于等于account+30时
			len=length;
		}else{
			len=account+30;
		}
		
		var html='';
		for(var i=account;i<len;i++){
			var t=res[i];
			var tr='<tr class="text-center">'+
			'<td>'+t.username+'</td><td>'+t.type+'</td><td>'+t.total+'</td><td>'+t.kfreject+'</td>'+
			'<td>'+t.checkFailed+'</td><td>'+t.checkAgainFailed+'</td><td>'+t.checkRefused+'</td><td>'+t.khbackout+'</td>'+
			'<td>'+(t.detailQty==undefined?'-':t.detailQty)+'</td><td>'+(t.avgTime==undefined?'-':t.avgTime)+'</td><td>制单明细</td></tr>';
			html+=tr;
		}
		account+=30;
		$('#createTable').html(html);
		console.timeEnd('报表时间');
	}
	
	this.initCheckTable=function(res){
		console.time('渲染时间');
		var len=length=res.length;
		if(len==0&&account==0){
			$('#checkTable').html('<tr><td colspan="10">暂无数据</td></tr>');
			account++;
			return ;
		}
		if(account>=length) return ;//已经滑动加载完毕
		if(account+30>=length){ //未加载的小于等于account+30时
			len=length;
		}else{
			len=account+30;
		}
		
		var html='';
		for(var i=0;i<len;i++){
			var t=data[i];
			var tr='<tr class="text-center">'+
			'<td>'+t.username+'</td><td>'+t.type+'</td><td>'+t.checkNumber+'</td><td>'+t.checkRefusedNumber+'</td>'+
			'<td>'+t.checkAgainRefusedNumber+'</td><td>'+t.khrefusedNumber+'</td><td>'+t.khbackOutNumber+'</td>'+
			'<td>'+(t.checkDetailQtyNumber==undefined?'-':t.checkDetailQtyNumber)+'</td><td>'+(t.checkTimeNumber==undefined?'-':t.checkTimeNumber)+'</td><td>制单明细</td></tr>';
			html+=tr;
		}
		account+=30;
//		$('#checkTable').append($(html));
		$('#checkTable').html(html);
		console.timeEnd('渲染时间');
	}
	
	this.search=function(){
		$('#report-search').off('click').on('click',function(){
			if($('#report-show').is(':hidden')){
				$('#report-show').slideDown('slow');
			}else{
				account=0;//重置循环次数
				$('#createTable').html('');
				$('#checkTable').html('');
				me.searchData();
			}
		});
		hiddenAclick();
	}
	
	this.searchData=function(){
//		console.log('search');
		var name=$('#report-user').val(),mins=$('#report-mins').val(),
			smin=$('#report-smin').val(),emin=$('#report-emin').val(),
			snum=$('#report-snum').val(),nume=$('#report-enum').val(),
			nums=$('#report-nums').val(),time=$('#report_date').val(),
			st=$('#report-st').val(),et=$('#report-et').val();
		
		for(var k in me.searchObj){
			me.searchObj[k].value=[];
		}
		
		//员工
		if(name!=''){
			me.searchObj.username.value.push(name);
		}
		
		//时长
		if(smin!=''&&emin!=''){
			me.searchObj[mins].value.push(smin,emin);
			me.searchObj[mins].action='between';
		}
		if(smin!=''&&emin==''){
			me.searchObj[mins].value.push(smin);
			me.searchObj[mins].action='ge';
		}
		if(smin==''&&emin!=''){
			me.searchObj[mins].value.push(emin);
			me.searchObj[mins].action='le';
		}
		
		//数量
		if(snum!=''&&nume!=''){
			me.searchObj[nums].value.push(snum,nume);
			me.searchObj[nums].action='between';
		}
		if(snum!=''&&nume==''){
			me.searchObj[nums].value.push(snum);
			me.searchObj[nums].action='ge';
		}
		if(snum==''&&nume!=''){
			me.searchObj[nums].value.push(nume);
			me.searchObj[nums].action='le';
		}
		
		//时间
		if(st!=''&&et!=''){
			me.searchObj[time].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
			me.searchObj[time].action='between';
		}
		if(st!=''&&et==''){
			me.searchObj[time].value.push(st+' '+'00:00:00');
			me.searchObj[time].action='ge';
		}
		if(st==''&&et!=''){
			me.searchObj[time].value.push(et+' '+'23:59:59');
			me.searchObj[time].action='le';
		}
		
		if($('#createTable').parent().is(':visible')){
    		me.initCreate();
    	}
    	if($('#checkTable').parent().is(':visible')){
    		me.initCheck();
    	}
	}
}	