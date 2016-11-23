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
    var date = new Date(new Date().getTime()).Format("yyyy-MM-dd");
    $.cookie("date",date);
    $.cookie('userId', userId);
    $(".todayTime span").html(date);
    $(".register a").click(function(){
        location.href = "openAccount.html"+locationSearch();
    });
})


//获取 token  dsNo
function queryIndex(){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "index",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token
        },
        dataType: 'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
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
