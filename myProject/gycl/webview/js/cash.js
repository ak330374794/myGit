$(function(){
    setInputSession(); //缓存表单数据
    $("#user span").html($.cookie("username"));
    $(".earnings").html($.cookie("yesterdayIncomeDisplay"));
    var bankName = $.cookie("bankName");
    var bankNo = $.cookie("bankNo");
    var balanceDisplay = $.cookie("balanceDisplay");
    var balance = $.cookie("balance");
    $(".backBank").html(bankName+"-"+bankNo);  //到账银行
    $(".balance").html(balanceDisplay);
    //同意协议
    $(".remind i").click(function(){
       if($(this).hasClass("icon_sel_y")){
           $(this).removeClass("icon_sel_y");
           $(this).addClass("icon_sel_n");
       }else{
           $(this).removeClass("icon_sel_n");
           $(this).addClass("icon_sel_y");
       }
    });
    //返回首页
    $(".goHome").click(function(){
        location.href = "personCenter.html"+locationSearch();
    });
    //返回cash首页
    $(".backCash").click(function(){
        location.href = "cash.html"+locationSearch();
    });
    //温馨提示跳转
    $(".position").click(function(){
        location.href = "prompt.html";
    });
    //取现方式
    $(".cashSel").click(function(){
        $(".cashSel i").removeClass("active");
        $(this).find(".icon_circle").addClass("active");
        if($(".active").attr("data")==0){
            $(".remind").hide();
            $("#quik").hide();
        }else{
            $(".remind").show();
            $("#quik").show();
        }
    });
    $("#goCash").click(function(){
        var backMoney = $("#backMoney").val();
        var fundName = $(".fundName").text();
        var balance = parseFloat($.cookie("balance"));
        if(backMoney==""||backMoney=="undefined"){
            setErrorMsg(4); //不能为空
        }else if(backMoney<=0){
            setErrorMsg(5); //不能小于0元
        }else if(backMoney>balance){
            setErrorMsg(3); //取现金额不能大于可用金额
        }else{
            if($(".active").attr("data")==1){
                if($(".remind").find("i").hasClass("icon_sel_n")){
                    errorShowAlert("请阅读并同意相关协议");
                    return false;
                }
            }
            cashApply();//申请赎回
        }
    });
    //赎回银行显示
    var backBankW = $(".form div").width() - $(".left").width();
    $(".backBank").css("width",backBankW);
    var backBankH = $(".backBank").height();
    $(".bankHeight").css("height",backBankH);
    inputVal("backMoney");
    queryFundInfo(userId,merId,uuid,token);
    queryRedeemList(userId,merId,uuid,token,dsCustomerNo);  //赎回列表
})
//赎回列表
function queryRedeemList(userId,merId,uuid,token,dsCustomerNo){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl()+"queryRedeemList",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo, //基金公司客户账号
        },
        dataType:'json',
        success:function(data){
            hideLoading();
            var a= data.data;
            $(".cashList ul").html("");
            if(data.resp_code=="0"){
                var cashSum = 0;
                $(data.data).each(function(i,n){
                    var cashList = '<li><div class="td3"><div class="overflow"><span class="gray">到账银行：</span><span class="bankName">'+n.bankName+'</span><span class="bankNo">-'+n.bankAccountNo.substring(n.bankAccountNo.length-4)+'</span></div><div class="balance"><span class="gray">可用金额：</span><span class="red">'+n.availableVolumeDisplay+'元</span></div></div>'
                                    +'<div class="td5 cashBtn" data-volume="'+n.availableVolume+'" data-volumeDisplay="'+ n.availableVolumeDisplay+'" tradeAccountNo="'+n.tradeAccountNo+'">取现</div></li>';
                    $(".cashList ul").append(cashList);
                    cashSum += parseFloat(n.availableVolume);
                });
                if ($(".cashList ul li").length == 0) {
                    $(".cashList ul").append('<div style="margin-top:4rem;font-size:1.2rem;color:#222;text-align:center;">暂无信息<div>');
                }
                //可用余额计算
                $(".balanceSum").html(cashSum.toFixed(2));
                //跳转赎回申请
                $(".cashList .cashBtn").click(function(){
                    var num = $(this).parent("li").index();
                    var bankName = $(this).siblings().find(".bankName").text();
                    var bankNo = $(this).siblings().find(".bankNo").text();
                    var balanceDisplay = $(this).attr("data-volumeDisplay");
                    var balance = $(this).attr("data-volume");
                    var tradeAccountNo = $(this).attr("tradeAccountNo");
                    location.href = "cashApply.html"+locationSearch();
                    $.cookie("bankName",bankName);
                    $.cookie("bankNo",bankNo);
                    $.cookie("balanceDisplay",balanceDisplay);
                    $.cookie("balance",balance);
                    $.cookie("tradeAccountNo",tradeAccountNo);
                });
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                $.cookie("token",a.token);
            }else{
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

//申请赎回
function cashApply(){
    var flag = 2; //判断赎回
    var redeemType = "";//取现方式
    var tradeAccountNo = ("tradeAccountNo");
    var backMoney = $("#backMoney").val();
    if($(".active").parent().index()==1){
        redeemType = "quickRedeem";
    }else{
        redeemType = "redeem";
    }
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl()+"redeemApply",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo,  //交易账号
            amount: backMoney,   //申购金额
            redeemType: redeemType  //赎回类型
        },
        dataType:'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                showAlert(flag,a.redeemAmountDisplay,a.fundName,enterCode,redeemConfirm);
                $.cookie("applicationNo",a.applicationNo);
                $.cookie("redeemAmount",a.redeemAmount);
                $.cookie("redeemType",a.redeemType);
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                $.cookie("token",a.token);
            }else{
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

function redeemConfirm(){
    var tradeAccountNo = $.cookie("tradeAccountNo");
    var redeemAmount = $.cookie("redeemAmount");
    var redeemType = $.cookie("redeemType");
    var applicationNo = $.cookie("applicationNo");
    var certificateType = $.cookie("certificateType");
    var certificateNo = $.cookie("certificateNo");
    var passWord = $("#password").val();    //用户密码
    if(passWord == "" || passWord == "undefined"){
        errorShowAlert("交易密码不能为空");
        return false;
    }else{
        hideLoading();
        showLoading();
        $.ajax({
            type: 'post',
            timeout: 60000,
            url: ajaxUrl()+"redeemConfirm",
            data: {
                userId: userId,
                merId: merId,
                uuid: uuid,
                token: token,
                dsCustomerNo: dsCustomerNo,
                tradeAccountNo: tradeAccountNo,
                amount: redeemAmount,
                redeemType: redeemType,
                applicationNo: applicationNo,
                tradePassword: passWord,
                certificateType: certificateType,
                certificateNo: certificateNo
            },
            dataType: 'json',
            success: function(data){
                hideLoading();
                var a= data.data;
                if(data.resp_code=="0"){
                    window.location.href = "cashResult.html"+locationSearch();
                    $.cookie("transactionTime",a.transactionTimeDisplay);
                    $.cookie("workDateDisplay",a.workDateDisplay);
                }else if(data.resp_code=="-2000"){
                    location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                    $.cookie("token",a.token);
                }else{
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
}