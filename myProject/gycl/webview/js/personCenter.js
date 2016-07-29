$(function(){
    $(".todayTime").html($.cookie("date"));
    var windowH = window.screen.availHeight;
    var fontS = parseFloat($("html").css("font-size").substring(0,$("html").css("font-size").length-2));
    var bodyH = $("body").height()+fontS*3.6;
    if(windowH>bodyH){
        $("html").css("height","100%");
    }
    queryFundInfo(userId,merId,uuid,token);
    getUserInfo(userId,merId,uuid,token,dsCustomerNo);
})


//查询个人收益
function getUserInfo(userId,merId,uuid,token,dsCustomerNo){
    //var username = $.cookie("username");
    //var username = "123";
    if(dsCustomerNo !=""){
        queryUserIncome(userId,merId,uuid,token,dsCustomerNo);
    }
}
function queryUserIncome(userId,merId,uuid,token,dsCustomerNo){
    hideLoading();
    showLoading();
    console.log(dsCustomerNo);
    $.post(
        ajaxUrl()+"queryUserIncome",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log(data.resp_msg);
                $(".earnings").html(a.yesterdayIncomeDisplay);
                $(".total").html(a.totalIncomeDisPlay);
                $(".marketVal").html(a.marketValueDisplay);
                $.cookie("yesterdayIncomeDisplay", a.yesterdayIncomeDisplay)
                tradeAccountQuery(userId,merId,uuid,token,dsCustomerNo,tradeAccountNo);
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
    $(".goBuy").click(function(){
        window.location.href = "fundBuy.html"+locationSearch();
    });
    $(".goCash").click(function(){
        window.location.href = "cash.html"+locationSearch();
    });
    $(".goSearch").click(function(){
        window.location.href = "query.html"+locationSearch();
    });
    $(".goAdd").click(function(){
        window.location.href = "myCard.html"+locationSearch();
    });
    $(".goChange").click(function(){
        window.location.href = "security.html"+locationSearch();
    });
}



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
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                console.log(data.resp_msg);
                $.cookie("username",a.name);
                $.cookie("certificateType",a.certificateType);
                $.cookie("certificateNo",a.certificateNo);
                $.cookie("sex",a.sex);
                $("#user span").html(a.name);
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}