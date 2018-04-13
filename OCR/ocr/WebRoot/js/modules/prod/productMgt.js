/*
 * 产品管理界面js
 */
var ProdMgt=function(){
	var me=this;
	var url=_global_settings.service.url+'/accountproduct';
	this.id=null;
	this.prod=null;
	
	this.initInput=function(){
		me.initProdPage();
		me.initWindows();
		me.initValidator();
		me.initSearch();
		me.initGrid(me.searchObj);
	}
	
	this.initValidator = function(){
		$('#fpAgentWin').jqxValidator({
			hintType: 'label',
    		animationDuration: 1,
			rules: [
				{ input: '#fpAgent-agent',message: '请选择',action:'keyup,blur',
					rule:function(input,commit){
						if(input.jqxComboBox('getSelectedItem')==null) return false;
						return true;
					}
				}
             ]
		});
	}
	
	/*
	 * 初始化页面
	 */
	this.initProdPage=function(){
		$('#prod-show').css('display','');
		
		$('#prod-module').comboBox({
			source:ComboBoxSources.getRecords('productName'),
			searchMode:'contains',
			displayMember:'productName',
			width:'100%'
		});
		
		$('#prod-show').addClass('hiddendiv');
	}
	
	/**
	 * 初始化所有窗口
	 */
	this.initWindows = function(){
		$('#addProdWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:400,
			height:'auto',			
			minWidth: 700, 
			cancelButton: $('#cancelAddProdBtn'),
			initContent:function(){
				
			}
		}).on({
			'close':function(){
				setTimeout(function(){
					$('#addprod-number').val('');
					$('#addprod-module').val('');
					$('#addprod-price').val('');
					$('#addprod-int').val('');
				},30);
			}
		});
		
		$('#viewProdWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:620,
			height:'auto',			
			minWidth: 800, 
			width:'700',
			cancelButton: $('#cancelViewProdBtn'),
			initContent:function(){
				
			}
		})/*.on('close',function(){
			$('#viewprod-int').val('');
		})*/;
		
		$('#editProdWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:570,
			height:'auto',			
			minWidth: 800, 
			width: 800,
			cancelButton: $('#cancelEditProdBtn'),
			initContent:function(){
				
			}
		});
		
		$('#disableProdWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:340,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#cancelDisableProdBtn'),
			initContent:function(){
				$('#disableProd-yn').jqxDropDownList({
					source:{'false':'否','true':'是'},
					width:'100%',
					height:34,
					selectedIndex:0
				});
			}
		}).on('close',function(){
			setTimeout(function(){
				$('#disableProd-yn').jqxDropDownList({selectedIndex:0});
			},500);
		});
		
		$('#fpAgentWin').jqxWindow({
			theme : currentTheme,
			isModal: true,
			autoOpen: false,
			maxHeight:1000,
			minHeight:280,
			height:'auto',			
			minWidth: 500, 
			cancelButton: $('#cancelFpAgentBtn'),
			initContent:function(){
				$('#fpAgent-agent').comboBox({
					source:ComboBoxSources.getRecords('salesAgent_name'),
					displayMember:'name_user',
					valueMember:'id',
					width:'100%'
				});
			}
		}).on({
			'close':function(){
				$('#fpAgent-time').val('');
			}
		});
	};
	
	/*
	 * 初始化grid
	 */
	this.initGrid=function(){
		me.settings.source.data = me.searchObj;
		//初始化数据源
		var demoAdapter = Core.AcDataAdapter('prodGrid', me.settings.source,{
			beforeLoadComplete:function(records){
				
			}
		}, false);
		
		//初始化Grid
		var grid_sets = {
	  	   source:demoAdapter
		   ,rendergridrows: function(){
                return demoAdapter.recordids;
            }
    	   ,columns:[		
				{ text: '日期',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
				  		var html = '<div class="agrid">';
				  			html += rowdata.createDate.substring(0,10)+'</div>';
				  		return html;
					}
				},    
				{ text: '图片',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
						 var src='';
						 if(rowdata.productPhoto!=undefined&&rowdata.productPhoto!=''){
							 src=ctx+'/CXF/rs/common/file/'+ rowdata.productPhoto;//照片id
						 }
						 if(src!=''){
							 src="<img width='28' height='28' src='" + src + "'>";
							 var img = "<div style='background: white;text-align:center;margin: 0px;'>" +
							 src+ "</div>";
						 }					
					    return img;
					}
				},     
				{ text: '产品模块',width:'10%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
		  	            	html += '<a class="hoverspan viewProd" title="查看产品">'+rowdata.productName+'</a>';
	  	            		html += '</div>';
  	            		return html;
					}
				},
				{ text: '产品简介',dataField:'description',width:'20%',
					cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
		  	            	html += rowdata.description.replace('<br>','')+'</div>';
  	            		return html;
					}
				},
				{ text: '产品价格',dataField:'priceAmt',cellsalign:'right', cellsformat: 'c2',width:'11%'},
  	            { text: '本月购买金额',dataField:'mounthAmt',cellsalign:'right', cellsformat: 'c2',width:'11%'},
  	            { text: '累计购买金额',dataField:'totalAmt',cellsalign:'right', cellsformat: 'c2',width:'11%'},
  	            { text: '是否禁用',width:'6%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var html = '<div class="agrid">';
  	            		return html+getCodeData(rowdata.status)+'</div>';	
					}
  	            },
  	            { text: '操作',width:'11%',
  	            	cellsrenderer:function (rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
  	            		var rtStr = '<div class="text-center">'; 
  	            			rtStr += '<a class="hoverspan md-format-list-bulleted fpAgent"></a>';
  	            			rtStr += '<a class="hoverspan md-view-agenda viewSendProd" title="查看赠送详情"></a>';
  	            			rtStr += '<a class="hoverspan md-label sendProd" title="赠送"></a>';
		  	            	rtStr += '<a class="hoverspan md-error disableBtn" title="禁用"></a>';
	  	            		rtStr += '</div>';
  	            		return rtStr;
					}
  	            }
	  	    ],
    	   pagesize: 20,
    	   columnsheight: 45
	    };
		$('#prodGrid').grid(grid_sets);
		
		$('#prodGrid').on('click','.fpAgent',function(){
			var index = $('#prodGrid').jqxGrid('getselectedrowindex');
			var rowdata = $('#prodGrid').jqxGrid('getrowdata',index);
			console.log(rowdata);
			me.prod=rowdata;
			$('#fpAgentWin').jqxWindow('open');
		});
		
		//点击查看
		$('#prodGrid').on('click','.viewSendProd',function(){
			var index = $('#prodGrid').jqxGrid('getselectedrowindex');
			var rowdata = $('#prodGrid').jqxGrid('getrowdata',index);
			console.log(rowdata);
			$.addTab({title:'赠送详情',isFrame:false,url:'page/modules/prod/viewSendProd.html',
				pk:{id:rowdata.id},reload:true});
		});
		
		//点击赠送
		$('#prodGrid').on('click','.sendProd',function(){
			var index = $('#prodGrid').jqxGrid('getselectedrowindex');
			var rowdata = $('#prodGrid').jqxGrid('getrowdata',index);
			console.log(rowdata);
			$.addTab({title:'赠送产品',isFrame:false,url:'page/modules/prod/sendProd.html',
				pk:{data:rowdata},reload:true});
		});
		
		//点击禁用
		$('#prodGrid').on('click','.disableBtn',function(){
			var index = $('#prodGrid').jqxGrid('getselectedrowindex');
			var rowdata = $('#prodGrid').jqxGrid('getrowdata',index);
//			console.log(rowdata);
			me.id=rowdata.id;
			
			$('#disableProdWin').jqxWindow('open',function(){
				$('#disableProd-code').val(rowdata.productCode);
				$('#disableProd-module').val(rowdata.productName);
			});
		});
		
		//点击查看产品
		$('#prodGrid').on('click','.viewProd',function(){
			$('#viewProdWin').jqxWindow('open',function(){
				var url = _global_settings.service.url+'/accountproduct/';
				var index = $('#prodGrid').jqxGrid('getselectedrowindex');
				if(index>=0){
					var rowdata = $('#prodGrid').jqxGrid('getrowdata',index);
					Core.AjaxRequest({
						url:url+rowdata.id,
						type:'GET',
						async:false,
						showMsg:false,
						callback:function(res){
							me.id=res.id;
							me.prod=res;
							if(res.productPhoto==undefined||res.productPhoto==''){
								$('#viewprod-photo').attr('src','images/common/photo_icon2.png');
							}else{
								$('#viewprod-photo').attr('src',ctx+'/CXF/rs/common/file/'+res.productPhoto);
							}
							
							$('#viewprod-number').val(res.productCode);
							$('#viewprod-module').val(res.productName).attr('disabled',true);
							$('#viewprod-price').val(res.priceAmt);
							$('#viewprod-unit').val(getCodeData(res.companyType));
							$('#viewprod-int').val(res.description);
						},
						failure:function(res){
							
						}
					});
				}
			});
		});
	}	
	
	this.settings = {  
		source:{
	        url: url+'/page',
	        data:me.searchObj,
	    },
		grid:{element:'prodGrid'},
		ajax:{url:url},
	};
	
	this.searchObj={};
	
	this.initSearch=function(){
		me.searchObj={
			productName:{value:[],action:'like'},
			priceAmt:{value:[],action:'between'}
		};
	}
	
	this.searchDataInfo = function(){
    	$('#prodGrid').jqxGrid('applyfilters');
    	$('#prodGrid').jqxGrid('refreshfilterrow'); 
    	$('#prodGrid').jqxGrid('clearselection');
    };
	
	this.refreshDataInfo = function(){
    	$('#prodGrid').jqxGrid('updatebounddata', 'cells');
    	$('#prodGrid').jqxGrid('clearselection');
    	$('#prodGrid').jqxGrid('refreshdata');
    };
}

