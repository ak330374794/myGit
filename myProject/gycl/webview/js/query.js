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
    //返回首页
    $(".goBack").click(function(){
        sessionStorage.clear();
       location.href = "personCenter.html"+locationSearch();
    });
    $(".todayList ul").html("");
    var todayList = sessionStorage.getItem("todayList");
    if(todayList==""||todayList=="undefind"||todayList==null){
        queryTradeCurrentDay(dsCustomerNo,1);
    }else{
        sessionPage();
    }
    goNextPage();
})

//当天查询
function queryTradeCurrentDay(dsCustomerNo,pageNo){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "queryTradeCurrentDay",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            pageNo: pageNo
        },
        async: 'false',
        dataType: 'json',
        success: function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                $(a).each(function(i,n){
                    var amount = "";
                    if(n.businessType == "T022"){
                        amount = n.applyAmountDisplay;
                    }else if(n.businessType == "T024" || n.businessType == "T098"){
                        amount = n.applyVolumeDisplay;
                    }
                    var todayList = '<li data="'+ n.dsApplicationNo+'">'
                        +'<div class="status fontSizeL">'+ n.businessTypeDisplay+'</div>'
                        +'<table class="briefInfo">'
                        +'<tr>'
                        +'<td class="td1 fontSizeS">'+ n.workDateDisplay +'</td>'
                        +'<td class="td2 fontSizeL green">'+ n.confirmStatusDisplay+'</td>'
                        +'</tr>'
                        +'<tr>'
                        +'<td class="td1"><span class="fontSizeL">'+n.fundName+'</span></td>'
                        +'<td class="td2 fontSizeL">'+ amount +'元</td>'
                        +'</tr>'
                        +'</table>'
                        +'<i class="icon icon_right"></i>'
                        +'</li>';
                    $(".todayList ul").append(todayList);
                    var fontS = $("html").css("font-size").replace("px","")-0;
                    var liW = $(".todayList").width();
                    var briefInfoW = liW-9.2*fontS;
                    $(".briefInfo").css("width",briefInfoW-1);
                    $(".todayList ul li").unbind("click").click(function (){
                        var appNo = $(this).attr("data");
                        $.cookie("appNo",appNo);
                        $.cookie("tab",1);
                        location.href = "fundDetail.html"+locationSearch();
                    });
                });
                sessionStorage.setItem("todayList",$(".todayList ul").html());
                if($(".todayList ul li").length == 0){
                    $(".todayList ul").append('<div style="margin-top:4rem;font-size:1.2rem;color:#222;text-align:center;">暂无信息<div>');
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
                loadNum = sessionStorage.getItem("page");
                if(loadNum==""||loadNum=="undefind"||loadNum==null){
                    loadNum = 1;
                }
                console.log(loadNum);
                var sum = (loadNum)*10;
                var length = $(".todayList ul li").length;
                if(length<sum){
                    console.log(loadNum);
                    sessionStorage.setItem("page", loadNum);
                }else {
                    loadNum++;//刷新跳页
                    console.log(loadNum);
                    queryTradeCurrentDay(dsCustomerNo,loadNum);
                    sessionStorage.setItem("page", loadNum);
                }
                console.log(length);
            }
        }
    })
}

//返回重新加载
function sessionPage(){
    var todayList = sessionStorage.getItem("todayList");
    $(".todayList ul").html("");
    $(".todayList ul").html(todayList);
    $(".todayList ul li").unbind("click").click(function (){
        var appNo = $(this).attr("data");
        $.cookie("appNo",appNo);
        $.cookie("tab",1);
        location.href = "fundDetail.html"+locationSearch();
    });
}