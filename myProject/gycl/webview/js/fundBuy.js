$(function(){
    $("#user span").html($.cookie("username"));
	var windowH = $(window).height();
	if(windowH<=480){
		$(".logo").hide();
	}
    $("#bankSel").change(function(){
        var bankSel = $(this).val();
        console.log(bankSel);
    });
    $(".remind i").click(function(){
       if($(this).hasClass("icon_sel_y")){
           $(this).removeClass("icon_sel_y");
           $(this).addClass("icon_sel_n");
       }else{
           $(this).removeClass("icon_sel_n");
           $(this).addClass("icon_sel_y");
       }
    });
    $("#goBuy").click(function(){
        var fundMoney = parseFloat($("#buyMoney").val());
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
    $.post(
        ajaxUrl()+"tradeAmountLimitQuery",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            businessType: "T022",
            customerType: "1"
        },
        function(data){
            console.log(token);
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log(data.resp_msg);
                $("#buyMoney").attr("placeholder","您购买的最小限额为"+a.firstLowRound);
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}

//资金来源
//通过基金公司客户账号查询已经开通的交易账号和绑定的银行卡信息
function tradeAccountQuery(userId,merId,uuid,token,dsCustomerNo,tradeAccountNo){
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"tradeAccountQuery",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo
        },
        function(data){
            console.log(token);
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log(data.resp_msg);
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
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}

//申购申请
function buyApply(){
    var flag = 1; //判断购买
    var tradeAccountNo = $("#bankAccounts :selected").attr("trno");
    var fundMoney = parseFloat($("#buyMoney").val());
    if(!moneyTest.test(fundMoney)||fundMoney<=0){
        errorShowAlert("充值金额不合规范，请重新输入！");
        return false;
    }
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"buyApply",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo,  //交易账号
            amount: fundMoney   //申购金额
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                showAlert(flag,a.buyAmountDisplay,a.fundName,enterCode,buyConfirm);
                $.cookie("applicationNo",a.applicationNo);
                $.cookie("buyAmount",a.buyAmount);
                $.cookie("tradeAccountNo",a.tradeAccountNo);
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
//申购确认
function buyConfirm(){
    var tradeAccountNo = $.cookie("tradeAccountNo");
    var applicationNo = $.cookie("applicationNo");
    var buyAmount = $.cookie("buyAmount");
    var passWord = $("#password").val();    //用户密码
    var certificateType = $.cookie("certificateType");
    var certificateNo = $.cookie("certificateNo");
    if(passWord == "" || passWord == "undefined"){
        
    }else{
        hideLoading();
        showLoading();
        $.post(
            ajaxUrl()+"buyConfirm",
            {
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
            function(data){
                hideLoading();
                var a= data.data;
                if(data.resp_code=="0"){
                    window.location.href = "buyResult.html"+locationSearch();
                    $.cookie("transactionTime",a.transactionTimeDisplay);
                    $.cookie("profitDay",a.profitDay);
                    $.cookie("profitVisibleDay",a.profitVisibleDay);
                    console.log(data.resp_msg);
                }else if(data.resp_code=="-2000"){
                    location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                    $.cookie("token",a.token);
                }else{
                    console.log(data.resp_msg);
                    hideAlert();
                    setErrorMsg(data.resp_code, data.resp_msg);
                }
            })
    }
}

