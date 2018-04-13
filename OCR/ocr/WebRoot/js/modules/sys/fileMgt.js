(function(){
	var file=function(){
		var me=this;
		var account=0,arr=[];
		var url=_global_settings.service.url;
		
		me.init=function(){
			$('#file-time').dropDownlist({
				source:{'0':'请选择','1':'最近一周','2':'最近两周','3':'最近三周','4':'本月','5':'本季度','6':'本年'},
				selectedIndex:0,
				dropDownHeight:120
			});
			$('#file-st,#file-et').datetimeinputs();
			$('#file-time').on('change',function(){
				setValueById('file-time','file-st','file-et');
			});
			$('#file-person').comboBox({
				source: ComboBoxSources.getRecords('getEmployee'),
	            displayMember: 'name',
	            valueMember: 'name'
			});
			$('#file-search').click(function(){
				me.search();
			});
			$('#file-load').click(function(){
				var file=url+'/SimpleAC/file/'+new Base64().encode('toocr/order/file/'+_global_settings.owner.username);
				$('#file-modal').modal('show');
				if(account==0) $('#file-attachment').fileuploader({url:file,ownerName:_global_settings.owner.username});
				account++;
			});
			
			me.getData(arr);
		}
		
		me.search=function(){
			var st=$('#file-st').val(),et=$('#file-et').val(),
				name=$('#file-person').val(),file=$('#file-name').val();
			
			me.searchObj['handleDate'].value=[];
			if(st!=''&&et!=''){
				me.searchObj['handleDate'].value.push(st+' '+'00:00:00',et+' '+'23:59:59');
				me.searchObj['handleDate'].action='between';
			}
			if(st!=''&&et==''){
				me.searchObj['handleDate'].value.push(st+' '+'00:00:00');
				me.searchObj['handleDate'].action='ge';
			}
			if(st==''&&et!=''){
				me.searchObj['handleDate'].value.push(et+' '+'23:59:59');
				me.searchObj['handleDate'].action='le';
			}
			
			me.searchObj['CONCAT(userinfo.name,’(‘, logd.createBy,’)’)'].value=[];
			if(name!=''){
				me.searchObj['CONCAT(userinfo.name,’(‘, logd.createBy,’)’)'].value.push(name);
			}
			
			me.searchObj['logd.fileName'].value=[];
			if(file!=''){
				me.searchObj['logd.fileName'].value.push(file);
			}
			
			var source=me.searchObj;
			for(var i in source){
				if(source[i].value.length!=0){
					source[i]['key']=i;
					arr.push(source[i]);
				}
			}
			
//			console.log(arr)
			me.getData(arr);
		}
		
		me.searchObj={
			'CONCAT(userinfo.name,’(‘, logd.createBy,’)’)':{value:[],action:'like'},
			'handleDate':{value:[],action:'between'},
			'logd.fileName':{value:[],action:'like'}
		}
		
		me.getData=function(search){
			var search=search==undefined?arr:search;
			var obj={"condition":search,"filterscount":0,"groupscount":0,"sortorder":"desc","pagenum":0,"pagesize":20};
			$('#file-list').html('');
			obj=JSON.stringify(obj);
			Core.AjaxRequest({
				type:'get',
				url:url+'/overview/searchLogFileInfo/'+new Base64().encode(obj),
				showMsg:false,
				callback:function(res){
					me.initFile(res);
				}
			});
		}
		
		window.setFile=me.getData;
		
		me.initFile=function(res){
			if(JSON.stringify(res).length==2){
				var html='<div class="time-item">'+
							'<div class="item-info">'+
								'<div class="text-muted"><br>'+
									'<a></a>'+
								'</div>'+
								'<p class="m-t-15">暂无数据</p>'+
							'</div>'+
						'</div>';
				$('#file-list').append(html);
				return ;
			}
			a:for(var i in res){
				var source=res[i];
				if(source.length==0){
					var html='<div class="time-item">'+
								'<div class="item-info">'+
									'<div class="text-muted">'+i+'<br>'+
										'<a></a>'+
									'</div>'+
									'<p class="m-t-15">暂无数据</p>'+
								'</div>'+
							'</div>';
					
					$('#file-list').append(html);
					continue a;
				}
//				debugger
				var ht='<div class="time-item"><div class="item-info"><div class="text-muted">'+i+'<br>';
				b:for(var k=0,len=source.length;k<len;k++){
					var ab=source[k],abc=ab.data;
					var load=ctx+'/CXF/rs/SimpleAC/down/'+
						new Base64().encode('toocr/order/downFileAttachment/'+ab.fileId+'/'+_global_settings.owner.username+'/Y');
					ht+='<div class="w30"><a title="下载" target="_blank" href="'+load+'">'+ab.fileName+'</a></div>'+
						'<div class="w30"<span>'+getCodeData(ab.handletype)+'：</span><span class="mr10">'+ab.createBy+'</span></div>'+
						'<span>'+ab.handleDate+'</span>';
					
					if(abc.length==0){
						ht+='<div>'+
								'<span></span>'+
								'<span></span>'+
								'<span></span>'+
							'</div>';
						continue b;
					}
					
					var lt='<div>';
					c:for(var m=0,l=abc.length;m<l;m++){
//						ht+='<div>'+
//							'<span>'+getCodeData(abc[m].handletype)+'：</span>'+
//							'<span class="m-r-10">'+abc[m].createBy+'</span>'+
//							'<span class="m-r-10">'+abc[m].handleDate+'；</span>'+
//						'</div>';
								
						if(abc.length==1){
							lt+='<span>'+getCodeData(abc[m].handletype)+'：</span>'+
								'<span class="m-r-10">'+abc[m].createBy+'</span>'+
								'<span class="m-r-10">'+abc[m].handleDate+'；</span>';
						}else{
							if(m==0){
								lt+='<span>'+getCodeData(abc[m].handletype)+'：</span>'+
									'<span class="m-r-10">'+abc[m].createBy+'</span>'+
									'<span class="m-r-10">'+abc[m].handleDate+'；</span>';
							}else{
								lt+='<span class="m-r-10">'+abc[m].createBy+'</span>'+
									'<span class="m-r-10">'+abc[m].handleDate+'；</span>';
							}
						}
					}
					lt+='</div>';
					ht+=lt;
				}
				ht+='</div></div>'
				$('#file-list').append(ht);
				
			}
//			var html=<div class="time-item">
//						<div class="item-info">
//							<div class="text-muted">yang 待抢单<br>
//								<a>XS201708310001</a>
//							</div>
//							<p>2017-10-14 15:12:10</p>
//						</div>
//					</div>
			console.log(res);
		}
	}
	
	setTimeout(function(){
		var f=new file();
		f.init();
	},0);
	
//	var f=new file();
//	f.init();
	
})();