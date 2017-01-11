$(function(){
    $("#userName").html($.cookie("username"));
    //返回首页
    $(".goHome").click(function(){
        location.href = "personCenter.html"+locationSearch();
    });
    $("#addCard").click(function(){
       location.href = "addCard.html"+locationSearch();
    });
    tradeAccountQuery(userId,merId,uuid,token,dsCustomerNo,tradeAccountNo);
})


//资金来源 银行卡列表
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
        success: function(data) {
            hideLoading();
            var a = data.data;
            if (data.resp_code == "0") {
                $("#bankList").html("");
                $(a.bankAccounts).each(function (i, n) {
                    var bankList = '<li tradeNo="'+n.tradeAccountNo+'"><div class="bankName listL">' + n.paymentChannelName + '</div>' +
                        '<div class="listR"><span>尾号</span><span class="cardNo">' + n.bankAccountNo.substring(n.bankAccountNo.length - 4) + '</span></div>' +
                        '<div class="unwrapBtn" tradeNo="'+n.tradeAccountNo+'">解绑</div>'+
                        '</li>';
                    $("#bankList").append(bankList);
                });
                $(".unwrapBtn").click(function(){
                    var tradeNo = $(this).attr("tradeNo");
                    var str = '您确定要解绑'+$(this).siblings(".bankName").html()+'-'+$(this).siblings(".listR").html()+'的银行卡吗?';
                    //您确定要解除 中国招行银行-尾号4633 的银行卡吗?
                    console.log(tradeNo);
                    delCardShowAlert(str,closeAccount,tradeNo);
                });
                if ($("#bankList li").length == 0) {
                    $("#bankList").append('<div style="margin-top:4rem;font-size:1.2rem;color:#222;text-align:center;">暂无信息<div>');
                }
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

function closeAccount(tradeAccountNo){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "closeAccount",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo
        },
        dataType: 'json',
        success: function(data) {
            hideLoading();
            var a = data.data;
            if (data.resp_code == "0") {
                $("#bankList li[tradeNo="+tradeAccountNo+"]").remove();
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

//确认解绑银行卡提示框
function delCardShowAlert(str,callback,data){
    hideAlert();
    var showBox;
    var showBox_h='';
    showBox_h +='<div class="showBox">';
    showBox_h +='<div id="showAlert" class="showAlert">';
    showBox_h +='<div class="showContent">';
    showBox_h +='<div class="alert_title">提示</div>';
    showBox_h +='<div class="alert_info"><span class="prompt">'+str+'</span></div>';
    showBox_h +='</div>';
    showBox_h +='<div class="subButton"><a class="confirm">确认</a><a class="cancle">取消</a></div>';
    showBox_h +='</div>';
    showBox_h +='</div>';
    showBox = $(showBox_h);
    $("body").append(showBox);
    var scrollHeight = window.screen.availHeight;
    $(".showBox").css("height",scrollHeight);
    var bookHeight = $(".showAlert").height();
    $("#showAlert").css("top","10rem");
    $(".subButton .confirm").click(function () {
        hideAlert();
        callback(data);
    });
    $(".subButton .cancle").click(function () {
        hideAlert();
    });

}