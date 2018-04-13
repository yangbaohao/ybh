/*
 * 用户管理界面js
 */
var UserMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user';
	
	this.initInput=function(){
		me.initPage();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	/*
	 * 初始化页面
	 */
	this.initPage=function(){
		$('#user-show').css('display','');
		
		$('#user-firstTime').dropDownlist({
			source: { '0': '请选择', '1': '最近一周', '2': '最近两周', '3': '最近三周', '4': '本月', '5': '本季度', '6': '本年' },
            selectedIndex: 0,
            dropDownHeight: 120
		});
		$('#user-sTime,#user-eTime').datetimeinput(/*{formatString:"yyyy-MM-dd", width: '100%', height: '34px'}*/);
//		$('#user-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#user-firstTime').on('change',function(){
			setValueById('user-firstTime','user-sTime','user-eTime');
		});
		
		$('#user-name').comboBox({
			source:ComboBoxSources.getRecords('username'),
			displayMember:'name',
			valueMember:'name'
		});
		
		$('#user-compname').comboBox({
			source:ComboBoxSources.getRecords('company'),
			displayMember:'company',
			valueMember:'company'
		});
		
		$('#user-show').addClass('hiddendiv');
		
		searchBtn();
		hiddenAclick();
	}
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'owner0.createDate':{value:[],action:'between'},
			'owner0.loginId':{value:[],action:'like'},
			'enterprise.name':{value:[],action:'like'},
			'owner0.regTelephone':{value:[],action:'like'}
		};
	}
	
	//点击搜索
	var searchBtn=function(){
		//点击搜索
		$('#user-search').off('click').on('click',function(){
			if($('#user-show').is(':hidden')){
				$('#user-show').slideDown('slow');
			}else{
				search();
			}
		});
	}
	
	var search=function(){
		var username=$('#user-name').val(),name=$('#user-compname').val(),
			phone=$('#user-phone').val(),st=$('#user-sTime').val(),et=$('#user-eTime').val();
		
		me.searchObj['owner0.createDate'].value=[];
		if(st!=''&&et!=''){
			me.searchObj['owner0.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
			me.searchObj['owner0.createDate'].action='between';
		}
		if(st==''&&et!=''){
			me.searchObj['owner0.createDate'].value.push(et+' '+'23:59:59');
			me.searchObj['owner0.createDate'].action='le';
		}
		if(st!=''&&et==''){
			me.searchObj['owner0.createDate'].value.push(st+' '+'00:00:00');
			me.searchObj['owner0.createDate'].action='ge';
		}
		
		me.searchObj['owner0.loginId'].value=[];
		if(username!=''){
			me.searchObj['owner0.loginId'].value.push(username);
		}
		
		me.searchObj['enterprise.name'].value=[];
		if(name!=''){
			me.searchObj['enterprise.name'].value.push(name);
		}
		
		me.searchObj['owner0.regTelephone'].value=[];
		if(phone!=''){
			me.searchObj['owner0.regTelephone'].value.push(phone);
		}
		
		searchDataInfo('userMgtGrid');
	}
	
	this.initColumns=function(){
		
		var columns=[
				{ text: '首次充值日期',dataField:'firstDate', width:'11%'/*,hidden:true*/},
				{ text: '用户名',dataField:'username', width:'11%',
//					cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
//						var html='<div class="agrid">';
//							html+='<a class="hoverspan viewUser">'+rowdata.username+'</a>';
//						return html+'</div>';
//					}
				},
				{ text: '商户名称',dataField:'name',width:'12%'},
				{ text: '联系电话',dataField:'telephone',width:'11%'},
				{ text: '服务单数',dataField:'totalNum',width:'11%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
						var html = '<div class="agrid">';
						html+='<a class="hoverspan viewTotal">'+rowdata.totalNum+'</a>';
						return html+'</div>';
					}
				},
				{ text: '一般单数',dataField:'ordinaryNum',width:'11%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
						var html = '<div class="agrid">';
						html+='<a class="hoverspan viewOrdinary">'+rowdata.ordinaryNum+'</a>';
						return html+'</div>';
					}
				},
				{ text: '加急单数',dataField:'urgentNum',width:'11%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
						var html = '<div class="agrid">';
						html+='<a class="hoverspan viewUrgent">'+rowdata.urgentNum+'</a>';
						return html+'</div>';
					}
				},
				{ text: '账户余额',dataField:'balanceAmt',width:'11%'},
			    { text: '充值记录',width:'11%', align:"center",
			    	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata){
						var html = '<div class="text-center agrid">';
//						html+='<a class="hoverspan viewBuyDetail">详情</a>';
						html+='详情';
						return html+'</div>';
					}
			    }
			];
		
		return columns;
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		var source={
			url:url+'/search/userbuy/0/0/'+_global_settings.owner.roleName,
	        data:me.searchObj
	    }
		
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('userMgtGrid', source,{
			beforeLoadComplete:function(records){
				
			},
			loadComplete:function(rd){
			}
		}, false);
		
		//初始化Grid
		var	grid_sets = {
//			columnsresize: false,	
	  	    source:demoAdapter,
	  	    rendergridrows: function(){
                 return demoAdapter.recordids;
            },
            columns:me.initColumns(),
    	    pagesize: 20,
    	    columnsheight: 45
	    };
		
		$('#userMgtGrid').grid(grid_sets);
		
		numberClick();
	}	
	
	var numberClick=function(){
		//点击服务单数
		$('#userMgtGrid').on('click','.viewTotal',function(){
			var index=$('#userMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#userMgtGrid').jqxGrid('getrowdata',index);
				var vduser={
					name:data.name,
					phone:data.telephone,
					ownerId:data.ownerId,
					type:null
				}
				$.addTab({title:'单数详情',url:'page/modules/user/viewDetail.html',pk:{vduser:vduser},reload:true});
			}
		});
		//点击一般单数
		$('#userMgtGrid').on('click','.viewOrdinary',function(){
			var index=$('#userMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#userMgtGrid').jqxGrid('getrowdata',index);
				var vduser={
					name:data.name,
					phone:data.telephone,
					ownerId:data.ownerId,
					type:'general'
				}
				$.addTab({title:'单数详情',url:'page/modules/user/viewDetail.html',pk:{vduser:vduser},reload:true});
			}
		});
		//点击加急单数
		$('#userMgtGrid').on('click','.viewUrgent',function(){
			var index=$('#userMgtGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data=$('#userMgtGrid').jqxGrid('getrowdata',index);
				var vduser={
					name:data.name,
					phone:data.telephone,
					ownerId:data.ownerId,
					type:'emergency'
				}
				$.addTab({title:'单数详情',url:'page/modules/user/viewDetail.html',pk:{vduser:vduser},reload:true});
			}
		});
	}
}
