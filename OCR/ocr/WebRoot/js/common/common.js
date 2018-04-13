// 当前登录用户
var currentUser;
// 当前主题
var currentTheme = "account";
// 当前国际化
var currentCulture = "zh_CN";
// 表格每页显示行数
var gridPageSize = 20;
// 表格每页显示选项
var pagesizeoptions = ['10', '20', '50', '100'];
// 站点
var SiteName = "59.151.26.11";

var language = ["zh_CN", "en_US", "ja_JP"];

var portalIndex = "/Front";

var platformIndex = "/Front";

var currentCode = "CN";

var permission = '';

//var customerId=null;

var clickUserbNumber = 0;

//数据字典数据
var codeData = null;

//版本号
var version_js = '2017-04-25_v1';

var version_html = '2017-04-25_v1';

function getCurrencyArray() {
    var curs = [
        ['zh_CN', 'Cn'],
        ['en_US', 'En'],
        ['ja_JP', 'Jp']
    ];
    return curs;
}

function initCurCode(curname) {
    var CurArys = getCurrencyArray();
    for (var i = 0; i < CurArys.length; i++) {
        if (CurArys[i][0].toUpperCase() == curname.toUpperCase()) {
            currentCode = CurArys[i][1];
            return;
        }
    }
}
initCurCode(currentlang);

/**
 * 控件enter事件
 * 
 * @param parentId
 * 				父级id或class
 * @param submitId
 * 				提交按钮id或class
 */
function enterSubmit(parentId, submitId) {
    $(parentId).keydown(function(e) {
        if (e.keyCode == 13) {
            $(submitId).click();
        }
    });
}

/**
 * setCloseAlertTimeOneSecond
 * 设置操作成功的弹出框关闭时间为一秒，普通任然是5秒
 * @params hide 自己设置时间
 * @params showMsg : false
 */
function setCloseAlertTimeOneSecond(times) {
    debugger
    var times = times == undefined ? '1000' : times;
    Core.alert({
        message: '操作成功',
        hide: times
    })
}

//金额加逗号隔开
function formatNum(str) {
    var x = '';
    str = money(str);
    if (str < 0) {
        x = str.substring(0, 1);
        str = str.substring(1);
        console.log(str);
    }
    var newStr = "";
    var count = 0;
    for (var i = str.indexOf(".") - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0) {
            newStr = str.charAt(i) + "," + newStr;
        } else {
            newStr = str.charAt(i) + newStr; //逐个字符相接起来
        }
        count++;
    }
    str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
    return x + str;
}

//获取登录成功的域名
function getHostName() {
    var hostName = '';
    hostName = window.location.hostname;
    return hostName;
}

function setCurrentUrl() {
    var sUrl = getHostName();

    if (sUrl == 'localhost' || sUrl == '192.168.1.3') {
        sUrl = 'http://192.168.1.3:8090/SimpleBss/';
    } else if (sUrl.indexOf('.cn') > -1) {
        sUrl = 'http://xsbss.ydcfo.net.cn/';
    } else {
        sUrl = 'http://xsbss.ydcfo.com/';
    }

    return sUrl;
}

/**
 * getNowFormatDate获取当前时间
 * 
 * 根据需求传参数确定是否精确到秒
 * 
 * @param bool
 * 			传true或不传
 * @returns {String}
 * 			返回当前时间
 */
function getNowFormatDate(bool) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();

    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }

    if (bool == true) {
        var strMinutes = date.getMinutes(),
            strSecond = date.getSeconds();
    }

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    if (bool == true) {
        currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
            " " + date.getHours() + seperator2 + strMinutes +
            seperator2 + strSecond;
    }
    return currentdate;
}

/**
 * 依据当前月份，获取改变的时间
 * 
 * @param date
 * 			当前时间，格式为yyyy-mm-dd
 * @param num
 * 			改变的时长，可为正负整数
 * @returns {String}
 * 			改变之后的时间
 */
function getChangeDate(date, num) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份  
    var month = arr[1]; //获取当前日期的月份  
    var day = arr[2]; //获取当前日期的日  
    var days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中的月的天数  
    var year2 = year;
    var month2 = parseInt(month) + Number(num);

    if (month2 > 12) {
        year2 = parseInt(year2) + 1;
        month2 = Number(month2 - 12);
    }

    if (month2 < 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12 + month2;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();

    if (day2 > days2) {
        day2 = days2;
    }

    if (month2 < 10) {
        month2 = '0' + month2;
    }

    var t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
}

/**
 * 发现目标元素执行方法
 * 
 * node:jQuery对象
 * 
 * callback:回调方法
 */
$.visibleDoFunc = function(node, callback) {
    var list = node;
    $.each(list, function() {
        var t = $(this);
        if (t.is(':visible')) {
            callback(t);
        }
    })
}

/**
 * 获取html模板
 */
$.loadModal = function(html_url, callback) {
    $('<div></div>').load(html_url + '?v=' + version_html, function(res) {
        $.timeOutCookie(res);
        callback(res);
    });
}

/**
 * 缓存检测
 */
$.timeOutCookie = function(res) {
    if (res.indexOf('logInForMobile=OK') > -1) {
        $("body").find("#cover_div").remove();
        Core.alert({ avaiable: false, message: '缓存失效，请重新登录', callback: logout, hide: false });
        throw 'Cookie is die';
    }

}
    //退出登录
function logout() {
    window.onbeforeunload = function(event) {}
    $.post('logout', function(res) {
        $('body').html('').css('background-color', '#EAEBEC');
        $(res).appendTo($('body'));
    });
}

/**
 * 新窗口打开目标URL
 */
$.openHref = function(url) {
    var url = url;
    var a = '<a target="_blank" href="' + url + '"></a>';
    if (document.all) {
        $(a)[0].click();
    } else {
        var e = document.createEvent("MouseEvents");
        e.initEvent("click", true, true);
        $(a)[0].dispatchEvent(e);
    }
}

$.checkArr = function(arr) {
    //		debugger
    var a = [];
    for (i = 0; i < arr.length; i++) {
        a.push(arr[i].descr);
    }
    var b = [];
    var hash = {};
    for (var i in a) {
        if (hash[a[i]]){
//        	return true;
        } else{
        	hash[a[i]] = true;
        	b.push(a[i]);
        }
    }

    return b;
}

/**
 *  返回值bool
 * 100101 in ['1001','1002'] 
 * return true
 */
$.strInArr = function(str, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (str.toString().indexOf(arr[i].toString()) == 0) {
            return true;
        }
    }
    return false;
}

/**
 *  返回值bool
 * 1001 in ['1001','1002'] 
 * return true
 */
$.strEqArr = function(str, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (str.toString() === arr[i].toString()) {
            return true;
        }
    }
    return false;
}

$.addHide = function() {
    var arr = arguments;
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        $(arguments[i]).addClass('hide');
    }
}

$.removeHide = function() {
    var arr = arguments;
    var len = arguments.length;
    for (var i = 0; i < len; i++) {
        $(arguments[i]).removeClass('hide');
    }
}

function hiddenAclick() {
    $('.hidden-aclick').on('click', function() {
        //		console.log($(this).parent());
        $(this).parent().slideUp('slow');
        $.visibleDoFunc($('.hiddendiv'), function(t) {
            return;
            t.find('input').val('');
            t.find('.jqx-dropdownlist-state-normal').jqxDropDownList({ selectedIndex: 0 });
            t.find('.jqx-combobox').jqxComboBox('clearSelection');
            t.find('.jqx-datetimeinput').jqxDateTimeInput('clearSelection');
            //t.find('.jqx-datetimeinput').val('');	
        })
    });
}

function loadBundles(lang) {
    $.i18n.properties({
        name: 'message',
        path: ws_url + '/js/common/resources/i18n/',
        mode: 'map',
        language: lang,
        cache: true,
        callback: function() {
            //	    	alert('you have change the language to ' + lang);
        }
    });
}

// jqxGrid中国语言设置
var gridLocalizationObj = {
    pagergotopagestring: "当前页:",
    pagershowrowsstring: "每页显示:",
    pagerrangestring: " 共 ",
    pagernextbuttonstring: "下一页",
    pagerpreviousbuttonstring: "上一页",
//    pagernextbuttonstring: "",
//    pagerpreviousbuttonstring: "",
    sortascendingstring: "正序",
    sortdescendingstring: "倒序",
    sortremovestring: "清除排序",
    firstDay: 1,
    percentsymbol: "%",
    currencysymbol: "￥",
    currencysymbolposition: "before",
    decimalseparator: ".",
    thousandsseparator: ",",
    emptydatastring: "暂无数据",
    loadtext: "加载中...",
    days: {
        // full day names
        names: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        // abbreviated day names
        namesAbbr: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        // shortest day names
        namesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    },
    months: {
        // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
        names: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月", ""],
        // abbreviated month names
        namesAbbr: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", ""]
    }
};


function ReadCookie(name) {
    var cookieValue = '';
    var search = name + '=';
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = document.cookie.indexOf(';', offset);
            if (end == -1) {
                end = document.cookie.length;
            }
            cookieValue = unescape(document.cookie.substring(offset, end));
        }
    }
    return cookieValue;
}

function SetCookie(name, value, hours) {
    var expire = "";
    var expireNextID = "";
    var expirenow = new Date((new Date()).getTime());
    expirenow = "; expires=" + expirenow.toGMTString();
    var SiteName = "xxxxx.com";
    var path = "/";

    if (window.location.href.indexOf("localhost") > 0) {
        SiteName = "localhost";
    }
    if (hours != null) {
        expire = new Date((new Date()).getTime() + hours * 3600000);
        expire = "; expires=" + expire.toGMTString();
        expireNextID = new Date((new Date()).getTime() + 30 * 24 * 3600000);
        expireNextID = "; expires=" + expireNextID.toGMTString();
        expireNextID_sem = new Date((new Date()).getTime() + 30 * 24 * 3600000);
        expireNextID_sem = "; expires=" + expireNextID_sem.toGMTString();
    }
    document.cookie = name + "=" + escape(value) + expire + ((path == null) ? "" : (";domain=" + SiteName + "; path=" + path));
}

function loadPayList(jsons) {
    console.log(jsons);
    var html = '';
    var json = [];
    var id = null;
    var j = jsons.accountProducts;

    for (var m = 0; m < j.length; m++) {
        if (m == 0) {
            id = j[m].id;
            json.push(j[m]);
        } else {
            if (id != j[m].id) {
                id = j[m].id;
                json.push(j[m]);
            }
        }
    };

    var orderBeginDate = jsons.orderCreateDate.substring(0, 10);
    var orderEndDate = jsons.orderEndDate.substring(0, 10);
    var len = json.length;
    var cs = 'col-md-6';
    if (len == 1)
        cs = 'col-md-12';
    var i;
    for (i = 0; i < len; i++) {
        //		var priceAmt=moneyBig(json[i].priceAmt,'￥');
        var productName = json[i].productName;
        var description = json[i].description;
        html += '<div class="' + cs + '" style="padding:0 10px;margin:20px 0 0;"><div class="row row-vp"><div class="paybox"><p class="hight120"><label for="payOrder_box5_2">' +
            productName + ':</label>' +
            description + '</p><p class="txtr"></b></p><p class="txtr">充值时间：<span>' +
            //		<b class="payOrder_box5_2_price">'+priceAmt
            orderBeginDate + '</span>—到期时间：<span>' +
            orderEndDate + '</span></p></div></div></div>'
    }
    return html;
}

//生成优惠券块
function loadmyAccountList(json, check, isView) {
    var html = '';
    var len = json.length;
    var i;
    for (i = 0; i < len; i++) {
        var amount = json[i].amount;
        var start = json[i].startTime.substring(0, 10);
        var end = json[i].endTime.substring(0, 10);
        var allow = json[i].available;
        var overdue = json[i].overdue;
        var id = json[i].id;
        var voucherCode = json[i].voucherCode;
        var tex = '';
        var type = null;
        var ht = null;

        if (json[i].type == 'all') {
            type = 'vip专用';
            ht = '使用条件：最大抵扣订单总额的100%，超过订单总额100%的金额作废';
        } else {
            type = '秒账专用';
            ht = '使用条件：最大抵扣订单总额的50%，超过订单总额50%的金额作废';
        }


        if (allow == true) {
            tex = '未使用';
        }
        if (allow == false) {
            tex = '已使用'
        }
        if (overdue == true) {
            tex = '已过期'
        }
        if (check) {
            if (isView) {
                html += '<div class="col-sm-4"><div class="col-sm-12 myAccount pointer"><input type="checkbox" checked=true class="myAccountListCheck" data-id="' + id + '" data-voucherCode="' + voucherCode + '" style="position: absolute;" ><span class="hide">' + JSON.stringify(json[i]) + '</span><table width="100%"><tbody class="myAccountBody"><tr><td rowspan=3 colspan=2 class="myAccountPrice">￥<span>' +
                    amount + '</span></td><td rowspan=1 colspan=1></td></tr><tr><td rowspan=1 colspan=1 class="myAccountTitle">' + type + '</td></tr><tr><td rowspan=1 colspan=1></td></tr><tr><td colspan=3 class="myAccountTime">' + ht + '</td></tr><tr><td colspan=3 class="myAccountTime">有效时间：' +
                    start + '至' + end + '<span class="myAccountAllow">' + tex + '</span></td></tr></tbody></table></div></div>';
            } else {
                html += '<div class="col-sm-4"><div class="col-sm-12 myAccount pointer"><input type="checkbox" class="myAccountListCheck" data-id="' + id + '" data-voucherCode="' + voucherCode + '" style="position: absolute;" ><span class="hide">' + JSON.stringify(json[i]) + '</span><table width="100%"><tbody class="myAccountBody"><tr><td rowspan=3 colspan=2 class="myAccountPrice">￥<span>' +
                    amount + '</span></td><td rowspan=1 colspan=1></td></tr><tr><td rowspan=1 colspan=1 class="myAccountTitle">' + type + '</td></tr><tr><td rowspan=1 colspan=1></td></tr><tr><td colspan=3 class="myAccountTime">' + ht + '</td></tr><tr><td colspan=3 class="myAccountTime">有效时间：' +
                    start + '至' + end + '<span class="myAccountAllow">' + tex + '</span></td></tr></tbody></table></div></div>';
            }

        } else {
            html += '<div class="col-sm-4"><div class="col-sm-12 myAccount"><table width="100%"><tbody class="myAccountBody"><tr><td rowspan=3 colspan=2 class="myAccountPrice">￥<span>' +
                amount + '</span></td><td rowspan=1 colspan=1></td></tr><tr><td rowspan=1 colspan=1 class="myAccountTitle">' + type + '</td></tr><tr><td rowspan=1 colspan=1></td></tr><tr><td colspan=3 class="myAccountTime">' + ht + '</td></tr><tr><td colspan=3 class="myAccountTime">有效时间：' +
                start + '至' + end + '<span class="myAccountAllow">' + tex + '</span></td></tr></tbody></table></div></div>';
        }

    }
    return html;
}

//获取字典渲染
function codeRender(row, columnfield, value, defaulthtml, columnproperties, rowdata) {
    var cellhtml = "<div style=\"overflow: hidden; text-overflow: ellipsis; padding-bottom: 2px; text-align: left; margin-right: 2px; margin-left: 4px; margin-top: 6px;\">";
    return cellhtml + getCodeData(value) + "</div>";
}

//获取数据字典数据
function getCodeData(codeName) {
    if (codeName === undefined) return "";
    if (codeName === null) return "-";
    if (codeData === null) {
        codeData = new Object();
        Core.AjaxRequest({
            showMsg: false,
            async: true,
            cache: true,
            type: "GET",
            url: ws_url + "/CXF/rs/code/dict",
            callback: function(res) {
                codeData = res;
                if (codeData[codeName] === undefined) return "";
                if (codeData[codeName] === null) return "-";
                return codeData[codeName];
            },
            failure: function(res) {}
        });
    } else {
        if (codeData[codeName] === undefined) return "";
        if (codeData[codeName] === null) return "-";
        return codeData[codeName];
    }
}
//
getCodeData("test");

//获取数据字典对应DISPLAY
function getListColumnByCode(data, value) {
    var display = "";
    for (var i = 0; i < data.length; i++) {
        if (data[i].codeValue == value) {
            display = data[i].codeDisplay;
            break;
        }
    }
    return display;
}

/**
 * 下拉框的数据源,dataAdapter的简单封装
 */
var ComboBoxSource = function(url) {
    var me = this;

    this.url = url;
    this.source = {
        datatype: "json",
        type: "GET",
        url: me.url
            //			async:true
    };
    this.dataAdapter = null;

    this.init = function() {
        //		debugger;
        me.dataAdapter = new $.jqx.dataAdapter(me.source, {
            autoBind: false,
            beforeLoadComplete: function() {
                return me.dataAdapter.recordids;
            }
        });
    };

    this.refresh = function(bool) {
        if (bool) {
            me.source.async = false;
            console.info(me.source, bool);
        }
        //console.log(me.dataAdapter);
        me.dataAdapter.dataBind();
        //delete me.source.ansyc;
    };

};

/**
 * 公司设置信息
 */
var company = function() {
    Core.AjaxRequest({
        url: _global_settings.service.url + "/common/ownerinformation",
        type: "GET",
//        async: false,
        showMsg: false,
        callback: function(owner) {
//            $.keepCookie();
            _global_settings.owner = owner;
            _global_settings.owner.productunitFlag = 'false';

            var info = getCurrentInfo();
//            if (info == 'ocr_checker') {
//                ComboBoxSources.map['waitCheck'] = new ComboBoxSource(ws_url + "/CXF/rs/overview/waitCheck");
//            } else {
//                ComboBoxSources.map['waitOrder'] = new ComboBoxSource(ws_url + "/CXF/rs/overview/waitOrder");
//            }

            ComboBoxSources.map['userInfo'] = new ComboBoxSource(ws_url + "/CXF/rs/user/information/" + owner.roleName);
            ComboBoxSources.init();
            $("#index-companyname").text(_global_settings.owner.companyname);
            $("#index-username").text(_global_settings.owner.username);
//          debugger
            if (localStorage.map != null && localStorage.owner == _global_settings.owner.username) {
                var obj = JSON.parse(localStorage.map);
                var index = localStorage.index;
                console.log(obj);
                var len = obj.length;
                for (var localStorage_map_i = 0; localStorage_map_i < len; localStorage_map_i++) {
                    (function(x, index) {
                        var title = x.title;
                        var url = x.url;
                        var pk = x.pk;
                        x.localStorage = true;
                        x.read = false;
                        // timeOut(function() {
                        $.addTab({ title: title, url: '', pk: pk, map: x });
                        // }, 0)
                    })(obj[localStorage_map_i], localStorage_map_i)
                }
                timeOut(function() {
                    delete localStorage.map;
                    delete localStorage.index;
                    $('#zqw_tabs').find('a').eq(index).trigger('click')
                }, 50)
            }else{
            	$.addTab({ title: '总览', url: 'page/modules/home.html', reload: true });
            }
        },
        failure: function() {}
    });
}


//company();

/**
 * 系统中所有的下拉框数据在此加载
 */
