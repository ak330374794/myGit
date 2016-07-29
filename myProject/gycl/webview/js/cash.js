$(function(){
    $("#user span").html($.cookie("username"));
    $(".earnings").html($.cookie("yesterdayIncomeDisplay"));
    var bankName = $.cookie("bankName");
    var balanceDisplay = $.cookie("balanceDisplay");
    var balance = $.cookie("balance");
    $(".backBank").html(bankName);  //到账银行
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
    //取现方式
    $(".cashSel").click(function(){
        $(".cashSel i").removeClass("active");
        $(this).find(".icon_circle").addClass("active");
    });
    $("#goCash").click(function(){
        var backMoney = parseFloat($("#backMoney").val());
        var fundName = $(".fundName").text();
        var balance = parseFloat($.cookie("balance"));
        if(backMoney==""||backMoney=="undefined"){
            setErrorMsg(1); //不能为空
        }else if(backMoney<=0){
            setErrorMsg(2); //不能小于0元
        }else if(backMoney>balance){
            setErrorMsg(3); //取现金额不能大于可用金额
        }else{
            cashApply();//申请赎回
        }
    });
    inputVal("backMoney");
    queryFundInfo(userId,merId,uuid,token);
    queryRedeemList(userId,merId,uuid,token,dsCustomerNo);  //赎回列表
})
//赎回列表
function queryRedeemList(userId,merId,uuid,token,dsCustomerNo){
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"queryRedeemList",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo, //基金公司客户账号
        },
        function(data){
            hideLoading();
            var a= data.data;
            $(".cashList ul").html("");
            if(data.resp_code=="0"){
                var cashSum = 0;
                $(data.data).each(function(i,n){
                    var cashList = '<li><div class="td3"><span class="bankName">'+n.bankName+'</span><span class="bankNo">'+n.bankAccountNo.substring(n.bankAccountNo.length-4)+'</span></div>'
                                    +'<div class="td4 balance">'+n.availableVolumeDisplay+'</div>'
                                    +'<div class="td5 cashBtn" data-volume="'+n.availableVolume+'" data-volumeDisplay="'+ n.availableVolumeDisplay+'" tradeAccountNo="'+n.tradeAccountNo+'">取现</div></li>';
                    $(".cashList ul").prepend(cashList);
                    cashSum += parseFloat(n.availableVolume);
                });
                //可用余额计算
                $(".balanceSum").html(cashSum.toFixed(2));
                //跳转赎回申请
                $(".cashList .cashBtn").click(function(){
                    var num = $(this).parent("li").index();
                    console.log(num);
                    var bankName = $(this).siblings().children(".bankName").text();
                    var balanceDisplay = $(this).attr("data-volumeDisplay");
                    var balance = $(this).attr("data-volume");
                    var tradeAccountNo = $(this).attr("tradeAccountNo");
                    location.href = "cashApply.html"+locationSearch();
                    $.cookie("bankName",bankName);
                    $.cookie("balanceDisplay",balanceDisplay);
                    $.cookie("balance",balance);
                    $.cookie("tradeAccountNo",tradeAccountNo);
                });
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                $.cookie("token",a.token);
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}

//申请赎回
function cashApply(){
    var flag = 2; //判断赎回
    var redeemType = "";//取现方式
    var tradeAccountNo = ("tradeAccountNo");
    var backMoney = $("#backMoney").val().replace(/\b(0+)/gi,"");
    if($(".active").parent().index()==1){
        redeemType = "quickRedeem";
    }else{
        redeemType = "redeem";
    }
    console.log(redeemType);
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"redeemApply",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo,  //交易账号
            amount: backMoney,   //申购金额
            redeemType: redeemType  //赎回类型
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                showAlert(flag,a.redeemAmountDisplay,a.fundName,enterCode,redeemConfirm);
                $.cookie("applicationNo",a.applicationNo);
                $.cookie("redeemAmount",a.redeemAmount);
                $.cookie("redeemType",a.redeemType);
                console.log(data.resp_msg);
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                $.cookie("token",a.token);
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
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
        $.post(
            ajaxUrl()+"redeemConfirm",
            {
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
            function(data){
                hideLoading();
                var a= data.data;
                if(data.resp_code=="0"){
                    window.location.href = "cashResult.html"+locationSearch();
                    $.cookie("transactionTime",a.transactionTimeDisplay);
                    console.log(data.resp_msg);
                }else if(data.resp_code=="-2000"){
                    location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                    $.cookie("token",a.token);
                }else{
                    console.log(data.resp_msg);
                    setErrorMsg(data.resp_code, data.resp_msg);
                }
            })
    }
}