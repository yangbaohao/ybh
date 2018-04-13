/*
 *短信发送界面js 
 */

var MesSendMgt=function(){
	var me=this;
	this.id=null;
	var url=_global_settings.service.url+'/shortmessage';
	this.chooseData=null;
	this.chooseIndex=[];
	
	this.initInput=function(){
		me.id=$.pk.id;
//		console.log(id);
		
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.settings = {  
		source:{
	        url: url+'/nosend/'+$.pk.id,
	        data:me.searchObj
	    },
		grid:{element:'mesSendGrid'},
		ajax:{url:url},
	};
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('mesSendGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var	grid_sets = {
	  	     source:demoAdapter
		     ,rendergridrows: function(){
                  return demoAdapter.recordids;
             }
    	     ,columns:[
						{ text: '导入时间',width:'19.6%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
								return html+rowdata.createDate.substring(0,10)+'</div>';
							}
						},
						{ text: '主题',width:'19.6%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
									html += '<a class="hoverspan custViewMes" data-index="'+rowIndex+'">'+rowdata.batchNum+'</a>';
								return html+'</div>';
							}
						},
						{ text: '数量',dataField:'num',width:'19.4%'},
						{ text: '备注',dataField:'remark',width:'19.4%'},
						{ text: '状态',width:'19.4%',
							cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
								var html = '<div class="agrid">';
								return html+getCodeData(rowdata.status)+'</div>';
							}
						}
    	            ],
    	     enablehover: false,
    	     selectionmode:'checkbox',
    	     pagesize: 20,
    	     columnsheight: 45
	    };
		
		$('#mesSendGrid').grid(grid_sets);
		
		//点击主题
		$('#mesSendGrid').on('click','.custViewMes',function(){
			var index = $(this).attr('data-index');
			if(index>=0){
				var rowdata = $('#mesSendGrid').jqxGrid('getrowdata',index);
				console.log(rowdata);
				$.addTab({title:'查看客户',isFrame:false,url:'page/modules/buso/viewCust.html',
					pk:{batchNum:rowdata.batchNum,date:rowdata.createDate},reload:true});
			}
		});
		
		$('#mesSendGrid').on('rowselect',function (event){
			var index = $('#mesSendGrid').jqxGrid('getselectedrowindexes');
			me.chooseIndex=[];
//			debugger;
			$.each(index,function(i,v){
				var rowdata = $('#mesSendGrid').jqxGrid('getrowdata',index[i]);
				if(rowdata!=undefined){
					if(index[i]!=undefined)
					me.chooseIndex.push(index[i]);
				}
			});
			
			if(index.length==1){
				var data = $('#mesSendGrid').jqxGrid('getrowdata',index[0]);
				$('#mesSend-zt').text(data.batchNum);
				me.chooseData=data;
			} else {
				$('#mesSend-zt').text('');
				me.chooseData=null;
			}
			
//			console.log('chooseIndex:'+me.chooseIndex);
			
		});
		
		$('#mesSendGrid').on('rowunselect',function() {
			var index = $('#mesSendGrid').jqxGrid('getselectedrowindexes');
			me.chooseIndex=[];
			
			$.each(index,function(i,v){
				var rowdata = $('#mesSendGrid').jqxGrid('getrowdata',index[i]);
				if(rowdata!=undefined){
					if(index[i]!=undefined)
					me.chooseIndex.push(index[i]);
				}
			});
			
			if(index.length==1){
				var data = $('#mesSendGrid').jqxGrid('getrowdata',index[0]);
				$('#mesSend-zt').text(data.batchNum);
				me.chooseData=data;
			} else {
				$('#mesSend-zt').text('');
				me.chooseData=null;
			}
			
//			console.log('chooseIndex:'+me.chooseIndex);
			
		});
	}
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			
		};
	}
}

var MesSendBindModle=function(mesSendMgt){
	var me=this;
	var url=_global_settings.service.url+'/shortmessage';
	
	this.bind=function(){
		//点击发送短信
		$('#mesSend-send').on('click',function(){
//			debugger;
			if(mesSendMgt.chooseIndex.length==0||mesSendMgt.chooseIndex.length>1){
				Core.alert({message:'请选择一个主题！'});
				return false;
			}
			
			$('#mesSend-send').attr('disabled',true);
			setTimeout(function(){
				$('#mesSend-send').removeAttr('disabled');
			},2000);
			Core.AjaxRequest({
				type:'GET',
				url:url+'/sendmessage/'+mesSendMgt.id+'/'+mesSendMgt.chooseData.batchNum,
				async:false,
				callback:function(){
					//刷新.
					$('#mesSend-zt').text('');
					$('#mesSendGrid').jqxGrid('updatebounddata','cells');
					$('#mesSendGrid').jqxGrid('clearselection');
					try{
						$('#mesMgtGrid').jqxGrid('updatebounddata','cells');
					}catch(e){}
				},
				failure:function(){
					
				}
			});
		});
	}
	
	this.unbindAll=function(){
		$('#mesSend-send').off('click');
	}
}