 /**
 * Created by ankang on 2016/9/20.
 */
var loadNum = 1;
$(function(){
    queryFundsType();   //tab 导航条
    //queryAllFund();     //查询出所有的基金信息
    $(".netValue").click(function(){
        var that = $(this).find(".icon_arrow");
        if(that.hasClass("descending")){
            that.removeClass("descending");
            that.addClass("increase");
            rank(1,1);  //净值升序
        }else{
            that.removeClass("increase");
            that.addClass("descending");
            rank(1,2);  //净值降序
        }
    });
    $(".range").click(function(){
        var that = $(this).find(".icon_arrow");
        if(that.hasClass("descending")){
            that.removeClass("descending");
            that.addClass("increase");
            rank(2,1);  //日涨跌升序
        }else{
            that.removeClass("increase");
            that.addClass("descending");
            rank(2,2);  //日涨跌降序
        }
    });
    goNextPage();
})

function tabW(){
    var fontS = $("html").css("font-size").replace("px","")-0;
    var tabNum = $(".tabList li").length;
    var tabW = 0;
    for(var i=0;i<tabNum;i++){
        tabW += $(".tabList li").eq(i).width()-0;
    }
    $(".tabList").css("width",fontS*1.6*tabNum+tabW+2);
}

//基金类型接口 queryFundsType
function queryFundsType(){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "queryFundsType",
        data: {

        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.code == "200") {
                var a = data.data;
                $(".tabList").html("");
                var tabList = "";
                $(a).each(function(i,n){
                    tabList += '<li fundType="'+ n.fundType+'">'+ n.fundTypeName+'</li>';
                });
                var tabList1 = '<li class="sel">热门推荐</li><!--<li>我的关注</li>-->';
                $(".tabList").append(tabList1);
                $(".tabList").append(tabList);
                tabW();
                var tab = $.cookie("tab");
                if(tab==""||tab==undefined||tab==0){
                    hotSuggest();   //热门推荐
                }else{
                    $(".tabList li").removeClass("sel");
                    $(".tabList li").eq(tab).addClass("sel")
                    var fundType = $(".tabList li").eq(tab).attr("fundtype");
                    if(fundType=="2"){
                        $(".netValue span").html("万份收益");
                        $(".range span").html("七日年化收益率");
                    }else if(fundType=="9"){
                        $(".netValue span").html("每日万份收益");
                        $(".range span").html("最新年化收益率");
                    }else{
                        $(".netValue span").html("最新净值");
                        $(".range span").html("日涨跌");
                    }
                    getFundsByType(fundType,1)
                }
                $(".tabList li").click(function(){
                    loadNum = 1;
                    var fundType = $(this).attr("fundType");
                    if(fundType=="2"){
                        $(".netValue span").html("万份收益");
                        $(".range span").html("七日年化收益率");
                    }else if(fundType=="9"){
                        $(".netValue span").html("每日万份收益");
                        $(".range span").html("最新年化收益率");
                    }else{
                        $(".netValue span").html("最新净值");
                        $(".range span").html("日涨跌");
                    }
                    $(".tabList li").removeClass("sel");
                    $(this).addClass("sel");
                    var index = $(this).index();
                    if(index==0){
                        $(".fundList ul").html("");
                        hotSuggest();
                    }/*else if(index==1){
                        $(".fundList ul").html("").append("<div>暂无信息</div>");
                    }*/else{
                        $(".fundList ul").html("");
                        getFundsByType(fundType,loadNum);   //查询分类的基金信息
                    }
                });
            }else {
                setErrorMsg(data.code, data.message);
            }
        },
        error: function(data){
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.code, data.message);
            }else{
                errorShowAlert("服务器异常");
            }
        }
    })
}


//查询出所有的基金信息 queryAllFund
function queryAllFund(pageNum){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "queryAllFund",
        data: {
            pageNum: pageNum
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.code == "200") {
                var a = data.data;
                $(".fundList ul").html("");
                var fundList = "";
                $(a).each(function(i,n){
                    fundList += '<li>'
                                +'<div class="tableHead"><span class="fundName">'+ n.fundName +'</span><span class="fundCode">（'+ n.fundCode +'）</span><!--<i class="icon_heart"></i>--></div>'
                                +'<table class="tableInfo">'
                                +'<tr class="tr1">'
                                +'<td class="td1">最新净值（'+ n.navDate +'）</td>'
                                +'<td class="td2">日涨跌</td>'
                                +'</tr>'
                                +'<tr class="tr2">'
                                +'<td class="td1 red nav">'+ n.fundNav +'</td>'
                                +'<td class="td2 red flow">'+ n.dayFlow +'</td>'
                                +'</tr>'
                                +'</table>'
                                +'</li>';
                });
                $(".fundList ul").append(fundList);
                goDetail();
            }else {
                setErrorMsg(data.code, data.message);
            }
        },
        error: function(data){
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.code, data.message);
            }else{
                errorShowAlert("服务器异常");
            }
        }
    })
}


