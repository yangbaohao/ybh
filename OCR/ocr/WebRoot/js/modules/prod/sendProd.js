/*
 * 赠送产品界面js
 */

var SpMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/user/search/userbuy/0/0/'+_global_settings.owner.roleName;
	this.debug=false;
	this.data=$.pk.data;
	this.arr=[];
	
	this.initInput=function(){
		me.initPage();
		me.initSearch();
		me.initValidator();
		me.initGrid(me.searchObj);
	}
	
	this.initPage=function(){
		$('#sendProd-save').attr('disabled',true);
		$('#sendProd-show').addClass('hiddendiv');
		
		$('#sendProd-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#sendProd-type').dropDownlist({
			source:{'GIVE':'赠送','OFFLINE':'线下支付'},
			width:'100%',
			height:34,
			selectedIndex:0
		});
		
		$('#sendProd-sTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#sendProd-eTime').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#sendProd-stimes').datetimeinput({value:new Date(),formatString:'yyyy-MM-dd',height:34,width:'100%'});
		$('#sendProd-etimes').datetimeinput({formatString:'yyyy-MM-dd',height:34,width:'100%'});
		
		$('#sendProd-time').on('change',function(){
			setValueById('sendProd-time','sendProd-sTime','sendProd-eTime');
		});
	};
	
	//初始化grid
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('sendProductGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, me.debug);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(params){
                return demoAdapter.recordids;
            }
    	   ,columns:[
					{ text: '注册日期',editable: false,width:'20%',
						cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
							var html = '<div style="padding-top:6px">';
							return html+rowdata.createDate.substring(0,10)+'</div>';
						}
					},
					{ text: '用户名',editable: false,dataField:'username',width:'20%'},
					{ text: '电话号码',editable: false,dataField:'telephone',width:'20%'},
					{ text:'公司名称',editable: false,dataField:'name',width:'20%'},
					{ text:'金额',dataField:'money',cellsalign:'right', cellsformat: 'c2',width:'17.47%'}
				],
		   selectionmode:'checkbox',
    	   pagesize: 20,
    	   columnsheight: 45,
    	   editable: true,
    	   ready:function(){
//    		   var rows = $('#comnMgtGrid').jqxGrid('source');
//    		   console.log(rows);
    	   }
	    };
		$('#sendProductGrid').grid(grid_sets);
		
		//点击复选框
		$('#sendProductGrid').on('rowselect',function (event){
		    var index = $('#sendProductGrid').jqxGrid('getselectedrowindexes');
		    me.arr=index;
		    if(me.arr.length!=0)
		    	$('#sendProd-save').removeAttr('disabled');
		    else
		    	$('#sendProd-save').attr('disabled',true);
		});
		
		$('#sendProductGrid').on('rowunselect',function (event){
		    var index = $('#sendProductGrid').jqxGrid('getselectedrowindexes');
		    me.arr=index;
		    if(me.arr.length!=0)
		    	$('#sendProd-save').removeAttr('disabled');
		    else
		    	$('#sendProd-save').attr('disabled',true);
		});
	}	
	
	this.settings = {  
		source:{
	        url: url,
	        data:me.searchObj,
	    },
		grid:{element:'sendProductGrid'},
		ajax:{url:url}
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			'owner0.createDate':{value:[],action:'between'},	
			'owner0.loginId':{value:['--1'],action:'like'},
			'owner0.regTelephone':{value:[],action:'like'}
		}	
	};
	
	this.searchDataInfo = function(){
    	$('#sendProductGrid').jqxGrid('applyfilters');
    	$('#sendProductGrid').jqxGrid('refreshfilterrow'); 
    	$('#sendProductGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#sendProductGrid').jqxGrid('updatebounddata', 'cells');
    	$('#sendProductGrid').jqxGrid('clearselection');
    	$('#sendProductGrid').jqxGrid('refreshdata');
    };
    
    this.initValidator=function(){
    	$('#sendProductPage').jqxValidator({
			hintType: 'label',
    		animationDuration: 1
           ,rules: [
                { input: '#sendProd-etimes', message: "不能为空", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val()=='') return false;
                		return true;
                	}
                },
                { input: '#sendProd-etimes', message: "必须大于开始日期", action: 'keyup, blur', 
                	rule:function(input,commit){
                		if(input.val()<=$('#sendProd-stimes').val()) return false;
                		return true;
                	}
                }
			]
    	});
    }
}

var SpBindModle=function(spMgt){
	var me=this;
	var url=_global_settings.service.url+'/billingProductPermission/create'
	
	this.search=function(){
		var username=$('#sendProd-username').val(),telephone=$('#sendProd-phone').val(),
			st=$('#sendProd-sTime').val(),et=$('#sendProd-eTime').val();
		
		spMgt.searchObj['owner0.loginId'].value=[];
		if(username!='')
			spMgt.searchObj['owner0.loginId'].value.push(username);
		
		spMgt.searchObj['owner0.createDate'].value=[];
		if(st!=''&&et!='')
			spMgt.searchObj['owner0.createDate'].value.push(st,et);
		
		spMgt.searchObj['owner0.regTelephone'].value=[];
		if(telephone!='')
			spMgt.searchObj['owner0.regTelephone'].value.push(telephone);
		
		spMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#sendProd-search').on('click',function(){
			me.search();
		});
		
		//点击取消
		$('#sendProd-cancle').on('click',function(){
			$.closeTab();
		});
		
		//点击确定
		$('#sendProd-save').on('click',function(){
			var ids=[];
			var st=$('#sendProd-stimes').val(),et=$('#sendProd-etimes').val(),type=$('#sendProd-type').val();
			var obj={};
			obj.permission=spMgt.data.permission,obj.accountProduct={id:spMgt.data.id},
			obj.startDate=st+' '+'00:00:00',obj.endDate=et+' '+'23:59:59';
			
			$.each(spMgt.arr,function(i){
				var data = $('#sendProductGrid').jqxGrid('getrowdata',spMgt.arr[i]);
				if(data!=undefined && data.ownerId != ''){
					ids.push(data.ownerId);
				}
			});
			
			var amtarr= $('#sendProductGrid').jqxGrid('getselectedrowindexes');
			var list='';
			if(type==='OFFLINE'){
				for(var i=0;i<amtarr.length;i++){
					var l=$('#sendProductGrid').jqxGrid('getrowdata',amtarr[i]).money;
					if(l==undefined&&type==='OFFLINE') {
						Core.alert({message:'请填写选中行的金额'});
						return false;
					}
					list+=l+',';
					list=list.substring(0,list.length-1);
				}
			}else{
				list = -1;
			}
			
			
			if($('#sendProductPage').jqxValidator('validate')){
				Core.confirm({
					message:'确认要给所选用户赠送'+spMgt.data.productName+'吗？',
					confirmCallback:function(){
						Core.AjaxRequest({
							url:url+'/'+ids+'/'+type+'/'+list,
							type:'POST',
							async:false,
							params:obj,
							showMsg:false,
							callback:function(){
								setCloseAlertTimeOneSecond();
								$('#sendProductGrid').jqxGrid('clearselection');
								$('#sendProductGrid').jqxGrid('updatebounddata','cells');
							}
						});
					}
				});
			}
		});
	}
	
	this.unbindAll=function(){
		$('#sendProd-search').off('click');
		$('#sendProd-cancle').off('click');
		$('#sendProd-save').off('click');
	}
}