$(function(){
    var headerH = $(".header").height();
    $("body").css("padding-top",headerH);
    orient();
    //queryFundInfo(userId,merId,uuid,token);
    //首页按钮间距
    var windowW = $(window).width();
    var btnListLiW = windowW*0.21;
    $(".btnList li").css("margin-left",(windowW-4*btnListLiW-8)/5);
    //购买结果页文字宽度
    var textW = $(".buyResult").width() - $(".buyTime").width() - 80;
    $(".buyResult .text").css("width",textW);
    //获取今天时间
    var date = new Date(new Date().getTime()).Format("yyyy-MM-dd");
    $.cookie("date",date);
    $(".todayTime span").html(date);

    //协议跳转保存表单数据
    $(".xieyi a").click(function(){
        inputSession();
    });
});

//竖屏
$(window).bind( 'orientationchange', function(e){
    orient();
});

//跳出webview
function outWebview(){
    window.jsObject.backToMain("");
}

//首页当日基金信息
function queryFundInfo(userId,merId,uuid,token){
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl()+"queryFundInfo",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token
        },
        dataType: 'json',
        success: function(data){
            var a= data.data;
            if(data.resp_code=="0"){
                $(".fundName").html(a.fundName);
                $(".fundNo").html(a.fundCode);
                $(".incomeRatio").html(a.incomeRatioDisplay);
                $(".tenThouandIncome").html(a.tenThouandIncomeDisplay);
            }else{
                //setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function(data){
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.resp_code, data.resp_msg);
            }else{
                errorShowAlert("服务器异常");
            }
        }
    })
}



//域名
function ajaxUrl(){
    var ajaxUrl = "";
    var protocol=document.location.protocol;//协议
    var host=document.location.host;//域名
    if(host == "localhost:8080" || host.substring(0,host.indexOf(":")) == "127.0.0.1"){
        ajaxUrl = protocol+'//'+"localhost:8080/GYCL/";
        return ajaxUrl;
    }else{
        ajaxUrl = protocol+'//'+host+"/GYCL/";
        return ajaxUrl;
    }
}

//地址参数
function locationSearch(){
    var search = window.location.search;
    return search;
}

//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function dateCompare(a, b) {
    var arr = a.split("-");
    var starttime = new Date(arr[0], arr[1], arr[2]);
    var starttimes = starttime.getTime();

    var arrs = b.split("-");
    var lktime = new Date(arrs[0], arrs[1], arrs[2]);
    var lktimes = lktime.getTime();

    if (starttimes > lktimes) {
        return false;
    }
    else
        return true;
}

//接口返回码
function setErrorMsg(errorcode, errormsg, callback) {
	if (errormsg == "" || errormsg == null || errormsg == "undefined" || errormsg == undefined) {
		if (errorcode == 1000) {
			errorShowAlert("请求参数不合法！");
		}
		if (errorcode == 1) {
			errorShowAlert("购买金额不能为空");
		} else if (errorcode == 2) {
			errorShowAlert("购买金额不能小于0元");
		} else if (errorcode == 3) {
			errorShowAlert("取现金额不能大于可用金额");
		} else if (errorcode == 4) {
			errorShowAlert("取现金额不能为空");
		} else if (errorcode == 5) {
			errorShowAlert("取现金额不能小于0元");
		} else {
			errorShowAlert(errormsg);
		}
	} else if (errorcode == "" || errorcode == null || errorcode == "undefined" || errorcode == undefined){
        errorShowAlert("");
    } else {
		if (errormsg == "未登录") {

		} else if (errorcode == "-1001"){
            errorShowAlert("请先获取验证码");
        } else if (errorcode == "-2000"){

        } else if (errorcode == "-2001"){

        } else if (errorcode == "-2004"){
            errorShowAlert(errormsg,outWebview);
        }else {
			errorShowAlert(errormsg);
		}

	}
}

//跳转开户
function goOpenAccount(){
    location.href = "openAccount.html"+locationSearch();
}

//错误提示框
function errorShowAlert(str,callback){
    hideAlert();

    var showBox;
    var showBox_h='';
    showBox_h +='<div class="showBox">';
    showBox_h +='<div id="showAlert" class="showAlert">';
    showBox_h +='<div class="showContent">';
    showBox_h +='<div class="alert_title">提示</div>';
    showBox_h +='<div class="alert_info"><span class="prompt">'+str+'</span></div>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="sure">确认</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = window.screen.availHeight; //屏幕尺寸高度
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top","10rem");
    $(".subButton .sure").click(function () {
        hideAlert();//购买基金接口
        if(callback){
            callback();
        }
    });
}

//确认购买提示框
function showAlert(flag,fundMoney,fundName,callback1,callback2){
    var showBox;
    var showBox_h='';
    showBox_h +='<div class="showBox">';
    showBox_h +='<div id="showAlert" class="showAlert">';
    showBox_h +='<div class="showContent">';
    var title = "";
    var type = "";
    if(flag == 1){
        title = "请确认以下信息";
        type = "购买";
    }else if(flag == 2){
        title = "请确认取现信息";
        type = "取现";
    }
    showBox_h +='<div class="alert_title">'+title+'</div>';
    showBox_h +='<div class="alert_info"><span>'+type+'金额: </span><span>'+fundMoney+'</span>元</div>';
    showBox_h +='<div class="alert_info"><span>基金名称: </span><span>'+fundName+'</span></div>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="confirm">确认</a><a class="cancle">取消</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = window.screen.availHeight;
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top","10rem");
    $(".subButton .confirm").click(function () {
        hideAlert();
        callback1(callback2);
    });
    $(".subButton .cancle").click(function () {
        hideAlert();
    });

}

