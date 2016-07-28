$(function(){
    $("#next").click(function(){
        var oldPsw1 = $("#oldPsw1").val();
        var newPsw1 = $("#newPsw1").val();
        var newPsw2 = $("#newPsw2").val();
        if(oldPsw1==""){
            errorShowAlert("旧密码不能为空");
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
        if(newPsw1 != newPsw2){
            errorShowAlert("两次密码输入不一致");
            return false;
        }
        if(!pswTest.test(oldPsw1) || !pswTest.test(newPsw1) || !pswTest.test(newPsw2)){
            errorShowAlert("请输入6-8位数字或字母");
            return false;
        }
        changePassword(oldPsw1,newPsw1,newPsw2);
    });
});


function changePassword(oldPsw1,newPsw1,newPsw2){
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl() + "changePassword",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            originTradePassword: oldPsw1,
            newTradePassword: newPsw1,
            repeatTradePassword: newPsw2
            
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                location.href = "pswResult.html"+locationSearch();
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                $.cookie("token",a.token);
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}