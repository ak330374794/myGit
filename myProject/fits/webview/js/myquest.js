/**
 * Created by ankang on 2016/9/14.
 */
$(function(){
    myquest();
})

function myquest(){
    $(".questRight").on("click",function(){
        var data = $(this).find(".progress").attr("data");
        if(data==1){
            alert("领取奖励");
        }else{
            var str1 = "条件";
            var str2 = "奖励";
            questShowAlert(str1,str2);
        }
    });
}