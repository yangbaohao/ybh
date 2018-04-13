/*
 *查看用户界面js 
 */

var VuMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/accountorder';
	this.id=$.pk.id;
	this.username=$.pk.username;
	this.name=$.pk.name;
	
	this.initInput=function(){
		me.initPage();
		me.initGrid();
	}
	
	this.searchObj={
		sortdatafield:'ex.createDate',
		'ex.loginId':{value:[''+me.username+''],action:'eq'},	
	}
	
	this.searchObj1={};
	
	this.initPage=function(){
		
		Core.AjaxRequest({
			url:_global_settings.service.url+'/owner/ov/'+me.id,
			type:'GET',
			async:false,
			showMsg:false,
			callback:function(res){
				console.log(res);
				me.initRes(res);
			},
			failure:function(){
				
			}
		});
	}
	
	this.initRes=function(res){
		$('#viewuser-name').text(me.username);
		$('#viewuser-company').text(me.name);
		
		if(res.mouthAmt==undefined||res.mouthAmt=='')
			$('#viewsuer-monthamt').text('￥'+0);
		else
			$('#viewsuer-monthamt').text('￥'+res.mouthAmt);
		
		if(res.mouthProductName==undefined)
			$('#viewuser-monthmodule').text('');
		else
			$('#viewuser-monthmodule').text(res.mouthProductName);
		
		if(res.totalAmt==undefined||res.totalAmt=='')
			$('#viewuser-totalamt').text('￥'+0);
		else
			$('#viewuser-totalamt').text('￥'+res.totalAmt);
		
		if(res.totalProductName==undefined)
			$('#viewuser-totalmodule').text('');
		else
			$('#viewuser-totalmodule').text(res.totalProductName);
		
		if(res.taxUser==undefined)
			$('#viewuser-tax').text('');
		else
			$('#viewuser-tax').text(res.taxUser);
		
		if(res.taxStatus==undefined)
			$('#viewuser-status').text('');
		else
			$('#viewuser-status').text(res.taxStatus);
		
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
//		me.settings.source.data = me.searchObj;
		//初始化购买历史数据源
		var demoAdapter = Core.AcDataAdapter('viewUserHaveBuy', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		me.setting1.source.data = me.searchObjs;
		me.setting1.source.url = _global_settings.service.url+'/user/search/userAccess/'+me.id+'/0/'+_global_settings.owner.roleName;
		//初始化浏览历史数据源
		var demoAdapter1 = Core.AcDataAdapter('viewUserHaveVisit', me.setting1.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化购买历史Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[								
				{ text: '订单号',width:'20%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            			html +='<a class="hoverspan viewUserOrder">'+rowdata.orderCode+'</a>';
  	            		return html+'</div>';
					}
				},
				{ text: '订单模块',dataField:'productName',width:'20%'},
  	            { text: '总金额',dataField:'totalAmt',cellsformat: 'c2',width:'15%'},
  	            { text: '订单时间',width:'15%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            		return html+rowdata.orderCreateDate.substring(0,10)+'</div>';
					}
  	            },
  	            { text: '到期时间',width:'15%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            		return html+rowdata.orderEndDate.substring(0,10)+'</div>';
					}
  	            },
  	            { text: '状态',width:'15%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            		return html+getCodeData(rowdata.payStatus)+'</div>';
					}
  	            }
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#viewUserHaveBuy').grid(grid_sets);
		
		//初始化浏览历史Grid
		var grid_set = {
	  	    source:demoAdapter1,
			columnsresize: false,
			autorowheight: true,
		    autoheight: true,
		    columnsheight: 45,
//    	    pagesize: 1,
		    pageable:false,
//		    altrows:true,
//		    enablehover: false,
//		    sortable:false,
		    rendergridrows: function(){
	            return demoAdapter1.records;
	        }
    	   ,columns:[								
				{ text: '访问时间',dataField:'createDate',width:'25%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas) {
						var html='<div class="JournalDiv" style="position: relative; top:50%; margin-top:-6px; text-align: center;text-overflow: ellipsis;overflow: hidden;">';
						return html+rowdatas.createDate+'</div>';
					}
				},
				{ text: '访问模块',dataField:'remark',width:'25%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
				    	if(rowdatas.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdatas.accessList.length; i++){
				    			a=rowdatas.accessList[i].remark;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
			    },
				{ text: '访问次数',width:'25%',
			    	cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
				    	if(rowdatas.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdatas.accessList.length; i++){
				    			a=rowdatas.accessList[i].remarkNum;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
				},
				{ text: '停留时间(分)',width:'25%',
					cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdatas){
				    	if(rowdatas.accessList!==undefined){
				    		var html='',a='';
				    		for(var i=0; i<rowdatas.accessList.length; i++){
				    			a=rowdatas.accessList[i].remarkSecond;
			    				html+='<div class="JournalDiv" style="position: relative; border-top: 1px solid  #EBEFF2;text-overflow: ellipsis;overflow: hidden;" title='+a+'>'+a+'</div>';
					    	}
				    		return '<div style="height:auto;">'+html+'</div>';
				    	}
			    	}
				}
	  	    ],
	    };
		$('#viewUserHaveVisit').grid(grid_set);
		
		//点击单号
		$('#viewUserHaveBuy').on('click','.viewUserOrder',function(){
			var index = $('#viewUserHaveBuy').jqxGrid('getselectedrowindex');
			if(index>=0){
				var data = $('#viewUserHaveBuy').jqxGrid('getrowdata',index);
				console.log(data);
				
				var obj={"condition":[],"filterscount":0,"groupscount":0,"pagenum":0,"pagesize":100};
	   			obj.condition.push({"value":[data.id.toString()],"action":"eq","key":"accountOrder.id"});
	   			var sub=new Base64().encode(JSON.stringify(obj));
	   			Core.AjaxRequest({
	   	            url : _global_settings.service.url+'/accountOrderPay/page/'+sub,
	   	            type: 'GET',
	   	            callback: function(res) {
	   	            	var data=res.rows[0];
	   	            	console.log(data);
	   	            	$.addTab({title:'订单详情',url:'page/modules/prod/viewOrder.html',pk:
	  	   			   {data:data.accountOrder,amount:data.totalAmt,orderCode:data.accountOrder.orderCode,vouchers:data.vouchers,name:me.name},reload:true});
	   	            	console.log(res);
	   	            },
	   	            failure:function(res){
	   	            	
	   	            }
	   	        });
			}
		});
		
		//点击更多
		$('.viewMoreVist').on('click',function(){
			$.addTab({title:'浏览历史人数',isFrame:false,url:'page/modules/user/viewUserMoreVisit.html',
				pk:{id:me.id,username:me.username,name:me.name},reload:true});
		});
	}
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'viewUserHaveBuy'},
		ajax:{url:url},
	};
	
	this.setting1 = {  
			source:{
//		        url: _global_settings.service.url+'/user/search/userAccess/'+me.username+'/'+_global_settings.owner.roleName,
		        data:me.searchObj1,
		    },
			grid:{element:'viewUserHaveVisit'},
			ajax:{url:url},
		};
}

var VuBindModle=function(vuMgt){
	var me=this;
	
	this.bind=function(){
		
	}
	
	this.unbindAll=function(){
		
	}
}
