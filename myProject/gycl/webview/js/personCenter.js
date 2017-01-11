$(function(){
    sessionStorage.clear();
    $(".todayTime").html($.cookie("date"));
    var windowH = window.screen.availHeight;
    var fontS = parseFloat($("html").css("font-size").substring(0,$("html").css("font-size").length-2));
    var bodyH = $("body").height()+fontS*3.6;
    if(windowH>bodyH){
        $("html").css("height","100%");
    }
    queryFundInfo(userId,merId,uuid,token);
    getUserInfo(userId,merId,uuid,token,dsCustomerNo);
})

//查询个人收益
function getUserInfo(userId,merId,uuid,token,dsCustomerNo){
    if(dsCustomerNo !=""){
        queryUserIncome(userId,merId,uuid,token,dsCustomerNo);
    }
}
function queryUserIncome(userId,merId,uuid,token,dsCustomerNo){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "queryUserIncome",
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
            if (data.resp_code == "0") {
                $(".earnings").html(a.yesterdayIncomeDisplay);
                $(".total").html(a.totalIncomeDisPlay);
                $(".marketVal").html(a.marketValueDisplay);
                $.cookie("yesterdayIncomeDisplay", a.yesterdayIncomeDisplay)
                tradeAccountQuery(userId, merId, uuid, token, dsCustomerNo, tradeAccountNo);
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
    $(".goBuy").click(function(){
        $.cookie("btnType",1);
        window.location.href = "fundBuy.html"+locationSearch();
    });
    $(".goCash").click(function(){
        $.cookie("btnType",2);
        window.location.href = "cash.html"+locationSearch();
    });
    $(".goSearch").click(function(){
        window.location.href = "query.html"+locationSearch();
    });
    $(".goAdd").click(function(){
        window.location.href = "myCard.html"+locationSearch();
    });
    $(".goChange").click(function(){
        window.location.href = "security.html"+locationSearch();
    });
}



//通过基金公司客户账号查询已经开通的交易账号和绑定的银行卡信息
function tradeAccountQuery(userId,merId,uuid,token,dsCustomerNo,tradeAccountNo){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "tradeAccountQuery",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo
        },
        dataType: 'json',
        success: function (data) {
            hideLoading();
            var a = data.data;
            if (data.resp_code == "0") {
                $.cookie("username", a.name);
                $.cookie("certificateType", a.certificateType);
                $.cookie("certificateNo", a.certificateNo);
                $.cookie("sex", a.sex);
                $.cookie("mobilePhone", a.mobilePhone);
                $("#user span").html(a.name);
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