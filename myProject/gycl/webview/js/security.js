$(function(){
    $("#next").click(function(){
        var oldPsw1 = $("#oldPsw1").val().trim();
        var newPsw1 = $("#newPsw1").val().trim();
        var newPsw2 = $("#newPsw2").val().trim();
        if(oldPsw1==""){
            errorShowAlert("旧密码不能为空");
            return false;
        }
        if(!pswTest.test(oldPsw1)){
            errorShowAlert("旧密码需要6-8位");
            return false;
        }
        if(newPsw1==""){
            errorShowAlert("新密码不能为空");
            return false;
        }
        if(newPsw2==""){
            errorShowAlert("确认新密码不能为空");
            return false;
        }
        if(!pswTest.test(newPsw1)){
            errorShowAlert("新密码需要6-8位数字或字母");
            return false;
        }
        if(!pswTest.test(newPsw2)){
            errorShowAlert("确认密码需要6-8位数字或字母");
            return false;
        }
        if(newPsw1 != newPsw2){
            errorShowAlert("两次密码输入不一致");
            return false;
        }
        changePassword(oldPsw1,newPsw1,newPsw2);
    });
});


function changePassword(oldPsw1,newPsw1,newPsw2){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "changePassword",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            originTradePassword: oldPsw1,
            newTradePassword: newPsw1,
            repeatTradePassword: newPsw2
        },
        dataType: 'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                location.href = "pswResult.html"+locationSearch();
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