/*
 * 商机管理界面js
 */
var BusoMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/potential';
	var currentRoleName = _global_settings.owner.roleName;
	var boolean=false;
	var dataRes = null;
	var lineData = {};
	var lineArr = [];
	var text='';
	this.id=null;
	
	this.initInput=function(){
		me.initPage();
		me.initWindows();
		me.initSearch();
		me.initGrid(me.searchObj);
	}

	/*
	 *分配商机 弹出框
	 */
	this.distributeSource=function(dataRes){
			//点击添加行
			$('#distributeBuso-tbody').off().on('click','tr',function(){
				if($(this)[0]==$('#distributeBuso-tbody').find('tr').eq(-1)[0]){
					me.addLine();
				}
			})
			
			//点击保存提交编辑后数据
			$('#distributeSourceBuso-save').off().on('click',function(){
				//编辑后保存
				if(me.compareRepeat()){
					Core.alert({message:'所选负责人不能重复！'});
					return false;
				}else if(me.compareEmpty()){
					Core.alert({message:'所选负责人不能为空！'});
					return false;
				}else{
					/*
					 * admin登录下，销售、客服都可分配。
					 * */
					dataRes.sal=[];
					if(currentRoleName=='Sys_Admin'){
						dataRes.custom=[];
						$.each(lineData,function(i,v){
							for(var j=0; j<$('.distributeBuso-user').length; j++){
								if($('.distributeBuso-user').eq(j).val()!=null){
									var ac = $('.distributeBuso-user').eq(j).val(),
										abLoginId = ac.substring(ac.indexOf('(')+1,ac.length-1);
									if(lineData[i].username == abLoginId){
										var map={};
											map.employeeCode = v.employeeCode,
											map.username = v.username,
											map.locked = v.locked,
											map.roles = v.roles;
											map.id = v.id
											if(getSalesInfoByName(abLoginId)!=undefined){
												dataRes.sal.push(map);
											}
											if(getCustomerInfoByName(abLoginId)!=undefined){
												dataRes.custom.push(map);
											}
									}
								}
							}
						});
					}else{
					/*
					*销售登录*分自己名下的员工和别人的销售员工
					*/
						var salesInfo = ComboBoxSources.getRecords('salesInfo');
						$.each(salesInfo,function(i,v){
							for(var j=0; j<$('.distributeBuso-user').length; j++){
								if($('.distributeBuso-user').eq(j).val()!=null){
									var ac = $('.distributeBuso-user').eq(j).val(),
										abLoginId = ac.substring(ac.indexOf('(')+1,ac.length-1);
									if(salesInfo[i].username == abLoginId){
										var map={};
											map.employeeCode = v.employeeCode,
											map.username = v.username,
											map.locked = v.locked,
											map.roles = v.roles;
											map.id = v.id
											dataRes.sal.push(map);
									}
								}
							}
						});
					}
					delete dataRes.boundindex;
					delete dataRes.uid;
					delete dataRes.uniqueid;
					delete dataRes.visibleindex;
					console.log(dataRes);
					Core.AjaxRequest({
						type:"PUT",
						async:false,
						params:dataRes,
						showMsg:false,
						url:_global_settings.service.url+"/potential",
						callback:function(res){
							try{
								setCloseAlertTimeOneSecond();
								$('#busoGrid').jqxGrid('updatebounddata','cells');
							}catch(e){}
						},
						failure:function(e){
						}
					});
				}
			});
			
			//点击删除
			$('#distributeBuso-tbody').on('click','.del',function(event){
			        event.stopPropagation();
					var tr=$(this).parent().parent();
					var indexs =$(this).parent().parent().index();
	
					if($('#distributeBuso-tbody').find('tr').length>1){
						Core.confirm({
							 message:"确定要删除？",
							 confirmCallback:function(){
								 tr.remove();
							 }
						});
					}
			});
			$('#distributeSource-buso').modal('show');
			me.setLineData();
			
			if($('#distributeBuso-tbody').children().length==0){
				$('#distributeSource-buso').modal('show');
				me.setLineData();
			}
	}
	//判断所选内容不能为空
	this.compareEmpty = function(){
		var bool =false;
		for(var i=0; i<$('.distributeBuso-user').length; i++){
			if($('.distributeBuso-user').val() == ''){
				bool = true;
				break;
			}
		}
		return bool;
	}
	
	//判断所选内容不能重复
	this.compareRepeat = function(){
		var bool =false;
		for(var i=0; i<$('.distributeBuso-user').length; i++){
			for(var j=i+1; j<$('.distributeBuso-user').length; j++){
				if($('.distributeBuso-user').eq(i).val()!=''){
					var ac = $('.distributeBuso-user').eq(i).val(),
						ab = $('.distributeBuso-user').eq(j).val();
					var acLoginId = ac.substring(ac.indexOf('(')+1,ac.length-1),
						abLoginId = ab.substring(ab.indexOf('(')+1,ab.length-1);
					if(acLoginId == abLoginId){
						bool = true;
						break;
					}
				}
			}
		}
		return bool;
	}
	
	this.addLine = function(){	
		var index=$('#distributeBuso-tbody').children().length+1;
		var line=$('<tr><td  style="width:80%;"><div class="distributeBuso-user xiuZheng"></div></td><td><i class="md-cancel del"></i></td></tr>');		
		$('#distributeBuso-tbody').append(line);
		line.find('.distributeBuso-user').jqxComboBox({
			source:lineArr,
			theme:currentTheme,
			searchMode:'containsignorecase',
			displayMember: "username", 
			valueMember: "id", 
			width:'100%',
			height:'34px',
			//selectedIndex:i,
	    	placeHolder:"请选择或输入"
		});	
	}
	
	this.setLineData = function(){
		$('#distributeBuso-tbody').html('');
		
		var num =null;
		currentRoleName=='Sys_Admin' ? num = 3:num = 0;
		
		//点击获取负责人
		Core.AjaxRequest({
			type:"GET",
			//showMsg:false,
			async:false,
			dataType:'text',
			url:_global_settings.service.url+"/user/customerSales/"+num,
			callback:function(res){
				//初始化数据
				lineData = JSON.parse(res);
				console.log(lineData);
				
				for(var i=0; i<lineData.length; i++){
					var rd = lineData[i].userInfo.name+'('+lineData[i].username+')';
					lineArr.push(rd);
				}
				if(currentRoleName=='Sys_Admin'){
					if(dataRes.sal.length>0){
						$.each(dataRes.sal,function(i,v){
							var line=$('<tr>'+
									'<td><div class="distributeBuso-user xiuZheng" ></div></td>'+
									'<td style="width:2%"><i class="md-cancel del"></i></td>'+
							'</tr>');
							$('#distributeBuso-tbody').append(line);//加载数据
							
							line.find('.distributeBuso-user').jqxComboBox({
								source:lineArr,
								theme:currentTheme,
								displayMember: "username", 
//								valueMember: "id", 
								width:'100%',
								height:'34px',
								searchMode:'containsignorecase',
								//selectedIndex:i,
					        	placeHolder:"请选择或输入"
							});
							line.find('.distributeBuso-user').val(dataRes.sal[i].userInfo.name+'('+dataRes.sal[i].username+')');
						});
					}
					if(dataRes.custom.length>0){
						$.each(dataRes.custom,function(i,v){
							var line=$('<tr>'+
									'<td><div class="distributeBuso-user xiuZheng" ></div></td>'+
									'<td style="width:2%"><i class="md-cancel del"></i></td>'+
							'</tr>');
							$('#distributeBuso-tbody').append(line);//加载数据
							
							line.find('.distributeBuso-user').jqxComboBox({
								source:lineArr,
								theme:currentTheme,
								displayMember: "username", 
								valueMember: "id", 
								width:'100%',
								height:'34px',
								searchMode:'containsignorecase',
								//selectedIndex:i,
					        	placeHolder:"请选择或输入"
							});
							line.find('.distributeBuso-user').val(dataRes.custom[i].userInfo.name+'('+dataRes.custom[i].username+')');
						});
					}
				}else if(currentRoleName=='customerService'||currentRoleName=='customerManage'||currentRoleName=='secondLevelCustomerManage') {
					if(dataRes.custom.length>0){
						$.each(dataRes.custom,function(i,v){
							var line=$('<tr>'+
									'<td><div class="distributeBuso-user xiuZheng" ></div></td>'+
									'<td style="width:2%"><i class="md-cancel del"></i></td>'+
							'</tr>');
							$('#distributeBuso-tbody').append(line);//加载数据
							
							line.find('.distributeBuso-user').jqxComboBox({
								source:lineArr,
								theme:currentTheme,
								displayMember: "username", 
								valueMember: "id", 
								width:'100%',
								height:'34px',
								searchMode:'containsignorecase',
								//selectedIndex:i,
					        	placeHolder:"请选择或输入"
							});
							line.find('.distributeBuso-user').eq(i).val(dataRes.custom[i].id);
						});
					}
				}else if(currentRoleName == 'salesManage'||currentRoleName == 'secondLevelSalesManage'||currentRoleName == 'salesStaff'){
					if(dataRes.sal.length>0){
						$.each(dataRes.sal,function(i,v){
							var line=$('<tr>'+
									'<td><div class="distributeBuso-user xiuZheng" ></div></td>'+
									'<td style="width:2%"><i class="md-cancel del"></i></td>'+
							'</tr>');
							$('#distributeBuso-tbody').append(line);//加载数据
							
							line.find('.distributeBuso-user').jqxComboBox({
								source:lineArr,
								theme:currentTheme,
								displayMember: "username", 
								valueMember: "id", 
								width:'100%',
								height:'34px',
								searchMode:'containsignorecase',
								//selectedIndex:i,
					        	placeHolder:"请选择或输入"
							});
							$.each(lineData,function(j,k){
								if(lineData[j].id == dataRes.sal[i].id){//自己下面的员工
//									debugger;
									line.find('.distributeBuso-user').eq(i).val(dataRes.sal[i].userInfo.name+'('+dataRes.sal[i].username+')');
								}else{//别人的员工，是不可编辑的。
									var resultId =me.getSales(dataRes.sal[i].id).userInfo.name+'('+me.getSales(dataRes.sal[i].id).username+')';
									line.find('.distributeBuso-user').val(resultId);
//									line.find('.distributeBuso-user').eq(i).jqxComboBox({ disabled:true});
								}
							});
						});
					}
				}
			}
		});
	}
	
	
	/*
	 *初始化页面 
	 */
	this.initPage=function(){
		$('#buso-show').css('display','');
		
		$('#buso-status').dropDownlist({
			source:{'all':'请选择','notContact':'未联系','notSuccess':'未成功','success':'已成功'},
			width:'100%',
			height:34,
			selectedIndex:0,
			dropDownHeight:150
		});
		
		$('#buso-time').dropDownlist({
			source:['请选择','最近一周','最近两周','最近三周','本月','本季度','本年'],
			theme: 'energyblue',
            width: '100%',
            height: '34px',
			selectedIndex:0,
			dropDownHeight:150
		});
		$('#buso-sTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		$('#buso-eTime').datetimeinput({formatString:'yyyy-MM-dd', width: '100%', height: '34px'});
		
		$('#buso-time').on('change',function(){
			setValueById('buso-time','buso-sTime','buso-eTime');
		});
		
		$('#buso-head').comboBox({
			source:ComboBoxSources.getRecords('salesInfo_name'),
			searchMode:'contains',
			displayMember:'name_user',
			valueMember:'username',
			width:'100%'
		});
		
		$('#buso-busi').comboBox({
			source:ComboBoxSources.getRecords('salesAgent_name'),
			searchMode:'contains',
			displayMember:'name_user',
			valueMember:'agentName',
			width:'100%'
		});
		
		$('#buso-show').addClass('hiddendiv');
	}
	
	this.initWindows=function(){
		$('#busoMgtSelectWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:300,
			height:'auto',			
			minWidth: 700, 
			cancelButton: $('#busoMgtSelectCancleBtn'),
			initContent:function(){
				
			}
		}).on({
			'open':function(){
				var cancle='<a class="md-clear float-right closeBtn" style="color:white;position:absolute;top:4px;right:5px"><a>';
		    	$('#busoMgtSelectWin').find('.jqx-window-close-button-background-account').remove();
		    	$('#busoMgtSelectWin').append(cancle);
		    	
		    	//确认选择状态点击小叉号
				$('#busoMgtSelectWin').find('.closeBtn').on('click',function(e){
					var index=$('#busoGrid').jqxGrid('getselectedrowindex');
					var data = $('#busoGrid').jqxGrid('getrowdata',index);
					if (index >= 0 ) {
		                var id = $('#busoGrid').jqxGrid('getrowid', index);
		                $('#busoGrid').jqxGrid('updaterow', id,data);
		                $('#busoGrid').jqxGrid('ensurerowvisible', index);
		            }
					
					$('#busoMgtSelectWin').jqxWindow('close');
				});
			}
		});
		
	}
	
	//获取销售负责人
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
	
	this.initColumns=function(){
		var info=getCurrentInfo();
		
		var getCustAndSale=function(rowdata){
			var html='';
			
			if(info=='sys'){//即可能是销售也可能是客服
				$.each(rowdata.sal,function(i,v){
					html+=getSalesInfoById(v.id).name_user+'&nbsp';
				});
				$.each(rowdata.custom,function(i,v){
					html+=getCustomerInfoById(v.id).name_user+'&nbsp;'
				});
			}else if(info=='sale'||info=='sales'||info=='agent'){//销售
				$.each(rowdata.sal,function(i,v){
					html+=getSalesInfoById(v.id).name_user+'&nbsp';
				});
			}else{
				$.each(rowdata.custom,function(i,v){
					html+=getCustomerInfoById(v.id).name_user+'&nbsp;'
				});
			}
			
			return html;
		}
		
		var columns=[
				{ text: '日期',width:'11.11%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html += rowdata.createDate.substring(0,10);
						return html+'</div>';
					}
				},
				{ text: '潜在客户',dataField:'potentialName',width:'11.11%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
							html += '<a class="hoverspan viewBuso">'+rowdata.potentialName+'</a>';
						return html+'</div>';
					}
				},
				{ text: '联系电话',dataField:'phone',width:'11.11%'},
				{ text: '公司名称',dataField:'contact',width:'11.11%'},
				{ text: '预计成交日期',width:'11.11%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
						return html+rowdata.closingDate.substring(0,10)+'</div>';
					}
				},
			    { text: '代理商(姓名/用户名)',width:'11.11%',hidden:false,
			  	    cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
					    var html = '<div class="agrid">';
						    html+=rowdata.salesAgent==undefined?'':rowdata.salesAgent.userInfo.name+'('+rowdata.salesAgent.agentName+')';
					    return html+'</div>';
				    }  
			    },
			    { text: '(姓名/用户名)',width:'11.11%',
				  	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="agrid">';
						var cs=getCustAndSale(rowdata);
						return html+cs+'</div>';
				   }
			    },
			    { text: '状态',width:'11.11%',
			  	    cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
					    var html = '<div class="p-2" style="height:100%">';
						if(rowdata.status=='success'){
							html+='<div class="agrid">'+'已成功'+'</div>';
						} else if(rowdata.status=='notContact'){ 
							html+='<select class="selectStatus" style="width:100%;height:100%">';
							html+='<option value="notContact">未联系</option>';
							html+='<option value="notSuccess">未成功</option>';
							html+='<option value="success">已成功</option></select>';
						} else {
							html+='<select class="selectStatus" style="width:100%;height:100%">';
							html+='<option value="notSuccess">未成功</option>';
							html+='<option value="success">已成功</option></select>';
						}
						return html+'</div>';
			  	    }
			    },
			    { text: '操作',width:'11.11%',hidden:false,
			  	  	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						var html = '<div class="text-center">';
							if(info!='sale'){
								html += '<a class="hoverspan md-format-list-bulleted distributeSource"  title="分配员工"></a>';
							}
							html+='<a class="hoverspan md-note-add addRemark" title="增加备注"></a>';
						return html+'</div>';
				  	}
			    }
		  ];
		
		var textxs='';
		
		if(info=='sale'||info=='sales'||info=='sys'){
			info=='sys'?textxs='销售负责人/客服':textxs='销售负责人';
			
		}else{
			$('#buso-mgt').remove();
			info=='agent'?textxs='销售负责人':textxs='客服';
			
			for(i in columns){
				columns[i].width='14.27%';
				if(columns[i].hidden==false){
					columns[i].hidden=true;
				}
			}
		}
		
		for(i in columns){
			if(columns[i].text=='(姓名/用户名)'){
				columns[i].text=textxs+'(姓名/用户名)';
			}
		}
		
		return columns;
	}
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('busoGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:me.initColumns(),
    	   enablehover: false,
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#busoGrid').grid(grid_sets);
		
		//点击分配
		$('#busoGrid').on('click','.distributeSource',function(){
			var rowindex = $('#busoGrid').jqxGrid('getselectedrowindex');
			if(rowindex>=0){
				var rowdata = $('#busoGrid').jqxGrid('getrowdata',rowindex);
				dataRes = rowdata;
				console.log(rowdata);
			}
//			$('#distributeSource-buso').modal('show');
			me.distributeSource(dataRes);
		})
		
		//点击增加备注
		$('#busoGrid').on('click','.addRemark',function(){
			var index = $('#busoGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#busoGrid').jqxGrid('getrowdata',index);
				me.id=rowdata.id;
				if(rowdata.status=='success'){
					Core.alert({
						message:'状态已成功，不能添加备注！'
					});
					return false;
				} 
				
				addRemark(rowdata.trackList,rowdata.id,'potentialtrack')
			}
		});
		
		//选择状态
		$('#busoGrid').on('change','.selectStatus',function(){
			if($(this).val()=='success'){
				$('#busoMgtSelectWin').jqxWindow('open',function(){
					var index = $('#busoGrid').jqxGrid('getselectedrowindex');
					if(index>=0){
						var data = $('#busoGrid').jqxGrid('getrowdata',index);
						$('#busoMgtSelecteUserName').val('');
						$('#busoMgtSelecteName').val(data.potentialName);
						$('#busoMgtSelecteCompName').val(data.contact);
						me.id=data.id;
					}
				});
			}
			
			//未成功状态
			if($(this).val()=='notSuccess'){
				var index = $('#busoGrid').jqxGrid('getselectedrowindex');
				var data = $('#busoGrid').jqxGrid('getrowdata',index);
				var url=_global_settings.service.url+'/potential';
				var obj={id:data.id.toString(),status:'notSuccess'};
				Core.confirm({
					bool:true,
					message:'状态改为未成功，请确认？',
					confirmCallback:function(){
						Core.AjaxRequest({
							url:url+'/status',
							type:'PUT',
							async:false,
//							showMsg:false,
							params:obj,
							callback:function(res){
								try{
									$('#busoGrid').jqxGrid('updatebounddata','cells');
								}catch(e){}
							},
							failure:function(res){
								
							}
						});
					},
					cancelCallback:function(){
//						var index = $('#busoGrid').jqxGrid('getselectedrowindex');
			            if (index >= 0 ) {
			                var id = $('#busoGrid').jqxGrid('getrowid', index);
			                $('#busoGrid').jqxGrid('updaterow', id,data);
			                $('#busoGrid').jqxGrid('ensurerowvisible', index);
			            }
					}
				});
			}
		});
		
		//查看详情
		$('#busoGrid').on('click','.viewBuso',function(){
			var index = $('#busoGrid').jqxGrid('getselectedrowindex');
			if(index>=0){
				var rowdata = $('#busoGrid').jqxGrid('getrowdata',index);
				$.addTab({title:'查看商机',isFrame:false,url:'page/modules/buso/viewBuso.html',
					pk:{id:rowdata.id},reload:true});
			}
		});
		
	}	

	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	        updaterow: function (rowid, rowdata, commit) {
	            // synchronize with the server - send update command
	            // call commit with parameter true if the synchronization with the server was successful 
	            // and with parameter false if the synchronization has failed.
	            commit(true);
	        }
	    },
		grid:{element:'busoGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			sortdatafield:'t.createDate',	
			't.createDate':{value:[],action:'between'},
			't.potentialName':{value:[],action:'like'},
			't.status':{value:[],action:'eq'},
			's.username':{value:[],action:'like'},
			't.salesAgent.agentName':{value:[],action:'like'}
		};
		
