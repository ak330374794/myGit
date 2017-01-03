/**
 * Created by ankang on 2016/9/20.
 */

$(function(){
    var headerH = $(".header").height();
    //$("body").css("padding-top",headerH);
    orient();
    //获取今天时间
    var date = new Date(new Date().getTime()).Format("yyyy-MM-dd");
    $(".icon_close").click(function(){
        $(".download").hide();
    });
    if(!token){
        $("#download").click(function(){
            if(terminal=="IOS"){
                location.href = "https://itunes.apple.com/us/app/ai-jin-rong/id1172707033?l=zh&ls=1&mt=8";
            }else{
                location.href = "http://app.qq.com/#id=detail&appid=1105771944";
            }
        });
    }
});

//竖屏
$(window).bind( 'orientationchange', function(e){
    orient();
});

//域名
function ajaxUrl(){
    var ajaxUrl = "";
    //var ajaxUrl = "http://192.168.1.125:8090/aster/";
    var protocol=document.location.protocol;//协议
    var host=document.location.host;//域名
    if(host == "localhost:8080" || host.substring(0,host.indexOf(":")) == "127.0.0.1"){
        ajaxUrl = protocol+'//'+"localhost:8080/";
        return ajaxUrl;
    }else if(host == "public.ficclink.com"){
        ajaxUrl = 'https://api.ficclink.com/aster/';
        return ajaxUrl;
    }else{
        ajaxUrl = protocol+'//'+host+"/aster/";
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
//删除提示框
function delShowAlert(callback,commentId,index,token,terminal,version){
    hideAlert();
    var showBox;
    var showBox_h='';
    showBox_h +='<div class="showBox">';
    showBox_h +='<div id="showAlert" class="showAlert">';
    showBox_h +='<div class="showContent">';
    showBox_h +='<div class="alert_title">提示</div>';
    showBox_h +='<div class="alert_info"><span class="prompt">是否删除此评论？</span></div>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="cancle">否</a><a class="confirm">是</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = window.screen.availHeight; //屏幕尺寸高度
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top","10rem");
    $(".subButton .confirm").click(function () {
        hideAlert();
        callback(commentId,index,token,terminal,version);
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


//不让form提交
$("form").submit(function () {
    return false;
});


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

var args = new getArgs();
var token = args.token;
var terminal = args.terminal;
var version = args.version;
var tag = args.tag;
var commentuseid = "";