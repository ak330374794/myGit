$(function(){
    var windowW = $(".resultList").width();
    var fontSize = $("html").css("font-size").substring(0,$("html").css("font-size").length-2);
    var textW = windowW - 12*fontSize;
    $(".text").css("width",textW);
    $("#confirm").click(function(){
       location.href = "personCenter.html"+locationSearch();
    });
    buyResult();
    cashResult();
})


//申购结果
function buyResult(){
    var buyResDate = $.cookie("transactionTime").substring(0,10);
    var buyResTime = $.cookie("transactionTime").substring(11,16);
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
    var cashResTime = $.cookie("transactionTime").substring(11,16);
    var profitDay = $.cookie("profitDay");
    var profitVisibleDay = $.cookie("profitVisibleDay");
    $("#cashResDate").html(cashResDate);
    $("#cashResTime").html(cashResTime);
    $("#profitDay").html(profitDay);
    $("#profitVisibleDay").html(profitVisibleDay);
}

