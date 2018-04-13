/*
 * 编辑商机界面js 
 */
var EditBusoMgt=function(){
	var me=this;
	var data=null;
	var info = getCurrentInfo();
	
	this.initInput=function(){
		me.data=$.pk.data;
		if(me.data==null||me.data==undefined){
			Core.alert({
				message:'data入参错误！'
			});
			$.closeTab();
		}
		
		me.initPage(me.data);
		me.initValidator();
		
	}
	/*
	 * 初始化界面
	 */
	this.initPage=function(data){
		$('#editBuso-cust').val(data.potentialName);
		$('#editBuso-compName').val(data.contact);
		
		$('#editBuso-sale').comboBox({
			source:ComboBoxSources.getRecords('salesAgent_name'),
			displayMember: 'name_user', 
			valueMember: 'id',
			width:'100%'
		}).val(data.salesAgent==undefined?$('#editBuso-sale').val(''):$('#editBuso-sale').val(data.salesAgent.id));
		
		$('#editBuso-headname').comboBox({
			source:ComboBoxSources.getRecords('salesAndCust_name'),
			checkboxes:true,
			displayMember: 'name_user', 
			valueMember: 'id',
			width:'100%'
		});
		
		//代理商,销售负责人,客服登录
		if(info!='sys'){
			if(info.indexOf('customer')>=0){
				$('#editBuso-headname').parent().parent().find('label').text('客服');
				
				$('#editBuso-headname').comboBox({
					source:ComboBoxSources.getRecords('custService_name'),
					displayMember: 'name_user', 
					valueMember: 'id',
					width:'100%'
				});
			}
			if(info=='sales'){
				$('#editBuso-headname').comboBox({
					source:ComboBoxSources.getRecords('sale_name'),
					checkboxes:true,
					displayMember: 'name_user', 
					valueMember: 'id',
					width:'100%'
				});
			}
		}
		
//		debugger
		for(var i=0;i<data.sal.length;i++){
			$('#editBuso-headname').jqxComboBox('checkItem',data.sal[i].id);
		}
		for(var i=0;i<data.custom.length;i++){
			$('#editBuso-headname').jqxComboBox('checkItem',data.custom[i].id);
		}
		
		if(info=='sys'){
			$('#editBuso-headname').parent().parent().find('label').text('销售负责人/客服');
		}
		
//		$('#editBuso-sale').jqxComboBox({disabled:true});
//		$('#editBuso-headname').jqxComboBox({disabled:true});
		
		$('#editBuso-dealdate').datetimeinput({value:data.closingDate,formatString: 'yyyy-MM-dd',height:34,width:'60%'});
		$('#editBuso-phone').val(data.phone);
		$('#editBuso-email').val(data.email);
		$('#editBuso-work').val(data.title);
		$('#editBuso-wx').val(data.wechat);
		$('#editBuso-qq').val(data.qq);
		$('#editBuso-remark').val(data.comment);
		
		me.setAddress(data.address);
	}
	
	//初始化地址
	this.setAddress=function(address){
		
		for(var i=0;i<address.length;i++){
			var line = '<tr>'+
						'<td class="hidden">'+address[i].shortName+'</td>'+
							'<td><i class="glyphicon glyphicon-home"'+
							'style="padding-right: 20px;"></i></td>'+
						'<td><font>'+address[i].province+'</font><font>'+address[i].city+'</font><font>'+address[i].district+'</font><font>'+address[i].street+'</font></td>'+
						'<td class="hidden">'+address[i].zipCode+'</td>'+
						'<td class="hidden">'+address[i].remark+'</td>'+
						'<td style="float:rigth;">'+
						'<font class="md-rate-review edit">编辑</font>'+
						'<font class="md-cancel delete">删除</font></td>'+
					'</tr>';
			
			$('#editBuso-address').append(line);
		}
	}
	
	this.initValidator = function(){
		$('#editBusoPage').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
                { input: '#editBuso-cust', message: '不能为空', action: 'keyup,blur', rule: 'required' },
                { input: '#editBuso-phone', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#editBuso-phone', message: '联系电话格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(!(/^1[3|4|5|7|8]\d{9}$/.test(input.val()))) return false;
                		return true;
                	}
                },
                { input: '#editBuso-compName', message: '不能为空', action: 'keyup,blur',rule:'required'},
                { input: '#editBuso-email', message: '邮箱格式不正确,请重新输入', action: 'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return true;
                		else{
                			if(/^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/g.test(input.val())) return true;
                			return false;
                		}
                	}
                },
                { input: '#editBuso-dealdate',message: '不能为空',action:'keyup,blur',
                	rule:function(input,commit){
                		if(input.val()=='') return false;
                		return true;
                	}
                }
             ]
		});
	}	
	
}

var EditBusoBindModle=function(editBusoMgt){
	var me=this;
		
	this.bind=function(){
		//点击添加地址
		$('#editBusoAddress-btn').off('click').on('click',function(){
			addRess('#editBuso-address');
		});
		
		//点击编辑或者删除地址
		$('#editBuso-address').on('click','.edit',function(){
			editOrdelAddress('#editBuso-address',$(this),'edit');
		});
		
		$('#editBuso-address').on('click','.delete',function(){
			editOrdelAddress('#editBuso-address',$(this),'delete');
		});
		
		//保存编辑商机
		$('#editBusoBtn-btn').on('click',function(){
			me.submitParam(me.initParam());
		});
	}
	
	this.submitParam=function(param){
		if($('#editBusoPage').jqxValidator('validate')){
//			alert('success');
			var url = _global_settings.service.url+'/potential';
			Core.AjaxRequest({
				url:url,
				type:'PUT',
				params:param,
				async:false,
				callback:function(res){
					$.closeTab();
					try{
						setBuso(editBusoMgt.data.id);
						$('#busoGrid').jqxGrid('updatebounddata','cells');
					}catch(e){}
				},
				failure:function(){
					
				}
			});
		}
	}
	
	this.initParam=function(){
		var obj={};
		obj.sal=[];
		obj.custom=[];

		obj.id = editBusoMgt.data.id;
		obj.potentialName = $('#editBuso-cust').val();
		obj.contact = $('#editBuso-compName').val();
		obj.phone = $('#editBuso-phone').val();
		obj.email = $('#editBuso-email').val();
		obj.comment = $('#editBuso-remark').val();
		
//		obj.personInfo.type = 'person';

		var sale=$('#editBuso-sale').val();
		if(sale==''){
//			obj.salesAgent = {};
		}else{
			obj.salesAgent = {id:$('#editBuso-sale').val()};
		}
		
		var customer=$('#editBuso-headname').jqxComboBox('getCheckedItems');
		//选中客服传客服，选中销售传销售
		if(customer.length!=0){
			for(var i=0;i<customer.length;i++){
				var id=customer[i].originalItem.id;
				var sales=getSalesInfoById(id);
				var cust=getCustomerInfoById(id);
				
				if(sales.name_user!=''){
					obj.sal.push({id:id});
				}
				if(cust.name_user!=''){
					obj.custom.push({id:id});
				}
			}
		}
		
		obj.title = $('#editBuso-work').val();
		obj.wechat = $('#editBuso-wx').val();
		obj.qq = $('#editBuso-qq').val();
		obj.closingDate = $('#editBuso-dealdate').val();
		
		obj.address = me.getAddress();
		console.log(obj);
		return obj;
	}
	
	this.getAddress=function(){
		var tr = $('#editBuso-address').find('tbody').children();
		var address=[];
		$.each(tr,function(i){
			var obj={};
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
		$('#editBusoAddressBtn').off('click');
		$('#editBusoBtn-btn').off('click');
	}
}