var ComboBoxSources = {
    map: {
        'taxManage': new ComboBoxSource(ws_url + "/CXF/rs/user/taxManage"),
        'users': new ComboBoxSource(ws_url + "/CXF/rs/owner/userlist"), //用户
        //		'custService': new ComboBoxSource(ws_url+"/CXF/rs/common/customer"),
        //		'custService_name': {
        //			init:function(){
        //				var customer=ComboBoxSources.getRecords('custService');
        //				var source=$.extend(true,[],customer);
        //				$.each(source,function(i,v){
        //					v.name_user=v.name+'('+v.username+')';
        //				});
        //				return source;
        //			},
        //			refresh:function(bool){
        //			},
        //			dataAdapter:{
        //				records:function(){
        //					return ComboBoxSources.map.custService_name.init();
        //				}
        //			}
        //		},
        //		'salesInfo': new ComboBoxSource(ws_url+"/CXF/rs/user/saleinfo/3"),
        //		'salesInfo_name': {
        //			init:function(){
        //				var sales=ComboBoxSources.getRecords('salesInfo');
        //				var source=$.extend(true,[],sales);
        //				$.each(source,function(i,v){
        //					v.name_user=v.userInfo.name+'('+v.username+')';
        //				});
        //				return source;
        //			},
        //			refresh:function(bool){
        //			},
        //			dataAdapter:{
        //				records:function(){
        //					return ComboBoxSources.map.salesInfo_name.init();
        //				}
        //			}
        //		},
        //		'salesAgent': new ComboBoxSource(ws_url+"/CXF/rs/salesagent/list"),
        //		'salesAgent_name': {
        //			init:function(){
        //				var agent=ComboBoxSources.getRecords('salesAgent');
        //				var source=$.extend(true,[],agent);
        //				$.each(source,function(i,v){
        //					v.name_user=v.name+'('+v.agentName+')';
        //				});
        //				return source;
        //			},
        //			refresh:function(bool){
        //			},
        //			dataAdapter:{
        //				records:function(){
        //					return ComboBoxSources.map.salesAgent_name.init();
        //				}
        //			}
        //		},
        //		'productName': new ComboBoxSource(ws_url+"/CXF/rs/accountproduct/productname"),
        //		'label': new ComboBoxSource(ws_url+"/CXF/rs/ownerlebal/search"),
        //		'agentLabel': new ComboBoxSource(ws_url+"/CXF/rs/salesagentlebal/search"),
        //		'isSenior': new ComboBoxSource(ws_url+"/CXF/rs/salesagent/senior/true"),
        //		'notSenior': new ComboBoxSource(ws_url+"/CXF/rs/salesagent/senior/false"),
        //		'allSenior': new ComboBoxSource(ws_url+"/CXF/rs/salesagent/senior/all"),
        //		'docker': new ComboBoxSource(ws_url+"/CXF/rs/user/docking"),
        'role': new ComboBoxSource(ws_url + '/CXF/rs/role/for/search'),
        //		'taxerInfo': new ComboBoxSource(ws_url+'/CXF/rs/user/taxmanage/forall'),
        'allUsername': new ComboBoxSource(ws_url + '/CXF/rs/overview/searchUserName'),
        'username': {
            init: function() {
                var user = ComboBoxSources.getRecords('allUsername'),
                    arr = [];
                for (var k in user[0]) {
                    arr.push({ 'name': k });
                }
                return arr;
            },
            refresh: function(bool) {

            },
            dataAdapter: {
                records: function() {
                    return ComboBoxSources.map.username.init();
                }
            }
        },
        'company': {
            init: function() {
                var user = ComboBoxSources.getRecords('allUsername'),
                    arr = [];
                var source = user[0];
                for (var k in source) {
                    arr.push({ 'company': source[k] });
                }
                return arr;
            },
            refresh: function(bool) {

            },
            dataAdapter: {
                records: function() {
                    return ComboBoxSources.map.company.init();
                }
            }
        },
//        'salersAndCustomers': new ComboBoxSource(ws_url + '/CXF/rs/user/customerSales/3'),
        'getEmployee': new ComboBoxSource(ws_url + '/CXF/rs/overview/getEmployee'),
//        'salesAndCust_name': {
//            init: function() {
//                var agent = ComboBoxSources.getRecords('salersAndCustomers');
//                var source = $.extend(true, [], agent);
//                $.each(source, function(i, v) {
//                    v.name_user = v.userInfo.name + '(' + v.username + ')';
//                });
//                return source;
//            },
//            refresh: function(bool) {},
//            dataAdapter: {
//                records: function() {
//                    return ComboBoxSources.map.salesAndCust_name.init();
//                }
//            }
//        }
    },
    init: function() {
        $.each(this.map, function(i, v) {
            v.init();
            v.refresh();
        });
        //			ComboBoxSources['product'].init();
    },
    loadAll: function() {
        $.each(this.map, function(i, v) {
            v.refresh();
        });
    },
    getRecords: function(key) {
        if (typeof ComboBoxSources.map[key].dataAdapter.records == 'function') return ComboBoxSources.map[key].dataAdapter.records();
        return ComboBoxSources.map[key].dataAdapter.records;
    },
    load: function(key, bool) {
        ComboBoxSources.map[key].refresh(bool);
    },
    getAdapter: function(key) {
        return ComboBoxSources.map[key].dataAdapter;
    },
    fetchModel: function(key, id, field) {
        var searchModel = function(id) {
            var models = ComboBoxSources.getRecords(key);
            for (var i = 0; i < models.length; i++) {
                var m = models[i];
                if (m[field] == id) {
                    return m;
                }
            }
            return null;
        };
        var result = searchModel(id);
        if (result === null) {
            ComboBoxSources.load(key);
            return searchModel(id);
        }
        return result;
    },
    fetchUserinfo: function(id) {
        return ComboBoxSources.fetchModel('userinfo', id, 'id');
    },
    fetchClientInfo: function(id) {
        return ComboBoxSources.fetchModel('clientInfo', id, 'clientInfoid');
    },

    getInfoMapByKey: function(source, key, value) {
        if (typeof source === 'string') {
            var sources = ComboBoxSources.getRecords(source);
        } else {
            var sources = source;
        }
        if (key == null) {
            return sources;
        }
        var len = sources.length;
        var map = {};
        for (var i = 0; i < len; i++) {
            if (sources[i] == null) continue;
            map[sources[i][key]] = {};
            var _map = map[sources[i][key]];
            for (var j in sources[i]) {
                _map[j] = sources[i][j];
            }
        }
        if (null != key && null != value) {
            return map[value] == null ? {} : map[value];
        } else {
            return map;
        }
    },
    /**
     * 数据分组排序
     * @param {String}
     *            source 资源名字，必须
     * @param {String}
     *            key 生成map对象的键名
     * @param {String}
     *            value 生成map对象的键值
     */
    getInfoMapOrderByKey: function(source, key, value) {
        if (typeof source === 'string') {
            var sources = ComboBoxSources.getRecords(source);
        } else {
            var sources = source;
        }
        if (key == null) {
            return sources;
        }
        var len = sources.length;
        var map = {};
        for (var i = 0; i < len; i++) {
            if (sources[i] == null) continue;
            var sk = sources[i][key];
            sk = sk == '' ? '未分类' : sk;
            sk = sk == null ? '未分类' : sk;
            if (!map[sk]) {
                map[sk] = [];
            }
            map[sk].push(sources[i]);
        }
        //console.log(map)
        if (null != key && null != value) {
            return map[value];
        } else {
            return map;
        }
    },
    getArrSourceOrderByKey: function(ArrSource, key, value) {
        var sources = ArrSource;
        if (ArrSource == null) return null;
        if (key == null) {
            return sources;
        }
        var len = ArrSource.length;
        var map = {};
        for (var i = 0; i < len; i++) {
            var sk = sources[i][key];
            sk = sk == '' ? '未分类' : sk;
            sk = sk == null ? '未分类' : sk;
            if (!map[sk]) {
                map[sk] = [];
            }
            map[sk].push(sources[i]);
        }
        //console.log(map)
        if (null != key && null != value) {
            return map[value];
        } else {
            return map;
        }
    }
};

//ComboBoxSources.init();
//ComboBoxSources.load('clientInfo');

$.fn.extend({

    //分类一二jqxComboBox
    comboBoxType: function(settings) {
        var defaults = {
            placeHolder: '请选择',
            displayMember: "typeValue",
            valueMember: "typeValue",
            searchMode: 'containsignorecase',
            autoComplete: true,
            width: '90%',
            height: '34px'
        };
        settings = $.extend(true, {}, defaults, settings);
        return $(this).jqxComboBox(settings);
    },

    //科目下拉Combbox
    coaCombbox: function(settings, filters) {

        var records = ComboBoxSources.getRecords('chartOfAccounts');

        if (filters === undefined) {

        } else {
            var new_records = [];
            $.each(records, function(i, v) {
                var hardCode = v.ref;
                for (var _i = 0; _i < filters.length; _i++) {
                    if (hardCode.indexOf(filters[_i]) == 0) {
                        //							&& parseInt(hardCode)!=parseInt(filters[_i])){
                        new_records.push(v);
                    }
                }
            });
            records = new_records;
        }

        var defaults = {
            theme: currentTheme,
            //			selectedIndex: 0, 
            searchMode: 'containsignorecase',
            autoComplete: true,
            placeHolder: '请输入或选择',
            source: records,
            displayMember: "displayValue",
            valueMember: "id",
            width: 200,
            height: 25
        };

        settings = $.extend(true, {}, defaults, settings);

        return $(this).each(function(i, value) {
            var v = $(value);
            console.log(v);
            v.jqxComboBox(settings);
            var valueMember = v.jqxComboBox('valueMember');
            $.each(v.jqxComboBox('source'), function(i, s) {
                //				console.log(s);
                if (s.allowInput == false) {
                    v.jqxComboBox('disableItem', s[valueMember].toString());
                }
            });
        });
    },

    //一级科目下拉
    coaCombboxOne: function(settings, filter) {
        var records = [];
        var record = ComboBoxSources.getRecords('chartOfAccounts');
        if (filter === undefined) {

        } else {
            $.each(record, function(i, v) {
                var hardCode = v.ref;
                for (var _i = 0; _i < filter.length; _i++) {
                    if (hardCode.indexOf(filter[_i]) == 0 && hardCode.length == 4) {
                        //							&& parseInt(hardCode)!=parseInt(filters[_i])){
                        records.push(v);
                    }
                }
            });
        }
        var defaults = {
            theme: currentTheme,
            //			selectedIndex: 0, 
            searchMode: 'contains',
            placeHolder: '请输入或选择',
            source: records,
            displayMember: "displayValue",
            valueMember: "id",
            width: 200,
            height: 25
        };

        settings = $.extend(true, {}, defaults, settings);
        //		
        return $(this).each(function(i, value) {
            var v = $(value);
            v.jqxComboBox(settings);
        });
    },

    //二级科目下拉
    coaCombboxTwo: function(settings, filter) {
        var records = ['全部'];
        var record = ComboBoxSources.getRecords('chartOfAccounts');
        if (filter === undefined) {

        } else {
            $.each(record, function(i, v) {
                var hardCode = v.ref;
                for (var _i = 0; _i < filter.length; _i++) {
                    if (hardCode.indexOf(filter[_i]) == 0 && hardCode.length == 6) {
                        records.push(v);
                    }
                }
            });
        }
        var defaults = {
            theme: currentTheme,
            //			selectedIndex: 0, 
            searchMode: 'contains',
            placeHolder: '请输入或选择',
            source: records,
            displayMember: "displayValue",
            valueMember: "id",
            width: 200,
            height: 25
        };

        settings = $.extend(true, {}, defaults, settings);
        //		
        return $(this).each(function(i, value) {
            var v = $(value);
            v.jqxComboBox(settings);
        });
    },


    //科目加可以选择的默认的第一个
    coaCombboxChoose: function(settings, filters, nothardCode) {
        var records = ComboBoxSources.getRecords('chartOfAccounts');
        nothardCode = nothardCode == null ? [] : nothardCode;
        if (filters === undefined) {

        } else {
            var new_records = [];
            $.each(records, function(i, v) {
                var hardCode = v.ref;
                for (var _i = 0; _i < filters.length; _i++) {
                    if (hardCode.indexOf(filters[_i]) == 0 && !$.strInArr(hardCode, nothardCode)) {
                        //							&& parseInt(hardCode)!=parseInt(filters[_i])){
                        new_records.push(v);
                    }
                }
            });
            records = new_records;
        }

        var defaults = {
            theme: currentTheme,
            selectedIndex: 0,
            searchMode: 'containsignorecase',
            autoComplete: true,
            placeHolder: '请输入或选择',
            source: records,
            displayMember: "name",
            valueMember: "id",
            width: 200,
            height: 25
        };

        settings = $.extend(true, {}, defaults, settings);

        return $(this).each(function(i, value) {
            var boolean = true;
            var v = $(value);
            v.jqxComboBox(settings);
            var valueMember = v.jqxComboBox('valueMember');
            $.each(v.jqxComboBox('source'), function(i, s) {
                //				console.log(s);
                if (s.allowInput == false || s.enabled == false) {
                    v.jqxComboBox('disableItem', s[valueMember].toString());
                    //					v.jqxComboBox('selectedIndex',i+1);
                } else {
                    if (boolean) {
                        if (s.pid == '' || s.hardCode.length == 4 || s.hardCode.length == 6 || s.hardCode.length == 8 || s.hardCode.length == 10) {
                            v.jqxComboBox('selectedIndex', i);
                        }
                        boolean = false;;
                    }
                }
            });
        });
    },
});


//	//产品下拉框
//	prodCombbox:function(settings){
//		var prodEle = $(this);
//		
//		var saleFlag=settings.saleFlag;
//		
//		var edit=settings.edit;
//		
//		var source=saleFlag===0?ComboBoxSources.getRecords('onlypurchase'):ComboBoxSources.getRecords('onlysale');
//		
//		var defaults = {
//			theme : currentTheme,
//	        searchMode:'contains',
//	        //source: ComboBoxSources.getRecords('product'), 
//	        source:source,
//	        displayMember: "name", 
//	        valueMember: "id", 
//	        width: 180, 
//	        height: 25
//		};
//		settings = $.extend(true,{},defaults, settings);
//		
//		
//		
//		var selectEvt = function(event){
//			if (event.args) {
//                var item = event.args.item;
//                var oi = item.originalItem;
//                var parents = prodEle.parents("tr");
//                console.log(parents);
//                console.log(oi);
//            	console.log(oi.buyVAT,oi.saleVAT,settings);
//            	parents.find("td > input[type='text']").removeAttr("readonly");
//            	//parents.children().eq(8).children().eq(0).val(oi.minimumSalePrice);
//            	parents.children().eq(2).text(oi.sku);//SKU码
//                if(saleFlag === 0){
////        			parents.children().eq(3).text(oi.buyInfo);//采购信息
//                	parents.children().eq(3).text(oi.spec);//规格型号
//        			//if(parents.children().eq(6).children().eq(0).val()!=0){
//        			//}else{
//        			if(_global_settings.owner.taxType=='smallscale'){
//        				parents.children().eq(7).children().eq(0).val(money(oi.costPrice));//采购单价
//        			}else{
//        				parents.children().eq(7).children().eq(0).val(money(oi.costPrice*(100+oi.buyVAT)/100));//采购单价
//        			}
//        			parents.children().eq(5).children().eq(0).removeClass('publicProductNum');
//        			//}
//                	parents.children().eq(9).text('-');	
//            		parents.children().eq(6).children().val(oi.buyVAT);//采购税率
//            		
//        		}else{
//        			parents.children().eq(9).text(oi.minimumSalePrice);
////        			parents.children().eq(3).text(oi.salesInfo);//销售信息
//        			parents.children().eq(3).text(oi.spec);//规格型号
//        			if(true==oi.inventoryFlag){
//        				parents.children().eq(5).children().eq(0).addClass('publicProductNum');
//        			}else{
//        				parents.children().eq(5).children().eq(0).removeClass('publicProductNum');
//        			}
//        			//if(parents.children().eq(6).children().eq(0).val()!=0){
//        			//}else{
//        			parents.children().eq(5).children().eq(1).val(oi.warnMinimum);
//        				parents.children().eq(7).children().eq(0).val(money(oi.salePrice*(100+oi.saleVAT)/100));//销售单价
//        			//}                        		
//            		parents.children().eq(6).children().val(oi.saleVAT);//销售税率
//        		}
//                if (item) {
//                	
//                	Core.AjaxRequest({
//            			type:"GET",
//            			showMsg:false,
//            			url:ws_url+"/CXF/rs/product/productid/qty/"+oi.id,
//            			callback:function(res){
//            				var prod = res;
//            				//console.log(oi);
////            				var prod = data.product;
//            				//通过data.id去获取产品信息
//
//                        	parents.children().eq(0).children().eq(0).val(prod.id);
//                        	
//                        	
//                        	//console.log(parents.children().eq(8),prod.discountFlag);
//                        	/*oi.minimumSalePrice===false?
//    	                			parents.children().eq(8).text("-"):(
//    	                					parents.children().eq(8).children().eq(0).val()!=null
//    	                					?0
//    	                					:parents.children().eq(8).children().eq(0).val(oi.minimumSalePrice)	
//    	                			);*/
//    	                		
//                        	if(oi.inventoryFlag){
//                        		console.log(prod.inventoryQty);
//                        		parents.children().eq(4).text(prod.inventoryQty===undefined?0:prod.inventoryQty);//库存
//                        		
//                        	}else{
//                        		parents.children().eq(4).text("-");//库存
//                        		
//                        	}
//                        	
//                        	
//            			}
//            		});
//                }
//            }
//		};		
//		
//		delete settings.saleFlag;
//		
//		delete settings.type;
//		
//		delete settings.edit;
//		
//		delete settings.orderDetails;
//		
//		return $(this).jqxComboBox(settings).on(
//				{
//					"select":selectEvt
//				}
//		);
//	}
//});

/**
 * 封装jqxWidgets中的常用组件
 */