//		var roleName = ['salesStaff','secondLevelSalesManage','salesManage'];
//		if(roleName.indexOf(currentRoleName)>-1){
//			boolean=true;
//		}
		
//		if(boolean){
//			me.searchObj['s.id']={value:[''+_global_settings.owner.userid+''],action:'eq'};
//		}
//		
//		if(currentRoleName=='customerService'||currentRoleName=='customerManage'||currentRoleName=='secondLevelCustomerManage') {
//			me.searchObj['s.id']={value:[''+_global_settings.owner.userid+''],action:'eq'};
//		}
//		
//		if(currentRoleName=='agentistrator'){
//			me.searchObj['t.salesAgent.id']={value:[''+_global_settings.owner.id+''],action:'eq'};
//		}
		if(currentRoleName=='customerService'||currentRoleName=='salesStaff'){
			me.searchObj['s.id']={value:[''+_global_settings.owner.userid+''],action:'eq'};
		}
	}
	
	this.searchDataInfo = function(){
    	$('#busoGrid').jqxGrid('applyfilters');
    	$('#busoGrid').jqxGrid('refreshfilterrow'); 
    	$('#busoGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#busoGrid').jqxGrid('updatebounddata', 'cells');
    	$('#busoGrid').jqxGrid('clearselection');
    	$('#busoGrid').jqxGrid('refreshdata');
    };
	
}

