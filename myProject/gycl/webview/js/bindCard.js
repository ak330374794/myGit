$(function(){
    setInputSession(); //缓存表单数据
    sessionStorage.setItem("code","");
    $("#name").val($.cookie("username"));
    $("#IDcard").val($.cookie("certificateNo"));
    $("#phoneNo").val($.cookie("mobilePhone"));
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
    }
    //添加银行列表
    bankList();
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
        var authapplyno = $("#code").attr("authapplyno");    //原鉴权申请号
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
        if(authapplyno == ""||authapplyno == undefined ||authapplyno == "undefined"){
            errorShowAlert("请先获取验证码");
            return false;
        }
        if(code == ""){
            errorShowAlert("验证码不能为空");
            return false;
        }
        if($(".remind").find("i").hasClass("icon_sel_n")){
            errorShowAlert("请阅读并同意交易提醒及温馨提示");
            return false;
        }
        if(bankAccountNo != $.cookie("bankAccountNo")||bankCode != $.cookie("bankCode")){
            errorShowAlert("由于银行卡信息更改，请重新获取验证码");
            $("#code").attr("authApplyNo","");
            $("#code").val("");
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
    $(".goMyCard").click(function(){
       location.href = "myCard.html" + locationSearch()
    });
})

//开户第一步
function quickAuthApply(){
    $("#code").val("");
    var name = $.cookie("username");    //投资人姓名
    var certificateType = 0;    //证件类型：身份证
    var certificateNo = $.cookie("certificateNo"); //身份证号
    var sex = $.cookie("sex");   //性别
    var bankAccountNo = $("#bankNo").val(); //银行账号
    var bankCode = $("#bankSel").val(); //银行代码
    var capitalChannelId = $("#bankSel").find("option:selected").attr("datatype");  //资金方式
    var provinceCode = $("#province").val();    //省代码
    var cityCode = $("#city").val();    //市代码
    var mobilePhone = $("#phoneNo").val();  //手机号
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
    if(provinceCode==""){
        errorShowAlert("请选择省市");
        return false;
    }
    if(cityCode==""){
        errorShowAlert("请选择市/区城市");
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
    var wait = 20;
    function time(o) {
        var that = o;
        if (wait == 0) {
            //                $("#smsCode").removeClass("gray_bj");
            $(".code").attr("class", "code");
            $(".code").removeClass("class", "gray_bj");
            $(".code").html("获取验证码");
            $(".code").attr("onclick","quickAuthApply()");
            wait = 20;
        } else {
            var  flag=setInterval(function(){
                $(".code").attr("onclick","false");
                $(".code").addClass("gray_bj");
                $(".code").html("重新发送(" + wait + ")");
                wait--;
                if(wait==0){
                    clearInterval(flag);
                    time(that);
                }
            },1000);
        }
    }
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl()+"quickAuthApply",
        data: {
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
        dataType:'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                errorShowAlert("验证码已发送，请注意查收。");
                var authApplyNo = a.authApplyNo //鉴权申请号
                var sign = a.sign   //签名
                var merId = a.merId //商户号
                var merOrderTime = a.merOrderTime   //商户订单时间
                var characterCode = a.characterCode //开户特征码
                $("#code").attr("authApplyNo",authApplyNo);
                var verifyCode = $("#code").val();
                time(this);
                $.cookie("bankCode",bankCode);
                $.cookie("bankAccountNo",bankAccountNo);
                $.cookie("name",name);
                $.cookie("certificateType",certificateType);
                $.cookie("certificateNo",certificateNo);
                $.cookie("mobilePhone",mobilePhone);
                $.cookie("sex",sex);
                $.cookie("capitalChannelId",capitalChannelId);
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

//鉴权确认
function quickAuthConfirm(authApplyNo,verifyCode){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "quickAuthConfirm",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            authApplyNo: authApplyNo,
            verifyCode: verifyCode
        },
        dataType: 'json',
        success: function (data) {
            hideLoading();
            var a = data.data;
            if (data.resp_code == "0") {
                addBankcard();
            } else {
                $("#code").attr("authApplyNo","");
                $("#code").val("");
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function (data) {
            $("#code").attr("authApplyNo","");
            $("#code").val("");
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

//增加银行卡
function addBankcard(){
    var authApplyNo = $("#code").attr("authApplyNo");  //原鉴权申请单号
    var partnerUserId = userId;    //第三方平台用户号
    var bankCode = $.cookie("bankCode");	//银行编号
    var bankAccountNo = $.cookie("bankAccountNo");	//银行账号
    var capitalChannelId = $.cookie("capitalChannelId");    //资金方式
    var provinceCode = $("#province").val();    //省代码
    var cityCode = $("#city").val();    //市代码
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl()+"addBankcard",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            authApplyNo: authApplyNo,
            partnerUserId: partnerUserId,
            bankCode: bankCode,
            bankAccountNo: bankAccountNo,
            capitalChannelId: capitalChannelId,
            provinceCode: provinceCode,
            cityCode: cityCode
        },
        dataType:'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                $.cookie("tradeAccountNo",a.tradeAccountNo);
                $.cookie("reaults",1);
                location.href = "addCardResult.html"+locationSearch();
            }else{
                $("#code").attr("authApplyNo","");
                $("#code").val("");
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function(data){
            $("#code").attr("authApplyNo","");
            $("#code").val("");
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.resp_code, data.resp_msg);
            }else{
                setErrorMsg(data.resp_code, data.resp_msg);
                //$.cookie("reaults",0);
                //location.href = "addCardResult.html"+locationSearch();
            }
        }
    })
}


