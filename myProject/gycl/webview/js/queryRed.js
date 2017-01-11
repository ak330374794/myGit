var loadNum = 1;
$(function(){
    var tabW = $(".tab").width();
    //$(".tab ul li").css("width",(tabW-2)/3);
    $(".tab ul li").click(function(){
        sessionStorage.clear();
        var index = $(this).index();
        if(index == 0){
            location.href = "query.html"+locationSearch();
        }else if(index == 1){
            location.href = "queryHistory.html"+locationSearch();
        }else{
            location.href = "queryRed.html"+locationSearch();

        }
    });
    $(".goBack").click(function(){
        sessionStorage.clear();
        location.href = "personCenter.html"+locationSearch();
    });
    $(".shareList ul").html("");
    dividendQuery(dsCustomerNo,1);
    goNextPage();
})

//分红查询
function dividendQuery(dsCustomerNo,pageNo){
    /*var startDate = $("#beginTime").val().replace(/-/g,"");
    var endDate = $("#endTime").val().replace(/-/g,"");
    var businessState = $("#state").val();
    var businessType = $("#status").val();*/
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "dividendQuery",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo,
            fundCode: "",
            /*startDate: startDate,
            endDate: endDate,*/
            countPerPage: 10,
            pageNo: pageNo
        },
        dataType: 'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                $(a).each(function(i,n){
                    var dividendMethod;
                    if(n.dividendMethod == 0){
                        dividendMethod = "红利再投资";
                    }else if(n.dividendMethod == 1){
                        dividendMethod = "现金分红";
                    }
                    var shareList = '<li>'
                        +'<div class="status fontSizeL">分红</div>'
                        +'<table class="briefInfo briefInfo1">'
                        +'<tr>'
                        +'<td class="td1 fontSizeS">'+ n.ocurrDateDisplay +'</td>'
                        +'<td class="td2 fontSizeL red">'+dividendMethod+'</td>'
                        +'</tr>'
                        +'<tr>'
                        +'<td class="td1"><span class="fontSizeL">工银货币</span><span class="fontSizeS">'+ n.fundCode +'</span></td>'
                        +'<td class="td2 fontSizeL">'+ n.ocurrDividendDisplay +'元</td>'
                        +'</tr>'
                        +'</table>'
                        +'</li>';
                    $(".shareList ul").append(shareList);
                });
                if($(".shareList ul li").length == 0){
                    $(".shareList ul").append('<div style="margin-top:4rem;font-size:1.2rem;color:#222;text-align:center;">暂无信息<div>');
                }
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
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







//滚动到底时加载数据
function goNextPage(){
    $(window).scroll(function(){
        var o = $("body");
        if(o!=null && o.length !=0){
            //获取网页的完整高度(fix)
            var height= $(document).height();
            //获取浏览器高度(fix)
            var clientHeight =$(window).height();

            //获取网页滚过的高度(dynamic)
            var top= window.pageYOffset || (document.compatMode == 'CSS1Compat' ? document.documentElement.scrollTop :	document.body.scrollTop);

            //当 top+clientHeight = scrollHeight的时候就说明到底儿了
            if((height > clientHeight)&&(top>=(parseInt(height)-clientHeight))){
//				alert("go to next page");
                console.log(loadNum);
                var sum = (loadNum)*10;
                var length = $(".shareList ul li").length;
                if(length<sum){
                    console.log(loadNum);
                }else {
                    loadNum++;//刷新跳页
                    console.log(loadNum);
                    dividendQuery(dsCustomerNo, loadNum);
                }
                console.log(length);
            }
        }
    })
}

/*

function sessionPage(page){
    console.log(!page);
    var i=1;
    if(page){
        for(i=1;i<=page;i++){
            dividendQuery(dsCustomerNo,i);
        }
    }
}*/
