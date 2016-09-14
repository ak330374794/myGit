/**
 * Created by ankang on 2016/9/13.
 */

$(function(){
    var windowW = document.body.clientWidth; //屏幕宽
    var homeBtnW = (windowW-2)/3;
    $(".homeBtn ul").css("height",homeBtnW+1);
    $(".homeBtn li").css({"width":homeBtnW,"height":homeBtnW});
    $(".homeBtn li").click(function(){
        var info="";
        var flag = $(this).index();
        if(flag==0){
            info = "确认出发“转账”操作？";
        }else if(flag==1){
            info = "确认触发“充值缴费”操作？";
        }else if(flag==2){
            info = "确认购买活期理财产品？";
        }else if(flag==3){
            info = "确认购买保险？";
        }else if(flag==4){
            info = "确认触发“还款”操作？";
        }else if(flag==5){
            info = "确认触发“商城购物”操作？";
        }else if(flag==6){
            info = "确认触发“邀请好友”操作？";
        }else if(flag==7){
            info = "确认触发“开通Apple Pay”操作？";
        }else if(flag==8){
            info = "确认触发“申请贷款”操作？";
        }
        showAlert(info);
    })
})