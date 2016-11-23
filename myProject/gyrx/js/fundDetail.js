/**
 * Created by ankang on 2016/9/20.
 */
$(function(){
    var args = new getArgs();
    var fundName = args.fundName;
    var fundCode = args.fundCode;
    getFundDetail(fundCode);
    getFundNav(fundCode);
    $("title").html(fundName+"("+fundCode+")");
    $(".header h2").html(fundName+"("+fundCode+")");
    $(".trend").click(function(){
        $(".tableTitle div").removeClass("bgColor");
        $(this).addClass("bgColor");
        $(".chart").show();
        $(".hisTable").hide();
    });
    $(".hisValue").click(function(){
        $(".tableTitle div").removeClass("bgColor");
        $(this).addClass("bgColor");
        $(".chart").hide();
        $(".hisTable").show();
        getFundHistroyNav(fundCode,1);
    });
    $(".listName").click(function(){
        var data = $(this).attr("data");
        var showData = $(".listShow[data="+data+"]");
        if(showData.hasClass("show")){
            $(".listShow").hide().removeClass("show");
            $(".icon_arrow").removeClass("increase");
        }else{
            $(".listShow").hide().removeClass("show");
            showData.show().addClass("show");
            $(".show").click(function(){
                $(".listShow").hide().removeClass("show");
                $(".icon_arrow").removeClass("increase");
            });
            $(".icon_arrow").removeClass("increase");
            var that = $(this).find(".icon_arrow");
            if(!that.hasClass("increase")){
                that.addClass("increase");
            }
        }
    });
    $(".goBack").click(function(){
        var tab = $.cookie("tab");
        var protocol=document.location.protocol;//协议
        var host = document.location.host;//域名
        var path = document.location.pathname.replace(/fundDetail/,"allFund");//路径
        location.href = protocol+'//'+host+path;
    });
})


//基金详情 getFundDetail
function getFundDetail(fundCode){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "getFundDetail",
        data: {
            fundCode:fundCode
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.code == "200") {
                var a = data.data;
                var colorNav = "";
                var colorFlow = "";
                if(a.fundNav<0){
                    colorNav = "green";
                }else{
                    colorNav = "red";
                }
                if((a.dayFlow.replace(/%/,"")-0)<0){
                    colorFlow = "green";
                }else{
                    colorFlow = "red";
                }
                $("#feature").html(a.productFeature);
                $(".flow").html(a.dayFlow);
                $(".flow").addClass(colorFlow);
                $(".nav").html(a.fundNav);
                $(".nav").addClass(colorNav);
                $(".time").html(a.navDate);
                $(".level").html("风险等级："+a.riskLevel);
                var manager = "";
                var managerInfo = "";
                $(a.fundManager).each(function(i,n){
                    if(i<2){
                        manager += ","+n.name;
                    }else if(i==2){
                        manager = manager+"...";
                    }else{

                    }
                    managerInfo += '<li><p>'+ n.name +'</p><p>'+ n.desc+'</p></li>';
                });
                $(".manager").html(manager.substring(1));
                $(".managerInfo ul").html(managerInfo);
                $(".investGoal").html(a.investGoal);
                $(".investRange").html(a.investRange);
                $(".riskFeature").html(a.riskFeature);
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

//历史净值 getFundHistroyNav
function getFundHistroyNav(fundCode,pageNum){
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "getFundHistroyNav",
        data: {
            fundCode:fundCode,
            pageNum:pageNum
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.code == "200") {
                var a = data.data;
                $(".hisTable table").html("");
                var tableList = "";
                var tableth = "<tr><th>基金代码</th><th>日期</th><th>单位净值（元）</th><th>累计净值（元）</th></tr>";
                $(a).each(function(i,n){
                    tableList += '<tr><td>'+ n.fundCode+'</td><td>'+ n.navDate +'</td><td>'+ n.nav +'</td><td>'+ n.totalNav +'</td></tr>';
                });
                $(".hisTable table").append(tableth+tableList);
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


//基金净值接口    getFundNav
function getFundNav(fundCode) {
    hideLoading();
    showLoading();
    $.ajax({
        type: 'post',
        timeout: 60000,
        url: ajaxUrl() + "getFundNav",
        data: {
            fundCode:fundCode
        },
        async: 'false',
        dataType: 'json',
        success: function (data) {
            hideLoading();
            if (data.code == "200") {
                var a = data.data;
                var navData="";
                var nav="";
                var x =[];
                var y=[];
                $(a).each(function(i,n){
                    x.push(n.navDate);
                    y.push(n.nav);
                });
                myChart(x,y);
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

// 基于准备好的dom，初始化echarts实例
function myChart(x,y){
    console.log(y);
    var minY = toDecimal2(Math.min.apply({},y)-0.0005);
    var maxY = toDecimal2(Math.max.apply({},y)+0.0005);
    var myChart = echarts.init(document.getElementById('main'));
    var option = {
        title: {
            text: '走势图'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            splitLine: {
                show: false
            },
            data:x
        },
        yAxis : {
            //splitNumber : 10,
            offset: -10,
            min: minY,
            max: 'dataMax'
        },
        series: [{
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: y
        }]
    };
    myChart.setOption(option);
}

function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x*10000)/10000;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 4) {
        s += '0';
    }
    return s;
}