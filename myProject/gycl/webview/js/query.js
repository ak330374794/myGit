var loadNum = 1,listNo = 0;
var detailsArr = new Array();
$(function(){
    var tabW = $(".tab").width();
    $(".tab ul li").css("width",(tabW-2)/3);
    $(".tab ul li").click(function(){
        listNo = -1;
        $(".tab ul li").siblings().removeClass("sel");
        $(this).addClass("sel");
        var index = $(this).index();
        console.log();
        if(index == 0){
            $("#search").hide();
            $(".todayList").show();
            $(".historyList").hide();
            $(".shareList").hide();
            $(".todayList ul").html("");
            queryTradeCurrentDay(dsCustomerNo,1);
        }else if(index == 1){
            $("#search").show();
            $(".todayList").hide();
            $(".historyList").show();
            $(".shareList").hide();
            $(".historyList ul").html("");
            queryTradeHistory(dsCustomerNo,1);
        }else{
            $("#search").hide();
            $(".todayList").hide();
            $(".historyList").hide();
            $(".shareList").show();
            $(".shareList ul").html("");
            dividendQuery(dsCustomerNo,1);
        }
    });
    $("#search").click(function(){
        $(".advQuery").show();
    });
    $("#confirm").click(function(){
        listNo = -1;
        $(".advQuery").hide();
        var todayDate = new Date(new Date().getTime()).Format("yyyy-MM-dd");
        var beginDate = $("#beginTime").val();
        var endDate = $("#endTime").val();
        if(!dateCompare(beginDate,endDate)){
            errorShowAlert("开始日期不能大于结束日期");
            return false;
        }else if(!dateCompare(endDate,todayDate)){
            errorShowAlert("结束日期不能大于今天");
            return false;
        }
        var flag = $(".tab ul .sel").index();
        if(flag == 1){
            $(".historyList ul").html("");
            queryTradeHistory(dsCustomerNo,1);
        }else if(flag == 2){
            $(".shareList ul").html("");
            dividendQuery(dsCustomerNo,1);
        }
    });
    $("#cancel").click(function(){
        $("#beginTime").val("");
        $("#endTime").val("");
        $("#bankSel").val("0");
        $("#status").val("0");
        $(".advQuery").hide();
    });
    queryTradeCurrentDay(dsCustomerNo,1);
    goNextPage();
})

//当天查询
function queryTradeCurrentDay(dsCustomerNo,pageNo){
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"queryTradeCurrentDay",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            pageNo: pageNo
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){
                $(a).each(function(i,n){
                    var linkBank = n.bankName + "-" +n.bankAccountNo.substring(n.bankAccountNo.length-4);
                    var amount = "";
                    if(n.businessType == "T022"){
                        amount = n.applyAmountDisplay;
                    }else if(n.businessType == "T024" || n.businessType == "T098"){
                        amount = n.applyVolumeDisplay;
                    }
                    listNo++;
                    detailsArr[listNo] = {
                        applyNo : n.applicationNo,
                        businessName : n.businessTypeDisplay,
                        fundName : n.fundName,
                        chargeWay : n.chargeTypeDisplay,
                        applyMoney: amount,
                        fundWay : n.capitalChannelDisplay,
                        linkBank : linkBank,
                        payState : n.statusDisplay,
                        orderTime : n.transactionTimeDisplay,
                        applyTime : n.workDateDisplay,
                        conMark : n.confirmStatusDisplay,
                        note : n.workDateDisplay
                    }
                    var todayList = '<li num="'+listNo+'" data="'+ n.applicationNo+'">'
                        +'<div class="status fontSizeL">'+ n.businessTypeDisplay+'</div>'
                        +'<table class="briefInfo">'
                        +'<tr>'
                        +'<td class="td1 fontSizeS">'+ n.workDateDisplay +'</td>'
                        +'<td class="td2 fontSizeL green">'+ n.statusDisplay+'</td>'
                        +'</tr>'
                        +'<tr>'
                        +'<td class="td1"><span class="fontSizeL">'+n.fundName+'</span></td>'
                        +'<td class="td2 fontSizeL">'+ amount +'</td>'
                        +'</tr>'
                        +'</table>'
                        +'<i class="icon icon_right"></i>'
                        +'</li>';
                    $(".todayList ul").append(todayList);

                    $(".todayList ul li").unbind("click").click(function (){
                        var index = $(this).index();
                        var appNo = $(this).attr("data");
                        var objNo = $(this).attr("num");
                        //console.log(detailsArr[objNo].applyNo);
                        console.log(appNo);
                        $("h2").html("当日交易详情");
                        $("#search").hide();
                        $(".content").hide();
                        $(".contentForm").show();

                        $("#applyNo").val(detailsArr[objNo].applyNo);
                        $("#businessName").val(detailsArr[objNo].businessName);
                        $("#fundName").val(detailsArr[objNo].fundName);
                        $("#chargeWay").val(detailsArr[objNo].chargeWay);
                        $("#applyMoney").val(detailsArr[objNo].applyMoney);
                        $("#fundWay").val(detailsArr[objNo].fundWay);
                        $("#linkBank").val(detailsArr[objNo].linkBank);
                        $("#payState").val(detailsArr[objNo].payState);
                        $("#orderTime").val(detailsArr[objNo].orderTime);
                        $("#applyTime").val(detailsArr[objNo].applyTime);
                        $("#conMark").val(detailsArr[objNo].conMark);

                        $(".goBack").attr("href","");

                    });
                });
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}