//基金分类查询接口 getFundsByType
function getFundsByType(fundType,pageNum){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "getFundsByType",
        data: {
            fundType:fundType,
            pageNum: pageNum
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.code == "200") {
                var a = data.data;
                var fundList = "";
                $(a).each(function(i,n){
                    var colorNav = "";
                    var colorFlow = "";
                    if(n.fundNav<0){
                        colorNav = "green";
                    }else{
                        colorNav = "red";
                    }
                    if((n.dayFlow.replace(/%/,"")-0)<0){
                        colorFlow = "green";
                    }else{
                        colorFlow = "red";
                    }
                    fundList += '<li>'
                        +'<div class="tableHead"><span class="fundName">'+ n.fundName +'</span><span class="fundCode">（'+ n.fundCode +'）</span><!--<i class="icon_heart"></i>--></div>'
                        +'<table class="tableInfo">'
                        +'<tr class="tr1">'
                        +'<td class="td1">最新净值（'+ n.navDate +'）</td>'
                        +'<td class="td2">日涨跌</td>'
                        +'</tr>'
                        +'<tr class="tr2">'
                        +'<td class="td1 nav '+colorNav+'">'+ n.fundNav +'</td>'
                        +'<td class="td2 flow '+colorFlow+'">'+ n.dayFlow +'</td>'
                        +'</tr>'
                        +'</table>'
                        +'</li>';
                });
                $(".fundList ul").append(fundList);
                if(fundType=="2"){
                    $(".tableInfo .tr1 .td1").html("万份收益(元)");
                    $(".tableInfo .tr1 .td2").html("七日年化收益率");
                }else if(fundType=="9"){
                    $(".tableInfo .tr1 .td1").html("每日万份收益(元)");
                    $(".tableInfo .tr1 .td2").html("最新运作期年化收益率");
                }else{
                    $(".netValue span").html("最新净值");
                    $(".range span").html("日涨跌");
                }
                goDetail();
            }else {
                setErrorMsg(data.code, data.message);
            }
        },
        error: function(data){
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.code, data.message);
            }else{
                errorShowAlert("服务器异常");
            }
        }
    })
}

//热门推荐 hotSuggest
function hotSuggest(){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "hotSuggest",
        data: {

        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.code == "200") {
                var a = data.data;
                $(".fundList ul").html("");
                var fundList = "";
                $(a).each(function(i,n){
                    var colorNav = "";
                    var colorFlow = "";
                    if(n.fundNav<0){
                        colorNav = "green";
                    }else{
                        colorNav = "red";
                    }
                    if((n.dayFlow.replace(/%/,"")-0)<0){
                        colorFlow = "green";
                    }else{
                        colorFlow = "red";
                    }
                    fundList += '<li>'
                        +'<div class="tableHead"><span class="fundName">'+ n.fundName +'</span><span class="fundCode">（'+ n.fundCode +'）</span><!--<i class="icon_heart"></i>--></div>'
                        +'<table class="tableInfo">'
                        +'<tr class="tr1">'
                        +'<td class="td1">最新净值（'+ n.navDate +'）</td>'
                        +'<td class="td2">日涨跌</td>'
                        +'</tr>'
                        +'<tr class="tr2">'
                        +'<td class="td1 nav '+colorNav+'">'+ n.fundNav +'</td>'
                        +'<td class="td2 flow '+colorFlow+'">'+ n.dayFlow +'</td>'
                        +'</tr>'
                        +'</table>'
                        +'</li>';

                });
                $(".fundList ul").append(fundList);
                goDetail();
            }else {
                setErrorMsg(data.code, data.message);
            }
        },
        error: function(data){
            hideLoading();
            if(data.statusText == "timeout"){
                errorShowAlert("请求超时");
            }else if (data.status == "200"){
                setErrorMsg(data.code, data.message);
            }else{
                errorShowAlert("服务器异常");
            }
        }
    })
}



var arrList = new Array();

//list 排序
function rank(type,data){
    var list = $(".fundList li");
    var length = list.length;
    var arr = [];
    arrList = [];
    var i= 0, j, c, d;
    for(i=0;i<length;i++){
        arrList[i] = list.eq(i);
        if(type == 1){  //1：净值排序 2：日涨跌排序
            arr[i] = list.eq(i).find(".nav").html()-0;
        }else{
            arr[i] = list.eq(i).find(".flow").html().replace(/%/,"")-0;
        }
    }
    if(data == 1){ //升序
        for(i=0;i<length;i++){
            for(j=0;j<length;j++){
                if(arr[i]<arr[j]){
                    c = arr[j];
                    arr[j] = arr[i];
                    arr[i] = c;
                    d = arrList[j];
                    arrList[j] = arrList[i];
                    arrList[i] = d;
                }
            }
        }
    }else {
        for(i=0;i<length;i++){
            for(j=0;j<length;j++){
                if(arr[i]>arr[j]){
                    c = arr[j];
                    arr[j] = arr[i];
                    arr[i] = c;
                    d = arrList[j];
                    arrList[j] = arrList[i];
                    arrList[i] = d;
                }
            }
        }
    }
    $(".fundList ul").html("").append(arrList);
    goDetail();
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
                var sum = (loadNum)*10;//第loadNum页，每页10条，应该共加载sum条
                var length = $(".fundList ul li").length;
                if(length<sum){

                }else {
                    loadNum++;//刷新跳页
                    var fundType = $(".tabList li.sel").attr("fundType");
                    getFundsByType(fundType,loadNum);
                }
            }
        }
    })
}


function goDetail(){
    $(".fundList ul li").click(function(){
        var tab = $.cookie("tab",$(".tabList .sel").index());
        var fundName = $(this).find(".fundName").html();
        var fundCode = $(this).find(".fundCode").html().substring(1,7);
        location.href = "fundDetail.html?fundName="+fundName+"&fundCode="+fundCode;
    });
    $(".fundList ul li .icon_heart").click(function(e){
        e.stopPropagation();
        if($(this).hasClass("faver")){
            $(this).removeClass("faver");
            $(this).html("收藏");
        }else{
            $(this).addClass("faver");
            $(this).html("已收藏");
        }

    });
}
