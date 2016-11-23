var loadNum = 1;
$(function(){
    var tabW = $(".tab").width();
    //$(".tab ul li").css("width",(tabW-2)/3);
    $(".tab ul li").click(function(){
        sessionStorage.clear();
        //清除查询cookie
        $.cookie("beginDate","");
        $.cookie("endDate","");
        $.cookie("confirmState","");
        $.cookie("businessType","");
        var index = $(this).index();
        if(index == 0){
            location.href = "query.html"+locationSearch();
        }else if(index == 1){
            location.href = "queryHistory.html"+locationSearch();
        }else{
            location.href = "queryRed.html"+locationSearch();
        }
    });
    $("#search").click(function(){
        $(".advQuery").show();
        $("h2").html("高级查询");
        var windowH = window.screen.height;
        //var contentH = window.screen.height-$(".header").height();
        var contentH = $(window).height()-$(".header").height()-$(".tab").height();
        $(".content").height(contentH).css("overflow","hidden");
        $("body").on("touchmove", function(e) {
            e.preventDefault();
        });
    });
    $("#confirm").click(function(){
        $("body").unbind("touchmove");
        //$(".content").css({"height":"auto","overflow":"auto"});
        sessionStorage.clear();
        loadNum = 1;
        var beginDate = $("#beginTime").val().replace(/-/g,"");
        var endDate = $("#endTime").val().replace(/-/g,"");
        var confirmState = $("#state").val();
        var businessType = $("#status").val();
        $(".advQuery").hide();
        $(".content").css({"height":"","overflow":""});
        $("h2").html("查询");
        var todayTime = new Date(new Date().getTime()).Format("yyyy-MM-dd");
        var beginTime = $("#beginTime").val();
        var endTime = $("#endTime").val();
        if(!dateCompare(beginTime,endTime)){
            errorShowAlert("开始日期不能大于结束日期");
            return false;
        }else if(!dateCompare(beginTime,todayTime)){
            errorShowAlert("开始日期不能大于今天");
            return false;
        }else if(!dateCompare(endTime,todayTime)){
            errorShowAlert("结束日期不能大于今天");
            return false;
        }
        var flag = $(".tab ul .sel").index();
        if(flag == 1){
            $(".historyList ul").html("");
            $.cookie("beginDate",beginDate);
            $.cookie("endDate",endDate);
            $.cookie("confirmState",confirmState);
            $.cookie("businessType",businessType);
            queryTradeHistory(dsCustomerNo,loadNum,beginDate,endDate,confirmState,businessType);
        }else if(flag == 2){
            $(".shareList ul").html("");
            dividendQuery(dsCustomerNo,1);
        }
    });
    $("#cancel").click(function(){
        $("body").unbind("touchmove");
        $("#beginTime").val("");
        $("#endTime").val("");
        $("#state").val("");
        $("#status").val("");
        $(".advQuery").hide();
        $(".content").css({"height":"","overflow":""});
        $("h2").html("查询");
    });
    $(".goBack").click(function(){
        sessionStorage.clear();
        location.href = "personCenter.html"+locationSearch();
    });
    $(".historyList ul").html("");
    var historyList = sessionStorage.getItem("historyList");
    if(historyList==""||historyList=="undefind"||historyList==null){
        queryTradeHistory(dsCustomerNo,1);
    }else{
        $(".historyList ul").html("");
        sessionPage();
    }
    goNextPage();
})

//历史查询
function queryTradeHistory(dsCustomerNo,pageNo,beginDate,endDate,confirmState,businessType){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "queryTradeHistory",
        data: {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo,
            beginDate: beginDate,
            endDate: endDate,
            confirmState: confirmState,
            businessType: businessType,
            pageNo: pageNo
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.resp_code == "0") {
                var a = data.data;
                $(a).each(function (i, n) {
                    /*var linkBank = n.bankName + "-" + n.bankAccountNo.substring(n.bankAccountNo.length - 4);*/
                    var amount = "";
                    if (n.businessType == "T022") {
                        amount = n.applyAmountDisplay;
                    } else if (n.businessType == "T024" || n.businessType == "T098") {
                        amount = n.applyVolumeDisplay;
                    }
                    var historyList = '<li data="' + n.dsApplicationNo + '">'
                        + '<div class="status fontSizeL">' + n.businessTypeDisplay + '</div>'
                        + '<table class="briefInfo">'
                        + '<tr>'
                        + '<td class="td1 fontSizeS">' + n.workDateDisplay + '</td>'
                        + '<td class="td2 fontSizeL green">' + n.confirmStatusDisplay + '</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td class="td1"><span class="fontSizeL">' + n.fundName + '</span></td>'
                        + '<td class="td2 fontSizeL">' + amount + '元</td>'
                        + '</tr>'
                        + '</table>'
                        + '<i class="icon icon_right"></i>'
                        + '</li>';

                    $(".historyList ul").append(historyList);
                    var fontS = $("html").css("font-size").replace("px","")-0;
                    var liW = $(".historyList").width();
                    var briefInfoW = liW-9.2*fontS;
                    $(".briefInfo").width(briefInfoW-1);
                    $(".historyList ul li").unbind("click").click(function () {
                        var appNo = $(this).attr("data");
                        $.cookie("appNo",appNo);
                        $.cookie("tab",2);
                        location.href = "fundDetail.html"+locationSearch();
                    });
                });
                sessionStorage.setItem("historyList",$(".historyList ul").html());
                if ($(".historyList ul li").length == 0) {
                    $(".historyList ul").append('<div style="margin-top:4rem;font-size:1.2rem;color:#222;text-align:center;">暂无信息<div>');
                }
            } else if (data.resp_code == "-2000") {
                location.href = "personCenter.html?userId=" + userId + "&merId=" + merId + "&uuid=" + uuid + "&dsCustomerNo=" + a.dsCustomerNo + "&token=" + a.token;
            } else {
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        },
        error: function(data){
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
                    loadNum=1;
                }
                console.log(loadNum);
                var sum = (loadNum)*10;
                var beginDate = $.cookie("beginDate");
                var endDate = $.cookie("endDate");
                var confirmState = $.cookie("confirmState");
                var businessType = $.cookie("businessType");
                var length = $(".historyList ul li").length;
                if(length<sum){
                    console.log(loadNum);
                    sessionStorage.setItem("page", loadNum);
                }else {
                    loadNum++;//刷新跳页
                    console.log(loadNum);
                    queryTradeHistory(dsCustomerNo,loadNum,beginDate,endDate,confirmState,businessType);
                    sessionStorage.setItem("page", loadNum);
                }

                console.log(length);
            }
        }
    })
}

//返回重新加载
function sessionPage(){
    var historyList = sessionStorage.getItem("historyList");
    $(".historyList ul").html("");
    $(".historyList ul").html(historyList);
    $(".historyList ul li").unbind("click").click(function () {
        var appNo = $(this).attr("data");
        $.cookie("appNo",appNo);
        $.cookie("tab",2);
        location.href = "fundDetail.html"+locationSearch();
    });
}
