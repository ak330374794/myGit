/**
 * Created by ankang on 2016/9/13.
 */
$(function(){
    $("#loginBtn").click(function(){
        $(".before").hide();
        $(".after").show();
        $(".loginOut").show();
    });
    $("#loginOut").click(function(){
        $(".before").show();
        $(".after").hide();
        $(".loginOut").hide();
    });
    $(".signBtn").click(function(){
        alert("签到");
    });
    $(".mylist ul li").click(function(){
        var flag = $(this).index();
        if(flag==0){
            location.href = "myquest.html";
        }else if(flag==1){
            location.href = "coupon.html";
        }
    });
})