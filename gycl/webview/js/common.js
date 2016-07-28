$(function(){
    orient();
    //queryFundInfo(userId,merId,uuid,token);
    //首页按钮间距
    var windowW = $(window).width();
    var btnListLiW = windowW*0.21;
    $(".btnList li").css("margin-left",(windowW-4*btnListLiW-8)/5);
    //购买结果页文字宽度
    var textW = $(".buyResult").width() - $(".buyTime").width() - 80;
    $(".buyResult .text").css("width",textW);
    //取现跳转
    $(".cashbtn").click(function(){
       console.log($(this).siblings(".bankName").text()); 
    });
    //获取今天时间
    var date = new Date(new Date().getTime()).Format("yyyy-MM-dd");
    $.cookie("date",date);
    console.log(date);
    $(".todayTime span").html(date);
    
    //添加银行列表
    bankList();
});

//竖屏
$(window).bind( 'orientationchange', function(e){
    orient();
});


//首页当日基金信息
function queryFundInfo(userId,merId,uuid,token){
    console.log(userId+","+merId+","+uuid+","+token);
    $.post(
        ajaxUrl()+"queryFundInfo",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token
        },
        function(data){
            var a= data.data;
            if(data.resp_code=="0"){
                console.log(data.resp_msg);
                $(".fundName").html(a.fundName);
                $(".fundNo").html(a.fundCode);
                //$(".todayTime").html(data.resp_timestamp.substring(0,9));
                $(".incomeRatio").html(a.incomeRatioDisplay);
                $(".tenThouandIncome").html(a.tenThouandIncomeDisplay);
            }else{
                console.log(data.resp_msg);
                //setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}



//域名
function ajaxUrl(){
    //接口地址  http://10.150.150.xxx/GYCL/
    var ajaxUrl = "";
    var protocol=document.location.protocol;//协议
    var host=document.location.host;//域名
    console.log(host);
    //var ajaxUrl = "http://10.150.150.xxx/GYCL/";
    if(host == "localhost:8080" || host.substring(0,host.indexOf(":")) == "127.0.0.1"){
        ajaxUrl = protocol+'//'+"localhost:8080/GYCL/";
        console.log(host);
        return ajaxUrl;
    }else{
        ajaxUrl = protocol+'//'+host+"/GYCL/";
        console.log(host);
        return ajaxUrl;
    }
}
//接口地址
//var ajaxUrl = util.ajaxUrl()+":8080/GYCL/";
//var ajaxUrl = "http://localhost:8080/GYCL/";
//var ajaxUrl = "http://192.168.1.76:8080/GYCL/";



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
	/////////////////////////////////////////////////
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
		} else {
			errorShowAlert(errormsg);
		}
	} else {
		if (errormsg == "未登录") {
			//errorShowAlert(errormsg, gologin);
		} else if (errorcode == "-2000"){
            
        } else if (errorcode == "-2001"){

        } else if (errorcode == "-1001"){
            errorShowAlert("请先获取验证码");
        } else {
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
    var scrollHeight = $(window).height();
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top",(scrollHeight-bookHeight)/2);
    $(".subButton .sure").click(function () {
        hideAlert();//购买基金接口
        console.log("点击确认按钮！");
        console.log(callback);
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
    };
    showBox_h +='<div class="alert_title">'+title+'</div>';
    showBox_h +='<div class="alert_info"><span>'+type+'金额: </span><span>'+fundMoney+'</span>元</div>';
    showBox_h +='<div class="alert_info"><span>基金名称: </span><span>'+fundName+'</span></div>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="confirm">确认</a><a class="cancle">取消</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = $(window).height();
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top",(scrollHeight-bookHeight)/2);
    $(".subButton .confirm").click(function () {
        hideAlert();
        callback1(callback2);
//        if (callback) {
//            console.log(callback);
//			callback();
//		}
        console.log("点击确认按钮！");
    });
    $(".subButton .cancle").click(function () {
        console.log("点击取消按钮！");
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
    var scrollHeight = $(window).height();
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top",(scrollHeight-bookHeight)/2);
    $(".goForget").on("click",function(){
        location.href = "fogetPsw.html" + locationSearch();
    });
    $(".subButton .confirm").click(function () {
        if (callback) {
            console.log(callback);
            callback();
        }
        console.log("点击确认按钮！");
    });
    $(".subButton .cancle").click(function () {
        console.log("点击取消按钮！");
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
        var val = parseFloat($("#"+inputId).val());
        var valArr = $("#"+inputId).val().split(".");
        if(valArr.length>1){
            if(valArr[1].length>=2){
                $("#"+inputId).val(val.toFixed(2));
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
    var bankList = '<option value="0">请选择</option>'
                    +'<option value="002" datatype="4">中国工商银行</option>'
                    +'<option value="003" datatype="M">通联-中国农业银行</option>'
                    +'<option value="004" datatype="M">通联-中国银行</option>'
                    +'<option value="011" datatype="M">通联-上海浦东发展银行</option>'
                    +'<option value="020" datatype="M">通联-兴业银行</option>'
                    +'<option value="920" datatype="M">通联-平安银行</option>'
                    +'<option value="017" datatype="M">通联-上海银行</option>'
    $("#bankSel").html("");
    $("#bankSel").prepend(bankList);
}


function trim(str){ //删除左右两端的空格
    return str.replace(/(^s*)|(s*$)/g, "");
}

/*loading框*/

function showLoading(){
    var loading = $('<div class="loadingCircle" data-loader="circle"></div>');
    var loadingBox = $('<div class="showLoading"></div>');
    loadingBox.append(loading);
    $("body").append(loadingBox);
    var scrollHeight = $(window).height();
    $(".showLoading").css("height",scrollHeight);
    var bookHeight = $(".loadingCircle").height();
    $(".loadingCircle").css("top",(scrollHeight-bookHeight)/2);
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




var args = new getArgs();
var userId = args.userId;   //用户ID  zhangsan
var merId = args.merId;     //商户ID  chenglian001
var uuid = args.uuid;       //123456
var dsCustomerNo = args.dsCustomerNo;       //zhangsan1
var tradeAccountNo = args.tradeAccountNo;
var token = args.token;     //6ddd9441c7264494abbc04d4ff92111f
var IDcardTest=/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;   //18位身份证校验
var bankTest = /^(\d{16}|\d{18}|\d{19})$/; //校验银行卡
var phoneTest = /^1[3-8]{1}\d{9}$/; //校验手机
var pswTest = /^[a-zA-Z0-9]{6,8}$/; //校验密码
var moneyTest = /^[0-9]+([.]{1}[0-9]{1,2})?$/; //校验购买金额