$.fn.extend({
    button: function(settings) {
        var defaults = {
            disabled: false,
            theme: currentTheme
        };
        settings = $.extend(true, defaults, settings);
        return $(this).jqxButton(settings);
    },

    grid: function(settings) {
        var defaults = {
            theme: currentTheme,
            width: "100%",
            enableellipsis: true,
            enabletooltips: true,
            columnsresize: true,
            pageable: true,
            pagesize: gridPageSize,
            pagesizeoptions: pagesizeoptions,
            enablebrowserselection: true,
            autoheight: true,
            sortable: false,
            localization: gridLocalizationObj,
            selectionmode: "singlerow",
            virtualmode: true,
            showtoolbar: false,
            // 	  	   	ready:permission_func,
            // 	  	   	rendered:permission_func, 	  	   	
        };
        settings = $.extend(true, defaults, settings);
        return $(this).jqxGrid(settings);
    },

    datatable: function(settings) { //属性名称大小写与grid不一样，需要注意
        var defaults = {
            theme: currentTheme,
            width: "100%",
            enableBrowserSelection: true,
            columnsResize: true,
            pageable: true,
            pageSize: gridPageSize,
            pageSizeOptions: pagesizeoptions,
            sortable: true,
            localization: gridLocalizationObj,
            pagerMode: "advanced",
            selectionMode: "singlerow",
            showToolbar: false
        };
        settings = $.extend(true, defaults, settings);
        return $(this).jqxDataTable(settings);
    },

    window: function(settings) {
        var defaults = {
            theme: currentTheme,
            showCollapseButton: false,
            resizable: false,
            isModal: true,
            autoOpen: false,

        };
        settings = $.extend(true, defaults, settings);
        return $(this).jqxWindow(settings);
    },

    input: function(settings) {
        var defaults = {
            width: 150,
            height: 22,
            minLength: 1,
            theme: currentTheme
        };
        settings = $.extend(true, defaults, settings);
        return $(this).jqxInput(settings);
    },

    numberinput: function(settings) {
        var defaults = {
            width: 150,
            height: 22,
            theme: currentTheme,
            inputMode: 'simple',
            spinButtons: false
        };
        settings = $.extend(true, defaults, settings);
        return $(this).jqxNumberInput(settings);
    },

    textarea: function(settings) {
        var defaults = {
            width: 400,
            height: 100,
            theme: currentTheme
        };
        settings = $.extend(true, defaults, settings);
        return $(this).jqxInput(settings);
    },

    dropdown: function(settings) {
        var defaults = {
            selectedIndex: 0
        };
        settings = $.extend(true, defaults, settings);
        return $(this).jqxDropDownList(settings);
    },

    datetimeinput: function(settings) {
        var defaults = {
            width: '100%',
            height: 34,
            showFooter: true,
            todayString: '今天',
            clearString: '清空',
            culture: 'zh-CN',
            formatString: 'yyyy-MM-dd HH:mm:ss',
            allowNullDate: true,
            value: null,
            showTimeButton: true,
            showCalendarButton: true,
            //theme:currentTheme
        };
        settings = $.extend(true, {}, defaults, settings);
        return $(this).jqxDateTimeInput(settings);
        //			$("#input"+options.id).attr("disabled","disabled");
    },

    datetimeinputs: function(settings) {
        var defaults = {
            width: '100%',
            height: 34,
            showFooter: true,
            todayString: '今天',
            clearString: '清空',
            culture: 'zh-CN',
            formatString: 'yyyy-MM-dd',
            allowNullDate: true,
            value: null,
            //showTimeButton: true,
            //showCalendarButton: true,
            //theme:currentTheme
        };
        settings = $.extend(true, {}, defaults, settings);
        return $(this).jqxDateTimeInput(settings);
        //			$("#input"+options.id).attr("disabled","disabled");
    },

    fileuploader: function(settings) {
        var defaults = {
            readonly: false,
            filelist: null,
            ownerId: null,
            ownerName: null,
            orderId: null,
            orderType: null
        };
        //		console.log(settings);
        var urls = null;

        if (settings == undefined)
            urls = ctx + '/CXF/rs/SimpleAC/file/' + new Base64().encode('toocr/order/file/' + ownerId + '/' + ownerName);
        else
            urls = settings.url;

        //		if(settings!=undefined){
        //			urls = ctx+'/CXF/rs/common/importCoupon/9/3';
        //		}

        settings = $.extend(true, {}, defaults, settings);

        var avision = settings.avision == true ? true : settings.avision;

        'use strict';
        if (settings.readonly == true) {
            var template = $('<div class="col-md-12">' +
                '<div class="row row-vp">' +
                '<div id="uploader" class="col-md-12 wu-example">' +
                '<div id="thelist" class="uploader-list"></div>' +
                '</div>' +
                '</div>' +
                '</div>');

            var ele = $(this);
            var ele_id = $(this).attr("id");
            if (ele_id === undefined) ele_id = "";
            template.find("*").each(function(i, v) {
                var attr_id = $(this).attr("id");
                if (attr_id !== undefined) {
                    $(this).attr("id", ele_id + "" + attr_id);
                    console.log($(this).attr("id"));
                }
            });

            template.appendTo(ele);

            if (settings.filelist !== undefined && settings.filelist != "") {
                /**
                 * 查看单子附件详情
                 * 
                 * @param type
                 *            文件类型 photo（照片），other（出照片外其它），all（全部）
                 * @param flag
                 *            单子类型 sales 销售单 purchase 采购单
                 * @param id
                 *            单子id
                 *            
                 *   orderfileinfo/{type}/{flag}/{id}/{ownerId}/{username}        
                 */
                var ctxs = '';
                if (settings.orderType != null) {
                    //查看和编辑销售单时用到
                    ctxs = ws_url + '/CXF/rs/common/fileinfos/' + settings.filelist
                } else {
                    //新增销售单时用到
                    ctxs = ctx + '/CXF/rs/SimpleAC/' + new Base64().encode('toocr/order/orderfileinfo/all/sales/' + settings.orderId + '/' + settings.ownerId + '/' + settings.ownerName);
                }
                Core.AjaxRequest({
                    type: "GET",
                    showMsg: false,
                    url: ctxs,
                    callback: function(res) {
                        var $list = $('#' + ele_id + 'thelist');
                        $.each(res, function(i, v) {
                            var imgsrc = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + v.id + '/' + settings.ownerId + '/' + settings.ownerName);
                            var imgsrcs = imgsrc.split('=')[0];
                            var html = '<div data-id="' + v.id + '" id="' + v.id + '" class="item row col-md-12 fileListRow" style="border-bottom:1px solid #333; padding:5px 0px;">' +
//                                '<div class="info col-md-4">' + getUploadFileIcon(v.showName, v.id, imgsrc) + '<a class="downloadfile" title="下载" target="_blank" href="' + imgsrcs + '">' + v.showName + '</a></div>' +
                                '<div class="info col-md-4"><img class="thumbnailImg" data-id="'+v.id+'" style="width:30px;height:30px;" src="' + imgsrc + '"><a class="downloadfile" title="下载" target="_blank" href="' + imgsrcs + '">' + v.showName + '</a></div>' +
                                '<div class="state col-md-4">已上传</div>' +
                                '<div class="operate col-md-4"><a class="downloadfile" title="下载" target="_blank" href="' + imgsrcs + '">下载</a></div>' +
                                '</div>';
                            $list.append(html);
                        });

                        if(settings.showImg==undefined){
                        	$('#addSO').find('.thumbnailImg').eq(0).trigger('dblclick');
                        }
                        return ele;
                    },
                    failure: function(res) {
                        return ele;
                    }
                });
            }

        } else
        //			debugger;
            return $(this).each(function(i, v) {
            var avisionHtml = '';
            if (avision == true) {
                avisionHtml = '<button id="scanBtn"  class="btn btn-success mg10" style="height:40px;">扫描</button>' +
                    '<button id="scanInputBtn"  class="btn btn-success " style="height:40px;">录入数据</button>';
            }
            var template = $('<div class="col-md-12">' +
                '<div class="row  row-vp">' +
                '<div class="float-left">' +
                '<div id="picker">选择附件</div>' +
                '</div>' +
                '<div class="col-md-5">' +
                '<button id="ctlBtn" class="btn btn-success mg10" style="height:40px;">开始上传</button>' +
                //'<INPUT type="file" >'+
                avisionHtml +
                '</div>' +
                '<div class="col-md-5"><div class="error jqx-validator-error-label" id="errorMsg" style="height:36px;margin-left:50px;font-size:18px;padding-top:10px;"></div></div>' +
                '</div>' +
                '<div class="row  row-vp">' +
                '<div id="uploader" class="col-md-12 wu-example">' +
                '<div id="thelist" class="uploader-list"></div>' +
                '</div>' +
                '</div>' +
                '</div>');
            var ele = $(this);
            var ele_id = $(this).attr("id");
            if (ele_id === undefined) ele_id = "";
            template.find("*").each(function(i, v) {
                var attr_id = $(this).attr("id");
                if (attr_id !== undefined) {
                    $(this).attr("id", ele_id + "" + attr_id);
                }
            });
            template.appendTo(ele);

            var js = "js/webuploader/webuploader.js",
                $list = $('#' + ele_id + 'thelist'),
                $btn = $('#' + ele_id + 'ctlBtn'),
                pick = '#' + ele_id + 'picker',
                $scanBtn = $('#' + ele_id + 'scanBtn'),
                $scanInputBtn = $('#' + ele_id + 'scanInputBtn'),
                $scan_ip = $('#' + ele_id + 'buttonscan'),
                $scan_callback = $('#' + ele_id + 'scan_callback'),
                errorEle = '#' + ele_id + 'errorMsg',
                state = 'pending',
                uploader;

            var initUploader = function() {
                $.loadScript(js, function() {
                    uploader = WebUploader.create({
                        // 不压缩image
                        resize: false,
                        // swf文件路径
                        swf: ws_url + '/js/uploader/Uploader.swf',
                        // 文件接收服务端。
                        server: urls,
                        //拖拽
                        dnd:'#'+ele_id,
                        // 选择文件的按钮。可选。
                        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                        pick: pick,
                        callback: function(res) {
                            console.log(res);
                        },

                        //				        fileSizeLimit:1024000,
                        fileSingleSizeLimit: 10240000,
                        accept: {
                            extensions: 'gif,jpg,jpeg,bmp,png,pdf,docx,doc,xlsx,xls',
                            mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,application/msexcel,application/pdf,application/msword,application/vnd.ms-excel,' +
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' +
                                ''
                        }
                    });

                    uploader.on('beforeFileQueued', function(file) {
                        var filesize = $list.children().length;
                        if (filesize >= 100) {
                            $(errorEle).text("文件数量不能超过100个！已过滤。");
                            return false;
                        } else {
                            $(errorEle).text("");
                            return true;
                        }
                    });

                    // 当有文件添加进来的时候
                    uploader.on('fileQueued', function(file) {
                        console.log(file);
                        var html = '<div id="' + file.id + '" class="item row col-md-12 fileListRow" style="border-bottom:1px solid #333; padding:5px 0px;">' +
                            '<div class="info col-md-4 txt" title="' + file.name + '">' + file.name + '</div>' +
                            '<div class="state col-md-4">等待上传...</div>' +
                            '<div class="operate col-md-4"><a class="delFile" href="javascript:void(0);">删除</a></div>' +
                            '</div>';
                        $list.append(html);

                        $('#' + file.id).find('.operate').find('.delFile').on({
                            'click': function(e) {
                                e.preventDefault();
                                //					    		console.log('before upload delete:'+file.id+','+file.name);
                                uploader.removeFile(file);
                                $('#' + file.id).remove();
                            }
                        });
                    });

                    // 文件上传过程中创建进度条实时显示。
                    uploader.on('uploadProgress', function(file, percentage) {
                        var $li = $('#' + file.id),
                            $operate = $li.find(".operate"),
                            $percent = $operate.find('.progress .progress-bar');
                        // 避免重复创建
                        if (!$percent.length) {
                            $percent = $('<div class="progress progress-striped active">' +
                                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                                '</div>' +
                                '</div>').appendTo($operate).find('.progress-bar');
                        }
                        $li.find('.state').text('上传中');
                        $percent.css('width', percentage * 100 + '%');
                    });

                    uploader.on('uploadSuccess', function(file, res) {
                        switch (ele_id) {
                            case 'file-attachment': //附件列表
                                setFile();
                                $('#file-modal').modal('hide');
                                break;
                        }
                        //                        var imgsrc=ctx+'/CXF/rs/SimpleAC/down/'+new Base64().encode('toocr/order/downFile/'+res.id+'/'+settings.ownerId+'/'+settings.ownerName);
                        //                        if(settings.ownerId==null){
                        var imgsrc = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFileAttachment/' + res.id + '/' + settings.ownerName + '/N');
                        var loadImg = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFileAttachment/' + res.id + '/' + settings.ownerName + '/Y');
                        //                        }
                        $('#' + file.id).attr('data-id', res.id);
//                        $('#' + file.id).find('.info').html(getUploadFileIcon(file.name, res.id, imgsrc) + '<a title="下载" target="_blank" href="' + loadImg + '">' + file.name + '</a>');
                        $('#' + file.id).find('.info').html('<img class="thumbnailImg" style="width:30px;height:30px;" src="'+imgsrc+'">'+'<a title="下载" target="_blank" href="' + loadImg + '">' + file.name + '</a>');
                        $('#' + file.id).find('.state').text("已上传");
                        $('#' + file.id).find('.operate').html('<a class="delFile" href="' + ctx + '/CXF/rs/common/file/' + res.id + '">删除</a>');
                        $('#' + file.id).find('.operate').find('.delFile').on({
                            'click': function(e) {
                                //								 debugger;
                                var ws_urls = ws_url + '/CXF/rs/common/file/' + res.id;

                                e.preventDefault();
                                Core.confirm({
                                    message: "确定要删除？",
                                    confirmCallback: function() {
                                        Core.AjaxRequest({
                                            url: ws_urls,
                                            showMsg: false,
                                            type: "DELETE",
                                            callback: function(res) {
                                                //console.log(res);
                                                if (file !== undefined)
                                                    uploader.removeFile(file);
                                                $('#' + file.id).remove();
                                            },
                                            failure: function(res) {}
                                        });
                                    }
                                });
                            }
                        });
                    });

                    uploader.on('uploadError', function(file, res) {
                        console.log(res);
                        var myerror = JSON.parse(res);
                        $('#' + file.id).find('.state').text(myerror.errorMsg);
                    });

                    uploader.on('uploadComplete', function(file) {
                        $('#' + file.id).find('.progress').fadeOut();
                    });
                    uploader.on('error', function(event) {
                        //						 console.log('error');
                        //						 console.log(event);
                        if (event == 'Q_EXCEED_SIZE_LIMIT') {
                            $(errorEle).text("文件大小不符要求！已过滤。");
                        }
                        if (event == 'F_EXCEED_SIZE') {
                            $(errorEle).text("文件大小不符要求！已过滤。");
                        }
                        if (event == 'Q_EXCEED_NUM_LIMIT') {
                            $(errorEle).text("文件数量不能超过5个！已过滤。");
                        }
                        if (event == 'Q_TYPE_DENIED') {
                            $(errorEle).text("文件格式不符！已过滤。");
                        }
                    });

                    uploader.on('all', function(type) {
                        if (type === 'startUpload') {
                            state = 'uploading';
                            $(errorEle).text("");
                            //							 console.log('-startUpload--');
                        } else if (type === 'stopUpload') {
                            state = 'paused';
                        } else if (type === 'uploadFinished') {
                            state = 'done';
                            //							 console.log('-all done--');
                            //							 $list.children().each(function(i,v){
                            //								 console.log($(v).attr('data-id'));
                            //							 });
                        }
                        if (state === 'uploading') {
                            $btn.text('暂停上传');
                        } else {
                            $btn.text('开始上传');
                        }
                    });

                    $btn.on('click', function() {
                        if (state === 'uploading') {
                            uploader.stop();
                        } else {
                            uploader.upload();
                        }
                    });
                    $scanBtn.on('click', function() {
                        if (AVisionImg != undefined) {
                            AVisionImg.ScanDocuments();
                            AVisionImg.OCRRect("		<?xml version='1.0' encoding='UTF-8'?><ImageFileList RectOCR='1' OutFileFormat='0' FileCount='1'>  <ImportFile FileName=''>    <Rect RectName='登记类型' X1='329' Y1='70' X2='617' Y2='132' Value=''/>    <Rect RectName='姓名1' X1='1331' Y1='58' X2='1539' Y2='125' Value=''/>    <Rect RectName='证件种类1' X1='1218' Y1='446' X2='1407' Y2='493' Value=''/>    <Rect RectName='证件编号1' X1='1402' Y1='763' X2='1599' Y2='803' Value=''/>  </ImportFile></ImageFileList>");
                        } else {
                            Core.alert({ message: '请检查扫描设备！' })
                        }
                    });
                    $scanInputBtn.on('click', function() {
                        if (AVisionImg != undefined) {
                            var json = null;
                            var icount = AVisionImg.OCRTextCount();
                            if (icount > 0) {
                                for (var i1 = 0; i1 < icount; i1++) {
                                    alert(" " + AVisionImg.OCRText(0));
                                    json = JSON.parse(AVisionImg.OCRText(0));
                                }
                            } else {
                                alert("没有OCR数据");
                            }
                            for (var i in json) {
                                if (json[i]['RectName'] === '公司名称') {
                                    $('#rcptAdd-clientName').val(json[i]['Value']); //公司名称
                                    //break;
                                }
                                if (json[i]['RectName'] === '发票号码') {
                                    $('#rcptAdd-num').val(json[i]['Value']); //发票号码
                                    //break;
                                }
                                if (json[i]['RectName'] === '发票日期') {
                                    $('#rcptAdd-time').val(json[i]['Value'].replace('年', '-').replace('月', '-').replace('曰', '')); //开票日期
                                    //break;
                                }
                                if (json[i]['RectName'] === '发票总金额') {
                                    $('#rcptAdd-sum').val(json[i]['Value'].replace('￥', '').replace(' ', '')); //发票金额
                                    $('#rcptAdd-nosum').val(json[i]['Value'].replace('￥', '').replace(' ', '')); //发票金额
                                    //break;
                                }
                                if (json[i]['RectName'] === '税率') {
                                    $("#rcptAdd-tax").val(json[i]['Value'] + '%') //   税率
                                        //break;
                                }
                            }
                        }
                    });
                });
            };

            //将已有的文件插入列表
            if (settings.filelist != null && settings.filelist != '') {
                /**
                 * 查看单子附件详情
                 * 
                 * @param type
                 *            文件类型 photo（照片），other（出照片外其它），all（全部）
                 * @param flag
                 *            单子类型 sales 销售单 purchase 采购单
                 * @param id
                 *            单子id
                 *            
                 *   orderfileinfo/{type}/{flag}/{id}/{ownerId}/{username}        
                 */
                var ctxs = '';
                if (settings.orderType != null) {
                    //查看和编辑销售单时用到
                    ctxs = ws_url + '/CXF/rs/common/fileinfos/' + settings.filelist
                } else {
                    //新增销售单时用到
                    ctxs = ctx + '/CXF/rs/SimpleAC/' + new Base64().encode('toocr/order/orderfileinfo/all/sales/' + settings.orderId + '/' + settings.ownerId + '/' + settings.ownerName);
                }
                Core.AjaxRequest({
                    type: "GET",
                    showMsg: false,
                    url: ctxs,
                    callback: function(res) {
                        debugger;
                        $.each(res, function(i, v) {
                            var imgsrc = ctx + '/CXF/rs/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + v.id + '/' + settings.ownerId + '/' + settings.ownerName);
                            $list.append('<div data-id="' + v.id + '" id="' + v.id + '" class="item row col-md-12 fileListRow"  style="border-bottom:1px solid #333; padding:5px 0px;">' +
//                                '<div class="info col-md-4">' + getUploadFileIcon(v.showName, v.id, imgsrc) + '<a class="downloadfile01" title="下载" target="_blank" href="' + imgsrc + '">' + v.showName + '</a></div>' +
                                '<div class="info col-md-4">' + '<img class="thumbnailImg" style="width:30px;height:30px;" src="' + imgsrc + '">' + '<a class="downloadfile01" title="下载" target="_blank" href="' + imgsrc + '">' + v.showName + '</a></div>' +
                                '<div class="state col-md-4">已上传</div>' +
                                '<div class="operate col-md-4"><a class="delFile" href="' + imgsrc + '">删除</a></div>' +
                                '</div>');

                            $list.find('.operate').find('.delFile').off("click").on({
                                'click': function(e) {

                                    var ws_urls = ws_url + '/CXF/rs/common/file/' + v.id;

                                    e.preventDefault();
                                    Core.confirm({
                                        message: "确定要删除？",
                                        confirmCallback: function() {
                                            Core.AjaxRequest({
                                                url: ws_url + '/CXF/rs/common/file/' + v.id,
                                                type: "DELETE",
                                                showMsg: false,
                                                callback: function(res) {
                                                    $('#' + v.id).remove();
                                                },
                                                failure: function(res) {}
                                            });
                                        }
                                    });
                                }
                            });
                        });
                    },
                    failure: function(res) {}
                });
            } else {
                initUploader();
            }
        });
    },

    moneyinput: function(settings) {
        'use strict';

        var defaults = {
            textalign: 'right',
            defaultValue: '0.00',
            allowNull: true, //是否可以为负数
            allowDecimal: false, //是否可以为负数
            integer: false // 是否整数
        };
        settings = $.extend(true, defaults, settings);

        return $(this).each(function(i, v) {
            var input = $(v),
                //				var input = $(this).jqxInput(),
                oldValue = input.val() == '' ? settings.defaultValue : input.val(),
                color = input.css("color");

            input.attr("type", 'text').css('text-align', settings.textalign);

            var isNumber = function(value) {
                return !isNaN(parseFloat(value)) && isFinite(value);
            };
            var isNumberReg = function(value) {
                return /^[-]?\d+(\.\d+)?$/g.exec(value);
            };
            var formatNumber = function(value) {
                if (/^[-]?\d+(\.\d{2})$/g.exec(value)) {
                    return value;
                }
                if (/^[-]?\d+(\.\d{1})$/g.exec(value)) {
                    return value + '0';
                }
                if (/^[-]?\d+(\.)$/g.exec(value)) {
                    return value + '00';
                }
                if (/^[-]?\d+$/g.exec(value)) {
                    return value + ".00";
                }
                if (/^[-]?\d+(\.\d{2,})$/g.exec(value)) {
                    return value.substring(0, value.indexOf(".") + 3);
                }
                if (value == "") {
                    return '0';
                }
                value = oldValue;
                return value;
            };
            input.on({
                "blur": function(e) {
                    //					console.log(e);
                    var value = input.val();
                    if (value == '') {
                        oldValue = 0;
                    }
                    if (!isNumber(value)) { //输入的内容可以进行计算
                        value = oldValue;
                    } else {
                        value = settings.allowDecimal === true ?
                            parseFloat(value).toString() :
                            parseFloat(value).toString().replace('-', '');
                    }
                    oldValue = formatNumber(value);
                    if (settings.integer === true) {
                        oldValue = parseInt(value);
                    }

                    input.val(oldValue);
                    input.css({ "color": color });
                    input.trigger('keyup');
                },
                "keyup": function(e) {
                    //debugger
                    var num = input.val();
                    if (num == "") {
                        if (settings.allowNull) {
                            input.val('');
                            return;
                        } else {
                            input.val('0');
                            return;
                        }

                    }
                    if (num.indexOf("-") > -1) {
                        if (settings.allowDecimal == true && num.length == 1) {
                            input.val('-');
                            return;
                        }
                        if (settings.allowDecimal == false) {
                            input.val(num.replace(/-/g, ''));
                            return;
                        }

                    }
                    /*if(settings.integer==true){
                    	var num=parseInt(input.val());
                    }*/
                    if (isNaN(num)) {
                        var n = num.toString();
                        if (!isNaN(parseInt(num))) {
                            if (n.substr(-1) != '.') {
                                if (n.indexOf('.') != -1) {
                                    input.val(parseFloat(num));
                                } else {
                                    input.val(parseInt(num));
                                }
                            }

                        } else {
                            input.val(0);
                        }
                    }
                    if (settings.integer == true) {
                        if (isNaN(num)) {
                            var num = parseInt(num);
                            if (isNaN(num)) {
                                input.val(0);
                            } else {
                                input.val(parseInt(num));
                            }
                        }
                        if (num.toString().indexOf('.') > -1) {
                            input.val(parseInt(num));
                        }
                    }
                },
                "keypress": function(e) {
                    var event = e || window.event;
                    if (settings.allowDecimal !== true && event.keyCode == 45) {
                        event.returnValue = false;
                    } else if (event.keyCode > 47 && event.keyCode < 58 || event.keyCode === 46 || event.keyCode == 45) {
                        event.returnValue = true;
                    } else {
                        event.returnValue = false;
                    }
                },
                "paste": function(e) {
                    var value = input.val();
                    //					console.log('input'+value);
                    if (!isNumberReg(value)) {
                        input.css({ "color": "red" });
                    } else {
                        input.css({ "color": color });
                    }
                },
            });
        });
    },
    //审批历史列表
    auditList: function(settings) {
        'use strict';
        var defaults = {
            bpmnObj: null
        };
        settings = $.extend(true, defaults, settings);

        //		if(settings.bpmnObj.processInstanceId === undefined) return $(this);

        //		var processInstanceId = settings.bpmnObj.processInstanceId;
        var processInstanceId = null;
        var url = _global_settings.service.url + '/bpmn/commentvolist/processinstanceid/' + processInstanceId;

        var commentsource = {
            datatype: "json",
            url: url,
            type: "GET"
        };

        var adp = new $.jqx.dataAdapter(commentsource);

        return $(this).grid({
            virtualmode: false,
            source: adp,
            pageable: false,
            columns: [
                { text: "审批人", datafield: 'username' },
                { text: "备注", datafield: 'content' },
                { text: "审批时间", datafield: 'time' }
            ]
        });
    },

    //再次提交窗口
    auditWindow: function(settings) {
        'use strict';
        var defaults = {
            pre: "",
            bpmnObj: null,
            taskId: null,
            processKey: null,
            callback: function() {}
        };
        settings = $.extend(true, defaults, settings);
        var template = '<div class="jqxwindow" id="' + settings.pre + 'winAudit" style="display:none;">' +
            '<div>再次提交</div>' +
            '<div id="' + settings.pre + 'winFormAudit">'
            //				        +'<input type="hidden" id="'+settings.pre+'add-audit-task-process-key" />'
            //				        +'<input type="hidden" id="'+settings.pre+'add-audit-task-bpmnobj-id" />'
            +
            '<input type="hidden" id="' + settings.pre + 'add-taskId"/>' +
            '<table><tr><td>提交理由</td>' +
            '<td colspan="3"><textarea id="' + settings.pre + 'add-content"></textarea></td></tr>' +
            '<tr><td colspan="4" class="btn_align">' +
            '<button class="btn btn-inverse" id="' + settings.pre + 'saveApproveBtn">确定</button>'
            //+'<button class="btn btn-inverse" id="'+settings.pre+'saveRejectBtn" >审批不通过</button>'
            +
            '<button class="btn btn-inverse" id="' + settings.pre + 'cancelApproveBtn" >取消</button>' +
            '</td></tr></table>' +
            '</div></div>';
        $(this).after(template);

        //审批窗口
        $("#" + settings.pre + "winAudit").window({
            width: 500,
            height: 450,
            cancelButton: $("#" + settings.pre + "cancelApproveBtn"),
            initContent: function() {
                // 初始化新增用户页面组件
                $("#" + settings.pre + "add-content").textarea();
            }
        }).on({
            "open": function() {
                var windowW = $(window).width();
                var windowH = $(window).height();
                var height = $("#" + settings.pre + "winAudit").height();
                var width = $("#" + settings.pre + "winAudit").width();
                $("#" + settings.pre + "winAudit").jqxWindow({
                    position: { x: (windowW - width) / 2, y: (windowH - height) / 2 + $(document).scrollTop() }
                })
                $("#" + settings.pre + "add-content").val("");
                //$("#"+settings.pre+"add-taskId").val(settings.taskId);
            }
        });

        var initAddParam = function() {
            var obj = new Object();
            obj.content = $("#" + settings.pre + "add-content").val();
            //obj.processInstanceId = $("#"+settings.pre+"add-taskId").val();
            //obj.passFlag = true;
            return obj;
        };
        var initRejectParam = function() {
            var obj = new Object();
            obj.content = $("#" + settings.pre + "add-content").val();
            //obj.processInstanceId = $("#"+settings.pre+"add-taskId").val();
            //obj.passFlag = false;
            return obj;
        };

        var url = null,
            type = null,
            json = null;


        var editSubmit = function(obj) {
            var content = obj.content;
            if ('' == content) {
                Core.alert({
                    message: '提交理由不能为空！'
                });
                return false;
            } else if (content.length > 200) {
                Core.alert({
                    message: '提交理由字数最大长度为200！'
                });
                return false;
            }
            if (settings.type == 'view') {
                url = _global_settings.service.url + "/" + settings.url + '/commit/id/' + settings.id + '/' + content;
                if (settings.page != null) {
                    url = url + '/' + settings.page;
                }
            } else {
                json = settings.json();
                url = _global_settings.service.url + "/" + settings.url + '/commit/' + content;
            }
            console.log(json)
            Core.AjaxRequest({
                url: url,
                type: "POST",
                params: json,
                async: false,
                callback: function(res) {
                    /*Core.alert({
						message:"操作成功",
						callback:function(){
							$("#"+settings.pre+"winAudit").jqxWindow("close");
//							me.refreshDataInfo("#"+me.gridEle);
							settings.callback();
						}
					});*/
                    $("#" + settings.pre + "winAudit").jqxWindow("close");
                    try {
                        refreshDataInfo(settings.parent);
                    } catch (e) {}
                    settings.callback();
                },
                failure: function(res) {}
            });
        };

        $("#" + settings.pre + "saveApproveBtn").off("click").on({
            "click": function() {
                editSubmit(initAddParam());
            }
        });
        $("#" + settings.pre + "saveRejectBtn").off("click").on({
            "click": function() {
                editSubmit(initRejectParam());
            }
        });
    },

    //审批窗口
    auditWindowSP: function(settings) {
        'use strict';
        var defaults = {
            pre: "",
            bpmnObj: null,
            taskId: null,
            processKey: null,
            callback: function() {}
        };
        settings = $.extend(true, defaults, settings);
        var template = '<div class="jqxwindow" id="' + settings.pre + 'winAuditSP" style="display:none;">' +
            '<div>审批处理</div>' +
            '<div id="' + settings.pre + 'winFormAuditSP">' +
            '<input type="hidden" id="' + settings.pre + 'add-taskIdSP" value="' + settings.value + '"/>' +
            '<table><tr><td>审批意见</td>' +
            '<td colspan="3"><textarea id="' + settings.pre + 'add-contentSP"></textarea></td></tr>' +
            '<tr><td colspan="4" class="btn_align">' +
            '<button class="btn btn-inverse" id="' + settings.pre + 'saveApproveBtnSP">审批通过</button>' +
            '<button class="btn btn-inverse" id="' + settings.pre + 'saveRejectBtnSP" >审批不通过</button>' +
            '<button class="btn btn-inverse" id="' + settings.pre + 'cancelApproveBtnSP" >取消</button>' +
            '</td></tr></table>' +
            '</div></div>';
        $(this).after(template);

        //审批窗口
        $("#" + settings.pre + "winAuditSP").window({
            width: 500,
            height: 450,
            cancelButton: $("#" + settings.pre + "cancelApproveBtnSP"),
            initContent: function() {
                // 初始化新增用户页面组件
                $("#" + settings.pre + "add-contentSP").textarea();
            }
        }).on({
            "open": function() {
                var windowW = $(window).width();
                var windowH = $(window).height();
                var height = $("#" + settings.pre + "winAuditSP").height();
                var width = $("#" + settings.pre + "winAuditSP").width();
                $("#" + settings.pre + "winAuditSP").jqxWindow({
                    position: { x: (windowW - width) / 2, y: (windowH - height) / 2 + $(document).scrollTop() }
                })
                $("#" + settings.pre + "add-contentSP").val("");
                //$("#"+settings.pre+"add-taskIdSP").val(settings.taskId);
            }
        });

        var initAddParam = function() {
            var obj = new Object();
            obj.content = $("#" + settings.pre + "add-contentSP").val();
            obj.taskId = $("#" + settings.pre + "add-taskIdSP").val();
            obj.passFlag = true;
            return obj;
        };
        var initRejectParam = function() {
            var obj = new Object();
            obj.content = $("#" + settings.pre + "add-contentSP").val();
            obj.taskId = $("#" + settings.pre + "add-taskIdSP").val();
            obj.passFlag = false;
            return obj;
        };

        var editSubmit = function(obj) {
            if ('' == obj.content) {
                obj.content = ' ';
            }
            Core.AjaxRequest({
                url: _global_settings.service.url + "/bpmn/completeTask",
                type: "PUT",
                params: obj,
                async: false,
                callback: function(res) {
                    $("#" + settings.pre + "winAuditSP").jqxWindow("close");
                    try {
                        refreshDataInfo(settings.parent);
                    } catch (e) {}
                    settings.callback();
                },
                failure: function(res) {}
            });
        };

        $("#" + settings.pre + "saveApproveBtnSP").off("click").on({
            "click": function() {
                editSubmit(initAddParam());
            }
        });
        $("#" + settings.pre + "saveRejectBtnSP").off("click").on({
            "click": function() {
                if ('' == $("#" + settings.pre + "add-contentSP").val()) {
                    Core.alert({
                        message: '审批意见不能为空！'
                    });
                    return false;
                }
                editSubmit(initRejectParam());
            }
        });
    },

    easytable: function(settings) {
        var defaults = {
            tr: '<tr></tr>',
            tr_load_func: function() {

            }

        };
        settings = $.extend(true, {}, defaults, settings);

        var node = $(this).find("tbody");

        var addLine = function(line) {
            var index = node.children().length + 1;
            var line = $(line);
            line.find('.index').html(index);
            settings.tr_load_func(line);
            node.append(line);
        }

        node.on('click', 'tr', function() {
            if ($(this)[0] == node.find('tr').eq(-1)[0]) {
                node.trigger('addline');
            }
        })

        node.on('addline', function() {
            addLine(settings.tr);
        })

        node.on('click', '.del', function() {
            //debugger;
            var tr = $(this).parent().parent()
            if (node.find('tr').length > 1) {
                Core.confirm({
                    message: "确定要删除？",
                    confirmCallback: function() {
                        tr.remove();
                        var trlist = node.children();
                        trlist.each(function() {
                            var t = $(this);
                            t.find('.index').text(parseInt(t.index()) + 1);
                        });
                        node.trigger('change');
                    }
                });
                return false;
            }
        })
        
        node.on('click', '.copy', function() {
            //debugger;
            var tr = $(this).parent().parent();
            var line = $("<tr class='cwhite'>" +
        	"<td class='blt'><i class='md-cancel del'></i><i class='md-description copy hidden'></i></td>"+
        	'<td class="brt brtt"><div class="time"></div></td>'+
        	'<td class="brt brtt"><input type="text" class="receiveMoney form-control" style="width:200px"><span class="hidden recId"></span></td>'+
        	"<td class='brt brtt'><div class='receiveWay'></div></td>" + //prodCombboxs
        	"<td class='brt brtt br0'><input type='text' class='remark form-control'></td>" +
        	"</tr>");
            line.insertAfter(tr);
            var res={
            	time:tr.find('.time').val(),
            	receive:tr.find('.receiveMoney').val(),
            	way:tr.find('.receiveWay').val(),
            	remark:tr.find('.remark').val()
            }
            settings.tr_load_func(line,res);
            node.trigger('change');
//            Core.alert({message:'copy'});
        })
        addLine(settings.tr);
        return $(this);
    },
    center: function(options) { //让盒子处于垂直水平方向居中
        var options = $.extend({
            inside: window,
            transition: 0,
            minX: 0,
            minY: 0,
            withScrolling: true,
            vertical: true,
            horizontal: true,
            isRelative: false,
        }, options);

        return this.each(function() {
            var props = { position: 'absolute' };
            if (options.vertical) {
                var top = ($(options.inside).height() - $(this).outerHeight()) / 2;
                if (options.withScrolling) top += $(options.inside).scrollTop() || 0;
                top = (top > options.minY ? top : options.minY);
                $.extend(props, { top: top + 'px' });
            }
            if (options.horizontal) {
                var left = ($(options.inside).width() - $(this).outerWidth()) / 2;
                if (options.withScrolling) left += $(options.inside).scrollLeft() || 0;
                left = (left > options.minX ? left : options.minX);
                $.extend(props, { left: left + 'px' });
            }
            if (options.transition > 0) $(this).animate(props, options.transition);
            else $(this).css(props);
            return $(this);
        });
    },
    focusIndex: function(value) {
        var el = this[0];
        if (el && (el.tagName == 'TEXTAREA' || el.type.toLowerCase() == 'text')) {
            if (value === undefined) {
                return el.selectionStart;
            } else if (typeof value == 'number') {
                el.selectionEnd = value;
                el.selectionStart = value;
            }
        } else {
            if (value === undefined) {
                return undefined;
            }
        }
    }
});



