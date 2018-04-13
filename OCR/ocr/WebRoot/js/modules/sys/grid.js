/*
 * 测试grid
 */
(function(){
	timeOut(function(){
		var a=new app();
		a.init();
	});
	
	var defaultRow=function(){
		return {
			'name':'',
            'type':'',
            'price':'',
            'weight':'',
            'length':'',
            'color':'',
            'number':'',
            'cost':'',
            'inventory':'',
            'photo':'',
            'saletotal':'',
		}
	}
	
	var app=function(){
		var url='js/modules/sys/source.txt';
		var me=this;
		var table=$('#grid'); 
		
		me.init=function(){
			me.initGrid();
			me.loadEvent();
			me.initBox();
			me.dataBind();
			me.returnFunc();
			me.callBacks();
			me.callBacks1();
			me.imgSuoFang();
			me.ajaxDeferred();
			me.money();
//			me.test(1,2,3);
			
			$('#grid_comboBox').comboBox({
				source:['上海','北京','苏州','nanjing'],
				displayMember:'name',
				valueMember:'name',
				width:200
			});
			
			$('#grid_input').on('keyup',function(e){
//				debugger
				var val=$(this).val();
				var reg=/[ ]+/;
				if(reg.test(val)){
					val=val.replace(reg,'');
					$(this).val(val);
				}
				console.info(val);
			});
			
//			var a;
//			console.log('....'+a);
//			a=1;
			
//			me.swhen();
		}
		
		var aaa=function(){
			return {
				x:'aaa'
			}
		}
		var bbb=function(){
			return {
				x:'bbb'
			}
		}
		var ccc=function(){
			return {
				x:'ccc'
			}
		}
		
		me.money = function() {
			var num = 2.222;
			num = num.toFixed(2);
			console.log('金额',num)
		}
		
		//为wait指定回调函数，可以使用$.when()
		var wait=function(){    
			var defer = $.Deferred(); // 新建一个deferred对象
			var task=function(){
				console.error('执行完毕');
				//defer.reject(); // 改变deferred对象的执行状态为已失败，将调用$.when().fail();
				defer.resolve(); // 改变deferred对象的执行状态为已成功，将调用$.when().then();
			}
			setTimeout(task,5000);
			return defer;
		}
		
//		$.when(wait()).done(function(){ 
//			console.error("哈哈，成功了！"); 
//		}).fail(function(){ 
//			console.error("出错啦！");
//		});
		
		me.swhen=function(){
			$.when(aaa(),bbb(),ccc()).then(function(a,b){
				console.error(a,b);
			}).fail(function(){  //when参数中有ajax请求，如果有一个失败，将执行
				console.error('error');
			});
		}
		
//		$.ajax('test.html').always(function(c){
//			console.error(c);
//		})
		
		var ajax_func=function(){
			return $.ajax({
				type:'get',
				url:'js/modules/sys/source.txt'
//				success:function(res){
//					console.log(res);
//				}
			});
		}
		
		var fu=ajax_func();
		console.error(fu)
		
//		$.when(ajax_func()).then(function(a){
//			console.log(a);
//		})
		
//		var b=true;
//		if(!b){
//			var t=$.Deferred();
//			setTimeout(function(){
//				ajax_func().always(function(e,q){
//					t.resolve(e,q)
//				});
//			},0)
//			
//			return t;
//		}
		
		//call
		var one=function(){
			//this.name='one'
			console.log(this)
			console.error(this.name);
			console.log(arguments[0])
		}
		var two=function(){
//			this.name='t';
			console.log(this)
			console.error(this.name);
			console.log(arguments[0])
		}
//		one();
//		var t=new two();
		one.call(two,'test')
		
		//arguments
		me.test=function(){
//			console.log(arguments[0],arguments[1],arguments[2])
		}
		
		var getNameAge=function(){
			return [
			    {name:'a',age:10},
		        {name:'b',age:11}
			];
		}
		
		var getData=function(){
			var aaa=123;
			return function(){
				return aaa;
			}
		}
		
		me.returnFunc=function(){
			console.log(getData())
		}
		
		//数据绑定
		me.dataBind=function(){
	        var source = {
	            datatype: 'array',
	            localdata: getNameAge()
	        };
	        var dataAdapter = new $.jqx.dataAdapter(source, {
	        	loadComplete: function () {
	                var records = dataAdapter.records;
	                var length = records.length;
	                var html = '';
	                for (var i = 0; i < length; i++) {
	                    var record = records[i];
	                    html += record.age + ',';
	                }
	                console.error(html);
	                $('#grid_html').html(html);
	            }
	        });
	        dataAdapter.dataBind();
		}
		
		//下拉选择
		var abcnum = 0;
		var lastpage = 10;  //选择下拉框
		
		//初始化分页
		var gratepage = function (pagecount) {
//			console.log(lastpage)
			var html = '<div class="float-right littlebtn" style="height:26px">';
			var pagecount = pagecount > 10 ? 10 :pagecount; //总页数
			var last = lastpage >= pagecount ? lastpage : pagecount;
			
			for(var i = last - 10 + 1; i <= last; i++) {
				if( i <= 0) continue;
//				if (i == pagecount) {
//					html += '<div class="selectbtn" style="width:40px;float:left;border:1px solid grey;text-align:center;border-radius:4px">'+i+'</div>';
//				} else {
					html += '<div class="selectbtn" style="width:40px;float:left;border:1px solid grey;text-align:center;border-radius:4px;margin-right:5px;margin-left:5px">'+i+'</div>';
//				}
			}
			
			return html + '</div>';
		}
		
		var pagerrenderer = function () {
		     var element = $("<div style='margin-left: 10px; margin-top: 5px; width: 100%; height: 40px;'></div>");
		     var datainfo = table.jqxGrid('getdatainformation');
		     var paginginfo = datainfo.paginginformation;
		     var rowscount = datainfo.rowscount == 0 ? 1 : datainfo.rowscount; //数据总数
		     var pagecount = paginginfo.pagescount; //页数
		     var pagenum = paginginfo.pagenum; //页码
		     var pagesize = paginginfo.pagesize;
		     console.log(datainfo)
//		     console.log(paginginfo);
		     
		     var input = $("<div style='font-size: 11px; margin-right: 10px;float: right;width:200px'>"+
		    		 "<label class='float-left'>跳至</label>" +
		    		 "<input class='float-left form-control' style='width:70px;height:25px' type='text'>" +
		    		 "<label class='float-left'>页</label></div>");
		     input.appendTo(element);
		    
		     var dropselect = $("<div style='font-size: 11px; margin-right: 100px;float: right;'></div>");
//		     dropselect.text("1-" + paginginfo.pagesize + ' of ' + datainfo.rowscount);
		     dropselect.dropDownlist({source:{'10':'10条/页','20':'20条/页','50':'50条/页'},width:90,height:25}).val(pagesize);
		     dropselect.appendTo(element);
		     self.label = dropselect;
		     
		     var leftButton = $("<div style='padding: 0px; float: right;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
		     leftButton.find('div').addClass('jqx-icon-arrow-left');
		     leftButton.width(36);
		     leftButton.jqxButton({
		         theme: 'energyblue'
		     });
		     var rightButton = $("<div style='padding: 0px; float: right;'><div style='margin-left: 9px; width: 16px; height: 16px;'></div></div>");
		     rightButton.find('div').addClass('jqx-icon-arrow-right');
		     rightButton.width(36);
		     rightButton.jqxButton({
		         theme: 'energyblue'
		     });
		     
		     rightButton.appendTo(element);
		     
	    	 element.append(gratepage(pagecount));debugger
		     element.find('.selectbtn').eq(abcnum).addClass('select');
		     
		     leftButton.appendTo(element);
		     
		     var showtotal = $('<div style="float:left">共'+rowscount+'条记录</div>');
		     showtotal.appendTo(element);
		     
		     // update buttons states.
		     var handleStates = function (event, button, className, add) {
		         button.on(event, function () {
		             if (add == true) {
		                 button.find('div').addClass(className);
		             } else button.find('div').removeClass(className);
		         });
		     }
		     rightButton.click(function () {debugger
		    	 var info = table.jqxGrid('getdatainformation');
			     var count = info.paginginformation.pagescount; //页数
		    	 var selectbtn = element.find('.selectbtn');
		     	 var selectone = element.find('.selectbtn.select');
		     	 var selectnum = parseInt(selectone.text());
		     	 var lastnum = parseInt(selectbtn.last().text());
		     	 
		     	 if(selectnum == count) return ;
		     	 selectbtn.removeClass('select');
		     	 
		     	 if(lastnum - selectnum <= 5) {
		     		 if(lastnum < count) { //最后一个小于总页数
		     			for(var i = 0;i < 10;i++) {
			     			 var text = parseInt(selectbtn.eq(i).text());
			     			 selectbtn.eq(i).text(text + 1);
			     		 }
		     			selectone.addClass('select');
		     		 } else {
		     			selectone.next().addClass('select');
		     		 }
		     	 } else {
		     		selectone.next().addClass('select');
		     	 }
		     	 
		     	 console.log(count,selectnum,lastnum);
		    	 table.jqxGrid('gotonextpage');
		     });
		     leftButton.click(function () {
		    	 var info = table.jqxGrid('getdatainformation');
			     var count = info.paginginformation.pagescount; //页数
		    	 var selectbtn = element.find('.selectbtn');
		     	 var selectone = element.find('.selectbtn.select');
		     	 var selectnum = parseInt(selectone.text());
		     	 var firstnum = parseInt(selectbtn.first().text());
		     	 
		     	 if(selectnum == 1) return ;
		     	 selectbtn.removeClass('select');
		     	 
		     	 if(count - selectnum >= 5) {
		     		 if(firstnum > 1) { //第一位大于1
		     			for(var i = 0;i < 10;i++) {
			     			 var text = parseInt(selectbtn.eq(i).text());
			     			 selectbtn.eq(i).text(text - 1);
			     		 }
		     			selectone.addClass('select');
		     		 } else {
		     			selectone.prev().addClass('select');
		     		 }
		     	 } else {
		     		selectone.prev().addClass('select');
		     	 }
		     	 
		     	 console.log(count,selectnum,firstnum);
		    	 
		    	 table.jqxGrid('gotoprevpage');
//		    	 table.jqxGrid('gotopage',index);
		     });
		     
		     //下拉选择
		     dropselect.on('select',function(){debugger
		    	 var info = table.jqxGrid('getdatainformation');
		    	 var lastpagesize = info.paginginformation.pagesize;
		    	 var lastpagenum = info.paginginformation.pagenum;
		    	 var selectbtn = element.find('.selectbtn');
//		    	 var lastnum = parseInt(selectbtn.last().text());
//		     	 var firstnum = parseInt(selectbtn.first().text());
		     	 var nowpagesize = parseInt($(this).val());
		    	 var nowpagenum = 0;
		    	 if(nowpagesize > lastpagesize) { //页码
		    		 nowpagenum = Math.floor(lastpagenum / (nowpagesize / lastpagesize));
		    	 } else {
		    		 nowpagenum = Math.floor(lastpagenum * (lastpagesize / nowpagesize));
		    	 }
		    	 
		    	 if(rowscount % nowpagesize == 0) {
		    		 pagecount = rowscount / nowpagesize;  //总页数
		    	 } else {
		    		 pagecount = Math.ceil(rowscount / nowpagesize);
		    	 }
		    	 
		    	 console.log('每页数据'+nowpagesize+'条\n','页码'+nowpagenum+'\n','总页数'+pagecount)
		    	 
		    	 selectbtn.removeClass('select');
		    	 var setpagenum = nowpagenum ;
		    	 
		    	 if(setpagenum >= 10) {
		    		 setpagenum = 9;
		    	 }
		    	 
		    	 if(pagecount <= 10) {
		    		 lastpage = pagecount;
		    	 } else {
		    		 lastpage = nowpagenum + 1;
		    	 }
		    	 abcnum = setpagenum
		    	 
		    	 
		    	 table.jqxGrid('pagesize',nowpagesize); //会重新触发第263行
		    	 table.jqxGrid('gotopage',nowpagenum);
//		    	 table.jqxGrid('refresh');
//		    	 table.trigger('pagesizechanged',nowpagesize,nowpagenum);
		     });
		     
		     //点击按钮
		     element.find('.selectbtn').on('click' ,function() {
		    	 var t = $(this);
		    	 var selectbtn = element.find('.selectbtn');
		    	 var text = parseInt(t.text());
		    	 var index = t.index();
		    	 var info = table.jqxGrid('getdatainformation');
		     	 var count = info.paginginformation.pagescount; //页数
		     	 var lastnum = parseInt(selectbtn.last().text());
		     	 var firstnum = parseInt(selectbtn.first().text());
		     	debugger
		    	 console.log('click',text,index);
		    	 selectbtn.removeClass('select');
		    	 if( index > 4) {
		    		 if(lastnum < count){
		    			 for(var i = 0;i < 10;i++){
		    				 var txt = parseInt(selectbtn.eq(i).text());
		    				 if(txt + 1 > count) break;
		    				 selectbtn.eq(i).text(txt + 1);
		    			 }
		    			 t.prev().addClass('select')
		    		 } else if(lastnum == count){
		    			 t.addClass('select');
		    		 }
		    	 }else if(index < 4){
		    		 if(firstnum > 1){
		    			 for(var i = 0;i < 10;i++){
		    				 var txt = parseInt(selectbtn.eq(i).text());
		    				 if(txt - 1 < 1) break;
		    				 selectbtn.eq(i).text(txt - 1);
		    			 }
		    			 t.next().addClass('select')
		    		 } else if(firstnum == 1){
		    			 t.addClass('select');
		    		 }
		    	 }else {
		    		 t.addClass('select');
		    	 }
		    	 
		    	 table.jqxGrid('gotopage',text - 1);
		     })
		     
		     //跳至
		     input.find('input').on('keyup' ,function(event) {debugger
		    	 var info = table.jqxGrid('getdatainformation');
		     	 var count = info.paginginformation.pagescount; //页数
		     	 var selectbtn = element.find('.selectbtn');
		     	 var lastnum = parseInt(selectbtn.last().text());
		     	 var firstnum = parseInt(selectbtn.first().text());
		    	 var iptvalue = parseInt($(this).val()); //输入的数
		    	 var keyCode = event.keyCode;

		    	 if(iptvalue > count || iptvalue < 1) return;
		    	 
		    	 if(iptvalue != '') {
		    		 if(keyCode == 13) {
		    			 selectbtn.removeClass('select');
				     	 if(iptvalue >= lastnum) {
				     		 var num = iptvalue - lastnum;
				     		 for(var i = 0; i < 10 ;i++) {
				     			 var text = parseInt(selectbtn.eq(i).text());
				     			 selectbtn.eq(i).text(text + num);
				     			 
				     		 }
				     		 selectbtn.last().addClass('select');
				     	 } else if(iptvalue >= firstnum && iptvalue < lastnum){
				     		 var index = 0;
				     		 for(var i = 0; i < 10 ;i++) {
				     			 var text = parseInt(selectbtn.eq(i).text());
				     			 if( text == iptvalue) {
				     				 index = i;
				     				 break;
				     			 }
				     		 }
				     		 selectbtn.eq(index).addClass('select');
				     	 } else { //iptvalue < firstnum && iptvalue >= 1;
				     		for(var i = 0; i < 10 ;i++) {
				     			 var num = firstnum - iptvalue;
				     			 var text = parseInt(selectbtn.eq(i).text());
				     			 selectbtn.eq(i).text(text - num);
				     		 }
				     		 selectbtn.first().addClass('select');
				     	 }
				     	 
				     	 table.jqxGrid('gotopage',iptvalue - 1);
		    		 }
		    	 }
		     })
		     
		     return element;
		 }
		
		me.initGrid=function(){
			var source = {
//				data:{},
                datatype: 'json',
                datafields: [
                    { name: 'time', type: 'date' /*,format: 'yyyy-MM-dd HH:mm:ss'*/},         
                    { name: 'choose', type: 'bool'},         
                    { name: 'id', type: 'string'},         
                    { name: 'name', type: 'string' },
                    { name: 'type', type: 'string' },
                    { name: 'price', type: 'string' },
                    { name: 'weight', type: 'string' },
                    { name: 'length', type: 'string' },
                    { name: 'color', type: 'string' },
                    { name: 'number', type: 'string' },
                    { name: 'cost', type: 'string' },
                    { name: 'inventory', type: 'string' },
                    { name: 'photo', type: 'string' },
                    { name: 'saletotal', type: 'string' },
                ],
                url: url,
                type: 'get',
                async: true,
                cache: false,
//                addrow: function (rowid, rowdata, position, commit) {
//                    // synchronize with the server - send insert command
//                    // call commit with parameter true if the synchronization with the server was successful. 
//                    // and with parameter false if the synchronization has failed.
//                    // you can pass additional argument to the commit callback which represents the new ID if it is generated from a Database. Example: commit(true, idInDB) where "idInDB" is the row's ID in the Database.
//                    commit(true);
//                }
            };
            var dataAdapter = new $.jqx.dataAdapter(source,{
                beforeLoadComplete: function (data, status, xhr){},
                loadComplete: function (data){},
                loadError: function (xhr, status, error){}
            });
            console.log(dataAdapter);
            
//            table.jqxGrid({
//            	source: dataAdapter,
//                columnsresize: true,
//                width: '100%',
//                theme: 'energyblue',
//                pageable: true,
//                autoheight: true,
//                pagesize:20,
//                rowsheight:40, //行高
//                columnsheight: 40,//头部高
//                statusbarheight: 40,//底部高度
//                pagerrenderer: pagerrenderer,
//                columns: me.setColumns()
//            });
            
//            table.on('pagesizechanged', function (event,nowpagesize,nowpagenum) {
//            	console.error('pagesizechanged',nowpagesize)
//            	table.jqxGrid('pagesize',nowpagesize);
//            	
//            	timeOut(function(){
//            		table.jqxGrid('gotopage',nowpagenum);
//            		pagerrenderer(nowpagenum);
//            	},200)
//            });
            
//            return false;
            
            table.jqxGrid({
            	altrows: true,
                width: '100%',
                source: dataAdapter,
                columnsresize: true, //改变列宽度
                enablehover:true,//鼠标移动到行上，颜色改变
                showstatusbar: true,//底部
                statusbarheight: 40,//底部高度
                showaggregates:true,//底部描述
//                showtoolbar:false, //头部
                pageable:true, //分页
                pagesize:20,
                editable:true,//编辑
                editmode:'click',//可编辑的格子打开方式
                selectionmode:'singlecell',
                autoheight:true,//grid height
                rowsheight:40, //行高
                columns: me.setColumns(),
                columnsheight: 40,//头部高
                scrollmode: 'deferred',
                enablebrowserselection: false,
                enabletooltips: true, //title
                enableanimations: false,
                enabletooltips: true, //是否提示
//                showfilterrow: true,
//                filterable: true
                rendered: function(columnHeaderElement) {
                	//grid已经渲染完成  //cellendedit也会触发
                	var sum = table.jqxGrid('getcolumnaggregateddata', 'number', ['sum']).sum;
                	console.error(sum);
                },
                ready: function() {
                	//This function is called when the grid is initialized and the binding is complete.
                	computeRow();
                }
            });
            
		}

		//设置columns
		me.setColumns=function(){
			var columns=[
			      { text: '时间', datafield: 'time', cellsformat: 'yyyy-MM-dd'},       
			      { text: '选择', datafield: 'choose', columntype: 'checkbox', enabletooltips: false,hidden: false,
			    	  cellvaluechanging: function (row, datafield, columntype, oldvalue, newvalue) {
//			    		  console.info(row, datafield, columntype, oldvalue, newvalue)
			    		  var rows=table.jqxGrid('getrows');
			    		  for(var i=0;i<rows.length;i++){
			    			  rows[i].choose=false;
			    		  }
			    		  
			    		  if(!oldvalue) return true;
			    		  return false;
			    	  }
			      },       
			      { text: '产品id', datafield: 'id', width: '10%',displayfield:'prodName',columntype:'template',
			    	  createeditor:function(row, cellvalue, editor) {
			    		  var width = editor.width();
			    		  var setting = {
		    				  height: '40px',
		                      searchMode: 'none',
		                      width: width,
		                      enableBrowserBoundsDetection: false,
		                      displayMember: 'prodName',
			                  valueMember: 'id',
		                      placeHolder: "请选择"
			    		  }
			    		  editor.comboBox(setting);
			    	  },
			    	  initeditor:function(row, cellvalue, editor, celltext, pressedChar) {debugger
			    		  var rowdata = table.jqxGrid('getrowdata',row);
			    	  	  var id = rowdata.id == null ? '' : rowdata.id;
			    		  var source = [
			    		      { id : 1, prodName : '北京' ,_name : 'beijing' ,namepy : 'bj'},
			    		      { id : 2, prodName : '上海' ,_name : 'shanghai',namepy : 'sh'},
			    		      { id : 3, prodName : '苏州' ,_name : 'suzhou' ,namepy : 'sz'}
			    		  ]
			    		  editor.comboBox({
			    			  source: source,
			    			  height: 40,
			    			  width: 'auto'
			    		  }).val(id);
			    		  timeOut(function(){
//			    			  editor.val(cellvalue);
				    	  	  editor.jqxComboBox('open');
				    	  	  editor.find('input').eq(0).focus();
			    		  },0)
			    	  },
			    	  geteditorvalue: function(row, cellvalue, editor) {debugger
			              return {
			                  label: editor.find('input').val(), //cellvalue
			                  value: editor.val()
			              }
			          }
			      },
                  { text: '名称', datafield: 'name',displayfield:'name', width: '10%',enabletooltips: false /*是否提示*/ ,
			    	  geteditorvalue: function(row, cellvalue, editor) {
			              return editor.val();
			          }
                  },
                  { text: '种类', datafield: 'type' },
                  { text: '价格', datafield: 'price' ,editable:true,
                	  validation: function (cell, value) {
            	         if (value < 0 || value > 150) {
            	             return { result: false, message: "Quantity should be in the 0-150 interval" };
            	         }
            	         return true;
            	      }
                  },
                  { text: '数量',draggable :false, align :'right', cellsalign :'right', datafield: 'number', cellsformat:'f2' ,minwidth: '5%',aggregates:['sum','min'],
//                	  aggregates: ['sum','min','max',{
//                          '总数量01':function (aggregatedValue, currentValue, column, record) {
//                              var total = currentValue;
//                              return aggregatedValue + total;
//                          },
//	                	  '总数量02':function (aggregatedValue, currentValue, column, record) {
//                        		var total = currentValue;
//                        		return aggregatedValue + total;
//                   	      }
//                	  }],
//                	  aggregatesrenderer: function (aggregates) {
//                		  $.each(aggregates ,function(i ,v) {
//                			 console.log(v); 
//                		  });
//                		  var sum = table.jqxGrid('getcolumnaggregateddata', 'number', ['sum']).sum;
//                		  var sum = aggregates.sum;
//                		  sum = money(sum,2,true);
//                		  var html='<div style="position:relative;margin:10px 10px 10px 22px;overflow:hidden">总计:';
//                		  return html+sum+'</div>'
//                	  }
                  },
                  { text: '销售总价', datafield: 'saletotal',resizable:false ,editable:false,width: '8%',hidden:false,aggregates:['sum'],
                	  aggregatesrenderer: function (aggregates) {
                		  var sum = table.jqxGrid('getcolumnaggregateddata', 'saletotal', ['sum']).sum;
//                		  var sum = aggregates.sum;
                		  sum = money(sum,2,true);
                		  var html='<div style="position:relative;margin:10px 10px 10px 22px;overflow:hidden">总价:';
                		  return html+sum+'</div>'
                	  }
                  },
                  { text: '采购总价', datafield: 'purchasetotal',resizable:false ,editable:false,width: '8%',hidden:true,aggregates:['sum'],
                	  aggregatesrenderer: function (aggregates) {
                		  var sum = table.jqxGrid('getcolumnaggregateddata', 'purchasetotal', ['sum']).sum;
//                		  var sum = aggregates.sum;
                		  sum = money(sum,2,true);
                		  var html='<div style="position:relative;margin:10px 10px 10px 22px;overflow:hidden">采购:';
                		  return html+sum+'</div>'
                	  }
                  },
                  { text: '重量', datafield: 'weight', width: '5%' ,
                	  cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
//                		  debugger
                		  var html = $(defaulthtml);
                		  return html.text(2)[0].outerHTML;
				      }
                  },
                  { text: '长度', datafield: 'length' },
                  { text: '颜色', datafield: 'color', width: '5%' },
                  { text: '进价', datafield: 'cost' ,
                	  cellclassname: function (row, column, value, data) {
            		      if (value < 1.5) {
            		          return 'redcell';
            		      }
            		  }
                  }, //cellclassname :'redcell', 自定义class
                  { text: '库存', datafield: 'inventory' },
                  { text: '图片', datafield: 'photo', minwidth: '5%' ,editable:false,
                	  cellsrenderer: function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
//                        debugger
//                          var button = '<input type="button" style="opacity: 0.99; position: absolute; top: 0%; left: 0%; padding: 0px; margin-top: 2px; margin-left: 2px;' +
//                                  ' width: 96%; height: 36px;" value="请选择" role="button" class="jqx-rc-all jqx-button jqx-fill-state-normal addPhoto">';
//                          var html = "<div style='background: white;text-align:center;margin: 3px;'>" +
//                          	  button + "</div>";
//                          return html;
                      }
                  }
             ];
			
			var arr=[
			      { text: '操作',datafield:'operate',editable:false,align:'center', width: '7%' ,
			    	  cellsrenderer:function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
				    	  var rtStr = '<div style="text-align: center;padding-top: 8px;">' +
			                    '<a class="md-cancel hoverspan del" title="删除"></a>' +
			                    '<a class=" md-description hoverspan copy" title="复制"></a>' +
			                    '<a class="md-note-add hoverspan add" title="新增"></a>' +
			                    '</div>';
		                  return rtStr;
				      }   
			      }, 
			      { text: '编号',editable: false,resizable: false,
			          aggregatesrenderer: function(aggregates, column, element) {
			              var renderstring = '<div style="position: relative; margin-top: 10px; margin-right:5px; text-align: center;">' +
			                  '合计</div>';
			              return renderstring;
			          },
			          datafield: 'sequence',
//			          columntype: 'number',
			          width: '3%',
			          cellsrenderer: function(rowIndex, columnfield, value, defaulthtml, columnproperties, rowdata) {
//			        	  debugger
			              return "<div style='margin:11px auto;text-align:center;'>" + (rowIndex + 1) + "</div>";
			          }
		         }
			];
			columns.unshift(arr[1]);
			columns.unshift(arr[0]);
			return columns;
		}
		
		//绑定事件
		me.loadEvent=function(){
//			timeOut(function(){
//				table.jqxGrid('begincelledit',0,'number');
//				table.jqxGrid('begincelledit',0,'number','17');
//				table.jqxGrid('endcelledit',0,'number',false);
//			},4000);
			//删除
			
//			table.jqxGrid('beginupdate');
//			table.jqxGrid('endupdate');
			
			table.on('bindingcomplete' ,function() {
//            	var rows = $('#grid').jqxGrid('getrows')
//            	console.log('........bindingcomplete',rows)
            })
			
			table.on('columnclick', function (event) {debugger
			    // event arguments.
			    var args = event.args;
			    // column's settings.
			    var column = args.column;
			    // column data field.
			    var dataField = args.datafield;
			     // original event.
			    var ev = args.originalEvent;
			});
			
			table.on('click','.del',function(e){
				console.log('delete');
				var record = table.jqxGrid('getrows');
//				var rows = table.jqxGrid('source').records;
				if (record.length == 1) return;
				// delete row
				Core.confirm({
					message:'确定要删除？',
					confirmCallback:function(){
//						var record = table.jqxGrid('getrows');
						var rowindex = table.jqxGrid('getselectedcell').rowindex;
						var id = table.jqxGrid('getrowid', rowindex);
						table.jqxGrid('deleterow', id);
//						record.splice(id+1,1);
						var source = {
							localdata:record,
							type:'array'
						};
						var dataAdapter = new $.jqx.dataAdapter(source, {
			                beforeLoadComplete: function(data, status, xhr) {},
			                loadComplete: function(data) {},
			                loadError: function(xhr, status, error) {}
			            });
			            table.jqxGrid({ source: dataAdapter });
						
//						rows = me.setData(rows);
//						table.jqxGrid('source').records=rows;
//						table.jqxGrid('refreshdata');
//						table.jqxGrid('refresh');
					}
				});
			});
			
			//增加一行
			table.on('click','.add',function(){debugger
				var index = table.jqxGrid('getselectedcell').rowindex;
				var records = table.jqxGrid('source').records;
//				var records = table.jqxGrid('getrows');
				var row = defaultRow();
				table.jqxGrid('addrow',null,row);
//				return false;
//				records.splice(index+1,0,row);
				
//				var source = {
//					localdata:records,
//					type:'array'
//				};
//				var dataAdapter = new $.jqx.dataAdapter(source, {
//	                beforeLoadComplete: function(data, status, xhr) {},
//	                loadComplete: function(data) {},
//	                loadError: function(xhr, status, error) {}
//	            });
//	            table.jqxGrid({ source: dataAdapter });
				
//				records = me.setData(records);
//				table.jqxGrid('source').records = records;
//				table.jqxGrid('refreshdata');
			});
			
			//复制行
			table.on('click','.copy',function(){
				var records = table.jqxGrid('getrows');
				var index = table.jqxGrid('getselectedcell').rowindex;
				var rowdata = table.jqxGrid('getrowdata',index);
				records.splice(index+1,0,rowdata);
				var source = {
					localdata:records,
					type:'array'
				};
				var dataAdapter = new $.jqx.dataAdapter(source, {
	                beforeLoadComplete: function(data, status, xhr) {},
	                loadComplete: function(data) {},
	                loadError: function(xhr, status, error) {}
	            });
	            table.jqxGrid({ source: dataAdapter });
//				table.jqxGrid('beginupdate');
//				var records=table.jqxGrid('source').records;
//				var index=table.jqxGrid('getselectedcell').rowindex;
//				var _row = me.setData()[index];
//				records.splice(index+1,0,_row);
//				records=me.setData(records);
//				table.jqxGrid('source').records=records;
//				table.jqxGrid('refreshdata');
//				table.jqxGrid('endupdate');
//				console.log(rowdata);
			});
			
			//cellbegin
			table.on('cellbeginedit',function(event){
			    // event arguments.
			    var args = event.args;
			    // column data field.
			    var dataField = event.args.datafield;
			    // row's bound index.
			    var rowBoundIndex = event.args.rowindex;
			    // cell value
			    var value = args.value;
			    // row's data.
			    var rowData = args.row;
			});
			
			//cellend
			table.on('cellendedit',function(event){
				debugger
				var args = event.args;
			    var datafield = args.datafield;
			    var rowindex = args.rowindex;
			    var value = args.value;
			    var oldValue = args.oldValue;
//			    var rowData = args.row;
			    var row = table.jqxGrid('getrowdata',rowindex);
//			    console.log(row);
			    
			    //输入的是数字
			    var arr=['price','number','saletotal','weight','length','cost','inventory'];
			    if(arr.indexOf(datafield)>-1){
			    	row[datafield]=money(value,2,true);
			    }
			    
			    //计算
			    computeRow(row);
			    console.log(row);
//			    return ;
			    var id = table.jqxGrid('getrowid', rowindex);
		        var commit = table.jqxGrid('updaterow', id, row);
			});
			
			//刷新数据
			$('#grid_render').off('click').on('click',function(){
				var abc='abc';
				console.assert(abc=='abb','wrong');
				console.time('time')
				var data=[
			      	{"name":"西瓜","type":"小","price":"2.4","weight":"1.8","length":"0.3","color":"红","number":"17","cost":"1.0","inventory":"200","photo":"红色","saletotal":""},
			    	{"name":"葡萄","type":"中","price":"3.2","weight":"0.6","length":"1.1","color":"黄","number":"30","cost":"1.5","inventory":"150","photo":"黄色","saletotal":""},
			    	{"name":"柚子","type":"大","price":"2.7","weight":"2.2","length":"2.3","color":"橙","number":"23","cost":"1.1","inventory":"180","photo":"橙色","saletotal":""},
			    	{"name":"西瓜","type":"小","price":"2.4","weight":"1.8","length":"0.3","color":"红","number":"16","cost":"1.0","inventory":"200","photo":"红色","saletotal":""},
			    	{"name":"葡萄","type":"中","price":"3.2","weight":"0.6","length":"1.1","color":"黄","number":"30","cost":"1.5","inventory":"150","photo":"黄色","saletotal":""},
			    	{"name":"柚子","type":"大","price":"2.7","weight":"2.2","length":"2.3","color":"橙","number":"23","cost":"1.1","inventory":"180","photo":"橙色","saletotal":""}
			    ];
				var source={
					localdata:data,
					type:'array'
				};
				var dataAdapter = new $.jqx.dataAdapter(source, {
	                beforeLoadComplete: function(data, status, xhr) {},
	                loadComplete: function(data) {},
	                loadError: function(xhr, status, error) {}
	            });
//				dataAdapter.dataBind();
	            table.jqxGrid({ source: dataAdapter });
	            console.timeEnd('time');
			});
			
			//显示、隐藏
			$('#grid_saleTotal,#grid_purchaseTotal').off('click').on('click',function(){
				var id=$(this).attr('id');
				var column=id=='grid_saleTotal'?'saletotal':'purchasetotal';
				console.error(id,column);
//				table.jqxGrid('beginupdate');
				if(table.jqxGrid('iscolumnvisible',column)){
					table.jqxGrid('hidecolumn',column);
				}else{
					table.jqxGrid('showcolumn',column);
				}
				table.jqxGrid('setcolumnproperty',column,'editable',false); //设置column属性
				
				var source=table.jqxGrid('source').records;
				var length=source.length;
				for(var i=0;i<length;i++){
					computeRow(source[i]);
				}
//				table.jqxGrid('endupdate');
				table.jqxGrid('refresh');
				table.jqxGrid('refreshaggregates');
			});
			
			//获取可见列数据
			$('#grid_getdata').off('click').on('click',function(){
				console.time('time');
				var source=table.jqxGrid('source').records;
				var noneed={
					boundindex:true,
					uid:true,
					undefined:true,
					uniqueid:true,
					visibleindex:true
				}
//				var hidecolumn=['saletotal','purchasetotal'];
				var data=[];
				for(var i=0;i<source.length;i++){
					var obj={};
					for(var k in source[i]){
						if(!noneed[k]){
							obj[k]=source[i][k];
						}
					}
					data.push(obj);
				}
				
				for(var i=0;i<data.length;i++){
					var d=data[i];
					for(var k in d){
						if(!table.jqxGrid('iscolumnvisible',k)){
							delete d[k];
						}
					}
				}
				console.info(data);
				console.timeEnd('time');
			});
		}
		
		//计算关系
		var relation=[
		    {datafield:['price','number','saletotal']},
		    {datafield:['cost','number','purchasetotal']}
		];
		
		var computeRow=function(row){
			console.error('计算');
			var row = row == null ? table.jqxGrid('getrows') : row;
			//计算每一行
			var length=relation.length;
			for(var i=0;i<length;i++){
				var datafield=relation[i].datafield;
				row[datafield[2]]=money(row[datafield[0]]*row[datafield[1]],2,true);
			}
		}
		
		//uid
		me.setData=function(ArrObj){
			var oldData = [];
	        var not = {
	            boundindex: true,
	            uid: true,
	            uniqueid: true,
	            undefined: true,
	            visibleindex: true,
	        }

	        var data = [];
	        if (ArrObj === undefined) {
	            data = table.jqxGrid('source').records;
	            for (var i = 0; i < data.length; i++) {
	                var obj = {};
	                for (var j in data[i]) {
	                    if (!not[j]) {
	                        obj[j] = data[i][j];
	                    }
	                }
	                oldData.push(obj);
	            }
	            return oldData;
	        } else {
	            delete not[undefined];
	            data = ArrObj;
	            for (var i = 0; i < data.length; i++) {
	                for (var j in not) {
	                    data[i][j] = i;
	                }
	            }
	            return data;
	        }
		}
		
		//comboBox
		me.initBox=function(){
			$('#grid_box').jqxComboBox({
//				width: '250px',
		        height: '40px',
		        multiSelect: true,
		        theme: 'energyblue',
		     	popupZIndex:-1,
		        searchMode:'none',
		        showArrow:false,
		        placeHolder:''
			});
			$('#grid_box').find('input').css({width:200});
			timeOut(function(){
				var show = $('#grid_box').attr('aria-owns');
				$('#'+show).addClass('hide');
			})
			
			$('#grid_box').on('keyup',function(e){
				e.preventDefault();
				var t=$(this);
				t.off('change');
				var code=e.keyCode;
				if(code==13){
					var value=t.find('input').val();
					var items=t.jqxComboBox('getSelectedItems');
					var arr=[];
					if(items!=null){
						for(var i=0;i<items.length;i++){
							arr.push(items[i].value);
						}
					}
					if(value!=''){
						arr.push(value);
					}
					
					t.jqxComboBox({
						source:arr
					});
					$('#grid_box').find('input').css({width:200});
					for(var i=0;i<arr.length;i++){
						t.jqxComboBox('selectIndex',i);
					}
//					t.on('change',setSource);
					setSource()
				}
			});
			
		}
		
		var setSource=function(){
			$('#grid_box').on('change',function(){
				$('#grid_box').off('change');
				console.info('change')
				var items=$('#grid_box').jqxComboBox('getSelectedItems');
				var arr=[];
				for(var i=0;i<items.length;i++){
					arr.push(items[i].value);
				}
				console.info(items);
				$('#grid_box').jqxComboBox({
					source:arr
				});
				$('#grid_box').find('input').css({width:200});
				for(var i=0;i<arr.length;i++){
					$('#grid_box').jqxComboBox('selectIndex',i);
//					$('#grid_box').off('change');
				}
			});
		}
		
		//获取异步请求数据
		var getAsyncData=function(data){
			console.error(data)
			console.error('data')
		}
		
		var getAsyncData1=function(data){
			getAsyncData(data)
			console.error('data1')
		}
		
		me.callBacks=function(){
			Core.AjaxRequest({
				type:'get',
				showMsg:false,
				url:'js/modules/sys/source.txt',
				callback:function(source){
					var back = $.Callbacks('once');
					back.add(getAsyncData1);
					back.add(getAsyncData);
					
//					back.add(getAsyncData,getAsyncData1);
					back.fire(source);
					
					//once，只add一次，fire触发之后,add的函数就会被清理掉
					back.add(getAsyncData);
					back.fire(source);
				}
			})
		}
		
		var fn = function() {
			console.log(arguments[0]);
		}
		
		me.callBacks1=function(){
			var callbacks = $.Callbacks('once,memory');

			callbacks.add( fn );
			callbacks.fire( "1" );
			callbacks.add( fn );
			callbacks.fire( "2" );
			callbacks.add( fn );
			callbacks.fire( "3" );
			callbacks.add( fn );
			callbacks.fire( "4" );
			
			
			Core.AjaxRequest({
				type:'get',
				showMsg:false,
				url:'js/modules/sys/source.txt',
				callback:function(source){
					//menory，等所有的add之后在触发fire
					var back = $.Callbacks('memory');  
					back.add(getAsyncData1);
//					back.add(getAsyncData,getAsyncData1);
					back.fire(source);
					back.add(getAsyncData);
				}
			})
		}
		
		//图片的缩放  ,（先按屏幕宽度缩小，在按屏幕高度缩小）
		me.imgSuoFang=function(){
			$('#grid_img').on('click','.gridimg',function(e){
				e.preventDefault();
				var t = $(this);
				var h = $(window).height();  //屏幕高度
				var w = $(window).width();   //屏幕宽度
//				console.log($(this));
				var naturalHeight = t[0].naturalHeight; //图片实际高度
				var naturalWidth = t[0].naturalWidth;   //图片实际宽度
				var src = t.attr('src');             //图片src
				
				//按比例缩放图片大小
				(function(){debugger
					var box = 0.6 * w;
					
					var scale = function(box) {
	                    var max = Math.max.call(null, box, naturalHeight, naturalWidth);
	                    return max > box ? box / max : 1;
	                }
					
					//缩放后的高和宽
					var _h = naturalHeight * scale(box);
					var _w = naturalWidth * scale(box);
					
					//按屏幕宽度缩小之后
					if (_h > h) {
	                    var box = 0.9 * h;
	                    _h = naturalHeight * scale(box);
	                    _w = naturalWidth * scale(box);
	                }
					
//					$('#grid_test_img').attr('src',src).css({width:_w,height:_h}).center().show();
					//.center()会改变$('#grid_test_img')的position
//					return false;
					
					$('#grid_test_img').attr('src',src).css({width:_w,height:_h,top:(h-_h)/2,left:(w-_w)/2}).show();
					console.log('abcd')
				})()	
				
				
			});
			
			var clientX,clientY,left,top;
			
			$('#grid_test_img').off('mousewheel').off('mousedown').on({
				'click':function(){
					$(this).hide();
				},
				'mousedown':function(e){
					console.log(e);
					var start = true;
					var clientX = e.clientX;
					var clientY = e.clientY;
					var left = $(this)[0].offsetLeft;
					var top = $(this)[0].offsetTop;
					console.log(clientX,clientY,left,top);
					$(this)[0].ondragstart = function() {
                        return false;
                    } //拖动图片时，防止鼠标变形
					
					$(document).off('mousemove').on('mousemove',function(evt){
						var _left = evt.clientX - clientX;
						var _top = evt.clientY -clientY;
						if(start){
							console.log(_left,_top,left,top)
							$('#grid_test_img').css({left:left + _left,top:top + _top});
						}
					});
					$(document).off('mouseup').on('mouseup',function(){
						console.error('mouseup');
						start = false;
					});
				},
				'mousewheel':function(e){  //图片缩放：width和height等比例缩放；left和top分别是 width和height等比例缩放 的一半
					var t = $(this);		//width和height增加，left和top减少。反之则增加
					var height = parseFloat(t[0].style.height.replace('px', ''));
					var width = parseFloat(t[0].style.width.replace('px', ''));
					var left = parseFloat(t.css('left').replace('px',''));
					var top = parseFloat(t.css('top').replace('px',''));
					var delta = e.originalEvent.wheelDelta;
					var wh = delta > 0 ? 1.1 : 0.9;
					var lt = delta > 0 ? -0.1 : 0.1;
					console.log(height,width,top,left)
					var cs = {
						left : left + lt * width / 2 + 'px',
						top : top + lt * height / 2 + 'px',
						width : width * wh,
						height : height * wh
					}
					t.css(cs);
					return false;
				}
			});
		}
		
		var deferred=function(){
			console.log('deferred')
			return jQuery.ajax({
				type:'get',
				url:'js/modules/sys/source.txt'
			});
		}
		//异步代码处理
		me.ajaxDeferred=function(){
//			setTimeout(function(){
//				console.log('ccc');
//			},0)
//			setTimeout(function(){
//				console.log('aaa');
//			},0)
//			$.when(deferred()).then(function(d){
//				console.log(d);
//			})
			
			var defer = $.Deferred(); //构建异步对象

		    setTimeout(function(){
		    	defer.resolve(5);    
		    },1000);

		    defer.then(function( value ) {
		    	console.log(value)
		    	return value * 2;
		    });
		    defer.done(function( value ) {
		        console.log('打印出值',value)
		    });
			
//			console.log('bbb');
		}
		
		var fn=function(){
			console.log('fn');
		}
		$('#grid_chufa').on('click',function(){
			var e = document.createEvent('Event');
	        e.initEvent('build', true, true);
	        $('#grid_render')[0].addEventListener('build',fn,false);
	        $('#grid_render')[0].dispatchEvent(e);
	        
//	        $.openHref();
	        
//			$.ajax({
//				type:'get',
//				url:'js/modules/sys/source.txt'
//			});
//			ajaxchufa();
		})
		
		$('#grid_chufa')[0].getData=function(){console.log('get data')}
		
		var ajaxchufa=function(){
			$(document).ajaxStart(function(e){
				console.log('请求开始\n',e)
			})
			$(document).ajaxSuccess(function(e){
				console.log('请求成功\n',e)
			})
		}
			
	}
	
})();