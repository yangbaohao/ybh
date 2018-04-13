/*!
 *  Author:dingwenyuan
 *  email:492055811@qq.com
 */
(function(){
	var powerStatus=function(json,nodelist,pk,hadSon,dataStatus,boss){
		var me=this;
		me.json=$.extend(true,{},json);
		me.json.createBy=[me.json.createBy,','+me.json.createBy+','+me.json.privilege+_global_settings.owner.admin];
		me.nodelist=$.extend(true,{},nodelist);
		me.pk=pk;
		me.hadSon=hadSon;//false:无凭证关联，已完成可作废
		me.dataStatus=dataStatus;//数据权限字符串
		me.boss=boss;//true:我是老板
		me.bizStatus=this.json.bizStatus;
		me.bpmnStatus=this.json.bpmnStatus;
		me.payStatus=this.json.payStatus;
		me.orderStatus=this.json.orderStatus;	
		me.deliveryStatus=this.json.deliveryStatus;
		me.returnStatus=this.json.returnStatus;
	};
	
	//return false:表示是当前人可操作
	var getCreateBy=function(createBy,dataStatus,boss){
		//debugger
		var createBy=createBy;
		var username=_global_settings.owner.username;
		if(boss) return false;		
		if(_global_settings.owner.dataFlag=='true'){
			//if(_global_settings.owner.roleName.indexOf('管理')>-1) return false;
			if(_global_settings.owner.dataFunctions.indexOf(dataStatus)>-1){
				if(createBy[1].toString().indexOf(username)>-1){
					return false;
				}
			}		
		}
		if(username==createBy[0]){
			return false;
		}	
		return true;
	}
	
	powerStatus.prototype.createby=function(json){
		var CreatBy=this.json.createBy;
		var dataStatus=this.dataStatus;
		var bool=getCreateBy(CreatBy,dataStatus);
		for(var i in json){
			if(bool){
				$('#'+json[i]).remove();
			}
		}
	}

	powerStatus.prototype.bpmn=function(json,pk){
		var BpmnStatus=this.bpmnStatus;
		//var hadSon=this.hadson;
		if(BpmnStatus==null){
			return true;
		}
		var hadSon=this.hadSon;
		var CreatBy=this.json.createBy;
		var dataStatus=this.dataStatus;
		var boss=this.boss;
		console.info(BpmnStatus,CreatBy,json,pk);
		var pass=true;
		for(var i in json){
			if(json[i]==''){
				json[i]=new Date().getTime()+Math.random();
			}
			if(i=='付款'||i=='收款'){
				if(BpmnStatus!='COMPLETE'&&BpmnStatus!='NOAPPROVE'){
					$('#'+json[i]).remove();
				}	
			}
			if(i=='收货'||i=='送货'){
				if(BpmnStatus!='COMPLETE'&&BpmnStatus!='NOAPPROVE'){
					pass=false;
					$('#'+json[i]).remove();
				}	
			}
			if(i=='生成销售单'){
				if(BpmnStatus!='COMPLETE'&&BpmnStatus!='NOAPPROVE'){
					pass=false;
					$('#'+json[i]).css('display','none');
				}	
			}
			if(i=='作废'){

				if(BpmnStatus!='PRE'&&BpmnStatus!='REJECT'&&BpmnStatus!=null||getCreateBy(CreatBy,dataStatus,boss)){
					if(hadSon==false&&BpmnStatus!='NOAPPROVE'&&BpmnStatus!='COMPLETE'){
						pass=false;
						$('#'+json[i]).remove();
					}else if(hadSon!=false){
						pass=false;
						$('#'+json[i]).remove();
					}			
				}	
			}
			
			if(i=='审批记录'){
				/*if(_global_settings.owner.username!=CreatBy&&'Bpmn_bx'!=pk){
					pass=false;
					$('#'+json[i]).remove();
				}	*/
			}
			if(i=='初次提交'){
				if(BpmnStatus!='PRE'||getCreateBy(CreatBy,dataStatus,boss)){
					pass=false;
					$('#'+json[i]).remove();
				}	
			}
			if(i=='再次提交'){
				if(BpmnStatus!='REJECT'||getCreateBy(CreatBy,dataStatus,boss)){
					pass=false;
					$('#'+json[i]).remove();
				}	
			}
			if(i=='编辑'||i=='保存'||i=='提交'){
				if(BpmnStatus!='PRE'&&BpmnStatus!='NOAPPROVE'&&BpmnStatus!='REJECT'||getCreateBy(CreatBy,dataStatus,boss)){
					pass=false;
					$('#'+json[i]).remove();
				}	
			}
			if('Bpmn_bx'!=pk&&pk!='Bpmn_kx'){			
				if(i=='审批'){
					pass=false;
					$('#'+json[i]).remove();
				}				
			}else{			
				if(i=='审批'){
					if(BpmnStatus!='RUNNING'&&BpmnStatus!='START'){
						pass=false;
						$('#'+json[i]).remove();
					}	
				}
			} 		
		}
		try{
			delete $.pk.Bpmn;
		}catch(e){}	
		return pass;
	};

	powerStatus.prototype.biz=function(type){
		var status=this.bizStatus;
		var CreatBy=this.json.createBy;
		var hadSon=this.hadSon;
		if(status==null){
			return true;
		}
		var json=type;
		var dataStatus=this.dataStatus;
		var boss=this.boss;
		var pass=true;
		for(var i in json){
			if(i=='编辑'){
				if('normal'!=status&&status!=null){
					pass=false;
					$('#'+json[i]).remove();
				}
			}
			if(i=='作废'){
				if(status=='canceled'){
					$('#'+json[i]).replaceWith('<span class="btn btn-success float-right mg10">已作废</span>');
				}
				if(hadSon!=false&&status!='normal'||getCreateBy(CreatBy,dataStatus,boss)){
					pass=false;
					$('#'+json[i]).remove();
				}
			}
			
			if(i=='初次提交'||i=='再次提交'){
				if('canceled'==status){
					pass=false;
					$('#'+json[i]).remove();
				}
			}
		}
		return true;
	};
	powerStatus.prototype.pay=function(type){
		var status=this.payStatus;
		var CreatBy=this.json.createBy;
		if(status==null){
			return true;
		}
		var json=type;
		var dataStatus=this.dataStatus;
		var boss=this.boss;
		var pass=true;
		for(var i in json){
			if(i=='编辑'||i=='作废'){
				if('paid'==status){
					pass=false;
					$('#'+json[i]).remove();
				}
			}		
			if(i=='作废'&&getCreateBy(CreatBy,dataStatus,boss)){
				$('#'+json[i]).remove();
			}
		}
		return true;
	}
	powerStatus.prototype.order=function(type){
		var status=this.orderStatus;
		var CreatBy=this.json.createBy;
		if(status==null){
			return true;
		}
		var json=type;
		var dataStatus=this.dataStatus;
		var boss=this.boss;
		var pass=true;
		for(var i in json){
			if(json[i]==''){
				json[i]=new Date().getTime()+Math.random();
			}
			if(i=='送货'||i=='收货'){
				if(status!='undelivered'&&status!='partialdelivered'&&status!='notCreatedSalesOrder'
					&&status!='unreceived'&&status!='partialreceived'&&status!='allreceived'
				&&status!='running'&&status!=null){
					if(status=='alldelivered'||status=='allreceived'||status=='closedOrder'){
						
					}else{
						$('#'+json[i]).remove();
					}
				}
			}
			if(i=='送货'||i=='收货'){
				if(status=='canceled'){
					pass=false;
				}
			}
			if(i=='收款'||i=='付款'){
				if(status!='undelivered'&&status!='unreceived'&&status!='partialdelivered'
					&&status!='partialreceived'&&status!='allreceived'
				&&status!='alldelivered'&&status!=null){
					//$('#'+json[i]).remove();
				}
				if(status=='canceled'){
					$('#'+json[i]).remove();
				}
			}
			if(i=='编辑'||i=='作废'||i=='保存'){
				if(i=='作废'&&status=='canceled'){
					$('#'+json[i]).replaceWith('<span class="btn btn-success float-right mg10">已作废</span>');
				}
				if(status!='undelivered'&&status!='unreceived'&&status!='notCreatedSalesOrder'
				&&status!='running'&&status!=null){
					$('#'+json[i]).remove();
				}				
			}
			if(i=='作废'&&getCreateBy(CreatBy,dataStatus,boss)){
				$('#'+json[i]).remove();
			}
			if(i=='关闭'){
				if(status=='closedOrder'){
					$('#'+json[i]).replaceWith('<span class="btn btn-success float-right mg10">已关闭</span>');
				}
				if(status!='partialdelivered'&&status!='partialreceived'&&status!=null||getCreateBy(CreatBy,dataStatus)){
					$('#'+json[i]).remove();
				}
			}
			if(i=='生成销售单'){
				if(status=='createdSalesOrder'){
					$('#'+json[i]).replaceWith('<span class="btn btn-success float-right mg10">已生成销售单</span>');
				}
				if(status!='notCreatedSalesOrder'&&status!='running'||getCreateBy(CreatBy,dataStatus)){
					pass=false;
					$('#'+json[i]).remove();
				}
			}
			if(i=='初次提交'||i=='再次提交'){
				if(status=='canceled'){
					$('#'+json[i]).remove();
				}
			}
		}
		return pass;
	}
	
	powerStatus.prototype.delivery=function(type){
		var status=this.deliveryStatus;
		if(status==null){
			return true;
		}
		var json=type;
		var dataStatus=this.dataStatus;
		var boss=this.boss;
		var pass=true;
		for(var i in json){
			if(i=='退货'){
				if(status!='delivered'&&status!='received'&&status!='partialReturn'&&status!=null){
					pass=false;
					$('#'+json[i]).remove();
				}
			}
		}
		return true;
	}
	
	powerStatus.prototype._return=function(type){
		var status=this.returnStatus;
		var CreatBy=this.json.createBy;
		var dataStatus=this.dataStatus;
		var boss=this.boss;
		if(status==null){
			return true;
		}
		var json=type;
		var pass=true;
		for(var i in json){
			if(i=='编辑'){
				if('notreceived'!=status&&status!=null){
					pass=false;
					$('#'+json[i]).remove();
				}
			}
			if(i=='作废'){
				if(status=='canceled'){
					$('#'+json[i]).replaceWith('<span class="btn btn-success float-right mg10">已作废</span>');
				}
				if(getCreateBy(CreatBy,dataStatus,boss)){
					pass=false;
					$('#'+json[i]).remove();
				}
				
			}
			
			if(i=='初次提交'||i=='再次提交'){
				if('canceled'==status||status=='received'){
					pass=false;
					$('#'+json[i]).remove();
				}
			}
		}
		return true;
	}
	
	powerStatus.prototype.init=function(){
		var list=this.nodelist;
		var pk=this.pk;
		//var myhadSon=this.hadSon;
		var pass=true;
		for(var i in list){
			switch(i){
			case 'bpmnStatus':if(!this.bpmn(list[i],pk)) pass=false;		
			break;
			case 'bizStatus':if(!this.biz(list[i])) pass=false;	
			break;
			case 'payStatus':if(!this.pay(list[i])) pass=false;	
			break;
			case 'orderStatus':if(!this.order(list[i])) pass=false;	
			break;
			case 'deliveryStatus':if(!this.delivery(list[i])) pass=false;	
			break;
			case 'returnStatus':if(!this._return(list[i])) pass=false;	
			break;
			case 'createby':if(!this.createby(list[i])) pass=false;	
			break;
			}
		}
		return pass;
	}
	
	window.powerStatus=powerStatus;
})()