/**
 * dropdown与数据字典，自定义dropdown的方法
 */
var DropDownList = function(settings) {
    var me = this;
    var defaults = {
        placeHolder: "请选择",
        selectedIndex: 0,
        displayMember: "codeDisplay",
        valueMember: "codeValue",
        width: 120,
        height: 22,
        autoDropDownHeight: true,
        dropDownWidth: 120,
        dropDownHeight: 120,
        checkboxes: false,
        disabled: false,
        filterable: false,
        url: ws_url + "/CXF/rs/code/"
    };

    if (settings.dropDownWidth) {
        settings.width += 6;
        settings.dropDownWidth += 6;
    }

    this.obj = $.extend(defaults, settings);

    this.initOptions = function(options) {
        if (options.dropDownWidth) {
            options.width += 6;
            options.dropDownWidth += 6;
        }
        me.obj = $.extend(me.obj, options);
    };

    //获取数据字典
    this.codeDropDownList = function(element_id, codeName, nullItem, settings) {
        var setting = settings == undefined || settings == null ? {} : settings;
        setting = $.extend(me.obj, setting);
        Core.AjaxRequest({
            url: setting.url + codeName, //ws_url + "/rest/system/"+codeName, 
            showMsg: false,
            async: false,
            cache: true,
            type: "GET",
            callback: function(data) {
                var source = {
                    datatype: "json",
                    datafields: [
                        { name: 'codeValue' },
                        { name: 'codeDisplay' }
                    ],
                    localdata: data
                };
                var dataAdapter = new $.jqx.dataAdapter(source);

                $("#" + element_id).jqxDropDownList({
                    placeHolder: setting.placeHolder,
                    selectedIndex: setting.selectedIndex,
                    source: dataAdapter,
                    displayMember: setting.displayMember,
                    valueMember: setting.valueMember,
                    width: setting.width,
                    height: setting.height,
                    autoDropDownHeight: setting.autoDropDownHeight,
                    checkboxes: setting.checkboxes,
                    theme: currentTheme
                });
                // 判断是否显示空白行
                if (typeof(nullItem) == "boolean" && nullItem) {
                    if (element_id.indexOf("search") > -1) {
                        $("#" + element_id).jqxDropDownList('insertAt', { label: "全部", value: "" }, 0);
                    } else {
                        $("#" + element_id).jqxDropDownList('insertAt', { label: "请选择", value: "" }, 0);
                    }
                }
            }
        });
    };

    // 自定义数据字典方法
    this.customDropDownList = function(element_id, url, fieldText, valueText, nullItem, methodType, params, selectIndex) {
        Core.AjaxRequest({
            url: url, //ws_url +"/rest"+ url,
            type: methodType == null ? "GET" : methodType,
            params: params == null ? {} : params,
            showMsg: false,
            async: false,
            cache: true,
            callback: function(data) {
                var source = {
                    datatype: "json",
                    datafields: [
                        { name: fieldText },
                        { name: valueText }
                    ],
                    localdata: data
                };
                var dataAdapter = new $.jqx.dataAdapter(source);

                $("#" + element_id).jqxDropDownList({
                    selectedIndex: me.obj.selectedIndex,
                    source: dataAdapter,
                    displayMember: fieldText,
                    valueMember: valueText,
                    width: me.obj.width,
                    height: me.obj.height,
                    autoDropDownHeight: me.obj.autoDropDownHeight,
                    dropDownWidth: me.obj.dropDownWidth,
                    dropDownHeight: me.obj.dropDownHeight,
                    disabled: me.obj.disabled,
                    checkboxes: me.obj.checkboxes,
                    theme: currentTheme
                });

                // 判断是否显示空白行
                if ($("#" + element_id).jqxDropDownList('checkboxes') === true) {
                    $("#" + element_id).jqxDropDownList({ placeHolder: "请选择" });
                }
                if (typeof(nullItem) == "boolean" && nullItem) {
                    if (element_id.indexOf("search") > -1) {
                        $("#" + element_id).jqxDropDownList('insertAt', { label: "全部", value: "" }, 0);
                    } else {
                        $("#" + element_id).jqxDropDownList('insertAt', { label: "请选择", value: "" }, 0);
                    }
                } else if (data.length == 0) {
                    $("#" + element_id).jqxDropDownList('insertAt', { label: " ", value: "0" }, 0);
                }
                $("#" + element_id).jqxDropDownList('selectIndex', selectIndex == null ? 0 : selectIndex);
            }
        });
    };

};

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}


function getHMS() {
    var date = new Date();
    var sb = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return sb;
}
isCheckEd = false;

function JournalDetailTableCheckNum() {

    isCheckEd = false;
    var isNum = arguments.length === 2 ? arguments[1].value : arguments[0];
    //	console.log(arguments);
    if (!isNaN(isNum)) {
        $(this).css('border', '');
        isCheckEd = true;
        return true;
    } else {
        $(this).focus();
        $(this).css('border', 'solid 2px red');
        isCheckEd = false;
        return false;
    }
    //	console.log('running...');
};

$.fn.extend({
    //普通下拉dropDownlist
    dropDownlist: function(settings) {
        var defaults = {
            theme: currentTheme,
            placeHolder: '请选择',
            displayMember: "typeValue",
            valueMember: "typeValue",
            width: '100%',
            height: '34px'
        };
        settings = $.extend(true, {}, defaults, settings);
        return $(this).jqxDropDownList(settings);
    },

    //普通jqxComboBox
    comboBox: function(settings) {
        var defaults = {
            theme: currentTheme,
            searchMode: 'none',
            enableBrowserBoundsDetection: false,
//          autoComplete: true,
            width: '100%',
            height: '34px',
            renderSelectedItem: refNameByPinyin,
            placeHolder: '请选择'
        };
        //        if (settings.source == undefined || settings.source == null) {
        //            settings.source = [];
        //        }
        //        var t = $(this);
        //        var initArgs = t.data('jqxComboBox');
        //        if (initArgs != undefined) {
        //            settings = $.extend(false, {}, initArgs.initArgs[0], settings);
        //        }
        var t = $(this);
        var newSource = [];
        var easytablekeyup = null;
        
        t.off('focus','input').on('focus','input', function() {
            console.log('comboBox,focus');
            t.jqxComboBox('open');
        });
        
        settings = $.extend(true, {}, defaults, settings);
        var source = settings.source;
        var displayMember = settings.displayMember;
        
        newSource = $.extend(true,[],source);
        if(source.length > 200) {
        	source.length = 200;
        }
        
        t.off('keyup').off('compositionstart').on('compositionend').on('keyup',function(event){
        	if (t.prop('comStart') === 'start') {
        		event.stopPropagation();
                return; // 中文输入过程中不截断
            }
        	var code = event.keyCode == null ? '' : event.keyCode;
        	if ($.strEqArr(code,[13 , 37 , 38 , 39 , 40 ])) {
                if (code == 13) {
                    t.jqxComboBox('close');
                }
                return;
            }
        	
        	clearTimeout(easytablekeyup);
            easytablekeyup = setTimeout(function(){
            	console.time('搜索时间');
        		var val = t.find('input').val();
        		var iputIndex = t.find('input').focusIndex();
//        		var selectionStart = t.find('input')[0].selectionStart;
//        		var selectionEnd = t.find('input')[0].selectionEnd;
            	var arr = [] ,other = [];
            	for(var i = 0, len = newSource.length;i < len; i++){
            		var abc = newSource[i][displayMember] == undefined ? newSource[i] : newSource[i][displayMember];
            		if(val == abc) {
            		    arr.unshift(newSource[i]);
            		} else if(val != '' && abc.indexOf(val) > -1) {
            		    arr.unshift(newSource[i]);
            		} else {
            		    other.push(newSource[i]);
            		}
            	}
            	
            	if(arr.length >= 0 && arr.length < 200) {
            		arr = arr.concat(other);
            	}
            	if(arr.length > 200) {
            		arr.length = 200;
            	}
            	t.jqxComboBox({
            		source:arr
            	})
            	if(val != ''){
            		t.val(val);
            		t.find('input').val(val);
            		t.find('input').focusIndex(iputIndex);
//            		t.find('input')[0].selectionStart = selectionStart;
//            		t.find('input')[0].selectionEnd = selectionEnd;
            		t.jqxComboBox('open');
            	}else{
            		t.find('input').val(val);
            		t.jqxComboBox('open');
            	}
            	console.timeEnd('搜索时间')
        	},60);
        	
//        	console.error('keyup');
        }).on('compositionstart',function(){
//        	console.error('中文输入开始');
        	t.prop('comStart','start');
        	
        }).on('compositionend',function(){
//        	console.error('中文输入结束');
        	t.prop('comStart','end');
        	t.triggerHandler('keyup');
        	
        });
        
        return $(this).jqxComboBox(settings);
        
    },
    andSelf: function() {
        return $(this).each(function(i, v) {})
    }
});

var sortData = function() {
	var arr = [];
	var source = arguments[0];
	var name = arguments[1];
	var type = arguments[2]; //根据type查找
	var length = source.length;
	var result = null;
	var index = 0;
	console.time('排序时间')
	if(type == undefined){
		for(var i = 0;i < length; i++) {
			if(source[i] == name) {
				result = source[i];
				index = i;
				break;
			}
		}
	}else{
		for(var i = 0;i < length; i++) {
			if(source[i][type] == name) {
				result = source[i];
				index = i;
				break;
			}
		}
	}
	console.timeEnd('排序时间')
	if(result == null) {
		arr = source;
	} else {
		source.splice(i ,1);
		source.unshift(result);
		arr = source;
	}
	return arr;
}

/**
 * 设置搜索时间区域
 */
function setValueById(fid, sid, tid) {
    var date = new Date();

    var year = date.getFullYear();
    var month = parseInt(date.getMonth()) + 1;
    var day = date.getDate();
    var hh = date.getHours();
    var mm = date.getMinutes();
    var ss = date.getSeconds();

    var nowTime = date.getTime();

    var td = $('#' + tid).val();
    if (td != '') {
        nowTime = new Date(td).getTime();
    } else {
        td = date;
    }

    var time = null;
    var index = parseInt($('#' + fid).val());

	$('#' + tid).off('change').on('change', function() {
        var value = $(this).val();

        year = value.substring(0, 4);
        month = value.substring(5, 7);
        day = value.substring(8, 10);
        hh = value.substring(11, 13);
        mm = value.substring(14, 16);
        ss = value.substring(17, 19);

        nowTime = new Date(value).getTime();
        index = parseInt($('#' + fid).val());

        switch (index) {
            case 0:
                $('#' + sid).val('');
                break;
            case 1:
                time = nowTime - 7 * 24 * 3600 * 1000;
                $('#' + sid).val(new Date(time));
                break;
            case 2:
                time = nowTime - 14 * 24 * 3600 * 1000;
                $('#' + sid).val(new Date(time));
                break;
            case 3:
                time = nowTime - 21 * 24 * 3600 * 1000;
                $('#' + sid).val(new Date(time));
                break;
            case 4:
                time = nowTime - (day - 1) * 24 * 3600 * 1000;
                $('#' + sid).val(new Date(time));
                break;
            case 5:
                if (month == 1 || month == 2 || month == 3) {
                    month = '01';
                }
                if (month == 4 || month == 5 || month == 6) {
                    month = '04';
                }
                if (month == 7 || month == 8 || month == 9) {
                    month = '07';
                }
                if (month == 10 || month == 11 || month == 12) {
                    month = 10;
                }
                day = day < 10 ? '0' + day : day;
                $('#' + sid).val('' + year + '-' + month + '-01' + ' ' + '' + hh + ':' + mm + ':' + ss + '');
                break;
            case 6:
                day = day < 10 ? '0' + day : day;
                $('#' + sid).val('' + year + '-01-01' + ' ' + '' + hh + ':' + mm + ':' + ss + '');
                break;
        }
    });

    switch (index) {
        case 0:
            $('#' + sid).val('');
            $('#' + tid).val(td);
            break;
        case 1:
            time = nowTime - 7 * 24 * 3600 * 1000;
            $('#' + sid).val(new Date(time));
            $('#' + tid).val(td);
            break;
        case 2:
            time = nowTime - 14 * 24 * 3600 * 1000;
            $('#' + sid).val(new Date(time));
            $('#' + tid).val(td);
            break;
        case 3:
            time = nowTime - 21 * 24 * 3600 * 1000;
            $('#' + sid).val(new Date(time));
            $('#' + tid).val(td);
            break;
        case 4:
            time = nowTime - (day - 1) * 24 * 3600 * 1000;
            $('#' + sid).val(new Date(time));
            $('#' + tid).val(td);
            break;
        case 5:
            var m = null;
            if (month == 1 || month == 2 || month == 3) {
                m = '01';
            }
            if (month == 4 || month == 5 || month == 6) {
                m = '04';
            }
            if (month == 7 || month == 8 || month == 9) {
                m = '07';
            }
            if (month == 10 || month == 11 || month == 12) {
                m = 10;
            }
            day = day < 10 ? '0' + day : day;
            $('#' + sid).val('' + year + '-' + m + '-01' + ' ' + '' + hh + ':' + mm + ':' + ss + '');
            $('#' + tid).val(td);
            break;
        case 6:
            day = day < 10 ? '0' + day : day;
            $('#' + sid).val('' + year + '-01-01' + ' ' + '' + hh + ':' + mm + ':' + ss + '');
            $('#' + tid).val(td);
            break;
    }
}

