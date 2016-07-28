$(function(){
    $("#name").val($.cookie("username"));
    $("#IDcard").val($.cookie("certificateNo"));
    var windowW = $(window).width();
    var fontS = parseFloat($("html").css("font-size").substring(0,$("html").css("font-size").length-2));
    var formW = windowW - 2*fontS;
    var formRightW = formW-$(".formLeft").width()-1;
    var codeW = $(".code").width();
    if(windowW<400){
        $(".formRight").css("width",formRightW);
        $("#code").css("width",formRightW-codeW+fontS);
    }else{
        $(".formRight").css("width",formRightW-1);
        $("#code").css("width",formRightW-codeW+fontS);
        $(".code").css("right",-fontS-1);
    };
    //有效期选择
    $(".timeSel .icon_circle").click(function(){
        $(".timeSel i").removeClass("active");
        $(this).addClass("active");
        if($(this).attr("data")==2){
            $(".indate").show();
        }else{
            $(".indate").hide();
        }
    });
    //性别选择
    $(".sexSel .icon_circle").click(function(){
        $(".sexSel i").removeClass("active");
        $(this).addClass("active");
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
    $("#next").click(function(){
        var bankAccountNo = $("#bankNo").val(); //银行账号
        var bankCode = $("#bankSel").val(); //银行代码
        var mobilePhone = $("#phoneNo").val();  //手机号
        var code = $("#code").val();    //验证码
        if(bankAccountNo == ""){
            errorShowAlert("银行卡号不能为空");
            return false;
        }
        if(!bankTest.test(bankAccountNo)){
            errorShowAlert("您输入的银行卡号格式不正确");
            return false;
        }
        if($("#bankSel").val()==0){
            errorShowAlert("请选择银行");
            return false;
        }
        if(mobilePhone == ""){
            errorShowAlert("手机号不能为空");
            return false;
        }
        if(!phoneTest.test(mobilePhone)){
            errorShowAlert("您输入的手机格式不正确");
            return false;
        }
        if(code == ""){
            errorShowAlert("验证码不能为空");
            return false;
        }
        var authApplyNo = $("#code").attr("authApplyNo"); //原鉴权申请号
        quickAuthConfirm(authApplyNo,code);
    });

    //开户完成
    $(".registerFin a").click(function(){
        var pswTest = /[0-9a-zA-Z]{6,8}/;
        var password1 = $("#password1").val();
        var password2 = $("#password2").val();

        if(password1==""){
            errorShowAlert("交易密码不能为空");
            return false;
        }
        if(!pswTest.test(password1) || !pswTest.test(password2)){
            errorShowAlert("您输入的密码格式不正确");
            return false;
        }
        addBankcard(password1);
    });
    $(".registerConfirm a").click(function(){
        location.href = "personCenter.html"+locationSearch();
    });
})

//开户第一步
function quickAuthApply(){
    var name = $.cookie("username");    //投资人姓名
    var certificateType = 0;    //证件类型：身份证
    var certificateNo = $.cookie("certificateNo"); //身份证号
    var sex = $.cookie("sex");   //性别
    var bankAccountNo = $("#bankNo").val(); //银行账号
    var bankCode = $("#bankSel").val(); //银行代码
    var capitalChannelId = $("#bankSel").find("option:selected").attr("datatype");  //资金方式
    var mobilePhone = $("#phoneNo").val();  //手机号
    var code = $("#code").val();    //验证码
    if(name == ""){
        errorShowAlert("真实姓名不能为空");
        return false;
    }
    if(certificateNo == ""){
        errorShowAlert("身份证号不能为空");
        return false;
    }
    if(!IDcardTest.test(certificateNo)){
        errorShowAlert("您输入的身份证格式不正确");
        return false;
    }
    if(bankAccountNo == ""){
        errorShowAlert("银行卡号不能为空");
        return false;
    }
    if(!bankTest.test(bankAccountNo)){
        errorShowAlert("您输入的银行卡号格式不正确");
        return false;
    }
    if($("#bankSel").val()==0){
        errorShowAlert("请选择银行");
        return false;
    }
    if(mobilePhone == ""){
        errorShowAlert("手机号不能为空");
        return false;
    }
    if(!phoneTest.test(mobilePhone)){
        errorShowAlert("您输入的手机格式不正确");
        return false;
    }
    var wait = 60;
    function time(o) {
        var that = o;
        if (wait == 0) {
            //                $("#smsCode").removeClass("gray_bj");
            $(".code").attr("class", "code");
            $(".code").removeClass("class", "gray_bj");
            $(".code").html("获取验证码");
            $(".code").attr("onclick","quickAuthApply()");
            wait = 60;
        } else {
            //                $("#smsCode").addClass("gray_bj");
            //var wait=120;
            var  flag=setInterval(function(){
                //do
                //
                $(".code").attr("onclick","false");
                $(".code").addClass("gray_bj");
                $(".code").html("重新发送(" + wait + ")");
                wait--;
                if(wait==0){
                    clearInterval(flag);
                    //showAlert("如果您未能正常收入短信,请拨打客服电话400-6262-818联系我们");
                    time(that);
                }

            },1000);

        }
    }
    hideLoading();
    showLoading();
    console.log("鉴权申请");
    $.post(
        ajaxUrl()+"quickAuthApply",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            bankCode: bankCode,
            bankAccountNo: bankAccountNo,
            name: name,
            certificateType: certificateType,
            certificateNo: certificateNo,
            mobilePhone: mobilePhone,
            sex: sex,
            authType: 0,
            capitalChannelId: capitalChannelId
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log("鉴权申请成功，发送验证码");
                console.log(data.resp_msg);
                errorShowAlert("验证码已发送，请注意查收。");
                var authApplyNo = a.authApplyNo //鉴权申请号
                var sign = a.sign   //签名
                var merId = a.merId //商户号
                var merOrderTime = a.merOrderTime   //商户订单时间
                var characterCode = a.characterCode //开户特征码
                $("#code").attr("authApplyNo",authApplyNo);
                var verifyCode = $("#code").val();
                time(this);
                console.log(authApplyNo);
                $.cookie("bankCode",bankCode);
                $.cookie("bankAccountNo",bankAccountNo);
                $.cookie("name",name);
                $.cookie("certificateType",certificateType);
                $.cookie("certificateNo",certificateNo);
                $.cookie("mobilePhone",mobilePhone);
                $.cookie("sex",sex);
                $.cookie("capitalChannelId",capitalChannelId);
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}

//鉴权确认
function quickAuthConfirm(authApplyNo,verifyCode){
    hideLoading();
    showLoading();
    console.log("鉴权确认");
    $.post(
        ajaxUrl()+"quickAuthConfirm",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            authApplyNo: authApplyNo,
            verifyCode: verifyCode
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log("鉴权确认成功");
                console.log(data.resp_msg);
                $.cookie("authApplyNo",authApplyNo);
                addBankcard();
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}

//增加银行卡
function addBankcard(){
    var authApplyNo = $.cookie("authApplyNo");  //原鉴权申请单号
    var partnerUserId = userId    //第三方平台用户号
    var bankCode = $.cookie("bankCode");	//银行编号
    var bankAccountNo = $.cookie("bankAccountNo");	//银行账号
    var capitalChannelId = $.cookie("capitalChannelId");    //资金方式
    console.log("开户接口");
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"addBankcard",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            authApplyNo: authApplyNo,
            partnerUserId: partnerUserId,
            bankCode: bankCode,
            bankAccountNo: bankAccountNo,
            capitalChannelId: capitalChannelId
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log("开户成功");
                $.cookie("tradeAccountNo",a.tradeAccountNo);
                location.href = "addCardResult.html"+locationSearch()+"$token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}

