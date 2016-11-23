$(function(){
    var windowW = $(window).width();
    var fontS = $("html").css("font-size").replace("px","")-0;
    var formW = windowW - 2*fontS;
    var formRightW = formW-$(".formLeft").width();
    if(windowW<400){
        $(".formRight").css("width",formRightW-1);
    }else{
        $(".formRight").css("width",formRightW-2);
    }
    var dsApplicationNo = $.cookie("appNo");
    querySingleTrade(dsCustomerNo,dsApplicationNo);
    $(".goBack").click(function(){
        var tab = $.cookie("tab");
        if(tab==1){
            location.href = "query.html"+locationSearch();
        }else if(tab==2){
            location.href = "queryHistory.html"+locationSearch();
        }else if(tab==3){
            location.href = "queryRed.html"+locationSearch();
        }
    });
})

//基金详情
function querySingleTrade(dsCustomerNo,dsApplicationNo){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "querySingleTrade",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            dsApplicationNo: dsApplicationNo
        },
        dataType: 'json',
        success: function (data) {
            hideLoading();
            var a = data.data;
            if (data.resp_code == "0") {
                var tab = $.cookie("tab");
                if(tab==1){
                    $("h2").html("当日交易详情");
                }else{
                    $("h2").html("历史交易详情");
                }
                var amount = "";
                if (a.businessType == "T022") {
                    amount = a.applyAmountDisplay;
                } else if (a.businessType == "T024" || a.businessType == "T098") {
                    $(".payDisplay").hide();
                    amount = a.applyVolumeDisplay;
                }
                var linkBank = a.bankName + "-" + a.bankAccountNo.substring(a.bankAccountNo.length - 4);
                $("#applyNo").val(a.dsApplicationNo);
                $("#businessName").val(a.businessTypeDisplay);
                $("#fundName").val(a.fundName);
                $("#applyMoney").val(amount + "元");
                $("#fundWay").val(a.capitalChannelDisplay);
                $("#linkBank").val(linkBank);
                $("#payState").val(a.paymentStatusDisplay);
                $("#orderTime").val(a.transactionTimeDisplay);
                $("#applyTime").val(a.workDateDisplay);
                $("#conMark").val(a.confirmStatusDisplay);
            } else if (data.resp_code == "-2000") {
                location.href = "personCenter.html?userId=" + userId + "&merId=" + merId + "&uuid=" + uuid + "&dsCustomerNo=" + a.dsCustomerNo + "&token=" + a.token;
            } else {
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function(data){
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