/**
 * 金额转为带2位小数
 */
function money(num, len, noEndZero,tj) {
	//0.955.toFixed(2) = 0.95
    if (num == undefined || num === '') {
        if (noEndZero) {
            return '0';
        }
        return '0.00';
    }
    
    var tj = tj == undefined ? false : true;
    var len = len == null ? 2 : len;
    num = num.toString();
    
    //细码乘法在此处理, 比如2.22222*3.33333 return 2.2222*3.3333
    if(num.indexOf('*')>-1&&!tj){
    	var arr=num.split('*');
    	for(var i=0;i<arr.length;i++){
    		// 'use strict'会报错     
    		arr[i]=arguments.callee(arr[i],4,true);
    	}
    	return arr.join('*');
    }
    
    var complement = '0.';
    if (num.indexOf('.') > -1) {

        var indexdo = num.substr(num.indexOf('.')).length - 1;
        if (indexdo > len) {
            for (var zero = 0; zero < indexdo; zero++) {
                complement += '0';
            }
            complement += '1';
        }
    }
    var i = parseFloat(num) + parseFloat(complement);


    var returnValue = i.toFixed(len);
    /*if(parseInt(returnValue) == 0){
    	returnValue = '0.00';
    }*/
    if (noEndZero) {
        if (returnValue == 0) {
            return '0';
        }
        //小数6个0,parstFloat()会变成科学计数法
        if (returnValue < 0.000001) {
            var rv = returnValue//.toString().replace(/(0*)$/, '').replace(/\.$/, '')
            return rv == '' ? 0 : rv;
        }
        var rv = parseFloat(returnValue)
        return isNaN(rv) == false ? rv : 0;
    }
    if (returnValue == 0 || isNaN(returnValue)) {
        return '0.00'
    }
    return returnValue;
}

/**
 * 金额转化为千位符
 */
var moneyBig = function() {
    var num = arguments[0] === undefined ? '0' : arguments[0];
    var type = arguments[1] === undefined ? '' : arguments[1];
    var m = money(num);
    var negative = '';
    if (m.indexOf('-') > -1) {
        negative = "-";
        m = m.replace('-', '');
    }
    var sb = m.split('').reverse().join('');
    var len = sb.length;
    var tail = m.substring(m.indexOf('.'), len)
    var mm = '';
    for (var i = 3; i < sb.length; i += 3) {
        mm += sb.substring(i, i + 3) + ',';
    }
    mm = mm.substring(0, mm.length - 1);
    mm = mm.split('').reverse().join('');
    return type + negative + mm + tail;
}

/**
 * 千位符金额转化为纯数字
 */
var moneySmall = function() {
    var newnum = 0;
    var num = arguments[0] === undefined ? '0' : arguments[0];
    newnum = money(num.toString().replace(/,/g, ''));
    return parseFloat(newnum);
};

var moneyFmt = function(row, columnfield, value, defaulthtml, columnproperties, rowdata) {
    var html = '<div class="jqx-grid-cell-left-align" style="margin-top: 6px;text-align: right;">' + '￥' +
        money(value) +
        '</div>';

    return html;
}

lastCheckValueDefaults = {
    category1: "",
    category2: "",
    address: "",
    clientPeople: ""
};

var lastCheckValue = function(nodes) {
    for (var i in nodes) {
        try {
            var value = lastCheckValueDefaults[nodes[i]] == null ? '' : lastCheckValueDefaults[nodes[i]];
            console.log(i, nodes[i], nodes, value);
            $('#' + i).val(value);
            if ($('#' + i).jqxComboBox('getSelectedItem') == null) {
                $("#" + i).val('');
            }
        } catch (e) {
            console.log('似乎没有找到此节点' + e);
        }
    }
}


/**
 * 获取当前窗口和时间
 */
var getWindowMsgNow = function(type) {
    if (type === 'time') {
        return new Date().getTime();
    } else if (type === 'name') {
        return $('#zqw_tabs').find('.active>a').text();
    }

};

var WindowMsg = {
    time: getWindowMsgNow('time'),
    name: getWindowMsgNow('name')
};


function clearString(s) {
    var s1 = s === undefined ? '' : s.toString();
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;|{}【】‘；：”“'。，、？]")
    var rs = "";
    for (var i = 0; i < s1.length; i++) {
        rs = rs + s1.substr(i, 1).replace(pattern, ' ');
    }
    return rs;
}

/**
 * 查询列表数据
 */
function searchDataInfo(element) {
    var el = element === undefined ? me.settings.grid.element : element;
    $("#" + el).jqxGrid('applyfilters');
    $("#" + el).jqxGrid('refreshfilterrow');
    $("#" + el).jqxGrid('clearselection');
};

function refreshDataInfo(element) {
    var el = element === undefined ? me.settings.grid.element : element;
    $("#" + el).jqxGrid('updatebounddata', 'cells');
    $("#" + el).jqxGrid('clearselection');
    $("#" + el).jqxGrid('refreshdata');
};

//function checkInitialAccountPeriod(callback){
//	Core.AjaxRequest({
//		type:"GET",
//		showMsg:false,
//		async:false,
//		//url:url+"/accountPeriod/getPeriodByMonth/"+$('#acpd-datetime').val(),
//		url:_global_settings.service.url+'/common/account/'+currentUserInfo.id,
//		callback:function(res){
//			//checkInitialAccountPeriodtype=res;
//			if(!res){
//				$('.checkInitial-add').parent().parent().css('display','none');
//				$('.checkInitial-edit').on('click',function(){
//					Core.alert({message:'结账后不可编辑，请去反结账！'});
//				}).attr({'readonly':'readonly'});
//			}	
//			if(callback)
//			callback(res);
//		},
//		failure:function(res){
//			
//		}
//	});
//}

var timeOut = function(callback, time) {
    var t = 200;
    if (time != null) {
        t = time;
    }
    setTimeout(callback, t);
}

/**
 * 重置页面所有id
 */
var idReset = function(el) {
    console.time('重置id时间');
    var random = new Date().getTime();
    $('#' + el).find('*').each(function() {
        var attr_id = $(this).attr("id");
        if (attr_id !== undefined) {
            $(this).attr("id", attr_id + random);
        }
    })
    $('#' + el).attr("id", el + random);
    console.timeEnd('重置id时间')
}

//数字金额转大写
var digitUppercase = function(n) {
    var fraction = ['角', '分'];
    var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ];
    var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ];
    var head = n < 0 ? '欠' : '';
    n = Math.abs(n);
    var s = '';
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '') //.replace(/角/,'');  
    }
    s = (s.indexOf('角') == s.length - 1 ? s + '整' : s) || '整';
    n = Math.floor(n);
    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = '';
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p;
            n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整');
};

/**
 * 批量打印
 */
var printList = function(settings) {
    var defaults = {
        btn: '',
        grid: '',
        reportName: '',
        idName: '',
        vid: 'id',

    };
    settings = $.extend(true, {}, defaults, settings);
    $(settings.btn).on('click', function() {
        var arr = $(settings.grid).jqxGrid('getselectedrowindexes');

        var list = '';
        for (var i in arr) {
            var data = $(settings.grid).jqxGrid('getrowdata', arr[i]);
            if (data != null)
                list += data[settings.vid] + ',';
        }
        list = list.substring(0, list.length - 1);
        if (list.length == 0) {
            Core.alert({ message: '请选择需要打印的项' });
            return false;
        }
        console.log(list);
        window.open('page/print/printHtml2.jsp?reportName=' + settings.reportName + '&' + settings.idName + '=' + list + '&printType=pdf');
    })
}


//左侧菜单hover
var leftMenuHover = function() {
	if($('#titleStyle').length>0){
		$('#titleStyle').remove();
	}
	var title=$('<div id="titleStyle" class="appendTitle"></div>');
	
    $('.level1 > li > a').off('mouseover').on('mouseover', function() {
        if (getTrueOrFalse()) {
        	var top=$(this).offset().top;
        	title.css({ top: top + 'px', display: 'block' }).text($(this).find('span').text());
        	title.appendTo($('body'));
        }
    });

    $('.level1 > li > a').on('mouseout', function() {
    	title.css({ display: 'none' });
    });
}

leftMenuHover();

var getTrueOrFalse = function() {
    var ben = false;
    var wd = $('#level1_menu').width();
    if(wd==50) return true;
    return ben;
}

/**
 * 获取缓存信息
 */
var getCacheInfoById = function(id, type, source) {
    var data = null;
    if (id == '' || id == null) {
        return {};
    }

    var getCacheInfo = function(id, type, source) {
        source = source === undefined ? 'id' : source;
        for (var i in ComboBoxSources.getRecords(type)) {
            if (ComboBoxSources.getRecords(type)[i][source] === id) {
                return ComboBoxSources.getRecords(type)[i];
            }
        };
    };

    var data = getCacheInfo(id, type, source);

    if (data == null) {
        ComboBoxSources.load(type, true);
        return getCacheInfo(id, type, source);
    }
    return data;
};

//用户新增标签
var addUserLabel = function(id, lebal, type) {
    var _type = type;
    var _label = ComboBoxSources.getRecords(type);
    var _id = id;
    var _lebal = lebal;

    var addLine = function() {
        var length = $('#user_label').find('input').length;
        $('#user_label').find('input').off('foucs').on('focus', function() {
            var index = $(this).parents('tr').index();
            if (index == length - 1) {
                var line = '<tr><td><input type="text" class="form-control addline"></td></tr>';
                $('#user_label').append(line);
            }
            addLines();
        });
    }

    var addLines = function() {
        $('#user_label').find('input').off('focus');
        addLine();
    }

    var initAddLabelModal = function() {
        $('#user_label').find('tbody').children().remove();
        $('#user_edit').jqxDropDownList({ selectedIndex: -1 });
        $('#label_type').val('').val(_type);
        $('#user_addLabel').modal('show');

        //修改标签
        if (_id) {
            $('#user_id').val(_id);
            $('#label_span').text('修改标签');
            $('#user_label').addClass('hide');
            $('#user_edit').dropDownlist({
                source: _label,
                valueMember: 'lebal',
                displayMember: 'lebal',
                dropDownHeight: 130
            }).removeClass('hide').val(_lebal);
        } else {
            $('#label_span').text('新增标签');
            $('#user_label').removeClass('hide');
            $('#user_edit').addClass('hide');
            $('#label_num').data('json', _label);

            $.each(_label, function(i) {
                var line = '<tr><td><input type="text" readonly class="form-control" value="' + _label[i].lebal + '"></td></tr>';
                $('#user_label').append(line);
            });

            var l = '<tr><td><input type="text" class="form-control addline"></td></tr>';
            $('#user_label').append(l);
            //绑定事件
            $('#user_label').find('input.addline').off('focus').on('focus', function() {
                var length = $('#user_label').find('input').length;
                var index = $(this).parents('tr').index();
                console.log(length + ',,' + index);
                if (index == length - 1) {
                    var line = '<tr><td><input type="text" class="form-control addline"></td></tr>';
                    $('#user_label').append(line);
                }
                addLine();
            });
        }
    }

    if ($('#user_addLabel').length == 0) {
        $.loadModal('page/common/segment/addLabel.html', function(res) {
            $('body').append(res);
            initAddLabelModal();
        });
    } else {
        initAddLabelModal();
    }
}

//用户添加备注
var addRemark = function(remark, id, type) {
    var _remark = remark;
    var _id = id;
    var _type = type;

    var initAddRemarkModal = function() {

        $('#user_addRemark').val('');
        $('#add_remark').modal('show');
        $('#userId').val(_id);
        $('#remark_type').val('').val(_type);

        var source = {
            localdata: _remark,
            datatype: 'array'
        }

        var demo = new $.jqx.dataAdapter(source);
        var columns = [
            { text: '更新时间', dataField: 'createDate', width: '50%' },
            { text: '备注', dataField: 'remark', width: '50%' }
        ];
        if (_type) { //代理商添加备注
            columns[1] = { text: '备注', dataField: 'comment', width: '50%' }
        }
        //初始化Grid
        $('#remarkGrid').jqxGrid({
            source: demo,
            width: '100%',
            height: 160,
            pageable: false,
            columns: columns
        });
    }

    if ($('#add_remark').length == 0) {
        $.loadModal('page/common/segment/addRemark.html', function(res) {
            $('body').append(res);
            initAddRemarkModal();
        });
    } else {
        initAddRemarkModal();
    }
}

//添加地址
var addRess = function(id) {
    var _id = id;

    var initAddressModal = function() {

        $('#addRess_modal').find('input').val('');
        $('#addRess_modal').find('select').val('');
        $('#addRess_modal').find('textarea').val('');

        $('#addRess_modal').modal('show');

        var addres = new address('address_address', 'form-control');
        addres.init();

        //点击保存地址
        $('#saveAddressBtn').off('click').on('click', function() {
            //			console.log(addres);

            if (!$('#addRess_modal').jqxValidator('validate')) {
                return false;
            }

            var ad = $('#address_address').children();
            var ad1 = ad.eq(0).val();
            var ad2 = ad.eq(1).val();
            var ad3 = ad.eq(2).val();
            var street = $('#address_st').val();
            var sn = $('#address_sn').val(); //简称
            var zc = $('#address_zc').val(); //邮编
            var rm = $('#address_rm').val(); //备注

            var line = '<tr>' +
                '<td class="hidden">' + sn + '</td>' +
                '<td><i class="glyphicon glyphicon-home"' +
                'style="padding-right: 20px;"></i></td>' +
                '<td><font>' + ad1 + '</font><font>' + ad2 + '</font><font>' + ad3 + '</font><font>' + street + '</font></td>' +
                '<td class="hidden">' + zc + '</td>' +
                '<td class="hidden">' + rm + '</td>' +
                '<td style="float:rigth;">' +
                '<font class="md-rate-review edit">编辑</font>' +
                '<font class="md-cancel delete">删除</font></td>' +
                '</tr>';

            var co = $('#address_address').children().eq(0).val(),
                ct = $('#address_address').children().eq(1).val(),
                st = $('#address_st').val(); //cs = $('#address_address').children().eq(2).val();

            console.log(co + ',' + ct + ',' + st);
            if (co != '' && ct != '' && st != '') {
                if ($('#address_type').val() !== '') { //编辑
                    var i = $('#address_type').val();
                    $(_id).find('tr').eq(i).replaceWith(line);
                } else {
                    $(_id).append(line);
                }
            }
        });
    }

    if ($('#addRess_modal').length == 0) {
        $.loadModal('page/common/segment/addAddress.html', function(res) {
            $('body').append(res);
            initAddressModal();
        });
    } else {
        initAddressModal();
    }
}

//编辑或删除地址
var editOrdelAddress = function(id, t, type) {
    var _id = id;
    var _t = t;
    var _type = type;

    var initAddressModal = function() {
        //		debugger
        $('#addRess_modal').find('input').val('');
        $('#addRess_modal').find('select').val('');
        $('#addRess_modal').find('textarea').val('');

        $('#addRess_modal').modal('show');

        var addres = new address('address_address', 'form-control');
        addres.init();

        //初始化地址模态框			
        var nodelist = $(_id).find('tr');
        var i = _t.parent().parent().index();
        var arr = {};
        arr = {
            shortName: nodelist.eq(i).find('td').eq(0).text(),
            province: nodelist.eq(i).find('td').eq(2).children().eq(0).text(),
            city: nodelist.eq(i).find('td').eq(2).children().eq(1).text(),
            district: nodelist.eq(i).find('td').eq(2).children().eq(2).text(),
            street: nodelist.eq(i).find('td').eq(2).children().eq(3).text(),
            zipCode: nodelist.eq(i).find('td').eq(3).text(),
            remark: nodelist.eq(i).find('td').eq(4).text()
        }

        $('#address_sn').val(arr.shortName);
        $('#address_rm').val(arr.remark);
        $('#address_zc').val(arr.zipCode);
        $('#address_st').val(arr.street);

        $('#address_type').val(i);

        addres.setVal(arr.province, arr.city, arr.district);

        //点击保存地址
        $('#saveAddressBtn').off('click').on('click', function() {

            if (!$('#addRess_modal').jqxValidator('validate')) {
                return false;
            }

            var ad = $('#address_address').children();
            var ad1 = ad.eq(0).val();
            var ad2 = ad.eq(1).val();
            var ad3 = ad.eq(2).val();
            var street = $('#address_st').val();
            var sn = $('#address_sn').val(); //简称
            var zc = $('#address_zc').val(); //邮编
            var rm = $('#address_rm').val(); //备注

            var line = '<tr>' +
                '<td class="hidden">' + sn + '</td>' +
                '<td><i class="glyphicon glyphicon-home"' +
                'style="padding-right: 20px;"></i></td>' +
                '<td><font>' + ad1 + '</font><font>' + ad2 + '</font><font>' + ad3 + '</font><font>' + street + '</font></td>' +
                '<td class="hidden">' + zc + '</td>' +
                '<td class="hidden">' + rm + '</td>' +
                '<td style="float:rigth;">' +
                '<font class="md-rate-review edit">编辑</font>' +
                '<font class="md-cancel delete">删除</font></td>' +
                '</tr>';

            var co = $('#address_address').children().eq(0).val(),
                ct = $('#address_address').children().eq(1).val(),
                st = $('#address_st').val(); //cs = $('#address_address').children().eq(2).val();

            console.log(co + ',' + ct + ',' + st);
            if (co != '' && ct != '' && st != '') {
                if ($('#address_type').val() !== '') { //编辑
                    var i = $('#address_type').val();
                    $(_id).find('tr').eq(i).replaceWith(line);
                } else {
                    $(_id).append(line);
                }
            }
        });
    }

    if (_type == 'edit') {
        if ($('#addRess_modal').length == 0) {
            $.loadModal('page/common/segment/addAddress.html', function(res) {
                $('body').append(res);
                initAddressModal();
            });
        } else {
            initAddressModal();
        }
    } else {
        Core.confirm({
            message: "确认删除吗？",
            confirmCallback: function() {
                _t.parent().parent().remove();
            }
        });
    }
}

//用户禁用
var disabledUser = function(id, name, bool) {
    var _id = id;
    var _name = name;
    var _bool = bool;
    //	var _type=type;

    var initDisabledUserModal = function() {

        $('#disabled_user').modal('show');
        $('#disabled_user_id').val('').val(_id);
        $('#disabled_username').val('').val(_name);
        $('#disabled_true').dropDownlist({
            source: { 'false': '否', 'true': '是' },
            width: '100%',
            dropDownHeight: 100
        }).val(_bool);
    }

    if ($('#disabled_user').length == 0) {
        $.loadModal('page/common/segment/disabled.html', function(res) {
            $('body').append(res);
            initDisabledUserModal();
        });
    } else {
        initDisabledUserModal();
    }
}

