$(function(){
    clearCookie();  //清楚cookie;
    var windowH = window.screen.availHeight;
    var fontS = parseFloat($("html").css("font-size").substring(0,$("html").css("font-size").length-2));
    var bodyH = $("body").height()+fontS*3.6;
    if(windowH>bodyH){
        $("html").css("height","100%");
    }
    queryFundInfo(userId,merId,uuid,token);
    queryIndex();
    $.cookie('userId', userId);
    $(".register a").click(function(){
        window.location.href = "openAccount.html"+locationSearch();
    });
    $(".login a").click(function(){
        window.location.href = "login.html"+locationSearch();
    });
    
})


//获取 token  dsNo
function queryIndex(){
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"index",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log(data.resp_msg);
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
                $.cookie("token",a.token);
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        }
    )
}
