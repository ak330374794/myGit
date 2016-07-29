$(function(){
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
        var name = $("#name").val();    //投资人姓名
        var certificateType = 0;    //证件类型：身份证
        var certificateNo = $("#IDcard").val().replace(/x/g, "X"); //身份证号
        var sex = $(".sexSel i.active").attr("data");   //性别
        var bankAccountNo = $("#bankNo").val(); //银行账号
        var bankCode = $("#bankSel").val(); //银行代码
        var mobilePhone = $("#phoneNo").val();  //手机号
        var code = $("#code").val();    //验证码
        if(name == ""){
            errorShowAlert("真实姓名不能为空");
            return false;
        }
        if(name.length < 2){
            errorShowAlert("真实姓名不能少于2个字");
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
        if($(".timeSel .active").attr("data")==2){
            var todayDate = new Date(new Date().getTime()).Format("yyyy-MM-dd");
            var endTime = $("#endTime").val();
            if(endTime == ""|| endTime == "undefined"){
                errorShowAlert("请选择身份证有效截止日期");
                return false;
            }
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
        if(code == ""){
            errorShowAlert("验证码不能为空");
            return false;
        }
        var authApplyNo = $("#code").attr("authApplyNo"); //原鉴权申请号
        quickAuthConfirm(authApplyNo,code);
    });
    
    //跳转填写交易密码页面
    $(".registerSec a").click(function(){
        var postCodeTest = /[1-9]\d{5}(?!\d)/;
        var emailTest = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        var provinceCode = $("#province").val();
        var cityCode = $("#city").val();
        var address = $("#address").val();
        var postCode = $("#postalcode").val();
        var email = $("#email").val();
        if(provinceCode==""){
            errorShowAlert("请选择省市");
            return false;
        }
        if(cityCode==""){
            errorShowAlert("请选择市/区城市");
            return false;
        }
        if(!postCode==""){
            if(!postCodeTest.test(postCode)){
                errorShowAlert("您输入的邮政编码格式不正确");
                return false;
            }
        }
        if(!email==""){
            if(!emailTest.test(email)){
                errorShowAlert("您输入的邮箱格式不正确");
                return false;
            }
        }
        
        $.cookie("provinceCode",provinceCode);
        $.cookie("cityCode",cityCode);
        $.cookie("address",address);
        $.cookie("postCode",postCode);
        $.cookie("email",email);
        location.href = "openAccountFinal.html"+locationSearch();
    });
    //开户完成
    $(".registerFin a").click(function(){
        var password1 = $("#password1").val();
        var password2 = $("#password2").val();

        if(password1==""){
            errorShowAlert("交易密码不能为空");
            return false;
        }
        if(password2==""){
            errorShowAlert("确认密码不能为空");
            return false;
        }
        if(!pswTest.test(password1) || !pswTest.test(password2)){
            errorShowAlert("您输入的密码格式不正确");
            return false;
        }
        if(password1 != password2){
            errorShowAlert("两次密码输入不一致");
            return false;
        }
        openFinal(password1);
    });
    $(".registerConfirm a").click(function(){
        location.href = "personCenter.html"+locationSearch();
    });
})

//开户第一步
function quickAuthApply(){
    var name = $("#name").val();    //投资人姓名
    var certificateType = 0;    //证件类型：身份证
    var certificateNo = $("#IDcard").val().replace(/x/g, "X"); //身份证号
    var sex = $(".sexSel i.active").attr("data");   //性别
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
    if($(".timeSel .active").attr("data")==2){
        var todayDate = new Date(new Date().getTime()).Format("yyyy-MM-dd");
        var endTime = $("#endTime").val();
        if(endTime == ""|| endTime == "undefined"){
            errorShowAlert("请选择身份证有效截止日期");
            return false;
        }else if(!dateCompare(todayDate, endTime)){
            errorShowAlert("请选择合理的证件有效期");
            return false;
        }
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
                location.href = "openAccountInfo.html"+locationSearch();
                $.cookie("authApplyNo",authApplyNo);
                if($(".timeSel .active").attr("data")==1){
                    $.cookie("certificateValidEver",1);
                }else{
                    var idValidDate = $("#endTime").val().replace(/-/g,"");
                    $.cookie("certificateValidEver",0);
                    $.cookie("idValidDate",idValidDate);
                }
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}


function openFinal(password1){
    var authApplyNo = $.cookie("authApplyNo");  //原鉴权申请单号
    var partnerUserId = userId    //第三方平台用户号
    var bankCode = $.cookie("bankCode");	//银行编号
    var bankAccountNo = $.cookie("bankAccountNo");	//银行账号
    var capitalChannelId = $.cookie("capitalChannelId");    //资金方式
    var provinceCode = $.cookie("provinceCode");	//省代码
    var cityCode = $.cookie("cityCode");	//市代码
    var name = $.cookie("name");	//姓名
    var mobilePhone = $.cookie("mobilePhone");	//手机号
    var certificateType = $.cookie("certificateType");	//证件类型
    var certificateNo = $.cookie("certificateNo");	//证件号码
    var idValidDate = $.cookie("idValidDate");	//证件有效期
    var certificateValidEver = $.cookie("certificateValidEver");    //是否证件是否长期有效
    var sex = $.cookie("sex");	//性别
    var email = $.cookie("email");	//邮箱
    var address = $.cookie("address");	//通讯地址
    var postCode = $.cookie("postCode");	//邮政编码
    var birthday = $.cookie("certificateNo").substring(6,14);   //出生日期
    
    console.log("开户接口");
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"openAccount",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            authApplyNo: authApplyNo,
            partnerUserId: partnerUserId,
            bankCode: bankCode,
            bankAccountNo: bankAccountNo,
            capitalChannelId: capitalChannelId,
            provinceCode: provinceCode,
            cityCode: cityCode,
            password: password1,
            name: name,
            mobilePhone: mobilePhone,
            certificateType: certificateType,
            certificateNo: certificateNo,
            idValidDate: idValidDate,
            certificateValidEver: certificateValidEver,
            birthday: birthday,
            sex: sex,
            email: email,
            address: address,
            postCode: postCode,

        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log("开户成功");
                $.cookie("tradeAccountNo",a.tradeAccountNo);
                location.href = "openAccountResult.html"+locationSearch()+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}