//分配销售负责人
var allotSale = function(data, user) {
    var _data = data;
    var _user = user; //用户管理分配信息
    var currentRoleName = _global_settings.owner.roleName;

    console.log(data);

    var initModal = function() {
        var info = getCurrentInfo(); //当前登录人角色

        //初始化用户分配界面
        if (_user != undefined) {
            $('#allotSales_sale').comboBox({
                source: ComboBoxSources.getRecords('salesInfo_name'),
                displayMember: 'name_user',
                valueMember: 'id',
                disabled: false,
                width: '100%'
            }).val(_data.employeeCode == undefined ? '' : getSalesInfoById(null, _data.employeeCode).id);

            $('#allotSales_customer').comboBox({
                source: ComboBoxSources.getRecords('custService_name'),
                displayMember: 'name_user',
                valueMember: 'id',
                disabled: false,
                width: '100%'
            }).val(_data.customerCode == undefined ? '' : getCustomerInfoById(null, _data.customerCode).id);

            $('#allotSales_user').val('user');
            $('#allotSales_ownerId').val(_data.ownerId);
            $('#allotSales_agent').parents('.allot').removeClass('hide');
            $('#allotSales_type').parents('.allot').removeClass('hide');
            $('#allotSales_senior').parents('.allot').addClass('hide');
            $('#allotSale_rate').parents('.allot').addClass('hide');
            $('#allotSale_compname').parents('.allot').removeClass('hide');

            $('#allotSales_type').dropDownlist({
                source: { 'salesDirect': '销售直销', 'agentDirect': '代理直销', 'transformation': '商机转化' },
                width: '100%',
                height: 34,
                selectedIndex: 0
            }).val(_data.type);

            $('#allotSales_agent').comboBox({
                source: ComboBoxSources.getRecords('salesAgent_name'),
                displayMember: 'name_user',
                valueMember: 'id',
                width: '100%'
            }).val(_data.agentCode == undefined ? '' : getAgentInfoById(null, _data.agentCode).id);

            //			$('#allotSales_customer').val(_data.customerCode==undefined?'':getCustomerInfoById(null,data.customerCode).id);

            if (info == 'sales') { //区分销售人员和admin登录，获取销售负责人数据是不一样的。
                $('#allotSales_sale').comboBox({
                    source: ComboBoxSources.getRecords('sale_name'),
                    displayMember: 'name_user',
                    valueMember: 'id',
                    disabled: false,
                    width: '100%'
                }).val(_data.employeeCode == undefined ? '' : getSalesInfoById(null, _data.employeeCode).id);

                $('#allotSales_customer').jqxComboBox({ disabled: true });
            }

            $('#allotSale_compname').val(_data.name);
            $('#allotSale_name').val(_data.username);

            //			if(info=='sales'){
            //				$('#allotSales_customer').jqxComboBox({disabled:true});
            //			}
            if (info == 'customers') {
                $('#allotSales_sale').jqxComboBox({ disabled: true });
                $('#allotSales_agent').jqxComboBox({ disabled: true });
            }
            if (currentRoleName === 'salesStaff' || currentRoleName === 'customerService') {
                $('#allotSales_sale').jqxComboBox({ disabled: true });
                $('#allotSales_customer').jqxComboBox({ disabled: true });
            }

        } else {
            $('#allotSales_sale').comboBox({
                source: ComboBoxSources.getRecords('salesInfo_name'),
                displayMember: 'name_user',
                valueMember: 'id',
                disabled: false,
                width: '100%'
            }).val(_data.sales == undefined ? '' : _data.sales.id);

            $('#allotSales_customer').comboBox({
                source: ComboBoxSources.getRecords('custService_name'),
                displayMember: 'name_user',
                valueMember: 'id',
                disabled: false,
                width: '100%'
            }).val(_data.customer == undefined ? '' : _data.customer.id);

            $('#allotSales_user').val('');
            $('#allotSales_agent').parents('.allot').addClass('hide');
            $('#allotSales_type').parents('.allot').addClass('hide');
            $('#allotSales_senior').parents('.allot').removeClass('hide');
            $('#allotSale_rate').parents('.allot').removeClass('hide');
            $('#allotSale_compname').parents('.allot').addClass('hide');

            $('#allotSales_senior').dropDownlist({
                source: { 'false': '否', 'true': '是' },
                width: '100%',
                selectedIndex: 0,
                dropDownHeight: 100
            }).val(_data.senior);

            if (info == 'sales') {
                $('#allotSales_sale').jqxComboBox({ disabled: true }); //.val(_global_settings.owner.userid);
            }
            if (info == 'customer') {
                $('#allotSales_customer').jqxComboBox({ disabled: true }); //.val(_global_settings.owner.userid);
            }

            if (currentRoleName === 'salesStaff' || currentRoleName === 'customerService') {
                $('#allotSales_sale').jqxComboBox({ disabled: true });
                $('#allotSales_customer').jqxComboBox({ disabled: true });
            }

            $('#allotSale_rate').val(_data.rate);
            $('#allotSale_name').val(_data.agentName);
            $('#allotSales_data').data('data', _data);
        }
        //		return false;
    }

    var initAllotSalesModal = function() {

        $('#allotSales_modal').modal('show');

        initModal();

    }

    if ($('#allotSales_modal').length == 0) {
        $.loadModal('page/common/segment/allotSales.html', function(res) {
            $('body').append(res);
            initAllotSalesModal();
        });
    } else {
        initAllotSalesModal();
    }
}

//获取当前登录人信息
var getCurrentInfo = function() {
    var info = _global_settings.owner;
    var roleName = {
        'salesStaff': 'sale', //普通销售
        'salesManage': 'sales',
        'secondLevelSalesManage': 'sales',
        'customerService': 'customer', //普通客服
        'customerManage': 'customers',
        'secondLevelCustomerManage': 'customers',
        'agentistrator': 'agent',
        'Sys_Admin': 'sys',
        'Ocr_Admin': 'ocr_sys',
        'Ocr_group': 'ocr_grp',
        'Ocr_createBy': 'ocr_writer',
        'Ocr_auditor': 'ocr_checker'
    }
    for (var i in roleName) {
        if (info.roleName == i) {
            return roleName[i];
        }
        //		if(info.roleName.indexOf(i)>=0){
        //			return roleName[i];
        //		}
    }
}

/**
 * TODO 通过代理商id获取当前代理商的信息
 */
var getAgentInfoById = function(agentId, agentCode) {
    var data = null;
    var _id = agentId;
    var _agentCode = agentCode;

    var getAgentInfo = function(id, code) {
        if (code == null) { //通过id获取
            var records = ComboBoxSources.getRecords('salesAgent_name');
            for (var i = 0; i < records.length; i++) {
                if (records[i].id == id) {
                    return records[i];
                }
            }
        } else {
            var records = ComboBoxSources.getRecords('salesAgent_name');
            for (var i = 0; i < records.length; i++) {
                if (records[i].agentCode == code) {
                    return records[i];
                }
            }
        }
    }

    data = getAgentInfo(_id, _agentCode);

    if (data == null) {
        ComboBoxSources.load('salesAgent');
        console.log(1);
        data = getAgentInfo(_id, _agentCode) == undefined ? { name_user: '' } : getAGgentInfo(_id, _agentCode);
    }

    return data;
}

/**
 * 通过id获取当前客服的信息
 */
var getCustomerInfoById = function(custId, custCode) {
    var data = null;
    var _id = custId;
    var _code = custCode;

    var getCustInfo = function(id, code) {
        if (code == null) { //通过id获取
            var records = ComboBoxSources.getRecords('custService_name');
            for (var i = 0; i < records.length; i++) {
                if (records[i].id == id) {
                    return records[i];
                }
            }
        } else {
            var records = ComboBoxSources.getRecords('custService_name');
            for (var i = 0; i < records.length; i++) {
                if (records[i].employeeCode == code) {
                    return records[i];
                }
            }
        }
    }

    data = getCustInfo(_id, _code);

    if (data == null) {
        ComboBoxSources.load('custService', true);
        data = getCustInfo(_id, _code) == undefined ? { name_user: '' } : getCUstInfo(_id, _code);
    }

    return data;
}

/**
 * 通过id获取当前销售的信息
 */
var getSalesInfoById = function(saleId, saleCode) {
    var data = null;
    var _id = saleId;
    var _code = saleCode;


    var getSaleInfo = function(id, code) {
        if (code == null) { //通过id获取
            var records = ComboBoxSources.getRecords('salesInfo_name');
            for (var i = 0; i < records.length; i++) {
                if (records[i].id == id) {
                    return records[i];
                }
            }
        } else {
            var records = ComboBoxSources.getRecords('salesInfo_name');
            for (var i = 0; i < records.length; i++) {
                if (records[i].employeeCode == code) {
                    return records[i];
                }
            }
        }
    }

    data = getSaleInfo(_id, _code);
    //	debugger
    if (data == null) {
        ComboBoxSources.load('salesInfo', true);
        data = getSaleInfo(_id, _code) == undefined ? { name_user: '' } : getSaleInfo(_id, _code);
    }

    return data;
}

/**
 * 通过id获取当前销售或者客服的信息
 */
var getSalesOrCustInfoById = function(sId) {
    var data = null;
    var _id = sId;

    var getSaleInfo = function(id) {
        var records = ComboBoxSources.getRecords('salesAndCust_name');
        for (var i = 0; i < records.length; i++) {
            if (records[i].id == id) {
                return records[i];
            }
        }
    }

    data = getSaleInfo(_id);
    //	debugger
    if (data == null) {
        ComboBoxSources.load('salesInfo', true);
        data = getSaleInfo(_id) == undefined ? { name_user: '' } : getSaleInfo(_id);
    }

    return data;
}


/**
 * TODO 通过代理商名称获取当前代理商的信息
 */
var getAgentInfoByName = function(agentName) {
    var records = ComboBoxSources.getRecords('salesAgent');
    for (var i = 0; i < records.length; i++) {
        if (records[i].agentName == agentName) {
            return records[i];
        }
    }
    if (!agentName) {
        return '';
    }
}

/**
 * 通过用户名获取当前客服的信息
 */
var getCustomerInfoByName = function(username) {
    var records = ComboBoxSources.getRecords('custService');
    for (var i = 0; i < records.length; i++) {
        if (records[i].username == username) {
            return records[i];
        }
    }
    if (!username) {
        return '';
    }
}

/**
 * 通过用户名获取当前销售的信息
 */
var getSalesInfoByName = function(username) {
    var records = ComboBoxSources.getRecords('salesInfo');
    for (var i = 0; i < records.length; i++) {
        if (records[i].username == username) {
            return records[i];
        }
    }
    if (!username) {
        return '';
    }
}

/**
 * getSatffInfoByKey
 * 
 * 封装一个函数，适用场景为获取销售/客服/代理商负责人的缓存信息,三个场景同时适用
 * 
 * 一般这样获取会用到id，employeeCode，name，username，name_user，agentName，agentCode这几种方式,
 * 
 * 其他的如果用到这个函数可能会返回为空
 * 
 * @param {String}
 *            settings.keys 	缓存字段
 * @param {String}
 *            settings.map 		map字段
 * @param {String}
 *            settings.words 	检索字段
 * @return {Object}  
 * 			  返回的是				输入检索的当前人员的信息
 * 
 * @实例
 * 	getSatffInfoByKey({
 *		keys : 'name',
 *		map : 'salesInfo',
 *		words : 'xs'
 *	})
 */
var getSatffInfoByKey = function(settings) {
    var keys = settings.keys || '';
    var map = settings.map || '';
    var words = settings.words || '';

    var records = ComboBoxSources.getRecords(map);
    for (var i = 0; i < records.length; i++) {
        if (records[i][keys] != undefined) {
            if (records[i][keys] == words) {
                return records[i];
            }
        } else if (records[i].userInfo != undefined) {
            if (records[i].userInfo[keys] == words) {
                return records[i];
            }
        } else {
            return '';
        }
    }
    if (!words) {
        return '';
    }
}

/**
 * getConditionParams
 * 
 * 获取加密之后的检索条件
 * 
 * @param data
 * 			一般为检索条件
 * @returns {String}
 * 			返回base64加密之后的对象
 */
var getConditionParams = function(data,pagesize) {
	var json = data;
	var pagesize=pagesize==undefined?20:pagesize;
    var obj = { "condition": [], "filterscount": 0, "groupscount": 0, "sortorder": "desc", "pagenum": 0, "pagesize": pagesize };
    
    for (var i in json) {
        if (json[i].value.length != 0) {
            json[i]['key'] = i;
            obj['condition'].push(json[i]);
        }
    }

    //    var arr = [];
    //    if (data != undefined) {
    //        for (var i in data) {
    //            var json = {}
    //            json.key = i;
    //            json.value = data[i].value;
    //            if (data[i].value == undefined || data[i].value == null || data[i].value == '') {
    //                json.value = []; //如果输入框内值不合法，则让它为空
    //            }
    //            json.action = data[i].action;
    //            if (data[i].value[0] != undefined && data[i].value[0] != '' && data[i].value[0] != null) {
    //                arr.push(json); //如果有其中一个值不合法。则不放进condition里面
    //            }
    //        }
    //    }
    obj = new Base64().encode(JSON.stringify(obj));
    return obj;
}

/**
 * getUrlCondition
 * 
 * 是依据当前分页的检索条件来的
 * 
 * @param {String}
 *            settings.beginDate 开始日期
 * @param {String}
 *            settings.endDate 结束日期
 * @param {String}
 *            settings.key 检索字段，必填。但三个变量顺序可以跳转
 * @return {String}  
 * 			  返回的是base64编码之后的对象   
 */
var setUrlCondition = function(settings) {
    var beginDate = (settings.beginDate === undefined || settings.beginDate === '' || settings.beginDate === null) ? '2015-01-01' : settings.beginDate;
    var endDate = (settings.endDate === undefined || settings.endDate === '' || settings.endDate === null) ? getNowFormatDate() : settings.endDate;
    var key = (settings.key === undefined || settings.key === '' || settings.key === null) ? 'o.createDate' : settings.key;
    var obj = { "condition": [], "filterscount": 0, "groupscount": 0, "pagenum": 0, "pagesize": 20 };
    var arr = [];
    var json = {};
    json['key'] = key;
    json['action'] = 'between';
    json['value'] = [beginDate, endDate];
    arr.push(json);
    obj.condition = arr;
    if (beginDate === '' && endDate === '') {
        obj.condition = [];
    }
    obj = new Base64().encode(JSON.stringify(obj));
    return obj;
}

/**
 * 自定义Tab管理类
 */
var ZqwTab_Mgt = function(main_Tab) {

    var me = this;

    this.maxLength = 10;

    this.tab_array = [];

    this.initTab = function(items) {

    };

    this.addTab = function(position, title, content,map) {
        var zqw_tabs = $("#zqw_tabs");
        var zqw_contents = $("#mainTab");

        var zqw_tabs_ul_li = zqw_tabs.find("ul li");

        var title_template = $('<li>' +
            '<a class="zqwTab_a" data="' + position + '" data-scrollY="0">' + title + '</a>' +
            '<i class="md-cancel close-tab"></i>' +
            '</li>');
        
        if(map!=null){
        	title_template.data('map',map);
        }

        var content_template = $('<div class="zqwTab"></div>');

        content_template.html(content);

        //记录滚动条的位置信息。
        var y = $(document).scrollTop();
        var cin = zqw_tabs.find("ul li.active").attr("data-scrollY", y);
        console.log('scroll Y:' + cin.attr("data-scrollY"));

        //TODO 插入到指定位置index
        if (zqw_tabs.find("ul").children().length > 0) {
            if (position > 0) {
                zqw_tabs_ul_li.eq(position).after(title_template);
                zqw_contents.children(".zqwTab").eq(position).after(content_template);
            } else {
                zqw_tabs.find("ul").append(title_template);
                zqw_contents.append(content_template);
            }
            zqw_tabs_ul_li.removeClass('active');
            zqw_contents.children(".zqwTab").removeClass('active');

            title_template.addClass("active");
            content_template.addClass("active");
        } else {
            zqw_tabs.find("ul").append(title_template);
            zqw_contents.append(content_template);

            title_template.addClass("active");
            content_template.addClass("active");
            title_template.find("i").remove();
        }
        console.log('addTab ' + position);

        var e = $.Event("add");
        zqw_contents.trigger(e, [position, title, content]);

        title_template.find("i.close-tab").on({
            "click": function(e) {
                var index = $(this).parent().index();
                e.preventDefault();
                //				if(index!=0){
                me.removeTab(index);
                //				}
            }
        });

        title_template.find("a").on({
            "click": function(e) {
                var index = $(this).parent().index();
                me.clickTab(index);
            }
        });
        window.scrollTo(0, 0);

        var len = zqw_tabs_ul_li.length;
        if (len > me.maxLength) {
            zqw_tabs_ul_li.eq(1).remove();
            zqw_contents.children(".zqwTab").eq(1).remove();
            var e = $.Event("removed");
            zqw_contents.trigger(e, 1);
        }

    };

    /**
     * 给指定的index添加关闭事件handler
     */
    this.addCloseEvent = function(index, handler) {
        var zqw_tabs = $("#zqw_tabs");
        if (handler === undefined) {
            handler = function() {};
        }

        if (!(handler instanceof Function)) {
            handler = function() {};
        }

        if (index === undefined) {
            index = me.selectedIndex();
        }
        if (index != 0)
            zqw_tabs.find("ul li").eq(index).find("i.close-tab").off('click').on({
                "click": function(e) {
                	setPara();
                    e.preventDefault();
                    var indxxx = $(this).parent().index();

                    Core.confirm({
                        message: "确定要关闭吗？",
                        confirmCallback: function() {
                            me.removeTab(indxxx);
                            handler();
                        }
                    });
                }

            });
    };

    this.setContent = function(index, content) {
        console.log('setContent ' + index);
        var zqw_contents = $("#mainTab");
        console.log('setContent ' + index)
        zqw_contents.children().eq(index).html(content);

    };

    this.setTitle = function(index, title) {
        var zqw_tabs = $("#zqw_tabs");
        console.log('setContent ' + index);
        zqw_tabs.children("ul").children().eq(index).children().eq(0).text(title);
    };

    this.getTitle = function(index) {
        var zqw_tabs = $("#zqw_tabs");
        console.log('getContent ' + index);
        return zqw_tabs.children("ul").children().eq(index).children().eq(0).text();
    };

    this.removeTab = function(index) {
        //		var tab_array = [];
        //		var zqw_tabs = $("#zqw_tabs");
        //		var tabs = zqw_tabs.find("ul li");
        //		var l = tabs.length;
        //	
        //		for(var i=0;i<l;i++){
        //			var tab_item = {};
        //			tab_item.index = i;
        //			tab_item.title = tabs.eq(i).text().trim();
        //			tab_array.push(tab_item);
        //		}
        //		
        console.log('removeTab ' + index);
        var zqw_tabs = $("#zqw_tabs");
        var zqw_contents = $("#mainTab");
        //		if(index!=0){
        zqw_tabs.find("ul li").eq(index).remove();
        zqw_contents.children(".zqwTab").eq(index).remove();
        var e = $.Event("removed");
        zqw_contents.trigger(e, index);
        //		}
        //TODO 返回到历史浏览的最后一个index
        var sel_index = index - 1;
        if (sel_index > 0) {
            me.clickTab(sel_index);
        } else {
            me.clickTab(0);
        }
    };

    this.clickTab = function(index) {
        //标题
        $('#appendTitleStyle').css({ display: 'none' });

        console.log('clickTab ' + index);
        var zqw_contents = $("#mainTab");
        var zqw_tabs = $("#zqw_tabs");
        
        var old_index = zqw_contents.find('.zqwTab.active').index();
        if(index!=old_index){
        	$('#floatImg>img').remove();
        	$('#floatImg').css('display','none');
        	$('#floatImg_rotate').addClass('hide');
        }

        var zqw_tabs_ul_li = zqw_tabs.find("ul li");
        var zqw_contents_div = zqw_contents.children("div");

        //记录滚动条的位置信息。
        var y = $(document).scrollTop();
        var cin = zqw_tabs.find("ul li.active").attr("data-scrollY", y);
        console.log('scroll Y:' + cin.attr("data-scrollY"));

        zqw_tabs_ul_li.removeClass("active");
        zqw_tabs_ul_li.eq(index).addClass("active");
        zqw_contents_div.removeClass("active");
        zqw_contents_div.eq(index).addClass("active");

        var y = zqw_tabs_ul_li.eq(index).attr("data-scrollY");
        console.log('-------move to ' + y);
        if (y != undefined) {
            window.scrollTo(0, y);
        }

        var e = $.Event("selected");
        zqw_contents.trigger(e, index);
    };

    this.selectedIndex = function() {
        //标题
        $('#appendTitleStyle').css({ display: 'none' });

        var sel = 0;
        var zqw_tabs = $("#zqw_tabs");
        //		sel = $("#mainTab > div.active").index();
        sel = zqw_tabs.find("ul li.active").index();
        console.log('selected index is: ' + sel);
        return sel;
    };

};

//公司地址，送货地址
var chooseAddress = function(shortName, addressModal) {
    $('.addressLabel').removeClass('addSuccImg').find('img').remove();
    $(addressModal).find('input').val('');
    $(addressModal).find('textarea').val('');
    //简称
    $(shortName).on('keyup focus', function() {
        $('.addressLabel').removeClass('addSuccImg').find('img').remove();
        var value = $(this).val();
        $.each($('.addressLabel'), function(i, v) {
            if (value == $(v).text().trim()) {
                var img = '<img alt="" src="images/common/success.png" class="succImg">';
                $(v).addClass('addSuccImg').append(img);
            }
        })
    });

    //点击公司地址，送货地址
    $(addressModal).find('.addressLabel').off('click').on('click', function() {
        var t = $(this);
        var txt = t.text().trim();
        var bool = t.hasClass('addSuccImg');
        $('.addressLabel').removeClass('addSuccImg').find('img').remove();
        if (!bool) {
            var img = '<img alt="" src="images/common/success.png" class="succImg">';
            t.addClass('addSuccImg').append(img);
            $(shortName).val(txt);
        } else {
            t.find('img').remove();
            t.removeClass('addSuccImg')
            $(shortName).val('');
        }
    });

    //	$(addressModal).on('click','.cancleBtn,.btn-r',function(){
    //		$('.addressLabel').removeClass('addSuccImg').find('img').remove();
    //	});
}

var initChoose = function(shortName) {
    $('.addressLabel').removeClass('addSuccImg').find('img').remove();
    $.each($('.addressLabel'), function(i, v) {
        if (shortName == $(v).text().trim()) {
            var img = '<img alt="" src="images/common/success.png" class="succImg">';
            $(v).addClass('addSuccImg').append(img);
        }
    });
}