//输入密码
function enterCode(callback){
    var showBox;
    var showBox_h='';
    showBox_h +='<div class="showBox">';
    showBox_h +='<div id="showAlert" class="showAlert">';
    showBox_h +='<div class="showContent">';
    showBox_h +='<div class="alert_title">请输入交易密码</div>';
    showBox_h +='<div class="alert_info enterCode"><input type="password" id="password" class="password"></div>';
    showBox_h +='<a class="goForget" href="javascript:void(0)">忘记密码?</a>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="confirm">确认</a><a class="cancle">取消</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = window.screen.availHeight;
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top","10rem");
    $(".goForget").on("click",function(){
        location.href = "fogetPsw.html" + locationSearch();
    });
    $(".subButton .confirm").click(function () {
        if (callback) {
            callback();
        }
    });
    $(".subButton .cancle").click(function () {
        hideAlert();
    });
}

//去掉提示框
function hideAlert() {
    if ($(".showBox")) {
        $(".showBox").remove();
    }
}

//字符串截取
var getArgs = function (){ //作用是获取当前网页的查询条件
    var args = new Object(); //声明一个空对象
    var query = window.location.search.substring(1); // 取查询字符串，如从http://www.snowpeak.org/testjs.htm?a1=v1&a2=&a3=v3#anchor 中截出 a1=v1&a2=&a3=v3。
    var pairs = query.split("&"); // 以 & 符分开成数组
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); // 查找 "name=value" 对
        if (pos == -1) continue; // 若不成对，则跳出循环继续下一对
        var argname = pairs[i].substring(0, pos); // 取参数名
        var value = pairs[i].substring(pos + 1); // 取参数值
        value = decodeURIComponent(value); // 若需要，则解码
        args[argname] = value; // 存成对象的一个属性
    }
    return args; // 返回此对象
};

//小数点后2位不能继续输入
function inputVal(inputId){
    $("#"+inputId).bind('input propertychange', function(){
        var val = Math.floor($("#"+inputId).val()*100)/100;
        var valArr = $("#"+inputId).val().split(".");
        if(valArr.length>1){
            if(valArr[1].length>=2){
                $("#"+inputId).val(val);
            }
        }
    });
}


//不让form提交
$("form").submit(function () {
	return false;
});

//银行列表
function bankList(){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "queryBankList",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo
        },
        dataType: 'json',
        success: function (data) {
            hideLoading();
            var a = data.data;
            $("#bankSel").html("");
            if (data.resp_code == "0") {
                var bankList = "";
                $(a).each(function(i,n){
                    bankList += '<option value="'+ n.bankCode +'" datatype="'+ n.capitalModeId +'">'+ n.capitalModeName +'-'+ n.bankName+'</option>';
                });
                $("#bankSel").append('<option value="0">请选择</option>');
                $("#bankSel").append(bankList);
            } else if (data.resp_code == "-2000") {
                location.href = "personCenter.html?userId=" + userId + "&merId=" + merId + "&uuid=" + uuid + "&dsCustomerNo=" + a.dsCustomerNo + "&token=" + a.token;
            } else {
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function(data){
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.resp_code, data.resp_msg);
            }else{
                errorShowAlert("服务器异常");
            }
        }
    })

}

/*loading框*/

function showLoading(){
    var loading = $('<div class="loadingCircle" data-loader="circle"></div>');
    var loadingBox = $('<div class="showLoading"></div>');
    loadingBox.append(loading);
    $("body").append(loadingBox);
    var scrollHeight = window.screen.availHeight;
    $(".showLoading").css("height",scrollHeight);
    var bookHeight = $(".loadingCircle").height();
    $(".loadingCircle").css("top","18rem");
}

function hideLoading(){
    if ($(".showLoading")) {
        $(".showLoading").remove();
    }
}

//清除cookie
function clearCookie(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
        document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }
}


//js判断屏幕横竖屏：
function orient() {
    //alert('gete');
    if (window.orientation == 0 || window.orientation == 180) {
        $("body").attr("class", "portrait");
        orientation = 'portrait';
        return false;
    }
    else if (window.orientation == 90 || window.orientation == -90) {
        $("body").attr("class", "landscape");
        orientation = 'landscape';

        return false;
    }
}


//缓存表单数据
function inputSession(){
    var inputId;
    var inputVal;
    var inputLength = $("input").length;
    for(var i=0;i<inputLength;i++){
        inputId = $("input").eq(i).attr("id");
        inputVal = $("input").eq(i).val();
        sessionStorage.setItem(inputId,inputVal);
    }
}

//把缓存表单数据填到表单里
function setInputSession(){
    var inputId;
    var inputLength = $("input").length;
    for(var i=0;i<inputLength;i++){
        inputId = $("input").eq(i).attr("id");
        $("#"+inputId).val(sessionStorage.getItem(inputId));
    }
}

var args = new getArgs();
var userId = args.userId;   //用户ID  zhangsan
var merId = args.merId;     //商户ID  chenglian001
var uuid = args.uuid;       //123456
var dsCustomerNo = args.dsCustomerNo;       //zhangsan1
var tradeAccountNo = args.tradeAccountNo;
var token = args.token;     //6ddd9441c7264494abbc04d4ff92111f
var IDcardTest=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;   //18位身份证校验
var bankTest = /^(\d{16}|\d{17}|\d{18}|\d{19})$/; //校验银行卡
var phoneTest = /^1[3-8]{1}\d{9}$/; //校验手机
var pswTest = /^[a-zA-Z0-9]{6,8}$/; //校验密码
var moneyTest = /^[0-9]+([.]{1}[0-9]{1,2})?$/; //校验购买金额
var postCodeTest = /[1-9]\d{5}(?!\d)/;  //校验邮编
var emailTest = /^([\w-])(.)+@([\w-])+(\.)([\w-])+/;    //校验邮箱