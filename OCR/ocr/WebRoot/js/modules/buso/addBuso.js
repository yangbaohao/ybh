/*
 * 新增商机界面js 
 */
//var ad=new address('addBusoAddressTableArs','form-control');
//ad.init();

var AddBusoMgt=function(){
	var me=this;
	var boolean=false;
	var info=getCurrentInfo();
	
	this.initInput=function(){
		me.initPage();
		me.initValidator();
	}
	/*
	 * 初始化界面
	 */
	this.initPage=function(){
		
		$('#addBuso-sale').comboBox({
			source:ComboBoxSources.getRecords('salesAgent_name'),
			displayMember: 'name_user', 
			valueMember: 'id',
			width:'100%'
		});
		
		$('#addBuso-headname').comboBox({
			source:ComboBoxSources.getRecords('salesInfo_name'),
			displayMember: 'name_user', 
			valueMember: 'id',
			width:'100%'
		});
		
		//代理商,销售负责人,客服登录
		if(info!='sys'){
			if(info.indexOf('sale')>=0||info.indexOf('customer')>=0){
				if(info.indexOf('customer')>=0){
					$('#addBuso-headname').parent().parent().find('label').text('客服');
					
					$('#addBuso-headname').comboBox({
						source:ComboBoxSources.getRecords('custService_name'),
						displayMember: 'name_user', 
						valueMember: 'id',
						width:'100%'
					});
				}
				if(info=='sales'){
					$('#addBuso-headname').comboBox({
						source:ComboBoxSources.getRecords('sale_name'),
						displayMember: 'name_user', 
						valueMember: 'id',
						width:'100%'
					});
				}
				
				$('#addBuso-headname').val(_global_settings.owner.userid);
			}else{
				$('#addBuso-sale').val(_global_settings.owner.id);
				
				//销售负责人
				var sales = getAgentInfoById(_global_settings.owner.id).sales;
				
				sales==undefined?$('#addBuso-headname').val(''):$('#addBuso-headname').val(sales.id);
			}
			
//			$('#addBuso-sale').jqxComboBox({disabled:true});
//			$('#addBuso-headname').jqxComboBox({disabled:true});
		}
		
		if(info=='sys'){
			$('#addBuso-headname').parent().parent().find('label').text('销售负责人/客服');
			$('#addBuso-headname').comboBox({
				source:ComboBoxSources.getRecords('salesAndCust_name'),
				displayMember: 'name_user', 
				valueMember: 'id',
				width:'100%'
			});
		}
		
		$('#deal-date').datetimeinput({value:new Date(),formatString: 'yyyy-MM-dd',height:34,width:'60%'});
	}
	
	this.initValidator = function(){
		$('#addBuso').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#addBuso-cust', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#addBuso-phone', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#addBuso-phone', message: '联系电话格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
                		return true;
                	}
                },
                { input: '#addBuso-headname', message: '请选择', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(info!='sys'){
                			if(input.jqxComboBox('getSelectedItem')==null) return false;
                			return true;
                		}
                		return true;
                	}
                },
                { input: '#addBuso-sale', message: '请选择', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(info=='sys'){
                			if(input.jqxComboBox('getSelectedItem')==null) return false;
                			return true;
                		}
                		return true;
                	}
                },
                { input: '#addBuso-compName', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#addBuso-email', message: '邮箱格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return true;
                		else{
                			if(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(input.val())) return true;
                			return false;
                		}
                	}
                },
                { input: '#deal-date',message: '不能为空',action:'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return false;
                		return true;
                	}
                }
             ]
		});
	}	
	
}

var AddBusoBindModle=function(addBusoMgt){
	var me=this;
		
	this.bind=function(){
		//点击添加地址
		$('#busoAddress-btn').off('click').on('click',function(){
			addRess('#addBuso-address');
		});
		
		//点击编辑或者删除地址
		$('#addBuso-address').on('click','.edit',function(){
			editOrdelAddress('#addBuso-address',$(this),'edit');
		});
		
		$('#addBuso-address').on('click','.delete',function(){
			editOrdelAddress('#addBuso-address',$(this),'delete');
		});
		
		//保存新增商机
		$('#addBusoBtn').on('click',function(){
			me.submitParam(me.initParam());
		});
	}
	
	this.submitParam=function(param){
		if($('#addBuso').jqxValidator('validate')){
			var url = _global_settings.service.url+'/potential';
			Core.AjaxRequest({
				url:url,
				type:'POST',
				params:param,
				async:false,
				callback:function(res){
					$.closeTab();
					try{
//						$('#busoGrid').jqxGrid('updatebounddata','cells');
					}catch(e){}
				},
				failure:function(e){
				}
			});
		}
	}
	
	this.initParam=function(){
		var obj={};
		obj.sal=[];
		obj.custom=[];
		
		obj.potentialName = $('#addBuso-cust').val();
		obj.contact = $('#addBuso-compName').val();
		obj.phone = $('#addBuso-phone').val();
		obj.email = $('#addBuso-email').val();
		obj.comment = $('#addBuso-remark').val();
//		obj.personInfo.type = 'person';
		
		var sale=$('#addBuso-sale').val();
		if(sale==''){
			obj.salesAgent = {};
		}else{
			obj.salesAgent = {id:$('#addBuso-sale').val()};
		}
		
		var customer=$('#addBuso-headname').val();
		//选中客服传客服，选中销售传销售
		if(customer!=''){
			var id=$('#addBuso-headname').val();
			var sales=getSalesInfoById(id);
			var cust=getCustomerInfoById(id);
			
			if(sales.name_user!=''){
				obj.sal.push({id:$('#addBuso-headname').val()});
			}
			if(cust.name_user!=''){
				obj.custom.push({id:$('#addBuso-headname').val()});
			}
		}
		
		obj.title = $('#addBuso-work').val();
		obj.wechat = $('#addBuso-wx').val();
		obj.qq = $('#addBuso-qq').val();
		obj.closingDate = $('#deal-date').val();
		obj.address = me.getAddress();
		
		return obj;
	}
	
	this.getAddress=function(){
		var tr = $('#addBuso-address').find('tr');
		var address=[];
		$.each(tr,function(i){
			var obj = {};
			obj.shortName = tr.eq(i).find('td').eq(0).text();
			obj.province = tr.eq(i).find('td').eq(2).children().eq(0).text();
			obj.city = tr.eq(i).find('td').eq(2).children().eq(1).text();
			obj.district = tr.eq(i).find('td').eq(2).children().eq(2).text();
			obj.street = tr.eq(i).find('td').eq(2).children().eq(3).text();
			obj.zipCode = tr.eq(i).find('td').eq(3).text();
			obj.remark = tr.eq(i).find('td').eq(4).text();
			obj.ownerId = -1;
			
			address.push(obj);
		});
		
		return address;
	}
	
	this.unbindAll=function(){
		$('#addBusoAddressBtn').off('click');
		$('#addBusoBtn').off('click');
	}
}