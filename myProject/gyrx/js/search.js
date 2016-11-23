/**
 * Created by ankang on 2016/9/23.
 */
var loadNum = 1;
$(function(){
    $("#search").bind('input propertychange', function(){
        $(".icon_clear").show().click(function(){
            $("#search").val("");
            $(".icon_clear").hide();
        });
        var keyWords = $(this).val();
        queryFundsByKeyWords(keyWords,1);
    });
    $(".goBack").click(function(){
        var protocol=document.location.protocol;//协议
        var host = document.location.host;//域名
        var path = document.location.pathname.replace(/fundSearch/,"allFund");//路径
        location.href = protocol+'//'+host+path;
    });
    $(".cancel").click(function(){
        var protocol=document.location.protocol;//协议
        var host = document.location.host;//域名
        var path = document.location.pathname.replace(/fundSearch/,"allFund");//路径
        location.href = protocol+'//'+host+path;
    });
    goNextPage();
})


//基金搜索接口    queryFundsByKeyWords
function queryFundsByKeyWords(keyWords,pageNum){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "queryFundsByKeyWords",
        data: {
            keyWords: keyWords,
            pageNum: pageNum
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.code == "200") {
                var a = data.data;
                $(".searchList ul").html("");
                var searchList = "";
                $(a).each(function(i,n){
                    searchList += '<li><table class="tableInfo">'
                                 +'<tr class="tr1">'
                                 +'<td class="td1 fundName">'+ n.fundName +'</td>'
                                 +'<td class="td2 fundNav">'+ n.fundNav +'</td>'
                                 +'</tr>'
                                 +'<tr class="tr2">'
                                 +'<td class="td1 red fundCode">'+ n.fundCode+'</td>'
                                 +'<td class="td2 red time">'+ n.navDate +'</td>'
                                 +'</tr>'
                                 +'</table>'
                                 +'<i class="icon icon_arrow"></i></li>';
                });
                $(".searchList ul").append(searchList);
                $(".searchList ul li").click(function(){
                    var fundName = $(this).find(".fundName").html();
                    var fundCode = $(this).find(".fundCode").html();
                    location.href = "fundDetail.html?fundName="+fundName+"&fundCode="+fundCode;
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
                var sum = (loadNum)*5;
                var length = $(".historyList ul li").length;
                if(length<=sum){

                }else {
                    loadNum++;//刷新跳页
                    var keyWords = $("#search").val();
                    queryFundsByKeyWords(keyWords,loadNum);
                }
            }
        }
    })
}