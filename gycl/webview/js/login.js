$(function(){
    $("#login").click(function(){
        login();
    });
    $(".forget a").click(function(){
        location.href = "fogetPsw.html" + locationSearch();
    });
    $(".register a").click(function(){
        location.href = "openAccount.html" + locationSearch();
    });
})

function login(){
    var username = $("#idCard").val().replace(/x/g, "X");
    var password = $("#password").val();

    if(username==""||username=="undefind"){
        errorShowAlert("身份证号不能为空");
        return false;
    }
    if(password==""||password=="undefind"){
        errorShowAlert("密码不能为空");
        return false;
    }/*else if($("#password").val().length<6||$("#password").val().length>8){
        errorShowAlert("密码不能为空");
    }*/
    if(!IDcardTest.test(username)){
        errorShowAlert("您输入的身份证号格式错误");
        return false;
    }
    
    hideLoading();
    showLoading();
    
    $.post(
        ajaxUrl()+"accountLogin",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            certificateType: "0",
            certificateNo: username,
            tradePassword: password
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log(data.resp_msg);
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}