//历史查询
function queryTradeHistory(dsCustomerNo,pageNo){
    var beginDate = $("#beginTime").val().replace(/-/g,"");
    var endDate = $("#endTime").val().replace(/-/g,"");
    var businessState = $("#state").val();
    var businessType = $("#status").val();
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"queryTradeHistory",
        {
            userId: userId,
            merId: merId,
            uuid: uuid,
            token: token,
            dsCustomerNo: dsCustomerNo,
            tradeAccountNo: tradeAccountNo,
            beginDate: beginDate,
            endDate: endDate,
            businessState: businessState,
            businessType: businessType,
            pageNo: pageNo
        },
        function(data){
            hideLoading();
            var a= data.data;
            if(data.resp_code=="0"){

                $(a).each(function(i,n){
                    var linkBank = n.bankName + "-" +n.bankAccountNo.substring(n.bankAccountNo.length-4);
                    var amount = "";
                    if(n.businessType == "T022"){
                        amount = n.applyAmountDisplay;
                    }else if(n.businessType == "T024" || n.businessType == "T098"){
                        amount = n.applyVolumeDisplay;
                    }
                    listNo++;
                    detailsArr[listNo] = {
                        applyNo : n.applicationNo,
                        businessName : n.businessTypeDisplay,
                        fundName : n.fundName,
                        chargeWay : n.chargeTypeDisplay,
                        applyMoney: amount,
                        fundWay : n.capitalChannelDisplay,
                        linkBank : linkBank,
                        payState : n.statusDisplay,
                        orderTime : n.transactionTimeDisplay,
                        applyTime : n.workDateDisplay,
                        conMark : n.confirmStatusDisplay,
                        note : n.workDateDisplay
                    }
                    var historyList = '<li num="'+listNo+'" data="'+ n.applicationNo+'">'
                        +'<div class="status fontSizeL">'+ n.businessTypeDisplay+'</div>'
                        +'<table class="briefInfo">'
                        +'<tr>'
                        +'<td class="td1 fontSizeS">'+ n.workDateDisplay +'</td>'
                        +'<td class="td2 fontSizeL green">'+ n.statusDisplay+'</td>'
                        +'</tr>'
                        +'<tr>'
                        +'<td class="td1"><span class="fontSizeL">'+n.fundName+'</span></td>'
                        +'<td class="td2 fontSizeL">'+ amount +'</td>'
                        +'</tr>'
                        +'</table>'
                        +'<i class="icon icon_right"></i>'
                        +'</li>';
                    $(".historyList ul").append(historyList);

                    $(".historyList ul li").unbind("click").click(function (){
                        var index = $(this).index();
                        var appNo = $(this).attr("data");
                        var objNo = $(this).attr("num");
                        console.log(detailsArr[objNo].applyNo);
                        console.log(appNo);
                        $("h2").html("历史交易详情");
                        $("#search").hide();
                        $(".content").hide();
                        $(".contentForm").show();

                        $("#applyNo").val(detailsArr[objNo].applyNo);
                        $("#businessName").val(detailsArr[objNo].businessName);
                        $("#fundName").val(detailsArr[objNo].fundName);
                        $("#chargeWay").val(detailsArr[objNo].chargeWay);
                        $("#applyMoney").val(detailsArr[objNo].applyMoney);
                        $("#fundWay").val(detailsArr[objNo].fundWay);
                        $("#linkBank").val(detailsArr[objNo].linkBank);
                        $("#payState").val(detailsArr[objNo].payState);
                        $("#orderTime").val(detailsArr[objNo].orderTime);
                        $("#applyTime").val(detailsArr[objNo].applyTime);
                        $("#conMark").val(detailsArr[objNo].conMark);

                        $(".goBack").attr("href","");

                    });
                });
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
            }
        })
}

//分红查询

function dividendQuery(dsCustomerNo,pageNo){
    var startDate = $("#beginTime").val().replace(/-/g,"");
    var endDate = $("#endTime").val().replace(/-/g,"");
    var businessState = $("#state").val();
    var businessType = $("#status").val();
    hideLoading();
    showLoading();
    $.post(
        ajaxUrl()+"dividendQuery",
        {
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
        function(data){
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
                        +'<td class="td2 fontSizeL green">'+dividendMethod+'</td>'
                        +'</tr>'
                        +'<tr>'
                        +'<td class="td1"><span class="fontSizeL">工银货币</span><span class="fontSizeS">'+ n.fundCode +'</span></td>'
                        +'<td class="td2 fontSizeL">'+ n.ocurrDividendDisplay +'</td>'
                        +'</tr>'
                        +'</table>'
                        //+'<i class="icon icon_right"></i>'
                        +'</li>';
                    $(".shareList ul").append(shareList);
                });
            }else if(data.resp_code=="-2000"){
                location.href = "personCenter.html?userId="+userId+"&merId="+merId+"&uuid="+uuid+"&dsCustomerNo="+a.dsCustomerNo+"&token="+a.token;
            }else{
                console.log(data.resp_msg);
                setErrorMsg(data.resp_code, data.resp_msg);
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

                if($(".content").css("display") == "none"){

                }else{
                    loadNum++;//刷新跳页
                    var sum = (loadNum-1)*10;
                    console.log(loadNum);
                    var flag = $(".tab ul li.sel").index();
                    if(flag == 0){
                        var length = $(".todayList ul li").length;
                        if(length<sum){

                        }else {
                            queryTradeCurrentDay(dsCustomerNo,loadNum);
                        }
                    }else if(flag == 1){
                        var length = $(".historyList ul li").length;
                        if(length<sum){

                        }else {
                            queryTradeHistory(dsCustomerNo,loadNum);
                        }
                    }else if(flag == 2){
                        var length = $(".shareList ul li").length;
                        if(length<sum){

                        }else {
                            dividendQuery(dsCustomerNo, loadNum);
                        }
                    }
                }
            }
        }
    })
}