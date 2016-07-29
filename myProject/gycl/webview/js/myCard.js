$(function(){
    $("#userName").html($.cookie("username"));
    $("#addCard").click(function(){
       location.href = "addCard.html"+locationSearch();
    });
    tradeAccountQuery(userId,merId,uuid,token,dsCustomerNo,tradeAccountNo);
})


//资金来源 银行卡列表
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
                $("#bankList").html("");
                $(a.bankAccounts).each(function(i,n){
                    var bankList = '<li><div class="bankName listL">'+n.paymentChannelName+'</div><div class="listR"><span>尾号</span><span class="cardNo">'+ n.bankAccountNo.substring(n.bankAccountNo.length-4)+'</span></div></li>';
                    $("#bankList").append(bankList);
                });
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}


//添加银行卡
function addBankcard(){

}