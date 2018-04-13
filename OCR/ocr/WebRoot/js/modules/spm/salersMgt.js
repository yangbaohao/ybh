/**
 * 销售人员管理界面js
 * 
 * 需要说明的几点
 * 
 * 1.此页面需要注意的是分页接口在core.js里面对jqxHRSettings.url进行了处理.
 * 
 * 2.单个日期搜索采用最大最小值进行处理,并且日期搜索是放在接口上，无需加密的。
 * 
 * 3.点击查看详情页面会依据分页的变化而联动到详情的变化，也有对日期进行处理的操作.
 * 
 * 4.批量分配用户原则是把自己下面的直接发展的用户分配给别人
 * 
 */
var SaleMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user';
	var url2=_global_settings.service.url+'/owner';
	var currentRoleName = _global_settings.owner.roleName;
	var resRows = null;
	var indexId = null;
	var ids = null;
	this.debug=false;
	this.data=null;
	
	this.initInput=function(){
		me.initUserPage();
		me.initWindows();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	//把日期检索条件放到接口上，不加密的形式,日期不填写为0传入后台
	var beginDate = 0,
		endDate = 0;

	var sub = {"condition":[],"filterscount":0,"groupscount":0,"pagenum":0,"pagesize":20};
	var url3 = {url: {value: [ url+'/sales/0/'+beginDate+'/'+endDate +'/'+ new Base64().encode(JSON.stringify(sub))] } };
	
	this.setUrl = function(obj) {
		var st = $('#sale-sTime').find('input').val(),
			et = $('#sale-eTime').find('input').val();
		if(st==null || st==undefined || st===''){
			st = 0;
		}
		if(et==null || et==undefined || et===''){
			et = 0;//此处两个if，是处理如果只填写一个日期的情况下，将日期起始日期最小化，截止日期最大化
		}
		url3.url = {value: [ url+'/sales/0/'+st+'/'+et+'/'+ obj ] };
		//此处obj是参数，就是me.initInformation()返回的obj
	}
	/*
	 * 初始化页面
	 */
	this.initUserPage=function(){
		$('#sale-show').css('display','');
		
		$('#sale-time').jqxDropDownList({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#sale-sTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		$('#sale-eTime').datetimeinput({formatString:"yyyy-MM-dd", width: '100%', height: '34px'});
		
		$('#sale-time').on('change',function(){
			setValueById('sale-time','sale-sTime','sale-eTime');
		});
		
		$('#sale-sp').comboBox({
			theme : currentTheme,
			source : ComboBoxSources.getRecords('salesInfo_name'),
			searchMode : 'contains',
			displayMember : 'name_user',
			valueMember : 'username',
			height : 34,
			width : '100%',
			placeHolder: "请选择或输入"
		});
		
		$('#sale-status').jqxDropDownList({
			source:{'all':'请选择','N':'启用','Y':'禁用'},
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		
		$('#sale-show').addClass('hiddendiv');
	}
	
	this.initWindows=function(){
		$('#disableSalersWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:300,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#cancelDisableSalersBtn'),
			initContent:function(){
				$('#disableSalers-yn').jqxDropDownList({
					source:{'false':'否','true':'是'},
					width:'100%',
					height:34,
					selectedIndex:0
				});
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#disableSalers-yn').jqxDropDownList({selectedIndex:0});
			},500);
		});
		
		$('#partMoreUserWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1200,
			minHeight:380,
			height:'auto',			
			minWidth: 750, 
			cancelButton: $('#partMoreUser-cancel'),
			initContent:function(){
			}
		}).on({
			'close':function(){
				setTimeout(function(){
					$('#partMoreUserTbody').jqxGrid('clearselection');
				},500);
			}
		});
		
	}
	
	//获取销售人员
	this.getSales=function(id){
		var rd = ComboBoxSources.getRecords('salesInfo');
		for(var i=0;i<rd.length;i++){
			if(rd[i].id==id){
				return rd[i];
			}
		}
		if(!id){
			return '';
		}
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('saleGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[								
				{ text: '销售人员(姓名/用户名)',width:'15%',height:'40px',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html += rowdata.sales.username;
						return html+'</div>';
					}
				},
				{ text: '拥有代理商',width:'9%',height:'40px',
					cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
						var html='<div class="agrid">';
							html+='<a class="hoverspan viewOwnAgent">'+rowdata.salesAgentNum+'</a>';
						return html+'</div>';
					}
				},
				{ text: '成功客户',width:'9%',height:'40px',
					cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
						var html='<div class="agrid">';
							html+='<a class="hoverspan viewOwnSuccessUser">'+rowdata.ownerNum+'</a>';
						return html+'</div>';
					}
				},
				{ text: '付费客户',dataField:'feeNum',width:'9%',height:'40px',
					cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
						var html='<div class="agrid">';
							html+='<a class="hoverspan viewOwnPaidUser">'+rowdata.feeNum+'</a>';
						return html+'</div>';
					}
				},
				{ text: '直销',dataField:'salesNum',columngroup:'monResult',cellsalign:'right', cellsformat: 'c2',width:'10%',height:'20px'},
  	            { text: '商机销',dataField:'potentialNum',columngroup:'monResult',cellsalign:'right', cellsformat: 'c2',width:'10%',height:'20px'},
  	            { text: '代理销',dataField:'agentSaleNum',columngroup:'monResult',cellsalign:'right', cellsformat: 'c2',width:'10%',height:'20px'},
  	            { text: '状态',width:'10%',height:'40px'},
  	            { text: '是否禁用',width:'8%',height:'40px',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
						if(rowdata.sales.locked!=null&&rowdata.sales.locked!=undefined){
							html += getCodeData(rowdata.sales.locked);
						}
						return html+'</div>';
					}
  	            },
  	            { text: '操作',width:'10%',height:'40px',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="text-center">';
							html += '<a class="hoverspan md-format-list-bulleted partMoreUser" title="分配信息"></a>';
							html += '<a class="hoverspan md-error disableSalersBtn" title="禁用"></a>';
						return html+'</div>';
					}
  	            }
	  	    ],
	  	    columngroups: [
	  	           { text: '本月业绩', align: 'center', name: 'monResult',height:'20px'}
            ],
    	   pagesize: 20,
    	   columnsheight: 30
	    };
		$('#saleGrid').grid(grid_sets);
		
		//点击拥有代理商
		$('#saleGrid').on('click','.viewOwnAgent',function(){
			var index = $('#saleGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#saleGrid').jqxGrid('getrowdata',index);
				var startDates = $('#sale-sTime').find('input').val(),
					endDates = $('#sale-eTime').find('input').val();
				if(startDates==null || startDates==undefined || startDates===''){
					startDates = '2015-01-01';
				}
				if(endDates==null || endDates==undefined || endDates===''){
					endDates = getNowFormatDate();//此处两个if，是处理如果只填写一个日期的情况下，将日期起始日期最小化，截止日期最大化
				}
				$.addTab({title:'查看拥有代理商',isFrame:false,url:'page/modules/spm/viewOwnAgent.html',
					pk:{id:rowdata.sales.id,agentName:rowdata.sales.username,beginDate:startDates,endDate:endDates},reload:true});
			}
		});
		
		//点击成功用户
		$('#saleGrid').on('click','.viewOwnSuccessUser',function(){
			var index = $('#saleGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#saleGrid').jqxGrid('getrowdata',index);
				var startDates = $('#sale-sTime').find('input').val(),
					endDates = $('#sale-eTime').find('input').val();
				if(startDates==null || startDates==undefined || startDates===''){
					startDates = '2015-01-01';
				}
				if(endDates==null || endDates==undefined || endDates===''){
					endDates = getNowFormatDate();//此处两个if，是处理如果只填写一个日期的情况下，将日期起始日期最小化，截止日期最大化
				}
				$.addTab({title:'查看成功用户',isFrame:false,url:'page/modules/spm/viewOwnSuccessUser.html',
					pk:{id:rowdata.sales.id,agentName:rowdata.sales.username,employeeCode:rowdata.sales.employeeCode,beginDate:startDates,endDate:endDates},reload:true});
			}
		});
		
		//点击付费用户
		$('#saleGrid').on('click','.viewOwnPaidUser',function(){
			var index = $('#saleGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#saleGrid').jqxGrid('getrowdata',index);
				var startDates = $('#sale-sTime').find('input').val(),
					endDates = $('#sale-eTime').find('input').val();
				if(startDates==null || startDates==undefined || startDates===''){
					startDates = '2015-01-01';
				}
				if(endDates==null || endDates==undefined || endDates===''){
					endDates = getNowFormatDate();//此处两个if，是处理如果只填写一个日期的情况下，将日期起始日期最小化，截止日期最大化
				}
				$.addTab({title:'查看付费用户',isFrame:false,url:'page/modules/spm/viewOwnPaidUser.html',
					pk:{id:rowdata.sales.id,agentName:rowdata.sales.username,employeeCode:rowdata.sales.employeeCode,beginDate:startDates,endDate:endDates},reload:true});
			}
		});
		
		//点击禁用
		$('#saleGrid').on('click','.disableSalersBtn',function(){
			var index = $('#saleGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#saleGrid').jqxGrid('getrowdata',index);
				me.data = rowdata;
				$('#disableSalersWin').jqxWindow('open');
				$('#disableSalers-name').val(rowdata.sales.username);
				$('#disableSalers-name').attr('data-id',rowdata.sales.id);
			}
		});
		
		//保存禁用
		$('#disableSalersBtn').on('click',function(){
			var bn = $('#disableSalers-yn').val();
			var ids = $('#disableSalers-name').attr('data-id');//将rowdata.sales.id放进属性data-id里方便保存的时候拿到
			Core.AjaxRequest({
				url:_global_settings.service.url+'/user/lock/'+ ids +'/'+bn,
				type:'PUT',
				async:false,
				showMsg:false,
				callback:function(){
					setCloseAlertTimeOneSecond();
					$('#disableSalersWin').jqxWindow('close');
					$('#saleGrid').jqxGrid('updatebounddata','cells');
				},
				failure:function(){
				}
			});
		});
		
		function initPartMoreUserWin(data) {
			$('#partMoreUserWin').jqxWindow('open',function(){
				var se={
					localdata: data,
		            datatype: 'json'
			    }
				
				var demo = new $.jqx.dataAdapter(se);
				//初始化Grid
				$('#partMoreUserTbody').jqxGrid({
		            source: demo,
		            width:'100%',
		            height:220,
		            pageable:false,
		            selectionmode:'checkbox',
		            columns: [
		              { text: '注册日期',width:'20%',
		            	  cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
								var html='<div class="agrid">';
									html+= rowdata.createDate.substring(0,10);
								return html+'</div>';
							}
		              },
		              { text: '用户名',width:'25%',
		            	  cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
								var html='<div class="agrid">';
									html+= rowdata.loginId;
								return html+'</div>';
							}
		              },
		              { text: '电话号码',width:'20%',
		            	  cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
								var html='<div class="agrid">';
									html+= rowdata.enterpriseInfo.telephone;
								return html+'</div>';
							}
		              },
		              { text: '公司名称',width:'30%',
		            	  cellsrenderer:function(rowindex,columnfield,value,defaulthtml,columnproperties,rowdata){
								var html='<div class="agrid">';
									html+= rowdata.enterpriseInfo.name;
								return html+'</div>';
							}
		              },
		            ]
		        });
			});
		}
		
		//查看批量分配用户
		$('#saleGrid').on('click','.partMoreUser',function(){
			var index = $('#saleGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#saleGrid').jqxGrid('getrowdata',index);
				ids = rowdata.sales.id;
				
				var obj={"condition":[],"filterscount":0,"groupscount":0,"pagenum":0,"pagesize":100};
	   			var sub=new Base64().encode(JSON.stringify(obj));
	   			
	   			Core.AjaxRequest({
					url:url2+'/getownerlist/0/'+sub,
					type:'GET',
					async:false,
					callback:function(data){
						resRows = data.rows;
						initPartMoreUserWin(data.rows);
					},
					failure:function(e){
					}
				});
			}
		});
		
		$('#partMoreUserTbody').on('rowselect',function() {
			var index = $('#partMoreUserTbody').jqxGrid('getselectedrowindexes');
			indexes = index;
		});
		
		//保存*****批量分配用户
		$("#partMoreUser-save").on('click',function(){
			var arr = [];
			var resultId = null;
			var len =$('#partMoreUserTbody').jqxGrid('getselectedrowindexes');
			
			if(resRows==undefined||resRows==''||resRows==null){
				Core.alert({message:'暂无用户可分配！'});
			}else{
				if(len.length==0){
					Core.alert({message:'所选负责人不能为空！'});
				}else if(indexId!=undefined || len.length>0){
					
					var index = $('#saleGrid').jqxGrid('getselectedrowindexes');
					var rowdata = $('#saleGrid').jqxGrid('getrowdata',index);
					var employeeCode = rowdata.sales.employeeCode;
					
					$.each(len,function(i,v){
						indexId = resRows[len[i]].id;
						arr.push(indexId);
					});
					resultId = arr.join(",");
						
					Core.AjaxRequest({
						url:url2+'/writeownerlist/'+resultId+'/'+ids+'/'+employeeCode+'/0',
						type:'POST',
						async:false,
						showMsg:false,
						callback:function(data){
							setCloseAlertTimeOneSecond();
							$('#partMoreUserTbody').jqxGrid('clearselection');
							$('#partMoreUserWin').jqxWindow('close');
							try{
								$('#saleGrid').jqxGrid('updatebounddata','cells');
								$('#userMgtGrid').jqxGrid('updatebounddata','cells');
							}catch(e){}
						},
						failure:function(e){
						}
					});
				}
			}
		});
	}	
	
	this.settings = {  
		source:{
	        data:me.searchObj,
	        url: url3.url.value[0],//此处url设定是根据core.js里面的jqxHRSettings.url的设置.
	        dataUrl:url3,
	    },
		grid:{element:'saleGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'username':{value:[],action:'like'},
			'locked':{value:[],action:'eq'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#saleGrid').jqxGrid('applyfilters');
    	$('#saleGrid').jqxGrid('refreshfilterrow'); 
    	$('#saleGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#saleGrid').jqxGrid('updatebounddata', 'cells');
    	$('#saleGrid').jqxGrid('clearselection');
    	$('#saleGrid').jqxGrid('refreshdata');
    };
}

var SaleBindModle=function(saleMgt){
	var me=this;
	
	
	this.search=function(bool){
		var salesVal = $('#sale-sp').find('input').val();
		var salesSubName = salesVal.substring(salesVal.indexOf('(')+1,salesVal.length-1);
		var salesname = getSalesInfoByName(salesVal)==undefined?
				getSalesInfoByName(salesSubName)==undefined?'':getSalesInfoByName(salesSubName).username:
					getSalesInfoByName(salesVal).username;
		var salestatus=$('#sale-status').val();
		
		saleMgt.searchObj['username'].value=[];
		if(salesname!=null && salesname!='')
			saleMgt.searchObj['username'].value.push(salesname);	
		
		saleMgt.searchObj['locked'].value=[];
		if(salestatus!='all')
			saleMgt.searchObj['locked'].value.push(salestatus);
		
		if(bool){
			return saleMgt.searchObj;
		}
			
		saleMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#sale-search').on('click',function(){
			if($('#sale-show').is(':hidden')){
				$('#sale-show').slideDown('slow');
			}else{
				//将getConditionParams返回的obj对象作为参数传入到本页面独特的url请求函数中
				saleMgt.setUrl( getConditionParams(me.search(true)) );
				me.search();
			}
		});
		hiddenAclick();
	}
	
	this.unbindAll=function(){
		$('#sale-search').off('click');
	}
}