//新建产品规格型号是否显示
function showSpec(id) {
    //	debugger
    var bool = _global_settings.owner.productSpeFlag;
    if (!bool || bool == 'false')
        $('#' + id).css('display', 'none');
}

//selectId,id,name
function initModel(settings) {

    var _id = settings.id || '';
    var _selectId = settings.val || '';
    var name = settings.name || '';
    var ownerId = settings.ownerId || '';
    var userName = settings.userName || '';

    var init = function(clientid, ctrselectId) {
        //		var data = ComboBoxSources.getInfoMapByKey('clientInfo','clientInfoid',clientid);
        //		$('#custAndVen-id').val(clientid);
        //		$('#custAndVen-selectId').val(ctrselectId);
        $('#custVenName').text(name);

        Core.AjaxRequest({
            type: 'GET',
            showMsg: false,
            async: false,
            url: ws_url + '/CXF/rs/SimpleAC/' + new Base64().encode('toocr/order/clientinfo/search/clientinfo/id/' + _selectId + '/' + ownerId + '/' + userName),
            callback: function(res) {
                $('#custAndVen-id').data('json', res);
                $('#custAndVenName').val(res.userInfo.name);
                $('#custAndVenPhone').val(res.userInfo.telephone == undefined ? '' : res.userInfo.telephone);
                $('#custAndVenPhone2').val(res.userInfo.backupTelephone == undefined ? '' : data.backupTelephone);
            }
        });

        $("#editCustAndVen").modal("show");

        $('.editCustAndVendor').off('click').on('click', function() {
            debugger
            if (name.indexOf('客户') > -1) {
                $.addTab({
                    title: '编辑客户',
                    url: 'page/modules/crm/editCustomerClientMgt.html',
                    pk: {
                        id: _id,
                        junpnode: ctrselectId,
                        customerName: $('#custAndVenName').val(),
                        phone: $('#custAndVenPhone').val(),
                        phone2: $('#custAndVenPhone2').val()
                    },
                    reload: true
                });
            } else {
                $.addTab({
                    title: '编辑供应商',
                    url: 'page/modules/crm/editVendorClientMgt.html',
                    pk: {
                        id: _id,
                        junpnode: ctrselectId,
                        customerName: $('#custAndVenName').val(),
                        phone: $('#custAndVenPhone').val(),
                        phone2: $('#custAndVenPhone2').val()
                    },
                    reload: true
                });
            }
        })
    }

    if ($('#editCustAndVen').length == 0) {
        $.loadModal("page/common/segment/custAndVen.html", function(res) {
            var html = $(res);
            $('body').append(html);

            init(_id, _selectId);

            //校验
            $("#editCustAndVen").jqxValidator({
                animationDuration: 1,
                hintType: 'label',
                rules: [{
                    input: '#custAndVenName',
                    message: "不能为空",
                    action: 'keyup, blur',
                    rule: 'required'
                }]
            });
            //保存
            //			$('#custAndVenBtn').on('click',function(){
            //				if(!$("#editCustAndVen").jqxValidator("validate")){
            //					return false;
            //				}
            //			})
            //			specModal_reset();


        });
    } else {
        init(_id, _selectId);
    }

}

//编辑客户和供应商
function editCustAndVendor(id, ownerId, userName) {
    var msg = '请选择供应商！';
    var name = '供应商名称';
    if (id.indexOf('SO') > -1) {
        msg = '请选择客户！';
        name = '客户名称'
    }
    var val = $('#' + id).val();
    if (val == '') {
        Core.alert({ message: msg });
        return false;
    } else {
        initModel({
            id: id,
            val: val,
            name: name,
            ownerId: ownerId,
            userName: userName
        });
    }
}

/**
 * 获取商户信息
 * 
 * 同步到ocr(是否显示装箱尺寸，货品装箱，客户货号等)
 * 
 * 并将部分信息放置全局环境，以便调用
 */

function getPriseInfo(settings) {
    var ids = settings.id || '';
    var soOwnerId = settings.soOwnerId || '';
    var userName = settings.userName || '';
    var callback = settings.callback || function() {};
    var data = null;

    Core.AjaxRequest({
        url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/enterpriseInfo/' + soOwnerId + '/' + userName),
        type: 'GET',
        // async: false,
        callback: function(res, textStatus) {
            if (textStatus == 'success') {
                try {
                    var owner = res[0];
                    //easygrid渲染,列处理
                    var easyGridSetting = {};
                    var objMachine = {
                        producttypeFlag: 'remark', //备注
                        //					productunitFlag:false, 		//单位
                        productKgFlag: 'weight', //高度
                        productNumberFlag: 'sku', //货号
                        productCoLorFlag: 'color', //颜色
                        //					productBoxFlag:false,  		//装箱
                        productSpeFlag: 'spec', //规格型号
                        productImageFlag: 'photoId', //颜色
                        //                        yardsFlag:'yards'//细码
                    }
                    for (var i in objMachine) {
                        if (owner[i] != undefined) {
                            if (owner[i].toString() == 'false') {
                                //easyGridSetting[i]=objMachine[i];
                                easyGridSetting[objMachine[i]] = false;
                            }
                        }
                    }
                    _global_settings.acOwner = owner; //小商的商户信息转成自己的缓存

                    _global_settings.owner.easyGridSetting = easyGridSetting;

                    data = res[0].enterpriseInfo.address[0] == undefined ? '' : res[0].enterpriseInfo.address[0];
                    callback(res);
                } catch (e) { /*Core.alert({message: '204系统错误'});*/ }
            } else {
                Core.alert({ message: '204系统错误' });
            }
        },
        failure: function(e) {
            var err = JSON.parse(e.responseText);
            Core.alert({
                message: err.errorMsg
            });
        }
    });

    var province = '请选择';
    var city = '请选择';
    var district = '请选择';

    if (data != null) {
        province = data.province;
        city = data.city;
        district = data.district;
    }

    var ad = new address(ids, 'form-control');
    ad.init(province, city, district);
}

/**
 * 获取客户信息
 */
var getCustomerComboboxSource = function(settings) {

    var soOwnerId = settings.soOwnerId;
    var userName = settings.userName;
    var target = settings.target;
    var callback = settings.callback || function() {};


    Core.AjaxRequest({
        url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/clientInfos/' + soOwnerId + '/' + userName),
        type: 'GET',
        // async: false,
        callback: function(res) {

            var source = $.extend(true, [], res);

            $.each(source, function(i, v) {
                var tel = '';
                if (v.telephone != '' && v.telephone != null) {
                    tel = '(' + v.telephone + ')';
                }
                var telB = '';
                if (v.backupTelephone != '' && v.backupTelephone != null) {
                    telB = '(' + v.backupTelephone + ')';
                }
                v.name_np = v.name;
                v._name = v.name + tel + telB;
                var namePinyin = v.namePinyin === undefined ? '' : v.namePinyin;
                var namePy = v.namePy === undefined ? '' : v.namePy;
                v.name = v.name + tel + telB + "<VV>" + namePinyin + namePy + "</VV>";
            });
            console.log(source);
            if (target != undefined) {
                target.comboBox({
                    renderSelectedItem: refNameByPinyin_client,
                    source: source,
                    displayMember: 'name',
                    valueMember: 'clientInfoid',
                    placeHolder: '请输入或选择客户',
                    width: '90.888%',
                    height: 33,
                    theme: currentTheme
                });
            }
            callback(source);
        },
        failure: function(e) {}
    });
}

/**
 * 获取产品信息--
 * 
 * productsInUse_Part
 */
var getProductInUsePart = function(soOwnerId, userName, callback) {
    Core.AjaxRequest({
        url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/productsVO/' + soOwnerId + '/' + userName),
        type: 'GET',
        async: false,
        callback: function(res) {
            var map = {}
            map.product = $.extend(true, [], res);

            map.product_server = map.product;

            var source1 = $.extend(true, [], res);
            $.each(source1, function(i, v) {
                var sku = '';
                if (v.sku != '' && v.sku != null) {
                    sku = '(' + v.sku + ')';
                }
                v.name = v.name + sku;
                v._name = v._name + sku;
            });
            map.product_Part = source1;

            var source2 = $.extend(true, [], res);
            var arr = []
            $.each(source2, function(i, v) {
                if (v.available) {
                    arr.push(v);
                }
            });
            map.productsInUse_server = source2;

            map.productsInUse = map.productsInUse_server;

            var source3 = $.extend(true, [], res);
            $.each(source3, function(i, v) {
                var sku = '';
                if (v.sku != '' && v.sku != null) {
                    sku = '(' + v.sku + ')';
                }
                v.name = v.name + sku;
                //v._name=v.name+sku+"<VV>"+v.namePinyin+v.namePy+"</VV>";
                v._name = v._name + sku;

            });
            map.productsInUse_Part = source3;

            callback(map);
        },
        failure: function(e) {
            debugger;
        }
    });
}

function viewOtherPay(settings) {
    var otherPayId = settings.otherPayId;
    var windowId = settings.windowId;
    var inputId = settings.inputId;
    var otherAmtdesc = settings.otherAmtdesc == undefined ? '' : settings.otherAmtdesc;

    //点击额外费用
    //	debugger
    $(otherPayId).on('click', function() {
        var width = window.innerWidth - 17 + 'px';
        var height = $(document).height() + 'px';
        $(windowId).css({ 'width': width, 'height': height, 'display': '' });
        initOtherPay();

    });

    var initOtherPay = function() {
        if (otherAmtdesc == '') {
            var div =
                '<div class="col-md-12 text-center">' +
                '<div class="form-horizontal">' +
                '<div class="form-group">' +
                '<span style="font-size:18px">您没有选择非产品费用类别哦</span>' +
                '</div>' +
                '</div>' +
                '</div>';

            $(inputId).append(div);
        } else {
            var arr = otherAmtdesc.split('||');
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                var div =
                    '<div class="col-md-4">' +
                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<ul>' +
                    '<li>' +
                    '<input type="checkbox" checked disabled class="m-t-10">' +
                    '<span class="otherlabel m-l-5">' + arr[i] + '</span>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $(inputId).append(div);
            }
        }
    }

    //点击关闭
    $(windowId).find('.cancleViewPay').on('click', function() {
        closeViewOtherPay();
    });

    var closeViewOtherPay = function() {
        $(windowId).css('display', 'none');

        var div = $(inputId).children();
        div.remove();
    }
}

/**
 * 获取小商的_global_settings.acOwner信息--
 * 
 * productsInUse_Part
 */
var getAcOwnerInformation = function(soOwnerId, userName) {

    Core.AjaxRequest({
        url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/ownerinformation/' + soOwnerId + '/' + userName),
        type: 'GET',
        async: false,
        callback: function(owner) {
            _global_settings.acOwner = owner;
            _global_settings.acOwner.easyGridSetting = easyGridSetting;
            var easyGridSetting = {};
            var objMachine = {
                producttypeFlag: 'remark',
                //					productunitFlag:false, //是否启用单位
                productKgFlag: 'weight',
                productNumberFlag: 'sku',
                productCoLorFlag: 'prodColourId',
                //					productBoxFlag:false,  //是否启用 装箱
                productSpeFlag: 'prodSpecId'
            }
            for (var i in objMachine) {
                if (owner[i] == 'false') {
                    easyGridSetting[i] = objMachine[i];
                }
            }
        },
        failure: function(e) {}
    });
}

//初始化额外费用
function initOther(b, other, res, id, name) {
    //debugger
	Core.AjaxRequest({
        url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/ownerOtherAmt/' + id + '/' + name),
        type: 'GET',
//      async: false,
        callback: function(data) {
            var o = data;
            //编辑单子
            if (b) {
                o = res;
            }
            
            //页面新增
            var oth=other.split('||'),arr=[];
            for(var i=0;i<oth.length;i++){
            	arr.push({typeValue:oth[i]}); 
            }
            
            init(arr);
        },
        failure: function(data) {
        }
    });
	
	var init=function(o){
		$.each(o, function(i) {
	        var bool = o[i].orderFlag; //是否有业务关系
	        var flag = o[i].flag; //是否只绑定一个
	        var span = '';
	        if (bool) {
	            if (flag) {
	                span = '<span class="otherlabel m-l-5">' + o[i].typeValue + '<i class="md-edit hoverspan editOtherpay"></i></span>';
	            } else {
	                span = '<span class="otherlabel m-l-5">' + o[i].typeValue + '</span>';
	            }
	        } else {
	            span = '<span class="otherlabel m-l-5">' + o[i].typeValue + '<i class="md-edit hoverspan editOtherpay"></i></span>';
	        }

	        var div = '<div class="col-md-4"><div class="form-horizontal"><div class="form-group"><ul>' +
	            '<li><input type="checkbox" data-id="' + o[i].id + '" class="m-t-10">' + span +
	            '</li></ul></div></div></div>';

	        $('#otherPayInput').append(div);

	    });

	    var d =
	        '<div class="col-md-4">' +
	        '<div class="form-horizontal">' +
	        '<div class="form-group">' +
	        '<ul>' +
	        '<li>' +
	        '<img src="images/common/detailimg/orderadd.png" title="新增非产品费用" alt="新增非产品费用">' +
	        '</li>' +
	        '</ul>' +
	        '</div>' +
	        '</div>' +
	        '</div>';
	    $('#otherPayInput').append(d);

	    //初始化每一次打开选中
	    if (other != '') {
	        var arr = other.split('||');

	        //console.log(arr)
	        var length = arr.length;
	        var span = $('#otherPayInput').find('span');
	        for (var i = 0; i < length; i++) {
	            $.each(span, function() {
	                t = $(this);
	                var text = t.text();
	                if (text == arr[i]) {
	                    $(this).parent().find('input')[0].checked = true;
	                    return false;
	                }
	            });
	        }
	    }
	}
}

function otherPay(setting){
	
    var inputId = setting.inputId; //复选按钮
    var labelId = setting.labelId; //非产品费用汉字
    var showId = setting.showId;   //非产品费用输入框
    var other = setting.otherDesc; //非产品费用
    var view = setting.view==undefined?false:setting.view; //查看界面
    var res = setting.res;//编辑界面
    var mgt = setting.mgt;	
    
    var ownerId=setting.ownerId;
    var name=setting.name;

    var initOtherPayModal=function(){
    	$('#otherPayModal').modal('show');
    	$('#otherPayInput').html('');
    	
    	if(view){
    		$('#otherPayModal').find('span').text('非产品费用');
    		$('#saveOtherPay').hide();
    		initViewPay();
    		return;
    	}else{
    		$('#otherPayModal').find('span').text('请选择');
    		$('#saveOtherPay').show();
    	}
    	
    	if(inputId.indexOf('edit')>-1){ //编辑
    		initOther(true, other, res, ownerId, name);
    	}else{
    		initOther(false, other, null, ownerId, name);
    	}
    	timeOut(function(){
    		typeFocus();
    	},100);
        
        //点击编辑
        $('#otherPayInput').off('click').on('click', '.editOtherpay', function() {
            var parent = $(this).parent();
            var li = parent.parent();
            var text = parent.text();
            var input = '<input type="text" class="form-control editOther float-right" value="' + text + '" data-blacklist=" "  style="width:87%">';
            parent.remove();
            li.append(input);
            //console.log(text);
            checkEdit();
        });
        
        //保存新增额外费用
        $('#saveOtherPay').off('click').on('click', function() {

            if ($('#otherPayInput').find('.s1r').length > 0) {
                Core.alert({ message: '编辑的非产品费用不能为空！' });
                return false;
            }

            other = '';
            var arr = []; //所有的额外费用
            var arrs = []; //单子的额外费用
            var input = $('#otherPayInput').find('input[type=checkbox]');
            //		debugger
            $.each(input, function(i) {
                var obj = {};
                var check = $(this)[0].checked;

                var id = $(this).data('id');
                var parent = $(this).parent();
                var val = parent.children().eq(1).text();

                if (val == '') {
                    val = parent.children().eq(1).val();
                }

                if (check) {
                    if (val != '') {
                        other += val + '||';
                        if (id == undefined) {
                            obj.typeValue = val;
                        } else {
                            obj.id = id;
                            obj.typeValue = val;
                        }

                        arrs.push(obj)
                    }
                }

                if (val != '') {
                    if (id == undefined) {
                        obj.typeValue = val;
                    } else {
                        obj.id = id;
                        obj.typeValue = val;
                    }

                    arr.push(obj)
                }
            });

            other = other.substring(0, other.length - 2);
            mgt.otherAmtdesc = other;
            mgt.otherAmts = arrs;

            if (checkCopy(arr)) {
                Core.alert({ message: '非产品费用不能重复！' });
                return false;
            }
            
            if (arrs.length == 0) {
                //注释 保存后不清空复原
                //$(checkId)[0].checked=false;
                //$(showId).css('display','none');
                //$(inputId).val('0.00');
            } else {
                $(inputId)[0].checked = true;
                $(showId).parent().css('display', '');
            }

//            Core.AjaxRequest({
//                type: 'POST',
//                url: ws_url + '/CXF/rs/ownerOtherAmt',
//                params: arr,
//                callback: function() {
//                    ComboBoxSources.load('getOtherAmt');
//                }
//            })
        });
    }
    
    //点击额外费用
    $(labelId).on('click', function() {
    	if($('#otherPayModal').length==0){
        	$.loadModal('page/common/segment/otherPay.html', function(res) {
                var html = $(res);
                $('body').append(html);
                initOtherPayModal();
        	});    
        }else{
        	initOtherPayModal();
        }
    });
    
    //点击复选框
    $(inputId).on('change', function() {
    	var check = $(this)[0].checked;
        if (check) {
            $(showId).parent().css('display', '');
        } else {
        	$(showId).parent().css('display', 'none');
            $(showId).val('0.00');
            return;
        }
        
    	if($('#otherPayModal').length==0){
        	$.loadModal('page/common/segment/otherPay.html', function(res) {
                var html = $(res);
                $('body').append(html);
                initOtherPayModal();
        	});    
        }else{
        	initOtherPayModal();
        }
    });

    var checkEdit = function() {
        $('.editOther').on('change keyup', function() {
            $.each($('.editOther'), function() {
                var value = $(this).val().trim();
                if (value == '') {
                    $(this).addClass('s1r');
                } else {
                    $(this).removeClass('s1r');
                }
            })
        });
    }

    var typeFocus = function() {
        $('#otherPayInput').find('img').on('click', function() {
            var div =
                '<div class="col-md-4">' +
                '<div class="form-horizontal">' +
                '<div class="form-group">' +
                '<ul>' +
                '<li>' +
                '<input class="m-t-10" type="checkbox">' +
                '<input type="text" class="addinput form-control float-right" data-blacklist=" " style="width:87%" placeholder="添加">' +
                '</li>' +
                '</ul>' +
                '</div>' +
                '</div>' +
                '</div>';
            //debugger
            $(this).parents('.col-md-4').before($(div));
            $('#otherPayInput').find('.addinput:last')[0].focus();
        })
    }

    //检查是否重复
    var checkCopy = function(arr) {
        //debugger
        var a = [];
        for (i = 0; i < arr.length; i++) {
            a.push(arr[i].typeValue);
        }
        var hash = {};
        for (var i in a) {
            if (hash[a[i]])
                return true;
            hash[a[i]] = true;
        }

        return false;
    }
    
    var initViewPay = function() {
        if (other == '') {
            var div =
                '<div class="col-md-12 text-center">' +
                '<div class="form-horizontal">' +
                '<div class="form-group">' +
                '<span style="font-size:18px">您没有选择非产品费用类别哦</span>' +
                '</div>' +
                '</div>' +
                '</div>';
            $(inputId).append(div);
        } else {
            var arr = other.split('||');
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                var div =
                    '<div class="col-md-4">' +
                    '<div class="form-horizontal">' +
                    '<div class="form-group">' +
                    '<ul>' +
                    '<li>' +
                    '<input type="checkbox" checked disabled class="m-t-10">' +
                    '<span class="otherlabel m-l-5">' + arr[i] + '</span>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $(inputId).append(div);
            }
        }
    }
}

/**
 * OCRBss请求SimpleAC图片，文件
 */
var getACFileSrc = function(fileId, soOwnerId, userName, fn) {
    Core.AjaxRequest({
        url: _global_settings.service.url + '/SimpleAC/down/' + new Base64().encode('toocr/order/downFile/' + fileId + '/' + soOwnerId + '/' + userName),
        type: 'GET',
        showMsg: false,
        dataType: 'text',
        callback: function(data) {
            fn(data);
        },
        failure: function(e) {}
    });
}

/**
 * 初始化附件列表
 */
var initOcrOrderFileList = function(settings) {
    var soOwnerId = settings.soOwnerId;
    var userName = settings.userName;
    var orderId = settings.orderId;
    var attachmentEl = settings.attachmentEl;
    var listEl = settings.listEl;
    var type = settings.type;

    if (id != '') {
        if (type = 'photo') {
            Core.AjaxRequest({
                url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/orderfileinfo/' + type + '/sales/' + orderId + '/' + soOwnerId + '/' + userName),
                type: 'GET',
                showMsg: false,
                callback: function(data) {
                    var str = [];
                    for (var i in data) {
                        str.push(data[i].id);
                    }
                    loadImgSpan(str, listEl, attachmentEl);
                },
                failure: function(e) {}
            });
        } else if (type = 'other') {
            Core.AjaxRequest({
                url: _global_settings.service.url + '/SimpleAC/' + new Base64().encode('toocr/order/orderfileinfo/' + type + '/sales/' + orderId + '/' + soOwnerId + '/' + userName),
                type: 'GET',
                showMsg: false,
                callback: function(data) {
                    var str = [];
                    for (var i in data) {
                        str.push(data[i].id);
                    }
                    $(attachmentEl).fileuploader({ readonly: true, filelist: str.toString() });
                },
                failure: function(e) {}
            });
        }
    }
}