var ProdBindModle=function(prodMgt){
	var me=this;
	
	this.search=function(){
		var pm = $('#prod-module').val(),sa = $('#prod-sp').val(),ea = $('#prod-ep').val();
		
		prodMgt.searchObj.productName.value=[];
		if(pm!='')
			prodMgt.searchObj.productName.value.push(pm);
		
		prodMgt.searchObj.priceAmt.value=[];
		if(sa!=''&&ea!='')
			prodMgt.searchObj.priceAmt.value.push(sa,ea);
		
		prodMgt.searchDataInfo();
	}
	
	this.saveParam=function(param){
		var url = _global_settings.service.url+'/accountproduct';
		Core.AjaxRequest({
			url:url,
			type:'POST',
//			async:false,
			params:param,
			callback:function(res){
				$('#addProdWin').jqxWindow('close');
				try{
					$('#prodGrid').jqxGrid('updatebounddata','cells');
					ComboBoxSources.load('productName',true);
				}catch(e){}
			}
		});
	}
	
	this.initParam=function(){
		var obj={};
		obj.productCode = $('#addprod-number').val();
		obj.productName = $('#addprod-module').val();
		obj.priceAmt = $('#addprod-price').val();
		obj.companyType = $('#addprod-unit').val();
		obj.description = $('#addprod-int').val();
		obj.productPhoto=$('#addprod-form').find('.file0').data('id');
		
//		console.log(obj);
		return obj;
	}
	
	this.saveEditParam=function(param){
		var url = _global_settings.service.url+'/accountproduct';
		Core.AjaxRequest({
			url:url,
			type:'PUT',
//			async:false,
			params:param,
			callback:function(res){
				$('#editProdWin').jqxWindow('close');
				try{
					$('#prodGrid').jqxGrid('updatebounddata','cells');
					ComboBoxSources.load('productName',true);
				}catch(e){}
			}
		});
	}
	
	this.initEditParam=function(){
		var obj={};
		obj.id = prodMgt.id;
		obj.productCode = $('#editprod-number').val();
		obj.productName = $('#editprod-module').val();
		obj.priceAmt = $('#editprod-price').val();
		obj.companyType = $('#editprod-unit').val();
		obj.description = $('#editprod-int').val();
		obj.productPhoto=$('#editprod-form').find('.file0').data('id');
		
//		console.log(obj);
		return obj;
	}
	
	this.bind=function(){
		
		 this.uploadImage=function(fileInput,fileForm){
			//判断是否有选择上传文件
			 if(!checkFileType(fileInput)){
				 return false;
			 }
	         var url=ctx+'/CXF/rs/common/file/-1';    
	         var formData = new FormData(fileForm[0]);
	         $.ajax({
	             type: "POST",
	             url: url,
	             data: formData,  
	             async : false,
				 cache : false,
				 contentType : false,
				 processData : false,
	             success: function(data) {
	            	 fileInput.data('id',data.id);
//	            	 if(fileForm.attr('class').indexOf('imgFile')>-1){
//	            		 fileForm.find('.close-lab').data('id',data.id);
	            	/* }
	            	 if(oldfileid!=null){
	            		 Core.AjaxRequest({
	 						url : url + "/"+oldfileid,
	 						type : "DELETE",
	 						showMsg:false,
	 						callback : function(res) {
	 						},
	 						failure : function(res) {
	 						}
	            		 });
	            	 }*/
	             },
	             error: function(XMLHttpRequest, textStatus, errorThrown) {
	                 //alert("上传失败，请检查网络后重试");
	             }
	         });
	         return true;
		 }
			 
		 //文件检测，只能上传图片
		 var checkFileType=function(selector){
			 var imgPath = selector.val();
	         if (imgPath == "") {
	             Core.alert({
						message:'请选择上传图片！'
				 });
	             selector.parents('form').find('img').attr('src','images/common/photo_icon2.png');
	             return;
	         }
	         //判断上传文件的后缀名
	         var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
	         if (strExtension != 'jpg' && strExtension != 'jpeg' && strExtension != 'gif'
	         && strExtension != 'png' && strExtension != 'bmp' && strExtension != 'JPG') {
	             Core.alert({
						message:'请选择图片文件！'
					});
	             return false;
	         }
	         return true;
		 }
		
		function getObjectURL(file) {
			var url = null ; 
			if (window.createObjectURL!=undefined) { // basic
				url = window.createObjectURL(file) ;
			} else if (window.URL!=undefined) { // mozilla(firefox)
				url = window.URL.createObjectURL(file) ;
			} else if (window.webkitURL!=undefined) { // webkit or chrome
				url = window.webkitURL.createObjectURL(file) ;
			}
			return url ;
		}
		
		//点击搜索
		$('#prod-search').on('click',function(){
			if($('#prod-show').is(':hidden')){
				$('#prod-show').slideDown('slow');
			}else{
				me.search();
			}
		});
		
		hiddenAclick();
		
		//点击新增
		$('#addprod-btn').on('click',function(){
			$('#addProdWin').jqxWindow('open',function(){
				$('#addprod-photo').off('click').on('click',function(){
					$('#addProdForm').find('.file0').trigger('click');
				});
				
				$('#addProdForm').on('change','.file0',function(){			
					var t=$(this);
					var objUrl = getObjectURL(this.files[0]) ;
					console.log("objUrl = "+objUrl) ;
					if (me.uploadImage(t,t.parents('form'))){
						timeOut(function(){
							$('#addprod-photo').attr('src', objUrl) ;
						});
					}
				});
			});
		});
		
		//点击编辑
		$('#editprod-btn').off('click').on('click',function(){
			$('#viewProdWin').jqxWindow('close');
			$('#editProdWin').jqxWindow('open',function(){
				var index = $('#prodGrid').jqxGrid('getselectedrowindex');
				if(index>=0){
					var rowdata = $('#prodGrid').jqxGrid('getrowdata',index);
					prodMgt.id=rowdata.id;
				}
				
				if(prodMgt.prod.productPhoto==undefined||prodMgt.prod.productPhoto==''){
					$('#editprod-photo').attr('src','images/common/photo_icon2.png');
				}else{
					$('#editprod-photo').attr('src',ctx+'/CXF/rs/common/file/'+prodMgt.prod.productPhoto);
					$('#editprod-form').find('.file0').data('id',prodMgt.prod.productPhoto);
				}
				
				$('#editprod-number').val(prodMgt.prod.productCode);
				$('#editprod-module').val(prodMgt.prod.productName);
				$('#editprod-price').val(prodMgt.prod.priceAmt);
				$('#editprod-unit').val(prodMgt.prod.companyType);
				$('#editprod-int').val(prodMgt.prod.description);
				
				$('#editprod-photo').off('click').on('click',function(){
					var src=$(this).attr('src');
					if(src=='images/common/photo_icon2.png'){
						$('#editProdForm').find('.file0').off('click').trigger('click');
					}
				});
				
				$('#editProdForm').off('change','.file0').on('change','.file0',function(){	
					var t=$(this);
					var objUrl = getObjectURL(this.files[0]) ;
					console.log("objUrl = "+objUrl) ;
					if (me.uploadImage(t,t.parents('form'))){
						timeOut(function(){
							$('#editprod-photo').attr('src', objUrl) ;
						});
					}
				});
				
				//删除图片
				$('#editProdForm').find('.close-lab').off('click').on('click',function(){
					var src=$('#editprod-photo').attr('src');
					if(src!='images/common/photo_icon2.png'){
						Core.confirm({
							message:'确定要删除？',
							confirmCallback:function(){
								$('#editprod-photo').attr('src','images/common/photo_icon2.png');
								$('#editprod-form').find('.file0').data('id','');
								$('#editprod-form').find('.file0').val('')
							}
						});
					}
				});
				
//				me.saveEditParam(me.initEditParam()); 
			});
		});
		
		//保存新增
		$('#addProdSubmitBtn').on('click',function(){
			me.saveParam(me.initParam());
		});
		
		//保存编辑
		$('#editProdSubmitBtn').on('click',function(){
			me.saveEditParam(me.initEditParam());
		});
		
		//禁用
		$('#disableProdBtn').on('click',function(){
			var url = _global_settings.service.url+'/accountproduct';
			var val = $('#disableProd-yn').val()=='true'?true:false;
//			if(val=='true'){
//				val=true;
//			} else{
//				val=false;
//			}
			var status = {id:prodMgt.id,status:val};
//			if(val){
				Core.AjaxRequest({
					url:url+'/status',
					async:false,
					params:status,
					type:'PUT',
					callback:function(){
						$('#disableProdWin').jqxWindow('close');
						$('#prodGrid').jqxGrid('updatebounddata','cells');
					},
					failure:function(){
						
					}
				});
//			} 
//			else{
//				Core.alert({
//					message:'状态未改变，不禁用！',
//					callback:function(){
//						$('#disableProdWin').jqxWindow('close');
//					}
//				});
//			}
		});
		
		//点击代理商保存
		$('#fpAgentSaveBtn').on('click',function(){
			if($('#fpAgentWin').jqxValidator('validate')){
				var obj={},url=_global_settings.service.url+'/agentcoupon';
				
				obj.accountProductList = [{id:prodMgt.prod.id}];
				obj.salesAgent = {id:$('#fpAgent-agent').val()};
				obj.mouth=$('#fpAgent-time').val();
//				obj.startTime = $('#fpAgent-sTime').val();
//				obj.endTime = $('#fpAgent-eTime').val();
				
				console.log(obj);
				Core.AjaxRequest({
					url:url,
					type:'POST',
					params:obj,
//					async:false,
					callback:function(){
						$('#fpAgentWin').jqxWindow('close');
						$('#prodGrid').jqxGrid('updatebounddata','cells');
					}
				});
			}
			
		});
	}
	
	this.unbindAll=function(){
		$('#prod-search').off('click');
		$('#addprod-btn').off('click');
		$('#disableProdBtn').off('click');
		$('#addProdSubmitBtn').off('click');
		$('#editProdSubmitBtn').off('click');
		$('#fpAgentSaveBtn').off('click');
	}
}