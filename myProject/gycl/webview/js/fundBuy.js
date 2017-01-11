$(function(){
    setInputSession(); //缓存表单数据
    $("#user span").html($.cookie("username"));
	var windowH = $(window).height();
	if(windowH<=480){
		$(".logo").hide();
	}
    //返回首页
    $(".goHome").click(function(){
        location.href = "personCenter.html"+locationSearch();
    });
    $("#bankSel").change(function(){
        var bankSel = $(this).val();
    });
    $("#goBuy").click(function(){
        var fundMoney = $("#buyMoney").val();
        var bankAccounts = $("#bankAccounts").val();
        var fundName = $(".fundName").text();
        var referrer = $("#referrer").val();
        if(fundMoney==""||fundMoney=="undefined"){
            setErrorMsg(1); //不能为空
        }else if(fundMoney<=0){
            setErrorMsg(2); //不能小于0元
        }else if(bankAccounts==""){
            errorShowAlert("请选择资金来源");
        }else{
            buyApply();
        }
    });
    inputVal("buyMoney");
    queryFundInfo(userId,merId,uuid,token);
    tradeAccountQuery(userId,merId,uuid,token,dsCustomerNo,tradeAccountNo);
    tradeAmountLimitQuery();
})


//购买基金限额
function tradeAmountLimitQuery(){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "tradeAmountLimitQuery",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            businessType: "T022",
            customerType: "1"
        },
        dataType: 'json',
        success: function (data) {
            hideLoading();
            var a = data.data;
            if (data.resp_code == "0") {
                $("#buyMoney").attr("placeholder", "您购买的最小限额为" + a.firstLowRound);
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

//资金来源
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
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                $("#bankAccounts").html("");
                $("#bankAccounts").append('<option value="">请选择资金来源</option>');
                $(a.bankAccounts).each(function(i,n){
                    var bankList = '<option value="'+n.paymentChannelId+'" trNo="'+n.tradeAccountNo+'">'+n.paymentChannelName+'-'+ n.bankAccountNo.substring(n.bankAccountNo.length-4)+'</option>';
                    $("#bankAccounts").append(bankList);
                });
                $.cookie("certificateType",a.certificateType);
                $.cookie("certificateNo",a.certificateNo);
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function (data) {
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

//申购申请
function buyApply(){
    var flag = 1; //判断购买
    var tradeAccountNo = $("#bankAccounts :selected").attr("trno");
    var fundMoney = $("#buyMoney").val();
    if(!moneyTest.test(fundMoney)||fundMoney<=0){
        errorShowAlert("充值金额不合规范，请重新输入！");
        return false;
    }
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "buyApply",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo,  //交易账号
            amount: fundMoney   //申购金额
        },
        dataType: 'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                showAlert(flag,a.buyAmountDisplay,a.fundName,enterCode,buyConfirm);
                $.cookie("applicationNo",a.applicationNo);
                $.cookie("buyAmount",a.buyAmount);
                $.cookie("tradeAccountNo",a.tradeAccountNo);
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
//申购确认
function buyConfirm(){
    var tradeAccountNo = $.cookie("tradeAccountNo");
    var applicationNo = $.cookie("applicationNo");
    var buyAmount = $.cookie("buyAmount");
    var passWord = $("#password").val();    //用户密码
    var certificateType = $.cookie("certificateType");
    var certificateNo = $.cookie("certificateNo");
    if(passWord == "" || passWord == "undefined"){
        errorShowAlert("密码不能为空");
    }else{
        hideLoading();
        showLoading();
        $.ajax({
            type: 'post',
            timeout: 60000,
            url: ajaxUrl() + "buyConfirm",
            data: {
                userId: userId,
                merId: merId,
                uuid: uuid,
                token: token,
                dsCustomerNo: dsCustomerNo,
                tradeAccountNo: tradeAccountNo, //交易账号
                applicationNo: applicationNo,    //申请单号
                amount: buyAmount,  //申购金额
                tradePassword: passWord, //交易密码
                certificateType: certificateType,
                certificateNo: certificateNo
            },
            dataType: 'json',
            success: function (data) {
                hideLoading();
                var a = data.data;
                if (data.resp_code == "0") {
                    window.location.href = "buyResult.html" + locationSearch();
                    $.cookie("transactionTime", a.transactionTimeDisplay);
                    $.cookie("profitDay", a.profitDay);
                    $.cookie("profitVisibleDay", a.profitVisibleDay);
                } else if (data.resp_code == "-2000") {
                    location.href = "personCenter.html?userId=" + userId + "&merId=" + merId + "&uuid=" + uuid + "&dsCustomerNo=" + a.dsCustomerNo + "&token=" + a.token;
                    $.cookie("token", a.token);
                } else {
                    hideAlert();
                    setErrorMsg(data.resp_code, data.resp_msg);
                }
            },
            error: function(data){
                hideLoading();
                console.log(data.status);
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