var BusoBindModle=function(busoMgt){
	var me=this;
	this.search=function(){
		var st = $('#buso-sTime').val(),
			et = $('#buso-eTime').val(),
			potentialName = $('#buso-cust').val(),
			salesname = $('#buso-head').val(),
			agentName = $('#buso-busi').val(),
			status = $('#buso-status').val();
		busoMgt.searchObj['t.createDate'].value=[];
		if(st!=''&&et!=''){
			busoMgt.searchObj['t.createDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
		}
		
		if(st!=''&&et===''){
			busoMgt.searchObj['t.createDate'].value.push(st+' '+'00:00:00');
			busoMgt.searchObj['t.createDate'].action='ge';
		}
		
		if(st===''&&et!=''){
			busoMgt.searchObj['t.createDate'].value.push(et+' '+'23:59:59');
			busoMgt.searchObj['t.createDate'].action='le';
		}

		busoMgt.searchObj['t.potentialName'].value=[];
		if(potentialName!='')
			busoMgt.searchObj['t.potentialName'].value.push(potentialName);
		
		busoMgt.searchObj['t.status'].value=[];
		if(status!='all')
			busoMgt.searchObj['t.status'].value.push(status);
		
		busoMgt.searchObj['s.username'].value=[];
		if(salesname!='')
			busoMgt.searchObj['s.username'].value.push(salesname);
		
		busoMgt.searchObj['t.salesAgent.agentName'].value=[];
		if(agentName!='')
			busoMgt.searchObj['t.salesAgent.agentName'].value.push(agentName);
		
		busoMgt.searchDataInfo();
	}
	
	this.bind=function(){
		//点击搜索
		$('#buso-search').on('click',function(){
			if($('#buso-show').is(':hidden')){
				$('#buso-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
		
		//点击新增
		$('#addbuso-btn').on('click',function(){
			$.addTab({title:'新增商机',url:'page/modules/buso/addBuso.html',reload:true});
		});
		
		//点击状态弹出的保存
		$('#busoMgtSelectSaveBtn').off('click').on('click',function(){
			var url=_global_settings.service.url+'/potential';
			Core.AjaxRequest({
				url:url+'/status',
				type:'PUT',
				async:false,
				params:{id:busoMgt.id,status:'success'},
				callback:function(res){
					$('#busoMgtSelectWin').jqxWindow('close');
					try{
						$('#busoGrid').jqxGrid('updatebounddata','cells');
					}catch(e){}
				},
				failure:function(res){
					
				}
			});
		});
		
		//点击弹出框的取消
		$('#busoMgtSelectCancleBtn').on('click',function(){
            var index = $('#busoGrid').jqxGrid('getselectedrowindex');
            if (index >= 0 ) {
                var id = $('#busoGrid').jqxGrid('getrowid', index);
                var datarow = $('#busoGrid').jqxGrid('getrowdata',index)
                $('#busoGrid').jqxGrid('updaterow', id,datarow);
                $('#busoGrid').jqxGrid('ensurerowvisible', index);
            }
		});
		
		//点击下载模板
		$('#buso-download').off('click').on('click',function(){
			var sUrl = '192.168.1.3:8090/SimpleBss/' ;
			if(getHostName() == 'localhost' || sUrl.indexOf(getHostName())>-1){
				var urls ='/SimpleBss/template/shangji.xls';
				window.open(urls);
			}else{
				window.open('/template/shangji.xls');
			}
		})
		
		//点击导入
		$('#buso-import').off('click').on('click',function(){
			var obj = {url : _global_settings.service.url + '/common/import/Potential/' + _global_settings.owner.userid};
			$('#buso-attachment').html('');
			$('#buso-modal').modal('show');
			$('#buso-attachment').fileuploader(obj);
		});
		
	}
	
	this.unbindAll=function(){
		$('#buso-search').off('click');
		$('#addbuso-btn').off('click');
		$('#busoMgtSaveBtn').off('click');
		$('#distributeSourceBuso-save').off('click');
	}
}

