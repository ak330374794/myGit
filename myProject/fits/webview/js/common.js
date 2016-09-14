/**
 * Created by ankang on 2016/9/13.
 */
$(function(){
    var windowW = document.body.clientWidth; //屏幕宽
    var footBtnML = (windowW-2*$(".footBtn li").width())/3;
    $(".footBtn ul li").css("margin-left",footBtnML);
    $("#headset").click(function(){
       alert("耳机");
    });
    $("#QRcode").click(function(){
        alert("二维码");
    });
    $(".footBtn li").click(function(){
        $(".footBtn li").removeClass("footSel");
        $(this).addClass("footSel");
        var flag = $(this).index();
        if(flag==0){
            location.href = "homepage.html";
        }else{
            location.href = "myaccount.html";
        }
    });
})

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
    $("#showAlert").css("top","14rem");
    $(".subButton .sure").click(function () {
        hideAlert();//购买基金接口
        if(callback){
            callback();
        }
    });
}

//确认购买提示框
function showAlert(info,callback1,callback2){
    var showBox;
    var showBox_h='';
    showBox_h +='<div class="showBox">';
    showBox_h +='<div id="showAlert" class="showAlert">';
    showBox_h +='<div class="showContent">';
    //var title = "";
    //showBox_h +='<div class="alert_title">'+title+'</div>';
    showBox_h +='<div class="alert_info"><span>'+info+'</span></div>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="confirm">确认</a><a class="cancle">取消</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = window.screen.availHeight;
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top","14rem");
    $(".subButton .confirm").click(function () {
        hideAlert();
        if(callback1){
            callback1(callback2);
        }
    });
    $(".subButton .cancle").click(function () {
        hideAlert();
    });

}

//任务提示框
function questShowAlert(str1,str2,callback){
    hideAlert();
    var showBox;
    var showBox_h='';
    showBox_h +='<div class="showBox">';
    showBox_h +='<div id="showAlert" class="showAlert">';
    showBox_h +='<div class="showContent">';
    showBox_h +='<div class="alert_title">完成条件：</div>';
    showBox_h +='<div class="quest_info"><span class="questPrompt">'+str1+'</span></div>';
    showBox_h +='<div class="alert_title">获得奖励：</div>';
    showBox_h +='<div class="quest_info"><span class="questPrompt">'+str2+'</span></div>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="sure">完成</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = window.screen.availHeight; //屏幕尺寸高度
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top","14rem");
    $(".subButton .sure").click(function () {
        hideAlert();//购买基金接口
        if(callback){
            callback();
        }
    });
}


//去掉提示框
function hideAlert() {
    if ($(".showBox")) {
        $(".showBox").remove();
    }
}