var loadImgSpan = function(arr, listEl, attachmentEl, soOwnerId, userName) {
    debugger;
    var str = ''
    for (var i in arr) {
        var html = '<div data-id="' + arr[i] + '"  class="item col-md-2 viewimgDetailRow p-t-15"> <form class="imgFile">                                                                                                                         ' +
            '	       <div class="col-md-12">                                                                                                                      ' +
            '			  <div class="viewimgDetailRowImgCell" style="height:100pt">                                                                                                                    ' +
            '			      <img class="viewimgDetailRowImg" src="" style="width: 100%; height: 100%;position: relative; cursor:pointer;" class="img0" alt="双击查看大图" title="双击查看大图"> ' +
            //'<i class="md-cancel close-lab"></i>' +
            '			  </div>                                                                                                                                    ' +
            //'			  <input type="file" name="file" multiple="multiple" style="display:none" class="file0">                                        ' +
            //'			  <div class="m-t-10 relative proTypeLabel" style=" width: 190pt;background: #f8f9f9;color: #53687D;">                                                                                                ' +
            // '<input type="checkbox" checked="true" class="prod_specCheck"><input class="prod_specText" placeholder="颜色描述" value="">|<input class="prod_specNum" placeholder=""></div>                                                         ' +
            //    		'				  <i class="md-cancel close-lab"></i>'+
            '			  </div>                                                                                                                                    ' +
            '	       </div>                                                                                                                                       ' +
            '	   </form></div>';
        //		str += html;
        //console.log($(listEl).find('.viewimgDetailRowImg'));
        $(listEl).append(html);
    }
    $(listEl).removeClass('viewimgDetailRowList').addClass('viewimgDetailRowList');
}

function closeModel() {
    $('.btn-r').on('click', function() {
        //		console.log($(this));
        var model = $(this).parent().parent().parent().parent().parent().find('.modal-body');

        var table = model.find('.addRessTableSelect').attr('id');

        setAddress(model, table);

        //		var res=ComboBoxSources.getRecords('priseInfo')[0].address[0];
        //		
        //		var province=res.province;
        //		var city=res.city;
        //		var district=res.district;
        //		
        //		setTimeout(function(){
        //			model.find('input').val('');
        //			
        //			var ad=new address(table,'form-control');
        //			ad.init(province,city,district);
        //			
        //			model.find('textarea').val('');
        //		},50)
    });

    $('.cancleBtn').on('click', function() {
        var model = $(this).parent().parent();
        var table = model.find('.addRessTableSelect').attr('id');
        //		debugger

        setAddress(model, table);

        //		var res=ComboBoxSources.getRecords('priseInfo')[0].address[0];
        //		
        //		var province=res.province;
        //		var city=res.city;
        //		var district=res.district;
        //		
        //		setTimeout(function(){
        //			model.find('input').val('');
        //			
        //			var ad=new address(table,'form-control');
        //			ad.init(province,city,district);
        //			
        //			model.find('textarea').val('');
        //		},50);
    });
}

function setAddress(model, table) {
    //	return ;
    //	var res=ComboBoxSources.getRecords('priseInfo')[0].enterpriseInfo.address[0]==undefined?
    //			'':ComboBoxSources.getRecords('priseInfo')[0].enterpriseInfo.address[0];
    var res = ''
    var province = '请选择';
    var city = '请选择';
    var district = '请选择';

    if (res !== '') {
        province = res.province;
        city = res.city;
        district = res.district;
    }

    //setTimeout(function(){
    model.find('input').val('');

    var ad = new address(table, 'form-control');
    ad.init(province, city, district);

    model.find('textarea').val('');
    //},1800)
}

//点击新增地址
function showAddress(id, addRessId, ressId) {
    $('.addSomeBtn').on('click', function() {
        var msg = id.indexOf('Ven') > -1 ? '供应商' : '客户';
        var val = $('#' + id).val();
        var allmsg = "抱歉，请先去选择" + msg + "，再新增地址";
        //		if(grate){
        //			
        //		}else{
        if (val == '') {
            Core.alert({ message: allmsg });
            return false;
        }
        chooseAddress(addRessId, ressId);
        //		}
    });
}

var clearTimeOutList = function(settings) {
    var defaults = {
        not: [] //数组内的不过滤
    };
    settings = $.extend(true, defaults, settings);
    if (window.timeOutList) {
        for (var i in window.timeOutList) {
            var num = window.timeOutList[i];
            if (!$.strInArr(num, settings.not)) {
                clearTimeout(num);
            }
        }
        window.timeOutList = [];
    }
};

var getgridcheckedsum = function(key, table) {
    var arr = table.getData();
    var newarr = ComboBoxSources.getArrSourceOrderByKey(arr, 'waitdel', true);
    //var obj = ComboBoxSources.getInfoMapByKey(newarr, key);
    var sum = 0;
    //debugger
    for (var i in newarr) {
        var row = newarr[i];
        if (row[key] != null && row[key] != '') {
            sum += parseFloat(row[key]);
        }
    }
    return sum;
};


//拼音搜索
var refNameByPinyin = function(index, item) {
    var item = item.originalItem;
    if (item != null) {
        item = item.name;
        if (item != null) {
            var label = item;
            return label;
        }
    }

    //return "";   
};

//客户供应商拼音搜索
var refNameByPinyin_client = function(index, item) {
    var item = item.originalItem;
    if (item != null) {
        item = item._name;
        if (item != null) {
            var label = item;
            return label;
        }
    }

    //return "";   
};

function dragImg(obj) {
    var obj = document.getElementById(obj);

    obj.onmousedown = function(ev) {
        var ev = ev || event;

        var disX = ev.clientX - this.offsetLeft;
        var disY = ev.clientY - this.offsetTop;

        if (obj.setCapture) {
            obj.setCapture();
        }

        document.onmousemove = function(ev) {
            var ev = ev || event;

            obj.style.left = ev.clientX - disX + 'px';
            obj.style.top = ev.clientY - disY + 'px';
        }

        document.onmouseup = function() {
            document.onmousemove = null;
            //释放全局捕获 releaseCapture();
            if (obj.releaseCapture) {
                obj.releaseCapture();
            }
        }
        return false;
    }
}

function biggerImg(obj) {
    debugger
    var obj = document.getElementById(obj);
    if (obj.addEventListener) {
        obj.addEventListener("mousewheel", MouseWheelHandler, false); // IE9, Chrome, Safari, Opera
        obj.addEventListener("DOMMouseScroll", MouseWheelHandler, false); // Firefox
    } else {
        obj.attachEvent("onmousewheel", MouseWheelHandler);
    } // IE 6/7/8

    //为了让不同浏览器都能支持的处理做法,我们将对Firefox的detail值取反然后返回1或者-1的其中一个
    function MouseWheelHandler(e) {
        var e = window.event || e; // old IE support  
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        //现在我们直接决定图片的大小范围。以下代码将图片的宽度范围设置在50-800个像素之间  
        obj.style.width = Math.max(50, Math.min(800, obj.width + (30 * delta))) + "px";

        return false; //最后一点，我们在方法中返回false是为了终止标准的鼠标滚轮事件处理，以防它上下滑动网页
    }
}
/**
 * 绑定事件
 * */
function addEvent(obj, sType, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(sType, fn, false);
    } else {
        obj.attachEvent('on' + sType, fn);
    }
};

function removeEvent(obj, sType, fn) {
    if (obj.removeEventListener) {
        obj.removeEventListener(sType, fn, false);
    } else {
        obj.detachEvent('on' + sType, fn);
    }
};

function prEvent(ev) {
    var oEvent = ev || window.event;
    if (oEvent.preventDefault) {
        oEvent.preventDefault();
    }
    return oEvent;
}
/*添加滑轮事件*/
function addWheelEvent(obj, callback) {
    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') != -1) {
        addEvent(obj, 'DOMMouseScroll', wheel);
    } else {
        addEvent(obj, 'mousewheel', wheel);
    }

    function wheel(ev) {
        var oEvent = prEvent(ev),
            delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
        callback && callback.call(oEvent, delta);
        return false;
    }
};

var t_img; // 定时器
var isLoad = true; // 控制变量
//判断图片加载的函数
function isImgLoad(callback, selector) {
    // 注意我的图片类名都是cover，因为我只需要处理cover。其它图片可以不管。
    // 查找所有封面图，迭代处理
    var selector = selector == null ? 'img' : selector;
    $(selector).each(function() {
        // 找到为0就将isLoad设为false，并退出each
        if ($(this)[0].complete != true) {
            isLoad = false;
            return false;
        }
    });
    // 为true，没有发现为0的。加载完毕
    if (isLoad) {
        clearTimeout(t_img); // 清除定时器
        // 回调函数
        callback();
        // 为false，因为找到了没有加载完成的图，将调用定时器递归
    } else {
        isLoad = true;
        t_img = setTimeout(function() {
            isImgLoad(callback); // 递归扫描
        }, 500); // 我这里设置的是500毫秒就扫描一次，可以自己调整
    }
}
$(document).on('keyup', 'input', function(e) {
    var t = $(this).parents('.jqx-combobox');
    var blacklist = $(this).data('blacklist');
    var v = $(this).val();
    var reg = / /;
    if (blacklist != null) {
        if (reg.test(v)) {
            $(this).val(v.replace(/ /g, ''));
            $(this).trigger('keyup');
            // console.log('document input keyup');
        }
    }
    if (t.length > 0) {
        if (reg.test(v)) {
            $(this).val(v.replace(/ /g, ''));
            $(this).trigger('keyup');
            // console.log('document input keyup');
        }
        if ($(this).val().length == 0 && e.keyCode == 8) {
            if ($(this).prev().length > 0 && $(this).prev().attr('class').indexOf('jqx-combobox-multi-item') == -1) {
                console.log('clearSelection then change');
                t.jqxComboBox('clearSelection');
                t.trigger('change');
            }
        }
    }
})

//获取上传图片的图标
var getUploadFileIcon = function(name, id, imgsrc) {
    debugger;
    var lastIndex = name.lastIndexOf('.');
    if (lastIndex > -1) {
        var name = name.substring(lastIndex + 1, name.length).toLocaleUpperCase();
        if ($.strInArr(name, ['JPG', 'JPEG', 'PNG', 'GIF', 'BMP'])) {
            return '<img class="thumbnailImg" style="width:30px;height:30px;" src="' + imgsrc + '">';
        } else {
            return '<img style="width:30px;height:30px;" src="images/common/filetypeicon/' + name + '.png">';
        }
    }
    return '';
};

/**
 * 保持缓存不失效
 */
$.keepCookie = function(min) {
    min = min == null ? 10 : min;
    //min=money(min,0,true);
    Core.AjaxRequest({
        url: ws_url + '/CXF/rs/common/nothing',
        type: 'GET',
        showMsg: false,
        callback: function(data) {
                setTimeout(function() {
                    $.keepCookie(min);
                }, 1000 * 60 * min);
            }
            /*,
            		failure:function(){
            			window.cookieOutTime == null ? (window.cookieOutTime = 0) : (window.cookieOutTime++);
            			if(cookieOutTime>2){
            				throw 'Cookie died';
            			}else{
            				setTimeout(function(){
            					$.keepCookie(min);
            				},1000*60*min);
            				throw 'Cookie dying';
            			}
            			
            		}*/
    })
}

/**
 * 通过数组下标删除数组某一项返回删除之后的数组
 * 
 * @param arr
 * 			数组
 * @param indexs
 * 			下标
 * @returns	Arrary
 * 			被删除之后的新数组
 */
function removeArrayByIndex(arr, indexs) {
    //如果indexs大于或小于指定数组的长度则返回  
    if (indexs > arr.length - 1 || indexs < 0) {
        console.log('没有找到下标为' + indexs + '的元素！');
        return false;
    }

    var arr1 = [];

    for (var i = 0; i < arr.length; i++) {
        if (i == indexs) { continue } //如果删除的为第i个元素，跳出当前循环  
        arr1.push(arr[i]); //把下标不为indexs的元素添加到arr1  
    }
    arr.length = 0; //将arr的长度设为零  

    for (var i = 0; i < arr1.length; i++) {
        arr[i] = arr1[i] //重新给arr赋值  
    }

    return arr; //返回传进的数组  
}

var grid_renders = function(data) {
    var source = {
        localdata: data,
        datatype: "json",
        datafields: [
            { name: 'orderNumber', type: 'string' },
            { name: 'serviceType', type: 'string' },
            { name: 'orderType', type: 'bool' },
            { name: 'telephone', type: 'string' },
            { name: 'userName', type: 'string' },
            { name: 'ownerName', type: 'string' },
            { name: 'submitDate', type: 'string' },
            { name: 'id', type: 'string' },
            { name: 'soOwnerId', type: 'string' },
            { name: 'boundindex', type: 'string' },
            { name: 'uid', type: 'string' },
            { name: 'uniqueid', type: 'string' },
            { name: 'visibleindex', type: 'string' },
        ],
        addrow: function(rowid, rowdata, position, commit) {
            commit(true);
        },
        deleterow: function(rowid, commit) {
            commit(true);
        },
        updaterow: function(rowid, rowdata, commit) {
            commit(true);
        }
    };
    var dataAdapter = new $.jqx.dataAdapter(source);
    return dataAdapter;
}

/**
 * websocket
 * h5实时通讯接受消息进行数据处理
 */
var connectWebsocket = function(callback) {

    var reconnectTimer = null;
    var ws = null;
    var callback = callback || function() {};

    if (ws != null) {
        if (ws.readyState <= 1) { //0 CONNECTING, 1 OPEN, 2 CLOSING, 3 CLOSED
            return;
        } else {
            ws = null;
        }
    }

    /*<%
    	String cp = request.getServletContext().getContextPath();
    	if ("/".equals(cp)) cp="";
    %>*/
    //判断当前浏览器是否支持WebSocket
    var target = "ws://" + window.location.host+ ws_url + "/websocket/ocrreq";
    if ('WebSocket' in window) {
        ws = new WebSocket(target);
    } else if ('MozWebSocket' in window) {
        ws = new MozWebSocket(target);
    } else {
        Core.alert({ message: '请改用支持WebSocket的浏览器' });
        return;
    }

    //连接成功建立的回调方法
    ws.onopen = function(obj) {
        console.info('open');
        console.info(obj);
        if (reconnectTimer) {
            clearInterval(reconnectTimer);
            reconnectTimer = null;
        }
    };

    //连接关闭的回调方法
    ws.onclose = function(obj) {
        console.info('close');
        console.info(obj);
        if (reconnectTimer == null) {
            reconnectTimer = setTimeout(function() { connectWebsocket(callback) }, 3000);
        }
    };

    //连接发生错误的回调方法
    ws.onerror = function(err) {
        console.info('error');
        console.info(err);
        if (reconnectTimer == null) {
            reconnectTimer = setTimeout(function() { connectWebsocket(callback) }, 3000);
        }
    }

    //接收到消息的回调方法
    ws.onmessage = function(obj) {
//        console.info('message');
//        console.info(obj);
        if (reconnectTimer) {
            clearInterval(reconnectTimer);
            reconnectTimer = null;
        }
        var msg = JSON.parse(obj.data);
        if ("error" == msg.type) {
            Core.alert({ message: msg.data.errorMsg });
            if (msg.data.errorCode == 401) {
                window.location.href = ws_url + "/page/login/login.jsp";
                return;
            } else {
                Core.alert({ message: msg.data.errorMsg });
            }
        } else if ("newOcrReq" == msg.type) {
            callback(msg);
        }
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function() {
//    	var evt = e||window.event;
// 		if(window.location.hostname!=='localhost'){
// 			evt.returnValue=""; 
// 		}
        ws.close();
    }

    //ws.send(message)发送消息
};

connectWebsocket(function(msg) {
    if (msg != '' && msg != undefined && msg.data != undefined) {
        if (msg.data == 'ocr:checkOrder' && _global_settings.owner.roleName == 'Ocr_auditor') { //审核人
            if ($('#userInformationGrid').length >= 0) {
                $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
                window.initPlaceOrders();
            }
            //语音消息提醒和弹框提醒
            popNotice('images/1014.mp3');
        }
        if (msg.data == 'ocr:stayOrder' && _global_settings.owner.roleName == 'Ocr_createBy') { //制单人
            if ($('#userInformationGrid').length >= 0) {
                $('#userInformationGrid').jqxGrid('updatebounddata', 'cells');
                window.initPlaceOrders();
            }
            //语音消息提醒和弹框提醒
            popNotice('images/1014.mp3');
        }
    }
});

//重置参数
var setPara=function(){
	$('#floatImg>img').remove();
	$('#floatImg').css('display','none');
	$('#floatImg_rotate').addClass('hide');
}

/**
 * ocr驳回模态框
 */
var rejectOcrOrder = function(uuid) {
    var initModal = function() {
        $('#unkownWriting').data({ 'type': 'kfRejectFont', 'uuid': uuid });
        $('#unkownInformation').data({ 'type': 'kfRejectInfo', 'uuid': uuid });
    }

    var initOcrOrderRejectModal = function() {
        $('#unkownWriting')[0].checked = true;
        $('#unkownInformation')[0].checked = false;
        $('#ocrOrderReject').modal('show');
        initModal();
    }

    if ($('#ocrOrderReject').length == 0) {
        $.loadModal('page/common/segment/ocrOrderReject.html', function(res) {
            $('body').append(res);
            initOcrOrderRejectModal();
        });
    } else {
        initOcrOrderRejectModal();
    }
}

//$(document).on('keyup', 'input', function(e) {
//    var t = $(this).parents('.jqx-combobox');
//    var blacklist = $(this).data('blacklist');
//    var v = $(this).val();
//    var reg = / /;
//    if (blacklist != null) {
//        if (reg.test(v)) {
//            $(this).val(v.replace(/ /g, ''));
//            $(this).trigger('keyup');
//        }
//    }
//    if (t.length > 0) {
//        if (reg.test(v)) {
//            $(this).val(v.replace(/ /g, ''));
//            $(this).trigger('keyup');
//        }
//        if ($(this).val().length == 0 && e.keyCode == 8) {
//            if ($(this).prev().length > 0 && $(this).prev().attr('class').indexOf('jqx-combobox-multi-item') == -1) {
//                console.log('clearSelection then change');
//                t.jqxComboBox('clearSelection');
//                t.trigger('change');
//            }
//        }
//    }
//});

//function notifyMe() {
//  // 先检查浏览器是否支持
//  if (!("Notification" in window)) {
//    alert("This browser does not support desktop notification");
//  }
//
//  // 检查用户是否同意接受通知
//  else if (Notification.permission === "granted") {
//    // If it's okay let's create a notification
//    var notification = new Notification("Hi there!");
//  }
//
//  // 否则我们需要向用户获取权限
//  else if (Notification.permission !== 'denied') {
//    Notification.requestPermission(function (permission) {
//      // 如果用户同意，就可以向他们发送通知
//      if (permission === "granted") {
//        var notification = new Notification("Hi there!");
//      }
//    });
//  }
//
//  // 最后，如果执行到这里，说明用户已经拒绝对相关通知进行授权
//  // 出于尊重，我们不应该再打扰他们了
//}


/**
 * Notification
 * 语音消息提醒和弹框提醒
 * 此方法涉及到用户是否愿意开启桌面通知，不可强制性，用户有完全主动性
 * 部分浏览器不支持桌面通知，就只支持语音提醒。
 * 浏览器越新，用户体验越好
 */
var popNotice = function(url) {
    //通用情况下
    var audioElm = document.createElement('audio'),
        source;

    //多个audio情况下
    if (Object.prototype.toString.call(url) === '[object Array]' && url.length > 0) {
        for (var i = 0; i < url.length; i++) {
            source = document.createElement('source');
            source.src = url[i];
            source.type = 'audio/' + url[i].match(/\.([^\.]+)$/)[1];
            audioElm.appendChild(source);
        }
    } else {
        //单个audio情况下
        audioElm.src = url;
    }

    if (url != undefined) {
        audioElm.play();
    }

    //在浏览器支持的情况下
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (Notification) {
        if (Notification.permission == "granted") { //同意启用通知
            var notification = new Notification("新通知", {
                body: '您有新的单子来了,请留意总览信息！',
                icon: document.querySelectorAll('link[rel~=shortcut]')[0].href
            });

            notification.onshow = function() {
                setTimeout(function() {
                    notification.close();
                }, 10000);
            }

            notification.onclick = function() {
                window.focus(); //如果通知消息被点击,通知窗口将被激活，即可在其他页面时点击后浏览器切换到我们的页面！
                setTimeout(function() {
                    notification.close();
                }, 5000);
            };
        } else if (Notification.permission != "granted") { // denied ,用户不想要通知 或者 支持Notification但未开启桌面提醒
            //调用该方法将会在浏览器的信息栏弹出一个是否允许桌面通知的提醒，该方法只能由用户主动事件触发
            Notification.requestPermission(function(permission) {
                if (Notification.permission !== permission) {
                    Notification.permission = permission;
                }
                var notification = new Notification("新通知", {
                    body: '您有新的单子来了,请留意总览信息！',
                    icon: document.querySelectorAll('link[rel~=shortcut]')[0].href
                });
            });
        }
    }
};