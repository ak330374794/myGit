$(function(){
    var windowW = $(".resultList").width();
    var fontSize = $("html").css("font-size").substring(0,$("html").css("font-size").length-2);
    var textW = windowW - 12*fontSize;
    $(".text").css("width",textW);
    $("#confirm").click(function(){
        location.href = "personCenter.html"+locationSearch();
    });
    $(".registerConfirm a").click(function(){
        location.href = "personCenter.html"+locationSearch();
    });
    buyResult();
    cashResult();
    results();
})

//开户绑卡结果
function results(){
    var resultText = "";
    var results = $.cookie("results");
    var pathname = document.location.pathname;
    if(results == 0){
        if(pathname.indexOf("openAccount")>0){
            resultText = '<span>开户失败</span><span>原因：网络中断</span>';
            return resultText;
        }else{
            resultText = '<span>绑卡失败</span><span>原因：网络中断</span>';
            return resultText;
        }
        $(".icon_result").removeClass("icon_succeed");
        $(".icon_result").addClass("icon_fail");
        $(".resultInfo").html(resultText);
    }
}

//申购结果
function buyResult(){
    var buyResDate = $.cookie("transactionTime").substring(0,10);
    var buyResTime = $.cookie("transactionTime").substring(11,19);
    var buyAmount = $.cookie("buyAmount");
    var profitDay = $.cookie("profitDay");
    var profitVisibleDay = $.cookie("profitVisibleDay");
    $("#buyResTime").html(buyResTime);
    $("#buyResDate").html(buyResDate);
    $("#buyAmount").html(buyAmount);
    $("#buyAmount").css({"font-weight":"normal","color":"red"});
    $("#profitDay").html(profitDay);
    $("#profitVisibleDay").html(profitVisibleDay);
}

//赎回结果
function cashResult(){
    var cashResDate = $.cookie("transactionTime").substring(0,10);
    var cashResTime = $.cookie("transactionTime").substring(11,19);
    var profitDay = $.cookie("profitDay");
    var profitVisibleDay = $.cookie("profitVisibleDay");
    var redeemType = $.cookie("redeemType");
    var workDateDisplay = $.cookie("workDateDisplay");
    $("#cashResDate").html(cashResDate);
    $("#cashResTime").html(cashResTime);
    $("#profitDay").html(profitDay);
    $("#profitVisibleDay").html(profitVisibleDay);
    if(redeemType == "redeem"){
        $(".cashResult").html("您的取现已被受理");
    }
    $(".workDate").html("（当前交易日："+workDateDisplay+"）");
}

